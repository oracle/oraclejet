/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit', './DvtPanZoomCanvas'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

  // Map the D namespace to dvt, which is used to provide access across partitions.
  var D = dvt;
  
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * @protected
 * Defines the context for a layout call.
 * @class DvtDiagramLayoutContext
 * @constructor
 * @param {DvtDiagramLayoutContext} context optional context to use for
 * initializing this context
 * @return {DvtDiagramLayoutContext}
 * @export
 */
var DvtDiagramLayoutContext = function(context) {
  this.Init(context);
};

DvtObj.createSubclass(DvtDiagramLayoutContext, DvtObj, 'DvtDiagramLayoutContext');


/**
 * @protected
 * Initialize the layout context.
 * @param {DvtDiagramLayoutContext} context optional layout context to copy
 * from
 */
DvtDiagramLayoutContext.prototype.Init = function(context) {
  this._layout = context ? context._layout : null;
  this._layoutAttrs = context ? context._layoutAttrs : null;
  this._nodeCount = context ? context._nodeCount : 0;
  this._linkCount = context ? context._linkCount : 0;
  this._bLocaleR2L = context ? context._bLocaleR2L : false;
  this._componentSize = context ? context._componentSize : null;
  this._viewport = context ? context._viewport : null;
  this._containerId = context ? context._containerId : null;
  this._containerPadding = context ? context._containerPadding : null;
  this._nodes = {};
  this._links = {};
  this._arNodes = [];
  this._arLinks = [];
  if (context) {
    // create copies of nodes
    for (var i = 0; i < this._nodeCount; i++) {
      var nodeCopy = new DvtDiagramLayoutContextNode(context._arNodes[i]);
      this._arNodes.push(nodeCopy);
      this._nodes[nodeCopy.getId()] = nodeCopy;
    }
    for (var nodeId in context._nodes) {
      if (!this._nodes[nodeId]) {
        this._nodes[nodeId] = new DvtDiagramLayoutContextNode(context._nodes[nodeId]);
      }
    }

    // create copies of links
    for (var i = 0; i < this._linkCount; i++) {
      var linkCopy = new DvtDiagramLayoutContextLink(context._arLinks[i]);
      this._arLinks.push(linkCopy);
      this._links[linkCopy.getId()] = linkCopy;
    }
    for (var linkId in context._links) {
      if (!this._links[linkId]) {
        this._links[linkId] = new DvtDiagramLayoutContextLink(context._links[linkId]);
      }
    }
  }
};


/**
 * @protected
 * Set the name of the layout.
 * @param {string} layout the name of the layout
 */
DvtDiagramLayoutContext.prototype.setLayout = function(layout) {
  this._layout = layout;
};


/**
 * Get the name of the layout.
 * @return {string}
 * @export
 */
DvtDiagramLayoutContext.prototype.getLayout = function() {
  return this._layout;
};


/**
 * @protected
 * Set the map of global layout attributes.
 * @param {object} layoutAttrs map of global layout attributes
 */
DvtDiagramLayoutContext.prototype.setLayoutAttributes = function(layoutAttrs) {
  this._layoutAttrs = layoutAttrs;
};


/**
 * Get the map of global layout attributes.
 * @return {object}
 * @export
 */
DvtDiagramLayoutContext.prototype.getLayoutAttributes = function() {
  return this._layoutAttrs;
};


/**
 * @protected
 * Add a node context for this layout.
 * @param {DvtDiagramLayoutContextNode} node node context to include in this layout
 */
DvtDiagramLayoutContext.prototype.addNode = function(node) {
  if (!this.getNodeById(node.getId())) {
    this._nodeCount++;
    this._arNodes.push(node);
  }

  this._nodes[node.getId()] = node;
};


/**
 * @protected
 * Add a node context to the lookup map. The map contains nodes being laid out and it might also contain
 * read-only nodes provided to support cross-container links in case of "container" layout.
 * @param {DvtDiagramLayoutContextNode} node node context to provide extra information for this layout
 */
DvtDiagramLayoutContext.prototype.addNodeToMap = function(node) {
  this._nodes[node.getId()] = node;
};


/**
 * Get a node context by id.  Nodes being laid out and read-only nodes provided
 * as additional information to this layout can be retrieved through this
 * function.
 * @param {string} id id of node context to get
 * @return {DvtDiagramLayoutContextNode}
 * @export
 */
DvtDiagramLayoutContext.prototype.getNodeById = function(id) {
  return this._nodes[id];
};


/**
 * Get a node context by index.  Only nodes being laid out can be retrieved
 * through this function.
 * @param {number} index index of node context to get
 * @return {DvtDiagramLayoutContextNode}
 * @export
 */
DvtDiagramLayoutContext.prototype.getNodeByIndex = function(index) {
  return this._arNodes[index];
};


/**
 * Get the number of nodes to layout.  This number does not include any
 * read-only nodes provided as additional information to this layout.
 * @return {number}
 * @export
 */
DvtDiagramLayoutContext.prototype.getNodeCount = function() {
  return this._nodeCount;
};


/**
 * Add a link context for this layout.
 * @param {DvtDiagramLayoutContextLink} link link context to include in this layout
 */
DvtDiagramLayoutContext.prototype.addLink = function(link) {
  if (!this.getLinkById(link.getId())) {
    this._linkCount++;
    this._arLinks.push(link);
  }

  this._links[link.getId()] = link;
};


/**
 * Get a link context by id.
 * @param {string} id id of link context to get
 * @return {DvtDiagramLayoutContextLink} link
 * @export
 */
DvtDiagramLayoutContext.prototype.getLinkById = function(id) {
  return this._links[id];
};


/**
 * Get a link context by index.
 * @param {number} index index of link context to get
 * @return {DvtDiagramLayoutContextLink}
 * @export
 */
DvtDiagramLayoutContext.prototype.getLinkByIndex = function(index) {
  return this._arLinks[index];
};


/**
 * Get the number of links to layout.
 * @return {number}
 * @export
 */
DvtDiagramLayoutContext.prototype.getLinkCount = function() {
  return this._linkCount;
};


/**
 * Convert a point in the coordinate system of the given node to the global
 * coordinate system of this layout.  For example, this can be used to convert
 * the position of a node inside a container to a point in the container's
 * parent coordinate system.
 * @param {DvtDiagramPoint} point point in the coordinate system of the given
 * node
 * @param {DvtDiagramLayoutContextNode} node node that defines coordinate
 * system of given point
 * @return {DvtDiagramPoint}
 * @export
 */
DvtDiagramLayoutContext.prototype.localToGlobal = function(point, node) {
  var offset = this.GetGlobalOffset(node);

  return new DvtDiagramPoint(point['x'] + offset['x'], point['y'] + offset['y']);
};


/**
 * @protected
 * Get the position of the given node in the global coordinate system.
 * @param {DvtDiagramLayoutContextNode} node node to get global position for
 * @return {DvtDiagramPoint}
 */
DvtDiagramLayoutContext.prototype.GetGlobalOffset = function(node) {
  var offset = new DvtDiagramPoint(0, 0);
  while (node) {
    offset['x'] += node.ContentOffset['x'] + node.getPosition()['x'];
    offset['y'] += node.ContentOffset['y'] + node.getPosition()['y'];

    var containerId = node.getContainerId();
    if (containerId) {
      node = this.getNodeById(containerId);

      //if there is a container node parent, then add that
      //containerPadding to the offset
      if (node && node.isDisclosed()) {
        var containerPadding = node.getContainerPadding();
        if (containerPadding) {
          offset['x'] += containerPadding['left'];
          offset['y'] += containerPadding['top'];
        }
      }
    }
    else {
      node = null;
    }
  }

  return offset;
};


/**
 * @protected
 * Set whether the locale has a right-to-left reading direction.
 * @param {boolean} bR2L true if right-to-left, false otherwise
 */
DvtDiagramLayoutContext.prototype.setLocaleR2L = function(bR2L) {
  this._bLocaleR2L = bR2L;
};


/**
 * Get whether the reading direction for the locale is right-to-left.
 * @return {boolean}
 * @export
 */
DvtDiagramLayoutContext.prototype.isLocaleR2L = function() {
  return this._bLocaleR2L;
};


/**
 * @protected
 * Set the size of the Diagram.
 * @param {DvtDiagramRectangle} compSize size of Diagram
 */
DvtDiagramLayoutContext.prototype.setComponentSize = function(compSize) {
  this._componentSize = compSize;
};


/**
 * Get the size of the Diagram.
 * @return {DvtDiagramRectangle}
 * @export
 */
DvtDiagramLayoutContext.prototype.getComponentSize = function() {
  return this._componentSize;
};


/**
 * Set the viewport the component should use after the layout, in the layout's
 * coordinate system.
 * @param {DvtDiagramRectangle} viewport viewport the component should use
 * after the layout
 * @export
 */
DvtDiagramLayoutContext.prototype.setViewport = function(viewport) {
  this._viewport = viewport;
};


/**
 * Get the viewport the component should use after the layout, in the layout's
 * coordinate system.
 * @return {DvtDiagramRectangle}
 * @export
 */
DvtDiagramLayoutContext.prototype.getViewport = function() {
  return this._viewport;
};


/**
 * @protected
 * Set the id of the container whose nodes are being laid out.
 * @param {string} containerId id of the container whose nodes are being laid
 * out
 */
DvtDiagramLayoutContext.prototype.setContainerId = function(containerId) {
  this._containerId = containerId;
};


/**
 * Get the id of the container whose nodes are being laid out, or null if this
 * is the top level Diagram layout.
 * @return {string}
 * @export
 */
DvtDiagramLayoutContext.prototype.getContainerId = function() {
  return this._containerId;
};


/**
 * Set the padding of the container whose children are being laid out.
 * The top, right, bottom, left can be specified as a number or "auto". Default value: 10px.
 *
 * - When "auto" is specified and facet preferred size is larger than available known space for the facet,
 * the padding will be set to the difference between preferred size and available known size.
 * - When "auto" is specified and facet preferred size is smaller than available known space for the facet,
 * the facet will be rendered the same way as today using the available space.
 * - When "auto" is specified for both sides - top and bottom or left and right, the content will be centered horizontally or vertically.
 * - When "auto" is specified and facet elements use % for its width or height,
 *  the facet will be rendered into preferred space and the % will be ignored.
 *
 *  If the 'top' parameter is a string or a number, the container padding will be set from the individual 'top',
 *  'right', 'bottom', and 'left' parameters.
 *  Otherwise, 'top' is assumed to be an Object with 'top', 'right', 'bottom', and 'left' keys.  All other parameters will be ignored.
 *  Default Values will be used when values are missing.
 *
 * @param {number|string|object} top top padding if number or string, if object,
 * contains all padding values and rest of parameters ignored
 * @param {number|string} right right padding
 * @param {number|string} bottom bottom padding
 * @param {number|string} left left padding
 * @export
 */
DvtDiagramLayoutContext.prototype.setContainerPadding = function(top, right, bottom, left) {
  //if the layout is not being applied to a container's children, don't save container padding
  if (this.getContainerId()) {
    this._containerPadding = {};
    if (!(typeof top === 'number' || typeof top === 'string')) {
      left = top['left'];
      right = top['right'];
      bottom = top['bottom'];
      top = top['top'];
    }
    this._containerPadding['top'] = top;
    this._containerPadding['right'] = right;
    this._containerPadding['bottom'] = bottom;
    this._containerPadding['left'] = left;
  }
};


/**
 * Get the padding of the container whose children are being laid out.
 * Values can be retrieved from the returned map using keys 'top', 'left',
 * 'bottom', and 'right'.
 * @return {object}
 * @export
 */
DvtDiagramLayoutContext.prototype.getContainerPadding = function() {
  return this._containerPadding;
};


/**
 * Set the current viewport used by the component in the layout's coordinate system.
 * @param {DvtDiagramRectangle} viewport The viewport currently used by the component
 */
DvtDiagramLayoutContext.prototype.setCurrentViewport = function(viewport) {
  this._currentViewport = viewport;
};


/**
 * Get the current viewport used by the component in the layout's coordinate system for the top level diagram
 * @return {DvtDiagramRectangle} current viewport
 * @export
 */
DvtDiagramLayoutContext.prototype.getCurrentViewport = function() {
  return this._currentViewport;
};
// Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.



/**
 * @protected
 * Defines the link context for a layout call.
 * @class DvtDiagramLayoutContextLink
 * @constructor
 * @param {DvtDiagramLayoutContextLink} link optional context to use for
 * initializing this context
 * @export
 */
var DvtDiagramLayoutContextLink = function(link) {
  this.Init(link);
};

DvtObj.createSubclass(DvtDiagramLayoutContextLink, DvtObj, 'DvtDiagramLayoutContextLink');


/**
 * @protected
 * Initialize the layout context.
 * @param {DvtDiagramLayoutContextLink} link optional layout context to
 * copy from
 */
DvtDiagramLayoutContextLink.prototype.Init = function(link) {
  this._id = link ? link._id : null;
  this._startId = link ? link._startId : null;
  this._endId = link ? link._endId : null;
  this._points = link ? link._points : null;
  this._labelPosition = link ? link._labelPosition : null;
  this._labelBounds = link ? link._labelBounds : null;
  this._layoutAttrs = link ? link._layoutAttrs : null;
  this._startConnectorOffset = link ? link._startConnectorOffset : 0;
  this._endConnectorOffset = link ? link._endConnectorOffset : 0;
  this._linkWidth = link ? link._linkWidth : 1;
  this._selected = link ? link._selected : false;
  this._labelRotAngle = link ? link._labelRotAngle : null;
  this._labelRotPoint = link ? link._labelRotPoint : null;
  this._bPromoted = link ? link._bPromoted : false;
};


/**
 * @protected
 * Set the id of the link.
 * @param {string} id id of the link
 */
DvtDiagramLayoutContextLink.prototype.setId = function(id) {
  this._id = id;
};


/**
 * Get the id of the link.
 * @return {string}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getId = function() {
  return this._id;
};


/**
 * @protected
 * Set the id of the start node of this link.
 * @param {string} id id of the start node
 */
DvtDiagramLayoutContextLink.prototype.setStartId = function(id) {
  this._startId = id;
};


/**
 * Get the id of the start node of this link.
 * @return {string}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getStartId = function() {
  return this._startId;
};


/**
 * @protected
 * Set the id of the end node of this link.
 * @param {string} id id of the end node
 */
DvtDiagramLayoutContextLink.prototype.setEndId = function(id) {
  this._endId = id;
};


/**
 * Get the id of the end node of this link.
 * @return {string}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getEndId = function() {
  return this._endId;
};


/**
 * Set the points to use for rendering this link.  The given points can contain an array of
 * coordinates, like [x1, y1, x2, y2, ..., xn, yn], SVG path commands, like
 * ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn] or a string containing SVG path
 * command sequences, like 'Mx1,y1 Cx2,y2 x3,y3 x4,y4 ...'.
 * The points are in the coordinate system of the link's container.
 * @param {array|string} points array of points or a string with SVG path to use for rendering this link
 * @export
 */
DvtDiagramLayoutContextLink.prototype.setPoints = function(points) {
  if (typeof points == 'string')
    this._points = DvtPathUtils.createPathArray(points);
  else
    this._points = points;
};


/**
 * Get the points to use for rendering this link.  The returned array can
 * contain coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path
 * commands, like ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].  The points
 * are in the coordinate system of the link's container.
 * @return {array}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getPoints = function() {
  return this._points;
};


/**
 * Set the position of the link label.  The position is in the coordinate
 * system of the link's container.
 * @param {DvtDiagramPoint} pos position of the link label
 * @export
 */
DvtDiagramLayoutContextLink.prototype.setLabelPosition = function(pos) {
  this._labelPosition = pos;
};


/**
 * Get the position of the link label.  The position is in the coordinate
 * system of the link's container.
 * @param {DvtDiagramPoint} pos position of the link label
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getLabelPosition = function() {
  return this._labelPosition;
};


/**
 * @protected
 * Set the label bounds.  The bounds are in the coordinate system of the label.
 * @param {DvtDiagramRectangle} bounds label bounds
 */
DvtDiagramLayoutContextLink.prototype.setLabelBounds = function(bounds) {
  this._labelBounds = bounds;
};


/**
 * Get the label bounds.  The bounds are in the coordinate system of the label.
 * @return {DvtDiagramRectangle}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getLabelBounds = function() {
  return this._labelBounds;
};


/**
 * @protected
 * Set the offset of the start connector.  This is the amount of space that the
 * link should leave between its starting point and the node for the connector
 * to be drawn.
 * @param {number} offset offset of the start connector
 */
DvtDiagramLayoutContextLink.prototype.setStartConnectorOffset = function(offset) {
  this._startConnectorOffset = offset;
};


/**
 * Get the offset of the start connector.  This is the amount of space that the
 * link should leave between its starting point and the node for the connector
 * to be drawn.
 * @return {number}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getStartConnectorOffset = function() {
  return this._startConnectorOffset;
};


/**
 * @protected
 * Set the offset of the end connector.  This is the amount of space that the
 * link should leave between its ending point and the node for the connector
 * to be drawn.
 * @param {number} offset offset of the end connector
 */
DvtDiagramLayoutContextLink.prototype.setEndConnectorOffset = function(offset) {
  this._endConnectorOffset = offset;
};


/**
 * Get the offset of the end connector.  This is the amount of space that the
 * link should leave between its ending point and the node for the connector
 * to be drawn.
 * @return {number}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getEndConnectorOffset = function() {
  return this._endConnectorOffset;
};


/**
 * @protected
 * Set the width of this link.
 * @param {number} ww width of the link
 */
DvtDiagramLayoutContextLink.prototype.setLinkWidth = function(ww) {
  this._linkWidth = ww;
};


/**
 * Get the width of this link.
 * @return {number}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getLinkWidth = function() {
  return this._linkWidth;
};


/**
 * @protected
 * Set the map of link layout attributes.
 * @param {object} layoutAttrs map of link layout attributes
 */
DvtDiagramLayoutContextLink.prototype.setLayoutAttributes = function(layoutAttrs) {
  this._layoutAttrs = layoutAttrs;
};


/**
 * Get the map of link layout attributes.
 * @return {object}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getLayoutAttributes = function() {
  return this._layoutAttrs;
};


/**
 * @protected
 * Set whether this link is selected.
 * @param {boolean} selected true if selected, false otherwise
 */
DvtDiagramLayoutContextLink.prototype.setSelected = function(selected) {
  this._selected = selected;
};


/**
 * Determine whether this link is selected.
 * @return {boolean}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getSelected = function() {
  return this._selected;
};


/**
 * Set the angle of rotation of the link label, relative to the label
 * rotation point, in radians.
 * @param {number} angle angle of rotation
 * @export
 */
DvtDiagramLayoutContextLink.prototype.setLabelRotationAngle = function(angle) {
  this._labelRotAngle = angle;
};


/**
 * Get the angle of rotation of the link label, relative to the label
 * rotation point, in radians.
 * @return {number}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getLabelRotationAngle = function() {
  return this._labelRotAngle;
};


/**
 * Set the point about which to rotate the link label, in the coordinate
 * system of the label.
 * @param {DvtDiagramPoint} point label rotation point
 * @export
 */
DvtDiagramLayoutContextLink.prototype.setLabelRotationPoint = function(point) {
  this._labelRotPoint = point;
};


/**
 * Get the point about which to rotate the link label, in the coordinate
 * system of the label.
 * @return {DvtDiagramPoint}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.getLabelRotationPoint = function() {
  return this._labelRotPoint;
};


/**
 * @protected
 * Set whether this link is promoted.
 * @param {boolean} bPromoted true if promoted, false otherwise
 */
DvtDiagramLayoutContextLink.prototype.setPromoted = function(bPromoted) {
  this._bPromoted = bPromoted;
};


/**
 * Determine whether this link is promoted.
 * @param {boolean}
 * @export
 */
DvtDiagramLayoutContextLink.prototype.isPromoted = function() {
  return this._bPromoted;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * @protected
 * Defines the node context for a layout call.
 * @class DvtDiagramLayoutContextNode
 * @constructor
 * @param {DvtDiagramLayoutContextNode} node optional context to use for
 * initializing this context
 * @return {DvtDiagramLayoutContextNode}
 * @export
 */
var DvtDiagramLayoutContextNode = function(node) {
  this.Init(node);
};

DvtObj.createSubclass(DvtDiagramLayoutContextNode, DvtObj, 'DvtDiagramLayoutContextNode');


/**
 * @protected
 * Initialize the layout context.
 * @param {DvtDiagramLayoutContextNode} node optional layout context to
 * copy from
 */
DvtDiagramLayoutContextNode.prototype.Init = function(node) {
  this._id = node ? node._id : null;
  this._bounds = node ? node._bounds : null;
  this._contentBounds = node ? node._contentBounds : null;
  this._position = node ? node._position : null;
  this._labelPosition = node ? node._labelPosition : null;
  this._labelBounds = node ? node._labelBounds : null;
  this._layoutAttrs = node ? node._layoutAttrs : null;
  this._bReadOnly = node ? node._bReadOnly : false;
  this._containerId = node ? node._containerId : null;
  this._selected = node ? node._selected : false;
  this._labelRotAngle = node ? node._labelRotAngle : null;
  this._labelRotPoint = node ? node._labelRotPoint : null;
  this._containerPadding = node ? node._containerPadding : null;
  this._origBounds = node ? node._origBounds : null;
  this._origContentBounds = node ? node._origContentBounds : null;
  this._bDisclosed = node ? node._bDisclosed : false;
  this.Component = node ? node.GetDiagram() : null;
  this.IsRendered = true;
  this.ContentOffset = new DvtDiagramPoint(0, 0); //used by global layout for nodes inside container
};


/**
 * @protected
 * Set the id of the node.
 * @param {string} id id of the node
 */
DvtDiagramLayoutContextNode.prototype.setId = function(id) {
  this._id = id;
};


/**
 * Get the id of the node.
 * @return {string}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getId = function() {
  return this._id;
};


/**
 * @protected
 * Set the bounds of the node.  The bounds include any overlays.
 * The bounds are in the coordinate system of the node.
 * @param {DvtDiagramRectangle} bounds bounds of the node
 */
DvtDiagramLayoutContextNode.prototype.setBounds = function(bounds) {
  this._bounds = bounds;
  //save the original bounds, in case there is container padding
  this._origBounds = bounds;
};


/**
 * Get the bounds of the node.  The bounds include any overlays.
 * The bounds are in the coordinate system of the node.
 * @return {DvtDiagramRectangle}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getBounds = function() {
  if (!this.IsRendered && this.Component)
    this.Component.renderNodeFromContext(this);
  return this._bounds;
};


/**
 * @protected
 * Set the bounds of the node content.  The bounds do not include any overlays.
 * The bounds are in the coordinate system of the node.
 * @param {DvtDiagramRectangle} bounds content bounds of the node
 */
DvtDiagramLayoutContextNode.prototype.setContentBounds = function(bounds) {
  this._contentBounds = bounds;
  //save the original bounds, in case there is container padding
  this._origContentBounds = bounds;
};


/**
 * Get the bounds of the node content.  The bounds do not include any overlays.
 * The bounds are in the coordinate system of the node.
 * @return {DvtDiagramRectangle}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getContentBounds = function() {
  if (!this.IsRendered && this.Component)
    this.Component.renderNodeFromContext(this);
  return this._contentBounds;
};


/**
 * Set the position of the node.  The position is in the coordinate system of
 * the node's container.
 * @param {DvtDiagramPoint} pos position of the node
 * @export
 */
DvtDiagramLayoutContextNode.prototype.setPosition = function(pos) {
  this._position = pos;
  this._updateParentNodes(this);
};

/**
 * Get the position of the node.  The position is in the coordinate system of
 * the node's container.
 * @return {DvtDiagramPoint}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getPosition = function() {
  return this._position;
};


/**
 * Set the position of the node label.  The position is in the coordinate
 * system of the node's container.
 * @param {DvtDiagramPoint} pos position of the node label
 * @export
 */
DvtDiagramLayoutContextNode.prototype.setLabelPosition = function(pos) {
  this._labelPosition = pos;
};


/**
 * Get the position of the node label.  The position is in the coordinate
 * system of the node's container.
 * @return {DvtDiagramPoint}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getLabelPosition = function() {
  return this._labelPosition;
};


/**
 * @protected
 * Set the label bounds.  The bounds are in the coordinate system of the label.
 * @param {DvtDiagramRectangle} bounds label bounds
 */
DvtDiagramLayoutContextNode.prototype.setLabelBounds = function(bounds) {
  this._labelBounds = bounds;
};


/**
 * Get the label bounds.  The bounds are in the coordinate system of the label.
 * @return {DvtDiagramRectangle}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getLabelBounds = function() {
  return this._labelBounds;
};


/**
 * @protected
 * Set the map of node layout attributes.
 * @param {object} layoutAttrs map of node layout attributes
 */
DvtDiagramLayoutContextNode.prototype.setLayoutAttributes = function(layoutAttrs) {
  this._layoutAttrs = layoutAttrs;
};


/**
 * Get the map of node layout attributes.
 * @return {object}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getLayoutAttributes = function() {
  return this._layoutAttrs;
};


/**
 * @protected
 * Set whether the node is read-only.  A read-only node cannot be positioned
 * by this layout call, and is only provided as additional information that may
 * be used when laying out other nodes.
 * @param {boolean} bReadOnly true if this node is read-only, false otherwise
 */
DvtDiagramLayoutContextNode.prototype.setReadOnly = function(bReadOnly) {
  this._bReadOnly = bReadOnly;
};


/**
 * Determine whether this node is read-only.  A read-only node cannot be
 * positioned by this layout call, and is only provided as additional
 * information that may be used when laying out other nodes.
 * @return {boolean}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.isReadOnly = function() {
  return this._bReadOnly;
};


/**
 * @protected
 * Set the id of this node's container.
 * @param {string} id id of this node's container
 */
DvtDiagramLayoutContextNode.prototype.setContainerId = function(id) {
  this._containerId = id;
};


/**
 * Get the id of this node's container, or null if this is the top-level
 * Diagram layout.
 * @return {string}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getContainerId = function() {
  return this._containerId;
};


/**
 * @protected
 * Set whether this node is selected.
 * @param {boolean} selected true if selected, false otherwise
 */
DvtDiagramLayoutContextNode.prototype.setSelected = function(selected) {
  this._selected = selected;
};


/**
 * Determine whether this node is selected.
 * @return {boolean}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getSelected = function() {
  return this._selected;
};


/**
 * Set the angle of rotation of the node label, relative to the label
 * rotation point, in radians.
 * @param {number} angle angle of rotation
 * @export
 */
DvtDiagramLayoutContextNode.prototype.setLabelRotationAngle = function(angle) {
  this._labelRotAngle = angle;
};


/**
 * Get the angle of rotation of the node label, relative to the label
 * rotation point, in radians.
 * @return {number}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getLabelRotationAngle = function() {
  return this._labelRotAngle;
};


/**
 * Set the point about which to rotate the node label, in the coordinate
 * system of the label.
 * @param {DvtDiagramPoint} point label rotation point
 * @export
 */
DvtDiagramLayoutContextNode.prototype.setLabelRotationPoint = function(point) {
  this._labelRotPoint = point;
};


/**
 * Get the point about which to rotate the node label, in the coordinate
 * system of the label.
 * @return {DvtDiagramPoint}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getLabelRotationPoint = function() {
  return this._labelRotPoint;
};


/**
 * @protected
 * Set the padding of this container.
 * @param {object} obj map defining values for keys 'top', 'left', 'bottom',
 * and 'right'
 */
DvtDiagramLayoutContextNode.prototype.SetContainerPaddingObj = function(obj) {
  //if this node isn't disclosed, don't save any container padding
  if (this.isDisclosed()) {
    this._containerPadding = obj;

    //this function is called by the DvtDiagram when initializing the
    //layout context, so the original bounds already include the container
    //padding, and we need to subtract it out here
    if (obj) {
      if (this._origBounds) {
        this._origBounds = new DvtDiagramRectangle(
            this._origBounds['x'], this._origBounds['y'],
            this._origBounds['w'] - (obj['left'] + obj['right']),
            this._origBounds['h'] - (obj['top'] + obj['bottom']));
      }
      if (this._origContentBounds) {
        this._origContentBounds = new DvtDiagramRectangle(
            this._origContentBounds['x'], this._origContentBounds['y'],
            this._origContentBounds['w'] - (obj['left'] + obj['right']),
            this._origContentBounds['h'] - (obj['top'] + obj['bottom']));
      }
    }
  }
};


/**
 * Set the padding of this container.
 * The top, right, bottom, left can be specified as a number or "auto". Default value: 10px.
 *
 * - When "auto" is specified and facet preferred size is larger than available known space for the facet,
 * the padding will be set to the difference between preferred size and available known size.
 * - When "auto" is specified and facet preferred size is smaller than available known space for the facet,
 * the facet will be rendered the same way as today using the available space.
 * - When "auto" is specified for both sides - top and bottom or left and right, the content will be centered horizontally or vertically.
 * - When "auto" is specified and facet elements use % for its width or height,
 *  the facet will be rendered into preferred space and the % will be ignored.
 *
 *  If the 'top' parameter is a string or a number, the container padding will be set from the individual 'top',
 *  'right', 'bottom', and 'left' parameters.
 *  Otherwise, 'top' is assumed to be an Object with 'top', 'right', 'bottom', and 'left' keys.  All other parameters will be ignored.
 *  Default Values will be used when values are missing.
 *
 * @param {number|string|object } top top padding if number or string, if object,
 * contains all padding values and rest of parameters ignored
 * @param {number|string} right right padding
 * @param {number|string} bottom bottom padding
 * @param {number|string} left left padding
 * @export
 */
DvtDiagramLayoutContextNode.prototype.setContainerPadding = function(top, right, bottom, left) {
  //if this node isn't disclosed, don't save any container padding
  if (this.isDisclosed()) {
    this._containerPadding = {};
    if (!(typeof top === 'number' || typeof top === 'string')) {
      left = top['left'];
      right = top['right'];
      bottom = top['bottom'];
      top = top['top'];
    }
    this._containerPadding['top'] = top;
    this._containerPadding['right'] = right;
    this._containerPadding['bottom'] = bottom;
    this._containerPadding['left'] = left;

    //this function is called by the layout engine to set the container padding,
    //so we need to update the current bounds based on the original bounds
    //plus the new container padding
    if (this._origBounds) {
      this._bounds = new DvtDiagramRectangle(
          this._origBounds['x'], this._origBounds['y'],
          this._origBounds['w'] + left + right,
          this._origBounds['h'] + top + bottom);
    }
    if (this._origContentBounds) {
      this._contentBounds = new DvtDiagramRectangle(
          this._origContentBounds['x'], this._origContentBounds['y'],
          this._origContentBounds['w'] + left + right,
          this._origContentBounds['h'] + top + bottom);
    }
  }
};


/**
 * Get the padding of this container.  Values can be retrieved from the
 * returned map using keys 'top', 'left', 'bottom', and 'right'.
 * @return {object}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getContainerPadding = function() {
  return this._containerPadding;
};


/**
 * @protected
 * Set whether this container is disclosed.
 * @param {boolean} bDisclosed true if this container is disclosed, false
 * otherwise
 */
DvtDiagramLayoutContextNode.prototype.setDisclosed = function(bDisclosed) {
  this._bDisclosed = bDisclosed;
};


/**
 * Determine whether this container is disclosed.
 * @return {boolean}
 * @export
 */
DvtDiagramLayoutContextNode.prototype.isDisclosed = function() {
  return this._bDisclosed;
};


/**
 * @protected
 * Set child nodes for the container. Child nodes are populated for global layout only.
 * @param {array} childNodes array of DvtDiagramLayoutContextNode objects
 */
DvtDiagramLayoutContextNode.prototype.setChildNodes = function(childNodes) {
  this._childNodes = childNodes;
};

/**
 * Visible child nodes for the disclosed container. Child nodes are populated for global layout only.
 * @return {array} array of DvtDiagramLayoutContextNode objects
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getChildNodes = function() {
  return this._childNodes;
};

/**
 * @protected
 * Set parent node. The member is populated for global layout option
 * @param {DvtDiagramLayoutContextNode} parentNode parent node
 */
DvtDiagramLayoutContextNode.prototype.setParentNode = function(parentNode) {
  this._parentNode = parentNode;
};

/**
 * Get parent node. The member is populated for global layout option.
 * @return {DvtDiagramLayoutContextNode} parent node
 * @export
 */
DvtDiagramLayoutContextNode.prototype.getParentNode = function() {
  return this._parentNode;
};

/**
 * Resets IsRendered flag for parent nodes.
 * Relevant for global layout option, when parent container is already rendered, but a child node changes position
 * the parent node should be marked as not rendered
 * @param {DvtDiagramLayoutContextNode} node current node
 * @private
 */
DvtDiagramLayoutContextNode.prototype._updateParentNodes = function(node) {
  var parent = node.getParentNode();
  if (parent && parent.IsRendered) {
    parent.IsRendered = false;
    this._updateParentNodes(parent);
  }
};
// Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.



/**
 * Defines an (x,y) coordinate.
 * @class DvtDiagramPoint
 * @constructor
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 * @export
 */
var DvtDiagramPoint = function(x,y) {
  this.Init(x, y);
};

DvtObj.createSubclass(DvtDiagramPoint, DvtObj, 'DvtDiagramPoint');


/**
 * @protected
 * Initialize the point.
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 */
DvtDiagramPoint.prototype.Init = function(x, y) {
  this['x'] = ((x === null || isNaN(x)) ? 0 : x);
  this['y'] = ((y === null || isNaN(y)) ? 0 : y);
};
// Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.



/**
 * Defines the geometry of a rectangle. Top-left (x,y), and width and height.
 * @class DvtDiagramRectangle
 * @constructor
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 * @param {number} w width
 * @param {number} h height
 * @type {DvtDiagramRectangle}
 * @export
 */
var DvtDiagramRectangle = function(x,y,w,h) {
  this.Init(x, y, w, h);
};

DvtObj.createSubclass(DvtDiagramRectangle, DvtObj, 'DvtDiagramRectangle');


/**
 * @protected
 * Initialize the rectangle.
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 * @param {number} w width
 * @param {number} h height
 */
DvtDiagramRectangle.prototype.Init = function(x,y,w,h) {
  this['x'] = ((x === null || isNaN(x)) ? 0 : x);
  this['y'] = ((y === null || isNaN(y)) ? 0 : y);
  this['w'] = ((w === null || isNaN(w)) ? 0 : w);
  this['h'] = ((h === null || isNaN(h)) ? 0 : h);
};
/**
 * @param {DvtContext} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @constructor
 * @export
 */
var DvtBaseDiagram = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

DvtObj.createSubclass(DvtBaseDiagram, DvtPanZoomComponent, 'DvtBaseDiagram');

/**
 * Initialization method called by the constructor
 *
 * @param {DvtContext} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 */
DvtBaseDiagram.prototype.Init = function(context, callback, callbackObj) {
  DvtBaseDiagram.superclass.Init.call(this, context, callback, callbackObj);

  //: force text to scale linearly
  this.getCtx().getStage().getElem().setAttributeNS(null, 'text-rendering', 'geometricPrecision');

  this._layoutOffset;
  this._layoutViewport = null;
  this._layoutViewportContainerId = null;
  this._initAnim;
  //: flag used to disable the init anim on PPR
  this._bInitAnimEnabled = true;

  this._linksPane = new DvtContainer(context);
  this._nodesPane = new DvtContainer(context);
  this._topPane = new DvtContainer(context);
  this._animationDuration = DvtPanZoomCanvas.DEFAULT_ANIMATION_DURATION;
  this.InitializeZoomLimits();
};

/**
 * @protected
 * Called by the renderComponent() method. Used to initialize or reinitialize the component before rendering.
 */
DvtBaseDiagram.prototype.InitComponentInternal = function() {
  // Create the event handler and add event listeners
  var pzc = this.getPanZoomCanvas();
  pzc.setMinZoom(this.getMinZoom());
  pzc.setMaxZoom(this.getMaxZoom());
  pzc.setAnimationDuration(this.getAnimationDuration());
  pzc.getContentPane().addChild(this._linksPane);
  pzc.getContentPane().addChild(this._nodesPane);
  pzc.getContentPane().addChild(this._topPane);
};

/**
 * Sets the animation duration (in seconds)
 * @param {string} animationDuration the animation duration (in seconds)
 */
DvtBaseDiagram.prototype.setAnimationDuration = function(animationDuration) {
  this._animationDuration = animationDuration;
  if (this.getPanZoomCanvas()) {
    this.getPanZoomCanvas().setAnimationDuration(animationDuration);
  }
};

/**
 * Gets the animation duration (in seconds)
 * @return {number} the animation duration (in seconds)
 */
DvtBaseDiagram.prototype.getAnimationDuration = function() {
  return this._animationDuration;
};

/**
 * Sets the maximum zoom level
 * @param {number} maxZoom maximum zoom level
 */
DvtBaseDiagram.prototype.setMaxZoom = function(maxZoom) {
  this._maxZoom = maxZoom;
  if (this.getPanZoomCanvas()) {
    this.getPanZoomCanvas().setMaxZoom(maxZoom);
  }
};

/**
 * Gets the maximum zoom level
 * @return {number} maximum zoom level
 */
DvtBaseDiagram.prototype.getMaxZoom = function() {
  return this._maxZoom;
};

/**
 * Sets the minimum zoom level
 * @param {number} minZoom minimum zoom level
 */
DvtBaseDiagram.prototype.setMinZoom = function(minZoom) {
  this._minZoom = minZoom;
  if (this.getPanZoomCanvas()) {
    this.getPanZoomCanvas().setMinZoom(minZoom);
  }
};

/**
 * Gets the minimum zoom level
 * @return {number} minimum zoom level
 */
DvtBaseDiagram.prototype.getMinZoom = function() {
  return this._minZoom;
};

/**
 * Initializes the minimum and maximum zoom levels of the panZoomCanvas
 */
DvtBaseDiagram.prototype.InitializeZoomLimits = function() {
  this.setMaxZoom(2.0);
  this.setMinZoom(0.0);
};

/**
 * @override
 */
DvtBaseDiagram.prototype.Render = function() {
  if (!this._handledEventXml) {
    DvtBaseDiagram.superclass.Render.call(this);
    this.InitComponentInternal();
    this.RenderComponentInternal();
  }
  this._handledEventXml = false;
};

/**
 * Renders a Diagram component after it was initialized.
 * @param {DvtAnimator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @protected
 */
DvtBaseDiagram.prototype.RenderComponentInternal = function(animator) {
  //subclasses should override
};

/**
 * Gets a node by specified id
 * @param {string} id node id
 * @return {DvtBaseDiagramNode} diagram node
 */
DvtBaseDiagram.prototype.getNodeById = function(id) {
  return null;
};

/**
 * Gets a link by specified id
 * @param {string} id link id
 * @return {DvtBaseDiagramLink} diagram link
 */
DvtBaseDiagram.prototype.getLinkById = function(id) {
  return null;
};

/**
 * Gets an array of link ids
 * @return {array} array of link ids
 */
DvtBaseDiagram.prototype.GetAllLinks = function() {
  return [];
};

/**
 * Gets an array of node ids
 * @return {array} array of node ids
 */
DvtBaseDiagram.prototype.GetAllNodes = function() {
  return [];
};

/**
 * @export
 * Get the number of nodes in diagram
 * @return {Number} number of nodes
 */
DvtBaseDiagram.prototype.getNodeCount = function() {
  return this.GetAllNodes().length;
};

/**
 * @export
 * Get the number of links in diagram
 * @return {Number} number of links
 */
DvtBaseDiagram.prototype.getLinkCount = function() {
  return this.GetAllLinks().length;
};

/**
 * Refreshes the empty text message, centered in the available space.
 *
 * @param {boolean} emptyDiagram True if empty text should be rendered, false otherwise
 * @protected
 */
DvtBaseDiagram.prototype.RefreshEmptyText = function(emptyDiagram) {
  if (emptyDiagram && this.getEmptyText()) {
    if (!this._emptyTextDisplay) {
      // Create the text and position it in the middle of the available space
      this._emptyTextDisplay = this.CreateEmptyText(this.getEmptyText());
    }
    else {
      this._emptyTextDisplay.setX(this.Width / 2);
      this._emptyTextDisplay.setY(this.Height / 2);
      DvtTextUtils.fitText(this._emptyTextDisplay, this.getWidth() - 2 * DvtTextUtils.EMPTY_TEXT_BUFFER, Infinity, this);
    }
  }
  else {
    if (this._emptyTextDisplay) {
      var parent = this._emptyTextDisplay.getParent();
      if (parent) {
        parent.removeChild(this._emptyTextDisplay);
      }
      this._emptyTextDisplay = null;
    }
  }
};

/**
 * Creates empty text
 * @param {string} text a text for the empty component
 * @return {DvtOutputText}
 * @protected
 */
DvtBaseDiagram.prototype.CreateEmptyText = function(text) {
  var options = this.getOptions();
  return DvtTextUtils.renderEmptyText(this, text, new DvtRectangle(0, 0, this.getWidth(), this.getHeight()), this.getEventManager(), options['_statusMessageStyle']);
};

/**
 * Sets a text for the empty component
 * @param {string} text text for the empty component
 */
DvtBaseDiagram.prototype.setEmptyText = function(text) {
  this._emptyText = text;
};

/**
 * Gets a text for the empty component
 * @return {string} text for the empty component
 */
DvtBaseDiagram.prototype.getEmptyText = function() {
  return this._emptyText;
};

/**
 * Sets panning option for diagram
 * @param {boolean} panningEnabled true if panning enabled
 * @protected
 */
DvtBaseDiagram.prototype.SetPanningEnabled = function(panningEnabled) {
  this._panningEnabled = panningEnabled;
};

/**
 * Gets panning option for diagram
 * @return {boolean} true if panning enabled
 * @protected
 */
DvtBaseDiagram.prototype.IsPanningEnabled = function() {
  return this._panningEnabled;
};

/**
 * Sets zooming option for diagram
 * @param {boolean} zoomingEnabled true if zooming enabled
 * @protected
 */
DvtBaseDiagram.prototype.SetZoomingEnabled = function(zoomingEnabled) {
  this._zoomingEnabled = zoomingEnabled;
};

/**
 * Gets zooming option for diagram
 * @return {boolean} true if zooming enabled
 * @protected
 */
DvtBaseDiagram.prototype.IsZoomingEnabled = function() {
  return this._zoomingEnabled;
};

/**
 * Sets the initial animation
 * @param {string} anim the data change animation: "auto" or "none"
 */
DvtBaseDiagram.prototype.setInitAnim = function(anim) {
  this._initAnim = anim;
};

/**
 * Gets initial animation
 * @return {string} the initial animation: "auto" or "none"
 */
DvtBaseDiagram.prototype.getInitAnim = function() {
  return this._initAnim;
};

/**
 * Sets initial animation flag
 * @param {boolean} enabled true if initial animation enabled
 */
DvtBaseDiagram.prototype.setInitAnimEnabled = function(enabled) {
  this._bInitAnimEnabled = enabled;
};

/**
 * Chacks whether initial animation enabled
 * @return {boolean} true if initial animation enabled
 * @protected
 */
DvtBaseDiagram.prototype.IsInitAnimEnabled = function() {
  return this._bInitAnimEnabled;
};

/**
 * Sets the data change animation
 * @param {string} anim the data change animation: "auto" or "none"
 */
DvtBaseDiagram.prototype.setDataChangeAnim = function(anim) {
  this._dataChangeAnim = anim;
};

/**
 * Gets the data change animation
 * @return {string} the data change animation: "auto" or "none"
 */
DvtBaseDiagram.prototype.getDataChangeAnim = function() {
  return this._dataChangeAnim;
};

/**
 * Gets selection handler
 * @return {DvtSelectionHandler} selection handler
 */
DvtBaseDiagram.prototype.getSelectionHandler = function() {
  return this._selectionHandler;
};

/**
 * Sets the selection mode for the component
 * @param {string} selectionMode valid values DvtSelectionHandler.TYPE_SINGLE, DvtSelectionHandler.TYPE_MULTIPLE or null
 */
DvtBaseDiagram.prototype.setSelectionMode = function(selectionMode) {
  if (selectionMode == 'single')
    this._selectionHandler = new DvtSelectionHandler(DvtSelectionHandler.TYPE_SINGLE);
  else if (selectionMode == 'multiple')
    this._selectionHandler = new DvtSelectionHandler(DvtSelectionHandler.TYPE_MULTIPLE);
  else
    this._selectionHandler = null;

  // Event Handler delegates to other handlers
  this.getEventManager().setSelectionHandler(this._selectionHandler);
};

/**
 * Get selection mode
 * @return {string} valid values DvtSelectionHandler.TYPE_SINGLE, DvtSelectionHandler.TYPE_MULTIPLE or null
 */
DvtBaseDiagram.prototype.getSelectionMode = function() {
  if (this._selectionHandler) {
    return this._selectionHandler.getType();
  }
  else {
    return null;
  }
};

/**
  *  Returns whether selecton is supported on the diagram.
  *  @return {boolean} True if selection is turned on for the nbox and false otherwise.
  */
DvtBaseDiagram.prototype.isSelectionSupported = function() {
  return (this._selectionHandler ? true : false);
};

/**
 * @override
 */
DvtBaseDiagram.prototype.getEventManager = function() {
  return this._eventHandler;
};

/**
 * Gets nodes pane
 * @return {DvtContainer} nodes pane
 */
DvtBaseDiagram.prototype.getNodesPane = function() {
  return this._nodesPane;
};

/**
 * Sets nodes pane
 * @param {DvtContainer} nodesPane
 */
DvtBaseDiagram.prototype.setNodesPane = function(nodesPane) {
  this._nodesPane = nodesPane;
};

/**
 * Gets links pane
 * @return {DvtContainer} links pane
 */
DvtBaseDiagram.prototype.getLinksPane = function() {
  return this._linksPane;
};

/**
 * Sets links pane
 * @param {DvtContainer} linksPane
 */
DvtBaseDiagram.prototype.setLinksPane = function(linksPane) {
  this._linksPane = linksPane;
};

/**
 * Gets top pane
 * @return {DvtContainer} top pane
 */
DvtBaseDiagram.prototype.getTopPane = function() {
  return this._topPane;
};

/**
 * Sets top pane
 * @param {DvtContainer} topPane
 */
DvtBaseDiagram.prototype.setTopPane = function(topPane) {
  this._topPane = topPane;
};

/**
 * Creates empty layout context for the component
 * @return {DvtDiagramLayoutContext}  layout context
 * @protected
 */
DvtBaseDiagram.prototype.CreateEmptyLayoutContext = function() {
  var layoutContext = new DvtDiagramLayoutContext();
  //BUG FIX #13458034: inform layout of reading direction
  layoutContext.setLocaleR2L(DvtAgent.isRightToLeft(this.getCtx()));
  layoutContext.setComponentSize(new DvtDiagramRectangle(0, 0, this.getWidth(), this.getHeight()));
  return layoutContext;
};

/**
 * Creates layout context for the node
 * @param {DvtBaseDiagramNode} node diagram node
 * @param {string} layout layout name
 * @param {boolean} bRenderAfter flag that indicates that node is not rendered yet, it will be render during layout or after layout is done
 * @return {DvtDiagramLayoutContextNode} layout context for the node
 */
DvtBaseDiagram.prototype.CreateLayoutContextNode = function(node, layout, bRenderAfter) {
  var nc = new DvtDiagramLayoutContextNode();
  nc.setId(node.getId ? node.getId() : node.getData().getId());
  //BUG FIX #13381683: set both the content bounds and the overall bounds of
  //the node on the layout context
  nc.setBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getLayoutBounds()));
  nc.setContentBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getContentBounds()));
  nc.setLayoutAttributes(node.getLayoutAttributes(layout));
  nc.setLabelBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getLabelBounds()));
  nc.setLabelPosition(DvtDiagramLayoutUtils.convertPointToDiagramPoint(node.getLabelPosition()));
  nc.setSelected(true == node.isSelected());
  if (node.isDisclosed()) {
    nc.setDisclosed(true);
    //only set container padding AFTER setting bounds and disclosed
    nc.SetContainerPaddingObj(DvtBaseDiagram.getLayoutContainerPadding(node.getContainerPadding()));
  }
  nc.setContainerId(node.getData().getGroupId ? node.getData().getGroupId() : null);
  nc.Component = this;
  nc.IsRendered = !bRenderAfter;
  return nc;
};

/**
 * Creates layout context for the link
 * @param {DvtBaseDiagramLink} link diagram link
 * @param {string} startId node id for the link start
 * @param {string} endId node id for the link end
 * @param {string} layout layout name
 * @return {DvtDiagramLayoutContextLink} layout context for the link
 */
DvtBaseDiagram.prototype.CreateLayoutContextLink = function(link, startId, endId, layout) {
  var lc = new DvtDiagramLayoutContextLink();
  lc.setId(link.getId ? link.getId() : link.getData().getId());
  lc.setStartId(startId ? startId : link.getData().getStartId());
  lc.setEndId(endId ? endId : link.getData().getEndId());
  lc.setLayoutAttributes(link.getLayoutAttributes(layout));
  lc.setLabelBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(link.getLabelBounds()));
  lc.setLabelPosition(DvtDiagramLayoutUtils.convertPointToDiagramPoint(link.getLabelPosition()));
  lc.setStartConnectorOffset(link.getStartConnectorOffset());
  lc.setEndConnectorOffset(link.getEndConnectorOffset());
  lc.setLinkWidth(link.getLinkWidth());
  lc.setSelected(true == link.isSelected());
  lc.setPromoted(true == link.isPromoted());
  return lc;
};

/**
 * @protected
 * Apply the layout context
 * @param {DvtDiagramLayoutContext} layoutContext The layout context
 * @param {DvtAnimator} animator The animator to animate the changes into
 * @param {boolean} bSaveOffset Flag for saving the layout offset (true for the top level)
 */
DvtBaseDiagram.prototype.ApplyLayoutContext = function(layoutContext, animator, bSaveOffset) {
  //: apply container padding that was set while laying out the container's children
  var topContainerPadding = layoutContext.getContainerPadding();
  if (topContainerPadding) {
    var containerId = layoutContext.getContainerId();
    if (containerId) {
      var containerNode = this.getNodeById(containerId);
      if (containerNode) {
        containerNode.setContainerPadding(DvtBaseDiagram.getContainerPadding(topContainerPadding), animator);
      }
    }
  }

  // Calculate the translation necessary to make the upper left hand corner = (0,0)
  var minx = Number.MAX_VALUE;
  var miny = Number.MAX_VALUE;
  for (var ni = 0; ni < layoutContext.getNodeCount(); ni++) {
    var nc = layoutContext.getNodeByIndex(ni);
    var node = this.getNodeById(nc.getId());
    var pos = nc.getPosition();
    if (pos) {
      minx = Math.min(minx, pos['x']);
      miny = Math.min(miny, pos['y']);
    }
    var labelBounds = nc.getLabelBounds();
    var labelPos = nc.getLabelPosition();
    if (labelBounds && labelPos) {
      minx = Math.min(minx, labelPos['x'] + labelBounds['x']);
      miny = Math.min(miny, labelPos['y'] + labelBounds['y']);
    }
  }
  for (var li = 0; li < layoutContext.getLinkCount(); li++) {
    var lc = layoutContext.getLinkByIndex(li);
    var link = this.getLinkById(lc.getId());
    var points = lc.getPoints();
    if (points) {
      var controlPoints = DvtDiagramLinkUtils.GetControlPoints(points);
      for (var i = 0; i < controlPoints.length; i++) {
        var controlPoint = controlPoints[i];
        minx = Math.min(minx, controlPoint['x']);
        miny = Math.min(miny, controlPoint['y']);
      }
    }

    var labelBounds = lc.getLabelBounds();
    var labelPos = lc.getLabelPosition();
    if (labelBounds && labelPos) {
      minx = Math.min(minx, labelPos['x'] + labelBounds['x']);
      miny = Math.min(miny, labelPos['y'] + labelBounds['y']);
    }
  }

  var lopt = this.CalcLayoutOffset(- minx, - miny);
  var tx = lopt.x;
  var ty = lopt.y;

  for (var ni = 0; ni < layoutContext.getNodeCount(); ni++) {
    var nc = layoutContext.getNodeByIndex(ni);
    var node = this.getNodeById(nc.getId());
    var pos = nc.getPosition();
    if (pos) {
      node.SetPosition(pos['x'] + tx, pos['y'] + ty, animator);
    }
    var nodeLabelBounds = nc.getLabelBounds();
    var nodeLabelPos = nc.getLabelPosition();
    if (nodeLabelBounds && nodeLabelPos) {
      // translate to make these relative to the node
      var labelPos = new DvtPoint(nodeLabelPos['x'] - pos['x'], nodeLabelPos['y'] - pos['y']);
      var labelRotAngle = nc.getLabelRotationAngle();
      var labelRotPoint = DvtDiagramLayoutUtils.convertDiagramPointToPoint(nc.getLabelRotationPoint());
      if (animator) {
        animator.addProp(DvtAnimator.TYPE_RECTANGLE, node, node.getLabelBounds, node.setLabelBounds, nodeLabelBounds);

        // If the label position hasn't been initialized, don't try to animate.
        // This could happen if the container is initially collapsed.
        if (!node.getLabelPosition()) {
          node.setLabelPosition(labelPos);
        }
        else {
          animator.addProp(DvtAnimator.TYPE_POINT, node, node.getLabelPosition, node.setLabelPosition, labelPos);
        }

        if (labelRotAngle != null) {
          animator.addProp(DvtAnimator.TYPE_NUMBER, node, node.getLabelRotationAngle, node.setLabelRotationAngle, labelRotAngle);
        }
        if (labelRotPoint) {
          if (!node.getLabelRotationPoint()) {
            node.setLabelRotationPoint(labelRotPoint);
          }
          else {
            animator.addProp(DvtAnimator.TYPE_POINT, node, node.getLabelRotationPoint, node.setLabelRotationPoint, labelRotPoint);
          }
        }
      }
      else {
        node.setLabelBounds(nodeLabelBounds);
        node.setLabelPosition(labelPos);
        if (labelRotAngle != null) {
          node.setLabelRotationAngle(labelRotAngle);
        }
        if (labelRotPoint) {
          node.setLabelRotationPoint(labelRotPoint);
        }
      }
    }

    //apply new container padding
    if (node.isDisclosed()) {
      var containerPadding = nc.getContainerPadding();
      if (containerPadding) {
        node.setContainerPadding(DvtBaseDiagram.getContainerPadding(containerPadding), animator);
      }
    }
  }
  if (!this._bCrossedZoomThreshold) {
    for (var li = 0; li < layoutContext.getLinkCount(); li++) {
      var lc = layoutContext.getLinkByIndex(li);
      var link = this.getLinkById(lc.getId());
      var points = lc.getPoints();
      if (points) {
        //: turn list of points into path commands compatible for animating
        if (points.length > 0 && !isNaN(points[0])) {
          points = DvtDiagramLinkUtils.ConvertToPath(points);
        }

        var translatedPoints = [];
        for (var i = 0; i < points.length;) {
          if (isNaN(points[i])) {
            translatedPoints.push(points[i]);
            i++;
          }
          else {
            translatedPoints.push(points[i] + tx);
            translatedPoints.push(points[i + 1] + ty);
            i += 2;
          }
        }
        if (animator && link.getPoints()) {
          if (translatedPoints.length > 0 && isNaN(translatedPoints[0])) {
            //: transition between old and new paths
            var obj = DvtShapeAnimationUtils.getAssimilatedPaths(link.getPoints(), translatedPoints);
            link.setPoints(obj.updatedOldPath);
            animator.addProp(DvtAnimator.TYPE_PATH, link, link.getPoints, link.setPoints, obj.updatedNewPath);
            //set the unmodified, simpler path at the end of the transition
            DvtPlayable.appendOnEnd(animator, function() {
              link.setPoints(translatedPoints);
            });
          }
          else {
            animator.addProp(DvtAnimator.TYPE_POLYLINE, link, link.getPoints, link.setPoints, translatedPoints);
          }
        }
        else {
          link.setPoints(translatedPoints);
        }
      }
      var labelBounds = DvtDiagramLayoutUtils.convertDiagramRectToRect(lc.getLabelBounds());
      var labelPos = lc.getLabelPosition();
      var labelRotAngle = lc.getLabelRotationAngle();
      var labelRotPoint = DvtDiagramLayoutUtils.convertDiagramPointToPoint(lc.getLabelRotationPoint());
      if (labelBounds && labelPos) {
        var translatedPos = new DvtPoint(labelPos['x'] + tx, labelPos['y'] + ty);
        if (animator) {
          animator.addProp(DvtAnimator.TYPE_RECTANGLE, link, link.getLabelBounds, link.setLabelBounds, labelBounds);

          // If the link label position hasn't been initialized, don't try to animate.
          // This could happen if the container is initially collapsed.
          if (!link.getLabelPosition()) {
            link.setLabelPosition(translatedPos);
          }
          else {
            animator.addProp(DvtAnimator.TYPE_POINT, link, link.getLabelPosition, link.setLabelPosition, translatedPos);
          }

          if (labelRotAngle != null) {
            animator.addProp(DvtAnimator.TYPE_NUMBER, link, link.getLabelRotationAngle, link.setLabelRotationAngle, labelRotAngle);
          }
          if (labelRotPoint) {

            if (!link.getLabelRotationPoint()) {
              link.setLabelRotationPoint(labelRotPoint);
            }
            else {
              animator.addProp(DvtAnimator.TYPE_POINT, link, link.getLabelRotationPoint, link.setLabelRotationPoint, labelRotPoint);
            }
          }
        }
        else {
          link.setLabelBounds(labelBounds);
          link.setLabelPosition(translatedPos);
          if (labelRotAngle != null) {
            link.setLabelRotationAngle(labelRotAngle);
          }
          if (labelRotPoint) {
            link.setLabelRotationPoint(labelRotPoint);
          }
        }
      }
    }
  }

  //save viewport from layout, if specified
  var layoutViewport = layoutContext.getViewport();
  if (layoutViewport) {
    this._layoutViewport = new DvtRectangle(layoutViewport['x'] + tx, layoutViewport['y'] + ty, layoutViewport['w'], layoutViewport['h']);
    this._layoutViewportContainerId = layoutContext.getContainerId();
  }

  if (bSaveOffset)
    this._layoutOffset = new DvtPoint(tx, ty);
};

/**
 * Gets viewport if it was set by the layout
 * @param {DvtAnimator} animator The animator into which the transitions should be rendered (optional)
 * @return {DvtRectangle} layout viewport
 * @protected
 */
DvtBaseDiagram.prototype.GetLayoutViewport = function(animator) {
  var viewport;
  if (this._layoutViewport) {
    viewport = new DvtRectangle(this._layoutViewport.x, this._layoutViewport.y, this._layoutViewport.w, this._layoutViewport.h);
    //if the layout viewport was specified inside a container, map the
    //rectangle in the container's coords to coords in the content pane
    //of the panZoomCanvas (NOTE: can't use stageToLocal/localToStage
    //because that doesn't take into account any positions stored in
    //the animator)
    if (this._layoutViewportContainerId) {
      var node = this.getNodeById(this._layoutViewportContainerId);
      while (node) {
        //use the position stored in the animator, if available
        var tx = node.getTranslateX();
        var ty = node.getTranslateY();
        if (animator) {
          var animTx = animator.getDestVal(node, node.getTranslateX);
          var animTy = animator.getDestVal(node, node.getTranslateY);
          if (animTx || animTx == 0) {
            tx = animTx;
          }
          if (animTy || animTy == 0) {
            ty = animTy;
          }
        }

        //accumulate the translation changes
        viewport.x += tx;
        viewport.y += ty;

        var containerId = node.getData().getGroupId ? node.getData().getGroupId() : null;
        if (containerId) {
          node = this.getNodeById(containerId);
        }
        else {
          node = null;
        }
      }
    }
  }
  return viewport;
};

/**
 * @protected
 * Check whether a viewport is set by the layout engine
 * @return {boolean} true if viewport is set by the layout engine
 */
DvtBaseDiagram.prototype.IsLayoutViewport = function() {
  return this._layoutViewport ? true : false;
};

/**
 * @protected
 * Clear a viewport that was set by the layout engine. Should be done to avoid stale viewport.
 */
DvtBaseDiagram.prototype.ClearLayoutViewport = function() {
  this._layoutViewport = null;
  this._layoutViewportContainerId = null;
};

// - HTML5 HV: ROOT NODE'S X COORDINATE CHANGED AFTER EXPAND/COLLAPSE
/**
 * Gets layout offset
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 * @return {DvtPoint} layout offset
 * @protected
 */
DvtBaseDiagram.prototype.CalcLayoutOffset = function(x, y) {
  return new DvtPoint(x, y);
};

/**
 * Adjusts the minimum zoom level of the panZoomCanvas if the diagram minZoom was set to 0.0
 * Will return the resulting view bounds if there were calculated
 * @param {DvtAnimator} animator (optional) an animator containing updated positions for nodes/links
 * @param {DvtRectangle} fitBounds (optional) the zoom-to-fit bounds, if known
 * @return {DvtRectangle} the bounds required to zoom to fit all content
 * @protected
 */
DvtBaseDiagram.prototype.AdjustMinZoom = function(animator, fitBounds) {
  if (this._minZoom == 0.0) {
    // Auto adjust minzoom of panzoomcanvas
    var panZoomCanvas = this.getPanZoomCanvas();
    var minZoomFitBounds = fitBounds ? fitBounds : this.GetViewBounds(animator);
    var minScale = this.CalculateMinimumScale(minZoomFitBounds);
    panZoomCanvas.setMinZoom(.5 * Math.min(minScale, panZoomCanvas.getMaxZoom()));
    return minZoomFitBounds;
  }
  return null;
};

/**
 * Calculates the minimum scale needed to zoom to fit the specified bounds
 * @param {DvtRectangle} bounds the bounds to calculate the scale for
 * @return {number} the minimum scale
 * @protected
 */
DvtBaseDiagram.prototype.CalculateMinimumScale = function(bounds) {
  if (!bounds)
    return 0;
  var panZoomCanvas = this.getPanZoomCanvas();
  var minScaleX = (this.Width - 2 * panZoomCanvas.getZoomToFitPadding()) / bounds.w;
  var minScaleY = (this.Height - 2 * panZoomCanvas.getZoomToFitPadding()) / bounds.h;
  var minScale = Math.min(minScaleX, minScaleY);
  return minScale;
};

/**
 * Gets view bounds
 * @param {DvtAnimator} animator The animator into which the transitions should be rendered (optional)
 * @param {array} arNodeIds array of node ids
 * @param {array} arLinkIds array of link ids
 * @return {DvtRectangle} view bounds
 * @protected
 */
DvtBaseDiagram.prototype.GetViewBounds = function(animator, arNodeIds, arLinkIds) {
  return this.CalcViewBounds(animator, arNodeIds, arLinkIds);
};

/**
 * Calculates view bounds
 * @param {DvtAnimator} animator The animator into which the transitions should be rendered (optional)
 * @param {array} arNodeIds array of node ids
 * @param {array} arLinkIds array of link ids
 * @return {DvtRectangle} view bounds
 * @protected
 */
DvtBaseDiagram.prototype.CalcViewBounds = function(animator, arNodeIds, arLinkIds) {
  var bounds = null;
  var dims;
  var tx;
  var ty;
  var node;
  var nodeId;
  var link;
  var linkId;
  var bx;
  var by;
  var stagePoint1;
  var localPoint1;
  var stagePoint2;
  var localPoint2;
  var nodeParent;
  var linkParent;
  var contentPane = this.getPanZoomCanvas().getContentPane();

  //if a list of nodes wasn't provided, then use all nodes
  if (!arNodeIds) {
    arNodeIds = this.GetAllNodes();
  }

  for (var i = 0; i < arNodeIds.length; i++) {
    nodeId = arNodeIds[i];
    node = this.getNodeById(nodeId);
    //BUG FIX #16472982: don't take hidden ancestor node into account
    //when calculating view bounds
    if (node && node.getVisible() && !node.isHiddenAncestor()) {
      dims = node.GetNodeBounds(animator);
      tx = null;
      ty = null;
      if (animator) {
        tx = animator.getDestVal(node, node.getTranslateX);
        ty = animator.getDestVal(node, node.getTranslateY);
      }
      if (tx == null) {
        tx = node.getTranslateX();
      }
      if (ty == null) {
        ty = node.getTranslateY();
      }
      dims.x += tx;
      dims.y += ty;

      //need to manually walk container tree because positions
      //may be in animator
      //map dims to contentPane of panZoomCanvas if node in container
      var groupId = node.getData().getGroupId ? node.getData().getGroupId() : null;
      if (groupId) {
        nodeParent = node.getParent();
        stagePoint1 = this.LocalToStage(new DvtPoint(dims.x, dims.y), nodeParent, animator);
        localPoint1 = this.StageToLocal(stagePoint1, contentPane, animator);
        stagePoint2 = this.LocalToStage(new DvtPoint(dims.x + dims.w, dims.y + dims.h), nodeParent, animator);
        localPoint2 = this.StageToLocal(stagePoint2, contentPane, animator);
        dims.x = localPoint1.x;
        dims.y = localPoint1.y;
        dims.w = localPoint2.x - localPoint1.x;
        dims.h = localPoint2.y - localPoint1.y;
      }

      if (!bounds) {
        bounds = dims;
      }
      else {
        bx = bounds.x;
        by = bounds.y;
        bounds.x = Math.min(bounds.x, dims.x);
        bounds.y = Math.min(bounds.y, dims.y);
        bounds.w = Math.max(bx + bounds.w, dims.x + dims.w) - bounds.x;
        bounds.h = Math.max(by + bounds.h, dims.y + dims.h) - bounds.y;
      }
    }
  }

  //if a list of links wasn't provided, then use all links
  if (!arLinkIds) {
    arLinkIds = this.GetAllLinks();
  }

  for (var i = 0; i < arLinkIds.length; i++) {
    linkId = arLinkIds[i];
    link = this.getLinkById(linkId);
    if (link && link.getVisible()) {
      dims = link.GetLinkBounds(animator);

      //need to manually walk container tree because positions
      //may be in animator
      //map dims to contentPane of panZoomCanvas if link in container
      var groupId = link.getData().getGroupId ? link.getData().getGroupId() : null;
      if (groupId) {
        linkParent = link.getParent();
        stagePoint1 = this.LocalToStage(new DvtPoint(dims.x, dims.y), linkParent, animator);
        localPoint1 = this.StageToLocal(stagePoint1, contentPane, animator);
        stagePoint2 = this.LocalToStage(new DvtPoint(dims.x + dims.w, dims.y + dims.h), linkParent, animator);
        localPoint2 = this.StageToLocal(stagePoint2, contentPane, animator);
        dims.x = localPoint1.x;
        dims.y = localPoint1.y;
        dims.w = localPoint2.x - localPoint1.x;
        dims.h = localPoint2.y - localPoint1.y;
      }

      if (!bounds) {
        bounds = dims;
      }
      else {
        bx = bounds.x;
        by = bounds.y;
        bounds.x = Math.min(bounds.x, dims.x);
        bounds.y = Math.min(bounds.y, dims.y);
        bounds.w = Math.max(bx + bounds.w, dims.x + dims.w) - bounds.x;
        bounds.h = Math.max(by + bounds.h, dims.y + dims.h) - bounds.y;
      }
    }
  }
  return bounds;
};

/**
 * Rotate label bounds
 * @param {DvtRectandle} bounds label bounds
 * @param {number} rotAngle rotation angle
 * @param {DvtDiagramPoint} rotPoint rotation point
 * @return {DvtRectangle} bounds for the rotated label
 * @protected
 */
DvtBaseDiagram.RotateBounds = function(bounds, rotAngle, rotPoint) {
  if (rotAngle == null && !rotPoint) {
    return bounds;
  }

  var topLeft = new DvtPoint(bounds.x, bounds.y);
  var topRight = new DvtPoint(bounds.x + bounds.w, bounds.y);
  var bottomLeft = new DvtPoint(bounds.x, bounds.y + bounds.h);
  var bottomRight = new DvtPoint(bounds.x + bounds.w, bounds.y + bounds.h);

  var mat = new DvtMatrix();
  if (rotAngle != null) {
    if (rotPoint) {
      mat.translate(- rotPoint.x, - rotPoint.y);
    }
    mat.rotate(rotAngle);
    if (rotPoint) {
      mat.translate(rotPoint.x, rotPoint.y);
    }
  }

  var tl = mat.transformPoint(topLeft);
  var tr = mat.transformPoint(topRight);
  var bl = mat.transformPoint(bottomLeft);
  var br = mat.transformPoint(bottomRight);

  var minX = Math.min(Math.min(tl.x, tr.x), Math.min(bl.x, br.x));
  var maxX = Math.max(Math.max(tl.x, tr.x), Math.max(bl.x, br.x));
  var minY = Math.min(Math.min(tl.y, tr.y), Math.min(bl.y, br.y));
  var maxY = Math.max(Math.max(tl.y, tr.y), Math.max(bl.y, br.y));

  return new DvtRectangle(minX, minY, maxX - minX, maxY - minY);
};

/**
 * Convert a point from stage coords to local coords.
 * @param {DvtPoint}  point  point in stage coords
 * @param {DvtDisplayable}  displayable  displayable defining local coordinate system
 * @param {DvtAnimator}  animator  optional animator containing coordinate transforms
 * @return {DvtPoint}
 * @protected
 */
DvtBaseDiagram.prototype.StageToLocal = function(point, displayable, animator) {
  var pathToStage = displayable.getPathToStage();
  var mat;
  var retPoint = point;
  for (var i = pathToStage.length - 1; i >= 0; i--) {
    displayable = pathToStage[i];

    mat = displayable.getMatrix().clone();
    var tx = null;
    var ty = null;
    if (animator) {
      tx = animator.getDestVal(displayable, displayable.getTranslateX);
      ty = animator.getDestVal(displayable, displayable.getTranslateY);
    }
    if (tx != null) {
      mat._tx = tx;
    }
    if (ty != null) {
      mat._ty = ty;
    }

    mat.invert();
    retPoint = mat.transformPoint(retPoint);
  }
  return retPoint;
};

/**
 * Convert a point from local coords to stage coords.
 * @param {DvtPoint}  point  point in local coords
 * @param {DvtDisplayable}  displayable  displayable defining local coordinate system
 * @param {DvtAnimator}  animator  optional animator containing coordinate transforms
 * @return {DvtPoint}
 * @protected
 */
DvtBaseDiagram.prototype.LocalToStage = function(point, displayable, animator) {
  var pathToStage = displayable.getPathToStage();
  var mat;
  var retPoint = point;
  for (var i = 0; i < pathToStage.length; i++) {
    displayable = pathToStage[i];

    mat = displayable.getMatrix().clone();
    var tx = null;
    var ty = null;
    if (animator) {
      tx = animator.getDestVal(displayable, displayable.getTranslateX);
      ty = animator.getDestVal(displayable, displayable.getTranslateY);
    }
    if (tx != null) {
      mat._tx = tx;
    }
    if (ty != null) {
      mat._ty = ty;
    }

    retPoint = mat.transformPoint(retPoint);
  }
  return retPoint;
};

/**
 * Sets the pan constraints based on the current content dimensions
 * @param {number} x The x coordinate of the upper left corner of the content bounding box
 * @param {number} y The y coordinate of the upper left corner of the content bounding box
 * @param {number} w The width of the content bounding box
 * @param {number} h The height of the content bounding box
 * @param {number} zoom The current panZoomCanvas zoom level
 * @protected
 */
DvtBaseDiagram.prototype.ConstrainPanning = function(x, y, w, h, zoom) {
  var pzc = this.getPanZoomCanvas();
  var halfViewportW = pzc.getSize().w / 2;
  var halfViewportH = pzc.getSize().h / 2;
  var minPanX = halfViewportW - (w + x) * zoom;
  var minPanY = halfViewportH - (h + y) * zoom;
  var maxPanX = halfViewportW - x * zoom;
  var maxPanY = halfViewportH - y * zoom;

  if (this.IsLayoutViewport()) {
    // if the viewport is specified and the viewport bounds are outside of the panning constraints,
    // adjust the constraints symmetrically to include the viewport bounds
    var viewportBounds = this.GetLayoutViewport();
    var dx, dy;
    if (- viewportBounds.x * zoom < minPanX) {
      dx = minPanX + viewportBounds.x * zoom;
      minPanX -= dx;
      maxPanX += dx;
    }
    else if (- viewportBounds.x * zoom > maxPanX) {
      dx = - viewportBounds.x * zoom - maxPanX;
      minPanX -= dx;
      maxPanX += dx;
    }
    if (- viewportBounds.y * zoom < minPanY) {
      dy = minPanY + viewportBounds.y * zoom;
      minPanY -= dy;
      maxPanY += dy;
    }
    else if (- viewportBounds.y * zoom > maxPanY) {
      dy = - viewportBounds.y * zoom - maxPanY;
      minPanY -= dy;
      maxPanY += dy;
    }
  }

  pzc.setMinPanX(minPanX);
  pzc.setMinPanY(minPanY);
  pzc.setMaxPanX(maxPanX);
  pzc.setMaxPanY(maxPanY);
};

/**
 * Moves the specified displayable to the top pane, which is rendered in front of the links and nodes panes
 * @param {DvtDisplayable} obj the displayable to move to front
 */
DvtBaseDiagram.prototype.moveToDiagramFront = function(obj)
{
  this._topPane.addChild(obj);
};

/**
 * Moves the specified link to the links pane (typically from the top pane)
 * @param {DvtBaseDiagramLink} obj the link to move
 */
DvtBaseDiagram.prototype.moveToLinks = function(obj)
{
  this._linksPane.addChild(obj);
};

/**
 * Moves the specified node to the nodes pane (typically from the top pane)
 * @param {DvtBaseDiagramNode} obj the node to move
 */
DvtBaseDiagram.prototype.moveToNodes = function(obj)
{
  this._nodesPane.addChild(obj);
};

/**
 * Convert key notation into dot notation
 * @param {object} layoutContainerPadding the object with the layout container padding values
 * @return {object} object with the container padding values
 */
DvtBaseDiagram.getContainerPadding = function(layoutContainerPadding)
{
  var containerPadding = new Object();
  containerPadding.top = layoutContainerPadding['top'];
  containerPadding.right = layoutContainerPadding['right'];
  containerPadding.bottom = layoutContainerPadding['bottom'];
  containerPadding.left = layoutContainerPadding['left'];
  return containerPadding;
};

/**
 * Convert dot notation into key notation
 * @param {object} containerPadding the object with the container padding values
 * @return {object} object with the container padding values
 */
DvtBaseDiagram.getLayoutContainerPadding = function(containerPadding)
{
  var layoutContainerPadding = new Object();
  layoutContainerPadding['top'] = containerPadding.top;
  layoutContainerPadding['right'] = containerPadding.right;
  layoutContainerPadding['bottom'] = containerPadding.bottom;
  layoutContainerPadding['left'] = containerPadding.left;
  return layoutContainerPadding;
};

/**
 * Render node and updates corresponding layout context for the node
 * @param {DvtDiagramLayoutContextNode} nodeContext
 */
DvtBaseDiagram.prototype.renderNodeFromContext = function(nodeContext) {
  //subclasses should override
};


/**
 * Updates layout context for the node
 * @param {DvtDiagramLayoutContextNode} nodeContext node context
 * @param {DvtBaseDiagramNode} node diagram node
 */
DvtBaseDiagram.prototype.UpdateNodeLayoutContext = function(nodeContext, node) {
  nodeContext.setBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getLayoutBounds()));
  nodeContext.setContentBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getContentBounds()));
  nodeContext.setLabelBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getLabelBounds()));
  nodeContext.IsRendered = true;
};
// Copyright (c) 2011, 2015, Oracle and/or its affiliates. All rights reserved.

/**
 * @constructor
 *  @class DvtBaseDiagramKeyboardHandler base class for keyboard handler for diagram component
 *  @param {DvtBaseDiagram} component The owning diagram component
 *  @param {DvtEventManager} manager The owning DvtEventManager
 *  @extends {DvtPanZoomCanvasKeyboardHandler}
 */
var DvtBaseDiagramKeyboardHandler = function(component, manager)
{
  this.Init(component, manager);
};

DvtObj.createSubclass(DvtBaseDiagramKeyboardHandler, DvtPanZoomCanvasKeyboardHandler, 'DvtBaseDiagramKeyboardHandler');

/**
 * Link direction - outgoing
 * @const
 * @private
 */
DvtBaseDiagramKeyboardHandler._OUTGOING = 0;


/**
 * Link direction - ingoing
 * @const
 * @private
 */
DvtBaseDiagramKeyboardHandler._INGOING = 1;

/**
 * @override
 */
DvtBaseDiagramKeyboardHandler.prototype.Init = function(diagram, manager) {
  DvtBaseDiagramKeyboardHandler.superclass.Init.call(this, diagram, manager);
  this._diagram = diagram;
};

/**
 * Gets parent diagram
 * @return {DvtBaseDiagram} parent diagram
 * @protected
 */
DvtBaseDiagramKeyboardHandler.prototype.GetDiagram = function() {
  return this._diagram;
};

/**
 * @override
 */
DvtBaseDiagramKeyboardHandler.prototype.isSelectionEvent = function(event)
{
  if (event.keyCode == DvtKeyboardEvent.TAB)
    return false;
  else
    return this.isNavigationEvent(event) && !event.ctrlKey;
};

/**
 * @override
 */
DvtBaseDiagramKeyboardHandler.prototype.isMultiSelectEvent = function(event)
{
  return event.keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey;
};

/**
 * Get first navigable link
 * @param {DvtBaseDiagramNode} node node for which links are analyzed
 * @param {DvtKeyboardEvent} event keyboard event
 * @param {array} listOfLinks array of links for the node
 * @return {DvtBaseDiagramLink} first navigable link
 */
DvtBaseDiagramKeyboardHandler.prototype.getFirstNavigableLink = function(node, event, listOfLinks) {
  var direction = event.keyCode;
  if (!listOfLinks || listOfLinks.length < 1 || !node)
    return null;
  var link = listOfLinks[0];
  var nodeBB = node.getKeyboardBoundingBox();
  var nodeCenterX = nodeBB.x + nodeBB.w / 2;
  for (var i = 0; i < listOfLinks.length; i++)
  {
    var object = listOfLinks[i];
    var linkBB = object.getKeyboardBoundingBox();
    var linkCenterX = linkBB.x + linkBB.w / 2;
    if ((direction == DvtKeyboardEvent.OPEN_ANGLED_BRACKET && linkCenterX <= nodeCenterX) ||
        (direction == DvtKeyboardEvent.CLOSE_ANGLED_BRACKET && linkCenterX >= nodeCenterX)) {
      link = object;
      break;
    }
  }
  return link;
};


/**
 * Get next navigavle link depending on direction - clockwise or conter clockwise.
 * The decision is made based on location of nodes centers rather than link paths or link angles.
 * @param {DvtBaseDiagramNode} node the node for which links are analyzed
 * @param {DvtBaseDiagramLink} currentLink the link in focus
 * @param {DvtKeyboardEvent} event the keyboard event
 * @param {array} listOfLinks the array of links for the node
 * @return {DvtBaseDiagramLink} next navigable link
 */
DvtBaseDiagramKeyboardHandler.prototype.getNextNavigableLink = function(node, currentLink, event, listOfLinks) {
  if (!listOfLinks)
    return null;

  if (!currentLink)
    return listOfLinks[0];

  if (!node)
    return currentLink;
  this._addSortingAttributes(node, listOfLinks);
  listOfLinks.sort(this._getLinkComparator());
  this._removeSortingAttributes(listOfLinks);
  //clockwise direction
  var bForward = (event.keyCode == DvtKeyboardEvent.DOWN_ARROW) ? true : false;
  var index = 0;
  for (var i = 0; i < listOfLinks.length; i++) {
    var link = listOfLinks[i];
    if (link === currentLink) {
      if (bForward)
        index = (i == listOfLinks.length - 1) ? 0 : i + 1;
      else
        index = (i == 0) ? listOfLinks.length - 1 : i - 1;
      break;
    }
  }
  return listOfLinks[index];
};

/**
 * Finds first visible container for the node by the node's id. It cound be a node itself if the node is visible.
 * @param {string} nodeId node id
 * @return {DvtBaseDiagramNode} a visible node - the node itself or its container
 * @protected
 */
DvtBaseDiagramKeyboardHandler.prototype.GetVisibleNode = function(nodeId) {
  //subclasses should override
  return null;
};

/**
 * Get clockwise angle for the link using given node as a center
 * @param {DvtBaseDiagramNode} node node as a center
 * @param {DvtBaseDiagramLink} link link to be checked
 * @return {number} an link angle from 0 to 2*PI
 * @private
 */
DvtBaseDiagramKeyboardHandler.prototype._getClockwiseAngle = function(node, link)
{
  //find opposite node
  var startNode = this.GetVisibleNode(link.getStartId ? link.getStartId() : link.getData().getStartId());
  var endNode = this.GetVisibleNode(link.getEndId ? link.getEndId() : link.getData().getEndId());
  var oppositeNode = node == startNode ? endNode : startNode;

  var p1 = this._getNodeCenter(node);
  var p2 = this._getNodeCenter(oppositeNode);
  var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  angle = angle < 0 ? angle + Math.PI * 2 : angle;
  return angle;
};

/**
 * Get node center
 * @param {DvtBaseDiagramNode} node diagram node
 * @return {DvtPoint} node center
 * @private
 */
DvtBaseDiagramKeyboardHandler.prototype._getNodeCenter = function(node) {
  var nodeBB = node.getKeyboardBoundingBox();
  return new DvtPoint(nodeBB.x + nodeBB.w / 2, nodeBB.y + nodeBB.h / 2);
};


/**
 * Get distance between start and end nodes for the given link
 * @param {DvtBaseDiagramLink} link a link
 * @return {number} the distance between nodes
 * @private
 */
DvtBaseDiagramKeyboardHandler.prototype._getNodesDistance = function(link) {
  var startNode = this.GetVisibleNode(link.getStartId ? link.getStartId() : link.getData().getStartId());
  var endNode = this.GetVisibleNode(link.getEndId ? link.getEndId() : link.getData().getEndId());
  var p1 = this._getNodeCenter(startNode);
  var p2 = this._getNodeCenter(endNode);
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};


/**
 * Get link direction for the given node
 * @param {DvtBaseDiagramNode} node a node
 * @param {DvtBaseDiagramLink} link a link connected to the given node
 * @return {number} a link direction - DvtBaseDiagramKeyboardHandler._INGOING or DvtBaseDiagramKeyboardHandler._OUTGOING
 * @private
 */
DvtBaseDiagramKeyboardHandler.prototype._getLinkDirection = function(node, link) {
  if (node == this.GetVisibleNode(link.getEndId ? link.getEndId() : link.getData().getEndId()))
    return DvtBaseDiagramKeyboardHandler._INGOING;
  else
    return DvtBaseDiagramKeyboardHandler._OUTGOING;
};


/**
 * Get function that compares two link around a given node
 * The links are analyzed by angle, distance from the node and direction. The sorting attributes are added to the links before sorting.
 * @return {function} a function that compares to links around the node
 * @private
 */
DvtBaseDiagramKeyboardHandler.prototype._getLinkComparator = function() {
  var comparator = function(link1, link2) {
    var linkAngle1 = link1.__angle;
    var linkAngle2 = link2.__angle;
    var res = -1;

    if (!DvtBaseDiagramKeyboardHandler._anglesAreEqualWithinTolerance(linkAngle1, linkAngle2) && linkAngle1 > linkAngle2) {
      res = 1;
    }
    else if (DvtBaseDiagramKeyboardHandler._anglesAreEqualWithinTolerance(linkAngle1, linkAngle2)) {
      //check distance and direction
      if (link1.__distance > link2.__distance) {
        res = 1;
      }
      else if (link2.__distance == link1.__distance && link1.__direction > link2.__direction) { //outgoing to ingoing
        res = 1;
      }
      else if (link2.__distance == link1.__distance && link1.__direction == link2.__direction) {
        res = 0;
      }
    }
    return res;
  };
  return comparator;
};


/**
 * Utility method that removes sorting attributes from each link in the array
 * @param {array} listOfLinks array of links
 * @private
 */
DvtBaseDiagramKeyboardHandler.prototype._removeSortingAttributes = function(listOfLinks) {
  for (var i = 0; i < listOfLinks.length; i++) {
    var link = listOfLinks[i];
    link.__angle = undefined;
    link.__distance = undefined;
    link.__direction = undefined;
  }
};


/**
 * Utility method that adds sorting attributes to each link in the array
 * @param {DvtBaseDiagramNode} node the node
 * @param {array} listOfLinks array of links
 * @private
 */
DvtBaseDiagramKeyboardHandler.prototype._addSortingAttributes = function(node, listOfLinks) {
  for (var i = 0; i < listOfLinks.length; i++) {
    var link = listOfLinks[i];
    link.__angle = this._getClockwiseAngle(node, link);
    link.__distance = this._getNodesDistance(link);
    link.__direction = this._getLinkDirection(node, link);
  }
};


/**
 * Utility method to check if two angles are equal, within a small tolerance. Used to account for small rounding errors
 * @param {number} a1 first angle to compare
 * @param {number} a2 second angle to compare
 * @return  {boolean} true if angles are equal
 * @private
 */
DvtBaseDiagramKeyboardHandler._anglesAreEqualWithinTolerance = function(a1, a2) {
  var res = Math.abs(a1 - a2) <= 0.0000001;
  if (!res) {
    res = Math.abs(Math.PI * 2 + Math.min(a1, a2) - Math.max(a1, a2)) <= 0.0000001;
  }
  return res;
};





/**
 * @constructor
 * @class The base class for diagram links
 * @param {DvtContext} context the rendering context
 * @param {string} linkId link id
 * @param {DvtBaseDiagram} diagram the parent diagram component
 * @implements {DvtSelectable}
 * @implements {DvtKeyboardNavigable}
 */
var DvtBaseDiagramLink = function(context, linkId, diagram) {
  this.Init(context, linkId, diagram);
};

DvtObj.createSubclass(DvtBaseDiagramLink, DvtContainer, 'DvtBaseDiagramLink');

/**
 * Initialization method called by the constructor
 * @param {DvtContext} context the rendering context
 * @param {string} linkId link id
 * @param {DvtBaseDiagram} diagram the parent diagram component
 */
DvtBaseDiagramLink.prototype.Init = function(context, linkId, diagram) {
  DvtBaseDiagramLink.superclass.Init.call(this, context, null, linkId);
  this._diagram = diagram;
  this._arPoints;
  this._points;
  this._pathCmds;
  this._labelObj;
  this._labelPos;
  this._labelRotAngle;
  this._labelRotPoint;
  this._selected = false;
  this._selectable = true;
  this._shape;
  this._endConnector;
  this._startConnector;
};

/**
 * Gets parent diagram
 * @return {DvtBaseDiagram} parent diagram
 * @protected
 */
DvtBaseDiagramLink.prototype.GetDiagram = function() {
  return this._diagram;
};

/**
 * Sets the link end connector type
 * @param {String} type link end connector type
 */
DvtBaseDiagramLink.prototype.setEndConnectorType = function(type) {
};

/**
 * Gets the link end connector type
 * @return {String}  link end connector type
 */
DvtBaseDiagramLink.prototype.getEndConnectorType = function() {
  return null;
};

/**
 * Sets the link start connector type
 * @param {String} type link start connector type
 */
DvtBaseDiagramLink.prototype.setStartConnectorType = function(type) {
};

/**
 * Sets link start connector
 * @param {DvtContainer} startConnector link start connector
 */
DvtBaseDiagramLink.prototype.setStartConnector = function(startConnector) {
  this._startConnector = startConnector;
};

/**
 * @export
 * Get the link start connector
 * @return {DvtContainer}  link start connector
 */
DvtBaseDiagramLink.prototype.getStartConnector = function() {
  return this._startConnector;
};

/**
 * Sets link end connector
 * @param {DvtContainer} endConnector link start connector
 */
DvtBaseDiagramLink.prototype.setEndConnector = function(endConnector) {
  this._endConnector = endConnector;
};

/**
 * @export
 * Get the link end connector
 * @return {DvtContainer}  link end connector
 */
DvtBaseDiagramLink.prototype.getEndConnector = function() {
  return this._endConnector;
};

/**
 * Sets link shape
 * @param {DvtPath} shape link shape
 */
DvtBaseDiagramLink.prototype.setShape = function(shape) {
  this._shape = shape;
};

/**
 * Get the link shape
 * @return {DvtPath} link shape
 */
DvtBaseDiagramLink.prototype.getShape = function() {
  return this._shape;
};

/**
 * Sets label rotation angle
 * @param {number} angle angle of label rotation
 */
DvtBaseDiagramLink.prototype.setLabelRotationAngle = function(angle) {
  this._labelRotAngle = angle;
  DvtBaseDiagramLink.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(), angle, this.getLabelRotationPoint());
};

/**
 * Gets label rotation angle
 * @return {number} angle of label rotation
 */
DvtBaseDiagramLink.prototype.getLabelRotationAngle = function() {
  return this._labelRotAngle;
};

/**
 * Sets label rotation point
 * @param {DvtDiagramPoint} point label rotation point
 */
DvtBaseDiagramLink.prototype.setLabelRotationPoint = function(point) {
  this._labelRotPoint = point;
  DvtBaseDiagramLink.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(), this.getLabelRotationAngle(), point);
};

/**
 * Gets label rotation point
 * @return {DvtDiagramPoint} label rotation point
 */
DvtBaseDiagramLink.prototype.getLabelRotationPoint = function() {
  return this._labelRotPoint;
};

/**
 * Gets the position of the link label.
 * @return {DvtPoint}
 */
DvtBaseDiagramLink.prototype.getLabelPosition = function() {
  return this._labelPos;
};

/**
 * Sets the position of the link label.
 * @param {DvtPoint} pos label position
 */
DvtBaseDiagramLink.prototype.setLabelPosition = function(pos) {
  if (pos) {
    this._labelPos = pos;
    DvtBaseDiagramLink.PositionLabel(this._labelObj, pos, this.getLabelBounds(), this.getLabelRotationAngle(), this.getLabelRotationPoint());
  }
};

/**
 * Gets label dimensions
 * @return {DvtRectangle} The bounds of the label
 */
DvtBaseDiagramLink.prototype.getLabelBounds = function() {
  return null;
};

/**
 * Sets label dimensions
 * @param {DvtRectangle} bounds The bounds of the label
 */
DvtBaseDiagramLink.prototype.setLabelBounds = function(bounds) {
};

/**
 * Gets the offset of the start connector.  This is the amount of space that the
 * link should leave between its starting point and the node for the connector
 * to be drawn.
 * @return {number}
 */
DvtBaseDiagramLink.prototype.getStartConnectorOffset = function() {
  return 0;
};

/**
 * Gets the offset of the end connector.  This is the amount of space that the
 * link should leave between its starting point and the node for the connector
 * to be drawn.
 * @return {number}
 */
DvtBaseDiagramLink.prototype.getEndConnectorOffset = function() {
  return 0;
};

/**
 * Sets selectable flag on the link
 * @param {boolean} selectable true if the link is selectable
 */
DvtBaseDiagramLink.prototype.setSelectable = function(selectable) {
  this._selectable = selectable;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtBaseDiagramLink.prototype.isSelectable = function() {
  return this.GetDiagram().isSelectionSupported() && this._selectable;
};

/**
 * Checks whether the node is selected
 * @return {boolean} true if the link is selected
 * @export
 */
DvtBaseDiagramLink.prototype.isSelected = function() {
  return this._selected;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtBaseDiagramLink.prototype.setSelected = function(selected) {
  // Store the selection state
  this._selected = selected;
};

/**
 * Sets promoted flag on the link
 * @param {boolean} bPromoted true if the link is promoted
 */
DvtBaseDiagramLink.prototype.setPromoted = function(bPromoted) {
};

/**
 * Checks whether the link is promoted link
 * @return {boolean} true if the link is promoted link
 */
DvtBaseDiagramLink.prototype.isPromoted = function() {
  return false;
};

/**
 * Sets links width
 * @param {number} lw link width
 */
DvtBaseDiagramLink.prototype.setLinkWidth = function(lw) {
};

/**
 * @export
 * Gets link width
 * @return {number} link width
 */
DvtBaseDiagramLink.prototype.getLinkWidth = function() {
  return 1;
};

/**
 * Sets link style
 * @param {string} ls link style - 'solid', 'dot', dash' and 'dashDot'
 */
DvtBaseDiagramLink.prototype.setLinkStyle = function(ls) {
};

/**
 * Get the link style
 * @return {String} link style
 */
DvtBaseDiagramLink.prototype.getLinkStyle = function() {
  return 'solid';
};

/**
 * Sets the link color
 * @param {string} lc link color
 */
DvtBaseDiagramLink.prototype.setLinkColor = function(lc) {
};

/**
 * Gets the link color
 * @return {string} the link color
 */
DvtBaseDiagramLink.prototype.getLinkColor = function() {
  return null;
};

/**
 * Gets connector template
 * @param {string} connectorPosition connector position - DvtDiagramLinkConnectorUtils.START_CONNECTOR or DvtDiagramLinkConnectorUtils.END_CONNECTOR
 * @return {DvtAfMarker} connectorTemplate the custom connector shape if exists
 */
DvtBaseDiagramLink.prototype.getConnectorTemplate = function(connectorPosition) {
  return null;
};

/**
 * @protected
 * Gets link style - either style for regular link or promoted link if the promoted link applicable in this case
 * @return {string} link style
 */
DvtBaseDiagramLink.prototype.GetAppliedLinkStyle = function() {
  return this.getLinkStyle();
};

/**
 * @protected
 * Gets link width - either width for regular link or promoted link if the promoted link applicable in this case
 * @return {number} link width
 */
DvtBaseDiagramLink.prototype.GetAppliedLinkWidth = function() {
  return this.getLinkWidth();
};

/**
 * @protected
 * Gets link color - either color for regular link or promoted link if the promoted link applicable in this case
 * @return {string} link color
 */
DvtBaseDiagramLink.prototype.GetAppliedLinkColor = function() {
  return this.getLinkColor();
};

/**
 * @protected
 * Creates start or end connector for the link
 * @param {array} points Array of points that represent the link
 * @param {string} connectorType One of the standard connector types. See DvtDiagramLinkDef for types. The parameter is optional. Either type or template should be specified.
 * @param {number} connectorPos Connector position: 0 for start and 1 for end
 * @param {DvtAfMarker} connectorTemplate Template used to create a connector. The parameter is optional. Either type or template should be specified.
 * @return {DvtShape} connector shape
 */
DvtBaseDiagramLink.prototype.CreateConnector = function(points, connectorType, connectorPos, connectorTemplate) {

  if (!connectorType && !connectorTemplate) {
    return;
  }

  var stroke;
  if (!connectorTemplate) {
    stroke = this._shape.getStroke().clone();
    stroke.setType(DvtStroke.SOLID);
    stroke.setFixedWidth(false);
  }

  var connector = DvtDiagramLinkConnectorUtils.CreateConnectorShape(this.getCtx(), connectorType, connectorTemplate, stroke, this);

  if (connector) {
    //BUG FIX #14813637: add connectors as children of shape so that selection feedback affects them
    this._shape.addChild(connector);
    DvtDiagramLinkConnectorUtils.TransformConnector(connector, connectorType, connectorTemplate, points, connectorPos);
  }

  return connector;
};

/**
 * Gets link bounds
 * @param {DvtAnimator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @return {DvtRectangle} link bounds
 */
DvtBaseDiagramLink.prototype.GetLinkBounds = function(animator) {
  var linkBounds = new DvtRectangle(Number.MAX_VALUE, Number.MAX_VALUE, - Number.MAX_VALUE, - Number.MAX_VALUE);
  var points = null;
  if (animator) {
    points = animator.getDestVal(this, this.getPoints);
  }
  if (!points) {
    points = this.getPoints();
  }

  if (points) {
    var controlPoints = DvtDiagramLinkUtils.GetControlPoints(points);
    var controlPoint;
    var maxX;
    var maxY;
    var minX;
    var minY;
    for (var j = 0; j < controlPoints.length; j++) {
      controlPoint = controlPoints[j];
      maxX = Math.max(linkBounds.x + linkBounds.w, controlPoint.x);
      maxY = Math.max(linkBounds.y + linkBounds.h, controlPoint.y);
      minX = Math.min(linkBounds.x, controlPoint.x);
      minY = Math.min(linkBounds.y, controlPoint.y);

      linkBounds.x = minX;
      linkBounds.y = minY;
      linkBounds.w = maxX - minX;
      linkBounds.h = maxY - minY;
    }
  }

  var bounds = new DvtRectangle(linkBounds.x, linkBounds.y, linkBounds.w, linkBounds.h);

  var labelPos = null;
  if (animator) {
    labelPos = animator.getDestVal(this, this.getLabelPosition);
  }
  if (labelPos == null) {
    labelPos = this.getLabelPosition();
  }
  var labelRotAngle = null;
  var labelRotPoint = null;
  if (animator) {
    labelRotAngle = animator.getDestVal(this, this.getLabelRotationAngle);
    labelRotPoint = animator.getDestVal(this, this.getLabelRotationPoint);
  }
  if (labelRotAngle == null) {
    labelRotAngle = this.getLabelRotationAngle();
  }
  if (!labelRotPoint) {
    labelRotPoint = this.getLabelRotationPoint();
  }
  var labelBounds = this.getLabelBounds();
  if (labelPos && labelBounds) {
    //take label rotation into account
    if (labelRotAngle != null) {
      labelBounds = DvtBaseDiagram.RotateBounds(labelBounds, labelRotAngle, labelRotPoint);
    }
    bounds.x = Math.min(linkBounds.x, labelBounds.x + labelPos.x);
    bounds.y = Math.min(linkBounds.y, labelBounds.y + labelPos.y);
    bounds.w = Math.max(linkBounds.x + linkBounds.w, labelBounds.x + labelPos.x + labelBounds.w) - bounds.x;
    bounds.h = Math.max(linkBounds.y + linkBounds.h, labelBounds.y + labelPos.y + labelBounds.h) - bounds.y;
  }

  return bounds;
};

/**
 * Sets the points to use for rendering this link.  The given array can contain
 * coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path commands, like
 * ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].  The points are in the
 * coordinate system of the link's container.
 * @param {array} points array of points to use for rendering this link
 */
DvtBaseDiagramLink.prototype.setPoints = function(points) {
  this._arPoints = points;
  if (!DvtDiagramLinkUtils.IsPath(points)) {
    this._points = points;
    this._pathCmds = DvtDiagramLinkUtils.ConvertToPath(points);
  }
  else {
    this._pathCmds = points;
    this._points = DvtDiagramLinkUtils.ConvertToPoints(points);
  }

  if (this._shape) {

    if (this._shape instanceof DvtPath) {
      this._shape.setCommands(this._pathCmds);

      if (!this._endConnector) {
        this._endConnector = this.CreateConnector(this._points, this.getEndConnectorType(), 1, this.getConnectorTemplate(DvtDiagramLinkConnectorUtils.END_CONNECTOR));
      }
      else {
        DvtDiagramLinkConnectorUtils.TransformConnector(this._endConnector, this.getEndConnectorType(), this.getConnectorTemplate(DvtDiagramLinkConnectorUtils.END_CONNECTOR), this._points, 1);
      }
      if (!this._startConnector) {
        this._startConnector = this.CreateConnector(this._points, this.getStartConnectorType(), 0, this.getConnectorTemplate(DvtDiagramLinkConnectorUtils.START_CONNECTOR));
      }
      else {
        DvtDiagramLinkConnectorUtils.TransformConnector(this._startConnector, this.getStartConnectorType(), this.getConnectorTemplate(DvtDiagramLinkConnectorUtils.START_CONNECTOR), this._points, 0);
      }
    }
  }
  //need to update the selection feedback when animating a link
  var underlayStart = null, underlayEnd = null;
  if (this._linkUnderlay && this._linkUnderlay.getUnderlay() instanceof DvtPath) {
    this._linkUnderlay.getUnderlay().setCommands(this._pathCmds);
  }
  if (this._linkUnderlay && (underlayStart = this._linkUnderlay.getUnderlayStart())) {
    DvtDiagramLinkConnectorUtils.TransformConnector(underlayStart, this.getStartConnectorType(), this.getConnectorTemplate(DvtDiagramLinkConnectorUtils.START_CONNECTOR), this._points, 0);
  }
  if (this._linkUnderlay && (underlayEnd = this._linkUnderlay.getUnderlayEnd())) {
    DvtDiagramLinkConnectorUtils.TransformConnector(underlayEnd, this.getEndConnectorType(), this.getConnectorTemplate(DvtDiagramLinkConnectorUtils.END_CONNECTOR), this._points, 1);
  }

  //: need to update the hit detection underlay when animating
  //a link
  if (this._hitDetectionUnderlay && this._hitDetectionUnderlay.getUnderlay() instanceof DvtPath) {
    this._hitDetectionUnderlay.getUnderlay().setCommands(this._pathCmds);
  }
  if (this._startHandle) {
    this._startHandle.setPosition(this.getLinkStart());
  }
  if (this._endHandle) {
    this._endHandle.setPosition(this.getLinkEnd());
  }
};

/**
 * Gets the points used for rendering this link.  The array can contain
 * coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path commands, like
 * ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].
 * @return {array} link points
 */
DvtBaseDiagramLink.prototype.getPoints = function() {
  return this._arPoints;
};

/**
 * Gets link start position
 * @return {DvtPoint} link start position
 */
DvtBaseDiagramLink.prototype.getLinkStart = function() {
  if (!this._points)
    return null;
  var x = this._points[0];
  var y = this._points[1];
  return new DvtPoint(x, y);
};

/**
 * Gets link end position
 * @return {DvtPoint} link end position
 */
DvtBaseDiagramLink.prototype.getLinkEnd = function() {
  if (!this._points)
    return null;
  var numPoints = this._points.length;
  var x = this._points[numPoints - 2];
  var y = this._points[numPoints - 1];
  return new DvtPoint(x, y);
};


/**
 * @protected
 * Calculate the matrix used to rotate and position the label.
 * @param {DvtPoint} pos position of the link label
 * @param {DvtRectangle} bounds label bounds
 * @param {number} rotAngle rotation angle for the label
 * @param {DvtPoint} rotPoint rotation point for the label
 * @return {DvtMatrix} matrix used to rotate and position the label
 */
DvtBaseDiagramLink.CalcLabelMatrix = function(pos, bounds, rotAngle, rotPoint) {
  var mat = new DvtMatrix();
  if (rotAngle != null) {
    if (rotPoint) {
      mat.translate(-rotPoint.x, -rotPoint.y);
    }
    mat.rotate(rotAngle);
    if (rotPoint) {
      mat.translate(rotPoint.x, rotPoint.y);
    }
  }
  if (pos) {
    mat.translate(pos.x, pos.y);
  }
  return mat;
};

/**
 * Positions link label
 * @param {DvtOutputText} label link label
 * @param {DvtPoint} pos position of the link label
 * @param {DvtRectangle} bounds label bounds
 * @param {number} rotAngle rotation angle for the label
 * @param {DvtPoint} rotPoint rotation point for the label
 * @protected
 */
DvtBaseDiagramLink.PositionLabel = function(label, pos, bounds, rotAngle, rotPoint) {
  if (!label)
    return;
  var mat = DvtBaseDiagramLink.CalcLabelMatrix(pos, bounds, rotAngle, rotPoint);
  label.setMatrix(mat);
};

/**
 * Creates link underlay - underlay for the link itself, it does not include connectors
 * @param {String} strokeColor  a css color specification for the underlay color
 * @param {String} strokeAlpha  alpha for the link underlay
 * @param {number} strokeWidthOffset offset for the stroke that is going to be added to the link width
 *                in order to create an underlay
 * @return {DvtDiagramLinkUnderlay} link underlay
 * @protected
 */
DvtBaseDiagramLink.prototype.CreateUnderlay = function(strokeColor, strokeAlpha, strokeWidthOffset) {
  if (!strokeAlpha && strokeAlpha != 0) {
    strokeAlpha = 1;
  }
  if (!strokeWidthOffset && strokeWidthOffset != 0) {
    strokeWidthOffset = 0;
  }

  var strokeWidth = this.GetAppliedLinkWidth() + strokeWidthOffset;
  var stroke = new DvtSolidStroke(strokeColor, strokeAlpha, strokeWidth);
  return new DvtDiagramLinkUnderlay(this.getCtx(), this._pathCmds, stroke);
};


/**
 * Creates feedback underlay used for the hover, selection effects. The underlay includes the link and the connectors.
 * @param {String} strokeColor  a css color specification for the underlay color
 * @param {String} strokeAlpha  alpha for the link underlay
 * @param {number} strokeWidthOffset offset for the stroke that is going to be added to the link width
 *                in order to create an underlay
 * @return {DvtDiagramLinkUnderlay} feedback underlay used for the hover, selection effects. The underlay includes the link and the connectors
 * @protected
 */
DvtBaseDiagramLink.prototype.CreateFeedbackUnderlay = function(strokeColor, strokeAlpha, strokeWidthOffset) {

  var feedbackUnderlay = this.CreateUnderlay(strokeColor, strokeAlpha, strokeWidthOffset);

  if (this._startConnector && this.getStartConnectorType())
    feedbackUnderlay.addUnderlayStart(this._points, this.getStartConnectorType(), this.getConnectorTemplate(DvtDiagramLinkConnectorUtils.START_CONNECTOR), this);
  if (this._endConnector && this.getEndConnectorType())
    feedbackUnderlay.addUnderlayEnd(this._points, this.getEndConnectorType(), this.getConnectorTemplate(DvtDiagramLinkConnectorUtils.END_CONNECTOR), this);
  return feedbackUnderlay;
};

/**
 * Applies link style to a stroke
 * @param {DvtStroke} stroke
 * @param {boolean} bUnderlay true for underlay stroke
 * @protected
 */
DvtBaseDiagramLink.prototype.ApplyLinkStyle = function(stroke, bUnderlay) {
  var linkStyle = this.GetAppliedLinkStyle();
  var strokeType = DvtDiagramLinkUtils.ConvertLinkStyleToStrokeType(linkStyle);
  stroke.setType(strokeType, DvtDiagramLinkUtils.GetStrokeDash(strokeType, bUnderlay), DvtDiagramLinkUtils.GetStrokeDashOffset(strokeType, bUnderlay));
};

/**
 * Replaces color of a standard connector
 * @param {DvtContainer} connector link connector
 * @param {DvtStroke} stroke for the link connector
 */
DvtBaseDiagramLink.prototype.ReplaceConnectorColor = function(connector, stroke) {
  if (!connector)
    return;
  var color = null;
  if (stroke.getColor)
    color = stroke.getColor();

  if (color) {
    var conStroke = connector.getStroke() ? connector.getStroke().clone() : null;
    var conFill = connector.getFill() ? connector.getFill().clone() : null;

    if (conStroke && conStroke.setColor) {
      conStroke.setColor(color);
      connector.setStroke(conStroke);
    }
    if (conFill && conFill.setColor) {
      conFill.setColor(color);
      connector.setFill(conFill);
    }
  }
};

// Implementation of DvtKeyboardNavigable interface
/**
 * @override
 */
DvtBaseDiagramLink.prototype.getNextNavigable = function(event) {
  //subclasses should override
  return null;
};

/**
 * @override
 */
DvtBaseDiagramLink.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) {
  return this.getDimensions(targetCoordinateSpace);
};


/**
 * @override
 */
DvtBaseDiagramLink.prototype.getTargetElem = function() 
{
  return this.getElem();
};


/**
 * @override
 */
DvtBaseDiagramLink.prototype.showKeyboardFocusEffect = function() {};

/**
 * @override
 */
DvtBaseDiagramLink.prototype.hideKeyboardFocusEffect = function() {};

/**
 * @override
 */
DvtBaseDiagramLink.prototype.isShowingKeyboardFocusEffect = function() {};

/**
 * Sets a node that should be used for clockwise/counterclockwise link navigation
 * @param {DvtBaseDiagramNode} node
 */
DvtBaseDiagramLink.prototype.setKeyboardFocusNode = function(node) {
  this._keyboardNavNode = node;
};

/**
 * Gets a node that should be used for clockwise/counterclockwise link navigation
 * @return {DvtBaseDiagramNode} a node that should be used for clockwise/counterclockwise link navigation
 */
DvtBaseDiagramLink.prototype.getKeyboardFocusNode = function() {
  return this._keyboardNavNode;
};

/**
 * Returns an array containing all categories to which this object belongs.
 * @return {array} The array of categories.
 */
DvtBaseDiagramLink.prototype.getCategories = function() {
  return null;
};
/**
 * @constructor
 * @class The base class for diagram links.
 * @param {DvtContext} context the rendering context
 * @param {string} nodeId the node id
 * @param {DvtDiagram} diagram parent diagram component
 * @implements {DvtSelectable}
 * @implements {DvtKeyboardNavigable}
 */
var DvtBaseDiagramNode = function(context, nodeId, diagram) {
  this.Init(context, nodeId, diagram);
};

DvtObj.createSubclass(DvtBaseDiagramNode, DvtContainer, 'DvtBaseDiagramNode');

/**
 * Initialization method called by the constructor
 * @param {DvtContext} context the rendering context
 * @param {string} nodeId the node id
 * @param {DvtDiagram} diagram parent diagram component
 */
DvtBaseDiagramNode.prototype.Init = function(context, nodeId, diagram) {
  DvtBaseDiagramNode.superclass.Init.call(this, context, null, nodeId);
  this._diagram = diagram;
  this._bDisclosed = false;
  this._selected = false;
  this._selectable = true;

  this._labelObj;
  this._labelPos;
  this._labelRotAngle;
  this._labelRotPoint;

  this._outLinkIds;
  this._inLinkIds;
};

/**
 * Gets parent diagram
 * @return {DvtBaseDiagram} parent diagram
 * @protected
 */
DvtBaseDiagramNode.prototype.GetDiagram = function() {
  return this._diagram;
};

/**
 * Gets data for the diagram node
 * @return {object} data for the diagram node
 */
DvtBaseDiagramNode.prototype.getData = function() {
  return null;
};

/**
 * Get the layout bounds in coordinates relative to this node
 * @return {DvtRectangle} layout bounds
 */
DvtBaseDiagramNode.prototype.getLayoutBounds = function() {
  return this.getContentBounds();
};

/**
 * Get the content bounds in coordinates relative to this node.
 * @return {DvtRectangle} content bounds
 */
DvtBaseDiagramNode.prototype.getContentBounds = function() {
  return new DvtRectangle(0, 0, this.getWidth(), this.getHeight());
};

/**
 * Gets the map of node layout attributes.
 * @param {string} layout layout name
 * @return {object}
 */
DvtBaseDiagramNode.prototype.getLayoutAttributes = function(layout) {
  return {};
};

/**
 * Sets the position of the link label. The position is in the coordinate
 * system of the node's container.
 * @param {DvtPoint} pos position of the node label
 */
DvtBaseDiagramNode.prototype.setLabelPosition = function(pos) {
  if (pos) {
    this._labelPos = pos;
    DvtBaseDiagramNode.PositionLabel(this._labelObj, pos, this.getLabelBounds(),
        this.getLabelRotationAngle(),
        this.getLabelRotationPoint());
  }
};

/**
 * Gets the position of the node label.
 * @return {DvtPoint}
 */
DvtBaseDiagramNode.prototype.getLabelPosition = function() {
  return this._labelPos;
};

/**
 * Gets label dimensions
 * @return {DvtRectangle} The bounds of the label
 */
DvtBaseDiagramNode.prototype.getLabelBounds = function() {
  return null;
};

/**
 * Sets label dimensions
 * @param {DvtRectangle} bounds The bounds of the label
 */
DvtBaseDiagramNode.prototype.setLabelBounds = function(bounds) {
};

/**
 * Get the padding of this container.  Values can be retrieved from the
 * returned map using keys 'top', 'left', 'bottom', and 'right'.
 * @return {object}
 */
DvtBaseDiagramNode.prototype.getContainerPadding = function() {
  return null;
};

/**
 * Sets padding for a container node
 * @param {number} top Top padding
 * @param {number} right Right padding
 * @param {number} bottom Bottom padding
 * @param {number} left Left padding
 * @param {DvtAnimator} animator The animator into which the transitions should be rendered (optional)
 */
DvtBaseDiagramNode.prototype.setContainerPadding = function(top, right, bottom, left, animator) {
};

/**
 * Checks if the diagram node is disclosed. Relevant for container nodes.
 * @return {boolean}  true if the diagram container node is disclosed
 */
DvtBaseDiagramNode.prototype.isDisclosed = function() {
  return this._bDisclosed;
};

/**
 * Sets disclosed flag for the node. Relevant for container nodes.
 * @param {boolean} bDisclosed true for disclosed container node
 */
DvtBaseDiagramNode.prototype.setDisclosed = function(bDisclosed) {
  this._bDisclosed = bDisclosed;
};

/**
 * Implemented for DvtSelectable
 * @override
 * @export
 */
DvtBaseDiagramNode.prototype.isSelected = function() {
  return this._selected;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtBaseDiagramNode.prototype.setSelected = function(selected) {
  // Store the selection state
  this._selected = selected;
};

/**
 * Sets selectable flag on the node
 * @param {boolean} selectable true if the node is selectable
 */
DvtBaseDiagramNode.prototype.setSelectable = function(selectable) {
  this._selectable = selectable;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
DvtBaseDiagramNode.prototype.isSelectable = function() {
  return this.GetDiagram().isSelectionSupported() && this._selectable;
};

/**
 * Sets hidden ancestor flag on the node
 * @param {boolean} bHiddenAncestor true if the node is hidden ancestor
 * @param {DvtAnimator} animator The animator into which the transitions should be rendered (optional)
 */
DvtBaseDiagramNode.prototype.setHiddenAncestor = function(bHiddenAncestor, animator) {
  this._bHiddenAncestor = bHiddenAncestor;
};

/**
 * Checks whether the node is hidden ancestor
 * @return {boolean} true if a node is a hidden ancestor
 */
DvtBaseDiagramNode.prototype.isHiddenAncestor = function() {
  return this._bHiddenAncestor;
};

/**
 * Sets label rotation angle
 * @param {number} angle angle of label rotation
 */
DvtBaseDiagramNode.prototype.setLabelRotationAngle = function(angle) {
  this._labelRotAngle = angle;
  DvtBaseDiagramNode.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(), angle, this.getLabelRotationPoint());
};

/**
 * Gets label rotation angle
 * @return {number} angle of label rotation
 */
DvtBaseDiagramNode.prototype.getLabelRotationAngle = function() {
  return this._labelRotAngle;
};

/**
 * Sets label rotation point
 * @param {DvtDiagramPoint} point label rotation point
 */
DvtBaseDiagramNode.prototype.setLabelRotationPoint = function(point) {
  this._labelRotPoint = point;
  DvtBaseDiagramNode.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(), this.getLabelRotationAngle(), point);
};

/**
 * Gets label rotation point
 * @return {DvtDiagramPoint} label rotation point
 */
DvtBaseDiagramNode.prototype.getLabelRotationPoint = function() {
  return this._labelRotPoint;
};

/**
 * Gets node bounds after layout is done
 * @param {DvtAnimator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @return {DvtRectangle} node bounds after layout is done
 * @protected
 */
DvtBaseDiagramNode.prototype.GetNodeBounds = function(animator) {
  var nodeBounds = this.getLayoutBounds();
  var bounds = new DvtRectangle(nodeBounds.x, nodeBounds.y, nodeBounds.w, nodeBounds.h);

  var labelPos = null;
  if (animator) {
    labelPos = animator.getDestVal(this, this.getLabelPosition);
  }
  if (!labelPos) {
    labelPos = this.getLabelPosition();
  }
  var labelRotAngle = null;
  var labelRotPoint = null;
  if (animator) {
    labelRotAngle = animator.getDestVal(this, this.getLabelRotationAngle);
    labelRotPoint = animator.getDestVal(this, this.getLabelRotationPoint);
  }
  if (labelRotAngle == null) {
    labelRotAngle = this.getLabelRotationAngle();
  }
  if (!labelRotPoint) {
    labelRotPoint = this.getLabelRotationPoint();
  }
  var labelBounds = this.getLabelBounds();
  if (labelPos && labelBounds) {
    //take label rotation into account
    if (labelRotAngle != null) {
      labelBounds = DvtBaseDiagram.RotateBounds(labelBounds, labelRotAngle, labelRotPoint);
    }
    //label coords are relative to containing node
    bounds.x = Math.min(nodeBounds.x, labelBounds.x + labelPos.x);
    bounds.y = Math.min(nodeBounds.y, labelBounds.y + labelPos.y);
    bounds.w = Math.max(nodeBounds.x + nodeBounds.w, labelBounds.x + labelPos.x + labelBounds.w) - bounds.x;
    bounds.h = Math.max(nodeBounds.y + nodeBounds.h, labelBounds.y + labelPos.y + labelBounds.h) - bounds.y;
  }

  return bounds;
};

/**
 * @protected
 * Calculate the matrix used to rotate and position the label.
 * @param {DvtPoint} pos position of the link label
 * @param {DvtRectangle} bounds label bounds
 * @param {number} rotAngle rotation angle for the label
 * @param {DvtPoint} rotPoint rotation point for the label
 * @return {DvtMatrix} matrix used to rotate and position the label
 */
DvtBaseDiagramNode.CalcLabelMatrix = function(pos, bounds, rotAngle, rotPoint) {
  var mat = new DvtMatrix();
  if (rotAngle != null) {
    if (rotPoint) {
      mat.translate(- rotPoint.x, - rotPoint.y);
    }
    mat.rotate(rotAngle);
    if (rotPoint) {
      mat.translate(rotPoint.x, rotPoint.y);
    }
  }
  if (pos) {
    mat.translate(pos.x, pos.y);
  }
  return mat;
};

/**
 * Positions node label
 * @param {DvtOutputText} label node label
 * @param {DvtPoint} pos position of the node label
 * @param {DvtRectangle} bounds label bounds
 * @param {number} rotAngle rotation angle for the label
 * @param {DvtPoint} rotPoint rotation point for the label
 * @protected
 */
DvtBaseDiagramNode.PositionLabel = function(label, pos, bounds, rotAngle, rotPoint) {
  if (!label)
    return;
  var mat = DvtBaseDiagramNode.CalcLabelMatrix(pos, bounds, rotAngle, rotPoint);
  label.setMatrix(mat);
};

/**
 * Sets position of the node
 * @param {number} xx x coordinate for the node
 * @param {number} yy y coordinate for the node
 * @param {DvtAnimator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @protected
 */
DvtBaseDiagramNode.prototype.SetPosition = function(xx, yy, animator) {
  if (animator) {
    animator.addProp(DvtAnimator.TYPE_NUMBER, this, this.getTranslateX, this.setTranslateX, xx);
    animator.addProp(DvtAnimator.TYPE_NUMBER, this, this.getTranslateY, this.setTranslateY, yy);
  }
  else {
    this.setTranslate(xx, yy);
  }
};

/**
 * Gets position of the node
 * @param {DvtAnimator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @return {DvtPoint} node position
 * @protected
 */
DvtBaseDiagramNode.prototype.GetPosition = function(animator) 
{
  var xx;
  var yy;
  if (animator) {
    xx = animator.getDestVal(this, this.getTranslateX);
    yy = animator.getDestVal(this, this.getTranslateY);
  }
  if (xx == null) {
    xx = this.getTranslateX();
  }
  if (yy == null) {
    yy = this.getTranslateY();
  }
  return new DvtPoint(xx, yy);
};

// Implementation of DvtKeyboardNavigable interface
/**
 * @override
 */
DvtBaseDiagramNode.prototype.getNextNavigable = function(event) {
  //subclasses should override
  return null;
};

/**
 * @override
 */
DvtBaseDiagramNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  // return the bounding box for the diagram node, in stage coordinates
  // we don't call this.getDimensions(this.getCtx().getStage() because
  // that would take into account any selection/keyboard focus effects.
  // so instead, we get the content bounds of the node and convert that
  // to stage coordinates, based on code in DvtDisplayable.getDimensions()
  var bounds = this.getContentBounds(targetCoordinateSpace);
  var stageP1 = this.localToStage(new DvtPoint(bounds.x, bounds.y));
  var stageP2 = this.localToStage(new DvtPoint(bounds.x + bounds.w, bounds.y + bounds.h));
  return new DvtRectangle(stageP1.x, stageP1.y, stageP2.x - stageP1.x, stageP2.y - stageP1.y);
};

/**
 * @override
 */
DvtBaseDiagramNode.prototype.getTargetElem = function() 
{
  return this.getElem();
};

/**
 * @override
 */
DvtBaseDiagramNode.prototype.showKeyboardFocusEffect = function() {};

/**
 * @override
 */
DvtBaseDiagramNode.prototype.hideKeyboardFocusEffect = function() {};

/**
 * @override
 */
DvtBaseDiagramNode.prototype.isShowingKeyboardFocusEffect = function() {};

/**
 * Returns an array containing all categories to which this object belongs.
 * @return {array} The array of categories.
 */
DvtBaseDiagramNode.prototype.getCategories = function() {
  return null;
};

/**
 * Stores an id of an outgoing link for the node
 * @param {string} id an id for the outgoing link
 */
DvtBaseDiagramNode.prototype.addOutLinkId = function(id) {
  if (!this._outLinkIds) {
    this._outLinkIds = [];
  }
  this._outLinkIds.push(id);
};

/**
 * Removes an id of the outgoing link
 * @param {string} id an id for the outgoing link
 */
DvtBaseDiagramNode.prototype.removeOutLinkId = function(id)
{
  if (this._outLinkIds) {
    var idx = DvtArrayUtils.getIndex(this._outLinkIds, id);
    if (idx != -1) {
      this._outLinkIds.splice(idx, 1);
    }
  }
};

/**
 * Gets ids of outgoing links for the node
 * @return {array} ids of outgoing links for the node
 */
DvtBaseDiagramNode.prototype.getOutLinkIds = function() {
  return this._outLinkIds;
};

/**
 * Stores an id of an incoming link for the node
 * @param {string} id an id for the incoming link
 */
DvtBaseDiagramNode.prototype.addInLinkId = function(id)
{
  if (!this._inLinkIds)
  {
    this._inLinkIds = [];
  }
  this._inLinkIds.push(id);
};

/**
 * Removes an id of the incoming link
 * @param {string} id an id for the incoming link
 */
DvtBaseDiagramNode.prototype.removeInLinkId = function(id)
{
  if (this._inLinkIds) {
    var idx = DvtArrayUtils.getIndex(this._inLinkIds, id);
    if (idx != -1) {
      this._inLinkIds.splice(idx, 1);
    }
  }
};

/**
 * Gets ids of incoming links for the node
 * @return {array} ids of incoming links for the node
 */
DvtBaseDiagramNode.prototype.getInLinkIds = function()
{
  return this._inLinkIds;
};
/**
 * @param {DvtContext} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @constructor
 * @export
 */
var DvtDiagram = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

DvtObj.createSubclass(DvtDiagram, DvtBaseDiagram, 'DvtDiagram');

/**
 * Initialization method called by the constructor
 *
 * @param {DvtContext} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 */
DvtDiagram.prototype.Init = function(context, callback, callbackObj) {
  DvtDiagram.superclass.Init.call(this, context, callback, callbackObj);
  // Create the defaults object
  this.Defaults = new DvtDiagramDefaults();

  // Create the event handler and add event listeners
  this._eventHandler = new DvtDiagramEventManager(context, this.processEvent, this);
  this._eventHandler.addListeners(this);

  // Set up keyboard handler on non-touch devices
  if (!DvtAgent.isTouchDevice())
    this._eventHandler.setKeyboardHandler(new DvtDiagramKeyboardHandler(this, this._eventHandler));

  this._nodes = {};
  this._arNodeIds = [];
  this._links = {};
  this._arLinkIds = [];
  this._renderCount = 0;
};

/**
 * Returns a new instance of DvtDiagram. Currently only called by json supported platforms.
 * @param {DvtContext} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {DvtDiagram}
 * @export
 */
DvtDiagram.newInstance = function(context, callback, callbackObj) {
  return new DvtDiagram(context, callback, callbackObj);
};

/**
 * @override
 */
DvtDiagram.prototype.PreRender = function() {
  if (!this.IsResize() && this._bRendered) {
    if (this.getDataChangeAnim() != 'none') {
      //save the state
      this._oldDataAnimState = {
        'id': this.getId(),
        'getId': function() {return this['id']},
        'options': this.getOptions(),
        'getOptions': function() {return this['options'];},
        'panZoomMatrix': this.getPanZoomCanvas().getContentPane().getMatrix(),
        'getPanZoomMatrix': function() {return this['panZoomMatrix'];},
        'nodes': this._nodes ? this.GetAllNodeObjects() : [],
        'links': this._links ? this.GetAllLinkObjects() : [],
        'getNodes': function() {return this['nodes'];},
        'getLinks': function() {return this['links'];}
      };

      // Also expose functions directly, since it will be called by internal code that is renamed.
      this._oldDataAnimState.getOptions = this._oldDataAnimState['getOptions'];
      this._oldDataAnimState.getPanZoomMatrix = this._oldDataAnimState['getPanZoomMatrix'];
      this._oldDataAnimState.getId = this._oldDataAnimState['getId'];
      this._oldDataAnimState.getNodes = this._oldDataAnimState['getNodes'];
      this._oldDataAnimState.getLinks = this._oldDataAnimState['getLinks'];
    }
    this._bRendered = false;
    // save old pan zoom canvas for data transitions
    this._oldPanZoomCanvas = this.getPanZoomCanvas();
  }
  if (!this.IsResize()) {
    this.ResetNodesAndLinks();
  }
};

/**
 * Resets nodes and links
 * @protected
 */
DvtDiagram.prototype.ResetNodesAndLinks = function() {
  this.setLinksPane(new DvtContainer(this.getCtx()));
  this.setNodesPane(new DvtContainer(this.getCtx()));
  this.setTopPane(new DvtContainer(this.getCtx()));
  this._nodes = {};
  this._arNodeIds = [];
  this._links = {};
  this._arLinkIds = [];
  // Make sure we're not holding references to any obsolete nodes/links
  this._highlightedObjects = null;
};

/**
 * Hook for cleaning up animation behavior at the end of the animation.
 * @private
 */
DvtDiagram.prototype._onAnimationEnd = function() {

  if (this._deleteContainer) {
    this.removeChild(this._deleteContainer);
    this._deleteContainer.destroy();
  }
  this._deleteContainer = null;

  if (this._animation) {
    this._animation = null;
    // Restore event listeners
    this.getEventManager().addListeners(this);
  }
};

/**
 * @override
 */
DvtDiagram.prototype.animateUpdate = function(animationHandler, oldDiagramState) {
  var playable = new DvtCustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());
  var oldMat = oldDiagramState.getPanZoomMatrix();
  var newMat = this.getPanZoomCanvas().getContentPane().getMatrix();
  if (!oldMat.equals(newMat)) {
    this.getPanZoomCanvas().getContentPane().setMatrix(oldMat);
    playable.getAnimator().addProp(DvtAnimator.TYPE_MATRIX, this.getPanZoomCanvas().getContentPane(), this.getPanZoomCanvas().getContentPane().getMatrix, this.getPanZoomCanvas().getContentPane().setMatrix, newMat);
  }
  animationHandler.constructAnimation(oldDiagramState.getNodes(), this._nodes ? this.GetAllNodeObjects() : []);
  animationHandler.constructAnimation(oldDiagramState.getLinks(), this._links ? this.GetAllLinkObjects() : []);
  animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);
};

/**
 * Renders a Diagram component after it was initialized.
 * @param {DvtAnimator=} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @protected
 */
DvtDiagram.prototype.RenderComponentInternal = function(animator) {
  var emptyDiagram = false;
  if (!this._bRendered && !this.IsResize()) {
    this.renderNodes();
    this.renderLinks();
    //check whether nodes were filtered out
    //Object.keys is not available on REL13 so we need to generate the keys to array ourselves
    var keys = [];
    for (var key in this._nodes) {
      keys.push(key);
    }
    emptyDiagram = keys.length === 0;
    this.getCtx().setKeyboardFocusArray([this]);
    this._renderCount++;
  }

  if (!emptyDiagram) {
    // the child is going to be removed by  _processContent() function or layout failure function
    if (!this.contains(this._oldPanZoomCanvas))
      this.addChild(this._oldPanZoomCanvas);

    var res = this.layout(animator);
    var thisRef = this;
    res.then(
        function() {
          thisRef._renderCount = thisRef._bRendered ? thisRef._renderCount : thisRef._renderCount - 1;
          if (thisRef._renderCount === 0) {
            thisRef._processContent(animator, emptyDiagram);
          }
        }, //success
        function() {
          thisRef._renderCount = thisRef._bRendered ? thisRef._renderCount : thisRef._renderCount - 1;
          if (thisRef._renderCount === 0) {
            thisRef.removeChild(thisRef._oldPanZoomCanvas);
            thisRef._oldPanZoomCanvas = null;
            thisRef._bRendered = true;
          }
        } //failure
    );
  }
  else { //empty diagram - nothing to layout, might need to run data change animation
    this._renderCount = this._bRendered ? this._renderCount : this._renderCount - 1;
    if (this._renderCount === 0) {
      this._processContent(animator, emptyDiagram);
    }
  }
};

/**
 * Process diagram content after layout is done - zoom to fit, animate if it is necessary
 * @param {DvtAnimator=} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @param {boolean} bEmptyDiagram True if diagram is empty
 * @private
 */
DvtDiagram.prototype._processContent = function(animator, bEmptyDiagram) {
  var calcViewBounds;
  if (!bEmptyDiagram) {
    this.removeChild(this._oldPanZoomCanvas);
    this._processHighlighting();
    this._processInitialSelections();
    calcViewBounds = this._cachedViewBounds == null;
    if (calcViewBounds) {
      this._cachedViewBounds = this.GetViewBounds(animator);
    }
    this._fitContent(animator);
  }
  this._oldPanZoomCanvas = null;

  if (!this._bRendered) {
    // Animation Support
    // Stop any animation in progress
    if (this._animation) {
      this._animation.stop(true);
    }

    //initial animation
    if (DvtAgent.isEnvironmentBrowser() && this.getInitAnim() && !this._oldDataAnimState) {
      this._animation = DvtBlackBoxAnimationHandler.getInAnimation(this.getCtx(), this.getInitAnim(), this, null, this.getAnimationDuration());
    }
    else if (this.getDataChangeAnim() != 'none' && this._oldDataAnimState) {
      this._deleteContainer = new DvtContainer(this.getCtx(), 'Delete Container');
      this.addChild(this._deleteContainer);
      var ah = new DvtDiagramDataAnimationHandler(this.getCtx(), this._deleteContainer, this._oldDataAnimState, this);
      ah.constructAnimation([this._oldDataAnimState], [this]);
      this._animation = ah.getAnimation();
    }
    // If an animation was created, play it
    if (this._animation) {
      this.getEventManager().hideTooltip();
      // Disable event listeners temporarily
      this.getEventManager().removeListeners(this);
      this._animation.setOnEnd(this._onAnimationEnd, this);
      this._animation.play();
    } else {
      this._onAnimationEnd();
    }
  }
  this._bRendered = true;
  this.RefreshEmptyText(bEmptyDiagram);

  // Constrain pan bounds
  if (this.IsPanningEnabled()) {
    var contentDim = this._cachedViewBounds;
    if (contentDim != null) {
      var zoom = this.getPanZoomCanvas().getZoom(animator);
      this.ConstrainPanning(contentDim.x, contentDim.y, contentDim.w, contentDim.h, zoom);
    }
  }

  this.ClearLayoutViewport();
  if (calcViewBounds) {
    this._cachedViewBounds = null;
  }
};

/**
 * Fit and position diagram content into container if necessary
 * @param {DvtAnimator=} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @private
 */
DvtDiagram.prototype._fitContent = function(animator) {
  var pzc = this.getPanZoomCanvas();
  if (!this._bRendered) {
    this.AdjustMinZoom(animator, this._cachedViewBounds);
    //if we're rendering null xml, it may be for a maximize/restore,
    //so don't automatically zoom-to-fit
    if (!this.IsResize()) {
      //: don't override a viewport returned from the layout engine
      var bLayoutViewport = this.IsLayoutViewport();
      var fitBounds = bLayoutViewport ? this.GetLayoutViewport() : this._cachedViewBounds;
      if (bLayoutViewport)
        pzc.setZoomToFitPadding(0);
      pzc.zoomToFit(null, fitBounds);
    }

    pzc.setPanningEnabled(this.IsPanningEnabled());
    pzc.setZoomingEnabled(this.IsZoomingEnabled());
    pzc.setZoomToFitEnabled(this.IsZoomingEnabled());
  }
  else if (this.IsResize()) {
    // Update the min zoom if it's unspecified
    var viewBounds = this.AdjustMinZoom(animator, this._cachedViewBounds);
    var fitBounds = bLayoutViewport ? this.GetLayoutViewport() :
                    viewBounds ? viewBounds : this._cachedViewBounds;
    pzc.setZoomToFitEnabled(true);
    pzc.zoomToFit(null, fitBounds);
    pzc.setZoomToFitEnabled(this.IsZoomingEnabled());
  }
};

/**
 * @override
 */
DvtDiagram.prototype.SetOptions = function(options) {
  DvtDiagram.superclass.SetOptions.call(this, options);
  //initial setup
  this.parseComponentJson(this.Options); //set component background
  this.SetPanningEnabled(this.Options['panning'] != 'none');
  this.SetZoomingEnabled(this.Options['zooming'] != 'none');
  this.setControlPanelBehavior('hidden');
  this.setDataChangeAnim(this.Options['animationOnDataChange']);
  this.setInitAnim(this.Options['animationOnDisplay'] == 'auto' ? DvtBlackBoxAnimationHandler.ALPHA_FADE : null);
  this.setSelectionMode(this.Options['selectionMode']);
  this.setEmptyText(this.Options['emptyText'] ? this.Options['emptyText'] : DvtBundle.getTranslation(this.Options, 'labelNoData', DvtBundle.UTIL_PREFIX, 'NO_DATA'));
};

/**
 * Returns a copy of the default options for the specified skin.
 * @param {string} skin The skin whose defaults are being returned.
 * @return {object} The object containing defaults for this component.
 */
DvtDiagram.getDefaults = function(skin) {
  return (new DvtDiagramDefaults()).getDefaults(skin);
};

/**
 * @override
 */
DvtDiagram.prototype.getMaxZoom = function() {
  var maxZoom = this.getOptions()['maxZoom'];
  var f = parseFloat(maxZoom);
  return f > 0 ? f : 1.0;
};

/**
 * @override
 */
DvtDiagram.prototype.getMinZoom = function() {
  var minZoom = this.getOptions()['minZoom'];
  if (minZoom) {
    var f = parseFloat(minZoom);
    if (f > 0) {
      minZoom = Math.min(f, this.getMaxZoom());
    }
    return minZoom;
  }
  return null;
};

/**
 * @override
 */
DvtDiagram.prototype.getAnimationDuration = function() {
  return DvtStyleUtils.getTimeMilliseconds(this.getOptions()['styleDefaults']['animationDuration']) / 1000;
};

/**
 * Processes the specified event.
 * @param {object} event
 * @param {object} source The component that is the source of the event, if available.
 */
DvtDiagram.prototype.processEvent = function(event, source) {
  var type = event.getType();
  if (type == DvtCategoryRolloverEvent.TYPE_OVER || type == DvtCategoryRolloverEvent.TYPE_OUT) {
    this._processHighlighting();
  }
  if (event) {
    this.dispatchEvent(event);
  }
};

/**
 * Renders diagram nodes
 */
DvtDiagram.prototype.renderNodes = function() {
  var nodesData = this.getOptions()['nodes'];
  if (!nodesData)
    return;
  for (var i = 0; i < nodesData.length; i++) {
    var nodeData = nodesData[i];
    nodeData = DvtJSONUtils.merge(nodeData, this.getOptions()['styleDefaults']['nodeDefaults']);
    var node = DvtDiagramNode.newInstance(this, nodeData);
    var nodeId = node.getId();
    if (node.isHidden()) {
      this._arNodeIds.push(nodeId);
    }
    else {
      node.render(this.getNodesPane());
      this._arNodeIds.push(nodeId);
      this._nodes[nodeId] = node;
    }
  }
};

/**
 * Renders diagram links
 */
DvtDiagram.prototype.renderLinks = function() {
  var linksData = this.getOptions()['links'];
  if (!linksData)
    return;
  for (var i = 0; i < linksData.length; i++) {
    var linkData = linksData[i];
    linkData = DvtJSONUtils.merge(linkData, this.getOptions()['styleDefaults']['linkDefaults']);
    var link = DvtDiagramLink.newInstance(this, linkData);
    var linkId = link.getId();
    if (link.isHidden()) {
      this._arLinkIds.push(linkId);
      continue;
    }
    link.render(this.getLinksPane());
    this._arLinkIds.push(linkId);
    this._links[linkId] = link;

    var startNode = this.getNodeById(link.getStartId());
    var endNode = this.getNodeById(link.getEndId());
    startNode.addOutLinkId(linkId);
    endNode.addInLinkId(linkId);
  }
};

/**
 * Layout diagram nodes and links
 * @param {DvtAnimator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @return {object} Promise or Promise like object that implements then function - then function should be executed after layout is done
 */
DvtDiagram.prototype.layout = function(animator) {
  var layoutFunc = this.getOptions()['layout'];
  var layoutContext = this.CreateEmptyLayoutContext();
  var nodeIds = {
  };
  for (var n = 0; n < this._arNodeIds.length; n++) {
    var nodeId = this._arNodeIds[n];
    if (!this.getNodeById(nodeId))
      continue;
    nodeIds[nodeId] = true;
    layoutContext.addNode(this.CreateLayoutContextNode(this.getNodeById(nodeId)));
  }
  for (var linkId in this._links) {
    var link = this.getLinkById(linkId);
    if (!link)
      continue;
    var startId = link.getData()['startNode'];
    var endId = link.getData()['endNode'];
    if (nodeIds[startId] && nodeIds[endId]) {
      layoutContext.addLink(this.CreateLayoutContextLink(link, startId, endId));
    }
  }
  if (layoutFunc && typeof layoutFunc == 'function') {
    var thisRef = this;
    var promise = layoutFunc(layoutContext);
    if (!promise) {
      promise = {
        then: function(resolveFunc, errorFunc) {
          resolveFunc();
        }
      };
    }
    this.setAlphas(0);
    promise.then(
        function(response) {
          if (thisRef._renderCount === 1) {
            thisRef.setAlphas(1.0);
            thisRef.ApplyLayoutContext(layoutContext, animator, true);
          }
        },
        function(error) {
        }
    );
    return promise;
  }
  else {
    this.Log('DvtDiagram: Layout function is not defined', 1);// LEVEL_ERROR
  }
};

/**
 * Sets the alphas on diagram panes.
 * @param {number} alpha panes opacity
 */
DvtDiagram.prototype.setAlphas = function(alpha) {
  if (!this._bRendered) {
    this.getLinksPane().setAlpha(alpha);
    this.getNodesPane().setAlpha(alpha);
  }
};

/**
 * @override
 */
DvtDiagram.prototype.getNodeById = function(id) {
  return this._nodes[id];
};

/**
 * @override
 */
DvtDiagram.prototype.getLinkById = function(id) {
  return this._links[id];
};

/**
 * @override
 */
DvtDiagram.prototype.GetAllLinks = function() {
  return this._arLinkIds;
};

/**
 * Gets an array of all link objects
 * @return {array} array of all link objects
 * @protected
 */
DvtDiagram.prototype.GetAllLinkObjects = function() {
  var allLinks = [];
  for (var linkId in this._links) {
    allLinks.push(this._links[linkId]);
  }
  return allLinks;
};

/**
 * @override
 */
DvtDiagram.prototype.GetAllNodes = function() {
  return this._arNodeIds;
};

/**
 * Gets an array of all node objects
 * @return {array} array of all node objects
 * @protected
 */
DvtDiagram.prototype.GetAllNodeObjects = function() {
  var allNodes = [];
  for (var nodeId in this._nodes) {
    allNodes.push(this._nodes[nodeId]);
  }
  return allNodes;
};

/**
 * @override
 */
DvtDiagram.prototype.HandleZoomEvent = function(event) {
  DvtDiagram.superclass.HandleZoomEvent.call(this, event);
  var subType = event.getSubType();
  switch (subType) {
    case DvtZoomEvent.SUBTYPE_ADJUST_PAN_CONSTRAINTS:
      if (this.IsPanningEnabled()) {
        var zoom = event.getNewZoom();
        // Calculate the new content dimensions based on the new zoom
        var contentDim = this._cachedViewBounds ? this._cachedViewBounds : this.GetViewBounds(event.getAnimator());
        this.ConstrainPanning(contentDim.x, contentDim.y, contentDim.w, contentDim.h, zoom);
      }
      break;
    case DvtZoomEvent.SUBTYPE_ZOOM_TO_FIT_CALC_BOUNDS:
      //do not override a viewport returned from the layout engine
      if (!this.IsLayoutViewport()) {
        // Calculate the new content dimensions based on the new zoom
        var contentDim = this._cachedViewBounds ? this._cachedViewBounds : this.GetViewBounds(event.getAnimator());
        event.setZoomToFitBounds(contentDim);
      }
      break;
    case DvtZoomEvent.SUBTYPE_ZOOMED:
      if (this.getOptions()['zoomRenderer'] && event.getOldZoom() !== event.getNewZoom()) {
        for (var nodeId in this._nodes) {
          var node = this.getNodeById(nodeId);
          node.rerenderOnZoom(event);
        }
      }
      break;
  }
};

/**
 * The method is called by the peer after a PPR. The method prepares/reinitializes the component for the new data
 * and it stores the old data that will be used to animate a transition from the old state to the new state.
 * The animation will happen later when component is rendered.
 */
DvtDiagram.prototype.prepareForDataChange = function() {
};

/**
 * Gets an array of navigable links for the specified node
 * @param {string} nodeId node id
 * @return {array} array of navigable links for the specified node
 */
DvtDiagram.prototype.getNavigableLinksForNodeId = function(nodeId) {
  var links = [];
  for (var linkId in this._links) {
    var link = this.getLinkById(linkId);
    var startId = link.getStartId();
    var endId = link.getEndId();

    if ((startId == nodeId || endId == nodeId) && link.getVisible())
      links.push(link);
  }
  return links;
};

/**
 * @override
 */
DvtDiagram.prototype.GetComponentDescription = function() {
  return DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, 'DIAGRAM');
};

/**
 * Update the selection handler with the initial selections.
 * @private
 */
DvtDiagram.prototype._processInitialSelections = function() {
  var selection = this.Options['selection'];
  if (!selection)
    return;
  if (this.isSelectionSupported()) {
    var targets = [];
    for (var nodeId in this._nodes) {
      targets.push(this.getNodeById(nodeId));
    }
    for (var linkId in this._links) {
      targets.push(this.getLinkById(linkId));
    }
    this.getSelectionHandler().processInitialSelections(this.Options['selection'], targets);
  }
};

/**
 * Process highlighting
 * @private
 */
DvtDiagram.prototype._processHighlighting = function() {
  //clear existing
  if (this._highlightedObjects) {
    this._updateAlphas(false, this._highlightedObjects);
    this._highlightedObjects = null;
  }

  var categories = this.Options['highlightedCategories'];
  if (!categories)
    return;

  var bAnyMatched = this.Options['highlightMatch'] == 'any';
  this._highlightedObjects = {};
  var highlightedNodes = [];
  //find highlighted nodes
  for (var nodeId in this._nodes) {
    var node = this.getNodeById(nodeId);
    var match = bAnyMatched ? DvtArrayUtils.hasAnyItem(node.getCategories(), categories) :
                DvtArrayUtils.hasAllItems(node.getCategories(), categories);
    if (match) {
      this._highlightedObjects[node.getId()] = node;
      highlightedNodes.push(node);
    }
  }
  this._processNodeConnections(highlightedNodes);

  //find highlighted links
  var highlightedLinks = [];
  for (var linkId in this._links) {
    var link = this.getLinkById(linkId);
    var match = bAnyMatched ? DvtArrayUtils.hasAnyItem(link.getCategories(), categories) :
                DvtArrayUtils.hasAllItems(link.getCategories(), categories);
    if (match) {
      this._highlightedObjects[link.getId()] = link;
      highlightedLinks.push(link);
    }
  }
  if (this.Options['linkHighlightMode'] == 'linkAndNodes') {
    this._processLinkConnections(highlightedLinks);
  }

  this._updateAlphas(true, this._highlightedObjects);
};

/**
 * Add specified connection (incoming and outgoing) with the endpoints to the map of highlighted objects
 * @param {array} highlightedNodes nodes to process
 * @private
 */
DvtDiagram.prototype._processNodeConnections = function(highlightedNodes) {
  var nodeHighlightMode = this.Options['nodeHighlightMode'];
  if (nodeHighlightMode != 'node') {

    var incoming = (nodeHighlightMode == 'nodeAndIncomingLinks' || nodeHighlightMode == 'nodeAndLinks');
    var outgoing = (nodeHighlightMode == 'nodeAndOutgoingLinks' || nodeHighlightMode == 'nodeAndLinks');
    var highlightedLinks = [];

    for (var nodeIdx = 0; nodeIdx < highlightedNodes.length; nodeIdx++) {
      var node = highlightedNodes[nodeIdx];
      var links = incoming && node.getInLinkIds() ? node.getInLinkIds() : [];
      links = outgoing && node.getOutLinkIds() ? links.concat(node.getOutLinkIds()) : links;
      for (var idx = 0; idx < links.length; idx++) {
        var linkId = links[idx];
        this._highlightedObjects[linkId] = this.getLinkById(linkId);
        highlightedLinks.push(this.getLinkById(linkId));
      }
    }
    this._processLinkConnections(highlightedLinks);
  }
};

/**
 * Add start and end nodes to the map of highlighted objects
 * @param {array} highlightedLinks links to process
 * @private
 */
DvtDiagram.prototype._processLinkConnections = function(highlightedLinks) {
  for (var linkIdx = 0; linkIdx < highlightedLinks.length; linkIdx++) {
    var link = highlightedLinks[linkIdx];
    var linkStartId = link.getStartId();
    var linkEndId = link.getEndId();
    this._highlightedObjects[linkStartId] = this.getNodeById(linkStartId);
    this._highlightedObjects[linkEndId] = this.getNodeById(linkEndId);
  }
};


/**
 * Highlight objects by setting alpha on links and nodes panes and
 * bringing highlighted objects to either content pane or corresponding link/nodes pane
 * @param {boolean} bHighlight true highligh objects, false to unhighlight
 * @param {object} highlightedObjects a map of highlighted object
 * @private
 */
DvtDiagram.prototype._updateAlphas = function(bHighlight, highlightedObjects) {
  var defaultAlpha = bHighlight ? this.Options['styleDefaults']['_highlightAlpha'] : 1.0;
  //update alphas on link and node panes
  this.getLinksPane().setAlpha(defaultAlpha);
  this.getNodesPane().setAlpha(defaultAlpha);
  // Then just reparent the interesting links and nodes
  for (var id in highlightedObjects) {
    if (bHighlight) {
      this.moveToDiagramFront(highlightedObjects[id]);
    }
    else {
      if (highlightedObjects[id] instanceof DvtDiagramLink) {
        this.moveToLinks(highlightedObjects[id]);
      }
      else if (highlightedObjects[id] instanceof DvtDiagramNode) {
        this.moveToNodes(highlightedObjects[id]);
      }
    }
  }
};

/**
 * @override
 * @export
 */
DvtDiagram.prototype.highlight = function(categories) {
  // Update the options
  this.Options['highlightedCategories'] = DvtJSONUtils.clone(categories);

  // Perform the highlighting
  this._processHighlighting();
};

/**
 * @override
 * @export
 */
DvtDiagram.prototype.select = function(selection) {
  // Update the options
  this.Options['selection'] = DvtJSONUtils.clone(selection);

  // Perform the selection
  this._processInitialSelections();
};

/**
 * @return {DvtDiagramAutomation} the automation object
 * @export
 */
DvtDiagram.prototype.getAutomation = function() {
  if (!this.Automation)
    this.Automation = new DvtDiagramAutomation(this);
  return this.Automation;
};


/**
 * Logs diagram messages
 * @param {string} message
 * @param {number} level log level - LEVEL_ERROR = 1, LEVEL_WARN = 2, LEVEL_INFO = 3, LEVEL_LOG = 4
 * @protected
 */
DvtDiagram.prototype.Log = function(message, level) {
  var logger = this.getOptions()['_logger'];
  if (logger) {
    switch (level) {
      case 1: if (logger.error) logger.error(message); break;
      case 2: if (logger.warn) logger.warn(message); break;
      case 3: if (logger.info) logger.info(message); break;
      default: if (logger.log) logger.log(message); break;
    }
  }
};

/**
 * Hides or shows default hover effect on the specified node
 * @param {string} nodeId node id
 * @param {boolean} hovered true to show hover effect
 * @export
 */
DvtDiagram.prototype.processDefaultHoverEffect = function(nodeId, hovered) {
  var node = this.getNodeById(nodeId);
  if (node)
    node.processDefaultHoverEffect(hovered);
};

/**
 * Hides or shows default selection effect on the specified node
 * @param {string} nodeId node id
 * @param {boolean} selected true to show selection effect
 * @export
 */
DvtDiagram.prototype.processDefaultSelectionEffect = function(nodeId, selected) {
  var node = this.getNodeById(nodeId);
  if (node)
    node.processDefaultSelectionEffect(selected);
};

/**
 * Hides or shows default keyboard focus effect on the specified node
 * @param {string} nodeId node id
 * @param {boolean} focused true to show keyboard focus effect
 * @export
 */
DvtDiagram.prototype.processDefaultFocusEffect = function(nodeId, focused) {
  var node = this.getNodeById(nodeId);
  if (node)
    node.processDefaultFocusEffect(focused);
};

/**
 * @override
 */
DvtDiagram.prototype.renderNodeFromContext = function(nodeContext) {
  var node = this.getNodeById(nodeContext.getId());
  if (!node.IsRendered()) {
    node.render(this.getNodesPane());
    this.UpdateNodeLayoutContext(nodeContext, node);
  }
};
/**
 * Category rollover handler for Diagram
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The object instance that the callback function is defined on.
 * @class DvtDiagramCategoryRolloverHandler
 * @extends {DvtCategoryRolloverHandler}
 * @constructor
 */
var DvtDiagramCategoryRolloverHandler = function(callback, callbackObj) {
  DvtDiagramCategoryRolloverHandler.superclass.constructor.call(this, callback, callbackObj);
  this.setHoverDelay(DvtDiagramCategoryRolloverHandler._HOVER_DELAY);
  this._diagram = callbackObj;
};

DvtObj.createSubclass(DvtDiagramCategoryRolloverHandler, DvtCategoryRolloverHandler, 'DvtDiagramCategoryRolloverHandler');

/**
 * The delay in applying highlighting for subsequent highlights. It's primary function is to reduce jitter when
 * moving across small gaps between data items.
 * @const
 * @private
 */
DvtDiagramCategoryRolloverHandler._HOVER_DELAY = 100;

/**
 * @override
 */
DvtDiagramCategoryRolloverHandler.prototype.GetRolloverCallback = function(event, objs, bAnyMatched, customAlpha) {
  var callback = function() {
    this.SetHighlightMode(true);
    this._diagram.processEvent(event);
  };
  return DvtObj.createCallback(this, callback);
};

/**
 * @override
 */
DvtDiagramCategoryRolloverHandler.prototype.GetRolloutCallback = function(event, objs, bAnyMatched, customAlpha) {
  var callback = function() {
    this.SetHighlightModeTimeout();
    this._diagram.processEvent(event);
  };
  return DvtObj.createCallback(this, callback);
};
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {DvtBaseComponentDefaults}
 */
var DvtDiagramDefaults = function() {
  this.Init({'skyros': DvtDiagramDefaults.VERSION_1, 'alta': DvtDiagramDefaults.SKIN_ALTA});
};

DvtObj.createSubclass(DvtDiagramDefaults, DvtBaseComponentDefaults, 'DvtDiagramDefaults');


/**
 * Defaults for version 1.
 */
DvtDiagramDefaults.VERSION_1 = {
  'skin': DvtCSSStyle.SKIN_ALTA,
  'emptyText': null,
  'selectionMode': 'none',
  'animationOnDataChange': 'none',
  'animationOnDisplay': 'none',
  'maxZoom' : 1.0,
  'highlightMatch' : 'all',
  'nodeHighlightMode': 'node',
  'linkHighlightMode': 'link',
  'panning': 'none',
  'touchResponse': 'auto',
  'zooming': 'none',
  '_statusMessageStyle': new DvtCSSStyle("font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;"),
  'styleDefaults': {
    'animationDuration': 500,
    'hoverBehaviorDelay': 200,
    '_highlightAlpha' : .1,
    'nodeDefaults': {
      'labelStyle': 'font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;font-weight:bold;font-size:12px;color:#383A47',
      'hoverInnerColor': 'rgb(255,255,255)',
      'hoverOuterColor': 'rgba(0,0,0, .3)',
      'selectionColor': 'rgb(0,0,0)',
      'icon': {
        'width': 10,
        'height': 10,
        'fillPattern' : 'none',
        'shape': 'circle'
      }
    },
    'linkDefaults' : {
      'startConnectorType': 'none',
      'endConnectorType': 'none',
      'width' : 1,
      'style' : 'solid',
      'hoverInnerColor': 'rgb(255,255,255)',
      'hoverOuterColor': 'rgba(0,0,0, .3)',
      'selectionColor': 'rgb(0,0,0)',
      'labelStyle': 'font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;font-weight:bold;font-size:12px;color:#383A47',
      '_hitDetectionOffset' : 4
    }
  }
};

/**
 * Contains overrides for the 'alta' skin.
 */
DvtDiagramDefaults.SKIN_ALTA = {
};
/**
 * Animation handler for Diagram
 * @param {DvtContext} context the platform specific context object
 * @param {DvtContainer} deleteContainer the container where deletes should be moved for animation
 * @param {object} oldDiagram an object representing the old diagram state
 * @param {DvtDiagram} newDiagram the diagram component
 * @class DvtDiagramDataAnimationHandler
 * @constructor
 */
var DvtDiagramDataAnimationHandler = function(context, deleteContainer, oldDiagram, newDiagram) {
  this.Init(context, deleteContainer, oldDiagram, newDiagram);
};

DvtObj.createSubclass(DvtDiagramDataAnimationHandler, DvtDataAnimationHandler, 'DvtDiagramDataAnimationHandler');
/**
 * Delete phase
 * @const
 */
DvtDiagramDataAnimationHandler.DELETE = 0;
/**
 * Update phase
 * @const
 */
DvtDiagramDataAnimationHandler.UPDATE = 1;
/**
 * Insert phase
 * @const
 */
DvtDiagramDataAnimationHandler.INSERT = 2;

/**
 * Initialization method called by the constructor
 * @param {DvtContext} context the platform specific context object
 * @param {DvtContainer} deleteContainer the container where deletes should be moved for animation
 * @param {object} oldDiagram an object representing the old diagram state
 * @param {DvtDiagram} newDiagram the diagram component
 */
DvtDiagramDataAnimationHandler.prototype.Init = function(context, deleteContainer, oldDiagram, newDiagram) {
  DvtDiagramDataAnimationHandler.superclass.Init.call(this, context, deleteContainer);
  this._oldDiagram = oldDiagram;
  this._newDiagram = newDiagram;
};

/**
 * Returns the old diagram state
 * @return {object} an object representing the old diagram state
 */
DvtDiagramDataAnimationHandler.prototype.getOldDiagram = function() {
  return this._oldDiagram;
};


/**
 * Returns the new diagram state
 * @return {DvtDiagram} the diagram component
 */
DvtDiagramDataAnimationHandler.prototype.getNewDiagram = function() {
  return this._newDiagram;
};

/**
 * Gets the animation duration
 * @return {number} the animation duration
 */
DvtDiagramDataAnimationHandler.prototype.getAnimationDuration = function() {
  return DvtStyleUtils.getTimeMilliseconds(this._oldDiagram.getOptions()['styleDefaults']['animationDuration']) / 1000;
};


// Copyright (c) 2014, 2015, Oracle and/or its affiliates. All rights reserved.
/**
 * Event Manager for DvtDiagram.
 * @param {DvtContext} context The platform specific context object
 * @param {function} callback A function that responds to component events
 * @param {DvtDiagram} callbackObj diagram component instance that the callback function is defined on
 * @class
 * @extends {DvtEventManager}
 * @constructor
 */
var DvtDiagramEventManager = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
  this._diagram = callbackObj;
};

DvtObj.createSubclass(DvtDiagramEventManager, DvtEventManager, 'DvtDiagramEventManager');

/**
 * @override
 */
DvtDiagramEventManager.prototype.ProcessRolloverEvent = function(event, obj, bOver) {
  // Don't continue if not enabled
  var options = this._diagram.getOptions();
  if (options['hoverBehavior'] != 'dim')
    return;

  // Compute the new highlighted categories and update the options
  var categories = obj.getCategories ? obj.getCategories() : [];
  options['highlightedCategories'] = bOver ? categories.slice() : null;

  var type = bOver ? DvtCategoryRolloverEvent.TYPE_OVER : DvtCategoryRolloverEvent.TYPE_OUT;
  var rolloverEvent = new DvtCategoryRolloverEvent(type, options['highlightedCategories']);
  var hoverBehaviorDelay = DvtStyleUtils.getTimeMilliseconds(options['styleDefaults']['hoverBehaviorDelay']);
  this.RolloverHandler.processEvent(rolloverEvent, this._diagram.GetAllNodeObjects(), hoverBehaviorDelay, options['highlightMatch'] == 'any');
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.CreateCategoryRolloverHandler = function(callback, callbackObj) {
  return new DvtDiagramCategoryRolloverHandler(callback, callbackObj);
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.ProcessKeyboardEvent = function(event)
{
  var eventConsumed = true;
  var keyCode = event.keyCode;
  var focusObj = this.getFocus();
  var focusDisp = focusObj instanceof DvtDiagramNode ? focusObj._customNodeContent : null;

  // Mashup
  if (keyCode != DvtKeyboardEvent.TAB && this._bPassOnEvent) {
    focusDisp.fireKeyboardListener(event);
    event.preventDefault();
  }// Mashups
  else if (keyCode == DvtKeyboardEvent.TAB && focusDisp instanceof DvtBaseComponent) {
    // If displayable is already focused, then tab enters stamp and all future events pass to stamp until shift+tab
    // or tab out
    if (!event.shiftKey && focusObj.isShowingKeyboardFocusEffect()) {
      focusObj.hideKeyboardFocusEffect();
      focusDisp.fireKeyboardListener(event);
      event.preventDefault();
      this._bPassOnEvent = true;
    }
    // If stamp is focused, shift+tab will move focus back to diagram
    else if (event.shiftKey && this._bPassOnEvent) {
      this.ShowFocusEffect(event, focusObj);
      event.preventDefault();
      this._bPassOnEvent = false;
    }
    // All other tab cases should be handled by superclass and will move focus out of component
    else {
      if (this._bPassOnEvent)
        focusObj.showKeyboardFocusEffect(); // checked by superclass to tab out of component
      eventConsumed = DvtDiagramEventManager.superclass.ProcessKeyboardEvent.call(this, event);
      this._bPassOnEvent = false;
    }
  } else {
    eventConsumed = DvtDiagramEventManager.superclass.ProcessKeyboardEvent.call(this, event);
  }
  return eventConsumed;
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.GetTouchResponse = function() {
  var options = this._diagram.getOptions();
  if (options['panning'] !== 'none' || options['zooming'] !== 'none')
    return DvtEventManager.TOUCH_RESPONSE_TOUCH_HOLD;
  else if (options['touchResponse'] === DvtEventManager.TOUCH_RESPONSE_TOUCH_START)
    return DvtEventManager.TOUCH_RESPONSE_TOUCH_START;
  return DvtEventManager.TOUCH_RESPONSE_AUTO;
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.HandleTouchClickInternal = function(event) {
  return this.GetEventInfo(event, DvtPanZoomCanvasEventManager.EVENT_INFO_PANNED_KEY);
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.StoreInfoByEventType = function(key) {
  if (key == DvtPanZoomCanvasEventManager.EVENT_INFO_PANNED_KEY) {
    return false;
  }
  return DvtDiagramEventManager.superclass.StoreInfoByEventType.call(this, key);
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.

/**
 *  @constructor
 *  @class DvtDiagramKeyboardHandler base class for keyboard handler for diagram component
 *  @param {DvtDiagram} component The owning diagram component
 *  @param {DvtEventManager} manager The owning DvtEventManager
 *  @extends {DvtBaseDiagramKeyboardHandler}
 */
var DvtDiagramKeyboardHandler = function(component, manager)
{
  this.Init(component, manager);
};

DvtObj.createSubclass(DvtDiagramKeyboardHandler, DvtBaseDiagramKeyboardHandler, 'DvtDiagramKeyboardHandler');

/**
 * @override
 */
DvtDiagramKeyboardHandler.prototype.isNavigationEvent = function(event)
{
  var retVal = false;
  switch (event.keyCode) {
    case DvtKeyboardEvent.OPEN_ANGLED_BRACKET:
    case DvtKeyboardEvent.CLOSE_ANGLED_BRACKET:
      retVal = event.altKey ? true : false;
      break;
    default:
      retVal = DvtDiagramKeyboardHandler.superclass.isNavigationEvent.call(this, event);
  }
  return retVal;
};

/**
 * @override
 */
DvtDiagramKeyboardHandler.prototype.processKeyDown = function(event) {
  var keyCode = event.keyCode;
  if (keyCode == DvtKeyboardEvent.TAB) {
    var currentNavigable = this._eventManager.getFocus();
    if (currentNavigable) {
      DvtEventManager.consumeEvent(event);
      return currentNavigable;
    }
    else {
      // navigate to the default
      var arNodes = this.GetDiagram().GetAllNodeObjects();
      if (arNodes.length > 0) {
        DvtEventManager.consumeEvent(event);
        return this.getDefaultNavigable(arNodes);
      }
    }
  }
  return DvtDiagramKeyboardHandler.superclass.processKeyDown.call(this, event);
};

/**
 * @override
 */
DvtDiagramKeyboardHandler.prototype.GetVisibleNode = function(nodeId) {
  return this.GetDiagram().getNodeById(nodeId);
};
// Copyright (c) 2011, 2014, Oracle and/or its affiliates. All rights reserved.
var DvtDiagramLayoutUtils = {};

DvtObj.createSubclass(DvtDiagramLayoutUtils, DvtObj, 'DvtDiagramLayoutUtils');

DvtDiagramLayoutUtils.gridLayout = function(layoutContext) {
  var maxNodeBounds = DvtDiagramLayoutUtils.getMaxNodeBounds(layoutContext);
  var nodeSize = Math.max(maxNodeBounds['w'], maxNodeBounds['h']);
  var nodeCount = layoutContext.getNodeCount();
  var linkCount = layoutContext.getLinkCount();
  var size = Math.floor(Math.sqrt(nodeCount));

  //var space = linkCount > 0 ? 2*nodeSize : 1.25*nodeSize;
  var padding = 0;
  var layoutAttrs = layoutContext.getLayoutAttributes();
  if (layoutAttrs && layoutAttrs['padding']) {
    padding = layoutAttrs['padding'];
  }
  else {
    padding = linkCount > 0 ? nodeSize : .25 * nodeSize;
  }
  var space = nodeSize + padding;

  var cols = Math.ceil(nodeCount / size);
  var rows = size;
  var startx = - (cols - 1) * space / 2;
  var starty = - (rows - 1) * space / 2;
  for (var ni = 0; ni < nodeCount; ni++) {
    var node = layoutContext.getNodeByIndex(ni);
    var col = Math.floor(ni / size);
    var row = ni % size;
    var currX = startx + space * col;
    var currY = starty + space * row;
    DvtDiagramLayoutUtils.centerNodeAndLabel(node, currX, currY);
  }
};

DvtDiagramLayoutUtils.getMaxNodeBounds = function(layoutContext) {
  var nodeCount = layoutContext.getNodeCount();
  var maxW = 0;
  var maxH = 0;
  for (var ni = 0; ni < nodeCount; ni++) {
    var node = layoutContext.getNodeByIndex(ni);
    var bounds = node.getBounds();
    maxW = Math.max(bounds['w'], maxW);
    maxH = Math.max(bounds['h'], maxH);
    var labelBounds = node.getLabelBounds();
    if (labelBounds) {
      maxW = Math.max(labelBounds['w'], maxW);
      maxH = Math.max(bounds['h'] + labelBounds['h'], maxH);
    }
  }
  return new DvtDiagramRectangle(0, 0, maxW, maxH);
};

DvtDiagramLayoutUtils.centerNodeAndLabel = function(node, x, y) {
  var bounds = node.getContentBounds();
  node.setPosition(new DvtDiagramPoint(x - bounds['x'] - bounds['w'] * .5, y - bounds['y'] - bounds['h'] * .5));
  DvtDiagramLayoutUtils.positionNodeLabel(node);
};

DvtDiagramLayoutUtils.positionNodeLabel = function(node) {
  var nodeBounds = node.getBounds();
  var nodePos = node.getPosition();
  var nodeLabelBounds = node.getLabelBounds();
  if (nodeLabelBounds) {
    //center label below node
    var labelX = nodeBounds['x'] + nodePos['x'] + .5 * (nodeBounds['w'] - nodeLabelBounds['w']);
    var labelY = nodeBounds['y'] + nodePos['y'] + nodeBounds['h'];
    node.setLabelPosition(new DvtDiagramPoint(labelX, labelY));
  }
};

DvtDiagramLayoutUtils.convertRectToDiagramRect = function(rect) {
  if (rect === undefined || rect == null)
    return null;
  else
    return new DvtDiagramRectangle(rect.x, rect.y, rect.w, rect.h);
};

DvtDiagramLayoutUtils.convertPointToDiagramPoint = function(point) {
  if (point === undefined || point == null)
    return null;
  else
    return new DvtDiagramPoint(point.x, point.y);
};

DvtDiagramLayoutUtils.convertDiagramRectToRect = function(diagramRect) {
  if (!diagramRect) {
    return null;
  }
  else {
    return new DvtRectangle(diagramRect['x'], diagramRect['y'], diagramRect['w'], diagramRect['h']);
  }
};

DvtDiagramLayoutUtils.convertDiagramPointToPoint = function(diagramPoint) {
  if (!diagramPoint) {
    return null;
  }
  else {
    return new DvtPoint(diagramPoint['x'], diagramPoint['y']);
  }
};
/**
 * @constructor
 * @param {DvtContext} context the rendering context
 * @param {DvtDiagram} diagram the parent diagram component
 * @param {object} linkData link data
 */
var DvtDiagramLink = function(context, diagram, linkData) {
  this.Init(context, diagram, linkData);
};

DvtObj.createSubclass(DvtDiagramLink, DvtBaseDiagramLink, 'DvtDiagramLink');

/**
 * Returns a new instance of DvtDiagramLink
 * @param {DvtDiagram} diagram the parent diagram
 * @param {object} data the data for this node
 * @return {DvtDiagramLink} the diagram node
 */
DvtDiagramLink.newInstance = function(diagram, data) {
  return new DvtDiagramLink(diagram.getCtx(), diagram, data);
};

/**
 * Initializes this component
 * @param {DvtContext} context the rendering context
 * @param {DvtDiagram} diagram the parent diagram
 * @param {object} data the data for this node
 * @protected
 */
DvtDiagramLink.prototype.Init = function(context, diagram, data) {
  DvtDiagramLink.superclass.Init.call(this, context, data['id'], diagram);
  this._data = data;
  if (this._diagram.isSelectionSupported()) {
    this.setCursor(DvtSelectionEffectUtils.getSelectingCursor());
  }
};

/**
 * Gets the data object
 *
 * @return {object} the data object
 */
DvtDiagramLink.prototype.getData = function() {
  return this._data;
};

/**
 * Gets the link id
 * @return {string} link id
 */
DvtDiagramLink.prototype.getId = function() {
  return this.getData()['id'];
};

/**
 * Gets the node id
 * @return {string} node id
 */
DvtDiagramLink.prototype.getStartId = function() {
  return this.getData()['startNode'];
};

/**
 * Gets the node id
 * @return {string} node id
 */
DvtDiagramLink.prototype.getEndId = function() {
  return this.getData()['endNode'];
};

/**
 * @override
 */
DvtDiagramLink.prototype.getLabelBounds = function() {
  var bounds = null;
  if (this._labelObj) {
    bounds = this._labelObj.getDimensions();
  }
  return bounds;
};

/**
 * @override
 */
DvtDiagramLink.prototype.getLinkStyle = function() {
  return this.getData()['style'];
};

/**
 * @override
 */
DvtDiagramLink.prototype.getLinkWidth = function() {
  return this.getData()['width'];
};

/**
 * @override
 */
DvtDiagramLink.prototype.getLinkColor = function() {
  return this.getData()['color'];
};

/**
 * @override
 */
DvtDiagramLink.prototype.getStartConnectorType = function() {
  return this.getData()['startConnectorType'];
};

/**
 * @override
 */
DvtDiagramLink.prototype.getEndConnectorType = function() {
  return this.getData()['endConnectorType'];
};

/**
 * @override
 */
DvtDiagramLink.prototype.getStartConnectorOffset = function() {
  if (this.getStartConnectorType()) {
    var stroke = this.getShape().getStroke().clone();
    stroke.setType(DvtStroke.SOLID);
    return DvtDiagramLinkConnectorUtils.GetConnectorOffset(null, this.getStartConnectorType(), null, stroke, this);
  }
  return 0;
};

/**
 * @override
 */
DvtDiagramLink.prototype.getEndConnectorOffset = function() {
  if (this.getEndConnectorType()) {
    var stroke = this.getShape().getStroke().clone();
    stroke.setType(DvtStroke.SOLID);
    return DvtDiagramLinkConnectorUtils.GetConnectorOffset(null, this.getEndConnectorType(), null, stroke, this);
  }
  return 0;
};


/**
 * Renders diagram link
 * @param {DvtContainer} container parent container
 */
DvtDiagramLink.prototype.render = function(container) {
  DvtDiagramLink._renderLinkShape(this._diagram, this.getData(), this);
  DvtDiagramLink._renderLinkLabels(this._diagram, this.getData(), this);
  container.addChild(this);
  this.setAriaRole('img');
  this.UpdateAriaLabel();
  this._diagram.getEventManager().associate(this, this);
};

/**
 * Renders link shape
 * @param {DvtDiagram} diagram parent component
 * @param {object} linkData
 * @param {DvtContainer} container parent container
 * @private
 */
DvtDiagramLink._renderLinkShape = function(diagram, linkData, container) {
  var points = container._pathCmds;
  if (!points) {
    points = ['M', 0, 0, 'L', 0, 0];
  }
  var id = linkData['id'];
  var linkColor = linkData['color'];
  var linkWidth = linkData['width'];
  var linkStyle = linkData['style'];
  var hitDetectionOffset = linkData['_hitDetectionOffset'];

  //create a transparent underlay wider than the link
  //in order to make it easier to interact with the link
  container._hitDetectionUnderlay = container.CreateUnderlay('#000000', 0, hitDetectionOffset);
  container.addChild(container._hitDetectionUnderlay);

  var stroke = new DvtSolidStroke(linkColor, 1, linkWidth);
  if (DvtAgent.isTouchDevice() && DvtAgent.isBrowserSafari() && DvtAgent.getDevicePixelRatio() == 1)
    stroke.setFixedWidth(true);
  var strokeType = DvtDiagramLinkUtils.ConvertLinkStyleToStrokeType(linkStyle);
  stroke.setType(strokeType, DvtDiagramLinkUtils.GetStrokeDash(strokeType), DvtDiagramLinkUtils.GetStrokeDashOffset(strokeType));

  var shape = new DvtPath(container.getCtx(), points, id);
  shape.setFill(null);
  shape.setStroke(stroke);
  container.setShape(shape);
  container.addChild(shape);
};

/**
 * Renders link labels
 * @param {DvtDiagram} diagram parent component
 * @param {object} linkData
 * @param {DvtContainer} container parent container
 * @private
 */
DvtDiagramLink._renderLinkLabels = function(diagram, linkData, container) {
  var rtl = DvtAgent.isRightToLeft(diagram.getCtx());
  var halign = rtl ? DvtOutputText.H_ALIGN_RIGHT : DvtOutputText.H_ALIGN_LEFT;
  if (linkData['label']) {
    var label = DvtDiagramLink.createText(diagram.getCtx(), linkData['label'], linkData['labelStyle'], halign, DvtOutputText.V_ALIGN_TOP);
    //check for label width
    var labelWidth = DvtCSSStyle.toNumber((new DvtCSSStyle(linkData['labelStyle'])).getWidth());
    if (labelWidth > 0 && DvtTextUtils.fitText(label, labelWidth, Infinity, container)) {
      container._labelObj = label;
    }
    else {
      container.addChild(label);
      container._labelObj = label;
    }
  }
  /*
  if (linkData['secondaryLabel']) {
    var secondaryLabel = DvtDiagramNode.createText(diagram.getCtx(), linkData['secondaryLabel'], linkData['secondaryLabelStyle'], halign, DvtOutputText.V_ALIGN_TOP);
    container.addChild(secondaryLabel);
    container._secondaryLabelObj = secondaryLabel;
  }
  */
};

/**
 * Creates a text element
 * @param {DvtContext} ctx the rendering context
 * @param {string} strText the text string
 * @param {string} style the CSS style string to apply to the text
 * @param {string} halign the horizontal alignment
 * @param {string} valign the vertical alignment
 * @return {DvtOutputText} the text element
 */
DvtDiagramLink.createText = function(ctx, strText, style, halign, valign) {
  var text = new DvtOutputText(ctx, strText, 0, 0);
  text.setCSSStyle(new DvtCSSStyle(style));
  text.setHorizAlignment(halign);
  text.setVertAlignment(valign);
  return text;
};

/**
 * @override
 */
DvtDiagramLink.prototype.setSelected = function(selected) {
  DvtDiagramLink.superclass.setSelected.call(this, selected);
  if (selected) {
    this._showFeedback(this._isShowingHoverEffect, true);
  }
  else {
    this._hideFeedback();
  }
  this.UpdateAriaLabel();
};

/**
 * @override
 */
DvtDiagramLink.prototype.isSelectable = function() {
  return this.GetDiagram().isSelectionSupported() && this.getData()['selectable'] != 'off';
};

/**
 * Shows hover selection feedback
 * @param {boolean} bHovered true for hovered state
 * @param {boolean} bSelected true for selected state
 * @private
 */
DvtDiagramLink.prototype._showFeedback = function(bHovered, bSelected) {

  if (bHovered) {
    if (!this._savedStroke) {
      this._savedStroke = this.getShape().getStroke();
    }
    var hoverStroke = this.getShape().getStroke().clone();
    if (hoverStroke.setColor) {
      hoverStroke.setColor(this.getData()['hoverInnerColor']);
    }
    this.getShape().setStroke(hoverStroke);
    this.ReplaceConnectorColor(this.getStartConnector(), hoverStroke);
    this.ReplaceConnectorColor(this.getEndConnector(), hoverStroke);
  }
  else if (this._savedStroke) {
    this.getShape().setStroke(this._savedStroke);
    this.ReplaceConnectorColor(this.getStartConnector(), this._savedStroke);
    this.ReplaceConnectorColor(this.getEndConnector(), this._savedStroke);
    this._savedStroke = null;
  }

  if (!this._linkUnderlay) {
    this._linkUnderlay = this.CreateFeedbackUnderlay('#000000', 1, 0);
    this.addChildAt(this._linkUnderlay, 0);
  }
  var color = bSelected ? this.getData()['selectionColor'] : this.getData()['hoverOuterColor'];
  var strokeOffset = 2;
  var stroke = this._linkUnderlay.getStroke().clone();
  stroke.setColor(color);
  stroke.setWidth(strokeOffset + this.GetAppliedLinkWidth());
  this.ApplyLinkStyle(stroke, true);
  this._linkUnderlay.setStroke(stroke, strokeOffset);
};

/**
 * Removes hover selection feedback
 * @private
 */
DvtDiagramLink.prototype._hideFeedback = function() {

  if (this._savedStroke) {
    this.getShape().setStroke(this._savedStroke);
    this.ReplaceConnectorColor(this.getStartConnector(), this._savedStroke);
    this.ReplaceConnectorColor(this.getEndConnector(), this._savedStroke);
    this._savedStroke = null;
  }

  if (this._linkUnderlay) {
    this.removeChild(this._linkUnderlay);
    if (this._linkUnderlay.destroy) {
      this._linkUnderlay.destroy();
    }
    this._linkUnderlay = null;
  }
};

/**
 * @override
 */
DvtDiagramLink.prototype.showHoverEffect = function() {
  if (!this._isShowingHoverEffect) {
    this._isShowingHoverEffect = true;
    this._showFeedback(true, this.isSelected());
  }
};


/**
 * @override
 */
DvtDiagramLink.prototype.hideHoverEffect = function() {
  if (this.isSelected()) {
    this._showFeedback(false, true);
  }
  else {
    this._hideFeedback();
  }
  this._isShowingHoverEffect = false;
};

/**
 * @override
 */
DvtDiagramLink.prototype.getDatatip = function(target, x, y) {
  // Custom Tooltip from Function
  var tooltipFunc = this.GetDiagram().getOptions()['tooltip'];
  if (tooltipFunc)
    return this.GetDiagram().getCtx().getTooltipManager().getCustomTooltip(tooltipFunc, this.getDataContext());

  // Custom Tooltip from ShortDesc
  return this.getShortDesc();
};

/**
 * Returns short description for the link
 * @return {string}  short description for the link
 */
DvtDiagramLink.prototype.getShortDesc = function() {
  return this.getData()['shortDesc'];
};

/**
 * Returns the data context that will be passed to the tooltip function.
 * @return {object}
 */
DvtDiagramLink.prototype.getDataContext = function() {
  return {
    'id': this.getId(),
    'type': 'link',
    'label': this.getData()['label']
  };
};

/**
 * @override
 */
DvtDiagramLink.prototype.getAriaLabel = function() {
  var states = [];
  if (this.isSelectable()) {
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  }
  return DvtDisplayable.generateAriaLabel(this.getShortDesc(), states);
};

/**
 * @protected
 * Updates accessibility attributes on selection event
 */
DvtDiagramLink.prototype.UpdateAriaLabel = function() {
  if (!DvtAgent.deferAriaCreation()) {
    var desc = this.getAriaLabel();
    if (desc)
      this.setAriaProperty('label', desc);
  }
};

/**
 * @override
 */
DvtDiagramLink.prototype.getNextNavigable = function(event) 
{
  if (event.keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey) {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    return this;
  }
  else if (event.keyCode == DvtKeyboardEvent.UP_ARROW || event.keyCode == DvtKeyboardEvent.DOWN_ARROW) {
    //if the link got focus via keyboard, get the node where the focus came from
    //we'll navigate around that node
    //if the focus was set through mouse click, set start node as a center of navigation
    var node = this.getKeyboardFocusNode();
    if (!node)
      node = this.GetDiagram().getNodeById(this.GetDiagram().getLinkStartId(this));

    //find next link - if up counter-clockwise, down - clockwise
    var nextLink = this;
    var links = this.GetDiagram().getNavigableLinksForNodeId(node.getId());
    var keyboardHandler = this.GetDiagram().getEventManager().getKeyboardHandler();
    if (keyboardHandler && keyboardHandler.getNextNavigableLink)
      nextLink = keyboardHandler.getNextNavigableLink(node, this, event, links);

    nextLink.setKeyboardFocusNode(node);
    return nextLink;
  }
  else if (event.keyCode == DvtKeyboardEvent.RIGHT_ARROW || event.keyCode == DvtKeyboardEvent.LEFT_ARROW)
  {
    var nodeId;
    if (this._movingToStart(event.keyCode))
      nodeId = this.getStartId();
    else
      nodeId = this.getEndId();
    return this.GetDiagram().getNodeById(nodeId);
  }
  else if (event.type == DvtMouseEvent.CLICK) {
    return this;
  }
  return null;
};

/**
 * Helper function used for keyboard navigation. Checks direction where the focus should move - the start node or the end node
 * @param {number} direction vtKeyboardEvent.RIGHT_ARROW or DvtKeyboardEvent.LEFT_ARROW
 * @return {boolean} true to move focus to the start node
 * @private
 */
DvtDiagramLink.prototype._movingToStart = function(direction) {
  var start = this.getLinkStart();
  var end = this.getLinkEnd();
  var linkDirectionL2R = (start.x < end.x) ? true : false;

  if ((direction == DvtKeyboardEvent.RIGHT_ARROW && linkDirectionL2R) ||
      (direction == DvtKeyboardEvent.LEFT_ARROW && !linkDirectionL2R))
    return false;
  else
    return true;
};

/**
 * @override
 */
DvtDiagramLink.prototype.showKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = true;
  this.showHoverEffect();
};

/**
 * @override
 */
DvtDiagramLink.prototype.hideKeyboardFocusEffect = function() {
  this._isShowingKeyboardFocusEffect = false;
  this.hideHoverEffect();
};

/**
 * @override
 */
DvtDiagramLink.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};

/**
 * @override
 */
DvtDiagramLink.prototype.getCategories = function() {
  return this.getData()['categories'] ? this.getData()['categories'] : [this.getId()];
};

/**
 * Checks whether the object is hidden
 * @return {boolean} true if the object is hidden
 */
DvtDiagramLink.prototype.isHidden = function() {
  var hiddenCategories = this.GetDiagram().getOptions()['hiddenCategories'];
  if (hiddenCategories && DvtArrayUtils.hasAnyItem(hiddenCategories, this.getCategories())) {
    return true;
  }
  if (! (this.GetDiagram().getNodeById(this.getStartId()) && this.GetDiagram().getNodeById(this.getEndId()))) {
    return true;
  }
  return false;
};

/**
 * @override
 */
DvtDiagramLink.prototype.animateUpdate = function(animationHandler, oldLink) {
  var oldPoints = oldLink.getPoints();
  var newPoints = this.getPoints();
  var playable = new DvtCustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());

  if (!DvtArrayUtils.equals(oldPoints, newPoints)) {
    this.setPoints(oldPoints);
    var linkAnimType = DvtAnimator.TYPE_POLYLINE;
    if (newPoints.length > 0 && isNaN(newPoints[0])) {
      linkAnimType = DvtAnimator.TYPE_PATH;
    }
    playable.getAnimator().addProp(linkAnimType, this, this.getPoints, this.setPoints, newPoints);
  }

  if (oldLink._labelObj && this._labelObj) {
    var oldMat = oldLink._labelObj.getMatrix();
    var newMat = this._labelObj.getMatrix();
    if (!oldMat.equals(newMat)) {
      this._labelObj.setMatrix(oldMat);
      playable.getAnimator().addProp(DvtAnimator.TYPE_MATRIX, this._labelObj, this._labelObj.getMatrix, this._labelObj.setMatrix, newMat);
    }
  }

  if (oldLink.getShape() && this.getShape()) {
    var oldStroke = oldLink.getShape().getStroke();
    var newStroke = this.getShape().getStroke();
    if (oldStroke && newStroke &&
        oldStroke instanceof DvtSolidStroke &&
        newStroke instanceof DvtSolidStroke &&
        (oldStroke.getColor() != newStroke.getColor() ||
         oldStroke.getWidth() != newStroke.getWidth())) {
      this.getShape().setStroke(oldStroke);
      playable.getAnimator().addProp(DvtAnimator.TYPE_STROKE, this.getShape(), this.getShape().getStroke, this.getShape().setStroke, newStroke);
    }
  }

  animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);
};

/**
 * @override
 */
DvtDiagramLink.prototype.animateDelete = function(animationHandler, deleteContainer) {
  this.GetDiagram().getLinksPane().addChild(this);
  var thisRef = this;
  var removeFunc = function() {
    thisRef.getParent().removeChild(thisRef);
    thisRef.destroy();
  };
  var playable = new DvtAnimFadeOut(this.getCtx(), this, animationHandler.getAnimationDuration());
  DvtPlayable.appendOnEnd(playable, removeFunc);
  animationHandler.add(playable, DvtDiagramDataAnimationHandler.DELETE);
};

/**
 * @override
 */
DvtDiagramLink.prototype.animateInsert = function(animationHandler) {
  this.setAlpha(0);
  animationHandler.add(new DvtAnimFadeIn(this.getCtx(), this, animationHandler.getAnimationDuration()), DvtDiagramDataAnimationHandler.INSERT);
};

/**
 * @override
 */
DvtDiagramLink.prototype.getLayoutAttributes = function(layout) {
  return this.getData();
};
var DvtDiagramLinkConnectorUtils = {};

DvtObj.createSubclass(DvtDiagramLinkConnectorUtils, DvtObj, 'DvtDiagramLinkConnectorUtils');

/**
 * Link end connector
 * @const
 */
DvtDiagramLinkConnectorUtils.END_CONNECTOR = 'endConnector';
/**
 * Link start connector
 * @const
 */
DvtDiagramLinkConnectorUtils.START_CONNECTOR = 'startConnector';
/**
 * Arrowhead that looks like an angle bracket
 * @const
 */
DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_OPEN = 'arrowOpen';
/**
 * Filled triangle arrowhead
 * @const
 */
DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW = 'arrow';
/**
 * Filled triangle arrowhead with base flare
 * @const
 */
DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE = 'arrowConcave';
/**
 * Rectangle
 * @const
 */
DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE = 'rectangle';
/**
 * Rounded rectangle
 * @const
 */
DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE_ROUNDED = 'rectangleRounded';
/**
 * Circle
 * @const
 */
DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_CIRCLE = 'circle';

/**
 * Creates the shape for a link connector
 * @param {DvtContext} context the rendering context
 * @param {string} connectorType the connector type if using a built-in connector, defined in DvtDiagramLinkDef
 * @param {DvtAfMarker} connectorTemplate the custom connector shape
 * @param {DvtStroke} stroke the stroke to apply to the built-in connector, if applicable
 * @param {DvtDiagramLink} parentLink the associated parent link
 * @return {DvtShape} the connector shape
 * @protected
 */
DvtDiagramLinkConnectorUtils.CreateConnectorShape = function(context, connectorType, connectorTemplate, stroke, parentLink) {
  if (connectorTemplate) {
    return DvtDiagramLinkConnectorUtils.CreateCustomConnector(context, connectorTemplate, parentLink);
  }

  var linkWidth = parentLink.GetAppliedLinkWidth();

  switch (connectorType) {
    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW:
      return DvtDiagramLinkConnectorUtils.CreateFilledArrowConnector(context, linkWidth, parentLink.getLinkColor());

    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE:
      return DvtDiagramLinkConnectorUtils.CreateFilledConcaveArrowConnector(context, linkWidth, parentLink.getLinkColor());

    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_OPEN:
      return DvtDiagramLinkConnectorUtils.CreateOpenArrowConnector(context, linkWidth, stroke);

    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_CIRCLE:
      return DvtDiagramLinkConnectorUtils.CreateCircleConnector(context, linkWidth, stroke);

    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE:
      return DvtDiagramLinkConnectorUtils.CreateRectangleConnector(context, linkWidth, stroke);

    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE_ROUNDED:
      return DvtDiagramLinkConnectorUtils.CreateRoundedRectangleConnector(context, linkWidth, stroke);
  }
  return null;
};


/**
 * @protected
 */
DvtDiagramLinkConnectorUtils.TransformConnector = function(connector, connectorType, connectorTemplate, points, connectorPos)
{
  var mat = DvtDiagramLinkConnectorUtils.CalcConnectorTransform(connector, connectorType, connectorTemplate, points, connectorPos);
  connector.setMatrix(mat);
};


/**
 * @protected
 */
DvtDiagramLinkConnectorUtils.CalcConnectorTransform = function(connector, connectorType, connectorTemplate, points, connectorPos)
{

  var x1 = -1;
  var y1 = 0;
  var x2 = 0;
  var y2 = 0;

  if (!points) {}
  else {

	var numPoints = points.length;
	if (connectorPos === 1)
	{
	    //make sure the array is long enough
	    if (numPoints >= 2)
	    {
		x2 = points[numPoints - 2];
		y2 = points[numPoints - 1];
	    }
	    if (numPoints >= 4)
	    {
		x1 = points[numPoints - 4];
		y1 = points[numPoints - 3];
	    }
	    else
	    {
		x1 = x2 - .0001;
		y1 = y2;
	    }
	}
	else //if (connectorPos === 0)
	{
	    //make sure the array is long enough
	    if (numPoints >= 2)
	    {
		x2 = points[0];
		y2 = points[1];
	    }
	    if (numPoints >= 4)
	    {
		x1 = points[2];
		y1 = points[3];
	    }
	    else
	    {
		x1 = x2 + .0001;
		y1 = y2;
	    }
	}
  }

  var tx = x2;
  var ty = y2;
  var angleRads = DvtDiagramLinkConnectorUtils.CalcConnectorRotation(x1, y1, x2, y2);

  var origMat = connector._connectorOrigMat;
  if (!origMat)
  {
	origMat = connector.getMatrix().clone();
	connector._connectorOrigMat = origMat;
  }

  var tMat = new DvtMatrix();

  // 1) translate custom connector so that origin is at center, where link will
  //   connect
  // 2) rotate connector about center
  // 3) translate rotated connect to start/end of link
  //

  if (connectorTemplate) {
    var dims = DvtDiagramLinkConnectorUtils._getCachedDims(connector);
    var connScaleX = connector.getScaleX();
    var connScaleY = connector.getScaleY();
    var offsetX = -.5 * (dims.w * connScaleX);
    var offsetY = -.5 * (dims.h * connScaleY);
    tMat.translate(offsetX, offsetY);
  }

  tMat.rotate(angleRads);
  tMat.translate(tx, ty);
  tMat.concat(origMat);
  return tMat;
};

DvtDiagramLinkConnectorUtils._getCachedDims = function(connector) {
  var dims = connector._cachedDims;
  if (!dims) {
    dims = connector.getDimensions();
    connector._cachedDims = dims;
  }
  return dims;
};


/**
 * @protected
 */
DvtDiagramLinkConnectorUtils.CalcConnectorRotation = function(x1, y1, x2, y2)
{
  var diffY = y2 - y1;
  var diffX = x2 - x1;
  var angleRads = Math.atan2(diffY, diffX);
  return angleRads;
};


/**
 * Creates the connector shape for type DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE
 *
 * @param {DvtContext} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {string} linkColor the color of the associated link
 *
 * @protected
 */
DvtDiagramLinkConnectorUtils.CreateFilledConcaveArrowConnector = function(context, linkWidth, linkColor) {
  var scaleFactor = DvtDiagramLinkConnectorUtils._getReduce(linkWidth, .5);
  var arrowLength = scaleFactor * 6;
  var arrowWidth = arrowLength * .8;

  var points = [-.22 * arrowLength, -.5 * arrowWidth,
                .78 * arrowLength, 0,
                -.22 * arrowLength, .5 * arrowWidth,
                0, 0];

  var filledArrowHead = new DvtPolygon(context, points);
  filledArrowHead.setSolidFill(linkColor);
  return filledArrowHead;
};


/**
 * Creates the connector shape for type DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW
 *
 * @param {DvtContext} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {string} linkColor the color of the associated link
 *
 * @protected
 */
DvtDiagramLinkConnectorUtils.CreateFilledArrowConnector = function(context, linkWidth, linkColor) {
  var scaleFactor = DvtDiagramLinkConnectorUtils._getReduce(linkWidth, .5);
  var arrowLength = scaleFactor * 5;
  var arrowWidth = arrowLength * .8;

  var points = [0, -.5 * arrowWidth,
                arrowLength, 0,
                0, .5 * arrowWidth];

  var filledArrowHead = new DvtPolygon(context, points);
  filledArrowHead.setSolidFill(linkColor);
  return filledArrowHead;
};


//
// Function to size the arrow head non-linearly
//
/**
 * @protected
 */
DvtDiagramLinkConnectorUtils._getReduce = function(length, fract) {

  if (length <= 1) return length;

  var tempLength = length - 1;

  tempLength *= fract;

  return (1 + tempLength);

};

//
// Flat back, filled.
//
/**
 * @protected
 */


/**
 * Creates the connector shape for type DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_OPEN
 *
 * @param {DvtContext} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {DvtStroke} stroke the stroke to apply to the shape
 *
 * @protected
 */
DvtDiagramLinkConnectorUtils.CreateOpenArrowConnector = function(context, linkWidth, stroke) {
  var arrowWidth = linkWidth * 3;
  var strokeWidth = stroke.getWidth();

  var points = [-arrowWidth + strokeWidth * Math.sqrt(2) / 2, -arrowWidth,
                strokeWidth * Math.sqrt(2) / 2, 0,
                -arrowWidth + strokeWidth * Math.sqrt(2) / 2, arrowWidth];

  var arrowHead = new DvtPolyline(context, points);
  arrowHead.setStroke(stroke);
  arrowHead.setFill(null);

  return arrowHead;
};


/**
 * @protected
 */
DvtDiagramLinkConnectorUtils.getCircleRadius = function(linkWidth) {

  var radius = linkWidth * 2;
  return radius;

};

DvtDiagramLinkConnectorUtils.getRectangleLength = function(linkWidth) {

  var length = linkWidth * 3;
  return length;

};


/**
 * Creates the connector shape for type DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_CIRCLE
 *
 * @param {DvtContext} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {DvtStroke} stroke the stroke to apply to the shape
 *
 * @protected
 */
DvtDiagramLinkConnectorUtils.CreateCircleConnector = function(context, linkWidth, stroke) {
  var radius = DvtDiagramLinkConnectorUtils.getCircleRadius(linkWidth);
  var conShape = new DvtCircle(context, radius, 0, radius);
  conShape.setStroke(stroke);
  conShape.setFill(null);
  return conShape;
};


/**
 * Creates the connector shape for type DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE
 *
 * @param {DvtContext} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {DvtStroke} stroke the stroke to apply to the shape
 *
 * @protected
 */
DvtDiagramLinkConnectorUtils.CreateRectangleConnector = function(context, linkWidth, stroke) {
  var length = DvtDiagramLinkConnectorUtils.getRectangleLength(linkWidth);
  var conShape = new DvtRect(context, 0 , -length / 2, length, length);
  conShape.setStroke(stroke);
  conShape.setFill(null);
  return conShape;
};


/**
 * Creates the connector shape for type DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE
 *
 * @param {DvtContext} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {DvtStroke} stroke the stroke to apply to the shape
 *
 * @protected
 */
DvtDiagramLinkConnectorUtils.CreateRoundedRectangleConnector = function(context, linkWidth, stroke) {
  var conShape = DvtDiagramLinkConnectorUtils.CreateRectangleConnector(context, linkWidth, stroke);
  conShape.setCornerRadius(linkWidth);
  return conShape;
};


/**
 * Creates the shape for a custom connector
 * @param {DvtContext} context the rendering context
 * @param {DvtAfMarker} connectorTemplate the template to stamp out the custom shape
 * @param {DvtDiagramLink} parentLink the associated parent link
 * @protected
 */
DvtDiagramLinkConnectorUtils.CreateCustomConnector = function(context, connectorTemplate, parentLink) {
  var afContext = parentLink.GetDiagram().createAfContext();
  afContext.setELContext(parentLink.getData().getElAttributes());
  // add action listener to the command objects in the link
  afContext.setContextCallback(parentLink, parentLink.eventContextCallback);
  afContext.setTabStopsArray(parentLink.getTabStopsArray());
  var connector = DvtAfComponentFactory.parseAndLayout(afContext, connectorTemplate, parentLink);
  return connector;
};


/**
 * Calculates the distance between the tip of the connector (i.e. the part that should touch the node) and the end of the link path
 *
 * @param {DvtShape} connector the connector shape
 * @param {string} connectorType the connector type if using a built-in connector, defined in DvtDiagramLinkDef
 * @param {DvtAfMarker} connectorTemplate the custom connector shape
 * @param {DvtStroke} stroke the stroke applied to the built-in connector, if applicable
 * @param {DvtDiagramLink} parentLink the associated parent link
 * @return {number} the connector offset
 *
 * @protected
 */
DvtDiagramLinkConnectorUtils.GetConnectorOffset = function(connector, connectorType, connectorTemplate, stroke, parentLink) {
  if (connectorTemplate) {
    var dims = DvtDiagramLinkConnectorUtils._getCachedDims(connector);
    var connScaleX = connector.getScaleX();
    var offsetX = .5 * (dims.w * connScaleX);
    return offsetX;
  }

  var linkWidth = parentLink.GetAppliedLinkWidth();
  var strokeWidth = stroke.getWidth();

  switch (connectorType) {
    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_OPEN:
      return (strokeWidth * Math.sqrt(2));

    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW:
      var scaleFactor = DvtDiagramLinkConnectorUtils._getReduce(linkWidth, .5);
      var arrowLength = scaleFactor * 5;
      return arrowLength;

    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE:
      var scaleFactor = DvtDiagramLinkConnectorUtils._getReduce(linkWidth, .5);
      var arrowLength = scaleFactor * 6;
      return .78 * arrowLength;

    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_CIRCLE:
      var radius = DvtDiagramLinkConnectorUtils.getCircleRadius(strokeWidth);
      return 2 * radius + strokeWidth / 2;


    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE:
    case DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE_ROUNDED:
      var length = DvtDiagramLinkConnectorUtils.getRectangleLength(strokeWidth);
      return length + strokeWidth / 2;

    default:
      return 0;
  }
};
// Copyright (c) 2011, 2015, Oracle and/or its affiliates. All rights reserved.
/**
 * @constructor
 * @class The class for the link underlay
 * @param {DvtContext} context the rendering context
 * @param {array} points link points
 * @param {DvtStroke} stroke for the link underlay
 */
var DvtDiagramLinkUnderlay = function(context, points, stroke)
{
  DvtDiagramLinkUnderlay.superclass.Init.call(this, context);
  this.Init(context, points, stroke);
};

DvtObj.createSubclass(DvtDiagramLinkUnderlay, DvtContainer, 'DvtDiagramLinkUnderlay');

/**
 * Initialization method called by the constructor
 * @param {DvtContext} context the rendering context
 * @param {array} points link points
 * @param {DvtStroke} stroke for the link underlay
 * @protected
 */
DvtDiagramLinkUnderlay.prototype.Init = function(context, points, stroke)
{
  if (!points)
    points = ['M', 0, 0, 'L', 1, 0];

  this._stroke = stroke;
  if (!this._stroke)
    this._stroke = new DvtSolidStroke('#ffffff', 1, 1);

  this._underlay = new DvtPath(context, points);
  this._underlay.setStroke(stroke);
  this._underlay.setFill(null);
  this.addChild(this._underlay);

  this._underlayStart = null;
  this._underlayStartType = null;
  this._underlayEnd = null;
  this._underlayEndType = null;
};


/**
 * Adds an underlay for the start connector
 *
 * @param {array} points the points representing the path of the parent link
 * @param {string} connectorType the connector type if using a built-in connector, defined in DvtAdfDiagramLinkDef
 * @param {DvtAfMarker} connectorTemplate the custom connector shape
 * @param {DvtAdfDiagramLink} parentLink the associated parent link
 */
DvtDiagramLinkUnderlay.prototype.addUnderlayStart = function(points, connectorType, connectorTemplate, parentLink) {
  var connectorUnderlay = this.CreateConnectorUnderlay(points, connectorType, connectorTemplate, parentLink, 0);
  if (this._underlayStart)
    this.removeChild(this._underlayStart);
  this._underlayStart = connectorUnderlay;
  this._underlayStartType = connectorType;
  this.addChild(this._underlayStart);
};


/**
 * Adds an underlay for the end connector
 *
 * @param {array} points the points representing the path of the parent link
 * @param {string} connectorType the connector type if using a built-in connector, defined in DvtAdfDiagramLinkDef
 * @param {DvtAfMarker} connectorTemplate the custom connector shape
 * @param {DvtAdfDiagramLink} parentLink the associated parent link
 */
DvtDiagramLinkUnderlay.prototype.addUnderlayEnd = function(points, connectorType, connectorTemplate, parentLink) {
  var connectorUnderlay = this.CreateConnectorUnderlay(points, connectorType, connectorTemplate, parentLink, 1);
  if (this._underlayEnd)
    this.removeChild(this._underlayEnd);
  this._underlayEnd = connectorUnderlay;
  this._underlayEndType = connectorType;
  this.addChild(this._underlayEnd);
};


/**
 * Creates an underlay shape for the start or end connector
 *
 * @param {array} points the points representing the path of the parent link
 * @param {string} connectorType the connector type if using a built-in connector, defined in DvtAdfDiagramLinkDef
 * @param {DvtAfMarker} connectorTemplate the custom connector shape
 * @param {DvtAdfDiagramLink} parentLink the associated parent link
 * @param {number} connectorPos 0 for the startConnector, 1 for the endConnector
 * @return {DvtShape} the underlay shape
 */
DvtDiagramLinkUnderlay.prototype.CreateConnectorUnderlay = function(points, connectorType, connectorTemplate, parentLink, connectorPos) {

  var connectorUnderlay = DvtDiagramLinkConnectorUtils.CreateConnectorShape(this.getCtx(), connectorType, connectorTemplate, this._stroke, parentLink);

  DvtDiagramLinkConnectorUtils.TransformConnector(connectorUnderlay,
      connectorType,
      connectorTemplate,
      points, connectorPos);
  return connectorUnderlay;
};

/**
 * Gets underlay shape
 * @return {DvtPath} underlay shape
 */
DvtDiagramLinkUnderlay.prototype.getUnderlay = function() {
  return this._underlay;
};

/**
 * Gets underlay for the start connector
 * @return {DvtContainer} underlay for the start connector
 */
DvtDiagramLinkUnderlay.prototype.getUnderlayStart = function() {
  return this._underlayStart;
};

/**
 * Gets underlay for the end connector
 * @return {DvtContainer} underlay for the end connector
 */
DvtDiagramLinkUnderlay.prototype.getUnderlayEnd = function() {
  return this._underlayEnd;
};


/**
 * Sets stroke on underlays - link underlay, start and end connector underlays
 * @param {DvtStroke} stroke Stroke for the underlays
 * @param {number} strokeOffset the desired difference in size between the parent link width and the underlay link width
 */
DvtDiagramLinkUnderlay.prototype.setStroke = function(stroke, strokeOffset) {
  this._stroke = stroke;
  //  - use non-scaling stroke on the link on older devices with iOS and Safari
  if (DvtAgent.isTouchDevice() && DvtAgent.isBrowserSafari() && DvtAgent.getDevicePixelRatio() == 1)
    stroke.setFixedWidth(true);
  this._underlay.setStroke(stroke);

  if (this._underlayStart) {
    var startStroke = stroke.clone();
    startStroke.setType(DvtStroke.SOLID);
    startStroke.setFixedWidth(false);
    if (this._underlayStartType == DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW ||
        this._underlayStartType == DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE) {
      startStroke.setWidth(strokeOffset);
      this._underlayStart.setSolidFill(stroke.getColor());
    }
    this._underlayStart.setStroke(startStroke);
  }

  if (this._underlayEnd) {
    var endStroke = stroke.clone();
    endStroke.setType(DvtStroke.SOLID);
    endStroke.setFixedWidth(false);
    if (this._underlayEndType == DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW ||
        this._underlayEndType == DvtDiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE) {
      endStroke.setWidth(strokeOffset);
      this._underlayEnd.setSolidFill(stroke.getColor());
    }
    this._underlayEnd.setStroke(endStroke);
  }
};

/**
 * Gets underlay stroke
 * @return {DvtStroke} underlay stroke
 */
DvtDiagramLinkUnderlay.prototype.getStroke = function() {
  return this._stroke;
};

/**
 * Hides underlay start
 */
DvtDiagramLinkUnderlay.prototype.hideUnderlayStart = function() {
  if (this._underlayStart)
    this.removeChild(this._underlayStart);
};

/**
 * Hides underlay end
 */
DvtDiagramLinkUnderlay.prototype.hideUnderlayEnd = function() {
  if (this._underlayEnd)
    this.removeChild(this._underlayEnd);
};

/**
 * Shows underlay start
 */
DvtDiagramLinkUnderlay.prototype.showUnderlayStart = function() {
  if (this._underlayStart)
    this.addChild(this._underlayStart);
};

/**
 * Shows underlay end
 */
DvtDiagramLinkUnderlay.prototype.showUnderlayEnd = function() {
  if (this._underlayEnd)
    this.addChild(this._underlayEnd);
};
var DvtDiagramLinkUtils = {
};

DvtObj.createSubclass(DvtDiagramLinkUtils, DvtObj, 'DvtDiagramLinkUtils');

/**
 * Converts link style to stroke type
 * @param {string} linkStyle link style, values are 'solid', 'dash', 'dot', 'dashDot'
 * @return {number} stroke type
 * @protected
 */
DvtDiagramLinkUtils.ConvertLinkStyleToStrokeType = function(linkStyle) {
  var strokeType = DvtStroke.SOLID;
  switch (linkStyle) {
    case 'dash':
      strokeType = DvtStroke.DASHED;
      break;
    case 'dot':
      strokeType = DvtStroke.DOTTED;
      break;
    case 'dashDot':
      strokeType = DvtStroke.DASHED_DOTTED;
      break;
    default :
      break;
  }
  return strokeType;
};

/**
 * Gets dash size
 * @param {number} strokeType stroke type
 * @param {boolean} bUnderlay true for underlay stroke
 * @return {string} dash size
 * @protected
 */
DvtDiagramLinkUtils.GetStrokeDash = function(strokeType, bUnderlay) {
  if (DvtStroke.SOLID == strokeType) {
    return null;
  }
  // For underlays, increase the dashes by 2 (1 pixel on each side) and decrease the gaps by 2 (1 pixel on each side)
  else if (DvtStroke.DASHED == strokeType) {
    return bUnderlay ? '8,2' : '6,4';
  }
  else if (DvtStroke.DOTTED == strokeType) {
    return bUnderlay ? '4,1' : '2,3';
  }
  else if (DvtStroke.DASHED_DOTTED == strokeType) {
    return bUnderlay ? '10,1,4,1' : '8,3,2,3';
  }
};

/**
 * Gets dash offset
 * @param {number} strokeType stroke type
 * @param {boolean} bUnderlay true for underlay stroke
 * @return {number} dash offset
 * @protected
 */
DvtDiagramLinkUtils.GetStrokeDashOffset = function(strokeType, bUnderlay) {
  if (bUnderlay && DvtStroke.SOLID != strokeType) {
    return 1;
  }
  return null;
};

/**
 * @protected
 * Create an array of path commands from an array of points.
 * @param {array} points used for rendering a link
 * @return {array} array as SVG path commands
 */
DvtDiagramLinkUtils.ConvertToPath = function(points) {
  var pathCmds = [];
  if (points) {
    for (var i = 0; i < points.length; i += 2) {
      if (i == 0) {
        pathCmds.push('M');
      }
      else {
        pathCmds.push('L');
      }
      pathCmds.push(points[i]);
      pathCmds.push(points[i + 1]);
    }
  }
  return pathCmds;
};

/**
 * @protected
 * Create an array of points from an array of path commands.
 * @param {array} pathCmds array as SVG path commands
 * @return {array} points used for rendering a link
 */
DvtDiagramLinkUtils.ConvertToPoints = function(pathCmds) {
  var points = [];
  if (pathCmds) {
    for (var i = 0; i < pathCmds.length; i++) {
      if (!isNaN(pathCmds[i])) {
        points.push(pathCmds[i]);
      }
    }
  }
  return points;
};

/**
 * @protected
 * Determine if the given array of points defines a path.
 * @param {array} points points used for rendering a link.  The array can contain
 *                coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path commands, like
 *                ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].
 * @return {boolean} true if the array contains SVG path commands
 */
DvtDiagramLinkUtils.IsPath = function(points) {
  if (points && points.length > 0) {
    return isNaN(points[0]);
  }
  return false;
};

/**
 * Gets array of control points
 * @param {array} points points used for rendering a link
 * @return {array} control points for a link as an array of DvtPoint objects
 */
DvtDiagramLinkUtils.GetControlPoints = function(points) {
  var controlPoints = [];
  var coords;
  if (DvtDiagramLinkUtils.IsPath(points)) {
    coords = DvtDiagramLinkUtils.ConvertToPoints(points);
  }
  else {
    coords = points;
  }
  for (var i = 0; i < coords.length; i += 2) {
    controlPoints.push(new DvtPoint(coords[i], coords[i + 1]));
  }
  return controlPoints;
};
/**
 * @constructor
 * @param {DvtContext} context the rendering context
 * @param {DvtDiagram} diagram the parent diagram component
 * @param {object} nodeData node data
 * @extends {DvtBaseDiagramNode}
 */
var DvtDiagramNode = function(context, diagram, nodeData) {
  this.Init(context, diagram, nodeData);
};

DvtObj.createSubclass(DvtDiagramNode, DvtBaseDiagramNode, 'DvtDiagramNode');

/**
 * Returns a new instance of DvtDiagramNode
 * @param {DvtDiagram} diagram the parent diagram
 * @param {object} data the data for this node
 * @return {DvtDiagramNode} the diagram node
 */
DvtDiagramNode.newInstance = function(diagram, data) {
  return new DvtDiagramNode(diagram.getCtx(), diagram, data);
};

/**
 * Initializes this component
 * @param {DvtContext} context the rendering context
 * @param {DvtDiagram} diagram the parent diagram
 * @param {object} data the data for this node
 * @protected
 */
DvtDiagramNode.prototype.Init = function(context, diagram, data) {
  DvtDiagramNode.superclass.Init.call(this, context, data['id'], diagram);
  this._data = data;
  if (this._diagram.isSelectionSupported()) {
    this.setCursor(DvtSelectionEffectUtils.getSelectingCursor());
  }
};

/**
 * Gets the data object
 * @return {object} the data object
 */
DvtDiagramNode.prototype.getData = function() {
  return this._data;
};

/**
 * Gets the node id
 * @return {string} node id
 */
DvtDiagramNode.prototype.getId = function() {
  return this._data['id'];
};

/**
 * @override
 */
DvtDiagramNode.prototype.getContentBounds = function() {
  return this._contentDims;
};

/**
 * @override
 */
DvtDiagramNode.prototype.getLabelBounds = function() {
  //: return saved label dimensions, because getting
  //them dynamically seems to return different sizes based on zoom
  var bounds = null;
  if (this._labelObj) {
    if (this._labelDims) {
      bounds = this._labelDims;
    }
    else {
      bounds = this._labelObj.getDimensions();
    }
  }
  return bounds;
};

/**
 * @override
 */
DvtDiagramNode.prototype.setSelected = function(selected) {
  var prevState = this._getState();
  DvtDiagramNode.superclass.setSelected.call(this, selected);
  if (this._diagram.getOptions()['selectionRenderer']) {
    this._applyCustomNodeContent(this._diagram.getOptions()['selectionRenderer'], this._getState(), prevState);
  }
  else {
    this.processDefaultSelectionEffect(selected);
  }
  this.UpdateAriaLabel();
};

/**
 * Hide or show selection effect on the node
 * @param {boolean} selected true to show selected effect
 */
DvtDiagramNode.prototype.processDefaultSelectionEffect = function(selected) {
  if (!this.getSelectionShape())
    return;
  this.getSelectionShape().setSelected(selected);
};

/**
 * @override
 */
DvtDiagramNode.prototype.isSelectable = function() {
  return this.GetDiagram().isSelectionSupported() && this.getData()['selectable'] != 'off';
};

/**
 * Gets node icon
 * @return {DvtImageMarker|DvtSimpleMarker} node icon
 * @protected
 */
DvtDiagramNode.prototype.GetIcon = function() {
  return this._shape;
};

/**
 * Renders diagram node
 * @param {DvtContainer} container parent container for the diagram node
 */
DvtDiagramNode.prototype.render = function(container) {
  if (this._diagram.getOptions()['renderer']) {
    this._applyCustomNodeContent(this._diagram.getOptions()['renderer'], this._getState(), null);
  }
  else {
    var nodeData = this.getData();
    DvtDiagramNode._renderNodeBackground(this._diagram, nodeData, this);
    DvtDiagramNode._renderNodeIcon(this._diagram, nodeData, this);
    DvtDiagramNode._renderNodeLabels(this._diagram, nodeData, this);
    DvtDiagramNode._addHoverSelectionStrokes(this.getSelectionShape(), nodeData);
  }
  container.addChild(this);
  this._contentDims = this._calcContentDims();
  this.setAriaRole('img');
  this.UpdateAriaLabel();
  this._diagram.getEventManager().associate(this, this);
};

/**
 * Calls the specified renderer, adds, removes or updates content of the node
 * @param {function} renderer custom renderer for the node state
 * @param {Object} state object that contains curremt object state
 * @param {Object} prevState object that contains previous object state
 * @private
 */
DvtDiagramNode.prototype._applyCustomNodeContent = function(renderer, state, prevState) {

  var contextHandler = this._diagram.getOptions()['_contextHandler'];
  if (!contextHandler) {
    this._diagram.Log('DvtDiagram: could not add custom node content - context handler is undefined', 1);
    return;
  }
  var nodeData = this.getData();
  var context = contextHandler(this.getElem(), this._customNodeContent, nodeData, state, prevState);
  var nodeContent = renderer(context);

  //remove content if the new and old content do not match, the new content might be null
  if (this._customNodeContent && nodeContent != this._customNodeContent) {
    if (this._customNodeContent.namespaceURI === DvtToolkitUtils.SVG_NS) {
      this.getContainerElem().removeChild(this._customNodeContent);
    }
    else {
      this.removeChild(nodeContent);
    }
    this._customNodeContent = null;
  }

  if (nodeContent && nodeContent.namespaceURI === DvtToolkitUtils.SVG_NS) {
    if (!this._customNodeContent) {
      DvtToolkitUtils.appendChildElem(this.getContainerElem(), nodeContent);
      this._customNodeContent = nodeContent;
    }
  }
  else if (nodeContent instanceof DvtBaseComponent) {
    if (!this._customNodeContent) {
      this.addChild(nodeContent);
      this._customNodeContent = nodeContent;
    }
  }
  else if (nodeContent) { //not an svg fragment
    this._diagram.Log('DvtDiagram: could not add custom node content for the node ' + this.getId() + nodeContent, 1);
  }
};

/**
 * Renders node icon
 * @param {DvtDiagram} diagram parent component
 * @param {object} nodeData node data
 * @param {DvtContainer} container parent container
 * @private
 */
DvtDiagramNode._renderNodeBackground = function(diagram, nodeData, container) {
  var backgroundStyle = new DvtCSSStyle(nodeData['backgroundStyle']);
  if (!backgroundStyle.isEmpty()) {
    var width = DvtCSSStyle.toNumber(backgroundStyle.getStyle(DvtCSSStyle.WIDTH));
    var height = DvtCSSStyle.toNumber(backgroundStyle.getStyle(DvtCSSStyle.HEIGHT));
    var fillColor = backgroundStyle.getStyle(DvtCSSStyle.BACKGROUND_COLOR);

    var borderColor = backgroundStyle.getStyle(DvtCSSStyle.BORDER_COLOR);
    var borderWidth = DvtCSSStyle.toNumber(backgroundStyle.getStyle(DvtCSSStyle.BORDER_WIDTH));
    var borderRadius = DvtCSSStyle.toNumber(backgroundStyle.getStyle(DvtCSSStyle.BORDER_RADIUS));

    var backgroundRect = new DvtRect(diagram.getCtx(), 0, 0, width, height);
    backgroundRect.setSolidFill(fillColor);
    if (borderRadius) {
      backgroundRect.setRx(borderRadius);
      backgroundRect.setRy(borderRadius);
    }
    if (borderColor) {
      backgroundRect.setStroke(new DvtSolidStroke(borderColor, 1, borderWidth));
    }
    container.addChild(backgroundRect);
    container.setSelectionShape(backgroundRect);
    container._background = backgroundRect;
  }
};

/**
 * Renders node icon
 * @param {DvtDiagram} diagram parent component
 * @param {object} nodeData node data
 * @param {DvtContainer} container parent container
 * @private
 */
DvtDiagramNode._renderNodeIcon = function(diagram, nodeData, container) {
  var icon = nodeData['icon'];
  if (icon) {
    var iconWidth = icon['width'];
    var iconHeight = icon['height'];
    var iconColor = icon['color'];
    var iconMarker;
    if (icon['source']) {
      iconMarker = new DvtImageMarker(diagram.getCtx(), iconWidth / 2, iconHeight / 2, iconWidth, iconHeight,
          icon['source'], icon['sourceSelected'], icon['sourceHover'], icon['sourceHoverSelected']);
    }
    else {
      iconMarker = new DvtSimpleMarker(diagram.getCtx(), icon['shape'], DvtCSSStyle.SKIN_ALTA, iconWidth / 2, iconHeight / 2, iconWidth, iconHeight);
    }
    if (icon['fillPattern'] != 'none') {
      iconMarker.setFill(new DvtPatternFill(icon['fillPattern'], iconColor, iconColor));
    }
    else {
      iconMarker.setSolidFill(iconColor);
    }
    if (icon['borderColor']) {
      iconMarker.setStroke(new DvtSolidStroke(icon['borderColor'], icon['borderWidth']));
    }
    container.addChild(iconMarker);
    container._shape = iconMarker;
    DvtDiagramNode._setIconPosition(diagram, nodeData, container);
    if (!container._background) {
      //if background does not exist apply selection on the node icon
      container.setSelectionShape(iconMarker);
    }
  }
};

/**
 * Sets icon position if background is present
 * @param {DvtDiagram} diagram parent component
 * @param {object} nodeData node data
 * @param {DvtContainer} container parent container
 * @private
 */
DvtDiagramNode._setIconPosition = function(diagram, nodeData, container) {
  if (container._background) {
    var iconData = nodeData['icon'];
    var backgroundWidth = container._background.getWidth();
    var backgroundHeight = container._background.getHeight();
    var iconWidth = iconData['width'];
    var iconHeight = iconData['height'];
    //default to center
    var positionX = (backgroundWidth - iconWidth) * .5;
    var positionY = (backgroundHeight - iconHeight) * .5;

    // find x position
    if (iconData['positionX'] !== undefined) { //allow positionX=0
      positionX = parseFloat(iconData['positionX']);
      if (DvtAgent.isRightToLeft(container.getCtx())) {
        positionX = backgroundWidth - positionX - iconWidth;
      }
    }
    else {
      var resolvedHalign = iconData['halign'];
      if (resolvedHalign == 'start') {
        resolvedHalign = DvtAgent.isRightToLeft(container.getCtx()) ? 'right' : 'left';
      }
      else if (resolvedHalign == 'end') {
        resolvedHalign = DvtAgent.isRightToLeft(container.getCtx()) ? 'left' : 'right';
      }

      positionX = (resolvedHalign == 'left') ? 0 :
                  (resolvedHalign == 'right') ? backgroundWidth - iconWidth : positionX;
    }

    // find y position
    if (iconData['positionY'] !== undefined) {
      positionY = parseFloat(iconData['positionY']);
    }
    else {
      if (iconData['valign'] == 'top') {
        positionY = 0;
      }
      else if (iconData['valign'] == 'bottom') {
        positionY = backgroundHeight - iconHeight;
      }
    }
    container._shape.setTranslate(positionX, positionY);
  }
};

/**
 * Renders node label
 * @param {DvtDiagram} diagram parent component
 * @param {object} nodeData node data
 * @param {DvtContainer} container parent container
 * @private
 */
DvtDiagramNode._renderNodeLabels = function(diagram, nodeData, container) {

  var rtl = DvtAgent.isRightToLeft(diagram.getCtx());
  var halign = rtl ? DvtOutputText.H_ALIGN_RIGHT : DvtOutputText.H_ALIGN_LEFT;
  if (nodeData['label']) {
    var label = DvtDiagramNode.createText(diagram.getCtx(), nodeData['label'], nodeData['labelStyle'], halign, DvtOutputText.V_ALIGN_TOP);
    //check for label width
    var labelWidth = DvtCSSStyle.toNumber((new DvtCSSStyle(nodeData['labelStyle'])).getWidth());
    if (labelWidth > 0 && DvtTextUtils.fitText(label, labelWidth, Infinity, container)) {
      container._labelObj = label;
    }
    else {
      container.addChild(label);
      container._labelObj = label;
    }
  }
  /*
  if (nodeData['secondaryLabel']) {
    var secondaryLabel = DvtDiagramNode.createText(diagram.getCtx(), nodeData['secondaryLabel'], nodeData['secondaryLabelStyle'], halign, DvtOutputText.V_ALIGN_TOP);
    container.addChild(secondaryLabel);
    container._secondaryLabelObj = secondaryLabel;
  }
  */
};

/**
 * Creates a text element
 * @param {DvtContext} ctx the rendering context
 * @param {string} strText the text string
 * @param {string} style the CSS style string to apply to the text
 * @param {string} halign the horizontal alignment
 * @param {string} valign the vertical alignment
 * @return {DvtOutputText} the text element
 */
DvtDiagramNode.createText = function(ctx, strText, style, halign, valign) {
  var text = new DvtOutputText(ctx, strText, 0, 0);
  text.setCSSStyle(new DvtCSSStyle(style));
  text.setHorizAlignment(halign);
  text.setVertAlignment(valign);
  return text;
};

/**
 * Adds hover selection strokes to the node
 * @param {DvtShape} selectionShape selection shape for the node
 * @param {object} nodeData node data
 * @private
 */
DvtDiagramNode._addHoverSelectionStrokes = function(selectionShape, nodeData) {
  //Apply the selected, and hover strokes
  var hoverInnerColor = nodeData['hoverInnerColor'];
  var hoverOuterColor = nodeData['hoverOuterColor'];
  var selectionColor = nodeData['selectionColor'];

  var his = new DvtSolidStroke(hoverInnerColor, 1, 4);
  his.setFixedWidth(true);
  var hos = new DvtSolidStroke(hoverOuterColor, 1, 8);
  hos.setFixedWidth(true);
  var sis = new DvtSolidStroke(selectionColor, 1, 2);
  sis.setFixedWidth(true);
  var sos = new DvtSolidStroke(selectionColor, 1, 4);
  sos.setFixedWidth(true);
  var shis = new DvtSolidStroke(hoverInnerColor, 1, 4);
  shis.setFixedWidth(true);
  var shos = new DvtSolidStroke(selectionColor, 1, 8);
  shos.setFixedWidth(true);
  selectionShape.setHoverStroke(his, hos).setSelectedStroke(sis, sos).setSelectedHoverStroke(shis, shos);
};


/**
 * Sets the shape that should be used for displaying selection and hover feedback
 * @param {DvtShape} selectionShape the shape that should be used for displaying selection and hover feedback
 */
DvtDiagramNode.prototype.setSelectionShape = function(selectionShape) {
  this._selectionShape = selectionShape;
};


/**
 * Gets the shape that should be used for displaying selection and hover feedback
 * @return {DvtShape} the shape that should be used for displaying selection and hover feedback
 */
DvtDiagramNode.prototype.getSelectionShape = function() {
  if (!this._selectionShape && this._contentDims) { // create selection shape in necessary
    var selectionShape = new DvtRect(this._diagram.getCtx(), this._contentDims.x, this._contentDims.y, this._contentDims.w, this._contentDims.h);
    selectionShape.setInvisibleFill();
    this.setSelectionShape(selectionShape);
    this.addChildAt(selectionShape, 0);
    DvtDiagramNode._addHoverSelectionStrokes(selectionShape, this.getData());
    this._selectionShape = selectionShape;
  }
  return this._selectionShape;
};

/**
 * @override
 */
DvtDiagramNode.prototype.showHoverEffect = function() {
  var prevState = this._getState();
  this._isShowingHoverEffect = true;
  if (this._diagram.getOptions()['hoverRenderer']) {
    this._applyCustomNodeContent(this._diagram.getOptions()['hoverRenderer'], this._getState(), prevState);
  }
  else {
    this.processDefaultHoverEffect(true);
  }
};


/**
 * @override
 */
DvtDiagramNode.prototype.hideHoverEffect = function() {
  var prevState = this._getState();
  this._isShowingHoverEffect = false;
  if (this._diagram.getOptions()['hoverRenderer']) {
    this._applyCustomNodeContent(this._diagram.getOptions()['hoverRenderer'], this._getState(), prevState);
  }
  else {
    this.processDefaultHoverEffect(false);
  }
};

/**
 * Hides or shows default hover effect
 * @param {boolean} hovered true to show hover effect
 */
DvtDiagramNode.prototype.processDefaultHoverEffect = function(hovered) {
  if (!this.getSelectionShape())
    return;
  if (hovered)
    this.getSelectionShape().showHoverEffect();
  else
    this.getSelectionShape().hideHoverEffect();
};

/**
 * @override
 */
DvtDiagramNode.prototype.getDatatip = function(target, x, y) {
  // Custom Tooltip from Function
  var tooltipFunc = this.GetDiagram().getOptions()['tooltip'];
  if (tooltipFunc)
    return this.GetDiagram().getCtx().getTooltipManager().getCustomTooltip(tooltipFunc, this.getDataContext());

  // Custom Tooltip from ShortDesc
  return this.getShortDesc();
};

/**
 * Returns short description for the node
 * @return {string}  short description for the node
 */
DvtDiagramNode.prototype.getShortDesc = function() {
  return this.getData()['shortDesc'];
};

/**
 * Returns the data context that will be passed to the tooltip function.
 * @return {object}
 */
DvtDiagramNode.prototype.getDataContext = function() {
  return {
    'id': this.getId(),
    'type': 'node',
    'label': this.getData()['label']
  };
};

/**
 * @override
 */
DvtDiagramNode.prototype.getAriaLabel = function() {
  var states = [];
  if (this.isSelectable()) {
    states.push(DvtBundle.getTranslatedString(DvtBundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  }
  return DvtDisplayable.generateAriaLabel(this.getShortDesc(), states);
};

/**
 * @protected
 * Updates accessibility attributes on selection event
 */
DvtDiagramNode.prototype.UpdateAriaLabel = function() {
  if (!DvtAgent.deferAriaCreation()) {
    var desc = this.getAriaLabel();
    if (desc)
      this.setAriaProperty('label', desc);
  }
};

/**
 * @override
 */
DvtDiagramNode.prototype.getNextNavigable = function(event) {
  var next = null;
  if (event.keyCode == DvtKeyboardEvent.SPACE && event.ctrlKey) {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    next = this;
  }
  else if ((event.keyCode == DvtKeyboardEvent.OPEN_ANGLED_BRACKET || DvtKeyboardEvent.CLOSE_ANGLED_BRACKET) &&
      event.altKey) {
    //get first navigable link if exists
    var adjLinks = this.GetDiagram().getNavigableLinksForNodeId(this.getId());
    var keyboardHandler = this.GetDiagram().getEventManager().getKeyboardHandler();
    if (keyboardHandler && keyboardHandler.getFirstNavigableLink)
      next = keyboardHandler.getFirstNavigableLink(this, event, adjLinks);
    if (next)
      next.setKeyboardFocusNode(this);
    else
      next = this;
    return next;
  }
  else if (event.type == DvtMouseEvent.CLICK) {
    next = this;
  }
  else {
    // get next navigable node
    var arNodes = this.GetDiagram().GetAllNodeObjects();
    next = DvtKeyboardHandler.getNextAdjacentNavigable(this, event, arNodes);
  }

  return next;
};

/**
 * @override
 */
DvtDiagramNode.prototype.showKeyboardFocusEffect = function() {
  var prevState = this._getState();
  this._isShowingKeyboardFocusEffect = true;
  if (this._diagram.getOptions()['focusRenderer']) {
    this._applyCustomNodeContent(this._diagram.getOptions()['focusRenderer'], this._getState(), prevState);
  }
  else {
    this.processDefaultFocusEffect(true);
  }
};

/**
 * @override
 */
DvtDiagramNode.prototype.hideKeyboardFocusEffect = function() {
  if (this.isShowingKeyboardFocusEffect()) {
    var prevState = this._getState();
    this._isShowingKeyboardFocusEffect = false;
    if (this._diagram.getOptions()['focusRenderer']) {
      this._applyCustomNodeContent(this._diagram.getOptions()['focusRenderer'], this.getData(), this._getState(), prevState);
    }
    else {
      this.processDefaultFocusEffect(false);
    }
  }
};

/**
 * Hides or shows default keyboard focus effect
 * @param {boolean} focused true to show keyboard focus effect
 */
DvtDiagramNode.prototype.processDefaultFocusEffect = function(focused) {
  this.processDefaultHoverEffect(focused);
};

/**
 * @override
 */
DvtDiagramNode.prototype.isShowingKeyboardFocusEffect = function() {
  return this._isShowingKeyboardFocusEffect;
};

/**
 * @override
 */
DvtDiagramNode.prototype.getCategories = function() {
  return this.getData()['categories'] ? this.getData()['categories'] : [this.getId()];
};

/**
 * Checks whether the object is hidden
 * @return {boolean} true if the object is hidden
 */
DvtDiagramNode.prototype.isHidden = function() {
  var hiddenCategories = this.GetDiagram().getOptions()['hiddenCategories'];
  if (hiddenCategories && DvtArrayUtils.hasAnyItem(hiddenCategories, this.getCategories())) {
    return true;
  }
  return false;
};

/**
 * Get the content bounds in coordinates relative to this node.
 * @return {DvtRectangle} content bounds
 * @private
 */
DvtDiagramNode.prototype._calcContentDims = function() {
  var dims = null;
  if (this._customNodeContent) {
    var bbox = this.getDimensions();
    if (bbox) {
      dims = new DvtRectangle(bbox.x, bbox.y, bbox.w - bbox.x, bbox.h - bbox.y);
    }
  }
  else {
    dims = this._background ? this._background.GetDimensionsWithStroke(this) : null;
    if (dims && this._shape) {
      dims = dims.getUnion(this._shape.GetDimensionsWithStroke(this));
    }
    else if (!dims && this._shape) {
      dims = this._shape.GetDimensionsWithStroke(this);
    }
  }
  return dims;
};

/**
 * @override
 */
DvtDiagramNode.prototype.animateUpdate = function(animationHandler, oldNode) {
  var playable = new DvtCustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());
  //position
  var oldTx = oldNode.getTranslateX();
  var oldTy = oldNode.getTranslateY();
  var newTx = this.getTranslateX();
  var newTy = this.getTranslateY();
  if (oldTx != newTx) {
    this.setTranslateX(oldTx);
    playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, this, this.getTranslateX, this.setTranslateX, newTx);
  }
  if (oldTy != newTy) {
    this.setTranslateY(oldTy);
    playable.getAnimator().addProp(DvtAnimator.TYPE_NUMBER, this, this.getTranslateY, this.setTranslateY, newTy);
  }
  //size
  if (oldNode._shape && this._shape) {
    playable.getAnimator().addProp(DvtAnimator.TYPE_RECTANGLE, this._shape, this._shape.getCenterDimensions, this._shape.setCenterDimensions, this._shape.getCenterDimensions());
    this._shape.setCenterDimensions(oldNode._shape.getCenterDimensions());
  }
  //label
  if (oldNode._labelObj && this._labelObj) {
    var oldMat = oldNode._labelObj.getMatrix();
    var newMat = this._labelObj.getMatrix();
    if (!oldMat.equals(newMat)) {
      this._labelObj.setMatrix(oldMat);
      playable.getAnimator().addProp(DvtAnimator.TYPE_MATRIX, this._labelObj, this._labelObj.getMatrix, this._labelObj.setMatrix, newMat);
    }
  }
  //background and icon
  DvtDiagramNode._animateFill(playable, oldNode._background, this._background);
  DvtDiagramNode._animateFill(playable, oldNode._shape, this._shape);
  animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);
};

/**
 * Helper to animate between fills
 *
 * @param {DvtPlayable} playable The playable to add the animation to
 * @param {DvtDisplayable} oldDisplayable old displayble
 * @param {DvtDisplayable} newDisplayable new displayable
 * @private
 */
DvtDiagramNode._animateFill = function(playable, oldDisplayable, newDisplayable) {
  if (oldDisplayable && newDisplayable) {
    playable.getAnimator().addProp(DvtAnimator.TYPE_FILL, newDisplayable, newDisplayable.getFill, newDisplayable.setFill, newDisplayable.getFill());
    newDisplayable.setFill(oldDisplayable.getFill());
  }
};

/**
 * @override
 */
DvtDiagramNode.prototype.animateDelete = function(animationHandler, deleteContainer) {
  this.GetDiagram().getNodesPane().addChild(this);
  var thisRef = this;
  var removeFunc = function() {
    thisRef.getParent().removeChild(thisRef);
    thisRef.destroy();
  };
  var playable = new DvtAnimFadeOut(this.getCtx(), this, animationHandler.getAnimationDuration());
  DvtPlayable.appendOnEnd(playable, removeFunc);
  animationHandler.add(playable, DvtDiagramDataAnimationHandler.DELETE);
};

/**
 * @override
 */
DvtDiagramNode.prototype.animateInsert = function(animationHandler) {
  this.setAlpha(0);
  animationHandler.add(new DvtAnimFadeIn(this.getCtx(), this, animationHandler.getAnimationDuration()), DvtDiagramDataAnimationHandler.INSERT);
};

/**
 * @override
 */
DvtDiagramNode.prototype.getLayoutAttributes = function(layout) {
  return this.getData();
};

/**
 * Retrieves current state for the node
 * @param {number} zoom optional zoom level for the component
 * @return {Object} object that contains current hovered, selected, focused staed and zoom level for the node
 * @private
 */
DvtDiagramNode.prototype._getState = function(zoom) {
  return {
    'hovered': this._isShowingHoverEffect,
    'selected': this.isSelected(),
    'focused': this._isShowingKeyboardFocusEffect,
    'zoom': zoom ? zoom : this.GetDiagram().getPanZoomCanvas().getZoom()};
};

/**
 * Calls zoom renderer on zoom event if zoom renderer is specified
 * @param {DvtZoomEvent} event zoom event
 */
DvtDiagramNode.prototype.rerenderOnZoom = function(event) {
  if (this._diagram.getOptions()['zoomRenderer']) {
    var prevState = this._getState(event.getOldZoom());
    var state = this._getState(event.getNewZoom());
    this._applyCustomNodeContent(this._diagram.getOptions()['zoomRenderer'], state, prevState);
  }
};
/**
 *  Provides automation services for a DVT diagram component.
 *  @class  DvtDiagramAutomation
 *  @param {DvtDiagram} dvtComponent
 *  @implements {DvtAutomation}
 *  @constructor
 *  @export
 */
var DvtDiagramAutomation = function(dvtComponent) {
  this.Init(dvtComponent);
};

DvtObj.createSubclass(DvtDiagramAutomation, DvtAutomation, 'DvtDiagramAutomation');

/**
 * Initializes this automation object
 * @param {DvtDiagram} dvtComponent
 */
DvtDiagramAutomation.prototype.Init = function(dvtComponent) {
  this._diagram = dvtComponent;
};

/**
 * Valid subIds include:
 * <ul>
 * <li>link[rowIndex]</li>
 * <li>node[rowIndex]</li>
 * <li>tooltip</li>
 * </ul>
 * @override
 */
DvtDiagramAutomation.prototype.GetSubIdForDomElement = function(displayable) {
  var logicalObj = this._diagram.getEventManager().GetLogicalObject(displayable);
  if (logicalObj && (logicalObj instanceof DvtDiagramNode)) {
    return 'node[' + this._diagram.GetAllNodes().indexOf(logicalObj.getId()) + ']';
  }
  else if (logicalObj && (logicalObj instanceof DvtDiagramLink)) {
    return 'link[' + this._diagram.GetAllLinks().indexOf(logicalObj.getId()) + ']';
  }
  return null;
};

/**
 * Valid subIds include:
 * <ul>
 * <li>link[rowIndex]</li>
 * <li>node[rowIndex]</li>
 * <li>tooltip</li>
 * </ul>
 * @override
 * @export
 */
DvtDiagramAutomation.prototype.getDomElementForSubId = function(subId) {
  if (subId == DvtAutomation.TOOLTIP_SUBID)
    return this.GetTooltipElement(this._diagram);

  var parsedSubId = this._parseSubId(subId);
  var component = parsedSubId['component'];
  var index = parsedSubId['index'];
  var displayable = null;
  if (component == 'node') {
    displayable = this._getNode(index);
  }
  else if (component == 'link') {
    displayable = this._getLink(index);
  }
  return displayable ? displayable.getElem() : null;
};

/**
 * Parses a Diagram subId string into a map of component and index
 * @param {String} subId diagram subId to parse
 * @return {Object}
 * @private
 */
DvtDiagramAutomation.prototype._parseSubId = function(subId) {
  var component = subId;
  var index = - 1;
  var substring = subId.substring(0, subId.indexOf('['));
  if (substring) {
    component = substring == 'node' || substring == 'link' ? substring : null;
    index = parseInt(subId.substring(subId.indexOf('[') + 1, subId.indexOf(']')));
  }
  return {'component' : component, 'index' : index};
};

/**
 * @export
 * Get the number of nodes in diagram
 * @return {Number} number of nodes
 */
DvtDiagramAutomation.prototype.getNodeCount = function() {
  return this._diagram.getNodeCount();
};

/**
 * @export
 * Get the number of links in diagram
 * @return {Number} number of links
 */
DvtDiagramAutomation.prototype.getLinkCount = function() {
  return this._diagram.getLinkCount();
};

/**
 * @export
 * Gets diagram node data object for the given index
 * @param {Number} nodeIndex  node index
 * @return {Object} node data object
 */
DvtDiagramAutomation.prototype.getNode = function(nodeIndex) {
  var node = this._getNode(nodeIndex);
  if (node) {
    var data = {};
    data['id'] = node.getId();
    data['selected'] = node.isSelected();
    data['tooltip'] = node.getShortDesc();
    data['label'] = node.getData()['label'];
    data['background'] = node.getData()['backgroundStyle'];
    data['icon'] = this._getMarkerData(node.GetIcon());
    return data;
  }
  return null;
};

/**
 * @export
 * Gets diagram link data object for the given index
 * @param {Number} linkIndex  link index
 * @return {Object} link data object
 */
DvtDiagramAutomation.prototype.getLink = function(linkIndex) {
  var link = this._getLink(linkIndex);
  if (link) {
    var data = {};
    data['id'] = link.getId();
    data['selected'] = link.isSelected();
    data['tooltip'] = link.getShortDesc();
    data['label'] = link.getData()['label'];
    data['color'] = link.getLinkColor();
    data['width'] = link.getLinkWidth();
    data['style'] = link.getLinkStyle();
    data['startNode'] = link.getStartId();
    data['endNode'] = link.getEndId();
    data['startConnectorType'] = link.getStartConnectorType();
    data['endConnectorType'] = link.getEndConnectorType();
    return data;
  }
  return null;
};

/**
 * @private
 * Get marker data from marker
 * @param {DvtSimpleMarker|DvtImageMarker} marker Displayable marker object
 * @return {Object} Marker data object
 */
DvtDiagramAutomation.prototype._getMarkerData = function(marker) {
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
 * Gets diagram node for the given index
 * @param {Number} nodeIndex  node index
 * @return {DvtDiagramNode} node
 * @private
 */
DvtDiagramAutomation.prototype._getNode = function(nodeIndex) {
  var nodeIds = this._diagram.GetAllNodes();
  return (nodeIndex >= 0 && nodeIndex < nodeIds.length) ? this._diagram.getNodeById(nodeIds[nodeIndex]) : null;
};

/**
 * Gets diagram link for the given index
 * @param {Number} linkIndex  link index
 * @return {DvtDiagramLink} link
 * @private
 */
DvtDiagramAutomation.prototype._getLink = function(linkIndex) {
  var linkIds = this._diagram.GetAllLinks();
  return (linkIndex >= 0 && linkIndex < linkIds.length) ? this._diagram.getLinkById(linkIds[linkIndex]) : null;
};

  return D;
});