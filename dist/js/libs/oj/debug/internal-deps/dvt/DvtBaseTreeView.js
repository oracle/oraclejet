/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit', './DvtSubcomponent'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

  // Map the D namespace to dvt, which is used to provide access across partitions.
  var D = dvt;
  
/**
 * The base class for tree components.
 * @extends {DvtBaseComponent}
 * @class The base class for tree components.
 * @constructor
 * @export
 */
var DvtBaseTreeView = function() {};

DvtObj.createSubclass(DvtBaseTreeView, DvtBaseComponent, 'DvtBaseTreeView');

/**
 * Initializes the tree view.
 * @param {DvtContext} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @protected
 */
DvtBaseTreeView.prototype.Init = function(context, callback, callbackObj) {
  DvtBaseTreeView.superclass.Init.call(this, context, callback, callbackObj);

  // Create the event handler and add event listeners
  this._eventHandler = this.CreateEventManager(this, context, this.dispatchEvent, this);
  this._eventHandler.addListeners(this);

  // Drag and drop support
  this._dragSource = new DvtDragSource(context);
  this._dropTarget = new DvtBaseTreeDropTarget(this);
  this._eventHandler.setDragSource(this._dragSource);

  /**
   * Field used to store the legend displayable during render.
   * @private
   */
  this._legend = null;

  // boolean to indicate whether or not this view has current keyboard focus
  this._hasFocus = false;

  // String to indicate the id of the node that should get keyboard focus
  // Used when an event causes the view to re-render or animate and we want to re-set the keyboard focus to a
  // non-default node, for example when we
  // 1. drill up (set keyboard focus to the node that was the previous, drilled-in root of the treemap)
  // 2. restore a treemap after isolating a node (set focus to the node that was previously isolated)
  // 3. expand or collapse a sunburst node (set focus to the node that was expanded/collapsed)
  this._navigableIdToFocus = null;
};

/**
 * @override
 */
DvtBaseTreeView.prototype.SetOptions = function(options) {
  if (options) {
    this.Options = this.Defaults.calcOptions(options);

    // Disable animation for canvas and xml
    if (!DvtAgent.isEnvironmentBrowser()) {
      this.Options['animationOnDisplay'] = 'none';
      this.Options['animationOnDataChange'] = 'none';
    }
  }
  else if (!this.Options)
    this.Options = this.GetDefaults();
};

/**
 * Renders the component using the specified options.  If no options is supplied to a component
 * that has already been rendered, this function will rerender the component with the
 * specified size.
 * @param {object} options The new options object.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 * @export
 */
DvtBaseTreeView.prototype.render = function(options, width, height) 
{
  // Update if a new options object has been provided or initialize with defaults if needed.
  var bNewOptions = (options || !this.Options);
  this.SetOptions(options);

  // Process the options object
  var root = this._processNodes();
  this.ApplyParsedProperties({root: root});

  // Update the width and height if provided
  if (!isNaN(width) && !isNaN(height)) {
    this.Width = width;
    this.Height = height;
  }

  // Hide any currently shown tooltips
  if (this._eventHandler)
    this._eventHandler.hideTooltip();

  // Relayout the component (for resize or new data)
  var availSpace = new DvtRectangle(0, 0, this.Width, this.Height);
  this.Layout(availSpace);

  // Create a new container and render the component into it
  var container = new DvtContainer(this.getCtx());
  this.addChild(container);

  // content facet: create afContext
  if (this._templates) {
    this._afContext = new DvtAfContext(this.getCtx(), this._eventHandler);
    //remove any components that don't fit in the tree node
    this._afContext.setRmIfNotFit(true);
  }

  this.Render(container, availSpace);

  // Animation Support
  // Stop any animation in progress
  if (this.Animation) {
    this.AnimationStopped = true;
    this.Animation.stop();
  }

  // Construct the new animation playable
  var animationOnDataChange = this.getOptions()['animationOnDataChange'];
  var bounds = new DvtRectangle(0, 0, this.Width, this.Height);
  var bBlackBoxUpdate = false; // true if this is a black box update animation
  if (!this._container) {
    this.Animation = this.GetDisplayAnimation(container, bounds);
  }
  else if (animationOnDataChange && bNewOptions) {
    // AnimationOnDataChange
    if (DvtBlackBoxAnimationHandler.isSupported(animationOnDataChange)) {
      // Black Box Animation
      this.Animation = DvtBlackBoxAnimationHandler.getCombinedAnimation(this.getCtx(), animationOnDataChange, this._container, container, bounds, this.AnimationDuration);
      bBlackBoxUpdate = true;
    }
    else if (this._oldRoot && animationOnDataChange == 'auto') {
      // Data Change Animation
      // Create the animation handler, calc, and play the animation
      this._deleteContainer = this.GetDeleteContainer();
      this.addChild(this._deleteContainer);
      var ah = new DvtBaseTreeAnimationHandler(this.getCtx(), this._deleteContainer);
      ah.animate(this._oldRoot, this._root, this._oldAncestors, this._ancestors);
      this.Animation = ah.getAnimation(true);
    }
  }

  // Clear out the old info, not needed anymore
  this._oldRoot = null;
  this._oldAncestors = null;

  // If an animation was created, play it
  if (this.Animation) {
    // Disable event listeners temporarily
    this._eventHandler.removeListeners(this);

    // Start the animation
    this.Animation.setOnEnd(this.OnAnimationEnd, this);
    this.Animation.play();
  }

  // Clean up the old container.  If doing black box animation, store a pointer and clean
  // up after animation is complete.  Otherwise, remove immediately.
  if (bBlackBoxUpdate) {
    this._oldContainer = this._container;
  }
  else if (this._container) {
    // Not black box animation, so clean up the old contents
    this.removeChild(this._container);
  }

  // Update the pointer to the new container
  this._container = container;

  // Selection Support
  if (bNewOptions) {
    // Update the selection manager with the initial selections.  This must be done after
    // the shapes are created to apply the selection effects.
    this._processInitialSelections();
  }
  else
    this.ReselectNodes(); // Resize or Rerender: Reselect the nodes using the selection handler's state

  // Update the event manager with the initial focus
  this._processInitialFocus(!this.Animation);

  // Process the highlightedCategories. We'll also do this in the animation end listener to avoid conflicts with insert
  // animations.
  if (!this.Animation)
    this._processInitialHighlighting();

  this.UpdateAriaAttributes();

  if (!this.Animation)
    // If not animating, that means we're done rendering, so fire the ready event.
    this.RenderComplete();
};



/**
 * Parses the xml and returns the root node.
 * @param {string} xmlString The string to be parsed
 * @return {object} An object containing the parsed properties.
 * @protected
 */
DvtBaseTreeView.prototype.Parse = function(xmlString) {
  // subclasses should override
  return null;
};


/**
 * Performs layout for the component.
 * @param {DvtRect} availSpace The rectangle within which to perform layout.
 * @protected
 */
DvtBaseTreeView.prototype.Layout = function(availSpace) {
  // subclasses should override
};


/**
 * Renders the component.
 * @param {DvtContainer} container The container to render within.
 * @param {DvtRectangle} bounds The bounds of the node area.
 * @protected
 */
DvtBaseTreeView.prototype.Render = function(container, bounds) {
  // subclasses should override
};


/**
 * Renders the background.
 * @param {DvtContainer} container The container to render within.
 * @param {string} defaultStyle The default style string
 * @protected
 */
DvtBaseTreeView.prototype.RenderBackground = function(container, defaultStyle) {
  // Render an invisible fill for eventing
  var background = new DvtRect(this.getCtx(), 0, 0, this.Width, this.Height);
  background.setInvisibleFill();
  container.addChild(background);
};


/**
 * Lays out the breadcrumbs and updates the available space.
 * @param {DvtRect} availSpace The rectangle within which to perform layout.
 * @protected
 */
DvtBaseTreeView.prototype.LayoutBreadcrumbs = function(availSpace) {
  if (this._ancestors.length > 0) {
    var rootLabel = this._root ? this._root.getLabel() : null;

    if (this._breadcrumbs)
      this._eventHandler.removeComponentKeyboardHandler(this._breadcrumbs.getEventManager());

    this._breadcrumbs = DvtTreeBreadcrumbsRenderer.render(this, availSpace, this._ancestors, rootLabel);
    this._eventHandler.addComponentKeyboardHandlerAt(this._breadcrumbs.getEventManager(), 0);
  }
  else {
    if (this._breadcrumbs)
      this._eventHandler.removeComponentKeyboardHandler(this._breadcrumbs.getEventManager());

    this._breadcrumbs = null;
  }
};


/**
 * Renders the breadcrumbs.
 * @param {DvtContainer} container The container to render within.
 * @protected
 */
DvtBaseTreeView.prototype.RenderBreadcrumbs = function(container) {
  // The breadcrumbs are actually already rendered in _layoutBreadcrumbs, so just add it to the tree here.
  if (this._breadcrumbs) {
    container.addChild(this._breadcrumbs);
  }
};


/**
 * Lays out the legend component and updates the available space.
 * @param {DvtRect} availSpace The rectangle within which to perform layout.
 * @protected
 */
DvtBaseTreeView.prototype.LayoutLegend = function(availSpace) {
  this._legend = DvtTreeLegendRenderer.render(this, availSpace, this._legendSource);
};


/**
 * Renders the legend.
 * @param {DvtContainer} container The container to render within.
 * @protected
 */
DvtBaseTreeView.prototype.RenderLegend = function(container) {
  // The legend is actually already rendered in _layoutLegend, so just add it to the tree here.
  if (this._legend) {
    container.addChild(this._legend);

    // Clear the pointer, since we don't need it anymore
    this._legend = null;
  }
};


/**
 * Renders the empty text message, centered in the available space.
 * @param {DvtContainer} container The container to render within.
 * @protected
 */
DvtBaseTreeView.prototype.RenderEmptyText = function(container) {
  var options = this.getOptions();
  var emptyText = options['emptyText'];
  if (!emptyText)
    emptyText = DvtBundle.getTranslation(options, 'labelNoData', DvtBundle.UTIL_PREFIX, 'NO_DATA');

  DvtTextUtils.renderEmptyText(container, emptyText, new DvtRectangle(0, 0, this.Width, this.Height), this.getEventManager(), options['_statusMessageStyle']);
};


/**
 * Checks whether the component has valid data.
 * @return {boolean} True if the component has valid data.
 * @protected
 */
DvtBaseTreeView.prototype.HasValidData = function() {
  return (this._root && this._root.getSize() > 0);
};


/**
 * Returns the animation to use on initial display of this component.
 * @param {DvtContainer} container The container to render within.
 * @param {DvtRectangle} bounds The bounds of the node area.
 * @return {DvtBaseAnimation} The initial display animation.
 * @protected
 */
DvtBaseTreeView.prototype.GetDisplayAnimation = function(container, bounds) {
  var animationOnDisplay = this.getOptions()['animationOnDisplay'];
  if (DvtBlackBoxAnimationHandler.isSupported(animationOnDisplay))
    return DvtBlackBoxAnimationHandler.getInAnimation(this.getCtx(), animationOnDisplay, container, bounds, this.AnimationDuration);
  else
    return null;
};


/**
 * Hook for cleaning up animation behavior at the end of the animation.
 * @protected
 */
DvtBaseTreeView.prototype.OnAnimationEnd = function() {
  // Remove the container containing the delete animations
  if (this._deleteContainer) {
    this.removeChild(this._deleteContainer);
    this._deleteContainer = null;
  }

  // Clean up the old container used by black box updates
  if (this._oldContainer) {
    this.removeChild(this._oldContainer);
    this._oldContainer = null;
  }

  // Restore event listeners
  this._eventHandler.addListeners(this);

  // Restore visual effects on node with keyboard focus
  this._processInitialFocus(true);

  // Process the highlightedCategories
  this._processInitialHighlighting();

  if (!this.AnimationStopped)
    this.RenderComplete();

  // Reset the animation stopped flag
  this.AnimationStopped = false;

  // Remove the animation reference
  this.Animation = null;
};


/**
 * Creates a container that can be used for storing delete animation content.
 * @return {DvtContainer}
 * @protected
 */
DvtBaseTreeView.prototype.GetDeleteContainer = function() {
  return new DvtContainer(this.getCtx());
};


/**
 * Returns a keyboard handler that can be used by the view's event manager
 * @param {DvtEventManager} manager The owning event manager
 * @return {DvtKeyboardHandler}
 * @protected
 */
DvtBaseTreeView.prototype.CreateKeyboardHandler = function(manager)
{
  return new DvtBaseTreeKeyboardHandler(manager);
};


/**
 * Returns an event manager that will handle events on this view
 * @param {DvtContainer} view
 * @param {DvtContext} context
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @return {DvtEventManager}
 * @protected
 */
DvtBaseTreeView.prototype.CreateEventManager = function(view, context, callback, callbackObj)
{
  return new DvtBaseTreeEventManager(view, context, callback, callbackObj);
};


/**
 * Returns the node that should receive initial keyboard focus when the view first gets focus
 * @param {DvtBaseTreeNode} root The node that should receive initial keyboard focus
 * @return {DvtBaseTreeNode}
 * @protected
 */
DvtBaseTreeView.prototype.GetInitialFocusedItem = function(root)
{
  if (root && root.isArtificialRoot()) {
    var nodes = root.getChildNodes();
    if (nodes && nodes.length > 0)
      return nodes[0];
  }
  return root;
};

/**
 * @override
 * @export
 */
DvtBaseTreeView.prototype.highlight = function(categories) {
  // Update the options
  this.getOptions()['highlightedCategories'] = DvtJSONUtils.clone(categories);

  // Perform the highlighting
  DvtCategoryRolloverHandler.highlight(categories, DvtBaseTreeUtils.getAllNodes(this._root), this.getOptions()['highlightMatch'] == 'any');
};

/**
 * @override
 * @export
 */
DvtBaseTreeView.prototype.select = function(selection) {
  // Update the options
  var options = this.getOptions();
  options['selection'] = DvtJSONUtils.clone(selection);

  // Perform the selection
  if (this._selectionHandler) {
    var targets = DvtBaseTreeUtils.getAllNodes(this._root);
    this._selectionHandler.processInitialSelections(options['selection'], targets);
  }
};

/**
 * @override
 */
DvtBaseTreeView.prototype.getEventManager = function() {
  return this._eventHandler;
};

/**
 * Returns the maximum depth of the tree.
 * @return {number} The maximum depth of the tree.
 */
DvtBaseTreeView.prototype.__getMaxDepth = function() {
  return this._maxDepth;
};


/**
 * Returns the node count of the tree.
 * @return {number} The node count of the tree.
 */
DvtBaseTreeView.prototype.__getNodeCount = function() {
  return this._nodeCount;
};

/**
 * Applies the parsed properties to this component.
 * @param {object} props An object containing the parsed properties for this component.
 * @protected
 */
DvtBaseTreeView.prototype.ApplyParsedProperties = function(props) {
  var options = this.getOptions();

  // Save the old info for animation support
  this._oldRoot = this._root;
  this._oldAncestors = this._ancestors;

  // Save the parsed properties
  this._root = props.root;
  this._ancestors = options['_ancestors'] ? options['_ancestors'] : [];
  this._nodeCount = this._root ? DvtBaseTreeUtils.calcNodeCount(this._root) : 0;
  this._maxDepth = this._root ? DvtBaseTreeUtils.calcMaxDepth(this._root, 0) : 0;

  // TODO : This uses the weird client side value in seconds
  this.AnimationDuration = DvtStyleUtils.getTimeMilliseconds(options['animationDuration']) / 1000;

  this._styles = props.styles ? props.styles : {};

  // Selection Support
  if (options['selectionMode'] == 'none')
    this._nodeSelection = null;
  else if (options['selectionMode'] == 'single')
    this._nodeSelection = DvtSelectionHandler.TYPE_SINGLE;
  else
    this._nodeSelection = DvtSelectionHandler.TYPE_MULTIPLE;

  if (this._nodeSelection) {
    this._selectionHandler = new DvtSelectionHandler(this._nodeSelection);
    this._initialSelection = options['selection'];
  }
  else
    this._selectionHandler = null;

  // Event Handler delegates to other handlers
  this._eventHandler.setSelectionHandler(this._selectionHandler);

  // Keyboard Support
  this._eventHandler.setKeyboardHandler(this.CreateKeyboardHandler(this._eventHandler));

  // Attribute Groups and Legend Support
  this._legendSource = null;
  this._attrGroups = [];
  if (options['attributeGroups']) {
    var nodes = DvtBaseTreeUtils.getAllNodes(this._root);
    for (var i = 0; i < options['attributeGroups'].length; i++) {
      var attrGroup = options['attributeGroups'][i];
      var agObj = null;
      if (attrGroup['attributeType'] == 'continuous') {
        DvtBaseTreeUtils.calcContinuousAttrGroupsExtents(attrGroup, nodes);
        agObj = new DvtContinuousAttrGroups(attrGroup['min'], attrGroup['max'], attrGroup['minLabel'], attrGroup['maxLabel'], attrGroup['colors']);
      }
      else { // discrete
        agObj = new DvtDiscreteAttrGroups();
        for (var groupIndex = 0; groupIndex < attrGroup['groups'].length; groupIndex++) {
          var group = attrGroup['groups'][groupIndex];
          agObj.add(group['id'], group['label'], {color: group['color'], pattern: group['pattern']});
        }
      }
      this._attrGroups.push({attrGroups: agObj, stampId: attrGroup['S'], id: attrGroup['id']});

      // If source wasn't specified, use the first attributeGroups. In ADF no legend unless explicitly specified.
      if (!options['_adf'] && !options['_legendSource'] && i == 0)
        this._legendSource = agObj;
      else if (options['_legendSource'] && options['_legendSource'] == attrGroup['id'])
        this._legendSource = agObj;
    }

    // For continuous attribute groups sent from server, evaluate to get the colors
    DvtBaseTreeUtils.processContinuousAttrGroups(this._attrGroups, nodes);
  }

  // ADF Context Menus
  var menus = options['_contextMenus'];
  if (menus && menus.length > 0) {
    var contextMenuHandler = new DvtContextMenuHandler(this.getCtx(), menus);
    this._eventHandler.setContextMenuHandler(contextMenuHandler);
  }

  // ADF Templates for Content Facet
  var templates = options['_templates'];
  if (templates) {
    this._templates = {};

    // The templates object is a mapping from stampId to template definition
    for (var templateKey in templates) {
      var afComponent = DvtAfComponentFactory.parseJsonElement(templates[templateKey]);
      this._templates[templateKey] = afComponent;
    }
  }
};


/**
 * Reselects the selected nodes after a re-render.
 * @protected
 */
DvtBaseTreeView.prototype.ReselectNodes = function() {
  var selectedNodes = this._selectionHandler ? this._selectionHandler.getSelection() : new Array();
  for (var i = 0; i < selectedNodes.length; i++)
    selectedNodes[i].setSelected(true);
};


/**
 * Update the selection handler with the initial selections.
 * @private
 */
DvtBaseTreeView.prototype._processInitialSelections = function() {
  if (this._selectionHandler && this._initialSelection) {
    var targets = DvtBaseTreeUtils.getAllNodes(this._root);
    this._selectionHandler.processInitialSelections(this._initialSelection, targets);
    this._initialSelection = null;
  }
};

/**
 * Update the displayables with the initial highlighting.
 * @private
 */
DvtBaseTreeView.prototype._processInitialHighlighting = function() {
  var highlightedCategories = this.getOptions()['highlightedCategories'];
  if (highlightedCategories && highlightedCategories.length > 0)
    this.highlight(highlightedCategories);
};

/**
 * Update the event manager with the initial focused item
 * @param {Boolean} applyVisualEffects True if we want to apply visual effects to indicate which node has
 *                  keyboard focus.
 * @private
 */
DvtBaseTreeView.prototype._processInitialFocus = function(applyVisualEffects) {

  var initialFocus = null;
  var id = this.__getNavigableIdToFocus();

  if (id)
  {
    initialFocus = DvtBaseTreeNode.getNodeById(this._root, id);
    this._eventHandler.setFocus(initialFocus);
  }

  if (applyVisualEffects)
  {
    // if we are applying visual effects in response to an event that caused a re-render or animation, and this
    // event specified a non-default node to set keyboard focus on, clear that value now that we've used it
    this.__setNavigableIdToFocus(null);
  }

  if (!initialFocus)
  {
    // set the item that has initial keyboard focus to a default if none was previously defined
    initialFocus = this.GetInitialFocusedItem(this._root);
    this._eventHandler.setFocus(initialFocus);
  }

  // have the event manager apply any needed visual effects
  // however, do this only if we are not animating so as to prevent the focus visual effect
  // from appearing during the duration of the animation
  if (applyVisualEffects)
    this.setFocused(this.isFocused());

};


/**
 * Update the visual effects on view when it receives or loses keyboard focus
 *
 * @param {boolean} isFocused
 */
DvtBaseTreeView.prototype.setFocused = function(isFocused)
{
  this._hasFocus = isFocused;
  this._eventHandler.setFocused(isFocused);
};


/**
 * Returns true if the view currently has keyboard focus
 * @return {boolean}
 */
DvtBaseTreeView.prototype.isFocused = function()
{
  return this._hasFocus;
};

/**
 * Returns the animation duration, in milliseconds.
 * @return {number}
 */
DvtBaseTreeView.prototype.__getAnimationDuration = function() {
  return this.AnimationDuration;
};

/**
 * Returns the content facet template for the given stamp id.
 * @param {string} stampId
 * @return {object}
 */
DvtBaseTreeView.prototype.__getTemplate = function(stampId) {
  return this._templates ? this._templates[stampId] : null;
};

/**
 * Returns the afComponent context instance.
 * @return {DvtAfContext}
 */
DvtBaseTreeView.prototype.__getAfContext = function() {
  return this._afContext;
};


/**
 * Returns the node under the specified coordinates.
 * @param {number} x
 * @param {number} y
 * @return {DvtBaseTreeNode}
 */
DvtBaseTreeView.prototype.__getNodeUnderPoint = function(x, y) {
  return this._root.getNodeUnderPoint(x, y);
};


/**
 * Returns the clientId of the drag source owner if dragging is supported.
 * @param {array} clientIds
 * @return {string}
 */
DvtBaseTreeView.prototype.__isDragAvailable = function(clientIds) {
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
DvtBaseTreeView.prototype.__getDragTransferable = function(node) {
  // Select the node if not already selected
  if (!node.isSelected()) {
    this._selectionHandler.processClick(node, false);
    this._eventHandler.fireSelectionEvent();
  }

  // Gather the rowKeys for the selected objects
  var rowKeys = [];
  var selection = this._selectionHandler.getSelection();
  for (var i = 0; i < selection.length; i++) {
    rowKeys.push(selection[i].getId());
  }

  return rowKeys;
};


/**
 * Returns the displayables to use for drag feedback for the current drag.
 * @return {array} The displayables for the current drag.
 */
DvtBaseTreeView.prototype.__getDragFeedback = function() {
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
 * Displays drop site feedback for the specified node.
 * @param {DvtBaseTreeNode} node The node for which to show drop feedback, or null to remove drop feedback.
 * @return {DvtDisplayable} The drop site feedback, if any.
 */
DvtBaseTreeView.prototype.__showDropSiteFeedback = function(node) {
  // Remove any existing drop site feedback
  if (this._dropSiteFeedback) {
    this.removeChild(this._dropSiteFeedback);
    this._dropSiteFeedback = null;
  }

  // Create feedback for the node
  if (node) {
    this._dropSiteFeedback = node.getDropSiteFeedback();
    if (this._dropSiteFeedback) {
      var styleDefaults = this.getOptions()['styleDefaults'];
      this._dropSiteFeedback.setSolidFill(styleDefaults['_dropSiteFillColor'], styleDefaults['_dropSiteOpacity']);
      this._dropSiteFeedback.setSolidStroke(styleDefaults['_dropSiteBorderColor']);
      this.addChild(this._dropSiteFeedback);
    }
  }

  return this._dropSiteFeedback;
};


/**
 * Processes a breadcrumb drill event.
 * @param {DvtBreadcrumbsDrillEvent} event
 */
DvtBaseTreeView.prototype.__processBreadcrumbsEvent = function(event) {
  if (event instanceof DvtBreadcrumbsDrillEvent)
    this.__drill(event.getId(), false);
};


/**
 * Performs a drill on the specified node.
 * @param {string} id
 * @param {boolean} bDrillUp True if this is a drill up operation.
 */
DvtBaseTreeView.prototype.__drill = function(id, bDrillUp) {
  if (bDrillUp && this._root && id == this._root.getId() && this._ancestors.length > 0) {
    // after the drill up completes, set keyboard focus on the node that was the
    // root of the previously drilled-down view
    this.__setNavigableIdToFocus(id);

    // Drill up only supported on the root node
    this.dispatchEvent(new DvtDrillReplaceEvent(this._ancestors[0].id));
  }
  else if (!bDrillUp) // Fire the event
    this.dispatchEvent(new DvtDrillReplaceEvent(id));

  // Hide any tooltips being shown
  this.getCtx().getTooltipManager().hideTooltip();
};


/**
 * Returns the logical object corresponding to the physical target
 * @param {Object} target
 * @return {Object}
 */
DvtBaseTreeView.prototype.getLogicalObject = function(target)
{
  return this._eventHandler.GetLogicalObject(target);
};


/**
 * @return {DvtBaseTreeNode} the root tree node.
 */
DvtBaseTreeView.prototype.getRootNode = function()
{
  return this._root;
};


/**
 * Returns the id of the node that should get keyboard focus, if the default node should not receive focus.
 * Used when an event causes the view to re-render or animate and we want to set the keyboard focus
 * to a non-default node.
 *
 * @return {String} the id of the node that should receive keyboard focus
 */
DvtBaseTreeView.prototype.__getNavigableIdToFocus = function() 
{
  return this._navigableIdToFocus;
};


/**
 * Sets the id of the node that should get keyboard focus, if the default node should not receive focus.
 * Used when an event causes the view to re-render or animate and we want to set the keyboard focus
 * to a non-default node.
 *
 * @param {String} id The id of the node that should receive keyboard focus
 */
DvtBaseTreeView.prototype.__setNavigableIdToFocus = function(id) 
{
  this._navigableIdToFocus = id;
};


/**
 * @return {String} whether nodeSelection is multiple, single, or null.
 */
DvtBaseTreeView.prototype.__getNodeSelection = function() 
{
  return this._nodeSelection;
};

/**
 * Creates a node for this view. Subclasses must override.
 * @param {object} nodeOptions The options for the node.
 * @return {DvtBaseTreeNode}
 * @protected
 */
DvtBaseTreeView.prototype.CreateNode = function(nodeOptions) {
  // subclasses must override
  return null;
};

/**
 * Helper function to return the bundle prefix for this component.
 * @return {string}
 */
DvtBaseTreeView.prototype.getBundlePrefix = function() {
  // subclasses must override
  return null;
};

/**
 * Returns the automation object for this treeView
 * @return {DvtAutomation} The automation object
 * @export
 */
DvtBaseTreeView.prototype.getAutomation = function() {
  return new DvtTreeAutomation(this);
};

/**
 * Returns the breadcrumbs object for this treeView
 * Used by automation APIs
 * @return {DvtBreadcrumbs} The breadcrumbs object
 */
DvtBaseTreeView.prototype.getBreadcrumbs = function() {
  return this._breadcrumbs;
};

/**
 * Recursively creates and returns the root layer nodes based on the options object. Creates an artificial node if
 * needed for multi-rooted trees.
 * @return {DvtBaseTreeNode}
 * @private
 */
DvtBaseTreeView.prototype._processNodes = function() {
  var options = this.getOptions();
  if (options['nodes'] == null)
    return null;

  // Create each of the root level nodes
  var rootNodes = [];
  // create a boolean map of hidden categories for better performance
  var hiddenCategories = DvtArrayUtils.createBooleanMap(options['hiddenCategories']);
  for (i = 0; i < options['nodes'].length; i++) {
    var nodeOptions = options['nodes'][i];

    // Store the index for automation
    nodeOptions['_index'] = i;

    // Recursively process the node
    var rootNode = this._processNode(hiddenCategories, nodeOptions);
    if (rootNode)
      rootNodes.push(rootNode);
  }

  // Ensure that there's a single root, creating an artificial one if needed
  if (rootNodes.length == 1)
    return rootNodes[0];
  else {
    // Calculate the sum of the child sizes
    var size = 0;
    for (var i = 0; i < rootNodes.length; i++) {
      size += rootNodes[i].getSize();
    }

    // Create the actual node and set the children
    var props = {'value': size, bArtificialRoot: true};
    var artificialRoot = this.CreateNode(props);
    artificialRoot.setChildNodes(rootNodes);
    return artificialRoot;
  }
};

/**
 * Recursively creates and returns the node based on the options object.
 * @param {object} hiddenCategories The boolean map of hidden categories.
 * @param {object} nodeOptions The options for the node to process.
 * @return {DvtBaseTreeNode}
 * @private
 */
DvtBaseTreeView.prototype._processNode = function(hiddenCategories, nodeOptions) {
  // Don't create if node is hidden
  if (DvtBaseTreeUtils.isHiddenNode(hiddenCategories, nodeOptions))
    return null;

  // Create the node
  var node = this.CreateNode(nodeOptions);

  // Create child nodes only if this node is expanded
  if (node.isDisclosed()) {
    // Recurse and build the child nodes
    var childNodes = [];
    var childOptions = nodeOptions['nodes'] ? nodeOptions['nodes'] : [];
    for (var childIndex = 0; childIndex < childOptions.length; childIndex++) {
      var childNodeOptions = childOptions[childIndex];
      childNodeOptions['_index'] = childIndex;

      var childNode = this._processNode(hiddenCategories, childNodeOptions);
      if (childNode)
        childNodes.push(childNode);
    }
    node.setChildNodes(childNodes);
  }

  return node;
};

/**
 * Annotates nodes with aria flowto properties for VoiceOver navigation
 * @param {DvtBaseTreeNode} root The root node
 * @protected
 */
DvtBaseTreeView.prototype.UpdateAriaNavigation = function(root) {
  // VoiceOver workaround for 
  if (DvtAgent.isTouchDevice() || DvtAgent.isEnvironmentTest()) {
    var nodes = DvtBaseTreeUtils.getAllVisibleNodes(root);
    for (var i = 0; i < nodes.length - 1; i++) {
      // Set the aria flowto property of the current node to the next node's id
      var id = this.getId() + (nodes[i + 1].getId() ? nodes[i + 1].getId() : nodes[i + 1].getLabel());
      // VoiceOver doesn't work well if there are spaces in the id so remove all spaces first
      id = id.replace(/\s+/g, '');
      nodes[i + 1].getDisplayable().setId(id, true);
      nodes[i].getDisplayable().setAriaProperty('flowto', id);
    }
  }
};
// APIs called by the ADF Faces drag source for DvtBaseTreeView


/**
 * If this object supports drag, returns the client id of the drag component.
 * Otherwise returns null.
 * @param mouseX the x coordinate of the mouse
 * @param mouseY the x coordinate of the mouse
 * @param clientIds the array of client ids of the valid drag components
 */
DvtBaseTreeView.prototype.isDragAvailable = function(mouseX, mouseY, clientIds) {
  return this._dragSource.isDragAvailable(clientIds);
};


/**
 * Returns the transferable object for a drag initiated at these coordinates.
 */
DvtBaseTreeView.prototype.getDragTransferable = function(mouseX, mouseY) {
  return this._dragSource.getDragTransferable(mouseX, mouseY);
};


/**
 * Returns the feedback for the drag operation.
 */
DvtBaseTreeView.prototype.getDragOverFeedback = function(mouseX, mouseY) {
  return this._dragSource.getDragOverFeedback(mouseX, mouseY);
};


/**
 * Returns an Object containing the drag context info.
 */
DvtBaseTreeView.prototype.getDragContext = function(mouseX, mouseY) {
  return this._dragSource.getDragContext(mouseX, mouseY);
};


/**
 * Returns the offset to use for the drag feedback. This positions the drag
 * feedback relative to the pointer.
 */
DvtBaseTreeView.prototype.getDragOffset = function(mouseX, mouseY) {
  return this._dragSource.getDragOffset(mouseX, mouseY);
};


/**
 * Returns the offset from the mouse pointer where the drag is considered to be located.
 */
DvtBaseTreeView.prototype.getPointerOffset = function(xOffset, yOffset) {
  return this._dragSource.getPointerOffset(xOffset, yOffset);
};


/**
 * Notifies the component that a drag started.
 */
DvtBaseTreeView.prototype.initiateDrag = function() {
  this._dragSource.initiateDrag();
};


/**
 * Clean up after the drag is completed.
 */
DvtBaseTreeView.prototype.dragDropEnd = function() {
  this._dragSource.dragDropEnd();
};
// APIs called by the ADF Faces drop target for DvtBaseTreeView


/**
 * If a drop is possible at these mouse coordinates, returns the client id
 * of the drop component. Returns null if drop is not possible.
 */
DvtBaseTreeView.prototype.acceptDrag = function(mouseX, mouseY, clientIds) {
  return this._dropTarget.acceptDrag(mouseX, mouseY, clientIds);
};


/**
 * Paints drop site feedback as a drag enters the drop site.
 */
DvtBaseTreeView.prototype.dragEnter = function() {
  this._dropTarget.dragEnter();
};


/**
 * Cleans up drop site feedback as a drag exits the drop site.
 */
DvtBaseTreeView.prototype.dragExit = function() {
  this._dropTarget.dragExit();
};


/**
 * Returns the object representing the drop site. This method is called when a valid
 * drop is performed.
 */
DvtBaseTreeView.prototype.getDropSite = function(mouseX, mouseY) {
  return this._dropTarget.getDropSite(mouseX, mouseY);
};
/**
 * Animation handler for tree data objects.
 * @param {DvtContext} context The platform specific context object.
 * @param {DvtContainer} deleteContainer The container where deletes should be moved for animation.
 * @class DvtBaseTreeAnimationHandler
 * @constructor
 */
var DvtBaseTreeAnimationHandler = function(context, deleteContainer) {
  this.Init(context, deleteContainer);
};

DvtObj.createSubclass(DvtBaseTreeAnimationHandler, DvtDataAnimationHandler, 'DvtBaseTreeAnimationHandler');


/**
 * Animates the tree component, with support for data changes and drilling.
 * @param {DvtBaseTreeNode} oldRoot The state of the tree before the animation.
 * @param {DvtBaseTreeNode} newRoot The state of the tree after the animation.
 * @param {array} oldAncestors The array of ancestors for the old root node.
 * @param {array} newAncestors The array of ancestors for the new root node.
 */
DvtBaseTreeAnimationHandler.prototype.animate = function(oldRoot, newRoot, oldAncestors, newAncestors) {
  this._bDrill = false; // true if this is a drilling animation
  this._oldRoot = oldRoot;
  this._oldAncestors = oldAncestors;

  // Determine whether this is a drill or data change animation
  if (DvtBaseTreeAnimationHandler._isAncestor(newAncestors, oldRoot) ||
      DvtBaseTreeAnimationHandler._isAncestor(oldAncestors, newRoot))
  {
    // Drilling
    this._bDrill = true;
    var oldList = oldRoot.getDescendantNodes();
    var newList = newRoot.getDescendantNodes();
    oldList.push(oldRoot);
    newList.push(newRoot);
    this.constructAnimation(oldList, newList);
  }
  else {
    // Data Change Animation
    this.constructAnimation([oldRoot], [newRoot]);
  }
};


/**
 * Returns true if the current animation is for a drill operation.  The nodes
 * will call this function and handle their animations differently.
 * @return {boolean}
 */
DvtBaseTreeAnimationHandler.prototype.isDrillAnimation = function() {
  return this._bDrill;
};


/**
 * Returns true if the specified node was previously an ancestor of the old root.  A value
 * of true indicates that an insert animation should not be performed on this node.
 * @param {DvtBaseTreeNode} node
 */
DvtBaseTreeAnimationHandler.prototype.isAncestorInsert = function(node) {
  if (this._bDrill)
    return this._oldRoot.getId() == node.getId() ||
           DvtBaseTreeAnimationHandler._isAncestor(this._oldAncestors, node);
  else
    return false;
};


/**
 * Returns true if the specified node is contained in the array of ancestors.
 * @param {array} ancestors The array of ancestors to search.
 * @param {DvtBaseTreeNode} node The node to search for.
 * @return {boolean}
 */
DvtBaseTreeAnimationHandler._isAncestor = function(ancestors, node) {
  if (!node || !ancestors)
    return false;

  // Iterate through the array and search for the node
  for (var i = 0; i < ancestors.length; i++) {
    if (ancestors[i]['id'] == node.getId())
      return true;
  }

  // No match found
  return false;
};
/**
 * Drop Target event handler for DvtBaseTreeView
 * @param {DvtBaseTreeView} view
 * @class DvtBaseTreeDropTarget
 * @extends {DvtDropTarget}
 * @constructor
 */
var DvtBaseTreeDropTarget = function(view) {
  this._view = view;
};

DvtObj.createSubclass(DvtBaseTreeDropTarget, DvtDropTarget, 'DvtBaseTreeDropTarget');


/**
 * @override
 */
DvtBaseTreeDropTarget.prototype.acceptDrag = function(mouseX, mouseY, clientIds) {
  // If there is no node under the point, then don't accept the drag
  var node = this._view.__getNodeUnderPoint(mouseX, mouseY);
  if (!node) {
    this._view.__showDropSiteFeedback(null);
    return null;
  }
  else if (node != this._dropSite) {
    this._view.__showDropSiteFeedback(node);
    this._dropSite = node;
  }

  // Return the first clientId, since this component has only a single drag source
  return clientIds[0];
};


/**
 * @override
 */
DvtBaseTreeDropTarget.prototype.dragExit = function() {
  // Remove drop site feedback
  this._view.__showDropSiteFeedback(null);
  this._dropSite = null;
};


/**
 * @override
 */
DvtBaseTreeDropTarget.prototype.getDropSite = function(mouseX, mouseY) {
  var node = this._view.__getNodeUnderPoint(mouseX, mouseY);
  if (node)
    return {clientRowKey: node.getId()};
  else
    return null;
};
/**
 * Event Manager for tree components.
 * @param {DvtBaseTreeView} view
 * @param {DvtContext} context
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 * @constructor
 */
var DvtBaseTreeEventManager = function(view, context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
  this._view = view;
};

DvtObj.createSubclass(DvtBaseTreeEventManager, DvtEventManager, 'DvtBaseTreeEventManager');

/**
 * Returns the owning tree component.
 * @return {DvtBaseTreeView}
 * @protected
 */
DvtBaseTreeEventManager.prototype.GetView = function() {
  return this._view;
};

/**
 * @override
 */
DvtBaseTreeEventManager.prototype.OnDblClickInternal = function(event) {
  // Done if there is no object
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  // Only double click to drill if selectable. Otherwise, drill with single click.
  if (obj.isSelectable && obj.isSelectable())
    this._processDrill(obj, event.shiftKey);
};


/**
 * @override
 */
DvtBaseTreeEventManager.prototype.OnClick = function(event) {
  DvtBaseTreeEventManager.superclass.OnClick.call(this, event);

  // If the object is a DvtBaseTreePeer (for node labels), handle drilling
  var obj = this.GetLogicalObject(event.target);
  this._processNodeLabel(obj);

  // Only drill if not selectable. If selectable, drill with double click.
  if (obj && !(obj.isSelectable && obj.isSelectable()))
    this._processDrill(obj, event.shiftKey);
};


/**
 * @override
 */
DvtBaseTreeEventManager.prototype.OnMouseOver = function(event) {
  DvtBaseTreeEventManager.superclass.OnMouseOver.call(this, event);

  // Additional mouse over support
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  if (obj.handleMouseOver)
    obj.handleMouseOver();
};

/**
 * @override
 */
DvtBaseTreeEventManager.prototype.OnMouseOut = function(event) {
  DvtBaseTreeEventManager.superclass.OnMouseOut.call(this, event);

  // Additional mouse out support
  var obj = this.GetLogicalObject(event.target);
  if (!obj)
    return;

  // Don't hide on mouseOut to object belonging to same node (expand button for example)
  if (obj.handleMouseOut) {
    var relatedObj = this.GetLogicalObject(event.relatedTarget);
    var relatedId = relatedObj && relatedObj.getId ? relatedObj.getId() : null;
    if ((obj.getId() == null) || (relatedId != obj.getId()))
      obj.handleMouseOut();
  }
};

/**
 * @override
 */
DvtBaseTreeEventManager.prototype.ProcessKeyboardEvent = function(event)
{
  var eventConsumed = false;
  var keyCode = event.keyCode;
  var obj = this.getFocus(); // the item with current keyboard focus

  if (keyCode == DvtKeyboardEvent.ENTER && !event.ctrlKey)
  {
    // handle drill operations
    obj = this.getFocus();
    if (obj.isDrillReplaceEnabled && obj.isDrillReplaceEnabled())
    {
      // SHIFT+ENTER means drill up from the current root, even if the node with keyboard focus is not the current root
      if (event.shiftKey)
        obj = this._view.getRootNode();

      // Delegate to the view to fire a drill event
      this._view.__drill(obj.getId(), event.shiftKey);
    }

    DvtEventManager.consumeEvent(event);
    eventConsumed = true;
  }
  else
  {
    eventConsumed = DvtBaseTreeEventManager.superclass.ProcessKeyboardEvent.call(this, event);
  }

  return eventConsumed;
};

/**
 * @override
 */
DvtBaseTreeEventManager.prototype.HandleTouchClickInternal = function(event) {
  var targetObj = event.target;
  var obj = this.GetLogicalObject(targetObj);
  this._processNodeLabel(obj);

  if (this._currentHoverItem) {
    if (this._currentHoverItem != obj) {
      this._currentHoverItem.handleMouseOut();
      this._currentHoverItem = null;
    }
  }

  if (!obj)
    return;

  if (obj instanceof DvtBaseTreeNode) {
    if (this._currentHoverItem != obj) {
      this._currentHoverItem = obj;
      obj.handleMouseOver();
    }
  }

  // Only drill if not selectable. If selectable, drill with double click.
  if (!(obj.isSelectable && obj.isSelectable()))
    this._processDrill(obj, event.shiftKey);
};

/**
 * @override
 */
DvtBaseTreeEventManager.prototype.HandleTouchDblClickInternal = function(event) {
  var targetObj = event.target;
  var obj = this.GetLogicalObject(targetObj);
  if (!obj)
    return;

  // Only double click to drill if selectable. Otherwise, drill with single click.
  if (obj.isSelectable && obj.isSelectable())
    this._processDrill(obj, false);
};

/**
 * Processes a click on a node label.
 * @param {DvtLogicalObject} obj The logical object that was the target of the event
 * @private
 */
DvtBaseTreeEventManager.prototype._processNodeLabel = function(obj) {
  if (obj && obj instanceof DvtBaseTreePeer && obj.isDrillable()) {
    // Delegate to the view to fire a drill event
    this._view.__drill(obj.getId(), false);
  }
};

/**
 * Processes a drill on the specified object.
 * @param {DvtLogicalObject} obj The logical object that was the target of the event
 * @param {boolean} shiftKey True if the shift key was pressed.
 * @private
 */
DvtBaseTreeEventManager.prototype._processDrill = function(obj, shiftKey) {
  // Fire a drill event if drilling is enabled
  if (obj.isDrillReplaceEnabled && obj.isDrillReplaceEnabled()) {
    // Delegate to the view to fire a drill event
    this._view.__drill(obj.getId(), shiftKey);
  }
};

/**
 * @override
 */
DvtBaseTreeEventManager.prototype.ProcessRolloverEvent = function(event, obj, bOver) {
  // Don't continue if not enabled
  var options = this._view.getOptions();
  if (options['hoverBehavior'] != 'dim')
    return;

  // Compute the new highlighted categories and update the options
  var categories = obj.getCategories ? obj.getCategories() : [];
  options['highlightedCategories'] = bOver ? categories.slice() : null;

  // Fire the event to the rollover handler, who will fire to the component callback.
  var type = bOver ? DvtCategoryRolloverEvent.TYPE_OVER : DvtCategoryRolloverEvent.TYPE_OUT;
  var rolloverEvent = new DvtCategoryRolloverEvent(type, options['highlightedCategories']);
  var nodes = DvtBaseTreeUtils.getAllNodes(this.GetView().getRootNode());
  var hoverBehaviorDelay = DvtStyleUtils.getTimeMilliseconds(options['hoverBehaviorDelay']);
  this.RolloverHandler.processEvent(rolloverEvent, nodes, hoverBehaviorDelay, options['highlightMatch'] == 'any');
};

/**
 * @override
 */
DvtBaseTreeEventManager.prototype.GetTouchResponse = function() {
  return this._view.getOptions()['touchResponse'];
};
/**
 * Base class for tree component nodes.
 * @class The base class for tree component nodes.
 * @constructor
 * @implements {DvtCategoricalObject}
 * @implements {DvtTooltipSource}
 * @implements {DvtSelectable}
 * @implements {DvtPopupSource}
 * @implements {DvtContextMenuSource}
 * @implements {DvtKeyboardNavigable}
 * @implements {DvtDraggable}
 */
var DvtBaseTreeNode = function() {};

DvtObj.createSubclass(DvtBaseTreeNode, DvtObj, 'DvtBaseTreeNode');

DvtBaseTreeNode._ANIMATION_DELETE_PRIORITY = 0;   // The order in which the delete animation occurs
DvtBaseTreeNode._ANIMATION_UPDATE_PRIORITY = 1;   // The order in which the update animation occurs
DvtBaseTreeNode._ANIMATION_INSERT_PRIORITY = 2;   // The order in which the insert animation occurs

DvtBaseTreeNode._DEFAULT_FILL_COLOR = '#000000';
DvtBaseTreeNode._DEFAULT_TEXT_SIZE = 11;

DvtBaseTreeNode.__NODE_SELECTED_SHADOW = new DvtShadow('#000000', 2, 5, 5, 45, 0.5);

/**
 * @param {DvtBaseTreeView} treeView The DvtBaseTreeView that owns this node.
 * @param {object} props The properties for the node.
 * @protected
 */
DvtBaseTreeNode.prototype.Init = function(treeView, props)
{
  this._view = treeView;
  this._options = props;

  var nodeDefaults = this._view.getOptions()['nodeDefaults'];

  this._id = props['id'] || props['label']; // If id is undefined, use label as id
  this._color = props['color'] ? props['color'] : DvtBaseTreeNode._DEFAULT_FILL_COLOR;
  this._textStr = props['label'];
  this._labelStyle = typeof props['labelStyle'] == 'string' ? new DvtCSSStyle(props['labelStyle']) : props['labelStyle'];
  this._pattern = props['pattern'];
  this._selectable = props['selectable'];
  this._shortDesc = props['shortDesc'] ? props['shortDesc'] : props['tooltip'];
  this._size = props['value'];

  this._drilling = props['drilling'] ? props['drilling'] : nodeDefaults['drilling'];
  this._stampId = props['S'];

  // Whether this node is an artificial root
  this._bArtificialRoot = props.bArtificialRoot;

  // Node alpha is always 1 unless during animation
  this._alpha = 1;

  // reference to last visited child
  this._lastVisitedChild = null;

  this._isShowingKeyboardFocusEffect = false;

  this.IsHover = false;
};

/**
 * Sets the Array containing all children of this node.
 * @param {array} children The array of children for this node.
 */
DvtBaseTreeNode.prototype.setChildNodes = function(children) {
  // Set this node as the parent of the children
  if (children != null) {
    for (var i = 0; i < children.length; i++)
      children[i]._parent = this;
  }

  // Store the children
  this._children = children;
};


/**
 * Returns the Array containing all children of this node.
 * @return {array} The array of children belonging to this node.
 */
DvtBaseTreeNode.prototype.getChildNodes = function() {
  return this._children ? this._children : [];
};


/**
 * Returns an Array containing all the descendants of this node
 * @return {Array} The array of descendants of this node
 */
DvtBaseTreeNode.prototype.getDescendantNodes = function()
{
  var descendants = [];
  var childDescendants;
  var child;

  if (!this.hasChildren())
    return descendants;

  for (var i = 0; i < this._children.length; i++)
  {
    child = this._children[i];
    childDescendants = child.getDescendantNodes();
    descendants.push(child);
    descendants = descendants.concat(childDescendants);
  }

  return descendants;
};


/**
 * Sets a reference to the last visited child.
 *
 * @param {DvtBaseTreeNode} lastVisited
 * @protected
 */
DvtBaseTreeNode.prototype.SetLastVisitedChild = function(lastVisited)
{
  this._lastVisitedChild = lastVisited;
};


/**
 * Returns the last visited child
 *
 * @return {DvtBaseTreeNode} The last visited child
 * @protected
 */
DvtBaseTreeNode.prototype.GetLastVisitedChild = function() 
{
  return this._lastVisitedChild;
};


/**
 * Updates the last visited child on the given node's parent to this node
 * @protected
 */
DvtBaseTreeNode.prototype.MarkAsLastVisitedChild = function()
{
  var parent = this.GetParent();
  if (parent)
  {
    parent.SetLastVisitedChild(this);
  }
};


/**
 * Returns true if this node is a descendant of the specified node.
 * @param {DvtBaseTreeNode} node
 */
DvtBaseTreeNode.prototype.isDescendantOf = function(node) {
  if (!node || !this.GetParent())
    return false;
  else if (this.GetParent() == node)
    return true;
  else
    return this.GetParent().isDescendantOf(node);
};


/**
 * Returns an Array containing all nodes that are at the given depth away from the current node
 * @param {DvtBaseTreeNode} root
 * @param {Number} depth
 * @return {Array}
 */
DvtBaseTreeNode.prototype.GetNodesAtDepth = function(root, depth)
{
  var returnArray = [];
  if (depth < 0)
    return returnArray;

  if (depth == 0)
    return [this];
  else if (root.hasChildren())
  {
    var children = root.getChildNodes();
    var child;
    for (var i = 0; i < children.length; i++)
    {
      child = children[i];
      returnArray = returnArray.concat(child.GetNodesAtDepth(child, depth - 1));
    }
  }

  return returnArray;
};

/**
 * Returns the node with the given id, if it is in the tree with the given root
 * @param {DvtBaseTreeNode} root
 * @param {String} id
 * @return {DvtBaseTreeNode} The node with the given id, or null if no node with the given id is found
 */
DvtBaseTreeNode.getNodeById = function(root, id)
{
  if (root.getId() == id)
  {
    return root;
  }
  else
  {
    // recursively call getNodeById on each of the children
    var node = null;
    var children = root.getChildNodes();
    var length = children.length;
    var child = null;

    for (var i = 0; i < length; i++)
    {
      child = children[i];
      node = DvtBaseTreeNode.getNodeById(child, id);
      if (node)
      {
        // if we found the node, return it, otherwise check the next child
        return node;
      }
    }
    return null;
  }
};


/**
 * Returns the component that owns this node.
 * @return {DvtBaseTreeView} The component that owns this node.
 */
DvtBaseTreeNode.prototype.getView = function() {
  return this._view;
};


/**
 * Returns the id of the stamp for this node.
 * @return {string} The id of the stamp for this node.
 */
DvtBaseTreeNode.prototype.getStampId = function() {
  return this._stampId;
};

/**
 * Returns the options object for this node.
 * @return {object}
 */
DvtBaseTreeNode.prototype.getOptions = function() {
  return this._options;
};

/**
 * @override
 */
DvtBaseTreeNode.prototype.getCategories = function() {
  //  - default treemap node categories includes artificial node
  if (this.isArtificialRoot())
    return [];

  // Implements function in DvtCategoricalObject
  var categories = this.getOptions()['categories'];
  if (!categories) {
    // Default categories include the id of this node, appended to the categories of its ancestors
    var parent = this.GetParent();
    var parentCategories = parent ? parent.getCategories() : null;
    categories = parentCategories ? parentCategories.slice() : [];
    categories.push(this.getId());
  }
  return categories;
};

/**
 * Returns the id for this node.
 * @return {string} The id for this node.
 */
DvtBaseTreeNode.prototype.getId = function() {
  return this._id;
};


/**
 * Returns the relative size of this node.
 * @return {Number} The relative size of this node.
 */
DvtBaseTreeNode.prototype.getSize = function() {
  // Note: Called by automation APIs
  return this._size;
};


/**
 * Returns the color of this node.
 * @return {String} The color of this node.
 */
DvtBaseTreeNode.prototype.getColor = function() {
  // Note: Called by automation APIs
  return this._color;
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.getDatatip = function() {
  // Custom Tooltip from Function
  var tooltipFunc = this._view.getOptions()['tooltip'];
  if (tooltipFunc)
    return this.getView().getCtx().getTooltipManager().getCustomTooltip(tooltipFunc, this.getDataContext());

  // Custom Tooltip from ShortDesc
  return this._shortDesc;
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.getDatatipColor = function() {
  return this._color;
};

/**
 * Returns the shortDesc of the node.
 * @return {string}
 */
DvtBaseTreeNode.prototype.getShortDesc = function() {
  // Note: Called by automation APIs
  return this._shortDesc;
};

/**
 * Returns the data context that will be passed to the tooltip function.
 * @return {object}
 */
DvtBaseTreeNode.prototype.getDataContext = function() {
  return {
    'id': this.getId(),
    'label': this.getLabel(),
    'value': this.getSize(),
    'color': this.getColor()
  };
};

/**
 * Returns the index for this node within the current parent. Used for automation, this takes into account nodes that
 * were not created due to hiddenCategories.
 * @return {number}
 */
DvtBaseTreeNode.prototype.getIndex = function() {
  return this.getOptions()['_index'];
};

/**
 * Returns the alpha for this node.
 * @return {number} The alpha for this node.
 */
DvtBaseTreeNode.prototype.getAlpha = function() {
  // Note: This API is called by the fadeIn and fadeOut animations
  return this._alpha;
};


/**
 * Specifies the alpha for this node.
 * @param {number} alpha The alpha for this node.
 */
DvtBaseTreeNode.prototype.setAlpha = function(alpha) {
  // Note: This API is called by the fadeIn and fadeOut animations
  this._alpha = alpha;

  if (this._shape)
    this._shape.setAlpha(this._alpha);
};


/**
 * Specifies whether the children of this node are disclosed.
 * @param {boolean} disclosed
 * @protected
 */
DvtBaseTreeNode.prototype.setDisclosed = function(disclosed) {
  this.getOptions()['_expanded'] = disclosed;
};

/**
 * Returns true if the children of this node are disclosed.
 * @return {boolean}
 * @protected
 */
DvtBaseTreeNode.prototype.isDisclosed = function() {
  return this.getOptions()['_expanded'] !== false;
};

/**
 * Returns true if this node is the artificial root of the tree.
 * @return {boolean}
 */
DvtBaseTreeNode.prototype.isArtificialRoot = function() {
  return this._bArtificialRoot;
};


/**
 * Returns true if drill replace is enabled for this node.
 * @return {boolean}
 */
DvtBaseTreeNode.prototype.isDrillReplaceEnabled = function() {
  return this._drilling == 'replace' || this._drilling == 'insertAndReplace';
};

/**
 * @override
 */
DvtBaseTreeNode.prototype.getShowPopupBehaviors = function() {
  // Retrieve from the showPopupBehaviors map in the options object, indexed via the stampid.
  var behaviors = this.getView().getOptions()['_spb'];
  if (!behaviors || !behaviors[this.getStampId()])
    return null;

  // If found, create a DvtShowPopupBehavior and return
  return DvtShowPopupBehavior.createBehaviors(behaviors[this.getStampId()]);
};

/**
 * Renders this node.
 * @param {DvtContainer} container The container to render in.
 */
DvtBaseTreeNode.prototype.render = function(container) {
  // subclasses should override
};


/**
 * Renders the child nodes of this node.
 * @param {DvtContainer} container The container to render in.
 */
DvtBaseTreeNode.prototype.renderChildren = function(container) {
  // Render all children of this node
  var children = this.getChildNodes();
  if (children != null) {
    for (var i = 0; i < children.length; i++) {
      children[i].render(container);
    }
  }
};


/**
 * Updates this node and its children with values from the attribute groups.
 * @param {DvtAttrGroups} ag
 */
DvtBaseTreeNode.prototype.processAttrGroups = function(ag) {
  var color = ag.get(this.getOptions()['_cv']);
  if (color)
    this._color = color;
};


/**
 * Default implementation of getNextNavigable. Returns this node as the next navigable.  Subclasses should override
 * @override
 */
DvtBaseTreeNode.prototype.getNextNavigable = function(event) 
{
  // subclasses should override
  this.MarkAsLastVisitedChild();
  return this;
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  // subclasses should override
  return new DvtRectangle(0, 0, 0, 0);
};

/**
 * @override
 */
DvtBaseTreeNode.prototype.getTargetElem = function() 
{
  // subclasses should override
  return null;
};

/**
 * @override
 */
DvtBaseTreeNode.prototype.showKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = true;

  this.showHoverEffect();
  if (this.handleMouseOver)
    this.handleMouseOver();

};


/**
 * @override
 */
DvtBaseTreeNode.prototype.hideKeyboardFocusEffect = function()
{
  // Hide the hover effect if it was shown in response to keyboard focus
  if (this._isShowingKeyboardFocusEffect) {
    this._isShowingKeyboardFocusEffect = false;
    this.hideHoverEffect();
  }

  if (this.handleMouseOut)
    this.handleMouseOut();
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.isShowingKeyboardFocusEffect = function() 
{
  return this._isShowingKeyboardFocusEffect;
};


/**
 * Handles a mouse over event on the node.
 */
DvtBaseTreeNode.prototype.handleMouseOver = function() {
  this.IsHover = true;
};


/**
 * Handles a mouse out event on the node.
 */
DvtBaseTreeNode.prototype.handleMouseOut = function() {
  this.IsHover = false;
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.isSelectable = function() {
  return this._selectable != 'off' && this.getView().__getNodeSelection() != null;
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.isSelected = function() {
  return this._selected;
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.setSelected = function(selected) {
  // Store the selection state
  this._selected = selected;
  this.UpdateAriaLabel();
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.showHoverEffect = function() {
  // subclasses should override
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.hideHoverEffect = function() {
  // subclasses should override
};

/**
 * @override
 */
DvtBaseTreeNode.prototype.highlight = function(bDimmed, alpha) {
  // Implements DvtCategoricalObject.prototype.highlight
  this.setAlpha(alpha);
};

/**
 * @override
 */
DvtBaseTreeNode.prototype.isDragAvailable = function(clientIds) {
  return this.getView().__isDragAvailable(clientIds);
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.getDragTransferable = function(mouseX, mouseY) {
  return this.getView().__getDragTransferable(this);
};


/**
 * @override
 */
DvtBaseTreeNode.prototype.getDragFeedback = function(mouseX, mouseY) {
  return this.getView().__getDragFeedback();
};


/**
 * Returns a displayable used for drop site feedback.
 * @return {DvtDisplayable}
 */
DvtBaseTreeNode.prototype.getDropSiteFeedback = function() {
  return null;
};

/**
 * Returns the bounds upon which the popup fired by the given behavior should align.
 * @param {DvtShowPopupBehavior} behavior The DvtShowPopupBehavior that is firing the popup.
 * @return {DvtRectangle} The rectangle that the popup should align to.
 */
DvtBaseTreeNode.prototype.getPopupBounds = function(behavior) {
  return null; // subclasses can override, or else default positioning will occur
};


/**
 * Returns true if this node contains the given coordinates.
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
DvtBaseTreeNode.prototype.contains = function(x, y) {
  return false; // subclasses should override
};


/**
 * Returns the node under the given point, if it exists in the subtree of this node.
 * @param {number} x
 * @param {number} y
 * @return {DvtBaseTreeNode}
 */
DvtBaseTreeNode.prototype.getNodeUnderPoint = function(x, y) {
  return null; // subclasses should override
};


/**
 * Returns the layout parameters for the current animation frame.
 * @return {array} The array of layout parameters.
 * @protected
 */
DvtBaseTreeNode.prototype.GetAnimationParams = function() {
  return []; // subclasses should override
};


/**
 * Sets the layout parameters for the current animation frame.
 * @param {array} params The array of layout parameters.
 * @protected
 */
DvtBaseTreeNode.prototype.SetAnimationParams = function(params) {
  // subclasses should override
};


/**
 * Creates the update animation for this node.
 * @param {DvtBaseTreeAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @param {DvtBaseTreeNode} oldNode The old node state to animate from.
 */
DvtBaseTreeNode.prototype.animateUpdate = function(handler, oldNode) {
  // Drilling animations are handled across all nodes up front, no recursion needed
  if (!handler.isDrillAnimation()) {
    // Recurse and animate the children
    handler.constructAnimation(oldNode.getChildNodes(), this.getChildNodes());
  }

  // Create the animator for this node
  var endState = this.GetAnimationParams();
  var startState = oldNode.GetAnimationParams(endState);

  var nodePlayable;
  if (!DvtArrayUtils.equals(startState, endState)) {
    // Only create if state changed
    nodePlayable = new DvtCustomAnimation(this.getView().getCtx(), this, this.getView().__getAnimationDuration());
    nodePlayable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER_ARRAY, this, this.GetAnimationParams, this.SetAnimationParams, endState);

    // Create the playable
    handler.add(nodePlayable, DvtBaseTreeNode._ANIMATION_UPDATE_PRIORITY);

    // Determine whether size and color changed.  This must be done before start state is set.
    var bSizeChanged = (this._size != oldNode._size);
    var bColorChanged = (DvtColorUtils.getRGBA(this._color) != DvtColorUtils.getRGBA(oldNode._color));

    // Initialize the start state
    this.SetAnimationParams(startState);

    // If the data changed, flash directly into the update color.
    var animationUpdateColor = this._view.getOptions()['animationUpdateColor'];
    if (animationUpdateColor && (bSizeChanged || bColorChanged))
      this._color = animationUpdateColor;
  }
};


/**
 * Creates the insert animation for this node.
 * @param {DvtBaseTreeAnimationHandler} handler The animation handler, which can be used to chain animations.
 */
DvtBaseTreeNode.prototype.animateInsert = function(handler) {
  // Animate if this is a data change animation (not drilling), or if this node is not an
  // ancestor of the old root in a drilling animation.  The ancestors are not animated
  // so that they appear at the beginning of the animation.
  if (!handler.isDrillAnimation() || !handler.isAncestorInsert(this)) {
    // Initialize the start state
    this.setAlpha(0);

    var anim = new DvtAnimFadeIn(this.getView().getCtx(), this, this.getView().__getAnimationDuration());
    handler.add(anim, DvtBaseTreeNode._ANIMATION_INSERT_PRIORITY);

    // Recurse to children
    if (this.hasChildren()) {
      for (var i = 0; i < this._children.length; i++) {
        this._children[i].animateInsert(handler);
      }
    }
  }
};


/**
 * Creates the delete animation for this node.
 * @param {DvtBaseTreeAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @param {DvtContainer} container The container where deletes should be moved for animation.
 */
DvtBaseTreeNode.prototype.animateDelete = function(handler, container) {
  // Move to the new container, since the old container may be removed
  container.addChild(this._shape);

  // Create the animation
  var anim = new DvtAnimFadeOut(this.getView().getCtx(), this, this.getView().__getAnimationDuration());
  handler.add(anim, DvtBaseTreeNode._ANIMATION_DELETE_PRIORITY);

  // Drilling animations are handled across all nodes up front, no recursion needed
  if (!handler.isDrillAnimation() && this.hasChildren()) {
    // Recurse to children
    for (var i = 0; i < this._children.length; i++) {
      this._children[i].animateDelete(handler, container);
    }
  }
};


/**
 * Returns true if this node has children.
 * @return {boolean} true if this node has children.
 */
DvtBaseTreeNode.prototype.hasChildren = function() {
  return (this._children != null && this._children.length > 0);
};


/**
 * Returns the parent node for this node.
 * @return {DvtBaseTreeNode} The parent node.
 * @protected
 */
DvtBaseTreeNode.prototype.GetParent = function() {
  return this._parent;
};


/**
 * Returns the depth of the node in the tree.
 * @return {number} The depth of the node.
 * @protected
 */
DvtBaseTreeNode.prototype.GetDepth = function() {
  var depth = 0;
  var parent = this.GetParent();
  while (parent) {
    depth++;
    parent = parent.GetParent();
  }
  return depth;
};


/**
 * Returns the DvtFill to use for this node.
 * @return {DvtFill}
 */
DvtBaseTreeNode.prototype.GetFill = function() {
  if (this._pattern)
    return new DvtPatternFill(this._pattern, this._color);
  else
    return new DvtSolidFill(this._color);
};


/**
 * Calculates and returns a color for node text that will provide a
 * good contrast with the given color.
 * @param {DvtBaseTreeNode} node
 * @protected
 */
DvtBaseTreeNode.GetNodeTextColor = function(node) {
  if (node._pattern) {
    // Use black for all patterned nodes against white backgrounds
    return '#000000';
  }
  else {
    return DvtColorUtils.getContrastingTextColor(node._color);
  }
};

DvtBaseTreeNode.prototype.ApplyLabelTextStyle = function(text) {
  var defaultFillColor = DvtBaseTreeNode.GetNodeTextColor(this);
  text.setSolidFill(defaultFillColor);
  var textStyle = new Array();
  textStyle.push(this._view.getOptions()['nodeDefaults']['labelStyle']);
  if (this._labelStyle)
    textStyle.push(this._labelStyle);
  text.setCSSStyle(DvtCSSStyle.mergeStyles(textStyle));

  // In high contrast mode, override the app settings and use the default colors
  if (DvtAgent.isHighContrast())
    text.setSolidFill(defaultFillColor);
};

DvtBaseTreeNode.prototype.GetTextSize = function() {
  var size = DvtBaseTreeNode._DEFAULT_TEXT_SIZE;
  var textStyle = this._view.getOptions()['nodeDefaults']['labelStyle'];
  var fontSize = textStyle.getFontSize();
  if (fontSize) {
    size = parseFloat(fontSize);
  }
  return size;
};

/**
 * Returns the primary displayable for this node.
 * @return {DvtDisplayable}
 */
DvtBaseTreeNode.prototype.getDisplayable = function() {
  // Note: Called by automation APIs
  return this._shape;
};

/**
 * Returns the label string for this node.
 * @return {string}
 */
DvtBaseTreeNode.prototype.getLabel = function() {
  // Note: Called by automation APIs
  return this._textStr;
};

DvtBaseTreeNode.prototype.GetAfContext = function() {
  return this.getView().__getAfContext();
};

DvtBaseTreeNode.prototype.GetElAttributes = function() {
  return this.getOptions()['_cf'];
};

DvtBaseTreeNode.prototype.GetTemplate = function() {
  return this.getView().__getTemplate(this.getStampId());
};

/**
 * Returns whether this node can be double clicked.
 */
DvtBaseTreeNode.prototype.isDoubleClickable = function() {
  return this.isDrillReplaceEnabled();
};

/**
 * Updates the aria label of the node.
 * @protected
 */
DvtBaseTreeNode.prototype.UpdateAriaLabel = function() {
  // subclasses should override
};
/**
 * Simple logical object for drilling and tooltip support.
 * @param {DvtBaseTreeNode} node The associated node, if it has been created.
 * @param {string} id The id of the associated node.
 * @param {string} tooltip The tooltip to display.
 * @param {string} datatip The datatip to display.
 * @param {string} datatipColor The border color of the datatip.
 * @class
 * @constructor
 * @implements {DvtTooltipSource}
 */
var DvtBaseTreePeer = function(node, id, tooltip, datatip, datatipColor) {
  this.Init(tooltip, datatip, datatipColor);
  this._node = node;
  this._id = id;
  this._bDrillable = false;
};

DvtObj.createSubclass(DvtBaseTreePeer, DvtSimpleObjPeer, 'DvtBaseTreePeer');


/**
 * Returns the id of the associated node.
 * @return {string}
 */
DvtBaseTreePeer.prototype.getId = function() {
  return this._id;
};


/**
 * Returns true if the associated object is drillable.
 * @return {boolean}
 */
DvtBaseTreePeer.prototype.isDrillable = function() {
  return this._bDrillable;
};


/**
 * Specifies whether the associated object is drillable.
 * @param {boolean} drillable
 */
DvtBaseTreePeer.prototype.setDrillable = function(drillable) {
  this._bDrillable = drillable;
};


/**
 * Handles a mouse over event on the associated object.
 */
DvtBaseTreePeer.prototype.handleMouseOver = function() {
  // Expand/Collapse: hide button if displayed
  if (this._node && this._node.handleMouseOver) {
    this._node.handleMouseOver();
  }
};


/**
 * Handles a mouse out event on the associated object.
 */
DvtBaseTreePeer.prototype.handleMouseOut = function() {
  // Expand/Collapse: hide button if displayed
  if (this._node && this._node.handleMouseOut) {
    this._node.handleMouseOut();
  }
};
/**
 * Breadcrumb rendering utilities for tree components.
 * @class
 */
var DvtTreeBreadcrumbsRenderer = function() {};

DvtObj.createSubclass(DvtTreeBreadcrumbsRenderer, DvtObj, 'DvtTreeBreadcrumbsRenderer');

DvtTreeBreadcrumbsRenderer._COMPONENT_GAP = 6;
DvtTreeBreadcrumbsRenderer._ENABLED_INLINE_STYLE = 'color: #003286;';


/**
 * Performs layout and rendering for the breadcrumbs in the given space.  Updates the available
 * space and returns the rendered displayable.
 * @param {DvtBaseTreeView} treeView The owning component.
 * @param {DvtRectangle} availSpace The rectangle within which to layout.
 * @param {array} ancestors
 * @param {string} rootLabel The label for the root node.
 * @return {DvtDisplayable} The rendered legend contents.
 */
DvtTreeBreadcrumbsRenderer.render = function(treeView, availSpace, ancestors, rootLabel) {
  var context = treeView.getCtx();
  var styleDefaults = treeView.getOptions()['styleDefaults'];

  // Figure out the label styles
  var enabledStyleArray = new Array();
  enabledStyleArray.push(new DvtCSSStyle(DvtTreeBreadcrumbsRenderer._ENABLED_INLINE_STYLE));
  enabledStyleArray.push(styleDefaults['_drillTextStyle']);
  var enabledStyle = DvtCSSStyle.mergeStyles(enabledStyleArray).toString();
  var enabledStyleOver = enabledStyle + 'text-decoration: underline;';

  var disabledStyleArray = new Array();
  disabledStyleArray.push(styleDefaults['_currentTextStyle']);
  var disabledStyle = DvtCSSStyle.mergeStyles(disabledStyleArray).toString();

  // Create the breadcrumbs component and temporarily add to the component
  var options = {labelStyle: enabledStyle, labelStyleOver: enabledStyleOver, labelStyleDown: enabledStyleOver, disabledLabelStyle: disabledStyle};
  var breadcrumbs = new DvtBreadcrumbs(context, treeView.__processBreadcrumbsEvent, treeView, options);
  treeView.addChild(breadcrumbs);

  // Create the data object for the breadcrumbs.  Use the reverse of the ancestors array, since
  // the most distant ancestor is rendered first.
  var dataItems = ancestors.slice(0).reverse();
  dataItems.push({'label': rootLabel});
  var data = {'items': dataItems};
  breadcrumbs.render(data, availSpace.w);

  // Figure out the height used and reduce availSpace
  var dims = breadcrumbs.getDimensions();
  breadcrumbs.setTranslate(availSpace.x, availSpace.y);
  var height = dims.h + DvtTreeBreadcrumbsRenderer._COMPONENT_GAP;
  availSpace.y += height;
  availSpace.h -= height;

  // Remove the breadcrumbs so that it can be added under the right parent.
  treeView.removeChild(breadcrumbs);
  return breadcrumbs;
};
/**
 * Legend rendering utilies for tree components.
 * @class
 */
var DvtTreeLegendRenderer = function() {};

DvtObj.createSubclass(DvtTreeLegendRenderer, DvtObj, 'DvtTreeLegendRenderer');

/** @private @const **/
DvtTreeLegendRenderer._LEGEND_GAP = 4;
/** @private @const **/
DvtTreeLegendRenderer._LEGEND_LABEL_GAP = 7;
/** @private @const **/
DvtTreeLegendRenderer._LEGEND_SECTION_GAP = 24;
/** @private @const **/
DvtTreeLegendRenderer._LABEL_SIZE = 11;
/** @private @const **/
DvtTreeLegendRenderer._LABEL_COLOR = '#636363';

/** @private @const **/
DvtTreeLegendRenderer._LABEL_INLINE_STYLE = 'color:' + DvtTreeLegendRenderer._LABEL_COLOR + ';';

/**
 * Performs layout and rendering for the legend in the given space.  Updates the available
 * space and returns the rendered displayable.
 * @param {DvtBaseTreeView} treeView The owning component.
 * @param {DvtRectangle} availSpace The rectangle within which to layout.
 * @param {DvtAttrGroups} attrGroups An attribute groups describing the colors.
 * @return {DvtDisplayable} The rendered legend contents.
 */
DvtTreeLegendRenderer.render = function(treeView, availSpace, attrGroups) {
  var options = treeView.getOptions();
  var sizeValueStr = options['sizeLabel'];
  var colorValueStr = options['colorLabel'];
  if (sizeValueStr == null && colorValueStr == null && attrGroups == null)
    return;

  var context = treeView.getCtx();
  var eventManager = treeView.getEventManager();

  // Create the legend container and temporarily add to the component
  var legend = new DvtContainer(context);
  treeView.addChild(legend);

  // Size/Color Labels
  var labelContainer = DvtTreeLegendRenderer._renderLabels(context, treeView, legend, availSpace.w, sizeValueStr, colorValueStr, attrGroups);

  var borderColor = DvtCSSStyle.afterSkinAlta(treeView.getOptions()['skin']) ? null : '#000000';
  var legendStyleArray = new Array();
  legendStyleArray.push(options['styleDefaults']['_labelStyle']);
  var legendStyles = {borderColor: borderColor, labelStyle: DvtCSSStyle.mergeStyles(legendStyleArray)};

  // Color Section
  var colorContainer = DvtLegendAttrGroupsRenderer.renderAttrGroups(context, eventManager, legend, availSpace.w, availSpace.h, attrGroups, legendStyles);

  // Position the sections horizontally
  var labelDims = labelContainer ? labelContainer.getDimensions() : null;
  var colorDims = colorContainer ? colorContainer.getDimensions() : null;
  if (labelContainer && !colorContainer) // Only labels, center
    labelContainer.setTranslateX(availSpace.y + (availSpace.w - labelDims.w) / 2);
  else if (colorContainer && !labelContainer) // Only colors, center
    colorContainer.setTranslateX(availSpace.y + (availSpace.w - colorDims.w) / 2);
  else if (colorContainer && labelContainer) {
    // Deal with overflow
    var availWidth = availSpace.w - DvtTreeLegendRenderer._LEGEND_SECTION_GAP;
    if (labelDims.w + colorDims.w > availWidth) {
      if (labelDims.w > availWidth / 2 && colorDims.w > availWidth / 2) {
        // Both don't fit, recreate at half of the avail width each
        legend.removeChild(labelContainer);
        legend.removeChild(colorContainer);
        labelContainer = DvtTreeLegendRenderer._renderLabels(context, treeView, legend, availWidth / 2, sizeValueStr, colorValueStr, attrGroups);
        colorContainer = DvtLegendAttrGroupsRenderer.renderAttrGroups(context, eventManager, legend, availWidth / 2, availSpace.h, attrGroups, legendStyles);
      }
      else if (labelDims.w > colorDims.w) {
        // Labels don't fit, give all remaining space
        var labelSpace = availWidth - colorDims.w;

        // Recreate the labelContainer at the available size
        legend.removeChild(labelContainer);
        labelContainer = DvtTreeLegendRenderer._renderLabels(context, treeView, legend, labelSpace, sizeValueStr, colorValueStr, attrGroups);
      }
      else {
        // Colors don't fit, give all remaining space
        var colorSpace = availWidth - labelDims.w;

        // Recreate the labelContainer at the available size
        legend.removeChild(colorContainer);
        colorContainer = DvtLegendAttrGroupsRenderer.renderAttrGroups(context, eventManager, legend, colorSpace, availSpace.h, attrGroups, legendStyles);
      }

      // Size changed so recalc dimensions
      labelDims = labelContainer.getDimensions();
      colorDims = colorContainer.getDimensions();
    }

    // Position
    if (DvtAgent.isRightToLeft(context)) {
      colorContainer.setTranslateX(availSpace.x);
      labelContainer.setTranslateX(availSpace.x + availSpace.w - labelDims.w);
    }
    else {
      labelContainer.setTranslateX(availSpace.x);
      colorContainer.setTranslateX(availSpace.x + availSpace.w - colorDims.w);
    }
  }

  // Figure out the height used and reduce availSpace
  var legendDims = legend.getDimensions();
  legend.setTranslateY(availSpace.y + availSpace.h - legendDims.h);
  availSpace.h -= (legendDims.h + DvtTreeLegendRenderer._LEGEND_GAP);

  // Remove the legend so that it can be added under the right parent.
  treeView.removeChild(legend);
  return legend;
};


/**
 * Performs layout and rendering for the legend labels.
 * @param {DvtContext} context
 * @param {DvtBaseTreeView} treeView The owning component.
 * @param {DvtContainer} legend The legend container.
 * @param {number} availWidth The available horizontal space.
 * @param {string} sizeValueStr A description of the size metric.
 * @param {string} colorValueStr A description of the color metric.
 * @param {DvtAttrGroups} attrGroups An attribute groups describing the colors.
 * @return {DvtDisplayable} The rendered contents.
 */
DvtTreeLegendRenderer._renderLabels = function(context, treeView, legend, availWidth, sizeValueStr, colorValueStr, attrGroups) {
  var isRTL = DvtAgent.isRightToLeft(context);
  var eventManager = treeView.getEventManager();
  var styleDefaults = treeView.getOptions()['styleDefaults'];

  var labelContainer = null;
  if (sizeValueStr || colorValueStr) {
    // Create a container for the labels
    labelContainer = new DvtContainer(context);
    legend.addChild(labelContainer);

    var textStyle = new Array();
    textStyle.push(styleDefaults['_attributeTypeTextStyle']);
    var attrTypeStyle = DvtCSSStyle.mergeStyles(textStyle);

    textStyle = new Array();
    textStyle.push(styleDefaults['_attributeValueTextStyle']);
    var attrValueStyle = DvtCSSStyle.mergeStyles(textStyle);

    // Size: Size Metric
    var sizeLabel;
    var sizeValueLabel;
    var sizeLabelWidth;
    var sizeValueLabelWidth;
    var sizeWidth = 0;
    if (sizeValueStr) {
      // Size Label
      var sizeStr = DvtBundle.getTranslation(treeView.getOptions(), 'labelSize', treeView.getBundlePrefix(), 'SIZE');
      sizeLabel = new DvtOutputText(context, sizeStr, 0, 0);
      sizeLabel.setCSSStyle(attrTypeStyle);

      labelContainer.addChild(sizeLabel);
      sizeLabelWidth = sizeLabel.measureDimensions().w;

      // Size Value Label
      sizeValueLabel = new DvtOutputText(context, sizeValueStr, 0, 0);
      sizeValueLabel.setCSSStyle(attrValueStyle);

      labelContainer.addChild(sizeValueLabel);
      sizeValueLabelWidth = sizeValueLabel.measureDimensions().w;

      // Size section width
      sizeWidth = sizeLabelWidth + sizeValueLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
    }

    // Color: Color Metric
    var colorLabel;
    var colorValueLabel;
    var colorLabelWidth;
    var colorValueLabelWidth;
    var colorWidth = 0;
    if (colorValueStr) {
      // Color Label
      var colorStr = DvtBundle.getTranslation(treeView.getOptions(), 'labelColor', treeView.getBundlePrefix(), 'COLOR');
      colorLabel = new DvtOutputText(context, colorStr, 0, 0);
      colorLabel.setCSSStyle(attrTypeStyle);

      labelContainer.addChild(colorLabel);
      colorLabelWidth = colorLabel.measureDimensions().w;

      // Color Value Label
      colorValueLabel = new DvtOutputText(context, colorValueStr, 0, 0);
      colorValueLabel.setCSSStyle(attrValueStyle);

      labelContainer.addChild(colorValueLabel);
      colorValueLabelWidth = colorValueLabel.measureDimensions().w;

      // Size section width
      colorWidth = colorLabelWidth + colorValueLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
    }

    // Reduce size to fit if needed
    availWidth -= DvtTreeLegendRenderer._LEGEND_SECTION_GAP;
    if (sizeWidth + colorWidth > availWidth) {
      var widthPerSection = availWidth / 2;
      if (sizeWidth > widthPerSection && colorWidth > widthPerSection) {
        // Both don't fit, truncate and reposition
        var sizeValueSpace = widthPerSection - sizeLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
        if (DvtTextUtils.fitText(sizeValueLabel, sizeValueSpace, Infinity, labelContainer)) {
          sizeValueLabelWidth = sizeValueLabel.measureDimensions().w;
          eventManager.associate(sizeValueLabel, new DvtSimpleObjPeer(sizeValueStr));
        }
        else {
          labelContainer.removeChild(sizeLabel);
          labelContainer.removeChild(sizeValueLabel);
          sizeValueLabel = null;
          sizeValueLabelWidth = 0;
        }

        var colorValueSpace = widthPerSection - colorLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
        if (DvtTextUtils.fitText(colorValueLabel, colorValueSpace, Infinity, labelContainer)) {
          colorValueLabelWidth = colorValueLabel.measureDimensions().w;
          eventManager.associate(colorValueLabel, new DvtSimpleObjPeer(colorValueStr));
        }
        else {
          labelContainer.removeChild(colorLabel);
          labelContainer.removeChild(colorValueLabel);
          colorValueLabel = null;
          colorValueLabelWidth = 0;
        }
      }
      else if (sizeWidth > colorWidth) { // Reduce the size label size
        if (DvtTextUtils.fitText(sizeValueLabel, availWidth - colorWidth - sizeLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP, Infinity, labelContainer)) {
          sizeValueLabelWidth = sizeValueLabel.measureDimensions().w;
          eventManager.associate(sizeValueLabel, new DvtSimpleObjPeer(sizeValueStr));
        }
        else {
          labelContainer.removeChild(sizeLabel);
          labelContainer.removeChild(sizeValueLabel);
          sizeValueLabel = null;
          sizeValueLabelWidth = 0;
        }
      }
      else { // Reduce the color label size
        if (DvtTextUtils.fitText(colorValueLabel, availWidth - sizeWidth - colorLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP, Infinity, labelContainer)) {
          colorValueLabelWidth = colorValueLabel.measureDimensions().w;
          eventManager.associate(colorValueLabel, new DvtSimpleObjPeer(colorValueStr));
        }
        else {
          labelContainer.removeChild(colorLabel);
          labelContainer.removeChild(colorValueLabel);
          colorValueLabel = null;
          colorValueLabelWidth = 0;
        }
      }
    }

    // Position the text objects
    var x = 0;
    if (isRTL) {
      if (colorValueLabel) {
        colorValueLabel.setX(x);
        x += colorValueLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
        colorLabel.setX(x);
        x += colorLabelWidth + DvtTreeLegendRenderer._LEGEND_SECTION_GAP;
      }

      if (sizeValueLabel) {
        sizeValueLabel.setX(x);
        x += sizeValueLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
        sizeLabel.setX(x);
      }
    }
    else {
      if (sizeValueLabel) {
        sizeLabel.setX(x);
        x += sizeLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
        sizeValueLabel.setX(x);
        x += sizeValueLabelWidth + DvtTreeLegendRenderer._LEGEND_SECTION_GAP;
      }

      if (colorValueLabel) {
        colorLabel.setX(x);
        x += colorLabelWidth + DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
        colorValueLabel.setX(x);
      }
    }
  }
  return labelContainer;
};
/*---------------------------------------------------------------------------------*/
/*  DvtBaseTreeKeyboardHandler     Keyboard handler for Sunburst                   */
/*---------------------------------------------------------------------------------*/
/**
  *  @param {DvtEventManager} manager The owning DvtEventManager
  *  @class DvtBaseTreeKeyboardHandler
  *  @extends {DvtKeyboardHandler}
  *  @constructor
  */
var DvtBaseTreeKeyboardHandler = function(manager)
{
  this.Init(manager);
};

DvtObj.createSubclass(DvtBaseTreeKeyboardHandler, DvtKeyboardHandler, 'DvtBaseTreeKeyboardHandler');


/**
 * @override
 */
DvtBaseTreeKeyboardHandler.prototype.isSelectionEvent = function(event)
{
  return this.isNavigationEvent(event) && !event.ctrlKey;
};


/**
 * @override
 */
DvtBaseTreeKeyboardHandler.prototype.isMultiSelectEvent = function(event)
{
  return event.keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey;
};
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {DvtBaseComponentDefaults}
 */
var DvtBaseTreeDefaults = function() {};

DvtObj.createSubclass(DvtBaseTreeDefaults, DvtBaseComponentDefaults, 'DvtBaseTreeDefaults');


/**
 * Defaults for version 1. This component was exposed after the Alta skin, so no earlier defaults are provided.
 */
DvtBaseTreeDefaults.VERSION_1 = {
  'skin': DvtCSSStyle.SKIN_ALTA,

  // Note, only attributes that are different than the XML defaults need
  // to be listed here, at least until the XML API is replaced.
  'animationDuration': 500,
  'animationOnDataChange': 'none',
  'animationOnDisplay': 'none',
  'highlightMatch' : 'all',
  'hoverBehavior': 'none', 'hoverBehaviorDelay': 200,
  'nodeDefaults': {
    'labelStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px;")
  },
  'selectionMode': 'multiple',
  'sorting': 'off',
  '_statusMessageStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;"),
  'styleDefaults': {
    '_attributeTypeTextStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;color:#4F4F4F"),
    '_attributeValueTextStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;"),
    '_currentTextStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;"),
    '_drillTextStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;"),
    '_labelStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;")
  },
  'touchResponse' : 'auto',

  '_resources': {}
};


/**
 * @override
 */
DvtBaseTreeDefaults.prototype.Init = function(defaultsMap) {
  // This will only be called via subclasses.  Combine with defaults from this class before passing to super.
  var ret = {
    'skyros': DvtJSONUtils.merge(defaultsMap['skyros'], DvtBaseTreeDefaults.VERSION_1),
    'alta': DvtJSONUtils.merge(defaultsMap['alta'], {})
  };

  DvtBaseTreeDefaults.superclass.Init.call(this, ret);
};
/**
 * Utility functions for DvtBaseTreeView.
 * @class
 */
var DvtBaseTreeUtils = {};

DvtObj.createSubclass(DvtBaseTreeUtils, DvtObj, 'DvtBaseTreeUtils');

/**
 * Returns the maximum depth of the tree rooted at the specified node.
 * @param {DvtBaseTreeNode} node The subtree to find the depth for.
 * @param {number} depth The depth of the specified node.
 * @return {number} The maximum depth of the tree.
 */
DvtBaseTreeUtils.calcMaxDepth = function(node, depth) {
  var maxDepth = depth;
  var children = node.getChildNodes();
  if (children) {
    for (var i = 0; i < children.length; i++) {
      var childDepth = DvtBaseTreeUtils.calcMaxDepth(children[i], depth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }
  }
  return maxDepth;
};

/**
 * Returns the node count of the tree rooted at the specified node.
 * @param {DvtBaseTreeNode} node The subtree to find the depth for.
 * @return {number}
 */
DvtBaseTreeUtils.calcNodeCount = function(node) {
  var count = 1;
  var children = node.getChildNodes();
  if (children) {
    for (var i = 0; i < children.length; i++) {
      count += DvtBaseTreeUtils.calcNodeCount(children[i]);
    }
  }
  return count;
};

/**
 * Returns an array containing all the nodes in the subtree rooted at the specified node.
 * @param {DvtBaseTreeNode} node
 * @return {array}
 */
DvtBaseTreeUtils.getAllNodes = function(node) {
  var ret = [];
  DvtBaseTreeUtils._addNodesToArray(node, ret);
  return ret;
};

/**
 * Returns an array containing all the visible nodes in the subtree rooted at the specified node.
 * @param {DvtBaseTreeNode} node
 * @return {array}
 */
DvtBaseTreeUtils.getAllVisibleNodes = function(node) {
  var ret = [];
  DvtBaseTreeUtils._addNodesToArray(node, ret, false, true);
  return ret;
};

/**
 * Returns an array containing all the leaf nodes in the subtree rooted at the specified node.
 * @param {DvtBaseTreeNode} node
 * @return {array}
 */
DvtBaseTreeUtils.getLeafNodes = function(node) {
  var ret = [];
  DvtBaseTreeUtils._addNodesToArray(node, ret, true);
  return ret;
};

/**
 * Returns true if the node with the specified options would be hidden.
 * @param {object} categoryMap The boolean map of hidden categories.
 * @param {object} nodeOptions The options for the node to process.
 * @return {boolean}
 */
DvtBaseTreeUtils.isHiddenNode = function(categoryMap, nodeOptions) {
  return DvtArrayUtils.hasAnyMapItem(categoryMap, nodeOptions['categories']);
};

/**
 * If not specified, calculates and updates the attribute groups min and max values.
 * @param {object} attrGroupOptions
 * @param {array} nodes
 */
DvtBaseTreeUtils.calcContinuousAttrGroupsExtents = function(attrGroupOptions, nodes) {
  // Return if explicitly defined or no stamp id specified
  var stampId = attrGroupOptions['S'];
  if (stampId == null || (attrGroupOptions['min'] != null && attrGroupOptions['max'] != null))
    return;

  // Loop through all the nodes to find the values
  var min = Infinity;
  var max = -Infinity;
  for (var i = 0; i < nodes.length; i++) {
    // Only process if the template id matches. This is internal and only sent by ADF.
    var node = nodes[i];
    if (stampId == node.getStampId()) {
      var value = node.getOptions()['_cv'];
      if (value != null) {
        max = Math.max(max, value);
        min = Math.min(min, value);
      }
    }
  }

  // Apply the values
  if (attrGroupOptions['min'] == null)
    attrGroupOptions['min'] = min;

  if (attrGroupOptions['max'] == null)
    attrGroupOptions['max'] = max;
};

/**
 * Processes the list of attribute groups, applying the continuous color properties if needed.
 * @param {array} attrGroupsList The array of attribute groups definitions.
 * @param {array} nodes The array of nodes whose attribute groups will be applied.
 */
DvtBaseTreeUtils.processContinuousAttrGroups = function(attrGroupsList, nodes) {
  for (var i = 0; i < attrGroupsList.length; i++) {
    var attrGroupsMap = attrGroupsList[i];
    var attrGroups = attrGroupsMap.attrGroups;
    var stampId = attrGroupsMap.stampId;
    if (attrGroups instanceof DvtContinuousAttrGroups && stampId != null) {
      for (var j = 0; j < nodes.length; j++) {
        // Only process if the template id matches. This is internal and only sent by ADF.
        var node = nodes[j];
        if (stampId == node.getStampId())
          node.processAttrGroups(attrGroups);
      }
    }
  }
};

/**
 * Recursively returns an array containing all nodes in the subtree of a given node.
 * @param {DvtBaseTreeNode} node The root of the subtree whose children will be returned.
 * @param {array} ret The array onto which to add the subtree.
 * @param {boolean=} bLeafOnly Optional flag to specify whether only leaf nodes should be included.
 * @param {boolean=} bRendered Optional flag to specify whether only rendered nodes should be included.
 * @private
 */
DvtBaseTreeUtils._addNodesToArray = function(node, ret, bLeafOnly, bRendered) {
  if (!node)
    return;

  var children = node.getChildNodes();
  var childCount = children ? children.length : 0;

  // Add this node
  if ((!bLeafOnly || childCount == 0) && !(bRendered && !node.getDisplayable()))
    ret.push(node);

  // Add its children
  for (var i = 0; i < childCount; i++) {
    DvtBaseTreeUtils._addNodesToArray(children[i], ret, bLeafOnly, bRendered);
  }
};
// Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.
/*---------------------------------------------------------------------*/
/*  DvtTreeAutomation         Tree Automation Services         */
/*---------------------------------------------------------------------*/
/**
  *  Provides automation services for treemap/sunburst.  To obtain a
  *  @class  DvtTreeAutomation
  *  @param {DvtBaseTreeView} treeView
  *  @implements {DvtAutomation}
  *  @constructor
  *  @export
  */
var DvtTreeAutomation = function(treeView)
{
  this._treeView = treeView;
  this._root = treeView.getRootNode();
};

DvtObj.createSubclass(DvtTreeAutomation, DvtAutomation, 'DvtTreeAutomation');

/**
 * The subId prefix for tree nodes
 */
DvtTreeAutomation.NODE_ID_PREFIX = 'node';

/**
 * The subId prefix for breadcrumbs
 */
DvtTreeAutomation.BREADCRUMBS_PREFIX = 'breadcrumbs';

/**
 * Valid subIds inlcude:
 * <ul>
 * <li>node[nodeIndex0][nodeIndex1]...[nodeIndexN]</li>
 * </ul>
 * @override
 */
DvtTreeAutomation.prototype.GetSubIdForDomElement = function(displayable) {
  var logicalObj = this._treeView.getLogicalObject(displayable);

  if (!logicalObj) { // could be a breadcrumb
    if (displayable.getParent() instanceof DvtButton) {
      displayable = displayable.getParent();
    }
    var parent = displayable.getParent();
    if (parent instanceof DvtBreadcrumbs)
      return DvtTreeAutomation.BREADCRUMBS_PREFIX + '[' + parent.getCrumbIndex(displayable) + ']';
    return null;
  }

  if (logicalObj instanceof DvtBaseTreeNode)
  {
    var currentNode = logicalObj;
    var indices = '';

    if (!this._root.isArtificialRoot()) {
      // If logicalObj represents real root node, return default subId
      // Else include index for real root as first index in string of indices
      if (currentNode == this._root)
        return DvtTreeAutomation.NODE_ID_PREFIX + '[0]';
      else
        indices += '[0]';
    }
    // Indices for nodes beyond the root
    var childIndices = this._getIndicesFromNode(currentNode, this._root.getChildNodes());
    indices = childIndices ? indices + childIndices : indices;

    if (indices.length > 0)
      return DvtTreeAutomation.NODE_ID_PREFIX + indices;
  }
  return null;
};


/**
 * Returns the index values of the given node
 * @param {Object} node The tree node to find the indices for
 * @param {Object} children The legend nodes whose descendants are being searched
 * @return {String} [nodeIndex0][nodeIndex1]...[nodeIndexN]
 * @private
 */
DvtTreeAutomation.prototype._getIndicesFromNode = function(node, children) {
  // If there are sections in this options object, recurse through the section object
  if (children && children.length > 0) {
    for (var n = 0; n < children.length; n++) {
      if (children[n] == node)
        return '[' + n + ']';
      else {
        var nodeIndex = this._getIndicesFromNode(node, children[n].getChildNodes());
        if (nodeIndex)
          return '[' + n + ']' + nodeIndex;
      }
    }
  }
  return null;
};

/**
 * Valid subIds inlcude:
 * <ul>
 * <li>node[nodeIndex0][nodeIndex1]...[nodeIndexN]</li>
 * <li>tooltip</li>
 * </ul>
 * @override
 * @export
 */
DvtTreeAutomation.prototype.getDomElementForSubId = function(subId) {
  if (!subId)
    return null;

  // tooltip
  if (subId == DvtAutomation.TOOLTIP_SUBID)
    return this.GetTooltipElement(this._treeView);

  if (subId.indexOf(DvtTreeAutomation.BREADCRUMBS_PREFIX) == 0) {
    var index = subId.substring(subId.indexOf('[') + 1, subId.indexOf(']'));
    var crumb = this._root.getView().getBreadcrumbs().getCrumb(index);
    return crumb ? crumb.getElem() : null;
  }

  //If root is real remove first index from subId because we begin searching at the root
  if (!this._root.isArtificialRoot()) {
    subId = subId.substring(0, subId.indexOf('[')) + subId.substring(subId.indexOf(']') + 1);
    // If no more indices exist in the string return the root dom element
    if (subId == DvtTreeAutomation.NODE_ID_PREFIX)
      return this._root.getDisplayable().getElem();
  }

  var foundNode = this._getNodeFromSubId(this._root, subId);
  if (foundNode)
    return foundNode.getDisplayable().getElem();

  return null;
};

/**
 * Returns the tree node for the given subId
 * @param {Object} node The tree node whose children wil be searched
 * @param {String} subId The subId of the desired node
 * @return {Object} the child node corresponding to the given subId
 * @private
 */
DvtTreeAutomation.prototype._getNodeFromSubId = function(node, subId) {
  var openParen = subId.indexOf('[');
  var closeParen = subId.indexOf(']');
  if (openParen >= 0 && closeParen >= 0) {
    var index = subId.substring(openParen + 1, closeParen);
    subId = subId.substring(closeParen + 1);
    var nextOpenParen = subId.indexOf('[');
    var nextCloseParen = subId.indexOf(']');

    var childNode = DvtTreeAutomation._getNodeByIndex(node.getChildNodes(), index);
    if (childNode && nextOpenParen >= 0 && nextCloseParen >= 0) {
      // If there is another index layer recurse into the child node at that index
      return this._getNodeFromSubId(childNode, subId);
    }
    else // If we are at the last index return the child node at that index
      return childNode;
  }
};


/**
 * Returns the tree node for the given path array
 * @param {Object} node The tree node whose children wil be searched
 * @param {String} path The array of indices
 * @return {Object} the child node corresponding to the given path
 * @private
 */
DvtTreeAutomation.prototype._getNodeFromPath = function(node, path) {
  // Remove index at the head of the array
  var index = path.shift();

  var childNode = DvtTreeAutomation._getNodeByIndex(node.getChildNodes(), index);
  if (path.length == 0) // If this is the last index return child node at that position
    return childNode;
  else if (path.length > 0)
    return this._getNodeFromPath(childNode, path);

  return null;
};


/**
 * Returns an object containing data for a tree node. Used for verification.
 * Valid verification values inlcude:
 * <ul>
 * <li>color</li>
 * <li>label</li>
 * <li>selected</li>
 * <li>size</li>
 * <li>tooltip</li>
 * </ul>
 * @param {String} subIdPath The array of indices in the subId for the desired node
 * @return {Object} An object containing data for the node
 * @export
 */
DvtTreeAutomation.prototype.getNode = function(subIdPath) {
  // If the root is real, remove first element of subIdPath since we already start searching at the root
  if (!this._root.isArtificialRoot() && subIdPath[0] == 0)
    subIdPath.shift();

  // If root index was the only element of subIdPath, set the node to get data for as the root, else search for the correct node
  var node = (subIdPath.length == 0) ? this._root : this._getNodeFromPath(this._root, subIdPath);

  var nodeData = {
    'color': node.getColor(),
    'label': node.getLabel(),
    'selected': node.isSelected() == undefined ? false : node.isSelected(),
    'size': node.getSize(),
    'tooltip': node.getShortDesc()
  };

  return nodeData;
};

/**
 * Returns the node from the array with the specified index.
 * @param {array} nodes
 * @param {number} index
 * @return {DvtBaseTreeNode}
 * @private
 */
DvtTreeAutomation._getNodeByIndex = function(nodes, index) {
  for (var i = 0; i < nodes.length; i++) {
    if (index == nodes[i].getIndex())
      return nodes[i];
  }

  // None found, return null
  return null;
};

  return D;
});