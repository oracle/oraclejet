/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { __GetWidgetConstructor, setDefaultOptions, createDynamicPropertyGetter } from 'ojs/ojcomponentcore';
import oj from 'ojs/ojcore-base';
import DvtAttributeUtils from 'ojs/ojdvt-base';
import $ from 'jquery';
import { ThematicMap, DvtBaseMapManager } from 'ojs/ojthematicmap-toolkit';
import { warn } from 'ojs/ojlogger';
import { getLocale, getResourceUrl } from 'ojs/ojconfig';

var __oj_thematic_map_metadata = 
{
  "properties": {
    "animationDuration": {
      "type": "number"
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "none"
    },
    "areaData": {
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
    "areas": {
      "type": "Array<Object>|Promise"
    },
    "as": {
      "type": "string",
      "value": ""
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
    "initialZooming": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "none"
    },
    "isolatedItem": {
      "type": "any"
    },
    "labelDisplay": {
      "type": "string",
      "enumValues": [
        "auto",
        "off",
        "on"
      ],
      "value": "off"
    },
    "labelType": {
      "type": "string",
      "enumValues": [
        "long",
        "short"
      ],
      "value": "short"
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
    "links": {
      "type": "Array<Object>|Promise"
    },
    "mapProvider": {
      "type": "object",
      "properties": {
        "geo": {
          "type": "object",
          "value": {}
        },
        "propertiesKeys": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "value": ""
            },
            "longLabel": {
              "type": "string",
              "value": ""
            },
            "shortLabel": {
              "type": "string",
              "value": ""
            }
          }
        }
      }
    },
    "markerData": {
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
    "markerZoomBehavior": {
      "type": "string",
      "enumValues": [
        "fixed",
        "zoom"
      ],
      "value": "fixed"
    },
    "markers": {
      "type": "Array<Object>|Promise"
    },
    "maxZoom": {
      "type": "number",
      "value": 6
    },
    "panning": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "none"
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
        "areaSvgStyle": {
          "type": "object",
          "value": {}
        },
        "dataAreaDefaults": {
          "type": "object",
          "value": {},
          "properties": {
            "borderColor": {
              "type": "string"
            },
            "hoverColor": {
              "type": "string"
            },
            "selectedInnerColor": {
              "type": "string"
            },
            "selectedOuterColor": {
              "type": "string"
            }
          }
        },
        "dataMarkerDefaults": {
          "type": "object",
          "properties": {
            "borderColor": {
              "type": "string"
            },
            "borderStyle": {
              "type": "string",
              "enumValues": [
                "none",
                "solid"
              ],
              "value": "solid"
            },
            "borderWidth": {
              "type": "number",
              "value": 0.5
            },
            "color": {
              "type": "string"
            },
            "height": {
              "type": "number",
              "value": 8
            },
            "labelStyle": {
              "type": "object",
              "value": {}
            },
            "opacity": {
              "type": "number",
              "value": 1
            },
            "shape": {
              "type": "string",
              "value": "circle"
            },
            "width": {
              "type": "number",
              "value": 8
            }
          }
        },
        "hoverBehaviorDelay": {
          "type": "number",
          "value": 200
        },
        "labelStyle": {
          "type": "object",
          "value": {}
        },
        "linkDefaults": {
          "type": "object",
          "properties": {
            "color": {
              "type": "string"
            },
            "width": {
              "type": "number",
              "value": 2
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
    "tooltipDisplay": {
      "type": "string",
      "enumValues": [
        "auto",
        "labelAndShortDesc",
        "none",
        "shortDesc"
      ],
      "value": "auto"
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
        "areasRegion": {
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
        "linksRegion": {
          "type": "string"
        },
        "markersRegion": {
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
    "getArea": {},
    "getContextByNode": {},
    "getLink": {},
    "getMarker": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
/* global __oj_thematic_map_metadata:false */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
  __oj_thematic_map_metadata.extension._WIDGET_NAME = 'ojThematicMap';
  oj.CustomElementBridge.register('oj-thematic-map', {
    metadata: __oj_thematic_map_metadata,
    parseFunction: DvtAttributeUtils.shapeParseFunction({
      'style-defaults.data-marker-defaults.shape': true
    })
  });
})();

var __oj_thematic_map_area_metadata = 
{
  "properties": {
    "categories": {
      "type": "Array<string>",
      "value": []
    },
    "color": {
      "type": "string"
    },
    "label": {
      "type": "string",
      "value": ""
    },
    "labelStyle": {
      "type": "object"
    },
    "location": {
      "type": "string",
      "value": ""
    },
    "opacity": {
      "type": "number",
      "value": 1
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
    "svgClassName": {
      "type": "string",
      "value": ""
    },
    "svgStyle": {
      "type": "object",
      "value": {}
    }
  },
  "extension": {}
};
/* global __oj_thematic_map_area_metadata:false */
(function () {
  __oj_thematic_map_area_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-thematic-map-area', {
    metadata: __oj_thematic_map_area_metadata
  });
})();

var __oj_thematic_map_link_metadata = 
{
  "properties": {
    "categories": {
      "type": "Array<string>",
      "value": []
    },
    "color": {
      "type": "string",
      "value": ""
    },
    "endLocation": {
      "type": "object",
      "value": {},
      "properties": {
        "id": {
          "type": "any"
        },
        "location": {
          "type": "string"
        },
        "x": {
          "type": "number"
        },
        "y": {
          "type": "number"
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
    "startLocation": {
      "type": "object",
      "value": {},
      "properties": {
        "id": {
          "type": "any"
        },
        "location": {
          "type": "string"
        },
        "x": {
          "type": "number"
        },
        "y": {
          "type": "number"
        }
      }
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
      "value": 2
    }
  },
  "extension": {}
};
/* global __oj_thematic_map_link_metadata:false */
(function () {
  __oj_thematic_map_link_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-thematic-map-link', {
    metadata: __oj_thematic_map_link_metadata
  });
})();

var __oj_thematic_map_marker_metadata = 
{
  "properties": {
    "borderColor": {
      "type": "string"
    },
    "borderStyle": {
      "type": "string",
      "enumValues": [
        "none",
        "solid"
      ]
    },
    "borderWidth": {
      "type": "number"
    },
    "categories": {
      "type": "Array<string>",
      "value": []
    },
    "color": {
      "type": "string"
    },
    "height": {
      "type": "number"
    },
    "label": {
      "type": "string",
      "value": ""
    },
    "labelPosition": {
      "type": "string",
      "enumValues": [
        "bottom",
        "center",
        "top"
      ],
      "value": "center"
    },
    "labelStyle": {
      "type": "object"
    },
    "location": {
      "type": "string",
      "value": ""
    },
    "opacity": {
      "type": "number"
    },
    "rotation": {
      "type": "number",
      "value": 0
    },
    "selectable": {
      "type": "string",
      "enumValues": [
        "auto",
        "off"
      ],
      "value": "auto"
    },
    "shape": {
      "type": "string"
    },
    "shortDesc": {
      "type": "string|function",
      "value": ""
    },
    "source": {
      "type": "string",
      "value": ""
    },
    "sourceHover": {
      "type": "string",
      "value": ""
    },
    "sourceHoverSelected": {
      "type": "string",
      "value": ""
    },
    "sourceSelected": {
      "type": "string",
      "value": ""
    },
    "svgClassName": {
      "type": "string",
      "value": ""
    },
    "svgStyle": {
      "type": "object",
      "value": {}
    },
    "value": {
      "type": "number"
    },
    "width": {
      "type": "number"
    },
    "x": {
      "type": "number"
    },
    "y": {
      "type": "number"
    }
  },
  "extension": {}
};
/* global __oj_thematic_map_marker_metadata:false */
(function () {
  __oj_thematic_map_marker_metadata.extension._CONSTRUCTOR = function () {};
  var _MARKER_SHAPE_ENUMS = {
    circle: true,
    diamond: true,
    ellipse: true,
    human: true,
    plus: true,
    rectangle: true,
    square: true,
    star: true,
    triangleDown: true,
    triangleUp: true
  };
  oj.CustomElementBridge.register('oj-thematic-map-marker', {
    metadata: __oj_thematic_map_marker_metadata,
    parseFunction: DvtAttributeUtils.shapeParseFunction({ shape: true }, _MARKER_SHAPE_ENUMS)
  });
})();

/**
 * @ojcomponent oj.ojThematicMap
 * @augments oj.dvtBaseComponent
 * @since 0.7.0
 * @ojimportmembers oj.ojSharedContextMenu
 * @ojrole application
 * @ojshortdesc A thematic map is an interactive data visualization that displays data corresponding to geographic locations or regions.
 *              Applications are required to supply a mapProvider for a valid thematic map.
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojtsimport geojson
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojThematicMap<K1, K2, K3, D1 extends oj.ojThematicMap.Area<K1>|any, D2 extends oj.ojThematicMap.Link<K2, K1|K3>|any, D3 extends oj.ojThematicMap.Marker<K3>|any> extends dvtBaseComponent<ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>>",
 *                genericParameters: [{"name": "K1", "description": "Type of key of the areaData dataprovider"}, {"name": "K2", "description": "Type of key of the linkData dataprovider"},
 *                 {"name": "K3", "description": "Type of key of the markerData dataprovider"}, {"name": "D1", "description": "Type of data from the areaData dataprovider"},
 *                 {"name": "D2", "description": "Type of data from the linkData dataprovider"}, {"name": "D3", "description": "Type of data from the markerData dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojThematicMapSettableProperties<K1, K2, K3, D1 extends oj.ojThematicMap.Area<K1>|any, D2 extends oj.ojThematicMap.Link<K2, K1|K3>|any, D3 extends oj.ojThematicMap.Marker<K3>|any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["initialZooming", "labelDisplay", "panning", "zooming", "maxZoom", "animationOnDisplay", "style"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["mapProvider.geo", "mapProvider.propertiesKeys", "areaData", "markerData", "linkData", "isolatedItem", "selection"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 6
 *
 * @ojoracleicon 'oj-ux-ico-thematic-map'
 * @ojuxspecs ['data-visualization-thematic-map']
 *
 * @classdesc
 * <h3 id="thematicMapOverview-section">
 *   JET Thematic Map
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#thematicMapOverview-section"></a>
 * </h3>
 *
 * <p>Thematic maps are used to display data corresponding to geographic locations
 * or regions, such as election data for a state or sales by territory for a product.
 * Applications are required to supply a mapProvider for a valid thematic map.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-thematic-map mapProvider='[[mapProviderObj]]'
 *   area-data="[[dataProvider]]">
 * &lt;/oj-thematic-map>
 * </code>
 * </pre>
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
 * <h4>Styling</h4>
 * <p>Use the highest level property available. For example, consider setting styling properties on
 *    <code class="prettyprint">styleDefaults.dataAreaDefaults</code> or
 *    <code class="prettyprint">styleDefaults.dataMarkerDefaults</code>, instead of styling properties
 *    on the individual data items. The thematic map can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 *
 * <h3 id="mapprovider-section">
 *   Map Rendering
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#mapprovider-section"></a>
 * </h3>
 *
 * <p>
 *   Thematic map supports rendering of GeoJSON formatted geographic data. An application can specify the GeoJSON along with keys
 *   used for determining area IDs and labels by setting the the [mapProvider]{@link oj.ojThematicMap#mapProvider} attribute.
 *   Currently GeoJSON objects of "type" Feature, FeatureCollection and GeometryCollection are supported. Each Feature object contains
 *   the information to render a map area including the area id, coordinates, and optional short and long labels. Only Feature
 *   "geometry" objects of "type" Polygon and MutliPolygon will be used for defining area boundaries.  All other "type" values
 *   will be skipped.  The Feature "properties" object is where the thematic map will look up area info like id, short
 *   label, and long label using the key mappings provided in the [propertiesKeys]{@link oj.ojThematicMap#mapProvider.propertiesKeys} property.
 *   GeometryCollection is an array of geometry objects. Each geometry object has a type and coordinate of which only "types" Polygon and MultiPolygon are supported.
 *   See the thematic map Map Provider Demo for an example.
 * </p>
 * <p>
 *   If longitude/latitude coordinate data need to be rendered, the application should use a projection library to
 *   project the coordinates to the map projection before passing as x and y properties to the marker object.
 * </p>
 */
oj.__registerWidget('oj.ojThematicMap', $.oj.dvtBaseComponent, {
  widgetEventPrefix: 'oj',
  options: {
    /**
     * We recommend using the component CSS classes to set component wide styling. This API should be used
     * only for styling a specific instance of the component. The default values come from the CSS classes and
     * varies based on theme. The duration of the animations in milliseconds.
     * @expose
     * @name animationDuration
     * @ojshortdesc The duration of the animations in milliseconds. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {number=}
     * @ojunits "milliseconds"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">animation-duration</code> attribute specified:</caption>
     * &lt;oj-thematic-map animation-duration='200'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">animationDuration</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.animationDuration;
     *
     * // setter
     * myThematicMap.animationDuration=200;
     */
    animationDuration: undefined,
    /**
     * The type of animation to apply when the element is initially displayed.
     * @expose
     * @name animationOnDisplay
     * @ojshortdesc Specifies the animation that is shown on initial display.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">animation-on-display</code> attribute specified:</caption>
     * &lt;oj-thematic-map animation-on-display='auto'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">animationOnDisplay</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.animationOnDisplay;
     *
     * // setter
     * myThematicMap.animationOnDisplay="auto";
     */
    animationOnDisplay: 'none',
    /**
     * The DataProvider for the areas of the thematic map. It should provide data rows where each row will map data
     * for a single thematic map data area. The row key will be used as the id for thematic map areas. Note that when
     * using this attribute, a template for the <a href="#areaTemplate">areaTemplate</a> slot should be provided.
     * The DataProvider can either have an arbitrary data shape, in which case an <oj-thematic-map-area> element must be specified in the areaTemplate slot or it can have [oj.ojThematicMap.Area]{@link oj.ojThematicMap.Area} as its data shape, in which case no template is required.
     * @expose
     * @name areaData
     * @ojshortdesc Specifies the DataProvider for the areas of the thematic map. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(Object|null)=}
     * @ojsignature {target: "Type", value: "DataProvider<K1, D1>|null", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">area-data</code> attribute specified:</caption>
     * &lt;oj-thematic-map area-data='[[areaDataProvider]]'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">areaData</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.areaData;
     *
     * // setter
     * myThematicMap.areaData = areaDataProvider;
     */
    areaData: null,
    /**
     * An array of objects that define a row of data for an area data layer.
     * Also accepts a Promise where no data will be rendered if the Promise is rejected. Regardless of the
     * set value type, we will wrap and return a Promise when accessing the areas property.
     * @expose
     * @ojtsignore
     * @name areas
     * @ojshortdesc An array of objects that define area data layers. Also accepts a Promise for deferred data rendering. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(Array.<Object>|Promise|null)=}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojThematicMap.Area<K1>>>|null",
     *                                           SetterType: "Array<oj.ojThematicMap.Area<K1>>|Promise<Array<oj.ojThematicMap.Area<K1>>>|null"},
     *                                           jsdocOverride: true}
     * @default null
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">areas</code> attribute specified:</caption>
     * &lt;oj-thematic-map areas='[{"id": "a1", "color": "red", "location": "FRA"},
     *                             ...
     *                             {"id": "a27", "color": "green", "location": "USA"}]'>
     * &lt;/oj-thematic-map>
     *
     * &lt;oj-thematic-map areas='[[areasPromise]]'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">areas</code>
     * property after initialization:</caption>
     *
     * // Get all (The areas getter always returns a Promise so there is no "get one" syntax)
     * var values = myThematicMap.areas;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myThematicMap.areas=[{"id": "a1", "color": "red", "location": "FRA"},
     *              ...
     *              {"id": "a27", "color": "green", "location": "USA"}];
     */
    areas: null,
    /**
     * An alias for the $current context variable passed to slot content for the areaTemplate, markerTemplate, or linkTemplate slots.
     * @expose
     * @name as
     * @ojshortdesc An alias for the '$current' context variable passed to slot content for the areaTemplate, markerTemplate, or linkTemplate slots.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @default ""
     * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
     */
    as: '',
    /**
     * An optional callback function to update the data item in response to changes in keyboard focus state.
     * @expose
     * @name focusRenderer
     * @ojshortdesc An optional callback function to update the data item in response to changes in keyboard focus state. The function takes a context argument, provided by the thematic map. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(function(Object):(Object|void)|null)=}
     * @ojsignature {target: "Type", value: "((context: oj.ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
     * @default null
     */
    focusRenderer: null,
    /**
     * An array of category strings used for category filtering. Data items with a category in
     * hiddenCategories will be filtered.
     * @expose
     * @name hiddenCategories
     * @ojshortdesc An array of category strings used for filtering. Data items matching categories in this array will be filtered.
     * @memberof oj.ojThematicMap
     * @instance
     * @ojwriteback
     * @type {(Array.<string>)=}
     * @default []
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">hidden-categories</code> attribute specified:</caption>
     * &lt;oj-thematic-map hidden-categories='["soda", "water"]'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">hiddenCategories</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myThematicMap.hiddenCategories[0];
     *
     * // Get all
     * var values = myThematicMap.hiddenCategories;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myThematicMap.hiddenCategories=["soda", "water"];
     */
    hiddenCategories: [],
    /**
     * An array of category strings used for category highlighting. Data items with a category in
     * highlightedCategories will be highlighted.
     * @expose
     * @name highlightedCategories
     * @ojshortdesc An array of category strings used for highlighting. Data items matching categories in this array will be highlighted.
     * @memberof oj.ojThematicMap
     * @instance
     * @ojwriteback
     * @type {(Array.<string>)=}
     * @default []
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">highlighted-categories</code> attribute specified:</caption>
     * &lt;oj-thematic-map highlighted-categories='["soda", "water"]'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">highlightedCategories</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myThematicMap.highlightedCategories[0];
     *
     * // Get all
     * var values = myThematicMap.highlightedCategories;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myThematicMap.highlightedCategories=["soda", "water"];
     */
    highlightedCategories: [],
    /**
     * The matching condition for the highlightedCategories option. By default, highlightMatch is
     * 'all' and only items whose categories match all of the values specified in the highlightedCategories
     * array will be highlighted. If highlightMatch is 'any', then items that match at least one of the
     * highlightedCategories values will be highlighted.
     * @expose
     * @name highlightMatch
     * @ojshortdesc The matching condition for the highlightedCategories property. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "any"
     * @ojvalue {string} "all"
     * @default "all"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">highlight-match</code> attribute specified:</caption>
     * &lt;oj-thematic-map highlight-match='any'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">highlightMatch</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.highlightMatch;
     *
     * // setter
     * myThematicMap.highlightMatch="any";
     */
    highlightMatch: 'all',
    /**
     * Defines the behavior applied when hovering over data items.
     * @expose
     * @name hoverBehavior
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "dim"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">hover-behavior</code> attribute specified:</caption>
     * &lt;oj-thematic-map hover-behavior='dim'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">hoverBehavior</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.hoverBehavior;
     *
     * // setter
     * myThematicMap.hoverBehavior="dim";
     */
    hoverBehavior: 'none',
    /**
     * An optional callback function to update the node in response to changes in hover state.
     * @expose
     * @name hoverRenderer
     * @ojshortdesc An optional callback function to update the node in response to changes in hover state. The function takes a context argument, provided by the thematic map. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(function(Object):(Object|void)|null)=}
     * @ojsignature {target: "Type", value: "((context: oj.ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
     * @default null
     */
    hoverRenderer: null,
    /**
     * Specifies whether the map will zoom to fit the data objects on initial render.
     * @expose
     * @name initialZooming
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">initial-zooming</code> attribute specified:</caption>
     * &lt;oj-thematic-map initial-zooming='auto'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">initialZooming</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.initialZooming;
     *
     * // setter
     * myThematicMap.initialZooming="auto";
     */
    initialZooming: 'none',
    /**
     * The id for the isolated area of this area data layer. If set, only the isolated area will be displayed.
     * @expose
     * @name isolatedItem
     * @memberof oj.ojThematicMap
     * @instance
     * @type {any=}
     * @ojsignature {target:"Type", value:"K1"}
     * @default null
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">isolated-item</code> attribute specified:</caption>
     * &lt;oj-thematic-map isolated-item='a2'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">isolatedItem</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.isolatedItem;
     *
     * // setter
     * myThematicMap.isolatedItem="a2";
     */
    isolatedItem: null,
    /**
     * Specifies how labels for this layer should be displayed.
     * @expose
     * @name labelDisplay
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @ojvalue {string} "auto" Renders the label if it fits within the area bounds.
     * @default "off"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">label-display</code> attribute specified:</caption>
     * &lt;oj-thematic-map label-display='auto'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">labelDisplay</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.labelDisplay;
     *
     * // setter
     * myThematicMap.labelDisplay="auto";
     */
    labelDisplay: 'off',
    /**
     * Specifies which type of map labels to display.
     * @expose
     * @name labelType
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "long"
     * @ojvalue {string} "short"
     * @default "short"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">label-display</code> attribute specified:</caption>
     * &lt;oj-thematic-map label-type='long'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">labelType</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.labelType;
     *
     * // setter
     * myThematicMap.labelType="long";
     */
    labelType: 'short',
    /**
     * The DataProvider for the links of the thematic map. It should provide data rows where each row will map data
     * for a single thematic map data link. The row key will be used as the id for thematic map links. Note that when
     * using this attribute, a template for the <a href="#linkTemplate">linkTemplate</a> slot should be provided.
     * The DataProvider can either have an arbitrary data shape, in which case an <oj-thematic-map-link> element
     * must be specified in the linkTemplate slot or it can have [oj.ojThematicMap.Link]{@link oj.ojThematicMap.Link} as its data shape,
     * in which case no template is required.
     * @expose
     * @name linkData
     * @ojshortdesc Specifies the DataProvider for the links of the thematic map. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(Object|null)=}
     * @ojsignature {target: "Type", value: "DataProvider<K2, D2>|null", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">link-data</code> attribute specified:</caption>
     * &lt;oj-thematic-map link-data='[[linkDataProvider]]'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">linkData</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.linkData;
     *
     * // setter
     * myThematicMap.linkData = linkDataProvider;
     */
    linkData: null,
    /**
     * An array of objects that define the data for links.
     * Also accepts a Promise where no data will be rendered if the Promise is rejected. Regardless of the
     * set value type, we will wrap and return a Promise when accessing the links property.
     * @expose
     * @ojtsignore
     * @name links
     * @ojshortdesc An array of objects that define the map links. Also accepts a Promise for deferred data rendering. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(Array.<Object>|Promise|null)=}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojThematicMap.Link<K2,K1|K3,D2>>>|null",
     *                                           SetterType: "Array<oj.ojThematicMap.Link<K2,K1|K3,D2>>|Promise<Array<oj.ojThematicMap.Link<K2,K1|K3,D2>>>|null"},
     *                                           jsdocOverride: true}
     * @default null
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">links</code> attribute specified:</caption>
     * &lt;oj-thematic-map links='[{"id": "l1", "startLocation": {"id": "m2"}, "endLocation": {"id": "m29"}},
     *                             ...
     *                             {"id": "l7", "startLocation": {"id": "m17"}, "endLocation": {"id": "m9"}}]'>
     * &lt;/oj-thematic-map>
     *
     * &lt;oj-thematic-map links='[[markersPromise]]'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">links</code>
     * property after initialization:</caption>
     *
     * // Get all (The links getter always returns a Promise so there is no "get one" syntax)
     * var values = myThematicMap.links;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myThematicMap.links=[{"id": "l1", "startLocation": {"id": "m2"}, "endLocation": {"id": "m29"}},
     *              ...
     *              {"id": "l7", "startLocation": {"id": "m17"}, "endLocation": {"id": "m9"}}];
     */
    links: null,
    /**
     * An object with the following properties, used to define a custom map.
     * @expose
     * @name mapProvider
     * @ojshortdesc An object defining a custom map.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {Object}
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">map-provider</code> attribute specified:</caption>
     * <!-- Using dot notation -->
     * &lt;oj-thematic-map map-provider.geo='[[geoJsonObj]]'
     *   map-provider.properties-keys='{"id": "country", "shortLabel": "iso_a3", "longLabel": "country"}'>
     * &lt;/oj-thematic-map>
     *
     * &lt;oj-thematic-map mapProvider='[[{"geo": geoJsonObj,
     *                                     "propertiesKeys": {"id": "country",
     *                                                        "shortLabel": "iso_a3",
     *                                                        "longLabel": "country"}]]'>
     * &lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">mapProvider</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myThematicMap.mapProvider.geo;
     *
     * // Get all
     * var values = myThematicMap.mapProvider;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for
     * // subproperties rather than setting a subproperty directly.
     * myThematicMap.setProperty('mapProvider.geo', geoJsonObj);
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myThematicMap.mapProvider={'geo': geoJsonObj};
     */
    mapProvider: {
      /**
       * The GeoJSON object containing custom area coordinates. Only GeoJSON objects of "type" Feature or
       * FeatureCollection and Feature "geometry" objects of "type" Polygon or MultiPolygon are currently
       * supported. Each Feature object will contain a thematic map area and each Feature's "properties"
       * object will at a minimum need to contain a key, which can be defined in the propertiesKeys object,
       * that will be used as the ID of the area.
       * @expose
       * @name mapProvider.geo
       * @ojshortdesc An object defining a custom area's coordinates and "properties" object. See the Help documentation for more information.
       * @memberof! oj.ojThematicMap
       * @instance
       * @type {Object}
       * @default {}
       * @ojsignature {target: "Type", value: "GeoJSON.Feature<GeoJSON.Polygon|GeoJSON.MultiPolygon>|GeoJSON.FeatureCollection<GeoJSON.Polygon|GeoJSON.MultiPolygon>", jsdocOverride:true}
       *
       * @example <caption>See the <a href="#mapProvider">mapProvider</a> attribute for usage examples.</caption>
       */
      geo: {},
      /**
       * The object specifying the GeoJSON Feature "properties" object keys to use for the custom
       * area id, short label, and long label mappings.
       * @expose
       * @name mapProvider.propertiesKeys
       * @ojshortdesc An object specifying "properties" object keys to use for custom area id and label mappings.
       * @memberof! oj.ojThematicMap
       * @instance
       * @type {Object}
       *
       * @example <caption>See the <a href="#mapProvider">mapProvider</a> attribute for usage examples.</caption>
       */
      propertiesKeys: {
        /**
         * The required name of the "properties" key to use as the location id that will map a data item to a map area.<br>
         * <b>
         *   Note that the key used for map area ids must always be populated and correspond to a unique string value.
         *   Map areas without this key will not be rendered.
         *   <br>
         * </b>
         * See the [location]{@link oj.ojThematicMapArea#location} attribute of oj-thematic-map-area for additional information.
         * @expose
         * @name mapProvider.propertiesKeys.id
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojrequired
         * @default ""
         *
         * @example <caption>See the <a href="#mapProvider">mapProvider</a> attribute for usage examples.</caption>
         */
        id: '',
        /**
         * The optional name of the "properties" key to use for rendering area labels when labelType is set to "short".
         * @expose
         * @name mapProvider.propertiesKeys.shortLabel
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         *
         * @example <caption>See the <a href="#mapProvider">mapProvider</a> attribute for usage examples.</caption>
         */
        shortLabel: '',
        /**
         * The optional name of the "properties" key to use for rendering area labels when labelType is set to "long".
         * @expose
         * @name mapProvider.propertiesKeys.longLabel
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         *
         * @example <caption>See the <a href="#mapProvider">mapProvider</a> attribute for usage examples.</caption>
         */
        longLabel: ''
      }
    },
    /**
     * The DataProvider for the markers of the thematic map. It should provide data rows where each row will map data
     * for a single thematic map data marker. The row key will be used as the id for thematic map markers. Note that when
     * using this attribute, a template for the <a href="#markerTemplate">markerTemplate</a> slot should be provided.
     * The DataProvider can either have an arbitrary data shape, in which case an <oj-thematic-map-marker> element
     * must be specified in the markerTemplate slot or it can have [oj.ojThematicMap.Marker]{@link oj.ojThematicMap.Marker} as its data shape,
     * in which case no template is required.
     * @expose
     * @name markerData
     * @ojshortdesc Specifies the DataProvider for the markers of the thematic map. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(Object|null)=}
     * @ojsignature {target: "Type", value: "DataProvider<K3, D3>|null", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">marker-data</code> attribute specified:</caption>
     * &lt;oj-thematic-map marker-data='[[markerDataProvider]]'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">markerData</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.markerData;
     *
     * // setter
     * myThematicMap.markerData = markerDataProvider;
     */
    markerData: null,
    /**
     * An array of objects that define a row of data for a data layer.
     * Also accepts a Promise where no data will be rendered if the Promise is rejected. Regardless of the
     * set value type, we will wrap and return a Promise when accessing the markers property.
     * @expose
     * @ojtsignore
     * @name markers
     * @ojshortdesc An array of objects that define marker data layers. Also accepts a Promise for deferred data rendering. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(Array.<Object>|Promise|null)=}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojThematicMap.Marker<K3>>>|null",
     *                                           SetterType: "Array<oj.ojThematicMap.Marker<K3>>|Promise<Array<oj.ojThematicMap.Marker<K3>>>|null"},
     *                                           jsdocOverride: true}
     * @default null
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">markers</code> attribute specified:</caption>
     * &lt;oj-thematic-map markers='[{"id": "m1", "color": "red", "shape": "circle", x": 2102, "y": 910},
     *                             ...
     *                             {"id": "m27", "color": "green", "shape": "circle", "x": 4820, "y": 277}]'>
     * &lt;/oj-thematic-map>
     *
     * &lt;oj-thematic-map markers='[[markersPromise]]'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">markers</code>
     * property after initialization:</caption>
     *
     * // Get all (The markers getter always returns a Promise so there is no "get one" syntax)
     * var values = myThematicMap.markers;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myThematicMap.markers=[{"id": "m1", "color": "red", "shape": "circle", x": 2102, "y": 910},
     *                ...
     *                {"id": "m27", "color": "green", "shape": "circle", "x": 4820, "y": 277}];
     */
    markers: null,
    /**
     * Specifies marker behavior on zoom.
     * @expose
     * @name markerZoomBehavior
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "zoom"
     * @ojvalue {string} "fixed"
     * @default "fixed"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">marker-zoom-behavior</code> attribute specified:</caption>
     * &lt;oj-thematic-map marker-zoom-behavior='zoom'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">markerZoomBehavior</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.markerZoomBehavior;
     *
     * // setter
     * myThematicMap.markerZoomBehavior="zoom";
     */
    markerZoomBehavior: 'fixed',
    /**
     * Specifies the maximum zoom level for this element. This can be any number greater than or equal to 1.0
     * which indicates the maximum point to which the map can be scaled. A value of 2.0 implies that
     * the map can be zoomed in until it reaches twice the viewport size. A maxZoom of 1.0 indicates
     * that the user cannot zoom the map beyond the viewport size.
     * @expose
     * @name maxZoom
     * @ojshortdesc Specifies the maximum zoom level for this element. Must be greater than or equal to 1.0. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {number=}
     * @default 6.0
     * @ojmin 1.0
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">max-zoom</code> attribute specified:</caption>
     * &lt;oj-thematic-map max-zoom='10'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">maxZoom</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.maxZoom;
     *
     * // setter
     * myThematicMap.maxZoom=10;
     */
    maxZoom: 6.0,
    /**
     * Specifies whether element panning is allowed.
     * @expose
     * @name panning
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">panning</code> attribute specified:</caption>
     * &lt;oj-thematic-map panning='auto'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">panning</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.panning;
     *
     * // setter
     * myThematicMap.panning="auto";
     */
    panning: 'none',
    /**
     * A callback function used to stamp custom SVG elements for a data layer.
     * @expose
     * @name renderer
     * @ojshortdesc An optional callback function to stamp custom SVG elements for a data layer. The function takes a context argument, provided by the thematic map. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(function(Object):(Object|void)|null)=}
     * @ojsignature {target: "Type", value: "((context: oj.ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
     * @default null
     */
    renderer: null,
    /**
     * An array of id strings, used to define the selected data items.
     * @expose
     * @name selection
     * @ojshortdesc An array of strings containing the ids of the selected data items.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(Array.<any>)=}
     * @ojsignature {target:"Type", value:"Array<K1|K2|K3>"}
     * @default []
     * @ojwriteback
     * @ojeventgroup common
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">selection</code> attribute specified:</caption>
     * &lt;oj-thematic-map selection='["area1", "area2", "marker2"]'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">selection</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myThematicMap.selection[0];
     *
     * // Get all
     * var values = myThematicMap.selection;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myThematicMap.selection=["area1", "area2", "marker2"];
     */
    selection: [],
    /**
     * <p>The type of selection behavior that is enabled on the thematic map. This attribute controls the number of selections that can be made via selection gestures at any given time.
     *
     * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the thematic map's selection styling will be applied to all items specified by the <a href="#selection">selection</a> attribute.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the thematic map's selection styling will not be applied to any items specified by the <a href="#selection">selection</a> attribute.
     *
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> attribute.
     *
     * @expose
     * @name selectionMode
     * @ojshortdesc Specifies the selection mode.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "none" Selection is disabled.
     * @ojvalue {string} "single" Only a single item can be selected at a time.
     * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
     * @default "none"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">selection-mode</code> attribute specified:</caption>
     * &lt;oj-thematic-map selection-mode='multiple'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">selectionMode</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.selectionMode;
     *
     * // setter
     * myThematicMap.selectionMode="multiple";
     */
    selectionMode: 'none',
    /**
     * An optional callback function to update the data item in response to changes in selection state.
     * @expose
     * @name selectionRenderer
     * @ojshortdesc An optional callback function to update the data item in response to changes in selection state. The function takes a context argument, provided by the thematic map. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {(function(Object):(Object|void)|null)=}
     * @ojsignature {target: "Type", value: "((context: oj.ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {insert: SVGElement}|void)|null", jsdocOverride: true}
     * @default null
     */
    selectionRenderer: null,
    /**
     * We recommend using the component CSS classes to set component wide styling. This API should be used
     * only for styling a specific instance of the component. Properties specified on this object may
     * be overridden by specifications on the data item. The default values come from the CSS classes and
     * varies based on theme.
     * @expose
     * @name styleDefaults
     * @ojshortdesc An object defining the style defaults for this thematic map. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {Object=}
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">style-defaults</code> attribute specified:</caption>
     * <!-- Using dot notation -->
     * &lt;oj-thematic-map style-defaults.animation-duration='200'>&lt;/oj-thematic-map>
     *
     * <!-- Using JSON notation -->
     * &lt;oj-thematic-map style-defaults='{"animationDuration": 200, "areaSvgStyle": {"fill": "url(someURL@filterId)"}'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">styleDefaults</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myThematicMap.styleDefaults.animationDuration;
     *
     * // Get all
     * var values = myThematicMap.styleDefaults;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for
     * // subproperties rather than setting a subproperty directly.
     * myThematicMap.setProperty('styleDefaults.areaSvgStyle', {'fill': 'url(someURL#filterId)'});
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myThematicMap.styleDefaults={'fill': 'url("someURL#filterId")'};
     */
    styleDefaults: {
      /**
       * The CSS style object defining the style of the area layer areas. The default value comes from the CSS and varies based on theme.
       * Only SVG CSS style properties are supported.
       * @expose
       * @name styleDefaults.areaSvgStyle
       * @ojshortdesc The CSS style object defining the style of the area layer areas.
       * @memberof! oj.ojThematicMap
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       *
       * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
       */
      /**
       * An object defining the default styles for data areas. Properties specified on this object
       * may be overridden by specifications on the data object.
       * @expose
       * @name styleDefaults.dataAreaDefaults
       * @ojshortdesc An object defining the default styles for data areas.
       * @memberof! oj.ojThematicMap
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       *
       * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
       */
      dataAreaDefaults: {
        /**
         * The area stroke color for the area data layer. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.dataAreaDefaults.borderColor
         * @ojshortdesc The area stroke color for the area data layer.
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        borderColor: undefined,
        /**
         * The hover data area border color. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.dataAreaDefaults.hoverColor
         * @ojshortdesc The hover data area border color.
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        hoverColor: undefined,
        /**
         * The inner selected data area border color. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.dataAreaDefaults.selectedInnerColor
         * @ojshortdesc The inner selected data area border color.
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        selectedInnerColor: undefined,
        /**
         * The outer selected data area border color. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.dataAreaDefaults.selectedOuterColor
         * @ojshortdesc The outer selected data area border color.
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        selectedOuterColor: undefined
      },
      /**
       * An object defining the default styles for data markers. Properties specified on this object may be
       * overridden by specifications on the data object.
       * @expose
       * @name styleDefaults.dataMarkerDefaults
       * @ojshortdesc An object defining the default styles for data markers.
       * @memberof! oj.ojThematicMap
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       *
       * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
       */
      dataMarkerDefaults: {
        /**
         * The border color. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.dataMarkerDefaults.borderColor
         * @ojshortdesc The border color.
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        borderColor: undefined,
        /**
         * The border width in pixels.
         * @expose
         * @name styleDefaults.dataMarkerDefaults.borderWidth
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {number}
         * @ojsignature {target: "Type", value: "?"}
         * @default 0.5
         * @ojunits "pixels"
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        borderWidth: 0.5,
        /**
         * The border style.
         * @expose
         * @name styleDefaults.dataMarkerDefaults.borderStyle
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojvalue {string} "none"
         * @ojvalue {string} "solid"
         * @default "solid"
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        borderStyle: 'solid',
        /**
         * The fill color of a marker. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.dataMarkerDefaults.color
         * @ojshortdesc The fill color of a marker.
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        color: undefined,
        /**
         * The default marker pixel height. Note that this option will be ignored if a value is provided to calculate marker sizes.
         * @expose
         * @name styleDefaults.dataMarkerDefaults.height
         * @ojshortdesc The default marker pixel height.
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {number}
         * @default 8
         * @ojunits "pixels"
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        height: 8,
        /**
         * The CSS style object for a marker label.
         * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
         * @expose
         * @name styleDefaults.dataMarkerDefaults.labelStyle
         * @ojshortdesc The CSS style object defining the style of the marker label.
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {Object=}
         * @default  {}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        labelStyle: {},
        /**
         * The default marker opacity.
         * @expose
         * @name styleDefaults.dataMarkerDefaults.opacity
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {number}
         * @default 1
         * @ojmin 0.0
         * @ojmax 1.0
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        opacity: 1,
        /**
         * The default marker shape. Can take the name of a built-in shape or the SVG path commands for a custom shape.
         * @expose
         * @name styleDefaults.dataMarkerDefaults.shape
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {"circle"|"diamond"|"ellipse"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|string}
         * @ojsignature {target: "Type", value: "?"}
         * @default "circle"
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        shape: 'circle',
        /**
         * The default marker pixel width. Note that this option will be ignored if a value is provided to calculate marker sizes.
         * @expose
         * @name styleDefaults.dataMarkerDefaults.width
         * @ojshortdesc The default marker pixel width.
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {number}
         * @default 8
         * @ojunits "pixels"
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        width: 8
      },
      /**
       * Specifies initial hover delay in milliseconds for highlighting data items.
       * @expose
       * @name styleDefaults.hoverBehaviorDelay
       * @memberof! oj.ojThematicMap
       * @instance
       * @type {number}
       * @default 200
       * @ojunits "milliseconds"
       * @ojsignature {target: "Type", value: "?"}
       *
       * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
       */
      hoverBehaviorDelay: 200,
      /**
       * The CSS style object for the area layer labels.
       * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
       * @expose
       * @name styleDefaults.labelStyle
       * @ojshortdesc The CSS style object defining the style of the area layer labels.
       * @memberof! oj.ojThematicMap
       * @instance
       * @type {Object=}
       * @default  {}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       *
       * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
       */
      labelStyle: {},
      /**
       * An object defining the default styles for data links. Properties specified on this object may be
       * overridden by specifications on the data object.
       * @expose
       * @name styleDefaults.linkDefaults
       * @ojshortdesc An object defining the default styles for data links.
       * @memberof! oj.ojThematicMap
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       *
       * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
       */
      linkDefaults: {
        /**
         * The stroke color for links. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.linkDefaults.color
         * @ojshortdesc The stroke color for links.
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        color: undefined,
        /**
         * The stroke width for links in pixels.
         * @expose
         * @name styleDefaults.linkDefaults.width
         * @memberof! oj.ojThematicMap
         * @instance
         * @type {number}
         * @default  2
         * @ojunits "pixels"
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        width: 2
      }
    },
    /**
     * An object containing an optional callback function for tooltip customization.
     * @expose
     * @name tooltip
     * @memberof oj.ojThematicMap
     * @instance
     * @type {Object=}
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">tooltip</code> attribute specified:</caption>
     * <!-- Using dot notation -->
     * &lt;oj-thematic-map tooltip.renderer='[[tooltipFun]]'>&lt;/oj-thematic-map>
     *
     * &lt;oj-thematic-map tooltip='[[{"renderer": tooltipFun}]]'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">hiddenCategories</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myThematicMap.tooltip.renderer;
     *
     * // Get all
     * var values = myThematicMap.tooltip;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for
     * // subproperties rather than setting a subproperty directly.
     * myThematicMap.setProperty('tooltip.renderer', tooltipFun);
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myThematicMap.tooltip={'renderer': tooltipFun};
     */
    tooltip: {
      /**
       * A function that returns a custom tooltip.
       * @expose
       * @name tooltip.renderer
       * @ojshortdesc A function that returns a custom tooltip. The function takes a context argument, provided by the thematic map. See the Help documentation for more information.
       * @memberof! oj.ojThematicMap
       * @instance
       * @type {function(Object):Object|null}
       * @default null
       * @ojsignature {target: "Type", value: "((context: oj.ojThematicMap.TooltipContext<K1, K2, K3, D1, D2, D3>) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
       * @example <caption>See the <a href="#tooltip">tooltip</a> attribute for usage examples.</caption>
       */
      renderer: null
    },
    /**
     * Specifies the tooltip behavior of the thematic map.
     * @expose
     * @name tooltipDisplay
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "labelAndShortDesc"
     * @ojvalue {string} "none"
     * @ojvalue {string} "shortDesc"
     * @default "auto"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">tooltip-display</code> attribute specified:</caption>
     * &lt;oj-thematic-map tooltip-display='none'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">tooltipDisplay</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.tooltipDisplay;
     *
     * // setter
     * myThematicMap.tooltipDisplay="none";
     */
    tooltipDisplay: 'auto',
    /**
     * Data visualizations require a press and hold delay before triggering tooltips and
     * rollover effects on mobile devices to avoid interfering with page panning, but these
     * hold delays can make applications seem slower and less responsive. For a better user
     * experience, the application can remove the touch and hold delay when data visualizations
     * are used within a non scrolling container or if there is sufficient space outside of the
     * visualization for panning. If touchResponse is touchStart the element will instantly
     * trigger the touch gesture and consume the page pan events if the element does not require
     * an internal feature that requires a touch start gesture like panning or zooming.
     * If touchResponse is auto, the element will behave like touchStart if it determines that
     * it is not rendered within scrolling content and if element panning is not available for
     * those elements that support the feature.
     * @expose
     * @name touchResponse
     * @ojshortdesc Specifies configuration options for touch and hold delays on mobile devices. See the Help documentation for more information.
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "touchStart"
     * @ojvalue {string} "auto"
     * @default "auto"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">touch-response</code> attribute specified:</caption>
     * &lt;oj-thematic-map touch-response='touchStart'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">touchResponse</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.touchResponse;
     *
     * // setter
     * myThematicMap.touchResponse="touchStart";
     */
    touchResponse: 'auto',
    /**
     * Specifies whether element zooming is allowed.
     * @expose
     * @name zooming
     * @memberof oj.ojThematicMap
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the thematic map with the
     * <code class="prettyprint">zooming</code> attribute specified:</caption>
     * &lt;oj-thematic-map zooming='auto'>&lt;/oj-thematic-map>
     *
     * @example <caption>Get or set the <code class="prettyprint">zooming</code>
     * property after initialization:</caption>
     * // getter
     * var value = myThematicMap.zooming;
     *
     * // setter
     * myThematicMap.zooming="auto";
     */
    zooming: 'none'
  },
  _currentLocale: '',
  _loadedBasemaps: [],
  _basemapPath: 'resources/internal-deps/dvt/thematicMap/basemaps/',
  _supportedLocales: {
    ar: 'ar',
    cs: 'cs',
    da: 'da',
    de: 'de',
    el: 'el',
    es: 'es',
    fi: 'fi',
    fr: 'fr',
    'fr-ca': 'fr_CA',
    he: 'iw',
    hu: 'hu',
    it: 'it',
    ja: 'ja',
    ko: 'ko',
    nl: 'nl',
    no: 'no',
    pl: 'pl',
    pt: 'pt_BR',
    'pt-pt': 'pt',
    ro: 'ro',
    ru: 'ru',
    sk: 'sk',
    sv: 'sv',
    th: 'th',
    tr: 'tr',
    'zh-hans': 'zh_CN',
    'zh-hant': 'zh_TW'
  },

  // @inheritdoc
  _ComponentCreate: function () {
    this._super();
    this._checkBasemaps = [];
    this._initiallyRendered = false;
    this._dataLayersToUpdate = [];
  },

  // @inheritdoc
  _CreateDvtComponent: function (context, callback, callbackObj) {
    return new ThematicMap(context, callback, callbackObj);
  },

  // @inheritdoc
  _ConvertLocatorToSubId: function (locator) {
    var subId = locator.subId;

    // Convert the supported locators
    if (subId === 'oj-thematicmap-area') {
      // dataLayerId:area[index]
      subId =
        this._getDataLayerId(locator.dataLayer, locator.index, 'area') +
        ':area[' +
        locator.index +
        ']';
    } else if (subId === 'oj-thematicmap-marker') {
      // dataLayerId:marker[index]
      subId =
        this._getDataLayerId(locator.dataLayer, locator.index, 'marker') +
        ':marker[' +
        locator.index +
        ']';
    } else if (subId === 'oj-thematicmap-link') {
      // dataLayerId:link[index]
      subId =
        this._getDataLayerId(locator.dataLayer, locator.index, 'link') +
        ':link[' +
        locator.index +
        ']';
    } else if (subId === 'oj-thematicmap-tooltip') {
      subId = 'tooltip';
    }
    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  // @inheritdoc
  _ConvertSubIdToLocator: function (subId) {
    var locator = {};

    if (subId.indexOf(':area') >= 0) {
      // dataLayerId:area[index]
      locator.subId = 'oj-thematicmap-area';
      if (!this._IsCustomElement()) {
        locator.dataLayer = subId.substring(0, subId.indexOf(':'));
      }
      locator.index = this._GetFirstIndex(subId);
    } else if (subId.indexOf(':marker') >= 0) {
      // dataLayerId:marker[index]
      locator.subId = 'oj-thematicmap-marker';
      if (!this._IsCustomElement()) {
        locator.dataLayer = subId.substring(0, subId.indexOf(':'));
      }
      locator.index = this._GetFirstIndex(subId);
    } else if (subId.indexOf(':link') >= 0) {
      // dataLayerId:link[index]
      locator.subId = 'oj-thematicmap-link';
      if (!this._IsCustomElement()) {
        locator.dataLayer = subId.substring(0, subId.indexOf(':'));
      }
      locator.index = this._GetFirstIndex(subId);
    } else if (subId === 'tooltip') {
      locator.subId = 'oj-thematicmap-tooltip';
    }

    return locator;
  },

  // @inheritdoc
  _GetComponentStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses.push('oj-thematicmap');
    return styleClasses;
  },

  // @inheritdoc
  _GetChildStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses['oj-dvtbase oj-thematicmap'] = {
      path: 'animationDuration',
      property: 'ANIM_DUR'
    };
    styleClasses['oj-thematicmap-arealayer'] = [
      {
        path: 'styleDefaults/areaSvgStyle',
        property: 'BACKGROUND'
      },
      {
        path: 'styleDefaults/labelStyle',
        property: 'TEXT'
      }
    ];
    styleClasses['oj-thematicmap-area'] = {
      path: 'styleDefaults/dataAreaDefaults/borderColor',
      property: 'border-top-color'
    };
    styleClasses['oj-thematicmap-area oj-hover'] = {
      path: 'styleDefaults/dataAreaDefaults/hoverColor',
      property: 'border-top-color'
    };
    styleClasses['oj-thematicmap-area oj-selected'] = [
      {
        path: 'styleDefaults/dataAreaDefaults/selectedInnerColor',
        property: 'border-top-color'
      },
      {
        path: 'styleDefaults/dataAreaDefaults/selectedOuterColor',
        property: 'border-bottom-color'
      }
    ];
    styleClasses['oj-thematicmap-marker'] = [
      {
        path: 'styleDefaults/dataMarkerDefaults/labelStyle',
        property: 'TEXT'
      },
      {
        path: 'styleDefaults/dataMarkerDefaults/color',
        property: 'background-color'
      },
      {
        path: 'styleDefaults/dataMarkerDefaults/opacity',
        property: 'opacity'
      },
      {
        path: 'styleDefaults/dataMarkerDefaults/borderColor',
        property: 'border-top-color'
      }
    ];
    styleClasses['oj-thematicmap-marker oj-hover'] = [
      { path: 'styleDefaults/dataMarkerDefaults/_hoverColor', property: 'border-color' }
    ];
    styleClasses['oj-thematicmap-marker oj-selected'] = {
      path: 'styleDefaults/dataMarkerDefaults/_selectionColor',
      property: 'border-color'
    };
    styleClasses['oj-thematicmap-link'] = {
      path: 'styleDefaults/linkDefaults/color',
      property: 'color'
    };
    styleClasses['oj-thematicmap-link oj-hover'] = {
      path: 'styleDefaults/linkDefaults/_hoverColor',
      property: 'color'
    };
    styleClasses['oj-thematicmap-link oj-selected'] = {
      path: 'styleDefaults/linkDefaults/_selectedColor',
      property: 'border-color'
    };
    return styleClasses;
  },

  // @inheritdoc
  _GetEventTypes: function () {
    return ['optionChange'];
  },

  _InitOptions: function (originalDefaults, constructorOptions) {
    this._super(originalDefaults, constructorOptions);

    // styleDefaults subproperty defaults are dynamically generated
    // so we need to retrieve it here and override the dynamic getter by
    // setting the returned object as the new value.
    var styleDefaults = this.options.styleDefaults;
    this.options.styleDefaults = styleDefaults;
  },

  // @inheritdoc
  _setOptions: function (options, flags) {
    // determine if option change is a data layer update and save data to call data layer update API instead of render in _Render
    var numUpdates = Object.keys(options).length;
    var newAreaLayers = options.areaLayers;
    var oldAreaLayers = this.options.areaLayers;
    var pointDataLayers = options.pointDataLayers;
    var i;
    if (numUpdates === 1 && newAreaLayers && oldAreaLayers && oldAreaLayers.length > 0) {
      for (i = 0; i < newAreaLayers.length; i++) {
        var newAreaLayer = newAreaLayers[i];
        var currAreaLayer = oldAreaLayers[i];
        var updateDataLayer = true;
        var areaLayerKeys = Object.keys(newAreaLayer);
        for (var k = 0; k < areaLayerKeys.length; k++) {
          var areaLayerKey = areaLayerKeys[k];
          // check to see if option update is a data layer update by seeing if any other area layer property is changed
          if (
            areaLayerKey !== 'areaDataLayer' &&
            newAreaLayer[areaLayerKey] !== currAreaLayer[areaLayerKey]
          ) {
            updateDataLayer = false;
          }
        }
        if (
          updateDataLayer &&
          !oj.Object.compareValues(currAreaLayer.areaDataLayer, newAreaLayer.areaDataLayer)
        ) {
          this._dataLayersToUpdate.push({
            options: newAreaLayer.areaDataLayer,
            parentLayer: newAreaLayer.layer,
            isADL: true
          });
        }
      }
    } else if (
      numUpdates === 1 &&
      pointDataLayers &&
      this.options.pointDataLayers &&
      this.options.pointDataLayers.length > 0
    ) {
      for (i = 0; i < pointDataLayers.length; i++) {
        if (!oj.Object.compareValues(this.options.pointDataLayers[i], pointDataLayers[i])) {
          this._dataLayersToUpdate.push({
            options: pointDataLayers[i],
            parentLayer: pointDataLayers[i].id,
            isADL: false
          });
        }
      }
    }
    this._super(options, flags);
  },

  // @inheritdoc
  _GetComponentRendererOptions: function () {
    return [
      { path: 'tooltip/renderer', slot: 'tooltipTemplate' },
      { path: '_tooltip/renderer' },
      { path: 'renderer', slot: 'markerContentTemplate' },
      { path: 'focusRenderer', slot: 'markerContentTemplate' },
      { path: 'hoverRenderer', slot: 'markerContentTemplate' },
      { path: 'selectionRenderer', slot: 'markerContentTemplate' }
    ];
  },

  _LoadResources: function () {
    // Ensure the resources object exists
    if (this.options._resources == null) {
      this.options._resources = {};
    }
  },

  // @inheritdoc
  _ProcessOptions: function () {
    this._super();

    // wrap tooltip function in try catch
    var tooltipObj = this.options.tooltip;
    var tooltipFun = tooltipObj ? tooltipObj.renderer : null;
    if (tooltipFun) {
      var self = this;
      this.options._tooltip = {
        renderer: function (context) {
          var defaultTooltip = self._IsCustomElement()
            ? { insert: context.tooltip }
            : context.tooltip;
          try {
            var tooltip = tooltipFun(context);
            return tooltip || defaultTooltip;
          } catch (error) {
            warn('Showing default tooltip. ' + error);
            return defaultTooltip;
          }
        }
      };
    }

    var areaLayers = this.options.areaLayers;
    var i;
    var renderer;
    // call custom renderers
    if (areaLayers) {
      for (i = 0; i < areaLayers.length; i++) {
        var areaDataLayer = areaLayers[i].areaDataLayer;
        if (areaDataLayer) {
          renderer = areaDataLayer._templateRenderer;
          if (renderer) {
            areaDataLayer.renderer = this._GetTemplateDataRenderer(renderer, 'area');
          }
        }
      }
    }
    var pointDataLayers = this.options.pointDataLayers;
    if (pointDataLayers) {
      for (i = 0; i < pointDataLayers.length; i++) {
        var pointDataLayer = pointDataLayers[i];
        if (pointDataLayer) {
          renderer = pointDataLayer._templateRenderer;
          if (renderer) {
            pointDataLayer.renderer = this._GetTemplateDataRenderer(renderer, 'point');
          }
        }
      }
    }

    // callback function for getting the context needed for custom renderers
    this.options._contextHandler = this._getContextHandler();
  },

  // @inheritdoc
  _Render: function () {
    this._NotReady();

    var areaLayers = this.options.areaLayers;
    var i;
    // Don't render unless a basemap and area layer or at least a mapProvider for custom element are provided
    if (this._IsCustomElement()) {
      if (!this.options.mapProvider.geo.type) {
        this._MakeReady();
        return;
      }
    } else {
      var basemap = this.options.basemap;
      if (!basemap || !areaLayers || areaLayers.length < 1) {
        this._MakeReady();
        return;
      }

      // For thematic map, we must ensure that all basemaps are loaded before rendering.  If basemaps are still loading,
      // return and wait for the load listener to call _Render again.
      this._loadBasemap(basemap, areaLayers);
      for (i = 0; i < this._checkBasemaps.length; i++) {
        if (!this._loadedBasemaps[this._checkBasemaps[i]]) {
          return;
        }
      }
      this._checkBasemaps = [];
    }

    // do data layer updates only if we've already initially rendered the thematic map
    if (this._initiallyRendered && this._dataLayersToUpdate.length > 0) {
      // Fix 18498656: If the component is not attached to a visible subtree of the DOM, rendering will fail because
      // getBBox calls will not return the correct values.
      // Note: Checking offsetParent() does not work here since it returns false for position: fixed.
      if (this._context.isReadyToRender()) {
        for (i = 0; i < this._dataLayersToUpdate.length; i++) {
          var dl = this._dataLayersToUpdate[i];
          var isAdl = dl.isADL;
          if (isAdl) {
            this._CleanTemplate('area');
          } else {
            this._CleanTemplate('point');
          }
          this._component.updateLayer(dl.options, dl.parentLayer, isAdl);
        }
        this._dataLayersToUpdate = [];
      }
      this._MakeReady();
    } else {
      // Delegate to the super to call the shared JS component for actual rendering.
      this._super();
      this._initiallyRendered = true;
    }
  },

  // @inheritdoc
  _RenderComponent: function (options, isResize) {
    // Map old to new APIs right before render so we handle deferred data case as well
    if (this._IsCustomElement()) {
      this._mapCustomElementOptions(options);
    }
    // parse the top level selection map and populate data layer selection option
    this._updateDataLayerSelection(options);

    this._super(options, isResize);
  },

  /**
   * Creates a callback function that will be used by a data item to populate context for its custom renderer
   * @return {Function} context handler callback used to create context for a custom renderer
   * @private
   * @instance
   * @memberof oj.ojThematicMap
   */
  _getContextHandler: function () {
    var thisRef = this;
    var contextHandlerFunc = function (
      parentElement,
      rootElement,
      data,
      itemData,
      state,
      previousState
    ) {
      var context = {
        component: __GetWidgetConstructor(thisRef.element),
        parentElement: parentElement,
        rootElement: rootElement,
        data: data,
        itemData: itemData,
        state: state,
        previousState: previousState,
        id: data.id,
        label: data.label,
        color: data.color,
        location: data.location,
        x: data.x,
        y: data.y
      };
      if (thisRef._IsCustomElement()) {
        context.renderDefaultHover = thisRef.renderDefaultHover.bind(thisRef, context);
        context.renderDefaultSelection = thisRef.renderDefaultSelection.bind(thisRef, context);
        context.renderDefaultFocus = thisRef.renderDefaultFocus.bind(thisRef, context);
      }
      return thisRef._FixRendererContext(context);
    };
    return contextHandlerFunc;
  },

  /**
   * Renders the default hover effect for a data item.
   * @ojsignature {target: "Type", value: "oj.ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>", jsdocOverride: true}
   * @param {Object} context A context object.
   * @return {void}
   * @expose
   * @ignore
   * @instance
   * @memberof oj.ojThematicMap
   */
  renderDefaultHover: function (context) {
    if (!context.previousState || context.state.hovered !== context.previousState.hovered) {
      this._component.processDefaultHoverEffect(context.id, context.state.hovered);
    }
  },

  /**
   * Renders the default selection effect for a data item.
   * @ojsignature {target: "Type", value: "oj.ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>", jsdocOverride: true}
   * @param {Object} context A context object.
   * @return {void}
   * @expose
   * @ignore
   * @instance
   * @memberof oj.ojThematicMap
   */
  renderDefaultSelection: function (context) {
    if (!context.previousState || context.state.selected !== context.previousState.selected) {
      this._component.processDefaultSelectionEffect(context.id, context.state.selected);
    }
  },

  /**
   * Renders the default focus effect for a data item.
   * @ojsignature {target: "Type", value: "oj.ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>", jsdocOverride: true}
   * @param {Object} context A context object.
   * @return {void}
   * @expose
   * @ignore
   * @instance
   * @memberof oj.ojThematicMap
   */
  renderDefaultFocus: function (context) {
    if (!context.previousState || context.state.focused !== context.previousState.focused) {
      this._component.processDefaultFocusEffect(context.id, context.state.focused);
    }
  },

  /**
   * Loads the basemaps and resource bundles.
   * @private
   */
  _loadBasemap: function (basemap, areaLayers) {
    var locale = getLocale();
    if (locale !== this._currentLocale) {
      this._currentLocale = locale;
      this._loadedBasemaps = [];
    }

    // Track basemaps that need to be loaded before rendering
    for (var i = 0; i < areaLayers.length; i++) {
      var layer = areaLayers[i].layer;
      if (layer) {
        this._loadBasemapHelper(basemap, layer, locale);
      }
    }

    // load city basemap
    var pointDataLayers = this.options.pointDataLayers;
    // Don't try and load cities basemap if mapProvider is used
    if (!this.options.mapProvider.geo.type && pointDataLayers && pointDataLayers.length > 0) {
      this._loadBasemapHelper(basemap, 'cities', locale);
    }
  },

  /**
   * Utility function for loading resource bundles by url.
   * @param {string} url The url of the resource to load
   * @param {boolean} bRenderOnFail True if we should render even if resource fails to load
   * @private
   */
  _loadResourceByUrl: function (url, bRenderOnFail) {
    // resource is already loaded or function tried to load this resource but failed
    if (this._loadedBasemaps[url]) {
      return;
    }

    var thisRef = this;
    var renderCallback = function () {
      thisRef._loadedBasemaps[url] = true;
      thisRef._Render();
    };
    // Builtin basemaps for ojThematicMap are not supported when the ojs/ojthematicmap module has been bundled by Webpack
    /* ojWebpackError: 'Internal loading of base maps not supported when the application is bundled by Webpack' */
    import('../' + getResourceUrl(url)).then(
      renderCallback,
      bRenderOnFail ? renderCallback : null
    );
  },

  /**
   * Helper function to load a single layer basemap and resource bundle.
   * @private
   */
  _loadBasemapHelper: function (basemap, layer, locale) {
    var isLoaded = true;
    try {
      // If the basemap is not loaded in DvtBaseMapManager then we'll get an error thrown
      // so we need to catch and load the basemap
      isLoaded = Object.keys(ThematicMap.DvtBaseMapManager.getLayerIds(basemap, layer)).length > 0;
    } catch (err) {
      isLoaded = false;
    }

    if (!isLoaded) {
      // Don't need to wait for loaded basemaps if using mapProvider
      if (!this.options.mapProvider.geo.type) {
        var relativeUrl = this._basemapPath + 'ojthematicmap-' + basemap + '-' + layer + '.js';
        if (this._checkBasemaps.indexOf(relativeUrl) === -1) {
          this._checkBasemaps.push(relativeUrl);
          this._loadResourceByUrl(relativeUrl, false);
        }
      }
    }

    if (locale.indexOf('en') === -1) {
      /*
       * Split locale by subtags and try to load resource bundle that satisfies
       * Locale syntax defined by BCP 47 and should be one of the following formats:
       * 1)language_script_region
       * 2)language_region
       * 3)language_script
       * 4)language
       * 5)default (en)
       */
      var splitLocale = locale.toLowerCase().split('-');
      var localeList = [splitLocale[0]];
      if (splitLocale.length > 1) {
        localeList.unshift(splitLocale[0] + '-' + splitLocale[1]);
      }
      if (splitLocale.length > 2) {
        localeList.unshift(
          splitLocale[0] + '-' + splitLocale[2],
          splitLocale[0] + '-' + splitLocale[1] + '-' + splitLocale[2]
        );
      }

      // eslint-disable-next-line no-param-reassign
      basemap = basemap.charAt(0).toUpperCase() + basemap.slice(1);
      // eslint-disable-next-line no-param-reassign
      layer = layer.charAt(0).toUpperCase() + layer.slice(1);
      var bundleName = this._basemapPath + 'resourceBundles/' + basemap + layer + 'Bundle_';
      // Go thru list of supported DVT languages
      for (var i = 0; i < localeList.length; i++) {
        if (this._supportedLocales[localeList[i]]) {
          var bundleUrl = bundleName + this._supportedLocales[localeList[i]] + '.js';
          if (this._checkBasemaps.indexOf(bundleUrl) === -1) {
            this._checkBasemaps.push(bundleUrl);
            this._loadResourceByUrl(bundleUrl, true);
          }
          break;
        }
      }
    }
  },

  // @inheritdoc
  _HandleEvent: function (event) {
    var type = event.type;
    if (type === 'selection') {
      var selection;
      var id = event.clientId;
      var currentSelection = this.options.selection;
      var newSelection = event.selection;
      if (this._IsCustomElement()) {
        this._selectionDataLayerMap[id] = newSelection;
        selection = this._selectionDataLayerMap.adl1.concat(this._selectionDataLayerMap.pdl1);
      } else {
        selection = {};
        selection[id] = newSelection;
        if (currentSelection) {
          var dataLayerIds = Object.keys(currentSelection);
          for (var i = 0; i < dataLayerIds.length; i++) {
            var dataLayerId = dataLayerIds[i];
            if (id !== dataLayerId) {
              selection[dataLayerId] = currentSelection[dataLayerId];
            }
          }
        }
      }
      this._UserOptionChange('selection', selection);
    } else {
      this._super(event);
    }
  },

  /**
   * Updates the options object with the current data layer selection states
   * @param {Object} options The options object to update
   * @memberof oj.ojThematicMap
   * @instance
   * @private
   */
  _updateDataLayerSelection: function (options) {
    var selection = options.selection;
    var hasSelection =
      (this._IsCustomElement() ? selection.length : Object.keys(selection).length) > 0;
    // Assume ids are unique amongst all data items for custom elements
    // so just same selection array on all data layers
    if (selection && hasSelection) {
      var pdls = options.pointDataLayers;
      if (pdls) {
        if (this._IsCustomElement() && pdls[0]) {
          pdls[0].selection = selection;
        } else {
          for (var i = 0; i < pdls.length; i++) {
            if (selection[pdls[i].id]) {
              pdls[i].selection = selection[pdls[i].id];
            }
          }
        }
      }

      var als = options.areaLayers;
      if (als && als[0]) {
        // JET thematic map does not support nesting of point data layers within an area layer
        var adl = als[0].areaDataLayer;
        if (this._IsCustomElement() && adl) {
          adl.selection = selection;
        } else if (adl && selection[adl.id]) {
          adl.selection = selection[adl.id];
        }
      }
    }
  },

  /**
   * Returns an object for automation testing verification of an area with
   * the specified index in the areas property.
   * @param {number} index The index of the area in the areas Array.
   * @ojsignature {target: "Type", value: "oj.ojThematicMap.DataContext|null", jsdocOverride: true, for: "returns"}
   * @return {Object|null} An object containing properties for the area, or null if none exists.
   * @expose
   * @instance
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojThematicMap
   * @ojshortdesc Returns an object for automation testing verification of the specified area.
   */
  getArea: function (index) {
    if (this._IsCustomElement()) {
      return this._component
        .getAutomation()
        .getData(this._getDataLayerId(null, index, 'area'), 'area', index);
    }
    return this._component.getAutomation().getData(arguments[0], 'area', arguments[1]);
  },

  /**
   * Returns an object for automation testing verification of a marker with
   * the specified index in the markers property.
   * @param {number} index The index of the marker in the markers Array.
   * @ojsignature {target: "Type", value: "oj.ojThematicMap.DataContext|null", jsdocOverride: true, for: "returns"}
   * @return {Object|null} An object containing properties for the marker, or null if none exists.
   * @expose
   * @instance
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojThematicMap
   * @ojshortdesc Returns an object for automation testing verification of the specified marker.
   */
  getMarker: function (index) {
    if (this._IsCustomElement()) {
      return this._component
        .getAutomation()
        .getData(this._getDataLayerId(null, index, 'marker'), 'marker', index);
    }
    return this._component.getAutomation().getData(arguments[0], 'marker', arguments[1]);
  },

  /**
   * Returns an object for automation testing verification of a link with
   * the specified index in the links property.
   * @param {number} index The index of the link in the links Array.
   * @ojsignature {target: "Type", value: "oj.ojThematicMap.DataContext|null", jsdocOverride: true, for: "returns"}
   * @return {Object|null} An object containing properties for the link, or null if none exists.
   * @expose
   * @instance
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojThematicMap
   * @ojshortdesc Returns an object for automation testing verification of the specified link.
   */
  getLink: function (index) {
    if (this._IsCustomElement()) {
      return this._component
        .getAutomation()
        .getData(this._getDataLayerId(null, index, 'link'), 'link', index);
    }
    return this._component.getAutomation().getData(arguments[0], 'link', arguments[1]);
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   * @ojsignature {target: "Type", value: "oj.ojThematicMap.NodeContext|null", jsdocOverride: true, for: "returns"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojThematicMap
   * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
   */
  getContextByNode: function (node) {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (context) {
      if (this._IsCustomElement()) {
        delete context.dataLayer;
      }
      if (context.subId !== 'oj-thematicmap-tooltip') {
        return context;
      }
    }

    return null;
  },

  // @inheritdoc
  _GetComponentDeferredDataPaths: function () {
    if (this._IsCustomElement()) {
      return { root: ['areas', 'markers', 'links', 'areaData', 'markerData', 'linkData'] };
    }
    return {
      areaLayers: ['areaDataLayer/areas', 'areaDataLayer/markers', 'areaDataLayer/links'],
      pointDataLayers: ['markers', 'links']
    };
  },

  // @inheritdoc
  _GetComponentNoClonePaths: function () {
    // For custom elements we want to skip cloning for data and also the mapProvider object so we can
    // internally do === checks and perform animations when the mapProvider changes
    if (this._IsCustomElement()) {
      var noClonePaths = this._super();
      noClonePaths.mapProvider = true;
      return noClonePaths;
    }
    return {
      mapProvider: true,
      areaLayers: { areaDataLayer: { areas: true, markers: true, links: true } },
      pointDataLayers: { markers: true, links: true }
    };
  },

  // @inheritdoc
  _GetDataContext: function (options) {
    if (this._IsCustomElement()) {
      return this._super();
    }
    // Need to use this.options instead of options because the options
    // passed in will actually be an areaLayer or pointDataLayer options object
    var basemap = this.options.basemap;
    var layer = options.layer ? options.layer : 'cities';
    return {
      basemap: basemap,
      layer: layer,
      ids: DvtBaseMapManager.getLayerIds(basemap, layer)
    };
  },

  /**
   * Map custom element APIs to the widget APIs and return an object containing
   * the new area and point data layers for rendering purposes.
   * @param {string} options The options to map
   * @private
   * @instance
   * @memberof oj.ojThematicMap
   */
  _mapCustomElementOptions: function (options) {
    // AnimationOnMapChange is not exposed, map animationOnDisplay to that property instead
    // eslint-disable-next-line no-param-reassign
    options.animationOnMapChange = options.animationOnDisplay;

    // Create areaLayers and pointDataLayers objects for data items
    // We will use a static id for these data layers for automation lookup
    var areaDataLayerId = 'adl1';
    var pointDataLayerId = 'pdl1';
    var areaLayers = [{}];
    // eslint-disable-next-line no-param-reassign
    options.areaLayers = areaLayers;
    var areaLayer = areaLayers[0];
    var adl = { id: areaDataLayerId }; // need id for automation lookup
    areaLayer.areaDataLayer = adl;

    var pointDataLayers = [{ id: pointDataLayerId }]; // need id for automation lookup
    // eslint-disable-next-line no-param-reassign
    options.pointDataLayers = pointDataLayers;
    var pdl = pointDataLayers[0];

    // New top level properties that should be mapped to the areaLayer
    var props = ['labelDisplay', 'labelType'];
    this._mapOptionHelper(options, props, [areaLayer]);

    // New top level properties that should be mapped to the area/pointDataLayers
    props = [
      'animationOnDataChange',
      'focusRenderer',
      'hoverRenderer',
      'renderer',
      'selectionMode',
      'selectionRenderer'
    ];
    this._mapOptionHelper(options, props, [adl, pdl]);

    // New top level properties that should be mapped to the areaDataLayer
    props = ['areas', 'isolatedItem'];
    this._mapOptionHelper(options, props, [adl]);

    // We need to split up selection ids to their data layers
    // so we can keep track of events from different data layers.
    if (!this._selectionDataLayerMap) {
      this._selectionDataLayerMap = { adl1: [], pdl1: [] };
    }
    // Convert selection array to map for faster lookup
    var selection = options.selection;
    var selectionMap = {};
    var i;
    for (i = 0; i < selection.length; i++) {
      selectionMap[selection[i]] = true;
    }

    // Create a map of area/marker ids to data layer ids
    this._idToDataLayerMap = {};
    var areas = options.areas;
    if (areas) {
      for (i = 0; i < areas.length; i++) {
        var area = areas[i];
        this._idToDataLayerMap[area.id] = areaDataLayerId;
        var id = area.id;
        if (selectionMap[id]) {
          this._selectionDataLayerMap[areaDataLayerId].push(id);
        }
      }
    }

    // For markers and links we need to check whether they belong to an
    // area/pointDataLayer by checking if location is defined.
    // Save the old array index to the new data layer mapping for constructing
    // and deconstructing subIds. Custom element subIds lack the dataLayerId.
    var markers = options.markers;
    var dlId;
    if (markers) {
      this._markerToDataLayerMap = [];
      var areaMarkers = [];
      var pointMarkers = [];
      for (i = 0; i < markers.length; i++) {
        var marker = markers[i];
        if (marker.location) {
          areaMarkers.push(marker);
          dlId = areaDataLayerId;
        } else if (marker.x && marker.y) {
          pointMarkers.push(marker);
          dlId = pointDataLayerId;
        }
        if (dlId) {
          this._markerToDataLayerMap[i] = dlId;
          this._idToDataLayerMap[marker.id] = dlId;
          if (selectionMap[marker.id]) {
            this._selectionDataLayerMap[dlId].push(marker.id);
          }
        }
      }

      if (areaMarkers.length > 0) {
        adl.markers = areaMarkers;
      }
      if (pointMarkers.length > 0) {
        pdl.markers = pointMarkers;
      }
    }

    var links = options.links;
    if (links) {
      this._linkToDataLayerMap = [];
      var areaLinks = [];
      var pointLinks = [];
      for (i = 0; i < links.length; i++) {
        var link = links[i];
        var linkStart = link.startLocation;
        if (linkStart) {
          // Just check the startLocation, further validation of endLocation
          // occurs in toolkit impl
          if (linkStart.location) {
            this._linkToDataLayerMap[i] = areaDataLayerId;
            areaLinks.push(link);
          } else if (linkStart.x && linkStart.y) {
            pointLinks.push(link);
            this._linkToDataLayerMap[i] = pointDataLayerId;
          } else if (linkStart.id) {
            // If id is specified, find whether it maps to an area or marker.
            // Ids should be unique so we can stop at the first match.
            dlId = this._idToDataLayerMap[linkStart.id];
            this._linkToDataLayerMap[i] = dlId;
            if (dlId === areaDataLayerId) {
              areaLinks.push(link);
            } else {
              pointLinks.push(link);
            }
          }
        }

        dlId = this._idToDataLayerMap[link.id];
        if (dlId) {
          if (selectionMap[link.id]) {
            this._selectionDataLayerMap[dlId].push(link.id);
          }
        }
      }

      if (areaLinks.length > 0) {
        adl.links = areaLinks;
      }
      if (pointLinks.length > 0) {
        pdl.links = pointLinks;
      }
    }
  },

  /**
   * Helper method to map an custom element API to the old API.
   * @private
   * @instance
   * @memberof oj.ojThematicMap
   */
  _mapOptionHelper: function (options, props, optionObjs) {
    for (var i = 0; i < props.length; i++) {
      var key = props[i];
      var value = options[key];
      if (value) {
        for (var j = 0; j < optionObjs.length; j++) {
          // eslint-disable-next-line no-param-reassign
          optionObjs[j][key] = value;
        }
      }
    }
  },

  /**
   * Returns the dataLayerId used for a subId.
   * @param  {string} dataLayer The data layer or null if known
   * @param  {number} index The data item index
   * @param  {string} dataItemType Enum of type area, marker or link
   * @return {string}
   * @private
   */
  _getDataLayerId: function (dataLayer, index, dataItemType) {
    if (this._IsCustomElement()) {
      switch (dataItemType) {
        case 'area':
          return 'adl1';
        case 'marker':
          return this._markerToDataLayerMap[index];
        case 'link':
          return this._linkToDataLayerMap[index];
        default:
          return '';
      }
    } else {
      return dataLayer;
    }
  },

  _GetSimpleDataProviderConfigs: function () {
    return {
      areaData: {
        templateName: 'areaTemplate',
        templateElementName: 'oj-thematic-map-area',
        resultPath: 'areas'
      },
      linkData: {
        templateName: 'linkTemplate',
        templateElementName: 'oj-thematic-map-link',
        resultPath: 'links'
      },
      markerData: {
        templateName: 'markerTemplate',
        templateElementName: 'oj-thematic-map-marker',
        resultPath: 'markers'
      }
    };
  },

  _WrapInlineTemplateRenderer: function (origRenderer, templateName, option) {
    var getDefaultWrapperFunction = function (defaultFunc) {
      return function (context) {
        context[defaultFunc]();
        return origRenderer(context);
      };
    };
    if (
      option === 'focusRenderer' &&
      this._TemplateHandler.getDataSetBoolean(templateName, 'oj-default-focus')
    ) {
      return getDefaultWrapperFunction('renderDefaultFocus');
    }
    if (
      option === 'hoverRenderer' &&
      this._TemplateHandler.getDataSetBoolean(templateName, 'oj-default-hover')
    ) {
      return getDefaultWrapperFunction('renderDefaultHover');
    }
    if (
      option === 'selectionRenderer' &&
      this._TemplateHandler.getDataSetBoolean(templateName, 'oj-default-selection')
    ) {
      return getDefaultWrapperFunction('renderDefaultSelection');
    }

    return origRenderer;
  }
});

// Conditionally set the defaults for custom element vs widget syntax since we expose different APIs
setDefaultOptions({
  ojThematicMap: {
    styleDefaults: createDynamicPropertyGetter(function (context) {
      if (context.isCustomElement) {
        return {
          areaSvgStyle: {}
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
 *     <tr>
 *       <td rowspan="3">Data Item</td>
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
 *     <tr>
 *       <td rowspan="3">Element</td>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Pan when <code class="prettyprint">panning</code> is <code class="prettyprint">auto</code>.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Pinch-close</kbd></td>
 *       <td>Zoom out when <code class="prettyprint">zooming</code> is <code class="prettyprint">auto</code>.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Spread-open</kbd></td>
 *       <td>Zoom in when <code class="prettyprint">zooming</code> is <code class="prettyprint">auto</code>.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojThematicMap
 */

/**
 *<table class="keyboard-table">
 *  <thead>
 *    <tr>
 *      <th>Key</th>
 *      <th>Action</th>
 *    </tr>
 *  </thead>
 *  <tbody>
 *  <tr>
 *     <td><kbd>Tab</kbd></td>
 *     <td>Move focus to map and then to next element.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + Tab</kbd></td>
 *     <td>Move focus to map and then to previous element.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>= or +</kbd></td>
 *     <td>Zoom in one level if zooming is enabled.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>- or _</kbd></td>
 *     <td>Zoom out one level if zooming is enabled.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>0</kbd></td>
 *     <td>Zoom to fit map if zooming is enabled.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + Alt + 0</kbd></td>
 *     <td>Zoom to fit region with focus.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + 0</kbd></td>
 *     <td>Zoom to fit selected regions.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + Shift + 0</kbd></td>
 *     <td>Reset map.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>PageUp</kbd></td>
 *     <td>Pan up.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>PageDown</kbd></td>
 *     <td>Pan down.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + PageUp</kbd></td>
 *     <td>Pans left in left to right locales.  Pans right in right to left locales.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + PageDown</kbd></td>
 *     <td>Pans right in left to right locales.  Pans left in right to left locales.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>LeftArrow or RightArrow</kbd></td>
 *     <td>Move focus and selection to the left or right nearest data item in the collection (e.g. areas, markers, links) or
 *         the left link end marker if the focus is on a link and Alt + &lt; or Alt + &gt; was used to move there.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>UpArrow or DownArrow</kbd></td>
 *     <td>Move focus and selection to the above or below nearest data item in the collection (e.g. areas, markers, links) or
 *         to the next link above that is associated with the previous data item,
 *         if the focus is on a link and Alt + &lt; or Alt + &gt; was used to move there.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + LeftArrow or Shift + RightArrow</kbd></td>
 *     <td>Move focus and multi-select the left or right nearest data item in the collection (e.g. areas, markers, links).</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + UpArrow or Shift + DownArrow</kbd></td>
 *     <td>Move focus and multi-select the nearest data item above or below in the collection (e.g. areas, markers, links).</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + LeftArrow or Ctrl + RightArrow</kbd></td>
 *     <td>Move focus to the left or right nearest data item in the collection (e.g. areas, markers, links),
 *         without changing the current selection.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + UpArrow or Ctrl + DownArrow</kbd></td>
 *     <td>Move focus to nearest data item above or below in the collection (e.g. areas, markers, links), without changing the current selection.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>] or [</kbd></td>
 *     <td>Move focus and selection to nearest data item in the next data layer above or below.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Shift + ] or Shift + [</kbd></td>
 *     <td>Move focus to nearest data item in the next data layer above or below and multi-select.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + ] or Ctrl + [</kbd></td>
 *     <td>Move focus to nearest data item in the next data layer above or below, without changing the current selection.</td>
 *  </tr>
 *  <tr>
 *    <td><kbd>Alt + &lt; or Alt + &gt;</kbd></td>
 *    <td>Move focus from a data item to an associated link. Note that the link must have been created referencing the data item's ID
 *        in its start/endLocation objects for an association to exist.</td>
 *  </tr>
 *  <tr>
 *     <td><kbd>Ctrl + Spacebar</kbd></td>
 *     <td>Multi-select base map region or marker with focus.</td>
 *  </tr>
 *  </tbody>
 *</table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojThematicMap
 */

// PROPERTY TYPEDEFS

/**
 * @typedef {Object} oj.ojThematicMap.Area
 * @property {Array.<string>=}       categories An array of category strings corresponding to this area. This allows highlighting and filtering of areas.
 * @property {string=}       color The area color.
 * @property {any=}          id The identifier for this area. The id should be set by the application if the DataProvider is not being used. The row key will be used as id in the  case.
 * @property {string=}       label Text used for the area's label.
 * @property {Object=}       labelStyle The CSS style defining the label style for this area. The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
 * @property {string}        location An identifier corresponding to a Feature provided in the mapProvider geo object that this area is associated with.
 * @property {number=}       opacity The area opacity.
 * @property {"auto"|"off"}  [selectable="auto"] Specifies whether or not the area will be selectable.
 * @property {(string|function)=} shortDesc The description of this element. Will be lazily created if a function is used.  This is used for accessibility and also for customizing the tooltip text.
 * @property {string=}       svgClassName The CSS style class defining the style of the area.
 * @property {Object=}       svgStyle The CSS style object defining the style of the area. Only SVG CSS style properties are supported.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "svgStyle", jsdocOverride: true},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "labelStyle", jsdocOverride: true},
 *               {target: "Type", value: "?(string | ((context: oj.ojThematicMap.AreaShortDescContext<K,D>) => string))", jsdocOverride: true, for: "shortDesc"},
 *               {target: "Type", value: "<K,D=any>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojThematicMap.Link
 * @property {Array.<string>=}       categories An array of category strings corresponding to this link. This allows highlighting and filtering of links.
 * @property {string=}       color The link color.
 * @property {Object}        endLocation An object used to determine the end point of the link.
 * @property {any=}          endLocation.id The marker or area id to be used as the end point.
 * @property {string=}       endLocation.location An identifier corresponding to a Feature provided in the mapProvider geo object to be used as the end point.
 * @property {number=}       endLocation.x The x coordinate which can represent latitude of the end point.
 * @property {number=}       endLocation.y The y coordinate which can represent longitude of the end point.
 * @property {any=}          id The identifier for this link. The id should be set by the application if the DataProvider is not being used. The row key will be used as id in the  case.
 * @property {"auto"|"off"}  [selectable="auto"] Specifies whether or not the link will be selectable.
 * @property {(string|function)=} shortDesc The description of this element. Will be lazily created if a function is used.  This is used for accessibility and also for customizing the tooltip text.
 * @property {Object}        startLocation An object used to determine the start point of the link.
 * @property {any=}          startLocation.id The marker id to be used as the start point.
 * @property {string=}       startLocation.location An identifier corresponding to a Feature provided in the mapProvider geo object to be used as the start point.
 * @property {number=}       startLocation.x The x coordinate which can represent latitude of the start point.
 * @property {number=}       startLocation.y The y coordinate which can represent longitude of the start point.
 * @property {string=}       svgClassName The CSS style class defining the style of the link.
 * @property {Object=}       svgStyle The CSS style object defining the style of the link. Only SVG CSS style properties are supported.
 * @property {number=}       width The link width in pixels.
 * @ojsignature [{target: "Type", value: "K2", for: "endLocation.id"},
 *               {target: "Type", value: "K1", for: "id"},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "svgStyle", jsdocOverride: true},
 *               {target: "Type", value: "K2", for: "startLocation.id"},
 *               {target: "Type", value: "?(string | ((context: oj.ojThematicMap.LinkShortDescContext<K1,K2,D1>) => string))", jsdocOverride: true, for: "shortDesc"},
 *               {target: "Type", value: "<K1,K2,D1=any>", for:"genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojThematicMap.Marker
 * @property {string=}       borderColor The marker border color.
 * @property {"solid"|"none"}    [borderStyle="solid"] The marker border style.
 * @property {number=}       borderWidth The marker border width in pixels.
 * @property {Array.<string>=}       categories An array of category strings corresponding to this marker. This allows highlighting and filtering of markers.
 * @property {string=}       color The marker color.
 * @property {number=}       height The pixel height for this marker. Note that this attribute will be ignored if a value is provided to calculate marker sizes.
 * @property {any=}       id The identifier for this marker. The id should be set by the application if the DataProvider is not being used. The row key will be used as id in the  case.
 * @property {string=}       label Text used for the marker's label.
 * @property {"bottom"|"center"|"top"}       [labelPosition="center"] Determines the label position relative to the marker.
 * @property {Object=}       labelStyle The CSS style object defining the style of the marker. The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
 * @property {string=}       location An identifier corresponding to a Feature provided in the mapProvider geo object that this marker is associated with.
 * @property {number=}       opacity The marker opacity.
 * @property {number=}       rotation The angle to rotate the marker in clockwise degrees around the marker center.
 * @property {"auto"|"off"}  [selectable="auto"] Specifies whether or not the marker will be selectable.
 * @property {"circle"|"diamond"|"ellipse"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|string}
 *                           [shape="circle"] Specifies the shape of a marker. Can take the name of a built-in shape or the SVG path commands for a custom shape.
 * @property {(string|function)=} shortDesc The description of this element. Will be lazily created if a function is used.  This is used for accessibility and also for customizing the tooltip text.
 * @property {string=}       source Specifies an URI specifying the location of the image resource to use for the marker instead of a built-in shape.
 *                                  The shape attribute is ignored if the source image is defined.
 * @property {string=}       sourceHover An optional URI specifying the location of the hover image resource. If not defined, the source image will be used.
 * @property {string=}       sourceHoverSelected An optional URI specifying the location of the selected image resource on hover. If not defined, the
 *                                               sourceSelected image will be used. If sourceSelected is not defined, then the source image will be used.
 * @property {string=}       sourceSelected An optional URI specifying the location of the selected image. If not defined, the source image will be used.
 * @property {string=}       svgClassName The CSS style class defining the style of the marker.
 * @property {Object=}       svgStyle The CSS style object defining the style of the marker. Only SVG CSS style properties are supported.
 * @property {number=}       value A data value used to calculate the marker dimensions based on the range of all the data values and the element size.
 *                                 Markers with negative or zero data values will not be rendered. If specified, this value takes precedence over the
 *                                 width and height attributes.
 * @property {number=}       width The pixel width for this marker. Note that this attribute will be ignored if a value is provided to calculate marker.
 * @property {number=}       x The x coordinate of the marker transformed using the map projection, which can be null if location is set instead.
 * @property {number=}       y The y coordinate of the marker transformed using the map projection, which can be null if location is set instead.
 * @ojsignature [{target: "Type", value: "K3", for: "id"},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "labelStyle", jsdocOverride: true},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "svgStyle", jsdocOverride: true},
 *               {target: "Type", value: "?(string | ((context: oj.ojThematicMap.MarkerShortDescContext<K3,D3>) => string))", jsdocOverride: true, for: "shortDesc"},
 *               {target: "Type", value: "<K3,D3=any>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojThematicMap.RendererContext
 * @property {string}       color The color of the data item.
 * @property {Element}      componentElement The thematic map element.
 * @property {Object}       data The data object for the rendered item.
 * @property {any}          id The id of the data item.
 * @property {Object|null}  itemData The row data object for the rendered item. This will only be set if an DataProvider is being used.
 * @property {string}       label The label of the data item.
 * @property {string|null}  location The location of the data item which can be null if x/y are set instead.
 * @property {Element}      parentElement An element that is part of a displayed subtree on the DOM. Modifications of the parentElement are not supported.
 * @property {Object}       previousState An object that reflects the previous state of the data item.
 * @property {boolean}      previousState.hovered True if the data item was previously hovered.
 * @property {boolean}      previousState.selected True if the data item was previously selected.
 * @property {boolean}      previousState.focused True if the data item was previously selected.
 * @property {function():void} renderDefaultFocus Function for rendering default focus effect for the data item
 * @property {function():void} renderDefaultHover Function for rendering default hover effect for the data item
 * @property {function():void} renderDefaultSelection Function for rendering default selection effect for the data item
 * @property {Element|null} root Null on initial rendering or the current data item SVG element.
 * @property {Object}       state An object that reflects the current state of the data item.
 * @property {boolean}      state.hovered True if the data item is currently hovered.
 * @property {boolean}      state.selected True if the data item is currently selected.
 * @property {boolean}      state.focused True if the data item is currently selected.
 * @property {number|null}  x The x coordinate of the data item which can be null if location is set instead.
 * @property {number|null}  y The y coordinate of the data item which can be null if location is set instead.
 * @ojsignature [{target: "Type", value: "K1|K2|K3", for: "id"},
 *               {target: "Type", value: "oj.ojThematicMap.Area<K1,D1>|oj.ojThematicMap.Link<K2,K1|K3,D2>|oj.ojThematicMap.Marker<K3,D3>", for: "data"},
 *               {target: "Type", value: "D1|D2|D3|null", for: "itemData"},
 *               {target: "Type", value: "<K1,K2,K3,D1,D2,D3>", for: "genericTypeParameters"}]
 */

// METHOD TYPEDEFS

/**
 * @typedef {Object} oj.ojThematicMap.DataContext
 * @property {string} color The color of the item at the given index.
 * @property {string} label The label of the item at the given index.
 * @property {boolean} selected True if the item at the given index is currently selected and false otherwise.
 * @property {string} tooltip The tooltip of the item at the given index.
 */
/**
 * @typedef {Object} oj.ojThematicMap.NodeContext
 * @property {string} subId The subId string identify the particular DOM node.
 * @property {number} index The zero based index of the thematic map item.
 */
/**
 * @typedef {Object} oj.ojThematicMap.TooltipContext
 * @property {string|null} color The color of the hovered item or null if the hovered item if not associated with any data.
 * @property {Element} componentElement The thematic map element.
 * @property {Object|null} data The data object of the hovered item or null if the hovered item is not associated with any data.
 * @property {any|null} id The id of the hovered item or null if the hovered item if not associated with any data.
 * @property {Object|null} itemData The row data object for the hovered item. This will only be set if an DataProvider is being used.
 * @property {string|null} label The data label of the hovered item or null if the hovered item if not associated with any data.
 * @property {string|null} location The location id of the hovered item which can be null if x/y are set instead.
 * @property {string|null} locationName The location name of the hovered item if location id is set.
 * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
 * @property {string} tooltip The default tooltip string constructed by the element if any.
 * @property {number} x The x coordinate of the hovered item which can be null if location is set instead.
 * @property {number} y The y coordinate of the hovered item which can be null if location is set instead.
 * @ojsignature [{target: "Type", value: "K1|K2|K3|null", for: "id"},
 *               {target: "Type", value: "oj.ojThematicMap.Area<K1,D1>|oj.ojThematicMap.Link<K2,K1|K3,D2>|oj.ojThematicMap.Marker<K3,D3>|null", for: "data"},
 *               {target: "Type", value: "D1|D2|D3|null", for: "itemData"},
 *               {target: "Type", value: "<K1,K2,K3,D1,D2,D3>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojThematicMap.AreaShortDescContext
 * @property {Object} data The data object of the hovered item.
 * @property {any} id The id of the hovered item.
 * @property {Object|null} itemData The row data object for the hovered item. This will only be set if an DataProvider is being used.
 * @property {string} label The data label of the hovered item.
 * @property {string|null} location The location id of the hovered item which can be null if x/y are set instead.
 * @property {string|null} locationName The location name of the hovered item if location id is set.
 * @property {number} x The x coordinate of the hovered item which can be null if location is set instead.
 * @property {number} y The y coordinate of the hovered item which can be null if location is set instead.
 * @ojsignature [{target: "Type", value: "K1", for: "id"},
 *               {target: "Type", value: "oj.ojThematicMap.Area<K1,D1>", for: "data"},
 *               {target: "Type", value: "D1|null", for: "itemData"},
 *               {target: "Type", value: "<K1,D1>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojThematicMap.LinkShortDescContext
 * @property {Object} data The data object of the hovered item.
 * @property {any} id The id of the hovered item.
 * @property {Object|null} itemData The row data object for the hovered item. This will only be set if an DataProvider is being used.
 * @property {string} label The data label of the hovered item.
 * @ojsignature [{target: "Type", value: "K1", for: "id"},
 *               {target: "Type", value: "oj.ojThematicMap.Link<K1,K2,D1>", for: "data"},
 *               {target: "Type", value: "D1|null", for: "itemData"},
 *               {target: "Type", value: "<K1,K2,D1>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojThematicMap.MarkerShortDescContext
 * @property {Object} data The data object of the hovered item.
 * @property {any} id The id of the hovered item.
 * @property {Object|null} itemData The row data object for the hovered item. This will only be set if an DataProvider is being used.
 * @property {string} label The data label of the hovered item.
 * @property {string|null} location The location id of the hovered item which can be null if x/y are set instead.
 * @property {string|null} locationName The location name of the hovered item if location id is set.
 * @property {number} x The x coordinate of the hovered item which can be null if location is set instead.
 * @property {number} y The y coordinate of the hovered item which can be null if location is set instead.
 * @ojsignature [{target: "Type", value: "K3", for: "id"},
 *               {target: "Type", value: "oj.ojThematicMap.Marker<K3>", for: "data"},
 *               {target: "Type", value: "D3|null", for: "itemData"},
 *               {target: "Type", value: "<K3,D3>", for: "genericTypeParameters"}]
 */

// KEEP FOR WIDGET SYNTAX

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for an area in the specified data layer.</p>
 *
 * @property {string} dataLayer The id of the data layer.
 * @property {number} index The index of the area within the specified data layer.
 *
 * @ojsubid oj-thematicmap-area
 * @memberof oj.ojThematicMap
 *
 * @example <caption>Get the first area in the collection (e.g. areas, markers, links) with id 'states':</caption>
 * var nodes = myThematicMap.getNodeBySubId({'subId': 'oj-thematicmap-area', 'dataLayer': 'states', 'index' : 0});
 */

/**
 * <p>Sub-ID for a marker in the specified data layer.</p>
 *
 * @property {string} dataLayer The id of the data layer.
 * @property {number} index The index of the marker within the specified data layer.
 *
 * @ojsubid oj-thematicmap-marker
 * @memberof oj.ojThematicMap
 *
 * @example <caption>Get the first marker in the collection (e.g. areas, markers, links) with id 'states':</caption>
 * var nodes = myThematicMap.getNodeBySubId({'subId': 'oj-thematicmap-marker', 'dataLayer': 'states', 'index' : 0});
 */

/**
 * <p>Sub-ID for a link in the specified data layer.</p>
 *
 * @property {string} dataLayer The id of the data layer.
 * @property {number} index The index of the link within the specified data layer.
 *
 * @ojsubid oj-thematicmap-link
 * @memberof oj.ojThematicMap
 *
 * @example <caption>Get the first link in the collection (e.g. areas, markers, links) with id 'states':</caption>
 * var nodes = myThematicMap.getNodeBySubId({'subId': 'oj-thematicmap-link', 'dataLayer': 'states', 'index' : 0});
 */

/**
 * <p>Sub-ID for the the thematic map tooltip.</p>
 *
 * @ojsubid oj-thematicmap-tooltip
 * @memberof oj.ojThematicMap
 *
 * @example <caption>Get the tooltip object of the thematic map, if displayed:</caption>
 * var nodes = myThematicMap.getNodeBySubId({'subId': 'oj-thematicmap-tooltip'});
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for an area in the specified data layer.</p>
 *
 * @property {number} index The index of the area within the specified data layer.
 *
 * @ojnodecontext oj-thematicmap-area
 * @memberof oj.ojThematicMap
 */

/**
 * <p>Context for a marker in the specified data layer.</p>
 *
 * @property {number} index The index of the marker within the specified data layer.
 *
 * @ojnodecontext oj-thematicmap-marker
 * @memberof oj.ojThematicMap
 */

/**
 * <p>Context for a link in the specified data layer.</p>
 *
 * @property {number} index The index of the link within the specified data layer.
 *
 * @ojnodecontext oj-thematicmap-link
 * @memberof oj.ojThematicMap
 */

// Slots
/**
 * <p>
 *  The <code class="prettyprint">areaTemplate</code> slot is used to specify the template for
 *  creating areas of the thematic map. The slot content must be wrapped in a single &lt;template>
 *  element. The content of the template should be a single &lt;oj-thematic-map-area> element.
 *  See the [oj-thematic-map-area]{@link oj.ojThematicMapArea} doc for more details.
 * </p>
 * <p>
 *  When the template is executed for each area, it will have access to the components's
 *  binding context containing the following properties:
 * </p>
 * <ul>
 *   <li>
 *      $current - an object that contains information for the current area.
 *      (See [oj.ojThematicMap.AreaTemplateContext]{@link oj.ojThematicMap.AreaTemplateContext} or the table below for a list of properties available on $current)
 *   </li>
 *   <li>
 *      alias - if 'as' attribute was specified, the value will be used to provide an
 *      application-named alias for $current.
 *   </li>
 * </ul>
 *
 * @ojslot areaTemplate
 * @ojshortdesc The areaTemplate slot is used to specify the template for creating areas of the thematic map. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojThematicMap
 * @ojtemplateslotprops oj.ojThematicMap.AreaTemplateContext
 * @ojpreferredcontent ["ThematicMapAreaElement"]
 *
 * @example <caption>Initialize the thematic map with an inline area template specified:</caption>
 * &lt;oj-thematic-map area-data='[[areaDataProvider]]' map-provider='[[mapProvider]]'>
 *  &lt;template slot='areaTemplate'>
 *    &lt;oj-thematic-map-area color='[[$current.data.color]]' location='[[$current.data.country]]'
 *      short-desc='[[$current.data.shortDesc]]'>
 *    &lt;/oj-thematic-map-area>
 *  &lt;/template>
 * &lt;/oj-thematic-map>
 */
/**
 * @typedef {Object} oj.ojThematicMap.AreaTemplateContext
 * @property {Element} componentElement The &lt;oj-thematic-map> custom element
 * @property {Object} data The data object for the current area
 * @property {number} index The zero-based index of the current area
 * @property {any} key The key of the current area
 */

/**
 * <p>
 *  The <code class="prettyprint">markerTemplate</code> slot is used to specify the template for
 *  creating markers of the thematic map. The slot content must be wrapped in a single &lt;template>
 *  element. The content of the template should be a single &lt;oj-thematic-map-marker> element.
 *  See the [oj-thematic-map-marker]{@link oj.ojThematicMapMarker} doc for more details.
 * </p>
 * <p>
 *  When the template is executed for each marker, it will have access to the components's
 *  binding context containing the following properties:
 * </p>
 * <ul>
 *   <li>
 *      $current - an object that contains information for the current marker.
 *      (See [oj.ojThematicMap.MarkerTemplateContext]{@link oj.ojThematicMap.MarkerTemplateContext} or the table below for a list of properties available on $current)
 *   </li>
 *   <li>
 *      alias - if 'as' attribute was specified, the value will be used to provide an
 *      application-named alias for $current.
 *   </li>
 * </ul>
 *
 * @ojslot markerTemplate
 * @ojshortdesc The markerTemplate slot is used to specify the template for creating markers of the thematic map. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojThematicMap
 * @ojtemplateslotprops oj.ojThematicMap.MarkerTemplateContext
 * @ojpreferredcontent ["ThematicMapMarkerElement"]
 *
 * @example <caption>Initialize the thematic map with an inline marker template specified:</caption>
 * &lt;oj-thematic-map marker-data='[[markerDataProvider]]' map-provider='[[mapProvider]]'>
 *  &lt;template slot='markerTemplate'>
 *    &lt;oj-thematic-map-marker color='[[$current.data.color]]' x='[[$current.data.lat]]'
 *      y='[[$current.data.long]]' short-desc='[[$current.data.shortDesc]]'>
 *    &lt;/oj-thematic-map-marker>
 *  &lt;/template>
 * &lt;/oj-thematic-map>
 */
/**
 * @typedef {Object} oj.ojThematicMap.MarkerTemplateContext
 * @property {Element} componentElement The &lt;oj-thematic-map> custom element
 * @property {Object} data The data object for the current marker
 * @property {number} index The zero-based index of the current marker
 * @property {any} key The key of the current marker
 */

/**
 * <p>The <code class="prettyprint">markerContentTemplate</code> slot is used to specify custom marker content. The slot content must be a single &lt;template> element.</p>
 * This slot takes precedence over the renderer/focusRenderer/hoverRenderer/selectionRenderer properties if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current marker. (See [oj.ojThematicMap.RendererContext]{@link oj.ojThematicMap.RendererContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 * <p>Additionally, add data-oj-default-focus, data-oj-default-hover and/or data-oj-default-selection attributes to the template to also render the default focus, hover and/or selection effect for the data item.</p>
 * <p>Note that SVG nodes for the marker content should be wrapped into an svg element in order to have the SVG namespace. The component will insert the entire SVG structure into DOM including the outer svg element.</p>
 * @ojslot markerContentTemplate
 * @ojmaxitems 1
 * @ojtemplateslotprops oj.ojThematicMap.RendererContext
 * @memberof oj.ojThematicMap
 * @since 7.1.0
 *
 * @example <caption>Initialize the ThematicMap with a marker content template specified:</caption>
 * &lt;oj-thematic-map>
 *  &lt;template slot="markerContentTemplate" data-oj-default-focus data-oj-default-hover data-oj-default-selection>
 *   &lt;svg width="100" height="100">
 *    &lt;text>&lt;oj-bind-text value="[[$current.label]]">&lt;/oj-bind-text>&lt;/text>
 *   &lt;/svg>
 *  &lt;/template>
 * &lt;/oj-thematic-map>
 */

/**
 * <p>
 *  The <code class="prettyprint">linkTemplate</code> slot is used to specify the template for
 *  creating links of the thematic map. The slot content must be wrapped in a single &lt;template>
 *  element. The content of the template should be a single &lt;oj-thematic-map-link> element.
 *  See the [oj-thematic-map-link]{@link oj.ojThematicMapLink} doc for more details.
 * </p>
 * <p>
 *  When the template is executed for each link, it will have access to the components's
 *  binding context containing the following properties:
 * </p>
 * <ul>
 *   <li>
 *      $current - an object that contains information for the current link.
 *      (See [oj.ojThematicMap.LinkTemplateContext]{@link oj.ojThematicMap.LinkTemplateContext} or the table below for a list of properties available on $current)
 *   </li>
 *   <li>
 *      alias - if 'as' attribute was specified, the value will be used to provide an
 *      application-named alias for $current.
 *   </li>
 * </ul>
 *
 * @ojslot linkTemplate
 * @ojshortdesc The linkTemplate slot is used to specify the template for creating links of the thematic map. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojThematicMap
 * @ojtemplateslotprops oj.ojThematicMap.LinkTemplateContext
 * @ojpreferredcontent ["ThematicMapLinkElement"]
 *
 * @example <caption>Initialize the thematic map with an inline link template specified:</caption>
 * &lt;oj-thematic-map link-data='[[linkDataProvider]]' map-provider='[[mapProvider]]'>
 *  &lt;template slot='linkTemplate'>
 *    &lt;oj-thematic-map-link startLocation='[[$current.data.startCoords]]' endLocation='[[$current.data.endCoords]]'
 *      short-desc='[[$current.data.shortDesc]]'>
 *    &lt;/oj-thematic-map-link>
 *  &lt;/template>
 * &lt;/oj-thematic-map>
 */
/**
 * @typedef {Object} oj.ojThematicMap.LinkTemplateContext
 * @property {Element} componentElement The &lt;oj-thematic-map> custom element
 * @property {Object} data The data object for the current link
 * @property {number} index The zero-based index of the current link
 * @property {any} key The key of the current link
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content. The slot content must be a single &lt;template> element.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current item. (See [oj.ojThematicMap.TooltipContext]{@link oj.ojThematicMap.TooltipContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojmaxitems 1
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojThematicMap.TooltipContext
 * @memberof oj.ojThematicMap
 *
 * @example <caption>Initialize the ThematicMap with a tooltip template specified:</caption>
 * &lt;oj-thematic-map>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span>&lt;oj-bind-text value="[[$current.locationName + ': ' + $current.label]]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-thematic-map>
 */

//-----------------------------------------------------
//                   Styling
//-----------------------------------------------------
/**
 * @ojstylevariableset oj-thematic-map-css-set1
 * @ojstylevariable oj-thematic-map-bg-color {description: "Thematic map background color", formats: ["color"], help: "#css-variables"}
 * @ojstylevariable oj-thematic-map-border-color {description: "Thematic map border color",formats: ["color"], help: "#css-variables"}
 * @memberof oj.ojThematicMap
 */

/**
 * @ojcomponent oj.ojThematicMapArea
 * @ojshortdesc The oj-thematic-map-area element is used to declare properties for thematic map areas. See the Help documentation for more information.
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojThematicMapArea<K1=any, D1=any> extends dvtBaseComponent<ojThematicMapAreaSettableProperties<K1, D1>>",
 *                genericParameters: [{"name": "K1", "description": "Type of key of the areaData dataprovider"},
 *                                    {"name": "D1", "description": "Type of data from the areaData dataprovider"}
 *                ]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojThematicMapAreaSettableProperties<K1=any, D1=any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @since 5.2.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Thematic Map Area
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-thematic-map-area element is used to declare properties for thematic map areas and is only valid as the
 *  child of a template element for the [areaTemplate]{@link oj.ojThematicMap#areaTemplate}
 *  slot of oj-thematic-map.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-thematic-map area-data='[[areaDataProvider]]' map-provider='[[mapProvider]]'>
 *  &lt;template slot='areaTemplate'>
 *    &lt;oj-thematic-map-area  color='[[$current.data.color]]' location='[[$current.data.country]]'>
 *    &lt;/oj-thematic-map-area>
 *  &lt;/template>
 * &lt;/oj-thematic-map>
 * </code>
 * </pre>
 */

/**
 * An array of category strings corresponding to this area. This allows highlighting and filtering of areas.
 * By default, the label is used as the area category.
 * @expose
 * @name categories
 * @memberof! oj.ojThematicMapArea
 * @instance
 * @type {(Array.<string>)=}
 * @default []
 *
 * @example <caption>Initialize the thematic map area with the
 * <code class="prettyprint">categories</code> attribute specified:</caption>
 * &lt;oj-thematic-map-area categories='[[$current.data.categories]]'>&lt;/oj-thematic-map-area>
 */
/**
 * The area color. The default values come from the CSS classes and varies based on theme.
 * @expose
 * @name color
 * @ojshortdesc The area color.
 * @memberof! oj.ojThematicMapArea
 * @instance
 * @type {string=}
 * @ojformat color
 * @default null
 *
 * @example <caption>Initialize the thematic map area with the
 * <code class="prettyprint">color</code> attribute specified:</caption>
 * &lt;oj-thematic-map-area color='[[$current.data.color]]'>&lt;/oj-thematic-map-area>
 */
/**
 * Text used for the area's label.
 * @expose
 * @name label
 * @memberof! oj.ojThematicMapArea
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the thematic map area with the
 * <code class="prettyprint">label</code> attribute specified:</caption>
 * &lt;oj-thematic-map-area label='[[$current.data.label]]'>&lt;/oj-thematic-map-area>
 */
/**
 * The CSS style object defining the style of the area label. The default values come from the CSS classes and varies based on theme.
 * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
 * @expose
 * @name labelStyle
 * @ojshortdesc The CSS style object defining the style of the area label.
 * @memberof! oj.ojThematicMapArea
 * @instance
 * @type {object=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
 * @default null
 *
 * @example <caption>Initialize the thematic map area with the
 * <code class="prettyprint">label-style</code> attribute specified:</caption>
 * &lt;oj-thematic-map-area label-style='{"color":"black","fontSize":"12px"}'>&lt;/oj-thematic-map-area>
 */
/**
 * An identifier corresponding to a Feature provided in the mapProvider geo object that this area is associated with.<br>
 * See the [map-provider.properties-keys.id]{@link oj.ojThematicMap#mapProvider.propertiesKeys.id} attribute of oj-thematic-map for additional information.
 * @expose
 * @name location
 * @ojshortdesc An identifier corresponding to a mapProvider "Feature" geo object that this area is associated with.
 * @memberof! oj.ojThematicMapArea
 * @instance
 * @type {string}
 * @default ""
 *
 * @example <caption>Initialize the thematic map area with the
 * <code class="prettyprint">location</code> attribute specified:</caption>
 * &lt;oj-thematic-map-area location='[[$current.data.location}}'>&lt;/oj-thematic-map-area>
 */
/**
 * The area opacity.
 * @expose
 * @name opacity
 * @memberof! oj.ojThematicMapArea
 * @instance
 * @type {number=}
 * @ojmin 0
 * @ojmax 1
 * @default 1
 *
 * @example <caption>Initialize the thematic map area with the
 * <code class="prettyprint">opacity</code> attribute specified:</caption>
 * &lt;oj-thematic-map-area opacity='0.5'>&lt;/oj-thematic-map-area>
 */
/**
 * Specifies whether or not the area will be selectable.
 * @expose
 * @name selectable
 * @memberof! oj.ojThematicMapArea
 * @instance
 * @type {string=}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "off"
 * @default "auto"
 *
 * @example <caption>Initialize the thematic map area with the
 * <code class="prettyprint">selectable</code> attribute specified:</caption>
 * &lt;oj-thematic-map-area selectable='off'>&lt;/oj-thematic-map-area>
 */
/**
 * The text that displays in the area's tooltip.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojThematicMapArea
 * @instance
 * @type {(string|function)=}
 * @default ""
 * @ojsignature [{target: "Type", value: "?(string | ((context: oj.ojThematicMap.AreaShortDescContext<K1,D1>) => string))", jsdocOverride: true}]
 *
 * @example <caption>Initialize the thematic map area with the
 * <code class="prettyprint">short-desc</code> attribute specified:</caption>
 * &lt;oj-thematic-map-area short-desc='[[$current.data.shortDesc]]'>&lt;/oj-thematic-map-area>
 */
/**
 * The CSS style class defining the style of the area.
 * @expose
 * @name svgClassName
 * @memberof! oj.ojThematicMapArea
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the thematic map area with the
 * <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
 * &lt;oj-thematic-map-area svg-class-name='areaStyle'>&lt;/oj-thematic-map-area>
 */
/**
 * The CSS style object defining the style of the area.
 * Only SVG CSS style properties are supported.
 * @expose
 * @name svgStyle
 * @memberof! oj.ojThematicMapArea
 * @instance
 * @type {object=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
 * @default {}
 *
 * @example <caption>Initialize the thematic map area with the
 * <code class="prettyprint">svg-style</code> attribute specified:</caption>
 * &lt;oj-thematic-map-area svg-style='{"color": "red"}'>&lt;/oj-thematic-map-area>
 */

/**
 * @ojcomponent oj.ojThematicMapLink
 * @ojshortdesc The oj-thematic-map-link element is used to declare properties for thematic map links. See the Help documentation for more information.
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojThematicMapLink<K1=any,K2=any,D1=any> extends dvtBaseComponent<ojThematicMapLinkSettableProperties<K1,K2,D1>>",
 *                genericParameters: [{"name": "K1", "description": "Type of key of the linkData dataprovider"},
 *                                    {"name": "K2", "description": "Type of key used to specify start-location and end-location"},
 *                                    {"name": "D1", "description": "Type of data from the linkData dataprovider"}
 *                ]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojThematicMapLinkSettableProperties<K1=any,K2=any,D1=any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @since 5.2.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Thematic Map Link
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-thematic-map-link element is used to declare properties for thematic map links and is only valid as the
 *  child of a template element for the [linkTemplate]{@link oj.ojThematicMap#linkTemplate}
 *  slot of oj-thematic-map.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-thematic-map link-data='[[linkDataProvider]]' map-provider='[[mapProvider]]'>
 *  &lt;template slot='linkTemplate'>
 *    &lt;oj-thematic-map-link  start-location='[[$current.data.start]]' end-location='[[$current.data.end]]'>
 *    &lt;/oj-thematic-map-link>
 *  &lt;/template>
 * &lt;/oj-thematic-map>
 * </code>
 * </pre>
 */

/**
 * An array of category strings corresponding to this link. This allows highlighting and filtering of links.
 * By default, the label is used as the link category.
 * @expose
 * @name categories
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {(Array.<string>)=}
 * @default []
 *
 * @example <caption>Initialize the thematic map link with the
 * <code class="prettyprint">categories</code> attribute specified:</caption>
 * &lt;oj-thematic-map-link categories='[[$current.data.categories]]'>&lt;/oj-thematic-map-link>
 */
/**
 * The link color.
 * @expose
 * @name color
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {string=}
 * @ojformat color
 * @default ""
 *
 * @example <caption>Initialize the thematic map link with the
 * <code class="prettyprint">color</code> attribute specified:</caption>
 * &lt;oj-thematic-map-link color='[[$current.data.color]]'>&lt;/oj-thematic-map-link>
 */
/**
 * An object used to determine the end point of the link.
 * @expose
 * @name endLocation
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {object}
 * @default {}
 *
 * @example <caption>Initialize the thematic map with the
 * <code class="prettyprint">end-location</code> attribute specified:</caption>
 * <!-- Using dot notation -->
 * &lt;oj-thematic-map-link end-location.x='[[$current.data.lat]] end-location.y='[[$current.data.long]]'>&lt;/oj-thematic-map-link>
 *
 * &lt;oj-thematic-map-link end-location='[[$current.data.end]]>&lt;/oj-thematic-map-link>
 */
/**
 * The marker or area id to be used as the end point.
 * @expose
 * @name endLocation.id
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {any=}
 *
 * @example <caption>See the <a href="#endLocation">endLocation</a> attribute for usage examples.</caption>
 */
/**
 * An identifier corresponding to a Feature provided in the mapProvider geo object
 * to be used as the end point.
 * @expose
 * @name endLocation.location
 * @ojshortdesc An identifier corresponding to a mapProvider "Feature" geo object to be used as the end point.
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {string=}
 *
 * @example <caption>See the <a href="#endLocation">endLocation</a> attribute for usage examples.</caption>
 */
/**
 * The x coordinate which can represent latitude of the end point.
 * @expose
 * @name endLocation.x
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {number=}
 *
 * @example <caption>See the <a href="#endLocation">endLocation</a> attribute for usage examples.</caption>
 */
/**
 * The y coordinate which can represent longitude of the end point.
 * @expose
 * @name endLocation.y
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {number=}
 *
 * @example <caption>See the <a href="#endLocation">endLocation</a> attribute for usage examples.</caption>
 */
/**
 * Specifies whether or not the link will be selectable.
 * @expose
 * @name selectable
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {string=}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "off"
 * @default "auto"
 *
 * @example <caption>Initialize the thematic map link with the
 * <code class="prettyprint">selectable</code> attribute specified:</caption>
 * &lt;oj-thematic-map-link selectable='off'>&lt;/oj-thematic-map-link>
 */
/**
 * The text that displays in the link's tooltip.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {(string|function)=}
 * @default ""
 * @ojsignature [{target: "Type", value: "?(string | ((context: oj.ojThematicMap.LinkShortDescContext<K1,K2,D1>) => string))", jsdocOverride: true}]
 *
 * @example <caption>Initialize the thematic map link with the
 * <code class="prettyprint">short-desc</code> attribute specified:</caption>
 * &lt;oj-thematic-map-link short-desc='[[$current.data.shortDesc]]'>&lt;/oj-thematic-map-link>
 */
/**
 * An object used to determine the start point of the link.
 * @expose
 * @name startLocation
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {object}
 * @default {}
 *
 * @example <caption>Initialize the thematic map with the
 * <code class="prettyprint">start-location</code> attribute specified:</caption>
 * <!-- Using dot notation -->
 * &lt;oj-thematic-map-link start-location.x='[[$current.data.lat]] start-location.y='[[$current.data.long]]'>&lt;/oj-thematic-map-link>
 *
 * &lt;oj-thematic-map-link start-location='[[$current.data.start]]>&lt;/oj-thematic-map-link>
 */
/**
 * The marker id to be used as the start point.
 * @expose
 * @name startLocation.id
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {any=}
 *
 * @example <caption>See the <a href="#startLocation">startLocation</a> attribute for usage examples.</caption>
 */
/**
 * An identifier corresponding to a Feature provided in the mapProvider geo object
 * to be used as the start point.
 * @expose
 * @name startLocation.location
 * @ojshortdesc An identifier corresponding to a mapProvider "Feature" geo object to be used as the start point.
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {string=}
 *
 * @example <caption>See the <a href="#startLocation">startLocation</a> attribute for usage examples.</caption>
 */
/**
 * The x coordinate which can represent latitude of the start point.
 * @expose
 * @name startLocation.x
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {number=}
 *
 * @example <caption>See the <a href="#startLocation">startLocation</a> attribute for usage examples.</caption>
 */
/**
 * The y coordinate which can represent longitude of the start point.
 * @expose
 * @name startLocation.y
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {number=}
 *
 * @example <caption>See the <a href="#startLocation">startLocation</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style class defining the style of the link.
 * @expose
 * @name svgClassName
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the thematic map link with the
 * <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
 * &lt;oj-thematic-map-link svg-class-name='linkStyle'>&lt;/oj-thematic-map-link>
 */
/**
 * The CSS style object defining the style of the link.
 * Only SVG CSS style properties are supported.
 * @expose
 * @name svgStyle
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {object=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
 * @default {}
 *
 * @example <caption>Initialize the thematic map link with the
 * <code class="prettyprint">svg-style</code> attribute specified:</caption>
 * &lt;oj-thematic-map-link svg-style='{"color": "red"}'>&lt;/oj-thematic-map-link>
 */
/**
 * The link width in pixels.
 * @expose
 * @name width
 * @memberof! oj.ojThematicMapLink
 * @instance
 * @type {number=}
 * @ojunits "pixels"
 * @default 2
 *
 * @example <caption>Initialize the thematic map link with the
 * <code class="prettyprint">width</code> attribute specified:</caption>
 * &lt;oj-thematic-map-link width='3'>&lt;/oj-thematic-map-link>
 */
//-----------------------------------------------------
//                   Styling
//-----------------------------------------------------
/**
 * @ojstylevariableset oj-thematic-map-link-css-set1
 * @ojstylevariable oj-thematic-map-link-color {description: "Thematic map link color", formats: ["color"], help: "#css-variables"}
 * @memberof! oj.ojThematicMapLink
 */

/**
 * @ojcomponent oj.ojThematicMapMarker
 * @ojshortdesc The oj-thematic-map-marker element is used to declare properties for thematic map markers. See the Help documentation for more information.
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojThematicMapMarker<K3=any,D3=any> extends dvtBaseComponent<ojThematicMapMarkerSettableProperties<K3,D3>>",
 *                genericParameters: [{"name": "K3", "description": "Type of key of the markerData dataprovider"},
 *                                    {"name": "D3", "description": "Type of data from the markerData dataprovider"}
 *                ]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojThematicMapMarkerSettableProperties<K3=any,D3=any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @since 5.2.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Thematic Map Marker
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-thematic-map-marker element is used to declare properties for thematic map markers and is only valid as the
 *  child of a template element for the [markerTemplate]{@link oj.ojThematicMap#markerTemplate}
 *  slot of oj-thematic-map.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-thematic-map marker-data='[[markerDataProvider]]' map-provider='[[mapProvider]]'>
 *  &lt;template slot='markerTemplate'>
 *    &lt;oj-thematic-map-marker  color='[[$current.data.color]]' value='[[$current.data.value]]'
 *      x='[[$current.data.lat]]' y='[[$current.data.long]]'>
 *    &lt;/oj-thematic-map-marker>
 *  &lt;/template>
 * &lt;/oj-thematic-map>
 * </code>
 * </pre>
 */

/**
 * The marker border color.
 * @expose
 * @name borderColor
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @ojformat color
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">border-color</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker border-color='3'>&lt;/oj-thematic-map-marker>
 */
/**
 * The marker border style.
 * @expose
 * @name borderStyle
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @ojvalue {string} "solid"
 * @ojvalue {string} "none"
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">border-style</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker border-style='none'>&lt;/oj-thematic-map-marker>
 */
/**
 * The marker border width in pixels.
 * @expose
 * @name borderWidth
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {number=}
 * @ojunits "pixels"
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">border-width</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker border-width='none'>&lt;/oj-thematic-map-marker>
 */
/**
 * An array of category strings corresponding to this marker. This allows highlighting and filtering of markers.
 * By default, the label is used as the marker category.
 * @expose
 * @name categories
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {(Array.<string>)=}
 * @default []
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">categories</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker categories='[[$current.data.categories]]'>&lt;/oj-thematic-map-marker>
 */
/**
 * The marker color. The default values come from the CSS classes and varies based on theme.
 * @expose
 * @name color
 * @ojshortdesc The marker color.
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @ojformat color
 * @default null
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">color</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker color='[[$current.data.color]]'>&lt;/oj-thematic-map-marker>
 */
/**
 * The marker height in pixels. Note that this attribute will be ignored if a value is provided to calculate the marker dimensions.
 * @expose
 * @name height
 * @ojshortdesc The marker height in pixels.
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {number=}
 * @ojunits "pixels"
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">height</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker height='3'>&lt;/oj-thematic-map-marker>
 */
/**
 * Text used for the marker's label.
 * @expose
 * @name label
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">label</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker label='[[$current.data.label]]'>&lt;/oj-thematic-map-marker>
 */
/**
 * Determines the label position relative to the marker.
 * @expose
 * @name labelPosition
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "center"
 * @ojvalue {string} "top"
 * @default "center"
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">label-position</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker label-position='bottom'>&lt;/oj-thematic-map-marker>
 */
/**
 * The CSS style object defining the style of the marker label. The default values come from the CSS classes and varies based on theme.
 * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
 * @expose
 * @name labelStyle
 * @ojshortdesc The CSS style object defining the style of the marker label.
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {object=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
 * @default null
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">label-style</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker label-style='{"color":"black","fontSize":"12px"}'>&lt;/oj-thematic-map-marker>
 */
/**
 * An identifier corresponding to a Feature provided in the mapProvider geo object that this marker is associated with.
 * @expose
 * @name location
 * @ojshortdesc An identifier corresponding to a mapProvider "Feature" geo object that this marker is associated with.
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">location</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker location='[[$current.data.location}}'>&lt;/oj-thematic-map-marker>
 */
/**
 * The marker opacity.
 * @expose
 * @name opacity
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {number=}
 * @ojmin 0
 * @ojmax 1
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">opacity</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker opacity='0.5'>&lt;/oj-thematic-map-marker>
 */
/**
 * The angle in degrees to rotate the marker clockwise around the marker center.
 * @expose
 * @name rotation
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {number=}
 * @ojmin 0
 * @ojmax 360
 * @ojunits degrees
 * @default 0
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">rotation</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker rotation='180'>&lt;/oj-thematic-map-marker>
 */
/**
 * Specifies whether or not the marker will be selectable.
 * @expose
 * @name selectable
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "off"
 * @default "auto"
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">selectable</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker selectable='off'>&lt;/oj-thematic-map-marker>
 */
/**
 * Specifies the shape of a marker. Can take the name of a built-in shape or the SVG path commands for a custom shape.
 * @expose
 * @name shape
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {("circle"|"diamond"|"ellipse"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|string)=}
 * @ojsignature {target: "Type", value: "?"}
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">shape</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker shape='star'>&lt;/oj-thematic-map-marker>
 */
/**
 * The text that displays in the marker's tooltip.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {(string|function)=}
 * @default ""
 * @ojsignature [{target: "Type", value: "?(string | ((context: oj.ojThematicMap.MarkerShortDescContext<K3,D3>) => string))", jsdocOverride: true}]
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">short-desc</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker short-desc='[[$current.data.shortDesc]]'>&lt;/oj-thematic-map-marker>
 */
/**
 * Specifies a URI for the location of the image resource to use for the marker instead of a built-in shape.
 * The shape attribute is ignored if the source image is defined.
 * @expose
 * @name source
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">source</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker source='[[$current.data.source]]'>&lt;/oj-thematic-map-marker>
 */
/**
 * An optional URI for the location of the hover image resource. If not defined, the source image will be used.
 * @expose
 * @name sourceHover
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">source-hover</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker source-hover='[[$current.data.sourceHover]]'>&lt;/oj-thematic-map-marker>
 */
/**
 * An optional URI for the location of the selected image resource on hover. If not defined,
 * then the sourceSelected image will be used. If sourceSelected is not defined, then the source image will be used.
 * @expose
 * @name sourceHoverSelected
 * @ojshortdesc An optional URI for the location of the selected image resource on hover. See the Help documentation for more information.
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">source-hover-selected</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker source-hover-selected='[[$current.data.sourceHoverSelected]]'>&lt;/oj-thematic-map-marker>
 */
/**
 * An optional URI for the location of the selected image. If not defined, the source image will be used.
 * @expose
 * @name sourceSelected
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">source-selected</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker source-selected='[[$current.data.sourceSelected]]'>&lt;/oj-thematic-map-marker>
 */
/**
 * The CSS style class defining the style of the marker.
 * @expose
 * @name svgClassName
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker svg-class-name='markerStyle'>&lt;/oj-thematic-map-marker>
 */
/**
 * The CSS style object defining the style of the marker.
 * Only SVG CSS style properties are supported.
 * @expose
 * @name svgStyle
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {object=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
 * @default {}
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">svg-style</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker svg-style='{"color": "red"}'>&lt;/oj-thematic-map-marker>
 */
/**
 * A data value used to calculate the marker dimensions based on the range of all the data values
 * and the element size. Markers with negative or zero data values will not be rendered. If specified,
 * this value takes precedence over the width and height attributes.
 * @expose
 * @name value
 * @ojshortdesc A data value used to calculate the marker dimensions. See the Help documentation for more information.
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {number=}
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">value</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker value='[[$current.data.value]]'>&lt;/oj-thematic-map-marker>
 */
/**
 * The marker width in pixels. Note that this attribute will be ignored if a value is provided to calculate the marker dimensions.
 * @expose
 * @name width
 * @ojshortdesc The marker width in pixels.
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {number=}
 * @ojunits "pixels"
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">width</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker width='3'>&lt;/oj-thematic-map-marker>
 */
/**
 * The x coordinate of the marker transformed using the map projection, which can be null if location is set instead.
 * @expose
 * @name x
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {(number|null)=}
 * @default null
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">x</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker x='[[$current.data.lat]]'>&lt;/oj-thematic-map-marker>
 */
/**
 * The y coordinate of the marker transformed using the map projection, which can be null if location is set instead.
 * @expose
 * @name y
 * @memberof! oj.ojThematicMapMarker
 * @instance
 * @type {(number|null)=}
 * @default null
 *
 * @example <caption>Initialize the thematic map marker with the
 * <code class="prettyprint">y</code> attribute specified:</caption>
 * &lt;oj-thematic-map-marker y='[[$current.data.long]]'>&lt;/oj-thematic-map-marker>
 */
//-----------------------------------------------------
//                   Styling
//-----------------------------------------------------
/**
 * @ojstylevariableset oj-thematic-map-marker-css-set1
 * @ojstylevariable oj-thematic-map-marker-bg-color {description: "Thematic map marker background color", formats: ["color"], help: "#css-variables"}
 * @ojstylevariable oj-thematic-map-marker-border-color {description: "Thematic map marker border color",formats: ["color"], help: "#css-variables"}
 * @memberof! oj.ojThematicMapMarker
 */
