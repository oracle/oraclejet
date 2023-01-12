/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { BaseComponentDefaults, CSSStyle, CategoryRolloverHandler, Obj, Point, Matrix, Rectangle, PathUtils, Polygon, Polyline, Circle, Rect, Container, Stroke, Path, SelectionEffectUtils, ToolkitUtils, JsonUtils, Agent, MultilineText, OutputText, TextUtils, BackgroundMultilineText, BackgroundOutputText, Displayable, ResourceUtils, KeyboardEvent, MouseEvent, ArrayUtils, CustomAnimation, Animator, Playable, AnimFadeOut, AnimFadeIn, BaseComponent, ImageMarker, SimpleMarker, PatternFill, KeyboardHandler, AnimScaleTo, SolidFill, EventManager, IconButton, EventFactory, ClipPath, Dimension, Automation, DataAnimationHandler, BlackBoxAnimationHandler, SelectionHandler } from 'ojs/ojdvt-toolkit';
import { PanZoomCanvasKeyboardHandler, PanZoomComponent, PanZoomCanvas } from 'ojs/ojdvt-panzoomcanvas';
import { getLogicalChildPopup } from 'ojs/ojkeyboardfocus-utils';
import { Overview } from 'ojs/ojdvt-overview';
import { CustomElementUtils } from 'ojs/ojcustomelement-utils';

/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @param {dvt.Context} context The rendering context.
 * @extends {dvt.BaseComponentDefaults}
 */
class DvtDiagramDefaults extends BaseComponentDefaults {
  constructor(context) {
    const WHITE_SHADE = 'rgb(255,255,255)';
    const GREY_SHADE = 'rgba(0,0,0, .3)';
    const BLACK_SHADE = 'rgb(0,0,0)';
    const SKIN_ALTA = {
      skin: CSSStyle.SKIN_ALTA,
      emptyText: null,
      selectionMode: 'none',
      animationOnDataChange: 'none',
      animationOnDisplay: 'none',
      maxZoom: 1.0,
      highlightMatch: 'all',
      nodeHighlightMode: 'node',
      linkHighlightMode: 'link',
      panning: 'none',
      panZoomState: {
        zoom: 0.0,
        centerX: null,
        centerY: null
      },
      overview: {
        fitArea: 'content',
        preserveAspectRatio: 'meet'
      },
      touchResponse: 'auto',
      zooming: 'none',
      promotedLinkBehavior: 'lazy',
      _statusMessageStyle: new CSSStyle(BaseComponentDefaults.FONT_FAMILY_ALTA),
      dnd: {
        drag: {
          nodes: {},
          ports: {}
        },
        drop: {
          background: {},
          nodes: {},
          links: {},
          ports: {}
        }
      },
      styleDefaults: {
        animationDuration: 500,
        hoverBehaviorDelay: 200,
        _highlightAlpha: 0.1,
        _overviewStyles: {
          overview: {
            backgroundColor: 'rgb(228,229,230)'
          },
          overviewContent: {
            padding: '10px'
          },
          viewport: {
            backgroundColor: WHITE_SHADE,
            borderColor: 'rgb(74,76,78)'
          },
          node: {
            shape: 'inherit'
          }
        },
        nodeDefaults: {
          _containerStyle: new CSSStyle(
            'border-color:#abb3ba;background-color:#f9f9f9;border-width:.5px;border-radius:1px;padding-top:20px;padding-left:20px;padding-bottom:20px;padding-right:20px;'
          ),
          labelStyle: new CSSStyle(
            BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_12 + 'color:#383A47'
          ),
          hoverInnerColor: WHITE_SHADE,
          hoverOuterColor: GREY_SHADE,
          selectionColor: BLACK_SHADE,
          icon: {
            width: 10,
            height: 10,
            pattern: 'none',
            shape: 'circle'
          }
        },
        linkDefaults: {
          startConnectorType: 'none',
          endConnectorType: 'none',
          width: 1,
          _style: { _type: 'solid' },
          hoverInnerColor: WHITE_SHADE,
          hoverOuterColor: GREY_SHADE,
          selectionColor: BLACK_SHADE,
          labelStyle: new CSSStyle(
            BaseComponentDefaults.FONT_FAMILY_ALTA_BOLD_12 + 'color:#383A47'
          ),
          _hitDetectionOffset: 10
        },
        promotedLink: {
          startConnectorType: 'none',
          endConnectorType: 'none',
          width: 1,
          _style: { _type: 'dot', strokeDasharray: '2,3' },
          color: '#778999',
          hoverInnerColor: WHITE_SHADE,
          hoverOuterColor: GREY_SHADE,
          selectionColor: BLACK_SHADE,
          _hitDetectionOffset: 10
        }
      }
    };
    super({ alta: SKIN_ALTA }, context);
  }

  /**
   * @override
   */
  getNoCloneObject() {
    return { data: true, nodeData: true, linkData: true, nodes: true, links: true };
  }
}

/**
 * Category rollover handler for Diagram
 * @param {function} callback A function that responds to component events.
 * @param {object} callbackObj The object instance that the callback function is defined on.
 * @class DvtDiagramCategoryRolloverHandler
 * @extends {dvt.CategoryRolloverHandler}
 * @constructor
 */
class DvtDiagramCategoryRolloverHandler extends CategoryRolloverHandler {
  constructor(callback, callbackObj) {
    super(callback, callbackObj);
    this.setHoverDelay(100);
  }

  /**
   * @override
   */
  GetRolloverCallback(event) {
    return () => {
      this.SetHighlightMode(true);
      this._callbackObj.processEvent(event);
    };
  }

  /**
   * @override
   */
  GetRolloutCallback(event) {
    return () => {
      this.SetHighlightModeTimeout();
      this._callbackObj.processEvent(event);
    };
  }
}

/**
 * Style related utility functions for Diagram.
 * @class
 */
const DvtDiagramDataUtils = {
  /**
   * @protected
   * Retrieves a list of collapsed containers that should be searched for promoted link
   * Used in DataProvider mode.
   * @param {object} rootDataProvider Root data provider object
   * @param {array} nodesArray array of nodes to search
   * @return {array} array of containers to search
   */
  GetCollapsedContainers: (rootDataProvider, nodesArray) => {
    var collapsedContainers = [];
    while (nodesArray.length > 0) {
      var node = nodesArray.shift();
      if (node['nodes']) {
        node['nodes'].forEach((childNode) => {
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
  },

  /**
   * @protected
   * Retrieve node option using child node instance.
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramNode} node node instance
   * @return {object} node option
   */
  GetNodeOption: (comp, node) => {
    // build path from child node to root node
    var path = [node.getId()];
    while (node && node.getGroupId()) {
      var groupId = node.getGroupId();
      path.push(groupId);
      node = comp.getNodeById(groupId);
    }

    // find node option using generated path
    var testId = path.pop();
    var options = [comp.getOptions()];
    var context = comp.getCtx();
    while (testId && options[0].nodes) {
      options = options[0].nodes.filter((item) => {
        return DvtDiagramDataUtils.compareValues(context, item.id, testId);
      });
      testId = path.pop();
    }
    return options[0];
  },

  /**
   * Diagram specific wrapper around compareValues call, that treats null and undefined objects as equal
   * @param {dvt.Context} context The rendering context.
   * @param {any} obj1 object to compare
   * @param {any} obj2 object to compare
   * @return {boolean} True if the two objects are equal and false otherwise
   */
  compareValues: (ctx, obj1, obj2) => {
    if (!obj1 && !obj2) {
      return true;
    }
    return Obj.compareValues(ctx, obj1, obj2);
  },

  /**
   * Rotate label bounds
   * @param {DvtRectandle} bounds label bounds
   * @param {number} rotAngle rotation angle
   * @param {DvtDiagramPoint} rotPoint rotation point
   * @return {dvt.Rectangle} bounds for the rotated label
   * @protected
   */
  RotateBounds: (bounds, rotAngle, rotPoint) => {
    if (rotAngle == null && !rotPoint) {
      return bounds;
    }

    var topLeft = new Point(bounds.x, bounds.y);
    var topRight = new Point(bounds.x + bounds.w, bounds.y);
    var bottomLeft = new Point(bounds.x, bounds.y + bounds.h);
    var bottomRight = new Point(bounds.x + bounds.w, bounds.y + bounds.h);

    var mat = new Matrix();
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

    return new Rectangle(minX, minY, maxX - minX, maxY - minY);
  }
};

/**
 * Dvt Diagram Link Utils
 */
const DvtDiagramLinkUtils = {
  /**
   * Gets dash size
   * @param {string} strokeType stroke type
   * @param {boolean} bUnderlay true for underlay stroke
   * @return {string} dash size
   * @protected
   */
  GetStrokeDash: (strokeType, bUnderlay) => {
    if (strokeType == 'solid') {
      return null;
    }
    // For underlays, increase the dashes by 2 (1 pixel on each side) and decrease the gaps by 2 (1 pixel on each side)
    else if (strokeType === 'dash') {
      return bUnderlay ? '8,2' : '6,4';
    } else if (strokeType === 'dot') {
      return bUnderlay ? '4,1' : '2,3';
    } else if (strokeType === 'dashDot') {
      return bUnderlay ? '10,1,4,1' : '8,3,2,3';
    }
    return null;
  },

  /**
   * Gets dash offset
   * @param {string} strokeType stroke type
   * @param {boolean} bUnderlay true for underlay stroke
   * @return {number} dash offset
   * @protected
   */
  GetStrokeDashOffset: (strokeType, bUnderlay) => {
    if (bUnderlay && 'solid' != strokeType) {
      return 1;
    }
    return null;
  },

  /**
   * Get the stroke object representation for the the passed link style
   * @param {string} linkStyle link style, values are 'solid', 'dash', 'dot', 'dashDot'
   * @param {boolean} bUnderlay true for underlay stroke
   * @return {object} stroke object
   */
  getStrokeObject: (linkStyle, bUnderlay) => {
    return {
      _type: linkStyle,
      strokeDasharray: DvtDiagramLinkUtils.GetStrokeDash(linkStyle, bUnderlay),
      strokeDashoffset: DvtDiagramLinkUtils.GetStrokeDashOffset(linkStyle, bUnderlay)
    };
  },

  /**
   * Process the strok dash array.
   * If an odd number of values is provided, then the list of values is repeated to yield an even number of values
   * @param {string} strokeDashArray stroke-dasharray attributes
   * @return {string} processed stroke dasharray
   */
  processStrokeDashArray: (strokeDashArray) => {
    if (strokeDashArray) {
      var dashArray = strokeDashArray.split(/[\s,]+/);
      //Convert odd number of array values to even number of values by copying itself
      if (dashArray.length % 2 > 0) dashArray = dashArray.concat(dashArray);
      return dashArray.toString();
    }
    return strokeDashArray;
  },

  /**
   * Get the under for the passed stroke dash array
   * The stroke dasharray attribute controls the pattern of dashes and gaps used to stroke paths.
   * @param {string} strokeDashArray stroke-dasharray attributes
   * @return {string} underlay for the passed stroke dash array
   */
  getCustomUnderlay: (strokeDashArray) => {
    if (strokeDashArray) {
      var dashArray = strokeDashArray.split(/[\s,]+/);
      var stringBuf = '';
      //Do the +2, -2 transformation on the resulting even length array. +2 for the dash and -2 for the dot
      for (var index = 0; index < dashArray.length; index++) {
        var item = CSSStyle.toNumber(dashArray[index].trim());
        var resp = item >= 2 ? item - 2 : 0;
        stringBuf += index % 2 == 0 ? item + 2 : resp;
        if (index < dashArray.length - 1) stringBuf += ', ';
      }
      return stringBuf;
    }
    return null;
  },

  /**
   * @protected
   * Create an array of path commands from an array of points.
   * @param {array} points used for rendering a link
   * @return {array} array as SVG path commands
   */
  ConvertToPath: (points) => {
    var pathCmds = [];
    if (points) {
      for (var i = 0; i < points.length; i += 2) {
        if (i == 0) {
          pathCmds.push('M');
        } else {
          pathCmds.push('L');
        }
        pathCmds.push(points[i], points[i + 1]);
      }
    }
    return pathCmds;
  },

  /**
   * @protected
   * Create an array of points from an array of path commands.
   * @param {array} pathCmds array as SVG path commands
   * @return {array} points used for rendering a link
   */
  ConvertToPoints: (pathCmds) => {
    var points = [];
    if (pathCmds) {
      for (var i = 0; i < pathCmds.length; i++) {
        if (!isNaN(pathCmds[i])) {
          points.push(pathCmds[i]);
        }
      }
    }
    return points;
  },

  /**
   * @protected
   * Determine if the given array of points defines a path.
   * @param {array} points points used for rendering a link.  The array can contain
   *                coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path commands, like
   *                ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].
   * @return {boolean} true if the array contains SVG path commands
   */
  IsPath: (points) => {
    if (points && points.length > 0) {
      return isNaN(points[0]);
    }
    return false;
  },

  /**
   * Get link bounds from path points or command and label layout
   * @param {DvtDiagramLink | DvtDiagramLayoutContextLink} linkObj link object or link context object
   * @return {dvt.Rectangle} rectangle that represents link bounds
   */
  GetLinkBounds: (linkObj) => {
    var linkBounds = new Rectangle(
      Number.MAX_VALUE,
      Number.MAX_VALUE,
      -Number.MAX_VALUE,
      -Number.MAX_VALUE
    );
    var points = linkObj.getPoints();
    if (points) {
      if (DvtDiagramLinkUtils.IsPath(points)) {
        linkBounds = PathUtils.getDimensions(points);
      } else {
        var maxX, maxY, minX, minY;
        for (var i = 0; i < points.length; i += 2) {
          var x = points[i];
          var y = points[i + 1];
          maxX = Math.max(linkBounds.x + linkBounds.w, x);
          maxY = Math.max(linkBounds.y + linkBounds.h, y);
          minX = Math.min(linkBounds.x, x);
          minY = Math.min(linkBounds.y, y);

          linkBounds.x = minX;
          linkBounds.y = minY;
          linkBounds.w = maxX - minX;
          linkBounds.h = maxY - minY;
        }
      }
    } // points

    var bounds = new Rectangle(linkBounds.x, linkBounds.y, linkBounds.w, linkBounds.h);
    var labelPos = linkObj.getLabelPosition();
    var labelRotAngle = linkObj.getLabelRotationAngle();
    var labelRotPoint = linkObj.getLabelRotationPoint();
    var labelBounds = linkObj.getLabelBounds();
    if (labelPos && labelBounds) {
      //take label rotation into account
      if (labelRotAngle != null) {
        labelBounds = DvtDiagramDataUtils.RotateBounds(labelBounds, labelRotAngle, labelRotPoint);
      }
      bounds.x = Math.min(linkBounds.x, labelBounds.x + labelPos.x);
      bounds.y = Math.min(linkBounds.y, labelBounds.y + labelPos.y);
      bounds.w =
        Math.max(linkBounds.x + linkBounds.w, labelBounds.x + labelPos.x + labelBounds.w) -
        bounds.x;
      bounds.h =
        Math.max(linkBounds.y + linkBounds.h, labelBounds.y + labelPos.y + labelBounds.h) -
        bounds.y;
    }

    return bounds;
  }
};

/**
 * Dvt Diagram Link Connector utils
 */
const DvtDiagramLinkConnectorUtils = {
  /**
   * Creates the shape for a link connector
   * @param {dvt.Context} context the rendering context
   * @param {string} connectorType the connector type if using a built-in connector, defined in DvtDiagramLinkDef
   * @param {dvt.Stroke} stroke the stroke to apply to the built-in connector, if applicable
   * @param {DvtDiagramLink} parentLink the associated parent link
   * @return {dvt.Shape} the connector shape
   * @protected
   */
  CreateConnectorShape: (context, connectorType, stroke, parentLink) => {
    var linkWidth = parentLink.GetAppliedLinkWidth();

    switch (connectorType) {
      case 'arrow':
        return DvtDiagramLinkConnectorUtils.CreateFilledArrowConnector(
          context,
          linkWidth,
          parentLink.getLinkColor()
        );

      case 'arrowConcave':
        return DvtDiagramLinkConnectorUtils.CreateFilledConcaveArrowConnector(
          context,
          linkWidth,
          parentLink.getLinkColor()
        );

      case 'arrowOpen':
        return DvtDiagramLinkConnectorUtils.CreateOpenArrowConnector(context, linkWidth, stroke);

      case 'circle':
        return DvtDiagramLinkConnectorUtils.CreateCircleConnector(context, linkWidth, stroke);

      case 'rectangle':
        return DvtDiagramLinkConnectorUtils.CreateRectangleConnector(context, linkWidth, stroke);

      case 'rectangleRounded':
        return DvtDiagramLinkConnectorUtils.CreateRoundedRectangleConnector(
          context,
          linkWidth,
          stroke
        );
    }
    return null;
  },

  /**
   * @protected
   */
  TransformConnector: (connector, connectorType, points, connectorPos) => {
    var mat = DvtDiagramLinkConnectorUtils.CalcConnectorTransform(
      connector,
      connectorType,
      points,
      connectorPos
    );
    connector.setMatrix(mat);
  },

  /**
   * @protected
   */
  CalcConnectorTransform: (connector, connectorType, points, connectorPos) => {
    var x1 = -1;
    var y1 = 0;
    var x2 = 0;
    var y2 = 0;

    if (points) {
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
          x1 = x2 - 0.0001;
          y1 = y2;
        }
      } //if (connectorPos === 0)
      else {
        //make sure the array is long enough
        if (numPoints >= 2) {
          x2 = points[0];
          y2 = points[1];
        }
        if (numPoints >= 4) {
          x1 = points[2];
          y1 = points[3];
        } else {
          x1 = x2 + 0.0001;
          y1 = y2;
        }
      }
    }

    var tx = x2;
    var ty = y2;
    var angleRads = DvtDiagramLinkConnectorUtils.CalcConnectorRotation(x1, y1, x2, y2);

    var origMat = connector._connectorOrigMat;
    if (!origMat) {
      origMat = connector.getMatrix();
      connector._connectorOrigMat = origMat;
    }

    var tMat = new Matrix();

    // 1) translate custom connector so that origin is at center, where link will
    //   connect
    // 2) rotate connector about center
    // 3) translate rotated connect to start/end of link
    //

    tMat = tMat.rotate(angleRads);
    tMat = tMat.translate(tx, ty);
    return tMat.concat(origMat);
  },

  _getCachedDims: (connector) => {
    var dims = connector._cachedDims;
    if (!dims) {
      dims = connector.getDimensions();
      connector._cachedDims = dims;
    }
    return dims;
  },

  /**
   * @protected
   */
  CalcConnectorRotation: (x1, y1, x2, y2) => {
    var diffY = y2 - y1;
    var diffX = x2 - x1;
    return Math.atan2(diffY, diffX);
  },

  /**
   * Creates the connector shape for type 'arrowConcave'
   *
   * @param {dvt.Context} context the rendering context
   * @param {number} linkWidth the width of the associated link
   * @param {string} linkColor the color of the associated link
   *
   * @protected
   */
  CreateFilledConcaveArrowConnector: (context, linkWidth, linkColor) => {
    var scaleFactor = DvtDiagramLinkConnectorUtils._getReduce(linkWidth, 0.5);
    var arrowLength = scaleFactor * 6;
    var arrowWidth = arrowLength * 0.8;

    var points = [
      -0.22 * arrowLength,
      -0.5 * arrowWidth,
      0.78 * arrowLength,
      0,
      -0.22 * arrowLength,
      0.5 * arrowWidth,
      0,
      0
    ];

    var filledArrowHead = new Polygon(context, points);
    filledArrowHead.setSolidFill(linkColor);
    return filledArrowHead;
  },

  /**
   * Creates the connector shape for type 'arrow'
   *
   * @param {dvt.Context} context the rendering context
   * @param {number} linkWidth the width of the associated link
   * @param {string} linkColor the color of the associated link
   *
   * @protected
   */
  CreateFilledArrowConnector: (context, linkWidth, linkColor) => {
    var scaleFactor = DvtDiagramLinkConnectorUtils._getReduce(linkWidth, 0.5);
    var arrowLength = scaleFactor * 5;
    var arrowWidth = arrowLength * 0.8;

    var points = [0, -0.5 * arrowWidth, arrowLength, 0, 0, 0.5 * arrowWidth];

    var filledArrowHead = new Polygon(context, points);
    filledArrowHead.setSolidFill(linkColor);
    return filledArrowHead;
  },

  //
  // Function to size the arrow head non-linearly
  //
  /**
   * @protected
   */
  _getReduce: (length, fract) => {
    if (length <= 1) return length;
    var tempLength = length - 1;
    tempLength *= fract;
    return 1 + tempLength;
  },

  /**
   * Creates the connector shape for type 'arrowOpen'
   *
   * @param {dvt.Context} context the rendering context
   * @param {number} linkWidth the width of the associated link
   * @param {dvt.Stroke} stroke the stroke to apply to the shape
   *
   * @protected
   */
  CreateOpenArrowConnector: (context, linkWidth, stroke) => {
    var arrowWidth = linkWidth * 3;
    var strokeWidth = stroke.getWidth();

    var points = [
      -arrowWidth + (strokeWidth * Math.sqrt(2)) / 2,
      -arrowWidth,
      (strokeWidth * Math.sqrt(2)) / 2,
      0,
      -arrowWidth + (strokeWidth * Math.sqrt(2)) / 2,
      arrowWidth
    ];

    var arrowHead = new Polyline(context, points);
    arrowHead.setStroke(stroke);
    arrowHead.setFill(null);

    return arrowHead;
  },

  /**
   * @protected
   */
  getCircleRadius: (linkWidth) => {
    return linkWidth * 2;
  },

  getRectangleLength: (linkWidth) => {
    return linkWidth * 3;
  },

  /**
   * Creates the connector shape for type 'circle'
   *
   * @param {dvt.Context} context the rendering context
   * @param {number} linkWidth the width of the associated link
   * @param {dvt.Stroke} stroke the stroke to apply to the shape
   *
   * @protected
   */
  CreateCircleConnector: (context, linkWidth, stroke) => {
    var radius = DvtDiagramLinkConnectorUtils.getCircleRadius(linkWidth);
    var conShape = new Circle(context, radius, 0, radius);
    conShape.setStroke(stroke);
    conShape.setFill(null);
    return conShape;
  },

  /**
   * Creates the connector shape for type 'rectangle'
   *
   * @param {dvt.Context} context the rendering context
   * @param {number} linkWidth the width of the associated link
   * @param {dvt.Stroke} stroke the stroke to apply to the shape
   *
   * @protected
   */
  CreateRectangleConnector: (context, linkWidth, stroke) => {
    var length = DvtDiagramLinkConnectorUtils.getRectangleLength(linkWidth);
    var conShape = new Rect(context, 0, -length / 2, length, length);
    conShape.setStroke(stroke);
    conShape.setFill(null);
    return conShape;
  },

  /**
   * Creates the connector shape for type 'rectangle'
   *
   * @param {dvt.Context} context the rendering context
   * @param {number} linkWidth the width of the associated link
   * @param {dvt.Stroke} stroke the stroke to apply to the shape
   *
   * @protected
   */
  CreateRoundedRectangleConnector: (context, linkWidth, stroke) => {
    var conShape = DvtDiagramLinkConnectorUtils.CreateRectangleConnector(
      context,
      linkWidth,
      stroke
    );
    conShape.setCornerRadius(linkWidth);
    return conShape;
  },

  /**
   * Calculates the distance between the tip of the connector (i.e. the part that should touch the node) and the end of the link path
   *
   * @param {dvt.Shape} connector the connector shape
   * @param {string} connectorType the connector type if using a built-in connector, defined in DvtDiagramLinkDef
   * @param {dvt.Stroke} stroke the stroke applied to the built-in connector, if applicable
   * @param {DvtDiagramLink} parentLink the associated parent link
   * @return {number} the connector offset
   *
   * @protected
   */
  GetConnectorOffset: (connector, connectorType, stroke, parentLink) => {
    return DvtDiagramLinkConnectorUtils.getStandardConnectorOffset(
      connectorType,
      parentLink.GetAppliedLinkWidth(),
      stroke.getWidth()
    );
  },

  /**
   * Calculates the distance between the tip of the connector (i.e. the part that should touch the node) and the end of the link path
   * for the standard link type
   * @param {string} connectorType the connector type if using a built-in connector, defined in DvtDiagramLinkDef
   * @param {number} linkWidth link width
   * @param {number} strokeWidth stroke width
   * @return {number} the connector offset
   */
  getStandardConnectorOffset: (connectorType, linkWidth, strokeWidth) => {
    var scaleFactor;
    var arrowLength;
    switch (connectorType) {
      case 'arrowOpen':
        return strokeWidth * Math.sqrt(2);

      case 'arrow':
        scaleFactor = DvtDiagramLinkConnectorUtils._getReduce(linkWidth, 0.5);
        arrowLength = scaleFactor * 5;
        return arrowLength;

      case 'arrowConcave':
        scaleFactor = DvtDiagramLinkConnectorUtils._getReduce(linkWidth, 0.5);
        arrowLength = scaleFactor * 6;
        return 0.78 * arrowLength;

      case 'circle':
        var radius = DvtDiagramLinkConnectorUtils.getCircleRadius(strokeWidth);
        return 2 * radius + strokeWidth / 2;

      case 'rectangle':
      case 'rectangleRounded':
        var length = DvtDiagramLinkConnectorUtils.getRectangleLength(strokeWidth);
        return length + strokeWidth / 2;

      default:
        return 0;
    }
  }
};

/**
 * @constructor
 * @class The class for the link underlay
 * @param {dvt.Context} context the rendering context
 * @param {array} points link points
 * @param {dvt.Stroke} stroke for the link underlay
 * @param {Object=} styleObj The optional style object to be applied to the underlay
 * @param {string=} styleClass The optional class to be applied to the underlay
 */
class DvtDiagramLinkUnderlay extends Container {
  constructor(context, points, stroke, styleObj, styleClass) {
    super(context);
    if (!points) points = ['M', 0, 0, 'L', 1, 0];

    this._stroke = stroke;
    if (!this._stroke) this._stroke = new Stroke('#ffffff', 1, 1, true);

    this._underlay = new Path(context, points);
    this._underlay.setStroke(this._stroke);
    this._underlay.setFill(null);
    this._underlay.setStyle(styleObj).setClassName(styleClass);
    this.addChild(this._underlay);

    this._underlayStart = null;
    this._underlayStartType = null;
    this._underlayEnd = null;
    this._underlayEndType = null;
  }

  /**
   * Adds an underlay for the start connector
   *
   * @param {array} points the points representing the path of the parent link
   * @param {string} connectorType the connector type if using a built-in connector, defined in dvt.AdfDiagramLinkDef
   * @param {dvt.AdfDiagramLink} parentLink the associated parent link
   */
  addUnderlayStart(points, connectorType, parentLink) {
    var connectorUnderlay = this.CreateConnectorUnderlay(points, connectorType, parentLink, 0);
    if (this._underlayStart) this.removeChild(this._underlayStart);
    this._underlayStart = connectorUnderlay;
    this._underlayStartType = connectorType;
    this.addChild(this._underlayStart);
  }

  /**
   * Adds an underlay for the end connector
   *
   * @param {array} points the points representing the path of the parent link
   * @param {string} connectorType the connector type if using a built-in connector, defined in dvt.AdfDiagramLinkDef
   * @param {dvt.AdfDiagramLink} parentLink the associated parent link
   */
  addUnderlayEnd(points, connectorType, parentLink) {
    var connectorUnderlay = this.CreateConnectorUnderlay(points, connectorType, parentLink, 1);
    if (this._underlayEnd) this.removeChild(this._underlayEnd);
    this._underlayEnd = connectorUnderlay;
    this._underlayEndType = connectorType;
    this.addChild(this._underlayEnd);
  }

  /**
   * Creates an underlay shape for the start or end connector
   *
   * @param {array} points the points representing the path of the parent link
   * @param {string} connectorType the connector type if using a built-in connector, defined in dvt.AdfDiagramLinkDef
   * @param {dvt.AdfDiagramLink} parentLink the associated parent link
   * @param {number} connectorPos 0 for the startConnector, 1 for the endConnector
   * @return {dvt.Shape} the underlay shape
   */
  CreateConnectorUnderlay(points, connectorType, parentLink, connectorPos) {
    // link stroke uses fixed width, but link connectors are be scalable, so reset fixed width property for the link connector stroke
    var stroke = new Stroke(
      this._stroke.getColor(),
      this._stroke.getAlpha(),
      this._stroke.getWidth(),
      false,
      this._stroke.getDashProps()
    );

    var connectorUnderlay = DvtDiagramLinkConnectorUtils.CreateConnectorShape(
      this.getCtx(),
      connectorType,
      stroke,
      parentLink
    );

    DvtDiagramLinkConnectorUtils.TransformConnector(
      connectorUnderlay,
      connectorType,
      points,
      connectorPos
    );
    return connectorUnderlay;
  }

  /**
   * Gets underlay shape
   * @return {dvt.Path} underlay shape
   */
  getUnderlay() {
    return this._underlay;
  }

  /**
   * Gets underlay for the start connector
   * @return {dvt.Container} underlay for the start connector
   */
  getUnderlayStart() {
    return this._underlayStart;
  }

  /**
   * Gets underlay for the end connector
   * @return {dvt.Container} underlay for the end connector
   */
  getUnderlayEnd() {
    return this._underlayEnd;
  }

  /**
   * Sets stroke on underlays - link underlay, start and end connector underlays
   * @param {dvt.Stroke} stroke Stroke for the underlays
   * @param {number} strokeOffset the desired difference in size between the parent link width and the underlay link width
   */
  setStroke(stroke, strokeOffset) {
    this._stroke = stroke;
    this._underlay.setStroke(stroke);

    if (this._underlayStart) {
      var startStroke;
      if (this._underlayStartType == 'arrow' || this._underlayStartType == 'arrowConcave') {
        startStroke = new Stroke(stroke.getColor(), stroke.getAlpha(), strokeOffset);
        this._underlayStart.setSolidFill(stroke.getColor());
      } else {
        startStroke = new Stroke(stroke.getColor(), stroke.getAlpha(), stroke.getWidth());
      }
      this._underlayStart.setStroke(startStroke);
    }

    if (this._underlayEnd) {
      var endStroke;
      if (this._underlayEndType == 'arrow' || this._underlayEndType == 'arrowConcave') {
        endStroke = new Stroke(stroke.getColor(), stroke.getAlpha(), strokeOffset);
        this._underlayEnd.setSolidFill(stroke.getColor());
      } else {
        endStroke = new Stroke(stroke.getColor(), stroke.getAlpha(), stroke.getWidth());
      }
      this._underlayEnd.setStroke(endStroke);
    }
  }

  /**
   * Gets underlay stroke
   * @return {dvt.Stroke} underlay stroke
   */
  getStroke() {
    return this._stroke;
  }

  /**
   * Hides underlay start
   */
  hideUnderlayStart() {
    if (this._underlayStart) this.removeChild(this._underlayStart);
  }

  /**
   * Hides underlay end
   */
  hideUnderlayEnd() {
    if (this._underlayEnd) this.removeChild(this._underlayEnd);
  }

  /**
   * Shows underlay start
   */
  showUnderlayStart() {
    if (this._underlayStart) this.addChild(this._underlayStart);
  }

  /**
   * Shows underlay end
   */
  showUnderlayEnd() {
    if (this._underlayEnd) this.addChild(this._underlayEnd);
  }
}

const DvtDiagramDataAnimationPhase = {
  DELETE: 0,
  UPDATE: 1,
  INSERT: 2
};

/**
 * @constructor
 * @param {dvt.Context} context the rendering context
 * @param {Diagram} diagram the parent diagram component
 * @param {object} linkData link data
 * @param {boolean} promoted true for promoted link
 * @implements {DvtSelectable}
 * @implements {DvtKeyboardNavigable}
 * @extends {dvt.Container}
 */
class DvtDiagramLink extends Container {
  constructor(context, diagram, linkData, promoted) {
    super(context, null, linkData['id']);
    this._diagram = diagram;
    this._selected = false;
    this._selectable = true;
    this._data = linkData;
    this._isHighlighted = true;
    this._hasContentBoundToTouchEvent = false;
    this._contentStoredInTouchEventContainer = null;
    this.setPromoted(promoted);
    if (this.isSelectable()) {
      this.setCursor(SelectionEffectUtils.getSelectingCursor());
    }
    //sets group id for the link if exists
    this.setGroupId(DvtDiagramLink._getCommonAncestorId(this, diagram));

    this.hasActiveInnerElems = false;
  }

  /**
   * Gets the data object
   * @return {object} the data object
   */
  getData() {
    return this._data;
  }

  /**
   * Sets the data object
   * @param {object} data the data object
   */
  setData(data) {
    this._data = data;
  }

  /**
   * Gets the link id
   * @return {string} link id
   */
  getId() {
    return this.getData()['id'];
  }

  /**
   * Gets the node id
   * @return {string} node id
   */
  getStartId() {
    return this.getData()['startNode'];
  }

  /**
   * Gets the node id
   * @return {string} node id
   */
  getEndId() {
    return this.getData()['endNode'];
  }

  /**
   * Gets label dimensions
   * @return {dvt.Rectangle} The bounds of the label
   */
  getLabelBounds() {
    var bounds = null;
    if (this._labelObj) {
      bounds = this._labelObj.getDimensions();
    }
    return bounds;
  }

  /**
   * Get the link style
   * @return {String} link style
   */
  getLinkStyle() {
    return this.getData()['svgStyle'] || this.getData()['style'];
  }

  /**
   * Gets link width
   * @return {number} link width
   */
  getLinkWidth() {
    return this.getData()['width'];
  }

  /**
   * Gets the link color
   * @return {string} the link color
   */
  getLinkColor() {
    return this.getData()['color'];
  }

  /**
   * Gets the offset of the end connector.  This is the amount of space that the
   * link should leave between its starting point and the node for the connector
   * to be drawn.
   * @return {number}
   */
  getStartConnectorType() {
    return this.getData()['startConnectorType'];
  }

  getEndConnectorType() {
    return this.getData()['endConnectorType'];
  }

  /**
   * Gets the offset of the start connector.  This is the amount of space that the
   * link should leave between its starting point and the node for the connector
   * to be drawn.
   * @return {number}
   */
  getStartConnectorOffset() {
    if (this.getStartConnectorType()) {
      return DvtDiagramLinkConnectorUtils.getStandardConnectorOffset(
        this.getStartConnectorType(),
        this.GetAppliedLinkWidth(),
        this.GetAppliedLinkWidth()
      );
    }
    return 0;
  }

  /**
   * Gets the offset of the end connector.  This is the amount of space that the
   * link should leave between its starting point and the node for the connector
   * to be drawn.
   * @return {number}
   */
  getEndConnectorOffset() {
    if (this.getEndConnectorType()) {
      return DvtDiagramLinkConnectorUtils.getStandardConnectorOffset(
        this.getEndConnectorType(),
        this.GetAppliedLinkWidth(),
        this.GetAppliedLinkWidth()
      );
    }
    return 0;
  }

  /**
   * Renders diagram link
   */
  render() {
    var diagram = this.GetDiagram();
    //find a parent container for the link and attach a link to it
    var groupId = this.getGroupId();
    var startGroupId = diagram.getNodeById(this.getStartId()).getGroupId();
    var endGroupId = diagram.getNodeById(this.getEndId()).getGroupId();
    if (groupId) {
      var context = this.getCtx();
      var linkParent = diagram.getNodeById(groupId).GetChildNodePane();
      if (
        DvtDiagramDataUtils.compareValues(context, groupId, startGroupId) &&
        DvtDiagramDataUtils.compareValues(context, groupId, endGroupId)
      )
        linkParent.addChildAt(this, 0);
      else linkParent.addChild(this); //cross container link inside container
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
  }

  /**
   * Sets the points to use for rendering this link.  The given array can contain
   * coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path commands, like
   * ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].  The points are in the
   * coordinate system of the link's container.
   * @param {array} points array of points to use for rendering this link
   */
  setPoints(points) {
    var renderer = this._getCustomRenderer('renderer');
    if (renderer) {
      this._customPoints = points;
      var prevState = {
        hovered: false,
        selected: false,
        focused: false,
        inActionableMode: this.hasActiveInnerElems
      };
      this._applyCustomLinkContent(renderer, this._getState(), prevState);
    } else {
      if (!this._pathCmds && points) {
        DvtDiagramLink._renderLinkShape(this.getData(), this);
      }
      this._arPoints = points;
      if (!DvtDiagramLinkUtils.IsPath(points)) {
        this._points = points;
        this._pathCmds = DvtDiagramLinkUtils.ConvertToPath(points);
      } else {
        this._pathCmds = points;
        this._points = DvtDiagramLinkUtils.ConvertToPoints(points);
      }

      if (this._shape) {
        if (this._shape instanceof Path) {
          this._shape.setCommandsArray(this._pathCmds);

          if (!this._endConnector) {
            this._endConnector = this.CreateConnector(this._points, this.getEndConnectorType(), 1);
          } else {
            DvtDiagramLinkConnectorUtils.TransformConnector(
              this._endConnector,
              this.getEndConnectorType(),
              this._points,
              1
            );
          }
          if (!this._startConnector) {
            this._startConnector = this.CreateConnector(
              this._points,
              this.getStartConnectorType(),
              0
            );
          } else {
            DvtDiagramLinkConnectorUtils.TransformConnector(
              this._startConnector,
              this.getStartConnectorType(),
              this._points,
              0
            );
          }
        }
      }
      //need to update the selection feedback when animating a link
      var underlayStart = null,
        underlayEnd = null;
      if (this._linkUnderlay && this._linkUnderlay.getUnderlay() instanceof Path) {
        this._linkUnderlay.getUnderlay().setCommandsArray(this._pathCmds);
      }
      if (this._linkUnderlay && (underlayStart = this._linkUnderlay.getUnderlayStart())) {
        DvtDiagramLinkConnectorUtils.TransformConnector(
          underlayStart,
          this.getStartConnectorType(),
          this._points,
          0
        );
      }
      if (this._linkUnderlay && (underlayEnd = this._linkUnderlay.getUnderlayEnd())) {
        DvtDiagramLinkConnectorUtils.TransformConnector(
          underlayEnd,
          this.getEndConnectorType(),
          this._points,
          1
        );
      }

      //: need to update the hit detection underlay when animating
      //a link
      if (
        this._hitDetectionUnderlay &&
        this._hitDetectionUnderlay.getUnderlay() instanceof Path
      ) {
        this._hitDetectionUnderlay.getUnderlay().setCommandsArray(this._pathCmds);
      }
      if (this._startHandle) {
        this._startHandle.setPosition(this.getLinkStart());
      }
      if (this._endHandle) {
        this._endHandle.setPosition(this.getLinkEnd());
      }
    }
  }

  /**
   * Retrieves current state for the link
   * @return {Object} object that contains current hovered, selected, focused states for the link
   * @private
   */
  _getState() {
    return {
      hovered: this._isShowingHoverEffect,
      selected: this.isSelected(),
      focused: this._isShowingKeyboardFocusEffect,
      inActionableMode: this.hasActiveInnerElems
    };
  }

  /**
   * Calls the specified renderer, adds, removes or updates content of the link
   * @param {function} renderer custom renderer for the link state
   * @param {Object} state object that contains curremt object state
   * @param {Object} prevState object that contains previous object state
   * @private
   */
  _applyCustomLinkContent(renderer, state, prevState) {
    var contextHandler = this._diagram.getOptions()['_contextHandler'];
    if (!contextHandler) {
      this._diagram.Log(
        'Diagram: could not add custom link content - context handler is undefined',
        1
      );
      return;
    }

    var context = contextHandler(
      this.isPromoted() ? 'promotedLink' : 'link',
      this.getElem(),
      this._customLinkContent,
      null,
      this.getDataContext(),
      state,
      prevState,
      this._customPoints
    );

    var linkContent = renderer(context);
    // Disable any new focusable elements that may have been added during render
    if (!this.hasActiveInnerElems) {
      var keyboardUtils = this.GetDiagram().getOptions()._keyboardUtils;
      keyboardUtils.disableAllFocusable(this.getElem());
    }
    //   - support null case on updates for custom elements
    if (!linkContent && this._customLinkContent) {
      return;
    }

    // strip top level svg element if it is there - content created by template or
    // custom defined content is wrapped into svg element
    // processedContent will be saved as custom content for futute use - updates and animation
    var processedContent = DvtDiagramLink._processLinkContent(linkContent);

    //remove content if the new and old content do not match, the new content might be null
    if (this._customLinkContent && processedContent != this._customLinkContent) {
      // BUG: JET-31495 - IMPOSSIBLE TO REMOVE HOVER TREATMENT AND TOOLTIP, WHEN INLINE TEMPLATE IS USED
      // When renderer function creates content which is different from the initial content, the initial content
      // is removed from the DOM which breaks the touch events.
      // To fix this, the initial content is added to the touch event container before it can be safely destroyed
      // Move old contents if needed, instead of removing them.
      var stashedOldContents = this._checkAndMoveContents();

      // No need to remove contents if they are already moved.
      if (!stashedOldContents) {
        if (this._customLinkContent.namespaceURI === ToolkitUtils.SVG_NS) {
          this.getContainerElem().removeChild(this._customLinkContent);
        } else if (Array.isArray(this._customLinkContent)) {
          this._customLinkContent.forEach((node) => {
            this.getContainerElem().removeChild(node);
          });
        }
      }
      this._customLinkContent = null;
    }

    // If the content stored in the touch event container is the new content
    // then we need to set the _hasContentBoundToTouchEvent flag to make sure
    // it is not removed from the DOM before the event ends.
    if (processedContent === this._contentStoredInTouchEventContainer) {
      this._hasContentBoundToTouchEvent = true;
    }

    // add content if neccessary
    if (!this._customLinkContent) {
      if (processedContent && processedContent.namespaceURI === ToolkitUtils.SVG_NS) {
        DvtDiagramLink._insertCustomElem(this, processedContent, this._labelObj);
        this._customLinkContent = processedContent;
      } else if (processedContent && Array.isArray(processedContent)) {
        processedContent.forEach((item) => {
          DvtDiagramLink._insertCustomElem(this, item, this._labelObj);
        });
        this._customLinkContent = processedContent;
      } else {
        // not an svg fragment
        this._diagram.Log(
          'Diagram: could not add custom link content for the link ' + this.getId() + linkContent,
          1
        );
      }
    }

    // populate link path if needed
    DvtDiagramLink._fixLinkPath(this);
  }

  /**
   * Renders link shape
   * @param {object} linkData
   * @param {dvt.Container} container parent container
   * @private
   */
  static _renderLinkShape(linkData, container) {
    var points = container._pathCmds;
    if (!points) {
      points = ['M', 0, 0, 'L', 0, 0];
    }
    var id = linkData['id'];
    var linkColor = linkData['color'];
    var linkWidth = linkData['width'];
    var linkStyle = linkData['svgStyle'] || linkData['style'];
    var hitDetectionOffset = CSSStyle.toNumber(linkData['_hitDetectionOffset']);

    //create a transparent underlay wider than the link
    //in order to make it easier to interact with the link
    container._hitDetectionUnderlay = container.CreateUnderlay('#000000', 0, hitDetectionOffset);
    container.addChildAt(container._hitDetectionUnderlay, 0);

    var shape = new Path(container.getCtx(), points, id);
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
          linkStyle['strokeDasharray'] = DvtDiagramLinkUtils.processStrokeDashArray(
            linkStyle['strokeDasharray']
          );
        }
        dashProps = {
          dashArray: linkStyle['strokeDasharray'],
          dashOffset: linkStyle['strokeDashoffset']
        };

        //Remove already processed style attributes
        var styleObj = JsonUtils.clone(linkStyle);
        ['_type', 'strokeDasharray', 'strokeDashoffset'].forEach((entry) => {
          delete styleObj[entry];
        });
        //set the style object directly in style
        shape.setStyle(styleObj);
      } else if (linkStyle !== 'solid') {
        //Use default stroke type if no link style is specified
        dashProps = {
          dashArray: DvtDiagramLinkUtils.GetStrokeDash(linkStyle),
          dashOffset: DvtDiagramLinkUtils.GetStrokeDashOffset(linkStyle)
        };
      }
    }

    var stroke = new Stroke(linkColor, 1, linkWidth, true, dashProps);
    shape.setStroke(stroke);
    container.setShape(shape);
    container.addChildAt(shape, 1);
  }

  /**
   * Renders link labels
   * @param {Diagram} diagram parent component
   * @param {object} linkData
   * @param {dvt.Container} container parent container
   * @private
   */
  static _renderLinkLabels(diagram, linkData, container) {
    var labelString = linkData['label'];
    if (labelString) {
      var rtl = Agent.isRightToLeft(diagram.getCtx());
      var bMultiline = labelString.indexOf('\n') > 0;
      var multiLineText = rtl ? MultilineText.H_ALIGN_RIGHT : MultilineText.H_ALIGN_LEFT;
      var outputText = rtl ? OutputText.H_ALIGN_RIGHT : OutputText.H_ALIGN_LEFT;
      var halign = bMultiline ? multiLineText : outputText;
      var valign = bMultiline ? MultilineText.V_ALIGN_TOP : OutputText.V_ALIGN_TOP;
      var label = DvtDiagramLink.createText(
        diagram.getCtx(),
        labelString,
        linkData['labelStyle'],
        halign,
        valign,
        bMultiline
      );

      var maxWidth = linkData['labelStyle'].getMaxWidth() || linkData['labelStyle'].getWidth();
      var labelWidth = CSSStyle.toNumber(maxWidth);

      if (!maxWidth) {
        container.addChild(label);
        container._labelObj = label;
      } else if (labelWidth > 0 && TextUtils.fitText(label, labelWidth, Infinity, container)) {
        container._labelObj = label;
      }
    }
  }

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
  static createText(ctx, strText, style, halign, valign, bMultiline) {
    var text;
    if (style.hasBackgroundStyles())
      text = bMultiline
        ? new BackgroundMultilineText(ctx, strText, 0, 0, style, null, true)
        : new BackgroundOutputText(ctx, strText, 0, 0, style);
    else {
      text = bMultiline
        ? new MultilineText(ctx, strText, 0, 0, null, true)
        : new OutputText(ctx, strText, 0, 0);
      text.setCSSStyle(style);
    }

    text.setHorizAlignment(halign);
    text.setVertAlignment(valign);
    return text;
  }

  /**
   * Implemented for DvtSelectable
   * @override
   */
  setSelected(selected) {
    var prevState = this._getState();
    this._selected = selected;
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
  }

  /**
   * Implemented for DvtSelectable
   * @override
   */
  isSelectable() {
    return (
      this.GetDiagram().isSelectionSupported() &&
      this.getData()['selectable'] != 'off' &&
      !this.hasActiveInnerElems
    );
  }

  /**
   * Shows hover selection feedback
   * @param {boolean} bHovered true for hovered state
   * @param {boolean} bSelected true for selected state
   * @private
   */
  _showFeedback(bHovered, bSelected) {
    var isRedwood = this.getCtx().getThemeBehavior() === 'redwood';
    if (bHovered && (!isRedwood || !bSelected)) {
      if (!this._savedStroke) {
        this._savedStroke = this.getShape().getStroke();
      }
      var copyStroke = this.getShape().getStroke();
      var hoverStroke = new Stroke(
        this.getData()['hoverInnerColor'],
        copyStroke.getAlpha(),
        copyStroke.getWidth(),
        copyStroke.isFixedWidth(),
        copyStroke.getDashProps()
      );
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
      this._linkUnderlay = this.CreateFeedbackUnderlay(
        '#000000',
        1,
        0,
        this.getData()['svgStyle'],
        this.getData()['svgClassName']
      );
      this.addChildAt(this._linkUnderlay, 0);
    }
    var color = bSelected ? this.getData()['selectionColor'] : this.getData()['hoverOuterColor'];
    var strokeOffset = 2;
    var strokeToCopy = this._linkUnderlay.getStroke();
    var strokeWidth = strokeOffset + this.GetAppliedLinkWidth();
    var stroke = this.GetStyledLinkStroke(strokeToCopy, color, strokeWidth);
    this._linkUnderlay.setStroke(stroke, strokeOffset);
  }

  /**
   * Removes hover selection feedback
   * @private
   */
  _hideFeedback() {
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
  }

  /**
   * Returns a styled link stroke
   * @param {dvt.Stroke} strokeToCopy The stroke whose properties to copy from
   * @param {string} color The color of the new styled link
   * @param {number} width The width of the new styled link
   * @return {dvt.Stroke}
   * @protected
   */
  GetStyledLinkStroke(strokeToCopy, color, width) {
    // don't need to modify stroke for custom elements, the styles should be directly applied to the link shape and underlay shape
    if (this.getCtx().isCustomElement())
      return new Stroke(color, strokeToCopy.getAlpha(), width, strokeToCopy.isFixedWidth());
    var linkStyle = this.GetAppliedLinkStyle();
    if (linkStyle && linkStyle instanceof Object) {
      var strokeType = linkStyle['_type'];
      var dashProps;
      if (strokeType == DvtDiagramLink.CUSTOM_STYLE) {
        var strokeDashOffset =
          linkStyle['strokeDashoffset'] != null
            ? CSSStyle.toNumber(linkStyle['strokeDashoffset']) + 1
            : 1;
        dashProps = {
          dashArray: DvtDiagramLinkUtils.getCustomUnderlay(linkStyle['strokeDasharray']),
          dashOffset: strokeDashOffset
        };
      } else {
        dashProps = {
          dashArray: DvtDiagramLinkUtils.GetStrokeDash(strokeType, true),
          dashOffset: DvtDiagramLinkUtils.GetStrokeDashOffset(strokeType, true)
        };
      }
      return new Stroke(color, strokeToCopy.getAlpha(), width, true, dashProps);
    } else {
      var linkStyle = this.GetAppliedLinkStyle();
      var dashProps;
      if (strokeType1 !== 'solid') {
        dashProps = {
          dashArray: DvtDiagramLinkUtils.GetStrokeDash(linkStyle, true),
          dashOffset: DvtDiagramLinkUtils.GetStrokeDashOffset(linkStyle, true)
        };
      }
      return new Stroke(color, strokeToCopy.getAlpha(), width, true, dashProps);
    }
  }

  /**
   * Handles touch start event on this link
   */
  handleTouchStart() {
    // Called from HandleImmediateTouchStartInternal of DvtDiagramEventManager
    // when a touch event is started on this link.
    // Set the _hasContentBoundToTouchEvent flag to indicate a touch event started on the
    // content of this link is active.
    // This will be unset in cases like hover/zoom where the contents are moved to
    // touch event container and the updated contents are not a part of the touch event.
    this._hasContentBoundToTouchEvent = true;
  }

  /**
   * Handles touch end event on this link
   */
  handleTouchEnd() {
    // Called from HandleImmediateTouchEndInternal of DvtDiagramEventManager
    // when a touch event is ended on this link.
    // Unset the _hasContentBoundToTouchEvent flag to indicate a touch event started on the
    // content of this link is no more active.
    // This is to make sure that it is unset in case like selection event
    // where this flag is set on the handleTouchStart but never updated as
    // the custom render would not have happened.
    this._hasContentBoundToTouchEvent = false;
    this._contentStoredInTouchEventContainer = null;
  }

  /**
   * @override
   */
  showHoverEffect() {
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
  }

  /**
   * @override
   */
  hideHoverEffect() {
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
  }

  /**
   * Highlight current link
   * @param {boolean} bHighlight true if the link should be highlighted
   */
  highlight(bHighlight) {
    if (this._isHighlighted !== bHighlight) {
      var highlightAlpha = bHighlight
        ? 1.0
        : this._diagram.getOptions()['styleDefaults']['_highlightAlpha'];
      this.setAlpha(highlightAlpha);
      this._isHighlighted = bHighlight;
    }
  }

  /**
   * Returns the datatip for the Diagram Link
   * @return {string} The datatip.
   */
  getDatatip() {
    // Custom Tooltip from Function
    var customTooltip = this.GetDiagram().getOptions()['tooltip'];
    var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
    if (tooltipFunc)
      return this.GetDiagram()
        .getCtx()
        .getTooltipManager()
        .getCustomTooltip(tooltipFunc, this.getDataContext());

    // Custom Tooltip from ShortDesc
    return Displayable.resolveShortDesc(this.getShortDesc(), () =>
      DvtDiagramLink.getShortDescContext(this)
    );
  }

  /**
   * Returns short description for the link
   * @return {string}  short description for the link
   */
  getShortDesc() {
    var translations = this.GetDiagram().getOptions().translations;
    if (this.isPromoted()) {
      var linkCount = this.getData()['_links'].length;
      return ResourceUtils.format(
        translations[linkCount > 1 ? 'promotedLinks' : 'promotedLink'],
        [linkCount]
      );
    }
    return this.getData()['shortDesc'];
  }

  /**
   * Returns the data context that will be passed to the tooltip function.
   * @return {object}
   */
  getDataContext() {
    var itemData, data;
    if (this.GetDiagram().isDataProviderMode()) {
      // return both type of data - template processed and originals
      if (this.isPromoted()) {
        itemData = this.getData()['_links'].map((item) => {
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
      id: this.getId(),
      type: this.isPromoted() ? 'promotedLink' : 'link',
      label: this.getData()['label'],
      data: data,
      itemData: itemData,
      component: this.GetDiagram().getOptions()['_widgetConstructor']
    };

    return this.getCtx().fixRendererContext(dataContext);
  }
  /**
   * Returns the shortDesc Context of the link.
   * @param {DvtDiagramLink} link
   * @return {object} The shortDesc Context object
   */
  static getShortDescContext(link) {
    var itemData, data;
    if (link.GetDiagram().isDataProviderMode()) {
      // return both type of data - template processed and originals
      if (link.isPromoted()) {
        itemData = link.getData()['_links'].map((item) => {
          return item['_itemData'];
        });
        data = link.getData()['_links'][0]['_noTemplate'] ? itemData : link.getData()['_links'];
      } else {
        data = link.getData();
        itemData = link.getData()['_itemData'];
      }
    } else {
      data = link.isPromoted() ? link.getData()['_links'] : link.getData()['_itemData'];
    }
    return {
      id: link.getId(),
      label: link.getData()['label'],
      data: data,
      itemData: itemData
    };
  }
  /**
   * Gets the aria label
   * @return {string} the aria label string.
   */
  getAriaLabel() {
    var options = this.GetDiagram().getOptions();
    var states = [];
    var translations = options.translations;
    var keyboardUtils = options._keyboardUtils;
    if (this.isSelectable()) {
      states.push(translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
    }
    if (this.isPromoted()) {
      states.push(translations.promotedLinkAriaDesc);
    }
    var actionableElems = keyboardUtils.getActionableElementsInNode(this.getElem());
    if (actionableElems.length > 0) {
      states.push(translations.accessibleContainsControls);
    }
    return Displayable.generateAriaLabel(this.getShortDesc(), states, () =>
      DvtDiagramLink.getShortDescContext(this)
    );
  }

  /**
   * @protected
   * Updates accessibility attributes on selection event
   */
  UpdateAriaLabel() {
    if (!Agent.deferAriaCreation()) {
      var desc = this.getAriaLabel();
      if (desc) this.setAriaProperty('label', desc);
    }
  }

  /**
   * Implementation of DvtKeyboardNavigable interface
   * @override
   */
  getNextNavigable(event) {
    // If there are active elements, then short circuit a keyboard navigation
    if (this.hasActiveInnerElems) {
      return null;
    }
    var node;
    if (event.keyCode == KeyboardEvent.SPACE && event.ctrlKey) {
      // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
      // care of the selection
      return this;
    } else if (
      event.keyCode == KeyboardEvent.UP_ARROW ||
      event.keyCode == KeyboardEvent.DOWN_ARROW
    ) {
      //if the link got focus via keyboard, get the node where the focus came from
      //we'll navigate around that node
      //if the focus was set through mouse click, set start node as a center of navigation
      node = this.getKeyboardFocusNode();
      if (!node) node = this.GetDiagram().getNodeById(this.getStartId());

      //find next link - if up counter-clockwise, down - clockwise
      var nextLink = this;
      var links = this.GetDiagram().getNavigableLinksForNodeId(node.getId());
      var keyboardHandler = this.GetDiagram().getEventManager().getKeyboardHandler();
      if (keyboardHandler && keyboardHandler.getNextNavigableLink)
        nextLink = keyboardHandler.getNextNavigableLink(node, this, event, links);

      nextLink.setKeyboardFocusNode(node);
      this._diagram.ensureObjInViewport(event, nextLink);
      return nextLink;
    } else if (
      event.keyCode == KeyboardEvent.RIGHT_ARROW ||
      event.keyCode == KeyboardEvent.LEFT_ARROW
    ) {
      var nodeId;
      if (this._movingToStart(event.keyCode)) nodeId = this.getStartId();
      else nodeId = this.getEndId();
      node = this.GetDiagram().getNodeById(nodeId);
      this._diagram.ensureObjInViewport(event, node);
      return node;
    } else if (event.type == MouseEvent.CLICK) {
      return this;
    }
    return null;
  }

  /**
   * Helper function used for keyboard navigation. Checks direction where the focus should move - the start node or the end node
   * @param {number} direction vtKeyboardEvent.RIGHT_ARROW or dvt.KeyboardEvent.LEFT_ARROW
   * @return {boolean} true to move focus to the start node
   * @private
   */
  _movingToStart(direction) {
    var start = this.getLinkStart();
    var end = this.getLinkEnd();
    var linkDirectionL2R = start.x < end.x ? true : false;

    return !(
      (direction == KeyboardEvent.RIGHT_ARROW && linkDirectionL2R) ||
      (direction == KeyboardEvent.LEFT_ARROW && !linkDirectionL2R)
    );
  }

  /**
   * Gets link start position
   * @return {dvt.Point} link start position
   */
  getLinkStart() {
    if (this._customPoints) {
      return DvtDiagramLinkUtils.IsPath(this._customPoints)
        ? new Point(this._customPoints[1], this._customPoints[2])
        : new Point(this._customPoints[0], this._customPoints[1]);
    }
    if (!this._points) return null;
    var x = this._points[0];
    var y = this._points[1];
    return new Point(x, y);
  }

  /**
   * Gets link end position
   * @return {dvt.Point} link end position
   */
  getLinkEnd() {
    if (this._customPoints) {
      var numPoints = this._customPoints.length;
      return new Point(this._customPoints[numPoints - 2], this._customPoints[numPoints - 1]);
    }
    if (!this._points) return null;
    var numPoints = this._points.length;
    var x = this._points[numPoints - 2];
    var y = this._points[numPoints - 1];
    return new Point(x, y);
  }

  /**
   * @override
   */
  showKeyboardFocusEffect() {
    var prevState = this._getState();
    this._isShowingKeyboardFocusEffect = true;
    var focusRenderer = this._getCustomRenderer('focusRenderer');
    if (focusRenderer) {
      this._applyCustomLinkContent(focusRenderer, this._getState(), prevState);
    } else {
      this.showHoverEffect();
    }
  }

  /**
   * @override
   */
  hideKeyboardFocusEffect() {
    var prevState = this._getState();
    this._isShowingKeyboardFocusEffect = false;
    var focusRenderer = this._getCustomRenderer('focusRenderer');
    if (focusRenderer) {
      this._applyCustomLinkContent(focusRenderer, this._getState(), prevState);
    } else {
      this.hideHoverEffect();
    }
  }

  /**
   * @override
   */
  isShowingKeyboardFocusEffect() {
    return this._isShowingKeyboardFocusEffect;
  }

  /**
   * Returns an array containing all categories to which this object belongs.
   * @return {array} The array of categories.
   */
  getCategories() {
    return this.getData()['categories'] ? this.getData()['categories'] : [this.getId()];
  }

  /**
   * Checks whether the object is hidden
   * @return {boolean} true if the object is hidden
   */
  isHidden() {
    var hiddenCategories = this.GetDiagram().getOptions()['hiddenCategories'];
    if (hiddenCategories && ArrayUtils.hasAnyItem(hiddenCategories, this.getCategories())) {
      return true;
    }
    if (
      !(
        this.GetDiagram().getNodeById(this.getStartId()) &&
        this.GetDiagram().getNodeById(this.getEndId())
      )
    ) {
      return true;
    }
    return false;
  }

  /**
   * Creates the update animation for the diagram link
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
   * @param {DvtDiagramLink} oldLink the old link to animate from
   * @param {boolean} bCleanUp true if the link should be removed after animation is done.
   *                          This is a case when multiple links collapse into a promoted link
   */
  animateUpdate(animationHandler, oldLink, bCleanUp) {
    var oldPoints = oldLink.getPoints();
    var newPoints = this.getPoints();
    var playable = new CustomAnimation(this.getCtx(), null, animationHandler.getAnimDur());

    if (!ArrayUtils.equals(oldPoints, newPoints)) {
      this.setPoints(oldPoints);
      var linkAnimType = Animator.TYPE_POLYLINE;
      if (newPoints.length > 0 && isNaN(newPoints[0])) {
        linkAnimType = Animator.TYPE_PATH;
      }
      playable.getAnimator().addProp(linkAnimType, this, this.getPoints, this.setPoints, newPoints);
    }
    if (oldLink._labelObj && this._labelObj) {
      var oldMat = oldLink._labelObj.getMatrix();
      var newMat = this._labelObj.getMatrix();
      if (!oldMat.equals(newMat)) {
        this._labelObj.setMatrix(oldMat);
        playable
          .getAnimator()
          .addProp(
            Animator.TYPE_MATRIX,
            this._labelObj,
            this._labelObj.getMatrix,
            this._labelObj.setMatrix,
            newMat
          );
      }
    }

    if (oldLink.getShape() && this.getShape()) {
      var oldStroke = oldLink.getShape().getStroke();
      var newStroke = this.getShape().getStroke();
      if (
        oldStroke &&
        newStroke &&
        oldStroke instanceof Stroke &&
        newStroke instanceof Stroke &&
        (oldStroke.getColor() != newStroke.getColor() ||
          oldStroke.getWidth() != newStroke.getWidth())
      ) {
        this.getShape().setStroke(oldStroke);
        playable
          .getAnimator()
          .addProp(
            Animator.TYPE_STROKE,
            this.getShape(),
            this.getShape().getStroke,
            this.getShape().setStroke,
            newStroke
          );
      }
    }

    // animate position
    var oldTx = oldLink.getTranslateX();
    var oldTy = oldLink.getTranslateY();
    var newTx = this.getTranslateX();
    var newTy = this.getTranslateY();
    if (oldTx != newTx) {
      this.setTranslateX(oldTx);
      playable
        .getAnimator()
        .addProp(Animator.TYPE_NUMBER, this, this.getTranslateX, this.setTranslateX, newTx);
    }
    if (oldTy != newTy) {
      this.setTranslateY(oldTy);
      playable
        .getAnimator()
        .addProp(Animator.TYPE_NUMBER, this, this.getTranslateY, this.setTranslateY, newTy);
    }

    // animate custom content
    if (this._getCustomRenderer('renderer')) {
      //animate path if it is marked by the class
      var animateFrom = oldLink.getContainerElem().querySelector('.oj-diagram-link-path');
      var animateTo = this.getContainerElem().querySelector('.oj-diagram-link-path');

      if (animateFrom && animateTo) {
        var oldPointsCustom = ToolkitUtils.getAttrNullNS(animateFrom, 'd');
        var newPointsCustom = ToolkitUtils.getAttrNullNS(animateTo, 'd');

        ToolkitUtils.setAttrNullNS(animateTo, 'd', oldPointsCustom);
        var pointsSetter = (points) => {
          ToolkitUtils.setAttrNullNS(animateTo, 'd', points.join(' '));
        };
        var pointsGetter = (obj) => {
          var points = ToolkitUtils.getAttrNullNS(animateTo, 'd');
          var arPoints = PathUtils.createPathArray(points);
          return arPoints;
        };
        playable
          .getAnimator()
          .addProp(
            Animator.TYPE_PATH,
            animateTo,
            pointsGetter,
            pointsSetter,
            PathUtils.createPathArray(newPointsCustom)
          );
      }

      //animate the rest of custom content
      var fadeInItems = DvtDiagramLink._getFadeInCustomItems(
        this._customLinkContent,
        animateTo,
        animateFrom
      );
      var playableExtra = new CustomAnimation(
        this.getCtx(),
        null,
        animationHandler.getAnimDur()
      );
      for (var ix = 0; ix < fadeInItems.length; ix++) {
        var item = fadeInItems[ix];
        ToolkitUtils.setAttrNullNS(item, 'opacity', '0');
        var opacitySetter = (val) => {
          ToolkitUtils.setAttrNullNS(item, 'opacity', val);
        };
        var opacityGetter = () => {
          var value = ToolkitUtils.getAttrNullNS(item, 'opacity');
          return Number(value);
        };
        playableExtra
          .getAnimator()
          .addProp(Animator.TYPE_NUMBER, item, opacityGetter, opacitySetter, 1);
      }
      animationHandler.add(playableExtra, DvtDiagramDataAnimationPhase.INSERT);
    }

    if (bCleanUp) {
      var thisRef = this;
      Playable.appendOnEnd(playable, () => {
        thisRef.getParent().removeChild(thisRef);
      });
    }
    animationHandler.add(playable, DvtDiagramDataAnimationPhase.UPDATE);
  }

  /**
   * Creates the delete animation for the link.
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations.
   */
  animateDelete(animationHandler) {
    this.GetDiagram().getLinksPane().addChild(this);
    var thisRef = this;
    var removeFunc = () => {
      thisRef.getParent().removeChild(thisRef);
      thisRef.destroy();
    };
    var playable = new AnimFadeOut(this.getCtx(), this, animationHandler.getAnimDur());
    Playable.appendOnEnd(playable, removeFunc);
    animationHandler.add(playable, DvtDiagramDataAnimationPhase.DELETE);
  }

  /**
   * Creates the insert animation for the link.
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
   */
  animateInsert(animationHandler) {
    this.setAlpha(0);
    animationHandler.add(
      new AnimFadeIn(this.getCtx(), this, animationHandler.getAnimDur()),
      DvtDiagramDataAnimationPhase.INSERT
    );
  }

  /**
   * Creates the collapse animation for the diagram link - many links collapse into single promoted link
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
   * @param {Array} oldLinksArray array of old links that are collapsing into this one
   */
  animateCollapse(animationHandler, oldLinksArray) {
    if (!oldLinksArray || oldLinksArray.length == 0) return;

    //copy points for the original link to create fake links if needed
    var origPoints = this._customPoints ? this._customPoints : this.getPoints();
    if (Array.isArray(origPoints)) origPoints = origPoints.slice();

    //copy translation for the original link to use on fake links
    var origTx = this.getTranslateX(),
      origTy = this.getTranslateY();

    // use first link to animate from many to promoted
    this.animateUpdate(animationHandler, oldLinksArray[0]);

    // create fake links to animate from many to one
    // delete the fake links at animation end
    for (var i = 1; i < oldLinksArray.length; i++) {
      var data = { id: '_fakeLink' + i + this.getId() };
      data = JsonUtils.merge(data, this.getData());
      var fakeLink = new DvtDiagramLink(this.GetDiagram().getCtx(), this.GetDiagram(), data, true);
      fakeLink.render();
      fakeLink.setPoints(origPoints);
      fakeLink.setTranslate(origTx, origTy);
      fakeLink.animateUpdate(animationHandler, oldLinksArray[i], true);
    }
  }

  /**
   * Creates expand animation for the diagram link - one promoted link expands into many
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
   * @param {Array} newLinksArray array of new links
   */
  animateExpand(animationHandler, newLinksArray) {
    if (!newLinksArray || newLinksArray.length == 0) return;
    for (var i = 0; i < newLinksArray.length; i++) {
      newLinksArray[i].animateUpdate(animationHandler, this);
    }
  }

  /**
   * Sets the label alignments
   * system of the link's container.
   * label object guaranteed to be non-null if this method is called
   * @param {string} halign halign of the link label
   * @param {string} valign valign of the link label
   */
  setLabelAlignments(halign, valign) {
    var isMultiline =
      this._labelObj instanceof MultilineText ||
      this._labelObj instanceof BackgroundMultilineText;
    if (valign == 'baseline')
      valign = isMultiline ? MultilineText.V_ALIGN_TOP : OutputText.V_ALIGN_AUTO;

    this._labelObj.setHorizAlignment(halign);
    this._labelObj.setVertAlignment(valign);
  }

  /**
   * Sets group id for the link
   * @param {any} id group id for the link
   */
  setGroupId(id) {
    this._groupId = id;
  }

  /**
   * Gets group id for the link
   * @return {string} group id for the link
   */
  getGroupId() {
    return this._groupId;
  }

  /**
   * Helper function that finds closest common ascestor container for the link start and end nodes
   * @param {DvtDiagramLink} link
   * @param {Diagram} diagram
   * @return {any} id of the closest common ansestor or null for the top level
   * @private
   */
  static _getCommonAncestorId(link, diagram) {
    var getAllAncestorIds = (id, diagram) => {
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
  }

  /**
   * Helper function that returns id for a promoted link for specified nodes
   * @param {Diagram} diagram the diagram component
   * @param {any} startId id for start node
   * @param {any} endId id for end node
   * @return {any} id for promoted link
   * @protected
   */
  static GetPromotedLinkId(diagram, startId, endId) {
    if (diagram.isDataProviderMode()) {
      return { name: '_promoted', startId: startId, endId: endId };
    }
    return '_plL' + startId + '_L' + endId;
  }

  /**
   * Show drop effect on the link
   */
  ShowDropEffect() {
    if (!this._dropEffect) {
      this._createDropEffect('oj-diagram-link oj-active-drop');
    }
  }

  /**
   * Show rejected drop effect on the link
   */
  ShowRejectedDropEffect() {
    if (!this._dropEffect) {
      this._createDropEffect('oj-diagram-link oj-invalid-drop');
    }
  }

  /**
   * Clear drop effect from the link
   */
  ClearDropEffect() {
    if (this._dropEffect) {
      this.removeChild(this._dropEffect);
      this._dropEffect = null;
    }
  }

  /**
   * Create drop effect for the link
   * @param {string} styleClass style class to be applied to the drop effect
   * @private
   */
  _createDropEffect(styleClass) {
    var hitDetectionOffset = CSSStyle.toNumber(this.getData()['_hitDetectionOffset']);
    this._dropEffect = this.CreateFeedbackUnderlay(
      '#000000',
      0,
      hitDetectionOffset,
      null,
      styleClass
    );
    this._dropEffect.setMouseEnabled(false);
    this.addChild(this._dropEffect);
  }

  /**
   * Helper function that converts link data from data source into internal format
   * @param {object} linkData data object for the link from data source
   * @return {object} link data object in internal format
   * @protected
   */
  static ConvertLinkData(linkData) {
    return {
      id: linkData['id'],
      startNode: linkData['startNode'],
      endNode: linkData['endNode'],
      label: linkData['label'],
      selectable: linkData['selectable'],
      shortDesc: linkData['shortDesc'],
      categories: linkData['categories'],
      _itemData: linkData
    };
  }

  /**
   * Returns an object that contains data used to animate node from one state to another
   * @return {object}
   */
  getAnimationState() {
    var label, shape, state;
    if (this._labelObj) {
      label = { matrix: this._labelObj.getMatrix() };
      label.getMatrix = () => {
        return label['matrix'];
      };
    }
    if (this.getShape()) {
      shape = { stroke: this.getShape().getStroke() };
      shape.getStroke = () => {
        return shape['stroke'];
      };
    }
    var includedLinks = this.isPromoted() ? this.getData()['_links'] : null;
    return {
      partialUpdate: true,
      id: this.getId(),
      promoted: this.isPromoted(),
      includedLinks: includedLinks,
      points: this.getPoints(),
      shape: shape,
      tx: this.getTranslateX(),
      ty: this.getTranslateY(),
      _labelObj: label,
      getId: function () {
        return this.id;
      },
      isPromoted: function () {
        return this.promoted;
      },
      getData: function () {
        return { _links: this.includedLinks };
      },
      getPoints: function () {
        return this.points;
      },
      getShape: function () {
        return this.shape;
      },
      getTranslateX: function () {
        return this.tx;
      },
      getTranslateY: function () {
        return this.ty;
      }
    };
  }

  /**
   * Helper method that searches for the path element that marked with
   * 'oj-diagram-link-path' class and updates the value of 'd' attribute
   * with path commands
   * @param {dvt.Container} container parent container
   * @private
   */
  static _fixLinkPath(container) {
    var pathElement = container.getContainerElem().querySelector('.oj-diagram-link-path');
    if (pathElement) {
      var points = container._customPoints;
      var pathCommands = DvtDiagramLinkUtils.IsPath(points)
        ? points
        : DvtDiagramLinkUtils.ConvertToPath(points);
      pathElement.setAttributeNS(null, 'd', PathUtils.getPathString(pathCommands));
    }
  }

  /**
   * Helper function that walks the DOM up to the root element that represent custom link content and finds items
   * and finds items that will animated with fade in animation. If the content does not have dedicated
   * path element, then the animation will be applied on the single root element.
   * @return {array} an array of nodes from custom content to animate using fade in animation
   * @private
   */
  static _getFadeInCustomItems(newContent, newPathNode, oldPathNode) {
    var items = [];
    // not using oldPathNode in the code, just need to check its existance
    if (newPathNode && oldPathNode) {
      // helper functions that allow to walk the DOM and find all nodes
      // the have to be handled differently than link path element
      var getChildren = (node, skipMe) => {
        var children = [];
        while (node) {
          if (node.nodeType === 1 && node !== skipMe) {
            children.push(node);
          }
          node = node.nextSibling;
        }
        return children;
      };
      // get node siblings except itself
      var getSiblings = (node) => {
        return getChildren(node.parentNode.firstChild, node);
      };

      // main logic
      var testNode = newContent;
      // update the test node if link content is an array
      if (Array.isArray(newContent)) {
        newContent.forEach((node) => {
          if (node.contains(newPathNode)) testNode = node;
          else items.push(node);
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
  }

  /**
   * Helper function that inserts custom svg element before label element
   * @param {dvt.Container} container parent container
   * @param {object} svgElem custom link content as DOM element
   * @param {dvt.OutputText|dvt.BackgroundOutputText|dvt.MultilineText} label label object
   * @private
   */
  static _insertCustomElem(container, svgElem, label) {
    var labelElem = label ? label.getOuterElem() : null;
    if (container) {
      container.getContainerElem().insertBefore(svgElem, labelElem);
    }
  }

  /**
   * Finds appropriate renderer callback function.
   * Supported renderer types - renderer, selectionRenderer, hoverRenderer, focusRenderer.
   *
   * @return {function|null}
   * @private
   */
  _getCustomRenderer(type) {
    var linkContentOpt = this._diagram.getOptions()['linkContent'];
    var rendererFunc = null;
    if (linkContentOpt) {
      var baseRenderer = linkContentOpt['renderer'];
      rendererFunc = linkContentOpt[type];
      // we don't support selection/hover/focus renderers without base renderer
      rendererFunc = baseRenderer && rendererFunc ? rendererFunc : baseRenderer;
    }
    return rendererFunc;
  }

  /**
   * Builds an array of poins for link creation feedback based on existing points and
   * current local position.
   * @param {object} currentPos An object that contains x and y coordinate if the current mouse or touch position
   * @return {array} an array of x and y points for the link start and link end
   * @protected
   */
  GetCreationFeedbackPoints(currentPos) {
    var startPoints = this._customPoints ? this._customPoints : this.getPoints();
    return [startPoints[0], startPoints[1], currentPos.x, currentPos.y];
  }

  /**
   * Helper method processes custom link content generated by one of the link renderers.
   * The method strips the top level 'svg' element when there is one,
   * keeps the content intact when the root element is not 'svg'.
   * The method returns null when content does not contain svg fragment.
   * @param {Element|array} linkContent A DOM element or an array of elements from renderer callback
   * @return {Element|array|null} An SVG element or an array of elements, which will be used as content of a Diagram link, null if content does not contain svg fragment.
   * @private
   */
  static _processLinkContent(linkContent) {
    var customContent = null;
    // svg fragment from custom defined callback with 'svg' element as root
    if (linkContent.namespaceURI === ToolkitUtils.SVG_NS && linkContent.tagName === 'svg') {
      customContent = [];
      // Using Array.prototype.forEach.call() since IE11 does not support NodeList.forEach()
      Array.prototype.forEach.call(linkContent.childNodes, (node) => {
        customContent.push(node);
      });
    }
    // svg fragment from custom defined callback without 'svg' element as root
    else if (linkContent.namespaceURI === ToolkitUtils.SVG_NS) {
      customContent = linkContent;
    }
    // content from template - always an array of nodes or
    // updated content from customer defined callback that was initially wrapped into svg element
    else if (Array.isArray(linkContent)) {
      customContent = [];
      for (var i = 0; i < linkContent.length; i++) {
        if (
          linkContent[i].namespaceURI === ToolkitUtils.SVG_NS &&
          linkContent[i].tagName === 'svg'
        ) {
          // Using Array.prototype.forEach.call() since IE11 does not support NodeList.forEach()
          Array.prototype.forEach.call(linkContent[i].childNodes, (node) => {
            customContent.push(node);
          });
          break;
        } else if (linkContent[i].namespaceURI === ToolkitUtils.SVG_NS) {
          customContent.push(linkContent[i]);
        }
      }
    }
    return Array.isArray(customContent) && customContent.length === 0 ? null : customContent;
  }

  /**
   * Checks if it is needed to move the contents to the touch event pane of the diagram
   * @returns {boolean} true if the contents are stashed, false otherwise
   */
  _checkAndMoveContents() {
    // No need to move contents when there is no active touch event in this node
    // from the HandleImmediateTouchStartInternal handler method of the DvtDiagramEventManager
    if (!this._hasContentBoundToTouchEvent) {
      return false;
    }
    this.GetDiagram().storeTouchEventContent(this._customLinkContent, this);
    this._contentStoredInTouchEventContainer = this._customLinkContent;

    // Reset the _hasContentBoundToTouchEvent flag since the contents are moved to the touch events pane
    // and this links's content no longer is associated with active touch event
    this._hasContentBoundToTouchEvent = false;

    return true;
  }
  /**
   * Returns the link displayable (itself).
   *
   * @return {dvt.Displayable} displayable
   */
  getDisplayable() {
    return this;
  }

  /**
   * Gets parent diagram
   * @return {DvtDiagram} parent diagram
   * @protected
   */
  GetDiagram() {
    return this._diagram;
  }

  /**
   * Get the link start connector
   * @return {dvt.Container}  link start connector
   */
  getStartConnector() {
    return this._startConnector;
  }

  /**
   * Get the link end connector
   * @return {dvt.Container}  link end connector
   */
  getEndConnector() {
    return this._endConnector;
  }

  /**
   * Sets link shape
   * @param {dvt.Path} shape link shape
   */
  setShape(shape) {
    this._shape = shape;
  }

  /**
   * Get the link shape
   * @return {dvt.Path} link shape
   */
  getShape() {
    return this._shape;
  }

  /**
   * Sets label rotation angle
   * @param {number} angle angle of label rotation
   */
  setLabelRotationAngle(angle) {
    this._labelRotAngle = angle;
    DvtDiagramLink.PositionLabel(
      this._labelObj,
      this.getLabelPosition(),
      angle,
      this.getLabelRotationPoint()
    );
  }

  /**
   * Gets label rotation angle
   * @return {number} angle of label rotation
   */
  getLabelRotationAngle() {
    return this._labelRotAngle;
  }

  /**
   * Sets label rotation point
   * @param {DvtDiagramPoint} point label rotation point
   */
  setLabelRotationPoint(point) {
    this._labelRotPoint = point;
    DvtDiagramLink.PositionLabel(
      this._labelObj,
      this.getLabelPosition(),
      this.getLabelRotationAngle(),
      point
    );
  }

  /**
   * Gets label rotation point
   * @return {DvtDiagramPoint} label rotation point
   */
  getLabelRotationPoint() {
    return this._labelRotPoint;
  }

  /**
   * Gets the position of the link label.
   * @return {dvt.Point}
   */
  getLabelPosition() {
    return this._labelPos;
  }

  /**
   * Sets the position of the link label.
   * @param {dvt.Point} pos label position
   */
  setLabelPosition(pos) {
    if (pos) {
      this._labelPos = pos;
      DvtDiagramLink.PositionLabel(
        this._labelObj,
        pos,
        this.getLabelRotationAngle(),
        this.getLabelRotationPoint()
      );
    }
  }

  /**
   * Sets label dimensions
   * @param {dvt.Rectangle} bounds The bounds of the label
   */
  setLabelBounds(bounds) {}

  /**
   * Sets selectable flag on the link
   * @param {boolean} selectable true if the link is selectable
   */
  setSelectable(selectable) {
    this._selectable = selectable;
  }

  /**
   * Checks whether the node is selected
   * @return {boolean} true if the link is selected
   */
  isSelected() {
    return this._selected;
  }

  /**
   * Sets promoted flag on the link
   * @param {boolean} bPromoted true if the link is promoted
   */
  setPromoted(bPromoted) {
    this._bPromoted = bPromoted;
  }

  /**
   * Checks whether the link is promoted link
   * @return {boolean} true if the link is promoted link
   */
  isPromoted() {
    return this._bPromoted;
  }

  /**
   * @protected
   * Gets link style - either style for regular link or promoted link if the promoted link applicable in this case
   * @return {string} link style
   */
  GetAppliedLinkStyle() {
    return this.getLinkStyle();
  }

  /**
   * @protected
   * Gets link width - either width for regular link or promoted link if the promoted link applicable in this case
   * @return {number} link width
   */
  GetAppliedLinkWidth() {
    return this.getLinkWidth();
  }

  /**
   * @protected
   * Creates start or end connector for the link
   * @param {array} points Array of points that represent the link
   * @param {string} connectorType One of the standard connector types. See DvtDiagramLinkDef for types. The parameter is optional. Either type or template should be specified.
   * @param {number} connectorPos Connector position: 0 for start and 1 for end
   * @return {dvt.Shape} connector shape
   */
  CreateConnector(points, connectorType, connectorPos) {
    if (!connectorType) {
      return;
    }

    var origStroke = this._shape.getStroke();
    var stroke = new Stroke(
      origStroke.getColor(),
      origStroke.getAlpha(),
      origStroke.getWidth()
    );

    var connector = DvtDiagramLinkConnectorUtils.CreateConnectorShape(
      this.getCtx(),
      connectorType,
      stroke,
      this
    );

    if (connector) {
      //: add connectors as children of shape so that selection feedback affects them
      this._shape.addChild(connector);
      DvtDiagramLinkConnectorUtils.TransformConnector(
        connector,
        connectorType,
        points,
        connectorPos
      );
    }
    return connector;
  }

  /**
   * Gets the points used for rendering this link.  The array can contain
   * coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path commands, like
   * ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].
   * @return {array} link points
   */
  getPoints() {
    return this._arPoints;
  }

  /**
   * @protected
   * Calculate the matrix used to rotate and position the label.
   * @param {dvt.Point} pos position of the link label
   * @param {number} rotAngle rotation angle for the label
   * @param {dvt.Point} rotPoint rotation point for the label
   * @return {dvt.Matrix} matrix used to rotate and position the label
   */
  static CalcLabelMatrix(pos, rotAngle, rotPoint) {
    var mat = new Matrix();
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
  }

  /**
   * Positions link label
   * @param {dvt.OutputText} label link label
   * @param {dvt.Point} pos position of the link label
   * @param {number} rotAngle rotation angle for the label
   * @param {dvt.Point} rotPoint rotation point for the label
   * @protected
   */
  static PositionLabel(label, pos, rotAngle, rotPoint) {
    if (!label) return;
    var mat = DvtDiagramLink.CalcLabelMatrix(pos, rotAngle, rotPoint);
    label.setMatrix(mat);
  }

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
  CreateUnderlay(strokeColor, strokeAlpha, strokeWidthOffset, styleObj, styleClass) {
    if (!strokeAlpha && strokeAlpha != 0) {
      strokeAlpha = 1;
    }
    if (!strokeWidthOffset && strokeWidthOffset != 0) {
      strokeWidthOffset = 0;
    }

    var strokeWidth = this.GetAppliedLinkWidth() + strokeWidthOffset;
    var stroke = new Stroke(strokeColor, strokeAlpha, strokeWidth, true);
    return new DvtDiagramLinkUnderlay(this.getCtx(), this._pathCmds, stroke, styleObj, styleClass);
  }

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
  CreateFeedbackUnderlay(strokeColor, strokeAlpha, strokeWidthOffset, styleObj, styleClass) {
    var feedbackUnderlay = this.CreateUnderlay(
      strokeColor,
      strokeAlpha,
      strokeWidthOffset,
      styleObj,
      styleClass
    );

    if (this._startConnector && this.getStartConnectorType())
      feedbackUnderlay.addUnderlayStart(this._points, this.getStartConnectorType(), this);
    if (this._endConnector && this.getEndConnectorType())
      feedbackUnderlay.addUnderlayEnd(this._points, this.getEndConnectorType(), this);
    return feedbackUnderlay;
  }

  /**
   * Replaces color of a standard connector
   * @param {dvt.Container} connector link connector
   * @param {dvt.Stroke} stroke for the link connector
   */
  ReplaceConnectorColor(connector, stroke) {
    if (!connector) return;
    var color = null;
    if (stroke.getColor) color = stroke.getColor();

    if (color) {
      var conStroke = connector.getStroke();
      var conFill = connector.getFill();

      if (conStroke) {
        connector.setStroke(
          new Stroke(
            color,
            conStroke.getAlpha(),
            conStroke.getWidth(),
            conStroke.isFixedWidth(),
            conStroke.getDashProps()
          )
        );
      }
      if (conFill) {
        connector.setSolidFill(color);
      }
    }
  }

  /**
   * @override
   */
  getKeyboardBoundingBox(targetCoordinateSpace) {
    if (this.getGroupId() && this._diagram.getOptions()['renderer']) {
      return this._diagram.getCustomObjKeyboardBoundingBox(this);
    }
    return this.getDimensions(targetCoordinateSpace);
  }

  /**
   * @override
   */
  getTargetElem() {
    return this.getElem();
  }

  /**
   * Sets a node that should be used for clockwise/counterclockwise link navigation
   * @param {DvtDiagramNode} node
   */
  setKeyboardFocusNode(node) {
    this._keyboardNavNode = node;
  }

  /**
   * Gets a node that should be used for clockwise/counterclockwise link navigation
   * @return {DvtDiagramNode} a node that should be used for clockwise/counterclockwise link navigation
   */
  getKeyboardFocusNode() {
    return this._keyboardNavNode;
  }
}
DvtDiagramLink.CUSTOM_STYLE = 'customStyle';

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
 * Style related utility functions for Diagram.
 * @class
 */
const DvtDiagramStyleUtils = {
  /**
   * If the option node style attribute is a string, converts it to object
   * @param {object} optionsObject  node options object
   * @param {string} attribute  node attribute
   */
  prepareNodeStyle: (optionsObject, attribute) => {
    if (
      optionsObject &&
      optionsObject[attribute] != null &&
      !(optionsObject[attribute] instanceof Object)
    ) {
      optionsObject[attribute] = CSSStyle.cssStringToObject(optionsObject[attribute]);
    }
  },

  /**
   * If the option style attribute is a string, converts it to link style object
   * @param {object} optionsObject  link options object
   * @param {string} attribute  link style attribute
   */
  prepareLinkStyle: (optionsObject, attribute) => {
    //The link style attribute can be string or object.
    if (optionsObject && optionsObject[attribute] != null) {
      //The style object represents the CSS style of the link.
      if (optionsObject[attribute] instanceof Object) {
        if (optionsObject[attribute]['_type'] == null)
          optionsObject[attribute]['_type'] = DvtDiagramLink.CUSTOM_STYLE;
      } else {
        //The style string represents Link style type with following values: solid, dash, dot, dashDot.
        //convert style string to equivalent style object
        optionsObject[attribute] = DvtDiagramLinkUtils.getStrokeObject(optionsObject[attribute]);
      }
    }
  },

  /**
   * Returns default styles for the diagram nodes
   * @param {Diagram} comp the diagram
   * @return {object} default style object for the nodes
   */
  getNodeDefaultStyles: (comp) => {
    var nodeDefaults = comp.getOptions()['styleDefaults']['nodeDefaults'];
    //If default background/container style is specified in options nodeDefaults, make sure it is an object
    //Note: don't need to convert 'backgroundSvgStyle' and 'containerSvgStyle', since those properties
    //do not support string values
    DvtDiagramStyleUtils.prepareNodeStyle(nodeDefaults, 'backgroundStyle');
    DvtDiagramStyleUtils.prepareNodeStyle(nodeDefaults, 'containerStyle');
    return nodeDefaults;
  },

  /**
   * Gets the node option object for the given node data.
   * Merges the default node properties with properties for the specific node
   * @param {Diagram} comp the diagram
   * @param {object} nodeData node data
   * @param {object} nodeDefaults default styles for the diagarm nodes
   * @return {object} node data object with applied styles
   */
  getNodeStyles: (comp, nodeData, nodeDefaults) => {
    if (comp.isDataProviderMode()) {
      return JsonUtils.merge(nodeData, nodeDefaults, {
        _itemData: true,
        id: true,
        nodes: true
      });
    }

    var convertedNodeData = {
      id: nodeData['id'],
      label: nodeData['label'],
      selectable: nodeData['selectable'],
      shortDesc: nodeData['shortDesc'],
      categories: nodeData['categories'],
      nodes: nodeData['nodes'],
      _itemData: nodeData
    };
    if (comp.getOptions()['nodeProperties']) {
      var styleProps = JsonUtils.clone(comp.getOptions()['nodeProperties'](nodeData));
      //If background/container style is specified in nodeData, make sure it is an object before merging
      DvtDiagramStyleUtils.prepareNodeStyle(styleProps, 'backgroundStyle');
      DvtDiagramStyleUtils.prepareNodeStyle(styleProps, 'containerStyle');
      convertedNodeData = JsonUtils.merge(convertedNodeData, styleProps, { _itemData: true });
    }
    return JsonUtils.merge(convertedNodeData, nodeDefaults, { _itemData: true });
  },

  /**
   * Returns default styles for the diagram links or promoted links
   * @param {Diagram} comp the diagram
   * @param {string} option option to retrieve - 'linkDefaults' or 'promotedLinks'
   * @return {object} default style object for the specified type of links
   */
  getLinkDefaultStyles: (comp, option) => {
    var linkDefaults = comp.getOptions()['styleDefaults'][option];
    //If linkDefaults has style attribute, make sure it is an object
    DvtDiagramStyleUtils.prepareLinkStyle(linkDefaults, 'style');
    //Merge the link default style from options with the link default style from Diagram style defaults
    var attr = comp.getCtx().isCustomElement() ? 'svgStyle' : 'style';
    linkDefaults[attr] = JsonUtils.merge(linkDefaults[attr], linkDefaults['_style']);
    if (comp.getCtx().isCustomElement()) {
      ['_type'].forEach((entry) => {
        delete linkDefaults[attr][entry];
      });
    }
    return linkDefaults;
  },

  /**
   * Gets the link option object for the given link data.
   * Merges the default link properties with properties for the specific link
   * @param {Diagram} comp the diagram
   * @param {object} linkData link data
   * @param {object} linkDefaults default styles for the diagarm links
   * @return {object} link data object with applied styles
   */
  getLinkStyles: (comp, linkData, linkDefaults) => {
    if (comp.isDataProviderMode()) {
      return JsonUtils.merge(linkData, linkDefaults, { _itemData: true, id: true });
    }

    var convertedLinkData = DvtDiagramLink.ConvertLinkData(linkData);
    if (comp.getOptions()['linkProperties']) {
      var styleProps = JsonUtils.clone(comp.getOptions()['linkProperties'](linkData));
      //If linkData has style attribute, make sure it is an object
      DvtDiagramStyleUtils.prepareLinkStyle(styleProps, 'style');
      convertedLinkData = JsonUtils.merge(convertedLinkData, styleProps, { _itemData: true });
    }
    return JsonUtils.merge(convertedLinkData, linkDefaults, { _itemData: true });
  },

  /**
   * Returns the animation duration in seconds for the specified diagram.  This duration is
   * intended to be passed to the animation handler, and is not in the same units
   * as the API.
   * @param {Diagram} diagram
   * @return {number} The animation duration in seconds.
   */
  getAnimDur: (diagram) => {
    return (
      CSSStyle.getTimeMilliseconds(diagram.getOptions()['styleDefaults']['animationDuration']) /
      1000
    );
  },

  /**
   * Returns the display animation for the specified diagram.
   * @param {Diagram} diagram
   * @return {string}
   */
  getAnimOnDisplay: (diagram) => {
    return diagram.getOptions()['animationOnDisplay'];
  },

  /**
   * Returns the data change animation for the specified diagram.
   * @param {Diagram} diagram
   * @return {string}
   */
  getAnimOnDataChange: (diagram) => {
    return diagram.getOptions()['animationOnDataChange'];
  }
};

/**
 * @constructor
 * @param {dvt.Context} context the rendering context
 * @param {Diagram} diagram the parent diagram component
 * @param {object} nodeData node data
 * @extends {dvt.Container}
 * @implements {DvtSelectable}
 * @implements {DvtKeyboardNavigable}
 * @implements {DvtDraggable}
 */
class DvtDiagramNode extends Container {
  constructor(context, diagram, nodeData) {
    super(context, null, nodeData['id']);
    this._diagram = diagram;
    this._bDisclosed = false;
    this._selected = false;
    this._selectable = true;
    this._data = nodeData;
    this._isHighlighted = true;
    this._hasContentBoundToTouchEvent = false;
    this._contentStoredInTouchEventContainer = null;
    if (this.isSelectable()) {
      this.setCursor(SelectionEffectUtils.getSelectingCursor());
    }

    this.hasActiveInnerElems = false;
  }

  /**
   * Gets parent diagram
   * @return {DvtDiagram} parent diagram
   * @protected
   */
  GetDiagram() {
    return this._diagram;
  }

  /**
   * Gets the data object
   * @return {object} the data object
   */
  getData() {
    return this._data;
  }

  /**
   * Sets the data object
   * @param {object} data the data object
   */
  setData(data) {
    this._data = data;
  }

  /**
   * Gets the node id
   * @return {string} node id
   */
  getId() {
    return this._data['id'];
  }

  /**
   * Get the content bounds in coordinates relative to this node.
   * @param {boolean} forceDims true to force dimensions measurements
   * @return {dvt.Rectangle} content bounds
   */
  getContentBounds(forceDims) {
    if (!this._contentDims && forceDims) {
      this._contentDims = this._calcContentDims();
    }
    return this._contentDims;
  }

  /**
   * Get the layout bounds in coordinates relative to this node
   * @param {boolean} forceDims true to force dimensions measurements
   * @return {dvt.Rectangle} layout bounds
   */
  getLayoutBounds(forceDims) {
    return this.getContentBounds(forceDims);
  }

  /**
   * Sets the position of the link label. The position is in the coordinate
   * system of the node's container.
   * @param {dvt.Point} pos position of the node label
   */
  setLabelPosition(pos) {
    if (pos) {
      this._labelPos = pos;
      DvtDiagramNode.PositionLabel(
        this._labelObj,
        pos,
        this.getLabelRotationAngle(),
        this.getLabelRotationPoint()
      );
    }
  }

  /**
   * Gets the position of the node label.
   * @return {dvt.Point}
   */
  getLabelPosition() {
    return this._labelPos;
  }

  /**
   * Sets label dimensions
   * @param {dvt.Rectangle} bounds The bounds of the label
   */
  setLabelBounds(bounds) {}

  /**
   * Gets label dimensions
   * @param {boolean} forceDims true to force dimensions measurements
   * @return {dvt.Rectangle} The bounds of the label
   */
  getLabelBounds(forceDims) {
    var bounds = null;
    if (this._labelObj && forceDims) {
      bounds = this._labelObj.getDimensions();
    }
    return bounds;
  }

  /**
   * Implemented for DvtSelectable
   * @override
   */
  setSelected(selected) {
    var prevState = this._getState();
    this._selected = selected;
    var selectionRenderer = this._getCustomRenderer('selectionRenderer');
    if (selectionRenderer) {
      this._applyCustomNodeContent(selectionRenderer, this._getState(), prevState);
    } else {
      this.processDefaultSelectionEffect(selected);
    }
    this.UpdateAriaLabel();
  }

  /**
   * Hide or show selection effect on the node
   * @param {boolean} selected true to show selected effect
   */
  processDefaultSelectionEffect(selected) {
    if (!this.getSelectionShape()) return;
    this.getSelectionShape().setSelected(selected);
  }
  /**
   * Checks if the diagram node is disclosed. Relevant for container nodes.
   * @return {boolean}  true if the diagram container node is disclosed
   */
  isDisclosed() {
    return this._bDisclosed;
  }

  /**
   * Sets disclosed flag for the node. Relevant for container nodes.
   * @param {boolean} bDisclosed true for disclosed container node
   */
  setDisclosed(bDisclosed) {
    this._bDisclosed = bDisclosed;
  }

  /**
   * Implemented for DvtSelectable
   * @override
   */
  isSelected() {
    return this._selected;
  }
  /**
   * Sets selectable flag on the node
   * @param {boolean} selectable true if the node is selectable
   */
  setSelectable(selectable) {
    this._selectable = selectable;
  }

  /**
   * Implemented for DvtSelectable
   * @override
   */
  isSelectable() {
    return (
      this.GetDiagram().isSelectionSupported() &&
      this.getData()['selectable'] != 'off' &&
      !this.hasActiveInnerElems
    );
  }

  /**
   * Gets node icon
   * @return {dvt.ImageMarker|dvt.SimpleMarker} node icon
   * @protected
   */
  GetIcon() {
    return this._shape;
  }

  /**
   * Renders diagram node
   */
  render() {
    this._cleanUp(null);
    var nodeData = this.getData();
    var renderer = this._getCustomRenderer('renderer');
    if (renderer) {
      var prevState = {
        hovered: false,
        selected: false,
        focused: false,
        zoom: 1,
        expanded: false,
        inActionableMode: false
      };
      this._applyCustomNodeContent(renderer, this._getState(), prevState);
      //update container padding if the node is a disclosed container
      if (this.isDisclosed()) {
        var zoom = this.GetDiagram().getPanZoomCanvas().getZoom();
        var nodeBoundingRect = this.getElem().getBoundingClientRect();
        var childPaneBoundingRect = this._childNodePane
          ? this._childNodePane.getElem().getBoundingClientRect()
          : null;
        if (childPaneBoundingRect) {
          this._containerPadding = {
            left: (childPaneBoundingRect.left - nodeBoundingRect.left) / zoom,
            right: (nodeBoundingRect.right - childPaneBoundingRect.right) / zoom,
            top: (childPaneBoundingRect.top - nodeBoundingRect.top) / zoom,
            bottom: (nodeBoundingRect.bottom - childPaneBoundingRect.bottom) / zoom
          };
        }
      }
      //reset default selection shape if it is there
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
    this.setAriaRole(this.isDisclosed() ? 'group' : 'img');
    this.UpdateAriaLabel();
    this._diagram.getEventManager().associate(this, this);
  }

  /**
   * Calls the specified renderer, adds, removes or updates content of the node
   * @param {function} renderer custom renderer for the node state
   * @param {Object} state object that contains curremt object state
   * @param {Object} prevState object that contains previous object state
   * @private
   */
  _applyCustomNodeContent(renderer, state, prevState) {
    var contextHandler = this._diagram.getOptions()['_contextHandler'];
    if (!contextHandler) {
      this._diagram.Log(
        'Diagram: could not add custom node content - context handler is undefined',
        1
      );
      return;
    }
    var nodeDataContext = this.getDataContext();
    var childContent = null;
    if (this.isDisclosed()) {
      var childNodePane = this.GetChildNodePane();
      var bbox = childNodePane.getDimensions();
      childContent = {
        element: childNodePane.getElem(),
        w: bbox ? bbox.w - bbox.x : null,
        h: bbox ? bbox.h - bbox.y : null
      };
    }
    var context = contextHandler(
      'node',
      this.getElem(),
      this._customNodeContent,
      childContent,
      nodeDataContext,
      state,
      prevState
    );
    var nodeContent = renderer(context);
    // Disable any new focusable elements that may have been added during render
    if (!this.hasActiveInnerElems) {
      var keyboardUtils = this.GetDiagram().getOptions()._keyboardUtils;
      keyboardUtils.disableAllFocusable(this.getElem());
    }
    this._nodeContext = context;
    //   - support null case on updates for custom elements
    if (!nodeContent && this._customNodeContent && this.getCtx().isCustomElement()) {
      return;
    }

    //remove content if the new and old content do not match, the new content might be null
    if (this._customNodeContent && nodeContent != this._customNodeContent) {
      // BUG: JET-31495 - IMPOSSIBLE TO REMOVE HOVER TREATMENT AND TOOLTIP, WHEN INLINE TEMPLATE IS USED
      // When renderer function creates content which is different from the initial content, the initial content
      // is removed from the DOM which breaks the touch events.
      // To fix this, the initial content is added to the touch event container before it can be safely destroyed
      // Move old contents if needed, instead of removing them.
      var stashedOldContents = this._checkAndMoveContents();

      // No need to remove contents if they are already moved.
      if (!stashedOldContents) {
        if (this._customNodeContent.namespaceURI === ToolkitUtils.SVG_NS) {
          this.getContainerElem().removeChild(this._customNodeContent);
        } else if (Array.isArray(this._customNodeContent)) {
          this._customNodeContent.forEach((node) => {
            this.getContainerElem().removeChild(node);
          });
        } else {
          this.removeChild(nodeContent);
        }
      }
      this._customNodeContent = null;
    }

    // If the content stored in the touch event container is the new content
    // then we need to set the _hasContentBoundToTouchEvent flag to make sure
    // it is not removed from the DOM before the event ends.
    if (nodeContent === this._contentStoredInTouchEventContainer) {
      this._hasContentBoundToTouchEvent = true;
    }

    if (nodeContent && nodeContent.namespaceURI === ToolkitUtils.SVG_NS) {
      if (!this._customNodeContent) {
        this._appendChildElem(
          this.getContainerElem(),
          nodeContent,
          childContent ? childContent.element : null
        );
        this._customNodeContent = nodeContent;
      }
    } else if (nodeContent && Array.isArray(nodeContent)) {
      if (!this._customNodeContent) {
        nodeContent.forEach((node) => {
          this._appendChildElem(
            this.getContainerElem(),
            node,
            childContent ? childContent.element : null
          );
        });
        this._customNodeContent = nodeContent;
      }
    } else if (nodeContent instanceof BaseComponent) {
      if (!this._customNodeContent) {
        this.addChild(nodeContent);
        this._customNodeContent = nodeContent;
      }
    } else if (nodeContent) {
      //not an svg fragment
      this._diagram.Log(
        'Diagram: could not add custom node content for the node ' + this.getId() + nodeContent,
        1
      );
    }
  }

  /**
   * Appends the child content to the custom node
   * @param {object} parent DOM element
   * @param {object} nodeContent custom node DOM element
   * @param {object} childContent DOM element child content of node
   * @private
   */
  _appendChildElem(parent, nodeContent, childContent) {
    if (nodeContent.querySelector) {
      var placeholderChild = nodeContent.querySelector('oj-diagram-child-content');
      if (placeholderChild) {
        var parentElement = placeholderChild.parentNode;
        if (childContent) {
          parentElement.replaceChild(childContent, placeholderChild);
        } else {
          parentElement.removeChild(placeholderChild);
        }
      }
    }
    // If there's a label, make sure content is inserted before label, if no label, insert before button
    if (this._labelObj) {
      parent.insertBefore(nodeContent, this._labelObj.getElem());
    } else {
      parent.insertBefore(
        nodeContent,
        this._containerButton ? this._containerButton.getElem() : null
      );
    }
  }

  /**
   * Renders node icon
   * @param {Diagram} diagram parent component
   * @param {object} nodeData node data
   * @param {dvt.Container} container parent container
   * @private
   */
  static _renderNodeBackground(diagram, nodeData, container) {
    // TODO: removing node background for custom elements,
    // since we can't properly support svg style and class name at the moment
    if (diagram.getCtx().isCustomElement()) return;

    var backgroundStyle = nodeData['backgroundSvgStyle'] || nodeData['backgroundStyle'];
    var styleObj = JsonUtils.clone(backgroundStyle);
    var backgroundProps = [
      CSSStyle.WIDTH,
      CSSStyle.HEIGHT,
      CSSStyle.BACKGROUND_COLOR,
      CSSStyle.BORDER_COLOR,
      CSSStyle.BORDER_WIDTH,
      CSSStyle.BORDER_RADIUS
    ];
    //Merge the background style from options and background style from CSS object
    backgroundStyle = DvtDiagramNode._getNodeCSSStyle(
      styleObj,
      nodeData['_backgroundStyle'],
      backgroundProps
    );
    if (!backgroundStyle.isEmpty()) {
      var width = CSSStyle.toNumber(backgroundStyle.getStyle(CSSStyle.WIDTH));
      var height = CSSStyle.toNumber(backgroundStyle.getStyle(CSSStyle.HEIGHT));
      var fillColor = backgroundStyle.getStyle(CSSStyle.BACKGROUND_COLOR);

      var borderColor = backgroundStyle.getStyle(CSSStyle.BORDER_COLOR);
      var borderWidth = CSSStyle.toNumber(backgroundStyle.getStyle(CSSStyle.BORDER_WIDTH));
      var borderRadius = CSSStyle.toNumber(
        backgroundStyle.getStyle(CSSStyle.BORDER_RADIUS)
      );

      var backgroundRect = new Rect(diagram.getCtx(), 0, 0, width, height);
      backgroundRect.setSolidFill(fillColor);
      if (borderRadius) {
        backgroundRect.setRx(borderRadius);
        backgroundRect.setRy(borderRadius);
      }
      if (borderColor) {
        backgroundRect.setStroke(new Stroke(borderColor, 1, borderWidth));
      }

      //Parse out the CSS properties which are already applied on the DOM
      if (styleObj)
        backgroundProps.forEach((entry) => {
          delete styleObj[CSSStyle.cssStringToObjectProperty(entry)];
        });
      //Set the style and class attributes for node background
      var bgClassName = nodeData['backgroundSvgClassName'] || nodeData['backgroundClassName'];
      backgroundRect.setStyle(styleObj).setClassName(bgClassName);

      container.addChild(backgroundRect);
      container.setSelectionShape(backgroundRect);
      container._background = backgroundRect;
    }
  }

  /**
   * Renders node icon
   * @param {Diagram} diagram parent component
   * @param {object} nodeData node data
   * @param {dvt.Container} container parent container
   * @private
   */
  static _renderNodeIcon(diagram, nodeData, container) {
    var icon = nodeData['icon'];
    if (icon) {
      var iconWidth = icon['width'];
      var iconHeight = icon['height'];
      var iconColor = icon['color'];
      var iconBorderRadius = icon['borderRadius'];
      var iconMarker;
      if (icon['source']) {
        iconMarker = new ImageMarker(
          diagram.getCtx(),
          iconWidth / 2,
          iconHeight / 2,
          iconWidth,
          iconHeight,
          iconBorderRadius,
          icon['source'],
          icon['sourceSelected'],
          icon['sourceHover'],
          icon['sourceHoverSelected']
        );
      } else {
        iconMarker = new SimpleMarker(
          diagram.getCtx(),
          icon['shape'],
          iconWidth / 2,
          iconHeight / 2,
          iconWidth,
          iconHeight,
          iconBorderRadius
        );
      }
      if (icon['pattern'] != 'none') {
        iconMarker.setFill(new PatternFill(icon['pattern'], iconColor));
      } else {
        iconMarker.setSolidFill(iconColor);
      }
      if (icon['opacity'] != null) {
        iconMarker.setAlpha(icon['opacity']);
      }
      if (icon['borderColor']) {
        iconMarker.setStroke(new Stroke(icon['borderColor'], 1, icon['borderWidth']));
      }
      var style = icon['svgStyle'] || icon['style'];
      var className = icon['svgClassName'] || icon['className'];
      iconMarker.setStyle(style).setClassName(className);

      container.addChild(iconMarker);
      container._shape = iconMarker;
      DvtDiagramNode._setIconPosition(nodeData, container);
      if (!container._background) {
        //if background does not exist apply selection on the node icon
        container.setSelectionShape(iconMarker);
      }
    }
  }

  /**
   * Sets icon position if background is present
   * @param {object} nodeData node data
   * @param {dvt.Container} container parent container
   * @private
   */
  static _setIconPosition(nodeData, container) {
    if (container._background) {
      var iconData = nodeData['icon'];
      var backgroundWidth = container._background.getWidth();
      var backgroundHeight = container._background.getHeight();
      var iconWidth = iconData['width'];
      var iconHeight = iconData['height'];
      //default to center
      var positionX = (backgroundWidth - iconWidth) * 0.5;
      var positionY = (backgroundHeight - iconHeight) * 0.5;

      // find x position
      if (iconData['positionX'] !== undefined) {
        //allow positionX=0
        positionX = parseFloat(iconData['positionX']);
        if (Agent.isRightToLeft(container.getCtx())) {
          positionX = backgroundWidth - positionX - iconWidth;
        }
      } else {
        var resolvedHalign = iconData['halign'];
        if (resolvedHalign == 'start') {
          resolvedHalign = Agent.isRightToLeft(container.getCtx()) ? 'right' : 'left';
        } else if (resolvedHalign == 'end') {
          resolvedHalign = Agent.isRightToLeft(container.getCtx()) ? 'left' : 'right';
        }
        var resp = resolvedHalign == 'right' ? backgroundWidth - iconWidth : positionX;
        positionX = resolvedHalign == 'left' ? 0 : resp;
      }

      // find y position
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
  }

  /**
   * Renders node label
   * @param {Diagram} diagram parent component
   * @param {object} nodeData node data
   * @param {dvt.Container} container parent container
   * @private
   */
  static _renderNodeLabels(diagram, nodeData, container) {
    var labelString = nodeData['label'];
    if (labelString) {
      var rtl = Agent.isRightToLeft(diagram.getCtx());
      var bMultiline = labelString.indexOf('\n') > 0;
      var multilineTextPos = rtl ? MultilineText.H_ALIGN_RIGHT : MultilineText.H_ALIGN_LEFT;
      var outputTextPos = rtl ? OutputText.H_ALIGN_RIGHT : OutputText.H_ALIGN_LEFT;
      var halign = bMultiline ? multilineTextPos : outputTextPos;
      var valign = bMultiline ? MultilineText.V_ALIGN_TOP : OutputText.V_ALIGN_TOP;
      var label = DvtDiagramNode.createText(
        diagram.getCtx(),
        labelString,
        nodeData['labelStyle'],
        halign,
        valign,
        bMultiline
      );

      var maxWidth = nodeData['labelStyle'].getMaxWidth() || nodeData['labelStyle'].getWidth();
      var labelWidth = CSSStyle.toNumber(maxWidth);

      if (!maxWidth) {
        container.addChild(label);
        container._labelObj = label;
      } else if (labelWidth > 0 && TextUtils.fitText(label, labelWidth, Infinity, container)) {
        container._labelObj = label;
      }
    }
  }

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
  static createText(ctx, strText, style, halign, valign, bMultiline) {
    var text;
    if (style.hasBackgroundStyles())
      text = bMultiline
        ? new BackgroundMultilineText(ctx, strText, 0, 0, style, null, true)
        : new BackgroundOutputText(ctx, strText, 0, 0, style);
    else {
      text = bMultiline
        ? new MultilineText(ctx, strText, 0, 0, null, true)
        : new OutputText(ctx, strText, 0, 0);
      text.setCSSStyle(style);
    }

    text.setHorizAlignment(halign);
    text.setVertAlignment(valign);
    return text;
  }

  /**
   * Adds default hover selection strokes to the node
   * @param {dvt.Shape} selectionShape selection shape for the node
   * @param {object} nodeData node data
   * @private
   */
  static _addHoverSelectionDefaultStrokes(selectionShape, nodeData) {
    //Apply the selected, and hover strokes
    var hoverInnerColor = nodeData['hoverInnerColor'];
    var hoverOuterColor = nodeData['hoverOuterColor'];
    var selectionColor = nodeData['selectionColor'];
    var isRedwood = selectionShape.getCtx().getThemeBehavior() === 'redwood';
    var his;
    var hos;
    var sis;
    var sos;
    if (isRedwood) {
      var dataColor;
      if (nodeData.icon && nodeData.icon.color) dataColor = nodeData.icon.color;
      else dataColor = hoverOuterColor;
      his = new Stroke(hoverInnerColor, 1, 1, true);
      hos = new Stroke(dataColor, 1, 3, true);
      sis = new Stroke(hoverInnerColor, 1, 1, true);
      sos = new Stroke(selectionColor, 1, 3, true);
      selectionShape.setHoverStroke(his, hos).setSelectedStroke(sis, sos);
    } else {
      his = new Stroke(hoverInnerColor, 1, 4, true);
      hos = new Stroke(hoverOuterColor, 1, 8, true);
      sis = new Stroke(hoverInnerColor, 1, 2, true);
      sos = new Stroke(selectionColor, 1, 6, true);
      var shis = new Stroke(hoverInnerColor, 1, 4, true);
      var shos = new Stroke(selectionColor, 1, 8, true);
      selectionShape
        .setHoverStroke(his, hos)
        .setSelectedStroke(sis, sos)
        .setSelectedHoverStroke(shis, shos);
    }
  }

  /**
   * Adds hover selection strokes to the node which has OUTER stroke alignment
   * @param {dvt.Shape} selectionShape selection shape for the node
   * @param {object} nodeData node data
   * @private
   */
  static _addHoverSelectionOuterStrokes(selectionShape, nodeData) {
    //Apply the selected, and hover strokes
    var hoverInnerColor = nodeData['hoverInnerColor'];
    var hoverOuterColor = nodeData['hoverOuterColor'];
    var selectionColor = nodeData['selectionColor'];
    var isRedwood = selectionShape.getCtx().getThemeBehavior() === 'redwood';
    var his;
    var hos;
    var sis;
    var sos;
    if (isRedwood) {
      his = new Stroke(hoverInnerColor, 1, 1, true);
      hos = new Stroke(hoverOuterColor, 1, 3, true);
      sis = new Stroke(hoverInnerColor, 1, 1, true);
      sos = new Stroke(selectionColor, 1, 3, true);
      selectionShape.setHoverStroke(his, hos).setSelectedStroke(sis, sos);
    } else {
      // For OUTER stroke alignment, the stroke is applied on the outer edge of the path of the selection shape.
      // The outer stroke will circumscribe inner stroke and the width of outer stroke won't be reduced by inner stroke.
      // The outer stroke visible width will be same as specified.
      his = new Stroke(hoverInnerColor, 1, 2, true);
      hos = new Stroke(hoverOuterColor, 1, 2, true);
      sis = new Stroke(hoverInnerColor, 1, 1, true);
      sos = new Stroke(selectionColor, 1, 2, true);
      var shis = new Stroke(hoverInnerColor, 1, 2, true);
      var shos = new Stroke(selectionColor, 1, 2, true);
      selectionShape
        .setHoverStroke(his, hos)
        .setSelectedStroke(sis, sos)
        .setSelectedHoverStroke(shis, shos);
    }
  }

  /**
   * Sets the shape that should be used for displaying selection and hover feedback
   * @param {dvt.Shape} selectionShape the shape that should be used for displaying selection and hover feedback
   */
  setSelectionShape(selectionShape) {
    this._selectionShape = selectionShape;
  }

  /**
   * Gets the shape that should be used for displaying selection and hover feedback
   * @return {dvt.Shape} the shape that should be used for displaying selection and hover feedback
   */
  getSelectionShape() {
    if (!this._selectionShape) {
      // create selection shape in necessary
      var contentDims = this.getContentBounds(true);
      if (contentDims) {
        var selectionShape = new Rect(
          this._diagram.getCtx(),
          contentDims.x,
          contentDims.y,
          contentDims.w,
          contentDims.h
        );
        selectionShape.setInvisibleFill();
        // Selection shape stroke alignment is set to OUTER.
        selectionShape.setStrokeAlignment('outer');
        this.setSelectionShape(selectionShape);
        this.addChildAt(selectionShape, 0);
        DvtDiagramNode._addHoverSelectionOuterStrokes(selectionShape, this.getData());
        this._selectionShape = selectionShape;
      }
    }
    return this._selectionShape;
  }

  /**
   * Handles touch start event on this node
   */
  handleTouchStart() {
    // Called from HandleImmediateTouchStartInternal of DvtDiagramEventManager
    // when a touch event is started on this node.
    // Set the _hasContentBoundToTouchEvent flag to indicate a touch event started on the
    // content of this node is active.
    // This will be unset in cases like hover/zoom where the contents are moved to
    // touch event container and the updated contents are not a part of the touch event.
    this._hasContentBoundToTouchEvent = true;
  }

  /**
   * Handles touch end event on this node
   */
  handleTouchEnd() {
    // Called from HandleImmediateTouchEndInternal of DvtDiagramEventManager
    // when a touch event is ended on this node.
    // Unset the _hasContentBoundToTouchEvent flag to indicate a touch event started on the
    // content of this node is no more active.
    // This is to make sure that it is unset in case like selection event
    // where this flag is set on the handleTouchStart but never updated as
    // the custom render would not have happened.
    this._hasContentBoundToTouchEvent = false;
    this._contentStoredInTouchEventContainer = null;
  }

  /**
   * @override
   */
  showHoverEffect() {
    if (this._isShowingHoverEffect) return;
    var prevState = this._getState();
    this._isShowingHoverEffect = true;
    var hoverRenderer = this._getCustomRenderer('hoverRenderer');
    if (hoverRenderer) {
      this._applyCustomNodeContent(hoverRenderer, this._getState(), prevState);
    } else {
      this.processDefaultHoverEffect(true);
    }
  }

  /**
   * @override
   */
  hideHoverEffect() {
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
  }

  /**
   * Hides or shows default hover effect
   * @param {boolean} hovered true to show hover effect
   */
  processDefaultHoverEffect(hovered) {
    if (!this.getSelectionShape()) return;
    if (hovered) this.getSelectionShape().showHoverEffect();
    else this.getSelectionShape().hideHoverEffect();
  }

  /**
   * Returns the datatip for the Diagram Node
   * @return {string} The datatip.
   */
  getDatatip() {
    // Custom Tooltip from Function
    var customTooltip = this.GetDiagram().getOptions()['tooltip'];
    var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;
    if (tooltipFunc)
      return this.GetDiagram()
        .getCtx()
        .getTooltipManager()
        .getCustomTooltip(tooltipFunc, this.getDataContext());

    // Custom Tooltip from ShortDesc
    return Displayable.resolveShortDesc(this.getShortDesc(), () =>
      DvtDiagramNode.getShortDescContext(this)
    );
  }

  /**
   * Returns short description for the node
   * @return {string}  short description for the node
   */
  getShortDesc() {
    return this.getData()['shortDesc'];
  }

  /**
   * Returns the data context that will be passed to the tooltip function.
   * @return {object}
   */
  getDataContext() {
    var data = this.getData();
    var resp = data['_noTemplate'] ? data['_itemData'] : data;
    var dataContext = {
      id: this.getId(),
      type: 'node',
      label: data['label'],
      data: this.GetDiagram().isDataProviderMode() ? resp : data['_itemData'],
      itemData: this.GetDiagram().isDataProviderMode() ? data['_itemData'] : null,
      component: this.GetDiagram().getOptions()['_widgetConstructor']
    };

    return this.getCtx().fixRendererContext(dataContext);
  }
  /**
   * Returns the shortDesc Context of the node.
   * @param {DvtDiagramNode} node
   * @return {object} The shortDesc Context object
   */
  static getShortDescContext(node) {
    var data = node.getData();
    var resp = data['_noTemplate'] ? data['_itemData'] : data;
    return {
      id: node.getId(),
      label: data['label'],
      data: node.GetDiagram().isDataProviderMode() ? resp : data['_itemData'],
      itemData: node.GetDiagram().isDataProviderMode() ? data['_itemData'] : null
    };
  }

  /**
   * Gets the aria label
   * @return {string} the aria label string.
   */
  getAriaLabel() {
    var options = this.GetDiagram().getOptions();
    var states = [];
    var translations = options.translations;
    var keyboardUtils = options._keyboardUtils;
    if (this.isSelectable()) {
      states.push(translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
    }
    if (this.isContainer()) {
      states.push(translations[this.isDisclosed() ? 'stateExpanded' : 'stateCollapsed']);
    }
    var actionableElems = keyboardUtils.getActionableElementsInNode(this.getElem());
    if (actionableElems.length > 0) {
      states.push(translations.accessibleContainsControls);
    }
    return Displayable.generateAriaLabel(this.getShortDesc(), states, () =>
      DvtDiagramNode.getShortDescContext(this)
    );
  }

  /**
   * @protected
   * Updates accessibility attributes on selection event
   */
  UpdateAriaLabel() {
    if (!Agent.deferAriaCreation()) {
      var desc = this.getAriaLabel();
      if (desc) this.setAriaProperty('label', desc);
    }
  }

  // Implementation of DvtKeyboardNavigable interface
  /**
   * @override
   */
  getNextNavigable(event) {
    var next = null;
    // If there are active elements, then short circuit a keyboard navigation
    if (this.hasActiveInnerElems) {
      return null;
    } else if (event.keyCode == KeyboardEvent.SPACE && event.ctrlKey) {
      // multi-select node with current focus; so we navigate to ourself and then let the selection handler take
      // care of the selection
      next = this;
    } else if (
      (event.keyCode == KeyboardEvent.OPEN_ANGLED_BRACKET ||
        KeyboardEvent.CLOSE_ANGLED_BRACKET) &&
      event.altKey
    ) {
      //get first navigable link if exists
      var adjLinks = this.GetDiagram().getNavigableLinksForNodeId(this.getId());
      var keyboardHandler = this.GetDiagram().getEventManager().getKeyboardHandler();
      if (keyboardHandler && keyboardHandler.getFirstNavigableLink)
        next = keyboardHandler.getFirstNavigableLink(this, event, adjLinks);
      if (next) next.setKeyboardFocusNode(this);
      else next = this;
    } else if (event.keyCode == KeyboardEvent.OPEN_BRACKET) {
      //next node down in container hierarchy
      if (this.isDisclosed()) {
        var childNodes = this.getChildNodes();
        next = childNodes[0];
      } else next = this;
    } else if (event.keyCode == KeyboardEvent.CLOSE_BRACKET) {
      //next node up in container hierarchy
      parentNode = this.getGroupId() ? this.GetDiagram().getNodeById(this.getGroupId()) : null;
      next = parentNode ? parentNode : this;
    } else if (event.type == MouseEvent.CLICK) {
      next = this;
    } else {
      // get next navigable node
      var parentNode = this.getGroupId() ? this.GetDiagram().getNodeById(this.getGroupId()) : null;
      var siblings = parentNode
        ? parentNode.getChildNodes()
        : this.GetDiagram().GetRootNodeObjects();
      next = KeyboardHandler.getNextAdjacentNavigable(this, event, siblings);
    }
    if (event instanceof KeyboardEvent) this._diagram.ensureObjInViewport(event, next);

    return next;
  }

  /**
   * Process a keyboard event
   * @param {dvt.KeyboardEvent} event
   */
  HandleKeyboardEvent(event) {
    if (event.keyCode == KeyboardEvent.SPACE && event.ctrlKey && event.shiftKey) {
      if (this.isContainer()) {
        this.GetDiagram().setNodeDisclosed(this.getId(), !this.isDisclosed());
      }
    }
  }

  /**
   * Check if the node is a container node
   * @return {boolean} return true for container node
   */
  isContainer() {
    if (this._diagram.isTreeDataProvider()) {
      var childDataProvider = this._diagram
        .getOptions()
        .nodeData.getChildDataProvider(this.getId());
      return childDataProvider ? childDataProvider.isEmpty() !== 'yes' : false;
    } else if (this._diagram.isDataProviderMode()) {
      return false;
    } else {
      var dataSource = this.GetDiagram().getOptions()['data'];
      return dataSource['getChildCount'](this.getData()) == 0 ? false : true;
    }
  }

  /**
   * @override
   */
  showKeyboardFocusEffect() {
    if (this.isShowingKeyboardFocusEffect()) return;
    var prevState = this._getState();
    this._isShowingKeyboardFocusEffect = true;
    var focusRenderer = this._getCustomRenderer('focusRenderer');
    if (focusRenderer) {
      this._applyCustomNodeContent(focusRenderer, this._getState(), prevState);
    } else {
      this.processDefaultFocusEffect(true);
    }
  }

  /**
   * @override
   */
  hideKeyboardFocusEffect() {
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
  }

  /**
   * Hides or shows default keyboard focus effect
   * @param {boolean} focused true to show keyboard focus effect
   */
  processDefaultFocusEffect(focused) {
    this.processDefaultHoverEffect(focused);
  }

  /**
   * @override
   */
  isShowingKeyboardFocusEffect() {
    return this._isShowingKeyboardFocusEffect;
  }

  /**
   * Returns an array containing all categories to which this object belongs.
   * @return {array} The array of categories.
   */
  getCategories() {
    return this.getData()['categories'] ? this.getData()['categories'] : [this.getId()];
  }

  /**
   * Checks whether the object is hidden
   * @return {boolean} true if the object is hidden
   */
  isHidden() {
    var hiddenCategories = this.GetDiagram().getOptions()['hiddenCategories'];
    if (hiddenCategories && ArrayUtils.hasAnyItem(hiddenCategories, this.getCategories())) {
      return true;
    }
    return false;
  }

  /**
   * Get the content bounds in coordinates relative to this node.
   * @return {dvt.Rectangle} content bounds
   * @private
   */
  _calcContentDims() {
    var dims = null;
    if (this._customNodeContent) {
      // custom renderer
      var bbox;
      if (this._customNodeContent instanceof BaseComponent) {
        bbox = this._customNodeContent.getDimensions();
        if (bbox) {
          dims = new Rectangle(bbox.x, bbox.y, bbox.w, bbox.h);
        }
      } else {
        var customNode = this._customNodeContent;
        if (Array.isArray(customNode)) {
          for (var i = 0; i < customNode.length; i++) {
            // get the svg elmeent to measure
            if (customNode[i].namespaceURI === ToolkitUtils.SVG_NS) {
              customNode = customNode[i];
              break;
            }
          }
        }
        bbox = customNode.getBBox();
        if (bbox) {
          dims = new Rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
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
  }

  /**
   * Creates the update animation for the diagram node
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
   * @param {DvtDiagramNode} oldNode the old node to animate from
   */
  animateUpdate(animationHandler, oldNode) {
    var playable = new CustomAnimation(this.getCtx(), null, animationHandler.getAnimDur());

    // animate node internals - consider 3 different scenarios
    // - node is leaf node or collapsed container node - animate internal elements
    // - container node - disclosure state didn't change - constract animation for children
    // - container node - disclosure state changed - animate disclosure

    // 1. node is leaf node or collapsed container node
    var oldMat;
    var newMat;
    if (!this.isDisclosed() && !oldNode.isDisclosed()) {
      DvtDiagramNode._animatePosition(playable, oldNode, this);
      //size
      if (oldNode._shape && this._shape) {
        playable
          .getAnimator()
          .addProp(
            Animator.TYPE_RECTANGLE,
            this._shape,
            this._shape.getCenterDimensions,
            this._shape.setCenterDimensions,
            this._shape.getCenterDimensions()
          );
        this._shape.setCenterDimensions(oldNode._shape.getCenterDimensions());
      }
      //label
      if (oldNode._labelObj && this._labelObj) {
        oldMat = oldNode._labelObj.getMatrix();
        newMat = this._labelObj.getMatrix();
        if (!oldMat.equals(newMat)) {
          this._labelObj.setMatrix(oldMat);
          playable
            .getAnimator()
            .addProp(
              Animator.TYPE_MATRIX,
              this._labelObj,
              this._labelObj.getMatrix,
              this._labelObj.setMatrix,
              newMat
            );
        }
      }
      //background and icon
      DvtDiagramNode._animateFill(playable, oldNode._background, this._background);
      DvtDiagramNode._animateFill(playable, oldNode._shape, this._shape);
    }
    // 2. both nodes are disclosed containers - node size, background and child nodes could change
    else if (this.isDisclosed() && oldNode.isDisclosed()) {
      //label
      if (oldNode._labelObj && this._labelObj) {
        oldMat = oldNode._labelObj.getMatrix();
        newMat = this._labelObj.getMatrix();
        if (!oldMat.equals(newMat)) {
          this._labelObj.setMatrix(oldMat);
          playable
            .getAnimator()
            .addProp(
              Animator.TYPE_MATRIX,
              this._labelObj,
              this._labelObj.getMatrix,
              this._labelObj.setMatrix,
              newMat
            );
        }
      }

      if (this._getCustomRenderer('renderer')) {
        this._animateCustomUpdate(animationHandler, oldNode);
      } else {
        DvtDiagramNode._animatePosition(playable, oldNode, this);

        //animate size and background
        DvtDiagramNode._animateContainer(playable, oldNode._containerShape, this._containerShape);

        //animate expand-collapse button position in rtl case
        if (
          Agent.isRightToLeft(this.getCtx()) &&
          oldNode._containerButton &&
          this._containerButton
        ) {
          var oldButtonTx = oldNode._containerButton.getTranslateX();
          var newButtonTx = this._containerButton.getTranslateX();
          if (oldButtonTx != newButtonTx) {
            this._containerButton.setTranslateX(oldButtonTx);
            playable
              .getAnimator()
              .addProp(
                Animator.TYPE_NUMBER,
                this._containerButton,
                this._containerButton.getTranslateX,
                this._containerButton.setTranslateX,
                newButtonTx
              );
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
          for (var j = 0; j < oldChildIds.length; j++) {
            oldChildNodes.push(oldNodes.get(oldChildIds[j]));
          }
          animationHandler.constructAnimation(oldChildNodes, newChildNodes);
        }
      }
    }
    // 3. disclosure state changed - animate disclosure
    else {
      this._animateCustomUpdate(animationHandler, oldNode);
    }
    animationHandler.add(playable, DvtDiagramDataAnimationPhase.UPDATE);
  }

  /**
   * Animates container disclosure and nodes created by custom renderer
   * @param {DvtDiagramDataAnimationHandler} animationHandler The animation handler, which can be used to chain animations.
   * @param {DvtDiagramNode} oldNode The old node state to animate from.
   * @private
   */
  _animateCustomUpdate(animationHandler, oldNode) {
    var oldBounds = oldNode.getContentBounds();
    var newBounds = this.getContentBounds();
    var playable;
    if (oldBounds.equals(newBounds)) {
      playable = new CustomAnimation(this.getCtx(), null, animationHandler.getAnimDur());
      DvtDiagramNode._animatePosition(playable, oldNode, this);
      animationHandler.add(playable, DvtDiagramDataAnimationPhase.UPDATE);
      return;
    }

    // scales for sizing and positioning
    var scaleTo = newBounds.w / oldBounds.w; //used for old node
    var scaleFrom = oldBounds.w / newBounds.w; //used for new node

    //create animator to animate position
    playable = new CustomAnimation(this.getCtx(), null, animationHandler.getAnimDur());

    //animate new node position
    var oldNodeCenter = new Point(
      oldNode.getTranslateX() + oldBounds.w * 0.5,
      oldNode.getTranslateY() + oldBounds.h * 0.5
    );
    var newTx = this.getTranslateX();
    var newTy = this.getTranslateY();
    this.setTranslateX(oldNodeCenter.x - newBounds.w * scaleFrom * 0.5);
    this.setTranslateY(oldNodeCenter.y - newBounds.w * scaleFrom * 0.5);
    playable
      .getAnimator()
      .addProp(Animator.TYPE_NUMBER, this, this.getTranslateX, this.setTranslateX, newTx);
    playable
      .getAnimator()
      .addProp(Animator.TYPE_NUMBER, this, this.getTranslateY, this.setTranslateY, newTy);
    animationHandler.add(playable, DvtDiagramDataAnimationPhase.UPDATE);

    // animate scale and fade in new node
    this.setScaleX(scaleFrom);
    this.setScaleY(scaleFrom);
    var scaleNewToOld = new AnimScaleTo(
      this.getCtx(),
      this,
      new Point(1, 1),
      animationHandler.getAnimDur()
    );
    animationHandler.add(scaleNewToOld, DvtDiagramDataAnimationPhase.UPDATE);

    var oldNodeContent = oldNode['partialUpdate'] ? oldNode['origContent'] : oldNode;
    if (oldNodeContent) {
      // animate old node - can do this for partial updates
      //attach old node for custom animation
      this.getParent().addChild(oldNodeContent);

      //animate old node position
      var newNodeCenter = new Point(
        this.getTranslateX() + newBounds.w * 0.5,
        this.getTranslateY() + newBounds.h * 0.5
      );
      playable
        .getAnimator()
        .addProp(
          Animator.TYPE_NUMBER,
          oldNodeContent,
          oldNode.getTranslateX,
          oldNodeContent.setTranslateX,
          newNodeCenter.x - oldBounds.w * scaleTo * 0.5
        );
      playable
        .getAnimator()
        .addProp(
          Animator.TYPE_NUMBER,
          oldNodeContent,
          oldNode.getTranslateY,
          oldNodeContent.setTranslateY,
          newNodeCenter.y - oldBounds.h * scaleTo * 0.5
        );

      // animate scale and fade out old node
      var scaleOldToNew = new AnimScaleTo(
        this.getCtx(),
        oldNodeContent,
        new Point(scaleTo, scaleTo),
        animationHandler.getAnimDur()
      );
      animationHandler.add(scaleOldToNew, DvtDiagramDataAnimationPhase.UPDATE);

      var fadeOut = new AnimFadeOut(
        this.getCtx(),
        oldNodeContent,
        animationHandler.getAnimDur()
      );
      animationHandler.add(fadeOut, DvtDiagramDataAnimationPhase.UPDATE);
      var thisRef = this;
      Playable.appendOnEnd(fadeOut, () => {
        thisRef.getParent().removeChild(oldNodeContent);
      });

      this.setAlpha(0);
      var fadeIn = new AnimFadeIn(this.getCtx(), this, animationHandler.getAnimDur());
      animationHandler.add(fadeIn, DvtDiagramDataAnimationPhase.UPDATE);
    }
  }

  /**
   * Helper to animate node position
   * @param {dvt.Playable} playable The playable to add the animation to
   * @param {dvt.Displayable} oldNode old node
   * @param {dvt.Displayable} newNode new node
   * @private
   */
  static _animatePosition(playable, oldNode, newNode) {
    if (newNode && oldNode) {
      var oldTx = oldNode.getTranslateX();
      var oldTy = oldNode.getTranslateY();
      var newTx = newNode.getTranslateX();
      var newTy = newNode.getTranslateY();
      if (oldTx != newTx) {
        newNode.setTranslateX(oldTx);
        playable
          .getAnimator()
          .addProp(
            Animator.TYPE_NUMBER,
            newNode,
            newNode.getTranslateX,
            newNode.setTranslateX,
            newTx
          );
      }
      if (oldTy != newTy) {
        newNode.setTranslateY(oldTy);
        playable
          .getAnimator()
          .addProp(
            Animator.TYPE_NUMBER,
            newNode,
            newNode.getTranslateY,
            newNode.setTranslateY,
            newTy
          );
      }
    }
  }

  /**
   * Helper to animate between container shapes - animates container background and shape
   * @param {dvt.Playable} playable The playable to add the animation to
   * @param {dvt.Displayable} oldDisplayable old displayble
   * @param {dvt.Displayable} newDisplayable new displayable
   * @private
   */
  static _animateContainer(playable, oldDisplayable, newDisplayable) {
    if (newDisplayable && oldDisplayable) {
      DvtDiagramNode._animateFill(playable, oldDisplayable, newDisplayable);
      playable
        .getAnimator()
        .addProp(
          Animator.TYPE_NUMBER,
          newDisplayable,
          newDisplayable.getWidth,
          newDisplayable.setWidth,
          newDisplayable.getWidth()
        );
      newDisplayable.setWidth(oldDisplayable.getWidth());
      playable
        .getAnimator()
        .addProp(
          Animator.TYPE_NUMBER,
          newDisplayable,
          newDisplayable.getHeight,
          newDisplayable.setHeight,
          newDisplayable.getHeight()
        );
      newDisplayable.setHeight(oldDisplayable.getHeight());
    }
  }

  /**
   * Helper to animate between fills
   * @param {dvt.Playable} playable The playable to add the animation to
   * @param {dvt.Displayable} oldDisplayable old displayble
   * @param {dvt.Displayable} newDisplayable new displayable
   * @private
   */
  static _animateFill(playable, oldDisplayable, newDisplayable) {
    if (
      oldDisplayable &&
      newDisplayable &&
      newDisplayable.getFill() instanceof SolidFill &&
      !newDisplayable.getFill().equals(oldDisplayable.getFill())
    ) {
      playable
        .getAnimator()
        .addProp(
          Animator.TYPE_FILL,
          newDisplayable,
          newDisplayable.getFill,
          newDisplayable.setFill,
          newDisplayable.getFill()
        );
      newDisplayable.setFill(oldDisplayable.getFill());
    }
  }

  /**
   * Creates the delete animation for the node.
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations.
   */
  animateDelete(animationHandler) {
    this.GetDiagram().getNodesPane().addChild(this);
    var removeFunc = () => {
      this.getParent().removeChild(this);
      this.destroy();
    };
    var playable = new AnimFadeOut(this.getCtx(), this, animationHandler.getAnimDur());
    Playable.appendOnEnd(playable, removeFunc);
    animationHandler.add(playable, DvtDiagramDataAnimationPhase.DELETE);
  }

  /**
   * Creates the insert animation for the node.
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
   */
  animateInsert(animationHandler) {
    this.setAlpha(0);
    animationHandler.add(
      new AnimFadeIn(this.getCtx(), this, animationHandler.getAnimDur()),
      DvtDiagramDataAnimationPhase.INSERT
    );
  }

  /**
   * Retrieves current state for the node
   * @param {number} zoom optional zoom level for the component
   * @return {Object} object that contains current hovered, selected, focused staed and zoom level for the node
   * @private
   */
  _getState(zoom) {
    return {
      hovered: this._isShowingHoverEffect,
      selected: this.isSelected(),
      focused: this._isShowingKeyboardFocusEffect,
      zoom: zoom ? zoom : this.GetDiagram().getPanZoomCanvas().getZoom(),
      expanded: this.isDisclosed(),
      inActionableMode: this.hasActiveInnerElems
    };
  }

  /**
   * Calls zoom renderer on zoom event if zoom renderer is specified
   * @param {object} event zoom event
   */
  rerenderOnZoom(event) {
    var zoomRenderer = this._getCustomRenderer('zoomRenderer');
    if (zoomRenderer) {
      var prevState = this._getState(event.oldZoom);
      var state = this._getState(event.newZoom);
      this._applyCustomNodeContent(zoomRenderer, state, prevState);
    }
  }

  /**
   * Highlight current node
   * @param {boolean} bHighlight true if the node should be highlighted
   */
  highlight(bHighlight) {
    if (this._isHighlighted !== bHighlight) {
      this._isHighlighted = bHighlight;
      var highlightAlpha = bHighlight
        ? 1.0
        : this._diagram.getOptions()['styleDefaults']['_highlightAlpha'];

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
  }

  /**
   * Sets the label alignments
   * system of the node's container.
   * label object guaranteed to be non-null if this method is called
   * @param {string} halign halign of the node label
   * @param {string} valign valign of the node label
   */
  setLabelAlignments(halign, valign) {
    var isMultiline =
      this._labelObj instanceof MultilineText ||
      this._labelObj instanceof BackgroundMultilineText;
    if (valign == 'baseline')
      valign = isMultiline ? MultilineText.V_ALIGN_TOP : OutputText.V_ALIGN_AUTO;

    this._labelObj.setHorizAlignment(halign);
    this._labelObj.setVertAlignment(valign);
  }

  /**
   * Get the padding of this container.  Values can be retrieved from the
   * returned map using keys 'top', 'left', 'bottom', and 'right'.
   * @return {object}
   */
  getContainerPadding() {
    if (!this._containerPadding && this._getCustomRenderer('renderer')) {
      var zoom = this.GetDiagram().getPanZoomCanvas().getZoom();
      var nodeBoundingRect = this.getElem().getBoundingClientRect();
      var childPaneBoundingRect = this._childNodePane
        ? this._childNodePane.getElem().getBoundingClientRect()
        : null;
      if (childPaneBoundingRect) {
        this._containerPadding = {
          left: (childPaneBoundingRect.left - nodeBoundingRect.left) / zoom,
          right: (nodeBoundingRect.right - childPaneBoundingRect.right) / zoom,
          top: (childPaneBoundingRect.top - nodeBoundingRect.top) / zoom,
          bottom: (nodeBoundingRect.bottom - childPaneBoundingRect.bottom) / zoom
        };
      }
    } else if (!this._containerPadding) {
      var paddingProps = ['padding-left', 'padding-right', 'padding-top', 'padding-bottom'];
      var containerStyleObj = this._data['containerSvgStyle'] || this._data['containerStyle'];
      var styles = DvtDiagramNode._getNodeCSSStyle(
        containerStyleObj,
        this._data['_containerStyle'],
        paddingProps
      );
      this._containerPadding = {
        left: styles.getPadding('padding-left'),
        right: styles.getPadding('padding-right'),
        top: styles.getPadding('padding-top'),
        bottom: styles.getPadding('padding-bottom')
      };
    }
    return this._containerPadding;
  }

  setContainerPadding() {}

  /**
   * Gets child ids for the node
   * @return {array} an array of child ids
   */
  getChildNodeIds() {
    return this._childNodeIds;
  }

  /**
   * Adds id of a child node to the array of child nodes
   * @param {string} id child id
   */
  addChildNodeId(id) {
    if (!this._childNodeIds) this._childNodeIds = [];
    this._childNodeIds.push(id);
  }

  /**
   * Removes id of a child node from the array of child nodes
   * @param {string} id child id
   */
  removeChildNodeId(id) {
    if (this._childNodeIds) {
      ArrayUtils.removeItem(this._childNodeIds, id);
    }
  }

  /**
   * Removes child node
   * @param {DvtDiagramNode} childNode child node
   */
  removeChildNode(childNode) {
    if (childNode) {
      this.removeChildNodeId(childNode.getId());
      this._childNodePane.removeChild(childNode);
    }
  }

  /**
   * Gets visible child nodes for the node
   * @return {array} an array of visible child nodes
   */
  getChildNodes() {
    var childNodes = [];
    var count = this._childNodeIds ? this._childNodeIds.length : -1;
    for (var i = 0; i < count; i++) {
      var child = this.GetDiagram().getNodeById(this._childNodeIds[i]);
      if (child) {
        childNodes.push(child);
      }
    }
    return childNodes;
  }

  /**
   * Sets group id for the node
   * @param {string} id group id for the node
   */
  setGroupId(id) {
    this._groupId = id;
  }

  /**
   * Gets group id for the node
   * @return {string} group id for the node
   */
  getGroupId() {
    return this._groupId;
  }

  /**
   * @protected
   * Gets child node pane for the diagram node
   * @param skipCreation skips childNodePane creation if true
   * @return {dvt.Container} child node pane for the diagram node
   */
  GetChildNodePane(skipCreation) {
    if (!this._childNodePane && !skipCreation) {
      this._childNodePane = new Container(this.getCtx());
      this.addChild(this._childNodePane);
    }
    return this._childNodePane;
  }

  /**
   * Handles container disclosure
   * @param {dvt.MouseEvent} event
   */
  handleDisclosure(event) {
    EventManager.consumeEvent(event);
    this._diagram.setNodeDisclosed(this.getId(), !this.isDisclosed());
  }

  /**
   * Renders container shape
   * @param {Diagram} diagram parent component
   * @param {object} nodeData node data
   * @param {dvt.Container} container parent container
   * @private
   */
  static _renderContainer(diagram, nodeData, container) {
    // TODO: removing container styles for custom elements,
    // since we can't properly support svg style and class name at the moment
    var containerStyleObj = diagram.getCtx().isCustomElement()
      ? null
      : nodeData['containerSvgStyle'] || nodeData['containerStyle'];
    var styleObj = JsonUtils.clone(containerStyleObj);
    var containerProps = [
      CSSStyle.BACKGROUND_COLOR,
      CSSStyle.BORDER_COLOR,
      CSSStyle.BORDER_WIDTH,
      CSSStyle.BORDER_RADIUS
    ];
    //Merge the container style from options and container style from CSS object
    var containerStyle = DvtDiagramNode._getNodeCSSStyle(
      styleObj,
      nodeData['_containerStyle'],
      containerProps
    );

    var fillColor = containerStyle.getStyle(CSSStyle.BACKGROUND_COLOR);
    var borderColor = containerStyle.getStyle(CSSStyle.BORDER_COLOR);
    var borderWidth = CSSStyle.toNumber(containerStyle.getStyle(CSSStyle.BORDER_WIDTH));
    var borderRadius = CSSStyle.toNumber(containerStyle.getStyle(CSSStyle.BORDER_RADIUS));

    var childNodePane = container.GetChildNodePane();
    var padding = container.getContainerPadding();
    childNodePane.setTranslate(padding.left, padding.top);
    var childBounds = childNodePane.getDimensionsWithStroke();
    var containerShape = new Rect(
      diagram.getCtx(),
      0,
      0,
      childBounds.w + padding.left + padding.right,
      childBounds.h + padding.top + padding.bottom
    );
    containerShape.setSolidFill(fillColor);
    if (borderRadius) {
      containerShape.setRx(borderRadius);
      containerShape.setRy(borderRadius);
    }
    if (borderColor) {
      containerShape.setStroke(new Stroke(borderColor, 1, borderWidth));
    }

    //Parse out the CSS properties which are already applied on the DOM
    if (styleObj)
      containerProps.forEach((entry) => {
        delete styleObj[CSSStyle.cssStringToObjectProperty(entry)];
      });
    // Set the style and class attributes for node container
    // TODO: removing container styles for custom elements,
    // since we can't properly support svg style and class name at the moment
    var containerClassName = diagram.getCtx().isCustomElement()
      ? null
      : nodeData['containerSvgClassName'] || nodeData['containerClassName'];
    containerShape.setStyle(styleObj).setClassName(containerClassName);

    container.addChildAt(containerShape, 0);
    container.setSelectionShape(containerShape);
    container._containerShape = containerShape;
  }

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
  static _getNodeCSSStyle(styleObj, styleCSS, properties) {
    var style = new CSSStyle();
    properties.forEach((entry) => {
      var value = null;
      //convert CSS string property to object attribute
      var attribute = CSSStyle.cssStringToObjectProperty(entry);
      if (styleObj && styleObj[attribute] != null) value = styleObj[attribute];
      else if (styleCSS) value = styleCSS.getStyle(entry);
      style.setStyle(entry, value);
    });
    return style;
  }

  /**
   * @private
   * Renders expand or collapse button for the container node
   * @param {Diagram} diagram parent component
   * @param {object} nodeData node data
   * @param {DvtDiagramNode} container parent container
   */
  static _renderContainerButton(diagram, nodeData, container) {
    if (!container.isContainer() || nodeData['showDisclosure'] == 'off') {
      return;
    }
    var context = diagram.getCtx();
    var rtl = Agent.isRightToLeft(context);
    var options = diagram.getOptions();
    var LTR_BUTTON_PATH =
      'M1 0 19 0 A 1 1 0 0 1 19 1 L 1 19 A 1 1 0 0 1 0 19 L 0 1 A 1 1 0 0 1 1 0z';
    var RTL_BUTTON_PATH =
      'M1 0 19 0 A 1 1 0 0 1 20 1 L 20 19 A 1 1 0 0 1 19 19 L 1 1 A 1 1 0 0 1 1 0z';
    var commands = rtl ? RTL_BUTTON_PATH : LTR_BUTTON_PATH;
    var buttonWidth = 20;
    var strokeWidth = 1;
    var background = new Path(context, commands);
    var iconResources = options._resources[container.isDisclosed() ? 'collapse' : 'expand'];
    var iconStyle = ToolkitUtils.getIconStyle(context, iconResources.icon);
    var yPos = iconResources.width / 2 + 1; // Position icon slightly off center to better align with triangle container
    var xPos = rtl ? buttonWidth - yPos : yPos;
    var containerButton = new IconButton(
      diagram.getCtx(),
      'outlined',
      { style: iconStyle, size: iconResources.width, pos: { x: xPos, y: yPos } },
      background,
      null,
      container.handleDisclosure,
      container
    );

    container.addChild(containerButton);
    var contentDims = container.getContentBounds(true);
    if (contentDims) {
      var x = rtl
        ? contentDims.x + contentDims.w - buttonWidth - strokeWidth / 2
        : contentDims.x + strokeWidth / 2;
      var y = contentDims.y + strokeWidth / 2;
      containerButton.setTranslate(x, y);
    }
    container._containerButton = containerButton;
  }

  /**
   * @override
   */
  isDragAvailable() {
    return true;
  }
  /**
   * @override
   */
  getDragTransferable() {
    if (!this._isDraggable()) return null;
    return [this.getId()];
  }

  /**
   * @override
   */
  getDragFeedback() {
    if (this._diagram.getEventManager().LinkCreationStarted) {
      return null;
    }

    // If more than one object is selected, return the displayables of all selected objects
    if (
      this._diagram.isSelectionSupported() &&
      this._diagram.getSelectionHandler().getSelectedCount() > 1
    ) {
      var selection = this._diagram.getSelectionHandler().getSelection();
      var displayables = [];
      for (var i = 0; i < selection.length; i++) {
        displayables.push(selection[i]);
      }
      return displayables;
    }

    return this;
  }

  /**
   * Show drop effect on the node
   */
  ShowDropEffect() {
    if (!this._dropEffect) {
      this._createDropEffect('oj-active-drop');
    }
  }

  /**
   * Show rejected drop effect on the node
   */
  ShowRejectedDropEffect() {
    if (!this._dropEffect) {
      this._createDropEffect('oj-invalid-drop');
    }
  }

  /**
   * Clear drop effect from the node
   */
  ClearDropEffect() {
    if (this._dropEffect) {
      this.removeChild(this._dropEffect);
      this._dropEffect = null;
    }
  }

  /**
   * Create drop effect for the node
   * @param {string} styleClass style class to be applied to the drop effect
   * @private
   */
  _createDropEffect(styleClass) {
    var dropEffectShape;
    // if this is a custom rendered node or disclosed node
    // or a leafnode with background or just an image
    // create a rectangle as a drop effect
    if (
      this._customNodeContent ||
      this.isDisclosed() ||
      this._background ||
      (this._shape && this._shape instanceof ImageMarker)
    ) {
      var contentDims = this.getContentBounds(true);
      if (contentDims) {
        dropEffectShape = new Rect(
          this._diagram.getCtx(),
          contentDims.x,
          contentDims.y,
          contentDims.w,
          contentDims.h
        );
        var borderRadius = this._customNodeContent
          ? null
          : this.isDisclosed()
          ? this._containerShape.getRx()
          : this._background
          ? this._background.getRx()
          : null;
        if (borderRadius) {
          dropEffectShape.setRx(borderRadius);
          dropEffectShape.setRy(borderRadius);
        }
      }
    }
    //otherwise copy node shape
    else if (this._shape && this._shape instanceof SimpleMarker) {
      dropEffectShape = this._shape.copyShape();
    }
    if (dropEffectShape) {
      dropEffectShape.setInvisibleFill();
      dropEffectShape.setClassName(styleClass);
      dropEffectShape.setMouseEnabled(false);
    }
    this.addChild(dropEffectShape);
    this._dropEffect = dropEffectShape;
  }

  /**
   * Sets draggable style class to a draggable node
   * @private
   */
  _setDraggableStyleClass() {
    if (this._diagram.getEventManager().IsDragSupported() && this._isDraggable()) {
      var draggableTopShape = this._customNodeContent
        ? this
        : this.isDisclosed()
        ? this._containerShape
        : this._background
        ? this._background
        : this._shape;
      var el = draggableTopShape.getElem() ? draggableTopShape.getElem() : draggableTopShape;
      ToolkitUtils.addClassName(el, 'oj-draggable');
    }
  }

  /**
   * Checks if the node is draggable
   * @private
   * @return {boolean} true if the node is draggable
   */
  _isDraggable() {
    return this.getData()['draggable'] !== 'off' && this.getData()['draggable'] !== false;
  }

  /**
   * Removes and resets objects for the rendered node to prepare the node for rerendering
   * @param {dvt.Container} saveContainer a temporary container that keeps node content for animation
   * @private
   */
  _cleanUp(saveContainer) {
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
      if (this._nodeContext) {
        this._diagram.getOptions()['_cleanTemplate'](this.getId());
      }
      // reparent child node pane - it is likely to be attached
      // to an element inside of custom content
      if (this._childNodePane) {
        this._childNodePane.setParent(null);
        this.addChild(this._childNodePane);
      }
      if (this._customNodeContent.namespaceURI === ToolkitUtils.SVG_NS) {
        this.getContainerElem().removeChild(this._customNodeContent);
        saveContainer &&
          ToolkitUtils.appendChildElem(
            saveContainer.getContainerElem(),
            this._customNodeContent
          );
      } else if (Array.isArray(this._customNodeContent)) {
        for (var i = 0; i < this._customNodeContent.length; i++) {
          this.getContainerElem().removeChild(this._customNodeContent[i]);
          saveContainer &&
            ToolkitUtils.appendChildElem(
              saveContainer.getContainerElem(),
              this._customNodeContent[i]
            );
        }
      } else if (this._customNodeContent instanceof BaseComponent) {
        this.removeChild(this._customNodeContent);
        saveContainer && saveContainer.addChild(this._customNodeContent);
      }
      this._customNodeContent = null;
    }
    this._contentDims = null;
  }

  /**
   * Returns an object that contains data used to animate node from one state to another
   * @param {boolean} keepOrigContent a flag that indicated that original node content should be preserved for animation
   * @return {object}
   */
  getAnimationState(keepOrigContent) {
    var shape, label, containerShape, state, origContent;
    var contentBounds = this.getContentBounds();
    if (this._shape) {
      shape = {
        centerDimensions: this._shape.getCenterDimensions(),
        fill: this._shape.getFill()
      };
      shape.getCenterDimensions = () => {
        return shape['centerDimensions'];
      };
      shape.getFill = () => {
        return shape['fill'];
      };
    }
    if (this._labelObj) {
      label = { matrix: this._labelObj.getMatrix() };
      label.getMatrix = () => {
        return label['matrix'];
      };
    }
    if (this.isDisclosed() && this._containerShape) {
      containerShape = {
        fill: this._containerShape.getFill(),
        width: this._containerShape.getWidth(),
        height: this._containerShape.getHeight()
      };
      containerShape.getFill = () => {
        return containerShape['fill'];
      };
      containerShape.getWidth = () => {
        return containerShape['width'];
      };
      containerShape.getHeight = () => {
        return containerShape['height'];
      };
    }
    if (keepOrigContent) {
      //move the original node content to a temporary container,
      //that will be used for animation
      origContent = new Container(this.getCtx());
      this._cleanUp(origContent);
      origContent.setTranslate(this.getTranslateX(), this.getTranslateY());
    }
    return {
      partialUpdate: true,
      id: this.getId(),
      disclosed: this.isDisclosed(),
      tx: this.getTranslateX(),
      ty: this.getTranslateY(),
      contentBounds: contentBounds,
      origContent: origContent,
      _shape: shape,
      _labelObj: label,
      _containerShape: containerShape,
      getId: function () {
        return this.id;
      },
      isDisclosed: function () {
        return this.disclosed;
      },
      getTranslateX: function () {
        return this.tx;
      },
      getTranslateY: function () {
        return this.ty;
      },
      getContentBounds: function () {
        return this.contentBounds;
      }
    };
  }

  /**
   * Appends child nodes data to the object
   * @param {array} childNodesData an array of data objects for the node
   * @param {number} index to insert nodes
   */
  appendChildNodesData(childNodesData, index) {
    if (!(this._data['nodes'] instanceof Array)) this._data['nodes'] = [];
    this._data['nodes'] = ArrayUtils.insert(this._data['nodes'], childNodesData, index);
  }

  /**
   * Removes child data objects from the array of child data
   * @param {array} childNodesData nodes data to remove
   */
  removeChildNodesData(childNodesData) {
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
  }

  /**
   * Finds appropriate renderer callback function.
   * Supported renderer types - renderer, selectionRenderer,
   * hoverRenderer, focusRenderer, zoomRenderer.
   *
   * @return {function|null}
   * @private
   */
  _getCustomRenderer(type) {
    var nodeContentOpt = this._diagram.getOptions()['nodeContent'];
    var rendererFunc = null;
    if (nodeContentOpt) {
      var baseRenderer = nodeContentOpt['renderer'];
      rendererFunc = nodeContentOpt[type];
      // we don't support selection/hover/focus renderers without base renderer
      rendererFunc = baseRenderer && rendererFunc ? rendererFunc : null;
    }
    return rendererFunc;
  }

  /**
   * Checks if it is needed to move the contents to the touch event pane of the diagram
   * @returns {boolean} true if the contents are stashed, false otherwise
   */
  _checkAndMoveContents() {
    // No need to move contents when there is no active touch event in this node
    // from the HandleImmediateTouchStartInternal handler method of the DvtDiagramEventManager
    if (!this._hasContentBoundToTouchEvent) {
      return false;
    }
    this.GetDiagram().storeTouchEventContent(this._customNodeContent, this);
    this._contentStoredInTouchEventContainer = this._customNodeContent;

    // Reset the _hasContentBoundToTouchEvent flag since the contents are moved to the touch events pane
    // and this node's content no longer is associated with active touch event
    this._hasContentBoundToTouchEvent = false;

    return true;
  }

  /**
   * @override
   */
  CanOptimizeDimensions() {
    return !this._customNodeContent;
  }

  /**
   * Returns the node displayable (itself).
   *
   * @return {dvt.Displayable} displayable
   */
  getDisplayable() {
    return this;
  }

  /**
   * Sets label rotation angle
   * @param {number} angle angle of label rotation
   */
  setLabelRotationAngle(angle) {
    this._labelRotAngle = angle;
    DvtDiagramNode.PositionLabel(
      this._labelObj,
      this.getLabelPosition(),
      angle,
      this.getLabelRotationPoint()
    );
  }

  /**
   * Gets label rotation angle
   * @return {number} angle of label rotation
   */
  getLabelRotationAngle() {
    return this._labelRotAngle;
  }

  /**
   * Sets label rotation point
   * @param {DvtDiagramPoint} point label rotation point
   */
  setLabelRotationPoint(point) {
    this._labelRotPoint = point;
    DvtDiagramNode.PositionLabel(
      this._labelObj,
      this.getLabelPosition(),
      this.getLabelRotationAngle(),
      point
    );
  }

  /**
   * Gets label rotation point
   * @return {DvtDiagramPoint} label rotation point
   */
  getLabelRotationPoint() {
    return this._labelRotPoint;
  }

  /**
   * Gets node bounds after layout is done
   * @return {dvt.Rectangle} node bounds after layout is done
   * @protected
   */
  GetNodeBounds() {
    var nodeBounds = this.getLayoutBounds(true);
    var bounds = new Rectangle(nodeBounds.x, nodeBounds.y, nodeBounds.w, nodeBounds.h);
    var labelPos = this.getLabelPosition();
    var labelRotAngle = this.getLabelRotationAngle();
    var labelRotPoint = this.getLabelRotationPoint();
    var labelBounds = this.getLabelBounds(true);
    if (labelPos && labelBounds) {
      //take label rotation into account
      if (labelRotAngle != null) {
        labelBounds = DvtDiagramDataUtils.RotateBounds(labelBounds, labelRotAngle, labelRotPoint);
      }
      //label coords are relative to containing node
      bounds.x = Math.min(nodeBounds.x, labelBounds.x + labelPos.x);
      bounds.y = Math.min(nodeBounds.y, labelBounds.y + labelPos.y);
      bounds.w =
        Math.max(nodeBounds.x + nodeBounds.w, labelBounds.x + labelPos.x + labelBounds.w) -
        bounds.x;
      bounds.h =
        Math.max(nodeBounds.y + nodeBounds.h, labelBounds.y + labelPos.y + labelBounds.h) -
        bounds.y;
    }

    return bounds;
  }

  /**
   * @protected
   * Calculate the matrix used to rotate and position the label.
   * @param {dvt.Point} pos position of the link label
   * @param {number} rotAngle rotation angle for the label
   * @param {dvt.Point} rotPoint rotation point for the label
   * @return {dvt.Matrix} matrix used to rotate and position the label
   */
  static CalcLabelMatrix(pos, rotAngle, rotPoint) {
    var mat = new Matrix();
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
  }

  /**
   * Positions node label
   * @param {dvt.OutputText} label node label
   * @param {dvt.Point} pos position of the node label
   * @param {number} rotAngle rotation angle for the label
   * @param {dvt.Point} rotPoint rotation point for the label
   * @protected
   */
  static PositionLabel(label, pos, rotAngle, rotPoint) {
    if (!label) return;
    var mat = DvtDiagramNode.CalcLabelMatrix(pos, rotAngle, rotPoint);
    label.setMatrix(mat);
  }

  /**
   * Sets position of the node
   * @param {number} xx x coordinate for the node
   * @param {number} yy y coordinate for the node
   * @protected
   */
  SetPosition(xx, yy) {
    this.setTranslate(xx, yy);
  }

  /**
   * Gets position of the node
   * @return {dvt.Point} node position
   * @protected
   */
  GetPosition() {
    return new Point(this.getTranslateX(), this.getTranslateY());
  }

  /**
   * @override
   */
  getKeyboardBoundingBox(targetCoordinateSpace) {
    // return the bounding box for the diagram node, in stage coordinates
    // we don't call this.getDimensions(this.getCtx().getStage() because
    // that would take into account any selection/keyboard focus effects.
    // so instead, we get the content bounds of the node and convert that
    // to stage coordinates, based on code in dvt.Displayable.getDimensions()
    if (this._customNodeContent) return this._diagram.getCustomObjKeyboardBoundingBox(this);
    else {
      var bounds = this.getContentBounds(targetCoordinateSpace);
      var stageP1 = this.localToStage(new Point(bounds.x, bounds.y));
      var stageP2 = this.localToStage(new Point(bounds.x + bounds.w, bounds.y + bounds.h));
      return new Rectangle(stageP1.x, stageP1.y, stageP2.x - stageP1.x, stageP2.y - stageP1.y);
    }
  }

  /**
   * @override
   */
  getTargetElem() {
    return this.getElem();
  }

  /**
   * Stores an id of an outgoing link for the node
   * @param {string} id an id for the outgoing link
   */
  addOutLinkId(id) {
    if (!this._outLinkIds) {
      this._outLinkIds = [];
    }
    this._outLinkIds.push(id);
  }

  /**
   * Removes an id of the outgoing link
   * @param {string} id an id for the outgoing link
   */
  removeOutLinkId(id) {
    if (this._outLinkIds) {
      var idx = this._outLinkIds.indexOf(id);
      if (idx != -1) {
        this._outLinkIds.splice(idx, 1);
      }
    }
  }

  /**
   * Gets ids of outgoing links for the node
   * @return {array} ids of outgoing links for the node
   */
  getOutLinkIds() {
    return this._outLinkIds;
  }

  /**
   * Stores an id of an incoming link for the node
   * @param {string} id an id for the incoming link
   */
  addInLinkId(id) {
    if (!this._inLinkIds) {
      this._inLinkIds = [];
    }
    this._inLinkIds.push(id);
  }

  /**
   * Removes an id of the incoming link
   * @param {string} id an id for the incoming link
   */
  removeInLinkId(id) {
    if (this._inLinkIds) {
      var idx = this._inLinkIds.indexOf(id);
      if (idx != -1) {
        this._inLinkIds.splice(idx, 1);
      }
    }
  }

  /**
   * Gets ids of incoming links for the node
   * @return {array} ids of incoming links for the node
   */
  getInLinkIds() {
    return this._inLinkIds;
  }
}

/**
 * Event Manager for Diagram.
 * @param {dvt.Context} context The platform specific context object
 * @param {function} callback A function that responds to component events
 * @param {Diagram} callbackObj diagram component instance that the callback function is defined on
 * @class
 * @extends {dvt.EventManager}
 * @constructor
 */
class DvtDiagramEventManager extends EventManager {
  constructor(context, callback, callbackObj) {
    super(context, callback, callbackObj, callbackObj);
    this._linkDragSelector = null;
    this._linkDropSelector = null;
    this._prevRolloverEvent = null;
    this.OJ_ACTIVE_DROP = 'oj-active-drop';
    this.OJ_INVALID_DROP = 'oj-invalid-drop';
  }

  /**
   * @override
   */
  addListeners(displayable) {
    super.addListeners(displayable);
    this._component.addEvtListener('focusout', this._handleFocusout, false, this);
    this._component.addEvtListener('focusin', this._handleFocusin, false, this);
  }

  /**
   * @override
   */
  RemoveListeners(displayable) {
    super.RemoveListeners(displayable);
    this._component.removeEvtListener('focusout', this._handleFocusout, false, this);
    this._component.removeEvtListener('focusin', this._handleFocusin, false, this);
    this._clearOpenPopupListeners();
  }

  /**
   * Clears any pending focusout timeout.
   * @private
   */
  _clearFocusoutTimeout() {
    if (this._focusoutTimeout) {
      clearTimeout(this._focusoutTimeout);
      this._focusoutTimeout = null;
    }
  }
  /**
   * @private
   */
  _clearOpenPopupListeners() {
    if (this._openPopup != null) {
      this._openPopup.removeEventListener('focusin', this._handlePopupFocusinListener);
      this._openPopup.removeEventListener('focusout', this._handlePopupFocusoutListener);
      this._openPopup = null;
    }
    this._handlePopupFocusinListener = null;
    this._handlePopupFocusoutListener = null;
  }

  /**
   * @private
   */
  _handlePopupFocusout(event) {
    this._handleFocusout(event, true);
  }

  /**
   * @private
   */
  _handlePopupFocusin(event) {
    this._handleFocusin(event, true);
  }

  /**
   * @private
   */
  _handleFocusout(event, isPopupFocusout) {
    this._clearFocusoutTimeout();

    if (!isPopupFocusout) {
      // Components that open popups (such as ojSelect, ojCombobox, ojInputDate, etc.) will trigger
      // focusout, but we don't want to change mode in those cases since the user is still editing.
      this._clearOpenPopupListeners();
      var openPopup = getLogicalChildPopup(this._component.getElem());
      if (openPopup != null) {
        // setup focus listeners on popup
        this._openPopup = openPopup;
        this._handlePopupFocusinListener = this._handlePopupFocusin.bind(this);
        this._handlePopupFocusoutListener = this._handlePopupFocusout.bind(this);
        openPopup.addEventListener('focusin', this._handlePopupFocusinListener);
        openPopup.addEventListener('focusout', this._handlePopupFocusoutListener);
        return;
      }
    }

    // set timeout to stay in editable/actionable mode if focus comes back into the diagram
    // prettier-ignore
    this._focusoutTimeout = setTimeout( // @HTMLUpdateOK
      function () {
        var keyboardUtils = this._component.getOptions()._keyboardUtils;
        if (this._component.activeInnerElemsItemId) {
          const activeItem =
            this._component.getNodeById(this._component.activeInnerElemsItemId) ||
            this._component.getLinkById(this._component.activeInnerElemsItemId);
          keyboardUtils.disableAllFocusable(activeItem.getElem());
          activeItem.hasActiveInnerElems = false;
          this._component.activeInnerElems = null;
          this._component.activeInnerElemsItemId = null;
        }
      }.bind(this),
      100
    );
  }

  /**
   * @private
   */
  _handleFocusin(event, isPopupFocusin) {
    // reset focusout timeout and busy state
    this._clearFocusoutTimeout();

    if (!isPopupFocusin) {
      this._clearOpenPopupListeners();
    }
  }

  /**
   * Shows the keyboard focus effects wich includes tooltip, for a keyboard navigable object.
   * @param {dvt.KeyboardEvent} event The keyboard event
   * @param {DvtKeyboardNavigable} navigable The keyboard navigable to show focus effect for
   */
  showFocusEffect(event, navigable) {
    this.ShowFocusEffect(event, navigable);
  }
  /**
   * @override
   */
  ShowFocusEffect(event, obj) {
    if (!this._component.isPanning()) super.ShowFocusEffect(event, obj);
  }

  /**
   * @override
   */
  ProcessRolloverEvent(event, obj, bOver) {
    // Don't continue if not enabled
    var options = this._component.getOptions();
    if (options['hoverBehavior'] != 'dim') return;
    // prevent a problem processing highlight over and over for the same object
    // which happens on FF after reparenting a highlighted node for flat diagram
    if (
      this._prevRolloverEvent &&
      this._prevRolloverEvent.obj === obj &&
      this._prevRolloverEvent.bOver === bOver
    )
      return;

    // Compute the new highlighted categories and update the options
    var categories = obj.getCategories ? obj.getCategories() : [];
    options['highlightedCategories'] = bOver ? categories.slice() : null;

    var rolloverEvent = EventFactory.newCategoryHighlightEvent(
      options['highlightedCategories'],
      bOver
    );
    var hoverBehaviorDelay = CSSStyle.getTimeMilliseconds(
      options['styleDefaults']['hoverBehaviorDelay']
    );
    this.RolloverHandler.processEvent(
      rolloverEvent,
      this._component.GetAllNodeObjects(),
      hoverBehaviorDelay,
      options['highlightMatch'] == 'any'
    );
    this._prevRolloverEvent = { obj: obj, bOver: bOver };
  }

  /**
   * @override
   */
  CreateCategoryRolloverHandler(callback, callbackObj) {
    return new DvtDiagramCategoryRolloverHandler(callback, callbackObj);
  }

  /**
   * @override
   */
  ProcessKeyboardEvent(event) {
    var eventConsumed = true;
    var keyCode = event.keyCode;
    var focusObj = this.getFocus();
    var focusDisp = focusObj instanceof DvtDiagramNode ? focusObj._customNodeContent : null;

    // Mashup
    if (focusDisp && keyCode != KeyboardEvent.TAB && this._bPassOnEvent) {
      focusDisp.fireKeyboardListener(event);
      event.preventDefault();
    } // Mashups
    else if (keyCode == KeyboardEvent.TAB && focusDisp instanceof BaseComponent) {
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
        if (this._bPassOnEvent) focusObj.showKeyboardFocusEffect(); // checked by superclass to tab out of component
        eventConsumed = super.ProcessKeyboardEvent(event);
        this._bPassOnEvent = false;
      }
    } else if (keyCode == KeyboardEvent.SPACE && event.ctrlKey && event.shiftKey) {
      if (focusObj && focusObj.HandleKeyboardEvent) {
        focusObj.HandleKeyboardEvent(event);
      }
    } else if (
      (keyCode == KeyboardEvent.ZERO || keyCode == KeyboardEvent.NUMPAD_ZERO) &&
      event.ctrlKey &&
      event.altKey
    ) {
      if (focusObj) {
        var pzc = this._component.getPanZoomCanvas();
        var stageDims = focusObj.getKeyboardBoundingBox(this.getCtx().getStage());
        var localPos1 = pzc.getContentPane().stageToLocal({ x: stageDims.x, y: stageDims.y });
        var localPos2 = pzc
          .getContentPane()
          .stageToLocal({ x: stageDims.x + stageDims.w, y: stageDims.y + stageDims.h });
        var finBounds = {
          x: localPos1.x,
          y: localPos1.y,
          w: localPos2.x - localPos1.x,
          h: localPos2.y - localPos1.y
        };

        var animator =
          DvtDiagramStyleUtils.getAnimOnDataChange(this._component) != 'none'
            ? new Animator(this.getCtx(), this._component.getAnimDur())
            : null;
        pzc.zoomToFit(animator, finBounds);
        animator && animator.play();
      }
    } else {
      if (keyCode == KeyboardEvent.TAB && focusObj) {
        // If there are activeElems, tab between them
        var activeInnerSize = this._component.activeInnerElems
          ? this._component.activeInnerElems.length
          : undefined;
        if (activeInnerSize) {
          var testElement = event.shiftKey
            ? this._component.activeInnerElems[0]
            : this._component.activeInnerElems[activeInnerSize - 1];
          // Want to prevent the tab focus from leaving the focusable elements within the node/link
          if (testElement === document.activeElement) {
            if (event.shiftKey) {
              this._component.activeInnerElems[activeInnerSize - 1].focus();
            } else {
              this._component.activeInnerElems[0].focus();
            }
            event.preventDefault();
          }
          return eventConsumed;
        }
        this._component.ensureObjInViewport(event, focusObj);
        var keyboardUtils = this._component.Options._keyboardUtils;
        keyboardUtils.disableAllFocusable(this._component.getNodesPane().getElem(), true);
        keyboardUtils.disableAllFocusable(this._component.getLinksPane().getElem(), true);
      }
      eventConsumed = super.ProcessKeyboardEvent(event);
    }
    return eventConsumed;
  }

  /**
   * @override
   */
  GetTouchResponse() {
    var options = this._component.getOptions();
    if (options['panning'] !== 'none' || options['zooming'] !== 'none')
      return EventManager.TOUCH_RESPONSE_TOUCH_HOLD;
    else if (options['touchResponse'] === EventManager.TOUCH_RESPONSE_TOUCH_START)
      return EventManager.TOUCH_RESPONSE_TOUCH_START;
    return EventManager.TOUCH_RESPONSE_AUTO;
  }

  /**
   * @override
   */
  HandleTouchClickInternal(event) {
    return this.GetEventInfo(event, 'panned');
  }

  /**
   * @override
   */
  StoreInfoByEventType(key) {
    if (key == 'panned') {
      return false;
    }
    return super.StoreInfoByEventType(key);
  }

  // Drag & Drop Support
  /**
   * @override
   */
  isDndSupported() {
    return true;
  }

  /**
   * @override
   */
  GetDragSourceType(event) {
    var obj = this.DragSource.getDragObject();
    if (obj && obj.__dragType) return obj.__dragType;

    if (obj instanceof DvtDiagramNode) {
      if (this._linkDragSelector === null) {
        this._linkDragSelector = this._component.getOptions()['dnd']['drag']['ports']['selector'];
      }
      var dragPort;
      if (this._linkDragSelector) {
        dragPort = this._getPortElement(
          document.elementFromPoint(event.getNativeEvent().clientX, event.getNativeEvent().clientY),
          this._linkDragSelector
        );
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
  }

  /**
   * @override
   */
  GetDragDataContexts(bSanitize) {
    var obj = this.DragSource.getDragObject();
    var contexts = [];
    var context;
    if (
      this._component.isSelectionSupported() &&
      this._component.getSelectionHandler().getSelectedCount() > 1
    ) {
      var selection = this._component.getSelectionHandler().getSelection();
      var contentPosition = this._getTopLeftContentCorner(selection);
      var zoom = this._component.getPanZoomCanvas().getZoom();
      for (var i = 0; i < selection.length; i++) {
        if (selection[i] instanceof DvtDiagramNode) {
          //don't drag links yet
          context = selection[i].getDataContext();
          var bounds = selection[i].getDimensions(this._context.getStage());
          context['nodeOffset'] = new Point(
            (bounds.x - contentPosition.x) / zoom,
            (bounds.y - contentPosition.y) / zoom
          );
          if (bSanitize) ToolkitUtils.cleanDragDataContext(context);
          contexts.push(context);
        }
      }
    } else if (obj instanceof DvtDiagramNode) {
      context = obj.getDataContext();
      if (bSanitize) ToolkitUtils.cleanDragDataContext(context);
      if (obj.__dragType === 'ports' && obj.__dragPort) {
        return bSanitize
          ? { dataContext: context }
          : { dataContext: context, portElement: obj.__dragPort };
      }
      context['nodeOffset'] = new Point(0, 0);
      contexts.push(context);
    }
    return contexts;
  }

  /**
   * @override
   */
  GetDropOffset(event) {
    var contentPosition;
    if (
      this._component.isSelectionSupported() &&
      this._component.getSelectionHandler().getSelectedCount() > 1
    ) {
      contentPosition = this._getTopLeftContentCorner(
        this._component.getSelectionHandler().getSelection()
      );
    } else {
      var obj = this.DragSource.getDragObject();
      if (obj instanceof DvtDiagramNode) {
        contentPosition = obj.getDimensions(this._context.getStage());
      }
    }
    if (contentPosition) {
      var relPos = this._context.pageToStageCoords(event.pageX, event.pageY);
      var zoom = this._component.getPanZoomCanvas().getZoom();
      return new Point(
        (contentPosition.x - relPos.x) / zoom,
        (contentPosition.y - relPos.y) / zoom
      );
    }
    return null;
  }

  /**
   * @private
   * Gets top left corner of the bounding rectangle of the selected nodes relative to stage
   * @param {array} selection the current selection
   * @return {dvt.Point} position of the top left corner
   */
  _getTopLeftContentCorner(selection) {
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
    return new Point(minX, minY);
  }

  /**
   * @override
   */
  OnDndDragStart(event) {
    //clean up from previous internal drags
    //can't be done on dragend, since it is not always called
    var dragObj = this.DragSource.getDragObject();
    if (dragObj && dragObj.__dragType) {
      dragObj.__dragType = null;
      dragObj.__dragPort = null;
    }
    this.LinkCreationStarted = false;
    super.OnDndDragStart(event);
  }

  /**
   * @override
   */
  OnDndDragOver(event) {
    super.OnDndDragOver(event);
    if (this.LinkCreationStarted) {
      this._component.ShowLinkCreationFeedback(event);
    }
  }

  /**
   * @override
   */
  OnDndDragEnd(event) {
    super.OnDndDragEnd(event);

    if (this.LinkCreationStarted) {
      this._component.HideLinkCreationFeedback();
      this.LinkCreationStarted = false;
    }

    //reenabling panning on dragend and on mouseup
    //the panning is disabled on mousedown event to prevent panning for potential node drag
    //if the node was not dragged, the component will not get dragend event and the panning is reenabled on mouseup
    //if the node was dragged, the component will get dragend event, but it might not get mouseup event
    this._component.getPanZoomCanvas().panZoomEnd(); //done to reset the state and prevent panBy on mousemove
    this._setPanningEnabled(true);
  }

  /**
   * Updates PanZoomCanvas setting for panning, if panning is enabled for the diagram
   * The method is called to prevent diagram panning during drag operation
   * @param {boolean} bEnablePanning true to enable panning
   * @private
   */
  _setPanningEnabled(bEnablePanning) {
    if (this._component.IsPanningEnabled())
      this._component.getPanZoomCanvas().setPanningEnabled(bEnablePanning);
  }

  /**
   * Helper function that check if the nodes could be dragged from the diagram
   * @return {boolean} true if the nodes could be dragged from the diagram
   * @protected
   */
  IsDragSupported() {
    if (!this._isDragSupported) {
      var options = this._component.getOptions();
      this._isDragSupported =
        this.isDndSupported() &&
        (options['dnd']['drag']['nodes']['dataTypes'] ||
          options['dnd']['drag']['ports']['dataTypes']);
    }
    return this._isDragSupported;
  }

  /**
   * @override
   */
  OnMouseDown(event) {
    var obj = this.GetLogicalObject(event.target);
    if (this.IsDragSupported() && obj instanceof DvtDiagramNode) {
      this._setPanningEnabled(false);
    }
    super.OnMouseDown(event);
  }

  /**
   * @override
   */
  OnMouseUp(event) {
    //reenabling panning on dragend and on mouseup
    //the panning is disabled on mousedown event to prevent panning for potential node drag
    //if the node was not dragged, the component will not get dragend event and the panning is reenabled on mouseup
    //if the node was dragged, the component will get dragend event, but it might not get mouseup event
    super.OnMouseUp(event);
    this._setPanningEnabled(true);
  }

  /**
   * @override
   */
  HandleImmediateTouchStartInternal(event) {
    var obj = this.GetLogicalObject(event.target);
    if (this.IsDragSupported() && event.targetTouches.length == 1) {
      if (obj instanceof DvtDiagramNode) {
        this._setPanningEnabled(false);
      }
    }
    if (obj instanceof DvtDiagramNode || obj instanceof DvtDiagramLink) {
      obj.handleTouchStart();
    }
    this._component.handleTouchStart();
  }

  /**
   * @override
   */
  HandleImmediateTouchEndInternal(event) {
    var obj = this.GetLogicalObject(event.target);
    if (this.IsDragSupported()) {
      this._setPanningEnabled(true);
    }
    if (obj instanceof DvtDiagramNode || obj instanceof DvtDiagramLink) {
      obj.handleTouchEnd();
    }
    this._component.handleTouchEnd();
  }

  /**
   * @override
   */
  GetDropTargetType(event) {
    var obj = this.GetLogicalObject(event.target);
    this._component.getCache().putToCache('dropTarget', obj);
    if (!obj) {
      return 'background';
    } else if (obj instanceof DvtDiagramNode) {
      var dropPort;
      if (this._linkDropSelector === null) {
        this._linkDropSelector = this._component.getOptions()['dnd']['drop']['ports']['selector'];
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
  }

  /**
   * @override
   */
  GetDropEventPayload(event) {
    // Apply the drop offset if the drag source is a DVT component
    // NOTE: The drop offset is stored in dataTransfer, so it's only accessible from "drop" event. It can't be
    //       accessed from "dragEnter", "dragOver", and "dragLeave".
    var dataTransfer = event.getNativeEvent().dataTransfer;
    var offsetX = Number(dataTransfer.getData(EventManager.DROP_OFFSET_X_DATA_TYPE)) || 0;
    var offsetY = Number(dataTransfer.getData(EventManager.DROP_OFFSET_Y_DATA_TYPE)) || 0;

    //point relative to content pane
    var relPos = this._component
      .getPanZoomCanvas()
      .getContentPane()
      .stageToLocal(this.getCtx().pageToStageCoords(event.pageX, event.pageY));
    var layoutOffset = this._component.getLayoutOffset();

    var payload = {
      x: relPos.x - layoutOffset.x + offsetX,
      y: relPos.y - layoutOffset.y + offsetY
    };
    //add node or link context if drop accepted by the node or link
    var obj = this.GetLogicalObject(event.target);
    if (obj instanceof DvtDiagramNode) {
      if (obj.__dropPort) {
        payload['dataContext'] = obj.getDataContext();
        payload['portElement'] = obj.__dropPort;
      } else {
        payload['nodeContext'] = obj.getDataContext();
      }
      var bounds = obj.getDimensions(this._context.getStage());
      var relNodePos = bounds
        ? this._component
            .getPanZoomCanvas()
            .getContentPane()
            .stageToLocal({ x: bounds.x, y: bounds.y })
        : null;
      payload['nodeX'] = relNodePos ? relPos.x - relNodePos.x + offsetX : null;
      payload['nodeY'] = relNodePos ? relPos.y - relNodePos.y + offsetY : null;
    } else if (obj instanceof DvtDiagramLink) {
      payload['linkContext'] = obj.getDataContext();
    }
    return payload;
  }

  /**
   * @override
   */
  ShowDropEffect(event) {
    var dropTargetType = this.GetDropTargetType(event);
    var obj = this._component.getCache().getFromCache('dropTarget');
    if (dropTargetType === 'background') {
      var background = this._component.getPanZoomCanvas().getBackgroundPane();
      background.setClassName(this.OJ_ACTIVE_DROP);
    } else if (dropTargetType === 'nodes' || dropTargetType === 'links') {
      if (obj && obj.ShowDropEffect) {
        obj.ShowDropEffect();
      }
    } else if (obj && dropTargetType === 'ports' && obj.__dropPort) {
      ToolkitUtils.addClassName(obj.__dropPort, this.OJ_ACTIVE_DROP);
    }
  }

  /**
   * @override
   */
  ShowRejectedDropEffect(event) {
    var dropTargetType = this.GetDropTargetType(event);
    var obj = this._component.getCache().getFromCache('dropTarget');
    if (dropTargetType === 'background') {
      var background = this._component.getPanZoomCanvas().getBackgroundPane();
      background.setClassName(this.OJ_INVALID_DROP);
    } else if (dropTargetType === 'nodes' || dropTargetType === 'links') {
      if (obj && obj.ShowRejectedDropEffect) {
        obj.ShowRejectedDropEffect();
      }
    } else if (obj && dropTargetType === 'ports' && obj.__dropPort) {
      ToolkitUtils.addClassName(obj.__dropPort, this.OJ_INVALID_DROP);
    }
  }

  /**
   * @override
   */
  ClearDropEffect() {
    var background = this._component.getPanZoomCanvas().getBackgroundPane();
    background.setClassName(null);
    var obj = this._component.getCache().getFromCache('dropTarget');
    if (obj && obj.ClearDropEffect) {
      obj.ClearDropEffect();
    }
    if (obj && obj.__dropPort) {
      ToolkitUtils.removeClassName(obj.__dropPort, this.OJ_ACTIVE_DROP);
      ToolkitUtils.removeClassName(obj.__dropPort, this.OJ_INVALID_DROP);
    }
    this._component.getCache().putToCache('dropTarget', null);
  }

  /**
   * @private
   * Helper method for finding DOM element representing a port using selector and event target
   * @param {object} elem DOM element
   * @param {string} selector
   * @return {object} DOM element
   */
  _getPortElement(elem, selector) {
    return elem && elem.closest ? elem.closest(selector) : null;
  }
}

/**
 *  @constructor
 *  @class DvtDiagramKeyboardHandler base class for keyboard handler for diagram component
 *  @param {Diagram} component The owning diagram component
 *  @param {dvt.EventManager} manager The owning dvt.EventManager
 *  @extends {PanZoomCanvasKeyboardHandler}
 */
class DvtDiagramKeyboardHandler extends PanZoomCanvasKeyboardHandler {
  constructor(component, manager) {
    super(component, manager);
    this._diagram = component;
    this._OUTGOING = 0;
    this._INGOING = 1;
  }

  /**
   * @override
   */
  isNavigationEvent(event) {
    var retVal = false;
    switch (event.keyCode) {
      case KeyboardEvent.OPEN_BRACKET:
      case KeyboardEvent.CLOSE_BRACKET:
        retVal = true;
        break;
      case KeyboardEvent.OPEN_ANGLED_BRACKET:
      case KeyboardEvent.CLOSE_ANGLED_BRACKET:
        retVal = event.altKey ? true : false;
        break;
      default:
        retVal = super.isNavigationEvent(event);
    }
    return retVal;
  }

  /**
   * @override
   */
  processKeyDown(event) {
    var keyCode = event.keyCode;
    var diagram = this.GetDiagram();
    var keyboardUtils = diagram.getOptions()._keyboardUtils;
    var currentNavigable = this._eventManager.getFocus();
    const isActionableMode = diagram.activeInnerElems;
    // If an element has appeared since the last render, should disable it
    if (!isActionableMode && currentNavigable) {
      keyboardUtils.disableAllFocusable(currentNavigable.getElem());
    }
    if (keyCode == KeyboardEvent.TAB) {
      if (currentNavigable) {
        EventManager.consumeEvent(event);
        return currentNavigable;
      } else {
        // navigate to the default
        var arNodes = diagram.GetRootNodeObjects();
        if (arNodes.length > 0) {
          EventManager.consumeEvent(event);
          var navigable = this.getDefaultNavigable(arNodes);
          this.GetDiagram().ensureObjInViewport(event, navigable);
          return navigable;
        }
      }
    } else if (!isActionableMode && keyCode == KeyboardEvent.F2 && currentNavigable) {
      // navigating inside using F2
      this._eventManager.hideTooltip();
      var enabled = keyboardUtils.enableAllFocusable(currentNavigable.getElem());
      if (
        currentNavigable instanceof DvtDiagramNode &&
        currentNavigable.isDisclosed() &&
        currentNavigable.GetChildNodePane(true)
      ) {
        keyboardUtils.disableAllFocusable(currentNavigable.GetChildNodePane().getElem());
        enabled = Array.from(enabled);
        enabled = enabled.filter((item) => item.tabIndex !== -1);
      }
      if (enabled.length > 0) {
        diagram.activeInnerElems = enabled;
        currentNavigable.hasActiveInnerElems = true;
        diagram.activeInnerElemsItemId = currentNavigable.getId();
        enabled[0].focus();
      }
    } else if (
      isActionableMode &&
      currentNavigable &&
      (keyCode == KeyboardEvent.ESCAPE || event.keyCode === KeyboardEvent.F2)
    ) {
      // navigating outside using Esc or F2
      diagram.activeInnerElems = null;
      keyboardUtils.disableAllFocusable(currentNavigable.getElem());
      currentNavigable.hasActiveInnerElems = false;

      diagram._context._parentDiv.focus();
      this._eventManager.ShowFocusEffect(event, currentNavigable);
      this._eventManager.ProcessRolloverEvent(event, currentNavigable, true);
      event.preventDefault();
      event.stopPropagation();
    }
    return super.processKeyDown(event);
  }

  /**
   * Finds first visible container for the node by the node's id. It cound be a node itself if the node is visible.
   * @param {string} nodeId node id
   * @return {DvtDiagramNode} a visible node - the node itself or its container
   * @protected
   */
  GetVisibleNode(nodeId) {
    return this.GetDiagram().getNodeById(nodeId);
  }

  /**
   * Gets parent diagram
   * @return {DvtDiagram} parent diagram
   * @protected
   */
  GetDiagram() {
    return this._diagram;
  }

  /**
   * @override
   */
  isSelectionEvent(event) {
    if (event.keyCode == KeyboardEvent.TAB) return false;
    else return this.isNavigationEvent(event) && !event.ctrlKey;
  }

  /**
   * @override
   */
  isMultiSelectEvent(event) {
    return event.keyCode == KeyboardEvent.SPACE && event.ctrlKey;
  }

  /**
   * Get first navigable link
   * @param {DvtDiagramNode} node node for which links are analyzed
   * @param {dvt.KeyboardEvent} event keyboard event
   * @param {array} listOfLinks array of links for the node
   * @return {DvtDiagramLink} first navigable link
   */
  getFirstNavigableLink(node, event, listOfLinks) {
    var direction = event.keyCode;
    if (!listOfLinks || listOfLinks.length < 1 || !node) return null;
    var link = listOfLinks[0];
    var nodeBB = node.getKeyboardBoundingBox();
    var nodeCenterX = nodeBB.x + nodeBB.w / 2;
    for (var i = 0; i < listOfLinks.length; i++) {
      var object = listOfLinks[i];
      var linkBB = object.getKeyboardBoundingBox();
      var linkCenterX = linkBB.x + linkBB.w / 2;
      if (
        (direction == KeyboardEvent.OPEN_ANGLED_BRACKET && linkCenterX <= nodeCenterX) ||
        (direction == KeyboardEvent.CLOSE_ANGLED_BRACKET && linkCenterX >= nodeCenterX)
      ) {
        link = object;
        break;
      }
    }
    return link;
  }

  /**
   * Get next navigavle link depending on direction - clockwise or conter clockwise.
   * The decision is made based on location of nodes centers rather than link paths or link angles.
   * @param {DvtDiagramNode} node the node for which links are analyzed
   * @param {DvtDiagramLink} currentLink the link in focus
   * @param {dvt.KeyboardEvent} event the keyboard event
   * @param {array} listOfLinks the array of links for the node
   * @return {DvtDiagramLink} next navigable link
   */
  getNextNavigableLink(node, currentLink, event, listOfLinks) {
    if (!listOfLinks) return null;

    if (!currentLink) return listOfLinks[0];

    if (!node) return currentLink;
    this._addSortingAttributes(node, listOfLinks);
    listOfLinks.sort(this._getLinkComparator());
    this._removeSortingAttributes(listOfLinks);
    //clockwise direction
    var bForward = event.keyCode == KeyboardEvent.DOWN_ARROW ? true : false;
    var index = 0;
    for (var i = 0; i < listOfLinks.length; i++) {
      var link = listOfLinks[i];
      if (link === currentLink) {
        if (bForward) index = i == listOfLinks.length - 1 ? 0 : i + 1;
        else index = i == 0 ? listOfLinks.length - 1 : i - 1;
        break;
      }
    }
    return listOfLinks[index];
  }

  /**
   * Get clockwise angle for the link using given node as a center
   * @param {DvtDiagramNode} node node as a center
   * @param {DvtDiagramLink} link link to be checked
   * @return {number} an link angle from 0 to 2*PI
   * @private
   */
  _getClockwiseAngle(node, link) {
    //find opposite node
    var startNode = this.GetVisibleNode(
      link.getStartId ? link.getStartId() : link.getData().getStartId()
    );
    var endNode = this.GetVisibleNode(link.getEndId ? link.getEndId() : link.getData().getEndId());
    var oppositeNode = node == startNode ? endNode : startNode;

    var p1 = this._getNodeCenter(node);
    var p2 = this._getNodeCenter(oppositeNode);
    var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    angle = angle < 0 ? angle + Math.PI * 2 : angle;
    return angle;
  }

  /**
   * Get node center
   * @param {DvtDiagramNode} node diagram node
   * @return {dvt.Point} node center
   * @private
   */
  _getNodeCenter(node) {
    var nodeBB = node.getKeyboardBoundingBox();
    return new Point(nodeBB.x + nodeBB.w / 2, nodeBB.y + nodeBB.h / 2);
  }

  /**
   * Get distance between start and end nodes for the given link
   * @param {DvtDiagramLink} link a link
   * @return {number} the distance between nodes
   * @private
   */
  _getNodesDistance(link) {
    var startNode = this.GetVisibleNode(
      link.getStartId ? link.getStartId() : link.getData().getStartId()
    );
    var endNode = this.GetVisibleNode(link.getEndId ? link.getEndId() : link.getData().getEndId());
    var p1 = this._getNodeCenter(startNode);
    var p2 = this._getNodeCenter(endNode);
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  /**
   * Get link direction for the given node
   * @param {DvtDiagramNode} node a node
   * @param {DvtDiagramLink} link a link connected to the given node
   * @return {number} a link direction - this._INGOING or this._OUTGOING
   * @private
   */
  _getLinkDirection(node, link) {
    if (node == this.GetVisibleNode(link.getEndId ? link.getEndId() : link.getData().getEndId()))
      return this._INGOING;
    else return this._OUTGOING;
  }

  /**
   * Get function that compares two link around a given node
   * The links are analyzed by angle, distance from the node and direction. The sorting attributes are added to the links before sorting.
   * @return {function} a function that compares to links around the node
   * @private
   */
  _getLinkComparator() {
    return (link1, link2) => {
      var linkAngle1 = link1.__angle;
      var linkAngle2 = link2.__angle;
      var res = -1;

      if (
        !DvtDiagramKeyboardHandler._anglesAreEqualWithinTolerance(linkAngle1, linkAngle2) &&
        linkAngle1 > linkAngle2
      ) {
        res = 1;
      } else if (DvtDiagramKeyboardHandler._anglesAreEqualWithinTolerance(linkAngle1, linkAngle2)) {
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
  }

  /**
   * Utility method that removes sorting attributes from each link in the array
   * @param {array} listOfLinks array of links
   * @private
   */
  _removeSortingAttributes(listOfLinks) {
    for (var i = 0; i < listOfLinks.length; i++) {
      var link = listOfLinks[i];
      link.__angle = undefined;
      link.__distance = undefined;
      link.__direction = undefined;
    }
  }

  /**
   * Utility method that adds sorting attributes to each link in the array
   * @param {DvtDiagramNode} node the node
   * @param {array} listOfLinks array of links
   * @private
   */
  _addSortingAttributes(node, listOfLinks) {
    for (var i = 0; i < listOfLinks.length; i++) {
      var link = listOfLinks[i];
      link.__angle = this._getClockwiseAngle(node, link);
      link.__distance = this._getNodesDistance(link);
      link.__direction = this._getLinkDirection(node, link);
    }
  }

  /**
   * Utility method to check if two angles are equal, within a small tolerance. Used to account for small rounding errors
   * @param {number} a1 first angle to compare
   * @param {number} a2 second angle to compare
   * @return  {boolean} true if angles are equal
   * @private
   */
  static _anglesAreEqualWithinTolerance(a1, a2) {
    var res = Math.abs(a1 - a2) <= 0.0000001;
    if (!res) {
      res = Math.abs(Math.PI * 2 + Math.min(a1, a2) - Math.max(a1, a2)) <= 0.0000001;
    }
    return res;
  }
}

/**
 * Utility functions for Diagram overview window
 * @class
 */
const DvtDiagramOverviewUtils = {
  /**
   * @protected
   * Calculates the overview window viewport from a pan zoom canvas matrix
   * @param {Diagram} diagram the parent diagram component
   */
  CalcViewportFromMatrix: (diagram) => {
    var contentMatrix = diagram.getPanZoomCanvas().getContentPaneMatrix();
    var defViewport = new Rectangle(0, 0, diagram.getWidth(), diagram.getHeight());
    var dx = contentMatrix.getTx();
    var dy = contentMatrix.getTy();
    var dz = contentMatrix.getA();
    var newX = defViewport.x - dx / dz;
    var newY = defViewport.y - dy / dz;
    var newWidth = defViewport.w / dz;
    var newHeight = defViewport.h / dz;
    return new Rectangle(newX, newY, newWidth, newHeight);
  },

  /**
   * @protected
   * Configures the overview window instance for the diagram
   * @param {Diagram} diagram the parent diagram component
   * @param {Overview} overview the overview window
   */
  ConfigureOverviewWindow: (diagram, overview) => {
    var ovContainer = new Container(diagram.getCtx());
    ovContainer.addChild(overview);
    diagram.addChild(ovContainer);
    overview.render();
    DvtDiagramOverviewUtils._positionOverviewWindow(diagram, overview);
    var ovWidth = overview.getOverviewWidth();
    var ovHeight = overview.getOverviewHeight();
    var clipPath = new ClipPath(diagram.getId() + 'dgr_ovClip');
    // give clip path an extra space
    clipPath.addRect(overview.getTranslateX(), overview.getTranslateY(), ovWidth, ovHeight);
    overview.setClipPath(clipPath);
    overview.UpdateViewport();

    // place a rectangle on top of the overview window to show overview boundaries,
    // when viewport is larger than overview
    var styleMap = diagram.Options.styleDefaults._overviewStyles;
    var topRect = new Rect(diagram.getCtx(), 0, 0, ovWidth, ovHeight);
    topRect.setInvisibleFill();
    topRect.setStroke(new Stroke(styleMap.overview.backgroundColor, 1, 1));
    topRect.setMouseEnabled(false);
    ovContainer.addChild(topRect);
  },

  /**
   * @protected
   * Creates content for the overview window based on the current state of the diagram
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   * @param {number} width overview width
   * @param {number} height overview height
   * @return {dvt.Container} content for the overview window
   */
  CreateOverviewContent: (diagram, overview, width, height) => {
    var ovContent = new Container(diagram.getCtx());
    ovContent.setMouseEnabled(false);
    overview.Nodes = new (diagram.getCtx().ojMap)();
    var contentBounds = diagram.GetViewBounds();
    overview.ContentBounds = contentBounds ? contentBounds.clone() : null;
    overview.StretchFactor = { h: 1, v: 1 };
    var rootNodes = diagram.GetRootNodeObjects();
    if (rootNodes.length > 0) {
      rootNodes.forEach((node) => {
        DvtDiagramOverviewUtils.CreateOverviewNode(diagram, overview, node, ovContent);
      });
      DvtDiagramOverviewUtils._adjustNodePositionsForAspectRatio(diagram, overview, width, height);
      DvtDiagramOverviewUtils.ZoomToFitOverviewContent(diagram, overview, ovContent, width, height);
    }
    return ovContent;
  },

  /**
   * @protected
   * Creates overview node
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   * @param {DvtDiagramNode} node the diagram node object that has to be shown in the overview
   * @param {dvt.Container} container container to attach the node
   */
  CreateOverviewNode: (diagram, overview, node, container) => {
    if (!node) return;
    var ovNode = DvtDiagramOverviewUtils._createOverviewNodeShape(diagram, node);
    DvtDiagramOverviewUtils._positionOverviewNode(node, ovNode);
    overview.Nodes.set(node.getId(), ovNode);
    container.addChild(ovNode);

    if (node.isDisclosed()) {
      ovNode._ovChildNodePane = new Container(diagram.getCtx());
      ovNode.addChild(ovNode._ovChildNodePane);
      var cp = node.getContainerPadding();
      ovNode._ovChildNodePane.setTranslate(cp.left, cp.top);
      node.getChildNodeIds().forEach((childId) => {
        var childNode = diagram.getNodeById(childId);
        DvtDiagramOverviewUtils.CreateOverviewNode(
          diagram,
          overview,
          childNode,
          ovNode._ovChildNodePane
        );
      });
    }
  },

  /**
   * @protected
   * Removes the overview window from the diagram.
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   */
  RemoveOverviewWindow: (diagram, overview) => {
    if (overview) {
      overview.setClipPath(null);
      var ovContainer = overview.getParent();
      diagram.removeChild(ovContainer);
    }
  },

  /**
   * @protected
   * Updates the overview window instance for the diagram:
   *           window position, nodes positions, clip path
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   */
  UpdateOverviewWindow: (diagram, overview) => {
    overview.ContentBounds = diagram.GetViewBounds();
    DvtDiagramOverviewUtils._positionOverviewWindow(diagram, overview);
    DvtDiagramOverviewUtils._updateOverviewNodes(diagram, overview);

    if (overview.Nodes.size > 0)
      DvtDiagramOverviewUtils.ZoomToFitOverviewContent(
        diagram,
        overview,
        overview.Content,
        overview.Width,
        overview.Height
      );
    overview.UpdateViewport();

    var ovWidth = overview.getOverviewWidth();
    var ovHeight = overview.getOverviewHeight();
    //update clip path
    overview.setClipPath(null);
    var clipPath = new ClipPath(diagram.getId() + 'dgr_ovClip');
    //give clip path an extra space
    clipPath.addRect(overview.getTranslateX(), overview.getTranslateY(), ovWidth, ovHeight);
    overview.setClipPath(clipPath);
    // update top rectangle
    var ovContainer = overview.getParent();
    var topRect = ovContainer.getChildIndex(1);
    if (topRect instanceof Rect) {
      topRect.setWidth(ovWidth);
      topRect.setHeight(ovHeight);
    }
  },

  /**
   * @protected
   * Updates diagram content. Used for partial updates
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   * @param {string} type event type
   * @param {object} event event object
   */
  UpdateOverviewContent: (diagram, overview, type, event) => {
    var eventNodes = event['data']['nodes'];
    if (!eventNodes || eventNodes.length === 0) return;

    var parentId = event['parentId'];
    var parentNode = parentId ? diagram.getNodeById(parentId) : null;
    var nodesToUpdate = [];
    var rootNode;

    if (type == 'add') {
      //When adding child nodes from container,
      //find root parent and update the subtree.
      if (parentNode) {
        rootNode = DvtDiagramOverviewUtils._findRootNode(diagram, parentNode);
        DvtDiagramOverviewUtils._removeNode(overview, rootNode.getId());
        nodesToUpdate.push(rootNode);
      } else {
        eventNodes.forEach((nodeData) => {
          nodesToUpdate.push(diagram.getNodeById(nodeData.id));
        });
      }
    } else if (type == 'change') {
      // find all roots to update
      // rerender starting with roots
      var roots = new (diagram.getCtx().ojMap)();
      eventNodes.forEach((nodeData) => {
        rootNode = DvtDiagramOverviewUtils._findRootNode(diagram, diagram.getNodeById(nodeData.id));
        if (rootNode) roots.set(rootNode.getId(), rootNode);
      });
      roots.forEach((root, nodeId, map) => {
        DvtDiagramOverviewUtils._removeNode(overview, nodeId);
        nodesToUpdate.push(root);
      });
    } else if (type == 'remove') {
      //When removing child nodes from container,
      //find root parent and update the subtree
      if (parentNode) {
        rootNode = DvtDiagramOverviewUtils._findRootNode(diagram, parentNode);
        DvtDiagramOverviewUtils._removeNode(overview, rootNode.getId());
        nodesToUpdate.push(rootNode);
      } else {
        //remove nodes
        eventNodes.forEach((nodeData) => {
          DvtDiagramOverviewUtils._removeNode(overview, nodeData.id);
        });
      }
    }
    nodesToUpdate.forEach((node) => {
      // rerender each node
      DvtDiagramOverviewUtils.CreateOverviewNode(diagram, overview, node, overview.Content);
    });
  },

  /**
   * @protected
   * Transforms a point from diagram content to viewport coordinates
   * @param {number} cx content x position
   * @param {number} cy content y position
   * @param {DvtDiagramOverview} overview the overview component
   * @return {dvt.Point} point in viewport coordinates
   */
  TransformFromContentToViewportCoords: (cx, cy, overview) => {
    var content = overview.Content;
    var tx = content.getTranslateX();
    var ty = content.getTranslateY();
    var sx = content.getScaleX();
    var sy = content.getScaleY();

    var stretchH = overview.StretchFactor.h;
    var stretchV = overview.StretchFactor.v;
    var vx = cx * sx * stretchH + tx;
    var vy = cy * sy * stretchV + ty;
    return new Point(vx, vy);
  },

  /**
   * @protected
   * Transforms a point from overview viewport to diagram content coordinates
   * @param {number} vx viewport x position
   * @param {number} vy viewport y position
   * @param {DvtDiagramOverview} overview the overview component
   * @return {dvt.Point} point in content coordinates
   */
  TransformFromViewportToContentCoords: (vx, vy, overview) => {
    var content = overview.Content;
    var tx = content.getTranslateX();
    var ty = content.getTranslateY();
    var sx = content.getScaleX();
    var sy = content.getScaleY();

    var stretchH = overview.StretchFactor.h;
    var stretchV = overview.StretchFactor.v;
    var cx = (vx - tx) / sx / stretchH;
    var cy = (vy - ty) / sy / stretchV;
    return new Point(cx, cy);
  },

  /**
   * @protected
   * Zooms to fit diagram content into the overview window
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview window
   * @param {dvt.Container} ovContent overview window content
   * @param {number} width overview width
   * @param {number} height overview height
   */
  ZoomToFitOverviewContent: (diagram, overview, ovContent, width, height) => {
    var dims = overview.ContentBounds;
    var dz = DvtDiagramOverviewUtils._calcOverviewScale(diagram, dims, width, height, overview);
    ovContent.setScale(dz, dz);
    var tx = (width - dims.w * dz) / 2 - dims.x * dz;
    var ty = (height - dims.h * dz) / 2 - dims.y * dz;
    ovContent.setTranslate(tx, ty);
  },

  /**
   * @private
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview window
   * @param {number} width overview width
   * @param {number} height overview height
   */
  _adjustNodePositionsForAspectRatio: (diagram, overview, width, height) => {
    if (diagram.Options.overview.preserveAspectRatio !== 'meet') {
      var diagramBounds = diagram.GetViewBounds();
      var ovPadding =
        2 *
        CSSStyle.toNumber(
          diagram.Options.styleDefaults._overviewStyles.overviewContent.padding
        );
      // canvas meet and canvas none cases
      var diagramRatio;
      if (diagram.Options.overview.fitArea === 'canvas') {
        var canvasDimensions = DvtDiagramOverviewUtils._getCanvasDimensions(diagram);
        diagramRatio = canvasDimensions.w / canvasDimensions.h; // option #2
      } else {
        diagramRatio = diagramBounds.w / diagramBounds.h; // option 1 is for content meet and content none
      }
      var overviewRatio = (width - ovPadding) / (height - ovPadding);
      if (overviewRatio == diagramRatio) return;

      // stretch factors
      var stretchFactorH = overviewRatio > diagramRatio ? overviewRatio / diagramRatio : 1;
      var stretchFactorV = overviewRatio < diagramRatio ? diagramRatio / overviewRatio : 1;

      //update overview.ContentBounds
      overview.ContentBounds = diagramBounds.clone();
      overview.ContentBounds.w = overview.ContentBounds.w * stretchFactorH;
      overview.ContentBounds.h = overview.ContentBounds.h * stretchFactorV;
      overview.StretchFactor = { h: stretchFactorH, v: stretchFactorV };

      // adjust positions only for none
      var rootNodes = diagram.GetRootNodeObjects();
      if (rootNodes.length > 0) {
        var nodeStretchFactor = DvtDiagramOverviewUtils._getNodesStretchFactor(
          overview,
          rootNodes,
          overview.StretchFactor
        );

        // edge case where we don't stretch nodes because of the layout
        if (nodeStretchFactor.h === 1 && nodeStretchFactor.v === 1) {
          overview.ContentBounds = diagramBounds.clone();
          overview.StretchFactor = { h: 1, v: 1 };
          return;
        }

        rootNodes.forEach((node) => {
          DvtDiagramOverviewUtils._adjustNodePosition(
            overview.Nodes.get(node.getId()),
            nodeStretchFactor
          );
        });
      }
    }
  },

  /**
   * @private
   * Get the dimension of the canvas based on panning.
   * @param {Diagram} diagram the parent diagram component
   * @return {dvt.Dimension} dims the dimensions of the canvas to be fit
   */
  _getCanvasDimensions: (diagram) => {
    var dims;
    if (diagram.Options.panning === 'fixed' || diagram.Options.panning === 'none') {
      dims = new Dimension(diagram.Width, diagram.Height);
    } else {
      // panning is 'auto' or 'centerContent'
      var contentDims = diagram.GetViewBounds();
      var zoom = diagram.getPanZoomCanvas().getMinZoom();
      dims = new Dimension(2 * contentDims.w * zoom, 2 * contentDims.h * zoom);
    }
    return dims;
  },

  /**
   * @private
   * Set new position for the overview node based on the node centers.
   * @param {dvt.SimpleMarker} ovNode overview node
   * @param {number} nodeStretchFactor nodeStretchFactor
   */
  _adjustNodePosition: (ovNode, nodeStretchFactor) => {
    var centerDims = ovNode.getCenterDimensions();
    var currX = ovNode.getTranslateX();
    var currY = ovNode.getTranslateY();
    if (nodeStretchFactor.h > 1) {
      var centerX =
        (currX + centerDims.x - nodeStretchFactor.tx) * nodeStretchFactor.h + nodeStretchFactor.tx;
      ovNode.setTranslateX(centerX - centerDims.w * 0.5);
    } else if (nodeStretchFactor.v > 1) {
      var centerY =
        (currY + centerDims.y - nodeStretchFactor.ty) * nodeStretchFactor.v + nodeStretchFactor.ty;
      ovNode.setTranslateY(centerY - centerDims.h * 0.5);
    }
  },

  /**
   * The method calculates vertical and horizontal stretch factors for the node centers based on the stretch factor for the entire content - overview.StretchFactor.
   * In order to find the stretch factors for the node centers, the method iterates through the nodes, finds nodes with the leftmost and rightmost centers, and nodes with the highest and lowest centers. Then it calculates the vertical and horizontal stretch factors based on the distance between the farthest centers and dimensions of the outer nodes.
   * If we are not satisfied with the node stretching algorithm in the future, this is the place to look and revise.
   * @param {DvtDiagramOverview} overview the overview component
   * @param {object} rootNodes the root nodes of the overview
   * @param {object} stretchFactor object with horizontal stretch factor and vertical stretch factor
   * @return {object} nodeStretchFactor
   */

  _getNodesStretchFactor: (overview, rootNodes, stretchFactor) => {
    var nodeStretchFactor = { h: 1, v: 1 };
    if (stretchFactor.h > 1) {
      // find left-most and right-most node centers
      var minX = Number.MAX_VALUE;
      var maxX = -Number.MAX_VALUE;
      var minBounds, maxBounds;
      rootNodes.forEach((node) => {
        var bounds = node.getContentBounds();
        var centerX = node.getTranslateX() + bounds.x + bounds.w * 0.5;
        minBounds = centerX < minX ? bounds : minBounds;
        maxBounds = centerX > maxX ? bounds : maxBounds;
        minX = Math.min(centerX, minX);
        maxX = Math.max(centerX, maxX);
      });
      var halfMin = minBounds.w * 0.5;
      var halfMax = maxBounds.w * 0.5;
      var horizontalStretch =
        maxX === minX ? 1 : (overview.ContentBounds.w - halfMin - halfMax) / (maxX - minX);
      nodeStretchFactor = { h: horizontalStretch, v: 1, tx: halfMin };
    }
    if (stretchFactor.v > 1) {
      // find most-top and most-bottom node centers
      var minY = Number.MAX_VALUE;
      var maxY = -Number.MAX_VALUE;
      var minBoundsTop, maxBoundsTop;
      rootNodes.forEach((node) => {
        var bounds = node.getContentBounds();
        var centerY = node.getTranslateY() + bounds.y + bounds.h * 0.5;
        minBoundsTop = centerY < minY ? bounds : minBoundsTop;
        maxBoundsTop = centerY > maxY ? bounds : maxBoundsTop;
        minY = Math.min(centerY, minY);
        maxY = Math.max(centerY, maxY);
      });
      var halfMinTop = minBoundsTop.h * 0.5;
      var halfMaxTop = maxBoundsTop.h * 0.5;
      var verticalStretch =
        maxY === minY ? 1 : (overview.ContentBounds.h - halfMinTop - halfMaxTop) / (maxY - minY);
      nodeStretchFactor = { h: 1, v: verticalStretch, ty: halfMinTop };
    }

    return nodeStretchFactor;
  },

  /**
   * @private
   * Calculates scale for the overview content
   * @param {Diagram} diagram the parent diagram component
   * @param {object} ztfBounds zoom-to-fit dimensions for the diagram content
   * @param {number} width overview width
   * @param {number} height overview height
   * @param {DvtDiagramOverview} overview the overview component
   */
  _calcOverviewScale: (diagram, ztfBounds, width, height, overview) => {
    var ovPadding =
      2 *
      CSSStyle.toNumber(diagram.Options.styleDefaults._overviewStyles.overviewContent.padding);
    var cw = width - ovPadding; //use padding for the content from each side
    var ch = height - ovPadding; //use padding for the content from each side
    if (diagram.Options.overview.fitArea === 'canvas') {
      var diagramBounds = diagram.GetViewBounds();
      var minZoom = diagram.getPanZoomCanvas().getMinZoom();
      var canvasDims = DvtDiagramOverviewUtils._getCanvasDimensions(diagram);
      var contentPadding = Math.min(
        (canvasDims.h - diagramBounds.h * minZoom) / 2,
        (canvasDims.w - diagramBounds.w * minZoom) / 2
      ); // make this variable
      var stretchFactorH = overview.StretchFactor.h;
      var stretchFactorV = overview.StretchFactor.v;
      var vzx = (cw / canvasDims.w) * stretchFactorH;
      var vzh = (ch / canvasDims.h) * stretchFactorV;
      var vz = Math.min(vzx, vzh);
      var diagramPaddingW = 2 * contentPadding * stretchFactorH * vz;
      var diagramPaddingH = 2 * contentPadding * stretchFactorV * vz;
      cw -= diagramPaddingW; // adjust for diagram/viewport padding
      ch -= diagramPaddingH; // adjust for diagram/viewport padding
    }
    var dzx = cw / ztfBounds.w;
    var dzy = ch / ztfBounds.h;
    return Math.min(dzx, dzy);
  },

  /**
   * @private
   * Creates overview node shape for the given diagram node
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramNode} node the diagram node object that has to be shown in the overview
   * @return {dvt.SimpleMarker} a marker that represents a diagram node in the overview
   */
  _createOverviewNodeShape: (diagram, node) => {
    var ovIconData = diagram.Options.styleDefaults._overviewStyles.node;
    var nodeData = node.getData();
    if (nodeData['overview'])
      ovIconData = JsonUtils.merge(nodeData['overview']['icon'], ovIconData);

    // determine node shape using the following rules:
    // - the container shape is always 'rectangle'
    // - custom node with 'inherit' shape turns into 'rectangle', otherwise it can use built-in shape/svg path
    // - standard node can either 'inherit' the shape from main node or use specified built-in shape/svg path
    var iconShape = ovIconData['shape'];
    if (node.isDisclosed() || (diagram.Options.renderer && iconShape == 'inherit')) {
      iconShape = 'rectangle';
    } else if (iconShape == 'inherit') {
      iconShape = nodeData['icon']['shape'];
    }
    var dims = node.getLayoutBounds();
    var iconWidth = dims.w;
    var iconHeight = dims.h;
    var ovNode = new SimpleMarker(
      diagram.getCtx(),
      iconShape,
      iconWidth / 2,
      iconHeight / 2,
      iconWidth,
      iconHeight,
      0
    );
    ovNode.setSolidFill(nodeData['icon']['color']);

    //apply styles - svg style and class names
    // oj-diagram-overview-node class is a placeholder in case want to add styling later
    var className = [
      node.isDisclosed() ? 'oj-diagram-overview-container-node' : 'oj-diagram-overview-node'
    ];
    if (ovIconData['svgClassName']) {
      className.push(ovIconData['svgClassName']);
    }
    ovNode.setStyle(ovIconData['svgStyle']).setClassName(className.join(' '));
    return ovNode;
  },

  /**
   * @private
   * Finds a root node for the given diagram node. Used for partial updates
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramNode} node a diagram node
   * @return {DvtDiagramNode} root node for the given diagram node
   */
  _findRootNode: (diagram, node) => {
    var rootNode = node;
    var groupId = node ? node.getGroupId() : null;
    while (groupId) {
      rootNode = diagram.getNodeById(groupId) ? diagram.getNodeById(groupId) : rootNode;
      groupId = rootNode.getGroupId();
    }
    return rootNode;
  },

  /**
   * @private
   * Positions overview node based on postion of the diagram node
   * @param {DvtDiagramNode} node diagram node
   * @param {dvt.SimpleMarker} ovNode overview node
   */
  _positionOverviewNode: (node, ovNode) => {
    var tx = node.getTranslateX();
    var ty = node.getTranslateY();
    ovNode.setTranslate(tx, ty);
  },

  /**
   * @private
   * Positions overview window within the component
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   */
  _positionOverviewWindow: (diagram, overview) => {
    var halign = diagram.Options['overview']['halign'];
    var valign = diagram.Options['overview']['valign'];
    var padding = CSSStyle.toNumber(
      diagram.Options.styleDefaults._overviewStyles.overview.padding
    );
    var overviewWidth = overview.getOverviewWidth();
    var overviewHeight = overview.getOverviewHeight();
    var availableWidth = diagram.Width;
    var availableHeight = diagram.Height;

    switch (halign) {
      case 'start':
        halign = Agent.isRightToLeft(diagram.getCtx()) ? 'right' : 'left';
        break;
      case 'end':
        halign = Agent.isRightToLeft(diagram.getCtx()) ? 'left' : 'right';
        break;
      default:
        break;
    }

    var rightPadding = halign == 'right' ? availableWidth - overviewWidth - padding : padding;
    var positionX = halign == 'center' ? (availableWidth - overviewWidth) / 2 : rightPadding;

    var bottomPadding = valign == 'bottom' ? availableHeight - overviewHeight - padding : padding;
    var positionY = valign == 'middle' ? (availableHeight - overviewHeight) / 2 : bottomPadding;
    var ovContainer = overview.getParent();
    ovContainer.setTranslate(positionX, positionY);
  },

  /**
   * @private
   * Removes overview node if exists. Used for partual updates
   * @param {DvtDiagramOverview} overview the overview component
   * @param {string} nodeId the node id
   */
  _removeNode: (overview, nodeId) => {
    var ovNode = overview.Nodes.get(nodeId);
    if (ovNode) ovNode.getParent().removeChild(ovNode);
  },

  /**
   * @private
   * Updates positions of the overview nodes
   * @param {Diagram} diagram the parent diagram component
   * @param {DvtDiagramOverview} overview the overview component
   */
  _updateOverviewNodes: (diagram, overview) => {
    overview.Nodes.forEach((ovNode, nodeId, map) => {
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
    DvtDiagramOverviewUtils._adjustNodePositionsForAspectRatio(
      diagram,
      overview,
      overview.Width,
      overview.Height
    );
  }
};

/**
 * Defines an (x,y) coordinate.
 * @class DvtDiagramPoint
 * @constructor
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 */
class DvtDiagramPoint {
  constructor(x, y) {
    this.x = x === null || isNaN(x) ? 0 : x;
    this.y = y === null || isNaN(y) ? 0 : y;
  }
}

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
class DvtDiagramRectangle {
  constructor(x, y, w, h) {
    this.x = x === null || isNaN(x) ? 0 : x;
    this.y = y === null || isNaN(y) ? 0 : y;
    this.w = w === null || isNaN(w) ? 0 : w;
    this.h = h === null || isNaN(h) ? 0 : h;
  }
}

/**
 * @protected
 * Defines the node context for a layout call.
 * @class DvtDiagramLayoutContextNode
 * @constructor
 */
class DvtDiagramLayoutContextNode {
  constructor() {
    this._bReadOnly = false;
    this._selected = false;
    this._bDisclosed = false;
    this.IsRendered = true;
    //used by global layout for nodes inside container
    this.ContentOffset = new DvtDiagramPoint(0, 0);
  }

  /**
   * @protected
   * Set the id of the node.
   * @param {any} id id of the node
   */
  setId(id) {
    this._id = id;
  }

  /**
   * Get the id of the node.
   * @return {any}
   */
  getId() {
    return this._id;
  }

  /**
   * @protected
   * Set the bounds of the node.  The bounds include any overlays.
   * The bounds are in the coordinate system of the node.
   * @param {DvtDiagramRectangle} bounds bounds of the node
   */
  setBounds(bounds) {
    this._bounds = bounds;
    //save the original bounds, in case there is container padding
    this._origBounds = bounds;
  }

  /**
   * Get the bounds of the node.  The bounds include any overlays.
   * The bounds are in the coordinate system of the node.
   * @return {DvtDiagramRectangle}
   */
  getBounds() {
    if (!this._bounds && this.Component) {
      this.Component.updateNodeDims(this);
    }
    return this._bounds;
  }

  /**
   * @protected
   * Set the bounds of the node content.  The bounds do not include any overlays.
   * The bounds are in the coordinate system of the node.
   * @param {DvtDiagramRectangle} bounds content bounds of the node
   */
  setContentBounds(bounds) {
    this._contentBounds = bounds;
    //save the original bounds, in case there is container padding
    this._origContentBounds = bounds;
  }

  /**
   * Get the bounds of the node content.  The bounds do not include any overlays.
   * The bounds are in the coordinate system of the node.
   * @return {DvtDiagramRectangle}
   */
  getContentBounds() {
    if (!this._contentBounds && this.Component) {
      this.Component.updateNodeDims(this);
    }
    return this._contentBounds;
  }

  /**
   * Set the position of the node.  The position is in the coordinate system of
   * the node's container.
   * @param {DvtDiagramPoint} pos position of the node
   */
  setPosition(pos) {
    this._position = pos;
    this.UpdateParentNodes();
    this.setDirty();
  }

  /**
   * Get the position of the node.
   * @return {DvtDiagramPoint}
   */
  getPosition() {
    return this._position;
  }

  /**
   * The method returns a relative position of the node to the specified ancestor container.
   * If the container id is null, the method returns global position of the node.
   * If the container id is not an ancestor id for the node, the method returns null.
   * @param {any} containerId ancestor id
   * @return {DvtDiagramPoint}
   */
  getRelativePosition(containerId) {
    var layoutContext = this.LayoutContext;
    if (layoutContext) {
      //get position relative to the specified container
      var position = new DvtDiagramPoint(0, 0);
      var node = this;
      var bFoundAncestor = false;
      while (node) {
        //ensure that parent node is rendered
        var parentId = node.getContainerId();
        if (parentId) {
          var parent = layoutContext.getNodeById(parentId);
          if (parent && this.Component && !parent.IsRendered)
            this.Component.renderNodeFromContext(parent, true);
        }
        //calculate relative position
        position['x'] += node.ContentOffset['x'] + node.getPosition()['x'];
        position['y'] += node.ContentOffset['y'] + node.getPosition()['y'];
        if (!DvtDiagramDataUtils.compareValues(layoutContext.Context, parentId, containerId)) {
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
    return null;
  }

  /**
   * Set the position of the node label.  The position is in the coordinate
   * system of the node's container.
   * @param {DvtDiagramPoint} pos position of the node label
   */
  setLabelPosition(pos) {
    this._labelPosition = pos;
    this.setDirty();
  }

  /**
   * Get the position of the node label.  The position is in the coordinate
   * system of the node's container.
   * @return {DvtDiagramPoint}
   */
  getLabelPosition() {
    return this._labelPosition;
  }

  /**
   * @protected
   * Set the label bounds.  The bounds are in the coordinate system of the label.
   * @param {DvtDiagramRectangle} bounds label bounds
   */
  setLabelBounds(bounds) {
    this._labelBounds = bounds;
  }

  /**
   * Get the label bounds.  The bounds are in the coordinate system of the label.
   * @return {DvtDiagramRectangle}
   */
  getLabelBounds() {
    if (!this._labelBounds && this.Component) {
      this.Component.updateNodeDims(this);
    }
    return this._labelBounds;
  }

  /**
   * @protected
   * Set the map of node layout attributes.
   * @param {object} layoutAttrs map of node layout attributes
   */
  setLayoutAttributes(layoutAttrs) {
    this._layoutAttrs = layoutAttrs;
  }

  /**
   * Get the map of node layout attributes.
   * @return {object}
   */
  getLayoutAttributes() {
    return this._layoutAttrs;
  }

  /**
   * @protected
   * Set whether the node is read-only.  A read-only node cannot be positioned
   * by this layout call, and is only provided as additional information that may
   * be used when laying out other nodes.
   * @param {boolean} bReadOnly true if this node is read-only, false otherwise
   */
  setReadOnly(bReadOnly) {
    this._bReadOnly = bReadOnly;
  }

  /**
   * Determine whether this node is read-only.  A read-only node cannot be
   * positioned by this layout call, and is only provided as additional
   * information that may be used when laying out other nodes.
   * @return {boolean}
   */
  isReadOnly() {
    return this._bReadOnly;
  }

  /**
   * @protected
   * Set the id of this node's container.
   * @param {any} id id of this node's container
   */
  setContainerId(id) {
    this._containerId = id;
  }

  /**
   * Get the id of this node's container, or null if this is the top-level
   * Diagram layout.
   * @return {any}
   */
  getContainerId() {
    return this._containerId;
  }

  /**
   * @protected
   * Set whether this node is selected.
   * @param {boolean} selected true if selected, false otherwise
   */
  setSelected(selected) {
    this._selected = selected;
  }

  /**
   * Determine whether this node is selected.
   * @return {boolean}
   */
  getSelected() {
    return this._selected;
  }

  /**
   * Set the angle of rotation of the node label, relative to the label
   * rotation point, in radians.
   * @param {number} angle angle of rotation
   */
  setLabelRotationAngle(angle) {
    this._labelRotAngle = angle;
    this.setDirty();
  }

  /**
   * Get the angle of rotation of the node label, relative to the label
   * rotation point, in radians.
   * @return {number}
   */
  getLabelRotationAngle() {
    return this._labelRotAngle;
  }

  /**
   * Set the point about which to rotate the node label, in the coordinate
   * system of the label.
   * @param {DvtDiagramPoint} point label rotation point
   */
  setLabelRotationPoint(point) {
    this._labelRotPoint = point;
    this.setDirty();
  }

  /**
   * Get the point about which to rotate the node label, in the coordinate
   * system of the label.
   * @return {DvtDiagramPoint}
   */
  getLabelRotationPoint() {
    return this._labelRotPoint;
  }

  /**
   * @protected
   * Set the padding of this container.
   * @param {object} obj map defining values for keys 'top', 'left', 'bottom',
   * and 'right'
   */
  SetContainerPaddingObj(obj) {
    //if this node isn't disclosed, don't save any container padding
    if (this.isDisclosed()) {
      this._containerPadding = obj;

      //this function is called by the Diagram when initializing the
      //layout context, so the original bounds already include the container
      //padding, and we need to subtract it out here
      if (obj) {
        if (this._origBounds) {
          this._origBounds = new DvtDiagramRectangle(
            this._origBounds['x'],
            this._origBounds['y'],
            this._origBounds['w'] - (obj['left'] + obj['right']),
            this._origBounds['h'] - (obj['top'] + obj['bottom'])
          );
        }
        if (this._origContentBounds) {
          this._origContentBounds = new DvtDiagramRectangle(
            this._origContentBounds['x'],
            this._origContentBounds['y'],
            this._origContentBounds['w'] - (obj['left'] + obj['right']),
            this._origContentBounds['h'] - (obj['top'] + obj['bottom'])
          );
        }
      }
    }
  }

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
  setContainerPadding(top, right, bottom, left) {
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
          this._origBounds['x'],
          this._origBounds['y'],
          this._origBounds['w'] + left + right,
          this._origBounds['h'] + top + bottom
        );
      }
      if (this._origContentBounds) {
        this._contentBounds = new DvtDiagramRectangle(
          this._origContentBounds['x'],
          this._origContentBounds['y'],
          this._origContentBounds['w'] + left + right,
          this._origContentBounds['h'] + top + bottom
        );
      }
      this.setDirty();
    }
  }

  /**
   * Get the padding of this container.  Values can be retrieved from the
   * returned map using keys 'top', 'left', 'bottom', and 'right'.
   * @return {object}
   */
  getContainerPadding() {
    return this._containerPadding;
  }

  /**
   * @protected
   * Set whether this container is disclosed.
   * @param {boolean} bDisclosed true if this container is disclosed, false
   * otherwise
   */
  setDisclosed(bDisclosed) {
    this._bDisclosed = bDisclosed;
  }

  /**
   * Determine whether this container is disclosed.
   * @return {boolean}
   */
  isDisclosed() {
    return this._bDisclosed;
  }

  /**
   * @protected
   * Set child nodes for the container. Child nodes are populated for global layout only.
   * @param {array} childNodes array of DvtDiagramLayoutContextNode objects
   */
  setChildNodes(childNodes) {
    this._childNodes = childNodes;
  }

  /**
   * Visible child nodes for the disclosed container. Child nodes are populated for global layout only.
   * @return {array} array of DvtDiagramLayoutContextNode objects
   */
  getChildNodes() {
    return this._childNodes;
  }

  /**
   * @protected
   * Set parent node. The member is populated for global layout option
   * @param {DvtDiagramLayoutContextNode} parentNode parent node
   */
  setParentNode(parentNode) {
    this._parentNode = parentNode;
  }

  /**
   * Get parent node. The member is populated for global layout option.
   * @return {DvtDiagramLayoutContextNode} parent node
   */
  getParentNode() {
    return this._parentNode;
  }

  /**
   * Resets IsRendered flag and calculated bounds for parent nodes.
   * Relevant for global layout option, when parent container is already rendered, but a child node changes position
   * the parent node should be marked as not rendered
   * @protected
   */
  UpdateParentNodes() {
    var parent = this.getParentNode();
    if (parent && parent.IsRendered) {
      parent.Reset();
      parent.UpdateParentNodes();
    }
  }

  /**
   * Resets IsRendered flag and calculated bounds for the current node.
   * @protected
   */
  Reset() {
    this.IsRendered = false;
    this.setBounds(null);
    this.setContentBounds(null);
    this.setLabelBounds(null);
    this.setDirty();
  }

  /**
   * Sets the label valign
   * default is top
   * Only intended for JET Diagram
   * @param {string} valign values can include top, middle, bottom, and baseline
   */
  setLabelValign(valign) {
    this._labelValign = valign;
    this.setDirty();
  }

  /**
   * Sets the label halign
   * default depends on locale, left for LTR and right for RTL
   * Only intended for JET Diagram
   * @param {string} halign values can include left, right, and center
   */
  setLabelHalign(halign) {
    this._labelHalign = halign;
    this.setDirty();
  }

  /**
   * Gets the label valign
   * default is top
   * Only intended for JET Diagram
   * @return {string} values can include top, middle, bottom, and baseline
   */
  getLabelValign() {
    return this._labelValign;
  }

  /**
   * Gets the label halign
   * default depends on locale, left for LTR and right for RTL
   * Only intended for JET Diagram
   * @return {string} values can include left, right, and center
   */
  getLabelHalign() {
    return this._labelHalign;
  }

  /**
   * @protected
   * Set data for the node
   * @param {object} data a data object for the node
   */
  setData(data) {
    this._data = data;
  }

  /**
   * Gets data for the node.
   * @return {object|array} returns relevant data for the node
   */
  getData() {
    return this._data;
  }

  /**
   * @protected
   * Mark layout context for the node as dirty once the its position or label position changed
   */
  setDirty() {
    if (this.LayoutContext) {
      this.LayoutContext.getDirtyContext().set(this.getId(), true);
    }
  }

  /**
   * @protected
   * Copies layout context state for the node from existing node layout context
   * @param {DvtDiagramLayoutContextNode} node existing node layout context
   */
  copyFrom(node) {
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
  }
}

/**
 * @protected
 * Defines the link context for a layout call.
 * @class DvtDiagramLayoutContextLink
 * @constructor
 */
class DvtDiagramLayoutContextLink {
  constructor() {
    this._startConnectorOffset = 0;
    this._endConnectorOffset = 0;
    this._linkWidth = 1;
    this._selected = false;
    this._bPromoted = false;
  }

  /**
   * @protected
   * Set the id of the link.
   * @param {any} id id of the link
   */
  setId(id) {
    this._id = id;
  }

  /**
   * Get the id of the link.
   * @return {any}
   */
  getId() {
    return this._id;
  }

  /**
   * @protected
   * Set the id of the start node of this link.
   * @param {any} id id of the start node
   */
  setStartId(id) {
    this._startId = id;
  }

  /**
   * Get the id of the start node of this link.
   * @return {any}
   */
  getStartId() {
    return this._startId;
  }

  /**
   * @protected
   * Set the id of the end node of this link.
   * @param {any} id id of the end node
   */
  setEndId(id) {
    this._endId = id;
  }

  /**
   * Get the id of the end node of this link.
   * @return {any}
   */
  getEndId() {
    return this._endId;
  }

  /**
   * Set the points to use for rendering this link.  The given points can contain an array of
   * coordinates, like [x1, y1, x2, y2, ..., xn, yn], SVG path commands, like
   * ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn] or a string containing SVG path
   * command sequences, like 'Mx1,y1 Cx2,y2 x3,y3 x4,y4 ...'.
   * The points are in the coordinate system of the link's container.
   * @param {array|string} points array of points or a string with SVG path to use for rendering this link
   */
  setPoints(points) {
    if (typeof points == 'string') this._points = PathUtils.createPathArray(points);
    else this._points = points;
    this.setDirty();
  }

  /**
   * Get the points to use for rendering this link.  The returned array can
   * contain coordinates, like [x1, y1, x2, y2, ..., xn, yn], or SVG path
   * commands, like ["M", x1, y1, "L", x2, y2, ..., "L", xn, yn].  The points
   * are in the coordinate system of the link's container.
   * @return {array}
   */
  getPoints() {
    return this._points;
  }

  /**
   * Set the position of the link label.  The position is in the coordinate
   * system of the link's container.
   * @param {DvtDiagramPoint} pos position of the link label
   */
  setLabelPosition(pos) {
    this._labelPosition = pos;
    this.setDirty();
  }

  /**
   * Get the position of the link label.  The position is in the coordinate
   * system of the link's container.
   * @return {DvtDiagramPoint} position of the link label
   */
  getLabelPosition() {
    return this._labelPosition;
  }

  /**
   * @protected
   * Set the label bounds.  The bounds are in the coordinate system of the label.
   * @param {DvtDiagramRectangle} bounds label bounds
   */
  setLabelBounds(bounds) {
    this._labelBounds = bounds;
  }

  /**
   * Get the label bounds.  The bounds are in the coordinate system of the label.
   * @return {DvtDiagramRectangle}
   */
  getLabelBounds() {
    return this._labelBounds;
  }

  /**
   * @protected
   * Set the offset of the start connector.  This is the amount of space that the
   * link should leave between its starting point and the node for the connector
   * to be drawn.
   * @param {number} offset offset of the start connector
   */
  setStartConnectorOffset(offset) {
    this._startConnectorOffset = offset;
  }

  /**
   * Get the offset of the start connector.  This is the amount of space that the
   * link should leave between its starting point and the node for the connector
   * to be drawn.
   * @return {number}
   */
  getStartConnectorOffset() {
    return this._startConnectorOffset;
  }

  /**
   * @protected
   * Set the offset of the end connector.  This is the amount of space that the
   * link should leave between its ending point and the node for the connector
   * to be drawn.
   * @param {number} offset offset of the end connector
   */
  setEndConnectorOffset(offset) {
    this._endConnectorOffset = offset;
  }

  /**
   * Get the offset of the end connector.  This is the amount of space that the
   * link should leave between its ending point and the node for the connector
   * to be drawn.
   * @return {number}
   */
  getEndConnectorOffset() {
    return this._endConnectorOffset;
  }

  /**
   * @protected
   * Set the width of this link.
   * @param {number} ww width of the link
   */
  setLinkWidth(ww) {
    this._linkWidth = ww;
  }

  /**
   * Get the width of this link.
   * @return {number}
   */
  getLinkWidth() {
    return this._linkWidth;
  }

  /**
   * @protected
   * Set the map of link layout attributes.
   * @param {object} layoutAttrs map of link layout attributes
   */
  setLayoutAttributes(layoutAttrs) {
    this._layoutAttrs = layoutAttrs;
  }

  /**
   * Get the map of link layout attributes.
   * @return {object}
   */
  getLayoutAttributes() {
    return this._layoutAttrs;
  }

  /**
   * @protected
   * Set whether this link is selected.
   * @param {boolean} selected true if selected, false otherwise
   */
  setSelected(selected) {
    this._selected = selected;
  }

  /**
   * Determine whether this link is selected.
   * @return {boolean}
   */
  getSelected() {
    return this._selected;
  }

  /**
   * Set the angle of rotation of the link label, relative to the label
   * rotation point, in radians.
   * @param {number} angle angle of rotation
   */
  setLabelRotationAngle(angle) {
    this._labelRotAngle = angle;
    this.setDirty();
  }

  /**
   * Get the angle of rotation of the link label, relative to the label
   * rotation point, in radians.
   * @return {number}
   */
  getLabelRotationAngle() {
    return this._labelRotAngle;
  }

  /**
   * Set the point about which to rotate the link label, in the coordinate
   * system of the label.
   * @param {DvtDiagramPoint} point label rotation point
   */
  setLabelRotationPoint(point) {
    this._labelRotPoint = point;
    this.setDirty();
  }

  /**
   * Get the point about which to rotate the link label, in the coordinate
   * system of the label.
   * @return {DvtDiagramPoint}
   */
  getLabelRotationPoint() {
    return this._labelRotPoint;
  }

  /**
   * @protected
   * Set whether this link is promoted.
   * @param {boolean} bPromoted true if promoted, false otherwise
   */
  setPromoted(bPromoted) {
    this._bPromoted = bPromoted;
  }

  /**
   * Determine whether this link is promoted.
   * @return {boolean}
   */
  isPromoted() {
    return this._bPromoted;
  }

  /**
   * Sets the label valign
   * default is top
   * Only intended for JET Diagram
   * @param {string} valign values can include top, middle, bottom, and baseline
   */
  setLabelValign(valign) {
    this._labelValign = valign;
    this.setDirty();
  }

  /**
   * Sets the label halign
   * default depends on locale, left for LTR and right for RTL
   * Only intended for JET Diagram
   * @param {string} halign values can include left, right, and center
   */
  setLabelHalign(halign) {
    this._labelHalign = halign;
    this.setDirty();
  }

  /**
   * Gets the label valign
   * default is top
   * Only intended for JET Diagram
   * @return {string} values can include top, middle, bottom, and baseline
   */
  getLabelValign() {
    return this._labelValign;
  }

  /**
   * Gets the label halign
   * default depends on locale, left for LTR and right for RTL
   * Only intended for JET Diagram
   * @return {string} values can include left, right, and center
   */
  getLabelHalign() {
    return this._labelHalign;
  }

  /**
   * Set coordinate space for the link.
   * If the coordinate container id is specified, the link points will be applied relative to that container.
   * If the coordinate container id is not specified, the link points are in the global coordinate space.
   * @param {any} id coordinate container id for the link
   */
  setCoordinateSpace(id) {
    this._coordinateContainerId = id;
    this.setDirty();
  }

  /**
   * Get coordinate space for the link.
   * If the coordinate container id is specified, the link points will be applied relative to that container.
   * If the coordinate container id is not specified, the link points are in the global coordinate space.
   * @return {any} coordinate container id for the link
   */
  getCoordinateSpace() {
    return this._coordinateContainerId;
  }

  /**
   * @protected
   * Set data for the link
   * @param {object|array} data a data object if the link is not promoted
   *                      an array of data objects for the links corresponding to the promoted link
   */
  setData(data) {
    this._data = data;
  }

  /**
   * Gets data for the link. If the link is not promoted, the methods retrieves a data object for the link.
   * If the link is promoted, the methods retrieves an array of data objects for the links that are represented by
   * the promoted link.
   * @return {object|array} returns relevant data for the link
   */
  getData() {
    return this._data;
  }

  /**
   * @protected
   * Mark layout context for the link as dirty once the its position or label position changed
   */
  setDirty() {
    if (this.LayoutContext) {
      this.LayoutContext.getDirtyContext().set(this.getId(), true);
    }
  }

  /**
   * @protected
   * Copies layout context state for the link from existing link layout context
   * @param {DvtDiagramLayoutContextLink} link existing link layout context
   */
  copyFrom(link) {
    if (link) {
      this.setPoints(link.getPoints());
      this.setLabelPosition(link.getLabelPosition());
      this.setLabelRotationAngle(link.getLabelRotationAngle());
      this.setLabelRotationPoint(link.getLabelRotationPoint());
      this.setLabelValign(link.getLabelValign());
      this.setLabelHalign(link.getLabelHalign());
      this.setCoordinateSpace(link.getCoordinateSpace());
    }
  }
}

/**
 * Dvt Diagram layout utils
 */
const DvtDiagramLayoutUtils = {
  /**
   * Converts dvt.Rectangle to DvtDiagramRectangle
   * @param {dvt.Rectangle} rect
   * @return {DvtDiagramRectangle}
   */
  convertRectToDiagramRect: (rect) => {
    if (rect === undefined || rect == null) return null;
    else return new DvtDiagramRectangle(rect.x, rect.y, rect.w, rect.h);
  },

  /**
   * Converts dvt.Point to DvtDiagramPoint
   * @param {dvt.Point} point
   * @return {DvtDiagramPoint}
   */
  convertPointToDiagramPoint: (point) => {
    if (point === undefined || point == null) return null;
    else return new DvtDiagramPoint(point.x, point.y);
  },

  /**
   * Converts DvtDiagramRectangle to dvt.Rectangle
   * @param {DvtDiagramRectangle} diagramRect
   * @return {dvt.Rectangle}
   */
  convertDiagramRectToRect: (diagramRect) => {
    if (!diagramRect) {
      return null;
    } else {
      return new Rectangle(
        diagramRect['x'],
        diagramRect['y'],
        diagramRect['w'],
        diagramRect['h']
      );
    }
  },

  /**
   * Converts dvt.Rectangle to dvt.Point
   * @param {DvtDiagramPoint} diagramPoint
   * @return {dvt.Point}
   */
  convertDiagramPointToPoint: (diagramPoint) => {
    if (!diagramPoint) {
      return null;
    } else {
      return new Point(diagramPoint['x'], diagramPoint['y']);
    }
  },
  /**
   * Convert from viewport coordinates to panZoomState coordinates
   * @param {DvtDiagramRectangle} viewport
   * @return {Object} the panZoomState
   */
  convertViewportToPanZoomState: (viewport, width, height) => {
    var w = viewport.w;
    var x = viewport.x;
    var y = viewport.y;
    var zoom = width / w;
    var cxVal = x + (width * 0.5) / zoom;
    var cyVal = y + (height * 0.5) / zoom;
    return { zoom: zoom, centerX: cxVal, centerY: cyVal };
  },

  /**
   * Convert from panZoomState coordinates to viewport coordinates
   * @param {Object} panZoomState
   * @return {DvtDiagramRectangle} the viewport
   */
  convertPanZoomStateToViewport: (panZoomState, width, height) => {
    var cxVal = panZoomState.centerX;
    var cyVal = panZoomState.centerY;
    var zoom = panZoomState.zoom ? panZoomState.zoom : 1;
    var x = cxVal - (width * 0.5) / zoom;
    var y = cyVal - (height * 0.5) / zoom;
    var w = width / zoom;
    var h = height / zoom;
    return new Rectangle(x, y, w, h);
  }
};

/**
 * @protected
 * Defines the context for a layout call.
 * @class DvtDiagramLayoutContext
 * @param {dvt.Context} context The rendering context.
 * @constructor
 * initializing this context
 */
class DvtDiagramLayoutContext {
  constructor(context) {
    this._nodeCount = 0;
    this._linkCount = 0;
    this._bLocaleR2L = false;
    this._nodes = new context.ojMap();
    this._links = new context.ojMap();
    this._arNodes = [];
    this._arLinks = [];
    this._dirtyContext = new context.ojMap();
    this.Context = context;
  }

  /**
   * @protected
   * Set the name of the layout.
   * @param {string} layout the name of the layout
   */
  setLayout(layout) {
    this._layout = layout;
  }

  /**
   * Get the name of the layout.
   * @return {string}
   */
  getLayout() {
    return this._layout;
  }

  /**
   * @protected
   * Set the map of global layout attributes.
   * @param {object} layoutAttrs map of global layout attributes
   */
  setLayoutAttributes(layoutAttrs) {
    this._layoutAttrs = layoutAttrs;
  }

  /**
   * Get the map of global layout attributes.
   * @return {object}
   */
  getLayoutAttributes() {
    return this._layoutAttrs;
  }

  /**
   * @protected
   * Add a node context for this layout.
   * @param {DvtDiagramLayoutContextNode} node node context to include in this layout
   */
  addNode(node) {
    if (!this.getNodeById(node.getId())) {
      this._nodeCount++;
      this._arNodes.push(node);
    }

    this._nodes.set(node.getId(), node);
  }

  /**
   * @protected
   * Add a node context to the lookup map. The map contains nodes being laid out and it might also contain
   * read-only nodes provided to support cross-container links in case of "container" layout.
   * @param {DvtDiagramLayoutContextNode} node node context to provide extra information for this layout
   */
  addNodeToMap(node) {
    this._nodes.set(node.getId(), node);
  }

  /**
   * @protected
   * Remove a node context from this layout.
   * @param {DvtDiagramLayoutContextNode} parent context for the parent node
   * @param {DvtDiagramLayoutContextNode} node node context to remove from this layout
   */
  removeNode(parent, node) {
    if (!node) return;
    if (parent) {
      ArrayUtils.removeItem(parent.getChildNodes(), node);
    } else {
      ArrayUtils.removeItem(this._arNodes, node);
      this._nodeCount--;
    }

    this._nodes.delete(node.getId());
  }

  /**
   * Get a node context by id.  Nodes being laid out and read-only nodes provided
   * as additional information to this layout can be retrieved through this
   * function.
   * @param {any} id id of node context to get
   * @return {DvtDiagramLayoutContextNode}
   */
  getNodeById(id) {
    return this._nodes.get(id);
  }

  /**
   * Get a node context by index.  Only nodes being laid out can be retrieved
   * through this function.
   * @param {number} index index of node context to get
   * @return {DvtDiagramLayoutContextNode}
   */
  getNodeByIndex(index) {
    return this._arNodes[index];
  }

  /**
   * Get the number of nodes to layout.  This number does not include any
   * read-only nodes provided as additional information to this layout.
   * @return {number}
   */
  getNodeCount() {
    return this._nodeCount;
  }

  /**
   * Add a link context for this layout.
   * @param {DvtDiagramLayoutContextLink} link link context to include in this layout
   */
  addLink(link) {
    if (!this.getLinkById(link.getId())) {
      this._linkCount++;
      this._arLinks.push(link);
    }

    this._links.set(link.getId(), link);
  }

  /**
   * Remove a link context from this layout.
   * @param {DvtDiagramLayoutContextLink} link link context to remove
   * @protected
   */
  removeLink(link) {
    if (!link) return;
    if (this.getLinkById(link.getId())) {
      ArrayUtils.removeItem(this._arLinks, link);
      this._linkCount--;
    }
    this._links.delete(link.getId());
  }

  /**
   * Get a link context by id.
   * @param {any} id id of link context to get
   * @return {DvtDiagramLayoutContextLink} link
   */
  getLinkById(id) {
    return this._links.get(id);
  }

  /**
   * Get a link context by index.
   * @param {number} index index of link context to get
   * @return {DvtDiagramLayoutContextLink}
   */
  getLinkByIndex(index) {
    return this._arLinks[index];
  }

  /**
   * Get the number of links to layout.
   * @return {number}
   */
  getLinkCount() {
    return this._linkCount;
  }

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
  localToGlobal(point, node) {
    var offset = this.GetGlobalOffset(node);

    return new DvtDiagramPoint(point['x'] + offset['x'], point['y'] + offset['y']);
  }

  /**
   * @protected
   * Get the position of the given node in the global coordinate system.
   * @param {DvtDiagramLayoutContextNode} node node to get global position for
   * @return {DvtDiagramPoint}
   */
  GetGlobalOffset(node) {
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
      } else {
        node = null;
      }
    }

    return offset;
  }

  /**
   * @protected
   * Set whether the locale has a right-to-left reading direction.
   * @param {boolean} bR2L true if right-to-left, false otherwise
   */
  setLocaleR2L(bR2L) {
    this._bLocaleR2L = bR2L;
  }

  /**
   * Get whether the reading direction for the locale is right-to-left.
   * @return {boolean}
   */
  isLocaleR2L() {
    return this._bLocaleR2L;
  }

  /**
   * @protected
   * Set the size of the Diagram.
   * @param {DvtDiagramRectangle} compSize size of Diagram
   */
  setComponentSize(compSize) {
    this._componentSize = compSize;
  }

  /**
   * Get the size of the Diagram.
   * @return {DvtDiagramRectangle}
   */
  getComponentSize() {
    return this._componentSize;
  }

  /**
   * Set the viewport the component should use after the layout, in the layout's
   * coordinate system.
   * @param {DvtDiagramRectangle} viewport viewport the component should use
   * after the layout
   */
  setViewport(viewport) {
    this._panZoomState = viewport
      ? DvtDiagramLayoutUtils.convertViewportToPanZoomState(
          viewport,
          this._componentSize.w,
          this._componentSize.h
        )
      : null;
  }

  /**
   * Get the viewport the component should use after the layout, in the layout's
   * coordinate system.
   * @return {DvtDiagramRectangle}
   */
  getViewport() {
    return this._panZoomState
      ? DvtDiagramLayoutUtils.convertPanZoomStateToViewport(
          this._panZoomState,
          this._componentSize.w,
          this._componentSize.h
        )
      : null;
  }

  /**
   * Set the panZoom state the component should use after the layout.
   * @param {Object} panZoomState panZoomState the component should use
   * after the layout
   */
  setPanZoomState(panZoomState) {
    this._panZoomState = panZoomState;
  }

  /**
   * Get the panZoomState the component should use after the layout, in the layout's
   * coordinate system.
   * @return {Object}
   */
  getPanZoomState() {
    return this._panZoomState;
  }

  /**
   * @protected
   * Set the id of the container whose nodes are being laid out.
   * @param {any} containerId id of the container whose nodes are being laid
   * out
   */
  setContainerId(containerId) {
    this._containerId = containerId;
  }

  /**
   * Get the id of the container whose nodes are being laid out, or null if this
   * is the top level Diagram layout.
   * @return {any}
   */
  getContainerId() {
    return this._containerId;
  }

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
  setContainerPadding(top, right, bottom, left) {
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
  }

  /**
   * Get the padding of the container whose children are being laid out.
   * Values can be retrieved from the returned map using keys 'top', 'left',
   * 'bottom', and 'right'.
   * @return {object}
   */
  getContainerPadding() {
    return this._containerPadding;
  }

  /**
   * Set the current viewport used by the component in the layout's coordinate system.
   * @param {DvtDiagramRectangle} viewport The viewport currently used by the component
   */
  setCurrentPanZoomState(panZoomState) {
    this._currentPanZoomState = panZoomState;
  }

  /**
   * Get the current viewport used by the component in the layout's coordinate system for the top level diagram
   * @return {DvtDiagramRectangle} current viewport
   */
  getCurrentViewport() {
    return this._currentPanZoomState
      ? DvtDiagramLayoutUtils.convertPanZoomStateToViewport(
          this._currentPanZoomState,
          this._componentSize.w,
          this._componentSize.h
        )
      : null;
  }

  /**
   * The function retrieves nearest common ancestor container for two nodes.
   * @param {any} nodeId1 first node id
   * @param {any} nodeId2 second node id
   * @return {any}  id for the first common ancestor container or null for top level diagram
   */
  getCommonContainer(nodeId1, nodeId2) {
    var getAllAncestorIds = (id, context) => {
      var ids = [];
      var containerId = context.getNodeById(id) ? context.getNodeById(id).getContainerId() : null;
      while (containerId) {
        ids.push(containerId);
        containerId = context.getNodeById(containerId)
          ? context.getNodeById(containerId).getContainerId()
          : null;
      }
      ids.reverse();
      return ids;
    };

    var startPath = getAllAncestorIds(nodeId1, this);
    var endPath = getAllAncestorIds(nodeId2, this);
    var commonId = null;

    for (var i = 0; i < startPath.length && i < endPath.length; i++) {
      if (!DvtDiagramDataUtils.compareValues(this.Context, startPath[i], endPath[i])) break;
      commonId = startPath[i];
    }
    return commonId;
  }

  /**
   * Gets event data object. Values can be retrieved from the object using 'type' and 'data' keys.
   * @return {object} event data object
   */
  getEventData() {
    return this._eventData;
  }

  /**
   * @protected
   * Sets event data object
   * @param {object} eventData event data object
   */
  setEventData(eventData) {
    this._eventData = eventData;
  }

  /**
   * @protected
   * Sets dirty context for the layout
   * @param {object} dirtyContext a map that contains dirty context for the layout
   */
  setDirtyContext(dirtyContext) {
    this._dirtyContext = dirtyContext;
  }

  /**
   * @protected
   * Gets dirty context for the layout
   * @return {object} a map that contains dirty context for the layout
   */
  getDirtyContext() {
    return this._dirtyContext;
  }
}

/**
 * Overview window for diagram.
 * @param {Diagram} diagram The parent diagram who owns the overview.
 * @class
 * @constructor
 * @extends {Overview}
 */
class DvtDiagramOverview extends Overview {
  constructor(diagram) {
    super(diagram.getCtx(), diagram.processEvent, diagram);
    this._id = diagram.getId() + '_overview';
  }

  /**
   * Creates diagram content
   * @override
   */
  renderData(width, height) {
    this.Content = DvtDiagramOverviewUtils.CreateOverviewContent(
      this._callbackObj,
      this,
      width,
      height
    );
    this.addChild(this.Content);
    this.Content.setMouseEnabled(false);
  }

  /**
   * Override to change styles, interation and update viewport
   * @override
   */
  render() {
    var width = Math.min(this._callbackObj.Width, this._callbackObj.Options.overview.width);
    var height = Math.min(this._callbackObj.Height, this._callbackObj.Options.overview.height);
    var styleMap = this._callbackObj.Options.styleDefaults._overviewStyles;
    var options = {
      xMin: 0,
      xMax: width,
      yMin: 0,
      yMax: height,
      x1: 0,
      x2: width,
      y1: 0,
      y2: height,
      style: {
        overviewBackgroundColor: styleMap.overview.backgroundColor,
        windowBackgroundColor: styleMap.viewport.backgroundColor,
        windowBorderTopColor: styleMap.viewport.borderColor,
        windowBorderRightColor: styleMap.viewport.borderColor,
        windowBorderBottomColor: styleMap.viewport.borderColor,
        windowBorderLeftColor: styleMap.viewport.borderColor,
        timeAxisBarColor: '#00000000' // render time axis bar invisible - diagram does not need it
      },
      animationOnClick: 'off',
      featuresOff: 'zoom'
    };
    var isEmpty = this._callbackObj.GetAllRoots().length === 0 ? true : false;
    this._viewportConstraints = {
      xMin: isEmpty ? 0 : -Number.MAX_VALUE,
      yMin: isEmpty ? 0 : -Number.MAX_VALUE,
      xMax: isEmpty ? width : Number.MAX_VALUE,
      yMax: isEmpty ? height : Number.MAX_VALUE
    };
    if (!this._callbackObj.IsPanningEnabled()) {
      this.setMouseEnabled(false);
    }
    // now call super to render the scrollbar
    super.render(options, width, height);
  }

  /**
   * Insert animation
   */
  animateInsert() {
    // do nothing
  }

  /**
   * Delete animation
   */
  animateDelete() {
    // do nothing
  }

  /**
   * Creates the update animation for the diagram overvew
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
   * @param {DvtDiagramOverview} oldDiagramOverview the old overview
   */
  animateUpdate(animationHandler, oldDiagramOverview) {
    // animate content  - fade in/out and matrix
    this.Content.setAlpha(0);
    animationHandler.add(
      new AnimFadeIn(this.getCtx(), this.Content, animationHandler.getAnimDur()),
      DvtDiagramDataAnimationPhase.UPDATE
    );

    var idx = this.getChildIndex(this.Content);
    this.addChildAt(oldDiagramOverview.Content, idx + 1);
    var removeFunc = () => {
      oldDiagramOverview.Content.getParent().removeChild(oldDiagramOverview.Content);
    };
    var fadeOutAnim = new AnimFadeOut(
      this.getCtx(),
      oldDiagramOverview.Content,
      animationHandler.getAnimDur()
    );
    Playable.appendOnEnd(fadeOutAnim, removeFunc);
    animationHandler.add(fadeOutAnim, DvtDiagramDataAnimationPhase.UPDATE);

    //animate viewport
    var customContentAnim = new CustomAnimation(
      this.getCtx(),
      null,
      animationHandler.getAnimDur()
    );
    var oldAnimationParams = oldDiagramOverview.GetAnimParams();
    var newAnimationParams = this.GetAnimParams();
    this.SetAnimParams(oldAnimationParams);
    customContentAnim
      .getAnimator()
      .addProp(
        Animator.TYPE_NUMBER_ARRAY,
        this,
        this.GetAnimParams,
        this.SetAnimParams,
        newAnimationParams
      );

    animationHandler.add(customContentAnim, DvtDiagramDataAnimationPhase.UPDATE);
  }

  /**
   * Updates panning constraints for the overview viewport using panning constraints for the main diagram
   * @param {number} minPanX min x coordinate for the diagram content
   * @param {number} minPanY min y coordinate for the diagram content
   * @param {number} maxPanX max x coordinate for the diagram content
   * @param {number} maxPanY max y coordinate for the diagram content
   */
  updateConstraints(minPanX, minPanY, maxPanX, maxPanY) {
    var zoom = this._callbackObj.getPanZoomCanvas().getZoom();

    // maxPanX/maxPanY: bottom right point for the content with zoom adjustment corresponds to top left point in overview viewport
    // minPanX,minPanY: top left point for the content with zoom adjustment corresponds to bottom right point in overview viewport
    var topLeft = DvtDiagramOverviewUtils.TransformFromContentToViewportCoords(
      -maxPanX / zoom,
      -maxPanY / zoom,
      this
    );
    var bottomRight = DvtDiagramOverviewUtils.TransformFromContentToViewportCoords(
      -minPanX / zoom,
      -minPanY / zoom,
      this
    );
    var width = this._viewportPosition.x2 - this._viewportPosition.x1;
    var height = this._viewportPosition.y2 - this._viewportPosition.y1;
    var panDirection = this._callbackObj.getPanDir();

    this._viewportConstraints = {
      xMin: panDirection === 'y' ? this._viewportPosition.x1 : topLeft.x,
      xMax: panDirection === 'y' ? this._viewportPosition.x2 : bottomRight.x + width,
      yMin: panDirection === 'x' ? this._viewportPosition.y1 : topLeft.y,
      yMax: panDirection === 'x' ? this._viewportPosition.y2 : bottomRight.y + height
    };
  }

  /**
   * @override
   */
  getMinimumPositionX() {
    return this._viewportConstraints.xMin;
  }

  /**
   * @override
   */
  getMinimumPositionY() {
    return this._viewportConstraints.yMin;
  }

  /**
   * @override
   */
  getMaximumPositionX() {
    return this._viewportConstraints.xMax;
  }

  /**
   * @override
   */
  getMaximumPositionY() {
    return this._viewportConstraints.yMax;
  }

  /**
   * @override
   */
  getMinimumWindowWidth() {
    return 0;
  }

  /**
   * @override
   */
  getMaximumWindowWidth() {
    return Number.MAX_VALUE;
  }

  /**
   * @override
   */
  getMinimumWindowHeight() {
    return 0;
  }

  /**
   * @override
   */
  getMaximumWindowHeight() {
    return Number.MAX_VALUE;
  }

  /**
   * Updates overview viewport
   * @protected
   */
  UpdateViewport() {
    if (this._bCancelUpdateViewport) return;
    var newViewport = DvtDiagramOverviewUtils.CalcViewportFromMatrix(this._callbackObj);
    var topLeft = DvtDiagramOverviewUtils.TransformFromContentToViewportCoords(
      newViewport.x,
      newViewport.y,
      this
    );
    var bottomRight = DvtDiagramOverviewUtils.TransformFromContentToViewportCoords(
      newViewport.x + newViewport.w,
      newViewport.y + newViewport.h,
      this
    );

    this._viewportPosition = { x1: topLeft.x, x2: bottomRight.x, y1: topLeft.y, y2: bottomRight.y };
    this.setViewportRange(topLeft.x, bottomRight.x, topLeft.y, bottomRight.y);
  }

  /**
   * Viewport change handler
   * @protected
   */
  HandleViewportChange(event) {
    var newX1 = event.newX1 !== undefined ? event.newX1 : this._viewportPosition.x1;
    var newY1 = event.newY1 !== undefined ? event.newY1 : this._viewportPosition.y1;
    var oldTopLeft = DvtDiagramOverviewUtils.TransformFromViewportToContentCoords(
      this._viewportPosition.x1,
      this._viewportPosition.y1,
      this
    );
    var newTopLeft = DvtDiagramOverviewUtils.TransformFromViewportToContentCoords(
      newX1,
      newY1,
      this
    );

    this._viewportPosition.x1 = newX1;
    this._viewportPosition.y1 = newY1;

    var zoom = this._callbackObj.getPanZoomCanvas().getZoom();
    var dx = (newTopLeft.x - oldTopLeft.x) * zoom;
    var dy = (newTopLeft.y - oldTopLeft.y) * zoom;
    if (dx !== 0 || dy !== 0) {
      this._bCancelUpdateViewport = true; // cancel HandleViewportChange as redundant
      this._callbackObj.getPanZoomCanvas().panBy(-dx, -dy, null, null, true);
      this._bCancelUpdateViewport = false;
    }
  }

  /**
   * Returns the animation params for the viewport.
   * @return {array} params
   * @private
   */
  GetAnimParams() {
    var params = [];
    var slidingWindow = this.getSlidingWindow();
    var leftHandle = this.getLeftHandle();
    var rightHandle = this.getRightHandle();
    var bottomBar = this.getBottomBar();
    var topBar = this.getTopBar();

    params.push(
      slidingWindow.getTranslateX(),
      slidingWindow.getTranslateY(),
      slidingWindow.getWidth(),
      slidingWindow.getHeight()
    );

    params.push(leftHandle.getX1(), leftHandle.getY1(), leftHandle.getX2(), leftHandle.getY2());

    params.push(rightHandle.getX1(), rightHandle.getY1(), rightHandle.getX2(), rightHandle.getY2());

    params.push(bottomBar.getX1(), bottomBar.getY1(), bottomBar.getX2(), bottomBar.getY2());

    params.push(topBar.getX1(), topBar.getY1(), topBar.getX2(), topBar.getY2());

    return params;
  }

  /**
   * Updates the animation params for the viewport.
   * @param {array} params
   * @protected
   */
  SetAnimParams(params) {
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
    topBar.setY2(params[i]);
  }

  /**
   * Creates a container that contains overview properties needed for partial update animation
   * @protected
   */
  CloneAnim() {
    var context = this.getCtx();
    var overviewClone = new Container(context, 'g', this.getId());
    overviewClone.ContentBounds = this._callbackObj.GetViewBounds();
    overviewClone.setMouseEnabled(false);
    var ovContentClone = new Container(context, 'g', 'ovContentClone');
    overviewClone.addChild(ovContentClone);
    overviewClone.Content = ovContentClone;
    overviewClone.Nodes = new context.ojMap();
    overviewClone.Diagram = this._callbackObj;

    var rootNodes = this._callbackObj.GetRootNodeObjects();
    if (rootNodes.length > 0) {
      rootNodes.forEach((node) => {
        DvtDiagramOverviewUtils.CreateOverviewNode(
          overviewClone.Diagram,
          overviewClone,
          node,
          ovContentClone
        );
      });
      DvtDiagramOverviewUtils.ZoomToFitOverviewContent(
        overviewClone.Diagram,
        overviewClone,
        ovContentClone,
        this.Width,
        this.Height
      );
    }

    var cloneAnimationParams = this.GetAnimParams();
    overviewClone.GetAnimParams = () => {
      return cloneAnimationParams;
    };

    return overviewClone;
  }
}

/**
 *  Provides automation services for a DVT diagram component.
 *  @class  DvtDiagramAutomation
 *  @param {Diagram} dvtComponent
 *  @implements {dvt.Automation}
 *  @constructor
 */
class DvtDiagramAutomation extends Automation {
  /**
   * Valid subIds include:
   * <ul>
   * <li>link[rowIndex]</li>
   * <li>node[rowIndex]</li>
   * <li>tooltip</li>
   * </ul>
   * @override
   */
  GetSubIdForDomElement(displayable) {
    var logicalObj = this._comp.getEventManager().GetLogicalObject(displayable);
    if (logicalObj && logicalObj instanceof DvtDiagramNode) {
      return 'node[' + this._comp.GetAllNodes().indexOf(logicalObj.getId()) + ']';
    } else if (logicalObj && logicalObj instanceof DvtDiagramLink) {
      return 'link[' + this._comp.GetAllLinks().indexOf(logicalObj.getId()) + ']';
    }
    return null;
  }

  /**
   * Valid subIds include:
   * <ul>
   * <li>link[rowIndex]</li>
   * <li>node[rowIndex]</li>
   * <li>tooltip</li>
   * </ul>
   * @override
   */
  getDomElementForSubId(subId) {
    if (subId == Automation.TOOLTIP_SUBID) return this.GetTooltipElement(this._comp);

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
  }

  /**
   * Parses a Diagram subId string into a map of component and index
   * @param {String} subId diagram subId to parse
   * @return {Object}
   * @private
   */
  _parseSubId(subId) {
    var component = subId;
    var index = -1;
    var substring = subId.substring(0, subId.indexOf('['));
    if (substring) {
      component = substring == 'node' || substring == 'link' ? substring : null;
      index = parseInt(subId.substring(subId.indexOf('[') + 1, subId.indexOf(']')));
    }
    return { component, index };
  }

  /**
   * Get the number of nodes in diagram
   * @return {Number} number of nodes
   */
  getNodeCount() {
    return this._comp.GetAllNodes().length;
  }

  /**
   * Get the number of links in diagram
   * @return {Number} number of links
   */
  getLinkCount() {
    return this._comp.GetAllLinks().length;
  }

  /**
   * Gets diagram node data object for the given index
   * @param {Number} nodeIndex  node index
   * @return {Object} node data object
   */
  getNode(nodeIndex) {
    var node = this._getNode(nodeIndex);
    if (node) {
      var data = {
        id: node.getId(),
        selected: node.isSelected(),
        tooltip: node.getShortDesc(),
        label: node.getData()['label'],
        icon: this._getMarkerData(node.GetIcon()),
        expanded: node.isDisclosed()
      };
      var backgroundStyle = node.getData()['backgroundStyle'];
      if (backgroundStyle && backgroundStyle instanceof Object)
        backgroundStyle = CSSStyle.cssObjectToString(backgroundStyle);
      data['background'] = backgroundStyle;
      return data;
    }
    return null;
  }

  /**
   * Gets diagram link data object for the given index
   * @param {Number} linkIndex  link index
   * @return {Object} link data object
   */
  getLink(linkIndex) {
    var link = this._getLink(linkIndex);
    if (link) {
      var data = {
        id: link.getId(),
        selected: link.isSelected(),
        tooltip: link.getShortDesc(),
        label: link.getData()['label'],
        color: link.getLinkColor(),
        width: link.getLinkWidth(),
        style: this._getLinkStyleFromObject(link.getLinkStyle()),
        startNode: link.getStartId(),
        endNode: link.getEndId(),
        startConnectorType: link.getStartConnectorType(),
        endConnectorType: link.getEndConnectorType(),
        promoted: link.isPromoted()
      };
      if (link.isPromoted()) {
        data['links'] = JsonUtils.clone(link.getData()['_links']);
      }
      return data;
    }
    return null;
  }

  /**
   * Gets diagram promoted link data object for the given nodes
   * @param {Number} startIndex  start node index
   * @param {Number} endIndex  end node index
   * @return {Object} link data object
   */
  getPromotedLink(startIndex, endIndex) {
    var startNode = this._getNode(startIndex);
    var endNode = this._getNode(endIndex);
    if (!startNode || !endNode) return null;
    var linkId = DvtDiagramLink.GetPromotedLinkId(this._comp, startNode.getId(), endNode.getId());
    var link = this._comp.getLinkById(linkId);
    if (link) {
      return {
        id: link.getId(),
        selected: link.isSelected(),
        tooltip: link.getShortDesc(),
        color: link.getLinkColor(),
        width: link.getLinkWidth(),
        style: this._getLinkStyleFromObject(link.getLinkStyle()),
        startNode: link.getStartId(),
        endNode: link.getEndId(),
        startConnectorType: link.getStartConnectorType(),
        endConnectorType: link.getEndConnectorType(),
        count: link.getData()['_links'].length
      };
    }
    return null;
  }

  /**
   * Get link style type from style object
   * @param {object} linkStyle  link style object
   * @return {string} link style
   * @private
   */
  _getLinkStyleFromObject(linkStyle) {
    if (this._comp.getCtx().isCustomElement()) {
      return CSSStyle.cssObjectToString(linkStyle);
    } else if (linkStyle && linkStyle instanceof Object) {
      //For custom link style, convert the object to string
      if (linkStyle['_type'] == DvtDiagramLink.CUSTOM_STYLE) {
        var styleObj = JsonUtils.clone(linkStyle);
        delete styleObj['_type'];
        return CSSStyle.cssObjectToString(styleObj);
      } else {
        return linkStyle['_type'];
      }
    }
    return linkStyle;
  }

  /**
   * Get array of expanded nodes
   * @return {Array} expanded nodes
   */
  getExpanded() {
    return this._comp.DisclosedNodes;
  }

  /**
   * @private
   * Get marker data from marker
   * @param {dvt.SimpleMarker|dvt.ImageMarker} marker Displayable marker object
   * @return {Object} Marker data object
   */
  _getMarkerData(marker) {
    if (marker) {
      var data = {};
      // public api expects image markers to return a shape of 'none'
      data['shape'] = marker instanceof SimpleMarker ? marker.getType() : 'none';
      if (marker.getFill()) data['color'] = marker.getFill().getColor();
      return data;
    }
    return null;
  }

  /**
   * Gets diagram node for the given index
   * @param {Number} nodeIndex  node index
   * @return {DvtDiagramNode} node
   * @private
   */
  _getNode(nodeIndex) {
    var nodeIds = this._comp.GetAllNodes();
    return nodeIndex >= 0 && nodeIndex < nodeIds.length
      ? this._comp.getNodeById(nodeIds[nodeIndex])
      : null;
  }

  /**
   * Gets diagram link for the given index
   * @param {Number} linkIndex  link index
   * @return {DvtDiagramLink} link
   * @private
   */
  _getLink(linkIndex) {
    var linkIds = this._comp.GetAllLinks();
    return linkIndex >= 0 && linkIndex < linkIds.length
      ? this._comp.getLinkById(linkIds[linkIndex])
      : null;
  }
}

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
 * @param {Diagram} diagram the parent diagram component
 * @param {string} type event type
 * @param {Object} event event data
 * initializing this context
 */
class DvtDiagramDataAnimationState {
  constructor(diagram, type, event) {
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
      this.Overview = this.IsPartialUpdate ? diagram.Overview.CloneAnim() : diagram.Overview;
    }
    this.NodesMap = this._diagram.GetAllNodesMap();
    this.LinksMap = this._diagram.GetAllLinksMap();
    this._setNodes(type, event);
    this._setLinks(type, event);
  }

  /**
   * Get the id of the state.
   * @return {string}
   */
  getId() {
    return this._diagram.getId();
  }

  /**
   * Gets options for the diagram state
   * @return {object} option
   */
  getOptions() {
    return this._diagram.getOptions();
  }

  /**
   * Gets nodes used for diagram animation
   * @return {array} flat array of nodes - roots for complete refresh
   *                or an array of modified nodes for partial update
   */
  getNodes() {
    return this._nodes;
  }

  /**
   * Gets links used for diagram animation
   * @return {array} an array of links to animate
   */
  getLinks() {
    return this._links;
  }

  /**
   * Gets an array of new nodes in the updated diagram, that should be used for animation
   * @return {array} an array of new node states
   */
  getNewNodes() {
    return this._newNodes;
  }

  /**
   * Gets an array of new links in the updated diagram, that should be used for animation
   * @return {array} an array of new link states
   */
  getNewLinks() {
    return this._newLinks;
  }

  /**
   * Updates states using objects from event - populates new links and nodes arrays with new objects.
   * Done as a second step during event updates.
   * @param {string} type event type if applicable
   * @param {Object} event event data
   */
  updateStateFromEvent(type, event) {
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
        link =
          this._diagram.getLinkById(linkId) ||
          (this._diagram._linkToPromotedMap &&
            this._diagram.getLinkById(this._diagram._linkToPromotedMap[linkId]));
        if (link) {
          this._newLinks.push(link);
          this._processedObjMap.set(link.getId(), true);
        }
      }
    } else if (type == 'change') {
      for (i = 0; links && i < links.length; i++) {
        linkId = links[i]['id'];
        link =
          this._diagram.getLinkById(linkId) ||
          (this._diagram._linkToPromotedMap &&
            this._diagram.getLinkById(this._diagram._linkToPromotedMap[linkId]));
        if (link) {
          this._newLinks.push(link);
          this._processedObjMap.set(link.getId(), true);
        }
      }
    }
    // we don't have to do anything for remove, since old objects are populated and new ones are not created
  }

  /**
   * Updates states using objects from dirty content. The objects processed earlier during event updates will be skipped.
   * @param {DvtDiagramLayoutContext} layoutContext diagram layout context
   */
  updateStateFromLayoutContext(layoutContext) {
    if (this.IsPartialUpdate) {
      var thisRef = this;
      var dirtyLayoutContext = layoutContext.getDirtyContext();
      dirtyLayoutContext.forEach((obj, objId, map) => {
        if (!thisRef._processedObjMap.has(objId)) {
          var objFromMap =
            thisRef._diagram.getNodeById(objId) || thisRef._diagram.getLinkById(objId);
          if (objFromMap instanceof DvtDiagramNode) {
            thisRef._nodes.push(objFromMap.getAnimationState());
            thisRef._newNodes.push(objFromMap);
            thisRef._processedObjMap.set(objId, true);
          } else if (objFromMap instanceof DvtDiagramLink) {
            thisRef._links.push(objFromMap.getAnimationState());
            thisRef._newLinks.push(objFromMap);
            thisRef._processedObjMap.set(objId, true);
          }
        }
      });
    }
  }

  /**
   * Sets nodes used for diagram animation
   * @param {string} type event type if applicable
   * @param {Object} event event data
   * @private
   */
  _setNodes(type, event) {
    if (this.IsPartialUpdate) {
      var nodes = event['data']['nodes'];
      var parentId = event['parentId'];
      var node;
      if (type == 'add') {
        this._addAncestorStates(parentId);
      } else if (type == 'change') {
        for (var i = 0; nodes && i < nodes.length; i++) {
          node = this._diagram.getNodeById(nodes[i]['id']);
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
          for (var j = 0; j < nodes.length; j++) {
            node = this._diagram.getNodeById(nodes[j]['id']);
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
  }

  /**
   * Sets links used for diagram animation
   * @param {string} type event type if applicable
   * @param {Object} event event data
   * @private
   */
  _setLinks(type, event) {
    if (this.IsPartialUpdate) {
      var links = event['data']['links'];
      if (!links) return;
      var i, link, linkId;
      if (type == 'change') {
        for (i = 0; i < links.length; i++) {
          linkId = links[i]['id'];
          link =
            this._diagram.getLinkById(linkId) ||
            (this._diagram._linkToPromotedMap &&
              this._diagram.getLinkById(this._diagram._linkToPromotedMap[linkId]));
          if (link) {
            this._links.push(link.getAnimationState());
            this._processedObjMap.set(link.getId(), true);
          }
        }
      } else if (type == 'remove') {
        for (i = 0; i < links.length; i++) {
          linkId = links[i]['id'];
          link =
            this._diagram.getLinkById(linkId) ||
            (this._diagram._linkToPromotedMap &&
              this._diagram.getLinkById(this._diagram._linkToPromotedMap[linkId]));
          if (link) {
            this._links.push(link);
            this._processedObjMap.set(link.getId(), true);
          }
        }
      }
    } else {
      this._links = this._diagram.GetAllLinkObjects();
    }
  }

  /**
   * Populates new and old states for updated container nodes
   * @param {string} parentId id for updated container
   * @private
   */
  _addAncestorStates(parentId) {
    var parentNode = parentId ? this._diagram.getNodeById(parentId) : null;
    // use this member during add nodes operation - animate new nodes when they are
    // added to to the top level or an already disclosed container
    this._wasParentDisclosed = parentNode ? parentNode.isDisclosed() : true;
    while (parentNode) {
      var keepOriginal =
        DvtDiagramDataUtils.compareValues(this._context, parentNode.getId(), parentId) ||
        (parentNode.isDisclosed() && this._diagram.getOptions()['renderer']);
      var oldState = parentNode.getAnimationState(keepOriginal);
      this._nodes.push(oldState);
      this._newNodes.push(parentNode);
      this._processedObjMap.set(parentNode.getId(), true);
      parentNode = parentNode.getGroupId()
        ? this._diagram.getNodeById(parentNode.getGroupId())
        : null;
    }
  }
}

/**
 * Animation handler for Diagram
 * @param {dvt.Context} context the platform specific context object
 * @param {dvt.Container} deleteContainer the container where deletes should be moved for animation
 * @param {object} oldDiagram an object representing the old diagram state
 * @param {Diagram} newDiagram the diagram component
 * @class DvtDiagramDataAnimationHandler
 * @extends dvt.DataAnimationHandler
 * @constructor
 */
class DvtDiagramDataAnimationHandler extends DataAnimationHandler {
  constructor(context, deleteContainer, oldDiagram, newDiagram) {
    super(context, deleteContainer);
    this._oldDiagram = oldDiagram;
    this._newDiagram = newDiagram;
  }

  /**
   * Returns the old diagram state
   * @return {object} an object representing the old diagram state
   */
  getOldDiagram() {
    return this._oldDiagram;
  }

  /**
   * Returns the new diagram state
   * @return {Diagram} the diagram component
   */
  getNewDiagram() {
    return this._newDiagram;
  }

  /**
   * Gets the animation duration
   * @return {number} the animation duration
   */
  getAnimDur() {
    return DvtDiagramStyleUtils.getAnimDur(this._oldDiagram);
  }

  /**
   * @override
   */
  constructAnimation(oldList, newList) {
    var bLinks = false;
    if (newList && newList.length > 0) {
      bLinks = newList[0] instanceof DvtDiagramLink;
    }

    if (bLinks && !this.getCtx().isOffscreen()) {
      var context = this.getCtx();
      // process diagram links - check expanding a promoted link or collapsing multiple into a promoted link
      var oldLinksMap = DvtDiagramDataAnimationHandler._expandLinksArrayToMap(context, oldList),
        newLinksMap = DvtDiagramDataAnimationHandler._expandLinksArrayToMap(context, newList);
      var oldLink, newLink, oldId;
      var skip = new context.ojMap();
      var thisRef = this;
      var removedPromotedId = new Set();

      oldLinksMap.forEach((link, linkId, map) => {
        oldLink = link;
        newLink = newLinksMap.get(linkId);

        //do nothing if the link is invisible
        if (!newLink) {
          oldId = oldLink.getId();
          if (thisRef.getNewDiagram().GetAllLinks().indexOf(oldId) == -1) {
            if (!removedPromotedId.has(oldId)) {
              oldLink.animateDelete(thisRef);
              removedPromotedId.add(oldId);
            }
          }
        }
        //identical direct links - update
        else if (!oldLink.isPromoted() && !newLink.isPromoted()) {
          newLink.animateUpdate(thisRef, oldLink);
        }
        //match found but one or both of the links is inside of promoted link - collapsed, expanded or update case
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
      });

      //check for inserts
      newLinksMap.forEach((link, linkId, map) => {
        oldLink = oldLinksMap.get(linkId);
        newLink = link;
        // if no match found, check if the link is invisible, do nothing for invisible link
        if (!oldLink && !thisRef.getOldDiagram().LinksMap.has(newLink.getId())) {
          newLink.animateInsert(thisRef);
        }
      });
    } else {
      super.constructAnimation(oldList, newList);
    }
  }

  /**
   * Helper method that constracts expand or collapse animation for promoted links
   * @param {DvtDiagramLink} linkToAnimate active link that should be collapsed or expanded
   * @param {object} testLinksMap map of links on the opposite side - new links map for expanding old link or old links map for collapsing new link
   * @param {object} skipMap map of processed links that has to be updated by this function
   * @param {boolean} expandFlag true to indicate expand, false to indicate collapse
   * @private
   */
  _constructExpandCollapseAnimation(linkToAnimate, testLinksMap, skipMap, expandFlag) {
    var linksToAnimate = [];
    var consolidatedLinks = linkToAnimate.getData()['_links'];
    for (var li = 0; li < consolidatedLinks.length; li++) {
      var testLink = testLinksMap.get(consolidatedLinks[li]['id']);
      if (testLink && linksToAnimate.indexOf(testLink) === -1) {
        linksToAnimate.push(testLink);
      }
    }
    if (linksToAnimate.length > 0) {
      if (expandFlag) linkToAnimate.animateExpand(this, linksToAnimate);
      else linkToAnimate.animateCollapse(this, linksToAnimate);
      skipMap.set(linkToAnimate.getId(), true);
    }
  }

  /**
   * Helper method that converts an array of links in to a map.
   * The method also expands promoted links into single links in order to support expand and collapse animation
   * @param {array} linkArray array of links
   * @return {Object} map of links stored by id
   * @private
   */
  static _expandLinksArrayToMap(context, linkArray) {
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
  }
}

/**
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @constructor
 */
class Diagram extends PanZoomComponent {
  constructor(context, callback, callbackObj) {
    super(context, callback, callbackObj);
    //: force text to scale linearly
    this.getCtx().getStage().getElem().setAttributeNS(null, 'text-rendering', 'geometricPrecision');

    this._linksPane = new Container(context);
    this._nodesPane = new Container(context);
    this._topPane = new Container(context);

    // BUG JET-31495 - IMPOSSIBLE TO REMOVE HOVER TREATMENT AND TOOLTIP, WHEN INLINE TEMPLATE IS USED
    // Create a layer for storing touch event source elements temporarily when needed
    // so as to not break the events
    if (Agent.isTouchDevice()) {
      this._touchEventPane = new Container(context);
      this._touchEventPane.setStyle({ display: 'none' });
    }

    // Create the defaults object
    this.Defaults = new DvtDiagramDefaults(context);

    // Create the event handler and add event listeners
    this.EventManager = new DvtDiagramEventManager(context, this.processEvent, this);
    this.EventManager.addListeners(this);

    // Set up keyboard handler on non-touch devices
    if (!Agent.isTouchDevice())
      this.EventManager.setKeyboardHandler(new DvtDiagramKeyboardHandler(this, this.EventManager));

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
  }
  /**
   * Returns a new instance of Diagram. Currently only called by json supported platforms.
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @return {Diagram}
   */
  static newInstance(context, callback, callbackObj) {
    return new Diagram(context, callback, callbackObj);
  }

  /**
   * Calculates the panZoomState given a panZoomCanvas
   * @param {dvt.PanZoomCanvas} pzc the panZoomCanvas to calculate the panZoomState from
   * @return {object}
   */
  _calcPanZoomState(pzc) {
    var panX = pzc.getPanX();
    var panY = pzc.getPanY();
    var zoom = pzc.getZoom();
    var offset = this.getLayoutOffset();
    var centerX = (this.Width * 0.5 - panX) / zoom - offset.x;
    var centerY = (this.Height * 0.5 - panY) / zoom - offset.y;
    return { zoom: zoom, centerX: centerX, centerY: centerY };
  }

  /**
   * @override
   */
  PreRender() {
    if (this._bRendered) {
      this._currentPanZoomState = this._calcPanZoomState(this.getPanZoomCanvas());
    }
    if (!this.IsResize() && this._bRendered) {
      if (DvtDiagramStyleUtils.getAnimOnDataChange(this) != 'none') {
        this._oldDataAnimState = new DvtDiagramDataAnimationState(this);
      }
      this._bRendered = false;
      // save old pan zoom canvas for data transitions
      this._oldPanZoomCanvas = this.getPanZoomCanvas();
      this._setDataSourceListeners(this.getOptions()['data'], false);
    }
    if (!this.IsResize()) {
      this.ResetNodesAndLinks();
      this._oldLayoutContext = this._layoutContext;
      this._layoutContext = null;
    } else if (this._layoutContext) {
      this._layoutContext.setEventData(null);
      this._layoutContext.setComponentSize(
        new DvtDiagramRectangle(0, 0, this.getWidth(), this.getHeight())
      );
    }
  }

  /**
   * Resets nodes and links
   * @protected
   */
  ResetNodesAndLinks() {
    var context = this.getCtx();
    this.setLinksPane(new Container(context));
    this.setNodesPane(new Container(context));
    this.setTopPane(new Container(context));
    this._nodes = new context.ojMap();
    this._arNodeIds = [];
    this._arRootIds = [];
    this._links = new context.ojMap();
    this._arLinkIds = [];
    // Make sure we're not holding references to any obsolete nodes/links
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

    if (this.activeInnerElems) {
      var activeElem = document.activeElement;
      if (this.getElem().contains(activeElem)) {
        // oldActiveElemId is the id of the tabbable element
        this._oldActiveElemId = activeElem.id;
        if (!this._oldActiveElemId) {
          // if active elem does not have id, look for the nearest custom element that does have an id
          // stop looking when you hit the diagram
          while (
            !(
              (CustomElementUtils.isElementRegistered(activeElem.tagName) && activeElem.id) ||
              activeElem.tagName === 'OJ-DIAGRAM'
            )
          ) {
            activeElem = activeElem.parentElement;
          }
          if (activeElem.tagName !== 'OJ-DIAGRAM') {
            this._oldActiveCustomElemId = activeElem.id;
          }
        }
      } else {
        this.activeInnerElems = null;
      }
    }
  }

  /**
   * Hook for cleaning up animation behavior at the end of the animation.
   * @private
   */
  _onAnimationEnd() {
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
  }

  /**
   * Creates the update animation for the diagram
   * @param {DvtDiagramDataAnimationHandler} animationHandler the animation handler, which can be used to chain animations
   * @param {Object} oldDiagramState the old diagram state to animate from
   */
  animateUpdate(animationHandler, oldDiagramState) {
    var playable = new CustomAnimation(this.getCtx(), null, animationHandler.getAnimDur());
    var oldMat = oldDiagramState.PanZoomMatrix;
    var newMat = this.getPanZoomCanvas().getContentPane().getMatrix();
    if (!oldMat.equals(newMat)) {
      this.getPanZoomCanvas().getContentPane().setMatrix(oldMat);
      playable
        .getAnimator()
        .addProp(
          Animator.TYPE_MATRIX,
          this.getPanZoomCanvas().getContentPane(),
          this.getPanZoomCanvas().getContentPane().getMatrix,
          this.getPanZoomCanvas().getContentPane().setMatrix,
          newMat
        );
    }
    var newNodes = oldDiagramState.IsPartialUpdate
      ? oldDiagramState.getNewNodes()
      : this.GetRootNodeObjects();
    var newLinks = oldDiagramState.IsPartialUpdate
      ? oldDiagramState.getNewLinks()
      : this.GetAllLinkObjects();
    animationHandler.constructAnimation(oldDiagramState.getNodes(), newNodes);
    animationHandler.constructAnimation(oldDiagramState.getLinks(), newLinks);
    animationHandler.constructAnimation([oldDiagramState.Overview], [this.Overview]);
    animationHandler.add(playable, DvtDiagramDataAnimationPhase.UPDATE);
  }

  /**
   * Resolves deferred child nodes and links data. Calls RenderComponentInternal() when all deferred data are resolved.
   * @param {oj.DiagramDataSource} dataSource oj.DiagramDataSource object that handles data for the component
   * @param {Object} nodeData option value for the individual node that might have child nodes to be resolved
   * @private
   */
  _resolveDeferredData(dataSource, nodeData) {
    if (
      nodeData == null ||
      this._isNodeDisclosed(nodeData['id']) ||
      this._discoverLinks(dataSource, nodeData)
    ) {
      var childData = dataSource['getData'](nodeData);
      this._deferredObjCount++;
      var thisRef = this;
      var renderCount = this._renderCount;
      childData.then(
        (value) => {
          thisRef._renderDeferredData(
            renderCount,
            dataSource,
            nodeData ? nodeData : thisRef.getOptions(),
            value
          );
        },
        (reason) => {
          thisRef._renderDeferredData(
            renderCount,
            dataSource,
            nodeData ? nodeData : thisRef.getOptions(),
            null
          );
        }
      );
    }
  }

  /**
   * Updates nodes option with resolved option, resolve child nodes if needed,
   * calls RenderComponentInternal() when all deferred options are resolved
   * @param {number} renderCount render count
   * @param {oj.DiagramDataSource} dataSource oj.DiagramDataSource object that handles data for the component
   * @param {Object} nodeData option value for the individual node that might have child nodes to be resolved
   * @param {Object} resolvedData child data object or null if the promise got rejected
   * @private
   */
  _renderDeferredData(renderCount, dataSource, nodeData, resolvedData) {
    if (renderCount === this._renderCount && this.getCtx().isReadyToRender()) {
      if (resolvedData != null) {
        nodeData['nodes'] = resolvedData['nodes'];
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
      } else {
        nodeData['nodes'] = null;
      }
      this._deferredObjCount--;
      if (this._deferredObjCount === 0) {
        this.RenderComponentInternal();
      }
    }
  }

  /**
   * Helper function that processes nodes and links data in order to build an array of unresolved nodes
   * that are needed for rendering promoted links
   * @param {Object} data an object that contains nodes and links arrays
   * @param {boolean} deepWalk flag to walk nodes recursively to build a map (used in Data provider case)
   * @private
   */
  _findUnresolvedLinks(data, deepWalk) {
    // do nothing if the component does not display promoted links
    // or if data came from data provider and promoted link behavior is 'lazy'
    if (
      this.getOptions()['promotedLinkBehavior'] === 'none' ||
      (this.isDataProviderMode() && this.getOptions()['promotedLinkBehavior'] === 'lazy')
    ) {
      return;
    }

    var mapAllNodes = (data, allNodeIdsMap) => {
      if (Array.isArray(data['nodes'])) {
        data['nodes'].forEach((node) => {
          allNodeIdsMap.set(node['id'], true);
          if (deepWalk) {
            mapAllNodes(node, allNodeIdsMap);
          }
        });
      }
    };
    mapAllNodes(data, this._allNodeIdsMap);

    //update existing unresolved array - delete entries if nodes are found
    for (var i = this._unresolvedNodeIds.length - 1; i >= 0; i--) {
      if (this._allNodeIdsMap.has(this._unresolvedNodeIds[i])) {
        this._unresolvedNodeIds.splice(i, 1);
      }
    }
    //if data contain additional links, add unresolved nodes to the array
    if (Array.isArray(data['links'])) {
      for (var j = 0; j < data['links'].length; j++) {
        var link = data['links'][j];
        if (!this._allNodeIdsMap.has(link['startNode'])) {
          this._unresolvedNodeIds.push(link['startNode']);
        }
        if (!this._allNodeIdsMap.has(link['endNode'])) {
          this._unresolvedNodeIds.push(link['endNode']);
        }
      }
    }
  }

  /**
   * @private
   * Helper function that determines whether container node should be searched for additional nodes
   * in order to render promoted links
   * @param {oj.DiagramDataSource} dataSource oj.DiagramDataSource object that handles data for the component
   * @param {Object} containerData value for the individual node that might have child nodes to be resolved
   * @return {boolean} true if there are nested child nodes that has to be discovered
   */
  _discoverLinks(dataSource, containerData) {
    var behaviorValue = this.getOptions()['promotedLinkBehavior'];
    if (
      behaviorValue === 'none' ||
      this._unresolvedNodeIds.length == 0 ||
      (behaviorValue == 'lazy' && dataSource['getChildCount'](containerData) <= 0)
    ) {
      return false;
    }
    return dataSource['getDescendantsConnectivity'](containerData) != 'disjoint';
  }

  /**
   * Helper method that attaches and removes data source event handlers
   * @param {oj.DiagramDataSource} dataSource diagram data source
   * @param {boolean} attach true to attach listeners, false to remove listeners
   * @private
   */
  _setDataSourceListeners(dataSource, attach) {
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
  }

  /**
   * Adds data source listeners. Used on connect.
   */
  addDataSourceEventListeners() {
    this._setDataSourceListeners(this.getOptions()['data'], true);
  }

  /**
   * Removes data source listeners. Used on disconnect.
   */
  removeDataSourceEventListeners() {
    this._setDataSourceListeners(this.getOptions()['data'], false);
  }

  /**
   * Fetches additional data - nodes and links - from data provider when necessary.
   * The additional data are needed when 'promotedLinkBehavior' option is set to 'full' and
   * the component had to search for nodes in order to display promoted links.
   * When all nodes are discovered, the method calls RenderComponentInternal().
   * @param {Object} rootDataProvider root data provider for the diagram
   * @param {array} nodesArray an array of nodes used for searching
   * @private
   */
  _fetchDataProviderData(rootDataProvider, nodesArray) {
    var collapsedContainers = this.isTreeDataProvider()
      ? DvtDiagramDataUtils.GetCollapsedContainers(rootDataProvider, nodesArray, [])
      : [];

    if (collapsedContainers.length > 0) {
      var thisRef = this;

      var containerChildDataPromises = collapsedContainers.map((containerNode) => {
        return thisRef.Options._fetchDataHandler(
          rootDataProvider,
          thisRef._context.KeySetImpl([containerNode.id]),
          containerNode,
          containerNode.id
        );
      });

      var renderCount = this._renderCount;
      Promise.all(containerChildDataPromises).then((values) => {
        if (renderCount === thisRef._renderCount && thisRef.getCtx().isReadyToRender()) {
          // prepare for another round of collapsed containers search
          nodesArray = [];

          values.forEach((childData) => {
            if (Array.isArray(childData)) {
              childData.forEach((childNode) => {
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
  }

  /**
   * Check if nodes and links data came from data provider
   * @return {boolean} return true for data provider mode
   */
  isDataProviderMode() {
    return !!this.getOptions()['nodeData'];
  }

  /**
   * Check if tree data provider is used for the nodes
   * @return {boolean} return true for tree data provider
   */
  isTreeDataProvider() {
    var nodeDP = this.getOptions()['nodeData'];
    return nodeDP && nodeDP['getChildDataProvider'] ? true : false;
  }

  /**
   * @override
   */
  Render() {
    super.Render();
    this.InitComponentInternal();
    this._deferredObjCount = 0;
    this._nodesToResolve = [];
    if (!this._bRendered && !this.IsResize()) {
      this._renderCount++;
      if (this.isDataProviderMode()) {
        // find out if the component should discover additional nodes to render promoted links
        this._findUnresolvedLinks(
          { nodes: this.Options['nodes'], links: this.Options['links'] },
          true
        );
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
  }

  /**
   * @protected
   * Called by the renderComponent() method. Used to initialize or reinitialize the component before rendering.
   */
  InitComponentInternal() {
    // Create the event handler and add event listeners
    var pzc = this.getPanZoomCanvas();
    pzc.setMinZoom(this.getMinZoom());
    pzc.setMaxZoom(this.getMaxZoom());
    pzc.setAnimDur(this.getAnimDur());
    pzc.getContentPane().addChild(this._linksPane);
    pzc.getContentPane().addChild(this._nodesPane);
    pzc.getContentPane().addChild(this._topPane);
    this._touchEventPane && pzc.getContentPane().addChild(this._touchEventPane);
  }

  /**
   * Renders a Diagram component after it was initialized.
   * @protected
   */
  RenderComponentInternal() {
    var emptyDiagram = false;
    if (!this._bRendered && !this.IsResize()) {
      this._setDataSourceListeners(this.getOptions()['data'], true);
      this.prepareNodes(this.getOptions()['nodes']);
      this.renderLinks(this.getOptions()['links']);
      this.getCtx().setKeyboardFocusArray([this]);
    }
    //check whether the diagram is empty
    emptyDiagram = this._nodes.size === 0;
    if (!emptyDiagram) {
      // the child is going to be removed by  _processContent() function or layout failure function
      if (!this.contains(this._oldPanZoomCanvas)) this.addChild(this._oldPanZoomCanvas);

      var res = this.layout();
      var thisRef = this;
      var renderCount = this._renderCount;
      res.then(
        () => {
          if (renderCount === thisRef._renderCount) {
            thisRef._processContent(emptyDiagram);
          }
        }, //success
        () => {
          if (renderCount === thisRef._renderCount) {
            if (thisRef._oldPanZoomCanvas) {
              thisRef.removeChild(thisRef._oldPanZoomCanvas);
              thisRef._oldPanZoomCanvas.destroy();
              thisRef._oldPanZoomCanvas = null;
            }
            thisRef._bRendered = true;
            this._currentPanZoomState = null;
          }
        } //failure
      );
    } else {
      //empty diagram - nothing to layout, might need to run data change animation
      this._processContent(emptyDiagram);
    }
  }

  /**
   * Process diagram content after layout is done - zoom to fit, animate if it is necessary
   * @param {boolean} bEmptyDiagram True if diagram is empty
   * @private
   */
  _processContent(bEmptyDiagram) {
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
      this.panZoom();
    }
    // Initialize panZoomCanvas settings on initial update
    // regardless of whether the component is empty or not.
    if (!this._bRendered) {
      var pzc = this.getPanZoomCanvas();
      pzc.setPanningEnabled(this.IsPanningEnabled());
      pzc.setPanDir(this.getPanDir());
      pzc.setZoomingEnabled(this.IsZoomingEnabled());
      pzc.setZoomToFitEnabled(this.IsZoomingEnabled());
    }

    // add overview window
    if (!this.Overview && this.Options.overview && this.Options.overview.rendered == 'on') {
      this.Overview = new DvtDiagramOverview(this);
      DvtDiagramOverviewUtils.ConfigureOverviewWindow(this, this.Overview);
    } else if (this.Overview) {
      DvtDiagramOverviewUtils.UpdateOverviewWindow(this, this.Overview);
    }

    // Animation Support
    // Stop any animation in progress
    this.StopAnimation(true);

    // Construct the new animation playable
    var animationOnDisplay = DvtDiagramStyleUtils.getAnimOnDisplay(this);
    var animationOnDataChange = DvtDiagramStyleUtils.getAnimOnDataChange(this);

    if (!this._bRendered && animationOnDisplay !== 'none' && !this._oldDataAnimState) {
      //initial animation
      this.Animation = BlackBoxAnimationHandler.getInAnimation(
        this.getCtx(),
        BlackBoxAnimationHandler.ALPHA_FADE,
        this,
        null,
        DvtDiagramStyleUtils.getAnimDur(this)
      );
    } else if (animationOnDataChange !== 'none' && this._oldDataAnimState) {
      this._deleteContainer = new Container(this.getCtx(), 'g', 'Delete Container');
      this.addChild(this._deleteContainer);
      var ah = new DvtDiagramDataAnimationHandler(
        this.getCtx(),
        this._deleteContainer,
        this._oldDataAnimState,
        this
      );
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

    if (this._oldPanZoomCanvas) {
      this._oldPanZoomCanvas.destroy();
      this._oldPanZoomCanvas = null;
    }
    this._bRendered = true;
    this._currentPanZoomState = null;
    this.RefreshEmptyText(bEmptyDiagram);

    // Constrain pan bounds
    if (this.IsPanningEnabled()) {
      var contentDim = this._cachedViewBounds;
      if (contentDim != null) {
        var zoom = this.getPanZoomCanvas().getZoom();
        this.ConstrainPanning(contentDim.x, contentDim.y, contentDim.w, contentDim.h, zoom);
      }
    }

    this.ClearLayoutPanZoomState();
    if (calcViewBounds) {
      this._cachedViewBounds = null;
    }
  }

  /**
   * Fit and position diagram content into container if necessary
   * @param {Object} panZoomState optional the panZoomState to set the diagram to.
   */
  panZoom(panZoomState) {
    var pzc = this.getPanZoomCanvas();
    var offset = this.getLayoutOffset();
    if (!panZoomState) {
      panZoomState = this.GetLayoutPanZoomState();
      panZoomState = panZoomState ? panZoomState : { zoom: 0, centerX: null, centerY: null };
    }
    var zoom = panZoomState['zoom'];
    var centerX = panZoomState['centerX'];
    var centerY = panZoomState['centerY'];

    var panningEnabled = this.IsPanningEnabled();
    var zoomingEnabled = this.IsZoomingEnabled();
    pzc.setPanningEnabled(true);
    pzc.setZoomingEnabled(true);
    this.SetPanningEnabled(true);
    // set panZoomState on initial render or if panning/zooming enabled
    try {
      if (zoom !== 0.0) {
        this.AdjustMinZoom();
        zoom = pzc.ConstrainZoom(zoom);
        pzc.zoomTo(zoom, 0, 0, null, true);
        if (centerX !== null || centerY !== null) {
          pzc.panTo(
            this.Width / 2 - (centerX + offset.x) * zoom,
            this.Height / 2 - (centerY + offset.y) * zoom
          );
        } else {
          pzc.center(null, this._cachedViewBounds);
        }
      } else {
        this._zoomToFit();
        if (centerX !== null || centerY !== null) {
          pzc.panTo(
            this.Width / 2 - (centerX + offset.x) * zoom,
            this.Height / 2 - (centerY + offset.y) * zoom
          );
        }
      }
    } finally {
      this.SetPanningEnabled(panningEnabled);
      pzc.setPanningEnabled(panningEnabled);
      pzc.setZoomingEnabled(zoomingEnabled);
    }
  }

  /**
   * Process zoom to fit
   */
  _zoomToFit() {
    var pzc = this.getPanZoomCanvas();
    if (!this._bRendered) {
      this.AdjustMinZoom();
      pzc.zoomToFit(null, this._cachedViewBounds);
    } else if (this.IsResize() || this._partialUpdate) {
      // Update the min zoom if it's unspecified
      var viewBounds = this.AdjustMinZoom();
      var fitBounds = viewBounds ? viewBounds : this._cachedViewBounds;
      pzc.setZoomToFitPadding(PanZoomCanvas.DEFAULT_PADDING);
      pzc.setZoomToFitEnabled(true);
      pzc.zoomToFit(null, fitBounds);
      pzc.setZoomToFitEnabled(this.IsZoomingEnabled());
    }
  }

  /**
   * Refreshes the empty text message, centered in the available space.
   *
   * @param {boolean} emptyDiagram True if empty text should be rendered, false otherwise
   * @protected
   */
  RefreshEmptyText(emptyDiagram) {
    if (emptyDiagram && this.getEmptyText()) {
      if (!this._emptyTextDisplay) {
        // Create the text and position it in the middle of the available space
        this._emptyTextDisplay = this.CreateEmptyText(this.getEmptyText());
      } else {
        this._emptyTextDisplay.setX(this.Width / 2);
        this._emptyTextDisplay.setY(this.Height / 2);
        TextUtils.fitText(
          this._emptyTextDisplay,
          this.getWidth() - 2 * TextUtils.EMPTY_TEXT_BUFFER,
          Infinity,
          this
        );
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
  }

  /**
   * Creates empty text
   * @param {string} text a text for the empty component
   * @return {dvt.OutputText}
   * @protected
   */
  CreateEmptyText(text) {
    var options = this.getOptions();
    return this.renderEmptyText(
      this,
      text,
      new Rectangle(0, 0, this.getWidth(), this.getHeight()),
      this.getEventManager(),
      options['_statusMessageStyle']
    );
  }

  /**
   * Sets a text for the empty component
   * @param {string} text text for the empty component
   */
  setEmptyText(text) {
    this._emptyText = text;
  }

  /**
   * Gets a text for the empty component
   * @return {string} text for the empty component
   */
  getEmptyText() {
    return this._emptyText;
  }

  /**
   * @override
   */
  SetOptions(options) {
    super.SetOptions(options);
    //initial setup
    if (!this.isDataProviderMode()) {
      this.Options['nodes'] = [];
      this.Options['links'] = [];
    }
    this.SetPanningEnabled(this.Options['panning'] != 'none');
    this.SetZoomingEnabled(this.Options['zooming'] != 'none');
    this.setSelectionMode(this.Options['selectionMode']);
    this.setEmptyText(
      this.Options['emptyText'] ? this.Options['emptyText'] : this.Options.translations.labelNoData
    );
  }

  /**
   * Returns a copy of the default options for the specified skin.
   * @param {string} skin The skin whose defaults are being returned.
   * @return {object} The object containing defaults for this component.
   */
  static getDefaults(skin) {
    return new DvtDiagramDefaults().getDefaults(skin);
  }

  /**
   * Gets the maximum zoom level
   * @return {number} maximum zoom level
   */
  getMaxZoom() {
    var maxZoom = this.getOptions()['maxZoom'];
    var f = parseFloat(maxZoom);
    return f > 0 ? f : 1.0;
  }

  /**
   * Gets the minimum zoom level
   * @return {number} minimum zoom level
   */
  getMinZoom() {
    var minZoom = this.getOptions()['minZoom'];
    if (minZoom) {
      var f = parseFloat(minZoom);
      if (f > 0) {
        minZoom = Math.min(f, this.getMaxZoom());
      }
      return minZoom;
    }
    return 0.0;
  }

  /**
   * Gets panning direction for diagram
   * @return {string} the pan direction
   * @protected
   */
  getPanDir() {
    return this.getOptions()['panDirection'];
  }

  /**
   * Sets panning option for diagram
   * @param {boolean} panningEnabled true if panning enabled
   * @protected
   */
  SetPanningEnabled(panningEnabled) {
    this._panningEnabled = panningEnabled;
  }

  /**
   * Gets panning option for diagram
   * @return {boolean} true if panning enabled
   * @protected
   */
  IsPanningEnabled() {
    return this._panningEnabled;
  }

  /**
   * Sets zooming option for diagram
   * @param {boolean} zoomingEnabled true if zooming enabled
   * @protected
   */
  SetZoomingEnabled(zoomingEnabled) {
    this._zoomingEnabled = zoomingEnabled;
  }

  /**
   * Gets zooming option for diagram
   * @return {boolean} true if zooming enabled
   * @protected
   */
  IsZoomingEnabled() {
    return this._zoomingEnabled;
  }

  /**
   * Gets selection handler
   * @return {dvt.SelectionHandler} selection handler
   */
  getSelectionHandler() {
    return this._selectionHandler;
  }

  /**
   * Sets the selection mode for the component
   * @param {string} selectionMode valid values dvt.SelectionHandler.TYPE_SINGLE, dvt.SelectionHandler.TYPE_MULTIPLE or null
   */
  setSelectionMode(selectionMode) {
    if (selectionMode == 'single')
      this._selectionHandler = new SelectionHandler(
        this.getCtx(),
        SelectionHandler.TYPE_SINGLE
      );
    else if (selectionMode == 'multiple')
      this._selectionHandler = new SelectionHandler(
        this.getCtx(),
        SelectionHandler.TYPE_MULTIPLE
      );
    else this._selectionHandler = null;

    // Event Handler delegates to other handlers
    this.getEventManager().setSelectionHandler(this._selectionHandler);
  }

  /**
   *  Returns whether selecton is supported on the diagram.
   *  @return {boolean} True if selection is turned on for the nbox and false otherwise.
   */
  isSelectionSupported() {
    return this._selectionHandler ? true : false;
  }

  /**
   * Gets nodes pane
   * @return {dvt.Container} nodes pane
   */
  getNodesPane() {
    return this._nodesPane;
  }

  /**
   * Sets nodes pane
   * @param {dvt.Container} nodesPane
   */
  setNodesPane(nodesPane) {
    this._nodesPane = nodesPane;
  }

  /**
   * Gets links pane
   * @return {dvt.Container} links pane
   */
  getLinksPane() {
    return this._linksPane;
  }

  /**
   * Sets links pane
   * @param {dvt.Container} linksPane
   */
  setLinksPane(linksPane) {
    this._linksPane = linksPane;
  }

  /**
   * Gets top pane
   * @return {dvt.Container} top pane
   */
  getTopPane() {
    return this._topPane;
  }

  /**
   * Sets top pane
   * @param {dvt.Container} topPane
   */
  setTopPane(topPane) {
    this._topPane = topPane;
  }

  /**
   * Gets the animation duration (in seconds)
   * @return {number} the animation duration (in seconds)
   */
  getAnimDur() {
    return DvtDiagramStyleUtils.getAnimDur(this);
  }

  /**
   * Processes the specified event.
   * @param {object} event
   */
  processEvent(event) {
    var type = event['type'];
    if (type == 'categoryHighlight') {
      this._processHighlighting(true);
    } else if (type == 'selection') {
      this.getOptions()['selection'] = event['selection'];
    } else if (type == 'overview') {
      var subtype = event.subtype;
      if (subtype == 'scrollPos' || subtype == 'scrollTime') {
        this.Overview.HandleViewportChange(event);
      } else if (subtype == 'scrollEnd') {
        this.getPanZoomCanvas().writebackPan();
      }
      return;
    }
    if (event) {
      this.dispatchEvent(event);
    }
  }

  /**
   * Prepare diagram nodes for layout. The nodes will not be rendered at this time.
   * The nodes will be rendered during layout or after layout is done.
   * @param {array} nodesData an array of node data objects
   */
  prepareNodes(nodesData) {
    if (!nodesData) return;
    this._prepareNodes(null, nodesData);

    // on custom elements expanded is as an ojKeySet, on widgets it is an array
    // if expanded is an array, update internal array of disclosed nodes if neccessary - initial rendering or option change case
    var origExpanded = this.getOptions()['expanded'];
    if (!origExpanded || (!origExpanded['has'] && !this.DisclosedNodes)) {
      var resp = origExpanded === 'all' ? this._arNodeIds.slice(0) : origExpanded;
      this.DisclosedNodes = !origExpanded ? [] : resp;
    }
  }

  /**
   * Renders diagram links
   * @param {array} linksData an array of link data objects
   */
  renderLinks(linksData) {
    if (!linksData) return;

    var linkDefaults = DvtDiagramStyleUtils.getLinkDefaultStyles(this, 'linkDefaults');
    for (var i = 0; i < linksData.length; i++) {
      var linkData = linksData[i];
      if (this._isLinkPromoted(linkData)) {
        continue;
      }

      linkData = DvtDiagramStyleUtils.getLinkStyles(this, linkData, linkDefaults);
      var link = new DvtDiagramLink(this.getCtx(), this, linkData, false);
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
    }
    // render promoted links
    if (this._promotedLinksMap) {
      var promotedLinkDefaults = DvtDiagramStyleUtils.getLinkDefaultStyles(this, 'promotedLink');
      var thisRef = this;
      this._promotedLinksMap.forEach((promotedLink, promotedLinkId, map) => {
        if (!thisRef._links.has(promotedLinkId)) {
          // render the link if it is not rendered yet
          var linkData = JsonUtils.merge(promotedLink, promotedLinkDefaults);
          var link = new DvtDiagramLink(thisRef.getCtx(), thisRef, linkData, true);
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
  }

  /**
   * Resets the panZoomState to zoom to fit
   * @param {boolean} reset Reset the panZoomState to default if true
   */
  panZoomReset(reset) {
    this._panZoomReset = reset;
  }

  /**
   * Layout diagram nodes and links
   * @return {object} Promise or Promise like object that implements then function - then function should be executed after layout is done
   */
  layout() {
    var layoutFunc = this.getOptions()['layout'];
    var layoutContext = this._getLayoutContext();
    layoutContext.setDirtyContext(new (this.getCtx().ojMap)());

    var panZoomState = this._currentPanZoomState;
    if (panZoomState) {
      this.dispatchEvent(new EventFactory.newEvent('beforePanZoomReset'));
    }
    if (this._panZoomReset) {
      layoutContext.setPanZoomState(null);
      if (this.IsResize()) {
        layoutContext.setCurrentPanZoomState(null);
      } else {
        layoutContext.setCurrentPanZoomState(panZoomState);
      }
    } else {
      layoutContext.setCurrentPanZoomState(panZoomState);
      layoutContext.setPanZoomState(panZoomState || this.getOptions()['panZoomState']);
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
          then: (resolveFunc, errorFunc) => {
            resolveFunc();
          }
        };
      }
      this.setAlphas(0);
      var renderCount = this._renderCount;
      promise.then(
        (response) => {
          if (thisRef._renderCount === renderCount || thisRef.IsResize()) {
            thisRef.setAlphas(1.0);
            if (thisRef._oldDataAnimState)
              thisRef._oldDataAnimState.updateStateFromLayoutContext(layoutContext);
            //render nodes if they not rendered yet
            var rootNodesCount = layoutContext.getNodeCount();
            for (var i = 0; i < rootNodesCount; i++) {
              var rootNode = layoutContext.getNodeByIndex(i);
              thisRef.renderNodeFromContext(rootNode, true);
            }
            thisRef.ApplyLayoutContext(layoutContext, true);
          }
        },
        (error) => {}
      );
      return promise;
    } else {
      this.Log('Diagram: Layout function is not defined', 1); // LEVEL_ERROR
    }
  }

  /**
   * Sets the alphas on diagram panes.
   * @param {number} alpha panes opacity
   */
  setAlphas(alpha) {
    if (!this._bRendered) {
      this.getLinksPane().setAlpha(alpha);
      this.getNodesPane().setAlpha(alpha);
    }
  }

  /**
   * Gets a node by specified id
   * @param {string} id node id
   * @return {DvtDiagramNode} diagram node
   */
  getNodeById(id) {
    return this._nodes.get(id);
  }

  /**
   * Gets a link by specified id
   * @param {string} id link id
   * @return {DvtDiagramLink} diagram link
   */
  getLinkById(id) {
    return this._links.get(id);
  }

  /**
   * Gets an array of link ids
   * @return {array} array of link ids
   */
  GetAllLinks() {
    return this._arLinkIds;
  }

  /**
   * Gets a copy of the map of all links
   * @return {object} map of all links
   * @protected
   */
  GetAllLinksMap() {
    var linksMap = new (this.getCtx().ojMap)();
    if (this._links) {
      this._links.forEach((link, linkId, map) => {
        linksMap.set(linkId, link);
      });
    }
    return linksMap;
  }

  /**
   * Gets an array of all link objects
   * @return {array} array of all link objects
   * @protected
   */
  GetAllLinkObjects() {
    var allLinks = [];
    if (this._links) {
      this._links.forEach((link, linkId, map) => {
        allLinks.push(link);
      });
    }
    return allLinks;
  }

  /**
   * Gets an array of node ids
   * @return {array} array of node ids
   */
  GetAllNodes() {
    return this._arNodeIds;
  }

  /**
   * Gets a copy of the map of all nodes
   * @return {object} map of all nodes
   * @protected
   */
  GetAllNodesMap() {
    var nodesMap = new (this.getCtx().ojMap)();
    if (this._nodes) {
      this._nodes.forEach((value, key, map) => {
        nodesMap.set(key, value);
      });
    }
    return nodesMap;
  }

  /**
   * Gets an array of all node objects
   * @return {array} array of all node objects
   * @protected
   */
  GetAllNodeObjects() {
    var allNodes = [];
    if (this._nodes) {
      this._nodes.forEach((value, key, map) => {
        allNodes.push(value);
      });
    }
    return allNodes;
  }

  /**
   * Gets an array of root ids
   * @return {array} array of root ids
   */
  GetAllRoots() {
    return this._arRootIds;
  }

  /**
   * Gets an array of all node objects
   * @return {array} array of all node objects
   * @protected
   */
  GetRootNodeObjects() {
    var roots = [];
    for (var i = 0; this._arRootIds && i < this._arRootIds.length; i++) {
      var root = this._nodes.get(this._arRootIds[i]);
      if (root) {
        roots.push(root);
      }
    }
    return roots;
  }

  /**
   * Writebacks the panZoomState attribute
   * @param {number} x The x pan value
   * @param {number} y The y pan value
   * @param {number} zoom the zoom value
   */
  _setPanZoomState(x, y, zoom) {
    var offset = this.getLayoutOffset();
    var centerX =
      x !== null && zoom
        ? (this.Width * 0.5 - x) / zoom - offset.x
        : this.Options['panZoomState']['centerX'];
    var centerY =
      y !== null && zoom
        ? (this.Height * 0.5 - y) / zoom - offset.y
        : this.Options['panZoomState']['centerY'];
    this.dispatchEvent(
      new EventFactory.newOptionChangeEvent('panZoomState', {
        zoom: zoom,
        centerX: centerX,
        centerY: centerY
      })
    );
  }

  /**
   * @override
   */
  HandlePanEvent(event) {
    super.HandlePanEvent(event);
    if (event.subtype === 'panned') {
      this._setPanZoomState(event.newX, event.newY, event.zoom);
    }
    if (this.Overview) {
      this.Overview.UpdateViewport();
    }
  }

  /**
   * @override
   */
  HandleZoomEvent(event) {
    super.HandleZoomEvent(event);
    if (this.Overview) {
      this.Overview.UpdateViewport();
    }
    var subtype = event.subtype;
    var nc;
    switch (subtype) {
      case 'adjustPanConstraints':
        if (this.IsPanningEnabled()) {
          var zoom = event.newZoom;
          // Calculate the new content dimensions based on the new zoom
          var contentDim = this.GetViewBounds();
          this.ConstrainPanning(contentDim.x, contentDim.y, contentDim.w, contentDim.h, zoom);
        }
        break;
      case 'zoomed':
        // don't update nodes on zoomed events on touch device, since touchend might be lost when the node is rerendered
        nc = this.getOptions()['nodeContent'] || {};
        if (!Agent.isTouchDevice() && nc['zoomRenderer'] && event.oldZoom !== event.newZoom) {
          this._nodes.forEach((node, nodeId, map) => {
            node.rerenderOnZoom(event);
          });
        }
        if (!event.panAndZoom) {
          this._setPanZoomState(event.pos.x, event.pos.y, event.newZoom);
        }
        break;
      case 'zoomToFitEnd':
      case 'zoomEnd':
        // when on touch, call zoom renderer on zoom_end and zoom-to-fit-end
        nc = this.getOptions()['nodeContent'] || {};
        if (Agent.isTouchDevice() && nc['zoomRenderer'] && event.oldZoom !== event.newZoom) {
          this._nodes.forEach((node, nodeId, map) => {
            node.rerenderOnZoom(event);
          });
        }
        break;
    }
  }

  /**
   * Gets an array of navigable links for the specified node
   * @param {string} nodeId node id
   * @return {array} array of navigable links for the specified node
   */
  getNavigableLinksForNodeId(nodeId) {
    var links = [];
    this._links.forEach((link, linkId, map) => {
      var startId = link.getStartId();
      var endId = link.getEndId();

      if ((startId == nodeId || endId == nodeId) && link.getVisible()) links.push(link);
    });
    return links;
  }

  /**
   * Update the selection handler with the initial selections.
   * @private
   */
  _processInitialSelections() {
    var selection = this.Options['selection'];
    if (!selection) return;
    if (this.isSelectionSupported()) {
      var targets = [];
      this._nodes.forEach((node, nodeId, map) => {
        targets.push(node);
      });
      this._links.forEach((link, linkId, map) => {
        targets.push(link);
      });
      this.getSelectionHandler().processInitialSelections(this.Options['selection'], targets);
    }
  }

  /**
   * Process highlighting
   * @param {boolean} handleEventListeners a flag to remove, then reattach event listeners. The flag is set to true when highlight is caused by event.
   * @private
   */
  _processHighlighting(handleEventListeners) {
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
    this._highlightedObjects = new (this.getCtx().ojMap)();
    var highlightedNodes = [];
    var thisRef = this;
    //find highlighted nodes
    this._nodes.forEach((node, nodeId, map) => {
      var match = bAnyMatched
        ? ArrayUtils.hasAnyItem(node.getCategories(), categories)
        : ArrayUtils.hasAllItems(node.getCategories(), categories);
      if (match) {
        thisRef._highlightedObjects.set(nodeId, node);
        highlightedNodes.push(node);
      }
    });
    this._processNodeConnections(highlightedNodes);

    //find highlighted links
    var highlightedLinks = [];
    this._links.forEach((link, linkId, map) => {
      var match = bAnyMatched
        ? ArrayUtils.hasAnyItem(link.getCategories(), categories)
        : ArrayUtils.hasAllItems(link.getCategories(), categories);
      if (match) {
        thisRef._highlightedObjects.set(linkId, link);
        highlightedLinks.push(link);
      }
    });

    if (this.Options['linkHighlightMode'] == 'linkAndNodes') {
      this._processLinkConnections(highlightedLinks);
    }

    this._updateAlphas(true, this._highlightedObjects);

    //  - edge: highlight blinks on hover over node label positioned over the link
    // Reattach the listenes after updating alphas. The timeout seems to alow extra time to finish
    // a browser reparenting highlighted objects in DOM
    if (handleEventListeners) {
      setTimeout(() => {
        thisRef.getEventManager().addListeners(thisRef);
      }, 0);
    }
  }

  /**
   * Add specified connection (incoming and outgoing) with the endpoints to the map of highlighted objects
   * @param {array} highlightedNodes nodes to process
   * @private
   */
  _processNodeConnections(highlightedNodes) {
    var nodeHighlightMode = this.Options['nodeHighlightMode'];
    if (nodeHighlightMode != 'node') {
      var incoming =
        nodeHighlightMode == 'nodeAndIncomingLinks' || nodeHighlightMode == 'nodeAndLinks';
      var outgoing =
        nodeHighlightMode == 'nodeAndOutgoingLinks' || nodeHighlightMode == 'nodeAndLinks';
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
  }

  /**
   * Add start and end nodes to the map of highlighted objects
   * @param {array} highlightedLinks links to process
   * @private
   */
  _processLinkConnections(highlightedLinks) {
    for (var linkIdx = 0; linkIdx < highlightedLinks.length; linkIdx++) {
      var link = highlightedLinks[linkIdx];
      var linkStartId = link.getStartId();
      var linkEndId = link.getEndId();
      this._highlightedObjects.set(linkStartId, this.getNodeById(linkStartId));
      this._highlightedObjects.set(linkEndId, this.getNodeById(linkEndId));
    }
  }

  /**
   * Highlight objects by setting alpha on links and nodes panes and
   * bringing highlighted objects to either content pane or corresponding link/nodes pane
   * @param {boolean} bHighlight true highligh objects, false to unhighlight
   * @param {object} highlightedObjects a map of highlighted object
   * @private
   */
  _updateAlphas(bHighlight, highlightedObjects) {
    var objectsTotal = this._nodes.size + this._links.size;
    if (highlightedObjects.size === objectsTotal) {
      return;
    }
    //is diagram flat or does it have containers - don't reparent objects for container case
    if (this._arNodeIds.length == this._arRootIds.length) {
      //flat
      var highlightAlpha = bHighlight ? this.Options['styleDefaults']['_highlightAlpha'] : 1.0;
      var linksPane = this.getLinksPane();
      var nodesPane = this.getNodesPane();

      if (highlightedObjects.size > objectsTotal * 0.5) {
        // keep highlighted objects in place - move other objects to the faded bottom pane
        var bottomPane = this.getBottomPane();
        bottomPane.setAlpha(highlightAlpha);

        this._links.forEach((link, id, map) => {
          var highlighted = highlightedObjects.get(id);
          if (!highlighted && bHighlight) bottomPane.addChild(link);
          else if (!highlighted) linksPane.addChild(link);
        });

        this._nodes.forEach((node, id, map) => {
          var highlighted = highlightedObjects.get(id);
          if (!highlighted && bHighlight) bottomPane.addChild(node);
          else if (!highlighted) nodesPane.addChild(node);
        });
      } else {
        var topPane = this.getTopPane();
        //update alphas on link and node panes
        linksPane.setAlpha(highlightAlpha);
        nodesPane.setAlpha(highlightAlpha);

        // Then just reparent the interesting links and nodes
        var highlightedLinksArray = [];
        var highlightedNodesArray = [];
        highlightedObjects.forEach((item, id, map) => {
          if (item instanceof DvtDiagramLink) highlightedLinksArray.push(item);
          else if (item instanceof DvtDiagramNode) highlightedNodesArray.push(item);
        });

        for (var elt = 0; elt < highlightedLinksArray.length; elt++) {
          if (bHighlight) topPane.addChild(highlightedLinksArray[elt]);
          else linksPane.addChild(highlightedLinksArray[elt]);
        }
        for (var elt1 = 0; elt1 < highlightedNodesArray.length; elt1++) {
          if (bHighlight) topPane.addChild(highlightedNodesArray[elt1]);
          else nodesPane.addChild(highlightedNodesArray[elt1]);
        }
      }
    } else {
      //has containers
      if (bHighlight) {
        //highlight objects
        highlightedObjects.forEach((item, id, map) => {
          item.highlight(true);
        });
        this._nodes.forEach((node, nodeId, map) => {
          if (!highlightedObjects.has(nodeId)) {
            node.highlight(false);
          }
        });
        this._links.forEach((link, linkId, map) => {
          if (!highlightedObjects.has(linkId)) {
            link.highlight(false);
          }
        });
      } else {
        //remove highlight
        this._nodes.forEach((node, nodeId, map) => {
          node.highlight(true);
        });
        this._links.forEach((link, linkId, map) => {
          link.highlight(true);
        });
      }
    }
  }

  /**
   * @override
   */
  highlight(categories) {
    // Update the options
    this.Options['highlightedCategories'] = JsonUtils.clone(categories);

    // Perform the highlighting
    this._processHighlighting();
  }

  /**
   * @override
   */
  select(selection) {
    // Update the options
    this.Options['selection'] = JsonUtils.clone(selection);

    // Perform the selection
    this._processInitialSelections();
  }

  /**
   * @return {DvtDiagramAutomation} the automation object
   */
  getAutomation() {
    if (!this.Automation) this.Automation = new DvtDiagramAutomation(this);
    return this.Automation;
  }

  /**
   * Logs diagram messages
   * @param {string} message
   * @param {number} level log level - LEVEL_ERROR = 1, LEVEL_WARN = 2, LEVEL_INFO = 3, LEVEL_LOG = 4
   * @protected
   */
  Log(message, level) {
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
  }

  /**
   * Hides or shows default hover effect on the specified node
   * @param {string} nodeId node id
   * @param {boolean} hovered true to show hover effect
   */
  processDefaultHoverEffect(nodeId, hovered) {
    var node = this.getNodeById(nodeId);
    if (node) node.processDefaultHoverEffect(hovered);
  }

  /**
   * Hides or shows default selection effect on the specified node
   * @param {string} nodeId node id
   * @param {boolean} selected true to show selection effect
   */
  processDefaultSelectionEffect(nodeId, selected) {
    var node = this.getNodeById(nodeId);
    if (node) node.processDefaultSelectionEffect(selected);
  }

  /**
   * Hides or shows default keyboard focus effect on the specified node
   * @param {string} nodeId node id
   * @param {boolean} focused true to show keyboard focus effect
   */
  processDefaultFocusEffect(nodeId, focused) {
    var node = this.getNodeById(nodeId);
    if (node) node.processDefaultFocusEffect(focused);
  }

  /**
   * Updates nodes dimensions for the specified node context. Renders the node if it is necessary.
   * @param {DvtDiagramLayoutContextNode} nodeContext
   */

  updateNodeDims(nodeContext) {
    if (!nodeContext.IsRendered) {
      this.renderNodeFromContext(nodeContext, true);
    } else {
      var node = this.getNodeById(nodeContext.getId());
      nodeContext.setBounds(
        DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getLayoutBounds(true))
      );
      nodeContext.setContentBounds(
        DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getContentBounds(true))
      );
      nodeContext.setLabelBounds(
        DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getLabelBounds(true))
      );
    }
  }

  /**
   * Render leaf nodes only for the given node from layout context:
   * if the node is a leaf it will be rendered,
   * if the node is a container - walk down to the leaf nodes and render them
   * @param {DvtDiagramLayoutContextNode} nodeContext
   */
  renderLeafNodeFromContext(nodeContext) {
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
  }

  /**
   * Render node and updates corresponding layout context for the node
   * @param {DvtDiagramLayoutContextNode} nodeContext
   * @param {boolean} forceDims flag that indicates that a node should be measured after rendering
   */
  renderNodeFromContext(nodeContext, forceDims) {
    if (!nodeContext.IsRendered) {
      var node = this.getNodeById(nodeContext.getId());
      if (node.isDisclosed()) {
        //render all child nodes and apply layout context
        var layoutContext = this.CreateEmptyLayoutContext();
        layoutContext.setDirtyContext(
          nodeContext.LayoutContext ? nodeContext.LayoutContext.getDirtyContext() : null
        );
        if (this._oldDataAnimState)
          this._oldDataAnimState.updateStateFromLayoutContext(layoutContext);
        var childNodes = nodeContext.getChildNodes();

        //render all child nodes without measurements
        for (var i = 0; i < childNodes.length; i++) {
          var childNode = childNodes[i];
          this.renderNodeFromContext(childNode, false);
          layoutContext.addNode(childNode);
        }
        //update child nodes dimensions after rendering is done
        for (var j = 0; j < childNodes.length; j++) {
          this.updateNodeDims(childNodes[j]);
        }

        this.ApplyLayoutContext(layoutContext);
      }
      node.render();
      //update node layout context
      var padding = node.isDisclosed() ? node.getContainerPadding() : null;
      if (padding)
        nodeContext.setContainerPadding(padding.top, padding.right, padding.bottom, padding.left);
      nodeContext.setBounds(
        DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getLayoutBounds(forceDims))
      );
      nodeContext.setContentBounds(
        DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getContentBounds(forceDims))
      );
      nodeContext.setLabelBounds(
        DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getLabelBounds(forceDims))
      );
      nodeContext.IsRendered = true;
    }
  }

  /**
   * Recursively walks the nodes data. Creates visible nodes, but skips the rendering step.
   * The nodes will be rendered during or after the layout.
   * @param {DvtDiagramNode} parent parent node if exists
   * @param {Object} nodesData an object that represents child nodes for the level
   * @private
   */
  _prepareNodes(parent, nodesData) {
    if (!nodesData) return;

    var nodeDefaults = DvtDiagramStyleUtils.getNodeDefaultStyles(this);
    for (var i = 0; i < nodesData.length; i++) {
      var nodeData = DvtDiagramStyleUtils.getNodeStyles(this, nodesData[i], nodeDefaults);
      var node = new DvtDiagramNode(this.getCtx(), this, nodeData);
      var nodeId = node.getId();
      if (parent) {
        parent.addChildNodeId(nodeId);
        node.setGroupId(parent.getId());
      } else {
        this._arRootIds.push(nodeId);
      }
      this._arNodeIds.push(nodeId);
      // if child nodes option is defined and the node is disclosed, process the data
      if (nodeData['nodes'] && nodeData['nodes'].length > 0) {
        if (this._isNodeDisclosed(nodeId)) {
          node.setDisclosed(true);
          this._prepareNodes(node, nodeData['nodes']);
        } else {
          this._addToCollapsedArray(node);
        }
      }

      if (!node.isHidden()) {
        if (parent && parent.GetChildNodePane()) parent.GetChildNodePane().addChild(node);
        else this.getNodesPane().addChild(node);
        this._nodes.set(nodeId, node);
      }
    }
  }

  /**
   * Sets the disclosure state for a node
   * @param {string} nodeId the id of the node
   * @param {boolean} disclosed whether the node should be disclosed or not
   */
  setNodeDisclosed(nodeId, disclosed) {
    if (disclosed != this._isNodeDisclosed(nodeId))
      this.dispatchEvent(
        new EventFactory.newEvent(disclosed ? 'beforeExpand' : 'beforeCollapse', nodeId)
      );
  }

  /**
   * Expands a container
   * @param {String} nodeId node id
   */
  expand(nodeId) {
    var triggerEvent = false;
    var expanded = this.getOptions()['expanded'];
    if (expanded && expanded['has'] && !expanded['has'](nodeId)) {
      // key set - component created a custom element
      triggerEvent = true;
      expanded = expanded['add']([nodeId]);
      this.applyOptions({ expanded: expanded }, this.Defaults.getNoCloneObject());
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
        var nodeOption = DvtDiagramDataUtils.GetNodeOption(this, node);

        // fetch data from data provider
        var thisRef = this;
        var renderCount = this._renderCount;
        var fetchDataPromise = this.getOptions()._fetchDataHandler(
          this.getOptions().nodeData,
          expanded,
          nodeOption,
          nodeId
        );
        fetchDataPromise.then((value) => {
          if (renderCount === thisRef._renderCount) {
            thisRef.render(thisRef.getOptions(), thisRef.Width, thisRef.Height);
            thisRef.dispatchEvent(new EventFactory.newEvent('expand', nodeId));
          }
        });
      } else {
        this.render(this.getOptions(), this.Width, this.Height);
        this.dispatchEvent(new EventFactory.newEvent('expand', nodeId));
      }
    }
  }

  /**
   * Collapses a container node
   * @param {String} nodeId node id
   */
  collapse(nodeId) {
    var triggerEvent = false;
    var expanded = this.getOptions()['expanded'];
    if (expanded && expanded['has'] && expanded['has'](nodeId)) {
      // key set - component created a custom element
      triggerEvent = true;
      expanded = expanded['delete']([nodeId]);
      this.applyOptions({ expanded: expanded }, this.Defaults.getNoCloneObject());
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
      this.dispatchEvent(new EventFactory.newEvent('collapse', nodeId));
    }
  }

  /**
   * Adds child layout context to the parent layout context
   * @param {DvtDiagramNode} parentNode parent node
   * @param {DvtDiagramLayoutContextNode} lcParentNode parent layout context
   * @param {DvtDiagramLayoutContext} layoutContext diagram layout context
   * @param {boolean} bRenderAfter flag that indicates that node is not rendered yet,
   *                  it will be render during layout or after layout is done
   * @private
   */
  _addLayoutContextForChildNodes(parentNode, lcParentNode, layoutContext, bRenderAfter) {
    if (parentNode.isDisclosed()) {
      var arChildIds = parentNode.getChildNodeIds();
      var lcChildNodes = this._createLayoutContextForChildNodes(
        lcParentNode,
        layoutContext,
        arChildIds,
        bRenderAfter
      );
      lcParentNode.setChildNodes(lcChildNodes);
    }
  }

  /**
   * Append new nodes to existing child nodes - happens during add event.
   * @param {DvtDiagramNode} parentNode parent node
   * @param {DvtDiagramLayoutContextNode} lcParentNode parent layout context
   * @param {DvtDiagramLayoutContext} layoutContext diagram layout context
   * @param {array} nodes array of nodes data to append to the layout context
   * @param {number} index an index where the nodes should be added
   * @private
   */
  _appendLayoutContextForChildNodes(parentNode, lcParentNode, layoutContext, nodes, index) {
    if (parentNode.isDisclosed()) {
      var arChildIds = nodes.reduce((acc, obj) => {
        acc.push(obj['id']);
        return acc;
      }, []);
      var lcChildNodes = this._createLayoutContextForChildNodes(
        lcParentNode,
        layoutContext,
        arChildIds,
        true
      );
      var lcChildNodesExisting = lcParentNode.getChildNodes() || [];
      lcChildNodes = ArrayUtils.insert(lcChildNodesExisting, lcChildNodes, index);
      lcParentNode.setChildNodes(lcChildNodes);
      lcParentNode.setDisclosed(true);
      lcParentNode.SetContainerPaddingObj(
        Diagram.getLayoutContainerPadding(parentNode.getContainerPadding())
      );
      lcParentNode.UpdateParentNodes();
    }
  }

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
  _createLayoutContextForChildNodes(lcParentNode, layoutContext, arChildIds, bRenderAfter) {
    var lcChildNodes = [];
    for (var j = 0; j < arChildIds.length; j++) {
      var childNode = this.getNodeById(arChildIds[j]);
      if (childNode.getVisible()) {
        var lcChildNode = this.CreateLayoutContextNode(
          childNode,
          null,
          bRenderAfter,
          layoutContext
        );
        lcChildNode.copyFrom(
          this._oldLayoutContext ? this._oldLayoutContext.getNodeById(arChildIds[j]) : null
        );
        layoutContext.addNodeToMap(lcChildNode);
        lcChildNode.setParentNode(lcParentNode);
        lcChildNodes.push(lcChildNode);
        this._addLayoutContextForChildNodes(childNode, lcChildNode, layoutContext, bRenderAfter);
      }
    }
    return lcChildNodes;
  }

  /**
   * @private
   * Checks whether the node is expanded
   * @param {string} nodeId node id
   * @return {boolean} true if the node is expanded
   */
  _isNodeDisclosed(nodeId) {
    var expanded = this.getOptions()['expanded'];
    if (expanded && expanded['has'])
      // key set - component created a custom element
      return expanded['has'](nodeId);
    else {
      // rely internally on this.DisclosedNodes - component created as a widget
      var disclosedNodes = this.DisclosedNodes ? this.DisclosedNodes : expanded;
      return (
        (disclosedNodes && disclosedNodes.indexOf(nodeId) > -1) ||
        (disclosedNodes && disclosedNodes.indexOf('all') > -1)
      );
    }
  }

  /**
   * @private
   * Checks whether the link is promoted
   * @param {object} linkData
   * @return {boolean} true if the link is promoted
   */
  _isLinkPromoted(linkData) {
    var startNode = this.getNodeById(linkData['startNode']);
    var endNode = this.getNodeById(linkData['endNode']);

    // both ends of a link are visible - not a promoted link
    // or nodes are not visible, but nothing is collapsed - hidden nodes
    if ((startNode && endNode) || !this._collapsedNodes) {
      return false;
    }

    // do not process promoted links if the promotedLinkBehavior is set to 'none'
    if (this.getOptions()['promotedLinkBehavior'] === 'none') return true;

    var startPromotedId = startNode
      ? startNode.getId()
      : this._findFirstVisibleAncestor(linkData['startNode']);
    var endPromotedId = endNode
      ? endNode.getId()
      : this._findFirstVisibleAncestor(linkData['endNode']);
    if (!(startPromotedId && endPromotedId)) {
      // start or end node for the link does not exist - could be hidden
      return false;
    } else if (startPromotedId === endPromotedId) {
      //unaccessible link that belongs to the same collapsed container - should be ignored
      return false;
    }

    // Use two maps to maintain promoted links.
    // One for promoted link data objects - used for rendering and layout.
    // One for keeping track of original links converted to promoted - used in data source events.
    var linkId = DvtDiagramLink.GetPromotedLinkId(this, startPromotedId, endPromotedId);
    if (!this._promotedLinksMap) this._promotedLinksMap = new (this.getCtx().ojMap)();
    if (!this._promotedLinksMap.has(linkId)) {
      this._promotedLinksMap.set(linkId, {
        id: linkId,
        startNode: startPromotedId,
        endNode: endPromotedId,
        _links: [linkData]
      });
    } else {
      this._promotedLinksMap.get(linkId)['_links'].push(linkData);
    }
    if (!this._linkToPromotedMap) this._linkToPromotedMap = new (this.getCtx().ojMap)();
    this._linkToPromotedMap.set(linkData['id'], linkId);
    return true;
  }

  /**
   * Adds a node to an array of collapsed nodes
   * @param {DvtDiagramNode} node a collapsed node
   * @private
   */
  _addToCollapsedArray(node) {
    if (!this._collapsedNodes) this._collapsedNodes = [];
    this._collapsedNodes.push(node);
  }

  /**
   * Searches for the first visible container for the child node
   * @param {string} childId id of a child node to find
   * @return {string} ancestor id or null if a child is not found
   * @private
   */
  _findFirstVisibleAncestor(childId) {
    //recursive search in nodes data for a child id
    var context = this.getCtx();
    var isDescendant = (data, chId) => {
      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (
            DvtDiagramDataUtils.compareValues(context, data[i]['id'], chId) ||
            isDescendant(data[i]['nodes'], chId)
          ) {
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
  }

  /**
   * Updates keyboard focus effect
   * @private
   */
  _updateKeyboardFocusEffect() {
    var navigable = this.getEventManager().getFocus();
    var keyboardUtils = this.Options._keyboardUtils;
    var busyContext = oj.Context.getContext(this.getContainerElem()).getBusyContext();
    busyContext.whenReady().then(() => {
      keyboardUtils.disableAllFocusable(this.getElem());
      if (this.activeInnerElems) {
        var node = this.getNodeById(this.activeInnerElemsItemId);
        // if neither the old active elem had an ID and elem was successfully focused
        // nor if old custom elem had an ID and was succesffuly focused
        if (
          !(
            (this._oldActiveElemId && this._enableActiveElems(this._oldActiveElemId, node)) ||
            (this._oldActiveCustomElemId &&
              this._enableActiveElems(this._oldActiveCustomElemId, node))
          )
        ) {
          // Take out actionable mode and just put focus on the nearest node.
          this.activeInnerElems = null;
          this._context._parentDiv.focus();
          node.showKeyboardFocusEffect();
          node.hasActiveInnerElems = false;
        }
        this.EventManager.setFocus(node);
        this._oldActiveElemId = null;
        this._oldActiveCustomElemId = null;
      }
    });
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
  }

  /**
   * Enables the active inner elems of node
   * @param {string} elemId id of the elem to set focus on
   * @param {DvtKeyboardNavigable} node enable all active elems inside this node
   * @return {boolean} true if inner elems were focused
   */
  _enableActiveElems(elemId, node) {
    var activeElem = document.getElementById(elemId);
    if (activeElem && node.getElem().contains(activeElem)) {
      var keyboardUtils = this.Options._keyboardUtils;
      var enabled = keyboardUtils.enableAllFocusable(node.getElem());
      if (node instanceof DvtDiagramNode && node.isDisclosed() && node.GetChildNodePane(true)) {
        keyboardUtils.disableAllFocusable(node.GetChildNodePane().getElem());
        enabled = Array.from(enabled);
        enabled = enabled.filter((item) => item.tabIndex !== -1);
      }
      if (enabled.length > 0) {
        activeElem ? activeElem.focus() : enabled[0].focus();
        this.activeInnerElems = enabled;
        node.hasActiveInnerElems = true;
      }
      return true;
    }
    return false;
  }

  /**
   * Clears cached disclosed nodes array if it exists
   * The method is called when user changed 'expanded' option on the component.
   */
  clearDisclosedState() {
    this.DisclosedNodes = null;
  }

  /**
   * @protected
   * Creates or updates link creation feedback
   * @param {dvt.BaseEvent} event DnD dragOver event
   */
  ShowLinkCreationFeedback(event) {
    if (this.getEventManager().LinkCreationStarted) {
      var stagePos = this._context.pageToStageCoords(event.pageX, event.pageY);
      var localPos = this.getPanZoomCanvas()
        .getContentPane()
        .stageToLocal({ x: stagePos.x, y: stagePos.y });
      if (this._linkCreationFeedBack) {
        var points = this._linkCreationFeedBack.GetCreationFeedbackPoints(localPos);
        this._linkCreationFeedBack.setPoints(points);
      } else {
        var obj = this.getEventManager().DragSource.getDragObject();
        if (obj instanceof DvtDiagramNode) {
          var startStagePos = this.getEventManager().DragSource.getDragCoords();
          var startLocalPos = this.getPanZoomCanvas()
            .getContentPane()
            .stageToLocal({ x: startStagePos.x, y: startStagePos.y });
          var linkDefaults = this.getOptions()['styleDefaults']['linkDefaults'];
          DvtDiagramStyleUtils.prepareLinkStyle(linkDefaults, 'style');
          //get additional styles from callback
          var styleCallback = this.getOptions()['dnd']['drag']['ports']['linkStyle'];
          if (styleCallback && typeof styleCallback === 'function') {
            var linkFeedbackStyle = styleCallback({
              dataContext: obj.getDataContext(),
              portElement: obj.__dragPort
            });
            if (linkFeedbackStyle) {
              linkDefaults['style'] = JsonUtils.merge(
                linkFeedbackStyle['svgStyle'],
                linkDefaults['style']
              );
              linkDefaults['svgClassName'] =
                linkFeedbackStyle['svgClassName'] || linkDefaults['className'];
            }
          }
          var linkData = {
            id: 'linkFeedback',
            startNode: obj.getId(),
            endNode: obj.getId()
          };
          linkData = JsonUtils.merge(linkData, linkDefaults);
          var link = new DvtDiagramLink(this.getCtx(), this, linkData, false);
          this.getNodesPane().addChild(link);
          link.setMouseEnabled(false);
          link.setPoints([startLocalPos.x, startLocalPos.y, localPos.x, localPos.y]);
          this._linkCreationFeedBack = link;
        }
      }
    }
  }

  /**
   * Removes link creation feedback
   * @protected
   */
  HideLinkCreationFeedback() {
    this.getNodesPane().removeChild(this._linkCreationFeedBack);
    this._linkCreationFeedBack = null;
  }

  /**
   * Data source change event handler
   * @param {string} type event type - add, remove or change
   * @param {Object} event event data
   */
  handleDataSourceChangeEvent(type, event) {
    var animationOnDataChange = DvtDiagramStyleUtils.getAnimOnDataChange(this);
    if (animationOnDataChange !== 'none') {
      // dispatch not ready event
      this.dispatchEvent(EventFactory.newEvent('notready'));
      this._oldDataAnimState = new DvtDiagramDataAnimationState(this, type, event);
    }
    this._currentPanZoomState = this._calcPanZoomState(this.getPanZoomCanvas());
    //reset pan constraints
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
      if (this.getOptions()['expanded'] === 'all') {
        if (nodes) {
          var disclosedNodes = this.DisclosedNodes;
          var updateDisclosed = (nodeArr) => {
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
    }
    //update animation state with new nodes and links objects if necessary
    this._oldDataAnimState && this._oldDataAnimState.updateStateFromEvent(type, event);

    this._updateLayoutContext(type, event);
    var emptyDiagram = this.GetAllNodes().length === 0;
    if (!emptyDiagram) {
      this._renderCount++;
      var res = this.layout();
      var thisRef = this;
      var renderCount = this._renderCount;
      res.then(
        () => {
          if (renderCount === thisRef._renderCount) {
            thisRef._partialUpdate = true;
            thisRef._updateOverview(type, event);
            thisRef._processContent(false);
            thisRef._partialUpdate = false;
          }
        }, //success
        () => {
          if (renderCount === thisRef._renderCount) {
            thisRef.removeChild(thisRef._oldPanZoomCanvas);
            thisRef._oldPanZoomCanvas = null;
            thisRef._bRendered = true;
            this._currentPanZoomState = null;
          }
        } //failure
      );
    } else {
      this._processContent(emptyDiagram);
    }
  }

  /**
   * Updates overview window if exists according to the event type and data - changes, adds or remvoes nodes and links
   * @param {string} type event type
   * @param {Object} event DiagramDataSource event
   * @private
   */
  _updateOverview(type, event) {
    if (this.Overview) {
      DvtDiagramOverviewUtils.UpdateOverviewContent(this, this.Overview, type, event);
    }
  }

  /**
   * Updates existing layout context according to the event type and data - changes, adds or remvoes nodes and links
   * @param {string} type event type
   * @param {Object} event DiagramDataSource event
   * @private
   */
  _updateLayoutContext(type, event) {
    if (!this._layoutContext) {
      this._layoutContext = this.CreateEmptyLayoutContext();
    }
    var layoutContext = this._layoutContext;
    layoutContext.setEventData({ type: type, data: event });

    var nodes = event['data']['nodes'];
    var links = event['data']['links'];
    var i, nc, nodeId, pc, parentNode, linkId;
    if (event['parentId']) {
      pc = layoutContext.getNodeById(event['parentId']);
      parentNode = this.getNodeById(event['parentId']);
    }

    var link;
    var startId;
    var endId;
    if (type == 'add') {
      if (nodes) {
        // Add layout context for the nodes - either append node context
        // to the existing parent or add node context to the top level
        if (pc && parentNode) {
          pc.Reset();
          this._appendLayoutContextForChildNodes(
            parentNode,
            pc,
            layoutContext,
            nodes,
            event['index']
          );
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
          link = this.getLinkById(linkId) || this.getLinkById(this._linkToPromotedMap.get(linkId));
          if (link) {
            if (layoutContext.getLinkById(link.getId())) {
              // links exists - case of promoted link
              continue;
            }
            startId = link.getData()['startNode'];
            endId = link.getData()['endNode'];
            if (layoutContext.getNodeById(startId) && layoutContext.getNodeById(endId)) {
              layoutContext.addLink(
                this.CreateLayoutContextLink(link, startId, endId, layoutContext)
              );
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
          link = this.getLinkById(linkId) || this.getLinkById(this._linkToPromotedMap.get(linkId));
          if (link) {
            layoutContext.removeLink(layoutContext.getLinkById(link.getId()));
            startId = link.getData()['startNode'];
            endId = link.getData()['endNode'];
            if (layoutContext.getNodeById(startId) && layoutContext.getNodeById(endId)) {
              layoutContext.addLink(
                this.CreateLayoutContextLink(link, startId, endId, layoutContext)
              );
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
      }
      // Run through layout context for the links and remove all the links
      // that do not exist in the links map. Even if the links might not be
      // specified for the removal by the event, connecting links will be
      // removed when corresponding start or end node is removed.
      for (i = layoutContext.getLinkCount() - 1; i >= 0; i--) {
        var ld = layoutContext.getLinkByIndex(i);
        if (!this._links.get(ld.getId())) {
          layoutContext.removeLink(ld);
        }
      }
    }
  }

  /**
   * @private
   * Returns layout context object. Crates one of necessary
   * @return {DvtDiagramLayoutContext} layout context for the diagram
   */
  _getLayoutContext() {
    if (!this._layoutContext) {
      var layoutContext = this.CreateEmptyLayoutContext();
      // add all nodes starting with root nodes
      for (var n = 0; n < this._arRootIds.length; n++) {
        var nodeId = this._arRootIds[n];
        if (!this.getNodeById(nodeId)) continue;
        var bRenderAfter = this._bRendered ? false : true;
        var rootNode = this.getNodeById(nodeId);
        var lcRootNode = this.CreateLayoutContextNode(rootNode, null, bRenderAfter, layoutContext);
        lcRootNode.copyFrom(
          this._oldLayoutContext ? this._oldLayoutContext.getNodeById(nodeId) : null
        );
        this._addLayoutContextForChildNodes(rootNode, lcRootNode, layoutContext, bRenderAfter);
        layoutContext.addNode(lcRootNode);
      }
      // add all links
      var thisRef = this;
      this._links.forEach((link, linkId, map) => {
        var startId = link.getData()['startNode'];
        var endId = link.getData()['endNode'];
        if (layoutContext.getNodeById(startId) && layoutContext.getNodeById(endId)) {
          var lcLink = thisRef.CreateLayoutContextLink(link, startId, endId, layoutContext);
          lcLink.copyFrom(
            thisRef._oldLayoutContext ? thisRef._oldLayoutContext.getLinkById(linkId) : null
          );
          layoutContext.addLink(lcLink);
        }
      });

      this._layoutContext = layoutContext;
      this._oldLayoutContext = null;
    }
    return this._layoutContext;
  }

  /**
   * Gets touch event pane
   * @return {dvt.Container|null} the reference to touch event pane if it is a touch device or null
   */
  getTouchEventPane() {
    return this._touchEventPane || null;
  }

  /**
   * Gets bottom pane used for highlighting edge case:
   * the majority of the diagram objects should be highlighted,
   * so instead of moving highlighted objects to the top pane,
   * move faded objects to the bottom pane
   * @return {dvt.Container} bottom pane
   */
  getBottomPane() {
    if (!this._bottomPane) {
      this._bottomPane = new Container(this.getCtx());
      var pzc = this.getPanZoomCanvas();
      pzc.getContentPane().addChildAt(this._bottomPane, 0);
    }
    return this._bottomPane;
  }

  /**
   * Creates empty layout context for the component
   * @return {DvtDiagramLayoutContext}  layout context
   * @protected
   */
  CreateEmptyLayoutContext() {
    var layoutContext = new DvtDiagramLayoutContext(this.getCtx());
    //: inform layout of reading direction
    layoutContext.setLocaleR2L(Agent.isRightToLeft(this.getCtx()));
    layoutContext.setComponentSize(
      new DvtDiagramRectangle(0, 0, this.getWidth(), this.getHeight())
    );
    return layoutContext;
  }

  /**
   * Creates layout context for the node
   * @param {DvtDiagramNode} node diagram node
   * @param {string} layout layout name
   * @param {boolean} bRenderAfter flag that indicates that node is not rendered yet, it will be render during layout or after layout is done
   * @param {object} layoutContext layout context
   * @return {DvtDiagramLayoutContextNode} layout context for the node
   */
  CreateLayoutContextNode(node, layout, bRenderAfter, layoutContext) {
    var nc = new DvtDiagramLayoutContextNode();
    nc.setId(node.getId ? node.getId() : node.getData().getId());
    //: set both the content bounds and the overall bounds of
    //the node on the layout context
    nc.setBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getLayoutBounds()));
    nc.setContentBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getContentBounds()));
    var nodeData = node.getLayoutAttributes
      ? node.getLayoutAttributes(layout)
      : node.getData()['_itemData'];
    nc.setLayoutAttributes(nodeData);
    nc.setData(nodeData);
    nc.setLabelBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(node.getLabelBounds()));
    nc.setLabelPosition(DvtDiagramLayoutUtils.convertPointToDiagramPoint(node.getLabelPosition()));
    nc.setSelected(node.isSelected());
    if (node.isDisclosed()) {
      nc.setDisclosed(true);
      //only set container padding AFTER setting bounds and disclosed
      nc.SetContainerPaddingObj(Diagram.getLayoutContainerPadding(node.getContainerPadding()));
    }
    nc.setContainerId(node.getGroupId());
    nc.Component = this;
    nc.IsRendered = !bRenderAfter;
    nc.LayoutContext = layoutContext;
    return nc;
  }

  /**
   * @protected
   * Apply the layout context
   * @param {DvtDiagramLayoutContext} layoutContext The layout context
   * @param {boolean} bSaveOffset Flag for saving the layout offset (true for the top level)
   */
  ApplyLayoutContext(layoutContext, bSaveOffset) {
    //: apply container padding that was set while laying out the container's children
    var topContainerPadding = layoutContext.getContainerPadding();
    if (topContainerPadding) {
      var containerId = layoutContext.getContainerId();
      if (containerId) {
        var containerNode = this.getNodeById(containerId);
        if (containerNode) {
          containerNode.setContainerPadding(Diagram.getContainerPadding(topContainerPadding));
        }
      }
    }

    // Calculate the translation necessary to make the upper left hand corner = (0,0)
    var minx = Number.MAX_VALUE;
    var miny = Number.MAX_VALUE;
    var nc;
    var lc;
    var pos;
    for (var ni = 0; ni < layoutContext.getNodeCount(); ni++) {
      nc = layoutContext.getNodeByIndex(ni);
      pos = nc.getPosition();
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
      lc = layoutContext.getLinkByIndex(li);
      // get link bounds including label
      var linkBounds = DvtDiagramLinkUtils.GetLinkBounds(lc);
      minx = Math.min(minx, linkBounds['x']);
      miny = Math.min(miny, linkBounds['y']);
    }

    var lopt = new Point(-minx, -miny);
    var tx = lopt.x;
    var ty = lopt.y;
    var dirtyLayoutContext = layoutContext.getDirtyContext();
    for (var nj = 0; nj < layoutContext.getNodeCount(); nj++) {
      nc = layoutContext.getNodeByIndex(nj);
      if (nc.getContainerId()) {
        nc.ContentOffset = new DvtDiagramPoint(lopt.x, lopt.y); // adjust content offset that is used by global layout
      }
      if (!dirtyLayoutContext.has(nc.getId())) continue;
      var node = this.getNodeById(nc.getId());
      pos = nc.getPosition();
      if (pos) {
        node.SetPosition(pos['x'] + tx, pos['y'] + ty);
      }
      this.ApplyLabelPosition(nc, node, DvtDiagramLayoutUtils.convertDiagramPointToPoint(pos));

      //apply new container padding
      if (node.isDisclosed()) {
        var containerPadding = nc.getContainerPadding();
        if (containerPadding) {
          node.setContainerPadding(Diagram.getContainerPadding(containerPadding));
        }
      }
    }

    for (var lj = 0; lj < layoutContext.getLinkCount(); lj++) {
      lc = layoutContext.getLinkByIndex(lj);
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
      this.ApplyLabelPosition(lc, link, new Point(0, 0));
    }

    //save panZoomState from layout, if specified
    var layoutPanZoomState = layoutContext.getPanZoomState();
    if (layoutPanZoomState) {
      this._layoutPanZoomState = layoutPanZoomState;
    }

    if (bSaveOffset) this._layoutOffset = new Point(tx, ty);
  }

  /**
   * Calculates translation offset for the link
   * @param {DvtDiagramLink} link link
   * @param {DvtDiagramLayoutContextLink} lc layout context for the link
   * @param {dvt.Point} lopt layout offset point
   * @return {dvt.Point} translation offset for the link
   * @protected
   */
  GetLinkTranslationOffset(link, lc, lopt) {
    var offset = new Point(0, 0);
    var context = this.getCtx();
    if (!link.getGroupId()) {
      //top level container - use top level layout offset
      offset = lopt;
    } else if (
      !DvtDiagramDataUtils.compareValues(context, link.getGroupId(), lc.getCoordinateSpace())
    ) {
      //link position is given either global or relative to some ancestor container
      var ancestorId = lc.getCoordinateSpace();
      var node = this.getNodeById(link.getGroupId());
      while (node) {
        var padding = node.getContainerPadding();
        offset['x'] -= padding['left'] - node.GetPosition()['x'];
        offset['y'] -= padding['top'] - node.GetPosition()['y'];
        var containerId = node.getGroupId();
        node = !DvtDiagramDataUtils.compareValues(context, containerId, ancestorId)
          ? this.getNodeById(containerId)
          : null;
      }
      if (!ancestorId) {
        //should adjust for top level offset that is already added to the top level nodes
        offset['x'] += lopt.x;
        offset['y'] += lopt.y;
      }
    }
    //position already adjusted to the common container - nothing to adjust
    return offset;
  }

  /**
   * Gets panZoomState if it was set by the layout
   * @return {Object} layout panZoomState
   * @protected
   */
  GetLayoutPanZoomState() {
    return this._layoutPanZoomState;
  }

  /**
   * @protected
   * Check whether a panZoomState is set by the layout engine
   * @return {boolean} true if panZoomState is set by the layout engine
   */
  IsLayoutPanZoomState() {
    return this._layoutPanZoomState ? true : false;
  }

  /**
   * @protected
   * Clear a panZoomState that was set by the layout engine. Should be done to avoid stale panZoomState.
   */
  ClearLayoutPanZoomState() {
    this._layoutPanZoomState = null;
  }

  /**
   * Adjusts the minimum zoom level of the panZoomCanvas if the diagram minZoom was set to 0.0
   * Will return the resulting view bounds if there were calculated
   * @param {dvt.Rectangle} fitBounds (optional) the zoom-to-fit bounds, if known
   * @return {dvt.Rectangle} the bounds required to zoom to fit all content
   * @protected
   */
  AdjustMinZoom() {
    if (this.getMinZoom() == 0.0) {
      // Auto adjust minzoom of panzoomcanvas
      var panZoomCanvas = this.getPanZoomCanvas();
      var minZoomFitBounds = this.GetViewBounds();
      var minScale = this.CalculateMinimumScale(minZoomFitBounds);
      panZoomCanvas.setMinZoom(Math.min(minScale, panZoomCanvas.getMaxZoom()));
      return minZoomFitBounds;
    }
    return null;
  }

  /**
   * Calculates the minimum scale needed to zoom to fit the specified bounds
   * @param {dvt.Rectangle} bounds the bounds to calculate the scale for
   * @return {number} the minimum scale
   * @protected
   */
  CalculateMinimumScale(bounds) {
    if (!bounds) return 0;
    var panZoomCanvas = this.getPanZoomCanvas();
    var minScaleX = (this.Width - 2 * panZoomCanvas.getZoomToFitPadding()) / bounds.w;
    var minScaleY = (this.Height - 2 * panZoomCanvas.getZoomToFitPadding()) / bounds.h;
    return Math.min(minScaleX, minScaleY);
  }

  /**
   * Gets view bounds
   * @return {dvt.Rectangle} view bounds
   * @protected
   */
  GetViewBounds() {
    if (this._cachedViewBounds) return this._cachedViewBounds;
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
    }

    //if a list of links wasn't provided, then use all links
    var arLinkIds = this.GetAllLinks();
    for (var j = 0; j < arLinkIds.length; j++) {
      linkId = arLinkIds[j];
      link = this.getLinkById(linkId);
      if (link && link.getVisible()) {
        if (link.getGroupId()) {
          continue;
        }

        dims = DvtDiagramLinkUtils.GetLinkBounds(link);
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
  }

  /**
   * Sets the pan constraints based on the current content dimensions
   * @param {number} x The x coordinate of the upper left corner of the content bounding box
   * @param {number} y The y coordinate of the upper left corner of the content bounding box
   * @param {number} w The width of the content bounding box
   * @param {number} h The height of the content bounding box
   * @param {number} zoom The current panZoomCanvas zoom level
   * @protected
   */
  ConstrainPanning(x, y, w, h, zoom) {
    var pzc = this.getPanZoomCanvas();
    var minPanX, maxPanX, minPanY, maxPanY;
    if (this.Options.panning === 'fixed') {
      // Get pan zoom canvas and get minZoom value out of it.
      var minZoom = pzc.getMinZoom();
      // Find left corner of the content at min zoom and content is centered
      var minZoomX = (pzc.getSize().w - w * minZoom) / 2 - x * minZoom;
      var minZoomY = (pzc.getSize().h - h * minZoom) / 2 - y * minZoom;
      // Now find how zoom value changed from min zoom
      var zoomRatio = zoom / minZoom;
      // When we pan all the way to the right, the left corner of displayable area is 0,0 as in min zoom.
      // When we pan all the way to the left, lets find the corner of the displayable area
      var leftCornerX = pzc.getSize().w - pzc.getSize().w * zoomRatio;
      var leftCornerY = pzc.getSize().h - pzc.getSize().h * zoomRatio;
      // Now we have everything to calculate pan zoom constraints
      minPanX = leftCornerX + minZoomX * zoomRatio;
      minPanY = leftCornerY + minZoomY * zoomRatio;
      maxPanX = minZoomX * zoomRatio;
      maxPanY = minZoomY * zoomRatio;
    } else {
      //for auto and centerContent
      var halfViewportW = pzc.getSize().w / 2;
      var halfViewportH = pzc.getSize().h / 2;
      minPanX = halfViewportW - (w + x) * zoom;
      minPanY = halfViewportH - (h + y) * zoom;
      maxPanX = halfViewportW - x * zoom;
      maxPanY = halfViewportH - y * zoom;
    }
    if (this.IsLayoutPanZoomState()) {
      // if the viewport is specified and the viewport bounds are outside of the panning constraints,
      // adjust the constraints symmetrically to include the viewport bounds
      var offset = this.getLayoutOffset();
      var panZoom = this.GetLayoutPanZoomState();
      var boundsX = panZoom.centerX
        ? (panZoom.centerX + offset.x) * zoom - this.Width / 2
        : -offset.x * zoom;
      var boundsY = panZoom.centerY
        ? (panZoom.centerY + offset.y) * zoom - this.Height / 2
        : -offset.y * zoom;
      var dx, dy;
      if (-boundsX * zoom < minPanX) {
        dx = minPanX + boundsX * zoom;
        minPanX -= dx;
        maxPanX += dx;
      } else if (-boundsX * zoom > maxPanX) {
        dx = -boundsX * zoom - maxPanX;
        minPanX -= dx;
        maxPanX += dx;
      }
      if (-boundsY * zoom < minPanY) {
        dy = minPanY + boundsY * zoom;
        minPanY -= dy;
        maxPanY += dy;
      } else if (-boundsY * zoom > maxPanY) {
        dy = -boundsY * zoom - maxPanY;
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
  }

  /**
   * Convert key notation into dot notation
   * @param {object} layoutContainerPadding the object with the layout container padding values
   * @return {object} object with the container padding values
   */
  static getContainerPadding(layoutContainerPadding) {
    var containerPadding = new Object();
    containerPadding.top = layoutContainerPadding['top'];
    containerPadding.right = layoutContainerPadding['right'];
    containerPadding.bottom = layoutContainerPadding['bottom'];
    containerPadding.left = layoutContainerPadding['left'];
    return containerPadding;
  }

  /**
   * Convert dot notation into key notation
   * @param {object} containerPadding the object with the container padding values
   * @return {object} object with the container padding values
   */
  static getLayoutContainerPadding(containerPadding) {
    var layoutContainerPadding = new Object();
    layoutContainerPadding['top'] = containerPadding.top;
    layoutContainerPadding['right'] = containerPadding.right;
    layoutContainerPadding['bottom'] = containerPadding.bottom;
    layoutContainerPadding['left'] = containerPadding.left;
    return layoutContainerPadding;
  }

  /**
   * Updates layout context for the node/link
   * @param {DvtDiagramLayoutContextNode | DvtDiagramLayoutContextNode} objc node or link context
   * @param {DvtDiagramNode | DvtDiagramLink} obj diagram node or link
   * @param {dvt.Point} pos position of node or link
   * @protected
   */
  ApplyLabelPosition(objc, obj, pos) {
    var labelBounds = objc.getLabelBounds();
    labelBounds = DvtDiagramLayoutUtils.convertDiagramRectToRect(labelBounds);
    var labelPos = objc.getLabelPosition();
    if (labelBounds && labelPos) {
      // translate to make these relative to the node or link
      var translatedPos = new Point(labelPos['x'] - pos.x, labelPos['y'] - pos.y);
      var labelRotAngle = objc.getLabelRotationAngle();
      var labelRotPoint = DvtDiagramLayoutUtils.convertDiagramPointToPoint(
        objc.getLabelRotationPoint()
      );
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

  /**
   * Gets layout offset
   * @return {dvt.Point} x,y coordinates for layout offset
   */
  getLayoutOffset() {
    return this._layoutOffset ? this._layoutOffset : new Point(0, 0);
  }

  /**
   * Returns the custom obj keyboard bounding box
   * @param {DvtDiagramNode | DvtDiagramLink} obj diagram node or link
   * @return {dvt.Rectangle} keyboard bounding box of rectangle
   */
  getCustomObjKeyboardBoundingBox(obj) {
    var objCoords = obj.getElem().getBoundingClientRect();
    var contentPaneCoords = this.getPanZoomCanvas()
      .getContentPane()
      .getElem()
      .getBoundingClientRect();
    var cpMatrix = this.getPanZoomCanvas().getContentPane().getMatrix();
    return new Rectangle(
      objCoords.left - contentPaneCoords.left + cpMatrix.getTx(),
      objCoords.top - contentPaneCoords.top + cpMatrix.getTy(),
      objCoords.width,
      objCoords.height
    );
  }

  /**
   * Creates layout context for the link
   * @param {DvtDiagramLink} link diagram link
   * @param {string} startId node id for the link start
   * @param {string} endId node id for the link end
   * @param {DvtDiagramLayoutContext} layoutContext
   * @return {DvtDiagramLayoutContextLink} layout context for the link
   */
  CreateLayoutContextLink(link, startId, endId, layoutContext) {
    var lc = new DvtDiagramLayoutContextLink();
    lc.setId(link.getId ? link.getId() : link.getData().getId());
    lc.setStartId(startId ? startId : link.getData().getStartId());
    lc.setEndId(endId ? endId : link.getData().getEndId());
    // This code does not require any special handling for the _noTemplate case!
    var linkData;
    if (link.isPromoted()) {
      linkData = link.getData()['_links'];
      if (this.isDataProviderMode()) {
        linkData = linkData.map((item) => {
          return item['_itemData'];
        });
      }
    } else {
      linkData = link.getData()['_itemData'];
    }
    lc.setLayoutAttributes(linkData);
    lc.setData(linkData);
    lc.setLabelBounds(DvtDiagramLayoutUtils.convertRectToDiagramRect(link.getLabelBounds()));
    lc.setLabelPosition(DvtDiagramLayoutUtils.convertPointToDiagramPoint(link.getLabelPosition()));
    lc.setStartConnectorOffset(link.getStartConnectorOffset());
    lc.setEndConnectorOffset(link.getEndConnectorOffset());
    lc.setLinkWidth(link.getLinkWidth());
    lc.setSelected(link.isSelected());
    lc.setPromoted(link.isPromoted());
    lc.LayoutContext = layoutContext;
    return lc;
  }

  /**
   * @private
   * Removes specified nodes
   * @param {DvtDiagramNode} parent parend node
   * @param {array} nodesData an array of nodes data objects to remove
   */
  _removeNodes(parent, nodesData) {
    if (!nodesData || (parent && !parent.isDisclosed())) {
      return;
    }

    var linksToRemove = [];
    for (var i = 0; i < nodesData.length; i++) {
      var nodeId = nodesData[i]['id'];
      var node = this.getNodeById(nodeId);
      //remove child nodes
      this._removeNodes(node, node.getData()['nodes']);
      //remove all links connected to the node
      this._links.forEach((link, linkId, map) => {
        if (link.getStartId() == nodeId || link.getEndId() == nodeId) {
          linksToRemove.push(link.getData());
        }
      });

      //remove itself
      if (parent) {
        parent.removeChildNode(node);
      } else {
        ArrayUtils.removeItem(this._arRootIds, nodeId);
        this.getNodesPane().removeChild(node);
      }
      ArrayUtils.removeItem(this._arNodeIds, nodeId);
      this._nodes.delete(nodeId);
    }
    this._removeLinks(linksToRemove);
  }

  /**
   * @private
   * Removes specified links
   * @param {array} linksData an array of link data objects to remove
   */
  _removeLinks(linksData) {
    if (!linksData || linksData.length == 0) {
      return;
    }
    for (var i = 0; i < linksData.length; i++) {
      var linkId = linksData[i]['id'];
      var link = this.getLinkById(linkId);
      var parent;
      var startNode;
      var endNode;
      if (link) {
        parent = link.getParent();
        parent.removeChild(link);
        startNode = this.getNodeById(link.getStartId());
        endNode = this.getNodeById(link.getEndId());
        startNode && startNode.removeOutLinkId(linkId);
        endNode && endNode.removeInLinkId(linkId);
        ArrayUtils.removeItem(this._arLinkIds, linkId);
        this._links.delete(linkId);
      } else if (this._linkToPromotedMap && this._linkToPromotedMap.has(linkId)) {
        var promotedLinkId = this._linkToPromotedMap.get(linkId);
        var promotedLink = this._links.get(promotedLinkId);
        var data = promotedLink ? promotedLink.getData()['_links'] : null;
        if (data && data.length == 1 && data[0]['id'] == linkId) {
          //just remove the promoted link
          parent = promotedLink.getParent();
          parent.removeChild(promotedLink);
          startNode = this.getNodeById(promotedLink.getStartId());
          endNode = this.getNodeById(promotedLink.getEndId());
          startNode && startNode.removeOutLinkId(promotedLinkId);
          endNode && endNode.removeInLinkId(promotedLinkId);
          ArrayUtils.removeItem(this._arLinkIds, promotedLink.getId());
          this._links.delete(promotedLink.getId());
          this._promotedLinksMap.delete(promotedLink.getId());
          this._linkToPromotedMap.delete(linkId);
        } else if (data) {
          // don't remove the promoted link, but update its links data
          // don't need to update layout context for the link, since it has a reference to the data
          for (var j = 0; j < data.length; j++) {
            if (DvtDiagramDataUtils.compareValues(this.getCtx(), data[j]['id'], linkId)) {
              data.splice(j, 1);
            }
          }
          this._linkToPromotedMap.delete(linkId);
        }
      }
    }
  }

  /**
   * Handles the touch start event
   */
  handleTouchStart() {
    // noop: Called from HandleImmediateTouchStartInternal
  }

  /**
   * Handles the touch end event
   */
  handleTouchEnd() {
    this._clearTouchEventContent();
    if (
      this._touchEventContentDiagramObjRef &&
      this._touchEventContentDiagramObjRef.handleTouchEnd
    ) {
      // Clear the states in the node/link as this will not be called
      // if the event is not ended on them
      this._touchEventContentDiagramObjRef.handleTouchEnd();
      // Null out the reference as it need not be called again for this diagram obj
      this._touchEventContentDiagramObjRef = null;
    }
  }

  /**
   * Stores the content in the touch event pane
   * @param {Element|Array<Element>} content The content that has to be stored
   * @param {DvtDiagramNode|DvtDiagramLink} diagramObj The node/link that is storing the content
   */
  storeTouchEventContent(content, diagramObj) {
    if (!this.getTouchEventPane() || !content) {
      return;
    }

    // We support storing only one diagram object's content at any given time.
    this._touchEventContentDiagramObjRef = diagramObj;
    if (content.namespaceURI === ToolkitUtils.SVG_NS) {
      ToolkitUtils.appendChildElem(this.getTouchEventPane().getElem(), content);
    } else if (Array.isArray(content)) {
      content.forEach((node) => {
        ToolkitUtils.appendChildElem(this.getTouchEventPane().getElem(), node);
      });
    }
  }

  /**
   * Removes the contents from the touch content pane
   */
  _clearTouchEventContent() {
    if (!this.getTouchEventPane()) {
      return;
    }
    var touchEventPaneElem = this.getTouchEventPane().getElem();

    while (touchEventPaneElem.firstChild) {
      touchEventPaneElem.removeChild(touchEventPaneElem.firstChild);
    }
  }
}

export { Diagram };
