/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojtime-base', 'ojs/internal-deps/dvt/DvtGantt', 'ojs/ojkeyset', 'ojs/ojvalidation-base'], 
  function(oj, $, comp, base, dvt, KeySet, __ValidationBase)
{

var __oj_gantt_metadata = 
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
    "axisPosition": {
      "type": "string",
      "enumValues": [
        "bottom",
        "top"
      ],
      "value": "top"
    },
    "dependencies": {
      "type": "Array<Object>|Promise"
    },
    "dependencyData": {
      "type": "oj.DataProvider"
    },
    "dnd": {
      "type": "object",
      "properties": {
        "move": {
          "type": "object",
          "properties": {
            "tasks": {
              "type": "string",
              "enumValues": [
                "disabled",
                "enabled"
              ],
              "value": "disabled"
            }
          }
        }
      }
    },
    "end": {
      "type": "string",
      "value": ""
    },
    "gridlines": {
      "type": "object",
      "properties": {
        "horizontal": {
          "type": "string",
          "enumValues": [
            "auto",
            "hidden",
            "visible"
          ],
          "value": "auto"
        },
        "vertical": {
          "type": "string",
          "enumValues": [
            "auto",
            "hidden",
            "visible"
          ],
          "value": "auto"
        }
      }
    },
    "majorAxis": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object",
          "value": "{\"default\": null, \"seconds\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), \"minutes\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}), \"hours\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}), \"days\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), \"weeks\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), \"months\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), \"quarters\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), \"years\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})}",
          "properties": {
            "default": {
              "type": "oj.Converter<string>"
            },
            "seconds": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour: numeric, minute: 2-digit, second: 2-digit})"
            },
            "minutes": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour: numeric, minute: 2-digit})"
            },
            "hours": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour: numeric})"
            },
            "days": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: numeric, day: 2-digit})"
            },
            "weeks": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: numeric, day: 2-digit})"
            },
            "months": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: long})"
            },
            "quarters": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: long})"
            },
            "years": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({year: numeric})"
            }
          }
        },
        "height": {
          "type": "number"
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
        "zoomOrder": {
          "type": "Array<string>"
        }
      }
    },
    "minorAxis": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object",
          "value": "{\"default\": null, \"seconds\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), \"minutes\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}), \"hours\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}), \"days\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), \"weeks\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), \"months\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), \"quarters\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), \"years\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})}",
          "properties": {
            "default": {
              "type": "oj.Converter<string>"
            },
            "seconds": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour: numeric, minute: 2-digit, second: 2-digit})"
            },
            "minutes": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour: numeric, minute: 2-digit})"
            },
            "hours": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour: numeric})"
            },
            "days": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: numeric, day: 2-digit})"
            },
            "weeks": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: numeric, day: 2-digit})"
            },
            "months": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: long})"
            },
            "quarters": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: long})"
            },
            "years": {
              "type": "oj.Converter<string>",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({year: numeric})"
            }
          }
        },
        "height": {
          "type": "number"
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
        "zoomOrder": {
          "type": "Array<string>"
        }
      }
    },
    "referenceObjects": {
      "type": "Array<Object>",
      "value": []
    },
    "rowAxis": {
      "type": "object",
      "properties": {
        "label": {
          "type": "object",
          "properties": {
            "renderer": {
              "type": "function",
              "properties": {
                "parentElement": {
                  "type": "Element"
                },
                "rowData": {
                  "type": "oj.ojGantt.Row"
                },
                "itemData": {
                  "type": "Array<Object>"
                },
                "componentElement": {
                  "type": "Element"
                },
                "maxWidth": {
                  "type": "number"
                },
                "maxHeight": {
                  "type": "number"
                }
              }
            }
          }
        },
        "maxWidth": {
          "type": "string",
          "value": "none"
        },
        "rendered": {
          "type": "string",
          "enumValues": [
            "off",
            "on"
          ],
          "value": "off"
        },
        "width": {
          "type": "string",
          "value": "max-content"
        }
      }
    },
    "rowDefaults": {
      "type": "object",
      "properties": {
        "height": {
          "type": "number"
        }
      }
    },
    "rows": {
      "type": "Array<Object>|Promise"
    },
    "scrollPosition": {
      "type": "object",
      "writeback": true,
      "value": {
        "y": 0
      },
      "properties": {
        "offsetY": {
          "type": "number"
        },
        "rowIndex": {
          "type": "number"
        },
        "y": {
          "type": "number",
          "value": 0
        }
      }
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
    "start": {
      "type": "string",
      "value": ""
    },
    "taskData": {
      "type": "oj.DataProvider"
    },
    "taskDefaults": {
      "type": "object",
      "properties": {
        "baseline": {
          "type": "object",
          "properties": {
            "borderRadius": {
              "type": "string",
              "value": "0"
            },
            "height": {
              "type": "number"
            },
            "svgClassName": {
              "type": "string",
              "value": ""
            },
            "svgStyle": {
              "type": "object",
              "value": {}
            }
          }
        },
        "borderRadius": {
          "type": "string",
          "value": "0"
        },
        "height": {
          "type": "number"
        },
        "labelPosition": {
          "type": "string|Array<string>",
          "enumValues": [
            "end",
            "innerCenter",
            "innerEnd",
            "innerStart",
            "none",
            "start"
          ],
          "value": [
            "end",
            "innerCenter",
            "start",
            "max"
          ]
        },
        "progress": {
          "type": "object",
          "properties": {
            "borderRadius": {
              "type": "string",
              "value": "0"
            },
            "height": {
              "type": "string",
              "value": "100%"
            },
            "svgClassName": {
              "type": "string",
              "value": ""
            },
            "svgStyle": {
              "type": "object",
              "value": {}
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
        "type": {
          "type": "string",
          "enumValues": [
            "auto",
            "milestone",
            "normal",
            "summary"
          ],
          "value": "auto"
        }
      }
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function",
          "properties": {
            "parentElement": {
              "type": "Element"
            },
            "data": {
              "type": "oj.ojGantt.RowTask"
            },
            "rowData": {
              "type": "oj.ojGantt.Row"
            },
            "itemData": {
              "type": "object"
            },
            "componentElement": {
              "type": "Element"
            },
            "color": {
              "type": "string"
            }
          }
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
        "accessibleDependencyInfo": {
          "type": "string"
        },
        "accessiblePredecessorInfo": {
          "type": "string"
        },
        "accessibleSuccessorInfo": {
          "type": "string"
        },
        "accessibleTaskTypeMilestone": {
          "type": "string"
        },
        "accessibleTaskTypeSummary": {
          "type": "string"
        },
        "componentName": {
          "type": "string"
        },
        "finishFinishDependencyAriaDesc": {
          "type": "string"
        },
        "finishStartDependencyAriaDesc": {
          "type": "string"
        },
        "labelAndValue": {
          "type": "string"
        },
        "labelBaselineDate": {
          "type": "string"
        },
        "labelBaselineEnd": {
          "type": "string"
        },
        "labelBaselineStart": {
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
        "labelEnd": {
          "type": "string"
        },
        "labelInvalidData": {
          "type": "string"
        },
        "labelLabel": {
          "type": "string"
        },
        "labelMoveBy": {
          "type": "string"
        },
        "labelNoData": {
          "type": "string"
        },
        "labelProgress": {
          "type": "string"
        },
        "labelRow": {
          "type": "string"
        },
        "labelStart": {
          "type": "string"
        },
        "startFinishDependencyAriaDesc": {
          "type": "string"
        },
        "startStartDependencyAriaDesc": {
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
        "taskMoveCancelled": {
          "type": "string"
        },
        "taskMoveFinalized": {
          "type": "string"
        },
        "taskMoveInitiated": {
          "type": "string"
        },
        "taskMoveInitiatedInstruction": {
          "type": "string"
        },
        "taskMoveSelectionInfo": {
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
        "baselineDate": {
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
        "baselineEnd": {
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
        "baselineStart": {
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
        "label": {
          "type": "object",
          "properties": {
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
        "progress": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object",
              "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER).createConverter({style: 'percent'})"
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
        "row": {
          "type": "object",
          "properties": {
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
    "ojViewportChange": {},
    "ojMove": {}
  },
  "extension": {}
};
var __oj_gantt_dependency_metadata = 
{
  "properties": {
    "predecessorTaskId": {
      "type": "any"
    },
    "shortDesc": {
      "type": "string"
    },
    "successorTaskId": {
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
    "type": {
      "type": "string",
      "enumValues": [
        "finishFinish",
        "finishStart",
        "startFinish",
        "startStart"
      ],
      "value": "finishStart"
    }
  },
  "extension": {}
};
var __oj_gantt_row_metadata = 
{
  "properties": {
    "label": {
      "type": "string",
      "value": ""
    },
    "labelStyle": {
      "type": "object",
      "value": {}
    }
  },
  "extension": {}
};
var __oj_gantt_task_metadata = 
{
  "properties": {
    "baseline": {
      "type": "object",
      "properties": {
        "borderRadius": {
          "type": "string"
        },
        "end": {
          "type": "string",
          "value": ""
        },
        "height": {
          "type": "number"
        },
        "start": {
          "type": "string",
          "value": ""
        },
        "svgClassName": {
          "type": "string"
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "borderRadius": {
      "type": "string"
    },
    "end": {
      "type": "string",
      "value": ""
    },
    "height": {
      "type": "number"
    },
    "label": {
      "type": "string",
      "value": ""
    },
    "labelPosition": {
      "type": "string|Array<string>",
      "enumValues": [
        "end",
        "innerCenter",
        "innerEnd",
        "innerStart",
        "none",
        "start"
      ]
    },
    "labelStyle": {
      "type": "object",
      "value": {}
    },
    "progress": {
      "type": "object",
      "properties": {
        "borderRadius": {
          "type": "string"
        },
        "height": {
          "type": "string"
        },
        "svgClassName": {
          "type": "string"
        },
        "svgStyle": {
          "type": "object"
        },
        "value": {
          "type": "number"
        }
      }
    },
    "rowId": {
      "type": "any"
    },
    "shortDesc": {
      "type": "string"
    },
    "start": {
      "type": "string",
      "value": ""
    },
    "svgClassName": {
      "type": "string"
    },
    "svgStyle": {
      "type": "object"
    },
    "type": {
      "type": "string",
      "enumValues": [
        "auto",
        "milestone",
        "normal",
        "summary"
      ]
    }
  },
  "extension": {}
};
/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global dvt:false, KeySet:false, __ValidationBase:false */

/**
 * @ojcomponent oj.ojGantt
 * @augments oj.dvtTimeComponent
 * @since 2.1.0
 * @ojstatus preview
 * @ojrole application
 * @ojshortdesc Displays scheduling information graphically, making it easier to plan, coordinate, and track various tasks and resources.
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojtsimport {module: "ojvalidation-base", type: "AMD", imported:["Converter"]}
 * @ojtsimport {module: "ojtimeaxis", type: "AMD", imported:["ojTimeAxis"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojGantt<K1, K2, D1, D2> extends dvtTimeComponent<ojGanttSettableProperties<K1, K2, D1, D2>>",
 *                genericParameters: [{"name": "K1", "description": "Type of key of the dependencyData dataprovider"}, {"name": "K2", "description": "Type of key of the taskData dataprovider"},
 *                 {"name": "D1", "description": "Type of data from the dependencyData dataprovider"}, {"name": "D2", "description": "Type of data from the taskData dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojGanttSettableProperties<K1, K2, D1, D2> extends dvtTimeComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @classdesc
 * <h3 id="GanttOverview-section">
 *   JET Gantt
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#GanttOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET Gantt is a themable, WAI-ARIA compliant element that illustrates the start and finish dates of tasks.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-gantt
 *   start='2017-01-01T05:00:00.000Z'
 *   end='2017-12-31T05:00:00.000Z'
 *   major-axis='{"scale": "months"}'
 *   minor-axis='{"scale": "weeks"}'
 *   rows='[[data]]'>
 * &lt;/oj-gantt>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"a11yKeyboard"}
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
 * <p>As a rule of thumb, it's recommended that applications limit the amount of data to display.
 *    It's important to note, that the gantt tries to limit rendering to only rows that are
 *    visible on the screen at any given time, but entire rows are still rendered,
 *    so limiting the number of tasks per row would tend to yield more performance gains than
 *    limiting the number of gantt rows in the dataset. Applications can, for example, use a filter
 *    to only show tasks for a specific set of time ranges.</p>
 *
 * <h4>Gantt Span</h4>
 *
 * <p>It's recommended that applications limit the number of time intervals that are
 *    rendered by the Gantt chart. For example, a Gantt chart spanning one year with a scale
 *    of hours will display (365 * 24) 8,760 intervals. Rendering this many intervals
 *    can cause severe performance degradation when interacting with the element
 *    (scrolling and zooming) regardless of the number of task bars present.
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojGantt', $.oj.dvtTimeComponent,
  {
    widgetEventPrefix: 'oj',
    options:
    {
      /**
       * The position of the major and minor axis.
       * @expose
       * @name axisPosition
       * @memberof oj.ojGantt
       * @instance
       * @type {string}
       * @ojvalue {string} "bottom"
       * @ojvalue {string} "top"
       * @default "top"
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">axis-position</code> attribute specified:</caption>
       * &lt;oj-gantt axis-position='bottom'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">axisPosition</code> property after initialization:</caption>
       * // getter
       * var value = myGantt.axisPosition;
       *
       * // setter
       * myGantt.axisPosition = 'bottom';
       */
      axisPosition: 'top',
      /**
       * Defines the animation that is applied on data changes.
       * @expose
       * @name animationOnDataChange
       * @memberof oj.ojGantt
       * @instance
       * @type {string}
       * @ojvalue {string} "auto"
       * @ojvalue {string} "none"
       * @default "none"
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">animation-on-data-change</code> attribute specified:</caption>
       * &lt;oj-gantt animation-on-data-change='auto'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">animationOnDataChange</code> property after initialization:</caption>
       * // getter
       * var value = myGantt.animationOnDataChange;
       *
       * // setter
       * myGantt.animationOnDataChange = 'auto';
       */
      animationOnDataChange: 'none',
      /**
       * Defines the animation that is shown on initial display.
       * @expose
       * @name animationOnDisplay
       * @memberof oj.ojGantt
       * @instance
       * @type {string}
       * @ojvalue {string} "auto"
       * @ojvalue {string} "none"
       * @default "none"
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">animation-on-display</code> attribute specified:</caption>
       * &lt;oj-gantt animation-on-display='auto'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">animationOnDisplay</code> property after initialization:</caption>
       * // getter
       * var value = myGantt.animationOnDisplay;
       *
       * // setter
       * myGantt.animationOnDisplay = 'auto';
       */
      animationOnDisplay: 'none',
      /**
       * An alias for the $current context variable passed to slot content for the
       * <a href="#dependencyTemplate">dependencyTemplate</a>, <a href="#taskTemplate">taskTemplate</a>, or <a href="#rowTemplate">rowTemplate</a> slots.
       * @expose
       * @name as
       * @memberof oj.ojGantt
       * @instance
       * @type {string}
       * @default ""
       * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">as</code> attribute specified:</caption>
       * &lt;oj-gantt as="item">
       *   &lt;template slot="dependencyTemplate">
       *     &lt;oj-gantt-dependency
       *       predecessor-task-id="[[item.data.predecessor]]"
       *       successor-task-id="[[item.data.successor]]">
       *     &lt;/oj-gantt-dependency>
       *   &lt;/template>
       * &lt;/oj-gantt>
       */
      as: '',
      /**
       * An array of objects that defines dependencies between tasks. Also accepts a Promise that will resolve with an array for deferred data rendering. No data will be rendered if the Promise is rejected.
       * @expose
       * @ojtsignore
       * @name dependencies
       * @memberof oj.ojGantt
       * @instance
       * @type {?(Array.<Object>|Promise)}
       * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojGantt.Dependency<K1, K2>>>|null",
       *                                           SetterType: "Array<oj.ojGantt.Dependency<K1, K2>>|Promise<Array<oj.ojGantt.Dependency<K1, K2>>>|null"},
       *                                           jsdocOverride: true}
       * @default null
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">dependencies</code> attribute specified:</caption>
       * &lt;oj-gantt dependencies='[[myDependencies]]'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">dependencies</code> property after initialization:</caption>
       * // Get all (The dependencies getter always returns a Promise so there is no "get one" syntax)
       * var values = myGantt.dependencies;
       *
       * // Set all (There is no permissible "set one" syntax.)
       * myGantt.dependencies = [
       *     {
       *         "id": "d1",
       *         "predecessorTaskId": "task1",
       *         "successorTaskId": "task2",
       *         "svgStyle": {"stroke": "red"},
       *         "type": "startFinish"
       *     },
       *     {
       *         "id": "d2",
       *         "predecessorTaskId": "task2",
       *         "successorTaskId": "task3"
       *     }
       * ];
       */
      dependencies: null,
      /**
       * The oj.DataProvider for the dependencies of the gantt. It should provide data rows where each row maps data for a single gantt dependency line.
       * The row key will be used as the id for dependency lines.
       * Note that when using this attribute, a template for the <a href="#dependencyTemplate">dependencyTemplate</a> slot should be provided.
       * @expose
       * @name dependencyData
       * @memberof oj.ojGantt
       * @instance
       * @type {?oj.DataProvider}
       * @ojsignature {target: "Type", value: "?(oj.DataProvider<K1, D1>)"}
       * @default null
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">dependency-data</code> attribute specified:</caption>
       * &lt;oj-gantt dependency-data="[[dependencyDataProvider]]">
       *   &lt;template slot="dependencyTemplate">
       *     &lt;oj-gantt-dependency
       *       predecessor-task-id="[[$current.data.predecessor]]"
       *       successor-task-id="[[$current.data.successor]]">
       *     &lt;/oj-gantt-dependency>
       *   &lt;/template>
       * &lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">dependencyData</code> property after initialization:</caption>
       * // getter
       * var value = myGantt.dependencyData;
       *
       * // setter
       * myGantt.dependencyData = dependencyDataProvider;
       */
      dependencyData: null,
      /**
       * Enables drag and drop functionality.
       * @expose
       * @name dnd
       * @memberof oj.ojGantt
       * @instance
       * @type {Object}
       *
       * @example <caption>Initialize the Gantt with some <code class="prettyprint">dnd</code> functionality:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-gantt dnd.move.tasks='enabled'>&lt;/oj-gantt>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-gantt dnd='{"move": {"tasks": "enabled"}}'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">dnd</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.dnd.move;
       *
       * // Set one, leaving the others intact.
       * myGantt.setProperty('dnd.move', {"tasks": "enabled"});
       *
       * // Get all
       * var values = myGantt.dnd;
       *
       * // Set all. Must list every dnd functionality, as those not listed are lost.
       * myGantt.dnd = {
       *     "move": {"tasks": "enabled"}
       * };
       */
      dnd: {
        /**
         * Defines a subset of high level configurations for moving elements to another location of some row within the gantt.
         * <br></br>See the <a href="#dnd">dnd</a> attribute for usage examples.
         * @expose
         * @name dnd.move
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        move: {
          /**
           * Enable or disable moving the non-baseline portions of tasks to a different location of some row within the same gantt using drag and drop or equivalent keyboard actions (See <a href="#keyboard-section">Keyboard End User Information</a>).
           * See also <a href="#event:move">ojMove</a>.
           * <br></br>See the <a href="#dnd">dnd</a> attribute for usage examples.
           * @expose
           * @name dnd.move.tasks
           * @memberof! oj.ojGantt
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojvalue {string} "disabled" Disable moving tasks
           * @ojvalue {string} "enabled" Enable moving tasks
           * @default "disabled"
           */
          tasks: 'disabled'
        }
      },
      /**
       * The end time of the Gantt. A valid value is required in order for the Gantt to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
       * @expose
       * @name end
       * @memberof oj.ojGantt
       * @instance
       * @type {string}
       * @ojformat date-time
       * @default ""
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">end</code> attribute specified:</caption>
       * &lt;oj-gantt end='2017-12-31T05:00:00.000Z'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">end</code> property after initialization:</caption>
       * // getter
       * var value = myGantt.end;
       *
       * // setter
       * myGantt.end = '2017-12-31T05:00:00.000Z';
       */
      end: '',
      /**
       * An object specifying whether to display or hide the horizontal and vertical grid lines.
       * @expose
       * @name gridlines
       * @memberof oj.ojGantt
       * @instance
       * @type {Object}
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">gridlines</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-gantt gridlines.horizontal='auto' gridlines.vertical='auto'>&lt;/oj-gantt>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-gantt gridlines='{"horizontal": "auto", "vertical": "auto"}'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">gridlines</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.gridlines.horizontal;
       *
       * // Set one, leaving the others intact.
       * myGantt.setProperty('gridlines.horizontal', 'auto');
       *
       * // Get all
       * var values = myGantt.gridlines;
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myGantt.gridlines = {
       *     "horizontal": "auto",
       *     "vertical": "auto"
       * };
       */
      gridlines: {
        /**
         * Horizontal gridlines. The default value is "auto", which means Gantt will decide whether the grid lines should be made visible or hidden.
         * <br></br>See the <a href="#gridlines">gridlines</a> attribute for usage examples.
         * @expose
         * @name gridlines.horizontal
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @ojvalue {string} "hidden"
         * @ojvalue {string} "visible"
         * @ojvalue {string} "auto"
         * @default "auto"
         */
        horizontal: 'auto',
        /**
         * Vertical gridlines. The default value is "auto", which means Gantt will decide whether the grid lines should be made visible or hidden.
         * <br></br>See the <a href="#gridlines">gridlines</a> attribute for usage examples.
         * @expose
         * @name gridlines.vertical
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @ojvalue {string} "hidden"
         * @ojvalue {string} "visible"
         * @ojvalue {string} "auto"
         * @default "auto"
         */
        vertical: 'auto'
      },
      /**
       * An object with the following properties, used to define the minor time axis. This is required in order for the Gantt to properly render.
       * @expose
       * @name minorAxis
       * @memberof oj.ojGantt
       * @instance
       * @type {Object}
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">minor-axis</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-gantt minor-axis.converter="[[myConverterObject]]" minor-axis.scale="weeks" minor-axis.zoom-order='["quarters", "months", "weeks", "days"]'>&lt;/oj-gantt>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-gantt minor-axis='{"scale": "weeks", "zoomOrder": ["quarters", "months", "weeks", "days"]}'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">minorAxis</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.minorAxis.scale;
       *
       * // Set one, leaving the others intact.
       * myGantt.setProperty('minorAxis.scale', 'weeks');
       *
       * // Get all
       * var values = myGantt.minorAxis;
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myGantt.minorAxis = {
       *     "converter": myConverterObject,
       *     "scale": "weeks",
       *     "zoomOrder": ["quarters", "months", "weeks", "days"]
       * };
       */
      minorAxis: {
      /**
       * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the labels of the minor axis for all 'scale' values, or
       * an object literal whose keys are 'scale' values that map specific converters for scale specific formatting (see {@link oj.ojTimeAxis.Converters}).
       * See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.converter
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?(oj.ojTimeAxis.Converters|oj.Converter<string>)", jsdocOverride: true}
       * @default {"default": null, "seconds": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}), "days": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "months": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "quarters": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "years": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})}
       */
        converter: {
          default: null,
          seconds: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ hour: 'numeric', minute: '2-digit', second: '2-digit' }),
          minutes: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ hour: 'numeric', minute: '2-digit' }),
          hours: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ hour: 'numeric' }),
          days: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ month: 'numeric', day: '2-digit' }),
          weeks: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ month: 'numeric', day: '2-digit' }),
          months: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ month: 'long' }),
          quarters: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ month: 'long' }),
          years: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ year: 'numeric' })
        },
        /**
         * Specifies the height of the minor axis in pixels.
         * If not specified or if the height specified is less than the inherent minimum height (which is a function of the axis label sizes),
         * a default value will be used.
         * Applications should make sure not to set heights that would make the total axes height too large for the viewport to accomodate.
         * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
         * @expose
         * @name minorAxis.height
         * @memberof! oj.ojGantt
         * @instance
         * @type {?number}
         * @ojsignature {target: "Type", value: "?"}
         * @ojunits pixels
         * @default null
         */
        height: null,
        /**
         * The time scale used for the minor axis. This is required in order for the Gantt to properly render.
         * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
         * @expose
         * @name minorAxis.scale
         * @memberof! oj.ojGantt
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
         * An array of strings containing the names of scales used for zooming from longest to shortest. If not specified, the 'scale' specified on the axis will be used at all zoom levels.
         * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
         * @expose
         * @name minorAxis.zoomOrder
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Array.<string>}
         * @ojsignature {target: "Type", value: "?"}
         * @default null
         */
        zoomOrder: null
      },
      /**
       * An object with the following properties, used to define the major time axis. If not specified, no major time axis is shown.
       * @expose
       * @name majorAxis
       * @memberof oj.ojGantt
       * @instance
       * @type {?Object}
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">major-axis</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-gantt major-axis.converter="[[myConverterObject]]" major-axis.scale="months" major-axis.zoom-order='["quarters", "months", "weeks", "days"]'>&lt;/oj-gantt>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-gantt major-axis='{"scale": "months", "zoomOrder": ["quarters", "months", "weeks", "days"]}'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">majorAxis</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.majorAxis.scale;
       *
       * // Set one, leaving the others intact.
       * myGantt.setProperty('majorAxis.scale', 'months');
       *
       * // Get all
       * var values = myGantt.majorAxis;
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myGantt.majorAxis = {
       *     "converter": myConverterObject,
       *     "scale": "months",
       *     "zoomOrder": ["quarters", "months", "weeks", "days"]
       * };
       */
      majorAxis: {
        /**
         * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the labels of the major axis for all 'scale' values, or
         * an object literal whose keys are 'scale' values that map specific converters for scale specific formatting (see {@link oj.ojTimeAxis.Converters}).
         * See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
         * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
         * @expose
         * @name majorAxis.converter
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?(oj.ojTimeAxis.Converters|oj.Converter<string>)", jsdocOverride: true}
         * @default {"default": null, "seconds": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}), "days": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "months": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "quarters": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "years": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})}
         */
        converter: {
          default: null,
          seconds: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ hour: 'numeric', minute: '2-digit', second: '2-digit' }),
          minutes: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ hour: 'numeric', minute: '2-digit' }),
          hours: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ hour: 'numeric' }),
          days: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ month: 'numeric', day: '2-digit' }),
          weeks: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ month: 'numeric', day: '2-digit' }),
          months: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ month: 'long' }),
          quarters: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ month: 'long' }),
          years: __ValidationBase.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
            .createConverter({ year: 'numeric' })
        },
        /**
         * Specifies the height of the major axis in pixels.
         * If not specified or if the height specified is less than the inherent minimum height (which is a function of the axis label sizes),
         * a default value will be used.
         * Applications should make sure not to set heights that would make the total axes height too large for the viewport to accomodate.
         * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
         * @expose
         * @name majorAxis.height
         * @memberof! oj.ojGantt
         * @instance
         * @type {?number}
         * @ojsignature {target: "Type", value: "?"}
         * @ojunits pixels
         * @default null
         */
        height: null,
        /**
         * The time scale used for the major axis.
         * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
         * @expose
         * @name majorAxis.scale
         * @memberof! oj.ojGantt
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
         * An array of strings containing the names of scales used for zooming from longest to shortest. If not specified, the 'scale' specified on the axis will be used at all zoom levels.
         * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
         * @expose
         * @name majorAxis.zoomOrder
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Array.<string>}
         * @ojsignature {target: "Type", value: "?"}
         * @default null
         */
        zoomOrder: null
      },
      /**
       * The array of reference objects associated with the gantt. For each reference object, a line is rendered at the specified value. Currently only the first reference object in the array is supported. Any additional objects supplied in the array will be ignored.
       * @expose
       * @name referenceObjects
       * @memberof oj.ojGantt
       * @instance
       * @type {Array.<Object>}
       * @ojsignature {target: "Type", value: "Array<oj.ojGantt.ReferenceObject>", jsdocOverride: true}
       * @default []
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">reference-objects</code> attribute specified:</caption>
       * &lt;oj-gantt reference-objects='[{"value": "2017-04-15T04:00:00.000Z"}]'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">referenceObjects</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.referenceObjects[0];
       *
       * // Get all
       * var values = myGantt.referenceObjects;
       *
       * // Set all (There is no permissible "set one" syntax.)
       * myGantt.referenceObjects = [{
       *     "value": "2017-04-15T00:00:00.000Z",
       *     "svgStyle": {"stroke": "red"}
       * }];
       */
      referenceObjects: [],
      /**
       * An object defining properties for the row labels region.
       * @expose
       * @name rowAxis
       * @memberof oj.ojGantt
       * @instance
       * @type {Object}
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">row-axis</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-gantt row-axis.rendered='on' row-axis.max-width='50px'>&lt;/oj-gantt>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-gantt row-axis='{"rendered": "on", "maxWidth": "50px"}'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">rowAxis</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.rowAxis.rendered;
       *
       * // Set one, leaving the others intact
       * myGantt.setProperty('rowAxis.rendered', 'on');
       *
       * // Get all
       * var values = myGantt.rowAxis;
       *
       * // Set all (any value not set will be ignored)
       * myGantt.rowAxis = {
       *     rendered: "on",
       *     maxWidth: "50px"
       * };
       */
      rowAxis: {
        /**
         * Defines whether row labels are rendered.
         * <br></br>See the <a href="#rowAxis">row-axis</a> attribute for usage examples.
         * @expose
         * @name rowAxis.rendered
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @ojvalue {string} "on"
         * @ojvalue {string} "off"
         * @default "off"
         */
        rendered: 'off',
        /**
         * Defines the maximum width of the region in pixels (e.g. '50px') or percent (e.g. '15%') of the element width. If 'none' is specified, then the width has no maximum value. Default labels will truncate to fit.
         * <br></br>See the <a href="#rowAxis">row-axis</a> attribute for usage examples.
         * @expose
         * @name rowAxis.maxWidth
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default "none"
         */
        maxWidth: 'none',
        /**
         * Defines the width of the region in pixels (e.g. '50px') or percent (e.g. '15%') of the element width. If 'max-content' is specified, then the intrinsic width of the widest label content is used. Default labels will truncate to fit.
         * <br></br>See the <a href="#rowAxis">row-axis</a> attribute for usage examples.
         * @expose
         * @name rowAxis.width
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default "max-content"
         */
        width: 'max-content',
        /**
         * An object defining the properties of the row labels.
         * <br></br>See the <a href="#rowAxis">row-axis</a> attribute for usage examples.
         * @expose
         * @name rowAxis.label
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        label: {
          /**
           * An optional function that returns custom content for the row label. The custom content must be an SVG element.
           * <br></br>See the <a href="#rowAxis">row-axis</a> attribute for usage examples.
           * @expose
           * @name rowAxis.label.renderer
           * @memberof! oj.ojGantt
           * @instance
           * @type {?(function(Object):Object)}
           * @ojsignature {target: "Type", value: "((context: oj.ojGantt.RowAxisLabelRendererContext<K2, D2>) => ({insert: Element}))", jsdocOverride: true}
           * @default null
           */
          renderer: null
        }
      },
      /**
       * An object with the following properties, used to define default styling for rows in the Gantt.
       * @expose
       * @name rowDefaults
       * @memberof oj.ojGantt
       * @instance
       * @type {Object}
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">row-defaults</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-gantt row-defaults.height='40'>&lt;/oj-gantt>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-gantt row-defaults='{"height": 40}'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">taskDefaults</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.rowDefaults.height;
       *
       * // Get all
       * var values = myGantt.rowDefaults;
       *
       * // Set one, leaving the others intact.
       * myGantt.setProperty('rowDefaults.height', 40);
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myGantt.rowDefaults = {
       *     "height": 40
       * };
       */
      rowDefaults: {
        /**
         * The height of the row in pixels. If specified, overlapping tasks do not stagger.
         * Since task heights can also be set, via the <a href="#taskDefaults.height">task-defaults.height</a> attribute or in the data definition,
         * applications typically should make sure that their task heights are less than the row height.
         * If not specified, a default height is calculated based on the height of the tasks within the row, and overlapping tasks stagger.
         * <br></br>See the <a href="#rowDefaults">row-defaults</a> attribute for usage examples.
         * @expose
         * @name rowDefaults.height
         * @memberof! oj.ojGantt
         * @instance
         * @type {?number}
         * @ojsignature {target: "Type", value: "?"}
         * @ojunits pixels
         * @default null
         */
        height: null
      },
      /**
       * An array of objects with the following properties, used to define rows and tasks within rows. Also accepts a Promise that will resolve with an array for deferred data rendering. No data will be rendered if the Promise is rejected.
       * @expose
       * @ojtsignore
       * @name rows
       * @memberof oj.ojGantt
       * @instance
       * @type {?(Array.<Object>|Promise)}
       * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojGantt.Row<K2>>>|null",
       *                                           SetterType: "Array<oj.ojGantt.Row<K2>>|Promise<Array<oj.ojGantt.Row<K2>>>|null"},
       *                                           jsdocOverride: true}
       * @default null
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">rows</code> attribute specified:</caption>
       * &lt;oj-gantt rows='[[myRows]]'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">rows</code> property after initialization:</caption>
       * // Get all (The rows getter always returns a Promise so there is no "get one" syntax)
       * var values = myGantt.rows;
       *
       * // Set all (There is no permissible "set one" syntax.)
       * myGantt.rows = [
       *     {
       *         "id": "r1",
       *         "label": "Row 1",
       *         "tasks": [
       *             {
       *                 "id": "task1_1",
       *                 "start": "2017-01-04T17:00:00.000Z",
       *                 "end": "2017-01-10T17:00:00.000Z",
       *                 "label":"Label 1-1"
       *             },
       *             {
       *                 "id": "task1_2",
       *                 "start": "2017-02-04T17:00:00.000Z",
       *                 "end": "2017-02-10T17:00:00.000Z",
       *                 "label":"Label 1-2"
       *             }
       *         ]
       *     },
       *     {
       *         "id": "r2",
       *         "label": "Row 2",
       *         "tasks": [
       *             {
       *                 "id": "task2_1",
       *                 "start": "2017-01-10T17:00:00.000Z",
       *                 "end": "2017-01-24T17:00:00.000Z",
       *                 "label":"Label 2-1"
       *             },
       *             {
       *                 "id": "task2_2",
       *                 "start": "2017-02-10T17:00:00.000Z",
       *                 "end": "2017-02-27T17:00:00.000Z",
       *                 "label":"Label 2-2"
       *             }
       *         ]
       *     }
       * ];
       */
      rows: null,
      /**
       * The current scroll position of Gantt. The scroll position is updated when the vertical scroll position has changed.
       * The value contains the y scroll position, the index of the row closest to the top of the viewport, and the vertical offset from the position of the row to the actual scroll position.
       * <p>
       * The default value contains just the scroll position. If there is no data then the 'rowIndex' sub-property will not be available.
       * </p>
       * <p>
       * When setting the scrollPosition property, applications can change any combination of the sub-properties.
       * If multiple sub-properties are set at once they will be used in rowIndex, pixel order where the latter serves as hints.
       * If offsetY is specified, it will be used to adjust the scroll position from the position where the index
       * of the row is located.
       * </p>
       * <p>
       * If a sparse object is set the other sub-properties will be populated and updated once Gantt has scrolled to that position.
       * </p>
       * @expose
       * @name scrollPosition
       * @memberof oj.ojGantt
       * @instance
       * @type {Object}
       * @ojwriteback
       * @default {"y": 0}
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">scroll-position</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-gantt scroll-position.y="50">&lt;/oj-gantt>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-gantt scroll-position='{"y": 50}'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">scrollPosition</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.scrollPosition.y;
       *
       * // Get all
       * var values = myGantt.scrollPosition;
       *
       * // Set one, leaving the others intact.
       * myGantt.setProperty('scrollPosition.y', 50);
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myGantt.scrollPosition = {
       *     "y": 50
       * };
       */
      scrollPosition: {
        /**
         * The vertical position in pixel.
         * <br></br>See the <a href="#scrollPosition">scroll-position</a> attribute for usage examples.
         * @expose
         * @name scrollPosition.y
         * @memberof! oj.ojGantt
         * @instance
         * @type {number}
         * @ojsignature {target: "Type", value: "?"}
         * @ojunits pixels
         * @default 0
         */
        y: 0,
        /**
         * The zero-based index of the row.
         * <br></br>See the <a href="#scrollPosition">scroll-position</a> attribute for usage examples.
         * @expose
         * @name scrollPosition.rowIndex
         * @memberof! oj.ojGantt
         * @instance
         * @type {?number}
         * @ojsignature {target: "Type", value: "?"}
         * @default null
         */
        rowIndex: null,
        /**
         * The vertical offset in pixel relative to the row identified by <a href="#scrollPosition.rowIndex">scroll-position.rowIndex</a>.
         * <br></br>See the <a href="#scrollPosition">scroll-position</a> attribute for usage examples.
         * @expose
         * @name scrollPosition.offsetY
         * @memberof! oj.ojGantt
         * @instance
         * @type {?number}
         * @ojsignature {target: "Type", value: "?"}
         * @ojunits pixels
         * @default null
         */
        offsetY: null
      },
      /**
       * An array of strings containing the ids of the initially selected tasks.
       * @expose
       * @name selection
       * @memberof oj.ojGantt
       * @instance
       * @type {Array.<any>}
       * @ojsignature {target:"Type", value:"K2[]"}
       * @ojwriteback
       * @default []
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">selection</code> attribute specified:</caption>
       * &lt;oj-gantt selection='["taskID1", "taskID2", "taskID3"]'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">selection</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.selection[0];
       *
       * // Get all
       * var values = myGantt.selection;
       *
       * // Set all (There is no permissible "set one" syntax.)
       * myGantt.selection = ["taskID1", "taskID2", "taskID3"];
       */
      selection: [],
      /**
       * The type of selection behavior that is enabled on the Gantt. If 'single' is specified, only a single task can be selected at once. If 'multiple', any number of tasks can be selected at once. Otherwise, selection is disabled.
       * @expose
       * @name selectionMode
       * @memberof oj.ojGantt
       * @instance
       * @type {string}
       * @ojvalue {string} "single"
       * @ojvalue {string} "multiple"
       * @ojvalue {string} "none"
       * @default "none"
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">selection-mode</code> attribute specified:</caption>
       * &lt;oj-gantt selection-mode='multiple'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">selectionMode</code> property after initialization:</caption>
       * // getter
       * var value = myGantt.selectionMode;
       *
       * // setter
       * myGantt.selectionMode = 'multiple';
       */
      selectionMode: 'none',
      /**
       * The start time of the Gantt. A valid value is required in order for the Gantt to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
       * @expose
       * @name start
       * @memberof oj.ojGantt
       * @instance
       * @type {string}
       * @ojformat date-time
       * @default ""
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">start</code> attribute specified:</caption>
       * &lt;oj-gantt start='2017-01-01T05:00:00.000Z'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">start</code> property after initialization:</caption>
       * // getter
       * var value = myGantt.start;
       *
       * // setter
       * myGantt.start = "2017-01-01T05:00:00.000Z";
       */
      start: '',
      /**
       * The oj.DataProvider for the tasks of the gantt. It should provide data rows where each row maps data for a single gantt task.
       * The row key will be used as the id for gantt tasks.
       * Note that when using this attribute, a template for the <a href="#taskTemplate">taskTemplate</a> slot should be provided.
       * Additionally providing a template for the <a href="#rowTemplate">rowTemplate</a> slot for generating the gantt row properties is optional.
       * @expose
       * @name taskData
       * @memberof oj.ojGantt
       * @instance
       * @type {?oj.DataProvider}
       * @ojsignature {target: "Type", value: "?(oj.DataProvider<K2, D2>)"}
       * @default null
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">task-data</code> attribute specified:</caption>
       * &lt;oj-gantt task-data="[[taskDataProvider]]" row-axis.rendered="on">
       *   &lt;template slot="rowTemplate">
       *     &lt;oj-gantt-row
       *       label="[[$current.id]]">
       *     &lt;/oj-gantt-row>
       *   &lt;/template>
       *   &lt;template slot="taskTemplate">
       *     &lt;oj-gantt-task
       *       row-id="[[$current.data.resource]]"
       *       start="[[$current.data.begin]]"
       *       end="[[$current.data.finish]]">
       *     &lt;/oj-gantt-task>
       *   &lt;/template>
       * &lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">taskData</code> property after initialization:</caption>
       * // getter
       * var value = myGantt.taskData;
       *
       * // setter
       * myGantt.taskData = taskDataProvider;
       */
      taskData: null,
      /**
       * An object with the following properties, used to define default styling for tasks in the Gantt. Properties specified on this object may
       * be overridden by specifications on individual tasks.
       * @expose
       * @name taskDefaults
       * @memberof oj.ojGantt
       * @instance
       * @type {Object}
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">task-defaults</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-gantt task-defaults.border-radius='5px' task-defaults.label-position='["end"]' task-defaults.progress.height="50%">&lt;/oj-gantt>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-gantt task-defaults='{"borderRadius": "5px", "labelPosition": ["end"], "progress": {"height": "50%"}}'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">taskDefaults</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.taskDefaults.height;
       *
       * // Get all
       * var values = myGantt.taskDefaults;
       *
       * // Set one, leaving the others intact.
       * myGantt.setProperty('taskDefaults.height', 30);
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myGantt.taskDefaults = {
       *     "borderRadius": "5px",
       *     "labelPosition": ["end"],
       *     "height": 30,
       *     "progress": {"height": "50%"}
       * };
       */
      taskDefaults: {
        /**
         * The border radius of the task. Accepts values allowed in CSS border-radius attribute.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.borderRadius
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default "0"
         */
        borderRadius: '0',
        /**
         * The position of the label relative to the task. An array of values is also supported. If an array is specified, then the values are traversed until a position that can fully display the label is found. If 'max' is specified in the array, then of all the positions evaluated up to that point of the traversal, the one with the largest space is used (label is truncated to fit). Naturally, 'max' is ignored if it's specified as the first value of the array. If the last value of the array is reached, but the label cannot be fully displayed, then the label is placed at that position, truncated to fit. Due to space constraints in the milestone and task with progress cases, the inner positions will exhibit the following behaviors: <ul> <li> For milestones, specifying 'innerStart', 'innerEnd', or 'innerCenter' would be equivalent to specifying 'start', 'end', and 'end' respectively. </li> <li> For tasks with progress, 'innerCenter' means the label will be aligned to the end of the progress bar, either placed inside or outside of the progress, whichever is the larger space. 'innerStart' and 'innerEnd' positions are honored when there is enough space to show the label at those positions. Otherwise, the aforementioned 'innerCenter' behavior is exhibited. </li> </ul>
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @ojshortdesc The position of the label relative to the task, or a priority order of label positions for the component to automatically choose from.
         * @expose
         * @name taskDefaults.labelPosition
         * @memberof! oj.ojGantt
         * @instance
         * @type {string|Array.<string>}
         * @ojsignature {target: "Type", value: "?(string|Array<string>)"}
         * @ojvalue {string} "start"
         * @ojvalue {string} "innerCenter"
         * @ojvalue {string} "innerStart"
         * @ojvalue {string} "innerEnd"
         * @ojvalue {string} "end"
         * @ojvalue {string} "none"
         * @default ["end", "innerCenter", "start", "max"]
         */
        labelPosition: ['end', 'innerCenter', 'start', 'max'],
        /**
         * The height of the task in pixels. If not specified, a default height is used depending on the task type, and whether the baseline is specified.
         * Since row heights can also be set via the <a href="#rowDefaults.height">row-defaults.height</a> attribute, applications typically should make sure that their task heights are less than the row height.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.height
         * @memberof! oj.ojGantt
         * @instance
         * @type {?number}
         * @ojsignature {target: "Type", value: "?"}
         * @ojunits pixels
         * @default null
         */
        height: null,
        /**
         * A space delimited list of CSS style classes defining the style of the task.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.svgClassName
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         */
        svgClassName: '',
        /**
         * The CSS style defining the style of the task.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.svgStyle
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         * @default {}
         */
        svgStyle: {},
        /**
         * Defines the task type to be rendered.<br></br>If "milestone", and if the task's "start" and "end" values are specified and unequal, the "start" value is used to evaluate position.<br></br>If "auto", the type is inferred from the data:<ul> <li>If "start" and "end" values are specified and unequal, "normal" type is assumed.</li> <li>Otherwise, "milestone" type is assumed.</li></ul>
         * See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @ojshortdesc The type of task to be rendered.
         * @expose
         * @name taskDefaults.type
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @ojvalue {string} "normal"
         * @ojvalue {string} "milestone"
         * @ojvalue {string} "summary"
         * @ojvalue {string} "auto"
         * @default "auto"
         */
        type: 'auto',
        /**
         * An object with the following properties, used to define default styling for progress bars on non-milestone tasks.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.progress
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        progress: {
          /**
           * The border radius of the progress bar. Accepts values allowed in CSS border-radius attribute.
           * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
           * @expose
           * @name taskDefaults.progress.borderRadius
           * @memberof! oj.ojGantt
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @default "0"
           */
          borderRadius: '0',
          /**
           * Specifies the height of the progress bar in pixels (e.g. '50px') or percent of the associated task bar (e.g. '15%').
           * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
           * @expose
           * @name taskDefaults.progress.height
           * @memberof! oj.ojGantt
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @default "100%"
           */
          height: '100%',
          /**
           * A space delimited list of CSS style classes to apply to the progress bar. Note that only CSS style applicable to SVG elements can be used.
           * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
           * @expose
           * @name taskDefaults.progress.svgClassName
           * @memberof! oj.ojGantt
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @default ""
           */
          svgClassName: '',
          /**
           * The CSS inline style to apply to the progress bar. Only CSS style applicable to SVG elements can be used.
           * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
           * @expose
           * @name taskDefaults.progress.svgStyle
           * @memberof! oj.ojGantt
           * @instance
           * @type {Object}
           * @ojsignature {target: "Type", value: "?"}
           * @default {}
           */
          svgStyle: {}
        },
        /**
         * An object with the following properties, used to define default styling for task baseline elements.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.baseline
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        baseline: {
          /**
           * The border radius of the baseline. Accepts values allowed in CSS border-radius attribute.
           * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
           * @expose
           * @name taskDefaults.baseline.borderRadius
           * @memberof! oj.ojGantt
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @default "0"
           */
          borderRadius: '0',
          /**
           * The height of the baseline in pixels. If not specified, a default height is used depending on the baseline type.
           * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
           * @expose
           * @name taskDefaults.baseline.height
           * @memberof! oj.ojGantt
           * @instance
           * @type {?number}
           * @ojsignature {target: "Type", value: "?"}
           * @ojunits pixels
           * @default null
           */
          height: null,
          /**
           * A space delimited list of CSS style classes defining the style of the baseline.
           * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
           * @expose
           * @name taskDefaults.baseline.svgClassName
           * @memberof! oj.ojGantt
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @default ""
           */
          svgClassName: '',
          /**
           * The CSS style defining the style of the baseline.
           * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
           * @expose
           * @name taskDefaults.baseline.svgStyle
           * @memberof! oj.ojGantt
           * @instance
           * @type {Object}
           * @ojsignature {target: "Type", value: "?"}
           * @default {}
           */
          svgStyle: {}
        }
      },
      /**
       * An object containing an optional callback function for tooltip customization.
       * @expose
       * @name tooltip
       * @memberof oj.ojGantt
       * @instance
       * @type {Object}
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">tooltip</code> attribute specified:</caption>
       * &lt;oj-gantt tooltip.renderer='[[tooltipFun]]'>&lt;/oj-gantt>
       *
       * &lt;oj-gantt tooltip='[[{"renderer": tooltipFun}]]'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">tooltip</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.tooltip.renderer;
       *
       * // Set one, leaving the others intact.
       * myGantt.setProperty('tooltip.renderer', tooltipFun);
       *
       * // Get all
       * var values = myGantt.tooltip;
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myGantt.tooltip = {'renderer': tooltipFun};
       */
      tooltip: {
        /**
         * A function that returns a custom tooltip. Note that the default is for a tooltip to be displayed.
         * <br></br>See the <a href="#tooltip">tooltip</a> attribute for usage examples.
         * @expose
         * @name tooltip.renderer
         * @memberof! oj.ojGantt
         * @instance
         * @type {?(function(Object):Object)}
         * @ojsignature {target: "Type", value: "((context: oj.ojGantt.TooltipContext<K2, D2>) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
         * @default null
         */
        renderer: null
      },
      /**
       * An object specifying value formatting and tooltip behavior, whose keys generally correspond to task properties.
       * @expose
       * @name valueFormats
       * @memberof oj.ojGantt
       * @instance
       * @type {Object}
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">value-formats</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-gantt value-formats.row.tooltip-label="Employee" value-formats.label.tooltip-display="off">&lt;/oj-gantt>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-gantt value-formats='{"row": {"tooltipLabel": "Employee"}, "label": {"tooltipDisplay": "off"}}'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">valueFormats</code> property after initialization:</caption>
       * // Get one
       * var value = myGantt.valueFormats.row.tooltipLabel;
       *
       * // Set one, leaving the others intact
       * myGantt.setProperty('valueFormats.row.tooltipLabel', 'Employee');
       *
       * // Get all
       * var values = myGantt.valueFormats;
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myGantt.valueFormats = {
       *     "row": {"tooltipLabel": "Employee"},
       *     "label": {"tooltipDisplay": "off"}
       * };
       */
      valueFormats: {
        /**
         * Specifies tooltip behavior for the row value.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.row
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        row: {
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt.translations.labelRow}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.row.tooltipLabel
           * @memberof! oj.ojGantt
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
           * @name valueFormats.row.tooltipDisplay
           * @memberof! oj.ojGantt
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
         * Specifies tooltip behavior for the start value.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.start
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        start: {
          /**
           * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the label. If not specified, a default converter depending on the axes scale is used. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.start.converter
           * @memberof! oj.ojGantt
           * @instance
           * @type {?Object}
           * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
           * @default null
           */
          converter: null,
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt.translations.labelStart}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.start.tooltipLabel
           * @memberof! oj.ojGantt
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
           * @memberof! oj.ojGantt
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
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        end: {
          /**
           * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the label. If not specified, a default converter depending on the axes scale is used. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.end.converter
           * @memberof! oj.ojGantt
           * @instance
           * @type {?Object}
           * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
           * @default null
           */
          converter: null,
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt.translations.labelEnd}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.end.tooltipLabel
           * @memberof! oj.ojGantt
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
           * @memberof! oj.ojGantt
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
         * Specifies tooltip behavior for the date value of a milestone task.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.date
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        date: {
          /**
           * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the label. If not specified, a default converter depending on the axes scale is used. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.date.converter
           * @memberof! oj.ojGantt
           * @instance
           * @type {?Object}
           * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
           * @default null
           */
          converter: null,
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt.translations.labelDate}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.date.tooltipLabel
           * @memberof! oj.ojGantt
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
           * @memberof! oj.ojGantt
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
         * Specifies tooltip behavior for the label value.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.label
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        label: {
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt.translations.labelLabel}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.label.tooltipLabel
           * @memberof! oj.ojGantt
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
           * @name valueFormats.label.tooltipDisplay
           * @memberof! oj.ojGantt
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
         * Specifies tooltip behavior for the progress value.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.progress
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        progress: {
          /**
           * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the label. See {@link oj.NumberConverterFactory} for details on creating built-in number converters.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.progress.converter
           * @memberof! oj.ojGantt
           * @instance
           * @type {?Object}
           * @ojsignature {target: "Type", value: "?(oj.Converter<number>)", jsdocOverride: true}
           * @default oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER).createConverter({style: 'percent'})
           */
          converter: __ValidationBase.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER).createConverter({ style: 'percent' }),
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt.translations.labelProgress}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.progress.tooltipLabel
           * @memberof! oj.ojGantt
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
           * @name valueFormats.progress.tooltipDisplay
           * @memberof! oj.ojGantt
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
         * Specifies tooltip behavior for the start value of the baseline.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.baselineStart
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        baselineStart: {
          /**
           * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the label. If not specified, a default converter depending on the axes scale is used. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.baselineStart.converter
           * @memberof! oj.ojGantt
           * @instance
           * @type {?Object}
           * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
           * @default null
           */
          converter: null,
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt.translations.labelBaselineStart}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.baselineStart.tooltipLabel
           * @memberof! oj.ojGantt
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
           * @name valueFormats.baselineStart.tooltipDisplay
           * @memberof! oj.ojGantt
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
         * Specifies tooltip behavior for the end value of the baseline.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.baselineEnd
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        baselineEnd: {
          /**
           * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the label. If not specified, a default converter depending on the axes scale is used. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.baselineEnd.converter
           * @memberof! oj.ojGantt
           * @instance
           * @type {?Object}
           * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
           * @default null
           */
          converter: null,
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt.translations.labelBaselineEnd}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.baselineEnd.tooltipLabel
           * @memberof! oj.ojGantt
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
           * @name valueFormats.baselineEnd.tooltipDisplay
           * @memberof! oj.ojGantt
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
         * Specifies tooltip behavior for the date value of the milestone baseline.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.baselineDate
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        baselineDate: {
          /**
           * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the label. If not specified, a default converter depending on the axes scale is used. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.baselineDate.converter
           * @memberof! oj.ojGantt
           * @instance
           * @type {?Object}
           * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
           * @default null
           */
          converter: null,
          /**
           * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt.translations.labelBaselineDate}.
           * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
           * @expose
           * @name valueFormats.baselineDate.tooltipLabel
           * @memberof! oj.ojGantt
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
           * @name valueFormats.baselineDate.tooltipDisplay
           * @memberof! oj.ojGantt
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           * @ojvalue {string} "off"
           * @ojvalue {string} "auto"
           * @default "auto"
           */
          tooltipDisplay: 'auto'
        }
      },
      /**
       * The end time of the Gantt's viewport. If not specified or invalid, this will default to a value determined by the initial 'scale' of the minor axis and the width of the Gantt. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
       * @expose
       * @name viewportEnd
       * @memberof oj.ojGantt
       * @instance
       * @type {string}
       * @ojformat date-time
       * @default ""
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">viewport-end</code> attribute specified:</caption>
       * &lt;oj-gantt viewport-end='2017-12-31T05:00:00.000Z'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">viewportEnd</code> property after initialization:</caption>
       * // getter
       * var value = myGantt.viewportEnd;
       *
       * // setter
       * myGantt.viewportEnd = '2017-12-31T05:00:00.000Z';
       */
      viewportEnd: '',
      /**
       * The start time of the Gantt's viewport. If not specified or invalid, this will default to a value determined by the initial 'scale' of the minor axis and the width of the Gantt. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
       * @expose
       * @name viewportStart
       * @memberof oj.ojGantt
       * @instance
       * @type {string}
       * @ojformat date-time
       * @default ""
       *
       * @example <caption>Initialize the Gantt with the <code class="prettyprint">viewport-start</code> attribute specified:</caption>
       * &lt;oj-gantt viewport-start='2017-01-01T05:00:00.000Z'>&lt;/oj-gantt>
       *
       * @example <caption>Get or set the <code class="prettyprint">viewportStart</code> property after initialization:</caption>
       * // getter
       * var value = myGantt.viewportStart;
       *
       * // setter
       * myGantt.viewportStart = '2017-01-01T05:00:00.000Z';
       */
      viewportStart: '',
      /**
       * Triggered after the viewport is changed due to a zoom or scroll operation.
       *
       * @property {string} viewportStart the start of the new viewport on a gantt chart
       * @property {string} viewportEnd the end of the new viewport on a gantt chart
       * @property {string} majorAxisScale the time scale of the majorAxis
       * @property {string} minorAxisScale the time scale of the minorAxis
       *
       * @expose
       * @event
       * @memberof oj.ojGantt
       * @instance
       * @ojbubbles
       */
      viewportChange: null,
      /**
       * Triggered after tasks are moved to a different location of some row within the gantt via drag and drop or equivalent keyboard actions (See <a href="#keyboard-section">Keyboard End User Information</a>).
       * See also the <a href="#dnd.move.tasks">dnd.move.tasks</a> attribute.
       *
       * @property {Object[]} taskContexts An array of dataContexts of the moved tasks. The first dataContext of the array corresponds to the source task where the move was initiated (e.g. the task directly under the mouse when drag started).
       * @property {oj.ojGantt.RowTask} taskContexts.data The data object of the source task.
       * @property {oj.ojGantt.Row} taskContexts.rowData The data for the row the source task belongs to.
       * @property {Object|null} taskContexts.itemData The data provider row data object for the source task. This will only be set if an oj.DataProvider for <a href="#taskData">task-data</a> is being used.
       * @property {string} taskContexts.color The color of the source task.
       * @property {string} value The value at the target position the source task is moved to. See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
       * @property {string} start The start value of the task, if the source task were to move to the target position. See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
       * @property {string} end The end value of the task, if the source task were to move to the target position. See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
       * @property {string} baselineStart The start value of the baseline, if the source task were to move to the target position. This is null if baseline is not defined on the task. See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
       * @property {string} baselineEnd The end value of the baseline, if the source task were to move to the target position. This is null if baseline is not defined on the task. See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
       * @property {Object} rowContext The data context for the row at the target position.
       * @property {oj.ojGantt.Row} rowContext.rowData The data for the target row.
       * @property {Element} rowContext.componentElement The gantt element.
       * @ojsignature [{target: "Type", value: "Array<{data: oj.ojGantt.RowTask<K2>, rowData: oj.ojGantt.Row<K2>, itemData: D2|null, color: string}>", for: "taskContexts"},
       *               {target: "Type", value: "{rowData: oj.ojGantt.Row<K2>, componentElement: Element}", for: "rowContext"},
       *               {target: "Type", value: "<K2, D2>", for: "genericTypeParameters"}]
       *
       * @expose
       * @event
       * @memberof oj.ojGantt
       * @instance
       * @ojbubbles
       */
      move: null
    },

    // @inheritdoc
    _CreateDvtComponent: function (context, callback, callbackObj) {
      // eslint-disable-next-line no-param-reassign
      context.styleClasses = this._getComponentStyleMap();
      return dvt.Gantt.newInstance(context, callback, callbackObj);
    },

    // @inheritdoc
    _GetComponentStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses.push('oj-gantt');
      return styleClasses;
    },

    /**
     * @private
     */
    _getComponentStyleMap: function () {
      var map = {};
      map.databody = 'oj-gantt-container';
      map.dependencyLine = 'oj-gantt-dependency-line';
      map.dependencyLineConnector = 'oj-gantt-dependency-line-connector';
      map.nodata = 'oj-gantt-no-data-message';
      map.hgridline = 'oj-gantt-horizontal-gridline';
      map.vgridline = 'oj-gantt-vertical-gridline';
      map.majorAxis = 'oj-gantt-major-axis';
      map.majorAxisTicks = 'oj-gantt-major-axis-separator';
      map.majorAxisLabels = 'oj-gantt-major-axis-label';
      map.minorAxis = 'oj-gantt-minor-axis';
      map.minorAxisTicks = 'oj-gantt-minor-axis-separator';
      map.minorAxisLabels = 'oj-gantt-minor-axis-label';
      map.row = 'oj-gantt-row';
      map.rowLabel = 'oj-gantt-row-label';
      map.task = 'oj-gantt-task';
      map.taskBar = 'oj-gantt-task-bar';
      map.taskMilestone = 'oj-gantt-task-milestone';
      map.taskSummary = 'oj-gantt-task-summary';
      map.taskDragImage = 'oj-gantt-task-drag-image';
      map.baseline = 'oj-gantt-baseline';
      map.baselineBar = 'oj-gantt-baseline-bar';
      map.baselineMilestone = 'oj-gantt-baseline-milestone';
      map.taskLabel = 'oj-gantt-task-label';
      map.taskProgress = 'oj-gantt-task-progress';
      map.tooltipLabel = 'oj-gantt-tooltip-label';
      map.tooltipValue = 'oj-gantt-tooltip-value';
      map.tooltipTable = 'oj-gantt-tooltip-content';
      map.referenceObject = 'oj-gantt-reference-object';
      map.selected = 'oj-selected';
      map.hover = 'oj-hover';
      map.focus = 'oj-focus';
      map.draggable = 'oj-draggable';
      map.activeDrop = 'oj-active-drop';
      map.invalidDrop = 'oj-invalid-drop';

      return map;
    },

    // @inheritdoc
    _IsDraggable: function () {
      return this.options.dnd && this.options.dnd.move && this.options.dnd.move.tasks === 'enabled';
    },

    /**
     * @override
     * @instance
     * @memberof oj.ojGantt
     * @protected
     */
    _ConvertLocatorToSubId: function (locator) {
      var subId = locator.subId;

      // Convert the supported locators
      if (subId === 'oj-gantt-taskbar') {
        // taskbar[rowIndex][index]
        subId = 'taskbar[' + locator.rowIndex + '][' + locator.index + ']';
      } else if (subId === 'oj-gantt-row-label') {
        // rowLabel[rowIndex]
        subId = 'rowLabel[' + locator.index + ']';
      } else if (subId === 'oj-gantt-dependency') {
        // dependency[index]
        subId = 'dependency[' + locator.index + ']';
      } else if (subId === 'oj-gantt-tooltip') {
        subId = 'tooltip';
      }

      // Return the converted result or the original subId if a supported locator wasn't recognized.
      return subId;
    },

    /**
     * @override
     * @instance
     * @memberof oj.ojGantt
     * @protected
     */
    _ConvertSubIdToLocator: function (subId) {
      var locator = {};
      var indexPath;

      if (subId.indexOf('taskbar') === 0) {
        // taskbar[rowIndex][index]
        indexPath = this._GetIndexPath(subId);

        locator.subId = 'oj-gantt-taskbar';
        locator.rowIndex = indexPath[0];
        locator.index = indexPath[1];
      } else if (subId.indexOf('rowLabel') === 0) {
        // rowLabel[rowIndex]
        indexPath = this._GetIndexPath(subId);

        locator.subId = 'oj-gantt-row-label';
        locator.index = indexPath[0];
      } else if (subId.indexOf('dependency') === 0) {
        // dependency[index]
        indexPath = this._GetIndexPath(subId);

        locator.subId = 'oj-gantt-dependency';
        locator.index = indexPath[0];
      } else if (subId === 'tooltip') {
        locator.subId = 'oj-gantt-tooltip';
      }

      return locator;
    },

    // @inheritdoc
    _GetChildStyleClasses: function () {
      var styleClasses = this._super();

      // animation duration
      styleClasses['oj-gantt'] = {
        path: '_resources/animationDuration',
        property: 'ANIM_DUR'
      };

      // Zoom Control Icons
      styleClasses['oj-gantt-zoomin-icon'] = [
        { path: '_resources/zoomIn_bgc', property: 'background-color' },
        { path: '_resources/zoomIn_bc', property: 'border-color' }
      ];
      styleClasses['oj-gantt-zoomin-icon oj-hover'] = [
        { path: '_resources/zoomIn_h_bgc', property: 'background-color' },
        { path: '_resources/zoomIn_h_bc', property: 'border-color' }
      ];
      styleClasses['oj-gantt-zoomin-icon oj-active'] = [
        { path: '_resources/zoomIn_a_bgc', property: 'background-color' },
        { path: '_resources/zoomIn_a_bc', property: 'border-color' }
      ];
      styleClasses['oj-gantt-zoomin-icon oj-disabled'] = [
        { path: '_resources/zoomIn_d_bgc', property: 'background-color' },
        { path: '_resources/zoomIn_d_bc', property: 'border-color' }
      ];
      styleClasses['oj-gantt-zoomout-icon'] = [
        { path: '_resources/zoomOut_bgc', property: 'background-color' },
        { path: '_resources/zoomOut_bc', property: 'border-color' }
      ];
      styleClasses['oj-gantt-zoomout-icon oj-hover'] = [
        { path: '_resources/zoomOut_h_bgc', property: 'background-color' },
        { path: '_resources/zoomOut_h_bc', property: 'border-color' }
      ];
      styleClasses['oj-gantt-zoomout-icon oj-active'] = [
        { path: '_resources/zoomOut_a_bgc', property: 'background-color' },
        { path: '_resources/zoomOut_a_bc', property: 'border-color' }
      ];
      styleClasses['oj-gantt-zoomout-icon oj-disabled'] = [
        { path: '_resources/zoomOut_d_bgc', property: 'background-color' },
        { path: '_resources/zoomOut_d_bc', property: 'border-color' }
      ];

      // Axes labels
      styleClasses['oj-gantt-major-axis-label'] = {
        path: '_resources/majorAxisLabelFontProp',
        property: 'TEXT'
      };
      styleClasses['oj-gantt-minor-axis-label'] = {
        path: '_resources/minorAxisLabelFontProp',
        property: 'TEXT'
      };

      // chart border
      styleClasses['oj-gantt-container'] = {
        path: '_resources/chartArea/strokeWidth',
        property: 'stroke-width'
      };

      // horizontal gridline width
      styleClasses['oj-gantt-horizontal-gridline'] = {
        path: '_resources/horizontalGridlineWidth',
        property: 'stroke-width'
      };

      // task label properties
      styleClasses['oj-gantt-task-label'] = {
        path: '_resources/taskLabelFontProp',
        property: 'TEXT'
      };

      // row label properties
      styleClasses['oj-gantt-row-label'] = {
        path: '_resources/rowLabelFontProp',
        property: 'TEXT'
      };

      return styleClasses;
    },

  // @inheritdoc
    _GetTranslationMap: function () {
      // The translations are stored on the options object.
      var translations = this.options.translations;

      // Safe to modify super's map because function guarentees a new map is returned
      var ret = this._super();
      ret['DvtUtilBundle.GANTT'] = translations.componentName;
      ret['DvtUtilBundle.ZOOM_IN'] = translations.tooltipZoomIn;
      ret['DvtUtilBundle.ZOOM_OUT'] = translations.tooltipZoomOut;

      return ret;
    },

    // @inheritdoc
    _LoadResources: function () {
      this._super();

      var resources = this.options._resources;

      // zoom control icon images
      resources.zoomIn = 'oj-gantt-zoomin-icon';
      resources.zoomIn_h = 'oj-gantt-zoomin-icon oj-hover';
      resources.zoomIn_a = 'oj-gantt-zoomin-icon oj-active';
      resources.zoomIn_d = 'oj-gantt-zoomin-icon oj-disabled';
      resources.zoomOut = 'oj-gantt-zoomout-icon';
      resources.zoomOut_h = 'oj-gantt-zoomout-icon oj-hover';
      resources.zoomOut_a = 'oj-gantt-zoomout-icon oj-active';
      resources.zoomOut_d = 'oj-gantt-zoomout-icon oj-disabled';

      // progress value converter for task tooltip
      var converterFactory =
          __ValidationBase.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER);
      resources.percentConverter = converterFactory.createConverter({ style: 'percent' });
    },

    // @inheritdoc
    _HandleEvent: function (event) {
      var type = event.type;
      if (type === 'viewportChange') {
        var viewportStart = new Date(event.viewportStart).toISOString();
        var viewportEnd = new Date(event.viewportEnd).toISOString();
        var majorAxisScale = event.majorAxisScale;
        var minorAxisScale = event.minorAxisScale;
        var viewportChangePayload = {
          viewportStart: viewportStart,
          viewportEnd: viewportEnd,
          majorAxisScale: majorAxisScale,
          minorAxisScale: minorAxisScale
        };

        this._UserOptionChange('viewportStart', viewportStart);
        this._UserOptionChange('viewportEnd', viewportEnd);
        this._UserOptionChange('majorAxis.scale', majorAxisScale);
        this._UserOptionChange('minorAxis.scale', minorAxisScale);
        this._trigger('viewportChange', null, viewportChangePayload);
      } else if (type === 'move') {
        var movePayload = {
          taskContexts: event.taskContexts,
          value: event.value,
          start: event.start,
          end: event.end,
          baselineStart: event.baselineStart,
          baselineEnd: event.baselineEnd,
          rowContext: event.rowContext
        };
        this._trigger('move', null, movePayload);
      } else if (type === 'scrollPositionChange') {
        var scrollPositionChangePayload = {
          y: event.y,
          rowIndex: event.rowIndex,
          offsetY: event.offsetY
        };
        this._UserOptionChange('scrollPosition', scrollPositionChangePayload);
        this._trigger('scrollPositionChange', null, scrollPositionChangePayload);
      } else {
        this._super(event);
      }
    },

    // @inheritdoc
    _GetComponentNoClonePaths: function () {
      var noClonePaths = this._super();

    // Date time options as of 3.0.0 only support number and string types
    // e.g. Date object type is not supported. However,
    // during the options cloning,
    // Date objects are automatically converted to number by default.
    // We want to specify that they are to remain Date objects so that
    // we can handle them in our code later on. Note that data paths are not
    // cloned (see _GetComponentDeferredDataPaths)
      noClonePaths.start = true;
      noClonePaths.end = true;
      noClonePaths.viewportStart = true;
      noClonePaths.viewportEnd = true;
      noClonePaths.referenceObjects = { value: true };
      return noClonePaths;
    },

    // @inheritdoc
    _GetComponentDeferredDataPaths: function () {
      return { root: ['rows', 'dependencies', 'taskData', 'dependencyData'] };
    },

    // @inheritdoc
    _GetSimpleDataProviderConfigs: function () {
      return {
        dependencyData: {
          templateName: 'dependencyTemplate',
          templateElementName: 'oj-gantt-dependency',
          resultPath: 'dependencies',
          expandedKeySet: new KeySet.ExpandAllKeySet()
        },
        taskData: {
          templateName: 'taskTemplate',
          templateElementName: 'oj-gantt-task',
          resultPath: 'rows',
          expandedKeySet: new KeySet.ExpandAllKeySet()
        }
      };
    },

    // @inheritdoc
    _GetDataProviderSeriesConfig: function () {
      return {
        dataProperty: 'taskData',
        idAttribute: 'rowId',
        itemsKey: 'tasks',
        templateName: 'rowTemplate',
        templateElementName: 'oj-gantt-row'
      };
    },

    /**
     * {@ojinclude "name":"nodeContextDoc"}
     * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
     * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
     * @ojsignature {target:"Type", value:"{subId: 'oj-gantt-row-label', index: number} | {subId: 'oj-gantt-taskbar', rowIndex: number, index: number} | null", jsdocOverride: true, for:"returns"}
     *
     * @example {@ojinclude "name":"nodeContextExample"}
     *
     * @expose
     * @instance
     * @memberof oj.ojGantt
     */
    getContextByNode: function (node) {
      // context objects are documented with @ojnodecontext
      var context = this.getSubIdByNode(node);
      if (context && context.subId !== 'oj-gantt-tooltip') {
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
 *    <tr>
 *       <td rowspan="4">Task</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selection-mode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Move when <code class="prettyprint">dnd.move.tasks</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="3">Chart Area</td>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Pan.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Pinch-close</kbd></td>
 *       <td>Zoom Out.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Spread-open</kbd></td>
 *       <td>Zoom In.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Zoom Control</td>
 *       <td><kbd>Tap on "+" element</kbd></td>
 *       <td>Zoom In.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tap on "-" element</kbd></td>
 *       <td>Zoom Out.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojGantt
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
 *       <td><kbd>= or +</kbd></td>
 *       <td>Zoom in one level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>- or _</kbd></td>
 *       <td>Zoom out one level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageUp or PageDown</kbd></td>
 *       <td>
 *         <ul>
 *           <li>Pan up / down.</li>
 *           <li>If currently in move mode (see <kbd>Ctrl + m</kbd>), select the amount of time greater / less than the current move by amount in the following ramp: years, quarters, months, weeks, days, hours, minutes, seconds, milliseconds. For example, if the current move by amount is weeks, <kbd>PageUp</kbd> or <kbd>PageDown</kbd> would change the amount to months or days respectively.</li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageUp or PageDown</kbd></td>
 *       <td>Pan left/right (RTL: Pan right/left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>
 *         <ul>
 *           <li>When focus is on a task, move focus and selection to the task on the left within the same row.  In LTR reading direction, if this is the first task within the row, then move focus and selection to the last task in the previous row. In RTL reading direction, if this is the last task within the row, then move focus and selection to the first task in the next row.</li>
 *           <li>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>), move focus to the predecessor task (RTL: successor task).</li>
 *           <li>If currently in move mode (see <kbd>Ctrl + m</kbd>), move the candidate position to the left by some amount of time. Upon entering move mode, the amount of time is set to the scale of the minor axis. See <kbd>PageUp or PageDown</kbd> for information on changing the amount of time to move by.</li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>
 *         <ul>
 *           <li>When focus is on a task, move focus and selection to the task on the right within the same row.  In LTR reading direction, if this is the last task within the row, then move focus and selection to the first task in the next row. In RTL reading direction, if this is the first task within the row, then move focus and selection to the last task in the previous row.</li>
 *           <li>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>), move focus to the successor task (RTL: predecessor task).</li>
 *           <li>If currently in move mode (see <kbd>Ctrl + m</kbd>), move the candidate position to the right by some amount of time. Upon entering move mode, the amount of time is set to the scale of the minor axis. See <kbd>PageUp or PageDown</kbd> for information on changing the amount of time to move by.</li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>
 *         <ul>
 *           <li>When focus is on a task, move focus and selection to first task in the previous row.</li>
 *           <li>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>), move focus to the previous dependency line with the same predecessor/successor.</li>
 *           <li>If currently in move mode (see <kbd>Ctrl + m</kbd>), move the candidate position to the row above, preserving current time position.</li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>
 *         <ul>
 *           <li>When focus is on a task, move focus and selection to first task in the next row.</li>
 *           <li>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>), move focus to the next dependency line with the same predecessor/successor.</li>
 *           <li>If currently in move mode (see <kbd>Ctrl + m</kbd>), move the candidate position to the row below, preserving current time position.</li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Space</kbd></td>
 *       <td>Multi-select task with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + &lt;task navigation shortcut&gt;</kbd></td>
 *       <td>Move focus and multi-select a task.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + &lt;task navigation shortcut&gt;</kbd></td>
 *       <td>Move focus to a task but do not select.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + &lt; or Alt + ,</kbd></td>
 *       <td>Move focus from a task to an associated dependency line connecting to a predecessor task (RTL: successor task). Note that the dependency line must have been
 *        created referencing the task's ID in its predecessor/successorTask objects for an association to exist. Also note that when focus is on a dependency line, the <kbd>UpArrow</kbd> and <kbd>DownArrow</kbd> keys are used to move focus to the next dependency line with the same predecessor/successor.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + &gt; or Alt + .</kbd></td>
 *       <td>Move focus from a task to an associated dependency line connecting to a successor task (RTL: predecessor task). Note that the dependency line must have been
 *        created referencing the task's ID in its predecessor/successorTask objects for an association to exist. Also note that when focus is on a dependency line, the <kbd>UpArrow</kbd> and <kbd>DownArrow</kbd> keys are used to move focus to the next dependency line with the same predecessor/successor.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Mousewheel Up</kbd></td>
 *       <td>Zoom In.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Mousewheel Down</kbd></td>
 *       <td>Zoom Out.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + m</kbd></td>
 *       <td>When focus is on a task and <code class="prettyprint">dnd.move.tasks</code> is enabled, enter move mode. See also the <kbd>UpArrow</kbd>, <kbd>DownArrow</kbd>, <kbd>LeftArrow</kbd>, <kbd>RightArrow</kbd>, <kbd>PageUp or PageDown</kbd>, <kbd>Esc</kbd>, and <kbd>Enter</kbd> sections for more information.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Cancel drag or exit move mode, if currently dragging or in move mode (see <kbd>Ctrl + m</kbd>).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Finalize move, if currently in move mode (see <kbd>Ctrl + m</kbd>).</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojGantt
 */

/**
 *<p>The Gantt supports a simplified version of the ISO 8601 extended date/time format. The format is as follows: <font color="#4B8A08">YYYY-MM-DDTHH:mm:ss.sssZ</font></p>
 *<table  class="keyboard-table">
 *<thead>
 *<tr>
 *<th>Symbol</th>
 *<th>Description</th>
 *<th>Values</th>
 *<th>Examples</th>
 *</tr>
 *</thead>
 *<tbody>
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
 * @memberof oj.ojGantt
 */

// PROPERTY TYPEDEFS

/**
 * @typedef {Object} oj.ojGantt.Dependency
 * @property {any} id The identifier for the dependency line. This must be unique across all dependency lines in Gantt. The id should be set by the application if the <a href="#dependencyData">dependency-data</a> oj.DataProvider is not being used. The row key will be used as id in the oj.DataProvider case.
 * @property {any} predecessorTaskId The identifier for the predecessor task. This must reference a task in Gantt.
 * @property {string=} shortDesc The description of the dependency line. This is used for accessibility.
 * @property {any} successorTaskId The identifier for the successor task. This must reference a task in Gantt.
 * @property {string=} svgClassName A space delimited list of CSS style classes to apply to the dependency line.
 * @property {Object=} svgStyle The CSS style defining the style of the dependency line.
 * @property {"startStart"|"startFinish"|"finishFinish"|"finishStart"} [type="finishStart"] The type of dependency. The following values are supported: <ul> <li>finishStart: predecessor task must finish before successor task can start.</li> <li>finishFinish: predecessor task must finish before successor task can finish.</li> <li>startStart: predecessor task must start before successor task can start.</li> <li>startFinish: predecessor task must start before successor task can finish.</li> </ul>
 * @ojsignature [{target: "Type", value: "K1", for: "id"},
 *               {target: "Type", value: "K2", for: "predecessorTaskId"},
 *               {target: "Type", value: "K2", for: "successorTaskId"},
 *               {target: "Type", value: "<K1, K2>", for:"genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.ReferenceObject
 * @property {string=} svgClassName A space delimited list of CSS style classes defining the style of the reference object. Note that only CSS style applicable to SVG elements can be used.
 * @property {Object=} svgStyle The CSS style defining the style of the reference object.
 * @property {string=} value The time value of this reference object. If not specified, no reference object will be shown. See <a href="#formats-section">Date and Time Formats</a> for more details on required string formats.
 */
/**
 * @typedef {Object} oj.ojGantt.Row
 * @property {any=} id The identifier for the row. Optional if the row contains only one task. This must be unique across all rows in Gantt.
 * @property {string=} label The label associated with the row.
 * @property {Object=} labelStyle The CSS style defining the style of the label. Only CSS style applicable to SVG elements can be used.
 * @property {Array.<oj.ojGantt.RowTask>} [tasks] An array of tasks. If not specified, no data will be shown. When only one of 'start' or 'end' value is specified, or when 'start' and 'end' values are equal, the task is considered a milestone task. Note that values of analogous properties from <a href="#taskDefaults">task-defaults</a> are used for any unspecified properties on the task, and values of any specified properties would override those from <a href="#taskDefaults">task-defaults</a>.
 * @ojsignature [{target: "Type", value: "Array<oj.ojGantt.RowTask<K2>>", for: "tasks"},
 *               {target: "Type", value: "<K2>", for:"genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.RowTask
 * @property {string=} borderRadius The border radius of the task. Accepts values allowed in CSS border-radius attribute. The default value comes from <a href="#taskDefaults.borderRadius">task-defaults.border-radius</a>.
 * @property {string=} end The end time of this task. Optional if task is a single date event like Milestone. Either start or end has to be defined in order for the task to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
 * @property {number=} height The height of the task in pixels. Since row heights can also be set via the <a href="#rowDefaults.height">row-defaults.height</a> attribute, applications typically should make sure that their task heights are less than the row height. The default value comes from <a href="#taskDefaults.height">task-defaults.height</a>.
 * @property {any} id The identifier for the task. This must be unique across all tasks in the Gantt, and is required in order for the Gantt to properly render. The id should be set by the application if the <a href="#taskData">task-data</a> oj.DataProvider is not being used. The row key will be used as id in the oj.DataProvider case.
 * @property {string=} label The label associated with the task.
 * @property {(string|Array.<string>)=} labelPosition The position of the label relative to the task. An array of values is also supported. If an array is specified, then the values are traversed until a position that can fully display the label is found. If 'max' is specified in the array, then of all the positions evaluated up to that point of the traversal, the one with the largest space is used (label is truncated to fit). Naturally, 'max' is ignored if it's specified as the first value of the array. If the last value of the array is reached, but the label cannot be fully displayed, then the label is placed at that position, truncated to fit. Due to space constraints in the milestone and task with progress cases, the inner positions will exhibit the following behaviors: <ul> <li> For milestones, specifying 'innerStart', 'innerEnd', or 'innerCenter' would be equivalent to specifying 'start', 'end', and 'end' respectively. </li> <li> For tasks with progress, 'innerCenter' means the label will be aligned to the end of the progress bar, either placed inside or outside of the progress, whichever is the larger space. 'innerStart' and 'innerEnd' positions are honored when there is enough space to show the label at those positions. Otherwise, the aforementioned 'innerCenter' behavior is exhibited. </li> </ul> The default value comes from <a href="#taskDefaults.labelPosition">task-defaults.label-position</a>.
 * @property {Object=} labelStyle The CSS style defining the style of the label. Only CSS style applicable to SVG elements can be used.
 * @property {string=} start The start time of this task. Optional if task is a single date event like Milestone. Either start or end has to be defined in order for the task to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
 * @property {string=} shortDesc The description of the task. This is used for accessibility and for customizing the tooltip text.
 * @property {string=} svgClassName A space delimited list of CSS style classes defining the style of the task. The default value comes from <a href="#taskDefaults.svgClassName">task-defaults.svg-class-name</a>.
 * @property {Object=} svgStyle The CSS style defining the style of the task. The default value comes from <a href="#taskDefaults.svgStyle">task-defaults.svg-style</a>.
 * @property {("normal"|"milestone"|"summary"|"auto")=} type Defines the task type to be rendered.<br></br>If "milestone", and if 'start' and 'end' values are specified and unequal, the 'start' value is used to evaluate position.<br></br>If "auto", the type is inferred from the data:<ul> <li>If 'start' and 'end' values are specified and unequal, "normal" type is assumed.</li> <li>Otherwise, "milestone" type is assumed.</li></ul> The default value comes from <a href="#taskDefaults.type">task-defaults.type</a>.
 * @property {Object=} progress Specifies the progress of the task. This property is ignored if the task is a milestone.
 * @property {string=} progress.borderRadius The border radius of the progress bar. Accepts values allowed in CSS border-radius attribute. The default value comes from <a href="#taskDefaults.progress.borderRadius">task-defaults.progress.border-radius</a>.
 * @property {string=} progress.height Specifies the height of the progress bar in pixels (e.g. '50px') or percent of the associated task bar (e.g. '15%'). The default value comes from <a href="#taskDefaults.progress.height">task-defaults.progress.height</a>.
 * @property {string=} progress.svgClassName A space delimited list of CSS style classes to apply to the progress bar. Note that only CSS style applicable to SVG elements can be used. The default value comes from <a href="#taskDefaults.progress.svgClassName">task-defaults.progress.svg-class-name</a>.
 * @property {Object=} progress.svgStyle The CSS inline style to apply to the progress bar. Only CSS style applicable to SVG elements can be used. The default value comes from <a href="#taskDefaults.progress.svgStyle">task-defaults.progress.svg-style</a>.
 * @property {number=} progress.value The value of the progress between 0 and 1 inclusive. If not specified or invalid, no progress will be shown.
 * @property {Object=} baseline Specifies the baseline of the task. When only one of 'start' or 'end' value is specified, or when 'start' and 'end' values are equal, the baseline is considered a milestone baseline.
 * @property {string=} baseline.borderRadius The border radius of the baseline. Accepts values allowed in CSS border-radius attribute. The default value comes from <a href="#taskDefaults.baseline.borderRadius">task-defaults.baseline.border-radius</a>.
 * @property {string=} baseline.end The end time of the baseline. Optional if baseline is a milestone. Either start or end has to be defined in order for the baseline to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
 * @property {number=} baseline.height The height of the baseline in pixels. The default value comes from <a href="#taskDefaults.baseline.height">task-defaults.baseline.height</a>.
 * @property {string=} baseline.start The start time of the baseline. Optional if baseline is a milestone. Either start or end has to be defined in order for the baseline to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
 * @property {string=} baseline.svgClassName A space delimited list of CSS style classes defining the style of the baseline. The default value comes from <a href="#taskDefaults.baseline.svgClassName">task-defaults.baseline.svg-class-name</a>.
 * @property {Object=} baseline.svgStyle The CSS style defining the style of the baseline. The default value comes from <a href="#taskDefaults.baseline.svgStyle">task-defaults.baseline.svg-style</a>.
 * @ojsignature [{target: "Type", value: "K2", for: "id"},
 *               {target: "Type", value: "<K2>", for:"genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.TooltipContext
 * @property {Element} parentElement The tooltip element. This can be used to change the tooltip border or background color.
 * @property {oj.ojGantt.RowTask} data The data object of the hovered task.
 * @property {oj.ojGantt.Row} rowData The data for the row the hovered task belongs to.
 * @property {Object|null} itemData The data provider row data object for the hovered task. This will only be set if an oj.DataProvider for <a href="#taskData">task-data</a> is being used.
 * @property {Element} componentElement The gantt element.
 * @property {string} color The color of the hovered task.
 * @ojsignature [{target: "Type", value: "oj.ojGantt.RowTask<K2>", for: "data"},
 *               {target: "Type", value: "oj.ojGantt.Row<K2>", for: "rowData"},
 *               {target: "Type", value: "D2", for: "itemData"},
 *               {target: "Type", value: "<K2, D2>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.RowAxisLabelRendererContext
 * @property {Element} parentElement A parent group element that takes a custom SVG fragment as the row label content. Modifications of the parentElement are not supported.
 * @property {oj.ojGantt.Row} rowData The data for the row.
 * @property {Array.<Object>|null} itemData An array of the data provider row data objects associated with the tasks belonging to the gantt row. This will only be set if an oj.DataProvider for <a href="#taskData">task-data</a> is being used.
 * @property {Element} componentElement The gantt element.
 * @property {number} maxWidth The maximum available width in px, as constrained by the row-axis.width and row-axis.max-width values. If row-axis.width is 'max-content' and row-axis.max-width is 'none', then this is -1, and the component will automatically allocate enough width space to accommodate the content.
 * @property {number} maxHeight The maximum available height in px.
 * @ojsignature [{target: "Type", value: "oj.ojGantt.Row<K2>", for: "rowData"},
 *               {target: "Type", value: "D2[]", for: "itemData"},
 *               {target: "Type", value: "<K2, D2>", for: "genericTypeParameters"}]
 */

// Slots

/**
 * <p>The <code class="prettyprint">dependencyTemplate</code> slot is used to specify the template for creating each dependency line of the gantt. The slot must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-gantt-dependency> element. The reference data provider is that of the <a href="#dependencyData">dependency-data</a> attribute.
 * See the [oj-gantt-dependency]{@link oj.ojGanttDependency} doc for more details.</p>
 * <p>When the template is executed for each task, it will have access to the gantt's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current dependency. (See the table below for a list of properties available on $current) </li>
 *   <li>alias - if <a href="#as">as</a> attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul>
 * @ojstatus preview
 * @ojslot dependencyTemplate
 * @ojmaxitems 1
 * @memberof oj.ojGantt
 * @property {Element} componentElement The &lt;oj-gantt> custom element
 * @property {Object} data The data object for the current dependency
 * @property {number} index The zero-based index of the curent dependency
 * @property {any} key The key of the current dependency
 *
 * @example <caption>Initialize the Gantt with an inline dependency template specified:</caption>
 * &lt;oj-gantt dependency-data="[[dependencyDataProvider]]">
 *   &lt;template slot="dependencyTemplate">
 *     &lt;oj-gantt-dependency
 *       predecessor-task-id="[[$current.data.predecessor]]"
 *       successor-task-id="[[$current.data.successor]]">
 *     &lt;/oj-gantt-dependency>
 *   &lt;/template>
 * &lt;/oj-gantt>
 */

 /**
 * <p>The <code class="prettyprint">rowTemplate</code> slot is used to specify the template for generating the row properties of the gantt. The slot must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-gantt-row> element.See the [oj-gantt-row]{@link oj.ojGanttRow} doc for more details.
 * See also the <a href="#taskTemplate">taskTemplate</a> regarding showing empty rows. Note that the rows will render following the order in which they are found in the data.</p>
 * <p>When the template is executed for each row, it will have access to the gantt's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current row. (See the table below for a list of properties available on $current) </li>
 *   <li>alias - if <a href="#as">as</a> attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul>
 * @ojstatus preview
 * @ojslot rowTemplate
 * @ojmaxitems 1
 * @memberof oj.ojGantt
 * @property {Element} componentElement The &lt;oj-gantt> custom element
 * @property {number} index The row index
 * @property {any} id The row id, if specified in the task template. Otherwise, it's the single task per row case, and this would be the task id.
 * @property {Array<Object>} tasks The array of objects which are gantt tasks that belong to this row. The objects will have the following properties
 * @property {Object} tasks.data The data object for the task
 * @property {number} tasks.index The zero-based index of the task
 * @property {any} tasks.key The key of the task
 *
 * @example <caption>Initialize the Gantt with an inline row template specified:</caption>
 * &lt;oj-gantt task-data="[[taskDataProvider]]">
 *   &lt;template slot="rowTemplate">
 *     &lt;oj-gantt-row
 *       label="[[$current.tasks[0].data.resource]]">
 *     &lt;/oj-gantt-row>
 *   &lt;/template>
 * &lt;/oj-gantt>
 */

/**
 * <p>The <code class="prettyprint">taskTemplate</code> slot is used to specify the template for creating each task of the gantt. The slot must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-gantt-task> element. The reference data provider is that of the <a href="#taskData">task-data</a> attribute.
 * See the [oj-gantt-task]{@link oj.ojGanttTask} doc for more details.
 * The [row-id]{@link oj.ojGanttTask#rowId} is optional if there is only one task in the row for every row; otherwise it must be specified.
 * Note that if invalid values for both task start and end are specified, then the task is not rendered; if all the tasks belonging to a row are not rendered, the row will appear as an empty row.</p>
 * <p>When the template is executed for each task, it will have access to the gantt's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current task. (See the table below for a list of properties available on $current) </li>
 *   <li>alias - if <a href="#as">as</a> attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul>
 * @ojstatus preview
 * @ojslot taskTemplate
 * @ojmaxitems 1
 * @memberof oj.ojGantt
 * @property {Element} componentElement The &lt;oj-gantt> custom element
 * @property {Object} data The data object for the current task
 * @property {number} index The zero-based index of the curent task
 * @property {any} key The key of the current task
 *
 * @example <caption>Initialize the Gantt with an inline task template specified:</caption>
 * &lt;oj-gantt task-data="[[taskDataProvider]]">
 *   &lt;template slot="taskTemplate">
 *     &lt;oj-gantt-task
 *       row-id="[[$current.data.resource]]"
 *       start="[[$current.data.begin]]"
 *       end="[[$current.data.finish]]">
 *     &lt;/oj-gantt-task>
 *   &lt;/template>
 * &lt;/oj-gantt>
 */

// KEEP FOR WIDGET SYNTAX

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for Gantt task (including milestone) at a specified index.</p>
 *
 * @property {number} rowIndex
 * @property {number} index
 *
 * @ojsubid oj-gantt-taskbar
 * @memberof oj.ojGantt
 *
 * @example <caption>Get the second task of the first row:</caption>
 * var nodes = myGantt.getNodeBySubId({'subId': 'oj-gantt-taskbar', 'rowIndex': 0, 'index': 1});
 */

 /**
 * <p>Sub-ID for Gantt row label at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojsubid oj-gantt-row-label
 * @memberof oj.ojGantt
 *
 * @example <caption>Get the label of the first row:</caption>
 * var nodes = myGantt.getNodeBySubId({'subId': 'oj-gantt-row-label', 'index': 0});
 */

 /**
 * <p>Sub-ID for the the Gantt tooltip.</p>
 *
 * @ojsubid oj-gantt-tooltip
 * @memberof oj.ojGantt
 *
 * @example <caption>Get the tooltip object of the gantt, if displayed:</caption>
 * var nodes = myGantt.getNodeBySubId({'subId': 'oj-gantt-tooltip'});
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for Gantt task at a specified index.</p>
 *
 * @property {number} rowIndex
 * @property {number} index
 *
 * @ojnodecontext oj-gantt-taskbar
 * @memberof oj.ojGantt
 */

/**
 * <p>Context for Gantt row label at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojnodecontext oj-gantt-row-label
 * @memberof oj.ojGantt
 */

/**
 * @ojcomponent oj.ojGanttDependency
 * @ojsignature {target: "Type", value:"class ojGanttDependency extends JetElement<ojGanttDependencySettableProperties>"}
 * @ojslotcomponent
 * @since 5.2.0
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Gantt Dependency
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-gantt-dependency element is used to declare properties for gantt dependency lines and is only valid as the
 *  child of a template element for the [dependencyTemplate]{@link oj.ojGantt#dependencyTemplate} slot of oj-gantt.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-gantt dependency-data="[[dependencyDataProvider]]">
 *   &lt;template slot="dependencyTemplate">
 *     &lt;oj-gantt-dependency
 *       predecessor-task-id="[[$current.data.predecessor]]"
 *       successor-task-id="[[$current.data.successor]]">
 *     &lt;/oj-gantt-dependency>
 *   &lt;/template>
 * &lt;/oj-gantt>
 * </code>
 * </pre>
 */

/**
 * The identifier for the predecessor task. This must reference a task in Gantt.
 * @expose
 * @name predecessorTaskId
 * @memberof! oj.ojGanttDependency
 * @instance
 * @type {any}
 *
 * @example <caption>Initialize the gantt dependency with the
 * <code class="prettyprint">predecessor-task-id</code> attribute specified:</caption>
 * &lt;oj-gantt-dependency predecessor-task-id="[[$current.data.predecessor]]">&lt;/oj-gantt-dependency>
 */
/**
 * The description of the dependency line. This is used for accessibility.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojGanttDependency
 * @instance
 * @type {?string}
 * @default null
 *
 * @example <caption>Initialize the gantt dependency with the
 * <code class="prettyprint">short-desc</code> attribute specified:</caption>
 * &lt;oj-gantt-dependency short-desc="[[$current.data.shortDesc]]">&lt;/oj-gantt-dependency>
 */
/**
 * The identifier for the successor task. This must reference a task in Gantt.
 * @expose
 * @name successorTaskId
 * @memberof! oj.ojGanttDependency
 * @instance
 * @type {any}
 *
 * @example <caption>Initialize the gantt dependency with the
 * <code class="prettyprint">successor-task-id</code> attribute specified:</caption>
 * &lt;oj-gantt-dependency successor-task-id="[[$current.data.successor]]">&lt;/oj-gantt-dependency>
 */
/**
 * A space delimited list of CSS style classes to apply to the dependency line.
 * @expose
 * @name svgClassName
 * @memberof! oj.ojGanttDependency
 * @instance
 * @type {string}
 * @default ""
 *
 * @example <caption>Initialize the gantt dependency with the
 * <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
 * &lt;oj-gantt-dependency svg-class-name="dependencyStyle">&lt;/oj-gantt-dependency>
 */
/**
 * The CSS style defining the style of the dependency line.
 * @expose
 * @name svgStyle
 * @memberof! oj.ojGanttDependency
 * @instance
 * @type {Object}
 * @default {}
 *
 * @example <caption>Initialize the gantt dependency with the
 * <code class="prettyprint">svg-style</code> attribute specified:</caption>
 * &lt;oj-gantt-dependency svg-style='{"stroke": "red"}'>&lt;/oj-gantt-dependency>
 */
/**
 * The type of dependency.
 * @expose
 * @name type
 * @memberof! oj.ojGanttDependency
 * @instance
 * @type {string}
 * @ojvalue {string} "finishStart" predecessor task must finish before successor task can start
 * @ojvalue {string} "finishFinish" predecessor task must finish before successor task can finish
 * @ojvalue {string} "startStart" predecessor task must start before successor task can start
 * @ojvalue {string} "startFinish" predecessor task must start before successor task can finish
 * @default "finishStart"
 *
 * @example <caption>Initialize the gantt dependency with the
 * <code class="prettyprint">type</code> attribute specified:</caption>
 * &lt;oj-gantt-dependency type="[[$current.data.type]]">&lt;/oj-gantt-dependency>
 */

/**
 * @ojcomponent oj.ojGanttRow
 * @ojsignature {target: "Type", value:"class ojGanttRow extends JetElement<ojGanttRowSettableProperties>"}
 * @ojslotcomponent
 * @since 5.2.0
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Gantt Row
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-gantt-row element is used to declare properties for gantt rows and is only valid as the
 *  child of a template element for the [rowTemplate]{@link oj.ojGantt#rowTemplate} slot of oj-gantt.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-gantt task-data="[[taskDataProvider]]">
 *   &lt;template slot="rowTemplate">
 *     &lt;oj-gantt-row
 *       label="[[$current.tasks[0].data.resource]]">
 *     &lt;/oj-gantt-row>
 *   &lt;/template>
 * &lt;/oj-gantt>
 * </code>
 * </pre>
 */

/**
 * The label associated with the row.
 * @expose
 * @name label
 * @memberof! oj.ojGanttRow
 * @instance
 * @type {string}
 * @default ""
 *
 * @example <caption>Initialize the gantt row with the
 * <code class="prettyprint">label</code> attribute specified:</caption>
 * &lt;oj-gantt-row label="[[$current.tasks[0].data.resource]]">&lt;/oj-gantt-row>
 */
/**
 * The CSS style defining the style of the label. Only CSS style applicable to SVG elements can be used.
 * @expose
 * @name labelStyle
 * @memberof! oj.ojGanttRow
 * @instance
 * @type {Object}
 * @default {}
 *
 * @example <caption>Initialize the gantt row with the
 * <code class="prettyprint">label-style</code> attribute specified:</caption>
 * &lt;oj-gantt-row label-style='[[($current.tasks[0].data.type === "summary") ? {"fontWeight": 500} : {}]]'>&lt;/oj-gantt-row>
 */

/**
 * @ojcomponent oj.ojGanttTask
 * @ojsignature {target: "Type", value:"class ojGanttTask extends JetElement<ojGanttTaskSettableProperties>"}
 * @ojslotcomponent
 * @since 5.2.0
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Gantt Task
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-gantt-task element is used to declare properties for gantt tasks and is only valid as the
 *  child of a template element for the [taskTemplate]{@link oj.ojGantt#taskTemplate} slot of oj-gantt.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-gantt task-data="[[taskDataProvider]]">
 *   &lt;template slot="taskTemplate">
 *     &lt;oj-gantt-task
 *       row-id="[[$current.data.resource]]"
 *       start="[[$current.data.begin]]"
 *       end="[[$current.data.finish]]">
 *     &lt;/oj-gantt-task>
 *   &lt;/template>
 * &lt;/oj-gantt>
 * </code>
 * </pre>
 */

/**
 * The border radius of the task. Accepts values allowed in CSS border-radius attribute.
 * The default value comes from the gantt's [task-defaults.border-radius]{@link oj.ojGantt#taskDefaults.borderRadius}.
 * @expose
 * @name borderRadius
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">border-radius</code> attribute specified:</caption>
 * &lt;oj-gantt-task border-radius="0">&lt;/oj-gantt-task>
 */
/**
 * The end time of this task. Optional if task is a single date event like Milestone.
 * Either start or end has to be defined in order for the task to properly render.
 * See [Date and Time Formats]{@link oj.ojGantt#formats-section} for more details on the required string formats.
 * @expose
 * @name end
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @ojformat date-time
 * @default ""
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">end</code> attribute specified:</caption>
 * &lt;oj-gantt-task end="[[$current.data.finish]]">&lt;/oj-gantt-task>
 */
/**
 * The height of the task in pixels.
 * Since row heights can also be set via the gantt's [row-defaults.height]{@link oj.ojGantt#rowDefaults.height} attribute,
 * applications typically should make sure that their task heights are less than the row height.
 * The default value comes from the gantt's [task-defaults.height]{@link oj.ojGantt#taskDefaults.height}.
 * @expose
 * @name height
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {?number}
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">height</code> attribute specified:</caption>
 * &lt;oj-gantt-task height="10">&lt;/oj-gantt-task>
 */
/**
 * The label associated with the task.
 * @expose
 * @name label
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @default ""
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">label</code> attribute specified:</caption>
 * &lt;oj-gantt-task label="[[$current.data.name]]">&lt;/oj-gantt-task>
 */
/**
 * The position of the label relative to the task. An array of values is also supported.
 * If an array is specified, then the values are traversed until a position that can fully display the label is found.
 * If 'max' is specified in the array, then of all the positions evaluated up to that point of the traversal, the one with the largest space is used (label is truncated to fit).
 * Naturally, 'max' is ignored if it's specified as the first value of the array.
 * If the last value of the array is reached, but the label cannot be fully displayed, then the label is placed at that position, truncated to fit.
 * Due to space constraints in the milestone and task with progress cases, the inner positions will exhibit the following behaviors:
 * <ul> <li> For milestones, specifying 'innerStart', 'innerEnd', or 'innerCenter' would be equivalent to specifying 'start', 'end', and 'end' respectively.
 * </li> <li> For tasks with progress, 'innerCenter' means the label will be aligned to the end of the progress bar, either placed inside or outside of the progress, whichever is the larger space.
 * 'innerStart' and 'innerEnd' positions are honored when there is enough space to show the label at those positions.
 * Otherwise, the aforementioned 'innerCenter' behavior is exhibited. </li> </ul>
 * The default value comes from the gantt's [task-defaults.label-position]{@link oj.ojGantt#taskDefaults.labelPosition}.
 * @ojshortdesc The position of the label relative to the task, or a priority order of label positions for the component to automatically choose from.
 * @expose
 * @name labelPosition
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string|Array.<string>}
 * @ojvalue {string} "start"
 * @ojvalue {string} "innerCenter"
 * @ojvalue {string} "innerStart"
 * @ojvalue {string} "innerEnd"
 * @ojvalue {string} "end"
 * @ojvalue {string} "none"
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">label-position</code> attribute specified:</caption>
 * &lt;oj-gantt-task label-position="innerCenter">&lt;/oj-gantt-task>
 */
/**
 * The CSS style defining the style of the label. Only CSS style applicable to SVG elements can be used.
 * @expose
 * @name labelStyle
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {Object}
 * @default {}
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">label-style</code> attribute specified:</caption>
 * &lt;oj-gantt-task label-style='{"fontWeight": 500}'>&lt;/oj-gantt-task>
 */
/**
 * The id for the row the task belongs to.
 * @expose
 * @name rowId
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {any=}
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">row-id</code> attribute specified:</caption>
 * &lt;oj-gantt-task row-id="[[$current.data.resource]]">&lt;/oj-gantt-task>
 */
/**
 * The start time of this task. Optional if task is a single date event like Milestone.
 * Either start or end has to be defined in order for the task to properly render.
 * See [Date and Time Formats]{@link oj.ojGantt#formats-section} for more details on the required string formats.
 * @expose
 * @name start
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @ojformat date-time
 * @default ""
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">start</code> attribute specified:</caption>
 * &lt;oj-gantt-task start="[[$current.data.begin]]">&lt;/oj-gantt-task>
 */
/**
 * The description of the task. This is used for accessibility and for customizing the tooltip text.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {?string}
 * @default null
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">short-desc</code> attribute specified:</caption>
 * &lt;oj-gantt-task short-desc="[[$current.data.shortDesc]]">&lt;/oj-gantt-task>
 */
/**
 * A space delimited list of CSS style classes defining the style of the task.
 * The default value comes from the gantt's [task-defaults.svg-class-name]{@link oj.ojGantt#taskDefaults.svgClassName}.
 * @expose
 * @name svgClassName
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
 * &lt;oj-gantt-task svg-class-name="taskStyle">&lt;/oj-gantt-task>
 */
/**
 * The CSS style defining the style of the task. The default value comes from the gantt's [task-defaults.svg-style]{@link oj.ojGantt#taskDefaults.svgStyle}.
 * @expose
 * @name svgStyle
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {Object}
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
 * &lt;oj-gantt-task svg-style="[[($current.data.status === "CRITICAL") ? {"fill": "red"} : {}]]">&lt;/oj-gantt-task>
 */
/**
 * Defines the task type to be rendered.
 * <br></br>If "milestone", and if 'start' and 'end' values are specified and unequal, the 'start' value is used to evaluate position.
 * <br></br>If "auto", the type is inferred from the data:
 * <ul> <li>If 'start' and 'end' values are specified and unequal, "normal" type is assumed.
 * </li> <li>Otherwise, "milestone" type is assumed.
 * </li></ul>
 * The default value comes from the gantt's [task-defaults.type]{@link oj.ojGantt#taskDefaults.type}.
 * @expose
 * @name type
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @ojvalue {string} "normal"
 * @ojvalue {string} "milestone"
 * @ojvalue {string} "summary"
 * @ojvalue {string} "auto"
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">type</code> attribute specified:</caption>
 * &lt;oj-gantt-task type="[[($current.data.type]]">&lt;/oj-gantt-task>
 */
/**
 * Specifies the progress of the task. This property is ignored if the task is a milestone.
 * @expose
 * @name progress
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {Object}
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">progress</code> attribute specified:</caption>
 * &lt;!-- Using dot notation -->
 * &lt;oj-gantt-task progress.value="[[$current.data.PROGRESS / 100]]">&lt;/oj-gantt-task>
 *
 * &lt;!-- Using JSON notation -->
 * &lt;oj-gantt-task progress="[[{"value": $current.data.progress / 100}]]">&lt;/oj-gantt-task>
 */
/**
 * The border radius of the progress bar. Accepts values allowed in CSS border-radius attribute.
 * The default value comes from the gantt's [task-defaults.progress.border-radius]{@link oj.ojGantt#taskDefaults.progress.borderRadius}.
 * <br></br>See the <a href="#progress">progress</a> attribute for usage examples.
 * @expose
 * @name progress.borderRadius
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @ojsignature {target: "Type", value: "?"}
 */
/**
 * Specifies the height of the progress bar in pixels (e.g. '50px') or percent of the associated task bar (e.g. '15%').
 * The default value comes from the gantt's [task-defaults.progress.height]{@link oj.ojGantt#taskDefaults.progress.height}.
 * <br></br>See the <a href="#progress">progress</a> attribute for usage examples.
 * @expose
 * @name progress.height
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @ojsignature {target: "Type", value: "?"}
 */
/**
 * A space delimited list of CSS style classes to apply to the progress bar. Note that only CSS style applicable to SVG elements can be used.
 * The default value comes from the gantt's [task-defaults.progress.svg-class-name]{@link oj.ojGantt#taskDefaults.progress.svgClassName}.
 * <br></br>See the <a href="#progress">progress</a> attribute for usage examples.
 * @expose
 * @name progress.svgClassName
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @ojsignature {target: "Type", value: "?"}
 */
/**
 * The CSS inline style to apply to the progress bar. Only CSS style applicable to SVG elements can be used.
 * The default value comes from the gantt's [task-defaults.progress.svg-style]{@link oj.ojGantt#taskDefaults.progress.svgStyle}.
 * <br></br>See the <a href="#progress">progress</a> attribute for usage examples.
 * @expose
 * @name progress.svgStyle
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {Object}
 * @ojsignature {target: "Type", value: "?"}
 */
/**
 * The value of the progress between 0 and 1 inclusive. If not specified or invalid, no progress will be shown.
 * <br></br>See the <a href="#progress">progress</a> attribute for usage examples.
 * @expose
 * @name progress.value
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {?number}
 * @ojsignature {target: "Type", value: "?"}
 * @default null
 */
/**
 * Specifies the baseline of the task.
 * When only one of 'start' or 'end' value is specified, or when 'start' and 'end' values are equal, the baseline is considered a milestone baseline.
 * @expose
 * @name baseline
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {Object}
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">progress</code> attribute specified:</caption>
 * &lt;!-- Using dot notation -->
 * &lt;oj-gantt-task baseline.start="[[$current.data.plannedBegin]]" baseline.end="[[$current.data.plannedFinish]]">&lt;/oj-gantt-task>
 *
 * &lt;!-- Using JSON notation -->
 * &lt;oj-gantt-task baseline="[[{"start": $current.data.plannedBegin, "end": $current.data.plannedFinish}]]">&lt;/oj-gantt-task>
 */
/**
 * The border radius of the baseline. Accepts values allowed in CSS border-radius attribute.
 * The default value comes from the gantt's [task-defaults.baseline.border-radius]{@link oj.ojGantt#taskDefaults.baseline.borderRadius}.
 * <br></br>See the <a href="#baseline">baseline</a> attribute for usage examples.
 * @expose
 * @name baseline.borderRadius
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @ojsignature {target: "Type", value: "?"}
 */
/**
 * The end time of the baseline.
 * Optional if baseline is a milestone.
 * Either start or end has to be defined in order for the baseline to properly render.
 * See [Date and Time Formats]{@link oj.ojGantt#formats-section} for more details on the required string formats.
 * <br></br>See the <a href="#baseline">baseline</a> attribute for usage examples.
 * @expose
 * @name baseline.end
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @ojformat date-time
 * @ojsignature {target: "Type", value: "?"}
 * @default ""
 */
/**
 * The height of the baseline in pixels.
 * The default value comes from the gantt's [task-defaults.baseline.height]{@link oj.ojGantt#taskDefaults.baseline.height}.
 * <br></br>See the <a href="#baseline">baseline</a> attribute for usage examples.
 * @expose
 * @name baseline.height
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {?number}
 * @ojsignature {target: "Type", value: "?"}
 */
/**
 * The start time of the baseline.
 * Optional if baseline is a milestone.
 * Either start or end has to be defined in order for the baseline to properly render.
 * See [Date and Time Formats]{@link oj.ojGantt#formats-section} for more details on the required string formats.
 * <br></br>See the <a href="#baseline">baseline</a> attribute for usage examples.
 * @expose
 * @name baseline.start
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @ojformat date-time
 * @ojsignature {target: "Type", value: "?"}
 * @default ""
 */
/**
 * A space delimited list of CSS style classes defining the style of the baseline.
 * The default value comes from the gantt's [task-defaults.baseline.svg-class-name]{@link oj.ojGantt#taskDefaults.baseline.svgClassName}.
 * <br></br>See the <a href="#baseline">baseline</a> attribute for usage examples.
 * @expose
 * @name baseline.svgClassName
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 * @ojsignature {target: "Type", value: "?"}
 */
/**
 * The CSS style defining the style of the baseline.
 * The default value comes from the gantt's [task-defaults.baseline.svg-style]{@link oj.ojGantt#taskDefaults.baseline.svgStyle}.
 * <br></br>See the <a href="#baseline">baseline</a> attribute for usage examples.
 * @expose
 * @name baseline.svgStyle
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {Object}
 * @ojsignature {target: "Type", value: "?"}
 */

/* global __oj_gantt_metadata:false */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
  __oj_gantt_metadata.extension._WIDGET_NAME = 'ojGantt';
  oj.CustomElementBridge.register('oj-gantt', { metadata: __oj_gantt_metadata });
}());

/* global __oj_gantt_dependency_metadata:false */
(function () {
  __oj_gantt_dependency_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-gantt-dependency', {
    metadata: __oj_gantt_dependency_metadata
  });
}());

/* global __oj_gantt_task_metadata:false */
(function () {
  __oj_gantt_task_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-gantt-task', {
    metadata: __oj_gantt_task_metadata
  });
}());

/* global __oj_gantt_row_metadata:false */
(function () {
  __oj_gantt_row_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-gantt-row', {
    metadata: __oj_gantt_row_metadata
  });
}());

});