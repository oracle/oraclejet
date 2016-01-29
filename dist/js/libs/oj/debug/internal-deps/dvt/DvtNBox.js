/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

  // Map the D namespace to dvt, which is used to provide access across partitions.
  var D = dvt;
  
// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * NBox component.  This nbox should never be instantiated directly.  Use the
 * newInstance function instead.
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @class
 * @constructor
 * @extends {DvtBaseComponent}
 * @export
 */
var DvtNBox = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

DvtObj.createSubclass(DvtNBox, DvtBaseComponent, 'DvtNBox');


/**
 * Returns a new instance of DvtNBox.
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {DvtNBox}
 * @export
 */
DvtNBox.newInstance = function(context, callback, callbackObj) {
  return new DvtNBox(context, callback, callbackObj);
};


/**
 * Returns a copy of the default options for the specified skin.
 * @param {string} skin The skin whose defaults are being returned.
 * @return {object} The object containing defaults for this component.
 * @export
 */
DvtNBox.getDefaults = function(skin) {
  return (new DvtNBoxDefaults()).getDefaults(skin);
};


/**
 * @override
 */
DvtNBox.prototype.Init = function(context, callback, callbackObj) {
  DvtNBox.superclass.Init.call(this, context, callback, callbackObj);

  // Create the defaults object
  this.Defaults = new DvtNBoxDefaults();

  // Create the event handler and add event listeners
  this.EventManager = new DvtNBoxEventManager(this);
  this.EventManager.addListeners(this);

  // Drag and drop support
  this._dragSource = new DvtDragSource(context);
  this._dropTarget = new DvtNBoxDropTarget(this);
  this.EventManager.setDragSource(this._dragSource);

  // Set up keyboard handler on non-touch devices
  if (!DvtAgent.isTouchDevice())
    this.EventManager.setKeyboardHandler(this.CreateKeyboardHandler(this.EventManager));

  // Make sure the object has an id for clipRect naming
  this.setId('nbox' + 1000 + Math.floor(Math.random() * 1000000000));//@RandomNumberOk

  /**
   * Reference to animation in progress.
   * @private
   */
  this._animation = null;

  /**
   * The legend of the nbox.  This will be set during render time.
   * @type {DvtLegend}
   */
  this.legend = null;

  /**
   * The array of logical objects for this nbox.
   * @private
   */
  this._peers = [];

  /**
   * Flag for disabling all animation
   * @private
   */
  this._animationAllowed = true;
};


/**
 * @override
 */
DvtNBox.prototype.SetOptions = function(options) {
  if (!options)
    options = this.getSanitizedOptions();

  if (options) {
    // Combine the user options with the defaults and store
    this.Options = this.Defaults.calcOptions(options);

    // Process the data to add bulletproofing
    DvtNBoxDataUtils.processDataObject(this);

    // Disable animation for canvas and xml
    if (!DvtAgent.isEnvironmentBrowser()) {
      this.Options[DvtNBoxConstants.ANIMATION_ON_DISPLAY] = 'none';
      this.Options[DvtNBoxConstants.ANIMATION_ON_DATA_CHANGE] = 'none';
    }
  }
  else if (!this.Options) // No object has ever been provided, copy the defaults
    this.Options = this.GetDefaults();
  this._displayables = [];

  // Initialize the selection handler
  var selectionMode = this.Options[DvtNBoxConstants.SELECTION_MODE];
  if (selectionMode == 'single')
    this._selectionHandler = new DvtSelectionHandler(DvtSelectionHandler.TYPE_SINGLE);
  else if (selectionMode == 'multiple')
    this._selectionHandler = new DvtSelectionHandler(DvtSelectionHandler.TYPE_MULTIPLE);
  else
    this._selectionHandler = null;

  // Pass to event handler
  this.EventManager.setSelectionHandler(this._selectionHandler);
};


/**
 * @override
 * @export
 */
DvtNBox.prototype.render = function(options, width, height) {
  //  If datachange animation, save nbox info before rendering for later use.
  var animationOnDataChange = DvtNBoxStyleUtils.getAnimationOnDataChange(this);
  var oldNBox = null;

  if (this.Options && animationOnDataChange !== 'none') {
    oldNBox = {'options': this.Options,
                'getOptions': function() {return this['options'];},
                'displayables': this._displayables,
                'getDisplayables': function() {return this['displayables'];},
                'id': this.getId(),
                'getId': function() {return this['id']}};

    // Also expose getOptions directly, since it will be called by internal code that is renamed.
    oldNBox.getOptions = oldNBox['getOptions'];
    oldNBox.getDisplayables = oldNBox['getDisplayables'];
    oldNBox.getId = oldNBox['getId'];
  }

  // Cleanup objects from the previous render
  this.__cleanUp();

  // Update if a new options object has been provided or initialize with defaults if needed.
  this.SetOptions(options);

  // Update the width and height if provided
  if (!isNaN(width) && !isNaN(height)) {
    this.Width = width;
    this.Height = height;
  }

  // Create a new container and render the component into it
  var container = new DvtContainer(this.getCtx());
  this.addChild(container);
  DvtNBoxRenderer.render(this, container, new DvtRectangle(0, 0, this.Width, this.Height));

  // Set the nbox, the panel drawer and the legend as keyboard listeners that are connected through tabbing
  var keyboardHandlers = [this];
  var legendData = DvtNBoxDataUtils.getLegend(this);
  if (legendData && legendData['sections']) {
    var panelDrawer = DvtNBoxDataUtils.getDisplayable(this, legendData, 'panelDrawer');
    if (panelDrawer) {
      keyboardHandlers.push(panelDrawer);
      if (panelDrawer.isDisclosed()) {
        var legend = DvtNBoxDataUtils.getDisplayable(this, legendData, 'legend');
        keyboardHandlers.push(legend);
      }
    }
  }
  this.getCtx().setKeyboardFocusArray(keyboardHandlers);

  // if no keyboard focus, set to drawer if present
  if (options && DvtNBoxDataUtils.getDrawer(this) && DvtNBoxDataUtils.getGrouping(this)) {
    var drawer = DvtNBoxDataUtils.getDisplayable(this, DvtNBoxDataUtils.getDrawer(this));
    this.EventManager.setFocus(drawer);
    this.EventManager.setFocused(false);
  }

  // Update keyboard focus
  this._updateKeyboardFocusEffect();

  // Animation Support
  // Stop any animation in progress
  if (this._animation) {
    this._animationStopped = true;  // TODO Rename
    this._animation.stop();
  }

  // Construct the new animation playable
  var animationOnDisplay = DvtNBoxStyleUtils.getAnimationOnDisplay(this);
  var animationDuration = DvtNBoxStyleUtils.getAnimationDuration(this);
  var bounds = new DvtRectangle(0, 0, this.Width, this.Height);
  var bBlackBoxUpdate = false; // true if this is a black box update animation

  if (!this._container) {
    if (animationOnDisplay !== 'none') {
      // AnimationOnDisplay
      this._animation = DvtBlackBoxAnimationHandler.getInAnimation(this.getCtx(), animationOnDisplay, container,
                                                                   bounds, animationDuration);
    }
  }
  else if (animationOnDataChange != 'none' && options) {
    // AnimationOnDataChange
    this._animation = DvtBlackBoxAnimationHandler.getCombinedAnimation(this.getCtx(), animationOnDataChange, this._container,
                                                                       container, bounds, animationDuration);
    if (this._animation) {           // Black Box Animation
      bBlackBoxUpdate = true;
    }
    else {
      this._deleteContainer = new DvtContainer(this.getCtx(), 'DeleteContainer');
      this.addChild(this._deleteContainer);
      var ah = new DvtNBoxDataAnimationHandler(this.getCtx(), this._deleteContainer, oldNBox, this);
      ah.constructAnimation([oldNBox], [this]);
      this._animation = ah.getAnimation();
    }
  }

  // If an animation was created, play it
  if (this._animation) {
    this.setMouseEnabled(false);
    DvtPlayable.appendOnEnd(this._animation, this._onAnimationEnd, this);
    if (DvtAgent.isPlatformIE() && DvtAgent.getVersion() >= 12) {
      // Edge can return incorrect values for getBBox on text elements after animation
      // Hacking for now by forcing a full non-animated render
      DvtPlayable.appendOnEnd(this._animation, function() {this.setAnimationAllowed(false); this.render(options); this.setAnimationAllowed(true);}, this);
    }
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
  }

  // Update the pointer to the new container
  this._container = container;

  this.UpdateAriaAttributes();
};


/**
 * Performs cleanup of the previously rendered content.  Note that this doesn't cleanup anything needed for animation.
 * @protected
 */
DvtNBox.prototype.__cleanUp = function() {
  // Tooltip cleanup
  this.EventManager.hideTooltip();

  // Clear the list of registered peers
  this._peers.length = 0;
};


/**
 * Hook for cleaning up animation behavior at the end of the animation.
 * @private
 */
DvtNBox.prototype._onAnimationEnd = function() {
  // Clean up the old container used by black box updates
  if (this._oldContainer) {
    this.removeChild(this._oldContainer);
    this._oldContainer.destroy();
    this._oldContainer = null;
  }

  if (this._deleteContainer) {
    this.removeChild(this._deleteContainer);
    this._deleteContainer.destroy();
  }
  this._deleteContainer = null;

  // Reset the animation flag and reference
  this._animationStopped = false;
  this._animation = null;
  this.setMouseEnabled(true);
};


/**
 * @override
 */
DvtNBox.prototype.CreateKeyboardHandler = function(manager) {
  return new DvtNBoxKeyboardHandler(manager, this);
};

/**
 * Gets the child container
 *
 * @return {DvtContainer} child container
 */
DvtNBox.prototype.getChildContainer = function() {
  return this._container;
};

/**
 * Gets the delete container used for animation
 *
 * @return {DvtContainer} the delete container
 */
DvtNBox.prototype.getDeleteContainer = function() {
  return this._deleteContainer;
};


/**
 * Return the array of registered displayables
 *
 * @return {array} the registered displayables
 */
DvtNBox.prototype.getDisplayables = function() {
  return this._displayables;
};


/**
 * Updates keyboard focus effect
 * @private
 */
DvtNBox.prototype._updateKeyboardFocusEffect = function() {
  var navigable = this.EventManager.getFocus();
  var isShowingKeyboardFocusEffect = false;
  if (navigable) {
    var newNavigable;
    isShowingKeyboardFocusEffect = navigable.isShowingKeyboardFocusEffect();

    if (navigable.getKeyboardFocusDisplayable) {
      newNavigable = navigable.getKeyboardFocusDisplayable();
    }
    if (newNavigable && isShowingKeyboardFocusEffect)
      newNavigable.showKeyboardFocusEffect();

    this.EventManager.setFocus(newNavigable);
  }
};

/**
 * @override
 */
DvtNBox.prototype.getEventManager = function() {
  return this.EventManager;
};


/**
 * Processes the specified event.
 * @param {object} event
 * @param {object} source The component that is the source of the event, if available.
 */
DvtNBox.prototype.processEvent = function(event, source) {
  var type = event.getType();
  var options = this.getSanitizedOptions();
  if (type == DvtCategoryHideShowEvent.TYPE_HIDE || type == DvtCategoryHideShowEvent.TYPE_SHOW) {
    event = this._processHideShowEvent(event);
  }
  else if (type == DvtCategoryRolloverEvent.TYPE_OVER || type == DvtCategoryRolloverEvent.TYPE_OUT) {
    event = this._processRolloverEvent(event);
  }
  else if (type == DvtSelectionEvent.TYPE) {
    event = this._processSelectionEvent(event);
  }
  else if (options['_legend'] && type == DvtPanelDrawerEvent.TYPE) {
    var disclosure = event.getSubType() == DvtPanelDrawerEvent.SUBTYPE_HIDE ? 'undisclosed' : 'disclosed';
    event = new DvtSetPropertyEvent();
    event.addParam(DvtNBoxConstants.LEGEND_DISCLOSURE, disclosure);
    options[DvtNBoxConstants.LEGEND_DISCLOSURE] = disclosure;
    this.render(options);
  }

  if (event) {
    this.dispatchEvent(event);
  }
};


/**
 * Processes hide/show event
 * @param {DvtCategoryHideShowEvent} event hide/show event
 * @return {object} processed event
 * @private
 */
DvtNBox.prototype._processHideShowEvent = function(event) {
  var options = this.getSanitizedOptions();
  var hiddenCategories = options[DvtNBoxConstants.HIDDEN_CATEGORIES];
  if (!hiddenCategories) {
    hiddenCategories = [];
  }
  var categoryIndex = DvtArrayUtils.getIndex(hiddenCategories, event.getCategory());
  if (event.getType() == DvtCategoryHideShowEvent.TYPE_HIDE && categoryIndex == -1) {
    hiddenCategories.push(event.getCategory());
  }
  if (event.getType() == DvtCategoryHideShowEvent.TYPE_SHOW && categoryIndex != -1) {
    hiddenCategories.splice(categoryIndex, 1);
  }
  if (hiddenCategories.length == 0) {
    hiddenCategories = null;
  }
  event = new DvtSetPropertyEvent();
  event.addParam(DvtNBoxConstants.HIDDEN_CATEGORIES, hiddenCategories);
  options[DvtNBoxConstants.HIDDEN_CATEGORIES] = hiddenCategories;
  this.render(options);
  return event;
};


/**
 * Processes rollover event
 * @param {DvtCategoryRolloverEvent} event rollover event
 * @return {object} processed event
 * @private
 */
DvtNBox.prototype._processRolloverEvent = function(event) {
  this._processHighlighting(event['categories']);
  return event;
};


/**
 * Processes selection event.
 * @param {DvtSelectionEvent} event Selection event.
 * @return {object} Processed event.
 * @private
 */
DvtNBox.prototype._processSelectionEvent = function(event) {
  var selection = event.getSelection();
  var selectedItems = null;
  if (selection) {
    var selectedMap = {};
    for (var i = 0; i < selection.length; i++) {
      selectedMap[selection[i]] = true;
    }
    var objects = this.getObjects();
    // Process category nodes
    var drawer = null;
    if (DvtNBoxDataUtils.getGrouping(this)) {
      for (var i = 0; i < objects.length; i++) {
        if (objects[i] instanceof DvtNBoxCategoryNode) {
          if (selectedMap[objects[i].getId()]) {
            // Replace with the individual ids
            selectedMap[objects[i].getId()] = false;
            var data = objects[i].getData();
            var nodeIndices = data['nodeIndices'];
            for (var j = 0; j < nodeIndices.length; j++) {
              var node = DvtNBoxDataUtils.getNode(this, nodeIndices[j]);
              selectedMap[node[DvtNBoxConstants.ID]] = true;
            }
          }
        }
        else if (objects[i] instanceof DvtNBoxDrawer)
          drawer = objects[i];
      }
    }
    var eventSelection = [];
    selectedItems = [];
    for (var id in selectedMap) {
      if (selectedMap[id]) {
        eventSelection.push(id);
        selectedItems.push(id);
      }
    }
    event = new DvtSelectionEvent(eventSelection);
  }
  DvtNBoxDataUtils.setSelectedItems(this, selectedItems);
  if (drawer)
    drawer.UpdateAccessibilityAttributes();
  return event;
};


/**
 * Distributes the specified event to this nbox's children.
 * @param {object} event
 * @param {object} source The component that is the source of the event, if available.
 * @private
 */
DvtNBox.prototype._distributeToChildren = function(event, source) {
  if (this.legend && this.legend != source)
    this.legend.processEvent(event, source);
};


/**
 * Registers the object peer with the nbox.  The peer must be registered to participate
 * in interactivity.
 * @param {DvtNBoxObjPeer} peer
 */
DvtNBox.prototype.registerObject = function(peer) {
  this._peers.push(peer);
};


/**
 * Returns the peers for all objects within the nbox.
 * @return {array}
 */
DvtNBox.prototype.getObjects = function() {
  return this._peers;
};


/**
 * @return {number} nbox width
 */
DvtNBox.prototype.getWidth = function() {
  return this.Width;
};


/**
 * @return {number} nbox height
 */
DvtNBox.prototype.getHeight = function() {
  return this.Height;
};


/**
 * Returns the selection handler for the nbox.
 * @return {DvtSelectionHandler} The selection handler for the nbox
 */
DvtNBox.prototype.getSelectionHandler = function() {
  return this._selectionHandler;
};


/**
  *  Returns whether selecton is supported on the nbox.
  *  @return {boolean} True if selection is turned on for the nbox and false otherwise.
  */
DvtNBox.prototype.isSelectionSupported = function() {
  return (this._selectionHandler ? true : false);
};


/**
 * Returns the array of DvtShowPopupBehaviors for the given stamp id.
 * @param {string} stampId The id of the stamp containing the showPopupBehaviors.
 * @return {array} The array of showPopupBehaviors.
 */
DvtNBox.prototype.getShowPopupBehaviors = function(stampId) {
  return this._popupBehaviors ? this._popupBehaviors[stampId] : null;
};


/**
 * Animates an update between NBox states
 *
 * @param {DvtNBoxDataAnimationHandler} animationHandler the animation handler
 * @param {object} oldNBox an object representing the old NBox state
 */
DvtNBox.prototype.animateUpdate = function(animationHandler, oldNBox) {
  DvtNBoxRenderer.animateUpdate(animationHandler, oldNBox, this);
};


/**
 * Returns a copy of the options object with internal-only properties removed
 *
 * @return {object} the options object
 */
DvtNBox.prototype.getSanitizedOptions = function() {
  return DvtJSONUtils.clone(this.getOptions(),
      function(key) {
        return key.indexOf('__') != 0;
      }
  );
};


/**
 * Returns an object containing the panel drawer styles
 *
 * @return {object} an object containing the panel drawer styles
 */
DvtNBox.prototype.getSubcomponentStyles = function() {
  // TODO: refactor the control panel naming
  // just return an empty map and take the panel drawer defaults
  return {};
};


/**
 * Returns the clientId of the drag source owner if dragging is supported.
 * @param {array} clientIds
 * @return {string}
 */
DvtNBox.prototype.__isDragAvailable = function(clientIds) {
  // Drag and drop supported when selection is enabled, only 1 drag source
  if (this._selectionHandler)
    return clientIds[0];
  else
    return null;
};


/**
 * Returns the row keys for the current drag.
 * @param {DvtBaseTreeNode} node The node where the drag was initiated.
 * @return {array} The row keys for the current drag.
 */
DvtNBox.prototype.__getDragTransferable = function(node) {
  // Select the node if not already selected
  if (!node.isSelected()) {
    this._selectionHandler.processClick(node, false);
    this.EventManager.fireSelectionEvent();
  }

  // Gather the rowKeys for the selected objects
  var rowKeys = [];
  var selectionMap = {};
  var selection = this._selectionHandler.getSelection();
  for (var i = 0; i < selection.length; i++) {
    var item = selection[i];
    if (item instanceof DvtNBoxNode) {
      var id = item.getData()[DvtNBoxConstants.ID];
      rowKeys.push(id);
      selectionMap[id] = true;
    }
    else if (item instanceof DvtNBoxCategoryNode) {
      var nodeIndices = item.getData()['nodeIndices'];
      for (var j = 0; j < nodeIndices.length; j++) {
        var nodeId = DvtNBoxDataUtils.getNode(this, nodeIndices[j])[DvtNBoxConstants.ID];
        rowKeys.push(nodeId);
        selectionMap[nodeId] = true;
      }
      selectionMap[item.getData()[DvtNBoxConstants.ID]] = true;
    }
  }

  // grab hidden selections
  var selectedIds = this._selectionHandler.getSelectedIds();
  for (var i = 0; i < selectedIds.length; i++) {
    var id = selectedIds[i];
    if (!selectionMap[id]) {
      if (!isNaN(DvtNBoxDataUtils.getNodeIndex(this, id))) {
        rowKeys.push(id);
        selectionMap[id] = true;
      }
      else if (DvtNBoxDataUtils.getGrouping(this) && DvtNBoxDataUtils.getCategoryNode(this, id)) {
        var nodeIndices = DvtNBoxDataUtils.getCategoryNode(this, id)['nodeIndices'];
        for (var j = 0; j < nodeIndices.length; j++) {
          var nodeId = DvtNBoxDataUtils.getNode(this, nodeIndices[j])[DvtNBoxConstants.ID];
          if (!selectionMap[nodeId]) {
            rowKeys.push(nodeId);
            selectionMap[nodeId] = true;
          }
        }
        selectionMap[id] = true;
      }
    }
  }

  return rowKeys;
};


/**
 * Returns the displayables to use for drag feedback for the current drag.
 * @return {array} The displayables for the current drag.
 */
DvtNBox.prototype.__getDragFeedback = function() {
  // This is called after __getDragTransferable, so the selection has been updated already.
  // Gather the displayables for the selected objects
  var displayables = this._selectionHandler.getSelection().slice(0);
  return displayables;
};


/**
 * Returns the cell under the specified coordinates
 * @param {number} x the x coordinate
 * @param {number} y the y coordinate
 * @return {DvtNBoxCell} the cell
 */
DvtNBox.prototype.__getCellUnderPoint = function(x, y) {
  var cellCount = DvtNBoxDataUtils.getRowCount(this) * DvtNBoxDataUtils.getColumnCount(this);
  for (var i = 0; i < cellCount; i++) {
    var cell = DvtNBoxDataUtils.getDisplayable(this, DvtNBoxDataUtils.getCell(this, i));
    if (cell.contains(x, y)) {
      return cell;
    }
  }
  return null;
};


/**
 * Displays drop site feedback for the specified cell.
 * @param {DvtNBoxCell} cell The cell for which to show drop feedback, or null to remove drop feedback.
 * @return {DvtDisplayable} The drop site feedback, if any.
 */
DvtNBox.prototype.__showDropSiteFeedback = function(cell) {
  // Remove any existing drop site feedback
  if (this._dropSiteFeedback) {
    this._dropSiteFeedback.getParent().removeChild(this._dropSiteFeedback);
    this._dropSiteFeedback = null;
  }

  // Create feedback for the cell
  if (cell) {
    this._dropSiteFeedback = cell.renderDropSiteFeedback();
  }

  return this._dropSiteFeedback;
};


/**
 * @return {DvtNBoxAutomation} the automation object
 * @export
 */
DvtNBox.prototype.getAutomation = function() {
  if (!this.Automation)
    this.Automation = new DvtNBoxAutomation(this);
  return this.Automation;
};

/**
 * @override
 */
DvtNBox.prototype.GetComponentDescription = function() {
  return DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'NBOX', DvtNBoxDataUtils.getColumnCount(this) * DvtNBoxDataUtils.getRowCount(this));
};

/**
 * @override
 * @export
 */
DvtNBox.prototype.highlight = function(categories) {
  // Update the options
  this.Options['highlightedCategories'] = DvtJSONUtils.clone(categories);

  this._processHighlighting(categories);
};

/**
 * Process highlighting based on supplied categories array
 * @param {array} categories Categories to highlight by
 * @private
 */
DvtNBox.prototype._processHighlighting = function(categories) {
  var displayables = this.getNodeDisplayables();
  // Manipulate the alphas
  var nbox = this;
  var hasCategory = function(disp) {
    if (disp instanceof DvtNBoxNode) {
      if (disp.getCategories()) {
        return nbox.getOptions()[DvtNBoxConstants.HIGHLIGHT_MATCH] == 'all' ?
            DvtArrayUtils.hasAllItems(categories, disp.getCategories()) :
            DvtArrayUtils.hasAnyItem(categories, disp.getCategories());
      }
    }
    else if (disp instanceof DvtNBoxCategoryNode) {
      // Need to check the nodes that this category node represents
      // if *any* of them match the category, should return true
      var data = disp.getData();
      var categoryNodeCount = data['nodeIndices'].length;
      for (var i = 0; i < categoryNodeCount; i++) {
        var nodeData = DvtNBoxDataUtils.getNode(nbox, data['nodeIndices'][i]);
        if (nodeData[DvtNBoxConstants.CATEGORIES]) {
          if (nbox.getOptions()[DvtNBoxConstants.HIGHLIGHT_MATCH] == 'all' ?
              DvtArrayUtils.hasAllItems(categories, nodeData[DvtNBoxConstants.CATEGORIES]) :
              DvtArrayUtils.hasAnyItem(categories, nodeData[DvtNBoxConstants.CATEGORIES]))
            return true;
        }
      }
    }
    return false;
  };

  // Rerender labels/counts according to new highlighting
  var cellCount = DvtNBoxDataUtils.getRowCount(nbox) * DvtNBoxDataUtils.getColumnCount(nbox);
  // Reset highlighted map so we can recalculate cell counts properly
  nbox.getOptions()['__highlightedMap'] = null;
  var cellCounts = DvtNBoxRenderer._calculateCellCounts(nbox);
  for (i = 0; i < cellCount; i++) {
    var cellData = DvtNBoxDataUtils.getCell(nbox, i);
    var cell = DvtNBoxDataUtils.getDisplayable(nbox, cellData);
    DvtNBoxCellRenderer.renderHeader(nbox, cellData, cell, cellCounts, false);
  }

  // Adjust alphas and category node counts
  var highlightedItems = DvtNBoxDataUtils.getHighlightedItems(nbox);
  var highlightedMap = {};
  if (highlightedItems) {
    for (var i = 0; i < highlightedItems.length; i++) {
      highlightedMap[highlightedItems[i][DvtNBoxConstants.ID]] = true;
    }
  }

  for (var i = 0; i < displayables.length; i++) {
    if (categories && categories.length > 0 && !hasCategory(displayables[i]))
      displayables[i].setAlpha(DvtNBoxStyleUtils.getFadedNodeAlpha(this));
    else
      displayables[i].setAlpha(1);
    // Remove group nodes across cells to rerender with correct node counts
    if (displayables[i] instanceof DvtNBoxCategoryNode) {
      var count = 0;
      var data = displayables[i].getData();
      for (var j = 0; j < data['nodeIndices'].length; j++) {
        if (highlightedMap[data['nodeIndices'][j]])
          count += 1;
      }
      data['highlightedCount'] = count;
      var bIndicator = DvtNBoxStyleUtils.getStyledCategoryIndicatorIcon(nbox, data) != null ||
                       DvtNBoxStyleUtils.getCategoryNodeIndicatorColor(nbox, data) != null;
      DvtNBoxCategoryNodeRenderer._renderNodeCount(nbox, displayables[i].getData(), displayables[i], data['__scale'], bIndicator, data['__gap']);
    }
  }
};

/**
 * Returns list of node displayables (DvtNBoxNode, DvtNBoxCategoryNode)
 * @return {array} array of node displayables
 */
DvtNBox.prototype.getNodeDisplayables = function() {
  var dataObjects = [];
  // First collect all the relevant data objects
  // Individual Nodes
  var nodeCount = DvtNBoxDataUtils.getNodeCount(this);
  for (var i = 0; i < nodeCount; i++) {
    dataObjects.push(DvtNBoxDataUtils.getNode(this, i));
  }
  // Category Nodes
  var groupBehavior = DvtNBoxDataUtils.getGroupBehavior(this);
  var groupInfo = this.getOptions()['__groups'];
  if (groupInfo) {
    if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
      var cellCount = DvtNBoxDataUtils.getRowCount(this) * DvtNBoxDataUtils.getColumnCount(this);
      for (var i = 0; i < cellCount; i++) {
        var cellGroups = groupInfo[i + ''];
        for (var id in cellGroups) {
          dataObjects.push(cellGroups[id]);
        }
      }
    }
    else {
      for (var id in groupInfo) {
        dataObjects.push(groupInfo[id]);
      }
    }
  }
  // Now pull the list of displayables from the data objects
  var displayables = [];
  for (var i = 0; i < dataObjects.length; i++) {
    var displayable = DvtNBoxDataUtils.getDisplayable(this, dataObjects[i]);
    if (displayable) {
      displayables.push(displayable);
    }
  }
  return displayables;
};

/**
 * Gets whether animation is allowed.  Used by DvtNBoxStyleUtils when retrieving animationOnDisplay and
 * animationOnDataChange
 * @return {boolean} whether animation is allowed
 */
DvtNBox.prototype.isAnimationAllowed = function() {
  return this._animationAllowed;
};

/**
 * Sets whether animation is allowed.  Used by DvtNBoxStyleUtils when retrieving animationOnDisplay and
 * animationOnDataChange
 * @param {boolean} animationAllowed whether animation is allowed
 */
DvtNBox.prototype.setAnimationAllowed = function(animationAllowed) {
  this._animationAllowed = animationAllowed;
};
// APIs called by the ADF Faces drag source for DvtNBox


/**
 * If this object supports drag, returns the client id of the drag component.
 * Otherwise returns null.
 * @param mouseX the x coordinate of the mouse
 * @param mouseY the x coordinate of the mouse
 * @param clientIds the array of client ids of the valid drag components
 */
DvtNBox.prototype.isDragAvailable = function(mouseX, mouseY, clientIds) {
  return this._dragSource.isDragAvailable(clientIds);
};


/**
 * Returns the transferable object for a drag initiated at these coordinates.
 */
DvtNBox.prototype.getDragTransferable = function(mouseX, mouseY) {
  return this._dragSource.getDragTransferable(mouseX, mouseY);
};


/**
 * Returns the feedback for the drag operation.
 */
DvtNBox.prototype.getDragOverFeedback = function(mouseX, mouseY) {
  return this._dragSource.getDragOverFeedback(mouseX, mouseY);
};


/**
 * Returns an Object containing the drag context info.
 */
DvtNBox.prototype.getDragContext = function(mouseX, mouseY) {
  return this._dragSource.getDragContext(mouseX, mouseY);
};


/**
 * Returns the offset to use for the drag feedback. This positions the drag
 * feedback relative to the pointer.
 */
DvtNBox.prototype.getDragOffset = function(mouseX, mouseY) {
  return this._dragSource.getDragOffset(mouseX, mouseY);
};


/**
 * Returns the offset from the mouse pointer where the drag is considered to be located.
 */
DvtNBox.prototype.getPointerOffset = function(xOffset, yOffset) {
  return this._dragSource.getPointerOffset(xOffset, yOffset);
};


/**
 * Notifies the component that a drag started.
 */
DvtNBox.prototype.initiateDrag = function() {
  this._dragSource.initiateDrag();
};


/**
 * Clean up after the drag is completed.
 */
DvtNBox.prototype.dragDropEnd = function() {
  this._dragSource.dragDropEnd();
};
// APIs called by the ADF Faces drop target for DvtNBox


/**
 * If a drop is possible at these mouse coordinates, returns the client id
 * of the drop component. Returns null if drop is not possible.
 */
DvtNBox.prototype.acceptDrag = function(mouseX, mouseY, clientIds) {
  return this._dropTarget.acceptDrag(mouseX, mouseY, clientIds);
};


/**
 * Paints drop site feedback as a drag enters the drop site.
 */
DvtNBox.prototype.dragEnter = function() {
  this._dropTarget.dragEnter();
};


/**
 * Cleans up drop site feedback as a drag exits the drop site.
 */
DvtNBox.prototype.dragExit = function() {
  this._dropTarget.dragExit();
};


/**
 * Returns the object representing the drop site. This method is called when a valid
 * drop is performed.
 */
DvtNBox.prototype.getDropSite = function(mouseX, mouseY) {
  return this._dropTarget.getDropSite(mouseX, mouseY);
};
// Copyright (c) 2013, 2015, Oracle and/or its affiliates. All rights reserved.


/**
 * NBox Constants
 * @class
 */
var DvtNBoxConstants = {};

DvtObj.createSubclass(DvtNBoxConstants, DvtObj, 'DvtNBoxConstants');

/**
 * @const
 */
DvtNBoxConstants.COLUMN = 'column';

/**
 * @const
 */
DvtNBoxConstants.COLUMNS = 'columns';

/**
 * @const
 */
DvtNBoxConstants.COLUMNS_TITLE = 'columnsTitle';

/**
 * @const
 */
DvtNBoxConstants.COLUMNS_TITLE_STYLE = 'columnsTitleStyle';

/**
 * @const
 */
DvtNBoxConstants.COLUMN_LABEL_STYLE = 'columnLabelStyle';

/**
 * @export
 * @const
 */
DvtNBoxConstants.MAXIMIZED_COLUMN = 'maximizedColumn';

/**
 * @const
 */
DvtNBoxConstants.ROW = 'row';

/**
 * @const
 */
DvtNBoxConstants.ROWS = 'rows';

/**
 * @const
 */
DvtNBoxConstants.ROWS_TITLE = 'rowsTitle';

/**
 * @const
 */
DvtNBoxConstants.ROWS_TITLE_STYLE = 'rowsTitleStyle';

/**
 * @const
 */
DvtNBoxConstants.ROW_LABEL_STYLE = 'rowLabelStyle';

/**
 * @export
 * @const
 */
DvtNBoxConstants.MAXIMIZED_ROW = 'maximizedRow';

/**
 * @const
 */
DvtNBoxConstants.CELL = 'cell';

/**
 * @const
 */
DvtNBoxConstants.CELLS = 'cells';

/**
 * @const
 */
DvtNBoxConstants.CELL_DEFAULTS = 'cellDefaults';

/**
 * @const
 */
DvtNBoxConstants.NODES = 'nodes';

/**
 * @const
 */
DvtNBoxConstants.NODE_DEFAULTS = 'nodeDefaults';

/**
 * @const
 */
DvtNBoxConstants.CATEGORIES = 'categories';

/**
 * @const
 */
DvtNBoxConstants.ICON = 'icon';

/**
 * @const
 */
DvtNBoxConstants.ICON_DEFAULTS = 'iconDefaults';

/**
 * @const
 */
DvtNBoxConstants.INDICATOR = 'indicator';

/**
 * @const
 */
DvtNBoxConstants.INDICATOR_ICON = 'indicatorIcon';

/**
 * @const
 */
DvtNBoxConstants.INDICATOR_ICON_DEFAULTS = 'indicatorIconDefaults';

/**
 * @const
 */
DvtNBoxConstants.INDICATOR_COLOR = 'indicatorColor';

/**
 * @const
 */
DvtNBoxConstants.X_PERCENTAGE = 'xPercentage';

/**
 * @const
 */
DvtNBoxConstants.Y_PERCENTAGE = 'yPercentage';

/**
 * @const
 */
DvtNBoxConstants.SELECTION = 'selection';

/**
 * @const
 */
DvtNBoxConstants.SELECTION_MODE = 'selectionMode';

/**
 * @export
 * @const
 */
DvtNBoxConstants.SELECTION_INFO = 'selectionInfo';

/**
 * @const
 */
DvtNBoxConstants.HAS_SELECTION_LISTENER = 'hasSelectionListener';

/**
 * @const
 */
DvtNBoxConstants.HIGHLIGHTED_CATEGORIES = 'highlightedCategories';

/**
 * @const
 */
DvtNBoxConstants.HIGHLIGHT_MATCH = 'highlightMatch';

/**
 * @export
 * @const
 */
DvtNBoxConstants.HIDDEN_CATEGORIES = 'hiddenCategories';

/**
 * @const
 */
DvtNBoxConstants.HOVER_BEHAVIOR = 'hoverBehavior';

/**
 * @const
 */
DvtNBoxConstants.GROUP_CATEGORY = 'groupCategory';

/**
 * @const
 */
DvtNBoxConstants.GROUP_ATTRIBUTES = 'groupAttributes';

/**
 * @const
 */
DvtNBoxConstants.GROUP_BEHAVIOR = 'groupBehavior';

/**
 * @const
 */
DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL = 'withinCell';

/**
 * @const
 */
DvtNBoxConstants.GROUP_BEHAVIOR_ACROSS_CELLS = 'acrossCells';

/**
 * @const
 */
DvtNBoxConstants.OTHER_COLOR = 'otherColor';

/**
 * @const
 */
DvtNBoxConstants.OTHER_THRESHOLD = 'otherThreshold';

/**
 * @const
 */
DvtNBoxConstants.ANIMATION_ON_DATA_CHANGE = 'animationOnDataChange';

/**
 * @const
 */
DvtNBoxConstants.ANIMATION_ON_DISPLAY = 'animationOnDisplay';

/**
 * @const
 */
DvtNBoxConstants.ANIMATION_DURATION = 'animationDuration';

/**
 * @export
 * @const
 */
DvtNBoxConstants.DRAWER = '_drawer';

/**
 * @const
 */
DvtNBoxConstants.LEGEND = '_legend';

/**
 * @export
 * @const
 */
DvtNBoxConstants.LEGEND_DISCLOSURE = 'legendDisclosure';

/**
 * @const
 */
DvtNBoxConstants.ID = 'id';

/**
 * @const
 */
DvtNBoxConstants.LABEL = 'label';

/**
 * @const
 */
DvtNBoxConstants.LABEL_STYLE = 'labelStyle';

/**
 * @const
 */
DvtNBoxConstants.LABEL_HALIGN = 'labelHalign';

/**
 * @const
 */
DvtNBoxConstants.SECONDARY_LABEL = 'secondaryLabel';

/**
 * @const
 */
DvtNBoxConstants.SECONDARY_LABEL_STYLE = 'secondaryLabelStyle';

/**
 * @const
 */
DvtNBoxConstants.SHORT_DESC = 'shortDesc';

/**
 * @const
 */
DvtNBoxConstants.SHOW_COUNT = 'showCount';

/**
 * @const
 */
DvtNBoxConstants.STYLE = 'style';

/**
 * @const
 */
DvtNBoxConstants.STYLE_DEFAULTS = 'styleDefaults';

/**
 * @const
 */
DvtNBoxConstants.BORDER_COLOR = 'borderColor';

/**
 * @const
 */
DvtNBoxConstants.BORDER_RADIUS = 'borderRadius';

/**
 * @const
 */
DvtNBoxConstants.BORDER_WIDTH = 'borderWidth';

/**
 * @const
 */
DvtNBoxConstants.COLOR = 'color';

/**
 * @const
 */
DvtNBoxConstants.PATTERN = 'pattern';

/**
 * @const
 */
DvtNBoxConstants.OPACITY = 'opacity';

/**
 * @const
 */
DvtNBoxConstants.SHAPE = 'shape';

/**
 * @const
 */
DvtNBoxConstants.SOURCE = 'source';

/**
 * @const
 */
DvtNBoxConstants.HEIGHT = 'height';

/**
 * @const
 */
DvtNBoxConstants.WIDTH = 'width';

DvtBundle.addDefaultStrings(DvtBundle.NBOX_PREFIX, {
  'HIGHLIGHTED_COUNT': '{0}/{1}',
  'COMMA_SEP_LIST': '{0}, {1}',
  'OTHER': 'Other',
  'LEGEND': 'Legend',
  'GROUP_NODE': 'Group',
  'ADDITIONAL_DATA': 'Additional Data',
  'SIZE': 'Size'
});
// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {DvtBaseComponentDefaults}
 */
var DvtNBoxDefaults = function() {
  this.Init({'skyros': DvtNBoxDefaults.VERSION_1, 'alta': DvtNBoxDefaults.SKIN_ALTA});
};

DvtObj.createSubclass(DvtNBoxDefaults, DvtBaseComponentDefaults, 'DvtNBoxDefaults');


/**
 * Defaults for version 1.
 */
DvtNBoxDefaults.VERSION_1 = {
  'skin': DvtCSSStyle.SKIN_ALTA,
  'selectionMode': 'multiple',
  'animationOnDataChange': 'none',
  'animationOnDisplay': 'none',
  'cellMaximize' : 'on',
  'cellContent' : 'auto',
  'legendDisplay': 'auto',
  'legendDisclosure': 'disclosed',
  'groupBehavior': 'withinCell',
  'otherColor': '#636363',
  'otherThreshold': 0,
  'hoverBehavior': 'none',
  'highlightMatch' : 'all',
  'highlightedCategories' : [],
  'touchResponse': 'auto',
  'styleDefaults': {
    'animationDuration': 500,
    'hoverBehaviorDelay': 200,
    'columnLabelStyle': new DvtCSSStyle('font-size: 12px; color: #252525; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif'),
    'rowLabelStyle': new DvtCSSStyle('font-size: 12px; color: #252525; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif'),
    'columnsTitleStyle': new DvtCSSStyle('font-size: 14px; color: #252525; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif'),
    'rowsTitleStyle': new DvtCSSStyle('font-size: 14px; color: #252525; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif'),
    'cellDefaults': {'style': new DvtCSSStyle('background-color:#e9e9e9'),
      'maximizedStyle': new DvtCSSStyle('background-color:#dddddd'),
      'minimizedStyle': new DvtCSSStyle('background-color:#e9e9e9'),
      'labelStyle': new DvtCSSStyle('font-size: 14px; color: #252525; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;font-weight:bold'),
      'countLabelStyle': new DvtCSSStyle('font-size: 14px; color: #252525; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif'),
      'bodyCountLabelStyle': new DvtCSSStyle('color: #252525; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif'),
      'dropTargetStyle': new DvtCSSStyle('background-color:rgba(217, 244, 250, .75);border-color:#ccf6ff'),
      'showCount': 'auto',
      'showMaximize': 'on'},
    '__scrollbar': {'scrollbarBackground': 'linear-gradient(bottom, #dce2e7 0%, #f8f8f8 8%)',
      'scrollbarBorderColor': '#dce2e7',
      'scrollbarHandleColor': '#abb0b4',
      'scrollbarHandleHoverColor' : '#333333',
      'scrollbarHandleActiveColor' : '#333333'},
    '__drawerDefaults': {'background': '#e9e9e9',
      'borderColor': '#bcc7d2',
      'borderRadius': 1,
      'headerBackground': 'linear-gradient(to bottom, #f5f5f5 0%, #f0f0f0 100%)',
      'labelStyle': new DvtCSSStyle('font-size: 14px; color: #252525; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;font-weight:bold'),
      'countLabelStyle': new DvtCSSStyle('font-size: 14px; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;font-weight:bold'),
      'countBorderRadius': 1},
    'nodeDefaults': {'color': '#FFFFFF',
      'labelStyle': new DvtCSSStyle('font-size: 12px; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif'),
      'secondaryLabelStyle': new DvtCSSStyle('font-size: 11px; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif'),
      'alphaFade': 0.2,
      'borderRadius': 1,
      'hoverColor': '#FFFFFF',
      'selectionColor': '#000000',
      'iconDefaults': {'preferredSize': 19,
        'preferredSizeTouch': 34,
        'shapePaddingRatio': .15,
        'sourcePaddingRatio': 0,
        'opacity': 1,
        'pattern': 'none',
        'borderWidth': 1,
        'borderRadius' : 0,
        'shape': DvtSimpleMarker.CIRCLE},
      'indicatorIconDefaults': {'width': 10,
        'height': 10,
        'opacity': 1,
        'pattern': 'none',
        'borderWidth': 1,
        'borderRadius' : 0,
        'shape': DvtSimpleMarker.CIRCLE}},
    '__legendDefaults': {'sectionStyle': 'font-size: 12px; color: #252525; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif; font-weight:bold',
      'itemStyle': 'font-size: 12px; color: #252525; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif',
      'markerColor': '#808080'},
    '__categoryNodeDefaults': {'labelStyle': new DvtCSSStyle('font-family:"Helvetica Neue", Helvetica, Arial, sans-serif')}
  },
  '__layout': {
    'componentGap': 8,
    'titleGap': 4,
    'titleComponentGap': 4,
    'nodeLabelOnlyStartLabelGap': 5,
    'nodeStartLabelGap': 3,
    'nodeEndLabelGap': 5,
    'nodeSingleLabelGap': 2,
    'nodeDualLabelGap': 2,
    'nodeInterLabelGap': 0,
    'nodeIndicatorGap': 3,
    'nodeSwatchSize': 10,
    'categoryNodeLabelGap': 5,
    'minimumCellSize': 34,
    'cellGap': 3,
    'gridGap': 6,
    'cellStartGap': 6,
    'cellEndGap': 6,
    'cellTopGap': 6,
    'cellBottomGap': 6,
    'cellLabelGap': 6,
    'cellCloseGap': 6,
    'countLabelGap': 10,
    'markerGap': 3,
    'minimumLabelWidth': 55,
    'maximumLabelWidth': 148,
    'drawerButtonGap': 6,
    'drawerCountHorizontalGap': 5,
    'drawerCountVerticalGap': 3,
    'drawerStartGap': 6,
    'drawerLabelGap': 6,
    'drawerHeaderHeight': 31,
    'legendBottomGap': 10
  }
};

DvtNBoxDefaults.SKIN_ALTA = {
};
var DvtNBoxCell = function() {};

DvtObj.createSubclass(DvtNBoxCell, DvtContainer, 'DvtNBoxCell');


/**
 * Returns a new instance of DvtNBoxCell
 *
 * @param {DvtNBox} nbox the parent nbox
 * @param {object} data the data for this cell
 *
 * @return {DvtNBoxCell} the nbox cell
 */
DvtNBoxCell.newInstance = function(nbox, data) {
  var component = new DvtNBoxCell();
  component.Init(nbox, data);
  return component;
};


/**
 * Initializes this component
 *
 * @param {DvtNBox} nbox the parent nbox
 * @param {object} data the data for this cell
 *
 * @protected
 */
DvtNBoxCell.prototype.Init = function(nbox, data) {
  var r = DvtNBoxDataUtils.getRowIndex(nbox, data[DvtNBoxConstants.ROW]);
  var c = DvtNBoxDataUtils.getColumnIndex(nbox, data[DvtNBoxConstants.COLUMN]);
  DvtNBoxCell.superclass.Init.call(this, nbox.getCtx(), null, 'c:' + r + ',' + c);
  this._nbox = nbox;
  this._data = data;
  this._scrollContainer = false;
};


/**
 * Gets the data object
 *
 * @return {object} the data object
 */
DvtNBoxCell.prototype.getData = function() {
  return this._data;
};


/**
 * Renders the nbox cell into the available space.
 * @param {DvtContainer} container the container to render into
 * @param {object} cellLayout object containing properties related to cellLayout
 * @param {object} cellCounts Two keys ('highlighted' and 'total') which each map to an array of cell counts by cell index
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxCell.prototype.render = function(container, cellLayout, cellCounts, availSpace) {
  this._cellCounts = cellCounts;
  container.addChild(this);
  DvtNBoxDataUtils.setDisplayable(this._nbox, this._data, this);
  DvtNBoxCellRenderer.render(this._nbox, this._data, this, cellLayout, cellCounts, availSpace);
  this._nbox.EventManager.associate(this, this);
};


/**
 * Gets the container that child nodes should be added to
 *
 * @return {DvtContainer} the container that child nodes should be added to
 */
DvtNBoxCell.prototype.getChildContainer = function() {
  return this._childContainer;
};


/**
 * Sets the container that child nodes should be added to
 *
 * @param {DvtContainer} container the container that child nodes should be added to
 */
DvtNBoxCell.prototype.setChildContainer = function(container) {
  this._childContainer = container;
};


/**
 * @override
 */
DvtNBoxCell.prototype.animateUpdate = function(animationHandler, oldCell) {
  DvtNBoxCellRenderer.animateUpdate(animationHandler, oldCell, this);
};


/**
 * @override
 */
DvtNBoxCell.prototype.animateDelete = function(animationHandler, deleteContainer) {
  DvtNBoxCellRenderer.animateDelete(animationHandler, this);

};


/**
 * @override
 */
DvtNBoxCell.prototype.animateInsert = function(animationHandler) {
  DvtNBoxCellRenderer.animateInsert(animationHandler, this);
};


/**
 * @override
 */
DvtNBoxCell.prototype.isDoubleClickable = function() {
  return DvtNBoxDataUtils.isMaximizeEnabled(this._nbox);
};


/**
 * @override
 */
DvtNBoxCell.prototype.handleDoubleClick = function() {
  if (!this.isDoubleClickable())
    return;

  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(this._nbox);
  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(this._nbox);
  var options = this._nbox.getSanitizedOptions();
  var event = new DvtSetPropertyEvent();
  options[DvtNBoxConstants.DRAWER] = null;
  event.addParam(DvtNBoxConstants.DRAWER, null);
  if (maximizedRow == this._data[DvtNBoxConstants.ROW] && maximizedColumn == this._data[DvtNBoxConstants.COLUMN]) {
    options[DvtNBoxConstants.MAXIMIZED_ROW] = null;
    event.addParam(DvtNBoxConstants.MAXIMIZED_ROW, null);
    options[DvtNBoxConstants.MAXIMIZED_COLUMN] = null;
    event.addParam(DvtNBoxConstants.MAXIMIZED_COLUMN, null);
  }
  else {
    options[DvtNBoxConstants.MAXIMIZED_ROW] = this._data[DvtNBoxConstants.ROW];
    event.addParam(DvtNBoxConstants.MAXIMIZED_ROW, this._data[DvtNBoxConstants.ROW]);
    options[DvtNBoxConstants.MAXIMIZED_COLUMN] = this._data[DvtNBoxConstants.COLUMN];
    event.addParam(DvtNBoxConstants.MAXIMIZED_COLUMN, this._data[DvtNBoxConstants.COLUMN]);
  }

  var otherCell;
  var oldFocus = this._nbox.EventManager.getFocus();
  // if no keyboard focus, set to cell
  if (!oldFocus)
    this._nbox.EventManager.setFocusObj(this);
  else {
    if (oldFocus instanceof DvtNBoxNode)
      otherCell = this.getCellIndex() != DvtNBoxDataUtils.getCellIndex(this._nbox, oldFocus.getData());
    else if (oldFocus instanceof DvtNBoxNodeOverflow)
      otherCell = this != oldFocus.getParentCell();
    else if (oldFocus instanceof DvtNBoxCell)
      otherCell = this.getCellIndex() != oldFocus.getCellIndex();
    else if (oldFocus instanceof DvtNBoxCategoryNode)
      otherCell = this.getCellIndex() != oldFocus.getData()['cell'];
  }

  // if keyboard focus on object in another cell, give focus to current cell.
  if (otherCell) {
    this._nbox.EventManager.setFocusObj(this);
    this._nbox.EventManager.setFocused(false);
  }


  this._nbox.processEvent(event);
  this._nbox.render(options);
};


/**
 * Determines whether the specified coordinates are contained by this cell
 *
 * @param {number} x the x coordinate
 * @param {number} y the y coordinate
 * @return {boolean} true if the coordinates are contained by this cell, false otherwise
 */
DvtNBoxCell.prototype.contains = function(x, y) {
  var background = DvtNBoxDataUtils.getDisplayable(this._nbox, this._data, 'background');
  var minX = this.getTranslateX() + background.getX();
  var minY = this.getTranslateY() + background.getY();
  var maxX = minX + background.getWidth();
  var maxY = minY + background.getHeight();
  return minX <= x && x <= maxX && minY <= y && y <= maxY;
};


/**
 * Renders the drop site feedback for this cell
 *
 * @return {DvtDisplayable} the drop site feedback
 */
DvtNBoxCell.prototype.renderDropSiteFeedback = function() {
  return DvtNBoxCellRenderer.renderDropSiteFeedback(this._nbox, this);
};


/**
 * Process a keyboard event
 * @param {DvtKeyboardEvent} event
 */
DvtNBoxCell.prototype.HandleKeyboardEvent = function(event) {
  //use ENTER to drill down the cell and ESCAPE to drill up
  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(this._nbox);
  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(this._nbox);
  var isCellMaximized = (maximizedRow == this._data[DvtNBoxConstants.ROW] && maximizedColumn == this._data[DvtNBoxConstants.COLUMN]) ? true : false;

  if (!isCellMaximized && event.keyCode == DvtKeyboardEvent.ENTER ||
      isCellMaximized && event.keyCode == DvtKeyboardEvent.ESCAPE) {
    this.handleDoubleClick();
  }
};


/**
 * @override
 */
DvtNBoxCell.prototype.getAriaLabel = function() {
  var cellIndex = this.getCellIndex();
  var states = [];
  if (DvtNBoxDataUtils.isCellMaximized(this._nbox, cellIndex))
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'STATE_MAXIMIZED'));
  else if (DvtNBoxDataUtils.isCellMinimized(this._nbox, cellIndex))
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'STATE_MINIMIZED'));
  states.push([DvtBundle.getTranslatedString(DvtBundle.NBOX_PREFIX, 'SIZE'), this.getNodeCount()]);
  return DvtDisplayable.generateAriaLabel(this.getData()['shortDesc'], states);
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtNBoxCell.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  return DvtNBoxKeyboardHandler.getKeyboardBoundingBox(this, targetCoordinateSpace);
};


/**
 * @override
 */
DvtNBoxCell.prototype.getTargetElem = function() 
{
  return this.getElem();
};

/**
 * @override
 */
DvtNBoxCell.prototype.showKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = true;
  DvtNBoxDataUtils.getDisplayable(this._nbox, this.getData(), 'focusEffect').show();
};


/**
 * @override
 */
DvtNBoxCell.prototype.hideKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = false;
  DvtNBoxDataUtils.getDisplayable(this._nbox, this.getData(), 'focusEffect').hide();
};


/**
 * @override
 */
DvtNBoxCell.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


/**
 * @override
 */
DvtNBoxCell.prototype.getNextNavigable = function(event) 
{
  var next = null;
  if (this._nbox.EventManager.getKeyboardHandler().isNavigationEvent(event)) {
    if (event.keyCode == DvtKeyboardEvent.OPEN_BRACKET) {
      next = this._getFirstNavigableChild(event);
    }
    else {
      next = this._getNextSibling(event);
    }
  }
  return next;
};


/**
 * @private
 * Gets next sibling cell based on direction
 * @param {DvtKeyboardEvent} event
 * @return {DvtKeyboardNavigable} a sibling cell
 */
DvtNBoxCell.prototype._getNextSibling = function(event) {
  var cells = [];
  var cellCount = DvtNBoxDataUtils.getRowCount(this._nbox) * DvtNBoxDataUtils.getColumnCount(this._nbox);
  for (var i = 0; i < cellCount; i++)
    cells.push(DvtNBoxDataUtils.getDisplayable(this._nbox, DvtNBoxDataUtils.getCell(this._nbox, i)));
  return DvtKeyboardHandler.getNextNavigable(this, event, cells);
};


/**
 * @private
 * Gets a first navigable child node based on direction
 * @param {DvtKeyboardEvent} event
 * @return {DvtKeyboardNavigable} a sibling cell
 */
DvtNBoxCell.prototype._getFirstNavigableChild = function(event) {
  //node or drawer
  var childObj = null;
  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(this._nbox);
  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(this._nbox);
  var drawerData = DvtNBoxDataUtils.getDrawer(this._nbox);
  if (drawerData && maximizedRow == this.getData()[DvtNBoxConstants.ROW] && maximizedColumn == this.getData()[DvtNBoxConstants.COLUMN]) {
    childObj = DvtNBoxDataUtils.getDisplayable(this._nbox, drawerData);
  }
  else {
    var container = this.getChildContainer();
    if (container.getScrollingPane)
      container = container.getScrollingPane();
    if (container.getNumChildren() > 0 && (container.getChildAt(0) instanceof DvtNBoxNode || container.getChildAt(0) instanceof DvtNBoxNodeOverflow)) {
      //find first individual node
      childObj = DvtNBoxDataUtils.getFirstNavigableNode(this._nbox, container);
    }
    else {
      // find first category node
      var nodes = [];
      for (var i = 0; i < container.getNumChildren(); i++) {
        var child = container.getChildAt(i);
        if (child instanceof DvtNBoxCategoryNode)
          nodes.push(child);
      }
      childObj = DvtNBoxKeyboardHandler.getNextNavigableCategoryNode(null, event, nodes);
    }
  }
  return childObj;
};

/**
 * Get the current cell index
 * @return {Number} cell index
 */
DvtNBoxCell.prototype.getCellIndex = function() {
  return DvtNBoxDataUtils.getCellIndexByRowColumn(this._nbox, this.getData()[DvtNBoxConstants.ROW], this.getData()[DvtNBoxConstants.COLUMN]);
};

/**
 * Get the cell label
 * @return {String} cell label
 */
DvtNBoxCell.prototype.getLabel = function() {
  var label = this.getData()[DvtNBoxConstants.LABEL];
  return (label ? label : null);
};

/**
 * Get the cell background
 * @return {String} cell background
 */
DvtNBoxCell.prototype.getBackground = function() {
  var style = DvtNBoxStyleUtils.getCellStyle(this._nbox, this.getCellIndex());
  var bgFill = style.getStyle(DvtCSSStyle.BACKGROUND);
  var colorFill = style.getStyle(DvtCSSStyle.BACKGROUND_COLOR);
  return bgFill ? bgFill : colorFill;
};

/**
 * Returns whether the cell has overflow indicator
 * @return {boolean} whether the cell has overflow indicator
 */
DvtNBoxCell.prototype.hasOverflowIndicator = function() {
  var options = this._nbox.getOptions();
  if (options && options['__layout'] && options['__layout']['__nodeLayout'] && options['__layout']['__nodeLayout']['cellLayouts']) {
    var index = this.getCellIndex();
    var cellLayout = options['__layout']['__nodeLayout']['cellLayouts'][index];
    if (cellLayout)
      return cellLayout['overflow'];
  }
  return false;
};

/**
 * Get the number of nodes in the cell
 * @return {Number} number of nodes in the cell
 */
DvtNBoxCell.prototype.getNodeCount = function() {
  if (!this._cellCounts) {
    this._cellCounts = DvtNBoxRenderer._calculateCellCounts(this._nbox);
  }
  var index = this.getCellIndex();
  return this._cellCounts['total'][index];
};

/**
 * Get the node at the specific index
 * @param {Number} index  node index
 * @return {DvtNBoxNode} node object
 */
DvtNBoxCell.prototype.getNode = function(index) {
  var nodes = this._nbox.getOptions()[DvtNBoxConstants.NODES];
  if (nodes) {
    var nodeIndex = 0;
    for (var idx = 0; idx < nodes.length; idx++) {
      if (this.getData()[DvtNBoxConstants.ROW] == nodes[idx][DvtNBoxConstants.ROW] && this.getData()[DvtNBoxConstants.COLUMN] == nodes[idx][DvtNBoxConstants.COLUMN]
         && !DvtNBoxDataUtils.isNodeHidden(this._nbox, nodes[idx])) {
        if (index == nodeIndex)
          return nodes[idx];
        nodeIndex++;
      }
    }
  }
  return null;
};


/**
 * Returns the cell displayable (itself)
 *
 * @return {DvtDisplayable} displayable
 */
DvtNBoxCell.prototype.getDisplayable = function() {
  return this;
};

/**
 * Returns the displayable that should receive the keyboard focus
 *
 * @return {DvtDisplayable} displayable to receive keyboard focus
 */
DvtNBoxCell.prototype.getKeyboardFocusDisplayable = function() {
  // return the cell
  if (DvtNBoxDataUtils.getGroupBehavior(this._nbox) != DvtNBoxConstants.GROUP_BEHAVIOR_ACROSS_CELLS ||
      !this._nbox.getOptions()['__groups']) {
    return DvtNBoxDataUtils.getDisplayable(this._nbox, DvtNBoxDataUtils.getCell(this._nbox, DvtNBoxDataUtils.getCellIndex(this._nbox, this.getData())));
  }
  return null;
};
var DvtNBoxNode = function() {};

DvtObj.createSubclass(DvtNBoxNode, DvtContainer, 'DvtNBoxNode');


/**
 * Returns a new instance of DvtNBoxNode
 *
 * @param {DvtNBox} nbox the parent nbox
 * @param {object} data the data for this node
 *
 * @return {DvtNBoxNode} the nbox node
 */
DvtNBoxNode.newInstance = function(nbox, data) {
  var component = new DvtNBoxNode();
  component.Init(nbox, data);
  return component;
};


/**
 * Initializes this component
 *
 * @param {DvtNBox} nbox the parent nbox
 * @param {object} data the data for this node
 *
 * @protected
 */
DvtNBoxNode.prototype.Init = function(nbox, data) {
  DvtNBoxNode.superclass.Init.call(this, nbox.getCtx(), null, data[DvtNBoxConstants.ID]);
  this._nbox = nbox;
  this._data = data;
  this._nbox.registerObject(this);
  var selectionMode = this._nbox.getOptions()[DvtNBoxConstants.SELECTION_MODE];
  if (selectionMode == 'single' || selectionMode == 'multiple' || this.getAction()) {
    this.setCursor(DvtSelectionEffectUtils.getSelectingCursor());
  }
  this._maxAlpha = 1;
};


/**
 * Gets the data object
 *
 * @return {object} the data object
 */
DvtNBoxNode.prototype.getData = function() {
  return this._data;
};

/**
 * Return the action string for the data item, if any exists
 * @return {string} the action outcome for the data item
 */
DvtNBoxNode.prototype.getAction = function() {
  return this._data['action'];
};

/**
 * Renders the nbox node
 * @param {DvtContainer} container the container to render into
 * @param {object} nodeLayout An object containing properties related to the sizes of the various node subsections
 */
DvtNBoxNode.prototype.render = function(container, nodeLayout) {
  DvtNBoxNodeRenderer.render(this._nbox, this._data, this, nodeLayout);
  container.addChild(this);
  DvtNBoxDataUtils.setDisplayable(this._nbox, this._data, this);
  this._nbox.EventManager.associate(this, this);
};


/**
 * Returns true if this object is selectable.
 * @return {boolean} true if this object is selectable.
 */
DvtNBoxNode.prototype.isSelectable = function() {
  return true;
};


/**
 * Returns true if this object is selected.
 * @return {boolean} true if this object is selected.
 */
DvtNBoxNode.prototype.isSelected = function() {
  return this.getSelectionShape().isSelected();
};


/**
 * Specifies whether this object is selected.
 * @param {boolean} selected true if this object is selected.
 * @protected
 */
DvtNBoxNode.prototype.setSelected = function(selected) {
  this.getSelectionShape().setSelected(selected);
  this.UpdateAccessibilityAttributes();
};


/**
 * Displays the hover effect.
 */
DvtNBoxNode.prototype.showHoverEffect = function() {
  this.getSelectionShape().showHoverEffect();
};


/**
 * Hides the hover effect.
 */
DvtNBoxNode.prototype.hideHoverEffect = function() {
  this.getSelectionShape().hideHoverEffect();
};


/**
 * Sets the shape that should be used for displaying selection and hover feedback
 *
 * @param {DvtShape} selectionShape the shape that should be used for displaying selection and hover feedback
 */
DvtNBoxNode.prototype.setSelectionShape = function(selectionShape) {
  this._selectionShape = selectionShape;
};


/**
 * Gets the shape that should be used for displaying selection and hover feedback
 *
 * @return {DvtShape} the shape that should be used for displaying selection and hover feedback
 */
DvtNBoxNode.prototype.getSelectionShape = function() {
  return this._selectionShape;
};


/**
 * @override
 */
DvtNBoxNode.prototype.getDatatip = function(target, x, y) {

  // Custom Tooltip Support
  // Custom Tooltip via Function
  var tooltipFunc = this._nbox.getOptions()['tooltip'];
  if (tooltipFunc) {
    var dataContext = {
      'id': this._data['id'],
      'label': this._data['label'],
      'secondaryLabel': this._data['secondaryLabel'],
      'row': this._data['row'],
      'column': this._data['column'],
      'color': DvtNBoxStyleUtils.getNodeColor(this._nbox, this._data),
      'indicatorColor': DvtNBoxStyleUtils.getNodeIndicatorColor(this._nbox, this._data)
    };
    return this._nbox.getCtx().getTooltipManager().getCustomTooltip(tooltipFunc, dataContext);
  }
  return this.getShortDesc();
};


/**
 * Gets the shortDesc value for the node.
 * @return {string} the shortDesc
 */
DvtNBoxNode.prototype.getShortDesc = function() {
  return this._data[DvtNBoxConstants.SHORT_DESC];
};


/**
 * Returns the border color of the datatip for this object.
 * @return {string} The datatip border color.
 */
DvtNBoxNode.prototype.getDatatipColor = function() {
  return DvtNBoxStyleUtils.getNodeColor(this._nbox, this._data);
};


/**
 * Sets the maximium alpha value for this node.  Immediately impacts the current alpha value
 * @param {number} maxAlpha the maximum alpha value for this node
 */
DvtNBoxNode.prototype.setMaxAlpha = function(maxAlpha) {
  this._maxAlpha = maxAlpha;
  this.setAlpha(this.getAlpha());
};


/**
 * Gets the maximium alpha value for this node.
 * @return {number} the maximum alpha value for this node
 */
DvtNBoxNode.prototype.getMaxAlpha = function() {
  return this._maxAlpha;
};


/**
 * @override
 */
DvtNBoxNode.prototype.setAlpha = function(alpha) {
  DvtNBoxNode.superclass.setAlpha.call(this, Math.min(alpha, this._maxAlpha));
};


/**
 * @override
 */
DvtNBoxNode.prototype.animateUpdate = function(animationHandler, oldNode) {
  DvtNBoxNodeRenderer.animateUpdate(animationHandler, oldNode, this);
};


/**
 * @override
 */
DvtNBoxNode.prototype.animateDelete = function(animationHandler, deleteContainer) {
  DvtNBoxNodeRenderer.animateDelete(animationHandler, this);

};


/**
 * @override
 */
DvtNBoxNode.prototype.animateInsert = function(animationHandler) {
  DvtNBoxNodeRenderer.animateInsert(animationHandler, this);
};


/**
 * @override
 */
DvtNBoxNode.prototype.isDoubleClickable = function() {
  return true;
};


/**
 * @override
 */
DvtNBoxNode.prototype.handleDoubleClick = function() {
  this._getParentContainer().handleDoubleClick();
};


/**
 * @override
 */
DvtNBoxNode.prototype.getShowPopupBehaviors = function() {
  if (!this._showPopupBehaviors) {
    this._showPopupBehaviors = [];
    var spbs = this._data['showPopupBehaviors'];
    if (spbs) {
      for (var i = 0; i < spbs.length; i++) {
        this._showPopupBehaviors.push(new DvtShowPopupBehavior(spbs[i]['popupId'], spbs[i]['triggerType'], spbs[i]['alignId'], spbs[i]['align']));
      }
    }
  }
  return this._showPopupBehaviors;
};


/**
 * @override
 */
DvtNBoxNode.prototype.getPopupBounds = function(behavior) {
  if (behavior && behavior.getAlign()) {
    var matrix = DvtNBoxRenderer.getGlobalMatrix(this);
    var background = DvtNBoxDataUtils.getDisplayable(this._nbox, this._data, 'background');
    return new DvtRectangle(matrix.getTx() + background.getX(), matrix.getTy() + background.getY(), background.getWidth(), background.getHeight());
  }
  return null;
};


/**
 * @override
 */
DvtNBoxNode.prototype.isDragAvailable = function(clientIds) {
  return this._nbox.__isDragAvailable(clientIds);
};


/**
 * @override
 */
DvtNBoxNode.prototype.getDragTransferable = function(mouseX, mouseY) {
  return this._nbox.__getDragTransferable(this);
};


/**
 * @override
 */
DvtNBoxNode.prototype.getDragFeedback = function(mouseX, mouseY) {
  return this._nbox.__getDragFeedback();
};


/**
 * Helper method that gets a displayable host object that contains the node - a cell or a drawer
 * @return {DvtNBoxCell|DvtNBoxDrawer} a parent container for the node
 * @private
 */
DvtNBoxNode.prototype._getParentContainer = function() {
  var container;
  var drawerData = DvtNBoxDataUtils.getDrawer(this._nbox);
  if (drawerData) { //drawer
    container = DvtNBoxDataUtils.getDisplayable(this._nbox, drawerData);
  }
  else { //cell
    var cellIndex = DvtNBoxDataUtils.getCellIndex(this._nbox, this._data);
    var cellData = DvtNBoxDataUtils.getCell(this._nbox, cellIndex);
    container = DvtNBoxDataUtils.getDisplayable(this._nbox, cellData);
  }
  return container;
};


/**
 * @protected
 * Updates accessibility attributes on selection event
 */
DvtNBoxNode.prototype.UpdateAccessibilityAttributes = function() {
  if (!DvtAgent.deferAriaCreation()) {
    var desc = this.getAriaLabel();
    if (desc)
      this.setAriaProperty(DvtNBoxConstants.LABEL, desc);
  }
};


/**
 * @override
 */
DvtNBoxNode.prototype.getAriaLabel = function() {
  return DvtNBoxDataUtils.buildAriaDesc(this._nbox, this, this.getShortDesc(), this.isSelected());
};

/**
 * Gets the highlight/filter categories for this node.
 * @return {array} categories
 */
DvtNBoxNode.prototype.getCategories = function() {
  return this.getData()[DvtNBoxConstants.CATEGORIES] ? this.getData()[DvtNBoxConstants.CATEGORIES] : [];
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtNBoxNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  return DvtNBoxKeyboardHandler.getKeyboardBoundingBox(this, targetCoordinateSpace);
};

/**
 * @override
 */
DvtNBoxNode.prototype.getTargetElem = function() 
{
  return this.getElem();
};

/**
 * @override
 */
DvtNBoxNode.prototype.showKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = true;
  this.showHoverEffect();
  var scrollContainer = DvtNBoxDataUtils.getNodeScrollableContainer(this._nbox, this);
  if (scrollContainer)
    scrollContainer.scrollIntoView(this);
};


/**
 * @override
 */
DvtNBoxNode.prototype.hideKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = false;
  this.hideHoverEffect();
};


/**
 * @override
 */
DvtNBoxNode.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


/**
 * @override
 */
DvtNBoxNode.prototype.getNextNavigable = function(event) 
{
  var next = null;
  if (event.keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey) {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    return this;
  }
  else if (this._nbox.EventManager.getKeyboardHandler().isNavigationEvent(event)) {
    if (event.keyCode == DvtKeyboardEvent.CLOSE_BRACKET) {
      next = this._getParentContainer();
    }
    else if (event.keyCode == DvtKeyboardEvent.OPEN_BRACKET) {
      next = this;
    }
    else {
      next = DvtNBoxDataUtils.getNextNavigableNode(this._nbox, this, event);
    }
  }
  else if (event.type == DvtMouseEvent.CLICK) {
    next = this;
  }
  return next;
};

/**
 * Process a keyboard event
 * @param {DvtKeyboardEvent} event
 */
DvtNBoxNode.prototype.HandleKeyboardEvent = function(event) {
  //use ENTER to drill down the cell and ESCAPE to drill up
  var drawerData = DvtNBoxDataUtils.getDrawer(this._nbox);
  if (drawerData && event.keyCode == DvtKeyboardEvent.ESCAPE) { //drawer
    this.handleDoubleClick();
  }
  else {
    var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(this._nbox);
    var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(this._nbox);

    var isCellMaximized = (maximizedRow == this._data[DvtNBoxConstants.ROW] && maximizedColumn == this._data[DvtNBoxConstants.COLUMN]) ? true : false;

    if (!isCellMaximized && event.keyCode == DvtKeyboardEvent.ENTER ||
        isCellMaximized && event.keyCode == DvtKeyboardEvent.ESCAPE) {
      this.handleDoubleClick();
    }
  }
};


/**
 * Returns the node displayable (itself).
 *
 * @return {DvtDisplayable} displayable
 */
DvtNBoxNode.prototype.getDisplayable = function() {
  return this;
};


/**
 * Returns the displayable that should receive the keyboard focus
 *
 * @return {DvtDisplayable} displayable to receive keyboard focus
 */
DvtNBoxNode.prototype.getKeyboardFocusDisplayable = function() {
  var node = DvtNBoxDataUtils.getNode(this._nbox, DvtNBoxDataUtils.getNodeIndex(this._nbox, this.getData()[DvtNBoxConstants.ID]));
  if (node) {
    // return the node if it's still displayed
    var displayable = DvtNBoxDataUtils.getDisplayable(this._nbox, node);
    if (displayable)
      return displayable;

    // return the overflow node if there is one
    var cellData = DvtNBoxDataUtils.getCell(this._nbox, DvtNBoxDataUtils.getCellIndex(this._nbox, node));
    var cell = DvtNBoxDataUtils.getDisplayable(this._nbox, cellData);
    var lastNode = DvtNBoxDataUtils.getLastNavigableNode(this._nbox, cell.getChildContainer());
    if (lastNode instanceof DvtNBoxNodeOverflow)
      return lastNode;

    // return the group node if there is one
    var drawer = this._getParentDrawer();
    if (drawer)
      return drawer.getKeyboardFocusDisplayable();

    // return the cell
    return cell.getKeyboardFocusDisplayable();
  }
  return null;
};

/**
 * Finds and returns containing drawer, if it exists
 * @return {DvtNBoxDrawer} drawer
 * @private
 */
DvtNBoxNode.prototype._getParentDrawer = function() {
  var ancestor = this;
  while (ancestor && ancestor.getParent) {
    ancestor = ancestor.getParent();
    if (ancestor instanceof DvtNBoxDrawer) {
      return ancestor;
    }
  }
  return null;
};
var DvtNBoxNodeOverflow = function() {};

DvtObj.createSubclass(DvtNBoxNodeOverflow, DvtContainer, 'DvtNBoxNodeOverflow');

/**
 * Returns a new instance of DvtNBoxNodeOverflow
 *
 * @param {DvtNBox} nbox the parent nbox
 * @param {DvtNBoxCell} cell the cell for this object
 *
 * @return {DvtNBoxNodeOverflow} the node oveflow object
 */
DvtNBoxNodeOverflow.newInstance = function(nbox, cell) {
  var component = new DvtNBoxNodeOverflow();
  component.Init(nbox, cell);
  return component;
};


/**
 * Initializes this component
 *
 * @param {DvtNBox} nbox the parent nbox
 * @param {DvtNBoxCell} cell the cell for this object
 *
 * @protected
 */
DvtNBoxNodeOverflow.prototype.Init = function(nbox, cell) {
  DvtNBoxNodeOverflow.superclass.Init.call(this, nbox.getCtx());
  this._nbox = nbox;
  this._cell = cell;
  this._button;
};


/**
 * Renders the nbox overflow object
 * @param {DvtContainer} container the container to render into
 * @param {number} width the width of the overflow button
 * @param {number} height the height of the overflow button
 */
DvtNBoxNodeOverflow.prototype.render = function(container, width, height) {
  var options = this._nbox.getOptions();

  var w = options['_resources']['overflow_ena']['width'];
  var h = options['_resources']['overflow_ena']['height'];

  var scale = 1;
  if (width < w || height < h) {
    scale = Math.min((width) / w,
                     (height) / h);
  }

  // Image dimensions
  w = scale * w;
  h = scale * h;
  var x = (width - w) / 2;
  var y = (height - h) / 2;

  var ctx = this._nbox.getCtx();

  var upRect = new DvtRect(ctx, 0, 0, width, height);
  var overRect = new DvtRect(ctx, 0, 0, width, height);
  var downRect = new DvtRect(ctx, 0, 0, width, height);
  var disRect = new DvtRect(ctx, 0, 0, width, height);

  upRect.setInvisibleFill();
  overRect.setInvisibleFill();
  downRect.setInvisibleFill();
  disRect.setInvisibleFill();

  var upState = new DvtContainer(ctx);
  var overState = new DvtContainer(ctx);
  var downState = new DvtContainer(ctx);
  var disState = new DvtContainer(ctx);

  upState.addChild(upRect);
  overState.addChild(overRect);
  downState.addChild(downRect);
  disState.addChild(disRect);

  upState.addChild(new DvtImage(ctx, options['_resources']['overflow_ena']['src'], x, y, w, h));
  overState.addChild(new DvtImage(ctx, options['_resources']['overflow_ovr']['src'], x, y, w, h));
  downState.addChild(new DvtImage(ctx, options['_resources']['overflow_dwn']['src'], x, y, w, h));
  disState.addChild(new DvtImage(ctx, options['_resources']['overflow_dis']['src'], x, y, w, h));


  this._button = new DvtButton(ctx, upState, overState, downState, disState, null, this.HandleClick, this);
  if (!DvtNBoxDataUtils.isMaximizeEnabled(this._nbox)) {
    this._button.setEnabled(false);
    this._button.drawDisabledState();
  }

  this.addChild(this._button);
  var keyboardFocusEffect = new DvtKeyboardFocusEffect(this._nbox.getCtx(), this, new DvtRectangle(-1, -1, width + 2, height + 2));
  DvtNBoxDataUtils.setDisplayable(this._nbox, this, keyboardFocusEffect, 'focusEffect');
  container.addChild(this);
  this._addAccessibilityAttributes();
  this._nbox.EventManager.associate(this, this);


};

/**
 * Gets a cell object that contains the overflow object
 * @return {DvtNBoxCell} a parent cell for the overflow
 */
DvtNBoxNodeOverflow.prototype.getParentCell = function() {
  return this._cell;
};

/**
 * Gets the overflow button
 * @return {DvtButton} button for the overflow
 */
DvtNBoxNodeOverflow.prototype.getButton = function() {
  return this._button;
};

/**
 * Process a click event
 * @param {DvtMouseEvent} event
 */
DvtNBoxNodeOverflow.prototype.HandleClick = function(event) {
  DvtEventManager.consumeEvent(event);
  this._cell.handleDoubleClick(true);
};


/**
 * Process a keyboard event
 * @param {DvtKeyboardEvent} event
 */
DvtNBoxNodeOverflow.prototype.HandleKeyboardEvent = function(event) {
  if (event.keyCode == DvtKeyboardEvent.ENTER) {
    this._cell.handleDoubleClick();
  }
};


/**
 * @private
 * Adds accessibility attributes to the object
 */
DvtNBoxNodeOverflow.prototype._addAccessibilityAttributes = function() {
  this.setAriaRole('button');
  if (!DvtAgent.deferAriaCreation()) {
    var desc = this.getAriaLabel();
    if (desc)
      this.setAriaProperty(DvtNBoxConstants.LABEL, desc);
  }
};


/**
 * @override
 */
DvtNBoxNodeOverflow.prototype.getDatatip = function(target, x, y) {
  return DvtBundle.getTranslatedString(DvtBundle.NBOX_PREFIX, 'ADDITIONAL_DATA');
};


/**
 * @override
 */
DvtNBoxNodeOverflow.prototype.getAriaLabel = function() {
  return this.getDatatip();
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtNBoxNodeOverflow.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  return DvtNBoxKeyboardHandler.getKeyboardBoundingBox(this, targetCoordinateSpace);
};


/**
 * @override
 */
DvtNBoxNodeOverflow.prototype.getTargetElem = function() 
{
  return this.getElem();
};


/**
 * @override
 */
DvtNBoxNodeOverflow.prototype.showKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = true;
  DvtNBoxDataUtils.getDisplayable(this._nbox, this, 'focusEffect').show();
};


/**
 * @override
 */
DvtNBoxNodeOverflow.prototype.hideKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = false;
  DvtNBoxDataUtils.getDisplayable(this._nbox, this, 'focusEffect').hide();
};


/**
 * @override
 */
DvtNBoxNodeOverflow.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


/**
 * @override
 */
DvtNBoxNodeOverflow.prototype.getNextNavigable = function(event) 
{
  var next = null;
  if (this._nbox.EventManager.getKeyboardHandler().isNavigationEvent(event)) {
    if (event.keyCode == DvtKeyboardEvent.CLOSE_BRACKET) {
      next = this.getParentCell();
    }
    else {
      next = DvtNBoxDataUtils.getNextNavigableNode(this._nbox, this, event);
    }
  }
  return next;
};


/**
 * Returns the node overflow displayable (itself).
 *
 * @return {DvtDisplayable} displayable
 */
DvtNBoxNodeOverflow.prototype.getDisplayable = function() {
  return this;
};


/**
 * Returns the displayable that should receive the keyboard focus
 *
 * @return {DvtDisplayable} displayable to receive keyboard focus
 */
DvtNBoxNodeOverflow.prototype.getKeyboardFocusDisplayable = function() {
  // return first hidden node when maximizing the cell
  var oldPrevNode = this['__prev'];
  var newPrevNode = DvtNBoxDataUtils.getNode(this._nbox, DvtNBoxDataUtils.getNodeIndex(this._nbox, oldPrevNode[DvtNBoxConstants.ID]));
  var newNode = newPrevNode['__next'];
  return DvtNBoxDataUtils.getDisplayable(this._nbox, newNode);
};
var DvtNBoxCategoryNode = function() {};

DvtObj.createSubclass(DvtNBoxCategoryNode, DvtContainer, 'DvtNBoxCategoryNode');


/**
 * Returns a new instance of DvtNBoxCategoryNode
 *
 * @param {DvtNBox} nbox the parent nbox
 * @param {object} data the data for this category node
 *
 * @return {DvtNBoxCategoryNode} the nbox category node
 */
DvtNBoxCategoryNode.newInstance = function(nbox, data) {
  var component = new DvtNBoxCategoryNode();
  component.Init(nbox, data);
  return component;
};


/**
 * Initializes this component
 *
 * @param {DvtNBox} nbox the parent nbox
 * @param {object} data the data for this category node
 *
 * @protected
 */
DvtNBoxCategoryNode.prototype.Init = function(nbox, data) {
  DvtNBoxCategoryNode.superclass.Init.call(this, nbox.getCtx(), null,
                                           isNaN(data[DvtNBoxConstants.CELL]) ? data[DvtNBoxConstants.ID] : data[DvtNBoxConstants.CELL] + ':' + data[DvtNBoxConstants.ID]);// TODO for : Passing non container params weird
  this._nbox = nbox;
  this._data = data;
  this._nbox.registerObject(this);
  var selectionMode = this._nbox.getOptions()[DvtNBoxConstants.SELECTION_MODE];
  if (selectionMode == 'multiple') {
    this.setCursor(DvtSelectionEffectUtils.getSelectingCursor());
  }
  this._maxAlpha = 1;
};


/**
 * Returns the data object for this category node
 *
 * @return {object} the data object for this category node
 */
DvtNBoxCategoryNode.prototype.getData = function() {
  return this._data;
};


/**
 * Renders the nbox node
 * @param {DvtContainer} container the container to render into
 * @param {number} scale The number of pixels per unit (used to determine the size of this category node based on its node count)
 * @param {number} gap The number of pixels to shrink this node (to leave padding in the force layout)
 */
DvtNBoxCategoryNode.prototype.render = function(container, scale, gap) {
  DvtNBoxCategoryNodeRenderer.render(this._nbox, this._data, this, scale, gap);
  container.addChild(this);
  DvtNBoxDataUtils.setDisplayable(this._nbox, this._data, this);
  this._nbox.EventManager.associate(this, this);
};


/**
 * Returns true if this object is selectable.
 * @return {boolean} true if this object is selectable.
 */
DvtNBoxCategoryNode.prototype.isSelectable = function() {
  var selectionMode = this._nbox.getOptions()[DvtNBoxConstants.SELECTION_MODE];
  return selectionMode == 'multiple';
};


/**
 * Returns true if this object is selected.
 * @return {boolean} true if this object is selected.
 */
DvtNBoxCategoryNode.prototype.isSelected = function() {
  return this.getSelectionShape().isSelected();
};


/**
 * Specifies whether this object is selected.
 * @param {boolean} selected true if this object is selected.
 * @protected
 */
DvtNBoxCategoryNode.prototype.setSelected = function(selected) {
  this.getSelectionShape().setSelected(selected);
  this.UpdateAccessibilityAttributes();
};


/**
 * Displays the hover effect.
 */
DvtNBoxCategoryNode.prototype.showHoverEffect = function() {
  this.getSelectionShape().showHoverEffect();
};


/**
 * Hides the hover effect.
 */
DvtNBoxCategoryNode.prototype.hideHoverEffect = function() {
  this.getSelectionShape().hideHoverEffect();
};


/**
 * Sets the shape that should be used for displaying selection and hover feedback
 *
 * @param {DvtShape} selectionShape the shape that should be used for displaying selection and hover feedback
 */
DvtNBoxCategoryNode.prototype.setSelectionShape = function(selectionShape) {
  this._selectionShape = selectionShape;
};


/**
 * Gets the shape that should be used for displaying selection and hover feedback
 *
 * @return {DvtShape} the shape that should be used for displaying selection and hover feedback
 */
DvtNBoxCategoryNode.prototype.getSelectionShape = function() {
  return this._selectionShape;
};


/**
 * Returns the label for this node
 *
 * @return {string} the label for this category node
 */
DvtNBoxCategoryNode.prototype.getLabel = function() {
  var labels = DvtNBoxDataUtils.getCategoryNodeLabels(this._nbox, this._data);
  while (labels.length > 1) {
    var params = [labels[0], labels[1]];
    var joined = DvtBundle.getTranslatedString(DvtBundle.NBOX_PREFIX, 'COMMA_SEP_LIST', params);
    labels.splice(0, 2, joined);
  }
  return labels[0];
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.getDatatip = function(target, x, y) {
  // Custom Tooltip Support
  // Custom Tooltip via Function
  var tooltipFunc = this._nbox.getOptions()['tooltip'];
  if (tooltipFunc) {
    var dataContext = {
      'id': this._data['id'],
      'color': DvtNBoxStyleUtils.getCategoryNodeColor(this._nbox, this._data),
      'indicatorColor': DvtNBoxStyleUtils.getCategoryNodeIndicatorColor(this._nbox, this._data),
      'size': this._data['nodeIndices'].length
    };
    if (DvtNBoxDataUtils.getGroupBehavior(this._nbox) == 'withinCell') {
      dataContext['row'] = DvtNBoxDataUtils.getCell(this._nbox, this._data['cell'])['row'];
      dataContext['column'] = DvtNBoxDataUtils.getCell(this._nbox, this._data['cell'])['column'];
    }
    return this._nbox.getCtx().getTooltipManager().getCustomTooltip(tooltipFunc, dataContext);
  }
  return this.getShortDesc() + '\n' + DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'COLON_SEP_LIST', [DvtBundle.getTranslatedString(DvtBundle.NBOX_PREFIX, 'SIZE'), this._data['nodeIndices'].length]);
};

/**
 * Gets the shortDesc value for the category node.
 * @return {string} the shortDesc
 */
DvtNBoxCategoryNode.prototype.getShortDesc = function() {
  return DvtNBoxDataUtils.getCategoryNodeLabels(this._nbox, this._data).join('\n');
};

/**
 * Returns the border color of the datatip for this object.
 * @return {string} The datatip border color.
 */
DvtNBoxCategoryNode.prototype.getDatatipColor = function() {
  return DvtNBoxStyleUtils.getCategoryNodeColor(this._nbox, this._data);
};


/**
 * Sets the maximium alpha value for this node.  Immediately impacts the current alpha value
 * @param {number} maxAlpha the maximum alpha value for this node
 */
DvtNBoxCategoryNode.prototype.setMaxAlpha = function(maxAlpha) {
  this._maxAlpha = maxAlpha;
  this.setAlpha(this.getAlpha());
};


/**
 * Gets the maximium alpha value for this node.
 * @return {number} the maximum alpha value for this node
 */
DvtNBoxCategoryNode.prototype.getMaxAlpha = function() {
  return this._maxAlpha;
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.setAlpha = function(alpha) {
  DvtNBoxCategoryNode.superclass.setAlpha.call(this, Math.min(alpha, this._maxAlpha));
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.isDoubleClickable = function() {
  return true;
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.handleDoubleClick = function() {
  var options = this._nbox.getSanitizedOptions();
  options[DvtNBoxConstants.DRAWER] = {'id': this.getId()};
  var event = new DvtSetPropertyEvent();
  event.addParam(DvtNBoxConstants.DRAWER, this.getId());
  this._nbox.processEvent(event);
  this._nbox.render(options);
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.animateUpdate = function(animationHandler, oldNode) {
  DvtNBoxCategoryNodeRenderer.animateUpdate(animationHandler, oldNode, this);
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.animateDelete = function(animationHandler, deleteContainer) {
  DvtNBoxCategoryNodeRenderer.animateDelete(animationHandler, this);

};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.animateInsert = function(animationHandler) {
  DvtNBoxCategoryNodeRenderer.animateInsert(animationHandler, this);
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.isDragAvailable = function(clientIds) {
  return this._nbox.__isDragAvailable(clientIds);
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.getDragTransferable = function(mouseX, mouseY) {
  return this._nbox.__getDragTransferable(this);
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.getDragFeedback = function(mouseX, mouseY) {
  return this._nbox.__getDragFeedback();
};


/**
 * Process a keyboard event
 * @param {DvtKeyboardEvent} event
 */
DvtNBoxCategoryNode.prototype.HandleKeyboardEvent = function(event) {
  if (event.keyCode == DvtKeyboardEvent.ENTER) {
    this.handleDoubleClick();
  }
  else if (event.keyCode == DvtKeyboardEvent.ESCAPE &&
      DvtNBoxDataUtils.getGroupBehavior(this._nbox) == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
    var cellData = DvtNBoxDataUtils.getCell(this._nbox, this._data.cell);
    var cell = DvtNBoxDataUtils.getDisplayable(this._nbox, cellData);
    cell.HandleKeyboardEvent(event);
  }
};


/**
 * @protected
 * Updates accessibility attributes on selection event
 */
DvtNBoxCategoryNode.prototype.UpdateAccessibilityAttributes = function() {
  if (!DvtAgent.deferAriaCreation()) {
    var desc = this.getAriaLabel();
    if (desc)
      this.setAriaProperty(DvtNBoxConstants.LABEL, desc);
  }
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.getAriaLabel = function() {
  return DvtNBoxDataUtils.buildAriaDesc(this._nbox, this, this.getShortDesc(), this.isSelected());
};

/**
 * Gets the highlight/filter categories for this category node.
 * @return {array} categories
 */
DvtNBoxCategoryNode.prototype.getCategories = function() {
  var categories = this.getData()[DvtNBoxConstants.CATEGORIES];
  if (!categories) {
    var intersect = function(a, b) {
      return a.filter(function(n) {
        return b.indexOf(n) > -1;
      });
    };
    var indices = this.getData()['nodeIndices'];
    categories = null;
    for (var i = 0; i < indices.length; i++) {
      var nodeCategories = DvtNBoxDataUtils.getNode(this._nbox, indices[i])[DvtNBoxConstants.CATEGORIES];
      if (!nodeCategories) {
        categories = [];
        break;
      }
      categories = categories == null ? nodeCategories : intersect(categories, nodeCategories);
    }
    this.getData()[DvtNBoxConstants.CATEGORIES] = categories;
  }
  return categories;
};

/**
 * Static comparator function for sorting category nodes by size (descending).
 * @param {object} a data for first category node
 * @param {object} b data for second category node
 *
 * @return {number}
 */
DvtNBoxCategoryNode.compareSize = function(a, b) {
  var alength = a['nodeIndices'].length;
  var blength = b['nodeIndices'].length;
  return alength == blength ? 0 : alength < blength ? 1 : -1;
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtNBoxCategoryNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  return DvtNBoxKeyboardHandler.getKeyboardBoundingBox(this, targetCoordinateSpace);
};

/**
 * @override
 */
DvtNBoxCategoryNode.prototype.getTargetElem = function() 
{
  return this.getElem();
};

/**
 * @override
 */
DvtNBoxCategoryNode.prototype.showKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = true;
  this.showHoverEffect();

};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.hideKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = false;
  this.hideHoverEffect();
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


/**
 * @override
 */
DvtNBoxCategoryNode.prototype.getNextNavigable = function(event) 
{
  var next = null;
  if (event.keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey)
  {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    return this;
  }
  else if (event.keyCode == DvtKeyboardEvent.CLOSE_BRACKET &&
          DvtNBoxDataUtils.getGroupBehavior(this._nbox) == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
    //get parent cell if the node is in the cell
    var cellData = DvtNBoxDataUtils.getCell(this._nbox, this.getData()[DvtNBoxConstants.CELL]);
    next = DvtNBoxDataUtils.getDisplayable(this._nbox, cellData);
  }
  else if (event.keyCode == DvtKeyboardEvent.CLOSE_BRACKET || event.keyCode == DvtKeyboardEvent.OPEN_BRACKET) {
    next = this; //do nothing
  }
  else if (this._nbox.EventManager.getKeyboardHandler().isNavigationEvent(event)) {
    //get sibling category node
    if (DvtNBoxDataUtils.getGroupBehavior(this._nbox) == DvtNBoxConstants.GROUP_BEHAVIOR_ACROSS_CELLS) {
      var groups = this._nbox.getOptions()['__groups'];
      var groupNodes = [];
      for (var id in groups) {
        var displayable = DvtNBoxDataUtils.getDisplayable(this._nbox, groups[id]);
        if (displayable)
          groupNodes.push(displayable);
      }
      next = DvtNBoxKeyboardHandler.getNextNavigableCategoryNode(this, event, groupNodes);
    }
    else {
      var container = this.getParent();
      var nodes = [];
      for (var i = 0; i < container.getNumChildren(); i++) {
        if (container.getChildAt(i) instanceof DvtNBoxCategoryNode)
          nodes.push(container.getChildAt(i));
      }
      next = DvtNBoxKeyboardHandler.getNextNavigableCategoryNode(this, event, nodes);
    }
  }
  else if (event.type == DvtMouseEvent.CLICK) {
    next = this;
  }
  return next;
};


/**
 * Returns the category node displayable (itself).
 *
 * @return {DvtDisplayable} displayable
 */
DvtNBoxCategoryNode.prototype.getDisplayable = function() {
  return this;
};


/**
 * Returns the displayable that should receive the keyboard focus
 *
 * @return {DvtDisplayable} displayable to receive keyboard focus
 */
DvtNBoxCategoryNode.prototype.getKeyboardFocusDisplayable = function() {
  // return the drawer when expanding a group node
  var drawerData = DvtNBoxDataUtils.getDrawer(this._nbox);
  if (drawerData)
    return DvtNBoxDataUtils.getDisplayable(this._nbox, drawerData);

  if (DvtNBoxDataUtils.getGrouping(this._nbox)) {
    var groupNodeData = DvtNBoxDataUtils.getCategoryNode(this._nbox, this.getId());
    if (groupNodeData)
      return DvtNBoxDataUtils.getDisplayable(this._nbox, groupNodeData);
  }
  return null;
};
/**
 * Category rollover handler for NBox
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The object instance that the callback function is defined on.
 * @class DvtNBoxCategoryRolloverHandler
 * @extends {DvtCategoryRolloverHandler}
 * @constructor
 */
var DvtNBoxCategoryRolloverHandler = function(callback, callbackObj) {
  DvtNBoxCategoryRolloverHandler.superclass.constructor.call(this, callback, callbackObj);
  this._nbox = callbackObj;
};

DvtObj.createSubclass(DvtNBoxCategoryRolloverHandler, DvtCategoryRolloverHandler, 'DvtNBoxCategoryRolloverHandler');

/**
 * @override
 */
DvtNBoxCategoryRolloverHandler.prototype.GetRolloverCallback = function(event, objs, bAnyMatched, customAlpha) {
  var callback = function() {
    this.SetHighlightMode(true);
    this._nbox.processEvent(event);

    // Fire the event to the component's callback if specified.
    if (this._callback)
      this._callback.call(this._callbackObj, event, this._source);
  };
  return DvtObj.createCallback(this, callback);
};

/**
 * @override
 */
DvtNBoxCategoryRolloverHandler.prototype.GetRolloutCallback = function(event, objs, bAnyMatched, customAlpha) {
  var callback = function() {
    this.SetHighlightModeTimeout();
    this._nbox.processEvent(event);

    // Fire the event to the component's callback if specified.
    if (this._callback)
      this._callback.call(this._callbackObj, event, this._source);
  };
  return DvtObj.createCallback(this, callback);
};
var DvtNBoxDrawer = function() {};

DvtObj.createSubclass(DvtNBoxDrawer, DvtContainer, 'DvtNBoxDrawer');


/**
 * Returns a new instance of DvtNBoxDrawer
 *
 * @param {string} nbox the parent nbox
 * @param {object} data the data associated with the currently open group
 *
 * @return {DvtNBoxDrawer} the nbox category node
 */
DvtNBoxDrawer.newInstance = function(nbox, data) {
  var component = new DvtNBoxDrawer();
  component.Init(nbox, data);
  return component;
};


/**
 * Initializes this component
 *
 * @param {DvtNBox} nbox the parent nbox
 * @param {object} data the data associated with the currently open group
 *
 * @protected
 */
DvtNBoxDrawer.prototype.Init = function(nbox, data) {
  DvtNBoxDrawer.superclass.Init.call(this, nbox.getCtx(), null, data['id'] + '_d');
  this._nbox = nbox;
  this._data = data;
  this._nbox.registerObject(this);
};


/**
 * Gets the data object
 *
 * @return {object} the data object
 */
DvtNBoxDrawer.prototype.getData = function() {
  return this._data;
};


/**
 * Renders the drawer
 * @param {DvtContainer} container the container to render into
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxDrawer.prototype.render = function(container, availSpace) {
  container.addChild(this);
  DvtNBoxDataUtils.setDisplayable(this._nbox, this._data, this);
  DvtNBoxDrawerRenderer.render(this._nbox, this._data, this, availSpace);
  this._nbox.EventManager.associate(this, this);
};


/**
 * Gets the container that child nodes should be added to
 *
 * @return {DvtContainer} the container that child nodes should be added to
 */
DvtNBoxDrawer.prototype.getChildContainer = function() {
  return this._childContainer;
};


/**
 * Sets the container that child nodes should be added to
 *
 * @param {DvtContainer} container the container that child nodes should be added to
 */
DvtNBoxDrawer.prototype.setChildContainer = function(container) {
  this._childContainer = container;
};


/**
 * @override
 */
DvtNBoxDrawer.prototype.isDoubleClickable = function() {
  return true;
};


/**
 * @override
 */
DvtNBoxDrawer.prototype.handleDoubleClick = function() {
  this.closeDrawer();
};


/**
 * Closes this drawer
 */
DvtNBoxDrawer.prototype.closeDrawer = function() {
  var options = this._nbox.getSanitizedOptions();
  options[DvtNBoxConstants.DRAWER] = null;
  var event = new DvtSetPropertyEvent();
  event.addParam(DvtNBoxConstants.DRAWER, null);
  this._nbox.processEvent(event);
  this._nbox.render(options);
};


/**
 * @override
 */
DvtNBoxDrawer.prototype.animateUpdate = function(animationHandler, oldDrawer) {
  DvtNBoxDrawerRenderer.animateUpdate(animationHandler, oldDrawer, this);
};


/**
 * @override
 */
DvtNBoxDrawer.prototype.animateDelete = function(animationHandler, deleteContainer) {
  DvtNBoxDrawerRenderer.animateDelete(animationHandler, this);

};


/**
 * @override
 */
DvtNBoxDrawer.prototype.animateInsert = function(animationHandler) {
  DvtNBoxDrawerRenderer.animateInsert(animationHandler, this);
};


/**
 * Process a keyboard event
 * @param {DvtKeyboardEvent} event
 */
DvtNBoxDrawer.prototype.HandleKeyboardEvent = function(event) {
  if (event.keyCode == DvtKeyboardEvent.ESCAPE) {
    this.closeDrawer();
  }
};


/**
 * @protected
 * Updates accessibility attributes on selection event
 */
DvtNBoxDrawer.prototype.UpdateAccessibilityAttributes = function() {
  if (!DvtAgent.deferAriaCreation()) {
    var desc = this.getAriaLabel();
    if (desc) {
      var object = DvtAgent.isTouchDevice() ? DvtNBoxDataUtils.getDisplayable(this._nbox, this.getData(), 'background') : this;
      object.setAriaProperty('label', desc);
    }
  }
};


/**
 * @override
 */
DvtNBoxDrawer.prototype.getAriaLabel = function() {
  var categoryNode = DvtNBoxDataUtils.getDisplayable(this._nbox, DvtNBoxDataUtils.getCategoryNode(this._nbox, this.getData()['id']));
  var selected = DvtNBoxDataUtils.isDrawerSelected(this._nbox, categoryNode);
  return DvtNBoxDataUtils.buildAriaDesc(this._nbox, this, categoryNode.getShortDesc(), selected);
};


//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtNBoxDrawer.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  return DvtNBoxKeyboardHandler.getKeyboardBoundingBox(this, targetCoordinateSpace);
};

/**
 * @override
 */
DvtNBoxDrawer.prototype.getTargetElem = function() 
{
  return this.getElem();
};

/**
 * @override
 */
DvtNBoxDrawer.prototype.showKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = true;
  DvtNBoxDataUtils.getDisplayable(this._nbox, this.getData(), 'focusEffect').show();
};


/**
 * @override
 */
DvtNBoxDrawer.prototype.hideKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = false;
  DvtNBoxDataUtils.getDisplayable(this._nbox, this.getData(), 'focusEffect').hide();
};


/**
 * @override
 */
DvtNBoxDrawer.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};


/**
 * @override
 */
DvtNBoxDrawer.prototype.getNextNavigable = function(event) 
{
  var next = null;
  if (this._nbox.EventManager.getKeyboardHandler().isNavigationEvent(event)) {
    if (event.keyCode == DvtKeyboardEvent.OPEN_BRACKET) {
      //find first individual node
      var container = this.getChildContainer();
      if (container.getScrollingPane)
        container = container.getScrollingPane();
      var next = DvtNBoxDataUtils.getFirstNavigableNode(this._nbox, container);
    }
    else if (event.keyCode == DvtKeyboardEvent.CLOSE_BRACKET) {
      //find parent cell
      var maximizedCellIndex = DvtNBoxDataUtils.getMaximizedCellIndex(this._nbox);
      next = DvtNBoxDataUtils.getDisplayable(this._nbox, DvtNBoxDataUtils.getCell(this._nbox, maximizedCellIndex));
    }
  }
  return next;
};


/**
 * Returns the drawer displayable (itself).
 *
 * @return {DvtDisplayable} displayable
 */
DvtNBoxDrawer.prototype.getDisplayable = function() {
  return this;
};


/**
 * Returns the displayable that should receive the keyboard focus
 *
 * @return {DvtDisplayable} displayable to receive keyboard focus
 */
DvtNBoxDrawer.prototype.getKeyboardFocusDisplayable = function() {
  if (this._nbox.getOptions()['_drawer'])
    return this;

  // return the associated group node associated when closing the drawer
  var groupNodeData = DvtNBoxDataUtils.getCategoryNode(this._nbox, this.getData()[DvtNBoxConstants.ID]);
  if (groupNodeData)
    return DvtNBoxDataUtils.getDisplayable(this._nbox, groupNodeData);
  return null;
};
/**
 * Animation handler for NBox
 * @param {DvtContext} context the platform specific context object
 * @param {DvtContainer} deleteContainer the container where deletes should be moved for animation
 * @param {object} an object representing the old nbox state
 * @param {DvtNBox} the nbox component
 * @class DvtNBoxDataAnimationHandler
 * @constructor
 */
var DvtNBoxDataAnimationHandler = function(context, deleteContainer, oldNBox, newNBox) {
  this.Init(context, deleteContainer, oldNBox, newNBox);
};

DvtObj.createSubclass(DvtNBoxDataAnimationHandler, DvtDataAnimationHandler, 'DvtNBoxDataAnimationHandler');

DvtNBoxDataAnimationHandler.DELETE = 0;
DvtNBoxDataAnimationHandler.UPDATE = 1;
DvtNBoxDataAnimationHandler.INSERT = 2;


/**
 * Initialization method called by the constructor
 *
 * @param {DvtContext} context the platform specific context object
 * @param {DvtContainer} deleteContainer the container where deletes should be moved for animation
 * @param {object} an object representing the old nbox state
 * @param {DvtNBox} the nbox component
 */
DvtNBoxDataAnimationHandler.prototype.Init = function(context, deleteContainer, oldNBox, newNBox) {
  DvtNBoxDataAnimationHandler.superclass.Init.call(this, context, deleteContainer);
  this._oldNBox = oldNBox;
  this._newNBox = newNBox;
};


/**
 * Returns the old NBox state
 *
 * @return {object} an object representing the old nbox state
 */
DvtNBoxDataAnimationHandler.prototype.getOldNBox = function() {
  return this._oldNBox;
};


/**
 * Returns the new NBox state
 *
 * @return {DvtNBox} the nbox component
 */
DvtNBoxDataAnimationHandler.prototype.getNewNBox = function() {
  return this._newNBox;
};


/**
 * Gets the animation duration
 *
 * @return {number} the animation duration
 */
DvtNBoxDataAnimationHandler.prototype.getAnimationDuration = function() {
  return DvtNBoxStyleUtils.getAnimationDuration(this._oldNBox);
};
/**
 * Drop Target event handler for DvtNBox
 * @param {DvtNBox} view
 * @class DvtNBoxDropTarget
 * @extends {DvtDropTarget}
 * @constructor
 */
var DvtNBoxDropTarget = function(view) {
  this._view = view;
};

DvtObj.createSubclass(DvtNBoxDropTarget, DvtDropTarget, 'DvtNBoxDropTarget');


/**
 * @override
 */
DvtNBoxDropTarget.prototype.acceptDrag = function(mouseX, mouseY, clientIds) {
  // If there is no cell under the point, then don't accept the drag
  var cell = this._view.__getCellUnderPoint(mouseX, mouseY);
  if (!cell) {
    this._view.__showDropSiteFeedback(null);
    return null;
  }
  else if (cell != this._dropSite) {
    this._view.__showDropSiteFeedback(cell);
    this._dropSite = cell;
  }

  // Return the first clientId, since this component has only a single drag source
  return clientIds[0];
};


/**
 * @override
 */
DvtNBoxDropTarget.prototype.dragExit = function() {
  // Remove drop site feedback
  this._view.__showDropSiteFeedback(null);
  this._dropSite = null;
};


/**
 * @override
 */
DvtNBoxDropTarget.prototype.getDropSite = function(mouseX, mouseY) {
  var cell = this._view.__getCellUnderPoint(mouseX, mouseY);
  if (cell) {
    var data = cell.getData();
    return {row: data[DvtNBoxConstants.ROW], column: data[DvtNBoxConstants.COLUMN]};
  }
  else
    return null;
};
// Copyright (c) 2014, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * Event Manager for DvtNBox.
 * @param {DvtNBox} nbox NBox component
 * @class
 * @extends {DvtEventManager}
 * @constructor
 */
var DvtNBoxEventManager = function(nbox) {
  this.Init(nbox.getCtx(), nbox.processEvent, nbox);
  this._nbox = nbox;
};

DvtObj.createSubclass(DvtNBoxEventManager, DvtEventManager, 'DvtNBoxEventManager');

/**
 * @override
 */
DvtNBoxEventManager.prototype.OnClickInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  this._processActionEvent(obj);
};

/**
 * @override
 */
DvtNBoxEventManager.prototype.OnDblClickInternal = function(event) {
  this._handleDblClick(this.GetCurrentTargetForEvent(event));
};


/**
 * @override
 */
DvtNBoxEventManager.prototype.HandleTouchDblClickInternal = function(event) {
  this._handleDblClick(this.GetCurrentTargetForEvent(event));
};

/**
 * @override
 */
DvtNBoxEventManager.prototype.HandleTouchHoverEndInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  this._processActionEvent(obj);
};

/**
 * @override
 */
DvtNBoxEventManager.prototype.HandleTouchClickInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  this._processActionEvent(obj);
};

/**
 * Handler for mouse or touch double click actions
 *
 * @param {DvtDisplayable} displayable the event target
 * @private
 */
DvtNBoxEventManager.prototype._handleDblClick = function(displayable) {
  var logicalObject = this.GetLogicalObject(displayable);
  if (logicalObject && logicalObject.isDoubleClickable && logicalObject.isDoubleClickable() && logicalObject.handleDoubleClick) {
    logicalObject.handleDoubleClick();
  }
};


/**
 * @override
 */
DvtNBoxEventManager.prototype.ProcessKeyboardEvent = function(event)
{
  var eventConsumed = false;
  var keyCode = event.keyCode;
  var navigable = this.getFocus(); // the item with current keyboard focus

  if (keyCode == DvtKeyboardEvent.ENTER || keyCode == DvtKeyboardEvent.ESCAPE) { //drill up and down
    if (navigable && navigable.HandleKeyboardEvent)
      navigable.HandleKeyboardEvent(event);
    navigable = null;
  }
  else if (event.keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey) { //multi-select event
    if (navigable instanceof DvtNBoxCategoryNode || navigable instanceof DvtNBoxNode)
      eventConsumed = DvtNBoxEventManager.superclass.ProcessKeyboardEvent.call(this, event);
  }
  else
    eventConsumed = DvtNBoxEventManager.superclass.ProcessKeyboardEvent.call(this, event);

  return eventConsumed;
};

/**
 * Processes a rollover action on the specified logical object.
 * @param {DvtBaseEvent} event The event that caused the rollover.
 * @param {DvtLogicalObject} obj The logical object that was the target of the event.
 * @param {boolean} bOver True if this is a rollover, false if this is a rollout.
 * @protected
 */
DvtNBoxEventManager.prototype.ProcessRolloverEvent = function(event, obj, bOver) {
  // Don't continue if not enabled
  var options = this._nbox.getOptions();
  if (options['hoverBehavior'] != 'dim')
    return;

  // Compute the new highlighted categories and update the options
  var categories = obj.getCategories ? obj.getCategories() : [];
  options['highlightedCategories'] = bOver ? categories.slice() : null;

  // Fire the event to the rollover handler, who will fire to the component callback.
  var type = bOver ? DvtCategoryRolloverEvent.TYPE_OVER : DvtCategoryRolloverEvent.TYPE_OUT;
  var rolloverEvent = new DvtCategoryRolloverEvent(type, options['highlightedCategories']);
  var hoverBehaviorDelay = DvtStyleUtils.getTimeMilliseconds(options['styleDefaults']['hoverBehaviorDelay']);
  this.RolloverHandler.processEvent(rolloverEvent, this._nbox.getNodeDisplayables(), hoverBehaviorDelay, options['highlightMatch'] == 'any');
};

/**
 * @override
 */
DvtNBoxEventManager.prototype.CreateCategoryRolloverHandler = function(callback, callbackObj) {
  return new DvtNBoxCategoryRolloverHandler(callback, callbackObj);
};

/**
 * Processes an action on the specified data item.
 * @param {DvtDisplayable} obj The logical object of the data item.
 * @private
 */
DvtNBoxEventManager.prototype._processActionEvent = function(obj) {
  if (obj && obj.getAction && obj.getAction())
    this.FireEvent(new DvtActionEvent(DvtActionEvent.SUBTYPE_ACTION, obj.getAction(), obj.getId()));
};

/**
 * @override
 */
DvtNBoxEventManager.prototype.GetTouchResponse = function() {
  var options = this._nbox.getOptions();
  var drawerData = DvtNBoxDataUtils.getDrawer(this._nbox);
  var cellData = DvtNBoxDataUtils.getCell(this._nbox, DvtNBoxDataUtils.getMaximizedCellIndex(this._nbox));
  if ((drawerData && DvtNBoxDataUtils.getDisplayable(this._nbox, drawerData).getChildContainer().hasScrollingContent()) ||
      (cellData && DvtNBoxDataUtils.getDisplayable(this._nbox, cellData).getChildContainer().hasScrollingContent()))
    return DvtEventManager.TOUCH_RESPONSE_TOUCH_HOLD;
  else if (options['touchResponse'] === DvtEventManager.TOUCH_RESPONSE_TOUCH_START)
    return DvtEventManager.TOUCH_RESPONSE_TOUCH_START;
  return DvtEventManager.TOUCH_RESPONSE_AUTO;
};
/**
 * Keyboard handler for the NBox component
 * @param {DvtEventManager} manager The owning DvtEventManager
 * @param {DvtNBox} nbox The owning NBox component
 * @class DvtNBoxKeyboardHandler
 * @constructor
 * @extends {DvtKeyboardHandler}
 */
var DvtNBoxKeyboardHandler = function(manager, nbox)
{
  this.Init(manager, nbox);
};

DvtObj.createSubclass(DvtNBoxKeyboardHandler, DvtKeyboardHandler, 'DvtNBoxKeyboardHandler');


/**
 * @override
 */
DvtNBoxKeyboardHandler.prototype.Init = function(manager, nbox) {
  DvtNBoxKeyboardHandler.superclass.Init.call(this, manager);
  this._nbox = nbox;
};


/**
 * @override
 */
DvtNBoxKeyboardHandler.prototype.processKeyDown = function(event) {
  var keyCode = event.keyCode;

  if (keyCode == DvtKeyboardEvent.TAB) {
    var currentNavigable = this._eventManager.getFocus();
    var next = null;
    DvtEventManager.consumeEvent(event);
    if (!currentNavigable) {
      var drawerData = DvtNBoxDataUtils.getDrawer(this._nbox);
      if (drawerData) { //drawer
        next = DvtNBoxDataUtils.getDisplayable(this._nbox, drawerData);
      }
      else if (DvtNBoxDataUtils.getGroupBehavior(this._nbox) == DvtNBoxConstants.GROUP_BEHAVIOR_ACROSS_CELLS) {
        //find first group node
        var groups = this._nbox.getOptions()['__groups'];
        if (groups) {
          var groupNodes = [];
          for (var id in groups) {
            var displayable = DvtNBoxDataUtils.getDisplayable(this._nbox, groups[id]);
            if (displayable)
              groupNodes.push(displayable);
          }
          next = DvtNBoxKeyboardHandler.getNextNavigableCategoryNode(null, event, groupNodes);
        }
      }
      if (!next) {
        var index = DvtNBoxDataUtils.getColumnCount(this._nbox) * (DvtNBoxDataUtils.getRowCount(this._nbox) - 1);
        next = DvtNBoxDataUtils.getDisplayable(this._nbox, DvtNBoxDataUtils.getCell(this._nbox, index));
      }
    }
    else {
      next = currentNavigable;
    }
    return next;
  }
  return DvtNBoxKeyboardHandler.superclass.processKeyDown.call(this, event);
};


/**
 * @override
 */
DvtNBoxKeyboardHandler.prototype.isSelectionEvent = function(event)
{
  if (event.keyCode == DvtKeyboardEvent.TAB)
    return false;
  else
    return this.isNavigationEvent(event) && !event.ctrlKey;
};


/**
 * @override
 */
DvtNBoxKeyboardHandler.prototype.isMultiSelectEvent = function(event)
{
  return event.keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey;
};


/**
 * Helper methods that gets keyboardBoundingBox for an nbox displayable object
 * @param {DvtNBoxCategoryNode|DvtNBoxCell|DvtNBoxDrawer|DvtNBoxNode} obj A displayable object that needs keyboard bounding box
 * @param {DvtDisplayable=} targetCoordinateSpace The displayable defining the target coordinate space
 * @return {DvtRectangle} the bounding box for this object relative to the target coordinate space
 */
DvtNBoxKeyboardHandler.getKeyboardBoundingBox = function(obj, targetCoordinateSpace) {
  var bounds = obj.getDimensions();
  var stageP1 = obj.localToStage(new DvtPoint(bounds.x, bounds.y));
  var stageP2 = obj.localToStage(new DvtPoint(bounds.x + bounds.w, bounds.y + bounds.h));
  return new DvtRectangle(stageP1.x, stageP1.y, stageP2.x - stageP1.x, stageP2.y - stageP1.y);
};


/**
 * @override
 */
DvtNBoxKeyboardHandler.prototype.isNavigationEvent = function(event)
{
  var retVal = false;
  switch (event.keyCode) {
    case DvtKeyboardEvent.OPEN_BRACKET:
    case DvtKeyboardEvent.CLOSE_BRACKET:
      retVal = true; break;
    default:
      retVal = DvtNBoxKeyboardHandler.superclass.isNavigationEvent.call(this, event);
  }
  return retVal;
};


/**
 * Finds next navigable category node based on node size and direction  among sorted category nodes
 * @param {DvtKeyboardNavigable} curr current navigable item with keyboard focus (optional).
 * @param {DvtKeyboardEvent} event
 * @param {Array} navigableItems An array of items that could receive focus next
 * @return {DvtNBoxCategoryNode} The object that can get keyboard focus as a result of the keyboard event.
 */
DvtNBoxKeyboardHandler.getNextNavigableCategoryNode = function(curr, event, navigableItems) {
  if (!navigableItems || navigableItems.length <= 0)
    return null;

  if (navigableItems[0] instanceof DvtNBoxCategoryNode) {
    navigableItems.sort(function(a, b) {return DvtNBoxCategoryNode.compareSize(a.getData(), b.getData())});
  }

  // get default node
  if (curr == null) {
    return navigableItems[0];
  }

  var next = curr;
  var bNext = (event.keyCode == DvtKeyboardEvent.RIGHT_ARROW || event.keyCode == DvtKeyboardEvent.DOWN_ARROW) ? true : false;
  var itemCount = navigableItems.length;
  for (var i = 0; i < itemCount; i++) {
    var testObj = navigableItems[i];
    if (testObj === curr) {
      var nextIndex = bNext ?
          i + 1 < itemCount ? i + 1 : i
                        : i - 1 >= 0 ? i - 1 : i;
      next = navigableItems[nextIndex];
      break;
    }
  }
  return next;
};


/**
 *  Provides automation services for a DVT nBox component.
 *  @class  DvtNBoxAutomation
 *  @param {DvtNBox} dvtComponent
 *  @implements {DvtAutomation}
 *  @constructor
 *  @export
 */
var DvtNBoxAutomation = function(dvtComponent) {
  this.Init(dvtComponent);
};

DvtObj.createSubclass(DvtNBoxAutomation, DvtAutomation, 'DvtNBoxAutomation');

/**
 * Initializes this automation object
 * @param {DvtNBox} dvtComponent
 */
DvtNBoxAutomation.prototype.Init = function(dvtComponent) {
  this._nBox = dvtComponent;
};

/**
 * Valid subIds:
 * <ul>
 * <li>node[index]</li>
 * <li>cell[row,col]</li>
 * <li>cell[row,col]#overflow</li>
 * <li>cell[row,col]#node[index]</li>
 * <li>cell[row,col]#groupNode{id1:val1,...,idN:valN}</li>
 * <li>cell[row,col]#groupNode[groupCategory]</li>
 * <li>cell[row,col]#closeButton</li>
 * <li>groupNode{id1:val1,...,idN:valN}</li>
 * <li>groupNode[groupCategory]</li>
 * <li>dialog</li>
 * <li>dialog#closeButton</li>
 * <li>dialog#node[index]</li>
 * <li>tooltip</li>
 * </ul>
 *
 * @param {DvtDisplayable} displayable
 * @return {string} subId
 *
 * @override
 */
DvtNBoxAutomation.prototype.GetSubIdForDomElement = function(displayable) {
  var cell = this._getParentObject(displayable, 'DvtNBoxCell');
  var drawer = this._getParentObject(displayable, 'DvtNBoxDrawer');

  while (displayable && !(displayable instanceof DvtNBox)) {
    var nBox = this.getComponent();
    var component;
    var action;
    var values;

    if (displayable instanceof DvtNBoxNode) {
      var index = DvtNBoxDataUtils.getNodeIndex(nBox, displayable.getData()['id']);
      values = this._createBrackets([index]);
      component = 'node' + values;
      return this._createSubId(component, action);
    }

    if (cell) {
      var r = cell.getData()['row'];
      var c = cell.getData()['column'];
      var container = cell.getChildContainer();
      if (container.getScrollingPane) {
        container = container.getScrollingPane();
      }
      values = this._createBrackets([r, c]);
      component = 'cell' + values;

      // cell
      if (displayable instanceof DvtNBoxCell) {
        return this._createSubId(component, action);
      }

      // cell#overflow
      // cell#closeButton
      if (displayable instanceof DvtButton) {
        if (this._getParentObject(displayable, 'DvtNBoxNodeOverflow')) {
          action = 'overflow';
          return this._createSubId(component, action);
        }
        if (displayable == DvtNBoxDataUtils.getDisplayable(nBox, cell.getData(), 'closeButton')) {
          action = 'closeButton';
          return this._createSubId(component, action);
        }
      }

      // cell#node
      // nodes always return node[index] form subId

      //cell#groupNode
      if (displayable instanceof DvtNBoxCategoryNode) {
        var id = displayable.getData()['id'];
        action = 'groupNode';
        if (DvtNBoxDataUtils.getNode(nBox, displayable.getData()['nodeIndices'][0])['groupCategory'])
          action += this._createBrackets([id]);
        else
          action += this._createBraces(id.split(';'));
        return this._createSubId(component, action);
      }
    }
    if (drawer) {
      component = 'dialog';

      // dialog
      if (displayable instanceof DvtNBoxDrawer) {
        return this._createSubId(component, action);
      }

      // dialog#closeButton
      if (displayable instanceof DvtButton) {
        action = 'closeButton';
        return this._createSubId(component, action);
      }

      // dialog#node
      // nodes always return node[index] form subId

    }

    // groupNode
    if (displayable instanceof DvtNBoxCategoryNode) {
      var id = displayable.getData()['id'];
      component = 'groupNode';
      if (DvtNBoxDataUtils.getNode(nBox, displayable.getData()['nodeIndices'][0])['groupCategory'])
        component += this._createBrackets([id]);
      else
        component += this._createBraces(id.split(';'));
      return this._createSubId(component, action);
    }
    displayable = displayable.getParent();
  }
  return null;
};

/**
 * Creates a subId out of given component and action parts
 *
 * @param {string} component
 * @param {string} action
 * @return {string} subId
 *
 * @private
 */
DvtNBoxAutomation.prototype._createSubId = function(component, action) {
  var subId = component;
  if (action) {
    subId += '#' + action;
  }
  return subId;
};

/**
 * Valid subIds
 * <ul>
 * <li>node[index]</li>
 * <li>cell[row,col]</li>
 * <li>cell[row,col]#overflow</li>
 * <li>cell[row,col]#node[index]</li>
 * <li>cell[row,col]#groupNode{id1:val1,...,idN:valN}</li>
 * <li>cell[row,col]#groupNode[groupCategory]</li>
 * <li>cell[row,col]#closeButton</li>
 * <li>groupNode{id1:val1,...,idN:valN}</li>
 * <li>groupNode[groupCategory]</li>
 * <li>dialog</li>
 * <li>dialog#closeButton</li>
 * <li>dialog#node[index]</li>
 * <li>tooltip</li>
 * </ul>
 *
 * @param {string} subId
 * @return {DvtDisplayable}
 * @export
 * @override
 */
DvtNBoxAutomation.prototype.getDomElementForSubId = function(subId) {
  var nBox = this.getComponent();
  if (subId == DvtAutomation.TOOLTIP_SUBID)
    return this.GetTooltipElement(nBox);

  var parsedId = this._parseSubId(subId);
  var component = parsedId['component'];
  var action = parsedId['action'];
  var values = null;

  var container = null;
  var displayable = null;

  if (component.lastIndexOf('node', 0) === 0) {
    values = this._parseBrackets(component, true);
    var data = DvtNBoxDataUtils.getNode(nBox, values[0]);
    displayable = DvtNBoxDataUtils.getDisplayable(nBox, data);
  }

  if (component.lastIndexOf('cell', 0) === 0) {
    values = this._parseBrackets(component);
    var index = this._getCellIndexFromValues(values);
    var data = DvtNBoxDataUtils.getCell(nBox, index);
    if (!data) {
      return null;
    }
    var cell = DvtNBoxDataUtils.getDisplayable(nBox, data);

    if (action) {
      container = cell.getChildContainer();
      if (container.getScrollingPane) {
        container = container.getScrollingPane();
      }

      // cell#overflow
      if (action == 'overflow') {
        for (var i = container.getNumChildren(); i > 0; i--) {
          if (container.getChildAt(i - 1) instanceof DvtNBoxNodeOverflow) {
            displayable = container.getChildAt(i - 1).getButton();
            break;
          }
        }
      }

      // cell#closeButton
      if (action == 'closeButton') {
        displayable = DvtNBoxDataUtils.getDisplayable(nBox, cell.getData(), 'closeButton');
      }

      // cell#node
      if (action.lastIndexOf('node', 0) === 0) {
        values = this._parseBrackets(action, true);
        var nodeIndex = values[0];
        if (nodeIndex < 0) {
          return null;
        }
        var node = DvtNBoxDataUtils.getFirstNavigableNode(nBox, container);
        var count = 0;
        while (node && node.getTypeName() == 'DvtNBoxNode') {
          if (count == nodeIndex) {
            displayable = node;
            break;
          }
          node = DvtNBoxDataUtils.getDisplayable(nBox, node.getData()['__next']);
          count++;
        }
      }

      // cell#groupNode
      if (action.lastIndexOf('groupNode', 0) === 0) {
        var value;
        if (action.indexOf('{') > -1)
          values = this._parseBraces(action);
        else
          // grab category node id from brackets
          value = action.substring(action.indexOf('[') + 1, action.indexOf(']'));
        var node;
        var id;
        for (var i = 0; i < container.getNumChildren(); i++) {
          node = container.getChildAt(i);
          if (node instanceof DvtNBoxCategoryNode) {
            id = node.getData()['id'];
            if (values && this._compareCategories(values, id.split(';'))) {
              displayable = node;
              break;
            }
            else if (value && value == id) {
              displayable = node;
              break;
            }
          }
        }
      }
    }

    // cell
    else {
      displayable = cell;
    }
  }

  // groupNode
  else if (component.lastIndexOf('groupNode', 0) === 0) {
    container = nBox.getChildContainer();
    var value;
    if (component.indexOf('{') > -1)
      values = this._parseBraces(component);
    else
      // grab category node id from brackets
      value = component.substring(component.indexOf('[') + 1, component.indexOf(']'));
    var node;
    var id;
    for (var i = 0; i < container.getNumChildren(); i++) {
      node = container.getChildAt(i);
      if (node instanceof DvtNBoxCategoryNode) {
        id = node.getData()['id'];
        if (values && this._compareCategories(values, id.split(';'))) {
          displayable = node;
          break;
        }
        else if (value && value == id) {
          displayable = node;
          break;
        }
      }
    }
  }

  else if (component === 'dialog') {
    container = nBox.getChildContainer();
    if (container) {
      for (var i = 0; i < container.getNumChildren(); i++) {
        if (container.getChildAt(i) instanceof DvtNBoxDrawer) {
          var dialog = container.getChildAt(i);
          if (action) {

            // dialog#closeButton
            if (action == 'closeButton') {
              for (var j = 0; j < dialog.getNumChildren(); j++) {
                if (dialog.getChildAt(j) instanceof DvtButton) {
                  displayable = dialog.getChildAt(j);
                }
              }
            }

            // dialog#node
            if (action.lastIndexOf('node', 0) === 0) {
              var dialogContainer = dialog.getChildContainer().getScrollingPane();
              values = this._parseBrackets(action, true);
              var nodeIndex = values[0];
              if (nodeIndex < 0) {
                return null;
              }
              var node = DvtNBoxDataUtils.getFirstNavigableNode(nBox, dialogContainer);
              var count = 0;
              while (node && node.getTypeName() == 'DvtNBoxNode') {
                if (count == nodeIndex) {
                  displayable = node;
                  break;
                }
                node = DvtNBoxDataUtils.getDisplayable(nBox, node.getData()['__next']);
                count++;
              }
            }
          }

          // dialog
          else {
            displayable = dialog;
          }
          break;
        }
      }
    }
  }
  return displayable ? displayable.getElem() : null;
};

/**
 * Breaks subId into component, action parts
 *
 * @param {string} subId
 * @return {object}
 *
 * @private
 */
DvtNBoxAutomation.prototype._parseSubId = function(subId) {
  var component = null;
  var action = null;

  var hashIndex = subId.indexOf('#');
  if (hashIndex !== -1) {
    component = subId.substring(0, hashIndex);
    action = subId.substring(hashIndex + 1);
  }
  else {
    component = subId;
  }
  return {'component': component, 'action': action};
};


/**
 * Gets the component
 * @return {DvtNBox} the component
 */
DvtNBoxAutomation.prototype.getComponent = function() {
  return this._nBox;
};

/**
 * Takes component/action string and extracts the values in brackets.
 * @param {string} str component or action string with [ ]
 * @param {boolean} bParseInt whether or not to call parseInt on values before returning
 * @return {array} array of values within brackets
 *
 * @private
 */
DvtNBoxAutomation.prototype._parseBrackets = function(str, bParseInt) {
  var strBrackets = str.substring(str.indexOf('[') + 1, str.indexOf(']'));
  var values = strBrackets.split(',');

  if (bParseInt) {
    for (var i = 0; i < values.length; i++) {
      values[i] = parseInt(values[i]);
    }
  }
  return values.length > 0 ? values : null;
};

/**
 * Takes list of values and surrounds them with brackets
 * @param {array} values List of values to be put in brackets
 * @return {string} String of bracket surrounded values
 *
 * @private
 */
DvtNBoxAutomation.prototype._createBrackets = function(values) {
  return values.length > 0 ? '[' + values.join(',') + ']' : '';
};

/**
 * Takes component/action string and extracts the values in braces.
 *
 * @param {string} str component or action string with { }
 * @return {array} array representing values within braces
 *
 * @private
 */
DvtNBoxAutomation.prototype._parseBraces = function(str) {
  var strBraces = str.substring(str.indexOf('{') + 1, str.lastIndexOf('}'));
  return strBraces.split(',');
};

/**
 * Takes list of values and surrounds them with braces
 * @param {array} values List of values to be put in brackets
 * @return {string} String of bracket surrounded values
 *
 * @private
 */
DvtNBoxAutomation.prototype._createBraces = function(values) {
  var str = '{';
  for (var i = 0; i < values.length; i++) {
    str += values[i].trim() + ',';
  }
  return str.substring(0, str.length - 1) + '}';
};

/**
 * Compares two javascript arrays to see if they contain same values.
 * Used to compare NBoxCategoryNode categories to given subId categories.
 *
 * @param {array} arr1 first object
 * @param {array} arr2 second object
 * @return {boolean} true if same, false if not
 *
 * @private
 */
DvtNBoxAutomation.prototype._compareCategories = function(arr1, arr2) {
  if (arr1.length != arr2.length) {
    return false;
  }
  arr1.sort();
  arr2.sort();
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i].trim() != arr2[i].trim()) {
      return false;
    }
  }
  return true;
};

/**
 * Get nBox cell from row/col values
 *
 * @param {array} values [columnVal, rowVal]
 * @return {DvtNBoxCell} cell
 *
 * @private
 */
DvtNBoxAutomation.prototype._getCellIndexFromValues = function(values) {
  var nBox = this.getComponent();
  var colCount = DvtNBoxDataUtils.getColumnCount(nBox);

  var rowIndex = DvtNBoxDataUtils.getRowIndex(nBox, values[0]);
  var colIndex = DvtNBoxDataUtils.getColumnIndex(nBox, values[1]);

  if (colIndex != null && rowIndex != null) {
    return colIndex + colCount * rowIndex;
  }
  return null;
};

/**
 * Look for an object of given type in ancestry
 *
 * @param {DvtDisplayable} displayable
 * @param {string} type
 * @return {DvtNBoxCell} ancestor cell
 *
 * @private
 */
DvtNBoxAutomation.prototype._getParentObject = function(displayable, type) {
  var parent = displayable;
  while (parent) {
    if (parent.getTypeName() == type) {
      return parent;
    }
    else {
      parent = parent.getParent();
    }
  }
  return null;
};

/**
 * @export
 * Get NBox property for the passed key and attribute
 * @param {String} key  NBox property key
 * @param {String} attribute  NBox property attribute
 * @return {String} NBox property value for the key and attribute
 */
DvtNBoxAutomation.prototype.getData = function(key, attribute) {
  if (this._nBox) {
    if (key == 'rowsTitle') {
      //rows title
      if (this._nBox.getOptions()['rowsTitle'])
        return this._nBox.getOptions()['rowsTitle'];
    } else if (key == 'rowCount') {
      //row count
      var rows = this._nBox.getOptions()['rows'];
      if (rows)
        return rows.length;
    } else if (key == 'row') {
      //Check if row exists
      if (DvtNBoxDataUtils.getRowIndex(this._nBox, attribute) >= 0) {
        var data = {};
        //row label
        data['label'] = DvtNBoxDataUtils.getRowLabel(this._nBox, attribute);
        return data;
      }
    } else if (key == 'columnsTitle') {
      //columns title
      if (this._nBox.getOptions()['columnsTitle'])
        return this._nBox.getOptions()['columnsTitle'];
    } else if (key == 'columnCount') {
      //column count
      var cols = this._nBox.getOptions()['columns'];
      if (cols)
        return cols.length;
    } else if (key == 'column') {
      //Check if column exists
      if (DvtNBoxDataUtils.getColumnIndex(this._nBox, attribute) >= 0) {
        var data = {};
        //column label
        data['label'] = DvtNBoxDataUtils.getColumnLabel(this._nBox, attribute);
        return data;
      }
    } else if (key == 'groupBehavior') {
      return DvtNBoxDataUtils.getGroupBehavior(this._nBox);
    }
  }
  return null;
};

/**
 * @export
 * Get group node data from nbox for the passed group map
 * @param {Map|String} groupInfo  map or string containing the grouping info
 * @return {Object}  Group node data object
 */
DvtNBoxAutomation.prototype.getGroupNode = function(groupInfo) {
  if (groupInfo && DvtNBoxDataUtils.getGrouping(this._nBox)
  && DvtNBoxDataUtils.getGroupBehavior(this._nBox) == DvtNBoxConstants.GROUP_BEHAVIOR_ACROSS_CELLS) {
    if (typeof groupInfo === 'string')
      return this._getGroupNodeData(groupInfo);
    var groupData = '';
    for (var key in groupInfo) {
      if (groupInfo[key])
        groupData += key + ':' + groupInfo[key] + ';';
      else
        groupData += key + ';';
    }
    return this._getGroupNodeData(groupData.substring(0, groupData.length - 1));
  }
  return null;
};

/**
 * @private
 * Get group node data for the passed group info
 * @param {String} groupData  Key containing the grouping info
 * @return {Object}  Group node data object
 */
DvtNBoxAutomation.prototype._getGroupNodeData = function(groupData) {
  var categoryData = DvtNBoxDataUtils.getCategoryNode(this._nBox, groupData);
  if (categoryData) {
    var categoryNode = DvtNBoxDataUtils.getDisplayable(this._nBox, categoryData);
    if (categoryNode) {
      var data = {};
      data['selected'] = categoryNode.isSelected();
      data['color'] = DvtNBoxStyleUtils.getCategoryNodeColor(this._nBox, categoryData);
      data['indicatorColor'] = DvtNBoxStyleUtils.getCategoryNodeIndicatorColor(this._nBox, categoryData);
      data['tooltip'] = categoryNode.getShortDesc();
      data['size'] = categoryData['nodeIndices'] ? categoryData['nodeIndices'].length : -1;
      var indicatorIcon = DvtNBoxDataUtils.getDisplayable(this._nBox, categoryData, 'indicatorIcon');
      data['indicatorIcon'] = this._getMarkerData(indicatorIcon);

      return data;
    }
  }
  return null;
};

/**
 * @export
 * Get the NBox cell for the row and column value
 * @param {String} rowValue NBox row value
 * @param {String} columnValue NBox column value
 * @return {Object} NBox cell data object
 */
DvtNBoxAutomation.prototype.getCell = function(rowValue, columnValue) {
  var cellObj = DvtNBoxDataUtils.getCellByRowColumn(this._nBox, rowValue, columnValue);
  if (cellObj) {
    var cellIndex = cellObj.getCellIndex();
    var data = {};
    data['label'] = cellObj.getLabel();
    data['background'] = cellObj.getBackground();
    data['getNodeCount'] = function() {return cellObj.getNodeCount();};
    data['rowValue'] = rowValue;
    data['columnValue'] = columnValue;
    data['cellIndex'] = cellIndex;
    return data;
  }
  return null;
};

/**
 * @export
 * Get node from cell for the passed node index
 * @param {Object} cellData  Cell data object
 * @param {Number} nodeIndex  node index
 * @return {Object} node data object
 */
DvtNBoxAutomation.prototype.getCellNode = function(cellData, nodeIndex) {
  //If nodes are grouped then don't get node by index
  if (this._nBox && !DvtNBoxDataUtils.getGrouping(this._nBox)) {
    var cellObj = DvtNBoxDataUtils.getCellByRowColumn(this._nBox, cellData['rowValue'], cellData['columnValue']);
    var nodeData = cellObj.getNode(nodeIndex);
    return this._getNode(nodeData);
  }
  return null;
};


/**
 * @export
 * Get node at given index in node collection
 * @param {Number} nodeIndex  node index
 * @return {Object} node data object
 */
DvtNBoxAutomation.prototype.getNode = function(nodeIndex) {
  var nodeData = DvtNBoxDataUtils.getNode(this._nBox, nodeIndex);
  return this._getNode(nodeData);
};


/**
 * @private
 * Get automation node data object
 * @param {Object} nodeData  node data
 * @return {Object} automation node data
 */
DvtNBoxAutomation.prototype._getNode = function(nodeData) {
  if (nodeData) {
    var node = DvtNBoxDataUtils.getDisplayable(this._nBox, nodeData);
    if (node) {
      var data = {};
      data['selected'] = node.isSelected();
      data['tooltip'] = node.getShortDesc();
      data['color'] = DvtNBoxStyleUtils.getNodeColor(this._nBox, nodeData);
      data['indicatorColor'] = DvtNBoxStyleUtils.getNodeIndicatorColor(this._nBox, nodeData);
      if (nodeData['label']) {
        data['label'] = nodeData['label'];
      }
      if (nodeData['secondaryLabel']) {
        data['secondaryLabel'] = nodeData['secondaryLabel'];
      }
      var icon = DvtNBoxDataUtils.getDisplayable(this._nBox, nodeData, 'icon');
      data['icon'] = this._getMarkerData(icon);
      var indicatorIcon = DvtNBoxDataUtils.getDisplayable(this._nBox, nodeData, 'indicatorIcon');
      data['indicatorIcon'] = this._getMarkerData(indicatorIcon);
      return data;
    }
  }
  return null;
};

/**
 * @export
 * Get group node data from cell for the passed group map
 * @param {Object} cellData  Cell data object
 * @param {Map|String} groupInfo  map or string containing the grouping info
 * @return {Object}  Group node data object
 */
DvtNBoxAutomation.prototype.getCellGroupNode = function(cellData, groupInfo) {
  if (groupInfo && DvtNBoxDataUtils.getGrouping(this._nBox)
      && DvtNBoxDataUtils.getGroupBehavior(this._nBox) == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
    if (typeof groupInfo === 'string')
      return this._getGroupNodeData(cellData['cellIndex'] + ':' + groupInfo);
    var groupData = cellData['cellIndex'] + ':';
    for (var key in groupInfo) {
      if (groupInfo[key])
        groupData += key + ':' + groupInfo[key] + ';';
      else
        groupData += key + ';';
    }
    return this._getGroupNodeData(groupData.substring(0, groupData.length - 1));
  }
  return null;
};

/**
 * @private
 * Get marker data from marker
 * @param {DvtSimpleMarker|DvtImageMarker} marker Displayable marker object
 * @return {Object} Marker data object
 */
DvtNBoxAutomation.prototype._getMarkerData = function(marker) {
  if (marker) {
    var data = {};
    // public api expects image markers to return a shape of 'none'
    data['shape'] = (marker instanceof DvtSimpleMarker ? marker.getType() : 'none');
    if (marker.getFill())
      data['color'] = marker.getFill().getColor();
    return data;
  }
  return null;
};

/**
 * @export
 * Get current NBox dialog data
 * @return {object}  NBox dialog data object
 */
DvtNBoxAutomation.prototype.getDialog = function() {
  var drawer = DvtNBoxDataUtils.getDrawer(this._nBox);
  if (drawer) {
    var categoryData = DvtNBoxDataUtils.getCategoryNode(this._nBox, drawer.id);
    if (categoryData) {
      var categoryNode = DvtNBoxDataUtils.getDisplayable(this._nBox, categoryData);
      var data = {};
      data['label'] = categoryNode.getLabel();
      data['getNodeCount'] = function() {return categoryData['nodeIndices'] ? categoryData['nodeIndices'].length : -1;};
      var groupInfo = {};
      var categories = categoryData.id.split(';');
      for (var idx = 0; idx < categories.length; idx++) {
        var row = categories[idx].split(':');
        if (row && row.length == 2)
          groupInfo[row[0]] = row[1];
      }
      data['groupInfo'] = groupInfo;
      return data;
    }
  }
  return null;
};

/**
 * @export
 * Get node data from NBox dialog
 * @param {Number} nodeIndex  Node index
 * @return {Object} automation node data
 */
DvtNBoxAutomation.prototype.getDialogNode = function(nodeIndex) {
  var drawer = DvtNBoxDataUtils.getDrawer(this._nBox);
  if (drawer) {
    var categoryData = DvtNBoxDataUtils.getCategoryNode(this._nBox, drawer.id);
    if (categoryData && categoryData['nodeIndices'] && categoryData['nodeIndices'][nodeIndex] != null) {
      var nodeData = DvtNBoxDataUtils.getNode(this._nBox, categoryData['nodeIndices'][nodeIndex]);
      return this._getNode(nodeData);
    }
  }
  return null;
};


/**
 * @export
 * Get node id from index
 * @param {Number} index node index
 * @return {string} node id
 */
DvtNBoxAutomation.prototype.getNodeIdFromIndex = function(index) {
  return DvtNBoxDataUtils.getNode(this._nBox, index)['id'];
};

/**
 * @export
 * Get node index from id
 * @param {string} id node id
 * @return {Number} node index
 */
DvtNBoxAutomation.prototype.getNodeIndexFromId = function(id) {
  return DvtNBoxDataUtils.getNodeIndex(this._nBox, id);
};
// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.


/**
 * Renderer for DvtNBox.
 * @class
 */
var DvtNBoxRenderer = new Object();

DvtObj.createSubclass(DvtNBoxRenderer, DvtObj, 'DvtNBoxRenderer');


/**
 * Renders the nbox contents into the available space.
 * @param {DvtNBox} nbox The nbox being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxRenderer.render = function(nbox, container, availSpace) {
  DvtNBoxRenderer._renderBackground(nbox, container, availSpace);
  DvtNBoxRenderer._renderLegend(nbox, container, availSpace);
  DvtNBoxRenderer._adjustAvailSpace(availSpace);
  var cellCounts = DvtNBoxRenderer._calculateCellCounts(nbox);
  var cellLayout = DvtNBoxCellRenderer.calculateCellLayout(nbox, cellCounts);

  DvtNBoxRenderer._renderTitles(nbox, container, cellLayout, availSpace);
  DvtNBoxRenderer._adjustAvailSpace(availSpace);
  DvtNBoxRenderer._renderCells(nbox, container, cellCounts, cellLayout, availSpace);
  DvtNBoxRenderer._renderNodes(nbox, container, cellCounts, availSpace);
  DvtNBoxRenderer._renderInitialSelection(nbox);
  DvtNBoxRenderer._fixZOrder(nbox);
};


/**
 * Renders the nbox background.
 * @param {DvtNBox} nbox The nbox being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxRenderer._renderBackground = function(nbox, container, availSpace) {
  // NBox background: Apply invisible background for interaction support
  var rect = new DvtRect(nbox.getCtx(), availSpace.x, availSpace.y, availSpace.w, availSpace.h);
  rect.setInvisibleFill();
  container.addChild(rect);
  var clipPath = new DvtClipPath();
  clipPath.addRect(availSpace.x, availSpace.y, availSpace.w, availSpace.h);
  container.setClipPath(clipPath);
};


/**
 * Renders the nbox legend.
 * @param {DvtNBox} nbox The nbox being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxRenderer._renderLegend = function(nbox, container, availSpace) {
  var legendData = DvtNBoxDataUtils.getLegend(nbox);
  if (legendData && legendData['sections']) {
    var options = nbox.getOptions();
    var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

    var panelDrawer = new DvtPanelDrawer(nbox.getCtx(), nbox.processEvent, nbox, 'pd1');
    panelDrawer.addEvtListener(DvtPanelDrawerEvent.TYPE, nbox.processEvent, false, nbox);
    panelDrawer.setDockSide(DvtPanelDrawer.DOCK_TOP);
    panelDrawer.setMaxHeight(availSpace.h - options['__layout']['legendBottomGap']);
    panelDrawer.setMaxWidth(availSpace.w / 3);
    container.addChild(panelDrawer);

    var legend = DvtLegend.newInstance(nbox.getCtx(), nbox.processEvent, nbox);
    container.addChild(legend);
    var preferredSize = legend.getPreferredSize(legendData, panelDrawer.getMaxContentWidth(), panelDrawer.getMaxContentHeight());
    legend.render(legendData, preferredSize.w, preferredSize.h);
    container.removeChild(legend);

    var legendEna = options['_resources']['legend_ena'];
    var legendOvr = options['_resources']['legend_ovr'];
    var legendDwn = options['_resources']['legend_dwn'];
    var legendEnaImg = new DvtImage(nbox.getCtx(), legendEna['src'], 0, 0, legendEna['width'], legendEna['height']);
    var legendOvrImg = new DvtImage(nbox.getCtx(), legendOvr['src'], 0, 0, legendOvr['width'], legendOvr['height']);
    var legendDwnImg = new DvtImage(nbox.getCtx(), legendDwn['src'], 0, 0, legendDwn['width'], legendDwn['height']);
    panelDrawer.addPanel(legend, legendEnaImg, legendOvrImg, legendDwnImg, DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'LEGEND'), 'legend');
    if (rtl) {
      panelDrawer.setDiscloseDirection(DvtPanelDrawer.DIR_RIGHT);
    }
    panelDrawer.renderComponent();
    if (options[DvtNBoxConstants.LEGEND_DISCLOSURE] == 'disclosed') {
      panelDrawer.setDisplayedPanelId('legend');
      panelDrawer.setDisclosed(true, true);
    }
    var dims = panelDrawer.getDimensions();
    panelDrawer.setTranslate(rtl ? 0 : availSpace.w, 0);
    if (rtl) {
      availSpace.x += dims.w;
    }
    availSpace.w -= dims.w;
    DvtNBoxDataUtils.setDisplayable(nbox, legendData, legend, 'legend');
    DvtNBoxDataUtils.setDisplayable(nbox, legendData, panelDrawer, 'panelDrawer');
  }
};


/**
 * Renders the nbox titles and updates the available space.
 * @param {DvtNBox} nbox The nbox being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {object} cellLayout Aan object containing sizes related to cell layout, based upon the first specified cell
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxRenderer._renderTitles = function(nbox, container, cellLayout, availSpace) {
  var options = nbox.getOptions();
  var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
  var rowCount = DvtNBoxDataUtils.getRowCount(nbox);

  var componentGap = options['__layout']['componentGap'];
  var titleGap = options['__layout']['titleGap'];
  var titleComponentGap = options['__layout']['titleComponentGap'];
  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

  availSpace.x += componentGap;
  availSpace.y += componentGap;
  availSpace.w -= 2 * componentGap;
  availSpace.h -= 2 * componentGap;

  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(nbox);
  var maximizedColumnIndex = maximizedColumn ? DvtNBoxDataUtils.getColumnIndex(nbox, maximizedColumn) : -1;
  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(nbox);
  var maximizedRowIndex = maximizedRow ? DvtNBoxDataUtils.getRowIndex(nbox, maximizedRow) : -1;

  var columnsTitle = null;
  var rowsTitle = null;
  var columnLabels = [];
  var rowLabels = [];
  var columnsTitleHeight = 0;
  var rowsTitleWidth = 0;
  var rowTitleGap = 0;
  var columnTitleGap = 0;
  var columnLabelsHeight = 0;
  var rowLabelsWidth = 0;
  var rowTitleComponentGap = 0;
  var columnTitleComponentGap = 0;

  if (options[DvtNBoxConstants.COLUMNS_TITLE]) {
    columnsTitle = DvtNBoxRenderer.createText(nbox.getCtx(), options[DvtNBoxConstants.COLUMNS_TITLE],
                                              options[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.COLUMNS_TITLE_STYLE],
                                              DvtOutputText.H_ALIGN_CENTER, DvtOutputText.V_ALIGN_MIDDLE);
    container.addChild(columnsTitle);
    columnsTitleHeight = DvtTextUtils.guessTextDimensions(columnsTitle).h;
  }
  if (options[DvtNBoxConstants.ROWS_TITLE]) {
    rowsTitle = DvtNBoxRenderer.createText(nbox.getCtx(), options[DvtNBoxConstants.ROWS_TITLE],
                                           options[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.ROWS_TITLE_STYLE],
                                           DvtOutputText.H_ALIGN_CENTER, DvtOutputText.V_ALIGN_MIDDLE);
    container.addChild(rowsTitle);
    rowsTitleWidth = DvtTextUtils.guessTextDimensions(rowsTitle).h;
  }

  for (var i = 0; i < columnCount; i++) {
    var column = DvtNBoxDataUtils.getColumn(nbox, i);
    if (column[DvtNBoxConstants.LABEL]) {
      var columnLabel = DvtNBoxRenderer.createText(nbox.getCtx(), column[DvtNBoxConstants.LABEL], DvtNBoxStyleUtils.getColumnLabelStyle(nbox, i), DvtOutputText.H_ALIGN_CENTER, DvtOutputText.V_ALIGN_MIDDLE);
      columnLabelsHeight = Math.max(columnLabelsHeight, DvtTextUtils.guessTextDimensions(columnLabel).h);
      if (!maximizedColumn || maximizedColumn == column[DvtNBoxConstants.ID]) {
        columnLabels[i] = columnLabel;
        container.addChild(columnLabels[i]);
      }
    }
  }

  for (var i = 0; i < rowCount; i++) {
    var row = DvtNBoxDataUtils.getRow(nbox, i);
    if (row[DvtNBoxConstants.LABEL]) {
      var rowLabel = DvtNBoxRenderer.createText(nbox.getCtx(), row[DvtNBoxConstants.LABEL], DvtNBoxStyleUtils.getRowLabelStyle(nbox, i), DvtOutputText.H_ALIGN_CENTER, DvtOutputText.V_ALIGN_MIDDLE);
      rowLabelsWidth = Math.max(rowLabelsWidth, DvtTextUtils.guessTextDimensions(rowLabel).h);
      if (!maximizedRow || maximizedRow == row[DvtNBoxConstants.ID]) {
        rowLabels[i] = rowLabel;
        container.addChild(rowLabels[i]);
      }
    }
  }

  if (rowsTitleWidth || rowLabelsWidth) {
    rowTitleComponentGap = titleComponentGap;
    if (rowsTitleWidth && rowLabelsWidth) {
      rowTitleGap = titleGap;
    }
  }
  if (columnsTitleHeight || columnLabelsHeight) {
    columnTitleComponentGap = titleComponentGap;
    if (columnsTitleHeight && columnLabelsHeight) {
      columnTitleGap = titleGap;
    }
  }

  var rowHeaderWidth = rowsTitleWidth + rowTitleGap + rowLabelsWidth + rowTitleComponentGap;
  var columnHeaderHeight = columnsTitleHeight + columnTitleGap + columnLabelsHeight + columnTitleComponentGap;

  availSpace.x += rtl ? 0 : rowHeaderWidth;
  availSpace.w -= rowHeaderWidth;
  availSpace.h -= columnHeaderHeight;

  if (columnsTitle) {
    if (DvtTextUtils.fitText(columnsTitle, availSpace.w, columnsTitleHeight, container)) {
      DvtNBoxRenderer.positionText(columnsTitle, availSpace.x + availSpace.w / 2, availSpace.y + availSpace.h + columnHeaderHeight - columnsTitleHeight / 2);
      DvtNBoxDataUtils.setDisplayable(nbox, nbox.getOptions(), columnsTitle, DvtNBoxConstants.COLUMNS_TITLE);
    }
  }
  if (rowsTitle) {
    if (DvtTextUtils.fitText(rowsTitle, availSpace.h, rowsTitleWidth, container)) {
      DvtNBoxRenderer.positionText(rowsTitle,
                                   availSpace.x + (rtl ? availSpace.w : 0) + (rtl ? 1 : -1) * (rowHeaderWidth - rowsTitleWidth / 2),
                                   availSpace.y + availSpace.h / 2,
                                   rtl ? Math.PI / 2 : -Math.PI / 2);
      DvtNBoxDataUtils.setDisplayable(nbox, nbox.getOptions(), rowsTitle, DvtNBoxConstants.ROWS_TITLE);
    }
  }
  for (var i = 0; i < columnCount; i++) {
    if (columnLabels[i]) {
      var cellDims = DvtNBoxCellRenderer.getCellDimensions(nbox, maximizedRowIndex == -1 ? 0 : maximizedRowIndex, i, cellLayout, availSpace);
      if (DvtTextUtils.fitText(columnLabels[i], cellDims.w, columnLabelsHeight, container)) {
        DvtNBoxRenderer.positionText(columnLabels[i], cellDims.x + cellDims.w / 2, availSpace.y + availSpace.h + columnTitleComponentGap + columnLabelsHeight / 2);
        DvtNBoxDataUtils.setDisplayable(nbox, DvtNBoxDataUtils.getColumn(nbox, i), columnLabels[i], DvtNBoxConstants.LABEL);
      }
    }
  }
  for (var i = 0; i < rowCount; i++) {
    if (rowLabels[i]) {
      var cellDims = DvtNBoxCellRenderer.getCellDimensions(nbox, i, maximizedColumnIndex == -1 ? 0 : maximizedColumnIndex, cellLayout, availSpace);
      if (DvtTextUtils.fitText(rowLabels[i], cellDims.h, rowLabelsWidth, container)) {
        DvtNBoxRenderer.positionText(rowLabels[i],
                                     availSpace.x + (rtl ? availSpace.w : 0) + (rtl ? 1 : -1) * (rowTitleComponentGap + rowLabelsWidth / 2),
                                     cellDims.y + cellDims.h / 2,
                                     rtl ? Math.PI / 2 : -Math.PI / 2);
        DvtNBoxDataUtils.setDisplayable(nbox, DvtNBoxDataUtils.getRow(nbox, i), rowLabels[i], DvtNBoxConstants.LABEL);
      }
    }
  }
};


/**
 * Creates a text element
 *
 * @param {DvtContext} ctx the rendering context
 * @param {string} strText the text string
 * @param {DvtCSSStyle} style the style object to apply to the test
 * @param {string} halign the horizontal alignment
 * @param {string} valign the vertical alignment
 *
 * @return {DvtOutputText} the text element
 */
DvtNBoxRenderer.createText = function(ctx, strText, style, halign, valign) {
  var text = new DvtOutputText(ctx, strText, 0, 0);
  text.setCSSStyle(style);
  text.setHorizAlignment(halign);
  text.setVertAlignment(valign);
  return text;
};


/**
 * Renders cells
 * @param {DvtNBox} nbox The nbox being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {object} cellCounts Two keys ('highlighted' and 'total') which each map to an array of cell counts by cell index
 * @param {object} cellLayout Aan object containing sizes related to cell layout, based upon the first specified cell
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxRenderer._renderCells = function(nbox, container, cellCounts, cellLayout, availSpace) {
  var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
  var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < columnCount; c++) {
      var cell = DvtNBoxDataUtils.getCell(nbox, r * columnCount + c);
      var cellContainer = DvtNBoxCell.newInstance(nbox, cell);
      cellContainer.render(container, cellLayout, cellCounts, availSpace);
    }
  }
};


/**
 * Counts the number of nodes (highlighted and total) for each cell
 * @param {DvtNBox} nbox The nbox component
 * @return {object} Two keys ('highlighted' and 'total') which each map to an array of cell counts by cell index
 */
DvtNBoxRenderer._calculateCellCounts = function(nbox) {
  var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
  var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
  var cellCount = rowCount * columnCount;
  var total = [];
  var highlighted = null;
  var highlightedItems = DvtNBoxDataUtils.getHighlightedItems(nbox);
  var highlightedMap = {};
  if (highlightedItems) {
    highlighted = [];
    for (var i = 0; i < highlightedItems.length; i++) {
      highlightedMap[highlightedItems[i][DvtNBoxConstants.ID]] = true;
    }
  }
  for (var i = 0; i < cellCount; i++) {
    total[i] = 0;
    if (highlighted) {
      highlighted[i] = 0;
    }
  }
  var nodeCount = DvtNBoxDataUtils.getNodeCount(nbox);
  for (var i = 0; i < nodeCount; i++) {
    var node = DvtNBoxDataUtils.getNode(nbox, i);
    if (!DvtNBoxDataUtils.isNodeHidden(nbox, node)) {
      var cellIndex = DvtNBoxDataUtils.getCellIndex(nbox, node);
      total[cellIndex]++;
      if (highlighted && highlightedMap[node[DvtNBoxConstants.ID]]) {
        highlighted[cellIndex]++;
      }
    }
  }
  var retVal = {};
  retVal['total'] = total;
  if (highlighted) {
    retVal['highlighted'] = highlighted;
  }
  return retVal;
};


/**
 * Renders nodes
 * @param {DvtNBox} nbox The nbox being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {object} cellCounts Two keys ('highlighted' and 'total') which each map to an array of cell counts by cell index
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxRenderer._renderNodes = function(nbox, container, cellCounts, availSpace) {
  if (DvtNBoxDataUtils.getNodeCount(nbox) > 0) {
    // skip rendering nodes if rendering counts only.
    if (DvtNBoxDataUtils.getCellContent(nbox) == 'counts') {
      var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
      var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
      var bodyCountLabels = [];
      for (var r = 0; r < rowCount; r++) {
        for (var c = 0; c < columnCount; c++) {
          bodyCountLabels.push(r * columnCount + c);
        }
      }
      DvtNBoxCellRenderer.renderBodyCountLabels(nbox, cellCounts, bodyCountLabels);
      return;
    }

    if (DvtNBoxDataUtils.getGrouping(nbox)) {
      DvtNBoxRenderer._renderCategoryNodes(nbox, container, availSpace);
      DvtNBoxRenderer._renderDrawer(nbox, container, availSpace);
    }
    else {
      DvtNBoxRenderer._renderIndividualNodes(nbox, container, cellCounts, availSpace);
    }
  }
};


/**
 * Renders individual nodes (no grouping)
 * @param {DvtNBox} nbox The nbox being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {object} cellCounts Two keys ('highlighted' and 'total') which each map to an array of cell counts by cell index
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxRenderer._renderIndividualNodes = function(nbox, container, cellCounts, availSpace) {
  var options = nbox.getOptions();
  var gridGap = options['__layout']['gridGap'];

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

  // If no nodes are highlighted/selected, make a single pass through the nodes for ordering
  // If some nodes are highlighted/selected, make additional passes, ensuring highlighted/selected nodes come first in render order

  var orderPasses = ['normal'];
  var alphaFade = DvtNBoxStyleUtils.getFadedNodeAlpha(nbox);
  var highlightedItems = DvtNBoxDataUtils.getHighlightedItems(nbox);
  var highlightedMap = {};
  if (highlightedItems) {
    for (var i = 0; i < highlightedItems.length; i++) {
      highlightedMap[highlightedItems[i][DvtNBoxConstants.ID]] = true;
    }
  }

  var selectedItems = DvtNBoxDataUtils.getSelectedItems(nbox);
  var selectedMap = {};
  if (selectedItems) {
    for (var i = 0; i < selectedItems.length; i++) {
      selectedMap[selectedItems[i]] = true;
    }
  }

  if (highlightedItems) {
    if (selectedItems)
      orderPasses = ['highlighted-selected', 'highlighted-unselected', 'unhighlighted-selected', 'unhighlighted-unselected'];
    else
      orderPasses = ['highlighted-unselected', 'unhighlighted-unselected'];
  }
  else if (selectedItems) {
    orderPasses = ['unhighlighted-selected', 'unhighlighted-unselected'];
  }

  // calculate rendering order of nodes in each cell
  var cellNodes = {};
  var nodeCount = DvtNBoxDataUtils.getNodeCount(nbox);
  for (var p = 0; p < orderPasses.length; p++) {
    for (var n = 0; n < nodeCount; n++) {
      var node = DvtNBoxDataUtils.getNode(nbox, n);
      if (!DvtNBoxDataUtils.isNodeHidden(nbox, node)) {
        if (orderPasses[p] == 'normal' ||
            (orderPasses[p] == 'highlighted-selected' && highlightedMap[node[DvtNBoxConstants.ID]] && selectedMap[node[DvtNBoxConstants.ID]]) ||
            (orderPasses[p] == 'highlighted-unselected' && highlightedMap[node[DvtNBoxConstants.ID]] && !selectedMap[node[DvtNBoxConstants.ID]]) ||
            (orderPasses[p] == 'unhighlighted-selected' && !highlightedMap[node[DvtNBoxConstants.ID]] && selectedMap[node[DvtNBoxConstants.ID]]) ||
            (orderPasses[p] == 'unhighlighted-unselected' && !highlightedMap[node[DvtNBoxConstants.ID]] && !selectedMap[node[DvtNBoxConstants.ID]])) {
          var cellIndex = DvtNBoxDataUtils.getCellIndex(nbox, node);
          if (!DvtNBoxDataUtils.isCellMinimized(nbox, cellIndex)) {
            if (!cellNodes[cellIndex]) {
              cellNodes[cellIndex] = [];
            }
            cellNodes[cellIndex].push(node);
          }
        }
      }
    }
  }

  var nodeLayout = DvtNBoxNodeRenderer.calculateNodeLayout(nbox, cellNodes);
  var hGridSize = nodeLayout['indicatorSectionWidth'] + nodeLayout['iconSectionWidth'] + nodeLayout['labelSectionWidth'] + gridGap;
  var vGridSize = nodeLayout['nodeHeight'] + gridGap;

  var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
  var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < columnCount; c++) {
      var cellIndex = r * columnCount + c;
      var nodes = cellNodes[cellIndex];
      if (!nodes || !nodes.length) {
        continue;
      }
      var cell = DvtNBoxDataUtils.getCell(nbox, cellIndex);
      var cellLayout = nodeLayout['cellLayouts'][cellIndex];
      var cellRows = cellLayout['cellRows'];
      var cellColumns = cellLayout['cellColumns'];
      var skipNodes = cellRows == 0 || cellColumns == 0 || (cellRows == 1 && cellColumns == 1 && cellLayout['overflow']);
      if (!skipNodes) {
        var maxNodes = cellRows * cellColumns - (cellLayout['overflow'] ? 1 : 0);
        for (var n = 0; n < nodes.length; n++) {
          var node = nodes[n];
          if (maxNodes < 0 || n < maxNodes) {
            var cellContainer = DvtNBoxDataUtils.getDisplayable(nbox, cell).getChildContainer();
            var scrolling = cellContainer instanceof DvtSimpleScrollableContainer;
            var nodeContainer = DvtNBoxNode.newInstance(nbox, node);
            var gridXOrigin = cell['__childArea'].x + (cell['__childArea'].w - cellLayout['cellColumns'] * hGridSize + gridGap) / 2;
            var gridYOrigin = scrolling ? gridGap : cell['__childArea'].y;
            var gridColumn = n % cellColumns;
            if (rtl) {
              gridColumn = cellColumns - gridColumn - 1;
            }
            var gridRow = Math.floor(n / cellColumns);
            nodeContainer.setTranslate(gridXOrigin + hGridSize * gridColumn,
                gridYOrigin + vGridSize * gridRow);
            nodeContainer.render(scrolling ? cellContainer.getScrollingPane() : cellContainer, nodeLayout);
            if (highlightedItems && !highlightedMap[node[DvtNBoxConstants.ID]]) {
              nodeContainer.setAlpha(alphaFade);
            }

            //keyboard navigation
            var prevNode = n > 0 ? nodes[n - 1] : null;
            if (prevNode) {
              node['__prev'] = prevNode;
              prevNode['__next'] = node;
            }
          }
        }
      }
    }
  }
  // Render overflow indicators and set content size for scrolling.
  var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
  var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
  var bodyCountLabels = [];
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < columnCount; c++) {
      var ci = r * columnCount + c;
      if (!DvtNBoxDataUtils.isCellMinimized(nbox, ci)) {
        var cellData = DvtNBoxDataUtils.getCell(nbox, ci);
        var cell = DvtNBoxDataUtils.getDisplayable(nbox, cellData);
        var cellLayout = nodeLayout['cellLayouts'][ci];
        if (cellLayout['overflow']) {
          var cellRows = cellLayout['cellRows'];
          var cellColumns = cellLayout['cellColumns'];
          var skipOverflow = cellRows == 0 || cellColumns == 0 || (cellRows == 1 && cellColumns == 1 && cellLayout['overflow']);
          if (!skipOverflow) {
            var overflowContainer = DvtNBoxNodeOverflow.newInstance(nbox, cell);
            //keyboard navigation
            var prevNode = DvtNBoxDataUtils.getLastNavigableNode(nbox, cell.getChildContainer());
            if (prevNode && prevNode instanceof DvtNBoxNode) {
              overflowContainer['__prev'] = prevNode.getData();
              prevNode.getData()['__next'] = overflowContainer;
            }
            DvtNBoxDataUtils.setDisplayable(nbox, overflowContainer, overflowContainer);
            DvtNBoxDataUtils.setDisplayable(nbox, cellData, overflowContainer, 'overflow');

            var gridXOrigin = cellData['__childArea'].x + (cellData['__childArea'].w - cellLayout['cellColumns'] * hGridSize + gridGap) / 2;
            var gridYOrigin = cellData['__childArea'].y;
            var gridColumn = cellLayout['cellColumns'] - 1;
            if (rtl) {
              gridColumn = 0;
            }
            var gridRow = cellLayout['cellRows'] - 1;
            overflowContainer.setTranslate(gridXOrigin + hGridSize * gridColumn,
                gridYOrigin + vGridSize * gridRow);
            overflowContainer.render(cell.getChildContainer(), hGridSize - gridGap, vGridSize - gridGap);
          }
          else {
            bodyCountLabels.push(ci);
          }
        }
      }
      if (DvtNBoxDataUtils.isCellMaximized(nbox, ci)) {
        var cellContainer = DvtNBoxDataUtils.getDisplayable(nbox, DvtNBoxDataUtils.getCell(nbox, ci)).getChildContainer();
        cellContainer.prepareContentPane();
      }
    }
  }
  if (bodyCountLabels.length > 0) {
    DvtNBoxCellRenderer.renderBodyCountLabels(nbox, cellCounts, bodyCountLabels);
  }
};


/**
 * Renders category nodes
 * @param {DvtNBox} nbox The nbox being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxRenderer._renderCategoryNodes = function(nbox, container, availSpace) {
  var groups = {};
  var nodeCount = DvtNBoxDataUtils.getNodeCount(nbox);
  var groupBehavior = DvtNBoxDataUtils.getGroupBehavior(nbox);

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

  var highlightedItems = DvtNBoxDataUtils.getHighlightedItems(nbox);
  var highlightedMap = {};
  if (highlightedItems) {
    for (var i = 0; i < highlightedItems.length; i++) {
      highlightedMap[highlightedItems[i][DvtNBoxConstants.ID]] = true;
    }
  }
  for (var n = 0; n < nodeCount; n++) {
    var node = DvtNBoxDataUtils.getNode(nbox, n);
    if (!DvtNBoxDataUtils.isNodeHidden(nbox, node)) {
      var groupContainer = groups;
      if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
        var groupId = DvtNBoxDataUtils.getCellIndex(nbox, node) + '';
        groupContainer = groups[groupId];
        if (!groupContainer) {
          groupContainer = {};
          groups[groupId] = groupContainer;
        }
      }
      var groupId = DvtNBoxDataUtils.getNodeGroupId(node);
      var group = groupContainer[groupId];
      if (!group) {
        group = {};
        group[DvtNBoxConstants.ID] = groupId;
        if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
          group[DvtNBoxConstants.CELL] = DvtNBoxDataUtils.getCellIndex(nbox, node);
        }
        group['nodeIndices'] = [];
        group['highlightedCount'] = 0;
        groupContainer[groupId] = group;
      }
      group['nodeIndices'].push(n);
      if (highlightedMap[DvtNBoxDataUtils.getNode(nbox, n)[DvtNBoxConstants.ID]]) {
        group['highlightedCount']++;
      }
    }
  }
  // Process other threshold
  var otherGroups;
  if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
    otherGroups = {};
    for (var cellId in groups) {
      otherGroups[cellId] = DvtNBoxRenderer._processOtherThreshold(nbox, groups[cellId]);
    }
  }
  else {
    otherGroups = DvtNBoxRenderer._processOtherThreshold(nbox, groups);
  }
  var groups = otherGroups;
  nbox.getOptions()['__groups'] = groups;
  if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_ACROSS_CELLS) {
    // Sort groups by size
    var sortedGroups = [];
    for (var group in groups) {
      sortedGroups.push(group);
    }
    sortedGroups.sort(function(a,b) {return DvtNBoxCategoryNode.compareSize(groups[a], groups[b])});
    var scale = Math.sqrt(.15 * (availSpace.w * availSpace.h) / nodeCount);
    for (var i = 0; i < sortedGroups.length; i++) {
      var group = sortedGroups[i];
      var xPos = 0;
      var yPos = 0;
      var nodeCount = groups[group]['nodeIndices'].length;
      for (var j = 0; j < nodeCount; j++) {
        var node = DvtNBoxDataUtils.getNode(nbox, groups[group]['nodeIndices'][j]);
        xPos += DvtNBoxDataUtils.getXPercentage(nbox, node);
        yPos += DvtNBoxDataUtils.getYPercentage(nbox, node);
      }
      xPos /= nodeCount;
      yPos /= nodeCount;

      var nodeContainer = DvtNBoxCategoryNode.newInstance(nbox, groups[group]);
      nodeContainer.setTranslate(availSpace.x + (rtl ? (1 - xPos) : xPos) * availSpace.w, availSpace.y + (1 - yPos) * availSpace.h);
      nodeContainer.render(container, scale, 0);
      nodeContainer.setMaxAlpha(.8);
    }
  }
  else if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
    var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
    var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
    var cellCount = rowCount * columnCount;
    var layouts = [];
    for (var i = 0; i < cellCount; i++) {
      if (groups[i] && !DvtNBoxDataUtils.isCellMinimized(nbox, i)) {
        var cell = DvtNBoxDataUtils.getCell(nbox, i);
        layouts[i] = DvtNBoxRenderer._forceLayoutGroups(groups[i], cell['__childArea'].w, cell['__childArea'].h);
      }
    }
    var scale = 40; // Maximum amount to scale by
    for (var i = 0; i < cellCount; i++) {
      if (groups[i] && !DvtNBoxDataUtils.isCellMinimized(nbox, i)) {
        scale = Math.min(scale, layouts[i]['scale']);
      }
    }
    for (var i = 0; i < cellCount; i++) {
      if (groups[i] && !DvtNBoxDataUtils.isCellMinimized(nbox, i)) {
        var positions = layouts[i]['positions'];
        var center = layouts[i]['center'];
        var cell = DvtNBoxDataUtils.getCell(nbox, i);
        var childContainer = DvtNBoxDataUtils.getDisplayable(nbox, cell).getChildContainer();
        var scrolling = childContainer instanceof DvtSimpleScrollableContainer;
        for (var group in positions) {
          var nodeContainer = DvtNBoxCategoryNode.newInstance(nbox, groups[i][group]);
          nodeContainer.setTranslate(cell['__childArea'].x + cell['__childArea'].w / 2 + scale * (positions[group].x - center.x),
                                     (scrolling ? 0 : cell['__childArea'].y) + cell['__childArea'].h / 2 + scale * (positions[group].y - center.y));
          nodeContainer.render(scrolling ? childContainer.getScrollingPane() : childContainer, scale, 3);
        }
      }
    }
  }
};


/**
 * Returns the dimensions of the specified nbox row
 * @param {DvtNBox} the nbox component
 * @param {number} rowIndex the index of the specified row
 * @param {DvtRectangle} availSpace the dimensions of the available space
 * @param {DvtRectangle} the dimensions of the specified nbox row
 */
DvtNBoxRenderer.getRowDimensions = function(nbox, rowIndex, availSpace) {
  var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
  var rowHeight = availSpace.h / rowCount;

  var y = availSpace.y + (rowCount - rowIndex - 1) * rowHeight;
  var h = rowHeight;

  return new DvtRectangle(availSpace.x, y, availSpace.w, h);
};


/**
 * Returns the dimensions of the specified nbox column
 * @param {DvtNBox} the nbox component
 * @param {number} columnIndex the index of the specified column
 * @param {DvtRectangle} availSpace the dimensions of the available space
 * @param {DvtRectangle} the dimensions of the specified nbox column
 */
DvtNBoxRenderer.getColumnDimensions = function(nbox, columnIndex, availSpace) {
  var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
  var columnWidth = availSpace.w / columnCount;
  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

  var x = availSpace.x + (rtl ? availSpace.w - columnWidth : 0) + (rtl ? -1 : 1) * columnIndex * columnWidth;
  var w = columnWidth;

  return new DvtRectangle(x, availSpace.y, w, availSpace.h);
};


/**
 * Helper function that adjusts the input rectangle to the closest pixel.
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxRenderer._adjustAvailSpace = function(availSpace) {
  // : Adjust the bounds to the closest pixel to prevent antialiasing issues.
  availSpace.x = Math.round(availSpace.x);
  availSpace.y = Math.round(availSpace.y);
  availSpace.w = Math.round(availSpace.w);
  availSpace.h = Math.round(availSpace.h);
};


/**
 * Helper function to position text
 *
 * @param {DvtOutputText} text The text to position
 * @param {number} x The x coordinate
 * @param {number} y The y coordinate
 * @param {number} angle The optional angle to rotate by
 */
DvtNBoxRenderer.positionText = function(text, x, y, angle) {
  text.setX(x);
  text.setY(y);
  if (angle) {
    var matrix = text.getMatrix();
    matrix.translate(-x, -y);
    matrix.rotate(angle);
    matrix.translate(x, y);
    text.setMatrix(matrix);
  }
};


/**
 * Renders the initial selection state
 *
 * @param {DvtNBox} nbox the nbox component
 */
DvtNBoxRenderer._renderInitialSelection = function(nbox) {
  if (nbox.isSelectionSupported()) {
    var selectedMap = {};
    var selectedIds = [];
    var selectedItems = DvtNBoxDataUtils.getSelectedItems(nbox);
    if (selectedItems) {
      for (var i = 0; i < selectedItems.length; i++) {
        selectedIds.push(selectedItems[i]);
        selectedMap[selectedItems[i]] = true;
      }
      var objects = nbox.getObjects();
      // Process category nodes
      if (DvtNBoxDataUtils.getGrouping(nbox)) {
        for (var i = 0; i < objects.length; i++) {
          if (objects[i] instanceof DvtNBoxCategoryNode) {
            var data = objects[i].getData();
            var nodeIndices = data['nodeIndices'];
            var selected = true;
            for (var j = 0; j < nodeIndices.length; j++) {
              var node = DvtNBoxDataUtils.getNode(nbox, nodeIndices[j]);
              if (!selectedMap[node[DvtNBoxConstants.ID]]) {
                selected = false;
                break;
              }
            }
            if (selected) {
              selectedIds.push(objects[i].getId());
            }
          }
        }
      }
    }
    nbox.getSelectionHandler().processInitialSelections(selectedIds, objects);
  }
};


/**
 * Performs layout of group nodes within a cell
 *
 * @param {array} groups A map of groupId to an array of nodeIndices (only used for size)
 * @param {number} width The width of the cell childArea (used to determine aspect ratio)
 * @param {number} height The height of the cell childArea (used to determine aspect ratio)
 *
 * @return {object} An object containing two properties: 'positions' a map from group id to position and 'scale' which
 * indicates the maximum that these nodes can be scaled by while still fitting in the cell
 */
DvtNBoxRenderer._forceLayoutGroups = function(groups, width, height) {
  var sortedGroups = [];
  for (var group in groups) {
    sortedGroups.push(group);
  }
  sortedGroups.sort(function(a,b) {return DvtNBoxCategoryNode.compareSize(groups[a], groups[b])});
  var positions = {};
  // Initial Positions
  var thetaStep = 2 * Math.PI / sortedGroups.length;
  for (var i = 0; i < sortedGroups.length; i++) {
    var x = i * Math.cos(thetaStep * i);
    var y = i * Math.sin(thetaStep * i);
    positions[sortedGroups[i]] = DvtVectorUtils.createVector(x, y);
  }
  // Force iterations
  var alpha = 1;
  var alphaDecay = .98;
  var alphaLimit = .005;
  // Apply gravity inversely proportional to
  var xGravity = -.25 * height / Math.max(width, height);
  var yGravity = -.25 * width / Math.max(width, height);
  while (alpha > alphaLimit) {
    var displacement = {};
    for (var i = 0; i < sortedGroups.length; i++) {
      var iGroup = sortedGroups[i];
      var iPos = positions[iGroup];
      var iSize = groups[iGroup]['nodeIndices'].length;
      // Gravity
      displacement[iGroup] = DvtVectorUtils.createVector(alpha * xGravity * iPos.x, alpha * yGravity * iPos.y);
      for (var j = 0; j < sortedGroups.length; j++) {
        if (i != j) {
          // Repulsion
          var jGroup = sortedGroups[j];
          var jPos = positions[jGroup];
          var jSize = groups[jGroup]['nodeIndices'].length;
          var difference = DvtVectorUtils.subtractVectors(iPos, jPos);
          var distance = DvtVectorUtils.getMagnitude(difference);
          var angle = Math.atan2(difference.y, difference.x);
          // every PI/2 interval is the same, shift so that 0 < angle < PI/2
          while (angle < 0) {
            angle += Math.PI / 2;
          }
          while (angle >= Math.PI / 2) {
            angle -= Math.PI / 2;
          }
          var minimumDistance; // to avoid collision based upon the current angle
          if (angle < Math.PI / 4) {
            minimumDistance = .5 * (Math.sqrt(iSize) + Math.sqrt(jSize)) / Math.cos(angle);
          }
          else {
            minimumDistance = .5 * (Math.sqrt(iSize) + Math.sqrt(jSize)) / Math.sin(angle);
          }
          if (distance < minimumDistance) {
            // Shift the current node backwards (bigger nodes move proportionally less than smaller nodes)
            var repulsion = (jSize / (iSize + jSize)) * ((minimumDistance - distance) / distance);
            displacement[iGroup] = DvtVectorUtils.addVectors(displacement[iGroup], DvtVectorUtils.scaleVector(difference, (1 - alpha) * repulsion));
          }
        }
      }
    }
    // Apply displacement
    for (var i = 0; i < sortedGroups.length; i++) {
      var iGroup = sortedGroups[i];
      positions[iGroup] = DvtVectorUtils.addVectors(positions[iGroup], displacement[iGroup]);
    }
    alpha *= alphaDecay;
  }
  var left = Number.MAX_VALUE;
  var right = -Number.MAX_VALUE;
  var top = Number.MAX_VALUE;
  var bottom = -Number.MAX_VALUE;
  for (var i = 0; i < sortedGroups.length; i++) {
    var group = sortedGroups[i];
    var side = Math.sqrt(groups[group]['nodeIndices'].length);
    var position = positions[group];
    left = Math.min(left, position.x - side / 2);
    right = Math.max(right, position.x + side / 2);
    top = Math.min(top, position.y - side / 2);
    bottom = Math.max(bottom, position.y + side / 2);
  }
  var xScale = width / (right - left);
  var yScale = height / (bottom - top);
  var scale = Math.min(xScale, yScale);
  var cx = (left + right) / 2;
  var cy = (top + bottom) / 2;
  return {'scale': scale, 'center': new DvtPoint(cx, cy), 'positions': positions};
};


/**
 * Aggregates any groups that fall below the other threshold
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} groups a map of groups (may either represent groups across the entire nbox or within a single cell)
 * @return {object} a map of groups with any groups that fall below the other threshold aggregated into a single 'other' group
 */
DvtNBoxRenderer._processOtherThreshold = function(nbox, groups) {
  var nodeCount = DvtNBoxDataUtils.getNodeCount(nbox);
  var otherCount = DvtNBoxDataUtils.getOtherThreshold(nbox) * nodeCount;
  if (otherCount <= 1) {
    return groups;
  }
  var processedGroups = {};
  var otherGroup = {};
  var groupBehavior = DvtNBoxDataUtils.getGroupBehavior(nbox);
  if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
    for (var groupId in groups) {
      var group = groups[groupId];
      otherGroup['cell'] = group['cell'];
      break;
    }
  }
  otherGroup['id'] = 'other';
  otherGroup['nodeIndices'] = [];
  otherGroup['otherNode'] = true;
  for (var groupId in groups) {
    var group = groups[groupId];
    if (group['nodeIndices'].length < otherCount) {
      for (var i = 0; i < group['nodeIndices'].length; i++) {
        otherGroup['nodeIndices'].push(group['nodeIndices'][i]);
      }
    }
    else {
      processedGroups[groupId] = group;
    }
  }
  if (otherGroup['nodeIndices'].length > 0) {
    processedGroups['other'] = otherGroup;
  }
  return processedGroups;
};


/**
 * Renders the open group, if any
 * @param {DvtNBox} nbox The nbox being rendered.
 * @param {DvtContainer} container The container to render into.
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxRenderer._renderDrawer = function(nbox, container, availSpace) {
  var drawerData = DvtNBoxDataUtils.getDrawer(nbox);
  if (drawerData) {
    var categoryNode = DvtNBoxDataUtils.getCategoryNode(nbox, drawerData['id']);
    if (categoryNode) {
      var drawer = DvtNBoxDrawer.newInstance(nbox, drawerData);
      drawer.render(container, availSpace);
    }
    else {
      // Wwe have stale drawer data, null it out
      var options = nbox.getOptions();
      options[DvtNBoxConstants.DRAWER] = null;
      var event = new DvtSetPropertyEvent();
      event.addParam(DvtNBoxConstants.DRAWER, null);
      nbox.processEvent(event);
    }
  }
};


/**
 * Gets a matrix that can be used to reparent a displayable at the top level without changing its position
 *
 * @param {DvtDisplayable} displayable the displayable to be reparented
 * @return {DvtMatrix} a matrix that will maintain the child's position when reparented
 */
DvtNBoxRenderer.getGlobalMatrix = function(displayable) {
  var matrix = displayable.getMatrix().clone();
  var current = displayable.getParent();
  while (current) {
    var currentMatrix = current.getMatrix();
    matrix.translate(currentMatrix.getTx(), currentMatrix.getTy());
    current = current.getParent();
  }
  return matrix;
};


/**
 * Animates an update between NBox states
 *
 * @param {DvtNBoxDataAnimationHandler} animationHandler the animation handler
 * @param {object} oldNBox an object representing the old NBox state
 * @param {DvtNBox} newNBox the new NBox state
 */
DvtNBoxRenderer.animateUpdate = function(animationHandler, oldNBox, newNBox) {
  DvtNBoxRenderer._animateCells(animationHandler, oldNBox, newNBox);
  DvtNBoxRenderer._animateNodes(animationHandler, oldNBox, newNBox);
  var oldDrawer = DvtNBoxDataUtils.getDrawer(oldNBox);
  oldDrawer = oldDrawer ? oldDrawer['id'] : null;
  var newDrawer = DvtNBoxDataUtils.getDrawer(newNBox);
  newDrawer = newDrawer ? newDrawer['id'] : null;
  if (oldDrawer != newDrawer) {
    DvtNBoxRenderer._animateDrawer(animationHandler, oldNBox, newNBox);
  }
  //DvtNBoxRenderer._animateTitles(animationHandler, oldNBox, newNBox);
};


/**
 * Animates the cells on NBox update
 *
 * @param {DvtNBoxDataAnimationHandler} animationHandler the animation handler
 * @param {object} oldNBox an object representing the old NBox state
 * @param {DvtNBox} newNBox the new NBox state
 */
DvtNBoxRenderer._animateCells = function(animationHandler, oldNBox, newNBox) {
  var oldRowCount = DvtNBoxDataUtils.getRowCount(oldNBox);
  var newRowCount = DvtNBoxDataUtils.getRowCount(newNBox);
  var oldColumnCount = DvtNBoxDataUtils.getColumnCount(oldNBox);
  var newColumnCount = DvtNBoxDataUtils.getColumnCount(newNBox);
  var oldCellCount = oldRowCount * oldColumnCount;
  var newCellCount = newRowCount * newColumnCount;
  var oldCells = [];
  var newCells = [];
  for (var i = 0; i < oldCellCount; i++) {
    oldCells.push(DvtNBoxDataUtils.getDisplayable(oldNBox, DvtNBoxDataUtils.getCell(oldNBox, i)));
  }
  for (var i = 0; i < newCellCount; i++) {
    newCells.push(DvtNBoxDataUtils.getDisplayable(newNBox, DvtNBoxDataUtils.getCell(newNBox, i)));
  }
  if (oldRowCount == newRowCount && oldColumnCount == newColumnCount) {
    var identical = true;
    for (var i = 0; i < newRowCount; i++) {
      var oldRowValue = DvtNBoxDataUtils.getRow(oldNBox, i)[DvtNBoxConstants.ID];
      var newRowValue = DvtNBoxDataUtils.getRow(newNBox, i)[DvtNBoxConstants.ID];
      if (oldRowValue != newRowValue) {
        identical = false;
        break;
      }
    }
    if (identical) {
      for (var i = 0; i < newColumnCount; i++) {
        var oldColumnValue = DvtNBoxDataUtils.getColumn(oldNBox, i)[DvtNBoxConstants.ID];
        var newColumnValue = DvtNBoxDataUtils.getColumn(newNBox, i)[DvtNBoxConstants.ID];
        if (oldColumnValue != newColumnValue) {
          identical = false;
          break;
        }
      }
    }
    if (identical) {
      // Same set of cells, let them animate themselves
      animationHandler.constructAnimation(oldCells, newCells);
      return;
    }
  }
  // Different set of cells, fade out the old, fade in the new
  animationHandler.constructAnimation(oldCells, []);
  animationHandler.constructAnimation([], newCells);
};


/**
 * Animates the nodes on NBox update
 *
 * @param {DvtNBoxDataAnimationHandler} animationHandler the animation handler
 * @param {object} oldNBox an object representing the old NBox state
 * @param {DvtNBox} newNBox the new NBox state
 */
DvtNBoxRenderer._animateNodes = function(animationHandler, oldNBox, newNBox) {
  var oldNodeCount = DvtNBoxDataUtils.getNodeCount(oldNBox);
  var newNodeCount = DvtNBoxDataUtils.getNodeCount(newNBox);
  var oldNodes = [];
  var newNodes = [];
  for (var i = 0; i < oldNodeCount; i++) {
    oldNodes.push(DvtNBoxDataUtils.getDisplayable(oldNBox, DvtNBoxDataUtils.getNode(oldNBox, i)));
  }
  for (var i = 0; i < newNodeCount; i++) {
    newNodes.push(DvtNBoxDataUtils.getDisplayable(newNBox, DvtNBoxDataUtils.getNode(newNBox, i)));
  }
  animationHandler.constructAnimation(oldNodes, newNodes);

  var oldDrawer = DvtNBoxDataUtils.getDrawer(oldNBox);
  var newDrawer = DvtNBoxDataUtils.getDrawer(newNBox);
  // If drawer open, don't animate any category nodes since they will be covered by it
  if (!newDrawer) {
    var oldGroupNodes = DvtNBoxRenderer._getSortedGroups(oldNBox);
    var newGroupNodes = DvtNBoxRenderer._getSortedGroups(newNBox);

    // Drawer is closing
    if (oldDrawer) {
      // Cell is de-maximizing
      if (DvtNBoxDataUtils.getMaximizedCellIndex(oldNBox) != DvtNBoxDataUtils.getMaximizedCellIndex(newNBox)) {
        // Don't animate nodes in the maximized cell since those nodes were covered by drawer
        // Other nodes were not covered and should run animateInsert
        oldGroupNodes = oldGroupNodes.filter(function(node) {
          return node.getData()['cell'] != DvtNBoxDataUtils.getMaximizedCellIndex(oldNBox);
        });
        newGroupNodes = newGroupNodes.filter(function(node) {
          return node.getData()['cell'] != DvtNBoxDataUtils.getMaximizedCellIndex(oldNBox);
        });
      }
      // Don't animate any nodes since they were all covered by drawer
      else {
        oldGroupNodes = null;
        newGroupNodes = null;
      }
    }
    animationHandler.constructAnimation(oldGroupNodes, newGroupNodes);
  }

};


/**
 * Gets the list of DvtNBoxCategoryNodes (sorted by id)
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {array} the list of DvtNBoxCategoryNodes, sorted by id
 */
DvtNBoxRenderer._getSortedGroups = function(nbox) {
  var groupBehavior = DvtNBoxDataUtils.getGroupBehavior(nbox);
  var groupInfo = nbox.getOptions()['__groups'];
  var groupNodes = [];
  if (groupInfo) {
    if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
      var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
      var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
      var cellCount = rowCount * columnCount;
      for (var i = 0; i < cellCount; i++) {
        var cellGroups = groupInfo[i + ''];
        var cellGroupNodes = DvtNBoxRenderer._getSortedGroupsFromContainer(nbox, cellGroups);
        for (var j = 0; j < cellGroupNodes.length; j++) {
          groupNodes.push(cellGroupNodes[j]);
        }
      }
    }
    else {
      groupNodes = DvtNBoxRenderer._getSortedGroupsFromContainer(nbox, groupInfo);
    }
  }
  return groupNodes;
};


/**
 * Gets the list of DvtNBoxCategoryNodes (sorted by id) from a map of category node data
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} container a map of category node data
 * @return {array} the list of DvtNBoxCategoryNodes, sorted by id
 */
DvtNBoxRenderer._getSortedGroupsFromContainer = function(nbox, container) {
  var groupNodes = [];
  for (var id in container) {
    var displayable = DvtNBoxDataUtils.getDisplayable(nbox, container[id]);
    if (displayable) {
      groupNodes.push(displayable);
    }
  }
  groupNodes.sort(function(a,b) {var aId = a.getId(); var bId = b.getId(); return aId == bId ? 0 : (aId < bId ? -1 : 1)});
  return groupNodes;
};


/**
 * Animates the drawer on NBox update
 *
 * @param {DvtNBoxDataAnimationHandler} animationHandler the animation handler
 * @param {object} oldNBox an object representing the old NBox state
 * @param {DvtNBox} newNBox the new NBox state
 */
DvtNBoxRenderer._animateDrawer = function(animationHandler, oldNBox, newNBox) {
  var oldDrawer = DvtNBoxDataUtils.getDrawer(oldNBox);
  oldDrawer = oldDrawer ? [DvtNBoxDataUtils.getDisplayable(oldNBox, oldDrawer)] : null;
  var newDrawer = DvtNBoxDataUtils.getDrawer(newNBox);
  newDrawer = newDrawer ? [DvtNBoxDataUtils.getDisplayable(newNBox, newDrawer)] : [];

  animationHandler.constructAnimation(oldDrawer, newDrawer);
};


/**
 * Sets a fill (which may be a solid color or linear-gradient) on a displayable
 *
 * @param {DvtDisplayable} displaylable the displayable to fill
 * @param {string} fillString the string description of the fill
 */
DvtNBoxRenderer.setFill = function(displayable, fillString) {
  if (fillString.indexOf('linear-gradient') == 0) {
    var linearGradient = DvtGradientParser.parseCSSGradient(fillString);
    if (linearGradient) {
      displayable.setFill(new DvtLinearGradientFill(linearGradient.getAngle(),
                                                    linearGradient.getColors(),
                                                    linearGradient.getAlphas(),
                                                    linearGradient.getRatios()));
    }
  }
  else {
    // color
    displayable.setSolidFill(fillString);
  }
};


/**
 * Moves the legend (which is rendered first) to the top of the z order
 *
 * @param {DvtNBox} nbox the nbox component
 */
DvtNBoxRenderer._fixZOrder = function(nbox) {
  var legendData = DvtNBoxDataUtils.getLegend(nbox);
  if (legendData && legendData['sections']) {
    var panelDrawer = DvtNBoxDataUtils.getDisplayable(nbox, legendData, 'panelDrawer');
    if (panelDrawer) {
      panelDrawer.getParent().addChild(panelDrawer);
    }
  }
};
// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.


/**
 * Renderer for DvtNBoxCell.
 * @class
 */
var DvtNBoxCellRenderer = new Object();

DvtObj.createSubclass(DvtNBoxCellRenderer, DvtObj, 'DvtNBoxCellRenderer');


/**
 * Renders the nbox cell into the available space.
 * @param {DvtNBox} nbox The nbox component
 * @param {object} cellData The cell data being rendered
 * @param {DvtNBoxCell} cellContainer The container to render into
 * @param {object} cellLayout object containing properties related to cellLayout
 * @param {object} cellCounts Two keys ('highlighted' and 'total') which each map to an array of cell counts by cell index
 * @param {DvtRectangle} availSpace The available space
 */
DvtNBoxCellRenderer.render = function(nbox, cellData, cellContainer, cellLayout, cellCounts, availSpace) {
  var options = nbox.getOptions();
  var cellGap = options['__layout']['cellGap'];
  var cellStartGap = options['__layout']['cellStartGap'];
  var cellEndGap = options['__layout']['cellEndGap'];
  var cellTopGap = options['__layout']['cellTopGap'];
  var cellBottomGap = options['__layout']['cellBottomGap'];

  var r = DvtNBoxDataUtils.getRowIndex(nbox, cellData[DvtNBoxConstants.ROW]);
  var c = DvtNBoxDataUtils.getColumnIndex(nbox, cellData[DvtNBoxConstants.COLUMN]);

  var cellDims = DvtNBoxCellRenderer.getCellDimensions(nbox, r, c, cellLayout, availSpace);

  cellContainer.setTranslate(cellDims.x + cellGap / 2, cellDims.y + cellGap / 2);
  var cellIndex = r * DvtNBoxDataUtils.getColumnCount(nbox) + c; // cells are in sorted row-major order
  var cellRect = new DvtRect(nbox.getCtx(), 0, 0, Math.max(cellDims.w - cellGap, 0), Math.max(cellDims.h - cellGap, 0));
  cellRect.setPixelHinting(true);
  var style = DvtNBoxStyleUtils.getCellStyle(nbox, cellIndex);
  DvtNBoxCellRenderer._applyStyleToRect(cellRect, style);
  cellContainer.addChild(cellRect);
  DvtNBoxDataUtils.setDisplayable(nbox, cellData, cellRect, 'background');

  var keyboardFocusEffect = new DvtKeyboardFocusEffect(nbox.getCtx(), cellContainer, new DvtRectangle(-1, -1, cellRect.getWidth() + 2, cellRect.getHeight() + 2));
  DvtNBoxDataUtils.setDisplayable(nbox, cellData, keyboardFocusEffect, 'focusEffect');

  var addedHeader = DvtNBoxCellRenderer.renderHeader(nbox, cellData, cellContainer, cellCounts, false);

  var childContainer = DvtNBoxDataUtils.isCellMaximized(nbox, cellIndex) ?
      new DvtSimpleScrollableContainer(nbox.getCtx(), cellRect.getWidth(), cellRect.getHeight() - (addedHeader ? cellLayout['headerSize'] : 0)) :
      new DvtContainer(nbox.getCtx());

  cellContainer.addChild(childContainer);
  cellContainer.setChildContainer(childContainer);

  var childArea = null;
  if (addedHeader) {
    if (DvtNBoxCellRenderer._isLabelVertical(nbox, cellData)) {
      childArea = new DvtRectangle(cellLayout['headerSize'], cellTopGap, cellRect.getWidth() - cellLayout['headerSize'] - cellEndGap, cellRect.getHeight() - cellTopGap - cellBottomGap);
    }
    else {
      childArea = new DvtRectangle(cellStartGap, cellLayout['headerSize'], cellRect.getWidth() - cellStartGap - cellEndGap, cellRect.getHeight() - cellLayout['headerSize'] - cellBottomGap);
    }
    if (childContainer instanceof DvtSimpleScrollableContainer)
      childContainer.setTranslate(0, cellLayout['headerSize']);
  }
  else {
    childArea = new DvtRectangle(cellStartGap, cellTopGap, cellRect.getWidth() - cellStartGap - cellEndGap, cellRect.getHeight() - cellTopGap - cellBottomGap);
  }
  childArea.w = Math.max(childArea.w, 0);
  childArea.h = Math.max(childArea.h, 0);
  cellData['__childArea'] = childArea;
};


/**
 * Renders the nbox cell header
 * @param {DvtNBox} nbox The nbox components
 * @param {object} cellData The cell data
 * @param {DvtNBoxCell} cellContainer The container to render into.
 * @param {object} cellCounts Two keys ('highlighted' and 'total') which each map to an array of cell counts by cell index
 * @param {boolean} noCount Indicates whether the count label should be suppressed
 * @return {boolean} true if a header was rendered, false otherwise
 */
DvtNBoxCellRenderer.renderHeader = function(nbox, cellData, cellContainer, cellCounts, noCount) {
  var oldLabel = DvtNBoxDataUtils.getDisplayable(nbox, cellData, DvtNBoxConstants.LABEL);
  if (oldLabel) {
    oldLabel.getParent().removeChild(oldLabel);
    DvtNBoxDataUtils.setDisplayable(nbox, cellData, null, DvtNBoxConstants.LABEL);
  }
  var oldCountLabel = DvtNBoxDataUtils.getDisplayable(nbox, cellData, 'countLabel');
  if (oldCountLabel) {
    oldCountLabel.getParent().removeChild(oldCountLabel);
    DvtNBoxDataUtils.setDisplayable(nbox, cellData, null, 'countLabel');
  }
  var oldClose = DvtNBoxDataUtils.getDisplayable(nbox, cellData, 'closeButton');
  if (oldClose) {
    oldClose.getParent().removeChild(oldClose);
    DvtNBoxDataUtils.setDisplayable(nbox, cellData, null, 'closeButton');
  }
  var addedHeader = false;
  if (cellData) {
    var options = nbox.getOptions();
    var countLabelGap = options['__layout']['countLabelGap'];
    var cellCloseGap = options['__layout']['cellCloseGap'];
    var cellStartGap = options['__layout']['cellStartGap'];
    var cellEndGap = options['__layout']['cellEndGap'];
    var cellTopGap = options['__layout']['cellTopGap'];
    var cellLayout = options['__layout']['__cellLayout'];

    var cellRect = DvtNBoxDataUtils.getDisplayable(nbox, cellData, 'background');

    var r = DvtNBoxDataUtils.getRowIndex(nbox, cellData[DvtNBoxConstants.ROW]);
    var c = DvtNBoxDataUtils.getColumnIndex(nbox, cellData[DvtNBoxConstants.COLUMN]);
    var cellIndex = r * DvtNBoxDataUtils.getColumnCount(nbox) + c; // cells are in sorted row-major order

    var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

    var cellCloseWidthWithGap = 0;
    if (DvtNBoxDataUtils.isCellMaximized(nbox, cellIndex)) {
      var closeEna = options['_resources']['close_ena'];
      var closeWidth = closeEna['width'];
      if (cellRect.getWidth() - cellStartGap - cellEndGap > closeWidth) {
        var closeOvr = options['_resources']['close_ovr'];
        var closeDwn = options['_resources']['close_dwn'];
        var closeEnaImg = new DvtImage(nbox.getCtx(), closeEna['src'], 0, 0, closeEna['width'], closeEna['height']);
        var closeOvrImg = new DvtImage(nbox.getCtx(), closeOvr['src'], 0, 0, closeOvr['width'], closeOvr['height']);
        var closeDwnImg = new DvtImage(nbox.getCtx(), closeDwn['src'], 0, 0, closeDwn['width'], closeDwn['height']);
        var closeButton = new DvtButton(nbox.getCtx(), closeEnaImg, closeOvrImg, closeDwnImg, null, null, cellContainer.handleDoubleClick, cellContainer);

        // Center/hide close button if cell too thin for normal rendering
        var closeButtonX = rtl ? Math.min((cellRect.getWidth() - closeWidth) / 2, cellEndGap) : Math.max((cellRect.getWidth() - closeWidth) / 2, cellRect.getWidth() - cellEndGap - closeWidth);
        closeButton.setTranslate(closeButtonX,
                                 cellTopGap);
        cellContainer.addChild(closeButton);
        cellCloseWidthWithGap = closeWidth + cellCloseGap;
        DvtNBoxDataUtils.setDisplayable(nbox, cellData, closeButton, 'closeButton');
        addedHeader = true;
      }
    }
    if (cellData[DvtNBoxConstants.LABEL]) {
      var labelHeight = cellLayout['labelHeight'];
      var skipLabel = false;
      var halign = DvtNBoxStyleUtils.getLabelHalign(nbox, cellData);
      var countLabelWidth = 0;
      var countLabelWidthWithGap = 0;
      var countLabel = null;
      var countLabelX = 0;
      var countLabelY = 0;
      var countText = null;
      var showCount = DvtNBoxStyleUtils.getCellShowCount(nbox, cellData);
      var cellCountLabel = cellData['countLabel'];
      if (!noCount) {
        if (cellCountLabel && showCount != 'off') {
          countText = cellCountLabel;
        }
        else if (showCount == 'on') {
          countText = '' + cellCounts['total'][cellIndex];
          if (cellCounts['highlighted']) {
            countText = DvtBundle.getTranslatedString(DvtBundle.NBOX_PREFIX, 'HIGHLIGHTED_COUNT', [cellCounts['highlighted'][cellIndex], countText]);
          }
        }
      }
      if (DvtNBoxCellRenderer._isLabelVertical(nbox, cellData)) {
        // Vertical Label
        if (countText) {
          countLabel = DvtNBoxRenderer.createText(nbox.getCtx(), countText, DvtNBoxStyleUtils.getCellCountLabelStyle(nbox), DvtOutputText.H_ALIGN_CENTER, DvtOutputText.V_ALIGN_MIDDLE);
          if (DvtTextUtils.fitText(countLabel, cellRect.getHeight() - cellStartGap - cellEndGap, cellRect.getWidth() - 2 * cellTopGap, cellContainer)) {
            DvtNBoxDataUtils.setDisplayable(nbox, cellData, countLabel, 'countLabel');
            addedHeader = true;
            countLabelWidth = countLabel.getDimensions().w;
            countLabelWidthWithGap = countLabelWidth + countLabelGap;
            // Count label will get offset after rendering the cell label
            countLabelY = cellRect.getHeight() / 2;
            countLabelX = cellTopGap + labelHeight / 2;
          }
          else {
            skipLabel = true;
          }
        }
        var countLabelOffset = 0;
        if (!skipLabel) {
          var label = DvtNBoxRenderer.createText(nbox.getCtx(), cellData[DvtNBoxConstants.LABEL], DvtNBoxStyleUtils.getCellLabelStyle(nbox, cellIndex), DvtOutputText.H_ALIGN_CENTER, DvtOutputText.V_ALIGN_MIDDLE);
          if (DvtTextUtils.fitText(label, cellRect.getHeight() - cellStartGap - cellEndGap - countLabelWidthWithGap, cellRect.getWidth() - 2 * cellTopGap, cellContainer)) {
            DvtNBoxDataUtils.setDisplayable(nbox, cellData, label, DvtNBoxConstants.LABEL);
            var labelWidth = label.getDimensions().w;
            addedHeader = true;
            DvtNBoxRenderer.positionText(label, cellTopGap + labelHeight / 2, (cellRect.getHeight() + countLabelWidthWithGap) / 2, rtl ? Math.PI / 2 : -Math.PI / 2);
            countLabelOffset = (labelWidth + countLabelGap) / 2;
          }
        }
        if (countLabel) {
          countLabelY -= countLabelOffset;
          DvtNBoxRenderer.positionText(countLabel, countLabelX, countLabelY, rtl ? Math.PI / 2 : -Math.PI / 2);
        }
      }
      else {
        if (countText) {
          countLabel = DvtNBoxRenderer.createText(nbox.getCtx(), countText, DvtNBoxStyleUtils.getCellCountLabelStyle(nbox), halign, DvtOutputText.V_ALIGN_MIDDLE);
          if (DvtTextUtils.fitText(countLabel, cellRect.getWidth() - cellStartGap - cellEndGap - cellCloseWidthWithGap, cellRect.getHeight() - 2 * cellTopGap, cellContainer)) {
            DvtNBoxDataUtils.setDisplayable(nbox, cellData, countLabel, 'countLabel');
            addedHeader = true;
            countLabelWidth = countLabel.getDimensions().w;
            countLabelWidthWithGap = countLabelWidth + countLabelGap;
            // Count label will get offset after rendering the cell label
            if (halign == DvtOutputText.H_ALIGN_CENTER) {
              countLabelX = cellRect.getWidth() / 2;
            }
            else if (halign == DvtOutputText.H_ALIGN_RIGHT) {
              countLabelX = cellRect.getWidth() - cellEndGap;
            }
            else { // halign == DvtOutputText.H_ALIGN_LEFT
              countLabelX = cellStartGap;
            }
            countLabelY = cellTopGap + labelHeight / 2;
            DvtNBoxRenderer.positionText(countLabel, countLabelX, countLabelY);
          }
          else {
            skipLabel = true;
          }
        }
        var countLabelOffset = 0;
        if (!skipLabel) {

          var label = DvtNBoxRenderer.createText(nbox.getCtx(), cellData[DvtNBoxConstants.LABEL], DvtNBoxStyleUtils.getCellLabelStyle(nbox, cellIndex), halign, DvtOutputText.V_ALIGN_MIDDLE);
          if (DvtTextUtils.fitText(label, cellRect.getWidth() - cellStartGap - cellEndGap - cellCloseWidthWithGap - countLabelWidthWithGap, cellRect.getHeight() - 2 * cellTopGap, cellContainer)) {
            DvtNBoxDataUtils.setDisplayable(nbox, cellData, label, DvtNBoxConstants.LABEL);
            var labelWidth = label.getDimensions().w;
            addedHeader = true;
            var labelX;
            if (halign == DvtOutputText.H_ALIGN_CENTER) {
              labelX = (cellRect.getWidth() - (rtl ? -1 : 1) * countLabelWidthWithGap) / 2;
              countLabelOffset = (rtl ? -1 : 1) * (labelWidth + countLabelGap) / 2;
            }
            else if (halign == DvtOutputText.H_ALIGN_RIGHT) {
              labelX = cellRect.getWidth() - cellEndGap - (rtl ? 0 : 1) * countLabelWidthWithGap;
              countLabelOffset = (rtl ? -1 : 0) * (labelWidth + countLabelGap);
            }
            else { // halign == DvtOutputText.H_ALIGN_LEFT
              labelX = cellStartGap + (rtl ? 1 : 0) * countLabelWidthWithGap;
              countLabelOffset = (rtl ? 0 : 1) * (labelWidth + countLabelGap);
            }
            var labelY = cellTopGap + labelHeight / 2;
            DvtNBoxRenderer.positionText(label, labelX, labelY);
          }
        }
        if (countLabel && countLabelOffset) {
          DvtNBoxRenderer.positionText(countLabel, countLabelX + countLabelOffset, countLabelY);
        }
      }
    }
  }
  DvtNBoxCellRenderer._addAccessibilityAttributes(nbox, cellData, cellContainer);
  return addedHeader;
};


/**
 * Renders the body countLabels for the specified cells
 * @param {DvtNBox} nbox The nbox components
 * @param {object} cellCounts Two keys ('highlighted' and 'total') which each map to an array of cell counts by cell index
 * @param {array} cellIndices The indices of the cells
 */
DvtNBoxCellRenderer.renderBodyCountLabels = function(nbox, cellCounts, cellIndices) {

  var cellLayout = DvtNBoxCellRenderer.calculateCellLayout(nbox, cellCounts);
  var cellTopGap = nbox.getOptions()['__layout']['cellTopGap'];
  var cellStartGap = nbox.getOptions()['__layout']['cellStartGap'];

  var headerFontSize = Number.MAX_VALUE;
  var removeHeaders = false;

  // calculate header font sizes
  var cellData = DvtNBoxDataUtils.getCell(nbox, cellIndices[0]);
  var headerLabel = DvtNBoxDataUtils.getDisplayable(nbox, cellData, DvtNBoxConstants.LABEL);
  var headerCount = DvtNBoxDataUtils.getDisplayable(nbox, cellData, 'countLabel');
  var headerLabelSize = headerLabel && headerLabel.getCSSStyle() ? headerLabel.getCSSStyle().getFontSize() : null;
  var headerCountSize = headerCount && headerCount.getCSSStyle() ? headerCount.getCSSStyle().getFontSize() : null;
  // parse out 'px'
  headerLabelSize = isNaN(headerLabelSize) ? parseFloat(headerLabelSize) : headerLabelSize;
  headerCountSize = isNaN(headerCountSize) ? parseFloat(headerCountSize) : headerCountSize;
  if (!isNaN(headerLabelSize) || !isNaN(headerCountSize))
    headerFontSize = isNaN(headerLabelSize) ? headerCountSize : (isNaN(headerCountSize) ? headerLabelSize : Math.max(headerLabelSize, headerCountSize));

  // Separate maximized cells from minimized. If maximizedRow and maximizedColumn are unset,
  // all indices will be placed into maximizedCellIndices.
  var maximizedCellIndices = [];
  var minimizedCellIndices = [];
  for (var i = 0; i < cellIndices.length; i++) {
    cellIndex = cellIndices[i];
    DvtNBoxDataUtils.isCellMinimized(nbox, cellIndex) ? minimizedCellIndices.push(cellIndex) : maximizedCellIndices.push(cellIndex);
  }

  // create labels
  var maximizedLabels = [];
  var minimizedLabels = [];
  for (var i = 0; i < maximizedCellIndices.length; i++) {
    var cellIndex = maximizedCellIndices[i];
    var count = cellCounts['total'][cellIndex];
    maximizedLabels[i] = DvtNBoxRenderer.createText(nbox.getCtx(), '' + count, DvtNBoxStyleUtils.getCellBodyCountLabelStyle(nbox), DvtOutputText.H_ALIGN_CENTER, DvtOutputText.V_ALIGN_MIDDLE);
  }
  for (var i = 0; i < minimizedCellIndices.length; i++) {
    var cellIndex = minimizedCellIndices[i];
    var count = cellCounts['total'][cellIndex];
    minimizedLabels[i] = DvtNBoxRenderer.createText(nbox.getCtx(), '' + count, DvtNBoxStyleUtils.getCellBodyCountLabelStyle(nbox), DvtOutputText.H_ALIGN_CENTER, DvtOutputText.V_ALIGN_MIDDLE);
  }

  // remove headers if either of the following:
  // 1) calculated body countLabel font size is less than header font size
  // 2) count is the only thing in the cell header (no label)
  var maximizedFontSize = DvtNBoxCellRenderer.getBodyCountLabelsFontSize(nbox, cellCounts, maximizedCellIndices, maximizedLabels);
  if (maximizedFontSize <= headerFontSize || (headerCount && !headerLabel)) {
    removeHeaders = true;
  }
  var minimizedFontSize = DvtNBoxCellRenderer.getBodyCountLabelsFontSize(nbox, cellCounts, minimizedCellIndices, minimizedLabels);
  if (minimizedFontSize <= headerFontSize || (headerCount && !headerLabel)) {
    removeHeaders = true;
  }

  if (removeHeaders) {
    for (var i = 0; i < cellIndices.length; i++) {
      cellData = DvtNBoxDataUtils.getCell(nbox, cellIndices[i]);
      headerLabel = DvtNBoxDataUtils.getDisplayable(nbox, cellData, DvtNBoxConstants.LABEL);
      headerCount = DvtNBoxDataUtils.getDisplayable(nbox, cellData, 'countLabel');
      var childArea = cellData['__childArea'];
      var headerRemoved = false;
      if (headerLabel) {
        headerLabel.getParent().removeChild(headerLabel);
        DvtNBoxDataUtils.setDisplayable(nbox, cellData, null, DvtNBoxConstants.LABEL);
        headerRemoved = true;
      }
      if (headerCount) {
        headerCount.getParent().removeChild(headerCount);
        DvtNBoxDataUtils.setDisplayable(nbox, cellData, null, 'countLabel');
        headerRemoved = true;
      }
      // reallocate header space to childArea if a header element has been removed
      if (headerRemoved) {
        if (DvtNBoxCellRenderer._isLabelVertical(nbox, cellData)) {
          childArea.x -= (cellLayout['headerSize'] - cellStartGap);
          childArea.w += (cellLayout['headerSize'] - cellStartGap);
        }
        else {
          childArea.y -= (cellLayout['headerSize'] - cellTopGap);
          childArea.h += (cellLayout['headerSize'] - cellTopGap);
        }
        cellData['__childArea'] = childArea;
      }
    }

    // recalculate font sizes
    maximizedFontSize = DvtNBoxCellRenderer.getBodyCountLabelsFontSize(nbox, cellCounts, maximizedCellIndices, maximizedLabels);
    minimizedFontSize = DvtNBoxCellRenderer.getBodyCountLabelsFontSize(nbox, cellCounts, minimizedCellIndices, minimizedLabels);
  }

  for (var i = 0; i < maximizedCellIndices.length; i++) {
    cellIndex = maximizedCellIndices[i];
    cellData = DvtNBoxDataUtils.getCell(nbox, cellIndex);
    var cellContainer = DvtNBoxDataUtils.getDisplayable(nbox, cellData);
    var childArea = cellData['__childArea'];

    maximizedLabels[i].setFontSize(maximizedFontSize);
    if (DvtTextUtils.fitText(maximizedLabels[i], childArea.w, childArea.h, cellContainer)) {
      if (!removeHeaders)
        DvtNBoxCellRenderer.renderHeader(nbox, cellData, cellContainer, cellCounts, true);
      DvtNBoxRenderer.positionText(maximizedLabels[i], childArea.x + childArea.w / 2, childArea.y + childArea.h / 2);
    }
  }
  for (var i = 0; i < minimizedCellIndices.length; i++) {
    cellIndex = minimizedCellIndices[i];
    cellData = DvtNBoxDataUtils.getCell(nbox, cellIndex);
    var cellContainer = DvtNBoxDataUtils.getDisplayable(nbox, cellData);
    var childArea = cellData['__childArea'];

    minimizedLabels[i].setFontSize(minimizedFontSize);
    if (DvtTextUtils.fitText(minimizedLabels[i], childArea.w, childArea.h, cellContainer)) {
      if (!removeHeaders)
        DvtNBoxCellRenderer.renderHeader(nbox, cellData, cellContainer, cellCounts, true);
      DvtNBoxRenderer.positionText(minimizedLabels[i], childArea.x + childArea.w / 2, childArea.y + childArea.h / 2);
    }
  }
};


/**
 * Calculate thes font size for the body countLabels for the specified cells
 * @param {DvtNBox} nbox The nbox components
 * @param {object} cellCounts Two keys ('highlighted' and 'total') which each map to an array of cell counts by cell index
 * @param {array} cellIndices The indices of the cells
 * @param {array} labels The body countLabels for the specified cells
 * @return {number} computed font size of body countLabels
 */
DvtNBoxCellRenderer.getBodyCountLabelsFontSize = function(nbox, cellCounts, cellIndices, labels) {
  var fontSize = Number.MAX_VALUE;
  for (var i = 0; i < cellIndices.length; i++) {
    var childArea = DvtNBoxDataUtils.getCell(nbox, cellIndices[i])['__childArea'];
    fontSize = Math.min(fontSize, labels[i].getOptimalFontSize(childArea));
  }
  return fontSize;
};


/**
 * Gets whether the labels for the specified cell should be rendered vertically
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} cellData the cell data
 * @return whether the labels for the specified cell should be rendered vertically
 */
DvtNBoxCellRenderer._isLabelVertical = function(nbox, cellData) {
  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(nbox);
  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(nbox);
  return ((maximizedColumn && maximizedColumn != cellData[DvtNBoxConstants.COLUMN]) && (!maximizedRow || (maximizedRow == cellData[DvtNBoxConstants.ROW]))) ? true : false;
};


/**
 * Calculates the dimensions for the specified cell
 *
 * @param {DvtNBox} nbox The nbox components
 * @param {number} rowIndex the row index of the specified cell
 * @param {number} columnIndex the column index of the specified cell
 * @param {object} cellLayout object containing properties related to cellLayout
 * @param {DvtRectangle} availSpace The available space.
 *
 * @return {DvtRectangle} the dimensions for the specified cell
 */
DvtNBoxCellRenderer.getCellDimensions = function(nbox, rowIndex, columnIndex, cellLayout, availSpace) {
  var options = nbox.getOptions();
  var cellGap = options['__layout']['cellGap'];

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

  var minimizedSize = cellGap + cellLayout['minimumCellSize'];
  var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
  var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
  var defaultRowDimensions = DvtNBoxRenderer.getRowDimensions(nbox, rowIndex, availSpace);
  var defaultColumnDimensions = DvtNBoxRenderer.getColumnDimensions(nbox, columnIndex, availSpace);
  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(nbox);
  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(nbox);

  var columnX = defaultColumnDimensions.x;
  var rowY = defaultRowDimensions.y;
  var columnW = defaultColumnDimensions.w;
  var rowH = defaultRowDimensions.h;

  var processColumn = true;

  if (maximizedRow) {
    var maximizedRowIndex = DvtNBoxDataUtils.getRowIndex(nbox, maximizedRow);

    // Ensure maximized row takes at least 2/3 of available height.  Split remaining height across minimized rows.
    // minimizedRowSize * number of minimized rows will be at most 1/3 available height.
    var minimizedRowSize = Math.min(availSpace.h / (3 * (rowCount - 1)) , minimizedSize);

    if (rowIndex < maximizedRowIndex) {
      rowY = availSpace.y + availSpace.h - (rowIndex + 1) * minimizedRowSize;
      rowH = minimizedRowSize;
      processColumn = false;
    }
    else if (rowIndex == maximizedRowIndex) {
      rowY = availSpace.y + (rowCount - rowIndex - 1) * minimizedRowSize;
      rowH = availSpace.h - (rowCount - 1) * minimizedRowSize;
    }
    else { // rowIndex > maximizedRowIndex
      rowY = availSpace.y + (rowCount - rowIndex - 1) * minimizedRowSize;
      rowH = minimizedRowSize;
      processColumn = false;
    }
  }

  if (maximizedColumn && processColumn) {
    var maximizedColumnIndex = DvtNBoxDataUtils.getColumnIndex(nbox, maximizedColumn);

    // Ensure maximized column takes at least 2/3 of available width.  Split remaining width across minimized columns.
    // minimizedColumnSize * number of minimized columns will be at most 1/3 available width.
    var minimizedColumnSize = Math.min(availSpace.w / (3 * (columnCount - 1)) , minimizedSize);
    if (columnIndex < maximizedColumnIndex) {
      columnW = minimizedColumnSize;
      columnX = availSpace.x + (rtl ? availSpace.w - minimizedColumnSize : 0) + (rtl ? -1 : 1) * columnIndex * minimizedColumnSize;
    }
    else if (columnIndex == maximizedColumnIndex) {
      columnW = availSpace.w - (columnCount - 1) * minimizedColumnSize;
      columnX = availSpace.x + (rtl ? availSpace.w - columnW : 0) + (rtl ? -1 : 1) * columnIndex * minimizedColumnSize;
    }
    else { // columnIndex > maximizedColumnIndex
      columnW = minimizedColumnSize;
      columnX = availSpace.x + (rtl ? -minimizedColumnSize : availSpace.w) + (rtl ? 1 : -1) * (columnCount - columnIndex) * minimizedColumnSize;
    }
  }
  return new DvtRectangle(columnX, rowY, columnW, rowH);
};


/**
 * Calculates sizes related to cell layout, based upon the first specified cell
 * (Assumes that the cells are specified homogeneously)
 * @param {DvtNBox} nbox the nbox component
 * @param {object} cellCounts Two keys ('highlighted' and 'total') which each map to an array of cell counts by cell index
 * @return {object} an object containing the calculated sizes
 */
DvtNBoxCellRenderer.calculateCellLayout = function(nbox, cellCounts) {
  var options = nbox.getOptions();
  var cellTopGap = options['__layout']['cellTopGap'];
  var cellBottomGap = options['__layout']['cellBottomGap'];
  var cellLabelGap = options['__layout']['cellLabelGap'];
  var minimumCellSize = options['__layout']['minimumCellSize'];
  var labelHeight = 0;
  var cellData = DvtNBoxDataUtils.getCell(nbox, 0);
  if (cellData && cellData[DvtNBoxConstants.LABEL]) {
    var halign = cellData[DvtNBoxConstants.LABEL_HALIGN];
    var label = DvtNBoxRenderer.createText(nbox.getCtx(), cellData[DvtNBoxConstants.LABEL], DvtNBoxStyleUtils.getCellLabelStyle(nbox, 0), halign, DvtOutputText.V_ALIGN_MIDDLE);
    labelHeight = DvtTextUtils.guessTextDimensions(label).h;
    if (DvtNBoxStyleUtils.getCellShowCount(nbox, cellData) == 'on') {
      var count = DvtNBoxRenderer.createText(nbox.getCtx(), cellCounts['total'][0], DvtNBoxStyleUtils.getCellCountLabelStyle(nbox), halign, DvtOutputText.V_ALIGN_MIDDLE);
      var countLabelHeight = DvtTextUtils.guessTextDimensions(count).h;
      labelHeight = Math.max(labelHeight, countLabelHeight);
    }
  }
  if (DvtNBoxDataUtils.getMaximizedRow(nbox) && DvtNBoxDataUtils.getMaximizedColumn(nbox)) {
    labelHeight = Math.max(labelHeight, options['_resources']['close_ena']['height']);
  }

  var minimizedHeaderSize = labelHeight + cellTopGap + cellBottomGap;
  var headerSize = labelHeight + cellTopGap + cellLabelGap;
  minimumCellSize = Math.max(minimizedHeaderSize, minimumCellSize);
  var cellLayout = {'labelHeight': labelHeight, 'headerSize': headerSize, 'minimizedHeaderSize': minimizedHeaderSize, 'minimumCellSize': minimumCellSize};
  options['__layout']['__cellLayout'] = cellLayout;
  return cellLayout;
};


/**
 * @override
 */
DvtNBoxCellRenderer.animateUpdate = function(animationHandler, oldCell, newCell) {
  var oldNBox = animationHandler.getOldNBox();
  var newNBox = animationHandler.getNewNBox();
  var playable = new DvtCustomAnimation(newNBox.getCtx(), newCell, animationHandler.getAnimationDuration());

  // Promote the child container first so that nodes that position themselves correctly
  var childContainer = newCell.getChildContainer();
  var childMatrix = childContainer.getMatrix();
  childContainer.setMatrix(DvtNBoxRenderer.getGlobalMatrix(childContainer));
  var cellParent = newCell.getParent();
  cellParent.addChildAt(childContainer, cellParent.getChildIndex(newCell) + 1);

  // Grab cell translation
  var cellTx = newCell.getTranslateX();
  var cellTy = newCell.getTranslateY();

  // Position
  playable.getAnimator().addProp(DvtAnimator.TYPE_MATRIX, newCell, newCell.getMatrix, newCell.setMatrix, newCell.getMatrix());
  newCell.setMatrix(oldCell.getMatrix());

  // Background
  var oldBackground = DvtNBoxDataUtils.getDisplayable(oldNBox, oldCell.getData(), 'background');
  var newBackground = DvtNBoxDataUtils.getDisplayable(newNBox, newCell.getData(), 'background');

  var rtl = DvtAgent.isRightToLeft(newNBox.getCtx());
  var widthDiff = rtl ? 0 : newBackground.getWidth() - oldBackground.getWidth();

  playable.getAnimator().addProp(DvtAnimator.TYPE_FILL, newBackground, newBackground.getFill, newBackground.setFill, newBackground.getFill());
  newBackground.setFill(oldBackground.getFill());
  playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, newBackground, newBackground.getWidth, newBackground.setWidth, newBackground.getWidth());
  newBackground.setWidth(oldBackground.getWidth());
  playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, newBackground, newBackground.getHeight, newBackground.setHeight, newBackground.getHeight());
  newBackground.setHeight(oldBackground.getHeight());


  // Keyboard focus effect
  if (newCell.isShowingKeyboardFocusEffect()) {
    var effect = DvtNBoxDataUtils.getDisplayable(newNBox, newCell.getData(), 'focusEffect').getEffect();
    if (effect) {
      playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, effect, effect.getWidth, effect.setWidth, effect.getWidth());
      effect.setWidth(oldBackground.getWidth() + 2);
      playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, effect, effect.getHeight, effect.setHeight, effect.getHeight());
      effect.setHeight(oldBackground.getHeight() + 2);
    }
  }

  // Labels
  DvtNBoxCellRenderer._animateLabels(animationHandler, oldCell, newCell, 'countLabel');
  DvtNBoxCellRenderer._animateLabels(animationHandler, oldCell, newCell, DvtNBoxConstants.LABEL);

  // Close button
  var oldClose = DvtNBoxDataUtils.getDisplayable(oldNBox, oldCell.getData(), 'closeButton');
  var newClose = DvtNBoxDataUtils.getDisplayable(newNBox, newCell.getData(), 'closeButton');
  if (oldClose) {
    if (newClose) {
      playable.getAnimator().addProp(DvtAnimator.TYPE_MATRIX, newClose, newClose.getMatrix, newClose.setMatrix, newClose.getMatrix());
      newClose.setMatrix(oldClose.getMatrix());
    }
    else {
      var oldCloseStart = DvtNBoxRenderer.getGlobalMatrix(oldClose);
      oldClose.setTranslate(oldClose.getTranslateX() + widthDiff + cellTx, oldClose.getTranslateY() + cellTy);

      animationHandler.add(new DvtAnimFadeOut(newNBox.getCtx(), oldClose, animationHandler.getAnimationDuration()), DvtNBoxDataAnimationHandler.UPDATE);
      playable.getAnimator().addProp(DvtAnimator.TYPE_MATRIX, oldClose, oldClose.getMatrix, oldClose.setMatrix, oldClose.getMatrix());
      oldClose.setMatrix(oldCloseStart);
      newNBox.getDeleteContainer().addChild(oldClose);
    }
  }
  else if (newClose) {
    animationHandler.add(new DvtAnimFadeIn(newNBox.getCtx(), newClose, animationHandler.getAnimationDuration()), DvtNBoxDataAnimationHandler.UPDATE);
    playable.getAnimator().addProp(DvtAnimator.TYPE_MATRIX, newClose, newClose.getMatrix, newClose.setMatrix, newClose.getMatrix());
    newClose.setTranslate(newClose.getTranslateX() - widthDiff, newClose.getTranslateY());
    newClose.setAlpha(0);

  }

  DvtPlayable.appendOnEnd(playable, function() {newCell.addChild(childContainer); childContainer.setMatrix(childMatrix)});
  animationHandler.add(playable, DvtNBoxDataAnimationHandler.UPDATE);
};

DvtNBoxCellRenderer._animateLabels = function(animationHandler, oldCell, newCell, labelKey) {
  var oldNBox = animationHandler.getOldNBox();
  var newNBox = animationHandler.getNewNBox();
  var oldLabel = DvtNBoxDataUtils.getDisplayable(oldNBox, oldCell.getData(), labelKey);
  var newLabel = DvtNBoxDataUtils.getDisplayable(newNBox, newCell.getData(), labelKey);
  var oldVerticalLabel = DvtNBoxCellRenderer._isLabelVertical(oldNBox, oldCell.getData());
  var newVerticalLabel = DvtNBoxCellRenderer._isLabelVertical(newNBox, newCell.getData());
  if (oldLabel || newLabel) {
    if (oldLabel && newLabel && (oldVerticalLabel == newVerticalLabel)) {
      var playable = new DvtCustomAnimation(newNBox.getCtx(), newLabel, animationHandler.getAnimationDuration());
      var oldAlign = oldLabel.getHorizAlignment();
      oldAlign = oldAlign == 'left' ? -1 : oldAlign == 'center' ? 0 : 1;
      var newAlign = newLabel.getHorizAlignment();
      newAlign = newAlign == 'left' ? -1 : newAlign == 'center' ? 0 : 1;
      var alignOffset = (newAlign - oldAlign) * newLabel.measureDimensions().w / 2;
      playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, newLabel, newLabel.getX, newLabel.setX, newLabel.getX());
      newLabel.setX(oldLabel.getX() + alignOffset);
      playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, newLabel, newLabel.getY, newLabel.setY, newLabel.getY());
      newLabel.setY(oldLabel.getY());
      playable.getAnimator().addProp(DvtAnimator.TYPE_MATRIX, newLabel, newLabel.getMatrix, newLabel.setMatrix, newLabel.getMatrix());
      newLabel.setMatrix(oldLabel.getMatrix());
      animationHandler.add(playable, DvtNBoxDataAnimationHandler.UPDATE);

      if (labelKey == 'countLabel' && oldLabel.getTextString() != newLabel.getTextString()) {
        newLabel.setAlpha(0);
        newCell.addChild(oldLabel);

        var fadeOutAnim = new DvtAnimFadeOut(newNBox.getCtx(), oldLabel, animationHandler.getAnimationDuration());
        var fadeInAnim = new DvtAnimFadeIn(newNBox.getCtx(), newLabel, animationHandler.getAnimationDuration());
        animationHandler.add(fadeOutAnim, DvtNBoxDataAnimationHandler.UPDATE);
        animationHandler.add(fadeInAnim, DvtNBoxDataAnimationHandler.INSERT);

        DvtPlayable.appendOnEnd(fadeOutAnim, function() {newNBox.getDeleteContainer().addChild(oldLabel)});
      }
    }
    else {
      if (oldLabel) {
        oldLabel.setMatrix(DvtNBoxRenderer.getGlobalMatrix(oldLabel));
        newNBox.getDeleteContainer().addChild(oldLabel);
        animationHandler.add(new DvtAnimFadeOut(newNBox.getCtx(), oldLabel, animationHandler.getAnimationDuration()), DvtNBoxDataAnimationHandler.UPDATE);
      }
      if (newLabel) {
        newLabel.setAlpha(0);
        animationHandler.add(new DvtAnimFadeIn(newNBox.getCtx(), newLabel, animationHandler.getAnimationDuration()), DvtNBoxDataAnimationHandler.UPDATE);
      }
    }
  }
};


/**
 * @override
 */
DvtNBoxCellRenderer.animateDelete = function(animationHandler, oldCell) {
  var nbox = animationHandler.getNewNBox();
  // Reparent the child container if any
  var childContainer = oldCell.getChildContainer();
  if (childContainer) {
    var globalMatrix = DvtNBoxRenderer.getGlobalMatrix(childContainer);
    var cellParent = oldCell.getParent();
    cellParent.addChildAt(childContainer, cellParent.getChildIndex(oldCell) + 1);
    childContainer.setMatrix(globalMatrix);
  }
  // Add the cell to the delete container and fade out
  nbox.getDeleteContainer().addChild(oldCell);
  animationHandler.add(new DvtAnimFadeOut(nbox.getCtx(), oldCell, animationHandler.getAnimationDuration()), DvtNBoxDataAnimationHandler.UPDATE);
};


/**
 * @override
 */
DvtNBoxCellRenderer.animateInsert = function(animationHandler, newCell) {
  var nbox = animationHandler.getNewNBox();
  // Reparent the child container if any
  var childContainer = newCell.getChildContainer();
  var childMatrix = null;
  if (childContainer) {
    childMatrix = childContainer.getMatrix();
    var globalMatrix = DvtNBoxRenderer.getGlobalMatrix(newCell);
    var cellParent = newCell.getParent();
    cellParent.addChildAt(childContainer, cellParent.getChildIndex(newCell) + 1);
    childContainer.setMatrix(globalMatrix);
  }
  // Fade in the cell
  newCell.setAlpha(0);
  var playable = new DvtAnimFadeIn(nbox.getCtx(), newCell, animationHandler.getAnimationDuration());
  if (childContainer) {
    DvtPlayable.appendOnEnd(playable, function() {newCell.addChild(childContainer); childContainer.setMatrix(childMatrix);});
  }
  animationHandler.add(playable, DvtNBoxDataAnimationHandler.UPDATE);
};


/**
 * Renders the drop site feedback for the specified cell
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {DvtNBoxCell} cell the cell
 * @return {DvtDisplayable} the drop site feedback
 */
DvtNBoxCellRenderer.renderDropSiteFeedback = function(nbox, cell) {
  var background = DvtNBoxDataUtils.getDisplayable(nbox, cell.getData(), 'background');
  var dropSiteFeedback = new DvtRect(nbox.getCtx(), background.getX(), background.getY(), background.getWidth(), background.getHeight());
  dropSiteFeedback.setPixelHinting(true);
  var style = DvtNBoxStyleUtils.getCellDropTargetStyle(nbox);
  DvtNBoxCellRenderer._applyStyleToRect(dropSiteFeedback, style);
  cell.addChildAt(dropSiteFeedback, cell.getChildIndex(background) + 1);
  return dropSiteFeedback;
};


/**
 * Applies CSS properties to a DvtRect (placed here to avoid changing the behavior of DvtRect.setCSSStyle)
 *
 * @param {DvtRect} rect the DvtRect
 * @param {DvtCSSStyle} style  the DvtCSSStyle
 */
DvtNBoxCellRenderer._applyStyleToRect = function(rect, style) {
  var bgFill = style.getStyle(DvtCSSStyle.BACKGROUND);
  var colorFill = style.getStyle(DvtCSSStyle.BACKGROUND_COLOR);
  var fill = bgFill ? bgFill : colorFill;
  if (fill) {
    DvtNBoxRenderer.setFill(rect, fill);
  }
  var borderStyle = style.getStyle(DvtCSSStyle.BORDER_STYLE);
  if (borderStyle == 'solid') {
    var borderColor = style.getStyle(DvtCSSStyle.BORDER_COLOR);
    borderColor = borderColor ? borderColor : '#000000';
    var borderWidth = style.getStyle(DvtCSSStyle.BORDER_WIDTH);
    borderWidth = borderWidth == null ? 1 : parseFloat(borderWidth);
    rect.setSolidStroke(borderColor, null, borderWidth);
  }
};


/**
 * @private
 * Adds accessibility attributes to the object
 * @param {DvtNBox} nbox The nbox component
 * @param {object} cellData the cell data
 * @param {DvtNBoxCell} cellContainer the object that should be updated with accessibility attributes
 */
DvtNBoxCellRenderer._addAccessibilityAttributes = function(nbox, cellData, cellContainer) {
  var object = DvtAgent.isTouchDevice() ? DvtNBoxDataUtils.getDisplayable(nbox, cellData, 'background') : cellContainer;
  object.setAriaRole('img');
  if (!DvtAgent.deferAriaCreation()) {
    var desc = cellContainer.getAriaLabel();
    if (desc)
      object.setAriaProperty(DvtNBoxConstants.LABEL, desc);
  }
};
// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.


/**
 * Renderer for DvtNBoxNode.
 * @class
 */
var DvtNBoxNodeRenderer = new Object();

DvtObj.createSubclass(DvtNBoxNodeRenderer, DvtObj, 'DvtNBoxNodeRenderer');


/**
 * Renders the nbox node.
 * @param {DvtNBox} nbox The nbox component
 * @param {object} nodeData the node data being rendered
 * @param {DvtNBoxNode} nodeContainer The container to render into.
 * @param {object} nodeLayout An object containing properties related to the sizes of the various node subsections
 */
DvtNBoxNodeRenderer.render = function(nbox, nodeData, nodeContainer, nodeLayout) {
  DvtNBoxNodeRenderer._renderNodeBackground(nbox, nodeData, nodeContainer, nodeLayout);
  DvtNBoxNodeRenderer._renderNodeIndicator(nbox, nodeData, nodeContainer, nodeLayout);
  DvtNBoxNodeRenderer._renderNodeIcon(nbox, nodeData, nodeContainer, nodeLayout);
  DvtNBoxNodeRenderer._renderNodeLabels(nbox, nodeData, nodeContainer, nodeLayout);
  DvtNBoxNodeRenderer._addAccessibilityAttributes(nbox, nodeContainer);
};


/**
 * Calculates sizes related to node layout, based upon the first specified node
 * (Assumes that the nodes are specified homogeneously)
 * @param {DvtNBox} nbox the nbox component
 * @param {object} cellNodes object containing node rendering order for each cell
 * @return {object} an object containing the calculated sizes
 */
DvtNBoxNodeRenderer.calculateNodeLayout = function(nbox, cellNodes) {
  var options = nbox.getOptions();
  var gridGap = options['__layout']['gridGap'];
  var nodeStartLabelGap = options['__layout']['nodeStartLabelGap'];
  var nodeLabelOnlyStartLabelGap = options['__layout']['nodeLabelOnlyStartLabelGap'];
  var nodeEndLabelGap = options['__layout']['nodeEndLabelGap'];
  var nodeSwatchSize = options['__layout']['nodeSwatchSize'];
  var maximumLabelWidth = options['__layout']['maximumLabelWidth'];

  var simpleLayout = DvtNBoxNodeRenderer._calculateSimpleNodeLayout(nbox);
  var nodeHeight = simpleLayout['nodeHeight'];
  var indicatorSectionWidth = simpleLayout['indicatorSectionWidth'];
  var iconSectionWidth = simpleLayout['iconSectionWidth'];
  var startLabelGap = (indicatorSectionWidth || iconSectionWidth) ? nodeStartLabelGap : nodeLabelOnlyStartLabelGap;

  var node = DvtNBoxDataUtils.getNode(nbox, 0);
  var indicatorIcon = DvtNBoxDataUtils.getIndicatorIcon(nbox, node);
  var icon = DvtNBoxDataUtils.getIcon(nbox, node);

  var labelSectionWidth = 0;
  var cellLayouts = [];
  var cellRows = 0;
  var cellColumns = 0;
  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(nbox);
  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(nbox);
  var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
  var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
  for (var r = 0; r < rowCount; r++) {
    for (var c = 0; c < columnCount; c++) {
      cellLayouts.push({'cellRows': 0, 'cellColumns': 0, 'overflow': false});
    }
  }
  var nodeCounts = [];
  var nodeCount = DvtNBoxDataUtils.getNodeCount(nbox);
  for (var i = 0; i < nodeCount; i++) {
    var n = DvtNBoxDataUtils.getNode(nbox, i);
    if (!DvtNBoxDataUtils.isNodeHidden(nbox, n)) {
      var nodeCellIndex = DvtNBoxDataUtils.getCellIndex(nbox, n);
      if (isNaN(nodeCounts[nodeCellIndex])) {
        nodeCounts[nodeCellIndex] = 0;
      }
      nodeCounts[nodeCellIndex]++;
    }
  }
  if (maximizedRow && maximizedColumn) {
    var maximizedCellIndex = DvtNBoxDataUtils.getColumnIndex(nbox, maximizedColumn) + columnCount * DvtNBoxDataUtils.getRowIndex(nbox, maximizedRow);
    var cellData = DvtNBoxDataUtils.getCell(nbox, maximizedCellIndex);
    var cellArea = cellData['__childArea'];

    labelSectionWidth = simpleLayout['labelSectionWidth'];
    if (labelSectionWidth == null) {
      if (options['labelTruncation'] != 'ifRequired') {
        labelSectionWidth = maximumLabelWidth + startLabelGap + nodeEndLabelGap;
      }
      else {
        var nodes = cellNodes[maximizedCellIndex];
        labelSectionWidth = Math.max(maximumLabelWidth, DvtNBoxNodeRenderer._getMaxLabelWidth(nbox, nodes)) + startLabelGap + nodeEndLabelGap;
      }
      labelSectionWidth = Math.min(labelSectionWidth, cellArea.w - indicatorSectionWidth - iconSectionWidth);
    }
    cellColumns = Math.floor((cellArea.w + gridGap) / (indicatorSectionWidth + iconSectionWidth + labelSectionWidth + gridGap));

    // check if labels are visible at calculated width
    if (node[DvtNBoxConstants.LABEL]) {
      // temp container for checking if labels are visible
      var container = new DvtContainer();
      var labelVisible = false;
      var label = DvtNBoxDataUtils.getNodeLabel(nbox, node);
      var labelHeight = DvtTextUtils.guessTextDimensions(label).h;
      if (DvtTextUtils.fitText(label, labelSectionWidth - startLabelGap - nodeEndLabelGap, labelHeight, container)) {
        labelVisible = true;
      }
      if (node[DvtNBoxConstants.SECONDARY_LABEL]) {
        var secondaryLabel = DvtNBoxDataUtils.getNodeSecondaryLabel(nbox, node);
        var secondaryLabelHeight = DvtTextUtils.guessTextDimensions(secondaryLabel).h;
        if (DvtTextUtils.fitText(secondaryLabel, labelSectionWidth - startLabelGap - nodeEndLabelGap, secondaryLabelHeight, container)) {
          labelVisible = true;
        }
      }
      if (!labelVisible) {
        labelSectionWidth = 0;
        if (node[DvtNBoxConstants.COLOR]) {
          if ((!indicatorIcon || DvtNBoxStyleUtils.getNodeIndicatorColor(nbox, node)) &&
              (!icon || icon[DvtNBoxConstants.SOURCE])) {
            // Swatch needed
            labelSectionWidth = Math.max(0, Math.min(nodeSwatchSize, cellArea.w - indicatorSectionWidth - iconSectionWidth));
          }
        }
      }
    }

    // calculate how much of the node indicator and node icon we have space for. limit if necessary
    if (cellArea.w - indicatorSectionWidth - iconSectionWidth < 0) {
      var iconWidth = iconSectionWidth;
      iconSectionWidth = Math.max(0, cellArea.w - indicatorSectionWidth);
    }
    if (cellArea.w - indicatorSectionWidth < 0) {
      indicatorSectionWidth = cellArea.w;
    }
    cellLayouts[maximizedCellIndex] = {'cellRows': -1, 'cellColumns': cellColumns, 'overflow': false};
  }
  else {
    // gather non-minimized cells
    var cellIndices = [];
    if (maximizedRow) {
      var maximizedRowIndex = DvtNBoxDataUtils.getRowIndex(nbox, maximizedRow);
      for (var c = 0; c < columnCount; c++) {
        cellIndices.push(c + maximizedRowIndex * columnCount);
      }
    }
    else if (maximizedColumn) {
      var maximizedColumnIndex = DvtNBoxDataUtils.getColumnIndex(nbox, maximizedColumn);
      for (var r = 0; r < rowCount; r++) {
        cellIndices.push(maximizedColumnIndex + r * columnCount);
      }
    }
    else {
      for (var i = 0; i < cellLayouts.length; i++) {
        cellIndices.push(i);
      }
    }

    // if node size is fixed, calculate cellRows and cellColumns
    if (simpleLayout['labelSectionWidth'] != null) {
      labelSectionWidth = simpleLayout['labelSectionWidth'];
      var cell = DvtNBoxDataUtils.getCell(nbox, cellIndices[0]);
      var cellArea = cell['__childArea'];
      cellRows = Math.floor((cellArea.h + gridGap) / (nodeHeight + gridGap));
      cellColumns = Math.floor((cellArea.w + gridGap) / (indicatorSectionWidth + iconSectionWidth + labelSectionWidth + gridGap));
    }
    else {
      var maxCellIndex = 0;
      // find most populated non-minimized cell to calculate node size
      for (var ci = 0; ci < cellIndices.length; ci++) {
        if (!isNaN(nodeCounts[cellIndices[ci]]) && nodeCounts[cellIndices[ci]] > nodeCounts[maxCellIndex]) {
          maxCellIndex = cellIndices[ci];
        }
      }
      if (options['labelTruncation'] != 'ifRequired') {

        var cell = DvtNBoxDataUtils.getCell(nbox, maxCellIndex);
        var cellArea = cell['__childArea'];
        var maxRows = Math.floor((cellArea.h + gridGap) / (nodeHeight + gridGap));
        var maxColumns = Math.floor((cellArea.w + gridGap) / (indicatorSectionWidth + iconSectionWidth + options['__layout']['minimumLabelWidth'] + startLabelGap + nodeEndLabelGap + gridGap));
        if (maxRows * maxColumns < nodeCounts[maxCellIndex]) {
          labelSectionWidth = Math.floor(Math.min(options['__layout']['maximumLabelWidth'] + startLabelGap + nodeEndLabelGap, (cellArea.w + gridGap) / maxColumns - (indicatorSectionWidth + iconSectionWidth + gridGap)));
          cellRows = maxRows;
          cellColumns = maxColumns;
        }
        else {
          var columnsPerRow = maxColumns;
          labelSectionWidth = Math.floor(Math.min(options['__layout']['maximumLabelWidth'] + startLabelGap + nodeEndLabelGap, (cellArea.w + gridGap) / columnsPerRow - (indicatorSectionWidth + iconSectionWidth + gridGap)));
          while (labelSectionWidth < (options['__layout']['maximumLabelWidth'] + startLabelGap + nodeEndLabelGap)) {
            if ((columnsPerRow - 1) * maxRows >= nodeCounts[maxCellIndex]) {
              columnsPerRow--;
              labelSectionWidth = Math.floor(Math.min(options['__layout']['maximumLabelWidth'] + startLabelGap + nodeEndLabelGap, (cellArea.w + gridGap) / columnsPerRow - (indicatorSectionWidth + iconSectionWidth + gridGap)));
            }
            else {
              break;
            }
          }
          cellRows = maxRows;
          cellColumns = columnsPerRow;
        }
      }
      else {
        // with label truncation off, need to find width that fully displays all labels

        var cell = DvtNBoxDataUtils.getCell(nbox, cellIndices[0]);
        var cellArea = cell['__childArea'];
        var maxRows = Math.floor((cellArea.h + gridGap) / (nodeHeight + gridGap));
        var maxColumns = Math.floor((cellArea.w + gridGap) / (indicatorSectionWidth + iconSectionWidth + options['__layout']['minimumLabelWidth'] + startLabelGap + nodeEndLabelGap + gridGap));

        // use all vertical space to allow more horizontal space for labels
        cellRows = maxRows;
        cellColumns = 0;

        // keep track of widest label encountered
        var widestLabel = 0;

        // keep track of how many nodes we've checked for each cell
        var startIndex = 0;

        // find number of columns we can show without truncating.  start at 1, build up.
        while (cellColumns <= maxColumns) {
          cellColumns++;

          // max label width for given # of columns
          var maxLabelWidth = Math.floor((cellArea.w + gridGap) / cellColumns - (indicatorSectionWidth + iconSectionWidth + gridGap));
          // if a wider label has already been found, previous # of columns is all we can fit
          if (widestLabel > maxLabelWidth) {
            cellColumns = Math.max(cellColumns - 1, 1);
            break;
          }

          // number of nodes that can be displayed in each cell for given # of columns
          var maxNodes = cellColumns * cellRows;

          var nodeArray = [];
          for (var r = 0; r < rowCount; r++) {
            for (var c = 0; c < columnCount; c++) {
              var cellIndex = DvtNBoxDataUtils.getColumnIndex(nbox, c) + columnCount * DvtNBoxDataUtils.getRowIndex(nbox, r);
              var nodes = cellNodes[cellIndex];
              // skip cell if no nodes
              if (!nodes || !nodes.length) {
                continue;
              }


              // number of nodes displayed in this cell given # of columns
              var numNodes = Math.min(nodes.length, maxNodes);
              // subtract 1 for overflow
              if (nodes.length > maxNodes)
                numNodes--;

              for (var n = startIndex; n < numNodes; n++) {
                nodeArray.push(nodes[n]);
              }
            }
          }

          widestLabel = Math.max(widestLabel, Math.ceil(DvtNBoxNodeRenderer._getMaxLabelWidth(nbox, nodeArray) + startLabelGap + nodeEndLabelGap));

          if (widestLabel > maxLabelWidth) {
            cellColumns = Math.max(cellColumns - 1, 1);
            break;
          }

          // stop increasing columns if we can already fit all nodes
          if (maxNodes >= nodeCounts[maxCellIndex]) {
            break;
          }

          // update start index to avoid checking same labels
          startIndex = maxNodes;
        }

        // recalculate max width for final # of columns
        maxLabelWidth = Math.floor((cellArea.w + gridGap) / cellColumns - (indicatorSectionWidth + iconSectionWidth + gridGap));
        // if widest label can't fit, use maximum
        if (widestLabel > maxLabelWidth) {
          labelSectionWidth = maxLabelWidth;
        }
        // otherwise extend label, up to maximumLabelWidth
        else {
          labelSectionWidth = Math.max(widestLabel, Math.min(maxLabelWidth, maximumLabelWidth + startLabelGap + nodeEndLabelGap));
        }

        if (labelSectionWidth < options['__layout']['minimumLabelWidth']) {
          cellColumns = 0;
        }
      }
    }
    for (var ci = 0; ci < cellIndices.length; ci++) {
      var cellIndex = cellIndices[ci];
      var overflow = false;
      if (nodeCounts[cellIndex] > cellRows * cellColumns) {
        overflow = true;
      }
      cellLayouts[cellIndex] = {'cellRows': cellRows, 'cellColumns': cellColumns, 'overflow': overflow};
    }
  }


  var nodeLayout = {'nodeHeight': nodeHeight,
    'indicatorSectionWidth': indicatorSectionWidth,
    'iconSectionWidth': iconSectionWidth,
    'iconWidth': iconWidth,
    'labelSectionWidth': labelSectionWidth,
    'cellLayouts': cellLayouts};
  options['__layout']['__nodeLayout'] = nodeLayout;
  return nodeLayout;
};


/**
 * Calculates sizes related to node layout, based upon the first specified node
 * (Assumes that the nodes are specified homogeneously)
 * @param {DvtNBox} nbox the nbox component
 * @param {object} data the drawer data
 * @param {array} nodes drawer nodes
 * @return {object} an object containing the calculated sizes
 */
DvtNBoxNodeRenderer.calculateNodeDrawerLayout = function(nbox, data, nodes) {
  var options = nbox.getOptions();
  var gridGap = options['__layout']['gridGap'];
  var nodeStartLabelGap = options['__layout']['nodeStartLabelGap'];
  var nodeLabelOnlyStartLabelGap = options['__layout']['nodeLabelOnlyStartLabelGap'];
  var nodeEndLabelGap = options['__layout']['nodeEndLabelGap'];
  var nodeSwatchSize = options['__layout']['nodeSwatchSize'];
  var maximumLabelWidth = options['__layout']['maximumLabelWidth'];


  var node = DvtNBoxDataUtils.getNode(nbox, 0);
  var indicatorIcon = DvtNBoxDataUtils.getIndicatorIcon(nbox, node);
  var icon = DvtNBoxDataUtils.getIcon(nbox, node);

  var simpleLayout = DvtNBoxNodeRenderer._calculateSimpleNodeLayout(nbox);
  var nodeHeight = simpleLayout['nodeHeight'];
  var indicatorSectionWidth = simpleLayout['indicatorSectionWidth'];
  var iconSectionWidth = simpleLayout['iconSectionWidth'];
  var startLabelGap = (indicatorSectionWidth || iconSectionWidth) ? nodeStartLabelGap : nodeLabelOnlyStartLabelGap;
  var labelSectionWidth;
  var childArea = data['__childArea'];

  labelSectionWidth = simpleLayout['labelSectionWidth'];
  if (labelSectionWidth == null) {
    if (options['labelTruncation'] != 'ifRequired') {
      labelSectionWidth = maximumLabelWidth + startLabelGap + nodeEndLabelGap;
    }
    else {
      labelSectionWidth = Math.max(maximumLabelWidth, DvtNBoxNodeRenderer._getMaxLabelWidth(nbox, nodes)) + startLabelGap + nodeEndLabelGap;
    }
    labelSectionWidth = Math.min(labelSectionWidth, childArea.w - indicatorSectionWidth - iconSectionWidth);
  }
  var columns = Math.floor((childArea.w + gridGap) / (indicatorSectionWidth + iconSectionWidth + labelSectionWidth + gridGap));

  // check if labels are visible at calculated width
  if (node[DvtNBoxConstants.LABEL]) {
    // temp container for checking if labels are visible
    var container = new DvtContainer();
    var labelVisible = false;
    var label = DvtNBoxDataUtils.getNodeLabel(nbox, node);
    var labelHeight = DvtTextUtils.guessTextDimensions(label).h;
    if (DvtTextUtils.fitText(label, labelSectionWidth - startLabelGap - nodeEndLabelGap, labelHeight, container)) {
      labelVisible = true;
    }
    if (node[DvtNBoxConstants.SECONDARY_LABEL]) {
      var secondaryLabel = DvtNBoxDataUtils.getNodeSecondaryLabel(nbox, node);
      var secondaryLabelHeight = DvtTextUtils.guessTextDimensions(secondaryLabel).h;
      if (DvtTextUtils.fitText(secondaryLabel, labelSectionWidth - startLabelGap - nodeEndLabelGap, secondaryLabelHeight, container)) {
        labelVisible = true;
      }
    }
    if (!labelVisible) {
      labelSectionWidth = 0;
      if (node[DvtNBoxConstants.COLOR]) {
        if ((!indicatorIcon || DvtNBoxStyleUtils.getNodeIndicatorColor(nbox, node)) &&
            (!icon || icon[DvtNBoxConstants.SOURCE])) {
          // Swatch needed
          labelSectionWidth = Math.max(0, Math.min(nodeSwatchSize, childArea.w - indicatorSectionWidth - iconSectionWidth));
        }
      }
    }
  }

  // calculate how much of the node indicator and node icon we have space for. limit if necessary
  if (childArea.w - indicatorSectionWidth - iconSectionWidth < 0) {
    var iconWidth = iconSectionWidth;
    iconSectionWidth = Math.max(0, childArea.w - indicatorSectionWidth); }
  if (childArea.w - indicatorSectionWidth < 0) {
    indicatorSectionWidth = childArea.w;
  }
  var nodeDrawerLayout = {'nodeHeight': nodeHeight,
    'indicatorSectionWidth': indicatorSectionWidth,
    'iconSectionWidth': iconSectionWidth,
    'iconWidth': iconWidth,
    'labelSectionWidth': labelSectionWidth,
    'drawerLayout': {'rows': -1, 'columns': columns}};
  options['__layout']['__nodeDrawerLayout'] = nodeDrawerLayout;
  return nodeDrawerLayout;

};


/**
 * Calculates sizes related to node layout, based upon the first specified node
 * (Assumes that the nodes are specified homogeneously)
 * @param {DvtNBox} nbox the nbox component
 * @return {object} an object containing the calculated sizes
 */
DvtNBoxNodeRenderer._calculateSimpleNodeLayout = function(nbox) {
  var options = nbox.getOptions();
  var nodeIndicatorGap = options['__layout']['nodeIndicatorGap'];
  var nodeSingleLabelGap = options['__layout']['nodeSingleLabelGap'];
  var nodeDualLabelGap = options['__layout']['nodeDualLabelGap'];
  var nodeInterLabelGap = options['__layout']['nodeInterLabelGap'];
  var nodeSwatchSize = options['__layout']['nodeSwatchSize'];

  var node = DvtNBoxDataUtils.getNode(nbox, 0);
  var nodeHeight = 0;
  var indicatorSectionWidth = 0;
  var iconSectionWidth = 0;
  var labelSectionWidth = null;
  var indicatorIcon = DvtNBoxDataUtils.getIndicatorIcon(nbox, node);
  var indicatorColor = DvtNBoxStyleUtils.getNodeIndicatorColor(nbox, node);
  var icon = DvtNBoxDataUtils.getIcon(nbox, node);
  if (indicatorIcon) {
    var indicatorIconWidth = indicatorIcon[DvtNBoxConstants.WIDTH];
    var indicatorIconHeight = indicatorIcon[DvtNBoxConstants.HEIGHT];
    indicatorSectionWidth = indicatorIconWidth + 2 * nodeIndicatorGap;
    nodeHeight = Math.max(nodeHeight, indicatorIconHeight + 2 * nodeIndicatorGap);
  }
  else if (indicatorColor) {
    indicatorSectionWidth = nodeSwatchSize;
  }
  if (node[DvtNBoxConstants.LABEL]) {
    var label = DvtNBoxDataUtils.getNodeLabel(nbox, node);
    var labelHeight = DvtTextUtils.guessTextDimensions(label).h;
    nodeHeight = Math.max(nodeHeight, labelHeight + 2 * nodeSingleLabelGap);
    if (node[DvtNBoxConstants.SECONDARY_LABEL]) {
      var secondaryLabel = DvtNBoxDataUtils.getNodeSecondaryLabel(nbox, node);
      var secondaryLabelHeight = DvtTextUtils.guessTextDimensions(secondaryLabel).h;
      nodeHeight = Math.max(nodeHeight, labelHeight + secondaryLabelHeight + 2 * nodeDualLabelGap + nodeInterLabelGap);
    }
  }
  else {
    labelSectionWidth = 0;
    // Is there a data color to show?
    if (node[DvtNBoxConstants.COLOR]) {
      if ((!indicatorIcon || DvtNBoxStyleUtils.getNodeIndicatorColor(nbox, node)) &&
          (!icon || icon[DvtNBoxConstants.SOURCE])) {
        // Swatch needed
        labelSectionWidth = indicatorSectionWidth ? indicatorSectionWidth : nodeSwatchSize;
      }
    }
  }
  if (icon) {
    var preferredSize = Math.max(nodeHeight, DvtAgent.isTouchDevice() ? icon['preferredSizeTouch'] : icon['preferredSize']);
    var padding = (icon[DvtNBoxConstants.SOURCE] ? icon['sourcePaddingRatio'] : icon['shapePaddingRatio']) * preferredSize;
    var iconWidth = (icon[DvtNBoxConstants.WIDTH] ? icon[DvtNBoxConstants.WIDTH] : preferredSize - 2 * padding);
    var iconHeight = (icon[DvtNBoxConstants.HEIGHT] ? icon[DvtNBoxConstants.HEIGHT] : preferredSize - 2 * padding);
    iconSectionWidth = iconWidth + 2 * padding;
    nodeHeight = Math.max(nodeHeight, iconHeight + 2 * padding);
  }
  return {'nodeHeight': nodeHeight,
    'indicatorSectionWidth': indicatorSectionWidth,
    'iconSectionWidth': iconSectionWidth,
    'labelSectionWidth': labelSectionWidth};
};


/**
 * Renders the node background
 * @param {DvtNBox} nbox
 * @param {object} node the node data being rendered
 * @param {DvtNBoxNode} nodeContainer the container for the node contents
 * @param {object} nodeLayout an object containing dimensions of the various node sections
 */
DvtNBoxNodeRenderer._renderNodeBackground = function(nbox, node, nodeContainer, nodeLayout) {
  var width = nodeLayout['indicatorSectionWidth'] + nodeLayout['iconSectionWidth'] + nodeLayout['labelSectionWidth'];

  var height = nodeLayout['nodeHeight'];
  var borderRadius = DvtNBoxStyleUtils.getNodeBorderRadius(nbox);
  var hoverColor = DvtNBoxStyleUtils.getNodeHoverColor(nbox);
  var selectionColor = DvtNBoxStyleUtils.getNodeSelectionColor(nbox);

  var selectionRect = new DvtRect(nbox.getCtx(),
                                  0,
                                  0,
                                  width,
                                  height);
  selectionRect.setFill(null);
  if (borderRadius) {
    selectionRect.setRx(borderRadius);
    selectionRect.setRy(borderRadius);
  }
  selectionRect.setHoverStroke(new DvtSolidStroke(hoverColor, null, 2), new DvtSolidStroke(selectionColor, null, 4));
  selectionRect.setSelectedStroke(new DvtSolidStroke(selectionColor, null, 4), null);
  selectionRect.setSelectedHoverStroke(new DvtSolidStroke(hoverColor, null, 2), new DvtSolidStroke(selectionColor, null, 6));
  nodeContainer.addChild(selectionRect);
  nodeContainer.setSelectionShape(selectionRect);
  var nodeRect = new DvtRect(nbox.getCtx(),
                             0,
                             0,
                             width,
                             height);
  if (borderRadius) {
    nodeRect.setRx(borderRadius);
    nodeRect.setRy(borderRadius);
  }
  var color = DvtNBoxStyleUtils.getNodeColor(nbox, node);
  nodeRect.setSolidFill(color);
  if (DvtNBoxStyleUtils.getNodeBorderColor(nbox, node) && DvtNBoxStyleUtils.getNodeBorderWidth(nbox, node))
    nodeRect.setSolidStroke(DvtNBoxStyleUtils.getNodeBorderColor(nbox, node), null, DvtNBoxStyleUtils.getNodeBorderWidth(nbox, node));
  nodeContainer.addChild(nodeRect);
  DvtNBoxDataUtils.setDisplayable(nbox, node, nodeRect, 'background');
};


/**
 * Renders the node indicator
 * @param {DvtNBox} nbox
 * @param {object} node the node data being rendered
 * @param {DvtNBoxNode} nodeContainer the container for the node contents
 * @param {object} nodeLayout an object containing dimensions of the various node sections
 */
DvtNBoxNodeRenderer._renderNodeIndicator = function(nbox, node, nodeContainer, nodeLayout) {
  var color = DvtNBoxStyleUtils.getNodeColor(nbox, node);
  var contrastColor = DvtColorUtils.getContrastingTextColor(color);

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());
  var indicatorX = rtl ? nodeLayout['labelSectionWidth'] + nodeLayout['iconSectionWidth'] : 0;

  var indicatorColor = DvtNBoxStyleUtils.getNodeIndicatorColor(nbox, node);
  if (indicatorColor) {
    // Render the indicator background swatch
    contrastColor = DvtColorUtils.getContrastingTextColor(indicatorColor);
    var bgRect = new DvtRect(nbox.getCtx(), indicatorX, 0, nodeLayout['indicatorSectionWidth'], nodeLayout['nodeHeight']);
    bgRect.setSolidFill(indicatorColor);
    DvtNBoxNodeRenderer._clipIfNecessary(nbox, bgRect, nodeLayout);
    nodeContainer.addChild(bgRect);
    DvtNBoxDataUtils.setDisplayable(nbox, node, bgRect, DvtNBoxConstants.INDICATOR);
  }
  var indicatorIcon = DvtNBoxDataUtils.getIndicatorIcon(nbox, node);
  if (indicatorIcon) {
    var indicatorIconColor = indicatorIcon[DvtNBoxConstants.COLOR] ? indicatorIcon[DvtNBoxConstants.COLOR] : contrastColor;
    var indicatorMarker;
    if (indicatorIcon[DvtNBoxConstants.SOURCE]) {
      indicatorMarker = new DvtImageMarker(nbox.getCtx(),
                                           indicatorX + nodeLayout['indicatorSectionWidth'] / 2,
                                           nodeLayout['nodeHeight'] / 2,
                                           indicatorIcon[DvtNBoxConstants.WIDTH],
                                           indicatorIcon[DvtNBoxConstants.HEIGHT],
                                           indicatorIcon[DvtNBoxConstants.SOURCE]);
    }
    else {
      indicatorMarker = new DvtSimpleMarker(nbox.getCtx(),
                                            indicatorIcon[DvtNBoxConstants.SHAPE],
                                            DvtCSSStyle.SKIN_ALTA,
                                            indicatorX + nodeLayout['indicatorSectionWidth'] / 2,
                                            nodeLayout['nodeHeight'] / 2,
                                            indicatorIcon[DvtNBoxConstants.WIDTH],
                                            indicatorIcon[DvtNBoxConstants.HEIGHT]);
    }
    if (indicatorIcon[DvtNBoxConstants.PATTERN] != 'none') {
      indicatorMarker.setFill(new DvtPatternFill(indicatorIcon[DvtNBoxConstants.PATTERN], indicatorIconColor, color));
    }
    else {
      indicatorMarker.setSolidFill(indicatorIconColor);
    }
    if (indicatorIcon[DvtNBoxConstants.WIDTH] > nodeLayout['indicatorSectionWidth'])
      DvtNBoxNodeRenderer._clipIfNecessary(nbox, indicatorMarker, nodeLayout);

    nodeContainer.addChild(indicatorMarker);
    DvtNBoxDataUtils.setDisplayable(nbox, node, indicatorMarker, DvtNBoxConstants.INDICATOR_ICON);
  }
};


/**
 * Renders the node icon
 * @param {DvtNBox} nbox
 * @param {object} node the node data being rendered
 * @param {DvtNBoxNode} nodeContainer the container for the node contents
 * @param {object} nodeLayout an object containing dimensions of the various node sections
 */
DvtNBoxNodeRenderer._renderNodeIcon = function(nbox, node, nodeContainer, nodeLayout) {
  var color = DvtNBoxStyleUtils.getNodeColor(nbox, node);
  var contrastColor = DvtColorUtils.getContrastingTextColor(color);

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

  var icon = DvtNBoxDataUtils.getIcon(nbox, node);
  if (icon) {
    var padding = (icon[DvtNBoxConstants.SOURCE] ? icon['sourcePaddingRatio'] : icon['shapePaddingRatio']) * nodeLayout['nodeHeight'];

    var iconWidth = icon[DvtNBoxConstants.WIDTH] ? icon[DvtNBoxConstants.WIDTH] : nodeLayout['iconWidth'] ? nodeLayout['iconWidth'] : (nodeLayout['iconSectionWidth'] - 2 * padding);
    var iconHeight = icon[DvtNBoxConstants.HEIGHT] ? icon[DvtNBoxConstants.HEIGHT] : (nodeLayout['nodeHeight'] - 2 * padding);
    var iconX = nodeLayout[rtl ? 'labelSectionWidth' : 'indicatorSectionWidth'] + Math.max(nodeLayout['iconSectionWidth'] / 2, nodeLayout['iconWidth'] ? nodeLayout['iconWidth'] / 2 : 0);
    var iconY = nodeLayout['nodeHeight'] / 2;

    var iconColor = icon[DvtNBoxConstants.COLOR] ? icon[DvtNBoxConstants.COLOR] : contrastColor;
    var iconMarker;
    if (icon[DvtNBoxConstants.SOURCE]) {
      iconMarker = new DvtImageMarker(nbox.getCtx(),
                                      iconX,
                                      iconY,
                                      iconWidth,
                                      iconHeight,
                                      icon[DvtNBoxConstants.SOURCE]);
    }
    else {
      iconMarker = new DvtSimpleMarker(nbox.getCtx(),
                                       icon[DvtNBoxConstants.SHAPE],
                                       DvtCSSStyle.SKIN_ALTA,
                                       iconX,
                                       iconY,
                                       iconWidth,
                                       iconHeight);
    }
    if (icon[DvtNBoxConstants.PATTERN] != 'none') {
      iconMarker.setFill(new DvtPatternFill(icon[DvtNBoxConstants.PATTERN], iconColor, color));
    }
    else {
      iconMarker.setSolidFill(iconColor);
    }
    if (nodeLayout['indicatorSectionWidth'] == 0 || nodeLayout['labelSectionWidth'] == 0) {
      // icon is on one of the ends
      DvtNBoxNodeRenderer._clipIfNecessary(nbox, iconMarker, nodeLayout);
    }
    nodeContainer.addChild(iconMarker);
  }
  DvtNBoxDataUtils.setDisplayable(nbox, node, iconMarker, DvtNBoxConstants.ICON);
};


/**
 * Renders the node labels
 * @param {DvtNBox} nbox
 * @param {object} node the node data being rendered
 * @param {DvtNBoxNode} nodeContainer the container for the node contents
 * @param {object} nodeLayout an object containing dimensions of the various node sections
 */
DvtNBoxNodeRenderer._renderNodeLabels = function(nbox, node, nodeContainer, nodeLayout) {
  var options = nbox.getOptions();
  var nodeInterLabelGap = options['__layout']['nodeInterLabelGap'];
  var nodeLabelOnlyStartLabelGap = options['__layout']['nodeLabelOnlyStartLabelGap'];
  var nodeStartLabelGap = options['__layout']['nodeStartLabelGap'];
  var nodeEndLabelGap = options['__layout']['nodeEndLabelGap'];
  var startLabelGap = nodeLayout['indicatorSectionWidth'] || nodeLayout['iconSectionWidth'] ? nodeStartLabelGap : nodeLabelOnlyStartLabelGap;
  var color = DvtNBoxStyleUtils.getNodeColor(nbox, node);
  var contrastColor = DvtColorUtils.getContrastingTextColor(color);

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());
  var labelX = rtl ? nodeLayout['labelSectionWidth'] - startLabelGap : nodeLayout['indicatorSectionWidth'] + nodeLayout['iconSectionWidth'] + startLabelGap;

  if (node[DvtNBoxConstants.LABEL]) {
    var label = DvtNBoxDataUtils.getNodeLabel(nbox, node);
    var labelHeight = DvtTextUtils.guessTextDimensions(label).h;
    if (DvtTextUtils.fitText(label, nodeLayout['labelSectionWidth'] - startLabelGap - nodeEndLabelGap, labelHeight, nodeContainer)) {
      DvtNBoxRenderer.positionText(label, labelX, nodeLayout['nodeHeight'] / 2);
      (label.getCSSStyle() && label.getCSSStyle().getStyle('color')) ?
          label.setSolidFill(label.getCSSStyle().getStyle('color')) : label.setSolidFill(contrastColor);
      DvtNBoxDataUtils.setDisplayable(nbox, node, label, DvtNBoxConstants.LABEL);
    }
    if (node[DvtNBoxConstants.SECONDARY_LABEL]) {
      var secondaryLabel = DvtNBoxDataUtils.getNodeSecondaryLabel(nbox, node);
      var secondaryLabelHeight = DvtTextUtils.guessTextDimensions(secondaryLabel).h;
      if (DvtTextUtils.fitText(secondaryLabel, nodeLayout['labelSectionWidth'] - startLabelGap - nodeEndLabelGap, secondaryLabelHeight, nodeContainer)) {
        var yOffset = (nodeLayout['nodeHeight'] - labelHeight - secondaryLabelHeight - nodeInterLabelGap) / 2;
        DvtNBoxRenderer.positionText(label, labelX, yOffset + labelHeight / 2);
        DvtNBoxRenderer.positionText(secondaryLabel, labelX, yOffset + labelHeight + nodeInterLabelGap + secondaryLabelHeight / 2);
        (secondaryLabel.getCSSStyle() && secondaryLabel.getCSSStyle().getStyle('color')) ?
            secondaryLabel.setSolidFill(secondaryLabel.getCSSStyle().getStyle('color')) : secondaryLabel.setSolidFill(contrastColor);
        DvtNBoxDataUtils.setDisplayable(nbox, node, secondaryLabel, DvtNBoxConstants.SECONDARY_LABEL);
      }
    }
  }
};


/**
 * @private
 * Returns max label width of given nodes
 * @param {DvtNBox} nbox
 * @param {array} nodes the array of DvtNBoxNodes to check labels for
 *
 * @return {nnumber} max label width
 */
DvtNBoxNodeRenderer._getMaxLabelWidth = function(nbox, nodes) {
  // create and add labels to temporary container
  var container = new DvtContainer();
  for (var n = 0; n < nodes.length; n++) {
    var node = nodes[n];
    container.addChild(DvtNBoxDataUtils.getNodeLabel(nbox, node));
    container.addChild(DvtNBoxDataUtils.getNodeSecondaryLabel(nbox, node));
  }
  nbox.addChild(container);
  var width = container.getDimensions().w;

  // clean up container
  while (container.getNumChildren() > 0) {
    container.removeChild(container.getChildAt(0));
  }
  nbox.removeChild(container);

  return width;
};

/**
 * Conditionally adds a clip path to the specified displayable if a border radius has been specified.
 *
 * @param {DvtNBox} nbox
 * @param {DvtDisplayable} displayable
 * @param {object} nodeLayout an object containing dimensions of the various node sections
 */
DvtNBoxNodeRenderer._clipIfNecessary = function(nbox, displayable, nodeLayout) {
  var borderRadius = DvtNBoxStyleUtils.getNodeBorderRadius(nbox);
  if (borderRadius) {
    var nodeWidth = nodeLayout['indicatorSectionWidth'] + nodeLayout['iconSectionWidth'] + nodeLayout['labelSectionWidth'];
    var nodeHeight = nodeLayout['nodeHeight'];
    var clipPath = new DvtClipPath();
    clipPath.addRect(0, 0, nodeWidth, nodeHeight, borderRadius, borderRadius);
    displayable.setClipPath(clipPath);
  }
};


/**
 * @override
 */
DvtNBoxNodeRenderer.animateUpdate = function(animationHandler, oldNode, newNode) {
  var oldNBox = animationHandler.getOldNBox();
  var newNBox = animationHandler.getNewNBox();

  var oldGlobalMatrix = DvtNBoxRenderer.getGlobalMatrix(oldNode);
  var newGlobalMatrix = DvtNBoxRenderer.getGlobalMatrix(newNode);
  var newMatrix = newNode.getMatrix();
  var parent = newNode.getParent();
  oldNode.setAlpha(0);
  animationHandler.getNewNBox().addChild(newNode);
  newNode.setMatrix(oldGlobalMatrix);


  var oldScrollContainer = DvtNBoxDataUtils.getNodeScrollableContainer(oldNBox, oldNode);
  var newScrollContainer = DvtNBoxDataUtils.getNodeScrollableContainer(newNBox, newNode);
  if (oldScrollContainer || newScrollContainer) {
    var clipPath = new DvtClipPath();
    var rect;
    if (oldScrollContainer) {
      var oldScrollMatrix = DvtNBoxRenderer.getGlobalMatrix(oldScrollContainer);
      var oldScrollRect = new DvtRectangle(oldScrollMatrix.getTx(), oldScrollMatrix.getTy(), oldScrollContainer.getWidth(), oldScrollContainer.getHeight());

      var oldCellIndex = DvtNBoxDataUtils.getCellIndex(oldNBox, oldNode.getData());
      var oldCell = DvtNBoxDataUtils.getCell(oldNBox, oldCellIndex);
      var oldCellBackground = DvtNBoxDataUtils.getDisplayable(oldNBox, oldCell, 'background');
      var oldCellMatrix = DvtNBoxRenderer.getGlobalMatrix(oldCellBackground);
      var oldCellRect = new DvtRectangle(oldCellMatrix.getTx(), oldCellMatrix.getTy(), oldCellBackground.getWidth(), oldCellBackground.getHeight());

      rect = oldScrollRect.getUnion(oldCellRect);
    }

    if (newScrollContainer) {
      var newScrollMatrix = DvtNBoxRenderer.getGlobalMatrix(newScrollContainer);
      var newScrollRect = new DvtRectangle(newScrollMatrix.getTx(), newScrollMatrix.getTy(), newScrollContainer.getWidth(), newScrollContainer.getHeight());

      var newCellIndex = DvtNBoxDataUtils.getCellIndex(newNBox, newNode.getData());
      var newCell = DvtNBoxDataUtils.getCell(newNBox, newCellIndex);
      var newCellBackground = DvtNBoxDataUtils.getDisplayable(newNBox, newCell, 'background');
      var newCellMatrix = DvtNBoxRenderer.getGlobalMatrix(newCellBackground);
      var newCellRect = new DvtRectangle(newCellMatrix.getTx(), newCellMatrix.getTy(), newCellBackground.getWidth(), newCellBackground.getHeight());

      var newRect = newScrollRect.getUnion(newCellRect);
      rect = rect ? rect.getUnion(newRect) : newRect;
    }

    if (rect) {
      clipPath.addRect(rect.x, rect.y, rect.w, rect.h);
      newNode.setClipPath(clipPath);
    }
  }

  var movePlayable = new DvtAnimMoveTo(newNode.getCtx(), newNode, new DvtPoint(newGlobalMatrix.getTx(), newGlobalMatrix.getTy()), animationHandler.getAnimationDuration());
  DvtPlayable.appendOnEnd(movePlayable, function() {parent.addChild(newNode); newNode.setMatrix(newMatrix); newNode.setClipPath(null)});
  animationHandler.add(movePlayable, DvtNBoxDataAnimationHandler.UPDATE);

  // Colors
  var playable = new DvtCustomAnimation(newNBox.getCtx(), newNode, animationHandler.getAnimationDuration());
  DvtNBoxNodeRenderer._animateFill(playable, oldNBox, newNBox, oldNode, newNode, 'background');
  DvtNBoxNodeRenderer._animateFill(playable, oldNBox, newNBox, oldNode, newNode, DvtNBoxConstants.LABEL);
  DvtNBoxNodeRenderer._animateFill(playable, oldNBox, newNBox, oldNode, newNode, DvtNBoxConstants.SECONDARY_LABEL);
  DvtNBoxNodeRenderer._animateFill(playable, oldNBox, newNBox, oldNode, newNode, DvtNBoxConstants.INDICATOR);
  DvtNBoxNodeRenderer._animateFill(playable, oldNBox, newNBox, oldNode, newNode, DvtNBoxConstants.INDICATOR_ICON);
  DvtNBoxNodeRenderer._animateFill(playable, oldNBox, newNBox, oldNode, newNode, DvtNBoxConstants.ICON);
  animationHandler.add(playable, DvtNBoxDataAnimationHandler.UPDATE);
};


/**
 * Helper to animate between fills
 *
 * @param {DvtPlayable} playable The playable to add the animation to
 * @param {object} oldNBox an object representing the old NBox state
 * @param {DvtNBox} newNBox the new NBox
 * @param {DvtNBoxNode} oldNode the old node
 * @param {DvtNBoxNode} newNode the new node
 * @param {string} displayableKey the key to use for looking up the sub displayable
 */
DvtNBoxNodeRenderer._animateFill = function(playable, oldNBox, newNBox, oldNode, newNode, displayableKey) {
  var oldDisplayable = DvtNBoxDataUtils.getDisplayable(oldNBox, oldNode.getData(), displayableKey);
  var newDisplayable = DvtNBoxDataUtils.getDisplayable(newNBox, newNode.getData(), displayableKey);
  if (oldDisplayable && newDisplayable) {
    playable.getAnimator().addProp(DvtAnimator.TYPE_FILL, newDisplayable, newDisplayable.getFill, newDisplayable.setFill, newDisplayable.getFill());
    newDisplayable.setFill(oldDisplayable.getFill());
  }
};


/**
 * @override
 */
DvtNBoxNodeRenderer.animateDelete = function(animationHandler, oldNode) {
  var animationPhase = DvtNBoxDataAnimationHandler.DELETE;

  var oldNBox = animationHandler.getOldNBox();
  var newNBox = animationHandler.getNewNBox();

  var nodeLayout = oldNBox.getOptions()['__layout']['__nodeLayout'];
  if (!nodeLayout) {
    return;
  }

  var oldData = oldNode.getData();
  var id = oldData[DvtNBoxConstants.ID];
  var newNodeIndex = DvtNBoxDataUtils.getNodeIndex(newNBox, id);

  if (!isNaN(newNodeIndex)) {
    var newNode = DvtNBoxDataUtils.getNode(newNBox, newNodeIndex);
    if (!DvtNBoxDataUtils.isNodeHidden(newNBox, newNode)) {
      // Node wasn't "really" deleted, just not visible.
      animationPhase = DvtNBoxDataAnimationHandler.UPDATE;
      // Should it move into a group?
      if (DvtNBoxDataUtils.getGrouping(newNBox)) {
        var groups = newNBox.getOptions()['__groups'];
        var groupBehavior = DvtNBoxDataUtils.getGroupBehavior(newNBox);
        if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
          groups = groups[DvtNBoxDataUtils.getCellIndex(newNBox, newNode)];
        }
        var group = groups[DvtNBoxDataUtils.getNodeGroupId(newNode)];
        if (group) {
          var groupNode = DvtNBoxDataUtils.getDisplayable(newNBox, group);
          if (groupNode) {
            var centerMatrix = DvtNBoxRenderer.getGlobalMatrix(groupNode);
            var centerOffset = new DvtPoint((nodeLayout['indicatorSectionWidth'] + nodeLayout['iconSectionWidth'] + nodeLayout['labelSectionWidth']) / 2, nodeLayout['nodeHeight'] / 2);
            animationHandler.add(new DvtAnimMoveTo(newNBox.getCtx(), oldNode, new DvtPoint(centerMatrix.getTx() - centerOffset.x, centerMatrix.getTy() - centerOffset.y), animationHandler.getAnimationDuration()), animationPhase);
          }
        }
      }
      // Should it move to a different cell?
      else if (oldData[DvtNBoxConstants.ROW] != newNode[DvtNBoxConstants.ROW] ||
          oldData[DvtNBoxConstants.COLUMN] != newNode[DvtNBoxConstants.COLUMN]) {

        var oldGlobalMatrix = DvtNBoxRenderer.getGlobalMatrix(oldNode);
        var oldDims = oldNode.getDimensions();
        animationHandler.getNewNBox().addChild(oldNode);
        oldNode.setMatrix(oldGlobalMatrix);

        var newCell = DvtNBoxDataUtils.getCellByRowColumn(newNBox, newNode[DvtNBoxConstants.ROW], newNode[DvtNBoxConstants.COLUMN]);
        var overflow = DvtNBoxDataUtils.getDisplayable(newNBox, newCell.getData(), 'overflow');
        if (overflow) {
          var overflowMatrix = DvtNBoxRenderer.getGlobalMatrix(overflow);
          animationHandler.add(new DvtAnimMoveTo(newNBox.getCtx(), oldNode, new DvtPoint(overflowMatrix.getTx(), overflowMatrix.getTy()), animationHandler.getAnimationDuration()), DvtNBoxDataAnimationHandler.UPDATE);
        }
        else {
          var cellMatrix = DvtNBoxRenderer.getGlobalMatrix(newCell);
          var cellDimensions = newCell.getDimensions();
          var centerOffset = new DvtPoint((nodeLayout['indicatorSectionWidth'] + nodeLayout['iconSectionWidth'] + nodeLayout['labelSectionWidth']) / 2, nodeLayout['nodeHeight'] / 2);
          animationHandler.add(new DvtAnimMoveTo(newNBox.getCtx(), oldNode, new DvtPoint(cellMatrix.getTx() + cellDimensions.w / 2 - centerOffset.x, cellMatrix.getTy() + cellDimensions.h / 2 - centerOffset.y), animationHandler.getAnimationDuration()), DvtNBoxDataAnimationHandler.UPDATE);
        }
        var scaleAnim = new DvtCustomAnimation(newNBox.getCtx(), newNode, animationHandler.getAnimationDuration());
        scaleAnim.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, oldNode, oldNode.getScaleX, oldNode.setScaleX, .01);
        scaleAnim.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, oldNode, oldNode.getScaleY, oldNode.setScaleY, .01);
        DvtPlayable.appendOnEnd(scaleAnim, function() {newNBox.getDeleteContainer().addChild(oldNode)});

        animationHandler.add(scaleAnim, DvtNBoxDataAnimationHandler.INSERT);
        animationHandler.add(new DvtAnimMoveBy(newNBox.getCtx(), oldNode, new DvtPoint(oldDims.w / 2, oldDims.h / 2), animationHandler.getAnimationDuration()), DvtNBoxDataAnimationHandler.INSERT);
        animationHandler.add(new DvtAnimFadeOut(newNBox.getCtx(), oldNode, animationHandler.getAnimationDuration()), DvtNBoxDataAnimationHandler.INSERT);

        return;
      }
    }
  }
  oldNode.setMatrix(DvtNBoxRenderer.getGlobalMatrix(oldNode));
  var scrollContainer = DvtNBoxDataUtils.getNodeScrollableContainer(oldNBox, oldNode);
  if (scrollContainer) {
    var clipPath = new DvtClipPath();
    var scrollMatrix = DvtNBoxRenderer.getGlobalMatrix(scrollContainer);
    var rect = new DvtRectangle(scrollMatrix.getTx(), scrollMatrix.getTy(), scrollContainer._width, scrollContainer._height);
    clipPath.addRect(rect.x, rect.y, rect.w, rect.h);
    oldNode.setClipPath(clipPath);
  }
  animationHandler.add(new DvtAnimFadeOut(newNBox.getCtx(), oldNode, animationHandler.getAnimationDuration()), animationPhase);
  newNBox.getDeleteContainer().addChild(oldNode);

};



/**
 * @override
 */
DvtNBoxNodeRenderer.animateInsert = function(animationHandler, newNode) {
  var animationPhase = DvtNBoxDataAnimationHandler.INSERT;

  var oldNBox = animationHandler.getOldNBox();
  var newNBox = animationHandler.getNewNBox();

  var nodeLayout = newNBox.getOptions()['__layout']['__nodeLayout'];
  if (!nodeLayout) {
    return;
  }

  var id = newNode.getData()[DvtNBoxConstants.ID];
  var oldNodeIndex = DvtNBoxDataUtils.getNodeIndex(oldNBox, id);
  if (!isNaN(oldNodeIndex)) {
    var oldNode = DvtNBoxDataUtils.getNode(oldNBox, oldNodeIndex);
    if (!DvtNBoxDataUtils.isNodeHidden(oldNBox, oldNode)) {
      // Node wasn't "really" inserted, just not visible.
      animationPhase = DvtNBoxDataAnimationHandler.UPDATE;
      // Should it move out of a group?
      if (DvtNBoxDataUtils.getGrouping(oldNBox)) {
        var groups = oldNBox.getOptions()['__groups'];
        var groupBehavior = DvtNBoxDataUtils.getGroupBehavior(oldNBox);
        if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
          groups = groups[DvtNBoxDataUtils.getCellIndex(oldNBox, oldNode)];
        }
        var group = groups[DvtNBoxDataUtils.getNodeGroupId(oldNode)];
        if (group) {
          var groupNode = DvtNBoxDataUtils.getDisplayable(oldNBox, group);
          if (groupNode) {
            var childMatrix = newNode.getMatrix();
            var parent = newNode.getParent();
            var finalMatrix = DvtNBoxRenderer.getGlobalMatrix(newNode);
            var centerMatrix = DvtNBoxRenderer.getGlobalMatrix(groupNode);
            var centerOffset = new DvtPoint((nodeLayout['indicatorSectionWidth'] + nodeLayout['iconSectionWidth'] + nodeLayout['labelSectionWidth']) / 2, nodeLayout['nodeHeight'] / 2);
            centerMatrix.translate(-centerOffset.x, -centerOffset.y);
            newNBox.addChild(newNode);
            newNode.setMatrix(centerMatrix);
            var movePlayable = new DvtAnimMoveTo(newNBox.getCtx(), newNode, new DvtPoint(finalMatrix.getTx(), finalMatrix.getTy()), animationHandler.getAnimationDuration());
            DvtPlayable.appendOnEnd(movePlayable, function() {newNode.setMatrix(childMatrix); parent.addChild(newNode)});
            animationHandler.add(movePlayable, animationPhase);
          }
        }
      }
    }
  }
  var fadeAnim = new DvtCustomAnimation(newNBox.getCtx(), newNode, animationHandler.getAnimationDuration());
  fadeAnim.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, newNode, newNode.getAlpha, newNode.setAlpha, newNode.getAlpha());
  animationHandler.add(fadeAnim, animationPhase);
  newNode.setAlpha(0);
};


/**
 * @private
 * Adds accessibility attributes to the object
 * @param {DvtNBox} nbox the nbox
 * @param {DvtNBoxNode} object the object that should be updated with accessibility attributes
 */
DvtNBoxNodeRenderer._addAccessibilityAttributes = function(nbox, object) {
  object.setAriaRole('img');
  if (!DvtAgent.deferAriaCreation()) {
    var desc = object.getAriaLabel();
    if (desc)
      object.setAriaProperty(DvtNBoxConstants.LABEL, desc);
  }
};
// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.


/**
 * Renderer for DvtNBoxCategoryNode.
 * @class
 */
var DvtNBoxCategoryNodeRenderer = new Object();

DvtObj.createSubclass(DvtNBoxCategoryNodeRenderer, DvtObj, 'DvtNBoxCategoryNodeRenderer');


/**
 * Renders the nbox category node.
 * @param {DvtNBox} nbox The nbox component
 * @param {object} nodeData the category node data being rendered
 * @param {DvtNBoxCategoryNode} nodeContainer The container to render into.
 * @param {number} scale The number of pixels per unit (used to determine the size of this category node based on its node count)
 * @param {number} gap The number of pixels to shrink this node (to leave padding in the force layout)
 */
DvtNBoxCategoryNodeRenderer.render = function(nbox, nodeData, nodeContainer, scale, gap) {
  DvtNBoxCategoryNodeRenderer._renderNodeBackground(nbox, nodeData, nodeContainer, scale, gap);
  var rendered = DvtNBoxCategoryNodeRenderer._renderNodeIndicator(nbox, nodeData, nodeContainer, scale, gap);
  DvtNBoxCategoryNodeRenderer._renderNodeCount(nbox, nodeData, nodeContainer, scale, rendered, gap);
  DvtNBoxCategoryNodeRenderer._addAccessibilityAttributes(nbox, nodeContainer);
};


/**
 * Renders the node background
 * @param {DvtNBox} nbox
 * @param {object} node the category node data being rendered
 * @param {DvtNBoxCategoryNode} nodeContainer the container for the node contents
 * @param {number} scale The number of pixels per unit (used to determine the size of this category node based on its node count)
 * @param {number} gap The number of pixels to shrink this node (to leave padding in the force layout)
 */
DvtNBoxCategoryNodeRenderer._renderNodeBackground = function(nbox, node, nodeContainer, scale, gap) {
  node['__scale'] = scale;
  node['__gap'] = gap;
  var side = Math.max(0, DvtNBoxCategoryNodeRenderer.getSideLength(node));
  var borderRadius = DvtNBoxStyleUtils.getNodeBorderRadius(nbox);
  var hoverColor = DvtNBoxStyleUtils.getNodeHoverColor(nbox);
  var selectionColor = DvtNBoxStyleUtils.getNodeSelectionColor(nbox);

  var selectionRect = new DvtRect(nbox.getCtx(),
                                  -side / 2,
                                  -side / 2,
                                  side,
                                  side);
  selectionRect.setFill(null);
  if (borderRadius) {
    selectionRect.setRx(borderRadius);
    selectionRect.setRy(borderRadius);
  }
  selectionRect.setHoverStroke(new DvtSolidStroke(hoverColor, null, 2), new DvtSolidStroke(selectionColor, null, 4));
  selectionRect.setSelectedStroke(new DvtSolidStroke(selectionColor, null, 4), null);
  selectionRect.setSelectedHoverStroke(new DvtSolidStroke(hoverColor, null, 2), new DvtSolidStroke(selectionColor, null, 6));
  nodeContainer.addChild(selectionRect);
  nodeContainer.setSelectionShape(selectionRect);

  var nodeRect = new DvtRect(nbox.getCtx(),
                             -side / 2,
                             -side / 2,
                             side,
                             side);
  if (borderRadius) {
    nodeRect.setRx(borderRadius);
    nodeRect.setRy(borderRadius);
  }
  var color = DvtNBoxStyleUtils.getCategoryNodeColor(nbox, node);
  nodeRect.setSolidFill(color);
  nodeContainer.addChild(nodeRect);
};


/**
 * Gets the length of a side of the specified category node
 *
 * @param {object} the category node data
 *
 * @return {number} the side length
 */
DvtNBoxCategoryNodeRenderer.getSideLength = function(node) {
  return node['__scale'] * Math.sqrt(node['nodeIndices'].length) - node['__gap'];
};


/**
 * Renders the node indicator
 * @param {DvtNBox} nbox
 * @param {object} node the node data being rendered
 * @param {DvtNBoxCategoryNode} nodeContainer the container for the node contents
 * @param {number} scale The number of pixels per unit (used to determine the size of this category node based on its node count)
 * @param {number} gap The number of pixels to shrink this node (to leave padding in the force layout)
 */
DvtNBoxCategoryNodeRenderer._renderNodeIndicator = function(nbox, node, nodeContainer, scale, gap) {
  var retVal = false;
  var options = nbox.getOptions();
  var markerGap = options['__layout']['markerGap'];

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

  var side = scale * Math.sqrt(node['nodeIndices'].length) - gap;

  var color = DvtNBoxStyleUtils.getCategoryNodeColor(nbox, node);
  var contrastColor = DvtColorUtils.getContrastingTextColor(color);

  var indicatorWidth = side / 4;
  var indicatorIconScale = 1;
  var indicatorX = rtl ? side / 2 - indicatorWidth : -side / 2;
  var indicatorIcon = DvtNBoxStyleUtils.getStyledCategoryIndicatorIcon(nbox, node);
  if (indicatorIcon) {
    var indicatorIconWidth = indicatorIcon[DvtNBoxConstants.WIDTH];
    var indicatorIconHeight = indicatorIcon[DvtNBoxConstants.HEIGHT];
    var xScale = indicatorWidth / (indicatorIconWidth + 2 * markerGap);
    var yScale = side / (indicatorIconHeight + 2 * markerGap);
    indicatorIconScale = Math.min(xScale, yScale);
  }

  var indicatorColor = DvtNBoxStyleUtils.getCategoryNodeIndicatorColor(nbox, node);
  if (indicatorColor) {
    // Render the indicator background swatch
    contrastColor = DvtColorUtils.getContrastingTextColor(indicatorColor);
    var bgRect = new DvtRect(nbox.getCtx(), indicatorX, -side / 2, indicatorWidth, side);
    bgRect.setSolidFill(indicatorColor);
    nodeContainer.addChild(bgRect);
    retVal = true;
  }

  if (indicatorIcon) {
    var indicatorIconColor = indicatorIcon[DvtNBoxConstants.COLOR] ? indicatorIcon[DvtNBoxConstants.COLOR] : contrastColor;
    var indicatorMarker = new DvtSimpleMarker(nbox.getCtx(),
        indicatorIcon[DvtNBoxConstants.SHAPE],
        DvtCSSStyle.SKIN_ALTA,
        (rtl ? 1 : -1) * (side - indicatorWidth) / 2,
        0,
        indicatorIcon[DvtNBoxConstants.WIDTH] * indicatorIconScale,
        indicatorIcon[DvtNBoxConstants.HEIGHT] * indicatorIconScale);
    if (indicatorIcon[DvtNBoxConstants.PATTERN] && indicatorIcon[DvtNBoxConstants.PATTERN] != 'none') {
      indicatorMarker.setFill(new DvtPatternFill(indicatorIcon[DvtNBoxConstants.PATTERN], indicatorIconColor, color));
    }
    else {
      indicatorMarker.setSolidFill(indicatorIconColor);
    }
    nodeContainer.addChild(indicatorMarker);
    DvtNBoxDataUtils.setDisplayable(nbox, node, indicatorMarker, DvtNBoxConstants.INDICATOR_ICON);
    retVal = true;
  }
  return retVal;
};


/**
 * Renders the node count
 * @param {DvtNBox} nbox
 * @param {object} node the node data being rendered
 * @param {DvtNBoxCategoryNode} nodeContainer the container for the node contents
 * @param {number} scale The number of pixels per unit (used to determine the size of this category node based on its node count)
 * @param {boolean} bIndicator true if an indicator was rendered, false otherwise
 * @param {number} gap The number of pixels to shrink this node (to leave padding in the force layout)
 */
DvtNBoxCategoryNodeRenderer._renderNodeCount = function(nbox, node, nodeContainer, scale, bIndicator, gap) {
  var options = nbox.getOptions();
  var labelGap = options['__layout']['categoryNodeLabelGap'];

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

  var alphaFade = DvtNBoxStyleUtils.getFadedNodeAlpha(nbox);
  var highlightedItems = DvtNBoxDataUtils.getHighlightedItems(nbox);
  var label = DvtNBoxDataUtils.getDisplayable(nbox, node, 'label');
  var count;
  if (highlightedItems) {
    count = node['highlightedCount'];
    if (count == 0) {
      if (label)
        label.setTextString('');
      nodeContainer.setAlpha(alphaFade);
      return;
    }
  }
  else {
    count = node['nodeIndices'].length;
  }
  var side = scale * Math.sqrt(node['nodeIndices'].length) - gap;
  var width = bIndicator ? .75 * side : side;
  var countX = (rtl ? -1 : 1) * (side - width) / 2;
  var color = DvtNBoxStyleUtils.getCategoryNodeColor(nbox, node);
  var contrastColor = DvtColorUtils.getContrastingTextColor(color);
  var labelBounds = new DvtRectangle(0, 0, width - 2 * labelGap, side - 2 * labelGap);
  if (label)
    label.setTextString('' + count);
  else {
    label = DvtNBoxRenderer.createText(nbox.getCtx(), '' + count, DvtNBoxStyleUtils.getCategoryNodeLabelStyle(nbox), DvtOutputText.H_ALIGN_CENTER, DvtOutputText.V_ALIGN_MIDDLE);
    DvtNBoxDataUtils.setDisplayable(nbox, node, label, 'label');
  }
  var fontSize = label.getOptimalFontSize(labelBounds);
  label.setFontSize(fontSize);
  if (DvtTextUtils.fitText(label, width - 2 * labelGap, side - 2 * labelGap, nodeContainer)) {
    DvtNBoxRenderer.positionText(label, countX, 0);
    label.setSolidFill(contrastColor);
  }
};


/**
 * @override
 */
DvtNBoxCategoryNodeRenderer.animateUpdate = function(animationHandler, oldNode, newNode) {
  var oldGlobalMatrix = DvtNBoxRenderer.getGlobalMatrix(oldNode);
  var newGlobalMatrix = DvtNBoxRenderer.getGlobalMatrix(newNode);
  var newMatrix = newNode.getMatrix();
  var parent = newNode.getParent();
  oldNode.setAlpha(0);
  animationHandler.getNewNBox().addChild(newNode);
  newNode.setMatrix(oldGlobalMatrix);
  var playable = new DvtAnimMoveTo(newNode.getCtx(), newNode, new DvtPoint(newGlobalMatrix.getTx(), newGlobalMatrix.getTy()), animationHandler.getAnimationDuration());
  DvtPlayable.appendOnEnd(playable, function() {parent.addChild(newNode); newNode.setMatrix(newMatrix)});
  animationHandler.add(playable, DvtNBoxDataAnimationHandler.UPDATE);
};


/**
 * @override
 */
DvtNBoxCategoryNodeRenderer.animateDelete = function(animationHandler, oldNode) {
  var animationPhase = DvtNBoxDataAnimationHandler.UPDATE;

  var oldNBox = animationHandler.getOldNBox();
  var newNBox = animationHandler.getNewNBox();

  if (DvtNBoxCategoryNodeRenderer.isMaximizeEqual(oldNBox, newNBox) && DvtNBoxCategoryNodeRenderer.isGroupingEqual(oldNBox, newNBox)) {
    // The grouping didn't change so the nodes represented these nodes were actually inserted/unhidden
    animationPhase = DvtNBoxDataAnimationHandler.DELETE;
  }

  var scalePlayable = new DvtAnimScaleTo(newNBox.getCtx(), oldNode, new DvtPoint(.01, .01), animationHandler.getAnimationDuration());
  animationHandler.add(scalePlayable, animationPhase);

  var fadePlayable = new DvtAnimFadeOut(newNBox.getCtx(), oldNode, animationHandler.getAnimationDuration());
  animationHandler.add(fadePlayable, animationPhase);

  oldNode.setMatrix(DvtNBoxRenderer.getGlobalMatrix(oldNode));
  newNBox.getDeleteContainer().addChild(oldNode);
};


/**
 * @override
 */
DvtNBoxCategoryNodeRenderer.animateInsert = function(animationHandler, newNode) {
  var animationPhase = DvtNBoxDataAnimationHandler.UPDATE;

  var oldNBox = animationHandler.getOldNBox();
  var newNBox = animationHandler.getNewNBox();

  if (DvtNBoxCategoryNodeRenderer.isMaximizeEqual(oldNBox, newNBox) && DvtNBoxCategoryNodeRenderer.isGroupingEqual(oldNBox, newNBox)) {
    // The grouping didn't change so the nodes represented these nodes were actually inserted/unhidden
    animationPhase = DvtNBoxDataAnimationHandler.INSERT;
  }

  newNode.setScaleX(0.01);
  newNode.setScaleY(0.01);
  var scalePlayable = new DvtAnimScaleTo(newNBox.getCtx(), newNode, new DvtPoint(1, 1), animationHandler.getAnimationDuration());
  animationHandler.add(scalePlayable, animationPhase);

  var fadeAnim = new DvtCustomAnimation(newNBox.getCtx(), newNode, animationHandler.getAnimationDuration());
  fadeAnim.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, newNode, newNode.getAlpha, newNode.setAlpha, newNode.getAlpha());
  animationHandler.add(fadeAnim, animationPhase);

  newNode.setAlpha(0);

};


/**
 * Determines whether the grouping is the same between two nbox states
 *
 * @param {object} oldNBox an object representing the old NBox state
 * @param {DvtNBox] newNBox the new NBox
 *}
 * @return {boolean} true if the grouping is the same, false otherwise
 */
DvtNBoxCategoryNodeRenderer.isGroupingEqual = function(oldNBox, newNBox) {
  var oldGroupBehavior = DvtNBoxDataUtils.getGroupBehavior(oldNBox);
  var newGroupBehavior = DvtNBoxDataUtils.getGroupBehavior(newNBox);

  var oldNodeCount = DvtNBoxDataUtils.getNodeCount(oldNBox);
  var newNodeCount = DvtNBoxDataUtils.getNodeCount(newNBox);

  var identical = false;
  if (oldGroupBehavior == newGroupBehavior && oldNodeCount == newNodeCount) {
    identical = true;
    for (var i = 0; i < oldNodeCount; i++) {
      var oldCategory = DvtNBoxDataUtils.getNodeGroupId(DvtNBoxDataUtils.getNode(oldNBox, i));
      var newCategory = DvtNBoxDataUtils.getNodeGroupId(DvtNBoxDataUtils.getNode(newNBox, i));
      if (oldCategory != newCategory) {
        identical = false;
        break;
      }
    }
  }
  return identical;
};


/**
 * Determines whether the maximize is the same between two nbox states
 *
 * @param {object} oldNBox an object representing the old NBox state
 * @param {DvtNBox} newNBox the new NBox
 *
 * @return {boolean} true if the maximize is the same, false otherwise
 */
DvtNBoxCategoryNodeRenderer.isMaximizeEqual = function(oldNBox, newNBox) {
  var oldMaximizedRow = DvtNBoxDataUtils.getMaximizedRow(oldNBox);
  var oldMaximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(oldNBox);
  var newMaximizedRow = DvtNBoxDataUtils.getMaximizedRow(newNBox);
  var newMaximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(newNBox);

  return oldMaximizedRow == newMaximizedRow && oldMaximizedColumn == newMaximizedColumn;
};


/**
 * @private
 * Adds accessibility attributes to the object
 * @param {DvtNBox} nbox the nbox
 * @param {DvtNBoxCategoryNode} object the object that should be updated with accessibility attributes
 */
DvtNBoxCategoryNodeRenderer._addAccessibilityAttributes = function(nbox, object) {
  object.setAriaRole('img');
  if (!DvtAgent.deferAriaCreation()) {
    var desc = object.getAriaLabel();
    if (desc)
      object.setAriaProperty(DvtNBoxConstants.LABEL, desc);
  }
};
// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.


/**
 * Renderer for DvtNBoxDrawer.
 * @class
 */
var DvtNBoxDrawerRenderer = new Object();

DvtObj.createSubclass(DvtNBoxDrawerRenderer, DvtObj, 'DvtNBoxDrawerRenderer');


/**
 * Renders the nbox drawer
 * @param {DvtNBox} nbox The nbox component
 * @param {object} data the data associated with the currently open group
 * @param {DvtNBoxDrawer} drawerContainer The container to render into.
 * @param {DvtRectangle} availSpace The available space.
 */
DvtNBoxDrawerRenderer.render = function(nbox, data, drawerContainer, availSpace) {
  var drawerBounds = DvtNBoxDrawerRenderer.getDrawerBounds(nbox, data, availSpace);
  data['__drawerBounds'] = drawerBounds;
  drawerContainer.setTranslate(drawerBounds.x, drawerBounds.y);

  var keyboardFocusEffect = new DvtKeyboardFocusEffect(nbox.getCtx(), drawerContainer, new DvtRectangle(-1, -1, drawerBounds.w + 2, drawerBounds.h + 2));
  DvtNBoxDataUtils.setDisplayable(nbox, data, keyboardFocusEffect, 'focusEffect');

  DvtNBoxDrawerRenderer._renderBody(nbox, data, drawerContainer);
  DvtNBoxDrawerRenderer._renderHeader(nbox, data, drawerContainer);
  DvtNBoxDrawerRenderer._addAccessibilityAttributes(nbox, data, drawerContainer);
};


/**
 * Renders the nbox drawer header
 * @param {DvtNBox} nbox The nbox component
 * @param {object} data the data associated with the currently open group
 * @param {DvtNBoxDrawer} drawerContainer The container to render into.
 * @private
 */
DvtNBoxDrawerRenderer._renderHeader = function(nbox, data, drawerContainer) {
  var options = nbox.getOptions();
  var drawerButtonGap = options['__layout']['drawerButtonGap'];
  var drawerStartGap = options['__layout']['drawerStartGap'];
  var drawerLabelGap = options['__layout']['drawerLabelGap'];
  var drawerCountHGap = options['__layout']['drawerCountHorizontalGap'];
  var drawerCountVGap = options['__layout']['drawerCountVerticalGap'];
  var drawerHeaderHeight = options['__layout']['drawerHeaderHeight'];
  var indicatorGap = options['__layout']['nodeIndicatorGap'];
  var swatchSize = options['__layout']['nodeSwatchSize'];

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

  var categoryNode = DvtNBoxDataUtils.getCategoryNode(nbox, data[DvtNBoxConstants.ID]);
  var nodeCount = categoryNode['nodeIndices'].length;

  var drawerBounds = data['__drawerBounds'];

  // Render the close button
  var closeEna = options['_resources']['close_ena'];
  var closeWidth = closeEna['width'];
  if (drawerBounds.w > closeWidth) {
    var closeOvr = options['_resources']['close_ovr'];
    var closeDwn = options['_resources']['close_dwn'];
    var closeHeight = closeEna['height'];
    var closeEnaImg = new DvtImage(nbox.getCtx(), closeEna['src'], 0, 0, closeEna['width'], closeEna['height']);
    var closeOvrImg = new DvtImage(nbox.getCtx(), closeOvr['src'], 0, 0, closeOvr['width'], closeOvr['height']);
    var closeDwnImg = new DvtImage(nbox.getCtx(), closeDwn['src'], 0, 0, closeDwn['width'], closeDwn['height']);
    var closeButton = new DvtButton(nbox.getCtx(), closeEnaImg, closeOvrImg, closeDwnImg, null, null, drawerContainer.closeDrawer, drawerContainer);

    // Center/hide close button if drawer too thin for normal rendering
    var closeButtonX = rtl ? Math.min((drawerBounds.w - closeWidth) / 2, drawerButtonGap) : Math.max((drawerBounds.w - closeWidth) / 2, drawerBounds.w - drawerButtonGap - closeWidth);
    closeButton.setTranslate(closeButtonX,
                             drawerHeaderHeight / 2 - closeHeight / 2);
    drawerContainer.addChild(closeButton);
  }


  // Render the count indicator
  var countColor = DvtNBoxStyleUtils.getCategoryNodeColor(nbox, categoryNode);
  var contrastColor = DvtColorUtils.getContrastingTextColor(countColor);
  var indicatorColor = DvtNBoxStyleUtils.getCategoryNodeIndicatorColor(nbox, categoryNode);
  var indicatorIconColor = indicatorColor ? DvtColorUtils.getContrastingTextColor(indicatorColor) : contrastColor;
  var indicatorIcon = DvtNBoxStyleUtils.getStyledCategoryIndicatorIcon(nbox, categoryNode);
  var indicatorIconWidth = swatchSize;
  var scale = 1;
  if (indicatorIcon) {
    var indicatorIconW = indicatorIcon[DvtNBoxConstants.WIDTH];
    var indicatorIconH = indicatorIcon[DvtNBoxConstants.HEIGHT];
    scale = swatchSize / indicatorIconH;
    indicatorIconWidth = scale * indicatorIconW;
    indicatorIconColor = indicatorIcon[DvtNBoxConstants.COLOR] ? indicatorIcon[DvtNBoxConstants.COLOR] : indicatorIconColor;
  }

  var countBorderRadius = DvtNBoxStyleUtils.getDrawerCountBorderRadius(nbox);

  var halign = rtl ? DvtOutputText.H_ALIGN_RIGHT : DvtOutputText.H_ALIGN_LEFT;
  var countLabel = DvtNBoxRenderer.createText(nbox.getCtx(), '' + nodeCount, DvtNBoxStyleUtils.getDrawerCountLabelStyle(nbox), halign, DvtOutputText.V_ALIGN_MIDDLE);
  var countLabelDims = countLabel.measureDimensions();
  var countLabelWidth = countLabelDims.w;
  var countLabelHeight = countLabelDims.h;
  var countIndicatorHeight = countLabelHeight + 2 * drawerCountVGap;
  var countIndicatorSectionWidth = indicatorIcon ? indicatorIconWidth + 2 * indicatorGap : (indicatorColor ? swatchSize : 0);
  var countLabelSectionWidth = countLabelWidth + 2 * drawerCountHGap;
  var countIndicatorWidth = countIndicatorSectionWidth + countLabelSectionWidth;
  var countIndicatorShape;
  if (drawerBounds.w - closeWidth - 2 * drawerButtonGap - drawerStartGap > countIndicatorWidth) {
    var countIndicatorPath = DvtPathUtils.roundedRectangle(0, 0, countIndicatorWidth, countIndicatorHeight, countBorderRadius, countBorderRadius, countBorderRadius, countBorderRadius);
    countIndicatorShape = new DvtPath(nbox.getCtx(), countIndicatorPath);
    countIndicatorShape.setSolidFill(countColor);
    drawerContainer.addChild(countIndicatorShape);

    var indicatorX = rtl ? countLabelSectionWidth : 0;
    if (countIndicatorSectionWidth > 0) {
      if (indicatorColor) {
        var indicatorSectionPath = DvtPathUtils.roundedRectangle(indicatorX,
                                                                 0,
                                                                 countIndicatorSectionWidth,
                                                                 countIndicatorHeight,
                                                                 rtl ? 0 : countBorderRadius,
                                                                 rtl ? countBorderRadius : 0,
                                                                 rtl ? countBorderRadius : 0,
                                                                 rtl ? 0 : countBorderRadius);
        var indicatorSection = new DvtPath(nbox.getCtx(), indicatorSectionPath);
        indicatorSection.setSolidFill(indicatorColor);
        countIndicatorShape.addChild(indicatorSection);
      }
      if (indicatorIcon) {
        var indicatorMarker = new DvtSimpleMarker(nbox.getCtx(),
            indicatorIcon[DvtNBoxConstants.SHAPE],
            DvtCSSStyle.SKIN_ALTA,
            indicatorX + countIndicatorSectionWidth / 2,
            countIndicatorHeight / 2,
            indicatorIcon[DvtNBoxConstants.WIDTH] * scale,
            indicatorIcon[DvtNBoxConstants.HEIGHT] * scale);
        if (indicatorIcon[DvtNBoxConstants.PATTERN] && indicatorIcon[DvtNBoxConstants.PATTERN] != 'none') {
          indicatorMarker.setFill(new DvtPatternFill(indicatorIcon[DvtNBoxConstants.PATTERN], indicatorIconColor, indicatorColor ? indicatorColor : countColor));
        }
        else {
          indicatorMarker.setSolidFill(indicatorIconColor);
        }
        countIndicatorShape.addChild(indicatorMarker);
      }
    }

    countIndicatorShape.addChild(countLabel);
    countLabel.setSolidFill(contrastColor);
    var countLabelX = rtl ? countLabelSectionWidth - drawerCountHGap : countIndicatorSectionWidth + drawerCountHGap;
    DvtNBoxRenderer.positionText(countLabel, countLabelX, countIndicatorHeight / 2);
  }

  // Render the category label
  var categoryText = DvtNBoxDataUtils.getDisplayable(nbox, categoryNode).getLabel();
  var categoryLabel = DvtNBoxRenderer.createText(nbox.getCtx(), categoryText, DvtNBoxStyleUtils.getDrawerLabelStyle(nbox), halign, DvtOutputText.V_ALIGN_MIDDLE);
  var labelOffset = 0;
  if (DvtTextUtils.fitText(categoryLabel, drawerBounds.w - drawerStartGap - drawerLabelGap - countIndicatorWidth - 2 * drawerButtonGap - closeWidth, drawerHeaderHeight, drawerContainer)) {
    var labelX = rtl ? drawerBounds.w - drawerStartGap : drawerStartGap;
    DvtNBoxRenderer.positionText(categoryLabel, labelX, drawerHeaderHeight / 2);
    var categoryLabelDims = categoryLabel.measureDimensions();
    labelOffset = categoryLabelDims.w + drawerLabelGap;
  }

  // Position the count indicator
  if (countIndicatorShape) {
    var countIndicatorX = rtl ? drawerBounds.w - drawerStartGap - countIndicatorWidth - labelOffset : drawerStartGap + labelOffset;
    countIndicatorShape.setTranslate(countIndicatorX, (drawerHeaderHeight - countIndicatorHeight) / 2);
  }

};


/**
 * Renders the nbox drawer body
 * @param {DvtNBox} nbox The nbox component
 * @param {object} data the data associated with the currently open group
 * @param {DvtNBoxDrawer} drawerContainer The container to render into.
 * @private
 */
DvtNBoxDrawerRenderer._renderBody = function(nbox, data, drawerContainer) {
  var options = nbox.getOptions();
  var gridGap = options['__layout']['gridGap'];
  var drawerHeaderHeight = options['__layout']['drawerHeaderHeight'];
  var drawerBounds = data['__drawerBounds'];

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());

  // Render the body shape
  var borderRadius = DvtNBoxStyleUtils.getDrawerBorderRadius(nbox);
  var borderColor = DvtNBoxStyleUtils.getDrawerBorderColor(nbox);

  var bodyPath = DvtPathUtils.roundedRectangle(0, 0, drawerBounds.w, drawerBounds.h, borderRadius, borderRadius, borderRadius, borderRadius);
  var body = new DvtPath(nbox.getCtx(), bodyPath);
  DvtNBoxRenderer.setFill(body, DvtNBoxStyleUtils.getDrawerBackground(nbox));
  body.setSolidStroke(borderColor);
  body.setPixelHinting(true);
  drawerContainer.addChild(body);
  DvtNBoxDataUtils.setDisplayable(nbox, data, body, 'background');

  // Render the nodes
  data['__childArea'] = new DvtRectangle(gridGap, drawerHeaderHeight + gridGap, Math.max(drawerBounds.w - 2 * gridGap, 0), Math.max(drawerBounds.h - drawerHeaderHeight - 2 * gridGap, 0));
  var scrollContainer = new DvtSimpleScrollableContainer(nbox.getCtx(), drawerBounds.w, drawerBounds.h - drawerHeaderHeight);
  scrollContainer.setTranslate(0, drawerHeaderHeight);
  drawerContainer.addChild(scrollContainer);
  drawerContainer.setChildContainer(scrollContainer);

  // If no nodes are highlighted, make a single pass through the nodes for rendering
  // If some nodes are highlighted, make two passes, first rendering the highlighted nodes, then the unhighlighted nodes
  var orderPasses = ['normal'];
  var alphaFade = DvtNBoxStyleUtils.getFadedNodeAlpha(nbox);
  var highlightedItems = DvtNBoxDataUtils.getHighlightedItems(nbox);
  var highlightedMap = {};
  if (highlightedItems) {
    for (var i = 0; i < highlightedItems.length; i++) {
      highlightedMap[highlightedItems[i][DvtNBoxConstants.ID]] = true;
    }
  }

  var selectedItems = DvtNBoxDataUtils.getSelectedItems(nbox);
  var selectedMap = {};
  if (selectedItems) {
    for (var i = 0; i < selectedItems.length; i++) {
      selectedMap[selectedItems[i]] = true;
    }
  }

  if (highlightedItems) {
    if (selectedItems)
      orderPasses = ['highlighted-selected', 'highlighted-unselected', 'unhighlighted-selected', 'unhighlighted-unselected'];
    else
      orderPasses = ['highlighted-unselected', 'unhighlighted-unselected'];
  }
  else if (selectedItems) {
    orderPasses = ['unhighlighted-selected', 'unhighlighted-unselected'];
  }

  var nodes = [];
  var categoryNode = DvtNBoxDataUtils.getCategoryNode(nbox, data[DvtNBoxConstants.ID]);
  var nodeCount = categoryNode['nodeIndices'].length;
  for (var p = 0; p < orderPasses.length; p++) {
    for (var n = 0; n < nodeCount; n++) {
      var node = DvtNBoxDataUtils.getNode(nbox, categoryNode['nodeIndices'][n]);
      if (orderPasses[p] == 'normal' ||
          (orderPasses[p] == 'highlighted-selected' && highlightedMap[node[DvtNBoxConstants.ID]] && selectedMap[node[DvtNBoxConstants.ID]]) ||
          (orderPasses[p] == 'highlighted-unselected' && highlightedMap[node[DvtNBoxConstants.ID]] && !selectedMap[node[DvtNBoxConstants.ID]]) ||
          (orderPasses[p] == 'unhighlighted-selected' && !highlightedMap[node[DvtNBoxConstants.ID]] && selectedMap[node[DvtNBoxConstants.ID]]) ||
          (orderPasses[p] == 'unhighlighted-unselected' && !highlightedMap[node[DvtNBoxConstants.ID]] && !selectedMap[node[DvtNBoxConstants.ID]])) {
        nodes.push(node);
      }
    }
  }

  var nodeLayout = DvtNBoxNodeRenderer.calculateNodeDrawerLayout(nbox, data, nodes);
  var hGridSize = nodeLayout['indicatorSectionWidth'] + nodeLayout['iconSectionWidth'] + nodeLayout['labelSectionWidth'] + gridGap;
  var vGridSize = nodeLayout['nodeHeight'] + gridGap;

  var container = DvtNBoxDataUtils.getDisplayable(nbox, data).getChildContainer();
  for (var n = 0; n < nodes.length; n++) {
    var node = nodes[n];
    if (nodeLayout['drawerLayout'][DvtNBoxConstants.COLUMNS] != 0 && nodeLayout['drawerLayout'][DvtNBoxConstants.ROWS] != 0) {
      var nodeContainer = DvtNBoxNode.newInstance(nbox, node);
      var gridXOrigin = data['__childArea'].x + (data['__childArea'].w - nodeLayout['drawerLayout'][DvtNBoxConstants.COLUMNS] * hGridSize + gridGap) / 2;
      var gridYOrigin = gridGap;
      var gridColumn = (n % nodeLayout['drawerLayout'][DvtNBoxConstants.COLUMNS]);
      if (rtl) {
        gridColumn = nodeLayout['drawerLayout'][DvtNBoxConstants.COLUMNS] - gridColumn - 1;
      }
      var gridRow = Math.floor((n / nodeLayout['drawerLayout'][DvtNBoxConstants.COLUMNS]));
      nodeContainer.setTranslate(gridXOrigin + hGridSize * gridColumn, gridYOrigin + vGridSize * gridRow);
      nodeContainer.render(container.getScrollingPane(), nodeLayout);
      if (highlightedItems && !highlightedMap[node[DvtNBoxConstants.ID]]) {
        nodeContainer.setAlpha(alphaFade);
      }

      //keyboard navigation
      var prevNode = n > 0 ? nodes[n - 1] : null;
      if (prevNode) {
        node['__prev'] = prevNode;
        prevNode['__next'] = node;
      }
    }
  }
  container.prepareContentPane();
};


/**
 * Gets the drawer bounds
 *
 * @param {DvtNBox} nbox The nbox component
 * @param {object} data the data associated with the currently open group
 * @param {DvtRectangle} availSpace The available space.
 *
 * @return {DvtRectangle} the drawer bounds
 */
DvtNBoxDrawerRenderer.getDrawerBounds = function(nbox, data, availSpace) {
  var options = nbox.getOptions();
  var gridGap = options['__layout']['gridGap'];
  var cellLayout = options['__layout']['__cellLayout'];
  var drawerBounds = new DvtRectangle(availSpace.x + gridGap, availSpace.y + gridGap, Math.max(availSpace.w - 2 * gridGap, 0), Math.max(availSpace.h - 2 * gridGap, 0));
  var groupBehavior = DvtNBoxDataUtils.getGroupBehavior(nbox);
  if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
    var cellIndex = parseInt(data['id'].substring(0, data[DvtNBoxConstants.ID].indexOf(':')));
    if (DvtNBoxDataUtils.isCellMaximized(nbox, cellIndex)) {
      var cell = DvtNBoxDataUtils.getCell(nbox, cellIndex);
      var r = DvtNBoxDataUtils.getRowIndex(nbox, cell[DvtNBoxConstants.ROW]);
      var c = DvtNBoxDataUtils.getColumnIndex(nbox, cell[DvtNBoxConstants.COLUMN]);
      var cellDims = DvtNBoxCellRenderer.getCellDimensions(nbox, r, c, cellLayout, availSpace);
      drawerBounds = new DvtRectangle(cellDims.x + gridGap, cellDims.y + gridGap + cellLayout['headerSize'], Math.max(cellDims.w - 2 * gridGap, 0), Math.max(cellDims.h - cellLayout['headerSize'] - 2 * gridGap, 0));
    }
  }
  return drawerBounds;
};


/**
 * @override
 */
DvtNBoxDrawerRenderer.animateUpdate = function(animationHandler, oldDrawer, newDrawer) {
  // TODO
  console.log('********************* DvtNBoxDrawerRenderer.animateUpdate *********************');
};


/**
 * @override
 */
DvtNBoxDrawerRenderer.animateDelete = function(animationHandler, oldDrawer) {
  var animationPhase = DvtNBoxDataAnimationHandler.UPDATE;

  var newNBox = animationHandler.getNewNBox();
  var drawerBounds = oldDrawer.getData()['__drawerBounds'];
  var id = oldDrawer.getData()[DvtNBoxConstants.ID];
  var group = DvtNBoxDataUtils.getCategoryNode(newNBox, id);
  if (group) {
    var sideLength = DvtNBoxCategoryNodeRenderer.getSideLength(group);
    var scaleX = sideLength / drawerBounds.w;
    var scaleY = sideLength / drawerBounds.h;
    var groupNode = DvtNBoxDataUtils.getDisplayable(newNBox, group);
    if (groupNode) {
      var centerMatrix = DvtNBoxRenderer.getGlobalMatrix(groupNode);
      var finalMatrix = new DvtMatrix(scaleX, 0, 0, scaleY, centerMatrix.getTx() - sideLength / 2, centerMatrix.getTy() - sideLength / 2);
      var playable = new DvtCustomAnimation(newNBox.getCtx(), oldDrawer, animationHandler.getAnimationDuration());
      playable.getAnimator().addProp(DvtAnimator.TYPE_MATRIX, oldDrawer, oldDrawer.getMatrix, oldDrawer.setMatrix, finalMatrix);
      animationHandler.add(playable, animationPhase);
    }
  }
  newNBox.getDeleteContainer().addChild(oldDrawer);
  var fadePlayable = new DvtAnimFadeOut(newNBox.getCtx(), oldDrawer, animationHandler.getAnimationDuration());
  animationHandler.add(fadePlayable, animationPhase);
};


/**
 * @override
 */
DvtNBoxDrawerRenderer.animateInsert = function(animationHandler, newDrawer) {
  var animationPhase = DvtNBoxDataAnimationHandler.UPDATE;

  var newNBox = animationHandler.getNewNBox();
  var drawerBounds = newDrawer.getData()['__drawerBounds'];
  var id = newDrawer.getData()[DvtNBoxConstants.ID];
  var group = DvtNBoxDataUtils.getCategoryNode(newNBox, id);
  if (group) {
    var sideLength = DvtNBoxCategoryNodeRenderer.getSideLength(group);
    var scaleX = sideLength / drawerBounds.w;
    var scaleY = sideLength / drawerBounds.h;
    var groupNode = DvtNBoxDataUtils.getDisplayable(newNBox, group);
    if (groupNode) {
      var centerMatrix = DvtNBoxRenderer.getGlobalMatrix(groupNode);
      var initMatrix = new DvtMatrix(scaleX, 0, 0, scaleY, centerMatrix.getTx() - sideLength / 2, centerMatrix.getTy() - sideLength / 2);
      var playable = new DvtCustomAnimation(newNBox.getCtx(), newDrawer, animationHandler.getAnimationDuration());
      playable.getAnimator().addProp(DvtAnimator.TYPE_MATRIX, newDrawer, newDrawer.getMatrix, newDrawer.setMatrix, newDrawer.getMatrix());
      var parent = newDrawer.getParent();
      newNBox.addChild(newDrawer);
      DvtPlayable.appendOnEnd(playable, function() {parent.addChild(newDrawer)});
      newDrawer.setMatrix(initMatrix);
      animationHandler.add(playable, animationPhase);
    }
  }
  newDrawer.setAlpha(0);
  var fadePlayable = new DvtAnimFadeIn(newNBox.getCtx(), newDrawer, animationHandler.getAnimationDuration());
  animationHandler.add(fadePlayable, animationPhase);
};


/**
 * @private
 * Adds accessibility attributes to the object
 * @param {DvtNBox} nbox The nbox component
 * @param {object} data the data associated with the currently open group
 * @param {DvtNBoxDrawer} drawerContainer the object that should be updated with accessibility attributes
 */
DvtNBoxDrawerRenderer._addAccessibilityAttributes = function(nbox, data, drawerContainer) {
  var object = DvtAgent.isTouchDevice() ? DvtNBoxDataUtils.getDisplayable(nbox, data, 'background') : drawerContainer;
  object.setAriaRole('img');
  if (!DvtAgent.deferAriaCreation()) {
    var desc = drawerContainer.getAriaLabel();
    if (desc)
      object.setAriaProperty(DvtNBoxConstants.LABEL, desc);
  }
};
/**
 * Data related utility functions for DvtNBox.
 * @class
 */
var DvtNBoxDataUtils = new Object();

DvtObj.createSubclass(DvtNBoxDataUtils, DvtObj, 'DvtNBoxDataUtils');


/**
 * Processes the data object.  Generates and sorts cells if not specified
 * @param {DvtNBox} nbox the nbox component
 */
DvtNBoxDataUtils.processDataObject = function(nbox) {
  var options = nbox.getOptions();
  var cells = options[DvtNBoxConstants.CELLS];
  var cellMap = {};
  if (cells) {
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var row = cell[DvtNBoxConstants.ROW];
      if (!cellMap[row]) {
        cellMap[row] = {};
      }
      var column = cell[DvtNBoxConstants.COLUMN];
      cellMap[row][column] = cell;
    }
  }
  var newCells = [];
  var rowMap = {};
  var columnMap = {};
  // Process rows
  for (var r = 0; r < DvtNBoxDataUtils.getRowCount(nbox); r++) {
    var rowObj = DvtNBoxDataUtils.getRow(nbox, r);
    rowMap[rowObj[DvtNBoxConstants.ID]] = r;
  }
  options['__rowMap'] = rowMap;

  // Process columns
  for (var c = 0; c < DvtNBoxDataUtils.getColumnCount(nbox); c++) {
    var columnObj = DvtNBoxDataUtils.getColumn(nbox, c);
    columnMap[columnObj[DvtNBoxConstants.ID]] = c;
  }
  options['__columnMap'] = columnMap;

  // Process cells
  for (var r = 0; r < DvtNBoxDataUtils.getRowCount(nbox); r++) {
    var rowObj = DvtNBoxDataUtils.getRow(nbox, r);
    var row = rowObj[DvtNBoxConstants.ID];
    for (var c = 0; c < DvtNBoxDataUtils.getColumnCount(nbox); c++) {
      var columnObj = DvtNBoxDataUtils.getColumn(nbox, c);
      var column = columnObj[DvtNBoxConstants.ID];
      if (cellMap[row] && cellMap[row][column]) {
        var cellObj = cellMap[row][column];
        newCells.push(cellObj);
      }
      else {
        newCells.push({'row': row, 'column': column});
      }
    }
  }
  options[DvtNBoxConstants.CELLS] = newCells;
  var nodeMap = {};
  var grouping = false;
  for (var n = 0; n < DvtNBoxDataUtils.getNodeCount(nbox); n++) {
    var nodeObj = DvtNBoxDataUtils.getNode(nbox, n);
    nodeMap[nodeObj[DvtNBoxConstants.ID]] = n;
    if (!grouping &&
        (nodeObj[DvtNBoxConstants.GROUP_CATEGORY] ||
         nodeObj['_groupCategories'] ||
         nodeObj['_groupLabels']))
      grouping = true;
  }
  options['__nodeMap'] = nodeMap;
  options['__grouping'] = options[DvtNBoxConstants.GROUP_BEHAVIOR] != 'none' ? grouping : false;

  // Disable maximize if we're grouping across cells
  if (DvtNBoxDataUtils.getGrouping(nbox) && DvtNBoxDataUtils.getGroupBehavior(nbox) == DvtNBoxConstants.GROUP_BEHAVIOR_ACROSS_CELLS) {
    options[DvtNBoxConstants.MAXIMIZED_ROW] = null;
    DvtNBoxDataUtils.fireSetPropertyEvent(nbox, DvtNBoxConstants.MAXIMIZED_ROW, null);
    options[DvtNBoxConstants.MAXIMIZED_COLUMN] = null;
    DvtNBoxDataUtils.fireSetPropertyEvent(nbox, DvtNBoxConstants.MAXIMIZED_COLUMN, null);
  }
  // Disable maximize if either row or column is invalid
  if ((options[DvtNBoxConstants.MAXIMIZED_ROW] && isNaN(rowMap[options[DvtNBoxConstants.MAXIMIZED_ROW]])) ||
      (options[DvtNBoxConstants.MAXIMIZED_COLUMN] && isNaN(columnMap[options[DvtNBoxConstants.MAXIMIZED_COLUMN]]))) {
    options[DvtNBoxConstants.MAXIMIZED_ROW] = null;
    DvtNBoxDataUtils.fireSetPropertyEvent(nbox, DvtNBoxConstants.MAXIMIZED_ROW, null);
    options[DvtNBoxConstants.MAXIMIZED_COLUMN] = null;
    DvtNBoxDataUtils.fireSetPropertyEvent(nbox, DvtNBoxConstants.MAXIMIZED_COLUMN, null);
  }
  // Process legend
  var legend = options[DvtNBoxConstants.LEGEND];
  if (legend && legend['sections']) {
    var legendPrecedence = ['color',
                            'iconFill',
                            'iconShape',
                            'iconPattern',
                            'indicatorColor',
                            'indicatorIconColor',
                            'indicatorIconShape',
                            'indicatorIconPattern'];

    legend['sections'] = legend['sections'].slice(0);
    var sortFunc = function(a, b) {
      return DvtArrayUtils.getIndex(legendPrecedence, a['type']) - DvtArrayUtils.getIndex(legendPrecedence, b['type']);
    };
    legend['sections'].sort(sortFunc);
    var hiddenCategories = options[DvtNBoxConstants.HIDDEN_CATEGORIES];

    // Generate the legend
    legend['hideAndShowBehavior'] = 'on';
    legend['textStyle'] = options['styleDefaults']['__legendDefaults']['itemStyle'];
    //N.B. - The rowGap value specifies an additional gap between legend items. The default gap is 4px. By specifying 2 we will get 6 px gap.
    legend['layout'] = {'rowGap': 2}; //TODO switch to public attrs once they're available
    legend['symbolWidth'] = 16;
    legend['symbolHeight'] = 16;
    for (var i = 0; i < legend['sections'].length; i++) {
      var section = legend['sections'][i];
      section['titleStyle'] = options['styleDefaults']['__legendDefaults']['sectionStyle'];
      for (var j = 0; j < section['items'].length; j++) {
        var item = section['items'][j];
        var category = item['categories'] && item['categories'].length > 0 ? item['categories'][0] : item['id'];
        item['categoryVisibility'] = DvtArrayUtils.getIndex(hiddenCategories, category) != -1 ? 'hidden' : null;
        if (item['indicatorColor']) {
          item['color'] = item['indicatorColor'];
        }
        if (!item['color']) {
          item['color'] = options['styleDefaults']['__legendDefaults']['markerColor'];
        }
        if (item['shape']) {
          item['markerShape'] = item['shape'];
        }
      }
    }
  }
};


/**
 * Gets the number of columns in the nbox
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {number} the number of columns in the nbox
 */
DvtNBoxDataUtils.getColumnCount = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.COLUMNS].length;
};


/**
 * Gets the number of rows in the nbox
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {number} the number of rows in the nbox
 */
DvtNBoxDataUtils.getRowCount = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.ROWS].length;
};

/**
 * Get the NBox column label for column value
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {String} colValue nbox column value
 * @return {String} nbox column label
 */
DvtNBoxDataUtils.getColumnLabel = function(nbox, colValue) {
  var col = DvtNBoxDataUtils.getColumn(nbox, DvtNBoxDataUtils.getColumnIndex(nbox, colValue));
  if (col && col[DvtNBoxConstants.LABEL])
    return col[DvtNBoxConstants.LABEL];
  return null;
};

/**
 * Get the NBox row label for row value
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {String} rowValue nbox row value
 * @return {String} nbox row label
 */
DvtNBoxDataUtils.getRowLabel = function(nbox, rowValue) {
  var row = DvtNBoxDataUtils.getRow(nbox, DvtNBoxDataUtils.getRowIndex(nbox, rowValue));
  if (row && row[DvtNBoxConstants.LABEL])
    return row[DvtNBoxConstants.LABEL];
  return null;
};

/**
 * Get the NBox cell for row value and column value
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {String} rowValue nbox row value
 * @param {String} columnValue nbox column value
 * @return {DvtNBoxCell}  nbox cell object
 */
DvtNBoxDataUtils.getCellByRowColumn = function(nbox, rowValue, columnValue) {
  var cell = DvtNBoxDataUtils.getCell(nbox, DvtNBoxDataUtils.getCellIndexByRowColumn(nbox, rowValue, columnValue));
  if (cell)
    return DvtNBoxDataUtils.getDisplayable(nbox, cell);
  return null;
};

/**
 * Get the NBox cell index for row value and column value
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {String} rowValue nbox row value
 * @param {String} columnValue nbox column value
 * @return {Number} nbox cell index
 */
DvtNBoxDataUtils.getCellIndexByRowColumn = function(nbox, rowValue, columnValue) {
  return DvtNBoxDataUtils.getColumnIndex(nbox, columnValue) +
      (DvtNBoxDataUtils.getRowIndex(nbox, rowValue) * DvtNBoxDataUtils.getColumnCount(nbox));
};

/**
 * Gets the data for the specified column index
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {number} columnIndex the column index
 * @return {object} the data for the specified column index
 */
DvtNBoxDataUtils.getColumn = function(nbox, columnIndex) {
  return nbox.getOptions()[DvtNBoxConstants.COLUMNS][columnIndex];
};


/**
 * Gets the data for the specified row index
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {number} rowIndex the row index
 * @return {object} the data for the specified row index
 */
DvtNBoxDataUtils.getRow = function(nbox, rowIndex) {
  return nbox.getOptions()[DvtNBoxConstants.ROWS][rowIndex];
};


/**
 * Gets the value of the maximized row
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {string} the value of the maximized row
 */
DvtNBoxDataUtils.getMaximizedRow = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.MAXIMIZED_ROW];
};


/**
 * Gets the value of the maximized column
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {string} the value of the maximized column
 */
DvtNBoxDataUtils.getMaximizedColumn = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.MAXIMIZED_COLUMN];
};


/**
 * Gets the index for the specified row value
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {string} row the row value
 * @return {number} the row index
 */
DvtNBoxDataUtils.getRowIndex = function(nbox, row) {
  return nbox.getOptions()['__rowMap'][row];
};


/**
 * Gets the index for the specified column value
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {string} column the column value
 * @return {number} the column index
 */
DvtNBoxDataUtils.getColumnIndex = function(nbox, column) {
  return nbox.getOptions()['__columnMap'][column];
};


/**
 * Gets the data for the specified cell index.  Note that after DvtNBoxDataUtils.processDataObject
 * has been called, cells are sorted in row-major order
 * @param {DvtNBox} nbox the nbox component
 * @param {number} cellIndex the cell index
 * @return {object} the data for the specified cell index
 */
DvtNBoxDataUtils.getCell = function(nbox, cellIndex) {
  return nbox.getOptions()[DvtNBoxConstants.CELLS][cellIndex];
};


/**
 * Gets the number of nodes in the nbox
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {number} the number of nodes in the nbox
 */
DvtNBoxDataUtils.getNodeCount = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.NODES] ? nbox.getOptions()[DvtNBoxConstants.NODES].length : 0;
};


/**
 * Gets the data for the specified node index
 * @param {DvtNBox} nbox the nbox component
 * @param {number} nodeIndex the node index
 * @return {object} the data for the specified node index
 */
DvtNBoxDataUtils.getNode = function(nbox, nodeIndex) {
  return nbox.getOptions()[DvtNBoxConstants.NODES][nodeIndex];
};


/**
 * Gets the index for the specified node id
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {string} id the node id
 * @return {number} the node index
 */
DvtNBoxDataUtils.getNodeIndex = function(nbox, id) {
  return nbox.getOptions()['__nodeMap'][id];
};


/**
 * Gets the cell index for the specified node
 * @param {DvtNBox} nbox the nbox component
 * @param {object} node the node data
 * @return {number} the cell index for the specified node
 */
DvtNBoxDataUtils.getCellIndex = function(nbox, node) {
  var nodeRowIndex = DvtNBoxDataUtils.getRowIndex(nbox, node[DvtNBoxConstants.ROW]);
  var nodeColumnIndex = DvtNBoxDataUtils.getColumnIndex(nbox, node[DvtNBoxConstants.COLUMN]);
  var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
  return nodeColumnIndex + nodeRowIndex * columnCount;
};


/**
 * Gets the icon for the specified node
 * @param {DvtNBox} nbox the nbox component
 * @param {object} node the node data
 * @return {object} the icon data for the specified node
 */
DvtNBoxDataUtils.getIcon = function(nbox, node) {
  if (node[DvtNBoxConstants.ICON]) {
    return DvtNBoxStyleUtils.getStyledIcon(nbox, node[DvtNBoxConstants.ICON]);
  }
  return null;
};


/**
 * Gets the indicator icon for the specified node
 * @param {DvtNBox} nbox the nbox component
 * @param {object} node the node data
 * @return {object} the indicator icon data for the specified node
 */
DvtNBoxDataUtils.getIndicatorIcon = function(nbox, node) {
  if (node[DvtNBoxConstants.INDICATOR_ICON])
    return DvtNBoxStyleUtils.getStyledIndicatorIcon(nbox, node[DvtNBoxConstants.INDICATOR_ICON]);
  return null;
};


/**
 * Gets the selected items for the nbox
 * @param {DvtNBox} nbox the nbox component
 * @return {array} the list of selected items
 */
DvtNBoxDataUtils.getSelectedItems = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.SELECTION];
};


/**
 * Sets the selected items for the nbox
 * @param {DvtNBox} nbox the nbox component
 * @param {array} selectedItems the list of selected items
 */
DvtNBoxDataUtils.setSelectedItems = function(nbox, selectedItems) {
  nbox.getOptions()[DvtNBoxConstants.SELECTION] = selectedItems;
};


/**
 * Gets the highlighted items for the nbox
 * @param {DvtNBox} nbox the nbox component
 * @return {array} the list of highlighted items
 */
DvtNBoxDataUtils.getHighlightedItems = function(nbox) {
  var items;
  var categories = nbox.getOptions()[DvtNBoxConstants.HIGHLIGHTED_CATEGORIES];
  if (categories && categories.length > 0) {
    items = [];
    for (var n = 0; n < DvtNBoxDataUtils.getNodeCount(nbox); n++) {
      var node = DvtNBoxDataUtils.getNode(nbox, n);
      if (DvtNBoxDataUtils.isNodeHighlighted(nbox, node)) {
        items.push(node);
      }
    }
  }
  return items;
};

/**
 * Gets the attribute groups currently being grouped by
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {array} An array containing the visual attributes to apply to the group nodes.
 */
DvtNBoxDataUtils.getGrouping = function(nbox) {
  return nbox.getOptions()['__grouping'];
};


/**
 * Gets the visual attributes currently used in grouping
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {array} An array containing the visual attributes to apply to the group nodes.
 */
DvtNBoxDataUtils.getGroupAttributes = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.GROUP_ATTRIBUTES];
};


/**
 * Gets the grouping behavior.  Valid values are 'none', DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL, and
 * DvtNBoxConstants.GROUP_BEHAVIOR_ACROSS_CELLS
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {string} the grouping behavior
 */
DvtNBoxDataUtils.getGroupBehavior = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.GROUP_BEHAVIOR];
};


/**
 * Gets the group id for the specified node.
 *
 * @param {object} node the node data
 * @return {string} the group id for the specified node
 */
DvtNBoxDataUtils.getNodeGroupId = function(node) {
  if (node[DvtNBoxConstants.GROUP_CATEGORY])
    return node[DvtNBoxConstants.GROUP_CATEGORY];
  var categories = node['_groupCategories'];
  if (categories && categories.length > 0) {
    return categories.join(';');
  }
  return null;
};


/**
 * Gets the x percentage value for the specified node to be used as part of the position average when grouping across
 * cells
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} node the node data
 * @return {number} the x percentage value
 */
DvtNBoxDataUtils.getXPercentage = function(nbox, node) {
  if (!isNaN(node[DvtNBoxConstants.X_PERCENTAGE])) {
    return node[DvtNBoxConstants.X_PERCENTAGE];
  }
  var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
  var columnIndex = DvtNBoxDataUtils.getColumnIndex(nbox, node[DvtNBoxConstants.COLUMN]);
  return (columnIndex + 0.5) / columnCount;
};


/**
 * Gets the y percentage value for the specified node to be used as part of the position average when grouping across
 * cells
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} node the node data
 * @return {number} the y percentage value
 */
DvtNBoxDataUtils.getYPercentage = function(nbox, node) {
  if (!isNaN(node[DvtNBoxConstants.Y_PERCENTAGE])) {
    return node[DvtNBoxConstants.Y_PERCENTAGE];
  }
  var rowCount = DvtNBoxDataUtils.getRowCount(nbox);
  var rowIndex = DvtNBoxDataUtils.getRowIndex(nbox, node[DvtNBoxConstants.ROW]);
  return (rowIndex + 0.5) / rowCount;
};


/**
 * Gets the other threshold value for the nbox.  Represents a percentage of the collection size (0-1)
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {number} the other threshold value
 */
DvtNBoxDataUtils.getOtherThreshold = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.OTHER_THRESHOLD];
};


/**
 * Gets the color for the aggregate group node representing any groups that fall below the other threshold
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {string} the other threshold color
 */
DvtNBoxDataUtils.getOtherColor = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.OTHER_COLOR];
};


/**
 * Gets the data associated with the currently open group
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {object} the data associated with the currently open group
 */
DvtNBoxDataUtils.getDrawer = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.DRAWER];
};


/**
 * Returns the category node data for the specified id
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {string} id the id of the category node
 * @return {object} the category node data
 */
DvtNBoxDataUtils.getCategoryNode = function(nbox, id) {
  var groupBehavior = DvtNBoxDataUtils.getGroupBehavior(nbox);
  var groups = nbox.getOptions()['__groups'];
  var groupId = id;
  if (groupBehavior == DvtNBoxConstants.GROUP_BEHAVIOR_WITHIN_CELL) {
    var cell = id.substring(0, id.indexOf(':'));
    groupId = id.substring(id.indexOf(':') + 1);
    groups = groups[cell];
  }
  return groups ? groups[groupId] : null;
};


/**
 * @param {DvtNBox} nbox the NBox component
 * @param {object} categoryNode the category node data object
 *
 * @return {array} array of category labels
 */
DvtNBoxDataUtils.getCategoryNodeLabels = function(nbox, categoryNode) {
  if (categoryNode['__labels'])
    return categoryNode['__labels'];

  // Grab any node to get groupCategory or _groupCategories
  var node = DvtNBoxDataUtils.getNode(nbox, categoryNode['nodeIndices'][0]);

  if (node[DvtNBoxConstants.GROUP_CATEGORY])
    return categoryNode['__labels'] = [node[DvtNBoxConstants.GROUP_CATEGORY]];

  // Set labels to group categories
  categoryNode['__labels'] = [];

  // Replace with any labels defined in top level label map
  if (node['_groupCategories']) {
    var labelMap = nbox.getOptions()['_groupLabels'];
    for (var i = 0; i < node['_groupCategories'].length; i++) {
      if (labelMap && labelMap[node['_groupCategories'][i]])
        categoryNode['__labels'][i] = labelMap[node['_groupCategories'][i]];
      else
        categoryNode['__labels'][i] = node['_groupCategories'][i];
    }
  }
  return categoryNode['__labels'];
};


/**
 * Sets the rendered displayable on the corresponding data object
 *
 * @param {DvtNBox} nbox the NBox component
 * @param {object} dataObject the data object
 * @param {DvtDisplayable} displayable the rendered displayable
 * @param {string} key an optional key (if storing more than one displayable)
 */
DvtNBoxDataUtils.setDisplayable = function(nbox, dataObject, displayable, key) {
  var displayables = nbox.getDisplayables();
  var fullKey = key ? '__displayable:' + key : '__displayable';
  if (dataObject[fullKey]) {
    displayables[dataObject[fullKey]] = displayable;
  }
  else {
    dataObject[fullKey] = displayables.length;
    displayables.push(displayable);
  }
};


/**
 * Gets the rendered displayable from the corresponding data object
 *
 * @param {DvtNBox} nbox the NBox component
 * @param {object} dataObject the data object
 * @param {string} key an optional key (if storing more than one displayable)
 * @return {DvtDisplayable} the rendered displayable
 */
DvtNBoxDataUtils.getDisplayable = function(nbox, dataObject, key) {
  if (!dataObject) {
    return null;
  }
  var fullKey = key ? '__displayable:' + key : '__displayable';
  var index = dataObject[fullKey];
  var displayables = nbox.getDisplayables();
  return index == null ? null : displayables[index];
};


/**
 * Returns whether or not maximize gesture is enabled.
 *
 * @param {DvtNBox} nbox the NBox component.
 * @return {boolean} whether or not maximize gesture is enabled.
 */
DvtNBoxDataUtils.isMaximizeEnabled = function(nbox) {
  var maximize = nbox.getOptions()['cellMaximize'];
  return maximize != 'off';
};


/**
 * Returns the type of content rendered in cells. Possible values are:
 * 'auto': Nodes or body counts rendered, depending on size of cell.
 * 'counts': Body counts always rendered, regardless of size.
 *
 * @param {DvtNBox} nbox the NBox component.
 * @return {string} the type of content rendered.
 */
DvtNBoxDataUtils.getCellContent = function(nbox) {
  var content = nbox.getOptions()['cellContent'];
  return content == 'counts' ? 'counts' : 'auto';
};


/**
 * Returns whether or not the specified cell is minimized
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {number} cellIndex the index of the specified cell
 * @return {boolean} true if the cell is minimized, false otherwise
 */
DvtNBoxDataUtils.isCellMinimized = function(nbox, cellIndex) {
  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(nbox);
  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(nbox);
  if (!maximizedRow && !maximizedColumn) {
    // if nothing is maximized, nothing is minimized
    return false;
  }
  var cell = DvtNBoxDataUtils.getCell(nbox, cellIndex);
  var cellRow = cell[DvtNBoxConstants.ROW];
  var cellColumn = cell[DvtNBoxConstants.COLUMN];
  if (maximizedRow && maximizedColumn) {
    // if a single cell is maximized, all other cells are minimized
    return maximizedRow != cellRow || maximizedColumn != cellColumn;
  }
  // if a single row OR column is maximized, all cells outside of that row/column are minimized
  return maximizedRow != cellRow && maximizedColumn != cellColumn;
};


/**
 * Returns whether or not the specified cell is maximized
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {number} cellIndex the index of the specified cell
 * @return {boolean} true if the cell is maximized, false otherwise
 */
DvtNBoxDataUtils.isCellMaximized = function(nbox, cellIndex) {
  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(nbox);
  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(nbox);
  var cell = DvtNBoxDataUtils.getCell(nbox, cellIndex);
  var cellRow = cell[DvtNBoxConstants.ROW];
  var cellColumn = cell[DvtNBoxConstants.COLUMN];
  return (maximizedRow == cellRow && maximizedColumn == cellColumn);
};

/**
 * Returns the legend data object
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {object} the legend data object
 */
DvtNBoxDataUtils.getLegend = function(nbox) {
  return nbox.getOptions()['_legend'];
};


/**
 * Determines whether the specified node has been hidden (e.g. via legend filtering)
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} node the node data object
 * @return {boolean} true if the node has been hidden, false otherwise
 */
DvtNBoxDataUtils.isNodeHidden = function(nbox, node) {
  var options = nbox.getOptions();
  if (options[DvtNBoxConstants.HIDDEN_CATEGORIES] && !options['__hiddenMap']) {
    options['__hiddenMap'] = DvtArrayUtils.createBooleanMap(options[DvtNBoxConstants.HIDDEN_CATEGORIES]);
  }
  // Null checking done by util function
  return DvtArrayUtils.hasAnyMapItem(options['__hiddenMap'], node[DvtNBoxConstants.CATEGORIES]);
};

/**
 * Determines whether the specified node has been highlighted (e.g. via legend filtering)
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} node the node data object
 * @return {boolean} true if the node has been highlighted, false otherwise
 */
DvtNBoxDataUtils.isNodeHighlighted = function(nbox, node) {
  var options = nbox.getOptions();
  if (options[DvtNBoxConstants.HIGHLIGHTED_CATEGORIES] && !options['__highlightedMap']) {
    options['__highlightedMap'] = DvtArrayUtils.createBooleanMap(options[DvtNBoxConstants.HIGHLIGHTED_CATEGORIES]);
  }
  // Null checking done by util functions
  if (options[DvtNBoxConstants.HIGHLIGHT_MATCH] == 'all')
    return DvtArrayUtils.hasAllMapItems(options['__highlightedMap'], node[DvtNBoxConstants.CATEGORIES]);
  else
    return DvtArrayUtils.hasAnyMapItem(options['__highlightedMap'], node[DvtNBoxConstants.CATEGORIES]);
};

/**
 * Returns the DvtSimpleScrollable container the given node
 * resides in, if it exists.
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} node the node data object
 * @return {DvtSimpleScrollableContainer} scrollable container
 */
DvtNBoxDataUtils.getNodeScrollableContainer = function(nbox, node) {
  if (!node)
    return null;

  var drawerData = DvtNBoxDataUtils.getDrawer(nbox);
  if (drawerData) {
    var drawer = DvtNBoxDataUtils.getDisplayable(nbox, drawerData);
    if (drawer)
      return drawer.getChildContainer();
  }
  var cellIndex = DvtNBoxDataUtils.getCellIndex(nbox, node.getData());
  if (DvtNBoxDataUtils.isCellMaximized(nbox, cellIndex)) {
    var cell = DvtNBoxDataUtils.getCell(nbox, cellIndex);
    return DvtNBoxDataUtils.getDisplayable(nbox, cell).getChildContainer();
  }
  return null;
};


/**
 * Returns the DvtOutputText node label
 * Creates it if it does not already exist
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} node the node data object
 * @return {DvtOutputText} label
 */
DvtNBoxDataUtils.getNodeLabel = function(nbox, node) {
  if (!node[DvtNBoxConstants.LABEL]) {
    return null;
  }
  var label = DvtNBoxDataUtils.getDisplayable(nbox, node, DvtNBoxConstants.LABEL);
  if (label) {
    return label;
  }

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());
  var halign = rtl ? DvtOutputText.H_ALIGN_RIGHT : DvtOutputText.H_ALIGN_LEFT;
  label = DvtNBoxRenderer.createText(nbox.getCtx(), node[DvtNBoxConstants.LABEL], DvtNBoxStyleUtils.getNodeLabelStyle(nbox, node), halign, DvtOutputText.V_ALIGN_MIDDLE);

  DvtNBoxDataUtils.setDisplayable(nbox, node, label, DvtNBoxConstants.LABEL);
  return label;
};


/**
 * Returns the DvtOutputText node secondary label
 * Creates it if it does not already exist
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} node the node data object
 * @return {DvtOutputText} secondary label
 */
DvtNBoxDataUtils.getNodeSecondaryLabel = function(nbox, node) {
  if (!node[DvtNBoxConstants.SECONDARY_LABEL]) {
    return null;
  }
  var secondaryLabel = DvtNBoxDataUtils.getDisplayable(nbox, node, DvtNBoxConstants.SECONDARY_LABEL);
  if (secondaryLabel) {
    return secondaryLabel;
  }

  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());
  var halign = rtl ? DvtOutputText.H_ALIGN_RIGHT : DvtOutputText.H_ALIGN_LEFT;
  secondaryLabel = DvtNBoxRenderer.createText(nbox.getCtx(), node[DvtNBoxConstants.SECONDARY_LABEL], DvtNBoxStyleUtils.getNodeSecondaryLabelStyle(nbox, node), halign, DvtOutputText.V_ALIGN_MIDDLE);

  DvtNBoxDataUtils.setDisplayable(nbox, node, secondaryLabel, DvtNBoxConstants.SECONDARY_LABEL);
  return secondaryLabel;
};

/**
 * Fires a DvtSetPropertyEvent to the nbox
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {string} key the property name
 * @param {object} value the property value
 */
DvtNBoxDataUtils.fireSetPropertyEvent = function(nbox, key, value) {
  var event = new DvtSetPropertyEvent();
  event.addParam(key, value);
  nbox.processEvent(event);
};


/**
 * Gets a cell index for the maximized cell
 *
 * @param {DvtNBox} nbox the nbox component
 * @return {?number} the index for the maximized cell or null if such cell does not exist
 */
DvtNBoxDataUtils.getMaximizedCellIndex = function(nbox) {
  var maximizedCellIndex = null;
  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(nbox);
  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(nbox);
  if (maximizedRow && maximizedColumn) {
    var columnCount = DvtNBoxDataUtils.getColumnCount(nbox);
    maximizedCellIndex = DvtNBoxDataUtils.getColumnIndex(nbox, maximizedColumn) + columnCount * DvtNBoxDataUtils.getRowIndex(nbox, maximizedRow);
  }
  return maximizedCellIndex;
};


/**
 * Check whether a specified drawer is selected - all nodes that belong to the drawer are selected
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {DvtNBoxCategoryNode} categoryNode the category node that represents the drawer
 * @return {boolen} true if the drawer is selected
 */
DvtNBoxDataUtils.isDrawerSelected = function(nbox, categoryNode) {
  var selected = false;
  var selectedItems = DvtNBoxDataUtils.getSelectedItems(nbox);
  if (selectedItems) {
    var selectedMap = {};
    for (var i = 0; i < selectedItems.length; i++)
      selectedMap[selectedItems[i]] = true;

    var nodeIndices = categoryNode.getData()['nodeIndices'];
    selected = true;
    for (var j = 0; j < nodeIndices.length; j++) {
      var node = DvtNBoxDataUtils.getNode(nbox, nodeIndices[j]);
      if (!selectedMap[node[DvtNBoxConstants.ID]]) {
        selected = false;
        break;
      }
    }
  }
  return selected;
};


/**
 * Builds a description used for the aria-label attribute
 * @param {DvtNBox} nbox the nbox component
 * @param {DvtNBoxNode|DvtNBoxCategoryNode|DvtNBoxDrawer} object an object that need a description
 * @param {string} datatip a datatip to use as part of description
 * @param {boolean} selected true if the object is selected
 * @return {string} aria-label description for the object
 */
DvtNBoxDataUtils.buildAriaDesc = function(nbox, object, datatip, selected) {
  var baseDesc = (object instanceof DvtNBoxCategoryNode || object instanceof DvtNBoxDrawer) ?
      DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'COLON_SEP_LIST', [DvtBundle.getTranslatedString(DvtBundle.NBOX_PREFIX, 'GROUP_NODE'), datatip]) :
      datatip;

  var states = [];
  if (selected)
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'STATE_SELECTED'));
  else
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'STATE_UNSELECTED'));

  if (object instanceof DvtNBoxCategoryNode) {
    var nodeCount = object.getData()['nodeIndices'].length;
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'STATE_COLLAPSED'));
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'COLON_SEP_LIST', [DvtBundle.getTranslatedString(DvtBundle.NBOX_PREFIX, 'SIZE'), nodeCount]));
  }
  else if (object instanceof DvtNBoxDrawer) {
    var categoryNodeData = DvtNBoxDataUtils.getCategoryNode(nbox, object.getData()[DvtNBoxConstants.ID]);
    var nodeCount = categoryNodeData['nodeIndices'].length;
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'STATE_EXPANDED'));
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'COLON_SEP_LIST', [DvtBundle.getTranslatedString(DvtBundle.NBOX_PREFIX, 'SIZE'), nodeCount]));
  }

  return DvtDisplayable.generateAriaLabel(baseDesc, states);
};

/**
 * Finds first individual node in the container
 * @param {DvtNBox} nbox The owning NBox component
 * @param {DvtContainer} container parent container
 * @return {DvtNBoxNode|DvtNBoxNodeOverflow} The first object in the container that can get keyboard focus
 */
DvtNBoxDataUtils.getFirstNavigableNode = function(nbox, container) {
  var navigable = null;
  if (container.getNumChildren() > 0) {
    //find first displayable object
    navigable = container.getChildAt(0);
    var prevData;
    do {
      if (navigable instanceof DvtNBoxNode) {
        prevData = navigable.getData()['__prev'];
      }
      else if (navigable instanceof DvtNBoxNodeOverflow) {
        prevData = navigable['__prev'];
      }
      navigable = prevData ? DvtNBoxDataUtils.getDisplayable(nbox, prevData) : navigable;
    } while (prevData);
  }
  return navigable;
};


/**
 * Finds last individual node in the container
 * @param {DvtNBox} nbox The owning NBox component
 * @param {DvtContainer} container parent container
 * @return {DvtNBoxNode|DvtNBoxNodeOverflow} The last object in the container that can get keyboard focus
 */
DvtNBoxDataUtils.getLastNavigableNode = function(nbox, container) {
  var navigable = null;
  var childCnt = container.getNumChildren();
  if (childCnt > 0) {
    //get last displayable object
    navigable = container.getChildAt(childCnt - 1);
    var nextData;
    do {
      if (navigable instanceof DvtNBoxNode) {
        nextData = navigable.getData()['__next'];
      }
      else {
        nextData = null;
      }
      navigable = nextData ? DvtNBoxDataUtils.getDisplayable(nbox, nextData) : navigable;
    } while (nextData);
  }
  return navigable;
};


/**
 * Finds next navigable node based on direction
 * @param {DvtNBox} nbox The owning NBox component
 * @param {DvtNBoxNode|DvtNBoxNodeOverflow} object current object that has get keyboard focus
 * @param {DvtKeyboardEvent} event keyboard event
 * @return {DvtNBoxNode|DvtNBoxNodeOverflow} next object can get keyboard focus
 */
DvtNBoxDataUtils.getNextNavigableNode = function(nbox, object, event) {
  var bNext = (event.keyCode == DvtKeyboardEvent.RIGHT_ARROW || event.keyCode == DvtKeyboardEvent.DOWN_ARROW) ? true : false;
  var nextData;
  if (object instanceof DvtNBoxNode) {
    nextData = bNext ? object.getData()['__next'] : object.getData()['__prev'];
  }
  else if (object instanceof DvtNBoxNodeOverflow) {
    nextData = bNext ? null : object['__prev'];
  }
  return nextData ? DvtNBoxDataUtils.getDisplayable(nbox, nextData) : object;
};


// Copyright (c) 2013, 2016, Oracle and/or its affiliates. All rights reserved.


/**
 * Style related utility functions for DvtNBox.
 * @class
 */
var DvtNBoxStyleUtils = new Object();

DvtObj.createSubclass(DvtNBoxStyleUtils, DvtObj, 'DvtNBoxStyleUtils');


/**
 * Returns the display animation for the specified nbox.
 * @param {DvtNBox} nbox
 * @return {string}
 */
DvtNBoxStyleUtils.getAnimationOnDisplay = function(nbox) {
  if (!nbox.isAnimationAllowed())
    return 'none';
  var animationOnDisplay = nbox.getOptions()[DvtNBoxConstants.ANIMATION_ON_DISPLAY];
  if (animationOnDisplay == 'auto') {
    animationOnDisplay = DvtBlackBoxAnimationHandler.ALPHA_FADE;
  }
  return animationOnDisplay;
};


/**
 * Returns the data change animation for the specified nbox.
 * @param {DvtNBox} nbox
 * @return {string}
 */
DvtNBoxStyleUtils.getAnimationOnDataChange = function(nbox) {
  if (!nbox.isAnimationAllowed())
    return 'none';
  return nbox.getOptions()[DvtNBoxConstants.ANIMATION_ON_DATA_CHANGE];
};


/**
 * Returns the animation duration in seconds for the specified nbox.  This duration is
 * intended to be passed to the animation handler, and is not in the same units
 * as the API.
 * @param {DvtNBox} nbox
 * @return {number} The animation duration in seconds.
 */
DvtNBoxStyleUtils.getAnimationDuration = function(nbox) {
  return DvtStyleUtils.getTimeMilliseconds(nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.ANIMATION_DURATION]) / 1000;
};


/**
 * Returns the label style for the specified column index
 * @param {DvtNBox} nbox
 * @param {number} columnIndex the specified column index
 * @return {DvtCSSStyle} the label style for the specified column index
 */
DvtNBoxStyleUtils.getColumnLabelStyle = function(nbox, columnIndex) {
  var options = nbox.getOptions();
  var defaults = options[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.COLUMN_LABEL_STYLE];
  var column = DvtNBoxDataUtils.getColumn(nbox, columnIndex);
  if (column[DvtNBoxConstants.LABEL_STYLE]) {
    return DvtJSONUtils.merge(new DvtCSSStyle(column[DvtNBoxConstants.LABEL_STYLE]), defaults);
  }
  return defaults;
};


/**
 * Returns the label style for the specified row index
 * @param {DvtNBox} nbox
 * @param {number} rowIndex the specified row index
 * @return {DvtCSSStyle} the label style for the specified row index
 */
DvtNBoxStyleUtils.getRowLabelStyle = function(nbox, rowIndex) {
  var options = nbox.getOptions();
  var defaults = options[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.ROW_LABEL_STYLE];
  var row = DvtNBoxDataUtils.getRow(nbox, rowIndex);
  if (row[DvtNBoxConstants.LABEL_STYLE]) {
    return DvtJSONUtils.merge(new DvtCSSStyle(row[DvtNBoxConstants.LABEL_STYLE]), defaults);
  }
  return defaults;
};


/**
 * Returns the cell style for the specified cell index
 * @param {DvtNBox} nbox
 * @param {number} cellIndex the specified cell index
 * @return {DvtCSSStyle} the cell style for the specified cell index
 */
DvtNBoxStyleUtils.getCellStyle = function(nbox, cellIndex) {
  var options = nbox.getOptions();
  var styleKey = DvtNBoxConstants.STYLE;
  var maximizedRow = DvtNBoxDataUtils.getMaximizedRow(nbox);
  var maximizedColumn = DvtNBoxDataUtils.getMaximizedColumn(nbox);
  if (DvtNBoxDataUtils.isCellMinimized(nbox, cellIndex)) {
    styleKey = 'minimizedStyle';
  }
  else if ((maximizedRow || maximizedColumn) && !DvtNBoxDataUtils.isCellMinimized(nbox, cellIndex)) {
    styleKey = 'maximizedStyle';
  }
  var defaults = options[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.CELL_DEFAULTS][styleKey];
  var cell = DvtNBoxDataUtils.getCell(nbox, cellIndex);
  if (cell[styleKey]) {
    return DvtJSONUtils.merge(new DvtCSSStyle(cell[styleKey]), defaults);
  }

  return defaults;
};


/**
 * Returns the label style for the specified cell index
 * @param {DvtNBox} nbox
 * @param {number} cellIndex the specified cell index
 * @return {DvtCSSStyle} the label style for the specified cell index
 */
DvtNBoxStyleUtils.getCellLabelStyle = function(nbox, cellIndex) {
  var options = nbox.getOptions();
  var defaults = options[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.CELL_DEFAULTS][DvtNBoxConstants.LABEL_STYLE];
  var cell = DvtNBoxDataUtils.getCell(nbox, cellIndex);
  if (cell[DvtNBoxConstants.LABEL_STYLE]) {
    return DvtJSONUtils.merge(new DvtCSSStyle(cell[DvtNBoxConstants.LABEL_STYLE]), defaults);
  }
  return defaults;
};

/**
 * Returns whether to show cell node count
 * @param {DvtNBox} nbox
 * @param {object} cell the cell data
 * @return {boolean} whether to show cell node count
 */
DvtNBoxStyleUtils.getCellShowCount = function(nbox, cell) {
  return cell[DvtNBoxConstants.SHOW_COUNT] ? cell[DvtNBoxConstants.SHOW_COUNT] :
      nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.CELL_DEFAULTS][DvtNBoxConstants.SHOW_COUNT];
};


/**
 * Returns the count label style for nbox cells
 * @param {DvtNBox} nbox
 * @return {DvtCSSStyle} the count label style for nbox cells
 */
DvtNBoxStyleUtils.getCellCountLabelStyle = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.CELL_DEFAULTS]['countLabelStyle'];
};


/**
 * Returns the body count label style for nbox cells
 * @param {DvtNBox} nbox
 * @return {DvtCSSStyle} the count label style for nbox cells
 */
DvtNBoxStyleUtils.getCellBodyCountLabelStyle = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.CELL_DEFAULTS]['bodyCountLabelStyle'];
};


/**
 * Returns the drop target style for nbox cells
 * @param {DvtNBox} nbox
 * @return {DvtCSSStyle} the drop target style for nbox cells
 */
DvtNBoxStyleUtils.getCellDropTargetStyle = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.CELL_DEFAULTS]['dropTargetStyle'];
};


/**
 * Returns the label style for the specified node
 * @param {DvtNBox} nbox
 * @param {object} node the specified node data
 * @return {DvtCSSStyle} the label style for the specified node
 */
DvtNBoxStyleUtils.getNodeLabelStyle = function(nbox, node) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.LABEL_STYLE];
};


/**
 * Returns the secondary label style for the specified node
 * @param {DvtNBox} nbox
 * @param {object} node the specified node data
 * @return {DvtCSSStyle} the secondary label style for the specified node
 */
DvtNBoxStyleUtils.getNodeSecondaryLabelStyle = function(nbox, node) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.SECONDARY_LABEL_STYLE];
};


/**
 * Returns the color for the specified node
 * @param {DvtNBox} nbox
 * @param {object} node the specified node data
 * @return {string} the color for the specified node
 */
DvtNBoxStyleUtils.getNodeColor = function(nbox, node) {
  if (node[DvtNBoxConstants.COLOR])
    return node[DvtNBoxConstants.COLOR];
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.COLOR];
};


/**
 * Returns the border color for the specified node
 * @param {DvtNBox} nbox
 * @param {object} node the specified node data
 * @return {string} the border color for the specified node
 */
DvtNBoxStyleUtils.getNodeBorderColor = function(nbox, node) {
  var color = node[DvtNBoxConstants.BORDER_COLOR] ? node[DvtNBoxConstants.BORDER_COLOR] :
      nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.BORDER_COLOR];
  return color ? color : null;
};


/**
 * Returns the border width for the specified nodeb
 * @param {DvtNBox} nbox
 * @param {object} node the specified node data
 * @return {number} the border width for the specified node
 */
DvtNBoxStyleUtils.getNodeBorderWidth = function(nbox, node) {
  var width = node[DvtNBoxConstants.BORDER_WIDTH] ? node[DvtNBoxConstants.BORDER_WIDTH] :
      nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.BORDER_WIDTH];
  return width ? width : null;
};


/**
 * Returns the indicator color for the specified node
 * @param {DvtNBox} nbox
 * @param {object} node the specified node data
 * @return {string} the indicator color for the specified node
 */
DvtNBoxStyleUtils.getNodeIndicatorColor = function(nbox, node) {
  if (node[DvtNBoxConstants.INDICATOR_COLOR])
    return node[DvtNBoxConstants.INDICATOR_COLOR];
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.INDICATOR_COLOR];
};


/**
 * Fills out any default style properties for the specified icon
 * @param {DvtNBox} nbox
 * @param {object} icon the specified icon data
 * @return {object} the icon data, including default style properties
 */
DvtNBoxStyleUtils.getStyledIcon = function(nbox, icon) {
  return DvtJSONUtils.merge(icon, nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.ICON_DEFAULTS]);
};


/**
 * Fills out any default style properties for the specified indicator icon
 * @param {DvtNBox} nbox
 * @param {object} indicatorIcon the specified indicator data
 * @return {object} the indicator icon data, including default style properties
 */
DvtNBoxStyleUtils.getStyledIndicatorIcon = function(nbox, indicatorIcon) {
  return DvtJSONUtils.merge(indicatorIcon, nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.INDICATOR_ICON_DEFAULTS]);
};


/**
 * Returns the alpha value for non-highlighted nodes.
 * @param {DvtNBox} nbox
 * @return {number} the alpha value for non-highlighted nodes.
 */
DvtNBoxStyleUtils.getFadedNodeAlpha = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS]['alphaFade'];
};


/**
 * Returns a map containing scrollbar styles
 * @param {DvtNBox} nbox
 * @return {object} a map containing scrollbar styles
 */
DvtNBoxStyleUtils.getScrollbarStyleMap = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS]['__scrollbar'];
};


/**
 * Returns the color for the specified category node
 * @param {DvtNBox} nbox
 * @param {object} categoryNode the specified category node data
 * @return {string} the color for the specified node
 */
DvtNBoxStyleUtils.getCategoryNodeColor = function(nbox, categoryNode) {
  if (DvtNBoxDataUtils.getGroupBehavior(nbox) == 'none' ||
      (DvtNBoxDataUtils.getGroupAttributes(nbox) && DvtNBoxDataUtils.getGroupAttributes(nbox).indexOf('color') == -1)) {
    return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.COLOR];
  }
  if (categoryNode['otherNode']) {
    return DvtNBoxDataUtils.getOtherColor(nbox);
  }
  // if all nodes have same color, return that value, otherwise return default.
  var nodeIndices = categoryNode['nodeIndices'];
  var color = DvtNBoxDataUtils.getNode(nbox, nodeIndices[0])[DvtNBoxConstants.COLOR];
  if (!color)
    return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.COLOR];

  for (var i = 1; i < nodeIndices.length; i++) {
    var node = DvtNBoxDataUtils.getNode(nbox, nodeIndices[i]);
    if (color != node[DvtNBoxConstants.COLOR])
      return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.COLOR];
  }
  return color;
};


/**
 * Returns the indicator color for the specified node
 * @param {DvtNBox} nbox
 * @param {object} categoryNode the specified category node data
 * @return {string} the indicator color for the specified node
 */
DvtNBoxStyleUtils.getCategoryNodeIndicatorColor = function(nbox, categoryNode) {
  if (DvtNBoxDataUtils.getGroupBehavior(nbox) == 'none' ||
      (DvtNBoxDataUtils.getGroupAttributes(nbox) && DvtNBoxDataUtils.getGroupAttributes(nbox).indexOf('indicatorColor') == -1)) {
    return null;
  }
  // if all nodes have same indicator color, return that value, otherwise return default.
  var nodeIndices = categoryNode['nodeIndices'];
  var color = DvtNBoxDataUtils.getNode(nbox, nodeIndices[0])[DvtNBoxConstants.INDICATOR_COLOR];
  if (!color)
    return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.INDICATOR_COLOR];

  for (var i = 1; i < nodeIndices.length; i++) {
    var node = DvtNBoxDataUtils.getNode(nbox, nodeIndices[i]);
    if (color != node[DvtNBoxConstants.INDICATOR_COLOR])
      return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.INDICATOR_COLOR];
  }
  return color;
};


/**
 * Gets the styled indicator icon (if any) for the specified category node
 * @param {DvtNBox} nbox
 * @param {object} categoryNode the category node data
 * @return {object} the styled indicator icon data
 */
DvtNBoxStyleUtils.getStyledCategoryIndicatorIcon = function(nbox, categoryNode) {
  if (DvtNBoxDataUtils.getGroupBehavior(nbox) == 'none')
    return null;

  // if not styling group nodes by any of the indicatorIcon attributes return null
  if (DvtNBoxDataUtils.getGroupAttributes(nbox) &&
      DvtNBoxDataUtils.getGroupAttributes(nbox).indexOf('indicatorIconShape') == -1 &&
      DvtNBoxDataUtils.getGroupAttributes(nbox).indexOf('indicatorIconColor') == -1 &&
      DvtNBoxDataUtils.getGroupAttributes(nbox).indexOf('indicatorIconPattern') == -1)
    return null;


  var indicatorIcon = {};
  var nodeIndices = categoryNode['nodeIndices'];

  var baseIcon = DvtNBoxDataUtils.getNode(nbox, nodeIndices[0])[DvtNBoxConstants.INDICATOR_ICON];
  if (!baseIcon)
    return null;

  // Shape
  var match = true;
  if (!DvtNBoxDataUtils.getGroupAttributes(nbox) || DvtNBoxDataUtils.getGroupAttributes(nbox).indexOf('indicatorIconShape') != -1) {
    var shape = baseIcon[DvtNBoxConstants.SHAPE];
    for (var i = 1; i < nodeIndices.length; i++) {
      var nodeIcon = DvtNBoxDataUtils.getNode(nbox, nodeIndices[i])[DvtNBoxConstants.INDICATOR_ICON];
      if (nodeIcon && shape != nodeIcon[DvtNBoxConstants.SHAPE])
        match = false;
    }
    indicatorIcon[DvtNBoxConstants.SHAPE] = match ? shape : nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.INDICATOR_ICON_DEFAULTS][DvtNBoxConstants.SHAPE];
  }

  // Color
  match = true;
  if (!DvtNBoxDataUtils.getGroupAttributes(nbox) || DvtNBoxDataUtils.getGroupAttributes(nbox).indexOf('indicatorIconColor') != -1) {
    var color = baseIcon[DvtNBoxConstants.COLOR];
    for (var j = 1; j < nodeIndices.length; j++) {
      var nodeIcon = DvtNBoxDataUtils.getNode(nbox, nodeIndices[j])[DvtNBoxConstants.INDICATOR_ICON];
      if (nodeIcon && color != nodeIcon[DvtNBoxConstants.COLOR])
        match = false;
    }
    indicatorIcon[DvtNBoxConstants.COLOR] = match ? color : nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.INDICATOR_ICON_DEFAULTS][DvtNBoxConstants.COLOR];
  }

  // Pattern
  match = true;
  if (!DvtNBoxDataUtils.getGroupAttributes(nbox) || DvtNBoxDataUtils.getGroupAttributes(nbox).indexOf('indicatorIconPattern') != -1) {
    var pattern = baseIcon[DvtNBoxConstants.PATTERN];
    for (var k = 1; k < nodeIndices.length; k++) {
      var nodeIcon = DvtNBoxDataUtils.getNode(nbox, nodeIndices[k])[DvtNBoxConstants.INDICATOR_ICON];
      if (nodeIcon && pattern != nodeIcon[DvtNBoxConstants.PATTERN])
        match = false;
    }
    indicatorIcon[DvtNBoxConstants.PATTERN] = match ? pattern : nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.INDICATOR_ICON_DEFAULTS][DvtNBoxConstants.PATTERN];
  }
  return DvtJSONUtils.merge(indicatorIcon, nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.INDICATOR_ICON_DEFAULTS]);
};


/**
 * Returns the background for the drawer
 * @param {DvtNBox} nbox
 * @return {string} the background for the drawer
 */
DvtNBoxStyleUtils.getDrawerBackground = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS]['__drawerDefaults']['background'];
};


/**
 * Returns the header background for the drawer
 * @param {DvtNBox} nbox
 * @return {string} the header background for the drawer
 */
DvtNBoxStyleUtils.getDrawerHeaderBackground = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS]['__drawerDefaults']['headerBackground'];
};


/**
 * Returns the border color for the drawer
 * @param {DvtNBox} nbox
 * @return {string} the border color for the drawer
 */
DvtNBoxStyleUtils.getDrawerBorderColor = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS]['__drawerDefaults'][DvtNBoxConstants.BORDER_COLOR];
};


/**
 * Returns the border radius for the drawer
 * @param {DvtNBox} nbox
 * @return {number} the border radius for the drawer
 */
DvtNBoxStyleUtils.getDrawerBorderRadius = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS]['__drawerDefaults'][DvtNBoxConstants.BORDER_RADIUS];
};


/**
 * Returns the label style for the drawer
 * @param {DvtNBox} nbox
 * @return {DvtCSSStyle} the label style for the drawer
 */
DvtNBoxStyleUtils.getDrawerLabelStyle = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS]['__drawerDefaults'][DvtNBoxConstants.LABEL_STYLE];
};


/**
 * Returns the count label style the drawer
 * @param {DvtNBox} nbox
 * @return {DvtCSSStyle} the count label style the drawer
 */
DvtNBoxStyleUtils.getDrawerCountLabelStyle = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS]['__drawerDefaults']['countLabelStyle'];
};


/**
 * Returns the count border radius for the drawer
 * @param {DvtNBox} nbox
 * @return {number} the count border radius for the drawer
 */
DvtNBoxStyleUtils.getDrawerCountBorderRadius = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS]['__drawerDefaults']['countBorderRadius'];
};


/**
 * Returns the label style for category nodes
 * @param {DvtNBox} nbox
 * @return {DvtCSSStyle} the label style for category nodes
 */
DvtNBoxStyleUtils.getCategoryNodeLabelStyle = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS]['__categoryNodeDefaults']['labelStyle'];
};


/**
 * Returns the border radius for nodes
 * @param {DvtNBox} nbox
 * @return {number} the border radius
 */
DvtNBoxStyleUtils.getNodeBorderRadius = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS][DvtNBoxConstants.BORDER_RADIUS];
};


/**
 * Returns the hover color for nodes
 * @param {DvtNBox} nbox
 * @return {string} the hover color
 */
DvtNBoxStyleUtils.getNodeHoverColor = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS]['hoverColor'];
};


/**
 * Returns the selection color for nodes
 * @param {DvtNBox} nbox the nbox component
 * @return {string} the selection color
 */
DvtNBoxStyleUtils.getNodeSelectionColor = function(nbox) {
  return nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.NODE_DEFAULTS]['selectionColor'];
};


/**
 * Returns a left/center/right halign value based upon the current reading direction
 *
 * @param {DvtNBox} nbox the nbox component
 * @param {object} data for object with a label
 *
 * @return {string} the reading-direction-aware halign value
 */
DvtNBoxStyleUtils.getLabelHalign = function(nbox, data) {
  var halign = data[DvtNBoxConstants.LABEL_HALIGN];
  if (!halign)
    halign = nbox.getOptions()[DvtNBoxConstants.STYLE_DEFAULTS][DvtNBoxConstants.CELL_DEFAULTS][DvtNBoxConstants.LABEL_HALIGN];
  var rtl = DvtAgent.isRightToLeft(nbox.getCtx());
  if (halign == 'end') {
    return rtl ? DvtOutputText.H_ALIGN_LEFT : DvtOutputText.H_ALIGN_RIGHT;
  }
  else if (halign == 'center') {
    return DvtOutputText.H_ALIGN_CENTER;
  }
  else { // halign == "start"
    return rtl ? DvtOutputText.H_ALIGN_RIGHT : DvtOutputText.H_ALIGN_LEFT;
  }
};

  return D;
});