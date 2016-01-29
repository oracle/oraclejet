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
 * A component level sunburst rotation event.
 * @param {number} startAngle The start angle of the sunburst, in degrees.
 * @param {boolean} bComplete True if the value change interaction is complete.
 * @class
 * @constructor
 * @export
 */
var DvtSunburstRotationEvent = function(startAngle, bComplete) {
  var type = (bComplete === false) ? DvtSunburstRotationEvent.TYPE_INPUT : DvtSunburstRotationEvent.TYPE;
  this.Init(type);

  // Adjust the angle so that it's always between 0 and 360
  this._startAngle = startAngle % 360;
};

DvtObj.createSubclass(DvtSunburstRotationEvent, DvtBaseComponentEvent, 'DvtSunburstRotationEvent');


/**
 * @export
 */
DvtSunburstRotationEvent.TYPE = 'sunburstRotation';


/**
 * @export
 */
DvtSunburstRotationEvent.TYPE_INPUT = 'sunburstRotationInput';


/**
 * Returns the start angle of the sunburst, in degrees.
 * @return {number} The start angle of the sunburst, in degrees.
 * @export
 */
DvtSunburstRotationEvent.prototype.getStartAngle = function() {
  return this._startAngle;
};
/**
 * @constructor
 * Sunburst component.
 * @param {DvtContext} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @class Sunburst component.
 * @extends {DvtBaseTreeView}
 * @export
 */
var DvtSunburst = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

// Make DvtSunburst a subclass of DvtBaseTreeView
DvtObj.createSubclass(DvtSunburst, DvtBaseTreeView, 'DvtSunburst');

/** @const @private **/
DvtSunburst._ROTATION_SHAPE_RADIUS = 15; // size of additional radius for mouse rotation detection
/** @const @private **/
DvtSunburst._ROTATION_SHAPE_RADIUS_TOUCH = 60; // size of additional radius for mouse rotation detection
/** @const @private **/
DvtSunburst._ANIMATION_TYPE_FAN = 'fan';
/** @const @private **/
DvtSunburst._BACKGROUND_INLINE_DEFAULT = '';

// Layout Constants
/** @const @private **/
DvtSunburst._BUFFER_SPACE = 3;
/** @const @private **/
DvtSunburst._MIN_BUFFER_SPACE = 2; // Minimum buffer for very small sunbursts


/**
 * Returns a new instance of DvtSunburst.
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {DvtSunburst}
 * @export
 */
DvtSunburst.newInstance = function(context, callback, callbackObj) {
  return new DvtSunburst(context, callback, callbackObj);
};

/**
 * @override
 */
DvtSunburst.prototype.Init = function(context, callback, callbackObj) {
  DvtSunburst.superclass.Init.call(this, context, callback, callbackObj);

  // Create the defaults object
  this.Defaults = new DvtSunburstDefaults();

  // Initialize the angle extent, which may be changed during animation
  this._angleExtent = 2 * Math.PI;
};

/**
 * @override
 */
DvtSunburst.prototype.ApplyParsedProperties = function(props) {
  DvtSunburst.superclass.ApplyParsedProperties.call(this, props);

  var options = this.getOptions();

  if (DvtAgent.isPlatformIE()) {
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
DvtSunburst.prototype.Layout = function(availSpace) {
  // Update available space
  var bufferSpace = Math.max(Math.ceil(DvtSunburst._BUFFER_SPACE * Math.min(availSpace.w, availSpace.h) / 400), DvtSunburst._MIN_BUFFER_SPACE);
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
DvtSunburst.prototype.Render = function(container, bounds) {
  // Background
  this.RenderBackground(container, DvtSunburst._BACKGROUND_INLINE_DEFAULT);

  // Breadcrumbs
  this.RenderBreadcrumbs(container);

  // Legend
  this.RenderLegend(container);

  // Calculate the center of the sunburst
  this._translatePt = new DvtPoint(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);

  // Rotation Support
  if (this.__isRotationEnabled() && this.HasValidData()) {
    var buffer = (DvtAgent.isTouchDevice()) ? DvtSunburst._ROTATION_SHAPE_RADIUS_TOUCH : DvtSunburst._ROTATION_SHAPE_RADIUS;
    var rotationShape = new DvtCircle(this.getCtx(), bounds.x + bounds.w / 2, bounds.y + bounds.h / 2, this._totalRadius + buffer);
    rotationShape.setInvisibleFill();
    rotationShape.setCursor(this._rotateCursor);
    container.addChild(rotationShape);

    // Associate for event handling
    this.getEventManager().associate(rotationShape, new DvtBaseTreePeer(null, DvtSunburstEventManager.ROTATION_ID));
  }

  // Create a node container, which will contain all nodes.
  var nodeContainer = new DvtContainer(this.getCtx());
  // Translate to center, since all nodes are drawn at (0,0)
  nodeContainer.setTranslate(this._translatePt.x, this._translatePt.y);
  container.addChild(nodeContainer);

  if (this.HasValidData()) {
    // Render the nodes. This creates the shape objects, but does not render them yet.
    var nodeLayer = new DvtContainer(this.getCtx());
    nodeContainer.addChild(nodeLayer);
    this._root.render(nodeLayer);
    this.UpdateAriaNavigation(this._root);

    // Create a group for selected nodes
    this._selectedLayer = new DvtContainer(this.getCtx());
    nodeContainer.addChild(this._selectedLayer);

    // Prepare the hover effect
    this._hoverLayer = new DvtContainer(this.getCtx());
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
DvtSunburst.prototype.CreateEventManager = function(view, context, callback, callbackObj)
{
  return new DvtSunburstEventManager(view, context, callback, callbackObj);
};


/**
 * @override
 */
DvtSunburst.prototype.GetDisplayAnimation = function(container, bounds) {
  if (this.getOptions()['animationOnDisplay'] === DvtSunburst._ANIMATION_TYPE_FAN && this.HasValidData()) {
    // Set up the initial state
    this._animateAngleExtent(0);

    // Create and return the animation
    var anim = new DvtCustomAnimation(this.getCtx(), this, this.AnimationDuration);
    anim.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, this, this.__getAngleExtent, this._animateAngleExtent, 2 * Math.PI);
    return anim;
  }
  else
    return DvtSunburst.superclass.GetDisplayAnimation.call(this, container, bounds);
};


/**
 * @override
 */
DvtSunburst.prototype.GetDeleteContainer = function() {
  var ret = DvtSunburst.superclass.GetDeleteContainer.call(this);
  if (ret) {
    ret.setTranslate(this._translatePt.x, this._translatePt.y);
  }
  return ret;
};


/**
 * Hook for cleaning up animation behavior at the end of the animation.
 * @override
 */
DvtSunburst.prototype.OnAnimationEnd = function() {
  // If the animation is complete (and not stopped), then rerender to restore any flourishes hidden during animation.
  if (!this.AnimationStopped) {
    this._container.removeChildren();

    // Finally, re-layout and render the component
    var availSpace = new DvtRectangle(0, 0, this.Width, this.Height);
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
  DvtSunburst.superclass.OnAnimationEnd.call(this);
};


/**
 * Moves the specified object to the selected layer, above the non-selected objects.
 * @param {DvtDisplayable} displayable The object to be moved.
 */
DvtSunburst.prototype.__moveToHoverLayer = function(displayable) {
  // Move the object to the hover layer
  this._hoverLayer.addChild(displayable);
};


/**
 * Moves the specified object to the selected layer, above the non-selected objects.
 * @param {DvtDisplayable} displayable The object to be moved.
 */
DvtSunburst.prototype.__moveToSelectedLayer = function(displayable) {
  // Move the object to the selected layer
  this._selectedLayer.addChild(displayable);

  // Also reapply the shadow.  Use a clone since the object is static and may be used elsewhere in the page.
  //  and : Disable shadows in safari and ff due to rendering issues.
  if (!DvtAgent.isBrowserSafari() && !DvtAgent.isPlatformGecko()) {
    this._selectedLayer.removeAllDrawEffects();
    this._selectedLayer.addDrawEffect(DvtBaseTreeNode.__NODE_SELECTED_SHADOW);
  }
};


/**
 * Returns the angle extent of the entire sunburst, for use in animating the sunburst.
 * @return {number} angleExtent The angle extent of the entire sunburst.
 */
DvtSunburst.prototype.__getAngleExtent = function() {
  return this._angleExtent;
};


/**
 * Animates the angle extent of the sunburst to the specified value.
 * @param {number} extent The new angle extent.
 * @private
 */
DvtSunburst.prototype._animateAngleExtent = function(extent) {
  // Steps: Update the field, relayout the sunburst, update the shapes.
  this._angleExtent = extent;

  var bounds = new DvtRectangle(0, 0, this.Width, this.Height);
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
DvtSunburst.prototype.__startRotation = function(mouseX, mouseY) {
  this.__setRotationAnchor(this._calcAngle(mouseX, mouseY));
};


/**
 * Sets the rotation anchor for the Sunburst.
 * @param {number} angle The rotation anchor, in radians
 */
DvtSunburst.prototype.__setRotationAnchor = function(angle) {
  // Store the angle at which the rotation started
  this._currentAngle = angle;

  // Apply a mask to show cursor and prevent interaction on nodes
  this._rotationMask = new DvtRect(this.getCtx(), 0, 0, this.Width, this.Height);
  this._rotationMask.setInvisibleFill();
  this._rotationMask.setCursor(this._rotateCursor);
  this.addChild(this._rotationMask);

  // Associate for event handling
  this.getEventManager().associate(this._rotationMask, new DvtBaseTreePeer(null, DvtSunburstEventManager.ROTATION_ID));
};


/**
 * Continues the rotation at the specified coordinates.
 * @param {number} mouseX The new x coordinate of the rotation anchor.
 * @param {number} mouseY The new y coordinate of the rotation anchor.
 */
DvtSunburst.prototype.__continueRotation = function(mouseX, mouseY) {
  this.__rotate(this._calcAngle(mouseX, mouseY));
};


/**
 * Continues the rotation at the specified angle
 * @param {number} newAngle The new value of the rotation anchor, in radians
 */
DvtSunburst.prototype.__rotate = function(newAngle) {
  // Calculate and update the angle of the component
  var change = newAngle - this._currentAngle;
  this._currentAngle = newAngle;
  this._updateStartAngle(change);

  // Fire the intermediate rotation event
  var degrees = 360 - Math.round(this._startAngle * 180 / Math.PI);
  this.dispatchEvent(new DvtSunburstRotationEvent(degrees, false));
};


/**
 * Completes the rotation.
 */
DvtSunburst.prototype.__endRotation = function() {
  // Clear flags
  this._currentAngle = null;

  // Remove the rotation mask
  this.removeChild(this._rotationMask);
  this._rotationMask = null;

  // Fire events to update ADF state, convert to degrees API (reversed from SVG)
  var degrees = 360 - Math.round(this._startAngle * 180 / Math.PI);
  this.dispatchEvent(new DvtSunburstRotationEvent(degrees, false));
  this.dispatchEvent(new DvtSunburstRotationEvent(degrees, true));
};


/**
 * Applies the updated disclosure to the node and re-renders.
 * @param {DvtSunburstNode} node The node to expand or collapse.
 * @param {boolean} bDisclosed The new disclosure state of the node's children.
 */
DvtSunburst.prototype.__expandCollapseNode = function(node, bDisclosed) {
  // after the expand/collapse completes, set keyboard focus on the node on which
  // the expand or collapse was applied to
  this.__setNavigableIdToFocus(node.getId());

  if (bDisclosed) {
    // Expand: Re-render on the client if the node has definitions for children.
    var nodeOptions = node.getOptions();
    if (nodeOptions['nodes'] && nodeOptions['nodes'].length > 0)
      this.render(this.getOptions());
    this.dispatchEvent(new DvtSunburstExpandCollapseEvent(DvtSunburstExpandCollapseEvent.TYPE_EXPAND, node.getId()));
  }
  else {
    // Collapse: Collapse is handled within the component by updating the options and
    // re-rendering.  The event is fired to the peer, which will keep track of the
    // state and send a server event if a listener is registered.
    this.render(this.getOptions());
    this.dispatchEvent(new DvtSunburstExpandCollapseEvent(DvtSunburstExpandCollapseEvent.TYPE_COLLAPSE, node.getId()));
  }
};


/**
 * Calculates the angle for the specified coordinates.
 * @param {number} x
 * @param {number} y
 * @return {number} The angle in radians.
 * @private
 */
DvtSunburst.prototype._calcAngle = function(x, y) {
  return Math.atan2(y - this._translatePt.y, x - this._translatePt.x);
};


/**
 * Updates the start angle by the specified amount.
 * @param {number} change The change in start angle, in radians.
 * @private
 */
DvtSunburst.prototype._updateStartAngle = function(change) {
  // Update start angle and constrain to -PI to PI
  this._startAngle += change;
  if (this._startAngle < -Math.PI)
    this._startAngle += 2 * Math.PI;
  else if (this._startAngle > Math.PI)
    this._startAngle -= 2 * Math.PI;

  // Relayout and update shapes
  var bounds = new DvtRectangle(0, 0, this.Width, this.Height);
  this.Layout(bounds);
  if (this._root)
    this._root.updateShapes(true);
};


/**
 * @override
 */
DvtSunburst.prototype.__getNodeUnderPoint = function(x, y) {
  return this._root.getNodeUnderPoint(x - this._translatePt.x, y - this._translatePt.y);
};


/**
 * @override
 */
DvtSunburst.prototype.__showDropSiteFeedback = function(node) {
  var feedback = DvtSunburst.superclass.__showDropSiteFeedback.call(this, node);
  if (feedback) {
    feedback.setTranslate(this._translatePt.x, this._translatePt.y);
  }

  return feedback;
};


/**
 * Returns true if Sunburst rotation is enabled
 * @return {Boolean} true if rotation is enabled, false otherwise
 */
DvtSunburst.prototype.__isRotationEnabled = function() 
{
  return this.getOptions()['rotation'] != 'off';
};

/**
 * Returns the displayables to pass to the view switcher for animation.
 * @param {boolean} bOld True if this is the outgoing view.
 * @return {array} The array of displayables.
 */
DvtSunburst.prototype.getShapesForViewSwitcher = function(bOld) {
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
DvtSunburst.prototype.GetComponentDescription = function() {
  return DvtBundle.getTranslation(this.getOptions(), 'componentName', DvtBundle.UTIL_PREFIX, 'SUNBURST');
};

/**
 * @override
 */
DvtSunburst.prototype.getBundlePrefix = function() {
  return DvtBundle.SUNBURST_PREFIX;
};

/**
 * @override
 */
DvtSunburst.prototype.CreateNode = function(nodeOptions) {
  return new DvtSunburstNode(this, nodeOptions);
};
/**
 * Class representing a sunburst node.
 * @param {DvtSunburst} sunburst The owning sunburst component.
 * @param {object} props The properties for the node.
 * @class
 * @constructor
 * @extends {DvtBaseTreeNode}
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

// Make DvtSunburstNode a subclass of DvtBaseTreeNode
DvtObj.createSubclass(DvtSunburstNode, DvtBaseTreeNode, 'DvtSunburstNode');

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
        this._textBackground = new DvtRect(this.getView().getCtx(), dims.x, dims.y, dims.w, dims.h);
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

  if (event.type == DvtMouseEvent.CLICK)
  {
    return DvtSunburstNode.superclass.getNextNavigable.call(this, event);
  }

  keyCode = event.keyCode;

  if (keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey)
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
    case DvtKeyboardEvent.UP_ARROW:

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
        next = DvtKeyboardHandler.getNextAdjacentNavigable(this, event, this.getDescendantNodes());
      }
      // lower half of sunburst
      else
        next = this._navigateToParent();

      break;

    case DvtKeyboardEvent.DOWN_ARROW:

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
        next = DvtKeyboardHandler.getNextAdjacentNavigable(this, event, this.getDescendantNodes());
      }
      // upper half of sunburst
      else
        next = this._navigateToParent();

      break;

    case DvtKeyboardEvent.LEFT_ARROW:
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

    case DvtKeyboardEvent.RIGHT_ARROW:
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
  var deg = DvtMath.radsToDegrees(rad);
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
    var point = new DvtPoint(bounds.x, bounds.y);
    point = this._shape.localToStage(point);
    bounds.x = point.x;
    bounds.y = point.y;
    return bounds;
  }
  else
  {
    return new DvtRectangle(0, 0, 0, 0);
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
    return DvtSolidFill.invisibleFill(); // make it as close to invisible as possible
  else
    return DvtSunburstNode.superclass.GetFill.call(this);
};


/**
 * @param {array} endState Optional argument to compute shortest path from start to end state
 * @override
 */
DvtSunburstNode.prototype.GetAnimationParams = function(endState) {
  var r = DvtColorUtils.getRed(this._color);
  var g = DvtColorUtils.getGreen(this._color);
  var b = DvtColorUtils.getBlue(this._color);

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
  this._color = DvtColorUtils.makeRGB(r, g, b);

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
 * @return {DvtShape} The shape element for this node.
 * @private
 */
DvtSunburstNode.prototype._createShapeNode = function() {
  // Skip if no angle extent
  if (!this._angleExtent || this._angleExtent <= 0)
    return null;

  // Finally create the shape
  var cmd = this._createPathCmd();
  var shape = new DvtPath(this.getView().getCtx(), cmd);

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
  shape.setStroke(new DvtSolidStroke(borderColor, 1, borderWidth));
  shape.setHoverStroke(new DvtSolidStroke(nodeDefaults['hoverColor'], 1, 3));
  shape.setSelectedStroke(new DvtSolidStroke(nodeDefaults['selectedInnerColor'], 1, 1.5), new DvtSolidStroke(nodeDefaults['selectedOuterColor'], 1, 3.5));
  shape.setSelectedHoverStroke(new DvtSolidStroke(nodeDefaults['hoverColor'], 1, 3));

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
    cmd = DvtPathUtils.moveTo(p1.x, p1.y) +
          DvtPathUtils.arcTo(this._outerRadius, this._outerRadius, this._angleExtent, 1, p2.x, p2.y) +
          DvtPathUtils.lineTo(p3.x, p3.y) +
          DvtPathUtils.arcTo(this._innerRadius, this._innerRadius, this._angleExtent, 0, p4.x, p4.y) +
          DvtPathUtils.closePath();
  }
  else
  {
    // To work around a chrome/safari bug, we draw two segments around each of the outer and inner arcs
    p1 = DvtSunburstNode._calcPointOnArc(this._outerRadius, this._startAngle);
    p2 = DvtSunburstNode._calcPointOnArc(this._outerRadius, this._startAngle + this._angleExtent / 2);
    p3 = DvtSunburstNode._calcPointOnArc(this._innerRadius, this._startAngle);
    p4 = DvtSunburstNode._calcPointOnArc(this._innerRadius, this._startAngle + this._angleExtent / 2);

    // Create the command and return it
    cmd = DvtPathUtils.moveTo(p1.x, p1.y) +
          DvtPathUtils.arcTo(this._outerRadius, this._outerRadius, this._angleExtent / 2, 1, p2.x, p2.y) +
          DvtPathUtils.arcTo(this._outerRadius, this._outerRadius, this._angleExtent / 2, 1, p1.x, p1.y);

    // Add the inner segment for a hollow center
    if (this._innerRadius > 0)
      cmd += DvtPathUtils.moveTo(p4.x, p4.y) +
             DvtPathUtils.arcTo(this._innerRadius, this._innerRadius, this._angleExtent / 2, 0, p3.x, p3.y) +
             DvtPathUtils.arcTo(this._innerRadius, this._innerRadius, this._angleExtent / 2, 0, p4.x, p4.y);

    cmd += DvtPathUtils.closePath();
  }

  return cmd;
};


/**
 * Creates and positions the expand or collapse button button for this node.
 * @param {DvtContainer} container The container for the button.
 * @return {DvtButton}
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
  var tooltip = DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, this.isDisclosed() ? 'COLLAPSE' : 'EXPAND');
  this.getView().getEventManager().associate(button, new DvtBaseTreePeer(this, this.getId(), tooltip));

  return button;
};


/**
 * Creates and return the text element for this node.
 * @param {DvtContainer} container The container element.
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
    if (!DvtAgent.isPlatformIE() && DvtAgent.getOS() == DvtAgent.WINDOWS_OS)
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
 * @param {DvtContainer} container The container element.
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
    var text = new DvtOutputText(this.getView().getCtx(), this._textStr, textAnchor.x, textAnchor.y, null);
    text.setFontSize(this.GetTextSize());
    this.ApplyLabelTextStyle(text);
    text.alignCenter();
    text.alignMiddle();
    text.setMouseEnabled(false);

    // Find the estimated dimensions of the label
    var estimatedDims = DvtTextUtils.guessTextDimensions(text);

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
    return DvtTextUtils.fitText(text, usableSpace, estimatedDims.h, container) ? text : null;
  }
};


/**
 * Creates and returns a rotated text element for this node. Adds the text to the container if it's not empty.
 * @param {DvtContainer} container The container element.
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
  var text = new DvtOutputText(this.getView().getCtx(), this._textStr, 0, 0);
  text.setFontSize(this.GetTextSize());

  // Set Style Properties
  this.ApplyLabelTextStyle(text);

  // Truncate the text if necessary
  if (!DvtTextUtils.fitText(text, availWidth, availHeight, container))
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
  if (this._shape instanceof DvtCircle)
    return new DvtCircle(this.getView().getCtx(), this._shape.getCx(), this._shape.getCy(), this._shape.getRadius());
  else if (this._shape instanceof DvtPath)
    return new DvtPath(this.getView().getCtx(), this._shape.getCmds());
  else
    return null;
};


/**
 * Returns the expand button.
 * @return {DvtDisplayable}
 * @private
 */
DvtSunburstNode.prototype._getExpandButton = function() {
  var context = this.getView().getCtx();

  // Get the resources from the view
  var resources = this.getView().getOptions()['_resources'];

  // Initialize the button states
  var upState = new DvtImage(context, resources['expand'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);
  var overState = new DvtImage(context, resources['expandOver'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);
  var downState = new DvtImage(context, resources['expandDown'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);

  // Have to add a transparent fill so that IE9 can capture the mouse events ()
  upState.setInvisibleFill();
  overState.setInvisibleFill();
  downState.setInvisibleFill();

  // Create button and hook up click listener
  var button = new DvtButton(context, upState, overState, downState);
  button.addEvtListener(DvtMouseEvent.CLICK, this.expandCollapseNode, false, this);
  return button;
};


/**
 * Returns the collapse button.
 * @return {DvtDisplayable}
 * @private
 */
DvtSunburstNode.prototype._getCollapseButton = function() {
  var context = this.getView().getCtx();

  // Get the resources from the view
  var resources = this.getView().getOptions()['_resources'];

  // Initialize the button states
  var upState = new DvtImage(context, resources['collapse'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);
  var overState = new DvtImage(context, resources['collapseOver'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);
  var downState = new DvtImage(context, resources['collapseDown'], 0, 0, DvtSunburstNode._EXPAND_ICON_SIZE, DvtSunburstNode._EXPAND_ICON_SIZE);

  // Have to add a transparent fill so that IE9 can capture the mouse events ()
  upState.setInvisibleFill();
  overState.setInvisibleFill();
  downState.setInvisibleFill();

  // Create button and hook up click listener
  var button = new DvtButton(context, upState, overState, downState);
  button.addEvtListener(DvtMouseEvent.CLICK, this.expandCollapseNode, false, this);
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
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  if (this.isExpandCollapseEnabled())
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, this.isDisclosed() ? 'STATE_EXPANDED' : 'STATE_COLLAPSED'));
  if (this.isDrillReplaceEnabled())
    states.push(DvtBundle.getTranslation(options, 'stateDrillable', DvtBundle.UTIL_PREFIX, 'STATE_DRILLABLE'));

  return DvtDisplayable.generateAriaLabel(this.getShortDesc(), states);
};


/**
 * @override
 */
DvtSunburstNode.prototype.UpdateAriaLabel = function() {
  if (!DvtAgent.deferAriaCreation() && this._shape) // need the null check bc it may fail in unit test (TreemapSelectionTest)
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

DvtObj.createSubclass(DvtSunburstLayout, DvtObj, 'DvtSunburstLayout');


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
    if (DvtAgent.isRightToLeft(node.getView().getCtx()))
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
 * @constructor
 * A component level sunburst node expand or collapse event.
 * @type {string} type The type of the event
 * @type {string} id The id of the node that is the target of the event.
 * @class
 * @constructor
 * @extends {DvtBaseComponentEvent}
 */
var DvtSunburstExpandCollapseEvent = function(type, id) {
  this.Init(type);
  this._id = id ? id : null;
};

DvtObj.createSubclass(DvtSunburstExpandCollapseEvent, DvtBaseComponentEvent, 'DvtSunburstExpandCollapseEvent');

// Event Types
DvtSunburstExpandCollapseEvent.TYPE_EXPAND = 'sunburstExpand';
DvtSunburstExpandCollapseEvent.TYPE_COLLAPSE = 'sunburstCollapse';


/**
 * Returns the id of the isolated node, if any.
 * @return {string}
 */
DvtSunburstExpandCollapseEvent.prototype.getId = function() {
  return this._id;
};
/**
 * Event Manager for Sunburst.
 *
 * @param {DvtSunburst} view The Sunburst to associate with this event manager
 * @param {DvtContext} context The platform specific context object.
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The optional object instance that the callback function is defined on.
 * @class
 * @constructor
 */
var DvtSunburstEventManager = function(view, context, callback, callbackObj) {
  DvtBaseTreeEventManager.call(this, view, context, callback, callbackObj);
};

DvtObj.createSubclass(DvtSunburstEventManager, DvtBaseTreeEventManager, 'DvtSunburstEventManager');

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
      ((DvtKeyboardEvent.isPlus(event) && !node.isDisclosed()) ||
      (DvtKeyboardEvent.isMinus(event) && node.isDisclosed()) ||
      (event.ctrlKey && keyCode == DvtKeyboardEvent.ENTER)))

  {
    node.expandCollapseNode();
    DvtEventManager.consumeEvent(event);
  }
  // rotation
  else if (sunburst && sunburst.__isRotationEnabled() &&
          (keyCode == DvtKeyboardEvent.LEFT_ARROW || keyCode == DvtKeyboardEvent.RIGHT_ARROW) &&
          !event.ctrlKey && event.altKey && event.shiftKey)
  {
    var newAngle;
    if (keyCode == DvtKeyboardEvent.LEFT_ARROW)
      newAngle = -5 * (Math.PI / 180);
    else
      newAngle = 5 * (Math.PI / 180);

    sunburst.__setRotationAnchor(0);
    sunburst.__rotate(newAngle);
    sunburst.__endRotation();
    DvtEventManager.consumeEvent(event);
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


DvtBundle.addDefaultStrings(DvtBundle.SUNBURST_PREFIX, {
  'COLOR': 'Color',
  'OTHER': 'Other',
  'SIZE': 'Size'
});
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {DvtBaseTreeDefaults}
 */
var DvtSunburstDefaults = function() {
  this.Init({'skyros': DvtSunburstDefaults.VERSION_1, 'alta': {}});
};

DvtObj.createSubclass(DvtSunburstDefaults, DvtBaseTreeDefaults, 'DvtSunburstDefaults');

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

  return D;
});