/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit', './DvtBaseTreeView'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

  // Map the D namespace to dvt, which is used to provide access across partitions.
  var D = dvt;
  
/**
 * @constructor
 * Treemap component.
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @class Treemap component.
 * @extends {DvtBaseTreeView}
 * @export
 */
var DvtTreemap = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

// Make DvtTreemap a subclass of DvtBaseTreeView
DvtObj.createSubclass(DvtTreemap, DvtBaseTreeView, 'DvtTreemap');

/** @const @private **/
DvtTreemap._BUFFER_SPACE = 7; // This is in addition to gap between groups

/** @const @private **/
DvtTreemap._MIN_BUFFER_SPACE = 1; // Minimum buffer for very small treemaps

/** @const @private **/
DvtTreemap._BACKGROUND_FILL_COLOR = '#EBEFF5';

/** @const @private **/
DvtTreemap._BACKGROUND_BORDER_COLOR = '#DBE0EA';

/** @const @private **/
DvtTreemap._BACKGROUND_INLINE_DEFAULT = 'background-color:' + DvtTreemap._BACKGROUND_FILL_COLOR + ';' +
    'border-color:' + DvtTreemap._BACKGROUND_BORDER_COLOR + ';' +
    'border-width:2px';

/**
 * Returns a new instance of DvtTreemap.
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {DvtTreemap}
 * @export
 */
DvtTreemap.newInstance = function(context, callback, callbackObj) {
  return new DvtTreemap(context, callback, callbackObj);
};

/**
 * @override
 */
DvtTreemap.prototype.Init = function(context, callback, callbackObj) {
  DvtTreemap.superclass.Init.call(this, context, callback, callbackObj);

  // Create the defaults object
  this.Defaults = new DvtTreemapDefaults();

  // Make sure the object has an id for accessibility 
  this.setId('treemap' + 1000 + Math.floor(Math.random() * 1000000000));//@RandomNumberOk
};

/**
 * @override
 */
DvtTreemap.prototype.ApplyParsedProperties = function(props) {
  DvtTreemap.superclass.ApplyParsedProperties.call(this, props);

  var options = this.getOptions();

  // Layout
  if (options['layout'] == 'sliceAndDiceHorizontal')
    this._layout = new DvtSliceAndDiceLayout(true);
  else if (options['layout'] == 'sliceAndDiceVertical')
    this._layout = new DvtSliceAndDiceLayout(false);
  else
    this._layout = new DvtSquarifyingLayout();

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
DvtTreemap.prototype.Layout = function(availSpace) {
  var options = this.getOptions();

  // Allocate buffer space for the container. The minimum buffer is used for JET, where no default border is shown.
  var bufferSpace = options['_environment'] != 'jet' ? DvtTreemap._BUFFER_SPACE : DvtTreemap._MIN_BUFFER_SPACE;
  bufferSpace = Math.max(Math.ceil(bufferSpace * Math.min(availSpace.w, availSpace.h) / 400), DvtTreemap._MIN_BUFFER_SPACE);
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
DvtTreemap.prototype.Render = function(container, bounds) {
  // Background
  this.RenderBackground(container, DvtTreemap._BACKGROUND_INLINE_DEFAULT);

  // Breadcrumbs
  this.RenderBreadcrumbs(container);

  // Legend
  this.RenderLegend(container);

  // Node or Empty Text
  if (this.HasValidData()) {
    // Layer for group text displayed on node.  Will be reordered after the selected layer
    this._groupTextLayer = new DvtContainer(this.getCtx());
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
    this._isolatedLayer = new DvtContainer(this.getCtx());
    container.addChild(this._isolatedLayer);

    // Create a group for selected nodes
    this._selectedLayer = new DvtContainer(this.getCtx());
    container.addChild(this._selectedLayer);

    // Reorder group text after selected layer
    container.addChild(this._groupTextLayer);

    // Prepare the hover effect
    this._hoverEffect = new DvtPolyline(this.getCtx(), new Array());
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
DvtTreemap.prototype.OnAnimationEnd = function() {
  // Before the animation, the treemap nodes will remove their bevels and selection
  // effects.  If the animation is complete (and not stopped), then rerender to restore.
  if (!this.AnimationStopped) {
    this._container.removeChildren();

    // Finally, re-layout and render the component
    var availSpace = new DvtRectangle(0, 0, this.Width, this.Height);
    this.Layout(availSpace);
    this.Render(this._container);

    // Reselect the nodes using the selection handler's state
    this.ReselectNodes();
  }

  // Delegate to the superclass to clear common things
  DvtTreemap.superclass.OnAnimationEnd.call(this);
};

/**
 * Reselects the selected nodes after a re-render.
 * @protected
 */
DvtTreemap.prototype.ReselectNodes = function() {
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
DvtTreemap.prototype.CreateKeyboardHandler = function(manager)
{
  return new DvtTreemapKeyboardHandler(manager);
};

/**
 * @override
 */
DvtTreemap.prototype.CreateEventManager = function(view, context, callback, callbackObj)
{
  return new DvtTreemapEventManager(view, context, callback, callbackObj);
};

/**
 * @override
 */
DvtTreemap.prototype.GetInitialFocusedItem = function(root)
{
  var isolatedRootNode = this.__getLastIsolatedNode();

  if (isolatedRootNode)
    return this.__getDefaultNavigable(DvtBaseTreeUtils.getLeafNodes(isolatedRootNode));
  else if (root)
    return this.__getDefaultNavigable(DvtBaseTreeUtils.getLeafNodes(root));
  else
    return null;
};

/**
 * Updates the hover effect to display the specified stroke along the specified points.
 * @param {array} points The array of points defining the polyline.
 * @param {DvtStroke} stroke The stroke definition.
 * @param {DvtTreemapNode} node The treemap node that this hover effect will belong to.
 */
DvtTreemap.prototype.__showHoverEffect = function(points, stroke, node) {
  this._hoverEffect.setPoints(points);
  this._hoverEffect.setStroke(stroke);
  this._hoverEffect.setVisible(true);
};

/**
 * Hides the hover effect.
 */
DvtTreemap.prototype.__hideHoverEffect = function() {
  this._hoverEffect.setVisible(false);
};

/**
 * Returns the layer for rendering group text displayed on nodes.  This layer is above the selected
 * layer, so that selected nodes will node obscure it.
 * @return {DvtContainer}
 */
DvtTreemap.prototype.__getGroupTextLayer = function() {
  return this._groupTextLayer;
};

/**
 * Moves the specified object to the selected layer, above the non-selected objects.
 * @param {DvtRect} rect The object to be moved.
 */
DvtTreemap.prototype.__moveToSelectedLayer = function(rect) {
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
DvtTreemap.prototype.__getNodeUnderPoint = function(x, y) {
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
 * @param {DvtBaseTreeNode} node The node to isolate.
 */
DvtTreemap.prototype.__isolate = function(node) {
  var currentNavigable = this.getEventManager().getFocus();
  if (currentNavigable)
    currentNavigable.hideKeyboardFocusEffect();

  // Keep track of the isolated node
  this._isolatedNodes.push(node);
  this.getOptions()['isolatedNode'] = node.getId();

  // Update state
  this.dispatchEvent(new DvtTreemapIsolateEvent(node.getId()));

  // Layout the isolated node and its children
  this._isolateRestoreLayout = true;
  this.Layout(new DvtRectangle(0, 0, this.Width, this.Height));
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
DvtTreemap.prototype.__restore = function() {
  var restoreNode = this._isolatedNodes.pop();

  // Update the options state
  this.getOptions()['isolatedNode'] = (this._isolatedNodes.length > 0) ? this._isolatedNodes[this._isolatedNodes.length - 1].getId() : null;

  var currentNavigable = this.getEventManager().getFocus();
  if (currentNavigable)
    currentNavigable.hideKeyboardFocusEffect();

  // after we restore the full tree, set keyboard focus on the node that was previously isolated
  this.__setNavigableIdToFocus(restoreNode.getId());

  // Update state
  this.dispatchEvent(new DvtTreemapIsolateEvent());

  // Layout the isolated node and its children
  this._isolateRestoreLayout = true;
  this.Layout(new DvtRectangle(0, 0, this.Width, this.Height));
  this._isolateRestoreLayout = false;

  // Render the changes
  this._renderIsolateRestore(restoreNode);
};

/**
 * Returns the currently isolated node, or null if no node is isolated
 *
 * @return {DvtTreemapNode}
 */
DvtTreemap.prototype.__getLastIsolatedNode = function()
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
DvtTreemap.prototype._renderIsolateRestore = function(node) {
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
    this.Animation = new DvtParallelPlayable(this.getCtx(), playables);
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
DvtTreemap.prototype._processInitialIsolate = function(isolateRowKey) {
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
DvtTreemap.prototype.__getDefaultNavigable = function(navigableItems)
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
DvtTreemap.prototype.getShapesForViewSwitcher = function(bOld) {
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
DvtTreemap.prototype.GetComponentDescription = function() {
  return DvtBundle.getTranslation(this.getOptions(), 'componentName', DvtBundle.UTIL_PREFIX, 'TREEMAP');
};

/**
 * @override
 */
DvtTreemap.prototype.getBundlePrefix = function() {
  return DvtBundle.TREEMAP_PREFIX;
};

/**
 * @override
 */
DvtTreemap.prototype.CreateNode = function(nodeOptions) {
  return new DvtTreemapNode(this, nodeOptions);
};
/**
 * Class representing a treemap node.
 * @param {DvtTreemap} treemap The owning treemap component.
 * @param {object} props The properties for the node.
 * @class
 * @constructor
 * @extends {DvtBaseTreeNode}
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
  this._headerLabelStyle = headerOptions['labelStyle'] ? new DvtCSSStyle(headerOptions['labelStyle']) : null;
  this._bHeaderUseNodeColor = (headerOptions['useNodeColor'] ? headerOptions['useNodeColor'] : headerDefaults['useNodeColor']) == 'on';

  // Isolate Support
  this._isolate = headerOptions['isolate'] ? headerOptions['isolate'] : headerDefaults['isolate'];
  if (this._isolate == 'auto')
    this._isolate = DvtAgent.isTouchDevice() ? 'off' : 'on';

  // TODO  Switch to determining dynamically, which involves changing how isolate/restore is handled
  this._bIsolated = (options['isolatedNode'] != null && options['isolatedNode'] == this.getId());
};

// Make DvtTreemapNode a subclass of DvtBaseTreeNode
DvtObj.createSubclass(DvtTreemapNode, DvtBaseTreeNode, 'DvtTreemapNode');

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
    this._childNodeGroup = new DvtContainer(this.getView().getCtx());
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
      if (DvtAgent.isRightToLeft(container.getCtx())) {
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
        this._textBackground = new DvtRect(this.getView().getCtx(), dims.x, dims.y, dims.w, dims.h);
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
    if (DvtAgent.isPlatformWebkit())
      y -= DvtTreemapNode._LINE_FUDGE_FACTOR;

    // Clear the selection inner and outer, which may be used by hover
    this._removeChildShape(this._selectionOuter);
    this._removeChildShape(this._selectionInner);
    this._selectionOuter = null;
    this._selectionInner = null;

    // Create the shapes, the fill will be set based on node type
    this._selectionOuter = new DvtRect(this.getView().getCtx(), x, y, w, h);
    this._selectionOuter.setMouseEnabled(false);
    this._selectionOuter.setFill(null);
    this._selectionOuter.setPixelHinting(true);
    this._shape.addChild(this._selectionOuter);

    this._selectionInner = new DvtRect(this.getView().getCtx(), x + 1, y + 1, w - 2, h - 2);
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

      if (DvtAgent.isTouchDevice())
        this._isolateButton = this._createIsolateRestoreButton(this._shape);
    }
    else {
      // Apply the right LAF
      this._selectionOuter.setSolidStroke(nodeDefaults['selectedOuterColor']);
      this._selectionInner.setSolidStroke(nodeDefaults['selectedInnerColor']);

      // Also apply the shadow.  Use a clone since the object is static and may be used elsewhere in the page.
      //  and : Disable shadows in safari and ff due to rendering issues.
      if (!DvtAgent.isBrowserSafari() && !DvtAgent.isPlatformGecko()) {
        this._shape.addDrawEffect(DvtBaseTreeNode.__NODE_SELECTED_SHADOW);
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
    if (DvtAgent.isTouchDevice())
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
      if (DvtAgent.isPlatformWebkit())
        y -= DvtTreemapNode._LINE_FUDGE_FACTOR;

      this._selectionOuter = new DvtRect(this.getView().getCtx(), x, y, w, h);
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
    stroke = new DvtSolidStroke(nodeHeaderDefaults['hoverInnerColor'], DvtTreemapNode.GROUP_HOVER_INNER_OPACITY, DvtTreemapNode.GROUP_HOVER_INNER_WIDTH);

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

    stroke = new DvtSolidStroke(nodeDefaults['hoverColor'], DvtTreemapNode.NODE_HOVER_OPACITY, DvtTreemapNode.NODE_SELECTION_WIDTH);
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
  return new DvtRectangle(this._x, this._y, this._width, this._height);
};

/**
 * @override
 */
DvtTreemapNode.prototype.getNextNavigable = function(event) {
  var keyCode;
  var parent;
  var lastChild;
  var next;

  if (event.type == DvtMouseEvent.CLICK) {
    return DvtTreemapNode.superclass.getNextNavigable.call(this, event);
  }

  keyCode = event.keyCode;

  if (keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey) {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    return this;
  }

  // if alt held, or a bracket, move focus up or down one level in tree
  if ((keyCode == DvtKeyboardEvent.UP_ARROW && event.altKey) || keyCode == DvtKeyboardEvent.CLOSE_BRACKET) {
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
  else if ((keyCode == DvtKeyboardEvent.DOWN_ARROW && event.altKey) || keyCode == DvtKeyboardEvent.OPEN_BRACKET) {
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
    next = DvtKeyboardHandler.getNextNavigable(this, event, navigables);
  }

  next.MarkAsLastVisitedChild();

  return next;
};

/**
 * @override
 */
DvtTreemapNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) {
  return new DvtRectangle(this._x, this._y, this._width, this._height);
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
 * @return {DvtRectangle} the rectangle indicating the area to allocate to children, if different than inputs
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
    var text = new DvtOutputText(this.getView().getCtx(), this._textStr);
    text.setFontSize(this.GetTextSize());
    this.ApplyHeaderTextStyle(text, 'labelStyle');
    var headerLabelHeight = DvtTextUtils.guessTextDimensions(text).h;
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
      return new DvtRectangle(xx, yy, ww, hh);
    else
      this._textStyle = null;// Not enough space, don't show header
  }

  return new DvtRectangle(this._x, this._y, this._width, this._height);
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
  var r = DvtColorUtils.getRed(this._color);
  var g = DvtColorUtils.getGreen(this._color);
  var b = DvtColorUtils.getBlue(this._color);

  // Force bevel removal during animation for leaf nodes by passing an additional random number to force animation.
  return [this._x, this._y, this._width, this._height, r, g, b, this.hasChildren() ? 0 : Math.random()];//Random Number used to force animation @RandomNumberReview
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
  this._color = DvtColorUtils.makeRGB(r, g, b);

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
 * @return {DvtPlayable}
 */
DvtTreemapNode.prototype._getIsolateAnimation = function() {
  if (this._oldState) {
    // Create the playable to animate to the new layout state
    var playable = new DvtCustomAnimation(this.getView().getCtx(), this, DvtTreemapNode._ANIMATION_ISOLATE_DURATION);
    playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER_ARRAY, this, this.GetAnimationParams, this.SetAnimationParams, this.GetAnimationParams());

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
 * @return {DvtShape} The shape object for this node
 * @private
 */
DvtTreemapNode.prototype._createShapeNode = function() {
  var context = this.getView().getCtx();

  // Create the basic shape with geometry
  var shape;
  if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER) {
    // Create the header, which is made of an outer shape for the border and an inner shape for the fill
    shape = new DvtRect(context, this._x, this._y, this._width, this._height);
    this._innerShape = new DvtRect(context, this._x + 1, this._y + 1, this._width - 2, this._height - 2);

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
    shape = new DvtRect(context, this._x, this._y, this._width, this._height);

    // Create the bevel effect for the node: Disabled on phones/tablets for 1000+ nodes for performance reasons.
    var bVisualEffects = this.getView().__getNodeCount() < 1000 || !DvtAgent.isTouchDevice();
    if (bVisualEffects && this._width >= DvtTreemapNode.MIN_SIZE_FOR_BORDER && this._height >= DvtTreemapNode.MIN_SIZE_FOR_BORDER) {
      // Figure out the stroke colors
      var topLeft = new DvtSolidStroke(DvtTreemapNode.DEFAULT_NODE_TOP_BORDER_COLOR);
      var bottomRight = new DvtSolidStroke(DvtTreemapNode.DEFAULT_NODE_BOTTOM_BORDER_COLOR, DvtTreemapNode.DEFAULT_NODE_BORDER_OPACITY);
      if (this._pattern) {
        topLeft = new DvtSolidStroke(this._color, DvtTreemapNode.DEFAULT_NODE_PATTERN_BORDER_OPACITY);
        bottomRight = topLeft;
      }

      // Retrieve the bevel colors and blend with the fill color to get the desired effect
      var fillColor = this.getColor();
      var topLeftColor = DvtColorUtils.interpolateColor(DvtTreemapNode.DEFAULT_NODE_TOP_BORDER_COLOR, fillColor, 1 - DvtTreemapNode.DEFAULT_NODE_BORDER_OPACITY);
      var bottomRightColor = DvtColorUtils.interpolateColor(DvtTreemapNode.DEFAULT_NODE_BOTTOM_BORDER_COLOR, fillColor, 1 - DvtTreemapNode.DEFAULT_NODE_BORDER_OPACITY);

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
        this._topLeftShape = new DvtRect(context, this._x, this._y, this._width - 1, this._height - 1);
        this._topLeftShape.setSolidFill(topLeftColor);
        this._topLeftShape.setMouseEnabled(false);
        shape.addChild(this._topLeftShape);

        // fillShape exposes both bevels
        this._fillShape = new DvtRect(context, this._x + 1, this._y + 1, this._width - 2, this._height - 2);
        this._fillShape.setFill(fill);
        this._fillShape.setMouseEnabled(false);
        shape.addChild(this._fillShape);
      }
      else if (minDim >= 2) {
        // Bottom Right Bevel
        // shape is the bottomRight bevel in this case
        shape.setSolidFill(bottomRightColor);

        // fillShape exposes the bevel
        this._fillShape = new DvtRect(context, this._x, this._y, this._width - 1, this._height - 1);
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
 * @param {DvtContainer} container The container for the button.
 * @return {DvtButton}
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
    if (DvtAgent.isRightToLeft(container.getCtx()))
      transX = x1 + DvtTreemapNode._ISOLATE_GAP_SIZE;
    else
      transX = x2 - DvtTreemapNode._ISOLATE_ICON_SIZE - DvtTreemapNode._ISOLATE_GAP_SIZE;
    button.setTranslate(transX, (y2 + y1 - DvtTreemapNode._ISOLATE_ICON_SIZE) / 2);
    container.addChild(button);

    // Add a buffer to make the objects easier to interact with on touch devices
    if (DvtAgent.isTouchDevice()) {
      var rect = new DvtRect(container.getCtx(), - DvtTreemapNode._ISOLATE_TOUCH_BUFFER, - DvtTreemapNode._ISOLATE_TOUCH_BUFFER, DvtTreemapNode._ISOLATE_ICON_SIZE + 2 * DvtTreemapNode._ISOLATE_TOUCH_BUFFER, DvtTreemapNode._ISOLATE_ICON_SIZE + 2 * DvtTreemapNode._ISOLATE_TOUCH_BUFFER);
      rect.setInvisibleFill();
      button.addChild(rect);
    }

    // For Alta, associate the node so the hover effect doesn't get removed.
    if (DvtCSSStyle.afterSkinAlta(this.getView().getOptions()['skin']))
      this.getView().getEventManager().associate(button, this);
    else {
      // Associate a blank peer so the button is not treated as part of the node
      var tooltip = DvtBundle.getTranslation(this.getView().getOptions(), this.__isIsolated() ? 'tooltipRestore' : 'tooltipIsolate', DvtBundle.TREEMAP_PREFIX, this.__isIsolated() ? 'RESTORE' : 'ISOLATE');
      this.getView().getEventManager().associate(button, new DvtBaseTreePeer(this, this.getId(), tooltip));
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
 * @param {DvtContainer} container The container to render in.
 * @return {DvtText} The text object for this node.
 * @private
 */
DvtTreemapNode.prototype._createTextNode = function(container) {
  var isRTL = DvtAgent.isRightToLeft(container.getCtx());

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
  var text = new DvtOutputText(this.getView().getCtx(), this._textStr);
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
    var textHeight = DvtTextUtils.getTextHeight(text);

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
    var chromeAdjustment = DvtAgent.isPlatformWebkit() ? DvtTreemapNode._LINE_FUDGE_FACTOR : 0;
    text.setY(this._y + DvtTreemapNode.DEFAULT_HEADER_BORDER_WIDTH + this._titleBarHeight / 2 + chromeAdjustment);
    text.alignMiddle();
    this.ApplyHeaderTextStyle(text, 'labelStyle');
  }

  if (text != null) {
    if (this._textStyle == DvtTreemapNode.TEXT_STYLE_HEADER && this.isDrillReplaceEnabled()) {
      // Drillable text link
      this.ApplyHeaderTextStyle(text, '_drillableLabelStyle');
      text.setCursor('pointer');

      // Associate with a DvtBaseTreePeer to handle drilling
      var peer = new DvtBaseTreePeer(this, this.getId(), null, this.getDatatip(), this.getDatatipColor());
      peer.setDrillable(true);
      this.getView().getEventManager().associate(text, peer);
    }
    else // Parent node will handle all events
      text.setMouseEnabled(false);

    // Truncate the text if necessary
    return DvtTextUtils.fitText(text, availWidth, availHeight, container) ? text : null;
  }
};

/**
 * Applies style to a header node.
 * @param {DvtShape} shape The outer shape for the header, used for the border
 * @param {DvtShape} innerShape The inner shape for the header, use for the fill
 */
DvtTreemapNode.prototype.ApplyHeaderStyle = function(shape, innerShape) {
  var nodeHeaderDefaults = this.getView().getOptions()['nodeDefaults']['header'];
  if (this._bHeaderUseNodeColor) {
    var fillColor = this.getColor();
    innerShape.setSolidFill(fillColor);
    var borderColor = DvtColorUtils.interpolateColor(nodeHeaderDefaults['borderColor'], fillColor, 1 - DvtTreemapNode.DEFAULT_HEADER_WITH_NODE_COLOR_ALPHA);
    shape.setSolidFill(borderColor);
  }
  else {
    shape.setSolidFill(nodeHeaderDefaults['borderColor']);
    innerShape.setSolidFill(nodeHeaderDefaults['backgroundColor']);
  }
};

/**
 * Applies the specified header style to the node header text.
 * @param {DvtOutputText} text The node header text instance.
 * @param {string} styleType The style to use from the node header defaults.
 */
DvtTreemapNode.prototype.ApplyHeaderTextStyle = function(text, styleType) {
  var textStyle = [];

  // Top Level Header is Bold
  if (this.GetDepth() <= 1)
    textStyle.push(new DvtCSSStyle('font-weight:bold;'));

  // Header Default Style
  textStyle.push(this.getView().getOptions()['nodeDefaults']['header'][styleType]);

  // Header UseNodeColor for Non-Hover/Selected Labels
  if (this._bHeaderUseNodeColor && (styleType == 'labelStyle' || styleType == '_drillableLabelStyle'))
    textStyle.push(new DvtCSSStyle('color: ' + DvtBaseTreeNode.GetNodeTextColor(this)));

  // Header Label Style
  if (this._headerLabelStyle)
    textStyle.push(this._headerLabelStyle);

  text.setCSSStyle(DvtCSSStyle.mergeStyles(textStyle));
};

/**
 * Handles a mouse out event on the node.
 */
DvtTreemapNode.prototype.handleMouseOver = function() {
  // Isolate: draw button if needed
  if (!this._isolateButton && !DvtAgent.isTouchDevice())
    this._isolateButton = this._createIsolateRestoreButton(this._shape);

  DvtTreemapNode.superclass.handleMouseOver.call(this);
};

/**
 * Handles a mouse out event on the node.
 */
DvtTreemapNode.prototype.handleMouseOut = function() {
  // Isolate: hide button if displayed
  if (this.__isIsolated() !== true && !DvtAgent.isTouchDevice())
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
    return new DvtRect(this.getView().getCtx(), this._shape.getX(), this._shape.getY(), this._shape.getWidth(), this._shape.getHeight());
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
 * @param {DvtShape} childShape The child shape to remove.
 * @private
 */
DvtTreemapNode.prototype._removeChildShape = function(childShape) {
  if (childShape)
    this._shape.removeChild(childShape);
};

/**
 * Returns the isolate button for use on the node header.
 * @return {DvtDisplayable}
 * @private
 */
DvtTreemapNode.prototype._getIsolateButton = function() {
  var context = this.getView().getCtx();

  // Get the resources from the view
  var bRtl = DvtAgent.isRightToLeft(this._context);
  var resources = this.getView().getOptions()['_resources'];
  var upImage = bRtl && resources['isolateRtl'] ? resources['isolateRtl'] : resources['isolate'];
  var overImage = bRtl && resources['isolateDownRtl'] ? resources['isolateDownRtl'] : resources['isolateDown'];
  var downImage = bRtl && resources['isolateOverRtl'] ? resources['isolateOverRtl'] : resources['isolateOver'];

  // Initialize the button states
  var upState = new DvtImage(context, upImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);
  var overState = new DvtImage(context, overImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);
  var downState = new DvtImage(context, downImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);

  // Have to add a transparent fill so that IE9 can capture the mouse events ()
  upState.setInvisibleFill();
  overState.setInvisibleFill();
  downState.setInvisibleFill();

  // Create button and hook up click listener
  var button = new DvtButton(context, upState, overState, downState);
  button.addEvtListener(DvtMouseEvent.CLICK, this.__isolateNode, false, this);
  return button;
};

/**
 * Returns the restore button for use on the node header.
 * @return {DvtDisplayable}
 * @private
 */
DvtTreemapNode.prototype._getRestoreButton = function() {
  var context = this.getView().getCtx();

  // Get the resources from the view
  var bRtl = DvtAgent.isRightToLeft(this._context);
  var resources = this.getView().getOptions()['_resources'];
  var upImage = bRtl && resources['restoreRtl'] ? resources['restoreRtl'] : resources['restore'];
  var overImage = bRtl && resources['restoreDownRtl'] ? resources['restoreDownRtl'] : resources['restoreDown'];
  var downImage = bRtl && resources['restoreOverRtl'] ? resources['restoreOverRtl'] : resources['restoreOver'];

  // Initialize the button states
  var upState = new DvtImage(context, upImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);
  var overState = new DvtImage(context, overImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);
  var downState = new DvtImage(context, downImage, 0, 0, DvtTreemapNode._ISOLATE_ICON_SIZE, DvtTreemapNode._ISOLATE_ICON_SIZE);

  // Have to add a transparent fill so that IE9 can capture the mouse events ()
  upState.setInvisibleFill();
  overState.setInvisibleFill();
  downState.setInvisibleFill();

  // Create button and hook up click listener
  var button = new DvtButton(context, upState, overState, downState);
  button.addEvtListener(DvtMouseEvent.CLICK, this.__restoreNode, false, this);
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
  if (target && target instanceof DvtButton)
    return null;// tooltip is displayed for isolate button
  else
    return DvtTreemapNode.superclass.getDatatip.call(this, target, x, y);
};

/**
 * @override
 */
DvtTreemapNode.prototype.getDatatipColor = function(target) {
  if (target && target instanceof DvtButton)
    return null;// tooltip is displayed for isolate button
  else
    return DvtTreemapNode.superclass.getDatatipColor.call(this, target);
};

/**
 * @override
 */
DvtTreemapNode.prototype.getTooltip = function(target) {
  if (target && target instanceof DvtButton)
    return DvtBundle.getTranslation(this.getView().getOptions(), this.__isIsolated() ? 'tooltipRestore' : 'tooltipIsolate', DvtBundle.TREEMAP_PREFIX, this.__isIsolated() ? 'RESTORE' : 'ISOLATE');
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
    states.push(DvtBundle.getTranslation(options, this.isSelected() ? 'stateSelected' : 'stateUnselected', DvtBundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  if (this.__isIsolated())
    states.push(DvtBundle.getTranslation(options, 'stateIsolated', DvtBundle.UTIL_PREFIX, 'STATE_ISOLATED'));
  if (this.isDrillReplaceEnabled())
    states.push(DvtBundle.getTranslation(options, 'stateDrillable', DvtBundle.UTIL_PREFIX, 'STATE_DRILLABLE'));

  return DvtDisplayable.generateAriaLabel(this.getShortDesc(), states);
};

/**
 * @override
 */
DvtTreemapNode.prototype.UpdateAriaLabel = function() {
  if (!DvtAgent.deferAriaCreation() && this._shape)// need the null check bc it may fail in unit test (TreemapSelectionTest)
    this._shape.setAriaProperty('label', this.getAriaLabel());
};
/**
 * Base layout class for treemaps.
 * @class
 * @constructor
 */
var DvtBaseTreemapLayout = function() {
  this.Init();
};

DvtObj.createSubclass(DvtBaseTreemapLayout, DvtObj, 'DvtBaseTreemapLayout');

/** @private @const **/
DvtBaseTreemapLayout._GROUP_GAP = 3;


/**
 * @protected
 */
DvtBaseTreemapLayout.prototype.Init = function() {
  this._zIndex = 0; // counter to help keep track of the zIndex of the nodes
};


/**
 * Performs layout for the tree.  The specific algorithm varies by subclass.
 * @param {DvtTreemap} view The treemap component.
 * @param {DvtBaseTreeNode} root The root of the tree.
 * @param {number} x The x coordinate for this node.
 * @param {number} y The y coordinate for this node.
 * @param {number} width The width of this node.
 * @param {number} height The height of this node.
 * @param {boolean} bShowRoot True if the root node should be displayed.
 */
DvtBaseTreemapLayout.prototype.layout = function(view, root, x, y, width, height, bShowRoot) 
{
  // subclasses should override
};

/**
 * Applies the specified bounds to the node and returns the space available to the node's children.
 * @param {DvtBaseTreeNode} node
 * @param {number} x The x coordinate for this node.
 * @param {number} y The y coordinate for this node.
 * @param {number} width The width of this node.
 * @param {number} height The height of this node.
 * @param {boolean} isRoot true if this node is the root of the tree.
 * @return {DvtRectangle} The rectangle indicating the area to allocate to the children of this node.
 */
DvtBaseTreemapLayout.prototype.setNodeBounds = function(node, x, y, width, height, isRoot) 
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
  return new DvtRectangle(x, y, width, height);
};


/**
 * Returns the gap size for a node at the specified depth.
 * @param {DvtTreemap} view
 * @param {number} depth The depth of the node for which the gap should be replied.
 * @return {number} The size of the gaps around this node.
 */
DvtBaseTreemapLayout.prototype.getGapSize = function(view, depth) {
  var groupGaps = view.getOptions()['groupGaps'];
  if (groupGaps == 'outer')
    return (depth == 1 && view.__getMaxDepth() >= 2) ? DvtBaseTreemapLayout._GROUP_GAP : 0;
  else if (groupGaps == 'all')
    return (depth < view.__getMaxDepth()) ? DvtBaseTreemapLayout._GROUP_GAP : 0;
  else // none
    return 0;
};
/**
 * Layout class for treemaps.  This layout optimizes the aspect ratios, making the nodes as square as
 * possible for improved comparisons between nodes.  This layout does not maintain the ordering of
 * the nodes.
 * @class
 * @constructor
 * @extends {DvtBaseTreemapLayout}
 */
var DvtSquarifyingLayout = function() {
  this.Init();
};

DvtObj.createSubclass(DvtSquarifyingLayout, DvtBaseTreemapLayout, 'DvtSquarifyingLayout');


/**
 * @override
 */
DvtSquarifyingLayout.prototype.layout = function(view, root, x, y, width, height, bShowRoot) {
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
DvtSquarifyingLayout.prototype._layout = function(node, x, y, width, height, isRoot) 
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
    var r = new DvtRectangle(availBounds.x, availBounds.y, availBounds.w, availBounds.h);
    this._squarify(children, new Array(), w, r, Infinity);
  }
};


/**
 * Calculates and sets the pixel size for each child node.
 * @param {array} children The array of treemap node children.
 * @param {number} area The pixel area available for these children.
 * @private
 */
DvtSquarifyingLayout.prototype._calcPixelSize = function(children, area) {
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
 * @param {DvtRectangle} r The rectangle available for layout.
 * @param {number} worst The worst aspect ratio in the current row.
 * @private
 */
DvtSquarifyingLayout.prototype._squarify = function(children, row, w, r, worst) {
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
DvtSquarifyingLayout.prototype._getWorst = function(areas, w) {
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
 * @param {DvtRectangle} r The rectangle available for layout.
 * @return {DvtRectangle} A rectangle containing the unallocated space.
 * @private
 */
DvtSquarifyingLayout.prototype._layoutRow = function(row, w, r) 
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
    return new DvtRectangle(r.x, r.y + height, r.w, r.h - height);
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
    return new DvtRectangle(r.x + width, r.y, r.w - width, r.h);
  }
};
/**
 * Layout class for treemaps.  This layout allocates space across a single dimension for each layer,
 * alternating between horizontal and vertical allocation.  This layout maintains the ordering of
 * the nodes while sacrificing aspect ratio.
 * @param {boolean} isHoriz true if the first layer is laid out horizontally.
 * @class
 * @constructor
 * @extends {DvtBaseTreemapLayout}
 */
var DvtSliceAndDiceLayout = function(isHoriz) {
  this.Init();
  this._isHoriz = isHoriz;
};

DvtObj.createSubclass(DvtSliceAndDiceLayout, DvtBaseTreemapLayout, 'DvtSliceAndDiceLayout');


/**
 * @override
 */
DvtSliceAndDiceLayout.prototype.layout = function(view, root, x, y, width, height, bShowRoot) {
  var isRoot = bShowRoot ? false : true;
  this._layout(this._isHoriz, view, root, x, y, width, height, isRoot);
};


/**
 * Performs layout for the specified node in the tree.
 * @param {boolean} isHoriz true if this layer is laid out horizontally.
 * @param {DvtTreemap} view The treemap component.
 * @param {DvtTreemapNode} node The root of the tree.
 * @param {number} x The x coordinate for this node.
 * @param {number} y The y coordinate for this node.
 * @param {number} width The width of this node.
 * @param {number} height The height of this node.
 * @param {boolean} isRoot true if this node is the root of the tree.
 * @private
 */
DvtSliceAndDiceLayout.prototype._layout = function(isHoriz, view, node, x, y, width, height, isRoot) 
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
    if (isHoriz && DvtAgent.isRightToLeft(view.getCtx()))
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
/**
 * @constructor
 * A component level treemap isolate event.
 * @type {string} id The id of the node that is the target of the event.
 * @class
 * @extends {DvtBaseComponentEvent}
 * @export
 */
var DvtTreemapIsolateEvent = function(id) {
  this.Init(DvtTreemapIsolateEvent.TYPE);
  this._id = id ? id : null;
};

DvtObj.createSubclass(DvtTreemapIsolateEvent, DvtBaseComponentEvent, 'DvtTreemapIsolateEvent');


/**
 * @export
 */
DvtTreemapIsolateEvent.TYPE = 'treemapIsolate';


/**
 * Returns the id of the isolated node, if any.
 * @return {string}
 * @export
 */
DvtTreemapIsolateEvent.prototype.getId = function() {
  return this._id;
};
/*---------------------------------------------------------------------------------*/
/*  DvtTreemapKeyboardHandler     Keyboard handler for Treemap                     */
/*---------------------------------------------------------------------------------*/
/**
  *  @param {DvtEventManager} manager The owning DvtEventManager
  *  @class DvtTreemapKeyboardHandler
  *  @extends {DvtKeyboardHandler}
  *  @constructor
  */
var DvtTreemapKeyboardHandler = function(manager)
{
  this.Init(manager);
};

DvtObj.createSubclass(DvtTreemapKeyboardHandler, DvtBaseTreeKeyboardHandler, 'DvtTreemapKeyboardHandler');


/**
 * @override
 */
DvtTreemapKeyboardHandler.prototype.isNavigationEvent = function(event)
{
  var isNavigable = DvtTreemapKeyboardHandler.superclass.isNavigationEvent.call(this, event);

  if (!isNavigable)
  {
    var keyCode = event.keyCode;
    if (keyCode == DvtKeyboardEvent.OPEN_BRACKET ||
        keyCode == DvtKeyboardEvent.CLOSE_BRACKET)
      isNavigable = true;
  }

  return isNavigable;
};
/**
 * Event Manager for Treemap.
 * @param {DvtTreemap} view The treemap to associate with this event manager
 * @param {DvtContext} context The platform specific context object.
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 * @class
 * @constructor
 */
var DvtTreemapEventManager = function(view, context, callback, callbackObj) {
  DvtBaseTreeEventManager.call(this, view, context, callback, callbackObj);
};

DvtObj.createSubclass(DvtTreemapEventManager, DvtBaseTreeEventManager, 'DvtTreemapEventManager');


/**
 * @override
 */
DvtTreemapEventManager.prototype.ProcessKeyboardEvent = function(event)
{
  var eventConsumed = true;
  var keyCode = event.keyCode;

  if (keyCode == DvtKeyboardEvent.ENTER && event.ctrlKey)
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
    DvtEventManager.consumeEvent(event);
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


DvtBundle.addDefaultStrings(DvtBundle.TREEMAP_PREFIX, {
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
 * @extends {DvtBaseTreeDefaults}
 */
var DvtTreemapDefaults = function() {
  this.Init({'skyros': DvtTreemapDefaults.VERSION_1, 'alta': {}});
};

DvtObj.createSubclass(DvtTreemapDefaults, DvtBaseTreeDefaults, 'DvtTreemapDefaults');

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
      'labelStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px;color:#252525;"),
      'selectedBackgroundColor': '#dae9f5',
      'selectedInnerColor': '#FFFFFF',
      'selectedOuterColor': '#000000',
      'useNodeColor': 'off',

      '_hoverLabelStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px;color:#252525;"),
      '_selectedLabelStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px;color:#252525;"),

      '_drillableLabelStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color:#145c9e;"),
      '_drillableHoverLabelStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color:#145c9e;"),
      '_drillableSelectedLabelStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color:#145c9e;")
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

  return D;
});