/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit', './DvtPanZoomCanvas'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

(function(dvt) {
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * @protected
 * Defines the context for a layout call.
 * @class DvtDiagramLayoutContext
 * @constructor
 * @param {DvtDiagramLayoutContext} context optional context to use for
 * initializing this context
 */
var DvtDiagramLayoutContext = function(context) {
  this.Init(context);
};

dvt.Obj.createSubclass(DvtDiagramLayoutContext, dvt.Obj, 'DvtDiagramLayoutContext');


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
 */
DvtDiagramLayoutContext.prototype.getNodeById = function(id) {
  return this._nodes[id];
};


/**
 * Get a node context by index.  Only nodes being laid out can be retrieved
 * through this function.
 * @param {number} index index of node context to get
 * @return {DvtDiagramLayoutContextNode}
 */
DvtDiagramLayoutContext.prototype.getNodeByIndex = function(index) {
  return this._arNodes[index];
};


/**
 * Get the number of nodes to layout.  This number does not include any
 * read-only nodes provided as additional information to this layout.
 * @return {number}
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
 */
DvtDiagramLayoutContext.prototype.getLinkById = function(id) {
  return this._links[id];
};


/**
 * Get a link context by index.
 * @param {number} index index of link context to get
 * @return {DvtDiagramLayoutContextLink}
 */
DvtDiagramLayoutContext.prototype.getLinkByIndex = function(index) {
  return this._arLinks[index];
};


/**
 * Get the number of links to layout.
 * @return {number}
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
 */
DvtDiagramLayoutContext.prototype.localToGlobal = function(point, node) {
  var offset = this.GetGlobalOffset(node);

  return new dvt.DiagramPoint(point['x'] + offset['x'], point['y'] + offset['y']);
};


/**
 * @protected
 * Get the position of the given node in the global coordinate system.
 * @param {DvtDiagramLayoutContextNode} node node to get global position for
 * @return {DvtDiagramPoint}
 */
DvtDiagramLayoutContext.prototype.GetGlobalOffset = function(node) {
  var offset = new dvt.DiagramPoint(0, 0);
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
 */
DvtDiagramLayoutContext.prototype.getComponentSize = function() {
  return this._componentSize;
};


/**
 * Set the viewport the component should use after the layout, in the layout's
 * coordinate system.
 * @param {DvtDiagramRectangle} viewport viewport the component should use
 * after the layout
 */
DvtDiagramLayoutContext.prototype.setViewport = function(viewport) {
  this._viewport = viewport;
};


/**
 * Get the viewport the component should use after the layout, in the layout's
 * coordinate system.
 * @return {DvtDiagramRectangle}
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
 */
DvtDiagramLayoutContext.prototype.getCurrentViewport = function() {
  return this._currentViewport;
};

/**
 * The function retrieves nearest common ancestor container for two nodes.
 * @param {string} nodeId1 first node id
 * @param {string} nodeId2 second node id
 * @return {string}  id for the first common ancestor container or null for top level diagram
 */
DvtDiagramLayoutContext.prototype.getCommonContainer = function(nodeId1, nodeId2) {
  var getAllAncestorIds = function(id, context) {
    var ids = [];
    var containerId = context.getNodeById(id) ? context.getNodeById(id).getContainerId() : null;
    while (containerId) {
      ids.push(containerId);
      containerId = context.getNodeById(containerId) ? context.getNodeById(containerId).getContainerId() : null;
    }
    ids.reverse();
    return ids;
  };

  var startPath = getAllAncestorIds(nodeId1, this);
  var endPath = getAllAncestorIds(nodeId2, this);
  var commonId = null;

  for (var i = 0; i < startPath.length && i < endPath.length; i++) {
    if (startPath[i] != endPath[i])
      break;
    commonId = startPath[i];
  }
  return commonId;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * @protected
 * Defines the link context for a layout call.
 * @class DvtDiagramLayoutContextLink
 * @constructor
 * @param {DvtDiagramLayoutContextLink} link optional context to use for
 * initializing this context
 */
var DvtDiagramLayoutContextLink = function(link) {
  this.Init(link);
};

dvt.Obj.createSubclass(DvtDiagramLayoutContextLink, dvt.Obj, 'DvtDiagramLayoutContextLink');


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
  this._labelValign = link ? link._labelValign : null;
  this._labelHalign = link ? link._labelHalign : null;
  this._labelBounds = link ? link._labelBounds : null;
  this._layoutAttrs = link ? link._layoutAttrs : null;
  this._startConnectorOffset = link ? link._startConnectorOffset : 0;
  this._endConnectorOffset = link ? link._endConnectorOffset : 0;
  this._linkWidth = link ? link._linkWidth : 1;
  this._selected = link ? link._selected : false;
  this._labelRotAngle = link ? link._labelRotAngle : null;
  this._labelRotPoint = link ? link._labelRotPoint : null;
  this._bPromoted = link ? link._bPromoted : false;
  this._containerId = link ? link._containerId : null;
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
 */
DvtDiagramLayoutContextLink.prototype.setPoints = function(points) {
  if (typeof points == 'string')
    this._points = dvt.PathUtils.createPathArray(points);
  else
    this._points = points;
};


/**
 * Get the points to use for rendering this link.  The returned array can
 * contain coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path
 * commands, like ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].  The points
 * are in the coordinate system of the link's container.
 * @return {array}
 */
DvtDiagramLayoutContextLink.prototype.getPoints = function() {
  return this._points;
};


/**
 * Set the position of the link label.  The position is in the coordinate
 * system of the link's container.
 * @param {DvtDiagramPoint} pos position of the link label
 */
DvtDiagramLayoutContextLink.prototype.setLabelPosition = function(pos) {
  this._labelPosition = pos;
};


/**
 * Get the position of the link label.  The position is in the coordinate
 * system of the link's container.
 * @return {DvtDiagramPoint} position of the link label
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
 */
DvtDiagramLayoutContextLink.prototype.getSelected = function() {
  return this._selected;
};


/**
 * Set the angle of rotation of the link label, relative to the label
 * rotation point, in radians.
 * @param {number} angle angle of rotation
 */
DvtDiagramLayoutContextLink.prototype.setLabelRotationAngle = function(angle) {
  this._labelRotAngle = angle;
};


/**
 * Get the angle of rotation of the link label, relative to the label
 * rotation point, in radians.
 * @return {number}
 */
DvtDiagramLayoutContextLink.prototype.getLabelRotationAngle = function() {
  return this._labelRotAngle;
};


/**
 * Set the point about which to rotate the link label, in the coordinate
 * system of the label.
 * @param {DvtDiagramPoint} point label rotation point
 */
DvtDiagramLayoutContextLink.prototype.setLabelRotationPoint = function(point) {
  this._labelRotPoint = point;
};


/**
 * Get the point about which to rotate the link label, in the coordinate
 * system of the label.
 * @return {DvtDiagramPoint}
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
 * @return {boolean}
 */
DvtDiagramLayoutContextLink.prototype.isPromoted = function() {
  return this._bPromoted;
};

/**
 * Sets the label valign
 * default is top
 * Only intended for JET Diagram
 * @param {string} valign values can include top, middle, bottom, and baseline
 */
DvtDiagramLayoutContextLink.prototype.setLabelValign = function(valign) {
  this._labelValign = valign;
};
/**
 * Sets the label halign
 * default depends on locale, left for LTR and right for RTL
 * Only intended for JET Diagram
 * @param {string} halign values can include left, right, and center
 */
DvtDiagramLayoutContextLink.prototype.setLabelHalign = function(halign) {
  this._labelHalign = halign;
};
/**
 * Gets the label valign
 * default is top
 * Only intended for JET Diagram
 * @return {string} values can include top, middle, bottom, and baseline
 */
DvtDiagramLayoutContextLink.prototype.getLabelValign = function() {
  return this._labelValign;
};
/**
 * Gets the label halign
 * default depends on locale, left for LTR and right for RTL
 * Only intended for JET Diagram
 * @return {string} values can include left, right, and center
 */
DvtDiagramLayoutContextLink.prototype.getLabelHalign = function() {
  return this._labelHalign;
};

/**
 * Set coordinate space for the link.
 * If the coordinate container id is specified, the link points will be applied relative to that container.
 * If the coordinate container id is not specified, the link points are in the global coordinate space.
 * @param {string} id coordinate container id for the link
 */
DvtDiagramLayoutContextLink.prototype.setCoordinateSpace = function(id) {
  this._coordinateContainerId = id;
};

/**
 * Get coordinate space for the link.
 * If the coordinate container id is specified, the link points will be applied relative to that container.
 * If the coordinate container id is not specified, the link points are in the global coordinate space.
 * @return {string} coordinate container id for the link
 */
DvtDiagramLayoutContextLink.prototype.getCoordinateSpace = function() {
  return this._coordinateContainerId;
};

/**
 * @protected
 * Set data for the link
 * @param {object|array} data a data object if the link is not promoted
 *                      an array of data objects for the links corresponding to the promoted link
 */
DvtDiagramLayoutContextLink.prototype.setData = function(data) {
  this._data = data;
};


/**
 * Gets data for the link. If the link is not promoted, the methods retrieves a data object for the link.
 * If the link is promoted, the methods retrieves an array of data objects for the links that are represented by
 * the promoted link.
 * @return {object|array} returns relevant data for the link
 */
DvtDiagramLayoutContextLink.prototype.getData = function() {
  return this._data;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * @protected
 * Defines the node context for a layout call.
 * @class DvtDiagramLayoutContextNode
 * @constructor
 * @param {DvtDiagramLayoutContextNode} node optional context to use for
 * initializing this context
 */
var DvtDiagramLayoutContextNode = function(node) {
  this.Init(node);
};

dvt.Obj.createSubclass(DvtDiagramLayoutContextNode, dvt.Obj, 'DvtDiagramLayoutContextNode');


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
  this._labelValign = node ? node._labelValign : null;
  this._labelHalign = node ? node._labelHalign : null;
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
  this.ContentOffset = new dvt.DiagramPoint(0, 0); //used by global layout for nodes inside container
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
 */
DvtDiagramLayoutContextNode.prototype.setPosition = function(pos) {
  this._position = pos;
  this._updateParentNodes(this);
};

/**
 * Get the position of the node.
 * @return {DvtDiagramPoint}
 */
DvtDiagramLayoutContextNode.prototype.getPosition = function() {
  return this._position;
};

/**
 * The method returns a relative position of the node to the specified ancestor container.
 * If the container id is null, the method returns global position of the node.
 * If the container id is not an ancestor id for the node, the method returns null.
 * @param {string} containerId ancestor id
 * @return {DvtDiagramPoint}
 */
DvtDiagramLayoutContextNode.prototype.getRelativePosition = function(containerId) {
  var layoutContext = this.LayoutContext;
  if (layoutContext) {
    //get position relative to the specified container
    var position = new dvt.DiagramPoint(0, 0);
    var node = this;
    var bFoundAncestor = false;
    while (node) {
      //ensure that parent node is rendered
      var parentId = node.getContainerId();
      if (parentId) {
        var parent = layoutContext.getNodeById(parentId);
        if (parent && this.Component && !parent.IsRendered)
          this.Component.renderNodeFromContext(parent);
      }
      //calculate relative position
      position['x'] += node.ContentOffset['x'] + node.getPosition()['x'];
      position['y'] += node.ContentOffset['y'] + node.getPosition()['y'];
      if (parentId != containerId) {
        node = layoutContext.getNodeById(parentId);
        if (node && node.isDisclosed()) {
          var containerPadding = node.getContainerPadding();
          if (containerPadding) {
            position['x'] += containerPadding['left'];
            position['y'] += containerPadding['top'];
          }
        }
        else {
          node = null;
        }
      }
      else {
        bFoundAncestor = true;
        node = null;
      }
    }
    if (!bFoundAncestor) {
      position = null;
    }
    return position;
  }
};

/**
 * Set the position of the node label.  The position is in the coordinate
 * system of the node's container.
 * @param {DvtDiagramPoint} pos position of the node label
 */
DvtDiagramLayoutContextNode.prototype.setLabelPosition = function(pos) {
  this._labelPosition = pos;
};


/**
 * Get the position of the node label.  The position is in the coordinate
 * system of the node's container.
 * @return {DvtDiagramPoint}
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
 */
DvtDiagramLayoutContextNode.prototype.getSelected = function() {
  return this._selected;
};


/**
 * Set the angle of rotation of the node label, relative to the label
 * rotation point, in radians.
 * @param {number} angle angle of rotation
 */
DvtDiagramLayoutContextNode.prototype.setLabelRotationAngle = function(angle) {
  this._labelRotAngle = angle;
};


/**
 * Get the angle of rotation of the node label, relative to the label
 * rotation point, in radians.
 * @return {number}
 */
DvtDiagramLayoutContextNode.prototype.getLabelRotationAngle = function() {
  return this._labelRotAngle;
};


/**
 * Set the point about which to rotate the node label, in the coordinate
 * system of the label.
 * @param {DvtDiagramPoint} point label rotation point
 */
DvtDiagramLayoutContextNode.prototype.setLabelRotationPoint = function(point) {
  this._labelRotPoint = point;
};


/**
 * Get the point about which to rotate the node label, in the coordinate
 * system of the label.
 * @return {DvtDiagramPoint}
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

    //this function is called by the dvt.Diagram when initializing the
    //layout context, so the original bounds already include the container
    //padding, and we need to subtract it out here
    if (obj) {
      if (this._origBounds) {
        this._origBounds = new dvt.DiagramRectangle(
            this._origBounds['x'], this._origBounds['y'],
            this._origBounds['w'] - (obj['left'] + obj['right']),
            this._origBounds['h'] - (obj['top'] + obj['bottom']));
      }
      if (this._origContentBounds) {
        this._origContentBounds = new dvt.DiagramRectangle(
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
      this._bounds = new dvt.DiagramRectangle(
          this._origBounds['x'], this._origBounds['y'],
          this._origBounds['w'] + left + right,
          this._origBounds['h'] + top + bottom);
    }
    if (this._origContentBounds) {
      this._contentBounds = new dvt.DiagramRectangle(
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

/**
 * Sets the label valign
 * default is top
 * Only intended for JET Diagram
 * @param {string} valign values can include top, middle, bottom, and baseline
 */
DvtDiagramLayoutContextNode.prototype.setLabelValign = function(valign) {
  this._labelValign = valign;
};
/**
 * Sets the label halign
 * default depends on locale, left for LTR and right for RTL
 * Only intended for JET Diagram
 * @param {string} halign values can include left, right, and center
 */
DvtDiagramLayoutContextNode.prototype.setLabelHalign = function(halign) {
  this._labelHalign = halign;
};
/**
 * Gets the label valign
 * default is top
 * Only intended for JET Diagram
 * @return {string} values can include top, middle, bottom, and baseline
 */
DvtDiagramLayoutContextNode.prototype.getLabelValign = function() {
  return this._labelValign;
};
/**
 * Gets the label halign
 * default depends on locale, left for LTR and right for RTL
 * Only intended for JET Diagram
 * @return {string} values can include left, right, and center
 */
DvtDiagramLayoutContextNode.prototype.getLabelHalign = function() {
  return this._labelHalign;
};

/**
 * @protected
 * Set data for the node
 * @param {object} data a data object for the node
 */
DvtDiagramLayoutContextNode.prototype.setData = function(data) {
  this._data = data;
};


/**
 * Gets data for the node.
 * @return {object|array} returns relevant data for the node
 */
DvtDiagramLayoutContextNode.prototype.getData = function() {
  return this._data;
};
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * Defines an (x,y) coordinate.
 * @class DvtDiagramPoint
 * @constructor
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 */
var DvtDiagramPoint = function(x, y) {
  this.Init(x, y);
};

dvt.Obj.createSubclass(DvtDiagramPoint, dvt.Obj, 'DvtDiagramPoint');


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
// Copyright (c) 2008, 2016, Oracle and/or its affiliates. All rights reserved.



/**
 * Defines the geometry of a rectangle. Top-left (x,y), and width and height.
 * @class DvtDiagramRectangle
 * @constructor
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 * @param {number} w width
 * @param {number} h height
 * @type {DvtDiagramRectangle}
 */
var DvtDiagramRectangle = function(x, y, w, h) {
  this.Init(x, y, w, h);
};

dvt.Obj.createSubclass(DvtDiagramRectangle, dvt.Obj, 'DvtDiagramRectangle');


/**
 * @protected
 * Initialize the rectangle.
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 * @param {number} w width
 * @param {number} h height
 */
DvtDiagramRectangle.prototype.Init = function(x, y, w, h) {
  this['x'] = ((x === null || isNaN(x)) ? 0 : x);
  this['y'] = ((y === null || isNaN(y)) ? 0 : y);
  this['w'] = ((w === null || isNaN(w)) ? 0 : w);
  this['h'] = ((h === null || isNaN(h)) ? 0 : h);
};
/**
 * Expose DvtDiagramPoint outside function wrapper via dvt.DiagramPoint
 */
dvt.DiagramPoint = DvtDiagramPoint;
/**
 * Expose DvtDiagramRectangle outside function wrapper via dvt.DiagramRectangle
 */
dvt.DiagramRectangle = DvtDiagramRectangle;
// Copyright (c) 2012, 2016, Oracle and/or its affiliates. All rights reserved.
dvt.ShapeAnimationUtils = {};

dvt.Obj.createSubclass(dvt.ShapeAnimationUtils, dvt.Obj);

dvt.ShapeAnimationUtils.transitionShapes = function(oldShape, newShape, anim) {
  /*if (oldShape instanceof dvt.Polyline && newShape instanceof dvt.Polyline) {
    dvt.ShapeAnimationUtils.TransitionPolylineToPolyline(oldShape, newShape, anim);
  }
  else if (oldShape instanceof dvt.Rect && newShape instanceof dvt.Rect) {
    dvt.ShapeAnimationUtils.TransitionRectToRect(oldShape, newShape, anim);
  }
  else*/ if (oldShape && newShape && oldShape instanceof dvt.Text && newShape instanceof dvt.Text) {
    dvt.ShapeAnimationUtils.TransitionTextToText(oldShape, newShape, anim);
  }
  else if (oldShape && newShape && oldShape instanceof dvt.Shape && newShape instanceof dvt.Shape) {
    dvt.ShapeAnimationUtils.TransitionShapeToShapeUsingPaths(oldShape, newShape, anim);
  }
  else if (oldShape && newShape) {
    dvt.ShapeAnimationUtils.TransitionShapeToShape(oldShape, newShape, anim);
  }
};

/*dvt.ShapeAnimationUtils.TransitionPolylineToPolyline = function(oldShape, newShape, anim) {
  dvt.ShapeAnimationUtils._transitionTranslate(oldShape, newShape, anim);

  //var oldPoints = oldShape.getPoints();

  var newPoints = newShape.getPoints();

  var oldLocalPoints = [];
  for (var i = 0; i < newPoints.length; i+=2) {
    var stagePt = newShape.localToStage(new dvt.Point(newPoints[i], newPoints[i+1]));
    var localPt = oldShape.stageToLocal(stagePt);
    oldLocalPoints.push(localPt.x);
    oldLocalPoints.push(localPt.y);
  }

  if (anim) {
    anim.addProp(dvt.Animator.TYPE_POLYLINE, oldShape, oldShape.getPoints, oldShape.setPoints, oldLocalPoints);
  }
};*/

/*dvt.ShapeAnimationUtils.TransitionRectToRect = function(oldShape, newShape, anim) {
  dvt.ShapeAnimationUtils._transitionTranslate(oldShape, newShape, anim);

  var oldTopLeft = new dvt.Point(oldShape.getX(), oldShape.getY());
  var oldBottomRight = new dvt.Point(oldShape.getX() + oldShape.getWidth(), oldShape.getY() + oldShape.getHeight());

  var newTopLeft = new dvt.Point(newShape.getX(), newShape.getY());
  var newBottomRight = new dvt.Point(newShape.getX() + newShape.getWidth(), newShape.getY() + newShape.getHeight());

  var oldStageTopLeft = oldShape.localToStage(oldTopLeft);
  var oldStageBottomRight = oldShape.localToStage(oldBottomRight);

  var newStageTopLeft = newShape.localToStage(newTopLeft);
  var newStageBottomRight = newShape.localToStage(newBottomRight);

  var oldLocalTopLeft = oldShape.stageToLocal(newStageTopLeft);
  var oldLocalBottomRight = oldShape.stageToLocal(newStageBottomRight);

  if (anim) {
    if (oldStageTopLeft.x != newStageTopLeft.x) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, oldShape, oldShape.getX, oldShape.setX, oldLocalTopLeft.x);
    }
    if (oldStageTopLeft.y != newStageTopLeft.y) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, oldShape, oldShape.getY, oldShape.setY, oldLocalTopLeft.y);
    }
    if (oldStageBottomRight.x != newStageBottomRight.x ||
        oldStageTopLeft.x != newStageTopLeft.x) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, oldShape, oldShape.getWidth, oldShape.setWidth, oldLocalBottomRight.x - oldLocalTopLeft.x);
    }
    if (oldStageBottomRight.y != newStageBottomRight.y ||
        oldStageTopLeft.y != newStageTopLeft.y) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, oldShape, oldShape.getHeight, oldShape.setHeight, oldLocalBottomRight.y - oldLocalTopLeft.y);
    }
  }
};*/

dvt.ShapeAnimationUtils.TransitionTextToText = function(oldShape, newShape, anim) {
  dvt.ShapeAnimationUtils._transitionMatrix(oldShape, newShape, anim);

  var oldFill = oldShape.getFill ? oldShape.getFill() : null;
  var newFill = newShape.getFill ? newShape.getFill() : null;

  if (anim) {
    if (oldShape.getX() != newShape.getX()) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, oldShape, oldShape.getX, oldShape.setX, newShape.getX());
    }
    if (oldShape.getY() != newShape.getY()) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, oldShape, oldShape.getY, oldShape.setY, newShape.getY());
    }

    if (oldFill && newFill && oldFill instanceof dvt.SolidFill && newFill instanceof dvt.SolidFill) {
      if (oldFill.getColor() != newFill.getColor()) {
        anim.addProp(dvt.Animator.TYPE_FILL, oldShape, oldShape.getFill, oldShape.setFill, newFill);
      }
    }
  }
};

dvt.ShapeAnimationUtils.TransitionShapeToShape = function(oldShape, newShape, anim) {
  var oldStageDims = oldShape.getDimensions(oldShape.getCtx().getStage());
  var newStageDims = newShape.getDimensions(newShape.getCtx().getStage());

  var oldFill = oldShape.getFill ? oldShape.getFill() : null;
  var newFill = newShape.getFill ? newShape.getFill() : null;

  var oldStroke = oldShape.getStroke ? oldShape.getStroke() : null;
  var newStroke = newShape.getStroke ? newShape.getStroke() : null;

  if (anim) {
    var deltaSx = 1;
    var deltaSy = 1;
    if (oldStageDims.w != newStageDims.w) {
      deltaSx = newStageDims.w / oldStageDims.w;
    }
    if (oldStageDims.h != newStageDims.h) {
      deltaSy = newStageDims.h / oldStageDims.h;
    }
    var deltaTx = 0;
    var deltaTy = 0;
    if (oldStageDims.x != newStageDims.x) {
      deltaTx = newStageDims.x - oldStageDims.x;
    }
    if (oldStageDims.y != newStageDims.y) {
      deltaTy = newStageDims.y - oldStageDims.y;
    }

    if (oldFill && newFill && oldFill instanceof dvt.SolidFill && newFill instanceof dvt.SolidFill) {
      if (oldFill.getColor() != newFill.getColor()) {
        anim.addProp(dvt.Animator.TYPE_FILL, oldShape, oldShape.getFill, oldShape.setFill, newFill);
      }
    }

    if (oldStroke && newStroke && oldStroke instanceof dvt.SolidStroke && newStroke instanceof dvt.SolidStroke) {
      if (oldStroke.getColor() != newStroke.getColor()) {
        anim.addProp(dvt.Animator.TYPE_STROKE, oldShape, oldShape.getStroke, oldShape.setStroke, newStroke);
      }
    }

    if (deltaTx != 0 || deltaTy != 0 || deltaSx != 1 || deltaSy != 1) {
      /*if (oldShape.getStroke) {
        var stroke = oldShape.getStroke();
        if (stroke) {
          stroke = stroke.clone();
          stroke.setFixedWidth(false);
          oldShape.setStroke(stroke);
        }
      }*/

      var deltaMat = new dvt.Matrix();
      //scale about the top left corner of the bounds
      deltaMat.translate(-oldStageDims.x, -oldStageDims.y);
      deltaMat.scale(deltaSx, deltaSy);
      deltaMat.translate(oldStageDims.x, oldStageDims.y);
      //now translate to the correct place
      deltaMat.translate(deltaTx, deltaTy);
      //apply the delta on top of the original matrix
      var newMat = oldShape.getMatrix().clone();
      newMat.concat(deltaMat);
      anim.addProp(dvt.Animator.TYPE_MATRIX, oldShape, oldShape.getMatrix, oldShape.setMatrix, newMat);
    }
  }
};

/*dvt.ShapeAnimationUtils._transitionTranslate = function(oldShape, newShape, anim) {
  var oldTranslate = new dvt.Point(oldShape.getTranslateX(), oldShape.getTranslateY());

  var newTranslate = new dvt.Point(newShape.getTranslateX(), newShape.getTranslateY());

  var oldStageTranslate = oldShape.getParent().localToStage(oldTranslate);

  var newStageTranslate = newShape.getParent().localToStage(newTranslate);

  var oldLocalTranslate = oldShape.getParent().stageToLocal(newStageTranslate);

  if (anim) {
    if (oldStageTranslate.x != newStageTranslate.x) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, oldShape, oldShape.getTranslateX, oldShape.setTranslateX, oldLocalTranslate.x);
    }
    if (oldStageTranslate.y != newStageTranslate.y) {
      anim.addProp(dvt.Animator.TYPE_NUMBER, oldShape, oldShape.getTranslateY, oldShape.setTranslateY, oldLocalTranslate.y);
    }
  }
};*/

dvt.ShapeAnimationUtils._transitionMatrix = function(oldShape, newShape, anim) {
  if (anim) {
    var oldMatrix = dvt.ShapeAnimationUtils._getCurrentTransformationMatrix(oldShape);
    var newMatrix = dvt.ShapeAnimationUtils._getCurrentTransformationMatrix(newShape);

    if (!oldMatrix.equals(newMatrix)) {
      //invert the parent's CTM to determine the matrix that must be applied to the shape itself
      var parentMat = dvt.ShapeAnimationUtils._getCurrentTransformationMatrix(oldShape.getParent());
      parentMat.invert();
      newMatrix.concat(parentMat);
      anim.addProp(dvt.Animator.TYPE_MATRIX, oldShape, oldShape.getMatrix, oldShape.setMatrix, newMatrix);
    }
  }
};

dvt.ShapeAnimationUtils._getCurrentTransformationMatrix = function(displayable) {
  var arDisp = [displayable];
  var parent = displayable.getParent();
  while (parent) {
    arDisp.push(parent);
    parent = parent.getParent();
  }
  var ctm = new dvt.Matrix();
  for (var i = 0; i < arDisp.length; i++) {
    var disp = arDisp[i];
    ctm.concat(disp.getMatrix());
  }
  return ctm;
};


/**
 * @protected
 * Transition the shapes by converting them to paths.
 */
dvt.ShapeAnimationUtils.TransitionShapeToShapeUsingPaths = function(oldShape, newShape, anim) {
  var oldPath = dvt.ShapeAnimationUtils._convertShapeToPath(oldShape);
  var newPath = dvt.ShapeAnimationUtils._convertShapeToPath(newShape);
  //if the shape couldn't be converted to a path, transition it normally
  if (!oldPath || !newPath) {
    dvt.ShapeAnimationUtils.TransitionShapeToShape(oldShape, newShape, anim);
    return;
  }
  //if the path is different from the original shape, replace the shape with the path
  if (oldShape != oldPath) {
    dvt.ShapeAnimationUtils._replaceShape(oldShape, oldPath);
    oldShape = oldPath;
  }

  //don't transition the matrix because _assimilatePaths will transform the path coords instead so that
  //we're transitioning directly to user coords (to avoid case like switching from bar to tmap, where
  //tmap is so big and scaled down so much the shapes initially fly offscreen until the matrix transition
  //can scale it down far enough to bring them back into view)
  //dvt.ShapeAnimationUtils._transitionMatrix(oldShape, newShape, anim);

  var oldFill = oldShape.getFill ? oldShape.getFill() : null;
  var newFill = newShape.getFill ? newShape.getFill() : null;

  if (anim) {
    if (oldFill && newFill && oldFill instanceof dvt.SolidFill && newFill instanceof dvt.SolidFill) {
      if (oldFill.getColor() != newFill.getColor()) {
        anim.addProp(dvt.Animator.TYPE_FILL, oldShape, oldShape.getFill, oldShape.setFill, newFill);
      }
    }

    //need to pass in newCTM because the newPath passed in here may not be attached to the stage
    var newCTM = dvt.ShapeAnimationUtils._getCurrentTransformationMatrix(newShape);
    //make the paths compatible for animating
    dvt.ShapeAnimationUtils._assimilatePaths(oldShape, newPath, anim, newCTM);
  }
};


/**
 * @private
 * Convert the shape to a path.
 */
dvt.ShapeAnimationUtils._convertShapeToPath = function(shape) {
  if (shape instanceof dvt.Path) {
    return shape;
  }
  else {
    var points = dvt.ShapeAnimationUtils._getPathPoints(shape);
    if (points) {
      var path = new dvt.Path(shape.getCtx(), points);
      return path;
    }
  }
  return null;
};


/**
 * @private
 * Replace the old shape with the new one.
 */
dvt.ShapeAnimationUtils._replaceShape = function(oldShape, newShape) {
  var fill = oldShape.getFill();
  var stroke = oldShape.getStroke();
  var mat = oldShape.getMatrix();
  var childIndex = oldShape.getParent().getChildIndex(oldShape);
  oldShape.getParent().addChildAt(newShape, childIndex);
  oldShape.setFill(null);
  oldShape.setStroke(null);
  oldShape.setMatrix(null);
  newShape.setFill(fill);
  newShape.setStroke(stroke);
  newShape.setMatrix(mat);
  var numChildren = oldShape.getNumChildren();
  for (var i = 0; i < numChildren; i++) {
    newShape.addChild(oldShape.getChildAt(0));
  }
  oldShape.getParent().removeChild(oldShape);
  if (oldShape.destroy) {
    oldShape.destroy();
  }
};


/**
 * @private
 * Get the path points to represent the given shape.
 */
dvt.ShapeAnimationUtils._getPathPoints = function(shape) {
  var arPoints;
  if (shape instanceof dvt.Rect) {
    var rx = shape.getRx();
    var ry = shape.getRy();
    var x = shape.getX();
    var y = shape.getY();
    var w = shape.getWidth();
    var h = shape.getHeight();
    if (rx && ry) {
      var angleExtent = .5 * Math.PI;

      //taken from http://en.wikipedia.org/wiki/B%C3%A9zier_spline
      //unit circle at origin can be composed from arbitrary number of cubic Bezier curves.
      //Arc starts at point A and ends at point B, where A is at angle phi above x-axis, and B is at angle -phi
      //below x-axis.

      //points on unit circle
      var ax = Math.cos(.5 * angleExtent);
      var ay = Math.sin(.5 * angleExtent);
      var bx = ax;
      var by = -ay;
      //control points
      var cax = (4 - ax) / 3;
      var cay = (1 - ax) * (3 - ax) / (3 * ay);
      var cbx = cax;
      var cby = -cay;

      var pointA = new dvt.Point(ax, ay);
      var pointB = new dvt.Point(bx, by);
      var pointCA = new dvt.Point(cax, cay);
      var pointCB = new dvt.Point(cbx, cby);

      var mat = new dvt.Matrix();
      //rotate arc to current angle
      mat.rotate(.5 * angleExtent);
      //scale by radius in each direction
      mat.scale(rx, ry);

      var cpa = mat.transformPoint(pointCA);
      var cpb = mat.transformPoint(pointCB);

      var cx = x + w - rx;
      var cy = y + ry;
      arPoints = ['M', x + rx, y, 'L', x + w - rx, y, 'C', cx + cpa.x, cy - cpa.y, cx + cpb.x, cy - cpb.y, x + w, y + ry];
      cy = y + h - ry;
      arPoints.push('L', x + w, y + h - ry, 'C', cx + cpb.x, cy + cpb.y, cx + cpa.x, cy + cpa.y, x + w - rx, y + h);
      cx = x + rx;
      arPoints.push('L', x + rx, y + h, 'C', cx - cpa.x, cy + cpa.y, cx - cpb.x, cy + cpb.y, x, y + h - ry);
      cy = y + ry;
      arPoints.push('L', x, y + ry, 'C', cx - cpb.x, cy - cpb.y, cx - cpa.x, cy - cpa.y, x + rx, y, 'Z');
    }
    else {
      arPoints = ['M', x, y, 'L', x + w, y, 'L', x + w, y + h, 'L', x, y + h, 'Z'];
    }
  }
  else if (shape instanceof dvt.Polyline || shape instanceof dvt.Polygon) {
    var points = shape.getPoints();
    if (points) {
      arPoints = [];
      for (var i = 0; i < points.length; i += 2) {
        if (i == 0) {
          arPoints.push('M', points[i], points[i + 1]);
        }
        else {
          arPoints.push('L', points[i], points[i + 1]);
        }
      }
      if (shape instanceof dvt.Polygon) {
        arPoints.push('Z');
      }
    }
  }
  else if (shape instanceof dvt.Line) {
    arPoints = ['M', shape.getX1(), shape.getY1(), 'L', shape.getX2(), shape.getY2()];
  }
  else if (shape instanceof dvt.Circle) {
    var cx = shape.getCx();
    var cy = shape.getCy();
    var rx = 0;
    var ry = 0;
    if (shape instanceof dvt.Oval) {
      rx = shape.getRx();
      ry = shape.getRy();
    }
    else {
      rx = shape.getRadius();
      ry = rx;
    }
    //    arPoints = ["M", cx, cy-ry,                //start at top
    //                "Q", cx+rx, cy-ry, cx+rx, cy,  //top right quadrant
    //                "Q", cx+rx, cy+ry, cx, cy+ry,  //bottom right quadrant
    //                "Q", cx-rx, cy+ry, cx-rx, cy,  //bottom left quadrant
    //                "Q", cx-rx, cy-ry, cx, cy-ry]; //top left quadrant

    var numCurves = 4;
    var startAngle = -.5 * Math.PI;
    var angleExtent = 2 * Math.PI / numCurves;

    //taken from http://en.wikipedia.org/wiki/B%C3%A9zier_spline
    //unit circle at origin can be composed from arbitrary number of cubic Bezier curves.
    //Arc starts at point A and ends at point B, where A is at angle phi above x-axis, and B is at angle -phi
    //below x-axis.

    //points on unit circle
    var ax = Math.cos(.5 * angleExtent);
    var ay = Math.sin(.5 * angleExtent);
    var bx = ax;
    var by = -ay;
    //control points
    var cax = (4 - ax) / 3;
    var cay = (1 - ax) * (3 - ax) / (3 * ay);
    var cbx = cax;
    var cby = -cay;

    var pointA = new dvt.Point(ax, ay);
    var pointB = new dvt.Point(bx, by);
    var pointCA = new dvt.Point(cax, cay);
    var pointCB = new dvt.Point(cbx, cby);

    arPoints = [];
    for (var i = 0; i < numCurves; i++) {
      var mat = new dvt.Matrix();
      //rotate arc to current angle
      mat.rotate(startAngle + i * angleExtent);
      //scale by radius in each direction
      mat.scale(rx, ry);

      //because we want to draw the path in user's clockwise direction, treat B as the starting point and A as the ending point
      if (i == 0) {
        var startPoint = mat.transformPoint(pointB);
        //translate by center point
        arPoints.push('M', cx + startPoint.x, cy + startPoint.y);
      }

      var controlPoint1 = mat.transformPoint(pointCB);
      var controlPoint2 = mat.transformPoint(pointCA);
      var endPoint = mat.transformPoint(pointA);
      //translate by center point
      arPoints.push('C', cx + controlPoint1.x, cy + controlPoint1.y, cx + controlPoint2.x, cy + controlPoint2.y, cx + endPoint.x, cy + endPoint.y);
    }
    arPoints.push('Z');
  }
  else if (shape instanceof dvt.Arc) {
    //copied from DvtSvgArc._createArc()
    var sa = (shape.getAngleStart() * dvt.Math.RADS_PER_DEGREE);
    var ae = (shape.getAngleExtent() * dvt.Math.RADS_PER_DEGREE);

    var x1 = shape.getCx() + (shape.getRx() * Math.cos(sa));        // get arc
    var y1 = shape.getCy() - (shape.getRy() * Math.sin(sa));        // end points
    var x2 = shape.getCx() + (shape.getRx() * Math.cos(sa + ae));
    var y2 = shape.getCy() - (shape.getRy() * Math.sin(sa + ae));

    var nLargeArc = (Math.abs(shape.getAngleExtent()) > 180) ? '1' : '0';
    var nSweepFlag = (shape.getAngleExtent() > 0) ? '0' : '1';     // 0 == svg +ve angle

    arPoints = ['M', x1, y1, 'A', shape.getRx(), shape.getRy(), '0', nLargeArc, nSweepFlag, x2, y2];
    if (shape.getClosure() === dvt.Arc.CHORD) {
      arPoints.push('Z');
    }
    else if (shape.getClosure() === dvt.Arc.PIE) {
      arPoints.push('L', shape.getCx(), shape.getCy(), 'Z');
    }
  }

  return arPoints;
};


/**
 * @private
 * Get the index of the next drawing command in the path.
 */
dvt.ShapeAnimationUtils._getNextCommandIndex = function(arPoints, index) {
  while (index < arPoints.length) {
    if (isNaN(arPoints[index])) {
      break;
    }
    index++;
  }
  return index;
};


/**
 * @private
 * Get the index of the previous drawing command in the path.
 */
dvt.ShapeAnimationUtils._getPrevCommandIndex = function(arPoints, index) {
  while (index > -1) {
    if (isNaN(arPoints[index])) {
      break;
    }
    index--;
  }
  return index;
};


/**
 * @private
 * Count the number of  drawing commands in the path.
 */
dvt.ShapeAnimationUtils._countCommands = function(arPoints) {
  var count = 0;
  for (var i = 0; i < arPoints.length; i++) {
    if (isNaN(arPoints[i])) {
      count++;
    }
  }
  return count;
};


/**
 * Make paths contain the same number of commands by interspersing additional dummy commands
 * uniformly throughout the shorter path.
 */
dvt.ShapeAnimationUtils._makePathsSameLength = function(oldPoints, newPoints) {
  var oldCommandCount = dvt.ShapeAnimationUtils._countCommands(oldPoints);
  var newCommandCount = dvt.ShapeAnimationUtils._countCommands(newPoints);
  if (oldCommandCount != newCommandCount) {
    var diffCommandCount = 0;
    var shortCommandCount = 0;
    var longCommandCount = 0;
    var shortPathPoints;
    var longPathPoints;

    if (oldCommandCount > newCommandCount) {
      diffCommandCount = oldCommandCount - newCommandCount;
      shortCommandCount = newCommandCount;
      longCommandCount = oldCommandCount;
      shortPathPoints = newPoints;
      longPathPoints = oldPoints;
    }
    else {
      diffCommandCount = newCommandCount - oldCommandCount;
      shortCommandCount = oldCommandCount;
      longCommandCount = newCommandCount;
      shortPathPoints = oldPoints;
      longPathPoints = newPoints;
    }

    //determine the number of commands in the interval between insertions
    var insertInterval = Math.floor(shortCommandCount / diffCommandCount);
    if (insertInterval < 1) {
      insertInterval = 1;
    }
    //determine the number of commands to insert each time
    var commandsPerInsert = Math.floor(diffCommandCount / shortCommandCount);
    if (commandsPerInsert < 1) {
      commandsPerInsert = 1;
    }
    //start at -1 to skip the initial "M"
    var commandCount = -1;
    for (var i = 0; i < shortPathPoints.length; i++) {
      if (isNaN(shortPathPoints[i])) {
        //if we're at the insertion point, insert commands before the current command
        //and reset the command count
        if (commandCount == insertInterval) {
          commandCount = 0;

          for (var j = 0; j < commandsPerInsert; j++) {
            //increment i because we're inserting before the current command
            shortPathPoints.splice(i++, 0, 'tmp');
            diffCommandCount--;
          }
        }

        //always increment the command count, even if it was reset above
        commandCount++;
      }
    }
    //insert any leftover commands at the end
    for (var i = 0; i < diffCommandCount; i++) {
      if (shortPathPoints[shortPathPoints.length - 1] == 'Z') {
        shortPathPoints.splice(shortPathPoints.length - 1, 0, 'tmp');
      }
      else {
        shortPathPoints.push('tmp');
      }
    }
  }
};


/**
 * @private
 * If the path is closed, replace Z with an explicit L, so that we can animate that segment.
 */
dvt.ShapeAnimationUtils._modifyClosePath = function(points) {
  if (points.length > 2 && points[points.length - 1] == 'Z') {
    points.splice(points.length - 1, 1);
    points.push('L', points[1], points[2]);
    return true;
  }
  return false;
};


/**
 * @private
 * Assimilate the old and new paths to make them compatible for animating.
 */
dvt.ShapeAnimationUtils._assimilatePaths = function(oldShape, newShape, anim, newCTM) {
  var obj = dvt.ShapeAnimationUtils.getAssimilatedPaths(oldShape.getCommands(), newShape.getCommands());

  //transform path to account for CTM
  var oldMatrix = dvt.ShapeAnimationUtils._getCurrentTransformationMatrix(oldShape);
  if (oldMatrix) {
    dvt.ShapeAnimationUtils._transformPathCoords(obj.updatedOldPath, oldMatrix);
  }
  //clear old matrix because we've transformed the points
  oldShape.setMatrix(null);
  //need to pass in newCTM because the newShape passed in here may not be attached to the stage
  var newMatrix = newCTM;
  if (newMatrix) {
    dvt.ShapeAnimationUtils._transformPathCoords(obj.updatedNewPath, newMatrix);
  }

  //immediately update the old path with the old assimilated points
  oldShape.setCommands(obj.updatedOldPath);
  //animate the transition to the new assimilated points
  anim.addProp(dvt.Animator.TYPE_PATH, oldShape, oldShape.getCommands, oldShape.setCommands, obj.updatedNewPath);
};


/**
 * Get path commands that are compatible for animating.
 *
 * @param {array}  oldPathCommands  Array of old path commands and coordinates.
 * @param {array}  newPathCommands  Array of new path commands and coordinates.
 * @type {object}
 * @return An object with two fields: updatedOldPath - array of assimilated old path commands and coordinates,
 *          updatedNewPath - array of assimilated new path commands and coordinates.
 */
dvt.ShapeAnimationUtils.getAssimilatedPaths = function(oldPathCommands, newPathCommands) {
  var oldPoints = dvt.ArrayUtils.copy(oldPathCommands);
  var newPoints = dvt.ArrayUtils.copy(newPathCommands);
  //assimilated new path
  var updatedNewPoints = [];
  //assimilated old path
  var updatedOldPoints = [];

  //insert drawing command between concatenated coords
  dvt.ShapeAnimationUtils._makeImplicitCommandsExplicit(oldPoints);
  dvt.ShapeAnimationUtils._makeImplicitCommandsExplicit(newPoints);
  //turn lowercase relative commands into uppercase absolute commands
  dvt.ShapeAnimationUtils._makeRelativeCommandsAbsolute(oldPoints);
  dvt.ShapeAnimationUtils._makeRelativeCommandsAbsolute(newPoints);
  //turn H and V into L
  dvt.ShapeAnimationUtils._makeShorthandCommandsVerbose(oldPoints);
  dvt.ShapeAnimationUtils._makeShorthandCommandsVerbose(newPoints);

  //make sure each closed subpath starts with M
  dvt.ShapeAnimationUtils._makeSubpathsExplicit(oldPoints);
  dvt.ShapeAnimationUtils._makeSubpathsExplicit(newPoints);

  //break the paths down into subpaths and process them by pairs
  var oldSubpaths = dvt.ShapeAnimationUtils._breakIntoSubpaths(oldPoints);
  var newSubpaths = dvt.ShapeAnimationUtils._breakIntoSubpaths(newPoints);
  //sort subpaths in order of decreasing length
  dvt.ShapeAnimationUtils._sortSubpaths(oldSubpaths);
  dvt.ShapeAnimationUtils._sortSubpaths(newSubpaths);
  for (var i = 0; i < Math.max(oldSubpaths.length, newSubpaths.length); i++) {
    var subpathUpdatedOldPoints = [];
    var subpathUpdatedNewPoints = [];
    var subpathOldPoints = null;
    var subpathNewPoints = null;
    //if one of the paths has fewer subpaths, treat the missing ones like empty subpaths
    if (i < oldSubpaths.length) {
      subpathOldPoints = oldSubpaths[i];
    }
    else {
      //start empty subpath at start of first subpath
      subpathOldPoints = ['M', oldPoints[1], oldPoints[2]];
      //close empty subpath if analog subpath is closed
      if (newSubpaths[i][newSubpaths[i].length - 1] == 'Z') {
        subpathOldPoints.push('Z');
      }
    }
    if (i < newSubpaths.length) {
      subpathNewPoints = newSubpaths[i];
    }
    else {
      //start empty subpath at start of first subpath
      subpathNewPoints = ['M', newPoints[1], newPoints[2]];
      //close empty subpath if analog subpath is closed
      if (oldSubpaths[i][oldSubpaths[i].length - 1] == 'Z') {
        subpathNewPoints.push('Z');
      }
    }
    dvt.ShapeAnimationUtils._assimilateSubpaths(subpathOldPoints, subpathNewPoints, subpathUpdatedOldPoints, subpathUpdatedNewPoints);

    //add the updated subpaths to the results
    updatedOldPoints = updatedOldPoints.concat(subpathUpdatedOldPoints);
    updatedNewPoints = updatedNewPoints.concat(subpathUpdatedNewPoints);
  }

  return {updatedOldPath: updatedOldPoints, updatedNewPath: updatedNewPoints};
};


/**
 * @private
 * Break a path down into subpaths.
 */
dvt.ShapeAnimationUtils._breakIntoSubpaths = function(points) {
  var ar = [];
  var startIndex = 0;
  //start at index 1 in order to skip the leading M
  for (var i = 1; i < points.length; i++) {
    if (points[i] == 'M' || points[i] == 'm') {
      ar.push(points.slice(startIndex, i));
      startIndex = i;
    }
  }
  //if no closed subpaths were found, use the original array
  if (ar.length < 1) {
    ar.push(points);
  }
  //push the last subpath
  else if (startIndex < points.length) {
    ar.push(points.slice(startIndex));
  }
  return ar;
};


/**
 * @private
 * Sort subpaths in order of decreasing length.
 */
dvt.ShapeAnimationUtils._sortSubpaths = function(arSubpaths) {
  arSubpaths.sort(dvt.ShapeAnimationUtils._compareSubpaths);
};


/**
 * @private
 * Comparison function for sorting subpaths in order of decreasing length.
 */
dvt.ShapeAnimationUtils._compareSubpaths = function(subpath1, subpath2) {
  var length1 = dvt.ShapeAnimationUtils._calcSubpathLength(subpath1);
  var length2 = dvt.ShapeAnimationUtils._calcSubpathLength(subpath2);
  if (length1 > length2) {
    return -1;
  }
  if (length2 > length1) {
    return 1;
  }
  return 0;
};


/**
 * @private
 * Calculate the length of a subpath.
 */
dvt.ShapeAnimationUtils._calcSubpathLength = function(points) {
  var currX = 0;
  var currY = 0;
  var prevX = 0;
  var prevY = 0;
  var startX = 0;
  var startY = 0;
  var totalLength = 0;
  for (var i = 0; i < points.length; ) {
    var command = points[i];
    switch (command) {
      case 'M':
        startX = points[i + 1];
        startY = points[i + 2];
        break;
      case 'L':
        currX = points[i + 1];
        currY = points[i + 2];
        break;
      case 'C':
        currX = points[i + 5];
        currY = points[i + 6];
        break;
      case 'Q':
        currX = points[i + 3];
        currY = points[i + 4];
        break;
      case 'A':
        currX = points[i + 6];
        currY = points[i + 7];
        break;
      case 'Z':
        currX = startX;
        currY = startY;
        break;

      default:
        break;
    }

    totalLength += Math.sqrt((currX - prevX) * (currX - prevX) + (currY - prevY) * (currY - prevY));

    i = dvt.ShapeAnimationUtils._getNextCommandIndex(points, i + 1);
    prevX = currX;
    prevY = currY;
  }
  return totalLength;
};


/**
 * @private
 * Assimilate old and new subpaths to make them compatible for animating.
 */
dvt.ShapeAnimationUtils._assimilateSubpaths = function(oldPoints, newPoints, updatedOldPoints, updatedNewPoints) {
  //turn ending Z command into L so that we can animate the L segment
  var bModCloseOld = dvt.ShapeAnimationUtils._modifyClosePath(oldPoints);
  var bModCloseNew = dvt.ShapeAnimationUtils._modifyClosePath(newPoints);

  //make closed paths start at top left corner (to user's eye)
  //make paths proceed in clockwise direction (to user's eye)
  if (bModCloseOld || (oldPoints[oldPoints.length - 2] == oldPoints[1] && oldPoints[oldPoints.length - 1] == oldPoints[2])) {
    oldPoints = dvt.ShapeAnimationUtils._makePathStartAtTopLeft(oldPoints);
    oldPoints = dvt.ShapeAnimationUtils._makePathClockwise(oldPoints);
  }
  if (bModCloseNew || (newPoints[newPoints.length - 2] == newPoints[1] && newPoints[newPoints.length - 1] == newPoints[2])) {
    newPoints = dvt.ShapeAnimationUtils._makePathStartAtTopLeft(newPoints);
    newPoints = dvt.ShapeAnimationUtils._makePathClockwise(newPoints);
  }

  //make paths contain the same number of commands
  dvt.ShapeAnimationUtils._makePathsSameLength(oldPoints, newPoints);

  dvt.ShapeAnimationUtils._assimilatePathCommands(oldPoints, newPoints, updatedOldPoints, updatedNewPoints);

  //re-add Z after assimilating subpaths, if necessary
  if (bModCloseOld) {
    oldPoints.push('Z');
  }
  if (bModCloseNew) {
    newPoints.push('Z');
  }
};


/**
 * @private
 * Assimilate old and new path commands to make them compatible for animating.
 */
dvt.ShapeAnimationUtils._assimilatePathCommands = function(oldPoints, newPoints, updatedOldPoints, updatedNewPoints) {
  var iOld = 0;
  var iNew = 0;
  //previous point on old path
  var prevOldX = 0;
  var prevOldY = 0;
  //previous point on new path
  var prevNewX = 0;
  var prevNewY = 0;

  //flags for whether the paths need to be closed
  var bCloseNew = false;
  var bCloseOld = false;

  while (iOld > -1 || iNew > -1) {
    var oldCommand = iOld > -1 ? oldPoints[iOld] : null;
    var newCommand = iNew > -1 ? newPoints[iNew] : null;

    var iNextOld = iOld > -1 ? dvt.ShapeAnimationUtils._getNextCommandIndex(oldPoints, iOld + 1) : -1;
    var iNextNew = iNew > -1 ? dvt.ShapeAnimationUtils._getNextCommandIndex(newPoints, iNew + 1) : -1;

    //if the drawing commands are the same, just copy the points from the original path to the assimilated path
    if (oldCommand == newCommand) {
      for (var i = iNew; i < iNextNew; i++) {
        updatedNewPoints.push(newPoints[i]);
      }
      for (var i = iOld; i < iNextOld; i++) {
        updatedOldPoints.push(oldPoints[i]);
      }
    }
    //if the new path is longer than the old one, or if we've included a dummy command, pad out the old assimilated path
    else if (!oldCommand || oldCommand == 'tmp') {
      if (newCommand == 'L') {
        updatedNewPoints.push('L', newPoints[iNew + 1], newPoints[iNew + 2]);
        updatedOldPoints.push('L', prevOldX, prevOldY);
      }
      else if (newCommand == 'Q') {
        updatedNewPoints.push('Q', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4]);
        updatedOldPoints.push('Q', prevOldX, prevOldY, prevOldX, prevOldY);
      }
      else if (newCommand == 'C') {
        updatedNewPoints.push('C', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], newPoints[iNew + 6]);
        updatedOldPoints.push('C', prevOldX, prevOldY, prevOldX, prevOldY, prevOldX, prevOldY);
      }
      else if (newCommand == 'A') {
        updatedNewPoints.push('A', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], newPoints[iNew + 6], newPoints[iNew + 7]);
        updatedOldPoints.push('A', 0, 0, newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], prevOldX, prevOldY);
      }
      else if (newCommand == 'Z') {
        updatedNewPoints.push('Z');
        updatedOldPoints.push('Z');
      }
    }
    //if the old path is longer than the new one, or if we've included a dummy command, pad out the new assimilated path
    else if (!newCommand || newCommand == 'tmp') {
      if (oldCommand == 'L') {
        updatedNewPoints.push('L', prevNewX, prevNewY);
        updatedOldPoints.push('L', oldPoints[iOld + 1], oldPoints[iOld + 2]);
      }
      else if (oldCommand == 'Q') {
        updatedNewPoints.push('Q', prevNewX, prevNewY, prevNewX, prevNewY);
        updatedOldPoints.push('Q', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4]);
      }
      else if (oldCommand == 'C') {
        updatedNewPoints.push('C', prevNewX, prevNewY, prevNewX, prevNewY, prevNewX, prevNewY);
        updatedOldPoints.push('C', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], oldPoints[iOld + 6]);
      }
      else if (oldCommand == 'A') {
        updatedNewPoints.push('A', 0, 0, oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], prevNewX, prevNewY);
        updatedOldPoints.push('A', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], oldPoints[iOld + 6], oldPoints[iOld + 7]);
      }
      else if (oldCommand == 'Z') {
        updatedNewPoints.push('Z');
        updatedOldPoints.push('Z');
      }
    }
    //if the drawing commands are different, convert them to like, equivalent commands
    else {
      if (oldCommand == 'L') {
        if (newCommand == 'Q') {
          updatedNewPoints.push('Q', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4]);
          //flatten the curve using a control point at the center of the line
          updatedOldPoints.push('Q', prevOldX + .5 * (oldPoints[iOld + 1] - prevOldX), prevOldY + .5 * (oldPoints[iOld + 2] - prevOldY), oldPoints[iOld + 1], oldPoints[iOld + 2]);
        }
        else if (newCommand == 'C') {
          updatedNewPoints.push('C', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], newPoints[iNew + 6]);
          //flatten the curve using two control points at the center of the line
          updatedOldPoints.push('C', prevOldX + .5 * (oldPoints[iOld + 1] - prevOldX), prevOldY + .5 * (oldPoints[iOld + 2] - prevOldY),
                                prevOldX + .5 * (oldPoints[iOld + 1] - prevOldX), prevOldY + .5 * (oldPoints[iOld + 2] - prevOldY),
                                oldPoints[iOld + 1], oldPoints[iOld + 2]);
        }
        else if (newCommand == 'A') {
          //hard to map from L to A, so instead treat as two subpaths, L and A
          updatedNewPoints.push('L', prevNewX, prevNewY,
              'A', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], newPoints[iNew + 6], newPoints[iNew + 7]);
          updatedOldPoints.push('L', oldPoints[iOld + 1], oldPoints[iOld + 2],
                                'A', 0, 0, newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], oldPoints[iOld + 1], oldPoints[iOld + 2]);
        }
        else if (newCommand == 'Z') {
          bCloseNew = true;
          updatedNewPoints.push('L', prevNewX, prevNewY);
          updatedOldPoints.push('L', oldPoints[iOld + 1], oldPoints[iOld + 2]);
        }
      }
      else if (oldCommand == 'Q') {
        if (newCommand == 'L') {
          //flatten the curve using a control point at the center of the line
          updatedNewPoints.push('Q', prevNewX + .5 * (newPoints[iNew + 1] - prevNewX), prevNewY + .5 * (newPoints[iNew + 2] - prevNewY), newPoints[iNew + 1], newPoints[iNew + 2]);
          updatedOldPoints.push('Q', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4]);
        }
        else if (newCommand == 'C') {
          updatedNewPoints.push('C', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], newPoints[iNew + 6]);
          //make both cubic control points coincide with single quadratic control point
          updatedOldPoints.push('C', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4]);
        }
        else if (newCommand == 'A') {
          //hard to map from Q to A, so instead treat as two subpaths, Q and A
          updatedNewPoints.push('Q', prevNewX, prevNewY, prevNewX, prevNewY,
              'A', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], newPoints[iNew + 6], newPoints[iNew + 7]);
          updatedOldPoints.push('Q', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4],
                                'A', 0, 0, newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], oldPoints[iOld + 3], oldPoints[iOld + 4]);
        }
        else if (newCommand == 'Z') {
          bCloseNew = true;
          updatedNewPoints.push('Q', prevNewX, prevNewY, prevNewX, prevNewY);
          updatedOldPoints.push('Q', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4]);
        }
      }
      else if (oldCommand == 'C') {
        if (newCommand == 'L') {
          //flatten the curve using two control points at the center of the line
          updatedNewPoints.push('C', prevNewX + .5 * (newPoints[iNew + 1] - prevNewX), prevNewY + .5 * (newPoints[iNew + 2] - prevNewY),
              prevNewX + .5 * (newPoints[iNew + 1] - prevNewX), prevNewY + .5 * (newPoints[iNew + 2] - prevNewY),
              newPoints[iNew + 1], newPoints[iNew + 2]);
          updatedOldPoints.push('C', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], oldPoints[iOld + 6]);
        }
        else if (newCommand == 'Q') {
          //make both cubic control points coincide with single quadratic control point
          updatedNewPoints.push('C', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4]);
          updatedOldPoints.push('C', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], oldPoints[iOld + 6]);
        }
        else if (newCommand == 'A') {
          //hard to map from C to A, so instead treat as two subpaths, C and A
          updatedNewPoints.push('C', prevNewX, prevNewY, prevNewX, prevNewY, prevNewX, prevNewY,
              'A', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], newPoints[iNew + 6], newPoints[iNew + 7]);
          updatedOldPoints.push('C', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], oldPoints[iOld + 6],
                                'A', 0, 0, newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], oldPoints[iOld + 5], oldPoints[iOld + 6]);
        }
        else if (newCommand == 'Z') {
          bCloseNew = true;
          updatedNewPoints.push('C', prevNewX, prevNewY, prevNewX, prevNewY, prevNewX, prevNewY);
          updatedOldPoints.push('C', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], oldPoints[iOld + 6]);
        }
      }
      else if (oldCommand == 'A') {
        if (newCommand == 'L') {
          //hard to map from A to L, so instead treat as two subpaths, A and L
          updatedNewPoints.push('L', newPoints[iNew + 1], newPoints[iNew + 2],
              'A', 0, 0, oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], newPoints[iNew + 1], newPoints[iNew + 2]);
          updatedOldPoints.push('L', prevOldX, prevOldY,
                                'A', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], oldPoints[iOld + 6], oldPoints[iOld + 7]);
        }
        else if (newCommand == 'Q') {
          //hard to map from A to Q, so instead treat as two subpaths, A and Q
          updatedNewPoints.push('Q', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4],
              'A', 0, 0, oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], newPoints[iNew + 3], newPoints[iNew + 4]);
          updatedOldPoints.push('Q', prevOldX, prevOldY, prevOldX, prevOldY,
                                'A', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], oldPoints[iOld + 6], oldPoints[iOld + 7]);
        }
        else if (newCommand == 'C') {
          //hard to map from A to C, so instead treat as two subpaths, A and C
          updatedNewPoints.push('C', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], newPoints[iNew + 6],
              'A', 0, 0, oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], newPoints[iNew + 5], newPoints[iNew + 6]);
          updatedOldPoints.push('C', prevOldX, prevOldY, prevOldX, prevOldY, prevOldX, prevOldY,
                                'A', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], oldPoints[iOld + 6], oldPoints[iOld + 7]);
        }
        else if (newCommand == 'Z') {
          bCloseNew = true;
          updatedNewPoints.push('A', 0, 0, oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], prevNewX, prevNewY);
          updatedOldPoints.push('A', oldPoints[iOld + 1], oldPoints[iOld + 2], oldPoints[iOld + 3], oldPoints[iOld + 4], oldPoints[iOld + 5], oldPoints[iOld + 6], oldPoints[iOld + 7]);
        }
      }
      else if (oldCommand == 'Z') {
        bCloseOld = true;
        if (newCommand == 'L') {
          updatedNewPoints.push('L', newPoints[iNew + 1], newPoints[iNew + 2]);
          updatedOldPoints.push('L', prevOldX, prevOldY);
        }
        else if (newCommand == 'Q') {
          updatedNewPoints.push('Q', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4]);
          updatedOldPoints.push('Q', prevOldX, prevOldY, prevOldX, prevOldY);
        }
        else if (newCommand == 'C') {
          updatedNewPoints.push('C', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], newPoints[iNew + 6]);
          updatedOldPoints.push('C', prevOldX, prevOldY, prevOldX, prevOldY, prevOldX, prevOldY);
        }
        else if (newCommand == 'A') {
          updatedNewPoints.push('A', newPoints[iNew + 1], newPoints[iNew + 2], newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], newPoints[iNew + 6], newPoints[iNew + 7]);
          updatedOldPoints.push('A', 0, 0, newPoints[iNew + 3], newPoints[iNew + 4], newPoints[iNew + 5], prevOldX, prevOldY);
        }
      }
    }

    //save the previous points on the paths
    if (iNextOld > -1 && oldCommand != 'Z' && oldCommand != 'tmp') {
      prevOldX = oldPoints[iNextOld - 2];
      prevOldY = oldPoints[iNextOld - 1];
    }
    if (iNextNew > -1 && newCommand != 'Z' && newCommand != 'tmp') {
      prevNewX = newPoints[iNextNew - 2];
      prevNewY = newPoints[iNextNew - 1];
    }

    //increment the command indices
    iOld = iNextOld;
    iNew = iNextNew;

    if (iOld >= oldPoints.length || iOld < 0) {
      iOld = -1;
    }
    if (iNew >= newPoints.length || iNew < 0) {
      iNew = -1;
    }
  }

  if (bCloseOld || bCloseNew) {
    updatedNewPoints.push('Z');
    updatedOldPoints.push('Z');
  }


};


/**
 * @private
 * Make sure a closed path is oriented in a clockwise direction (to the user's eye).
 */
dvt.ShapeAnimationUtils._makePathClockwise = function(points) {
  var bClockwise = dvt.ShapeAnimationUtils._isPathClockwise(points);
  if (!bClockwise) {
    //don't worry about ending Z, because that should have been converted to L before this
    var newPoints = ['M'];

    var i = dvt.ShapeAnimationUtils._getPrevCommandIndex(points, points.length - 1);
    for (; i > -1; ) {
      var command = points[i];
      //push endpoint first, to finish previous command, then push new command
      switch (command) {
        case 'M':
          //assume this is beginning M and only need to finish previous command
          newPoints.push(points[i + 1], points[i + 2]);
          break;
        case 'L':
          newPoints.push(points[i + 1], points[i + 2]);
          newPoints.push(command);
          break;
        case 'Q':
          newPoints.push(points[i + 3], points[i + 4]);
          newPoints.push(command);
          newPoints.push(points[i + 1], points[i + 2]);
          break;
        case 'C':
          newPoints.push(points[i + 5], points[i + 6]);
          newPoints.push(command);
          //need to reverse order of control points
          newPoints.push(points[i + 3], points[i + 4]);
          newPoints.push(points[i + 1], points[i + 2]);
          break;
        case 'A':
          newPoints.push(points[i + 6], points[i + 7]);
          newPoints.push(command);
          newPoints.push(points[i + 1], points[i + 2], points[i + 3], points[i + 4]);
          //need to reverse the sweep angle
          newPoints.push((points[i + 5] == 0) ? 1 : 0);
          break;
      }

      i = dvt.ShapeAnimationUtils._getPrevCommandIndex(points, i - 1);
    }

    return newPoints;
  }
  return points;
};


/**
 * @private
 * Determine if a path is oriented in a clockwise direction (to the user's eye).
 */
dvt.ShapeAnimationUtils._isPathClockwise = function(points) {
  //http://en.wikipedia.org/wiki/Curve_orientation
  //orientation of a simple 2d polygon is directly related to sign of the angle at any vertex of the convex hull of the
  //polygon
  //the point with min x,y values must be on convex hull
  //    [ 1 xa ya ]
  //O = [ 1 xb yb ]
  //    [ 1 xc yc ]
  //det(O) = (xb*yc + xa*yb + ya*xc) - (ya*xb + yb*xc + xa*yc)
  //if det(O) < 0, polygon is clockwise
  //if det(O) > 0, polygon is counter-clockwise
  //det(O) != 0 if points A,B,C are non-collinear
  //TO DO: if det(O) == 0, we could try to find a different point on convex hull...
  var polygon = [];
  var topLeftIndex = 0;
  var minX = Number.MAX_VALUE;
  var minY = Number.MAX_VALUE;
  //this is a closed shape, so the last command will simply connect to the first point again
  var endIndex = dvt.ShapeAnimationUtils._getPrevCommandIndex(points, points.length - 1);
  for (var i = 1; i < endIndex; ) {
    var iNext = dvt.ShapeAnimationUtils._getNextCommandIndex(points, i);
    if (iNext - 2 > 0) {
      if (points[iNext - 1] != 'Z') {
        var xx = points[iNext - 2];
        var yy = points[iNext - 1];
        polygon.push(xx, yy);

        //top left to user is (minX, minY) coords
        //(make minY primary and minX secondary because it seems typical to start path at left side of top edge)
        if ((yy < minY) || (yy == minY && xx < minX)) {
          minX = xx;
          minY = yy;
          topLeftIndex = polygon.length - 2;
        }
      }
    }
    i = iNext + 1;
  }

  var xa = 0;
  var ya = 0;
  var xb = minX;
  var yb = minY;
  var xc = 0;
  var yc = 0;
  if (topLeftIndex > 0) {
    xa = polygon[topLeftIndex - 2];
    ya = polygon[topLeftIndex - 1];
  }
  else {
    xa = polygon[polygon.length - 2];
    ya = polygon[polygon.length - 1];
  }
  if (topLeftIndex < polygon.length - 2) {
    xc = polygon[topLeftIndex + 2];
    yc = polygon[topLeftIndex + 3];
  }
  else {
    xc = polygon[0];
    yc = polygon[1];
  }
  var detO = (xb * yc + xa * yb + ya * xc) - (ya * xb + yb * xc + xa * yc);
  //normally, path is counter-clockwise if detO > 0, but because the positive y-axis points
  //downward in our coordinate system, the orientation is reversed
  if (detO < 0) {
    return false;
  }

  return true;
};


/**
 * @private
 * Make a closed path start at the top left corner (to the user's eye).
 */
dvt.ShapeAnimationUtils._makePathStartAtTopLeft = function(points) {
  var topLeftIndex = 0;
  var minX = Number.MAX_VALUE;
  var minY = Number.MAX_VALUE;
  var iPrev = 0;
  //this is a closed shape, so the last command will simply connect to the first point again
  var endIndex = dvt.ShapeAnimationUtils._getPrevCommandIndex(points, points.length - 1);
  for (var i = 1; i < endIndex; ) {
    var iNext = dvt.ShapeAnimationUtils._getNextCommandIndex(points, i);
    if (iNext - 2 > 0) {
      //don't worry about ending Z because it should have been replaced with L before this
      if (points[iNext - 1] != 'Z') {
        var xx = points[iNext - 2];
        var yy = points[iNext - 1];

        //top left to user is (minX, minY) coords
        //(make minY primary and minX secondary because it seems typical to start path at left side of top edge)
        if ((yy < minY) || (yy == minY && xx < minX)) {
          minX = xx;
          minY = yy;
          topLeftIndex = iPrev;
        }
      }
    }
    i = iNext + 1;
    iPrev = iNext;
  }

  if (topLeftIndex > 0) {
    var iNext = dvt.ShapeAnimationUtils._getNextCommandIndex(points, topLeftIndex + 1);
    var newPoints = ['M'];
    //concat the top left point through the end of the array
    var arSlice = points.slice(iNext - 2, points.length);
    newPoints = newPoints.concat(arSlice);
    //concat the first command after the initial M through the top left point command
    arSlice = points.slice(3, iNext);
    newPoints = newPoints.concat(arSlice);
    return newPoints;
  }
  return points;
};


/**
 * @private
 * Get the number of parameters for the given drawing command.
 */
dvt.ShapeAnimationUtils._getNumParamsForCommand = function(command) {
  switch (command) {
    case 'H':
    case 'h':
    case 'V':
    case 'v':
      return 1;
    case 'M':
    case 'm':
    case 'L':
    case 'l':
    case 'T':
    case 't':
      return 2;
    case 'Q':
    case 'q':
    case 'S':
    case 's':
      return 4;
    case 'C':
    case 'c':
      return 6;
    case 'A':
    case 'a':
      return 7;
  }
  return 0;
};


/**
 * @private
 * Turn implicit commands, like "L x1 y1 x2 y2 ..." into explicit commands, like "L x1 y1 L x2 y2 ..."
 */
dvt.ShapeAnimationUtils._makeImplicitCommandsExplicit = function(points) {
  for (var i = 0; i < points.length; ) {
    var command = points[i];
    var numParams = dvt.ShapeAnimationUtils._getNumParamsForCommand(command);
    switch (command) {
      //if M is followed by multiple coord pairs, subsequent pairs are treated as L
      case 'M':
        if (i + numParams + 1 < points.length && !isNaN(points[i + numParams + 1])) {
          points.splice(i + numParams + 1, 0, 'L');
        }
        break;
      //if m is followed by multiple coord pairs, subsequent pairs are treated as l
      case 'm':
        if (i + numParams + 1 < points.length && !isNaN(points[i + numParams + 1])) {
          points.splice(i + numParams + 1, 0, 'l');
        }
        break;
      case 'Z':
      case 'z':
        break;
      default:
        if (i + numParams + 1 < points.length && !isNaN(points[i + numParams + 1])) {
          points.splice(i + numParams + 1, 0, command);
        }
        break;
    }
    i += (numParams + 1);
  }
};


/**
 * @private
 * Turn lowercase relative commands into uppercase absolute commands.
 */
dvt.ShapeAnimationUtils._makeRelativeCommandsAbsolute = function(points) {
  var currX = 0;
  var currY = 0;
  var startX = 0;
  var startY = 0;
  for (var i = 0; i < points.length; ) {
    var command = points[i];
    switch (command) {
      case 'm':
        points[i] = 'M';
        if (i > 0) {
          points[i + 1] = currX + points[i + 1];
          points[i + 2] = currY + points[i + 2];
        }
        currX = points[i + 1];
        currY = points[i + 2];
        startX = currX;
        startY = currY;
        break;
      case 'l':
        points[i] = 'L';
        points[i + 1] = currX + points[i + 1];
        points[i + 2] = currY + points[i + 2];
        currX = points[i + 1];
        currY = points[i + 2];
        break;
      case 'h':
        points[i] = 'H';
        points[i + 1] = currX + points[i + 1];
        currX = points[i + 1];
        break;
      case 'v':
        points[i] = 'V';
        points[i + 1] = currY + points[i + 1];
        currY = points[i + 1];
        break;
      case 'c':
        points[i] = 'C';
        points[i + 1] = currX + points[i + 1];
        points[i + 2] = currY + points[i + 2];
        points[i + 3] = currX + points[i + 3];
        points[i + 4] = currY + points[i + 4];
        points[i + 5] = currX + points[i + 5];
        points[i + 6] = currY + points[i + 6];
        currX = points[i + 5];
        currY = points[i + 6];
        break;
      case 's':
        points[i] = 'S';
        points[i + 1] = currX + points[i + 1];
        points[i + 2] = currY + points[i + 2];
        points[i + 3] = currX + points[i + 3];
        points[i + 4] = currY + points[i + 4];
        currX = points[i + 3];
        currY = points[i + 4];
        break;
      case 'q':
        points[i] = 'Q';
        points[i + 1] = currX + points[i + 1];
        points[i + 2] = currY + points[i + 2];
        points[i + 3] = currX + points[i + 3];
        points[i + 4] = currY + points[i + 4];
        currX = points[i + 3];
        currY = points[i + 4];
        break;
      case 't':
        points[i] = 'T';
        points[i + 1] = currX + points[i + 1];
        points[i + 2] = currY + points[i + 2];
        currX = points[i + 1];
        currY = points[i + 2];
        break;
      case 'a':
        points[i] = 'A';
        points[i + 6] = currX + points[i + 6];
        points[i + 7] = currY + points[i + 7];
        currX = points[i + 6];
        currY = points[i + 7];
        break;
      case 'z':
        points[i] = 'Z';
        currX = startX;
        currY = startY;
        break;

        //need to update curr point for absolute commands
      case 'M':
        currX = points[i + 1];
        currY = points[i + 2];
        startX = currX;
        startY = currY;
        break;
      case 'L':
        currX = points[i + 1];
        currY = points[i + 2];
        break;
      case 'H':
        currX = points[i + 1];
        break;
      case 'V':
        currY = points[i + 1];
        break;
      case 'C':
        currX = points[i + 5];
        currY = points[i + 6];
        break;
      case 'S':
        currX = points[i + 3];
        currY = points[i + 4];
        break;
      case 'Q':
        currX = points[i + 3];
        currY = points[i + 4];
        break;
      case 'T':
        currX = points[i + 1];
        currY = points[i + 2];
        break;
      case 'A':
        currX = points[i + 6];
        currY = points[i + 7];
        break;
      case 'Z':
        currX = startX;
        currY = startY;
        break;

      default:
        break;
    }
    i = dvt.ShapeAnimationUtils._getNextCommandIndex(points, i + 1);
  }
};


/**
 * @private
 * Turn shorthand commands, like H and V, into verbose commands, like L.
 */
dvt.ShapeAnimationUtils._makeShorthandCommandsVerbose = function(points) {
  var currX = 0;
  var currY = 0;
  var startX = 0;
  var startY = 0;
  for (var i = 0; i < points.length; ) {
    var command = points[i];
    switch (command) {
      case 'M':
        currX = points[i + 1];
        currY = points[i + 2];
        startX = currX;
        startY = currY;
        break;
      case 'L':
        currX = points[i + 1];
        currY = points[i + 2];
        break;
      case 'H':
        currX = points[i + 1];
        points[i] = 'L';
        points.splice(i + 2, 0, currY);
        break;
      case 'V':
        currY = points[i + 1];
        points[i] = 'L';
        points.splice(i + 1, 0, currX);
        break;
      case 'C':
        currX = points[i + 5];
        currY = points[i + 6];
        break;
      case 'S':
        var j = dvt.ShapeAnimationUtils._getPrevCommandIndex(points, i - 1);
        //assume first control point is coincident with current point
        var newCp1x = currX;
        var newCp1y = currY;
        if (points[j] == 'C') {
          //first control point becomes reflection of previous control point
          var cp2x = points[j + 3];
          var cp2y = points[j + 4];
          newCp1x = currX + (currX - cp2x);
          newCp1y = currY + (currY - cp2y);
        }
        points[i] = 'C';
        points.splice(i + 1, 0, newCp1x, newCp1y);

        currX = points[i + 5];
        currY = points[i + 6];
        break;
      case 'Q':
        currX = points[i + 3];
        currY = points[i + 4];
        break;
      case 'T':
        var j = dvt.ShapeAnimationUtils._getPrevCommandIndex(points, i - 1);
        //assume control point is coincident with current point
        var newCpx = currX;
        var newCpy = currY;
        if (points[j] == 'Q') {
          //control point becomes reflection of previous control point
          var cpx = points[j + 1];
          var cpy = points[j + 2];
          newCpx = currX + (currX - cpx);
          newCpy = currY + (currY - cpy);
        }
        points[i] = 'Q';
        points.splice(i + 1, 0, newCpx, newCpy);

        currX = points[i + 3];
        currY = points[i + 4];
        break;
      case 'A':
        currX = points[i + 6];
        currY = points[i + 7];
        break;
      case 'Z':
        currX = startX;
        currY = startY;
        break;

      default:
        break;
    }
    i = dvt.ShapeAnimationUtils._getNextCommandIndex(points, i + 1);
  }
};


/**
 * @private
 * Make sure subpaths start with M.
 */
dvt.ShapeAnimationUtils._makeSubpathsExplicit = function(points) {
  var startX = 0;
  var startY = 0;
  for (var i = 0; i < points.length; i++) {
    if (points[i] == 'Z') {
      if (i + 1 < points.length) {
        if (points[i + 1] != 'M' && points[i + 1] != 'm') {
          points.splice(i + 1, 0, 'M', startX, startY);
        }
      }
    }
    else if (points[i] == 'M') {
      startX = points[i + 1];
      startY = points[i + 2];
    }
  }
};


/**
 * @private
 * Transform the coords in the path by the given matrix.
 */
dvt.ShapeAnimationUtils._transformPathCoords = function(points, mat) {
  var p = null;
  for (var i = 0; i < points.length; ) {
    var command = points[i];
    switch (command) {
      case 'M':
      case 'L':
        p = mat.transformPoint(new dvt.Point(points[i + 1], points[i + 2]));
        points[i + 1] = p.x;
        points[i + 2] = p.y;
        break;
      case 'Q':
        p = mat.transformPoint(new dvt.Point(points[i + 1], points[i + 2]));
        points[i + 1] = p.x;
        points[i + 2] = p.y;
        p = mat.transformPoint(new dvt.Point(points[i + 3], points[i + 4]));
        points[i + 3] = p.x;
        points[i + 4] = p.y;
        break;
      case 'C':
        p = mat.transformPoint(new dvt.Point(points[i + 1], points[i + 2]));
        points[i + 1] = p.x;
        points[i + 2] = p.y;
        p = mat.transformPoint(new dvt.Point(points[i + 3], points[i + 4]));
        points[i + 3] = p.x;
        points[i + 4] = p.y;
        p = mat.transformPoint(new dvt.Point(points[i + 5], points[i + 6]));
        points[i + 5] = p.x;
        points[i + 6] = p.y;
        break;
      case 'A':
        //need to transform the radii, so transform each radius extent separately and compare relative to
        //transformed origin
        var pOrig = mat.transformPoint(new dvt.Point(0, 0));
        var pRadX = mat.transformPoint(new dvt.Point(points[i + 1], 0));
        var pRadY = mat.transformPoint(new dvt.Point(0, points[i + 2]));
        var newRadX = Math.sqrt((pRadX.x - pOrig.x) * (pRadX.x - pOrig.x) + (pRadX.y - pOrig.y) * (pRadX.y - pOrig.y));
        var newRadY = Math.sqrt((pRadY.x - pOrig.x) * (pRadY.x - pOrig.x) + (pRadY.y - pOrig.y) * (pRadY.y - pOrig.y));
        points[i + 1] = newRadX;
        points[i + 2] = newRadY;

        p = mat.transformPoint(new dvt.Point(points[i + 6], points[i + 7]));
        points[i + 6] = p.x;
        points[i + 7] = p.y;
        break;

      default:
        break;
    }
    i = dvt.ShapeAnimationUtils._getNextCommandIndex(points, i + 1);
  }
};
/**
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @constructor
 */
dvt.BaseDiagram = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.BaseDiagram, dvt.PanZoomComponent, 'dvt.BaseDiagram');

/**
 * Initialization method called by the constructor
 *
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 */
dvt.BaseDiagram.prototype.Init = function(context, callback, callbackObj) {
  dvt.BaseDiagram.superclass.Init.call(this, context, callback, callbackObj);

  //: force text to scale linearly
  this.getCtx().getStage().getElem().setAttributeNS(null, 'text-rendering', 'geometricPrecision');

  this._layoutOffset;
  this._layoutViewport = null;
  this._layoutViewportContainerId = null;
  this._initAnim;
  //: flag used to disable the init anim on PPR
  this._bInitAnimEnabled = true;

  this._linksPane = new dvt.Container(context);
  this._nodesPane = new dvt.Container(context);
  this._topPane = new dvt.Container(context);
  this._animationDuration = dvt.PanZoomCanvas.DEFAULT_ANIMATION_DURATION;
  this.InitializeZoomLimits();
};

/**
 * @protected
 * Called by the renderComponent() method. Used to initialize or reinitialize the component before rendering.
 */
dvt.BaseDiagram.prototype.InitComponentInternal = function() {
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
dvt.BaseDiagram.prototype.setAnimationDuration = function(animationDuration) {
  this._animationDuration = animationDuration;
  if (this.getPanZoomCanvas()) {
    this.getPanZoomCanvas().setAnimationDuration(animationDuration);
  }
};

/**
 * Gets the animation duration (in seconds)
 * @return {number} the animation duration (in seconds)
 */
dvt.BaseDiagram.prototype.getAnimationDuration = function() {
  return this._animationDuration;
};

/**
 * Sets the maximum zoom level
 * @param {number} maxZoom maximum zoom level
 */
dvt.BaseDiagram.prototype.setMaxZoom = function(maxZoom) {
  this._maxZoom = maxZoom;
  if (this.getPanZoomCanvas()) {
    this.getPanZoomCanvas().setMaxZoom(maxZoom);
  }
};

/**
 * Gets the maximum zoom level
 * @return {number} maximum zoom level
 */
dvt.BaseDiagram.prototype.getMaxZoom = function() {
  return this._maxZoom;
};

/**
 * Sets the minimum zoom level
 * @param {number} minZoom minimum zoom level
 */
dvt.BaseDiagram.prototype.setMinZoom = function(minZoom) {
  this._minZoom = minZoom;
  if (this.getPanZoomCanvas()) {
    this.getPanZoomCanvas().setMinZoom(minZoom);
  }
};

/**
 * Gets the minimum zoom level
 * @return {number} minimum zoom level
 */
dvt.BaseDiagram.prototype.getMinZoom = function() {
  return this._minZoom;
};

/**
 * Initializes the minimum and maximum zoom levels of the panZoomCanvas
 */
dvt.BaseDiagram.prototype.InitializeZoomLimits = function() {
  this.setMaxZoom(2.0);
  this.setMinZoom(0.0);
};

/**
 * Gets a node by specified id
 * @param {string} id node id
 * @return {dvt.BaseDiagramNode} diagram node
 */
dvt.BaseDiagram.prototype.getNodeById = function(id) {
  return null;
};

/**
 * Gets a link by specified id
 * @param {string} id link id
 * @return {dvt.BaseDiagramLink} diagram link
 */
dvt.BaseDiagram.prototype.getLinkById = function(id) {
  return null;
};

/**
 * Gets an array of link ids
 * @return {array} array of link ids
 */
dvt.BaseDiagram.prototype.GetAllLinks = function() {
  return [];
};

/**
 * Gets an array of node ids
 * @return {array} array of node ids
 */
dvt.BaseDiagram.prototype.GetAllNodes = function() {
  return [];
};

/**
 * Get the number of nodes in diagram
 * @return {Number} number of nodes
 */
dvt.BaseDiagram.prototype.getNodeCount = function() {
  return this.GetAllNodes().length;
};

/**
 * Get the number of links in diagram
 * @return {Number} number of links
 */
dvt.BaseDiagram.prototype.getLinkCount = function() {
  return this.GetAllLinks().length;
};

/**
 * Refreshes the empty text message, centered in the available space.
 *
 * @param {boolean} emptyDiagram True if empty text should be rendered, false otherwise
 * @protected
 */
dvt.BaseDiagram.prototype.RefreshEmptyText = function(emptyDiagram) {
  if (emptyDiagram && this.getEmptyText()) {
    if (!this._emptyTextDisplay) {
      // Create the text and position it in the middle of the available space
      this._emptyTextDisplay = this.CreateEmptyText(this.getEmptyText());
    }
    else {
      this._emptyTextDisplay.setX(this.Width / 2);
      this._emptyTextDisplay.setY(this.Height / 2);
      dvt.TextUtils.fitText(this._emptyTextDisplay, this.getWidth() - 2 * dvt.TextUtils.EMPTY_TEXT_BUFFER, Infinity, this);
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
 * @return {dvt.OutputText}
 * @protected
 */
dvt.BaseDiagram.prototype.CreateEmptyText = function(text) {
  var options = this.getOptions();
  return dvt.TextUtils.renderEmptyText(this, text, new dvt.Rectangle(0, 0, this.getWidth(), this.getHeight()), this.getEventManager(), options['_statusMessageStyle']);
};

/**
 * Sets a text for the empty component
 * @param {string} text text for the empty component
 */
dvt.BaseDiagram.prototype.setEmptyText = function(text) {
  this._emptyText = text;
};

/**
 * Gets a text for the empty component
 * @return {string} text for the empty component
 */
dvt.BaseDiagram.prototype.getEmptyText = function() {
  return this._emptyText;
};

/**
 * Sets panning option for diagram
 * @param {boolean} panningEnabled true if panning enabled
 * @protected
 */
dvt.BaseDiagram.prototype.SetPanningEnabled = function(panningEnabled) {
  this._panningEnabled = panningEnabled;
};

/**
 * Gets panning option for diagram
 * @return {boolean} true if panning enabled
 * @protected
 */
dvt.BaseDiagram.prototype.IsPanningEnabled = function() {
  return this._panningEnabled;
};

/**
 * Sets pan direction for diagram
 * @param {string} panDirection the direction that panning is enabled
 */
dvt.BaseDiagram.prototype.setPanDirection = function(panDirection) {
  this._panDirection = panDirection;
  if (this.getPanZoomCanvas()) {
    this.getPanZoomCanvas().setPanDirection(panDirection);
  }
};

/**
 * Gets pan direction for diagram
 * @return {string} the direction that panning is enabled
 */
dvt.BaseDiagram.prototype.getPanDirection = function() {
  return this._panDirection;
};
/**
 * Sets zooming option for diagram
 * @param {boolean} zoomingEnabled true if zooming enabled
 * @protected
 */
dvt.BaseDiagram.prototype.SetZoomingEnabled = function(zoomingEnabled) {
  this._zoomingEnabled = zoomingEnabled;
};

/**
 * Gets zooming option for diagram
 * @return {boolean} true if zooming enabled
 * @protected
 */
dvt.BaseDiagram.prototype.IsZoomingEnabled = function() {
  return this._zoomingEnabled;
};

/**
 * Sets the initial animation
 * @param {string} anim the data change animation: "auto" or "none"
 */
dvt.BaseDiagram.prototype.setInitAnim = function(anim) {
  this._initAnim = anim;
};

/**
 * Gets initial animation
 * @return {string} the initial animation: "auto" or "none"
 */
dvt.BaseDiagram.prototype.getInitAnim = function() {
  return this._initAnim;
};

/**
 * Sets initial animation flag
 * @param {boolean} enabled true if initial animation enabled
 */
dvt.BaseDiagram.prototype.setInitAnimEnabled = function(enabled) {
  this._bInitAnimEnabled = enabled;
};

/**
 * Chacks whether initial animation enabled
 * @return {boolean} true if initial animation enabled
 * @protected
 */
dvt.BaseDiagram.prototype.IsInitAnimEnabled = function() {
  return this._bInitAnimEnabled;
};

/**
 * Sets the data change animation
 * @param {string} anim the data change animation: "auto" or "none"
 */
dvt.BaseDiagram.prototype.setDataChangeAnim = function(anim) {
  this._dataChangeAnim = anim;
};

/**
 * Gets the data change animation
 * @return {string} the data change animation: "auto" or "none"
 */
dvt.BaseDiagram.prototype.getDataChangeAnim = function() {
  return this._dataChangeAnim;
};

/**
 * Gets selection handler
 * @return {dvt.SelectionHandler} selection handler
 */
dvt.BaseDiagram.prototype.getSelectionHandler = function() {
  return this._selectionHandler;
};

/**
 * Sets the selection mode for the component
 * @param {string} selectionMode valid values dvt.SelectionHandler.TYPE_SINGLE, dvt.SelectionHandler.TYPE_MULTIPLE or null
 */
dvt.BaseDiagram.prototype.setSelectionMode = function(selectionMode) {
  if (selectionMode == 'single')
    this._selectionHandler = new dvt.SelectionHandler(dvt.SelectionHandler.TYPE_SINGLE);
  else if (selectionMode == 'multiple')
    this._selectionHandler = new dvt.SelectionHandler(dvt.SelectionHandler.TYPE_MULTIPLE);
  else
    this._selectionHandler = null;

  // Event Handler delegates to other handlers
  this.getEventManager().setSelectionHandler(this._selectionHandler);
};

/**
 * Get selection mode
 * @return {string} valid values dvt.SelectionHandler.TYPE_SINGLE, dvt.SelectionHandler.TYPE_MULTIPLE or null
 */
dvt.BaseDiagram.prototype.getSelectionMode = function() {
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
dvt.BaseDiagram.prototype.isSelectionSupported = function() {
  return (this._selectionHandler ? true : false);
};

/**
 * Gets nodes pane
 * @return {dvt.Container} nodes pane
 */
dvt.BaseDiagram.prototype.getNodesPane = function() {
  return this._nodesPane;
};

/**
 * Sets nodes pane
 * @param {dvt.Container} nodesPane
 */
dvt.BaseDiagram.prototype.setNodesPane = function(nodesPane) {
  this._nodesPane = nodesPane;
};

/**
 * Gets links pane
 * @return {dvt.Container} links pane
 */
dvt.BaseDiagram.prototype.getLinksPane = function() {
  return this._linksPane;
};

/**
 * Sets links pane
 * @param {dvt.Container} linksPane
 */
dvt.BaseDiagram.prototype.setLinksPane = function(linksPane) {
  this._linksPane = linksPane;
};

/**
 * Gets top pane
 * @return {dvt.Container} top pane
 */
dvt.BaseDiagram.prototype.getTopPane = function() {
  return this._topPane;
};

/**
 * Sets top pane
 * @param {dvt.Container} topPane
 */
dvt.BaseDiagram.prototype.setTopPane = function(topPane) {
  this._topPane = topPane;
};

/**
 * Creates empty layout context for the component
 * @return {DvtDiagramLayoutContext}  layout context
 * @protected
 */
dvt.BaseDiagram.prototype.CreateEmptyLayoutContext = function() {
  var layoutContext = new DvtDiagramLayoutContext();
  //BUG FIX #13458034: inform layout of reading direction
  layoutContext.setLocaleR2L(dvt.Agent.isRightToLeft(this.getCtx()));
  layoutContext.setComponentSize(new dvt.DiagramRectangle(0, 0, this.getWidth(), this.getHeight()));
  return layoutContext;
};

/**
 * Creates layout context for the node
 * @param {dvt.BaseDiagramNode} node diagram node
 * @param {string} layout layout name
 * @param {boolean} bRenderAfter flag that indicates that node is not rendered yet, it will be render during layout or after layout is done
 * @param {object} layoutContext layout context
 * @return {DvtDiagramLayoutContextNode} layout context for the node
 */
dvt.BaseDiagram.prototype.CreateLayoutContextNode = function(node, layout, bRenderAfter, layoutContext) {
  var nc = new DvtDiagramLayoutContextNode();
  nc.setId(node.getId ? node.getId() : node.getData().getId());
  //BUG FIX #13381683: set both the content bounds and the overall bounds of
  //the node on the layout context
  nc.setBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getLayoutBounds()));
  nc.setContentBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getContentBounds()));
  var nodeData = node.getLayoutAttributes ? node.getLayoutAttributes(layout) : node.getData()['_origData'];
  nc.setLayoutAttributes(nodeData);
  nc.setData(nodeData);
  nc.setLabelBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getLabelBounds()));
  nc.setLabelPosition(dvt.DiagramLayoutUtils.convertPointToDiagramPoint(node.getLabelPosition()));
  nc.setSelected(true == node.isSelected());
  if (node.isDisclosed()) {
    nc.setDisclosed(true);
    //only set container padding AFTER setting bounds and disclosed
    nc.SetContainerPaddingObj(dvt.BaseDiagram.getLayoutContainerPadding(node.getContainerPadding()));
  }
  nc.setContainerId(node.getGroupId());
  nc.Component = this;
  nc.IsRendered = !bRenderAfter;
  nc.LayoutContext = layoutContext;
  return nc;
};

/**
 * Creates layout context for the link
 * @param {dvt.BaseDiagramLink} link diagram link
 * @param {string} startId node id for the link start
 * @param {string} endId node id for the link end
 * @param {string} layout layout name
 * @param {DvtDiagramLayoutContext} layoutContext
 * @return {DvtDiagramLayoutContextLink} layout context for the link
 */
dvt.BaseDiagram.prototype.CreateLayoutContextLink = function(link, startId, endId, layout, layoutContext) {
  var lc = new DvtDiagramLayoutContextLink();
  lc.setId(link.getId ? link.getId() : link.getData().getId());
  lc.setStartId(startId ? startId : link.getData().getStartId());
  lc.setEndId(endId ? endId : link.getData().getEndId());
  var linkData = link.getLayoutAttributes ? link.getLayoutAttributes(layout) :
      link.isPromoted() ? link.getData()['_links'] : link.getData()['_origData'];
  lc.setLayoutAttributes(linkData);
  lc.setData(linkData);
  lc.setLabelBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(link.getLabelBounds()));
  lc.setLabelPosition(dvt.DiagramLayoutUtils.convertPointToDiagramPoint(link.getLabelPosition()));
  lc.setStartConnectorOffset(link.getStartConnectorOffset());
  lc.setEndConnectorOffset(link.getEndConnectorOffset());
  lc.setLinkWidth(link.getLinkWidth());
  lc.setSelected(true == link.isSelected());
  lc.setPromoted(true == link.isPromoted());
  lc.LayoutContext = layoutContext;
  return lc;
};

/**
 * @protected
 * Apply the layout context
 * @param {DvtDiagramLayoutContext} layoutContext The layout context
 * @param {dvt.Animator} animator The animator to animate the changes into
 * @param {boolean} bSaveOffset Flag for saving the layout offset (true for the top level)
 */
dvt.BaseDiagram.prototype.ApplyLayoutContext = function(layoutContext, animator, bSaveOffset) {
  //: apply container padding that was set while laying out the container's children
  var topContainerPadding = layoutContext.getContainerPadding();
  if (topContainerPadding) {
    var containerId = layoutContext.getContainerId();
    if (containerId) {
      var containerNode = this.getNodeById(containerId);
      if (containerNode) {
        containerNode.setContainerPadding(dvt.BaseDiagram.getContainerPadding(topContainerPadding), animator);
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
      var controlPoints = dvt.DiagramLinkUtils.GetControlPoints(points);
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
    nc.ContentOffset = new dvt.DiagramPoint(lopt.x, lopt.y); // adjust content offset that is used by global layout
    var node = this.getNodeById(nc.getId());
    var pos = nc.getPosition();
    if (pos) {
      node.SetPosition(pos['x'] + tx, pos['y'] + ty, animator);
    }
    this.ApplyLabelPosition(nc, node, dvt.DiagramLayoutUtils.convertDiagramPointToPoint(pos), animator);

    //apply new container padding
    if (node.isDisclosed()) {
      var containerPadding = nc.getContainerPadding();
      if (containerPadding) {
        node.setContainerPadding(dvt.BaseDiagram.getContainerPadding(containerPadding), animator);
      }
    }
  }
  if (!this._bCrossedZoomThreshold) {
    for (var li = 0; li < layoutContext.getLinkCount(); li++) {
      var lc = layoutContext.getLinkByIndex(li);
      var link = this.getLinkById(lc.getId());
      var linkOffset = this.GetLinkTranslationOffset(link, lc, lopt, animator);
      var linkOffsetX = linkOffset.x, linkOffsetY = linkOffset.y;
      var points = lc.getPoints();
      if (points) {
        //: turn list of points into path commands compatible for animating
        if (points.length > 0 && !isNaN(points[0])) {
          points = dvt.DiagramLinkUtils.ConvertToPath(points);
        }

        var translatedPoints = [];
        for (var i = 0; i < points.length;) {
          if (isNaN(points[i])) {
            translatedPoints.push(points[i]);
            i++;
          }
          else {
            translatedPoints.push(points[i] + linkOffsetX);
            translatedPoints.push(points[i + 1] + linkOffsetY);
            i += 2;
          }
        }
        if (animator && link.getPoints()) {
          if (translatedPoints.length > 0 && isNaN(translatedPoints[0])) {
            //: transition between old and new paths
            var obj = dvt.ShapeAnimationUtils.getAssimilatedPaths(link.getPoints(), translatedPoints);
            link.setPoints(obj.updatedOldPath);
            animator.addProp(dvt.Animator.TYPE_PATH, link, link.getPoints, link.setPoints, obj.updatedNewPath);
            //set the unmodified, simpler path at the end of the transition
            dvt.Playable.appendOnEnd(animator, function() {
              link.setPoints(translatedPoints);
            });
          }
          else {
            animator.addProp(dvt.Animator.TYPE_POLYLINE, link, link.getPoints, link.setPoints, translatedPoints);
          }
        }
        else {
          link.setPoints(translatedPoints);
        }
      }
      this.ApplyLabelPosition(lc, link, new dvt.Point(-linkOffsetX, -linkOffsetY), animator);
    }
  }

  //save viewport from layout, if specified
  var layoutViewport = layoutContext.getViewport();
  if (layoutViewport) {
    this._layoutViewport = new dvt.Rectangle(layoutViewport['x'] + tx, layoutViewport['y'] + ty, layoutViewport['w'], layoutViewport['h']);
    this._layoutViewportContainerId = layoutContext.getContainerId();
  }

  if (bSaveOffset)
    this._layoutOffset = new dvt.Point(tx, ty);
};

/**
 * Calculates translation offset for the link
 * @param {dvt.BaseDiagramLink} link link
 * @param {DvtDiagramLayoutContextLink} lc layout context for the link
 * @param {dvt.Point} lopt layout offset point
 * @param {dvt.Animator} animator The animator to animate the changes into
 * @return {dvt.Point} translation offset for the link
 * @protected
 */
dvt.BaseDiagram.prototype.GetLinkTranslationOffset = function(link, lc, lopt, animator) {
  var offset = new dvt.Point(0, 0);
  if (!link.getGroupId()) {
    //top level container - use top level layout offset
    offset = lopt;
  }
  else if (link.getGroupId() != lc.getCoordinateSpace()) {
    //link position is given either global or relative to some ancestor container
    var ancestorId = lc.getCoordinateSpace();
    var node = this.getNodeById(link.getGroupId());
    while (node) {
      var padding = node.getContainerPadding();
      offset['x'] -= padding['left'] - node.GetPosition(animator)['x'];
      offset['y'] -= padding['top'] - node.GetPosition(animator)['y'];
      var containerId = node.getGroupId();
      node = containerId != ancestorId ? this.getNodeById(containerId) : null;
    }
    if (!ancestorId) { //should adjust for top level offset that is already added to the top level nodes
      offset['x'] += lopt.x;
      offset['y'] += lopt.y;
    }
  }
  else {}//position already adjusted to the common container - nothing to adjust
  return offset;
};

/**
 * Gets viewport if it was set by the layout
 * @param {dvt.Animator} animator The animator into which the transitions should be rendered (optional)
 * @return {dvt.Rectangle} layout viewport
 * @protected
 */
dvt.BaseDiagram.prototype.GetLayoutViewport = function(animator) {
  var viewport;
  if (this._layoutViewport) {
    viewport = new dvt.Rectangle(this._layoutViewport.x, this._layoutViewport.y, this._layoutViewport.w, this._layoutViewport.h);
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

        var containerId = node.getGroupId();
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
dvt.BaseDiagram.prototype.IsLayoutViewport = function() {
  return this._layoutViewport ? true : false;
};

/**
 * @protected
 * Clear a viewport that was set by the layout engine. Should be done to avoid stale viewport.
 */
dvt.BaseDiagram.prototype.ClearLayoutViewport = function() {
  this._layoutViewport = null;
  this._layoutViewportContainerId = null;
};

// - HTML5 HV: ROOT NODE'S X COORDINATE CHANGED AFTER EXPAND/COLLAPSE
/**
 * Gets layout offset
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 * @return {dvt.Point} layout offset
 * @protected
 */
dvt.BaseDiagram.prototype.CalcLayoutOffset = function(x, y) {
  return new dvt.Point(x, y);
};

/**
 * Adjusts the minimum zoom level of the panZoomCanvas if the diagram minZoom was set to 0.0
 * Will return the resulting view bounds if there were calculated
 * @param {dvt.Animator} animator (optional) an animator containing updated positions for nodes/links
 * @param {dvt.Rectangle} fitBounds (optional) the zoom-to-fit bounds, if known
 * @return {dvt.Rectangle} the bounds required to zoom to fit all content
 * @protected
 */
dvt.BaseDiagram.prototype.AdjustMinZoom = function(animator, fitBounds) {
  if (this.getMinZoom() == 0.0) {
    // Auto adjust minzoom of panzoomcanvas
    var panZoomCanvas = this.getPanZoomCanvas();
    var minZoomFitBounds = fitBounds ? fitBounds : this.GetViewBounds(animator);
    var minScale = this.CalculateMinimumScale(minZoomFitBounds);
    panZoomCanvas.setMinZoom(this.GetMinZoomFactor() * Math.min(minScale, panZoomCanvas.getMaxZoom()));
    return minZoomFitBounds;
  }
  return null;
};

/**
 * Return the factor of zoom to fit to set as min zoom
 * @return {number} factor of zoom to fit to set as min zoom
 * @protected
 */
dvt.BaseDiagram.prototype.GetMinZoomFactor = function() {
  return 1;
};

/**
 * Calculates the minimum scale needed to zoom to fit the specified bounds
 * @param {dvt.Rectangle} bounds the bounds to calculate the scale for
 * @return {number} the minimum scale
 * @protected
 */
dvt.BaseDiagram.prototype.CalculateMinimumScale = function(bounds) {
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
 * @param {dvt.Animator} animator The animator into which the transitions should be rendered (optional)
 * @param {array} arNodeIds array of node ids
 * @param {array} arLinkIds array of link ids
 * @return {dvt.Rectangle} view bounds
 * @protected
 */
dvt.BaseDiagram.prototype.GetViewBounds = function(animator, arNodeIds, arLinkIds) {
  return this.CalcViewBounds(animator, arNodeIds, arLinkIds);
};

/**
 * Calculates view bounds
 * @param {dvt.Animator} animator The animator into which the transitions should be rendered (optional)
 * @param {array} arNodeIds array of node ids
 * @param {array} arLinkIds array of link ids
 * @return {dvt.Rectangle} view bounds
 * @protected
 */
dvt.BaseDiagram.prototype.CalcViewBounds = function(animator, arNodeIds, arLinkIds) {
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
      var groupId = node.getGroupId();
      if (groupId) {
        nodeParent = node.getParent();
        stagePoint1 = this.LocalToStage(new dvt.Point(dims.x, dims.y), nodeParent, animator);
        localPoint1 = this.StageToLocal(stagePoint1, contentPane, animator);
        stagePoint2 = this.LocalToStage(new dvt.Point(dims.x + dims.w, dims.y + dims.h), nodeParent, animator);
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
      var groupId = link.getGroupId();
      if (groupId) {
        linkParent = link.getParent();
        stagePoint1 = this.LocalToStage(new dvt.Point(dims.x, dims.y), linkParent, animator);
        localPoint1 = this.StageToLocal(stagePoint1, contentPane, animator);
        stagePoint2 = this.LocalToStage(new dvt.Point(dims.x + dims.w, dims.y + dims.h), linkParent, animator);
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
 * @param {dvt.DiagramPoint} rotPoint rotation point
 * @return {dvt.Rectangle} bounds for the rotated label
 * @protected
 */
dvt.BaseDiagram.RotateBounds = function(bounds, rotAngle, rotPoint) {
  if (rotAngle == null && !rotPoint) {
    return bounds;
  }

  var topLeft = new dvt.Point(bounds.x, bounds.y);
  var topRight = new dvt.Point(bounds.x + bounds.w, bounds.y);
  var bottomLeft = new dvt.Point(bounds.x, bounds.y + bounds.h);
  var bottomRight = new dvt.Point(bounds.x + bounds.w, bounds.y + bounds.h);

  var mat = new dvt.Matrix();
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

  return new dvt.Rectangle(minX, minY, maxX - minX, maxY - minY);
};

/**
 * Convert a point from stage coords to local coords.
 * @param {dvt.Point}  point  point in stage coords
 * @param {dvt.Displayable}  displayable  displayable defining local coordinate system
 * @param {dvt.Animator}  animator  optional animator containing coordinate transforms
 * @return {dvt.Point}
 * @protected
 */
dvt.BaseDiagram.prototype.StageToLocal = function(point, displayable, animator) {
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
 * @param {dvt.Point}  point  point in local coords
 * @param {dvt.Displayable}  displayable  displayable defining local coordinate system
 * @param {dvt.Animator}  animator  optional animator containing coordinate transforms
 * @return {dvt.Point}
 * @protected
 */
dvt.BaseDiagram.prototype.LocalToStage = function(point, displayable, animator) {
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
dvt.BaseDiagram.prototype.ConstrainPanning = function(x, y, w, h, zoom) {
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
 * @param {dvt.Displayable} obj the displayable to move to front
 */
dvt.BaseDiagram.prototype.moveToDiagramFront = function(obj)
{
  this._topPane.addChild(obj);
};

/**
 * Moves the specified link to the links pane (typically from the top pane)
 * @param {dvt.BaseDiagramLink} obj the link to move
 */
dvt.BaseDiagram.prototype.moveToLinks = function(obj)
{
  this._linksPane.addChild(obj);
};

/**
 * Moves the specified node to the nodes pane (typically from the top pane)
 * @param {dvt.BaseDiagramNode} obj the node to move
 */
dvt.BaseDiagram.prototype.moveToNodes = function(obj)
{
  this._nodesPane.addChild(obj);
};

/**
 * Convert key notation into dot notation
 * @param {object} layoutContainerPadding the object with the layout container padding values
 * @return {object} object with the container padding values
 */
dvt.BaseDiagram.getContainerPadding = function(layoutContainerPadding)
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
dvt.BaseDiagram.getLayoutContainerPadding = function(containerPadding)
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
dvt.BaseDiagram.prototype.renderNodeFromContext = function(nodeContext) {
  //subclasses should override
};


/**
 * Updates layout context for the node
 * @param {DvtDiagramLayoutContextNode} nodeContext node context
 * @param {dvt.BaseDiagramNode} node diagram node
 */
dvt.BaseDiagram.prototype.UpdateNodeLayoutContext = function(nodeContext, node) {
  var padding = node.isDisclosed() ? node.getContainerPadding() : null;
  if (padding)
    nodeContext.setContainerPadding(padding.top, padding.right, padding.bottom, padding.left);
  nodeContext.setBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getLayoutBounds()));
  nodeContext.setContentBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getContentBounds()));
  nodeContext.setLabelBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getLabelBounds()));
  nodeContext.IsRendered = true;
};

/**
 * Updates layout context for the node/link
 * @param {DvtDiagramLayoutContextNode | DvtDiagramLayoutContextNode} objc node or link context
 * @param {dvt.BaseDiagramNode | dvt.BaseDiagramLink} obj diagram node or link
 * @param {dvt.Point} pos position of node or link
 * @param {dvt.Animator} animator The animator into which the transitions should be rendered (optional)
 * @protected
 */
dvt.BaseDiagram.prototype.ApplyLabelPosition = function(objc, obj, pos, animator) {
  var labelBounds = objc.getLabelBounds();
  labelBounds = dvt.DiagramLayoutUtils.convertDiagramRectToRect(labelBounds);
  var labelPos = objc.getLabelPosition();
  if (labelBounds && labelPos) {
    // translate to make these relative to the node or link
    var translatedPos = new dvt.Point(labelPos['x'] - pos.x, labelPos['y'] - pos.y);
    var labelRotAngle = objc.getLabelRotationAngle();
    var labelRotPoint = dvt.DiagramLayoutUtils.convertDiagramPointToPoint(objc.getLabelRotationPoint());
    if (animator) {
      animator.addProp(dvt.Animator.TYPE_RECTANGLE, obj, obj.getLabelBounds, obj.setLabelBounds, labelBounds);

      // If the label position hasn't been initialized, don't try to animate.
      // This could happen if the container is initially collapsed.
      if (!obj.getLabelPosition()) {
        obj.setLabelPosition(translatedPos);
      }
      else {
        animator.addProp(dvt.Animator.TYPE_POINT, obj, obj.getLabelPosition, obj.setLabelPosition, translatedPos);
      }

      if (labelRotAngle != null) {
        animator.addProp(dvt.Animator.TYPE_NUMBER, obj, obj.getLabelRotationAngle, obj.setLabelRotationAngle, labelRotAngle);
      }
      if (labelRotPoint) {
        if (!obj.getLabelRotationPoint()) {
          obj.setLabelRotationPoint(labelRotPoint);
        }
        else {
          animator.addProp(dvt.Animator.TYPE_POINT, obj, obj.getLabelRotationPoint, obj.setLabelRotationPoint, labelRotPoint);
        }
      }
    }
    else {
      obj.setLabelBounds(labelBounds);
      obj.setLabelPosition(translatedPos);
      obj.setLabelAlignments(objc.getLabelHalign(), objc.getLabelValign());
      if (labelRotAngle != null) {
        obj.setLabelRotationAngle(labelRotAngle);
      }
      if (labelRotPoint) {
        obj.setLabelRotationPoint(labelRotPoint);
      }
    }
  }
};

/**
 * Gets layout offset
 * @return {dvt.Point} x,y coordinates for layout offset
 */
dvt.BaseDiagram.prototype.getLayoutOffset = function() {
  return this._layoutOffset ? this._layoutOffset : new dvt.Point(0, 0);
};


/**
  * Returns the custom obj keyboard bounding box
  * @param {dvt.BaseDiagramNode | dvt.BaseDiagramLink} obj diagram node or link
  * @return {dvt.Rectangle} keyboard bounding box of rectangle
  */
dvt.BaseDiagram.prototype.getCustomObjKeyboardBoundingBox = function(obj) {
  var objCoords = obj.getElem().getBoundingClientRect();
  var contentPaneCoords = this.getPanZoomCanvas().getContentPane().getElem().getBoundingClientRect();
  var cpMatrix = this.getPanZoomCanvas().getContentPane().getMatrix();
  return new dvt.Rectangle(
      objCoords.left - contentPaneCoords.left + cpMatrix.getTx(),
      objCoords.top - contentPaneCoords.top + cpMatrix.getTy(),
      objCoords.width, objCoords.height);
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.

/**
 * @constructor
 *  @class dvt.BaseDiagramKeyboardHandler base class for keyboard handler for diagram component
 *  @param {dvt.BaseDiagram} component The owning diagram component
 *  @param {dvt.EventManager} manager The owning dvt.EventManager
 *  @extends {dvt.PanZoomCanvasKeyboardHandler}
 */
dvt.BaseDiagramKeyboardHandler = function(component, manager)
{
  this.Init(component, manager);
};

dvt.Obj.createSubclass(dvt.BaseDiagramKeyboardHandler, dvt.PanZoomCanvasKeyboardHandler, 'dvt.BaseDiagramKeyboardHandler');

/**
 * Link direction - outgoing
 * @const
 * @private
 */
dvt.BaseDiagramKeyboardHandler._OUTGOING = 0;


/**
 * Link direction - ingoing
 * @const
 * @private
 */
dvt.BaseDiagramKeyboardHandler._INGOING = 1;

/**
 * @override
 */
dvt.BaseDiagramKeyboardHandler.prototype.Init = function(diagram, manager) {
  dvt.BaseDiagramKeyboardHandler.superclass.Init.call(this, diagram, manager);
  this._diagram = diagram;
};

/**
 * Gets parent diagram
 * @return {dvt.BaseDiagram} parent diagram
 * @protected
 */
dvt.BaseDiagramKeyboardHandler.prototype.GetDiagram = function() {
  return this._diagram;
};

/**
 * @override
 */
dvt.BaseDiagramKeyboardHandler.prototype.isSelectionEvent = function(event)
{
  if (event.keyCode == dvt.KeyboardEvent.TAB)
    return false;
  else
    return this.isNavigationEvent(event) && !event.ctrlKey;
};

/**
 * @override
 */
dvt.BaseDiagramKeyboardHandler.prototype.isMultiSelectEvent = function(event)
{
  return event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey;
};

/**
 * Get first navigable link
 * @param {dvt.BaseDiagramNode} node node for which links are analyzed
 * @param {dvt.KeyboardEvent} event keyboard event
 * @param {array} listOfLinks array of links for the node
 * @return {dvt.BaseDiagramLink} first navigable link
 */
dvt.BaseDiagramKeyboardHandler.prototype.getFirstNavigableLink = function(node, event, listOfLinks) {
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
    if ((direction == dvt.KeyboardEvent.OPEN_ANGLED_BRACKET && linkCenterX <= nodeCenterX) ||
        (direction == dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET && linkCenterX >= nodeCenterX)) {
      link = object;
      break;
    }
  }
  return link;
};


/**
 * Get next navigavle link depending on direction - clockwise or conter clockwise.
 * The decision is made based on location of nodes centers rather than link paths or link angles.
 * @param {dvt.BaseDiagramNode} node the node for which links are analyzed
 * @param {dvt.BaseDiagramLink} currentLink the link in focus
 * @param {dvt.KeyboardEvent} event the keyboard event
 * @param {array} listOfLinks the array of links for the node
 * @return {dvt.BaseDiagramLink} next navigable link
 */
dvt.BaseDiagramKeyboardHandler.prototype.getNextNavigableLink = function(node, currentLink, event, listOfLinks) {
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
  var bForward = (event.keyCode == dvt.KeyboardEvent.DOWN_ARROW) ? true : false;
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
 * @return {dvt.BaseDiagramNode} a visible node - the node itself or its container
 * @protected
 */
dvt.BaseDiagramKeyboardHandler.prototype.GetVisibleNode = function(nodeId) {
  //subclasses should override
  return null;
};

/**
 * Get clockwise angle for the link using given node as a center
 * @param {dvt.BaseDiagramNode} node node as a center
 * @param {dvt.BaseDiagramLink} link link to be checked
 * @return {number} an link angle from 0 to 2*PI
 * @private
 */
dvt.BaseDiagramKeyboardHandler.prototype._getClockwiseAngle = function(node, link)
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
 * @param {dvt.BaseDiagramNode} node diagram node
 * @return {dvt.Point} node center
 * @private
 */
dvt.BaseDiagramKeyboardHandler.prototype._getNodeCenter = function(node) {
  var nodeBB = node.getKeyboardBoundingBox();
  return new dvt.Point(nodeBB.x + nodeBB.w / 2, nodeBB.y + nodeBB.h / 2);
};


/**
 * Get distance between start and end nodes for the given link
 * @param {dvt.BaseDiagramLink} link a link
 * @return {number} the distance between nodes
 * @private
 */
dvt.BaseDiagramKeyboardHandler.prototype._getNodesDistance = function(link) {
  var startNode = this.GetVisibleNode(link.getStartId ? link.getStartId() : link.getData().getStartId());
  var endNode = this.GetVisibleNode(link.getEndId ? link.getEndId() : link.getData().getEndId());
  var p1 = this._getNodeCenter(startNode);
  var p2 = this._getNodeCenter(endNode);
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};


/**
 * Get link direction for the given node
 * @param {dvt.BaseDiagramNode} node a node
 * @param {dvt.BaseDiagramLink} link a link connected to the given node
 * @return {number} a link direction - dvt.BaseDiagramKeyboardHandler._INGOING or dvt.BaseDiagramKeyboardHandler._OUTGOING
 * @private
 */
dvt.BaseDiagramKeyboardHandler.prototype._getLinkDirection = function(node, link) {
  if (node == this.GetVisibleNode(link.getEndId ? link.getEndId() : link.getData().getEndId()))
    return dvt.BaseDiagramKeyboardHandler._INGOING;
  else
    return dvt.BaseDiagramKeyboardHandler._OUTGOING;
};


/**
 * Get function that compares two link around a given node
 * The links are analyzed by angle, distance from the node and direction. The sorting attributes are added to the links before sorting.
 * @return {function} a function that compares to links around the node
 * @private
 */
dvt.BaseDiagramKeyboardHandler.prototype._getLinkComparator = function() {
  var comparator = function(link1, link2) {
    var linkAngle1 = link1.__angle;
    var linkAngle2 = link2.__angle;
    var res = -1;

    if (!dvt.BaseDiagramKeyboardHandler._anglesAreEqualWithinTolerance(linkAngle1, linkAngle2) && linkAngle1 > linkAngle2) {
      res = 1;
    }
    else if (dvt.BaseDiagramKeyboardHandler._anglesAreEqualWithinTolerance(linkAngle1, linkAngle2)) {
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
dvt.BaseDiagramKeyboardHandler.prototype._removeSortingAttributes = function(listOfLinks) {
  for (var i = 0; i < listOfLinks.length; i++) {
    var link = listOfLinks[i];
    link.__angle = undefined;
    link.__distance = undefined;
    link.__direction = undefined;
  }
};


/**
 * Utility method that adds sorting attributes to each link in the array
 * @param {dvt.BaseDiagramNode} node the node
 * @param {array} listOfLinks array of links
 * @private
 */
dvt.BaseDiagramKeyboardHandler.prototype._addSortingAttributes = function(node, listOfLinks) {
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
dvt.BaseDiagramKeyboardHandler._anglesAreEqualWithinTolerance = function(a1, a2) {
  var res = Math.abs(a1 - a2) <= 0.0000001;
  if (!res) {
    res = Math.abs(Math.PI * 2 + Math.min(a1, a2) - Math.max(a1, a2)) <= 0.0000001;
  }
  return res;
};





/**
 * @constructor
 * @class The base class for diagram links.
 * @param {dvt.Context} context the rendering context
 * @param {string} nodeId the node id
 * @param {dvt.Diagram} diagram parent diagram component
 * @implements {DvtSelectable}
 * @implements {DvtKeyboardNavigable}
 */
dvt.BaseDiagramNode = function(context, nodeId, diagram) {
  this.Init(context, nodeId, diagram);
};

dvt.Obj.createSubclass(dvt.BaseDiagramNode, dvt.Container, 'dvt.BaseDiagramNode');

/**
 * Initialization method called by the constructor
 * @param {dvt.Context} context the rendering context
 * @param {string} nodeId the node id
 * @param {dvt.Diagram} diagram parent diagram component
 */
dvt.BaseDiagramNode.prototype.Init = function(context, nodeId, diagram) {
  dvt.BaseDiagramNode.superclass.Init.call(this, context, null, nodeId);
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
 * @return {dvt.BaseDiagram} parent diagram
 * @protected
 */
dvt.BaseDiagramNode.prototype.GetDiagram = function() {
  return this._diagram;
};

/**
 * Gets data for the diagram node
 * @return {object} data for the diagram node
 */
dvt.BaseDiagramNode.prototype.getData = function() {
  return null;
};

/**
 * Get the layout bounds in coordinates relative to this node
 * @return {dvt.Rectangle} layout bounds
 */
dvt.BaseDiagramNode.prototype.getLayoutBounds = function() {
  return this.getContentBounds();
};

/**
 * Get the content bounds in coordinates relative to this node.
 * @return {dvt.Rectangle} content bounds
 */
dvt.BaseDiagramNode.prototype.getContentBounds = function() {
  return new dvt.Rectangle(0, 0, this.getWidth(), this.getHeight());
};


/**
 * Sets the position of the link label. The position is in the coordinate
 * system of the node's container.
 * @param {dvt.Point} pos position of the node label
 */
dvt.BaseDiagramNode.prototype.setLabelPosition = function(pos) {
  if (pos) {
    this._labelPos = pos;
    dvt.BaseDiagramNode.PositionLabel(this._labelObj, pos, this.getLabelBounds(),
        this.getLabelRotationAngle(),
        this.getLabelRotationPoint());
  }
};

/**
 * Gets the position of the node label.
 * @return {dvt.Point}
 */
dvt.BaseDiagramNode.prototype.getLabelPosition = function() {
  return this._labelPos;
};

/**
 * Gets label dimensions
 * @return {dvt.Rectangle} The bounds of the label
 */
dvt.BaseDiagramNode.prototype.getLabelBounds = function() {
  return null;
};

/**
 * Sets label dimensions
 * @param {dvt.Rectangle} bounds The bounds of the label
 */
dvt.BaseDiagramNode.prototype.setLabelBounds = function(bounds) {
};

/**
 * Get the padding of this container.  Values can be retrieved from the
 * returned map using keys 'top', 'left', 'bottom', and 'right'.
 * @return {object}
 */
dvt.BaseDiagramNode.prototype.getContainerPadding = function() {
  return null;
};

/**
 * Sets padding for a container node
 * @param {number} top Top padding
 * @param {number} right Right padding
 * @param {number} bottom Bottom padding
 * @param {number} left Left padding
 * @param {dvt.Animator} animator The animator into which the transitions should be rendered (optional)
 */
dvt.BaseDiagramNode.prototype.setContainerPadding = function(top, right, bottom, left, animator) {
};

/**
 * Checks if the diagram node is disclosed. Relevant for container nodes.
 * @return {boolean}  true if the diagram container node is disclosed
 */
dvt.BaseDiagramNode.prototype.isDisclosed = function() {
  return this._bDisclosed;
};

/**
 * Sets disclosed flag for the node. Relevant for container nodes.
 * @param {boolean} bDisclosed true for disclosed container node
 */
dvt.BaseDiagramNode.prototype.setDisclosed = function(bDisclosed) {
  this._bDisclosed = bDisclosed;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
dvt.BaseDiagramNode.prototype.isSelected = function() {
  return this._selected;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
dvt.BaseDiagramNode.prototype.setSelected = function(selected) {
  // Store the selection state
  this._selected = selected;
};

/**
 * Sets selectable flag on the node
 * @param {boolean} selectable true if the node is selectable
 */
dvt.BaseDiagramNode.prototype.setSelectable = function(selectable) {
  this._selectable = selectable;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
dvt.BaseDiagramNode.prototype.isSelectable = function() {
  return this.GetDiagram().isSelectionSupported() && this._selectable;
};

/**
 * Sets hidden ancestor flag on the node
 * @param {boolean} bHiddenAncestor true if the node is hidden ancestor
 * @param {dvt.Animator} animator The animator into which the transitions should be rendered (optional)
 */
dvt.BaseDiagramNode.prototype.setHiddenAncestor = function(bHiddenAncestor, animator) {
  this._bHiddenAncestor = bHiddenAncestor;
};

/**
 * Checks whether the node is hidden ancestor
 * @return {boolean} true if a node is a hidden ancestor
 */
dvt.BaseDiagramNode.prototype.isHiddenAncestor = function() {
  return this._bHiddenAncestor;
};

/**
 * Sets label rotation angle
 * @param {number} angle angle of label rotation
 */
dvt.BaseDiagramNode.prototype.setLabelRotationAngle = function(angle) {
  this._labelRotAngle = angle;
  dvt.BaseDiagramNode.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(), angle, this.getLabelRotationPoint());
};

/**
 * Gets label rotation angle
 * @return {number} angle of label rotation
 */
dvt.BaseDiagramNode.prototype.getLabelRotationAngle = function() {
  return this._labelRotAngle;
};

/**
 * Sets label rotation point
 * @param {dvt.DiagramPoint} point label rotation point
 */
dvt.BaseDiagramNode.prototype.setLabelRotationPoint = function(point) {
  this._labelRotPoint = point;
  dvt.BaseDiagramNode.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(), this.getLabelRotationAngle(), point);
};

/**
 * Gets label rotation point
 * @return {dvt.DiagramPoint} label rotation point
 */
dvt.BaseDiagramNode.prototype.getLabelRotationPoint = function() {
  return this._labelRotPoint;
};

/**
 * Gets node bounds after layout is done
 * @param {dvt.Animator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @return {dvt.Rectangle} node bounds after layout is done
 * @protected
 */
dvt.BaseDiagramNode.prototype.GetNodeBounds = function(animator) {
  var nodeBounds = this.getLayoutBounds();
  var bounds = new dvt.Rectangle(nodeBounds.x, nodeBounds.y, nodeBounds.w, nodeBounds.h);

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
      labelBounds = dvt.BaseDiagram.RotateBounds(labelBounds, labelRotAngle, labelRotPoint);
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
 * @param {dvt.Point} pos position of the link label
 * @param {dvt.Rectangle} bounds label bounds
 * @param {number} rotAngle rotation angle for the label
 * @param {dvt.Point} rotPoint rotation point for the label
 * @return {dvt.Matrix} matrix used to rotate and position the label
 */
dvt.BaseDiagramNode.CalcLabelMatrix = function(pos, bounds, rotAngle, rotPoint) {
  var mat = new dvt.Matrix();
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
 * @param {dvt.OutputText} label node label
 * @param {dvt.Point} pos position of the node label
 * @param {dvt.Rectangle} bounds label bounds
 * @param {number} rotAngle rotation angle for the label
 * @param {dvt.Point} rotPoint rotation point for the label
 * @protected
 */
dvt.BaseDiagramNode.PositionLabel = function(label, pos, bounds, rotAngle, rotPoint) {
  if (!label)
    return;
  var mat = dvt.BaseDiagramNode.CalcLabelMatrix(pos, bounds, rotAngle, rotPoint);
  label.setMatrix(mat);
};

/**
 * Sets position of the node
 * @param {number} xx x coordinate for the node
 * @param {number} yy y coordinate for the node
 * @param {dvt.Animator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @protected
 */
dvt.BaseDiagramNode.prototype.SetPosition = function(xx, yy, animator) {
  if (animator) {
    animator.addProp(dvt.Animator.TYPE_NUMBER, this, this.getTranslateX, this.setTranslateX, xx);
    animator.addProp(dvt.Animator.TYPE_NUMBER, this, this.getTranslateY, this.setTranslateY, yy);
  }
  else {
    this.setTranslate(xx, yy);
  }
};

/**
 * Gets position of the node
 * @param {dvt.Animator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @return {dvt.Point} node position
 * @protected
 */
dvt.BaseDiagramNode.prototype.GetPosition = function(animator) 
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
  return new dvt.Point(xx, yy);
};

// Implementation of DvtKeyboardNavigable interface
/**
 * @override
 */
dvt.BaseDiagramNode.prototype.getNextNavigable = function(event) {
  //subclasses should override
  return null;
};

/**
 * @override
 */
dvt.BaseDiagramNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  // return the bounding box for the diagram node, in stage coordinates
  // we don't call this.getDimensions(this.getCtx().getStage() because
  // that would take into account any selection/keyboard focus effects.
  // so instead, we get the content bounds of the node and convert that
  // to stage coordinates, based on code in dvt.Displayable.getDimensions()
  if (this._customNodeContent)
    return this._diagram.getCustomObjKeyboardBoundingBox(this);
  else {
    var bounds = this.getContentBounds(targetCoordinateSpace);
    var stageP1 = this.localToStage(new dvt.Point(bounds.x, bounds.y));
    var stageP2 = this.localToStage(new dvt.Point(bounds.x + bounds.w, bounds.y + bounds.h));
    return new dvt.Rectangle(stageP1.x, stageP1.y, stageP2.x - stageP1.x, stageP2.y - stageP1.y);
  }
};

/**
 * @override
 */
dvt.BaseDiagramNode.prototype.getTargetElem = function() 
{
  return this.getElem();
};

/**
 * @override
 */
dvt.BaseDiagramNode.prototype.showKeyboardFocusEffect = function() {};

/**
 * @override
 */
dvt.BaseDiagramNode.prototype.hideKeyboardFocusEffect = function() {};

/**
 * @override
 */
dvt.BaseDiagramNode.prototype.isShowingKeyboardFocusEffect = function() {};

/**
 * Returns an array containing all categories to which this object belongs.
 * @return {array} The array of categories.
 */
dvt.BaseDiagramNode.prototype.getCategories = function() {
  return null;
};

/**
 * Stores an id of an outgoing link for the node
 * @param {string} id an id for the outgoing link
 */
dvt.BaseDiagramNode.prototype.addOutLinkId = function(id) {
  if (!this._outLinkIds) {
    this._outLinkIds = [];
  }
  this._outLinkIds.push(id);
};

/**
 * Removes an id of the outgoing link
 * @param {string} id an id for the outgoing link
 */
dvt.BaseDiagramNode.prototype.removeOutLinkId = function(id)
{
  if (this._outLinkIds) {
    var idx = dvt.ArrayUtils.getIndex(this._outLinkIds, id);
    if (idx != -1) {
      this._outLinkIds.splice(idx, 1);
    }
  }
};

/**
 * Gets ids of outgoing links for the node
 * @return {array} ids of outgoing links for the node
 */
dvt.BaseDiagramNode.prototype.getOutLinkIds = function() {
  return this._outLinkIds;
};

/**
 * Stores an id of an incoming link for the node
 * @param {string} id an id for the incoming link
 */
dvt.BaseDiagramNode.prototype.addInLinkId = function(id)
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
dvt.BaseDiagramNode.prototype.removeInLinkId = function(id)
{
  if (this._inLinkIds) {
    var idx = dvt.ArrayUtils.getIndex(this._inLinkIds, id);
    if (idx != -1) {
      this._inLinkIds.splice(idx, 1);
    }
  }
};

/**
 * Gets ids of incoming links for the node
 * @return {array} ids of incoming links for the node
 */
dvt.BaseDiagramNode.prototype.getInLinkIds = function()
{
  return this._inLinkIds;
};

/**
 * Sets the label alignments
 * system of the node's container.
 * label object guaranteed to be non-null if this method is called
 * @param {string} halign halign of the node label
 * @param {string} valign valign of the node label
 */
dvt.BaseDiagramNode.prototype.setLabelAlignments = function(halign, valign) {
  //do nothing, only for DvtDiagramNode
};

/**
 * Gets group id for the node
 * @return {string} group id for the node
 */
dvt.BaseDiagramNode.prototype.getGroupId = function() {
  return null;
};


/**
 * Retrieves the position of child node pane if exists
 * @param {dvt.Animator} animator The animator into which the transitions should be rendered (optional)
 * @return {dvt.Point} position of child node pane if exists
 * @protected
 */
dvt.BaseDiagramNode.prototype.GetChildNodePanePosition = function(animator) {
  //: take translate of childNodePane into account for
  //layout context localToGlobal when laying out cross-container links
  if (this._childNodePane) {
    var xx = animator ? animator.getDestVal(this._childNodePane, this._childNodePane.getTranslateX, true) : this._childNodePane.getTranslateX();
    var yy = animator ? animator.getDestVal(this._childNodePane, this._childNodePane.getTranslateY, true) : this._childNodePane.getTranslateY();
    return new dvt.Point(xx, yy);
  }
  return null;
};
/**
 * @constructor
 * @class The base class for diagram links
 * @param {dvt.Context} context the rendering context
 * @param {string} linkId link id
 * @param {dvt.BaseDiagram} diagram the parent diagram component
 * @implements {DvtSelectable}
 * @implements {DvtKeyboardNavigable}
 */
dvt.BaseDiagramLink = function(context, linkId, diagram) {
  this.Init(context, linkId, diagram);
};

dvt.Obj.createSubclass(dvt.BaseDiagramLink, dvt.Container, 'dvt.BaseDiagramLink');

/**
 * Initialization method called by the constructor
 * @param {dvt.Context} context the rendering context
 * @param {string} linkId link id
 * @param {dvt.BaseDiagram} diagram the parent diagram component
 */
dvt.BaseDiagramLink.prototype.Init = function(context, linkId, diagram) {
  dvt.BaseDiagramLink.superclass.Init.call(this, context, null, linkId);
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
 * @return {dvt.BaseDiagram} parent diagram
 * @protected
 */
dvt.BaseDiagramLink.prototype.GetDiagram = function() {
  return this._diagram;
};

/**
 * Sets the link end connector type
 * @param {String} type link end connector type
 */
dvt.BaseDiagramLink.prototype.setEndConnectorType = function(type) {
};

/**
 * Gets the link end connector type
 * @return {String}  link end connector type
 */
dvt.BaseDiagramLink.prototype.getEndConnectorType = function() {
  return null;
};

/**
 * Sets the link start connector type
 * @param {String} type link start connector type
 */
dvt.BaseDiagramLink.prototype.setStartConnectorType = function(type) {
};

/**
 * Sets link start connector
 * @param {dvt.Container} startConnector link start connector
 */
dvt.BaseDiagramLink.prototype.setStartConnector = function(startConnector) {
  this._startConnector = startConnector;
};

/**
 * Get the link start connector
 * @return {dvt.Container}  link start connector
 */
dvt.BaseDiagramLink.prototype.getStartConnector = function() {
  return this._startConnector;
};

/**
 * Sets link end connector
 * @param {dvt.Container} endConnector link start connector
 */
dvt.BaseDiagramLink.prototype.setEndConnector = function(endConnector) {
  this._endConnector = endConnector;
};

/**
 * Get the link end connector
 * @return {dvt.Container}  link end connector
 */
dvt.BaseDiagramLink.prototype.getEndConnector = function() {
  return this._endConnector;
};

/**
 * Sets link shape
 * @param {dvt.Path} shape link shape
 */
dvt.BaseDiagramLink.prototype.setShape = function(shape) {
  this._shape = shape;
};

/**
 * Get the link shape
 * @return {dvt.Path} link shape
 */
dvt.BaseDiagramLink.prototype.getShape = function() {
  return this._shape;
};

/**
 * Sets label rotation angle
 * @param {number} angle angle of label rotation
 */
dvt.BaseDiagramLink.prototype.setLabelRotationAngle = function(angle) {
  this._labelRotAngle = angle;
  dvt.BaseDiagramLink.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(), angle, this.getLabelRotationPoint());
};

/**
 * Gets label rotation angle
 * @return {number} angle of label rotation
 */
dvt.BaseDiagramLink.prototype.getLabelRotationAngle = function() {
  return this._labelRotAngle;
};

/**
 * Sets label rotation point
 * @param {dvt.DiagramPoint} point label rotation point
 */
dvt.BaseDiagramLink.prototype.setLabelRotationPoint = function(point) {
  this._labelRotPoint = point;
  dvt.BaseDiagramLink.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(), this.getLabelRotationAngle(), point);
};

/**
 * Gets label rotation point
 * @return {dvt.DiagramPoint} label rotation point
 */
dvt.BaseDiagramLink.prototype.getLabelRotationPoint = function() {
  return this._labelRotPoint;
};

/**
 * Gets the position of the link label.
 * @return {dvt.Point}
 */
dvt.BaseDiagramLink.prototype.getLabelPosition = function() {
  return this._labelPos;
};

/**
 * Sets the position of the link label.
 * @param {dvt.Point} pos label position
 */
dvt.BaseDiagramLink.prototype.setLabelPosition = function(pos) {
  if (pos) {
    this._labelPos = pos;
    dvt.BaseDiagramLink.PositionLabel(this._labelObj, pos, this.getLabelBounds(), this.getLabelRotationAngle(), this.getLabelRotationPoint());
  }
};

/**
 * Gets label dimensions
 * @return {dvt.Rectangle} The bounds of the label
 */
dvt.BaseDiagramLink.prototype.getLabelBounds = function() {
  return null;
};

/**
 * Sets label dimensions
 * @param {dvt.Rectangle} bounds The bounds of the label
 */
dvt.BaseDiagramLink.prototype.setLabelBounds = function(bounds) {
};

/**
 * Gets the offset of the start connector.  This is the amount of space that the
 * link should leave between its starting point and the node for the connector
 * to be drawn.
 * @return {number}
 */
dvt.BaseDiagramLink.prototype.getStartConnectorOffset = function() {
  return 0;
};

/**
 * Gets the offset of the end connector.  This is the amount of space that the
 * link should leave between its starting point and the node for the connector
 * to be drawn.
 * @return {number}
 */
dvt.BaseDiagramLink.prototype.getEndConnectorOffset = function() {
  return 0;
};

/**
 * Sets selectable flag on the link
 * @param {boolean} selectable true if the link is selectable
 */
dvt.BaseDiagramLink.prototype.setSelectable = function(selectable) {
  this._selectable = selectable;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
dvt.BaseDiagramLink.prototype.isSelectable = function() {
  return this.GetDiagram().isSelectionSupported() && this._selectable;
};

/**
 * Checks whether the node is selected
 * @return {boolean} true if the link is selected
 */
dvt.BaseDiagramLink.prototype.isSelected = function() {
  return this._selected;
};

/**
 * Implemented for DvtSelectable
 * @override
 */
dvt.BaseDiagramLink.prototype.setSelected = function(selected) {
  // Store the selection state
  this._selected = selected;
};

/**
 * Sets promoted flag on the link
 * @param {boolean} bPromoted true if the link is promoted
 */
dvt.BaseDiagramLink.prototype.setPromoted = function(bPromoted) {
  this._bPromoted = bPromoted;
};

/**
 * Checks whether the link is promoted link
 * @return {boolean} true if the link is promoted link
 */
dvt.BaseDiagramLink.prototype.isPromoted = function() {
  return this._bPromoted;
};

/**
 * Sets links width
 * @param {number} lw link width
 */
dvt.BaseDiagramLink.prototype.setLinkWidth = function(lw) {
};

/**
 * Gets link width
 * @return {number} link width
 */
dvt.BaseDiagramLink.prototype.getLinkWidth = function() {
  return 1;
};

/**
 * Sets link style
 * @param {string} ls link style - 'solid', 'dot', dash' and 'dashDot'
 */
dvt.BaseDiagramLink.prototype.setLinkStyle = function(ls) {
};

/**
 * Get the link style
 * @return {String} link style
 */
dvt.BaseDiagramLink.prototype.getLinkStyle = function() {
  return 'solid';
};

/**
 * Sets the link color
 * @param {string} lc link color
 */
dvt.BaseDiagramLink.prototype.setLinkColor = function(lc) {
};

/**
 * Gets the link color
 * @return {string} the link color
 */
dvt.BaseDiagramLink.prototype.getLinkColor = function() {
  return null;
};

/**
 * Gets connector template
 * @param {string} connectorPosition connector position - dvt.DiagramLinkConnectorUtils.START_CONNECTOR or dvt.DiagramLinkConnectorUtils.END_CONNECTOR
 * @return {dvt.AfMarker} connectorTemplate the custom connector shape if exists
 */
dvt.BaseDiagramLink.prototype.getConnectorTemplate = function(connectorPosition) {
  return null;
};

/**
 * @protected
 * Gets link style - either style for regular link or promoted link if the promoted link applicable in this case
 * @return {string} link style
 */
dvt.BaseDiagramLink.prototype.GetAppliedLinkStyle = function() {
  return this.getLinkStyle();
};

/**
 * @protected
 * Gets link width - either width for regular link or promoted link if the promoted link applicable in this case
 * @return {number} link width
 */
dvt.BaseDiagramLink.prototype.GetAppliedLinkWidth = function() {
  return this.getLinkWidth();
};

/**
 * @protected
 * Gets link color - either color for regular link or promoted link if the promoted link applicable in this case
 * @return {string} link color
 */
dvt.BaseDiagramLink.prototype.GetAppliedLinkColor = function() {
  return this.getLinkColor();
};

/**
 * @protected
 * Creates start or end connector for the link
 * @param {array} points Array of points that represent the link
 * @param {string} connectorType One of the standard connector types. See DvtDiagramLinkDef for types. The parameter is optional. Either type or template should be specified.
 * @param {number} connectorPos Connector position: 0 for start and 1 for end
 * @param {dvt.AfMarker} connectorTemplate Template used to create a connector. The parameter is optional. Either type or template should be specified.
 * @return {dvt.Shape} connector shape
 */
dvt.BaseDiagramLink.prototype.CreateConnector = function(points, connectorType, connectorPos, connectorTemplate) {

  if (!connectorType && !connectorTemplate) {
    return;
  }

  var stroke;
  if (!connectorTemplate) {
    stroke = this._shape.getStroke().clone();
    stroke.setType(dvt.Stroke.SOLID);
    stroke.setFixedWidth(false);
  }

  var connector = dvt.DiagramLinkConnectorUtils.CreateConnectorShape(this.getCtx(), connectorType, connectorTemplate, stroke, this);

  if (connector) {
    //BUG FIX #14813637: add connectors as children of shape so that selection feedback affects them
    this._shape.addChild(connector);
    dvt.DiagramLinkConnectorUtils.TransformConnector(connector, connectorType, connectorTemplate, points, connectorPos);
  }

  return connector;
};

/**
 * Gets link bounds
 * @param {dvt.Animator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @return {dvt.Rectangle} link bounds
 */
dvt.BaseDiagramLink.prototype.GetLinkBounds = function(animator) {
  var linkBounds = new dvt.Rectangle(Number.MAX_VALUE, Number.MAX_VALUE, - Number.MAX_VALUE, - Number.MAX_VALUE);
  var points = null;
  if (animator) {
    points = animator.getDestVal(this, this.getPoints);
  }
  if (!points) {
    points = this.getPoints();
  }

  if (points) {
    var controlPoints = dvt.DiagramLinkUtils.GetControlPoints(points);
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

  var bounds = new dvt.Rectangle(linkBounds.x, linkBounds.y, linkBounds.w, linkBounds.h);

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
      labelBounds = dvt.BaseDiagram.RotateBounds(labelBounds, labelRotAngle, labelRotPoint);
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
dvt.BaseDiagramLink.prototype.setPoints = function(points) {
  this._arPoints = points;
  if (!dvt.DiagramLinkUtils.IsPath(points)) {
    this._points = points;
    this._pathCmds = dvt.DiagramLinkUtils.ConvertToPath(points);
  }
  else {
    this._pathCmds = points;
    this._points = dvt.DiagramLinkUtils.ConvertToPoints(points);
  }

  if (this._shape) {

    if (this._shape instanceof dvt.Path) {
      this._shape.setCommands(this._pathCmds);

      if (!this._endConnector) {
        this._endConnector = this.CreateConnector(this._points, this.getEndConnectorType(), 1, this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.END_CONNECTOR));
      }
      else {
        dvt.DiagramLinkConnectorUtils.TransformConnector(this._endConnector, this.getEndConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.END_CONNECTOR), this._points, 1);
      }
      if (!this._startConnector) {
        this._startConnector = this.CreateConnector(this._points, this.getStartConnectorType(), 0, this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.START_CONNECTOR));
      }
      else {
        dvt.DiagramLinkConnectorUtils.TransformConnector(this._startConnector, this.getStartConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.START_CONNECTOR), this._points, 0);
      }
    }
  }
  //need to update the selection feedback when animating a link
  var underlayStart = null, underlayEnd = null;
  if (this._linkUnderlay && this._linkUnderlay.getUnderlay() instanceof dvt.Path) {
    this._linkUnderlay.getUnderlay().setCommands(this._pathCmds);
  }
  if (this._linkUnderlay && (underlayStart = this._linkUnderlay.getUnderlayStart())) {
    dvt.DiagramLinkConnectorUtils.TransformConnector(underlayStart, this.getStartConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.START_CONNECTOR), this._points, 0);
  }
  if (this._linkUnderlay && (underlayEnd = this._linkUnderlay.getUnderlayEnd())) {
    dvt.DiagramLinkConnectorUtils.TransformConnector(underlayEnd, this.getEndConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.END_CONNECTOR), this._points, 1);
  }

  //: need to update the hit detection underlay when animating
  //a link
  if (this._hitDetectionUnderlay && this._hitDetectionUnderlay.getUnderlay() instanceof dvt.Path) {
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
dvt.BaseDiagramLink.prototype.getPoints = function() {
  return this._arPoints;
};

/**
 * Gets link start position
 * @return {dvt.Point} link start position
 */
dvt.BaseDiagramLink.prototype.getLinkStart = function() {
  if (!this._points)
    return null;
  var x = this._points[0];
  var y = this._points[1];
  return new dvt.Point(x, y);
};

/**
 * Gets link end position
 * @return {dvt.Point} link end position
 */
dvt.BaseDiagramLink.prototype.getLinkEnd = function() {
  if (!this._points)
    return null;
  var numPoints = this._points.length;
  var x = this._points[numPoints - 2];
  var y = this._points[numPoints - 1];
  return new dvt.Point(x, y);
};


/**
 * @protected
 * Calculate the matrix used to rotate and position the label.
 * @param {dvt.Point} pos position of the link label
 * @param {dvt.Rectangle} bounds label bounds
 * @param {number} rotAngle rotation angle for the label
 * @param {dvt.Point} rotPoint rotation point for the label
 * @return {dvt.Matrix} matrix used to rotate and position the label
 */
dvt.BaseDiagramLink.CalcLabelMatrix = function(pos, bounds, rotAngle, rotPoint) {
  var mat = new dvt.Matrix();
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
 * @param {dvt.OutputText} label link label
 * @param {dvt.Point} pos position of the link label
 * @param {dvt.Rectangle} bounds label bounds
 * @param {number} rotAngle rotation angle for the label
 * @param {dvt.Point} rotPoint rotation point for the label
 * @protected
 */
dvt.BaseDiagramLink.PositionLabel = function(label, pos, bounds, rotAngle, rotPoint) {
  if (!label)
    return;
  var mat = dvt.BaseDiagramLink.CalcLabelMatrix(pos, bounds, rotAngle, rotPoint);
  label.setMatrix(mat);
};

/**
 * Creates link underlay - underlay for the link itself, it does not include connectors
 * @param {String} strokeColor  a css color specification for the underlay color
 * @param {String} strokeAlpha  alpha for the link underlay
 * @param {number} strokeWidthOffset offset for the stroke that is going to be added to the link width
 *                in order to create an underlay
 * @param {string=} styleClass The optional class to be applied to the underlay
 * @return {DvtDiagramLinkUnderlay} link underlay
 * @protected
 */
dvt.BaseDiagramLink.prototype.CreateUnderlay = function(strokeColor, strokeAlpha, strokeWidthOffset, styleClass) {
  if (!strokeAlpha && strokeAlpha != 0) {
    strokeAlpha = 1;
  }
  if (!strokeWidthOffset && strokeWidthOffset != 0) {
    strokeWidthOffset = 0;
  }

  var strokeWidth = this.GetAppliedLinkWidth() + strokeWidthOffset;
  var stroke = new dvt.SolidStroke(strokeColor, strokeAlpha, strokeWidth);
  return new DvtDiagramLinkUnderlay(this.getCtx(), this._pathCmds, stroke, styleClass);
};


/**
 * Creates feedback underlay used for the hover, selection effects. The underlay includes the link and the connectors.
 * @param {String} strokeColor  a css color specification for the underlay color
 * @param {String} strokeAlpha  alpha for the link underlay
 * @param {number} strokeWidthOffset offset for the stroke that is going to be added to the link width
 *                in order to create an underlay
 * @param {string=} styleClass The optional class to be applied to the underlay
 * @return {DvtDiagramLinkUnderlay} feedback underlay used for the hover, selection effects. The underlay includes the link and the connectors
 * @protected
 */
dvt.BaseDiagramLink.prototype.CreateFeedbackUnderlay = function(strokeColor, strokeAlpha, strokeWidthOffset, styleClass) {

  var feedbackUnderlay = this.CreateUnderlay(strokeColor, strokeAlpha, strokeWidthOffset, styleClass);

  if (this._startConnector && this.getStartConnectorType())
    feedbackUnderlay.addUnderlayStart(this._points, this.getStartConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.START_CONNECTOR), this);
  if (this._endConnector && this.getEndConnectorType())
    feedbackUnderlay.addUnderlayEnd(this._points, this.getEndConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.END_CONNECTOR), this);
  return feedbackUnderlay;
};

/**
 * Applies link style to a stroke
 * @param {dvt.Stroke} stroke
 * @param {boolean} bUnderlay true for underlay stroke
 * @protected
 */
dvt.BaseDiagramLink.prototype.ApplyLinkStyle = function(stroke, bUnderlay) {
  var linkStyle = this.GetAppliedLinkStyle();
  var strokeType = dvt.DiagramLinkUtils.ConvertLinkStyleToStrokeType(linkStyle);
  stroke.setType(strokeType, dvt.DiagramLinkUtils.GetStrokeDash(strokeType, bUnderlay), dvt.DiagramLinkUtils.GetStrokeDashOffset(strokeType, bUnderlay));
};

/**
 * Replaces color of a standard connector
 * @param {dvt.Container} connector link connector
 * @param {dvt.Stroke} stroke for the link connector
 */
dvt.BaseDiagramLink.prototype.ReplaceConnectorColor = function(connector, stroke) {
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
dvt.BaseDiagramLink.prototype.getNextNavigable = function(event) {
  //subclasses should override
  return null;
};

/**
 * @override
 */
dvt.BaseDiagramLink.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) {
  if (this.getGroupId() && this._diagram.getOptions()['renderer']) {
    return this._diagram.getCustomObjKeyboardBoundingBox(this);
  }
  return this.getDimensions(targetCoordinateSpace);
};


/**
 * @override
 */
dvt.BaseDiagramLink.prototype.getTargetElem = function() 
{
  return this.getElem();
};


/**
 * @override
 */
dvt.BaseDiagramLink.prototype.showKeyboardFocusEffect = function() {};

/**
 * @override
 */
dvt.BaseDiagramLink.prototype.hideKeyboardFocusEffect = function() {};

/**
 * @override
 */
dvt.BaseDiagramLink.prototype.isShowingKeyboardFocusEffect = function() {};

/**
 * Sets a node that should be used for clockwise/counterclockwise link navigation
 * @param {dvt.BaseDiagramNode} node
 */
dvt.BaseDiagramLink.prototype.setKeyboardFocusNode = function(node) {
  this._keyboardNavNode = node;
};

/**
 * Gets a node that should be used for clockwise/counterclockwise link navigation
 * @return {dvt.BaseDiagramNode} a node that should be used for clockwise/counterclockwise link navigation
 */
dvt.BaseDiagramLink.prototype.getKeyboardFocusNode = function() {
  return this._keyboardNavNode;
};

/**
 * Returns an array containing all categories to which this object belongs.
 * @return {array} The array of categories.
 */
dvt.BaseDiagramLink.prototype.getCategories = function() {
  return null;
};

/**
 * Sets the label alignments
 * system of the link's container.
 * label object guaranteed to be non-null if this method is called
 * @param {string} halign halign of the link label
 * @param {string} valign valign of the link label
 */
dvt.BaseDiagramLink.prototype.setLabelAlignments = function(halign, valign) {
  //do nothing, only for DvtDiagramNode
};

/**
 * Gets group id for the link
 * @return {string} group id for the link
 */
dvt.BaseDiagramLink.prototype.getGroupId = function() {
  return null;
};
// Copyright (c) 2011, 2016, Oracle and/or its affiliates. All rights reserved.
/**
 * Dvt Diagram layout utils
 */
dvt.DiagramLayoutUtils = {};

dvt.Obj.createSubclass(dvt.DiagramLayoutUtils, dvt.Obj, 'dvt.DiagramLayoutUtils');

dvt.DiagramLayoutUtils.gridLayout = function(layoutContext) {
  var maxNodeBounds = dvt.DiagramLayoutUtils.getMaxNodeBounds(layoutContext);
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
    dvt.DiagramLayoutUtils.centerNodeAndLabel(node, currX, currY);
  }
};

dvt.DiagramLayoutUtils.getMaxNodeBounds = function(layoutContext) {
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
  return new dvt.DiagramRectangle(0, 0, maxW, maxH);
};

dvt.DiagramLayoutUtils.centerNodeAndLabel = function(node, x, y) {
  var bounds = node.getContentBounds();
  node.setPosition(new dvt.DiagramPoint(x - bounds['x'] - bounds['w'] * .5, y - bounds['y'] - bounds['h'] * .5));
  dvt.DiagramLayoutUtils.positionNodeLabel(node);
};

dvt.DiagramLayoutUtils.positionNodeLabel = function(node) {
  var nodeBounds = node.getBounds();
  var nodePos = node.getPosition();
  var nodeLabelBounds = node.getLabelBounds();
  if (nodeLabelBounds) {
    //center label below node
    var labelX = nodeBounds['x'] + nodePos['x'] + .5 * (nodeBounds['w'] - nodeLabelBounds['w']);
    var labelY = nodeBounds['y'] + nodePos['y'] + nodeBounds['h'];
    node.setLabelPosition(new dvt.DiagramPoint(labelX, labelY));
  }
};

dvt.DiagramLayoutUtils.convertRectToDiagramRect = function(rect) {
  if (rect === undefined || rect == null)
    return null;
  else
    return new dvt.DiagramRectangle(rect.x, rect.y, rect.w, rect.h);
};

dvt.DiagramLayoutUtils.convertPointToDiagramPoint = function(point) {
  if (point === undefined || point == null)
    return null;
  else
    return new dvt.DiagramPoint(point.x, point.y);
};

dvt.DiagramLayoutUtils.convertDiagramRectToRect = function(diagramRect) {
  if (!diagramRect) {
    return null;
  }
  else {
    return new dvt.Rectangle(diagramRect['x'], diagramRect['y'], diagramRect['w'], diagramRect['h']);
  }
};

dvt.DiagramLayoutUtils.convertDiagramPointToPoint = function(diagramPoint) {
  if (!diagramPoint) {
    return null;
  }
  else {
    return new dvt.Point(diagramPoint['x'], diagramPoint['y']);
  }
};
// Copyright (c) 2011, 2017, Oracle and/or its affiliates. All rights reserved.
/**
 * @constructor
 * @class The class for the link underlay
 * @param {dvt.Context} context the rendering context
 * @param {array} points link points
 * @param {dvt.Stroke} stroke for the link underlay
 * @param {string=} styleClass The optional class to be applied to the underlay
 */
var DvtDiagramLinkUnderlay = function(context, points, stroke, styleClass)
{
  DvtDiagramLinkUnderlay.superclass.Init.call(this, context);
  this.Init(context, points, stroke, styleClass);
};

dvt.Obj.createSubclass(DvtDiagramLinkUnderlay, dvt.Container, 'DvtDiagramLinkUnderlay');

/**
 * Initialization method called by the constructor
 * @param {dvt.Context} context the rendering context
 * @param {array} points link points
 * @param {dvt.Stroke} stroke for the link underlay
 * @param {string=} styleClass The optional class to be applied to the underlay
 * @protected
 */
DvtDiagramLinkUnderlay.prototype.Init = function(context, points, stroke, styleClass)
{
  if (!points)
    points = ['M', 0, 0, 'L', 1, 0];

  this._stroke = stroke;
  if (!this._stroke)
    this._stroke = new dvt.SolidStroke('#ffffff', 1, 1);
  stroke.setFixedWidth(true);

  this._underlay = new dvt.Path(context, points);
  this._underlay.setStroke(stroke);
  this._underlay.setFill(null);
  if (styleClass) {
    this._styleClass = styleClass;
    this._underlay.setClassName(styleClass);
  }
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
 * @param {string} connectorType the connector type if using a built-in connector, defined in dvt.AdfDiagramLinkDef
 * @param {dvt.AfMarker} connectorTemplate the custom connector shape
 * @param {dvt.AdfDiagramLink} parentLink the associated parent link
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
 * @param {string} connectorType the connector type if using a built-in connector, defined in dvt.AdfDiagramLinkDef
 * @param {dvt.AfMarker} connectorTemplate the custom connector shape
 * @param {dvt.AdfDiagramLink} parentLink the associated parent link
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
 * @param {string} connectorType the connector type if using a built-in connector, defined in dvt.AdfDiagramLinkDef
 * @param {dvt.AfMarker} connectorTemplate the custom connector shape
 * @param {dvt.AdfDiagramLink} parentLink the associated parent link
 * @param {number} connectorPos 0 for the startConnector, 1 for the endConnector
 * @return {dvt.Shape} the underlay shape
 */
DvtDiagramLinkUnderlay.prototype.CreateConnectorUnderlay = function(points, connectorType, connectorTemplate, parentLink, connectorPos) {
  var stroke = this._stroke.clone();
  // link stroke uses fixed width, but link connectors are be scalable, so reset fixed width property for the link connector stroke
  stroke.setFixedWidth(false);

  var connectorUnderlay = dvt.DiagramLinkConnectorUtils.CreateConnectorShape(this.getCtx(), connectorType, connectorTemplate, stroke, parentLink);
  if (this._styleClass) {
    connectorUnderlay.setClassName(this._styleClass);
  }

  dvt.DiagramLinkConnectorUtils.TransformConnector(connectorUnderlay,
      connectorType,
      connectorTemplate,
      points, connectorPos);
  return connectorUnderlay;
};

/**
 * Gets underlay shape
 * @return {dvt.Path} underlay shape
 */
DvtDiagramLinkUnderlay.prototype.getUnderlay = function() {
  return this._underlay;
};

/**
 * Gets underlay for the start connector
 * @return {dvt.Container} underlay for the start connector
 */
DvtDiagramLinkUnderlay.prototype.getUnderlayStart = function() {
  return this._underlayStart;
};

/**
 * Gets underlay for the end connector
 * @return {dvt.Container} underlay for the end connector
 */
DvtDiagramLinkUnderlay.prototype.getUnderlayEnd = function() {
  return this._underlayEnd;
};


/**
 * Sets stroke on underlays - link underlay, start and end connector underlays
 * @param {dvt.Stroke} stroke Stroke for the underlays
 * @param {number} strokeOffset the desired difference in size between the parent link width and the underlay link width
 */
DvtDiagramLinkUnderlay.prototype.setStroke = function(stroke, strokeOffset) {
  this._stroke = stroke;
  stroke.setFixedWidth(true);
  this._underlay.setStroke(stroke);

  if (this._underlayStart) {
    var startStroke = stroke.clone();
    startStroke.setType(dvt.Stroke.SOLID);
    startStroke.setFixedWidth(false);
    if (this._underlayStartType == dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW ||
        this._underlayStartType == dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE) {
      startStroke.setWidth(strokeOffset);
      this._underlayStart.setSolidFill(stroke.getColor());
    }
    this._underlayStart.setStroke(startStroke);
  }

  if (this._underlayEnd) {
    var endStroke = stroke.clone();
    endStroke.setType(dvt.Stroke.SOLID);
    endStroke.setFixedWidth(false);
    if (this._underlayEndType == dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW ||
        this._underlayEndType == dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE) {
      endStroke.setWidth(strokeOffset);
      this._underlayEnd.setSolidFill(stroke.getColor());
    }
    this._underlayEnd.setStroke(endStroke);
  }
};

/**
 * Gets underlay stroke
 * @return {dvt.Stroke} underlay stroke
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
/**
 * Dvt Diagram Link Utils
 */
dvt.DiagramLinkUtils = {
};

dvt.Obj.createSubclass(dvt.DiagramLinkUtils, dvt.Obj, 'dvt.DiagramLinkUtils');

/**
 * Converts link style to stroke type
 * @param {string} linkStyle link style, values are 'solid', 'dash', 'dot', 'dashDot'
 * @return {number} stroke type
 * @protected
 */
dvt.DiagramLinkUtils.ConvertLinkStyleToStrokeType = function(linkStyle) {
  var strokeType = dvt.Stroke.SOLID;
  switch (linkStyle) {
    case 'dash':
      strokeType = dvt.Stroke.DASHED;
      break;
    case 'dot':
      strokeType = dvt.Stroke.DOTTED;
      break;
    case 'dashDot':
      strokeType = dvt.Stroke.DASHED_DOTTED;
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
dvt.DiagramLinkUtils.GetStrokeDash = function(strokeType, bUnderlay) {
  if (dvt.Stroke.SOLID == strokeType) {
    return null;
  }
  // For underlays, increase the dashes by 2 (1 pixel on each side) and decrease the gaps by 2 (1 pixel on each side)
  else if (dvt.Stroke.DASHED == strokeType) {
    return bUnderlay ? '8,2' : '6,4';
  }
  else if (dvt.Stroke.DOTTED == strokeType) {
    return bUnderlay ? '4,1' : '2,3';
  }
  else if (dvt.Stroke.DASHED_DOTTED == strokeType) {
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
dvt.DiagramLinkUtils.GetStrokeDashOffset = function(strokeType, bUnderlay) {
  if (bUnderlay && dvt.Stroke.SOLID != strokeType) {
    return 1;
  }
  return null;
};

/**
 * Get the stroke object representation for the the passed link style
 * @param {string} linkStyle link style, values are 'solid', 'dash', 'dot', 'dashDot'
 * @param {boolean} bUnderlay true for underlay stroke
 * @return {object} stroke object
 */
dvt.DiagramLinkUtils.getStrokeObject = function(linkStyle, bUnderlay) {
  var strokeType = dvt.DiagramLinkUtils.ConvertLinkStyleToStrokeType(linkStyle);
  return {'_type' : linkStyle,
    'strokeDasharray' : dvt.DiagramLinkUtils.GetStrokeDash(strokeType, bUnderlay),
    'strokeDashoffset' : dvt.DiagramLinkUtils.GetStrokeDashOffset(strokeType, bUnderlay)};
};

/**
 * Process the strok dash array.
 * If an odd number of values is provided, then the list of values is repeated to yield an even number of values
 * @param {string} strokeDashArray stroke-dasharray attributes
 * @return {string} processed stroke dasharray
 */
dvt.DiagramLinkUtils.processStrokeDashArray = function(strokeDashArray) {
  if (strokeDashArray) {
    var dashArray = strokeDashArray.split(/[\s,]+/);
    //Convert odd number of array values to even number of values by copying itself
    if (dashArray.length % 2 > 0)
      dashArray = dashArray.concat(dashArray);
    return dashArray.toString();
  }
  return strokeDashArray;
};

/**
 * Get the under for the passed stroke dash array
 * The stroke dasharray attribute controls the pattern of dashes and gaps used to stroke paths.
 * @param {string} strokeDashArray stroke-dasharray attributes
 * @return {string} underlay for the passed stroke dash array
 */
dvt.DiagramLinkUtils.getCustomUnderlay = function(strokeDashArray) {
  if (strokeDashArray) {
    var dashArray = strokeDashArray.split(/[\s,]+/);
    var stringBuf = '';
    //Do the +2, -2 transformation on the resulting even length array. +2 for the dash and -2 for the dot
    for (var index = 0; index < dashArray.length; index++) {
      var item = dvt.CSSStyle.toNumber(dvt.StringUtils.trim(dashArray[index]));
      stringBuf += (index % 2 == 0) ? (item + 2) : (item >= 2 ? item - 2 : 0);
      if (index < dashArray.length - 1)
        stringBuf += ', ';
    }
    return stringBuf;
  }
  return null;
};

/**
 * @protected
 * Create an array of path commands from an array of points.
 * @param {array} points used for rendering a link
 * @return {array} array as SVG path commands
 */
dvt.DiagramLinkUtils.ConvertToPath = function(points) {
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
dvt.DiagramLinkUtils.ConvertToPoints = function(pathCmds) {
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
dvt.DiagramLinkUtils.IsPath = function(points) {
  if (points && points.length > 0) {
    return isNaN(points[0]);
  }
  return false;
};

/**
 * Gets array of control points
 * @param {array} points points used for rendering a link
 * @return {array} control points for a link as an array of dvt.Point objects
 */
dvt.DiagramLinkUtils.GetControlPoints = function(points) {
  var controlPoints = [];
  var coords;
  if (dvt.DiagramLinkUtils.IsPath(points)) {
    coords = dvt.DiagramLinkUtils.ConvertToPoints(points);
  }
  else {
    coords = points;
  }
  for (var i = 0; i < coords.length; i += 2) {
    controlPoints.push(new dvt.Point(coords[i], coords[i + 1]));
  }
  return controlPoints;
};
/**
 * Dvt Diagram Link Connector utils
 */
dvt.DiagramLinkConnectorUtils = {};

dvt.Obj.createSubclass(dvt.DiagramLinkConnectorUtils, dvt.Obj, 'dvt.DiagramLinkConnectorUtils');

/**
 * Link end connector
 * @const
 */
dvt.DiagramLinkConnectorUtils.END_CONNECTOR = 'endConnector';
/**
 * Link start connector
 * @const
 */
dvt.DiagramLinkConnectorUtils.START_CONNECTOR = 'startConnector';
/**
 * Arrowhead that looks like an angle bracket
 * @const
 */
dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_OPEN = 'arrowOpen';
/**
 * Filled triangle arrowhead
 * @const
 */
dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW = 'arrow';
/**
 * Filled triangle arrowhead with base flare
 * @const
 */
dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE = 'arrowConcave';
/**
 * Rectangle
 * @const
 */
dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE = 'rectangle';
/**
 * Rounded rectangle
 * @const
 */
dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE_ROUNDED = 'rectangleRounded';
/**
 * Circle
 * @const
 */
dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_CIRCLE = 'circle';

/**
 * Creates the shape for a link connector
 * @param {dvt.Context} context the rendering context
 * @param {string} connectorType the connector type if using a built-in connector, defined in DvtDiagramLinkDef
 * @param {dvt.AfMarker} connectorTemplate the custom connector shape
 * @param {dvt.Stroke} stroke the stroke to apply to the built-in connector, if applicable
 * @param {DvtDiagramLink} parentLink the associated parent link
 * @return {dvt.Shape} the connector shape
 * @protected
 */
dvt.DiagramLinkConnectorUtils.CreateConnectorShape = function(context, connectorType, connectorTemplate, stroke, parentLink) {
  if (connectorTemplate) {
    return dvt.DiagramLinkConnectorUtils.CreateCustomConnector(context, connectorTemplate, parentLink);
  }

  var linkWidth = parentLink.GetAppliedLinkWidth();

  switch (connectorType) {
    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW:
      return dvt.DiagramLinkConnectorUtils.CreateFilledArrowConnector(context, linkWidth, parentLink.getLinkColor());

    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE:
      return dvt.DiagramLinkConnectorUtils.CreateFilledConcaveArrowConnector(context, linkWidth, parentLink.getLinkColor());

    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_OPEN:
      return dvt.DiagramLinkConnectorUtils.CreateOpenArrowConnector(context, linkWidth, stroke);

    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_CIRCLE:
      return dvt.DiagramLinkConnectorUtils.CreateCircleConnector(context, linkWidth, stroke);

    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE:
      return dvt.DiagramLinkConnectorUtils.CreateRectangleConnector(context, linkWidth, stroke);

    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE_ROUNDED:
      return dvt.DiagramLinkConnectorUtils.CreateRoundedRectangleConnector(context, linkWidth, stroke);
  }
  return null;
};


/**
 * @protected
 */
dvt.DiagramLinkConnectorUtils.TransformConnector = function(connector, connectorType, connectorTemplate, points, connectorPos)
{
  var mat = dvt.DiagramLinkConnectorUtils.CalcConnectorTransform(connector, connectorType, connectorTemplate, points, connectorPos);
  connector.setMatrix(mat);
};


/**
 * @protected
 */
dvt.DiagramLinkConnectorUtils.CalcConnectorTransform = function(connector, connectorType, connectorTemplate, points, connectorPos)
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
  var angleRads = dvt.DiagramLinkConnectorUtils.CalcConnectorRotation(x1, y1, x2, y2);

  var origMat = connector._connectorOrigMat;
  if (!origMat)
  {
	origMat = connector.getMatrix().clone();
	connector._connectorOrigMat = origMat;
  }

  var tMat = new dvt.Matrix();

  // 1) translate custom connector so that origin is at center, where link will
  //   connect
  // 2) rotate connector about center
  // 3) translate rotated connect to start/end of link
  //

  if (connectorTemplate) {
    var dims = dvt.DiagramLinkConnectorUtils._getCachedDims(connector);
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

dvt.DiagramLinkConnectorUtils._getCachedDims = function(connector) {
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
dvt.DiagramLinkConnectorUtils.CalcConnectorRotation = function(x1, y1, x2, y2)
{
  var diffY = y2 - y1;
  var diffX = x2 - x1;
  var angleRads = Math.atan2(diffY, diffX);
  return angleRads;
};


/**
 * Creates the connector shape for type dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE
 *
 * @param {dvt.Context} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {string} linkColor the color of the associated link
 *
 * @protected
 */
dvt.DiagramLinkConnectorUtils.CreateFilledConcaveArrowConnector = function(context, linkWidth, linkColor) {
  var scaleFactor = dvt.DiagramLinkConnectorUtils._getReduce(linkWidth, .5);
  var arrowLength = scaleFactor * 6;
  var arrowWidth = arrowLength * .8;

  var points = [-.22 * arrowLength, -.5 * arrowWidth,
                .78 * arrowLength, 0,
                -.22 * arrowLength, .5 * arrowWidth,
                0, 0];

  var filledArrowHead = new dvt.Polygon(context, points);
  filledArrowHead.setSolidFill(linkColor);
  return filledArrowHead;
};


/**
 * Creates the connector shape for type dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW
 *
 * @param {dvt.Context} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {string} linkColor the color of the associated link
 *
 * @protected
 */
dvt.DiagramLinkConnectorUtils.CreateFilledArrowConnector = function(context, linkWidth, linkColor) {
  var scaleFactor = dvt.DiagramLinkConnectorUtils._getReduce(linkWidth, .5);
  var arrowLength = scaleFactor * 5;
  var arrowWidth = arrowLength * .8;

  var points = [0, -.5 * arrowWidth,
                arrowLength, 0,
                0, .5 * arrowWidth];

  var filledArrowHead = new dvt.Polygon(context, points);
  filledArrowHead.setSolidFill(linkColor);
  return filledArrowHead;
};


//
// Function to size the arrow head non-linearly
//
/**
 * @protected
 */
dvt.DiagramLinkConnectorUtils._getReduce = function(length, fract) {

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
 * Creates the connector shape for type dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_OPEN
 *
 * @param {dvt.Context} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {dvt.Stroke} stroke the stroke to apply to the shape
 *
 * @protected
 */
dvt.DiagramLinkConnectorUtils.CreateOpenArrowConnector = function(context, linkWidth, stroke) {
  var arrowWidth = linkWidth * 3;
  var strokeWidth = stroke.getWidth();

  var points = [-arrowWidth + strokeWidth * Math.sqrt(2) / 2, -arrowWidth,
                strokeWidth * Math.sqrt(2) / 2, 0,
                -arrowWidth + strokeWidth * Math.sqrt(2) / 2, arrowWidth];

  var arrowHead = new dvt.Polyline(context, points);
  arrowHead.setStroke(stroke);
  arrowHead.setFill(null);

  return arrowHead;
};


/**
 * @protected
 */
dvt.DiagramLinkConnectorUtils.getCircleRadius = function(linkWidth) {

  var radius = linkWidth * 2;
  return radius;

};

dvt.DiagramLinkConnectorUtils.getRectangleLength = function(linkWidth) {

  var length = linkWidth * 3;
  return length;

};


/**
 * Creates the connector shape for type dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_CIRCLE
 *
 * @param {dvt.Context} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {dvt.Stroke} stroke the stroke to apply to the shape
 *
 * @protected
 */
dvt.DiagramLinkConnectorUtils.CreateCircleConnector = function(context, linkWidth, stroke) {
  var radius = dvt.DiagramLinkConnectorUtils.getCircleRadius(linkWidth);
  var conShape = new dvt.Circle(context, radius, 0, radius);
  conShape.setStroke(stroke);
  conShape.setFill(null);
  return conShape;
};


/**
 * Creates the connector shape for type dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE
 *
 * @param {dvt.Context} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {dvt.Stroke} stroke the stroke to apply to the shape
 *
 * @protected
 */
dvt.DiagramLinkConnectorUtils.CreateRectangleConnector = function(context, linkWidth, stroke) {
  var length = dvt.DiagramLinkConnectorUtils.getRectangleLength(linkWidth);
  var conShape = new dvt.Rect(context, 0 , -length / 2, length, length);
  conShape.setStroke(stroke);
  conShape.setFill(null);
  return conShape;
};


/**
 * Creates the connector shape for type dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE
 *
 * @param {dvt.Context} context the rendering context
 * @param {number} linkWidth the width of the associated link
 * @param {dvt.Stroke} stroke the stroke to apply to the shape
 *
 * @protected
 */
dvt.DiagramLinkConnectorUtils.CreateRoundedRectangleConnector = function(context, linkWidth, stroke) {
  var conShape = dvt.DiagramLinkConnectorUtils.CreateRectangleConnector(context, linkWidth, stroke);
  conShape.setCornerRadius(linkWidth);
  return conShape;
};


/**
 * Creates the shape for a custom connector
 * @param {dvt.Context} context the rendering context
 * @param {dvt.AfMarker} connectorTemplate the template to stamp out the custom shape
 * @param {DvtDiagramLink} parentLink the associated parent link
 * @protected
 */
dvt.DiagramLinkConnectorUtils.CreateCustomConnector = function(context, connectorTemplate, parentLink) {
  var afContext = parentLink.GetDiagram().createAfContext();
  afContext.setELContext(parentLink.getData().getElAttributes());
  // add action listener to the command objects in the link
  afContext.setContextCallback(parentLink, parentLink.eventContextCallback);
  afContext.setTabStopsArray(parentLink.getTabStopsArray());
  var connector = dvt.AfComponentFactory.parseAndLayout(afContext, connectorTemplate, parentLink);
  return connector;
};


/**
 * Calculates the distance between the tip of the connector (i.e. the part that should touch the node) and the end of the link path
 *
 * @param {dvt.Shape} connector the connector shape
 * @param {string} connectorType the connector type if using a built-in connector, defined in DvtDiagramLinkDef
 * @param {dvt.AfMarker} connectorTemplate the custom connector shape
 * @param {dvt.Stroke} stroke the stroke applied to the built-in connector, if applicable
 * @param {DvtDiagramLink} parentLink the associated parent link
 * @return {number} the connector offset
 *
 * @protected
 */
dvt.DiagramLinkConnectorUtils.GetConnectorOffset = function(connector, connectorType, connectorTemplate, stroke, parentLink) {
  if (connectorTemplate) {
    var dims = dvt.DiagramLinkConnectorUtils._getCachedDims(connector);
    var connScaleX = connector.getScaleX();
    var offsetX = .5 * (dims.w * connScaleX);
    return offsetX;
  }
  return dvt.DiagramLinkConnectorUtils.getStandardConnectorOffset(connectorType, parentLink.GetAppliedLinkWidth(), stroke.getWidth());
};

/**
 * Calculates the distance between the tip of the connector (i.e. the part that should touch the node) and the end of the link path
 * for the standard link type
 * @param {string} connectorType the connector type if using a built-in connector, defined in DvtDiagramLinkDef
 * @param {number} linkWidth link width
 * @param {number} strokeWidth stroke width
 * @return {number} the connector offset
 */
dvt.DiagramLinkConnectorUtils.getStandardConnectorOffset = function(connectorType, linkWidth, strokeWidth) {
  switch (connectorType) {
    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_OPEN:
      return (strokeWidth * Math.sqrt(2));

    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW:
      var scaleFactor = dvt.DiagramLinkConnectorUtils._getReduce(linkWidth, .5);
      var arrowLength = scaleFactor * 5;
      return arrowLength;

    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE:
      var scaleFactor = dvt.DiagramLinkConnectorUtils._getReduce(linkWidth, .5);
      var arrowLength = scaleFactor * 6;
      return .78 * arrowLength;

    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_CIRCLE:
      var radius = dvt.DiagramLinkConnectorUtils.getCircleRadius(strokeWidth);
      return 2 * radius + strokeWidth / 2;


    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE:
    case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_RECTANGLE_ROUNDED:
      var length = dvt.DiagramLinkConnectorUtils.getRectangleLength(strokeWidth);
      return length + strokeWidth / 2;

    default:
      return 0;
  }
};
dvt.exportProperty(dvt.BaseDiagram.prototype, 'setInitAnim', dvt.BaseDiagram.prototype.setInitAnim);

dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getLayout', DvtDiagramLayoutContext.prototype.getLayout);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getLayoutAttributes', DvtDiagramLayoutContext.prototype.getLayoutAttributes);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getNodeById', DvtDiagramLayoutContext.prototype.getNodeById);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getNodeByIndex', DvtDiagramLayoutContext.prototype.getNodeByIndex);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getNodeCount', DvtDiagramLayoutContext.prototype.getNodeCount);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getLinkById', DvtDiagramLayoutContext.prototype.getLinkById);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getLinkByIndex', DvtDiagramLayoutContext.prototype.getLinkByIndex);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getLinkCount', DvtDiagramLayoutContext.prototype.getLinkCount);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'localToGlobal', DvtDiagramLayoutContext.prototype.localToGlobal);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'isLocaleR2L', DvtDiagramLayoutContext.prototype.isLocaleR2L);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getComponentSize', DvtDiagramLayoutContext.prototype.getComponentSize);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'setViewport', DvtDiagramLayoutContext.prototype.setViewport);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getViewport', DvtDiagramLayoutContext.prototype.getViewport);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getContainerId', DvtDiagramLayoutContext.prototype.getContainerId);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'setContainerPadding', DvtDiagramLayoutContext.prototype.setContainerPadding);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getContainerPadding', DvtDiagramLayoutContext.prototype.getContainerPadding);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getCurrentViewport', DvtDiagramLayoutContext.prototype.getCurrentViewport);
dvt.exportProperty(DvtDiagramLayoutContext.prototype, 'getCommonContainer', DvtDiagramLayoutContext.prototype.getCommonContainer);

dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getId', DvtDiagramLayoutContextNode.prototype.getId);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getBounds', DvtDiagramLayoutContextNode.prototype.getBounds);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getContentBounds', DvtDiagramLayoutContextNode.prototype.getContentBounds);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'setPosition', DvtDiagramLayoutContextNode.prototype.setPosition);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getPosition', DvtDiagramLayoutContextNode.prototype.getPosition);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getRelativePosition', DvtDiagramLayoutContextNode.prototype.getRelativePosition);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'setLabelPosition', DvtDiagramLayoutContextNode.prototype.setLabelPosition);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getLabelPosition', DvtDiagramLayoutContextNode.prototype.getLabelPosition);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getLabelBounds', DvtDiagramLayoutContextNode.prototype.getLabelBounds);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getLayoutAttributes', DvtDiagramLayoutContextNode.prototype.getLayoutAttributes);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'isReadOnly', DvtDiagramLayoutContextNode.prototype.isReadOnly);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getContainerId', DvtDiagramLayoutContextNode.prototype.getContainerId);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getSelected', DvtDiagramLayoutContextNode.prototype.getSelected);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'setLabelRotationAngle', DvtDiagramLayoutContextNode.prototype.setLabelRotationAngle);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getLabelRotationAngle', DvtDiagramLayoutContextNode.prototype.getLabelRotationAngle);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'setLabelRotationPoint', DvtDiagramLayoutContextNode.prototype.setLabelRotationPoint);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getLabelRotationPoint', DvtDiagramLayoutContextNode.prototype.getLabelRotationPoint);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'setContainerPadding', DvtDiagramLayoutContextNode.prototype.setContainerPadding);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getContainerPadding', DvtDiagramLayoutContextNode.prototype.getContainerPadding);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'setDisclosed', DvtDiagramLayoutContextNode.prototype.setDisclosed);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'isDisclosed', DvtDiagramLayoutContextNode.prototype.isDisclosed);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'setChildNodes', DvtDiagramLayoutContextNode.prototype.setChildNodes);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getChildNodes', DvtDiagramLayoutContextNode.prototype.getChildNodes);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getParentNode', DvtDiagramLayoutContextNode.prototype.getParentNode);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'setLabelValign', DvtDiagramLayoutContextNode.prototype.setLabelValign);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'setLabelHalign', DvtDiagramLayoutContextNode.prototype.setLabelHalign);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getLabelValign', DvtDiagramLayoutContextNode.prototype.getLabelValign);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getLabelHalign', DvtDiagramLayoutContextNode.prototype.getLabelHalign);
dvt.exportProperty(DvtDiagramLayoutContextNode.prototype, 'getData', DvtDiagramLayoutContextNode.prototype.getData);

dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getId', DvtDiagramLayoutContextLink.prototype.getId);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getStartId', DvtDiagramLayoutContextLink.prototype.getStartId);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getEndId', DvtDiagramLayoutContextLink.prototype.getEndId);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'setPoints', DvtDiagramLayoutContextLink.prototype.setPoints);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getPoints', DvtDiagramLayoutContextLink.prototype.getPoints);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'setLabelPosition', DvtDiagramLayoutContextLink.prototype.setLabelPosition);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getLabelPosition', DvtDiagramLayoutContextLink.prototype.getLabelPosition);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getLabelBounds', DvtDiagramLayoutContextLink.prototype.getLabelBounds);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getStartConnectorOffset', DvtDiagramLayoutContextLink.prototype.getStartConnectorOffset);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getEndConnectorOffset', DvtDiagramLayoutContextLink.prototype.getEndConnectorOffset);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getLinkWidth', DvtDiagramLayoutContextLink.prototype.getLinkWidth);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getLayoutAttributes', DvtDiagramLayoutContextLink.prototype.getLayoutAttributes);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getSelected', DvtDiagramLayoutContextLink.prototype.getSelected);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'setLabelRotationAngle', DvtDiagramLayoutContextLink.prototype.setLabelRotationAngle);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'setLabelRotationAngle', DvtDiagramLayoutContextLink.prototype.getLabelRotationAngle);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'setLabelRotationPoint', DvtDiagramLayoutContextLink.prototype.setLabelRotationPoint);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getLabelRotationPoint', DvtDiagramLayoutContextLink.prototype.getLabelRotationPoint);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'isPromoted', DvtDiagramLayoutContextLink.prototype.isPromoted);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'setLabelValign', DvtDiagramLayoutContextLink.prototype.setLabelValign);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'setLabelHalign', DvtDiagramLayoutContextLink.prototype.setLabelHalign);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getLabelValign', DvtDiagramLayoutContextLink.prototype.getLabelValign);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getLabelHalign', DvtDiagramLayoutContextLink.prototype.getLabelHalign);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'setCoordinateSpace', DvtDiagramLayoutContextLink.prototype.setCoordinateSpace);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getCoordinateSpace', DvtDiagramLayoutContextLink.prototype.getCoordinateSpace);
dvt.exportProperty(DvtDiagramLayoutContextLink.prototype, 'getData', DvtDiagramLayoutContextLink.prototype.getData);

dvt.exportProperty(dvt, 'DiagramPoint', dvt.DiagramPoint);
dvt.exportProperty(dvt, 'DiagramRectangle', dvt.DiagramRectangle);
})(dvt);

(function(dvt) {
/**
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @constructor
 */
dvt.Diagram = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.Diagram, dvt.BaseDiagram);

/**
 * Initialization method called by the constructor
 *
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 */
dvt.Diagram.prototype.Init = function(context, callback, callbackObj) {
  dvt.Diagram.superclass.Init.call(this, context, callback, callbackObj);
  // Create the defaults object
  this.Defaults = new DvtDiagramDefaults();

  // Create the event handler and add event listeners
  this.EventManager = new DvtDiagramEventManager(context, this.processEvent, this);
  this.EventManager.addListeners(this);

  // Set up keyboard handler on non-touch devices
  if (!dvt.Agent.isTouchDevice())
    this.EventManager.setKeyboardHandler(new DvtDiagramKeyboardHandler(this, this.EventManager));

  this._nodes = {};
  this._arNodeIds = [];
  this._arRootIds = [];
  this._links = {};
  this._arLinkIds = [];
  this._renderCount = 0;
  this._deferredObjCount = 0;
  this._allNodeIdsMap = {};
  this._unresolvedNodeIds = []; // used to discover end-point nodes for promoted links
  this._nodesToResolve = []; // used for resolving container nodes during breadth-first search
};

/**
 * Returns a new instance of dvt.Diagram. Currently only called by json supported platforms.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {dvt.Diagram}
 */
dvt.Diagram.newInstance = function(context, callback, callbackObj) {
  return new dvt.Diagram(context, callback, callbackObj);
};

/**
 * @override
 */
dvt.Diagram.prototype.PreRender = function() {
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
        'nodes': this._nodes ? this.GetAllNodesMap() : {},
        'roots': this._arRootIds ? this.GetRootNodeObjects() : [],
        'links': this._links ? this.GetAllLinkObjects() : [],
        'linkIds' : this.GetAllLinks(),
        'getNodes': function() {return this['nodes'];},
        'getRoots': function() {return this['roots'];},
        'getLinks': function() {return this['links'];},
        'getLinkIds': function() {return this['linkIds'];}
      };

      // Also expose functions directly, since it will be called by internal code that is renamed.
      this._oldDataAnimState.getOptions = this._oldDataAnimState['getOptions'];
      this._oldDataAnimState.getPanZoomMatrix = this._oldDataAnimState['getPanZoomMatrix'];
      this._oldDataAnimState.getId = this._oldDataAnimState['getId'];
      this._oldDataAnimState.getNodes = this._oldDataAnimState['getNodes'];
      this._oldDataAnimState.getRoots = this._oldDataAnimState['getRoots'];
      this._oldDataAnimState.getLinks = this._oldDataAnimState['getLinks'];
      this._oldDataAnimState.getLinkIds = this._oldDataAnimState['getLinkIds'];
    }
    this._currentViewport = this.getPanZoomCanvas().getViewport();
    this._bRendered = false;
    // save old pan zoom canvas for data transitions
    this._oldPanZoomCanvas = this.getPanZoomCanvas();
    this._setDataSourceListeners(this.getOptions()['data'], false);
  }
  if (!this.IsResize()) {
    this.ResetNodesAndLinks();
  }
};

/**
 * Resets nodes and links
 * @protected
 */
dvt.Diagram.prototype.ResetNodesAndLinks = function() {
  this.setLinksPane(new dvt.Container(this.getCtx()));
  this.setNodesPane(new dvt.Container(this.getCtx()));
  this.setTopPane(new dvt.Container(this.getCtx()));
  this._nodes = {};
  this._arNodeIds = [];
  this._arRootIds = [];
  this._links = {};
  this._arLinkIds = [];
  // Make sure we're not holding references to any obsolete nodes/links
  this._highlightedObjects = null;
  this._promotedLinksMap = null;
  this._collapsedNodes = null;
  this.getOptions()['nodes'] = [];
  this.getOptions()['links'] = [];
  this._allNodeIdsMap = {};
  this._unresolvedNodeIds = [];
};

/**
 * Hook for cleaning up animation behavior at the end of the animation.
 * @private
 */
dvt.Diagram.prototype._onAnimationEnd = function() {

  if (this._deleteContainer) {
    this.removeChild(this._deleteContainer);
    this._deleteContainer.destroy();
  }
  this._deleteContainer = null;

  if (this.Animation) {
    // Restore event listeners
    this.getEventManager().addListeners(this);
  }
  if (!this.AnimationStopped) {
    this.RenderComplete();
  }

  // Reset animation flags
  this.Animation = null;
  this.AnimationStopped = false;
  if (this._bRendered) {
    this._oldDataAnimState = null;
  }
};

/**
 * @override
 */
dvt.Diagram.prototype.animateUpdate = function(animationHandler, oldDiagramState) {
  var playable = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());
  var oldMat = oldDiagramState.getPanZoomMatrix();
  var newMat = this.getPanZoomCanvas().getContentPane().getMatrix();
  if (!oldMat.equals(newMat)) {
    this.getPanZoomCanvas().getContentPane().setMatrix(oldMat);
    playable.getAnimator().addProp(dvt.Animator.TYPE_MATRIX, this.getPanZoomCanvas().getContentPane(), this.getPanZoomCanvas().getContentPane().getMatrix, this.getPanZoomCanvas().getContentPane().setMatrix, newMat);
  }
  animationHandler.constructAnimation(oldDiagramState.getRoots(), this._arRootIds ? this.GetRootNodeObjects() : []);
  animationHandler.constructAnimation(oldDiagramState.getLinks(), this._links ? this.GetAllLinkObjects() : []);
  animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);
};

/**
 * Resolves deferred child nodes and links data. Calls RenderComponentInternal() when all deferred data are resolved.
 * @param {oj.DiagramDataSource} dataSource oj.DiagramDataSource object that handles data for the component
 * @param {Object} nodeData option value for the individual node that might have child nodes to be resolved
 * @private
 */
dvt.Diagram.prototype._resolveDeferredData = function(dataSource, nodeData) {
  if (nodeData == null || this._isNodeDisclosed(nodeData['id']) || this._discoverLinks(dataSource, nodeData)) {
    var childData = dataSource['getData'](nodeData);
    this._deferredObjCount++;
    var thisRef = this;
    var renderCount = this._renderCount;
    childData.then(
        function(value) {
          thisRef._renderDeferredData(renderCount, dataSource, nodeData ? nodeData : thisRef.getOptions(), value);
        },
        function(reason) {
          thisRef._renderDeferredData(renderCount, dataSource, nodeData ? nodeData : thisRef.getOptions(), null);
        }
    );
  }
};

/**
 * Updates nodes option with resolved option, resolve child nodes if needed,
 * calls RenderComponentInternal() when all deferred options are resolved
 * @param {number} renderCount render count
 * @param {oj.DiagramDataSource} dataSource oj.DiagramDataSource object that handles data for the component
 * @param {Object} nodeData option value for the individual node that might have child nodes to be resolved
 * @param {Object} resolvedData child data object or null if the promise got rejected
 * @private
 */
dvt.Diagram.prototype._renderDeferredData = function(renderCount, dataSource, nodeData, resolvedData) {
  if (renderCount === this._renderCount) {
    if (resolvedData != null) {
      nodeData['nodes'] = dvt.JsonUtils.clone(resolvedData['nodes']);
      //add links to top level links option
      if (Array.isArray(resolvedData['links'])) {
        this.getOptions()['links'] = this.getOptions()['links'].concat(resolvedData['links']);
      }
      this._findUnresolvedLinks(resolvedData);
      if (Array.isArray(nodeData['nodes'])) {
        this._nodesToResolve = this._nodesToResolve.concat(nodeData['nodes']);
        while (this._nodesToResolve.length > 0) {
          this._resolveDeferredData(dataSource, this._nodesToResolve.shift());
        }
      }
    }
    else {
      nodeData['nodes'] = null;
    }
    this._deferredObjCount--;
    if (this._deferredObjCount === 0) {
      this.RenderComponentInternal();
    }
  }
};

/**
 * Helper function that processes nodes and links data in order to build an array of unresolved nodes
 * that are needed for rendering promoted links
 * @param {Object} data an object that contains nodes and links arrays
 * @private
 */
dvt.Diagram.prototype._findUnresolvedLinks = function(data) {
  //do nothing if the component does not display promoted links
  if (this.getOptions()['promotedLinkBehavior'] === 'none') {
    return;
  }

  //add all node ids to a map
  if (Array.isArray(data['nodes'])) {
    for (var i = 0; i < data['nodes'].length; i++) {
      this._allNodeIdsMap[data['nodes'][i]['id']] = true;
    }
  }
  //update existing unresolved array - delete entries if nodes are found
  for (var i = this._unresolvedNodeIds.length - 1; i >= 0; i--) {
    if (this._allNodeIdsMap[this._unresolvedNodeIds[i]]) {
      this._unresolvedNodeIds.splice(i, 1);
    }
  }
  //if data contain additional links, add unresolved nodes to the array
  if (Array.isArray(data['links'])) {
    for (var i = 0; i < data['links'].length; i++) {
      var link = data['links'][i];
      if (!this._allNodeIdsMap[link['startNode']]) {
        this._unresolvedNodeIds.push(link['startNode']);
      }
      if (!this._allNodeIdsMap[link['endNode']]) {
        this._unresolvedNodeIds.push(link['endNode']);
      }
    }
  }
};

/**
 * @private
 * Helper function that determines whether container node should be searched for additional nodes
 * in order to render promoted links
 * @param {oj.DiagramDataSource} dataSource oj.DiagramDataSource object that handles data for the component
 * @param {Object} containerData value for the individual node that might have child nodes to be resolved
 * @return {boolean} true if there are nested child nodes that has to be discovered
 */
dvt.Diagram.prototype._discoverLinks = function(dataSource, containerData) {
  var behaviorValue = this.getOptions()['promotedLinkBehavior'];
  if (behaviorValue === 'none' || this._unresolvedNodeIds.length == 0 ||
      (behaviorValue == 'lazy' && dataSource['getChildCount'](containerData) <= 0)) {
    return false;
  }
  return dataSource['getDescendantsConnectivity'](containerData) != 'disjoint';
};

/**
 * Data source event handler
 * @param {Object} event event data
 */
dvt.Diagram.prototype.handleDataSourceEvent = function(event) {
  this.render(this.getOptions(), this.Width, this.Height);
};

/**
 * Helper method that attaches and removes data source event handlers
 * @param {oj.DiagramDataSource} dataSource diagram data source
 * @param {boolean} attach true to attach listeners, false to remove listeners
 * @private
 */
dvt.Diagram.prototype._setDataSourceListeners = function(dataSource, attach) {
  if (!dataSource)
    return;
  if (!this._dataSourceEventHandler) {
    this._dataSourceEventHandler = this.handleDataSourceEvent.bind(this);
  }
  if (attach) {
    dataSource['on']('ADD', this._dataSourceEventHandler);
    dataSource['on']('REMOVE', this._dataSourceEventHandler);
    dataSource['on']('CHANGE', this._dataSourceEventHandler);
  }
  else {
    dataSource['off']('ADD', this._dataSourceEventHandler);
    dataSource['off']('REMOVE', this._dataSourceEventHandler);
    dataSource['off']('CHANGE', this._dataSourceEventHandler);
  }
};

/**
 * @override
 */
dvt.Diagram.prototype.Render = function() {
  dvt.Diagram.superclass.Render.call(this);
  this.InitComponentInternal();
  this._deferredObjCount = 0;
  this._nodesToResolve = [];
  if (!this._bRendered && !this.IsResize()) {
    this._renderCount++;
    var dataSource = this.getOptions()['data'];
    if (dataSource) {
      this._setDataSourceListeners(dataSource, false);
      this._resolveDeferredData(dataSource, null);
    }
    else {
      this.RenderComponentInternal();
    }
  }
  else if (this._deferredObjCount === 0) {
    this.RenderComponentInternal();
  }
};

/**
 * Renders a Diagram component after it was initialized.
 * @param {dvt.Animator=} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @protected
 */
dvt.Diagram.prototype.RenderComponentInternal = function(animator) {
  var emptyDiagram = false;
  if (!this._bRendered && !this.IsResize()) {
    this._setDataSourceListeners(this.getOptions()['data'], true);
    this.prepareNodes();
    this.renderLinks();

    //check whether nodes were filtered out
    //Object.keys is not available on REL13 so we need to generate the keys to array ourselves
    var keys = [];
    for (var key in this._nodes) {
      keys.push(key);
    }
    emptyDiagram = keys.length === 0;
    this.getCtx().setKeyboardFocusArray([this]);
  }

  if (!emptyDiagram) {
    // the child is going to be removed by  _processContent() function or layout failure function
    if (!this.contains(this._oldPanZoomCanvas))
      this.addChild(this._oldPanZoomCanvas);

    var res = this.layout(animator);
    var thisRef = this;
    var renderCount = this._renderCount;
    res.then(
        function() {
          if (renderCount === thisRef._renderCount) {
            thisRef._processContent(animator, emptyDiagram);
          }
        }, //success
        function() {
          if (renderCount === thisRef._renderCount) {
            thisRef.removeChild(thisRef._oldPanZoomCanvas);
            thisRef._oldPanZoomCanvas = null;
            thisRef._bRendered = true;
            this._currentViewport = null;
          }
        } //failure
    );
  }
  else { //empty diagram - nothing to layout, might need to run data change animation
    this._processContent(animator, emptyDiagram);
  }
};

/**
 * Process diagram content after layout is done - zoom to fit, animate if it is necessary
 * @param {dvt.Animator=} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @param {boolean} bEmptyDiagram True if diagram is empty
 * @private
 */
dvt.Diagram.prototype._processContent = function(animator, bEmptyDiagram) {
  var calcViewBounds;
  if (!bEmptyDiagram) {
    this.removeChild(this._oldPanZoomCanvas);
    this._processHighlighting();
    this._processInitialSelections();
    this._updateKeyboardFocusEffect();
    calcViewBounds = this._cachedViewBounds == null;
    if (calcViewBounds) {
      this._cachedViewBounds = this.GetViewBounds(animator);
    }
    this._fitContent(animator);
  }
  this._oldPanZoomCanvas = null;

  // Animation Support
  // Stop any animation in progress
  this.StopAnimation(true);

  //initial animation
  if (!this._bRendered && this.getInitAnim() && !this._oldDataAnimState) {
    this.Animation = dvt.BlackBoxAnimationHandler.getInAnimation(this.getCtx(), this.getInitAnim(), this, null, this.getAnimationDuration());
  }
  else if (this.getDataChangeAnim() != 'none' && this._oldDataAnimState) {
    this._deleteContainer = new dvt.Container(this.getCtx(), 'Delete Container');
    this.addChild(this._deleteContainer);
    var ah = new DvtDiagramDataAnimationHandler(this.getCtx(), this._deleteContainer, this._oldDataAnimState, this);
    ah.constructAnimation([this._oldDataAnimState], [this]);
    this.Animation = ah.getAnimation();
  }

  // If an animation was created, play it
  if (this.Animation) {
    this.getEventManager().hideTooltip();
    // Disable event listeners temporarily
    this.getEventManager().removeListeners(this);
    this.Animation.setOnEnd(this._onAnimationEnd, this);
    this.Animation.play();
  } else {
    this._onAnimationEnd();
  }

  this._bRendered = true;
  this._currentViewport = null;
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
 * @param {dvt.Animator=} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @private
 */
dvt.Diagram.prototype._fitContent = function(animator) {
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
    pzc.setPanDirection(this.getPanDirection());
    pzc.setZoomingEnabled(this.IsZoomingEnabled());
    pzc.setZoomToFitEnabled(this.IsZoomingEnabled());
  }
  else if (this.IsResize()) {
    // Update the min zoom if it's unspecified
    var viewBounds = this.AdjustMinZoom(animator, this._cachedViewBounds);
    var fitBounds = this.IsLayoutViewport() ? this.GetLayoutViewport() :
                    viewBounds ? viewBounds : this._cachedViewBounds;
    pzc.setZoomToFitEnabled(true);
    pzc.zoomToFit(null, fitBounds);
    pzc.setZoomToFitEnabled(this.IsZoomingEnabled());
  }
};

/**
 * @override
 */
dvt.Diagram.prototype.SetOptions = function(options) {
  dvt.Diagram.superclass.SetOptions.call(this, options);
  //initial setup
  this.Options['nodes'] = [];
  this.Options['links'] = [];
  this.parseComponentJson(this.Options); //set component background
  this.SetPanningEnabled(this.Options['panning'] != 'none');
  this.SetZoomingEnabled(this.Options['zooming'] != 'none');
  this.setControlPanelBehavior('hidden');
  this.setDataChangeAnim(this.Options['animationOnDataChange']);
  this.setInitAnim(this.Options['animationOnDisplay'] == 'auto' ? dvt.BlackBoxAnimationHandler.ALPHA_FADE : null);
  this.setSelectionMode(this.Options['selectionMode']);
  this.setEmptyText(this.Options['emptyText'] ? this.Options['emptyText'] : dvt.Bundle.getTranslation(this.Options, 'labelNoData', dvt.Bundle.UTIL_PREFIX, 'NO_DATA'));
};

/**
 * Returns a copy of the default options for the specified skin.
 * @param {string} skin The skin whose defaults are being returned.
 * @return {object} The object containing defaults for this component.
 */
dvt.Diagram.getDefaults = function(skin) {
  return (new DvtDiagramDefaults()).getDefaults(skin);
};

/**
 * @override
 */
dvt.Diagram.prototype.getMaxZoom = function() {
  var maxZoom = this.getOptions()['maxZoom'];
  var f = parseFloat(maxZoom);
  return f > 0 ? f : 1.0;
};

/**
 * @override
 */
dvt.Diagram.prototype.getMinZoom = function() {
  var minZoom = this.getOptions()['minZoom'];
  if (minZoom) {
    var f = parseFloat(minZoom);
    if (f > 0) {
      minZoom = Math.min(f, this.getMaxZoom());
    }
    return minZoom;
  }
  return 0.0;
};


/**
 * @override
 */
dvt.Diagram.prototype.getPanDirection = function() {
  return this.getOptions()['panDirection'];
};
/**
 * @override
 */
dvt.Diagram.prototype.getAnimationDuration = function() {
  return dvt.StyleUtils.getTimeMilliseconds(this.getOptions()['styleDefaults']['animationDuration']) / 1000;
};

/**
 * Processes the specified event.
 * @param {object} event
 * @param {object} source The component that is the source of the event, if available.
 */
dvt.Diagram.prototype.processEvent = function(event, source) {
  var type = event['type'];
  if (type == 'categoryHighlight') {
    this._processHighlighting(true);
  }
  else if (type == 'selection') {
    this.getOptions()['selection'] = event['selection'];
  }
  if (event) {
    this.dispatchEvent(event);
  }
};

/**
 * Prepare diagram nodes for layout. The nodes will not be rendered at this time.
 * The nodes will be rendered during layout or after layout is done.
 */
dvt.Diagram.prototype.prepareNodes = function() {
  var nodesData = this.getOptions()['nodes'];
  if (!nodesData)
    return;
  this._prepareNodes(null, nodesData);

  //update internal array of disclosed nodes if neccessary - initial rendering or option change case
  if (!this.DisclosedNodes) {
    var origExpanded = this.getOptions()['expanded'];
    this.DisclosedNodes = !origExpanded ? [] :
        origExpanded === 'all' ? this._arNodeIds : origExpanded;
  }
};

/**
 * Renders diagram links
 */
dvt.Diagram.prototype.renderLinks = function() {
  var linksData = this.getOptions()['links'];
  if (!linksData)
    return;

  var linkDefaults = this.getOptions()['styleDefaults']['linkDefaults'];
  //If linkDefaults has style attribute, make sure it is an object
  this._prepareLinkStyle(linkDefaults, 'style');
  //Merge the link default style from options with the link default style from Diagram style defaults
  linkDefaults['style'] = dvt.JsonUtils.merge(linkDefaults['style'], linkDefaults['_style']);
  for (var i = 0; i < linksData.length; i++) {
    var linkData = linksData[i];
    if (this._isLinkPromoted(linkData)) {
      continue;
    }

    var convertedLinkData = DvtDiagramLink.ConvertLinkData(linkData);
    if (this.getOptions()['linkProperties']) {
      var styleProps = dvt.JsonUtils.clone(this.getOptions()['linkProperties'](linkData));
      //If linkData has style attribute, make sure it is an object
      this._prepareLinkStyle(styleProps, 'style');
      convertedLinkData = dvt.JsonUtils.merge(convertedLinkData, styleProps);
    }
    linkData = dvt.JsonUtils.merge(convertedLinkData, linkDefaults);

    var link = DvtDiagramLink.newInstance(this, linkData, false);
    var linkId = link.getId();
    this._arLinkIds.push(linkId);
    if (link.isHidden()) {
      continue;
    }
    var startNode = this.getNodeById(link.getStartId());
    var endNode = this.getNodeById(link.getEndId());
    startNode.addOutLinkId(linkId);
    endNode.addInLinkId(linkId);

    link.render();
    this._links[linkId] = link;
  }
  // render promoted links
  if (this._promotedLinksMap) {
    var promotedLinkDefaults = this.getOptions()['styleDefaults']['promotedLink'];
    //If promoted linkDefaults has style attribute, make sure it is an object
    this._prepareLinkStyle(promotedLinkDefaults, 'style');
    //Merge the promoted link default style from options with the default style from Diagram style defaults
    promotedLinkDefaults['style'] = dvt.JsonUtils.merge(promotedLinkDefaults['style'], promotedLinkDefaults['_style']);
    for (var promotedLinkId in this._promotedLinksMap) {
      var linkData = this._promotedLinksMap[promotedLinkId];
      linkData = dvt.JsonUtils.merge(linkData, promotedLinkDefaults);
      var link = DvtDiagramLink.newInstance(this, linkData, true);
      var linkId = link.getId();

      var startNode = this.getNodeById(link.getStartId());
      var endNode = this.getNodeById(link.getEndId());
      startNode.addOutLinkId(linkId);
      endNode.addInLinkId(linkId);

      link.render();
      this._arLinkIds.push(linkId);
      this._links[linkId] = link;
    }
  }

};

/**
 * If the option style attribute is a string, converts it to link style object
 * @param {object} optionsObject  link options object
 * @param {string} attribute  link style attribute
 * @private
 */
dvt.Diagram.prototype._prepareLinkStyle = function(optionsObject, attribute) {
  //The link style attribute can be string or object.
  if (optionsObject && optionsObject[attribute] != null) {
    //The style object represents the CSS style of the link.
    if (optionsObject[attribute] instanceof Object) {
      if (optionsObject[attribute]['_type'] == null)
        optionsObject[attribute]['_type'] = DvtDiagramLink.CUSTOM_STYLE;
    } else {
      //The style string represents Link style type with following values: solid, dash, dot, dashDot.
      //convert style string to equivalent style object
      optionsObject[attribute] = dvt.DiagramLinkUtils.getStrokeObject(optionsObject[attribute]);
    }
  }
};

/**
 * Layout diagram nodes and links
 * @param {dvt.Animator} animator Optional animator for the component that is used to animate transition from an old state to a new one
 * @return {object} Promise or Promise like object that implements then function - then function should be executed after layout is done
 */
dvt.Diagram.prototype.layout = function(animator) {
  var layoutFunc = this.getOptions()['layout'];
  var layoutContext = this.CreateEmptyLayoutContext();
  var nodeIds = {};

  // add all nodes starting with root nodes
  for (var n = 0; n < this._arRootIds.length; n++) {
    var nodeId = this._arRootIds[n];
    if (!this.getNodeById(nodeId))
      continue;
    nodeIds[nodeId] = true;
    var lcRootNode = this.CreateLayoutContextNode(this.getNodeById(nodeId), null, this._bRendered ? false : true, layoutContext);
    this._addChildLayoutContext(this.getNodeById(nodeId), lcRootNode, layoutContext, nodeIds);
    layoutContext.addNode(lcRootNode);
  }

  // add all links
  for (var linkId in this._links) {
    var link = this.getLinkById(linkId);
    if (!link)
      continue;
    var startId = link.getData()['startNode'];
    var endId = link.getData()['endNode'];
    if (nodeIds[startId] && nodeIds[endId]) {
      layoutContext.addLink(this.CreateLayoutContextLink(link, startId, endId, null, layoutContext));
    }
  }

  // pass the current viewport to the layout
  if (this._currentViewport) {
    var viewportRect = this._currentViewport;
    var point = this.getLayoutOffset();
    var currentViewport = new dvt.DiagramRectangle(viewportRect.x - point.x, viewportRect.y - point.y, viewportRect.w, viewportRect.h);
    layoutContext.setCurrentViewport(currentViewport);
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
    var renderCount = this._renderCount;
    promise.then(
        function(response) {
          if (thisRef._renderCount === renderCount || thisRef.IsResize()) {
            thisRef.setAlphas(1.0);
            //render nodes if they not rendered yet
            var rootNodesCount = layoutContext.getNodeCount();
            for (var i = 0; i < rootNodesCount; i++) {
              var rootNode = layoutContext.getNodeByIndex(i);
              thisRef.renderNodeFromContext(rootNode);
            }
            thisRef.ApplyLayoutContext(layoutContext, animator, true);
          }
        },
        function(error) {
        }
    );
    return promise;
  }
  else {
    this.Log('dvt.Diagram: Layout function is not defined', 1);// LEVEL_ERROR
  }
};

/**
 * Sets the alphas on diagram panes.
 * @param {number} alpha panes opacity
 */
dvt.Diagram.prototype.setAlphas = function(alpha) {
  if (!this._bRendered) {
    this.getLinksPane().setAlpha(alpha);
    this.getNodesPane().setAlpha(alpha);
  }
};

/**
 * @override
 */
dvt.Diagram.prototype.getNodeById = function(id) {
  return this._nodes[id];
};

/**
 * @override
 */
dvt.Diagram.prototype.getLinkById = function(id) {
  return this._links[id];
};

/**
 * @override
 */
dvt.Diagram.prototype.GetAllLinks = function() {
  return this._arLinkIds;
};

/**
 * Gets an array of all link objects
 * @return {array} array of all link objects
 * @protected
 */
dvt.Diagram.prototype.GetAllLinkObjects = function() {
  var allLinks = [];
  for (var linkId in this._links) {
    allLinks.push(this._links[linkId]);
  }
  return allLinks;
};

/**
 * @override
 */
dvt.Diagram.prototype.GetAllNodes = function() {
  return this._arNodeIds;
};

/**
 * Gets a copy of the map of all nodes
 * @return {object} map of all nodes
 * @protected
 */
dvt.Diagram.prototype.GetAllNodesMap = function() {
  var nodesMap = {};
  for (var nodeId in this._nodes) {
    nodesMap[nodeId] = this._nodes[nodeId];
  }
  return nodesMap;
};

/**
 * Gets an array of all node objects
 * @return {array} array of all node objects
 * @protected
 */
dvt.Diagram.prototype.GetAllNodeObjects = function() {
  var allNodes = [];
  for (var nodeId in this._nodes) {
    allNodes.push(this._nodes[nodeId]);
  }
  return allNodes;
};

/**
 * Gets an array of all node objects
 * @return {array} array of all node objects
 * @protected
 */
dvt.Diagram.prototype.GetRootNodeObjects = function() {
  var roots = [];
  for (var i = 0; i < this._arRootIds.length; i++) {
    var root = this._nodes[this._arRootIds[i]];
    if (root) {
      roots.push(root);
    }
  }
  return roots;
};

/**
 * @override
 */
dvt.Diagram.prototype.HandleZoomEvent = function(event) {
  dvt.Diagram.superclass.HandleZoomEvent.call(this, event);
  var subType = event.getSubType();
  switch (subType) {
    case dvt.ZoomEvent.SUBTYPE_ADJUST_PAN_CONSTRAINTS:
      if (this.IsPanningEnabled()) {
        var zoom = event.getNewZoom();
        // Calculate the new content dimensions based on the new zoom
        var contentDim = this._cachedViewBounds ? this._cachedViewBounds : this.GetViewBounds(event.getAnimator());
        this.ConstrainPanning(contentDim.x, contentDim.y, contentDim.w, contentDim.h, zoom);
      }
      break;
    case dvt.ZoomEvent.SUBTYPE_ZOOM_TO_FIT_CALC_BOUNDS:
      //do not override a viewport returned from the layout engine
      if (!this.IsLayoutViewport()) {
        // Calculate the new content dimensions based on the new zoom
        var contentDim = this._cachedViewBounds ? this._cachedViewBounds : this.GetViewBounds(event.getAnimator());
        event.setZoomToFitBounds(contentDim);
      }
      break;
    case dvt.ZoomEvent.SUBTYPE_ZOOMED:
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
dvt.Diagram.prototype.prepareForDataChange = function() {
};

/**
 * Gets an array of navigable links for the specified node
 * @param {string} nodeId node id
 * @return {array} array of navigable links for the specified node
 */
dvt.Diagram.prototype.getNavigableLinksForNodeId = function(nodeId) {
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
dvt.Diagram.prototype.GetComponentDescription = function() {
  return dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'DIAGRAM');
};

/**
 * Update the selection handler with the initial selections.
 * @private
 */
dvt.Diagram.prototype._processInitialSelections = function() {
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
 * @param {boolean} handleEventListeners a flag to remove, then reattach event listeners. The flag is set to true when highlight is caused by event.
 * @private
 */
dvt.Diagram.prototype._processHighlighting = function(handleEventListeners) {

  //  - edge: highlight blinks on hover over node label positioned over the link
  // We get extra mouseover/mouseout events as we reparent diagram objects in _updateAlphas()
  // the problem is more prominent in IE
  if (handleEventListeners) {
    this.EventManager.removeListeners(this, true);
  }

  //clear existing
  if (this._highlightedObjects) {
    this._updateAlphas(false, this._highlightedObjects);
    this._highlightedObjects = null;
  }

  var categories = this.Options['highlightedCategories'];
  if (!categories || categories.length === 0) {
    if (handleEventListeners) {
      this.EventManager.addListeners(this);
    }
    return;
  }

  var bAnyMatched = this.Options['highlightMatch'] == 'any';
  this._highlightedObjects = {};
  var highlightedNodes = [];
  //find highlighted nodes
  for (var nodeId in this._nodes) {
    var node = this.getNodeById(nodeId);
    var match = bAnyMatched ? dvt.ArrayUtils.hasAnyItem(node.getCategories(), categories) :
                dvt.ArrayUtils.hasAllItems(node.getCategories(), categories);
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
    var match = bAnyMatched ? dvt.ArrayUtils.hasAnyItem(link.getCategories(), categories) :
                dvt.ArrayUtils.hasAllItems(link.getCategories(), categories);
    if (match) {
      this._highlightedObjects[link.getId()] = link;
      highlightedLinks.push(link);
    }
  }
  if (this.Options['linkHighlightMode'] == 'linkAndNodes') {
    this._processLinkConnections(highlightedLinks);
  }

  this._updateAlphas(true, this._highlightedObjects);

  //  - edge: highlight blinks on hover over node label positioned over the link
  // Reattach the listenes after updating alphas. The timeout seems to alow extra time to finish
  // a browser reparenting highlighted objects in DOM
  if (handleEventListeners) {
    var thisRef = this;
    setTimeout(function() {thisRef.getEventManager().addListeners(thisRef);}, 0);
  }
};

/**
 * Add specified connection (incoming and outgoing) with the endpoints to the map of highlighted objects
 * @param {array} highlightedNodes nodes to process
 * @private
 */
dvt.Diagram.prototype._processNodeConnections = function(highlightedNodes) {
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
dvt.Diagram.prototype._processLinkConnections = function(highlightedLinks) {
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
dvt.Diagram.prototype._updateAlphas = function(bHighlight, highlightedObjects) {
  var highlightAlpha;
  //is diagram flat or does it have containers - don't reparent objects for container case
  if (this._arNodeIds.length == this._arRootIds.length) { //flat
    highlightAlpha = bHighlight ? this.Options['styleDefaults']['_highlightAlpha'] : 1.0;
    //update alphas on link and node panes
    this.getLinksPane().setAlpha(highlightAlpha);
    this.getNodesPane().setAlpha(highlightAlpha);
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
  }
  else {  //has containers
    if (bHighlight) { //highlight objects
      highlightAlpha = this.Options['styleDefaults']['_highlightAlpha'];
      var highlightedIds = {};
      for (var id in highlightedObjects) {
        highlightedObjects[id].setAlpha(1.0);
        highlightedIds[id] = true;
      }
      for (var nodeId in this._nodes) {
        if (!highlightedIds[nodeId]) {
          this.getNodeById(nodeId).setAlpha(highlightAlpha);
        }
      }
      for (var linkId in this._links) {
        if (!highlightedIds[linkId]) {
          this.getLinkById(linkId).setAlpha(highlightAlpha);
        }
      }
    }
    else { //remove highlight
      for (var nodeId in this._nodes) {
        this.getNodeById(nodeId).setAlpha(1.0);
      }
      for (var linkId in this._links) {
        this.getLinkById(linkId).setAlpha(1.0);
      }
    }
  }
};

/**
 * @override
 */
dvt.Diagram.prototype.highlight = function(categories) {
  // Update the options
  this.Options['highlightedCategories'] = dvt.JsonUtils.clone(categories);

  // Perform the highlighting
  this._processHighlighting();
};

/**
 * @override
 */
dvt.Diagram.prototype.select = function(selection) {
  // Update the options
  this.Options['selection'] = dvt.JsonUtils.clone(selection);

  // Perform the selection
  this._processInitialSelections();
};

/**
 * @return {DvtDiagramAutomation} the automation object
 */
dvt.Diagram.prototype.getAutomation = function() {
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
dvt.Diagram.prototype.Log = function(message, level) {
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
 */
dvt.Diagram.prototype.processDefaultHoverEffect = function(nodeId, hovered) {
  var node = this.getNodeById(nodeId);
  if (node)
    node.processDefaultHoverEffect(hovered);
};

/**
 * Hides or shows default selection effect on the specified node
 * @param {string} nodeId node id
 * @param {boolean} selected true to show selection effect
 */
dvt.Diagram.prototype.processDefaultSelectionEffect = function(nodeId, selected) {
  var node = this.getNodeById(nodeId);
  if (node)
    node.processDefaultSelectionEffect(selected);
};

/**
 * Hides or shows default keyboard focus effect on the specified node
 * @param {string} nodeId node id
 * @param {boolean} focused true to show keyboard focus effect
 */
dvt.Diagram.prototype.processDefaultFocusEffect = function(nodeId, focused) {
  var node = this.getNodeById(nodeId);
  if (node)
    node.processDefaultFocusEffect(focused);
};

/**
 * @override
 */
dvt.Diagram.prototype.renderNodeFromContext = function(nodeContext) {
  if (!nodeContext.IsRendered) {
    var node = this.getNodeById(nodeContext.getId());
    if (node.isDisclosed()) {
      //render all child nodes and apply layout context
      var layoutContext = this.CreateEmptyLayoutContext();
      var childNodes = nodeContext.getChildNodes();
      for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        this.renderNodeFromContext(childNode);
        layoutContext.addNode(childNode);
      }
      this.ApplyLayoutContext(layoutContext);
    }
    node.render();
    this.UpdateNodeLayoutContext(nodeContext, node);
  }
};

/**
 * Recursively walks the nodes data. Creates visible nodes, but skips the rendering step.
 * The nodes will be rendered during or after the layout.
 * @param {DvtDiagramNode} parent parent node if exists
 * @param {Object} nodesData an object that represents child nodes for the level
 * @private
 */
dvt.Diagram.prototype._prepareNodes = function(parent, nodesData) {
  var nodeDefaults = this.getOptions()['styleDefaults']['nodeDefaults'];

  //If default background/container style is specified in options nodeDefaults, make sure it is an object
  //Note: don't need to convert 'backgroundSvgStyle' and 'containerSvgStyle', since those properties
  //do not support string values
  this._prepareNodeStyle(nodeDefaults, 'backgroundStyle');
  this._prepareNodeStyle(nodeDefaults, 'containerStyle');
  for (var i = 0; i < nodesData.length; i++) {
    var nodeData = nodesData[i];

    var convertedNodeData = DvtDiagramNode.ConvertNodeData(nodeData);
    if (this.getOptions()['nodeProperties']) {
      var styleProps = dvt.JsonUtils.clone(this.getOptions()['nodeProperties'](nodeData));
      //If background/container style is specified in nodeData, make sure it is an object before merging
      this._prepareNodeStyle(styleProps, 'backgroundStyle');
      this._prepareNodeStyle(styleProps, 'containerStyle');
      convertedNodeData = dvt.JsonUtils.merge(convertedNodeData, styleProps);
    }
    nodeData = dvt.JsonUtils.merge(convertedNodeData, nodeDefaults);

    var node = DvtDiagramNode.newInstance(this, nodeData);
    var nodeId = node.getId();
    if (parent) {
      parent.addChildNodeId(nodeId);
      node.setGroupId(parent.getId());
    }
    else {
      this._arRootIds.push(nodeId);
    }
    this._arNodeIds.push(nodeId);
    // if child nodes option is defined and the node is disclosed, process the data
    if (nodeData['nodes']) {
      if (this._isNodeDisclosed(nodeId)) {
        node.setDisclosed(true);
        this._prepareNodes(node, nodeData['nodes']);
      }
      else {
        this._addToCollapsedArray(node);
      }
    }

    if (!node.isHidden()) {
      if (parent && parent.GetChildNodePane())
        parent.GetChildNodePane().addChild(node);
      else
        this.getNodesPane().addChild(node);
      this._nodes[nodeId] = node;
    }
  }
};

/**
 * If the option node style attribute is a string, converts it to object
 * @param {object} optionsObject  node options object
 * @param {string} attribute  node attribute
 * @private
 */
dvt.Diagram.prototype._prepareNodeStyle = function(optionsObject, attribute) {
  if (optionsObject && optionsObject[attribute] != null &&
          !(optionsObject[attribute] instanceof Object)) {
    optionsObject[attribute] = dvt.CSSStyle.cssStringToObject(optionsObject[attribute]);
  }
};

/**
 * Sets the disclosure state for a node
 * @param {string} nodeId the id of the node
 * @param {boolean} disclosed whether the node should be disclosed or not
 */
dvt.Diagram.prototype.setNodeDisclosed = function(nodeId, disclosed) {
  var index = -1;
  if (this.DisclosedNodes) {
    index = dvt.ArrayUtils.getIndex(this.DisclosedNodes, nodeId);
  }
  if ((!disclosed && index > -1) || (disclosed && index < 0)) {
    this.dispatchEvent(new dvt.EventFactory.newEvent(disclosed ? 'beforeExpand' : 'beforeCollapse', nodeId));
  }
};

/**
 * Expands a container
 * @param {String} nodeId node id
 */
dvt.Diagram.prototype.expand = function(nodeId) {
  if (!this.DisclosedNodes)
    this.DisclosedNodes = [];
  var index = dvt.ArrayUtils.getIndex(this.DisclosedNodes, nodeId);
  if (index < 0) {
    this.DisclosedNodes.push(nodeId);
    this.render(this.getOptions(), this.Width, this.Height);
    this.dispatchEvent(new dvt.EventFactory.newEvent('expand', nodeId));
  }
};

/**
 * Collapses a container node
 * @param {String} nodeId node id
 */
dvt.Diagram.prototype.collapse = function(nodeId) {
  var index = -1;
  if (this.DisclosedNodes) {
    index = dvt.ArrayUtils.getIndex(this.DisclosedNodes, nodeId);
  }
  if (index > -1) {
    this.DisclosedNodes.splice(index, 1);
    this.render(this.getOptions(), this.Width, this.Height);
    this.dispatchEvent(new dvt.EventFactory.newEvent('collapse', nodeId));
  }
};


/**
 * Adds child layout context to the parent layout context
 * @param {DvtDiagramNode} parentNode perent node
 * @param {DvtDiagramLayoutContextNode} lcParentNode parent layout context
 * @param {DvtDiagramLayoutContext} layoutContext diagram layout context
 * @param {array} nodeIds array of nodes added to layout context
 * @private
 */
dvt.Diagram.prototype._addChildLayoutContext = function(parentNode, lcParentNode, layoutContext, nodeIds) {

  if (parentNode.isDisclosed()) {
    var arChildIds = parentNode.getChildNodeIds();
    var lcChildNodes = [];
    for (var j = 0; j < arChildIds.length; j++) {
      var childNode = this.getNodeById(arChildIds[j]);
      if (childNode.getVisible()) {
        nodeIds[childNode.getId()] = true;
        var lcChildNode = this.CreateLayoutContextNode(childNode, null, this._bRendered ? false : true, layoutContext);
        layoutContext.addNodeToMap(lcChildNode);
        lcChildNode.setParentNode(lcParentNode);
        lcChildNodes.push(lcChildNode);
        this._addChildLayoutContext(childNode, lcChildNode, layoutContext, nodeIds);
      }
    }
    lcParentNode.setChildNodes(lcChildNodes);
  }
};

/**
 * @private
 * Checks whether the node is expanded
 * @param {string} nodeId node id
 * @return {boolean} true if the node is expanded
 */
dvt.Diagram.prototype._isNodeDisclosed = function(nodeId) {
  var disclosedNodes = this.DisclosedNodes ? this.DisclosedNodes :
      this.getOptions()['expanded'];
  return (disclosedNodes && dvt.ArrayUtils.getIndex(disclosedNodes, nodeId) > -1) ||
      (disclosedNodes && dvt.ArrayUtils.getIndex(disclosedNodes, 'all') > -1);
};

/**
 * @private
 * Checks whether the link is promoted
 * @param {object} linkData
 * @return {boolean} true if the link is promoted
 */
dvt.Diagram.prototype._isLinkPromoted = function(linkData) {

  var startNode = this.getNodeById(linkData['startNode']);
  var endNode = this.getNodeById(linkData['endNode']);

  // both ends of a link are visible - not a promoted link
  // or nodes are not visible, but nothing is collapsed - hidden nodes
  if ((startNode && endNode) || !this._collapsedNodes) {
    return false;
  }

  // do not process promoted links if the promotedLinkBehavior is set to 'none'
  if (this.getOptions()['promotedLinkBehavior'] === 'none')
    return true;

  var startPromotedId = startNode ? startNode.getId() : this._findFirstVisibleAncestor(linkData['startNode']);
  var endPromotedId = endNode ? endNode.getId() : this._findFirstVisibleAncestor(linkData['endNode']);
  if (!(startPromotedId && endPromotedId)) {
    // start or end node for the link does not exist - could be hidden
    return false;
  }
  else if (startPromotedId === endPromotedId) {
    //unaccessible link that belongs to the same collapsed container - should be ignored
    return false;
  }

  var linkId = DvtDiagramLink.GetPromotedLinkId(startPromotedId, endPromotedId);
  if (!this._promotedLinksMap)
    this._promotedLinksMap = {};
  if (!this._promotedLinksMap[linkId]) {
    this._promotedLinksMap[linkId] = {
      'id': linkId,
      'startNode' : startPromotedId,
      'endNode' : endPromotedId,
      '_links': [linkData]};
  }
  else {
    this._promotedLinksMap[linkId]['_links'].push(linkData);
  }
  return true;
};

/**
 * Adds a node to an array of collapsed nodes
 * @param {DvtDiagramNode} node a collapsed node
 * @private
 */
dvt.Diagram.prototype._addToCollapsedArray = function(node) {
  if (!this._collapsedNodes)
    this._collapsedNodes = [];
  this._collapsedNodes.push(node);
};

/**
 * Searches for the first visible container for the child node
 * @param {string} childId id of a child node to find
 * @return {string} ancestor id or null if a child is not found
 * @private
 */
dvt.Diagram.prototype._findFirstVisibleAncestor = function(childId) {
  //recursive search in nodes data for a child id
  var isDescendant = function(data, chId) {
    if (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i]['id'] === chId || isDescendant(data[i]['nodes'], chId))
          return true;
      }
    }
    return false;
  };

  for (var i = 0; i < this._collapsedNodes.length; i++) {
    var node = this._collapsedNodes[i];
    if (isDescendant(node.getData()['nodes'], childId)) {
      return node.getId();
    }
  }
  return null;
};

/**
 * Updates keyboard focus effect
 * @private
 */
dvt.Diagram.prototype._updateKeyboardFocusEffect = function() {
  var navigable = this.getEventManager().getFocus();
  var isShowingKeyboardFocusEffect = false;
  if (navigable) {
    var newNavigable;
    if (navigable instanceof DvtDiagramNode) {
      newNavigable = this.getNodeById(navigable.getId());
    }
    else if (navigable instanceof DvtDiagramLink) {
      newNavigable = this.getLinkById(navigable.getId());
    }
    isShowingKeyboardFocusEffect = navigable.isShowingKeyboardFocusEffect();
    if (newNavigable && isShowingKeyboardFocusEffect) {
      newNavigable.showKeyboardFocusEffect();
    }
    this.getEventManager().setFocus(newNavigable);
  }
};

/**
 * Clears cached disclosed nodes array if it exists
 * The method is called when user changed 'expanded' option on the component.
 */
dvt.Diagram.prototype.clearDisclosedState = function() {
  this.DisclosedNodes = null;
};

/**
 * @protected
 * Creates or updates link creation feedback
 * @param {dvt.BaseEvent} event DnD dragOver event
 */
dvt.Diagram.prototype.ShowLinkCreationFeedback = function(event) {
  if (this.getEventManager().LinkCreationStarted) {
    var stagePos = this._context.pageToStageCoords(event.pageX, event.pageY);
    var localPos = this.getPanZoomCanvas().getContentPane().stageToLocal({x: stagePos.x, y: stagePos.y});
    if (this._linkCreationFeedBack) {
      var points = this._linkCreationFeedBack.getPoints();
      this._linkCreationFeedBack.setPoints([points[0], points[1], localPos.x, localPos.y]);
    }
    else {
      var obj = this.getEventManager().DragSource.getDragObject();
      if (obj instanceof DvtDiagramNode) {
        var startStagePos = this.getEventManager().DragSource.getDragCoords();
        var startLocalPos = this.getPanZoomCanvas().getContentPane().stageToLocal({x: startStagePos.x, y: startStagePos.y});
        var linkDefaults = this.getOptions()['styleDefaults']['linkDefaults'];
        this._prepareLinkStyle(linkDefaults, 'style');
        //get additional styles from callback
        var styleCallback = this.getOptions()['dnd']['drag']['ports']['linkStyle'];
        if (styleCallback && typeof styleCallback === 'function') {
          var linkFeedbackStyle = styleCallback({'dataContext': obj.getDataContext(), 'portElement': obj.__dragPort});
          if (linkFeedbackStyle) {
            linkDefaults['style'] = dvt.JsonUtils.merge(linkFeedbackStyle['svgStyle'], linkDefaults['style']);
            linkDefaults['svgClassName'] = linkFeedbackStyle['svgClassName'] ? linkFeedbackStyle['svgClassName'] : linkDefaults['svgClassName'];
          }
        }
        var linkData = {
          'id': 'linkFeedback',
          'startNode' : obj.getId(),
          'endNode' : obj.getId()
        };
        linkData = dvt.JsonUtils.merge(linkData, linkDefaults);
        var link = DvtDiagramLink.newInstance(this, linkData, false);
        this.getNodesPane().addChild(link);
        link.setMouseEnabled(false);
        link.setPoints([startLocalPos.x, startLocalPos.y, localPos.x, localPos.y]);
        this._linkCreationFeedBack = link;
      }
    }
  }
};

/**
 * Removes link creation feedback
 * @protected
 */
dvt.Diagram.prototype.HideLinkCreationFeedback = function() {
  this.getNodesPane().removeChild(this._linkCreationFeedBack);
  this._linkCreationFeedBack = null;
};

//
// $Header: dsstools/modules/dvt-shared-js/src/META-INF/bi/sharedJS/toolkit/diagram/DvtDiagramBundle.js /bibeans_root/2 2016/06/02 13:59:45  Exp $
//
// DvtDiagramBundle.js
//
// Copyright (c) 2016, Oracle and/or its affiliates. All rights reserved.
//
//    NAME
//     DvtDiagramBundle.js - <one-line expansion of the name>
//
//    DESCRIPTION
//     <short description of component this file declares/defines>
//
//    NOTES
//     <other useful comments, qualifications, etc. >
//
//    MODIFIED  (MM/DD/YY)
//       05/12/16 - Created
//
dvt.Bundle.addDefaultStrings(dvt.Bundle.DIAGRAM_PREFIX, {
  'PROMOTED_LINK': '{0} link',
  'PROMOTED_LINKS': '{0} links',
  'PROMOTED_LINK_ARIA_DESC': 'Indirect'
});
/**
 * Category rollover handler for Diagram
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The object instance that the callback function is defined on.
 * @class DvtDiagramCategoryRolloverHandler
 * @extends {dvt.CategoryRolloverHandler}
 * @constructor
 */
var DvtDiagramCategoryRolloverHandler = function(callback, callbackObj) {
  DvtDiagramCategoryRolloverHandler.superclass.constructor.call(this, callback, callbackObj);
  this.setHoverDelay(DvtDiagramCategoryRolloverHandler._HOVER_DELAY);
  this._diagram = callbackObj;
};

dvt.Obj.createSubclass(DvtDiagramCategoryRolloverHandler, dvt.CategoryRolloverHandler, 'DvtDiagramCategoryRolloverHandler');

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
  return dvt.Obj.createCallback(this, callback);
};

/**
 * @override
 */
DvtDiagramCategoryRolloverHandler.prototype.GetRolloutCallback = function(event, objs, bAnyMatched, customAlpha) {
  var callback = function() {
    this.SetHighlightModeTimeout();
    this._diagram.processEvent(event);
  };
  return dvt.Obj.createCallback(this, callback);
};
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {dvt.BaseComponentDefaults}
 */
var DvtDiagramDefaults = function() {
  this.Init({'skyros': DvtDiagramDefaults.VERSION_1, 'alta': DvtDiagramDefaults.SKIN_ALTA});
};

dvt.Obj.createSubclass(DvtDiagramDefaults, dvt.BaseComponentDefaults, 'DvtDiagramDefaults');


/**
 * Defaults for version 1.
 */
DvtDiagramDefaults.VERSION_1 = {
  'skin': dvt.CSSStyle.SKIN_ALTA,
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
  'promotedLinkBehavior': 'lazy',
  '_statusMessageStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA),
  'dnd': {
    'drag': {
      'nodes': {},
      'ports': {}
    },
    'drop': {
      'background': {},
      'nodes': {},
      'links': {},
      'ports': {}
    }
  },
  'styleDefaults': {
    'animationDuration': 500,
    'hoverBehaviorDelay': 200,
    '_highlightAlpha' : .1,
    'nodeDefaults': {
      '_containerStyle' : new dvt.CSSStyle('border-color:#abb3ba;background-color:#f9f9f9;border-width:.5px;border-radius:1px;padding-top:20px;padding-left:20px;padding-bottom:20px;padding-right:20px;'),
      'labelStyle': dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_12 + 'color:#383A47',
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
      '_style' : {'_type': 'solid'},
      'hoverInnerColor': 'rgb(255,255,255)',
      'hoverOuterColor': 'rgba(0,0,0, .3)',
      'selectionColor': 'rgb(0,0,0)',
      'labelStyle': dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_12 + 'color:#383A47',
      '_hitDetectionOffset' : 10
    },
    'promotedLink' : {
      'startConnectorType': 'none',
      'endConnectorType': 'none',
      'width' : 1,
      '_style' : {'_type': 'dot', 'strokeDasharray': '2,3'},
      'color' : '#778999',
      'hoverInnerColor': 'rgb(255,255,255)',
      'hoverOuterColor': 'rgba(0,0,0, .3)',
      'selectionColor': 'rgb(0,0,0)',
      '_hitDetectionOffset' : 10
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
 * @param {dvt.Context} context the platform specific context object
 * @param {dvt.Container} deleteContainer the container where deletes should be moved for animation
 * @param {object} oldDiagram an object representing the old diagram state
 * @param {dvt.Diagram} newDiagram the diagram component
 * @class DvtDiagramDataAnimationHandler
 * @constructor
 */
var DvtDiagramDataAnimationHandler = function(context, deleteContainer, oldDiagram, newDiagram) {
  this.Init(context, deleteContainer, oldDiagram, newDiagram);
};

dvt.Obj.createSubclass(DvtDiagramDataAnimationHandler, dvt.DataAnimationHandler, 'DvtDiagramDataAnimationHandler');
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
 * @param {dvt.Context} context the platform specific context object
 * @param {dvt.Container} deleteContainer the container where deletes should be moved for animation
 * @param {object} oldDiagram an object representing the old diagram state
 * @param {dvt.Diagram} newDiagram the diagram component
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
 * @return {dvt.Diagram} the diagram component
 */
DvtDiagramDataAnimationHandler.prototype.getNewDiagram = function() {
  return this._newDiagram;
};

/**
 * Gets the animation duration
 * @return {number} the animation duration
 */
DvtDiagramDataAnimationHandler.prototype.getAnimationDuration = function() {
  return dvt.StyleUtils.getTimeMilliseconds(this._oldDiagram.getOptions()['styleDefaults']['animationDuration']) / 1000;
};

/**
 * @override
 */
DvtDiagramDataAnimationHandler.prototype.constructAnimation = function(oldList, newList) {
  var bLinks = false;
  if (newList && newList.length > 0) {
    bLinks = newList[0] instanceof DvtDiagramLink;
  }

  if (bLinks && !this.getCtx().isOffscreen()) {
    // process diagram links - check expanding a promoted link or collapsing multiple into a promoted link
    var oldLinksMap = DvtDiagramDataAnimationHandler._expandLinksArrayToMap(oldList),
        newLinksMap = DvtDiagramDataAnimationHandler._expandLinksArrayToMap(newList);
    var oldLink, newLink;
    var skip = {};
    for (var id in oldLinksMap) {
      oldLink = oldLinksMap[id];
      newLink = newLinksMap[id];

      //no match found - link either deleted or invisible
      //do nothing if the link is invisible
      if (!newLink) {
        if (dvt.ArrayUtils.getIndex(this.getNewDiagram().GetAllLinks(), oldLink.getId()) == -1) {
          oldLink.animateDelete(this);
        }
      }
      //identical links promoted or not - update
      else if ((!oldLink.isPromoted() && !newLink.isPromoted()) ||
          (oldLink.isPromoted() && newLink.isPromoted() && oldLink.getId() == newLink.getId())) {
        newLink.animateUpdate(this, oldLink);
      }
      //match found but one of the links is inside of promoted link - collapsed or expanded case
      else {
        var oldLinksCount = oldLink.isPromoted() ? oldLink.getData()['_links'].length : 1;
        var newLinksCount = newLink.isPromoted() ? newLink.getData()['_links'].length : 1;
        if (oldLinksCount > newLinksCount && !skip[oldLink.getId()]) { //expand
          this._constructExpandCollapseAnimation(oldLink, newLinksMap, skip, true);
        }
        else if (oldLinksCount < newLinksCount && !skip[newLink.getId()]) { //collapse
          this._constructExpandCollapseAnimation(newLink, oldLinksMap, skip, false);
        }
      }
    }
    //check for inserts
    for (var id in newLinksMap) {
      oldLink = oldLinksMap[id];
      newLink = newLinksMap[id];
      // if no match found, check if the link is invisible, do nothing for invisible link
      if (!oldLink && (dvt.ArrayUtils.getIndex(this.getOldDiagram().getLinkIds(), newLink.getId()) == -1)) {
        newLink.animateInsert(this);
      }
    }
  }
  else {
    DvtDiagramDataAnimationHandler.superclass.constructAnimation.call(this, oldList, newList);
  }
};

/**
 * Helper method that constracts expand or collapse animation for promoted links
 * @param {DvtDiagramLink} linkToAnimate active link that should be collapsed or expanded
 * @param {object} testLinksMap map of links on the opposite side - new links map for expanding old link or old links map for collapsing new link
 * @param {object} skipMap map of processed links that has to be updated by this function
 * @param {boolean} expandFlag true to indicate expand, false to indicate collapse
 * @private
 */
DvtDiagramDataAnimationHandler.prototype._constructExpandCollapseAnimation = function(linkToAnimate, testLinksMap, skipMap, expandFlag) {
  var linksToAnimate = [];
  var consolidatedLinks = linkToAnimate.getData()['_links'];
  for (var li = 0; li < consolidatedLinks.length; li++) {
    var testLink = testLinksMap[consolidatedLinks[li]['id']];
    if (testLink && dvt.ArrayUtils.getIndex(linksToAnimate, testLink) === -1) {
      linksToAnimate.push(testLink);
    }
  }
  if (linksToAnimate.length > 0) {
    if (expandFlag)
      linkToAnimate.animateExpand(this, linksToAnimate);
    else
      linkToAnimate.animateCollapse(this, linksToAnimate);
    skipMap[linkToAnimate.getId()] = true;
  }
};

/**
 * Helper method that converts an array of links in to a map.
 * The method also expands promoted links into single links in order to support expand and collapse animation
 * @param {array} linkArray array of links
 * @return {Object} map of links stored by id
 * @private
 */
DvtDiagramDataAnimationHandler._expandLinksArrayToMap = function(linkArray) {
  var list = {};
  for (var i = 0; i < linkArray.length; i++) {
    var link = linkArray[i];
    if (link.isPromoted()) {
      var consolidatedLinks = link.getData()['_links'];
      for (var li = 0; li < consolidatedLinks.length; li++) {
        list[consolidatedLinks[li]['id']] = link;
      }
    }
    else {
      list[link.getId()] = link;
    }
  }
  return list;
};


// Copyright (c) 2014, 2017, Oracle and/or its affiliates. All rights reserved.
/**
 * Event Manager for dvt.Diagram.
 * @param {dvt.Context} context The platform specific context object
 * @param {function} callback A function that responds to component events
 * @param {dvt.Diagram} callbackObj diagram component instance that the callback function is defined on
 * @class
 * @extends {dvt.EventManager}
 * @constructor
 */
var DvtDiagramEventManager = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
  this._diagram = callbackObj;
  this._linkDragSelector = null;
  this._linkDropSelector = null;
};

dvt.Obj.createSubclass(DvtDiagramEventManager, dvt.EventManager, 'DvtDiagramEventManager');

/**
 * Shows the keyboard focus effects wich includes tooltip, for a keyboard navigable object.
 * @param {dvt.KeyboardEvent} event The keyboard event
 * @param {DvtKeyboardNavigable} navigable The keyboard navigable to show focus effect for
 */
DvtDiagramEventManager.prototype.showFocusEffect = function(event, navigable) {
  this.ShowFocusEffect(event, navigable);
};
/**
 * @override
 */
DvtDiagramEventManager.prototype.ShowFocusEffect = function(event, obj) {
  if (!this._diagram.isPanning())
    DvtDiagramEventManager.superclass.ShowFocusEffect.call(this, event, obj);
};

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

  var rolloverEvent = dvt.EventFactory.newCategoryHighlightEvent(options['highlightedCategories'], bOver);
  var hoverBehaviorDelay = dvt.StyleUtils.getTimeMilliseconds(options['styleDefaults']['hoverBehaviorDelay']);
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
  if (keyCode != dvt.KeyboardEvent.TAB && this._bPassOnEvent) {
    focusDisp.fireKeyboardListener(event);
    event.preventDefault();
  }// Mashups
  else if (keyCode == dvt.KeyboardEvent.TAB && focusDisp instanceof dvt.BaseComponent) {
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
  }
  else if (keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey && event.shiftKey) {
    if (focusObj && focusObj.HandleKeyboardEvent) {
      focusObj.HandleKeyboardEvent(event);
    }
  }
  else {
    if (keyCode == dvt.KeyboardEvent.TAB && focusObj) {//make sure focused obj in on screen
      this._diagram.ensureObjInViewport(event, focusObj);
    }
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
    return dvt.EventManager.TOUCH_RESPONSE_TOUCH_HOLD;
  else if (options['touchResponse'] === dvt.EventManager.TOUCH_RESPONSE_TOUCH_START)
    return dvt.EventManager.TOUCH_RESPONSE_TOUCH_START;
  return dvt.EventManager.TOUCH_RESPONSE_AUTO;
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.HandleTouchClickInternal = function(event) {
  return this.GetEventInfo(event, dvt.PanZoomCanvasEventManager.EVENT_INFO_PANNED_KEY);
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.StoreInfoByEventType = function(key) {
  if (key == dvt.PanZoomCanvasEventManager.EVENT_INFO_PANNED_KEY) {
    return false;
  }
  return DvtDiagramEventManager.superclass.StoreInfoByEventType.call(this, key);
};

// Drag & Drop Support
/**
 * @override
 */
DvtDiagramEventManager.prototype.getComponent = function() {
  return this._diagram;
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.isDndSupported = function() {
  return true;
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.GetDragSourceType = function(event) {
  var obj = this.DragSource.getDragObject();
  if (obj && obj.__dragType)
    return obj.__dragType;

  if (obj instanceof DvtDiagramNode) {
    if (this._linkDragSelector === null) {
      this._linkDragSelector = this._diagram.getOptions()['dnd']['drag']['ports']['selector'];
    }
    var dragPort;
    if (this._linkDragSelector) {
      var dragCoords = this.DragSource.getDragCoords();
      var absolutePos = this._context.stageToPageCoords(dragCoords.x, dragCoords.y);
      dragPort = this._getPortElement(document.elementFromPoint(absolutePos.x, absolutePos.y), this._linkDragSelector);
      if (dragPort) {
        this.LinkCreationStarted = true;
        obj.__dragPort = dragPort;
      }
    }
    // cache drag type and potential port until next dragstart
    obj.__dragType = dragPort ? 'ports' : 'nodes';
    return obj.__dragType;
  }
  return null;
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.GetDragDataContexts = function() {
  var obj = this.DragSource.getDragObject();
  if (this._diagram.isSelectionSupported() && this._diagram.getSelectionHandler().getSelectedCount() > 1) {
    var selection = this._diagram.getSelectionHandler().getSelection();
    var contentPosition = this._getTopLeftContentCorner(selection);
    var zoom = this._diagram.getPanZoomCanvas().getZoom();
    var contexts = [];
    for (var i = 0; i < selection.length; i++) {
      if (selection[i] instanceof DvtDiagramNode) { //don't drag links yet
        var context = selection[i].getDataContext();
        var bounds = selection[i].getDimensions(this._context.getStage());
        context['nodeOffset'] = new dvt.Point((bounds.x - contentPosition.x) / zoom, (bounds.y - contentPosition.y) / zoom);
        contexts.push(context);
      }
    }
    return contexts;
  }
  if (obj instanceof DvtDiagramNode) {
    if (obj.__dragType === 'ports' && obj.__dragPort) {
      return {'dataContext': obj.getDataContext(), 'portElement': obj.__dragPort};
    }
    var context = obj.getDataContext();
    context['nodeOffset'] = new dvt.Point(0, 0);
    return [context];
  }
  return [];
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.GetDropOffset = function(event) {
  var contentPosition;
  if (this._diagram.isSelectionSupported() && this._diagram.getSelectionHandler().getSelectedCount() > 1) {
    contentPosition = this._getTopLeftContentCorner(this._diagram.getSelectionHandler().getSelection());
  }
  else {
    var obj = this.DragSource.getDragObject();
    if (obj instanceof DvtDiagramNode) {
      contentPosition = obj.getDimensions(this._context.getStage());
    }
  }
  if (contentPosition) {
    var relPos = this._context.pageToStageCoords(event.pageX, event.pageY);
    var zoom = this._diagram.getPanZoomCanvas().getZoom();
    return new dvt.Point((contentPosition.x - relPos.x) / zoom, (contentPosition.y - relPos.y) / zoom);
  }
  return null;
};

/**
 * @private
 * Gets top left corner of the bounding rectangle of the selected nodes relative to stage
 * @param {array} selection the current selection
 * @return {dvt.Point} position of the top left corner
 */
DvtDiagramEventManager.prototype._getTopLeftContentCorner = function(selection) {
  if (!selection) {
    return null;
  }
  var minX = Number.MAX_VALUE;
  var minY = Number.MAX_VALUE;
  for (var i = 0; i < selection.length; i++) {
    if (selection[i] instanceof DvtDiagramNode) {
      var bounds = selection[i].getDimensions(this._context.getStage());
      minX = bounds ? Math.min(bounds.x, minX) : minX;
      minY = bounds ? Math.min(bounds.y, minY) : minY;
    }
  }
  return new dvt.Point(minX, minY);
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.OnDndDragStart = function(event) {
  //clean up from previous internal drags
  //can't be done on dragend, since it is not always called
  var dragObj = this.DragSource.getDragObject();
  if (dragObj && dragObj.__dragType) {
    dragObj.__dragType = null;
    dragObj.__dragPort = null;
  }
  this.LinkCreationStarted = false;
  DvtDiagramEventManager.superclass.OnDndDragStart.call(this, event);
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.OnDndDragOver = function(event) {
  DvtDiagramEventManager.superclass.OnDndDragOver.call(this, event);
  if (this.LinkCreationStarted) {
    this._diagram.ShowLinkCreationFeedback(event);
  }
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.OnDndDragEnd = function(event) {
  DvtDiagramEventManager.superclass.OnDndDragEnd.call(this, event);

  if (this.LinkCreationStarted) {
    this._diagram.HideLinkCreationFeedback();
    this.LinkCreationStarted = false;
  }

  //reenabling panning on dragend and on mouseup
  //the panning is disabled on mousedown event to prevent panning for potential node drag
  //if the node was not dragged, the component will not get dragend event and the panning is reenabled on mouseup
  //if the node was dragged, the component will get dragend event, but it might not get mouseup event
  this._diagram.getPanZoomCanvas().panZoomEnd();//done to reset the state and prevent panBy on mousemove
  this._setPanningEnabled(true);
};

/**
 * Updates PanZoomCanvas setting for panning, if panning is enabled for the diagram
 * The method is called to prevent diagram panning during drag operation
 * @param {boolean} bEnablePanning true to enable panning
 * @private
 */
DvtDiagramEventManager.prototype._setPanningEnabled = function(bEnablePanning) {
  if (this._diagram.IsPanningEnabled())
    this._diagram.getPanZoomCanvas().setPanningEnabled(bEnablePanning);
};

/**
 * Helper function that check if the nodes could be dragged from the diagram
 * @return {boolean} true if the nodes could be dragged from the diagram
 * @protected
 */
DvtDiagramEventManager.prototype.IsDragSupported = function() {
  if (!this._isDragSupported) {
    var options = this._diagram.getOptions();
    this._isDragSupported = this.isDndSupported() &&
        (options['dnd']['drag']['nodes']['dataTypes'] ||
        options['dnd']['drag']['ports']['dataTypes']);
  }
  return this._isDragSupported;
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.OnMouseDown = function(event) {
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
  if (this.IsDragSupported() && obj instanceof DvtDiagramNode) {
    this._setPanningEnabled(false);
  }
  DvtDiagramEventManager.superclass.OnMouseDown.call(this, event);
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.OnMouseUp = function(event) {
  //reenabling panning on dragend and on mouseup
  //the panning is disabled on mousedown event to prevent panning for potential node drag
  //if the node was not dragged, the component will not get dragend event and the panning is reenabled on mouseup
  //if the node was dragged, the component will get dragend event, but it might not get mouseup event
  DvtDiagramEventManager.superclass.OnMouseUp.call(this, event);
  this._setPanningEnabled(true);
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.HandleImmediateTouchStartInternal = function(event) {
  if (this.IsDragSupported() && event.targetTouches.length == 1) {
    var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
    if (obj instanceof DvtDiagramNode) {
      this._setPanningEnabled(false);
    }
  }
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.HandleImmediateTouchEndInternal = function(event) {
  if (this.IsDragSupported()) {
    this._setPanningEnabled(true);
  }
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.GetDropTargetType = function(event) {
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
  this._diagram.getCache().putToCache('dropTarget', obj);
  if (obj === null) {
    return 'background';
  }
  else if (obj instanceof DvtDiagramNode) {
    var dropPort;
    if (this._linkDropSelector === null) {
      this._linkDropSelector = this._diagram.getOptions()['dnd']['drop']['ports']['selector'];
    }
    if (this._linkDropSelector) {
      dropPort = this._getPortElement(event.getNativeEvent().target, this._linkDropSelector);
    }
    obj.__dropPort = dropPort; //save the value for the payload call
    return dropPort ? 'ports' : 'nodes';
  }
  else if (obj instanceof DvtDiagramLink) {
    return 'links';
  }
  return null;
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.GetDropEventPayload = function(event) {
  // Apply the drop offset if the drag source is a DVT component
  // NOTE: The drop offset is stored in dataTransfer, so it's only accessible from "drop" event. It can't be
  //       accessed from "dragEnter", "dragOver", and "dragLeave".
  var dataTransfer = event.getNativeEvent().dataTransfer;
  var offsetX = Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_X_DATA_TYPE)) || 0;
  var offsetY = Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_Y_DATA_TYPE)) || 0;

  //point relative to content pane
  var relPos = this._diagram.getPanZoomCanvas().getContentPane().stageToLocal(this.getCtx().pageToStageCoords(event.pageX, event.pageY));
  var layoutOffset = this._diagram.getLayoutOffset();

  var payload = {
    'x' : relPos.x - layoutOffset.x + offsetX,
    'y' : relPos.y - layoutOffset.y + offsetY
  };
  //add node or link context if drop accepted by the node or link
  var obj = this.GetLogicalObject(this.GetCurrentTargetForEvent(event));
  if (obj instanceof DvtDiagramNode) {
    if (obj.__dropPort) {
      payload['dataContext'] = obj.getDataContext();
      payload['portElement'] = obj.__dropPort;
    }
    else {
      payload['nodeContext'] = obj.getDataContext();
    }
    var bounds = obj.getDimensions(this._context.getStage());
    var relNodePos = bounds ? this._diagram.getPanZoomCanvas().getContentPane().stageToLocal({x: bounds.x, y: bounds.y}) : null;
    payload['nodeX'] = relNodePos ? relPos.x - relNodePos.x : null;
    payload['nodeY'] = relNodePos ? relPos.y - relNodePos.y : null;
  }
  else if (obj instanceof DvtDiagramLink) {
    payload['linkContext'] = obj.getDataContext();
  }
  return payload;
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.ShowDropEffect = function(event) {
  var dropTargetType = this.GetDropTargetType(event);
  var obj = this._diagram.getCache().getFromCache('dropTarget');
  if (dropTargetType === 'background') {
    var background = this._diagram.getPanZoomCanvas().getBackgroundPane();
    background.setClassName('oj-active-drop');
  }
  else if (dropTargetType === 'nodes' || dropTargetType === 'links') {
    if (obj && obj.ShowDropEffect) {
      obj.ShowDropEffect();
    }
  }
  else if (obj && dropTargetType === 'ports' && obj.__dropPort) {
    dvt.ToolkitUtils.addClassName(obj.__dropPort, 'oj-active-drop');
  }
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.ShowRejectedDropEffect = function(event) {
  var dropTargetType = this.GetDropTargetType(event);
  var obj = this._diagram.getCache().getFromCache('dropTarget');
  if (dropTargetType === 'background') {
    var background = this._diagram.getPanZoomCanvas().getBackgroundPane();
    background.setClassName('oj-invalid-drop');
  }
  else if (dropTargetType === 'nodes' || dropTargetType === 'links') {
    if (obj && obj.ShowRejectedDropEffect) {
      obj.ShowRejectedDropEffect();
    }
  }
  else if (obj && dropTargetType === 'ports' && obj.__dropPort) {
    dvt.ToolkitUtils.addClassName(obj.__dropPort, 'oj-invalid-drop');
  }
};

/**
 * @override
 */
DvtDiagramEventManager.prototype.ClearDropEffect = function() {
  var background = this._diagram.getPanZoomCanvas().getBackgroundPane();
  background.setClassName(null);
  var obj = this._diagram.getCache().getFromCache('dropTarget');
  if (obj && obj.ClearDropEffect) {
    obj.ClearDropEffect();
  }
  if (obj && obj.__dropPort) {
    dvt.ToolkitUtils.removeClassName(obj.__dropPort, 'oj-active-drop');
    dvt.ToolkitUtils.removeClassName(obj.__dropPort, 'oj-invalid-drop');
  }
  this._diagram.getCache().putToCache('dropTarget', null);
};

/**
 * @private
 * Helper method for finding DOM element representing a port using selector and event target
 * @param {object} elem DOM element
 * @param {string} selector
 * @return {object} DOM element
 */
DvtDiagramEventManager.prototype._getPortElement = function(elem, selector) {
  return elem && elem.closest ? elem.closest(selector) : null;
};
// Copyright (c) 2011, 2017, Oracle and/or its affiliates. All rights reserved.

/**
 *  @constructor
 *  @class DvtDiagramKeyboardHandler base class for keyboard handler for diagram component
 *  @param {dvt.Diagram} component The owning diagram component
 *  @param {dvt.EventManager} manager The owning dvt.EventManager
 *  @extends {dvt.BaseDiagramKeyboardHandler}
 */
var DvtDiagramKeyboardHandler = function(component, manager)
{
  this.Init(component, manager);
};

dvt.Obj.createSubclass(DvtDiagramKeyboardHandler, dvt.BaseDiagramKeyboardHandler, 'DvtDiagramKeyboardHandler');

/**
 * @override
 */
DvtDiagramKeyboardHandler.prototype.isNavigationEvent = function(event)
{
  var retVal = false;
  switch (event.keyCode) {
    case dvt.KeyboardEvent.OPEN_BRACKET:
    case dvt.KeyboardEvent.CLOSE_BRACKET:
      retVal = true; break;
    case dvt.KeyboardEvent.OPEN_ANGLED_BRACKET:
    case dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET:
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
  if (keyCode == dvt.KeyboardEvent.TAB) {
    var currentNavigable = this._eventManager.getFocus();
    if (currentNavigable) {
      dvt.EventManager.consumeEvent(event);
      return currentNavigable;
    }
    else {
      // navigate to the default
      var arNodes = this.GetDiagram().GetRootNodeObjects();
      if (arNodes.length > 0) {
        dvt.EventManager.consumeEvent(event);
        var navigable = this.getDefaultNavigable(arNodes);
        this.GetDiagram().ensureObjInViewport(event, navigable);
        return navigable;
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
/**
 * @constructor
 * @param {dvt.Context} context the rendering context
 * @param {dvt.Diagram} diagram the parent diagram component
 * @param {object} linkData link data
 * @param {boolean} promoted true for promoted link
 */
var DvtDiagramLink = function(context, diagram, linkData, promoted) {
  this.Init(context, diagram, linkData, promoted);
};

dvt.Obj.createSubclass(DvtDiagramLink, dvt.BaseDiagramLink, 'DvtDiagramLink');

/**
 * Link with custom style
 */
DvtDiagramLink.CUSTOM_STYLE = 'customStyle';

/**
 * Returns a new instance of DvtDiagramLink
 * @param {dvt.Diagram} diagram the parent diagram
 * @param {object} data the data for this node
 * @param {boolean} promoted true for promoted link*
 * @return {DvtDiagramLink} the diagram node
 */
DvtDiagramLink.newInstance = function(diagram, data, promoted) {
  return new DvtDiagramLink(diagram.getCtx(), diagram, data, promoted);
};

/**
 * Initializes this component
 * @param {dvt.Context} context the rendering context
 * @param {dvt.Diagram} diagram the parent diagram
 * @param {object} data the data for this node
 * @param {boolean} promoted true for promoted link
 * @protected
 */
DvtDiagramLink.prototype.Init = function(context, diagram, data, promoted) {
  DvtDiagramLink.superclass.Init.call(this, context, data['id'], diagram);
  this._data = data;
  this.setPromoted(promoted);
  if (this._diagram.isSelectionSupported()) {
    this.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
  }
  //sets group id for the link if exists
  this.setGroupId(DvtDiagramLink._getCommonAncestorId(this, diagram));
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
 * @override
 */
DvtDiagramLink.prototype.getActiveElementId = function() {
  //Bug fix 25300184 - JET DIAGRAMER WITH CUSTOM SVG USING NODE ID WHEN MOUSE HOVER
  //If custom renderer is used to render the link, then the application might use the linkId to render links.
  //DvtEventManager sets the linkId on active elements on mouse over/focus for accessibility.
  //So if linkId is used in custom renderer, that will conflict with active element id set by event manager.
  //Hence generate an unique id for active link element.
  if (!this._activeElementId)
    this._activeElementId = this.getId() + Math.floor(Math.random() * 1000000000);//@RandomNumber
  return this._activeElementId;
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
  return this.getData()['svgStyle'] || this.getData()['style'];
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
    return dvt.DiagramLinkConnectorUtils.getStandardConnectorOffset(this.getStartConnectorType(), this.GetAppliedLinkWidth(), this.GetAppliedLinkWidth());
  }
  return 0;
};

/**
 * @override
 */
DvtDiagramLink.prototype.getEndConnectorOffset = function() {
  if (this.getEndConnectorType()) {
    return dvt.DiagramLinkConnectorUtils.getStandardConnectorOffset(this.getEndConnectorType(), this.GetAppliedLinkWidth(), this.GetAppliedLinkWidth());
  }
  return 0;
};


/**
 * Renders diagram link
 */
DvtDiagramLink.prototype.render = function() {
  var diagram = this.GetDiagram();
  //find a parent container for the link and attach a link to it
  var groupId = this.getGroupId();
  var startGroupId = diagram.getNodeById(this.getStartId()).getGroupId();
  var endGroupId = diagram.getNodeById(this.getEndId()).getGroupId();
  if (groupId) {
    var linkParent = diagram.getNodeById(groupId).GetChildNodePane();
    if (groupId == startGroupId && groupId == endGroupId)
      linkParent.addChildAt(this, 0);
    else
      linkParent.addChild(this); //cross container link inside container
  }
  else if (startGroupId || endGroupId) { //cross container link to the top level
    diagram.getNodesPane().addChild(this);
  }
  else { //flat diagram or link connects top level nodes
    diagram.getLinksPane().addChild(this);
  }

  DvtDiagramLink._renderLinkLabels(diagram, this.getData(), this);
  this.setAriaRole('img');
  this.UpdateAriaLabel();
  this._diagram.getEventManager().associate(this, this);
};

/**
 * @override
 */
DvtDiagramLink.prototype.setPoints = function(points) {
  if (!this._pathCmds && points) {
    DvtDiagramLink._renderLinkShape(this.GetDiagram(), this.getData(), this);
  }
  DvtDiagramLink.superclass.setPoints.call(this, points);
};

/**
 * Renders link shape
 * @param {dvt.Diagram} diagram parent component
 * @param {object} linkData
 * @param {dvt.Container} container parent container
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
  var linkStyle = linkData['svgStyle'] || linkData['style'];
  var hitDetectionOffset = linkData['_hitDetectionOffset'];

  //create a transparent underlay wider than the link
  //in order to make it easier to interact with the link
  container._hitDetectionUnderlay = container.CreateUnderlay('#000000', 0, hitDetectionOffset);
  container.addChildAt(container._hitDetectionUnderlay, 0);

  var stroke = new dvt.SolidStroke(linkColor, 1, linkWidth);
  stroke.setFixedWidth(true);

  var shape = new dvt.Path(container.getCtx(), points, id);
  var className = linkData['svgClassName'] || linkData['className'];
  shape.setFill(null);
  shape.setClassName(className);
  //If the linkstyle is an object directly apply it on the link
  if (linkStyle && linkStyle instanceof Object) {
    var strokeType = dvt.Stroke.SOLID; //default stroke type for link style object
    if (linkStyle['_type'] == DvtDiagramLink.CUSTOM_STYLE) {
      if (linkStyle['strokeDasharray']) {
        strokeType = dvt.Stroke.DASHED; //Set the stroke type to dashed only if the stroke dash array is specified
        linkStyle['strokeDasharray'] = dvt.DiagramLinkUtils.processStrokeDashArray(linkStyle['strokeDasharray']);
      }
    } else {
      strokeType = dvt.DiagramLinkUtils.ConvertLinkStyleToStrokeType(linkStyle['_type']);
    }

    stroke.setType(strokeType, linkStyle['strokeDasharray'], linkStyle['strokeDashoffset']);
    //Remove already processed style attributes
    var styleObj = dvt.JsonUtils.clone(linkStyle);
    dvt.ArrayUtils.forEach(['_type', 'strokeDasharray', 'strokeDashoffset'], function(entry) {delete styleObj[entry]});
    //set the style object directly in style
    shape.setStyle(styleObj);
  } else {
    //Use default stroke type if no link style is specified
    var strokeType = dvt.DiagramLinkUtils.ConvertLinkStyleToStrokeType(linkStyle);
    stroke.setType(strokeType, dvt.DiagramLinkUtils.GetStrokeDash(strokeType), dvt.DiagramLinkUtils.GetStrokeDashOffset(strokeType));
  }

  shape.setStroke(stroke);
  container.setShape(shape);
  container.addChildAt(shape, 1);
};

/**
 * Renders link labels
 * @param {dvt.Diagram} diagram parent component
 * @param {object} linkData
 * @param {dvt.Container} container parent container
 * @private
 */
DvtDiagramLink._renderLinkLabels = function(diagram, linkData, container) {
  var rtl = dvt.Agent.isRightToLeft(diagram.getCtx());
  var halign = rtl ? dvt.OutputText.H_ALIGN_RIGHT : dvt.OutputText.H_ALIGN_LEFT;
  if (linkData['label']) {
    var label = DvtDiagramLink.createText(diagram.getCtx(), linkData['label'], linkData['labelStyle'], halign, dvt.OutputText.V_ALIGN_TOP);
    //check for label width
    var labelWidth = dvt.CSSStyle.toNumber((new dvt.CSSStyle(linkData['labelStyle'])).getWidth());
    if (labelWidth > 0 && dvt.TextUtils.fitText(label, labelWidth, Infinity, container)) {
      container._labelObj = label;
    }
    else {
      container.addChild(label);
      container._labelObj = label;
    }
  }
  /*
  if (linkData['secondaryLabel']) {
    var secondaryLabel = DvtDiagramNode.createText(diagram.getCtx(), linkData['secondaryLabel'], linkData['secondaryLabelStyle'], halign, dvt.OutputText.V_ALIGN_TOP);
    container.addChild(secondaryLabel);
    container._secondaryLabelObj = secondaryLabel;
  }
  */
};

/**
 * Creates a text element
 * @param {dvt.Context} ctx the rendering context
 * @param {string} strText the text string
 * @param {string} style the CSS style string to apply to the text
 * @param {string} halign the horizontal alignment
 * @param {string} valign the vertical alignment
 * @return {dvt.OutputText} the text element
 */
DvtDiagramLink.createText = function(ctx, strText, style, halign, valign) {
  var text = new dvt.OutputText(ctx, strText, 0, 0);
  text.setCSSStyle(new dvt.CSSStyle(style));
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
DvtDiagramLink.prototype.ApplyLinkStyle = function(stroke, bUnderlay) {
  var linkStyle = this.GetAppliedLinkStyle();
  if (linkStyle && linkStyle instanceof Object) {
    if (linkStyle['_type'] == DvtDiagramLink.CUSTOM_STYLE) {
      var strokeDashOffset = (linkStyle['strokeDashoffset'] != null) ?
          (dvt.CSSStyle.toNumber(linkStyle['strokeDashoffset']) + 1) : 1;
      stroke.setType(dvt.Stroke.DASHED, dvt.DiagramLinkUtils.getCustomUnderlay(linkStyle['strokeDasharray']), strokeDashOffset);
    } else {
      var strokeType = dvt.DiagramLinkUtils.ConvertLinkStyleToStrokeType(linkStyle['_type']);
      stroke.setType(strokeType, dvt.DiagramLinkUtils.GetStrokeDash(strokeType, bUnderlay), dvt.DiagramLinkUtils.GetStrokeDashOffset(strokeType, bUnderlay));
    }
  } else {
    DvtDiagramLink.superclass.ApplyLinkStyle.call(this, stroke, bUnderlay);
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
  var customTooltip = this.GetDiagram().getOptions()['tooltip'];
  var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
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
  return this.isPromoted() ? this.getData()['_links'].length > 1 ?
      dvt.Bundle.getTranslation(this.GetDiagram().getOptions(), 'promotedLinks', dvt.Bundle.DIAGRAM_PREFIX, 'PROMOTED_LINKS', this.getData()['_links'].length) :
      dvt.Bundle.getTranslation(this.GetDiagram().getOptions(), 'promotedLink', dvt.Bundle.DIAGRAM_PREFIX, 'PROMOTED_LINK', this.getData()['_links'].length) :
      this.getData()['shortDesc'];
};

/**
 * Returns the data context that will be passed to the tooltip function.
 * @return {object}
 */
DvtDiagramLink.prototype.getDataContext = function() {
  return {
    'id': this.getId(),
    'type': this.isPromoted() ? 'promotedLink' : 'link',
    'label': this.getData()['label'],
    'data' : this.isPromoted() ? this.getData()['_links'] : this.getData()['_origData'],
    'component': this.GetDiagram().getOptions()['_widgetConstructor']
  };
};

/**
 * @override
 */
DvtDiagramLink.prototype.getAriaLabel = function() {
  var states = [];
  if (this.isSelectable()) {
    states.push(dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  }
  if (this.isPromoted()) {
    states.push(dvt.Bundle.getTranslatedString(dvt.Bundle.DIAGRAM_PREFIX, 'PROMOTED_LINK_ARIA_DESC'));
  }
  return dvt.Displayable.generateAriaLabel(this.getShortDesc(), states);
};

/**
 * @protected
 * Updates accessibility attributes on selection event
 */
DvtDiagramLink.prototype.UpdateAriaLabel = function() {
  if (!dvt.Agent.deferAriaCreation()) {
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
  if (event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey) {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    return this;
  }
  else if (event.keyCode == dvt.KeyboardEvent.UP_ARROW || event.keyCode == dvt.KeyboardEvent.DOWN_ARROW) {
    //if the link got focus via keyboard, get the node where the focus came from
    //we'll navigate around that node
    //if the focus was set through mouse click, set start node as a center of navigation
    var node = this.getKeyboardFocusNode();
    if (!node)
      node = this.GetDiagram().getNodeById(this.getStartId(this));

    //find next link - if up counter-clockwise, down - clockwise
    var nextLink = this;
    var links = this.GetDiagram().getNavigableLinksForNodeId(node.getId());
    var keyboardHandler = this.GetDiagram().getEventManager().getKeyboardHandler();
    if (keyboardHandler && keyboardHandler.getNextNavigableLink)
      nextLink = keyboardHandler.getNextNavigableLink(node, this, event, links);

    nextLink.setKeyboardFocusNode(node);
    this._diagram.ensureObjInViewport(event, nextLink);
    return nextLink;
  }
  else if (event.keyCode == dvt.KeyboardEvent.RIGHT_ARROW || event.keyCode == dvt.KeyboardEvent.LEFT_ARROW)
  {
    var nodeId;
    if (this._movingToStart(event.keyCode))
      nodeId = this.getStartId();
    else
      nodeId = this.getEndId();
    var node = this.GetDiagram().getNodeById(nodeId);
    this._diagram.ensureObjInViewport(event, node);
    return node;
  }
  else if (event.type == dvt.MouseEvent.CLICK) {
    return this;
  }
  return null;
};

/**
 * Helper function used for keyboard navigation. Checks direction where the focus should move - the start node or the end node
 * @param {number} direction vtKeyboardEvent.RIGHT_ARROW or dvt.KeyboardEvent.LEFT_ARROW
 * @return {boolean} true to move focus to the start node
 * @private
 */
DvtDiagramLink.prototype._movingToStart = function(direction) {
  var start = this.getLinkStart();
  var end = this.getLinkEnd();
  var linkDirectionL2R = (start.x < end.x) ? true : false;

  if ((direction == dvt.KeyboardEvent.RIGHT_ARROW && linkDirectionL2R) ||
      (direction == dvt.KeyboardEvent.LEFT_ARROW && !linkDirectionL2R))
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
  if (hiddenCategories && dvt.ArrayUtils.hasAnyItem(hiddenCategories, this.getCategories())) {
    return true;
  }
  if (!(this.GetDiagram().getNodeById(this.getStartId()) && this.GetDiagram().getNodeById(this.getEndId()))) {
    return true;
  }
  return false;
};

/**
 * Creates the update animation for the diagram link
 * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
 * @param {DvtDiagramLink} oldLink the old link to animate from
 * @param {boolean} bCleanUp true if the link should be removed after animation is done.
 *                          This is a case when multiple links collapse into a promoted link
 */
DvtDiagramLink.prototype.animateUpdate = function(animationHandler, oldLink, bCleanUp) {
  var oldPoints = oldLink.getPoints();
  var newPoints = this.getPoints();
  var playable = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());

  if (!dvt.ArrayUtils.equals(oldPoints, newPoints)) {
    this.setPoints(oldPoints);
    var linkAnimType = dvt.Animator.TYPE_POLYLINE;
    if (newPoints.length > 0 && isNaN(newPoints[0])) {
      linkAnimType = dvt.Animator.TYPE_PATH;
    }
    playable.getAnimator().addProp(linkAnimType, this, this.getPoints, this.setPoints, newPoints);
  }
  if (oldLink._labelObj && this._labelObj) {
    var oldMat = oldLink._labelObj.getMatrix();
    var newMat = this._labelObj.getMatrix();
    if (!oldMat.equals(newMat)) {
      this._labelObj.setMatrix(oldMat);
      playable.getAnimator().addProp(dvt.Animator.TYPE_MATRIX, this._labelObj, this._labelObj.getMatrix, this._labelObj.setMatrix, newMat);
    }
  }

  if (oldLink.getShape() && this.getShape()) {
    var oldStroke = oldLink.getShape().getStroke();
    var newStroke = this.getShape().getStroke();
    if (oldStroke && newStroke &&
        oldStroke instanceof dvt.SolidStroke &&
        newStroke instanceof dvt.SolidStroke &&
        (oldStroke.getColor() != newStroke.getColor() ||
         oldStroke.getWidth() != newStroke.getWidth())) {
      this.getShape().setStroke(oldStroke);
      playable.getAnimator().addProp(dvt.Animator.TYPE_STROKE, this.getShape(), this.getShape().getStroke, this.getShape().setStroke, newStroke);
    }
  }
  if (bCleanUp) {
    var thisRef = this;
    dvt.Playable.appendOnEnd(playable, function() {thisRef.getParent().removeChild(thisRef);});
  }
  animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);
};

/**
 * Creates the delete animation for the link.
 * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations.
 * @param {dvt.Container} deleteContainer
 */
DvtDiagramLink.prototype.animateDelete = function(animationHandler, deleteContainer) {
  this.GetDiagram().getLinksPane().addChild(this);
  var thisRef = this;
  var removeFunc = function() {
    thisRef.getParent().removeChild(thisRef);
    thisRef.destroy();
  };
  var playable = new dvt.AnimFadeOut(this.getCtx(), this, animationHandler.getAnimationDuration());
  dvt.Playable.appendOnEnd(playable, removeFunc);
  animationHandler.add(playable, DvtDiagramDataAnimationHandler.DELETE);
};

/**
 * Creates the insert animation for the link.
 * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
 */
DvtDiagramLink.prototype.animateInsert = function(animationHandler) {
  this.setAlpha(0);
  animationHandler.add(new dvt.AnimFadeIn(this.getCtx(), this, animationHandler.getAnimationDuration()), DvtDiagramDataAnimationHandler.INSERT);
};

/**
 * Creates the collapse animation for the diagram link - many links collapse into single promoted link
 * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
 * @param {Array} oldLinksArray array of old links that are collapsing into this one
 */
DvtDiagramLink.prototype.animateCollapse = function(animationHandler, oldLinksArray) {
  if (!oldLinksArray || oldLinksArray.length == 0)
    return;

  //copy points for the original link to create fake links if needed
  var origPoints = dvt.ArrayUtils.copy(this.getPoints());

  // use first link to animate from many to promoted
  this.animateUpdate(animationHandler, oldLinksArray[0]);

  // create fake links to animate from many to one
  // delete the fake liks at animation end
  for (var i = 1; i < oldLinksArray.length; i++) {
    var data = {'id': '_fakeLink' + i + this.getId()};
    data = dvt.JsonUtils.merge(data, this.getData());
    var fakeLink = new DvtDiagramLink(this.GetDiagram().getCtx(), this.GetDiagram(), data, true);
    fakeLink.render();
    fakeLink.setPoints(origPoints);
    fakeLink.animateUpdate(animationHandler, oldLinksArray[i], true);
  }
};

/**
 * Creates expand animation for the diagram link - one promoted link expands into many
 * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
 * @param {Array} newLinksArray array of new links
 */
DvtDiagramLink.prototype.animateExpand = function(animationHandler, newLinksArray) {
  if (!newLinksArray || newLinksArray.length == 0)
    return;
  for (var i = 0; i < newLinksArray.length; i++) {
    newLinksArray[i].animateUpdate(animationHandler, this);
  }
};


/**
 * @override
 */
DvtDiagramLink.prototype.setLabelAlignments = function(halign, valign) {
  if (halign) {
    if (halign == dvt.OutputText.H_ALIGN_LEFT)
      this._labelObj.alignLeft();
    else if (halign == dvt.OutputText.H_ALIGN_CENTER)
      this._labelObj.alignCenter();
    else if (halign == dvt.OutputText.H_ALIGN_RIGHT)
      this._labelObj.alignRight();
  }
  if (valign) {
    if (valign == dvt.OutputText.V_ALIGN_TOP)
      this._labelObj.alignTop();
    else if (valign == dvt.OutputText.V_ALIGN_MIDDLE)
      this._labelObj.alignMiddle();
    else if (valign == dvt.OutputText.V_ALIGN_BOTTOM)
      this._labelObj.alignBottom();
    else if (valign == 'baseline')
      this._labelObj.alignAuto();
  }
};

/**
 * Sets group id for the link
 * @param {string} id group id for the link
 */
DvtDiagramLink.prototype.setGroupId = function(id)
{
  this._groupId = id;
};

/**
 * @override
 */
DvtDiagramLink.prototype.getGroupId = function()
{
  return this._groupId;
};

/**
 * Helper function that finds closest common ascestor container for the link start and end nodes
 * @param {DvtDiagramLink} link
 * @param {dvt.Diagram} diagram
 * @return {string} id of the closest common ansestor or null for the top level
 * @private
 */
DvtDiagramLink._getCommonAncestorId = function(link, diagram) {
  var getAllAncestorIds = function(id, diagram) {
    var ids = [];
    var groupId = diagram.getNodeById(id) ? diagram.getNodeById(id).getGroupId() : null;
    while (groupId) {
      ids.push(groupId);
      groupId = diagram.getNodeById(groupId) ? diagram.getNodeById(groupId).getGroupId() : null;
    }
    return ids;
  };

  var startPath = getAllAncestorIds(link.getStartId(), diagram);
  var endPath = getAllAncestorIds(link.getEndId(), diagram);

  for (var i = 0; i < startPath.length; i++) {
    if (dvt.ArrayUtils.getIndex(endPath, startPath[i]) > -1) {
      return startPath[i];
    }
  }
  return null;
};

/**
 * Helper function that returns id for a promoted link for specified nodes
 * @param {string} startId id for start node
 * @param {string} endId id for end node
 * @return {string} id for promoted link
 * @protected
 */
DvtDiagramLink.GetPromotedLinkId = function(startId, endId) {
  return '_plL' + startId + '_L' + endId;
};

/**
 * Show drop effect on the link
 */
DvtDiagramLink.prototype.ShowDropEffect = function() {
  if (!this._dropEffect) {
    this._createDropEffect('oj-diagram-link oj-active-drop');
  }
};

/**
 * Show rejected drop effect on the link
 */
DvtDiagramLink.prototype.ShowRejectedDropEffect = function() {
  if (!this._dropEffect) {
    this._createDropEffect('oj-diagram-link oj-invalid-drop');
  }
};

/**
 * Clear drop effect from the link
 */
DvtDiagramLink.prototype.ClearDropEffect = function() {
  if (this._dropEffect) {
    this.removeChild(this._dropEffect);
    this._dropEffect = null;
  }
};

/**
 * Create drop effect for the link
 * @param {string} styleClass style class to be applied to the drop effect
 * @private
 */
DvtDiagramLink.prototype._createDropEffect = function(styleClass) {
  var hitDetectionOffset = this.getData()['_hitDetectionOffset'];
  this._dropEffect = this.CreateFeedbackUnderlay('#000000', 0, hitDetectionOffset, styleClass);
  this._dropEffect.setMouseEnabled(false);
  this.addChild(this._dropEffect);
};

/**
 * Helper function that converts link data from data source into internal format
 * @param {object} linkData data object for the link from data source
 * @return {object} link data object in internal format
 * @protected
 */
DvtDiagramLink.ConvertLinkData = function(linkData) {
  return {
    'id': linkData['id'],
    'startNode': linkData['startNode'],
    'endNode': linkData['endNode'],
    'label': linkData['label'],
    'selectable': linkData['selectable'],
    'shortDesc': linkData['shortDesc'],
    'categories': linkData['categories'],
    '_origData': linkData
  };
};
/**
 * @constructor
 * @param {dvt.Context} context the rendering context
 * @param {dvt.Diagram} diagram the parent diagram component
 * @param {object} nodeData node data
 * @extends {dvt.BaseDiagramNode}
 */
var DvtDiagramNode = function(context, diagram, nodeData) {
  this.Init(context, diagram, nodeData);
};

dvt.Obj.createSubclass(DvtDiagramNode, dvt.BaseDiagramNode, 'DvtDiagramNode');

/**
 * Returns a new instance of DvtDiagramNode
 * @param {dvt.Diagram} diagram the parent diagram
 * @param {object} data the data for this node
 * @return {DvtDiagramNode} the diagram node
 */
DvtDiagramNode.newInstance = function(diagram, data) {
  return new DvtDiagramNode(diagram.getCtx(), diagram, data);
};

/**
 * Initializes this component
 * @param {dvt.Context} context the rendering context
 * @param {dvt.Diagram} diagram the parent diagram
 * @param {object} data the data for this node
 * @protected
 */
DvtDiagramNode.prototype.Init = function(context, diagram, data) {
  DvtDiagramNode.superclass.Init.call(this, context, data['id'], diagram);
  this._data = data;
  if (this._diagram.isSelectionSupported()) {
    this.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
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
DvtDiagramNode.prototype.getActiveElementId = function() {
  //Bug fix 25300184 - JET DIAGRAMER WITH CUSTOM SVG USING NODE ID WHEN MOUSE HOVER
  //If custom renderer is used to render the node, then the application might use the nodeId to render node elements.
  //DvtEventManager sets the nodeId on active elements on mouse over/focus for accessibility.
  //So if nodeId is used in custom renderer, that will conflict with active element id set by event manager.
  //Hence generate an unique id for active node element.
  if (!this._activeElementId)
    this._activeElementId = this.getId() + Math.floor(Math.random() * 1000000000);//@RandomNumber
  return this._activeElementId;
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
 * @return {dvt.ImageMarker|dvt.SimpleMarker} node icon
 * @protected
 */
DvtDiagramNode.prototype.GetIcon = function() {
  return this._shape;
};

/**
 * Renders diagram node
 */
DvtDiagramNode.prototype.render = function() {
  var nodeData = this.getData();
  if (this._diagram.getOptions()['renderer']) {
    this._applyCustomNodeContent(this._diagram.getOptions()['renderer'], this._getState(), null);
    //update container padding if the node is a disclosed container
    if (this.isDisclosed()) {
      var nodeBoundingRect = this.getElem().getBoundingClientRect();
      var childPaneBoundingRect = this._childNodePane ? this._childNodePane.getElem().getBoundingClientRect() : null;
      this._containerPadding = {left: childPaneBoundingRect.left - nodeBoundingRect.left,
        right: nodeBoundingRect.right - childPaneBoundingRect.right,
        top: childPaneBoundingRect.top - nodeBoundingRect.top,
        bottom: nodeBoundingRect.bottom - childPaneBoundingRect.bottom};
    }
  }
  else {
    if (this.isDisclosed()) {
      DvtDiagramNode._renderContainer(this._diagram, nodeData, this);
    }
    else {
      DvtDiagramNode._renderNodeBackground(this._diagram, nodeData, this);
      DvtDiagramNode._renderNodeIcon(this._diagram, nodeData, this);
    }
    DvtDiagramNode._addHoverSelectionStrokes(this.getSelectionShape(), nodeData);
  }
  DvtDiagramNode._renderNodeLabels(this._diagram, nodeData, this);
  this._setDraggableStyleClass();
  this._contentDims = this._calcContentDims();
  DvtDiagramNode._renderContainerButton(this._diagram, nodeData, this);
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
    this._diagram.Log('dvt.Diagram: could not add custom node content - context handler is undefined', 1);
    return;
  }
  var nodeData = this.getData()['_origData'];
  var childContent = null;
  if (this.isDisclosed()) {
    var childNodePane = this.GetChildNodePane();
    var bbox = childNodePane.getDimensions();
    childContent = {'element': childNodePane.getElem(), 'w' : bbox ? bbox.w - bbox.x : null, 'h': bbox ? bbox.h - bbox.y : null};
  }
  var context = contextHandler(this.getElem(), this._customNodeContent, childContent, nodeData, state, prevState);
  var nodeContent = renderer(context);

  //remove content if the new and old content do not match, the new content might be null
  if (this._customNodeContent && nodeContent != this._customNodeContent) {
    if (this._customNodeContent.namespaceURI === dvt.ToolkitUtils.SVG_NS) {
      this.getContainerElem().removeChild(this._customNodeContent);
    }
    else {
      this.removeChild(nodeContent);
    }
    this._customNodeContent = null;
  }

  if (nodeContent && nodeContent.namespaceURI === dvt.ToolkitUtils.SVG_NS) {
    if (!this._customNodeContent) {
      dvt.ToolkitUtils.appendChildElem(this.getContainerElem(), nodeContent);
      this._customNodeContent = nodeContent;
    }
  }
  else if (nodeContent instanceof dvt.BaseComponent) {
    if (!this._customNodeContent) {
      this.addChild(nodeContent);
      this._customNodeContent = nodeContent;
    }
  }
  else if (nodeContent) { //not an svg fragment
    this._diagram.Log('dvt.Diagram: could not add custom node content for the node ' + this.getId() + nodeContent, 1);
  }
};

/**
 * Renders node icon
 * @param {dvt.Diagram} diagram parent component
 * @param {object} nodeData node data
 * @param {dvt.Container} container parent container
 * @private
 */
DvtDiagramNode._renderNodeBackground = function(diagram, nodeData, container) {
  var backgroundStyle = nodeData['backgroundSvgStyle'] || nodeData['backgroundStyle'];
  var styleObj = dvt.JsonUtils.clone(backgroundStyle);
  var backgroundProps = [dvt.CSSStyle.WIDTH,
    dvt.CSSStyle.HEIGHT,
    dvt.CSSStyle.BACKGROUND_COLOR,
    dvt.CSSStyle.BORDER_COLOR,
    dvt.CSSStyle.BORDER_WIDTH,
    dvt.CSSStyle.BORDER_RADIUS];
  //Merge the background style from options and background style from CSS object
  var backgroundStyle = DvtDiagramNode._getNodeCSSStyle(styleObj,
                                                        nodeData['_backgroundStyle'],
                                                        backgroundProps);
  if (!backgroundStyle.isEmpty()) {
    var width = dvt.CSSStyle.toNumber(backgroundStyle.getStyle(dvt.CSSStyle.WIDTH));
    var height = dvt.CSSStyle.toNumber(backgroundStyle.getStyle(dvt.CSSStyle.HEIGHT));
    var fillColor = backgroundStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);

    var borderColor = backgroundStyle.getStyle(dvt.CSSStyle.BORDER_COLOR);
    var borderWidth = dvt.CSSStyle.toNumber(backgroundStyle.getStyle(dvt.CSSStyle.BORDER_WIDTH));
    var borderRadius = dvt.CSSStyle.toNumber(backgroundStyle.getStyle(dvt.CSSStyle.BORDER_RADIUS));

    var backgroundRect = new dvt.Rect(diagram.getCtx(), 0, 0, width, height);
    backgroundRect.setSolidFill(fillColor);
    if (borderRadius) {
      backgroundRect.setRx(borderRadius);
      backgroundRect.setRy(borderRadius);
    }
    if (borderColor) {
      backgroundRect.setStroke(new dvt.SolidStroke(borderColor, 1, borderWidth));
    }

    //Parse out the CSS properties which are already applied on the DOM
    if (styleObj)
      dvt.ArrayUtils.forEach(backgroundProps, function(entry) {delete styleObj[dvt.CSSStyle.cssStringToObjectProperty(entry)]});
    //Set the style and class attributes for node background
    backgroundRect.setStyle(styleObj).setClassName(nodeData['backgroundClassName']);

    container.addChild(backgroundRect);
    container.setSelectionShape(backgroundRect);
    container._background = backgroundRect;
  }
};

/**
 * Renders node icon
 * @param {dvt.Diagram} diagram parent component
 * @param {object} nodeData node data
 * @param {dvt.Container} container parent container
 * @private
 */
DvtDiagramNode._renderNodeIcon = function(diagram, nodeData, container) {
  var icon = nodeData['icon'];
  if (icon) {
    var iconWidth = icon['width'];
    var iconHeight = icon['height'];
    var iconColor = icon['color'];
    var iconBorderRadius = icon['borderRadius'];
    var iconMarker;
    if (icon['source']) {
      iconMarker = new dvt.ImageMarker(diagram.getCtx(), iconWidth / 2, iconHeight / 2, iconWidth, iconHeight, iconBorderRadius,
          icon['source'], icon['sourceSelected'], icon['sourceHover'], icon['sourceHoverSelected']);
    }
    else {
      iconMarker = new dvt.SimpleMarker(diagram.getCtx(), icon['shape'], dvt.CSSStyle.SKIN_ALTA, iconWidth / 2, iconHeight / 2, iconWidth, iconHeight, iconBorderRadius);
    }
    if (icon['fillPattern'] != 'none') {
      iconMarker.setFill(new dvt.PatternFill(icon['fillPattern'], iconColor, iconColor));
    }
    else {
      iconMarker.setSolidFill(iconColor);
    }
    if (icon['opacity'] != null) {
      iconMarker.setAlpha(icon['opacity']);
    }
    if (icon['borderColor']) {
      iconMarker.setStroke(new dvt.SolidStroke(icon['borderColor'], icon['borderWidth']));
    }
    var style = icon['svgStyle'] || icon['style'];
    var className = icon['svgClassName'] || icon['className'];
    iconMarker.setStyle(style).setClassName(className);

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
 * @param {dvt.Diagram} diagram parent component
 * @param {object} nodeData node data
 * @param {dvt.Container} container parent container
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
      if (dvt.Agent.isRightToLeft(container.getCtx())) {
        positionX = backgroundWidth - positionX - iconWidth;
      }
    }
    else {
      var resolvedHalign = iconData['halign'];
      if (resolvedHalign == 'start') {
        resolvedHalign = dvt.Agent.isRightToLeft(container.getCtx()) ? 'right' : 'left';
      }
      else if (resolvedHalign == 'end') {
        resolvedHalign = dvt.Agent.isRightToLeft(container.getCtx()) ? 'left' : 'right';
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
 * @param {dvt.Diagram} diagram parent component
 * @param {object} nodeData node data
 * @param {dvt.Container} container parent container
 * @private
 */
DvtDiagramNode._renderNodeLabels = function(diagram, nodeData, container) {
  if (container._labelObj) {
    container.removeChild(container._labelObj);
    container._labelObj = null;
  }
  var rtl = dvt.Agent.isRightToLeft(diagram.getCtx());
  var halign = rtl ? dvt.OutputText.H_ALIGN_RIGHT : dvt.OutputText.H_ALIGN_LEFT;
  if (nodeData['label']) {
    var label = DvtDiagramNode.createText(diagram.getCtx(), nodeData['label'], nodeData['labelStyle'], halign, dvt.OutputText.V_ALIGN_TOP);
    //check for label width
    var labelWidth = dvt.CSSStyle.toNumber((new dvt.CSSStyle(nodeData['labelStyle'])).getWidth());
    if (labelWidth > 0 && dvt.TextUtils.fitText(label, labelWidth, Infinity, container)) {
      container._labelObj = label;
    }
    else {
      container.addChild(label);
      container._labelObj = label;
    }
  }
  /*
  if (nodeData['secondaryLabel']) {
    var secondaryLabel = DvtDiagramNode.createText(diagram.getCtx(), nodeData['secondaryLabel'], nodeData['secondaryLabelStyle'], halign, dvt.OutputText.V_ALIGN_TOP);
    container.addChild(secondaryLabel);
    container._secondaryLabelObj = secondaryLabel;
  }
  */
};

/**
 * Creates a text element
 * @param {dvt.Context} ctx the rendering context
 * @param {string} strText the text string
 * @param {string} style the CSS style string to apply to the text
 * @param {string} halign the horizontal alignment
 * @param {string} valign the vertical alignment
 * @return {dvt.OutputText} the text element
 */
DvtDiagramNode.createText = function(ctx, strText, style, halign, valign) {
  var text = new dvt.OutputText(ctx, strText, 0, 0);
  text.setCSSStyle(new dvt.CSSStyle(style));
  text.setHorizAlignment(halign);
  text.setVertAlignment(valign);
  return text;
};

/**
 * Adds hover selection strokes to the node
 * @param {dvt.Shape} selectionShape selection shape for the node
 * @param {object} nodeData node data
 * @private
 */
DvtDiagramNode._addHoverSelectionStrokes = function(selectionShape, nodeData) {
  //Apply the selected, and hover strokes
  var hoverInnerColor = nodeData['hoverInnerColor'];
  var hoverOuterColor = nodeData['hoverOuterColor'];
  var selectionColor = nodeData['selectionColor'];

  var his = new dvt.SolidStroke(hoverInnerColor, 1, 4);
  his.setFixedWidth(true);
  var hos = new dvt.SolidStroke(hoverOuterColor, 1, 8);
  hos.setFixedWidth(true);
  var sis = new dvt.SolidStroke(selectionColor, 1, 2);
  sis.setFixedWidth(true);
  var sos = new dvt.SolidStroke(selectionColor, 1, 4);
  sos.setFixedWidth(true);
  var shis = new dvt.SolidStroke(hoverInnerColor, 1, 4);
  shis.setFixedWidth(true);
  var shos = new dvt.SolidStroke(selectionColor, 1, 8);
  shos.setFixedWidth(true);
  selectionShape.setHoverStroke(his, hos).setSelectedStroke(sis, sos).setSelectedHoverStroke(shis, shos);
};


/**
 * Sets the shape that should be used for displaying selection and hover feedback
 * @param {dvt.Shape} selectionShape the shape that should be used for displaying selection and hover feedback
 */
DvtDiagramNode.prototype.setSelectionShape = function(selectionShape) {
  this._selectionShape = selectionShape;
};


/**
 * Gets the shape that should be used for displaying selection and hover feedback
 * @return {dvt.Shape} the shape that should be used for displaying selection and hover feedback
 */
DvtDiagramNode.prototype.getSelectionShape = function() {
  if (!this._selectionShape && this._contentDims) { // create selection shape in necessary
    var selectionShape = new dvt.Rect(this._diagram.getCtx(), this._contentDims.x, this._contentDims.y, this._contentDims.w, this._contentDims.h);
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
  if (this._isShowingHoverEffect)
    return;
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
  if (this._isShowingHoverEffect) {
    var prevState = this._getState();
    this._isShowingHoverEffect = false;
    if (this._diagram.getOptions()['hoverRenderer']) {
      this._applyCustomNodeContent(this._diagram.getOptions()['hoverRenderer'], this._getState(), prevState);
    }
    else {
      this.processDefaultHoverEffect(false);
    }
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
  var customTooltip = this.GetDiagram().getOptions()['tooltip'];
  var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
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
    'label': this.getData()['label'],
    'data': this.getData()['_origData'],
    'component': this.GetDiagram().getOptions()['_widgetConstructor']
  };
};

/**
 * @override
 */
DvtDiagramNode.prototype.getAriaLabel = function() {
  var states = [];
  if (this.isSelectable()) {
    states.push(dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));
  }
  if (this.isContainer()) {
    states.push(this.isDisclosed() ? dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'STATE_EXPANDED') :
        dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'STATE_COLLAPSED'));
  }
  return dvt.Displayable.generateAriaLabel(this.getShortDesc(), states);
};

/**
 * @protected
 * Updates accessibility attributes on selection event
 */
DvtDiagramNode.prototype.UpdateAriaLabel = function() {
  if (!dvt.Agent.deferAriaCreation()) {
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
  if (event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey) {
    // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
    // care of the selection
    next = this;
  }
  else if ((event.keyCode == dvt.KeyboardEvent.OPEN_ANGLED_BRACKET || dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET) &&
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
  }
  else if (event.keyCode == dvt.KeyboardEvent.OPEN_BRACKET) { //next node down in container hierarchy
    if (this.isDisclosed()) {
      var childNodes = this.getChildNodes();
      next = childNodes[0];
    }
    else
      next = this;
  }
  else if (event.keyCode == dvt.KeyboardEvent.CLOSE_BRACKET) {//next node up in container hierarchy
    var parentNode = this.getGroupId() ? this.GetDiagram().getNodeById(this.getGroupId()) : null;
    next = parentNode ? parentNode : this;
  }
  else if (event.type == dvt.MouseEvent.CLICK) {
    next = this;
  }
  else {
    // get next navigable node
    var parentNode = this.getGroupId() ? this.GetDiagram().getNodeById(this.getGroupId()) : null;
    var siblings = parentNode ? parentNode.getChildNodes() : this.GetDiagram().GetRootNodeObjects();
    next = dvt.KeyboardHandler.getNextAdjacentNavigable(this, event, siblings);
  }
  if (event instanceof dvt.KeyboardEvent)
    this._diagram.ensureObjInViewport(event, next);

  return next;
};

/**
 * Process a keyboard event
 * @param {dvt.KeyboardEvent} event
 */
DvtDiagramNode.prototype.HandleKeyboardEvent = function(event) {
  if (event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey && event.shiftKey) {
    if (this.isContainer()) {
      this.GetDiagram().setNodeDisclosed(this.getId(), !this.isDisclosed());
    }
  }
};

/**
 * Check if the node is a container node
 * @return {boolean} return true for contaienr node
 */
DvtDiagramNode.prototype.isContainer = function() {
  var dataSource = this.GetDiagram().getOptions()['data'];
  return dataSource['getChildCount'](this.getData()) == 0 ? false : true;
};

/**
 * @override
 */
DvtDiagramNode.prototype.showKeyboardFocusEffect = function() {
  if (this.isShowingKeyboardFocusEffect())
    return;
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
      this._applyCustomNodeContent(this._diagram.getOptions()['focusRenderer'], this._getState(), prevState);
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
  if (hiddenCategories && dvt.ArrayUtils.hasAnyItem(hiddenCategories, this.getCategories())) {
    return true;
  }
  return false;
};

/**
 * Get the content bounds in coordinates relative to this node.
 * @return {dvt.Rectangle} content bounds
 * @private
 */
DvtDiagramNode.prototype._calcContentDims = function() {
  var dims = null;
  if (this._customNodeContent) { // custom renderer
    var bbox;
    if (this._customNodeContent instanceof dvt.BaseComponent) {
      bbox = this._customNodeContent.getDimensions();
      if (bbox) {
        dims = new dvt.Rectangle(bbox.x, bbox.y, bbox.w, bbox.h);
      }
    }
    else {
      bbox = this._customNodeContent.getBBox();
      if (bbox) {
        dims = new dvt.Rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
      }
    }
  }
  else if (this.isDisclosed()) { // standard container renderer
    dims = this._containerShape.GetDimensionsWithStroke(this);
  }
  else { // standard leaf node or collapsed node renderer
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

  var playable = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());

  // animate node internals - consider 3 different scenarios
  // - node is leaf node or collapsed container node - animate internal elements
  // - container node - disclosure state didn't change - constract animation for children
  // - container node - disclosure state changed - animate disclosure

  // 1. node is leaf node or collapsed container node
  if (!this.isDisclosed() && !oldNode.isDisclosed()) {
    DvtDiagramNode._animatePosition(playable, oldNode, this);
    //size
    if (oldNode._shape && this._shape) {
      playable.getAnimator().addProp(dvt.Animator.TYPE_RECTANGLE, this._shape, this._shape.getCenterDimensions, this._shape.setCenterDimensions, this._shape.getCenterDimensions());
      this._shape.setCenterDimensions(oldNode._shape.getCenterDimensions());
    }
    //label
    if (oldNode._labelObj && this._labelObj) {
      var oldMat = oldNode._labelObj.getMatrix();
      var newMat = this._labelObj.getMatrix();
      if (!oldMat.equals(newMat)) {
        this._labelObj.setMatrix(oldMat);
        playable.getAnimator().addProp(dvt.Animator.TYPE_MATRIX, this._labelObj, this._labelObj.getMatrix, this._labelObj.setMatrix, newMat);
      }
    }
    //background and icon
    DvtDiagramNode._animateFill(playable, oldNode._background, this._background);
    DvtDiagramNode._animateFill(playable, oldNode._shape, this._shape);
  }
  // 2. both nodes are disclosed containers - node size, background and child nodes could change
  else if (this.isDisclosed() && oldNode.isDisclosed()) {
    if (this._diagram.getOptions()['renderer']) {
      this._animateCustomUpdate(animationHandler, oldNode);
    }
    else {
      DvtDiagramNode._animatePosition(playable, oldNode, this);

      //animate size and background
      DvtDiagramNode._animateContainer(playable, oldNode._containerShape, this._containerShape);

      //animate expand-collapse button position in rtl case
      if (dvt.Agent.isRightToLeft(this.getCtx()) && oldNode._containerButton && this._containerButton) {
        var oldButtonTx = oldNode._containerButton.getTranslateX();
        var newButtonTx = this._containerButton.getTranslateX();
        if (oldButtonTx != newButtonTx) {
          this._containerButton.setTranslateX(oldButtonTx);
          playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this._containerButton,
              this._containerButton.getTranslateX, this._containerButton.setTranslateX, newButtonTx);
        }
      }

      //construct animation for child nodes
      var newChildNodes = [], oldChildNodes = [];
      var newChildIds = this.getChildNodeIds();
      for (var i = 0; i < newChildIds.length; i++) {
        newChildNodes.push(this.GetDiagram().getNodeById(newChildIds[i]));
      }
      var oldChildIds = oldNode.getChildNodeIds();
      var oldNodes = animationHandler.getOldDiagram().getNodes();
      for (var i = 0; i < oldChildIds.length; i++) {
        oldChildNodes.push(oldNodes[oldChildIds[i]]);
      }
      animationHandler.constructAnimation(oldChildNodes, newChildNodes);
    }
  }
  // 3. disclosure state changed - animate disclosure
  else {
    this._animateCustomUpdate(animationHandler, oldNode);
  }
  animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);
};

/**
 * Animates container disclosure and nodes created by custom renderer
 * @param {DvtDiagramDataAnimationHandler} animationHandler The animation handler, which can be used to chain animations.
 * @param {DvtDiagramNode} oldNode The old node state to animate from.
 * @private
 */
DvtDiagramNode.prototype._animateCustomUpdate = function(animationHandler, oldNode) {
  var oldBounds = oldNode.getContentBounds();
  var newBounds = this.getContentBounds();

  if (oldBounds.equals(newBounds)) {
    var playable = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());
    DvtDiagramNode._animatePosition(playable, oldNode, this);
    animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);
    return;
  }

  //attach old node for custom animation
  this.getParent().addChild(oldNode);

  // scales for sizing and positioning
  var scaleTo = newBounds.w / oldBounds.w;  //used for old node
  var scaleFrom = oldBounds.w / newBounds.w;  //used for new node

  //create animator to animate position
  var playable = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());

  //animate old node position
  var newNodeCenter = new dvt.Point(this.getTranslateX() + newBounds.w * .5, this.getTranslateY() + newBounds.h * .5);
  playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, oldNode, oldNode.getTranslateX, oldNode.setTranslateX, newNodeCenter.x - oldBounds.w * scaleTo * .5);
  playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, oldNode, oldNode.getTranslateY, oldNode.setTranslateY, newNodeCenter.y - oldBounds.h * scaleTo * .5);

  //animate new node position
  var oldNodeCenter = new dvt.Point(oldNode.getTranslateX() + oldBounds.w * .5, oldNode.getTranslateY() + oldBounds.h * .5);
  var newTx = this.getTranslateX();
  var newTy = this.getTranslateY();
  this.setTranslateX(oldNodeCenter.x - newBounds.w * scaleFrom * .5);
  this.setTranslateY(oldNodeCenter.y - newBounds.w * scaleFrom * .5);
  playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getTranslateX, this.setTranslateX, newTx);
  playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getTranslateY, this.setTranslateY, newTy);
  animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);

  // animate scale and fade out old node
  var scaleOldToNew = new dvt.AnimScaleTo(this.getCtx(), oldNode, new dvt.Point(scaleTo, scaleTo), animationHandler.getAnimationDuration());
  animationHandler.add(scaleOldToNew, DvtDiagramDataAnimationHandler.UPDATE);

  var fadeOut = new dvt.AnimFadeOut(this.getCtx(), oldNode, animationHandler.getAnimationDuration());
  animationHandler.add(fadeOut, DvtDiagramDataAnimationHandler.UPDATE);
  var thisRef = this;
  dvt.Playable.appendOnEnd(fadeOut, function() {thisRef.getParent().removeChild(oldNode)});

  // animate scale and fade in new node
  this.setScaleX(scaleFrom);
  this.setScaleY(scaleFrom);
  var scaleNewToOld = new dvt.AnimScaleTo(this.getCtx(), this, new dvt.Point(1, 1), animationHandler.getAnimationDuration());
  animationHandler.add(scaleNewToOld, DvtDiagramDataAnimationHandler.UPDATE);

  this.setAlpha(0);
  var fadeIn = new dvt.AnimFadeIn(this.getCtx(), this, animationHandler.getAnimationDuration());
  animationHandler.add(fadeIn, DvtDiagramDataAnimationHandler.UPDATE);
};

/**
 * Helper to animate node position
 * @param {dvt.Playable} playable The playable to add the animation to
 * @param {dvt.Displayable} oldNode old node
 * @param {dvt.Displayable} newNode new node
 * @private
 */
DvtDiagramNode._animatePosition = function(playable, oldNode, newNode) {
  if (newNode && oldNode) {
    var oldTx = oldNode.getTranslateX();
    var oldTy = oldNode.getTranslateY();
    var newTx = newNode.getTranslateX();
    var newTy = newNode.getTranslateY();
    if (oldTx != newTx) {
      newNode.setTranslateX(oldTx);
      playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, newNode, newNode.getTranslateX, newNode.setTranslateX, newTx);
    }
    if (oldTy != newTy) {
      newNode.setTranslateY(oldTy);
      playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, newNode, newNode.getTranslateY, newNode.setTranslateY, newTy);
    }
  }
};

/**
 * Helper to animate between container shapes - animates container background and shape
 * @param {dvt.Playable} playable The playable to add the animation to
 * @param {dvt.Displayable} oldDisplayable old displayble
 * @param {dvt.Displayable} newDisplayable new displayable
 * @private
 */
DvtDiagramNode._animateContainer = function(playable, oldDisplayable, newDisplayable) {
  if (newDisplayable && oldDisplayable) {
    DvtDiagramNode._animateFill(playable, oldDisplayable, newDisplayable);
    playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, newDisplayable, newDisplayable.getWidth, newDisplayable.setWidth, newDisplayable.getWidth());
    newDisplayable.setWidth(oldDisplayable.getWidth());
    playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, newDisplayable, newDisplayable.getHeight, newDisplayable.setHeight, newDisplayable.getHeight());
    newDisplayable.setHeight(oldDisplayable.getHeight());
  }
};

/**
 * Helper to animate between fills
 * @param {dvt.Playable} playable The playable to add the animation to
 * @param {dvt.Displayable} oldDisplayable old displayble
 * @param {dvt.Displayable} newDisplayable new displayable
 * @private
 */
DvtDiagramNode._animateFill = function(playable, oldDisplayable, newDisplayable) {
  if (oldDisplayable && newDisplayable && newDisplayable.getFill() instanceof dvt.SolidFill && !newDisplayable.getFill().equals(oldDisplayable.getFill())) {
    playable.getAnimator().addProp(dvt.Animator.TYPE_FILL, newDisplayable, newDisplayable.getFill, newDisplayable.setFill, newDisplayable.getFill());
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
  var playable = new dvt.AnimFadeOut(this.getCtx(), this, animationHandler.getAnimationDuration());
  dvt.Playable.appendOnEnd(playable, removeFunc);
  animationHandler.add(playable, DvtDiagramDataAnimationHandler.DELETE);
};

/**
 * @override
 */
DvtDiagramNode.prototype.animateInsert = function(animationHandler) {
  this.setAlpha(0);
  animationHandler.add(new dvt.AnimFadeIn(this.getCtx(), this, animationHandler.getAnimationDuration()), DvtDiagramDataAnimationHandler.INSERT);
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
    'zoom': zoom ? zoom : this.GetDiagram().getPanZoomCanvas().getZoom(),
    'expanded': this.isDisclosed()};
};

/**
 * Calls zoom renderer on zoom event if zoom renderer is specified
 * @param {dvt.ZoomEvent} event zoom event
 */
DvtDiagramNode.prototype.rerenderOnZoom = function(event) {
  if (this._diagram.getOptions()['zoomRenderer']) {
    var prevState = this._getState(event.getOldZoom());
    var state = this._getState(event.getNewZoom());
    this._applyCustomNodeContent(this._diagram.getOptions()['zoomRenderer'], state, prevState);
  }
};
/**
 * @override
 */
DvtDiagramNode.prototype.setLabelAlignments = function(halign, valign) {
  if (halign) {
    if (halign == dvt.OutputText.H_ALIGN_LEFT)
      this._labelObj.alignLeft();
    else if (halign == dvt.OutputText.H_ALIGN_CENTER)
      this._labelObj.alignCenter();
    else if (halign == dvt.OutputText.H_ALIGN_RIGHT)
      this._labelObj.alignRight();
  }
  if (valign) {
    if (valign == dvt.OutputText.V_ALIGN_TOP)
      this._labelObj.alignTop();
    else if (valign == dvt.OutputText.V_ALIGN_MIDDLE)
      this._labelObj.alignMiddle();
    else if (valign == dvt.OutputText.V_ALIGN_BOTTOM)
      this._labelObj.alignBottom();
    else if (valign == 'baseline')
      this._labelObj.alignAuto();
  }
};

/**
 * @override
 */
DvtDiagramNode.prototype.getContainerPadding = function() {
  if (!this._containerPadding && this._diagram.getOptions()['renderer']) {
    var nodeBoundingRect = this.getElem().getBoundingClientRect();
    var childPaneBoundingRect = this._childNodePane ? this._childNodePane.getElem().getBoundingClientRect() : null;
    this._containerPadding = {left: childPaneBoundingRect.left - nodeBoundingRect.left,
      right: nodeBoundingRect.right - childPaneBoundingRect.right,
      top: childPaneBoundingRect.top - nodeBoundingRect.top,
      bottom: nodeBoundingRect.bottom - childPaneBoundingRect.bottom};
  }
  else if (!this._containerPadding) {
    var paddingProps = ['padding-left', 'padding-right', 'padding-top', 'padding-bottom'];
    var containerStyleObj = this._data['containerSvgStyle'] || this._data['containerStyle'];
    var styles = DvtDiagramNode._getNodeCSSStyle(containerStyleObj,
        this._data['_containerStyle'],
        paddingProps);
    this._containerPadding = {left: styles.getPadding('padding-left'),
      right: styles.getPadding('padding-right'),
      top: styles.getPadding('padding-top'),
      bottom: styles.getPadding('padding-bottom')};
  }
  return this._containerPadding;
};

/**
 * Gets child ids for the node
 * @return {array} an array of child ids
 */
DvtDiagramNode.prototype.getChildNodeIds = function()
{
  return this._childNodeIds;
};

/**
 * Adds id of a child node to the array of child nodes
 * @param {string} id child id
 */
DvtDiagramNode.prototype.addChildNodeId = function(id)
{
  if (!this._childNodeIds)
    this._childNodeIds = [];
  this._childNodeIds.push(id);
};

/**
 * Gets visible child nodes for the node
 * @return {array} an array of visible child nodes
 */
DvtDiagramNode.prototype.getChildNodes = function()
{
  var childNodes = [];
  var count = this._childNodeIds ? this._childNodeIds.length : -1;
  for (var i = 0; i < count; i++) {
    var child = this.GetDiagram().getNodeById(this._childNodeIds[i]);
    if (child) {
      childNodes.push(child);
    }
  }
  return childNodes;
};

/**
 * Sets group id for the node
 * @param {string} id group id for the node
 */
DvtDiagramNode.prototype.setGroupId = function(id)
{
  this._groupId = id;
};

/**
 * @override
 */
DvtDiagramNode.prototype.getGroupId = function()
{
  return this._groupId;
};

/**
 * @protected
 * Gets child node pane for the diagram node
 * @return {dvt.Container} child node pane for the diagram node
 */
DvtDiagramNode.prototype.GetChildNodePane = function() {
  if (!this._childNodePane) {
    this._childNodePane = new dvt.Container(this.getCtx());
    this.addChild(this._childNodePane);
  }
  return this._childNodePane;
};


/**
 * Handles container disclosure
 * @param {dvt.MouseEvent} event
 */
DvtDiagramNode.prototype.handleDisclosure = function(event) {
  dvt.EventManager.consumeEvent(event);
  this._diagram.setNodeDisclosed(this.getId(), !this.isDisclosed());
};

/**
 * Renders container shape
 * @param {dvt.Diagram} diagram parent component
 * @param {object} nodeData node data
 * @param {dvt.Container} container parent container
 * @private
 */
DvtDiagramNode._renderContainer = function(diagram, nodeData, container) {
  if (container._containerShape) {
    container.removeChild(container._containerShape);
    container._containerShape = null;
  }
  var containerStyleObj = nodeData['containerSvgStyle'] || nodeData['containerStyle'];
  var styleObj = dvt.JsonUtils.clone(containerStyleObj);
  var containerProps = [dvt.CSSStyle.BACKGROUND_COLOR,
                        dvt.CSSStyle.BORDER_COLOR,
                        dvt.CSSStyle.BORDER_WIDTH,
                        dvt.CSSStyle.BORDER_RADIUS];
  //Merge the container style from options and container style from CSS object
  var containerStyle = DvtDiagramNode._getNodeCSSStyle(styleObj,
      nodeData['_containerStyle'],
      containerProps);

  var fillColor = containerStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
  var borderColor = containerStyle.getStyle(dvt.CSSStyle.BORDER_COLOR);
  var borderWidth = dvt.CSSStyle.toNumber(containerStyle.getStyle(dvt.CSSStyle.BORDER_WIDTH));
  var borderRadius = dvt.CSSStyle.toNumber(containerStyle.getStyle(dvt.CSSStyle.BORDER_RADIUS));

  var childNodePane = container.GetChildNodePane();
  var padding = container.getContainerPadding();
  childNodePane.setTranslate(padding.left, padding.top);
  var childBounds = childNodePane.getDimensionsWithStroke();
  var containerShape = new dvt.Rect(diagram.getCtx(), 0, 0,
      childBounds.w + padding.left + padding.right,
      childBounds.h + padding.top + padding.bottom);
  containerShape.setSolidFill(fillColor);
  if (borderRadius) {
    containerShape.setRx(borderRadius);
    containerShape.setRy(borderRadius);
  }
  if (borderColor) {
    containerShape.setStroke(new dvt.SolidStroke(borderColor, 1, borderWidth));
  }

  //Parse out the CSS properties which are already applied on the DOM
  if (styleObj)
    dvt.ArrayUtils.forEach(containerProps, function(entry) {delete styleObj[dvt.CSSStyle.cssStringToObjectProperty(entry)]});
  //Set the style and class attributes for node container
  containerShape.setStyle(styleObj).setClassName(nodeData['containerClassName']);

  container.addChildAt(containerShape, 0);
  container.setSelectionShape(containerShape);
  container._containerShape = containerShape;
};

/**
 * Get the CSS style for the node based on the style properties from node options and
 * style properties from node defaults.
 * Style property from node options takes precedence.
 *
 * @param {object} styleObj  style object from node options
 * @param {dvt.CSS} styleCSS  CSS style object from node defaults
 * @param {array} properties  array of properties to parse
 * @return {dvt.CSS} CSS style object
 * @private
 */
DvtDiagramNode._getNodeCSSStyle = function(styleObj, styleCSS, properties) {
  var style = new dvt.CSSStyle();
  dvt.ArrayUtils.forEach(properties, function(entry) {
    var value = null;
    //convert CSS string property to object attribute
    var attribute = dvt.CSSStyle.cssStringToObjectProperty(entry);
    if (styleObj && styleObj[attribute] != null)
      value = styleObj[attribute];
    else if (styleCSS)
      value = styleCSS.getStyle(entry);
    style.setStyle(entry, value);
  });
  return style;
};

/**
 * @private
 * Renders expand or collapse button for the container node
 * @param {dvt.Diagram} diagram parent component
 * @param {object} nodeData node data
 * @param {DvtDiagramNode} container parent container
 */
DvtDiagramNode._renderContainerButton = function(diagram, nodeData, container) {
  if (container._containerButton) {
    container.removeChild(container._containerButton);
    container._containerButton = null;
  }
  if (!container.isContainer() || nodeData['showDisclosure'] == 'off') {
    return;
  }
  var iconEna, iconOvr, iconDwn;
  var options = diagram.getOptions();
  if (container.isDisclosed()) {
    iconEna = options['_resources']['collapse_ena'];
    iconOvr = options['_resources']['collapse_ovr'];
    iconDwn = options['_resources']['collapse_dwn'];
  }
  else {
    iconEna = options['_resources']['expand_ena'];
    iconOvr = options['_resources']['expand_ovr'];
    iconDwn = options['_resources']['expand_dwn'];
  }
  var imgEna = new dvt.Image(diagram.getCtx(), iconEna['src'], 0, 0, iconEna['width'], iconEna['height']);
  var imgOvr = new dvt.Image(diagram.getCtx(), iconOvr['src'], 0, 0, iconOvr['width'], iconOvr['height']);
  var imgDwn = new dvt.Image(diagram.getCtx(), iconDwn['src'], 0, 0, iconDwn['width'], iconDwn['height']);
  var containerButton = new dvt.Button(diagram.getCtx(), imgEna, imgOvr, imgDwn, null, null, container.handleDisclosure, container);

  container.addChild(containerButton);
  if (container._contentDims) {
    var x = dvt.Agent.isRightToLeft(diagram.getCtx()) ? container._contentDims.x + container._contentDims.w - iconEna['width'] : container._contentDims.x;
    var y = container._contentDims.y;
    containerButton.setTranslate(x, y);
  }
  container._containerButton = containerButton;
};

/**
 * @override
 */
DvtDiagramNode.prototype.isDragAvailable = function(clientIds) {
  return true;
};
/**
 * @override
 */
DvtDiagramNode.prototype.getDragTransferable = function(mouseX, mouseY) {
  if (this.getData()['draggable'] === 'off')
    return null;
  return [this.getId()];
};

/**
 * @override
 */
DvtDiagramNode.prototype.getDragFeedback = function(mouseX, mouseY) {
  if (this._diagram.getEventManager().LinkCreationStarted) {
    return null;
  }

  // If more than one object is selected, return the displayables of all selected objects
  if (this._diagram.isSelectionSupported() && this._diagram.getSelectionHandler().getSelectedCount() > 1) {
    var selection = this._diagram.getSelectionHandler().getSelection();
    var displayables = [];
    for (var i = 0; i < selection.length; i++) {
      displayables.push(selection[i]);
    }
    return displayables;
  }

  return this;
};

/**
 * Show drop effect on the node
 */
DvtDiagramNode.prototype.ShowDropEffect = function() {
  if (! this._dropEffect) {
    this._createDropEffect('oj-diagram-node oj-active-drop');
  }
};

/**
 * Show rejected drop effect on the node
 */
DvtDiagramNode.prototype.ShowRejectedDropEffect = function() {
  if (! this._dropEffect) {
    this._createDropEffect('oj-diagram-node oj-invalid-drop');
  }
};

/**
 * Clear drop effect from the node
 */
DvtDiagramNode.prototype.ClearDropEffect = function() {
  if (this._dropEffect) {
    this.removeChild(this._dropEffect);
    this._dropEffect = null;
  }
};

/**
 * Create drop effect for the node
 * @param {string} styleClass style class to be applied to the drop effect
 * @private
 */
DvtDiagramNode.prototype._createDropEffect = function(styleClass) {
  var dropEffectShape;
  // if this is a custom rendered node or disclosed node
  // or a leafnode with background or just an image
  // create a rectangle as a drop effect
  if (this._customNodeContent || this.isDisclosed() || this._background ||
      (this._shape && this._shape instanceof dvt.ImageMarker)) {
    dropEffectShape = new dvt.Rect(this._diagram.getCtx(), this._contentDims.x, this._contentDims.y,
        this._contentDims.w,
        this._contentDims.h);
    var borderRadius = this._customNodeContent ? null : this.isDisclosed() ? this._containerShape.getRx() :
        this._background ? this._background.getRx() : null;
    if (borderRadius) {
      dropEffectShape.setRx(borderRadius);
      dropEffectShape.setRy(borderRadius);
    }
  }
  //otherwise copy node shape
  else if (this._shape && this._shape instanceof dvt.SimpleMarker) {
    dropEffectShape = this._shape.copyShape();
  }
  dropEffectShape.setInvisibleFill();
  dropEffectShape.setClassName(styleClass);
  dropEffectShape.setMouseEnabled(false);
  this.addChild(dropEffectShape);
  this._dropEffect = dropEffectShape;
};

/**
 * Sets draggable style class to a draggable node
 * @private
 */
DvtDiagramNode.prototype._setDraggableStyleClass = function() {
  if (this._diagram.getEventManager().IsDragSupported() && this.getData()['draggable'] != 'off') {
    var draggableTopShape = this._customNodeContent ? this :
        this.isDisclosed() ? this._containerShape :
        this._background ? this._background : this._shape;
    var el = draggableTopShape.getElem() ? draggableTopShape.getElem() : draggableTopShape;
    dvt.ToolkitUtils.addClassName(el, 'oj-diagram-node');
    dvt.ToolkitUtils.addClassName(el, 'oj-draggable');
  }
};

/**
 * Helper function that converts node data from data source into internal format
 * @param {object} nodeData data object for the node from data source
 * @return {object} node data object in internal format
 * @protected
 */
DvtDiagramNode.ConvertNodeData = function(nodeData) {
  return {
    'id': nodeData['id'],
    'label': nodeData['label'],
    'selectable': nodeData['selectable'],
    'shortDesc': nodeData['shortDesc'],
    'categories': nodeData['categories'],
    'nodes': nodeData['nodes'],
    '_origData': nodeData
  };
};

/**
 *  Provides automation services for a DVT diagram component.
 *  @class  DvtDiagramAutomation
 *  @param {dvt.Diagram} dvtComponent
 *  @implements {dvt.Automation}
 *  @constructor
 */
var DvtDiagramAutomation = function(dvtComponent) {
  this.Init(dvtComponent);
};

dvt.Obj.createSubclass(DvtDiagramAutomation, dvt.Automation, 'DvtDiagramAutomation');

/**
 * Initializes this automation object
 * @param {dvt.Diagram} dvtComponent
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
 */
DvtDiagramAutomation.prototype.getDomElementForSubId = function(subId) {
  if (subId == dvt.Automation.TOOLTIP_SUBID)
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
 * Get the number of nodes in diagram
 * @return {Number} number of nodes
 */
DvtDiagramAutomation.prototype.getNodeCount = function() {
  return this._diagram.getNodeCount();
};

/**
 * Get the number of links in diagram
 * @return {Number} number of links
 */
DvtDiagramAutomation.prototype.getLinkCount = function() {
  return this._diagram.getLinkCount();
};

/**
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
    var backgroundStyle = node.getData()['backgroundStyle'];
    if (backgroundStyle && backgroundStyle instanceof Object)
      backgroundStyle = dvt.CSSStyle.cssObjectToString(backgroundStyle);
    data['background'] = backgroundStyle;
    data['icon'] = this._getMarkerData(node.GetIcon());
    data['expanded'] = node.isDisclosed();
    return data;
  }
  return null;
};

/**
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
    data['style'] = this._getLinkStyleFromObject(link.getLinkStyle());
    data['startNode'] = link.getStartId();
    data['endNode'] = link.getEndId();
    data['startConnectorType'] = link.getStartConnectorType();
    data['endConnectorType'] = link.getEndConnectorType();
    return data;
  }
  return null;
};

/**
 * Gets diagram promoted link data object for the given nodes
 * @param {Number} startIndex  start node index
 * @param {Number} endIndex  end node index
 * @return {Object} link data object
 */
DvtDiagramAutomation.prototype.getPromotedLink = function(startIndex, endIndex) {
  var startNode = this._getNode(startIndex);
  var endNode = this._getNode(endIndex);
  if (!startNode || !endNode)
    return null;
  var linkId = DvtDiagramLink.GetPromotedLinkId(startNode.getId(), endNode.getId());
  var link = this._diagram.getLinkById(linkId);
  if (link) {
    var data = {};
    data['id'] = link.getId();
    data['selected'] = link.isSelected();
    data['tooltip'] = link.getShortDesc();
    data['color'] = link.getLinkColor();
    data['width'] = link.getLinkWidth();
    data['style'] = this._getLinkStyleFromObject(link.getLinkStyle());
    data['startNode'] = link.getStartId();
    data['endNode'] = link.getEndId();
    data['startConnectorType'] = link.getStartConnectorType();
    data['endConnectorType'] = link.getEndConnectorType();
    data['count'] = link.getData()['_links'].length;
    return data;
  }
  return null;
};

/**
 * Get link style type from style object
 * @param {object} linkStyle  link style object
 * @return {string} link style
 * @private
 */
DvtDiagramAutomation.prototype._getLinkStyleFromObject = function(linkStyle) {
  if (linkStyle && linkStyle instanceof Object) {
    //For custom link style, convert the object to string
    if (linkStyle['_type'] == DvtDiagramLink.CUSTOM_STYLE) {
      var styleObj = dvt.JsonUtils.clone(linkStyle);
      delete styleObj['_type'];
      return dvt.CSSStyle.cssObjectToString(styleObj);
    } else {
      return linkStyle['_type'];
    }
  }
  return linkStyle;
};

/**
 * Get array of expanded nodes
 * @return {Array} expanded nodes
 */
DvtDiagramAutomation.prototype.getExpanded = function() {
  return this._diagram.DisclosedNodes;
};

/**
 * @private
 * Get marker data from marker
 * @param {dvt.SimpleMarker|dvt.ImageMarker} marker Displayable marker object
 * @return {Object} Marker data object
 */
DvtDiagramAutomation.prototype._getMarkerData = function(marker) {
  if (marker) {
    var data = {};
    // public api expects image markers to return a shape of 'none'
    data['shape'] = (marker instanceof dvt.SimpleMarker ? marker.getType() : 'none');
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

dvt.exportProperty(dvt, 'Diagram', dvt.Diagram);
dvt.exportProperty(dvt.Diagram, 'newInstance', dvt.Diagram.newInstance);
dvt.exportProperty(dvt.Diagram.prototype, 'highlight', dvt.Diagram.prototype.highlight);
dvt.exportProperty(dvt.Diagram.prototype, 'select', dvt.Diagram.prototype.select);
dvt.exportProperty(dvt.Diagram.prototype, 'getAutomation', dvt.Diagram.prototype.getAutomation);
dvt.exportProperty(dvt.Diagram.prototype, 'processDefaultHoverEffect', dvt.Diagram.prototype.processDefaultHoverEffect);
dvt.exportProperty(dvt.Diagram.prototype, 'processDefaultSelectionEffect', dvt.Diagram.prototype.processDefaultSelectionEffect);
dvt.exportProperty(dvt.Diagram.prototype, 'processDefaultFocusEffect', dvt.Diagram.prototype.processDefaultFocusEffect);
dvt.exportProperty(dvt.Diagram.prototype, 'clearDisclosedState', dvt.Diagram.prototype.clearDisclosedState);
dvt.exportProperty(dvt.Diagram.prototype, 'expand', dvt.Diagram.prototype.expand);
dvt.exportProperty(dvt.Diagram.prototype, 'collapse', dvt.Diagram.prototype.collapse);

dvt.exportProperty(DvtDiagramAutomation.prototype, 'getDomElementForSubId', DvtDiagramAutomation.prototype.getDomElementForSubId);
dvt.exportProperty(DvtDiagramAutomation.prototype, 'getNodeCount', DvtDiagramAutomation.prototype.getNodeCount);
dvt.exportProperty(DvtDiagramAutomation.prototype, 'getLinkCount', DvtDiagramAutomation.prototype.getLinkCount);
dvt.exportProperty(DvtDiagramAutomation.prototype, 'getNode', DvtDiagramAutomation.prototype.getNode);
dvt.exportProperty(DvtDiagramAutomation.prototype, 'getLink', DvtDiagramAutomation.prototype.getLink);
dvt.exportProperty(DvtDiagramAutomation.prototype, 'getPromotedLink', DvtDiagramAutomation.prototype.getPromotedLink);
dvt.exportProperty(DvtDiagramAutomation.prototype, 'getExpanded', DvtDiagramAutomation.prototype.getExpanded);
})(dvt);

  return dvt;
});
