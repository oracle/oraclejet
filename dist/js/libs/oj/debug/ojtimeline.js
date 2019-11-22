/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojtime-base', 'ojs/internal-deps/dvt/DvtTimeline', 
'ojs/ojattributegrouphandler', 'ojs/ojkeyset', 'ojs/ojconverter-datetime'], 
function (oj, $, comp, base, dvt, attributeGroupHandler, KeySet, __DateTimeConverter)
{
  "use strict";
var __oj_timeline_metadata = 
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
    "data": {
      "type": "object"
    },
    "end": {
      "type": "string",
      "value": ""
    },
    "majorAxis": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object",
          "properties": {
            "default": {
              "type": "object"
            },
            "seconds": {
              "type": "object"
            },
            "minutes": {
              "type": "object"
            },
            "hours": {
              "type": "object"
            },
            "days": {
              "type": "object"
            },
            "weeks": {
              "type": "object"
            },
            "months": {
              "type": "object"
            },
            "quarters": {
              "type": "object"
            },
            "years": {
              "type": "object"
            }
          }
        },
        "scale": {
          "type": "string",
          "enumValues": [
            "days",
            "hours",
            "minutes",
            "months",
            "quarters",
            "seconds",
            "weeks",
            "years"
          ]
        },
        "svgStyle": {
          "type": "object",
          "value": {}
        }
      }
    },
    "minorAxis": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object",
          "properties": {
            "default": {
              "type": "object"
            },
            "seconds": {
              "type": "object"
            },
            "minutes": {
              "type": "object"
            },
            "hours": {
              "type": "object"
            },
            "days": {
              "type": "object"
            },
            "weeks": {
              "type": "object"
            },
            "months": {
              "type": "object"
            },
            "quarters": {
              "type": "object"
            },
            "years": {
              "type": "object"
            }
          }
        },
        "scale": {
          "type": "string",
          "enumValues": [
            "days",
            "hours",
            "minutes",
            "months",
            "quarters",
            "seconds",
            "weeks",
            "years"
          ]
        },
        "svgStyle": {
          "type": "object",
          "value": {}
        },
        "zoomOrder": {
          "type": "Array<string>"
        }
      }
    },
    "orientation": {
      "type": "string",
      "enumValues": [
        "horizontal",
        "vertical"
      ],
      "value": "horizontal"
    },
    "overview": {
      "type": "object",
      "properties": {
        "rendered": {
          "type": "string",
          "enumValues": [
            "off",
            "on"
          ],
          "value": "off"
        },
        "svgStyle": {
          "type": "object",
          "value": {}
        }
      }
    },
    "referenceObjects": {
      "type": "Array<Object>",
      "value": []
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
    "series": {
      "type": "Array<Object>|Promise"
    },
    "start": {
      "type": "string",
      "value": ""
    },
    "styleDefaults": {
      "type": "object",
      "properties": {
        "animationDuration": {
          "type": "number"
        },
        "borderColor": {
          "type": "string"
        },
        "item": {
          "type": "object",
          "value": {},
          "properties": {
            "backgroundColor": {
              "type": "string"
            },
            "borderColor": {
              "type": "string"
            },
            "descriptionStyle": {
              "type": "object"
            },
            "hoverBackgroundColor": {
              "type": "string"
            },
            "hoverBorderColor": {
              "type": "string"
            },
            "selectedBackgroundColor": {
              "type": "string"
            },
            "selectedBorderColor": {
              "type": "string"
            },
            "titleStyle": {
              "type": "object"
            }
          }
        },
        "majorAxis": {
          "type": "object",
          "value": {},
          "properties": {
            "labelStyle": {
              "type": "object"
            },
            "separatorColor": {
              "type": "string"
            }
          }
        },
        "minorAxis": {
          "type": "object",
          "value": {},
          "properties": {
            "backgroundColor": {
              "type": "string"
            },
            "borderColor": {
              "type": "string"
            },
            "labelStyle": {
              "type": "object"
            },
            "separatorColor": {
              "type": "string"
            }
          }
        },
        "overview": {
          "type": "object",
          "properties": {
            "backgroundColor": {
              "type": "string"
            },
            "labelStyle": {
              "type": "object"
            },
            "window": {
              "type": "object",
              "value": {},
              "properties": {
                "backgroundColor": {
                  "type": "string"
                },
                "borderColor": {
                  "type": "string"
                }
              }
            }
          }
        },
        "referenceObject": {
          "type": "object",
          "value": {},
          "properties": {
            "color": {
              "type": "string"
            }
          }
        },
        "series": {
          "type": "object",
          "value": {},
          "properties": {
            "backgroundColor": {
              "type": "string"
            },
            "colors": {
              "type": "Array<string>"
            },
            "emptyTextStyle": {
              "type": "object"
            },
            "labelStyle": {
              "type": "object"
            }
          }
        }
      }
    },
    "tooltip": {
      "type": "object",
      "value": {
        "renderer": null
      },
      "properties": {
        "renderer": {
          "type": "function"
        }
      }
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
        "accessibleItemDesc": {
          "type": "string"
        },
        "accessibleItemEnd": {
          "type": "string"
        },
        "accessibleItemStart": {
          "type": "string"
        },
        "accessibleItemTitle": {
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
        "labelDate": {
          "type": "string"
        },
        "labelDescription": {
          "type": "string"
        },
        "labelEnd": {
          "type": "string"
        },
        "labelInvalidData": {
          "type": "string"
        },
        "labelNoData": {
          "type": "string"
        },
        "labelSeries": {
          "type": "string"
        },
        "labelStart": {
          "type": "string"
        },
        "labelTitle": {
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
        },
        "tooltipZoomIn": {
          "type": "string"
        },
        "tooltipZoomOut": {
          "type": "string"
        }
      }
    },
    "valueFormats": {
      "type": "object",
      "properties": {
        "date": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": [
                "auto",
                "off"
              ],
              "value": "auto"
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "description": {
          "type": "object",
          "properties": {
            "tooltipDisplay": {
              "type": "string",
              "enumValues": [
                "auto",
                "off"
              ],
              "value": "off"
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "end": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": [
                "auto",
                "off"
              ],
              "value": "auto"
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "series": {
          "type": "object",
          "properties": {
            "tooltipDisplay": {
              "type": "string",
              "enumValues": [
                "auto",
                "off"
              ],
              "value": "off"
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "start": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": [
                "auto",
                "off"
              ],
              "value": "auto"
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "title": {
          "type": "object",
          "properties": {
            "tooltipDisplay": {
              "type": "string",
              "enumValues": [
                "auto",
                "off"
              ],
              "value": "off"
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        }
      }
    },
    "viewportEnd": {
      "type": "string",
      "value": ""
    },
    "viewportStart": {
      "type": "string",
      "value": ""
    }
  },
  "methods": {
    "getContextByNode": {},
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojViewportChange": {}
  },
  "extension": {}
};
var __oj_timeline_item_metadata = 
{
  "properties": {
    "description": {
      "type": "string",
      "value": ""
    },
    "durationFillColor": {
      "type": "string"
    },
    "end": {
      "type": "string",
      "value": ""
    },
    "label": {
      "type": "string",
      "value": ""
    },
    "seriesId": {
      "type": "string"
    },
    "shortDesc": {
      "type": "string"
    },
    "start": {
      "type": "string",
      "value": ""
    },
    "svgStyle": {
      "type": "object"
    },
    "thumbnail": {
      "type": "string",
      "value": ""
    }
  },
  "extension": {}
};
var __oj_timeline_series_metadata = 
{
  "properties": {
    "emptyText": {
      "type": "string"
    },
    "itemLayout": {
      "type": "string",
      "enumValues": [
        "auto",
        "bottomToTop",
        "topToBottom"
      ],
      "value": "auto"
    },
    "label": {
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

/* global dvt:false, KeySet:false, attributeGroupHandler:false, __DateTimeConverter:false */

/**
 * @ojcomponent oj.ojTimeline
 * @ojdisplayname Timeline
 * @augments oj.dvtTimeComponent
 * @ojrole application
 * @since 1.1.0
 *
 * @ojshortdesc A timeline is an interactive data visualization that displays a series of events in chronological order.
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
 * @ojtsimport {module: "ojtimeaxis", type: "AMD", imported:["ojTimeAxis"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojTimeline<K, D extends oj.ojTimeline.DataItem|any> extends dvtTimeComponent<ojTimelineSettableProperties<K, D>>"
 *               },
 *               {
 *                target: "Type",
 *                value: "ojTimelineSettableProperties<K, D extends oj.ojTimeline.DataItem|any> extends dvtTimeComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["start", "end", "orientation", "majorAxis.scale", "minorAxis.scale", "minorAxis.zoomOrder", "style"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["data", "selection"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 6
 *
 * @classdesc
 * <h3 id="timelineOverview-section">
 * JET Timeline
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#timelineOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET Timeline is a themable, WAI-ARIA compliant element that displays a set of events in chronological order.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-timeline
 *   start='{{oj.IntlConverterUtils.dateToLocalIso(new Date("Jan 1, 2016"))}}'
 *   end='{{oj.IntlConverterUtils.dateToLocalIso(new Date("Dec 31, 2016"))}}'
 *   major-axis='{"scale": "months"}'
 *   minor-axis='{"scale": "weeks"}'
 *   series='{{seriesData}}'>
 * &lt;/oj-timeline>
 * </code>
 * </pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"a11yDoc"}
 *
 * <h3 id="formats-section">
 *   Date and Time Formats
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#formats-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"formatsDoc"}
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
 * <p>Animation should only be enabled for visualizations of small to medium data sets.</p>
 *
 * <h4>Data Set Size</h4>
 * <p>As a rule of thumb, it's recommended that applications only set usable data
 *    densities on the timeline. For example, applications should limit the number of
 *    overlapping items rendered beyond the height of the timeline. This can be
 *    achieved by increasing the size of the timeline, decreasing the axis scale, or
 *    providing external filters to reduce the amount of data rendered at any given
 *    time. While there are several optimizations within the timeline to deal with
 *    large data sets, it's always more efficient to reduce the data set size as early
 *    as possible. Future optimizations will focus on improving end user experience as
 *    well as developer productivity for common use cases.</p>
 *
 * <h4>Timeline Span</h4>
 *
 * <p>It's recommended that applications limit the number of time intervals that are
 *    rendered by the timeline. For example, a timeline spanning one year with a scale
 *    of hours will display (365 * 24) 8,760 intervals. Rendering this many intervals
 *    can cause severe performance degradation when interacting with the timeline
 *    (scrolling and zooming) regardless of the number of items present.
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojTimeline', $.oj.dvtTimeComponent,
  {
    widgetEventPrefix: 'oj',
    options:
    {
    /**
     * Specifies the animation that is applied on data changes.
     * @expose
     * @name animationOnDataChange
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">animation-on-data-change</code> attribute specified:</caption>
     * &lt;oj-timeline animation-on-data-change='auto'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">animationOnDataChange</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.animationOnDataChange;
     *
     * // setter
     * myTimeline.animationOnDataChange = 'auto';
     */
      animationOnDataChange: 'none',
    /**
     * Specifies the animation that is shown on initial display.
     * @expose
     * @name animationOnDisplay
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">animation-on-display</code> attribute specified:</caption>
     * &lt;oj-timeline animation-on-display='auto'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">animationOnDisplay</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.animationOnDisplay;
     *
     * // setter
     * myTimeline.animationOnDisplay = 'auto';
     */
      animationOnDisplay: 'none',
    /**
     * The oj.DataProvider for the items of the timeline. It should provide data rows where each row maps data for a single timeline item.
     * The row key will be used as the id for timeline items.
     * The oj.DataProvider can either have an arbitrary data shape, in which case a template for the <a href="#itemTemplate">itemTemplate</a> slot must be provided,
     * or it can have <a href="#DataItem">ojTimeline.DataItem</a> as its data shape, in which case no template is required.
     * Providing a template for the <a href="#seriesTemplate">seriesTemplate</a> slot for generating the timeline series properties is optional.
     * @expose
     * @name data
     * @ojshortdesc Specifies the data provider for the timeline. See the Help documentation for more information.
     * @memberof oj.ojTimeline
     * @instance
     * @type {?Object}
     * @ojsignature {target: "Type", value: "?(oj.DataProvider<K, D>)", jsdocOverride:true}
     * @default null
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">data</code> attribute specified:</caption>
     * &lt;oj-timeline data="[[dataProvider]]">
     *   &lt;template slot="seriesTemplate">
     *     &lt;oj-timeline-series
     *       label="[[$current.id]]">
     *     &lt;/oj-timeline-series>
     *   &lt;/template>
     *   &lt;template slot="itemTemplate">
     *     &lt;oj-timeline-item
     *       series-id="[[$current.data.series]]"
     *       start="[[$current.data.start]]"
     *       end="[[$current.data.end]]">
     *     &lt;/oj-timeline-item>
     *   &lt;/template>
     * &lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.data;
     *
     * // setter
     * myTimeline.data = dataProvider;
     */
      data: null,
    /**
     * The end time of the timeline. A valid value is required in order for the timeline to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @ojrequired
     * @name end
     * @ojshortdesc The end time of the timeline. See the Help documentation for more information.
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojformat date-time
     * @default ""
     *
     * @example <caption>Get or set the <code class="prettyprint">end</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.end;
     *
     * // setter
     * myTimeline.end = '2017-12-31T05:00:00.000Z';
     */
      end: '',
    /**
     * An object with the following properties, used to define a timeline axis. This is required in order for the timeline to properly render.
     * @expose
     * @ojrequired
     * @name minorAxis
     * @ojshortdesc An object defining the timeline minor axis.
     * @memberof oj.ojTimeline
     * @instance
     * @type {Object}
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">minor-axis</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-timeline minor-axis.converter="[[myConverterObject]]" minor-axis.scale="weeks" minor-axis.zoom-order='["quarters", "months", "weeks", "days"]'>&lt;/oj-timeline>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-timeline minor-axis='{"scale": "weeks", "zoomOrder": ["quarters", "months", "weeks", "days"]}'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">minorAxis</code> property after initialization:</caption>
     * // Get one
     * var value = myTimeline.minorAxis.scale;
     *
     * // Set one, leaving the others intact.
     * myTimeline.setProperty('minorAxis.scale', 'weeks');
     *
     * // Get all
     * var values = myTimeline.minorAxis;
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myTimeline.minorAxis = {
     *     "converter": myConverterObject,
     *     "scale": "weeks",
     *     "svgStyle": {"backgroundColor": "red"},
     *     "zoomOrder": ["quarters", "months", "weeks", "days"]
     * };
     */
      minorAxis: {
      /**
       * A converter (an instance that duck types {@link oj.Converter}) used to format the labels of the minor axis for all 'scale' values, or
       * an object literal whose keys are 'scale' values that map specific converters for scale specific formatting (see {@link oj.ojTimeAxis.Converters}).
       * See also {@link DateTimeConverter}.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.converter
       * @ojshortdesc An object that converts the labels of the minor axis for all 'scale' values. See the Help documentation for more information.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?(oj.ojTimeAxis.Converters|oj.Converter<string>)", jsdocOverride: true}
       * @default {"default": null, "seconds": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric'}), "days": new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'}), "months": new DateTimeConverter.IntlDateTimeConverter({'month': 'long'}), "quarters": new DateTimeConverter.IntlDateTimeConverter({'month': 'long'}), "years": new DateTimeConverter.IntlDateTimeConverter({'year': 'numeric'})}
       */
        converter: {
          default: null,
          seconds: new __DateTimeConverter.IntlDateTimeConverter({ hour: 'numeric', minute: '2-digit', second: '2-digit' }),
          minutes: new __DateTimeConverter.IntlDateTimeConverter({ hour: 'numeric', minute: '2-digit' }),
          hours: new __DateTimeConverter.IntlDateTimeConverter({ hour: 'numeric' }),
          days: new __DateTimeConverter.IntlDateTimeConverter({ month: 'numeric', day: '2-digit' }),
          weeks: new __DateTimeConverter.IntlDateTimeConverter({ month: 'numeric', day: '2-digit' }),
          months: new __DateTimeConverter.IntlDateTimeConverter({ month: 'long' }),
          quarters: new __DateTimeConverter.IntlDateTimeConverter({ month: 'long' }),
          years: new __DateTimeConverter.IntlDateTimeConverter({ year: 'numeric' })
        },
      /**
       * The time scale used for the minor axis. This is required in order for the timeline to properly render.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @ojrequired
       * @name minorAxis.scale
       * @ojshortdesc Specifies the time scale used for the minor axis.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {?string}
       * @ojvalue {string} "seconds"
       * @ojvalue {string} "minutes"
       * @ojvalue {string} "hours"
       * @ojvalue {string} "days"
       * @ojvalue {string} "weeks"
       * @ojvalue {string} "months"
       * @ojvalue {string} "quarters"
       * @ojvalue {string} "years"
       * @default null
       */
        scale: null,
      /**
       * The CSS style object defining any additional styling of the axis. If not specified, no additional styling will be applied.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.svgStyle
       * @ojshortdesc The CSS style object defining any additional styling of the minor axis.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
       * @default {}
       */
        svgStyle: {},
      /**
       * An array of strings containing the names of scales used for zooming from longest to shortest. If not specified, the 'scale' specified on the axis will be used at all zoom levels.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.zoomOrder
       * @ojshortdesc An array of strings containing the names of scales used for zooming. See the Help documentation for more information.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {?Array.<string>}
       * @ojsignature {target: "Type", value: "?"}
       * @default null
       */
        zoomOrder: null
      },
    /**
     * An object with the following properties, used to define a timeline axis. If not specified, no axis labels will be shown above the minor axis or in the overview.
     * @expose
     * @name majorAxis
     * @ojshortdesc An object defining the optional timeline major axis.
     * @memberof oj.ojTimeline
     * @instance
     * @type {?Object}
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">major-axis</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-timeline major-axis.converter="[[myConverterObject]]" major-axis.scale="months" major-axis.zoom-order='["quarters", "months", "weeks", "days"]'>&lt;/oj-timeline>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-timeline major-axis='{"scale": "months", "zoomOrder": ["quarters", "months", "weeks", "days"]}'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">majorAxis</code> property after initialization:</caption>
     * // Get one
     * var value = myTimeline.majorAxis.scale;
     *
     * // Set one, leaving the others intact.
     * myTimeline.setProperty('majorAxis.scale', 'months');
     *
     * // Get all
     * var values = myTimeline.majorAxis;
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myTimeline.majorAxis = {
     *     "converter": myConverterObject,
     *     "scale": "months"
     * };
     */
      majorAxis: {
      /**
       * A converter (an instance that duck types {@link oj.Converter}) used to format the labels of the major axis for all 'scale' values, or
       * an object literal whose keys are 'scale' values that map specific converters for scale specific formatting (see {@link oj.ojTimeAxis.Converters}).
       * See also {@link DateTimeConverter}.
       * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
       * @expose
       * @name majorAxis.converter
       * @ojshortdesc An object that converts the labels of the major axis for all 'scale' values'. See the Help documentation for more information.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?(oj.ojTimeAxis.Converters|oj.Converter<string>)", jsdocOverride: true}
       * @default {"default": null, "seconds": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric'}), "days": new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'}), "months": new DateTimeConverter.IntlDateTimeConverter({'month': 'long'}), "quarters": new DateTimeConverter.IntlDateTimeConverter({'month': 'long'}), "years": new DateTimeConverter.IntlDateTimeConverter({'year': 'numeric'})}
       */
        converter: {
          default: null,
          seconds: new __DateTimeConverter.IntlDateTimeConverter({ hour: 'numeric', minute: '2-digit', second: '2-digit' }),
          minutes: new __DateTimeConverter.IntlDateTimeConverter({ hour: 'numeric', minute: '2-digit' }),
          hours: new __DateTimeConverter.IntlDateTimeConverter({ hour: 'numeric' }),
          days: new __DateTimeConverter.IntlDateTimeConverter({ month: 'numeric', day: '2-digit' }),
          weeks: new __DateTimeConverter.IntlDateTimeConverter({ month: 'numeric', day: '2-digit' }),
          months: new __DateTimeConverter.IntlDateTimeConverter({ month: 'long' }),
          quarters: new __DateTimeConverter.IntlDateTimeConverter({ month: 'long' }),
          years: new __DateTimeConverter.IntlDateTimeConverter({ year: 'numeric' })
        },
      /**
       * The time scale used for the major axis. If not specified, no axis labels will be shown above the minor axis or in the overview.
       * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
       * @expose
       * @name majorAxis.scale
       * @ojshortdesc Specifies the time scale used for the major axis.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {?string}
       * @ojvalue {string} "seconds"
       * @ojvalue {string} "minutes"
       * @ojvalue {string} "hours"
       * @ojvalue {string} "days"
       * @ojvalue {string} "weeks"
       * @ojvalue {string} "months"
       * @ojvalue {string} "quarters"
       * @ojvalue {string} "years"
       * @default null
       */
        scale: null,
      /**
       * The CSS style object defining any additional styling of the axis. If not specified, no additional styling will be applied.
       * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
       * @expose
       * @name majorAxis.svgStyle
       * @ojshortdesc The CSS style object defining any additional styling of the major axis.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
       * @default {}
       */
        svgStyle: {}
      },
    /**
     * The orientation of the element.
     * @expose
     * @name orientation
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojvalue {string} "vertical"
     * @ojvalue {string} "horizontal"
     * @default "horizontal"
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">orientation</code> attribute specified:</caption>
     * &lt;oj-timeline orientation='vertical'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">orientation</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.orientation;
     *
     * // setter
     * myTimeline.orientation = 'vertical';
     */
      orientation: 'horizontal',
    /**
     * An object with the following properties, used to define a timeline overview. If not specified, no overview will be shown.
     * @expose
     * @name overview
     * @ojshortdesc An object defining the optional timeline overview.
     * @memberof oj.ojTimeline
     * @instance
     * @type {?Object}
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">overview</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-timeline overview.rendered="on" overview.svg-style='{"height":"50px"}'>&lt;/oj-timeline>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-timeline overview='{"rendered": "on", "svgStyle": {"height":"50px"}}'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">majorAxis</code> property after initialization:</caption>
     * // Get one
     * var value = myTimeline.overview.rendered;
     *
     * // Set one, leaving the others intact.
     * myTimeline.setProperty('overview.rendered', 'on');
     *
     * // Get all
     * var values = myTimeline.rendered;
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myTimeline.majorAxis = {
     *     "rendered": "on",
     *     "svgStyle": {"height":"50px"}
     * };
     */
      overview: {
      /**
       * Specifies whether the overview scrollbar is rendered.
       * <br></br>See the <a href="#overview">overview</a> attribute for usage examples.
       * @expose
       * @name overview.rendered
       * @ojshortdesc Specifies whether the overview scrollbar is rendered.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "on"
       * @ojvalue {string} "off"
       * @default "off"
       */
        rendered: 'off',
      /**
       * The CSS style object defining any additional styling of the overview. If not specified, no additional styling will be applied.
       * <br></br>See the <a href="#overview">overview</a> attribute for usage examples.
       * @expose
       * @name overview.svgStyle
       * @ojshortdesc The CSS style object defining any additional styling of the overview.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
       * @default {}
       */
        svgStyle: {}
      },
    /**
     * The array of reference objects associated with the timeline. For each reference object, a line is rendered at the specified value. Currently only the first reference object in the array is supported. Any additional objects supplied in the array will be ignored.
     * @expose
     * @name referenceObjects
     * @ojshortdesc The array of reference objects associated with the timeline. Currently only the first reference object in the array is supported. See the Help documentation for more information.
     * @memberof oj.ojTimeline
     * @instance
     * @type {Array.<Object>}
     * @ojsignature {target: "Type", value: "Array<oj.ojTimeline.ReferenceObject>", jsdocOverride: true}
     * @default []
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">reference-objects</code> attribute specified:</caption>
     * &lt;oj-timeline reference-objects='[{"value": "2017-04-15T04:00:00.000Z"}]'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">referenceObjects</code> property after initialization:</caption>
     * // Get one
     * var value = myTimeline.referenceObjects[0];
     *
     * // Get all
     * var values = myTimeline.referenceObjects;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myTimeline.referenceObjects = [{"value": "2017-04-15T00:00:00.000Z"}];
     */
      referenceObjects: [],
    /**
     * An array of strings containing the ids of the initially selected items.
     * @expose
     * @name selection
     * @memberof oj.ojTimeline
     * @instance
     * @type {Array.<any>}
     * @ojsignature {target:"Type", value:"K[]"}
     * @ojwriteback
     * @default []
     * @ojeventgroup common
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">selection</code> attribute specified:</caption>
     * &lt;oj-timeline selection='["itemID1", "itemID2", "itemID3"]'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">gridlines</code> property after initialization:</caption>
     * // Get one
     * var value = myTimeline.selection[0];
     *
     * // Get all
     * var values = myTimeline.selection;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myTimeline.selection = ["itemID1", "itemID2", "itemID3"];
     */
      selection: [],
    /**
     * <p>The type of selection behavior that is enabled on the Timeline. This attribute controls the number of selections that can be made via selection gestures at any given time.
     *
     * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the Timeline's selection styling will be applied to all items specified by the <a href="#selection">selection</a> attribute.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the Timeline's selection styling will not be applied to any items specified by the <a href="#selection">selection</a> attribute.
     *
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> attribute.
     *
     * @expose
     * @name selectionMode
     * @ojshortdesc Specifies the selection mode.
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojvalue {string} "none" Selection is disabled.
     * @ojvalue {string} "single" Only a single item can be selected at a time.
     * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
     * @default "none"
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">selection-mode</code> attribute specified:</caption>
     * &lt;oj-timeline selection-mode='multiple'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">selectionMode</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.selectionMode;
     *
     * // setter
     * myTimeline.selectionMode = 'multiple';
     */
      selectionMode: 'none',
    /**
     * An array of objects with the following properties, used to define a timeline series. Also accepts a Promise that will resolve with an array for deferred data rendering. No data will be rendered if the Promise is rejected.
     * @expose
     * @ojtsignore
     * @name series
     * @ojshortdesc An array of objects defining each timeline series. Also accepts a Promise for deferred data rendering.
     * @memberof oj.ojTimeline
     * @instance
     * @type {?(Array.<Object>|Promise)}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojTimeline.Series>>|null", SetterType: "Array<oj.ojTimeline.Series>|Promise<Array<oj.ojTimeline.Series>>|null"}, jsdocOverride: true}
     * @default null
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">series</code> attribute specified:</caption>
     * &lt;oj-timeline series='[[mySeries]]'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">series</code> property after initialization:</caption>
     * // Get all (The series getter always returns a Promise so there is no "get one" syntax)
     * var values = myTimeline.series;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myTimeline.series = [
     *     {
     *         "id": "s1",
     *         "emptyText": "No Tournaments Played.",
     *         "label": "Rafael Nadal: 75-7",
     *         "items": [
     *             {
     *                 "id": "e1",
     *                 "title":"ATP VTR Open",
     *                 "start": "2013-02-04",
     *                 "description":"Finalist: 3-1"
     *             },
     *             {
     *                 "id": "e2",
     *                 "title":"ATP Brasil Open",
     *                 "start": "2013-02-11",
     *                 "description":"Champion: 4-0"
     *             }
     *         ]
     *     },
     *     {
     *         "id": "s2",
     *         "emptyText": "No Tournaments Played.",
     *         "label": "Novak Djokovic: 74-9",
     *         "items": [
     *             {
     *                 "id": "e101",
     *                 "title":"AUSTRALIAN OPEN",
     *                 "start": "2013-01-14",
     *                 "description":"Champion: 7-0"
     *             },
     *             {
     *                 "id": "e102",
     *                 "title":"Davis Cup World Group Round 1n",
     *                 "start": "2013-02-01",
     *                 "description":"Results: 1-0"
     *             },
     *             {
     *                 "id": "e103",
     *                 "title":"ATP Dubai Duty Free Tennis Championships",
     *                 "start": "2013-02-25",
     *                 "description":"Champion: 5-0"
     *             }
     *         ]
     *     }
     * ];
     * @ojtsexample <caption>set or get
     * <code class="prettyprint">series</code> property:</caption>
     * let elem = document.getElementById('timeline') as ojTimeline;
     * //set series to Promise. Assuming that getSeries is a method which returns type Promise<Array<ojTimeline.Series>>
     * elem.series = getSeries();
     * //or
     * elem.set('series', getSeries());
     *
     * //set series to an array of ojNBox.Row
     * let series = [
     *     {
     *         "id": "s1",
     *         "emptyText": "No Tournaments Played.",
     *         "label": "Rafael Nadal: 75-7",
     *         "items": [
     *             {
     *                 "id": "e1",
     *                 "title":"ATP VTR Open",
     *                 "start": "2013-02-04",
     *                 "description":"Finalist: 3-1"
     *             },
     *             {
     *                 "id": "e2",
     *                 "title":"ATP Brasil Open",
     *                 "start": "2013-02-11",
     *                 "description":"Champion: 4-0"
     *             }
     *         ]
     *     },
     *     {
     *         "id": "s2",
     *         "emptyText": "No Tournaments Played.",
     *         "label": "Novak Djokovic: 74-9",
     *         "items": [
     *             {
     *                 "id": "e101",
     *                 "title":"AUSTRALIAN OPEN",
     *                 "start": "2013-01-14",
     *                 "description":"Champion: 7-0"
     *             },
     *             {
     *                 "id": "e102",
     *                 "title":"Davis Cup World Group Round 1n",
     *                 "start": "2013-02-01",
     *                 "description":"Results: 1-0"
     *             },
     *             {
     *                 "id": "e103",
     *                 "title":"ATP Dubai Duty Free Tennis Championships",
     *                 "start": "2013-02-25",
     *                 "description":"Champion: 5-0"
     *             }
     *         ]
     *     }
     * ];
     * //elem.series = series; Please note this wont compile. Use the format below
     * elem.set('series', series);
     *
     * //get series property value
     * let seriesVal = elem.series; //This is guaranteed to be of the type Promise<Array<ojNBox.Row>>|null
     *
     * //reset the value of series to its default,
     * elem.unset('series');
     */
      series: null,
    /**
     * The start time of the timeline. A valid value is required in order for the timeline to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @ojrequired
     * @name start
     * @ojshortdesc The start time of the timeline. See the Help documentation for more information.
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojformat date-time
     * @default ""
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">start</code> attribute specified:</caption>
     * &lt;oj-timeline start='2017-01-01T05:00:00.000Z'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">start</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.start;
     *
     * // setter
     * myTimeline.start = "2017-01-01T05:00:00.000Z";
     */
      start: '',
    /**
     * An object with the following properties, used to define default styling for the timeline.
     * Component CSS classes should be used to set component wide styling. This API should be used
     * only for styling a specific instance of the component. Properties specified on this object may
     * be overridden by specifications on the data item. Some property default values come from the CSS
     * and varies based on theme.
     * @expose
     * @name styleDefaults
     * @ojshortdesc An object defining the default styling for this timeline.
     * @memberof oj.ojTimeline
     * @instance
     * @type {Object}
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">style-defaults</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-timeline style-defaults.animation-duration='200'>&lt;/oj-timeline>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-timeline style-defaults='{"animationDuration": 200, "item": {"backgroundColor": "red"}'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">styleDefaults</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myTimeline.styleDefaults.animationDuration;
     *
     * // Get all
     * var values = myTimeline.styleDefaults;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for
     * // subproperties rather than setting a subproperty directly.
     * myTimeline.setProperty('styleDefaults.borderColor', 'red');
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myTimeline.styleDefaults = {'borderColor': 'red'};
     */
      styleDefaults: {
      /**
       * The duration of the animations in milliseconds. The default value comes from the CSS and varies based on theme. For data change animations with multiple stages, this attribute defines the duration of each stage. For example, if an animation contains two stages, the total duration will be two times this attribute's value.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.animationDuration
       * @ojshortdesc The duration of the animations in milliseconds.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {number}
       * @ojsignature {target: "Type", value: "?"}
       * @ojunits "milliseconds"
       */
        animationDuration: undefined,
      /**
       * The border color of the timeline. The default value comes from the CSS and varies based on theme.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.borderColor
       * @ojshortdesc The border color of the timeline.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {string}
       * @ojformat color
       * @ojsignature {target: "Type", value: "?"}
       */
        borderColor: undefined,
      /**
       * An object with the following properties, used to define the default styling for the timeline items.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.item
       * @ojshortdesc An object defining the default styling for this timeline's items.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
        item: {
        /**
         * The background color of the timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.backgroundColor
         * @ojshortdesc The background color of the timeline items.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          backgroundColor: undefined,
        /**
         * The border color of the timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.borderColor
         * @ojshortdesc The border color of the timeline items.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          borderColor: undefined,
        /**
         * The CSS style object defining the style of the timeline item description text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.descriptionStyle
         * @ojshortdesc The CSS style object defining the style of the timeline item description text.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
         */
          descriptionStyle: undefined,
        /**
         * The background color of the highlighted timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.hoverBackgroundColor
         * @ojshortdesc The background color of the highlighted timeline items.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          hoverBackgroundColor: undefined,
        /**
         * The border color of the highlighted timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.hoverBorderColor
         * @ojshortdesc The border color of the highlighted timeline items.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          hoverBorderColor: undefined,
        /**
         * The background color of the selected timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.selectedBackgroundColor
         * @ojshortdesc The background color of the selected timeline items.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          selectedBackgroundColor: undefined,
        /**
         * The border color of the selected timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.selectedBorderColor
         * @ojshortdesc The border color of the selected timeline items.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          selectedBorderColor: undefined,
        /**
         * The CSS style object defining the style of the timeline item title text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.titleStyle
         * @ojshortdesc The CSS style object defining the style of the timeline item title text.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
         */
          titleStyle: undefined
        },
      /**
       * An object with the following properties, used to define the default styling for the time axis.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.minorAxis
       * @ojshortdesc An object defining the default styling for this timeline's minor axis.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
        minorAxis: {
        /**
         * The background color of the time axis. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.minorAxis.backgroundColor
         * @ojshortdesc The background color of the minor axis.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          backgroundColor: undefined,
        /**
         * The border color of the time axis. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.minorAxis.borderColor
         * @ojshortdesc The border color of the minor axis.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          borderColor: undefined,
        /**
         * The CSS style object defining the style of the time axis label text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.minorAxis.labelStyle
         * @ojshortdesc The CSS style object defining the style of the minor axis label text.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
         */
          labelStyle: undefined,
        /**
         * The color of the time axis separators. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.minorAxis.separatorColor
         * @ojshortdesc The color of the minor axis separators.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          separatorColor: undefined
        },

      /**
       * An object with the following properties, used to define the default styling for the major time axis.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.majorAxis
       * @ojshortdesc An object defining the default styling for this timeline's major axis.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
        majorAxis: {
        /**
         * The CSS style object defining the style of the major time axis label text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.majorAxis.labelStyle
         * @ojshortdesc The CSS style object defining the style of the major axis label text.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
         */
          labelStyle: undefined,
        /**
         * The color of the major time axis separators. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.majorAxis.separatorColor
         * @ojshortdesc The color of the major axis separators.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          separatorColor: undefined
        },
      /**
       * An object with the following properties, used to define the default styling for the timeline overview.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.overview
       * @ojshortdesc An object defining the default styling for this timeline's overview.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
        overview: {
        /**
         * The background color of the timeline overview. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.overview.backgroundColor
         * @ojshortdesc The background color of the timeline overview.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          backgroundColor: undefined,
        /**
         * The CSS style object defining the style of the timeline overview label text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.overview.labelStyle
         * @ojshortdesc The CSS style object defining the style of the timeline overview label text.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
         */
          labelStyle: undefined,
        /**
         * An object with the following properties, used to define the default styling for the timeline overview window.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.overview.window
         * @ojshortdesc An object defining the default styling for the timeline overview window.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         * @default {}
         */
          window: {
          /**
           * The background color of the timeline overview window. The default value comes from the CSS and varies based on theme.
           * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
           * @expose
           * @name styleDefaults.overview.window.backgroundColor
           * @ojshortdesc The background color of the timeline overview window.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojformat color
           * @ojsignature {target: "Type", value: "?"}
           */
            backgroundColor: undefined,
          /**
           * The border color of the timeline overview window. The default value comes from the CSS and varies based on theme.
           * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
           * @expose
           * @name styleDefaults.overview.window.borderColor
           * @ojshortdesc The border color of the timeline overview window.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojformat color
           * @ojsignature {target: "Type", value: "?"}
           */
            borderColor: undefined
          }
        },
      /**
       * An object with the following properties, used to define the default styling for the reference objects.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.referenceObject
       * @ojshortdesc An object defining the default styling for this timeline's reference objects.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
        referenceObject: {
        /**
         * The color of the reference objects. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.referenceObject.color
         * @ojshortdesc The color of the reference objects.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          color: undefined
        },
      /**
       * An object with the following properties, used to define the default styling for the timeline series.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.series
       * @ojshortdesc An object defining the default styling for this timeline's series.
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
        series: {
        /**
         * The background color of the series. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.series.backgroundColor
         * @ojshortdesc The background color of the series.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojformat color
         * @ojsignature {target: "Type", value: "?"}
         */
          backgroundColor: undefined,
        /**
         * The array defining the default color ramp for the series items.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.series.colors
         * @ojshortdesc The array defining the default color ramp for the series items.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Array.<string>}
         * @ojsignature {target: "Type", value: "?"}
         */
          colors: [
            '#237bb1', '#68c182', '#fad55c', '#ed6647', '#8561c8', '#6ddbdb',
            '#ffb54d', '#e371b2', '#47bdef', '#a2bf39', '#a75dba', '#f7f37b'
          ],
        /**
         * The CSS style object defining the style of the series empty text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.series.emptyTextStyle
         * @ojshortdesc The CSS style object defining the style of the series empty text.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
         */
          emptyTextStyle: undefined,
        /**
         * The CSS style object defining the style of the series label text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.series.labelStyle
         * @ojshortdesc The CSS style object defining the style of the series label text.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
         */
          labelStyle: undefined
        }
      },
      /**
       * An object containing an optional callback function for tooltip customization.
       * @expose
       * @name tooltip
       * @memberof oj.ojTimeline
       * @instance
       * @type {Object}
       * @default {"renderer": null}
       *
       * @example <caption>Initialize the Timeline with the <code class="prettyprint">tooltip</code> attribute specified:</caption>
       * &lt;oj-timeline tooltip.renderer='[[tooltipFun]]'>&lt;/oj-timeline>
       *
       * &lt;oj-timeline tooltip='[[{"renderer": tooltipFun}]]'>&lt;/oj-timeline>
       *
       * @example <caption>Get or set the <code class="prettyprint">tooltip</code> property after initialization:</caption>
       * // Get one
       * var value = myTimeline.tooltip.renderer;
       *
       * // Set one, leaving the others intact.
       * myTimeline.setProperty('tooltip.renderer', tooltipFun);
       *
       * // Get all
       * var values = myTimeline.tooltip;
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myTimeline.tooltip = {'renderer': tooltipFun};
       */
      tooltip: {
        /**
         * A function that returns a custom tooltip. Note that the default is for a tooltip to be displayed.
         * <br></br>See the <a href="#tooltip">tooltip</a> attribute for usage examples.
         * @expose
         * @name tooltip.renderer
         * @ojshortdesc A function that returns a custom tooltip for the timeline. The function takes a context argument, provided by the timeline. See the Help documentation for more information.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {?(function(Object):Object)}
         * @ojsignature {target: "Type", value: "((context: oj.ojTimeline.TooltipContext<K, D>) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
         * @default null
         */
        renderer: null
      },
      /**
       * An object specifying value formatting and tooltip behavior, whose keys generally correspond to item properties.
       * @expose
       * @name valueFormats
       * @memberof oj.ojTimeline
       * @instance
       * @type {Object}
       *
       * @example <caption>Initialize the Timeline with the <code class="prettyprint">value-formats</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-timeline value-formats.series.tooltip-label="Employee" value-formats.title.tooltip-display="off">&lt;/oj-timeline>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-timeline value-formats='{"series": {"tooltipLabel": "Employee"}, "title": {"tooltipDisplay": "off"}}'>&lt;/oj-timeline>
       *
       * @example <caption>Get or set the <code class="prettyprint">valueFormats</code> property after initialization:</caption>
       * // Get one
       * var value = myTimeline.valueFormats.series.tooltipLabel;
       *
       * // Set one, leaving the others intact
       * myTimeline.setProperty('valueFormats.series.tooltipLabel', 'Employee');
       *
       * // Get all
       * var values = myTimeline.valueFormats;
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myTimeline.valueFormats = {
       *     "series": {"tooltipLabel": "Employee"},
       *     "title": {"tooltipDisplay": "off"}
       * };
       */
      valueFormats: {
        /**
         * Specifies tooltip behavior for the series value.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.series
         * @ojshortdesc Specifies tooltip behavior for the series value.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        series: {
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojTimeline.translations.labelSeries}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.series.tooltipLabel
           * @ojshortdesc A string representing the label that is displayed before the series value in the tooltip. See the Help documentation for more information.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojtranslatable
           */
          tooltipLabel: undefined,
          /**
           * Whether the value is displayed in the tooltip.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.series.tooltipDisplay
           * @ojshortdesc Specifies whether the series value is displayed in the tooltip.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojvalue {string} "off"
           * @ojvalue {string} "auto"
           * @default "off"
           */
          tooltipDisplay: 'off'
        },
        /**
         * Specifies tooltip behavior for the start value.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.start
         * @ojshortdesc Specifies tooltip behavior for the start value.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        start: {
          /**
           * A converter (an instance that duck types {@link oj.Converter}) used to format the label. If not specified, a default converter depending on the axes scale is used. See also {@link DateTimeConverter}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.start.converter
           * @ojshortdesc The converter used to format the label. See the Help documentation for more information.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {?Object}
           * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
           * @default null
           */
          converter: null,
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojTimeline.translations.labelStart}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.start.tooltipLabel
           * @ojshortdesc A string representing the label that is displayed before the start value in the tooltip. See the Help documentation for more information.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojtranslatable
           */
          tooltipLabel: undefined,
          /**
           * Whether the value is displayed in the tooltip.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.start.tooltipDisplay
           * @ojshortdesc Specifies whether the start value is displayed in the tooltip.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojvalue {string} "off"
           * @ojvalue {string} "auto"
           * @default "auto"
           */
          tooltipDisplay: 'auto'
        },
        /**
         * Specifies tooltip behavior for the end value.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.end
         * @ojshortdesc Specifies tooltip behavior for the end value.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        end: {
          /**
           * A converter (an instance that duck types {@link oj.Converter}) used to format the label. If not specified, a default converter depending on the axes scale is used. See also {@link DateTimeConverter}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.end.converter
           * @ojshortdesc The converter used to format the label. See the Help documentation for more information.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {?Object}
           * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
           * @default null
           */
          converter: null,
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojTimeline.translations.labelEnd}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.end.tooltipLabel
           * @ojshortdesc A string representing the label that is displayed before the end value in the tooltip. See the Help documentation for more information.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojtranslatable
           */
          tooltipLabel: undefined,
          /**
           * Whether the value is displayed in the tooltip.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.end.tooltipDisplay
           * @ojshortdesc Specifies whether the end value is displayed in the tooltip.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojvalue {string} "off"
           * @ojvalue {string} "auto"
           * @default "auto"
           */
          tooltipDisplay: 'auto'
        },
        /**
         * Specifies tooltip behavior for the date value of an instance item.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.date
         * @ojshortdesc Specifies tooltip behavior for the date value of an instance item.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        date: {
          /**
           * A converter (an instance that duck types {@link oj.Converter}) used to format the label. If not specified, a default converter depending on the axes scale is used. See also {@link DateTimeConverter}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.date.converter
           * @ojshortdesc The converter used to format the label. See the Help documentation for more information.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {?Object}
           * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
           * @default null
           */
          converter: null,
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojTimeline.translations.labelDate}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.date.tooltipLabel
           * @ojshortdesc A string representing the label that is displayed before the date value in the tooltip. See the Help documentation for more information.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojtranslatable
           */
          tooltipLabel: undefined,
          /**
           * Whether the value is displayed in the tooltip.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.date.tooltipDisplay
           * @ojshortdesc Specifies whether the date value is displayed in the tooltip.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojvalue {string} "off"
           * @ojvalue {string} "auto"
           * @default "auto"
           */
          tooltipDisplay: 'auto'
        },
        /**
         * Specifies tooltip behavior for the title value.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.title
         * @ojshortdesc Specifies tooltip behavior for the title value.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        title: {
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojTimeline.translations.labelTitle}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.title.tooltipLabel
           * @ojshortdesc A string representing the label that is displayed before the title value in the tooltip. See the Help documentation for more information.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojtranslatable
           */
          tooltipLabel: undefined,
          /**
           * Whether the value is displayed in the tooltip.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.title.tooltipDisplay
           * @ojshortdesc Specifies whether the title value is displayed in the tooltip.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojvalue {string} "off"
           * @ojvalue {string} "auto"
           * @default "off"
           */
          tooltipDisplay: 'off'
        },
        /**
         * Specifies tooltip behavior for the description value.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.description
         * @ojshortdesc Specifies tooltip behavior for the description value.
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        description: {
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojTimeline.translations.labelDescription}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.description.tooltipLabel
           * @ojshortdesc A string representing the label that is displayed before the description value in the tooltip. See the Help documentation for more information.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojtranslatable
           */
          tooltipLabel: undefined,
          /**
           * Whether the value is displayed in the tooltip.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.description.tooltipDisplay
           * @ojshortdesc Specifies whether the description value is displayed in the tooltip.
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojvalue {string} "off"
           * @ojvalue {string} "auto"
           * @default "off"
           */
          tooltipDisplay: 'off'
        }
      },
    /**
     * The end time of the timeline's viewport. If not specified or invalid, this will default to a value determined by the initial 'scale' of the minor axis and the width of the timeline. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @name viewportEnd
     * @ojshortdesc The end time of the timeline's viewport. See the Help documentation for more information.
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojformat date-time
     * @default ""
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">viewport-end</code> attribute specified:</caption>
     * &lt;oj-timeline viewport-end='2017-12-31T05:00:00.000Z'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">viewportEnd</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.viewportEnd;
     *
     * // setter
     * myTimeline.viewportEnd = '2017-12-31T05:00:00.000Z';
     */
      viewportEnd: '',
    /**
     * The start time of the timeline's viewport. If not specified or invalid, this will default to a value determined by the initial 'scale' of the minor axis and the width of the timeline. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @name viewportStart
     * @ojshortdesc The start time of the timeline's viewport. See the Help documentation for more information.
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojformat date-time
     * @default ""
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">viewport-start</code> attribute specified:</caption>
     * &lt;oj-timeline viewport-start='2017-01-01T05:00:00.000Z'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">viewportStart</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.viewportStart;
     *
     * // setter
     * myTimeline.viewportStart = '2017-01-01T05:00:00.000Z';
     */
      viewportStart: '',
    /**
     * Triggered after the viewport is changed due to a zoom or scroll operation.
     *
     * @property {string} viewportStart the start of the new viewport on a timeline
     * @property {string} viewportEnd the end of the new viewport on a timeline
     * @property {string} minorAxisScale the time scale of the minor axis
     *
     * @expose
     * @event
     * @memberof oj.ojTimeline
     * @instance
     * @ojbubbles
     */
      viewportChange: null
    },

  // @inheritdoc
    _CreateDvtComponent: function (context, callback, callbackObj) {
      return dvt.Timeline.newInstance(context, callback, callbackObj);
    },

  /**
   * @override
   * @instance
   * @memberof oj.ojTimeline
   * @protected
   */
    _ConvertLocatorToSubId: function (locator) {
      var subId = locator.subId;

      // Convert the supported locators
      if (subId === 'oj-timeline-item') {
        // timelineItem[seriesIndex][itemIndex]
        subId = 'timelineItem[' + locator.seriesIndex + '][' + locator.itemIndex + ']';
      } else if (subId === 'oj-timeline-tooltip') {
        subId = 'tooltip';
      }

      // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
      // support for the old subId syntax in 1.2.0.
      return subId;
    },

  /**
   * @override
   * @instance
   * @memberof oj.ojTimeline
   * @protected
   */
    _ConvertSubIdToLocator: function (subId) {
      var locator = {};

      if (subId.indexOf('timelineItem') === 0) {
        // timelineItem[seriesIndex][itemIndex]
        var indexPath = this._GetIndexPath(subId);

        locator.subId = 'oj-timeline-item';
        locator.seriesIndex = indexPath[0];
        locator.itemIndex = indexPath[1];
      } else if (subId === 'tooltip') {
        locator.subId = 'oj-timeline-tooltip';
      }

      return locator;
    },

  // @inheritdoc
    _ProcessStyles: function () {
      if (!this.options.styleDefaults) {
        this.options.styleDefaults = {};
      }

      if (!this.options.styleDefaults.series) {
        this.options.styleDefaults.series = {};
      }

      if (!this.options.styleDefaults.series.colors) {
        var handler = new attributeGroupHandler.ColorAttributeGroupHandler();

      // override default colors with css attribute group colors
        this.options.styleDefaults.series.colors = handler.getValueRamp();
      }

      this._super();
    },

  // @inheritdoc
    _GetComponentStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses.push('oj-timeline');
      return styleClasses;
    },

  // @inheritdoc
    _GetChildStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses['oj-dvtbase oj-timeline'] =
        { path: 'styleDefaults/animationDuration', property: 'ANIM_DUR' };
      styleClasses['oj-timeline'] =
        { path: 'styleDefaults/borderColor', property: 'border-color' };
      styleClasses['oj-timeline-item'] = [
        { path: 'styleDefaults/item/borderColor', property: 'border-color' },
        { path: 'styleDefaults/item/backgroundColor', property: 'background-color' }
      ];
      styleClasses['oj-timeline-item oj-hover'] = [
        { path: 'styleDefaults/item/hoverBorderColor', property: 'border-color' },
        { path: 'styleDefaults/item/hoverBackgroundColor', property: 'background-color' }
      ];
      styleClasses['oj-timeline-item oj-selected'] = [
        { path: 'styleDefaults/item/selectedBorderColor', property: 'border-color' },
        { path: 'styleDefaults/item/selectedBackgroundColor', property: 'background-color' }
      ];
      styleClasses['oj-timeline-item-description'] =
        { path: 'styleDefaults/item/descriptionStyle', property: 'TEXT' };
      styleClasses['oj-timeline-item-title'] =
        { path: 'styleDefaults/item/titleStyle', property: 'TEXT' };
      styleClasses['oj-timeline-major-axis-label'] =
        { path: 'styleDefaults/majorAxis/labelStyle', property: 'TEXT' };
      styleClasses['oj-timeline-major-axis-separator'] =
        { path: 'styleDefaults/majorAxis/separatorColor', property: 'color' };
      styleClasses['oj-timeline-minor-axis'] = [
        { path: 'styleDefaults/minorAxis/backgroundColor', property: 'background-color' },
        { path: 'styleDefaults/minorAxis/borderColor', property: 'border-color' }
      ];
      styleClasses['oj-timeline-minor-axis-label'] =
        { path: 'styleDefaults/minorAxis/labelStyle', property: 'TEXT' };
      styleClasses['oj-timeline-minor-axis-separator'] =
        { path: 'styleDefaults/minorAxis/separatorColor', property: 'color' };
      styleClasses['oj-timeline-overview'] =
        { path: 'styleDefaults/overview/backgroundColor', property: 'background-color' };
      styleClasses['oj-timeline-overview-label'] =
        { path: 'styleDefaults/overview/labelStyle', property: 'TEXT' };
      styleClasses['oj-timeline-overview-window'] = [
        { path: 'styleDefaults/overview/window/backgroundColor', property: 'background-color' },
        { path: 'styleDefaults/overview/window/borderColor', property: 'border-color' }
      ];
      styleClasses['oj-timeline-reference-object'] =
        { path: 'styleDefaults/referenceObject/color', property: 'color' };
      styleClasses['oj-timeline-series'] =
        { path: 'styleDefaults/series/backgroundColor', property: 'background-color' };
      styleClasses['oj-timeline-series-empty-text'] =
        { path: 'styleDefaults/series/emptyTextStyle', property: 'TEXT' };
      styleClasses['oj-timeline-series-label'] =
        { path: 'styleDefaults/series/labelStyle', property: 'TEXT' };
      styleClasses['oj-timeline-tooltip-label'] =
        { path: 'styleDefaults/tooltipLabelStyle', property: 'TEXT' };

    // Zoom Control Icons
      styleClasses['oj-timeline-zoomin-icon'] = [
        { path: '_resources/zoomIn_bgc', property: 'background-color' },
        { path: '_resources/zoomIn_bc', property: 'border-color' }
      ];
      styleClasses['oj-timeline-zoomin-icon oj-hover'] = [
        { path: '_resources/zoomIn_h_bgc', property: 'background-color' },
        { path: '_resources/zoomIn_h_bc', property: 'border-color' }
      ];
      styleClasses['oj-timeline-zoomin-icon oj-active'] = [
        { path: '_resources/zoomIn_a_bgc', property: 'background-color' },
        { path: '_resources/zoomIn_a_bc', property: 'border-color' }
      ];
      styleClasses['oj-timeline-zoomin-icon oj-disabled'] = [
        { path: '_resources/zoomIn_d_bgc', property: 'background-color' },
        { path: '_resources/zoomIn_d_bc', property: 'border-color' }
      ];
      styleClasses['oj-timeline-zoomout-icon'] = [
        { path: '_resources/zoomOut_bgc', property: 'background-color' },
        { path: '_resources/zoomOut_bc', property: 'border-color' }
      ];
      styleClasses['oj-timeline-zoomout-icon oj-hover'] = [
        { path: '_resources/zoomOut_h_bgc', property: 'background-color' },
        { path: '_resources/zoomOut_h_bc', property: 'border-color' }
      ];
      styleClasses['oj-timeline-zoomout-icon oj-active'] = [
        { path: '_resources/zoomOut_a_bgc', property: 'background-color' },
        { path: '_resources/zoomOut_a_bc', property: 'border-color' }
      ];
      styleClasses['oj-timeline-zoomout-icon oj-disabled'] = [
        { path: '_resources/zoomOut_d_bgc', property: 'background-color' },
        { path: '_resources/zoomOut_d_bc', property: 'border-color' }
      ];

      return styleClasses;
    },

  // @inheritdoc
    _LoadResources: function () {
      this._super();

      var resources = this.options._resources;
      var converter = resources.converter;

      // Create default converters for vertical timeline
      var monthsConverterVert = new __DateTimeConverter.IntlDateTimeConverter({ month: 'short' });
      var yearsConverterVert = new __DateTimeConverter.IntlDateTimeConverter({ year: '2-digit' });

      var converterVert = {
        seconds: converter.seconds,
        minutes: converter.minutes,
        hours: converter.hours,
        days: converter.days,
        weeks: converter.weeks,
        months: monthsConverterVert,
        quarters: monthsConverterVert,
        years: yearsConverterVert
      };

      resources.converterVert = converterVert;

    // Zoom control icons
      resources.zoomIn = 'oj-timeline-zoomin-icon';
      resources.zoomIn_h = 'oj-timeline-zoomin-icon oj-hover';
      resources.zoomIn_a = 'oj-timeline-zoomin-icon oj-active';
      resources.zoomIn_d = 'oj-timeline-zoomin-icon oj-disabled';
      resources.zoomOut = 'oj-timeline-zoomout-icon';
      resources.zoomOut_h = 'oj-timeline-zoomout-icon oj-hover';
      resources.zoomOut_a = 'oj-timeline-zoomout-icon oj-active';
      resources.zoomOut_d = 'oj-timeline-zoomout-icon oj-disabled';

    // Overview icons
      resources.overviewHandleHor = 'oj-timeline-overview-window-handle-horizontal';
      resources.overviewHandleVert = 'oj-timeline-overview-window-handle-vertical';
    },

  // @inheritdoc
    _GetComponentDeferredDataPaths: function () {
      return { root: ['series', 'data'] };
    },

  // @inheritdoc
    _GetSimpleDataProviderConfigs: function () {
      var getAliasedPropertyNames = function (elementName) {
        if (elementName === 'oj-timeline-item') {
          return { label: 'title' };
        }
        return {};
      };

      return {
        data: {
          templateName: 'itemTemplate',
          templateElementName: 'oj-timeline-item',
          resultPath: 'series',
          getAliasedPropertyNames: getAliasedPropertyNames,
          expandedKeySet: new oj.AllKeySetImpl() // if this becomes dynamic see example in ojsunburst
        }
      };
    },

  // @inheritdoc
    _GetDataProviderSeriesConfig: function () {
      return {
        dataProperty: 'data',
        defaultSingleSeries: true,
        idAttribute: 'seriesId',
        itemsKey: 'items',
        templateName: 'seriesTemplate',
        templateElementName: 'oj-timeline-series'
      };
    },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   * @ojsignature {target: "Type", value: "oj.ojTimeline.NodeContext|null", jsdocOverride: true, for: "returns"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojTimeline
   * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
   */
    getContextByNode: function (node) {
      // context objects are documented with @ojnodecontext
      var context = this.getSubIdByNode(node);
      if (context && context.subId !== 'oj-timeline-tooltip') {
        return context;
      }

      return null;
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
 *       <td>Timeline Item</td>
 *       <td>Tap</td>
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
 *       <td rowspan="2">Timeline Panel</td>
 *       <td>Drag</td>
 *       <td>Paning: navigate forward and backward in time in horizontal/vertical orientation.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan>Pinch-Close/Spread-Open</td>
 *       <td>Zoom In/Out.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Zoom Control</td>
 *       <td>Tap on "+" element</td>
 *       <td>Zoom In.</td>
 *     </tr>
 *     <tr>
 *       <td>Tap on "-" element</td>
 *       <td>Zoom Out.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Overview</td>
 *       <td>Press on right/left side of window & Hold & Drag in right of left direction</td>
 *       <td>Zoom In/Out (resize overview window).</td>
 *     </tr>
 *     <tr>
 *       <td>Press & Hold on the body of window & Drag in right of left direction</td>
 *       <td>Pan (move overview window).</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojTimeline
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
 *       <td><kbd>UpArrow</kbd></td>
 *       <td rowspan="2">Moves focus between series in a Dual Timeline and does nothing in a Single Timeline.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus and selection to previous data item (on left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus and selection to next data item (on right).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + UpArrow</kbd></td>
 *       <td>Move focus and multi-select previous data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + DownArrow</kbd></td>
 *       <td>Move focus and multi-select next data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + LeftArrow</kbd></td>
 *       <td>Move focus and multi-select previous data item (on left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + RightArrow</kbd></td>
 *       <td>Move focus and multi-select next data item (on right).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + UpArrow</kbd></td>
 *       <td>Move focus to previous data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + DownArrow</kbd></td>
 *       <td>Move focus to next data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>Move focus to previous data item (on left), without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>Move focus to next data item (on right), without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Spacebar</kbd></td>
 *       <td>Multi-select data item with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>= or +</kbd></td>
 *       <td>Zoom in one level if zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>- or _</kbd></td>
 *       <td>Zoom out one level if zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Pan up if scrolling is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Pan down if scrolling is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageUp</kbd></td>
 *       <td>Pan left in left-to-right locales. Pan right in right-to-left locales.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageDown</kbd></td>
 *       <td>Pan right in left-to-right locales. Pan left in right-to-left locales.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojTimeline
 */

/**
 *<p>The date/time data in the Timeline plays a key role, not only in the representation of events in the order in which they occurred, but also in many other places, such as the time axis, event durations, time markers, size and position calculations for the overview locator window, etc.</p>
 *<p>The Timeline supports a simplified version of the ISO 8601 extended date/time format. The format is as follows: <font color="#4B8A08">YYYY-MM-DDTHH:mm:ss.sssZ</font></p>
 *<table  class="keyboard-table">
 *<thead>
 *<tr>
 *<th>Symbol</th>
 *<th>Description</th>
 *<th>Values</th>
 *<th>Examples</th>
 *</tr>
 </thead>
 <tbody>
 *<tr>
 *<td><font color="#4B8A08">-, :, .,T</font></td><td>Characters actually in the string. T specifies the start of a time.</td><td></td><td></td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">YYYY</font></td><td>Year</td><td></td><td rowspan="3">2013-03-22<br>2014-02</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">MM</font></td><td>Month</td><td>01 to 12</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">DD</font></td><td>Day of the month</td><td>01 to 31</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">HH</font></td><td>Hours</td><td>00 to 24</td><td rowspan="3">2013-02-04T15:20Z<br>2013-02-10T15:20:45.300Z</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">mm</font></td><td>Minutes</td><td>00 to 59</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">ss</font></td><td>Seconds. The seconds and milliseconds are optional if a time is specified.</td><td>00 to 59</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">sss</font></td><td>Milliseconds</td><td>00 to 999</td><td></td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">Z</font></td><td>The value in this position can be one of the following. If the value is omitted, character 'Z' should be used to specify UTC time.<br><ul><li><b>Z</b> indicates UTC time.</li><li><b>+hh:mm</b> indicates that the input time is the specified offset after UTC time.</li><li><b>-hh:mm</b> indicates that the input time is the absolute value of the specified offset before UTC time.</li></ul></td><td></td><td>2013-02-04T15:20:00-07:00<br>2013-02-04T15:20:00+05:00<br>2013-02-04T15:20:00Z</td>
 *</tr>
 *</tbody>
 *</table>
 *<p>The ISO format support short notations where the string must only include the date and not time, as in the following formats: YYYY, YYYY-MM, YYYY-MM-DD.</p>
 *<p>The ISO format does not support time zone names. You can use the Z position to specify an offset from UTC time. If you do not include a value in the Z position, UTC time is used. The correct format for UTC should always include character 'Z' if the offset time value is omitted. The date-parsing algorithms are browser-implementation-dependent and, for example, the date string '2013-02-27T17:00:00' will be parsed differently in Chrome vs Firefox vs IE.</p>
 *<p>You can specify midnight by using 00:00, or by using 24:00 on the previous day. The following two strings specify the same time: 2010-05-25T00:00Z and 2010-05-24T24:00Z.</p>
 *
 * @ojfragment formatsDoc
 * @memberof oj.ojTimeline
 */

/**
 *<p>The application is responsible for populating the shortDesc value in the component options object with meaningful descriptors when the component does not provide a default descriptor. Since component terminology for keyboard and touch shortcuts can conflict with those of the application, it is the application's responsibility to provide these shortcuts, possibly via a help popup.</p>
 *
 * @ojfragment a11yDoc
 * @memberof oj.ojTimeline
 */

// PROPERTY TYPEDEFS

/**
 * @typedef {Object} oj.ojTimeline.ReferenceObject
 * @property {string=} value The time value of this reference object. If not specified, no reference object will be shown. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
 */
/**
 * @typedef {Object} oj.ojTimeline.Series
 * @ojimportmembers oj.ojTimelineSeriesProperties
 * @property {string} id The identifier for the timeline series.
 * @property {Array.<Object>} [items] An array of items. If not specified, no data will be shown in this series.
 * @ojsignature [{target: "Type", value: "Array<oj.ojTimeline.SeriesItem<K>>", for: "items", jsdocOverride:true},
 *               {target: "Type", value: "<K>", for:"genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojTimeline.SeriesItem
 * @ojimportmembers oj.ojTimelineItemProperties
 * @property {any} id The identifier for the timeline item. This must be unique across all items in the timeline, and is required in order for the timeline to properly render.
 * @property {string=} title The title text displayed on the timeline item. If not specified, no title will be shown.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "<K>", for:"genericTypeParameters"}]
 */
/**
 * Object type that defines a timeline data item for the no template case.
 * @typedef {Object} oj.ojTimeline.DataItem
 * @ojimportmembers oj.ojTimelineItemProperties
 * @property {string} seriesId The id for the row the task belongs to.
 * @property {string=} title The title text displayed on the timeline item. If not specified, no title will be shown.
 */
/**
 * @typedef {Object} oj.ojTimeline.TooltipContext
 * @property {Element} parentElement The tooltip element. This can be used to change the tooltip border or background color.
 * @property {oj.ojTimeline.SeriesItem} data The data object of the hovered item.
 * @property {oj.ojTimeline.Series} seriesData The data for the series the hovered item belongs to.
 * @property {Object|null} itemData The data provider row data object for the hovered item. This will only be set if an oj.DataProvider for <a href="#data">data</a> is being used.
 * @property {Element} componentElement The timeline element.
 * @property {string} color The color of the hovered item.
 * @ojsignature [{target: "Type", value: "oj.ojTimeline.SeriesItem<K>", for: "data"},
 *               {target: "Type", value: "oj.ojTimeline.Series<K>", for: "seriesData"},
 *               {target: "Type", value: "D", for: "itemData"},
 *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojTimeline.SeriesTemplateContext
 * @property {Element} componentElement The &lt;oj-timeline> custom element
 * @property {number} index The series index
 * @property {any} id The series id
 * @property {Array<Object>} items The array of objects which are timeline items that belong to this series. The objects will have the following properties
 * @property {Object} items.data The data object for the item
 * @property {number} items.index The zero-based index of the item
 * @property {any} items.key The key of the item
 */
/**
 * @typedef {Object} oj.ojTimeline.ItemTemplateContext
 * @property {Element} componentElement The &lt;oj-timeline> custom element
 * @property {Object} data The data object for the current item
 * @property {number} index The zero-based index of the current item
 * @property {any} key The key of the current item
 */

// Slots

/**
 * <p>The <code class="prettyprint">seriesTemplate</code> slot is used to specify the template for generating the series properties of the timeline. The slot content must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-timeline-series> element.See the [oj-timeline-series]{@link oj.ojTimelineSeries} doc for more details.
 * See also the <a href="#itemTemplate">itemTemplate</a> regarding showing empty series. Note that the series will render following the order in which they are found in the data.</p>
 * <p>When the template is executed for each series, it will have access to the timeline's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current series. (See [oj.ojTimeline.SeriesTemplateContext]{@link oj.ojTimeline.SeriesTemplateContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 * @ojslot seriesTemplate
 * @ojshortdesc The seriesTemplate slot is used to specify the template for generating the series properties of the timeline. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojTimeline
 * @ojslotitemprops oj.ojTimeline.SeriesTemplateContext
 * @example <caption>Initialize the Timeline with an inline series template specified:</caption>
 * &lt;oj-timeline data="[[dataProvider]]">
 *   &lt;template slot="seriesTemplate">
 *     &lt;oj-timeline-series
 *       label="[[$current.items[0].data.series]]">
 *     &lt;/oj-timeline-series>
 *   &lt;/template>
 * &lt;/oj-timeline>
 */

/**
 * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for creating each item of the timeline. The slot content must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-timeline-item> element. The reference data provider is that of the <a href="#data">data</a> attribute.
 * See the [oj-timeline-item]{@link oj.ojTimelineItem} doc for more details.
 * The [series-id]{@link oj.ojTimelineItem#seriesId} is optional if there is only one series; otherwise it must be specified.
 * Note that if an invalid value for item start is specified, then the item is not rendered; if all the items belonging to a series are not rendered, the series will appear as an empty series.</p>
 * <p>When the template is executed for each item, it will have access to the timeline's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current item. (See [oj.ojTimeline.ItemTemplateContext]{@link oj.ojTimeline.ItemTemplateContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 * @ojslot itemTemplate
 * @ojshortdesc The itemTemplate slot is used to specify the template for creating each item of the timeline. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojTimeline
 * @ojslotitemprops oj.ojTimeline.ItemTemplateContext
 * @example <caption>Initialize the Timeline with an inline item template specified:</caption>
 * &lt;oj-timeline data="[[dataProvider]]">
 *   &lt;template slot="itemTemplate">
 *     &lt;oj-timeline-item
 *       series-id="[[$current.data.series]]"
 *       start="[[$current.data.start]]"
 *       end="[[$current.data.end]]">
 *     &lt;/oj-timeline-item>
 *   &lt;/template>
 * &lt;/oj-timeline>
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current item. (See [oj.ojTimeline.TooltipContext]{@link oj.ojTimeline.TooltipContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 * @ojslotitemprops oj.ojTimeline.TooltipContext
 * @memberof oj.ojTimeline
 *
 * @example <caption>Initialize the Timeline with a tooltip template specified:</caption>
 * &lt;oj-timeline>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span>&lt;oj-bind-text value="[[$current.data.title]]">&lt;/oj-bind-text>&lt;/span>
 *    &lt;span>&lt;oj-bind-text value="[[$current.data.start + '-' $current.data.end]]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-timeline>
 */
// METHOD TYPEDEFS

/**
 * @typedef {Object} oj.ojTimeline.NodeContext
 * @property {string} subId The subId string to identify the particular DOM node.
 * @property {number} seriesIndex The zero based index of the timeline series.
 * @property {number} itemIndex The zero based index of the timeline series item.
 */

// KEEP FOR WIDGET SYNTAX

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for timeline series items indexed by series and item indices.</p>
 *
 * @property {number} seriesIndex
 * @property {number} itemIndex
 *
 * @ojsubid oj-timeline-item
 * @memberof oj.ojTimeline
 *
 * @example <caption>Gets the second item from the first series:</caption>
 * var node = myComponent.getNodeBySubId({'subId': 'oj-timeline-item', 'seriesIndex': 0, 'itemIndex': 1});
 */

/**
 * <p>Sub-ID for the the Timeline tooltip.</p>
 *
 * @ojsubid oj-timeline-tooltip
 * @memberof oj.ojTimeline
 *
 * @example <caption>Get the tooltip object of the timeline, if displayed:</caption>
 * var nodes = myTimeline.getNodeBySubId({'subId': 'oj-timeline-tooltip'});
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for timeline series items indexed by series and item indices.</p>
 *
 * @property {number} seriesIndex
 * @property {number} itemIndex
 *
 * @ojnodecontext oj-timeline-item
 * @memberof oj.ojTimeline
 */


/**
 * @ojcomponent oj.ojTimelineItem
 * @ojimportmembers oj.ojTimelineItemProperties
 * @ojsignature {target: "Type", value:"class ojTimelineItem extends JetElement<ojTimelineItemSettableProperties>"}
 * @ojslotcomponent
 * @since 7.0.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Timeline Item
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-timeline-item element is used to declare properties for timeline items and is only valid as the
 *  child of a template element for the [itemTemplate]{@link oj.ojTimeline#itemTemplate} slot of oj-timeline.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-timeline data="[[dataProvider]]">
 *   &lt;template slot="itemTemplate">
 *     &lt;oj-timeline-item
 *       series-id="[[$current.data.series]]"
 *       start="[[$current.data.start]]"
 *       end="[[$current.data.end]]">
 *     &lt;/oj-timeline-item>
 *   &lt;/template>
 * &lt;/oj-timeline>
 * </code>
 * </pre>
 */

/**
 * The id for the series the item belongs to. If no id is specified, the item will be added to the default series.
 * @expose
 * @name seriesId
 * @memberof! oj.ojTimelineItem
 * @instance
 * @type {string}
 *
 * @example <caption>Initialize the timeline item with the
 * <code class="prettyprint">series-id</code> attribute specified:</caption>
 * &lt;oj-timeline-item series-id="[[$current.data.series]]">&lt;/oj-timeline-item>
 */
/**
 * The label text displayed on the timeline item. If not specified, no label will be shown.
 * @expose
 * @name label
 * @memberof! oj.ojTimelineItem
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the timeline item with the
 * <code class="prettyprint">label</code> attribute specified:</caption>
 * &lt;oj-timeline-item label="[[$current.data.label]]">&lt;/oj-timeline-item>
 */


/**
 * @ojcomponent oj.ojTimelineSeries
 * @ojimportmembers oj.ojTimelineSeriesProperties
 * @ojsignature {target: "Type", value:"class ojTimelineSeries extends JetElement<ojTimelineSeriesSettableProperties>"}
 * @ojslotcomponent
 * @since 7.0.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Timeline Series
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-timeline-series element is used to declare properties for timeline series and is only valid as the
 *  child of a template element for the [seriesTemplate]{@link oj.ojTimeline#seriesTemplate} slot of oj-timeline.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-timeline data="[[dataProvider]]">
 *   &lt;template slot="seriesTemplate">
 *     &lt;oj-timeline-series
 *       label="[[$current.items[0].data.series]]">
 *     &lt;/oj-timeline-series>
 *   &lt;/template>
 * &lt;/oj-timeline>
 * </code>
 * </pre>
 */


/* global __oj_timeline_metadata:false */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
  __oj_timeline_metadata.extension._WIDGET_NAME = 'ojTimeline';
  oj.CustomElementBridge.register('oj-timeline', { metadata: __oj_timeline_metadata });
}());

/* global __oj_timeline_item_metadata:false */
(function () {
  __oj_timeline_item_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-timeline-item', {
    metadata: __oj_timeline_item_metadata
  });
}());

/* global __oj_timeline_series_metadata:false */
(function () {
  __oj_timeline_series_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-timeline-series', {
    metadata: __oj_timeline_series_metadata
  });
}());

});