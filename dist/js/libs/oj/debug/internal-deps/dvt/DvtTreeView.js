/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit', './DvtSubcomponent'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

(function(dvt) {
/**
 * The base class for tree components.
 * @extends {dvt.BaseComponent}
 * @class The base class for tree components.
 * @constructor
 */
var DvtTreeView = function() {};

dvt.Obj.createSubclass(DvtTreeView, dvt.BaseComponent);

/**
 * Initializes the tree view.
 * @param {dvt.Context} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @protected
 */
DvtTreeView.prototype.Init = function(context, callback, callbackObj) {
  DvtTreeView.superclass.Init.call(this, context, callback, callbackObj);

  // Create the event handler and add event listeners
  this._eventHandler = this.CreateEventManager(this, context, this.dispatchEvent, this);
  this._eventHandler.addListeners(this);

  // Drag and drop support
  this._dragSource = new dvt.DragSource(context);
  this._dropTarget = new DvtTreeDropTarget(this);
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
DvtTreeView.prototype.SetOptions = function(options) {
  if (options) {
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
 * Renders the component using the specified options.  If no options is supplied to a component
 * that has already been rendered, this function will rerender the component with the
 * specified size.
 * @param {object} options The new options object.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
DvtTreeView.prototype.render = function(options, width, height) 
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
  var availSpace = new dvt.Rectangle(0, 0, this.Width, this.Height);
  this.Layout(availSpace);

  // Create a new container and render the component into it
  var container = new dvt.Container(this.getCtx());
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
  var bounds = new dvt.Rectangle(0, 0, this.Width, this.Height);
  var bBlackBoxUpdate = false; // true if this is a black box update animation
  if (!this._container) {
    this.Animation = this.GetDisplayAnimation(container, bounds);
  }
  else if (animationOnDataChange && bNewOptions) {
    // AnimationOnDataChange
    if (dvt.BlackBoxAnimationHandler.isSupported(animationOnDataChange)) {
      // Black Box Animation
      this.Animation = dvt.BlackBoxAnimationHandler.getCombinedAnimation(this.getCtx(), animationOnDataChange, this._container, container, bounds, this.AnimationDuration);
      bBlackBoxUpdate = true;
    }
    else if (this._oldRoot && animationOnDataChange == 'auto') {
      // Data Change Animation
      // Create the animation handler, calc, and play the animation
      this._deleteContainer = this.GetDeleteContainer();
      this.addChild(this._deleteContainer);
      var ah = new DvtTreeAnimationHandler(this.getCtx(), this._deleteContainer);
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
DvtTreeView.prototype.Parse = function(xmlString) {
  // subclasses should override
  return null;
};


/**
 * Performs layout for the component.
 * @param {dvt.Rect} availSpace The rectangle within which to perform layout.
 * @protected
 */
DvtTreeView.prototype.Layout = function(availSpace) {
  // subclasses should override
};


/**
 * Renders the component.
 * @param {dvt.Container} container The container to render within.
 * @param {dvt.Rectangle} bounds The bounds of the node area.
 * @protected
 */
DvtTreeView.prototype.Render = function(container, bounds) {
  // subclasses should override
};


/**
 * Renders the background.
 * @param {dvt.Container} container The container to render within.
 * @param {string} defaultStyle The default style string
 * @protected
 */
DvtTreeView.prototype.RenderBackground = function(container, defaultStyle) {
  // Render an invisible fill for eventing
  var background = new dvt.Rect(this.getCtx(), 0, 0, this.Width, this.Height);
  background.setInvisibleFill();
  container.addChild(background);
};


/**
 * Lays out the breadcrumbs and updates the available space.
 * @param {dvt.Rect} availSpace The rectangle within which to perform layout.
 * @protected
 */
DvtTreeView.prototype.LayoutBreadcrumbs = function(availSpace) {
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
 * @param {dvt.Container} container The container to render within.
 * @protected
 */
DvtTreeView.prototype.RenderBreadcrumbs = function(container) {
  // The breadcrumbs are actually already rendered in _layoutBreadcrumbs, so just add it to the tree here.
  if (this._breadcrumbs) {
    container.addChild(this._breadcrumbs);
  }
};


/**
 * Lays out the legend component and updates the available space.
 * @param {dvt.Rect} availSpace The rectangle within which to perform layout.
 * @protected
 */
DvtTreeView.prototype.LayoutLegend = function(availSpace) {
  this._legend = DvtTreeLegendRenderer.render(this, availSpace, this._legendSource);
};


/**
 * Renders the legend.
 * @param {dvt.Container} container The container to render within.
 * @protected
 */
DvtTreeView.prototype.RenderLegend = function(container) {
  // The legend is actually already rendered in _layoutLegend, so just add it to the tree here.
  if (this._legend) {
    container.addChild(this._legend);

    // Clear the pointer, since we don't need it anymore
    this._legend = null;
  }
};


/**
 * Renders the empty text message, centered in the available space.
 * @param {dvt.Container} container The container to render within.
 * @protected
 */
DvtTreeView.prototype.RenderEmptyText = function(container) {
  var options = this.getOptions();
  var emptyText = options['emptyText'];
  if (!emptyText)
    emptyText = dvt.Bundle.getTranslation(options, 'labelNoData', dvt.Bundle.UTIL_PREFIX, 'NO_DATA');

  dvt.TextUtils.renderEmptyText(container, emptyText, new dvt.Rectangle(0, 0, this.Width, this.Height), this.getEventManager(), options['_statusMessageStyle']);
};


/**
 * Checks whether the component has valid data.
 * @return {boolean} True if the component has valid data.
 * @protected
 */
DvtTreeView.prototype.HasValidData = function() {
  return (this._root && this._root.getSize() > 0);
};


/**
 * Returns the animation to use on initial display of this component.
 * @param {dvt.Container} container The container to render within.
 * @param {dvt.Rectangle} bounds The bounds of the node area.
 * @return {dvt.BaseAnimation} The initial display animation.
 * @protected
 */
DvtTreeView.prototype.GetDisplayAnimation = function(container, bounds) {
  var animationOnDisplay = this.getOptions()['animationOnDisplay'];
  if (dvt.BlackBoxAnimationHandler.isSupported(animationOnDisplay))
    return dvt.BlackBoxAnimationHandler.getInAnimation(this.getCtx(), animationOnDisplay, container, bounds, this.AnimationDuration);
  else
    return null;
};


/**
 * Hook for cleaning up animation behavior at the end of the animation.
 * @protected
 */
DvtTreeView.prototype.OnAnimationEnd = function() {
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
 * @return {dvt.Container}
 * @protected
 */
DvtTreeView.prototype.GetDeleteContainer = function() {
  return new dvt.Container(this.getCtx());
};


/**
 * Returns a keyboard handler that can be used by the view's event manager
 * @param {dvt.EventManager} manager The owning event manager
 * @return {dvt.KeyboardHandler}
 * @protected
 */
DvtTreeView.prototype.CreateKeyboardHandler = function(manager)
{
  return new DvtTreeKeyboardHandler(manager);
};


/**
 * Returns an event manager that will handle events on this view
 * @param {dvt.Container} view
 * @param {dvt.Context} context
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @return {dvt.EventManager}
 * @protected
 */
DvtTreeView.prototype.CreateEventManager = function(view, context, callback, callbackObj)
{
  return new DvtTreeEventManager(view, context, callback, callbackObj);
};


/**
 * Returns the node that should receive initial keyboard focus when the view first gets focus
 * @param {DvtTreeNode} root The node that should receive initial keyboard focus
 * @return {DvtTreeNode}
 * @protected
 */
DvtTreeView.prototype.GetInitialFocusedItem = function(root)
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
 */
DvtTreeView.prototype.highlight = function(categories) {
  // Update the options
  this.getOptions()['highlightedCategories'] = dvt.JsonUtils.clone(categories);

  // Perform the highlighting
  dvt.CategoryRolloverHandler.highlight(categories, DvtTreeUtils.getAllNodes(this._root), this.getOptions()['highlightMatch'] == 'any');
};

/**
 * @override
 */
DvtTreeView.prototype.select = function(selection) {
  // Update the options
  var options = this.getOptions();
  options['selection'] = dvt.JsonUtils.clone(selection);

  // Perform the selection
  if (this._selectionHandler) {
    var targets = DvtTreeUtils.getAllNodes(this._root);
    this._selectionHandler.processInitialSelections(options['selection'], targets);
  }
};

/**
 * @override
 */
DvtTreeView.prototype.getEventManager = function() {
  return this._eventHandler;
};

/**
 * Returns the maximum depth of the tree.
 * @return {number} The maximum depth of the tree.
 */
DvtTreeView.prototype.__getMaxDepth = function() {
  return this._maxDepth;
};


/**
 * Returns the node count of the tree.
 * @return {number} The node count of the tree.
 */
DvtTreeView.prototype.__getNodeCount = function() {
  return this._nodeCount;
};

/**
 * Applies the parsed properties to this component.
 * @param {object} props An object containing the parsed properties for this component.
 * @protected
 */
DvtTreeView.prototype.ApplyParsedProperties = function(props) {
  var options = this.getOptions();

  // Save the old info for animation support
  this._oldRoot = this._root;
  this._oldAncestors = this._ancestors;

  // Save the parsed properties
  this._root = props.root;
  this._ancestors = options['_ancestors'] ? options['_ancestors'] : [];
  this._nodeCount = this._root ? DvtTreeUtils.calcNodeCount(this._root) : 0;
  this._maxDepth = this._root ? DvtTreeUtils.calcMaxDepth(this._root, 0) : 0;

  // TODO : This uses the weird client side value in seconds
  this.AnimationDuration = dvt.StyleUtils.getTimeMilliseconds(options['animationDuration']) / 1000;

  this._styles = props.styles ? props.styles : {};

  // Selection Support
  if (options['selectionMode'] == 'none')
    this._nodeSelection = null;
  else if (options['selectionMode'] == 'single')
    this._nodeSelection = dvt.SelectionHandler.TYPE_SINGLE;
  else
    this._nodeSelection = dvt.SelectionHandler.TYPE_MULTIPLE;

  if (this._nodeSelection) {
    this._selectionHandler = new dvt.SelectionHandler(this._nodeSelection);
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
    var nodes = DvtTreeUtils.getAllNodes(this._root);
    for (var i = 0; i < options['attributeGroups'].length; i++) {
      var attrGroup = options['attributeGroups'][i];
      var agObj = null;
      if (attrGroup['attributeType'] == 'continuous') {
        DvtTreeUtils.calcContinuousAttrGroupsExtents(attrGroup, nodes);
        agObj = new dvt.ContinuousAttrGroups(attrGroup['min'], attrGroup['max'], attrGroup['minLabel'], attrGroup['maxLabel'], attrGroup['colors']);
      }
      else { // discrete
        agObj = new dvt.DiscreteAttrGroups();
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
    DvtTreeUtils.processContinuousAttrGroups(this._attrGroups, nodes);
  }

  // ADF Context Menus
  var menus = options['_contextMenus'];
  if (menus && menus.length > 0) {
    var contextMenuHandler = new dvt.ContextMenuHandler(this.getCtx(), menus);
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
DvtTreeView.prototype.ReselectNodes = function() {
  var selectedNodes = this._selectionHandler ? this._selectionHandler.getSelection() : new Array();
  for (var i = 0; i < selectedNodes.length; i++)
    selectedNodes[i].setSelected(true);
};


/**
 * Update the selection handler with the initial selections.
 * @private
 */
DvtTreeView.prototype._processInitialSelections = function() {
  if (this._selectionHandler && this._initialSelection) {
    var targets = DvtTreeUtils.getAllNodes(this._root);
    this._selectionHandler.processInitialSelections(this._initialSelection, targets);
    this._initialSelection = null;
  }
};

/**
 * Update the displayables with the initial highlighting.
 * @private
 */
DvtTreeView.prototype._processInitialHighlighting = function() {
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
DvtTreeView.prototype._processInitialFocus = function(applyVisualEffects) {

  var initialFocus = null;
  var id = this.__getNavigableIdToFocus();

  if (id)
  {
    initialFocus = DvtTreeNode.getNodeById(this._root, id);
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
DvtTreeView.prototype.setFocused = function(isFocused)
{
  this._hasFocus = isFocused;
  this._eventHandler.setFocused(isFocused);
};


/**
 * Returns true if the view currently has keyboard focus
 * @return {boolean}
 */
DvtTreeView.prototype.isFocused = function()
{
  return this._hasFocus;
};

/**
 * Returns the animation duration, in milliseconds.
 * @return {number}
 */
DvtTreeView.prototype.__getAnimationDuration = function() {
  return this.AnimationDuration;
};

/**
 * Returns the content facet template for the given stamp id.
 * @param {string} stampId
 * @return {object}
 */
DvtTreeView.prototype.__getTemplate = function(stampId) {
  return this._templates ? this._templates[stampId] : null;
};

/**
 * Returns the afComponent context instance.
 * @return {DvtAfContext}
 */
DvtTreeView.prototype.__getAfContext = function() {
  return this._afContext;
};


/**
 * Returns the node under the specified coordinates.
 * @param {number} x
 * @param {number} y
 * @return {DvtTreeNode}
 */
DvtTreeView.prototype.__getNodeUnderPoint = function(x, y) {
  return this._root.getNodeUnderPoint(x, y);
};


/**
 * Returns the clientId of the drag source owner if dragging is supported.
 * @param {array} clientIds
 * @return {string}
 */
DvtTreeView.prototype.__isDragAvailable = function(clientIds) {
  // Drag and drop supported when selection is enabled, only 1 drag source
  if (this._selectionHandler)
    return clientIds[0];
  else
    return null;
};


/**
 * Returns the row keys for the current drag.
 * @param {DvtTreeNode} node The node where the drag was initiated.
 * @return {array} The row keys for the current drag.
 */
DvtTreeView.prototype.__getDragTransferable = function(node) {
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
DvtTreeView.prototype.__getDragFeedback = function() {
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
 * @param {DvtTreeNode} node The node for which to show drop feedback, or null to remove drop feedback.
 * @return {dvt.Displayable} The drop site feedback, if any.
 */
DvtTreeView.prototype.__showDropSiteFeedback = function(node) {
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
 * @param {dvt.BreadcrumbsDrillEvent} event
 */
DvtTreeView.prototype.__processBreadcrumbsEvent = function(event) {
  if (event instanceof dvt.BreadcrumbsDrillEvent)
    this.__drill(event.getId(), false);
};


/**
 * Performs a drill on the specified node.
 * @param {string} id
 * @param {boolean} bDrillUp True if this is a drill up operation.
 */
DvtTreeView.prototype.__drill = function(id, bDrillUp) {
  if (bDrillUp && this._root && id == this._root.getId() && this._ancestors.length > 0) {
    // after the drill up completes, set keyboard focus on the node that was the
    // root of the previously drilled-down view
    this.__setNavigableIdToFocus(id);

    // Drill up only supported on the root node
    this.dispatchEvent(dvt.EventFactory.newDrillEvent(this._ancestors[0].id));
  }
  else if (!bDrillUp) // Fire the event
    this.dispatchEvent(dvt.EventFactory.newDrillEvent(id));

  // Hide any tooltips being shown
  this.getCtx().getTooltipManager().hideTooltip();
};


/**
 * Returns the logical object corresponding to the physical target
 * @param {Object} target
 * @return {Object}
 */
DvtTreeView.prototype.getLogicalObject = function(target)
{
  return this._eventHandler.GetLogicalObject(target);
};


/**
 * @return {DvtTreeNode} the root tree node.
 */
DvtTreeView.prototype.getRootNode = function()
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
DvtTreeView.prototype.__getNavigableIdToFocus = function() 
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
DvtTreeView.prototype.__setNavigableIdToFocus = function(id) 
{
  this._navigableIdToFocus = id;
};


/**
 * @return {String} whether nodeSelection is multiple, single, or null.
 */
DvtTreeView.prototype.__getNodeSelection = function() 
{
  return this._nodeSelection;
};

/**
 * Creates a node for this view. Subclasses must override.
 * @param {object} nodeOptions The options for the node.
 * @return {DvtTreeNode}
 * @protected
 */
DvtTreeView.prototype.CreateNode = function(nodeOptions) {
  // subclasses must override
  return null;
};

/**
 * Helper function to return the bundle prefix for this component.
 * @return {string}
 */
DvtTreeView.prototype.getBundlePrefix = function() {
  // subclasses must override
  return null;
};

/**
 * Returns the automation object for this treeView
 * @return {dvt.Automation} The automation object
 */
DvtTreeView.prototype.getAutomation = function() {
  return new DvtTreeAutomation(this);
};

/**
 * Returns the breadcrumbs object for this treeView
 * Used by automation APIs
 * @return {dvt.Breadcrumbs} The breadcrumbs object
 */
DvtTreeView.prototype.getBreadcrumbs = function() {
  return this._breadcrumbs;
};

/**
 * Recursively creates and returns the root layer nodes based on the options object. Creates an artificial node if
 * needed for multi-rooted trees.
 * @return {DvtTreeNode}
 * @private
 */
DvtTreeView.prototype._processNodes = function() {
  var options = this.getOptions();
  if (options['nodes'] == null)
    return null;

  // Create each of the root level nodes
  var rootNodes = [];
  // create a boolean map of hidden categories for better performance
  var hiddenCategories = dvt.ArrayUtils.createBooleanMap(options['hiddenCategories']);
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
 * @return {DvtTreeNode}
 * @private
 */
DvtTreeView.prototype._processNode = function(hiddenCategories, nodeOptions) {
  // Don't create if node is hidden
  if (DvtTreeUtils.isHiddenNode(hiddenCategories, nodeOptions))
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
 * @param {DvtTreeNode} root The root node
 * @protected
 */
DvtTreeView.prototype.UpdateAriaNavigation = function(root) {
  // VoiceOver workaround for 
  if (dvt.Agent.isTouchDevice() || dvt.Agent.isEnvironmentTest()) {
    var nodes = DvtTreeUtils.getAllVisibleNodes(root);
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
// APIs called by the ADF Faces drag source for DvtTreeView


/**
 * If this object supports drag, returns the client id of the drag component.
 * Otherwise returns null.
 * @param mouseX the x coordinate of the mouse
 * @param mouseY the x coordinate of the mouse
 * @param clientIds the array of client ids of the valid drag components
 */
DvtTreeView.prototype.isDragAvailable = function(mouseX, mouseY, clientIds) {
  return this._dragSource.isDragAvailable(clientIds);
};


/**
 * Returns the transferable object for a drag initiated at these coordinates.
 */
DvtTreeView.prototype.getDragTransferable = function(mouseX, mouseY) {
  return this._dragSource.getDragTransferable(mouseX, mouseY);
};


/**
 * Returns the feedback for the drag operation.
 */
DvtTreeView.prototype.getDragOverFeedback = function(mouseX, mouseY) {
  return this._dragSource.getDragOverFeedback(mouseX, mouseY);
};


/**
 * Returns an Object containing the drag context info.
 */
DvtTreeView.prototype.getDragContext = function(mouseX, mouseY) {
  return this._dragSource.getDragContext(mouseX, mouseY);
};


/**
 * Returns the offset to use for the drag feedback. This positions the drag
 * feedback relative to the pointer.
 */
DvtTreeView.prototype.getDragOffset = function(mouseX, mouseY) {
  return this._dragSource.getDragOffset(mouseX, mouseY);
};


/**
 * Returns the offset from the mouse pointer where the drag is considered to be located.
 */
DvtTreeView.prototype.getPointerOffset = function(xOffset, yOffset) {
  return this._dragSource.getPointerOffset(xOffset, yOffset);
};


/**
 * Notifies the component that a drag started.
 */
DvtTreeView.prototype.initiateDrag = function() {
  this._dragSource.initiateDrag();
};


/**
 * Clean up after the drag is completed.
 */
DvtTreeView.prototype.dragDropEnd = function() {
  this._dragSource.dragDropEnd();
};
// APIs called by the ADF Faces drop target for DvtTreeView


/**
 * If a drop is possible at these mouse coordinates, returns the client id
 * of the drop component. Returns null if drop is not possible.
 */
DvtTreeView.prototype.acceptDrag = function(mouseX, mouseY, clientIds) {
  return this._dropTarget.acceptDrag(mouseX, mouseY, clientIds);
};


/**
 * Paints drop site feedback as a drag enters the drop site.
 */
DvtTreeView.prototype.dragEnter = function() {
  this._dropTarget.dragEnter();
};


/**
 * Cleans up drop site feedback as a drag exits the drop site.
 */
DvtTreeView.prototype.dragExit = function() {
  this._dropTarget.dragExit();
};


/**
 * Returns the object representing the drop site. This method is called when a valid
 * drop is performed.
 */
DvtTreeView.prototype.getDropSite = function(mouseX, mouseY) {
  return this._dropTarget.getDropSite(mouseX, mouseY);
};
/**
 * Animation handler for tree data objects.
 * @param {dvt.Context} context The platform specific context object.
 * @param {dvt.Container} deleteContainer The container where deletes should be moved for animation.
 * @class DvtTreeAnimationHandler
 * @constructor
 */
var DvtTreeAnimationHandler = function(context, deleteContainer) {
  this.Init(context, deleteContainer);
};

dvt.Obj.createSubclass(DvtTreeAnimationHandler, dvt.DataAnimationHandler);


/**
 * Animates the tree component, with support for data changes and drilling.
 * @param {DvtTreeNode} oldRoot The state of the tree before the animation.
 * @param {DvtTreeNode} newRoot The state of the tree after the animation.
 * @param {array} oldAncestors The array of ancestors for the old root node.
 * @param {array} newAncestors The array of ancestors for the new root node.
 */
DvtTreeAnimationHandler.prototype.animate = function(oldRoot, newRoot, oldAncestors, newAncestors) {
  this._bDrill = false; // true if this is a drilling animation
  this._oldRoot = oldRoot;
  this._oldAncestors = oldAncestors;

  // Determine whether this is a drill or data change animation
  if (DvtTreeAnimationHandler._isAncestor(newAncestors, oldRoot) ||
      DvtTreeAnimationHandler._isAncestor(oldAncestors, newRoot))
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
DvtTreeAnimationHandler.prototype.isDrillAnimation = function() {
  return this._bDrill;
};


/**
 * Returns true if the specified node was previously an ancestor of the old root.  A value
 * of true indicates that an insert animation should not be performed on this node.
 * @param {DvtTreeNode} node
 */
DvtTreeAnimationHandler.prototype.isAncestorInsert = function(node) {
  if (this._bDrill)
    return this._oldRoot.getId() == node.getId() ||
           DvtTreeAnimationHandler._isAncestor(this._oldAncestors, node);
  else
    return false;
};


/**
 * Returns true if the specified node is contained in the array of ancestors.
 * @param {array} ancestors The array of ancestors to search.
 * @param {DvtTreeNode} node The node to search for.
 * @return {boolean}
 */
DvtTreeAnimationHandler._isAncestor = function(ancestors, node) {
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
 * Drop Target event handler for DvtTreeView
 * @param {DvtTreeView} view
 * @class DvtTreeDropTarget
 * @extends {dvt.DropTarget}
 * @constructor
 */
var DvtTreeDropTarget = function(view) {
  this._view = view;
};

dvt.Obj.createSubclass(DvtTreeDropTarget, dvt.DropTarget);


/**
 * @override
 */
DvtTreeDropTarget.prototype.acceptDrag = function(mouseX, mouseY, clientIds) {
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
DvtTreeDropTarget.prototype.dragExit = function() {
  // Remove drop site feedback
  this._view.__showDropSiteFeedback(null);
  this._dropSite = null;
};


/**
 * @override
 */
DvtTreeDropTarget.prototype.getDropSite = function(mouseX, mouseY) {
  var node = this._view.__getNodeUnderPoint(mouseX, mouseY);
  if (node)
    return {clientRowKey: node.getId()};
  else
    return null;
};
/**
 * Event Manager for tree components.
 * @param {DvtTreeView} view
 * @param {dvt.Context} context
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 * @constructor
 */
var DvtTreeEventManager = function(view, context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
  this._view = view;
};

dvt.Obj.createSubclass(DvtTreeEventManager, dvt.EventManager);

/**
 * Returns the owning tree component.
 * @return {DvtTreeView}
 * @protected
 */
DvtTreeEventManager.prototype.GetView = function() {
  return this._view;
};

/**
 * @override
 */
DvtTreeEventManager.prototype.OnDblClickInternal = function(event) {
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
DvtTreeEventManager.prototype.OnClick = function(event) {
  DvtTreeEventManager.superclass.OnClick.call(this, event);

  // If the object is a DvtTreePeer (for node labels), handle drilling
  var obj = this.GetLogicalObject(event.target);
  this._processNodeLabel(obj);

  // Only drill if not selectable. If selectable, drill with double click.
  if (obj && !(obj.isSelectable && obj.isSelectable()))
    this._processDrill(obj, event.shiftKey);
};


/**
 * @override
 */
DvtTreeEventManager.prototype.OnMouseOver = function(event) {
  DvtTreeEventManager.superclass.OnMouseOver.call(this, event);

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
DvtTreeEventManager.prototype.OnMouseOut = function(event) {
  DvtTreeEventManager.superclass.OnMouseOut.call(this, event);

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
DvtTreeEventManager.prototype.ProcessKeyboardEvent = function(event)
{
  var eventConsumed = false;
  var keyCode = event.keyCode;
  var obj = this.getFocus(); // the item with current keyboard focus

  if (keyCode == dvt.KeyboardEvent.ENTER && !event.ctrlKey)
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

    dvt.EventManager.consumeEvent(event);
    eventConsumed = true;
  }
  else
  {
    eventConsumed = DvtTreeEventManager.superclass.ProcessKeyboardEvent.call(this, event);
  }

  return eventConsumed;
};

/**
 * @override
 */
DvtTreeEventManager.prototype.HandleTouchClickInternal = function(event) {
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

  if (obj instanceof DvtTreeNode) {
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
DvtTreeEventManager.prototype.HandleTouchDblClickInternal = function(event) {
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
DvtTreeEventManager.prototype._processNodeLabel = function(obj) {
  if (obj && obj instanceof DvtTreePeer && obj.isDrillable()) {
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
DvtTreeEventManager.prototype._processDrill = function(obj, shiftKey) {
  // Fire a drill event if drilling is enabled
  if (obj.isDrillReplaceEnabled && obj.isDrillReplaceEnabled()) {
    // Delegate to the view to fire a drill event
    this._view.__drill(obj.getId(), shiftKey);
  }
};

/**
 * @override
 */
DvtTreeEventManager.prototype.ProcessRolloverEvent = function(event, obj, bOver) {
  // Don't continue if not enabled
  var options = this._view.getOptions();
  if (options['hoverBehavior'] != 'dim')
    return;

  // Compute the new highlighted categories and update the options
  var categories = obj.getCategories ? obj.getCategories() : [];
  options['highlightedCategories'] = bOver ? categories.slice() : null;

  // Fire the event to the rollover handler, who will fire to the component callback.
  var rolloverEvent = dvt.EventFactory.newCategoryHighlightEvent(options['highlightedCategories'], bOver);
  var nodes = DvtTreeUtils.getAllNodes(this.GetView().getRootNode());
  var hoverBehaviorDelay = dvt.StyleUtils.getTimeMilliseconds(options['hoverBehaviorDelay']);
  this.RolloverHandler.processEvent(rolloverEvent, nodes, hoverBehaviorDelay, options['highlightMatch'] == 'any');
};

/**
 * @override
 */
DvtTreeEventManager.prototype.GetTouchResponse = function() {
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
var DvtTreeNode = function() {};

dvt.Obj.createSubclass(DvtTreeNode, dvt.Obj);

DvtTreeNode._ANIMATION_DELETE_PRIORITY = 0;   // The order in which the delete animation occurs
DvtTreeNode._ANIMATION_UPDATE_PRIORITY = 1;   // The order in which the update animation occurs
DvtTreeNode._ANIMATION_INSERT_PRIORITY = 2;   // The order in which the insert animation occurs

DvtTreeNode._DEFAULT_FILL_COLOR = '#000000';
DvtTreeNode._DEFAULT_TEXT_SIZE = 11;

DvtTreeNode.__NODE_SELECTED_SHADOW = new dvt.Shadow('#000000', 2, 5, 5, 45, 0.5);

/**
 * @param {DvtTreeView} treeView The DvtTreeView that owns this node.
 * @param {object} props The properties for the node.
 * @protected
 */
DvtTreeNode.prototype.Init = function(treeView, props)
{
  this._view = treeView;
  this._options = props;

  var nodeDefaults = this._view.getOptions()['nodeDefaults'];

  this._id = props['id'] || props['label']; // If id is undefined, use label as id
  this._color = props['color'] ? props['color'] : DvtTreeNode._DEFAULT_FILL_COLOR;
  this._textStr = props['label'];
  this._labelStyle = typeof props['labelStyle'] == 'string' ? new dvt.CSSStyle(props['labelStyle']) : props['labelStyle'];
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
DvtTreeNode.prototype.setChildNodes = function(children) {
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
DvtTreeNode.prototype.getChildNodes = function() {
  return this._children ? this._children : [];
};


/**
 * Returns an Array containing all the descendants of this node
 * @return {Array} The array of descendants of this node
 */
DvtTreeNode.prototype.getDescendantNodes = function()
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
 * @param {DvtTreeNode} lastVisited
 * @protected
 */
DvtTreeNode.prototype.SetLastVisitedChild = function(lastVisited)
{
  this._lastVisitedChild = lastVisited;
};


/**
 * Returns the last visited child
 *
 * @return {DvtTreeNode} The last visited child
 * @protected
 */
DvtTreeNode.prototype.GetLastVisitedChild = function() 
{
  return this._lastVisitedChild;
};


/**
 * Updates the last visited child on the given node's parent to this node
 * @protected
 */
DvtTreeNode.prototype.MarkAsLastVisitedChild = function()
{
  var parent = this.GetParent();
  if (parent)
  {
    parent.SetLastVisitedChild(this);
  }
};


/**
 * Returns true if this node is a descendant of the specified node.
 * @param {DvtTreeNode} node
 */
DvtTreeNode.prototype.isDescendantOf = function(node) {
  if (!node || !this.GetParent())
    return false;
  else if (this.GetParent() == node)
    return true;
  else
    return this.GetParent().isDescendantOf(node);
};


/**
 * Returns an Array containing all nodes that are at the given depth away from the current node
 * @param {DvtTreeNode} root
 * @param {Number} depth
 * @return {Array}
 */
DvtTreeNode.prototype.GetNodesAtDepth = function(root, depth)
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
 * @param {DvtTreeNode} root
 * @param {String} id
 * @return {DvtTreeNode} The node with the given id, or null if no node with the given id is found
 */
DvtTreeNode.getNodeById = function(root, id)
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
      node = DvtTreeNode.getNodeById(child, id);
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
 * @return {DvtTreeView} The component that owns this node.
 */
DvtTreeNode.prototype.getView = function() {
  return this._view;
};


/**
 * Returns the id of the stamp for this node.
 * @return {string} The id of the stamp for this node.
 */
DvtTreeNode.prototype.getStampId = function() {
  return this._stampId;
};

/**
 * Returns the options object for this node.
 * @return {object}
 */
DvtTreeNode.prototype.getOptions = function() {
  return this._options;
};

/**
 * @override
 */
DvtTreeNode.prototype.getCategories = function() {
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
DvtTreeNode.prototype.getId = function() {
  return this._id;
};


/**
 * Returns the relative size of this node.
 * @return {Number} The relative size of this node.
 */
DvtTreeNode.prototype.getSize = function() {
  // Note: Called by automation APIs
  return this._size;
};


/**
 * Returns the color of this node.
 * @return {String} The color of this node.
 */
DvtTreeNode.prototype.getColor = function() {
  // Note: Called by automation APIs
  return this._color;
};


/**
 * @override
 */
DvtTreeNode.prototype.getDatatip = function() {
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
DvtTreeNode.prototype.getDatatipColor = function() {
  return this._color;
};

/**
 * Returns the shortDesc of the node.
 * @return {string}
 */
DvtTreeNode.prototype.getShortDesc = function() {
  // Note: Called by automation APIs
  return this._shortDesc;
};

/**
 * Returns the data context that will be passed to the tooltip function.
 * @return {object}
 */
DvtTreeNode.prototype.getDataContext = function() {
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
DvtTreeNode.prototype.getIndex = function() {
  return this.getOptions()['_index'];
};

/**
 * Returns the alpha for this node.
 * @return {number} The alpha for this node.
 */
DvtTreeNode.prototype.getAlpha = function() {
  // Note: This API is called by the fadeIn and fadeOut animations
  return this._alpha;
};


/**
 * Specifies the alpha for this node.
 * @param {number} alpha The alpha for this node.
 */
DvtTreeNode.prototype.setAlpha = function(alpha) {
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
DvtTreeNode.prototype.setDisclosed = function(disclosed) {
  this.getOptions()['_expanded'] = disclosed;
};

/**
 * Returns true if the children of this node are disclosed.
 * @return {boolean}
 * @protected
 */
DvtTreeNode.prototype.isDisclosed = function() {
  return this.getOptions()['_expanded'] !== false;
};

/**
 * Returns true if this node is the artificial root of the tree.
 * @return {boolean}
 */
DvtTreeNode.prototype.isArtificialRoot = function() {
  return this._bArtificialRoot;
};


/**
 * Returns true if drill replace is enabled for this node.
 * @return {boolean}
 */
DvtTreeNode.prototype.isDrillReplaceEnabled = function() {
  return this._drilling == 'replace' || this._drilling == 'insertAndReplace';
};

/**
 * @override
 */
DvtTreeNode.prototype.getShowPopupBehaviors = function() {
  // Retrieve from the showPopupBehaviors map in the options object, indexed via the stampid.
  var behaviors = this.getView().getOptions()['_spb'];
  if (!behaviors || !behaviors[this.getStampId()])
    return null;

  // If found, create a dvt.ShowPopupBehavior and return
  return dvt.ShowPopupBehavior.createBehaviors(behaviors[this.getStampId()]);
};

/**
 * Renders this node.
 * @param {dvt.Container} container The container to render in.
 */
DvtTreeNode.prototype.render = function(container) {
  // subclasses should override
};


/**
 * Renders the child nodes of this node.
 * @param {dvt.Container} container The container to render in.
 */
DvtTreeNode.prototype.renderChildren = function(container) {
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
 * @param {dvt.AttrGroups} ag
 */
DvtTreeNode.prototype.processAttrGroups = function(ag) {
  var color = ag.get(this.getOptions()['_cv']);
  if (color)
    this._color = color;
};


/**
 * Default implementation of getNextNavigable. Returns this node as the next navigable.  Subclasses should override
 * @override
 */
DvtTreeNode.prototype.getNextNavigable = function(event) 
{
  // subclasses should override
  this.MarkAsLastVisitedChild();
  return this;
};


/**
 * @override
 */
DvtTreeNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  // subclasses should override
  return new dvt.Rectangle(0, 0, 0, 0);
};

/**
 * @override
 */
DvtTreeNode.prototype.getTargetElem = function() 
{
  // subclasses should override
  return null;
};

/**
 * @override
 */
DvtTreeNode.prototype.showKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = true;

  this.showHoverEffect();
  if (this.handleMouseOver)
    this.handleMouseOver();

};


/**
 * @override
 */
DvtTreeNode.prototype.hideKeyboardFocusEffect = function()
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
DvtTreeNode.prototype.isShowingKeyboardFocusEffect = function() 
{
  return this._isShowingKeyboardFocusEffect;
};


/**
 * Handles a mouse over event on the node.
 */
DvtTreeNode.prototype.handleMouseOver = function() {
  this.IsHover = true;
};


/**
 * Handles a mouse out event on the node.
 */
DvtTreeNode.prototype.handleMouseOut = function() {
  this.IsHover = false;
};


/**
 * @override
 */
DvtTreeNode.prototype.isSelectable = function() {
  return this._selectable != 'off' && this.getView().__getNodeSelection() != null;
};


/**
 * @override
 */
DvtTreeNode.prototype.isSelected = function() {
  return this._selected;
};


/**
 * @override
 */
DvtTreeNode.prototype.setSelected = function(selected) {
  // Store the selection state
  this._selected = selected;
  this.UpdateAriaLabel();
};


/**
 * @override
 */
DvtTreeNode.prototype.showHoverEffect = function() {
  // subclasses should override
};


/**
 * @override
 */
DvtTreeNode.prototype.hideHoverEffect = function() {
  // subclasses should override
};

/**
 * @override
 */
DvtTreeNode.prototype.highlight = function(bDimmed, alpha) {
  // Implements DvtCategoricalObject.prototype.highlight
  this.setAlpha(alpha);
};

/**
 * @override
 */
DvtTreeNode.prototype.isDragAvailable = function(clientIds) {
  return this.getView().__isDragAvailable(clientIds);
};


/**
 * @override
 */
DvtTreeNode.prototype.getDragTransferable = function(mouseX, mouseY) {
  return this.getView().__getDragTransferable(this);
};


/**
 * @override
 */
DvtTreeNode.prototype.getDragFeedback = function(mouseX, mouseY) {
  return this.getView().__getDragFeedback();
};


/**
 * Returns a displayable used for drop site feedback.
 * @return {dvt.Displayable}
 */
DvtTreeNode.prototype.getDropSiteFeedback = function() {
  return null;
};

/**
 * Returns the bounds upon which the popup fired by the given behavior should align.
 * @param {dvt.ShowPopupBehavior} behavior The dvt.ShowPopupBehavior that is firing the popup.
 * @return {dvt.Rectangle} The rectangle that the popup should align to.
 */
DvtTreeNode.prototype.getPopupBounds = function(behavior) {
  return null; // subclasses can override, or else default positioning will occur
};


/**
 * Returns true if this node contains the given coordinates.
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
DvtTreeNode.prototype.contains = function(x, y) {
  return false; // subclasses should override
};


/**
 * Returns the node under the given point, if it exists in the subtree of this node.
 * @param {number} x
 * @param {number} y
 * @return {DvtTreeNode}
 */
DvtTreeNode.prototype.getNodeUnderPoint = function(x, y) {
  return null; // subclasses should override
};


/**
 * Returns the layout parameters for the current animation frame.
 * @return {array} The array of layout parameters.
 * @protected
 */
DvtTreeNode.prototype.GetAnimationParams = function() {
  return []; // subclasses should override
};


/**
 * Sets the layout parameters for the current animation frame.
 * @param {array} params The array of layout parameters.
 * @protected
 */
DvtTreeNode.prototype.SetAnimationParams = function(params) {
  // subclasses should override
};


/**
 * Creates the update animation for this node.
 * @param {DvtTreeAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @param {DvtTreeNode} oldNode The old node state to animate from.
 */
DvtTreeNode.prototype.animateUpdate = function(handler, oldNode) {
  // Drilling animations are handled across all nodes up front, no recursion needed
  if (!handler.isDrillAnimation()) {
    // Recurse and animate the children
    handler.constructAnimation(oldNode.getChildNodes(), this.getChildNodes());
  }

  // Create the animator for this node
  var endState = this.GetAnimationParams();
  var startState = oldNode.GetAnimationParams(endState);

  var nodePlayable;
  if (!dvt.ArrayUtils.equals(startState, endState)) {
    // Only create if state changed
    nodePlayable = new dvt.CustomAnimation(this.getView().getCtx(), this, this.getView().__getAnimationDuration());
    nodePlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.GetAnimationParams, this.SetAnimationParams, endState);

    // Create the playable
    handler.add(nodePlayable, DvtTreeNode._ANIMATION_UPDATE_PRIORITY);

    // Determine whether size and color changed.  This must be done before start state is set.
    var bSizeChanged = (this._size != oldNode._size);
    var bColorChanged = (dvt.ColorUtils.getRGBA(this._color) != dvt.ColorUtils.getRGBA(oldNode._color));

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
 * @param {DvtTreeAnimationHandler} handler The animation handler, which can be used to chain animations.
 */
DvtTreeNode.prototype.animateInsert = function(handler) {
  // Animate if this is a data change animation (not drilling), or if this node is not an
  // ancestor of the old root in a drilling animation.  The ancestors are not animated
  // so that they appear at the beginning of the animation.
  if (!handler.isDrillAnimation() || !handler.isAncestorInsert(this)) {
    // Initialize the start state
    this.setAlpha(0);

    var anim = new dvt.AnimFadeIn(this.getView().getCtx(), this, this.getView().__getAnimationDuration());
    handler.add(anim, DvtTreeNode._ANIMATION_INSERT_PRIORITY);

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
 * @param {DvtTreeAnimationHandler} handler The animation handler, which can be used to chain animations.
 * @param {dvt.Container} container The container where deletes should be moved for animation.
 */
DvtTreeNode.prototype.animateDelete = function(handler, container) {
  // Move to the new container, since the old container may be removed
  container.addChild(this._shape);

  // Create the animation
  var anim = new dvt.AnimFadeOut(this.getView().getCtx(), this, this.getView().__getAnimationDuration());
  handler.add(anim, DvtTreeNode._ANIMATION_DELETE_PRIORITY);

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
DvtTreeNode.prototype.hasChildren = function() {
  return (this._children != null && this._children.length > 0);
};


/**
 * Returns the parent node for this node.
 * @return {DvtTreeNode} The parent node.
 * @protected
 */
DvtTreeNode.prototype.GetParent = function() {
  return this._parent;
};


/**
 * Returns the depth of the node in the tree.
 * @return {number} The depth of the node.
 * @protected
 */
DvtTreeNode.prototype.GetDepth = function() {
  var depth = 0;
  var parent = this.GetParent();
  while (parent) {
    depth++;
    parent = parent.GetParent();
  }
  return depth;
};


/**
 * Returns the dvt.Fill to use for this node.
 * @return {dvt.Fill}
 */
DvtTreeNode.prototype.GetFill = function() {
  if (this._pattern)
    return new dvt.PatternFill(this._pattern, this._color);
  else
    return new dvt.SolidFill(this._color);
};


/**
 * Calculates and returns a color for node text that will provide a
 * good contrast with the given color.
 * @param {DvtTreeNode} node
 * @protected
 */
DvtTreeNode.GetNodeTextColor = function(node) {
  if (node._pattern) {
    // Use black for all patterned nodes against white backgrounds
    return '#000000';
  }
  else {
    return dvt.ColorUtils.getContrastingTextColor(node._color);
  }
};

DvtTreeNode.prototype.ApplyLabelTextStyle = function(text) {
  var defaultFillColor = DvtTreeNode.GetNodeTextColor(this);
  text.setSolidFill(defaultFillColor);
  var textStyle = new Array();
  textStyle.push(this._view.getOptions()['nodeDefaults']['labelStyle']);
  if (this._labelStyle)
    textStyle.push(this._labelStyle);
  text.setCSSStyle(dvt.CSSStyle.mergeStyles(textStyle));

  // In high contrast mode, override the app settings and use the default colors
  if (dvt.Agent.isHighContrast())
    text.setSolidFill(defaultFillColor);
};

DvtTreeNode.prototype.GetTextSize = function() {
  var size = DvtTreeNode._DEFAULT_TEXT_SIZE;
  var textStyle = this._view.getOptions()['nodeDefaults']['labelStyle'];
  var fontSize = textStyle.getFontSize();
  if (fontSize) {
    size = parseFloat(fontSize);
  }
  return size;
};

/**
 * Returns the primary displayable for this node.
 * @return {dvt.Displayable}
 */
DvtTreeNode.prototype.getDisplayable = function() {
  // Note: Called by automation APIs
  return this._shape;
};

/**
 * Returns the label string for this node.
 * @return {string}
 */
DvtTreeNode.prototype.getLabel = function() {
  // Note: Called by automation APIs
  return this._textStr;
};

DvtTreeNode.prototype.GetAfContext = function() {
  return this.getView().__getAfContext();
};

DvtTreeNode.prototype.GetElAttributes = function() {
  return this.getOptions()['_cf'];
};

DvtTreeNode.prototype.GetTemplate = function() {
  return this.getView().__getTemplate(this.getStampId());
};

/**
 * Returns whether this node can be double clicked.
 */
DvtTreeNode.prototype.isDoubleClickable = function() {
  return this.isDrillReplaceEnabled();
};

/**
 * Updates the aria label of the node.
 * @protected
 */
DvtTreeNode.prototype.UpdateAriaLabel = function() {
  // subclasses should override
};
/**
 * Simple logical object for drilling and tooltip support.
 * @param {DvtTreeNode} node The associated node, if it has been created.
 * @param {string} id The id of the associated node.
 * @param {string} tooltip The tooltip to display.
 * @param {string} datatip The datatip to display.
 * @param {string} datatipColor The border color of the datatip.
 * @class
 * @constructor
 * @implements {DvtTooltipSource}
 */
var DvtTreePeer = function(node, id, tooltip, datatip, datatipColor) {
  this.Init(tooltip, datatip, datatipColor);
  this._node = node;
  this._id = id;
  this._bDrillable = false;
};

dvt.Obj.createSubclass(DvtTreePeer, dvt.SimpleObjPeer);


/**
 * Returns the id of the associated node.
 * @return {string}
 */
DvtTreePeer.prototype.getId = function() {
  return this._id;
};


/**
 * Returns true if the associated object is drillable.
 * @return {boolean}
 */
DvtTreePeer.prototype.isDrillable = function() {
  return this._bDrillable;
};


/**
 * Specifies whether the associated object is drillable.
 * @param {boolean} drillable
 */
DvtTreePeer.prototype.setDrillable = function(drillable) {
  this._bDrillable = drillable;
};


/**
 * Handles a mouse over event on the associated object.
 */
DvtTreePeer.prototype.handleMouseOver = function() {
  // Expand/Collapse: hide button if displayed
  if (this._node && this._node.handleMouseOver) {
    this._node.handleMouseOver();
  }
};


/**
 * Handles a mouse out event on the associated object.
 */
DvtTreePeer.prototype.handleMouseOut = function() {
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

dvt.Obj.createSubclass(DvtTreeBreadcrumbsRenderer, dvt.Obj);

DvtTreeBreadcrumbsRenderer._COMPONENT_GAP = 6;
DvtTreeBreadcrumbsRenderer._ENABLED_INLINE_STYLE = 'color: #003286;';


/**
 * Performs layout and rendering for the breadcrumbs in the given space.  Updates the available
 * space and returns the rendered displayable.
 * @param {DvtTreeView} treeView The owning component.
 * @param {dvt.Rectangle} availSpace The rectangle within which to layout.
 * @param {array} ancestors
 * @param {string} rootLabel The label for the root node.
 * @return {dvt.Displayable} The rendered legend contents.
 */
DvtTreeBreadcrumbsRenderer.render = function(treeView, availSpace, ancestors, rootLabel) {
  var context = treeView.getCtx();
  var styleDefaults = treeView.getOptions()['styleDefaults'];

  // Figure out the label styles
  var enabledStyleArray = new Array();
  enabledStyleArray.push(new dvt.CSSStyle(DvtTreeBreadcrumbsRenderer._ENABLED_INLINE_STYLE));
  enabledStyleArray.push(styleDefaults['_drillTextStyle']);
  var enabledStyle = dvt.CSSStyle.mergeStyles(enabledStyleArray).toString();
  var enabledStyleOver = enabledStyle + 'text-decoration: underline;';

  var disabledStyleArray = new Array();
  disabledStyleArray.push(styleDefaults['_currentTextStyle']);
  var disabledStyle = dvt.CSSStyle.mergeStyles(disabledStyleArray).toString();

  // Create the breadcrumbs component and temporarily add to the component
  var options = {labelStyle: enabledStyle, labelStyleOver: enabledStyleOver, labelStyleDown: enabledStyleOver, disabledLabelStyle: disabledStyle};
  var breadcrumbs = new dvt.Breadcrumbs(context, treeView.__processBreadcrumbsEvent, treeView, options);
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

dvt.Obj.createSubclass(DvtTreeLegendRenderer, dvt.Obj);

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
 * @param {DvtTreeView} treeView The owning component.
 * @param {dvt.Rectangle} availSpace The rectangle within which to layout.
 * @param {dvt.AttrGroups} attrGroups An attribute groups describing the colors.
 * @return {dvt.Displayable} The rendered legend contents.
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
  var legend = new dvt.Container(context);
  treeView.addChild(legend);

  // Size/Color Labels
  var labelContainer = DvtTreeLegendRenderer._renderLabels(context, treeView, legend, availSpace.w, sizeValueStr, colorValueStr, attrGroups);

  var borderColor = dvt.CSSStyle.afterSkinAlta(treeView.getOptions()['skin']) ? null : '#000000';
  var legendStyleArray = new Array();
  legendStyleArray.push(options['styleDefaults']['_labelStyle']);
  var legendStyles = {borderColor: borderColor, labelStyle: dvt.CSSStyle.mergeStyles(legendStyleArray)};

  // Color Section
  var colorContainer = dvt.LegendAttrGroupsRenderer.renderAttrGroups(context, eventManager, legend, availSpace.w, availSpace.h, attrGroups, legendStyles);

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
        colorContainer = dvt.LegendAttrGroupsRenderer.renderAttrGroups(context, eventManager, legend, availWidth / 2, availSpace.h, attrGroups, legendStyles);
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
        colorContainer = dvt.LegendAttrGroupsRenderer.renderAttrGroups(context, eventManager, legend, colorSpace, availSpace.h, attrGroups, legendStyles);
      }

      // Size changed so recalc dimensions
      labelDims = labelContainer.getDimensions();
      colorDims = colorContainer.getDimensions();
    }

    // Position
    if (dvt.Agent.isRightToLeft(context)) {
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
 * @param {dvt.Context} context
 * @param {DvtTreeView} treeView The owning component.
 * @param {dvt.Container} legend The legend container.
 * @param {number} availWidth The available horizontal space.
 * @param {string} sizeValueStr A description of the size metric.
 * @param {string} colorValueStr A description of the color metric.
 * @param {dvt.AttrGroups} attrGroups An attribute groups describing the colors.
 * @return {dvt.Displayable} The rendered contents.
 */
DvtTreeLegendRenderer._renderLabels = function(context, treeView, legend, availWidth, sizeValueStr, colorValueStr, attrGroups) {
  var isRTL = dvt.Agent.isRightToLeft(context);
  var eventManager = treeView.getEventManager();
  var styleDefaults = treeView.getOptions()['styleDefaults'];

  var labelContainer = null;
  if (sizeValueStr || colorValueStr) {
    // Create a container for the labels
    labelContainer = new dvt.Container(context);
    legend.addChild(labelContainer);

    var textStyle = new Array();
    textStyle.push(styleDefaults['_attributeTypeTextStyle']);
    var attrTypeStyle = dvt.CSSStyle.mergeStyles(textStyle);

    textStyle = new Array();
    textStyle.push(styleDefaults['_attributeValueTextStyle']);
    var attrValueStyle = dvt.CSSStyle.mergeStyles(textStyle);

    // Size: Size Metric
    var sizeLabel;
    var sizeValueLabel;
    var sizeLabelWidth;
    var sizeValueLabelWidth;
    var sizeWidth = 0;
    if (sizeValueStr) {
      // Size Label
      var sizeStr = dvt.Bundle.getTranslation(treeView.getOptions(), 'labelSize', treeView.getBundlePrefix(), 'SIZE');
      sizeLabel = new dvt.OutputText(context, sizeStr, 0, 0);
      sizeLabel.setCSSStyle(attrTypeStyle);

      labelContainer.addChild(sizeLabel);
      sizeLabelWidth = sizeLabel.measureDimensions().w;

      // Size Value Label
      sizeValueLabel = new dvt.OutputText(context, sizeValueStr, 0, 0);
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
      var colorStr = dvt.Bundle.getTranslation(treeView.getOptions(), 'labelColor', treeView.getBundlePrefix(), 'COLOR');
      colorLabel = new dvt.OutputText(context, colorStr, 0, 0);
      colorLabel.setCSSStyle(attrTypeStyle);

      labelContainer.addChild(colorLabel);
      colorLabelWidth = colorLabel.measureDimensions().w;

      // Color Value Label
      colorValueLabel = new dvt.OutputText(context, colorValueStr, 0, 0);
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
        if (dvt.TextUtils.fitText(sizeValueLabel, sizeValueSpace, Infinity, labelContainer)) {
          sizeValueLabelWidth = sizeValueLabel.measureDimensions().w;
          eventManager.associate(sizeValueLabel, new dvt.SimpleObjPeer(sizeValueStr));
        }
        else {
          labelContainer.removeChild(sizeLabel);
          labelContainer.removeChild(sizeValueLabel);
          sizeValueLabel = null;
          sizeValueLabelWidth = 0;
        }

        var colorValueSpace = widthPerSection - colorLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP;
        if (dvt.TextUtils.fitText(colorValueLabel, colorValueSpace, Infinity, labelContainer)) {
          colorValueLabelWidth = colorValueLabel.measureDimensions().w;
          eventManager.associate(colorValueLabel, new dvt.SimpleObjPeer(colorValueStr));
        }
        else {
          labelContainer.removeChild(colorLabel);
          labelContainer.removeChild(colorValueLabel);
          colorValueLabel = null;
          colorValueLabelWidth = 0;
        }
      }
      else if (sizeWidth > colorWidth) { // Reduce the size label size
        if (dvt.TextUtils.fitText(sizeValueLabel, availWidth - colorWidth - sizeLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP, Infinity, labelContainer)) {
          sizeValueLabelWidth = sizeValueLabel.measureDimensions().w;
          eventManager.associate(sizeValueLabel, new dvt.SimpleObjPeer(sizeValueStr));
        }
        else {
          labelContainer.removeChild(sizeLabel);
          labelContainer.removeChild(sizeValueLabel);
          sizeValueLabel = null;
          sizeValueLabelWidth = 0;
        }
      }
      else { // Reduce the color label size
        if (dvt.TextUtils.fitText(colorValueLabel, availWidth - sizeWidth - colorLabelWidth - DvtTreeLegendRenderer._LEGEND_LABEL_GAP, Infinity, labelContainer)) {
          colorValueLabelWidth = colorValueLabel.measureDimensions().w;
          eventManager.associate(colorValueLabel, new dvt.SimpleObjPeer(colorValueStr));
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
/*  DvtTreeKeyboardHandler     Keyboard handler for Sunburst                   */
/*---------------------------------------------------------------------------------*/
/**
  *  @param {dvt.EventManager} manager The owning dvt.EventManager
  *  @class DvtTreeKeyboardHandler
  *  @extends {dvt.KeyboardHandler}
  *  @constructor
  */
var DvtTreeKeyboardHandler = function(manager)
{
  this.Init(manager);
};

dvt.Obj.createSubclass(DvtTreeKeyboardHandler, dvt.KeyboardHandler);


/**
 * @override
 */
DvtTreeKeyboardHandler.prototype.isSelectionEvent = function(event)
{
  return this.isNavigationEvent(event) && !event.ctrlKey;
};


/**
 * @override
 */
DvtTreeKeyboardHandler.prototype.isMultiSelectEvent = function(event)
{
  return event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey;
};
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {dvt.BaseComponentDefaults}
 */
var DvtTreeDefaults = function() {};

dvt.Obj.createSubclass(DvtTreeDefaults, dvt.BaseComponentDefaults);


/**
 * Defaults for version 1. This component was exposed after the Alta skin, so no earlier defaults are provided.
 */
DvtTreeDefaults.VERSION_1 = {
  'skin': dvt.CSSStyle.SKIN_ALTA,

  // Note, only attributes that are different than the XML defaults need
  // to be listed here, at least until the XML API is replaced.
  'animationDuration': 500,
  'animationOnDataChange': 'none',
  'animationOnDisplay': 'none',
  'highlightMatch' : 'all',
  'hoverBehavior': 'none', 'hoverBehaviorDelay': 200,
  'nodeDefaults': {
    'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_11)
  },
  'selectionMode': 'multiple',
  'sorting': 'off',
  '_statusMessageStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA),
  'styleDefaults': {
    '_attributeTypeTextStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_12 + 'color:#4F4F4F'),
    '_attributeValueTextStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12),
    '_currentTextStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12),
    '_drillTextStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12),
    '_labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA)
  },
  'touchResponse' : 'auto',

  '_resources': {}
};


/**
 * @override
 */
DvtTreeDefaults.prototype.Init = function(defaultsMap) {
  // This will only be called via subclasses.  Combine with defaults from this class before passing to super.
  var ret = {
    'skyros': dvt.JsonUtils.merge(defaultsMap['skyros'], DvtTreeDefaults.VERSION_1),
    'alta': dvt.JsonUtils.merge(defaultsMap['alta'], {})
  };

  DvtTreeDefaults.superclass.Init.call(this, ret);
};
/**
 * Utility functions for DvtTreeView.
 * @class
 */
var DvtTreeUtils = {};

dvt.Obj.createSubclass(DvtTreeUtils, dvt.Obj);

/**
 * Returns the maximum depth of the tree rooted at the specified node.
 * @param {DvtTreeNode} node The subtree to find the depth for.
 * @param {number} depth The depth of the specified node.
 * @return {number} The maximum depth of the tree.
 */
DvtTreeUtils.calcMaxDepth = function(node, depth) {
  var maxDepth = depth;
  var children = node.getChildNodes();
  if (children) {
    for (var i = 0; i < children.length; i++) {
      var childDepth = DvtTreeUtils.calcMaxDepth(children[i], depth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }
  }
  return maxDepth;
};

/**
 * Returns the node count of the tree rooted at the specified node.
 * @param {DvtTreeNode} node The subtree to find the depth for.
 * @return {number}
 */
DvtTreeUtils.calcNodeCount = function(node) {
  var count = 1;
  var children = node.getChildNodes();
  if (children) {
    for (var i = 0; i < children.length; i++) {
      count += DvtTreeUtils.calcNodeCount(children[i]);
    }
  }
  return count;
};

/**
 * Returns an array containing all the nodes in the subtree rooted at the specified node.
 * @param {DvtTreeNode} node
 * @return {array}
 */
DvtTreeUtils.getAllNodes = function(node) {
  var ret = [];
  DvtTreeUtils._addNodesToArray(node, ret);
  return ret;
};

/**
 * Returns an array containing all the visible nodes in the subtree rooted at the specified node.
 * @param {DvtTreeNode} node
 * @return {array}
 */
DvtTreeUtils.getAllVisibleNodes = function(node) {
  var ret = [];
  DvtTreeUtils._addNodesToArray(node, ret, false, true);
  return ret;
};

/**
 * Returns an array containing all the leaf nodes in the subtree rooted at the specified node.
 * @param {DvtTreeNode} node
 * @return {array}
 */
DvtTreeUtils.getLeafNodes = function(node) {
  var ret = [];
  DvtTreeUtils._addNodesToArray(node, ret, true);
  return ret;
};

/**
 * Returns true if the node with the specified options would be hidden.
 * @param {object} categoryMap The boolean map of hidden categories.
 * @param {object} nodeOptions The options for the node to process.
 * @return {boolean}
 */
DvtTreeUtils.isHiddenNode = function(categoryMap, nodeOptions) {
  return dvt.ArrayUtils.hasAnyMapItem(categoryMap, nodeOptions['categories']);
};

/**
 * If not specified, calculates and updates the attribute groups min and max values.
 * @param {object} attrGroupOptions
 * @param {array} nodes
 */
DvtTreeUtils.calcContinuousAttrGroupsExtents = function(attrGroupOptions, nodes) {
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
DvtTreeUtils.processContinuousAttrGroups = function(attrGroupsList, nodes) {
  for (var i = 0; i < attrGroupsList.length; i++) {
    var attrGroupsMap = attrGroupsList[i];
    var attrGroups = attrGroupsMap.attrGroups;
    var stampId = attrGroupsMap.stampId;
    if (attrGroups instanceof dvt.ContinuousAttrGroups && stampId != null) {
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
 * @param {DvtTreeNode} node The root of the subtree whose children will be returned.
 * @param {array} ret The array onto which to add the subtree.
 * @param {boolean=} bLeafOnly Optional flag to specify whether only leaf nodes should be included.
 * @param {boolean=} bRendered Optional flag to specify whether only rendered nodes should be included.
 * @private
 */
DvtTreeUtils._addNodesToArray = function(node, ret, bLeafOnly, bRendered) {
  if (!node)
    return;

  var children = node.getChildNodes();
  var childCount = children ? children.length : 0;

  // Add this node
  if ((!bLeafOnly || childCount == 0) && !(bRendered && !node.getDisplayable()))
    ret.push(node);

  // Add its children
  for (var i = 0; i < childCount; i++) {
    DvtTreeUtils._addNodesToArray(children[i], ret, bLeafOnly, bRendered);
  }
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.

/**
  *  Provides automation services for treemap/sunburst.  To obtain a
  *  @class  DvtTreeAutomation
  *  @param {DvtTreeView} treeView
  *  @implements {dvt.Automation}
  *  @constructor
  */
var DvtTreeAutomation = function(treeView)
{
  this._treeView = treeView;
  this._root = treeView.getRootNode();
};

dvt.Obj.createSubclass(DvtTreeAutomation, dvt.Automation);

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
    if (displayable.getParent() instanceof dvt.Button) {
      displayable = displayable.getParent();
    }
    var parent = displayable.getParent();
    if (parent instanceof dvt.Breadcrumbs)
      return DvtTreeAutomation.BREADCRUMBS_PREFIX + '[' + parent.getCrumbIndex(displayable) + ']';
    return null;
  }

  if (logicalObj instanceof DvtTreeNode)
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
 */
DvtTreeAutomation.prototype.getDomElementForSubId = function(subId) {
  if (!subId)
    return null;

  // tooltip
  if (subId == dvt.Automation.TOOLTIP_SUBID)
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
 * @return {DvtTreeNode}
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
/**
 * @constructor
 * Treemap component.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @class Treemap component.
 * @extends {DvtTreeView}
 */
dvt.Treemap = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

// Make dvt.Treemap a subclass of DvtTreeView
dvt.Obj.createSubclass(dvt.Treemap, DvtTreeView);

/** @const @private **/
dvt.Treemap._BUFFER_SPACE = 7; // This is in addition to gap between groups

/** @const @private **/
dvt.Treemap._MIN_BUFFER_SPACE = 1; // Minimum buffer for very small treemaps

/** @const @private **/
dvt.Treemap._BACKGROUND_FILL_COLOR = '#EBEFF5';

/** @const @private **/
dvt.Treemap._BACKGROUND_BORDER_COLOR = '#DBE0EA';

/** @const @private **/
dvt.Treemap._BACKGROUND_INLINE_DEFAULT = 'background-color:' + dvt.Treemap._BACKGROUND_FILL_COLOR + ';' +
    'border-color:' + dvt.Treemap._BACKGROUND_BORDER_COLOR + ';' +
    'border-width:2px';

/**
 * Returns a new instance of dvt.Treemap.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {dvt.Treemap}
 */
dvt.Treemap.newInstance = function(context, callback, callbackObj) {
  return new dvt.Treemap(context, callback, callbackObj);
};

/**
 * @override
 */
dvt.Treemap.prototype.Init = function(context, callback, callbackObj) {
  dvt.Treemap.superclass.Init.call(this, context, callback, callbackObj);

  // Create the defaults object
  this.Defaults = new DvtTreemapDefaults();

  // Make sure the object has an id for accessibility 
  this.setId('treemap' + 1000 + Math.floor(Math.random() * 1000000000));//@RandomNumberOk
};

/**
 * @override
 */
dvt.Treemap.prototype.ApplyParsedProperties = function(props) {
  dvt.Treemap.superclass.ApplyParsedProperties.call(this, props);

  var options = this.getOptions();

  // Layout
  if (options['layout'] == 'sliceAndDiceHorizontal')
    this._layout = new DvtTreemapLayoutSliceAndDice(true);
  else if (options['layout'] == 'sliceAndDiceVertical')
    this._layout = new DvtTreemapLayoutSliceAndDice(false);
  else
    this._layout = new DvtTreemapLayoutSquarifying();

  // Isolate Support
  this._isolatedNodes = [];
  this._processInitialIsolate(options['isolatedNode']);

  // animationOnDisplay: auto defaults to fan
  if (options['animationOnDisplay'] == 'auto')
    options['animationOnDisplay'] = 'alphaFade';
};

/**
 * @override
 */
dvt.Treemap.prototype.Layout = function(availSpace) {
  var options = this.getOptions();

  // Allocate buffer space for the container. The minimum buffer is used for JET, where no default border is shown.
  var bufferSpace = options['_environment'] != 'jet' ? dvt.Treemap._BUFFER_SPACE : dvt.Treemap._MIN_BUFFER_SPACE;
  bufferSpace = Math.max(Math.ceil(bufferSpace * Math.min(availSpace.w, availSpace.h) / 400), dvt.Treemap._MIN_BUFFER_SPACE);
  availSpace.x += bufferSpace;
  availSpace.y += bufferSpace;
  availSpace.w -= 2 * bufferSpace;
  availSpace.h -= 2 * bufferSpace;

  // Legend and Breadcrumbs
  // Add the additional buffer space for nodes to make the legend line up.
  var gap = this._layout.getGapSize(this, 1);
  availSpace.x += gap;
  availSpace.w -= 2 * gap;
  this.LayoutBreadcrumbs(availSpace);
  this.LayoutLegend(availSpace);
  // Restore the gap for use by the nodes
  availSpace.x -= gap;
  availSpace.w += 2 * gap;

  // Layout Algorithm: For a layout in response to isolate or restore, only re-layout the newly visible isolated node.
  // Otherwise, layout the root, and then each isolated child in order.
  var numIsolated = this._isolatedNodes.length;
  if (numIsolated > 0 && this._isolateRestoreLayout) {
    // Isolate or Restore Action: Don't layout unchanged, since it would affect animation
    var lastIsolated = this._isolatedNodes[numIsolated - 1];
    this._layout.layout(this, lastIsolated, availSpace.x, availSpace.y, availSpace.w, availSpace.h, true);
  }
  else {
    // Standard Layout: Layer the isolated nodes so that they can be peeled back like a stack.
    if (this._root)
      this._layout.layout(this, this._root, availSpace.x, availSpace.y, availSpace.w, availSpace.h, false);

    for (var i = 0; i < numIsolated; i++) {
      var layoutRoot = this._isolatedNodes[i];
      this._layout.layout(this, layoutRoot, availSpace.x, availSpace.y, availSpace.w, availSpace.h, true);
    }
  }
};

/**
 * @override
 */
dvt.Treemap.prototype.Render = function(container, bounds) {
  // Background
  this.RenderBackground(container, dvt.Treemap._BACKGROUND_INLINE_DEFAULT);

  // Breadcrumbs
  this.RenderBreadcrumbs(container);

  // Legend
  this.RenderLegend(container);

  // Node or Empty Text
  if (this.HasValidData()) {
    // Layer for group text displayed on node.  Will be reordered after the selected layer
    this._groupTextLayer = new dvt.Container(this.getCtx());
    container.addChild(this._groupTextLayer);

    // Render the nodes.  The root node is not rendered unless it's a singleton
    // This creates the shape objects, but does not render them yet.
    if (this._isolatedNode)
      this._isolatedNode.render(container);
    else if (!this._root.hasChildren())
      this._root.render(container);
    else {
      this._root.renderChildren(container);
      this.UpdateAriaNavigation(this._root);
    }

    // Create a group for isolated nodes
    this._isolatedLayer = new dvt.Container(this.getCtx());
    container.addChild(this._isolatedLayer);

    // Create a group for selected nodes
    this._selectedLayer = new dvt.Container(this.getCtx());
    container.addChild(this._selectedLayer);

    // Reorder group text after selected layer
    container.addChild(this._groupTextLayer);

    // Prepare the hover effect
    this._hoverEffect = new dvt.Polyline(this.getCtx(), new Array());
    this._hoverEffect.setVisible(false);
    this._hoverEffect.setMouseEnabled(false);
    this._hoverEffect.setPixelHinting(true);
    container.addChild(this._hoverEffect);

    // Fix the z-order of the isolated objects
    for (var i = 0; i < this._isolatedNodes.length; i++) {
      var displayable = this._isolatedNodes[i].getDisplayable();
      this._isolatedLayer.addChild(displayable);
    }
  }
  else {
    // Display the empty text message
    this.RenderEmptyText(container);
  }
};

/**
 * Hook for cleaning up animation behavior at the end of the animation.
 * @override
 */
dvt.Treemap.prototype.OnAnimationEnd = function() {
  // Before the animation, the treemap nodes will remove their bevels and selection
  // effects.  If the animation is complete (and not stopped), then rerender to restore.
  if (!this.AnimationStopped) {
    this._container.removeChildren();

    // Finally, re-layout and render the component
    var availSpace = new dvt.Rectangle(0, 0, this.Width, this.Height);
    this.Layout(availSpace);
    this.Render(this._container);

    // Reselect the nodes using the selection handler's state
    this.ReselectNodes();
  }

  // Delegate to the superclass to clear common things
  dvt.Treemap.superclass.OnAnimationEnd.call(this);
};

/**
 * Reselects the selected nodes after a re-render.
 * @protected
 */
dvt.Treemap.prototype.ReselectNodes = function() {
  var selectedNodes = this._selectionHandler ? this._selectionHandler.getSelection() : new Array();
  for (var i = 0; i < selectedNodes.length; i++) {
    // Don't show selection effect for obscured nodes when isolate is being used
    if (this._isolatedNodes.length > 0) {
      var lastIsolated = this._isolatedNodes[this._isolatedNodes.length - 1];
      if (selectedNodes[i] == lastIsolated || selectedNodes[i].isDescendantOf(lastIsolated))
        selectedNodes[i].setSelected(true);
    }
    else
      selectedNodes[i].setSelected(true);
  }
};

/**
 * @override
 */
dvt.Treemap.prototype.CreateKeyboardHandler = function(manager)
{
  return new DvtTreemapKeyboardHandler(manager);
};

/**
 * @override
 */
dvt.Treemap.prototype.CreateEventManager = function(view, context, callback, callbackObj)
{
  return new DvtTreemapEventManager(view, context, callback, callbackObj);
};

/**
 * @override
 */
dvt.Treemap.prototype.GetInitialFocusedItem = function(root)
{
  var isolatedRootNode = this.__getLastIsolatedNode();

  if (isolatedRootNode)
    return this.__getDefaultNavigable(DvtTreeUtils.getLeafNodes(isolatedRootNode));
  else if (root)
    return this.__getDefaultNavigable(DvtTreeUtils.getLeafNodes(root));
  else
    return null;
};

/**
 * Updates the hover effect to display the specified stroke along the specified points.
 * @param {array} points The array of points defining the polyline.
 * @param {dvt.Stroke} stroke The stroke definition.
 * @param {DvtTreemapNode} node The treemap node that this hover effect will belong to.
 */
dvt.Treemap.prototype.__showHoverEffect = function(points, stroke, node) {
  this._hoverEffect.setPoints(points);
  this._hoverEffect.setStroke(stroke);
  this._hoverEffect.setVisible(true);
};

/**
 * Hides the hover effect.
 */
dvt.Treemap.prototype.__hideHoverEffect = function() {
  this._hoverEffect.setVisible(false);
};

/**
 * Returns the layer for rendering group text displayed on nodes.  This layer is above the selected
 * layer, so that selected nodes will node obscure it.
 * @return {dvt.Container}
 */
dvt.Treemap.prototype.__getGroupTextLayer = function() {
  return this._groupTextLayer;
};

/**
 * Moves the specified object to the selected layer, above the non-selected objects.
 * @param {dvt.Rect} rect The object to be moved.
 */
dvt.Treemap.prototype.__moveToSelectedLayer = function(rect) {
  // Loop through the selected layer to find the right position
  var newIndex = 0;
  var numChildren = this._selectedLayer.getNumChildren();
  for (var i = 0; i < numChildren; i++) {
    var child = this._selectedLayer.getChildAt(i);
    if (rect.zIndex > child.zIndex)
      newIndex = i + 1;
  }

  // Add the object
  if (newIndex < numChildren)
    this._selectedLayer.addChildAt(rect, newIndex);
  else
    this._selectedLayer.addChild(rect);
};

/**
 * @override
 */
dvt.Treemap.prototype.__getNodeUnderPoint = function(x, y) {
  // For isolated nodes, search from the last isolated node
  if (this._isolatedNodes.length > 0) {
    var lastIsolated = this._isolatedNodes[this._isolatedNodes.length - 1];
    return lastIsolated.getNodeUnderPoint(x, y);
  }
  else
    return this._root.getNodeUnderPoint(x, y);
};

/**
 * Isolates the specified node.
 * @param {DvtTreeNode} node The node to isolate.
 */
dvt.Treemap.prototype.__isolate = function(node) {
  var currentNavigable = this.getEventManager().getFocus();
  if (currentNavigable)
    currentNavigable.hideKeyboardFocusEffect();

  // Keep track of the isolated node
  this._isolatedNodes.push(node);
  this.getOptions()['isolatedNode'] = node.getId();

  // Update state
  this.dispatchEvent(dvt.EventFactory.newTreemapIsolateEvent(node.getId()));

  // Layout the isolated node and its children
  this._isolateRestoreLayout = true;
  this.Layout(new dvt.Rectangle(0, 0, this.Width, this.Height));
  this._isolateRestoreLayout = false;

  // Update z-order
  var displayable = node.getDisplayable();
  this._isolatedLayer.addChild(displayable);

  // Render the changes
  this._renderIsolateRestore(node);
};

/**
 * Restores the full tree from the isolated state.
 */
dvt.Treemap.prototype.__restore = function() {
  var restoreNode = this._isolatedNodes.pop();

  // Update the options state
  this.getOptions()['isolatedNode'] = (this._isolatedNodes.length > 0) ? this._isolatedNodes[this._isolatedNodes.length - 1].getId() : null;

  var currentNavigable = this.getEventManager().getFocus();
  if (currentNavigable)
    currentNavigable.hideKeyboardFocusEffect();

  // after we restore the full tree, set keyboard focus on the node that was previously isolated
  this.__setNavigableIdToFocus(restoreNode.getId());

  // Update state
  this.dispatchEvent(dvt.EventFactory.newTreemapIsolateEvent());

  // Layout the isolated node and its children
  this._isolateRestoreLayout = true;
  this.Layout(new dvt.Rectangle(0, 0, this.Width, this.Height));
  this._isolateRestoreLayout = false;

  // Render the changes
  this._renderIsolateRestore(restoreNode);
};

/**
 * Returns the currently isolated node, or null if no node is isolated
 *
 * @return {DvtTreemapNode}
 */
dvt.Treemap.prototype.__getLastIsolatedNode = function()
{
  if (this._isolatedNodes && this._isolatedNodes.length > 0)
    return this._isolatedNodes[this._isolatedNodes.length - 1];
  else
    return null;
};

/**
 * The node that was isolated or restored.
 * @param {DvtTreemapNode} node
 * @private
 */
dvt.Treemap.prototype._renderIsolateRestore = function(node) {
  // Animate or re-render to display the updated state
  if (this.getOptions()['animationOnDataChange'] != 'none') {
    // Deselect all nodes so that the selected layer doesn't display above the
    // isolated node during animation.  Nodes will be reselected at the end of animation.
    var selectedNodes = this._selectionHandler ? this._selectionHandler.getSelection() : new Array();
    for (var i = 0; i < selectedNodes.length; i++) {
      selectedNodes[i].setSelected(false);
    }

    // Animate the isolated node
    var playables = node.getIsolateAnimation();
    this.Animation = new dvt.ParallelPlayable(this.getCtx(), playables);
    this.Animation.setOnEnd(this.OnAnimationEnd, this);

    // Disable event listeners temporarily
    this._eventHandler.removeListeners(this);

    // Start the animation
    this.Animation.play();
  }
  else {
    // : the true prevents the options object from being evaluated, so that the isolated node will not
    // be cleared.  This is necessary until we remove the xml layer, after which we can remove the true param.
    this.render(null, this.Width, this.Height, true);
  }
};

/**
 * Processes the initially isolated node, if any.
 * @param {string} isolateRowKey The initially isolated node, if any.
 * @private
 */
dvt.Treemap.prototype._processInitialIsolate = function(isolateRowKey) {
  if (isolateRowKey && this._root) {
    var allNodes = this._root.getDescendantNodes();
    allNodes.push(this._root);

    // Look through all the nodes for the isolated node
    for (var i = 0; i < allNodes.length; i++) {
      if (allNodes[i].getId() == isolateRowKey) {
        this._isolatedNodes.push(allNodes[i]);
        return;
      }
    }
  }
};

/**
 * Returns the default navigable item to receive keyboard focus.
 * @param {Array} navigableItems An array of DvtNavigableItems that could receive keyboard focus
 * @return {DvtKeyboardNavigable}
 */
dvt.Treemap.prototype.__getDefaultNavigable = function(navigableItems)
{
  var keyboardHandler = this._eventHandler.getKeyboardHandler();
  if (keyboardHandler)
    return keyboardHandler.getDefaultNavigable(navigableItems);
  else if (navigableItems && navigableItems.length > 0)
    return navigableItems[0];
  else
    return null;
};

/**
 * Returns the displayables to pass to the view switcher for animation.
 * @param {boolean} bOld True if this is the outgoing view.
 * @return {array} The array of displayables.
 */
dvt.Treemap.prototype.getShapesForViewSwitcher = function(bOld) {
  var shapes = {};
  if (this._root) {
    var arNodes = [this._root];
    while (arNodes.length > 0) {
      var node = arNodes.splice(0, 1)[0];
      var id = node.getId();
      var shape = node.getDisplayable();
      if (id && shape) {
        shapes[id] = shape;
        shapes[id + '_text'] = node._text;

        // TODO private access is not allowed, so we'll need to fix this before productizing.
        if (node._topLeftShape) {
          shape.removeChild(node._topLeftShape);
        }
        if (node._fillShape) {
          shape.removeChild(node._fillShape);
        }

        // TODO setting the fill to deal with the issue where the animation shapes currently use the background shape
        shape.setFill(node.GetFill());

        //flatten hierarchical structure of nodes so that they animate independently
        if (bOld) {
          var parentNode = node.GetParent();
          if (parentNode) {
            var parentShape = parentNode.getDisplayable();
            var parent = null;
            if (parentShape) {
              parent = parentShape.getParent();
            }
            else {
              parent = this._container;
            }
            if (parent) {
              //this will insert children in reverse z-order, but still after the parent node
              var childIndex = parent.getChildIndex(parentShape);
              if (node._border) {
                parent.addChildAt(node._border, childIndex + 1);
              }
              if (node._borderBR) {
                parent.addChildAt(node._borderBR, childIndex + 1);
              }
              if (node._borderTL) {
                parent.addChildAt(node._borderTL, childIndex + 1);
              }
              if (node._text) {
                parent.addChildAt(node._text, childIndex + 1);
              }
              parent.addChildAt(shape, childIndex + 1);
            }
          }
        }
      }

      var children = node.getChildNodes();
      if (children) {
        arNodes = arNodes.concat(children);
      }
    }
  }
  return shapes;
};

/**
 * @override
 */
dvt.Treemap.prototype.GetComponentDescription = function() {
  return dvt.Bundle.getTranslation(this.getOptions(), 'componentName', dvt.Bundle.UTIL_PREFIX, 'TREEMAP');
};

/**
 * @override
 */
dvt.Treemap.prototype.getBundlePrefix = function() {
  return dvt.Bundle.TREEMAP_PREFIX;
};

/**
 * @override
 */
dvt.Treemap.prototype.CreateNode = function(nodeOptions) {
  return new DvtTreemapNode(this, nodeOptions);
};
/**
 * Class representing a treemap node.
 * @param {dvt.Treemap} treemap The owning treemap component.
 * @param {object} props The properties for the node.
 * @class
 * @constructor
 * @extends {DvtTreeNode}
 * @implements {DvtKeyboardNavigable}
 */
var DvtTreemapNode = function(treemap, props) {
  this.Init(treemap, props);

  var options = this._view.getOptions();
  var nodeDefaults = options['nodeDefaults'];
  var headerDefaults = nodeDefaults['header'];
  var headerOptions = props['header'] ? props['header'] : {
  };

  this._groupLabelDisplay = props['groupLabelDisplay'] ? props['groupLabelDisplay'] : nodeDefaults['groupLabelDisplay'];
  this._labelDisplay = props['labelDisplay'] ? props['labelDisplay'] : nodeDefaults['labelDisplay'];
  this._labelHalign = props['labelHalign'] ? props['labelHalign'] : nodeDefaults['labelHalign'];
  this._labelValign = props['labelValign'] ? props['labelValign'] : nodeDefaults['labelValign'];

  this._headerHalign = headerOptions['labelHalign'] ? headerOptions['labelHalign'] : headerDefaults['labelHalign'];
  this._headerLabelStyle = headerOptions['labelStyle'] ? new dvt.CSSStyle(headerOptions['labelStyle']) : null;
  this._bHeaderUseNodeColor = (headerOptions['useNodeColor'] ? headerOptions['useNodeColor'] : headerDefaults['useNodeColor']) == 'on';

  // Isolate Support
  this._isolate = headerOptions['isolate'] ? headerOptions['isolate'] : headerDefaults['isolate'];
  if (this._isolate == 'auto')
    this._isolate = dvt.Agent.isTouchDevice() ? 'off' : 'on';

  // TODO  Switch to determining dynamically, which involves changing how isolate/restore is handled
  this._bIsolated = (options['isolatedNode'] != null && options['isolatedNode'] == this.getId());
};

// Make DvtTreemapNode a subclass of DvtTreeNode
dvt.Obj.createSubclass(DvtTreemapNode, DvtTreeNode);

// Text style options
DvtTreemapNode.TEXT_STYLE_HEADER = 'header';
DvtTreemapNode.TEXT_STYLE_NODE = 'node';
DvtTreemapNode.TEXT_STYLE_OFF = 'off';

// Constants for All Nodes
DvtTreemapNode.TEXT_BUFFER_HORIZ = 4;// Buffer for text alignment
DvtTreemapNode.TEXT_BUFFER_VERT = 2;// Buffer for text alignment
DvtTreemapNode.MIN_TEXT_BUFFER = 2;// Minimum buffer for text (on opposite side of alignment for example)
DvtTreemapNode._LINE_FUDGE_FACTOR = 1;

DvtTreemapNode._ANIMATION_ISOLATE_DURATION = 0.3;// in seconds
// Constants for Group Headers
DvtTreemapNode._MIN_TITLE_BAR_HEIGHT = 15;
DvtTreemapNode._MIN_TITLE_BAR_HEIGHT_ISOLATE = 15;
DvtTreemapNode.DEFAULT_HEADER_BORDER_WIDTH = 1;
DvtTreemapNode.DEFAULT_HEADER_WITH_NODE_COLOR_ALPHA = 0.5;
DvtTreemapNode._ISOLATE_ICON_SIZE = 12;
DvtTreemapNode._ISOLATE_GAP_SIZE = 1;
DvtTreemapNode._ISOLATE_TOUCH_BUFFER = 2;

// Constants for Leaf Nodes
DvtTreemapNode.DEFAULT_NODE_TOP_BORDER_COLOR = '#FFFFFF';
DvtTreemapNode.DEFAULT_NODE_BOTTOM_BORDER_COLOR = '#000000';
DvtTreemapNode.DEFAULT_NODE_BORDER_WIDTH = 1;
DvtTreemapNode.DEFAULT_NODE_BORDER_OPACITY = 0.3;
DvtTreemapNode.DEFAULT_NODE_PATTERN_BORDER_OPACITY = 0.15;

DvtTreemapNode.MIN_SIZE_FOR_BORDER = 2 * DvtTreemapNode.DEFAULT_NODE_BORDER_WIDTH;

// Constants for Selection Effects
DvtTreemapNode.GROUP_HOVER_INNER_OPACITY = 0.8;
DvtTreemapNode.GROUP_HOVER_INNER_WIDTH = 3;

DvtTreemapNode.NODE_HOVER_OPACITY = 1.0;
DvtTreemapNode.NODE_SELECTION_WIDTH = 2;

//**************** Begin Overridden Functions ***************//
/**
 * @override
 */
DvtTreemapNode.prototype.render = function(container) {
  // If not positioned, don't render
  if (!this._hasLayout)
    return;

  // Create the shape object
  this._shape = this._createShapeNode();
  container.addChild(this._shape);

  var template;

  if (this.hasChildren()) {
    // Create the container for the children and render
    this._childNodeGroup = new dvt.Container(this.getView().getCtx());
    this._shape.addChild(this._childNodeGroup);
    this.renderChildren(this._childNodeGroup);
  }
  else {
    template = this.GetTemplate();
  }

  // if content facet exists, added the content to treeNode
  if (template) {
    var elAttrs = this.GetElAttributes();
    var afContext = this.GetAfContext();
    afContext.setELContext(elAttrs);

    //TODO fudge factor and tree node border?
    var bw = DvtTreemapNode.DEFAULT_NODE_BORDER_WIDTH + DvtTreemapNode._LINE_FUDGE_FACTOR;
    var marginx = DvtTreemapNode.TEXT_BUFFER_HORIZ;
    var marginy = DvtTreemapNode.TEXT_BUFFER_VERT;

    var aw = this._width - 2 * marginx - bw;
    var ah = this._height - 2 * marginy - bw;

    if (aw > 0 && ah > 0) {
      afContext.setAvailableWidth(aw);
      afContext.setAvailableHeight(ah);
      afContext.setFontSize(this.GetTextSize());
      //     this._contentRoot = DvtAfComponentFactory.parseAndStamp(afContext, template, this._shape);
      var afRoot = DvtAfComponentFactory.parseAndLayout(afContext, template, this._shape);
      this._contentRoot = afRoot;

      var transX;
      if (dvt.Agent.isRightToLeft(container.getCtx())) {
        var dim = afRoot.getDimensions();
        transX = this._x + this._width - marginx - .5 * bw - dim.w;
      }
      else {
        transX = this._x + marginx + .5 * bw;
      }
      afRoot.setTranslate(transX, this._y + marginy + .5 * bw);
    }
  }
  else {
    // Create the text object
    this._text = this._createTextNode(this._shape);
    if (this._text != null) {
      // For pattern nodes, add a background to make the text readable
      if (this._pattern && this._textStyle != DvtTreemapNode.TEXT_STYLE_HEADER) {
        var dims = this._text.measureDimensions();
        this._textBackground = new dvt.Rect(this.getView().getCtx(), dims.x, dims.y, dims.w, dims.h);
        this._textBackground.setSolidFill('#FFFFFF');
        this._textBackground.setMouseEnabled(false);
        this._shape.addChild(this._textBackground);

        // Reorder the text in front of the background rect
        this._addChildText(this._text);
      }
    }
  }

  // WAI-ARIA
  if (this.hasChildren())
    this._shape.setAriaRole('group');
  else
    this._shape.setAriaRole('img');
  this.UpdateAriaLabel();
};

/**
 * @override
 */
DvtTreemapNode.prototype.setSelected = function(selected) {
  // Delegate to super to store the state
  DvtTreemapNode.superclass.setSelected.call(this, selected);

  // If the node isn't displayed, return
  if (!this._shape)
    return;

  var nodeDefaults = this.getView().getOptions()['nodeDefaults'];
  var nodeHeaderDefaults = nodeDefaults['header'];

  if (this.isSelected()) {
    // Calculate the bounds for the selection effect
    var x = this._x;
    var y = this._y + DvtTreemapNode._LINE_FUDGE_FACTOR;
    var w = this._width - DvtTreemapNode._LINE_FUDGE_FACTOR;
    var h = this._height - DvtTreemapNode._LINE_FUDGE_FACTOR;

    // Workaround for different pixel drawing behavior between browsers
    if (dvt.Agent.isPlatformWebkit())
      y -= DvtTreemapNode._LINE_FUDGE_FACTOR;

    // Clear the selection inner and outer, which may be used by hover
    this._removeChildShape(this._selectionOuter);
    this._removeChildShape(this._selectionInner);
    this._selectionOuter = null;
    this._selectionInner = null;

    // Create the shapes, the fill will be set based on node type
    this._selectionOuter = new dvt.Rect(this.getView().getCtx(), x, y, w, h);
    this._selectionOuter.setMouseEnabled(false);
    this._selectionOuter.setFill(null);
    this._selectionOuter.setPixelHinting(true);
    this._shape.addChild(this._selectionOuter);

    this._selectionInner = new dvt.Rect(this.getView().getCtx(), x + 1, y + 1, w - 2, h - 2);
    this._selectionInner.setMouseEnabled(false);
    this._selectionInner.setFill(null);
    this._selectionInner.setPixelHinting(true);
    this._shape.addChild(this._selectionInner);

    if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER) {
      // Apply the selection effect to the header
      if (this.IsHover || this.isShowingKeyboardFocusEffect())
        this._innerShape.setSolidFill(nodeHeaderDefaults['hoverBackgroundColor']);
      else {
        this._innerShape.setSolidFill(nodeHeaderDefaults['selectedBackgroundColor']);
        // Update the text color
        if (this._text) {
          this.ApplyHeaderTextStyle(this._text, '_selectedLabelStyle');
        }
      }

      // Apply the right LAF
      this._selectionOuter.setSolidStroke(nodeHeaderDefaults['selectedOuterColor']);
      this._selectionInner.setSolidStroke(nodeHeaderDefaults['selectedInnerColor']);

      if (dvt.Agent.isTouchDevice())
        this._isolateButton = this._createIsolateRestoreButton(this._shape);
    }
    else {
      // Apply the right LAF
      this._selectionOuter.setSolidStroke(nodeDefaults['selectedOuterColor']);
      this._selectionInner.setSolidStroke(nodeDefaults['selectedInnerColor']);

      // Also apply the shadow.  Use a clone since the object is static and may be used elsewhere in the page.
      //  and : Disable shadows in safari and ff due to rendering issues.
      if (!dvt.Agent.isBrowserSafari() && !dvt.Agent.isPlatformGecko()) {
        this._shape.addDrawEffect(DvtTreeNode.__NODE_SELECTED_SHADOW);
      }

      // Move to the front of the z-order
      this.getView().__moveToSelectedLayer(this._shape);
    }
  }
  else {
    // !selected
    // Restore the regular effect to the shape
    this._removeChildShape(this._selectionInner);
    this._selectionInner = null;
    if (dvt.Agent.isTouchDevice())
      this._removeIsolateRestoreButton();

    if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER) {
      // If this is a node with header, adjust it
      if (this.IsHover || this.isShowingKeyboardFocusEffect())
        this._innerShape.setSolidFill(nodeHeaderDefaults['hoverBackgroundColor']);
      else {
        this.ApplyHeaderStyle(this._shape, this._innerShape);
        // Restore the text color
        if (this._text) {
          if (this.isDrillReplaceEnabled())
            this.ApplyHeaderTextStyle(this._text, '_drillableLabelStyle');
          else
            this.ApplyHeaderTextStyle(this._text, 'labelStyle');
        }
      }
      if (this._selectionOuter) {
        if (this.IsHover || this.isShowingKeyboardFocusEffect())
          this._selectionOuter.setSolidStroke(nodeHeaderDefaults['hoverOuterColor']);
        else {
          this._removeChildShape(this._selectionOuter);
          this._selectionOuter = null;
        }
      }
    }
    else {
      // leaf node
      // Remove the selection effects on this node
      this._shape.removeAllDrawEffects();
      if (this._selectionOuter) {
        this._removeChildShape(this._selectionOuter);
        this._selectionOuter = null;
      }

      // Restore the element back to its original location under its parent node
      var parentNode = this.GetParent();
      if (parentNode && parentNode._childNodeGroup) {
        // The exact z-order doesn't matter, since only the selected nodes have effects
        // that overflow into surrounding nodes.
        parentNode._childNodeGroup.addChild(this._shape);
      }
    }
  }
};

/**
 * @override
 */
DvtTreemapNode.prototype.showHoverEffect = function() {
  if (!this._shape || !this._hasLayout)
    return;

  var nodeDefaults = this.getView().getOptions()['nodeDefaults'];
  var nodeHeaderDefaults = nodeDefaults['header'];

  // : Do not show the hover effect if the node is not within the isolated subtree.  When a child of an
  // isolated node is selected, it is move to the front of the z-order.  During this move, the node behind it will
  // recieve a mouseOver event, which we should not show a hover effect for.
  var isolatedNode = this._view.__getLastIsolatedNode();
  if (isolatedNode != null && isolatedNode != this && !this.isDescendantOf(isolatedNode))
    return;

  // Prepare the array of points and stroke for the hover effect
  var points = new Array();
  var stroke;
  var x1, y1, x2, y2;
  if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER) {
    // Apply the hover effect to the header
    this._innerShape.setSolidFill(nodeHeaderDefaults['hoverBackgroundColor']);

    // Apply the outer hover effect border
    if (!this._selectionOuter) {
      // If the outer effect doesn't exist, create it
      var x = this._x;
      var y = this._y + DvtTreemapNode._LINE_FUDGE_FACTOR;
      var w = this._width - DvtTreemapNode._LINE_FUDGE_FACTOR;
      var h = this._height - DvtTreemapNode._LINE_FUDGE_FACTOR;

      // Workaround for different pixel drawing behavior between browsers
      if (dvt.Agent.isPlatformWebkit())
        y -= DvtTreemapNode._LINE_FUDGE_FACTOR;

      this._selectionOuter = new dvt.Rect(this.getView().getCtx(), x, y, w, h);
      this._selectionOuter.setMouseEnabled(false);
      this._selectionOuter.setFill(null);
      this._selectionOuter.setPixelHinting(true);
      this._shape.addChild(this._selectionOuter);
    }

    // Apply the formatting based on selection
    this._selectionOuter.setSolidStroke(this.isSelected() ? nodeHeaderDefaults['selectedOuterColor'] : nodeHeaderDefaults['hoverOuterColor']);

    // Apply the hover effect to the group contents
    x1 = this._x + DvtTreemapNode.GROUP_HOVER_INNER_WIDTH / 2 + DvtTreemapNode._LINE_FUDGE_FACTOR;
    x2 = this._x + this._width - DvtTreemapNode.GROUP_HOVER_INNER_WIDTH / 2 - DvtTreemapNode._LINE_FUDGE_FACTOR;
    y1 = this._y + this._titleBarHeight;
    y2 = this._y + this._height - DvtTreemapNode.GROUP_HOVER_INNER_WIDTH / 2 - DvtTreemapNode._LINE_FUDGE_FACTOR;
    points.push(x2, y1, x2, y2, x1, y2, x1, y1);
    stroke = new dvt.SolidStroke(nodeHeaderDefaults['hoverInnerColor'], DvtTreemapNode.GROUP_HOVER_INNER_OPACITY, DvtTreemapNode.GROUP_HOVER_INNER_WIDTH);

    // Update the text color
    if (this._text) {
      if (this.isDrillReplaceEnabled())
        this.ApplyHeaderTextStyle(this._text, '_drillableHoverLabelStyle');
      else
        this.ApplyHeaderTextStyle(this._text, '_hoverLabelStyle');
    }
  }
  else {
    x1 = this._x + DvtTreemapNode.NODE_SELECTION_WIDTH / 2;
    x2 = this._x + this._width - DvtTreemapNode.NODE_SELECTION_WIDTH / 2;
    y1 = this._y + DvtTreemapNode.NODE_SELECTION_WIDTH / 2;
    y2 = this._y + this._height - DvtTreemapNode.NODE_SELECTION_WIDTH / 2;

    // Need to start at the right coord, this._x, because of the line end miter
    points.push(this._x, y1, x2, y1, x2, y2, x1, y2, x1, y1);

    stroke = new dvt.SolidStroke(nodeDefaults['hoverColor'], DvtTreemapNode.NODE_HOVER_OPACITY, DvtTreemapNode.NODE_SELECTION_WIDTH);
  }

  // Apply and show the effect
  this.getView().__showHoverEffect(points, stroke, this);
};

/**
 * @override
 */
DvtTreemapNode.prototype.hideHoverEffect = function() {
  if (!this._shape || !this._hasLayout)
    return;

  var nodeDefaults = this.getView().getOptions()['nodeDefaults'];
  var nodeHeaderDefaults = nodeDefaults['header'];

  // Remove the hover effect from the header
  if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER) {
    if (this.isSelected()) {
      this._innerShape.setSolidFill(nodeHeaderDefaults['selectedBackgroundColor']);
      this._selectionOuter.setSolidStroke(nodeHeaderDefaults['selectedOuterColor']);
      // Update the text color
      if (this._text) {
        if (this.isDrillReplaceEnabled())
          this.ApplyHeaderTextStyle(this._text, '_drillableSelectedLabelStyle');
        else {
          this.ApplyHeaderTextStyle(this._text, '_selectedLabelStyle');
        }
      }
    }
    else {
      this.ApplyHeaderStyle(this._shape, this._innerShape);
      if (this._selectionOuter) {
        this._shape.removeChild(this._selectionOuter);
        this._selectionOuter = null;
      }
      // Restore the text color
      if (this._text) {
        if (this.isDrillReplaceEnabled())
          this.ApplyHeaderTextStyle(this._text, '_drillableLabelStyle');
        else
          this.ApplyHeaderTextStyle(this._text, 'labelStyle');
      }
    }
  }

  this.getView().__hideHoverEffect();
};

/**
 * @override
 */
DvtTreemapNode.prototype.highlight = function(bDimmed, alpha) {
  // Treemap node children are nested displayables, so we can't highlight the entire object.
  if (this.hasChildren()) {
    // Dim the text for group nodes
    if (this._text)
      this._text.setAlpha(alpha);

    // Also dim the header if it's displaying the node color. Normal headers are not dimmed because of the border impl,
    // which causes the nodes to appear darker when alpha is applied.
    if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER && this._bHeaderUseNodeColor && this._innerShape)
      this._innerShape.setAlpha(alpha);
  }
  else
    DvtTreemapNode.superclass.highlight.call(this, bDimmed, alpha);
};

/**
 * Returns true if isolate is enabled for this node.
 * @return {boolean}
 */
DvtTreemapNode.prototype.isIsolateEnabled = function() {
  return this._isolate != 'off' && this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER;
};

/**
 * @override
 */
DvtTreemapNode.prototype.getPopupBounds = function(behavior) {
  // If not specified or if no align provided, defer to default behavior
  if (!behavior || !behavior.getAlign())
    return DvtTreemapNode.superclass.getPopupBounds.call(this, behavior);

  // Otherwise align to the node
  return new dvt.Rectangle(this._x, this._y, this._width, this._height);
};

/**
 * @override
 */
DvtTreemapNode.prototype.getNextNavigable = function(event) {
  var keyCode;
  var parent;
  var lastChild;
  var next;

  if (event.type == dvt.MouseEvent.CLICK) {
    return DvtTreemapNode.superclass.getNextNavigable.call(this, event);
  }

  keyCode = event.keyCode;

  if (keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey) {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    return this;
  }

  // if alt held, or a bracket, move focus up or down one level in tree
  if ((keyCode == dvt.KeyboardEvent.UP_ARROW && event.altKey) || keyCode == dvt.KeyboardEvent.CLOSE_BRACKET) {
    // move up one level in the tree
    parent = this.GetParent();

    // we can move up one level if the parent is not the current root
    if (parent && (parent.getId() != this.getView().getRootNode().getId())) {
      next = parent;

      // update the grandparent's last visited child to be the current node's parent
      // updating the parent's (i.e. next node's) last visited child to point to the current node is
      // done at the end of this sequence of if, else-if statements
      parent.MarkAsLastVisitedChild();
    }
    else {
      next = this;
    }
  }
  else if ((keyCode == dvt.KeyboardEvent.DOWN_ARROW && event.altKey) || keyCode == dvt.KeyboardEvent.OPEN_BRACKET) {
    // move down one level in the tree
    lastChild = this.GetLastVisitedChild();
    if (lastChild) {
      next = lastChild;
    }
    else if (this.hasChildren()) {
      next = this.getView().__getDefaultNavigable(this.getChildNodes());
    }
    else // leaf node
    {
      next = this;
    }
  }
  else {
    // otherwise, stay in the same level
    var root = this.getView().__getLastIsolatedNode();
    var depth = 0;

    if (root) {
      // We have isolated a treemap node, so make sure we only consider the nodes currently being displayed.
      // Isolated nodes are rendered on top of the other nodes in the treemap, so we have to exclude the
      // other non-visible nodes in the treemap when navigating through an isolated node.
      // Find the depth of the current node from the isolated node
      if (this == root) {
        depth = 0;
      }
      else {
        var parent = this.GetParent();
        depth = 1;
        while (root != parent) {
          depth++;
          parent = parent.GetParent();
        }
      }
    }
    else {
      root = this;
      while (root.GetParent()) {
        root = root.GetParent();
      }

      depth = this.GetDepth();
    }

    var navigables = this.GetNodesAtDepth(root, depth);
    next = dvt.KeyboardHandler.getNextNavigable(this, event, navigables);
  }

  next.MarkAsLastVisitedChild();

  return next;
};

/**
 * @override
 */
DvtTreemapNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) {
  return new dvt.Rectangle(this._x, this._y, this._width, this._height);
};

/**
 * @override
 */
DvtTreemapNode.prototype.getTargetElem = function() {
  if (this._shape)
    return this._shape.getElem();
  return null;
};

//**************** End Overridden Functions *****************//
/**
 * Specifies the relative z-order for this node.
 * @param {number} zIndex The relative z-order for this node.
 */
DvtTreemapNode.prototype.setZIndex = function(zIndex) {
  this._zIndex = zIndex;
};

/**
 * Sets the position and bounds of this treemap node.
 * @param {number} x The x coordinate of the bounds.
 * @param {number} y The y coordinate of the bounds.
 * @param {number} width The width of the bounds.
 * @param {number} height The height of the bounds.
 * @return {dvt.Rectangle} the rectangle indicating the area to allocate to children, if different than inputs
 */
DvtTreemapNode.prototype.setLayoutParams = function(x, y, width, height) {
  // Nothing to render if either dimension is 0px
  if (width <= 0 || height <= 0)
    return;

  // Set a flag indicating layout has been performed
  this._hasLayout = true;

  // Cache the previous size and position for isolate support
  this._oldState = this.GetAnimationParams();

  // Store the given size and position
  this._x = x;
  this._y = y;
  this._width = width ? width : 0;
  this._height = height ? height : 0;

  // Determine the text style for this node
  if (this.hasChildren())
    this._textStyle = this._groupLabelDisplay;
  else
    this._textStyle = this._labelDisplay;

  // If text not specified, same as off
  if (!this._textStr)
    this._textStyle = DvtTreemapNode.TEXT_STYLE_OFF;

  // Return the subsection to allocate to children, ignored for leaf nodes
  if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER) {
    // Find the height of the header by creating and measuring the text node
    this._titleBarHeight = DvtTreemapNode._MIN_TITLE_BAR_HEIGHT;
    var text = new dvt.OutputText(this.getView().getCtx(), this._textStr);
    text.setFontSize(this.GetTextSize());
    this.ApplyHeaderTextStyle(text, 'labelStyle');
    var headerLabelHeight = dvt.TextUtils.guessTextDimensions(text).h;
    this._titleBarHeight = Math.max(this._titleBarHeight, headerLabelHeight);

    // Additional space for isolate/restore button
    if (this.isIsolateEnabled())
      this._titleBarHeight = Math.max(this._titleBarHeight, DvtTreemapNode._MIN_TITLE_BAR_HEIGHT_ISOLATE);

    // Headers consume some of the space
    var xx = this._x;
    var yy = this._y + this._titleBarHeight;
    var ww = this._width;
    var hh = this._height - this._titleBarHeight;

    // If there is enough space, then return the rectangle
    if (ww >= 0 && hh >= 0)
      return new dvt.Rectangle(xx, yy, ww, hh);
    else
      this._textStyle = null;// Not enough space, don't show header
  }

  return new dvt.Rectangle(this._x, this._y, this._width, this._height);
};

/**
 * @override
 */
DvtTreemapNode.prototype.getNodeUnderPoint = function(x, y) {
  // Check if the node contains the coords
  if (this.contains(x, y) || !this._hasLayout) {
    var childNodes = this.getChildNodes();
    for (var i = 0; i < childNodes.length; i++) {
      if (childNodes[i].contains(x, y))
        return childNodes[i].getNodeUnderPoint(x, y);
    }

    // No child found, return the current node
    if (this._hasLayout)
      return this;
  }

  // No node found, return null
  return null;
};

/**
 * @override
 */
DvtTreemapNode.prototype.contains = function(x, y) {
  return x >= this._x && x <= this._x + this._width && y >= this._y && y <= this._y + this._height;
};

/**
 * @override
 */
DvtTreemapNode.prototype.GetAnimationParams = function() {
  var r = dvt.ColorUtils.getRed(this._color);
  var g = dvt.ColorUtils.getGreen(this._color);
  var b = dvt.ColorUtils.getBlue(this._color);

  // Force bevel removal during animation for leaf nodes by passing an additional random number to force animation.
  return [this._x, this._y, this._width, this._height, r, g, b, this.hasChildren() ? 0 : Math.random()];//Random Number used to force animation @RandomNumberOk
};

/**
 * @override
 */
DvtTreemapNode.prototype.SetAnimationParams = function(params) {
  // Update the layout params
  this.setLayoutParams(params[0], params[1], params[2], params[3]);

  // Update the color.  Round them since color parts must be ints
  var r = Math.round(params[4]);
  var g = Math.round(params[5]);
  var b = Math.round(params[6]);
  this._color = dvt.ColorUtils.makeRGB(r, g, b);

  // Update the shapes
  this._updateShapes();
};

/**
 * After a relayout due to isolate or restore, returns the animation to render this node and
 * all of its descendants to the new state.
 * @return {array}
 */
DvtTreemapNode.prototype.getIsolateAnimation = function() {
  var playables = [this._getIsolateAnimation()];
  var descendants = this.getDescendantNodes();
  for (var i = 0; i < descendants.length; i++) {
    playables.push(descendants[i]._getIsolateAnimation());
  }

  return playables;
};

/**
 * Returns the isolate or restore animation for this node.
 * @return {dvt.Playable}
 */
DvtTreemapNode.prototype._getIsolateAnimation = function() {
  if (this._oldState) {
    // Create the playable to animate to the new layout state
    var playable = new dvt.CustomAnimation(this.getView().getCtx(), this, DvtTreemapNode._ANIMATION_ISOLATE_DURATION);
    playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.GetAnimationParams, this.SetAnimationParams, this.GetAnimationParams());

    // Initialize the old state
    this.SetAnimationParams(this._oldState);

    return playable;
  }
  else
    return null;
};

/**
 * @override
 */
DvtTreemapNode.prototype.animateUpdate = function(handler, oldNode) {
  if (this.GetDepth() == 0 || (oldNode._hasLayout && oldNode._width > 0 && oldNode._height > 0)) {
    // Old node existed and was visible, show the update animation
    // this.GetDepth() check since root will not have a size
    return DvtTreemapNode.superclass.animateUpdate.call(this, handler, oldNode);
  }
  else {
    // Old node did not exist or was not visible, treat as insert
    return this.animateInsert(handler);
  }
};

/**
 * Creates and return the shape object for this node.
 * @return {dvt.Shape} The shape object for this node
 * @private
 */
DvtTreemapNode.prototype._createShapeNode = function() {
  var context = this.getView().getCtx();

  // Create the basic shape with geometry
  var shape;
  if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER) {
    // Create the header, which is made of an outer shape for the border and an inner shape for the fill
    shape = new dvt.Rect(context, this._x, this._y, this._width, this._height);
    this._innerShape = new dvt.Rect(context, this._x + 1, this._y + 1, this._width - 2, this._height - 2);

    // Apply the style attributes to the header
    this.ApplyHeaderStyle(shape, this._innerShape);

    this._innerShape.setMouseEnabled(false);
    shape.addChild(this._innerShape);

    // Isolate Support
    if (this.__isIsolated())
      this._isolateButton = this._createIsolateRestoreButton(shape);
  }
  else {
    // Non-header node.  3 cases:
    // All bevels: {shape: topLeftBevel, secondShape: bottomRightBevel, thirdShape: fill}
    // Bottom right bevel only: {shape: bottomRightBevel, secondShape: fill}
    // No bevels: {firstShape: fill}
    var fill = this.GetFill();

    // Create the outermost shape
    shape = new dvt.Rect(context, this._x, this._y, this._width, this._height);

    // Create the bevel effect for the node: Disabled on phones/tablets for 1000+ nodes for performance reasons.
    var bVisualEffects = this.getView().__getNodeCount() < 1000 || !dvt.Agent.isTouchDevice();
    if (bVisualEffects && this._width >= DvtTreemapNode.MIN_SIZE_FOR_BORDER && this._height >= DvtTreemapNode.MIN_SIZE_FOR_BORDER) {
      // Figure out the stroke colors
      var topLeft = new dvt.SolidStroke(DvtTreemapNode.DEFAULT_NODE_TOP_BORDER_COLOR);
      var bottomRight = new dvt.SolidStroke(DvtTreemapNode.DEFAULT_NODE_BOTTOM_BORDER_COLOR, DvtTreemapNode.DEFAULT_NODE_BORDER_OPACITY);
      if (this._pattern) {
        topLeft = new dvt.SolidStroke(this._color, DvtTreemapNode.DEFAULT_NODE_PATTERN_BORDER_OPACITY);
        bottomRight = topLeft;
      }

      // Retrieve the bevel colors and blend with the fill color to get the desired effect
      var fillColor = this.getColor();
      var topLeftColor = dvt.ColorUtils.interpolateColor(DvtTreemapNode.DEFAULT_NODE_TOP_BORDER_COLOR, fillColor, 1 - DvtTreemapNode.DEFAULT_NODE_BORDER_OPACITY);
      var bottomRightColor = dvt.ColorUtils.interpolateColor(DvtTreemapNode.DEFAULT_NODE_BOTTOM_BORDER_COLOR, fillColor, 1 - DvtTreemapNode.DEFAULT_NODE_BORDER_OPACITY);

      // Creation of bevels varies based on the minimum of the width and height of the node:
      // 0: Won't reach this code
      // 1: No bevels
      // 2: Bottom right bevel only
      // 4+: All bevels
      var minDim = Math.min(this._width, this._height);

      // Both bevels
      if (minDim >= 4) {
        // shape is the bottomRight bevel in this case
        shape.setSolidFill(bottomRightColor);

        // topLeftShape hides all but the bottomRight bevel
        this._topLeftShape = new dvt.Rect(context, this._x, this._y, this._width - 1, this._height - 1);
        this._topLeftShape.setSolidFill(topLeftColor);
        this._topLeftShape.setMouseEnabled(false);
        shape.addChild(this._topLeftShape);

        // fillShape exposes both bevels
        this._fillShape = new dvt.Rect(context, this._x + 1, this._y + 1, this._width - 2, this._height - 2);
        this._fillShape.setFill(fill);
        this._fillShape.setMouseEnabled(false);
        shape.addChild(this._fillShape);
      }
      else if (minDim >= 2) {
        // Bottom Right Bevel
        // shape is the bottomRight bevel in this case
        shape.setSolidFill(bottomRightColor);

        // fillShape exposes the bevel
        this._fillShape = new dvt.Rect(context, this._x, this._y, this._width - 1, this._height - 1);
        this._fillShape.setFill(fill);
        this._fillShape.setMouseEnabled(false);
        shape.addChild(this._fillShape);
      }
      else // No bevels
        shape.setFill(fill);
    }
    else // No bevels
      shape.setFill(fill);
  }

  // Add pointers between this node and the shape
  this.getView().getEventManager().associate(shape, this);

  // Allows selection cursor to be shown over nodes if nodeSelection is enabled and node is selectable
  // Unselectable nodes explicitly set as default so correct pointer appears if un-selectable node is drawn inside selectable node
  if (this.isSelectable())
    shape.setSelectable(true);
  else
    shape.setCursor('default');

  shape.zIndex = this._zIndex;
  return shape;
};

/**
 * Creates and positions the isolate or restore button for this node.
 * @param {dvt.Container} container The container for the button.
 * @return {dvt.Button}
 * @private
 */
DvtTreemapNode.prototype._createIsolateRestoreButton = function(container) {
  if (this._textStyle != DvtTreemapNode.TEXT_STYLE_HEADER || !this.isIsolateEnabled())
    return null;

  var button = null;
  var x1 = this._x;
  var x2 = this._x + this._width - DvtTreemapNode._LINE_FUDGE_FACTOR;
  var y1 = this._y + DvtTreemapNode._LINE_FUDGE_FACTOR;
  var y2 = this._y + this._titleBarHeight;
  var availIconWidth = x2 - x1 - DvtTreemapNode._ISOLATE_GAP_SIZE * 2;
  if (availIconWidth > DvtTreemapNode._ISOLATE_ICON_SIZE) {
    // Create the button and add to the container
    button = this.__isIsolated() ? this._getRestoreButton() : this._getIsolateButton();
    var transX;
    if (dvt.Agent.isRightToLeft(container.getCtx()))
      transX = x1 + DvtTreemapNode._ISOLATE_GAP_SIZE;
    else
      transX = x2 - DvtTreemapNode._ISOLATE_ICON_SIZE - DvtTreemapNode._ISOLATE_GAP_SIZE;
    button.setTranslate(transX, (y2 + y1 - DvtTreemapNode._ISOLATE_ICON_SIZE) / 2);
    container.addChild(button);

    // Add a buffer to make the objects easier to interact with on touch devices
    if (dvt.Agent.isTouchDevice()) {
      var rect = new dvt.Rect(container.getCtx(), - DvtTreemapNode._ISOLATE_TOUCH_BUFFER, - DvtTreemapNode._ISOLATE_TOUCH_BUFFER, DvtTreemapNode._ISOLATE_ICON_SIZE + 2 * DvtTreemapNode._ISOLATE_TOUCH_BUFFER, DvtTreemapNode._ISOLATE_ICON_SIZE + 2 * DvtTreemapNode._ISOLATE_TOUCH_BUFFER);
      rect.setInvisibleFill();
      button.addChild(rect);
    }

    // For Alta, associate the node so the hover effect doesn't get removed.
    if (dvt.CSSStyle.afterSkinAlta(this.getView().getOptions()['skin']))
      this.getView().getEventManager().associate(button, this);
    else {
      // Associate a blank peer so the button is not treated as part of the node
      var tooltip = dvt.Bundle.getTranslation(this.getView().getOptions(), this.__isIsolated() ? 'tooltipRestore' : 'tooltipIsolate', dvt.Bundle.TREEMAP_PREFIX, this.__isIsolated() ? 'RESTORE' : 'ISOLATE');
      this.getView().getEventManager().associate(button, new DvtTreePeer(this, this.getId(), tooltip));
    }
  }

  return button;
};

/**
 * Removes the isolate/restore button, if displayed.
 * @private
 */
DvtTreemapNode.prototype._removeIsolateRestoreButton = function() {
  if (this._isolateButton) {
    this._removeChildShape(this._isolateButton);
    this._isolateButton = null;
  }
};

/**
 * Creates and return the text object for this node. Adds the text to the container if it's not empty.
 * @param {dvt.Container} container The container to render in.
 * @return {DvtText} The text object for this node.
 * @private
 */
DvtTreemapNode.prototype._createTextNode = function(container) {
  var isRTL = dvt.Agent.isRightToLeft(container.getCtx());

  // If no text or no container to place the text, return
  if (!this._textStr || !container || !this._textStyle || this._textStyle == DvtTreemapNode.TEXT_STYLE_OFF)
    return null;

  // Approximate whether the text could fit vertically
  var availHeight = this._height;
  if (this.GetTextSize() > availHeight)
    return null;

  // Figure out the horizontal alignment
  var hAlign = (this._textStyle == DvtTreemapNode.TEXT_STYLE_NODE) ? this._labelHalign : this._headerHalign;
  if (isRTL) {
    if (hAlign == 'start')
      hAlign = 'end';
    else if (hAlign == 'end')
      hAlign = 'start';
  }

  // Approximate whether the text could fit horizontally (conservative)
  var availWidth = this._width - (DvtTreemapNode.TEXT_BUFFER_HORIZ + DvtTreemapNode.MIN_TEXT_BUFFER);
  var isolateWidth = 0;
  if (this.isIsolateEnabled()) {
    isolateWidth = DvtTreemapNode._ISOLATE_ICON_SIZE + DvtTreemapNode._ISOLATE_GAP_SIZE;
    if (hAlign == 'center')
      availWidth -= 2 * isolateWidth;// center aligned text should always be centered, meaning space is reserved on either size for the button
    else
      availWidth -= isolateWidth;
  }

  if (availWidth <= 0)
    return null;

  // Create the text object
  var text = new dvt.OutputText(this.getView().getCtx(), this._textStr);
  text.setFontSize(this.GetTextSize());

  // Calculate the horizontal text position
  if (hAlign == 'start') {
    if (isRTL)
      text.setX(this._x + DvtTreemapNode.TEXT_BUFFER_HORIZ + isolateWidth);
    else
      text.setX(this._x + DvtTreemapNode.TEXT_BUFFER_HORIZ);
    text.alignLeft();
  }
  else if (hAlign == 'center') {
    text.setX(this._x + (this._width / 2));
    text.alignCenter();
  }
  else if (hAlign == 'end') {
    if (isRTL)
      text.setX(this._x + this._width - DvtTreemapNode.TEXT_BUFFER_HORIZ);
    else
      text.setX(this._x + this._width - DvtTreemapNode.TEXT_BUFFER_HORIZ - isolateWidth);
    text.alignRight();
  }

  // Calculate the vertical text position and style
  if (this._textStyle == DvtTreemapNode.TEXT_STYLE_NODE) {
    // Update it with the correct style
    this.ApplyLabelTextStyle(text);

    // Set the correct available height
    availHeight = this._height - DvtTreemapNode.TEXT_BUFFER_VERT * 2;

    // Get the text height
    var textHeight = dvt.TextUtils.getTextHeight(text);

    // Vertical Alignment
    if (this._labelValign == 'top')
      text.setY(this._y + DvtTreemapNode.TEXT_BUFFER_VERT);
    else if (this._labelValign == 'center')
      text.setY(this._y + this._height / 2 - textHeight / 2);
    else if (this._labelValign == 'bottom')
      text.setY(this._y + this._height - DvtTreemapNode.TEXT_BUFFER_VERT - textHeight);
  }
  else if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER) {
    // Note: No need to worry about available height here.  Headers are sized based on the text size.
    var chromeAdjustment = dvt.Agent.isPlatformWebkit() ? DvtTreemapNode._LINE_FUDGE_FACTOR : 0;
    text.setY(this._y + DvtTreemapNode.DEFAULT_HEADER_BORDER_WIDTH + this._titleBarHeight / 2 + chromeAdjustment);
    text.alignMiddle();
    this.ApplyHeaderTextStyle(text, 'labelStyle');
  }

  if (text != null) {
    if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER && this.isDrillReplaceEnabled()) {
      // Drillable text link
      this.ApplyHeaderTextStyle(text, '_drillableLabelStyle');
      text.setCursor('pointer');

      // Associate with a DvtTreePeer to handle drilling
      var peer = new DvtTreePeer(this, this.getId(), null, this.getDatatip(), this.getDatatipColor());
      peer.setDrillable(true);
      this.getView().getEventManager().associate(text, peer);
    }
    else // Parent node will handle all events
      text.setMouseEnabled(false);

    // Truncate the text if necessary
    return dvt.TextUtils.fitText(text, availWidth, availHeight, container) ? text : null;
  }
};

/**
 * Applies style to a header node.
 * @param {dvt.Shape} shape The outer shape for the header, used for the border
 * @param {dvt.Shape} innerShape The inner shape for the header, use for the fill
 */
DvtTreemapNode.prototype.ApplyHeaderStyle = function(shape, innerShape) {
  var nodeHeaderDefaults = this.getView().getOptions()['nodeDefaults']['header'];
  if (this._bHeaderUseNodeColor) {
    var fillColor = this.getColor();
    innerShape.setSolidFill(fillColor);
    var borderColor = dvt.ColorUtils.interpolateColor(nodeHeaderDefaults['borderColor'], fillColor, 1 - DvtTreemapNode.DEFAULT_HEADER_WITH_NODE_COLOR_ALPHA);
    shape.setSolidFill(borderColor);
  }
  else {
    shape.setSolidFill(nodeHeaderDefaults['borderColor']);
    innerShape.setSolidFill(nodeHeaderDefaults['backgroundColor']);
  }
};

/**
 * Applies the specified header style to the node header text.
 * @param {dvt.OutputText} text The node header text instance.
 * @param {string} styleType The style to use from the node header defaults.
 */
DvtTreemapNode.prototype.ApplyHeaderTextStyle = function(text, styleType) {
  var textStyle = [];

  // Top Level Header is Bold
  if (this.GetDepth() <= 1)
    textStyle.push(new dvt.CSSStyle('font-weight:bold;'));

  // Header Default Style
  textStyle.push(this.getView().getOptions()['nodeDefaults']['header'][styleType]);

  // Header UseNodeColor for Non-Hover/Selected Labels
  if (this._bHeaderUseNodeColor && (styleType == 'labelStyle' || styleType == '_drillableLabelStyle'))
    textStyle.push(new dvt.CSSStyle('color: ' + DvtTreeNode.GetNodeTextColor(this)));

  // Header Label Style
  if (this._headerLabelStyle)
    textStyle.push(this._headerLabelStyle);

  text.setCSSStyle(dvt.CSSStyle.mergeStyles(textStyle));
};

/**
 * Handles a mouse out event on the node.
 */
DvtTreemapNode.prototype.handleMouseOver = function() {
  // Isolate: draw button if needed
  if (!this._isolateButton && !dvt.Agent.isTouchDevice())
    this._isolateButton = this._createIsolateRestoreButton(this._shape);

  DvtTreemapNode.superclass.handleMouseOver.call(this);
};

/**
 * Handles a mouse out event on the node.
 */
DvtTreemapNode.prototype.handleMouseOut = function() {
  // Isolate: hide button if displayed
  if (this.__isIsolated() !== true && !dvt.Agent.isTouchDevice())
    this._removeIsolateRestoreButton();

  DvtTreemapNode.superclass.handleMouseOut.call(this);
};

/**
 * Updates the shapes for the current layout params.
 * @private
 */
DvtTreemapNode.prototype._updateShapes = function() {
  if (!this._shape)
    return;

  // Update the shape and color
  this._shape.setRect(this._x, this._y, this._width, this._height);
  if (this._innerShape)
    this._innerShape.setRect(this._x + 1, this._y + 1, this._width - 2, this._height - 2);

  // Also update the color
  if (this._textStyle != DvtTreemapNode.TEXT_STYLE_HEADER || this._bHeaderUseNodeColor) {
    this._shape.setFill(this.GetFill());
  }

  if (this.isSelected())
    this.setSelected(false);

  // Clear all border effects.  They will be restored in the animationEnd listener.
  this._removeChildShape(this._fillShape);
  this._removeChildShape(this._topLeftShape);
  this._fillShape = null;
  this._topLeftShape = null;

  // Remove isolate/restore if displayed
  this._removeIsolateRestoreButton();

  // Handle the node content
  var template = this.GetTemplate();
  if (template) {
    // Hide the content for now, it will be added back after the animation completes.
    this._removeChildShape(this._contentRoot);
    this._contentRoot = null;
  }
  else {
    // No template, update the text
    // Remove the text background
    this._removeChildShape(this._textBackground);
    this._textBackground = null;

    // Update the text.  This implementation simply removes and repaints it.
    if (this._text)
      this._text.getParent().removeChild(this._text);// necessary because the parent may not be the shape
    this._text = this._createTextNode(this._shape);
  }
};

/**
 * @override
 */
DvtTreemapNode.prototype.getDropSiteFeedback = function() {
  if (this._shape) {
    return new dvt.Rect(this.getView().getCtx(), this._shape.getX(), this._shape.getY(), this._shape.getWidth(), this._shape.getHeight());
  }
  else
    return null;
};

/**
 * Adds the specified DvtText as a child.
 * @param {DvtText} text
 */
DvtTreemapNode.prototype._addChildText = function(text) {
  if (this._textStyle == DvtTreemapNode.TEXT_STYLE_NODE && this.hasChildren())
    this.getView().__getGroupTextLayer().addChild(text);
  else
    this._shape.addChild(text);
};

/**
 * Helper function to remove child shapes from this node.
 * @param {dvt.Shape} childShape The child shape to remove.
 * @private
 */
DvtTreemapNode.prototype._removeChildShape = function(childShape) {
  if (childShape)
    this._shape.removeChild(childShape);
};

/**
 * Returns the isolate button for use on the node header.
 * @return {dvt.Displayable}
 * @private
 */
DvtTreemapNode.prototype._getIsolateButton = function() {
  var context = this.getView().getCtx();

  // Get the resources from the view
  var bRtl = dvt.Agent.isRightToLeft(this._context);
  var resources = this.getView().getOptions()['_resources'];
  var upImage = bRtl && resources['isolateRtl'] ? resources['isolateRtl'] : resources['isolate'];
  var overImage = bRtl && resources['isolateDownRtl'] ? resources['isolateDownRtl'] : resources['isolateDown'];
  var downImage = bRtl && resources['isolateOverRtl'] ? resources['isolateOverRtl'] : resources['isolateOver'];

  // Initialize the button states
  var upState = new dvt.Image(context, upImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);
  var overState = new dvt.Image(context, overImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);
  var downState = new dvt.Image(context, downImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);

  // Have to add a transparent fill so that IE9 can capture the mouse events ()
  upState.setInvisibleFill();
  overState.setInvisibleFill();
  downState.setInvisibleFill();

  // Create button and hook up click listener
  var button = new dvt.Button(context, upState, overState, downState);
  button.addEvtListener(dvt.MouseEvent.CLICK, this.__isolateNode, false, this);
  return button;
};

/**
 * Returns the restore button for use on the node header.
 * @return {dvt.Displayable}
 * @private
 */
DvtTreemapNode.prototype._getRestoreButton = function() {
  var context = this.getView().getCtx();

  // Get the resources from the view
  var bRtl = dvt.Agent.isRightToLeft(this._context);
  var resources = this.getView().getOptions()['_resources'];
  var upImage = bRtl && resources['restoreRtl'] ? resources['restoreRtl'] : resources['restore'];
  var overImage = bRtl && resources['restoreDownRtl'] ? resources['restoreDownRtl'] : resources['restoreDown'];
  var downImage = bRtl && resources['restoreOverRtl'] ? resources['restoreOverRtl'] : resources['restoreOver'];

  // Initialize the button states
  var upState = new dvt.Image(context, upImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);
  var overState = new dvt.Image(context, overImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);
  var downState = new dvt.Image(context, downImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);

  // Have to add a transparent fill so that IE9 can capture the mouse events ()
  upState.setInvisibleFill();
  overState.setInvisibleFill();
  downState.setInvisibleFill();

  // Create button and hook up click listener
  var button = new dvt.Button(context, upState, overState, downState);
  button.addEvtListener(dvt.MouseEvent.CLICK, this.__restoreNode, false, this);
  return button;
};

/**
 * Returns true if this node is isolated
 * @return {Boolean} true if this node is isolated, false otherwise
 */
DvtTreemapNode.prototype.__isIsolated = function() {
  return this._bIsolated;
};

/**
 * Isolates this node and maximizes it.
 */
DvtTreemapNode.prototype.__isolateNode = function(event) {
  this._bIsolated = true;
  this.hideHoverEffect();
  this.getView().__isolate(this);

  // Remove the isolate button, to be redrawn after isolate is complete
  this._removeIsolateRestoreButton();

  this.UpdateAriaLabel();

  // Stop propagation to prevent selection from changing
  if (event)
    event.stopPropagation();
};

/**
 * Restores this node to its normal size.
 */
DvtTreemapNode.prototype.__restoreNode = function(event) {
  this._bIsolated = false;
  this.hideHoverEffect();
  this.getView().__restore();

  // Remove the restore button, to be redrawn after isolate is complete
  this._removeIsolateRestoreButton();

  this.UpdateAriaLabel();

  // Stop propagation to prevent selection from changing
  if (event)
    event.stopPropagation();
};

/**
 * @override
 */
DvtTreemapNode.prototype.getDatatip = function(target, x, y) {
  if (target && target instanceof dvt.Button)
    return null;// tooltip is displayed for isolate button
  else
    return DvtTreemapNode.superclass.getDatatip.call(this, target, x, y);
};

/**
 * @override
 */
DvtTreemapNode.prototype.getDatatipColor = function(target) {
  if (target && target instanceof dvt.Button)
    return null;// tooltip is displayed for isolate button
  else
    return DvtTreemapNode.superclass.getDatatipColor.call(this, target);
};

/**
 * @override
 */
DvtTreemapNode.prototype.getTooltip = function(target) {
  if (target && target instanceof dvt.Button)
    return dvt.Bundle.getTranslation(this.getView().getOptions(), this.__isIsolated() ? 'tooltipRestore' : 'tooltipIsolate', dvt.Bundle.TREEMAP_PREFIX, this.__isIsolated() ? 'RESTORE' : 'ISOLATE');
  else
    return null;
};

/**
 * @override
 */
DvtTreemapNode.prototype.getAriaLabel = function() {
  var options = this.getView().getOptions();

  var states = [];
  if (this.isSelectable())
    states.push(dvt.Bundle.getTranslation(options, this.isSelected() ? 'stateSelected' : 'stateUnselected', dvt.Bundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  if (this.__isIsolated())
    states.push(dvt.Bundle.getTranslation(options, 'stateIsolated', dvt.Bundle.UTIL_PREFIX, 'STATE_ISOLATED'));
  if (this.isDrillReplaceEnabled())
    states.push(dvt.Bundle.getTranslation(options, 'stateDrillable', dvt.Bundle.UTIL_PREFIX, 'STATE_DRILLABLE'));

  return dvt.Displayable.generateAriaLabel(this.getShortDesc(), states);
};

/**
 * @override
 */
DvtTreemapNode.prototype.UpdateAriaLabel = function() {
  if (!dvt.Agent.deferAriaCreation() && this._shape)// need the null check bc it may fail in unit test (TreemapSelectionTest)
    this._shape.setAriaProperty('label', this.getAriaLabel());
};
/**
 * Base layout class for treemaps.
 * @class
 * @constructor
 */
var DvtTreemapLayoutBase = function() {
  this.Init();
};

dvt.Obj.createSubclass(DvtTreemapLayoutBase, dvt.Obj);

/** @private @const **/
DvtTreemapLayoutBase._GROUP_GAP = 3;


/**
 * @protected
 */
DvtTreemapLayoutBase.prototype.Init = function() {
  this._zIndex = 0; // counter to help keep track of the zIndex of the nodes
};


/**
 * Performs layout for the tree.  The specific algorithm varies by subclass.
 * @param {dvt.Treemap} view The treemap component.
 * @param {DvtTreeNode} root The root of the tree.
 * @param {number} x The x coordinate for this node.
 * @param {number} y The y coordinate for this node.
 * @param {number} width The width of this node.
 * @param {number} height The height of this node.
 * @param {boolean} bShowRoot True if the root node should be displayed.
 */
DvtTreemapLayoutBase.prototype.layout = function(view, root, x, y, width, height, bShowRoot) 
{
  // subclasses should override
};

/**
 * Applies the specified bounds to the node and returns the space available to the node's children.
 * @param {DvtTreeNode} node
 * @param {number} x The x coordinate for this node.
 * @param {number} y The y coordinate for this node.
 * @param {number} width The width of this node.
 * @param {number} height The height of this node.
 * @param {boolean} isRoot true if this node is the root of the tree.
 * @return {dvt.Rectangle} The rectangle indicating the area to allocate to the children of this node.
 */
DvtTreemapLayoutBase.prototype.setNodeBounds = function(node, x, y, width, height, isRoot) 
{
  // Set the relative zIndex of the node and increment
  node.setZIndex(this._zIndex);
  this._zIndex++;

  // The root node is not rendered, unless it's a singleton
  if (!isRoot || !node.hasChildren()) {
    // Support for gaps between nodes
    var gap = this.getGapSize(node.getView(), node.GetDepth());

    // Round the values to pixel locations and add gaps
    var xx = Math.round(x + gap);
    var yy = Math.round(y + gap);
    var ww = Math.round(x + width - gap) - xx;
    var hh = Math.round(y + height - gap) - yy;

    // Set the rectangle on the node and get the bounds available to its children
    var availBounds = node.setLayoutParams(xx, yy, ww, hh);
    if (availBounds)
      return availBounds;
  }

  // If no explicit bounds returned, use the entire space
  return new dvt.Rectangle(x, y, width, height);
};


/**
 * Returns the gap size for a node at the specified depth.
 * @param {dvt.Treemap} view
 * @param {number} depth The depth of the node for which the gap should be replied.
 * @return {number} The size of the gaps around this node.
 */
DvtTreemapLayoutBase.prototype.getGapSize = function(view, depth) {
  var groupGaps = view.getOptions()['groupGaps'];
  if (groupGaps == 'outer')
    return (depth == 1 && view.__getMaxDepth() >= 2) ? DvtTreemapLayoutBase._GROUP_GAP : 0;
  else if (groupGaps == 'all')
    return (depth < view.__getMaxDepth()) ? DvtTreemapLayoutBase._GROUP_GAP : 0;
  else // none
    return 0;
};
/**
 * Layout class for treemaps.  This layout optimizes the aspect ratios, making the nodes as square as
 * possible for improved comparisons between nodes.  This layout does not maintain the ordering of
 * the nodes.
 * @class
 * @constructor
 * @extends {DvtTreemapLayoutBase}
 */
var DvtTreemapLayoutSquarifying = function() {
  this.Init();
};

dvt.Obj.createSubclass(DvtTreemapLayoutSquarifying, DvtTreemapLayoutBase);


/**
 * @override
 */
DvtTreemapLayoutSquarifying.prototype.layout = function(view, root, x, y, width, height, bShowRoot) {
  var isRoot = bShowRoot ? false : true;
  this._layout(root, x, y, width, height, isRoot);
};


/**
 * Performs layout for the specified node in the tree.
 * @param {DvtTreemapNode} node the root of the tree
 * @param {number} x The x coordinate for this node.
 * @param {number} y The y coordinate for this node.
 * @param {number} width The width of this node.
 * @param {number} height The height of this node.
 * @param {boolean} isRoot true if this node is the root of the tree.
 */
DvtTreemapLayoutSquarifying.prototype._layout = function(node, x, y, width, height, isRoot) 
{
  // Set the bounds on the current node and get the space available for its children
  var availBounds = this.setNodeBounds(node, x, y, width, height, isRoot);

  // Layout the children
  var children = node.getChildNodes();
  if (children != null && children.length > 0) {
    // Calculate the pixel size for each node and store in a temp field
    this._calcPixelSize(children, availBounds.w * availBounds.h);

    // Make a copy of the children array and sort ascending by size.
    // The ascending sort is used because squarify will move from back to front
    children = children.slice(0).sort(function(a,b) {return a.getSize() - b.getSize()});

    var w = Math.min(availBounds.w, availBounds.h);
    var r = new dvt.Rectangle(availBounds.x, availBounds.y, availBounds.w, availBounds.h);
    this._squarify(children, new Array(), w, r, Infinity);
  }
};


/**
 * Calculates and sets the pixel size for each child node.
 * @param {array} children The array of treemap node children.
 * @param {number} area The pixel area available for these children.
 * @private
 */
DvtTreemapLayoutSquarifying.prototype._calcPixelSize = function(children, area) {
  // First calculate the total.
  var total = 0;
  var i = 0;
  for (i = 0; i < children.length; i++)
    total += children[i].getSize() > 0 ? children[i].getSize() : 0; // ignore negatives, which skew child size calc

  // Then set the size
  var factor = (area == 0) ? 0 : area / total;
  for (i = 0; i < children.length; i++) {
    var child = children[i];
    child.__pxSize = child.getSize() * factor;
  }
};


/**
 * Recursively arranges the rectangles to perform layout with lowest aspect ratio.
 * @param {array} children The array of treemap nodes that still need layout, in ascending order by size.
 * @param {array} row The array of treemap nodes arranged in the current row.
 * @param {number} w The length along which the rectangles will be laid out.
 * @param {dvt.Rectangle} r The rectangle available for layout.
 * @param {number} worst The worst aspect ratio in the current row.
 * @private
 */
DvtTreemapLayoutSquarifying.prototype._squarify = function(children, row, w, r, worst) {
  // Note: This algorithm was modified from recursive to iterative to avoid the maximum
  //       recursive stack size in javascript.  This new implementation is much better
  //       at dealing with 0 size nodes and with large breadth size.

  // If there are no more children, assign the row and return
  if (children == null || children.length == 0) {
    this._layoutRow(row, w, r);
    return;
  }

  while (children.length > 0) {
    var c = children.pop();

    // If c has no visible size, we are done, since children are sorted in ascending size.
    if (c.__pxSize < 0) {
      // Assign the layout and finish
      this._layoutRow(row, w, r);
      return;
    }

    // Otherwise assign it to the row
    row.push(c);

    var newWorst = this._getWorst(row, w);
    if (newWorst > worst) {
      // Adding child does not improve layout. Reset arrays, assign the layout and recurse.
      children.push(c); // add c back to the children
      row.pop(); // remove c from the row
      r = this._layoutRow(row, w, r);
      this._squarify(children, new Array(), Math.min(r.w, r.h), r, Infinity);
      return;
    }
    else if (children.length == 0) {
      // No more children to allocate.  Assign layout and finish
      this._layoutRow(row, w, r);
      return;
    }
    else // update the worst field
      worst = newWorst;
  }
};


/**
 * Returns the highest aspect ratio of a list of rectangles.
 * @param {array} areas The array of treemap nodes
 * @param {number} w The length along which the rectangles will be laid out
 * @return {number} The greatest aspect ratio of the list of rectangles.
 * @private
 */
DvtTreemapLayoutSquarifying.prototype._getWorst = function(areas, w) {
  var total = 0;
  var min = Infinity;
  var max = -Infinity;

  for (var i = 0; i < areas.length; i++) {
    total += areas[i].__pxSize;
    min = Math.min(min, areas[i].__pxSize);
    max = Math.max(max, areas[i].__pxSize);
  }

  var s2 = total * total;
  var w2 = w * w;
  return Math.max((w2 * max) / s2, s2 / (w2 * min));
};


/**
 * Assigns the layout for the current row.
 * @param {array} row The array of treemap nodes arranged in the current row.
 * @param {number} w The length along which the rectangles will be laid out.
 * @param {dvt.Rectangle} r The rectangle available for layout.
 * @return {dvt.Rectangle} A rectangle containing the unallocated space.
 * @private
 */
DvtTreemapLayoutSquarifying.prototype._layoutRow = function(row, w, r) 
{
  // Calculate the sum of the row areas
  var total = 0;
  var i;
  for (i = 0; i < row.length; i++)
    total += row[i].__pxSize;

  // Assign positions to the row nodes
  var x = r.x;
  var y = r.y;
  var width, height;
  if (w == r.w) {
    // Horizontal Layout
    height = (w == 0) ? 0 : total / w;
    for (i = 0; i < row.length; i++) {
      width = row[i].__pxSize / height;  // equivalent to w*size/total
      this._layout(row[i], x, y, width, height, false); // Set and recurse
      x += width;
    }

    // Return the remaining space
    return new dvt.Rectangle(r.x, r.y + height, r.w, r.h - height);
  }
  else {
    // Vertical Layout
    width = (w == 0) ? 0 : total / w;
    for (i = 0; i < row.length; i++) {
      height = row[i].__pxSize / width;  // equivalent to w*size/total
      this._layout(row[i], x, y, width, height, false); // Set and recurse
      y += height;
    }

    // Return the remaining space
    return new dvt.Rectangle(r.x + width, r.y, r.w - width, r.h);
  }
};
/**
 * Layout class for treemaps.  This layout allocates space across a single dimension for each layer,
 * alternating between horizontal and vertical allocation.  This layout maintains the ordering of
 * the nodes while sacrificing aspect ratio.
 * @param {boolean} isHoriz true if the first layer is laid out horizontally.
 * @class
 * @constructor
 * @extends {DvtTreemapLayoutBase}
 */
var DvtTreemapLayoutSliceAndDice = function(isHoriz) {
  this.Init();
  this._isHoriz = isHoriz;
};

dvt.Obj.createSubclass(DvtTreemapLayoutSliceAndDice, DvtTreemapLayoutBase);


/**
 * @override
 */
DvtTreemapLayoutSliceAndDice.prototype.layout = function(view, root, x, y, width, height, bShowRoot) {
  var isRoot = bShowRoot ? false : true;
  this._layout(this._isHoriz, view, root, x, y, width, height, isRoot);
};


/**
 * Performs layout for the specified node in the tree.
 * @param {boolean} isHoriz true if this layer is laid out horizontally.
 * @param {dvt.Treemap} view The treemap component.
 * @param {DvtTreemapNode} node The root of the tree.
 * @param {number} x The x coordinate for this node.
 * @param {number} y The y coordinate for this node.
 * @param {number} width The width of this node.
 * @param {number} height The height of this node.
 * @param {boolean} isRoot true if this node is the root of the tree.
 * @private
 */
DvtTreemapLayoutSliceAndDice.prototype._layout = function(isHoriz, view, node, x, y, width, height, isRoot) 
{
  var options = view.getOptions();

  // Set the bounds on the current node and get the space available for its children
  var availBounds = this.setNodeBounds(node, x, y, width, height, isRoot);

  // Layout the children
  var children = node.getChildNodes();
  if (children != null) {
    var childX = availBounds.x;
    var childY = availBounds.y;
    // Width and height will be overwritten based on isHoriz
    var childWidth = availBounds.w;
    var childHeight = availBounds.h;

    // Find the total size of the children.  This may not match node.getSize() for
    // hierarchies that vary based on depth.
    var total = 0;
    var i;
    for (i = 0; i < children.length; i++)
      total += children[i].getSize() > 0 ? children[i].getSize() : 0; // ignore negatives, which skew child size calc

    // Sorting
    if (options['sorting'] == 'on') {
      // Copy and sort by decreasing size
      children = children.slice(0);
      children.sort(function(a, b) { return b.getSize() - a.getSize(); });
    }

    // BIDI Support: For horizontal layout, reverse the order of the nodes
    if (isHoriz && dvt.Agent.isRightToLeft(view.getCtx()))
      children = children.slice(0).reverse();

    for (i = 0; i < children.length; i++) {
      var child = children[i];

      // Ignore negative and zero sized nodes
      if (child.getSize() <= 0)
        continue;

      // Calculate the bounds of the child
      var sizeRatio = child.getSize() / total;
      if (isHoriz)
        childWidth = availBounds.w * sizeRatio;
      else
        childHeight = availBounds.h * sizeRatio;

      // Recursively layout the child
      this._layout(!isHoriz, view, child, childX, childY, childWidth, childHeight, false);

      // Update the x and y
      if (isHoriz)
        childX += childWidth;
      else
        childY += childHeight;
    }
  }
};
/*---------------------------------------------------------------------------------*/
/*  DvtTreemapKeyboardHandler     Keyboard handler for Treemap                     */
/*---------------------------------------------------------------------------------*/
/**
  *  @param {dvt.EventManager} manager The owning dvt.EventManager
  *  @class DvtTreemapKeyboardHandler
  *  @extends {dvt.KeyboardHandler}
  *  @constructor
  */
var DvtTreemapKeyboardHandler = function(manager)
{
  this.Init(manager);
};

dvt.Obj.createSubclass(DvtTreemapKeyboardHandler, DvtTreeKeyboardHandler);


/**
 * @override
 */
DvtTreemapKeyboardHandler.prototype.isNavigationEvent = function(event)
{
  var isNavigable = DvtTreemapKeyboardHandler.superclass.isNavigationEvent.call(this, event);

  if (!isNavigable)
  {
    var keyCode = event.keyCode;
    if (keyCode == dvt.KeyboardEvent.OPEN_BRACKET ||
        keyCode == dvt.KeyboardEvent.CLOSE_BRACKET)
      isNavigable = true;
  }

  return isNavigable;
};
/**
 * Event Manager for Treemap.
 * @param {dvt.Treemap} view The treemap to associate with this event manager
 * @param {dvt.Context} context The platform specific context object.
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 * @class
 * @constructor
 */
var DvtTreemapEventManager = function(view, context, callback, callbackObj) {
  DvtTreeEventManager.call(this, view, context, callback, callbackObj);
};

dvt.Obj.createSubclass(DvtTreemapEventManager, DvtTreeEventManager);


/**
 * @override
 */
DvtTreemapEventManager.prototype.ProcessKeyboardEvent = function(event)
{
  var eventConsumed = true;
  var keyCode = event.keyCode;

  if (keyCode == dvt.KeyboardEvent.ENTER && event.ctrlKey)
  {
    // isolate or restore
    var node = this.getFocus();
    if (node.isIsolateEnabled())
    {
      if (node.__isIsolated())
        node.__restoreNode();
      else
        node.__isolateNode();
    }
    dvt.EventManager.consumeEvent(event);
  }
  else
  {
    eventConsumed = DvtTreemapEventManager.superclass.ProcessKeyboardEvent.call(this, event);
  }

  return eventConsumed;
};

DvtTreemapEventManager.prototype.isClearMenuAllowed = function()
{
  return false;
};


dvt.Bundle.addDefaultStrings(dvt.Bundle.TREEMAP_PREFIX, {
  'COLOR': 'Color',
  'ISOLATE': 'Isolate',
  'OTHER': 'Other',
  'RESTORE': 'Restore',
  'SIZE': 'Size'
});
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {DvtTreeDefaults}
 */
var DvtTreemapDefaults = function() {
  this.Init({'skyros': DvtTreemapDefaults.VERSION_1, 'alta': {}});
};

dvt.Obj.createSubclass(DvtTreemapDefaults, DvtTreeDefaults);

/**
 * Defaults for version 1. This component was exposed after the Alta skin, so no earlier defaults are provided.
 */
DvtTreemapDefaults.VERSION_1 = {
  // Note, only attributes that are different than the XML defaults need
  // to be listed here, at least until the XML API is replaced.
  'groupGaps': 'outer',

  'nodeDefaults': {
    'header': {
      'backgroundColor': '#FFFFFF',
      'borderColor': '#d6dfe6',
      'hoverBackgroundColor': '#ebeced',
      'hoverOuterColor': '#ebeced',
      'hoverInnerColor': '#d6d7d8',
      'isolate': 'auto',
      'labelHalign': 'start',
      'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color:#252525;'),
      'selectedBackgroundColor': '#dae9f5',
      'selectedInnerColor': '#FFFFFF',
      'selectedOuterColor': '#000000',
      'useNodeColor': 'off',

      '_hoverLabelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color:#252525;'),
      '_selectedLabelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color:#252525;'),

      '_drillableLabelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color:#145c9e;'),
      '_drillableHoverLabelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color:#145c9e;'),
      '_drillableSelectedLabelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color:#145c9e;')
    },
    'hoverColor': '#ebeced',
    'groupLabelDisplay': 'header',
    'labelDisplay': 'node',
    'labelHalign': 'center',
    'labelValign': 'center',
    'selectedInnerColor': '#FFFFFF',
    'selectedOuterColor': '#000000'
  }
};
/**
 * @constructor
 * Sunburst component.
 * @param {dvt.Context} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @class Sunburst component.
 * @extends {DvtTreeView}
 */
dvt.Sunburst = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

// Make dvt.Sunburst a subclass of DvtTreeView
dvt.Obj.createSubclass(dvt.Sunburst, DvtTreeView);

/** @const @private **/
dvt.Sunburst._ROTATION_SHAPE_RADIUS = 15; // size of additional radius for mouse rotation detection
/** @const @private **/
dvt.Sunburst._ROTATION_SHAPE_RADIUS_TOUCH = 60; // size of additional radius for mouse rotation detection
/** @const @private **/
dvt.Sunburst._ANIMATION_TYPE_FAN = 'fan';
/** @const @private **/
dvt.Sunburst._BACKGROUND_INLINE_DEFAULT = '';

// Layout Constants
/** @const @private **/
dvt.Sunburst._BUFFER_SPACE = 3;
/** @const @private **/
dvt.Sunburst._MIN_BUFFER_SPACE = 2; // Minimum buffer for very small sunbursts


/**
 * Returns a new instance of dvt.Sunburst.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {dvt.Sunburst}
 */
dvt.Sunburst.newInstance = function(context, callback, callbackObj) {
  return new dvt.Sunburst(context, callback, callbackObj);
};

/**
 * @override
 */
dvt.Sunburst.prototype.Init = function(context, callback, callbackObj) {
  dvt.Sunburst.superclass.Init.call(this, context, callback, callbackObj);

  // Create the defaults object
  this.Defaults = new DvtSunburstDefaults();

  // Initialize the angle extent, which may be changed during animation
  this._angleExtent = 2 * Math.PI;
};

/**
 * @override
 */
dvt.Sunburst.prototype.ApplyParsedProperties = function(props) {
  dvt.Sunburst.superclass.ApplyParsedProperties.call(this, props);

  var options = this.getOptions();

  if (dvt.Agent.isPlatformIE()) {
    // -- ie doesn't support cursor image positioning
    this._rotateCursor = 'url(' + options['_resources']['rotateCursor'] + '), auto';
  }
  else
    this._rotateCursor = 'url(' + options['_resources']['rotateCursor'] + ') 8 8, auto';

  // Calculate the start angle.  Use a value from -PI to PI
  this._startAngle = ((360 - options['startAngle']) * DvtSunburstNode.TWO_PI / 360);
  if (this._startAngle > Math.PI)
    this._startAngle -= DvtSunburstNode.TWO_PI;

  // animationOnDisplay: auto defaults to fan
  if (options['animationOnDisplay'] == 'auto')
    options['animationOnDisplay'] = 'fan';
};


/**
 * @override
 */
dvt.Sunburst.prototype.Layout = function(availSpace) {
  // Update available space
  var bufferSpace = Math.max(Math.ceil(dvt.Sunburst._BUFFER_SPACE * Math.min(availSpace.w, availSpace.h) / 400), dvt.Sunburst._MIN_BUFFER_SPACE);
  availSpace.x += bufferSpace;
  availSpace.y += bufferSpace;
  availSpace.w -= 2 * bufferSpace;
  availSpace.h -= 2 * bufferSpace;

  // Layout legend and breadcrumbs
  this.LayoutBreadcrumbs(availSpace);
  this.LayoutLegend(availSpace);

  // Calculate the radius and total depth first
  this._totalRadius = Math.floor(Math.min(availSpace.w, availSpace.h) / 2);

  // Layout the nodes
  if (this._root)
    DvtSunburstLayout.layout(this._totalRadius, this._root, this._startAngle, this._angleExtent, this.getOptions()['sorting']);
};


/**
 * @override
 */
dvt.Sunburst.prototype.Render = function(container, bounds) {
  // Background
  this.RenderBackground(container, dvt.Sunburst._BACKGROUND_INLINE_DEFAULT);

  // Breadcrumbs
  this.RenderBreadcrumbs(container);

  // Legend
  this.RenderLegend(container);

  // Calculate the center of the sunburst
  this._translatePt = new dvt.Point(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);

  // Rotation Support
  if (this.__isRotationEnabled() && this.HasValidData()) {
    var buffer = (dvt.Agent.isTouchDevice()) ? dvt.Sunburst._ROTATION_SHAPE_RADIUS_TOUCH : dvt.Sunburst._ROTATION_SHAPE_RADIUS;
    var rotationShape = new dvt.Circle(this.getCtx(), bounds.x + bounds.w / 2, bounds.y + bounds.h / 2, this._totalRadius + buffer);
    rotationShape.setInvisibleFill();
    rotationShape.setCursor(this._rotateCursor);
    container.addChild(rotationShape);

    // Associate for event handling
    this.getEventManager().associate(rotationShape, new DvtTreePeer(null, DvtSunburstEventManager.ROTATION_ID));
  }

  // Create a node container, which will contain all nodes.
  var nodeContainer = new dvt.Container(this.getCtx());
  // Translate to center, since all nodes are drawn at (0,0)
  nodeContainer.setTranslate(this._translatePt.x, this._translatePt.y);
  container.addChild(nodeContainer);

  if (this.HasValidData()) {
    // Render the nodes. This creates the shape objects, but does not render them yet.
    var nodeLayer = new dvt.Container(this.getCtx());
    nodeContainer.addChild(nodeLayer);
    this._root.render(nodeLayer);
    this.UpdateAriaNavigation(this._root);

    // Create a group for selected nodes
    this._selectedLayer = new dvt.Container(this.getCtx());
    nodeContainer.addChild(this._selectedLayer);

    // Prepare the hover effect
    this._hoverLayer = new dvt.Container(this.getCtx());
    nodeContainer.addChild(this._hoverLayer);
  }
  else {
    // Display the empty text message
    this.RenderEmptyText(container);
  }
};


/**
 * @override
 */
dvt.Sunburst.prototype.CreateEventManager = function(view, context, callback, callbackObj)
{
  return new DvtSunburstEventManager(view, context, callback, callbackObj);
};


/**
 * @override
 */
dvt.Sunburst.prototype.GetDisplayAnimation = function(container, bounds) {
  if (this.getOptions()['animationOnDisplay'] === dvt.Sunburst._ANIMATION_TYPE_FAN && this.HasValidData()) {
    // Set up the initial state
    this._animateAngleExtent(0);

    // Create and return the animation
    var anim = new dvt.CustomAnimation(this.getCtx(), this, this.AnimationDuration);
    anim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.__getAngleExtent, this._animateAngleExtent, 2 * Math.PI);
    return anim;
  }
  else
    return dvt.Sunburst.superclass.GetDisplayAnimation.call(this, container, bounds);
};


/**
 * @override
 */
dvt.Sunburst.prototype.GetDeleteContainer = function() {
  var ret = dvt.Sunburst.superclass.GetDeleteContainer.call(this);
  if (ret) {
    ret.setTranslate(this._translatePt.x, this._translatePt.y);
  }
  return ret;
};


/**
 * Hook for cleaning up animation behavior at the end of the animation.
 * @override
 */
dvt.Sunburst.prototype.OnAnimationEnd = function() {
  // If the animation is complete (and not stopped), then rerender to restore any flourishes hidden during animation.
  if (!this.AnimationStopped) {
    this._container.removeChildren();

    // Finally, re-layout and render the component
    var availSpace = new dvt.Rectangle(0, 0, this.Width, this.Height);
    this.Layout(availSpace);
    this.Render(this._container, availSpace);

    // Reselect the nodes using the selection handler's state
    var selectedNodes = this._selectionHandler ? this._selectionHandler.getSelection() : new Array();
    for (var i = 0; i < selectedNodes.length; i++)
      selectedNodes[i].setSelected(true);
  }

  // : Force full angle extent in case the display animation didn't complete
  if (this._angleExtent < 2 * Math.PI)
    this._animateAngleExtent(2 * Math.PI);

  // Delegate to the superclass to clear common things
  dvt.Sunburst.superclass.OnAnimationEnd.call(this);
};


/**
 * Moves the specified object to the selected layer, above the non-selected objects.
 * @param {dvt.Displayable} displayable The object to be moved.
 */
dvt.Sunburst.prototype.__moveToHoverLayer = function(displayable) {
  // Move the object to the hover layer
  this._hoverLayer.addChild(displayable);
};


/**
 * Moves the specified object to the selected layer, above the non-selected objects.
 * @param {dvt.Displayable} displayable The object to be moved.
 */
dvt.Sunburst.prototype.__moveToSelectedLayer = function(displayable) {
  // Move the object to the selected layer
  this._selectedLayer.addChild(displayable);

  // Also reapply the shadow.  Use a clone since the object is static and may be used elsewhere in the page.
  //  and : Disable shadows in safari and ff due to rendering issues.
  if (!dvt.Agent.isBrowserSafari() && !dvt.Agent.isPlatformGecko()) {
    this._selectedLayer.removeAllDrawEffects();
    this._selectedLayer.addDrawEffect(DvtTreeNode.__NODE_SELECTED_SHADOW);
  }
};


/**
 * Returns the angle extent of the entire sunburst, for use in animating the sunburst.
 * @return {number} angleExtent The angle extent of the entire sunburst.
 */
dvt.Sunburst.prototype.__getAngleExtent = function() {
  return this._angleExtent;
};


/**
 * Animates the angle extent of the sunburst to the specified value.
 * @param {number} extent The new angle extent.
 * @private
 */
dvt.Sunburst.prototype._animateAngleExtent = function(extent) {
  // Steps: Update the field, relayout the sunburst, update the shapes.
  this._angleExtent = extent;

  var bounds = new dvt.Rectangle(0, 0, this.Width, this.Height);
  this.Layout(bounds);
  if (this._root)
    this._root.updateShapes(true);
};


/**
 * Initiates the rotation from the specified coordinates.  This call establishes a rotation
 * anchor which determines the amount of rotation performed.
 * @param {number} mouseX The x coordinate of the rotation anchor.
 * @param {number} mouseY The y coordinate of the rotation anchor.
 */
dvt.Sunburst.prototype.__startRotation = function(mouseX, mouseY) {
  this.__setRotationAnchor(this._calcAngle(mouseX, mouseY));
};


/**
 * Sets the rotation anchor for the Sunburst.
 * @param {number} angle The rotation anchor, in radians
 */
dvt.Sunburst.prototype.__setRotationAnchor = function(angle) {
  // Store the angle at which the rotation started
  this._currentAngle = angle;

  // Apply a mask to show cursor and prevent interaction on nodes
  this._rotationMask = new dvt.Rect(this.getCtx(), 0, 0, this.Width, this.Height);
  this._rotationMask.setInvisibleFill();
  this._rotationMask.setCursor(this._rotateCursor);
  this.addChild(this._rotationMask);

  // Associate for event handling
  this.getEventManager().associate(this._rotationMask, new DvtTreePeer(null, DvtSunburstEventManager.ROTATION_ID));
};


/**
 * Continues the rotation at the specified coordinates.
 * @param {number} mouseX The new x coordinate of the rotation anchor.
 * @param {number} mouseY The new y coordinate of the rotation anchor.
 */
dvt.Sunburst.prototype.__continueRotation = function(mouseX, mouseY) {
  this.__rotate(this._calcAngle(mouseX, mouseY));
};


/**
 * Continues the rotation at the specified angle
 * @param {number} newAngle The new value of the rotation anchor, in radians
 */
dvt.Sunburst.prototype.__rotate = function(newAngle) {
  // Calculate and update the angle of the component
  var change = newAngle - this._currentAngle;
  this._currentAngle = newAngle;
  this._updateStartAngle(change);

  // Fire the intermediate rotation event
  var degrees = 360 - Math.round(this._startAngle * 180 / Math.PI);
  this.dispatchEvent(dvt.EventFactory.newSunburstRotationEvent(degrees, false));
};


/**
 * Completes the rotation.
 */
dvt.Sunburst.prototype.__endRotation = function() {
  // Clear flags
  this._currentAngle = null;

  // Remove the rotation mask
  this.removeChild(this._rotationMask);
  this._rotationMask = null;

  // Fire events to update ADF state, convert to degrees API (reversed from SVG)
  var degrees = 360 - Math.round(this._startAngle * 180 / Math.PI);
  this.dispatchEvent(dvt.EventFactory.newSunburstRotationEvent(degrees, false));
  this.dispatchEvent(dvt.EventFactory.newSunburstRotationEvent(degrees, true));
};


/**
 * Applies the updated disclosure to the node and re-renders.
 * @param {DvtSunburstNode} node The node to expand or collapse.
 * @param {boolean} bDisclosed The new disclosure state of the node's children.
 */
dvt.Sunburst.prototype.__expandCollapseNode = function(node, bDisclosed) {
  // after the expand/collapse completes, set keyboard focus on the node on which
  // the expand or collapse was applied to
  this.__setNavigableIdToFocus(node.getId());

  if (bDisclosed) {
    // Expand: Re-render on the client if the node has definitions for children.
    var nodeOptions = node.getOptions();
    if (nodeOptions['nodes'] && nodeOptions['nodes'].length > 0)
      this.render(this.getOptions());
    this.dispatchEvent(dvt.EventFactory.newSunburstExpandEvent(node.getId()));
  }
  else {
    // Collapse: Collapse is handled within the component by updating the options and
    // re-rendering.  The event is fired to the peer, which will keep track of the
    // state and send a server event if a listener is registered.
    this.render(this.getOptions());
    this.dispatchEvent(dvt.EventFactory.newSunburstCollapseEvent(node.getId()));
  }
};


/**
 * Calculates the angle for the specified coordinates.
 * @param {number} x
 * @param {number} y
 * @return {number} The angle in radians.
 * @private
 */
dvt.Sunburst.prototype._calcAngle = function(x, y) {
  return Math.atan2(y - this._translatePt.y, x - this._translatePt.x);
};


/**
 * Updates the start angle by the specified amount.
 * @param {number} change The change in start angle, in radians.
 * @private
 */
dvt.Sunburst.prototype._updateStartAngle = function(change) {
  // Update start angle and constrain to -PI to PI
  this._startAngle += change;
  if (this._startAngle < -Math.PI)
    this._startAngle += 2 * Math.PI;
  else if (this._startAngle > Math.PI)
    this._startAngle -= 2 * Math.PI;

  // Relayout and update shapes
  var bounds = new dvt.Rectangle(0, 0, this.Width, this.Height);
  this.Layout(bounds);
  if (this._root)
    this._root.updateShapes(true);
};


/**
 * @override
 */
dvt.Sunburst.prototype.__getNodeUnderPoint = function(x, y) {
  return this._root.getNodeUnderPoint(x - this._translatePt.x, y - this._translatePt.y);
};


/**
 * @override
 */
dvt.Sunburst.prototype.__showDropSiteFeedback = function(node) {
  var feedback = dvt.Sunburst.superclass.__showDropSiteFeedback.call(this, node);
  if (feedback) {
    feedback.setTranslate(this._translatePt.x, this._translatePt.y);
  }

  return feedback;
};


/**
 * Returns true if Sunburst rotation is enabled
 * @return {Boolean} true if rotation is enabled, false otherwise
 */
dvt.Sunburst.prototype.__isRotationEnabled = function() 
{
  return this.getOptions()['rotation'] != 'off';
};

/**
 * Returns the displayables to pass to the view switcher for animation.
 * @param {boolean} bOld True if this is the outgoing view.
 * @return {array} The array of displayables.
 */
dvt.Sunburst.prototype.getShapesForViewSwitcher = function(bOld) {
  var shapes = {};
  if (this._root) {
    var arNodes = [this._root];
    while (arNodes.length > 0) {
      var node = arNodes.splice(0, 1)[0];
      var id = node.getId();
      var shape = node.getDisplayable();
      if (id && shape) {
        shapes[id] = shape;
        shapes[id + '_text'] = node._text;

        //flatten hierarchical structure of nodes so that they animate independently
        if (bOld) {
          var parent = shape.getParent();
          if (parent) {
            var childIndex = parent.getChildIndex(shape);
            parent.addChildAt(node._text, childIndex + 1);
          }
        }
      }

      var children = node.getChildNodes();
      if (children) {
        arNodes = arNodes.concat(children);
      }
    }
  }
  return shapes;
};

/**
 * @override
 */
dvt.Sunburst.prototype.GetComponentDescription = function() {
  return dvt.Bundle.getTranslation(this.getOptions(), 'componentName', dvt.Bundle.UTIL_PREFIX, 'SUNBURST');
};

/**
 * @override
 */
dvt.Sunburst.prototype.getBundlePrefix = function() {
  return dvt.Bundle.SUNBURST_PREFIX;
};

/**
 * @override
 */
dvt.Sunburst.prototype.CreateNode = function(nodeOptions) {
  return new DvtSunburstNode(this, nodeOptions);
};
/**
 * Class representing a sunburst node.
 * @param {dvt.Sunburst} sunburst The owning sunburst component.
 * @param {object} props The properties for the node.
 * @class
 * @constructor
 * @extends {DvtTreeNode}
 * @implements {DvtKeyboardNavigable}
 */
var DvtSunburstNode = function(sunburst, props) 
{
  this.Init(sunburst, props);

  var nodeDefaults = this._view.getOptions()['nodeDefaults'];
  this._labelDisplay = props['labelDisplay'] ? props['labelDisplay'] : nodeDefaults['labelDisplay'];
  this._labelHalign = props['labelHalign'] ? props['labelHalign'] : nodeDefaults['labelHalign'];

  this._radius = props['radius'];
};

// Make DvtSunburstNode a subclass of DvtTreeNode
dvt.Obj.createSubclass(DvtSunburstNode, DvtTreeNode);

/**
 * Total buffer for both sizes of the label.
 * @const
 * @private
 */
DvtSunburstNode.TEXT_BUFFER_HORIZ = 6;
/** @private @const */
DvtSunburstNode._EXPAND_ICON_SIZE = 16;
/** @private @const */
DvtSunburstNode._ROOT_NODE_MARGIN = 2;

// Constant for efficiency
DvtSunburstNode.TWO_PI = (Math.PI * 2);

// Relative radius of the center node compared to the other layers
/** @private @const */
DvtSunburstNode._CENTER_ARTIFICIAL_ROOT_RADIUS = 0.25;
/** @private @const */
DvtSunburstNode._CENTER_NODE_RADIUS = 0.5;
/** @private @const */
DvtSunburstNode._CENTER_WITH_CONTENT_RADIUS = 1.0;

/**
 * @override
 */
DvtSunburstNode.prototype.render = function(container) {
  // If not positioned, don't render
  if (!this._hasLayout)
    return;

  // Keep a reference to the container, for use after z-order changes
  this._nodeContainer = container;

  // Create the shape object
  this._shape = this._createShapeNode();
  container.addChild(this._shape);

  var template = this.GetTemplate();

  // render root content facet??
  if (this._showRootContent() && template) {

    var sqrt2 = Math.sqrt(2);
    var aw = this._outerRadius * sqrt2 - 2 * DvtSunburstNode._ROOT_NODE_MARGIN;
    var ah = aw;

    this._x = - this._outerRadius / sqrt2 + DvtSunburstNode._ROOT_NODE_MARGIN;
    this._y = - this._outerRadius / sqrt2 + DvtSunburstNode._ROOT_NODE_MARGIN;

    var elAttrs = this.GetElAttributes();
    var afContext = this.GetAfContext();
    afContext.setELContext(elAttrs);

    if (aw > 0 && ah > 0) {
      afContext.setAvailableWidth(aw);
      afContext.setAvailableHeight(ah);
      afContext.setFontSize(this.GetTextSize());
      //     this._contentRoot = DvtAfComponentFactory.parseAndStamp(afContext, template, this._shape);
      var afRoot = DvtAfComponentFactory.parseAndLayout(afContext, template, this._shape);
      this._contentRoot = afRoot;

      var dims = afRoot.getDimensions();
      afRoot.setTranslate(this._x + (aw - dims.w) / 2, this._y + (ah - dims.h) / 2);
    }
  }
  else {
    // Create the text object
    this._text = this._createTextNode(this._shape);
    if (this._text != null) {
      this._shape.addChild(this._text);

      // For pattern nodes, add a background to make the text readable
      if (this._pattern) {
        var dims = this._text.measureDimensions();
        this._textBackground = new dvt.Rect(this.getView().getCtx(), dims.x, dims.y, dims.w, dims.h);
        this._textBackground.setSolidFill('#FFFFFF');
        this._textBackground.setMouseEnabled(false);
        this._shape.addChild(this._textBackground);

        // Add the transform for rotated text
        var matrix = this._text.getMatrix();
        if (!matrix.isIdentity())
          this._textBackground.setMatrix(matrix);

        // Reorder the text in front of the background rect
        this._shape.addChild(this._text);
      }
    }
  }

  // WAI-ARIA
  this._shape.setAriaRole('img');
  this.UpdateAriaLabel();

  // Create the container for the children and render
  this.renderChildren(container);
};

/**
 * @override
 */
DvtSunburstNode.prototype.setSelected = function(selected) {
  // Delegate to super to store the state
  DvtSunburstNode.superclass.setSelected.call(this, selected);

  // Update the visual feedback
  if (this.isSelected()) {
    // Apply the selection effect to the shape
    this._shape.setSelected(true);

    // Move to the front of the z-order
    this.getView().__moveToSelectedLayer(this._shape);
  }
  else {
    // Restore the regular effect to the shape
    this._shape.setSelected(false);

    // Restore the z-order
    if (this._nodeContainer)
      this._nodeContainer.addChild(this._shape);
  }
};


/**
 * @override
 */
DvtSunburstNode.prototype.showHoverEffect = function() {
  if (!this._shape || !this._hasLayout)
    return;

  // Apply the hover effect
  this._shape.showHoverEffect();

  // Show the hover effect as an overlay
  if (this.isSelected()) {
    // Move to the front of the selected layer
    this.getView().__moveToSelectedLayer(this._shape);
  }
  else {
    // Unselected nodes get moved to the hover layer
    this.getView().__moveToHoverLayer(this._shape);
  }
};


/**
 * @override
 */
DvtSunburstNode.prototype.hideHoverEffect = function() {
  // Don't continue if the shape isn't defined or if the node is currently focused by the keyboard.
  if (!this._shape || !this._hasLayout || this.isShowingKeyboardFocusEffect())
    return;

  // Hide the hover effect
  this._shape.hideHoverEffect();

  // Restore the z-order
  if (!this.isSelected() && this._nodeContainer)
    this._nodeContainer.addChild(this._shape);
};

/**
 * Returns true if expand/collapse is enabled for this node.
 * @return {boolean}
 */
DvtSunburstNode.prototype.isExpandCollapseEnabled = function() {
  return this._drilling == 'insert' || this._drilling == 'insertAndReplace';
};


/**
 * @override
 */
DvtSunburstNode.prototype.getNextNavigable = function(event) 
{
  var keyCode;
  var next;
  var navigables;
  var idx;
  var root;

  if (event.type == dvt.MouseEvent.CLICK)
  {
    return DvtSunburstNode.superclass.getNextNavigable.call(this, event);
  }

  keyCode = event.keyCode;

  if (keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey)
  {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    return this;
  }

  root = this;
  while (root.GetParent())
  {
    root = root.GetParent();
  }

  navigables = this.GetNodesAtDepth(root, this.GetDepth());
  idx = DvtSunburstNode._findNodeIndex(this, navigables);

  var midAngle = this._startAngle + this._angleExtent / 2;
  midAngle = DvtSunburstNode._normalizedRadToDeg(midAngle);

  var lastVisitedChild;
  var lastVisitedMidAngle;

  switch (keyCode)
  {
    case dvt.KeyboardEvent.UP_ARROW:

      // if at root or upper half of sunburst, go to the last visited child if it is in the upper half of the sunburst
      // otherwise use free-form navigation to select the next child in the "up" direction
      if (this === root || midAngle > 180)
      {
        lastVisitedChild = this.GetLastVisitedChild();
        if (lastVisitedChild)
        {
          lastVisitedMidAngle = lastVisitedChild._startAngle + lastVisitedChild._angleExtent / 2;
          lastVisitedMidAngle = DvtSunburstNode._normalizedRadToDeg(lastVisitedMidAngle);
          if (lastVisitedMidAngle > 180)
          {
            return lastVisitedChild;
          }
        }
        next = dvt.KeyboardHandler.getNextAdjacentNavigable(this, event, this.getDescendantNodes());
      }
      // lower half of sunburst
      else
        next = this._navigateToParent();

      break;

    case dvt.KeyboardEvent.DOWN_ARROW:

      // if at root or lower half of sunburst, go to the last visited child if it is in the lower half of the sunburst
      // otherwise use free-form navigation to select the next child in the "down" direction
      if (this === root || (midAngle >= 0 && midAngle <= 180))
      {
        lastVisitedChild = this.GetLastVisitedChild();
        if (lastVisitedChild)
        {
          lastVisitedMidAngle = lastVisitedChild._startAngle + lastVisitedChild._angleExtent / 2;
          lastVisitedMidAngle = DvtSunburstNode._normalizedRadToDeg(lastVisitedMidAngle);
          if (lastVisitedMidAngle >= 0 && lastVisitedMidAngle <= 180)
          {
            return lastVisitedChild;
          }
        }
        next = dvt.KeyboardHandler.getNextAdjacentNavigable(this, event, this.getDescendantNodes());
      }
      // upper half of sunburst
      else
        next = this._navigateToParent();

      break;

    case dvt.KeyboardEvent.LEFT_ARROW:
      if (navigables.length == 1)
      {
        next = this;
      }
      else
      {
        if (idx == 0)
          next = navigables[navigables.length - 1];
        else
          next = navigables[idx - 1];
      }
      break;

    case dvt.KeyboardEvent.RIGHT_ARROW:
      if (navigables.length == 1)
      {
        next = this;
      }
      else
      {
        if (idx == navigables.length - 1)
          next = navigables[0];
        else
          next = navigables[idx + 1];
      }
      break;

    default:
      next = this;
      break;
  }

  next.MarkAsLastVisitedChild();

  return next;
};


/**
 * Returns the parent node and updates last visited child state.
 *
 * @return {DvtSunburstNode} This node's parent, if it is not the root.  Root otherwise
 */
DvtSunburstNode.prototype._navigateToParent = function() 
{
  // move to the parent, if not the root node
  var parent = this.GetParent();
  var next;
  if (parent)
  {
    next = parent;
    // update the grandparent's last visited child to be the current node's parent
    parent.MarkAsLastVisitedChild();
  }
  else
    next = this;

  next.MarkAsLastVisitedChild();
  return next;
};


/**
 * Normalizes an angle to fall between 0 and 360.  0 is the usual 0 degree mark in trigonometry, but angles are
 * measured CLOCKWISE
 *
 * @param {Number} rad
 * @return {Number} The equivalent angle in degrees
 * @private
 */
DvtSunburstNode._normalizedRadToDeg = function(rad)
{
  var deg = dvt.Math.radsToDegrees(rad);
  if (deg < 0)
    deg += 360;
  else if (deg > 360)
    deg -= 360;
  return deg;
};


/**
 * @override
 */
DvtSunburstNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  if (this._shape)
  {
    var bounds = this._shape.getDimensions();
    var point = new dvt.Point(bounds.x, bounds.y);
    point = this._shape.localToStage(point);
    bounds.x = point.x;
    bounds.y = point.y;
    return bounds;
  }
  else
  {
    return new dvt.Rectangle(0, 0, 0, 0);
  }
};

/**
 * @override
 */
DvtSunburstNode.prototype.getTargetElem = function() 
{
  if (this._shape)
    return this._shape.getElem();
  return null;
};


/**
 * @override
 */
DvtSunburstNode.prototype.getContextMenuLocation = function()
{
  // returns the coordinate of the midpoint of the arc, along a radius that is the average of the inner and outer radii
  var point = DvtSunburstNode._calcPointOnArc(0.5 * (this._outerRadius + this._innerRadius), this._startAngle + this._angleExtent / 2);
  return this._shape.localToStage(point);
};

//**************** End Overridden Functions *****************//


/**
 * Sets the result of the layout.
 * @param {number} innerRadius The inner radius of the node.
 * @param {number} outerRadius The outer radius of the node.
 * @param {number} startAngle The starting angle for this node in radians.
 * @param {number} angleExtent The extent of this node in radians.
 */
DvtSunburstNode.prototype.setLayoutParams = function(innerRadius, outerRadius, startAngle, angleExtent) {
  this._innerRadius = innerRadius;
  this._outerRadius = outerRadius;
  this._startAngle = startAngle;
  this._angleExtent = angleExtent;

  // Set a flag indicating layout is done
  this._hasLayout = true;
};


/**
 * @override
 */
DvtSunburstNode.prototype.GetFill = function() {
  if (this.isArtificialRoot())
    return dvt.SolidFill.invisibleFill(); // make it as close to invisible as possible
  else
    return DvtSunburstNode.superclass.GetFill.call(this);
};


/**
 * @param {array} endState Optional argument to compute shortest path from start to end state
 * @override
 */
DvtSunburstNode.prototype.GetAnimationParams = function(endState) {
  var r = dvt.ColorUtils.getRed(this._color);
  var g = dvt.ColorUtils.getGreen(this._color);
  var b = dvt.ColorUtils.getBlue(this._color);

  //  - JS SUNBURST: ROTATION ANIMATION NOT CONSISTENT
  var startAngle = this._startAngle;
  if (endState && !isNaN(endState[2])) {
    var endStartAngle = endState[2];
    if ((endStartAngle - this._startAngle) > Math.PI) {
      startAngle += DvtSunburstNode.TWO_PI;
    } else if ((this._startAngle - endStartAngle) > Math.PI) {
      startAngle -= DvtSunburstNode.TWO_PI;
    }
  }
  return [this._innerRadius, this._outerRadius, startAngle, this._angleExtent, r, g, b];
};


/**
 * @override
 */
DvtSunburstNode.prototype.SetAnimationParams = function(params) {
  // Update the layout params
  this.setLayoutParams(params[0], params[1], params[2], params[3]);

  // Update the color.  Round them since color parts must be ints
  var r = Math.round(params[4]);
  var g = Math.round(params[5]);
  var b = Math.round(params[6]);
  this._color = dvt.ColorUtils.makeRGB(r, g, b);

  // Update the shapes
  this.updateShapes(false);
};


/**
 * @override
 */
DvtSunburstNode.prototype.animateUpdate = function(handler, oldNode) {
  if (oldNode._hasLayout && oldNode._angleExtent > 0) {
    // Old node existed and was visible, show the update animation
    DvtSunburstNode.superclass.animateUpdate.call(this, handler, oldNode);
  }
  else {
    // Old node did not exist or was not visible, treat as insert
    this.animateInsert(handler);
  }
};


/**
 * @override
 */
DvtSunburstNode.prototype.getNodeUnderPoint = function(x, y) {
  // Check if the node contains the coords
  if (this.contains(x, y))
    return this;
  else {
    var childNodes = this.getChildNodes();
    for (var i = 0; i < childNodes.length; i++) {
      var ret = childNodes[i].getNodeUnderPoint(x, y);
      if (ret)
        return ret;
    }
  }

  // No node found, return null
  return null;
};


/**
 * @override
 */
DvtSunburstNode.prototype.contains = function(x, y) {
  var radius = DvtSunburstNode._calcRadius(x, y);
  var angle = DvtSunburstNode._calcAngle(x, y);
  return this.ContainsRadius(radius) && this.ContainsAngle(angle);
};


/**
 * Returns true if this node contains the given angle.
 * @param {number} angle An angle in radius between 0 and 2pi.
 * @protected
 */
DvtSunburstNode.prototype.ContainsAngle = function(angle) {
  // The start and end angles may be from -2pi to 2pi. Adjust angle to check.
  // First adjust angle to be greater than the start angle.
  while (angle < this._startAngle) {
    angle += DvtSunburstNode.TWO_PI;
  }
  // Then adjust to be within 2*PI of it
  while (angle - this._startAngle > DvtSunburstNode.TWO_PI) {
    angle -= DvtSunburstNode.TWO_PI;
  }

  return (angle >= this._startAngle) && (angle <= this._startAngle + this._angleExtent);
};


/**
 * Returns true if this node contains the given radius.
 * @protected
 */
DvtSunburstNode.prototype.ContainsRadius = function(radius) {
  return (radius >= this._innerRadius) && (radius <= this._outerRadius);
};


/**
 * Returns the location of the point on the arc with the specified radius
 * at the specified angle.
 * @private
 */
DvtSunburstNode._calcPointOnArc = function(radius, angle) {
  var x = Math.cos(angle) * radius;
  var y = Math.sin(angle) * radius;
  return {x: x, y: y};
};


/**
 * Returns true if this node contains the given bounding box, used for labels.
 * @param {object} bbox The bounding box to check containment for.
 * @param {DvtSunburstNode} node The sunburst node on which to check containment.
 * @private
 */
DvtSunburstNode._containsRect = function(bbox, node) {
  return (node.contains(bbox.x, bbox.y) && node.contains(bbox.x + bbox.w, bbox.y) &&
          node.contains(bbox.x + bbox.w, bbox.y + bbox.h) && node.contains(bbox.x, bbox.y + bbox.h));
};


/**
 * Returns the angle for a point with the specified coordinates
 * relative to the origin.
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 * @return {number} The angle for the point with the specified coordinates, in radians.
 * @private
 */
DvtSunburstNode._calcAngle = function(x, y) {
  var angle = Math.atan2(y, x);

  // Adjust, since all node angles are between 0 and 2pi
  if (angle < 0)
    angle += DvtSunburstNode.TWO_PI;
  else if (angle > DvtSunburstNode.TWO_PI)
    angle -= DvtSunburstNode.TWO_PI;

  return angle;
};


/**
 * Returns the radius for a point with the specified coordinates
 * relative to the origin.
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 * @return {number} The radius for the point with the specified coordinates.
 * @private
 */
DvtSunburstNode._calcRadius = function(x, y) {
  return Math.sqrt((x * x) + (y * y));
};


/**
 * Creates and return the shape element for this node.
 * @return {dvt.Shape} The shape element for this node.
 * @private
 */
DvtSunburstNode.prototype._createShapeNode = function() {
  // Skip if no angle extent
  if (!this._angleExtent || this._angleExtent <= 0)
    return null;

  // Finally create the shape
  var cmd = this._createPathCmd();
  var shape = new dvt.Path(this.getView().getCtx(), cmd);

  // Add pointers between this node and the shape
  this.getView().getEventManager().associate(shape, this);

  // Apply style properties
  shape.setAlpha(this.getAlpha());
  shape.setFill(this.GetFill());

  // Get the defaults
  var nodeDefaults = this._view.getOptions()['nodeDefaults'];

  // Get node overrides
  var options = this.getOptions();
  var borderColor = options['borderColor'] || nodeDefaults['borderColor'];
  var borderWidth = options['borderWidth'] || nodeDefaults['borderWidth'];

  // Apply the border color, border width, selected, and hover strokes
  shape.setStroke(new dvt.SolidStroke(borderColor, 1, borderWidth));
  shape.setHoverStroke(new dvt.SolidStroke(nodeDefaults['hoverColor'], 1, 3));
  shape.setSelectedStroke(new dvt.SolidStroke(nodeDefaults['selectedInnerColor'], 1, 1.5), new dvt.SolidStroke(nodeDefaults['selectedOuterColor'], 1, 3.5));
  shape.setSelectedHoverStroke(new dvt.SolidStroke(nodeDefaults['hoverColor'], 1, 3));

  // Allows selection cursor to be shown over nodes if nodeSelection is enabled and node is selectable
  shape.setSelectable(this.isSelectable());

  // Artificial Root Support: The artificial root is hollow and mouse transparent
  if (this.isArtificialRoot()) {
    shape.setAlpha(0.001);
    shape.setMouseEnabled(false);
  }

  return shape;
};


/**
 * Calculates and returns the path command for the current node.
 * @return {string} The path command for the current node.
 * @private
 */
DvtSunburstNode.prototype._createPathCmd = function() {
  var cmd;
  var p1, p2, p3, p4;

  if (this._angleExtent < DvtSunburstNode.TWO_PI)
  {
    // Calc the 4 points.  We will draw:
    // 1. Arc from p1 to p2
    // 2. Line/Move from p2 to p3
    // 3. Arc from p3 to p4
    // 4. Line from p4 to p1
    p1 = DvtSunburstNode._calcPointOnArc(this._outerRadius, this._startAngle);
    p2 = DvtSunburstNode._calcPointOnArc(this._outerRadius, this._startAngle + this._angleExtent);
    p3 = DvtSunburstNode._calcPointOnArc(this._innerRadius, this._startAngle + this._angleExtent);
    p4 = DvtSunburstNode._calcPointOnArc(this._innerRadius, this._startAngle);

    // Create the command and feed it into the path
    cmd = dvt.PathUtils.moveTo(p1.x, p1.y) +
          dvt.PathUtils.arcTo(this._outerRadius, this._outerRadius, this._angleExtent, 1, p2.x, p2.y) +
          dvt.PathUtils.lineTo(p3.x, p3.y) +
          dvt.PathUtils.arcTo(this._innerRadius, this._innerRadius, this._angleExtent, 0, p4.x, p4.y) +
          dvt.PathUtils.closePath();
  }
  else
  {
    // To work around a chrome/safari bug, we draw two segments around each of the outer and inner arcs
    p1 = DvtSunburstNode._calcPointOnArc(this._outerRadius, this._startAngle);
    p2 = DvtSunburstNode._calcPointOnArc(this._outerRadius, this._startAngle + this._angleExtent / 2);
    p3 = DvtSunburstNode._calcPointOnArc(this._innerRadius, this._startAngle);
    p4 = DvtSunburstNode._calcPointOnArc(this._innerRadius, this._startAngle + this._angleExtent / 2);

    // Create the command and return it
    cmd = dvt.PathUtils.moveTo(p1.x, p1.y) +
          dvt.PathUtils.arcTo(this._outerRadius, this._outerRadius, this._angleExtent / 2, 1, p2.x, p2.y) +
          dvt.PathUtils.arcTo(this._outerRadius, this._outerRadius, this._angleExtent / 2, 1, p1.x, p1.y);

    // Add the inner segment for a hollow center
    if (this._innerRadius > 0)
      cmd += dvt.PathUtils.moveTo(p4.x, p4.y) +
             dvt.PathUtils.arcTo(this._innerRadius, this._innerRadius, this._angleExtent / 2, 0, p3.x, p3.y) +
             dvt.PathUtils.arcTo(this._innerRadius, this._innerRadius, this._angleExtent / 2, 0, p4.x, p4.y);

    cmd += dvt.PathUtils.closePath();
  }

  return cmd;
};


/**
 * Creates and positions the expand or collapse button button for this node.
 * @param {dvt.Container} container The container for the button.
 * @return {dvt.Button}
 * @private
 */
DvtSunburstNode.prototype._createExpandCollapseButton = function(container) {
  var bDisclosed = this.isDisclosed();
  if (!container || !this.isExpandCollapseEnabled() || (!this.hasChildren() && bDisclosed))
    return null;

  // Create the button and add to the container
  var button = bDisclosed ? this._getCollapseButton() : this._getExpandButton();
  var center = DvtSunburstNode._calcPointOnArc(this._outerRadius, this._startAngle + this._angleExtent / 2);
  button.setTranslate(center.x - DvtSunburstNode._EXPAND_ICON_SIZE / 2, center.y - DvtSunburstNode._EXPAND_ICON_SIZE / 2);
  container.addChild(button);

  // Associate a blank peer so the button is not treated as part of the node
  var tooltip = dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, this.isDisclosed() ? 'COLLAPSE' : 'EXPAND');
  this.getView().getEventManager().associate(button, new DvtTreePeer(this, this.getId(), tooltip));

  return button;
};


/**
 * Creates and return the text element for this node.
 * @param {dvt.Container} container The container element.
 * @return {DvtText} The text element for this node.
 * @private
 */
DvtSunburstNode.prototype._createTextNode = function(container) {
  // If no text or no container to place the text, return
  if (!this._textStr || !container || !this._labelDisplay || this._labelDisplay == 'off')
    return null;

  // : If this is the root node, and the angleExtent is not the full circle, then skip.
  if (this == this.getView().getRootNode() && this._angleExtent < DvtSunburstNode.TWO_PI)
    return null;

  // Determine whether the label is rotated. Rotation is only supported for SVG and XML for now
  var bRotated = false;
  if (this._labelDisplay == 'auto') {
    // If labelDisplay is auto, don't use rotated labels for non-IE on windows, since rotated text does not look good
    // in those browsers.
    if (!dvt.Agent.isPlatformIE() && dvt.Agent.getOS() == dvt.Agent.WINDOWS_OS)
      bRotated = false;
    else
      bRotated = true;
  }
  else if (this._labelDisplay == 'rotated')
    bRotated = true;

  // Don't use rotated labels for the center node or 100% nodes.
  if (bRotated && this._angleExtent < this.getView().__getAngleExtent())
    return this._createTextRotated(container);
  else
    return this._createTextHoriz(container);
};


/**
 * Creates and returns a horizontal text element for this node.
 * @param {dvt.Container} container The container element.
 * @return {DvtText} The text element for this node.
 * @private
 */
DvtSunburstNode.prototype._createTextHoriz = function(container) {
  var textAnchor;
  if (this._innerRadius == 0)
    textAnchor = {x: 0, y: 0};
  else {
    // Calculate the anchor point for the text
    textAnchor = DvtSunburstNode._calcPointOnArc((this._innerRadius + this._outerRadius) / 2, this._startAngle + this._angleExtent / 2);

    // Using the approx width of the text, decide whether the text won't fit
    var approxWidth = 3 * this.GetTextSize() / 2;
    var leftAngle = DvtSunburstNode._calcAngle(textAnchor.x - approxWidth / 2, textAnchor.y);
    var rightAngle = DvtSunburstNode._calcAngle(textAnchor.x + approxWidth / 2, textAnchor.y);
    if (!(this.ContainsAngle(leftAngle) && this.ContainsAngle(rightAngle)))
      textAnchor = null;
  }

  // Now create the text
  if (textAnchor) {
    var text = new dvt.OutputText(this.getView().getCtx(), this._textStr, textAnchor.x, textAnchor.y, null);
    text.setFontSize(this.GetTextSize());
    this.ApplyLabelTextStyle(text);
    text.alignCenter();
    text.alignMiddle();
    text.setMouseEnabled(false);

    // Find the estimated dimensions of the label
    var estimatedDims = dvt.TextUtils.guessTextDimensions(text);

    // Find the largest rectangle that will fit.  The height is accurate, so we only need to check the width.
    var x1 = textAnchor.x;
    var x2 = textAnchor.x;
    var y1 = textAnchor.y - estimatedDims.h / 2;
    var y2 = textAnchor.y + estimatedDims.h / 2;

    // Calculate the left-most x1 that will fit
    var fitX1 = true;
    while (this.contains(x1, y1) && this.contains(x1, y2) && fitX1) {
      x1--;
      if (this._angleExtent > Math.PI && textAnchor.x - x1 >= estimatedDims.w / 2)
        fitX1 = false;
    }

    // Calculate the right-most x2 that will fit
    var fitX2 = true;
    while (this.contains(x2, y1) && this.contains(x2, y2) && fitX2) {
      x2++;
      if (this._angleExtent > Math.PI && x2 - textAnchor.x >= estimatedDims.w / 2)
        fitX2 = false;
    }

    // Add a 3-pixel buffer on each side (accounts for the potential extra pixel in the while loop on failed check)
    x1 += 3;
    x2 -= 3;

    // Adjust the anchor point to the midpoint of available space if truncation would occur centered at current anchor
    var usableSpace = 2 * Math.min(textAnchor.x - x1, x2 - textAnchor.x);
    if (usableSpace < estimatedDims.w) {
      text.setX((x1 + x2) / 2);
      usableSpace = x2 - x1;
    }

    // Truncate and return the text if it fits in the available space
    return dvt.TextUtils.fitText(text, usableSpace, estimatedDims.h, container) ? text : null;
  }
};


/**
 * Creates and returns a rotated text element for this node. Adds the text to the container if it's not empty.
 * @param {dvt.Container} container The container element.
 * @return {DvtText} The text element for this node.
 * @private
 */
DvtSunburstNode.prototype._createTextRotated = function(container) {
  // Note: This function will never get called for 360 degree nodes, so it does not handle them.

  // Calculate the available space for placing text. For text height, we estimate using the inner circumference divided
  // by angle proportion and multiplied by a fudge factor to account for the difference between an arc and straight
  // line. The innerStartCoord is used to provide a buffer for very small inner radii.
  var innerStartCoord = Math.max(this._innerRadius, 10);
  var availWidth = this._outerRadius - innerStartCoord - DvtSunburstNode.TEXT_BUFFER_HORIZ;
  var availHeight = this._angleExtent * (innerStartCoord + DvtSunburstNode.TEXT_BUFFER_HORIZ) * 1.10;

  // Skip remaining calculations if availHeight is too small to reasonably fit text
  if (availHeight <= 6)
    return null;

  // Create the text
  var text = new dvt.OutputText(this.getView().getCtx(), this._textStr, 0, 0);
  text.setFontSize(this.GetTextSize());

  // Set Style Properties
  this.ApplyLabelTextStyle(text);

  // Truncate the text if necessary
  if (!dvt.TextUtils.fitText(text, availWidth, availHeight, container))
    return null;

  // Calculate the anchor point and alignment for the text
  var anchorRadius = (innerStartCoord + this._outerRadius) / 2;
  if (this._labelHalign == 'inner' || this._labelHalign == 'outer') {
    container.addChild(text);
    var actualTextWidth = text.getDimensions().w;
    var textBuffer = DvtSunburstNode.TEXT_BUFFER_HORIZ * 0.75; // Use a slightly greater proportion of the buffer for padding

    if (this._labelHalign == 'inner')
      anchorRadius = innerStartCoord + textBuffer + actualTextWidth / 2;
    else if (this._labelHalign == 'outer')
      anchorRadius = this._outerRadius - textBuffer - actualTextWidth / 2;
  }

  var textAnchor = DvtSunburstNode._calcPointOnArc(anchorRadius, this._startAngle + this._angleExtent / 2);
  text.alignCenter();
  text.alignMiddle();

  // Calc the angle, adjusted to between 0 and 2pi
  var angle = this._startAngle + this._angleExtent / 2;
  angle = (angle >= DvtSunburstNode.TWO_PI) ? angle - DvtSunburstNode.TWO_PI : angle;
  angle = (angle < 0) ? angle + DvtSunburstNode.TWO_PI : angle;

  // If the anchor is on the left half, adjust the rotation for readability
  if (angle > 0.5 * Math.PI && angle < 1.5 * Math.PI)
    angle += Math.PI;

  // Finally rotate and position
  text.setRotation(angle);
  text.setTranslate(textAnchor.x, textAnchor.y);
  text.setMouseEnabled(false);
  return text;
};


/**
 * Returns the index at which the given node can be found in the input array
 * @param {DvtSunburstNode} node
 * @param {Array} nodes
 * @return {Number} The index at which this node is found, or -1 if not found
 * @private
 */
DvtSunburstNode._findNodeIndex = function(node, nodes)
{
  for (var i = 0; i < nodes.length; i++)
  {
    if (node === nodes[i])
      return i;
  }

  return -1;
};


/**
 * Handles a mouse over event on the node.
 */
DvtSunburstNode.prototype.handleMouseOver = function() {
  // Expand/Collapse: draw button if needed
  if (!this._expandButton)
    this._expandButton = this._createExpandCollapseButton(this._shape);

  DvtSunburstNode.superclass.handleMouseOver.call(this);
};


/**
 * Handles a mouse out event on the node.
 */
DvtSunburstNode.prototype.handleMouseOut = function() {
  // Expand/Collapse: hide button if displayed
  if (this._expandButton && this._shape) {
    this._shape.removeChild(this._expandButton);
    this._expandButton = null;
  }

  DvtSunburstNode.superclass.handleMouseOut.call(this);

};


/**
 * Updates the shapes of this node for the current layout params.
 * @param {boolean} bRecurse True if the subtree of this node should also be updated.
 */
DvtSunburstNode.prototype.updateShapes = function(bRecurse) {
  if (!this._shape)
    return;

  // Update Shape
  var cmd = this._createPathCmd();
  this._shape.setCmds(cmd);

  // Update the text.  The current impl just destroys and recreates the text element.
  if (!this._showRootContent()) {
    // Update the text.  The current impl just destroys and recreates the text element.
    if (this._text)
      this._shape.removeChild(this._text);

    this._text = this._createTextNode(this._shape);

    // Remove the text background
    if (this._textBackground) {
      this._shape.removeChild(this._textBackground);
      this._textBackground = null;
    }
  }

  // Update the color
  this._shape.setFill(this.GetFill());

  // Recurse to the children
  if (bRecurse) {
    var children = this.getChildNodes();
    for (var i = 0; i < children.length; i++)
      children[i].updateShapes(true);
  }
};


/**
 * @override
 */
DvtSunburstNode.prototype.getDropSiteFeedback = function() {
  if (this._shape instanceof dvt.Circle)
    return new dvt.Circle(this.getView().getCtx(), this._shape.getCx(), this._shape.getCy(), this._shape.getRadius());
  else if (this._shape instanceof dvt.Path)
    return new dvt.Path(this.getView().getCtx(), this._shape.getCmds());
  else
    return null;
};


/**
 * Returns the expand button.
 * @return {dvt.Displayable}
 * @private
 */
DvtSunburstNode.prototype._getExpandButton = function() {
  var context = this.getView().getCtx();

  // Get the resources from the view
  var resources = this.getView().getOptions()['_resources'];

  // Initialize the button states
  var upState = new dvt.Image(context, resources['expand'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);
  var overState = new dvt.Image(context, resources['expandOver'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);
  var downState = new dvt.Image(context, resources['expandDown'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);

  // Have to add a transparent fill so that IE9 can capture the mouse events ()
  upState.setInvisibleFill();
  overState.setInvisibleFill();
  downState.setInvisibleFill();

  // Create button and hook up click listener
  var button = new dvt.Button(context, upState, overState, downState);
  button.addEvtListener(dvt.MouseEvent.CLICK, this.expandCollapseNode, false, this);
  return button;
};


/**
 * Returns the collapse button.
 * @return {dvt.Displayable}
 * @private
 */
DvtSunburstNode.prototype._getCollapseButton = function() {
  var context = this.getView().getCtx();

  // Get the resources from the view
  var resources = this.getView().getOptions()['_resources'];

  // Initialize the button states
  var upState = new dvt.Image(context, resources['collapse'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);
  var overState = new dvt.Image(context, resources['collapseOver'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);
  var downState = new dvt.Image(context, resources['collapseDown'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);

  // Have to add a transparent fill so that IE9 can capture the mouse events ()
  upState.setInvisibleFill();
  overState.setInvisibleFill();
  downState.setInvisibleFill();

  // Create button and hook up click listener
  var button = new dvt.Button(context, upState, overState, downState);
  button.addEvtListener(dvt.MouseEvent.CLICK, this.expandCollapseNode, false, this);
  return button;
};


/**
 * Isolates this node and maximizes it.
 * @param {
 */
DvtSunburstNode.prototype.expandCollapseNode = function(event) {
  // Flip the disclosure
  this.setDisclosed(!this.isDisclosed());

  // Delegate to the view to handle the event
  this.getView().__expandCollapseNode(this, this.isDisclosed());

  this.UpdateAriaLabel();

  // Stop propagation to prevent selection from changing
  event.stopPropagation();
};

DvtSunburstNode.prototype._showRootContent = function() {
  return (! this._parent) && this._innerRadius == 0 && this._angleExtent == DvtSunburstNode.TWO_PI;
};


/**
 * Returns true if this sunburst node has root content defined.  Note that this does not take into
 * account whether this node is the root or not.
 */
DvtSunburstNode.prototype.hasRootContent = function() {
  return (this.GetTemplate() ? true : false);
};


/**
 * Returns the relative radius of this node.
 * @return {number}
 */
DvtSunburstNode.prototype.__getRadius = function() {
  if (this._radius != null) // radius explicitly specified
    return Number(this._radius);
  else if (!this.GetParent()) {
    // Root Node
    if (this.isArtificialRoot())
      return DvtSunburstNode._CENTER_ARTIFICIAL_ROOT_RADIUS;
    else if (this.hasRootContent())
      return DvtSunburstNode._CENTER_WITH_CONTENT_RADIUS;
    else
      return DvtSunburstNode._CENTER_NODE_RADIUS;
  }
  else
    return 1;
};

/**
 * @override
 */
DvtSunburstNode.prototype.getAriaLabel = function() {
  var options = this.getView().getOptions();

  var states = [];
  if (this.isSelectable())
    states.push(dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  if (this.isExpandCollapseEnabled())
    states.push(dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, this.isDisclosed() ? 'STATE_EXPANDED' : 'STATE_COLLAPSED'));
  if (this.isDrillReplaceEnabled())
    states.push(dvt.Bundle.getTranslation(options, 'stateDrillable', dvt.Bundle.UTIL_PREFIX, 'STATE_DRILLABLE'));

  return dvt.Displayable.generateAriaLabel(this.getShortDesc(), states);
};


/**
 * @override
 */
DvtSunburstNode.prototype.UpdateAriaLabel = function() {
  if (!dvt.Agent.deferAriaCreation() && this._shape) // need the null check bc it may fail in unit test (TreemapSelectionTest)
    this._shape.setAriaProperty('label', this.getAriaLabel());
};


/**
 * @override
 */
DvtSunburstNode.prototype.getDataContext = function() {
  var dataContext = DvtSunburstNode.superclass.getDataContext.call(this);
  dataContext['radius'] = this.__getRadius();
  return dataContext;
};
/**
 * Layout class for sunbursts.
 * @class
 */
var DvtSunburstLayout = new Object();

dvt.Obj.createSubclass(DvtSunburstLayout, dvt.Obj);


/**
 * Performs layout for the sunburst.
 * @param {number} totalRadius The total radius of the sunburst.
 * @param {DvtSunburstNode} root The root of the tree.
 * @param {number} startAngle The starting angle for the sunburst in radians.
 * @param {number} angleExtent The extent of this node in radians.
 * @param {string} sorting "on" if sorting by size is enabled.
 */
DvtSunburstLayout.layout = function(totalRadius, root, startAngle, angleExtent, sorting)
{
  // Calculate the longest branch radius and radius per unit of depth
  var longestRadius = DvtSunburstLayout._calcLargestRadius(root);
  var radiusPerDepth = totalRadius / longestRadius;

  // Layout the nodes
  DvtSunburstLayout._layout(radiusPerDepth, root, startAngle, angleExtent, sorting, 0);
};


/**
 * Performs layout for the specified node in the sunburst.
 * @param {number} radiusPerDepth The radius per depth unit.
 * @param {DvtSunburstNode} node The root of the subtree.
 * @param {number} startAngle The starting angle for this node in radians.
 * @param {number} angleExtent The extent of this node in radians.
 * @param {string} sorting "on" if sorting by size is enabled.
 * @param {number} innerRadius The inner radius of the node to layout.
 */
DvtSunburstLayout._layout = function(radiusPerDepth, node, startAngle, angleExtent, sorting, innerRadius) 
{
  // First layout the node itself
  var outerRadius = innerRadius + node.__getRadius() * radiusPerDepth;
  node.setLayoutParams(innerRadius, outerRadius, startAngle, angleExtent);

  // Layout the children
  var children = node.getChildNodes();
  if (children != null && node.isDisclosed()) {
    var childStartAngle = startAngle;

    // Sorting
    if (sorting == 'on') {
      // Copy and sort by decreasing size
      children = children.slice(0);
      children.sort(function(a, b) { return b.getSize() - a.getSize(); });
    }

    // BIDI Support: For horizontal layout, reverse the order of the nodes
    if (dvt.Agent.isRightToLeft(node.getView().getCtx()))
      children = children.slice(0).reverse();

    // Find the total of the children
    var i;
    var total = 0;
    for (i = 0; i < children.length; i++)
      total += children[i].getSize() > 0 ? children[i].getSize() : 0; // ignore negatives, which skew child size calc

    // Find the size of each child
    for (i = 0; i < children.length; i++) {
      var child = children[i];

      // Ignore negative and zero sized nodes
      if (child.getSize() <= 0)
        continue;

      // Calculate the bounds of the child
      var sizeRatio = child.getSize() / total;
      var childAngleExtent = sizeRatio * angleExtent;

      // Recursively layout the child
      DvtSunburstLayout._layout(radiusPerDepth, child, childStartAngle, childAngleExtent, sorting, outerRadius);

      // Update the start angle
      childStartAngle += childAngleExtent;
    }
  }
};


/**
 * Returns the radius of the tree rooted at the specified node.
 * @param {DvtSunburstNode} node The subtree to find the radius for.
 * @return {number} The maximum radius of the tree.
 * @private
 */
DvtSunburstLayout._calcLargestRadius = function(node) {
  var maxRadius = 0;

  // Search children
  var children = node.getChildNodes();
  if (children && children.length > 0) {
    for (var i = 0; i < children.length; i++) {
      var childRadius = DvtSunburstLayout._calcLargestRadius(children[i]);
      maxRadius = Math.max(maxRadius, childRadius);
    }
    return maxRadius + node.__getRadius();
  }
  else {
    // Use 1 for default if not specified
    return node.__getRadius();
  }
};
/**
 * Event Manager for Sunburst.
 *
 * @param {dvt.Sunburst} view The Sunburst to associate with this event manager
 * @param {dvt.Context} context The platform specific context object.
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 * @class
 * @constructor
 */
var DvtSunburstEventManager = function(view, context, callback, callbackObj) {
  DvtTreeEventManager.call(this, view, context, callback, callbackObj);
};

dvt.Obj.createSubclass(DvtSunburstEventManager, DvtTreeEventManager);

DvtSunburstEventManager.ROTATION_ID = '_rotationShape'; // id used to identify the shape used for rotation


/**
 * @override
 */
DvtSunburstEventManager.prototype.OnMouseDown = function(event) {
  // Rotation Support
  var obj = this.GetLogicalObject(event.target);
  if (obj && obj.getId && obj.getId() == DvtSunburstEventManager.ROTATION_ID && !this._bRotating) {
    this._bRotating = true;

    var relPos = this._context.pageToStageCoords(event.pageX, event.pageY);
    this.GetView().__startRotation(relPos.x, relPos.y);
  }
  else
    DvtSunburstEventManager.superclass.OnMouseDown.call(this, event);
};


/**
 * @override
 */
DvtSunburstEventManager.prototype.OnMouseMove = function(event) {
  if (this._bRotating) {
    var relPos = this._context.pageToStageCoords(event.pageX, event.pageY);
    this.GetView().__continueRotation(relPos.x, relPos.y);
  }
  else
    DvtSunburstEventManager.superclass.OnMouseMove.call(this, event);
};


/**
 * @override
 */
DvtSunburstEventManager.prototype.OnMouseUp = function(event) {
  if (this._bRotating) {
    this._bRotating = false;
    this.GetView().__endRotation();
  }
  else
    DvtSunburstEventManager.superclass.OnMouseUp.call(this, event);
};


/**
 * @override
 */
DvtSunburstEventManager.prototype.ProcessKeyboardEvent = function(event)
{
  var eventConsumed = true;

  var keyCode = event.keyCode;
  var node = this.getFocus(); // the item with current keyboard focus
  var sunburst = this.GetView();

  // expand/collapse
  if (node.isExpandCollapseEnabled() &&
      ((dvt.KeyboardEvent.isPlus(event) && !node.isDisclosed()) ||
      (dvt.KeyboardEvent.isMinus(event) && node.isDisclosed()) ||
      (event.ctrlKey && keyCode == dvt.KeyboardEvent.ENTER)))

  {
    node.expandCollapseNode();
    dvt.EventManager.consumeEvent(event);
  }
  // rotation
  else if (sunburst && sunburst.__isRotationEnabled() &&
          (keyCode == dvt.KeyboardEvent.LEFT_ARROW || keyCode == dvt.KeyboardEvent.RIGHT_ARROW) &&
          !event.ctrlKey && event.altKey && event.shiftKey)
  {
    var newAngle;
    if (keyCode == dvt.KeyboardEvent.LEFT_ARROW)
      newAngle = -5 * (Math.PI / 180);
    else
      newAngle = 5 * (Math.PI / 180);

    sunburst.__setRotationAnchor(0);
    sunburst.__rotate(newAngle);
    sunburst.__endRotation();
    dvt.EventManager.consumeEvent(event);
  }
  else
  {
    eventConsumed = DvtSunburstEventManager.superclass.ProcessKeyboardEvent.call(this, event);
  }

  return eventConsumed;
};

DvtSunburstEventManager.ROTATE_KEY = 'rotateKey';

DvtSunburstEventManager.prototype.HandleImmediateTouchStartInternal = function(event) {
  var obj = this.GetLogicalObject(event.target);
  if (obj && obj.getId && obj.getId() == DvtSunburstEventManager.ROTATION_ID) {
    this.TouchManager.processAssociatedTouchAttempt(event, DvtSunburstEventManager.ROTATE_KEY, this.RotateStartTouch, this);
  }
};

DvtSunburstEventManager.prototype.HandleImmediateTouchMoveInternal = function(event) {
  this.TouchManager.processAssociatedTouchMove(event, DvtSunburstEventManager.ROTATE_KEY);
};

DvtSunburstEventManager.prototype.HandleImmediateTouchEndInternal = function(event) {
  this.TouchManager.processAssociatedTouchEnd(event, DvtSunburstEventManager.ROTATE_KEY);
};


DvtSunburstEventManager.prototype.RotateStartTouch = function(event, touch) {
  var touchIds = this.TouchManager.getTouchIdsForObj(DvtSunburstEventManager.ROTATE_KEY);
  if (touchIds.length <= 1) {
    this.TouchManager.saveProcessedTouch(touch.identifier, DvtSunburstEventManager.ROTATE_KEY, null, DvtSunburstEventManager.ROTATE_KEY, DvtSunburstEventManager.ROTATE_KEY, this.RotateMoveTouch, this.RotateEndTouch, this);
    this.TouchManager.setTooltipEnabled(touch.identifier, false);
    var pos = this._context.pageToStageCoords(touch.pageX, touch.pageY);
    this.GetView().__startRotation(pos.x, pos.y);
    event.blockTouchHold();
  }
};

DvtSunburstEventManager.prototype.RotateMoveTouch = function(event, touch) {
  var pos = this._context.pageToStageCoords(touch.pageX, touch.pageY);
  this.GetView().__continueRotation(pos.x, pos.y);
  event.preventDefault();
};

DvtSunburstEventManager.prototype.RotateEndTouch = function(event, touch) {
  this.GetView().__endRotation();
};


dvt.Bundle.addDefaultStrings(dvt.Bundle.SUNBURST_PREFIX, {
  'COLOR': 'Color',
  'OTHER': 'Other',
  'SIZE': 'Size'
});
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {DvtTreeDefaults}
 */
var DvtSunburstDefaults = function() {
  this.Init({'skyros': DvtSunburstDefaults.VERSION_1, 'alta': {}});
};

dvt.Obj.createSubclass(DvtSunburstDefaults, DvtTreeDefaults);

/**
 * Defaults for version 1. This component was exposed after the Alta skin, so no earlier defaults are provided.
 */
DvtSunburstDefaults.VERSION_1 = {
  // Note, only attributes that are different than the XML defaults need
  // to be listed here, at least until the XML API is replaced.

  'nodeDefaults': {
    'borderColor': 'rgba(255,255,255,0.3)',
    'borderWidth': 1,
    'hoverColor': '#FFFFFF',
    'labelDisplay': 'auto',
    'labelHalign': 'center',
    'selectedInnerColor': '#FFFFFF',
    'selectedOuterColor': '#000000'
  },

  'rotation': 'on',
  'startAngle': 90
};
dvt.exportProperty(dvt, 'Sunburst', dvt.Sunburst);
dvt.exportProperty(dvt, 'Treemap', dvt.Treemap);
dvt.exportProperty(dvt.Treemap, 'newInstance', dvt.Treemap.newInstance);
dvt.exportProperty(dvt.Sunburst, 'newInstance', dvt.Sunburst.newInstance);

dvt.exportProperty(DvtTreeView.prototype, 'getAutomation', DvtTreeView.prototype.getAutomation);
dvt.exportProperty(DvtTreeView.prototype, 'destroy', DvtTreeView.prototype.destroy);
dvt.exportProperty(DvtTreeView.prototype, 'highlight', DvtTreeView.prototype.highlight);
dvt.exportProperty(DvtTreeView.prototype, 'render', DvtTreeView.prototype.render);
dvt.exportProperty(DvtTreeView.prototype, 'select', DvtTreeView.prototype.select);

dvt.exportProperty(DvtTreeAutomation.prototype, 'getDomElementForSubId', DvtTreeAutomation.prototype.getDomElementForSubId);
dvt.exportProperty(DvtTreeAutomation.prototype, 'getNode', DvtTreeAutomation.prototype.getNode);
})(dvt);

  return dvt;
});
