/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojmap'], function(ojMap)
{
  "use strict";


/* global ojMap:false */

/**
 * @namespace
 * @name oj.DiagramUtils
 * @ojtsmodule
 * @ojtsimport {module: "ojdiagram", type: "AMD", imported: ["DvtDiagramLayoutContext", "DvtDiagramLayoutContextNode",
 *              "DvtDiagramLayoutContextLink"]}
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
 * @hideconstructor
 * @since 3.0
 */
var DiagramUtils = function DiagramUtils() {};
/**
 * The complete label layout object used to position node and link label
 * @typedef {Object} oj.DiagramUtils.LabelLayout
 * @property {number} x x-coordinate for the label
 * @property {number} y y-coordinate for the label
 * @property {number=} rotationPointX x-coordinate for label rotation point
 * @property {number=} rotationPointY y-coordinate for label rotation point
 * @property {number=} angle rotation angle for the label
 * @property {string=} halign horizontal alignment for the label. Valid values are "left", "right" or "center"
 * @property {string=} valign vertical alignment for the label. Valid values are "top", "middle", "bottom" or "baseline".
 *                           The default value is <code class="prettyprint">"top"</code>
 */

/**
 * A function that generates the layout callback function for the ojDiagram component.
 * @param {Object} obj JSON object that defines positions of nodes, links paths and label layouts. The object supports the following properties.
 * @property {Array<Object>} obj.nodes An array of objects with the following properties that describe a position for the diagram node and a layout for the node's label
 * @property {any} obj.nodes.id id for the node
 * @property {number} obj.nodes.x x-coordinate for the node
 * @property {number} obj.nodes.y y-coordinate for the node
 * @property {Object=} obj.nodes.labelLayout An object that defines label layout for the node. See {@link oj.DiagramUtils.LabelLayout} object.
 *                                          The object defines absolute coordinates for label position.
 * @property {Array<Object>=} obj.links An array of objects with the following properties that describe a path for the diagram link and a layout for the link's label.
 * @property {any} obj.links.id id for the link
 * @property {string=} obj.links.path A string that represents an SVG path for the link.
 * @property {any=} obj.links.coordinateSpace The coordinate container id for the link. If specified the link points will be applied relative to that container.
 *                                              If the value is not set, the link points are in the global coordinate space.
 * @property {Object=} obj.links.labelLayout An object that defines label layout for the link. See {@link oj.DiagramUtils.LabelLayout} object.
 *
 * @property {Object=} obj.nodeDefaults An object that defines the default layout of the node label
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
 * @property {Object=} obj.linkDefaults An object that defines a function for generating a link path and a default layout for the link label
 * @property {Function=} obj.linkDefaults.path a callback function that will be used to generate a link path. The function will receive the following parameters:
 *                      <ul>
 *                        <li>{DvtDiagramLayoutContext} - layout context for the diagram</li>
 *                        <li>{DvtDiagramLayoutContextLink} - layout context for the current link</li>
 *                      </ul>
 *                      The return value of the function is a string that represents an SVG path for the link
 * @property {Function=} obj.linkDefaults.labelLayout a function that defines default label layout for diagram links. The function will receive the following parameters:
 *                      <ul>
 *                        <li>{DvtDiagramLayoutContext} - layout context for the diagram</li>
 *                        <li>{DvtDiagramLayoutContextLink} - layout context for the current link</li>
 *                      </ul>
 *                      The return value of the function is a label object with the following properties {@link oj.DiagramUtils.LabelLayout}
 * @property {(Object|Function)=} obj.viewport An object with the following properties that defines diagram viewport.
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
 * @ojsignature [{target:"Type", value:"<K1, K2, D1, D2>", for:"genericTypeParameters"},
 *               {target: "Type", value: "K1", for: "obj.nodes.id"},
 *               {target: "Type", value: "oj.DiagramUtils.LabelLayout", for: "obj.nodes.labelLayout"},
 *               {target: "Type", value: "K2", for: "obj.links.id"},
 *               {target: "Type", value: "K1", for: "obj.links.coordinateSpace"},
 *               {target: "Type", value: "oj.DiagramUtils.LabelLayout", for: "obj.links.labelLayout"},
 *               {target: "Type", value: "oj.DiagramUtils.LabelLayout|((context: DvtDiagramLayoutContext<K1, K2, D1, D2>, node: DvtDiagramLayoutContextNode<K1, D1>) => oj.DiagramUtils.LabelLayout)", for: "obj.nodeDefaults.labelLayout"},
 *               {target: "Type", value: "(context: DvtDiagramLayoutContext<K1, K2, D1, D2>, link: DvtDiagramLayoutContextLink<K1, K2, D2>) => string", for: "obj.linkDefaults.path"},
 *               {target: "Type", value: "(context: DvtDiagramLayoutContext<K1, K2, D1, D2>, link: DvtDiagramLayoutContextLink<K1, K2, D2>) => oj.DiagramUtils.LabelLayout", for: "obj.linkDefaults.labelLayout"},
 *               {target: "Type", value: "{x: number, y: number, w: number, h: number} |((context: DvtDiagramLayoutContext<K1, K2, D1, D2>) => {x: number, y: number, w: number, h: number})", for: "obj.viewport"},
 *               {target: "Type", value: "(context: DvtDiagramLayoutContext<K1, K2, D1, D2>) => void", for: "returns"}]
 * @export
 * @method getLayout
 * @memberof oj.DiagramUtils
 */


DiagramUtils.getLayout = function (obj) {
  var layoutFunc = function layoutFunc(layoutContext) {
    // position nodes and node labels
    var defaultLabelLayout;

    if (obj.nodes && layoutContext.getNodeCount() > 0) {
      var nodesDataMap = DiagramUtils._dataArrayToMap(obj.nodes);

      defaultLabelLayout = obj.nodeDefaults && obj.nodeDefaults.labelLayout ? obj.nodeDefaults.labelLayout : null;

      for (var ni = 0; ni < layoutContext.getNodeCount(); ni++) {
        var node = layoutContext.getNodeByIndex(ni);
        var nodeData = nodesDataMap.get(node.getId());

        DiagramUtils._positionChildNodes(node.getChildNodes(), nodeData ? nodeData.nodes : null, layoutContext, defaultLabelLayout);

        DiagramUtils._positionNodeAndLabel(node, nodeData, layoutContext, defaultLabelLayout);
      }
    } // position links and link labels


    if (obj.links && layoutContext.getLinkCount() > 0) {
      var linksDataMap = DiagramUtils._dataArrayToMap(obj.links);

      var defaultPath = obj.linkDefaults && obj.linkDefaults.path ? obj.linkDefaults.path : null;
      defaultLabelLayout = obj.linkDefaults && obj.linkDefaults.labelLayout ? obj.linkDefaults.labelLayout : null;

      for (var li = 0; li < layoutContext.getLinkCount(); li++) {
        var link = layoutContext.getLinkByIndex(li);
        var linkData = linksDataMap.get(link.getId());

        if (linkData && linkData.path) {
          link.setPoints(linkData.path);
        } else if (defaultPath && defaultPath instanceof Function) {
          link.setPoints(defaultPath(layoutContext, link));
        }

        if (linkData && linkData.coordinateSpace) {
          link.setCoordinateSpace(linkData.coordinateSpace);
        } // position label if it exists


        if (linkData && linkData.labelLayout) {
          DiagramUtils._setLabelPosition(link, linkData.labelLayout);
        } else if (defaultLabelLayout && defaultLabelLayout instanceof Function) {
          DiagramUtils._setLabelPosition(link, defaultLabelLayout(layoutContext, link));
        }
      }
    }

    if (obj.viewport) {
      var viewport = obj.viewport;

      if (viewport instanceof Function) {
        layoutContext.setViewport(viewport(layoutContext));
      } else {
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


DiagramUtils._dataArrayToMap = function (dataArray) {
  // eslint-disable-next-line new-cap
  var m = new ojMap();

  if (dataArray) {
    for (var i = 0; i < dataArray.length; i++) {
      m.set(dataArray[i].id, dataArray[i]);
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


DiagramUtils._positionChildNodes = function (nodes, nodesData, layoutContext, defaultLabelLayout) {
  if (nodes && nodesData) {
    var nodesDataMap = DiagramUtils._dataArrayToMap(nodesData);

    for (var ni = 0; ni < nodes.length; ni++) {
      var node = nodes[ni];
      var nodeData = nodesDataMap.get(node.getId());

      DiagramUtils._positionChildNodes(node.getChildNodes(), nodeData ? nodeData.nodes : null, layoutContext, defaultLabelLayout);

      DiagramUtils._positionNodeAndLabel(node, nodeData, layoutContext, defaultLabelLayout);
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


DiagramUtils._positionNodeAndLabel = function (node, nodeData, layoutContext, defaultLabelLayout) {
  if (node && nodeData) {
    node.setPosition({
      x: nodeData.x,
      y: nodeData.y
    }); // node has a label - position it

    if (nodeData.labelLayout) {
      // layout should be an object - expect absolute positions
      DiagramUtils._setLabelPosition(node, nodeData.labelLayout);
    } else if (defaultLabelLayout && defaultLabelLayout instanceof Function) {
      DiagramUtils._setLabelPosition(node, defaultLabelLayout(layoutContext, node));
    } else if (defaultLabelLayout) {
      // layout should be an object - expect relative positions
      DiagramUtils._setLabelPosition(node, defaultLabelLayout, node.getPosition());
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


DiagramUtils._setLabelPosition = function (obj, labelLayout, offset) {
  var _offset = offset || {
    x: 0,
    y: 0
  };

  obj.setLabelPosition({
    x: labelLayout.x + _offset.x,
    y: labelLayout.y + _offset.y
  });
  var rotationPointX = labelLayout.rotationPointX;
  var rotationPointY = labelLayout.rotationPointY;

  if (!isNaN(rotationPointX) && !isNaN(rotationPointY)) {
    obj.setLabelRotationPoint({
      x: rotationPointX + _offset.x,
      y: rotationPointY + _offset.y
    });
  }

  obj.setLabelRotationAngle(labelLayout.angle);
  obj.setLabelHalign(labelLayout.halign);
  obj.setLabelValign(labelLayout.valign);
};

  ;return DiagramUtils;
});