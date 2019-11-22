/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['jquery','./DvtToolkit', './DvtPanZoomCanvas','./DvtOverview'], function($, dvt) {
  "use strict";
  // Internal use only.  All APIs and functionality are subject to change at any time.

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
(function (dvt) {
  /**
   * @license
   * Copyright (c) 2008 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @protected
   * Defines the context for a layout call.
   * @class DvtDiagramLayoutContext
   * @param {dvt.Context} context The rendering context.
   * @constructor
   * initializing this context
   */
  var DvtDiagramLayoutContext = function DvtDiagramLayoutContext(context) {
    this.Init(context);
  };

  dvt.Obj.createSubclass(DvtDiagramLayoutContext, dvt.Obj, 'DvtDiagramLayoutContext');
  /**
   * @protected
   * Initialize the layout context.
   */

  DvtDiagramLayoutContext.prototype.Init = function (context) {
    this._nodeCount = 0;
    this._linkCount = 0;
    this._bLocaleR2L = false;
    this._nodes = new context.ojMap();
    this._links = new context.ojMap();
    this._arNodes = [];
    this._arLinks = [];
    this._dirtyContext = new context.ojMap();
    this.Context = context;
  };
  /**
   * @protected
   * Set the name of the layout.
   * @param {string} layout the name of the layout
   */


  DvtDiagramLayoutContext.prototype.setLayout = function (layout) {
    this._layout = layout;
  };
  /**
   * Get the name of the layout.
   * @return {string}
   */


  DvtDiagramLayoutContext.prototype.getLayout = function () {
    return this._layout;
  };
  /**
   * @protected
   * Set the map of global layout attributes.
   * @param {object} layoutAttrs map of global layout attributes
   */


  DvtDiagramLayoutContext.prototype.setLayoutAttributes = function (layoutAttrs) {
    this._layoutAttrs = layoutAttrs;
  };
  /**
   * Get the map of global layout attributes.
   * @return {object}
   */


  DvtDiagramLayoutContext.prototype.getLayoutAttributes = function () {
    return this._layoutAttrs;
  };
  /**
   * @protected
   * Add a node context for this layout.
   * @param {DvtDiagramLayoutContextNode} node node context to include in this layout
   */


  DvtDiagramLayoutContext.prototype.addNode = function (node) {
    if (!this.getNodeById(node.getId())) {
      this._nodeCount++;

      this._arNodes.push(node);
    }

    this._nodes.set(node.getId(), node);
  };
  /**
   * @protected
   * Add a node context to the lookup map. The map contains nodes being laid out and it might also contain
   * read-only nodes provided to support cross-container links in case of "container" layout.
   * @param {DvtDiagramLayoutContextNode} node node context to provide extra information for this layout
   */


  DvtDiagramLayoutContext.prototype.addNodeToMap = function (node) {
    this._nodes.set(node.getId(), node);
  };
  /**
   * @protected
   * Remove a node context from this layout.
   * @param {DvtDiagramLayoutContextNode} parent context for the parent node
   * @param {DvtDiagramLayoutContextNode} node node context to remove from this layout
   */


  DvtDiagramLayoutContext.prototype.removeNode = function (parent, node) {
    if (!node) return;

    if (parent) {
      dvt.ArrayUtils.removeItem(parent.getChildNodes(), node);
    } else {
      dvt.ArrayUtils.removeItem(this._arNodes, node);
      this._nodeCount--;
    }

    this._nodes.delete(node.getId());
  };
  /**
   * Get a node context by id.  Nodes being laid out and read-only nodes provided
   * as additional information to this layout can be retrieved through this
   * function.
   * @param {any} id id of node context to get
   * @return {DvtDiagramLayoutContextNode}
   */


  DvtDiagramLayoutContext.prototype.getNodeById = function (id) {
    return this._nodes.get(id);
  };
  /**
   * Get a node context by index.  Only nodes being laid out can be retrieved
   * through this function.
   * @param {number} index index of node context to get
   * @return {DvtDiagramLayoutContextNode}
   */


  DvtDiagramLayoutContext.prototype.getNodeByIndex = function (index) {
    return this._arNodes[index];
  };
  /**
   * Get the number of nodes to layout.  This number does not include any
   * read-only nodes provided as additional information to this layout.
   * @return {number}
   */


  DvtDiagramLayoutContext.prototype.getNodeCount = function () {
    return this._nodeCount;
  };
  /**
   * Add a link context for this layout.
   * @param {DvtDiagramLayoutContextLink} link link context to include in this layout
   */


  DvtDiagramLayoutContext.prototype.addLink = function (link) {
    if (!this.getLinkById(link.getId())) {
      this._linkCount++;

      this._arLinks.push(link);
    }

    this._links.set(link.getId(), link);
  };
  /**
   * Remove a link context from this layout.
   * @param {DvtDiagramLayoutContextLink} link link context to remove
   * @protected
   */


  DvtDiagramLayoutContext.prototype.removeLink = function (link) {
    if (!link) return;

    if (this.getLinkById(link.getId())) {
      dvt.ArrayUtils.removeItem(this._arLinks, link);
      this._linkCount--;
    }

    this._links.delete(link.getId());
  };
  /**
   * Get a link context by id.
   * @param {any} id id of link context to get
   * @return {DvtDiagramLayoutContextLink} link
   */


  DvtDiagramLayoutContext.prototype.getLinkById = function (id) {
    return this._links.get(id);
  };
  /**
   * Get a link context by index.
   * @param {number} index index of link context to get
   * @return {DvtDiagramLayoutContextLink}
   */


  DvtDiagramLayoutContext.prototype.getLinkByIndex = function (index) {
    return this._arLinks[index];
  };
  /**
   * Get the number of links to layout.
   * @return {number}
   */


  DvtDiagramLayoutContext.prototype.getLinkCount = function () {
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


  DvtDiagramLayoutContext.prototype.localToGlobal = function (point, node) {
    var offset = this.GetGlobalOffset(node);
    return new dvt.DiagramPoint(point['x'] + offset['x'], point['y'] + offset['y']);
  };
  /**
   * @protected
   * Get the position of the given node in the global coordinate system.
   * @param {DvtDiagramLayoutContextNode} node node to get global position for
   * @return {DvtDiagramPoint}
   */


  DvtDiagramLayoutContext.prototype.GetGlobalOffset = function (node) {
    var offset = new dvt.DiagramPoint(0, 0);

    while (node) {
      offset['x'] += node.ContentOffset['x'] + node.getPosition()['x'];
      offset['y'] += node.ContentOffset['y'] + node.getPosition()['y'];
      var containerId = node.getContainerId();

      if (containerId) {
        node = this.getNodeById(containerId); //if there is a container node parent, then add that
        //containerPadding to the offset

        if (node && node.isDisclosed()) {
          var containerPadding = node.getContainerPadding();

          if (containerPadding) {
            offset['x'] += containerPadding['left'];
            offset['y'] += containerPadding['top'];
          }
        }
      } else {
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


  DvtDiagramLayoutContext.prototype.setLocaleR2L = function (bR2L) {
    this._bLocaleR2L = bR2L;
  };
  /**
   * Get whether the reading direction for the locale is right-to-left.
   * @return {boolean}
   */


  DvtDiagramLayoutContext.prototype.isLocaleR2L = function () {
    return this._bLocaleR2L;
  };
  /**
   * @protected
   * Set the size of the Diagram.
   * @param {DvtDiagramRectangle} compSize size of Diagram
   */


  DvtDiagramLayoutContext.prototype.setComponentSize = function (compSize) {
    this._componentSize = compSize;
  };
  /**
   * Get the size of the Diagram.
   * @return {DvtDiagramRectangle}
   */


  DvtDiagramLayoutContext.prototype.getComponentSize = function () {
    return this._componentSize;
  };
  /**
   * Set the viewport the component should use after the layout, in the layout's
   * coordinate system.
   * @param {DvtDiagramRectangle} viewport viewport the component should use
   * after the layout
   */


  DvtDiagramLayoutContext.prototype.setViewport = function (viewport) {
    this._viewport = viewport;
  };
  /**
   * Get the viewport the component should use after the layout, in the layout's
   * coordinate system.
   * @return {DvtDiagramRectangle}
   */


  DvtDiagramLayoutContext.prototype.getViewport = function () {
    return this._viewport;
  };
  /**
   * @protected
   * Set the id of the container whose nodes are being laid out.
   * @param {any} containerId id of the container whose nodes are being laid
   * out
   */


  DvtDiagramLayoutContext.prototype.setContainerId = function (containerId) {
    this._containerId = containerId;
  };
  /**
   * Get the id of the container whose nodes are being laid out, or null if this
   * is the top level Diagram layout.
   * @return {any}
   */


  DvtDiagramLayoutContext.prototype.getContainerId = function () {
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


  DvtDiagramLayoutContext.prototype.setContainerPadding = function (top, right, bottom, left) {
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


  DvtDiagramLayoutContext.prototype.getContainerPadding = function () {
    return this._containerPadding;
  };
  /**
   * Set the current viewport used by the component in the layout's coordinate system.
   * @param {DvtDiagramRectangle} viewport The viewport currently used by the component
   */


  DvtDiagramLayoutContext.prototype.setCurrentViewport = function (viewport) {
    this._currentViewport = viewport;
  };
  /**
   * Get the current viewport used by the component in the layout's coordinate system for the top level diagram
   * @return {DvtDiagramRectangle} current viewport
   */


  DvtDiagramLayoutContext.prototype.getCurrentViewport = function () {
    return this._currentViewport;
  };
  /**
   * The function retrieves nearest common ancestor container for two nodes.
   * @param {any} nodeId1 first node id
   * @param {any} nodeId2 second node id
   * @return {any}  id for the first common ancestor container or null for top level diagram
   */


  DvtDiagramLayoutContext.prototype.getCommonContainer = function (nodeId1, nodeId2) {
    var getAllAncestorIds = function getAllAncestorIds(id, context) {
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
      if (!dvt.BaseDiagram.compareValues(this.Context, startPath[i], endPath[i])) break;
      commonId = startPath[i];
    }

    return commonId;
  };
  /**
   * Gets event data object. Values can be retrieved from the object using 'type' and 'data' keys.
   * @return {object} event data object
   */


  DvtDiagramLayoutContext.prototype.getEventData = function () {
    return this._eventData;
  };
  /**
   * @protected
   * Sets event data object
   * @param {object} eventData event data object
   */


  DvtDiagramLayoutContext.prototype.setEventData = function (eventData) {
    this._eventData = eventData;
  };
  /**
   * @protected
   * Sets dirty context for the layout
   * @param {object} dirtyContext a map that contains dirty context for the layout
   */


  DvtDiagramLayoutContext.prototype.setDirtyContext = function (dirtyContext) {
    this._dirtyContext = dirtyContext;
  };
  /**
   * @protected
   * Gets dirty context for the layout
   * @return {object} a map that contains dirty context for the layout
   */


  DvtDiagramLayoutContext.prototype.getDirtyContext = function () {
    return this._dirtyContext;
  };
  /**
   * @license
   * Copyright (c) 2008 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @protected
   * Defines the link context for a layout call.
   * @class DvtDiagramLayoutContextLink
   * @constructor
   */


  var DvtDiagramLayoutContextLink = function DvtDiagramLayoutContextLink() {
    this.Init();
  };

  dvt.Obj.createSubclass(DvtDiagramLayoutContextLink, dvt.Obj, 'DvtDiagramLayoutContextLink');
  /**
   * @protected
   * Initialize the layout context.
   */

  DvtDiagramLayoutContextLink.prototype.Init = function () {
    this._startConnectorOffset = 0;
    this._endConnectorOffset = 0;
    this._linkWidth = 1;
    this._selected = false;
    this._bPromoted = false;
  };
  /**
   * @protected
   * Set the id of the link.
   * @param {any} id id of the link
   */


  DvtDiagramLayoutContextLink.prototype.setId = function (id) {
    this._id = id;
  };
  /**
   * Get the id of the link.
   * @return {any}
   */


  DvtDiagramLayoutContextLink.prototype.getId = function () {
    return this._id;
  };
  /**
   * @protected
   * Set the id of the start node of this link.
   * @param {any} id id of the start node
   */


  DvtDiagramLayoutContextLink.prototype.setStartId = function (id) {
    this._startId = id;
  };
  /**
   * Get the id of the start node of this link.
   * @return {any}
   */


  DvtDiagramLayoutContextLink.prototype.getStartId = function () {
    return this._startId;
  };
  /**
   * @protected
   * Set the id of the end node of this link.
   * @param {any} id id of the end node
   */


  DvtDiagramLayoutContextLink.prototype.setEndId = function (id) {
    this._endId = id;
  };
  /**
   * Get the id of the end node of this link.
   * @return {any}
   */


  DvtDiagramLayoutContextLink.prototype.getEndId = function () {
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


  DvtDiagramLayoutContextLink.prototype.setPoints = function (points) {
    if (typeof points == 'string') this._points = dvt.PathUtils.createPathArray(points);else this._points = points;
    this.setDirty();
  };
  /**
   * Get the points to use for rendering this link.  The returned array can
   * contain coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path
   * commands, like ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].  The points
   * are in the coordinate system of the link's container.
   * @return {array}
   */


  DvtDiagramLayoutContextLink.prototype.getPoints = function () {
    return this._points;
  };
  /**
   * Set the position of the link label.  The position is in the coordinate
   * system of the link's container.
   * @param {DvtDiagramPoint} pos position of the link label
   */


  DvtDiagramLayoutContextLink.prototype.setLabelPosition = function (pos) {
    this._labelPosition = pos;
    this.setDirty();
  };
  /**
   * Get the position of the link label.  The position is in the coordinate
   * system of the link's container.
   * @return {DvtDiagramPoint} position of the link label
   */


  DvtDiagramLayoutContextLink.prototype.getLabelPosition = function () {
    return this._labelPosition;
  };
  /**
   * @protected
   * Set the label bounds.  The bounds are in the coordinate system of the label.
   * @param {DvtDiagramRectangle} bounds label bounds
   */


  DvtDiagramLayoutContextLink.prototype.setLabelBounds = function (bounds) {
    this._labelBounds = bounds;
  };
  /**
   * Get the label bounds.  The bounds are in the coordinate system of the label.
   * @return {DvtDiagramRectangle}
   */


  DvtDiagramLayoutContextLink.prototype.getLabelBounds = function () {
    return this._labelBounds;
  };
  /**
   * @protected
   * Set the offset of the start connector.  This is the amount of space that the
   * link should leave between its starting point and the node for the connector
   * to be drawn.
   * @param {number} offset offset of the start connector
   */


  DvtDiagramLayoutContextLink.prototype.setStartConnectorOffset = function (offset) {
    this._startConnectorOffset = offset;
  };
  /**
   * Get the offset of the start connector.  This is the amount of space that the
   * link should leave between its starting point and the node for the connector
   * to be drawn.
   * @return {number}
   */


  DvtDiagramLayoutContextLink.prototype.getStartConnectorOffset = function () {
    return this._startConnectorOffset;
  };
  /**
   * @protected
   * Set the offset of the end connector.  This is the amount of space that the
   * link should leave between its ending point and the node for the connector
   * to be drawn.
   * @param {number} offset offset of the end connector
   */


  DvtDiagramLayoutContextLink.prototype.setEndConnectorOffset = function (offset) {
    this._endConnectorOffset = offset;
  };
  /**
   * Get the offset of the end connector.  This is the amount of space that the
   * link should leave between its ending point and the node for the connector
   * to be drawn.
   * @return {number}
   */


  DvtDiagramLayoutContextLink.prototype.getEndConnectorOffset = function () {
    return this._endConnectorOffset;
  };
  /**
   * @protected
   * Set the width of this link.
   * @param {number} ww width of the link
   */


  DvtDiagramLayoutContextLink.prototype.setLinkWidth = function (ww) {
    this._linkWidth = ww;
  };
  /**
   * Get the width of this link.
   * @return {number}
   */


  DvtDiagramLayoutContextLink.prototype.getLinkWidth = function () {
    return this._linkWidth;
  };
  /**
   * @protected
   * Set the map of link layout attributes.
   * @param {object} layoutAttrs map of link layout attributes
   */


  DvtDiagramLayoutContextLink.prototype.setLayoutAttributes = function (layoutAttrs) {
    this._layoutAttrs = layoutAttrs;
  };
  /**
   * Get the map of link layout attributes.
   * @return {object}
   */


  DvtDiagramLayoutContextLink.prototype.getLayoutAttributes = function () {
    return this._layoutAttrs;
  };
  /**
   * @protected
   * Set whether this link is selected.
   * @param {boolean} selected true if selected, false otherwise
   */


  DvtDiagramLayoutContextLink.prototype.setSelected = function (selected) {
    this._selected = selected;
  };
  /**
   * Determine whether this link is selected.
   * @return {boolean}
   */


  DvtDiagramLayoutContextLink.prototype.getSelected = function () {
    return this._selected;
  };
  /**
   * Set the angle of rotation of the link label, relative to the label
   * rotation point, in radians.
   * @param {number} angle angle of rotation
   */


  DvtDiagramLayoutContextLink.prototype.setLabelRotationAngle = function (angle) {
    this._labelRotAngle = angle;
    this.setDirty();
  };
  /**
   * Get the angle of rotation of the link label, relative to the label
   * rotation point, in radians.
   * @return {number}
   */


  DvtDiagramLayoutContextLink.prototype.getLabelRotationAngle = function () {
    return this._labelRotAngle;
  };
  /**
   * Set the point about which to rotate the link label, in the coordinate
   * system of the label.
   * @param {DvtDiagramPoint} point label rotation point
   */


  DvtDiagramLayoutContextLink.prototype.setLabelRotationPoint = function (point) {
    this._labelRotPoint = point;
    this.setDirty();
  };
  /**
   * Get the point about which to rotate the link label, in the coordinate
   * system of the label.
   * @return {DvtDiagramPoint}
   */


  DvtDiagramLayoutContextLink.prototype.getLabelRotationPoint = function () {
    return this._labelRotPoint;
  };
  /**
   * @protected
   * Set whether this link is promoted.
   * @param {boolean} bPromoted true if promoted, false otherwise
   */


  DvtDiagramLayoutContextLink.prototype.setPromoted = function (bPromoted) {
    this._bPromoted = bPromoted;
  };
  /**
   * Determine whether this link is promoted.
   * @return {boolean}
   */


  DvtDiagramLayoutContextLink.prototype.isPromoted = function () {
    return this._bPromoted;
  };
  /**
   * Sets the label valign
   * default is top
   * Only intended for JET Diagram
   * @param {string} valign values can include top, middle, bottom, and baseline
   */


  DvtDiagramLayoutContextLink.prototype.setLabelValign = function (valign) {
    this._labelValign = valign;
    this.setDirty();
  };
  /**
   * Sets the label halign
   * default depends on locale, left for LTR and right for RTL
   * Only intended for JET Diagram
   * @param {string} halign values can include left, right, and center
   */


  DvtDiagramLayoutContextLink.prototype.setLabelHalign = function (halign) {
    this._labelHalign = halign;
    this.setDirty();
  };
  /**
   * Gets the label valign
   * default is top
   * Only intended for JET Diagram
   * @return {string} values can include top, middle, bottom, and baseline
   */


  DvtDiagramLayoutContextLink.prototype.getLabelValign = function () {
    return this._labelValign;
  };
  /**
   * Gets the label halign
   * default depends on locale, left for LTR and right for RTL
   * Only intended for JET Diagram
   * @return {string} values can include left, right, and center
   */


  DvtDiagramLayoutContextLink.prototype.getLabelHalign = function () {
    return this._labelHalign;
  };
  /**
   * Set coordinate space for the link.
   * If the coordinate container id is specified, the link points will be applied relative to that container.
   * If the coordinate container id is not specified, the link points are in the global coordinate space.
   * @param {any} id coordinate container id for the link
   */


  DvtDiagramLayoutContextLink.prototype.setCoordinateSpace = function (id) {
    this._coordinateContainerId = id;
    this.setDirty();
  };
  /**
   * Get coordinate space for the link.
   * If the coordinate container id is specified, the link points will be applied relative to that container.
   * If the coordinate container id is not specified, the link points are in the global coordinate space.
   * @return {any} coordinate container id for the link
   */


  DvtDiagramLayoutContextLink.prototype.getCoordinateSpace = function () {
    return this._coordinateContainerId;
  };
  /**
   * @protected
   * Set data for the link
   * @param {object|array} data a data object if the link is not promoted
   *                      an array of data objects for the links corresponding to the promoted link
   */


  DvtDiagramLayoutContextLink.prototype.setData = function (data) {
    this._data = data;
  };
  /**
   * Gets data for the link. If the link is not promoted, the methods retrieves a data object for the link.
   * If the link is promoted, the methods retrieves an array of data objects for the links that are represented by
   * the promoted link.
   * @return {object|array} returns relevant data for the link
   */


  DvtDiagramLayoutContextLink.prototype.getData = function () {
    return this._data;
  };
  /**
   * @protected
   * Mark layout context for the link as dirty once the its position or label position changed
   */


  DvtDiagramLayoutContextLink.prototype.setDirty = function () {
    if (this.LayoutContext) {
      this.LayoutContext.getDirtyContext().set(this.getId(), true);
    }
  };
  /**
   * @protected
   * Copies layout context state for the link from existing link layout context
   * @param {DvtDiagramLayoutContextLink} link existing link layout context
   */


  DvtDiagramLayoutContextLink.prototype.copyFrom = function (link) {
    if (link) {
      this.setPoints(link.getPoints());
      this.setLabelPosition(link.getLabelPosition());
      this.setLabelRotationAngle(link.getLabelRotationAngle());
      this.setLabelRotationPoint(link.getLabelRotationPoint());
      this.setLabelValign(link.getLabelValign());
      this.setLabelHalign(link.getLabelHalign());
      this.setCoordinateSpace(link.getCoordinateSpace());
    }
  };
  /**
   * @license
   * Copyright (c) 2008 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @protected
   * Defines the node context for a layout call.
   * @class DvtDiagramLayoutContextNode
   * @constructor
   */


  var DvtDiagramLayoutContextNode = function DvtDiagramLayoutContextNode() {
    this.Init();
  };

  dvt.Obj.createSubclass(DvtDiagramLayoutContextNode, dvt.Obj, 'DvtDiagramLayoutContextNode');
  /**
   * @protected
   * Initialize the layout context.
   */

  DvtDiagramLayoutContextNode.prototype.Init = function () {
    this._bReadOnly = false;
    this._selected = false;
    this._bDisclosed = false;
    this.IsRendered = true; //used by global layout for nodes inside container

    this.ContentOffset = new dvt.DiagramPoint(0, 0);
  };
  /**
   * @protected
   * Set the id of the node.
   * @param {any} id id of the node
   */


  DvtDiagramLayoutContextNode.prototype.setId = function (id) {
    this._id = id;
  };
  /**
   * Get the id of the node.
   * @return {any}
   */


  DvtDiagramLayoutContextNode.prototype.getId = function () {
    return this._id;
  };
  /**
   * @protected
   * Set the bounds of the node.  The bounds include any overlays.
   * The bounds are in the coordinate system of the node.
   * @param {DvtDiagramRectangle} bounds bounds of the node
   */


  DvtDiagramLayoutContextNode.prototype.setBounds = function (bounds) {
    this._bounds = bounds; //save the original bounds, in case there is container padding

    this._origBounds = bounds;
  };
  /**
   * Get the bounds of the node.  The bounds include any overlays.
   * The bounds are in the coordinate system of the node.
   * @return {DvtDiagramRectangle}
   */


  DvtDiagramLayoutContextNode.prototype.getBounds = function () {
    if (!this._bounds && this.Component) {
      this.Component.updateNodeDims(this);
    }

    return this._bounds;
  };
  /**
   * @protected
   * Set the bounds of the node content.  The bounds do not include any overlays.
   * The bounds are in the coordinate system of the node.
   * @param {DvtDiagramRectangle} bounds content bounds of the node
   */


  DvtDiagramLayoutContextNode.prototype.setContentBounds = function (bounds) {
    this._contentBounds = bounds; //save the original bounds, in case there is container padding

    this._origContentBounds = bounds;
  };
  /**
   * Get the bounds of the node content.  The bounds do not include any overlays.
   * The bounds are in the coordinate system of the node.
   * @return {DvtDiagramRectangle}
   */


  DvtDiagramLayoutContextNode.prototype.getContentBounds = function () {
    if (!this._contentBounds && this.Component) {
      this.Component.updateNodeDims(this);
    }

    return this._contentBounds;
  };
  /**
   * Set the position of the node.  The position is in the coordinate system of
   * the node's container.
   * @param {DvtDiagramPoint} pos position of the node
   */


  DvtDiagramLayoutContextNode.prototype.setPosition = function (pos) {
    this._position = pos;
    this.UpdateParentNodes();
    this.setDirty();
  };
  /**
   * Get the position of the node.
   * @return {DvtDiagramPoint}
   */


  DvtDiagramLayoutContextNode.prototype.getPosition = function () {
    return this._position;
  };
  /**
   * The method returns a relative position of the node to the specified ancestor container.
   * If the container id is null, the method returns global position of the node.
   * If the container id is not an ancestor id for the node, the method returns null.
   * @param {any} containerId ancestor id
   * @return {DvtDiagramPoint}
   */


  DvtDiagramLayoutContextNode.prototype.getRelativePosition = function (containerId) {
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
          if (parent && this.Component && !parent.IsRendered) this.Component.renderNodeFromContext(parent, true);
        } //calculate relative position


        position['x'] += node.ContentOffset['x'] + node.getPosition()['x'];
        position['y'] += node.ContentOffset['y'] + node.getPosition()['y'];

        if (!dvt.BaseDiagram.compareValues(layoutContext.Context, parentId, containerId)) {
          node = layoutContext.getNodeById(parentId);

          if (node && node.isDisclosed()) {
            var containerPadding = node.getContainerPadding();

            if (containerPadding) {
              position['x'] += containerPadding['left'];
              position['y'] += containerPadding['top'];
            }
          } else {
            node = null;
          }
        } else {
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


  DvtDiagramLayoutContextNode.prototype.setLabelPosition = function (pos) {
    this._labelPosition = pos;
    this.setDirty();
  };
  /**
   * Get the position of the node label.  The position is in the coordinate
   * system of the node's container.
   * @return {DvtDiagramPoint}
   */


  DvtDiagramLayoutContextNode.prototype.getLabelPosition = function () {
    return this._labelPosition;
  };
  /**
   * @protected
   * Set the label bounds.  The bounds are in the coordinate system of the label.
   * @param {DvtDiagramRectangle} bounds label bounds
   */


  DvtDiagramLayoutContextNode.prototype.setLabelBounds = function (bounds) {
    this._labelBounds = bounds;
  };
  /**
   * Get the label bounds.  The bounds are in the coordinate system of the label.
   * @return {DvtDiagramRectangle}
   */


  DvtDiagramLayoutContextNode.prototype.getLabelBounds = function () {
    if (!this._labelBounds && this.Component) {
      this.Component.updateNodeDims(this);
    }

    return this._labelBounds;
  };
  /**
   * @protected
   * Set the map of node layout attributes.
   * @param {object} layoutAttrs map of node layout attributes
   */


  DvtDiagramLayoutContextNode.prototype.setLayoutAttributes = function (layoutAttrs) {
    this._layoutAttrs = layoutAttrs;
  };
  /**
   * Get the map of node layout attributes.
   * @return {object}
   */


  DvtDiagramLayoutContextNode.prototype.getLayoutAttributes = function () {
    return this._layoutAttrs;
  };
  /**
   * @protected
   * Set whether the node is read-only.  A read-only node cannot be positioned
   * by this layout call, and is only provided as additional information that may
   * be used when laying out other nodes.
   * @param {boolean} bReadOnly true if this node is read-only, false otherwise
   */


  DvtDiagramLayoutContextNode.prototype.setReadOnly = function (bReadOnly) {
    this._bReadOnly = bReadOnly;
  };
  /**
   * Determine whether this node is read-only.  A read-only node cannot be
   * positioned by this layout call, and is only provided as additional
   * information that may be used when laying out other nodes.
   * @return {boolean}
   */


  DvtDiagramLayoutContextNode.prototype.isReadOnly = function () {
    return this._bReadOnly;
  };
  /**
   * @protected
   * Set the id of this node's container.
   * @param {any} id id of this node's container
   */


  DvtDiagramLayoutContextNode.prototype.setContainerId = function (id) {
    this._containerId = id;
  };
  /**
   * Get the id of this node's container, or null if this is the top-level
   * Diagram layout.
   * @return {any}
   */


  DvtDiagramLayoutContextNode.prototype.getContainerId = function () {
    return this._containerId;
  };
  /**
   * @protected
   * Set whether this node is selected.
   * @param {boolean} selected true if selected, false otherwise
   */


  DvtDiagramLayoutContextNode.prototype.setSelected = function (selected) {
    this._selected = selected;
  };
  /**
   * Determine whether this node is selected.
   * @return {boolean}
   */


  DvtDiagramLayoutContextNode.prototype.getSelected = function () {
    return this._selected;
  };
  /**
   * Set the angle of rotation of the node label, relative to the label
   * rotation point, in radians.
   * @param {number} angle angle of rotation
   */


  DvtDiagramLayoutContextNode.prototype.setLabelRotationAngle = function (angle) {
    this._labelRotAngle = angle;
    this.setDirty();
  };
  /**
   * Get the angle of rotation of the node label, relative to the label
   * rotation point, in radians.
   * @return {number}
   */


  DvtDiagramLayoutContextNode.prototype.getLabelRotationAngle = function () {
    return this._labelRotAngle;
  };
  /**
   * Set the point about which to rotate the node label, in the coordinate
   * system of the label.
   * @param {DvtDiagramPoint} point label rotation point
   */


  DvtDiagramLayoutContextNode.prototype.setLabelRotationPoint = function (point) {
    this._labelRotPoint = point;
    this.setDirty();
  };
  /**
   * Get the point about which to rotate the node label, in the coordinate
   * system of the label.
   * @return {DvtDiagramPoint}
   */


  DvtDiagramLayoutContextNode.prototype.getLabelRotationPoint = function () {
    return this._labelRotPoint;
  };
  /**
   * @protected
   * Set the padding of this container.
   * @param {object} obj map defining values for keys 'top', 'left', 'bottom',
   * and 'right'
   */


  DvtDiagramLayoutContextNode.prototype.SetContainerPaddingObj = function (obj) {
    //if this node isn't disclosed, don't save any container padding
    if (this.isDisclosed()) {
      this._containerPadding = obj; //this function is called by the dvt.Diagram when initializing the
      //layout context, so the original bounds already include the container
      //padding, and we need to subtract it out here

      if (obj) {
        if (this._origBounds) {
          this._origBounds = new dvt.DiagramRectangle(this._origBounds['x'], this._origBounds['y'], this._origBounds['w'] - (obj['left'] + obj['right']), this._origBounds['h'] - (obj['top'] + obj['bottom']));
        }

        if (this._origContentBounds) {
          this._origContentBounds = new dvt.DiagramRectangle(this._origContentBounds['x'], this._origContentBounds['y'], this._origContentBounds['w'] - (obj['left'] + obj['right']), this._origContentBounds['h'] - (obj['top'] + obj['bottom']));
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


  DvtDiagramLayoutContextNode.prototype.setContainerPadding = function (top, right, bottom, left) {
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
      this._containerPadding['left'] = left; //this function is called by the layout engine to set the container padding,
      //so we need to update the current bounds based on the original bounds
      //plus the new container padding

      if (this._origBounds) {
        this._bounds = new dvt.DiagramRectangle(this._origBounds['x'], this._origBounds['y'], this._origBounds['w'] + left + right, this._origBounds['h'] + top + bottom);
      }

      if (this._origContentBounds) {
        this._contentBounds = new dvt.DiagramRectangle(this._origContentBounds['x'], this._origContentBounds['y'], this._origContentBounds['w'] + left + right, this._origContentBounds['h'] + top + bottom);
      }

      this.setDirty();
    }
  };
  /**
   * Get the padding of this container.  Values can be retrieved from the
   * returned map using keys 'top', 'left', 'bottom', and 'right'.
   * @return {object}
   */


  DvtDiagramLayoutContextNode.prototype.getContainerPadding = function () {
    return this._containerPadding;
  };
  /**
   * @protected
   * Set whether this container is disclosed.
   * @param {boolean} bDisclosed true if this container is disclosed, false
   * otherwise
   */


  DvtDiagramLayoutContextNode.prototype.setDisclosed = function (bDisclosed) {
    this._bDisclosed = bDisclosed;
  };
  /**
   * Determine whether this container is disclosed.
   * @return {boolean}
   */


  DvtDiagramLayoutContextNode.prototype.isDisclosed = function () {
    return this._bDisclosed;
  };
  /**
   * @protected
   * Set child nodes for the container. Child nodes are populated for global layout only.
   * @param {array} childNodes array of DvtDiagramLayoutContextNode objects
   */


  DvtDiagramLayoutContextNode.prototype.setChildNodes = function (childNodes) {
    this._childNodes = childNodes;
  };
  /**
   * Visible child nodes for the disclosed container. Child nodes are populated for global layout only.
   * @return {array} array of DvtDiagramLayoutContextNode objects
   */


  DvtDiagramLayoutContextNode.prototype.getChildNodes = function () {
    return this._childNodes;
  };
  /**
   * @protected
   * Set parent node. The member is populated for global layout option
   * @param {DvtDiagramLayoutContextNode} parentNode parent node
   */


  DvtDiagramLayoutContextNode.prototype.setParentNode = function (parentNode) {
    this._parentNode = parentNode;
  };
  /**
   * Get parent node. The member is populated for global layout option.
   * @return {DvtDiagramLayoutContextNode} parent node
   */


  DvtDiagramLayoutContextNode.prototype.getParentNode = function () {
    return this._parentNode;
  };
  /**
   * Resets IsRendered flag and calculated bounds for parent nodes.
   * Relevant for global layout option, when parent container is already rendered, but a child node changes position
   * the parent node should be marked as not rendered
   * @protected
   */


  DvtDiagramLayoutContextNode.prototype.UpdateParentNodes = function () {
    var parent = this.getParentNode();

    if (parent && parent.IsRendered) {
      parent.Reset();
      parent.UpdateParentNodes();
    }
  };
  /**
   * Resets IsRendered flag and calculated bounds for the current node.
   * @protected
   */


  DvtDiagramLayoutContextNode.prototype.Reset = function () {
    this.IsRendered = false;
    this.setBounds(null);
    this.setContentBounds(null);
    this.setLabelBounds(null);
    this.setDirty();
  };
  /**
   * Sets the label valign
   * default is top
   * Only intended for JET Diagram
   * @param {string} valign values can include top, middle, bottom, and baseline
   */


  DvtDiagramLayoutContextNode.prototype.setLabelValign = function (valign) {
    this._labelValign = valign;
    this.setDirty();
  };
  /**
   * Sets the label halign
   * default depends on locale, left for LTR and right for RTL
   * Only intended for JET Diagram
   * @param {string} halign values can include left, right, and center
   */


  DvtDiagramLayoutContextNode.prototype.setLabelHalign = function (halign) {
    this._labelHalign = halign;
    this.setDirty();
  };
  /**
   * Gets the label valign
   * default is top
   * Only intended for JET Diagram
   * @return {string} values can include top, middle, bottom, and baseline
   */


  DvtDiagramLayoutContextNode.prototype.getLabelValign = function () {
    return this._labelValign;
  };
  /**
   * Gets the label halign
   * default depends on locale, left for LTR and right for RTL
   * Only intended for JET Diagram
   * @return {string} values can include left, right, and center
   */


  DvtDiagramLayoutContextNode.prototype.getLabelHalign = function () {
    return this._labelHalign;
  };
  /**
   * @protected
   * Set data for the node
   * @param {object} data a data object for the node
   */


  DvtDiagramLayoutContextNode.prototype.setData = function (data) {
    this._data = data;
  };
  /**
   * Gets data for the node.
   * @return {object|array} returns relevant data for the node
   */


  DvtDiagramLayoutContextNode.prototype.getData = function () {
    return this._data;
  };
  /**
   * @protected
   * Mark layout context for the node as dirty once the its position or label position changed
   */


  DvtDiagramLayoutContextNode.prototype.setDirty = function () {
    if (this.LayoutContext) {
      this.LayoutContext.getDirtyContext().set(this.getId(), true);
    }
  };
  /**
   * @protected
   * Copies layout context state for the node from existing node layout context
   * @param {DvtDiagramLayoutContextNode} node existing node layout context
   */


  DvtDiagramLayoutContextNode.prototype.copyFrom = function (node) {
    if (node) {
      this.setPosition(node.getPosition());
      this.setLabelPosition(node.getLabelPosition());
      this.setLabelRotationAngle(node.getLabelRotationAngle());
      this.setLabelRotationPoint(node.getLabelRotationPoint());
      this.setLabelValign(node.getLabelValign());
      this.setLabelHalign(node.getLabelHalign());

      if (node.getContainerPadding()) {
        this.setContainerPadding(node.getContainerPadding());
      }
    }
  };
  /**
   * @license
   * Copyright (c) 2008 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Defines an (x,y) coordinate.
   * @class DvtDiagramPoint
   * @constructor
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   */


  var DvtDiagramPoint = function DvtDiagramPoint(x, y) {
    this.Init(x, y);
  };

  dvt.Obj.createSubclass(DvtDiagramPoint, dvt.Obj, 'DvtDiagramPoint');
  /**
   * @protected
   * Initialize the point.
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   */

  DvtDiagramPoint.prototype.Init = function (x, y) {
    this['x'] = x === null || isNaN(x) ? 0 : x;
    this['y'] = y === null || isNaN(y) ? 0 : y;
  };
  /**
   * @license
   * Copyright (c) 2008 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

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


  var DvtDiagramRectangle = function DvtDiagramRectangle(x, y, w, h) {
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

  DvtDiagramRectangle.prototype.Init = function (x, y, w, h) {
    this['x'] = x === null || isNaN(x) ? 0 : x;
    this['y'] = y === null || isNaN(y) ? 0 : y;
    this['w'] = w === null || isNaN(w) ? 0 : w;
    this['h'] = h === null || isNaN(h) ? 0 : h;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Expose DvtDiagramPoint outside function wrapper via dvt.DiagramPoint
   */


  dvt.DiagramPoint = DvtDiagramPoint;
  /**
   * Expose DvtDiagramRectangle outside function wrapper via dvt.DiagramRectangle
   */

  dvt.DiagramRectangle = DvtDiagramRectangle;
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @param {dvt.Context} context The rendering context.
   * @param {function} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @constructor
   */

  dvt.BaseDiagram = function (context, callback, callbackObj) {
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

  dvt.BaseDiagram.prototype.Init = function (context, callback, callbackObj) {
    dvt.BaseDiagram.superclass.Init.call(this, context, callback, callbackObj); //: force text to scale linearly

    this.getCtx().getStage().getElem().setAttributeNS(null, 'text-rendering', 'geometricPrecision');
    this._linksPane = new dvt.Container(context);
    this._nodesPane = new dvt.Container(context);
    this._topPane = new dvt.Container(context); // BUG JET-31495 - IMPOSSIBLE TO REMOVE HOVER TREATMENT AND TOOLTIP, WHEN INLINE TEMPLATE IS USED
    // Create a layer for storing touch event source elements temporarily when needed
    // so as to not break the events

    if (dvt.Agent.isTouchDevice()) {
      this._touchEventPane = new dvt.Container(context);

      this._touchEventPane.setStyle({
        display: 'none'
      });
    }

    this.InitializeZoomLimits();
  };
  /**
   * @protected
   * Called by the renderComponent() method. Used to initialize or reinitialize the component before rendering.
   */


  dvt.BaseDiagram.prototype.InitComponentInternal = function () {
    // Create the event handler and add event listeners
    var pzc = this.getPanZoomCanvas();
    pzc.setMinZoom(this.getMinZoom());
    pzc.setMaxZoom(this.getMaxZoom());
    pzc.setAnimationDuration(this.getAnimationDuration());
    pzc.getContentPane().addChild(this._linksPane);
    pzc.getContentPane().addChild(this._nodesPane);
    pzc.getContentPane().addChild(this._topPane);
    this._touchEventPane && pzc.getContentPane().addChild(this._touchEventPane);
  };
  /**
   * Gets the animation duration (in seconds)
   * @return {number} the animation duration (in seconds)
   */


  dvt.BaseDiagram.prototype.getAnimationDuration = function () {
    //subclasses should override
    return dvt.PanZoomCanvas.DEFAULT_ANIMATION_DURATION;
  };
  /**
   * Sets the maximum zoom level
   * @param {number} maxZoom maximum zoom level
   */


  dvt.BaseDiagram.prototype.setMaxZoom = function (maxZoom) {
    this._maxZoom = maxZoom;

    if (this.getPanZoomCanvas()) {
      this.getPanZoomCanvas().setMaxZoom(maxZoom);
    }
  };
  /**
   * Gets the maximum zoom level
   * @return {number} maximum zoom level
   */


  dvt.BaseDiagram.prototype.getMaxZoom = function () {
    return this._maxZoom;
  };
  /**
   * Sets the minimum zoom level
   * @param {number} minZoom minimum zoom level
   */


  dvt.BaseDiagram.prototype.setMinZoom = function (minZoom) {
    this._minZoom = minZoom;

    if (this.getPanZoomCanvas()) {
      this.getPanZoomCanvas().setMinZoom(minZoom);
    }
  };
  /**
   * Gets the minimum zoom level
   * @return {number} minimum zoom level
   */


  dvt.BaseDiagram.prototype.getMinZoom = function () {
    return this._minZoom;
  };
  /**
   * Initializes the minimum and maximum zoom levels of the panZoomCanvas
   */


  dvt.BaseDiagram.prototype.InitializeZoomLimits = function () {
    this.setMaxZoom(2.0);
    this.setMinZoom(0.0);
  };
  /**
   * Gets a node by specified id
   * @param {string} id node id
   * @return {dvt.BaseDiagramNode} diagram node
   */


  dvt.BaseDiagram.prototype.getNodeById = function (id) {
    return null;
  };
  /**
   * Gets a link by specified id
   * @param {string} id link id
   * @return {dvt.BaseDiagramLink} diagram link
   */


  dvt.BaseDiagram.prototype.getLinkById = function (id) {
    return null;
  };
  /**
   * Gets an array of link ids
   * @return {array} array of link ids
   */


  dvt.BaseDiagram.prototype.GetAllLinks = function () {
    return [];
  };
  /**
   * Gets an array of node ids
   * @return {array} array of node ids
   */


  dvt.BaseDiagram.prototype.GetAllNodes = function () {
    return [];
  };
  /**
   * Gets an array of root ids
   * @return {array} array of root ids
   */


  dvt.BaseDiagram.prototype.GetAllRoots = function () {
    return [];
  };
  /**
   * Refreshes the empty text message, centered in the available space.
   *
   * @param {boolean} emptyDiagram True if empty text should be rendered, false otherwise
   * @protected
   */


  dvt.BaseDiagram.prototype.RefreshEmptyText = function (emptyDiagram) {
    if (emptyDiagram && this.getEmptyText()) {
      if (!this._emptyTextDisplay) {
        // Create the text and position it in the middle of the available space
        this._emptyTextDisplay = this.CreateEmptyText(this.getEmptyText());
      } else {
        this._emptyTextDisplay.setX(this.Width / 2);

        this._emptyTextDisplay.setY(this.Height / 2);

        dvt.TextUtils.fitText(this._emptyTextDisplay, this.getWidth() - 2 * dvt.TextUtils.EMPTY_TEXT_BUFFER, Infinity, this);
      }
    } else {
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


  dvt.BaseDiagram.prototype.CreateEmptyText = function (text) {
    var options = this.getOptions();
    return dvt.TextUtils.renderEmptyText(this, text, new dvt.Rectangle(0, 0, this.getWidth(), this.getHeight()), this.getEventManager(), options['_statusMessageStyle']);
  };
  /**
   * Sets a text for the empty component
   * @param {string} text text for the empty component
   */


  dvt.BaseDiagram.prototype.setEmptyText = function (text) {
    this._emptyText = text;
  };
  /**
   * Gets a text for the empty component
   * @return {string} text for the empty component
   */


  dvt.BaseDiagram.prototype.getEmptyText = function () {
    return this._emptyText;
  };
  /**
   * Sets panning option for diagram
   * @param {boolean} panningEnabled true if panning enabled
   * @protected
   */


  dvt.BaseDiagram.prototype.SetPanningEnabled = function (panningEnabled) {
    this._panningEnabled = panningEnabled;
  };
  /**
   * Gets panning option for diagram
   * @return {boolean} true if panning enabled
   * @protected
   */


  dvt.BaseDiagram.prototype.IsPanningEnabled = function () {
    return this._panningEnabled;
  };
  /**
   * Sets pan direction for diagram
   * @param {string} panDirection the direction that panning is enabled
   */


  dvt.BaseDiagram.prototype.setPanDirection = function (panDirection) {
    this._panDirection = panDirection;

    if (this.getPanZoomCanvas()) {
      this.getPanZoomCanvas().setPanDirection(panDirection);
    }
  };
  /**
   * Gets pan direction for diagram
   * @return {string} the direction that panning is enabled
   */


  dvt.BaseDiagram.prototype.getPanDirection = function () {
    return this._panDirection;
  };
  /**
   * Sets zooming option for diagram
   * @param {boolean} zoomingEnabled true if zooming enabled
   * @protected
   */


  dvt.BaseDiagram.prototype.SetZoomingEnabled = function (zoomingEnabled) {
    this._zoomingEnabled = zoomingEnabled;
  };
  /**
   * Gets zooming option for diagram
   * @return {boolean} true if zooming enabled
   * @protected
   */


  dvt.BaseDiagram.prototype.IsZoomingEnabled = function () {
    return this._zoomingEnabled;
  };
  /**
   * Gets selection handler
   * @return {dvt.SelectionHandler} selection handler
   */


  dvt.BaseDiagram.prototype.getSelectionHandler = function () {
    return this._selectionHandler;
  };
  /**
   * Sets the selection mode for the component
   * @param {string} selectionMode valid values dvt.SelectionHandler.TYPE_SINGLE, dvt.SelectionHandler.TYPE_MULTIPLE or null
   */


  dvt.BaseDiagram.prototype.setSelectionMode = function (selectionMode) {
    if (selectionMode == 'single') this._selectionHandler = new dvt.SelectionHandler(this.getCtx(), dvt.SelectionHandler.TYPE_SINGLE);else if (selectionMode == 'multiple') this._selectionHandler = new dvt.SelectionHandler(this.getCtx(), dvt.SelectionHandler.TYPE_MULTIPLE);else this._selectionHandler = null; // Event Handler delegates to other handlers

    this.getEventManager().setSelectionHandler(this._selectionHandler);
  };
  /**
   * Get selection mode
   * @return {string} valid values dvt.SelectionHandler.TYPE_SINGLE, dvt.SelectionHandler.TYPE_MULTIPLE or null
   */


  dvt.BaseDiagram.prototype.getSelectionMode = function () {
    if (this._selectionHandler) {
      return this._selectionHandler.getType();
    } else {
      return null;
    }
  };
  /**
    *  Returns whether selecton is supported on the diagram.
    *  @return {boolean} True if selection is turned on for the nbox and false otherwise.
    */


  dvt.BaseDiagram.prototype.isSelectionSupported = function () {
    return this._selectionHandler ? true : false;
  };
  /**
   * Gets nodes pane
   * @return {dvt.Container} nodes pane
   */


  dvt.BaseDiagram.prototype.getNodesPane = function () {
    return this._nodesPane;
  };
  /**
   * Sets nodes pane
   * @param {dvt.Container} nodesPane
   */


  dvt.BaseDiagram.prototype.setNodesPane = function (nodesPane) {
    this._nodesPane = nodesPane;
  };
  /**
   * Gets links pane
   * @return {dvt.Container} links pane
   */


  dvt.BaseDiagram.prototype.getLinksPane = function () {
    return this._linksPane;
  };
  /**
   * Sets links pane
   * @param {dvt.Container} linksPane
   */


  dvt.BaseDiagram.prototype.setLinksPane = function (linksPane) {
    this._linksPane = linksPane;
  };
  /**
   * Gets top pane
   * @return {dvt.Container} top pane
   */


  dvt.BaseDiagram.prototype.getTopPane = function () {
    return this._topPane;
  };
  /**
   * Sets top pane
   * @param {dvt.Container} topPane
   */


  dvt.BaseDiagram.prototype.setTopPane = function (topPane) {
    this._topPane = topPane;
  };
  /**
   * Gets touch event pane
   * @return {dvt.Container|null} the reference to touch event pane if it is a touch device or null
   */


  dvt.BaseDiagram.prototype.getTouchEventPane = function () {
    return this._touchEventPane || null;
  };
  /**
   * Gets bottom pane used for highlighting edge case:
   * the majority of the diagram objects should be highlighted,
   * so instead of moving highlighted objects to the top pane,
   * move faded objects to the bottom pane
   * @return {dvt.Container} bottom pane
   */


  dvt.BaseDiagram.prototype.getBottomPane = function () {
    if (!this._bottomPane) {
      this._bottomPane = new dvt.Container(this.getCtx());
      var pzc = this.getPanZoomCanvas();
      pzc.getContentPane().addChildAt(this._bottomPane, 0);
    }

    return this._bottomPane;
  };
  /**
   * Creates empty layout context for the component
   * @return {DvtDiagramLayoutContext}  layout context
   * @protected
   */


  dvt.BaseDiagram.prototype.CreateEmptyLayoutContext = function () {
    var layoutContext = new DvtDiagramLayoutContext(this.getCtx()); //: inform layout of reading direction

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


  dvt.BaseDiagram.prototype.CreateLayoutContextNode = function (node, layout, bRenderAfter, layoutContext) {
    var nc = new DvtDiagramLayoutContextNode();
    nc.setId(node.getId ? node.getId() : node.getData().getId()); //: set both the content bounds and the overall bounds of
    //the node on the layout context

    nc.setBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getLayoutBounds()));
    nc.setContentBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getContentBounds()));
    var nodeData = node.getLayoutAttributes ? node.getLayoutAttributes(layout) : node.getData()['_itemData'];
    nc.setLayoutAttributes(nodeData);
    nc.setData(nodeData);
    nc.setLabelBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getLabelBounds()));
    nc.setLabelPosition(dvt.DiagramLayoutUtils.convertPointToDiagramPoint(node.getLabelPosition()));
    nc.setSelected(true == node.isSelected());

    if (node.isDisclosed()) {
      nc.setDisclosed(true); //only set container padding AFTER setting bounds and disclosed

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


  dvt.BaseDiagram.prototype.CreateLayoutContextLink = function (link, startId, endId, layout, layoutContext) {
    var lc = new DvtDiagramLayoutContextLink();
    lc.setId(link.getId ? link.getId() : link.getData().getId());
    lc.setStartId(startId ? startId : link.getData().getStartId());
    lc.setEndId(endId ? endId : link.getData().getEndId()); // This code does not require any special handling for the _noTemplate case!

    var linkData;

    if (link.isPromoted()) {
      linkData = link.getData()['_links'];

      if (this.isDataProviderMode()) {
        linkData = linkData.map(function (item) {
          return item['_itemData'];
        });
      }
    } else {
      linkData = link.getData()['_itemData'];
    }

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
   * @param {boolean} bSaveOffset Flag for saving the layout offset (true for the top level)
   */


  dvt.BaseDiagram.prototype.ApplyLayoutContext = function (layoutContext, bSaveOffset) {
    //: apply container padding that was set while laying out the container's children
    var topContainerPadding = layoutContext.getContainerPadding();

    if (topContainerPadding) {
      var containerId = layoutContext.getContainerId();

      if (containerId) {
        var containerNode = this.getNodeById(containerId);

        if (containerNode) {
          containerNode.setContainerPadding(dvt.BaseDiagram.getContainerPadding(topContainerPadding));
        }
      }
    } // Calculate the translation necessary to make the upper left hand corner = (0,0)


    var minx = Number.MAX_VALUE;
    var miny = Number.MAX_VALUE;

    for (var ni = 0; ni < layoutContext.getNodeCount(); ni++) {
      var nc = layoutContext.getNodeByIndex(ni);
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

    var lopt = new dvt.Point(-minx, -miny);
    var tx = lopt.x;
    var ty = lopt.y;
    var dirtyLayoutContext = layoutContext.getDirtyContext();

    for (var ni = 0; ni < layoutContext.getNodeCount(); ni++) {
      var nc = layoutContext.getNodeByIndex(ni);

      if (nc.getContainerId()) {
        nc.ContentOffset = new dvt.DiagramPoint(lopt.x, lopt.y); // adjust content offset that is used by global layout
      }

      if (!dirtyLayoutContext.has(nc.getId())) continue;
      var node = this.getNodeById(nc.getId());
      var pos = nc.getPosition();

      if (pos) {
        node.SetPosition(pos['x'] + tx, pos['y'] + ty);
      }

      this.ApplyLabelPosition(nc, node, dvt.DiagramLayoutUtils.convertDiagramPointToPoint(pos)); //apply new container padding

      if (node.isDisclosed()) {
        var containerPadding = nc.getContainerPadding();

        if (containerPadding) {
          node.setContainerPadding(dvt.BaseDiagram.getContainerPadding(containerPadding));
        }
      }
    }

    for (var li = 0; li < layoutContext.getLinkCount(); li++) {
      var lc = layoutContext.getLinkByIndex(li);
      if (!dirtyLayoutContext.has(lc.getId())) continue;
      var link = this.getLinkById(lc.getId());
      var linkOffset = this.GetLinkTranslationOffset(link, lc, lopt);
      var linkOffsetX = linkOffset.x,
          linkOffsetY = linkOffset.y;
      var points = lc.getPoints();

      if (points) {
        link.setPoints(points);
      }

      link.setTranslate(linkOffsetX, linkOffsetY);
      this.ApplyLabelPosition(lc, link, new dvt.Point(0, 0));
    } //save viewport from layout, if specified


    var layoutViewport = layoutContext.getViewport();

    if (layoutViewport) {
      this._layoutViewport = new dvt.Rectangle(layoutViewport['x'] + tx, layoutViewport['y'] + ty, layoutViewport['w'], layoutViewport['h']);
    }

    if (bSaveOffset) this._layoutOffset = new dvt.Point(tx, ty);
  };
  /**
   * Calculates translation offset for the link
   * @param {dvt.BaseDiagramLink} link link
   * @param {DvtDiagramLayoutContextLink} lc layout context for the link
   * @param {dvt.Point} lopt layout offset point
   * @return {dvt.Point} translation offset for the link
   * @protected
   */


  dvt.BaseDiagram.prototype.GetLinkTranslationOffset = function (link, lc, lopt) {
    var offset = new dvt.Point(0, 0);
    var context = this.getCtx();

    if (!link.getGroupId()) {
      //top level container - use top level layout offset
      offset = lopt;
    } else if (!dvt.BaseDiagram.compareValues(context, link.getGroupId(), lc.getCoordinateSpace())) {
      //link position is given either global or relative to some ancestor container
      var ancestorId = lc.getCoordinateSpace();
      var node = this.getNodeById(link.getGroupId());

      while (node) {
        var padding = node.getContainerPadding();
        offset['x'] -= padding['left'] - node.GetPosition()['x'];
        offset['y'] -= padding['top'] - node.GetPosition()['y'];
        var containerId = node.getGroupId();
        node = !dvt.BaseDiagram.compareValues(context, containerId, ancestorId) ? this.getNodeById(containerId) : null;
      }

      if (!ancestorId) {
        //should adjust for top level offset that is already added to the top level nodes
        offset['x'] += lopt.x;
        offset['y'] += lopt.y;
      }
    } else {} //position already adjusted to the common container - nothing to adjust


    return offset;
  };
  /**
   * Gets viewport if it was set by the layout
   * @return {dvt.Rectangle} layout viewport
   * @protected
   */


  dvt.BaseDiagram.prototype.GetLayoutViewport = function () {
    return this._layoutViewport;
  };
  /**
   * @protected
   * Check whether a viewport is set by the layout engine
   * @return {boolean} true if viewport is set by the layout engine
   */


  dvt.BaseDiagram.prototype.IsLayoutViewport = function () {
    return this._layoutViewport ? true : false;
  };
  /**
   * @protected
   * Clear a viewport that was set by the layout engine. Should be done to avoid stale viewport.
   */


  dvt.BaseDiagram.prototype.ClearLayoutViewport = function () {
    this._layoutViewport = null;
  };
  /**
   * Adjusts the minimum zoom level of the panZoomCanvas if the diagram minZoom was set to 0.0
   * Will return the resulting view bounds if there were calculated
   * @param {dvt.Rectangle} fitBounds (optional) the zoom-to-fit bounds, if known
   * @return {dvt.Rectangle} the bounds required to zoom to fit all content
   * @protected
   */


  dvt.BaseDiagram.prototype.AdjustMinZoom = function (fitBounds) {
    if (this.getMinZoom() == 0.0) {
      // Auto adjust minzoom of panzoomcanvas
      var panZoomCanvas = this.getPanZoomCanvas();
      var minZoomFitBounds = fitBounds ? fitBounds : this.GetViewBounds();
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


  dvt.BaseDiagram.prototype.GetMinZoomFactor = function () {
    return 1;
  };
  /**
   * Calculates the minimum scale needed to zoom to fit the specified bounds
   * @param {dvt.Rectangle} bounds the bounds to calculate the scale for
   * @return {number} the minimum scale
   * @protected
   */


  dvt.BaseDiagram.prototype.CalculateMinimumScale = function (bounds) {
    if (!bounds) return 0;
    var panZoomCanvas = this.getPanZoomCanvas();
    var minScaleX = (this.Width - 2 * panZoomCanvas.getZoomToFitPadding()) / bounds.w;
    var minScaleY = (this.Height - 2 * panZoomCanvas.getZoomToFitPadding()) / bounds.h;
    var minScale = Math.min(minScaleX, minScaleY);
    return minScale;
  };
  /**
   * Gets view bounds
   * @return {dvt.Rectangle} view bounds
   * @protected
   */


  dvt.BaseDiagram.prototype.GetViewBounds = function () {
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
    var arNodeIds = this.GetAllRoots();

    for (var i = 0; i < arNodeIds.length; i++) {
      nodeId = arNodeIds[i];
      node = this.getNodeById(nodeId);

      if (node && node.getVisible()) {
        dims = node.GetNodeBounds();
        tx = node.getTranslateX();
        ty = node.getTranslateY();
        dims.x += tx;
        dims.y += ty;

        if (!bounds) {
          bounds = dims;
        } else {
          bx = bounds.x;
          by = bounds.y;
          bounds.x = Math.min(bounds.x, dims.x);
          bounds.y = Math.min(bounds.y, dims.y);
          bounds.w = Math.max(bx + bounds.w, dims.x + dims.w) - bounds.x;
          bounds.h = Math.max(by + bounds.h, dims.y + dims.h) - bounds.y;
        }
      }
    } //if a list of links wasn't provided, then use all links


    var arLinkIds = this.GetAllLinks();

    for (var i = 0; i < arLinkIds.length; i++) {
      linkId = arLinkIds[i];
      link = this.getLinkById(linkId);

      if (link && link.getVisible()) {
        if (link.getGroupId()) {
          continue;
        }

        dims = link.GetLinkBounds();
        tx = link.getTranslateX();
        ty = link.getTranslateY();
        dims.x += tx;
        dims.y += ty;

        if (!bounds) {
          bounds = dims;
        } else {
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


  dvt.BaseDiagram.RotateBounds = function (bounds, rotAngle, rotPoint) {
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
        mat = mat.translate(-rotPoint.x, -rotPoint.y);
      }

      mat = mat.rotate(rotAngle);

      if (rotPoint) {
        mat = mat.translate(rotPoint.x, rotPoint.y);
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
   * Sets the pan constraints based on the current content dimensions
   * @param {number} x The x coordinate of the upper left corner of the content bounding box
   * @param {number} y The y coordinate of the upper left corner of the content bounding box
   * @param {number} w The width of the content bounding box
   * @param {number} h The height of the content bounding box
   * @param {number} zoom The current panZoomCanvas zoom level
   * @protected
   */


  dvt.BaseDiagram.prototype.ConstrainPanning = function (x, y, w, h, zoom) {
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

      if (-viewportBounds.x * zoom < minPanX) {
        dx = minPanX + viewportBounds.x * zoom;
        minPanX -= dx;
        maxPanX += dx;
      } else if (-viewportBounds.x * zoom > maxPanX) {
        dx = -viewportBounds.x * zoom - maxPanX;
        minPanX -= dx;
        maxPanX += dx;
      }

      if (-viewportBounds.y * zoom < minPanY) {
        dy = minPanY + viewportBounds.y * zoom;
        minPanY -= dy;
        maxPanY += dy;
      } else if (-viewportBounds.y * zoom > maxPanY) {
        dy = -viewportBounds.y * zoom - maxPanY;
        minPanY -= dy;
        maxPanY += dy;
      }
    }

    pzc.setMinPanX(minPanX);
    pzc.setMinPanY(minPanY);
    pzc.setMaxPanX(maxPanX);
    pzc.setMaxPanY(maxPanY);

    if (this.Overview) {
      this.Overview.updateConstraints(minPanX, minPanY, maxPanX, maxPanY);
    }
  };
  /**
   * Convert key notation into dot notation
   * @param {object} layoutContainerPadding the object with the layout container padding values
   * @return {object} object with the container padding values
   */


  dvt.BaseDiagram.getContainerPadding = function (layoutContainerPadding) {
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


  dvt.BaseDiagram.getLayoutContainerPadding = function (containerPadding) {
    var layoutContainerPadding = new Object();
    layoutContainerPadding['top'] = containerPadding.top;
    layoutContainerPadding['right'] = containerPadding.right;
    layoutContainerPadding['bottom'] = containerPadding.bottom;
    layoutContainerPadding['left'] = containerPadding.left;
    return layoutContainerPadding;
  };
  /**
   * Updates layout context for the node/link
   * @param {DvtDiagramLayoutContextNode | DvtDiagramLayoutContextNode} objc node or link context
   * @param {dvt.BaseDiagramNode | dvt.BaseDiagramLink} obj diagram node or link
   * @param {dvt.Point} pos position of node or link
   * @protected
   */


  dvt.BaseDiagram.prototype.ApplyLabelPosition = function (objc, obj, pos) {
    var labelBounds = objc.getLabelBounds();
    labelBounds = dvt.DiagramLayoutUtils.convertDiagramRectToRect(labelBounds);
    var labelPos = objc.getLabelPosition();

    if (labelBounds && labelPos) {
      // translate to make these relative to the node or link
      var translatedPos = new dvt.Point(labelPos['x'] - pos.x, labelPos['y'] - pos.y);
      var labelRotAngle = objc.getLabelRotationAngle();
      var labelRotPoint = dvt.DiagramLayoutUtils.convertDiagramPointToPoint(objc.getLabelRotationPoint());
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
  };
  /**
   * Gets layout offset
   * @return {dvt.Point} x,y coordinates for layout offset
   */


  dvt.BaseDiagram.prototype.getLayoutOffset = function () {
    return this._layoutOffset ? this._layoutOffset : new dvt.Point(0, 0);
  };
  /**
   * Returns the custom obj keyboard bounding box
   * @param {dvt.BaseDiagramNode | dvt.BaseDiagramLink} obj diagram node or link
   * @return {dvt.Rectangle} keyboard bounding box of rectangle
   */


  dvt.BaseDiagram.prototype.getCustomObjKeyboardBoundingBox = function (obj) {
    var objCoords = obj.getElem().getBoundingClientRect();
    var contentPaneCoords = this.getPanZoomCanvas().getContentPane().getElem().getBoundingClientRect();
    var cpMatrix = this.getPanZoomCanvas().getContentPane().getMatrix();
    return new dvt.Rectangle(objCoords.left - contentPaneCoords.left + cpMatrix.getTx(), objCoords.top - contentPaneCoords.top + cpMatrix.getTy(), objCoords.width, objCoords.height);
  };
  /**
   * Diagram specific wrapper around compareValues call, that treats null and undefined objects as equal
   * @param {dvt.Context} context The rendering context.
   * @param {any} obj1 object to compare
   * @param {any} obj2 object to compare
   * @return {boolean} True if the two objects are equal and false otherwise
   */


  dvt.BaseDiagram.compareValues = function (ctx, obj1, obj2) {
    if (!obj1 && !obj2) {
      return true;
    }

    return dvt.Obj.compareValues(ctx, obj1, obj2);
  };
  /**
   * @license
   * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @constructor
   *  @class dvt.BaseDiagramKeyboardHandler base class for keyboard handler for diagram component
   *  @param {dvt.BaseDiagram} component The owning diagram component
   *  @param {dvt.EventManager} manager The owning dvt.EventManager
   *  @extends {dvt.PanZoomCanvasKeyboardHandler}
   */


  dvt.BaseDiagramKeyboardHandler = function (component, manager) {
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

  dvt.BaseDiagramKeyboardHandler.prototype.Init = function (diagram, manager) {
    dvt.BaseDiagramKeyboardHandler.superclass.Init.call(this, diagram, manager);
    this._diagram = diagram;
  };
  /**
   * Gets parent diagram
   * @return {dvt.BaseDiagram} parent diagram
   * @protected
   */


  dvt.BaseDiagramKeyboardHandler.prototype.GetDiagram = function () {
    return this._diagram;
  };
  /**
   * @override
   */


  dvt.BaseDiagramKeyboardHandler.prototype.isSelectionEvent = function (event) {
    if (event.keyCode == dvt.KeyboardEvent.TAB) return false;else return this.isNavigationEvent(event) && !event.ctrlKey;
  };
  /**
   * @override
   */


  dvt.BaseDiagramKeyboardHandler.prototype.isMultiSelectEvent = function (event) {
    return event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey;
  };
  /**
   * Get first navigable link
   * @param {dvt.BaseDiagramNode} node node for which links are analyzed
   * @param {dvt.KeyboardEvent} event keyboard event
   * @param {array} listOfLinks array of links for the node
   * @return {dvt.BaseDiagramLink} first navigable link
   */


  dvt.BaseDiagramKeyboardHandler.prototype.getFirstNavigableLink = function (node, event, listOfLinks) {
    var direction = event.keyCode;
    if (!listOfLinks || listOfLinks.length < 1 || !node) return null;
    var link = listOfLinks[0];
    var nodeBB = node.getKeyboardBoundingBox();
    var nodeCenterX = nodeBB.x + nodeBB.w / 2;

    for (var i = 0; i < listOfLinks.length; i++) {
      var object = listOfLinks[i];
      var linkBB = object.getKeyboardBoundingBox();
      var linkCenterX = linkBB.x + linkBB.w / 2;

      if (direction == dvt.KeyboardEvent.OPEN_ANGLED_BRACKET && linkCenterX <= nodeCenterX || direction == dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET && linkCenterX >= nodeCenterX) {
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


  dvt.BaseDiagramKeyboardHandler.prototype.getNextNavigableLink = function (node, currentLink, event, listOfLinks) {
    if (!listOfLinks) return null;
    if (!currentLink) return listOfLinks[0];
    if (!node) return currentLink;

    this._addSortingAttributes(node, listOfLinks);

    listOfLinks.sort(this._getLinkComparator());

    this._removeSortingAttributes(listOfLinks); //clockwise direction


    var bForward = event.keyCode == dvt.KeyboardEvent.DOWN_ARROW ? true : false;
    var index = 0;

    for (var i = 0; i < listOfLinks.length; i++) {
      var link = listOfLinks[i];

      if (link === currentLink) {
        if (bForward) index = i == listOfLinks.length - 1 ? 0 : i + 1;else index = i == 0 ? listOfLinks.length - 1 : i - 1;
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


  dvt.BaseDiagramKeyboardHandler.prototype.GetVisibleNode = function (nodeId) {
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


  dvt.BaseDiagramKeyboardHandler.prototype._getClockwiseAngle = function (node, link) {
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


  dvt.BaseDiagramKeyboardHandler.prototype._getNodeCenter = function (node) {
    var nodeBB = node.getKeyboardBoundingBox();
    return new dvt.Point(nodeBB.x + nodeBB.w / 2, nodeBB.y + nodeBB.h / 2);
  };
  /**
   * Get distance between start and end nodes for the given link
   * @param {dvt.BaseDiagramLink} link a link
   * @return {number} the distance between nodes
   * @private
   */


  dvt.BaseDiagramKeyboardHandler.prototype._getNodesDistance = function (link) {
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


  dvt.BaseDiagramKeyboardHandler.prototype._getLinkDirection = function (node, link) {
    if (node == this.GetVisibleNode(link.getEndId ? link.getEndId() : link.getData().getEndId())) return dvt.BaseDiagramKeyboardHandler._INGOING;else return dvt.BaseDiagramKeyboardHandler._OUTGOING;
  };
  /**
   * Get function that compares two link around a given node
   * The links are analyzed by angle, distance from the node and direction. The sorting attributes are added to the links before sorting.
   * @return {function} a function that compares to links around the node
   * @private
   */


  dvt.BaseDiagramKeyboardHandler.prototype._getLinkComparator = function () {
    var comparator = function comparator(link1, link2) {
      var linkAngle1 = link1.__angle;
      var linkAngle2 = link2.__angle;
      var res = -1;

      if (!dvt.BaseDiagramKeyboardHandler._anglesAreEqualWithinTolerance(linkAngle1, linkAngle2) && linkAngle1 > linkAngle2) {
        res = 1;
      } else if (dvt.BaseDiagramKeyboardHandler._anglesAreEqualWithinTolerance(linkAngle1, linkAngle2)) {
        //check distance and direction
        if (link1.__distance > link2.__distance) {
          res = 1;
        } else if (link2.__distance == link1.__distance && link1.__direction > link2.__direction) {
          //outgoing to ingoing
          res = 1;
        } else if (link2.__distance == link1.__distance && link1.__direction == link2.__direction) {
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


  dvt.BaseDiagramKeyboardHandler.prototype._removeSortingAttributes = function (listOfLinks) {
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


  dvt.BaseDiagramKeyboardHandler.prototype._addSortingAttributes = function (node, listOfLinks) {
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


  dvt.BaseDiagramKeyboardHandler._anglesAreEqualWithinTolerance = function (a1, a2) {
    var res = Math.abs(a1 - a2) <= 0.0000001;

    if (!res) {
      res = Math.abs(Math.PI * 2 + Math.min(a1, a2) - Math.max(a1, a2)) <= 0.0000001;
    }

    return res;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @constructor
   * @class The base class for diagram links.
   * @param {dvt.Context} context the rendering context
   * @param {string} nodeId the node id
   * @param {dvt.Diagram} diagram parent diagram component
   * @implements {DvtSelectable}
   * @implements {DvtKeyboardNavigable}
   */


  dvt.BaseDiagramNode = function (context, nodeId, diagram) {
    this.Init(context, nodeId, diagram);
  };

  dvt.Obj.createSubclass(dvt.BaseDiagramNode, dvt.Container, 'dvt.BaseDiagramNode');
  /**
   * Initialization method called by the constructor
   * @param {dvt.Context} context the rendering context
   * @param {string} nodeId the node id
   * @param {dvt.Diagram} diagram parent diagram component
   */

  dvt.BaseDiagramNode.prototype.Init = function (context, nodeId, diagram) {
    dvt.BaseDiagramNode.superclass.Init.call(this, context, null, nodeId);
    this._diagram = diagram;
    this._bDisclosed = false;
    this._selected = false;
    this._selectable = true;
  };
  /**
   * Gets parent diagram
   * @return {dvt.BaseDiagram} parent diagram
   * @protected
   */


  dvt.BaseDiagramNode.prototype.GetDiagram = function () {
    return this._diagram;
  };
  /**
   * Gets data for the diagram node
   * @return {object} data for the diagram node
   */


  dvt.BaseDiagramNode.prototype.getData = function () {
    return null;
  };
  /**
   * Get the layout bounds in coordinates relative to this node
   * @param {boolean} forceDims true to force dimensions measurements
   * @return {dvt.Rectangle} layout bounds
   */


  dvt.BaseDiagramNode.prototype.getLayoutBounds = function (forceDims) {
    return this.getContentBounds(forceDims);
  };
  /**
   * Get the content bounds in coordinates relative to this node.
   * @param {boolean} forceDims true to force dimensions measurements
   * @return {dvt.Rectangle} content bounds
   */


  dvt.BaseDiagramNode.prototype.getContentBounds = function (forceDims) {
    //subclasses should override
    return null;
  };
  /**
   * Sets the position of the link label. The position is in the coordinate
   * system of the node's container.
   * @param {dvt.Point} pos position of the node label
   */


  dvt.BaseDiagramNode.prototype.setLabelPosition = function (pos) {
    if (pos) {
      this._labelPos = pos;
      dvt.BaseDiagramNode.PositionLabel(this._labelObj, pos, this.getLabelBounds(true), this.getLabelRotationAngle(), this.getLabelRotationPoint());
    }
  };
  /**
   * Gets the position of the node label.
   * @return {dvt.Point}
   */


  dvt.BaseDiagramNode.prototype.getLabelPosition = function () {
    return this._labelPos;
  };
  /**
   * Gets label dimensions
   * @param {boolean} forceDims true to force dimensions measurements
   * @return {dvt.Rectangle} The bounds of the label
   */


  dvt.BaseDiagramNode.prototype.getLabelBounds = function (forceDims) {
    return null;
  };
  /**
   * Sets label dimensions
   * @param {dvt.Rectangle} bounds The bounds of the label
   */


  dvt.BaseDiagramNode.prototype.setLabelBounds = function (bounds) {};
  /**
   * Get the padding of this container.  Values can be retrieved from the
   * returned map using keys 'top', 'left', 'bottom', and 'right'.
   * @return {object}
   */


  dvt.BaseDiagramNode.prototype.getContainerPadding = function () {
    return null;
  };
  /**
   * Sets padding for a container node
   * @param {number} top Top padding
   * @param {number} right Right padding
   * @param {number} bottom Bottom padding
   * @param {number} left Left padding
   */


  dvt.BaseDiagramNode.prototype.setContainerPadding = function (top, right, bottom, left) {};
  /**
   * Checks if the diagram node is disclosed. Relevant for container nodes.
   * @return {boolean}  true if the diagram container node is disclosed
   */


  dvt.BaseDiagramNode.prototype.isDisclosed = function () {
    return this._bDisclosed;
  };
  /**
   * Sets disclosed flag for the node. Relevant for container nodes.
   * @param {boolean} bDisclosed true for disclosed container node
   */


  dvt.BaseDiagramNode.prototype.setDisclosed = function (bDisclosed) {
    this._bDisclosed = bDisclosed;
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  dvt.BaseDiagramNode.prototype.isSelected = function () {
    return this._selected;
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  dvt.BaseDiagramNode.prototype.setSelected = function (selected) {
    // Store the selection state
    this._selected = selected;
  };
  /**
   * Sets selectable flag on the node
   * @param {boolean} selectable true if the node is selectable
   */


  dvt.BaseDiagramNode.prototype.setSelectable = function (selectable) {
    this._selectable = selectable;
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  dvt.BaseDiagramNode.prototype.isSelectable = function () {
    return this.GetDiagram().isSelectionSupported() && this._selectable;
  };
  /**
   * Sets label rotation angle
   * @param {number} angle angle of label rotation
   */


  dvt.BaseDiagramNode.prototype.setLabelRotationAngle = function (angle) {
    this._labelRotAngle = angle;
    dvt.BaseDiagramNode.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(true), angle, this.getLabelRotationPoint());
  };
  /**
   * Gets label rotation angle
   * @return {number} angle of label rotation
   */


  dvt.BaseDiagramNode.prototype.getLabelRotationAngle = function () {
    return this._labelRotAngle;
  };
  /**
   * Sets label rotation point
   * @param {dvt.DiagramPoint} point label rotation point
   */


  dvt.BaseDiagramNode.prototype.setLabelRotationPoint = function (point) {
    this._labelRotPoint = point;
    dvt.BaseDiagramNode.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(true), this.getLabelRotationAngle(), point);
  };
  /**
   * Gets label rotation point
   * @return {dvt.DiagramPoint} label rotation point
   */


  dvt.BaseDiagramNode.prototype.getLabelRotationPoint = function () {
    return this._labelRotPoint;
  };
  /**
   * Gets node bounds after layout is done
   * @return {dvt.Rectangle} node bounds after layout is done
   * @protected
   */


  dvt.BaseDiagramNode.prototype.GetNodeBounds = function () {
    var nodeBounds = this.getLayoutBounds(true);
    var bounds = new dvt.Rectangle(nodeBounds.x, nodeBounds.y, nodeBounds.w, nodeBounds.h);
    var labelPos = labelPos = this.getLabelPosition();
    var labelRotAngle = this.getLabelRotationAngle();
    var labelRotPoint = this.getLabelRotationPoint();
    var labelBounds = this.getLabelBounds(true);

    if (labelPos && labelBounds) {
      //take label rotation into account
      if (labelRotAngle != null) {
        labelBounds = dvt.BaseDiagram.RotateBounds(labelBounds, labelRotAngle, labelRotPoint);
      } //label coords are relative to containing node


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


  dvt.BaseDiagramNode.CalcLabelMatrix = function (pos, bounds, rotAngle, rotPoint) {
    var mat = new dvt.Matrix();

    if (rotAngle != null) {
      if (rotPoint) {
        mat = mat.translate(-rotPoint.x, -rotPoint.y);
      }

      mat = mat.rotate(rotAngle);

      if (rotPoint) {
        mat = mat.translate(rotPoint.x, rotPoint.y);
      }
    }

    if (pos) {
      mat = mat.translate(pos.x, pos.y);
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


  dvt.BaseDiagramNode.PositionLabel = function (label, pos, bounds, rotAngle, rotPoint) {
    if (!label) return;
    var mat = dvt.BaseDiagramNode.CalcLabelMatrix(pos, bounds, rotAngle, rotPoint);
    label.setMatrix(mat);
  };
  /**
   * Sets position of the node
   * @param {number} xx x coordinate for the node
   * @param {number} yy y coordinate for the node
   * @protected
   */


  dvt.BaseDiagramNode.prototype.SetPosition = function (xx, yy) {
    this.setTranslate(xx, yy);
  };
  /**
   * Gets position of the node
   * @return {dvt.Point} node position
   * @protected
   */


  dvt.BaseDiagramNode.prototype.GetPosition = function () {
    return new dvt.Point(this.getTranslateX(), this.getTranslateY());
  }; // Implementation of DvtKeyboardNavigable interface

  /**
   * @override
   */


  dvt.BaseDiagramNode.prototype.getNextNavigable = function (event) {
    //subclasses should override
    return null;
  };
  /**
   * @override
   */


  dvt.BaseDiagramNode.prototype.getKeyboardBoundingBox = function (targetCoordinateSpace) {
    // return the bounding box for the diagram node, in stage coordinates
    // we don't call this.getDimensions(this.getCtx().getStage() because
    // that would take into account any selection/keyboard focus effects.
    // so instead, we get the content bounds of the node and convert that
    // to stage coordinates, based on code in dvt.Displayable.getDimensions()
    if (this._customNodeContent) return this._diagram.getCustomObjKeyboardBoundingBox(this);else {
      var bounds = this.getContentBounds(targetCoordinateSpace);
      var stageP1 = this.localToStage(new dvt.Point(bounds.x, bounds.y));
      var stageP2 = this.localToStage(new dvt.Point(bounds.x + bounds.w, bounds.y + bounds.h));
      return new dvt.Rectangle(stageP1.x, stageP1.y, stageP2.x - stageP1.x, stageP2.y - stageP1.y);
    }
  };
  /**
   * @override
   */


  dvt.BaseDiagramNode.prototype.getTargetElem = function () {
    return this.getElem();
  };
  /**
   * @override
   */


  dvt.BaseDiagramNode.prototype.showKeyboardFocusEffect = function () {};
  /**
   * @override
   */


  dvt.BaseDiagramNode.prototype.hideKeyboardFocusEffect = function () {};
  /**
   * @override
   */


  dvt.BaseDiagramNode.prototype.isShowingKeyboardFocusEffect = function () {};
  /**
   * Returns an array containing all categories to which this object belongs.
   * @return {array} The array of categories.
   */


  dvt.BaseDiagramNode.prototype.getCategories = function () {
    return null;
  };
  /**
   * Stores an id of an outgoing link for the node
   * @param {string} id an id for the outgoing link
   */


  dvt.BaseDiagramNode.prototype.addOutLinkId = function (id) {
    if (!this._outLinkIds) {
      this._outLinkIds = [];
    }

    this._outLinkIds.push(id);
  };
  /**
   * Removes an id of the outgoing link
   * @param {string} id an id for the outgoing link
   */


  dvt.BaseDiagramNode.prototype.removeOutLinkId = function (id) {
    if (this._outLinkIds) {
      var idx = this._outLinkIds.indexOf(id);

      if (idx != -1) {
        this._outLinkIds.splice(idx, 1);
      }
    }
  };
  /**
   * Gets ids of outgoing links for the node
   * @return {array} ids of outgoing links for the node
   */


  dvt.BaseDiagramNode.prototype.getOutLinkIds = function () {
    return this._outLinkIds;
  };
  /**
   * Stores an id of an incoming link for the node
   * @param {string} id an id for the incoming link
   */


  dvt.BaseDiagramNode.prototype.addInLinkId = function (id) {
    if (!this._inLinkIds) {
      this._inLinkIds = [];
    }

    this._inLinkIds.push(id);
  };
  /**
   * Removes an id of the incoming link
   * @param {string} id an id for the incoming link
   */


  dvt.BaseDiagramNode.prototype.removeInLinkId = function (id) {
    if (this._inLinkIds) {
      var idx = this._inLinkIds.indexOf(id);

      if (idx != -1) {
        this._inLinkIds.splice(idx, 1);
      }
    }
  };
  /**
   * Gets ids of incoming links for the node
   * @return {array} ids of incoming links for the node
   */


  dvt.BaseDiagramNode.prototype.getInLinkIds = function () {
    return this._inLinkIds;
  };
  /**
   * Sets the label alignments
   * system of the node's container.
   * label object guaranteed to be non-null if this method is called
   * @param {string} halign halign of the node label
   * @param {string} valign valign of the node label
   */


  dvt.BaseDiagramNode.prototype.setLabelAlignments = function (halign, valign) {//do nothing, only for DvtDiagramNode
  };
  /**
   * Gets group id for the node
   * @return {string} group id for the node
   */


  dvt.BaseDiagramNode.prototype.getGroupId = function () {
    return null;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @constructor
   * @class The base class for diagram links
   * @param {dvt.Context} context the rendering context
   * @param {string} linkId link id
   * @param {dvt.BaseDiagram} diagram the parent diagram component
   * @implements {DvtSelectable}
   * @implements {DvtKeyboardNavigable}
   */


  dvt.BaseDiagramLink = function (context, linkId, diagram) {
    this.Init(context, linkId, diagram);
  };

  dvt.Obj.createSubclass(dvt.BaseDiagramLink, dvt.Container, 'dvt.BaseDiagramLink');
  /**
   * Initialization method called by the constructor
   * @param {dvt.Context} context the rendering context
   * @param {string} linkId link id
   * @param {dvt.BaseDiagram} diagram the parent diagram component
   */

  dvt.BaseDiagramLink.prototype.Init = function (context, linkId, diagram) {
    dvt.BaseDiagramLink.superclass.Init.call(this, context, null, linkId);
    this._diagram = diagram;
    this._selected = false;
    this._selectable = true;
  };
  /**
   * Gets parent diagram
   * @return {dvt.BaseDiagram} parent diagram
   * @protected
   */


  dvt.BaseDiagramLink.prototype.GetDiagram = function () {
    return this._diagram;
  };
  /**
   * Sets the link end connector type
   * @param {String} type link end connector type
   */


  dvt.BaseDiagramLink.prototype.setEndConnectorType = function (type) {};
  /**
   * Gets the link end connector type
   * @return {String}  link end connector type
   */


  dvt.BaseDiagramLink.prototype.getEndConnectorType = function () {
    return null;
  };
  /**
   * Sets the link start connector type
   * @param {String} type link start connector type
   */


  dvt.BaseDiagramLink.prototype.setStartConnectorType = function (type) {};
  /**
   * Sets link start connector
   * @param {dvt.Container} startConnector link start connector
   */


  dvt.BaseDiagramLink.prototype.setStartConnector = function (startConnector) {
    this._startConnector = startConnector;
  };
  /**
   * Get the link start connector
   * @return {dvt.Container}  link start connector
   */


  dvt.BaseDiagramLink.prototype.getStartConnector = function () {
    return this._startConnector;
  };
  /**
   * Sets link end connector
   * @param {dvt.Container} endConnector link start connector
   */


  dvt.BaseDiagramLink.prototype.setEndConnector = function (endConnector) {
    this._endConnector = endConnector;
  };
  /**
   * Get the link end connector
   * @return {dvt.Container}  link end connector
   */


  dvt.BaseDiagramLink.prototype.getEndConnector = function () {
    return this._endConnector;
  };
  /**
   * Sets link shape
   * @param {dvt.Path} shape link shape
   */


  dvt.BaseDiagramLink.prototype.setShape = function (shape) {
    this._shape = shape;
  };
  /**
   * Get the link shape
   * @return {dvt.Path} link shape
   */


  dvt.BaseDiagramLink.prototype.getShape = function () {
    return this._shape;
  };
  /**
   * Sets label rotation angle
   * @param {number} angle angle of label rotation
   */


  dvt.BaseDiagramLink.prototype.setLabelRotationAngle = function (angle) {
    this._labelRotAngle = angle;
    dvt.BaseDiagramLink.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(), angle, this.getLabelRotationPoint());
  };
  /**
   * Gets label rotation angle
   * @return {number} angle of label rotation
   */


  dvt.BaseDiagramLink.prototype.getLabelRotationAngle = function () {
    return this._labelRotAngle;
  };
  /**
   * Sets label rotation point
   * @param {dvt.DiagramPoint} point label rotation point
   */


  dvt.BaseDiagramLink.prototype.setLabelRotationPoint = function (point) {
    this._labelRotPoint = point;
    dvt.BaseDiagramLink.PositionLabel(this._labelObj, this.getLabelPosition(), this.getLabelBounds(), this.getLabelRotationAngle(), point);
  };
  /**
   * Gets label rotation point
   * @return {dvt.DiagramPoint} label rotation point
   */


  dvt.BaseDiagramLink.prototype.getLabelRotationPoint = function () {
    return this._labelRotPoint;
  };
  /**
   * Gets the position of the link label.
   * @return {dvt.Point}
   */


  dvt.BaseDiagramLink.prototype.getLabelPosition = function () {
    return this._labelPos;
  };
  /**
   * Sets the position of the link label.
   * @param {dvt.Point} pos label position
   */


  dvt.BaseDiagramLink.prototype.setLabelPosition = function (pos) {
    if (pos) {
      this._labelPos = pos;
      dvt.BaseDiagramLink.PositionLabel(this._labelObj, pos, this.getLabelBounds(), this.getLabelRotationAngle(), this.getLabelRotationPoint());
    }
  };
  /**
   * Gets label dimensions
   * @return {dvt.Rectangle} The bounds of the label
   */


  dvt.BaseDiagramLink.prototype.getLabelBounds = function () {
    return null;
  };
  /**
   * Sets label dimensions
   * @param {dvt.Rectangle} bounds The bounds of the label
   */


  dvt.BaseDiagramLink.prototype.setLabelBounds = function (bounds) {};
  /**
   * Gets the offset of the start connector.  This is the amount of space that the
   * link should leave between its starting point and the node for the connector
   * to be drawn.
   * @return {number}
   */


  dvt.BaseDiagramLink.prototype.getStartConnectorOffset = function () {
    return 0;
  };
  /**
   * Gets the offset of the end connector.  This is the amount of space that the
   * link should leave between its starting point and the node for the connector
   * to be drawn.
   * @return {number}
   */


  dvt.BaseDiagramLink.prototype.getEndConnectorOffset = function () {
    return 0;
  };
  /**
   * Sets selectable flag on the link
   * @param {boolean} selectable true if the link is selectable
   */


  dvt.BaseDiagramLink.prototype.setSelectable = function (selectable) {
    this._selectable = selectable;
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  dvt.BaseDiagramLink.prototype.isSelectable = function () {
    return this.GetDiagram().isSelectionSupported() && this._selectable;
  };
  /**
   * Checks whether the node is selected
   * @return {boolean} true if the link is selected
   */


  dvt.BaseDiagramLink.prototype.isSelected = function () {
    return this._selected;
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  dvt.BaseDiagramLink.prototype.setSelected = function (selected) {
    // Store the selection state
    this._selected = selected;
  };
  /**
   * Sets promoted flag on the link
   * @param {boolean} bPromoted true if the link is promoted
   */


  dvt.BaseDiagramLink.prototype.setPromoted = function (bPromoted) {
    this._bPromoted = bPromoted;
  };
  /**
   * Checks whether the link is promoted link
   * @return {boolean} true if the link is promoted link
   */


  dvt.BaseDiagramLink.prototype.isPromoted = function () {
    return this._bPromoted;
  };
  /**
   * Sets links width
   * @param {number} lw link width
   */


  dvt.BaseDiagramLink.prototype.setLinkWidth = function (lw) {};
  /**
   * Gets link width
   * @return {number} link width
   */


  dvt.BaseDiagramLink.prototype.getLinkWidth = function () {
    return 1;
  };
  /**
   * Sets link style
   * @param {string} ls link style - 'solid', 'dot', dash' and 'dashDot'
   */


  dvt.BaseDiagramLink.prototype.setLinkStyle = function (ls) {};
  /**
   * Get the link style
   * @return {String} link style
   */


  dvt.BaseDiagramLink.prototype.getLinkStyle = function () {
    return 'solid';
  };
  /**
   * Sets the link color
   * @param {string} lc link color
   */


  dvt.BaseDiagramLink.prototype.setLinkColor = function (lc) {};
  /**
   * Gets the link color
   * @return {string} the link color
   */


  dvt.BaseDiagramLink.prototype.getLinkColor = function () {
    return null;
  };
  /**
   * Gets connector template
   * @param {string} connectorPosition connector position - dvt.DiagramLinkConnectorUtils.START_CONNECTOR or dvt.DiagramLinkConnectorUtils.END_CONNECTOR
   * @return {dvt.AfMarker} connectorTemplate the custom connector shape if exists
   */


  dvt.BaseDiagramLink.prototype.getConnectorTemplate = function (connectorPosition) {
    return null;
  };
  /**
   * @protected
   * Gets link style - either style for regular link or promoted link if the promoted link applicable in this case
   * @return {string} link style
   */


  dvt.BaseDiagramLink.prototype.GetAppliedLinkStyle = function () {
    return this.getLinkStyle();
  };
  /**
   * @protected
   * Gets link width - either width for regular link or promoted link if the promoted link applicable in this case
   * @return {number} link width
   */


  dvt.BaseDiagramLink.prototype.GetAppliedLinkWidth = function () {
    return this.getLinkWidth();
  };
  /**
   * @protected
   * Gets link color - either color for regular link or promoted link if the promoted link applicable in this case
   * @return {string} link color
   */


  dvt.BaseDiagramLink.prototype.GetAppliedLinkColor = function () {
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


  dvt.BaseDiagramLink.prototype.CreateConnector = function (points, connectorType, connectorPos, connectorTemplate) {
    if (!connectorType && !connectorTemplate) {
      return;
    }

    var stroke;

    if (!connectorTemplate) {
      var origStroke = this._shape.getStroke();

      stroke = new dvt.Stroke(origStroke.getColor(), origStroke.getAlpha(), origStroke.getWidth());
    }

    var connector = dvt.DiagramLinkConnectorUtils.CreateConnectorShape(this.getCtx(), connectorType, connectorTemplate, stroke, this);

    if (connector) {
      //: add connectors as children of shape so that selection feedback affects them
      this._shape.addChild(connector);

      dvt.DiagramLinkConnectorUtils.TransformConnector(connector, connectorType, connectorTemplate, points, connectorPos);
    }

    return connector;
  };
  /**
   * Gets link bounds
   * @return {dvt.Rectangle} link bounds
   */


  dvt.BaseDiagramLink.prototype.GetLinkBounds = function () {
    var linkBounds = new dvt.Rectangle(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    var points = this.getPoints();

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
    var labelPos = this.getLabelPosition();
    var labelRotAngle = this.getLabelRotationAngle();
    var labelRotPoint = this.getLabelRotationPoint();
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


  dvt.BaseDiagramLink.prototype.setPoints = function (points) {
    this._arPoints = points;

    if (!dvt.DiagramLinkUtils.IsPath(points)) {
      this._points = points;
      this._pathCmds = dvt.DiagramLinkUtils.ConvertToPath(points);
    } else {
      this._pathCmds = points;
      this._points = dvt.DiagramLinkUtils.ConvertToPoints(points);
    }

    if (this._shape) {
      if (this._shape instanceof dvt.Path) {
        this._shape.setCommandsArray(this._pathCmds);

        if (!this._endConnector) {
          this._endConnector = this.CreateConnector(this._points, this.getEndConnectorType(), 1, this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.END_CONNECTOR));
        } else {
          dvt.DiagramLinkConnectorUtils.TransformConnector(this._endConnector, this.getEndConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.END_CONNECTOR), this._points, 1);
        }

        if (!this._startConnector) {
          this._startConnector = this.CreateConnector(this._points, this.getStartConnectorType(), 0, this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.START_CONNECTOR));
        } else {
          dvt.DiagramLinkConnectorUtils.TransformConnector(this._startConnector, this.getStartConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.START_CONNECTOR), this._points, 0);
        }
      }
    } //need to update the selection feedback when animating a link


    var underlayStart = null,
        underlayEnd = null;

    if (this._linkUnderlay && this._linkUnderlay.getUnderlay() instanceof dvt.Path) {
      this._linkUnderlay.getUnderlay().setCommandsArray(this._pathCmds);
    }

    if (this._linkUnderlay && (underlayStart = this._linkUnderlay.getUnderlayStart())) {
      dvt.DiagramLinkConnectorUtils.TransformConnector(underlayStart, this.getStartConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.START_CONNECTOR), this._points, 0);
    }

    if (this._linkUnderlay && (underlayEnd = this._linkUnderlay.getUnderlayEnd())) {
      dvt.DiagramLinkConnectorUtils.TransformConnector(underlayEnd, this.getEndConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.END_CONNECTOR), this._points, 1);
    } //: need to update the hit detection underlay when animating
    //a link


    if (this._hitDetectionUnderlay && this._hitDetectionUnderlay.getUnderlay() instanceof dvt.Path) {
      this._hitDetectionUnderlay.getUnderlay().setCommandsArray(this._pathCmds);
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


  dvt.BaseDiagramLink.prototype.getPoints = function () {
    return this._arPoints;
  };
  /**
   * Gets link start position
   * @return {dvt.Point} link start position
   */


  dvt.BaseDiagramLink.prototype.getLinkStart = function () {
    if (!this._points) return null;
    var x = this._points[0];
    var y = this._points[1];
    return new dvt.Point(x, y);
  };
  /**
   * Gets link end position
   * @return {dvt.Point} link end position
   */


  dvt.BaseDiagramLink.prototype.getLinkEnd = function () {
    if (!this._points) return null;
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


  dvt.BaseDiagramLink.CalcLabelMatrix = function (pos, bounds, rotAngle, rotPoint) {
    var mat = new dvt.Matrix();

    if (rotAngle != null) {
      if (rotPoint) {
        mat = mat.translate(-rotPoint.x, -rotPoint.y);
      }

      mat = mat.rotate(rotAngle);

      if (rotPoint) {
        mat = mat.translate(rotPoint.x, rotPoint.y);
      }
    }

    if (pos) {
      mat = mat.translate(pos.x, pos.y);
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


  dvt.BaseDiagramLink.PositionLabel = function (label, pos, bounds, rotAngle, rotPoint) {
    if (!label) return;
    var mat = dvt.BaseDiagramLink.CalcLabelMatrix(pos, bounds, rotAngle, rotPoint);
    label.setMatrix(mat);
  };
  /**
   * Creates link underlay - underlay for the link itself, it does not include connectors
   * @param {String} strokeColor  a css color specification for the underlay color
   * @param {String} strokeAlpha  alpha for the link underlay
   * @param {number} strokeWidthOffset offset for the stroke that is going to be added to the link width
   *                in order to create an underlay
   * @param {Object=} styleObj The optional style object to be applied to the underlay
   * @param {string=} styleClass The optional class to be applied to the underlay
   * @return {DvtDiagramLinkUnderlay} link underlay
   * @protected
   */


  dvt.BaseDiagramLink.prototype.CreateUnderlay = function (strokeColor, strokeAlpha, strokeWidthOffset, styleObj, styleClass) {
    if (!strokeAlpha && strokeAlpha != 0) {
      strokeAlpha = 1;
    }

    if (!strokeWidthOffset && strokeWidthOffset != 0) {
      strokeWidthOffset = 0;
    }

    var strokeWidth = this.GetAppliedLinkWidth() + strokeWidthOffset;
    var stroke = new dvt.Stroke(strokeColor, strokeAlpha, strokeWidth, true);
    return new DvtDiagramLinkUnderlay(this.getCtx(), this._pathCmds, stroke, styleObj, styleClass);
  };
  /**
   * Creates feedback underlay used for the hover, selection effects. The underlay includes the link and the connectors.
   * @param {String} strokeColor  a css color specification for the underlay color
   * @param {String} strokeAlpha  alpha for the link underlay
   * @param {number} strokeWidthOffset offset for the stroke that is going to be added to the link width
   *                in order to create an underlay
   * @param {Object=} styleObj The optional style object to be applied to the underlay
   * @param {string=} styleClass The optional class to be applied to the underlay
   * @return {DvtDiagramLinkUnderlay} feedback underlay used for the hover, selection effects. The underlay includes the link and the connectors
   * @protected
   */


  dvt.BaseDiagramLink.prototype.CreateFeedbackUnderlay = function (strokeColor, strokeAlpha, strokeWidthOffset, styleObj, styleClass) {
    var feedbackUnderlay = this.CreateUnderlay(strokeColor, strokeAlpha, strokeWidthOffset, styleObj, styleClass);
    if (this._startConnector && this.getStartConnectorType()) feedbackUnderlay.addUnderlayStart(this._points, this.getStartConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.START_CONNECTOR), this);
    if (this._endConnector && this.getEndConnectorType()) feedbackUnderlay.addUnderlayEnd(this._points, this.getEndConnectorType(), this.getConnectorTemplate(dvt.DiagramLinkConnectorUtils.END_CONNECTOR), this);
    return feedbackUnderlay;
  };
  /**
   * Returns a styled link stroke
   * @param {dvt.Stroke} strokeToCopy The stroke whose properties to copy from
   * @param {string} color The color of the new styled link
   * @param {number} width The width of the new styled link
   * @return {dvt.Stroke}
   * @protected
   */


  dvt.BaseDiagramLink.prototype.GetStyledLinkStroke = function (strokeToCopy, color, width) {
    var linkStyle = this.GetAppliedLinkStyle();
    var dashProps;

    if (strokeType !== 'solid') {
      dashProps = {
        dashArray: dvt.DiagramLinkUtils.GetStrokeDash(linkStyle, true),
        dashOffset: dvt.DiagramLinkUtils.GetStrokeDashOffset(linkStyle, true)
      };
    }

    var stroke = new dvt.Stroke(color, strokeToCopy.getAlpha(), width, true, dashProps);
    return stroke;
  };
  /**
   * Replaces color of a standard connector
   * @param {dvt.Container} connector link connector
   * @param {dvt.Stroke} stroke for the link connector
   */


  dvt.BaseDiagramLink.prototype.ReplaceConnectorColor = function (connector, stroke) {
    if (!connector) return;
    var color = null;
    if (stroke.getColor) color = stroke.getColor();

    if (color) {
      var conStroke = connector.getStroke();
      var conFill = connector.getFill();

      if (conStroke) {
        connector.setStroke(new dvt.Stroke(color, conStroke.getAlpha(), conStroke.getWidth(), conStroke.isFixedWidth(), conStroke.getDashProps()));
      }

      if (conFill) {
        connector.setSolidFill(color);
      }
    }
  }; // Implementation of DvtKeyboardNavigable interface

  /**
   * @override
   */


  dvt.BaseDiagramLink.prototype.getNextNavigable = function (event) {
    //subclasses should override
    return null;
  };
  /**
   * @override
   */


  dvt.BaseDiagramLink.prototype.getKeyboardBoundingBox = function (targetCoordinateSpace) {
    if (this.getGroupId() && this._diagram.getOptions()['renderer']) {
      return this._diagram.getCustomObjKeyboardBoundingBox(this);
    }

    return this.getDimensions(targetCoordinateSpace);
  };
  /**
   * @override
   */


  dvt.BaseDiagramLink.prototype.getTargetElem = function () {
    return this.getElem();
  };
  /**
   * @override
   */


  dvt.BaseDiagramLink.prototype.showKeyboardFocusEffect = function () {};
  /**
   * @override
   */


  dvt.BaseDiagramLink.prototype.hideKeyboardFocusEffect = function () {};
  /**
   * @override
   */


  dvt.BaseDiagramLink.prototype.isShowingKeyboardFocusEffect = function () {};
  /**
   * Sets a node that should be used for clockwise/counterclockwise link navigation
   * @param {dvt.BaseDiagramNode} node
   */


  dvt.BaseDiagramLink.prototype.setKeyboardFocusNode = function (node) {
    this._keyboardNavNode = node;
  };
  /**
   * Gets a node that should be used for clockwise/counterclockwise link navigation
   * @return {dvt.BaseDiagramNode} a node that should be used for clockwise/counterclockwise link navigation
   */


  dvt.BaseDiagramLink.prototype.getKeyboardFocusNode = function () {
    return this._keyboardNavNode;
  };
  /**
   * Returns an array containing all categories to which this object belongs.
   * @return {array} The array of categories.
   */


  dvt.BaseDiagramLink.prototype.getCategories = function () {
    return null;
  };
  /**
   * Sets the label alignments
   * system of the link's container.
   * label object guaranteed to be non-null if this method is called
   * @param {string} halign halign of the link label
   * @param {string} valign valign of the link label
   */


  dvt.BaseDiagramLink.prototype.setLabelAlignments = function (halign, valign) {//do nothing, only for DvtDiagramNode
  };
  /**
   * Gets group id for the link
   * @return {string} group id for the link
   */


  dvt.BaseDiagramLink.prototype.getGroupId = function () {
    return null;
  };
  /**
   * @license
   * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Dvt Diagram layout utils
   */


  dvt.DiagramLayoutUtils = {};
  dvt.Obj.createSubclass(dvt.DiagramLayoutUtils, dvt.Obj, 'dvt.DiagramLayoutUtils');
  /**
   * Converts dvt.Rectangle to dvt.DiagramRectangle
   * @param {dvt.Rectangle} rect
   * @return {dvt.DiagramRectangle}
   */

  dvt.DiagramLayoutUtils.convertRectToDiagramRect = function (rect) {
    if (rect === undefined || rect == null) return null;else return new dvt.DiagramRectangle(rect.x, rect.y, rect.w, rect.h);
  };
  /**
   * Converts dvt.Point to dvt.DiagramPoint
   * @param {dvt.Point} point
   * @return {dvt.DiagramPoint}
   */


  dvt.DiagramLayoutUtils.convertPointToDiagramPoint = function (point) {
    if (point === undefined || point == null) return null;else return new dvt.DiagramPoint(point.x, point.y);
  };
  /**
   * Converts dvt.DiagramRectangle to dvt.Rectangle
   * @param {dvt.DiagramRectangle} diagramRect
   * @return {dvt.Rectangle}
   */


  dvt.DiagramLayoutUtils.convertDiagramRectToRect = function (diagramRect) {
    if (!diagramRect) {
      return null;
    } else {
      return new dvt.Rectangle(diagramRect['x'], diagramRect['y'], diagramRect['w'], diagramRect['h']);
    }
  };
  /**
   * Converts dvt.Rectangle to dvt.Point
   * @param {dvt.DiagramPoint} diagramPoint
   * @return {dvt.Point}
   */


  dvt.DiagramLayoutUtils.convertDiagramPointToPoint = function (diagramPoint) {
    if (!diagramPoint) {
      return null;
    } else {
      return new dvt.Point(diagramPoint['x'], diagramPoint['y']);
    }
  };
  /**
   * @license
   * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @constructor
   * @class The class for the link underlay
   * @param {dvt.Context} context the rendering context
   * @param {array} points link points
   * @param {dvt.Stroke} stroke for the link underlay
   * @param {Object=} styleObj The optional style object to be applied to the underlay
   * @param {string=} styleClass The optional class to be applied to the underlay
   */


  var DvtDiagramLinkUnderlay = function DvtDiagramLinkUnderlay(context, points, stroke, styleObj, styleClass) {
    DvtDiagramLinkUnderlay.superclass.Init.call(this, context);
    this.Init(context, points, stroke, styleObj, styleClass);
  };

  dvt.Obj.createSubclass(DvtDiagramLinkUnderlay, dvt.Container, 'DvtDiagramLinkUnderlay');
  /**
   * Initialization method called by the constructor
   * @param {dvt.Context} context the rendering context
   * @param {array} points link points
   * @param {dvt.Stroke} stroke for the link underlay
   * @param {Object=} styleObj The optional style object to be applied to the underlay
   * @param {string=} styleClass The optional class to be applied to the underlay
   * @protected
   */

  DvtDiagramLinkUnderlay.prototype.Init = function (context, points, stroke, styleObj, styleClass) {
    if (!points) points = ['M', 0, 0, 'L', 1, 0];
    this._stroke = stroke;
    if (!this._stroke) this._stroke = new dvt.Stroke('#ffffff', 1, 1, true);
    this._underlay = new dvt.Path(context, points);

    this._underlay.setStroke(this._stroke);

    this._underlay.setFill(null);

    this._underlay.setStyle(styleObj).setClassName(styleClass);

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


  DvtDiagramLinkUnderlay.prototype.addUnderlayStart = function (points, connectorType, connectorTemplate, parentLink) {
    var connectorUnderlay = this.CreateConnectorUnderlay(points, connectorType, connectorTemplate, parentLink, 0);
    if (this._underlayStart) this.removeChild(this._underlayStart);
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


  DvtDiagramLinkUnderlay.prototype.addUnderlayEnd = function (points, connectorType, connectorTemplate, parentLink) {
    var connectorUnderlay = this.CreateConnectorUnderlay(points, connectorType, connectorTemplate, parentLink, 1);
    if (this._underlayEnd) this.removeChild(this._underlayEnd);
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


  DvtDiagramLinkUnderlay.prototype.CreateConnectorUnderlay = function (points, connectorType, connectorTemplate, parentLink, connectorPos) {
    // link stroke uses fixed width, but link connectors are be scalable, so reset fixed width property for the link connector stroke
    var stroke = new dvt.Stroke(this._stroke.getColor(), this._stroke.getAlpha(), this._stroke.getWidth(), false, this._stroke.getDashProps());
    var connectorUnderlay = dvt.DiagramLinkConnectorUtils.CreateConnectorShape(this.getCtx(), connectorType, connectorTemplate, stroke, parentLink);
    dvt.DiagramLinkConnectorUtils.TransformConnector(connectorUnderlay, connectorType, connectorTemplate, points, connectorPos);
    return connectorUnderlay;
  };
  /**
   * Gets underlay shape
   * @return {dvt.Path} underlay shape
   */


  DvtDiagramLinkUnderlay.prototype.getUnderlay = function () {
    return this._underlay;
  };
  /**
   * Gets underlay for the start connector
   * @return {dvt.Container} underlay for the start connector
   */


  DvtDiagramLinkUnderlay.prototype.getUnderlayStart = function () {
    return this._underlayStart;
  };
  /**
   * Gets underlay for the end connector
   * @return {dvt.Container} underlay for the end connector
   */


  DvtDiagramLinkUnderlay.prototype.getUnderlayEnd = function () {
    return this._underlayEnd;
  };
  /**
   * Sets stroke on underlays - link underlay, start and end connector underlays
   * @param {dvt.Stroke} stroke Stroke for the underlays
   * @param {number} strokeOffset the desired difference in size between the parent link width and the underlay link width
   */


  DvtDiagramLinkUnderlay.prototype.setStroke = function (stroke, strokeOffset) {
    this._stroke = stroke;

    this._underlay.setStroke(stroke);

    if (this._underlayStart) {
      var startStroke;

      if (this._underlayStartType == dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW || this._underlayStartType == dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE) {
        startStroke = new dvt.Stroke(stroke.getColor(), stroke.getAlpha(), strokeOffset);

        this._underlayStart.setSolidFill(stroke.getColor());
      } else {
        startStroke = new dvt.Stroke(stroke.getColor(), stroke.getAlpha(), stroke.getWidth());
      }

      this._underlayStart.setStroke(startStroke);
    }

    if (this._underlayEnd) {
      var endStroke;

      if (this._underlayEndType == dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW || this._underlayEndType == dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_CONCAVE) {
        endStroke = new dvt.Stroke(stroke.getColor(), stroke.getAlpha(), strokeOffset);

        this._underlayEnd.setSolidFill(stroke.getColor());
      } else {
        endStroke = new dvt.Stroke(stroke.getColor(), stroke.getAlpha(), stroke.getWidth());
      }

      this._underlayEnd.setStroke(endStroke);
    }
  };
  /**
   * Gets underlay stroke
   * @return {dvt.Stroke} underlay stroke
   */


  DvtDiagramLinkUnderlay.prototype.getStroke = function () {
    return this._stroke;
  };
  /**
   * Hides underlay start
   */


  DvtDiagramLinkUnderlay.prototype.hideUnderlayStart = function () {
    if (this._underlayStart) this.removeChild(this._underlayStart);
  };
  /**
   * Hides underlay end
   */


  DvtDiagramLinkUnderlay.prototype.hideUnderlayEnd = function () {
    if (this._underlayEnd) this.removeChild(this._underlayEnd);
  };
  /**
   * Shows underlay start
   */


  DvtDiagramLinkUnderlay.prototype.showUnderlayStart = function () {
    if (this._underlayStart) this.addChild(this._underlayStart);
  };
  /**
   * Shows underlay end
   */


  DvtDiagramLinkUnderlay.prototype.showUnderlayEnd = function () {
    if (this._underlayEnd) this.addChild(this._underlayEnd);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Dvt Diagram Link Utils
   */


  dvt.DiagramLinkUtils = {};
  dvt.Obj.createSubclass(dvt.DiagramLinkUtils, dvt.Obj, 'dvt.DiagramLinkUtils');
  /**
   * Gets dash size
   * @param {string} strokeType stroke type
   * @param {boolean} bUnderlay true for underlay stroke
   * @return {string} dash size
   * @protected
   */

  dvt.DiagramLinkUtils.GetStrokeDash = function (strokeType, bUnderlay) {
    if (strokeType == 'solid') {
      return null;
    } // For underlays, increase the dashes by 2 (1 pixel on each side) and decrease the gaps by 2 (1 pixel on each side)
    else if (strokeType === 'dash') {
        return bUnderlay ? '8,2' : '6,4';
      } else if (strokeType === 'dot') {
        return bUnderlay ? '4,1' : '2,3';
      } else if (strokeType === 'dashDot') {
        return bUnderlay ? '10,1,4,1' : '8,3,2,3';
      }
  };
  /**
   * Gets dash offset
   * @param {string} strokeType stroke type
   * @param {boolean} bUnderlay true for underlay stroke
   * @return {number} dash offset
   * @protected
   */


  dvt.DiagramLinkUtils.GetStrokeDashOffset = function (strokeType, bUnderlay) {
    if (bUnderlay && 'solid' != strokeType) {
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


  dvt.DiagramLinkUtils.getStrokeObject = function (linkStyle, bUnderlay) {
    return {
      '_type': linkStyle,
      'strokeDasharray': dvt.DiagramLinkUtils.GetStrokeDash(linkStyle, bUnderlay),
      'strokeDashoffset': dvt.DiagramLinkUtils.GetStrokeDashOffset(linkStyle, bUnderlay)
    };
  };
  /**
   * Process the strok dash array.
   * If an odd number of values is provided, then the list of values is repeated to yield an even number of values
   * @param {string} strokeDashArray stroke-dasharray attributes
   * @return {string} processed stroke dasharray
   */


  dvt.DiagramLinkUtils.processStrokeDashArray = function (strokeDashArray) {
    if (strokeDashArray) {
      var dashArray = strokeDashArray.split(/[\s,]+/); //Convert odd number of array values to even number of values by copying itself

      if (dashArray.length % 2 > 0) dashArray = dashArray.concat(dashArray);
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


  dvt.DiagramLinkUtils.getCustomUnderlay = function (strokeDashArray) {
    if (strokeDashArray) {
      var dashArray = strokeDashArray.split(/[\s,]+/);
      var stringBuf = ''; //Do the +2, -2 transformation on the resulting even length array. +2 for the dash and -2 for the dot

      for (var index = 0; index < dashArray.length; index++) {
        var item = dvt.CSSStyle.toNumber(dashArray[index].trim());
        stringBuf += index % 2 == 0 ? item + 2 : item >= 2 ? item - 2 : 0;
        if (index < dashArray.length - 1) stringBuf += ', ';
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


  dvt.DiagramLinkUtils.ConvertToPath = function (points) {
    var pathCmds = [];

    if (points) {
      for (var i = 0; i < points.length; i += 2) {
        if (i == 0) {
          pathCmds.push('M');
        } else {
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


  dvt.DiagramLinkUtils.ConvertToPoints = function (pathCmds) {
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


  dvt.DiagramLinkUtils.IsPath = function (points) {
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


  dvt.DiagramLinkUtils.GetControlPoints = function (points) {
    var controlPoints = [];
    var coords;

    if (dvt.DiagramLinkUtils.IsPath(points)) {
      coords = dvt.DiagramLinkUtils.ConvertToPoints(points);
    } else {
      coords = points;
    }

    for (var i = 0; i < coords.length; i += 2) {
      controlPoints.push(new dvt.Point(coords[i], coords[i + 1]));
    }

    return controlPoints;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

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

  dvt.DiagramLinkConnectorUtils.CreateConnectorShape = function (context, connectorType, connectorTemplate, stroke, parentLink) {
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


  dvt.DiagramLinkConnectorUtils.TransformConnector = function (connector, connectorType, connectorTemplate, points, connectorPos) {
    var mat = dvt.DiagramLinkConnectorUtils.CalcConnectorTransform(connector, connectorType, connectorTemplate, points, connectorPos);
    connector.setMatrix(mat);
  };
  /**
   * @protected
   */


  dvt.DiagramLinkConnectorUtils.CalcConnectorTransform = function (connector, connectorType, connectorTemplate, points, connectorPos) {
    var x1 = -1;
    var y1 = 0;
    var x2 = 0;
    var y2 = 0;

    if (!points) {} else {
      var numPoints = points.length;

      if (connectorPos === 1) {
        //make sure the array is long enough
        if (numPoints >= 2) {
          x2 = points[numPoints - 2];
          y2 = points[numPoints - 1];
        }

        if (numPoints >= 4) {
          x1 = points[numPoints - 4];
          y1 = points[numPoints - 3];
        } else {
          x1 = x2 - .0001;
          y1 = y2;
        }
      } else //if (connectorPos === 0)
        {
          //make sure the array is long enough
          if (numPoints >= 2) {
            x2 = points[0];
            y2 = points[1];
          }

          if (numPoints >= 4) {
            x1 = points[2];
            y1 = points[3];
          } else {
            x1 = x2 + .0001;
            y1 = y2;
          }
        }
    }

    var tx = x2;
    var ty = y2;
    var angleRads = dvt.DiagramLinkConnectorUtils.CalcConnectorRotation(x1, y1, x2, y2);
    var origMat = connector._connectorOrigMat;

    if (!origMat) {
      origMat = connector.getMatrix();
      connector._connectorOrigMat = origMat;
    }

    var tMat = new dvt.Matrix(); // 1) translate custom connector so that origin is at center, where link will
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
      tMat = tMat.translate(offsetX, offsetY);
    }

    tMat = tMat.rotate(angleRads);
    tMat = tMat.translate(tx, ty);
    return tMat.concat(origMat);
  };

  dvt.DiagramLinkConnectorUtils._getCachedDims = function (connector) {
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


  dvt.DiagramLinkConnectorUtils.CalcConnectorRotation = function (x1, y1, x2, y2) {
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


  dvt.DiagramLinkConnectorUtils.CreateFilledConcaveArrowConnector = function (context, linkWidth, linkColor) {
    var scaleFactor = dvt.DiagramLinkConnectorUtils._getReduce(linkWidth, .5);

    var arrowLength = scaleFactor * 6;
    var arrowWidth = arrowLength * .8;
    var points = [-.22 * arrowLength, -.5 * arrowWidth, .78 * arrowLength, 0, -.22 * arrowLength, .5 * arrowWidth, 0, 0];
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


  dvt.DiagramLinkConnectorUtils.CreateFilledArrowConnector = function (context, linkWidth, linkColor) {
    var scaleFactor = dvt.DiagramLinkConnectorUtils._getReduce(linkWidth, .5);

    var arrowLength = scaleFactor * 5;
    var arrowWidth = arrowLength * .8;
    var points = [0, -.5 * arrowWidth, arrowLength, 0, 0, .5 * arrowWidth];
    var filledArrowHead = new dvt.Polygon(context, points);
    filledArrowHead.setSolidFill(linkColor);
    return filledArrowHead;
  }; //
  // Function to size the arrow head non-linearly
  //

  /**
   * @protected
   */


  dvt.DiagramLinkConnectorUtils._getReduce = function (length, fract) {
    if (length <= 1) return length;
    var tempLength = length - 1;
    tempLength *= fract;
    return 1 + tempLength;
  }; //
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


  dvt.DiagramLinkConnectorUtils.CreateOpenArrowConnector = function (context, linkWidth, stroke) {
    var arrowWidth = linkWidth * 3;
    var strokeWidth = stroke.getWidth();
    var points = [-arrowWidth + strokeWidth * Math.sqrt(2) / 2, -arrowWidth, strokeWidth * Math.sqrt(2) / 2, 0, -arrowWidth + strokeWidth * Math.sqrt(2) / 2, arrowWidth];
    var arrowHead = new dvt.Polyline(context, points);
    arrowHead.setStroke(stroke);
    arrowHead.setFill(null);
    return arrowHead;
  };
  /**
   * @protected
   */


  dvt.DiagramLinkConnectorUtils.getCircleRadius = function (linkWidth) {
    var radius = linkWidth * 2;
    return radius;
  };

  dvt.DiagramLinkConnectorUtils.getRectangleLength = function (linkWidth) {
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


  dvt.DiagramLinkConnectorUtils.CreateCircleConnector = function (context, linkWidth, stroke) {
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


  dvt.DiagramLinkConnectorUtils.CreateRectangleConnector = function (context, linkWidth, stroke) {
    var length = dvt.DiagramLinkConnectorUtils.getRectangleLength(linkWidth);
    var conShape = new dvt.Rect(context, 0, -length / 2, length, length);
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


  dvt.DiagramLinkConnectorUtils.CreateRoundedRectangleConnector = function (context, linkWidth, stroke) {
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


  dvt.DiagramLinkConnectorUtils.CreateCustomConnector = function (context, connectorTemplate, parentLink) {
    var afContext = parentLink.GetDiagram().createAfContext();
    afContext.setELContext(parentLink.getData().getElAttributes()); // add action listener to the command objects in the link

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


  dvt.DiagramLinkConnectorUtils.GetConnectorOffset = function (connector, connectorType, connectorTemplate, stroke, parentLink) {
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


  dvt.DiagramLinkConnectorUtils.getStandardConnectorOffset = function (connectorType, linkWidth, strokeWidth) {
    switch (connectorType) {
      case dvt.DiagramLinkConnectorUtils.CONNECTOR_TYPE_ARROW_OPEN:
        return strokeWidth * Math.sqrt(2);

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
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

})(dvt);

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
(function (dvt) {
  /**
   * @license
   * Copyright (c) 2017 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */
  //
  // $Header: dsstools/modules/dvt-shared-js/src/META-INF/bi/sharedJS/toolkit/diagram/DvtDiagramStyleUtils.js /st_jdevadf_jet.trunk/4 2017/09/08 16:48:23  Exp $
  //
  // DvtDiagramStyleUtils.js
  //
  //
  //    NAME
  //     DvtDiagramStyleUtils.js - <one-line expansion of the name>
  //
  //    DESCRIPTION
  //     <short description of component this file declares/defines>
  //
  //    NOTES
  //     <other useful comments, qualifications, etc. >
  //
  //    MODIFIED  (MM/DD/YY)
  //       04/28/17 - Created
  //

  /**
   * Style related utility functions for dvt.Diagram.
   * @class
   */
  var DvtDiagramStyleUtils = new Object();
  dvt.Obj.createSubclass(DvtDiagramStyleUtils, dvt.Obj);
  /**
   * If the option node style attribute is a string, converts it to object
   * @param {object} optionsObject  node options object
   * @param {string} attribute  node attribute
   */

  DvtDiagramStyleUtils.prepareNodeStyle = function (optionsObject, attribute) {
    if (optionsObject && optionsObject[attribute] != null && !(optionsObject[attribute] instanceof Object)) {
      optionsObject[attribute] = dvt.CSSStyle.cssStringToObject(optionsObject[attribute]);
    }
  };
  /**
   * If the option style attribute is a string, converts it to link style object
   * @param {object} optionsObject  link options object
   * @param {string} attribute  link style attribute
   */


  DvtDiagramStyleUtils.prepareLinkStyle = function (optionsObject, attribute) {
    //The link style attribute can be string or object.
    if (optionsObject && optionsObject[attribute] != null) {
      //The style object represents the CSS style of the link.
      if (optionsObject[attribute] instanceof Object) {
        if (optionsObject[attribute]['_type'] == null) optionsObject[attribute]['_type'] = DvtDiagramLink.CUSTOM_STYLE;
      } else {
        //The style string represents Link style type with following values: solid, dash, dot, dashDot.
        //convert style string to equivalent style object
        optionsObject[attribute] = dvt.DiagramLinkUtils.getStrokeObject(optionsObject[attribute]);
      }
    }
  };
  /**
   * Returns default styles for the diagram nodes
   * @param {dvt.Diagram} comp the diagram
   * @return {object} default style object for the nodes
   */


  DvtDiagramStyleUtils.getNodeDefaultStyles = function (comp) {
    var nodeDefaults = comp.getOptions()['styleDefaults']['nodeDefaults']; //If default background/container style is specified in options nodeDefaults, make sure it is an object
    //Note: don't need to convert 'backgroundSvgStyle' and 'containerSvgStyle', since those properties
    //do not support string values

    DvtDiagramStyleUtils.prepareNodeStyle(nodeDefaults, 'backgroundStyle');
    DvtDiagramStyleUtils.prepareNodeStyle(nodeDefaults, 'containerStyle');
    return nodeDefaults;
  };
  /**
   * Gets the node option object for the given node data.
   * Merges the default node properties with properties for the specific node
   * @param {dvt.Diagram} comp the diagram
   * @param {object} nodeData node data
   * @param {object} nodeDefaults default styles for the diagarm nodes
   * @return {object} node data object with applied styles
   */


  DvtDiagramStyleUtils.getNodeStyles = function (comp, nodeData, nodeDefaults) {
    if (comp.isDataProviderMode()) {
      return dvt.JsonUtils.merge(nodeData, nodeDefaults, {
        '_itemData': true,
        'id': true,
        'nodes': true
      });
    }

    var convertedNodeData = DvtDiagramNode.ConvertNodeData(nodeData);

    if (comp.getOptions()['nodeProperties']) {
      var styleProps = dvt.JsonUtils.clone(comp.getOptions()['nodeProperties'](nodeData)); //If background/container style is specified in nodeData, make sure it is an object before merging

      DvtDiagramStyleUtils.prepareNodeStyle(styleProps, 'backgroundStyle');
      DvtDiagramStyleUtils.prepareNodeStyle(styleProps, 'containerStyle');
      convertedNodeData = dvt.JsonUtils.merge(convertedNodeData, styleProps, {
        '_itemData': true
      });
    }

    return dvt.JsonUtils.merge(convertedNodeData, nodeDefaults, {
      '_itemData': true
    });
  };
  /**
   * Returns default styles for the diagram links or promoted links
   * @param {dvt.Diagram} comp the diagram
   * @param {string} option option to retrieve - 'linkDefaults' or 'promotedLinks'
   * @return {object} default style object for the specified type of links
   */


  DvtDiagramStyleUtils.getLinkDefaultStyles = function (comp, option) {
    var linkDefaults = comp.getOptions()['styleDefaults'][option]; //If linkDefaults has style attribute, make sure it is an object

    DvtDiagramStyleUtils.prepareLinkStyle(linkDefaults, 'style'); //Merge the link default style from options with the link default style from Diagram style defaults

    var attr = comp.getCtx().isCustomElement() ? 'svgStyle' : 'style';
    linkDefaults[attr] = dvt.JsonUtils.merge(linkDefaults[attr], linkDefaults['_style']);

    if (comp.getCtx().isCustomElement()) {
      ['_type'].forEach(function (entry) {
        delete linkDefaults[attr][entry];
      });
    }

    return linkDefaults;
  };
  /**
   * Gets the link option object for the given link data.
   * Merges the default link properties with properties for the specific link
   * @param {dvt.Diagram} comp the diagram
   * @param {object} linkData link data
   * @param {object} linkDefaults default styles for the diagarm links
   * @return {object} link data object with applied styles
   */


  DvtDiagramStyleUtils.getLinkStyles = function (comp, linkData, linkDefaults) {
    if (comp.isDataProviderMode()) {
      return dvt.JsonUtils.merge(linkData, linkDefaults, {
        '_itemData': true,
        'id': true
      });
    }

    var convertedLinkData = DvtDiagramLink.ConvertLinkData(linkData);

    if (comp.getOptions()['linkProperties']) {
      var styleProps = dvt.JsonUtils.clone(comp.getOptions()['linkProperties'](linkData)); //If linkData has style attribute, make sure it is an object

      DvtDiagramStyleUtils.prepareLinkStyle(styleProps, 'style');
      convertedLinkData = dvt.JsonUtils.merge(convertedLinkData, styleProps, {
        '_itemData': true
      });
    }

    return dvt.JsonUtils.merge(convertedLinkData, linkDefaults, {
      '_itemData': true
    });
  };
  /**
   * Returns the animation duration in seconds for the specified diagram.  This duration is
   * intended to be passed to the animation handler, and is not in the same units
   * as the API.
   * @param {dvt.Diagram} diagram
   * @return {number} The animation duration in seconds.
   */


  DvtDiagramStyleUtils.getAnimationDuration = function (diagram) {
    return dvt.CSSStyle.getTimeMilliseconds(diagram.getOptions()['styleDefaults']['animationDuration']) / 1000;
  };
  /**
   * Returns the display animation for the specified diagram.
   * @param {dvt.Diagram} diagram
   * @return {string}
   */


  DvtDiagramStyleUtils.getAnimationOnDisplay = function (diagram) {
    return diagram.getOptions()['animationOnDisplay'];
  };
  /**
   * Returns the data change animation for the specified diagram.
   * @param {dvt.Diagram} diagram
   * @return {string}
   */


  DvtDiagramStyleUtils.getAnimationOnDataChange = function (diagram) {
    return diagram.getOptions()['animationOnDataChange'];
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Style related utility functions for dvt.Diagram.
   * @class
   */


  var DvtDiagramDataUtils = new Object();
  dvt.Obj.createSubclass(DvtDiagramDataUtils, dvt.Obj);
  /**
   * @protected
   * Retrieves a list of collapsed containers that should be searched for promoted link
   * Used in DataProvider mode.
   * @param {object} rootDataProvider Root data provider object
   * @param {array} nodesArray array of nodes to search
   * @return {array} array of containers to search
   */

  DvtDiagramDataUtils.GetCollapsedContainers = function (rootDataProvider, nodesArray) {
    var collapsedContainers = [];

    while (nodesArray.length > 0) {
      var node = nodesArray.shift();

      if (node['nodes']) {
        node['nodes'].forEach(function (childNode) {
          nodesArray.push(childNode);
        });
      } else {
        var childDataProvider = rootDataProvider.getChildDataProvider(node['id']);
        var isEmpty = childDataProvider ? childDataProvider.isEmpty() === 'yes' : true;

        if (!isEmpty && node['descendantsConnectivity'] !== 'disjoint') {
          collapsedContainers.push(node);
        }
      }
    }

    return collapsedContainers;
  };
  /**
   * @protected
   * Retrieve node option using child node instance.
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramNode} node node instance
   * @return {object} node option
   */


  DvtDiagramDataUtils.GetNodeOption = function (comp, node) {
    // build path from child node to root node
    var path = [node.getId()];

    while (node && node.getGroupId()) {
      var groupId = node.getGroupId();
      path.push(groupId);
      node = comp.getNodeById(groupId);
    } // find node option using generated path


    var testId = path.pop();
    var options = [comp.getOptions()];
    var context = comp.getCtx();

    while (testId && options[0].nodes) {
      options = options[0].nodes.filter(function (item) {
        return dvt.BaseDiagram.compareValues(context, item.id, testId);
      });
      testId = path.pop();
    }

    return options[0];
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Utility functions for dvt.Diagram overview window
   * @class
   */


  var DvtDiagramOverviewUtils = {};
  dvt.Obj.createSubclass(DvtDiagramOverviewUtils, dvt.Obj, 'DvtDiagramOverviewUtils');
  /**
   * @protected
   * Calculates the overview window viewport from a pan zoom canvas matrix
   * @param {dvt.Diagram} diagram the parent diagram component
   */

  DvtDiagramOverviewUtils.CalcViewportFromMatrix = function (diagram) {
    var contentMatrix = diagram.getPanZoomCanvas().getContentPaneMatrix();
    var defViewport = new dvt.Rectangle(0, 0, diagram.getWidth(), diagram.getHeight());
    var dx = contentMatrix.getTx();
    var dy = contentMatrix.getTy();
    var dz = contentMatrix.getA();
    var newX = defViewport.x - dx / dz;
    var newY = defViewport.y - dy / dz;
    var newWidth = defViewport.w / dz;
    var newHeight = defViewport.h / dz;
    var adjViewport = new dvt.Rectangle(newX, newY, newWidth, newHeight);
    return adjViewport;
  };
  /**
   * @protected
   * Creates the overview window instance for the diagram
   * @param {dvt.Diagram} diagram the parent diagram component
   * @return {dvt.Overview} the overview window
   */


  DvtDiagramOverviewUtils.CreateOverviewWindow = function (diagram) {
    var ovContainer = new dvt.Container(diagram.getCtx());
    var overview = new DvtDiagramOverview(diagram);
    ovContainer.addChild(overview);
    diagram.addChild(ovContainer);
    overview.render();

    DvtDiagramOverviewUtils._positionOverviewWindow(diagram, overview);

    var ovWidth = overview.getOverviewWidth();
    var ovHeight = overview.getOverviewHeight();
    var clipPath = new dvt.ClipPath(diagram.getId() + 'dgr_ovClip'); // give clip path an extra space

    clipPath.addRect(overview.getTranslateX() - 1, overview.getTranslateY() - 1, ovWidth + 2, ovHeight + 2);
    overview.setClipPath(clipPath);
    overview.UpdateViewport(); // place a rectangle on top of the overview window to show overview boundaries,
    // when viewport is larger than overview

    var styleMap = diagram.Options.styleDefaults._overviewStyles;
    var topRect = new dvt.Rect(diagram.getCtx(), 0, 0, ovWidth, ovHeight);
    topRect.setInvisibleFill();
    topRect.setStroke(new dvt.Stroke(styleMap.overview.backgroundColor, 1, 1));
    topRect.setMouseEnabled(false);
    ovContainer.addChild(topRect);
    return overview;
  };
  /**
   * @protected
   * Creates content for the overview window based on the current state of the diagram
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   * @param {number} width overview width
   * @param {number} height overview height
   * @return {dvt.Container} content for the overview window
   */


  DvtDiagramOverviewUtils.CreateOverviewContent = function (diagram, overview, width, height) {
    var ovContent = new dvt.Container(diagram.getCtx());
    ovContent.setMouseEnabled(false);
    overview.Nodes = new (diagram.getCtx().ojMap)();
    var rootNodes = diagram.GetRootNodeObjects();

    if (rootNodes.length > 0) {
      rootNodes.forEach(function (node) {
        DvtDiagramOverviewUtils.CreateOverviewNode(diagram, overview, node, ovContent);
      });
      DvtDiagramOverviewUtils.ZoomToFitOverviewContent(diagram, overview, ovContent, width, height);
    }

    return ovContent;
  };
  /**
   * @protected
   * Creates overview node
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   * @param {DvtDiagramNode} node the diagram node object that has to be shown in the overview
   * @param {dvt.Container} container container to attach the node
   */


  DvtDiagramOverviewUtils.CreateOverviewNode = function (diagram, overview, node, container) {
    if (!node) return;

    var ovNode = DvtDiagramOverviewUtils._createOverviewNodeShape(diagram, node);

    DvtDiagramOverviewUtils._positionOverviewNode(node, ovNode);

    overview.Nodes.set(node.getId(), ovNode);
    container.addChild(ovNode);

    if (node.isDisclosed()) {
      ovNode._ovChildNodePane = new dvt.Container(diagram.getCtx());
      ovNode.addChild(ovNode._ovChildNodePane);
      var cp = node.getContainerPadding();

      ovNode._ovChildNodePane.setTranslate(cp.left, cp.top);

      node.getChildNodeIds().forEach(function (childId) {
        var childNode = diagram.getNodeById(childId);
        DvtDiagramOverviewUtils.CreateOverviewNode(diagram, overview, childNode, ovNode._ovChildNodePane);
      });
    }
  };
  /**
   * @protected
   * Removes the overview window from the diagram.
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   */


  DvtDiagramOverviewUtils.RemoveOverviewWindow = function (diagram, overview) {
    if (overview) {
      overview.setClipPath(null);
      var ovContainer = overview.getParent();
      diagram.removeChild(ovContainer);
    }
  };
  /**
   * @protected
   * Updates the overview window instance for the diagram:
   *           window position, nodes positions, clip path
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   */


  DvtDiagramOverviewUtils.UpdateOverviewWindow = function (diagram, overview) {
    DvtDiagramOverviewUtils._positionOverviewWindow(diagram, overview);

    DvtDiagramOverviewUtils._updateOverviewNodes(diagram, overview);

    if (overview.Nodes.size > 0) DvtDiagramOverviewUtils.ZoomToFitOverviewContent(diagram, overview, overview.Content, overview.Width, overview.Height);
    overview.UpdateViewport();
    var ovWidth = overview.getOverviewWidth();
    var ovHeight = overview.getOverviewHeight(); //update clip path

    overview.setClipPath(null);
    var clipPath = new dvt.ClipPath(diagram.getId() + 'dgr_ovClip'); //give clip path an extra space

    clipPath.addRect(overview.getTranslateX() - 1, overview.getTranslateY() - 1, ovWidth + 2, ovHeight + 2);
    overview.setClipPath(clipPath); // update top rectangle

    var ovContainer = overview.getParent();
    var topRect = ovContainer.getChildIndex(1);

    if (topRect instanceof dvt.Rect) {
      topRect.setWidth(ovWidth);
      topRect.setHeight(ovHeight);
    }
  };
  /**
   * @protected
   * Updates diagram content. Used for partial updates
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   * @param {string} type event type
   * @param {object} event event object
   */


  DvtDiagramOverviewUtils.UpdateOverviewContent = function (diagram, overview, type, event) {
    var eventNodes = event['data']['nodes'];
    if (!eventNodes || eventNodes.length === 0) return;
    var parentId = event['parentId'];
    var parentNode = parentId ? diagram.getNodeById(parentId) : null;
    var nodesToUpdate = [];

    if (type == 'add') {
      //When adding child nodes from container,
      //find root parent and update the subtree.
      if (parentNode) {
        var rootNode = DvtDiagramOverviewUtils._findRootNode(diagram, parentNode);

        DvtDiagramOverviewUtils._removeNode(diagram, overview, rootNode.getId());

        nodesToUpdate.push(rootNode);
      } else {
        eventNodes.forEach(function (nodeData) {
          nodesToUpdate.push(diagram.getNodeById(nodeData.id));
        });
      }
    } else if (type == 'change') {
      // find all roots to update
      // rerender starting with roots
      var roots = new (diagram.getCtx().ojMap)();
      eventNodes.forEach(function (nodeData) {
        var rootNode = DvtDiagramOverviewUtils._findRootNode(diagram, diagram.getNodeById(nodeData.id));

        if (rootNode) roots.set(rootNode.getId(), rootNode);
      });
      roots.forEach(function (root, nodeId, map) {
        DvtDiagramOverviewUtils._removeNode(diagram, overview, nodeId);

        nodesToUpdate.push(root);
      });
    } else if (type == 'remove') {
      //When removing child nodes from container,
      //find root parent and update the subtree
      if (parentNode) {
        var rootNode = DvtDiagramOverviewUtils._findRootNode(diagram, parentNode);

        DvtDiagramOverviewUtils._removeNode(diagram, overview, rootNode.getId());

        nodesToUpdate.push(rootNode);
      } else {
        //remove nodes
        eventNodes.forEach(function (nodeData) {
          DvtDiagramOverviewUtils._removeNode(diagram, overview, nodeData.id);
        });
      }
    }

    nodesToUpdate.forEach(function (node) {
      // rerender each node
      DvtDiagramOverviewUtils.CreateOverviewNode(diagram, overview, node, overview.Content);
    });
  };
  /**
   * @protected
   * Transforms a point from diagram content to viewport coordinates
   * @param {number} cx content x position
   * @param {number} cy content y position
   * @param {dvt.Container} content overview content
   * @return {dvt.Point} point in viewport coordinates
   */


  DvtDiagramOverviewUtils.TransformFromContentToViewportCoords = function (cx, cy, content) {
    var tx = content.getTranslateX();
    var ty = content.getTranslateY();
    var sx = content.getScaleX();
    var sy = content.getScaleY();
    var vx = cx * sx + tx;
    var vy = cy * sy + ty;
    return new dvt.Point(vx, vy);
  };
  /**
   * @protected
   * Transforms a point from overview viewport to diagram content coordinates
   * @param {number} vx viewport x position
   * @param {number} vy viewport y position
   * @param {dvt.Container} content overview content
   * @return {dvt.Point} point in content coordinates
   */


  DvtDiagramOverviewUtils.TransformFromViewportToContentCoords = function (vx, vy, content) {
    var tx = content.getTranslateX();
    var ty = content.getTranslateY();
    var sx = content.getScaleX();
    var sy = content.getScaleY();
    var cx = (vx - tx) / sx;
    var cy = (vy - ty) / sy;
    return new dvt.Point(cx, cy);
  };
  /**
   * @protected
   * Zooms to fit diagram content into the overview window
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview window
   * @param {dvt.Container} ovContent overview window content
   * @param {number} width overview width
   * @param {number} height overview height
   */


  DvtDiagramOverviewUtils.ZoomToFitOverviewContent = function (diagram, overview, ovContent, width, height) {
    var diagram = overview.Diagram;
    var fitBounds = overview.Diagram._cachedViewBounds;
    var dims = fitBounds ? fitBounds : diagram.GetViewBounds();

    var dz = DvtDiagramOverviewUtils._calcOverviewScale(diagram, dims, width, height);

    ovContent.setScale(dz, dz);
    var tx = (width - dims.w * dz) / 2 - dims.x * dz;
    var ty = (height - dims.h * dz) / 2 - dims.y * dz;
    ovContent.setTranslate(tx, ty);
  };
  /**
   * @private
   * Calculates scale for the overview content
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {object} ztfBounds zoom-to-fit dimensions for the diagram content
   * @param {number} width overview width
   * @param {number} height overview height
   */


  DvtDiagramOverviewUtils._calcOverviewScale = function (diagram, ztfBounds, width, height) {
    var cw = width - 20; //use 10px padding for the content from each side

    var ch = height - 20; //use 10px padding for the content from each side

    var dzx = cw / ztfBounds.w;
    var dzy = ch / ztfBounds.h;
    var dz = Math.min(dzx, dzy);
    return dz;
  };
  /**
   * @private
   * Creates overview node shape for the given diagram node
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramNode} node the diagram node object that has to be shown in the overview
   * @return {dvt.SimpleMarker} a marker that represents a diagram node in the overview
   */


  DvtDiagramOverviewUtils._createOverviewNodeShape = function (diagram, node) {
    var ovIconData = diagram.Options.styleDefaults._overviewStyles.node;
    if (node.getData()['overview']) ovIconData = dvt.JsonUtils.merge(node.getData()['overview']['icon'], ovIconData); // determine node shape using the following rules:
    // - the container shape is always 'rectangle'
    // - custom node with 'inherit' shape turns into 'rectangle', otherwise it can use built-in shape/svg path
    // - standard node can either 'inherit' the shape from main node or use specified built-in shape/svg path

    var iconShape = ovIconData['shape'];

    if (node.isDisclosed() || diagram.Options.renderer && iconShape == 'inherit') {
      iconShape = 'rectangle';
    } else if (iconShape == 'inherit') {
      iconShape = node.getData()['icon']['shape'];
    }

    var dims = node.getLayoutBounds();
    var iconWidth = dims.w;
    var iconHeight = dims.h;
    var ovNode = new dvt.SimpleMarker(diagram.getCtx(), iconShape, iconWidth / 2, iconHeight / 2, iconWidth, iconHeight, 0); //apply styles - svg style and class names

    var className = node.isDisclosed() ? 'oj-diagram-overview-container-node' : 'oj-diagram-overview-node';
    if (ovIconData['svgClassName']) className += ' ' + ovIconData['svgClassName'];
    ovNode.setStyle(ovIconData['svgStyle']).setClassName(className);
    return ovNode;
  };
  /**
   * @private
   * Finds a root node for the given diagram node. Used for partial updates
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramNode} node a diagram node
   * @return {DvtDiagramNode} root node for the given diagram node
   */


  DvtDiagramOverviewUtils._findRootNode = function (diagram, node) {
    var rootNode = node;
    var groupId = node ? node.getGroupId() : null;

    while (groupId) {
      rootNode = diagram.getNodeById(groupId) ? diagram.getNodeById(groupId) : rootNode;
      groupId = rootNode.getGroupId();
    }

    return rootNode;
  };
  /**
   * @private
   * Positions overview node based on postion of the diagram node
   * @param {DvtDiagramNode} node diagram node
   * @param {dvt.SimpleMarker} ovNode overview node
   */


  DvtDiagramOverviewUtils._positionOverviewNode = function (node, ovNode) {
    var tx = node.getTranslateX();
    var ty = node.getTranslateY();
    ovNode.setTranslate(tx, ty);
  };
  /**
   * @private
   * Positions overview window within the component
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   */


  DvtDiagramOverviewUtils._positionOverviewWindow = function (diagram, overview) {
    var halign = diagram.Options['overview']['halign'];
    var valign = diagram.Options['overview']['valign'];
    var padding = dvt.CSSStyle.toNumber(diagram.Options.styleDefaults._overviewStyles.overview.padding);
    var overviewWidth = overview.getOverviewWidth();
    var overviewHeight = overview.getOverviewHeight();
    var availableWidth = diagram.Width;
    var availableHeight = diagram.Height;

    switch (halign) {
      case 'start':
        halign = dvt.Agent.isRightToLeft(diagram.getCtx()) ? 'right' : 'left';
        break;

      case 'end':
        halign = dvt.Agent.isRightToLeft(diagram.getCtx()) ? 'left' : 'right';
        break;

      default:
        break;
    }

    var positionX = halign == 'center' ? (availableWidth - overviewWidth) / 2 : halign == 'right' ? availableWidth - overviewWidth - padding : padding;
    var positionY = valign == 'middle' ? (availableHeight - overviewHeight) / 2 : valign == 'bottom' ? availableHeight - overviewHeight - padding : padding;
    var ovContainer = overview.getParent();
    ovContainer.setTranslate(positionX, positionY);
  };
  /**
   * @private
   * Removes overview node if exists. Used for partual updates
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   * @param {string} nodeId the node id
   */


  DvtDiagramOverviewUtils._removeNode = function (diagram, overview, nodeId) {
    var ovNode = overview.Nodes.get(nodeId);
    if (ovNode) ovNode.getParent().removeChild(ovNode);
  };
  /**
   * @private
   * Updates positions of the overview nodes
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   */


  DvtDiagramOverviewUtils._updateOverviewNodes = function (diagram, overview) {
    overview.Nodes.forEach(function (ovNode, nodeId, map) {
      var node = diagram.getNodeById(nodeId);

      if (node && ovNode) {
        DvtDiagramOverviewUtils._positionOverviewNode(node, ovNode);
      } else if (ovNode && !node) {
        // node could be removed by partial update
        // it should be already removed from DOM
        // now just remove the reference to it
        overview.Nodes.delete(nodeId);
      }
    });
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Overview window for diagram.
   * @param {dvt.Diagram} diagram The parent diagram who owns the overview.
   * @class
   * @constructor
   * @extends {dvt.Overview}
   */


  var DvtDiagramOverview = function DvtDiagramOverview(diagram) {
    this.Init(diagram.getCtx(), diagram.processEvent, diagram);
    this.Diagram = diagram;
    this._id = diagram.getId() + '_overview';
  };

  dvt.Obj.createSubclass(DvtDiagramOverview, dvt.Overview);
  /**
   * Creates diagram content
   * @override
   */

  DvtDiagramOverview.prototype.renderData = function (width, height) {
    this.Content = DvtDiagramOverviewUtils.CreateOverviewContent(this.Diagram, this, width, height);
    this.addChild(this.Content);
    this.Content.setMouseEnabled(false);
  };
  /**
   * Override to change styles, interation and update viewport
   * @override
   */


  DvtDiagramOverview.prototype.render = function () {
    var width = Math.min(this.Diagram.Width, this.Diagram.Options.overview.width);
    var height = Math.min(this.Diagram.Height, this.Diagram.Options.overview.height);
    var styleMap = this.Diagram.Options.styleDefaults._overviewStyles;
    var options = {
      'xMin': 0,
      'xMax': width,
      'yMin': 0,
      'yMax': height,
      'x1': 0,
      'x2': width,
      'y1': 0,
      'y2': height,
      'style': {
        'overviewBackgroundColor': styleMap.overview.backgroundColor,
        'windowBackgroundColor': styleMap.viewport.backgroundColor,
        'windowBorderTopColor': styleMap.viewport.borderColor,
        'windowBorderRightColor': styleMap.viewport.borderColor,
        'windowBorderBottomColor': styleMap.viewport.borderColor,
        'windowBorderLeftColor': styleMap.viewport.borderColor,
        'timeAxisBarColor': '#00000000' // render time axis bar invisible - diagram does not need it

      },
      'animationOnClick': 'off',
      'featuresOff': 'zoom'
    };
    var isEmpty = this.Diagram.GetAllRoots().length === 0 ? true : false;
    this._viewportConstraints = {
      xMin: isEmpty ? 0 : -Number.MAX_VALUE,
      yMin: isEmpty ? 0 : -Number.MAX_VALUE,
      xMax: isEmpty ? width : Number.MAX_VALUE,
      yMax: isEmpty ? height : Number.MAX_VALUE
    };

    if (!this.Diagram.IsPanningEnabled()) {
      this.setMouseEnabled(false);
    } // now call super to render the scrollbar


    DvtDiagramOverview.superclass.render.call(this, options, width, height);
  };
  /**
   * @override
   */


  DvtDiagramOverview.prototype.animateUpdate = function (animationHandler, oldDiagramOverview) {
    // animate content  - fade in/out and matrix
    this.Content.setAlpha(0);
    animationHandler.add(new dvt.AnimFadeIn(this.getCtx(), this.Content, animationHandler.getAnimationDuration()), DvtDiagramDataAnimationHandler.UPDATE);
    var idx = this.getChildIndex(this.Content);
    this.addChildAt(oldDiagramOverview.Content, idx + 1);

    var removeFunc = function removeFunc() {
      oldDiagramOverview.Content.getParent().removeChild(oldDiagramOverview.Content);
    };

    var fadeOutAnim = new dvt.AnimFadeOut(this.getCtx(), oldDiagramOverview.Content, animationHandler.getAnimationDuration());
    dvt.Playable.appendOnEnd(fadeOutAnim, removeFunc);
    animationHandler.add(fadeOutAnim, DvtDiagramDataAnimationHandler.UPDATE); //animate viewport

    var customContentAnim = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());
    var oldAnimationParams = oldDiagramOverview.GetAnimationParams();
    var newAnimationParams = this.GetAnimationParams();
    this.SetAnimationParams(oldAnimationParams);
    customContentAnim.getAnimator().addProp(dvt.Animator.TYPE_NUMBER_ARRAY, this, this.GetAnimationParams, this.SetAnimationParams, newAnimationParams);
    animationHandler.add(customContentAnim, DvtDiagramDataAnimationHandler.UPDATE);
  };
  /**
   * Updates panning constraints for the overview viewport using panning constraints for the main diagram
   * @param {number} minPanX min x coordinate for the diagram content
   * @param {number} minPanY min y coordinate for the diagram content
   * @param {number} maxPanX max x coordinate for the diagram content
   * @param {number} maxPanY max y coordinate for the diagram content
   */


  DvtDiagramOverview.prototype.updateConstraints = function (minPanX, minPanY, maxPanX, maxPanY) {
    var zoom = this.Diagram.getPanZoomCanvas().getZoom(); // maxPanX/maxPanY: bottom right point for the content with zoom adjustment corresponds to top left point in overview viewport
    // minPanX,minPanY: top left point for the content with zoom adjustment corresponds to bottom right point in overview viewport

    var topLeft = DvtDiagramOverviewUtils.TransformFromContentToViewportCoords(-maxPanX / zoom, -maxPanY / zoom, this.Content);
    var bottomRight = DvtDiagramOverviewUtils.TransformFromContentToViewportCoords(-minPanX / zoom, -minPanY / zoom, this.Content);
    var width = this._viewportPosition.x2 - this._viewportPosition.x1;
    var height = this._viewportPosition.y2 - this._viewportPosition.y1;
    var panDirection = this.Diagram.getPanDirection();
    this._viewportConstraints = {
      xMin: panDirection === 'y' ? this._viewportPosition.x1 : topLeft.x,
      xMax: panDirection === 'y' ? this._viewportPosition.x2 : bottomRight.x + width,
      yMin: panDirection === 'x' ? this._viewportPosition.y1 : topLeft.y,
      yMax: panDirection === 'x' ? this._viewportPosition.y2 : bottomRight.y + height
    };
  };
  /**
   * @override
   */


  DvtDiagramOverview.prototype.getMinimumPositionX = function () {
    return this._viewportConstraints.xMin;
  };
  /**
   * @override
   */


  DvtDiagramOverview.prototype.getMinimumPositionY = function () {
    return this._viewportConstraints.yMin;
  };
  /**
   * @override
   */


  DvtDiagramOverview.prototype.getMaximumPositionX = function () {
    return this._viewportConstraints.xMax;
  };
  /**
   * @override
   */


  DvtDiagramOverview.prototype.getMaximumPositionY = function () {
    return this._viewportConstraints.yMax;
  };
  /**
   * @override
   */


  DvtDiagramOverview.prototype.getMinimumWindowWidth = function () {
    return 0;
  };
  /**
   * @override
   */


  DvtDiagramOverview.prototype.getMaximumWindowWidth = function () {
    return Number.MAX_VALUE;
  };
  /**
   * @override
   */


  DvtDiagramOverview.prototype.getMinimumWindowHeight = function () {
    return 0;
  };
  /**
   * @override
   */


  DvtDiagramOverview.prototype.getMaximumWindowHeight = function () {
    return Number.MAX_VALUE;
  };
  /**
   * Updates overview viewport
   * @protected
   */


  DvtDiagramOverview.prototype.UpdateViewport = function () {
    if (this._bCancelUpdateViewport) return;
    var newViewport = DvtDiagramOverviewUtils.CalcViewportFromMatrix(this.Diagram);
    var topLeft = DvtDiagramOverviewUtils.TransformFromContentToViewportCoords(newViewport.x, newViewport.y, this.Content);
    var bottomRight = DvtDiagramOverviewUtils.TransformFromContentToViewportCoords(newViewport.x + newViewport.w, newViewport.y + newViewport.h, this.Content);
    this._viewportPosition = {
      x1: topLeft.x,
      x2: bottomRight.x,
      y1: topLeft.y,
      y2: bottomRight.y
    };
    this.setViewportRange(topLeft.x, bottomRight.x, topLeft.y, bottomRight.y);
  };
  /**
   * Viewport change handler
   * @protected
   */


  DvtDiagramOverview.prototype.HandleViewportChange = function (event) {
    var newX1 = event.newX1 !== undefined ? event.newX1 : this._viewportPosition.x1;
    var newY1 = event.newY1 !== undefined ? event.newY1 : this._viewportPosition.y1;
    var oldTopLeft = DvtDiagramOverviewUtils.TransformFromViewportToContentCoords(this._viewportPosition.x1, this._viewportPosition.y1, this.Content);
    var newTopLeft = DvtDiagramOverviewUtils.TransformFromViewportToContentCoords(newX1, newY1, this.Content);
    this._viewportPosition.x1 = newX1;
    this._viewportPosition.y1 = newY1;
    var zoom = this.Diagram.getPanZoomCanvas().getZoom();
    var dx = (newTopLeft.x - oldTopLeft.x) * zoom;
    var dy = (newTopLeft.y - oldTopLeft.y) * zoom;

    if (dx !== 0 || dy !== 0) {
      this._bCancelUpdateViewport = true; // cancel HandleViewportChange as redundant

      this.Diagram.getPanZoomCanvas().panBy(-dx, -dy);
      this._bCancelUpdateViewport = false;
    }
  };
  /**
   * Returns the animation params for the viewport.
   * @return {array} params
   * @private
   */


  DvtDiagramOverview.prototype.GetAnimationParams = function () {
    var params = [];
    var slidingWindow = this.getSlidingWindow();
    var leftHandle = this.getLeftHandle();
    var rightHandle = this.getRightHandle();
    var bottomBar = this.getBottomBar();
    var topBar = this.getTopBar();
    params.push(slidingWindow.getTranslateX());
    params.push(slidingWindow.getTranslateY());
    params.push(slidingWindow.getWidth());
    params.push(slidingWindow.getHeight());
    params.push(leftHandle.getX1());
    params.push(leftHandle.getY1());
    params.push(leftHandle.getX2());
    params.push(leftHandle.getY2());
    params.push(rightHandle.getX1());
    params.push(rightHandle.getY1());
    params.push(rightHandle.getX2());
    params.push(rightHandle.getY2());
    params.push(bottomBar.getX1());
    params.push(bottomBar.getY1());
    params.push(bottomBar.getX2());
    params.push(bottomBar.getY2());
    params.push(topBar.getX1());
    params.push(topBar.getY1());
    params.push(topBar.getX2());
    params.push(topBar.getY2());
    return params;
  };
  /**
   * Updates the animation params for the viewport.
   * @param {array} params
   * @protected
   */


  DvtDiagramOverview.prototype.SetAnimationParams = function (params) {
    var slidingWindow = this.getSlidingWindow();
    var leftHandle = this.getLeftHandle();
    var rightHandle = this.getRightHandle();
    var bottomBar = this.getBottomBar();
    var topBar = this.getTopBar();
    var i = 0;
    slidingWindow.setTranslateX(params[i++]);
    slidingWindow.setTranslateY(params[i++]);
    slidingWindow.setWidth(params[i++]);
    slidingWindow.setHeight(params[i++]);
    leftHandle.setX1(params[i++]);
    leftHandle.setY1(params[i++]);
    leftHandle.setX2(params[i++]);
    leftHandle.setY2(params[i++]);
    rightHandle.setX1(params[i++]);
    rightHandle.setY1(params[i++]);
    rightHandle.setX2(params[i++]);
    rightHandle.setY2(params[i++]);
    bottomBar.setX1(params[i++]);
    bottomBar.setY1(params[i++]);
    bottomBar.setX2(params[i++]);
    bottomBar.setY2(params[i++]);
    topBar.setX1(params[i++]);
    topBar.setY1(params[i++]);
    topBar.setX2(params[i++]);
    topBar.setY2(params[i++]);
  };
  /**
   * Creates a container that contains overview properties needed for partial update animation
   * @protected
   */


  DvtDiagramOverview.prototype.CreateAnimationClone = function () {
    var context = this.getCtx();
    var overviewClone = new dvt.Container(context, this.getId());
    overviewClone.setMouseEnabled(false);
    var ovContentClone = new dvt.Container(context, 'ovContentClone');
    overviewClone.addChild(ovContentClone);
    overviewClone.Content = ovContentClone;
    overviewClone.Nodes = new context.ojMap();
    overviewClone.Diagram = this.Diagram;
    var rootNodes = this.Diagram.GetRootNodeObjects();

    if (rootNodes.length > 0) {
      rootNodes.forEach(function (node) {
        DvtDiagramOverviewUtils.CreateOverviewNode(overviewClone.Diagram, overviewClone, node, ovContentClone);
      });
      DvtDiagramOverviewUtils.ZoomToFitOverviewContent(overviewClone.Diagram, overviewClone, ovContentClone, this.Width, this.Height);
    }

    var cloneAnimationParams = this.GetAnimationParams();

    overviewClone.GetAnimationParams = function () {
      return cloneAnimationParams;
    };

    return overviewClone;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @param {dvt.Context} context The rendering context.
   * @param {function} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @constructor
   */


  dvt.Diagram = function (context, callback, callbackObj) {
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

  dvt.Diagram.prototype.Init = function (context, callback, callbackObj) {
    dvt.Diagram.superclass.Init.call(this, context, callback, callbackObj); // Create the defaults object

    this.Defaults = new DvtDiagramDefaults(context); // Create the event handler and add event listeners

    this.EventManager = new DvtDiagramEventManager(context, this.processEvent, this);
    this.EventManager.addListeners(this); // Set up keyboard handler on non-touch devices

    if (!dvt.Agent.isTouchDevice()) this.EventManager.setKeyboardHandler(new DvtDiagramKeyboardHandler(this, this.EventManager));
    this._nodes = new context.ojMap();
    this._arNodeIds = [];
    this._arRootIds = [];
    this._links = new context.ojMap();
    this._arLinkIds = [];
    this._renderCount = 0;
    this._deferredObjCount = 0;
    this._allNodeIdsMap = new context.ojMap();
    this._unresolvedNodeIds = []; // used to discover end-point nodes for promoted links

    this._nodesToResolve = []; // used for resolving container nodes during breadth-first search

    this._touchEventContentDiagramObjRef = null; // can be a reference to DvtDiagramNode or DvtDiagramLink

    this.setId('diagram'); // this is needed for animation purposes.
  };
  /**
   * Returns a new instance of dvt.Diagram. Currently only called by json supported platforms.
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @return {dvt.Diagram}
   */


  dvt.Diagram.newInstance = function (context, callback, callbackObj) {
    return new dvt.Diagram(context, callback, callbackObj);
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.PreRender = function () {
    if (!this.IsResize() && this._bRendered) {
      if (DvtDiagramStyleUtils.getAnimationOnDataChange(this) != 'none') {
        this._oldDataAnimState = new DvtDiagramDataAnimationState(this);
      }

      this._currentViewport = this.getPanZoomCanvas().getViewport();
      this._bRendered = false; // save old pan zoom canvas for data transitions

      this._oldPanZoomCanvas = this.getPanZoomCanvas();

      this._setDataSourceListeners(this.getOptions()['data'], false);
    }

    if (!this.IsResize()) {
      this.ResetNodesAndLinks();
      this._oldLayoutContext = this._layoutContext;
      this._layoutContext = null;
    } else if (this._layoutContext) {
      this._layoutContext.setEventData(null);

      this._layoutContext.setComponentSize(new dvt.DiagramRectangle(0, 0, this.getWidth(), this.getHeight()));

      this._layoutContext.setCurrentViewport(null);
    }
  };
  /**
   * Resets nodes and links
   * @protected
   */


  dvt.Diagram.prototype.ResetNodesAndLinks = function () {
    var context = this.getCtx();
    this.setLinksPane(new dvt.Container(context));
    this.setNodesPane(new dvt.Container(context));
    this.setTopPane(new dvt.Container(context));
    this._nodes = new context.ojMap();
    this._arNodeIds = [];
    this._arRootIds = [];
    this._links = new context.ojMap();
    this._arLinkIds = []; // Make sure we're not holding references to any obsolete nodes/links

    this._highlightedObjects = null;
    this._promotedLinksMap = null; //Map of promoted links. Key: promoted link id -> promoted link object

    this._linkToPromotedMap = null; //Map of original links converted to promoted. Key: link id -> promoted link id

    this._collapsedNodes = null;

    if (!this.isDataProviderMode()) {
      this.getOptions()['nodes'] = [];
      this.getOptions()['links'] = [];
    }

    this._allNodeIdsMap = new context.ojMap();
    this._unresolvedNodeIds = [];
    DvtDiagramOverviewUtils.RemoveOverviewWindow(this, this.Overview);
    this.Overview = null;
  };
  /**
   * Hook for cleaning up animation behavior at the end of the animation.
   * @private
   */


  dvt.Diagram.prototype._onAnimationEnd = function () {
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
    } // Reset animation flags


    this.Animation = null;
    this.AnimationStopped = false;

    if (this._bRendered) {
      this._oldDataAnimState = null;
    }
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.animateUpdate = function (animationHandler, oldDiagramState) {
    var playable = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());
    var oldMat = oldDiagramState.PanZoomMatrix;
    var newMat = this.getPanZoomCanvas().getContentPane().getMatrix();

    if (!oldMat.equals(newMat)) {
      this.getPanZoomCanvas().getContentPane().setMatrix(oldMat);
      playable.getAnimator().addProp(dvt.Animator.TYPE_MATRIX, this.getPanZoomCanvas().getContentPane(), this.getPanZoomCanvas().getContentPane().getMatrix, this.getPanZoomCanvas().getContentPane().setMatrix, newMat);
    }

    var newNodes = oldDiagramState.IsPartialUpdate ? oldDiagramState.getNewNodes() : this.GetRootNodeObjects();
    var newLinks = oldDiagramState.IsPartialUpdate ? oldDiagramState.getNewLinks() : this.GetAllLinkObjects();
    animationHandler.constructAnimation(oldDiagramState.getNodes(), newNodes);
    animationHandler.constructAnimation(oldDiagramState.getLinks(), newLinks);
    animationHandler.constructAnimation([oldDiagramState.Overview], [this.Overview]);
    animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);
  };
  /**
   * Resolves deferred child nodes and links data. Calls RenderComponentInternal() when all deferred data are resolved.
   * @param {oj.DiagramDataSource} dataSource oj.DiagramDataSource object that handles data for the component
   * @param {Object} nodeData option value for the individual node that might have child nodes to be resolved
   * @private
   */


  dvt.Diagram.prototype._resolveDeferredData = function (dataSource, nodeData) {
    if (nodeData == null || this._isNodeDisclosed(nodeData['id']) || this._discoverLinks(dataSource, nodeData)) {
      var childData = dataSource['getData'](nodeData);
      this._deferredObjCount++;
      var thisRef = this;
      var renderCount = this._renderCount;
      childData.then(function (value) {
        thisRef._renderDeferredData(renderCount, dataSource, nodeData ? nodeData : thisRef.getOptions(), value);
      }, function (reason) {
        thisRef._renderDeferredData(renderCount, dataSource, nodeData ? nodeData : thisRef.getOptions(), null);
      });
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


  dvt.Diagram.prototype._renderDeferredData = function (renderCount, dataSource, nodeData, resolvedData) {
    if (renderCount === this._renderCount && this.getCtx().isReadyToRender()) {
      if (resolvedData != null) {
        nodeData['nodes'] = resolvedData['nodes']; //add links to top level links option

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
      } else {
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
   * @param {boolean} deepWalk flag to walk nodes recursively to build a map (used in Data provider case)
   * @private
   */


  dvt.Diagram.prototype._findUnresolvedLinks = function (data, deepWalk) {
    // do nothing if the component does not display promoted links
    // or if data came from data provider and promoted link behavior is 'lazy'
    if (this.getOptions()['promotedLinkBehavior'] === 'none' || this.isDataProviderMode() && this.getOptions()['promotedLinkBehavior'] === 'lazy') {
      return;
    }

    var mapAllNodes = function mapAllNodes(data, allNodeIdsMap) {
      if (Array.isArray(data['nodes'])) {
        data['nodes'].forEach(function (node) {
          allNodeIdsMap.set(node['id'], true);

          if (deepWalk) {
            mapAllNodes(node, allNodeIdsMap);
          }
        });
      }
    };

    mapAllNodes(data, this._allNodeIdsMap); //update existing unresolved array - delete entries if nodes are found

    for (var i = this._unresolvedNodeIds.length - 1; i >= 0; i--) {
      if (this._allNodeIdsMap.has(this._unresolvedNodeIds[i])) {
        this._unresolvedNodeIds.splice(i, 1);
      }
    } //if data contain additional links, add unresolved nodes to the array


    if (Array.isArray(data['links'])) {
      for (var i = 0; i < data['links'].length; i++) {
        var link = data['links'][i];

        if (!this._allNodeIdsMap.has(link['startNode'])) {
          this._unresolvedNodeIds.push(link['startNode']);
        }

        if (!this._allNodeIdsMap.has(link['endNode'])) {
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


  dvt.Diagram.prototype._discoverLinks = function (dataSource, containerData) {
    var behaviorValue = this.getOptions()['promotedLinkBehavior'];

    if (behaviorValue === 'none' || this._unresolvedNodeIds.length == 0 || behaviorValue == 'lazy' && dataSource['getChildCount'](containerData) <= 0) {
      return false;
    }

    return dataSource['getDescendantsConnectivity'](containerData) != 'disjoint';
  };
  /**
   * Helper method that attaches and removes data source event handlers
   * @param {oj.DiagramDataSource} dataSource diagram data source
   * @param {boolean} attach true to attach listeners, false to remove listeners
   * @private
   */


  dvt.Diagram.prototype._setDataSourceListeners = function (dataSource, attach) {
    if (!dataSource) return;

    if (!this._dataSourceAddEventHandler) {
      this._dataSourceAddEventHandler = this.handleDataSourceChangeEvent.bind(this, 'add');
    }

    if (!this._dataSourceRemoveEventHandler) {
      this._dataSourceRemoveEventHandler = this.handleDataSourceChangeEvent.bind(this, 'remove');
    }

    if (!this._dataSourceChangeEventHandler) {
      this._dataSourceChangeEventHandler = this.handleDataSourceChangeEvent.bind(this, 'change');
    }

    if (attach) {
      dataSource['on']('add', this._dataSourceAddEventHandler);
      dataSource['on']('remove', this._dataSourceRemoveEventHandler);
      dataSource['on']('change', this._dataSourceChangeEventHandler);
    } else {
      dataSource['off']('add', this._dataSourceAddEventHandler);
      dataSource['off']('remove', this._dataSourceRemoveEventHandler);
      dataSource['off']('change', this._dataSourceChangeEventHandler);
    }
  };
  /**
   * Adds data source listeners. Used on connect.
   */


  dvt.Diagram.prototype.addDataSourceEventListeners = function () {
    this._setDataSourceListeners(this.getOptions()['data'], true);
  };
  /**
   * Removes data source listeners. Used on disconnect.
   */


  dvt.Diagram.prototype.removeDataSourceEventListeners = function () {
    this._setDataSourceListeners(this.getOptions()['data'], false);
  };
  /**
   * Fetches additional data - nodes and links - from data provider when necessary.
   * The additional data are needed when 'promotedLinkBehavior' option is set to 'full' and
   * the component had to search for nodes in order to display promoted links.
   * When all nodes are discovered, the method calls RenderComponentInternal().
   * @param {Object} rootDataProvider root data provider for the diagram
   * @param {array} nodesArray an array of nodes used for searching
   * @private
   */


  dvt.Diagram.prototype._fetchDataProviderData = function (rootDataProvider, nodesArray) {
    var collapsedContainers = this.isTreeDataProvider() ? DvtDiagramDataUtils.GetCollapsedContainers(rootDataProvider, nodesArray, []) : [];

    if (collapsedContainers.length > 0) {
      var thisRef = this;
      var containerChildDataPromises = collapsedContainers.map(function (containerNode) {
        return thisRef.Options._fetchDataHandler(rootDataProvider, thisRef._context.KeySetImpl([containerNode.id]), containerNode, containerNode.id);
      });
      var renderCount = this._renderCount;
      Promise.all(containerChildDataPromises).then(function (values) {
        if (renderCount === thisRef._renderCount && thisRef.getCtx().isReadyToRender()) {
          // prepare for another round of collapsed containers search
          nodesArray = [];
          values.forEach(function (childData) {
            if (Array.isArray(childData)) {
              childData.forEach(function (childNode) {
                thisRef._allNodeIdsMap.set(childNode.id, true);

                nodesArray.push(childNode);
              });
            }
          });

          for (var i = thisRef._unresolvedNodeIds.length - 1; i >= 0; i--) {
            if (thisRef._allNodeIdsMap.has(thisRef._unresolvedNodeIds[i])) {
              thisRef._unresolvedNodeIds.splice(i, 1);
            }
          }

          if (thisRef._unresolvedNodeIds.length > 0) {
            thisRef._fetchDataProviderData(rootDataProvider, nodesArray);
          } else {
            thisRef.RenderComponentInternal();
          }
        }
      });
    } else {
      this.RenderComponentInternal();
    }
  };
  /**
   * Check if nodes and links data came from data provider
   * @return {boolean} return true for data provider mode
   */


  dvt.Diagram.prototype.isDataProviderMode = function () {
    return !!this.getOptions()['nodeData'];
  };
  /**
   * Check if tree data provider is used for the nodes
   * @return {boolean} return true for tree data provider
   */


  dvt.Diagram.prototype.isTreeDataProvider = function () {
    var nodeDP = this.getOptions()['nodeData'];
    return nodeDP && nodeDP['getChildDataProvider'] ? true : false;
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.Render = function () {
    dvt.Diagram.superclass.Render.call(this);
    this.InitComponentInternal();
    this._deferredObjCount = 0;
    this._nodesToResolve = [];

    if (!this._bRendered && !this.IsResize()) {
      this._renderCount++;

      if (this.isDataProviderMode()) {
        // find out if the component should discover additional nodes to render promoted links
        this._findUnresolvedLinks({
          nodes: this.Options['nodes'],
          links: this.Options['links']
        }, true);

        var nodesToSearch = this._unresolvedNodeIds.length > 0 ? this.Options['nodes'].slice() : [];

        this._fetchDataProviderData(this.Options['nodeData'], nodesToSearch);
      } else if (this.getOptions()['data']) {
        var dataSource = this.getOptions()['data'];

        this._setDataSourceListeners(dataSource, false);

        this._resolveDeferredData(dataSource, null);
      } else {
        this.RenderComponentInternal();
      }
    } else if (this._deferredObjCount === 0) {
      this.RenderComponentInternal();
    }
  };
  /**
   * Renders a Diagram component after it was initialized.
   * @protected
   */


  dvt.Diagram.prototype.RenderComponentInternal = function () {
    var emptyDiagram = false;

    if (!this._bRendered && !this.IsResize()) {
      this._setDataSourceListeners(this.getOptions()['data'], true);

      this.prepareNodes(this.getOptions()['nodes']);
      this.renderLinks(this.getOptions()['links']);
      this.getCtx().setKeyboardFocusArray([this]);
    } //check whether the diagram is empty


    emptyDiagram = this._nodes.size === 0;

    if (!emptyDiagram) {
      // the child is going to be removed by  _processContent() function or layout failure function
      if (!this.contains(this._oldPanZoomCanvas)) this.addChild(this._oldPanZoomCanvas);
      var res = this.layout();
      var thisRef = this;
      var renderCount = this._renderCount;
      res.then(function () {
        if (renderCount === thisRef._renderCount) {
          thisRef._processContent(emptyDiagram);
        }
      }, //success
      function () {
        if (renderCount === thisRef._renderCount) {
          thisRef.removeChild(thisRef._oldPanZoomCanvas);
          thisRef._oldPanZoomCanvas = null;
          thisRef._bRendered = true;
          this._currentViewport = null;
        }
      } //failure
      );
    } else {
      //empty diagram - nothing to layout, might need to run data change animation
      this._processContent(emptyDiagram);
    }
  };
  /**
   * Process diagram content after layout is done - zoom to fit, animate if it is necessary
   * @param {boolean} bEmptyDiagram True if diagram is empty
   * @private
   */


  dvt.Diagram.prototype._processContent = function (bEmptyDiagram) {
    var calcViewBounds;

    if (!bEmptyDiagram) {
      this.removeChild(this._oldPanZoomCanvas);

      this._processHighlighting();

      this._processInitialSelections();

      this._updateKeyboardFocusEffect();

      calcViewBounds = this._cachedViewBounds == null;

      if (calcViewBounds) {
        this._cachedViewBounds = this.GetViewBounds();
      }

      this._fitContent();
    } // Initialize panZoomCanvas settings on initial update
    // regardless of whether the component is empty or not.


    if (!this._bRendered) {
      var pzc = this.getPanZoomCanvas();
      pzc.setPanningEnabled(this.IsPanningEnabled());
      pzc.setPanDirection(this.getPanDirection());
      pzc.setZoomingEnabled(this.IsZoomingEnabled());
      pzc.setZoomToFitEnabled(this.IsZoomingEnabled());
    } // add overview window


    if (!this.Overview && this.Options.overview && this.Options.overview.rendered == 'on') {
      this.Overview = DvtDiagramOverviewUtils.CreateOverviewWindow(this);
    } else if (this.Overview) {
      DvtDiagramOverviewUtils.UpdateOverviewWindow(this, this.Overview);
    }

    this._oldPanZoomCanvas = null; // Animation Support
    // Stop any animation in progress

    this.StopAnimation(true); // Construct the new animation playable

    var animationOnDisplay = DvtDiagramStyleUtils.getAnimationOnDisplay(this);
    var animationOnDataChange = DvtDiagramStyleUtils.getAnimationOnDataChange(this);

    if (!this._bRendered && animationOnDisplay !== 'none' && !this._oldDataAnimState) {
      //initial animation
      this.Animation = dvt.BlackBoxAnimationHandler.getInAnimation(this.getCtx(), dvt.BlackBoxAnimationHandler.ALPHA_FADE, this, null, DvtDiagramStyleUtils.getAnimationDuration(this));
    } else if (animationOnDataChange !== 'none' && this._oldDataAnimState) {
      this._deleteContainer = new dvt.Container(this.getCtx(), 'Delete Container');
      this.addChild(this._deleteContainer);
      var ah = new DvtDiagramDataAnimationHandler(this.getCtx(), this._deleteContainer, this._oldDataAnimState, this);
      ah.constructAnimation([this._oldDataAnimState], [this]);
      this.Animation = ah.getAnimation();
    } // If an animation was created, play it


    if (this.Animation) {
      this.getEventManager().hideTooltip(); // Disable event listeners temporarily

      this.getEventManager().removeListeners(this);
      this.Animation.setOnEnd(this._onAnimationEnd, this);
      this.Animation.play();
    } else {
      this._onAnimationEnd();
    }

    this._bRendered = true;
    this._currentViewport = null;
    this.RefreshEmptyText(bEmptyDiagram); // Constrain pan bounds

    if (this.IsPanningEnabled()) {
      var contentDim = this._cachedViewBounds;

      if (contentDim != null) {
        var zoom = this.getPanZoomCanvas().getZoom();
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
   * @private
   */


  dvt.Diagram.prototype._fitContent = function () {
    var pzc = this.getPanZoomCanvas();

    if (!this._bRendered) {
      this.AdjustMinZoom(this._cachedViewBounds); //: don't override a viewport returned from the layout engine

      var bLayoutViewport = this.IsLayoutViewport();
      var fitBounds = bLayoutViewport ? this.GetLayoutViewport() : this._cachedViewBounds;
      if (bLayoutViewport) pzc.setZoomToFitPadding(0);
      pzc.zoomToFit(null, fitBounds);
    } else if (this.IsResize() || this._partialUpdate) {
      // Update the min zoom if it's unspecified
      var viewBounds = this.AdjustMinZoom(this._cachedViewBounds);
      var bLayoutViewport = this.IsLayoutViewport();
      var fitBounds = bLayoutViewport ? this.GetLayoutViewport() : viewBounds ? viewBounds : this._cachedViewBounds;
      pzc.setZoomToFitPadding(bLayoutViewport ? 0 : dvt.PanZoomCanvas.DEFAULT_PADDING);
      pzc.setZoomToFitEnabled(true);
      pzc.zoomToFit(null, fitBounds);
      pzc.setZoomToFitEnabled(this.IsZoomingEnabled());
    }
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.SetOptions = function (options) {
    dvt.Diagram.superclass.SetOptions.call(this, options); //initial setup

    if (!this.isDataProviderMode()) {
      this.Options['nodes'] = [];
      this.Options['links'] = [];
    }

    this.SetPanningEnabled(this.Options['panning'] != 'none');
    this.SetZoomingEnabled(this.Options['zooming'] != 'none');
    this.setSelectionMode(this.Options['selectionMode']);
    this.setEmptyText(this.Options['emptyText'] ? this.Options['emptyText'] : this.Options.translations.labelNoData);
  };
  /**
   * Returns a copy of the default options for the specified skin.
   * @param {string} skin The skin whose defaults are being returned.
   * @return {object} The object containing defaults for this component.
   */


  dvt.Diagram.getDefaults = function (skin) {
    return new DvtDiagramDefaults().getDefaults(skin);
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.getMaxZoom = function () {
    var maxZoom = this.getOptions()['maxZoom'];
    var f = parseFloat(maxZoom);
    return f > 0 ? f : 1.0;
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.getMinZoom = function () {
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


  dvt.Diagram.prototype.getPanDirection = function () {
    return this.getOptions()['panDirection'];
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.getAnimationDuration = function () {
    return DvtDiagramStyleUtils.getAnimationDuration(this);
  };
  /**
   * Processes the specified event.
   * @param {object} event
   * @param {object} source The component that is the source of the event, if available.
   */


  dvt.Diagram.prototype.processEvent = function (event, source) {
    var type = event['type'];

    if (type == 'categoryHighlight') {
      this._processHighlighting(true);
    } else if (type == 'selection') {
      this.getOptions()['selection'] = event['selection'];
    } else if (type == 'overview') {
      var subtype = event.subtype;

      if (subtype == 'scrollPos' || subtype == 'scrollTime') {
        this.Overview.HandleViewportChange(event);
      }

      return;
    }

    if (event) {
      this.dispatchEvent(event);
    }
  };
  /**
   * Prepare diagram nodes for layout. The nodes will not be rendered at this time.
   * The nodes will be rendered during layout or after layout is done.
   * @param {array} nodesData an array of node data objects
   */


  dvt.Diagram.prototype.prepareNodes = function (nodesData) {
    if (!nodesData) return;

    this._prepareNodes(null, nodesData); // on custom elements expanded is as an ojKeySet, on widgets it is an array
    // if expanded is an array, update internal array of disclosed nodes if neccessary - initial rendering or option change case


    var origExpanded = this.getOptions()['expanded'];

    if (!origExpanded || !origExpanded['has'] && !this.DisclosedNodes) {
      this.DisclosedNodes = !origExpanded ? [] : origExpanded === 'all' ? this._arNodeIds.slice(0) : origExpanded;
    }
  };
  /**
   * Renders diagram links
   * @param {array} linksData an array of link data objects
   */


  dvt.Diagram.prototype.renderLinks = function (linksData) {
    if (!linksData) return;
    var linkDefaults = DvtDiagramStyleUtils.getLinkDefaultStyles(this, 'linkDefaults');

    for (var i = 0; i < linksData.length; i++) {
      var linkData = linksData[i];

      if (this._isLinkPromoted(linkData)) {
        continue;
      }

      linkData = DvtDiagramStyleUtils.getLinkStyles(this, linkData, linkDefaults);
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

      this._links.set(linkId, link);
    } // render promoted links


    if (this._promotedLinksMap) {
      var promotedLinkDefaults = DvtDiagramStyleUtils.getLinkDefaultStyles(this, 'promotedLink');
      var thisRef = this;

      this._promotedLinksMap.forEach(function (promotedLink, promotedLinkId, map) {
        if (!thisRef._links.has(promotedLinkId)) {
          // render the link if it is not rendered yet
          var linkData = dvt.JsonUtils.merge(promotedLink, promotedLinkDefaults);
          var link = DvtDiagramLink.newInstance(thisRef, linkData, true);
          var linkId = link.getId();
          var startNode = thisRef.getNodeById(link.getStartId());
          var endNode = thisRef.getNodeById(link.getEndId());
          startNode.addOutLinkId(linkId);
          endNode.addInLinkId(linkId);
          link.render();

          thisRef._arLinkIds.push(linkId);

          thisRef._links.set(linkId, link);
        }
      });
    }
  };
  /**
   * Layout diagram nodes and links
   * @return {object} Promise or Promise like object that implements then function - then function should be executed after layout is done
   */


  dvt.Diagram.prototype.layout = function () {
    var layoutFunc = this.getOptions()['layout'];

    var layoutContext = this._getLayoutContext();

    layoutContext.setDirtyContext(new (this.getCtx().ojMap)()); // pass the current viewport to the layout

    if (this._currentViewport) {
      var viewportRect = this._currentViewport;
      var point = this.getLayoutOffset();
      var currentViewport = new dvt.DiagramRectangle(viewportRect.x - point.x, viewportRect.y - point.y, viewportRect.w, viewportRect.h);
      layoutContext.setCurrentViewport(currentViewport);
    }

    if (layoutFunc && typeof layoutFunc == 'function') {
      //prerender all leaf nodes, without calculating sizes
      var rootNodesCount = layoutContext.getNodeCount();

      for (var i = 0; i < rootNodesCount; i++) {
        var rootNode = layoutContext.getNodeByIndex(i);
        this.renderLeafNodeFromContext(rootNode);
      }

      var thisRef = this;
      var promise = layoutFunc(layoutContext);

      if (!promise) {
        promise = {
          then: function then(resolveFunc, errorFunc) {
            resolveFunc();
          }
        };
      }

      this.setAlphas(0);
      var renderCount = this._renderCount;
      promise.then(function (response) {
        if (thisRef._renderCount === renderCount || thisRef.IsResize()) {
          thisRef.setAlphas(1.0);
          if (thisRef._oldDataAnimState) thisRef._oldDataAnimState.updateStateFromLayoutContext(layoutContext); //render nodes if they not rendered yet

          var rootNodesCount = layoutContext.getNodeCount();

          for (var i = 0; i < rootNodesCount; i++) {
            var rootNode = layoutContext.getNodeByIndex(i);
            thisRef.renderNodeFromContext(rootNode, true);
          }

          thisRef.ApplyLayoutContext(layoutContext, true);
        }
      }, function (error) {});
      return promise;
    } else {
      this.Log('dvt.Diagram: Layout function is not defined', 1); // LEVEL_ERROR
    }
  };
  /**
   * Sets the alphas on diagram panes.
   * @param {number} alpha panes opacity
   */


  dvt.Diagram.prototype.setAlphas = function (alpha) {
    if (!this._bRendered) {
      this.getLinksPane().setAlpha(alpha);
      this.getNodesPane().setAlpha(alpha);
    }
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.getNodeById = function (id) {
    return this._nodes.get(id);
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.getLinkById = function (id) {
    return this._links.get(id);
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.GetAllLinks = function () {
    return this._arLinkIds;
  };
  /**
   * Gets a copy of the map of all links
   * @return {object} map of all links
   * @protected
   */


  dvt.Diagram.prototype.GetAllLinksMap = function () {
    var linksMap = new (this.getCtx().ojMap)();

    if (this._links) {
      this._links.forEach(function (link, linkId, map) {
        linksMap.set(linkId, link);
      });
    }

    return linksMap;
  };
  /**
   * Gets an array of all link objects
   * @return {array} array of all link objects
   * @protected
   */


  dvt.Diagram.prototype.GetAllLinkObjects = function () {
    var allLinks = [];

    if (this._links) {
      this._links.forEach(function (link, linkId, map) {
        allLinks.push(link);
      });
    }

    return allLinks;
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.GetAllNodes = function () {
    return this._arNodeIds;
  };
  /**
   * Gets a copy of the map of all nodes
   * @return {object} map of all nodes
   * @protected
   */


  dvt.Diagram.prototype.GetAllNodesMap = function () {
    var nodesMap = new (this.getCtx().ojMap)();

    if (this._nodes) {
      this._nodes.forEach(function (value, key, map) {
        nodesMap.set(key, value);
      });
    }

    return nodesMap;
  };
  /**
   * Gets an array of all node objects
   * @return {array} array of all node objects
   * @protected
   */


  dvt.Diagram.prototype.GetAllNodeObjects = function () {
    var allNodes = [];

    if (this._nodes) {
      this._nodes.forEach(function (value, key, map) {
        allNodes.push(value);
      });
    }

    return allNodes;
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.GetAllRoots = function () {
    return this._arRootIds;
  };
  /**
   * Gets an array of all node objects
   * @return {array} array of all node objects
   * @protected
   */


  dvt.Diagram.prototype.GetRootNodeObjects = function () {
    var roots = [];

    for (var i = 0; this._arRootIds && i < this._arRootIds.length; i++) {
      var root = this._nodes.get(this._arRootIds[i]);

      if (root) {
        roots.push(root);
      }
    }

    return roots;
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.HandlePanEvent = function (event) {
    dvt.Diagram.superclass.HandlePanEvent.call(this, event);

    if (this.Overview) {
      this.Overview.UpdateViewport();
    }
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.HandleZoomEvent = function (event) {
    dvt.Diagram.superclass.HandleZoomEvent.call(this, event);

    if (this.Overview) {
      this.Overview.UpdateViewport();
    }

    var subtype = event.subtype;

    switch (subtype) {
      case 'adjustPanConstraints':
        if (this.IsPanningEnabled()) {
          var zoom = event.newZoom; // Calculate the new content dimensions based on the new zoom

          var contentDim = this._cachedViewBounds ? this._cachedViewBounds : this.GetViewBounds();
          this.ConstrainPanning(contentDim.x, contentDim.y, contentDim.w, contentDim.h, zoom);
        }

        break;

      case 'zoomed':
        // don't update nodes on zoomed events on touch device, since touchend might be lost when the node is rerendered
        var nc = this.getOptions()['nodeContent'] || {};

        if (!dvt.Agent.isTouchDevice() && nc['zoomRenderer'] && event.oldZoom !== event.newZoom) {
          this._nodes.forEach(function (node, nodeId, map) {
            node.rerenderOnZoom(event);
          });
        }

        break;

      case 'zoomToFitEnd':
      case 'zoomEnd':
        // when on touch, call zoom renderer on zoom_end and zoom-to-fit-end
        var nc = this.getOptions()['nodeContent'] || {};

        if (dvt.Agent.isTouchDevice() && nc['zoomRenderer'] && event.oldZoom !== event.newZoom) {
          this._nodes.forEach(function (node, nodeId, map) {
            node.rerenderOnZoom(event);
          });
        }

        break;
    }
  };
  /**
   * Gets an array of navigable links for the specified node
   * @param {string} nodeId node id
   * @return {array} array of navigable links for the specified node
   */


  dvt.Diagram.prototype.getNavigableLinksForNodeId = function (nodeId) {
    var links = [];

    this._links.forEach(function (link, linkId, map) {
      var startId = link.getStartId();
      var endId = link.getEndId();
      if ((startId == nodeId || endId == nodeId) && link.getVisible()) links.push(link);
    });

    return links;
  };
  /**
   * Update the selection handler with the initial selections.
   * @private
   */


  dvt.Diagram.prototype._processInitialSelections = function () {
    var selection = this.Options['selection'];
    if (!selection) return;

    if (this.isSelectionSupported()) {
      var targets = [];

      this._nodes.forEach(function (node, nodeId, map) {
        targets.push(node);
      });

      this._links.forEach(function (link, linkId, map) {
        targets.push(link);
      });

      this.getSelectionHandler().processInitialSelections(this.Options['selection'], targets);
    }
  };
  /**
   * Process highlighting
   * @param {boolean} handleEventListeners a flag to remove, then reattach event listeners. The flag is set to true when highlight is caused by event.
   * @private
   */


  dvt.Diagram.prototype._processHighlighting = function (handleEventListeners) {
    //  - edge: highlight blinks on hover over node label positioned over the link
    // We get extra mouseover/mouseout events as we reparent diagram objects in _updateAlphas()
    // the problem is more prominent in IE
    if (handleEventListeners) {
      this.EventManager.removeListeners(this, true);
    } //clear existing


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
    this._highlightedObjects = new (this.getCtx().ojMap)();
    var highlightedNodes = [];
    var thisRef = this; //find highlighted nodes

    this._nodes.forEach(function (node, nodeId, map) {
      var match = bAnyMatched ? dvt.ArrayUtils.hasAnyItem(node.getCategories(), categories) : dvt.ArrayUtils.hasAllItems(node.getCategories(), categories);

      if (match) {
        thisRef._highlightedObjects.set(nodeId, node);

        highlightedNodes.push(node);
      }
    });

    this._processNodeConnections(highlightedNodes); //find highlighted links


    var highlightedLinks = [];

    this._links.forEach(function (link, linkId, map) {
      var match = bAnyMatched ? dvt.ArrayUtils.hasAnyItem(link.getCategories(), categories) : dvt.ArrayUtils.hasAllItems(link.getCategories(), categories);

      if (match) {
        thisRef._highlightedObjects.set(linkId, link);

        highlightedLinks.push(link);
      }
    });

    if (this.Options['linkHighlightMode'] == 'linkAndNodes') {
      this._processLinkConnections(highlightedLinks);
    }

    this._updateAlphas(true, this._highlightedObjects); //  - edge: highlight blinks on hover over node label positioned over the link
    // Reattach the listenes after updating alphas. The timeout seems to alow extra time to finish
    // a browser reparenting highlighted objects in DOM


    if (handleEventListeners) {
      var thisRef = this;
      setTimeout(function () {
        thisRef.getEventManager().addListeners(thisRef);
      }, 0);
    }
  };
  /**
   * Add specified connection (incoming and outgoing) with the endpoints to the map of highlighted objects
   * @param {array} highlightedNodes nodes to process
   * @private
   */


  dvt.Diagram.prototype._processNodeConnections = function (highlightedNodes) {
    var nodeHighlightMode = this.Options['nodeHighlightMode'];

    if (nodeHighlightMode != 'node') {
      var incoming = nodeHighlightMode == 'nodeAndIncomingLinks' || nodeHighlightMode == 'nodeAndLinks';
      var outgoing = nodeHighlightMode == 'nodeAndOutgoingLinks' || nodeHighlightMode == 'nodeAndLinks';
      var highlightedLinks = [];

      for (var nodeIdx = 0; nodeIdx < highlightedNodes.length; nodeIdx++) {
        var node = highlightedNodes[nodeIdx];
        var links = incoming && node.getInLinkIds() ? node.getInLinkIds() : [];
        links = outgoing && node.getOutLinkIds() ? links.concat(node.getOutLinkIds()) : links;

        for (var idx = 0; idx < links.length; idx++) {
          var linkId = links[idx];

          this._highlightedObjects.set(linkId, this.getLinkById(linkId));

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


  dvt.Diagram.prototype._processLinkConnections = function (highlightedLinks) {
    for (var linkIdx = 0; linkIdx < highlightedLinks.length; linkIdx++) {
      var link = highlightedLinks[linkIdx];
      var linkStartId = link.getStartId();
      var linkEndId = link.getEndId();

      this._highlightedObjects.set(linkStartId, this.getNodeById(linkStartId));

      this._highlightedObjects.set(linkEndId, this.getNodeById(linkEndId));
    }
  };
  /**
   * Highlight objects by setting alpha on links and nodes panes and
   * bringing highlighted objects to either content pane or corresponding link/nodes pane
   * @param {boolean} bHighlight true highligh objects, false to unhighlight
   * @param {object} highlightedObjects a map of highlighted object
   * @private
   */


  dvt.Diagram.prototype._updateAlphas = function (bHighlight, highlightedObjects) {
    var objectsTotal = this._nodes.size + this._links.size;

    if (highlightedObjects.size === objectsTotal) {
      return;
    } //is diagram flat or does it have containers - don't reparent objects for container case


    if (this._arNodeIds.length == this._arRootIds.length) {
      //flat
      var highlightAlpha = bHighlight ? this.Options['styleDefaults']['_highlightAlpha'] : 1.0;
      var linksPane = this.getLinksPane();
      var nodesPane = this.getNodesPane();

      if (highlightedObjects.size > objectsTotal * .5) {
        // keep highlighted objects in place - move other objects to the faded bottom pane
        var bottomPane = this.getBottomPane();
        bottomPane.setAlpha(highlightAlpha);

        this._links.forEach(function (link, id, map) {
          var highlighted = highlightedObjects.get(id);
          if (!highlighted && bHighlight) bottomPane.addChild(link);else if (!highlighted) linksPane.addChild(link);
        });

        this._nodes.forEach(function (node, id, map) {
          var highlighted = highlightedObjects.get(id);
          if (!highlighted && bHighlight) bottomPane.addChild(node);else if (!highlighted) nodesPane.addChild(node);
        });
      } else {
        var topPane = this.getTopPane(); //update alphas on link and node panes

        linksPane.setAlpha(highlightAlpha);
        nodesPane.setAlpha(highlightAlpha); // Then just reparent the interesting links and nodes

        var highlightedLinksArray = [];
        var highlightedNodesArray = [];
        highlightedObjects.forEach(function (item, id, map) {
          if (item instanceof DvtDiagramLink) highlightedLinksArray.push(item);else if (item instanceof DvtDiagramNode) highlightedNodesArray.push(item);
        });

        for (var elt = 0; elt < highlightedLinksArray.length; elt++) {
          if (bHighlight) topPane.addChild(highlightedLinksArray[elt]);else linksPane.addChild(highlightedLinksArray[elt]);
        }

        for (var elt = 0; elt < highlightedNodesArray.length; elt++) {
          if (bHighlight) topPane.addChild(highlightedNodesArray[elt]);else nodesPane.addChild(highlightedNodesArray[elt]);
        }
      }
    } else {
      //has containers
      if (bHighlight) {
        //highlight objects
        highlightedObjects.forEach(function (item, id, map) {
          item.highlight(true);
        });

        this._nodes.forEach(function (node, nodeId, map) {
          if (!highlightedObjects.has(nodeId)) {
            node.highlight(false);
          }
        });

        this._links.forEach(function (link, linkId, map) {
          if (!highlightedObjects.has(linkId)) {
            link.highlight(false);
          }
        });
      } else {
        //remove highlight
        this._nodes.forEach(function (node, nodeId, map) {
          node.highlight(true);
        });

        this._links.forEach(function (link, linkId, map) {
          link.highlight(true);
        });
      }
    }
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.highlight = function (categories) {
    // Update the options
    this.Options['highlightedCategories'] = dvt.JsonUtils.clone(categories); // Perform the highlighting

    this._processHighlighting();
  };
  /**
   * @override
   */


  dvt.Diagram.prototype.select = function (selection) {
    // Update the options
    this.Options['selection'] = dvt.JsonUtils.clone(selection); // Perform the selection

    this._processInitialSelections();
  };
  /**
   * @return {DvtDiagramAutomation} the automation object
   */


  dvt.Diagram.prototype.getAutomation = function () {
    if (!this.Automation) this.Automation = new DvtDiagramAutomation(this);
    return this.Automation;
  };
  /**
   * Logs diagram messages
   * @param {string} message
   * @param {number} level log level - LEVEL_ERROR = 1, LEVEL_WARN = 2, LEVEL_INFO = 3, LEVEL_LOG = 4
   * @protected
   */


  dvt.Diagram.prototype.Log = function (message, level) {
    var logger = this.getOptions()['_logger'];

    if (logger) {
      switch (level) {
        case 1:
          if (logger.error) logger.error(message);
          break;

        case 2:
          if (logger.warn) logger.warn(message);
          break;

        case 3:
          if (logger.info) logger.info(message);
          break;

        default:
          if (logger.log) logger.log(message);
          break;
      }
    }
  };
  /**
   * Hides or shows default hover effect on the specified node
   * @param {string} nodeId node id
   * @param {boolean} hovered true to show hover effect
   */


  dvt.Diagram.prototype.processDefaultHoverEffect = function (nodeId, hovered) {
    var node = this.getNodeById(nodeId);
    if (node) node.processDefaultHoverEffect(hovered);
  };
  /**
   * Hides or shows default selection effect on the specified node
   * @param {string} nodeId node id
   * @param {boolean} selected true to show selection effect
   */


  dvt.Diagram.prototype.processDefaultSelectionEffect = function (nodeId, selected) {
    var node = this.getNodeById(nodeId);
    if (node) node.processDefaultSelectionEffect(selected);
  };
  /**
   * Hides or shows default keyboard focus effect on the specified node
   * @param {string} nodeId node id
   * @param {boolean} focused true to show keyboard focus effect
   */


  dvt.Diagram.prototype.processDefaultFocusEffect = function (nodeId, focused) {
    var node = this.getNodeById(nodeId);
    if (node) node.processDefaultFocusEffect(focused);
  };
  /**
   * Updates nodes dimensions for the specified node context. Renders the node if it is necessary.
   * @param {DvtDiagramLayoutContextNode} nodeContext
   */


  dvt.Diagram.prototype.updateNodeDims = function (nodeContext) {
    if (!nodeContext.IsRendered) {
      this.renderNodeFromContext(nodeContext, true);
    } else {
      var node = this.getNodeById(nodeContext.getId());
      nodeContext.setBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getLayoutBounds(true)));
      nodeContext.setContentBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getContentBounds(true)));
      nodeContext.setLabelBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getLabelBounds(true)));
    }
  };
  /**
   * Render leaf nodes only for the given node from layout context:
   * if the node is a leaf it will be rendered,
   * if the node is a container - walk down to the leaf nodes and render them
   * @param {DvtDiagramLayoutContextNode} nodeContext
   */


  dvt.Diagram.prototype.renderLeafNodeFromContext = function (nodeContext) {
    var node = this.getNodeById(nodeContext.getId());

    if (node.isDisclosed()) {
      var childNodes = nodeContext.getChildNodes();

      for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        this.renderLeafNodeFromContext(childNode);
      }
    } else {
      this.renderNodeFromContext(nodeContext, false);
    }
  };
  /**
   * Render node and updates corresponding layout context for the node
   * @param {DvtDiagramLayoutContextNode} nodeContext
   * @param {boolean} forceDims flag that indicates that a node should be measured after rendering
   */


  dvt.Diagram.prototype.renderNodeFromContext = function (nodeContext, forceDims) {
    if (!nodeContext.IsRendered) {
      var node = this.getNodeById(nodeContext.getId());

      if (node.isDisclosed()) {
        //render all child nodes and apply layout context
        var layoutContext = this.CreateEmptyLayoutContext();
        layoutContext.setDirtyContext(nodeContext.LayoutContext ? nodeContext.LayoutContext.getDirtyContext() : null);
        if (this._oldDataAnimState) this._oldDataAnimState.updateStateFromLayoutContext(layoutContext);
        var childNodes = nodeContext.getChildNodes(); //render all child nodes without measurements

        for (var i = 0; i < childNodes.length; i++) {
          var childNode = childNodes[i];
          this.renderNodeFromContext(childNode, false);
          layoutContext.addNode(childNode);
        } //update child nodes dimensions after rendering is done


        for (var i = 0; i < childNodes.length; i++) {
          this.updateNodeDims(childNodes[i]);
        }

        this.ApplyLayoutContext(layoutContext);
      }

      node.render(); //update node layout context

      var padding = node.isDisclosed() ? node.getContainerPadding() : null;
      if (padding) nodeContext.setContainerPadding(padding.top, padding.right, padding.bottom, padding.left);
      nodeContext.setBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getLayoutBounds(forceDims)));
      nodeContext.setContentBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getContentBounds(forceDims)));
      nodeContext.setLabelBounds(dvt.DiagramLayoutUtils.convertRectToDiagramRect(node.getLabelBounds(forceDims)));
      nodeContext.IsRendered = true;
    }
  };
  /**
   * Recursively walks the nodes data. Creates visible nodes, but skips the rendering step.
   * The nodes will be rendered during or after the layout.
   * @param {DvtDiagramNode} parent parent node if exists
   * @param {Object} nodesData an object that represents child nodes for the level
   * @private
   */


  dvt.Diagram.prototype._prepareNodes = function (parent, nodesData) {
    if (!nodesData) return;
    var nodeDefaults = DvtDiagramStyleUtils.getNodeDefaultStyles(this);

    for (var i = 0; i < nodesData.length; i++) {
      var nodeData = DvtDiagramStyleUtils.getNodeStyles(this, nodesData[i], nodeDefaults);
      var node = DvtDiagramNode.newInstance(this, nodeData);
      var nodeId = node.getId();

      if (parent) {
        parent.addChildNodeId(nodeId);
        node.setGroupId(parent.getId());
      } else {
        this._arRootIds.push(nodeId);
      }

      this._arNodeIds.push(nodeId); // if child nodes option is defined and the node is disclosed, process the data


      if (nodeData['nodes'] && nodeData['nodes'].length > 0) {
        if (this._isNodeDisclosed(nodeId)) {
          node.setDisclosed(true);

          this._prepareNodes(node, nodeData['nodes']);
        } else {
          this._addToCollapsedArray(node);
        }
      }

      if (!node.isHidden()) {
        if (parent && parent.GetChildNodePane()) parent.GetChildNodePane().addChild(node);else this.getNodesPane().addChild(node);

        this._nodes.set(nodeId, node);
      }
    }
  };
  /**
   * Sets the disclosure state for a node
   * @param {string} nodeId the id of the node
   * @param {boolean} disclosed whether the node should be disclosed or not
   */


  dvt.Diagram.prototype.setNodeDisclosed = function (nodeId, disclosed) {
    if (disclosed != this._isNodeDisclosed(nodeId)) this.dispatchEvent(new dvt.EventFactory.newEvent(disclosed ? 'beforeExpand' : 'beforeCollapse', nodeId));
  };
  /**
   * Expands a container
   * @param {String} nodeId node id
   */


  dvt.Diagram.prototype.expand = function (nodeId) {
    var triggerEvent = false;
    var expanded = this.getOptions()['expanded'];

    if (expanded && expanded['has'] && !expanded['has'](nodeId)) {
      // key set - component created a custom element
      triggerEvent = true;
      expanded = expanded['add']([nodeId]);
      this.applyOptions({
        'expanded': expanded
      }, this.Defaults.getNoCloneObject());
    } else {
      // rely internally on this.DisclosedNodes - component created as a widget
      if (!this.DisclosedNodes) this.DisclosedNodes = [];
      var index = this.DisclosedNodes.indexOf(nodeId);

      if (index < 0) {
        this.DisclosedNodes.push(nodeId);
        triggerEvent = true;
      }
    }

    if (triggerEvent) {
      var node = this.getNodeById(nodeId);

      if (this.isDataProviderMode() && !node.getData()['nodes']) {
        var nodeOption = DvtDiagramDataUtils.GetNodeOption(this, node); // fetch data from data provider

        var thisRef = this;
        var renderCount = this._renderCount;

        var fetchDataPromise = this.getOptions()._fetchDataHandler(this.getOptions().nodeData, expanded, nodeOption, nodeId);

        fetchDataPromise.then(function (value) {
          if (renderCount === thisRef._renderCount) {
            thisRef.render(thisRef.getOptions(), thisRef.Width, thisRef.Height);
            thisRef.dispatchEvent(new dvt.EventFactory.newEvent('expand', nodeId));
          }
        });
      } else {
        this.render(this.getOptions(), this.Width, this.Height);
        this.dispatchEvent(new dvt.EventFactory.newEvent('expand', nodeId));
      }
    }
  };
  /**
   * Collapses a container node
   * @param {String} nodeId node id
   */


  dvt.Diagram.prototype.collapse = function (nodeId) {
    var triggerEvent = false;
    var expanded = this.getOptions()['expanded'];

    if (expanded && expanded['has'] && expanded['has'](nodeId)) {
      // key set - component created a custom element
      triggerEvent = true;
      expanded = expanded['delete']([nodeId]);
      this.applyOptions({
        'expanded': expanded
      }, this.Defaults.getNoCloneObject());
    } else {
      // rely internally on this.DisclosedNodes - component created as a widget
      var index = -1;

      if (this.DisclosedNodes) {
        index = this.DisclosedNodes.indexOf(nodeId);
      }

      if (index > -1) {
        this.DisclosedNodes.splice(index, 1);
        triggerEvent = true;
      }
    }

    if (triggerEvent) {
      this.render(this.getOptions(), this.Width, this.Height);
      this.dispatchEvent(new dvt.EventFactory.newEvent('collapse', nodeId));
    }
  };
  /**
   * Adds child layout context to the parent layout context
   * @param {DvtDiagramNode} parentNode parent node
   * @param {DvtDiagramLayoutContextNode} lcParentNode parent layout context
   * @param {DvtDiagramLayoutContext} layoutContext diagram layout context
   * @param {boolean} bRenderAfter flag that indicates that node is not rendered yet,
   *                  it will be render during layout or after layout is done
   * @private
   */


  dvt.Diagram.prototype._addLayoutContextForChildNodes = function (parentNode, lcParentNode, layoutContext, bRenderAfter) {
    if (parentNode.isDisclosed()) {
      var arChildIds = parentNode.getChildNodeIds();

      var lcChildNodes = this._createLayoutContextForChildNodes(lcParentNode, layoutContext, arChildIds, bRenderAfter);

      lcParentNode.setChildNodes(lcChildNodes);
    }
  };
  /**
   * Append new nodes to existing child nodes - happens during add event.
   * @param {DvtDiagramNode} parentNode parent node
   * @param {DvtDiagramLayoutContextNode} lcParentNode parent layout context
   * @param {DvtDiagramLayoutContext} layoutContext diagram layout context
   * @param {array} nodes array of nodes data to append to the layout context
   * @param {number} index an index where the nodes should be added
   * @private
   */


  dvt.Diagram.prototype._appendLayoutContextForChildNodes = function (parentNode, lcParentNode, layoutContext, nodes, index) {
    if (parentNode.isDisclosed()) {
      var arChildIds = nodes.reduce(function (acc, obj) {
        acc.push(obj['id']);
        return acc;
      }, []);

      var lcChildNodes = this._createLayoutContextForChildNodes(lcParentNode, layoutContext, arChildIds, true);

      var lcChildNodesExisting = lcParentNode.getChildNodes() || [];
      lcChildNodes = dvt.ArrayUtils.insert(lcChildNodesExisting, lcChildNodes, index);
      lcParentNode.setChildNodes(lcChildNodes);
      lcParentNode.setDisclosed(true);
      lcParentNode.SetContainerPaddingObj(dvt.BaseDiagram.getLayoutContainerPadding(parentNode.getContainerPadding()));
      lcParentNode.UpdateParentNodes();
    }
  };
  /**
   * Creates layout context for child nodes specified by array of ids.
   * @param {DvtDiagramLayoutContextNode} lcParentNode parent layout context
   * @param {DvtDiagramLayoutContext} layoutContext diagram layout context
   * @param {array} arChildIds array of child ids
   * @param {boolean} bRenderAfter flag that indicates that node is not rendered yet,
   *                  it will be render during layout or after layout is done
   * @return {array} array of layout context for the child nodes
   * @private
   */


  dvt.Diagram.prototype._createLayoutContextForChildNodes = function (lcParentNode, layoutContext, arChildIds, bRenderAfter) {
    var lcChildNodes = [];

    for (var j = 0; j < arChildIds.length; j++) {
      var childNode = this.getNodeById(arChildIds[j]);

      if (childNode.getVisible()) {
        var lcChildNode = this.CreateLayoutContextNode(childNode, null, bRenderAfter, layoutContext);
        lcChildNode.copyFrom(this._oldLayoutContext ? this._oldLayoutContext.getNodeById(arChildIds[j]) : null);
        layoutContext.addNodeToMap(lcChildNode);
        lcChildNode.setParentNode(lcParentNode);
        lcChildNodes.push(lcChildNode);

        this._addLayoutContextForChildNodes(childNode, lcChildNode, layoutContext, bRenderAfter);
      }
    }

    return lcChildNodes;
  };
  /**
   * @private
   * Checks whether the node is expanded
   * @param {string} nodeId node id
   * @return {boolean} true if the node is expanded
   */


  dvt.Diagram.prototype._isNodeDisclosed = function (nodeId) {
    var expanded = this.getOptions()['expanded'];
    if (expanded && expanded['has']) // key set - component created a custom element
      return expanded['has'](nodeId);else {
      // rely internally on this.DisclosedNodes - component created as a widget
      var disclosedNodes = this.DisclosedNodes ? this.DisclosedNodes : expanded;
      return disclosedNodes && disclosedNodes.indexOf(nodeId) > -1 || disclosedNodes && disclosedNodes.indexOf('all') > -1;
    }
    return false;
  };
  /**
   * @private
   * Checks whether the link is promoted
   * @param {object} linkData
   * @return {boolean} true if the link is promoted
   */


  dvt.Diagram.prototype._isLinkPromoted = function (linkData) {
    var startNode = this.getNodeById(linkData['startNode']);
    var endNode = this.getNodeById(linkData['endNode']); // both ends of a link are visible - not a promoted link
    // or nodes are not visible, but nothing is collapsed - hidden nodes

    if (startNode && endNode || !this._collapsedNodes) {
      return false;
    } // do not process promoted links if the promotedLinkBehavior is set to 'none'


    if (this.getOptions()['promotedLinkBehavior'] === 'none') return true;
    var startPromotedId = startNode ? startNode.getId() : this._findFirstVisibleAncestor(linkData['startNode']);
    var endPromotedId = endNode ? endNode.getId() : this._findFirstVisibleAncestor(linkData['endNode']);

    if (!(startPromotedId && endPromotedId)) {
      // start or end node for the link does not exist - could be hidden
      return false;
    } else if (startPromotedId === endPromotedId) {
      //unaccessible link that belongs to the same collapsed container - should be ignored
      return false;
    } // Use two maps to maintain promoted links.
    // One for promoted link data objects - used for rendering and layout.
    // One for keeping track of original links converted to promoted - used in data source events.


    var linkId = DvtDiagramLink.GetPromotedLinkId(this, startPromotedId, endPromotedId);
    if (!this._promotedLinksMap) this._promotedLinksMap = new (this.getCtx().ojMap)();

    if (!this._promotedLinksMap.has(linkId)) {
      this._promotedLinksMap.set(linkId, {
        'id': linkId,
        'startNode': startPromotedId,
        'endNode': endPromotedId,
        '_links': [linkData]
      });
    } else {
      this._promotedLinksMap.get(linkId)['_links'].push(linkData);
    }

    if (!this._linkToPromotedMap) this._linkToPromotedMap = new (this.getCtx().ojMap)();

    this._linkToPromotedMap.set(linkData['id'], linkId);

    return true;
  };
  /**
   * Adds a node to an array of collapsed nodes
   * @param {DvtDiagramNode} node a collapsed node
   * @private
   */


  dvt.Diagram.prototype._addToCollapsedArray = function (node) {
    if (!this._collapsedNodes) this._collapsedNodes = [];

    this._collapsedNodes.push(node);
  };
  /**
   * Searches for the first visible container for the child node
   * @param {string} childId id of a child node to find
   * @return {string} ancestor id or null if a child is not found
   * @private
   */


  dvt.Diagram.prototype._findFirstVisibleAncestor = function (childId) {
    //recursive search in nodes data for a child id
    var context = this.getCtx();

    var isDescendant = function isDescendant(data, chId) {
      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (dvt.BaseDiagram.compareValues(context, data[i]['id'], chId) || isDescendant(data[i]['nodes'], chId)) {
            return true;
          }
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


  dvt.Diagram.prototype._updateKeyboardFocusEffect = function () {
    var navigable = this.getEventManager().getFocus();
    var isShowingKeyboardFocusEffect = false;

    if (navigable) {
      var newNavigable;

      if (navigable instanceof DvtDiagramNode) {
        newNavigable = this.getNodeById(navigable.getId());
      } else if (navigable instanceof DvtDiagramLink) {
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


  dvt.Diagram.prototype.clearDisclosedState = function () {
    this.DisclosedNodes = null;
  };
  /**
   * @protected
   * Creates or updates link creation feedback
   * @param {dvt.BaseEvent} event DnD dragOver event
   */


  dvt.Diagram.prototype.ShowLinkCreationFeedback = function (event) {
    if (this.getEventManager().LinkCreationStarted) {
      var stagePos = this._context.pageToStageCoords(event.pageX, event.pageY);

      var localPos = this.getPanZoomCanvas().getContentPane().stageToLocal({
        x: stagePos.x,
        y: stagePos.y
      });

      if (this._linkCreationFeedBack) {
        var points = this._linkCreationFeedBack.GetCreationFeedbackPoints(localPos);

        this._linkCreationFeedBack.setPoints(points);
      } else {
        var obj = this.getEventManager().DragSource.getDragObject();

        if (obj instanceof DvtDiagramNode) {
          var startStagePos = this.getEventManager().DragSource.getDragCoords();
          var startLocalPos = this.getPanZoomCanvas().getContentPane().stageToLocal({
            x: startStagePos.x,
            y: startStagePos.y
          });
          var linkDefaults = this.getOptions()['styleDefaults']['linkDefaults'];
          DvtDiagramStyleUtils.prepareLinkStyle(linkDefaults, 'style'); //get additional styles from callback

          var styleCallback = this.getOptions()['dnd']['drag']['ports']['linkStyle'];

          if (styleCallback && typeof styleCallback === 'function') {
            var linkFeedbackStyle = styleCallback({
              'dataContext': obj.getDataContext(),
              'portElement': obj.__dragPort
            });

            if (linkFeedbackStyle) {
              linkDefaults['style'] = dvt.JsonUtils.merge(linkFeedbackStyle['svgStyle'], linkDefaults['style']);
              linkDefaults['svgClassName'] = linkFeedbackStyle['svgClassName'] || linkDefaults['className'];
            }
          }

          var linkData = {
            'id': 'linkFeedback',
            'startNode': obj.getId(),
            'endNode': obj.getId()
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


  dvt.Diagram.prototype.HideLinkCreationFeedback = function () {
    this.getNodesPane().removeChild(this._linkCreationFeedBack);
    this._linkCreationFeedBack = null;
  };
  /**
   * Data source change event handler
   * @param {string} type event type - add, remove or change
   * @param {Object} event event data
   */


  dvt.Diagram.prototype.handleDataSourceChangeEvent = function (type, event) {
    var animationOnDataChange = DvtDiagramStyleUtils.getAnimationOnDataChange(this);

    if (animationOnDataChange !== 'none') {
      this._oldDataAnimState = new DvtDiagramDataAnimationState(this, type, event);
    }

    this._currentViewport = this.getPanZoomCanvas().getViewport(); //reset pan constraints

    if (this.IsPanningEnabled()) {
      var pzc = this.getPanZoomCanvas();
      pzc.setMinPanY(null);
      pzc.setMaxPanY(null);
      pzc.setMinPanX(null);
      pzc.setMaxPanX(null);
    }

    var nodes = event['data']['nodes'];
    var links = event['data']['links'];
    var parentId, parentNode;

    if (type == 'add') {
      parentId = event['parentId'];
      parentNode = parentId ? this.getNodeById(parentId) : null;

      if (this.getOptions()['expanded'] === "all") {
        if (nodes) {
          var disclosedNodes = this.DisclosedNodes;

          var updateDisclosed = function updateDisclosed(nodeArr) {
            for (var i = 0; i < nodeArr.length; i++) {
              disclosedNodes.push(nodeArr[i].id);
              if (nodeArr[i].nodes) updateDisclosed(nodeArr[i].nodes);
            }
          };

          updateDisclosed(nodes);
        }
      }

      if (parentNode) {
        parentNode.appendChildNodesData(nodes, event['index']);

        if (this._isNodeDisclosed(parentId)) {
          parentNode.setDisclosed(true);

          this._prepareNodes(parentNode, nodes);
        }
      } else {
        this._prepareNodes(null, nodes);
      }

      this.renderLinks(links);
    } else if (type == 'change') {
      if (nodes) {
        var nodeDefaults = DvtDiagramStyleUtils.getNodeDefaultStyles(this);

        for (var i = 0; i < nodes.length; i++) {
          var node = this.getNodeById(nodes[i]['id']);

          if (node) {
            var newData = DvtDiagramStyleUtils.getNodeStyles(this, nodes[i], nodeDefaults);
            node.setData(newData);
          }
        }
      }

      if (links) {
        // there are multiple way a link might change including start and end node change,
        // the link might also be inside of a promoted link. Plain data update is not sufficient for the link
        this._removeLinks(links);

        this.renderLinks(links);
      }
    } else if (type == 'remove') {
      parentId = event['parentId'];
      parentNode = parentId ? this.getNodeById(parentId) : null;

      if (parentNode) {
        this._removeNodes(parentNode, nodes);

        parentNode.removeChildNodesData(nodes);

        if (!parentNode.getData()['nodes'] || parentNode.getData()['nodes'].length === 0) {
          parentNode.setDisclosed(false);
        }
      } else {
        this._removeNodes(null, nodes);
      }

      this._removeLinks(links);
    } //update animation state with new nodes and links objects if necessary


    this._oldDataAnimState && this._oldDataAnimState.updateStateFromEvent(type, event);

    this._updateLayoutContext(type, event);

    var emptyDiagram = this.GetAllNodes().length === 0;

    if (!emptyDiagram) {
      this._renderCount++;
      var res = this.layout();
      var thisRef = this;
      var renderCount = this._renderCount;
      res.then(function () {
        if (renderCount === thisRef._renderCount) {
          thisRef._partialUpdate = true;

          thisRef._updateOverview(type, event);

          thisRef._processContent(false);

          thisRef._partialUpdate = false;
        }
      }, //success
      function () {
        if (renderCount === thisRef._renderCount) {
          thisRef.removeChild(thisRef._oldPanZoomCanvas);
          thisRef._oldPanZoomCanvas = null;
          thisRef._bRendered = true;
          this._currentViewport = null;
        }
      } //failure
      );
    } else {
      this._processContent(emptyDiagram);
    }
  };
  /**
   * Updates overview window if exists according to the event type and data - changes, adds or remvoes nodes and links
   * @param {string} type event type
   * @param {Object} event DiagramDataSource event
   * @private
   */


  dvt.Diagram.prototype._updateOverview = function (type, event) {
    if (this.Overview) {
      DvtDiagramOverviewUtils.UpdateOverviewContent(this, this.Overview, type, event);
    }
  };
  /**
   * Updates existing layout context according to the event type and data - changes, adds or remvoes nodes and links
   * @param {string} type event type
   * @param {Object} event DiagramDataSource event
   * @private
   */


  dvt.Diagram.prototype._updateLayoutContext = function (type, event) {
    if (!this._layoutContext) {
      this._layoutContext = this.CreateEmptyLayoutContext();
    }

    var layoutContext = this._layoutContext;
    layoutContext.setEventData({
      'type': type,
      'data': event
    });
    var nodes = event['data']['nodes'];
    var links = event['data']['links'];
    var i, nc, nodeId, pc, parentNode, linkId;

    if (event['parentId']) {
      pc = layoutContext.getNodeById(event['parentId']);
      parentNode = this.getNodeById(event['parentId']);
    }

    if (type == 'add') {
      if (nodes) {
        // Add layout context for the nodes - either append node context
        // to the existing parent or add node context to the top level
        if (pc && parentNode) {
          pc.Reset();

          this._appendLayoutContextForChildNodes(parentNode, pc, layoutContext, nodes, event['index']);
        } else {
          for (i = 0; i < nodes.length; i++) {
            nodeId = nodes[i]['id'];
            if (!this.getNodeById(nodeId)) continue;
            nc = this.CreateLayoutContextNode(this.getNodeById(nodeId), null, true, layoutContext);

            this._addLayoutContextForChildNodes(this.getNodeById(nodeId), nc, layoutContext, true);

            layoutContext.addNode(nc);
          }
        }
      }

      if (links) {
        for (i = 0; i < links.length; i++) {
          linkId = links[i]['id'];
          var link = this.getLinkById(linkId) || this.getLinkById(this._linkToPromotedMap.get(linkId));

          if (link) {
            if (layoutContext.getLinkById(link.getId())) {
              // links exists - case of promoted link
              continue;
            }

            var startId = link.getData()['startNode'];
            var endId = link.getData()['endNode'];

            if (layoutContext.getNodeById(startId) && layoutContext.getNodeById(endId)) {
              layoutContext.addLink(this.CreateLayoutContextLink(link, startId, endId, null, layoutContext));
            }
          }
        }
      }
    } else if (type == 'change') {
      if (nodes) {
        // Update nodes
        for (i = 0; i < nodes.length; i++) {
          nodeId = nodes[i]['id'];
          nc = layoutContext.getNodeById(nodeId);

          if (nc) {
            nc.Reset();
            nc.UpdateParentNodes();
          }
        }
      }

      if (links) {
        // Update links - since link data could be updated in a number of ways
        // including updating start and end nodes, the promoted links might be affected.
        // To update links - remove links that don't exist anymore. Then go throught
        // list of updated link data, find corresponding link context and recreate it.
        for (i = layoutContext.getLinkCount() - 1; i >= 0; i--) {
          var lc = layoutContext.getLinkByIndex(i);

          if (!this._links.get(lc.getId())) {
            layoutContext.removeLink(lc);
          }
        }

        for (i = 0; i < links.length; i++) {
          linkId = links[i]['id'];
          var link = this.getLinkById(linkId) || this.getLinkById(this._linkToPromotedMap.get(linkId));

          if (link) {
            layoutContext.removeLink(layoutContext.getLinkById(link.getId()));
            var startId = link.getData()['startNode'];
            var endId = link.getData()['endNode'];

            if (layoutContext.getNodeById(startId) && layoutContext.getNodeById(endId)) {
              layoutContext.addLink(this.CreateLayoutContextLink(link, startId, endId, null, layoutContext));
            }
          }
        }
      }
    } else if (type == 'remove') {
      if (nodes) {
        // Remove node context for the requested nodes,
        // set parent nodes as not rendered,
        // update disclosure state of the parent node
        for (i = 0; i < nodes.length; i++) {
          nodeId = nodes[i]['id'];
          nc = layoutContext.getNodeById(nodeId);
          layoutContext.removeNode(pc, nc);
        }

        if (pc && parentNode) {
          pc.Reset();
          pc.UpdateParentNodes();
          pc.setDisclosed(parentNode.isDisclosed());
        }
      } // Run through layout context for the links and remove all the links
      // that do not exist in the links map. Even if the links might not be
      // specified for the removal by the event, connecting links will be
      // removed when corresponding start or end node is removed.


      for (i = layoutContext.getLinkCount() - 1; i >= 0; i--) {
        var lc = layoutContext.getLinkByIndex(i);

        if (!this._links.get(lc.getId())) {
          layoutContext.removeLink(lc);
        }
      }
    }
  };
  /**
   * @private
   * Returns layout context object. Crates one of necessary
   * @return {DvtDiagramLayoutContext} layout context for the diagram
   */


  dvt.Diagram.prototype._getLayoutContext = function () {
    if (!this._layoutContext) {
      var layoutContext = this.CreateEmptyLayoutContext(); // add all nodes starting with root nodes

      for (var n = 0; n < this._arRootIds.length; n++) {
        var nodeId = this._arRootIds[n];
        if (!this.getNodeById(nodeId)) continue;
        var bRenderAfter = this._bRendered ? false : true;
        var rootNode = this.getNodeById(nodeId);
        var lcRootNode = this.CreateLayoutContextNode(rootNode, null, bRenderAfter, layoutContext);
        lcRootNode.copyFrom(this._oldLayoutContext ? this._oldLayoutContext.getNodeById(nodeId) : null);

        this._addLayoutContextForChildNodes(rootNode, lcRootNode, layoutContext, bRenderAfter);

        layoutContext.addNode(lcRootNode);
      } // add all links


      var thisRef = this;

      this._links.forEach(function (link, linkId, map) {
        var startId = link.getData()['startNode'];
        var endId = link.getData()['endNode'];

        if (layoutContext.getNodeById(startId) && layoutContext.getNodeById(endId)) {
          var lcLink = thisRef.CreateLayoutContextLink(link, startId, endId, null, layoutContext);
          lcLink.copyFrom(thisRef._oldLayoutContext ? thisRef._oldLayoutContext.getLinkById(linkId) : null);
          layoutContext.addLink(lcLink);
        }
      });

      this._layoutContext = layoutContext;
      this._oldLayoutContext = null;
    }

    return this._layoutContext;
  };
  /**
   * @private
   * Removes specified nodes
   * @param {DvtDiagramNode} parent parend node
   * @param {array} nodesData an array of nodes data objects to remove
   */


  dvt.Diagram.prototype._removeNodes = function (parent, nodesData) {
    if (!nodesData || parent && !parent.isDisclosed()) {
      return;
    }

    var linksToRemove = [];

    for (var i = 0; i < nodesData.length; i++) {
      var nodeId = nodesData[i]['id'];
      var node = this.getNodeById(nodeId); //remove child nodes

      this._removeNodes(node, node.getData()['nodes']); //remove all links connected to the node


      this._links.forEach(function (link, linkId, map) {
        if (link.getStartId() == nodeId || link.getEndId() == nodeId) {
          linksToRemove.push(link.getData());
        }
      }); //remove itself


      if (parent) {
        parent.removeChildNode(node);
      } else {
        dvt.ArrayUtils.removeItem(this._arRootIds, nodeId);
        this.getNodesPane().removeChild(node);
      }

      dvt.ArrayUtils.removeItem(this._arNodeIds, nodeId);

      this._nodes.delete(nodeId);
    }

    this._removeLinks(linksToRemove);
  };
  /**
   * @private
   * Removes specified links
   * @param {array} linksData an array of link data objects to remove
   */


  dvt.Diagram.prototype._removeLinks = function (linksData) {
    if (!linksData || linksData.length == 0) {
      return;
    }

    for (var i = 0; i < linksData.length; i++) {
      var linkId = linksData[i]['id'];
      var link = this.getLinkById(linkId);

      if (link) {
        var parent = link.getParent();
        parent.removeChild(link);
        var startNode = this.getNodeById(link.getStartId());
        var endNode = this.getNodeById(link.getEndId());
        startNode && startNode.removeOutLinkId(linkId);
        endNode && endNode.removeInLinkId(linkId);
        dvt.ArrayUtils.removeItem(this._arLinkIds, linkId);

        this._links.delete(linkId);
      } else if (this._linkToPromotedMap && this._linkToPromotedMap.has(linkId)) {
        var promotedLinkId = this._linkToPromotedMap.get(linkId);

        var promotedLink = this._links.get(promotedLinkId);

        var data = promotedLink ? promotedLink.getData()['_links'] : null;

        if (data && data.length == 1 && data[0]['id'] == linkId) {
          //just remove the promoted link
          var parent = promotedLink.getParent();
          parent.removeChild(promotedLink);
          var startNode = this.getNodeById(promotedLink.getStartId());
          var endNode = this.getNodeById(promotedLink.getEndId());
          startNode && startNode.removeOutLinkId(promotedLinkId);
          endNode && endNode.removeInLinkId(promotedLinkId);
          dvt.ArrayUtils.removeItem(this._arLinkIds, promotedLink.getId());

          this._links.delete(promotedLink.getId());

          this._promotedLinksMap.delete(promotedLink.getId());

          this._linkToPromotedMap.delete(linkId);
        } else if (data) {
          // don't remove the promoted link, but update its links data
          // don't need to update layout context for the link, since it has a reference to the data
          for (var i = 0; i < data.length; i++) {
            if (dvt.BaseDiagram.compareValues(this.getCtx(), data[i]['id'], linkId)) {
              data.splice(i, 1);
            }
          }

          this._linkToPromotedMap.delete(linkId);
        }
      }
    }
  };
  /**
   * Handles the touch start event
   */


  dvt.Diagram.prototype.handleTouchStart = function () {} // noop: Called from HandleImmediateTouchStartInternal

  /**
   * Handles the touch end event
   */
  ;

  dvt.Diagram.prototype.handleTouchEnd = function () {
    this._clearTouchEventContent();

    if (this._touchEventContentDiagramObjRef && this._touchEventContentDiagramObjRef.handleTouchEnd) {
      // Clear the states in the node/link as this will not be called
      // if the event is not ended on them
      this._touchEventContentDiagramObjRef.handleTouchEnd(); // Null out the reference as it need not be called again for this diagram obj


      this._touchEventContentDiagramObjRef = null;
    }
  };
  /**
   * Stores the content in the touch event pane
   * @param {Element|Array<Element>} content The content that has to be stored
   * @param {DvtDiagramNode|DvtDiagramLink} diagramObj The node/link that is storing the content
   */


  dvt.Diagram.prototype.storeTouchEventContent = function (content, diagramObj) {
    if (!this.getTouchEventPane() || !content) {
      return;
    } // We support storing only one diagram object's content at any given time.


    this._touchEventContentDiagramObjRef = diagramObj;

    if (content.namespaceURI === dvt.ToolkitUtils.SVG_NS) {
      dvt.ToolkitUtils.appendChildElem(this.getTouchEventPane().getElem(), content);
    } else if (Array.isArray(content)) {
      content.forEach(function (node) {
        dvt.ToolkitUtils.appendChildElem(this.getTouchEventPane().getElem(), node);
      }.bind(this));
    }
  };
  /**
   * Removes the contents from the touch content pane
   */


  dvt.Diagram.prototype._clearTouchEventContent = function () {
    if (!this.getTouchEventPane()) {
      return;
    }

    var touchEventPaneElem = this.getTouchEventPane().getElem();

    while (touchEventPaneElem.firstChild) {
      touchEventPaneElem.removeChild(touchEventPaneElem.firstChild);
    }
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Category rollover handler for Diagram
   * @param {function} callback A function that responds to component events.
   * @param {object} callbackObj The object instance that the callback function is defined on.
   * @class DvtDiagramCategoryRolloverHandler
   * @extends {dvt.CategoryRolloverHandler}
   * @constructor
   */


  var DvtDiagramCategoryRolloverHandler = function DvtDiagramCategoryRolloverHandler(callback, callbackObj) {
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

  DvtDiagramCategoryRolloverHandler.prototype.GetRolloverCallback = function (event, objs, bAnyMatched, customAlpha) {
    var callback = function callback() {
      this.SetHighlightMode(true);

      this._diagram.processEvent(event);
    };

    return dvt.Obj.createCallback(this, callback);
  };
  /**
   * @override
   */


  DvtDiagramCategoryRolloverHandler.prototype.GetRolloutCallback = function (event, objs, bAnyMatched, customAlpha) {
    var callback = function callback() {
      this.SetHighlightModeTimeout();

      this._diagram.processEvent(event);
    };

    return dvt.Obj.createCallback(this, callback);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @param {dvt.Context} context The rendering context.
   * @extends {dvt.BaseComponentDefaults}
   */


  var DvtDiagramDefaults = function DvtDiagramDefaults(context) {
    this.Init({
      'alta': DvtDiagramDefaults.SKIN_ALTA
    }, context);
  };

  dvt.Obj.createSubclass(DvtDiagramDefaults, dvt.BaseComponentDefaults, 'DvtDiagramDefaults');
  /**
   * Defaults for version 1.
   */

  DvtDiagramDefaults.SKIN_ALTA = {
    'skin': dvt.CSSStyle.SKIN_ALTA,
    'emptyText': null,
    'selectionMode': 'none',
    'animationOnDataChange': 'none',
    'animationOnDisplay': 'none',
    'maxZoom': 1.0,
    'highlightMatch': 'all',
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
      '_highlightAlpha': .1,
      '_overviewStyles': {
        'overview': {
          'backgroundColor': 'rgb(228,229,230)'
        },
        'viewport': {
          'backgroundColor': 'rgb(255,255,255)',
          'borderColor': 'rgb(74,76,78)'
        },
        'node': {
          'shape': 'inherit'
        }
      },
      'nodeDefaults': {
        '_containerStyle': new dvt.CSSStyle('border-color:#abb3ba;background-color:#f9f9f9;border-width:.5px;border-radius:1px;padding-top:20px;padding-left:20px;padding-bottom:20px;padding-right:20px;'),
        'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_12 + 'color:#383A47'),
        'hoverInnerColor': 'rgb(255,255,255)',
        'hoverOuterColor': 'rgba(0,0,0, .3)',
        'selectionColor': 'rgb(0,0,0)',
        'icon': {
          'width': 10,
          'height': 10,
          'fillPattern': 'none',
          'shape': 'circle'
        }
      },
      'linkDefaults': {
        'startConnectorType': 'none',
        'endConnectorType': 'none',
        'width': 1,
        '_style': {
          '_type': 'solid'
        },
        'hoverInnerColor': 'rgb(255,255,255)',
        'hoverOuterColor': 'rgba(0,0,0, .3)',
        'selectionColor': 'rgb(0,0,0)',
        'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_12 + 'color:#383A47'),
        '_hitDetectionOffset': 10
      },
      'promotedLink': {
        'startConnectorType': 'none',
        'endConnectorType': 'none',
        'width': 1,
        '_style': {
          '_type': 'dot',
          'strokeDasharray': '2,3'
        },
        'color': '#778999',
        'hoverInnerColor': 'rgb(255,255,255)',
        'hoverOuterColor': 'rgba(0,0,0, .3)',
        'selectionColor': 'rgb(0,0,0)',
        '_hitDetectionOffset': 10
      }
    }
  };
  /**
   * @override
   */

  DvtDiagramDefaults.prototype.getNoCloneObject = function () {
    return {
      'data': true,
      'nodeData': true,
      'linkData': true,
      'nodes': true,
      'links': true
    };
  };
  /**
   * @license
   * Copyright (c) 2017 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */
  //
  // $Header: dsstools/modules/dvt-shared-js/src/META-INF/bi/sharedJS/toolkit/diagram/DvtDiagramDataAnimationState.js /st_jdevadf_jet.trunk/1 2017/06/19 15:30:24  Exp $
  //
  // DvtDiagramDataAminationState.js
  //
  //
  //    NAME
  //     DvtDiagramDataAminationState.js - <one-line expansion of the name>
  //
  //    DESCRIPTION
  //     <short description of component this file declares/defines>
  //
  //    NOTES
  //     <other useful comments, qualifications, etc. >
  //
  //    MODIFIED  (MM/DD/YY)
  //       06/05/17 - Created
  //

  /**
   * @protected
   * Defines the data animation state for DvtDiagram
   * @class DvtDiagramDataAnimationState
   * @constructor
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {string} type event type
   * @param {Object} event event data
   * initializing this context
   */


  var DvtDiagramDataAnimationState = function DvtDiagramDataAnimationState(diagram, type, event) {
    this.Init(diagram, type, event);
  };

  dvt.Obj.createSubclass(DvtDiagramDataAnimationState, dvt.Obj, 'DvtDiagramDataAnimationState');
  /**
   * @protected
   * Initialize the data animation state.
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {string} type event type
   * @param {Object} event event data
   */

  DvtDiagramDataAnimationState.prototype.Init = function (diagram, type, event) {
    this._diagram = diagram;
    this._context = diagram.getCtx();
    this._nodes = [];
    this._newNodes = [];
    this._links = [];
    this._newLinks = [];
    this._processedObjMap = new this._context.ojMap();
    this.PanZoomMatrix = this._diagram.getPanZoomCanvas().getContentPane().getMatrix();
    this.IsPartialUpdate = type && event ? true : false;

    if (diagram.Overview) {
      this.Overview = this.IsPartialUpdate ? diagram.Overview.CreateAnimationClone() : diagram.Overview;
    }

    this.NodesMap = this._diagram.GetAllNodesMap();
    this.LinksMap = this._diagram.GetAllLinksMap();

    this._setNodes(type, event);

    this._setLinks(type, event);
  };
  /**
   * Get the id of the state.
   * @return {string}
   */


  DvtDiagramDataAnimationState.prototype.getId = function () {
    return this._diagram.getId();
  };
  /**
   * Gets options for the diagram state
   * @return {object} option
   */


  DvtDiagramDataAnimationState.prototype.getOptions = function () {
    return this._diagram.getOptions();
  };
  /**
   * Gets nodes used for diagram animation
   * @return {array} flat array of nodes - roots for complete refresh
   *                or an array of modified nodes for partial update
   */


  DvtDiagramDataAnimationState.prototype.getNodes = function () {
    return this._nodes;
  };
  /**
   * Gets links used for diagram animation
   * @return {array} an array of links to animate
   */


  DvtDiagramDataAnimationState.prototype.getLinks = function () {
    return this._links;
  };
  /**
   * Gets an array of new nodes in the updated diagram, that should be used for animation
   * @return {array} an array of new node states
   */


  DvtDiagramDataAnimationState.prototype.getNewNodes = function () {
    return this._newNodes;
  };
  /**
   * Gets an array of new links in the updated diagram, that should be used for animation
   * @return {array} an array of new link states
   */


  DvtDiagramDataAnimationState.prototype.getNewLinks = function () {
    return this._newLinks;
  };
  /**
   * Updates states using objects from event - populates new links and nodes arrays with new objects.
   * Done as a second step during event updates.
   * @param {string} type event type if applicable
   * @param {Object} event event data
   */


  DvtDiagramDataAnimationState.prototype.updateStateFromEvent = function (type, event) {
    if (!event) return;
    var nodes = event['data']['nodes'];
    var links = event['data']['links'];
    var i, link, linkId;

    if (type == 'add') {
      //update nodes
      for (i = 0; nodes && i < nodes.length; i++) {
        var node = this._diagram.getNodeById(nodes[i]['id']);

        if (node) {
          // animate new nodes if they are added to the top level
          // or already disclosed container
          if (this._wasParentDisclosed === true) this._newNodes.push(node);

          this._processedObjMap.set(node.getId(), true);
        }
      }

      for (i = 0; links && i < links.length; i++) {
        linkId = links[i]['id'];
        link = this._diagram.getLinkById(linkId) || this._diagram._linkToPromotedMap && this._diagram.getLinkById(this._diagram._linkToPromotedMap[linkId]);

        if (link) {
          this._newLinks.push(link);

          this._processedObjMap.set(link.getId(), true);
        }
      }
    } else if (type == 'change') {
      for (i = 0; links && i < links.length; i++) {
        linkId = links[i]['id'];
        link = this._diagram.getLinkById(linkId) || this._diagram._linkToPromotedMap && this._diagram.getLinkById(this._diagram._linkToPromotedMap[linkId]);

        if (link) {
          this._newLinks.push(link);

          this._processedObjMap.set(link.getId(), true);
        }
      }
    } // we don't have to do anything for remove, since old objects are populated and new ones are not created

  };
  /**
   * Updates states using objects from dirty content. The objects processed earlier during event updates will be skipped.
   * @param {DvtDiagramLayoutContext} layoutContext diagram layout context
   */


  DvtDiagramDataAnimationState.prototype.updateStateFromLayoutContext = function (layoutContext) {
    if (this.IsPartialUpdate) {
      var thisRef = this;
      var dirtyLayoutContext = layoutContext.getDirtyContext();
      dirtyLayoutContext.forEach(function (obj, objId, map) {
        if (!thisRef._processedObjMap.has(objId)) {
          var obj = thisRef._diagram.getNodeById(objId) || thisRef._diagram.getLinkById(objId);

          if (obj instanceof DvtDiagramNode) {
            thisRef._nodes.push(obj.getAnimationState());

            thisRef._newNodes.push(obj);

            thisRef._processedObjMap.set(objId, true);
          } else if (obj instanceof DvtDiagramLink) {
            thisRef._links.push(obj.getAnimationState());

            thisRef._newLinks.push(obj);

            thisRef._processedObjMap.set(objId, true);
          }
        }
      });
    }
  };
  /**
   * Sets nodes used for diagram animation
   * @param {string} type event type if applicable
   * @param {Object} event event data
   * @private
   */


  DvtDiagramDataAnimationState.prototype._setNodes = function (type, event) {
    if (this.IsPartialUpdate) {
      var nodes = event['data']['nodes'];
      var parentId = event['parentId'];

      if (type == 'add') {
        this._addAncestorStates(parentId);
      } else if (type == 'change') {
        for (var i = 0; nodes && i < nodes.length; i++) {
          var node = this._diagram.getNodeById(nodes[i]['id']);

          if (node) {
            this._addAncestorStates(node.getGroupId());

            this._nodes.push(node.getAnimationState());

            this._newNodes.push(node);

            this._processedObjMap.set(node.getId(), true);
          }
        }
      } else if (type == 'remove') {
        this._addAncestorStates(parentId);

        if (nodes && !parentId) {
          for (var i = 0; i < nodes.length; i++) {
            var node = this._diagram.getNodeById(nodes[i]['id']);

            if (node) {
              this._nodes.push(node);

              this._processedObjMap.set(node.getId(), true);
            }
          }
        }
      }
    } else {
      this._nodes = this._diagram.GetRootNodeObjects();
    }
  };
  /**
   * Sets links used for diagram animation
   * @param {string} type event type if applicable
   * @param {Object} event event data
   * @private
   */


  DvtDiagramDataAnimationState.prototype._setLinks = function (type, event) {
    if (this.IsPartialUpdate) {
      var links = event['data']['links'];
      if (!links) return;
      var i, link, linkId;

      if (type == 'change') {
        for (i = 0; i < links.length; i++) {
          linkId = links[i]['id'];
          link = this._diagram.getLinkById(linkId) || this._diagram._linkToPromotedMap && this._diagram.getLinkById(this._diagram._linkToPromotedMap[linkId]);

          if (link) {
            this._links.push(link.getAnimationState());

            this._processedObjMap.set(link.getId(), true);
          }
        }
      } else if (type == 'remove') {
        for (i = 0; i < links.length; i++) {
          linkId = links[i]['id'];
          link = this._diagram.getLinkById(linkId) || this._diagram._linkToPromotedMap && this._diagram.getLinkById(this._diagram._linkToPromotedMap[linkId]);

          if (link) {
            this._links.push(link);

            this._processedObjMap.set(link.getId(), true);
          }
        }
      }
    } else {
      this._links = this._diagram.GetAllLinkObjects();
    }
  };
  /**
   * Populates new and old states for updated container nodes
   * @param {string} parentId id for updated container
   * @private
   */


  DvtDiagramDataAnimationState.prototype._addAncestorStates = function (parentId) {
    var parentNode = parentId ? this._diagram.getNodeById(parentId) : null; // use this member during add nodes operation - animate new nodes when they are
    // added to to the top level or an already disclosed container

    this._wasParentDisclosed = parentNode ? parentNode.isDisclosed() : true;

    while (parentNode) {
      var keepOriginal = dvt.BaseDiagram.compareValues(this._context, parentNode.getId(), parentId) || parentNode.isDisclosed() && this._diagram.getOptions()['renderer'];

      var oldState = parentNode.getAnimationState(keepOriginal);

      this._nodes.push(oldState);

      this._newNodes.push(parentNode);

      this._processedObjMap.set(parentNode.getId(), true);

      parentNode = parentNode.getGroupId() ? this._diagram.getNodeById(parentNode.getGroupId()) : null;
    }
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Animation handler for Diagram
   * @param {dvt.Context} context the platform specific context object
   * @param {dvt.Container} deleteContainer the container where deletes should be moved for animation
   * @param {object} oldDiagram an object representing the old diagram state
   * @param {dvt.Diagram} newDiagram the diagram component
   * @class DvtDiagramDataAnimationHandler
   * @constructor
   */


  var DvtDiagramDataAnimationHandler = function DvtDiagramDataAnimationHandler(context, deleteContainer, oldDiagram, newDiagram) {
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

  DvtDiagramDataAnimationHandler.prototype.Init = function (context, deleteContainer, oldDiagram, newDiagram) {
    DvtDiagramDataAnimationHandler.superclass.Init.call(this, context, deleteContainer);
    this._oldDiagram = oldDiagram;
    this._newDiagram = newDiagram;
  };
  /**
   * Returns the old diagram state
   * @return {object} an object representing the old diagram state
   */


  DvtDiagramDataAnimationHandler.prototype.getOldDiagram = function () {
    return this._oldDiagram;
  };
  /**
   * Returns the new diagram state
   * @return {dvt.Diagram} the diagram component
   */


  DvtDiagramDataAnimationHandler.prototype.getNewDiagram = function () {
    return this._newDiagram;
  };
  /**
   * Gets the animation duration
   * @return {number} the animation duration
   */


  DvtDiagramDataAnimationHandler.prototype.getAnimationDuration = function () {
    return DvtDiagramStyleUtils.getAnimationDuration(this._oldDiagram);
  };
  /**
   * @override
   */


  DvtDiagramDataAnimationHandler.prototype.constructAnimation = function (oldList, newList) {
    var bLinks = false;

    if (newList && newList.length > 0) {
      bLinks = newList[0] instanceof DvtDiagramLink;
    }

    if (bLinks && !this.getCtx().isOffscreen()) {
      var context = this.getCtx(); // process diagram links - check expanding a promoted link or collapsing multiple into a promoted link

      var oldLinksMap = DvtDiagramDataAnimationHandler._expandLinksArrayToMap(context, oldList),
          newLinksMap = DvtDiagramDataAnimationHandler._expandLinksArrayToMap(context, newList);

      var oldLink, newLink;
      var skip = new context.ojMap();
      var thisRef = this;
      oldLinksMap.forEach(function (link, linkId, map) {
        oldLink = link;
        newLink = newLinksMap.get(linkId); //do nothing if the link is invisible

        if (!newLink) {
          if (thisRef.getNewDiagram().GetAllLinks().indexOf(oldLink.getId()) == -1) {
            oldLink.animateDelete(thisRef);
          }
        } //identical direct links - update
        else if (!oldLink.isPromoted() && !newLink.isPromoted()) {
            newLink.animateUpdate(thisRef, oldLink);
          } //match found but one or both of the links is inside of promoted link - collapsed, expanded or update case
          else {
              var oldLinksCount = oldLink.isPromoted() ? oldLink.getData()['_links'].length : 1;
              var newLinksCount = newLink.isPromoted() ? newLink.getData()['_links'].length : 1;

              if (oldLinksCount > newLinksCount && !skip.has(oldLink.getId())) {
                //expand
                thisRef._constructExpandCollapseAnimation(oldLink, newLinksMap, skip, true);
              } else if (oldLinksCount < newLinksCount && !skip.has(newLink.getId())) {
                //collapse
                thisRef._constructExpandCollapseAnimation(newLink, oldLinksMap, skip, false);
              } else if (oldLinksCount == newLinksCount && !skip.has(newLink.getId())) {
                //a single link inside of promoted - plain update, no need to update that link multiple times
                newLink.animateUpdate(thisRef, oldLink);
                skip.set(newLink.getId(), true);
              }
            }
      }); //check for inserts

      newLinksMap.forEach(function (link, linkId, map) {
        oldLink = oldLinksMap.get(linkId);
        newLink = link; // if no match found, check if the link is invisible, do nothing for invisible link

        if (!oldLink && !thisRef.getOldDiagram().LinksMap.has(newLink.getId())) {
          newLink.animateInsert(thisRef);
        }
      });
    } else {
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


  DvtDiagramDataAnimationHandler.prototype._constructExpandCollapseAnimation = function (linkToAnimate, testLinksMap, skipMap, expandFlag) {
    var linksToAnimate = [];
    var consolidatedLinks = linkToAnimate.getData()['_links'];

    for (var li = 0; li < consolidatedLinks.length; li++) {
      var testLink = testLinksMap.get(consolidatedLinks[li]['id']);

      if (testLink && linksToAnimate.indexOf(testLink) === -1) {
        linksToAnimate.push(testLink);
      }
    }

    if (linksToAnimate.length > 0) {
      if (expandFlag) linkToAnimate.animateExpand(this, linksToAnimate);else linkToAnimate.animateCollapse(this, linksToAnimate);
      skipMap.set(linkToAnimate.getId(), true);
    }
  };
  /**
   * Helper method that converts an array of links in to a map.
   * The method also expands promoted links into single links in order to support expand and collapse animation
   * @param {array} linkArray array of links
   * @return {Object} map of links stored by id
   * @private
   */


  DvtDiagramDataAnimationHandler._expandLinksArrayToMap = function (context, linkArray) {
    var list = new context.ojMap();

    for (var i = 0; i < linkArray.length; i++) {
      var link = linkArray[i];

      if (!link) {
        continue;
      }

      if (link.isPromoted()) {
        var consolidatedLinks = link.getData()['_links'];

        for (var li = 0; li < consolidatedLinks.length; li++) {
          list.set(consolidatedLinks[li]['id'], link);
        }
      } else {
        list.set(link.getId(), link);
      }
    }

    return list;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Event Manager for dvt.Diagram.
   * @param {dvt.Context} context The platform specific context object
   * @param {function} callback A function that responds to component events
   * @param {dvt.Diagram} callbackObj diagram component instance that the callback function is defined on
   * @class
   * @extends {dvt.EventManager}
   * @constructor
   */


  var DvtDiagramEventManager = function DvtDiagramEventManager(context, callback, callbackObj) {
    this.Init(context, callback, callbackObj, callbackObj);
    this._diagram = callbackObj;
    this._linkDragSelector = null;
    this._linkDropSelector = null;
    this._prevRolloverEvent = null;
  };

  dvt.Obj.createSubclass(DvtDiagramEventManager, dvt.EventManager, 'DvtDiagramEventManager');
  /**
   * Shows the keyboard focus effects wich includes tooltip, for a keyboard navigable object.
   * @param {dvt.KeyboardEvent} event The keyboard event
   * @param {DvtKeyboardNavigable} navigable The keyboard navigable to show focus effect for
   */

  DvtDiagramEventManager.prototype.showFocusEffect = function (event, navigable) {
    this.ShowFocusEffect(event, navigable);
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.ShowFocusEffect = function (event, obj) {
    if (!this._diagram.isPanning()) DvtDiagramEventManager.superclass.ShowFocusEffect.call(this, event, obj);
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.ProcessRolloverEvent = function (event, obj, bOver) {
    // Don't continue if not enabled
    var options = this._diagram.getOptions();

    if (options['hoverBehavior'] != 'dim') return; // prevent a problem processing highlight over and over for the same object
    // which happens on FF after reparenting a highlighted node for flat diagram

    if (this._prevRolloverEvent && this._prevRolloverEvent.obj === obj && this._prevRolloverEvent.bOver === bOver) return; // Compute the new highlighted categories and update the options

    var categories = obj.getCategories ? obj.getCategories() : [];
    options['highlightedCategories'] = bOver ? categories.slice() : null;
    var rolloverEvent = dvt.EventFactory.newCategoryHighlightEvent(options['highlightedCategories'], bOver);
    var hoverBehaviorDelay = dvt.CSSStyle.getTimeMilliseconds(options['styleDefaults']['hoverBehaviorDelay']);
    this.RolloverHandler.processEvent(rolloverEvent, this._diagram.GetAllNodeObjects(), hoverBehaviorDelay, options['highlightMatch'] == 'any');
    this._prevRolloverEvent = {
      obj: obj,
      bOver: bOver
    };
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.CreateCategoryRolloverHandler = function (callback, callbackObj) {
    return new DvtDiagramCategoryRolloverHandler(callback, callbackObj);
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.ProcessKeyboardEvent = function (event) {
    var eventConsumed = true;
    var keyCode = event.keyCode;
    var focusObj = this.getFocus();
    var focusDisp = focusObj instanceof DvtDiagramNode ? focusObj._customNodeContent : null; // Mashup

    if (keyCode != dvt.KeyboardEvent.TAB && this._bPassOnEvent) {
      focusDisp.fireKeyboardListener(event);
      event.preventDefault();
    } // Mashups
    else if (keyCode == dvt.KeyboardEvent.TAB && focusDisp instanceof dvt.BaseComponent) {
        // If displayable is already focused, then tab enters stamp and all future events pass to stamp until shift+tab
        // or tab out
        if (!event.shiftKey && focusObj.isShowingKeyboardFocusEffect()) {
          focusObj.hideKeyboardFocusEffect();
          focusDisp.fireKeyboardListener(event);
          event.preventDefault();
          this._bPassOnEvent = true;
        } // If stamp is focused, shift+tab will move focus back to diagram
        else if (event.shiftKey && this._bPassOnEvent) {
            this.ShowFocusEffect(event, focusObj);
            event.preventDefault();
            this._bPassOnEvent = false;
          } // All other tab cases should be handled by superclass and will move focus out of component
          else {
              if (this._bPassOnEvent) focusObj.showKeyboardFocusEffect(); // checked by superclass to tab out of component

              eventConsumed = DvtDiagramEventManager.superclass.ProcessKeyboardEvent.call(this, event);
              this._bPassOnEvent = false;
            }
      } else if (keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey && event.shiftKey) {
        if (focusObj && focusObj.HandleKeyboardEvent) {
          focusObj.HandleKeyboardEvent(event);
        }
      } else if ((keyCode == dvt.KeyboardEvent.ZERO || keyCode == dvt.KeyboardEvent.NUMPAD_ZERO) && event.ctrlKey && event.altKey) {
        if (focusObj) {
          var pzc = this._diagram.getPanZoomCanvas();

          var stageDims = focusObj.getKeyboardBoundingBox(this.getCtx().getStage());
          var localPos1 = pzc.getContentPane().stageToLocal({
            x: stageDims.x,
            y: stageDims.y
          });
          var localPos2 = pzc.getContentPane().stageToLocal({
            x: stageDims.x + stageDims.w,
            y: stageDims.y + stageDims.h
          });
          var finBounds = {
            x: localPos1.x,
            y: localPos1.y,
            w: localPos2.x - localPos1.x,
            h: localPos2.y - localPos1.y
          };
          var animator = DvtDiagramStyleUtils.getAnimationOnDataChange(this._diagram) != 'none' ? new dvt.Animator(this.getCtx(), this._diagram.getAnimationDuration()) : null;
          pzc.zoomToFit(animator, finBounds);
          animator && animator.play();
        }
      } else {
        if (keyCode == dvt.KeyboardEvent.TAB && focusObj) {
          //make sure focused obj in on screen
          this._diagram.ensureObjInViewport(event, focusObj);
        }

        eventConsumed = DvtDiagramEventManager.superclass.ProcessKeyboardEvent.call(this, event);
      }

    return eventConsumed;
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.GetTouchResponse = function () {
    var options = this._diagram.getOptions();

    if (options['panning'] !== 'none' || options['zooming'] !== 'none') return dvt.EventManager.TOUCH_RESPONSE_TOUCH_HOLD;else if (options['touchResponse'] === dvt.EventManager.TOUCH_RESPONSE_TOUCH_START) return dvt.EventManager.TOUCH_RESPONSE_TOUCH_START;
    return dvt.EventManager.TOUCH_RESPONSE_AUTO;
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.HandleTouchClickInternal = function (event) {
    return this.GetEventInfo(event, dvt.PanZoomCanvasEventManager.EVENT_INFO_PANNED_KEY);
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.StoreInfoByEventType = function (key) {
    if (key == dvt.PanZoomCanvasEventManager.EVENT_INFO_PANNED_KEY) {
      return false;
    }

    return DvtDiagramEventManager.superclass.StoreInfoByEventType.call(this, key);
  }; // Drag & Drop Support

  /**
   * @override
   */


  DvtDiagramEventManager.prototype.isDndSupported = function () {
    return true;
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.GetDragSourceType = function (event) {
    var obj = this.DragSource.getDragObject();
    if (obj && obj.__dragType) return obj.__dragType;

    if (obj instanceof DvtDiagramNode) {
      if (this._linkDragSelector === null) {
        this._linkDragSelector = this._diagram.getOptions()['dnd']['drag']['ports']['selector'];
      }

      var dragPort;

      if (this._linkDragSelector) {
        dragPort = this._getPortElement(document.elementFromPoint(event.getNativeEvent().clientX, event.getNativeEvent().clientY), this._linkDragSelector);

        if (dragPort) {
          this.LinkCreationStarted = true;
          obj.__dragPort = dragPort;
        }
      } // cache drag type and potential port until next dragstart


      obj.__dragType = dragPort ? 'ports' : 'nodes';
      return obj.__dragType;
    }

    return null;
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.GetDragDataContexts = function (bSanitize) {
    var obj = this.DragSource.getDragObject();

    if (this._diagram.isSelectionSupported() && this._diagram.getSelectionHandler().getSelectedCount() > 1) {
      var selection = this._diagram.getSelectionHandler().getSelection();

      var contentPosition = this._getTopLeftContentCorner(selection);

      var zoom = this._diagram.getPanZoomCanvas().getZoom();

      var contexts = [];

      for (var i = 0; i < selection.length; i++) {
        if (selection[i] instanceof DvtDiagramNode) {
          //don't drag links yet
          var context = selection[i].getDataContext();
          var bounds = selection[i].getDimensions(this._context.getStage());
          context['nodeOffset'] = new dvt.Point((bounds.x - contentPosition.x) / zoom, (bounds.y - contentPosition.y) / zoom);
          if (bSanitize) dvt.ToolkitUtils.cleanDragDataContext(context);
          contexts.push(context);
        }
      }

      return contexts;
    }

    if (obj instanceof DvtDiagramNode) {
      var context = obj.getDataContext();
      if (bSanitize) dvt.ToolkitUtils.cleanDragDataContext(context);

      if (obj.__dragType === 'ports' && obj.__dragPort) {
        return bSanitize ? {
          'dataContext': context
        } : {
          'dataContext': context,
          'portElement': obj.__dragPort
        };
      }

      context['nodeOffset'] = new dvt.Point(0, 0);
      return [context];
    }

    return [];
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.GetDropOffset = function (event) {
    var contentPosition;

    if (this._diagram.isSelectionSupported() && this._diagram.getSelectionHandler().getSelectedCount() > 1) {
      contentPosition = this._getTopLeftContentCorner(this._diagram.getSelectionHandler().getSelection());
    } else {
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


  DvtDiagramEventManager.prototype._getTopLeftContentCorner = function (selection) {
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


  DvtDiagramEventManager.prototype.OnDndDragStart = function (event) {
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


  DvtDiagramEventManager.prototype.OnDndDragOver = function (event) {
    DvtDiagramEventManager.superclass.OnDndDragOver.call(this, event);

    if (this.LinkCreationStarted) {
      this._diagram.ShowLinkCreationFeedback(event);
    }
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.OnDndDragEnd = function (event) {
    DvtDiagramEventManager.superclass.OnDndDragEnd.call(this, event);

    if (this.LinkCreationStarted) {
      this._diagram.HideLinkCreationFeedback();

      this.LinkCreationStarted = false;
    } //reenabling panning on dragend and on mouseup
    //the panning is disabled on mousedown event to prevent panning for potential node drag
    //if the node was not dragged, the component will not get dragend event and the panning is reenabled on mouseup
    //if the node was dragged, the component will get dragend event, but it might not get mouseup event


    this._diagram.getPanZoomCanvas().panZoomEnd(); //done to reset the state and prevent panBy on mousemove


    this._setPanningEnabled(true);
  };
  /**
   * Updates PanZoomCanvas setting for panning, if panning is enabled for the diagram
   * The method is called to prevent diagram panning during drag operation
   * @param {boolean} bEnablePanning true to enable panning
   * @private
   */


  DvtDiagramEventManager.prototype._setPanningEnabled = function (bEnablePanning) {
    if (this._diagram.IsPanningEnabled()) this._diagram.getPanZoomCanvas().setPanningEnabled(bEnablePanning);
  };
  /**
   * Helper function that check if the nodes could be dragged from the diagram
   * @return {boolean} true if the nodes could be dragged from the diagram
   * @protected
   */


  DvtDiagramEventManager.prototype.IsDragSupported = function () {
    if (!this._isDragSupported) {
      var options = this._diagram.getOptions();

      this._isDragSupported = this.isDndSupported() && (options['dnd']['drag']['nodes']['dataTypes'] || options['dnd']['drag']['ports']['dataTypes']);
    }

    return this._isDragSupported;
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.OnMouseDown = function (event) {
    var obj = this.GetLogicalObject(event.target);

    if (this.IsDragSupported() && obj instanceof DvtDiagramNode) {
      this._setPanningEnabled(false);
    }

    DvtDiagramEventManager.superclass.OnMouseDown.call(this, event);
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.OnMouseUp = function (event) {
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


  DvtDiagramEventManager.prototype.HandleImmediateTouchStartInternal = function (event) {
    var obj = this.GetLogicalObject(event.target);

    if (this.IsDragSupported() && event.targetTouches.length == 1) {
      if (obj instanceof DvtDiagramNode) {
        this._setPanningEnabled(false);
      }
    }

    if (obj instanceof DvtDiagramNode || obj instanceof DvtDiagramLink) {
      obj.handleTouchStart();
    }

    this._diagram.handleTouchStart();
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.HandleImmediateTouchEndInternal = function (event) {
    var obj = this.GetLogicalObject(event.target);

    if (this.IsDragSupported()) {
      this._setPanningEnabled(true);
    }

    if (obj instanceof DvtDiagramNode || obj instanceof DvtDiagramLink) {
      obj.handleTouchEnd();
    }

    this._diagram.handleTouchEnd();
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.GetDropTargetType = function (event) {
    var obj = this.GetLogicalObject(event.target);

    this._diagram.getCache().putToCache('dropTarget', obj);

    if (!obj) {
      return 'background';
    } else if (obj instanceof DvtDiagramNode) {
      var dropPort;

      if (this._linkDropSelector === null) {
        this._linkDropSelector = this._diagram.getOptions()['dnd']['drop']['ports']['selector'];
      }

      if (this._linkDropSelector) {
        dropPort = this._getPortElement(event.getNativeEvent().target, this._linkDropSelector);
      }

      obj.__dropPort = dropPort; //save the value for the payload call

      return dropPort ? 'ports' : 'nodes';
    } else if (obj instanceof DvtDiagramLink) {
      return 'links';
    }

    return null;
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.GetDropEventPayload = function (event) {
    // Apply the drop offset if the drag source is a DVT component
    // NOTE: The drop offset is stored in dataTransfer, so it's only accessible from "drop" event. It can't be
    //       accessed from "dragEnter", "dragOver", and "dragLeave".
    var dataTransfer = event.getNativeEvent().dataTransfer;
    var offsetX = Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_X_DATA_TYPE)) || 0;
    var offsetY = Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_Y_DATA_TYPE)) || 0; //point relative to content pane

    var relPos = this._diagram.getPanZoomCanvas().getContentPane().stageToLocal(this.getCtx().pageToStageCoords(event.pageX, event.pageY));

    var layoutOffset = this._diagram.getLayoutOffset();

    var payload = {
      'x': relPos.x - layoutOffset.x + offsetX,
      'y': relPos.y - layoutOffset.y + offsetY
    }; //add node or link context if drop accepted by the node or link

    var obj = this.GetLogicalObject(event.target);

    if (obj instanceof DvtDiagramNode) {
      if (obj.__dropPort) {
        payload['dataContext'] = obj.getDataContext();
        payload['portElement'] = obj.__dropPort;
      } else {
        payload['nodeContext'] = obj.getDataContext();
      }

      var bounds = obj.getDimensions(this._context.getStage());
      var relNodePos = bounds ? this._diagram.getPanZoomCanvas().getContentPane().stageToLocal({
        x: bounds.x,
        y: bounds.y
      }) : null;
      payload['nodeX'] = relNodePos ? relPos.x - relNodePos.x + offsetX : null;
      payload['nodeY'] = relNodePos ? relPos.y - relNodePos.y + offsetY : null;
    } else if (obj instanceof DvtDiagramLink) {
      payload['linkContext'] = obj.getDataContext();
    }

    return payload;
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.ShowDropEffect = function (event) {
    var dropTargetType = this.GetDropTargetType(event);

    var obj = this._diagram.getCache().getFromCache('dropTarget');

    if (dropTargetType === 'background') {
      var background = this._diagram.getPanZoomCanvas().getBackgroundPane();

      background.setClassName('oj-active-drop');
    } else if (dropTargetType === 'nodes' || dropTargetType === 'links') {
      if (obj && obj.ShowDropEffect) {
        obj.ShowDropEffect();
      }
    } else if (obj && dropTargetType === 'ports' && obj.__dropPort) {
      dvt.ToolkitUtils.addClassName(obj.__dropPort, 'oj-active-drop');
    }
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.ShowRejectedDropEffect = function (event) {
    var dropTargetType = this.GetDropTargetType(event);

    var obj = this._diagram.getCache().getFromCache('dropTarget');

    if (dropTargetType === 'background') {
      var background = this._diagram.getPanZoomCanvas().getBackgroundPane();

      background.setClassName('oj-invalid-drop');
    } else if (dropTargetType === 'nodes' || dropTargetType === 'links') {
      if (obj && obj.ShowRejectedDropEffect) {
        obj.ShowRejectedDropEffect();
      }
    } else if (obj && dropTargetType === 'ports' && obj.__dropPort) {
      dvt.ToolkitUtils.addClassName(obj.__dropPort, 'oj-invalid-drop');
    }
  };
  /**
   * @override
   */


  DvtDiagramEventManager.prototype.ClearDropEffect = function () {
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


  DvtDiagramEventManager.prototype._getPortElement = function (elem, selector) {
    return elem && elem.closest ? elem.closest(selector) : null;
  };
  /**
   * @license
   * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   *  @constructor
   *  @class DvtDiagramKeyboardHandler base class for keyboard handler for diagram component
   *  @param {dvt.Diagram} component The owning diagram component
   *  @param {dvt.EventManager} manager The owning dvt.EventManager
   *  @extends {dvt.BaseDiagramKeyboardHandler}
   */


  var DvtDiagramKeyboardHandler = function DvtDiagramKeyboardHandler(component, manager) {
    this.Init(component, manager);
  };

  dvt.Obj.createSubclass(DvtDiagramKeyboardHandler, dvt.BaseDiagramKeyboardHandler, 'DvtDiagramKeyboardHandler');
  /**
   * @override
   */

  DvtDiagramKeyboardHandler.prototype.isNavigationEvent = function (event) {
    var retVal = false;

    switch (event.keyCode) {
      case dvt.KeyboardEvent.OPEN_BRACKET:
      case dvt.KeyboardEvent.CLOSE_BRACKET:
        retVal = true;
        break;

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


  DvtDiagramKeyboardHandler.prototype.processKeyDown = function (event) {
    var keyCode = event.keyCode;

    if (keyCode == dvt.KeyboardEvent.TAB) {
      var currentNavigable = this._eventManager.getFocus();

      if (currentNavigable) {
        dvt.EventManager.consumeEvent(event);
        return currentNavigable;
      } else {
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


  DvtDiagramKeyboardHandler.prototype.GetVisibleNode = function (nodeId) {
    return this.GetDiagram().getNodeById(nodeId);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @constructor
   * @param {dvt.Context} context the rendering context
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {object} linkData link data
   * @param {boolean} promoted true for promoted link
   */


  var DvtDiagramLink = function DvtDiagramLink(context, diagram, linkData, promoted) {
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

  DvtDiagramLink.newInstance = function (diagram, data, promoted) {
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


  DvtDiagramLink.prototype.Init = function (context, diagram, data, promoted) {
    DvtDiagramLink.superclass.Init.call(this, context, data['id'], diagram);
    this._data = data;
    this._isHighlighted = true;
    this._hasContentBoundToTouchEvent = false;
    this._contentStoredInTouchEventContainer = null;
    this.setPromoted(promoted);

    if (this.isSelectable()) {
      this.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
    } //sets group id for the link if exists


    this.setGroupId(DvtDiagramLink._getCommonAncestorId(this, diagram));
  };
  /**
   * Gets the data object
   * @return {object} the data object
   */


  DvtDiagramLink.prototype.getData = function () {
    return this._data;
  };
  /**
   * Sets the data object
   * @param {object} data the data object
   */


  DvtDiagramLink.prototype.setData = function (data) {
    this._data = data;
  };
  /**
   * Gets the link id
   * @return {string} link id
   */


  DvtDiagramLink.prototype.getId = function () {
    return this.getData()['id'];
  };
  /**
   * Gets the node id
   * @return {string} node id
   */


  DvtDiagramLink.prototype.getStartId = function () {
    return this.getData()['startNode'];
  };
  /**
   * Gets the node id
   * @return {string} node id
   */


  DvtDiagramLink.prototype.getEndId = function () {
    return this.getData()['endNode'];
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getLabelBounds = function () {
    var bounds = null;

    if (this._labelObj) {
      bounds = this._labelObj.getDimensions();
    }

    return bounds;
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getLinkStyle = function () {
    return this.getData()['svgStyle'] || this.getData()['style'];
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getLinkWidth = function () {
    return this.getData()['width'];
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getLinkColor = function () {
    return this.getData()['color'];
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getStartConnectorType = function () {
    return this.getData()['startConnectorType'];
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getEndConnectorType = function () {
    return this.getData()['endConnectorType'];
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getStartConnectorOffset = function () {
    if (this.getStartConnectorType()) {
      return dvt.DiagramLinkConnectorUtils.getStandardConnectorOffset(this.getStartConnectorType(), this.GetAppliedLinkWidth(), this.GetAppliedLinkWidth());
    }

    return 0;
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getEndConnectorOffset = function () {
    if (this.getEndConnectorType()) {
      return dvt.DiagramLinkConnectorUtils.getStandardConnectorOffset(this.getEndConnectorType(), this.GetAppliedLinkWidth(), this.GetAppliedLinkWidth());
    }

    return 0;
  };
  /**
   * Renders diagram link
   */


  DvtDiagramLink.prototype.render = function () {
    var diagram = this.GetDiagram(); //find a parent container for the link and attach a link to it

    var groupId = this.getGroupId();
    var startGroupId = diagram.getNodeById(this.getStartId()).getGroupId();
    var endGroupId = diagram.getNodeById(this.getEndId()).getGroupId();

    if (groupId) {
      var context = this.getCtx();
      var linkParent = diagram.getNodeById(groupId).GetChildNodePane();
      if (dvt.BaseDiagram.compareValues(context, groupId, startGroupId) && dvt.BaseDiagram.compareValues(context, groupId, endGroupId)) linkParent.addChildAt(this, 0);else linkParent.addChild(this); //cross container link inside container
    } else if (startGroupId || endGroupId) {
      //cross container link to the top level
      diagram.getNodesPane().addChild(this);
    } else {
      //flat diagram or link connects top level nodes
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


  DvtDiagramLink.prototype.setPoints = function (points) {
    var diagram = this.GetDiagram();

    var renderer = this._getCustomRenderer('renderer');

    if (renderer) {
      this._customPoints = points;

      this._applyCustomLinkContent(renderer, this._getState(), null);
    } else {
      if (!this._pathCmds && points) {
        DvtDiagramLink._renderLinkShape(diagram, this.getData(), this);
      }

      DvtDiagramLink.superclass.setPoints.call(this, points);
    }
  };
  /**
   * Retrieves current state for the link
   * @return {Object} object that contains current hovered, selected, focused states for the link
   * @private
   */


  DvtDiagramLink.prototype._getState = function () {
    return {
      'hovered': this._isShowingHoverEffect,
      'selected': this.isSelected(),
      'focused': this._isShowingKeyboardFocusEffect
    };
  };
  /**
   * Calls the specified renderer, adds, removes or updates content of the link
   * @param {function} renderer custom renderer for the link state
   * @param {Object} state object that contains curremt object state
   * @param {Object} prevState object that contains previous object state
   * @private
   */


  DvtDiagramLink.prototype._applyCustomLinkContent = function (renderer, state, prevState) {
    var contextHandler = this._diagram.getOptions()['_contextHandler'];

    if (!contextHandler) {
      this._diagram.Log('dvt.Diagram: could not add custom link content - context handler is undefined', 1);

      return;
    }

    var context = contextHandler(this.isPromoted() ? 'promotedLink' : 'link', this.getElem(), this._customLinkContent, null, this.getDataContext(), state, prevState, this._customPoints);
    var linkContent = renderer(context); //   - support null case on updates for custom elements

    if (!linkContent && this._customLinkContent) {
      return;
    } // strip top level svg element if it is there - content created by template or
    // custom defined content is wrapped into svg element
    // processedContent will be saved as custom content for futute use - updates and animation


    var processedContent = DvtDiagramLink._processLinkContent(linkContent); //remove content if the new and old content do not match, the new content might be null


    if (this._customLinkContent && processedContent != this._customLinkContent) {
      // BUG: JET-31495 - IMPOSSIBLE TO REMOVE HOVER TREATMENT AND TOOLTIP, WHEN INLINE TEMPLATE IS USED
      // When renderer function creates content which is different from the initial content, the initial content
      // is removed from the DOM which breaks the touch events.
      // To fix this, the initial content is added to the touch event container before it can be safely destroyed
      // Move old contents if needed, instead of removing them.
      var stashedOldContents = this._checkAndMoveContents(); // No need to remove contents if they are already moved.


      if (!stashedOldContents) {
        if (this._customLinkContent.namespaceURI === dvt.ToolkitUtils.SVG_NS) {
          this.getContainerElem().removeChild(this._customLinkContent);
        } else if (Array.isArray(this._customLinkContent)) {
          this._customLinkContent.forEach(function (node) {
            this.getContainerElem().removeChild(node);
          }.bind(this));
        }
      }

      this._customLinkContent = null;
    } // If the content stored in the touch event container is the new content
    // then we need to set the _hasContentBoundToTouchEvent flag to make sure
    // it is not removed from the DOM before the event ends.


    if (processedContent === this._contentStoredInTouchEventContainer) {
      this._hasContentBoundToTouchEvent = true;
    } // add content if neccessary


    if (!this._customLinkContent) {
      if (processedContent && processedContent.namespaceURI === dvt.ToolkitUtils.SVG_NS) {
        DvtDiagramLink._insertCustomElem(this, processedContent, this._labelObj);

        this._customLinkContent = processedContent;
      } else if (processedContent && Array.isArray(processedContent)) {
        processedContent.forEach(function (item) {
          DvtDiagramLink._insertCustomElem(this, item, this._labelObj);
        }.bind(this));
        this._customLinkContent = processedContent;
      } else {
        // not an svg fragment
        this._diagram.Log('dvt.Diagram: could not add custom link content for the link ' + this.getId() + linkContent, 1);
      }
    } // populate link path if needed


    DvtDiagramLink._fixLinkPath(this);
  };
  /**
   * Renders link shape
   * @param {dvt.Diagram} diagram parent component
   * @param {object} linkData
   * @param {dvt.Container} container parent container
   * @private
   */


  DvtDiagramLink._renderLinkShape = function (diagram, linkData, container) {
    var points = container._pathCmds;

    if (!points) {
      points = ['M', 0, 0, 'L', 0, 0];
    }

    var id = linkData['id'];
    var linkColor = linkData['color'];
    var linkWidth = linkData['width'];
    var linkStyle = linkData['svgStyle'] || linkData['style'];
    var hitDetectionOffset = dvt.CSSStyle.toNumber(linkData['_hitDetectionOffset']); //create a transparent underlay wider than the link
    //in order to make it easier to interact with the link

    container._hitDetectionUnderlay = container.CreateUnderlay('#000000', 0, hitDetectionOffset);
    container.addChildAt(container._hitDetectionUnderlay, 0);
    var shape = new dvt.Path(container.getCtx(), points, id);
    var className = linkData['svgClassName'] || linkData['className'];
    shape.setFill(null);
    shape.setClassName(className);
    var dashProps;

    if (container.getCtx().isCustomElement()) {
      // Don't need to do anything special for links, just apply the style to the shape
      shape.setStyle(linkStyle);
    } else {
      // Support for original link styles for widgets: string type  and a style object type
      //If the linkstyle is an object directly apply it on the link
      if (linkStyle && linkStyle instanceof Object) {
        if (linkStyle['_type'] == DvtDiagramLink.CUSTOM_STYLE && linkStyle['strokeDasharray']) {
          linkStyle['strokeDasharray'] = dvt.DiagramLinkUtils.processStrokeDashArray(linkStyle['strokeDasharray']);
        }

        dashProps = {
          dashArray: linkStyle['strokeDasharray'],
          dashOffset: linkStyle['strokeDashoffset']
        }; //Remove already processed style attributes

        var styleObj = dvt.JsonUtils.clone(linkStyle);
        ['_type', 'strokeDasharray', 'strokeDashoffset'].forEach(function (entry) {
          delete styleObj[entry];
        }); //set the style object directly in style

        shape.setStyle(styleObj);
      } else if (linkStyle !== 'solid') {
        //Use default stroke type if no link style is specified
        dashProps = {
          dashArray: dvt.DiagramLinkUtils.GetStrokeDash(linkStyle),
          dashOffset: dvt.DiagramLinkUtils.GetStrokeDashOffset(linkStyle)
        };
      }
    }

    var stroke = new dvt.Stroke(linkColor, 1, linkWidth, true, dashProps);
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


  DvtDiagramLink._renderLinkLabels = function (diagram, linkData, container) {
    var labelString = linkData['label'];

    if (labelString) {
      var rtl = dvt.Agent.isRightToLeft(diagram.getCtx());
      var bMultiline = labelString.indexOf('\n') > 0;
      var halign = bMultiline ? rtl ? dvt.MultilineText.H_ALIGN_RIGHT : dvt.MultilineText.H_ALIGN_LEFT : rtl ? dvt.OutputText.H_ALIGN_RIGHT : dvt.OutputText.H_ALIGN_LEFT;
      var valign = bMultiline ? dvt.MultilineText.V_ALIGN_TOP : dvt.OutputText.V_ALIGN_TOP;
      var label = DvtDiagramLink.createText(diagram.getCtx(), labelString, linkData['labelStyle'], halign, valign, bMultiline);
      var maxWidth = linkData['labelStyle'].getMaxWidth() || linkData['labelStyle'].getWidth();
      var labelWidth = dvt.CSSStyle.toNumber(maxWidth);

      if (!maxWidth) {
        container.addChild(label);
        container._labelObj = label;
      } else if (labelWidth > 0 && dvt.TextUtils.fitText(label, labelWidth, Infinity, container)) {
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
   * @param {dvt.CSSStyle} style the CSS style string to apply to the text
   * @param {string} halign the horizontal alignment
   * @param {string} valign the vertical alignment
   * @param {boolean} bMultiline whether or not this element will be a MultilineText
   * @return {dvt.OutputText|dvt.BackgroundOutputText|dvt.MultilineText} the text element
   */


  DvtDiagramLink.createText = function (ctx, strText, style, halign, valign, bMultiline) {
    var text;
    if (style.hasBackgroundStyles()) text = bMultiline ? new dvt.BackgroundMultilineText(ctx, strText, 0, 0, style, null, true) : new dvt.BackgroundOutputText(ctx, strText, 0, 0, style);else {
      text = bMultiline ? new dvt.MultilineText(ctx, strText, 0, 0, null, true) : new dvt.OutputText(ctx, strText, 0, 0);
      text.setCSSStyle(style);
    }
    text.setHorizAlignment(halign);
    text.setVertAlignment(valign);
    return text;
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.setSelected = function (selected) {
    var prevState = this._getState();

    DvtDiagramLink.superclass.setSelected.call(this, selected);

    var selectionRenderer = this._getCustomRenderer('selectionRenderer');

    if (selectionRenderer) {
      this._applyCustomLinkContent(selectionRenderer, this._getState(), prevState);
    } else {
      if (selected) {
        this._showFeedback(this._isShowingHoverEffect, true);
      } else {
        this._hideFeedback();
      }
    }

    this.UpdateAriaLabel();
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.isSelectable = function () {
    return this.GetDiagram().isSelectionSupported() && this.getData()['selectable'] != 'off';
  };
  /**
   * Shows hover selection feedback
   * @param {boolean} bHovered true for hovered state
   * @param {boolean} bSelected true for selected state
   * @private
   */


  DvtDiagramLink.prototype._showFeedback = function (bHovered, bSelected) {
    if (bHovered) {
      if (!this._savedStroke) {
        this._savedStroke = this.getShape().getStroke();
      }

      var copyStroke = this.getShape().getStroke();
      var hoverStroke = new dvt.Stroke(this.getData()['hoverInnerColor'], copyStroke.getAlpha(), copyStroke.getWidth(), copyStroke.isFixedWidth(), copyStroke.getDashProps());
      this.getShape().setStroke(hoverStroke);
      this.ReplaceConnectorColor(this.getStartConnector(), hoverStroke);
      this.ReplaceConnectorColor(this.getEndConnector(), hoverStroke);
    } else if (this._savedStroke) {
      this.getShape().setStroke(this._savedStroke);
      this.ReplaceConnectorColor(this.getStartConnector(), this._savedStroke);
      this.ReplaceConnectorColor(this.getEndConnector(), this._savedStroke);
      this._savedStroke = null;
    }

    if (!this._linkUnderlay) {
      // the styles will be applied for custom elements only, since svgStyle && svgClassName are not supported for widgets
      this._linkUnderlay = this.CreateFeedbackUnderlay('#000000', 1, 0, this.getData()['svgStyle'], this.getData()['svgClassName']);
      this.addChildAt(this._linkUnderlay, 0);
    }

    var color = bSelected ? this.getData()['selectionColor'] : this.getData()['hoverOuterColor'];
    var strokeOffset = 2;

    var strokeToCopy = this._linkUnderlay.getStroke();

    var strokeWidth = strokeOffset + this.GetAppliedLinkWidth();
    var stroke = this.GetStyledLinkStroke(strokeToCopy, color, strokeWidth);

    this._linkUnderlay.setStroke(stroke, strokeOffset);
  };
  /**
   * Removes hover selection feedback
   * @private
   */


  DvtDiagramLink.prototype._hideFeedback = function () {
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


  DvtDiagramLink.prototype.GetStyledLinkStroke = function (strokeToCopy, color, width) {
    // don't need to modify stroke for custom elements, the styles should be directly applied to the link shape and underlay shape
    if (this.getCtx().isCustomElement()) return new dvt.Stroke(color, strokeToCopy.getAlpha(), width, strokeToCopy.isFixedWidth());
    var linkStyle = this.GetAppliedLinkStyle();

    if (linkStyle && linkStyle instanceof Object) {
      var strokeType = linkStyle['_type'];
      var dashProps;

      if (strokeType == DvtDiagramLink.CUSTOM_STYLE) {
        var strokeDashOffset = linkStyle['strokeDashoffset'] != null ? dvt.CSSStyle.toNumber(linkStyle['strokeDashoffset']) + 1 : 1;
        dashProps = {
          dashArray: dvt.DiagramLinkUtils.getCustomUnderlay(linkStyle['strokeDasharray']),
          dashOffset: strokeDashOffset
        };
      } else {
        dashProps = {
          dashArray: dvt.DiagramLinkUtils.GetStrokeDash(strokeType, true),
          dashOffset: dvt.DiagramLinkUtils.GetStrokeDashOffset(strokeType, true)
        };
      }

      return new dvt.Stroke(color, strokeToCopy.getAlpha(), width, true, dashProps);
    } else {
      return DvtDiagramLink.superclass.GetStyledLinkStroke.call(this, strokeToCopy, color, width);
    }
  };
  /**
   * Handles touch start event on this link
   */


  DvtDiagramLink.prototype.handleTouchStart = function () {
    // Called from HandleImmediateTouchStartInternal of DvtDiagramEventManager
    // when a touch event is started on this link.
    // Set the _hasContentBoundToTouchEvent flag to indicate a touch event started on the
    // content of this link is active.
    // This will be unset in cases like hover/zoom where the contents are moved to
    // touch event container and the updated contents are not a part of the touch event.
    this._hasContentBoundToTouchEvent = true;
  };
  /**
   * Handles touch end event on this link
   */


  DvtDiagramLink.prototype.handleTouchEnd = function () {
    // Called from HandleImmediateTouchEndInternal of DvtDiagramEventManager
    // when a touch event is ended on this link.
    // Unset the _hasContentBoundToTouchEvent flag to indicate a touch event started on the
    // content of this link is no more active.
    // This is to make sure that it is unset in case like selection event
    // where this flag is set on the handleTouchStart but never updated as
    // the custom render would not have happened.
    this._hasContentBoundToTouchEvent = false;
    this._contentStoredInTouchEventContainer = null;
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.showHoverEffect = function () {
    if (!this._isShowingHoverEffect) {
      var prevState = this._getState();

      this._isShowingHoverEffect = true;

      var hoverRenderer = this._getCustomRenderer('hoverRenderer');

      if (hoverRenderer) {
        this._applyCustomLinkContent(hoverRenderer, this._getState(), prevState);
      } else {
        this._showFeedback(true, this.isSelected());
      }
    }
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.hideHoverEffect = function () {
    var prevState = this._getState();

    this._isShowingHoverEffect = false;

    var hoverRenderer = this._getCustomRenderer('hoverRenderer');

    if (hoverRenderer) {
      this._applyCustomLinkContent(hoverRenderer, this._getState(), prevState);
    } else {
      if (this.isSelected()) {
        this._showFeedback(false, true);
      } else {
        this._hideFeedback();
      }
    }
  };
  /**
   * Highlight current link
   * @param {boolean} bHighlight true if the link should be highlighted
   */


  DvtDiagramLink.prototype.highlight = function (bHighlight) {
    if (this._isHighlighted !== bHighlight) {
      var highlightAlpha = bHighlight ? 1.0 : this._diagram.getOptions()['styleDefaults']['_highlightAlpha'];
      this.setAlpha(highlightAlpha);
      this._isHighlighted = bHighlight;
    }
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getDatatip = function (target, x, y) {
    // Custom Tooltip from Function
    var customTooltip = this.GetDiagram().getOptions()['tooltip'];
    var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
    if (tooltipFunc) return this.GetDiagram().getCtx().getTooltipManager().getCustomTooltip(tooltipFunc, this.getDataContext()); // Custom Tooltip from ShortDesc

    return this.getShortDesc();
  };
  /**
   * Returns short description for the link
   * @return {string}  short description for the link
   */


  DvtDiagramLink.prototype.getShortDesc = function () {
    var translations = this.GetDiagram().getOptions().translations;

    if (this.isPromoted()) {
      var linkCount = this.getData()['_links'].length;
      return dvt.ResourceUtils.format(translations[linkCount > 1 ? 'promotedLinks' : 'promotedLink'], [linkCount]);
    }

    return this.getData()['shortDesc'];
  };
  /**
   * Returns the data context that will be passed to the tooltip function.
   * @return {object}
   */


  DvtDiagramLink.prototype.getDataContext = function () {
    var itemData, data;

    if (this.GetDiagram().isDataProviderMode()) {
      // return both type of data - template processed and originals
      if (this.isPromoted()) {
        itemData = this.getData()['_links'].map(function (item) {
          return item['_itemData'];
        });
        data = this.getData()['_links'][0]['_noTemplate'] ? itemData : this.getData()['_links'];
      } else {
        data = this.getData();
        itemData = this.getData()['_itemData'];
      }
    } else {
      data = this.isPromoted() ? this.getData()['_links'] : this.getData()['_itemData'];
    }

    var dataContext = {
      'id': this.getId(),
      'type': this.isPromoted() ? 'promotedLink' : 'link',
      'label': this.getData()['label'],
      'data': data,
      'itemData': itemData,
      'component': this.GetDiagram().getOptions()['_widgetConstructor']
    };
    return this.getCtx().fixRendererContext(dataContext);
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getAriaLabel = function () {
    var states = [];
    var translations = this.GetDiagram().getOptions().translations;

    if (this.isSelectable()) {
      states.push(translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
    }

    if (this.isPromoted()) {
      states.push(translations.promotedLinkAriaDesc);
    }

    return dvt.Displayable.generateAriaLabel(this.getShortDesc(), states);
  };
  /**
   * @protected
   * Updates accessibility attributes on selection event
   */


  DvtDiagramLink.prototype.UpdateAriaLabel = function () {
    if (!dvt.Agent.deferAriaCreation()) {
      var desc = this.getAriaLabel();
      if (desc) this.setAriaProperty('label', desc);
    }
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getNextNavigable = function (event) {
    if (event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey) {
      // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
      // care of the selection
      return this;
    } else if (event.keyCode == dvt.KeyboardEvent.UP_ARROW || event.keyCode == dvt.KeyboardEvent.DOWN_ARROW) {
      //if the link got focus via keyboard, get the node where the focus came from
      //we'll navigate around that node
      //if the focus was set through mouse click, set start node as a center of navigation
      var node = this.getKeyboardFocusNode();
      if (!node) node = this.GetDiagram().getNodeById(this.getStartId()); //find next link - if up counter-clockwise, down - clockwise

      var nextLink = this;
      var links = this.GetDiagram().getNavigableLinksForNodeId(node.getId());
      var keyboardHandler = this.GetDiagram().getEventManager().getKeyboardHandler();
      if (keyboardHandler && keyboardHandler.getNextNavigableLink) nextLink = keyboardHandler.getNextNavigableLink(node, this, event, links);
      nextLink.setKeyboardFocusNode(node);

      this._diagram.ensureObjInViewport(event, nextLink);

      return nextLink;
    } else if (event.keyCode == dvt.KeyboardEvent.RIGHT_ARROW || event.keyCode == dvt.KeyboardEvent.LEFT_ARROW) {
      var nodeId;
      if (this._movingToStart(event.keyCode)) nodeId = this.getStartId();else nodeId = this.getEndId();
      var node = this.GetDiagram().getNodeById(nodeId);

      this._diagram.ensureObjInViewport(event, node);

      return node;
    } else if (event.type == dvt.MouseEvent.CLICK) {
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


  DvtDiagramLink.prototype._movingToStart = function (direction) {
    var start = this.getLinkStart();
    var end = this.getLinkEnd();
    var linkDirectionL2R = start.x < end.x ? true : false;
    if (direction == dvt.KeyboardEvent.RIGHT_ARROW && linkDirectionL2R || direction == dvt.KeyboardEvent.LEFT_ARROW && !linkDirectionL2R) return false;else return true;
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.showKeyboardFocusEffect = function () {
    var prevState = this._getState();

    this._isShowingKeyboardFocusEffect = true;

    var focusRenderer = this._getCustomRenderer('focusRenderer');

    if (focusRenderer) {
      this._applyCustomLinkContent(focusRenderer, this._getState(), prevState);
    } else {
      this.showHoverEffect();
    }
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.hideKeyboardFocusEffect = function () {
    var prevState = this._getState();

    this._isShowingKeyboardFocusEffect = false;

    var focusRenderer = this._getCustomRenderer('focusRenderer');

    if (focusRenderer) {
      this._applyCustomLinkContent(focusRenderer, this._getState(), prevState);
    } else {
      this.hideHoverEffect();
    }
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.isShowingKeyboardFocusEffect = function () {
    return this._isShowingKeyboardFocusEffect;
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getCategories = function () {
    return this.getData()['categories'] ? this.getData()['categories'] : [this.getId()];
  };
  /**
   * Checks whether the object is hidden
   * @return {boolean} true if the object is hidden
   */


  DvtDiagramLink.prototype.isHidden = function () {
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


  DvtDiagramLink.prototype.animateUpdate = function (animationHandler, oldLink, bCleanUp) {
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

      if (oldStroke && newStroke && oldStroke instanceof dvt.Stroke && newStroke instanceof dvt.Stroke && (oldStroke.getColor() != newStroke.getColor() || oldStroke.getWidth() != newStroke.getWidth())) {
        this.getShape().setStroke(oldStroke);
        playable.getAnimator().addProp(dvt.Animator.TYPE_STROKE, this.getShape(), this.getShape().getStroke, this.getShape().setStroke, newStroke);
      }
    } // animate position


    var oldTx = oldLink.getTranslateX();
    var oldTy = oldLink.getTranslateY();
    var newTx = this.getTranslateX();
    var newTy = this.getTranslateY();

    if (oldTx != newTx) {
      this.setTranslateX(oldTx);
      playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getTranslateX, this.setTranslateX, newTx);
    }

    if (oldTy != newTy) {
      this.setTranslateY(oldTy);
      playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getTranslateY, this.setTranslateY, newTy);
    } // animate custom content


    if (this._getCustomRenderer('renderer')) {
      //animate path if it is marked by the class
      var animateFrom = oldLink.getContainerElem().querySelector('.oj-diagram-link-path');
      var animateTo = this.getContainerElem().querySelector('.oj-diagram-link-path');

      if (animateFrom && animateTo) {
        var oldPoints = dvt.ToolkitUtils.getAttrNullNS(animateFrom, 'd');
        var newPoints = dvt.ToolkitUtils.getAttrNullNS(animateTo, 'd');
        dvt.ToolkitUtils.setAttrNullNS(animateTo, 'd', oldPoints);

        var pointsSetter = function pointsSetter(points) {
          dvt.ToolkitUtils.setAttrNullNS(animateTo, 'd', points.join(' '));
        };

        var pointsGetter = function pointsGetter(obj) {
          var points = dvt.ToolkitUtils.getAttrNullNS(animateTo, 'd');
          var arPoints = dvt.PathUtils.createPathArray(points);
          return arPoints;
        };

        playable.getAnimator().addProp(dvt.Animator.TYPE_PATH, animateTo, pointsGetter, pointsSetter, dvt.PathUtils.createPathArray(newPoints));
      } //animate the rest of custom content


      var fadeInItems = DvtDiagramLink._getFadeInCustomItems(this._customLinkContent, animateTo, animateFrom);

      var playableExtra = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());

      for (var ix = 0; ix < fadeInItems.length; ix++) {
        var item = fadeInItems[ix];
        dvt.ToolkitUtils.setAttrNullNS(item, 'opacity', '0');

        var opacitySetter = function (val) {
          dvt.ToolkitUtils.setAttrNullNS(this, 'opacity', val);
        }.bind(item);

        var opacityGetter = function () {
          var value = dvt.ToolkitUtils.getAttrNullNS(this, 'opacity');
          return Number(value);
        }.bind(item);

        playableExtra.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, item, opacityGetter, opacitySetter, 1);
      }

      animationHandler.add(playableExtra, DvtDiagramDataAnimationHandler.INSERT);
    }

    if (bCleanUp) {
      var thisRef = this;
      dvt.Playable.appendOnEnd(playable, function () {
        thisRef.getParent().removeChild(thisRef);
      });
    }

    animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);
  };
  /**
   * Creates the delete animation for the link.
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations.
   * @param {dvt.Container} deleteContainer
   */


  DvtDiagramLink.prototype.animateDelete = function (animationHandler, deleteContainer) {
    this.GetDiagram().getLinksPane().addChild(this);
    var thisRef = this;

    var removeFunc = function removeFunc() {
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


  DvtDiagramLink.prototype.animateInsert = function (animationHandler) {
    this.setAlpha(0);
    animationHandler.add(new dvt.AnimFadeIn(this.getCtx(), this, animationHandler.getAnimationDuration()), DvtDiagramDataAnimationHandler.INSERT);
  };
  /**
   * Creates the collapse animation for the diagram link - many links collapse into single promoted link
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
   * @param {Array} oldLinksArray array of old links that are collapsing into this one
   */


  DvtDiagramLink.prototype.animateCollapse = function (animationHandler, oldLinksArray) {
    if (!oldLinksArray || oldLinksArray.length == 0) return; //copy points for the original link to create fake links if needed

    var origPoints = this._customPoints ? this._customPoints : this.getPoints();
    if (Array.isArray(origPoints)) origPoints = origPoints.slice(); //copy translation for the original link to use on fake links

    var origTx = this.getTranslateX(),
        origTy = this.getTranslateY(); // use first link to animate from many to promoted

    this.animateUpdate(animationHandler, oldLinksArray[0]); // create fake links to animate from many to one
    // delete the fake links at animation end

    for (var i = 1; i < oldLinksArray.length; i++) {
      var data = {
        'id': '_fakeLink' + i + this.getId()
      };
      data = dvt.JsonUtils.merge(data, this.getData());
      var fakeLink = new DvtDiagramLink(this.GetDiagram().getCtx(), this.GetDiagram(), data, true);
      fakeLink.render();
      fakeLink.setPoints(origPoints);
      fakeLink.setTranslate(origTx, origTy);
      fakeLink.animateUpdate(animationHandler, oldLinksArray[i], true);
    }
  };
  /**
   * Creates expand animation for the diagram link - one promoted link expands into many
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
   * @param {Array} newLinksArray array of new links
   */


  DvtDiagramLink.prototype.animateExpand = function (animationHandler, newLinksArray) {
    if (!newLinksArray || newLinksArray.length == 0) return;

    for (var i = 0; i < newLinksArray.length; i++) {
      newLinksArray[i].animateUpdate(animationHandler, this);
    }
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.setLabelAlignments = function (halign, valign) {
    var isMultiline = this._labelObj instanceof dvt.MultilineText || this._labelObj instanceof dvt.BackgroundMultilineText;
    if (valign == 'baseline') valign = isMultiline ? dvt.MultilineText.V_ALIGN_TOP : dvt.OutputText.V_ALIGN_AUTO;

    this._labelObj.setHorizAlignment(halign);

    this._labelObj.setVertAlignment(valign);
  };
  /**
   * Sets group id for the link
   * @param {any} id group id for the link
   */


  DvtDiagramLink.prototype.setGroupId = function (id) {
    this._groupId = id;
  };
  /**
   * @override
   */


  DvtDiagramLink.prototype.getGroupId = function () {
    return this._groupId;
  };
  /**
   * Helper function that finds closest common ascestor container for the link start and end nodes
   * @param {DvtDiagramLink} link
   * @param {dvt.Diagram} diagram
   * @return {any} id of the closest common ansestor or null for the top level
   * @private
   */


  DvtDiagramLink._getCommonAncestorId = function (link, diagram) {
    var getAllAncestorIds = function getAllAncestorIds(id, diagram) {
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
      if (endPath.indexOf(startPath[i]) > -1) {
        return startPath[i];
      }
    }

    return null;
  };
  /**
   * Helper function that returns id for a promoted link for specified nodes
   * @param {dvt.Diagram} diagram the diagram component
   * @param {any} startId id for start node
   * @param {any} endId id for end node
   * @return {any} id for promoted link
   * @protected
   */


  DvtDiagramLink.GetPromotedLinkId = function (diagram, startId, endId) {
    if (diagram.isDataProviderMode()) {
      return {
        name: '_promoted',
        startId: startId,
        endId: endId
      };
    }

    return '_plL' + startId + '_L' + endId;
  };
  /**
   * Show drop effect on the link
   */


  DvtDiagramLink.prototype.ShowDropEffect = function () {
    if (!this._dropEffect) {
      this._createDropEffect('oj-diagram-link oj-active-drop');
    }
  };
  /**
   * Show rejected drop effect on the link
   */


  DvtDiagramLink.prototype.ShowRejectedDropEffect = function () {
    if (!this._dropEffect) {
      this._createDropEffect('oj-diagram-link oj-invalid-drop');
    }
  };
  /**
   * Clear drop effect from the link
   */


  DvtDiagramLink.prototype.ClearDropEffect = function () {
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


  DvtDiagramLink.prototype._createDropEffect = function (styleClass) {
    var hitDetectionOffset = dvt.CSSStyle.toNumber(this.getData()['_hitDetectionOffset']);
    this._dropEffect = this.CreateFeedbackUnderlay('#000000', 0, hitDetectionOffset, null, styleClass);

    this._dropEffect.setMouseEnabled(false);

    this.addChild(this._dropEffect);
  };
  /**
   * Helper function that converts link data from data source into internal format
   * @param {object} linkData data object for the link from data source
   * @return {object} link data object in internal format
   * @protected
   */


  DvtDiagramLink.ConvertLinkData = function (linkData) {
    return {
      'id': linkData['id'],
      'startNode': linkData['startNode'],
      'endNode': linkData['endNode'],
      'label': linkData['label'],
      'selectable': linkData['selectable'],
      'shortDesc': linkData['shortDesc'],
      'categories': linkData['categories'],
      '_itemData': linkData
    };
  };
  /**
   * Returns an object that contains data used to animate node from one state to another
   * @return {object}
   */


  DvtDiagramLink.prototype.getAnimationState = function () {
    var label, shape, state;

    if (this._labelObj) {
      label = {
        'matrix': this._labelObj.getMatrix()
      };

      label.getMatrix = function () {
        return label['matrix'];
      };
    }

    if (this.getShape()) {
      shape = {
        'stroke': this.getShape().getStroke()
      };

      shape.getStroke = function () {
        return shape['stroke'];
      };
    }

    var includedLinks = this.isPromoted() ? this.getData()['_links'] : null;
    state = {
      'partialUpdate': true,
      'id': this.getId(),
      'promoted': this.isPromoted(),
      'includedLinks': includedLinks,
      'points': this.getPoints(),
      'shape': shape,
      _labelObj: label
    };

    state.getId = function () {
      return state['id'];
    };

    state.isPromoted = function () {
      return state['promoted'];
    };

    state.getData = function () {
      return {
        '_links': state['includedLinks']
      };
    };

    state.getPoints = function () {
      return state['points'];
    };

    state.getShape = function () {
      return state['shape'];
    };

    return state;
  };
  /**
   * Helper method that searches for the path element that marked with
   * 'oj-diagram-link-path' class and updates the value of 'd' attribute
   * with path commands
   * @param {dvt.Container} container parent container
   * @private
   */


  DvtDiagramLink._fixLinkPath = function (container) {
    var pathElement = container.getContainerElem().querySelector('.oj-diagram-link-path');

    if (pathElement) {
      var points = container._customPoints;
      var pathCommands = dvt.DiagramLinkUtils.IsPath(points) ? points : dvt.DiagramLinkUtils.ConvertToPath(points);
      pathElement.setAttributeNS(null, 'd', dvt.PathUtils.getPathString(pathCommands));
    }
  };
  /**
   * Helper function that walks the DOM up to the root element that represent custom link content and finds items
   * and finds items that will animated with fade in animation. If the content does not have dedicated
   * path element, then the animation will be applied on the single root element.
   * @return {array} an array of nodes from custom content to animate using fade in animation
   * @private
   */


  DvtDiagramLink._getFadeInCustomItems = function (newContent, newPathNode, oldPathNode) {
    var items = []; // not using oldPathNode in the code, just need to check its existance

    if (newPathNode && oldPathNode) {
      // helper functions that allow to walk the DOM and find all nodes
      // the have to be handled differently than link path element
      var getChildren = function getChildren(node, skipMe) {
        var children = [];

        while (node) {
          if (node.nodeType === 1 && node !== skipMe) {
            children.push(node);
          }

          node = node.nextSibling;
        }

        return children;
      }; // get node siblings except itself


      var getSiblings = function getSiblings(node) {
        return getChildren(node.parentNode.firstChild, node);
      }; // main logic


      var testNode = newContent; // update the test node if link content is an array

      if (Array.isArray(newContent)) {
        newContent.forEach(function (node) {
          if (node.contains(newPathNode)) testNode = node;else items.push(node);
        });
      }

      var currentNode = newPathNode;

      while (currentNode !== testNode) {
        items = items.concat(getSiblings(currentNode));
        currentNode = currentNode.parentNode;
      }
    } else if (newContent) {
      items = Array.isArray(newContent) ? newContent : [newContent];
    }

    return items;
  };
  /**
   * Helper function that inserts custom svg element before label element
   * @param {dvt.Container} container parent container
   * @param {object} svgElem custom link content as DOM element
   * @param {dvt.OutputText|dvt.BackgroundOutputText|dvt.MultilineText} label label object
   * @private
   */


  DvtDiagramLink._insertCustomElem = function (container, svgElem, label) {
    var labelElem = label ? label.getOuterElem() : null;

    if (container) {
      container.getContainerElem().insertBefore(svgElem, labelElem);
    }
  };
  /**
   * Finds appropriate renderer callback function.
   * Supported renderer types - renderer, selectionRenderer, hoverRenderer, focusRenderer.
   *
   * @return {function|null}
   * @private
   */


  DvtDiagramLink.prototype._getCustomRenderer = function (type) {
    var linkContentOpt = this._diagram.getOptions()['linkContent'];

    var rendererFunc = null;

    if (linkContentOpt) {
      var baseRenderer = linkContentOpt['renderer'];
      rendererFunc = linkContentOpt[type]; // we don't support selection/hover/focus renderers without base renderer

      rendererFunc = baseRenderer && rendererFunc ? rendererFunc : baseRenderer;
    }

    return rendererFunc;
  };
  /**
   * Builds an array of poins for link creation feedback based on existing points and
   * current local position.
   * @param {object} currentPos An object that contains x and y coordinate if the current mouse or touch position
   * @return {array} an array of x and y points for the link start and link end
   * @protected
   */


  DvtDiagramLink.prototype.GetCreationFeedbackPoints = function (currentPos) {
    var startPoints = this._customPoints ? this._customPoints : this.getPoints();
    return [startPoints[0], startPoints[1], currentPos.x, currentPos.y];
  };
  /**
   * Helper method processes custom link content generated by one of the link renderers.
   * The method strips the top level 'svg' element when there is one,
   * keeps the content intact when the root element is not 'svg'.
   * The method returns null when content does not contain svg fragment.
   * @param {Element|array} linkContent A DOM element or an array of elements from renderer callback
   * @return {Element|array|null} An SVG element or an array of elements, which will be used as content of a Diagram link, null if content does not contain svg fragment.
   * @private
   */


  DvtDiagramLink._processLinkContent = function (linkContent) {
    var customContent = null; // svg fragment from custom defined callback with 'svg' element as root

    if (linkContent.namespaceURI === dvt.ToolkitUtils.SVG_NS && linkContent.tagName === 'svg') {
      customContent = []; // Using Array.prototype.forEach.call() since IE11 does not support NodeList.forEach()

      Array.prototype.forEach.call(linkContent.childNodes, function (node) {
        customContent.push(node);
      });
    } // svg fragment from custom defined callback without 'svg' element as root
    else if (linkContent.namespaceURI === dvt.ToolkitUtils.SVG_NS) {
        customContent = linkContent;
      } // content from template - always an array of nodes or
      // updated content from customer defined callback that was initially wrapped into svg element
      else if (Array.isArray(linkContent)) {
          customContent = [];

          for (var i = 0; i < linkContent.length; i++) {
            if (linkContent[i].namespaceURI === dvt.ToolkitUtils.SVG_NS && linkContent[i].tagName === 'svg') {
              // Using Array.prototype.forEach.call() since IE11 does not support NodeList.forEach()
              Array.prototype.forEach.call(linkContent[i].childNodes, function (node) {
                customContent.push(node);
              });
              break;
            } else if (linkContent[i].namespaceURI === dvt.ToolkitUtils.SVG_NS) {
              customContent.push(linkContent[i]);
            }
          }
        }

    return Array.isArray(customContent) && customContent.length === 0 ? null : customContent;
  };
  /**
   * Checks if it is needed to move the contents to the touch event pane of the diagram
   * @returns {boolean} true if the contents are stashed, false otherwise
   */


  DvtDiagramLink.prototype._checkAndMoveContents = function () {
    // No need to move contents when there is no active touch event in this node
    // from the HandleImmediateTouchStartInternal handler method of the DvtDiagramEventManager
    if (!this._hasContentBoundToTouchEvent) {
      return false;
    }

    this.GetDiagram().storeTouchEventContent(this._customLinkContent, this);
    this._contentStoredInTouchEventContainer = this._customLinkContent; // Reset the _hasContentBoundToTouchEvent flag since the contents are moved to the touch events pane
    // and this links's content no longer is associated with active touch event

    this._hasContentBoundToTouchEvent = false;
    return true;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @constructor
   * @param {dvt.Context} context the rendering context
   * @param {dvt.Diagram} diagram the parent diagram component
   * @param {object} nodeData node data
   * @extends {dvt.BaseDiagramNode}
   */


  var DvtDiagramNode = function DvtDiagramNode(context, diagram, nodeData) {
    this.Init(context, diagram, nodeData);
  };

  dvt.Obj.createSubclass(DvtDiagramNode, dvt.BaseDiagramNode, 'DvtDiagramNode');
  /**
   * Returns a new instance of DvtDiagramNode
   * @param {dvt.Diagram} diagram the parent diagram
   * @param {object} data the data for this node
   * @return {DvtDiagramNode} the diagram node
   */

  DvtDiagramNode.newInstance = function (diagram, data) {
    return new DvtDiagramNode(diagram.getCtx(), diagram, data);
  };
  /**
   * Initializes this component
   * @param {dvt.Context} context the rendering context
   * @param {dvt.Diagram} diagram the parent diagram
   * @param {object} data the data for this node
   * @protected
   */


  DvtDiagramNode.prototype.Init = function (context, diagram, data) {
    DvtDiagramNode.superclass.Init.call(this, context, data['id'], diagram);
    this._data = data;
    this._isHighlighted = true;
    this._hasContentBoundToTouchEvent = false;
    this._contentStoredInTouchEventContainer = null;

    if (this.isSelectable()) {
      this.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
    }
  };
  /**
   * Gets the data object
   * @return {object} the data object
   */


  DvtDiagramNode.prototype.getData = function () {
    return this._data;
  };
  /**
   * Sets the data object
   * @param {object} data the data object
   */


  DvtDiagramNode.prototype.setData = function (data) {
    this._data = data;
  };
  /**
   * Gets the node id
   * @return {string} node id
   */


  DvtDiagramNode.prototype.getId = function () {
    return this._data['id'];
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.getContentBounds = function (forceDims) {
    if (!this._contentDims && forceDims) {
      this._contentDims = this._calcContentDims();
    }

    return this._contentDims;
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.getLabelBounds = function (forceDims) {
    var bounds = null;

    if (this._labelObj && forceDims) {
      bounds = this._labelObj.getDimensions();
    }

    return bounds;
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.setSelected = function (selected) {
    var prevState = this._getState();

    DvtDiagramNode.superclass.setSelected.call(this, selected);

    var selectionRenderer = this._getCustomRenderer('selectionRenderer');

    if (selectionRenderer) {
      this._applyCustomNodeContent(selectionRenderer, this._getState(), prevState);
    } else {
      this.processDefaultSelectionEffect(selected);
    }

    this.UpdateAriaLabel();
  };
  /**
   * Hide or show selection effect on the node
   * @param {boolean} selected true to show selected effect
   */


  DvtDiagramNode.prototype.processDefaultSelectionEffect = function (selected) {
    if (!this.getSelectionShape()) return;
    this.getSelectionShape().setSelected(selected);
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.isSelectable = function () {
    return this.GetDiagram().isSelectionSupported() && this.getData()['selectable'] != 'off';
  };
  /**
   * Gets node icon
   * @return {dvt.ImageMarker|dvt.SimpleMarker} node icon
   * @protected
   */


  DvtDiagramNode.prototype.GetIcon = function () {
    return this._shape;
  };
  /**
   * Renders diagram node
   */


  DvtDiagramNode.prototype.render = function () {
    this._cleanUp();

    var nodeData = this.getData();

    var renderer = this._getCustomRenderer('renderer');

    if (renderer) {
      this._applyCustomNodeContent(renderer, this._getState(), null); //update container padding if the node is a disclosed container


      if (this.isDisclosed()) {
        var zoom = this.GetDiagram().getPanZoomCanvas().getZoom();
        var nodeBoundingRect = this.getElem().getBoundingClientRect();
        var childPaneBoundingRect = this._childNodePane ? this._childNodePane.getElem().getBoundingClientRect() : null;
        this._containerPadding = {
          left: (childPaneBoundingRect.left - nodeBoundingRect.left) / zoom,
          right: (nodeBoundingRect.right - childPaneBoundingRect.right) / zoom,
          top: (childPaneBoundingRect.top - nodeBoundingRect.top) / zoom,
          bottom: (nodeBoundingRect.bottom - childPaneBoundingRect.bottom) / zoom
        };
      } //reset default selection shape if it is there


      if (this._selectionShape) {
        this.removeChild(this._selectionShape);
        this._selectionShape = null;
      }
    } else {
      if (this.isDisclosed()) {
        DvtDiagramNode._renderContainer(this._diagram, nodeData, this);
      } else {
        DvtDiagramNode._renderNodeBackground(this._diagram, nodeData, this);

        DvtDiagramNode._renderNodeIcon(this._diagram, nodeData, this);
      }

      DvtDiagramNode._addHoverSelectionDefaultStrokes(this.getSelectionShape(), nodeData);
    }

    DvtDiagramNode._renderNodeLabels(this._diagram, nodeData, this);

    this._setDraggableStyleClass();

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


  DvtDiagramNode.prototype._applyCustomNodeContent = function (renderer, state, prevState) {
    var contextHandler = this._diagram.getOptions()['_contextHandler'];

    if (!contextHandler) {
      this._diagram.Log('dvt.Diagram: could not add custom node content - context handler is undefined', 1);

      return;
    }

    var nodeDataContext = this.getDataContext();
    var childContent = null;

    if (this.isDisclosed()) {
      var childNodePane = this.GetChildNodePane();
      var bbox = childNodePane.getDimensions();
      childContent = {
        'element': childNodePane.getElem(),
        'w': bbox ? bbox.w - bbox.x : null,
        'h': bbox ? bbox.h - bbox.y : null
      };
    }

    var context = contextHandler('node', this.getElem(), this._customNodeContent, childContent, nodeDataContext, state, prevState);
    var nodeContent = renderer(context); //   - support null case on updates for custom elements

    if (!nodeContent && this._customNodeContent && this.getCtx().isCustomElement()) {
      return;
    } //remove content if the new and old content do not match, the new content might be null


    if (this._customNodeContent && nodeContent != this._customNodeContent) {
      // BUG: JET-31495 - IMPOSSIBLE TO REMOVE HOVER TREATMENT AND TOOLTIP, WHEN INLINE TEMPLATE IS USED
      // When renderer function creates content which is different from the initial content, the initial content
      // is removed from the DOM which breaks the touch events.
      // To fix this, the initial content is added to the touch event container before it can be safely destroyed
      // Move old contents if needed, instead of removing them.
      var stashedOldContents = this._checkAndMoveContents(); // No need to remove contents if they are already moved.


      if (!stashedOldContents) {
        if (this._customNodeContent.namespaceURI === dvt.ToolkitUtils.SVG_NS) {
          this.getContainerElem().removeChild(this._customNodeContent);
        } else if (Array.isArray(this._customNodeContent)) {
          this._customNodeContent.forEach(function (node) {
            this.getContainerElem().removeChild(node);
          }.bind(this));
        } else {
          this.removeChild(nodeContent);
        }
      }

      this._customNodeContent = null;
    } // If the content stored in the touch event container is the new content
    // then we need to set the _hasContentBoundToTouchEvent flag to make sure
    // it is not removed from the DOM before the event ends.


    if (nodeContent === this._contentStoredInTouchEventContainer) {
      this._hasContentBoundToTouchEvent = true;
    }

    if (nodeContent && nodeContent.namespaceURI === dvt.ToolkitUtils.SVG_NS) {
      if (!this._customNodeContent) {
        dvt.ToolkitUtils.appendChildElem(this.getContainerElem(), nodeContent);
        this._customNodeContent = nodeContent;
      }
    } else if (nodeContent && Array.isArray(nodeContent)) {
      if (!this._customNodeContent) {
        nodeContent.forEach(function (node) {
          dvt.ToolkitUtils.appendChildElem(this.getContainerElem(), node);
        }.bind(this));
        this._customNodeContent = nodeContent;
      }
    } else if (nodeContent instanceof dvt.BaseComponent) {
      if (!this._customNodeContent) {
        this.addChild(nodeContent);
        this._customNodeContent = nodeContent;
      }
    } else if (nodeContent) {
      //not an svg fragment
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


  DvtDiagramNode._renderNodeBackground = function (diagram, nodeData, container) {
    // TODO: removing node background for custom elements,
    // since we can't properly support svg style and class name at the moment
    if (diagram.getCtx().isCustomElement()) return;
    var backgroundStyle = nodeData['backgroundSvgStyle'] || nodeData['backgroundStyle'];
    var styleObj = dvt.JsonUtils.clone(backgroundStyle);
    var backgroundProps = [dvt.CSSStyle.WIDTH, dvt.CSSStyle.HEIGHT, dvt.CSSStyle.BACKGROUND_COLOR, dvt.CSSStyle.BORDER_COLOR, dvt.CSSStyle.BORDER_WIDTH, dvt.CSSStyle.BORDER_RADIUS]; //Merge the background style from options and background style from CSS object

    var backgroundStyle = DvtDiagramNode._getNodeCSSStyle(styleObj, nodeData['_backgroundStyle'], backgroundProps);

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
        backgroundRect.setStroke(new dvt.Stroke(borderColor, 1, borderWidth));
      } //Parse out the CSS properties which are already applied on the DOM


      if (styleObj) backgroundProps.forEach(function (entry) {
        delete styleObj[dvt.CSSStyle.cssStringToObjectProperty(entry)];
      }); //Set the style and class attributes for node background

      var bgClassName = nodeData['backgroundSvgClassName'] || nodeData['backgroundClassName'];
      backgroundRect.setStyle(styleObj).setClassName(bgClassName);
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


  DvtDiagramNode._renderNodeIcon = function (diagram, nodeData, container) {
    var icon = nodeData['icon'];

    if (icon) {
      var iconWidth = icon['width'];
      var iconHeight = icon['height'];
      var iconColor = icon['color'];
      var iconBorderRadius = icon['borderRadius'];
      var iconMarker;

      if (icon['source']) {
        iconMarker = new dvt.ImageMarker(diagram.getCtx(), iconWidth / 2, iconHeight / 2, iconWidth, iconHeight, iconBorderRadius, icon['source'], icon['sourceSelected'], icon['sourceHover'], icon['sourceHoverSelected']);
      } else {
        iconMarker = new dvt.SimpleMarker(diagram.getCtx(), icon['shape'], iconWidth / 2, iconHeight / 2, iconWidth, iconHeight, iconBorderRadius);
      }

      if (icon['fillPattern'] != 'none') {
        iconMarker.setFill(new dvt.PatternFill(icon['fillPattern'], iconColor, iconColor));
      } else {
        iconMarker.setSolidFill(iconColor);
      }

      if (icon['opacity'] != null) {
        iconMarker.setAlpha(icon['opacity']);
      }

      if (icon['borderColor']) {
        iconMarker.setStroke(new dvt.Stroke(icon['borderColor'], 1, icon['borderWidth']));
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


  DvtDiagramNode._setIconPosition = function (diagram, nodeData, container) {
    if (container._background) {
      var iconData = nodeData['icon'];

      var backgroundWidth = container._background.getWidth();

      var backgroundHeight = container._background.getHeight();

      var iconWidth = iconData['width'];
      var iconHeight = iconData['height']; //default to center

      var positionX = (backgroundWidth - iconWidth) * .5;
      var positionY = (backgroundHeight - iconHeight) * .5; // find x position

      if (iconData['positionX'] !== undefined) {
        //allow positionX=0
        positionX = parseFloat(iconData['positionX']);

        if (dvt.Agent.isRightToLeft(container.getCtx())) {
          positionX = backgroundWidth - positionX - iconWidth;
        }
      } else {
        var resolvedHalign = iconData['halign'];

        if (resolvedHalign == 'start') {
          resolvedHalign = dvt.Agent.isRightToLeft(container.getCtx()) ? 'right' : 'left';
        } else if (resolvedHalign == 'end') {
          resolvedHalign = dvt.Agent.isRightToLeft(container.getCtx()) ? 'left' : 'right';
        }

        positionX = resolvedHalign == 'left' ? 0 : resolvedHalign == 'right' ? backgroundWidth - iconWidth : positionX;
      } // find y position


      if (iconData['positionY'] !== undefined) {
        positionY = parseFloat(iconData['positionY']);
      } else {
        if (iconData['valign'] == 'top') {
          positionY = 0;
        } else if (iconData['valign'] == 'bottom') {
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


  DvtDiagramNode._renderNodeLabels = function (diagram, nodeData, container) {
    var labelString = nodeData['label'];

    if (labelString) {
      var rtl = dvt.Agent.isRightToLeft(diagram.getCtx());
      var bMultiline = labelString.indexOf('\n') > 0;
      var halign = bMultiline ? rtl ? dvt.MultilineText.H_ALIGN_RIGHT : dvt.MultilineText.H_ALIGN_LEFT : rtl ? dvt.OutputText.H_ALIGN_RIGHT : dvt.OutputText.H_ALIGN_LEFT;
      var valign = bMultiline ? dvt.MultilineText.V_ALIGN_TOP : dvt.OutputText.V_ALIGN_TOP;
      var label = DvtDiagramNode.createText(diagram.getCtx(), labelString, nodeData['labelStyle'], halign, valign, bMultiline);
      var maxWidth = nodeData['labelStyle'].getMaxWidth() || nodeData['labelStyle'].getWidth();
      var labelWidth = dvt.CSSStyle.toNumber(maxWidth);

      if (!maxWidth) {
        container.addChild(label);
        container._labelObj = label;
      } else if (labelWidth > 0 && dvt.TextUtils.fitText(label, labelWidth, Infinity, container)) {
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
   * @param {dvt.CSSStyle} style the CSS style string to apply to the text
   * @param {string} halign the horizontal alignment
   * @param {string} valign the vertical alignment
   * @param {boolean} bMultiline whether or not this element will be a MultilineText
   * @return {dvt.OutputText|dvt.BackgroundOutputText|dvt.MultilineText} the text element
   */


  DvtDiagramNode.createText = function (ctx, strText, style, halign, valign, bMultiline) {
    var text;
    if (style.hasBackgroundStyles()) text = bMultiline ? new dvt.BackgroundMultilineText(ctx, strText, 0, 0, style, null, true) : new dvt.BackgroundOutputText(ctx, strText, 0, 0, style);else {
      text = bMultiline ? new dvt.MultilineText(ctx, strText, 0, 0, null, true) : new dvt.OutputText(ctx, strText, 0, 0);
      text.setCSSStyle(style);
    }
    text.setHorizAlignment(halign);
    text.setVertAlignment(valign);
    return text;
  };
  /**
   * Adds default hover selection strokes to the node
   * @param {dvt.Shape} selectionShape selection shape for the node
   * @param {object} nodeData node data
   * @private
   */


  DvtDiagramNode._addHoverSelectionDefaultStrokes = function (selectionShape, nodeData) {
    //Apply the selected, and hover strokes
    var hoverInnerColor = nodeData['hoverInnerColor'];
    var hoverOuterColor = nodeData['hoverOuterColor'];
    var selectionColor = nodeData['selectionColor'];
    var his = new dvt.Stroke(hoverInnerColor, 1, 4, true);
    var hos = new dvt.Stroke(hoverOuterColor, 1, 8, true);
    var sis = new dvt.Stroke(hoverInnerColor, 1, 2, true);
    var sos = new dvt.Stroke(selectionColor, 1, 6, true);
    var shis = new dvt.Stroke(hoverInnerColor, 1, 4, true);
    var shos = new dvt.Stroke(selectionColor, 1, 8, true);
    selectionShape.setHoverStroke(his, hos).setSelectedStroke(sis, sos).setSelectedHoverStroke(shis, shos);
  };
  /**
   * Adds hover selection strokes to the node which has OUTER stroke alignment
   * @param {dvt.Shape} selectionShape selection shape for the node
   * @param {object} nodeData node data
   * @private
   */


  DvtDiagramNode._addHoverSelectionOuterStrokes = function (selectionShape, nodeData) {
    //Apply the selected, and hover strokes
    var hoverInnerColor = nodeData['hoverInnerColor'];
    var hoverOuterColor = nodeData['hoverOuterColor'];
    var selectionColor = nodeData['selectionColor']; // For OUTER stroke alignment, the stroke is applied on the outer edge of the path of the selection shape.
    // The outer stroke will circumscribe inner stroke and the width of outer stroke won't be reduced by inner stroke.
    // The outer stroke visible width will be same as specified.

    var his = new dvt.Stroke(hoverInnerColor, 1, 2, true);
    var hos = new dvt.Stroke(hoverOuterColor, 1, 2, true);
    var sis = new dvt.Stroke(hoverInnerColor, 1, 1, true);
    var sos = new dvt.Stroke(selectionColor, 1, 2, true);
    var shis = new dvt.Stroke(hoverInnerColor, 1, 2, true);
    var shos = new dvt.Stroke(selectionColor, 1, 2, true);
    selectionShape.setHoverStroke(his, hos).setSelectedStroke(sis, sos).setSelectedHoverStroke(shis, shos);
  };
  /**
   * Sets the shape that should be used for displaying selection and hover feedback
   * @param {dvt.Shape} selectionShape the shape that should be used for displaying selection and hover feedback
   */


  DvtDiagramNode.prototype.setSelectionShape = function (selectionShape) {
    this._selectionShape = selectionShape;
  };
  /**
   * Gets the shape that should be used for displaying selection and hover feedback
   * @return {dvt.Shape} the shape that should be used for displaying selection and hover feedback
   */


  DvtDiagramNode.prototype.getSelectionShape = function () {
    if (!this._selectionShape) {
      // create selection shape in necessary
      var contentDims = this.getContentBounds(true);

      if (contentDims) {
        var selectionShape = new dvt.Rect(this._diagram.getCtx(), contentDims.x, contentDims.y, contentDims.w, contentDims.h);
        selectionShape.setInvisibleFill(); // Selection shape stroke alignment is set to OUTER.

        selectionShape.setStrokeAlignment('outer');
        this.setSelectionShape(selectionShape);
        this.addChildAt(selectionShape, 0);

        DvtDiagramNode._addHoverSelectionOuterStrokes(selectionShape, this.getData());

        this._selectionShape = selectionShape;
      }
    }

    return this._selectionShape;
  };
  /**
   * Handles touch start event on this node
   */


  DvtDiagramNode.prototype.handleTouchStart = function () {
    // Called from HandleImmediateTouchStartInternal of DvtDiagramEventManager
    // when a touch event is started on this node.
    // Set the _hasContentBoundToTouchEvent flag to indicate a touch event started on the
    // content of this node is active.
    // This will be unset in cases like hover/zoom where the contents are moved to
    // touch event container and the updated contents are not a part of the touch event.
    this._hasContentBoundToTouchEvent = true;
  };
  /**
   * Handles touch end event on this node
   */


  DvtDiagramNode.prototype.handleTouchEnd = function () {
    // Called from HandleImmediateTouchEndInternal of DvtDiagramEventManager
    // when a touch event is ended on this node.
    // Unset the _hasContentBoundToTouchEvent flag to indicate a touch event started on the
    // content of this node is no more active.
    // This is to make sure that it is unset in case like selection event
    // where this flag is set on the handleTouchStart but never updated as
    // the custom render would not have happened.
    this._hasContentBoundToTouchEvent = false;
    this._contentStoredInTouchEventContainer = null;
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.showHoverEffect = function () {
    if (this._isShowingHoverEffect) return;

    var prevState = this._getState();

    this._isShowingHoverEffect = true;

    var hoverRenderer = this._getCustomRenderer('hoverRenderer');

    if (hoverRenderer) {
      this._applyCustomNodeContent(hoverRenderer, this._getState(), prevState);
    } else {
      this.processDefaultHoverEffect(true);
    }
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.hideHoverEffect = function () {
    if (this._isShowingHoverEffect) {
      var prevState = this._getState();

      this._isShowingHoverEffect = false;

      var hoverRenderer = this._getCustomRenderer('hoverRenderer');

      if (hoverRenderer) {
        this._applyCustomNodeContent(hoverRenderer, this._getState(), prevState);
      } else {
        this.processDefaultHoverEffect(false);
      }
    }
  };
  /**
   * Hides or shows default hover effect
   * @param {boolean} hovered true to show hover effect
   */


  DvtDiagramNode.prototype.processDefaultHoverEffect = function (hovered) {
    if (!this.getSelectionShape()) return;
    if (hovered) this.getSelectionShape().showHoverEffect();else this.getSelectionShape().hideHoverEffect();
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.getDatatip = function (target, x, y) {
    // Custom Tooltip from Function
    var customTooltip = this.GetDiagram().getOptions()['tooltip'];
    var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
    if (tooltipFunc) return this.GetDiagram().getCtx().getTooltipManager().getCustomTooltip(tooltipFunc, this.getDataContext()); // Custom Tooltip from ShortDesc

    return this.getShortDesc();
  };
  /**
   * Returns short description for the node
   * @return {string}  short description for the node
   */


  DvtDiagramNode.prototype.getShortDesc = function () {
    return this.getData()['shortDesc'];
  };
  /**
   * Returns the data context that will be passed to the tooltip function.
   * @return {object}
   */


  DvtDiagramNode.prototype.getDataContext = function () {
    var data = this.getData();
    var dataContext = {
      'id': this.getId(),
      'type': 'node',
      'label': data['label'],
      'data': this.GetDiagram().isDataProviderMode() ? data['_noTemplate'] ? data['_itemData'] : data : data['_itemData'],
      'itemData': this.GetDiagram().isDataProviderMode() ? data['_itemData'] : null,
      'component': this.GetDiagram().getOptions()['_widgetConstructor']
    };
    return this.getCtx().fixRendererContext(dataContext);
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.getAriaLabel = function () {
    var states = [];
    var translations = this.GetDiagram().getOptions().translations;

    if (this.isSelectable()) {
      states.push(translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
    }

    if (this.isContainer()) {
      states.push(translations[this.isDisclosed() ? 'stateExpanded' : 'stateCollapsed']);
    }

    return dvt.Displayable.generateAriaLabel(this.getShortDesc(), states);
  };
  /**
   * @protected
   * Updates accessibility attributes on selection event
   */


  DvtDiagramNode.prototype.UpdateAriaLabel = function () {
    if (!dvt.Agent.deferAriaCreation()) {
      var desc = this.getAriaLabel();
      if (desc) this.setAriaProperty('label', desc);
    }
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.getNextNavigable = function (event) {
    var next = null;

    if (event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey) {
      // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
      // care of the selection
      next = this;
    } else if ((event.keyCode == dvt.KeyboardEvent.OPEN_ANGLED_BRACKET || dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET) && event.altKey) {
      //get first navigable link if exists
      var adjLinks = this.GetDiagram().getNavigableLinksForNodeId(this.getId());
      var keyboardHandler = this.GetDiagram().getEventManager().getKeyboardHandler();
      if (keyboardHandler && keyboardHandler.getFirstNavigableLink) next = keyboardHandler.getFirstNavigableLink(this, event, adjLinks);
      if (next) next.setKeyboardFocusNode(this);else next = this;
    } else if (event.keyCode == dvt.KeyboardEvent.OPEN_BRACKET) {
      //next node down in container hierarchy
      if (this.isDisclosed()) {
        var childNodes = this.getChildNodes();
        next = childNodes[0];
      } else next = this;
    } else if (event.keyCode == dvt.KeyboardEvent.CLOSE_BRACKET) {
      //next node up in container hierarchy
      var parentNode = this.getGroupId() ? this.GetDiagram().getNodeById(this.getGroupId()) : null;
      next = parentNode ? parentNode : this;
    } else if (event.type == dvt.MouseEvent.CLICK) {
      next = this;
    } else {
      // get next navigable node
      var parentNode = this.getGroupId() ? this.GetDiagram().getNodeById(this.getGroupId()) : null;
      var siblings = parentNode ? parentNode.getChildNodes() : this.GetDiagram().GetRootNodeObjects();
      next = dvt.KeyboardHandler.getNextAdjacentNavigable(this, event, siblings);
    }

    if (event instanceof dvt.KeyboardEvent) this._diagram.ensureObjInViewport(event, next);
    return next;
  };
  /**
   * Process a keyboard event
   * @param {dvt.KeyboardEvent} event
   */


  DvtDiagramNode.prototype.HandleKeyboardEvent = function (event) {
    if (event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey && event.shiftKey) {
      if (this.isContainer()) {
        this.GetDiagram().setNodeDisclosed(this.getId(), !this.isDisclosed());
      }
    }
  };
  /**
   * Check if the node is a container node
   * @return {boolean} return true for container node
   */


  DvtDiagramNode.prototype.isContainer = function () {
    if (this._diagram.isTreeDataProvider()) {
      var childDataProvider = this._diagram.getOptions().nodeData.getChildDataProvider(this.getId());

      return childDataProvider ? childDataProvider.isEmpty() !== 'yes' : false;
    } else if (this._diagram.isDataProviderMode()) {
      return false;
    } else {
      var dataSource = this.GetDiagram().getOptions()['data'];
      return dataSource['getChildCount'](this.getData()) == 0 ? false : true;
    }
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.showKeyboardFocusEffect = function () {
    if (this.isShowingKeyboardFocusEffect()) return;

    var prevState = this._getState();

    this._isShowingKeyboardFocusEffect = true;

    var focusRenderer = this._getCustomRenderer('focusRenderer');

    if (focusRenderer) {
      this._applyCustomNodeContent(focusRenderer, this._getState(), prevState);
    } else {
      this.processDefaultFocusEffect(true);
    }
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.hideKeyboardFocusEffect = function () {
    if (this.isShowingKeyboardFocusEffect()) {
      var prevState = this._getState();

      this._isShowingKeyboardFocusEffect = false;

      var focusRenderer = this._getCustomRenderer('focusRenderer');

      if (focusRenderer) {
        this._applyCustomNodeContent(focusRenderer, this._getState(), prevState);
      } else {
        this.processDefaultFocusEffect(false);
      }
    }
  };
  /**
   * Hides or shows default keyboard focus effect
   * @param {boolean} focused true to show keyboard focus effect
   */


  DvtDiagramNode.prototype.processDefaultFocusEffect = function (focused) {
    this.processDefaultHoverEffect(focused);
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.isShowingKeyboardFocusEffect = function () {
    return this._isShowingKeyboardFocusEffect;
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.getCategories = function () {
    return this.getData()['categories'] ? this.getData()['categories'] : [this.getId()];
  };
  /**
   * Checks whether the object is hidden
   * @return {boolean} true if the object is hidden
   */


  DvtDiagramNode.prototype.isHidden = function () {
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


  DvtDiagramNode.prototype._calcContentDims = function () {
    var dims = null;

    if (this._customNodeContent) {
      // custom renderer
      var bbox;

      if (this._customNodeContent instanceof dvt.BaseComponent) {
        bbox = this._customNodeContent.getDimensions();

        if (bbox) {
          dims = new dvt.Rectangle(bbox.x, bbox.y, bbox.w, bbox.h);
        }
      } else {
        var customNode = this._customNodeContent;

        if (Array.isArray(customNode)) {
          for (var i = 0; i < customNode.length; i++) {
            // get the svg elmeent to measure
            if (customNode[i].namespaceURI === dvt.ToolkitUtils.SVG_NS) {
              customNode = customNode[i];
              break;
            }
          }
        }

        bbox = customNode.getBBox();

        if (bbox) {
          dims = new dvt.Rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
        }
      }
    } else if (this.isDisclosed()) {
      // standard container renderer
      dims = this._containerShape.GetDimensionsWithStroke(this);
    } else {
      // standard leaf node or collapsed node renderer
      dims = this._background ? this._background.GetDimensionsWithStroke(this) : null;

      if (dims && this._shape) {
        dims = dims.getUnion(this._shape.GetDimensionsWithStroke(this));
      } else if (!dims && this._shape) {
        dims = this._shape.GetDimensionsWithStroke(this);
      }
    }

    return dims;
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.animateUpdate = function (animationHandler, oldNode) {
    var playable = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration()); // animate node internals - consider 3 different scenarios
    // - node is leaf node or collapsed container node - animate internal elements
    // - container node - disclosure state didn't change - constract animation for children
    // - container node - disclosure state changed - animate disclosure
    // 1. node is leaf node or collapsed container node

    if (!this.isDisclosed() && !oldNode.isDisclosed()) {
      DvtDiagramNode._animatePosition(playable, oldNode, this); //size


      if (oldNode._shape && this._shape) {
        playable.getAnimator().addProp(dvt.Animator.TYPE_RECTANGLE, this._shape, this._shape.getCenterDimensions, this._shape.setCenterDimensions, this._shape.getCenterDimensions());

        this._shape.setCenterDimensions(oldNode._shape.getCenterDimensions());
      } //label


      if (oldNode._labelObj && this._labelObj) {
        var oldMat = oldNode._labelObj.getMatrix();

        var newMat = this._labelObj.getMatrix();

        if (!oldMat.equals(newMat)) {
          this._labelObj.setMatrix(oldMat);

          playable.getAnimator().addProp(dvt.Animator.TYPE_MATRIX, this._labelObj, this._labelObj.getMatrix, this._labelObj.setMatrix, newMat);
        }
      } //background and icon


      DvtDiagramNode._animateFill(playable, oldNode._background, this._background);

      DvtDiagramNode._animateFill(playable, oldNode._shape, this._shape);
    } // 2. both nodes are disclosed containers - node size, background and child nodes could change
    else if (this.isDisclosed() && oldNode.isDisclosed()) {
        //label
        if (oldNode._labelObj && this._labelObj) {
          var oldMat = oldNode._labelObj.getMatrix();

          var newMat = this._labelObj.getMatrix();

          if (!oldMat.equals(newMat)) {
            this._labelObj.setMatrix(oldMat);

            playable.getAnimator().addProp(dvt.Animator.TYPE_MATRIX, this._labelObj, this._labelObj.getMatrix, this._labelObj.setMatrix, newMat);
          }
        }

        if (this._getCustomRenderer('renderer')) {
          this._animateCustomUpdate(animationHandler, oldNode);
        } else {
          DvtDiagramNode._animatePosition(playable, oldNode, this); //animate size and background


          DvtDiagramNode._animateContainer(playable, oldNode._containerShape, this._containerShape); //animate expand-collapse button position in rtl case


          if (dvt.Agent.isRightToLeft(this.getCtx()) && oldNode._containerButton && this._containerButton) {
            var oldButtonTx = oldNode._containerButton.getTranslateX();

            var newButtonTx = this._containerButton.getTranslateX();

            if (oldButtonTx != newButtonTx) {
              this._containerButton.setTranslateX(oldButtonTx);

              playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this._containerButton, this._containerButton.getTranslateX, this._containerButton.setTranslateX, newButtonTx);
            }
          }

          if (!oldNode['partialUpdate']) {
            //construct animation for child nodes
            var newChildNodes = [],
                oldChildNodes = [];
            var newChildIds = this.getChildNodeIds();

            for (var i = 0; i < newChildIds.length; i++) {
              newChildNodes.push(this.GetDiagram().getNodeById(newChildIds[i]));
            }

            var oldChildIds = oldNode.getChildNodeIds();
            var oldNodes = animationHandler.getOldDiagram().NodesMap;

            for (var i = 0; i < oldChildIds.length; i++) {
              oldChildNodes.push(oldNodes.get(oldChildIds[i]));
            }

            animationHandler.constructAnimation(oldChildNodes, newChildNodes);
          }
        }
      } // 3. disclosure state changed - animate disclosure
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


  DvtDiagramNode.prototype._animateCustomUpdate = function (animationHandler, oldNode) {
    var oldBounds = oldNode.getContentBounds();
    var newBounds = this.getContentBounds();

    if (oldBounds.equals(newBounds)) {
      var playable = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration());

      DvtDiagramNode._animatePosition(playable, oldNode, this);

      animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE);
      return;
    } // scales for sizing and positioning


    var scaleTo = newBounds.w / oldBounds.w; //used for old node

    var scaleFrom = oldBounds.w / newBounds.w; //used for new node
    //create animator to animate position

    var playable = new dvt.CustomAnimation(this.getCtx(), null, animationHandler.getAnimationDuration()); //animate new node position

    var oldNodeCenter = new dvt.Point(oldNode.getTranslateX() + oldBounds.w * .5, oldNode.getTranslateY() + oldBounds.h * .5);
    var newTx = this.getTranslateX();
    var newTy = this.getTranslateY();
    this.setTranslateX(oldNodeCenter.x - newBounds.w * scaleFrom * .5);
    this.setTranslateY(oldNodeCenter.y - newBounds.w * scaleFrom * .5);
    playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getTranslateX, this.setTranslateX, newTx);
    playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, this, this.getTranslateY, this.setTranslateY, newTy);
    animationHandler.add(playable, DvtDiagramDataAnimationHandler.UPDATE); // animate scale and fade in new node

    this.setScaleX(scaleFrom);
    this.setScaleY(scaleFrom);
    var scaleNewToOld = new dvt.AnimScaleTo(this.getCtx(), this, new dvt.Point(1, 1), animationHandler.getAnimationDuration());
    animationHandler.add(scaleNewToOld, DvtDiagramDataAnimationHandler.UPDATE);
    var oldNodeContent = oldNode['partialUpdate'] ? oldNode['origContent'] : oldNode;

    if (oldNodeContent) {
      // animate old node - can do this for partial updates
      //attach old node for custom animation
      this.getParent().addChild(oldNodeContent); //animate old node position

      var newNodeCenter = new dvt.Point(this.getTranslateX() + newBounds.w * .5, this.getTranslateY() + newBounds.h * .5);
      playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, oldNodeContent, oldNode.getTranslateX, oldNodeContent.setTranslateX, newNodeCenter.x - oldBounds.w * scaleTo * .5);
      playable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, oldNodeContent, oldNode.getTranslateY, oldNodeContent.setTranslateY, newNodeCenter.y - oldBounds.h * scaleTo * .5); // animate scale and fade out old node

      var scaleOldToNew = new dvt.AnimScaleTo(this.getCtx(), oldNodeContent, new dvt.Point(scaleTo, scaleTo), animationHandler.getAnimationDuration());
      animationHandler.add(scaleOldToNew, DvtDiagramDataAnimationHandler.UPDATE);
      var fadeOut = new dvt.AnimFadeOut(this.getCtx(), oldNodeContent, animationHandler.getAnimationDuration());
      animationHandler.add(fadeOut, DvtDiagramDataAnimationHandler.UPDATE);
      var thisRef = this;
      dvt.Playable.appendOnEnd(fadeOut, function () {
        thisRef.getParent().removeChild(oldNodeContent);
      });
      this.setAlpha(0);
      var fadeIn = new dvt.AnimFadeIn(this.getCtx(), this, animationHandler.getAnimationDuration());
      animationHandler.add(fadeIn, DvtDiagramDataAnimationHandler.UPDATE);
    }
  };
  /**
   * Helper to animate node position
   * @param {dvt.Playable} playable The playable to add the animation to
   * @param {dvt.Displayable} oldNode old node
   * @param {dvt.Displayable} newNode new node
   * @private
   */


  DvtDiagramNode._animatePosition = function (playable, oldNode, newNode) {
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


  DvtDiagramNode._animateContainer = function (playable, oldDisplayable, newDisplayable) {
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


  DvtDiagramNode._animateFill = function (playable, oldDisplayable, newDisplayable) {
    if (oldDisplayable && newDisplayable && newDisplayable.getFill() instanceof dvt.SolidFill && !newDisplayable.getFill().equals(oldDisplayable.getFill())) {
      playable.getAnimator().addProp(dvt.Animator.TYPE_FILL, newDisplayable, newDisplayable.getFill, newDisplayable.setFill, newDisplayable.getFill());
      newDisplayable.setFill(oldDisplayable.getFill());
    }
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.animateDelete = function (animationHandler, deleteContainer) {
    this.GetDiagram().getNodesPane().addChild(this);
    var thisRef = this;

    var removeFunc = function removeFunc() {
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


  DvtDiagramNode.prototype.animateInsert = function (animationHandler) {
    this.setAlpha(0);
    animationHandler.add(new dvt.AnimFadeIn(this.getCtx(), this, animationHandler.getAnimationDuration()), DvtDiagramDataAnimationHandler.INSERT);
  };
  /**
   * Retrieves current state for the node
   * @param {number} zoom optional zoom level for the component
   * @return {Object} object that contains current hovered, selected, focused staed and zoom level for the node
   * @private
   */


  DvtDiagramNode.prototype._getState = function (zoom) {
    return {
      'hovered': this._isShowingHoverEffect,
      'selected': this.isSelected(),
      'focused': this._isShowingKeyboardFocusEffect,
      'zoom': zoom ? zoom : this.GetDiagram().getPanZoomCanvas().getZoom(),
      'expanded': this.isDisclosed()
    };
  };
  /**
   * Calls zoom renderer on zoom event if zoom renderer is specified
   * @param {object} event zoom event
   */


  DvtDiagramNode.prototype.rerenderOnZoom = function (event) {
    var zoomRenderer = this._getCustomRenderer('zoomRenderer');

    if (zoomRenderer) {
      var prevState = this._getState(event.oldZoom);

      var state = this._getState(event.newZoom);

      this._applyCustomNodeContent(zoomRenderer, state, prevState);
    }
  };
  /**
   * Highlight current node
   * @param {boolean} bHighlight true if the node should be highlighted
   */


  DvtDiagramNode.prototype.highlight = function (bHighlight) {
    if (this._isHighlighted !== bHighlight) {
      this._isHighlighted = bHighlight;
      var highlightAlpha = bHighlight ? 1.0 : this._diagram.getOptions()['styleDefaults']['_highlightAlpha'];

      if (!this._customNodeContent && this.isDisclosed()) {
        // update parts of a standard container
        this._containerShape && this._containerShape.setAlpha(highlightAlpha);
        this._containerButton && this._containerButton.setAlpha(highlightAlpha);
        this._labelObj && this._labelObj.setAlpha(highlightAlpha);
        this._selectionShape && this._selectionShape.setAlpha(highlightAlpha);
      } else {
        // default way - just toggle the value
        this.setAlpha(highlightAlpha);
      }
    }
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.setLabelAlignments = function (halign, valign) {
    var isMultiline = this._labelObj instanceof dvt.MultilineText || this._labelObj instanceof dvt.BackgroundMultilineText;
    if (valign == 'baseline') valign = isMultiline ? dvt.MultilineText.V_ALIGN_TOP : dvt.OutputText.V_ALIGN_AUTO;

    this._labelObj.setHorizAlignment(halign);

    this._labelObj.setVertAlignment(valign);
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.getContainerPadding = function () {
    if (!this._containerPadding && this._getCustomRenderer('renderer')) {
      var zoom = this.GetDiagram().getPanZoomCanvas().getZoom();
      var nodeBoundingRect = this.getElem().getBoundingClientRect();
      var childPaneBoundingRect = this._childNodePane ? this._childNodePane.getElem().getBoundingClientRect() : null;
      this._containerPadding = {
        left: (childPaneBoundingRect.left - nodeBoundingRect.left) / zoom,
        right: (nodeBoundingRect.right - childPaneBoundingRect.right) / zoom,
        top: (childPaneBoundingRect.top - nodeBoundingRect.top) / zoom,
        bottom: (nodeBoundingRect.bottom - childPaneBoundingRect.bottom) / zoom
      };
    } else if (!this._containerPadding) {
      var paddingProps = ['padding-left', 'padding-right', 'padding-top', 'padding-bottom'];
      var containerStyleObj = this._data['containerSvgStyle'] || this._data['containerStyle'];

      var styles = DvtDiagramNode._getNodeCSSStyle(containerStyleObj, this._data['_containerStyle'], paddingProps);

      this._containerPadding = {
        left: styles.getPadding('padding-left'),
        right: styles.getPadding('padding-right'),
        top: styles.getPadding('padding-top'),
        bottom: styles.getPadding('padding-bottom')
      };
    }

    return this._containerPadding;
  };
  /**
   * Gets child ids for the node
   * @return {array} an array of child ids
   */


  DvtDiagramNode.prototype.getChildNodeIds = function () {
    return this._childNodeIds;
  };
  /**
   * Adds id of a child node to the array of child nodes
   * @param {string} id child id
   */


  DvtDiagramNode.prototype.addChildNodeId = function (id) {
    if (!this._childNodeIds) this._childNodeIds = [];

    this._childNodeIds.push(id);
  };
  /**
   * Removes id of a child node from the array of child nodes
   * @param {string} id child id
   */


  DvtDiagramNode.prototype.removeChildNodeId = function (id) {
    if (this._childNodeIds) {
      dvt.ArrayUtils.removeItem(this._childNodeIds, id);
    }
  };
  /**
   * Removes child node
   * @param {DvtDiagramNode} childNode child node
   */


  DvtDiagramNode.prototype.removeChildNode = function (childNode) {
    if (childNode) {
      this.removeChildNodeId(childNode.getId());

      this._childNodePane.removeChild(childNode);
    }
  };
  /**
   * Gets visible child nodes for the node
   * @return {array} an array of visible child nodes
   */


  DvtDiagramNode.prototype.getChildNodes = function () {
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


  DvtDiagramNode.prototype.setGroupId = function (id) {
    this._groupId = id;
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.getGroupId = function () {
    return this._groupId;
  };
  /**
   * @protected
   * Gets child node pane for the diagram node
   * @return {dvt.Container} child node pane for the diagram node
   */


  DvtDiagramNode.prototype.GetChildNodePane = function () {
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


  DvtDiagramNode.prototype.handleDisclosure = function (event) {
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


  DvtDiagramNode._renderContainer = function (diagram, nodeData, container) {
    // TODO: removing container styles for custom elements,
    // since we can't properly support svg style and class name at the moment
    var containerStyleObj = diagram.getCtx().isCustomElement() ? null : nodeData['containerSvgStyle'] || nodeData['containerStyle'];
    var styleObj = dvt.JsonUtils.clone(containerStyleObj);
    var containerProps = [dvt.CSSStyle.BACKGROUND_COLOR, dvt.CSSStyle.BORDER_COLOR, dvt.CSSStyle.BORDER_WIDTH, dvt.CSSStyle.BORDER_RADIUS]; //Merge the container style from options and container style from CSS object

    var containerStyle = DvtDiagramNode._getNodeCSSStyle(styleObj, nodeData['_containerStyle'], containerProps);

    var fillColor = containerStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
    var borderColor = containerStyle.getStyle(dvt.CSSStyle.BORDER_COLOR);
    var borderWidth = dvt.CSSStyle.toNumber(containerStyle.getStyle(dvt.CSSStyle.BORDER_WIDTH));
    var borderRadius = dvt.CSSStyle.toNumber(containerStyle.getStyle(dvt.CSSStyle.BORDER_RADIUS));
    var childNodePane = container.GetChildNodePane();
    var padding = container.getContainerPadding();
    childNodePane.setTranslate(padding.left, padding.top);
    var childBounds = childNodePane.getDimensionsWithStroke();
    var containerShape = new dvt.Rect(diagram.getCtx(), 0, 0, childBounds.w + padding.left + padding.right, childBounds.h + padding.top + padding.bottom);
    containerShape.setSolidFill(fillColor);

    if (borderRadius) {
      containerShape.setRx(borderRadius);
      containerShape.setRy(borderRadius);
    }

    if (borderColor) {
      containerShape.setStroke(new dvt.Stroke(borderColor, 1, borderWidth));
    } //Parse out the CSS properties which are already applied on the DOM


    if (styleObj) containerProps.forEach(function (entry) {
      delete styleObj[dvt.CSSStyle.cssStringToObjectProperty(entry)];
    }); // Set the style and class attributes for node container
    // TODO: removing container styles for custom elements,
    // since we can't properly support svg style and class name at the moment

    var containerClassName = diagram.getCtx().isCustomElement() ? null : nodeData['containerSvgClassName'] || nodeData['containerClassName'];
    containerShape.setStyle(styleObj).setClassName(containerClassName);
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


  DvtDiagramNode._getNodeCSSStyle = function (styleObj, styleCSS, properties) {
    var style = new dvt.CSSStyle();
    properties.forEach(function (entry) {
      var value = null; //convert CSS string property to object attribute

      var attribute = dvt.CSSStyle.cssStringToObjectProperty(entry);
      if (styleObj && styleObj[attribute] != null) value = styleObj[attribute];else if (styleCSS) value = styleCSS.getStyle(entry);
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


  DvtDiagramNode._renderContainerButton = function (diagram, nodeData, container) {
    if (!container.isContainer() || nodeData['showDisclosure'] == 'off') {
      return;
    }

    var iconEna, iconOvr, iconDwn;
    var options = diagram.getOptions();

    if (container.isDisclosed()) {
      iconEna = options['_resources']['collapse_ena'];
      iconOvr = options['_resources']['collapse_ovr'];
      iconDwn = options['_resources']['collapse_dwn'];
    } else {
      iconEna = options['_resources']['expand_ena'];
      iconOvr = options['_resources']['expand_ovr'];
      iconDwn = options['_resources']['expand_dwn'];
    }

    var imgEna = new dvt.Image(diagram.getCtx(), iconEna['src'], 0, 0, iconEna['width'], iconEna['height']);
    var imgOvr = new dvt.Image(diagram.getCtx(), iconOvr['src'], 0, 0, iconOvr['width'], iconOvr['height']);
    var imgDwn = new dvt.Image(diagram.getCtx(), iconDwn['src'], 0, 0, iconDwn['width'], iconDwn['height']);
    var containerButton = new dvt.Button(diagram.getCtx(), imgEna, imgOvr, imgDwn, null, null, container.handleDisclosure, container);
    container.addChild(containerButton);
    var contentDims = container.getContentBounds(true);

    if (contentDims) {
      var x = dvt.Agent.isRightToLeft(diagram.getCtx()) ? contentDims.x + contentDims.w - iconEna['width'] : contentDims.x;
      var y = contentDims.y;
      containerButton.setTranslate(x, y);
    }

    container._containerButton = containerButton;
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.isDragAvailable = function (clientIds) {
    return true;
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.getDragTransferable = function (mouseX, mouseY) {
    if (!this._isDraggable()) return null;
    return [this.getId()];
  };
  /**
   * @override
   */


  DvtDiagramNode.prototype.getDragFeedback = function (mouseX, mouseY) {
    if (this._diagram.getEventManager().LinkCreationStarted) {
      return null;
    } // If more than one object is selected, return the displayables of all selected objects


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


  DvtDiagramNode.prototype.ShowDropEffect = function () {
    if (!this._dropEffect) {
      this._createDropEffect('oj-diagram-node oj-active-drop');
    }
  };
  /**
   * Show rejected drop effect on the node
   */


  DvtDiagramNode.prototype.ShowRejectedDropEffect = function () {
    if (!this._dropEffect) {
      this._createDropEffect('oj-diagram-node oj-invalid-drop');
    }
  };
  /**
   * Clear drop effect from the node
   */


  DvtDiagramNode.prototype.ClearDropEffect = function () {
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


  DvtDiagramNode.prototype._createDropEffect = function (styleClass) {
    var dropEffectShape; // if this is a custom rendered node or disclosed node
    // or a leafnode with background or just an image
    // create a rectangle as a drop effect

    if (this._customNodeContent || this.isDisclosed() || this._background || this._shape && this._shape instanceof dvt.ImageMarker) {
      var contentDims = this.getContentBounds(true);

      if (contentDims) {
        dropEffectShape = new dvt.Rect(this._diagram.getCtx(), contentDims.x, contentDims.y, contentDims.w, contentDims.h);
        var borderRadius = this._customNodeContent ? null : this.isDisclosed() ? this._containerShape.getRx() : this._background ? this._background.getRx() : null;

        if (borderRadius) {
          dropEffectShape.setRx(borderRadius);
          dropEffectShape.setRy(borderRadius);
        }
      }
    } //otherwise copy node shape
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


  DvtDiagramNode.prototype._setDraggableStyleClass = function () {
    if (this._diagram.getEventManager().IsDragSupported() && this._isDraggable()) {
      var draggableTopShape = this._customNodeContent ? this : this.isDisclosed() ? this._containerShape : this._background ? this._background : this._shape;
      var el = draggableTopShape.getElem() ? draggableTopShape.getElem() : draggableTopShape;
      dvt.ToolkitUtils.addClassName(el, 'oj-diagram-node');
      dvt.ToolkitUtils.addClassName(el, 'oj-draggable');
    }
  };
  /**
   * Checks if the node is draggable
   * @private
   * @return {boolean} true if the node is draggable
   */


  DvtDiagramNode.prototype._isDraggable = function () {
    return this.getData()['draggable'] !== 'off' && this.getData()['draggable'] !== false;
  };
  /**
   * Helper function that converts node data from data source into internal format
   * @param {object} nodeData data object for the node from data source
   * @return {object} node data object in internal format
   * @protected
   */


  DvtDiagramNode.ConvertNodeData = function (nodeData) {
    return {
      'id': nodeData['id'],
      'label': nodeData['label'],
      'selectable': nodeData['selectable'],
      'shortDesc': nodeData['shortDesc'],
      'categories': nodeData['categories'],
      'nodes': nodeData['nodes'],
      '_itemData': nodeData
    };
  };
  /**
   * Removes and resets objects for the rendered node to prepare the node for rerendering
   * @param {dvt.Container} saveContainer a temporary container that keeps node content for animation
   * @private
   */


  DvtDiagramNode.prototype._cleanUp = function (saveContainer) {
    if (this._containerShape) {
      this.removeChild(this._containerShape);
      saveContainer && saveContainer.addChild(this._containerShape);
      this._containerShape = null;
    }

    if (this._background) {
      this.removeChild(this._background);
      saveContainer && saveContainer.addChild(this._background);
      this._background = null;
    }

    if (this._shape) {
      this.removeChild(this._shape);
      saveContainer && saveContainer.addChild(this._shape);
      this._shape = null;
    }

    if (this._labelObj) {
      this.removeChild(this._labelObj);
      saveContainer && saveContainer.addChild(this._labelObj);
      this._labelObj = null;
    }

    if (this._containerButton) {
      this.removeChild(this._containerButton);
      saveContainer && saveContainer.addChild(this._containerButton);
      this._containerButton = null;
    }

    if (this._customNodeContent) {
      // reparent child node pane - it is likely to be attached
      // to an element inside of custom content
      if (this._childNodePane) {
        this._childNodePane.setParent(null);

        this.addChild(this._childNodePane);
      }

      if (this._customNodeContent.namespaceURI === dvt.ToolkitUtils.SVG_NS) {
        this.getContainerElem().removeChild(this._customNodeContent);
        saveContainer && dvt.ToolkitUtils.appendChildElem(saveContainer.getContainerElem(), this._customNodeContent);
      } else if (Array.isArray(this._customNodeContent)) {
        for (var i = 0; i < this._customNodeContent.length; i++) {
          this.getContainerElem().removeChild(this._customNodeContent[i]);
          saveContainer && dvt.ToolkitUtils.appendChildElem(saveContainer.getContainerElem(), this._customNodeContent[i]);
        }
      } else if (this._customNodeContent instanceof dvt.BaseComponent) {
        this.removeChild(this._customNodeContent);
        saveContainer && saveContainer.addChild(this._customNodeContent);
      }

      this._customNodeContent = null;
    }

    this._contentDims = null;
  };
  /**
   * Returns an object that contains data used to animate node from one state to another
   * @param {boolean} keepOrigContent a flag that indicated that original node content should be preserved for animation
   * @return {object}
   */


  DvtDiagramNode.prototype.getAnimationState = function (keepOrigContent) {
    var shape, label, containerShape, state, origContent;
    var contentBounds = this.getContentBounds();

    if (this._shape) {
      shape = {
        'centerDimensions': this._shape.getCenterDimensions(),
        'fill': this._shape.getFill()
      };

      shape.getCenterDimensions = function () {
        return shape['centerDimensions'];
      };

      shape.getFill = function () {
        return shape['fill'];
      };
    }

    if (this._labelObj) {
      label = {
        'matrix': this._labelObj.getMatrix()
      };

      label.getMatrix = function () {
        return label['matrix'];
      };
    }

    if (this.isDisclosed() && this._containerShape) {
      containerShape = {
        'fill': this._containerShape.getFill(),
        'width': this._containerShape.getWidth(),
        'height': this._containerShape.getHeight()
      };

      containerShape.getFill = function () {
        return containerShape['fill'];
      };

      containerShape.getWidth = function () {
        return containerShape['width'];
      };

      containerShape.getHeight = function () {
        return containerShape['height'];
      };
    }

    if (keepOrigContent) {
      //move the original node content to a temporary container,
      //that will be used for animation
      origContent = new dvt.Container(this.getCtx());

      this._cleanUp(origContent);

      origContent.setTranslate(this.getTranslateX(), this.getTranslateY());
    }

    state = {
      'partialUpdate': true,
      'id': this.getId(),
      'disclosed': this.isDisclosed(),
      'tx': this.getTranslateX(),
      'ty': this.getTranslateY(),
      'contentBounds': contentBounds,
      'origContent': origContent,
      _shape: shape,
      _labelObj: label,
      _containerShape: containerShape
    };

    state.getId = function () {
      return state['id'];
    };

    state.isDisclosed = function () {
      return state['disclosed'];
    };

    state.getTranslateX = function () {
      return state['tx'];
    };

    state.getTranslateY = function () {
      return state['ty'];
    };

    state.getContentBounds = function () {
      return state['contentBounds'];
    };

    return state;
  };
  /**
   * Appends child nodes data to the object
   * @param {array} childNodesData an array of data objects for the node
   * @param {number} index to insert nodes
   */


  DvtDiagramNode.prototype.appendChildNodesData = function (childNodesData, index) {
    if (!(this._data['nodes'] instanceof Array)) this._data['nodes'] = [];
    this._data['nodes'] = dvt.ArrayUtils.insert(this._data['nodes'], childNodesData, index);
  };
  /**
   * Removes child data objects from the array of child data
   * @param {array} childNodesData nodes data to remove
   */


  DvtDiagramNode.prototype.removeChildNodesData = function (childNodesData) {
    if (this._data['nodes'] instanceof Array) {
      for (var i = 0; i < childNodesData.length; i++) {
        var removeNodeId = childNodesData[i]['id'];

        for (var j = 0; j < this._data['nodes'].length; j++) {
          if (this._data['nodes'][j]['id'] === removeNodeId) {
            this._data['nodes'].splice(j, 1);

            break;
          }
        }
      }
    }
  };
  /**
   * Finds appropriate renderer callback function.
   * Supported renderer types - renderer, selectionRenderer,
   * hoverRenderer, focusRenderer, zoomRenderer.
   *
   * @return {function|null}
   * @private
   */


  DvtDiagramNode.prototype._getCustomRenderer = function (type) {
    var nodeContentOpt = this._diagram.getOptions()['nodeContent'];

    var rendererFunc = null;

    if (nodeContentOpt) {
      var baseRenderer = nodeContentOpt['renderer'];
      rendererFunc = nodeContentOpt[type]; // we don't support selection/hover/focus renderers without base renderer

      rendererFunc = baseRenderer && rendererFunc ? rendererFunc : null;
    }

    return rendererFunc;
  };
  /**
   * Checks if it is needed to move the contents to the touch event pane of the diagram
   * @returns {boolean} true if the contents are stashed, false otherwise
   */


  DvtDiagramNode.prototype._checkAndMoveContents = function () {
    // No need to move contents when there is no active touch event in this node
    // from the HandleImmediateTouchStartInternal handler method of the DvtDiagramEventManager
    if (!this._hasContentBoundToTouchEvent) {
      return false;
    }

    this.GetDiagram().storeTouchEventContent(this._customNodeContent, this);
    this._contentStoredInTouchEventContainer = this._customNodeContent; // Reset the _hasContentBoundToTouchEvent flag since the contents are moved to the touch events pane
    // and this node's content no longer is associated with active touch event

    this._hasContentBoundToTouchEvent = false;
    return true;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   *  Provides automation services for a DVT diagram component.
   *  @class  DvtDiagramAutomation
   *  @param {dvt.Diagram} dvtComponent
   *  @implements {dvt.Automation}
   *  @constructor
   */


  var DvtDiagramAutomation = function DvtDiagramAutomation(dvtComponent) {
    this.Init(dvtComponent);
  };

  dvt.Obj.createSubclass(DvtDiagramAutomation, dvt.Automation, 'DvtDiagramAutomation');
  /**
   * Initializes this automation object
   * @param {dvt.Diagram} dvtComponent
   */

  DvtDiagramAutomation.prototype.Init = function (dvtComponent) {
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


  DvtDiagramAutomation.prototype.GetSubIdForDomElement = function (displayable) {
    var logicalObj = this._diagram.getEventManager().GetLogicalObject(displayable);

    if (logicalObj && logicalObj instanceof DvtDiagramNode) {
      return 'node[' + this._diagram.GetAllNodes().indexOf(logicalObj.getId()) + ']';
    } else if (logicalObj && logicalObj instanceof DvtDiagramLink) {
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


  DvtDiagramAutomation.prototype.getDomElementForSubId = function (subId) {
    if (subId == dvt.Automation.TOOLTIP_SUBID) return this.GetTooltipElement(this._diagram);

    var parsedSubId = this._parseSubId(subId);

    var component = parsedSubId['component'];
    var index = parsedSubId['index'];
    var displayable = null;

    if (component == 'node') {
      displayable = this._getNode(index);
    } else if (component == 'link') {
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


  DvtDiagramAutomation.prototype._parseSubId = function (subId) {
    var component = subId;
    var index = -1;
    var substring = subId.substring(0, subId.indexOf('['));

    if (substring) {
      component = substring == 'node' || substring == 'link' ? substring : null;
      index = parseInt(subId.substring(subId.indexOf('[') + 1, subId.indexOf(']')));
    }

    return {
      'component': component,
      'index': index
    };
  };
  /**
   * Get the number of nodes in diagram
   * @return {Number} number of nodes
   */


  DvtDiagramAutomation.prototype.getNodeCount = function () {
    return this._diagram.GetAllNodes().length;
  };
  /**
   * Get the number of links in diagram
   * @return {Number} number of links
   */


  DvtDiagramAutomation.prototype.getLinkCount = function () {
    return this._diagram.GetAllLinks().length;
  };
  /**
   * Gets diagram node data object for the given index
   * @param {Number} nodeIndex  node index
   * @return {Object} node data object
   */


  DvtDiagramAutomation.prototype.getNode = function (nodeIndex) {
    var node = this._getNode(nodeIndex);

    if (node) {
      var data = {};
      data['id'] = node.getId();
      data['selected'] = node.isSelected();
      data['tooltip'] = node.getShortDesc();
      data['label'] = node.getData()['label'];
      var backgroundStyle = node.getData()['backgroundStyle'];
      if (backgroundStyle && backgroundStyle instanceof Object) backgroundStyle = dvt.CSSStyle.cssObjectToString(backgroundStyle);
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


  DvtDiagramAutomation.prototype.getLink = function (linkIndex) {
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
      data['promoted'] = link.isPromoted();

      if (link.isPromoted()) {
        data['links'] = dvt.JsonUtils.clone(link.getData()['_links']);
      }

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


  DvtDiagramAutomation.prototype.getPromotedLink = function (startIndex, endIndex) {
    var startNode = this._getNode(startIndex);

    var endNode = this._getNode(endIndex);

    if (!startNode || !endNode) return null;
    var linkId = DvtDiagramLink.GetPromotedLinkId(this._diagram, startNode.getId(), endNode.getId());

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


  DvtDiagramAutomation.prototype._getLinkStyleFromObject = function (linkStyle) {
    if (this._diagram.getCtx().isCustomElement()) {
      return dvt.CSSStyle.cssObjectToString(linkStyle);
    } else if (linkStyle && linkStyle instanceof Object) {
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


  DvtDiagramAutomation.prototype.getExpanded = function () {
    return this._diagram.DisclosedNodes;
  };
  /**
   * @private
   * Get marker data from marker
   * @param {dvt.SimpleMarker|dvt.ImageMarker} marker Displayable marker object
   * @return {Object} Marker data object
   */


  DvtDiagramAutomation.prototype._getMarkerData = function (marker) {
    if (marker) {
      var data = {}; // public api expects image markers to return a shape of 'none'

      data['shape'] = marker instanceof dvt.SimpleMarker ? marker.getType() : 'none';
      if (marker.getFill()) data['color'] = marker.getFill().getColor();
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


  DvtDiagramAutomation.prototype._getNode = function (nodeIndex) {
    var nodeIds = this._diagram.GetAllNodes();

    return nodeIndex >= 0 && nodeIndex < nodeIds.length ? this._diagram.getNodeById(nodeIds[nodeIndex]) : null;
  };
  /**
   * Gets diagram link for the given index
   * @param {Number} linkIndex  link index
   * @return {DvtDiagramLink} link
   * @private
   */


  DvtDiagramAutomation.prototype._getLink = function (linkIndex) {
    var linkIds = this._diagram.GetAllLinks();

    return linkIndex >= 0 && linkIndex < linkIds.length ? this._diagram.getLinkById(linkIds[linkIndex]) : null;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

})(dvt);

  return dvt;
});
