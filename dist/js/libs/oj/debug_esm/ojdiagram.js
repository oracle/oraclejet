/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { __GetWidgetConstructor, setDefaultOptions, createDynamicPropertyGetter } from 'ojs/ojcomponentcore';
import DvtAttributeUtils from 'ojs/ojdvt-base';
import * as DiagramUtils from 'ojs/ojdiagram-utils';
import $ from 'jquery';
import { Diagram } from 'ojs/ojdiagram-toolkit';
import * as Logger from 'ojs/ojlogger';
import { error } from 'ojs/ojlogger';
import { KeySetImpl } from 'ojs/ojkeyset';
import 'ojs/ojdatasource-common';
import { enableAllFocusableElements, disableAllFocusableElements, getActionableElementsInNode, getFocusableElementsInNode } from 'ojs/ojkeyboardfocus-utils';

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
var __oj_diagram_metadata = 
{
  "properties": {
    "animationOnDataChange": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "none"
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "none"
    },
    "as": {
      "type": "string",
      "value": ""
    },
    "data": {
      "type": "object",
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "unsupported",
              "since": "13.0.0",
              "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
            }
          ]
        }
      }
    },
    "dnd": {
      "type": "object",
      "properties": {
        "drag": {
          "type": "object",
          "properties": {
            "nodes": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "drag": {
                  "type": "function"
                },
                "dragEnd": {
                  "type": "function"
                },
                "dragStart": {
                  "type": "function"
                }
              }
            },
            "ports": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "drag": {
                  "type": "function"
                },
                "dragEnd": {
                  "type": "function"
                },
                "dragStart": {
                  "type": "function"
                },
                "linkStyle": {
                  "type": "function"
                },
                "selector": {
                  "type": "string"
                }
              }
            }
          }
        },
        "drop": {
          "type": "object",
          "properties": {
            "background": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "dragEnter": {
                  "type": "function"
                },
                "dragLeave": {
                  "type": "function"
                },
                "dragOver": {
                  "type": "function"
                },
                "drop": {
                  "type": "function"
                }
              }
            },
            "links": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "dragEnter": {
                  "type": "function"
                },
                "dragLeave": {
                  "type": "function"
                },
                "dragOver": {
                  "type": "function"
                },
                "drop": {
                  "type": "function"
                }
              }
            },
            "nodes": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "dragEnter": {
                  "type": "function"
                },
                "dragLeave": {
                  "type": "function"
                },
                "dragOver": {
                  "type": "function"
                },
                "drop": {
                  "type": "function"
                }
              }
            },
            "ports": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "dragEnter": {
                  "type": "function"
                },
                "dragLeave": {
                  "type": "function"
                },
                "dragOver": {
                  "type": "function"
                },
                "drop": {
                  "type": "function"
                },
                "selector": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "expanded": {
      "type": "KeySet",
      "writeback": true
    },
    "focusRenderer": {
      "type": "function"
    },
    "hiddenCategories": {
      "type": "Array<string>",
      "writeback": true,
      "value": []
    },
    "highlightMatch": {
      "type": "string",
      "enumValues": [
        "all",
        "any"
      ],
      "value": "all"
    },
    "highlightedCategories": {
      "type": "Array<string>",
      "writeback": true,
      "value": []
    },
    "hoverBehavior": {
      "type": "string",
      "enumValues": [
        "dim",
        "none"
      ],
      "value": "none"
    },
    "hoverRenderer": {
      "type": "function"
    },
    "layout": {
      "type": "function"
    },
    "linkContent": {
      "type": "object",
      "properties": {
        "focusRenderer": {
          "type": "function"
        },
        "hoverRenderer": {
          "type": "function"
        },
        "renderer": {
          "type": "function"
        },
        "selectionRenderer": {
          "type": "function"
        }
      }
    },
    "linkData": {
      "type": "object",
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "unsupported",
              "since": "13.0.0",
              "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
            }
          ]
        }
      }
    },
    "linkHighlightMode": {
      "type": "string",
      "enumValues": [
        "link",
        "linkAndNodes"
      ],
      "value": "link"
    },
    "linkProperties": {
      "type": "function"
    },
    "maxZoom": {
      "type": "number",
      "value": 1
    },
    "minZoom": {
      "type": "number",
      "value": 0
    },
    "nodeContent": {
      "type": "object",
      "properties": {
        "focusRenderer": {
          "type": "function"
        },
        "hoverRenderer": {
          "type": "function"
        },
        "renderer": {
          "type": "function"
        },
        "selectionRenderer": {
          "type": "function"
        },
        "zoomRenderer": {
          "type": "function"
        }
      }
    },
    "nodeData": {
      "type": "object",
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "unsupported",
              "since": "13.0.0",
              "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
            }
          ]
        }
      }
    },
    "nodeHighlightMode": {
      "type": "string",
      "enumValues": [
        "node",
        "nodeAndIncomingLinks",
        "nodeAndLinks",
        "nodeAndOutgoingLinks"
      ],
      "value": "node"
    },
    "nodeProperties": {
      "type": "function"
    },
    "overview": {
      "type": "object",
      "properties": {
        "fitArea": {
          "type": "string",
          "enumValues": [
            "canvas",
            "content"
          ],
          "value": "content"
        },
        "halign": {
          "type": "string",
          "enumValues": [
            "center",
            "end",
            "start"
          ],
          "value": "end"
        },
        "height": {
          "type": "number",
          "value": 100
        },
        "preserveAspectRatio": {
          "type": "string",
          "enumValues": [
            "meet",
            "none"
          ],
          "value": "meet"
        },
        "rendered": {
          "type": "string",
          "enumValues": [
            "off",
            "on"
          ],
          "value": "off"
        },
        "valign": {
          "type": "string",
          "enumValues": [
            "bottom",
            "middle",
            "top"
          ],
          "value": "bottom"
        },
        "width": {
          "type": "number",
          "value": 200
        }
      }
    },
    "panDirection": {
      "type": "string",
      "enumValues": [
        "auto",
        "x",
        "y"
      ],
      "value": "auto"
    },
    "panZoomState": {
      "type": "object",
      "writeback": true,
      "properties": {
        "centerX": {
          "type": "number"
        },
        "centerY": {
          "type": "number"
        },
        "zoom": {
          "type": "number",
          "value": 0
        }
      }
    },
    "panning": {
      "type": "string",
      "enumValues": [
        "auto",
        "centerContent",
        "fixed",
        "none"
      ],
      "value": "none"
    },
    "promotedLinkBehavior": {
      "type": "string",
      "enumValues": [
        "full",
        "lazy",
        "none"
      ],
      "value": "lazy"
    },
    "renderer": {
      "type": "function"
    },
    "selection": {
      "type": "Array<any>",
      "writeback": true,
      "value": []
    },
    "selectionMode": {
      "type": "string",
      "enumValues": [
        "multiple",
        "none",
        "single"
      ],
      "value": "none"
    },
    "selectionRenderer": {
      "type": "function"
    },
    "styleDefaults": {
      "type": "object",
      "properties": {
        "animationDuration": {
          "type": "number"
        },
        "hoverBehaviorDelay": {
          "type": "number",
          "value": 200
        },
        "linkDefaults": {
          "type": "object",
          "properties": {
            "color": {
              "type": "string"
            },
            "endConnectorType": {
              "type": "string",
              "enumValues": [
                "arrow",
                "arrowConcave",
                "arrowOpen",
                "circle",
                "none",
                "rectangle",
                "rectangleRounded"
              ],
              "value": "none"
            },
            "labelStyle": {
              "type": "object"
            },
            "startConnectorType": {
              "type": "string",
              "enumValues": [
                "arrow",
                "arrowConcave",
                "arrowOpen",
                "circle",
                "none",
                "rectangle",
                "rectangleRounded"
              ],
              "value": "none"
            },
            "svgClassName": {
              "type": "string",
              "value": ""
            },
            "svgStyle": {
              "type": "object",
              "value": {}
            },
            "width": {
              "type": "number",
              "value": 1
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
                "borderRadius": {
                  "type": "string"
                },
                "borderWidth": {
                  "type": "number"
                },
                "color": {
                  "type": "string"
                },
                "height": {
                  "type": "number",
                  "value": 10
                },
                "pattern": {
                  "type": "string",
                  "enumValues": [
                    "largeChecker",
                    "largeCrosshatch",
                    "largeDiagonalLeft",
                    "largeDiagonalRight",
                    "largeDiamond",
                    "largeTriangle",
                    "none",
                    "smallChecker",
                    "smallCrosshatch",
                    "smallDiagonalLeft",
                    "smallDiagonalRight",
                    "smallDiamond",
                    "smallTriangle"
                  ],
                  "value": "none"
                },
                "shape": {
                  "type": "string",
                  "value": "circle"
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
                "svgClassName": {
                  "type": "string",
                  "value": ""
                },
                "svgStyle": {
                  "type": "object",
                  "value": {}
                },
                "width": {
                  "type": "number",
                  "value": 10
                }
              }
            },
            "labelStyle": {
              "type": "object",
              "value": {}
            },
            "showDisclosure": {
              "type": "string",
              "enumValues": [
                "off",
                "on"
              ],
              "value": "on"
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
              "enumValues": [
                "arrow",
                "arrowConcave",
                "arrowOpen",
                "circle",
                "none",
                "rectangle",
                "rectangleRounded"
              ],
              "value": "none"
            },
            "startConnectorType": {
              "type": "string",
              "enumValues": [
                "arrow",
                "arrowConcave",
                "arrowOpen",
                "circle",
                "none",
                "rectangle",
                "rectangleRounded"
              ],
              "value": "none"
            },
            "svgClassName": {
              "type": "string",
              "value": ""
            },
            "svgStyle": {
              "type": "object",
              "value": {}
            },
            "width": {
              "type": "number",
              "value": 1
            }
          }
        }
      }
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        }
      }
    },
    "touchResponse": {
      "type": "string",
      "enumValues": [
        "auto",
        "touchStart"
      ],
      "value": "auto"
    },
    "trackResize": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "on"
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "accessibleContainsControls": {
          "type": "string"
        },
        "componentName": {
          "type": "string"
        },
        "labelAndValue": {
          "type": "string"
        },
        "labelClearSelection": {
          "type": "string"
        },
        "labelCountWithTotal": {
          "type": "string"
        },
        "labelDataVisualization": {
          "type": "string"
        },
        "labelInvalidData": {
          "type": "string"
        },
        "labelNoData": {
          "type": "string"
        },
        "promotedLink": {
          "type": "string"
        },
        "promotedLinkAriaDesc": {
          "type": "string"
        },
        "promotedLinks": {
          "type": "string"
        },
        "stateCollapsed": {
          "type": "string"
        },
        "stateDrillable": {
          "type": "string"
        },
        "stateExpanded": {
          "type": "string"
        },
        "stateHidden": {
          "type": "string"
        },
        "stateIsolated": {
          "type": "string"
        },
        "stateMaximized": {
          "type": "string"
        },
        "stateMinimized": {
          "type": "string"
        },
        "stateSelected": {
          "type": "string"
        },
        "stateUnselected": {
          "type": "string"
        },
        "stateVisible": {
          "type": "string"
        }
      }
    },
    "zoomRenderer": {
      "type": "function"
    },
    "zooming": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "none"
    }
  },
  "methods": {
    "getContextByNode": {},
    "getLink": {},
    "getLinkCount": {},
    "getNode": {},
    "getNodeCount": {},
    "getPromotedLink": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojBeforeCollapse": {},
    "ojBeforeExpand": {},
    "ojBeforePanZoomReset": {},
    "ojCollapse": {},
    "ojExpand": {}
  },
  "extension": {}
};
  __oj_diagram_metadata.extension._WIDGET_NAME = 'ojDiagram';
  oj.CustomElementBridge.register('oj-diagram', {
    metadata: __oj_diagram_metadata,
    parseFunction: DvtAttributeUtils.shapeParseFunction({
      'style-defaults.node-defaults.icon.shape': true
    })
  });
})();

var __oj_diagram_node_metadata = 
{
  "properties": {
    "categories": {
      "type": "Array<string>"
    },
    "descendantsConnectivity": {
      "type": "string",
      "enumValues": [
        "connected",
        "disjoint",
        "unknown"
      ],
      "value": "unknown"
    },
    "icon": {
      "type": "object",
      "value": {},
      "properties": {
        "borderColor": {
          "type": "string"
        },
        "borderRadius": {
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
        "opacity": {
          "type": "number"
        },
        "pattern": {
          "type": "string"
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
        "svgClassName": {
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
    "label": {
      "type": "string",
      "value": ""
    },
    "labelStyle": {
      "type": "object"
    },
    "overview": {
      "type": "object",
      "value": {},
      "properties": {
        "icon": {
          "type": "object",
          "properties": {
            "shape": {
              "type": "string"
            },
            "svgClassName": {
              "type": "string"
            },
            "svgStyle": {
              "type": "object"
            }
          }
        }
      }
    },
    "selectable": {
      "type": "string",
      "enumValues": [
        "auto",
        "off"
      ],
      "value": "auto"
    },
    "shortDesc": {
      "type": "string|function",
      "value": ""
    },
    "showDisclosure": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ]
    }
  },
  "extension": {}
};
/* global __oj_diagram_node_metadata:false */
(function () {
  __oj_diagram_node_metadata.extension._CONSTRUCTOR = function () {};
  var _OVERVIEW_SHAPE_ENUMS = {
    circle: true,
    diamond: true,
    ellipse: true,
    human: true,
    plus: true,
    rectangle: true,
    square: true,
    star: true,
    triangleDown: true,
    triangleUp: true,
    inherit: true
  };

  var nodeShapeParseFunc = DvtAttributeUtils.shapeParseFunction({ 'icon.shape': true });
  var overviewNodeShapeParseFunc = DvtAttributeUtils.shapeParseFunction(
    { 'overview.icon.shape': true },
    _OVERVIEW_SHAPE_ENUMS
  );

  function shapePropertyParser(value, name, meta, defaultParseFunction) {
    if (name === 'icon.shape') {
      return nodeShapeParseFunc(value, name, meta, defaultParseFunction);
    } else if (name === 'overview.icon.shape') {
      return overviewNodeShapeParseFunc(value, name, meta, defaultParseFunction);
    }
    return defaultParseFunction(value);
  }
  oj.CustomElementBridge.register('oj-diagram-node', {
    metadata: __oj_diagram_node_metadata,
    parseFunction: shapePropertyParser
  });
})();

var __oj_diagram_link_metadata = 
{
  "properties": {
    "categories": {
      "type": "Array<string>"
    },
    "color": {
      "type": "string"
    },
    "endConnectorType": {
      "type": "string",
      "enumValues": [
        "arrow",
        "arrowConcave",
        "arrowOpen",
        "circle",
        "none",
        "rectangle",
        "rectangleRounded"
      ]
    },
    "endNode": {
      "type": "any"
    },
    "label": {
      "type": "string",
      "value": ""
    },
    "labelStyle": {
      "type": "object"
    },
    "selectable": {
      "type": "string",
      "enumValues": [
        "auto",
        "off"
      ],
      "value": "auto"
    },
    "shortDesc": {
      "type": "string|function",
      "value": ""
    },
    "startConnectorType": {
      "type": "string",
      "enumValues": [
        "arrow",
        "arrowConcave",
        "arrowOpen",
        "circle",
        "none",
        "rectangle",
        "rectangleRounded"
      ]
    },
    "startNode": {
      "type": "any"
    },
    "svgClassName": {
      "type": "string",
      "value": ""
    },
    "svgStyle": {
      "type": "object",
      "value": {}
    },
    "width": {
      "type": "number"
    }
  },
  "extension": {}
};
/* global __oj_diagram_link_metadata:false */
(function () {
  __oj_diagram_link_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-diagram-link', {
    metadata: __oj_diagram_link_metadata
  });
})();

oj._registerLegacyNamespaceProp('DiagramUtils', DiagramUtils);
// bleed DiagramUtils into oj to keep backward compatibility

/**
 * Internal implementation of the oj.DiagramDataSource dedicated to convert
 * 'nodes', 'links' and 'childNodes' options into oj.DiagramDataSource object.
 * @class ConversionDiagramDataSource
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
const ConversionDiagramDataSource = function (data, options) {
  this.childDataCallback = options ? options.childData : null;
  ConversionDiagramDataSource.superclass.constructor.call(this, data);
};

oj._registerLegacyNamespaceProp('ConversionDiagramDataSource', ConversionDiagramDataSource);

// Subclass from oj.DiagramDataSource
oj.Object.createSubclass(
  ConversionDiagramDataSource,
  oj.DiagramDataSource,
  'oj.ConversionDiagramDataSource'
);

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
 * @memberof! ConversionDiagramDataSource
 * @instance
 * @ignore
 */
ConversionDiagramDataSource.prototype.getData = function (parentData) {
  if (parentData) {
    // retrieve child data
    var childData = parentData.nodes;
    if (childData === undefined && this.childDataCallback) {
      var childNodes = this.childDataCallback(parentData);
      return Promise.resolve(childNodes).then(
        function (values) {
          return Promise.resolve({ nodes: values });
        },
        function () {
          return Promise.resolve({ nodes: [] });
        }
      );
    }
    return Promise.resolve({ nodes: childData });
  }
  // else retrieve top level data
  var nodes = this.data.nodes;
  var links = this.data.links;
  if (nodes instanceof Function) {
    nodes = nodes();
  }
  if (links instanceof Function) {
    links = links();
  }
  return Promise.all([nodes, links]).then(
    function (values) {
      return Promise.resolve({ nodes: values[0], links: values[1] });
    },
    function () {
      return Promise.resolve({ nodes: [], links: [] });
    }
  );
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
 * @memberof! ConversionDiagramDataSource
 * @instance
 * @ignore
 */
ConversionDiagramDataSource.prototype.getChildCount = function (nodeData) {
  if (nodeData) {
    var childData = nodeData.nodes;
    if (Array.isArray(childData)) {
      return childData.length;
    } else if (childData === undefined && this.childDataCallback) {
      return -1;
    }
    return 0;
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
 * @memberof! ConversionDiagramDataSource
 * @instance
 * @ignore
 */
// eslint-disable-next-line no-unused-vars
ConversionDiagramDataSource.prototype.getDescendantsConnectivity = function (nodeData) {
  return 'unknown';
};

/**
 * @ojcomponent oj.ojDiagram
 * @augments oj.dvtBaseComponent
 * @since 1.1.0
 * @ojimportmembers oj.ojSharedContextMenu
 * @ojrole application
 * @ojshortdesc A diagram displays a set of nodes and the links between them. The node positions and link paths are specified by an application-provided layout function.
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojDiagram<K1, K2, D1 extends oj.ojDiagram.Node<K1>|any, D2 extends oj.ojDiagram.Link<K2, K1>|any> extends dvtBaseComponent<ojDiagramSettableProperties<K1, K2, D1, D2>>",
 *                genericParameters: [{"name": "K1", "description": "Type of key of the nodeData dataprovider"}, {"name": "K2", "description": "Type of key of the linkData dataprovider"},
 *                 {"name": "D1", "description": "Type of data from the nodeData dataprovider"}, {"name": "D2", "description": "Type of data from the linkData dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojDiagramSettableProperties<K1, K2, D1 extends oj.ojDiagram.Node<K1>|any, D2 extends oj.ojDiagram.Link<K2, K1>|any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["panning", "panDirection", "zooming", "minZoom", "maxZoom", "animationOnDataChange", "animationOnDisplay", "style"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["nodeData", "linkData", "layout", "selection"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 6
 *
 * @ojoracleicon 'oj-ux-ico-chart-network-circular'
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
 *    node-data="[[nodeDataProvider]]"
 *    link-data="[[linkDataProvider]]">
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
 * the layout can be generated using [layout helper utility]{@link DiagramUtils}.</p>
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
oj.__registerWidget('oj.ojDiagram', $.oj.dvtBaseComponent, {
  widgetEventPrefix: 'oj',
  options: {
    /**
     * Specifies the animation that is applied on data changes.
     * @expose
     * @name animationOnDataChange
     * @memberof oj.ojDiagram
     * @instance
     * @type {string=}
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
    animationOnDataChange: 'none',

    /**
     * Specifies the animation that is shown on initial display.
     * @expose
     * @name animationOnDisplay
     * @memberof oj.ojDiagram
     * @instance
     * @type {string=}
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
    animationOnDisplay: 'none',

    /**
     * Provides support for HTML5 Drag and Drop events. Please refer to <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop">third party documentation</a> on HTML5 Drag and Drop to learn how to use it.
     * @ojshortdesc Used to customize the drag and drop features.
     * @expose
     * @name dnd
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object=}
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
       * @type {Object=}
       */
      drag: null,
      /**
       * If this object is specified, the diagram will initiate drag operation when the user drags on diagram nodes.
       * @ojshortdesc Used to customize the drag features for nodes.
       * @expose
       * @name dnd.drag.nodes
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object=}
       */
      /**
       * The MIME types to use for the dragged data in the dataTransfer object. This can be a string if there is only one type, or an array of strings if multiple types are needed. For example, if selected employee data items are being dragged, dataTypes could be "application/employees+json". Drop targets can examine the data types and decide whether to accept the data. For each type in the array, dataTransfer.setData will be called with the specified type and the data. The data is an array of the dataContexts of the selected data items. The dataContext is the JSON version of the dataContext that we use for "tooltip" option, excluding componentElement and parentElement. This property is required unless the application calls setData itself in a dragStart callback function.
       * @ojshortdesc Specifies MIME type for dragged data.
       * @expose
       * @name dnd.drag.nodes.dataTypes
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(string|Array.<string>)=}
       * @default null
       */
      /**
       * An optional callback function that receives the "drag" event as argument.
       * @ojshortdesc Optional handler for drag event.
       * @expose
       * @name dnd.drag.nodes.drag
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event))=}
       * @default null
       */
      /**
       * An optional callback function that receives the "dragend" event as argument.
       * @ojshortdesc Optional handler for dragend event.
       * @expose
       * @name dnd.drag.nodes.dragEnd
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event))=}
       * @default null
       */
      /**
       * An optional callback function that receives the "dragstart" event and context information as arguments.
       * The context information is as follows:
       * <ul>
       *   <li>nodes {Array.(object)}: An array of data contexts of the dragged data nodes.</li>
       * </ul>
       * This function can set its own data and drag image as needed. When this function is called, event.dataTransfer is already populated with the default data and drag image.
       * @ojshortdesc Optional handler for dragstart event.
       * @expose
       * @name dnd.drag.nodes.dragStart
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {nodes: oj.ojDiagram.DndNodeContext<K1,D1>[]}) => void)", jsdocOverride: true}
       */
      /**
       * If this object is specified, the diagram will initiate link creation when the user starts dragging from a port.
       * @ojshortdesc Defines link creation functionality.
       * @expose
       * @name dnd.drag.ports
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object=}
       */
      /**
       * An optional callback function for customizing link feedback based on a starting node and a port.
       * If the function is not specified the link feedback will use default link styles.
       * The function will take a single parameter - a context object with the following properties:
       * <ul>
       *   <li>portElement DOM element recognized as a port that received drag event.</li>
       *   <li>dataContext The dataContext object of the link start node.</li>
       * </ul>
       * The function should return one of the following:
       * <ul>
       *   <li>an object with the following properties:
       *     <ul>
       *       <li> svgStyle : Inline style object to be applied on the link feedback </li>
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
       * @type {(function(Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((context: {portElement: Element, dataContext: oj.ojDiagram.NodeItemContext<K1,D1>}) => ({svgStyle?: Partial<CSSStyleDeclaration>, svgClassName?: string} | null))", jsdocOverride: true}
       */
      /**
       * A string, containing a selector expression, that will be used to identify the descendant DOM element in a diagram node that can be used for link creation. This property is requred.
       * @ojshortdesc Specifies DOM element selector used to start link creation.
       * @expose
       * @name dnd.drag.ports.selector
       * @memberof! oj.ojDiagram
       * @instance
       * @type {string=}
       * @default null
       */
      /**
       * The MIME types to use for the dragged data in the dataTransfer object. This can be a string if there is only one type, or an array of strings if multiple types are needed. and parentElement. This property is required unless the application calls setData itself in a dragStart callback function.
       * @ojshortdesc Specifies MIME type for dragged data.
       * @expose
       * @name dnd.drag.ports.dataTypes
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(string|Array.<string>)=}
       * @default null
       */
      /**
       * An optional callback function that receives the "drag" event as argument.
       * @ojshortdesc Optional handler for drag event.
       * @expose
       * @name dnd.drag.ports.drag
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event))=}
       * @default null
       */
      /**
       * An optional callback function that receives the "dragend" event as argument.
       * @ojshortdesc Optional handler for dragend event.
       * @expose
       * @name dnd.drag.ports.dragEnd
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event))=}
       * @default null
       */
      /**
       * An optional callback function that receives the "dragstart" event and context information as arguments.
       * The context information is as follows:
       * <ul>
       *   <li> ports {object}: An object with the following properties:
       *     <ul>
       *       <li> portElement : DOM element recognized as a port that received drag event. </li>
       *       <li> dataContext : The dataContext object of the link start node</li>
       *     </ul>
       *   </li>
       * </ul>
       * @ojshortdesc Optional handler for dragstart event.
       * @expose
       * @name dnd.drag.ports.dragStart
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {ports: {portElement: Element, dataContext: oj.ojDiagram.NodeItemContext<K1,D1>}}) => void)", jsdocOverride: true}
       */
      /**
       * An object that describes drop functionality.
       * @expose
       * @name dnd.drop
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object=}
       */
      drop: null
      /**
       * Allows dropping on the diagram background.
       * @expose
       * @name dnd.drop.background
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object=}
       */
      /**
       * An array of MIME data types the Diagram background can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
       * @ojshortdesc Specifies MIME types of objects that can be dropped on the Diagram background.
       * @expose
       * @name dnd.drop.background.dataTypes
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(string|Array.<string>)=}
       * @default null
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
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number}) => void)", jsdocOverride: true}
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
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number}) => void)", jsdocOverride: true}
       */
      /**
       * An optional callback function that receives the "dragleave" event and context information as arguments.
       * The context information is as follows: {@ojinclude "name":"backgroundDropContext"}
       * @ojshortdesc Optional handler for dragleave event.
       * @expose
       * @name dnd.drop.background.dragLeave
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number}) => void)", jsdocOverride: true}
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
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number}) => void)", jsdocOverride: true}
       */
      /**
       * Allows dropping on diagram nodes.
       * @expose
       * @name dnd.drop.nodes
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object=}
       */
      /**
       *  An array of MIME data types the Diagram nodes can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
       * @ojshortdesc Specifies MIME types of objects that can be dropped on the Diagram nodes.
       * @expose
       * @name dnd.drop.nodes.dataTypes
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(string|Array.<string>)=}
       * @default null
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
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number, nodeX: number, nodeY: number, nodeContext: oj.ojDiagram.NodeItemContext<K1,D1>}) => void)", jsdocOverride: true}
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
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number, nodeX: number, nodeY: number, nodeContext: oj.ojDiagram.NodeItemContext<K1,D1>}) => void)", jsdocOverride: true}
       */
      /**
       * An optional callback function that receives the "dragleave" event and context information as arguments.
       * The context information is as follows: {@ojinclude "name":"nodeDropContext"}
       * @ojshortdesc Optional handler for dragleave event.
       * @expose
       * @name dnd.drop.nodes.dragLeave
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number, nodeX: number, nodeY: number, nodeContext: oj.ojDiagram.NodeItemContext<K1,D1>}) => void)", jsdocOverride: true}
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
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number, nodeX: number, nodeY: number, nodeContext: oj.ojDiagram.NodeItemContext<K1,D1>}) => void)", jsdocOverride: true}
       */
      /**
       * Allows dropping on diagram links.
       * @expose
       * @name dnd.drop.links
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object=}
       */
      /**
       * An array of MIME data types the Diagram links can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
       * @ojshortdesc Specifies MIME types of objects that can be dropped on the Diagram links.
       * @expose
       * @name dnd.drop.links.dataTypes
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(string|Array.<string>)=}
       * @default null
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
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {
       *  target: "Type",
       *  value: "((event: Event, context: {x: number, y: number, linkContext: oj.ojDiagram.LinkItemContext<K1,K2,D2> | oj.ojDiagram.PromotedLinkItemContext<K1,K2,D2>}) => void)",
       *  jsdocOverride: true}
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
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {
       *  target: "Type",
       *  value: "((event: Event, context: {x: number, y: number, linkContext: oj.ojDiagram.LinkItemContext<K1,K2,D2> | oj.ojDiagram.PromotedLinkItemContext<K1,K2,D2>}) => void)",
       *  jsdocOverride: true}
       */
      /**
       * An optional callback function that receives the "dragleave" event and context information as arguments.
       * The context information is as follows: {@ojinclude "name":"linkDropContext"}
       * @ojshortdesc Optional handler for dragleave event.
       * @expose
       * @name dnd.drop.links.dragLeave
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {
       *  target: "Type",
       *  value: "((event: Event, context: {x: number, y: number, linkContext: oj.ojDiagram.LinkItemContext<K1,K2,D2> | oj.ojDiagram.PromotedLinkItemContext<K1,K2,D2>}) => void)",
       *  jsdocOverride: true}
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
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {
       *  target: "Type",
       *  value: "((event: Event, context: {x: number, y: number, linkContext: oj.ojDiagram.LinkItemContext<K1,K2,D2> | oj.ojDiagram.PromotedLinkItemContext<K1,K2,D2>}) => void)",
       *  jsdocOverride: true}
       */
      /**
       * Allows dropping a link end on a port.
       * @expose
       * @name dnd.drop.ports
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object=}
       */
      /**
       * A string, containing a selector expression, that will be used to identify the descendant DOM element in a diagram node that can be used for link creation. This property is requred.
       * @ojshortdesc Specifies DOM element selector used for link creation end.
       * @expose
       * @name dnd.drop.ports.selector
       * @memberof! oj.ojDiagram
       * @instance
       * @type {string}
       * @default null
       */
      /**
       *  An array of MIME data types the Diagram ports can accept. This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
       * @ojshortdesc Specifies MIME types of objects that can be dropped on the Diagram ports.
       * @expose
       * @name dnd.drop.ports.dataTypes
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(string|Array.<string>)=}
       * @default null
       */
      /**
       * An optional callback function that receives the "dragenter" event and context information as arguments.
       * The context information is as follows: {@ojinclude "name":"portDropContext"}
       * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
       * @ojshortdesc Optional handler for dragenter event.
       * @expose
       * @name dnd.drop.ports.dragEnter
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number, nodeX: number, nodeY: number, dataContext: oj.ojDiagram.NodeItemContext<K1,D1>, portElement: Element}) => void)", jsdocOverride: true}
       */
      /**
       * An optional callback function that receives the "dragover" event and context information as arguments.
       * The context information is as follows: {@ojinclude "name":"portDropContext"}
       * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted. Otherwise, dataTypes will be matched against the drag data types to determine if the data is acceptable.
       * @ojshortdesc Optional handler for dragover event.
       * @expose
       * @name dnd.drop.ports.dragOver
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number, nodeX: number, nodeY: number, dataContext: oj.ojDiagram.NodeItemContext<K1,D1>, portElement: Element}) => void)", jsdocOverride: true}
       */
      /**
       * An optional callback function that receives the "dragleave" event and context information as arguments.
       * The context information is as follows: {@ojinclude "name":"portDropContext"}
       * @ojshortdesc Optional handler for dragleave event.
       * @expose
       * @name dnd.drop.ports.dragLeave
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number, nodeX: number, nodeY: number, dataContext: oj.ojDiagram.NodeItemContext<K1,D1>, portElement: Element}) => void)", jsdocOverride: true}
       */
      /**
       * A callback function that receives the "drop" event and context information as arguments.
       * The context information is as follows: {@ojinclude "name":"portDropContext"}
       * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
       * @ojshortdesc Handler for drop event.
       * @expose
       * @name dnd.drop.ports.drop
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Event, Object))=}
       * @default null
       * @ojsignature {target: "Type", value: "((event: Event, context: {x: number, y: number, nodeX: number, nodeY: number, dataContext: oj.ojDiagram.NodeItemContext<K1,D1>, portElement: Element}) => void)", jsdocOverride: true}
       */
    },

    /**
     * Specifies the key set containing the ids of diagram nodes that should be expanded on initial render.
     * Use the <a href="KeySetImpl.html">KeySetImpl</a> class to specify nodes to expand.
     * Use the <a href="AllKeySetImpl.html">AllKeySetImpl</a> class to expand all nodes.
     * @ojshortdesc Specifies the key set of ids for expanded diagram nodes.
     * @expose
     * @name expanded
     * @memberof oj.ojDiagram
     * @instance
     * @type {KeySet=}
     * @default new KeySetImpl()
     * @ojsignature {target:"Type", value:"oj.KeySet<K1>"}
     * @ojwriteback
     *
     * @example <caption>Initialize the diagram with specific items expanded:</caption>
     * myDiagram.expanded = new KeySetImpl(['N0', 'N00']);
     *
     * @example <caption>Initialize the diagram with all items expanded:</caption>
     * myDiagram.expanded = new AllKeySetImpl();
     */
    expanded: new KeySetImpl(),
    /**
     * An array containing the ids of the selected nodes and links.
     * @expose
     * @name selection
     * @memberof oj.ojDiagram
     * @instance
     * @type {(Array.<any>)=}
     * @ojsignature {target:"Type", value:"Array<K1|K2>"}
     * @default []
     * @ojwriteback
     * @ojeventgroup common
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
    selection: [],
    /**
     * <p>The type of selection behavior that is enabled on the diagram. This attribute controls the number of selections that can be made via selection gestures at any given time.
     *
     * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the diagram's selection styling will be applied to all items specified by the <a href="#selection">selection</a> attribute.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the diagram's selection styling will not be applied to any items specified by the <a href="#selection">selection</a> attribute.
     *
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> attribute.
     *
     * @expose
     * @name selectionMode
     * @memberof oj.ojDiagram
     * @ojshortdesc Specifies the selection behavior on the diagram. See the Help documentation for more information.
     * @instance
     * @type {string=}
     * @ojvalue {string} "none" Selection is disabled.
     * @ojvalue {string} "single" Only a single item can be selected at a time.
     * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
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
    selectionMode: 'none',
    /**
     * Specifies whether panning is allowed in Diagram.
     * @expose
     * @name panning
     * @memberof oj.ojDiagram
     * @instance
     * @type {string=}
     * @ojvalue {string} "fixed" {"description": "Panning is restricted to the visible region when the diagram is rendered at minZoom."}
     * @ojvalue {string} "centerContent" {"description": "Panning is restricted based on the current zoom level to allow any area of the content to be centered. If an overview is being rendered, the overview.fitArea property should also be set to 'content' in most situations."}
     * @ojvalue {string} "none" {"description": "Panning is not allowed."}
     * @ojvalue {string} "auto" {"description": "One of the other described behaviors will be chosen at runtime based on the theme, form factor etc."}
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
    panning: 'none',
    /**
     * Specifies if panning allowed in horizontal and vertical directions.
     * @expose
     * @name panDirection
     * @memberof oj.ojDiagram
     * @instance
     * @type {string=}
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
    panDirection: 'auto',
    /**
     * A writeback object that contains properties zoom, centerX, and centerY that represent the panZoomState
     * @expose
     * @name panZoomState
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object=}
     * @ojwriteback
     */
    panZoomState: {
      /**
       * Specifies the zoom value of the diagram.  The specified value should be between the diagram minZoom and maxZoom values.
       * A value of 0, the default, indicates that the diagram should be zoomed in as much as possible while keeping all content visible.
       * @ojshortdesc The zoom value in the range of min/max-zoom
       * @expose
       * @name panZoomState.zoom
       * @memberof! oj.ojDiagram
       * @instance
       * @type {number}
       * @default 0.0
       */
      zoom: 0.0,
      /**
       * The x coordinate of the center of the viewport in the layout coordinate space.
       * By default the content will be centered horizontally.
       * @ojshortdesc The x coordinate of the center of the viewport
       * @expose
       * @name panZoomState.centerX
       * @memberof! oj.ojDiagram
       * @instance
       * @type {number|null}
       * @default null
       */
      centerX: null,
      /**
       * The y coordinate of the center of the viewport in the layout coordinate space
       * By default the content will be centered vertically.
       * @ojshortdesc The y coordinate of the center of the viewport
       * @expose
       * @name panZoomState.centerY
       * @memberof! oj.ojDiagram
       * @instance
       * @type {number|null}
       * @default null
       */
      centerY: null
    },
    /**
     * An object containing an optional callback function for tooltip customization.
     * @expose
     * @name tooltip
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object=}
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
       * provided by the diagram. The function should return an Object that contains only one of the two properties:
       *  <ul>
       *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li>
       *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li>
       *  </ul>
       * @ojshortdesc Specifies a function for a custom tooltip.
       * @expose
       * @name tooltip.renderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {function(Object):Object|null}
       * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.TooltipContext<K1,K2,D1,D2>) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
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
     * @type {string=}
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
    zooming: 'none',
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
     * @type {number=}
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
     * @type {number=}
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
     * @type {(Array.<string>)=}
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
     * @type {string=}
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
    hoverBehavior: 'none',
    /**
     * An array of category strings used for category highlighting. Diagram nodes and links with a category in highlightedCategories will be highlighted.
     * @ojshortdesc Specifies categories used for highlighting.
     * @expose
     * @name highlightedCategories
     * @memberof oj.ojDiagram
     * @instance
     * @type {(Array.<string>)=}
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
     * @type {string=}
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
    highlightMatch: 'all',
    /**
     * Defines node highlighting mode.
     * @expose
     * @name nodeHighlightMode
     * @memberof oj.ojDiagram
     * @instance
     * @type {string=}
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
    nodeHighlightMode: 'node',
    /**
     * Defines link highlighting mode.
     * @expose
     * @name linkHighlightMode
     * @memberof oj.ojDiagram
     * @instance
     * @type {string=}
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
    linkHighlightMode: 'link',
    /**
     * An object containing an optional callbacks function for link customization.
     * @expose
     * @name linkContent
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object=}
     * @example <caption>Initialize the diagram with the
     * <code class="prettyprint">link-content</code> attribute specified:</caption>
     * <!-- Using dot notation -->
     * &lt;oj-diagram link-content.renderer='[[linkRendererFunc]]'>&lt;/oj-diagram>
     *
     * &lt;oj-diagram link-content='[[{"renderer": linkRendererFunc}]]'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">linkContent</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myDiagram.linkContent.renderer;
     *
     * // Get all
     * var values = myDiagram.linkContent;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for
     * // subproperties rather than setting a subproperty directly.
     * myDiagram.setProperty('linkContent.renderer', linkRendererFunc);
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myDiagram.linkContent={'renderer': linkRendererFunc};
     */
    linkContent: {
      /**
       * A callback function - a custom renderer - that will be used for initial link rendering.
       * The function should return an Object with the following property:
       * <ul>
       *   <li>insert: SVGElement - An SVG element, which will be used as content of a Diagram link.</li>
       * </ul>
       *
       * <p><b>Note</b> that a link can be represented by any SVG content. However if an application
       * wants to take advantage of built-in path animation provided by the Diagram component,
       * then the main shape of a link should be represented by a single path element and that
       * path element should be marked by <i>oj-diagram-link-path</i> class. When the class
       * is applied to the path element, its <i>d</i> attribute value will be populated by the
       * component and the path transformation will be applied to the element during data change
       * animation. Fade-in animation will be used for other elements of the link.</p>
       * <p>When the <i>oj-diagram-link-path</i> class is not used for any element of the link, then
       * the entire custom content will fade-in during data change animation.<p>
       *
       * <p><b>Note</b> that when linkContent.renderer is specified, but the other state renderer functions are not, then
       * the linkContent.renderer will be used to render the state.</p>
       *
       * <p><b>Note</b> that when the content returned by the renderer is an <code>svg</code> element,
       * the children of this element will be inserted into the DOM by the component,
       * omitting the <code>svg</code> element itself.</p>
       *
       * @ojshortdesc Specifies custom renderer for the diagram links used for initial rendering.
       * @expose
       * @name linkContent.renderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {function(Object):Object|null}
       * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.LinkRendererContext<K1,K2,D2>) => ({insert: SVGElement}))", jsdocOverride: true}
       * @default null
       */
      renderer: null,
      /**
       * An optional callback function to update the link in response to changes in hover state.
       * The function should return one of the following:
       * <ul>
       *   <li>An Object with the following property:
       *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram link.</li></ul>
       *   </li>
       *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
       * </ul>
       *
       * <p>See <a href="#linkContent.renderer">linkContent.renderer</a> for additional details on custom content for Diagram links.</p>
       * @ojshortdesc Specifies custom renderer for the diagram links used for hover updates.
       * @expose
       * @name linkContent.hoverRenderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Object):Object|null)=}
       * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.LinkRendererContext<K1,K2,D2>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
       * @default null
       */
      hoverRenderer: null,
      /**
       * An optional callback function to update the link in response to changes in selection state.
       * The function should return one of the following:
       * <ul>
       *   <li>An Object with the following property:
       *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram link.</li></ul>
       *   </li>
       *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
       * </ul>
       *
       * <p>See <a href="#linkContent.renderer">linkContent.renderer</a> for additional details on custom content for Diagram links.</p>
       * @ojshortdesc Specifies custom renderer for the diagram links used for selection updates.
       * @expose
       * @name linkContent.selectionRenderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Object):Object|null)=}
       * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.LinkRendererContext<K1,K2,D2>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
       * @default null
       */
      selectionRenderer: null,

      /**
       * An optional callback function to update the link in response to changes in keyboard focus state.
       * The function should return one of the following:
       * <ul>
       *   <li>An Object with the following property:
       *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram link.</li></ul>
       *   </li>
       *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
       * </ul>
       *
       * <p>See <a href="#linkContent.renderer">linkContent.renderer</a> for additional details on custom content for Diagram links.</p>
       * @ojshortdesc Specifies custom renderer for the diagram links used for focus updates.
       * @expose
       * @name linkContent.focusRenderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Object):Object|null)=}
       * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.LinkRendererContext<K1,K2,D2>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
       * @default null
       */
      focusRenderer: null
    },
    /**
     * An object containing an optional callbacks function for node customization.
     * @expose
     * @name nodeContent
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object=}
     * @example <caption>Initialize the diagram with the
     * <code class="prettyprint">node-content</code> attribute specified:</caption>
     * <!-- Using dot notation -->
     * &lt;oj-diagram node-content.renderer='[[linkRendererFunc]]'>&lt;/oj-diagram>
     *
     * &lt;oj-diagram node-content='[[{"renderer": linkRendererFunc}]]'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">nodeContent</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myDiagram.nodeContent.renderer;
     *
     * // Get all
     * var values = myDiagram.nodeContent;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for
     * // subproperties rather than setting a subproperty directly.
     * myDiagram.setProperty('nodeContent.renderer', linkRendererFunc);
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myDiagram.linkContent={'renderer': linkRendererFunc};
     */
    nodeContent: {
      /**
       * A callback function - a custom renderer - that will be used for initial node rendering.
       * The function should return an Object with the following property:
       * <ul>
       *   <li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li>
       * </ul>
       *
       * <p>The callback function is responsible for placing the child content by positioning either the content object passed on the RendererContext
       * or [oj-diagram-child-content]{@link oj.ojDiagramChildContent} element.
       * If an oj-diagram-child-content element is used, diagram will replace this element with the node child contents.</p>
       *
       * <p><b>Note</b> that when nodeContent.renderer is specified, but the other state renderer functions are not, then
       * the default state renderer will be used to render the state.</p>
       *
       * @ojshortdesc Specifies custom renderer for the diagram nodes used for initial rendering.
       * @expose
       * @name nodeContent.renderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {function(Object):(Object)}
       * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.RendererContext<K1,D1>) => ({insert: SVGElement}))", jsdocOverride: true}
       * @default null
       */
      renderer: null,
      /**
       * An optional callback function to update the node in response to changes in hover state.
       * The function should return one of the following:
       * <ul>
       *   <li>An Object with the following property:
       *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
       *   </li>
       *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
       * </ul>
       *
       * <p>See <a href="#nodeContent.renderer">nodeContent.renderer</a> for additional details on custom content for Diagram nodes.</p>
       *
       * @ojshortdesc Specifies custom renderer for the diagram nodes used for hover updates.
       * @expose
       * @name nodeContent.hoverRenderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Object):(Object|void)|null)=}
       * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.RendererContext<K1,D1>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
       * @default null
       */
      hoverRenderer: null,
      /**
       * An optional callback function to update the node in response to changes in selection state.
       * The function should return one of the following:
       * <ul>
       *   <li>An Object with the following property:
       *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
       *   </li>
       *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
       * </ul>
       *
       * <p>See <a href="#nodeContent.renderer">nodeContent.renderer</a> for additional details on custom content for Diagram nodes.</p>
       *
       * @ojshortdesc Specifies custom renderer for the diagram nodes used for selection updates.
       * @expose
       * @name nodeContent.selectionRenderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Object):(Object|void)|null)=}
       * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.RendererContext<K1,D1>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
       * @default null
       */
      selectionRenderer: null,
      /**
       * An optional callback function to update the node in response to changes in keyboard focus state.
       * The function should return one of the following:
       * <ul>
       *   <li>An Object with the following property:
       *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
       *   </li>
       *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
       * </ul>
       *
       * <p>See <a href="#nodeContent.renderer">nodeContent.renderer</a> for additional details on custom content for Diagram nodes.</p>
       *
       * @ojshortdesc Specifies custom renderer for the diagram nodes used for focus updates.
       * @expose
       * @name nodeContent.focusRenderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Object):(Object|void)|null)=}
       * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.RendererContext<K1,D1>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
       * @default null
       */
      focusRenderer: null,
      /**
       * An optional callback function to update the node in response to changes in zoom level.
       * The function should return one of the following:
       * <ul>
       *   <li>An Object with the following property:
       *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
       *   </li>
       *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
       * </ul>
       *
       * <p>See <a href="#nodeContent.renderer">nodeContent.renderer</a> for additional details on custom content for Diagram nodes.</p>
       *
       * @ojshortdesc Specifies custom renderer for the diagram nodes used for zoom updates.
       * @expose
       * @name nodeContent.zoomRenderer
       * @memberof! oj.ojDiagram
       * @instance
       * @type {(function(Object):(Object|void)|null)=}
       * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.RendererContext<K1,D1>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
       * @default null
       */
      zoomRenderer: null
    },
    /**
     * A callback function - a custom renderer - that will be used for initial node rendering.
     * The function should return an Object with the following property:
     * <ul>
     *   <li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li>
     * </ul>
     *
     * @ojshortdesc Specifies custom renderer for the diagram nodes used for initial rendering.
     * @ojdeprecated {since: '8.0.0', description: 'Use nodeContent.renderer instead.'}
     * @expose
     * @name renderer
     * @memberof oj.ojDiagram
     * @instance
     * @type {(function(Object):(Object))=}
     * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.RendererContext<K1,D1>) => ({insert: SVGElement}))", jsdocOverride: true}
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
     * The function should return one of the following:
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
     *   </li>
     *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
     * </ul>
     *
     * @ojshortdesc Specifies custom renderer for the diagram nodes used for hover updates.
     * @ojdeprecated {since: '8.0.0', description: 'Use nodeContent.hoverRenderer instead.'}
     * @expose
     * @name hoverRenderer
     * @memberof oj.ojDiagram
     * @instance
     * @type {(function(Object):(Object|void)|null)=}
     * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.RendererContext<K1,D1>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
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
     * The function should return one of the following:
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
     *   </li>
     *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
     * </ul>
     *
     * @ojshortdesc Specifies custom renderer for the diagram nodes used for selection updates.
     * @ojdeprecated {since: '8.0.0', description: 'Use nodeContent.selectionRenderer instead.'}
     * @expose
     * @name selectionRenderer
     * @memberof oj.ojDiagram
     * @instance
     * @type {(function(Object):(Object|void)|null)=}
     * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.RendererContext<K1,D1>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
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
     * The function should return one of the following:
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
     *   </li>
     *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
     * </ul>
     *
     * @ojshortdesc Specifies custom renderer for the diagram nodes used for focus updates.
     * @ojdeprecated {since: '8.0.0', description: 'Use nodeContent.focusRenderer instead.'}
     * @expose
     * @name focusRenderer
     * @memberof oj.ojDiagram
     * @instance
     * @type {(function(Object):(Object|void)|null)=}
     * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.RendererContext<K1,D1>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
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
     * The function should return one of the following:
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: SVGElement - An SVG element, which will be used as content of a Diagram node.</li></ul>
     *   </li>
     *   <li>undefined: Indicates that the existing DOM has been directly modified and no further action is required.</li>
     * </ul>
     *
     * @ojshortdesc Specifies custom renderer for the diagram nodes used for zoom updates.
     * @ojdeprecated {since: '8.0.0', description: 'Use nodeContent.zoomRenderer instead.'}
     * @expose
     * @name zoomRenderer
     * @memberof oj.ojDiagram
     * @instance
     * @type {(function(Object):(Object|void)|null)=}
     * @ojsignature {target: "Type", value: "((context: oj.ojDiagram.RendererContext<K1,D1>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
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
       * The data source for the Diagram element. See <a href="DiagramDataSource.html">oj.DiagramDataSource</a> for details.
       * @ojshortdesc Specifies the data for the component.
       * @ojdeprecated {since: '6.0.0', description: 'Use nodeData and linkData instead.'}
       * @ojtsignore
       * @expose
       * @name data
       * @memberof oj.ojDiagram
       * @instance
       * @type {Object}
       * @default null
       * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
       *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
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
     * The DataProvider for the diagram links. It should provide rows where each row corresponds to a single diagram link.
     * The row key will be used as the id for diagram links. Note that when
     * using this attribute, a template for the <a href="#linkTemplate">linkTemplate</a> slot should be provided.
     * The DataProvider can either have an arbitrary data shape, in which case an <oj-diagram-link> element must be specified
     * in the linkTemplate slot or it can have oj.ojDiagram.Link{@link oj.ojDiagram.Link} as its data shape, in which case no template is required.
     * @expose
     * @name linkData
     * @ojshortdesc Specifies the DataProvider for the diagram links. See the Help documentation for more information.
     * @memberof oj.ojDiagram
     * @instance
     * @type {(Object|null)=}
     * @ojsignature {target: "Type", value: "DataProvider<K2, D2>|null", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
     *
     * @example <caption>Initialize the diagram with the
     * <code class="prettyprint">link-data</code> attribute specified:</caption>
     * &lt;oj-diagram link-data='[[linkDataProvider]]' node-data='[[nodeDataProvider]]'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">linkData</code>
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.linkData;
     *
     * // setter
     * myDiagram.linkData = linkDataProvider;
     */
    linkData: null,
    /**
     * The DataProvider for the diagram nodes. It should provide rows where each row corresponds to a single diagram node.
     * The row key will be used as the id for diagram nodes. Note that when
     * using this attribute, a template for the <a href="#nodeTemplate">nodeTemplate</a> slot should be provided.
     * The DataProvider can either have an arbitrary data shape, in which case an <oj-diagram-node> element must be specified
     * in the nodeTemplate slot or it can have oj.ojDiagram.Node{@link oj.ojDiagram.Node} as its data shape, in which case no template is required.
     * @expose
     * @name nodeData
     * @ojshortdesc Specifies the DataProvider for the diagram nodes. See the Help documentation for more information.
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object|null}
     * @ojsignature {target: "Type", value: "DataProvider<K1, D1>|null", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
     *
     * @example <caption>Initialize the diagram with the
     * <code class="prettyprint">node-data</code> attribute specified:</caption>
     * &lt;oj-diagram node-data='[[nodeDataProvider]]'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">nodeData</code>
     * property after initialization:</caption>
     * // getter
     * var value = myDiagram.nodeData;
     *
     * // setter
     * myDiagram.nodeData = nodeDataProvider;
     */
    nodeData: null,
    /**
     * An alias for the $current context variable when referenced inside nodeTemplate or linkTemplate when using a DataProvider.
     * @expose
     * @name as
     * @memberof oj.ojDiagram
     * @ojshortdesc An alias for the '$current' context variable passed to slot content for the nodeTemplate or linkTemplate slots.
     * @instance
     * @type {string=}
     * @default ""
     * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
     **/
    as: '',
    /**
     * Optional callback that provides a way to customize an appearance of the specific link, the function maps link data into link styles.
     * The function takes a data object for the link provided by the diagram.
     * The following properties are supported on the return object:
     * <ul>
     *  <li>labelStyle {Object}: The CSS style object defining the style of the link label. The CSS max-width property can be used to truncate labels.</li>
     *  <li>color {string}: Link color.</li>
     *  <li>svgStyle {Object}: The SVG CSS style object defining link style. The style class and style object will be applied directly on the link and override any other styling specified through the properties.</li>
     *  <li>svgClassName {string}: The SVG CSS style class defining link style. The style class and style object will be applied directly on the link and override any other styling specified through the properties.</li>
     *  <li>width {number}: Link width in pixels.</li>
     *  <li>startConnectorType {string}: Specifies the type of start connector on the link. <br/>Supported values are "arrowOpen", "arrow", "arrowConcave", "circle", "rectangle", "rectangleRounded", "none". <br/>Default value is <code class="prettyprint">"none"</code>.</li>
     *  <li>endConnectorType {string}: Specifies the type of end connector on the link. <br/>Supported values are "arrowOpen", "arrow", "arrowConcave", "circle", "rectangle", "rectangleRounded", "none". <br/>Default value is <code class="prettyprint">"none"</code>.</li>
     * </ul>
     *
     * @example <caption>Customizing link color using <code class="prettyprint">customColor</code> property defined on the link data object</caption>
     * &lt;oj-diagram
     *    layout = '{{layoutFunc}}'
     *    data = '{{dataSource}}'
     *    link-properties = '[[function(data){return {color:data.customColor};}]]'>
     * &lt;/oj-diagram>
     *
     * @ojshortdesc Optional callback for customizing link appearance based on link data.
     * @ojdeprecated {since: '6.0.0', description: 'See nodeData and linkData usage.'}
     * @ojtsignore
     * @expose
     * @name linkProperties
     * @memberof oj.ojDiagram
     * @instance
     * @type {(null|function(Object):Object)=}
     * @default null
     */
    linkProperties: null,
    /**
     * Optional callback that provides a way to customize an appearance of the specific node, the function maps node data into node styles.
     * The function takes a data object for the node provided by the diagram. The following properties are supported on the return object:
     * <ul>
     *  <li>showDisclosure {string}: Determines when to display the expand/collapse button.<br/>Supported values are "on", "off". <br/>Default value is <code class="prettyprint">"on"</code>.</li>
     *  <li>labelStyle {Object}: The CSS style object defining the style of the node label.</li>
     *  <li>icon {Object}: Object specfiying an icon to be used as a graphical element for the node. Its properties are:
     *    <ul>
     *      <li>borderColor {string}: The border color of the icon.</li>
     *      <li>borderRadius {string}: The border radius of the icon. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.</li>
     *      <li>borderWidth {number}: The border width in pixels.</li>
     *      <li>color {string}: The fill color of the icon.</li>
     *      <li>pattern {string}: The fill pattern of the icon.<br/>Supported values are "smallChecker", "smallCrosshatch", "smallDiagonalLeft", "smallDiagonalRight", "smallDiamond", "smallTriangle", "largeChecker", "largeCrosshatch", "largeDiagonalLeft", "largeDiagonalRight", "largeDiamond", "largeTriangle", "none".<br/>Default value is <code class="prettyprint">"none"</code>.</li>
     *      <li>opacity {number}: The opacity of the icon.</li>
     *      <li>shape {string}: The shape of the icon. Can take the name of a built-in shape or the svg path commands for a custom shape.<br/>Supported built-in shapes:"ellipse", "square", "plus", "diamond", "triangleUp", "triangleDown", "human", "rectangle", "star", "circle".<br/>Default value is <code class="prettyprint">"circle"</code>.</li>
     *      <li>source {string}: The URI of the node image.</li>
     *      <li>sourceHover {string}: The optional URI of the node hover image. If not defined, the source image will be used.</li>
     *      <li>sourceHoverSelected {string}: The optional URI of the selected image on hover. If not defined, the sourceSelected image will be used. If the sourceSelected image is not defined, the source image will be used.</li>
     *      <li>sourceSelected {string}: The optional URI of the selected image. If not defined, the source image will be used.</li>
     *      <li>width {number}: The width of the icon.</li>
     *      <li>height {number}: The height of the icon.</li>
     *      <li>svgStyle {Object}: The CSS style object defining the style of the icon. The style class and style object will be applied directly on the icon and override any other styling specified through the properties.</li>
     *      <li>svgClassName {string}: The CSS style class defining the style of the icon. The style class and style object will be applied directly on the icon and override any other styling specified through the properties.</li>
     *    </ul>
     *  </li>
     *  <li>overview {Object}: Object specfiying the overview node shape. Its properties are:
     *    <ul>
     *      <li>icon {Object}: Object specifying an icon for the node in the overview window. The width and height of the overview node is determined from the rendered node in the diagram. The following properties can be used to customize the overview node:
     *        <ul>
     *          <li>shape {string}: The shape of the icon in the overview window. Can take one of the following values for the shape name or the svg path commands for a custom shape.<br/>Supported built-in shapes:"inherit", "ellipse", "square", "plus", "diamond", "triangleUp", "triangleDown", "human", "rectangle", "star", "circle".<br/> The default value is always "inherit", but that means different things for custom nodes and default nodes. When "inherit" value is specified for a default node, the shape is determined from the node in the diagram. When "inherit" value is specified for a custom node, "rectangle" shape will be used.<br>This property doesn't apply at all to containers (custom or default).</li>
     *          <li>svgStyle {Object}: The CSS style object defining the style of the node icon in the overview.</li>
     *          <li>svgClassName {string}: The CSS style class defining the style of the node icon in the overview.</li>
     *        </ul>
     *      </li>
     *    </ul>
     *  </li>
     * </ul>
     *
     * @example <caption>Customizing node icon color using <code class="prettyprint">customColor</code> property defined on the node data object</caption>
     * &lt;oj-diagram
     *    layout = '{{layoutFunc}}'
     *    data = '{{dataSource}}'
     *    node-properties = '[[function(data){return {icon:{color:data.customColor}};}]]'>
     * &lt;/oj-diagram>
     *
     * @ojshortdesc Optional callback for customizing node appearance based on node data.
     * @ojdeprecated {since: '6.0.0', description: 'See nodeData and linkData usage.'}
     * @ojtsignore
     * @expose
     * @name nodeProperties
     * @memberof oj.ojDiagram
     * @instance
     * @type {(null|function(Object):Object)=}
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
     * @type {string=}
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
    promotedLinkBehavior: 'lazy',
    /**
     * An object, used to define a diagram overview. If not specified, no overview will be shown.
     * @expose
     * @name overview
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object=}
     *
     * @example <caption>Initialize the diagram with the
     * <code class="prettyprint">overview</code> attribute specified:</caption>
     *
     * <!-- Using dot notation -->
     * &lt;oj-diagram overview.rendered = 'on' overview.width = '150'>&lt;/oj-diagram>
     *
     * &lt;oj-diagram overview='[[overviewObject]]'>&lt;/oj-diagram>
     *
     * @example <caption>Get or set the <code class="prettyprint">overview</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myDiagram.overview.width;
     *
     * // Get all
     * var values = myDiagram.overview;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for
     * // subproperties rather than setting a subproperty directly.
     * myDiagram.setProperty('overview.width', '150');
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myDiagram.overview=overviewObject;
     */
    overview: {
      /**
       * Specifies whether the overview scrollbar is rendered.
       * <br></br>See the <a href="#overview">overview</a> attribute for usage examples.
       * @expose
       * @name overview.rendered
       * @ojshortdesc Specifies whether the overview scrollbar is rendered.
       * @memberof! oj.ojDiagram
       * @instance
       * @type {string=}
       * @ojvalue {string} "on"
       * @ojvalue {string} "off"
       * @default "off"
       */
      rendered: 'off',
      /**
       * Specifies the region that will be scaled to fit within the overview.
       * @expose
       * @name overview.fitArea
       * @memberof! oj.ojDiagram
       * @instance
       * @type {string=}
       * @ojvalue {string} "content" {"description": "The bounding box of the Diagram nodes will be scaled to fit within the overview."}
       * @ojvalue {string} "canvas" {"description": "The canvas (the <a href='oj.ojDiagram.html#panning'>pannable</a> area when the diagram is at minZoom) will be scaled to fit within the overview. The diagram panning property should also be set to 'fixed' in most situations."}
       * @default "content"
       */
      fitArea: 'content',
      /**
       * Controls how the fit area is scaled within the overview.
       * @expose
       * @name overview.preserveAspectRatio
       * @memberof! oj.ojDiagram
       * @instance
       * @type {string=}
       * @ojvalue {string} "none" {"description": "The aspect ratio of the fit area may not be preserved as it is scaled to fit the overview."}
       * @ojvalue {string} "meet" {"description": "The aspect ratio of the fit area will be preserved as it is scaled to fit the overview."}
       * @default "meet"
       */
      preserveAspectRatio: 'meet',
      /**
       * Overview window width. The width can't exceed the diagram width.
       * If the specified width exceeds the width of the diagram itself, the width of the diagram will be used instead.
       * @ojshortdesc Overview window width.
       * @expose
       * @name overview.width
       * @memberof! oj.ojDiagram
       * @instance
       * @type {number=}
       * @default 200
       */
      width: 200,
      /**
       * Overview window height. The height can't exceed the diagram height.
       * If the specified height exceeds the height of the diagram itself, the height of the diagram will be used instead.
       * @ojshortdesc Overview window height.
       * @expose
       * @name overview.height
       * @memberof! oj.ojDiagram
       * @instance
       * @type {number=}
       * @default 100
       */
      height: 100,
      /**
       * Horizontal alignment for diagram overview window
       * @expose
       * @name overview.halign
       * @memberof! oj.ojDiagram
       * @instance
       * @type {string=}
       * @ojvalue {string} "start"
       * @ojvalue {string} "end"
       * @ojvalue {string} "center"
       * @default "end"
       */
      halign: 'end',
      /**
       * Vertical alignment for diagram overview window
       * @expose
       * @name overview.valign
       * @memberof! oj.ojDiagram
       * @instance
       * @type {string=}
       * @ojvalue {string} "top"
       * @ojvalue {string} "bottom"
       * @ojvalue {string} "middle"
       * @default "bottom"
       */
      valign: 'bottom'
    },
    /**
     * An object defining the style defaults for this diagram.
     * @expose
     * @name styleDefaults
     * @memberof oj.ojDiagram
     * @instance
     * @type {Object=}
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
       * only for styling a specific instance of the component. The default values come from the CSS classes and
       * varies based on theme. The duration of the animations in milliseconds.
       * @ojshortdesc Defines animation duration in milliseconds.
       * @expose
       * @name styleDefaults.animationDuration
       * @memberof! oj.ojDiagram
       * @instance
       * @type {number=}
       * @ojunits milliseconds
       */
      /**
       * Specifies initial hover delay in ms for highlighting data items.
       * @expose
       * @name styleDefaults.hoverBehaviorDelay
       * @ojshortdesc Specifies initial hover delay in milliseconds for highlighting data items.
       * @memberof! oj.ojDiagram
       * @instance
       * @type {number=}
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
       * @type {Object=}
       */
      nodeDefaults: {
        /**
         * The CSS style object defining the style of the node label.
         * Supports backgroundColor, borderColor, borderRadius, borderWidth, color, cursor, fontFamily, fontSize, fontStyle, fontWeight, maxWidth, textDecoration properties.
         * @ojshortdesc Specifies CSS styles for the node label.
         * @expose
         * @name styleDefaults.nodeDefaults.labelStyle
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         * @default {}
         */
        labelStyle: {},
        /**
         * Determines when to display the expand/collapse button.
         * @expose
         * @name styleDefaults.nodeDefaults.showDisclosure
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string=}
         * @ojvalue {string} "off"
         * @ojvalue {string} "on"
         * @default "on"
         */
        showDisclosure: 'on',
        /**
         * Default style for the node icon.
         * @expose
         * @name styleDefaults.nodeDefaults.icon
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object=}
         */
        icon: {
          /**
           * Default border color of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.borderColor
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string=}
           * @ojformat color
           */
          /**
           * The default border radius of the icon. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
           * @ojshortdesc Specifies default border radius of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.borderRadius
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string=}
           */
          /**
           * Default border width of the icon in pixels.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.borderWidth
           * @memberof! oj.ojDiagram
           * @instance
           * @type {number=}
           * @ojunits pixels
           */
          /**
           * Default color of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.color
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string=}
           * @ojformat color
           */
          /**
           * Default fill pattern of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.pattern
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string=}
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
          pattern: 'none',
          /**
           * Default shape of the icon. Can take the name of a built-in shape or the svg path commands for a custom shape.
           * @ojshortdesc Specifies default shape of the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.shape
           * @memberof! oj.ojDiagram
           * @instance
           * @type {("circle"|"diamond"|"ellipse"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|string)=}
           * @default "circle"
           */
          shape: 'circle',
          /**
           * The URI of the node image
           * @expose
           * @name styleDefaults.nodeDefaults.icon.source
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string=}
           */
          /**
           * The optional URI of the node hover image. If not defined, the source image will be used.
           * @ojshortdesc The optional URI of the node hover image.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.sourceHover
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string=}
           */
          /**
           * The optional URI of the selected image on hover. If not defined, the sourceSelected image will be used. If the sourceSelected image is not defined, the source image will be used.
           * @ojshortdesc The optional URI of the selected image on hover.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.sourceHoverSelected
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string=}
           */
          /**
           * The optional URI of the selected image. If not defined, the source image will be used.
           * @ojshortdesc The optional URI of the selected image.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.sourceSelected
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string=}
           */
          /**
           * Default icon width.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.width
           * @memberof! oj.ojDiagram
           * @instance
           * @type {number=}
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
           * @type {number=}
           * @default 10
           * @ojunits pixels
           */
          height: 10,
          /**
           * The default SVG CSS style object defining the style of the icon.
           * Only SVG CSS style properties are supported.
           * @ojshortdesc Specifies CSS styles for the icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.svgStyle
           * @memberof! oj.ojDiagram
           * @instance
           * @type {Object=}
           * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
           * @default {}
           */
          /**
           * The SVG CSS style class to apply to the node icon.
           * @expose
           * @name styleDefaults.nodeDefaults.icon.svgClassName
           * @memberof! oj.ojDiagram
           * @instance
           * @type {string=}
           * @default ""
           */
          svgClassName: ''
        }
      },
      /**
       * Default link styles
       * @expose
       * @name styleDefaults.linkDefaults
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object=}
       */
      linkDefaults: {
        /**
         * Default link color. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.linkDefaults.color
         * @ojshortdesc Default link color.
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string=}
         * @ojformat color
         */
        /**
         * The default style object represents the SVG CSS style of the link. User defined custom SVG CSS Styles will be applied directly on the link.
         * Only SVG CSS style properties are supported.
         * @ojshortdesc Specifies SVG CSS styles for the link.
         * @expose
         * @name styleDefaults.linkDefaults.svgStyle
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         * @default {}
         */
        /**
         * The default SVG CSS style class to apply to the link.
         * @expose
         * @name styleDefaults.linkDefaults.svgClassName
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string=}
         * @default ""
         */
        svgClassName: '',
        /**
         * Default link width in pixels.
         * @expose
         * @name styleDefaults.linkDefaults.width
         * @memberof! oj.ojDiagram
         * @instance
         * @type {number=}
         * @ojunits pixels
         * @default 1.0
         */
        width: 1.0,
        /**
         * The CSS style object defining the style of the link label.
         * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, maxWidth, textDecoration.
         * The default value comes from the CSS and varies based on theme.
         * @ojshortdesc Specifies CSS styles for the link label.
         * @expose
         * @name styleDefaults.linkDefaults.labelStyle
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         */
        labelStyle: {},
        /**
         * Specifies the type of start connector on the link.
         * @expose
         * @name styleDefaults.linkDefaults.startConnectorType
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string=}
         * @ojvalue {string} "arrowOpen"
         * @ojvalue {string} "arrow"
         * @ojvalue {string} "arrowConcave"
         * @ojvalue {string} "circle"
         * @ojvalue {string} "rectangle"
         * @ojvalue {string} "rectangleRounded"
         * @ojvalue {string} "none"
         * @default "none"
         */
        startConnectorType: 'none',
        /**
         * Specifies the type of end connector on the link.
         * @expose
         * @name styleDefaults.linkDefaults.endConnectorType
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string=}
         * @ojvalue {string} "arrowOpen"
         * @ojvalue {string} "arrow"
         * @ojvalue {string} "arrowConcave"
         * @ojvalue {string} "circle"
         * @ojvalue {string} "rectangle"
         * @ojvalue {string} "rectangleRounded"
         * @ojvalue {string} "none"
         * @default "none"
         */
        endConnectorType: 'none'
      },
      /**
       * Promoted link styles
       * @expose
       * @name styleDefaults.promotedLink
       * @memberof! oj.ojDiagram
       * @instance
       * @type {Object=}
       */
      promotedLink: {
        /**
         * Default promoted link color. The default value varies based on theme.
         * @expose
         * @name styleDefaults.promotedLink.color
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string=}
         * @ojformat color
         */
        color: '#778999',
        /**
         * The promoted style object represents the CSS style of the link. User defined custom CSS Styles will be applied directly on the link.
         * Only SVG CSS style properties are supported.
         * @expose
         * @ojshortdesc Specifies CSS styles of the promoted link.
         * @name styleDefaults.promotedLink.svgStyle
         * @memberof! oj.ojDiagram
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         * @default {}
         */
        /**
         * The SVG CSS style class to apply to the promoted link.
         * @expose
         * @name styleDefaults.promotedLink.svgClassName
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string=}
         * @default ""
         */
        svgClassName: '',
        /**
         * Default link width in pixels.
         * @expose
         * @name styleDefaults.promotedLink.width
         * @memberof! oj.ojDiagram
         * @instance
         * @type {number=}
         * @ojunits pixels
         * @default 1.0
         */
        width: 1.0,
        /**
         * Specifies the type of start connector on the promoted link.
         * @expose
         * @name styleDefaults.promotedLink.startConnectorType
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string=}
         * @ojvalue {string} "arrowOpen"
         * @ojvalue {string} "arrow"
         * @ojvalue {string} "arrowConcave"
         * @ojvalue {string} "circle"
         * @ojvalue {string} "rectangle"
         * @ojvalue {string} "rectangleRounded"
         * @ojvalue {string} "none"
         * @default "none"
         */
        startConnectorType: 'none',
        /**
         * Specifies the type of end connector on the promoted link.
         * @expose
         * @name styleDefaults.promotedLink.endConnectorType
         * @memberof! oj.ojDiagram
         * @instance
         * @type {string=}
         * @ojvalue {string} "arrowOpen"
         * @ojvalue {string} "arrow"
         * @ojvalue {string} "arrowConcave"
         * @ojvalue {string} "circle"
         * @ojvalue {string} "rectangle"
         * @ojvalue {string} "rectangleRounded"
         * @ojvalue {string} "none"
         * @default "none"
         */
        endConnectorType: 'none'
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
     * @type {string=}
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
    touchResponse: 'auto',
    /**
     * A custom JavaScript client layout method - a custom code developed by a customer used to position Diagram nodes and links. The layout code must conform to the pluggable layout contract.
     * @ojshortdesc Specifies layout callback used to position nodes and links.
     * @expose
     * @name layout
     * @memberof oj.ojDiagram
     * @instance
     * @type {(function(DvtDiagramLayoutContext):void)=}
     * @see <a href="oj.DvtDiagramLayoutContext.html">DvtDiagramLayoutContext</a>
     * @see <a href="oj.DvtDiagramLayoutContextLink.html">DvtDiagramLayoutContextLink</a>
     * @see <a href="oj.DvtDiagramLayoutContextNode.html">DvtDiagramLayoutContextNode</a>
     * @ojsignature {target: "Type", value: "((context: DvtDiagramLayoutContext<K1, K2, D1, D2>) => void)", jsdocOverride: true}
     */
    /**
     * Triggered immediately before any container node in the diagram is expanded.
     *
     * @ojshortdesc Event handler for when a node is about to expand.
     * @ojcancelable
     * @expose
     * @property {any} nodeId the id of the expanding object
     * @event
     * @memberof oj.ojDiagram
     * @instance
     * @ojsignature [{target:"Type", value:"<K1>", for:"genericTypeParameters"},
     *               {target:"Type", value:"K1", for:"nodeId"}]
     * @ojdeprecated {since: '12.1.0', description: 'The oj-before-expand event has been deprecated.  Lazy loading of data can be done through the data provider.'}
     */
    beforeExpand: null,
    /**
     * Triggered when a node has been expanded. The ui object contains one property, "nodeId", which is the id of the node that has been expanded.
     *
     * @ojshortdesc Event handler for after a node has expanded.
     * @expose
     * @property {any} nodeId the id of the expanded object
     * @event
     * @memberof oj.ojDiagram
     * @instance
     * @ojsignature [{target:"Type", value:"<K1>", for:"genericTypeParameters"},
     *               {target:"Type", value:"K1", for:"nodeId"}]
     * @ojdeprecated {since: '12.1.0', description: 'The oj-expand event has been deprecated.  Use on-expanded-changed instead.'}
     */
    expand: null,
    /**
     * Triggered immediately before any container node in the diagram is collapsed.
     *
     * @ojshortdesc Event handler for when a node is about to collapse.
     * @ojcancelable
     * @expose
     * @property {any} nodeId the id of the collapsing object
     * @event
     * @memberof oj.ojDiagram
     * @instance
     * @ojsignature [{target:"Type", value:"<K1>", for:"genericTypeParameters"},
     *               {target:"Type", value:"K1", for:"nodeId"}]
     * @ojdeprecated {since: '12.1.0', description: 'The oj-before-collapse event has been deprecated.  Lazy loading of data can be done through the data provider.'}
     */
    beforeCollapse: null,
    /**
     * Triggered when a node has been collapsed.
     *
     * @ojshortdesc Event handler for after a node has collapsed.
     * @expose
     * @property {any} nodeId the id of the collapsed object
     * @event
     * @memberof oj.ojDiagram
     * @instance
     * @ojsignature [{target:"Type", value:"<K1>", for:"genericTypeParameters"},
     *               {target:"Type", value:"K1", for:"nodeId"}]
     * @ojdeprecated {since: '12.1.0', description: 'The oj-collapse event has been deprecated.  Use on-expanded-changed instead.'}
     */
    collapse: null,
    /**
     * Triggered in response to property changes and component resizes. By default,
     * the panZoomState is reset in these cases such that the content is centered and zoomed to fit.
     * This behavior can be prevented by listening to this event and calling
     * event.preventDefault() which will cause the current panZoomState to be preserved.
     * @ojshortdesc Event that is fired before the panZoomState is reset.
     * @ojcancelable
     * @expose
     * @event
     * @memberof oj.ojDiagram
     * @instance
     */
    beforePanZoomReset: null
  },

  _InitOptions: function (originalDefaults, constructorOptions) {
    this._super(originalDefaults, constructorOptions);

    // styleDefaults subproperty defaults are dynamically generated
    // so we need to retrieve it here and override the dynamic getter by
    // setting the returned object as the new value.
    var styleDefaults = this.options.styleDefaults;
    this.options.styleDefaults = styleDefaults;
  },

  _ProcessOptions: function () {
    this._super();
    this.options._logger = Logger;
    // convert deprecated node renderers into new format
    if (this.options.renderer && !this.options.nodeContent.renderer) {
      this.options.nodeContent = {
        renderer: this.options.renderer,
        hoverRenderer: this.options.hoverRenderer,
        selectionRenderer: this.options.selectionRenderer,
        focusRenderer: this.options.focusRenderer,
        zoomRenderer: this.options.zoomRenderer
      };
    }
    if (this.options._templateFunction) {
      this.options.nodeContent.renderer = this._GetTemplateDataRenderer(
        this.options._templateFunction,
        'node'
      );
    }
    if (
      this.options.renderer ||
      this._TemplateHandler.getTemplates().nodeContentTemplate ||
      this.options.linkContent ||
      this._TemplateHandler.getTemplates().linkContentTemplate
    ) {
      this.options._contextHandler = this._getContextHandler();
      this.options._cleanTemplate = this._cleanTemplateMap();
    }
    if (this.options.nodeData) {
      this.options._fetchDataHandler = this._getFetchDataHandler('nodeData');
    }
    // convert nodes, links and childNodes options to DiagramDataSource
    if (this.options.nodes) {
      this.options.nodeProperties = this.options.nodeProperties
        ? this.options.nodeProperties
        : function (data) {
            return data;
          };
      this.options.linkProperties = this.options.linkProperties
        ? this.options.linkProperties
        : function (data) {
            return data;
          };
      this.options.data = new ConversionDiagramDataSource(
        { nodes: this.options.nodes, links: this.options.links },
        { childData: this.options.childNodes }
      );
    }
    // if expanded not declared, pass default empty expanded key set to the toolkit
    if (!this.options.expanded) {
      this.options.expanded = new KeySetImpl();
    }
    if (!this.options.dnd.drag) {
      this.options.dnd.drag = {
        nodes: {},
        ports: {}
      };
    }
    if (!this.options.dnd.drop) {
      this.options.dnd.drop = {
        background: {},
        nodes: {},
        links: {},
        ports: {}
      };
    }
    // Add these enable/disable all focusable functions to enable actionable mode
    this.options._keyboardUtils = {
      enableAllFocusable: enableAllFocusableElements,
      disableAllFocusable: disableAllFocusableElements,
      getActionableElementsInNode: getActionableElementsInNode,
      getFocusableElementsInNode: getFocusableElementsInNode
    };
  },

  _IsDraggable: function () {
    var dragObj = this.options.dnd ? this.options.dnd.drag : null;
    return (
      (dragObj && dragObj.nodes && Object.keys(dragObj.nodes).length > 0) ||
      (dragObj && dragObj.ports && Object.keys(dragObj.ports).length > 0)
    );
  },

  _GetComponentRendererOptions: function () {
    return [
      { path: 'tooltip/renderer', slot: 'tooltipTemplate' },
      { path: 'nodeContent/renderer', slot: 'nodeContentTemplate' },
      { path: 'nodeContent/focusRenderer', slot: 'nodeContentTemplate' },
      { path: 'nodeContent/hoverRenderer', slot: 'nodeContentTemplate' },
      { path: 'nodeContent/selectionRenderer', slot: 'nodeContentTemplate' },
      { path: 'nodeContent/zoomRenderer', slot: 'nodeContentTemplate' },
      { path: 'linkContent/renderer', slot: 'linkContentTemplate' },
      { path: 'linkContent/focusRenderer', slot: 'linkContentTemplate' },
      { path: 'linkContent/hoverRenderer', slot: 'linkContentTemplate' },
      { path: 'linkContent/selectionRenderer', slot: 'linkContentTemplate' }
    ];
  },

  _SetupResources: function () {
    this._super();
    if (this._component) {
      this._component.addDataSourceEventListeners();
    }
  },

  _ReleaseResources: function () {
    this._super();
    if (this._component) {
      this._component.removeDataSourceEventListeners();
    }
  },

  /**
   * This property is used by the TemplateHandler to indicate that the template engine for diagram needs
   * needs knockout module.
   * @protected
   * @ignore
   */
  _NeedsTrackableProperties: true,

  /**
   * Creates a callback function that will be used by DvtDiagramNode to populate context for the custom renderer
   * @return {Function} context handler callback used to create context for a custom renderer
   * @private
   * @instance
   * @memberof oj.ojDiagram
   */
  _getContextHandler: function () {
    var thisRef = this;
    return function (
      type,
      parentElement,
      rootElement,
      childContent,
      dataContext,
      state,
      previousState,
      linkPoints
    ) {
      var context = {
        component: __GetWidgetConstructor(thisRef.element),
        parentElement: parentElement,
        rootElement: rootElement,
        content: childContent,
        data: dataContext.data,
        itemData: dataContext.itemData,
        state: state,
        previousState: previousState,
        id: dataContext.id,
        type: type,
        label: dataContext.label,
        points: linkPoints
      };
      if (type === 'node' && thisRef._IsCustomElement()) {
        context.renderDefaultHover = thisRef.renderDefaultHover.bind(thisRef, context);
        context.renderDefaultSelection = thisRef.renderDefaultSelection.bind(thisRef, context);
        context.renderDefaultFocus = thisRef.renderDefaultFocus.bind(thisRef, context);
      }
      return thisRef._FixRendererContext(context);
    };
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
   *  <li>{Object} state  - property object with the following boolean properties: hovered, selected, focused, inActionableMode, zoom</li>
   *  <li>{Object} previousState  - property object with the following boolean properties: hovered, selected, focused, inActionableMode, zoom</li>
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
    if (!context.previousState || context.state.hovered !== context.previousState.hovered) {
      var comp = this._GetDvtComponent(this.element);
      comp.processDefaultHoverEffect(context.id, context.state.hovered);
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
   *  <li>{Object} state  - property object with the following boolean properties: hovered, selected, focused, inActionableMode, zoom</li>
   *  <li>{Object} previousState  - property object with the following boolean properties: hovered, selected, focused, inActionableMode, zoom</li>
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
    if (!context.previousState || context.state.selected !== context.previousState.selected) {
      var comp = this._GetDvtComponent(this.element);
      comp.processDefaultSelectionEffect(context.id, context.state.selected);
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
   *  <li>{Object} state  - property object with the following boolean properties: hovered, selected, focused, inActionableMode, zoom</li>
   *  <li>{Object} previousState  - property object with the following boolean properties: hovered, selected, focused, inActionableMode, zoom</li>
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
    if (!context.previousState || context.state.focused !== context.previousState.focused) {
      var comp = this._GetDvtComponent(this.element);
      comp.processDefaultFocusEffect(context.id, context.state.focused);
    }
  },

  _CreateDvtComponent: function (context, callback, callbackObj) {
    return new Diagram(context, callback, callbackObj);
  },

  _ConvertLocatorToSubId: function (locator) {
    var subId = locator.subId;

    // Convert the supported locators
    if (subId === 'oj-diagram-link') {
      // link[index]
      subId = 'link[' + locator.index + ']';
    } else if (subId === 'oj-diagram-node') {
      // node[index]
      subId = 'node[' + locator.index + ']';
    } else if (subId === 'oj-diagram-tooltip') {
      subId = 'tooltip';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  _ConvertSubIdToLocator: function (subId) {
    var locator = {};

    if (subId.indexOf('link') === 0) {
      // link[index]
      locator.subId = 'oj-diagram-link';
      locator.index = this._GetFirstIndex(subId);
    } else if (subId.indexOf('node') === 0) {
      // node[index]
      locator.subId = 'oj-diagram-node';
      locator.index = this._GetFirstIndex(subId);
    } else if (subId === 'tooltip') {
      locator.subId = 'oj-diagram-tooltip';
    }

    return locator;
  },

  _GetComponentStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses.push('oj-diagram');
    return styleClasses;
  },

  _GetChildStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses['oj-dvtbase oj-diagram'] = {
      path: 'styleDefaults/animationDuration',
      property: 'ANIM_DUR'
    };
    styleClasses['oj-diagram-node-label'] = {
      path: 'styleDefaults/nodeDefaults/labelStyle',
      property: 'TEXT'
    };
    styleClasses['oj-diagram-node oj-selected'] = {
      path: 'styleDefaults/nodeDefaults/selectionColor',
      property: 'border-color'
    };
    styleClasses['oj-diagram-node oj-hover'] = [
      { path: 'styleDefaults/nodeDefaults/hoverOuterColor', property: 'border-top-color' },
      { path: 'styleDefaults/nodeDefaults/hoverInnerColor', property: 'border-bottom-color' }
    ];
    styleClasses['oj-diagram-link'] = [
      { path: 'styleDefaults/linkDefaults/color', property: 'color' },
      { path: 'styleDefaults/linkDefaults/_hitDetectionOffset', property: 'padding' },
      { path: 'styleDefaults/promotedLink/_hitDetectionOffset', property: 'padding' }
    ];
    styleClasses['oj-diagram-link-label'] = {
      path: 'styleDefaults/linkDefaults/labelStyle',
      property: 'TEXT'
    };
    styleClasses['oj-diagram-link oj-selected'] = {
      path: 'styleDefaults/linkDefaults/selectionColor',
      property: 'border-color'
    };
    styleClasses['oj-diagram-link oj-hover'] = [
      { path: 'styleDefaults/linkDefaults/hoverOuterColor', property: 'border-top-color' },
      { path: 'styleDefaults/linkDefaults/hoverInnerColor', property: 'border-bottom-color' }
    ];
    styleClasses['oj-diagram-overview'] = [
      {
        path: 'styleDefaults/_overviewStyles/overview/backgroundColor',
        property: 'background-color'
      },
      { path: 'styleDefaults/_overviewStyles/overview/padding', property: 'padding' }
    ];
    styleClasses['oj-diagram-node'] = [
      { path: 'styleDefaults/nodeDefaults/icon/color', property: 'fill' }
    ];
    styleClasses['oj-diagram-overview-content'] = [
      { path: 'styleDefaults/_overviewStyles/overviewContent/padding', property: 'padding' }
    ];
    styleClasses['oj-diagram-overview-viewport'] = [
      { path: 'styleDefaults/_overviewStyles/viewport/borderColor', property: 'border-color' },
      {
        path: 'styleDefaults/_overviewStyles/viewport/backgroundColor',
        property: 'background-color'
      }
    ];
    return styleClasses;
  },

  _GetEventTypes: function () {
    return [
      'optionChange',
      'beforeExpand',
      'beforeCollapse',
      'expand',
      'collapse',
      'beforePanZoomReset'
    ];
  },

  _GetOptimizedOptions: function () {
    return this._super().concat('panZoomState');
  },

  _UpdateNoRenderOptions: function (options) {
    if (options.panZoomState !== undefined) {
      this._component.panZoom(options.panZoomState);
    }
    this._super(options);
  },

  _HandleEvent: function (event) {
    var type = event.type;
    if (type === 'beforeExpand') {
      this.expand(event.id, true);
    } else if (type === 'beforeCollapse') {
      this.collapse(event.id, true);
    } else if (type === 'expand' || type === 'collapse') {
      if (this._IsCustomElement()) {
        var expanded = this.options.expanded;
        var value = type === 'expand' ? expanded.add([event.id]) : expanded.delete([event.id]);
        this._UserOptionChange('expanded', value);
      }
      this._trigger(type, null, { nodeId: event.id });
    } else if (type === 'notready') {
      this._NotReady();
    } else if (type === 'beforePanZoomReset') {
      this._panZoomReset();
    } else {
      this._super(event);
    }
  },

  _RemoveKeys: function (removedKeys) {
    this._super(removedKeys);
    var expandedChanged;
    var expanded = this.options.expanded;
    if (expanded && !expanded.isAddAll()) {
      removedKeys.forEach(function (keyValue) {
        if (expanded.has(keyValue)) {
          expanded = expanded.delete([keyValue]);
          expandedChanged = true;
        }
      });
      if (expandedChanged) {
        this._UserOptionChange('expanded', expanded);
      }
    }
  },

  _LoadResources: function () {
    // Ensure the resources object exists
    if (this.options._resources == null) {
      this.options._resources = {};
    }

    var resources = this.options._resources;
    // TODO: what is this?
    resources.panUp = 'oj-chart-pan-icon';
    resources.panUpHover = 'oj-chart-pan-icon oj-hover';
    resources.panDown = 'oj-chart-pan-icon oj-active';

    resources.collapse = {
      icon: 'oj-fwk-icon oj-fwk-icon-minus',
      width: 10,
      height: 10
    };
    resources.expand = {
      icon: 'oj-fwk-icon oj-fwk-icon-plus',
      width: 10,
      height: 10
    };
  },

  _GetComponentNoClonePaths: function () {
    var noClonePaths = this._super();
    noClonePaths.data = true;
    noClonePaths.nodes = true;
    noClonePaths.links = true;
    return noClonePaths;
  },

  _GetComponentDeferredDataPaths: function () {
    return { root: ['nodeData', 'linkData'] };
  },

  _GetSimpleDataProviderConfigs: function () {
    var configs = {
      nodeData: {
        templateName: 'nodeTemplate',
        templateElementName: 'oj-diagram-node',
        resultPath: 'nodes'
      },
      linkData: {
        templateName: 'linkTemplate',
        templateElementName: 'oj-diagram-link',
        resultPath: 'links'
      }
    };
    Object.defineProperty(configs.nodeData, 'expandedKeySet', {
      get: function () {
        return this.options.expanded;
      }.bind(this)
    });
    return configs;
  },

  /**
   * @override
   * @memberof oj.ojDiagram
   * @protected
   */
  _CleanAllTemplates: function (isResize) {
    if (!isResize) {
      this._CleanTemplate('nodeContentTemplate');
    }
    this._super(isResize);
  },

  /**
   * @override
   * @memberof oj.ojDiagram
   * @protected
   */
  _CleanTemplate: function (templateName) {
    if (templateName === 'nodeContentTemplate') {
      if (this._nodeContentTemplateMap) {
        var nodes = Object.keys(this._nodeContentTemplateMap);
        for (var i = 0; i < nodes.length; i++) {
          this._nodeContentTemplateMap[nodes[i]]();
        }
        this._nodeContentTemplateMap = {};
      }
    } else {
      this._super(templateName);
    }
  },

  /**
   * @override
   * @memberof oj.ojDiagram
   * @protected
   */
  _AddTemplate: function (context) {
    var templateName = context._templateName;
    if (templateName === 'nodeContentTemplate') {
      if (!this._nodeContentTemplateMap) {
        this._nodeContentTemplateMap = {};
      }
      this._nodeContentTemplateMap[context.id || 'dummyDiv'] = context._templateCleanup;
    } else {
      this._super(context);
    }
  },

  /**
   * Cleans a specific template stored by the component
   * @private
   * @memberof oj.ojDiagram
   */
  _cleanTemplateMap: function () {
    var thisRef = this;
    return function (id) {
      if (thisRef._nodeContentTemplateMap && thisRef._nodeContentTemplateMap[id]) {
        thisRef._nodeContentTemplateMap[id]();
        delete thisRef._nodeContentTemplateMap[id];
      }
    };
  },

  // Executes the inline template and returns the nodes from the template
  _TemplateRenderer: function (context, templateEngine, templateElement, templateName) {
    var states = context.state;
    var prevStates = context.previousState;
    var id = context.id;
    this._nodeLinkContext[id] = context;
    templateEngine.defineTrackableProperty(context, 'state', states);
    templateEngine.defineTrackableProperty(context, 'prevState', prevStates);
    return this._super(context, templateEngine, templateElement, templateName);
  },

  _ProcessInlineTemplateRenderer: function (options, optionPath, templateElement, templateName) {
    if (!this._nodeLinkContext) {
      this._nodeLinkContext = {};
    }
    this._super(options, optionPath, templateElement, templateName);
  },

  _WrapInlineTemplateRenderer: function (origRenderer, templateName, option) {
    var templateDataSet = this._TemplateHandler.getDataSet(templateName);

    // get the index of the interval that the zoom value is in.
    var getInterval = (zoom, thresholds) => {
      for (var i = 0; i < thresholds.length; i++) {
        if (zoom < thresholds[i]) {
          return i;
        }
      }
      return thresholds.length;
    };

    var hasZoomThresholdChange = (state, prevState, thresholds) => {
      return getInterval(state, thresholds) !== getInterval(prevState, thresholds);
    };

    var mutateObservables = (context) => {
      var id = context.id;
      Object.assign(this._nodeLinkContext[id], context);
    };

    var getDefaultWrapperFunction = (defaultFunc) => {
      return (context) => {
        context[defaultFunc]();
        return mutateObservables(context);
      };
    };

    if (
      option === 'nodeContent/focusRenderer' &&
      this._TemplateHandler.getDataSetBoolean(templateName, 'oj-default-focus')
    ) {
      return getDefaultWrapperFunction('renderDefaultFocus');
    }
    if (
      option === 'nodeContent/hoverRenderer' &&
      this._TemplateHandler.getDataSetBoolean(templateName, 'oj-default-hover')
    ) {
      return getDefaultWrapperFunction('renderDefaultHover');
    }
    if (
      option === 'nodeContent/selectionRenderer' &&
      this._TemplateHandler.getDataSetBoolean(templateName, 'oj-default-selection')
    ) {
      return getDefaultWrapperFunction('renderDefaultSelection');
    }
    if (option === 'nodeContent/zoomRenderer') {
      if (templateDataSet.ojZoomThresholds) {
        try {
          var thresholds = JSON.parse(templateDataSet.ojZoomThresholds);
          return function (context) {
            if (
              hasZoomThresholdChange(context.state.zoom, context.previousState.zoom, thresholds)
            ) {
              return mutateObservables(context);
            }
            return undefined;
          };
        } catch (error$1) {
          error(error$1);
        }
      }
      return null;
    }

    if (
      option === 'nodeContent/renderer' ||
      option === 'linkContent/renderer' ||
      option === 'tooltip/renderer'
    ) {
      return origRenderer;
    }
    return mutateObservables;
  },

  _OptionChangeHandler: function (options) {
    var hasProperty = Object.prototype.hasOwnProperty.bind(options);
    if (hasProperty('expanded') || hasProperty('data')) {
      this._component.clearDisclosedState();
    }

    if (hasProperty('expanded')) {
      this._ClearDataProviderState('nodeData');
    }

    this._super(options);
  },

  /**
   * Resets the panZoom state if the beforePanZoomReset event is not veto'd
   * @ignore
   * @instance
   * @memberof oj.ojDiagram
   */
  _panZoomReset: function () {
    // if beforePanZoomReset is veto'd, we do not reset the panZoom State to zoomToFit
    var reset = this._trigger('beforePanZoomReset');
    this._component.panZoomReset(reset);
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
  collapse: function (nodeId, vetoable) {
    var result = this._trigger('beforeCollapse', null, { nodeId: nodeId });
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
  expand: function (nodeId, vetoable) {
    var result = this._trigger('beforeExpand', null, { nodeId: nodeId });
    if (!vetoable || result !== false) {
      this._NotReady();
      this._component.expand(nodeId);
    }
  },

  /**
   * Returns number of diagram nodes
   * @return {number} The number of nodes
   * @expose
   * @instance
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojDiagram
   *
   * @example <caption>Invoke the <code class="prettyprint">getNodeCount</code> method:</caption>
   * var count = myDiagram.getNodeCount();
   */
  getNodeCount: function () {
    var auto = this._component.getAutomation();
    return auto.getNodeCount();
  },

  /**
   * Returns an object with the following properties for automation testing verification of the diagram node at the
   * specified index.
   *
   * @param {number} nodeIndex Node index
   * @property {Object|null} icon The icon for the node, or null if none exists.
   * @property {string} icon.color The color of the icon
   * @property {string} icon.shape The shape of the icon
   * @property {string} icon.pattern The pattern of the icon
   * @property {string} label Node label
   * @property {boolean} selected The selected state of the node
   * @property {string} tooltip Node tooltip
   * @return {Object|null} An object containing properties for the node at the given index, or null if none exists.
   * @expose
   * @instance
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojDiagram
   * @ojshortdesc Returns an object for automation testing verification of the specified diagram node. See the Help documentation for more information.
   *
   * @example <caption>Invoke the <code class="prettyprint">getNode</code> method:</caption>
   * var node = myDiagram.getNode(3);
   */
  getNode: function (nodeIndex) {
    var auto = this._component.getAutomation();
    return auto.getNode(nodeIndex);
  },

  /**
   * Returns number of diagram links
   * @return {number} The number of links
   * @expose
   * @instance
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojDiagram
   *
   * @example <caption>Invoke the <code class="prettyprint">getLinkCount</code> method:</caption>
   * var count = myDiagram.getLinkCount();
   */
  getLinkCount: function () {
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
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojDiagram
   * @ojshortdesc Returns an object for automation testing verification of the specified diagram link. See the Help documentation for more information.
   *
   * @example <caption>Invoke the <code class="prettyprint">getLink</code> method:</caption>
   * var link = myDiagram.getLink(3);
   */
  getLink: function (linkIndex) {
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
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojDiagram
   * @ojshortdesc Returns an object for automation testing verification of the promoted link between the specified nodes. See the Help documentation for more information.
   */
  getPromotedLink: function (startNodeIndex, endNodeIndex) {
    var auto = this._component.getAutomation();
    return auto.getPromotedLink(startNodeIndex, endNodeIndex);
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   * @ojsignature {target: "Type", value: "oj.ojDiagram.NodeContext|null", jsdocOverride: true, for: "returns"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
   */
  getContextByNode: function (node) {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (context && context.subId !== 'oj-diagram-tooltip') {
      return context;
    }

    return null;
  }
});

// Conditionally set the defaults for custom element vs widget syntax since we expose different APIs
setDefaultOptions({
  ojDiagram: {
    styleDefaults: createDynamicPropertyGetter(function (context) {
      if (context.isCustomElement) {
        return {
          linkDefaults: { svgStyle: {} },
          nodeDefaults: { icon: { svgStyle: {} } },
          promotedLink: { svgStyle: {} }
        };
      }
      return {};
    })
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
 *      <tr>
 *       <td><kbd>Ctrl + Shift + Space</kbd></td>
 *       <td>Open/Close an active container node</td>
 *     </tr>
 *      <tr>
 *       <td><kbd>[</kbd></td>
 *       <td>Move focus and selection to nearest node down in the container hierarchy</td>
 *     </tr>
 *      <tr>
 *       <td><kbd>]</kbd></td>
 *       <td>Move focus and selection to nearest node up in the container hierarchy</td>
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
 *     <tr>
 *       <td><kbd>F2</kbd></td>
 *       <td>Toggles Actionable mode.  Entering actionable mode enables keyboard action on elements inside the node/link, including navigating between focusable elements inside the node/link.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Exit Actionable mode.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojDiagram
 */

// COMMONLY USED FRAGMENTS, that might be converted into TS typedefs
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
 *   <li>x {number}: x-coordinate value of the drop in the component coordinate system.</li>
 *   <li>y {number}: y-coordinate value of the drop in the component coordinate system.</li>
 *   <li>nodeX {number}: x-coordinate value of the drop in the target node coordinate system.</li>
 *   <li>nodeY {number}: y-coordinate value of the drop in the target node coordinate system.</li>
 *   <li>dataContext {Object}: the JSON version of the data context for the link end node.</li>
 *   <li>portElement {Element}: DOM element that represents a port that received drop event.</li>
 * </ul>
 * @ojfragment portDropContext - context object for the node drop used by dnd.drop.link callbacks
 * @memberof oj.ojDiagram
 */

// TYPEDEFS
/**
 * @typedef {Object} oj.ojDiagram.Node
 * @ojimportmembers oj.ojDiagramNodeProperties
 * @property {any=} id The id of the node. For the DataProvider case, the key for the node will be used as the id.
 * @ojsignature [{target: "Type", value: "K1", for: "id"},
 *               {target: "Type", value: "<K1,D1=any>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojDiagram.Link
 * @ojimportmembers oj.ojDiagramLinkProperties
 * @property {any=} id The id of the node. For the DataProvider case, the key for the node will be used as the id.
 * @ojsignature [{target: "Type", value: "K1", for: "id"},
 *               {target: "Type", value: "K2", for: "endNode"},
 *               {target: "Type", value: "K2", for: "startNode"},
 *               {target: "Type", value: "<K1, K2, D2=any>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojDiagram.TooltipContext
 * @ojimportmembers oj.ojDiagramItemContextProperties
 * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
 * @ojsignature [{target: "Type", value: "'node'|'link'|'promotedLink'", for: "type"},
 *               {target: "Type", value: "K1|K2", for: "id"},
 *               {target: "Type", value: "D1|D2|D2[]", for: "itemData"},
 *               {target: "Type", value: "oj.ojDiagram.Node<K1>|oj.ojDiagram.Link<K2, K1>|oj.ojDiagram.Link<K2, K1>[]", for: "data"},
 *               {target: "Type", value: "<K1,K2,D1,D2>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojDiagram.NodeShortDescContext
 * @property {any} id The id of the node
 * @property {string} label The label of the node
 * @property {Object} data Relevant data for the node
 * @property {Object} itemData The The row data object for the node. This will only be set if an oj.DataProvider is being used.
 * @ojsignature [{target: "Type", value: "K1", for: "id"},
 *               {target: "Type", value: "D1", for: "itemData"},
 *               {target: "Type", value: "oj.ojDiagram.Node<K1>", for: "data"},
 *               {target: "Type", value: "<K1,D1>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojDiagram.LinkShortDescContext
 * @property {any} id The id of the link
 * @property {string} label The label of the link
 * @property {Object|Array.<Object>} data Relevant data for the link
 * @property {Object|Array.<Object>} itemData The The row data object for the link. This will only be set if an oj.DataProvider is being used.
 * @ojsignature [{target: "Type", value: "K2", for: "id"},
 *               {target: "Type", value: "D2|D2[]", for: "itemData"},
 *               {target: "Type", value: "oj.ojDiagram.Link<K2, K1>|oj.ojDiagram.Link<K2, K1>[]", for: "data"},
 *               {target: "Type", value: "<K1,K2,D2>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojDiagram.NodeItemContext
 * @ojimportmembers oj.ojDiagramItemContextProperties
 * @ojsignature [{target: "Type", value: "'node'", for: "type"},
 *               {target: "Type", value: "K1", for: "id"},
 *               {target: "Type", value: "D1", for: "itemData"},
 *               {target: "Type", value: "oj.ojDiagram.Node<K1>", for: "data"},
 *               {target: "Type", value: "<K1,D1>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojDiagram.LinkItemContext
 * @ojimportmembers oj.ojDiagramItemContextProperties
 * @ojsignature [{target: "Type", value: "'link'", for: "type"},
 *               {target: "Type", value: "K2", for: "id"},
 *               {target: "Type", value: "D2", for: "itemData"},
 *               {target: "Type", value: "oj.ojDiagram.Link<K2, K1>", for: "data"},
 *               {target: "Type", value: "<K1,K2,D2>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojDiagram.PromotedLinkItemContext
 * @ojimportmembers oj.ojDiagramItemContextProperties
 * @ojsignature [{target: "Type", value: "'promotedLink'", for: "type"},
 *               {target: "Type", value: "K2", for: "id"},
 *               {target: "Type", value: "D2[]", for: "itemData"},
 *               {target: "Type", value: "oj.ojDiagram.Link<K2, K1>[]", for: "data"},
 *               {target: "Type", value: "<K1,K2,D2>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojDiagram.DndNodeContext
 * @ojimportmembers oj.ojDiagramItemContextProperties
 * @property {Object} nodeOffset An object with x,y properties, that reflects node offset from the upper left corner of the bounding box for the dragged content.
 * @property {number} nodeOffset.x node An offset from the left side of the bounding box for the dragged content.
 * @property {number} nodeOffset.y An offset from the upper side of the bounding box for the dragged content.
 * @ojsignature [{target: "Type", value: "'node'", for: "type"},
 *               {target: "Type", value: "K1", for: "id"},
 *               {target: "Type", value: "D1", for: "itemData"},
 *               {target: "Type", value: "oj.ojDiagram.Node<K1>", for: "data"},
 *               {target: "Type", value: "<K1,D1>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojDiagram.NodeContext
 * @property {string} subId The subId string identify the particular DOM node.
 * @property {number} index The zero based index of the diagram item.
 * @ojsignature {target: "Type", value: "'oj-diagram-link'|'oj-diagram-node'", for: "subId"}
 */

/**
 * @typedef {Object} oj.ojDiagram.RendererContext
 * @property {Element}  parentElement A parent group element that takes a custom SVG fragment as the node content. Modifications of the parentElement are not supported.
 * @property {Element}  componentElement The diagram element.
 * @property {Element|null}  rootElement Null on initial rendering or SVG element for the node.
 * @property {Object}   data The data object for the node. If DataProvider is being used, this property contains template processed data.
 * @property {Object|null} itemData The row data object for the node. This will only be set if an DataProvider is being used.
 * @property {Object}   content  An object that describes child content. The object has the following properties
 * @property {Element}  content.element SVG group element that contains child nodes for the container.
 * @property {number}   content.width Width of the child content.
 * @property {number}   content.height Height of the child content.
 * @property {Object}   state An object that reflects the current state of the data item.
 * @property {boolean}  state.hovered True if the node is currently hovered.
 * @property {boolean}  state.selected True if the node is currently selected.
 * @property {boolean}  state.focused True if the node is currently selected.
 * @property {boolean}  state.expanded True if the node is expanded.
 * @property {boolean}  state.inActionableMode True if the node is currently in actionable mode.
 * @property {number}   state.zoom Current zoom state.
 * @property {Object}   previousState An object that reflects the previous state of the data item.
 * @property {boolean}  previousState.hovered True if the node was previously hovered.
 * @property {boolean}  previousState.selected True if the node was previously selected.
 * @property {boolean}  previousState.focused True if the node was previously selected.
 * @property {boolean}  previousState.expanded True if the node was previously expanded.
 * @property {boolean}  previousState.inActionableMode True if the node was previously in actionable mode.
 * @property {number}   previousState.zoom Previous zoom state.
 * @property {any}      id Node id.
 * @property {string}   type Object type = node.
 * @property {function():void} renderDefaultFocus Function for rendering default focus effect for the node
 * @property {function():void} renderDefaultHover Function for rendering default hover effect for the node
 * @property {function():void} renderDefaultSelection Function for rendering default selection effect for the node
 * @ojsignature [{target: "Type", value: "K1", for: "id"},
 *            {target: "Type", value: "oj.ojDiagram.Node<K1>", for: "data"},
 *            {target: "Type", value: "D1", for: "itemData"},
 *            {target: "Type", value: "<K1,D1>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojDiagram.LinkRendererContext
 * @property {Element}  parentElement A parent group element that takes a custom SVG fragment as the link content. Modifications of the parentElement are not supported.
 * @property {Element}  componentElement The diagram element.
 * @property {Element|null}  rootElement Null on initial rendering or SVG element for the link.
 * @property {Object}   data The data object for the link or an array of data objects for the promoted link.
 *                           If DataProvider is being used, this property contains template processed data.
 * @property {Object|null} itemData The row data object for the link or an array of row data objects for the promoted link.
 *                           This will only be set if an DataProvider is being used.
 * @property {Object}   state An object that reflects the current state of the data item.
 * @property {boolean}  state.hovered True if the link is currently hovered.
 * @property {boolean}  state.selected True if the link is currently selected.
 * @property {boolean}  state.focused True if the link is currently selected.
 * @property {boolean}  state.inActionableMode True if the link is currently in actionable mode.
 * @property {Object}   previousState An object that reflects the previous state of the data item.
 * @property {boolean}  previousState.hovered True if the link was previously hovered.
 * @property {boolean}  previousState.selected True if the link was previously selected.
 * @property {boolean}  previousState.focused True if the link was previously selected.
 * @property {boolean}  previousState.inActionableMode True if the link was previously in actionable mode.
 * @property {any}      id Link id.
 * @property {string}   type Object type is 'link' or 'promotedLink'.
 * @property {array|string} points An array of points or a string with SVG path to use for rendering this link as set by diagram layout.
 *            When custom renderer is used for link creation, the property will contain an array of x and y points for the link start
 *            and link end calculated by Diagram.
 * @ojsignature [{target: "Type", value: "K2", for: "id"},
 *            {target: "Type", value: "'link'|'promotedLink'", for: "type"},
 *            {target: "Type", value: "oj.ojDiagram.Link<K2, K1>", for: "data"},
 *            {target: "Type", value: "D2|D2[]", for: "itemData"},
 *            {target: "Type", value: "<K1,K2,D2>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojDiagram.LinkTemplateContext
 * @property {Element} componentElement The &lt;oj-diagram> custom element.
 * @property {Object} data The data object for the current link.
 * @property {number} index The zero-based index of the current link.
 * @property {any} key The key of the current link.
 */
/**
 * @typedef {Object} oj.ojDiagram.NodeTemplateContext
 * @property {Object} data The data object for the current node.
 * @property {number} index The zero-based index of the current node.
 * @property {any} key The key of the current node.
 * @property {array} parentData  An array of data for the leaf and its parents. Eg: parentData[0] is the outermost parent and parentData[1] is the second outermost parent of the leaf.
 * @property {any} parentKey The key of the parent item. The parent key is null for root nodes.
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
 * @ojformat color
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
 * @ojformat color
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
 * @ojformat color
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

// Slots

/**
 * <p> The <code class="prettyprint">nodeTemplate</code> slot is used to specify the template for creating each diagram node. The slot content must be a single &lt;template> element.
 * <p>When the template is executed for each item, it will have access to the diagram's binding context and the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current node. (See [oj.ojDiagram.NodeTemplateContext]{@link oj.ojDiagram.NodeTemplateContext} or the table below for a list of properties available on $current) </li>
 * </li>
 * <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.
 * </li>
 * </ul>
 *
 * <p>The content of the template should only be one &lt;oj-diagram-node> element. See the [oj-diagram-node]{@link oj.ojDiagram} doc for more details.</p>
 *
 *
 * @ojslot nodeTemplate
 * @ojshortdesc The nodeTemplate slot is used to specify the template for creating each diagram node. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojDiagram
 * @ojpreferredcontent ["DiagramNodeElement"]
 * @ojtemplateslotprops oj.ojDiagram.NodeTemplateContext
 *
 * @example <caption>Initialize the tag cloud with an inline item template specified:</caption>
 * &lt;oj-diagram node-data='[[nodeDataProvider]]' link-data='[[linkDataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-diagram-node icon.shape='[[node.data.shape]]' icon.color='[[node.data.color]]' icon.width='50' icon.height='20'>
 *    &lt;/oj-diagram-node-item>
 *  &lt;/template>
 * &lt;/oj-diagram>
 */

/**
 * <p>The <code class="prettyprint">nodeContentTemplate</code> slot is used to specify custom node content.</p>
 * The slot content must be a single &lt;template> element. This slot takes precedence over the
 * renderer/focusRenderer/hoverRenderer/selectionRenderer/zoomRenderer
 * properties on the nodeContent object if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current node. (See [oj.ojDiagram.RendererContext]{@link oj.ojDiagram.RendererContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 * <p>The template for a container node must include an [oj-diagram-child-content]{@link oj.ojDiagramChildContent} element.
 * Diagram will replace this element with the node child contents.</p>
 * <p>Add data-oj-default-focus, data-oj-default-hover and/or data-oj-default-selection attributes to the template to also render the default focus, hover and/or selection effect for the data item.</p>
 * <p>Similarly, add data-oj-zoom-thresholds attribute to the template to set thresholds that will trigger a rerender when crossed. This should be a JSON array containing values between the <i><b>min-zoom</b></i> and <i><b>max-zoom</b></i></p>
 *
 * <p><b>Note</b> that SVG nodes for the diagram node content should be wrapped into an <code>svg</code> element in order to have the SVG namespace.
 * The component will insert the entire SVG structure into DOM including the outer <code>svg</code> element.</p>
 *
 * <pre class="prettyprint"><code>
 * // Initialize the Diagram with a node content template specified
 * &lt;oj-diagram>
 *  &lt;template slot="nodeContentTemplate" data-oj-default-focus data-oj-default-hover data-oj-default-selection data-oj-zoom-thresholds="[0.25, 0.5, 0.75]">
 *   &lt;svg width="100" height="100">
 *    &lt;text>&lt;oj-bind-text value="[[$current.id]]">&lt;/oj-bind-text>&lt;/text>
 *   &lt;/svg>
 *  &lt;/template>
 * &lt;/oj-diagram>
 * </code></pre>
 *
 * @ojslot nodeContentTemplate
 * @ojmaxitems 1
 * @ojshortdesc The nodeContentTemplate slot is used to specify custom node content. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojDiagram.RendererContext
 * @memberof oj.ojDiagram
 * @since 7.1.0
 *
 */

/**
 * <p> The <code class="prettyprint">linkTemplate</code> slot is used to specify the template for creating each diagram link. The slot content must be a single &lt;template> element.
 * <p>When the template is executed for each item, it will have access to the diagram's binding context and the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current link. (See [oj.ojDiagram.LinkTemplateContext]{@link oj.ojDiagram.LinkTemplateContext} or the table below for a list of properties available on $current) </li>
 * </li>
 * <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.
 * </li>
 * </ul>
 *
 * <p>The content of the template should only be one &lt;oj-diagram-link> element. See the [oj-diagram-link]{@link oj.ojDiagram} doc for more details.</p>
 *
 *
 * @ojslot linkTemplate
 * @ojshortdesc The linkTemplate slot is used to specify the template for creating each diagram link. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojDiagram
 * @ojpreferredcontent ["DiagramLinkElement"]
 * @ojtemplateslotprops oj.ojDiagram.LinkTemplateContext
 *
 * @example <caption>Initialize the diagram with an inline link template specified:</caption>
 * &lt;oj-diagram node-data='[[nodeDataProvider]]' link-data='[[linkDataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-diagram-node icon.shape='[[node.data.shape]]' icon.color='[[node.data.color]]' icon.width='50' icon.height='20'>
 *    &lt;/oj-diagram-node>
 *  &lt;/template>
 *  &lt;template slot='linkTemplate' data-oj-as='link'>
 *    &lt;oj-diagram-link color='[[link.data.color]]' startConnectorType='[[link.data.start]]' endConnectorType='[[link.data.end]]'>
 *    &lt;/oj-diagram-link>
 *  &lt;/template>
 * &lt;/oj-diagram>
 */

/**
 * <p>The <code class="prettyprint">linkContentTemplate</code> slot is used to specify custom link content. The slot content must be a single &lt;template> element.</p>
 * This slot takes precedence over the renderer/focusRenderer/hoverRenderer/selectionRenderer
 * properties on the linkContent object if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current link. (See [oj.ojDiagram.LinkRendererContext]{@link oj.ojDiagram.LinkRendererContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 * <p><b>Note</b> that SVG nodes for the diagram link content should be wrapped into an <code>svg</code> element in order to have the SVG namespace.
 * The component will strip the outer <code>svg</code> element before inserting nodes into DOM.</p>
 *
 * <p>See <a href="#linkContent.renderer">linkContent.renderer</a> for additional details on custom content for Diagram links.</p>
 *
 * <pre class="prettyprint"><code>
 * // Initialize the Diagram with a link content template specified
 * &lt;oj-diagram>
 *  &lt;template slot="linkContentTemplate">
 *   &lt;svg>
 *    &lt;g value="[['link' + $current.id]]">
 *     &lt;path class="oj-diagram-link-path" stroke="[[$current.itemData.color]]" stroke-width="[[$current.itemData.width]]">&lt;/path>
 *    &lt;/g>
 *   &lt;/svg>
 *  &lt;/template>
 * &lt;/oj-diagram>
 * </code></pre>
 *
 * @ojslot linkContentTemplate
 * @ojmaxitems 1
 * @ojshortdesc The linkContentTemplate slot is used to specify custom link content. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojDiagram.LinkRendererContext
 * @memberof oj.ojDiagram
 * @since 8.0.0
 *
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content. The slot content must be a single &lt;template> element.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current node or link. (See [oj.ojDiagram.TooltipContext]{@link oj.ojDiagram.TooltipContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojmaxitems 1
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojDiagram.TooltipContext
 * @memberof oj.ojDiagram
 *
 * @example <caption>Initialize the Diagram with a tooltip template specified:</caption>
 * &lt;oj-diagram>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span class="label">&lt;oj-bind-text value="[[$current.label]]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-diagram>
 */

/**
 * @ojcomponent oj.ojDiagramNode
 * @ojshortdesc The oj-diagram-node element is used to declare properties for diagram nodes. See the Help documentation for more information.
 * @ojimportmembers oj.ojDiagramNodeProperties
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojDiagramNode<K1=any, D1=any> extends dvtBaseComponent<ojDiagramNodeSettableProperties<K1, D1>>",
 *                genericParameters: [{"name": "K1", "description": "Type of key of the nodeData dataprovider"},
 *                 {"name": "D1", "description": "Type of data from the nodeData dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojDiagramNodeSettableProperties<K1=any, D1=any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *               ]
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @since 6.0.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Diagram Node
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-diagram-node element is used to declare properties for diagram nodes and is only valid as the
 *  child of a template element for the [nodeTemplate]{@link oj.ojDiagram#nodeTemplate}
 *  slot of oj-diagram.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-diagram link-data='[[linkDataProvider]]' node-data='[[nodeDataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-diagram-node icon.shape='[[node.data.shape]]' icon.color='[[node.data.color]]' icon.width='50' icon.height='20'>
 *    &lt;/oj-diagram-node>
 *  &lt;/template>
 * &lt;/oj-diagram>
 * </code>
 * </pre>
 */

/**
 * @ojcomponent oj.ojDiagramLink
 * @ojshortdesc The oj-diagram-link element is used to declare properties for diagram links. See the Help documentation for more information.
 * @ojimportmembers oj.ojDiagramLinkProperties
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojDiagramLink<K1=any, K2=any, D2=any> extends dvtBaseComponent<ojDiagramLinkSettableProperties<K1, K2, D2>>",
 *                genericParameters: [{"name": "K1", "description": "Type of key of the nodeData dataprovider"},
 *                  {"name": "K2", "description": "Type of key of the linkData dataprovider"},
 *                  {"name": "D2", "description": "Type of data from the linkData dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojDiagramLinkSettableProperties<K1=any, K2=any, D2=any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *               ]
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @since 6.0.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Diagram Link
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-diagram-link element is used to declare properties for diagram links and is only valid as the
 *  child of a template element for the [linkTemplate]{@link oj.ojDiagram#linkTemplate}
 *  slot of oj-diagram.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-diagram link-data='[[linkDataProvider]]' node-data='[[nodeDataProvider]]'>
 *  &lt;template slot='linkTemplate' data-oj-as='link'>
 *    &lt;oj-diagram-link  startConnectorType='[[link.data.start]]' endConnectorType='[[link.data.end]]'>
 *    &lt;/oj-diagram-link>
 *  &lt;/template>
 * &lt;/oj-diagram>
 * </code>
 * </pre>
 */

/**
 * @ojcomponent oj.ojDiagramChildContent
 * @ojshortdesc oj-diagram-child-content is used to indicate where the container node child contents are placed.
 * @since 12.0.0
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Diagram Child Content
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 * The oj-diagram-child-content element is used to by the
 * [nodeContentTemplate Slot]{@link oj.ojDiagram#nodeContentTemplate}
 * and the [nodeContent]{@link oj.ojDiagram#nodeContent} renderer
 * to indicate where the container node child contents
 * should be placed.  This element does not support any child content or attributes and will
 * be removed from the DOM when the node is rendered.
 * </p>
 */

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
 *
 * @export
 * @interface DvtDiagramLayoutContext
 * @since 3.0
 * @memberof oj
 * @ojsignature {target: "Type",
 *               value: "interface DvtDiagramLayoutContext<K1, K2, D1 extends oj.ojDiagram.Node<K1>|any, D2 extends oj.ojDiagram.Link<K2, K1>|any>",
 *               genericParameters: [{"name": "K1", "description": "Type of key of the nodeData dataprovider"},
 *                                   {"name": "K2", "description": "Type of key of the linkData dataprovider"},
 *                                   {"name": "D1", "description": "Type of data from the nodeData dataprovider"},
 *                                   {"name": "D2", "description": "Type of data from the linkData dataprovider"}]}
 */

/**
 * Get a node context by id.
 * @method getNodeById
 * @instance
 * @param {any} id id of node context to get
 * @return {oj.DvtDiagramLayoutContextNode}
 * @memberof oj.DvtDiagramLayoutContext
 * @export
 * @ojsignature {target: "Type", value: "K1", for: "id"}
 * @ojsignature {target: "Type", value: "DvtDiagramLayoutContextNode<K1,D1>", for: "returns"}
 */

/**
 * Get a node context by index.
 * @method getNodeByIndex
 * @instance
 * @param {number} index index of node context to get
 * @return {oj.DvtDiagramLayoutContextNode}
 * @memberof oj.DvtDiagramLayoutContext
 * @export
 * @ojsignature {target: "Type", value: "DvtDiagramLayoutContextNode<K1,D1>", for: "returns"}
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
 * @param {any} id id of link context to get
 * @return {oj.DvtDiagramLayoutContextLink}
 * @memberof oj.DvtDiagramLayoutContext
 * @export
 * @ojsignature {target: "Type", value: "K1", for: "id"}
 * @ojsignature {target: "Type", value: "DvtDiagramLayoutContextLink<K1, K2, D2>", for: "returns"}
 */

/**
 * Get a link context by index.
 * @method getLinkByIndex
 * @instance
 * @param {number} index index of link context to get
 * @return {oj.DvtDiagramLayoutContextLink}
 * @memberof oj.DvtDiagramLayoutContext
 * @ojsignature {target: "Type", value: "DvtDiagramLayoutContextLink<K1, K2, D2>", for: "returns"}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number, w: number, h: number }", for: "returns"}
 * @export
 */

/**
 * Set the pan/zoom state the component should use after the layout.
 * @method setPanZoomState
 * @instance
 * @param {Object} panZoomState An object containing properties of the panZoomState that the component should use after the layout
 * @property {number|null} zoom Specifies the zoom value of the diagram.  The specified value should be between the diagram minZoom and maxZoom values.
 * A value of 0 indicates that the diagram should be zoomed in as much as possible while keeping all content visible.
 * @property {number|null} centerX The x coordinate of the center of the viewport in the layout coordinate space. If undefined, the content will be centered horizontally.
 * @property {number|null} centerY The y coordinate of the center of the viewport in the layout coordinate space. If undefined, the content will be centered vertically.
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContext
 * @ojsignature {target: "Type", value: "{ zoom: number|null, centerX: number|null, centerY: number|null}", for: "panZoomState"}
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
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContext
 * @ojsignature {target: "Type", value: "{ x: number, y: number, w: number, h: number }", for: "viewport"}
 * @ojdeprecated {since: '13.0.0', description: 'The setViewport method has been deprecated, please use the setPanZoomState method instead.'}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number, w: number, h: number }", for: "returns"}
 * @ojdeprecated {since: '13.0.0', description: 'The getViewport method has been deprecated, please use the panZoomState object on the component.'}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number, w: number, h: number }", for: "returns"}
 * @ojdeprecated {since: '13.0.0', description: 'The getCurrentViewportport method has been deprecated, please use the panZoomState object on the component.'}
 * @export
 */

/**
 * The function retrieves nearest common ancestor container for two nodes.
 * @method getCommonContainer
 * @instance
 * @return {any} Id for the first common ancestor container or null for top level diagram
 * @param {any} nodeId1 first node id
 * @param {any} nodeId2 second node id
 * @memberof oj.DvtDiagramLayoutContext
 * @ojsignature {target: "Type", value: "K1", for: "nodeId1"}
 * @ojsignature {target: "Type", value: "K1", for: "nodeId2"}
 * @ojsignature {target: "Type", value: "K1|null", for: "returns"}
 * @export
 */

/**
 * Gets event data object. Values can be retrieved from the object using 'type' and 'data' keys.
 * @method getEventData
 * @instance
 * @return {Object} event data object
 * @property {string} type Event type - "add", "remove" or "change".
 * @property {Object} data Event payload object for the event -
 *            see <a href="DiagramDataSource.html#EventType">EventType</a> for event details.
 * @memberof oj.DvtDiagramLayoutContext
 * @since 4.0.0
 * @export
 * @ojdeprecated {since: '7.1.0', description: 'The function is supported with DiagramDataSource. Use data providers instead.'}
 * @ojtsignore
 */

/**
 * The DvtDiagramLayoutContextLink interface defines the link context for a layout call.
 *
 * @export
 * @interface DvtDiagramLayoutContextLink
 * @since 3.0
 * @memberof oj
 * @ojsignature {target: "Type",
 *               value: "interface DvtDiagramLayoutContextLink<K1, K2, D2 extends oj.ojDiagram.Link<K2, K1>|any>",
 *               genericParameters: [{"name": "K1", "description": "Type of key of the nodeData dataprovider"},
 *                                   {"name": "K2", "description": "Type of key of the linkData dataprovider"},
 *                                   {"name": "D2", "description": "Type of data from the linkData dataprovider"}]}
 */

/**
 * Get the id of the link.
 * @method getId
 * @instance
 * @return {any}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 * @ojsignature {target: "Type", value: "K2", for: "returns"}
 */

/**
 * Get the id of the start node of this link.
 * @method getStartId
 * @instance
 * @return {any}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @ojsignature {target: "Type", value: "K1", for: "returns"}
 * @export
 */

/**
 * Get the id of the end node of this link.
 * @method getEndId
 * @instance
 * @return {any}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @ojsignature {target: "Type", value: "K1", for: "returns"}
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
 * @return {void}
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
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @ojsignature {target: "Type", value: "{ x: number, y: number}", for: "pos"}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number }", for: "returns"}
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
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @ojsignature {target: "Type", value: "'left'|'center'|'right'", for: "halign"}
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
 * @ojsignature {target: "Type", value: "'left'|'center'|'right'", for: "returns"}
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
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @ojsignature {target: "Type", value: "'top'|'middle'|'bottom'|'baseline'", for: "valign"}
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
 * @ojsignature {target: "Type", value: "'top'|'middle'|'bottom'|'baseline'", for: "returns"}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number, w: number, h: number }", for: "returns"}
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
 * @ojdeprecated {since:"2.1.0", description:'This method is deprecated. Please use the <a href="#getData">getData</a> method instead'}
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
 * @return {void}
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
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @ojsignature {target: "Type", value: "{ x: number, y: number}", for: "point"}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number }", for: "returns"}
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
 * @param {any} containerId  coordinate container id for the link
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContextLink
 * @ojsignature {target: "Type", value: "K1", for: "containerId"}
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
 * @return {any} coordinate container id for the link
 * @memberof oj.DvtDiagramLayoutContextLink
 * @ojsignature {target: "Type", value: "K1", for: "returns"}
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
 * @ojsignature {target: "Type", value: "D2|D2[]", for: "returns"}
 */

/**
 * Determine whether this link is promoted.
 * @method isPromoted
 * @instance
 * @return {boolean} true if the link is promoted
 * @memberof oj.DvtDiagramLayoutContextLink
 * @export
 */

/**
 * The DvtDiagramLayoutContextNode interface defines the node context for a layout call.
 * @export
 * @interface DvtDiagramLayoutContextNode
 * @since 3.0
 * @memberof oj
 * @ojsignature {target: "Type",
 *               value: "interface DvtDiagramLayoutContextNode<K1, D1 extends oj.ojDiagram.Node<K1>|any>",
 *               genericParameters: [{"name": "K1", "description": "Type of key of the nodeData dataprovider"},
 *                                   {"name": "D1", "description": "Type of data from the nodeData dataprovider"}]}
 */

/**
 * Get the id of the node.
 * @method getId
 * @instance
 * @return {any}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @ojsignature {target: "Type", value: "K1", for: "returns"}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number, w: number, h: number }", for: "returns"}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number, w: number, h: number }", for: "returns"}
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
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @ojsignature {target: "Type", value: "{ x: number, y: number }", for: "pos"}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number }", for: "returns"}
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
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @ojsignature {target: "Type", value: "{ x: number, y: number}", for: "pos"}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number }", for: "returns"}
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
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @ojsignature {target: "Type", value: "'left'|'center'|'right'", for: "halign"}
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
 * @ojsignature {target: "Type", value: "'left'|'center'|'right'", for: "returns"}
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
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @ojsignature {target: "Type", value: "'top'|'middle'|'bottom'|'baseline'", for: "valign"}
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
 * @ojsignature {target: "Type", value: "'top'|'middle'|'bottom'|'baseline'", for: "returns"}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number, w: number, h: number }", for: "returns"}
 * @export
 */

/**
 * Get the corresponding object from the nodes option array.
 * @method getLayoutAttributes
 * @instance
 * @return {Object}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @ojdeprecated {since:"2.1.0", description:'This method is deprecated. Please use the <a href="#getData">getData</a> method instead'}
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
 * @return {void}
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
 * @return {void}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @ojsignature {target: "Type", value: "{ x: number, y: number}", for: "point"}
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
 * @ojsignature {target: "Type", value: "{ x: number, y: number }", for: "returns"}
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
 * @ojsignature {target: "Type", value: "DvtDiagramLayoutContextNode<K1, D1>[]", for: "returns"}
 * @export
 */

/**
 * The method returns a position of the node relative to the specified ancestor container.
 * If the container id is null, the method returns global position of the node.
 * If the container id is not an ancestor id for the node, the method returns null.
 * @method getRelativePosition
 * @instance
 * @param {any} containerId ancestor id
 * @return {Object} An object with the following properties for the position of the node relative to the specified ancestor container
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @memberof oj.DvtDiagramLayoutContextNode
 * @ojsignature {target: "Type", value: "K1", for: "containerId"}
 * @ojsignature {target: "Type", value: "{ x: number, y: number }", for: "returns"}
 * @export
 */

/**
 * Get the corresponding data object for the diagram node.
 * @method getData
 * @instance
 * @return {object} a data object for the node
 * @memberof oj.DvtDiagramLayoutContextNode
 * @export
 * @ojsignature {target: "Type", value: "D1", for: "returns"}
 */

/**
 * Get the id of this node's container, or null if this is a top-level
 * node.
 * @method getContainerId
 * @instance
 * @return {any}
 * @memberof oj.DvtDiagramLayoutContextNode
 * @ojsignature {target: "Type", value: "K1", for: "returns"}
 * @export
 */
