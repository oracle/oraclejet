/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

(function(dvt) {
/**
 * Legend component.  This class should never be instantiated directly.  Use the
 * newInstance function instead.
 * @class
 * @constructor
 * @extends {dvt.BaseComponent}
 */
dvt.Legend = function() {};

dvt.Obj.createSubclass(dvt.Legend, dvt.BaseComponent);


/**
 * Returns a new instance of dvt.Legend.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {dvt.Legend}
 */
dvt.Legend.newInstance = function(context, callback, callbackObj) {
  var legend = new dvt.Legend();
  legend.Init(context, callback, callbackObj);
  return legend;
};


/**
 * Returns a copy of the default options for the specified skin.
 * @param {string} skin The skin whose defaults are being returned.
 * @return {object} The object containing defaults for this component.
 */
dvt.Legend.getDefaults = function(skin) 
{
  return (new DvtLegendDefaults()).getDefaults(skin);
};


/**
 * @override
 * @protected
 */
dvt.Legend.prototype.Init = function(context, callback, callbackObj) {
  dvt.Legend.superclass.Init.call(this, context, callback, callbackObj);
  this.setId('legend' + 1000 + Math.floor(Math.random() * 1000000000));//@RandomNumberOk

  // Create the defaults object
  this.Defaults = new DvtLegendDefaults();

  // Create the event handler and add event listeners
  this._eventManager = new DvtLegendEventManager(this);
  this._eventManager.addListeners(this);

  /**
   * The array of logical objects that corresponds to legend items.
   * @private
   */
  this._peers = [];
  /**
   * The array of logical objects that corresponds to section collapse buttons or legend items that are navigable.
   * @private
   */
  this._navigablePeers = [];
  /**
   * The object that stores the bounds for this legend
   * @private
   */
  this._bounds = null;
  /**
   * The object that stores the title objects for this legend
   * @private
   */
  this._titles = [];
};


/**
 * @override
 */
dvt.Legend.prototype.SetOptions = function(options) {
  if (options) {
    // Combine the user options with the defaults and store
    this.Options = this.Defaults.calcOptions(options);

    // Transfer the category visibility properties to the hiddenCategories.
    this._transferVisibilityProperties(this.Options['sections']);
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
dvt.Legend.prototype.getPreferredSize = function(options, maxWidth, maxHeight) {
  // Update the options object.
  this.SetOptions(options);

  // Set the layout flag to indicate this is a layout pass only
  this.getOptions()['isLayout'] = true;

  // Ask the legend to render its contents in the max space and find the space used.
  var availSpace = new dvt.Rectangle(0, 0, maxWidth, maxHeight);
  var dim = DvtLegendRenderer.render(this, availSpace);

  // Clear the rendered contents and reset state
  this.getOptions()['isLayout'] = false;

  // Return the space used
  return new dvt.Dimension(dim.w, dim.h);
};


/**
 * @override
 */
dvt.Legend.prototype.render = function(options, width, height) 
{
  // Update the options object if provided.
  this.SetOptions(options);

  // Update the width and height if provided.
  if (!isNaN(width) && !isNaN(height)) {
    this.Width = width;
    this.Height = height;
  }

  // Set the render flag to indicate we are rendering. Not being read correctly in flash - 
  this.getOptions()['isLayout'] = false;

  // Clear any contents rendered previously
  this.removeChildren();
  this._peers = [];
  this._navigablePeers = [];
  this._bounds = null;
  this._titles = [];

  // Set up keyboard handler on non-touch devices if the legend is interactive
  if (!dvt.Agent.isTouchDevice())
    this._eventManager.setKeyboardHandler(new DvtLegendKeyboardHandler(this._eventManager, this));

  this.UpdateAriaAttributes();

  // Render the legend
  var availSpace = new dvt.Rectangle(0, 0, this.Width, this.Height);
  this._contentDimensions = DvtLegendRenderer.render(this, availSpace);

  // Process highlightedCategories
  var highlightedCategories = this.getOptions()['highlightedCategories'];
  if (highlightedCategories && highlightedCategories.length > 0)
    this.highlight(highlightedCategories);

  return this._contentDimensions;
};

/**
 * @override
 */
dvt.Legend.prototype.highlight = function(categories) {
  // Update the options. Legend checks for any category instead of all, so we need to convert empty to null.
  this.getOptions()['highlightedCategories'] = (categories && categories.length > 0) ? categories.slice() : null;

  // Perform the highlighting
  dvt.CategoryRolloverHandler.highlight(categories, this.__getObjects(), true);
};


/**
 * Processes the specified event.
 * @param {object} event
 * @param {object} source The component that is the source of the event, if available.
 */
dvt.Legend.prototype.processEvent = function(event, source) {
  var type = event['type'];
  if (type == 'categoryHighlight') {
    if (this.getOptions()['hoverBehavior'] == 'dim') {
      var peers = this.__getObjects();

      // If the legend is not the source of the event, perform highlighting.
      if (this != source)
        this.highlight(event['categories']);

      for (var i = 0; i < peers.length; i++) {
        if (peers[i].getId() == event['categories']) {
          this.container.scrollIntoView(peers[i].getDisplayables()[0]);
          break;
        }
      }
    }
  }

  // Dispatch the event to the callback if it originated from this component or it is a popup/rollover event.
  if (this == source || type == 'adfShowPopup' || type == 'adfHidePopup') {
    this.dispatchEvent(event);
  }
};

/**
 * @override
 */
dvt.Legend.prototype.getEventManager = function() {
  return this._eventManager;
};


/**
 * Registers the object peer with the legend.  The peer must be registered to participate
 * in interactivity.
 * @param {DvtLegendObjPeer} peer
 */
dvt.Legend.prototype.__registerObject = function(peer) {
  if (peer.getDisplayables()[0] instanceof dvt.Button)
    this._navigablePeers.push(peer); // peer is navigable if associated with button
  else {
    // peer is navigable if associated with legend item using datatip, action, drilling, or hideShow is enabled
    var hideAndShow = this.getOptions()['hideAndShowBehavior'];
    if (peer.getDatatip() != null || peer.getAction() != null || peer.isDrillable() || (hideAndShow != 'none' && hideAndShow != 'off'))
      this._navigablePeers.push(peer);

    this._peers.push(peer);
  }
};


/**
 * Returns the peers for all objects within the legend.
 * @return {array}
 */
dvt.Legend.prototype.__getObjects = function() {
  return this._peers;
};

/**
 * Returns the keyboard navigables within the legend.
 * @return {array}
 */
dvt.Legend.prototype.__getKeyboardObjects = function() {
  return this._navigablePeers;
};

/**
 * Releases all component resources to prevent memory leaks.
 * @override
 */
dvt.Legend.prototype.destroy = function() {
  if (this._eventManager) {
    this._eventManager.removeListeners(this);
    this._eventManager.destroy();
    this._eventManager = null;
  }

  // Call super last during destroy
  dvt.Legend.superclass.destroy.call(this);
};

/**
 * Stores the bounds for this legend
 * @param {Object} bounds
 */
dvt.Legend.prototype.__setBounds = function(bounds) {
  this._bounds = bounds;
};


/**
 * Returns the bounds for this legend
 * @return {Object} the object containing the bounds for this legend
 */
dvt.Legend.prototype.__getBounds = function() {
  return this._bounds;
};

/**
 * Adds a title object to be stored by the legend
 * @param {object} title An object containing the text and the alignment
 */
dvt.Legend.prototype.__registerTitle = function(title) {
  this._titles.push(title);
};


/**
 * Returns the title objects for this legend
 * @return {array} An array containing the title objects for this legend
 */
dvt.Legend.prototype.__getTitles = function() {
  return this._titles;
};

/**
 * Returns the automation object for this chart
 * @return {dvt.Automation} The automation object
 */
dvt.Legend.prototype.getAutomation = function() {
  return new DvtLegendAutomation(this);
};

/**
 * Returns the keyboard-focused object of the legend
 * @return {DvtKeyboardNavigable} The focused object.
 */
dvt.Legend.prototype.getKeyboardFocus = function() {
  if (this._eventManager != null)
    return this._eventManager.getFocus();
  return null;
};

/**
 * Sets the navigable as the keyboard-focused object of the legend. It matches the id in case the legend
 * has been rerendered.
 * @param {DvtKeyboardNavigable} navigable The focused object.
 * @param {boolean} isShowingFocusEffect Whether the keyboard focus effect should be used.
 */
dvt.Legend.prototype.setKeyboardFocus = function(navigable, isShowingFocusEffect) {
  if (this._eventManager == null)
    return;

  var peers = this.__getKeyboardObjects();
  for (var i = 0; i < peers.length; i++) {
    if (peers[i].getId() == navigable.getId()) {
      this._eventManager.setFocusObj(peers[i]);
      if (isShowingFocusEffect)
        peers[i].showKeyboardFocusEffect();
      break;
    }
  }

  // Update the accessibility attributes
  var focus = this.getKeyboardFocus();
  if (focus) {
    var displayable = focus.getDisplayables()[0];
    displayable.setAriaProperty('label', focus.getAriaLabel());
    this.getCtx().setActiveElement(displayable);
  }
};


/**
 * @override
 */
dvt.Legend.prototype.getDimensions = function(targetCoordinateSpace) {
  var bounds = new dvt.Rectangle(0, 0, this.Width, this.Height);
  if (!targetCoordinateSpace || targetCoordinateSpace === this)
    return bounds;
  else { // Calculate the bounds relative to the target space
    return this.ConvertCoordSpaceRect(bounds, targetCoordinateSpace);
  }
};

/**
 * Returns the dimensions of the legend contents.
 * @param {dvt.Displayable} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {dvt.Rectangle} The bounds of the legend contents relative to the target coordinate space.
 */
dvt.Legend.prototype.getContentDimensions = function(targetCoordinateSpace) {
  if (!targetCoordinateSpace || targetCoordinateSpace === this)
    return this._contentDimensions;
  else { // Calculate the bounds relative to the target space
    return this.ConvertCoordSpaceRect(this._contentDimensions, targetCoordinateSpace);
  }
};

/**
 * @override
 */
dvt.Legend.prototype.GetComponentDescription = function() {
  return dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'LEGEND');
};

/**
 * Transfer categoryVisibility property from legend item to hiddenCategories on the legend.
 * @param {array} sections The array of legend section definitions
 * @private
 */
dvt.Legend.prototype._transferVisibilityProperties = function(sections) {
  if (!sections || sections.length <= 0)
    return;

  var hiddenCategories = this.getOptions()['hiddenCategories'];
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];

    // If this section has nested sections, recurse.
    if (section['sections'])
      hiddenCategories = this._transferVisibilityProperties(section['sections']);

    // Iterate through the items and transfer properties.
    var items = section['items'];
    if (!items || items.length <= 0)
      continue;

    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      var itemCategory = DvtLegendRenderer.getItemCategory(item);

      if (item['categoryVisibility'] == 'hidden' && dvt.ArrayUtils.getIndex(hiddenCategories, itemCategory) < 0)
        hiddenCategories.push(itemCategory);

      item['categoryVisibility'] = null;
    }
  }
};

/**
 * @override
 */
dvt.Legend.prototype.UpdateAriaAttributes = function() {
  if (this.IsParentRoot()) {
    var options = this.getOptions();
    var hideAndShow = options['hideAndShowBehavior'];
    if ((hideAndShow != 'off' && hideAndShow != 'none') || options['hoverBehavior'] == 'dim') {
      this.getCtx().setAriaRole('application');
      this.getCtx().setAriaLabel(dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'COLON_SEP_LIST',
          [dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'DATA_VISUALIZATION'), dvt.StringUtils.processAriaLabel(this.GetComponentDescription())]));
    }
  }
};

/**
 * Returns whether or not the legend has navigable peers
 * @return {boolean}
 */
dvt.Legend.prototype.isNavigable = function() {
  return this._navigablePeers.length > 0;
};
/**
 *  Provides automation services for a DVT component.
 *  @class DvtLegendAutomation
 *  @param {dvt.Legend} dvtComponent
 *  @implements {dvt.Automation}
 *  @constructor
 */
var DvtLegendAutomation = function(dvtComponent) {
  this._legend = dvtComponent;
  this._options = this._legend.getOptions();
};

dvt.Obj.createSubclass(DvtLegendAutomation, dvt.Automation);

/**
 * Valid subIds inlcude:
 * <ul>
 * <li>section[sectionIndex0]:item[itemIndex]</li>
 * </ul>
 * @override
 */
DvtLegendAutomation.prototype.GetSubIdForDomElement = function(displayable) {
  var logicalObj = this._legend.getEventManager().GetLogicalObject(displayable);
  if (logicalObj && (logicalObj instanceof DvtLegendObjPeer)) {
    var item = logicalObj.getData();
    var indexList = this._getIndicesFromItem(item, this._options);
    if (indexList)
      return 'section' + indexList;
  }
  return null;
};


/**
 * Returns the index values of the given legend item
 * @param {Object} item the legend item to find the indices of within legendOptions
 * @param {Object} legendOptions the legend options object
 * @return {String} [sectionIndex0] or [sectionIndex0]:item[itemIndex]
 * @private
 */
DvtLegendAutomation.prototype._getIndicesFromItem = function(item, legendOptions) {
  // If there are sections in this options object, recurse through the section object
  if (legendOptions['sections'] && legendOptions['sections'].length > 0) {
    for (var s = 0; s < legendOptions['sections'].length; s++) {
      if (legendOptions['sections'][s] == item)
        return '[' + s + ']';
      else {
        var itemIndex = this._getIndicesFromItem(item, legendOptions['sections'][s]);
        if (itemIndex)
          return '[' + s + ']' + itemIndex;
      }
    }
    return null;
  }
  // If we found the items list for a section, search the items of this section
  else if (legendOptions['items'] && legendOptions['items'].length > 0) {
    for (var i = 0; i < legendOptions['items'].length; i++) {
      if (legendOptions['items'][i] == item)
        return ':item[' + i + ']';
    }
    return null;
  }
};


/**
 * Returns the index values of the legend item that corresponds to the given series
 * @param {Object} series the chart series object
 * @param {Object} legendOptions the legend options object
 * @return {String} [sectionIndex0] or [sectionIndex0]:item[itemIndex]
 */
DvtLegendAutomation.prototype.getIndicesFromSeries = function(series, legendOptions) {
  // If there are sections in this options object, recurse through the section object
  if (legendOptions['sections'] && legendOptions['sections'].length > 0) {
    for (var s = 0; s < legendOptions['sections'].length; s++) {
      var itemIndex = this.getIndicesFromSeries(series, legendOptions['sections'][s]);
      if (itemIndex)
        return '[' + s + ']' + itemIndex;
    }
    return null;
  }
  // If we found the items list for a section, search the items of this section
  else if (legendOptions['items'] && legendOptions['items'].length > 0) {
    for (var i = 0; i < legendOptions['items'].length; i++) {
      if (legendOptions['items'][i]['text'] == series['name'])
        return ':item[' + i + ']';
    }
    return null;
  }
};


/**
 * Returns the legend item for the given subId
 * @param {Object} options the legend options object
 * @param {String} subId the subId of the desired legend item
 * @return {Object} the legend item corresponding to the given subId
 */
DvtLegendAutomation.prototype.getLegendItem = function(options, subId) {
  var openParen = subId.indexOf('[');
  var closeParen = subId.indexOf(']');
  if (openParen >= 0 && closeParen >= 0) {
    var index = subId.substring(openParen + 1, closeParen);
    var colonIndex = subId.indexOf(':');
    subId = subId.substring(closeParen + 1);
    var nextOpenParen = subId.indexOf('[');
    var nextCloseParen = subId.indexOf(']');
    // If there is another index layer recurse into the sections object at that index
    if (nextOpenParen >= 0 && nextCloseParen >= 0) {
      return this.getLegendItem(options['sections'][index], subId);
    }
    else { // If we are at the last index return the item/section object at that index
      if (colonIndex == 0)
        return options['items'][index];
      else
        return options['sections'][index];
    }
  }
};


/**
 * Valid subIds inlcude:
 * <ul>
 * <li>section[sectionIndex0]:item[itemIndex]</li>
 * <li>tooltip</li>
 * </ul>
 * @override
 */
DvtLegendAutomation.prototype.getDomElementForSubId = function(subId) {
  // tooltip
  if (subId == dvt.Automation.TOOLTIP_SUBID)
    return this.GetTooltipElement(this._legend);

  var legendItem = this.getLegendItem(this._options, subId);
  var legendPeers = this._legend.__getObjects();

  // Find the legend object peer for the item indexed by the subId and return the dom element of its displayable
  for (var i = 0; i < legendPeers.length; i++) {
    var item = legendPeers[i].getData();
    if (legendItem == item)
      return legendPeers[i].getDisplayables()[0].getElem();
  }
  return null;
};


/**
 * Returns the legend title. Used for verification.
 * @return {String} The legend title
 */
DvtLegendAutomation.prototype.getTitle = function() {
  return this._options['title'];
};


/**
 * Returns an object containing data for a legend item. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>text</li>
 * </ul>
 * @param {String} subIdPath The array of indices in the subId for the desired legend item
 * @return {Object} An object containing data for the legend item
 */
DvtLegendAutomation.prototype.getItem = function(subIdPath) {
  var item;
  var index = subIdPath.shift();
  var options = this._options;
  while (index != undefined) {
    if (subIdPath.length > 0)
      options = options['sections'][index];
    else
      item = options['items'][index];
    index = subIdPath.shift();
  }
  if (item)
    return {'text': item['text'] ? item['text'] : null};
  return null;
};

/**
 * Returns an object containing data for a legend section. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>title</li>
 * <li>item</li>
 * <li>section</li>
 * </ul>
 * @param {String} subIdPath The array of indices in the subId for the desired legend section
 * @return {Object} An object containing data for the legend section
 */
DvtLegendAutomation.prototype.getSection = function(subIdPath) {
  var section;
  var index = subIdPath.shift();
  var options = this._options;
  while (index != undefined) {
    if (subIdPath.length > 0)
      options = options['sections'][index];
    else
      section = options['sections'][index];
    index = subIdPath.shift();
  }
  var sectionData = {
    'title': section['title'] ? section['title'] : null,
    'items' : section['items'] ? this._generateItemObjects(section['items']) : null,
    'sections': section['sections'] ? this._generateSectionObjects(section['sections']) : null
  };

  return sectionData;
};

/**
 * Returns an array containing data for an array of legend items
 * @param {Array} items The array of legend items
 * @return {Array} An array containing objects with data for each legend item
 * @private
 */
DvtLegendAutomation.prototype._generateItemObjects = function(items) {
  var itemDataArray = [];

  for (var i = 0; i < items.length; i++) {
    itemDataArray.push({'text': items[i]['text']});
  }

  return itemDataArray;
};

/**
 * Returns an array containing data for an array of legend sections
 * @param {Array} sections The array of legend sections
 * @return {Array} An array containing objects with data for each legend section
 * @private
 */
DvtLegendAutomation.prototype._generateSectionObjects = function(sections) {
  var sectionDataArray = [];

  for (var i = 0; i < sections.length; i++) {
    sectionDataArray.push({
      'title': sections[i]['title'] ? sections[i]['title'] : null,
      'items' : sections[i]['items'] ? this._generateItemObjects(sections[i]['items']) : null,
      'sections': sections[i]['sections'] ? this._generateSectionObjects(sections[i]['sections']) : null
    });
  }

  return sectionDataArray;
};
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {dvt.BaseComponentDefaults}
 */
var DvtLegendDefaults = function() {
  this.Init({'skyros': DvtLegendDefaults.VERSION_1, 'alta': DvtLegendDefaults.SKIN_ALTA, 'next': DvtLegendDefaults.SKIN_NEXT});
};

dvt.Obj.createSubclass(DvtLegendDefaults, dvt.BaseComponentDefaults);

/**
 * Contains overrides for the 'next' skin.
 */
DvtLegendDefaults.SKIN_NEXT = {
  'skin': dvt.CSSStyle.SKIN_NEXT,
  'titleStyle': new dvt.CSSStyle('color: #737373;'),
  '_sectionTitleStyle': new dvt.CSSStyle('color: #737373;'),
  'layout': {
    'titleGapWidth': 17, 'titleGapHeight': 9,
    'symbolGapWidth': 7, 'symbolGapHeight': 4,
    'rowGap': 4, 'columnGap': 10,
    'sectionGapHeight': 16, 'sectionGapWidth': 24
  }
};


/**
 * Contains overrides for the 'alta' skin.
 */
DvtLegendDefaults.SKIN_ALTA = {
  'skin': dvt.CSSStyle.SKIN_ALTA,
  'textStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA),
  'titleStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_11 + 'color: #333333;'),
  '_sectionTitleStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_11 + 'color: #333333;')
};


/**
 * Defaults for version 1.
 */
DvtLegendDefaults.VERSION_1 = {
  'skin': dvt.CSSStyle.SKIN_SKYROS,
  'orientation': 'vertical',
  'position': null,
  'backgroundColor': null,
  'borderColor': null,
  'textStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS + 'font-size: 11px; color: #333333;'),
  'titleStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_SKYROS + 'font-size: 12px; color: #003d5b;'),
  'titleHalign': 'start',
  'hiddenCategories': [],
  'hideAndShowBehavior': 'off',
  'hoverBehavior': 'none',
  'hoverBehaviorDelay' : 200,
  'scrolling': 'asNeeded',
  'halign': 'start',
  'valign': 'top',
  'drilling': 'off',

  // default color, marker shape, and line width, for internal use
  '_color': '#a6acb1',
  '_markerShape': 'square',
  '_lineWidth': 3,

  //*********** Internal Attributes *************************************************//
  'layout': {
    'outerGapWidth': 3, 'outerGapHeight': 3, // Used by Treemap for legend creation
    'titleGapWidth': 8, 'titleGapHeight': 3,
    'symbolGapWidth': 5, 'symbolGapHeight': 4,
    'rowGap': 0, 'columnGap': 8,
    'sectionGapHeight': 6, 'sectionGapWidth': 15
  },

  'isLayout': false // true if rendering for layout purposes
};


/**
 * Adjusts the gap size based on the component options.
 * @param {dvt.Legend} legend The legend component.
 * @param {Number} defaultSize The default gap size.
 * @return {Number}
 */
DvtLegendDefaults.getGapSize = function(legend, defaultSize) {
  // adjust based on legend text font size
  var scalingFactor = Math.min(dvt.TextUtils.getTextStringHeight(legend.getCtx(), legend.getOptions()['textStyle']) / 14, 1);
  return Math.ceil(defaultSize * scalingFactor);
};
/**
 * Event Manager for dvt.Legend.
 * @param {dvt.Legend} legend
 * @class
 * @extends {dvt.EventManager}
 * @constructor
 */
var DvtLegendEventManager = function(legend) {
  this.Init(legend.getCtx(), legend.processEvent, legend);
  this._legend = legend;
};

dvt.Obj.createSubclass(DvtLegendEventManager, dvt.EventManager);

/**
 * @override
 */
DvtLegendEventManager.prototype.OnClick = function(event) {
  DvtLegendEventManager.superclass.OnClick.call(this, event);

  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  var hideShow = this.processHideShowEvent(obj);
  var action = this.handleClick(obj, event);

  // If a hide/show or action occurs, the event should not bubble.
  if (hideShow || action)
    event.stopPropagation();
};


/**
 * @override
 */
DvtLegendEventManager.prototype.OnMouseOver = function(event) {
  DvtLegendEventManager.superclass.OnMouseOver.call(this, event);

  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  var params = obj instanceof dvt.SimpleObjPeer ? obj.getParams() : null;
  // Activate button hover state for collapsible section title
  if (params && params['isCollapsible'] && params['button']) {
    var button = params['button'];
    button.drawOverState();
  }

  // Accessibility Support
  this.UpdateActiveElement(obj);
};


/**
 * @override
 */
DvtLegendEventManager.prototype.OnMouseOut = function(event) {
  DvtLegendEventManager.superclass.OnMouseOut.call(this, event);

  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  var params = obj instanceof dvt.SimpleObjPeer ? obj.getParams() : null;
  if (params && params['isCollapsible'] && params['button']) {
    var button = params['button'];
    button.drawUpState();
  }
};


/**
 * @override
 */
DvtLegendEventManager.prototype.HandleTouchClickInternal = function(evt) {
  var obj = this.GetLogicalObject(evt.target);
  if (!obj)
    return;

  // : if hideAndShow/action is enabled, it takes precedence over series highlighting
  // action is handled in handleClick
  var touchEvent = evt.touchEvent;
  var hideShow = this.processHideShowEvent(obj);
  var processEvt = this.handleClick(obj, event);
  if ((hideShow || processEvt) && touchEvent)
    touchEvent.preventDefault();
};

/**
 * Processes a hide and show action on the specified legend item.  Returns true if a hide or
 * show has been performed.
 * @param {DvtLegendObjPeer} obj The legend item that was clicked.
 * @return {boolean} True if an event was fired.
 */
DvtLegendEventManager.prototype.processHideShowEvent = function(obj) {
  // Don't continue if not enabled
  var hideAndShow = this._legend.getOptions()['hideAndShowBehavior'];
  if (hideAndShow == 'none' || hideAndShow == 'off')
    return false;

  var categories = obj.getCategories ? obj.getCategories() : null;
  if (!categories || categories.length <= 0)
    return false;

  var category = obj.getCategories()[0];
  var hiddenCategories = this._legend.getOptions()['hiddenCategories'] || [];
  hiddenCategories = hiddenCategories.slice();

  // Update the legend markers
  var displayables = obj.getDisplayables();
  for (var i = 0; i < displayables.length; i++) {
    var displayable = displayables[i];
    if (displayable instanceof dvt.SimpleMarker) // setHollow is a toggle
      displayable.setHollow(obj.getColor());
    else if (displayable instanceof dvt.Rect)
      obj.updateAriaLabel();
  }

  // Update the state and create the event
  var id = categories[0];
  var event;
  if (DvtLegendRenderer.isCategoryHidden(category, this._legend)) {
    hiddenCategories.splice(dvt.ArrayUtils.getIndex(hiddenCategories, category), 1);
    event = dvt.EventFactory.newCategoryShowEvent(id, hiddenCategories);
  } else {
    hiddenCategories.push(category);
    event = dvt.EventFactory.newCategoryHideEvent(id, hiddenCategories);
  }

  this._legend.getOptions()['hiddenCategories'] = hiddenCategories;
  this.FireEvent(event, this._legend);

  // Return true since an event was fired
  return true;
};


/**
 * Helper for processing click event. Handles action, drilling and section collapse.  Returns true if click is handled.
 * @param {DvtLegendObjPeer} obj The legend item that was clicked.
 * @param {dvt.BaseEvent} event
 * @return {boolean} True if an event was fired.
 */
DvtLegendEventManager.prototype.handleClick = function(obj, event) {
  if (obj && obj.getAction && obj.getAction()) {
    this.FireEvent(dvt.EventFactory.newActionEvent('action', obj.getAction(), obj.getId()), this._legend);
    return true;
  }

  // Drill support
  if (obj instanceof DvtLegendObjPeer && obj.isDrillable()) {
    var id = obj.getId();
    this.FireEvent(dvt.EventFactory.newChartDrillEvent(id, id, null), this._legend);
    return true;
  }

  var params = obj instanceof dvt.SimpleObjPeer ? obj.getParams() : null;
  if (params && params['isCollapsible']) {
    this.toggleSectionCollapse(event, params['id']);
    return true;
  }

  return false;
};

/**
 * @override
 */
DvtLegendEventManager.prototype.ProcessRolloverEvent = function(event, obj, bOver) {
  // Don't continue if not enabled
  var options = this._legend.getOptions();
  // Do not fire rollover event for section collapse/expand button
  if (options['hoverBehavior'] == 'none' || (obj.getDisplayables && obj.getDisplayables()[0] instanceof dvt.Button))
    return;

  // Compute the new highlighted categories and update the options
  var categories = obj.getCategories ? obj.getCategories() : [];
  options['highlightedCategories'] = bOver ? categories.slice() : null;

  // Fire the event to the rollover handler, who will fire to the component callback.
  var rolloverEvent = dvt.EventFactory.newCategoryHighlightEvent(options['highlightedCategories'], bOver);
  var hoverBehaviorDelay = dvt.StyleUtils.getTimeMilliseconds(options['hoverBehaviorDelay']);
  this.RolloverHandler.processEvent(rolloverEvent, this._legend.__getObjects(), hoverBehaviorDelay, true);
};

/**
 * Collapses or expands a legend section when collapse button is clicked.
 * @param {dvt.BaseEvent} event
 * @param {dvt.Button} button The button that calls the method.
 */
DvtLegendEventManager.prototype.onCollapseButtonClick = function(event, button) {
  // Find the section based on the buttonId, which is an array of section indices
  var buttonId = button.getId();
  this.toggleSectionCollapse(event, buttonId);
};

/**
 * Collapses or expands a legend section.
 * @param {dvt.BaseEvent} event
 * @param {Number} sectionIdArray The id of the section.
 */
DvtLegendEventManager.prototype.toggleSectionCollapse = function(event, sectionIdArray) {
  var section = this._legend.getOptions();
  for (var i = 0; i < sectionIdArray.length; i++)
    section = section['sections'][sectionIdArray[i]];

  // Expand or collapse the section
  section['expanded'] = (section['expanded'] == 'off') ? 'on' : 'off';

  // Set the keyboard focus on a mouse click
  if (event.type == dvt.MouseEvent.CLICK) {
    var peer = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
    if (peer.getNextNavigable)
      this.setFocusObj(peer.getNextNavigable(event));
  }

  // Stores the current keyboard focus
  var focus = this._legend.getKeyboardFocus();
  var isShowingFocusEffect = focus ? focus.isShowingKeyboardFocusEffect() : false;

  this._legend.render();

  // Restores the keyboard focus after rerendering
  if (focus)
    this._legend.setKeyboardFocus(focus, isShowingFocusEffect);

  this.hideTooltip();

  // Fire resize event
  var bounds = this._legend.getContentDimensions();
  this.FireEvent(new dvt.ResizeEvent(bounds.w, bounds.h, bounds.x, bounds.y), this._legend);
};

/**
 * @override
 */
DvtLegendEventManager.prototype.GetTouchResponse = function() {
  if (this._legend.getOptions()['_isScrollingLegend'])
    return dvt.EventManager.TOUCH_RESPONSE_TOUCH_HOLD;
  else
    return dvt.EventManager.TOUCH_RESPONSE_TOUCH_START;
};
/**
  *  @param {dvt.EventManager} manager The owning dvt.EventManager
  *  @param {dvt.Legend} legend
  *  @class DvtLegendKeyboardHandler
  *  @extends {dvt.KeyboardHandler}
  *  @constructor
  */
var DvtLegendKeyboardHandler = function(manager, legend)
{
  this.Init(manager, legend);
};

dvt.Obj.createSubclass(DvtLegendKeyboardHandler, dvt.KeyboardHandler);


/**
 * @override
 */
DvtLegendKeyboardHandler.prototype.Init = function(manager, legend) {
  DvtLegendKeyboardHandler.superclass.Init.call(this, manager);
  this._legend = legend;
};


/**
 * @override
 */
DvtLegendKeyboardHandler.prototype.processKeyDown = function(event) {
  var keyCode = event.keyCode;
  var currentNavigable = this._eventManager.getFocus();
  var isButton = currentNavigable && currentNavigable.getDisplayables()[0] instanceof dvt.Button;
  var nextNavigable = null;

  if (currentNavigable == null && keyCode == dvt.KeyboardEvent.TAB) {
    // navigate to the default
    var navigables = this._legend.__getKeyboardObjects();
    if (navigables.length > 0) {
      dvt.EventManager.consumeEvent(event);
      nextNavigable = this.getDefaultNavigable(navigables);
    }
  }
  else if (currentNavigable) {
    if (keyCode == dvt.KeyboardEvent.TAB) {
      dvt.EventManager.consumeEvent(event);
      nextNavigable = currentNavigable;
    }
    else if (keyCode == dvt.KeyboardEvent.ENTER || keyCode == dvt.KeyboardEvent.SPACE) {
      // Process driling and action events if enter
      if (keyCode == dvt.KeyboardEvent.ENTER) {
        this._eventManager.handleClick(currentNavigable, event);
      }

      if (isButton)
        this._eventManager.onCollapseButtonClick(event, currentNavigable.getDisplayables()[0]);
      else
        this._eventManager.processHideShowEvent(currentNavigable);
      dvt.EventManager.consumeEvent(event);
    }
    else if (isButton && (keyCode == dvt.KeyboardEvent.LEFT_ARROW || keyCode == dvt.KeyboardEvent.RIGHT_ARROW)) {
      this._eventManager.onCollapseButtonClick(event, currentNavigable.getDisplayables()[0]);
      dvt.EventManager.consumeEvent(event);
    }
    else
      nextNavigable = DvtLegendKeyboardHandler.superclass.processKeyDown.call(this, event);
  }

  // Scroll the next element into view before returning it
  if (nextNavigable)
    this._legend.container.scrollIntoView(nextNavigable.getDisplayables()[0]);
  return nextNavigable;
};
/**
 * Logical object for legend data object displayables.
 * @param {dvt.Legend} legend The owning legend instance.
 * @param {array} displayables The array of associated DvtDisplayables.
 * @param {string} id The id of the legend item.
 * @param {string} tooltip The tooltip of the legend item.
 * @param {string} datatip The datatip of the legend item.
 * @param {boolean} drillable Whether the legend item is drillable.
 * @class
 * @constructor
 * @implements {DvtLogicalObject}
 * @implements {DvtCategoricalObject}
 * @implements {DvtTooltipSource}
 */
var DvtLegendObjPeer = function(legend, displayables, id, tooltip, datatip, drillable) {
  this.Init(legend, displayables, id, tooltip, datatip, drillable);
};

dvt.Obj.createSubclass(DvtLegendObjPeer, dvt.Obj);


/**
 * @param {dvt.Legend} legend The owning legend instance.
 * @param {array} displayables The array of associated DvtDisplayables.
 * @param {object} item The definition of the legend item.
 * @param {string} tooltip The tooltip of the legend item.
 * @param {string} datatip The datatip of the legend item.
 * @param {boolean} drillable Whether the legend item is drillable.
 */
DvtLegendObjPeer.prototype.Init = function(legend, displayables, item, tooltip, datatip, drillable) {
  this._legend = legend;
  this._displayables = displayables;
  this._item = item;
  this._category = DvtLegendRenderer.getItemCategory(this._item); // section title is not category
  this._id = this._category ? this._category : item['title'];
  this._action = item['action'];
  this._drillable = drillable;
  this._spb = item['_spb']; // popup support
  this._tooltip = tooltip;
  this._datatip = datatip;
  this._isShowingKeyboardFocusEffect = false;

  // Apply the cursor for the action if specified
  if (this._action || this._drillable) {
    for (var i = 0; i < this._displayables.length; i++) {
      this._displayables[i].setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
    }
  }
};


/**
 * Creates a data item to identify the specified displayable and registers it with the legend.
 * @param {array} displayables The displayables to associate.
 * @param {dvt.Legend} legend The owning legend instance.
 * @param {object} item The definition of the legend item.
 * @param {string} tooltip The tooltip of the legend item.
 * @param {string} datatip The datatip of the legend item.
 * @param {boolean} drillable Whether the legend item is drillable.
 * @return {DvtLegendObjPeer}
 */
DvtLegendObjPeer.associate = function(displayables, legend, item, tooltip, datatip, drillable) {
  // Item must have displayables and an id to be interactive.
  if (!displayables || !item)
    return null;

  // Create the logical object.
  var identObj = new DvtLegendObjPeer(legend, displayables, item, tooltip, datatip, drillable);

  // Register with the legend
  legend.__registerObject(identObj);

  // Finally associate using the event manager
  for (var i = 0; i < displayables.length; i++)
    legend.getEventManager().associate(displayables[i], identObj);

  return identObj;
};


/**
 * Returns the data object defining this legend item.
 * @return {object} The data object defining this legend item.
 */
DvtLegendObjPeer.prototype.getData = function() {
  return this._item;
};


/**
 * Returns the primary data color for this legend item.
 * @return {string} The color string.
 */
DvtLegendObjPeer.prototype.getColor = function() {
  return this._item['color'];
};


/**
 * Returns the id for this legend item.
 * @return {object} The id for this legend item.
 */
DvtLegendObjPeer.prototype.getId = function() {
  return this._id;
};

//---------------------------------------------------------------------//
// Rollover and Hide/Show Support: DvtLogicalObject impl               //
//---------------------------------------------------------------------//


/**
 * @override
 */
DvtLegendObjPeer.prototype.getDisplayables = function() {
  return this._displayables;
};

//---------------------------------------------------------------------//
// Rollover and Hide/Show Support: DvtCategoricalObject impl           //
//---------------------------------------------------------------------//


/**
 * @override
 */
DvtLegendObjPeer.prototype.getCategories = function(category) {
  if (this._category != null)
    return [this._category];

  return null;
};


/**
 * Return the action string for the legend item, if any exists.
 * @return {string} the action outcome for the legend item.
 */
DvtLegendObjPeer.prototype.getAction = function() {
  return this._action;
};

/**
 * Returns if the legend item is drillable.
 * @return {boolean}
 */
DvtLegendObjPeer.prototype.isDrillable = function() {
  return this._drillable;
};

//---------------------------------------------------------------------//
// Popup Support: DvtPopupSource impl                                  //
//---------------------------------------------------------------------//


/**
 * @override
 */
DvtLegendObjPeer.prototype.getShowPopupBehaviors = function() {
  return this._spb;
};

/**
 * @override
 */
DvtLegendObjPeer.prototype.getAriaLabel = function() {
  var states = [];
  var options = this._legend.getOptions();
  var hideAndShow = this._legend.getOptions()['hideAndShowBehavior'];
  var bHiddenCategory = DvtLegendRenderer.isCategoryHidden(this._category, this._legend);
  var data = this.getData();

  if (this._displayables[0] instanceof dvt.Button) {
    states.push(dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, data['expanded'] == 'off' ? 'STATE_COLLAPSED' : 'STATE_EXPANDED'));
    return dvt.Displayable.generateAriaLabel(data['title'], states);
  }

  if (hideAndShow != 'off' && hideAndShow != 'none')
    states.push(dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, bHiddenCategory ? 'STATE_HIDDEN' : 'STATE_VISIBLE'));
  if (this.isDrillable())
    states.push(dvt.Bundle.getTranslation(options, 'stateDrillable', dvt.Bundle.UTIL_PREFIX, 'STATE_DRILLABLE'));

  if (data['shortDesc'] != null) {
    return dvt.Displayable.generateAriaLabel(data['shortDesc'], states);
  }
  else if (states.length > 0) {
    return dvt.Displayable.generateAriaLabel(data['text'], states);
  }

  return null;
};

/**
 * Updates the aria label for a map data object
 */
DvtLegendObjPeer.prototype.updateAriaLabel = function() {
  if (!dvt.Agent.deferAriaCreation() && this._displayables[0])
    this._displayables[0].setAriaProperty('label', this.getAriaLabel());
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                         //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtLegendObjPeer.prototype.getNextNavigable = function(event) {
  if (event.type == dvt.MouseEvent.CLICK)
    return this;

  var navigables = this._legend.__getKeyboardObjects();
  return dvt.KeyboardHandler.getNextNavigable(this, event, navigables, true);
};


/**
 * @override
 */
DvtLegendObjPeer.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) {
  if (this._displayables[0])
    return this._displayables[0].getDimensions(targetCoordinateSpace);
  else
    return new dvt.Rectangle(0, 0, 0, 0);
};

/**
 * @override
 */
DvtLegendObjPeer.prototype.getTargetElem = function() {
  if (this._displayables[0])
    return this._displayables[0].getElem();
  return null;
};

/**
 * @override
 */
DvtLegendObjPeer.prototype.showKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = true;
  if (this._displayables[0]) {
    if (this._displayables[0] instanceof dvt.Button)
      this._displayables[0].drawOverState();
    else
      this._displayables[0].setSolidStroke(dvt.Agent.getFocusColor());
  }
};


/**
 * @override
 */
DvtLegendObjPeer.prototype.hideKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = false;
  if (this._displayables[0]) {
    if (this._displayables[0] instanceof dvt.Button)
      this._displayables[0].drawUpState();
    else
      this._displayables[0].setStroke(null);
  }
};


/**
 * @override
 */
DvtLegendObjPeer.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};

//---------------------------------------------------------------------//
// Tooltip Support: DvtTooltipSource impl                              //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtLegendObjPeer.prototype.getTooltip = function(target) {
  return this._tooltip;
};


/**
 * @override
 */
DvtLegendObjPeer.prototype.getDatatip = function(target) {
  return this._datatip;
};

/**
 * @override
 */
DvtLegendObjPeer.prototype.getDatatipColor = function(target) {
  return this._item['color'];
};
/**
 * Renderer for dvt.Legend.
 * @class
 */
var DvtLegendRenderer = new Object();

dvt.Obj.createSubclass(DvtLegendRenderer, dvt.Obj);

/** @private */
DvtLegendRenderer._DEFAULT_LINE_WIDTH_WITH_MARKER = 2;
/** @private */
DvtLegendRenderer._LINE_MARKER_SIZE_FACTOR = 0.6;
/** @private */
DvtLegendRenderer._DEFAULT_SYMBOL_SIZE = 10;
/** @private */
DvtLegendRenderer._BUTTON_SIZE = 12;
/** @private */
DvtLegendRenderer._FOCUS_GAP = 2;


/**
 * Renders the legend.
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {dvt.Rectangle} The dimensions of the legend content.
 */
DvtLegendRenderer.render = function(legend, availSpace) {
  var options = legend.getOptions();
  var context = legend.getCtx();
  var isRTL = dvt.Agent.isRightToLeft(context);

  if (!options['isLayout'])
    DvtLegendRenderer._renderBackground(legend, availSpace);

  var container = new dvt.SimpleScrollableContainer(context, availSpace.w, availSpace.h);
  var contentContainer = new dvt.Container(context);
  container.getScrollingPane().addChild(contentContainer);
  legend.addChild(container);
  legend.container = container;

  var gapWidth = DvtLegendDefaults.getGapSize(legend, options['layout']['outerGapWidth']);
  var gapHeight = DvtLegendDefaults.getGapSize(legend, options['layout']['outerGapHeight']);
  availSpace.x += gapWidth;
  availSpace.y += gapHeight;
  availSpace.w -= 2 * gapWidth;
  availSpace.h -= 2 * gapHeight;
  legend.__setBounds(availSpace);

  // Return if there's no space
  if (availSpace.w <= 0 || availSpace.h <= 0)
    return new dvt.Dimension(0, 0);

  var totalDim = DvtLegendRenderer._renderContents(legend, contentContainer, new dvt.Rectangle(availSpace.x, availSpace.y, availSpace.w, availSpace.h));

  if (totalDim.w == 0 || totalDim.h == 0) // drop legend
    return new dvt.Dimension(0, 0);

  container.prepareContentPane();

  if (totalDim.h > availSpace.h) {
    totalDim.h = availSpace.h;
    options['_isScrollingLegend'] = true;
  }
  else
    options['_isScrollingLegend'] = false;

  // Compute the legend content position
  var translateX = 0, translateY = 0;
  var halign = options['hAlign'] != null ? options['hAlign'] : options['halign'];
  if (halign == 'center')
    translateX = availSpace.x - totalDim.x + (availSpace.w - totalDim.w) / 2;
  else if (halign == 'end') {
    if (isRTL)
      translateX = availSpace.x - totalDim.x;
    else
      translateX = availSpace.x - totalDim.x + availSpace.w - totalDim.w;
  }
  var valign = options['vAlign'] != null ? options['vAlign'] : options['valign'];
  if (valign == 'middle')
    translateY = availSpace.y - totalDim.y + (availSpace.h - totalDim.h) / 2;
  else if (valign == 'bottom')
    translateY = availSpace.y - totalDim.y + availSpace.h - totalDim.h;

  var contentDims = new dvt.Rectangle(
      totalDim.x + translateX - gapWidth, totalDim.y + translateY - gapHeight,
      totalDim.w + 2 * gapWidth, totalDim.h + 2 * gapHeight
      );
  if (options['isLayout'])
    return contentDims;

  // Align the legend content
  if (translateX || translateY)
    contentContainer.setTranslate(translateX, translateY);

  // Align the titles now after we know the total width
  var titles = legend.__getTitles();
  for (var i = 0; i < titles.length; i++)
    dvt.LayoutUtils.align(totalDim, titles[i].halign, titles[i].text, titles[i].text.measureDimensions().w);

  return contentDims;
};

/**
 * Renders the legend title and sections.
 * @param {dvt.Legend} legend
 * @param {dvt.Container} container
 * @param {dvt.Rectangle} availSpace
 * @return {dvt.Rectangle} The total dimensions of the title and the sections.
 * @private
 */
DvtLegendRenderer._renderContents = function(legend, container, availSpace) {
  var options = legend.getOptions();
  availSpace = availSpace.clone();

  var title = DvtLegendRenderer._renderTitle(legend, container, options['title'], availSpace, null, true);
  if (title) {
    var titleDim = title.measureDimensions();
    var titleGap = DvtLegendDefaults.getGapSize(legend, options['layout']['titleGapHeight']);
    availSpace.y += titleDim.h + titleGap;
    availSpace.h -= Math.floor(titleDim.h + titleGap); // : IE9 attributes slightly too much height for the legend title
  }

  var sectionsDim = DvtLegendRenderer._renderSections(legend, container, options['sections'], availSpace, []);

  return title ? titleDim.getUnion(sectionsDim) : sectionsDim;
};


/**
 * Renders the legend background/border colors.
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {dvt.Rectangle} availSpace The available space.
 * @private
 */
DvtLegendRenderer._renderBackground = function(legend, availSpace) {
  var options = legend.getOptions();
  var backgroundColor = options['backgroundColor'];
  var borderColor = options['borderColor'];

  if (backgroundColor || borderColor) {
    var rect = new dvt.Rect(legend.getCtx(), availSpace.x, availSpace.y, availSpace.w, availSpace.h);

    if (backgroundColor)
      rect.setSolidFill(backgroundColor);
    else
      rect.setInvisibleFill(); // otherwise the borderColor will fill the rect

    if (borderColor) {
      rect.setSolidStroke(borderColor);
      rect.setPixelHinting(true);
    }

    legend.addChild(rect);
  }
};


/**
 * Renders the legend title and updates the available space.
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {dvt.Container} container The title container.
 * @param {string} titleStr
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {object} section The section attributes, if this is a section
 * @param {boolean} isAligned Whether the title supports halign (done at the end of render call).
 * @param {number} id The id of the section, if this is a section.
 * @param {dvt.Button} button The button associated with the legend title
 * @return {dvt.Rectangle} The dimension of the title.
 * @private
 */
DvtLegendRenderer._renderTitle = function(legend, container, titleStr, availSpace, section, isAligned, id, button) {
  var options = legend.getOptions();
  var context = container.getCtx();
  var isRTL = dvt.Agent.isRightToLeft(context);

  if (!titleStr)
    return null;

  // Create the title object and add to legend
  var title = new dvt.OutputText(context, titleStr, availSpace.x, availSpace.y);
  var titleStyle = options['titleStyle'];
  if (section && section['titleStyle'])
    titleStyle = new dvt.CSSStyle(section['titleStyle']);
  else if (section && options['_sectionTitleStyle'])
    titleStyle = options['_sectionTitleStyle'];

  title.setCSSStyle(titleStyle);

  if (dvt.TextUtils.fitText(title, availSpace.w, Infinity, container)) {
    if (isRTL) // align right first to get the dims for preferred size
      title.setX(availSpace.x + availSpace.w - title.measureDimensions().w);

    if (!options['isLayout']) {
      // Associate with logical object to support tooltips
      var params = {'id': id, 'button': button};
      params['isCollapsible'] = section && (section['collapsible'] == 'on' || section['collapsible'] == true);
      legend.getEventManager().associate(title, new dvt.SimpleObjPeer(title.getUntruncatedTextString(), null, null, params));

      if (isAligned) {
        // title alignment will be deferred until we know the total width of the legend content
        var titleHalign = (section && section['titleHalign']) ? section['titleHalign'] : options['titleHalign'];
        legend.__registerTitle({text: title, halign: titleHalign});
      }
    }
    else
      container.removeChild(title);

    return title;
  }

  return null;
};


/**
 * Renders a legend section.
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {dvt.Container} container The container of the section.
 * @param {Array} sections The array of section objects.
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {Array} id The id of the parent section calling this method.
 * @return {dvt.Rectangle} The total dimension of the sections.
 * @private
 */
DvtLegendRenderer._renderSections = function(legend, container, sections, availSpace, id) {
  var options = legend.getOptions();

  // Apply default symbol dimensions. If only one dimension is defined, the other will copy its value.
  if (options['symbolWidth'] == null && options['symbolHeight'] == null) {
    options['symbolWidth'] = DvtLegendRenderer._DEFAULT_SYMBOL_SIZE;
    options['symbolHeight'] = DvtLegendRenderer._DEFAULT_SYMBOL_SIZE;
  }
  else {
    if (options['symbolWidth'] == null)
      options['symbolWidth'] = options['symbolHeight'];
    else if (options['symbolHeight'] == null)
      options['symbolHeight'] = options['symbolWidth'];

    //  - Courtesy fix if values passed in as "x" vs. x
    options['symbolWidth'] = parseInt(options['symbolWidth']);
    options['symbolHeight'] = parseInt(options['symbolHeight']);
  }

  var sectionGapHeight = DvtLegendDefaults.getGapSize(legend, options['layout']['sectionGapHeight']);
  var titleGapHeight = DvtLegendDefaults.getGapSize(legend, options['layout']['titleGapHeight']);
  var gapWidth = DvtLegendDefaults.getGapSize(legend, options['layout']['sectionGapWidth']);
  var rowHeight = DvtLegendRenderer._getRowHeight(legend);
  var isHoriz = options['orientation'] != 'vertical';

  var totalDim = null;
  var horizAvailSpace = availSpace.clone();
  var sectionDim;
  for (var i = 0; i < sections.length; i++) {
    var sectionId = id.concat([i]);
    var gapHeight = (sections[i]['expanded'] == 'off' || sections[i]['expanded'] == false) ? titleGapHeight : sectionGapHeight;

    if (isHoriz) { // horizontal legend
      // first try to render horizontally in the current row
      sectionDim = DvtLegendRenderer._renderHorizontalSection(legend, container, sections[i], horizAvailSpace, rowHeight);

      if (sectionDim.w > horizAvailSpace.w) {
        if (horizAvailSpace.w < availSpace.w) {
          // form a new row
          availSpace.y += sectionDim.h + gapHeight;
          availSpace.h -= sectionDim.h + gapHeight;
        }

        if (sectionDim.w <= availSpace.w) // render horizontally in a new row
          sectionDim = DvtLegendRenderer._renderHorizontalSection(legend, container, sections[i], availSpace, rowHeight);
        else // render vertically in columns
          sectionDim = DvtLegendRenderer._renderVerticalSection(legend, container, sections[i], availSpace, rowHeight, sectionId, true);

        availSpace.y += sectionDim.h + gapHeight;
        availSpace.h -= sectionDim.h + gapHeight;
        horizAvailSpace = availSpace.clone();
      }
      else {
        horizAvailSpace.w -= sectionDim.w + gapWidth;
        if (!dvt.Agent.isRightToLeft(legend.getCtx()))
          horizAvailSpace.x += sectionDim.w + gapWidth;
      }
    }
    else { // vertical legend
      sectionDim = DvtLegendRenderer._renderVerticalSection(legend, container, sections[i], availSpace, rowHeight, sectionId, false);
      availSpace.y += sectionDim.h + gapHeight;
      availSpace.h -= sectionDim.h + gapHeight;
    }

    totalDim = totalDim ? totalDim.getUnion(sectionDim) : sectionDim;
  }

  return totalDim;
};


/**
 * Creates the legend button.
 * @param {dvt.Context} context
 * @param {dvt.Legend} legend
 * @param {object} item The relevant data object for the button peer.
 * @param {object} resources The object containing the button image resources.
 * @param {string} prefix The prefix of the image resource name.
 * @param {number} x The button x position.
 * @param {number} y The button y position.
 * @param {string} tooltip The button tooltip.
 * @param {string} id The button id.
 * @param {function} callback The button callback function.
 * @param {object} callbackObj The button callback object.
 * @return {dvt.Button} The button.
 * @private
 */
DvtLegendRenderer._createButton = function(context, legend, item, resources, prefix, x, y, tooltip, id, callback, callbackObj) {
  var upState = DvtLegendRenderer._createButtonImage(context, resources, prefix + 'Enabled', x, y);
  var overState = DvtLegendRenderer._createButtonImage(context, resources, prefix + 'Over', x, y);
  var downState = DvtLegendRenderer._createButtonImage(context, resources, prefix + 'Down', x, y);

  var button = new dvt.Button(context, upState, overState, downState, null, id, callback, callbackObj);

  var peer = DvtLegendObjPeer.associate([button], legend, item, tooltip, null, false);
  button.setAriaRole('button');
  peer.updateAriaLabel();

  return button;
};

/**
 * Creates a button image.
 * @param {dvt.Context} context
 * @param {object} resources The object containing the button image resources.
 * @param {string} name The image resource name.
 * @param {number} x The button x position.
 * @param {number} y The button y position.
 * @return {dvt.Image} .
 * @private
 */
DvtLegendRenderer._createButtonImage = function(context, resources, name, x, y) {
  var suffix = dvt.Agent.isRightToLeft(context) ? 'RTL' : '';
  var src = resources[name + suffix] ? resources[name + suffix] : resources[name];
  var image = new dvt.Image(context, src, x, y, DvtLegendRenderer._BUTTON_SIZE, DvtLegendRenderer._BUTTON_SIZE);
  image.setInvisibleFill();
  return image;
};

/**
 * Renders a vertical legend section.
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {dvt.Container} container The container of the section.
 * @param {object} section The section from the options object.
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {Number} rowHeight The height of a row of legend items.
 * @param {Array} id The section id, in the form of section index array. For example, if id=[0,1], then this is
 *  the second nested section of the first section.
 * @param {boolean} minimizeNumRows Whether the number of rows should be minimized.
 * @return {dvt.Rectangle} The total dimension of the section.
 * @private
 */
DvtLegendRenderer._renderVerticalSection = function(legend, container, section, availSpace, rowHeight, id, minimizeNumRows) {
  if (!section)
    return;

  var options = legend.getOptions();
  var symbolGap = DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapWidth']);
  var rowGap = DvtLegendDefaults.getGapSize(legend, options['layout']['rowGap']);
  var colGap = DvtLegendDefaults.getGapSize(legend, options['layout']['columnGap']);
  var context = legend.getCtx();
  var isRTL = dvt.Agent.isRightToLeft(context);

  var sectionSpace = availSpace.clone();
  if (options['scrolling'] != 'off')
    sectionSpace.h = Infinity;

  // Render collapse button
  var buttonDim;
  var isCollapsible = section['collapsible'] == 'on' || section['collapsible'] == true;
  var button;
  if (isCollapsible) {
    var buttonX = isRTL ? sectionSpace.x + sectionSpace.w - DvtLegendRenderer._BUTTON_SIZE : sectionSpace.x;
    if (!options['isLayout']) {
      var isCollapsed = section['expanded'] == 'off' || section['expanded'] == false;
      var buttonType = isCollapsed ? 'closed' : 'open';
      var buttonTooltip = dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, isCollapsed ? 'EXPAND' : 'COLLAPSE', null);
      var em = legend.getEventManager();

      button = DvtLegendRenderer._createButton(context, legend, section, options['_resources'], buttonType,
          buttonX, sectionSpace.y, buttonTooltip, id, em.onCollapseButtonClick, em);
      container.addChild(button);
    }
    buttonDim = new dvt.Rectangle(buttonX, sectionSpace.y, DvtLegendRenderer._BUTTON_SIZE, DvtLegendRenderer._BUTTON_SIZE);

    // Indent the section
    var buttonGap = DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapWidth']);
    if (!isRTL)
      sectionSpace.x += DvtLegendRenderer._BUTTON_SIZE + buttonGap;
    sectionSpace.w -= DvtLegendRenderer._BUTTON_SIZE + buttonGap;
  }

  // Render legend section title. Only support titleHalign if the section is not collapsible and not nested.
  var title = DvtLegendRenderer._renderTitle(legend, container, section['title'], sectionSpace, section, !isCollapsible && id.length <= 1, id, button);
  var titleDim = title ? title.measureDimensions() : new dvt.Rectangle(isRTL ? sectionSpace.x + sectionSpace.w : sectionSpace.x, sectionSpace.y, 0, 0);
  var sectionDim = buttonDim ? titleDim.getUnion(buttonDim) : titleDim;

  // See if this is a section group which contains more legend sections
  if ((!section['items'] && !section['sections']) || section['expanded'] == 'off' || section['expanded'] == false)
    return sectionDim;

  // Title+button should always be on its own row
  if (sectionDim.h > 0) {
    var titleGap = DvtLegendDefaults.getGapSize(legend, options['layout']['titleGapHeight']);
    sectionSpace.y += sectionDim.h + titleGap;
    sectionSpace.h -= sectionDim.h + titleGap;
  }

  // Render nested sections
  if (section['sections']) {
    var nestedSectionDim = DvtLegendRenderer._renderSections(legend, container, section['sections'], sectionSpace, id);
    sectionDim = sectionDim.getUnion(nestedSectionDim);
  }

  if (!section['items'])
    return sectionDim;

  // Determine needed cols and rows
  var colInfo = DvtLegendRenderer._calcColumns(legend, sectionSpace, rowHeight, section['items'], minimizeNumRows);
  var numCols = colInfo['numCols'];
  var numRows = colInfo['numRows'];
  var colWidth = colInfo['width'];
  var colInitY = sectionSpace.y; // top y-coord of the columns

  // Don't render if not enough space
  if (numRows == 0 || numCols == 0)
    return sectionDim;

  var contentHeight = numRows * (rowHeight + rowGap) - rowGap;
  var contentWidth = Math.min(numCols * (colWidth + colGap) - colGap, sectionSpace.w);
  var contentDim = new dvt.Rectangle(isRTL ? sectionSpace.x + sectionSpace.w - contentWidth : sectionSpace.x, sectionSpace.y, contentWidth, contentHeight);
  sectionDim = sectionDim.getUnion(contentDim);

  // No need to render during layout pass
  if (options['isLayout'])
    return sectionDim;

  // For text truncation
  var textSpace = colWidth - options['symbolWidth'] - symbolGap;

  // Render the items one by one
  var currRow = 0;
  var currCol = 1;
  var numItems = section['items'].length;

  // iterate through items
  for (var i = 0; i < numItems; i++) {
    var item = section['items'][i];
    DvtLegendRenderer._createLegendItem(legend, container, item, sectionSpace, textSpace, rowHeight, i);

    // Update coordinates for next row
    sectionSpace.y += (rowHeight + rowGap);
    currRow++;
    if (currRow === numRows && currCol !== numCols) {
      sectionSpace.y = colInitY;
      sectionSpace.w -= colWidth + colGap;
      if (!isRTL)
        sectionSpace.x += colWidth + colGap;
      currRow = 0;
      currCol++;
    }

    // End for loop if number of rows possible(numRows) is reached
    if (currRow === numRows)
      break;
  }

  return sectionDim;
};

/**
 * Renders a horizontal legend section.
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {dvt.Container} container The container of the section.
 * @param {object} section The section from the options object.
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {number} rowHeight The height of a row of legend items.
 * @return {dvt.Rectangle} The total dimension of the section.
 * @private
 */
DvtLegendRenderer._renderHorizontalSection = function(legend, container, section, availSpace, rowHeight) {
  if (!section)
    return;

  var options = legend.getOptions();
  var symbolWidth = options['symbolWidth'];
  var symbolGap = DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapWidth']);
  var colGap = DvtLegendDefaults.getGapSize(legend, options['layout']['columnGap']);
  var titleGap = DvtLegendDefaults.getGapSize(legend, options['layout']['titleGapWidth']);
  var numItems = section['items'].length;
  var isRTL = dvt.Agent.isRightToLeft(legend.getCtx());
  var sectionSpace = availSpace.clone();

  // Determine legend section title
  var title = DvtLegendRenderer._renderTitle(legend, container, section['title'], availSpace, section, false);
  var titleDim = title ? title.measureDimensions() : new dvt.Rectangle(isRTL ? availSpace.x + availSpace.w : availSpace.x, availSpace.y, 0, 0);
  if (!section['items'])
    return titleDim;
  else if (titleDim.w > 0) {
    sectionSpace.w -= titleDim.w + titleGap;
    if (!isRTL)
      sectionSpace.x += titleDim.w + titleGap;
  }

  // Compute the section width and cache the text widths of the items
  var textWidths = [];
  var totalWidth = availSpace.w - sectionSpace.w;
  var item, textWidth, i;
  for (i = 0; i < numItems; i++) {
    item = section['items'][i];
    textWidth = Math.ceil(dvt.TextUtils.getTextStringWidth(legend.getCtx(), item['text'], options['textStyle']));
    totalWidth += textWidth + symbolWidth + symbolGap + colGap;
    textWidths.push(textWidth);
  }
  if (numItems > 0)
    totalWidth -= colGap;

  // Don't render during layout pass, or if the totalWidth exceeds the available space
  var sectionDim = new dvt.Rectangle(isRTL ? availSpace.x + availSpace.w - totalWidth : availSpace.x, availSpace.y, totalWidth, Math.max(rowHeight, titleDim.h));
  if (options['isLayout'] || totalWidth > availSpace.w) {
    container.removeChild(title);
    return sectionDim;
  }

  var colWidth;
  for (i = 0; i < numItems; i++) {
    item = section['items'][i];
    DvtLegendRenderer._createLegendItem(legend, container, item, sectionSpace, textWidths[i], rowHeight, i);

    colWidth = textWidths[i] + symbolWidth + symbolGap;
    sectionSpace.w -= colWidth + colGap;
    if (!isRTL)
      sectionSpace.x += colWidth + colGap;
  }

  return sectionDim;
};


/**
 * Returns the space required for a legend section.
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {number} rowHeight The height of a legend row.
 * @param {object} items The legend items to be rendered.
 * @param {boolean} minimizeNumRows Whether the number of rows should be minimized.
 * @return {object} Map containing width, rows and columns in the legend.
 * @private
 */
DvtLegendRenderer._calcColumns = function(legend, availSpace, rowHeight, items, minimizeNumRows) {
  var options = legend.getOptions();

  // Use widest text since using # of chars can be wrong for unicode
  var textWidth = 0;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var tempWidth = dvt.TextUtils.getTextStringWidth(legend.getCtx(), item['text'], options['textStyle']);
    if (tempWidth > textWidth) {
      textWidth = tempWidth;
    }
  }

  // Row variables
  var symbolWidth = options['symbolWidth'];
  var symbolGap = DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapWidth']);
  var rowGap = DvtLegendDefaults.getGapSize(legend, options['layout']['rowGap']);
  var colGap = DvtLegendDefaults.getGapSize(legend, options['layout']['columnGap']);

  var numRows;
  var colWidth;
  var numCols;
  var fullColWidth = Math.ceil(symbolWidth + symbolGap + textWidth);

  if (minimizeNumRows) {
    // For horizontal layouts form as many columns as possible to minimize the height
    numCols = Math.min(Math.floor((availSpace.w + colGap) / (fullColWidth + colGap)), items.length); // Get possible number of cols
    numRows = Math.min(Math.floor((availSpace.h + rowGap) / (rowHeight + rowGap)) , Math.ceil(items.length / numCols));

    // Adjust number of columns and rows to remove unused columns and even out columns
    numCols = Math.ceil(items.length / numRows);
    numRows = Math.ceil(items.length / numCols);
  }
  else if (availSpace.h == Infinity) {
    // For scrollable legends, don't wrap legend items into more than one column
    numCols = 1;
    numRows = items.length;
  }
  else {
    // For vertical layouts use full depth and then increase cols as necessary
    numRows = Math.min(Math.floor((availSpace.h + rowGap) / (rowHeight + rowGap)), items.length);
    numCols = Math.ceil(items.length / numRows);
    numRows = Math.ceil(items.length / numCols); // to get columns of roughly equal heights
  }

  var maxColWidth = (availSpace.w - (colGap * (numCols - 1))) / numCols;
  colWidth = Math.min(fullColWidth, maxColWidth);

  if (colWidth < symbolWidth)
    return {'width' : 0, 'numCols' : 0, 'numRows' : 0};

  return {'width' : colWidth, 'numCols' : numCols, 'numRows' : numRows};
};


/**
 * Returns the height of a single item in the legend.
 * @param {dvt.Legend} legend The legend being rendered.
 * @return {number} The height of a legend item.
 * @private
 */
DvtLegendRenderer._getRowHeight = function(legend) {
  var options = legend.getOptions();

  // Figure out the legend item height
  var text = new dvt.OutputText(legend.getCtx(), 'Test');
  text.setCSSStyle(options['textStyle']);
  text.alignMiddle();
  var textHeight = dvt.TextUtils.guessTextDimensions(text).h;
  var symbolHeight = options['symbolHeight'] + DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapHeight']);
  return Math.ceil(Math.max(textHeight, symbolHeight));
};


/**
 * Creates a legend item (symbol + text).
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {dvt.Container} container The container of the legend item.
 * @param {object} item The item in the options object.
 * @param {dvt.Rectangle} availSpace The available space.
 * @param {number} textSpace The maximum text width.
 * @param {object} rowHeight The height of the legend item.
 * @param {number} i The item index.
 * @private
 */
DvtLegendRenderer._createLegendItem = function(legend, container, item, availSpace, textSpace, rowHeight, i) {
  var options = legend.getOptions();
  var context = legend.getCtx();
  var isRTL = dvt.Agent.isRightToLeft(context);
  var symbolWidth = options['symbolWidth'];
  var symbolGap = DvtLegendDefaults.getGapSize(legend, options['layout']['symbolGapWidth']);

  var symbolX = isRTL ? availSpace.x + availSpace.w - symbolWidth : availSpace.x;
  var textX = isRTL ? availSpace.x + availSpace.w - symbolWidth - symbolGap : availSpace.x + symbolWidth + symbolGap;

  // Create legend marker
  var marker = DvtLegendRenderer._createLegendSymbol(legend, symbolX, availSpace.y, rowHeight, item, i);

  // Create legend text
  var label = item['text'];
  var text;
  if (label) {
    var style = options['textStyle'];
    text = DvtLegendRenderer._createLegendText(container, textSpace, label, style);
    if (text) {
      text.setX(textX);
      // Maintaining old behaviour for IE since dominant-baseline is buggy. 
      dvt.TextUtils.centerTextVertically(text, availSpace.y + rowHeight / 2);
      if (isRTL)
        text.alignRight();
    }
  }

  // Add legend marker to legend. Legend text has been added by _createLegendText.
  container.addChild(marker);

  // Draw a rectangle on top of the legend item.  This rectangle is used for interactivity and to ensure that
  // rollover is smooth when moving across legend items.
  var itemRect = new dvt.Rect(context,
      isRTL ? textX - textSpace - DvtLegendRenderer._FOCUS_GAP : symbolX - DvtLegendRenderer._FOCUS_GAP,
      availSpace.y - DvtLegendRenderer._FOCUS_GAP,
      symbolWidth + symbolGap + textSpace + 2 * DvtLegendRenderer._FOCUS_GAP,
      rowHeight + 2 * DvtLegendRenderer._FOCUS_GAP);
  itemRect.setInvisibleFill();
  var hideAndShow = options['hideAndShowBehavior'];
  if (hideAndShow != 'none' && hideAndShow != 'off')
    itemRect.setCursor('pointer');
  container.addChild(itemRect);

  // Associate for interactivity.
  var displayables = [itemRect, marker];
  if (text != null)
    displayables.push(text);

  var peer = DvtLegendObjPeer.associate(displayables, legend, item, text != null ? text.getUntruncatedTextString() : null, item['shortDesc'], DvtLegendRenderer._isItemDrillable(legend, item));

  if (DvtLegendRenderer.isCategoryHidden(DvtLegendRenderer.getItemCategory(item), legend))
    marker.setHollow(peer.getColor());

  if ((hideAndShow != 'none' && hideAndShow != 'off') || item['shortDesc'] != null) {
    itemRect.setAriaRole('img');
    peer.updateAriaLabel();
  }
};

/**
 * Returns whether the item is drillable.
 * @param {dvt.Legend} legend
 * @param {Object} item
 * @return {boolean}
 * @private
 */
DvtLegendRenderer._isItemDrillable = function(legend, item) {
  if (item['drilling'] == 'on')
    return true;
  if (item['drilling'] == 'off')
    return false;

  return legend.getOptions()['drilling'] == 'on';
};

/**
 * Creates a legend text. Adds the text to the legend if it's not empty.
 * @param {dvt.Container} container The text container.
 * @param {number} textSpace The width allowed for text.
 * @param {String} label The content of the text object.
 * @param {String} style The CSS style string to apply to the text object.
 * @return {DvtText}
 * @private
 */
DvtLegendRenderer._createLegendText = function(container, textSpace, label, style) {
  // Draw the legend text.
  var text = new dvt.OutputText(container.getCtx(), label);
  text.setCSSStyle(style);
  text = dvt.TextUtils.fitText(text, textSpace, Infinity, container) ? text : null;
  return text;
};


/**
 * Creates a legend symbol.
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {number} x The x coordinate of the legend symbol.
 * @param {number} y The y coordinate of the legend symbol.
 * @param {number} rowHeight The height of the legend item.
 * @param {object} item The data for the legend item.
 * @param {number} i The index of the legend item. Used for determining the default color.
 * @return {dvt.Shape}
 * @private
 */
DvtLegendRenderer._createLegendSymbol = function(legend, x, y, rowHeight, item, i) {
  // Apply the default styles
  var legendOptions = legend.getOptions();
  var symbolType = item['type'] != null ? item['type'] : item['symbolType'];

  if (!item['markerShape'])
    item['markerShape'] = legendOptions['_markerShape'];

  if (!item['color'])
    item['color'] = legendOptions['_color'];

  if (!item['lineWidth'])
    item['lineWidth'] = symbolType == 'lineWithMarker' ? DvtLegendRenderer._DEFAULT_LINE_WIDTH_WITH_MARKER : legendOptions['_lineWidth'];

  var symbolWidth = legendOptions['symbolWidth'];
  var symbolHeight = legendOptions['symbolHeight'];

  // Find the center of the markers
  var cy = y + rowHeight / 2;
  var cx = x + symbolWidth / 2;

  var symbol;
  if (symbolType == 'line') {
    symbol = DvtLegendRenderer._createLine(legend.getCtx(), x, y, symbolWidth, rowHeight, item);
  }
  else if (symbolType == 'lineWithMarker') {
    symbol = DvtLegendRenderer._createLine(legend.getCtx(), x, y, symbolWidth, rowHeight, item);

    // only if not found in hiddenCategories
    if (!DvtLegendRenderer.isCategoryHidden(DvtLegendRenderer.getItemCategory(item), legend))
      symbol.addChild(DvtLegendRenderer._createMarker(legend, cx, cy, symbolWidth * DvtLegendRenderer._LINE_MARKER_SIZE_FACTOR, symbolHeight * DvtLegendRenderer._LINE_MARKER_SIZE_FACTOR, item));
  }
  else if (symbolType == 'image') {
    symbol = DvtLegendRenderer._createImage(legend, x, y, symbolWidth, symbolHeight, rowHeight, item);
  }
  else {
    symbol = DvtLegendRenderer._createMarker(legend, cx, cy, symbolWidth, symbolHeight, item);
  }
  return symbol;
};

/**
 * Creates a image symbol
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {number} x The x coordinate of the legend symbol.
 * @param {number} y The y coordinate of the legend symbol.
 * @param {number} symbolWidth Image width.
 * @param {number} symbolHeight Image height.
 * @param {number} rowHeight Height of row (impacted by font size).
 * @param {object} item The data for the legend item.
 * @return {dvt.ImageMarker}
 * @private
 */
DvtLegendRenderer._createImage = function(legend, x, y, symbolWidth, symbolHeight, rowHeight, item) {
  var context = legend.getCtx();

  var imageY = y + (rowHeight) / 2;
  var imageX = x + (symbolWidth) / 2;

  return new dvt.ImageMarker(context, imageX, imageY, symbolWidth, symbolHeight, null, item['source']);
};

/**
 * Creates a marker symbol.
 * @param {dvt.Legend} legend The legend being rendered.
 * @param {number} cx The x coordinate of the legend symbol.
 * @param {number} cy The y coordinate of the legend symbol.
 * @param {number} symbolWidth The column width allocated to the legend symbol.
 * @param {number} symbolHeight The height of the legend item.
 * @param {object} item The data for the legend item.
 * @return {dvt.SimpleMarker}
 * @private
 */
DvtLegendRenderer._createMarker = function(legend, cx, cy, symbolWidth, symbolHeight, item) {
  var context = legend.getCtx();
  var legendOptions = legend.getOptions();

  // Find the style values
  var shape = item['markerShape'];
  var color = item['markerColor'] ? item['markerColor'] : item['color'];
  var pattern = item['pattern'];


  var legendMarker;
  if (pattern && (pattern != 'none')) {
    // Pattern markers must be translated, since the pattern starts at the origin of the shape
    legendMarker = new dvt.SimpleMarker(context, shape, legendOptions['skin'], 0, 0, symbolWidth, symbolHeight);
    legendMarker.setFill(new dvt.PatternFill(pattern, color, '#FFFFFF'));
    legendMarker.setTranslate(cx, cy);
  }
  else {
    legendMarker = new dvt.SimpleMarker(context, shape, legendOptions['skin'], cx, cy, symbolWidth, symbolHeight);
    legendMarker.setSolidFill(color);
  }

  if (item['borderColor']) {
    var borderWidth = item['_borderWidth'] ? item['_borderWidth'] : 1;
    legendMarker.setSolidStroke(item['borderColor'], null, borderWidth);
  }

  // Use pixel hinting for crisp squares
  if (shape == 'square')
    legendMarker.setPixelHinting(true);

  return legendMarker;
};


/**
 * Creates a line symbol.
 * @param {dvt.Context} context The context in which to create the legend item.
 * @param {number} x The x coordinate of the legend symbol.
 * @param {number} y The y coordinate of the legend symbol.
 * @param {number} colWidth The column width allocated to the legend symbol.
 * @param {number} rowHeight The height of the legend item.
 * @param {object} item The data for the legend item.
 * @return {dvt.Line}
 * @private
 */
DvtLegendRenderer._createLine = function(context, x, y, colWidth, rowHeight, item) {
  var lineY = y + rowHeight / 2;
  var line = new dvt.Line(context, x, lineY, x + colWidth, lineY);
  var stroke = new dvt.SolidStroke(item['color'], 1, item['lineWidth']);

  // Set the line style. The size and the spacing of the dash/dot has to be shrunk so that it's readable inside the 10px box.
  var style = item['lineStyle'];
  if (style == 'dashed')
    stroke.setType(dvt.Stroke.convertTypeString(style), '4,2,4');
  else if (style == 'dotted')
    stroke.setType(dvt.Stroke.convertTypeString(style), '2');

  line.setStroke(stroke);
  line.setPixelHinting(true);
  return line;
};

/**
 * Get the category from a legend item.
 * @param {object} item The legend item
 * @return {String}
 */
DvtLegendRenderer.getItemCategory = function(item) {
  var category = null;
  if (item['categories'] && item['categories'].length > 0)
    category = item['categories'][0];
  else
    category = item['id'] ? item['id'] : item['text'];

  return category;
};

/**
 * Helper function to check if category is hidden
 * @param {String} category the category string
 * @param {dvt.Legend} legend The legend being rendered.
 * @return {boolean} true if the category is in the hiddenCategories array
 */
DvtLegendRenderer.isCategoryHidden = function(category, legend) {
  var hiddenCategories = legend.getOptions()['hiddenCategories'];

  if (!hiddenCategories || hiddenCategories.length <= 0)
    return false;

  return dvt.ArrayUtils.getIndex(hiddenCategories, category) !== -1;
};


dvt.exportProperty(dvt, 'Legend', dvt.Legend);
dvt.exportProperty(dvt.Legend, 'newInstance', dvt.Legend.newInstance);
dvt.exportProperty(dvt.Legend.prototype, 'destroy', dvt.Legend.prototype.destroy);
dvt.exportProperty(dvt.Legend.prototype, 'getAutomation', dvt.Legend.prototype.getAutomation);
dvt.exportProperty(dvt.Legend.prototype, 'getPreferredSize', dvt.Legend.prototype.getPreferredSize);
dvt.exportProperty(dvt.Legend.prototype, 'highlight', dvt.Legend.prototype.highlight);
dvt.exportProperty(dvt.Legend.prototype, 'render', dvt.Legend.prototype.render);

dvt.exportProperty(DvtLegendAutomation.prototype, 'getDomElementForSubId', DvtLegendAutomation.prototype.getDomElementForSubId);
dvt.exportProperty(DvtLegendAutomation.prototype, 'getItem', DvtLegendAutomation.prototype.getItem);
dvt.exportProperty(DvtLegendAutomation.prototype, 'getSection', DvtLegendAutomation.prototype.getSection);
dvt.exportProperty(DvtLegendAutomation.prototype, 'getTitle', DvtLegendAutomation.prototype.getTitle);
})(dvt);

  return dvt;
});
