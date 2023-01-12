/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import $ from 'jquery';
import { setDefaultOptions, createDynamicPropertyGetter } from 'ojs/ojcomponentcore';
import 'ojs/ojtime-base';
import { Gantt } from 'ojs/ojgantt-toolkit';
import 'ojs/ojkeyset';
import 'ojs/ojdvttimecomponentscale';
import { error } from 'ojs/ojlogger';
import { IntlDateTimeConverter } from 'ojs/ojconverter-datetime';
import { IntlNumberConverter } from 'ojs/ojconverter-number';
import { parseJSONFromFontFamily } from 'ojs/ojthemeutils';

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
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
    "dependencyLineShape": {
      "type": "string",
      "enumValues": [
        "rectilinear",
        "straight"
      ],
      "value": "rectilinear"
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
    "dragMode": {
      "type": "string",
      "enumValues": [
        "pan",
        "select"
      ],
      "value": "pan"
    },
    "end": {
      "type": "string",
      "value": ""
    },
    "expanded": {
      "type": "KeySet",
      "writeback": true
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
          "properties": {
            "days": {
              "type": "object"
            },
            "default": {
              "type": "object"
            },
            "hours": {
              "type": "object"
            },
            "minutes": {
              "type": "object"
            },
            "months": {
              "type": "object"
            },
            "quarters": {
              "type": "object"
            },
            "seconds": {
              "type": "object"
            },
            "weeks": {
              "type": "object"
            },
            "years": {
              "type": "object"
            }
          }
        },
        "height": {
          "type": "number"
        },
        "scale": {
          "type": "string|DvtTimeComponentScale",
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
          "type": "Array<(string|DvtTimeComponentScale)>"
        }
      }
    },
    "minorAxis": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object",
          "properties": {
            "days": {
              "type": "object"
            },
            "default": {
              "type": "object"
            },
            "hours": {
              "type": "object"
            },
            "minutes": {
              "type": "object"
            },
            "months": {
              "type": "object"
            },
            "quarters": {
              "type": "object"
            },
            "seconds": {
              "type": "object"
            },
            "weeks": {
              "type": "object"
            },
            "years": {
              "type": "object"
            }
          }
        },
        "height": {
          "type": "number"
        },
        "scale": {
          "type": "string|DvtTimeComponentScale",
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
          "type": "Array<(string|DvtTimeComponentScale)>"
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
              "type": "function"
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
    "rowData": {
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
    "selectionBehavior": {
      "type": "string",
      "enumValues": [
        "highlightDependencies",
        "normal"
      ],
      "value": "normal"
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
    "taskAggregation": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "off"
    },
    "taskData": {
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
    "taskDefaults": {
      "type": "object",
      "properties": {
        "attribute": {
          "type": "object",
          "properties": {
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
        "baseline": {
          "type": "object",
          "properties": {
            "borderRadius": {
              "type": "string"
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
          "type": "string"
        },
        "downtime": {
          "type": "object",
          "properties": {
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
        "overlap": {
          "type": "object",
          "properties": {
            "behavior": {
              "type": "string",
              "enumValues": [
                "auto",
                "overlay",
                "stack",
                "stagger"
              ],
              "value": "auto"
            },
            "offset": {
              "type": "number"
            }
          }
        },
        "overtime": {
          "type": "object",
          "properties": {
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
        "progress": {
          "type": "object",
          "properties": {
            "borderRadius": {
              "type": "string"
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
        "resizable": {
          "type": "string",
          "enumValues": [
            "disabled",
            "enabled"
          ],
          "value": "disabled"
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
    "timeCursor": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "off"
    },
    "tooltip": {
      "type": "object",
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
        "accessibleContainsControls": {
          "type": "string"
        },
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
        "labelAttribute": {
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
        "labelDowntimeEnd": {
          "type": "string"
        },
        "labelDowntimeStart": {
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
        "labelLevel": {
          "type": "string"
        },
        "labelMoveBy": {
          "type": "string"
        },
        "labelNoData": {
          "type": "string"
        },
        "labelOvertimeEnd": {
          "type": "string"
        },
        "labelOvertimeStart": {
          "type": "string"
        },
        "labelProgress": {
          "type": "string"
        },
        "labelResizeBy": {
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
        "taskResizeCancelled": {
          "type": "string"
        },
        "taskResizeEndHandle": {
          "type": "string"
        },
        "taskResizeEndInitiated": {
          "type": "string"
        },
        "taskResizeFinalized": {
          "type": "string"
        },
        "taskResizeInitiatedInstruction": {
          "type": "string"
        },
        "taskResizeSelectionInfo": {
          "type": "string"
        },
        "taskResizeStartHandle": {
          "type": "string"
        },
        "taskResizeStartInitiated": {
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
        "attribute": {
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
        "downtimeEnd": {
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
        "downtimeStart": {
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
        "overtimeEnd": {
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
        "overtimeStart": {
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
        "progress": {
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
    },
    "zooming": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "on"
    }
  },
  "methods": {
    "getContextByNode": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojMove": {},
    "ojResize": {},
    "ojViewportChange": {}
  },
  "extension": {}
};
  __oj_gantt_metadata.extension._WIDGET_NAME = 'ojGantt';
  oj.CustomElementBridge.register('oj-gantt', { metadata: __oj_gantt_metadata });
})();

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
/* global __oj_gantt_dependency_metadata:false */
(function () {
  __oj_gantt_dependency_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-gantt-dependency', {
    metadata: __oj_gantt_dependency_metadata
  });
})();

var __oj_gantt_task_metadata = 
{
  "properties": {
    "attribute": {
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
        "shortDesc": {
          "type": "string|function"
        },
        "svgClassName": {
          "type": "string"
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
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
    "downtime": {
      "type": "object",
      "properties": {
        "end": {
          "type": "string",
          "value": ""
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
    "overlap": {
      "type": "object",
      "properties": {
        "behavior": {
          "type": "string",
          "enumValues": [
            "auto",
            "overlay",
            "stack",
            "stagger"
          ]
        }
      }
    },
    "overtime": {
      "type": "object",
      "properties": {
        "end": {
          "type": "string",
          "value": ""
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
      "type": "string|function"
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
    "taskId": {
      "type": "string"
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
/* global __oj_gantt_task_metadata:false */
(function () {
  __oj_gantt_task_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-gantt-task', {
    metadata: __oj_gantt_task_metadata
  });
})();

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
    },
    "referenceObjects": {
      "type": "Array<Object>",
      "value": []
    },
    "shortDesc": {
      "type": "string|function"
    },
    "tasks": {
      "type": "Array<Object>",
      "value": []
    }
  },
  "extension": {}
};
/* global __oj_gantt_row_metadata:false */
(function () {
  __oj_gantt_row_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-gantt-row', {
    metadata: __oj_gantt_row_metadata
  });
})();

var __oj_gantt_reference_object_metadata = 
{
  "properties": {
    "end": {
      "type": "string",
      "value": ""
    },
    "start": {
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
    }
  },
  "extension": {}
};
/* global __oj_gantt_reference_object_metadata:false */
(function () {
  __oj_gantt_reference_object_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-gantt-reference-object', {
    metadata: __oj_gantt_reference_object_metadata
  });
})();

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
 *       <td>Move when <code class="prettyprint">dnd.move.tasks</code> is enabled.
 *          Resize if start or end edge of task is dragged and <code class="prettyprint">task-defaults.resizable</code> is enabled.
 *       </td>
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
 *           <li>If currently in move (or resize) mode (see <kbd>Ctrl + m</kbd>, <kbd>Alt + s</kbd>, <kbd>Alt + e</kbd>),
 *              select the amount of time greater / less than the current move by amount in the following
 *              ramp: years, quarters, months, weeks, days, hours, minutes, seconds, milliseconds.
 *              For example, if the current move by amount is weeks,
 *              <kbd>PageUp</kbd> or <kbd>PageDown</kbd> would change the amount to months or days respectively.
 *           </li>
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
 *           <li>When focus is on a task, move focus and selection to the task on the left within the same row.
 *              In LTR reading direction, if this is the first task within the row, then move focus and selection to the last task in the previous row.
 *              In RTL reading direction, if this is the last task within the row, then move focus and selection to the first task in the next row.
 *           </li>
 *           <li>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>), move focus to the predecessor task (RTL: successor task).</li>
 *           <li>If currently in move (or resize) mode (see <kbd>Ctrl + m</kbd>, <kbd>Alt + s</kbd>, <kbd>Alt + e</kbd>),
 *              move the candidate position to the left by some amount of time. Upon entering move (or resize) mode,
 *              the amount of time is set to the scale of the minor axis.
 *              See <kbd>PageUp or PageDown</kbd> for information on changing the amount of time to move by.
 *           </li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>
 *         <ul>
 *           <li>When focus is on a task, move focus and selection to the task on the right within the same row.
 *              In LTR reading direction, if this is the last task within the row, then move focus and selection to the first task in the next row.
 *              In RTL reading direction, if this is the first task within the row, then move focus and selection to the last task in the previous row.
 *           </li>
 *           <li>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>), move focus to the successor task (RTL: predecessor task).</li>
 *           <li>If currently in move (or resize) mode (see <kbd>Ctrl + m</kbd>, <kbd>Alt + s</kbd>, <kbd>Alt + e</kbd>),
 *              move the candidate position to the right by some amount of time.
 *              Upon entering move (or resize) mode, the amount of time is set to the scale of the minor axis.
 *              See <kbd>PageUp or PageDown</kbd> for information on changing the amount of time to move by.
 *           </li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>
 *         <ul>
 *           <li>When focus is on a task, move focus and selection to first task in the previous row.</li>
 *           <li>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>),
 *              move focus to the previous dependency line with the same predecessor/successor.
 *           </li>
 *           <li>If currently in move mode (see <kbd>Ctrl + m</kbd>), move the candidate position to the row above, preserving current time position.</li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>
 *         <ul>
 *           <li>When focus is on a task, move focus and selection to first task in the next row.</li>
 *           <li>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>),
 *              move focus to the next dependency line with the same predecessor/successor.</li>
 *           <li>If currently in move mode (see <kbd>Ctrl + m</kbd>), move the candidate position to the row below, preserving current time position.</li>
 *         </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Shift + Space</kbd></td>
 *       <td>When focus is on a task, toggles expand/collapse on the containing row.</td>
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
 *       <td><kbd>Alt + LeftArrow</kbd></td>
 *       <td>When focus is on a task and if row labels are rendered, move focus to the row label.
 *          In RTL reading direction, the opposite happens: if focus is on a row label, move focus to the last focused task in the same row
 *          (or the first task in the row if there are no previously focused task from the row).
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + RightArrow</kbd></td>
 *       <td>When focus is on a row label move focus to the last focused task in the same row
 *          (or the first task in the row if there are no previously focused task from the row).
 *          In RTL reading direction, the opposite happens: if focus is on a task and if row labels are rendered, move focus to the row label.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>When focus is on a row label, collapse the row if it's currently expanded.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>When focus is on a row label, expand the row if it's currently collapsed.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + &lt; or Alt + ,</kbd></td>
 *       <td>Move focus from a task to an associated dependency line connecting to a predecessor task (RTL: successor task).
 *          Note that the dependency line must have been created referencing the task's ID in its predecessor/successorTask objects for an association to exist.
 *          Also note that when focus is on a dependency line, the <kbd>UpArrow</kbd> and <kbd>DownArrow</kbd> keys
 *          are used to move focus to the next dependency line with the same predecessor/successor.
 *        </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + &gt; or Alt + .</kbd></td>
 *       <td>Move focus from a task to an associated dependency line connecting to a successor task (RTL: predecessor task).
 *          Note that the dependency line must have been created referencing the task's ID in its predecessor/successorTask objects for an association to exist.
 *          Also note that when focus is on a dependency line, the <kbd>UpArrow</kbd> and <kbd>DownArrow</kbd> keys
 *          are used to move focus to the next dependency line with the same predecessor/successor.
 *       </td>
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
 *       <td>When focus is on a selected task and <code class="prettyprint">dnd.move.tasks</code> is enabled, enter move mode.
 *          See also the <kbd>UpArrow</kbd>, <kbd>DownArrow</kbd>, <kbd>LeftArrow</kbd>, <kbd>RightArrow</kbd>,
 *          <kbd>PageUp or PageDown</kbd>, <kbd>Esc</kbd>, and <kbd>Enter</kbd> sections for more information.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + s</kbd></td>
 *       <td>When focus is on a selected task and <code class="prettyprint">task-defaults.resizable</code> is enabled,
 *          enter resize (start) mode. See also the <kbd>LeftArrow</kbd>, <kbd>RightArrow</kbd>, <kbd>PageUp or PageDown</kbd>,
 *          <kbd>Esc</kbd>, and <kbd>Enter</kbd> sections for more information.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + e</kbd></td>
 *       <td>When focus is on a selected task and <code class="prettyprint">task-defaults.resizable</code> is enabled,
 *          enter resize (end) mode. See also the <kbd>LeftArrow</kbd>, <kbd>RightArrow</kbd>, <kbd>PageUp or PageDown</kbd>,
 *          <kbd>Esc</kbd>, and <kbd>Enter</kbd> sections for more information.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Cancel drag, or exit move or resize mode, if currently dragging,
 *          or in move mode (see <kbd>Ctrl + m</kbd>) or resize mode (see <kbd>Alt + s</kbd> and <kbd>Alt + e</kbd>).
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Finalize move or resize, if currently in move mode (see <kbd>Ctrl + m</kbd>) or resize mode (see <kbd>Alt + s</kbd> and <kbd>Alt + e</kbd>) respectively.</td>
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
 *<td><font color="#4B8A08">Z</font></td><td>The value in this position can be one of the following.
    If the value is omitted, character 'Z' should be used to specify UTC time.
    <br><ul><li><b>Z</b> indicates UTC time.</li>
      <li><b>+hh:mm</b> indicates that the input time is the specified offset after UTC time.</li>
      <li><b>-hh:mm</b> indicates that the input time is the absolute value of the specified offset before UTC time.</li>
    </ul>
  </td>
  <td></td>
  <td>2013-02-04T15:20:00-07:00<br>2013-02-04T15:20:00+05:00<br>2013-02-04T15:20:00Z</td>
 *</tr>
 *</tbody>
 *</table>
 *<p>The ISO format support short notations where the string must only include the date and not time, as in the following formats: YYYY, YYYY-MM, YYYY-MM-DD.</p>
 *<p>The ISO format does not support time zone names.
    You can use the Z position to specify an offset from UTC time.
    If you do not include a value in the Z position, UTC time is used.
    The correct format for UTC should always include character 'Z' if the offset time value is omitted.
    The date-parsing algorithms are browser-implementation-dependent and, for example,
    the date string '2013-02-27T17:00:00' will be parsed differently in Chrome vs Firefox vs IE.</p>
 *<p>You can specify midnight by using 00:00, or by using 24:00 on the previous day. The following two strings specify the same time: 2010-05-25T00:00Z and 2010-05-24T24:00Z.</p>
 *
 * @ojfragment formatsDoc
 * @memberof oj.ojGantt
 */

// PROPERTY TYPEDEFS

/**
 * @typedef {Object} oj.ojGantt.Dependency
 * @ojimportmembers oj.ojGanttDependencyProperties
 * @property {any} id The identifier for the dependency line.
 *    This must be unique across all dependency lines in Gantt.
 *    The id should be set by the application if the <a href="#dependencyData">dependency-data</a> DataProvider is not being used.
 *    The row key will be used as id in the  case.
 * @ojsignature [{target: "Type", value: "K1", for: "id"},
 *               {target: "Type", value: "K2", for: "predecessorTaskId"},
 *               {target: "Type", value: "K2", for: "successorTaskId"},
 *               {target: "Type", value: "<K1, K2=any>", for:"genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.ReferenceObject
 * @property {string=} svgClassName A space delimited list of CSS style classes defining the style of the reference object.
 *    Note that only CSS style applicable to SVG elements can be used.
 * @property {Object=} svgStyle The CSS style defining the style of the reference object. Only SVG CSS style properties are supported.
 * @property {string=} value The time value of this reference object. If not specified, no reference object will be shown.
 *    See <a href="#formats-section">Date and Time Formats</a> for more details on required string formats.
 * @property {("area"|"line")=} [type="line"] The type of reference object being shown.
 *    If the value is set to "area", use the start and end properties of the reference object.
 *    Otherwise, use the value property.
 * @property {string=} start The start time value of this reference object.
 *    See <a href="#formats-section">Date and Time Formats</a> for more details on required string formats, and see type for more details.
 * @property {string=} end The end time value of this reference object.
 *    See <a href="#formats-section">Date and Time Formats</a> for more details on required string formats, and see type for more details.
 * @property {string=} label The label of this reference object to be shown. This is not supported for type "area".
 * @property {string=} shortDesc The description of this object.
 *    This is used for accessibility and also for customizing the tooltip text.
 * @ojsignature [{target: "Type", value: "?Partial<CSSStyleDeclaration>", for: "svgStyle", jsdocOverride: true}]
 */
/**
 * @typedef {Object} oj.ojGantt.Row
 * @ojimportmembers oj.ojGanttRowProperties
 * @property {any=} id The identifier for the row. Optional if the row contains only one task. This must be unique across all rows in Gantt.
 * @property {Array.<Object>} [tasks] An array of tasks. If not specified, no data will be shown.</br>
 *    When only one of 'start' or 'end' value is specified, or when 'start' and 'end' values are equal, the task is considered a milestone task.
 *    Note that values of analogous properties from <a href="#taskDefaults">task-defaults</a> are used for any unspecified properties on the task,
 *    and values of any specified properties would override those from <a href="#taskDefaults">task-defaults</a>.
 * @property {Array.<Object>} [referenceObjects] An array of reference objects associated with the row.
 * @ojsignature [{target: "Type", value: "Array<oj.ojGantt.RowTask<K2,D2>>", for: "tasks", jsdocOverride:true},
 *               {target: "Type", value: "Array<Partial<oj.ojGantt.ReferenceObject>>", for: "referenceObjects", jsdocOverride:true},
 *               {target: "Type", value: "<K2=any, D2=any, K3=any, D3=any>", for:"genericTypeParameters"}]
 */
/**
 * Object type that defines a gantt data row item for the no template case, when data is set using the row-data attribute.
 * @typedef {Object} oj.ojGantt.DataRow
 * @ojimportmembers oj.ojGanttRowProperties
 * @property {Array.<Object>} [tasks] The tasks associated with the row.
 * @property {Array.<Object>} [referenceObjects] An array of reference objects associated with the row.
 * @ojsignature [{target: "Type", value: "Array<oj.ojGantt.DataTask<K2, D2>>", for: "tasks", jsdocOverride:true},
 *               {target: "Type", value: "Array<Partial<oj.ojGantt.ReferenceObject>>", for: "referenceObjects", jsdocOverride:true},
 *               {target: "Type", value: "<K3=any, D3=any, K2=any, D2=any>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.RowTask
 * @ojimportmembers oj.ojGanttTaskProperties
 * @property {any} id The identifier for the task.
 *    This must be unique across all tasks in the Gantt, and is required in order for the Gantt to properly render.
 * @ojsignature [{target: "Type", value: "K2", for: "id"},
 *               {target: "Type", value: "<K2=any, D2=any>", for: "genericTypeParameters"}]
 */
/**
 * Object type that defines a gantt data task item for the no template case.
 * @typedef {Object} oj.ojGantt.DataTask
 * @ojimportmembers oj.ojGanttTaskProperties
 * @property {any=} rowId The id for the row the task belongs to, if the data is set using the task-data attribute.
 * @property {string=} taskId The id for the task, if the data is set using the row-data attribute.
 * @ojsignature [{target: "Type", value: "<K2=any, D2=any>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.TooltipContext
 * @property {Element} parentElement The tooltip element. This can be used to change the tooltip border or background color.
 * @property {Object} data The data object of the hovered task.
 * @property {Object} rowData The data for the row the hovered task belongs to.
 * @property {Object|null} itemData The data provider data object for the hovered task.
 * @property {Element} componentElement The gantt element.
 * @property {string} color The color of the hovered task.
 * @ojsignature [{target: "Type", value: "oj.ojGantt.RowTask<K2,D2>", for: "data", jsdocOverride:true},
 *               {target: "Type", value: "oj.ojGantt.Row<K2,D2,K3,D3>", for: "rowData", jsdocOverride:true},
 *               {target: "Type", value: "D2", for: "itemData"},
 *               {target: "Type", value: "<K2=any, D2=any, K3=any, D3=any>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.RowShortDescContext
 * @property {Object} data The data for the row.
 * @property {Object|null} itemData The data provider data object for the row.
 * @ojsignature [{target: "Type", value: "oj.ojGantt.Row<any, any, K3, D3>", for: "data", jsdocOverride:true},
 *               {target: "Type", value: "D3", for: "itemData"},
 *               {target: "Type", value: "<K3, D3>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.TaskShortDescContext
 * @property {Object} data The data object of the hovered task.
 * @property {Object} rowData The data for the row the hovered task belongs to.
 * @property {Object|null} itemData The data provider data object for the hovered task.
 * @ojsignature [{target: "Type", value: "oj.ojGantt.RowTask<K2,D2>", for: "data", jsdocOverride:true},
 *               {target: "Type", value: "oj.ojGantt.Row<K2,D2,K3,D3>", for: "rowData", jsdocOverride:true},
 *               {target: "Type", value: "D2", for: "itemData"},
 *               {target: "Type", value: "<K2=any, D2=any, K3=any, D3=any>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.RowAxisLabelRendererContext
 * @property {Element} parentElement A parent group element that takes a custom SVG fragment as the row label content. Modifications of the parentElement are not supported.
 * @property {Object} rowData The data for the row.
 * @property {Array.<Object>|null} itemData An array of the data provider data objects associated with the tasks belonging to the gantt row.
 * @property {Element} componentElement The gantt element.
 * @property {number} maxWidth The maximum available width in px, as constrained by the row-axis.width and row-axis.max-width values.
 *    If row-axis.width is 'max-content' and row-axis.max-width is 'none',
 *    then this is -1, and the component will automatically allocate enough width space to accommodate the content.
 * @property {number} maxHeight The maximum available height in px.
 * @property {Object} data The data object for the row from the row-data DataProvider.
 * @property {number} depth The depth of the row. The depth of the outermost row under the invisible root is 1. This is available if the supplied row-data DataProvider is a TreeDataProvider.
 * @property {boolean} leaf True if the current row is a leaf row. This is available if the supplied row-data DataProvider is a TreeDataProvider.
 * @property {any} parentKey The key of the parent row. The parent key is null for (the invisible) root. This is available if the supplied row-data DataProvider is a TreeDataProvider.
 * @ojsignature [{target: "Type", value: "oj.ojGantt.Row<K2,D2,K3,D3>", for: "rowData", jsdocOverride:true},
 *               {target: "Type", value: "D2[]", for: "itemData"},
 *               {target: "Type", value: "D3|null", for: "data"},
 *               {target: "Type", value: "<K2=any, D2=any, K3=any, D3=any>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.DependencyTemplateContext
 * @property {Element} componentElement The &lt;oj-gantt> custom element
 * @property {Object} data The data object for the current dependency
 * @property {number} index The zero-based index of the current dependency
 * @property {any} key The key of the current dependency
 * @ojsignature [{target: "Type", value: "K1", for: "key"},
 *               {target: "Type", value: "D1", for: "data"},
 *               {target: "Type", value: "<K1, D1>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.RowTemplateContext
 * @ojdeprecated {since: '12.0.0', description: 'Set the data using the row-data attribute and use the RowMappingTemplateContext instead.'}
 * @property {Element} componentElement The &lt;oj-gantt> custom element
 * @property {number} index The row index
 * @property {any} id The row id, if specified in the task template. Otherwise, it's the single task per row case, and this would be the task id.
 * @property {Array<Object>} tasks The array of objects which are gantt tasks that belong to this row. The objects will have the following properties
 * @property {Object} tasks.data The data object for the task
 * @property {number} tasks.index The zero-based index of the task
 * @property {any} tasks.key The key of the task
 * @property {Array<Object>} tasks.parentData An array of data objects of the outermost to innermost parents of the task.
 * @property {any} tasks.parentKey The key of the parent task. The parent key is null for root tasks.
 */
/**
 * @typedef {Object} oj.ojGantt.TaskTemplateContext
 * @ojdeprecated {since: '12.0.0', description: 'Set the data using the row-data attribute and use the TaskMappingTemplateContext instead.'}
 * @property {Element} componentElement The &lt;oj-gantt> custom element
 * @property {Object} data The data object for the current task
 * @property {number} index The zero-based index of the current task
 * @property {any} key The key of the current task
 * @property {Array<Object>} parentData An array of data objects of the outermost to innermost parents of the task.
 * @property {any} parentKey The key of the parent task. The parent key is null for root tasks.
 */
/**
 * @typedef {Object} oj.ojGantt.RowMappingTemplateContext
 * @property {number} index The row index
 * @property {any} key The key of the row.
 * @property {Object} data The data object for the row.
 * @property {number} depth The depth of the row. The depth of the outermost row under the invisible root is 1. This is available if the supplied row-data DataProvider is a TreeDataProvider.
 * @property {boolean} leaf True if the current row is a leaf row. This is available if the supplied row-data DataProvider is a TreeDataProvider.
 * @property {any} parentKey The key of the parent row. The parent key is null for (the invisible) root. This is available if the supplied row-data DataProvider is a TreeDataProvider.
 * @ojsignature [{target: "Type", value: "K3", for: "key"},
 *               {target: "Type", value: "K3", for: "parentKey"},
 *               {target: "Type", value: "D3", for: "data"},
 *               {target: "Type", value: "<K3, D3>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.TaskMappingTemplateContext
 * @property {Object} data The data object for the current task
 * @property {number} index The index of the current task
 * @property {Object} rowData The data object for the row the task belongs to.
 * @ojsignature [{target: "Type", value: "D2", for: "data"},
 *               {target: "Type", value: "D3", for: "rowData"},
 *               {target: "Type", value: "<D2, D3>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.ReferenceObjectMappingTemplateContext
 * @property {Object} data The data object for the current reference object.
 * @property {number} index The index of the current reference object.
 * @property {Object} rowData The data object for the row the reference object belongs to.
 */
/**
 * @typedef {Object} oj.ojGantt.TaskContentTemplateContext
 * @property {Object} data The data object of the task.
 * @property {Object} rowData The data for the row the task belongs to.
 * @property {Object|null} itemData The data provider data object for the task.
 * @property {Object} content An object that describes the child content.
 * @property {number} content.height Height of the child content in pixels.
 * @property {number} content.width Width of the child content in pixels.
 * @property {Object} state An object that reflects the current state of the task.
 * @property {boolean} state.expanded True if the task is expanded.
 * @property {boolean} state.hovered True if the task is hovered.
 * @property {boolean} state.selected True if the task is selected.
 * @property {boolean} state.focused True if the task is focused.
 * @ojsignature [{target: "Type", value: "oj.ojGantt.RowTask<K2,D2>", for: "data", jsdocOverride:true},
 *               {target: "Type", value: "oj.ojGantt.Row<K2,D2,K3,D3>", for: "rowData", jsdocOverride:true},
 *               {target: "Type", value: "D2", for: "itemData"},
 *               {target: "Type", value: "<K2=any, D2=any, K3=any, D3=any>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojGantt.DependencyContentTemplateContext
 * @property {Object} data The data object of the dependency.
 * @property {Object|null} itemData The data provider row data object for the dependency.
 * @property {Object} content An object that describes the child content.
 * @property {number} content.predecessorX The x coordinate of the predecessor task endpoint.
 * @property {number} content.predecessorY The y coordinate of the predecessor task endpoint.
 * @property {number} content.successorX The x coordinate of the successor task endpoint.
 * @property {number} content.successorY The y coordinate of the successor task endpoint.
 * @property {Object} state An object that reflects the current state of the dependency.
 * @property {boolean} state.hovered True if the dependency is hovered.
 * @property {boolean} state.focused True if the dependency is focused.
 * @ojsignature [{target: "Type", value: "oj.ojGantt.Dependency<K1, K2>", for: "data", jsdocOverride:true},
 *               {target: "Type", value: "D1", for: "itemData"},
 *               {target: "Type", value: "<K1, K2=any, D1=any>", for: "genericTypeParameters"}]
 */

// Slots
/**
 * <p>The <code class="prettyprint">taskTemplate</code> slot is used to specify the template for creating each task of the gantt.
 * The slot content must be a single &lt;template> element.
 * The content of the template should only be one &lt;oj-gantt-task> element. The reference data provider is that of the <a href="#taskData">task-data</a> attribute.
 * See the [oj-gantt-task]{@link oj.ojGanttTask} doc for more details.
 * The [row-id]{@link oj.ojGanttTask#rowId} is optional if there is only one task in the row for every row; otherwise it must be specified.
 * Note that if invalid values for both task start and end are specified, then the task is not rendered;
 * if all the tasks belonging to a row are not rendered, the row will appear as an empty row.</p>
 * <p>When the template is executed for each task, it will have access to the gantt's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current task.
 *    (See [oj.ojGantt.TaskTemplateContext]{@link oj.ojGantt.TaskTemplateContext} or the table below for a list of properties available on $current)
 *   </li>
 *   <li>alias - if <a href="#as">as</a> attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul>
 *
 * @ojslot taskTemplate
 * @ojshortdesc The taskTemplate slot is used to specify the template for creating each task of the Gantt. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojGantt
 * @ojtemplateslotprops oj.ojGantt.TaskTemplateContext
 * @ojpreferredcontent ["GanttTaskElement"]
 * @ojdeprecated {since: '12.0.0', description: 'Set the data using the row-data attribute and use the TaskMappingTemplateContext instead.'}
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

/**
 * <p>The <code class="prettyprint">taskMappingTemplate</code> slot is used to specify the template for creating each task of the gantt.
 * The slot content must be a single &lt;template> element.
 * The content of the template should only be one &lt;oj-gantt-task> element. The reference data provider is that of the <a href="#rowData">row-data</a> attribute.
 * See the [oj-gantt-task]{@link oj.ojGanttTask} doc for more details.
 * Note that if invalid values for both task start and end are specified, then the task is not rendered.
 * <p>When the template is executed for each task, it will have access to the gantt's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current task.
 *    (See [oj.ojGantt.TaskMappingTemplateContext]{@link oj.ojGantt.TaskMappingTemplateContext} for a list of properties available on $current)
 *   </li>
 * </ul>
 *
 * @ojslot taskMappingTemplate
 * @ojshortdesc The taskMappingTemplate slot is used to specify the template for creating each task of the Gantt. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojGantt
 * @ojtemplateslotprops oj.ojGantt.TaskMappingTemplateContext
 * @ojpreferredcontent ["GanttTaskElement"]
 *
 * @example <caption>Initialize the Gantt with an inline task mapping template specified:</caption>
 * &lt;oj-gantt row-data="[[rowDataProvider]]">
 *   &lt;template slot="taskMappingTemplate">
 *     &lt;oj-gantt-task
 *       task-id="[[$current.data.ID]]"
 *       start="[[$current.data.begin]]"
 *       end="[[$current.data.finish]]">
 *     &lt;/oj-gantt-task>
 *   &lt;/template>
 * &lt;/oj-gantt>
 */

/**
 * <p>The <code class="prettyprint">dependencyTemplate</code> slot is used to specify the template for creating each dependency line of the gantt.
 * The slot content must be a single &lt;template> element.
 * The content of the template should only be one &lt;oj-gantt-dependency> element.
 * The reference data provider is that of the <a href="#dependencyData">dependency-data</a> attribute.
 * See the [oj-gantt-dependency]{@link oj.ojGanttDependency} doc for more details.</p>
 * <p>When the template is executed for each task, it will have access to the gantt's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current dependency.
 *    (See [oj.ojGantt.DependencyTemplateContext]{@link oj.ojGantt.DependencyTemplateContext} or the table below for a list of properties available on $current)
 *   </li>
 *   <li>alias - if <a href="#as">as</a> attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul>
 *
 * @ojslot dependencyTemplate
 * @ojshortdesc The dependencyTemplate slot is used to specify the template for creating each dependency line of the Gantt. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojGantt
 * @ojtemplateslotprops oj.ojGantt.DependencyTemplateContext
 * @ojpreferredcontent ["GanttDependencyElement"]
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
 * <p>The <code class="prettyprint">rowTemplate</code> slot is used to specify the template for generating the row properties of the gantt.
 * The slot content must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-gantt-row> element.See the [oj-gantt-row]{@link oj.ojGanttRow} doc for more details.
 * See also the <a href="#taskTemplate">taskTemplate</a> regarding showing empty rows. Note that the rows will render following the order in which they are found in the data.</p>
 * <p>When the template is executed for each row, it will have access to the gantt's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current row.
 *    (See [oj.ojGantt.RowTemplateContext]{@link oj.ojGantt.RowTemplateContext} or the table below for a list of properties available on $current)
 *   </li>
 *   <li>alias - if <a href="#as">as</a> attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul>
 *
 * @ojslot rowTemplate
 * @ojshortdesc The rowTemplate slot is used to specify the template for generating the row properties of the Gantt. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojGantt
 * @ojtemplateslotprops oj.ojGantt.RowTemplateContext
 * @ojpreferredcontent ["GanttRowElement"]
 * @ojdeprecated {since: '12.0.0', description: 'Set the data using the row-data attribute and use the RowMappingTemplateContext instead.'}
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
 * <p>The <code class="prettyprint">rowMappingTemplate</code> slot is used to specify the template for generating the row properties of the gantt.
 * The slot content must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-gantt-row> element. The reference data provider is that of the <a href="#rowData">row-data</a> attribute. See the [oj-gantt-row]{@link oj.ojGanttRow} doc for more details.</p>
 * <p>When the template is executed for each row, it will have access to the gantt's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current row.
 *    (See [oj.ojGantt.RowMappingTemplateContext]{@link oj.ojGantt.RowMappingTemplateContext} for a list of properties available on $current)
 *   </li>
 * </ul>
 *
 * @ojslot rowMappingTemplate
 * @ojshortdesc The rowTemplate slot is used to specify the template for generating the row properties of the Gantt. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojGantt
 * @ojtemplateslotprops oj.ojGantt.RowMappingTemplateContext
 * @ojpreferredcontent ["GanttRowElement"]
 *
 * @example <caption>Initialize the Gantt with an inline row mapping template specified:</caption>
 * &lt;oj-gantt row-data="[[rowDataProvider]]">
 *   &lt;template slot="rowMappingTemplate">
 *     &lt;oj-gantt-row
 *       label="[[$current.data.resource]]">
 *     &lt;/oj-gantt-row>
 *   &lt;/template>
 * &lt;/oj-gantt>
 */

/**
 * <p>The <code class="prettyprint">rowAxisLabelTemplate</code> slot is used to specify custom row axis label content. The slot content must be a single &lt;template> element.
 * This slot takes precedence over the rowAxis.label.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current row.
 *    (See [oj.ojGantt.RowAxisLabelRendererContext]{@link oj.ojGantt.RowAxisLabelRendererContext} or the table below for a list of properties available on $current)
 *   </li>
 * </ul>
 *
 *
 * @ojslot rowAxisLabelTemplate
 * @ojmaxitems 1
 * @ojshortdesc The rowAxisLabelTemplate slot is used to specify custom row axis label content. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojGantt.RowAxisLabelRendererContext
 * @memberof oj.ojGantt
 *
 * @example <caption>Initialize the Gantt with a row axis label template specified:</caption>
 * &lt;oj-gantt>
 *   &lt;template slot="rowAxisLabelTemplate">
 *     &lt;svg>
 *       &lt;g>
 *         &lt;image :href="[[$current.rowData.avatar]]" width="24", height="24">&lt;/image>
 *         &lt;text x="30", y="16">&lt;oj-bind-text value="[[$current.rowData.label]]">&lt;/oj-bind-text>&lt;/text>
 *       &lt;/g>
 *     &lt;/svg>
 *   &lt;/template>
 * &lt;/oj-gantt>
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content. The slot content must be a single &lt;template> element.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current task.
 *    (See [oj.ojGantt.TooltipContext]{@link oj.ojGantt.TooltipContext} or the table below for a list of properties available on $current)
 *   </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojmaxitems 1
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojGantt.TooltipContext
 * @memberof oj.ojGantt
 *
 * @example <caption>Initialize the Gantt with a tooltip template specified:</caption>
 * &lt;oj-gantt>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span>&lt;oj-bind-text value="[[$current.data.label]]">&lt;/oj-bind-text>&lt;/span>
 *    &lt;span>&lt;oj-bind-text value="[[$current.data.start + '-' $current.data.end]]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-gantt>
 */

/**
 * <p>The <code class="prettyprint">taskContentTemplate</code> slot is used to specify custom content to be placed inside the taskbar.
 * The slot content must be a single &lt;template> element.</p>
 * <p>Note that the content should be wrapped with a <code>svg</code> element in order to have the SVG namespace.
 * The component will insert the entire SVG structure into DOM including the outer <code>svg</code> element.</p>
 * <p>Note also that the (0,0) point is at the top left corner of the task in left-to-right reading direction, and at the top right corner in right-to-left reading direction.</p>
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current task.
 *    (See [oj.ojGantt.TaskContentTemplateContext]{@link oj.ojGantt.TaskContentTemplateContext} for a list of properties available on $current)
 *   </li>
 * </ul>
 *
 *
 * @ojslot taskContentTemplate
 * @ojmaxitems 1
 * @ojshortdesc The taskContentTemplate slot is used to specify custom content to be placed inside the taskbar. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojGantt.taskContentTemplate
 * @memberof oj.ojGantt
 *
 * @example <caption>Initialize the Gantt with a task content template specified:</caption>
 * &lt;oj-gantt>
 *   &lt;template slot="taskContentTemplate">
 *     &lt;g>
 *       &lt;text x="0" :y="[[ $current.content.height / 4 ]]">MultiLine Text 1&lt;/text>
 *       &lt;text x="0" :y="[[ $current.content.height / 2 ]]">MultiLine Text 2&lt;/text>
 *       &lt;text x="0" :y="[[ 3 * $current.content.height / 4 ]]">MultiLine Text 3&lt;/text>
 *     &lt;/g>
 *   &lt;/template>
 * &lt;/oj-gantt>
 */

/**
 * <p>The <code class="prettyprint">dependencyContentTemplate</code> slot is used to specify custom dependency lines.
 * The slot content must be a single &lt;template> element.</p>
 * <p>Note that the content should be wrapped with a <code>svg</code> element in order to have the SVG namespace.
 * The component will insert the entire SVG structure into DOM including the outer <code>svg</code> element.</p>
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current task.
 *    (See [oj.ojGantt.DependencyContentTemplateContext]{@link oj.ojGantt.DependencyContentTemplateContext} for a list of properties available on $current)
 *   </li>
 * </ul>
 *
 *
 * @ojslot dependencyContentTemplate
 * @ojmaxitems 1
 * @ojshortdesc The dependencyContentTemplate slot is used to specify custom dependency lines. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojGantt.dependencyContentTemplate
 * @memberof oj.ojGantt
 *
 * @example <caption>Initialize the Gantt with a dependency content template specified:</caption>
 * &lt;oj-gantt>
 *   &lt;template slot="dependencyContentTemplate">
 *     &lt;svg>
 *       &lt;path :d="[[ getPath($current.content) ]]" :stroke-width="[[ ($current.state.hovered || $current.state.focused) ? 3 : 1 ]]">
 *     &lt;/svg>
 *   &lt;/template>
 * &lt;/oj-gantt>
 */

/**
 * <p>The <code class="prettyprint">referenceObjectMappingTemplate</code> slot is used to specify the template for generating the row reference object properties of the gantt.
 * The slot content must be a &lt;template> element.
 * The content of the template should only be one &lt;oj-gantt-reference-object> element. The reference data provider is that of the <a href="#rowData">row-data</a> attribute. See the [oj-gantt-row]{@link oj.ojGanttRow} doc for more details.</p>
 * <p>When the template is executed for each reference object, it will have access to the gantt's binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current row reference object.
 *    (See [oj.ojGantt.ReferenceObjectMappingTemplateContext]{@link oj.ojGantt.ReferenceObjectMappingTemplateContext} for a list of properties available on $current)
 *   </li>
 * </ul>
 *
 * @ojslot referenceObjectMappingTemplate
 * @ojshortdesc The referenceObjectMappingTemplate slot is used to specify the template for generating the row reference object properties of the Gantt. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojGantt
 * @ojtemplateslotprops oj.ojGantt.ReferenceObjectMappingTemplateContext
 * @ojpreferredcontent ["GanttReferenceObjectElement"]
 *
 * @example <caption>Initialize the Gantt with an inline row reference object mapping template specified:</caption>
 * &lt;oj-gantt row-data="[[rowDataProvider]]">
 *   &lt;template slot="referenceObjectMappingTemplate">
 *     &lt;oj-gantt-reference-object
 *       value="[[$current.data.date]]">
 *     &lt;/oj-gantt-reference-object>
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
 * @ojimportmembers oj.ojGanttDependencyProperties
 * @ojsignature {target: "Type", value:"class ojGanttDependency extends JetElement<ojGanttDependencySettableProperties>"}
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @ojshortdesc The oj-gantt-dependency element is used to declare properties for gantt dependency lines. See the Help documentation for more information.
 * @since 5.2.0
 *
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
 * @ojcomponent oj.ojGanttRow
 * @ojimportmembers oj.ojGanttRowProperties
 * @ojsignature [{target: "Type",
 *                value:"class ojGanttRow<K3=any,D3=any> extends dvtTimeComponent<ojGanttRowSettableProperties<K3,D3>",
 *                genericParameters: [{"name": "K3", "description": "Type of key of the rowData dataprovider"},
 *                                    {"name": "D3", "description": "Type of data from the rowData dataprovider"}]
 *                },
 *               {target: "Type",
 *                value: "ojGanttRowSettableProperties<K3=any, D3=any> extends dvtTimeComponentSettableProperties",
 *                for: "SettableProperties"}]
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @ojshortdesc The oj-gantt-row element is used to declare properties for gantt rows. See the Help documentation for more information.
 * @since 5.2.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Gantt Row
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-gantt-row element is used to declare properties for gantt rows and is only valid as the
 *  child of a template element for the [rowMappingTemplate]{@link oj.ojGantt#rowMappingTemplate} slot of oj-gantt.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-gantt row-data="[[rowDataProvider]]">
 *   &lt;template slot="rowMappingTemplate">
 *     &lt;oj-gantt-row
 *       label="[[$current.data.resource]]"
 *       tasks="[[$current.data.tasks]]"
 *       reference-objects="[[$current.data.unavailabilities]]">
 *     &lt;/oj-gantt-row>
 *   &lt;/template>
 * &lt;/oj-gantt>
 * </code>
 * </pre>
 */

/**
 * The tasks associated with the row. This is required if data is set using row-data attribute.
 * @expose
 * @name tasks
 * @memberof! oj.ojGanttRow
 * @instance
 * @type {Array.<Object>}
 * @default []
 *
 * @example <caption>Initialize the gantt row with the
 * <code class="prettyprint">tasks</code> attribute specified:</caption>
 * &lt;oj-gantt-row tasks="[[$current.data.tasks]]">&lt;/oj-gantt-row>
 */
/**
 * The reference objects associated with the row. This is optional and is only used if data is set using row-data attribute.
 * @expose
 * @name referenceObjects
 * @memberof! oj.ojGanttRow
 * @instance
 * @type {Array.<Object>}
 * @default []
 *
 * @example <caption>Initialize the gantt row with the
 * <code class="prettyprint">reference-objects</code> attribute specified:</caption>
 * &lt;oj-gantt-row reference-objects="[[$current.data.referenceObjects]]">&lt;/oj-gantt-row>
 */

/**
 * @ojcomponent oj.ojGanttTask
 * @ojimportmembers oj.ojGanttTaskProperties
 * @ojsignature [{target: "Type",
 *                value:"class ojGanttTask<K2=any,D2=any> extends dvtTimeComponent<ojGanttTaskSettableProperties<K2,D2>",
 *                genericParameters: [{"name": "K2", "description": "Type of key of the taskData dataprovider"},
 *                                    {"name": "D2", "description": "Type of data from the taskData dataprovider"}]
 *                },
 *               {target: "Type",
 *                value: "ojGanttTaskSettableProperties<K2=any, D2=any> extends dvtTimeComponentSettableProperties",
 *                for: "SettableProperties"}]
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @ojshortdesc The oj-gantt-task element is used to declare properties for gantt tasks. See the Help documentation for more information.
 * @since 5.2.0
 *
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
 *       task-id="[[$current.data.ID]]"
 *       start="[[$current.data.begin]]"
 *       end="[[$current.data.finish]]">
 *     &lt;/oj-gantt-task>
 *   &lt;/template>
 * &lt;/oj-gantt>
 * </code>
 * </pre>
 */

/**
 * The id for the row the task belongs to. This is required if data is set using task-data attribute.
 * @expose
 * @name rowId
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {any=}
 * @ojdeprecated {since: '12.0.0', description: 'Set the data using the row-data attribute instead of task-data, and specify task-id instead of this attribute.'}
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">row-id</code> attribute specified:</caption>
 * &lt;oj-gantt-task row-id="[[$current.data.resource]]">&lt;/oj-gantt-task>
 */
/**
 * The id of the task. This is required if data is set using row-data attribute.
 * @expose
 * @name taskId
 * @memberof! oj.ojGanttTask
 * @instance
 * @type {string}
 *
 * @example <caption>Initialize the gantt task with the
 * <code class="prettyprint">task-id</code> attribute specified:</caption>
 * &lt;oj-gantt-task task-id="[[$current.data.ID]]">&lt;/oj-gantt-task>
 */

/**
 * @ojcomponent oj.ojGanttReferenceObject
 * @ojsignature {target: "Type", value:"class ojGanttReferenceObject extends JetElement<ojGanttReferenceObjectSettableProperties>"}
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @ojshortdesc The oj-gantt-reference-object element is used to declare properties for gantt row reference objects. See the Help documentation for more information.
 * @since 12.0.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Gantt Row Reference Object
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-gantt-reference-object element is used to declare properties for gantt row reference objects and is only valid as the
 *  child of a template element for the [referenceObjectMappingTemplate]{@link oj.ojGantt#referenceObjectMappingTemplate} slot of oj-gantt.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-gantt row-data="[[rowDataProvider]]">
 *   &lt;template slot="referenceObjectMappingTemplate">
 *     &lt;oj-gantt-reference-object
 *       start="[[$current.data.unavailabilityStart]]"
 *       end="[[$current.data.unavailabilityEnd]]">
 *     &lt;/oj-gantt-reference-object>
 *   &lt;/template>
 * &lt;/oj-gantt>
 * </code>
 * </pre>
 */

/**
 * A space delimited list of CSS style classes defining the style of the reference object.
 * Note that only CSS style applicable to SVG elements can be used.
 * @expose
 * @name svgClassName
 * @memberof! oj.ojGanttReferenceObject
 * @instance
 * @type {string=}
 * @default ""
 *
 * @example <caption>Initialize the gantt row reference object with the
 * <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
 * &lt;oj-gantt-reference-object svg-class-name="[[$current.data.className]]">&lt;/oj-gantt-reference-object>
 */
/**
 * The CSS style defining the style of the reference object. Only SVG CSS style properties are supported.
 * @expose
 * @name svgStyle
 * @memberof! oj.ojGanttReferenceObject
 * @instance
 * @type {Object=}
 * @ojsignature {target: "Type", value: "?Partial<CSSStyleDeclaration>", jsdocOverride: true}
 * @default {}
 *
 * @example <caption>Initialize the gantt row reference object with the
 * <code class="prettyprint">svg-style</code> attribute specified:</caption>
 * &lt;oj-gantt-reference-object svg-style="[[$current.data.style]]">&lt;/oj-gantt-reference-object>
 */
/**
 * The start time value of this reference object.
 * See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on the required string formats.
 * @expose
 * @name start
 * @ojshortdesc The start time value of this reference object. See the Help documentation for more information.
 * @memberof! oj.ojGanttReferenceObject
 * @instance
 * @type {string=}
 * @ojformat date-time
 * @default ""
 *
 * @example <caption>Initialize the gantt row reference object with the
 * <code class="prettyprint">start</code> attribute specified:</caption>
 * &lt;oj-gantt-reference-object start="[[$current.data.start]]">&lt;/oj-gantt-reference-object>
 */
/**
 * The end time value of this reference object.
 * See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on the required string formats.
 * @expose
 * @name end
 * @ojshortdesc The end time value of this reference object. See the Help documentation for more information.
 * @memberof! oj.ojGanttReferenceObject
 * @instance
 * @type {string=}
 * @ojformat date-time
 * @default ""
 *
 * @example <caption>Initialize the gantt row reference object with the
 * <code class="prettyprint">end</code> attribute specified:</caption>
 * &lt;oj-gantt-reference-object end="[[$current.data.end]]">&lt;/oj-gantt-reference-object>
 */
/**
 * The description of the reference object. This is used for accessibility.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojGanttDependencyProperties
 * @instance
 * @type {?string=}
 * @default null
 *
 * @example <caption>Initialize the gantt row reference object with the
 * <code class="prettyprint">short-desc</code> attribute specified:</caption>
 * &lt;oj-gantt-reference-object short-desc="[[$current.data.shortDesc]]">&lt;/oj-gantt-reference-object>
 */

/**
 * For default date converter
 * @static
 * @ignore
 */
function _getTimeAxisDefaultConverter() {
  return {
    default: null,
    seconds: new IntlDateTimeConverter({ hour: 'numeric', minute: '2-digit', second: '2-digit' }),
    minutes: new IntlDateTimeConverter({ hour: 'numeric', minute: '2-digit' }),
    hours: new IntlDateTimeConverter({ hour: 'numeric' }),
    days: new IntlDateTimeConverter({ month: 'numeric', day: '2-digit' }),
    weeks: new IntlDateTimeConverter({ month: 'numeric', day: '2-digit' }),
    months: new IntlDateTimeConverter({ month: 'long' }),
    quarters: new IntlDateTimeConverter({ month: 'long' }),
    years: new IntlDateTimeConverter({ year: 'numeric' })
  };
}

/**
 * For default number converter
 * @static
 * @ignore
 */
function _getTaskProgressDefaultConverter() {
  return new IntlNumberConverter({ style: 'percent' });
}

/**
 * @ojcomponent oj.ojGantt
 * @augments oj.dvtTimeComponent
 * @since 2.1.0
 * @ojimportmembers oj.ojSharedContextMenu
 * @ojrole application
 * @ojshortdesc A gantt displays scheduling information graphically, making it easier to plan, coordinate, and track various tasks and resources.
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet"]}
 * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
 * @ojtsimport {module: "ojtimeaxis", type: "AMD", imported:["ojTimeAxis"]}
 * @ojtsimport {module: "ojdvttimecomponentscale", type: "AMD", imported: ["DvtTimeComponentScale"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojGantt<K1, K2, D1 extends oj.ojGantt.Dependency<K1, K2>|any, D2 extends oj.ojGantt.DataTask|any, K3, D3 extends oj.ojGantt.DataRow|any> extends dvtTimeComponent<ojGanttSettableProperties<K1, K2, D1, D2, K3, D3>>",
 *                genericParameters: [{"name": "K1", "description": "Type of key of the dependencyData dataprovider"},
 *                  {"name": "K2", "description": "Type of key of the task"},
 *                  {"name": "K3", "description": "Type of key of the rowData dataprovider"},
 *                  {"name": "D1", "description": "Type of data from the dependencyData dataprovider"},
 *                  {"name": "D2", "description": "Type of data of the task"},
 *                  {"name": "D3", "description": "Type of data from the rowData dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojGanttSettableProperties<K1, K2, D1 extends oj.ojGantt.Dependency<K1, K2>|any, D2 extends oj.ojGantt.DataTask|any, K3, D3 extends oj.ojGantt.DataRow|any> extends dvtTimeComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["start", "end", "gridlines.horizontal", "gridlines.vertical", "majorAxis.scale", "majorAxis.zoomOrder", "minorAxis.scale", "minorAxis.zoomOrder", "style"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["rowData", "taskData", "dependencyData", "selection", "expanded"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 12
 *
 * @ojoracleicon 'oj-ux-ico-chart-gantt'
 * @ojuxspecs ['data-visualization-gantt']
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
 *   row-data='[[dataProvider]]'>
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
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojGantt', $.oj.dvtTimeComponent, {
  widgetEventPrefix: 'oj',
  options: {
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
     * @ojshortdesc An alias for the '$current' context variable passed to slot content for the dependencyTemplate, taskTemplate, or rowTemplate slots.
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
     * An array of objects that defines dependencies between tasks.
     * Also accepts a Promise that will resolve with an array for deferred data rendering.
     * No data will be rendered if the Promise is rejected.
     * @expose
     * @ojtsignore
     * @name dependencies
     * @ojshortdesc An array of objects that defines dependencies between tasks. See the Help documentation for more information.
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
     * The DataProvider for the dependencies of the gantt. It should provide data rows where each row maps data for a single gantt dependency line.
     * The row key will be used as the id for dependency lines.
     * The DataProvider can either have an arbitrary data shape, in which case a template for the <a href="#dependencyTemplate">dependencyTemplate</a> slot must be provided,
     * or it can have <a href="#Dependency">ojGantt.Dependency</a> as its data shape, in which case no template is required.
     * @expose
     * @name dependencyData
     * @ojshortdesc Specifies the DataProvider for the dependencies of the Gantt. See the Help documentation for more information.
     * @memberof oj.ojGantt
     * @instance
     * @type {?Object}
     * @ojsignature {target: "Type", value: "?(DataProvider<K1, D1>)", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
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
     * Specifies the shape of the dependency lines.
     * @expose
     * @name dependencyLineShape
     * @ojshortdesc Specifies the shape of the dependency lines.
     * @memberof oj.ojGantt
     * @instance
     * @type {string}
     * @ojvalue {string} "rectilinear"
     * @ojvalue {string} "straight"
     * @default "rectilinear"
     *
     * @example <caption>Initialize the Gantt with the <code class="prettyprint">dependency-line-shape</code> attribute specified:</caption>
     * &lt;oj-gantt dependency-line-shape="linear">&lt;/oj-gantt>
     *
     * @example <caption>Get or set the <code class="prettyprint">dependencyLineShape</code> property after initialization:</caption>
     * // getter
     * var value = myGantt.dependencyLineShape;
     *
     * // setter
     * myGantt.dependencyLineShape = 'straight';
     */
    dependencyLineShape: 'rectilinear',
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
       * @ojshortdesc Defines a subset of high level configurations for moving elements to another location within the Gantt.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      move: {
        /**
         * Enable or disable moving the non-baseline portions of selected tasks to a different location of some row within
         * the same gantt using drag and drop or equivalent keyboard actions
         * (See <a href="#keyboard-section">Keyboard End User Information</a>).
         * See also <a href="#event:move">ojMove</a>.
         * <br></br>See the <a href="#dnd">dnd</a> attribute for usage examples.
         * @expose
         * @name dnd.move.tasks
         * @ojshortdesc Enable or disable moving the non-baseline portions of selected tasks to a different location within the same Gantt.
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @ojvalue {string} "disabled" Disable moving selected tasks
         * @ojvalue {string} "enabled" Enable moving selected tasks
         * @default "disabled"
         */
        tasks: 'disabled'
      }
    },
    /**
     * The action that is performed when a drag occurs on the gantt. "select" denotes marquee select, and is only available if multiple selection is turned on.
     * @expose
     * @name dragMode
     * @ojshortdesc Specifies the action that is performed when a drag occurs.
     * @memberof oj.ojGantt
     * @instance
     * @type {string}
     * @ojvalue {string} "pan"
     * @ojvalue {string} "select"
     * @default "pan"
     *
     * @example <caption>Initialize the Gantt with the <code class="prettyprint">drag-mode</code> attribute specified:</caption>
     * &lt;oj-gantt drag-mode='select'>&lt;/oj-gantt>
     *
     * @example <caption>Get or set the <code class="prettyprint">dragMode</code> property after initialization:</caption>
     * // getter
     * var value = myGantt.dragMode;
     *
     * // setter
     * myGantt.dragMode = 'select';
     */
    dragMode: 'pan',
    /**
     * The end time of the Gantt.
     * A valid value is required in order for the Gantt to properly render.
     * See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @ojrequired
     * @name end
     * @ojshortdesc The end time of the Gantt. See the Help documentation for more information.
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
     * Specifies the key set containing the ids of tasks that should be expanded on initial render.
     * Use the <a href="KeySetImpl.html">KeySetImpl</a> class to specify tasks to expand.
     * Use the <a href="AllKeySetImpl.html">AllKeySetImpl</a> class to expand all tasks.
     * @ojshortdesc Specifies the key set of ids for expanded Gantt items.
     * @expose
     * @name expanded
     * @memberof oj.ojGantt
     * @instance
     * @type {KeySet}
     * @default new KeySetImpl()
     * @ojsignature {target:"Type", value:"oj.KeySet<K3|K2>"}
     * @ojwriteback
     *
     * @example <caption>Initialize the Gantt with the <code class="prettyprint">expanded</code> attribute specified:</caption>
     * &lt;oj-gantt expanded="{{keySetImpl}}">&lt;/oj-gantt>
     *
     * @example <caption>Get or set the <code class="prettyprint">expanded</code> property after initialization:</caption>
     * // getter
     * var value = myGantt.expanded;
     *
     * // setting specific items to be expanded
     * myGantt.expanded = new KeySetImpl(['item1', 'item2']);
     *
     * // setting all items to be expanded
     * myGantt.expanded = new AllKeySetImpl();
     */
    expanded: new oj.KeySetImpl(),
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
       * @ojshortdesc Specifies whether to show horizontal gridlines.
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
       * @ojshortdesc Specifies whether to show vertical gridlines.
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
     * An object with the following properties, used to define the minor time axis. This is required for the Gantt to render properly.
     * @expose
     * @name minorAxis
     * @ojshortdesc Specifies the minor time axis. This is required for the Gantt to render properly.
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
       * A converter (an instance that duck types {@link oj.Converter}) used to format the labels of the minor axis for all 'scale' values, or
       * an object literal whose keys are 'scale' values that map specific converters for scale specific formatting (see {@link oj.ojTimeAxis.Converters}).
       * The single converter option has been deprecated as of 11.0.0. Please avoid using this type as it will be removed in the future.
       * See also {@link oj.DateTimeConverter}.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.converter
       * @ojshortdesc An object used to format the minor axis labels. See the Help documentation for more information.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?(oj.ojTimeAxis.Converters|oj.Converter<string>)", jsdocOverride: true}
       * @ojdeprecated {target: 'memberType', value: ['oj.Converter<string>'], since: '11.0.0', description: 'this value will be removed in the future'}
       * @default {"default": null, "seconds": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric'}), "days": new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'}), "months": new DateTimeConverter.IntlDateTimeConverter({'month': 'long'}), "quarters": new DateTimeConverter.IntlDateTimeConverter({'month': 'long'}), "years": new DateTimeConverter.IntlDateTimeConverter({'year': 'numeric'})}
       */
      converter: undefined,
      /**
       * Specifies the height of the minor axis in pixels.
       * If not specified or if the height specified is less than the inherent minimum height (which is a function of the axis label sizes),
       * a default value will be used.
       * Applications should make sure not to set heights that would make the total axes height too large for the viewport to accomodate.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.height
       * @ojshortdesc Specifies the minor axis height in pixels. See the Help documentation for more information.
       * @memberof! oj.ojGantt
       * @instance
       * @type {?number}
       * @ojsignature {target: "Type", value: "?"}
       * @ojunits pixels
       * @default null
       */
      height: null,
      /**
       * The time scale used for the minor axis. This is required in order for the Gantt to render properly.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * The scale must either be a scale string (see acceptable values) or a custom instance of {@link DvtTimeComponentScale}.
       * @expose
       * @ojrequired
       * @name minorAxis.scale
       * @ojshortdesc Specifies the minor axis time scale. This is required for the Gantt to render properly.
       * @memberof! oj.ojGantt
       * @instance
       * @type {?(string | DvtTimeComponentScale)}
       * @ojvalue {string} "seconds"
       * @ojvalue {string} "minutes"
       * @ojvalue {string} "hours"
       * @ojvalue {string} "days"
       * @ojvalue {string} "weeks"
       * @ojvalue {string} "months"
       * @ojvalue {string} "quarters"
       * @ojvalue {string} "years"
       * @ojsignature {target: "Type", value: "?(string|DvtTimeComponentScale)"}
       * @default null
       */
      scale: null,
      /**
       * An array of strings or instances of {@link DvtTimeComponentScale}
       * used for zooming from longest to shortest. If not specified, the 'scale' specified on the axis will be used at all zoom levels.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.zoomOrder
       * @ojshortdesc An array of scales used for zooming from longest to shortest. See the Help documentation for more information.
       * @memberof! oj.ojGantt
       * @instance
       * @type {?Array.<string|DvtTimeComponentScale>}
       * @ojsignature {target: "Type", value: "?Array.<string|DvtTimeComponentScale>"}
       * @default null
       */
      zoomOrder: null
    },
    /**
     * An object with the following properties, used to define the major time axis. If not specified, no major time axis is shown.
     * @expose
     * @name majorAxis
     * @ojshortdesc Specifies the major time axis. If not specified, no major time axis is shown.
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
       * A converter (an instance that duck types {@link oj.Converter}) used to format the labels of the major axis for all 'scale' values, or
       * an object literal whose keys are 'scale' values that map specific converters for scale specific formatting (see {@link oj.ojTimeAxis.Converters}).
       * The single converter option has been deprecated as of 11.0.0. Please avoid using this type as it will be removed in the future.
       * See also {@link oj.DateTimeConverter}.
       * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
       * @expose
       * @name majorAxis.converter
       * @ojshortdesc An object used to format the major axis labels. See the Help documentation for more information.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?(oj.ojTimeAxis.Converters|oj.Converter<string>)", jsdocOverride: true}
       * @ojdeprecated {target: 'memberType', value: ['oj.Converter<string>'], since: '11.0.0', description: 'this value will be removed in the future'}
       * @default {"default": null, "seconds": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric'}), "days": new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'}), "months": new DateTimeConverter.IntlDateTimeConverter({'month': 'long'}), "quarters": new DateTimeConverter.IntlDateTimeConverter({'month': 'long'}), "years": new DateTimeConverter.IntlDateTimeConverter({'year': 'numeric'})}
       */
      converter: undefined,
      /**
       * Specifies the height of the major axis in pixels.
       * If not specified or if the height specified is less than the inherent minimum height (which is a function of the axis label sizes),
       * a default value will be used.
       * Applications should make sure not to set heights that would make the total axes height too large for the viewport to accomodate.
       * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
       * @expose
       * @name majorAxis.height
       * @ojshortdesc Specifies the major axis height in pixels. See the Help documentation for more information.
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
       * The scale must either be a scale string (see acceptable values) or a custom instance of {@link DvtTimeComponentScale}.
       * @expose
       * @name majorAxis.scale
       * @ojshortdesc Specifies the major axis time scale.
       * @memberof! oj.ojGantt
       * @instance
       * @type {?(string | DvtTimeComponentScale)}
       * @ojvalue {string} "seconds"
       * @ojvalue {string} "minutes"
       * @ojvalue {string} "hours"
       * @ojvalue {string} "days"
       * @ojvalue {string} "weeks"
       * @ojvalue {string} "months"
       * @ojvalue {string} "quarters"
       * @ojvalue {string} "years"
       * @ojsignature {target: "Type", value: "?(string|DvtTimeComponentScale)"}
       * @default null
       */
      scale: null,
      /**
       * An array of strings or instances of {@link DvtTimeComponentScale}
       * used for zooming from longest to shortest. If not specified, the 'scale' specified on the axis will be used at all zoom levels.
       * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
       * @expose
       * @name majorAxis.zoomOrder
       * @ojshortdesc An array of scales used for zooming from longest to shortest. See the Help documentation for more information.
       * @memberof! oj.ojGantt
       * @instance
       * @type {?Array.<string|DvtTimeComponentScale>}
       * @ojsignature {target: "Type", value: "?Array.<string|DvtTimeComponentScale>"}
       * @default null
       */
      zoomOrder: null
    },
    /**
     * The array of reference objects associated with the gantt.
     * For each reference object, a line is rendered at the specified value.
     * Currently only the first reference object in the array is supported.
     * Any additional objects supplied in the array will be ignored.
     * @expose
     * @name referenceObjects
     * @ojshortdesc The array of reference objects associated with the Gantt. See the Help documentation for more information.
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
     * @ojshortdesc Specifies properties for the row labels region.
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
       * @ojshortdesc Specifies whether row labels are rendered.
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
       * Defines the maximum width of the region in pixels (e.g. '50px') or percent (e.g. '15%') of the element width.
       * If 'none' is specified, then the width has no maximum value.
       * Default labels will truncate to fit.
       * <br></br>See the <a href="#rowAxis">row-axis</a> attribute for usage examples.
       * @expose
       * @name rowAxis.maxWidth
       * @ojshortdesc Specifies the maximum width of the region in pixels or as a percentage of the element width.
       *    If 'none', then the width has no maximum value. See the Help documentation for more information.
       * @memberof! oj.ojGantt
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default "none"
       */
      maxWidth: 'none',
      /**
       * Defines the width of the region in pixels (e.g. '50px') or percent (e.g. '15%') of the element width.
       * If 'max-content' is specified, then the intrinsic width of the widest label content is used.
       * Default labels will truncate to fit.
       * <br></br>See the <a href="#rowAxis">row-axis</a> attribute for usage examples.
       * @expose
       * @name rowAxis.width
       * @ojshortdesc Specifies the width of the region in pixels or as a percentage of the element width.
       *    If 'max-content', then the width of the widest label is used. See the Help documentation for more information.
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
       * @ojshortdesc Specifies the properties of the row labels.
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
         * @ojshortdesc An optional function that returns custom content for the row label. The custom content must be an SVG element.
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
     * The DataProvider for the rows of the gantt. It should provide data rows where each maps data for a single gantt row.
     * This DataProvider takes precedence over the task-data DataProvider if specified.
     * If the nature of the data is hierarchical, it's recommended that applications
     * turn on row labels via the <a href="#rowAxis.rendered">row-axis.rendered</a> attribute to show the expand and collapse affordances.
     * The DataProvider can either have an arbitrary data shape, in which case
     * a template for the <a href="#rowMappingTemplate">rowMappingTemplate</a> slot for generating gantt row properties
     * and a template for the <a href="#taskMappingTemplate">taskMappingTemplate</a> slot for generating gantt task properties must be provided,
     * or it can have ojGantt.DataRow as its data shape, in which case no template is required.
     * Providing a template for the <a href="#referenceObjectMappingTemplate">referenceObjectMappingTemplate</a> slot for generating the gantt row reference object properties is optional.
     * @expose
     * @name rowData
     * @ojshortdesc Specifies the DataProvider for the rows of the Gantt. See the Help documentation for more information.
     * @memberof oj.ojGantt
     * @instance
     * @type {?Object}
     * @ojsignature {target: "Type", value: "?(DataProvider<K3, D3>)", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
     *
     * @example <caption>Initialize the Gantt with the <code class="prettyprint">row-data</code> attribute specified:</caption>
     * &lt;oj-gantt row-data="[[rowDataProvider]]" row-axis.rendered="on">
     *   &lt;template slot="rowMappingTemplate">
     *     &lt;oj-gantt-row
     *       label="[[$current.data.label]]">
     *     &lt;/oj-gantt-row>
     *   &lt;/template>
     *   &lt;template slot="taskMappingTemplate">
     *     &lt;oj-gantt-task
     *       task-id="[[$current.data.id]]"
     *       start="[[$current.data.begin]]"
     *       end="[[$current.data.finish]]">
     *     &lt;/oj-gantt-task>
     *   &lt;/template>
     * &lt;/oj-gantt>
     *
     * @example <caption>Get or set the <code class="prettyprint">rowData</code> property after initialization:</caption>
     * // getter
     * var value = myGantt.rowData;
     *
     * // setter
     * myGantt.rowData = rowDataProvider;
     */
    rowData: null,
    /**
     * An object with the following properties, used to define default styling for rows in the Gantt.
     * @expose
     * @name rowDefaults
     * @ojshortdesc Specifies default styling for rows in the Gantt.
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
       * The height of the row in pixels. If specified, tasks are vertically middle aligned within the row.
       * Since task heights can also be set, via the <a href="#taskDefaults.height">task-defaults.height</a> attribute or in the data definition,
       * applications typically should make sure that their task heights are less than the row height.
       * If not specified, a default height is calculated based on the height of the tasks within the row.
       * <br></br>See the <a href="#rowDefaults">row-defaults</a> attribute for usage examples.
       * @expose
       * @name rowDefaults.height
       * @ojshortdesc Specifies the default row height in pixels. See the Help documentation for more information.
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
     * An array of objects with the following properties, used to define rows and tasks within rows.
     * Also accepts a Promise that will resolve with an array for deferred data rendering.
     * No data will be rendered if the Promise is rejected.
     * @expose
     * @ojtsignore
     * @name rows
     * @ojshortdesc An array of objects used to define rows and tasks within rows. See the Help documentation for more information.
     * @memberof oj.ojGantt
     * @instance
     * @type {?(Array.<Object>|Promise)}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojGantt.Row<K2,D2,K3,D3>>>|null",
     *                                           SetterType: "Array<oj.ojGantt.Row<K2,D2,K3,D3>>|Promise<Array<oj.ojGantt.Row<K2,D2,K3,D3>>>|null"},
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
     * The value contains the y scroll position,
     * the index of the row closest to the top of the viewport,
     * and the vertical offset from the position of the row to the actual scroll position.
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
     * @ojshortdesc The current scroll position of the Gantt. See the Help documentation for more information.
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
       * The vertical position in pixels.
       * <br></br>See the <a href="#scrollPosition">scroll-position</a> attribute for usage examples.
       * @expose
       * @name scrollPosition.y
       * @ojshortdesc The vertical position in pixels.
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
       * @ojshortdesc The zero-based index of the row.
       * @memberof! oj.ojGantt
       * @instance
       * @type {?number}
       * @ojsignature {target: "Type", value: "?"}
       * @default null
       */
      rowIndex: null,
      /**
       * The vertical offset in pixels relative to the row identified by <a href="#scrollPosition.rowIndex">scroll-position.rowIndex</a>.
       * <br></br>See the <a href="#scrollPosition">scroll-position</a> attribute for usage examples.
       * @expose
       * @name scrollPosition.offsetY
       * @ojshortdesc The vertical offset in pixels relative to the row identified by 'rowIndex'.
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
     * An array containing the ids of the initially selected tasks.
     * @expose
     * @name selection
     * @memberof oj.ojGantt
     * @instance
     * @type {Array.<any>}
     * @ojsignature {target:"Type", value:"K2[]"}
     * @ojwriteback
     * @default []
     * @ojeventgroup common
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
     * <p>The type of selection behavior that is enabled on the Gantt.
     * This attribute controls the number of selections that can be made via selection gestures at any given time.
     *
     * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified,
     * selection gestures will be enabled, and the Gantt's selection styling will be applied to all items specified
     * by the <a href="#selection">selection</a> attribute.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled,
     * and the Gantt's selection styling will not be applied to any items specified by the <a href="#selection">selection</a> attribute.
     *
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> attribute.
     *
     * @expose
     * @name selectionMode
     * @ojshortdesc Specifies the selection behavior of the Gantt. See the Help documentation for more information.
     * @memberof oj.ojGantt
     * @instance
     * @type {string}
     * @ojvalue {string} "none" Selection is disabled.
     * @ojvalue {string} "single" Only a single item can be selected at a time.
     * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
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
     * Defines the visual behavior upon task selection.
     * @expose
     * @name selectionBehavior
     * @ojshortdesc Specifies the action that is performed when a drag occurs.
     * @memberof oj.ojGantt
     * @instance
     * @type {string}
     * @ojvalue {string} "highlightDependencies" All dependency lines are initially not shown, but upon selection of a task, its dependent tasks and associated dependency lines are highlighted.
     * @ojvalue {string} "normal" There are no additional visual treatments beyond the normal task selection
     * @default "normal"
     *
     * @example <caption>Initialize the Gantt with the <code class="prettyprint">selection-behavior</code> attribute specified:</caption>
     * &lt;oj-gantt selection-behavior='highlightDependencies'>&lt;/oj-gantt>
     *
     * @example <caption>Get or set the <code class="prettyprint">selectionBehavior</code> property after initialization:</caption>
     * // getter
     * var value = myGantt.selectionBehavior;
     *
     * // setter
     * myGantt.selectionBehavior = 'highlightDependencies';
     */
    selectionBehavior: 'normal',
    /**
     * The start time of the Gantt.
     * A valid value is required for the Gantt to render properly.
     * See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @ojrequired
     * @name start
     * @ojshortdesc The start time of the Gantt. A valid value is required for the Gantt to render properly. See the Help documentation for more information.
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
     * Specifies whether to apply a horizontally stacked visual treatment to chronologically adjacent tasks, i.e. when the end time of a previous task is equal to the start time of the next task.
     * @expose
     * @name taskAggregation
     * @ojshortdesc Specifies whether to apply a horizontally stacked visual treatment to adjacent tasks.
     * @memberof oj.ojGantt
     * @instance
     * @type {string}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "off"
     *
     * @example <caption>Initialize the Gantt with the <code class="prettyprint">task-aggregation</code> attribute specified:</caption>
     * &lt;oj-gantt task-aggregation='select'>&lt;/oj-gantt>
     *
     * @example <caption>Get or set the <code class="prettyprint">taskAggregation</code> property after initialization:</caption>
     * // getter
     * var value = myGantt.taskAggregation;
     *
     * // setter
     * myGantt.taskAggregation = 'on';
     */
    taskAggregation: 'off',
    /**
     * The DataProvider for the tasks of the gantt. It should provide data rows where each row maps data for a single gantt task.
     * The row key will be used as the id for gantt tasks. If the nature of the data is hierarchical, it's recommended that applications
     * turn on row labels via the <a href="#rowAxis.rendered">row-axis.rendered</a> attribute to show the expand and collapse affordances.
     * The DataProvider can either have an arbitrary data shape, in which case a template for the <a href="#taskTemplate">taskTemplate</a> slot must be provided,
     * or it can have <a href="#DataTask">ojGantt.DataTask</a> as its data shape, in which case no template is required.
     * Providing a template for the <a href="#rowTemplate">rowTemplate</a> slot for generating the gantt row properties is optional.
     * @expose
     * @name taskData
     * @ojshortdesc Specifies the DataProvider for the tasks of the Gantt. See the Help documentation for more information.
     * @memberof oj.ojGantt
     * @instance
     * @type {?Object}
     * @ojsignature {target: "Type", value: "?(DataProvider<K2, D2>)", jsdocOverride:true}
     * @default null
     * @ojdeprecated {since: '12.0.0', description: 'Set the data using the row-data attribute instead.'}
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
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
     * @ojshortdesc Specifies default styling for tasks in the Gantt.
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
       * The default value comes from the CSS and varies based on theme.
       * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
       * @expose
       * @name taskDefaults.borderRadius
       * @ojshortdesc The border radius of the task. Accepts valid CSS border-radius attribute values.
       * @memberof! oj.ojGantt
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       */
      borderRadius: undefined,
      /**
       * The position of the label relative to the task. An array of values is also supported.
       * If an array is specified, then the values are traversed until a position that can fully display the label is found.
       * If 'max' is specified in the array, then of all the positions evaluated up to that point of the traversal,
       * the one with the largest space is used (label is truncated to fit).
       * Naturally, 'max' is ignored if it's specified as the first value of the array.
       * If the last value of the array is reached, but the label cannot be fully displayed,
       * then the label is placed at that position, truncated to fit.
       * Due to space constraints in the milestone and task with progress cases,
       * the inner positions will exhibit the following behaviors:
       * <ul> <li> For milestones, specifying 'innerStart', 'innerEnd', or 'innerCenter'
       * would be equivalent to specifying 'start', 'end', and 'end' respectively.
       * </li> <li> For tasks with progress, 'innerCenter' means the label will be aligned to the end of the progress bar,
       * either placed inside or outside of the progress, whichever is the larger space.
       * 'innerStart' and 'innerEnd' positions are honored when there is enough space to show the label at those positions.
       * Otherwise, the aforementioned 'innerCenter' behavior is exhibited.
       * </li> </ul>
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
       * Since row heights can also be set via the <a href="#rowDefaults.height">row-defaults.height</a> attribute,
       * applications typically should make sure that their task heights are less than the row height.
       * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
       * @expose
       * @name taskDefaults.height
       * @ojshortdesc The height of the task in pixels. See the Help documentation for more information.
       * @memberof! oj.ojGantt
       * @instance
       * @type {?number}
       * @ojsignature {target: "Type", value: "?"}
       * @ojunits pixels
       * @default null
       */
      height: null,
      /**
       * An object with the following properties, used to configure the placements of chronologically overlapping tasks.
       * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
       * @expose
       * @name taskDefaults.overlap
       * @ojshortdesc Configures the placement of chronologically overlapping tasks.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      overlap: {
        /**
         * The behavior when a task (task2) overlaps a chronologically previous adjacent task (task1).
         * <ul>
         * <li>'stack': task2 is placed above task1 if there is no chronological conflict with previous tasks.
         * Otherwise, task2 is shifted down relative to task1 by the specified offset amount.</li>
         * <li>'stagger': task2 is shifted up or down relative to its normal position by the specified offset amount,
         * depending on whether task1 was shifted down or up respectively, such that the chain of overlapping tasks it participates in forms a zigzag pattern.
         * If task1 is the first task of the chain, then task2 is shifted down.</li>
         * <li>'overlay': task2 remains in its normal position (ignoring the specified offset amount),
         * and is placed above all tasks it overlaps with.</li>
         * <li>'auto': The behavior depends on the <a href="#rowDefaults.height">row-defaults.height</a> value:
         * the behavior is 'stack' if row height is not specified or null, and the behavior is 'stagger' otherwise.</li>
         * </ul>
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.overlap.behavior
         * @ojshortdesc Specifies the behavior when a task overlaps a chronologically previous adjacent tasks. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @ojvalue {string} "stack"
         * @ojvalue {string} "stagger"
         * @ojvalue {string} "overlay"
         * @ojvalue {string} "auto"
         * @default "auto"
         */
        behavior: 'auto',
        /**
         * The vertical offset amount in pixels, to be used to lay out overlapping tasks as per overlap.behavior.
         * If not specified or null, a default amount is used depending on the <a href="#rowDefaults.height">row-defaults.height</a> value.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.overlap.offset
         * @ojshortdesc Specifies the vertical offset amount in pixels to be used when laying out overlapping tasks. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?number}
         * @ojsignature {target: "Type", value: "?"}
         * @ojunits pixels
         * @default null
         */
        offset: null
      },
      /**
       * Enable or disable resizing the non-baseline portions of selected tasks.
       * See also <a href="#event:resize">ojResize</a>.
       * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
       * @expose
       * @name taskDefaults.resizable
       * @ojshortdesc Enable or disable resizing of the non-baseline portions of selected tasks.
       * @memberof! oj.ojGantt
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "disabled" Disable selected tasks resize
       * @ojvalue {string} "enabled" Enable selected tasks resize
       * @default "disabled"
       */
      resizable: 'disabled',
      /**
       * A space delimited list of CSS style classes defining the style of the task.
       * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
       * @expose
       * @name taskDefaults.svgClassName
       * @ojshortdesc A space delimited list of CSS style classes defining the style of the task.
       * @memberof! oj.ojGantt
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @default ""
       */
      svgClassName: '',
      /**
       * The CSS style defining the style of the task.
       * Only SVG CSS style properties are supported.
       * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
       * @expose
       * @name taskDefaults.svgStyle
       * @ojshortdesc The CSS style defining the style of the task.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default {}
       */
      svgStyle: {},
      /**
       * Defines the task type to be rendered.
       * <br></br>If "milestone", and if the task's "start" and "end" values are specified and unequal,
       * the "start" value is used to evaluate position.
       * <br></br>If "auto", the type is inferred from the data:
       * <ul> <li>If "start" and "end" values are specified and unequal, "normal" type is assumed.
       * </li> <li>Otherwise, "milestone" type is assumed.</li></ul>
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
       * @ojshortdesc Specifies default styling for progress bars on non-milestone tasks.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      progress: {
        /**
         * The border radius of the progress bar. Accepts values allowed in CSS border-radius attribute.
         * The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.progress.borderRadius
         * @ojshortdesc The border radius of the progress bar. Accepts valid CSS border-radius attribute values.
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        borderRadius: undefined,
        /**
         * Specifies the height of the progress bar in pixels (e.g. '50px') or percent of the associated task bar (e.g. '15%').
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.progress.height
         * @ojshortdesc Specifies the height of the progress bar in pixels or as a percentage of the associated task bar height.
         *    See the Help documentation for more information.
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
         * @ojshortdesc A space delimited list of CSS style classes to apply to the progress bar.
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         */
        svgClassName: '',
        /**
         * The CSS inline style to apply to the progress bar. Only CSS style applicable to SVG elements can be used.
         * Only SVG CSS style properties are supported.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.progress.svgStyle
         * @ojshortdesc The CSS inline style to apply to the progress bar.
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?Partial<CSSStyleDeclaration>", jsdocOverride: true}
         * @default {}
         */
        svgStyle: {}
      },
      /**
       * An object with the following properties, used to define default styling for task baseline elements.
       * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
       * @expose
       * @name taskDefaults.baseline
       * @ojshortdesc Specifies default styling for task baseline elements.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      baseline: {
        /**
         * The border radius of the baseline. Accepts values allowed in CSS border-radius attribute.
         * The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.baseline.borderRadius
         * @ojshortdesc The border radius of the baseline. Accepts valid CSS border-radius attribute values.
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        borderRadius: undefined,
        /**
         * The height of the baseline in pixels. If not specified, a default height is used based upon the baseline type.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.baseline.height
         * @ojshortdesc Specifies the height of the baseline in pixels. If not specified, a default height is used based upon the baseline type.
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
         * @ojshortdesc A space delimited list of CSS style classes defining the baseline style.
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         */
        svgClassName: '',
        /**
         * The CSS style defining the style of the baseline.
         * Only SVG CSS style properties are supported.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.baseline.svgStyle
         * @ojshortdesc The CSS style defining the baseline style.
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?Partial<CSSStyleDeclaration>", jsdocOverride: true}
         * @default {}
         */
        svgStyle: {}
      },
      /**
       * An object with the following properties, used to define default styling for task downtime elements.
       * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
       * @expose
       * @name taskDefaults.downtime
       * @ojshortdesc Specifies default styling for task downtime elements.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      downtime: {
        /**
         * A space delimited list of CSS style classes defining the style of the downtime.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.downtime.svgClassName
         * @ojshortdesc A space delimited list of CSS style classes defining the downtime style.
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         */
        svgClassName: '',
        /**
         * The CSS style defining the style of the downtime.
         * Only SVG CSS style properties are supported.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.downtime.svgStyle
         * @ojshortdesc The CSS style defining the downtime style.
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?Partial<CSSStyleDeclaration>", jsdocOverride: true}
         * @default {}
         */
        svgStyle: {}
      },
      /**
       * An object with the following properties, used to define default styling for task overtime elements.
       * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
       * @expose
       * @name taskDefaults.overtime
       * @ojshortdesc Specifies default styling for task overtime elements.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      overtime: {
        /**
         * A space delimited list of CSS style classes defining the style of the overtime.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.overtime.svgClassName
         * @ojshortdesc A space delimited list of CSS style classes defining the overtime style.
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         */
        svgClassName: '',
        /**
         * The CSS style defining the style of the overtime.
         * Only SVG CSS style properties are supported.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.overtime.svgStyle
         * @ojshortdesc The CSS style defining the overtime style.
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?Partial<CSSStyleDeclaration>", jsdocOverride: true}
         * @default {}
         */
        svgStyle: {}
      },
      /**
       * An object with the following properties, used to define default styling for task attribute elements.
       * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
       * @expose
       * @name taskDefaults.attribute
       * @ojshortdesc Specifies default styling for task attribute elements.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      attribute: {
        /**
         * A space delimited list of CSS style classes defining the style of the attribute.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.attribute.svgClassName
         * @ojshortdesc A space delimited list of CSS style classes defining the attribute style.
         * @memberof! oj.ojGantt
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         * @default ""
         */
        svgClassName: '',
        /**
         * The CSS style defining the style of the attribute.
         * Only SVG CSS style properties are supported.
         * <br></br>See the <a href="#taskDefaults">task-defaults</a> attribute for usage examples.
         * @expose
         * @name taskDefaults.attribute.svgStyle
         * @ojshortdesc The CSS style defining the attribute style.
         * @memberof! oj.ojGantt
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?Partial<CSSStyleDeclaration>", jsdocOverride: true}
         * @default {}
         */
        svgStyle: {}
      }
    },
    /**
     * Specifies whether the time cursor is enabled.
     * @expose
     * @name timeCursor
     * @ojshortdesc Specifies whether the time cursor is enabled.
     * @memberof oj.ojGantt
     * @instance
     * @type {string}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "off"
     *
     * @example <caption>Initialize the Gantt with the <code class="prettyprint">time-cursor</code> attribute specified:</caption>
     * &lt;oj-gantt time-cursor='on'>&lt;/oj-gantt>
     *
     * @example <caption>Get or set the <code class="prettyprint">timeCursor</code> property after initialization:</caption>
     * // getter
     * var value = myGantt.timeCursor;
     *
     * // setter
     * myGantt.timeCursor = 'on';
     */
    timeCursor: 'off',
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
       * @ojshortdesc A function that returns a custom tooltip. See the Help documentation for more information.
       * @memberof! oj.ojGantt
       * @instance
       * @type {?(function(Object):Object)}
       * @ojsignature {target: "Type", value: "((context: oj.ojGantt.TooltipContext<K2, D2, K3, D3>) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
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
       * @ojshortdesc Specifies tooltip behavior for the row value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      row: {
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelRow}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.row.tooltipLabel
         * @ojshortdesc The label to display before the row value in the tooltip. See the Help documentation for more information.
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
         * @ojshortdesc Specifies whether the row value is displayed in the tooltip.
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
       * @ojshortdesc Specifies tooltip behavior for the start value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      start: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * If not specified, a default converter depending on the axes scale is used.
         * See also {@link oj.DateTimeConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.start.converter
         * @ojshortdesc An object used to format the start value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
         * @default null
         */
        converter: null,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelStart}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.start.tooltipLabel
         * @ojshortdesc The label to display before the start value in the tooltip. See the Help documentation for more information.
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
         * @ojshortdesc Specifies whether the start value is displayed in the tooltip.
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
       * @ojshortdesc Specifies tooltip behavior for the end value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      end: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * If not specified, a default converter depending on the axes scale is used.
         * See also {@link oj.DateTimeConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.end.converter
         * @ojshortdesc An object used to format the end value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
         * @default null
         */
        converter: null,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelEnd}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.end.tooltipLabel
         * @ojshortdesc The label to display before the end value in the tooltip. See the Help documentation for more information.
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
         * @ojshortdesc Specifies whether the end value is displayed in the tooltip.
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
       * @ojshortdesc Specifies tooltip behavior for the date value of a milestone task.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      date: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * If not specified, a default converter depending on the axes scale is used.
         * See also {@link oj.DateTimeConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.date.converter
         * @ojshortdesc An object used to format the date value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
         * @default null
         */
        converter: null,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelDate}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.date.tooltipLabel
         * @ojshortdesc The label to display before the date value in the tooltip. See the Help documentation for more information.
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
         * @ojshortdesc Specifies whether the date value is displayed in the tooltip.
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
       * @ojshortdesc Specifies tooltip behavior for the label value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      label: {
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelLabel}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.label.tooltipLabel
         * @ojshortdesc The label to display before the label value in the tooltip. See the Help documentation for more information.
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
         * @ojshortdesc Specifies whether the label value is displayed in the tooltip.
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
       * @ojshortdesc Specifies tooltip behavior for the progress value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      progress: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * See also {@link oj.NumberConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.progress.converter
         * @ojshortdesc An object used to format the progress value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<number>)", jsdocOverride: true}
         * @default new NumberConverter.IntlNumberConverter({style: 'percent'})
         */
        converter: undefined,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelProgress}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.progress.tooltipLabel
         * @ojshortdesc The label to display before the progress value in the tooltip. See the Help documentation for more information.
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
         * @ojshortdesc Specifies whether the progress value is displayed in the tooltip.
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
       * @ojshortdesc Specifies tooltip behavior for the baseline start value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      baselineStart: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * If not specified, a default converter depending on the axes scale is used.
         * See also {@link oj.DateTimeConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.baselineStart.converter
         * @ojshortdesc An object used to format the baseline start value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
         * @default null
         */
        converter: null,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelBaselineStart}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.baselineStart.tooltipLabel
         * @ojshortdesc The label to display before the baseline start value in the tooltip. See the Help documentation for more information.
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
         * @ojshortdesc Specifies whether the baseline start value is displayed in the tooltip.
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
       * @ojshortdesc Specifies tooltip behavior for the baseline end value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      baselineEnd: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * If not specified, a default converter depending on the axes scale is used.
         * See also {@link oj.DateTimeConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.baselineEnd.converter
         * @ojshortdesc An object used to format the baseline end value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
         * @default null
         */
        converter: null,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelBaselineEnd}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.baselineEnd.tooltipLabel
         * @ojshortdesc The label to display before the baseline end value in the tooltip. See the Help documentation for more information.
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
         * @ojshortdesc Specifies whether the baseline end value is displayed in the tooltip.
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
       * @ojshortdesc Specifies tooltip behavior for the milestone baseline date value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      baselineDate: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * If not specified, a default converter depending on the axes scale is used.
         * See also {@link oj.DateTimeConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.baselineDate.converter
         * @ojshortdesc An object used to format the milestone baseline date value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
         * @default null
         */
        converter: null,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelBaselineDate}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.baselineDate.tooltipLabel
         * @ojshortdesc The label to display before the milestone baseline date value in the tooltip. See the Help documentation for more information.
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
         * @ojshortdesc Specifies whether the milestone baseline date value is displayed in the tooltip.
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
       * Specifies tooltip behavior for the start value of the downtime.
       * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
       * @expose
       * @name valueFormats.downtimeStart
       * @ojshortdesc Specifies tooltip behavior for the downtime start value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      downtimeStart: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * If not specified, a default converter depending on the axes scale is used.
         * See also {@link oj.DateTimeConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.downtimeStart.converter
         * @ojshortdesc An object used to format the downtime start value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
         * @default null
         */
        converter: null,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelDowntimeStart}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.downtimeStart.tooltipLabel
         * @ojshortdesc The label to display before the downtime start value in the tooltip. See the Help documentation for more information.
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
         * @name valueFormats.downtimeStart.tooltipDisplay
         * @ojshortdesc Specifies whether the downtime start value is displayed in the tooltip.
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
       * Specifies tooltip behavior for the end value of the downtime.
       * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
       * @expose
       * @name valueFormats.downtimeEnd
       * @ojshortdesc Specifies tooltip behavior for the downtime end value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      downtimeEnd: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * If not specified, a default converter depending on the axes scale is used.
         * See also {@link oj.DateTimeConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.downtimeEnd.converter
         * @ojshortdesc An object used to format the downtime end value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
         * @default null
         */
        converter: null,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelDowntimeEnd}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.downtimeEnd.tooltipLabel
         * @ojshortdesc The label to display before the downtime end value in the tooltip. See the Help documentation for more information.
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
         * @name valueFormats.downtimeEnd.tooltipDisplay
         * @ojshortdesc Specifies whether the downtime end value is displayed in the tooltip.
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
       * Specifies tooltip behavior for the start value of the overtime.
       * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
       * @expose
       * @name valueFormats.overtimeStart
       * @ojshortdesc Specifies tooltip behavior for the overtime start value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      overtimeStart: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * If not specified, a default converter depending on the axes scale is used.
         * See also {@link oj.DateTimeConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.overtimeStart.converter
         * @ojshortdesc An object used to format the overtime start value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
         * @default null
         */
        converter: null,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelOvertimeStart}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.overtimeStart.tooltipLabel
         * @ojshortdesc The label to display before the overtime start value in the tooltip. See the Help documentation for more information.
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
         * @name valueFormats.overtimeStart.tooltipDisplay
         * @ojshortdesc Specifies whether the overtime start value is displayed in the tooltip.
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
       * Specifies tooltip behavior for the end value of the overtime.
       * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
       * @expose
       * @name valueFormats.overtimeEnd
       * @ojshortdesc Specifies tooltip behavior for the overtime end value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      overtimeEnd: {
        /**
         * A converter (an instance that duck types {@link oj.Converter}) used to format the label.
         * If not specified, a default converter depending on the axes scale is used.
         * See also {@link oj.DateTimeConverter}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.overtimeEnd.converter
         * @ojshortdesc An object used to format the overtime end value. See the Help documentation for more information.
         * @memberof! oj.ojGantt
         * @instance
         * @type {?Object}
         * @ojsignature {target: "Type", value: "?(oj.Converter<string>)", jsdocOverride: true}
         * @default null
         */
        converter: null,
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelOvertimeEnd}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.overtimeEnd.tooltipLabel
         * @ojshortdesc The label to display before the overtime end value in the tooltip. See the Help documentation for more information.
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
         * @name valueFormats.overtimeEnd.tooltipDisplay
         * @ojshortdesc Specifies whether the overtime end value is displayed in the tooltip.
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
       * Specifies tooltip behavior for the attribute value.
       * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
       * @expose
       * @name valueFormats.attribute
       * @ojshortdesc Specifies tooltip behavior for the attribute value.
       * @memberof! oj.ojGantt
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       */
      attribute: {
        /**
         * A string representing the label that is displayed before the value in the tooltip. The default value comes from {@link oj.ojGantt#translations.labelAttribute}.
         * <br></br>See the <a href="#valueFormats">value-formats</a> attribute for usage examples.
         * @expose
         * @name valueFormats.attribute.tooltipLabel
         * @ojshortdesc The label to display before the attribute value in the tooltip. See the Help documentation for more information.
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
         * @name valueFormats.attribute.tooltipDisplay
         * @ojshortdesc Specifies whether the attribute value is displayed in the tooltip.
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
     * The end time of the Gantt's viewport.
     * If not specified or invalid, this will default to a value determined by the initial 'scale' of the minor axis and the width of the Gantt.
     * See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @name viewportEnd
     * @ojshortdesc The Gantt viewport end time. See the Help documentation for more information.
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
     * The start time of the Gantt's viewport.
     * If not specified or invalid, this will default to a value determined by the initial 'scale' of the minor axis and the width of the Gantt.
     * See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @name viewportStart
     * @ojshortdesc The Gantt viewport start time. See the Help documentation for more information.
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
     * Specifies whether zooming is allowed on the Gantt. When 'off', gestures that perform zooming are disabled, and zoom controls are not rendered.
     * @expose
     * @name zooming
     * @ojshortdesc Specifies whether zooming is allowed on the Gantt.
     * @memberof oj.ojGantt
     * @instance
     * @type {string}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "on"
     *
     * @example <caption>Initialize the Gantt with the <code class="prettyprint">zooming</code> attribute specified:</caption>
     * &lt;oj-gantt zooming='off'>&lt;/oj-gantt>
     *
     * @example <caption>Get or set the <code class="prettyprint">zooming</code> property after initialization:</caption>
     * // getter
     * var value = myGantt.zooming;
     *
     * // setter
     * myGantt.zooming = 'off';
     */
    zooming: 'on',
    /**
     * Triggered after the viewport is changed due to a zoom or scroll operation.
     * If the viewport changes the minor (and/or major) axis scale into a custom timescale instance of {@link DvtTimeComponentScale},
     * then the minorAxisScale (and/or majorAxisScale) will be the "name" field value of the instance.
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
     * Triggered after tasks are moved to a different location of some row within
     * the gantt via drag and drop or equivalent keyboard actions
     * (See <a href="#keyboard-section">Keyboard End User Information</a>).
     * See also the <a href="#dnd.move.tasks">dnd.move.tasks</a> attribute.
     *
     * @property {Object[]} taskContexts An array of dataContexts of the moved tasks.
     *    The first dataContext of the array corresponds to the source task where the move was initiated
     *    (e.g. the task directly under the mouse when drag started).
     * @property {Object} taskContexts.data The data object of the source task.
     * @property {Object} taskContexts.rowData The data for the row the source task belongs to.
     * @property {Object|null} taskContexts.itemData The data provider data object for the source task.
     * @property {string} taskContexts.color The color of the source task.
     * @property {string} value The value at the target position the source task is moved to.
     *    See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
     * @property {string} start The start value of the task, if the source task were to move to the target position.
     *    See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
     * @property {string} end The end value of the task, if the source task were to move to the target position.
     *    See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
     * @property {string} baselineStart The start value of the baseline, if the source task were to move to the target position.
     *    This is null if baseline is not defined on the task.
     *    See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
     * @property {string} baselineEnd The end value of the baseline, if the source task were to move to the target position.
     *    This is null if baseline is not defined on the task.
     *    See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
     * @property {Object} rowContext The data context for the row at the target position.
     * @property {Object} rowContext.rowData The data for the target row.
     * @property {Element} rowContext.componentElement The gantt element.
     * @ojsignature [{target: "Type", value: "Array<{data: oj.ojGantt.RowTask<K2,D2>, rowData: oj.ojGantt.Row<K2,D2,K3,D3>, itemData: D2|null, color: string}>", for: "taskContexts"},
     *               {target: "Type", value: "{rowData: oj.ojGantt.Row<K2,D2,K3,D3>, componentElement: Element}", for: "rowContext"},
     *               {target: "Type", value: "oj.ojGantt.RowTask<K2,D2>", for: "taskContexts.data", jsdocOverride:true},
     *               {target: "Type", value: "oj.ojGantt.Row<K2,D2,K3,D3>", for: "taskContexts.rowData", jsdocOverride:true},
     *               {target: "Type", value: "oj.ojGantt.Row<K2,D2,K3,D3>", for: "rowContext.rowData", jsdocOverride:true},
     *               {target: "Type", value: "<K2=any, D2=any, K3=any, D3=any>", for: "genericTypeParameters"}]
     *
     * @expose
     * @event
     * @memberof oj.ojGantt
     * @ojshortdesc Triggered after tasks are moved to a different location
     *    within the Gantt via a drag and drop operation or an equivalent keyboard action.
     *    See the Help documentation for more information.
     * @instance
     * @ojbubbles
     */
    move: null,
    /**
     * Triggered after tasks are resized.
     * See also the <a href="#taskDefaults.resizable">task-defaults.resizable</a> attribute.
     *
     * @property {Object[]} taskContexts An array of dataContexts of the resized tasks.
     *    The first dataContext of the array corresponds to the source task where the resize was initiated
     *    (e.g. the task directly under the mouse when drag started).
     * @property {Object} taskContexts.data The data object of the source task.
     * @property {Object} taskContexts.rowData The data for the row the source task belongs to.
     * @property {Object|null} taskContexts.itemData The data provider data object for the source task.
     * @property {string} taskContexts.color The color of the source task.
     * @property {string} type The type of resize, either 'start' or 'end'.
     * @property {string} value The value at the target position.
     *    See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
     * @property {string} start The start value of the task (always chronologically before, or equivalent to, the end value), if the resize happened.
     *    See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
     * @property {string} end The end value of the task (always chronologically after, or equivalent to, the start value), if the resize happened.
     * See <a href="#formats-section">Date and Time Formats</a> for more details on the ISO string format.
     * @ojsignature [{target: "Type", value: "Array<{data: oj.ojGantt.RowTask<K2,D2>, rowData: oj.ojGantt.Row<K2,D2,K3,D3>, itemData: D2|null, color: string}>", for: "taskContexts"},
     *               {target: "Type", value: "oj.ojGantt.RowTask<K2,D2>", for: "taskContexts.data", jsdocOverride:true},
     *               {target: "Type", value: "oj.ojGantt.Row<K2,D2,K3,D3>", for: "taskContexts.rowData", jsdocOverride:true},
     *               {target: "Type", value: "<K2=any, D2=any, K3=any, D3=any>", for: "genericTypeParameters"}]
     *
     * @expose
     * @event
     * @memberof oj.ojGantt
     * @ojshortdesc Triggered after tasks are resized.
     * @instance
     * @ojbubbles
     */
    resize: null
  },

  // @inheritdoc
  _CreateDvtComponent: function (context, callback, callbackObj) {
    // eslint-disable-next-line no-param-reassign
    context.styleClasses = this._getComponentStyleMap();
    return new Gantt(context, callback, callbackObj);
  },

  // @inheritdoc
  _AfterCreate: function () {
    // In 10.0.0 we deprecate returning '0' as the default value for
    // borderRadius, and don't gaurantee any default values (like the other DVTs).
    // To prevent breakage (in Alta), always return '0' if someone tries to get
    // the borderRadius without setting one first (very unlikely anyone is doing this, but just in case).
    // TODO: Consider removing all of this in 12.0.0+
    if (parseJSONFromFontFamily('oj-theme-json').behavior !== 'alta') {
      this._super();
      return;
    }

    var isBorderRadiusSet = this.options.taskDefaults.borderRadius !== undefined;
    var isBaselineBorderRadiusSet = this.options.taskDefaults.baseline.borderRadius !== undefined;
    var isProgressBorderRadiusSet = this.options.taskDefaults.progress.borderRadius !== undefined;

    this._super();

    if (!isBorderRadiusSet) {
      this.options.taskDefaults.borderRadius = '0';
    }
    if (!isBaselineBorderRadiusSet) {
      this.options.taskDefaults.baseline.borderRadius = '0';
    }
    if (!isProgressBorderRadiusSet) {
      this.options.taskDefaults.progress.borderRadius = '0';
    }
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
    return {
      databody: 'oj-gantt-container',
      databodyDim: 'oj-gantt-databody-dim',
      dependencyLine: 'oj-gantt-dependency-line',
      dependencyRectilinearLine: 'oj-gantt-dependency-rectilinear-line',
      dependencyStraightLine: 'oj-gantt-dependency-straight-line',
      dependencyStartOpenStraightLine: 'oj-gantt-dependency-start-open-straight-line',
      dependencyStartClosedStraightLine: 'oj-gantt-dependency-start-closed-straight-line',
      dependencyEndOpenStraightLine: 'oj-gantt-dependency-end-open-straight-line',
      dependencyEndClosedStraightLine: 'oj-gantt-dependency-end-closed-straight-line',
      dependencyLineConnector: 'oj-gantt-dependency-line-connector',
      dependencyRectilinearLineArrowConnector:
        'oj-gantt-dependency-rectilinear-line-arrow-connector',
      dependencyStraightLineOpenCircleConnector:
        'oj-gantt-dependency-straight-line-open-circle-connector',
      dependencyStraightLineClosedCircleConnector:
        'oj-gantt-dependency-straight-line-closed-circle-connector',
      dependencyLineCustom: 'oj-gantt-dependency-line-custom',
      nodata: 'oj-gantt-no-data-message',
      hgridline: 'oj-gantt-horizontal-gridline',
      majorvgridline: 'oj-gantt-major-vertical-gridline',
      minorvgridline: 'oj-gantt-minor-vertical-gridline',
      majorAxis: 'oj-gantt-major-axis',
      majorAxisTicks: 'oj-gantt-major-axis-separator',
      majorAxisLabels: 'oj-gantt-major-axis-label',
      minorAxis: 'oj-gantt-minor-axis',
      minorAxisTicks: 'oj-gantt-minor-axis-separator',
      minorAxisLabels: 'oj-gantt-minor-axis-label',
      row: 'oj-gantt-row',
      rowLabel: 'oj-gantt-row-label',
      task: 'oj-gantt-task',
      taskHighlight: 'oj-gantt-task-highlight',
      taskCustom: 'oj-gantt-task-custom',
      taskBar: 'oj-gantt-task-bar',
      taskBackdrop: 'oj-gantt-task-backdrop',
      taskMilestone: 'oj-gantt-task-milestone',
      taskSummary: 'oj-gantt-task-summary',
      taskSummaryProgress: 'oj-gantt-task-summary-progress',
      taskDragImage: 'oj-gantt-task-drag-image',
      taskResizeHandle: 'oj-gantt-task-resize-handle',
      baseline: 'oj-gantt-baseline',
      baselineBar: 'oj-gantt-baseline-bar',
      baselineMilestone: 'oj-gantt-baseline-milestone',
      taskLabel: 'oj-gantt-task-label',
      taskProgress: 'oj-gantt-task-progress',
      taskUnprogress: 'oj-gantt-task-progress-container',
      taskOvertime: 'oj-gantt-task-overtime',
      taskDowntime: 'oj-gantt-task-downtime',
      taskAttribute: 'oj-gantt-task-attribute',
      tooltipLabel: 'oj-dvt-datatip-label',
      tooltipValue: 'oj-dvt-datatip-value',
      tooltipTable: 'oj-dvt-datatip-table',
      referenceObjectInnerLine: 'oj-gantt-reference-object-inner-line',
      referenceObjectLine: 'oj-gantt-reference-object-line',
      referenceObjectArea: 'oj-gantt-reference-object-area',
      timeCursorLine: 'oj-gantt-time-cursor-line',
      timeCursorInnerLine: 'oj-gantt-time-cursor-inner-line',
      selected: 'oj-selected',
      hover: 'oj-hover',
      focus: 'oj-focus',
      focusHighlight: 'oj-focus-highlight',
      highLevelDnDMoveDroppable: 'oj-gantt-dnd-move-droppable',
      highLevelDnDResizeDroppable: 'oj-gantt-dnd-resize-droppable',
      draggable: 'oj-draggable',
      activeDrop: 'oj-active-drop',
      invalidDrop: 'oj-invalid-drop'
    };
  },

  // @inheritdoc
  _IsDraggable: function () {
    const agentInfo = oj.AgentUtils.getAgentInfo();
    const isTouchDevice =
      agentInfo.os === oj.AgentUtils.OS.IOS || agentInfo.os === oj.AgentUtils.OS.ANDROID;
    // On desktop, for performance reasons, normal mouse events are used for DnD.
    // On mobile, HTML5 DnD events are used because they're fast.
    if (isTouchDevice) {
      const dndMoveEnabled =
        this.options.dnd && this.options.dnd.move && this.options.dnd.move.tasks === 'enabled';
      const taskResizeEnabled =
        this.options.taskDefaults && this.options.taskDefaults.resizable === 'enabled';
      return dndMoveEnabled || taskResizeEnabled;
    }
    return false;
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
    // border-radius temporarily replaced with border-top-left-radius due to the same reason tracked by
    // JET-44647: Border-color css styles not being picked up through style bridge in Firefox

    var styleClasses = this._super();

    // animation duration
    styleClasses['oj-gantt'] = {
      path: '_resources/animationDuration',
      property: 'ANIM_DUR'
    };

    // Axes labels
    styleClasses['oj-gantt-major-axis'] = {
      path: '_resources/majorAxis/height',
      property: 'height'
    };

    styleClasses['oj-gantt-major-axis-label'] = {
      path: '_resources/majorAxisLabelFontProp',
      property: 'TEXT'
    };

    styleClasses['oj-gantt-minor-axis'] = {
      path: '_resources/minorAxis/height',
      property: 'height'
    };

    styleClasses['oj-gantt-minor-axis-label'] = {
      path: '_resources/minorAxisLabelFontProp',
      property: 'TEXT'
    };

    // chart border
    styleClasses['oj-gantt-container'] = [
      {
        path: '_resources/chartArea/strokeWidth',
        property: 'stroke-width'
      },
      {
        path: '_resources/componentPaddingStart',
        property: 'padding-inline-start'
      }
    ];

    // horizontal gridline width
    styleClasses['oj-gantt-horizontal-gridline'] = {
      path: '_resources/horizontalGridlineWidth',
      property: 'stroke-width'
    };

    // task label properties
    styleClasses['oj-gantt-task-label'] = [
      {
        path: '_resources/taskLabelFontProp',
        property: 'TEXT'
      },
      {
        path: '_resources/taskLabelMarginLeft',
        property: 'margin-left'
      },
      {
        path: '_resources/taskLabelMarginRight',
        property: 'margin-right'
      }
    ];

    // row properties
    styleClasses['oj-gantt-row'] = [
      {
        path: '_resources/rowPaddingTop',
        property: 'padding-top'
      },
      {
        path: '_resources/rowPaddingBottom',
        property: 'padding-bottom'
      }
    ];

    styleClasses['oj-gantt-row-label'] = [
      {
        path: '_resources/rowLabelFontProp',
        property: 'TEXT'
      },
      {
        path: '_resources/rowLabelPaddingStart',
        property: 'padding-inline-start'
      },
      {
        path: '_resources/rowLabelPaddingEnd',
        property: 'padding-inline-end'
      }
    ];

    // task properties
    styleClasses['oj-gantt-task'] = [
      {
        path: '_resources/taskDefaults/height',
        property: 'height'
      },
      {
        path: '_resources/taskPaddingLeft',
        property: 'padding-left'
      },
      {
        path: '_resources/taskPaddingRight',
        property: 'padding-right'
      },
      {
        path: '_resources/taskMarginLeft',
        property: 'margin-left'
      },
      {
        path: '_resources/taskMarginRight',
        property: 'margin-right'
      },
      {
        path: 'taskDefaults/borderRadius',
        property: 'border-top-left-radius'
      }
    ];

    styleClasses['oj-gantt-task-progress'] = {
      path: 'taskDefaults/progress/borderRadius',
      property: 'border-top-left-radius'
    };

    styleClasses['oj-gantt-baseline'] = {
      path: 'taskDefaults/baseline/borderRadius',
      property: 'border-top-left-radius'
    };

    styleClasses['oj-gantt-baseline-milestone'] = {
      path: '_resources/milestoneBaselineBorderRadius',
      property: 'border-top-left-radius'
    };

    styleClasses['oj-gantt-baseline-bar'] = [
      {
        path: '_resources/taskDefaults/baseline/height',
        property: 'height'
      },
      {
        path: '_resources/baselineMarginTop',
        property: 'margin-top'
      }
    ];

    styleClasses['oj-gantt-task-milestone'] = {
      path: '_resources/milestoneBorderRadius',
      property: 'border-top-left-radius'
    };

    styleClasses['oj-gantt-task-downtime'] = [
      {
        path: '_resources/taskDowntimeHeight',
        property: 'height'
      },
      {
        path: '_resources/taskDowntimeBorderRadius',
        property: 'border-top-left-radius'
      }
    ];

    styleClasses['oj-gantt-task-attribute'] = {
      path: '_resources/taskAttributeHeight',
      property: 'height'
    };

    return styleClasses;
  },

  // @inheritdoc
  _LoadResources: function () {
    this._super();

    var resources = this.options._resources;

    // zoom control icon images
    resources.zoomIn = 'oj-fwk-icon oj-fwk-icon-plus';
    resources.zoomOut = 'oj-fwk-icon oj-fwk-icon-minus';

    // expand/collapse icon images
    // Add images
    resources.closed = 'oj-fwk-icon oj-fwk-icon-caret-end';
    resources.open = 'oj-fwk-icon oj-fwk-icon-caret-s';

    // progress value converter for task tooltip
    resources.percentConverter = new IntlNumberConverter({ style: 'percent' });
  },

  // @inheritdoc
  _ProcessOptions: function () {
    this._super();

    if (this.options.rowData) {
      this._fetchDataHandler = this._getFetchDataHandler('rowData');
    }

    if (this.options.taskData) {
      this._fetchDataHandler = this._getFetchDataHandler('taskData');
    }
  },

  // @inheritdoc
  _GetComponentRendererOptions: function () {
    return [
      { path: 'tooltip/renderer', slot: 'tooltipTemplate' },
      { path: 'rowAxis/label/renderer', slot: 'rowAxisLabelTemplate' },
      { path: 'taskContent/renderer', slot: 'taskContentTemplate' },
      { path: 'dependencyContent/renderer', slot: 'dependencyContentTemplate' }
    ];
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
    } else if (type === 'resize') {
      var resizePayload = {
        taskContexts: event.taskContexts,
        value: event.value,
        start: event.start,
        end: event.end,
        type: event.typeDetail
      };
      this._trigger('resize', null, resizePayload);
    } else if (type === 'scrollPositionChange') {
      var scrollPositionChangePayload = {
        y: event.y,
        rowIndex: event.rowIndex,
        offsetY: event.offsetY
      };
      this._UserOptionChange('scrollPosition', scrollPositionChangePayload);
      this._trigger('scrollPositionChange', null, scrollPositionChangePayload);
    } else if (type === 'expand') {
      var expandPayload = {
        rowData: event.rowData,
        id: event.id,
        itemData: event.itemData
      };
      var self = this;
      this._NotReady(); // Register busy state
      var fetchDataPromise;
      if (this.options.rowData) {
        fetchDataPromise = this._fetchDataHandler(
          this.options.rowData,
          event.expanded,
          expandPayload.rowData,
          expandPayload.id
        );
      } else if (this.options.taskData) {
        fetchDataPromise = this._fetchDataHandler(
          this.options.taskData,
          event.expanded,
          expandPayload.rowData,
          expandPayload.id
        );
      } else {
        fetchDataPromise = Promise.resolve();
      }
      fetchDataPromise.then(function () {
        self._UserOptionChange('expanded', event.expanded);
        self._Render();
        self._trigger('expand', null, expandPayload);
      });
    } else if (type === 'collapse') {
      var collapsePayload = {
        rowData: event.rowData,
        itemData: event.itemData
      };
      this._UserOptionChange('expanded', event.expanded);
      this._Render();
      this._trigger('collapse', null, collapsePayload);
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

    // Don't clone areas where app may pass in an instance of DvtTimeComponentScales/Converter
    // If the instance is a class, class methods may not be cloned for some reason.
    noClonePaths.majorAxis = { converter: true, scale: true, zoomOrder: true };
    noClonePaths.minorAxis = { converter: true, scale: true, zoomOrder: true };

    // Don't clone areas where app may pass in an instance of Converter
    // If the instance is a class, class methods may not be cloned for some reason.
    noClonePaths.valueFormats = {
      baselineDate: { converter: true },
      baselineEnd: { converter: true },
      baselineStart: { converter: true },
      date: { converter: true },
      downtimeEnd: { converter: true },
      downtimeStart: { converter: true },
      end: { converter: true },
      overtimeEnd: { converter: true },
      overtimeStart: { converter: true },
      progress: { converter: true },
      start: { converter: true }
    };
    noClonePaths._resources.percentConverter = true;
    return noClonePaths;
  },

  // @inheritdoc
  _GetComponentDeferredDataPaths: function () {
    return { root: ['rows', 'dependencies', 'taskData', 'dependencyData', 'rowData'] };
  },

  // @inheritdoc
  _GetSimpleDataProviderConfigs: function () {
    var configs = {
      dependencyData: {
        templateName: 'dependencyTemplate',
        templateElementName: 'oj-gantt-dependency',
        resultPath: 'dependencies'
      },
      taskData: {
        templateName: 'taskTemplate',
        templateElementName: 'oj-gantt-task',
        resultPath: 'rows',
        derivedTemplates: ['rowTemplate']
      },
      rowData: {
        templateName: 'rowMappingTemplate',
        templateElementName: 'oj-gantt-row',
        resultPath: 'rows',
        derivedTemplates: ['taskMappingTemplate', 'referenceObjectMappingTemplate']
      }
    };
    Object.defineProperty(configs.taskData, 'expandedKeySet', {
      get: function () {
        return this.options.expanded;
      }.bind(this)
    });
    Object.defineProperty(configs.rowData, 'expandedKeySet', {
      get: function () {
        return this.options.expanded;
      }.bind(this)
    });
    return configs;
  },

  // @inheritdoc
  _GetDataProviderSeriesConfig: function () {
    return {
      dataProperty: 'taskData',
      defaultSingleSeries: false,
      idAttribute: 'rowId',
      itemsKey: 'tasks',
      templateName: 'rowTemplate',
      templateElementName: 'oj-gantt-row'
    };
  },

  // @inheritdoc
  _OptionChangeHandler: function (options) {
    var hasProperty = Object.prototype.hasOwnProperty.bind(options);
    // If there is a change in the expanded property, the data provider state needs to be cleared
    if (hasProperty('expanded')) {
      this._ClearDataProviderState('taskData');
      this._ClearDataProviderState('rowData');
    }
    this._super(options);
  },

  // @inheritdoc
  _ProcessTemplates: function (
    dataProperty,
    data,
    templateEngine,
    isTreeData,
    parentKey,
    isRoot,
    updateChildren
  ) {
    let results = isRoot ? this._TemplateHandler.getComponentResults(dataProperty) : null;
    if (!results) {
      const pathValues = this._super(
        dataProperty,
        data,
        templateEngine,
        isTreeData,
        parentKey,
        isRoot,
        updateChildren
      );
      if (dataProperty === 'rowData') {
        const templates = this._TemplateHandler.getTemplates();
        const tasksTemplateName = 'taskMappingTemplate';
        const tasksTemplateElementName = 'oj-gantt-task';
        const tasksTemplate = templates[tasksTemplateName] ? templates[tasksTemplateName][0] : null;
        const refObjsTemplateName = 'referenceObjectMappingTemplate';
        const refObjsTemplateElementName = 'oj-gantt-reference-object';
        const refObjsTemplate = templates[refObjsTemplateName]
          ? templates[refObjsTemplateName][0]
          : null;

        const processTemplate = (nodeData, nodeKey, template, elementName, context) => {
          let processedDatum;
          if (template) {
            processedDatum = this._TemplateHandler.processNodeTemplate(
              dataProperty,
              templateEngine,
              template,
              elementName,
              context,
              nodeKey,
              false
            );
          } else {
            processedDatum = Object.create(nodeData);
            processedDatum._noTemplate = true;
            processedDatum._dvtNoClone = true;
          }
          processedDatum._itemData = nodeData;
          return processedDatum;
        };

        const processInnerData = (rowDatum) => {
          // task template mapping
          const tasks = rowDatum.tasks || [];
          // eslint-disable-next-line no-param-reassign
          rowDatum.tasks = tasks.map((taskDatum, i) => {
            const taskContext = {
              data: taskDatum,
              index: i,
              rowData: rowDatum._itemData
            };
            // Use rowid + index as key, since we don't have the task ids at this point.
            const resolvedTaskObj = processTemplate(
              taskDatum,
              `${rowDatum.id}_${i}`,
              tasksTemplate,
              tasksTemplateElementName,
              taskContext
            );
            resolvedTaskObj.id = resolvedTaskObj.taskId;
            resolvedTaskObj.taskId = undefined;
            return resolvedTaskObj;
          });
          // reference objects template mapping
          const referenceObjects = rowDatum.referenceObjects || [];
          // eslint-disable-next-line no-param-reassign
          rowDatum.referenceObjects = referenceObjects.map((refObjDatum, i) => {
            const refObjContext = {
              data: refObjDatum,
              index: i,
              rowData: rowDatum._itemData
            };
            // Use rowid + index as key, since we ref objects don't have ids.
            return processTemplate(
              refObjDatum,
              `${rowDatum.id}_${i}`,
              refObjsTemplate,
              refObjsTemplateElementName,
              refObjContext
            );
          });

          if (rowDatum.rows) {
            rowDatum.rows.forEach(processInnerData);
          }
        };
        pathValues.values[0].forEach(processInnerData);
        results = pathValues;
      } else if (dataProperty === 'taskData' && isTreeData) {
        // Hierarchical Task Tree case, wrap each task with a row object
        const config = this._GetSimpleDataProviderConfigs()[dataProperty];
        const rowsConfig = this._GetDataProviderSeriesConfig();
        const rowsTemplateName = rowsConfig.templateName;
        const rowsTemplateElementName = rowsConfig.templateElementName;
        const rowsTemplate = this._TemplateHandler.getTemplates()[rowsTemplateName];
        const parentElement = this.element[0];

        const wrapWithRows = function (taskChildSubTrees, parentData, _parentKey) {
          for (let i = 0; i < taskChildSubTrees.length; i++) {
            const task = taskChildSubTrees[i];
            const rowId = task.rowId != null ? task.rowId : task.id;
            let rowWrappedObject = { id: rowId, tasks: [task] };

            // If provided, augment row object with template evaluated properties
            if (rowsTemplate) {
              const taskContext = {
                data: task._itemData,
                index: i,
                key: task.id,
                parentData: parentData,
                parentKey: _parentKey
              };
              const rowContext = {
                componentElement: parentElement,
                id: rowId,
                index: i,
                tasks: [taskContext]
              };
              try {
                const resolvedRowObj = this._TemplateHandler.processNodeTemplate(
                  dataProperty,
                  templateEngine,
                  rowsTemplate[0],
                  rowsTemplateElementName,
                  rowContext,
                  rowId
                );
                resolvedRowObj.id = rowWrappedObject.id;
                resolvedRowObj.tasks = rowWrappedObject.tasks;
                rowWrappedObject = resolvedRowObj;
              } catch (error$1) {
                error(error$1);
              }
            }

            const taskChildren = task[config.resultPath];
            if (taskChildren) {
              task[config.resultPath] = undefined;
              const newParentData = parentData.slice(0);
              newParentData.push(task._itemData);
              rowWrappedObject.rows = wrapWithRows(taskChildren, newParentData, task.id);
            }
            // eslint-disable-next-line no-param-reassign
            taskChildSubTrees[i] = rowWrappedObject;
          }
          return taskChildSubTrees;
        }.bind(this);
        results = {
          paths: pathValues.paths,
          values: [wrapWithRows(pathValues.values[0], [], undefined)]
        };
      } else {
        results = pathValues;
      }

      if (isRoot) {
        this._TemplateHandler.setComponentResults(dataProperty, results);
      }
    }
    return results;
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
   * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
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

// Add custom getters for properties
setDefaultOptions({
  ojGantt: {
    majorAxis: {
      converter: createDynamicPropertyGetter(function () {
        return _getTimeAxisDefaultConverter();
      })
    },
    minorAxis: {
      converter: createDynamicPropertyGetter(function () {
        return _getTimeAxisDefaultConverter();
      })
    },
    valueFormats: {
      progress: {
        converter: createDynamicPropertyGetter(function () {
          return _getTaskProgressDefaultConverter();
        })
      }
    }
  }
});
