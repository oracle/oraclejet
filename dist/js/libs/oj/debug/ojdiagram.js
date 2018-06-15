/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtDiagram', 'ojs/ojdatasource-common'], function(oj, $, comp, base, dvt)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

///////////// ConversionDiagramDataSource //////////////////

/**
 * Internal implementation of the DiagramDataSource dedicated to convert
 * 'nodes', 'links' and 'childNodes' options into DiagramDataSource object.
 * @class oj.ConversionDiagramDataSource
 * @extends oj.DiagramDataSource
 * @classdesc JSON implementation of the oj.DiagramDataSource
 * @param {Object} data JSON data object with following properties:
 * @property {Array|Promise|Function=} nodes an array of nodes
 * @property {Array|Promise|Function=} links an array of links
 * @param {Object=} options the options set on this data source
 * @param {Function=} options.childData Function callback to retrieve nodes and links for the specified parent.
 *                      Function will return an array of nodes or
 *                      a Promise that will resolve with an array of nodes
 * @constructor
 * @ignore
 */
oj.ConversionDiagramDataSource = function(data, options) {
    this.childDataCallback = options ? options['childData'] : null;
    oj.ConversionDiagramDataSource.superclass.constructor.call(this, data);
};

// Subclass from oj.DiagramDataSource
oj.Object.createSubclass(oj.ConversionDiagramDataSource, oj.DiagramDataSource, "oj.ConversionDiagramDataSource");

/**
 * Returns child data for the given parent.
 * The data include all immediate child nodes along with links whose endpoints
 * both descend from the current parent node. 
 * If all the links are available upfront, they can be returned as part of the
 * top-level data (since all nodes descend from the diagram root).
 * If lazy-fetching links is desirable, the most
 * optimal way to return links is as part of the data of the
 * nearest common ancestor of the link's endpoints.
 *
 * @param {Object|null} parentData An object that contains data for the parent node.
 *                     If parentData is null, the method retrieves data for top level nodes.
 * @return {Promise|IThenable} Promise resolves to a component object with the following structure:
 * <ul>
 *  <li>{Array<Object>} nodes An array of objects for the child nodes for the given parent</li>
 *  <li>{Array<Object>} links An array of objects for the links for the given parent</li>
 * </ul>
 * @export
 * @method
 * @name getData
 * @memberof! oj.ConversionDiagramDataSource
 * @instance
 * @ignore
 */
oj.ConversionDiagramDataSource.prototype.getData = function(parentData) {
  if (parentData) { //retrieve child data
    var childData = parentData['nodes'];
    if (childData === undefined && this.childDataCallback) {
      var childNodes = this.childDataCallback(parentData);
      return Promise.resolve(childNodes).then(
          function(values) {
            return Promise.resolve({'nodes':values});
          },
          function(reason) {
            return Promise.resolve({'nodes':[]});
          }
        );
    }
    else {
      return Promise.resolve({'nodes': childData});
    }
  }
  else { // retrieve top level data
    if (this.data) {
      var nodes = this.data['nodes'], 
          links = this.data['links'];
      if (nodes instanceof Function) {
        nodes = nodes();
      }
      if (links instanceof Function) {
        links = links();
      }
      return Promise.all([nodes, links]).then(
        function(values) {
          return Promise.resolve({'nodes':values[0],'links':values[1]});
        },
        function(reason) {
          return Promise.resolve({'nodes':[],'links':[]});
        }
      );
    }
    else {
      return Promise.resolve(null);
    }
  }
};

/**
 * Retrieves number of child nodes
 * @param {Object} nodeData A data object for the node in question.
 *                          See node properties section.
 * @return {number} Number of child nodes if child count is available.
 *                  The method returns 0 for leaf nodes.
 *                  The method returns -1 if the child count is unknown
 *                  (e.g. if the children have not been fetched).
 * @export
 * @method
 * @name getChildCount
 * @memberof! oj.ConversionDiagramDataSource
 * @instance
 * @ignore
 */
oj.ConversionDiagramDataSource.prototype.getChildCount= function(nodeData) {
  if (nodeData) {
    var childData = nodeData['nodes'];
    var count = Array.isArray(childData) ? childData.length :
                childData === undefined && this.childDataCallback ? -1 :
                0;
    return count;
  }
  return -1;
};

/**
 * Indicates whether the specified object contains links
 * that should be discovered in order to display promoted links.
 *
 * @param {Object} nodeData A data object for the container node in question.
 *                          See node properties section.
 * @return {string} the valid values are "connected", "disjoint", "unknown"
 * @export
 * @method
 * @name getDescendantsConnectivity
 * @memberof! oj.ConversionDiagramDataSource
 * @instance
 * @ignore
 */
oj.ConversionDiagramDataSource.prototype.getDescendantsConnectivity = function(nodeData){
  return "unknown";
};

/**
 * @class 
 * @name oj.DiagramUtils
 * @ojtsignore
 * 
 * @classdesc
 * <h3>Diagram Layout Utilities</h3>
 *
 * <p> DiagramUtils is a helper object that provides a function to generate a layout callback for ojDiagram out of JSON object. 
 * A JSON object contains positions for the nodes, paths for the links and properties for positioning a label for a node and a link.
 * See object details {@link oj.DiagramUtils.getLayout}
 *
 * <h3> Usage : </h3>
 * <pre class="prettyprint">
 * <code>
 * // create JSON object that contains positions for the nodes and SVG paths for the links
 * // the nodes and links are identified by ids
 * var data = {
 *  "nodes":[
 *   {"id":"N0", "x":100, "y":0},
 *   {"id":"N1", "x":200, "y":100},
 *   {"id":"N2", "x":100, "y":200},
 *   {"id":"N3", "x":0, "y":100}
 * ],
 * "links":[
 *   {"id":"L0", "path":"M120,20L220,120"},
 *   {"id":"L1", "path":"M220,120L120,220"},
 *   {"id":"L2", "path":"M120,220L20,120"},
 *   {"id":"L3", "path":"M20,120L120,20"}
 * ]
 * };
 * //generate the layout callback function using data and the oj.DiagramUtils
 * // pass the generated function to the oj.ojDiagram as the 'layout' option
 * var layoutFunc = oj.DiagramUtils.getLayout(data);
 * </code></pre>
 * @export
 * @constructor
 * @since 3.0
 */
oj.DiagramUtils = function() {
};

/**
 * The complete label layout object used to position node and link label
 * @typedef {Object} oj.DiagramUtils.LabelLayout
 * @property {number} x x-coordinate for the label
 * @property {number} y y-coordinate for the label
 * @property {number} rotationPointX x-coordinate for label rotation point
 * @property {number} rotationPointY y-coordinate for label rotation point
 * @property {number} number angle of rotation for the labelLayout
 * @property {string} halign horizontal alignment for the label. Valid values are "left", "right" or "center"
 * @property {string} valign vertical alignment for the label. Valid values are "top", "middle", "bottom" or "baseline". 
 *                           The default value is <code class="prettyprint">"top"</code>
 */

/**
 * A function that generates the layout callback function for the ojDiagram component.
 * @param {Object} obj JSON object that defines positions of nodes, links paths and label layouts. The object supports the following properties.
 * @property {Array<Object>} obj.nodes An array of objects with the following properties that describe a position for the diagram node and a layout for the node's label
 * @property {number} obj.nodes.x x-coordinate for the node
 * @property {number} obj.nodes.y y-coordinate for the node
 * @property {Object} obj.nodes.labelLayout An object that defines label layout for the node. See {@link oj.DiagramUtils.LabelLayout} object. 
 *                                          The object defines absolute coordinates for label position.
 * @property {Array<Object>} obj.links An array of objects with the following properties that describe a path for the diagram link and a layout for the link's label.
 * @property {string} obj.links.path A string that represents an SVG path for the link.
 * @property {string} obj.links.coordinateSpace The coordinate container id for the. If specified the link points will be applied relative to that container. 
 *                                              If the value is not set, the link points are in the global coordinate space.
 * @property {Object} obj.links.labelLayout An object that defines label layout for the link. See {@link oj.DiagramUtils.LabelLayout} object.
 *
 * @property {Object} obj.nodeDefaults An object that defines the default layout of the node label
 * @property {Object|Function} obj.nodeDefaults.labelLayout An object that defines default label layout for diagram nodes.
 *                         See {@link oj.DiagramUtils.LabelLayout} object. The object defines relative coordinates for label position.
 *                         E.g. if all the node labels should be positioned with a certain offset relative to the node, 
 *                         a label position can be defined using an object in node defaults.
 *                         <p>Alternatively a label layout can be defined with a function. The function will receive the following parameters:
 *                           <ul>
 *                             <li>{DvtDiagramLayoutContext} - layout context for the diagram</li>
 *                             <li>{DvtDiagramLayoutContextNode} - layout context for the current node</li>
 *                           </ul>
 *                           The return value of the function is a label object with the following properties : {@link oj.DiagramUtils.LabelLayout}. 
 *                           The object defines absolute coordinates for label position.
 *                          </p>
 * @property {Object} obj.linkDefaults An object that defines a function for generating a link path and a default layout for the link label
 * @property {Function} obj.linkDefaults.path a callback function that will be used to generate a link path. The function will receive the following parameters:
 *                      <ul>
 *                        <li>{DvtDiagramLayoutContext} - layout context for the diagram</li>
 *                        <li>{DvtDiagramLayoutContextLink} - layout context for the current link</li>
 *                      </ul>
 *                      The return value of the function is a string that represents an SVG path for the link 
 * @property {Function} obj.linkDefaults.labelLayout a function that defines default label layout for diagram links. The function will receive the following parameters:
 *                      <ul>
 *                        <li>{DvtDiagramLayoutContext} - layout context for the diagram</li>
 *                        <li>{DvtDiagramLayoutContextLink} - layout context for the current link</li>
 *                      </ul>
 *                      The return value of the function is a label object with the following properties {@link oj.DiagramUtils.LabelLayout}
 * @property {Object|Function} obj.viewport An object with the following properties that defines diagram viewport.
 *                         <p>Alternatively a viewport can be defined with a function. The function will receive the following parameters:
 *                           <ul>
 *                             <li>{DvtDiagramLayoutContext} - layout context for the diagram</li>
 *                           </ul>
 *                           The return value of the function is a viewport object with the properties defined below. 
 *                          </p>
 * @property {number} obj.viewport.x x-coordinate
 * @property {number} obj.viewport.y y-coordinate 
 * @property {number} obj.viewport.w width
 * @property {number} obj.viewport.h height
 * @returns {Function} layout callback function
 * @export
 */
oj.DiagramUtils.getLayout = function(obj) {
  var layoutFunc = function(layoutContext) {
    
    // position nodes and node labels
    if (obj['nodes'] && layoutContext.getNodeCount() > 0) {
      var nodesDataMap = oj.DiagramUtils._dataArrayToMap(obj['nodes']);
      var defaultLabelLayout = obj['nodeDefaults'] && obj['nodeDefaults']['labelLayout'] ? obj['nodeDefaults']['labelLayout'] : null;
      for (var ni = 0;ni < layoutContext.getNodeCount();ni++) {
        var node = layoutContext.getNodeByIndex(ni);
        var nodeData = nodesDataMap[node.getId()];
        oj.DiagramUtils._positionChildNodes(node.getChildNodes(), nodeData ? nodeData['nodes'] : null, layoutContext, defaultLabelLayout);
        oj.DiagramUtils._positionNodeAndLabel(node, nodeData, layoutContext, defaultLabelLayout);
      }
    }
    
    // position links and link labels
    if (obj['links'] && layoutContext.getLinkCount() > 0) {
      var linksDataMap = oj.DiagramUtils._dataArrayToMap(obj['links']);
      var defaultPath = obj['linkDefaults'] && obj['linkDefaults']['path'] ? obj['linkDefaults']['path'] : null;
      var defaultLabelLayout = obj['linkDefaults'] && obj['linkDefaults']['labelLayout'] ? obj['linkDefaults']['labelLayout'] : null;
      for (var li = 0;li < layoutContext.getLinkCount();li++) {
        var link = layoutContext.getLinkByIndex(li);
        var linkData = linksDataMap[link.getId()];
        if (linkData && linkData['path']) {
          link.setPoints(linkData['path']);
        }
        else if (defaultPath && defaultPath instanceof Function) {
          link.setPoints(defaultPath(layoutContext, link));
        }
        if (linkData && linkData['coordinateSpace']) {
          link.setCoordinateSpace(linkData['coordinateSpace']);
        }        
        //position label if it exists
        if (linkData && linkData['labelLayout']) {
          oj.DiagramUtils._setLabelPosition(link, linkData['labelLayout']);
        }
        else if (defaultLabelLayout && defaultLabelLayout instanceof Function ) {
          oj.DiagramUtils._setLabelPosition(link, defaultLabelLayout(layoutContext, link));
        }
      }
    }
    if (obj['viewport']){
      var viewport = obj['viewport'];
      if (viewport instanceof Function) {
        layoutContext.setViewport(viewport(layoutContext));
      }
      else {
        layoutContext.setViewport(viewport);
      }
    }
  };
  return layoutFunc;
};

/**
 * Converts a data array of nodes or links to a map
 * @param {Array} dataArray data array of node or links
 * @return {Object} a map of nodes or links
 * @private
 * @instance
 * @memberof oj.DiagramUtils
 */
oj.DiagramUtils._dataArrayToMap = function(dataArray) {
  var m = {};
  if (dataArray) {
    for (var i = 0; i < dataArray.length; i++) {
      m[dataArray[i]['id']] = dataArray[i];
    }
  }
  return m;
};

/**
 * Positions child nodes and their labels
 * @param {Array} nodes An array of diagram nodes
 * @param {Array} nodesData An array of objects that describe a position for a diagram node and a layout for the node's label
 * @param {Object} layoutContext Layout context for diagram
 * @param {Object|Function} defaultLabelLayout Default label layout defined as an object or a function
 * @private
 */
oj.DiagramUtils._positionChildNodes =  function(nodes, nodesData, layoutContext, defaultLabelLayout){
  if (nodes && nodesData) {
    var nodesDataMap = oj.DiagramUtils._dataArrayToMap(nodesData);
    for (var ni = 0;ni < nodes.length;ni++) {
      var node = nodes[ni];
      var nodeData = nodesDataMap[node.getId()];
      oj.DiagramUtils._positionChildNodes(node.getChildNodes(), nodeData ? nodeData['nodes'] : null, layoutContext, defaultLabelLayout);
      oj.DiagramUtils._positionNodeAndLabel(node, nodeData, layoutContext, defaultLabelLayout);
    }
  }
};

/**
 * Position a diagram nodes and its label
 * @param {Object} node A node to position
 * @param {Object} nodeData An object that defines a position for the node and a layout for the node's label
 * @param {Object} layoutContext Layout context for diagram
 * @param {Object|Function} defaultLabelLayout Default label layout defined as an object or a function
 * @private
 */
oj.DiagramUtils._positionNodeAndLabel = function(node, nodeData, layoutContext, defaultLabelLayout) {
  if (node && nodeData) {
    node.setPosition({'x': nodeData['x'], 'y': nodeData['y']});
    //node has a label - position it
    if (nodeData['labelLayout']) { 
      //layout should be an object - expect absolute positions
      oj.DiagramUtils._setLabelPosition(node, nodeData['labelLayout']);
    }
    else if (defaultLabelLayout && defaultLabelLayout instanceof Function) {
      oj.DiagramUtils._setLabelPosition(node, defaultLabelLayout(layoutContext, node));
    }
    else if (defaultLabelLayout) {
      //layout should be an object - expect relative positions
      oj.DiagramUtils._setLabelPosition(node, defaultLabelLayout, node.getPosition());
    }
  }
};

/**
 * Sets label position for a link or a node
 * @param {Object} obj layout context for node or link
 * @param {Object} labelLayout an object with the following properties for the label layout
 * @property {number} x x-coordinate for the label position
 * @property {number} y y-coordinate for the label position
 * @property {number} rotationPointX x-coordinate for the rotation point
 * @property {number} rotationPointY y-coordinate for the rotation point
 * @property {number} angle angle for the angle of rotation
 * @property {string} halign horizontal alignment for the label
 * @property {string} valign vertical alignment for the label 
 * @param {Object=} offset an object with the following properties for the label offset
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @private
 * @instance
 * @memberof oj.DiagramUtils
 */
oj.DiagramUtils._setLabelPosition = function(obj, labelLayout, offset) {
  offset = offset ? offset : {'x':0,'y':0};
  obj.setLabelPosition({'x': labelLayout['x'] + offset['x'], 'y': labelLayout['y'] + offset['y']});
  var rotationPointX = labelLayout['rotationPointX'], 
      rotationPointY = labelLayout['rotationPointY'];
  if (!isNaN(rotationPointX) && !isNaN(rotationPointY)) {
    obj.setLabelRotationPoint({'x':rotationPointX + offset['x'], 'y':rotationPointY + offset['y']});
  }
  obj.setLabelRotationAngle(labelLayout['angle']);
  obj.setLabelHalign(labelLayout['halign']);
  obj.setLabelValign(labelLayout['valign']);
};

// Copyright (c) 2008, 2014, Oracle and/or its affiliates. All rights reserved.
/**
 * <p>Pluggable layout code must conform to the pluggable layout contract. The following steps outline a simple pluggable layout.</p>
 * <ol>
 * <li> Diagram calls layout engine with layout context.</li>
 * <li> Layout engine loops over nodes using getNodeCount and getNodeByIndex()</li>
 * <ul>
 *  <li> layout engine gets dimensions of node by calling getBounds()</li>
 *  <li> layout engine sets position on node by calling setPosition()</li>
 * </ul>
 * <li> Layout engine loops over links using getLinkCount and getLinkByIndex()</li>
 * <ul>
 *  <li> layout engine gets start and end nodes by calling getStartId()/getEndId() on a link object</li>
 *  <li> layout engine analyzes nodes position and dimensions by calling getPosition() and getBounds() on each node and finds connection points for the link start/end</li>
 *  <li> layout engine creates a link path by calling setPoints() on a link object</li>
 * </ul>
 * <li> Diagram applies node positions from layout context</li>
 * </ol>
 *
 * <p>The DvtDiagramLayoutContext interface defines the context for a layout call.</p>
 * @export
 * @interface DvtDiagramLayoutContext
 * @since 3.0
 * @ojtsignore
 * @memberof oj
 */

/**
 * Get a node context by id.
 * @method getNodeById
 * @instance
 * @param {string} id id of node context to get
 * @return {oj.DvtDiagramLayoutContextNode}
 * @memberof oj.DvtDiagramLayoutContext 
 * @export
 */

/**
 * Get a node context by index.
 * @method getNodeByIndex
 * @instance 
 * @param {number} index index of node context to get
 * @return {oj.DvtDiagramLayoutContextNode}
 * @memberof oj.DvtDiagramLayoutContext 
 * @export
 */

/**
 * Get the number of nodes to layout.
 * @method getNodeCount
 * @instance  
 * @return {number}
 * @memberof oj.DvtDiagramLayoutContext 
 * @export
 */

/**
 * Get a link context by id.
 * @method getLinkById
 * @instance   
 * @param {string} id id of link context to get
 * @return {oj.DvtDiagramLayoutContextLink}
 * @memberof oj.DvtDiagramLayoutContext 
 * @export
 */

/**
 * Get a link context by index.
 * @method getLinkByIndex
 * @instance 
 * @param {number} index index of link context to get
 * @return {oj.DvtDiagramLayoutContextLink}
 * @memberof oj.DvtDiagramLayoutContext
 * @export
 */

/**
 * Get the number of links to layout.
 * @method getLinkCount
 * @instance 
 * @return {number}
 * @memberof oj.DvtDiagramLayoutContext 
 * @export
 */

/**
 * Get whether the reading direction for the locale is right-to-left.
 * @method isLocaleR2L
 * @instance 
 * @return {boolean}
 * @memberof oj.DvtDiagramLayoutContext  
 * @export
 */

/**
 * Get the size of the Diagram.
 * @method getComponentSize
 * @instance 
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @property {number} w width
 * @property {number} h height
 * @return {Object} An object containing properties of the diagram size
 * @memberof oj.DvtDiagramLayoutContext  
 * @export
 */

/**
 * Set the viewport the component should use after the layout, in the layout's coordinate system.
 * @method setViewport
 * @instance 
 * @param {Object} viewport An object containing properties of the viewport that the component should use after the layout
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @property {number} w width
 * @property {number} h height
 * @memberof oj.DvtDiagramLayoutContext
 * @export
 */

/**
 * Get the viewport the component should use after the layout, in the layout's coordinate system.
 * @method getViewport
 * @instance 
 * @return {Object} An object containing properties of the viewport
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @property {number} w width
 * @property {number} h height
 * @memberof oj.DvtDiagramLayoutContext  
 * @export
 */

/**
 * Get the current viewport used by the component in the layout's coordinate system for the diagram
 * @method getCurrentViewport
 * @instance  
 * @return {Object} An object containing properties of the current viewport
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @property {number} w width
 * @property {number} h height 
 * @memberof oj.DvtDiagramLayoutContext  
 * @export
 */
 
 /**
 * The function retrieves nearest common ancestor container for two nodes.
 * @method getCommonContainer
 * @instance  
 * @return {string} Id for the first common ancestor container or null for top level diagram
 * @param {string} nodeId1 first node id
 * @param {string} nodeId2 second node id
 * @memberof oj.DvtDiagramLayoutContext  
 * @export
 */
 
 /**
 * Gets event data object. Values can be retrieved from the object using 'type' and 'data' keys.
 * @method getEventData
 * @instance 
 * @return {Object} event data object
 * @property {string} type Event type - "add", "remove" or "change".
 * @property {Object} data Event payload object for the event - 
 *            see <a href="oj.DiagramDataSource.html#EventType">EventType</a> for event details. 
 * @memberof oj.DvtDiagramLayoutContext
 * @since 4.0.0
 * @export
 */

// Copyright (c) 2008, 2014, Oracle and/or its affiliates. All rights reserved.
/**
 * The DvtDiagramLayoutContextLink interface defines the link context for a layout call.
 * @export
 * @interface DvtDiagramLayoutContextLink
 * @since 3.0
 * @ojtsignore
 * @memberof oj
 */

/**
 * Get the id of the link.
 * @method getId
 * @instance
 * @return {string}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the id of the start node of this link.
 * @method getStartId
 * @instance
 * @return {string}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the id of the end node of this link.
 * @method getEndId
 * @instance
 * @return {string}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Set the points to use for rendering this link.  The given array can contain
 * coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path commands, like
 * ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].  The points are in the
 * coordinate system of the link's container.
 * @method setPoints
 * @instance
 * @param {array} points array of points to use for rendering this link
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the points to use for rendering this link.  The returned array can
 * contain coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path
 * commands, like ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].  The points
 * are in the coordinate system of the link's container.
 * @method getPoints
 * @instance
 * @return {array}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Set the position of the link label.  The position is in the coordinate system of the link's container.
 * The position represents the upper-left corner for locales with left-to-right reading
 * direction and the upper-right corner for locales with right-to-left reading
 * direction in the default alignment.
 * @method setLabelPosition
 * @instance
 * @param {Object} pos An object with the following properties for the position of the link label
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the position of the link label.  The position is in the coordinate system of the link's container.
 * The position represents the upper-left corner for locales with left-to-right reading
 * direction and the upper-right corner for locales with right-to-left reading
 * direction in the default alignment.
 * @method getLabelPosition
 * @instance
 * @return {Object} An object with the following properties for the position of the link label
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Set the horizontal alignment of the link label.
 * The default value is left for locales with left-to-right reading direction and right for locales with
 * right-to-left reading direction.
 * @method setLabelHalign
 * @instance
 * @param {string} halign A string that specifies the horizontal label alignment
 * @ojvalue {string} "left"
 * @ojvalue {string} "center"
 * @ojvalue {string} "right"
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the horizontal alignment of the link label.
 * The default value is left for locales with left-to-right reading direction and right for locales with
 * right-to-left reading direction.
 * @method getLabelHalign
 * @instance
 * @return {string} A string that specifies the horizontal label alignment
 * @ojvalue {string} "left"
 * @ojvalue {string} "center"
 * @ojvalue {string} "right"
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Set the vertical alignment of the link label.
 * @method setLabelValign
 * @instance
 * @param {string} valign A string that specifies the vertical label alignment. The "baseline" value
 *                        is not supported when applied to multiline labels. If "baseline" is applied
 *                        to a multiline label, the text element will default to "top" alignment.
 * @default <code class="prettyprint">"top"</code>
 * @ojvalue {string} "top"
 * @ojvalue {string} "middle"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "baseline"
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the vertical alignment of the link label.
 * @method getLabelValign
 * @instance
 * @return {string} A string that specifies the vertical label alignment
 * @default <code class="prettyprint">"top"</code>
 * @ojvalue {string} "top"
 * @ojvalue {string} "middle"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "baseline"
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the label bounds.  The bounds are in the coordinate system of the label.
 * @method getLabelBounds
 * @instance
 * @return {Object} An object with the following properties for the label bound
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @property {number} w width
 * @property {number} h height
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the offset of the start connector.  This is the amount of space that the
 * link should leave between its starting point and the node for the connector
 * to be drawn.
 * @method getStartConnectorOffset
 * @instance
 * @return {number}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the offset of the end connector.  This is the amount of space that the
 * link should leave between its ending point and the node for the connector
 * to be drawn.
 * @method getEndConnectorOffset
 * @instance
 * @return {number}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the width of this link.
 * @method getLinkWidth
 * @instance
 * @return {number}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the corresponding object from the links option array.
 * @method getLayoutAttributes
 * @instance
 * @return {object}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @ojdeprecated {since:"2.1", description:'This method is deprecated. Please use the <a href="#getData">getData</a> method instead'}
 * @export
 */

/**
 * Determine whether this link is selected.
 * @method getSelected
 * @instance
 * @return {boolean}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */


/**
 * Set the angle of rotation of the link label, relative to the label
 * rotation point, in radians.
 * @method setLabelRotationAngle
 * @instance
 * @param {number} angle angle of rotation
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the angle of rotation of the link label, relative to the label
 * rotation point, in radians.
 * @method getLabelRotationAngle
 * @instance
 * @return {number}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Set the point about which to rotate the link label, in the coordinate
 * system of the label.
 * @method setLabelRotationPoint
 * @instance
 * @param {Object} point An object with the following properties for the label rotation point
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the point about which to rotate the link label, in the coordinate
 * system of the label.
 * @method getLabelRotationPoint
 * @instance
 * @return {Object} An object with the following properties for the label rotation point
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */
 
/**
 * Set coordinate space for the link.
 * If the coordinate container id is specified, the link points will be applied relative to that container.
 * If the coordinate container id is not specified, the link points are in the global coordinate space.
 * The coordinate space is global by default.
 * The coordinate space can be any container id that is an ancestor of both the start and end nodes.
 * @method setCoordinateSpace
 * @instance
 * @param {string} containerId  coordinate container id for the link
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get coordinate space for the link.
 * If the coordinate container id is specified, the link points will be applied relative to that container.
 * If the coordinate container id is not specified, the link points are in the global coordinate space.
 * The coordinate space is global by default.
 * The coordinate space can be any container id that is an ancestor of both the start and end nodes.
 * @method getCoordinateSpace
 * @instance
 * @return {string} coordinate container id for the link
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Get the corresponding data for the diagram link.
 * @method getData
 * @instance
 * @return {object|array} a data object for the link if the link is not promoted or 
 * an array of data objects for each link that is represented by the promoted link if the link is promoted
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * Determine whether this link is promoted.
 * @method isPromoted
 * @instance
 * @return {boolean} true if the link is promoted
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */
// Copyright (c) 2008, 2014, Oracle and/or its affiliates. All rights reserved.

/**
 * The DvtDiagramLayoutContextNode interface defines the node context for a layout call.
 * @export
 * @interface DvtDiagramLayoutContextNode
 * @since 3.0
 * @ojtsignore
 * @memberof oj
 */

/**
 * Get the id of the node.
 * @method getId
 * @instance
 * @return {string}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get the bounds of the node.  Currently the method returns the same value as getContentBounds().
 * The bounds are in the coordinate system of the node.
 * @method getBounds
 * @instance
 * @return {Object} An object with the following properties for the bounds of the node
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @property {number} w width
 * @property {number} h height
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get the bounds of the node content.  Currently the method returns the same value as getBounds().
 * The bounds are in the coordinate system of the node.
 * @method getContentBounds
 * @instance
 * @return {Object} An object with the following properties for the bounds of the node content
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @property {number} w width
 * @property {number} h height
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Set the position of the node.  The position is in the coordinate system of
 * the node's container.
 * @method setPosition
 * @instance
 * @param {Object} pos An object with the following properties for the position of the node
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get the position of the node.  The position is in the coordinate system of
 * the node's container.
 * @method getPosition
 * @instance
 * @return {Object} An object with the following properties for the position of the node
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Set the position of the node label.  The position is in the coordinate system of the node's container.
 * The position represents the upper-left corner for locales with left-to-right reading
 * direction and the upper-right corner for locales with right-to-left reading
 * direction.
 * @method setLabelPosition
 * @instance
 * @param {Object} pos An object with the following properties for position of the node label
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get the position of the node label.  The position is in the coordinate system of the node's container.
 * The position represents the upper-left corner for locales with left-to-right reading
 * direction and the upper-right corner for locales with right-to-left reading
 * direction.
 * @method getLabelPosition
 * @instance
 * @return {Object} An object with the following properties for the position of the node label
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Set the horizontal alignment of the node label.
 * The default value is left for locales with left-to-right reading direction and right for locales with
 * right-to-left reading direction.
 * @method setLabelHalign
 * @instance
 * @param {string} halign A string that specifies the horizontal label alignment
 * @ojvalue {string} "left"
 * @ojvalue {string} "center"
 * @ojvalue {string} "right"
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get the horizontal alignment of the node label.
 * The default value is left for locales with left-to-right reading direction and right for locales with
 * right-to-left reading direction.
 * @method getLabelHalign
 * @instance
 * @return {string} A string that specifies the horizontal label alignment
 * @ojvalue {string} "left"
 * @ojvalue {string} "center"
 * @ojvalue {string} "right"
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Set the vertical alignment of the node label.
 * @method setLabelValign
 * @instance
 * @param {string} valign A string that specifies the vertical label alignment. The "baseline" value
 *                        is not supported when applied to multiline labels. If "baseline" is applied
 *                        to a multiline label, the text element will default to "top" alignment.
 * @default <code class="prettyprint">"top"</code>
 * @ojvalue {string} "top"
 * @ojvalue {string} "middle"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "baseline"
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get the vertical alignment of the node label.
 * @method getLabelValign
 * @instance
 * @return {string} A string that specifies the vertical label alignment
 * @default <code class="prettyprint">"top"</code>
 * @ojvalue {string} "top"
 * @ojvalue {string} "middle"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "baseline"
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */
/**
 * Get the label bounds.  The bounds are in the coordinate system of the label.
 * @method getLabelBounds
 * @instance
 * @return {Object} An object with the following properties for the label bounds
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @property {number} w width
 * @property {number} h height
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get the corresponding object from the nodes option array.
 * @method getLayoutAttributes
 * @instance
 * @return {Object}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @ojdeprecated {since:"2.1", description:'This method is deprecated. Please use the <a href="#getData">getData</a> method instead'}
 * @export
 */

/**
 * Determine whether this node is selected.
 * @method getSelected
 * @instance
 * @return {boolean}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Set the angle of rotation of the node label, relative to the label
 * rotation point, in radians.
 * @method setLabelRotationAngle
 * @instance
 * @param {number} angle angle of rotation
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get the angle of rotation of the node label, relative to the label
 * rotation point, in radians.
 * @method getLabelRotationAngle
 * @instance
 * @return {number}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Set the point about which to rotate the node label, in the coordinate
 * system of the label.
 * @method setLabelRotationPoint
 * @instance
 * @param {Object} point An object with the following properties for label rotation point
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get the point about which to rotate the node label, in the coordinate
 * system of the label.
 * @method getLabelRotationPoint
 * @instance
 * @return {Object} An object with the following properties for the label rotation point
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */
 
/**
 * Determine whether this container is disclosed.
 * @method isDisclosed
 * @instance
 * @return {boolean} true if the node is a disclosed container
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get visible child nodes for the disclosed container.
 * @method getChildNodes
 * @instance
 * @return {array} array of DvtDiagramLayoutContextNode objects
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * The method returns a position of the node relative to the specified ancestor container. 
 * If the container id is null, the method returns global position of the node.
 * If the container id is not an ancestor id for the node, the method returns null.
 * @method getRelativePosition
 * @instance
 * @param {string} containerId ancestor id
 * @return {Object} An object with the following properties for the position of the node relative to the specified ancestor container
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Get the corresponding data object for the diagram node.
 * @method getData
 * @instance
 * @return {object} a data object for the node 
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

 /**
 * @ojcomponent oj.ojDiagram
 * @augments oj.dvtBaseComponent
 * @since 1.1.0
 * @ojstatus preview
 * @ojrole application 
 * @ojtsignore 
 * @ojshortdesc Displays a set of nodes and the links between them. The node positions and link paths are specified by an application-provided layout function.
 *
 * @classdesc
 * <h3 id="diagramOverview-section">
 *   JET Diagram
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#diagramOverview-section"></a>
 * </h3>
 *
 * <p>Diagrams are used to display a set of nodes and the links between them. The node positions 
 * and link paths are specified by an application-provided layout function
 * (see <a href="oj.ojDiagram.html#diagramLayout-section">JET Diagram Layout</a>).
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-diagram
 *    layout = '{{layoutFunc}}'
 *    data = '{{dataSource}}'>
 * &lt;/oj-diagram>
 * </code>
 * </pre>
 *
 * <h3 id="diagramLayout-section">
 *   JET Diagram Layout
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#diagramLayout-section"></a>
 * </h3>
 *
 * <p>In order to create JET Diagram component, applications are required to provide a layout callback function for 
 * positioning nodes and links. The component does not deliver a default layout. 
 * However there is a set of demo layouts that are delivered with the Cookbook application. 
 * The demo layouts can be reused by the application, but in most cases we expect that the 
 * application will want to create their own layout. The layout code must conform to the pluggable layout contract. 
 * See {@link oj.ojDiagram#layout} for additional information on layout API.</p>
 *
 * <p>In the case when the node positions are known in advance or derived from an external layout engine, 
 * the layout can be generated using [layout helper utility]{@link oj.DiagramUtils}.</p>
 *
 * {@ojinclude "name":"a11yKeyboard"}
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Animation</h4>
 * <p>Animation should only be enabled for visualizations of small to medium data sets.
 * Alternate visualizations should be considered if identifying data changes is important,
 * since all nodes will generally move and resize on any data change.
 * </p>
 *
 * <h4>Data Set Size</h4>
 * <p>Applications should avoid setting very large data densities on this element.
 * Applications can aggregate small nodes to reduce the displayed data set size.
 * </p>
 * 
 * <h4>Styling</h4>
 * <p>Use the highest level property available. For example, consider setting styling properties on
 *    <code class="prettyprint">styleDefaults.nodeDefaults</code> or
 *    <code class="prettyprint">styleDefaults.linkDefaults</code>, instead of styling properties
 *    on the individual nodes and links. The diagram can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojDiagram', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix : "oj",
  options: {
    /**
     * Specifies the animation that is applied on data changes.
     * @expose
     * @name animationOnDataChange
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">animation-on-data-change</code> attribute specified:</caption>
     * &lt;oj-diagram animation-on-data-change='auto'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">animationOnDataChange</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.animationOnDataChange;
     * 
     * // setter
     * myDiagram.animationOnDataChange="auto";
     */
    animationOnDataChange: "none",
    
    /**
     * Specifies the animation that is shown on initial display.
     * @expose
     * @name animationOnDisplay
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">animation-on-display</code> attribute specified:</caption>
     * &lt;oj-diagram animation-on-display='auto'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">animationOnDisplay</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.animationOnDisplay;
     * 
     * // setter
     * myDiagram.animationOnDisplay="auto";
     */
    animationOnDisplay: "none",

    /**
     * Provides support for HTML5 Drag and Drop events. Please refer to <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop">third party documentation</a> on HTML5 Drag and Drop to learn how to use it. 
     * @ojshortdesc Used to customize the drag and drop features.
     * @expose
     * @name dnd
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object}
     * @default {"drag": null, "drop": null}
     *
     * @example <caption>Initialize the diagram with the
     * <code class="prettyprint">dnd</code> attribute specified:</caption>
     *
     * <!-- Using dot notation -->
     * &lt;oj-diagram dnd.drop.background.data-types = '["text/shape"]' dnd.drop.background.drop = '[[onDropFunc]]'>&lt;/oj-diagram>
     * 
     * &lt;oj-diagram dnd='[[dndObject]]'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">dnd</code> 
     * property after initialization:</caption>
     * // Get one
     * var value = myDiagram.dnd.drag.nodes.dataTypes;
     * 
     * // Get all
     * var values = myDiagram.dnd;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for 
     * // subproperties rather than setting a subproperty directly.
     * myDiagram.setProperty('dnd.drop.nodes.drop', onDropFunc);
     * 
     * // Set all. Must list every resource key, as those not listed are lost.
     * myDiagram.dnd=dndObject;
     */
     dnd: {
      /**
       * An object that describes drag functionality.
       * @ojshortdesc Used to customize drag functionality.
       * @expose
       * @name dnd.drag
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object}
       * @default null
       */
       drag: null,
        /**
         * If this object is specified, the diagram will initiate drag operation when the user drags on diagram nodes. 
         * @ojshortdesc Used to customize the drag features for nodes.
         * @expose
         * @name dnd.drag.nodes
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         */
        /**
         * The MIME types to use for the dragged data in the dataTransfer object. This can be a string if there is only one type, or an array of strings if multiple types are needed. For example, if selected employee data items are being dragged, dataTypes could be "application/employees+json". Drop targets can examine the data types and decide whether to accept the data. For each type in the array, dataTransfer.setData will be called with the specified type and the data. The data is an array of the dataContexts of the selected data items. The dataContext is the JSON version of the dataContext that we use for "tooltip" option, excluding componentElement and parentElement. This property is required unless the application calls setData itself in a dragStart callback function. 
         * @ojshortdesc Specifies MIME type for dragged data.
         * @expose
         * @name dnd.drag.nodes.dataTypes
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string|Array.<string>}
         */
        /**
         * An optional callback function that receives the "drag" event as argument. 
         * @ojshortdesc Optional handler for drag event.
         * @expose
         * @name dnd.drag.nodes.drag
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event)}
         */
        /**
         * An optional callback function that receives the "dragend" event as argument. 
         * @ojshortdesc Optional handler for dragend event.
         * @expose
         * @name dnd.drag.nodes.dragEnd
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event)}
         */
        /**
         * An optional callback function that receives the "dragstart" event and context information as arguments. 
         * The context information is as follows: 
         * <ul> 
         *   <li>nodes {Array.(object)}: An array of dataContexts of the dragged data nodes. 
         *      The dataContext for the node has the following properties: 
         *      <ul>
         *        {@ojinclude "name":"dataContext"}
         *        <li>nodeOffset: An object with x,y properties, that reflects node offset from the upper left corner of the bounding box for the dragged content.</li>
         *      </ul>
         *   </li>
         * </ul>
         * This function can set its own data and drag image as needed. When this function is called, event.dataTransfer is already populated with the default data and drag image. 
         * @ojshortdesc Optional handler for dragstart event.
         * @expose
         * @name dnd.drag.nodes.dragStart
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * If this object is specified, the diagram will initiate link creation when the user starts dragging from a port. 
         * @ojshortdesc Defines link creation functionality.
         * @expose
         * @name dnd.drag.ports
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         * @default {}
         */
        /**
         * An optional callback function for customizing link feedback based on a starting node and a port. 
         * If the function is not specified the link feedback will use default link styles.
         * The function will take a single parameter - a context object with the following properties: 
         * <ul>
         *   <li>dataContext The dataContext object of the link start node.
         *    <ul>{@ojinclude "name":"dataContext"}</ul>
         *   </li>
         *   <li>portElement DOM element recognized as a port that received drag event.</li>
         * </ul>
         * The function should return one of the following: 
         * <ul> 
         *   <li>an object with the following properties: 
         *     <ul>
         *       <li> svgStyle : Inline stlye object to be applied on the link feedback </li>
         *       <li> svgClassName : A name of a style class to be applied on the link </li> 
         *     </ul> 
         *   </li>
         *   <li>null or undefined : the default link styles will be used for the link feedback </li>
         * </ul> 
         * @ojshortdesc Specifies link creation feedback.
         * @expose
         * @name dnd.drag.ports.linkStyle
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Object)}
         */
        /**
         * A string, containing a selector expression, that will be used to identify the descendant DOM element in a diagram node that can be used for link creation. This property is requred. 
         * @ojshortdesc Specifies DOM element selector used to start link creation.
         * @expose
         * @name dnd.drag.ports.selector
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string}
         */
        /**
         * The MIME types to use for the dragged data in the dataTransfer object. This can be a string if there is only one type, or an array of strings if multiple types are needed. and parentElement. This property is required unless the application calls setData itself in a dragStart callback function. 
         * @ojshortdesc Specifies MIME type for dragged data.
         * @expose
         * @name dnd.drag.ports.dataTypes
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string|Array.<string>}
         */
        /**
         * An optional callback function that receives the "drag" event as argument. 
         * @ojshortdesc Optional handler for drag event.
         * @expose
         * @name dnd.drag.ports.drag
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event)}
         */
        /**
         * An optional callback function that receives the "dragend" event as argument. 
         * @ojshortdesc Optional handler for dragend event.
         * @expose
         * @name dnd.drag.ports.dragEnd
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event)}
         */
        /**
         * An optional callback function that receives the "dragstart" event and context information as arguments.
         * The context information is as follows: 
         * <ul> 
         *   <li> ports {object}: An object with the following properties: 
         *     <ul> 
         *       <li> dataContext : The dataContext object of the link start node with the following properties:
         *        <ul>{@ojinclude "name":"dataContext"}<ul>
         *       </li>
         *       <li> portElement : DOM element recognized as a port that received drag event. </li>
         *     </ul>
         *   </li>
         * </ul>
         * @ojshortdesc Optional handler for dragstart event.
         * @expose
         * @name dnd.drag.ports.dragStart
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
      /**
       * An object that describes drop functionality.
       * @expose
       * @name dnd.drop
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object}
       * @default null
       */
       drop: null
        /**
         * Allows dropping on the diagram background.
         * @expose
         * @name dnd.drop.background
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         */
        /**
         * An array of MIME data types the Diagram background can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events. 
         * @ojshortdesc Specifies MIME types of objects that can be dropped on the Diagram background.
         * @expose
         * @name dnd.drop.background.dataTypes
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string|Array.<string>}
         */
        /**
         * An optional callback function that receives the "dragenter" event and context information as arguments. 
         * The context information is as follows: {@ojinclude "name":"backgroundDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
         * @ojshortdesc Optional handler for dragenter event.
         * @expose
         * @name dnd.drop.background.dragEnter
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * An optional callback function that receives the "dragover" event and context information as arguments.
         * The context information is as follows: {@ojinclude "name":"backgroundDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
         * @ojshortdesc Optional handler for dragover event.
         * @expose
         * @name dnd.drop.background.dragOver
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * An optional callback function that receives the "dragleave" event and context information as arguments.
         * The context information is as follows: {@ojinclude "name":"backgroundDropContext"}
         * @ojshortdesc Optional handler for dragleave event.
         * @expose
         * @name dnd.drop.background.dragLeave
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * A callback function that receives the "drop" event and context information as arguments. 
         * The context information is as follows: {@ojinclude "name":"backgroundDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
         * @ojshortdesc Handler for drop event.
         * @expose
         * @name dnd.drop.background.drop
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * Allows dropping on diagram nodes.
         * @expose
         * @name dnd.drop.nodes
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         */
        /**
         *  An array of MIME data types the Diagram nodes can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events. 
         * @ojshortdesc Specifies MIME types of objects that can be dropped on the Diagram nodes.
         * @expose
         * @name dnd.drop.nodes.dataTypes
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string|Array.<string>}
         */
        /**
         * An optional callback function that receives the "dragenter" event and context information as arguments. 
         * The context information is as follows: {@ojinclude "name":"nodeDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
         * @ojshortdesc Optional handler for dragenter event.
         * @expose
         * @name dnd.drop.nodes.dragEnter
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * An optional callback function that receives the "dragover" event and context information as arguments.
         * The context information is as follows: {@ojinclude "name":"nodeDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable. 
         * @ojshortdesc Optional handler for dragover event.
         * @expose
         * @name dnd.drop.nodes.dragOver
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * An optional callback function that receives the "dragleave" event and context information as arguments.
         * The context information is as follows: {@ojinclude "name":"nodeDropContext"}
         * @ojshortdesc Optional handler for dragleave event.
         * @expose
         * @name dnd.drop.nodes.dragLeave
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * A callback function that receives the "drop" event and context information as arguments. 
         * The context information is as follows: {@ojinclude "name":"nodeDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
         * @ojshortdesc Handler for drop event.
         * @expose
         * @name dnd.drop.nodes.drop
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * Allows dropping on diagram links.
         * @expose
         * @name dnd.drop.links
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         */
        /**
         * An array of MIME data types the Diagram links can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events. 
         * @ojshortdesc Specifies MIME types of objects that can be dropped on the Diagram links.
         * @expose
         * @name dnd.drop.links.dataTypes
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string|Array.<string>}
         */
        /**
         * An optional callback function that receives the "dragenter" event and context information as arguments.
         * The context information is as follows: {@ojinclude "name":"linkDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable. 
         * @ojshortdesc Optional handler for dragenter event.
         * @expose
         * @name dnd.drop.links.dragEnter
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * An optional callback function that receives the "dragover" event and context information as arguments.
         * The context information is as follows: {@ojinclude "name":"linkDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable. 
         * @ojshortdesc Optional handler for dragover event.
         * @expose
         * @name dnd.drop.links.dragOver
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * An optional callback function that receives the "dragleave" event and context information as arguments.
         * The context information is as follows: {@ojinclude "name":"linkDropContext"}
         * @ojshortdesc Optional handler for dragleave event.
         * @expose
         * @name dnd.drop.links.dragLeave
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * A callback function that receives the "drop" event and context information as arguments. 
         * The context information is as follows: {@ojinclude "name":"linkDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
         * @ojshortdesc Handler for drop event.
         * @expose
         * @name dnd.drop.links.drop
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * Allows dropping a link end on a port.
         * @expose
         * @name dnd.drop.ports
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         */
        /**
         * A string, containing a selector expression, that will be used to identify the descendant DOM element in a diagram node that can be used for link creation. This property is requred. 
         * @ojshortdesc Specifies DOM element selector used for link creation end.
         * @expose
         * @name dnd.drop.ports.selector
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string}
         */
        /**
         *  An array of MIME data types the Diagram ports can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events. 
         * @ojshortdesc Specifies MIME types of objects that can be dropped on the Diagram ports.
         * @expose
         * @name dnd.drop.ports.dataTypes
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string|Array.<string>}
         */
        /**
         * An optional callback function that receives the "dragenter" event and context information as arguments. 
         * The context information is as follows: * The context information is as follows: {@ojinclude "name":"portDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable. 
         * @ojshortdesc Optional handler for dragenter event.
         * @expose
         * @name dnd.drop.ports.dragEnter
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * An optional callback function that receives the "dragover" event and context information as arguments.
         * The context information is as follows: * The context information is as follows: {@ojinclude "name":"portDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable. 
         * @ojshortdesc Optional handler for dragover event.
         * @expose
         * @name dnd.drop.ports.dragOver
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * An optional callback function that receives the "dragleave" event and context information as arguments.
         * The context information is as follows: * The context information is as follows: {@ojinclude "name":"portDropContext"}
         * @ojshortdesc Optional handler for dragleave event.
         * @expose
         * @name dnd.drop.ports.dragLeave
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
        /**
         * A callback function that receives the "drop" event and context information as arguments. 
         * The context information is as follows: * The context information is as follows: {@ojinclude "name":"portDropContext"}
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
         * @ojshortdesc Handler for drop event.
         * @expose
         * @name dnd.drop.ports.drop
         * @memberof! oj.ojDiagram
         * @instance
         * @type {function(Event, Object)}
         */
     },

    /**
     * Specifies the key set containing the ids of diagram nodes that should be expanded on initial render.
     * Use the <a href="ExpandedKeySet.html">ExpandedKeySet</a> class to specify nodes to expand.
     * Use the <a href="ExpandAllKeySet.html">ExpandAllKeySet</a> class to expand all nodes. 
     * @ojshortdesc Specifies the key set of ids for expanded diagram nodes.
     * @expose
     * @name expanded
     * @memberof oj.ojDiagram
     * @instance
     * @type {KeySet}
     * @default new ExpandedKeySet()
     * @ojwriteback
     *
     * @example <caption>Initialize the diagram with specific items expanded:</caption>
     * myDiagram.expanded = new ExpandedKeySet(['N0', 'N00']);
     *
     * @example <caption>Initialize the diagram with all items expanded:</caption>
     * myDiagram.expanded = new ExpandAllKeySet();
     */
    expanded: new oj.ExpandedKeySet(),
    /**
     * An array containing the ids of the selected nodes and links.
     * @expose
     * @name selection
     * @memberof oj.ojDiagram
     * @instance
     * @type {Array.<string>}
     * @default null
     * @ojwriteback
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">selection</code> attribute specified:</caption>
     * &lt;oj-diagram selection='["N1", "N2", "L0"]'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">selection</code> 
     * property after initialization:</caption>
     * // Get one
     * var value = myDiagram.selection[0];
     * 
     * // Get all
     * var values = myDiagram.selection;
     * 
     * // Set all (There is no permissible "set one" syntax.)
     * myDiagram.selection=["N1", "N2", "L0"];
     */
    selection: null,
    /**
     * Specifies the selection mode.
     * @expose
     * @name selectionMode
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "single"
     * @ojvalue {string} "multiple"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">selection-mode</code> attribute specified:</caption>
     * &lt;oj-diagram selection-mode='multiple'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">selectionMode</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.selectionMode;
     * 
     * // setter
     * myDiagram.selectionMode="multiple";
     */
    selectionMode: "none",
    /**
     * Specifies whether panning is allowed in Diagram.
     * @expose
     * @name panning
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">panning</code> attribute specified:</caption>
     * &lt;oj-diagram panning='auto'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">panning</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.panning;
     * 
     * // setter
     * myDiagram.panning="auto";
     */
    panning: "none",
    /**
     * Specifies if panning allowed in horizontal and vertical directions.
     * @expose
     * @name panDirection
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "x"
     * @ojvalue {string} "y"
     * @ojvalue {string} "auto"
     * @default "auto"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">pan-direction</code> attribute specified:</caption>
     * &lt;oj-diagram pan-direction='x'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">panDirection</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.panDirection;
     * 
     * // setter
     * myDiagram.panDirection="y";
     */
    panDirection: "auto",
    /**
     * An object containing an optional callback function for tooltip customization. 
     * @expose
     * @name tooltip
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object}
     * @default {"renderer": null}
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">tooltip</code> attribute specified:</caption>
     * <!-- Using dot notation -->
     * &lt;oj-diagram tooltip.renderer='[[tooltipFun]]'>&lt;/oj-diagram>
     * 
     * &lt;oj-diagram tooltip='[[{"renderer": tooltipFun}]]'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">tooltip</code> 
     * property after initialization:</caption>
     * // Get one
     * var value = myDiagram.tooltip.renderer;
     * 
     * // Get all
     * var values = myDiagram.tooltip;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for 
     * // subproperties rather than setting a subproperty directly.
     * myDiagram.setProperty('tooltip.renderer', tooltipFun);
     * 
     * // Set all. Must list every resource key, as those not listed are lost.
     * myDiagram.tooltip={'renderer': tooltipFun};     
     */
    tooltip: {
      /**
       * A function that returns a custom tooltip. The function takes a dataContext argument, 
       * provided by the diagram, with the following properties:
       * <ul>
       *   <li>parentElement The tooltip element. The function can directly modify or append content to this element.</li>
       *   {@ojinclude "name":"dataContext"}
       * </ul>
       * @ojshortdesc Specifies a function for a custom tooltip.
       * @expose
       * @name tooltip.renderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {function(Object):Object|null}
       * @default null
       */
       renderer: null
     },
    /**
     * Specifies whether zooming is allowed in Diagram.
     * @expose
     * @name zooming
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">zooming</code> attribute specified:</caption>
     * &lt;oj-diagram panDirection='auto'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">zooming</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.zooming;
     * 
     * // setter
     * myDiagram.zooming="auto";
     */
    zooming: "none",
    /**
     * Specifies the minimum zoom level for this diagram. If minZoom is greater than zero, it indicates 
     * the minimum point to which Diagram objects can be scaled. A value of 0.1 implies that 
     * the Diagram can be zoomed out until Nodes appear at one-tenth their natural size.
     * By default, minZoom is set to zoom-to-fit level based on the currently visible Nodes and Links.
     * @ojshortdesc Specifies the minimum zoom level for this diagram.
     * @expose
     * @name minZoom
     * @memberof oj.ojDiagram
     * @instance
     * @type {number}
     * @default 0.0
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">min-zoom</code> attribute specified:</caption>
     * &lt;oj-diagram min-zoom='0.5'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">minZoom</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.minZoom;
     * 
     * // setter
     * myDiagram.minZoom=1.0;
     */
    minZoom: 0.0,
    /**
     * Specifies the maximum zoom level for this diagram. This can be any number greater than zero 
     * which indicates the maximum point to which Diagram objects can be scaled. 
     * A value of 2.0 implies that the Diagram can be zoomed in until Nodes appear at twice their natural size. 
     * By default, maxZoom is 1.0.
     * @ojshortdesc Specifies the maximum zoom level for this diagram.
     * @expose
     * @name maxZoom
     * @memberof oj.ojDiagram
     * @instance
     * @type {number}
     * @default 1.0
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">max-zoom</code> attribute specified:</caption>
     * &lt;oj-diagram max-zoom='10.0'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">maxZoom</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.maxZoom;
     * 
     * // setter
     * myDiagram.maxZoom=5.0;
     */
    maxZoom: 1.0,
    /**
     * An array of category strings used for category filtering. Diagram nodes and links with a category in hiddenCategories will be filtered.
     * @ojshortdesc Specifies categories used for filtering.
     * @expose
     * @name hiddenCategories
     * @memberof oj.ojDiagram
     * @instance
     * @type {Array.<string>}
     * @default []
     * @ojwriteback
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">hidden-categories</code> attribute specified:</caption>
     * &lt;oj-diagram hidden-categories='["green", "blue"]'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">hiddenCategories</code> 
     * property after initialization:</caption>
     * // Get one
     * var value = myDiagram.hiddenCategories[0];
     * 
     * // Get all
     * var values = myDiagram.hiddenCategories;
     * 
     * // Set all (There is no permissible "set one" syntax.)
     * myDiagram.hiddenCategories=["green", "blue"];
     */
    hiddenCategories: [],
    /**
     * Defines the behavior applied when hovering over diagram nodes and links.
     * @expose
     * @name hoverBehavior
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "dim"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">hover-behavior</code> attribute specified:</caption>
     * &lt;oj-diagram max-zoom='dim'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">hoverBehavior</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.hoverBehavior;
     * 
     * // setter
     * myDiagram.hoverBehavior='dim';
     */
    hoverBehavior: "none",
    /**
     * An array of category strings used for category highlighting. Diagram nodes and links with a category in highlightedCategories will be highlighted.
     * @ojshortdesc Specifies categories used for highlighting.
     * @expose
     * @name highlightedCategories
     * @memberof oj.ojDiagram
     * @instance
     * @type {Array.<string>}
     * @default []
     * @ojwriteback
     *
     * 
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">highlighted-categories</code> attribute specified:</caption>
     * &lt;oj-diagram highlighted-categories='["green", "blue"]'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">highlightedCategories</code> 
     * property after initialization:</caption>
     * // Get one
     * var value = myDiagram.highlightedCategories[0];
     * 
     * // Get all
     * var values = myDiagram.highlightedCategories;
     * 
     * // Set all (There is no permissible "set one" syntax.)
     * myDiagram.highlightedCategories=["green", "blue"];
     */
    highlightedCategories: [],
    /**
     * The matching condition for the highlightedCategories option. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
     * @ojshortdesc Specifies matching condition used for category highlighting.
     * @expose
     * @name highlightMatch
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "any"
     * @ojvalue {string} "all"
     * @default "all"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">highlight-match</code> attribute specified:</caption>
     * &lt;oj-diagram highlight-match='any'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">highlightMatch</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.highlightMatch;
     * 
     * // setter
     * myDiagram.highlightMatch="any";
     */
    highlightMatch: "all",
    /**
     * Defines node highlighting mode.
     * @expose
     * @name nodeHighlightMode
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "nodeAndIncomingLinks"
     * @ojvalue {string} "nodeAndOutgoingLinks"
     * @ojvalue {string} "nodeAndLinks"
     * @ojvalue {string} "node"
     * @default "node"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">node-highlight-mode</code> attribute specified:</caption>
     * &lt;oj-diagram node-highlight-mode='nodeAndLinks'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">nodeHighlightMode</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.nodeHighlightMode;
     * 
     * // setter
     * myDiagram.nodeHighlightMode="nodeAndLinks";
     */
    nodeHighlightMode: "node",
    /**
     * Defines link highlighting mode.
     * @expose
     * @name linkHighlightMode
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "linkAndNodes"
     * @ojvalue {string} "link"
     * @default "link"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">link-highlight-mode</code> attribute specified:</caption>
     * &lt;oj-diagram link-highlight-mode='linkAndNodes'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">linkHighlightMode</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.linkHighlightMode;
     * 
     * // setter
     * myDiagram.linkHighlightMode="linkAndNodes";
     */
    linkHighlightMode: "link",
    /**
     * A callback function - a custom renderer - that will be used for initial node rendering. 
     * The function takes a single argument, provided by the component, with the following properties:
     * {@ojinclude "name":"rendererContext"}
     *
     * The function should return an Object with the following property: 
     * <ul>
     *   <li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li>
     * </ul>
     *
     * @ojshortdesc Specifies custom renderer for the diagram nodes used for initial rendering.
     * @expose
     * @name renderer
     * @memberof oj.ojDiagram
     * @instance
     * @type {null|function(Object):Object}
     * @default null
     *
     * @example <caption>Initialize the diagram with the <code class="prettyprint">renderer</code> attribute specified:</caption>
     * &lt;oj-diagram renderer='{{rendererFunc}}'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">renderer</code> property after initialization:</caption>
     * // getter
     * var renderer = myDiagram.renderer;
     *
     * // setter
     * myDiagram.renderer = rendererFunc;
     */
    renderer: null,
    /**
     * An optional callback function to update the node in response to changes in hover state. 
     * The function takes a single argument, provided by the component, with the following properties:
     * {@ojinclude "name":"rendererContext"}
     *
     * The function should return one of the following: 
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
     *   </li>
     *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
     * </ul>
     *
     * @ojshortdesc Specifies custom renderer for the diagram nodes used for hover updates.
     * @expose
     * @name hoverRenderer
     * @memberof oj.ojDiagram
     * @instance
     * @type {null|function(Object):Object}
     * @default null
     *
     * @example <caption>Initialize the diagram with the <code class="prettyprint">hover-renderer</code> attribute specified:</caption>
     * &lt;oj-diagram hover-renderer='{{rendererFunc}}'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">hoverRenderer</code> property after initialization:</caption>
     * // getter
     * var renderer = myDiagram.hoverRenderer;
     *
     * // setter
     * myDiagram.hoverRenderer = rendererFunc;
     */
    hoverRenderer: null,
    /**
     * An optional callback function to update the node in response to changes in selection state. 
     * The function takes a single argument, provided by the component, with the following properties:
     * {@ojinclude "name":"rendererContext"}
     *
     * The function should return one of the following: 
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
     *   </li>
     *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
     * </ul>
     *
     * @ojshortdesc Specifies custom renderer for the diagram nodes used for selection updates.
     * @expose
     * @name selectionRenderer
     * @memberof oj.ojDiagram
     * @instance
     * @type {null|function(Object):Object}
     * @default null
     *
     *
     * @example <caption>Initialize the diagram with the <code class="prettyprint">selection-renderer</code> attribute specified:</caption>
     * &lt;oj-diagram selection-renderer='{{rendererFunc}}'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">selectionRenderer</code> property after initialization:</caption>
     * // getter
     * var renderer = myDiagram.selectionRenderer;
     *
     * // setter
     * myDiagram.selectionRenderer = rendererFunc;
     */
    selectionRenderer: null,
    /**
     * An optional callback function to update the node in response to changes in keyboard focus state. 
     * The function takes a single argument, provided by the component, with the following properties:
     * {@ojinclude "name":"rendererContext"}
     *
     * The function should return one of the following: 
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
     *   </li>
     *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
     * </ul>
     *
     * @ojshortdesc Specifies custom renderer for the diagram nodes used for focus updates.
     * @expose
     * @name focusRenderer
     * @memberof oj.ojDiagram
     * @instance
     * @type {null|function(Object):Object}
     * @default null
     *
     * @example <caption>Initialize the diagram with the <code class="prettyprint">focus-renderer</code> attribute specified:</caption>
     * &lt;oj-diagram focus-renderer='{{rendererFunc}}'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">focusRenderer</code> property after initialization:</caption>
     * // getter
     * var renderer = myDiagram.focusRenderer;
     *
     * // setter
     * myDiagram.focusRenderer = rendererFunc;
     */
    focusRenderer: null,
    /**
     * An optional callback function to update the node in response to changes in zoom level. 
     * The function takes a single argument, provided by the component, with the following properties:
     * {@ojinclude "name":"rendererContext"}
     *
     * The function should return one of the following: 
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
     *   </li>
     *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
     * </ul>
     *
     * @ojshortdesc Specifies custom renderer for the diagram nodes used for zoom updates.
     * @expose
     * @name zoomRenderer
     * @memberof oj.ojDiagram
     * @instance
     * @type {null|function(Object):Object}
     * @default null
     *
     * @example <caption>Initialize the diagram with the <code class="prettyprint">zoom-renderer</code> attribute specified:</caption>
     * &lt;oj-diagram zoom-renderer='{{rendererFunc}}'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">zoomRenderer</code> property after initialization:</caption>
     * // getter
     * var renderer = myDiagram.zoomRenderer;
     *
     * // setter
     * myDiagram.zoomRenderer = rendererFunc;
     */
    zoomRenderer: null,
    /**
     * The data source for the Diagram element. See <a href="oj.DiagramDataSource.html">oj.DiagramDataSource</a for details> 
     * @ojshortdesc Specifies data source for the component.
     * @expose
     * @name data
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object}
     * @default null
     *
     * @example <caption>Initialize the diagram with the <code class="prettyprint">data</code> attribute specified:</caption>
     * &lt;oj-diagram data='{{myDataSource}}'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
     * // getter
     * var dataValue = myDiagram.data;
     *
     * // setter
     * myDiagram.data = myDataSource;

     */
    data: null,
    /**
     * Optional callback that provides a way to customize an appearance of the specific link, the function maps link data into link styles.
     * The function takes a data object for the link provided by the diagram.
     * The following properties are supported on the return object:
     * @property {object} labelStyle The CSS style object defining the style of the link label. The CSS max-width property can be used to truncate labels.
     * @property {string} color Link color.
     * @property {object} svgStyle The SVG CSS style object defining link style. The style class and style object will be applied directly on the link and override any other styling specified through the properties.
     * @property {string} svgClassName The SVG CSS style class defining link style. The style class and style object will be applied directly on the link and override any other styling specified through the properties.
     * @property {number} width Link width in pixels.
     * @property {string} startConnectorType Specifies the type of start connector on the link. <br/>Supported values are "arrowOpen", "arrow", "arrowConcave", "circle", "rectangle", "rectangleRounded", "none". <br/>Default value is <code class="prettyprint">"none"</code>.
     * @property {string} endConnectorType Specifies the type of end connector on the link. <br/>Supported values are "arrowOpen", "arrow", "arrowConcave", "circle", "rectangle", "rectangleRounded", "none". <br/>Default value is <code class="prettyprint">"none"</code>.
     * 
     * @example <caption>Customizing link color using <code class="prettyprint">customColor</code> property defined on the link data object</caption>
     * &lt;oj-diagram
     *    layout = '{{layoutFunc}}'
     *    data = '{{dataSource}}'
     *    node-properties = '[[function(data){return {color:data.customColor};}]]'>
     * &lt;/oj-diagram>
     * 
     * @ojshortdesc Optional callback for customizing link appearance based on link data.
     * @expose
     * @name linkProperties
     * @memberof oj.ojDiagram
     * @instance
     * @type {null|function(Object):Object}
     * @default null
     */
    linkProperties: null,
    /**
     * Optional callback that provides a way to customize an appearance of the specific node, the function maps node data into node styles.
     * The function takes a data object for the node provided by the diagram.
     * The following properties are supported on the return object:
     * @property {string} showDisclosure Determines when to display the expand/collapse button.<br/>Supported values are "on", "off". <br/>Default value is <code class="prettyprint">"on"</code>.
     * @property {object} labelStyle The CSS style object defining the style of the node label.
     * @property {object} icon Specifies an icon to be used as a graphical element for the node
     * @property {string} icon.borderColor The border color of the icon.
     * @property {string} icon.borderRadius The border radius of the icon. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
     * @property {number} icon.borderWidth The border width in pixels.
     * @property {string} icon.color The fill color of the icon.
     * @property {string} icon.pattern The fill pattern of the icon.<br/>Supported values are "smallChecker", "smallCrosshatch", "smallDiagonalLeft", "smallDiagonalRight", "smallDiamond", "smallTriangle", "largeChecker", "largeCrosshatch", "largeDiagonalLeft", "largeDiagonalRight", "largeDiamond", "largeTriangle", "none".<br/>Default value is <code class="prettyprint">"none"</code>.
     * @property {number} icon.opacity The opacity of the icon.
     * @property {string} icon.shape The shape of the icon. Can take the name of a built-in shape or the svg path commands for a custom shape.<br/>Supported built-in shapes:"ellipse", "square", "plus", "diamond", "triangleUp", "triangleDown", "human", "rectangle", "star", "circle".<br/>Default value is <code class="prettyprint">"circle"</code>.
     * @property {string} icon.source The URI of the node image.
     * @property {string} icon.sourceHover The optional URI of the node hover image. If not defined, the source image will be used.
     * @property {string} icon.sourceHoverSelected The optional URI of the selected image on hover. If not defined, the sourceSelected image will be used. If the sourceSelected image is not defined, the source image will be used.
     * @property {string} icon.sourceSelected The optional URI of the selected image. If not defined, the source image will be used.
     * @property {number} icon.width The width of the icon.
     * @property {number} icon.height The height of the icon.
     * @property {object} icon.svgStyle The CSS style object defining the style of the icon. The style class and style object will be applied directly on the icon and override any other styling specified through the properties.
     * @property {object} icon.svgClassName The CSS style class defining the style of the icon. The style class and style object will be applied directly on the icon and override any other styling specified through the properties.
     *
     * @example <caption>Customizing node icon color using <code class="prettyprint">customColor</code> property defined on the node data object</caption>
     * &lt;oj-diagram
     *    layout = '{{layoutFunc}}'
     *    data = '{{dataSource}}'
     *    node-properties = '[[function(data){return {icon:{color:data.customColor}};}]]'>
     * &lt;/oj-diagram>
     * 
     * @ojshortdesc Optional callback for customizing node appearance based on node data.
     * @expose
     * @name nodeProperties
     * @memberof oj.ojDiagram
     * @instance
     * @type {null|function(Object):Object}
     * @default null
     */
    nodeProperties: null,
    /**
     * Defines promoted link behavior for the component. <br/> If the value is set to none, the diagram will not retrieve additional data to resolve promoted links and will not display promoted links.<br/> If the value is set to lazy, the diagram will retrieve additional data to resolve promoted links if the data is already available and will display available promoted links. The component will not retrieve additional data if the data is not available yet. <br/> If the value is set to full, the diagram will retrieve additional data to resolve all promoted links and will display promoted links. 
     *
     * @ojshortdesc Defines promoted link behavior for the component.
     * @expose
     * @name promotedLinkBehavior
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "none"
     * @ojvalue {string} "full"
     * @ojvalue {string} "lazy"
     * @default "lazy"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">promoted-link-behavior</code> attribute specified:</caption>
     * &lt;oj-diagram promoted-link-behavior='none'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">promotedLinkBehavior</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.promotedLinkBehavior;
     * 
     * // setter
     * myDiagram.promotedLinkBehavior="none";
     */
    promotedLinkBehavior: "lazy",
    /**
     * An object defining the style defaults for this diagram.
     * @expose
     * @name styleDefaults
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object}
     * @default {"hoverBehaviorDelay":200, "nodeDefaults":{"labelStyle":{}, "showDisclosure":"on", "icon":{"pattern":"none", "shape":"circle", "width":10, "height":10, "svgClassName":""}}, "linkDefaults":{"width":1.0, "labelStyle":{}, "startConnectorType":"none", "endConnectorType":"none", "svgClassName":""}, "promotedLink":{"width":1.0, "startConnectorType":"none", "endConnectorType":"none", "svgClassName":""}}
     *
     * @example <caption>Get or set the <code class="prettyprint">styleDefaults</code> 
     * property after initialization:</caption>
     * // Get one
     * var value = myDiagram.styleDefaults.animationDuration;
     * 
     * // Get all
     * var values = myDiagram.styleDefaults;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for 
     * // subproperties rather than setting a subproperty directly.
     * myDiagram.setProperty('styleDefaults.nodeDefaults', {'icon': {width: 125, height: 125}});
     * 
     * // Set all. Must list every resource key, as those not listed are lost.
     * myDiagram.styleDefaults={'nodeDefaults': {'icon': {width: 125, height: 125}}};
     */
    styleDefaults: {
      /**
       * We recommend using the component CSS classes to set component wide styling. This API should be used
       * only for styling a specific instance of the component. The default values come from the CSS classess and 
       * varies based on theme. The duration of the animations in milliseconds.
       * @ojshortdesc Defines animation duration in milliseconds.
       * @expose
       * @name styleDefaults.animationDuration
       * @memberof! oj.ojDiagram
       * @instance
       * @type {number}
       * @ojunits milliseconds
       */
      /**
       * Specifies initial hover delay in ms for highlighting data items.
       * @expose
       * @name styleDefaults.hoverBehaviorDelay
       * @memberof! oj.ojDiagram
       * @instance
       * @type {number}
       * @default 200
       * @ojunits milliseconds
       */
       hoverBehaviorDelay: 200,
      /**
       * Default node styles
       * @expose
       * @name styleDefaults.nodeDefaults
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object}
       */
       nodeDefaults: {
        /**
         * The CSS style object defining the style of the node label. Supports color, 
         * fontFamily, fontSize, fontStyle, fontWeight, textDecoration, cursor, maxWidth,
         * backgroundColor, borderColor, borderRadius, and borderWidth properties.
         * @ojshortdesc Specifies CSS styles for the node label.
         * @expose
         * @name styleDefaults.nodeDefaults.labelStyle
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         * @default {}
         */
         labelStyle: {},
        /**
         * Determines when to display the expand/collapse button.
         * @expose
         * @name styleDefaults.nodeDefaults.showDisclosure
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string}
         * @ojvalue {string} "off"
         * @ojvalue {string} "on"
         * @default "on"
         */
         showDisclosure: "on",
        /**
         * Default style for the node icon.
         * @expose
         * @name styleDefaults.nodeDefaults.icon
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         * @default {"width": 10, "height": 10, "fillPattern": "none", "shape": "circle"}
         */
         icon: {
          /**
           * Default border color of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.borderColor
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string}
           */
          /**
           * The default border radius of the icon. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
           * @ojshortdesc Specifies default border radius of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.borderRadius
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string}
           */
          /**
           * Default border width of the icon in pixels.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.borderWidth
           * @memberof! oj.ojDiagram
           * @instance
           * @type {number}
           * @ojunits pixels
           */
          /**
           * Default color of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.color
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string}
           */
          /**
           * Default fill pattern of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.pattern
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string}
           * @ojvalue {string} "smallChecker"
           * @ojvalue {string} "smallCrosshatch"
           * @ojvalue {string} "smallDiagonalLeft"
           * @ojvalue {string} "smallDiagonalRight"
           * @ojvalue {string} "smallDiamond"
           * @ojvalue {string} "smallTriangle"
           * @ojvalue {string} "largeChecker"
           * @ojvalue {string} "largeCrosshatch"
           * @ojvalue {string} "largeDiagonalLeft"
           * @ojvalue {string} "largeDiagonalRight"
           * @ojvalue {string} "largeDiamond"
           * @ojvalue {string} "largeTriangle"
           * @ojvalue {string} "none"
           * @default "none"
           */
           pattern: "none",
          /**
           * Default shape of the icon. Can take the name of a built-in shape or the svg path commands for a custom shape.
           * @ojshortdesc Specifies default shape of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.shape
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string}
           * @ojvalue {string} "ellipse"
           * @ojvalue {string} "square"
           * @ojvalue {string} "plus"
           * @ojvalue {string} "diamond"
           * @ojvalue {string} "triangleUp"
           * @ojvalue {string} "triangleDown"
           * @ojvalue {string} "human"
           * @ojvalue {string} "rectangle"
           * @ojvalue {string} "star"
           * @ojvalue {string} "circle"
           * @default "circle"
           */
           shape: "circle",
          /**
           * The URI of the node image
           * @expose
           * @name styleDefaults.nodeDefaults.icon.source
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string}
           */
          /**
           * The optional URI of the node hover image. If not defined, the source image will be used.
           * @ojshortdesc The optional URI of the node hover image.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.sourceHover
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string}
           */
          /**
           * The optional URI of the selected image on hover. If not defined, the sourceSelected image will be used. If the sourceSelected image is not defined, the source image will be used.
           * @ojshortdesc The optional URI of the selected image on hover.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.sourceHoverSelected
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string}
           */
          /**
           * The optional URI of the selected image. If not defined, the source image will be used.
           * @ojshortdesc The optional URI of the selected image.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.sourceSelected
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string}
           */
          /**
           * Default icon width.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.width
           * @memberof! oj.ojDiagram
           * @instance
           * @type {number}
           * @default 10
           * @ojunits pixels
           */
           width: 10,
          /**
           * Default icon height.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.height
           * @memberof! oj.ojDiagram
           * @instance
           * @type {number}
           * @default 10
           * @ojunits pixels
           */
           height: 10,
          /**
           * The default SVG CSS style object defining the style of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.svgStyle
           * @memberof! oj.ojDiagram
           * @instance
           * @type {Object}
           * @default {}
           */
          /**
           * The SVG CSS style class to apply to the node icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.svgClassName
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string}
           * @default ""
           */
           svgClassName: ""
         }
       },
      /**
       * Default link styles
       * @expose
       * @name styleDefaults.linkDefaults
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object}
       * @default {"labelStyle: {}, ""startConnectorType": "none", "endConnectorType": "none", "width": 1.0}
       */
       linkDefaults: {
        /**
         * Default link color. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.linkDefaults.color
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string}
         */
        /**
         * The default style object represents the SVG CSS style of the link. User defined custom SVG CSS Styles will be applied directly on the link. 
         * @ojshortdesc Specifies SVG CSS styles for the link.
         * @expose
         * @name styleDefaults.linkDefaults.svgStyle
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         * @default {}
         */
        /**
         * The default SVG CSS style class to apply to the link.
         * @expose
         * @name styleDefaults.linkDefaults.svgClassName
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         * @default ""
         */
         svgClassName: "",
        /**
         * Default link width in pixels.
         * @expose
         * @name styleDefaults.linkDefaults.width
         * @memberof! oj.ojDiagram
         * @instance
         * @type {number}
         * @ojunits pixels
         */
         width: 1.0,
        /**
         * The CSS style object defining the style of the link label. Supports color, 
         * fontFamily, fontSize, fontStyle, fontWeight, textDecoration, cursor, maxWidth,
         * backgroundColor, borderColor, borderRadius, and borderWidth properties.
         * @ojshortdesc Specifies CSS styles for the link label.
         * @expose
         * @name styleDefaults.linkDefaults.labelStyle
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         */
         labelStyle: {},
        /**
         * Specifies the type of start connector on the link.
         * @expose
         * @name styleDefaults.linkDefaults.startConnectorType
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string}
         * @ojvalue {string} "arrowOpen"
         * @ojvalue {string} "arrow"
         * @ojvalue {string} "arrowConcave"
         * @ojvalue {string} "circle"
         * @ojvalue {string} "rectangle"
         * @ojvalue {string} "rectangleRounded"
         * @ojvalue {string} "none"
         */
         startConnectorType: "none",
        /**
         * Specifies the type of end connector on the link.
         * @expose
         * @name styleDefaults.linkDefaults.endConnectorType
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string}
         * @ojvalue {string} "arrowOpen"
         * @ojvalue {string} "arrow"
         * @ojvalue {string} "arrowConcave"
         * @ojvalue {string} "circle"
         * @ojvalue {string} "rectangle"
         * @ojvalue {string} "rectangleRounded"
         * @ojvalue {string} "none"
         */
         endConnectorType: "none"
       },
      /**
       * Promoted link styles
       * @expose
       * @name styleDefaults.promotedLink
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object}
       * @default {""startConnectorType": "none", "endConnectorType": "none", "width": 1.0}
       */
       promotedLink: {
        /**
         * Default promoted link color. The default value varies based on theme.
         * @expose
         * @name styleDefaults.promotedLink.color
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string}
         */
         color: "#778999",
        /**
         * The promoted style object represents the CSS style of the link. User defined custom CSS Styles will be applied directly on the link. 
         * @expose
         * @name styleDefaults.promotedLink.svgStyle
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         * @default {}
         */
        /**
         * The SVG CSS style class to apply to the promoted link. 
         * @expose
         * @name styleDefaults.promotedLink.svgClassName
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object}
         * @default ""
         */
         svgClassName: "",
        /**
         * Default link width in pixels.
         * @expose
         * @name styleDefaults.promotedLink.width
         * @memberof! oj.ojDiagram
         * @instance
         * @type {number}
         * @ojunits pixels
         */
         width: 1.0,
        /**
         * Specifies the type of start connector on the promoted link.
         * @expose
         * @name styleDefaults.promotedLink.startConnectorType
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string}
         * @ojvalue {string} "arrowOpen"
         * @ojvalue {string} "arrow"
         * @ojvalue {string} "arrowConcave"
         * @ojvalue {string} "circle"
         * @ojvalue {string} "rectangle"
         * @ojvalue {string} "rectangleRounded"
         * @ojvalue {string} "none"
         */
         startConnectorType: "none",
        /**
         * Specifies the type of end connector on the promoted link.
         * @expose
         * @name styleDefaults.promotedLink.endConnectorType
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string}
         * @ojvalue {string} "arrowOpen"
         * @ojvalue {string} "arrow"
         * @ojvalue {string} "arrowConcave"
         * @ojvalue {string} "circle"
         * @ojvalue {string} "rectangle"
         * @ojvalue {string} "rectangleRounded"
         * @ojvalue {string} "none"
         */
         endConnectorType: "none"
       }
    },
    /**
     * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive. For a better user experience, the application can remove the touch and hold delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. If touchResponse is touchStart the component will instantly trigger the touch gesture and consume the page pan events if the component does not require an internal feature that requires a touch start gesture like panning or zooming. If touchResponse is auto, the component will behave like touchStart if it determines that it is not rendered within scrolling content and if component panning is not available for those components that support the feature. 
     *
     * @ojshortdesc Specifies touch response behavior.
     * @expose
     * @name touchResponse
     * @memberof oj.ojDiagram
     * @instance
     * @type {string}
     * @ojvalue {string} "touchStart"
     * @ojvalue {string} "auto"
     * @default "auto"
     *
     * @example <caption>Initialize the diagram with the 
     * <code class="prettyprint">touch-response</code> attribute specified:</caption>
     * &lt;oj-diagram touch-response='touchStart'>&lt;/oj-diagram>
     * 
     * @example <caption>Get or set the <code class="prettyprint">touchResponse</code> 
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.touchResponse;
     * 
     * // setter
     * myDiagram.touchResponse="touchStart";
     */
     touchResponse: "auto",
    /**
     * A custom JavaScript client layout method - a custom code developed by a customer used to position Diagram nodes and links. The layout code must conform to the pluggable layout contract.
     * @ojshortdesc Specifies layout callback used to position nodes and links.
     * @expose
     * @name layout
     * @memberof oj.ojDiagram
     * @instance
     * @type {function(DvtDiagramLayoutContext)}
     * @see <a href="oj.DvtDiagramLayoutContext.html">DvtDiagramLayoutContext</a>
     * @see <a href="oj.DvtDiagramLayoutContextLink.html">DvtDiagramLayoutContextLink</a>
     * @see <a href="oj.DvtDiagramLayoutContextNode.html">DvtDiagramLayoutContextNode</a>
     */
    /**
     * Triggered immediately before any container node in the diagram is expanded.
     *
     * @ojshortdesc Event handler for when a node is about to expand.
     * @ojcancelable
     * @expose
     * @property {string} nodeId the id of the expanding object
     * @event
     * @memberof oj.ojDiagram
     * @instance
     */
    beforeExpand: null,
    /**
     * Triggered when a node has been expanded. The ui object contains one property, "nodeId", which is the id of the node that has been expanded.
     *
     * @ojshortdesc Event handler for after a node has expanded.
     * @expose
     * @property {string} nodeId the id of the expanded object 
     * @event
     * @memberof oj.ojDiagram
     * @instance
     */    
    expand: null,
    /**
     * Triggered immediately before any container node in the diagram is collapsed.
     *
     * @ojshortdesc Event handler for when a node is about to collapse.
     * @ojcancelable
     * @expose
     * @property {string} data.nodeId the id of the collapsing object 
     * @event
     * @memberof oj.ojDiagram
     * @instance
     */
    beforeCollapse: null,
    /**
     * Triggered when a node has been collapsed.
     *
     * @ojshortdesc Event handler for after a node has collapsed.
     * @expose
     * @property {string} data.nodeId the id of the collapsed object 
     * @event
     * @memberof oj.ojDiagram
     * @instance
     */
    collapse: null
  },

  //** @inheritdoc */
  _InitOptions : function(originalDefaults, constructorOptions) {
    this._super(originalDefaults, constructorOptions);

    // styleDefaults subproperty defaults are dynamically generated
    // so we need to retrieve it here and override the dynamic getter by
    // setting the returned object as the new value.
    var styleDefaults = this.options["styleDefaults"];
    this.options["styleDefaults"] = styleDefaults;
  },

  //** @inheritdoc */
  _ProcessOptions: function() {
    this._super();
    this.options['_logger'] = oj.Logger;
    if (this.options['_templateFunction']) {
      this.options['renderer'] = this._GetTemplateDataRenderer(this.options['_templateFunction'], 'node');
    }
    if (this.options['renderer']) {
      this.options['_contextHandler'] = this._getContextHandler();
    }
    //convert nodes, links and childNodes options to DiagramDataSource
    if (this.options['nodes']) {
      this.options['nodeProperties'] = this.options['nodeProperties'] ? 
              this.options['nodeProperties'] : function(data){return data};
      this.options['linkProperties'] = this.options['linkProperties'] ? 
              this.options['linkProperties'] : function(data){return data};
      this.options['data'] = 
        new oj.ConversionDiagramDataSource(
          {'nodes': this.options['nodes'],'links': this.options['links']},
          {'childData': this.options['childNodes']});
    }
    // if expanded not declared, pass default empty expanded key set to the toolkit
    if (!this.options['expanded'])
      this.options['expanded'] = new oj.ExpandedKeySet();
    if (!this.options['dnd']['drag']){
      this.options['dnd']['drag'] = {
        'nodes':{}, 'ports':{}
      };
    }
    if (!this.options['dnd']['drop']){
      this.options['dnd']['drop'] = {
        'background':{}, 'nodes':{}, 'links':{}, 'ports':{}
      };
    }
  },
  
  //** @inheritdoc */
  _IsDraggable: function() {
    var dragObj = this.options['dnd'] ? this.options['dnd']['drag'] : null;
    if (!dragObj)
      return false;
    return (dragObj['nodes'] && Object.keys(dragObj['nodes']).length > 0) || 
           (dragObj['ports'] && Object.keys(dragObj['ports']).length > 0);
  },
  
  //** @inheritdoc */
  _GetComponentRendererOptions: function() {
    return ['tooltip/renderer','renderer','focusRenderer','hoverRenderer','selectionRenderer','zoomRenderer'];
  },
 
  /**
   * Creates a callback function that will be used by DvtDiagramNode to populate context for the custom renderer
   * @return {Function} context handler callback used to create context for a custom renderer
   * @private
   * @instance
   * @memberof oj.ojDiagram
   */
  _getContextHandler: function() {
    var thisRef = this;
    var contextHandlerFunc = function (parentElement, rootElement, childContent, data, state, previousState) {
      var context = {
        'component': oj.Components.__GetWidgetConstructor(thisRef.element),
        'parentElement': parentElement,
        'rootElement': rootElement,
        'content' : childContent,
        'data': data,
        'state': state,
        'previousState' : previousState,
        'id' : data['id'],
        'type' :  'node',
        'label' : data ['label']
      };
      if (thisRef._IsCustomElement()) {
        context['renderDefaultHover'] = thisRef.renderDefaultHover.bind(thisRef, context);
        context['renderDefaultSelection'] = thisRef.renderDefaultSelection.bind(thisRef, context);
        context['renderDefaultFocus'] = thisRef.renderDefaultFocus.bind(thisRef, context);
      }
      return thisRef._FixRendererContext(context);
    }
    return contextHandlerFunc;
  },

  /**
   * Renders default hover effect for the diagram node
   * @param {Object} context - property object with the following fields
   * <ul>
   *  <li>{Element} componentElement - Diagram element</li>
   *  <li>{Object} data - a data object for the node</li>
   *  <li>{SVGElement} parentElement  - a parent group element that takes a custom SVG fragment as the node content. Used for measurements and reading properties.
   *                Modifications of the parentElement are not supported</li>
   *  <li>{SVGElement} rootElement  - an SVG fragment created as a node content passed for subsequent modifications</li>
   *  <li>{Object} state  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{Object} previousState  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{string} id - node id</li>
   *  <li>{string} type - object type - node</li>
   *  <li>{string} label - object label</li>
   * </ul>
   * @expose
   * @ignore
   * @instance
   * @memberof oj.ojDiagram
   */
  renderDefaultHover: function (context) {
    if (!context['previousState'] || context['state']['hovered'] != context['previousState']['hovered']) {
      var comp = this._GetDvtComponent(this.element);
      comp.processDefaultHoverEffect(context['id'], context['state']['hovered']);
    }
  },

  /**
   * Renders default selection effect for the diagram node
   * @param {Object} context - property object with the following fields
   * <ul>
   *  <li>{Element} componentElement - Diagram element</li>
   *  <li>{Object} data - a data object for the node</li>
   *  <li>{SVGElement} parentElement  - a parent group element that takes a custom SVG fragment as the node content. Used for measurements and reading properties.
   *                Modifications of the parentElement are not supported</li>
   *  <li>{SVGElement} rootElement  - an SVG fragment created as a node content passed for subsequent modifications</li>
   *  <li>{Object} state  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{Object} previousState  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{string} id - node id</li>
   *  <li>{string} type - object type - node</li>
   *  <li>{string} label - object label</li>
   * </ul>
   * @expose
   * @ignore
   * @instance
   * @memberof oj.ojDiagram
   */
  renderDefaultSelection: function (context) {
    if (!context['previousState'] || context['state']['selected'] != context['previousState']['selected']) {
      var comp = this._GetDvtComponent(this.element);
      comp.processDefaultSelectionEffect(context['id'], context['state']['selected']);
    }
  },

  /**
   * Renders default focus effect for the diagram node
   * @param {Object} context - property object with the following fields
   * <ul>
   *  <li>{Element} componentElement - Diagram element</li>
   *  <li>{Object} data - a data object for the node</li>
   *  <li>{SVGElement} parentElement  - a parent group element that takes a custom SVG fragment as the node content. Used for measurements and reading properties.
   *                Modifications of the parentElement are not supported</li>
   *  <li>{SVGElement} rootElement  - an SVG fragment created as a node content passed for subsequent modifications</li>
   *  <li>{Object} state  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{Object} previousState  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{string} id - node id</li>
   *  <li>{string} type - object type - node</li>
   *  <li>{string} label - object label</li>
   * </ul>
   * @expose
   * @ignore
   * @instance
   * @memberof oj.ojDiagram
   */
  renderDefaultFocus: function (context) {
    if (!context['previousState'] || context['state']['focused'] != context['previousState']['focused']) {
      var comp = this._GetDvtComponent(this.element);
      comp.processDefaultFocusEffect(context['id'], context['state']['focused']);
    }
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    return dvt.Diagram.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _ConvertLocatorToSubId : function(locator) {
    var subId = locator['subId'];

    // Convert the supported locators
    if(subId == 'oj-diagram-link') {
      // link[index]
      subId = 'link[' + locator['index'] + ']';
    }
    else if(subId == 'oj-diagram-node') {
      // node[index]
      subId = 'node[' + locator['index'] + ']';
    }
    else if(subId == 'oj-diagram-tooltip') {
      subId = 'tooltip';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  //** @inheritdoc */
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if(subId.indexOf('link') == 0) {
      // link[index]
      locator['subId'] = 'oj-diagram-link';
      locator['index'] = this._GetFirstIndex(subId);
    }
    else if(subId.indexOf('node') == 0) {
      // node[index]
      locator['subId'] = 'oj-diagram-node';
      locator['index'] = this._GetFirstIndex(subId);
    }
    else if(subId == 'tooltip') {
      locator['subId'] = 'oj-diagram-tooltip';
    }

    return locator;
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-diagram');
    return styleClasses;
  },

  //** @inheritdoc */
  _GetChildStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses['oj-dvtbase oj-diagram'] = {'path': 'styleDefaults/animationDuration', 'property': 'ANIM_DUR'};
    styleClasses['oj-diagram-node-label'] = {'path': 'styleDefaults/nodeDefaults/labelStyle', 'property': 'TEXT'};
    styleClasses['oj-diagram-node oj-selected'] = {'path': 'styleDefaults/nodeDefaults/selectionColor', 'property': 'border-color'};
    styleClasses['oj-diagram-node oj-hover'] = [
      {'path': 'styleDefaults/nodeDefaults/hoverOuterColor', 'property': 'border-top-color'},
      {'path': 'styleDefaults/nodeDefaults/hoverInnerColor', 'property': 'border-bottom-color'}
    ];
    styleClasses['oj-diagram-link'] = {'path': 'styleDefaults/linkDefaults/color', 'property': 'color'};
    styleClasses['oj-diagram-link-label'] = {'path': 'styleDefaults/linkDefaults/labelStyle', 'property': 'TEXT'};
    styleClasses['oj-diagram-link oj-selected'] = {'path': 'styleDefaults/linkDefaults/selectionColor', 'property': 'border-color'};
    styleClasses['oj-diagram-link oj-hover'] = [
      {'path': 'styleDefaults/linkDefaults/hoverOuterColor', 'property': 'border-top-color'},
      {'path': 'styleDefaults/linkDefaults/hoverInnerColor', 'property': 'border-bottom-color'}
    ];
    return styleClasses;
  },

  //** @inheritdoc */
  _GetEventTypes : function() {
    return ['optionChange', 'beforeExpand', 'beforeCollapse', 'expand', 'collapse'];
  },
  
  //** @inheritdoc */
  _HandleEvent: function(event) {
    var type = event['type'];
    if (type === 'beforeExpand') {
      this.expand(event['id'], true);
    }    
    else if (type === 'beforeCollapse') {
      this.collapse(event['id'], true);
    }
    else if (type === 'expand' || type === 'collapse') {
      this._trigger(type, null, {'nodeId': event['id']});
    }
    else {
      this._super(event);
    }
  },

  //* * @inheritdoc */
  // eslint-disable-next-line no-unused-vars
  _setOptions: function (options, flags) {
    var hasProperty = function (property) {
      return Object.prototype.hasOwnProperty.call(options, property);
    };
    if (hasProperty('expanded') || hasProperty('data')) {
      this._component.clearDisclosedState();
    }
    // Call the super to update the property values
    this._superApply(arguments);
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtDiagramBundle.PROMOTED_LINK'] = translations['promotedLink'];
    ret['DvtDiagramBundle.PROMOTED_LINKS'] = translations['promotedLinks'];
    ret['DvtDiagramBundle.PROMOTED_LINK_ARIA_DESC'] = translations['promotedLinkAriaDesc'];    
    ret['DvtUtilBundle.DIAGRAM'] = translations['componentName'];
    return ret;
  },

  //** @inheritdoc */
  _LoadResources: function() {
    // Ensure the resources object exists
    if (this.options['_resources'] == null)
      this.options['_resources'] = {};

    var resources = this.options['_resources'];
    if (oj.DomUtils.getReadingDirection() === "rtl") {
      resources['collapse_ena'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-ena_rtl.svg'), 'width':20, 'height':20};
      resources['collapse_ovr'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-ovr_rtl.svg'), 'width':20, 'height':20};
      resources['collapse_dwn'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-dwn_rtl.svg'), 'width':20, 'height':20};
      resources['expand_ena'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-ena_rtl.svg'), 'width':20, 'height':20};
      resources['expand_ovr'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-ovr_rtl.svg'), 'width':20, 'height':20};
      resources['expand_dwn'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-dwn_rtl.svg'), 'width':20, 'height':20};      
    }
    else { //ltr
      resources['collapse_ena'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-ena.svg'), 'width':20, 'height':20};
      resources['collapse_ovr'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-ovr.svg'), 'width':20, 'height':20};
      resources['collapse_dwn'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-dwn.svg'), 'width':20, 'height':20};
      resources['expand_ena'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-ena.svg'), 'width':20, 'height':20};
      resources['expand_ovr'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-ovr.svg'), 'width':20, 'height':20};
      resources['expand_dwn'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-dwn.svg'), 'width':20, 'height':20};      
    }
  },

  //** @inheritdoc */
  _GetComponentNoClonePaths : function() {
    var noClonePaths = this._super();
    noClonePaths['data'] = true;
    return noClonePaths;
  },
  
  /**
   * Collapses an expanded node. When vetoable is set to false, beforeExpand event will still be fired but the event cannot be veto.
   * @param {String} nodeId The id of the node to collapse
   * @param {boolean} vetoable Whether the event should be vetoable
   * @ignore
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  collapse: function(nodeId, vetoable) {
    var result = this._trigger("beforeCollapse", null, {'nodeId': nodeId});
    if (!vetoable || result !== false) {
      this._NotReady();
      this._component.collapse(nodeId);
    }
  },

  /**
   * Expands a collapsed parent node. When vetoable is set to false, beforeExpand event will still be fired but the event cannot be veto.
   * @param {String} nodeId The id of the node to expand
   * @param {boolean} vetoable Whether the event should be vetoable
   * @ignore
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  expand: function(nodeId, vetoable) {
    var result = this._trigger("beforeExpand", null, {'nodeId': nodeId});
    if (!vetoable || result !== false) {
      this._NotReady();
      this._component.expand(nodeId);
    }
  },

  /**
   * Returns number of diagram nodes
   * @return {Number} The number of nodes
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   *
   * @example <caption>Invoke the <code class="prettyprint">getNodeCount</code> method:</caption>
   * var count = myDiagram.getNodeCount();
   */
  getNodeCount: function() {
    var auto = this._component.getAutomation();
    return auto.getNodeCount();
  },

  /**
   * Returns an object with the following properties for automation testing verification of the diagram node at the
   * specified index.
   *
   * @param {String} nodeIndex Node index
   * @property {Object|null} icon The icon for the node, or null if none exists.
   * @property {string} icon.color The color of the icon
   * @property {string} icon.shape The shape of the icon
   * @property {string} label Node label
   * @property {boolean} selected The selected state of the node
   * @property {string} tooltip Node tooltip
   * @return {Object|null} An object containing properties for the node at the given index, or null if none exists.
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   *
   * @example <caption>Invoke the <code class="prettyprint">getNode</code> method:</caption>
   * var node = myDiagram.getNode(3);
   */
  getNode: function(nodeIndex) {
    var auto = this._component.getAutomation();
    return auto.getNode(nodeIndex);
  },

  /**
   * Returns number of diagram links
   * @return {Number} The number of links
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   *
   * @example <caption>Invoke the <code class="prettyprint">getLinkCount</code> method:</caption>
   * var count = myDiagram.getLinkCount();
   */
  getLinkCount: function() {
    var auto = this._component.getAutomation();
    return auto.getLinkCount();
  },

  /**
   * Returns an object with the following properties for automation testing verification of the diagram link at the
   * specified index.
   *
   * @param {number} linkIndex Link index
   * @property {string} color Link color
   * @property {string} label Link label
   * @property {string} endConnectorType The type of end connector on the link
   * @property {string} endNode The id of the end node.
   * @property {boolean} selected The selected state of the link
   * @property {string} startConnectorType The type of start connector on the link
   * @property {string} startNode The id of the start node.
   * @property {string} style Link style
   * @property {string} tooltip Link tooltip
   * @property {number} width Link width
   * @return {Object|null} An object containing properties for the link at the given index, or null if none exists.
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   *
   * @example <caption>Invoke the <code class="prettyprint">getLink</code> method:</caption>
   * var link = myDiagram.getLink(3);
   */
  getLink: function(linkIndex) {
    var auto = this._component.getAutomation();
    return auto.getLink(linkIndex);
  },
  
  /**
   * Returns an object with the following properties for automation testing verification of the promoted link between 
   * specified nodes.
   *
   * @param {number} startNodeIndex Start node index
   * @param {number} endNodeIndex End node index
   * @property {string} color Link color
   * @property {string} endConnectorType The type of end connector on the link
   * @property {string} endNode The id of the end node.
   * @property {boolean} selected The selected state of the link
   * @property {string} startConnectorType The type of start connector on the link
   * @property {string} startNode The id of the start node.
   * @property {string} style Link style
   * @property {string} tooltip Link tooltip
   * @property {number} width Link width
   * @property {number} count Number of links it represents
   * @return {Object|null} An object containing properties for the link at the given index, or null if none exists.   
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  getPromotedLink: function(startNodeIndex, endNodeIndex) {
    var auto = this._component.getAutomation();
    return auto.getPromotedLink(startNodeIndex, endNodeIndex);
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  getContextByNode: function(node) {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (context && context['subId'] !== 'oj-diagram-tooltip')
      return context;

    return null;
  }
});

// Conditionally set the defaults for custom element vs widget syntax since we expose different APIs
oj.Components.setDefaultOptions({
  'ojDiagram': {
    'styleDefaults': oj.Components.createDynamicPropertyGetter(function(context) {
      if (context['isCustomElement'])
        return {
          'linkDefaults': {'svgStyle': {}},
          'nodeDefaults': {'icon': {'svgStyle': {}}},
          'promotedLink': {'svgStyle': {}}
        };
      return {};
    }),
  }
});

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *    <tr>
 *       <td rowspan="3">Node or Link</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojDiagram
 */

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>+</kbd></td>
 *       <td>Zoom in one level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>-</kbd></td>
 *       <td>Zoom out one level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>0 (zero)</kbd></td>
 *       <td>Zoom to fit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Alt + 0 (zero)</kbd></td>
 *       <td>Zoom and center.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageUp or PageDown</kbd></td>
 *       <td>Pan up / down.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageUp or PageDown</kbd></td>
 *       <td>Pan left/right (RTL: Pan right/left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow or RightArrow</kbd></td>
 *       <td>When focus is on a node, move focus and selection to nearest node left/right.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow or DownArrow</kbd></td>
 *       <td>When focus is on a node, move focus and selection to nearest node up/down.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + &lt; or Alt + &gt;</kbd></td>
 *       <td>Move focus from the node to a link.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow or DownArrow</kbd></td>
 *       <td>When focus is on a link, navigate between links clockwise or counter clockwise.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow or RightArrow</kbd></td>
 *       <td>When focus is on a link, move focus from a link to a start or end node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Space</kbd></td>
 *       <td>Select focused node / link.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Space</kbd></td>
 *       <td>Multi-select node / link with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + &lt;node or link navigation shortcut&gt;</kbd></td>
 *       <td>Move focus and multi-select a node or a link.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + &lt;node or link navigation shortcut&gt;</kbd></td>
 *       <td>Move focus to a node or a link but do not select.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojDiagram
 */

// COMMONLY USED FRAGMENTS, that might be converted into TS typedefs
 
/**
 * <ul>
 *   <li>componentElement {Element}: The Diagram element.</li> 
 *   <li>parentElement {Element}: A parent group element that takes a custom SVG fragment as the node content.
 *   Modifications of the parentElement are not supported. </li>
 *   <li>data {Object}: The data object for the node. </li>
 *   <li>content {Object}: An object that describes child content. The object has the following properties
 *     <ul>
 *       <li>element {Element}: an SVG group element that contains child nodes for the container.</li>
 *       <li>width {number}: width of the child content.</li>
 *       <li>height {number}: height of the child content.</li>
 *     </ul> 
 *   </li>
 *   <li>state {Object}: An object that reflects the current state of the diagram node. The object has the following properties 
 *     <ul>
 *       <li>hovered {boolean}: hovered state.</li>
 *       <li>selected {boolean}: selected state.</li>
 *       <li>focused {boolean}: focused state.</li>
 *       <li>zoom {number}: zoom state.</li>
 *       <li>expanded {boolean}: expanded state.</li>
 *     </ul>
 *   </li>
 *   <li>previousState {Object}: An object that reflects the previous state of the diagram node. The object has the following properties
 *     <ul>
 *       <li>hovered {boolean}: hovered state.</li>
 *       <li>selected {boolean}: selected state.</li>
 *       <li>focused {boolean}: focused state.</li>
 *       <li>zoom {number}: zoom state.</li>
 *       <li>expanded {boolean}: expanded state.</li>
 *     </ul>
 *   </li>
 *   <li>id {string}: Node id. </li>
 *   <li>type {string}: Object type = node. </li>
 *   <li>renderDefaultFocus {function()}: Function for rendering default focus effect for the diagram node. </li>
 *   <li>renderDefaultHover {function()}: Function for rendering default hover effect for the diagram node. </li>
 *   <li>renderDefaultSelection {function()}: Function for rendering default selection effect for the diagram node. </li>
 * </ul>
 * @ojfragment rendererContext - renderer context used by custom node renderers, such as renderer, focusRenderer, hoverRenderer, selectionRenderer, zoomRenderer.
 * @memberof oj.ojDiagram
 */
 
/**
 * <li>componentElement {Element}: The diagram element.</li>
 * <li>id {string}: The id of the diagram object</li>
 * <li>type {string}: The type of the diagram object - "link", "promotedLink" or "node".</li>
 * <li>label {string}: The label of the diagram object.</li>
 * <li>data {Object}: Relevant data for the object
 *   <ul>
 *     <li>data object for the node, if the object type is "node"</li>
 *     <li>data object for the link, if the object type is "link"</li>
 *     <li>an array of data objects that correspond to links represented by the promoted link</li>
 *   </ul>
 * </li>
 * @ojfragment dataContext - data context object
 * @memberof oj.ojDiagram
 */
 
 /**
  * <ul> 
  *   <li>x {number}: x-coordinate value of the drop in the component coordinate system.</li>
  *   <li>y {number}: y-coordinate value of the drop in the component coordinate system.</li>
  * </ul> 
  * <i> Note: </i>When the dropped items are originated from Diagram, the x, y coordinates represent the upper left corner of the dropped content.
  * @ojfragment backgroundDropContext - context object for the background drop used by dnd.drop.background callbacks
  * @memberof oj.ojDiagram
  */
  
 /**
  * <ul>
  *   <li>x {number}: x-coordinate value of the drop in the component coordinate system.</li>
  *   <li>y {number}: y-coordinate value of the drop in the component coordinate system.</li>
  *   <li>nodeX {number}: x-coordinate value of the drop in the target node coordinate system.</li>
  *   <li>nodeY {number}: y-coordinate value of the drop in the target node coordinate system.</li>
  *   <li>nodeContext {Object}: The JSON version of the data context for the target node.</li>
  * </ul>
  * <i> Note: </i>When the dropped items are originated from Diagram, the x, y coordinates represent the upper left corner of the dropped content.
  * @ojfragment nodeDropContext - context object for the node drop used by dnd.drop.node callbacks
  * @memberof oj.ojDiagram
  */
  
 /**
  * <ul>
  *   <li>x {number}: x-coordinate value of the drop in the component coordinate system.</li>
  *   <li>y {number}: y-coordinate value of the drop in the component coordinate system.</li>
  *   <li>linkContext {Object}: the JSON version of the data context for the target link.</li>
  * </ul> 
  * <i> Note: </i>When the dropped items are originated from Diagram, the x, y coordinates represent the upper left corner of the dropped content.
  * @ojfragment linkDropContext - context object for the node drop used by dnd.drop.link callbacks
  * @memberof oj.ojDiagram
  */
  
 /**
  * <ul>
  *   <li>dataContext {Object}: the JSON version of the data context for the link end node.</li>
  *   <li>portElement {Element}: DOM element that represents a port that received drop event.</li>
  * </ul>
  * @ojfragment portDropContext - context object for the node drop used by dnd.drop.link callbacks
  * @memberof oj.ojDiagram
  */
  
// KEEP FOR WIDGET SYNTAX

/**
 * A callback function for fetching child nodes. This function will be called to retrieve the children of each expanded node. The function takes a single argument, provided by the component, with the following properties: <ul> <li>id: The id of the parent node </li> <li>type : Object type - "node" </li> <li>label: The parent node label </li> <li>component: ojDiagram widget constructor </li> <li>data : The parent node data </li> </ul> The function should return one of the following: <ul> <li>An array of nodes.</li> <li>Promise: a Promise that will resolve with an array of nodes.</li> </ul> See the documentation for the <a href="#nodes[].nodes">nodes[].nodes</a> option for additional information. 
 * @ignore
 * @name childNodes
 * @memberof oj.ojDiagram
 * @instance
 * @type {function(Object)}
 * @default null
 * @deprecated This attribute is deprecated, use the data attribute instead.
 */
/**
 * An array of objects with the following properties that defines the data for the nodes. Also accepts a Promise or callback function for deferred data rendering. The function should return one of the following: <ul> <li>Promise: A Promise that will resolve with an array of data items. No data will be rendered if the Promise is rejected.</li> <li>Array: An array of data items.</li> </ul> 
 * @ignore
 * @name nodes
 * @memberof oj.ojDiagram
 * @instance
 * @type {Array.<Object>|Promise|function()}
 * @default null
 * @deprecated This attribute is deprecated, use the data attribute instead.
 */
/**
 * The id of this node.
 * @ignore
 * @name nodes[].id
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An array of objects with properties for the child nodes. Also a Promise that will resolve with an array of data items.<br/> Due to the fact that Promises begin resolving immediately, the recommended way to load child nodes on demand is via the callback function (which can return a Promise) using <i>childNodes </i> option in the component. In the case when all container nodes are expanded, the best approach is to pass a top-level Promise that resolves to a fully realized node hierarchy.<br/> Note that the callback function will only be called for this node if the nodes option is undefined. Any other value (including null or an empty array) will take precedence over the callback function. 
 * @ignore
 * @name nodes[].nodes
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Array.<Object>|Promise}
 * @default null
 */
/**
 * The CSS style object defining the style of the expanded container node.
 * @ignore
 * @name nodes[].containerStyle
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class defining the style of the expanded container node.
 * @ignore
 * @name nodes[].containerClassName
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Determines when to display the expand/collapse button.
 * @ignore
 * @name nodes[].showDisclosure
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * Specifies whether or not the node will be selectable.
 * @ignore
 * @name nodes[].selectable
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The description of the node. This is used for accessibility and also for customizing the tooltip text.
 * @ignore
 * @name nodes[].shortDesc
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Primary label for the node.
 * @ignore
 * @name nodes[].label
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style string defining the style of the primary label.
 * @ignore
 * @name nodes[].labelStyle
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style string/object defining the style of the node background.
 * @ignore
 * @name nodes[].backgroundStyle
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string|Object}
 * @default null
 */
/**
 * The CSS style class defining the style of the node background.
 * @ignore
 * @name nodes[].backgroundClassName
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An optional array of additional category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with other components. Defaults to value of node id if unspecified.
 * @ignore
 * @name nodes[].categories
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * Specifies an icon to be used as a graphical element for the node
 * @ignore
 * @name nodes[].icon
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * Horizontal alignment for the icon relative to the given background.
 * @ignore
 * @name nodes[].icon.halign
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "left"
 * @ojvalue {string} "right"
 * @ojvalue {string} "center"
 * @default "center"
 */
/**
 * Vertical alignment for the icon relative to the given background.
 * @ignore
 * @name nodes[].icon.valign
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "top"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "center"
 * @default "center"
 */
/**
 * The x coordinate of the icon top left corner relative to the given background - pixels or %. The option takes precedence over halign option
 * @ignore
 * @name nodes[].icon.positionX
 * @memberof! oj.ojDiagram
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * The y coordinate of the icon top left corner relative to the given background - pixels or %. The option takes precedence over valign option
 * @ignore
 * @name nodes[].icon.positionY
 * @memberof! oj.ojDiagram
 * @instance
 * @type {number|string}
 * @default null
 */
/**
 * The border color of this icon.
 * @ignore
 * @name nodes[].icon.borderColor
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border width in pixels.
 * @ignore
 * @name nodes[].icon.borderWidth
 * @memberof! oj.ojDiagram
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The fill color of this icon.
 * @ignore
 * @name nodes[].icon.color
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The fill pattern of this icon.
 * @ignore
 * @name nodes[].icon.pattern
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "smallChecker"
 * @ojvalue {string} "smallCrosshatch"
 * @ojvalue {string} "smallDiagonalLeft"
 * @ojvalue {string} "smallDiagonalRight"
 * @ojvalue {string} "smallDiamond"
 * @ojvalue {string} "smallTriangle"
 * @ojvalue {string} "largeChecker"
 * @ojvalue {string} "largeCrosshatch"
 * @ojvalue {string} "largeDiagonalLeft"
 * @ojvalue {string} "largeDiagonalRight"
 * @ojvalue {string} "largeDiamond"
 * @ojvalue {string} "largeTriangle"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 * The opacity of this icon.
 * @ignore
 * @name nodes[].icon.opacity
 * @memberof! oj.ojDiagram
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The shape of this icon. Can take the name of a built-in shape or the svg path commands for a custom shape.
 * @ignore
 * @name nodes[].icon.shape
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "ellipse"
 * @ojvalue {string} "square"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "human"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "star"
 * @ojvalue {string} "circle"
 * @default "circle"
 */
/**
 * The URI of the node image.
 * @ignore
 * @name nodes[].icon.source
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The optional URI of the node hover image. If not defined, the source image will be used.
 * @ignore
 * @name nodes[].icon.sourceHover
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The optional URI of the selected image on hover. If not defined, the sourceSelected image will be used. If the sourceSelected image is not defined, the source image will be used.
 * @ignore
 * @name nodes[].icon.sourceHoverSelected
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The optional URI of the selected image. If not defined, the source image will be used.
 * @ignore
 * @name nodes[].icon.sourceSelected
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The width of this icon.
 * @ignore
 * @name nodes[].icon.width
 * @memberof! oj.ojDiagram
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The height of this icon.
 * @ignore
 * @name nodes[].icon.height
 * @memberof! oj.ojDiagram
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The CSS style object defining the style of the icon.
 * @ignore
 * @name nodes[].icon.style
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class defining the style of the icon.
 * @ignore
 * @name nodes[].icon.className
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An array of objects with the following properties that defines the data for the links. Also accepts a Promise or callback function for deferred data rendering. The function should return one of the following: <ul> <li>Promise: A Promise that will resolve with an array of data items. No data will be rendered if the Promise is rejected.</li> <li>Array: An array of data items.</li> </ul> 
 * @ignore
 * @name links
 * @memberof oj.ojDiagram
 * @instance
 * @type {Array.<Object>|Promise|function()}
 * @default null
 * @deprecated This attribute is deprecated, use the data attribute instead.
 */
/**
 * The id of this link.
 * @ignore
 * @name links[].id
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Specifies whether or not the link will be selectable.
 * @ignore
 * @name links[].selectable
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The description of the link. This is used for accessibility and also for customizing the tooltip text.
 * @ignore
 * @name links[].shortDesc
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Primary label for the link.
 * @ignore
 * @name links[].label
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style string defining the style of the primary label.
 * @ignore
 * @name links[].labelStyle
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Link color.
 * @ignore
 * @name links[].color
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 *  The link style attribute can be string or object. The style string represents Link style type with following values: solid(default), dash, dot, dashDot. The style string representation has been deprecated. Consider specifying stroke-dasharray in the style object. The style object represents the CSS style of the link. User defined custom CSS Styles will be applied directly on the link. 
 * @ignore
 * @name links[].style
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string|Object}
 * @default null
 */
/**
 * The CSS style class defining the style of the link.
 * @ignore
 * @name links[].className
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Link width in pixels.
 * @ignore
 * @name links[].width
 * @memberof! oj.ojDiagram
 * @instance
 * @type {number}
 * @default 1.0
 */
/**
 * The id of the start node.
 * @ignore
 * @name links[].startNode
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The id of the end node.
 * @ignore
 * @name links[].endNode
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Specifies the type of start connector on the link.
 * @ignore
 * @name links[].startConnectorType
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "arrowOpen"
 * @ojvalue {string} "arrow"
 * @ojvalue {string} "arrowConcave"
 * @ojvalue {string} "circle"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "rectangleRounded"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 * Specifies the type of end connector on the link.
 * @ignore
 * @name links[].endConnectorType
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "arrowOpen"
 * @ojvalue {string} "arrow"
 * @ojvalue {string} "arrowConcave"
 * @ojvalue {string} "circle"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "rectangleRounded"
 * @ojvalue {string} "none"
 * @default "none"
 */
/**
 * An optional array of additional category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with other components. Defaults to value of link id if unspecified.
 * @ignore
 * @name links[].categories
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The CSS style string/object defining the style of the node background.
 * @ignore
 * @name styleDefaults.nodeDefaults.backgroundStyle
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string|Object}
 * @deprecated This attribute is deprecated, use the backgroundSvgStyle attribute instead.
 */
/**
 * The SVG CSS style object defining the style of the node background.
 * @ignore
 * @name styleDefaults.nodeDefaults.backgroundSvgStyle
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Object}
 */
/**
 * The SVG CSS style class to apply to the background shape.
 * @ignore
 * @name styleDefaults.nodeDefaults.backgroundSvgClassName
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Object}
 */
/**
 * The CSS style object defining the style of the expanded container node.
 * @ignore
 * @name styleDefaults.nodeDefaults.containerStyle
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Object}
 * @deprecated This attribute is deprecated, use the containerSvgStyle attribute instead.
 */
/**
 * The SVG CSS style object defining the style of the expanded container node.
 * @ignore
 * @name styleDefaults.nodeDefaults.containerSvgStyle
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Object}
 */
/**
 * The SVG CSS style class to apply to the expanded container shape.
 * @ignore
 * @name styleDefaults.nodeDefaults.containerSvgClassName
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Object}
 */
/**
 * Default horizontal alignment for the icon relative to the given background.
 * @ignore
 * @name styleDefaults.nodeDefaults.icon.halign
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "left"
 * @ojvalue {string} "right"
 * @ojvalue {string} "center"
 * @default "center"
 */
/**
 * Default vertical alignment for the icon relative to the given background.
 * @ignore
 * @name styleDefaults.nodeDefaults.icon.valign
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string}
 * @ojvalue {string} "top"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "center"
 * @default "center"
 */
/**
 * The default style object defining the style of the icon.
 * @ignore
 * @name styleDefaults.nodeDefaults.icon.style
 * @memberof! oj.ojDiagram
 * @instance
 * @type {Object}
 * @default null
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
/**
 *  The default link style attribute can be string or object. The default style string represents Link style type with following values: solid(default), dash, dot, dashDot. The default style string representation has been deprecated. Consider specifying stroke-dasharray in the default style object. The default style object represents the CSS style of the link. User defined custom CSS Styles will be applied directly on the link. 
 * @ignore
 * @name styleDefaults.linkDefaults.style
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string|Object}
 * @default null
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
/**
 *  The default promoted link style attribute can be string or object. The promoted style string represents Link style type with following values: solid, dash, dot(default), dashDot. The promoted style string representation has been deprecated. Consider specifying stroke-dasharray in the promoted style object. The promoted style object represents the CSS style of the link. User defined custom CSS Styles will be applied directly on the link. 
 * @ignore
 * @name styleDefaults.promotedLink.style
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string|Object}
 * @default null
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
 

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for diagram node at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojsubid oj-diagram-node
 * @memberof oj.ojDiagram
 *
 * @example <caption>Get the first diagram node:</caption>
 * var nodes = $( ".selector" ).ojDiagram( "getNodeBySubId", {'subId': 'oj-diagram-node', 'index': 0} );
 */

 /**
 * <p>Sub-ID for diagram link at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojsubid oj-diagram-link
 * @memberof oj.ojDiagram
 *
 * @example <caption>Get the first diagram link:</caption>
 * var nodes = $( ".selector" ).ojDiagram( "getNodeBySubId", {'subId': 'oj-diagram-link', 'index': 0} );
 */

/**
 * <p>Sub-ID for the the diagram tooltip.</p>
 *
 * @ojsubid oj-diagram-tooltip
 * @memberof oj.ojDiagram
 *
 * @example <caption>Get the tooltip object of the diagram, if displayed:</caption>
 * var nodes = $( ".selector" ).ojDiagram( "getNodeBySubId", {'subId': 'oj-diagram-tooltip'} );
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for diagram node at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojnodecontext oj-diagram-node
 * @memberof oj.ojDiagram
 */

/**
 * <p>Context for diagram link at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojnodecontext oj-diagram-link
 * @memberof oj.ojDiagram
 */

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojDiagramMeta = {
  "properties": {
    "animationOnDataChange": {
      "type": "string",
      "enumValues": ["auto","none"]
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": ["auto","none"]
    },
    "data": {},
    "dnd": {
      "type": "object",
      "properties": {
        "drag": {
          "type": "object",
          "properties":{
            "nodes":{
              "type":"object",
              "properties": {
                "dataTypes": {
                  "type": "Array<string>"
                },
                "drag": {},
                "dragEnd": {},
                "dragStart": {}
              }
            },
            "ports":{
              "type":"object",
              "properties": {
                "dataTypes": {
                  "type": "Array<string>"
                },
                "linkStyle": {},
                "selector": {"type":"string"},
                "drag": {},
                "dragEnd": {},
                "dragStart": {}
              }
            }
          }
        },
        "drop": {
          "type": "object",
          "properties":{
            "background" :{
              "type":"object",
              "properties": {
                "dataTypes": {
                  "type": "Array<string>"
                },
                "dragEnter": {},
                "dragLeave": {},
                "dragOver": {},
                "drop": {}
              }              
            },
            "nodes" :{
              "type":"object",
              "properties": {
                "dataTypes": {
                  "type": "Array<string>"
                },
                "dragEnter": {},
                "dragLeave": {},
                "dragOver": {},
                "drop": {}
              }
            },
            "links" :{
              "type":"object",
              "properties": {
                "dataTypes": {
                  "type": "Array<string>"
                },
                "dragEnter": {},
                "dragLeave": {},
                "dragOver": {},
                "drop": {}
              }
            },
            "ports" :{
              "type":"object",
              "properties": {
                "dataTypes": {
                  "type": "Array<string>"
                },
                "feedbackStyle": {},
                "selector": {"type":"string"},
                "dragEnter": {},
                "dragLeave": {},
                "dragOver": {},
                "drop": {}
              }
            }
          }
        }
      }
    },
    "expanded" : {
      "writeback": true
    },
    "focusRenderer": {},
    "hiddenCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "highlightedCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "highlightMatch": {
      "type": "string",
      "enumValues": ["any", "all"]
    },
    "hoverBehavior": {
      "type": "string",
      "enumValues": ["dim", "none"]
    },
    "hoverRenderer": {},
    "layout": {},
    "linkHighlightMode": {
      "type": "string",
      "enumValues": ["linkAndNodes", "link"]
    },
    "linkProperties":{},
    "maxZoom": {
      "type": "number"
    },
    "minZoom": {
      "type": "number"
    },
    "nodeHighlightMode": {
      "type": "string",
      "enumValues": ["nodeAndIncomingLinks", "nodeAndOutgoingLinks", "nodeAndLinks", "node"]
    },
    "nodeProperties": {},
    "panDirection": {
      "type": "string",
      "enumValues": ["x", "y", "auto"]
    },
    "panning": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "promotedLinkBehavior":{
      "type": "string",
      "enumValues": ["none", "lazy", "full"]
    },
    "renderer": {},
    "selection": {
      "type": "Array<string>",
      "writeback": true
    },
    "selectionMode": {
      "type": "string",
      "enumValues": ["none", "single", "multiple"]
    },
    "selectionRenderer": {},
    "styleDefaults": {
      "type": "object",
      "properties": {
        "animationDuration": {
          "type": "number"
        },
        "hoverBehaviorDelay": {
          "type": "number"
        },
        "linkDefaults": {
          "type": "object",
          "properties": {
            "color": {
              "type": "string"
            },
            "endConnectorType": {
              "type": "string",
              "enumValues": ["arrowOpen", "arrow", "arrowConcave", "circle", "rectangle", "rectangleRounded", "none"]
            },
            "labelStyle": {
              "type": "object"
            },
            "startConnectorType": {
              "type": "string",
              "enumValues": ["arrowOpen", "arrow", "arrowConcave", "circle", "rectangle", "rectangleRounded", "none"]
            },
            "svgStyle": {
              "type": "object"
            },
            "width": {
              "type": "number"
            }
          }
        },
        "nodeDefaults": {
          "type": "object",
          "properties": {
            "icon": {
              "type": "object",
              "properties": {
                "borderColor": {
                  "type": "string"
                },
                "borderWidth": {
                  "type": "number"
                },
                "color": {
                  "type": "string"
                },
                "height": {
                  "type": "number"
                },
                "pattern": {
                  "type": "string",
                  "enumValues": ["smallChecker", "smallCrosshatch", "smallDiagonalLeft", 
                                 "smallDiagonalRight", "smallDiamond", "smallTriangle",
                                 "largeChecker", "largeCrosshatch", "largeDiagonalLeft",
                                 "largeDiagonalRight", "largeDiamond", "largeTriangle", "none"]
                },
                "shape": {
                  "type": "string"
                },
                "source": {
                  "type": "string"
                },
                "sourceHover": {
                  "type": "string"
                },
                "sourceHoverSelected": {
                  "type": "string"
                },
                "sourceSelected": {
                  "type": "string"
                },
                "svgStyle": {
                  "type": "object"
                },
                "width": {
                  "type": "number"
                }
              }
            },
            "labelStyle": {
              "type": "object"
            },
            "showDisclosure": {
              "type": "string",
              "enumValues": ["on", "off"]
            }
          }
        },
        "promotedLink": {
          "type": "object",
          "properties": {
            "color": {
              "type": "string"
            },
            "endConnectorType": {
              "type": "string",
              "enumValues": ["arrowOpen", "arrow", "arrowConcave", "circle", "rectangle", "rectangleRounded", "none"]
            },
            "startConnectorType": {
              "type": "string",
              "enumValues": ["arrowOpen", "arrow", "arrowConcave", "circle", "rectangle", "rectangleRounded", "none"]
            },
            "svgStyle": {
              "type": "object"
            },
            "width": {
              "type": "number"
            }
          }
        }
      }
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "touchResponse": {
      "type": "string",
      "enumValues": ["touchStart", "auto"]
    },
    "translations": {
      "type": "Object",
      "properties": {
        "componentName": {
          "type": "string",
          "value": "Diagram"
        },
        "labelAndValue": {
          "type": "string",
          "value": "{0}: {1}"
        },
        "labelClearSelection": {
          "type": "string",
          "value": "Clear Selection"
        },
        "labelCountWithTotal": {
          "type": "string",
          "value": "{0} of {1}"
        },
        "labelDataVisualization": {
          "type": "string",
          "value": "Data Visualization"
        },
        "labelInvalidData": {
          "type": "string",
          "value": "Invalid data"
        },
        "labelNoData": {
          "type": "string",
          "value": "No data to display"
        },
        "promotedLink": {
          "type": "string",
          "value": "{0} link"
        },
        "promotedLinkAriaDesc": {
          "type": "string",
          "value": "Indirect"
        },
        "promotedLinks": {
          "type": "string",
          "value": "{0} links"
        },
        "stateCollapsed": {
          "type": "string",
          "value": "Collapsed"
        },
        "stateDrillable": {
          "type": "string",
          "value": "Drillable"
        },
        "stateExpanded": {
          "type": "string",
          "value": "Expanded"
        },
        "stateHidden": {
          "type": "string",
          "value": "Hidden"
        },
        "stateIsolated": {
          "type": "string",
          "value": "Isolated"
        },
        "stateMaximized": {
          "type": "string",
          "value": "Maximized"
        },
        "stateMinimized": {
          "type": "string",
          "value": "Minimized"
        },
        "stateSelected": {
          "type": "string",
          "value": "Selected"
        },
        "stateUnselected": {
          "type": "string",
          "value": "Unselected"
        },
        "stateVisible": {
          "type": "string",
          "value": "Visible"
        }
      }
    },
    "zooming": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "zoomRenderer": {}
  },
  "events": {
    "beforeCollapse": {},
    "beforeExpand": {},
    "collapse": {},
    "expand": {}
  },
  "methods": {
    "getContextByNode": {},
    "getLink": {},
    "getLinkCount": {},
    "getNode": {},
    "getNodeCount": {},
    "getPromotedLink": {}
  },
  "extension": {
    _WIDGET_NAME: "ojDiagram"
  }
};
oj.CustomElementBridge.registerMetadata('oj-diagram', 'dvtBaseComponent', ojDiagramMeta);
// Get the combined meta of superclass which contains a shape parse function generator
var dvtMeta = oj.CustomElementBridge.getMetadata('oj-diagram');
oj.CustomElementBridge.register('oj-diagram', {
  'metadata': dvtMeta,
  'parseFunction': dvtMeta['extension']._DVT_PARSE_FUNC({'style-defaults.node-defaults.icon.shape': true})
});
})();
});