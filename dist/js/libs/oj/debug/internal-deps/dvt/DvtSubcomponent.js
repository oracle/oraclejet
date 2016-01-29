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
 * Base attribute groups handler.
 * @class
 * @constructor
 */
var DvtAttrGroups = function() {};

DvtObj.createSubclass(DvtAttrGroups, DvtObj, 'DvtAttrGroups');


/**
 * Returns the mapping for the specified group or value.
 * @param {object} value The group or value whose mapping will be retrieved.
 * @return {object} The corresponding value along the ramp.
 */
DvtAttrGroups.prototype.get = function(value) {
  // subclasses must override
};
/**
 * Discrete attribute groups handler.
 * @class
 * @constructor
 * @extends {DvtAttrGroups}
 */
var DvtDiscreteAttrGroups = function() {
  this._results = new Array();
};

DvtObj.createSubclass(DvtDiscreteAttrGroups, DvtAttrGroups, 'DvtDiscreteAttrGroups');


/**
 * Adds a mapping to this object.
 * @param {string} group The id for the group.
 * @param {string} groupLabel The label for the group.
 * @param {object} params
 */
DvtDiscreteAttrGroups.prototype.add = function(group, groupLabel, params) {
  this._results.push({group: group, groupLabel: groupLabel, params: params});
};


/**
 * Returns the mapping for the specified group.
 * @param {object} group The group whose mapping will be retrieved.
 * @return {object} The parameters object
 */
DvtDiscreteAttrGroups.prototype.get = function(group) {
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
DvtDiscreteAttrGroups.prototype.getMappingsArray = function() {
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
 * @extends {DvtAttrGroups}
 */
var DvtContinuousAttrGroups = function(minValue, maxValue, minLabel, maxLabel, ramp) {
  this._minValue = minValue;
  this._maxValue = maxValue;
  this._minLabel = minLabel ? minLabel : this._minValue;
  this._maxLabel = maxLabel ? maxLabel : this._maxValue;
  this._ramp = ramp;

  // Cache the range for performance
  this._range = this._maxValue - this._minValue;
};

DvtObj.createSubclass(DvtContinuousAttrGroups, DvtAttrGroups, 'DvtContinuousAttrGroups');


/**
 * Returns the mapping for the specified value.
 * @param {object} value The value whose mapping will be retrieved.
 * @return {object} The corresponding value along the ramp.
 */
DvtContinuousAttrGroups.prototype.get = function(value) {
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
DvtContinuousAttrGroups.prototype.getRamp = function() {
  return this._ramp.slice(0);
};


/**
 * Returns the label for the minimum bounds.
 * @return {string}
 */
DvtContinuousAttrGroups.prototype.getMinLabel = function() {
  return this._minLabel;
};


/**
 * Returns the label for the maximum bounds.
 * @return {string}
 */
DvtContinuousAttrGroups.prototype.getMaxLabel = function() {
  return this._maxLabel;
};


/**
 * Returns the value between the specified parameters at the specified percent.
 * @param {object} a
 * @param {object} b
 * @param {number} percent The percent between a and b.
 * @return {object} The value at the specified percent between a and b.
 */
DvtContinuousAttrGroups.prototype._calcValue = function(a, b, percent) {
  // Note: Only color is supported by continuous attribute groups in this release.
  return DvtColorUtils.interpolateColor(a, b, percent);
};
/**
 * Legend rendering utilities for attribute groups components.
 * @class
 */
var DvtLegendAttrGroupsRenderer = function() {};

DvtObj.createSubclass(DvtLegendAttrGroupsRenderer, DvtObj, 'DvtLegendAttrGroupsRenderer');

/** @private @const */
DvtLegendAttrGroupsRenderer._LEGEND_MAX_HEIGHT = 0.4;
/** @private @const */
DvtLegendAttrGroupsRenderer._CONTINUOUS_GROUP_GAP = 1;
/** @private @const */
DvtLegendAttrGroupsRenderer._CONTINUOUS_ITEM_WIDTH = 50;
/** @private @const */
DvtLegendAttrGroupsRenderer._CONTINUOUS_ITEM_HEIGHT = 10;
/** @private @const */
DvtLegendAttrGroupsRenderer._CONTINUOUS_ITEM_GAP = 5;
/** @private @const */
DvtLegendAttrGroupsRenderer._LABEL_SIZE = 11;
/** @private @const */
DvtLegendAttrGroupsRenderer._LABEL_COLOR = '#636363';
/** @private @const */
DvtLegendAttrGroupsRenderer._LABEL_VALUE_COLOR = '#333333';


/**
 * Performs layout and rendering for an attribute groups object.
 * @param {DvtContext} context
 * @param {DvtEventManager} eventManager
 * @param {DvtContainer} container The legend container.
 * @param {number} availWidth The available horizontal space.
 * @param {number} availHeight The available vertical space.
 * @param {DvtAttrGroups} attrGroups An attribute groups describing the colors.
 * @return {DvtDisplayable} The rendered contents.
 */
DvtLegendAttrGroupsRenderer.renderAttrGroups = function(context, eventManager, container, availWidth, availHeight, attrGroups, styles) {
  var colorContainer = null;
  if (attrGroups) {
	  if (attrGroups instanceof DvtContinuousAttrGroups)
	    colorContainer = DvtLegendAttrGroupsRenderer._renderAttrGroupsContinuous(context, eventManager, container, availWidth, availHeight, attrGroups, styles);
	  else if (attrGroups instanceof DvtDiscreteAttrGroups)
	    colorContainer = DvtLegendAttrGroupsRenderer._renderAttrGroupsDiscrete(context, eventManager, container, availWidth, availHeight, attrGroups, styles);
  }
  return colorContainer;
};


/**
 * Performs layout and rendering for continuous attribute groups.
 * @param {DvtContext} context
 * @param {DvtEventManager} eventManager
 * @param {DvtContainer} container The legend container.
 * @param {number} availWidth The available horizontal space.
 * @param {number} availHeight The available vertical space.
 * @param {DvtAttrGroups} attrGroups An attribute groups describing the colors.
 * @return {DvtDisplayable} The rendered contents.
 */
DvtLegendAttrGroupsRenderer._renderAttrGroupsContinuous = function(context, eventManager, container, availWidth, availHeight, attrGroups, styles) {
  // Create a container for this item
  var isRTL = DvtAgent.isRightToLeft(context);
  var labelY = DvtLegendAttrGroupsRenderer._CONTINUOUS_ITEM_HEIGHT / 2 + DvtLegendAttrGroupsRenderer._CONTINUOUS_GROUP_GAP;
  var colorContainer = new DvtContainer(context);
  container.addChild(colorContainer);

  // Min Label
  var minLabelStr = attrGroups.getMinLabel();
  var minLabel = new DvtOutputText(context, minLabelStr, 0, labelY);
  minLabel.setCSSStyle(styles.labelStyle);
  minLabel.alignMiddle();
  colorContainer.addChild(minLabel);

  // Gradient
  var gradientRect = new DvtRect(context, 0, DvtLegendAttrGroupsRenderer._CONTINUOUS_GROUP_GAP, DvtLegendAttrGroupsRenderer._CONTINUOUS_ITEM_WIDTH, DvtLegendAttrGroupsRenderer._CONTINUOUS_ITEM_HEIGHT);
  var ramp = isRTL ? attrGroups.getRamp().slice().reverse() : attrGroups.getRamp();
  gradientRect.setFill(new DvtLinearGradientFill(0, ramp));
  if (styles.borderColor)
    gradientRect.setSolidStroke(styles.borderColor);

  colorContainer.addChild(gradientRect);
  var gradientWidth = DvtLegendAttrGroupsRenderer._CONTINUOUS_ITEM_WIDTH + DvtLegendAttrGroupsRenderer._CONTINUOUS_ITEM_GAP;

  // Max Label
  var maxLabelStr = attrGroups.getMaxLabel();
  var maxLabel = new DvtOutputText(context, maxLabelStr, 0, labelY);
  maxLabel.setCSSStyle(styles.labelStyle);
  maxLabel.alignMiddle();
  colorContainer.addChild(maxLabel);

  // Position the labels and the rectangle
  if (isRTL) {
    // BIDI
    var maxLabelWidth = maxLabel.measureDimensions().w + DvtLegendAttrGroupsRenderer._CONTINUOUS_ITEM_GAP;
    gradientRect.setTranslateX(maxLabelWidth);
    minLabel.setX(maxLabelWidth + gradientWidth);
  }
  else {
    // Non-BIDI
    var minLabelWidth = minLabel.measureDimensions().w + DvtLegendAttrGroupsRenderer._CONTINUOUS_ITEM_GAP;
    gradientRect.setTranslateX(minLabelWidth);
    maxLabel.setX(minLabelWidth + gradientWidth);
  }

  // Add a tooltip to the gradient rectangle
  var tooltip = minLabelStr + ' - ' + maxLabelStr;
  eventManager.associate(gradientRect, new DvtSimpleObjPeer(tooltip));

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
 * @param {DvtContext} context
 * @param {DvtEventManager} eventManager
 * @param {DvtContainer} container The legend container.
 * @param {number} availWidth The available horizontal space.
 * @param {number} availHeight The available vertical space.
 * @param {DvtAttrGroups} attrGroups An attribute groups describing the colors.
 * @return {DvtDisplayable} The rendered contents.
 */
DvtLegendAttrGroupsRenderer._renderAttrGroupsDiscrete = function(context, eventManager, container, availWidth, availHeight, attrGroups, styles) {
  var ret = new DvtContainer(context);
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
  var component = DvtLegend.newInstance(context);
  component.setId(null);
  ret.addChild(component);

  // Layout the legend and get the preferred size
  var maxLegendHeight = availHeight * DvtLegendAttrGroupsRenderer._LEGEND_MAX_HEIGHT;
  var preferredDims = component.getPreferredSize(legendOptions, availWidth, maxLegendHeight);
  component.render(legendOptions, availWidth, preferredDims.h);

  // Add a transparent background for the legend so that calling getDimensions on it
  // will return the full size with the gaps.
  var actualDims = component.getContentDimensions();
  var rect = new DvtRect(context, 0, 0, actualDims.w, preferredDims.h);
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
var DvtBreadcrumbsDrillEvent = function(id) {
  this.Init(DvtBreadcrumbsDrillEvent.TYPE);
  this._id = id;
};

DvtObj.createSubclass(DvtBreadcrumbsDrillEvent, DvtBaseComponentEvent, 'DvtBreadcrumbsDrillEvent');

DvtBreadcrumbsDrillEvent.TYPE = 'breadcrumbsDrill';


/**
 * Returns the id of the item that was drilled.
 * @return {string} The id of the item that was drilled.
 */
DvtBreadcrumbsDrillEvent.prototype.getId = function() {
  return this._id;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * Breadcrumbs component.
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @param {object} options The object containing options specifications for this component.
 * @class
 * @constructor
 * @extends {DvtContainer}
 * @implements {DvtComponentKeyboardHandler}
 */
var DvtBreadcrumbs = function(context, callback, callbackObj, options) {
  this.Init(context, callback, callbackObj, options);
};

DvtObj.createSubclass(DvtBreadcrumbs, DvtContainer, 'DvtBreadcrumbs');


/**
 * Initializes the component.
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @param {object} options The object containing options specifications for this component.
 * @protected
 */
DvtBreadcrumbs.prototype.Init = function(context, callback, callbackObj, options) {
  DvtBreadcrumbs.superclass.Init.call(this, context);
  this.setOptions(options);

  // Create the event handler and add event listeners
  this._eventHandler = new DvtBreadcrumbsEventManager(this, context, callback, callbackObj);
  this._eventHandler.addListeners(this);

  // Make sure the object has an id for clipRect naming
  this.setId('breadcrumbs' + 1000 + Math.floor(Math.random() * 1000000000));//@RandomNumberOk

  // index of the breadcrumb with keyboard focus. index is used to find the
  // Object stored in the _data object's item field
  this._curCrumbIdx = -1;

  // the DvtRect we use to show which breadcrumb has keyboard focus
  this._keyboardFocusRect = null;
  this._crumbs = null;
};


/**
 * Specifies the non-data options for this component.
 * @param {object} options The object containing options specifications for this component.
 * @protected
 */
DvtBreadcrumbs.prototype.setOptions = function(options) {
  this._options = DvtBreadcrumbsDefaults.calcOptions(options);
};


/**
 * Renders the component with the specified data.  If no data is supplied to a component
 * that has already been rendered, the component will be re-rendered to the specified size.
 * @param {object} data The object containing data for this component.
 * @param {number} width The width of the component.
 */
DvtBreadcrumbs.prototype.render = function(data, width) 
{
  // Update if new data has been provided. Clone to avoid modifying the provided object.
  this._data = data ? DvtJSONUtils.clone(data) : this._data;

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
DvtBreadcrumbs.prototype.__getData = function() {
  return this._data ? this._data : {};
};


/**
 * Returns the evaluated options object, which contains the user specifications
 * merged with the defaults.
 * @return {object} The options object.
 */
DvtBreadcrumbs.prototype.__getOptions = function() {
  return this._options;
};


/**
 * Returns the DvtEventManager for this component.
 * @return {DvtEventManager}
 */
DvtBreadcrumbs.prototype.getEventManager = function() {
  return this._eventHandler;
};

/**
 * @override
 */
DvtBreadcrumbs.prototype.hideKeyboardFocusEffect = function()  
{
  var prevCrumbIdx = this._curCrumbIdx;
  this._curCrumbIdx = -1;
  this._updateKeyboardFocusEffect(prevCrumbIdx, this._curCrumbIdx);
};

/**
 * Returns the current crumb index
 * @return {Number}
 */
DvtBreadcrumbs.prototype.getCurrentCrumbIndex = function()  
{
  return this._curCrumbIdx;
};

/**
 * Returns the number of crumbs
 * @return {Number}
 */
DvtBreadcrumbs.prototype.getNumCrumbs = function()  
{
  return this._data.items.length;
};

/**
 * Updates the crumb in focus
 * @param {boolean} bShiftKey True if the shift key was pressed
 * @return {Number} The currently focused crumb index or -1 if none
 */
DvtBreadcrumbs.prototype.updateCrumbFocus = function(bShiftKey)  
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
DvtBreadcrumbs.prototype._getUpdatedCrumbIndex = function(prevIndex, bForward) 
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
DvtBreadcrumbs.prototype._updateKeyboardFocusEffect = function(prevIdx, nextIdx)
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
      nextKeyboardFocusRect = new DvtKeyboardFocusEffect(context, this, bounds, matrix);
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
 * @return {DvtButton}
 */
DvtBreadcrumbs.prototype.getCrumb = function(crumbIdx)
{
  var crumbs = this.GetCrumbs();
  if (crumbIdx < 0 || !crumbs || crumbIdx >= crumbs.length)
    return null;
  return crumbs[crumbIdx];
};

/**
 * Returns the index of the breadcrumb of interest
 * @param {DvtButton} crumb The breadcrumb of interest
 * @return {Number}
 */
DvtBreadcrumbs.prototype.getCrumbIndex = function(crumb)
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
DvtBreadcrumbs.prototype.SetCrumbs = function(crumbs) {
  this._crumbs = crumbs;
};


/**
 * Gets an array of breadcrumbs
 * @return {array}
 * @protected
 */
DvtBreadcrumbs.prototype.GetCrumbs = function() {
  return this._crumbs;
};
/**
 * Default values and utility functions for breadcrumb versioning.
 * @class
 */
var DvtBreadcrumbsDefaults = new Object();

DvtObj.createSubclass(DvtBreadcrumbsDefaults, DvtObj, 'DvtBreadcrumbsDefaults');


/**
 * Defaults for version 1.
 */
DvtBreadcrumbsDefaults.VERSION_1 = {
  'labelStyle': "font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #003286;",
  'disabledLabelStyle': "font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px;",

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
    return DvtJSONUtils.merge(userOptions, defaults);
};


/**
 * Returns the default options object for the specified version of the component.
 * @param {object} userOptions The object containing options specifications for this component.
 * @private
 */
DvtBreadcrumbsDefaults._getDefaults = function(userOptions) {
  // Note: Version checking will eventually get added here
  // Note: Future defaults objects are deltas on top of previous objects
  return DvtJSONUtils.clone(DvtBreadcrumbsDefaults.VERSION_1);
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
 * Event Manager for DvtBreadcrumbs.
 */
var DvtBreadcrumbsEventManager = function(breadcrumbs, context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
  this._breadcrumbs = breadcrumbs;
};

DvtObj.createSubclass(DvtBreadcrumbsEventManager, DvtEventManager, 'DvtBreadcrumbsEventManager');


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
    var event = new DvtBreadcrumbsDrillEvent(obj.getId());
    this.FireEvent(event, this._breadcrumbs);
  }
};

/**
 * @override
 */
DvtBreadcrumbsEventManager.prototype.handleKeyboardEvent = function(event) {
  var eventConsumed = true;
  var keyCode = event.keyCode;

  if (keyCode == DvtKeyboardEvent.TAB) {
    var curCrumbIdx = this._breadcrumbs.updateCrumbFocus(event.shiftKey);

    // If tabbing out of interactive breadcrumbs, propagate event. Last crumb is not interactive.
    if (curCrumbIdx == -1) {
      eventConsumed = false;
    } else {
      // Accessibility Support
      this.UpdateActiveElement(this._breadcrumbs.getCrumb(curCrumbIdx));
    }
  }
  else if (keyCode == DvtKeyboardEvent.ENTER) {
    var crumb = this._breadcrumbs.getCrumb(this._breadcrumbs.getCurrentCrumbIndex());
    this._processBreadcrumbs(this.GetLogicalObject(crumb));
  }

  // keystrokes are consumed by default, unless we tab out of the breadcrumbs
  if (eventConsumed)
    DvtEventManager.consumeEvent(event);

  return eventConsumed;
};
/**
 * Simple logical object for drilling and tooltip support.
 * @param {string} id The id of the associated breadcrumb.
 * @param {DvtDisplayable} displayable The displayable associated with this logical object
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

DvtObj.createSubclass(DvtBreadcrumbsPeer, DvtSimpleObjPeer, 'DvtBreadcrumbsPeer');


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
 * Renderer for DvtBreadcrumbs.
 * @class
 */
var DvtBreadcrumbsRenderer = new Object();

DvtObj.createSubclass(DvtBreadcrumbsRenderer, DvtObj, 'DvtBreadcrumbsRenderer');


/**
 * @private
 */
DvtBreadcrumbsRenderer._TOUCH_BUFFER = 3;


/**
 * Renders the breadcrumbs in the specified area.
 * @param {DvtBreadcrumbs} breadcrumbs The breadcrumbs being rendered.
 * @param {DvtContainer} container The container to render into.
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
  if (DvtAgent.isRightToLeft(context))
    DvtBreadcrumbsRenderer._positionLabelsBidi(breadcrumbs, container, width, labels, peers);
  else
    DvtBreadcrumbsRenderer._positionLabels(breadcrumbs, container, width, labels, peers);
};

/**
 * Create a state for a label button.
 * @param {DvtContext} context The DvtContext to use.
 * @param {string} text The text for the label.
 * @param {DvtCSSStyle} cssStyle Style object for the label.
 * @return {DvtRect}
 * @private
 */
DvtBreadcrumbsRenderer._createButtonState = function(context, text, cssStyle) {
  var dvtText = new DvtOutputText(context, text, 0, 0);
  dvtText.setMouseEnabled(false);
  dvtText.setCSSStyle(cssStyle);

  var padTop = cssStyle.getPadding(DvtCSSStyle.PADDING_TOP);
  var padRight = cssStyle.getPadding(DvtCSSStyle.PADDING_RIGHT);
  var padBottom = cssStyle.getPadding(DvtCSSStyle.PADDING_BOTTOM);
  var padLeft = cssStyle.getPadding(DvtCSSStyle.PADDING_LEFT);

  var labelDims = DvtDisplayableUtils.getDimensionsForced(context, dvtText);
  var state = new DvtRect(context, 0, 0, labelDims.w + padLeft + padRight, labelDims.h + padTop + padBottom);
  state.setInvisibleFill();
  state.setCSSStyle(cssStyle);
  dvtText.setTranslate(padLeft, padTop);
  state.addChild(dvtText);

  return state;
};


/**
 * Create the label object, which could be a DvtButton, DvtRect, or DvtText.
 * @param {DvtContext} context The DvtContext to use.
 * @param {string} textStr The text string for the label.
 * @param {object} options Options for the breadcrumbs.
 * @param {boolean} bEnabled Flag indicating if this label is enabled or not.
 * @return {object}
 * @private
 */
DvtBreadcrumbsRenderer._createLabel = function(context, textStr, options, bEnabled) {
  var label;
  if (bEnabled && (options.labelStyleOver || options.labelStyleDown)) {
    var enaCss = new DvtCSSStyle(options.labelStyle);
    var ovrCss = new DvtCSSStyle(options.labelStyleOver);
    var dwnCss = new DvtCSSStyle(options.labelStyleDown);

    var ena = DvtBreadcrumbsRenderer._createButtonState(context, textStr, enaCss);
    var ovr = DvtBreadcrumbsRenderer._createButtonState(context, textStr, ovrCss);
    var dwn = DvtBreadcrumbsRenderer._createButtonState(context, textStr, dwnCss);

    label = new DvtButton(context, ena, ovr, dwn);
    label.setAriaRole('link');
    label.setAriaProperty('label', textStr);
  }
  else {
    var labelStyle = bEnabled ? options.labelStyle : options.disabledLabelStyle;
    var cssStyle = new DvtCSSStyle(labelStyle);
    if (cssStyle.getPadding(DvtCSSStyle.PADDING_LEFT) || cssStyle.getPadding(DvtCSSStyle.PADDING_RIGHT) || cssStyle.getPadding(DvtCSSStyle.PADDING_TOP) || cssStyle.getPadding(DvtCSSStyle.PADDING_BOTTOM)) {
      label = DvtBreadcrumbsRenderer._createButtonState(context, textStr, cssStyle);
    }
    else {
      label = new DvtOutputText(context, textStr, 0, 0);
      label.setCSSStyle(cssStyle);
    }
  }
  return label;
};


/**
 * Get the label text string.
 * @param {object} label The label object, which could be a DvtButton, DvtRect, or DvtText.
 * @return {string}
 * @private
 */
DvtBreadcrumbsRenderer._getLabelTextString = function(label) {
  if (label instanceof DvtButton) {
    var ena = label.upState;
    var text = ena.getChildAt(0);
    return text.getTextString();
  }
  else if (label instanceof DvtRect) {
    var text = label.getChildAt(0);
    return text.getTextString();
  }

  return label.getTextString();
};


/**
 * Truncates the breadcrumb labels.
 * @param {object} label The label object, which could be a DvtButton, DvtRect, or DvtText.
 * @param {number} maxWidth The maximum label width.
 * @private
 */
DvtBreadcrumbsRenderer._truncateLabels = function(label, maxWidth) {
  if (label instanceof DvtButton) {
    var ena = label.upState;
    var text = ena.getChildAt(0);
    DvtTextUtils.fitText(text, Math.max(maxWidth - text.getTranslateX(), 0), Infinity, text.getParent());
    var ovr = label.overState;
    text = ovr.getChildAt(0);
    DvtTextUtils.fitText(text, Math.max(maxWidth - text.getTranslateX(), 0), Infinity, text.getParent());
    var dwn = label.downState;
    text = dwn.getChildAt(0);
    DvtTextUtils.fitText(text, Math.max(maxWidth - text.getTranslateX(), 0), Infinity, text.getParent());
    return;
  }
  else if (label instanceof DvtRect) {
    var text = label.getChildAt(0);
    DvtTextUtils.fitText(text, Math.max(maxWidth - text.getTranslateX(), 0), Infinity, text.getParent());
    return;
  }

  DvtTextUtils.fitText(label, maxWidth, Infinity, label.getParent());
};


/**
 * Positions the labels into the given container.
 * @param {DvtBreadcrumbs} breadcrumbs The breadcrumbs being rendered.
 * @param {DvtContainer} container The container in which the labels will be added.
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
    if (DvtAgent.isTouchDevice()) {
      var rect = new DvtRect(container.getCtx(), -DvtBreadcrumbsRenderer._TOUCH_BUFFER, -DvtBreadcrumbsRenderer._TOUCH_BUFFER,
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
        eventManager.associate(labels[i], new DvtSimpleObjPeer(labelString));

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
 * @param {DvtBreadcrumbs} breadcrumbs The breadcrumbs being rendered.
 * @param {DvtContainer} container The container in which the labels will be added.
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
    if (DvtAgent.isTouchDevice()) {
      var rect = new DvtRect(container.getCtx(), -DvtBreadcrumbsRenderer._TOUCH_BUFFER, -DvtBreadcrumbsRenderer._TOUCH_BUFFER,
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
        eventManager.associate(labels[i], new DvtSimpleObjPeer(labelString));

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
 * @param {DvtBreadcrumbs} breadcrumbs The breadcrumbs being rendered.
 * @return {DvtText}
 * @private
 */
DvtBreadcrumbsRenderer._newSeparator = function(breadcrumbs) {
  var options = breadcrumbs.__getOptions();
  var label = new DvtOutputText(breadcrumbs.getCtx(), options.__labelSeparator, 0, 0);
  label.setCSSStyle(new DvtCSSStyle(options.labelStyle));
  return label;
};
/**
 * @constructor
 */
var DvtPanelDrawerEvent = function(subtype, activePanel) {
  this.Init(DvtPanelDrawerEvent.TYPE);
  this._subtype = subtype;
  this._activePanel = activePanel;
};

DvtObj.createSubclass(DvtPanelDrawerEvent, DvtBaseComponentEvent, 'DvtPanelDrawerEvent');

DvtPanelDrawerEvent.TYPE = 'dvtPanelDrawerEvent';
DvtPanelDrawerEvent.SUBTYPE_HIDE = 'hide';
DvtPanelDrawerEvent.SUBTYPE_SHOW = 'show';

DvtPanelDrawerEvent.prototype.getSubType = function() {
  return this._subtype;
};


/**
 * @return {string} The id of the active panel
 */
DvtPanelDrawerEvent.prototype.getActivePanel = function() {
  return this._activePanel;
};
// Copyright (c) 2012, 2015, Oracle and/or its affiliates. All rights reserved.
/**
 * @constructor
 */
var DvtPanelDrawer = function(context, callback, callbackObj, sid) {
  this.Init(context, callback, callbackObj, sid);
};

DvtObj.createSubclass(DvtPanelDrawer, DvtContainer, 'DvtPanelDrawer');

DvtPanelDrawer.DIR_LEFT = 'left';
DvtPanelDrawer.DIR_RIGHT = 'right';

DvtPanelDrawer.DOCK_TOP = 'top';
DvtPanelDrawer.DOCK_BOTTOM = 'bottom';


//DvtPanelDrawer styles
/**
 * Vertical space for the first tab
 * @const
 */
DvtPanelDrawer._FIRST_TAB_SPACING = 15;


/**
 * Vertical space for between tabs
 * @const
 */
DvtPanelDrawer._INTER_TAB_SPACING = 0;


/**
 * Tab size vertical and horizontal
 * @const
 */
DvtPanelDrawer._TAB_SIZE = 42;


/**
 * Tab corner radius
 * @const
 */
DvtPanelDrawer._TAB_CORNER_RADIUS = 2;


/**
 * Tab default background color
 * @const
 */
DvtPanelDrawer._BACKGROUND_COLOR = '#ffffff';


/**
 * Tab default border color
 * @const
 */
DvtPanelDrawer._BORDER_COLOR = '#bbc7d0';


/**
 * Tab default animation duration
 * @const
 */
DvtPanelDrawer._ANIM_DURATION = .25;


/**
 * Content padding
 * @const
 */
DvtPanelDrawer._CONTENT_PADDING = 10;

DvtPanelDrawer._BACKGROUND_ALPHA = 1;
DvtPanelDrawer._BACKGROUND_ALPHA_DE_EMPHASIZED = 1;
DvtPanelDrawer._BACKGROUND_ALPHA_ROLLOVER = 1;

DvtPanelDrawer._BORDER_ALPHA = 1;
DvtPanelDrawer._BORDER_ALPHA_DE_EMPHASIZED = 1;

DvtPanelDrawer._TAB_BACKGROUND_COLOR_INACTIVE = '#dee4e7';
DvtPanelDrawer._TAB_BORDER_COLOR_INACTIVE = '#c1cede';

//factor to use for increasing width of content so that bounce animation
//doesn't appear to detach panelDrawer from edge of component
DvtPanelDrawer._BOUNCE_WIDTH_FACTOR = 1.25;
DvtPanelDrawer._DEFAULT_SKIN = 'alta';


/**
 * The DvtPanelDrawer tab's image size
 * @const
 */
DvtPanelDrawer.IMAGE_SIZE = 24;


/**
 * The DvtPanelDrawer legend key
 * @const
 */
DvtPanelDrawer.PANEL_LEGEND = 'legend';


/**
 * The DvtPanelDrawer palette key
 * @const
 */
DvtPanelDrawer.PANEL_PALETTE = 'palette';


/**
 * The DvtPanelDrawer search key
 * @const
 */
DvtPanelDrawer.PANEL_SEARCH = 'search';


/**
 * The DvtPanelDrawer overview key
 * @const
 */
DvtPanelDrawer.PANEL_OVERVIEW = 'overview';


/**
 * The DvtPanelDrawer enabled search icon key
 * @const
 */
DvtPanelDrawer.PANEL_SEARCH_ICON_ENA = 'searchEna';


/**
 * The DvtPanelDrawer hover search icon key
 * @const
 */
DvtPanelDrawer.PANEL_SEARCH_ICON_OVR = 'searchOvr';


/**
 * The DvtPanelDrawer active search icon key
 * @const
 */
DvtPanelDrawer.PANEL_SEARCH_ICON_DWN = 'searchDwn';


/**
 * The DvtPanelDrawer serach tooltip key
 * @const
 */
DvtPanelDrawer.PANEL_SEARCH_TIP = 'searchTip';


/**
 * The DvtPanelDrawer enabled palette icon key
 * @const
 */
DvtPanelDrawer.PANEL_PALETTE_ICON_ENA = 'paletteEna';


/**
 * The DvtPanelDrawer hover palette icon key
 * @const
 */
DvtPanelDrawer.PANEL_PALETTE_ICON_OVR = 'paletteOvr';


/**
 * The DvtPanelDrawer active palette icon key
 * @const
 */
DvtPanelDrawer.PANEL_PALETTE_ICON_DWN = 'paletteDwn';


/**
 * The DvtPanelDrawer palette tooltip key
 * @const
 */
DvtPanelDrawer.PANEL_PALETTE_TIP = 'paletteTip';


/**
 * The DvtPanelDrawer enabled legend icon key
 * @const
 */
DvtPanelDrawer.PANEL_LEGEND_ICON_ENA = 'legendEna';


/**
 * The DvtPanelDrawer hover legend icon key
 * @const
 */
DvtPanelDrawer.PANEL_LEGEND_ICON_OVR = 'legendOvr';


/**
 * The DvtPanelDrawer active legend icon key
 * @const
 */
DvtPanelDrawer.PANEL_LEGEND_ICON_DWN = 'legendDwn';


/**
 * The DvtPanelDrawer legend tooltip key
 * @const
 */
DvtPanelDrawer.PANEL_LEGEND_TIP = 'legendTip';


/**
 * The DvtPanelDrawer enabled overview icon key
 * @const
 */
DvtPanelDrawer.PANEL_OVERVIEW_ICON_ENA = 'overviewEna';


/**
 * The DvtPanelDrawer hover overview icon key
 * @const
 */
DvtPanelDrawer.PANEL_OVERVIEW_ICON_OVR = 'overviewOvr';


/**
 * The DvtPanelDrawer active overview icon key
 * @const
 */
DvtPanelDrawer.PANEL_OVERVIEW_ICON_DWN = 'overviewDwn';


/**
 * The DvtPanelDrawer overview tooltip key
 * @const
 */
DvtPanelDrawer.PANEL_OVERVIEW_TIP = 'overviewTip';


// TODO: refactor these so they're not duplicated across the subcomponent and panzoomcanvas features
/**
 * @const
 */
DvtPanelDrawer.BG_ALPHA = 'backgroundAlpha';


/**
 * @const
 */
DvtPanelDrawer.TAB_BG_COLOR_INACTIVE = 'tab-color-inactive';


/**
 * @const
 */
DvtPanelDrawer.TAB_BORDER_COLOR_INACTIVE = 'tab-border-color-inactive';

//TO DO: fire state changes to callback


/**
 * A helper method called by the constructor to initialize this component
 * @param {DvtContext} context An object maintaining application specific context, as well as well as providing
 *                             access to platform specific data and objects, such as the factory
 * @param {function} callback The function to call for communicating with the parent object
 * @param {DvtObj} callbackObj The object to call the callback function on
 * @param {String} sid The id for this component
 * @protected
 */
DvtPanelDrawer.prototype.Init = function(context, callback, callbackObj, sid) {
  DvtPanelDrawer.superclass.Init.call(this, context, null, 'panelDrawer' + sid);

  this._sid = sid;
  this._eventManager = new DvtPanelDrawerEventManager(context, callback, callbackObj);
  this._eventManager.addListeners(this);
  this._eventManager.addRolloverType(DvtPanelDrawer);
  this._eventManager.associate(this, this);
  if (!DvtAgent.isTouchDevice())
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
  this._discloseDirection = DvtPanelDrawer.DIR_LEFT;
  this._dockSide = DvtPanelDrawer.DOCK_TOP;
  this._isFixed = false;

  this._styleMap = null;
  if (callbackObj)
    this._styleMap = callbackObj.getSubcomponentStyles();

  this._bgAlpha = DvtStyleUtils.getStyle(this._styleMap, DvtPanelDrawer.BG_ALPHA, DvtPanelDrawer._BACKGROUND_ALPHA);
  this._borderColor = DvtStyleUtils.getStyle(this._styleMap, DvtCSSStyle.BORDER_COLOR, DvtPanelDrawer._BORDER_COLOR);
  this._borderRadius = parseInt(DvtStyleUtils.getStyle(this._styleMap, DvtCSSStyle.BORDER_RADIUS, DvtPanelDrawer._TAB_CORNER_RADIUS));
  this._bgColor = DvtStyleUtils.getStyle(this._styleMap, DvtCSSStyle.BACKGROUND_COLOR, DvtPanelDrawer._BACKGROUND_COLOR);

  this._bgInactiveColor = DvtStyleUtils.getStyle(this._styleMap, DvtPanelDrawer.TAB_BG_COLOR_INACTIVE, DvtPanelDrawer._TAB_BACKGROUND_COLOR_INACTIVE);
  this._borderInactiveColor = DvtStyleUtils.getStyle(this._styleMap, DvtPanelDrawer.TAB_BORDER_COLOR_INACTIVE, DvtPanelDrawer._TAB_BORDER_COLOR_INACTIVE);

  this.setPixelHinting(true);

  //Panel drawer content padding
  this._contentPadding = DvtPanelDrawer._CONTENT_PADDING;
};

DvtPanelDrawer.prototype.addPanel = function(panel, upState, overState, downState, tooltip, id) {
  this._panels[id] = {'panel': panel, 'iconUp': upState, 'iconOver': overState, 'iconDown': downState, 'tooltip': tooltip};
  this._panelOrder.push(id);

  this._minHeight = DvtPanelDrawer._FIRST_TAB_SPACING + this._panelOrder.length * (DvtPanelDrawer._TAB_SIZE + DvtPanelDrawer._INTER_TAB_SPACING);
};


/**
 * Returns whether this panel drawer is fixed or collapsible
 * @return {boolean}
 */
DvtPanelDrawer.prototype.isFixed = function() {
  return this._isFixed;
};


/**
 * Sets whether this panel drawer is fixed or collapsible
 * @param {boolean} bFixed Whether the DvtPanelDrawer is fixed
 */
DvtPanelDrawer.prototype.setFixed = function(bFixed) {
  this._isFixed = bFixed;
};

DvtPanelDrawer.prototype.setMaxWidth = function(width) {
  this._maxWidth = width;
};

DvtPanelDrawer.prototype.getMaxWidth = function() {
  return this._maxWidth;
};


/**
 * Set Content padding of the panel drawer
 * @public
 * @param {number} padding  content padding
 */
DvtPanelDrawer.prototype.setContentPadding = function(padding) {
  this._contentPadding = padding;
};


/**
 * Get Content padding of the panel darwer
 * @public
 * @return {number}  content padding
 */
DvtPanelDrawer.prototype.getContentPadding = function() {
  return this._contentPadding;
};


/**
 * Get the maximum content width
 * @public
 * @return {number} maximum content width
 */
DvtPanelDrawer.prototype.getMaxContentWidth = function() {
  return this._maxWidth - (2 * this.getContentPadding());
};

DvtPanelDrawer.prototype.setMaxHeight = function(height) {
  this._maxHeight = height;
};

DvtPanelDrawer.prototype.getMaxHeight = function() {
  return this._maxHeight;
};


/**
 * Get the maximum content height
 * @public
 * @return {number} maximum content height
 */
DvtPanelDrawer.prototype.getMaxContentHeight = function() {
  return this._maxHeight - (2 * this.getContentPadding());
};

DvtPanelDrawer.prototype.setDiscloseDirection = function(dir) {
  this._discloseDirection = dir;
};

DvtPanelDrawer.prototype.getDiscloseDirection = function() {
  return this._discloseDirection;
};

DvtPanelDrawer.prototype.setDockSide = function(dockSide) {
  this._dockSide = dockSide;
};

DvtPanelDrawer.prototype.getDockSide = function() {
  return this._dockSide;
};

DvtPanelDrawer.prototype.GetPanel = function(id) {
  return this._panels[id]['panel'];
};

DvtPanelDrawer.prototype.GetIcon = function(id) {
  return this._panels[id]['icon'];
};

DvtPanelDrawer.prototype.GetTooltip = function(id) {
  return this._panels[id]['tooltip'];
};

DvtPanelDrawer.prototype.GetTab = function(id) {
  return this._tabs[id];
};


/**
 * Get panel ids
 * @return {array} array of panel ids
 */
DvtPanelDrawer.prototype.GetPanelIds = function() {
  return this._panelOrder;
};


/**
 * Sets the id of an active panel
 * @param {string} id Active panel id
 * @param {boolean} bImmediate True to change panels state immediately (no animation)
 * @param {function} onEnd A function to call at the end of animation
 */
DvtPanelDrawer.prototype.setDisplayedPanelId = function(id, bImmediate, onEnd) {
  this._oldDisplayedPanelId = this._displayedPanelId;
  this._displayedPanelId = id;
  if (this.isDisclosed()) {
    this.ChangeTabsState();
    this.ChangePanels(id, bImmediate, onEnd);
  }
  this._oldDisplayedPanelId = null;
};

DvtPanelDrawer.prototype.getDisplayedPanelId = function() {
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
DvtPanelDrawer.prototype.setDisclosed = function(bDisclosed, bImmediate, onEnd) {
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

DvtPanelDrawer.prototype.isDisclosed = function() {
  return this._bDisclosed;
};


/**
 * Renders this panel drawer
 */
DvtPanelDrawer.prototype.renderComponent = function() {
  if (!this._contentPane) {
    this._contentPane = new DvtContainer(this.getCtx(), 'pd_contentPane');
    this.addChild(this._contentPane);
    this._activeContent = new DvtContainer(this.getCtx(), 'pdcp_activeContent');
    this._contentPane.addChild(this._activeContent);
  }
  this.RenderTabs();
};


/**
 * Draws the tabs for each panel in The DvtPanelDrawer in the non disclosed state.
 * No tabs are drawn if the DvtPanelDrawer has fixed state and is in non disclosed state.
 * @protected
 */
DvtPanelDrawer.prototype.RenderTabs = function() {
  if (!this.isFixed()) {
    var currX = -DvtPanelDrawer._TAB_SIZE;
    if (this.getDiscloseDirection() == DvtPanelDrawer.DIR_RIGHT) {
      currX = 0;
    }
    var currY = DvtPanelDrawer._FIRST_TAB_SPACING;
    if (this.getDockSide() == DvtPanelDrawer.DOCK_TOP) {
      for (var i = 0; i < this._panelOrder.length; i++) {
        var panelId = this._panelOrder[i];
        var tab = this.RenderTab(panelId);
        tab.setTranslate(currX, currY);
        currY += (DvtPanelDrawer._TAB_SIZE + DvtPanelDrawer._INTER_TAB_SPACING);
      }
    }
    else if (this.getDockSide() == DvtPanelDrawer.DOCK_BOTTOM) {
      currY = -DvtPanelDrawer._FIRST_TAB_SPACING - DvtPanelDrawer._TAB_SIZE;
      for (var i = this._panelOrder.length - 1; i >= 0; i--) {
        var panelId = this._panelOrder[i];
        var tab = this.RenderTab(panelId);
        tab.setTranslate(currX, currY);
        currY -= (DvtPanelDrawer._TAB_SIZE + DvtPanelDrawer._INTER_TAB_SPACING);
      }
    }
  }
};

DvtPanelDrawer.prototype.GetTabPathCommands = function() {
  var arPoints;
  switch (this.getDiscloseDirection()) {
    case DvtPanelDrawer.DIR_RIGHT:
      arPoints = ['M', 0, 0,
                  'L', DvtPanelDrawer._TAB_SIZE - this._borderRadius, 0,
                  'A', this._borderRadius, this._borderRadius, 0, 0, 1, DvtPanelDrawer._TAB_SIZE, this._borderRadius,
                  'L', DvtPanelDrawer._TAB_SIZE, DvtPanelDrawer._TAB_SIZE - this._borderRadius,
                  'A', this._borderRadius, this._borderRadius, 0, 0, 1, DvtPanelDrawer._TAB_SIZE - this._borderRadius, DvtPanelDrawer._TAB_SIZE,
                  'L', 0, DvtPanelDrawer._TAB_SIZE];
      break;
    case DvtPanelDrawer.DIR_LEFT:
    default:
      arPoints = ['M', DvtPanelDrawer._TAB_SIZE, 0,
                  'L', this._borderRadius, 0,
                  'A', this._borderRadius, this._borderRadius, 0, 0, 0, 0, this._borderRadius,
                  'L', 0, DvtPanelDrawer._TAB_SIZE - this._borderRadius,
                  'A', this._borderRadius, this._borderRadius, 0, 0, 0, this._borderRadius, DvtPanelDrawer._TAB_SIZE,
                  'L', DvtPanelDrawer._TAB_SIZE, DvtPanelDrawer._TAB_SIZE];
      break;
  }
  return arPoints;
};


/**
 * Renders panel drawer tab
 * @param {string} panelId Id of the rendered tab
 * @protected
 */
DvtPanelDrawer.prototype.RenderTab = function(panelId) {
  var arPoints = this.GetTabPathCommands();
  var closedPath = arPoints;
  var strokeWidth = 1;

  var tab = new DvtPanelDrawerTab(this.getCtx(), closedPath, panelId, this);
  tab.setPixelHinting(true);
  tab.setCursor(DvtSelectionEffectUtils.getSelectingCursor());
  this._contentPane.addChildAt(tab, 0);
  tab.setSolidFill(this._bgInactiveColor, this._bgAlpha);
  tab.setSolidStroke(this._borderInactiveColor, DvtPanelDrawer._BORDER_ALPHA, strokeWidth);

  var panelObj = this._panels[panelId];

  var upState = new DvtPath(this.getCtx(), closedPath);
  upState.setInvisibleFill();
  panelObj['iconUp'].setTranslate(.5 * (DvtPanelDrawer._TAB_SIZE - DvtPanelDrawer.IMAGE_SIZE), .5 * (DvtPanelDrawer._TAB_SIZE - DvtPanelDrawer.IMAGE_SIZE));
  upState.addChild(panelObj['iconUp']);
  var overState = new DvtPath(this.getCtx(), closedPath);
  overState.setInvisibleFill();
  panelObj['iconOver'].setTranslate(.5 * (DvtPanelDrawer._TAB_SIZE - DvtPanelDrawer.IMAGE_SIZE), .5 * (DvtPanelDrawer._TAB_SIZE - DvtPanelDrawer.IMAGE_SIZE));
  overState.addChild(panelObj['iconOver']);
  var downState = new DvtPath(this.getCtx(), closedPath);
  downState.setInvisibleFill();
  panelObj['iconDown'].setTranslate(.5 * (DvtPanelDrawer._TAB_SIZE - DvtPanelDrawer.IMAGE_SIZE), .5 * (DvtPanelDrawer._TAB_SIZE - DvtPanelDrawer.IMAGE_SIZE));
  downState.addChild(panelObj['iconDown']);

  var icon = new DvtButton(this.getCtx(), upState, overState, downState);
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
DvtPanelDrawer.prototype.HandleTabClick = function(panelId) {
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


  this.FireListener(new DvtPanelDrawerEvent(this.isDisclosed() ? DvtPanelDrawerEvent.SUBTYPE_SHOW : DvtPanelDrawerEvent.SUBTYPE_HIDE,
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
DvtPanelDrawer.prototype.ChangePanels = function(panelId, bImmediate, onEnd) {
  var anim = null;
  if (!bImmediate) {
    anim = new DvtAnimator(this.getCtx(), DvtPanelDrawer._ANIM_DURATION);
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
      DvtPlayable.appendOnEnd(anim, onEnd);
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
DvtPanelDrawer.prototype.DoExpand = function(bImmediate, onEnd) {
  this.DisplayPanel(this.getDisplayedPanelId());
  //width has been increased to account for bounce animation, so calculate original width
  var destX = -((1 / DvtPanelDrawer._BOUNCE_WIDTH_FACTOR) * this._expandedContent.getWidth());
  if (this.getDiscloseDirection() == DvtPanelDrawer.DIR_RIGHT) {
    destX = -destX;
    //since we're increasing width, need to offset x by amount of padding when panelDrawer is
    //on left edge of component
    this._expandedContent.setX(((1 / DvtPanelDrawer._BOUNCE_WIDTH_FACTOR) - 1) * this._expandedContent.getWidth());
  }

  if (!bImmediate) {
    var anim = new DvtAnimator(this.getCtx(), DvtPanelDrawer._ANIM_DURATION);
    //bounce anim at end
    anim.setEasing(DvtEasing.backOut);
    anim.addProp(DvtAnimator.TYPE_NUMBER, this._contentPane, this._contentPane.getTranslateX, this._contentPane.setTranslateX, destX);

    if (onEnd) {
      DvtPlayable.appendOnEnd(anim, onEnd);
    }

    if (anim) {
      var thisRef = this;
      DvtPlayable.appendOnEnd(anim, function() { thisRef._bTransition = false; });
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
DvtPanelDrawer.prototype.DoCollapse = function(bImmediate, onEnd) {
  if (!bImmediate) {
    var anim = new DvtAnimator(this.getCtx(), DvtPanelDrawer._ANIM_DURATION);
    //bounce anim at beginning
    anim.setEasing(DvtEasing.backIn);
    anim.addProp(DvtAnimator.TYPE_NUMBER, this._contentPane, this._contentPane.getTranslateX, this._contentPane.setTranslateX, 0);
    DvtPlayable.appendOnEnd(anim, this.RemoveExpandedContent, this);
    DvtPlayable.appendOnEnd(anim, this.ChangeTabsState, this);
    if (onEnd) {
      DvtPlayable.appendOnEnd(anim, onEnd);
    }
    var thisRef = this;
    DvtPlayable.appendOnEnd(anim, function() { thisRef._bTransition = false; });
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
DvtPanelDrawer.prototype.RemoveExpandedContent = function() {
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
 * @param {DvtAnimator} anim the animator used to display the transition animation, optional
 * @param {function} onEnd the function to be called after the panel has been displayed, optional
 */
DvtPanelDrawer.prototype.DisplayPanel = function(id, anim, onEnd) {
  if (!this._expandedContent) {
    this._expandedContent = new DvtRect(this.getCtx(), 0, 0, 1, 1, 'pdcp_expandedContent');
    this._activeContent.addChild(this._expandedContent);
    this._expandedContent.setSolidFill(this._bgColor, this._bgAlpha);

    this._expandedContentPanel = new DvtContainer(this._context);
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
        oldPanel.removeEvtListener(DvtResizeEvent.RESIZE_EVENT, this.HandlePanelResize, false, this);
      }
    }
    //add the resize listener to the new displayed panel
    panel.addEvtListener(DvtResizeEvent.RESIZE_EVENT, this.HandlePanelResize, false, this);
  }

  if (!this._expandedBorder) {
    this._expandedBorder = new DvtPath(this.getCtx(), ['M', 0, 0, 'L', 1, 1], 'pdcp_expandedBorder');
    this._expandedBorderResizable = new DvtPath(this.getCtx(), ['M', 0, 0, 'L', 1, 1], 'pdcp_expandedBorderResizable');
    this._expandedContent.addChild(this._expandedBorder);
    this._expandedContent.addChild(this._expandedBorderResizable);
    this._expandedBorder.setSolidStroke(this._borderColor, DvtPanelDrawer._BORDER_ALPHA);
    this._expandedBorder.setFill(null);
    this._expandedBorderResizable.setSolidStroke(this._borderColor, DvtPanelDrawer._BORDER_ALPHA);
    this._expandedBorderResizable.setFill(null);
    this._expandedBorder.setPixelHinting(true);
    this._expandedBorderResizable.setPixelHinting(true);
  }

  this.RefreshExpandedSize(id, anim);

  if (onEnd) {
    if (anim) {
      DvtPlayable.appendOnEnd(anim, onEnd);
    }
    else {
      onEnd();
    }
  }
};

DvtPanelDrawer.prototype.HandlePanelResize = function(event) {
  var anim = new DvtAnimator(this.getCtx(), DvtPanelDrawer._ANIM_DURATION);
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
 * @param {DvtAnimator} anim  Dvt Animator object
 */
DvtPanelDrawer.prototype.RefreshExpandedSize = function(id, anim) {
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
 * @param {DvtAnimator} anim The animator to use for the size update
 * @param {Number} ecw The content width
 * @param {Number} ech The content height
 * @param {Number} xx The content x coordinate
 * @param {Number} yy  The content y coordinate
 * @private
 */
DvtPanelDrawer.prototype._refreshPanelSize = function(id, anim, ecw, ech, xx, yy) {
  var panel = this.GetPanel(id);

  //if base panel is not positioned at origin, adjust it
  //  if (xx != 0) {
  if (anim) {
    anim.addProp(DvtAnimator.TYPE_NUMBER, panel, panel.getTranslateX, panel.setTranslateX, -xx);
  }
  else {
    panel.setTranslateX(-xx);
  }
  //  }
  //  if (yy != 0) {
  if (anim) {
    anim.addProp(DvtAnimator.TYPE_NUMBER, panel, panel.getTranslateY, panel.setTranslateY, -yy);
  }
  else {
    panel.setTranslateY(-yy);
  }
  //  }

  //  var currWidth = this._expandedContent.getWidth();
  //  var currHeight = this._expandedContent.getHeight();

  var clipRect = new DvtRectangle(this.getContentPadding(), this.getContentPadding(),
                                  ecw - 2 * this.getContentPadding(), ech - 2 * this.getContentPadding());

  //increase width so that bounce animation doesn't detach panelDRrawer from edge of component
  var expandedContentWidth = DvtPanelDrawer._BOUNCE_WIDTH_FACTOR * ecw;
  if (anim) {
    anim.addProp(DvtAnimator.TYPE_NUMBER, this._expandedContent, this._expandedContent.getWidth, this._expandedContent.setWidth, expandedContentWidth);
    anim.addProp(DvtAnimator.TYPE_NUMBER, this._expandedContent, this._expandedContent.getHeight, this._expandedContent.setHeight, ech);
    anim.addProp(DvtAnimator.TYPE_RECTANGLE, this, this._getContentClipPath, this._setContentClipPath, clipRect);

    //if we have an animation, then animate the translate change because
    //we must be changing tabs in an already-expanded drawer
    if (this.getDiscloseDirection() == DvtPanelDrawer.DIR_LEFT) {
      anim.addProp(DvtAnimator.TYPE_NUMBER, this._contentPane, this._contentPane.getTranslateX, this._contentPane.setTranslateX, -ecw);
    }
    else if (this.getDiscloseDirection() == DvtPanelDrawer.DIR_RIGHT) {
      anim.addProp(DvtAnimator.TYPE_NUMBER, this._contentPane, this._contentPane.getTranslateX, this._contentPane.setTranslateX, ecw);
      anim.addProp(DvtAnimator.TYPE_NUMBER, this._expandedBorder, this._expandedBorder.getTranslateX, this._expandedBorder.setTranslateX, ecw);
      anim.addProp(DvtAnimator.TYPE_NUMBER, this._expandedBorderResizable, this._expandedBorderResizable.getTranslateX, this._expandedBorderResizable.setTranslateX, ecw);

      anim.addProp(DvtAnimator.TYPE_NUMBER, this._expandedContent, this._expandedContent.getTranslateX, this._expandedContent.setTranslateX, -ecw);
    }
    if (this.getDockSide() == DvtPanelDrawer.DOCK_BOTTOM) {
      anim.addProp(DvtAnimator.TYPE_NUMBER, this._expandedBorder, this._expandedBorder.getTranslateY, this._expandedBorder.setTranslateY, ech);
      anim.addProp(DvtAnimator.TYPE_NUMBER, this._expandedBorderResizable, this._expandedBorderResizable.getTranslateY, this._expandedBorderResizable.setTranslateY, ech);

      anim.addProp(DvtAnimator.TYPE_NUMBER, this._expandedContent, this._expandedContent.getTranslateY, this._expandedContent.setTranslateY, -ech);
    }
  }
  else {
    this._expandedContent.setWidth(expandedContentWidth);
    this._expandedContent.setHeight(ech);
    if (this.getDiscloseDirection() == DvtPanelDrawer.DIR_RIGHT) {
      this._expandedContent.setTranslateX(-ecw);
      this._expandedBorder.setTranslateX(ecw);
      this._expandedBorderResizable.setTranslateX(ecw);
    }
    if (this.getDockSide() == DvtPanelDrawer.DOCK_BOTTOM) {
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
  if (this.getDiscloseDirection() == DvtPanelDrawer.DIR_RIGHT)
    edgeX = -ecw;

  if (this.getDockSide() == DvtPanelDrawer.DOCK_TOP) {
    if (tab) {
      //render line from top to start of first tab
      borderPath = ['M', 0, 0, 'L', 0, tab.getTranslateY(), 'M', 0, tab.getTranslateY() + DvtPanelDrawer._TAB_SIZE];
      //render line from bottom of tab to bottom of last tab
      var lastPanelId = this._panelOrder[this._panelOrder.length - 1];
      var lastTab = this.GetTab(lastPanelId);
      borderPath.push('L', 0, lastTab.getTranslateY() + DvtPanelDrawer._TAB_SIZE);
      this._expandedBorder.setCommands(borderPath);

      //increase width so that bounce animation doesn't detach panelDRrawer from edge of component
      edgeX *= DvtPanelDrawer._BOUNCE_WIDTH_FACTOR;
      borderPath = ['M', 0, lastTab.getTranslateY() + DvtPanelDrawer._TAB_SIZE, 'L', 0, ech, 'L', edgeX, ech];
    } else {
      borderPath = ['M', 0, 0, 'L', 0, ech, 'L', edgeX, ech];
      this._expandedBorder.setCommands(borderPath);
    }
  }
  else if (this.getDockSide() == DvtPanelDrawer.DOCK_BOTTOM) {
    if (tab) {
      //render line from bottom to bottom of tab
      borderPath = ['M', 0, 0, 'L', 0, tab.getTranslateY() + DvtPanelDrawer._TAB_SIZE, 'M', 0, tab.getTranslateY()];
      //render line from top of tab to top of first tab
      var firstPanelId = this._panelOrder[0];
      var firstTab = this.GetTab(firstPanelId);
      borderPath.push('L', 0, firstTab.getTranslateY());
      this._expandedBorder.setCommands(borderPath);

      //increase width so that bounce animation doesn't detach panelDRrawer from edge of component
      edgeX *= DvtPanelDrawer._BOUNCE_WIDTH_FACTOR;
      borderPath = ['M', 0, firstTab.getTranslateY(), 'L', 0, -ech, 'L', edgeX, -ech];
    } else {
      borderPath = ['M', 0, 0, 'L', 0, -ech, 'L', edgeX, -ech];
      this._expandedBorder.setCommands(borderPath);
    }
  }

  if (anim) {
    anim.addProp(DvtAnimator.TYPE_PATH, this._expandedBorderResizable, this._expandedBorderResizable.getCommands, this._expandedBorderResizable.setCommands, borderPath);
  }
  else {
    this._expandedBorderResizable.setCommands(borderPath);
  }

};

DvtPanelDrawer.prototype._setContentClipPath = function(rect) {
  if (this._expandedContentPanel) {
    if (rect) {
      //need to change id of clipPath in order for Chrome to update
      var clipPath = new DvtClipPath('pdcp' + this._sid);
      clipPath.addRect(rect.x, rect.y, rect.w, rect.h);

      this._expandedContentPanel.setClipPath(clipPath);
    }
  }
  this._contentClipPath = rect;
};

DvtPanelDrawer.prototype._getContentClipPath = function() {
  return this._contentClipPath;
};


/**
 * Get expanded content width
 * @protected
 * @param {number} preferredwidth  preferred width
 * @return {number}  expanded content width
 */
DvtPanelDrawer.prototype.GetExpandedContentWidth = function(preferredWidth) {
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
DvtPanelDrawer.prototype.GetExpandedContentHeight = function(preferredHeight) {
  var hh = preferredHeight + 2 * this.getContentPadding();
  if ((this._minHeight || this._minHeight == 0) && hh < this._minHeight) {
    hh = this._minHeight;
  }
  if (this._maxHeight && hh > this._maxHeight) {
    hh = this._maxHeight;
  }
  return hh;
};

DvtPanelDrawer.prototype.ApplyFillAlpha = function(alpha) {
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

DvtPanelDrawer.prototype.ApplyStrokeAlpha = function(alpha) {
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
DvtPanelDrawer.prototype.deEmphasizeStart = function() {
  //disable interaction
  this.setMouseEnabled(false);
  this.ApplyFillAlpha(DvtPanelDrawer._BACKGROUND_ALPHA_DE_EMPHASIZED);
  this.ApplyStrokeAlpha(DvtPanelDrawer._BORDER_ALPHA_DE_EMPHASIZED);
  if (this._expandedContentPanel) {
    this._expandedContentPanel.setAlpha(DvtPanelDrawer._BACKGROUND_ALPHA_DE_EMPHASIZED);
  }
  for (var panelId in this._tabs) {
    var icon = this.GetIcon(panelId);
    if (icon) {
      icon.setAlpha(DvtPanelDrawer._BACKGROUND_ALPHA_DE_EMPHASIZED);
    }
  }
};


/**
 * Stop de-emphasizing the panel.
 */
DvtPanelDrawer.prototype.deEmphasizeEnd = function() {
  //enable interaction
  this.setMouseEnabled(true);

  this.ApplyFillAlpha(this._bgAlpha);
  this.ApplyStrokeAlpha(DvtPanelDrawer._BORDER_ALPHA);
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
DvtPanelDrawer.prototype.HandleRollOver = function(event) {
  //this.ApplyAlphasForMouse();
  this.ApplyAlphasRollover();
};


/**
 * Handle mouse roll out on the panel.
 *
 * @param event MouseEvent
 */
DvtPanelDrawer.prototype.HandleRollOut = function(event) {
  //this.ApplyAlphasForMouse();
  if (!this._bFocus) {
    this.ApplyAlphasRollout();
  }
};


/**
 * Apply alpha values for mouse roll over.
 */
DvtPanelDrawer.prototype.ApplyAlphasRollover = function() {
  this.ApplyFillAlpha(DvtPanelDrawer._BACKGROUND_ALPHA_ROLLOVER);
};


/**
 * Apply alpha values for mouse roll out.
 */
DvtPanelDrawer.prototype.ApplyAlphasRollout = function() {
  this.ApplyFillAlpha(this._bgAlpha);
};


/**
 * Updates state for each tab in the panel drawer
 * @protected
 */
DvtPanelDrawer.prototype.ChangeTabsState = function() {

  for (var panelId in this._tabs) {
    var tab = this._tabs[panelId];
    if (tab) {
      if (panelId == this.getDisplayedPanelId() && this.isDisclosed()) {
        tab.setSolidFill(this._bgColor, this._bgAlpha);
        tab.setSolidStroke(this._borderColor, DvtPanelDrawer._BORDER_ALPHA);
        tab.setDisclosed(true);
      }
      else {
        tab.setSolidFill(this._bgInactiveColor, this._bgAlpha);
        tab.setSolidStroke(this._borderInactiveColor, DvtPanelDrawer._BORDER_ALPHA);
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

DvtPanelDrawer.prototype.setMaxContainerHeight = function(height) {
  if (!this._maxContainerHeight || this._maxContainerHeight < height)
    this._maxContainerHeight = height;
};

DvtPanelDrawer.prototype.getMaxContainerHeight = function() {
  return this.GetExpandedContentHeight(this._maxContainerHeight);
};


/**
 * @override
 */
DvtPanelDrawer.prototype.getDimensions = function(targetCoordinateSpace) {
  var dim = DvtPanelDrawer.superclass.getDimensions.call(this, targetCoordinateSpace);
  dim.w /= DvtPanelDrawer._BOUNCE_WIDTH_FACTOR;
  return dim;
};


/**
 * Get event manager for the component
 * @return {DvtPanelDrawerEventManager} event manager for the component
 */
DvtPanelDrawer.prototype.getEventManager = function() {
  return this._eventManager;
};

// Copyright (c) 2014, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * @constructor
 * Panel drawer tab
 * @param {DvtContext} context the rendering context
 * @param {object} cmds the string of SVG path commands or an array of SVG path commands, whose entries contain the
 *                      commands followed by coordinates.
 * @param {string} id object id
 * @param {DvtPanelDrawer} panelDrawer parent panel drawer component
 * @extends {DvtPath}
 * @class DvtPanelDrawerTab
 * @constructor
 */
var DvtPanelDrawerTab = function(context, cmds, id, panelDrawer) {
  this.Init(context, cmds, id, panelDrawer);
};

DvtObj.createSubclass(DvtPanelDrawerTab, DvtPath, 'DvtPanelDrawerTab');


/**
 * Initialization function
 * @param {DvtContext} context the rendering context
 * @param {object} cmds the string of SVG path commands or an array of SVG path commands, whose entries contain the
 *                      commands followed by coordinates.
 * @param {string} id object id
 * @param {DvtPanelDrawer} panelDrawer parent panel drawer component
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
 * @param {DvtKeyboardEvent} event keyboard event
 * @protected
 */
DvtPanelDrawerTab.prototype.HandleKeyboardEvent = function(event) {
  var keyCode = event.keyCode;
  if (keyCode == DvtKeyboardEvent.ENTER || keyCode == DvtKeyboardEvent.SPACE) {
    var eventManager = this._panelDrawer.getEventManager();
    var point = this.localToStage(new DvtPoint(0, 0));
    var mouseEvent = DvtEventFactory.generateMouseEventFromKeyboardEvent(event, this._context, DvtMouseEvent.CLICK,
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
  states.push(this.isDisclosed() ? DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'STATE_EXPANDED') : DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'STATE_COLLAPSED'));
  return DvtDisplayable.generateAriaLabel(this._panelDrawer.GetTooltip(this._panelId), states);
};


/**
 * Add accessibility attributes to the panel drawer tab
 */
DvtPanelDrawerTab.prototype.addAccessibilityAttributes = function() {
  // WAI-ARIA
  this.setAriaRole('button');
  if (!DvtAgent.deferAriaCreation()) {
    this.setAriaProperty('label', this.getAriaLabel());
  }
};


/**
 * Update accessibility attribute of the panel drawer tab
 */
DvtPanelDrawerTab.prototype.updateAccessibilityAttributes = function() {
  // WAI-ARIA
  if (!DvtAgent.deferAriaCreation()) {
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
  this._keyboardFocusEffect = new DvtKeyboardFocusEffect(this.getCtx(), this, new DvtRectangle(dim.x + 1, dim.y + 1, dim.w - 2, dim.h - 2), null, null, true);
};
// Copyright (c) 2012, 2015, Oracle and/or its affiliates. All rights reserved.
/**
 * @constructor
 * @param {DvtContext} context the platform specific context object
 * @param {function} callback a function that responds to component events
 * @param {object} callbackObj optional object instance that the callback function is defined on
 * @class DvtPanelDrawerEventManager
 * @extends {DvtEventManager}
 */
var DvtPanelDrawerEventManager = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

DvtObj.createSubclass(DvtPanelDrawerEventManager, DvtEventManager, 'DvtPanelDrawerEventManager');


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
// Copyright (c) 2014, 2015, Oracle and/or its affiliates. All rights reserved.
/*---------------------------------------------------------------------------------*/
/*  DvtPanelDrawerKeyboardHandler     Keyboard handler for panel drawer            */
/*---------------------------------------------------------------------------------*/
/**
 * Keyboard handler for the panel drawer component
 * @param {DvtEventManager} manager The owning DvtEventManager
 * @param {DvtPalette} panelDrawer The owning panel drawer component
 * @class DvtPanelDrawerKeyboardHandler
 * @constructor
 * @extends {DvtKeyboardHandler}
 */
var DvtPanelDrawerKeyboardHandler = function(manager, panelDrawer)
{
  this.Init(manager, panelDrawer);
};

DvtObj.createSubclass(DvtPanelDrawerKeyboardHandler, DvtKeyboardHandler, 'DvtPanelDrawerKeyboardHandler');


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
  if (keyCode == DvtKeyboardEvent.TAB) {
    var next = null;
    DvtEventManager.consumeEvent(event);
    if (!currentNavigable) {
      var panelIds = this._panelDrawer.GetPanelIds();
      next = this._panelDrawer.GetTab(panelIds[0]);
    }
    else {
      next = currentNavigable;
    }
    return next;
  }
  else if (keyCode == DvtKeyboardEvent.ENTER || keyCode == DvtKeyboardEvent.SPACE) {
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
 * @param {DvtKeyboardEvent} event a keyboard event
 * @return {DvtPanelDrawerTab} next navigable
 */
DvtPanelDrawerKeyboardHandler.prototype.getNextNavigable = function(currentNavigable, event) {
  if (!(event.keyCode == DvtKeyboardEvent.DOWN_ARROW || event.keyCode == DvtKeyboardEvent.UP_ARROW))
    return currentNavigable;

  var next = currentNavigable;
  var bForward = (event.keyCode == DvtKeyboardEvent.DOWN_ARROW) ? true : false;
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
 *  @param {DvtContext} context object
 *  @param {string} id component id
 *  @param {number} w max content width
 *  @param {number} h max content height
 *  @param {DvtEventManager} eventManager event manager for the control
 *  @param {images} images for the control
 *  @param {Object} styleMap for the control
 */
var DvtAccordion = function(context, id, w, h, eventManager, images, styleMap) {
  this.Init(context, id, w, h, eventManager, images, styleMap);
};

DvtObj.createSubclass(DvtAccordion, DvtContainer, 'DvtAccordion');

DvtAccordion.COLLAPSE_ENA = 'sectionColEna';
DvtAccordion.COLLAPSE_OVR = 'sectionColOvr';
DvtAccordion.COLLAPSE_DWN = 'sectionColDwn';
DvtAccordion.EXPAND_ENA = 'sectionExpEna';
DvtAccordion.EXPAND_OVR = 'sectionExpOvr';
DvtAccordion.EXPAND_DWN = 'sectionExpDwn';


/**
 * @protected
 * Initialization method called by the constructor
 * @param {DvtContext} context object
 * @param {string} id component id
 * @param {number} w max content width
 * @param {number} h max content height
 * @param {DvtEventManager} eventManager event manager for the control
 * @param {images} images for the control
 * @param {Object} styleMap for the control
 */
DvtAccordion.prototype.Init = function(context, id, w, h, eventManager, images, styleMap) {
  DvtAccordion.superclass.Init.call(this, context, null, id);
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
 * @param {DvtContainer} sectionContent Section content
 * @param {Boolean} isActive Indicates if the section initially opened
 * @param {Boolean} isCollapsible Indicates if the section is collapsible
 * @param {string} id Section id
 */
DvtAccordion.prototype.addSection = function(title, sectionContent, isActive, isCollapsible, id) {
  if (!id)
    id = 'accordion_' + title.replace(/ /g, '_') + Math.floor(Math.random() * 1000000000);//@RandomNumberOk
  var accordionSection = new DvtAccordionSection(this.getCtx(), sectionContent, title, isActive, isCollapsible, this, this._eventManager, id, this._images, this._styleMap);
  this._sections[id] = accordionSection;
  this._sectionOrder.push(id);
  this.addChild(accordionSection);
};


/**
 * Renders the control
 */
DvtAccordion.prototype.render = function() {
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
DvtAccordion.prototype.setMaxHeight = function(h) {
  this._maxHeight = h;
};


/**
 * Gets max available height
 * @return {number} max available height
 */
DvtAccordion.prototype.getMaxHeight = function() {
  return this._maxHeight;
};


/**
 * Sets max available width
 * @param {number} w max available width
 */
DvtAccordion.prototype.setMaxWidth = function(w) {
  this._maxWidth = w;
};


/**
 * Gets max available width
 * @return {number} max available width
 */
DvtAccordion.prototype.getMaxWidth = function() {
  return this._maxWidth;
};


/**
 * Sets min width for the control
 * @param {number} w min width for the control
 */
DvtAccordion.prototype.setMinWidth = function(w) {
  this._minWidth = w;
};


/**
 * Gets min width for the control
 * @return {number} min width for the control
 */
DvtAccordion.prototype.getMinWidth = function() {
  return this._minWidth;
};


/**
 * Updates accordion panel and resizes external container
 * @param {activeSectionId} activeSectionId section title
 */
DvtAccordion.prototype.update = function(activeSectionId) {
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
DvtAccordion.prototype.getMaxSectionWidth = function() {
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
DvtAccordion.prototype.getExpandedHeight = function() {
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
 * @return {DvtAccordionSection} Section by given index
 */
DvtAccordion.prototype.getSectionByIndex = function(index) {
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
 * @return {DvtAccordionSection} Section by given id
 */
DvtAccordion.prototype.getSectionById = function(sectionId) {
  return this._sections[sectionId];
};


/**
 * Sets "expand many" attribute for the control. Default value is false.
 * @param {boolean} bExpandMany True if more than one section can be expanded
 */
DvtAccordion.prototype.setExpandMany = function(bExpandMany) {
  this._bExpandMany = bExpandMany;
};


/**
 * Checks "expand many" attribute for the control. Default value is false.
 * @return {boolean} True if more than one section can be expanded
 */
DvtAccordion.prototype.canExpandMany = function() {
  return this._bExpandMany;
};


/**
 * Sets "collapse all" attribute for the control. Default value is false.
 * @param {boolean} bCollapseAll True if all section could be collapsed
 */
DvtAccordion.prototype.setCollapseAll = function(bCollapseAll) {
  this._bCollapseAll = bCollapseAll;
};


/**
 * Checks "collapse all" attribute for the control. Default value is false.
 * @return {boolean} True if all sections could be collapsed
 */
DvtAccordion.prototype.canCollapseAll = function() {
  return this._bCollapseAll;
};


/**
 * @private
 * Check if the given section can be collapsed
 * @param {DvtAccordionSection} section The section to check for collapsability
 */
DvtAccordion.prototype._canCollapseSection = function(section) {
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
DvtAccordion.prototype._drawSections = function() {
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
  this.FireListener(new DvtResizeEvent(dims.w, dims.h, 0, 0));
};

/**
 * Get accordion sections
 * @return {array} array of accordion sections
 */
DvtAccordion.prototype.getSections = function() {
  var sections = [];
  for (var i = 0; i < this._sectionOrder.length; i++) {
    sections.push(this.getSectionByIndex(i));
  }
  return sections;
};

/**
 *  @constructor
 *  Creates an accordion section
 *  @param {DvtContext} context object
 *  @param {DvtContainer} section content (doesn't include header)
 *  @param {string} title section title
 *  @param {Boolean} isActive Indicates if the section initially opened
 *  @param {Boolean} isCollapsible Indicates if the section is collapsible
 *  @param {DvtAccordion} parent
 *  @param {DvtEventManager} eventManager
 *  @param {string} id Section id
 *  @param {images} images for the control
 *  @param {Object} styleMap for the control
 */
var DvtAccordionSection = function(context, section, title, isActive, isCollapsible, parent, eventManager, id, images, styleMap) {
  this.Init(context, section, title, isActive, isCollapsible, parent, eventManager, id, images, styleMap);
};

DvtObj.createSubclass(DvtAccordionSection, DvtContainer, 'DvtAccordionSection');


/**
 * @protected
 * Initialization method called by the constructor
 * @param {DvtContext} context object
 * @param {DvtContainer} section content (doesn't include header)
 * @param {string} title section title
 * @param {Boolean} isActive Indicates if the section initially opened
 * @param {Boolean} isCollapsible Indicates if the section is collapsible
 * @param {DvtAccordion} parent
 * @param {DvtEventManager} eventManager
 * @param {string} id Section id
 * @param {images} images for the control
 * @param {Object} styleMap for the control
 */
DvtAccordionSection.prototype.Init = function(context, section, title, isActive, isCollapsible, parent, eventManager, id, images, styleMap) {
  DvtAccordionSection.superclass.Init.call(this, context, null, id);
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
DvtAccordionSection.prototype.getId = function() {
  return this._id;
};


/**
 * Returns section title
 *
 * @return {string}
 */
DvtAccordionSection.prototype.getTitle = function() {
  return this._title;
};


/**
 * Sets active indicator
 *
 * @param {Boolean} active
 */
DvtAccordionSection.prototype.setActive = function(active) {
  this._isActive = active;
};


/**
 * Returns whether section is active
 *
 * @return {Boolean}
 */
DvtAccordionSection.prototype.isActive = function() {
  return this._isActive;
};


/**
 * Returns whether section is collapsible
 *
 * @return {Boolean}
 */
DvtAccordionSection.prototype.isCollapsible = function() {
  return this._isCollapsible;
};


/**
 * Returns content dimentsions (does not include title bar)
 *
 * @return {DvtRect}
 */
DvtAccordionSection.prototype.getContentDimensions = function() {
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
 * @return {DvtRect}
 */
DvtAccordionSection.prototype.getExpandedDimensions = function() {
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
DvtAccordionSection.prototype.render = function(width) {

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
DvtAccordionSection.prototype.collapse = function() {
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
DvtAccordionSection.prototype.expand = function() {
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
 * @param {DvtMouseEvent} event
 * @protected
 */
DvtAccordionSection.prototype.HandleHeaderClick = function(event) {
  this._parent.update(this.getId());
};


/**
 * @protected
 */
DvtAccordionSection.prototype.GetTitleDimensions = function() {
  if (!this._titleDim) {
    var text = new DvtOutputText(this._context, this._title);
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
DvtAccordionSection.prototype.SetTitleDimensions = function(dim) {
  if (!this._titleDim || this._titleDim.w < dim.w || this._titleDim.h < dim.h)
    this._titleDim = dim;
};


/**
 * @private
 * Creates section header
 * @param {number} width Section width
 * @param {number} height Section height
 */
DvtAccordionSection.prototype._createHeader = function(width, height) {

  // create header
  if (this.isCollapsible()) {
    var ena, ovr, dwn;
    var ariaLabel;
    if (this._images.getAttr) {  //XML Node
      ena = this._createHeaderState(DvtButton.STATE_ENABLED, this._images.getAttr(DvtAccordion.EXPAND_ENA), this._title, width, height);
      ovr = this._createHeaderState(DvtButton.STATE_OVER, this._images.getAttr(DvtAccordion.EXPAND_OVR), this._title, width, height);
      dwn = this._createHeaderState(DvtButton.STATE_DOWN, this._images.getAttr(DvtAccordion.EXPAND_DWN), this._title, width, height);
    } else {  //JSON Object
      ena = this._createHeaderState(DvtButton.STATE_ENABLED, this._images[DvtAccordion.EXPAND_ENA], this._title, width, height);
      ovr = this._createHeaderState(DvtButton.STATE_OVER, this._images[DvtAccordion.EXPAND_OVR], this._title, width, height);
      dwn = this._createHeaderState(DvtButton.STATE_DOWN, this._images[DvtAccordion.EXPAND_DWN], this._title, width, height);
    }
    this._expandedBtn = new DvtButton(this._context, ena, ovr, dwn);
    this._expandedBtn.setAriaRole('button');
    ariaLabel = DvtDisplayable.generateAriaLabel(this._title, [DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'STATE_EXPANDED')]);
    this._expandedBtn.setAriaProperty('label', ariaLabel);

    if (this._images.getAttr) {
      ena = this._createHeaderState(DvtButton.STATE_ENABLED, this._images.getAttr(DvtAccordion.COLLAPSE_ENA), this._title, width, height);
      ovr = this._createHeaderState(DvtButton.STATE_OVER, this._images.getAttr(DvtAccordion.COLLAPSE_OVR), this._title, width, height);
      dwn = this._createHeaderState(DvtButton.STATE_DOWN, this._images.getAttr(DvtAccordion.COLLAPSE_DWN), this._title, width, height);
    } else {
      ena = this._createHeaderState(DvtButton.STATE_ENABLED, this._images[DvtAccordion.COLLAPSE_ENA], this._title, width, height);
      ovr = this._createHeaderState(DvtButton.STATE_OVER, this._images[DvtAccordion.COLLAPSE_OVR], this._title, width, height);
      dwn = this._createHeaderState(DvtButton.STATE_DOWN, this._images[DvtAccordion.COLLAPSE_DWN], this._title, width, height);
    }
    this._collapsedBtn = new DvtButton(this._context, ena, ovr, dwn);
    this._collapsedBtn.setAriaRole('button');
    ariaLabel = DvtDisplayable.generateAriaLabel(this._title, [DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'STATE_COLLAPSED')]);
    this._collapsedBtn.setAriaProperty('label', ariaLabel);

    this._eventManager.associate(this._expandedBtn, this);
    this._eventManager.associate(this._collapsedBtn, this);
  }
  else {
    var base = this._createButtonBase(DvtButton.STATE_DISABLED, width, height);
    var text = this._createButtonText(DvtButton.STATE_DISABLED, this._title);
    this._header = new DvtContainer(this._context);
    this._header.addChild(base);
    this._header.addChild(text);
  }
};


/**
 * @private
 * Helper function that creates header state
 * @param {number} state One of the buttons staes : DvtButton.STATE_ENABLED, DvtButton.STATE_OVER, DvtButton.STATE_DOWN
 * @param {string} uri The URL to the collapse/expand image used in the header state
 * @param {string} label Section label
 * @param {number} width Section width
 * @param {height} height Section height
 */
DvtAccordionSection.prototype._createHeaderState = function(state, uri, label, ww, hh) {

  var imageWidth = this._imageWidth;
  var imageHeight = this._imageHeight;
  var imageOffsetX = 0;
  var imageOffsetY = (this._headerHeight - imageHeight) / 2;

  var buttonState = new DvtContainer(this._context);
  var base = this._createButtonBase(state, ww, hh);
  buttonState.addChild(base);

  var image = uri ? new DvtImage(this._context, uri, imageOffsetX, imageOffsetY, imageWidth, imageHeight) : null;
  if (image)
    buttonState.addChild(image);

  // text will be attached to the buttonState by DvtTextUtils.fitText()
  var text = this._createButtonText(state, label, ww - imageWidth - imageOffsetX, hh, buttonState);

  if (!DvtAgent.isRightToLeft(this._context)) {
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
 * @param {number} state One of the buttons staes : DvtButton.STATE_ENABLED, DvtButton.STATE_OVER, DvtButton.STATE_DOWN
 * @param {string} label the button text
 * @param {number} ww the maximum width of the text
 * @param {number} hh the maximum height of the text
 * @param {DvtContainer} container the parent of the text
 */
DvtAccordionSection.prototype._createButtonText = function(state, label, ww, hh, container) {
  var text = null;
  if (label) {
    text = new DvtOutputText(this._context, label);
    text.setCSSStyle(this._titleStyle);
    DvtTextUtils.fitText(text, ww, hh, container);
    var dims = text.measureDimensions();
    this.SetTitleDimensions(dims);
    text.setTranslateY((this._headerHeight - dims.h) / 2);
  }
  return text;
};


/**
 * @private
 * @param {number} state One of the buttons staes : DvtButton.STATE_ENABLED, DvtButton.STATE_OVER, DvtButton.STATE_DOWN
 * @param {number} ww the base width
 * @param {number} hh the base height
 */
DvtAccordionSection.prototype._createButtonBase = function(state, ww, hh) {
  var style = null;
  switch (state) {
    case DvtButton.STATE_OVER:
      style = this._styleMap['sectionHeader']['styleOvr'];
      break;
    case DvtButton.STATE_DOWN:
      style = this._styleMap['sectionHeader']['styleDwn'];
      break;
    case DvtButton.STATE_DISABLED:
      style = this._styleMap['sectionHeader']['styleDis'];
      break;
    case DvtButton.STATE_ENABLED:
    default:
      style = this._styleMap['sectionHeader']['styleEna'];
  }
  var base = new DvtRect(this._context, 0, 0, ww, hh);
  base.setStroke(DvtAccordionSection._getStroke(style));
  base.setFill(DvtAccordionSection._getFill(style));
  return base;
};


/**
 * Helper function that gets fill value from the style map and creates a gradient or solid fill
 * @return {DvtLinearGradientFill|DvtSolidFill} section header fill
 */
DvtAccordionSection._getFill = function(style) {
  var color = style.getStyle(DvtCSSStyle.BACKGROUND_COLOR);
  var gradObj = style.getBackgroundImage();

  var fill = null;
  if (gradObj && (gradObj instanceof DvtCSSGradient)) {
    var arColors = gradObj.getColors();
    var arAlphas = gradObj.getAlphas();
    var arStops = gradObj.getRatios();
    var angle = gradObj.getAngle();
    fill = new DvtLinearGradientFill(angle, arColors, arAlphas, arStops);
  }
  else if (color)
    fill = new DvtSolidFill(color, 1);
  return fill;
};


/**
 * Helper function that gets stroke value from the style map and creates a stroke for the section border
 * @return {DvtSolidStroke} section header stroke for the section border
 */
DvtAccordionSection._getStroke = function(style) {
  var color = style.getStyle(DvtCSSStyle.BORDER_COLOR);
  return new DvtSolidStroke(color, 1, 1);
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtAccordionSection.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  var obj = this.isActive() ? this._expandedBtn : this._collapsedBtn;
  var bounds = obj.getDimensions();
  var stageP1 = obj.localToStage(new DvtPoint(bounds.x, bounds.y));
  var stageP2 = obj.localToStage(new DvtPoint(bounds.x + bounds.w, bounds.y + bounds.h));
  return new DvtRectangle(stageP1.x, stageP1.y, stageP2.x - stageP1.x, stageP2.y - stageP1.y);
};


/**
 * @override
 */
DvtAccordionSection.prototype.getTargetElem = function() 
{
  var obj = this.isActive() ? this._expandedBtn : this._collapsedBtn;
  return obj.getElem();
};

/**
 * @override
 */
DvtAccordionSection.prototype.showKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = true;
  this._keyboardFocusEffect.show();
  this._context.setActiveElement(this.isActive() ? this._expandedBtn : this._collapsedBtn); //accessibility feature
};


/**
 * @override
 */
DvtAccordionSection.prototype.hideKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = false;
  this._keyboardFocusEffect.hide();
};


/**
 * @override
 */
DvtAccordionSection.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


/**
 * @override
 */
DvtAccordionSection.prototype.getNextNavigable = function(event) 
{
  var keyboardHandler = this._eventManager.getKeyboardHandler();
  return keyboardHandler.getNextNavigable(this, event);
};


/**
 * Create keyboard focus effect around given object
 * @param {DvtImage|DvtText} obj an object around which keyboard effect will be created
 * @private
 */
DvtAccordionSection.prototype._createKeyboardFocusEffect = function(obj) {
  var dim = obj.getDimensions();
  var x = obj.getTranslateX() || dim.x;
  var y = obj.getTranslateY() || dim.y;
  this._keyboardFocusEffect = new DvtKeyboardFocusEffect(this.getCtx(), this, new DvtRectangle(x, y, dim.w, dim.h), null, null, true);
};
// Copyright (c) 2013, 2014, Oracle and/or its affiliates. All rights reserved.

/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {DvtBaseComponentDefaults}
 */
var DvtAccordionDefaults = function() {
  this.Init({'skyros': DvtAccordionDefaults.VERSION_1, 'alta': DvtAccordionDefaults.SKIN_ALTA});
};

DvtObj.createSubclass(DvtAccordionDefaults, DvtBaseComponentDefaults, 'DvtAccordionDefaults');


/**
 * Defaults for version 1.
 */
DvtAccordionDefaults.VERSION_1 = {
  'skin': DvtCSSStyle.SKIN_ALTA,
  'sectionHeader': {
    'styleEna': new DvtCSSStyle("font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;color:#252525;border-color:#D9DFE3;background-color:#F5F5F5;"),
    'styleOvr': new DvtCSSStyle("font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;color:#252525;border-color:#D9DFE3;background-color:#F5F5F5;"),
    'styleDwn': new DvtCSSStyle("font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;color:#252525;border-color:#D9DFE3;background-color:#F5F5F5;"),
    'styleDis': new DvtCSSStyle("font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;color:#252525;border-color:#D9DFE3;background-color:#F5F5F5;"),
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
 * @param {DvtContext} context The rendering context
 * @param {DvtEventManager} eventManager  Event manager to handle train button events
 * @param {Array} labels  Array of labels for items in Train
 * @param {Array} buttonStyles  Array of button DvtCSSStyle: TrainButtonStyle, TrainButtonHoverStyle and TrainButtonActiveStyle
 * @param {string} id  Train component Id
 * @param {boolean} isAltaSkin  flag value is true if the skin is Alta
 */
var DvtTrain = function(context, eventManager, labels, buttonStyles, id, isAltaSkin) {
  this.Init(context, eventManager, labels, buttonStyles, id, isAltaSkin);
};


/**
 * make DvtTrain a subclass of DvtContainer
 */
DvtObj.createSubclass(DvtTrain, DvtContainer, 'DvtTrain');

DvtTrain.TRAIN_EVENT = 'dvtTrain';
DvtTrain.FILL_COLOR = '#c0cbd5';
DvtTrain.BORDER_COLOR = '#5d7891';
DvtTrain.SELECTED_FILL_COLOR = '#61bde3';
DvtTrain.SELECTED_BORDER_COLOR = '#0066ff';
DvtTrain.BUTTON_SIZE = 8;
DvtTrain.VPADDING = 1;
DvtTrain.HPADDING = 3;

DvtTrain.STATE_ENABLED = 0;
DvtTrain.STATE_HOVER = 1;
DvtTrain.STATE_SELECTED = 2;

/**
 * @protected
 * Initialization method called by the constructor
 *
 * @param {DvtContext} context The rendering context
 * @param {DvtEventManager} eventManager  Event manager to handle train button events
 * @param {Array} labels  Array of labels for items in Train
 * @param {Array} buttonStyles  Array of button DvtCSSStyle: TrainButtonStyle, TrainButtonHoverStyle and TrainButtonActiveStyle
 * @param {string} id  Train component Id
 * @param {boolean} isAltaSkin  flag value is true if the skin is Alta
 */
DvtTrain.prototype.Init = function(context, eventManager, labels, buttonStyles, id, isAltaSkin) {
  DvtTrain.superclass.Init.call(this, context, null, id);

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
DvtTrain.prototype.setSelectedIndex = function(index) {
  if (index >= 0 && index < this._count) {
    this.SelectedIndexChanged(this._selectedIndex, index);
  }
};


/**
 * Get the selected index of the train.
 *
 * @return selected index
 */
DvtTrain.prototype.getSelectedIndex = function() {
  return this._selectedIndex;

};

/**
 * Get the train buttons
 *
 * @return {array} array of DvtButtons
 */
DvtTrain.prototype.getButtons = function() {
  return this._buttons;
};


/**
 * Handle a click event on a train item.
 *
 * @param event mouse click event
 */
DvtTrain.prototype.HandleClick = function(event) {

  //don't want click to fall through to rest of node
  DvtEventManager.consumeEvent(event);

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
DvtTrain.prototype.SelectedIndexChanged = function(oldIndex, newIndex) {
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
DvtTrain.prototype.addTrainEventListener = function(listener, obj) {
  this.addEvtListener(DvtTrain.TRAIN_EVENT, listener, false, obj);
};


/**
 * Remove a TrainEvent listener from this train.
 * @param {function} listener the function to call
 * @param {object} obj instance of the object the listener is defined on
 */
DvtTrain.prototype.removeTrainEventListener = function(listener, obj) {
  this.removeEvtListener(DvtTrain.TRAIN_EVENT, listener, false, obj);
};


/**
 * Fire a train event.
 */
DvtTrain.prototype.fireTrainEvent = function() {
  var event = new DvtTrainEvent(this._selectedIndex);
  this.FireListener(event, false);
};


/**
 * Render this train.
 * @param {DvtEventManager} eventManager  Event manager to handle train button events
 */
DvtTrain.prototype.RenderSelf = function(eventManager) {
  var bBiDi = DvtAgent.isRightToLeft(this.getCtx());
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

    var vPadding = this._isAltaSkin ? 0 : DvtTrain.VPADDING;
    button.setTranslate(j * (buttonSize + DvtTrain.HPADDING), vPadding);
    this.addChild(button);

    this._buttons[i] = button;
  }
};

DvtTrain.prototype.DrawButtonState = function(buttonSize, bSelected) {
  var buttonStyle;
  var bdColor;
  var bgColor;
  var offset;

  if (bSelected) {
    offset = 0;
    bgColor = DvtTrain.SELECTED_FILL_COLOR;
    bdColor = DvtTrain.SELECTED_BORDER_COLOR;
    if (this._buttonStyles)
      buttonStyle = this._buttonStyles[DvtTrain.STATE_SELECTED];
  }
  else {
    offset = 1;
    bgColor = DvtTrain.FILL_COLOR;
    bdColor = DvtTrain.BORDER_COLOR;
    if (this._buttonStyles)
      buttonStyle = this._buttonStyles[DvtTrain.STATE_ENABLED];
  }

  if (buttonStyle) {
    if (buttonStyle.getStyle(DvtCSSStyle.BORDER_COLOR)) {
      bdColor = buttonStyle.getStyle(DvtCSSStyle.BORDER_COLOR);
    }
    if (buttonStyle.getStyle(DvtCSSStyle.BACKGROUND_COLOR)) {
      bgColor = buttonStyle.getStyle(DvtCSSStyle.BACKGROUND_COLOR);
    }
  }

  var shape = new DvtRect(this.getCtx(), offset, offset,
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
DvtTrain.prototype.addButtonListeners = function(button) {
  button.addEvtListener(DvtTouchEvent.TOUCHSTART, this.HandleClick, false, this);
  if (!DvtAgent.isTouchDevice()) {
    button.addEvtListener(DvtMouseEvent.CLICK, this.HandleClick, false, this);
  }
};


/**
 * Remove listeners from a button.
 *
 * @param button button to remove listeners from
 */
DvtTrain.prototype.removeButtonListeners = function(button) {
  button.removeEvtListener(DvtTouchEvent.TOUCHSTART, this.HandleClick, false, this);
  if (!DvtAgent.isTouchDevice()) {
    button.removeEvtListener(DvtMouseEvent.CLICK, this.HandleClick, false, this);
  }
};

DvtTrain.prototype._getButtonSize = function() {
  if (! this._buttonSize) {
    if (this._buttonStyles) {
      //assume they are all the same size for now
      var buttonStyle = this._buttonStyles[0];
      if (buttonStyle) {
        this._buttonSize = DvtCSSStyle.toNumber(buttonStyle.getWidth());
      }
    }
    if (! this._buttonSize)
      this._buttonSize = DvtTrain.BUTTON_SIZE;
  }
  return this._buttonSize;
};

DvtTrain.prototype.CreateButtonState = function(url, buttonSize) {
  return new DvtImage(this.getCtx(), url, 0, 0, buttonSize, buttonSize);
};

DvtTrain.prototype.MakeButtonState = function(buttonSize, state, bSelected ) {
  var style = this._buttonStyles ? this._buttonStyles[state] : null;
  var url = style ? style.getIconUrl() : null;

  var shape = url ? this.CreateButtonState(url, buttonSize) :
                    this.DrawButtonState(buttonSize, (state == DvtTrain.STATE_SELECTED));

  shape.setCursor((state == DvtTrain.STATE_ENABLED || bSelected) ?
                  'default' : 'pointer');

  return shape;
};

DvtTrain.prototype.CreateButton = function(buttonSize, bSelected, tooltip) {
  var button = new DvtButton(this.getCtx(),
                             this.MakeButtonState(buttonSize, DvtTrain.STATE_ENABLED, bSelected),
                             this.MakeButtonState(buttonSize, DvtTrain.STATE_HOVER, bSelected),
                             this.MakeButtonState(buttonSize, DvtTrain.STATE_SELECTED, bSelected),
                             null);

  button.setTooltip(tooltip);
  button.setToggleEnabled(true);
  if (bSelected)
    button.setToggled(bSelected);

  return button;
};

/*
DvtTrain.prototype.destroy = function (listener) {
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
 * @export
 */
var DvtTrainEvent = function(index) {
  this.Init(DvtTrainEvent.TYPE);
  this.type = this.getType();
  this._index = index;
};

DvtObj.createSubclass(DvtTrainEvent, DvtBaseComponentEvent, 'DvtTrainEvent');


/**
 * @export
 */
DvtTrainEvent.TYPE = 'dvtTrain';


/**
 * Returns the index of the selected button
 * @return {index} The selected button
 * @export
 */
DvtTrainEvent.prototype.getIndex = function() {
  return this._index;
};
// Copyright (c) 2008, 2014, Oracle and/or its affiliates. All rights reserved.
/**
 * Creates an Overview window component
 * @class DvtOverviewWindow
 * @constructor
 *
 * @param {DvtContext} context The rendering context
 * @param {string} id the id of the overview window
 * @param {number} x The leftmost position of the Overview window
 * @param {number} y The topmost position of the Overview window
 * @param {number} ww The width of the Overview window
 * @param {number} hh The height of the Overview window
 */
var DvtOverviewWindow = function(context, id, x, y, ww, hh)
{
  this.Init(context, id, x, y, ww, hh);
};

DvtObj.createSubclass(DvtOverviewWindow, DvtContainer, 'DvtOverviewWindow');

DvtOverviewWindow.VIEWPORT_BG_COLOR = 'viewport-bg-color';
DvtOverviewWindow.VIEWPORT_BORDER_COLOR = 'viewport-border-color';

DvtOverviewWindow.OVERVIEW_DISCLOSED_KEY = 'isOverviewDisclosed';


/**
 * Initialization method called by the constructor
 *
 * @param {DvtContext} context The rendering context
 * @param {string} id the id of the overview window
 * @param {number} x The leftmost position of the Overview window
 * @param {number} y The topmost position of the Overview window
 * @param {number} ww The width of the Overview window
 * @param {number} hh The height of the Overview window
 */
DvtOverviewWindow.prototype.Init = function(context, id, x, y, ww, hh) {
  DvtOverviewWindow.superclass.Init.call(this, context, null, id);
  this._x = x;
  this._y = y;
  this._ww = ww;
  this._hh = hh;

  this._skinStyle = null;
};


/**
 * Renders the overview window
 */
DvtOverviewWindow.prototype.render = function()
{
  this._md = false;
  this._panEnable = true;

  if (this._overview) {
    if (DvtAgent.isTouchDevice()) {
      this._overview.removeEvtListener(DvtTouchEvent.TOUCHSTART, this._mouseDown, false, this);
      this._overview.removeEvtListener(DvtTouchEvent.TOUCHMOVE, this._mouseMove, false, this);
      this._overview.removeEvtListener(DvtTouchEvent.TOUCHEND, this._mouseUp, false, this);
    }
    else {
      this._overview.removeEvtListener(DvtMouseEvent.MOUSEDOWN, this._mouseDown, false, this);
      this._overview.removeEvtListener(DvtMouseEvent.MOUSEMOVE, this._mouseMove, false, this);
      this._overview.removeEvtListener(DvtMouseEvent.MOUSEUP, this._mouseUp, false, this);
      this._overview.removeEvtListener(DvtMouseEvent.MOUSEOUT, this._mouseOut, false, this);
    }
    this._overview.setClipPath(null);
  }
  this.removeChildren();
  this._viewport = null;
  this._overview = null;

  var clipPath = new DvtClipPath(this.getId());
  clipPath.addRect(0.0, 0.0, this._ww, this._hh);
  this._overview = new DvtRect(this._context, 0.0, 0.0, this._ww, this._hh);
  this._overview.setClipPath(clipPath);
  this._overview.setInvisibleFill();
  this.addChild(this._overview);

  // Create viewport
  this._viewport = new DvtRect(this._context, 0.0, 0.0, 0.0, 0.0, this.getId() + ':' + 'viewport');
  var bgColor = this.getSkinStyleAttr(DvtOverviewWindow.VIEWPORT_BG_COLOR);
  var borderColor = this.getSkinStyleAttr(DvtOverviewWindow.VIEWPORT_BORDER_COLOR);

  this._viewport.setSolidStroke(borderColor, null, 2);
  this._viewport.setSolidFill(bgColor);
  this._viewport.setMouseEnabled(false);
  this._overview.addChild(this._viewport);

  if (DvtAgent.isTouchDevice()) {
    this._overview.addEvtListener(DvtTouchEvent.TOUCHSTART, this._mouseDown, false, this);
    this._overview.addEvtListener(DvtTouchEvent.TOUCHMOVE, this._mouseMove, false, this);
    this._overview.addEvtListener(DvtTouchEvent.TOUCHEND, this._mouseUp, false, this);
  }
  else {
    this._overview.addEvtListener(DvtMouseEvent.MOUSEDOWN, this._mouseDown, false, this);
    this._overview.addEvtListener(DvtMouseEvent.MOUSEMOVE, this._mouseMove, false, this);
    this._overview.addEvtListener(DvtMouseEvent.MOUSEUP, this._mouseUp, false, this);
    this._overview.addEvtListener(DvtMouseEvent.MOUSEOUT, this._mouseOut, false, this);
  }
};

DvtOverviewWindow.prototype.loadXmlNode = function(ovNode) 
{
  //TODO
  this._isDisclosed = ovNode.getAttr('disclosed') == 'true';
};

DvtOverviewWindow.prototype.isDisclosed = function() 
{
  return this._isDisclosed;
};

DvtOverviewWindow.prototype.setDisclosed = function(bDisclosed) {
  this._isDisclosed = bDisclosed;
};

DvtOverviewWindow.prototype.getContentAreaWidth = function()
{
  return this.getContentDimensions().w;
};

DvtOverviewWindow.prototype.getContentAreaHeight = function()
{
  return this.getContentDimensions().h;
};

DvtOverviewWindow.prototype.getContentDimensions = function() 
{
  return new DvtRectangle(this._x, this._y, this._ww, this._hh);
};


/**
 * Sets the dimensions of the viewport within the overviewWindow.
 *
 * @param {DvtRectangle} dim The dimensions of the viewport (in content coordinates)
 * @param {DvtAnimator} animator An optional animator for animating the change
 *
 */
DvtOverviewWindow.prototype.setViewportDimensions = function(dim, animator)
{
  var topLeft = this.TransformFromContentToViewportCoords(dim.x, dim.y, animator);
  var bottomRight = this.TransformFromContentToViewportCoords(dim.x + dim.w, dim.y + dim.h, animator);
  var vx = topLeft.x;
  var vy = topLeft.y;
  var vw = bottomRight.x - topLeft.x;
  var vh = bottomRight.y - topLeft.y;

  if (animator) {
    animator.addProp(DvtAnimator.TYPE_NUMBER, this._viewport, this._viewport.getX, this._viewport.setX, vx);
    animator.addProp(DvtAnimator.TYPE_NUMBER, this._viewport, this._viewport.getY, this._viewport.setY, vy);
    animator.addProp(DvtAnimator.TYPE_NUMBER, this._viewport, this._viewport.getWidth, this._viewport.setWidth, vw);
    animator.addProp(DvtAnimator.TYPE_NUMBER, this._viewport, this._viewport.getHeight, this._viewport.setHeight, vh);
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
 * @return {DvtRectangle} The dimensions of the viewport (in content coordinates)
 */
DvtOverviewWindow.prototype.getViewportDimensions = function() {
  var topLeft = this.TransformFromViewportToContentCoords(
      this._viewport.getX(), this._viewport.getY());
  var bottomRight = this.TransformFromViewportToContentCoords(
      this._viewport.getX() + this._viewport.getWidth(),
      this._viewport.getY() + this._viewport.getHeight());
  return new DvtRectangle(topLeft.x, topLeft.y,
                          bottomRight.x - topLeft.x,
                          bottomRight.y - topLeft.y);
};

/**  Determine whether the viewport is pannable or not
  *
  *  @param {Boolean} pan         True if you can pan the viewport
  *
  */

DvtOverviewWindow.prototype.setPanEnabled = function(pan)
{
  this._panEnable = pan;
};


/**
  *  @return {Boolean}  Return true if the viewport is pannable
  */
DvtOverviewWindow.prototype.isPanEnabled = function()
{
  return this._panEnable;
};


/**
 * Sets the content for this overview window
 *
 * @param {DvtDisplayable} content the content for this overview window
 */
DvtOverviewWindow.prototype.setContent = function(content) {
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
 * @param {DvtMouseEvent} the mouse down event
 */
DvtOverviewWindow.prototype._mouseDown = function(evt) {
  if (!this._md && this._panEnable) {
    this._md = true;
    var offset = this._getRelativePosition(evt);
    var viewportEvent = new ViewportChangeEvent(this.getViewportDimensions(), this._getCenteredViewportDimensions(offset), evt);
    this.FireListener(viewportEvent);
  }
};


/**
 * Handler for the mouse move event
 *
 * @param {DvtMouseEvent} the mouse move event
 */
DvtOverviewWindow.prototype._mouseMove = function(evt) {
  if (this._md && this._panEnable) {
    var offset = this._getRelativePosition(evt);
    var viewportEvent = new ViewportChangeEvent(this.getViewportDimensions(), this._getCenteredViewportDimensions(offset), evt);
    this.FireListener(viewportEvent);
  }
};


/**
 * Handler for the mouse up event
 *
 * @param {DvtMouseEvent} the mouse up event
 */
DvtOverviewWindow.prototype._mouseUp = function(evt) {
  if (this._md && this._panEnable) {
    this._md = false;
  }
};


/**
 * Handler for the mouse out event
 *
 * @param {DvtMouseEvent} the mouse out event
 */
DvtOverviewWindow.prototype._mouseOut = function(evt) {
  this._mouseUp(evt);
};

DvtOverviewWindow.prototype._getRelativePosition = function(evt) {
  var pageX;
  var pageY;

  if (DvtAgent.isTouchDevice()) {
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
DvtOverviewWindow.prototype.TransformFromViewportToContentCoords = function(vx, vy)
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
  return new DvtPoint(cx, cy);
};


/**
 * @protected
 */
DvtOverviewWindow.prototype.TransformFromContentToViewportCoords = function(cx, cy, animator)
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
  return new DvtPoint(vx, vy);
};

DvtOverviewWindow.prototype.getSkinStyle = function() {
  return this._skinStyle;
};

DvtOverviewWindow.prototype.setSkinStyle = function(skinStyle) {
  this._skinStyle = skinStyle;
};

DvtOverviewWindow.prototype.getSkinStyleAttr = function(attr) {
  // Note: this._skinStyle is a map, not a DvtCSSStyle
  if (this._skinStyle && this._skinStyle[attr] != 'undefined')
    return this._skinStyle[attr];
  else
    return null;
};


/**
 * Gets the dimensions for a viewport centered at the specified position
 *
 * @param {DvtPoint} pos the position to center the viewport
 * @return {DvtRectangle} the centered viewport dimensions
 */
DvtOverviewWindow.prototype._getCenteredViewportDimensions = function(pos) {
  var overviewStart = this._overview.localToStage(new DvtPoint(0, 0));
  var viewportDims = this._viewport.getDimensions();
  var centeredViewportX = (pos.x - overviewStart.x) - viewportDims.w / 2;
  var centeredViewportY = (pos.y - overviewStart.y) - viewportDims.h / 2;
  var topLeft = this.TransformFromViewportToContentCoords(centeredViewportX, centeredViewportY);
  var bottomRight = this.TransformFromViewportToContentCoords(centeredViewportX + viewportDims.w, centeredViewportY + viewportDims.h);
  return new DvtRectangle(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
};

DvtOverviewWindow.prototype.SetViewportRectangle = function(rect) {
  this._viewport.setX(rect.x);
  this._viewport.setY(rect.y);
  this._viewport.setWidth(rect.w);
  this._viewport.setHeight(rect.h);
};

DvtOverviewWindow.prototype.GetViewportRectangle = function() {
  return new DvtRectangle(this._viewport.getX(), this._viewport.getY(), this._viewport.getWidth(), this._viewport.getHeight());
};


/**
 * @override
 */
DvtOverviewWindow.prototype.getDimensions = function(targetCoordinateSpace) {
  var bounds = new DvtRectangle(0, 0, this._ww, this._hh);
  if (!targetCoordinateSpace || targetCoordinateSpace === this)
    return bounds;
  else { // Calculate the bounds relative to the target space
    return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
  }
};

/**
 * @override
 */
DvtOverviewWindow.prototype.getDimensionsWithStroke = function(targetCoordinateSpace) {
  return this.getDimensions(targetCoordinateSpace);
};

DvtBundle.addDefaultStrings(DvtBundle.SUBCOMPONENT_PREFIX, {
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



  return D;
});