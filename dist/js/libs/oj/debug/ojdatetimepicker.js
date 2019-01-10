/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'hammerjs', 'ojs/ojcontext', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojeditablevalue',
        'ojs/ojinputtext', 'ojs/ojlocaledata', 'ojs/ojvalidation-base', 'ojs/ojvalidation-datetime', 'ojs/ojanimation', 'ojs/ojlogger', 'ojs/ojpopup', 'ojs/ojbutton'],
       function(oj, $, Hammer, Context, ThemeUtils, Components, compCore, inputText, LocaleData, __ValidationBase, validation, AnimationUtils, Logger)
{

var __oj_date_picker_metadata = 
{
  "properties": {
    "asyncValidators": {
      "type": "Array<Object>",
      "value": []
    },
    "autofocus": {
      "type": "boolean",
      "value": false,
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "converter": {
      "type": "object",
      "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({\"day\":\"2-digit\",\"month\":\"2-digit\",\"year\":\"2-digit\"})",
      "properties": {
        "type": {
          "type": "string"
        },
        "options": {
          "type": "object"
        }
      }
    },
    "datePicker": {
      "type": "object",
      "properties": {
        "changeMonth": {
          "type": "string",
          "enumValues": [
            "none",
            "select"
          ],
          "value": "select"
        },
        "changeYear": {
          "type": "string",
          "enumValues": [
            "none",
            "select"
          ],
          "value": "select"
        },
        "currentMonthPos": {
          "type": "number",
          "value": 0
        },
        "daysOutsideMonth": {
          "type": "string",
          "enumValues": [
            "hidden",
            "selectable",
            "visible"
          ],
          "value": "hidden"
        },
        "footerLayout": {
          "type": "string",
          "enumValues": [
            "",
            "today"
          ],
          "value": "today"
        },
        "numberOfMonths": {
          "type": "number",
          "value": 1
        },
        "showOn": {
          "type": "string",
          "enumValues": [
            "focus",
            "image"
          ],
          "value": "focus"
        },
        "stepBigMonths": {
          "type": "number",
          "value": 12
        },
        "stepMonths": {
          "type": "string|number",
          "value": "numberOfMonths"
        },
        "weekDisplay": {
          "type": "string",
          "enumValues": [
            "none",
            "number"
          ],
          "value": "none"
        },
        "yearRange": {
          "type": "string",
          "value": "c-10:c+10"
        }
      }
    },
    "dayFormatter": {
      "type": "function"
    },
    "dayMetaData": {
      "type": "object"
    },
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "displayOptions": {
      "type": "object",
      "properties": {
        "converterHint": {
          "type": "Array<string>|string",
          "value": [
            "placeholder",
            "notewindow"
          ]
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string",
          "value": [
            "inline"
          ]
        },
        "validatorHint": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string"
        }
      }
    },
    "helpHints": {
      "type": "object",
      "properties": {
        "definition": {
          "type": "string",
          "value": ""
        },
        "source": {
          "type": "string",
          "value": ""
        }
      }
    },
    "keyboardEdit": {
      "type": "string",
      "enumValues": [
        "disabled"
      ],
      "value": "disabled"
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "max": {
      "type": "string"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "min": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "value": "",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "pickerAttributes": {
      "type": "object",
      "properties": {
        "style": {
          "type": "string"
        },
        "class": {
          "type": "string"
        }
      }
    },
    "placeholder": {
      "type": "string"
    },
    "rawValue": {
      "type": "string",
      "writeback": true,
      "readOnly": true
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "renderMode": {
      "type": "string",
      "enumValues": [
        "jet"
      ],
      "value": "jet"
    },
    "required": {
      "type": "boolean",
      "value": false
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "currentText": {
          "type": "string"
        },
        "dateRestriction": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "dateTimeRange": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "object",
              "properties": {
                "inRange": {
                  "type": "string"
                },
                "max": {
                  "type": "string"
                },
                "min": {
                  "type": "string"
                }
              }
            },
            "messageDetail": {
              "type": "object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            },
            "messageSummary": {
              "type": "object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            }
          }
        },
        "nextText": {
          "type": "string"
        },
        "prevText": {
          "type": "string"
        },
        "regexp": {
          "type": "object",
          "properties": {
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "required": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "tooltipCalendar": {
          "type": "string"
        },
        "tooltipCalendarDisabled": {
          "type": "string"
        },
        "tooltipCalendarTime": {
          "type": "string"
        },
        "tooltipCalendarTimeDisabled": {
          "type": "string"
        },
        "weekHeader": {
          "type": "string"
        }
      }
    },
    "valid": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "invalidHidden",
        "invalidShown",
        "pending",
        "valid"
      ],
      "readOnly": true
    },
    "validators": {
      "type": "Array<Object>",
      "value": []
    },
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {
    "hide": {},
    "refresh": {},
    "show": {},
    "validate": {},
    "reset": {},
    "showMessages": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {}
  },
  "extension": {}
};
var __oj_date_time_picker_metadata = 
{
  "properties": {
    "asyncValidators": {
      "type": "Array<Object>",
      "value": []
    },
    "autofocus": {
      "type": "boolean",
      "value": false,
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "converter": {
      "type": "object",
      "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({\"day\": \"2-digit\", \"month\": \"2-digit\", \"year\": \"2-digit\", \"hour\": \"2-digit\", \"minute\": \"2-digit\"})",
      "properties": {
        "type": {
          "type": "string"
        },
        "options": {
          "type": "object"
        }
      }
    },
    "datePicker": {
      "type": "object",
      "properties": {
        "changeMonth": {
          "type": "string",
          "enumValues": [
            "none",
            "select"
          ],
          "value": "select"
        },
        "changeYear": {
          "type": "string",
          "enumValues": [
            "none",
            "select"
          ],
          "value": "select"
        },
        "currentMonthPos": {
          "type": "number",
          "value": 0
        },
        "daysOutsideMonth": {
          "type": "string",
          "enumValues": [
            "hidden",
            "selectable",
            "visible"
          ],
          "value": "hidden"
        },
        "footerLayout": {
          "type": "string",
          "enumValues": [
            "",
            "today"
          ],
          "value": "today"
        },
        "numberOfMonths": {
          "type": "number",
          "value": 1
        },
        "showOn": {
          "type": "string",
          "enumValues": [
            "focus",
            "image"
          ],
          "value": "focus"
        },
        "stepBigMonths": {
          "type": "number",
          "value": 12
        },
        "stepMonths": {
          "type": "string|number",
          "value": "numberOfMonths"
        },
        "weekDisplay": {
          "type": "string",
          "enumValues": [
            "none",
            "number"
          ],
          "value": "none"
        },
        "yearRange": {
          "type": "string",
          "value": "c-10:c+10"
        }
      }
    },
    "dayFormatter": {
      "type": "function"
    },
    "dayMetaData": {
      "type": "object"
    },
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "displayOptions": {
      "type": "object",
      "properties": {
        "converterHint": {
          "type": "Array<string>|string",
          "value": [
            "placeholder",
            "notewindow"
          ]
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string",
          "value": [
            "inline"
          ]
        },
        "validatorHint": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string"
        }
      }
    },
    "helpHints": {
      "type": "object",
      "properties": {
        "definition": {
          "type": "string",
          "value": ""
        },
        "source": {
          "type": "string",
          "value": ""
        }
      }
    },
    "keyboardEdit": {
      "type": "string",
      "enumValues": [
        "disabled"
      ],
      "value": "disabled"
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "max": {
      "type": "string"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "min": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "value": "",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "pickerAttributes": {
      "type": "object",
      "properties": {
        "style": {
          "type": "string"
        },
        "class": {
          "type": "string"
        }
      }
    },
    "placeholder": {
      "type": "string"
    },
    "rawValue": {
      "type": "string",
      "writeback": true,
      "readOnly": true
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "renderMode": {
      "type": "string",
      "enumValues": [
        "jet"
      ],
      "value": "jet"
    },
    "required": {
      "type": "boolean",
      "value": false
    },
    "timePicker": {
      "type": "object",
      "properties": {
        "footerLayout": {
          "type": "string",
          "enumValues": [
            "",
            "now"
          ],
          "value": ""
        },
        "showOn": {
          "type": "string",
          "enumValues": [
            "focus",
            "image"
          ],
          "value": "focus"
        },
        "timeIncrement": {
          "type": "string",
          "value": "00:05:00:00"
        }
      }
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "cancel": {
          "type": "string"
        },
        "currentText": {
          "type": "string"
        },
        "dateRestriction": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "dateTimeRange": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "object",
              "properties": {
                "inRange": {
                  "type": "string"
                },
                "max": {
                  "type": "string"
                },
                "min": {
                  "type": "string"
                }
              }
            },
            "messageDetail": {
              "type": "object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            },
            "messageSummary": {
              "type": "object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            }
          }
        },
        "done": {
          "type": "string"
        },
        "nextText": {
          "type": "string"
        },
        "prevText": {
          "type": "string"
        },
        "regexp": {
          "type": "object",
          "properties": {
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "required": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "tooltipCalendar": {
          "type": "string"
        },
        "tooltipCalendarDisabled": {
          "type": "string"
        },
        "tooltipCalendarTime": {
          "type": "string"
        },
        "tooltipCalendarTimeDisabled": {
          "type": "string"
        },
        "weekHeader": {
          "type": "string"
        }
      }
    },
    "valid": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "invalidHidden",
        "invalidShown",
        "pending",
        "valid"
      ],
      "readOnly": true
    },
    "validators": {
      "type": "Array<Object>",
      "value": []
    },
    "value": {
      "type": "string"
    }
  },
  "methods": {
    "show": {},
    "showTimePicker": {},
    "hideTimePicker": {},
    "refresh": {},
    "hide": {},
    "validate": {},
    "reset": {},
    "showMessages": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {}
  },
  "extension": {}
};
var __oj_input_date_metadata = 
{
  "properties": {
    "asyncValidators": {
      "type": "Array<Object>",
      "value": []
    },
    "autocomplete": {
      "type": "string",
      "value": "on",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "autofocus": {
      "type": "boolean",
      "value": false,
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "converter": {
      "type": "object",
      "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({\"day\":\"2-digit\",\"month\":\"2-digit\",\"year\":\"2-digit\"})",
      "properties": {
        "type": {
          "type": "string"
        },
        "options": {
          "type": "object"
        }
      }
    },
    "datePicker": {
      "type": "object",
      "properties": {
        "changeMonth": {
          "type": "string",
          "enumValues": [
            "none",
            "select"
          ],
          "value": "select"
        },
        "changeYear": {
          "type": "string",
          "enumValues": [
            "none",
            "select"
          ],
          "value": "select"
        },
        "currentMonthPos": {
          "type": "number",
          "value": 0
        },
        "daysOutsideMonth": {
          "type": "string",
          "enumValues": [
            "hidden",
            "selectable",
            "visible"
          ],
          "value": "hidden"
        },
        "footerLayout": {
          "type": "string",
          "enumValues": [
            "",
            "today"
          ],
          "value": "today"
        },
        "numberOfMonths": {
          "type": "number",
          "value": 1
        },
        "showOn": {
          "type": "string",
          "enumValues": [
            "focus",
            "image"
          ],
          "value": "focus"
        },
        "stepBigMonths": {
          "type": "number",
          "value": 12
        },
        "stepMonths": {
          "type": "string|number",
          "value": "numberOfMonths"
        },
        "weekDisplay": {
          "type": "string",
          "enumValues": [
            "none",
            "number"
          ],
          "value": "none"
        },
        "yearRange": {
          "type": "string",
          "value": "c-10:c+10"
        }
      }
    },
    "dayFormatter": {
      "type": "function"
    },
    "dayMetaData": {
      "type": "object"
    },
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "displayOptions": {
      "type": "object",
      "properties": {
        "converterHint": {
          "type": "Array<string>|string",
          "value": [
            "placeholder",
            "notewindow"
          ]
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string",
          "value": [
            "inline"
          ]
        },
        "validatorHint": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string"
        }
      }
    },
    "helpHints": {
      "type": "object",
      "properties": {
        "definition": {
          "type": "string",
          "value": ""
        },
        "source": {
          "type": "string",
          "value": ""
        }
      }
    },
    "keyboardEdit": {
      "type": "string",
      "enumValues": [
        "disabled",
        "enabled"
      ]
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "max": {
      "type": "string"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "min": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "value": "",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "pickerAttributes": {
      "type": "object",
      "properties": {
        "style": {
          "type": "string"
        },
        "class": {
          "type": "string"
        }
      }
    },
    "placeholder": {
      "type": "string"
    },
    "rawValue": {
      "type": "string",
      "writeback": true,
      "readOnly": true
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "renderMode": {
      "type": "string",
      "enumValues": [
        "jet",
        "native"
      ]
    },
    "required": {
      "type": "boolean",
      "value": false
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "currentText": {
          "type": "string"
        },
        "dateRestriction": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "dateTimeRange": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "object",
              "properties": {
                "inRange": {
                  "type": "string"
                },
                "max": {
                  "type": "string"
                },
                "min": {
                  "type": "string"
                }
              }
            },
            "messageDetail": {
              "type": "object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            },
            "messageSummary": {
              "type": "object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            }
          }
        },
        "nextText": {
          "type": "string"
        },
        "prevText": {
          "type": "string"
        },
        "regexp": {
          "type": "object",
          "properties": {
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "required": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "tooltipCalendar": {
          "type": "string"
        },
        "tooltipCalendarDisabled": {
          "type": "string"
        },
        "tooltipCalendarTime": {
          "type": "string"
        },
        "tooltipCalendarTimeDisabled": {
          "type": "string"
        },
        "weekHeader": {
          "type": "string"
        }
      }
    },
    "valid": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "invalidHidden",
        "invalidShown",
        "pending",
        "valid"
      ],
      "readOnly": true
    },
    "validators": {
      "type": "Array<Object>",
      "value": []
    },
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {
    "hide": {},
    "refresh": {},
    "show": {},
    "validate": {},
    "reset": {},
    "showMessages": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {}
  },
  "extension": {}
};
var __oj_input_date_time_metadata = 
{
  "properties": {
    "asyncValidators": {
      "type": "Array<Object>",
      "value": []
    },
    "autocomplete": {
      "type": "string",
      "value": "on",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "autofocus": {
      "type": "boolean",
      "value": false,
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "converter": {
      "type": "object",
      "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({\"day\": \"2-digit\", \"month\": \"2-digit\", \"year\": \"2-digit\", \"hour\": \"2-digit\", \"minute\": \"2-digit\"})",
      "properties": {
        "type": {
          "type": "string"
        },
        "options": {
          "type": "object"
        }
      }
    },
    "datePicker": {
      "type": "object",
      "properties": {
        "changeMonth": {
          "type": "string",
          "enumValues": [
            "none",
            "select"
          ],
          "value": "select"
        },
        "changeYear": {
          "type": "string",
          "enumValues": [
            "none",
            "select"
          ],
          "value": "select"
        },
        "currentMonthPos": {
          "type": "number",
          "value": 0
        },
        "daysOutsideMonth": {
          "type": "string",
          "enumValues": [
            "hidden",
            "selectable",
            "visible"
          ],
          "value": "hidden"
        },
        "footerLayout": {
          "type": "string",
          "enumValues": [
            "",
            "today"
          ],
          "value": "today"
        },
        "numberOfMonths": {
          "type": "number",
          "value": 1
        },
        "showOn": {
          "type": "string",
          "enumValues": [
            "focus",
            "image"
          ],
          "value": "focus"
        },
        "stepBigMonths": {
          "type": "number",
          "value": 12
        },
        "stepMonths": {
          "type": "string|number",
          "value": "numberOfMonths"
        },
        "weekDisplay": {
          "type": "string",
          "enumValues": [
            "none",
            "number"
          ],
          "value": "none"
        },
        "yearRange": {
          "type": "string",
          "value": "c-10:c+10"
        }
      }
    },
    "dayFormatter": {
      "type": "function"
    },
    "dayMetaData": {
      "type": "object"
    },
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "displayOptions": {
      "type": "object",
      "properties": {
        "converterHint": {
          "type": "Array<string>|string",
          "value": [
            "placeholder",
            "notewindow"
          ]
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string",
          "value": [
            "inline"
          ]
        },
        "validatorHint": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string"
        }
      }
    },
    "helpHints": {
      "type": "object",
      "properties": {
        "definition": {
          "type": "string",
          "value": ""
        },
        "source": {
          "type": "string",
          "value": ""
        }
      }
    },
    "keyboardEdit": {
      "type": "string",
      "enumValues": [
        "disabled",
        "enabled"
      ]
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "max": {
      "type": "string"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "min": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "value": "",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "pickerAttributes": {
      "type": "object",
      "properties": {
        "style": {
          "type": "string"
        },
        "class": {
          "type": "string"
        }
      }
    },
    "placeholder": {
      "type": "string"
    },
    "rawValue": {
      "type": "string",
      "writeback": true,
      "readOnly": true
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "renderMode": {
      "type": "string",
      "enumValues": [
        "jet",
        "native"
      ]
    },
    "required": {
      "type": "boolean",
      "value": false
    },
    "timePicker": {
      "type": "object",
      "properties": {
        "footerLayout": {
          "type": "string",
          "enumValues": [
            "",
            "now"
          ],
          "value": ""
        },
        "showOn": {
          "type": "string",
          "enumValues": [
            "focus",
            "image"
          ],
          "value": "focus"
        },
        "timeIncrement": {
          "type": "string",
          "value": "00:05:00:00"
        }
      }
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "cancel": {
          "type": "string"
        },
        "currentText": {
          "type": "string"
        },
        "dateRestriction": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "dateTimeRange": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "object",
              "properties": {
                "inRange": {
                  "type": "string"
                },
                "max": {
                  "type": "string"
                },
                "min": {
                  "type": "string"
                }
              }
            },
            "messageDetail": {
              "type": "object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            },
            "messageSummary": {
              "type": "object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            }
          }
        },
        "done": {
          "type": "string"
        },
        "nextText": {
          "type": "string"
        },
        "prevText": {
          "type": "string"
        },
        "regexp": {
          "type": "object",
          "properties": {
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "required": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "tooltipCalendar": {
          "type": "string"
        },
        "tooltipCalendarDisabled": {
          "type": "string"
        },
        "tooltipCalendarTime": {
          "type": "string"
        },
        "tooltipCalendarTimeDisabled": {
          "type": "string"
        },
        "weekHeader": {
          "type": "string"
        }
      }
    },
    "valid": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "invalidHidden",
        "invalidShown",
        "pending",
        "valid"
      ],
      "readOnly": true
    },
    "validators": {
      "type": "Array<Object>",
      "value": []
    },
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {
    "show": {},
    "showTimePicker": {},
    "hideTimePicker": {},
    "hide": {},
    "refresh": {},
    "validate": {},
    "reset": {},
    "showMessages": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {}
  },
  "extension": {}
};
var __oj_input_time_metadata = 
{
  "properties": {
    "asyncValidators": {
      "type": "Array<Object>",
      "value": []
    },
    "autocomplete": {
      "type": "string",
      "value": "on",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "autofocus": {
      "type": "boolean",
      "value": false,
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "converter": {
      "type": "object",
      "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({\"hour\": \"2-digit\", \"minute\": \"2-digit\"})",
      "properties": {
        "type": {
          "type": "string"
        },
        "options": {
          "type": "object"
        }
      }
    },
    "describedBy": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean",
      "value": false
    },
    "displayOptions": {
      "type": "object",
      "properties": {
        "converterHint": {
          "type": "Array<string>|string",
          "value": [
            "placeholder",
            "notewindow"
          ]
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string",
          "value": [
            "inline"
          ]
        },
        "validatorHint": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string"
        }
      }
    },
    "helpHints": {
      "type": "object",
      "properties": {
        "definition": {
          "type": "string",
          "value": ""
        },
        "source": {
          "type": "string",
          "value": ""
        }
      }
    },
    "keyboardEdit": {
      "type": "string",
      "enumValues": [
        "disabled",
        "enabled"
      ]
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "max": {
      "type": "string"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "min": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "value": "",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "pickerAttributes": {
      "type": "object",
      "properties": {
        "style": {
          "type": "string"
        },
        "class": {
          "type": "string"
        }
      }
    },
    "placeholder": {
      "type": "string"
    },
    "rawValue": {
      "type": "string",
      "writeback": true,
      "readOnly": true
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "renderMode": {
      "type": "string",
      "enumValues": [
        "jet",
        "native"
      ]
    },
    "required": {
      "type": "boolean",
      "value": false
    },
    "timePicker": {
      "type": "object",
      "properties": {
        "footerLayout": {
          "type": "string",
          "enumValues": [
            "",
            "now"
          ],
          "value": ""
        },
        "showOn": {
          "type": "string",
          "enumValues": [
            "focus",
            "image"
          ],
          "value": "focus"
        },
        "timeIncrement": {
          "type": "string",
          "value": "00:05:00:00"
        }
      }
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "ampmWheelLabel": {
          "type": "string"
        },
        "cancelText": {
          "type": "string"
        },
        "currentTimeText": {
          "type": "string"
        },
        "dateTimeRange": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "object",
              "properties": {
                "inRange": {
                  "type": "string"
                },
                "max": {
                  "type": "string"
                },
                "min": {
                  "type": "string"
                }
              }
            },
            "messageDetail": {
              "type": "object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            },
            "messageSummary": {
              "type": "object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            }
          }
        },
        "hourWheelLabel": {
          "type": "string"
        },
        "minuteWheelLabel": {
          "type": "string"
        },
        "okText": {
          "type": "string"
        },
        "regexp": {
          "type": "object",
          "properties": {
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "required": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "tooltipTime": {
          "type": "string"
        },
        "tooltipTimeDisabled": {
          "type": "string"
        }
      }
    },
    "valid": {
      "type": "string",
      "writeback": true,
      "enumValues": [
        "invalidHidden",
        "invalidShown",
        "pending",
        "valid"
      ],
      "readOnly": true
    },
    "validators": {
      "type": "Array<Object>",
      "value": []
    },
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {
    "show": {},
    "hide": {},
    "refresh": {},
    "validate": {},
    "reset": {},
    "showMessages": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {}
  },
  "extension": {}
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global Hammer:false, Components:false, __ValidationBase: false, LocaleData:false, Logger:false, ThemeUtils, Context:false */

/**
 * @private
 */
var _config = ThemeUtils.parseJSONFromFontFamily('oj-datetimepicker-config') || {};

/**
 * @private
 */
var _matchMedia = (function () {
  var dateTimePickerDropDownThresholdWidth = _config.dateTimePickerDropDownThresholdWidth;
  var queryString;
  if (dateTimePickerDropDownThresholdWidth) {
    queryString = '(min-width: ' + dateTimePickerDropDownThresholdWidth + ')';
  }

  return window.matchMedia(queryString || '(min-width: 768px)');
}());

/**
 * @private
 */
var _isLargeScreen = _matchMedia.matches;
var resizeLargeScreenChange = function () {
  _isLargeScreen = _matchMedia.matches;
};

window.addEventListener('resize', resizeLargeScreenChange, false);

/**
 * @private
 */
function _getNativePickerDate(converter, isoString) {
  // eslint-disable-next-line no-param-reassign
  isoString = converter.parse(isoString);
  var date = new Date();
  var valueParams;
  try {
    valueParams = __ValidationBase.IntlConverterUtils._dateTime(isoString,
      ['date', 'fullYear', 'month', 'hours', 'minutes', 'seconds'], true);
  } catch (e) {
    Logger.info('The value of the InputDateTime element should be an ISOString, please use a valid ISOString');
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
  date.setFullYear(valueParams.fullYear);
  date.setDate(valueParams.date);
  date.setMonth(valueParams.month);
  date.setHours(valueParams.hours);
  date.setMinutes(valueParams.minutes);
  date.setSeconds(valueParams.seconds);
  date.setMilliseconds(0);

  return date;
}

/**
 * Placed here to avoid duplicate code for ojdatepicker + ojtimepicker
 *
 * Used for oj.EditableValueUtils.initializeOptionsFromDom
 *
 * @ignore
 */
function coerceIsoString(value) {
  // reason for coersion is if one refreshes the page; then the input element's value might be the formatted string
  // thought about setting element's value to parsed value on destroy but goes against what destroy is suppose to do
  return this.options.converter.parse(value);
}

/**
 * Placed here to avoid duplicate code for ojdatepicker + ojtimepicker
 *
 * @ignore
 */
function getImplicitDateTimeRangeValidator(options, converter, defaultStyleClass) {
  var translationKeys = {
    'oj-inputdatetime': 'datetime',
    'oj-inputtime': 'time',
    'oj-inputdate': 'date'
  };
  var dateTimeRangeTranslations = options.translations.dateTimeRange || {};
  var translations = [
    { category: 'hint', entries: ['min', 'max', 'inRange'] },
    { category: 'messageDetail', entries: ['rangeUnderflow', 'rangeOverflow'] },
    { category: 'messageSummary', entries: ['rangeUnderflow', 'rangeOverflow'] }
  ];
  var dateTimeRangeOptions = {
    min: options.min,
    max: options.max,
    converter: converter,
    translationKey: translationKeys[defaultStyleClass]
  };

  // note the translations are defined in ojtranslations.js, but it is possible to set it to null, so for sanity
  if (!$.isEmptyObject(dateTimeRangeTranslations)) {
    for (var i = 0, j = translations.length; i < j; i++) {
      var category = dateTimeRangeTranslations[translations[i].category];

      if (category) {
        var translatedContent = {};
        var entries = translations[i].entries;

        for (var k = 0, l = entries.length; k < l; k++) {
          translatedContent[entries[k]] = category[entries[k]];
        }

        dateTimeRangeOptions[translations[i].category] = translatedContent;
      }
    }
  }
  return oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE)
    .createValidator(dateTimeRangeOptions);
}

/**
 * Shared for ojInputDate + ojInputTime
 *
 * @ignore
 */
function disableEnableSpan(children, val) {
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.tagName === 'SPAN') {
      if (val) {
        child.classList.add('oj-disabled');
        child.classList.remove('oj-enabled');
        child.classList.remove('oj-default');
      } else {
        child.classList.remove('oj-disabled');
        child.classList.add('oj-enabled');
        child.classList.add('oj-default');
      }
    }
  }
}

/**
 * For dayMetaData
 *
 * @ignore
 */
function _getMetaData(dayMetaData, position, params) {
  if (!dayMetaData || position === params.length) {
    return dayMetaData;
  }

  var nextPos = position + 1;
  return _getMetaData(dayMetaData[params[position]], nextPos, params) ||
    _getMetaData(dayMetaData['*'], nextPos, params);
}

/**
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 *
 * @ignore
 */
function bindHover(dpDiv) {
  var selector =
      '.oj-datepicker-prev-icon, .oj-datepicker-prev-icon' +
      ' .oj-clickable-icon-nocontext.oj-component-icon, .oj-datepicker-next-icon,' +
      ' .oj-datepicker-next-icon .oj-clickable-icon-nocontext.oj-component-icon,' +
      ' .oj-datepicker-calendar td a';
  return dpDiv.delegate(selector, 'mouseout', function () {
    this.classList.remove('oj-hover');
  }).delegate(selector, 'mouseover', function () {
    this.classList.add('oj-hover');
  }).delegate(selector, 'focus', function () {
    this.classList.add('oj-focus');
  }).delegate(selector, 'blur', function () {
    this.classList.remove('oj-focus');
  });
}

/**
 * Binds active state listener that set appropriate style classes. Used in
 * ojInputDate/ojInputDateTime/ojInputTime
 *
 * @ignore
 */
function bindActive(dateTime) {
  var triggerRootContainer;
  if (dateTime._isInLine) {
    triggerRootContainer = dateTime.element[0].parentNode;
  } else {
    triggerRootContainer = dateTime.element[0].parentNode.parentNode;
  }

  // There are few issues in mobile using hover and active marker classes (iOS and Android, more
  // evident on iOS). Some fix is needed in _activeable(), tracking .
  dateTime._AddActiveable($(triggerRootContainer));
}

/**
 * returns if the native picker is supported - depends on renderMode set to 'native' and this
 * cordova plugin being configured... https://github.com/VitaliiBlagodir/cordova-plugin-datepicker
 *
 * @ignore
 */
function isPickerNative(dateTime) {
  // use bracket notation to avoid closure compiler renaming the variables
  return (dateTime.options.renderMode === 'native' && window.cordova && window.datePicker);
}

// to display the suffix for the year
var yearDisplay = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
    .createConverter({
      year: 'numeric'
    });


/**
 * @ojcomponent oj.ojDatePicker
 * @augments oj.ojInputDate
 * @since 4.0.0
 * @ojstatus preview
 * @ojshortdesc An inline element for picking a date value.
 * @ojdisplayname Inline Date Picker
 * @ojrole combobox
 *
 * @classdesc
 * <h3 id="inputDateOverview-section">
 *   JET DatePicker (Inline mode)
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputDateOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET DatePicker (Inline mode) provides basic support for datepicker selection. This will render the date picker as an inline element. Other behaviors of this element is similar to JET InputDate</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-date-picker>&lt;/oj-date-picker></code></pre>
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
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the label to the input element.
 * For DatePicker, you should put an <code>id</code> on the element, and then set
 * the <code>for</code> attribute on the label to be the element's id.
 * </p>
 * <h3 id="label-section">
 *   Label and DatePicker
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * For accessibility, you should associate a label element with the input
 * by putting an <code>id</code> on the input, and then setting the
 * <code>for</code> attribute on the label to be the input's id.
 * </p>
 * <p>
 * The DatePicker will decorate its associated label with required and help
 * information, if the <code>required</code> and <code>help</code> attributes are set.
 * </p>
 */

/**
 * @ojcomponent oj.ojInputDate
 * @augments oj.inputBase
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojInputDate<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> extends inputBase<string, SP>"
 *               },
 *               {
 *                target: "Type",
 *                value: "ojInputDateSettableProperties extends inputBaseSettableProperties<string>",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @since 0.6
 * @ojstatus preview
 * @ojshortdesc Provides basic support for specifying a date value.
 * @ojrole combobox
 * @ojtsimport {module: "ojvalidation-base", type: "AMD", imported:["Converter", "Validator", "Validation"]}
 *
 * @classdesc
 * <h3 id="inputDateOverview-section">
 *   JET InputDate
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputDateOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET InputDate provides basic support for datepicker selection.</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-input-date>&lt;/oj-input-date></code></pre>
 *
 * {@ojinclude "name":"validationAndMessagingDoc"}
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
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the label to the input element.
 * For InputDate, you should put an <code>id</code> on the element, and then set
 * the <code>for</code> attribute on the label to be the element's id.
 * If there is no oj-label for the InputDate, add aria-label on InputDate
 * to make it accessible.
 * {@ojinclude "name":"accessibilityPlaceholderEditableValue"}
 * {@ojinclude "name":"accessibilityDisabledEditableValue"}
 * </p>
 * <h3 id="label-section">
 *   Label and InputDate
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * For accessibility, you should associate a label element with the input
 * by putting an <code>id</code> on the input, and then setting the
 * <code>for</code> attribute on the label to be the input's id.
 * </p>
 * <p>
 * The InputDate will decorate its associated label with required and help
 * information, if the <code>required</code> and <code>help</code> attributes are set.
 * </p>
 */
oj.__registerWidget('oj.ojInputDate', $.oj.inputBase, {
  widgetEventPrefix: 'oj',

  // -------------------------------From base---------------------------------------------------//
  _CLASS_NAMES: 'oj-inputdatetime-input',
  _WIDGET_CLASS_NAMES: 'oj-inputdatetime-date-only oj-component oj-inputdatetime',
  _ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES: '',
  _INPUT_HELPER_KEY: 'inputHelp',
  _ATTR_CHECK: [{ attr: 'type', setMandatory: 'text' }],
  _GET_INIT_OPTIONS_PROPS_FOR_WIDGET: [
    { attribute: 'disabled', validateOption: true },
    { attribute: 'pattern' },
    { attribute: 'title' },
    { attribute: 'placeholder' },
    { attribute: 'value', coerceDomValue: coerceIsoString },
    { attribute: 'required',
      coerceDomValue: true,
      validateOption: true },
    { attribute: 'readonly',
      option: 'readOnly',
      validateOption: true },
    { attribute: 'min', coerceDomValue: coerceIsoString },
    { attribute: 'max', coerceDomValue: coerceIsoString }
  ],
  // -------------------------------End from base-----------------------------------------------//

  _TRIGGER_CLASS: 'oj-inputdatetime-input-trigger',
  _TRIGGER_CALENDAR_CLASS: 'oj-inputdatetime-calendar-icon',

  _CURRENT_CLASS: 'oj-datepicker-current-day',
  _DAYOVER_CLASS: 'oj-datepicker-days-cell-over',
  _UNSELECTABLE_CLASS: 'oj-datepicker-unselectable',

  _DATEPICKER_DIALOG_DESCRIPTION_ID: 'oj-datepicker-dialog-desc',
  _DATEPICKER_DESCRIPTION_ID: 'oj-datepicker-desc',
  _CALENDAR_DESCRIPTION_ID: 'oj-datepicker-calendar',
  _MAIN_DIV_ID: 'oj-datepicker-div',

  _INLINE_CLASS: 'oj-datepicker-inline',
  _INPUT_CONTAINER_CLASS: ' oj-inputdatetime-input-container',
  _INLINE_WIDGET_CLASS: ' oj-inputdatetime-inline',

  _ON_CLOSE_REASON_SELECTION: 'selection',  // A selection was made
  _ON_CLOSE_REASON_CANCELLED: 'cancelled',  // Selection not made
  _ON_CLOSE_REASON_TAB: 'tab',              // Tab key
  _ON_CLOSE_REASON_CLOSE: 'close',          // Disable or other closes

  _KEYBOARD_EDIT_OPTION_ENABLED: 'enabled',
  _KEYBOARD_EDIT_OPTION_DISABLED: 'disabled',

  options: {
    /**
     * <p>
     * Note that Jet framework prohibits setting subset of properties which are object types.<br/><br/>
     * For example myInputDate.datePicker = {footerLayout: "today"}; is prohibited as it will
     * wipe out all other sub-properties for "datePicker" object.<br/><br/> If one wishes to do this [by above syntax or knockout] one
     * will have to get the "datePicker" object, modify the necessary sub-property and pass it to above syntax.<br/><br/>
     * Default values for the datePicker sub-properties can also be overridden with the theming variable
     * <code class="prettyprint">$inputDateTimeDatePickerOptionDefault</code>, which is merged with other defaults.<br/><br/>
     * Note that all of the datePicker sub-properties except showOn are not available when renderMode is 'native'.<br/><br/>
     *
     * @memberof oj.ojInputDate
     * @ojfragment datePickerCommonDatePicker
     */
    /**
     * {@ojinclude "name":"datePickerCommonDatePicker"}
     *
     * @expose
     * @instance
     * @memberof oj.ojDatePicker
     * @name datePicker
     * @type {Object}
     * @ojtsignore tsdefonly
     *
     * @example <caption>Override defaults in the theme (SCSS) :</caption>
     * $inputDateTimeDatePickerOptionDefault: (footerLayout: 'today', weekDisplay: 'number') !default;
     *
     * @example <caption>Initialize the component, overriding some date-picker attributes and leaving the others intact:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-date-picker date-picker.some-key='some value' date-picker.some-other-key='some other value'>&lt;/oj-date-picker>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-date-picker date-picker='{"someKey":"some value", "someOtherKey":"some other value"}'>&lt;/oj-date-picker>
     *
     * @example <caption>Get or set the <code class="prettyprint">datePicker</code> property after initialization:</caption>
     * // Get one
     * var value = myComponent.datePicker.someKey;
     *
     * // Set one, leaving the others intact. Use the setProperty API for
     * // subproperties so that a property change event is fired.
     * myComponent.setProperty('datePicker.someKey', 'some value');
     *
     * // Get all
     * var values = myComponent.datePicker;
     *
     * // Set all.  Must list every datePicker key, as those not listed are lost.
     * myComponent.datePicker = {
     *     someKey: 'some value',
     *     someOtherKey: 'some other value'
     * };
     *
     */
    /**
     * {@ojinclude "name":"datePickerCommonDatePicker"}
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @type {Object}
     *
     * @example <caption>Override defaults in the theme (SCSS) :</caption>
     * $inputDateTimeDatePickerOptionDefault: (footerLayout: 'today', weekDisplay: 'number') !default;
     *
     * @example <caption>Initialize the component, overriding some date-picker attributes and leaving the others intact:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-input-date date-picker.some-key='some value' date-picker.some-other-key='some other value'>&lt;/oj-input-date>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-input-date date-picker='{"someKey":"some value", "someOtherKey":"some other value"}'>&lt;/oj-input-date>
     *
     * @example <caption>Get or set the <code class="prettyprint">datePicker</code> property after initialization:</caption>
     * // Get one
     * var value = myComponent.datePicker.someKey;
     *
     * // Set one, leaving the others intact. Use the setProperty API for
     * // subproperties so that a property change event is fired.
     * myComponent.setProperty('datePicker.someKey', 'some value');
     *
     * // Get all
     * var values = myComponent.datePicker;
     *
     * // Set all.  Must list every datePicker key, as those not listed are lost.
     * myComponent.datePicker = {
     *     someKey: 'some value',
     *     someOtherKey: 'some other value'
     * };
     *
     */
    datePicker:
    {
      /**
       * Will dictate what content is shown within the footer of the calendar.
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.footerLayout
       * @memberof! oj.ojInputDate
       * @instance
       * @type {string}
       * @ojvalue {string} '' Do not show anything
       * @ojvalue {string} 'today' Show the today button
       * @default "today"
       */
      footerLayout: '',

      /**
       * Whether the month should be rendered as a button to allow selection instead of text.
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.changeMonth
       * @memberof! oj.ojInputDate
       * @instance
       * @type {string}
       * @ojvalue {string} 'select' month is rendered as a button
       * @ojvalue {string} 'none' month is rendered as a text
       * @default "select"
       */
      changeMonth: 'select',

      /**
       * Whether the year should be rendered as a button to allow selection instead of text.
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.changeYear
       * @memberof! oj.ojInputDate
       * @instance
       * @type {string}
       * @ojvalue {string} 'select' As a button
       * @ojvalue {string} 'none' As text
       * @default "select"
       */
      changeYear: 'select',

      /**
       * The position in multipe months at which to show the current month (starting at 0).
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.currentMonthPos
       * @memberof! oj.ojInputDate
       * @instance
       * @type {number}
       * @default 0
       * @ojmin 0
       * @ojmax 12
       */
      currentMonthPos: 0,

      /**
       * Dictates the behavior of days outside the current viewing month.
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.daysOutsideMonth
       * @memberof! oj.ojInputDate
       * @instance
       * @type {string}
       * @ojvalue {string} 'hidden' Days outside the current viewing month will be hidden
       * @ojvalue {string} 'visible' Days outside the current viewing month will be visible
       * @ojvalue {string} 'selectable' Days outside the current viewing month will be visible + selectable
       * @default "hidden"
       */
      daysOutsideMonth: 'hidden',

      /**
       * The number of months to show at once. Note that if one is using a
       * numberOfMonths > 4 then one should define a CSS rule for the width of
       * each of the months. For example if numberOfMonths is set to 6 then one
       * should define a CSS rule .oj-datepicker-multi-6 .oj-datepicker-group
       * providing the width each month should take in percentage.
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.numberOfMonths
       * @memberof! oj.ojInputDate
       * @instance
       * @type {number}
       * @default 1
       * @ojmin 1
       */
      numberOfMonths: 1,

      /**
       * When the datepicker should be shown.
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.showOn
       * @memberof! oj.ojInputDate
       * @instance
       * @type {string}
       * @ojvalue {string} 'focus' when the element receives focus or when the trigger calendar image is
       *   clicked. When the picker is closed, the field regains focus and is editable.
       * @ojvalue {string} 'image' when the trigger calendar image is clicked
       * @default "focus"
       *
       */
      showOn: 'focus',

      /**
       * How the prev + next will step back/forward the months. The following are the valid values:
       *
       * <ul>
       * <li>
       * <code class="prettyprint">"numberOfMonths"</code> - When set to this string, will use numberOfMonths property value as value.
       * </li>
       * <li>
       * <code class="prettyprint"> &lt;number&gt;</code> - Number of months to step back/forward.
       * </li>
       * </ul>
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.stepMonths
       * @memberof! oj.ojInputDate
       * @instance
       * @type {string|number}
       * @ojsignature {target: "Type", value:"'numberOfMonths'|number"}
       * @default "numberOfMonths"
       */
      stepMonths: 'numberOfMonths',

      /**
       * Number of months to step back/forward for the (Alt + Page up) + (Alt + Page down) key strokes.
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.stepBigMonths
       * @memberof! oj.ojInputDate
       * @instance
       * @type {number}
       * @default 12
       */
      stepBigMonths: 12,

      /**
       * Whether week of the year will be shown.
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.weekDisplay
       * @memberof! oj.ojInputDate
       * @instance
       * @type {string}
       * @ojvalue {string} 'number' Will show the week of the year as a number
       * @ojvalue {string} 'none' Nothing will be shown
       * @default "none"
       */
      weekDisplay: 'none', // "number" to show week of the year, "none" to not show it

      /**
       * The range of years displayed in the year drop-down: either relative to
       * today's year ("-nn:+nn"), relative to the currently selected year
       * ("c-nn:c+nn"), absolute ("nnnn:nnnn"), or combinations of these formats
       * ("nnnn:-nn").
       *
       * <p>See the <a href="#datePicker">date-picker</a> attribute for usage examples.
       *
       * @expose
       * @name datePicker.yearRange
       * @memberof! oj.ojInputDate
       * @instance
       * @type {string}
       * @default "c-10:c+10"
       */
      yearRange: 'c-10:c+10' // Range of years to display in drop-down,
      // either relative to today's year (-nn:+nn), relative to currently displayed year
      // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)

    },

    /**
     * A datetime converter instance that duck types {@link oj.DateTimeConverter}. Or an object literal
     * containing the properties listed below.
     *
     * The converter used for InputDate. Page authors can set a custom converter by creating one using the datetime converter factory
     * and providing custom options -
     * oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter(customOptions).
     *
     * {@ojinclude "name":"inputBaseConverterOptionDoc"}
     *
     * @property {string} type - the converter type registered with the oj.ConverterFactory.
     * Usually 'datetime'. See {@link oj.DateTimeConverterFactory} for details. <br/>
     * E.g., <code class="prettyprint">{converter: {type: 'datetime'}</code>
     * @property {Object=} options - optional Object literal of options that the converter expects.
     * See {@link oj.IntlDateTimeConverter} for options supported by the jet datetime converter.
     * E.g., <code class="prettyprint">{converter: {type: 'datetime', options: {formatType: 'date'}}</code>
     *
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @type {Object}
     * @ojsignature  { target: "Type", value: "oj.Converter<string>|oj.Validation.RegisteredConverter",
     *                 jsdocOverride: true}
     * @default oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({"day":"2-digit","month":"2-digit","year":"2-digit"})
     */
    converter: oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
      .createConverter({
        day: '2-digit', month: '2-digit', year: '2-digit'
      }),

    /**
     * Determines if keyboard entry of the text is allowed.
     * When the datepicker is inline, the only supported value is "disabled".
     *
     * @expose
     * @instance
     * @memberof! oj.ojDatePicker
     * @name keyboardEdit
     * @ojtsnarrowedtype
     * @type {string}
     * @ojvalue {string} "disabled" Changing the date can only be done with the picker.
     * @default "disabled"
     *
     * @example <caption>Initialize the InputDate with the <code class="prettyprint">keyboard-edit</code> attribute specified:</caption>
     * &lt;oj-date-picker keyboard-edit='disabled'>&lt;/oj-date-picker>
     *
     * @example <caption>Get or set the <code class="prettyprint">keyboardEdit</code> property after initialization:</caption>
     * // getter
     * var keyboardEdit = myInputDate.keyboardEdit;
     *
     * // setter
     * myInputDate.keyboardEdit = 'disabled';
     *
     * @example <caption>Set the default in the theme (SCSS)</caption>
     * $inputDateTimeKeyboardEditOptionDefault: disabled !default;
     */
    /**
     * Determines if keyboard entry of the text is allowed.
     * When disabled the picker must be used to select a date.
     *
     * Default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the
     * default is <code class="prettyprint">"disabled"</code>
     * and it's <code class="prettyprint">"enabled"</code> for alta web theme.
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @type {string}
     * @ojvalue {string} "enabled"  Allow keyboard entry of the date.
     * @ojvalue {string} "disabled" Changing the date can only be done with the picker.
     *
     * @example <caption>Initialize the InputDate with the <code class="prettyprint">keyboard-edit</code> attribute specified:</caption>
     * &lt;oj-input-date keyboard-edit='disabled'>&lt;/oj-input-date>
     *
     * @example <caption>Get or set the <code class="prettyprint">keyboardEdit</code> property after initialization:</caption>
     * // getter
     * var keyboardEdit = myInputDate.keyboardEdit;
     *
     * // setter
     * myInputDate.keyboardEdit = 'disabled';
     *
     * @example <caption>Set the default in the theme (SCSS)</caption>
     * $inputDateTimeKeyboardEditOptionDefault: disabled !default;
     */
    keyboardEdit: 'enabled',
     /**
     * @name autocomplete
     * @ojshortdesc Dictates component's autocomplete state.
     * @expose
     * @type {string}
     * @ojsignature {target: "Type", value: "'on'|'off'|string", jsdocOverride: true}
     * @default "on"
     * @instance
     * @ignore
     * @since 4.0.0
     * @memberof! oj.ojDatePicker
     * @ojextension {_COPY_TO_INNER_ELEM: true}
     */
    /**
     * The maximum selectable date (in ISO string format). When set to null, there is no maximum.
     *
     * @expose
     * @instance
     * @memberof! oj.ojDatePicker
     * @name max
     * @type {string|null}
     * @ojformat date
     * @default null
     *
     * @example <caption>Initialize the InputDate with the <code class="prettyprint">max</code> attribute specified:</caption>
     * &lt;oj-date-picker max='2018-09-25'>&lt;/oj-date-picker>
     *
     * @example <caption>Get or set the <code class="prettyprint">max</code> property after initialization:</caption>
     * // getter
     * var maxValue = myInputDate.max;
     *
     * // setter
     * myInputDate.max = '2018-09-25';
     */
    /**
     * The maximum selectable date (ISO string). When set to null, there is no maximum.
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @type {string|null}
     * @ojformat date
     * @default null
     *
     * @example <caption>Initialize the InputDate with the <code class="prettyprint">max</code> attribute specified:</caption>
     * &lt;oj-input-date max='2018-09-25'>&lt;/oj-input-date>
     *
     * @example <caption>Get or set the <code class="prettyprint">max</code> property after initialization:</caption>
     * // getter
     * var maxValue = myInputDate.max;
     *
     * // setter
     * myInputDate.max = '2018-09-25';
     */
    max: undefined,

    /**
     * The minimum selectable date (ISO string format). When set to null, there is no minimum.
     *
     * @expose
     * @instance
     * @memberof! oj.ojDatePicker
     * @name min
     * @type {string|null}
     * @ojformat date
     * @default null
     *
     * @example <caption>Initialize the InputDate with the <code class="prettyprint">min</code> attribute specified:</caption>
     * &lt;oj-date-picker min='2014-08-25'>&lt;/oj-date-picker>
     *
     * @example <caption>Get or set the <code class="prettyprint">min</code> property after initialization:</caption>
     * // getter
     * var minValue = myInputDate.min;
     *
     * // setter
     * myInputDate.min = '2014-08-25';
     */
    /**
     * The minimum selectable date (in ISO string format). When set to null, there is no minimum.
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @type {string|null}
     * @ojformat date
     * @default null
     *
     * @example <caption>Initialize the InputDate with the <code class="prettyprint">min</code> attribute specified:</caption>
     * &lt;oj-input-date min='2014-08-25'>&lt;/oj-input-date>
     *
     * @example <caption>Get or set the <code class="prettyprint">min</code> property after initialization:</caption>
     * // getter
     * var minValue = myInputDate.min;
     *
     * // setter
     * myInputDate.min = '2014-08-25';
     */
    min: undefined,

    /**
     * <p>Attributes specified here will be set on the picker DOM element when it's launched.
     * <p>The supported attributes are <code class="prettyprint">class</code> and <code class="prettyprint">style</code>, which are appended to the picker's class and style, if any.
     * Note: 1) pickerAttributes is not applied in the native theme.
     * 2) setting this property after element creation has no effect.
     *
     * @property {string=} style
     * @property {string=} class
     *
     * @example <caption>Initialize the inputDate specifying a set of attributes to be set on the picker DOM element:</caption>
     * myInputDate.pickerAttributes = {
     *   "style": "color:blue;",
     *   "class": "my-class"
     * };
     *
     * @example <caption>Get the <code class="prettyprint">pickerAttributes</code> property, after initialization:</caption>
     * // getter
     * var inputDate = myInputDate.pickerAttributes;
     *
     * @expose
     * @memberof! oj.ojInputDate
     * @instance
     * @type {?Object}
     * @default null
     */
    pickerAttributes: null,

    /**
     * Allows applications to specify whether to render date picker in JET or
     * render as a native picker control. In inline mode, the only value supported is "jet"</br>
     *
     * @expose
     * @memberof! oj.ojDatePicker
     * @instance
     * @name renderMode
     * @ojtsnarrowedtype
     * @type {string}
     * @ojvalue {string} 'jet' Applications get full JET functionality.
     *
     * @default "jet"
     *
     * @example <caption>Initialize the InputDate with the <code class="prettyprint">render-mode</code> attribute specified:</caption>
     * &lt;oj-date-picker render-mode='jet'>&lt;/oj-date-picker>
     *
     * @example <caption>Get or set the <code class="prettyprint">renderMode</code> property after initialization:</caption>
     * // getter
     * var renderMode = myInputDate.renderMode;
     *
     * // setter
     * myInputDate.renderMode = 'jet';
     *
     * @example <caption>Set the default in the theme (SCSS)</caption>
     * $inputDateTimeRenderModeOptionDefault: native !default;
     */
    /**
     * Allows applications to specify whether to render date picker in JET or
     * as a native picker control.</br>
     *
     * Default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the
     * default is "native" and it's "jet" for alta web theme.
     *
     * @expose
     * @memberof! oj.ojInputDate
     * @instance
     * @type {string}
     * @ojvalue {string} 'jet' Applications get full JET functionality.
     * @ojvalue {string} 'native' Applications get the functionality of the native picker. Native picker is
     *  not available when the picker is inline, defaults to jet instead.</br></br>
     *  Note that the native picker support is limited to Cordova plugin published
     *  at 'https://github.com/VitaliiBlagodir/cordova-plugin-datepicker'.</br></br>
     *  With native renderMode, the functionality that is sacrificed compared to jet renderMode are:
     *    <ul>
     *      <li>Date picker cannot be themed</li>
     *      <li>Accessibility is limited to what the native picker supports</li>
     *      <li>pickerAttributes is not applied</li>
     *      <li>Sub-IDs are not available</li>
     *      <li>hide() function is no-op</li>
     *      <li>translations sub properties pertaining to the picker is not available</li>
     *      <li>All of the 'datepicker' sub-properties except 'showOn' are not available</li>
     *    </ul>
     *
     * @example <caption>Initialize the InputDate with the <code class="prettyprint">render-mode</code> attribute specified:</caption>
     * &lt;oj-input-date render-mode='native'>&lt;/oj-input-date>
     *
     * @example <caption>Get or set the <code class="prettyprint">renderMode</code> property after initialization:</caption>
     * // getter
     * var renderMode = myInputDate.renderMode;
     *
     * // setter
     * myInputDate.renderMode = 'native';
     *
     * @example <caption>Set the default in the theme (SCSS)</caption>
     * $inputDateTimeRenderModeOptionDefault: native !default;
     */
    renderMode: 'jet',
    /**
     * Additional info to be used when rendering the day
     *
     * This should be a JavaScript Function reference which accepts as its argument the following JSON format
     * {fullYear: Date.getFullYear(), month: Date.getMonth()+1, date: Date.getDate()}
     *
     * and returns null or all or partial JSON data of
     * {disabled: true|false, className: "additionalCSS", tooltip: 'Stuff to display'}
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDate
     * @type {Function}
     * @ojsignature {target: "Type", value: "(param: oj.ojInputDate.DayFormatterInput)=> (null|'all'|oj.ojInputDate.DayFormatterOutput)"}
     * @default null
     */
    dayFormatter: null

    /**
     * Additional info to be used when rendering the day
     *
     * This should be in the following JSON format with the year, month, day based on Date.getFullYear(), Date.getMonth()+1, and Date.getDate():
     * {year: {month: {day: {disabled: true|false, className: "additionalCSS", tooltip: 'Stuff to display'}}}
     *
     * There also exists a special '*' character which represents ALL within that field [i.e. * within year, represents for ALL year].
     *
     * Note that this property will override the value of the dayFormatter property. Setting both dayFormatter and dayMetaData properties is not supported.
     *
     * @expose
     * @name dayMetaData
     * @instance
     * @memberof oj.ojInputDate
     * @type {object}
     * @default null
     * @ojsignature [{target: "Type",
     *                value: "{[key:string]: {[key:string]: {[key:string]: {disabled?: boolean, className?: string, tooltip?: string}}}}"}
     *              ]
     * @example
     * {2013: {11: {25: {disabled: true, className: 'holiday', tooltip: 'Stuff to display'}, 5: {disabled: true}}}}}
     */

    // DOCLETS
    /**
     * List of validators used by element along with the implicit component validators
     * when performing validation. Each item is either an
     * instance that duck types {@link oj.Validator}, or is an Object literal containing the
     * properties listed below.
     * <p>
     * Implicit validators are created by the element when certain attributes are present.
     * For example, if the <code class="prettyprint">required</code>
     * attribute is set, an implicit {@link oj.RequiredValidator} is created. If the
     * <code class="prettyprint">min</code> and/or <code class="prettyprint">max</code> attribute
     * is set, an implicit {@link oj.DateTimeRangeValidator} is created. If the
     * <code class="prettyprint">dayFormatter</code> attribute is set,
     * an implicit {@link oj.DateRestrictionValidator} is created.
     * At runtime when the component runs validation, it
     * combines all the implicit validators with all the validators
     * specified through this <code class="prettyprint">validators</code> attribute, and runs
     * all of them.
     * </p>
     * <p>
     * Hints exposed by validators are shown in the notewindow by default, or as determined by the
     * 'validatorHint' property set on the <code class="prettyprint">displayOptions</code>
     * property.
     * </p>
     *
     * <p>
     * When <code class="prettyprint">validators</code> property changes due to programmatic
     * intervention, the element may decide to clear messages and run validation, based on the
     * current state it is in. </br>
     *
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>The cached list of validator instances are cleared and new validator hints is pushed to
     * messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if element is valid when validators changes, element does nothing other than the
     * steps it always performs.</li>
     * <li>if element is invalid and is showing messages when
     * <code class="prettyprint">validators</code> changes then all element messages are cleared
     * and full validation run using the display value on the element.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event to clear custom errors.</li>
     * </ul>
     * </li>
     * <li>if element is invalid and has deferred messages when validators changes, it does
     * nothing other than the steps it performs always.</li>
     * </ul>
     * </p>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the element are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     * </p>
     *
     * @property {string} type - the validator type that has a {@link oj.ValidatorFactory} that can
     * be retrieved using the {@link oj.Validation} module. For a list of supported validators refer
     * to {@link oj.ValidatorFactory}. <br/>
     * @property {Object=} options - optional Object literal of options that the validator expects.
     *
     * @example <caption>Initialize the element with validator object literal:</caption>
     * myInputDate.validators = [{
     *     type: 'dateTimeRange',
     *     options : {
     *       max: '2014-09-10',
     *       min: '2014-09-01'
     *     }
     *   }];
     *
     *
     * @example <caption>Initialize the element with multiple validator instances:</caption>
     * var validator1 = new MyCustomValidator({'foo': 'A'});
     * var validator2 = new MyCustomValidator({'foo': 'B'});
     * // myInputElement is InputText, InputNumber, Select, etc.
     * myInputElement.value = 10;
     * myInputElement.validators = [validator1, validator2];
     *
     * @expose
     * @name validators
     * @instance
     * @memberof oj.ojInputDate
     * @ojsignature  { target: "Type",
     *   value: "Array<oj.Validator<string>|oj.Validation.RegisteredValidator>|null",
     *   jsdocOverride: true}
     * @type {Array.<Object>}
     * @default []
     */

    /**
     * The value of the DatePicker element which should be an ISOString.
     *
     * When the attribute is not set, the element's value attribute is used as its initial value
     * if it exists. This value must be an ISOString.
     *
     * @example <caption>Initialize the element with the <code class="prettyprint">value</code> attribute:</caption>
     * &lt;oj-date-picker value='2014-09-10' /&gt;
     * @example <caption>Initialize the element with the <code class="prettyprint">value</code> property specified programmatically
     * using oj.IntlConverterUtils.dateToLocalIso :</caption>
     * myInputDate.value = oj.IntlConverterUtils.dateToLocalIso(new Date());<br/>
     * @example <caption>Get or set the <code class="prettyprint">value</code> property, after initialization:</caption>
     * // Getter: returns Today's date in ISOString
     * myInputDate.value;
     * // Setter: sets it to a different date
     * myInputDate.value = "2013-12-01";
     *
     * @expose
     * @name value
     * @instance
     * @memberof oj.ojDatePicker
     * @type {string}
     * @ojformat date
     * @ojwriteback
     */
    /**
     * The value of the InputDate element which should be an ISOString.
     *
     * When the attribute is not set, the element's value attribute is used as its initial value
     * if it exists. This value must be an ISOString.
     *
     * @example <caption>Initialize the element with the <code class="prettyprint">value</code> attribute:</caption>
     * &lt;oj-input-date value='2014-09-10' /&gt;
     * @example <caption>Initialize the element with the <code class="prettyprint">value</code> property specified programmatically
     * using oj.IntlConverterUtils.dateToLocalIso :</caption>
     * myInputDate.value = oj.IntlConverterUtils.dateToLocalIso(new Date());<br/>
     * @example <caption>Get or set the <code class="prettyprint">value</code> property, after initialization:</caption>
     * // Getter: returns Today's date in ISOString
     * myInputDate.value;
     * // Setter: sets it to a different date
     * myInputDate.value = "2013-12-01";
     *
     * @expose
     * @name value
     * @instance
     * @memberof! oj.ojInputDate
     * @type {string}
     * @ojformat date
     * @ojwriteback
     */

    // Events

  },

  /**
   * @ignore
   * @protected
   * @memberof oj.ojInputDate
   */
  _InitBase: function () {
    this._triggerNode = null;
    this._inputContainer = null;
    this._redirectFocusToInputContainer = false;
    this._isMobile = false;

    // only case is when of showOn of focus and one hides the element [need to avoid showing]
    this._ignoreShow = false;

    // need this flag to keep track of native picker opened, there is no callback on native API
    //  to find out otherwise.
    this._nativePickerShowing = false;
    this._maxRows = 4;

    this._currentDay = 0;
    this._drawMonth = 0;
    this._currentMonth = 0;
    this._drawYear = 0;
    this._currentYear = 0;

    this._datePickerDefaultValidators = {};
    this._nativePickerConverter = null;

    var nodeName = this.element[0].nodeName.toLowerCase();
    this._isInLine = (nodeName === 'div' || nodeName === 'span');

    if (this._isInLine) {
      this._createDpDiv();
      // if inline then there is no input element, so reset _CLASS_NAMES
      // TODO:Jmw trying to understand what to do in the case of inline. If it is dateTime inline, then I don't wrap the date part.
      // But if it is just date inline, I should... but the use case is probably not frequent.
      this._WIDGET_CLASS_NAMES += this._INLINE_WIDGET_CLASS;
      this._CLASS_NAMES = '';
    } else {
      // append input container class to be applied to the root node as well, since not inline
      // [note the special case where input container class will NOT be on the widget node is when
      // ojInputDateTime is of inline and ojInputTime places container around the input element]
      // jmw. this is now different. It's no longer on the widget. I add a new wrapper dom.
      // Ji will need to help me with this probably.
      // One thing I know I'm not doing is wrapping the calendar if only date. hmm...
      this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES += this._INPUT_CONTAINER_CLASS;

      if (this.options.readOnly !== true) {
        this._createDpDiv();
        this._createPopupDpDiv();
      }
    }
  },

  _createDpDiv: function () {
    var dpDiv = document.createElement('div');
    dpDiv.className = 'oj-datepicker-popup';
    dpDiv.style.display = 'none';
    var childDiv = document.createElement('div');
    childDiv.id = this._GetSubId(this._MAIN_DIV_ID);
    childDiv.setAttribute('role', 'region');
    childDiv.setAttribute('aria-describedby', this._GetSubId(this._DATEPICKER_DESCRIPTION_ID));
    childDiv.className = 'oj-datepicker-content';
    dpDiv.appendChild(childDiv);
    this._dpDiv = bindHover($(dpDiv));
    document.body.appendChild(dpDiv); // @HTMLUpdateOK
  },

  _createPopupDpDiv: function () {
    var self = this;
    // DISABLE FOR NOW, as animation is coming quite clunky (not sure if the css of popup or of animation)
    // var animation = _isLargeScreen ? {"open": null, "close": null} : {"close": null};
    var animation = { open: null, close: null };
    this._popUpDpDiv = this._dpDiv.ojPopup({
      initialFocus: 'none',
      role: 'dialog',
      modality: _isLargeScreen ? 'modeless' : 'modal',
      open: function () {
        self._popUpDpDiv.attr('aria-describedby',
                              self._GetSubId(self._DATEPICKER_DIALOG_DESCRIPTION_ID));
        if (self.options.datePicker.showOn === 'image') {
          self._dpDiv.find('.oj-datepicker-calendar').focus();
        }
      },
      animateStart: function (event, ui) {
        if (ui.action === 'open') {
          event.preventDefault();
          // eslint-disable-next-line no-undef
          AnimationUtils.slideIn(ui.element, { offsetY: ui.element.offsetHeight + 'px' })
            .then(ui.endCallback);
        }
      },
      animation: animation
    }).attr('data-oj-internal', ''); // mark internal component, used in Components.getComponentElementByNode;
    this.element.attr('data-oj-popup-' + this._popUpDpDiv.attr('id') + '-parent', ''); // mark parent of pop up

    var pickerAttrs = this.options.pickerAttributes;
    if (pickerAttrs) {
      oj.EditableValueUtils.setPickerAttributes(this._popUpDpDiv.ojPopup('widget'), pickerAttrs);
    }
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   */
  _ComponentCreate: function () {
    this._InitBase();

    var retVal = this._super();

    if (this.options.dayMetaData) {
      this.options.dayFormatter = (function (value) {
        return function (dateInfo) {
          return _getMetaData(value, 0, [dateInfo.fullYear, dateInfo.month, dateInfo.date]);
        };
      }(this.options.dayMetaData));
    }

    // if isoString has a different timezone then the one provided in the converter, need to perform
    // conversion so pass it through the method
    if (this.options.value) {
      var formatted = this._GetConverter().format(this.options.value);
      this._SetValue(formatted, {});
    }

    // Need to set the currentDay, currentMonth, currentYear to either the value or the default of today's Date
    // Note that these are days indicator for the datepicker, so it is correct in using today's date even if value
    // hasn't been set
    this._setCurrentDate(this._getDateIso());

    // jmw. Add a wrapper around the element and the trigger. This is needed so that we can
    // add inline messages to the root dom node. We want the input+trigger to be one child and
    // the inline messages to be another child of the root dom node. This way the inline
    // messages can be stacked after the main component, and will grow or shrink in size the same
    // as the main component.
    // doing this in InputBase now.

    if (this._isInLine) {
      this.element.append(this._dpDiv); // @HTMLUpdateOK dpDiv is generated internally
      this.element.addClass(this._INLINE_CLASS); // by applying the inline class it places margin bottom, to separate in case ojInputTime exists

      // Set display:block in place of inst._dpDiv.show() which won't work on disconnected elements
      // http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
      this._dpDiv.css('display', 'block');

      this._registerSwipeHandler();
    } else {
      this._processReadOnlyKeyboardEdit();
      if (this.options.readOnly !== true) {
        this._attachTrigger();
        this._registerSwipeHandler();
      }
    }

    // attach active state change handlers
    bindActive(this);
    return retVal;
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   */
  _AfterCreate: function () {
    var ret = this._superApply(arguments);
    var LId;

    this._disableEnable(this.options.disabled);

    if (!this._IsCustomElement()) {
      var label = this.$label;
      if (this._inputContainer && label && label.length === 1) {
        LId = label.attr('id');

        // The label should always have a generated ID, so no need to check here.
        this._inputContainer.attr('aria-labelledby', LId);
      }
    } else if (this._inputContainer) {
      var defaultLabelId = this.uuid + '_Label';
      LId = oj.EditableValueUtils.getOjLabelId(this.widget(), defaultLabelId);
      if (LId) {
        this._inputContainer.attr('aria-labelledby', LId);
      }
    }


    return ret;
  },

  /**
   * @ignore
   * @protected
   * @override
   * @memberof oj.ojInputDate
   */
  _setOption: function (key, value, flags) {
    var retVal = null;

    // When a null, undefined, or "" value is passed in set to null for consistency
    // note that if they pass in 0 it will also set it null
    if (key === 'value') {
      if (!value) {
        // eslint-disable-next-line no-param-reassign
        value = null;
      }

      retVal = this._super(key, value, flags);
      this._setCurrentDate(value);

      if (this._datepickerShowing()) {
        // _setOption is called after user picks a date from picker, we dont want to bring
        //  focus to input element if the picker is showing still for the non-inline case. For the
        //  case of inline date picker, if there is a time field and already focussed (brought in when
        //  the picker was hidden), we want to update the date picker, but not set focus on it.
        var focusOnCalendar = !(this._isInLine && this._timePicker &&
                                this._timePicker[0] === document.activeElement);
        this._updateDatepicker(focusOnCalendar);
      }

      return retVal;
    }

    if (key === 'dayMetaData') {
      // need to invoke w/ dayFormatter and return for the case where user invoke myInputDate.dayMetaData = {};
      // since that doesn't trigger ComponentBinding

      this.option('dayFormatter', function (dateInfo) {
        return _getMetaData(value, 0, [dateInfo.fullYear, dateInfo.month, dateInfo.date]);
      }, flags);
      return undefined; // avoid setting in this.options and etc
    }

    retVal = this._super(key, value, flags);

    if (key === 'disabled') {
      this._disableEnable(value);
    } else if (key === 'max' || key === 'min') {
      // since validators are immutable, they will contain min + max as local values. B/c of this will need to recreate
      this._datePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE] =
        this._getValidator('min');

      this._AfterSetOptionValidators();
    } else if (key === 'readOnly') {
      // Set up datepicker div and popup if necessary
      if (!this._isInLine && !value && this._dpDiv == null) {
        this._createDpDiv();
        this._createPopupDpDiv();
        this._attachTrigger();
        this._registerSwipeHandler();
        this._AppendInputHelper();
        this._setupResizePopupBind();
      }

      this._processReadOnlyKeyboardEdit();

      if (value) {
        this._hide(this._ON_CLOSE_REASON_CLOSE);
      }
      this._AfterSetOptionDisabledReadOnly('readOnly',
                                           oj.EditableValueUtils.readOnlyOptionOptions);
    } else if (key === 'keyboardEdit') {
      this._processReadOnlyKeyboardEdit();
    } else if (key === 'dayFormatter') {
      // since validators are immutable, they will contain dayFormatter as local values. B/c of this will need to recreate
      this._datePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION] =
        this._getValidator('dayFormatter');

      this._AfterSetOptionValidators();
    } else if (key === 'converter') {
      this._nativePickerConverter = null;
    }

    if (key === 'datePicker' && flags.subkey === 'currentMonthPos') {
      // need to reset up the drawMonth + drawYear
      this._setCurrentDate(this._getDateIso());
    }

    var updateDatePicker = {
      max: true,
      min: true,
      dayFormatter: true,
      datePicker: true,
      translations: true
    };

    if (this._datepickerShowing() && key in updateDatePicker) {
      this._updateDatepicker();
    }

    return retVal;
  },

  /**
   * @ignore
   */
  _processReadOnlyKeyboardEdit: function () {
    var readonly = this.options.readOnly ||
            this._isKeyboardEditDisabled();

    this.element.prop('readOnly', !!readonly);
  },

  /**
   * @ignore
   * @return {boolean}
   */
  _isKeyboardEditDisabled: function () {
    return this.options.keyboardEdit === this._KEYBOARD_EDIT_OPTION_DISABLED;
  },

  /**
   * Need to override due to usage of display: inline-table [as otherwise for webkit the hidden content takes up
   * descent amount of space]
   *
   * @protected
   * @instance
   * @memberof oj.ojInputDate
   */
  _AppendInputHelperParent: function () {
    return this._triggerNode;
  },

  /**
   * @ignore
   * @protected
   * @override
   */
  _destroy: function () {
    this._cleanUpDateResources();
    var retVal = this._super();
    return retVal;
  },

  _datepickerShowing: function () {
    return this._isInLine ||
      (this._popUpDpDiv &&
       Components.isComponentInitialized(this._popUpDpDiv, 'ojPopup') &&
       this._popUpDpDiv.ojPopup('isOpen')) ||
      this._nativePickerShowing;
  },
  /**
   * @ignore
   * @protected
   * @override
   */
  _SetupResources: function () {
    if (!this._isInLine) {
      if (this.options.readOnly !== true) {
        this._setupResizePopupBind();
      }
    }
    return this._super();
  },

  _setupResizePopupBind: function () {
    this._resizePopupBind = function () {
      if (Components.isComponentInitialized(this._popUpDpDiv, 'ojPopup')) {
        this._popUpDpDiv.ojPopup('option', 'modality', (_isLargeScreen ? 'modeless' : 'modal'));
      }
    }.bind(this);
    window.addEventListener('resize', this._resizePopupBind, false);
  },

  /**
   * @ignore
   * @protected
   * @override
   */
  _ReleaseResources: function () {
    // for non custom element, this is done as first step in destroy
    if (this._IsCustomElement()) {
      this._cleanUpListeners();
    }
    return this._super();
  },

  /**
   * @ignore
   * @private
   */
  _cleanUpDateResources: function () {
    var triggerRootContainer;
    if (this._isInLine) {
      triggerRootContainer = this.element[0].parentNode;
    } else {
      triggerRootContainer = this.element[0].parentNode.parentNode;
    }
    this._RemoveActiveable($(triggerRootContainer));

    this.element.off('focus touchstart');
    this._wrapper.off('touchstart');

    if (this._triggerNode) {
      this._triggerNode.remove();
    }

    if (this._isInLine) {
      // need to remove disabled + readOnly b/c they are set by super classes and datepicker is special in that this.element
      // can be a div element for inline mode
      this.element.removeProp('disabled');
      this.element.removeProp('readonly');
    }

    this._cleanUpListeners();

    if (this._animationResolve) {
      this._animationResolve();
      this._animationResolve = null;
    }
    if (this._popUpDpDiv &&
        Components.isComponentInitialized(this._popUpDpDiv, 'ojPopup')) {
      this._popUpDpDiv.ojPopup('destroy');
    }

    if (this._dpDiv) {
      this._dpDiv.remove();
    }
  },
  /**
   * @ignore
   * @private
   */
  _cleanUpListeners: function () {
    if (this._resizePopupBind) {
      window.removeEventListener('resize', this._resizePopupBind);
    }
    window.removeEventListener('resize', resizeLargeScreenChange);
  },
  /**
   * @protected
   * @override
   * @ignore
   */
  _WrapElement: function () {
    this._inputContainer = this._superApply(arguments);
    this._inputContainer.attr({ role: 'combobox', 'aria-haspopup': 'true', tabindex: '-1' });
  },

  /**
   * When input element has focus
   * @private
   */
  _onElementFocus: function () {
    var showOn = this.options.datePicker.showOn;

    if (this._redirectFocusToInputContainer) {
      this._redirectFocusToInputContainer = false;
      this._inputContainer.focus();
    } else if (showOn === 'focus') {
        // pop-up date picker when focus placed on the input box
      this.show();
    } else if (this._datepickerShowing()) {
      this._hide(this._ON_CLOSE_REASON_CLOSE);
    }
  },

  /**
   * When input element is touched
   *
   * @ignore
   * @protected
   */
  _OnElementTouchStart: function () {
    var showOn = this.options.datePicker.showOn;

    // If the focus is already on the text box and can't edit with keyboard
    // and show on is focus then reopen the picker.
    if (showOn === 'focus') {
      if (this._datepickerShowing()) {
        this._ignoreShow = true;
        this._hide(this._ON_CLOSE_REASON_CLOSE);
      } else {
        var inputActive = this.element[0] === document.activeElement;

        this.show();
        this._redirectFocusToInputContainer = true;

        if (inputActive) {
          this._inputContainer.focus();
        }
      }
    }
  },

  /**
   * This function will create the necessary calendar trigger container [i.e. image to launch the calendar]
   * and perform any attachment to events
   *
   * @private
   */
  _attachTrigger: function () {
    var showOn = this.options.datePicker.showOn;
    var triggerContainer = document.createElement('span');
    triggerContainer.className = this._TRIGGER_CLASS;

    // pop-up date picker when button clicked
    var triggerCalendar = document.createElement('span');
    triggerCalendar.setAttribute('title', this._GetCalendarTitle());
    triggerCalendar.className = this._TRIGGER_CALENDAR_CLASS +
                  ' oj-clickable-icon-nocontext oj-component-icon';

    triggerContainer.appendChild(triggerCalendar); // @HTMLUpdateOK

    this.element.on('focus', $.proxy(this._onElementFocus, this));
    this.element.on('touchstart', $.proxy(this._OnElementTouchStart, this));

    var self = this;

    this._wrapper.on('touchstart', function () {
      self._isMobile = true;
    });

    if (showOn === 'image') {
      // we need to show the icon that we hid by display:none in the mobile themes
      triggerCalendar.style.display = 'block';

      // In iOS theme, we defaulted to use border radius given that showOn=focus is default and
      //  we will not have trigger icon. For showOn=image case, we will show the icon, so
      //  we need to remove the border radius. iOS is the only case we use border radius, so this
      //  setting for all cases is fine.
      if (this._IsRTL()) {
        this.element.css('border-top-left-radius', 0);
        this.element.css('border-bottom-left-radius', 0);
      } else {
        this.element.css('border-top-right-radius', 0);
        this.element.css('border-bottom-right-radius', 0);
      }
    }

    triggerCalendar.addEventListener('click', function (event) {
      if (self._datepickerShowing()) {
        self._hide(self._ON_CLOSE_REASON_CLOSE);
      } else {
        self.show();
        self._dpDiv.find('.oj-datepicker-calendar').focus();
      }
      event.preventDefault();
      event.stopPropagation();
    });

    var $triggerCalendar = $(triggerCalendar);
    this._AddHoverable($triggerCalendar);
    this._AddActiveable($triggerCalendar);

    this._triggerIcon = $triggerCalendar;
    this._triggerNode = $(triggerContainer);
    this.element[0].parentNode.insertBefore(triggerContainer, this.element[0].nextElementSibling); // @HTMLUpdateOK
  },

  // This handler is when an user keys down with the calendar having focus
  _doCalendarKeyDown: function (event) {
    var handled = false;
    var kc = $.ui.keyCode;
    var isRTL = this._IsRTL();

    if (this._datepickerShowing()) {
      switch (event.keyCode) {
        case 84: // t character
          if (event.altKey && event.ctrlKey) {
            this._dpDiv.find('.oj-datepicker-current').focus();
            handled = true;
          }
          break;
        case kc.TAB:
          // Tab key is used to navigate to different buttons/links in the
          // datepicker to make them accessible.  It shouldn't be used to hide
          // the datepicker.
          break;
        case kc.SPACE:
        case kc.ENTER:
          var sel = $('td.' + this._DAYOVER_CLASS, this._dpDiv);
          if (sel[0]) {
            this._selectDay(this._currentMonth, this._currentYear, sel[0], event);
          }
          // need to return false so preventing default + stop propagation here
          event.preventDefault();
          event.stopPropagation();
          return false;
        case kc.ESCAPE:
          this._hide(this._ON_CLOSE_REASON_CANCELLED);
          handled = true;
          break;// hide on escape
        case kc.PAGE_UP:
          if (event.ctrlKey && event.altKey) {
            this._adjustDate(-this.options.datePicker.stepBigMonths, 'M', true);
          } else if (event.altKey) {
            this._adjustDate(-1, 'Y', true);
          } else {
            this._adjustDate(-this._getStepMonths(), 'M', true);
          }
          handled = true;
          break;// previous month/year on page up/+ ctrl
        case kc.PAGE_DOWN:
          if (event.ctrlKey && event.altKey) {
            this._adjustDate(+this.options.datePicker.stepBigMonths, 'M', true);
          } else if (event.altKey) {
            this._adjustDate(1, 'Y', true);
          } else {
            this._adjustDate(+this._getStepMonths(), 'M', true);
          }
          handled = true;
          break;// next month/year on page down/+ ctrl
        case kc.END:
          this._currentDay = this._getDaysInMonth(this._currentYear, this._currentMonth);
          this._changeCurrentDay();

          handled = true;
          break;
        case kc.HOME:
          this._currentDay = 1;
          this._changeCurrentDay();

          handled = true;
          break;
        case kc.LEFT:

          // next month/year on alt +left on Mac
          if ((event.originalEvent && event.originalEvent.altKey) || event.altKey) {
            this._adjustDate((event.ctrlKey ?
                              -this.options.datePicker.stepBigMonths :
                              -this._getStepMonths()), 'M', true);
          } else {
            this._adjustDate((isRTL ? +1 : -1), 'D', true);
            // -1 day on ctrl or command +left
          }

          handled = true;
          break;
        case kc.UP:
          this._adjustDate(-7, 'D', true);
          handled = true;
          break;// -1 week on ctrl or command +up
        case kc.RIGHT:

          // next month/year on alt +right
          if ((event.originalEvent && event.originalEvent.altKey) || event.altKey) {
            this._adjustDate((event.ctrlKey ?
                              +this.options.datePicker.stepBigMonths :
                              +this._getStepMonths()), 'M', true);
          } else {
            this._adjustDate((isRTL ? -1 : +1), 'D', true);
            // +1 day on ctrl or command +right
          }

          handled = true;
          break;
        case kc.DOWN:
          this._adjustDate(+7, 'D', true);
          handled = true;
          break;// +1 week on ctrl or command +down
        default:
      }
    }
    // Removed Ctrl-HOME keyboard logic because it is impossible if the calendar is not showing

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
    return undefined;
  },

  _changeCurrentDay: function () {
    var cOver = $('.' + this._DAYOVER_CLASS, this._dpDiv);
    var cDay = this._currentDay + '';

    if (cOver.length === 1) {
      cOver.removeClass(this._DAYOVER_CLASS);
    }

    var datePickerCalendar = $('table.oj-datepicker-calendar', this._dpDiv);
    cOver = $('a.oj-enabled:contains(' + this._currentDay + ')', datePickerCalendar)
              .filter(function () {
                return $(this).text() === cDay;
              });
    if (cOver.length === 1) {
      var cParent = cOver.parent();
      datePickerCalendar.addClass('oj-focus-highlight');
      datePickerCalendar.attr('aria-activedescendant', cParent.attr('id') + '');
      cParent.addClass(this._DAYOVER_CLASS);
    }
  },

  // This handler is when an user keys down with the Month View having focus
  // TODO, during month/year work apparently CalendarKeyDown was copied + pasted for month/year. try to clean up code
  _doMonthViewKeyDown: function (event) {
    var handled = false;
    var kc = $.ui.keyCode;
    var isRTL = this._IsRTL();

    if (this._datepickerShowing()) {
      switch (event.keyCode) {
        case 84: // t character
          if (event.altKey && event.ctrlKey) {
            this._dpDiv.find('.oj-datepicker-current').focus();
            handled = true;
          }
          break;
        case kc.SPACE:
        case kc.ENTER:
          var sel = $('td.' + this._DAYOVER_CLASS, this._dpDiv);
          if (sel[0]) {
            this._selectMonthYear(sel[0], 'M');
          }
          // need to return false so preventing default + stop propagation here
          event.preventDefault();
          event.stopPropagation();
          return false;
        case kc.ESCAPE:
          this.hide();
          handled = true;
          break;// hide on escape
        case kc.PAGE_UP:
          if (event.ctrlKey && event.altKey) {
            this._adjustDate(-this.options.datePicker.stepBigMonths, 'M', true, 'month');
          } else if (event.altKey) {
            this._adjustDate(-1, 'Y', true, 'month');
          } else {
            this._adjustDate(-this._getStepMonths(), 'M', true, 'month');
          }
          handled = true;
          break;// previous month/year on page up/+ ctrl
        case kc.PAGE_DOWN:
          if (event.ctrlKey && event.altKey) {
            this._adjustDate(+this.options.datePicker.stepBigMonths, 'M', true, 'month');
          } else if (event.altKey) {
            this._adjustDate(1, 'Y', true, 'month');
          } else {
            this._adjustDate(+this._getStepMonths(), 'M', true, 'month');
          }
          handled = true;
          break;// next month/year on page down/+ ctrl
        case kc.END:
          this._currentMonth = 11;
          this._updateDatepicker(true, 'month');
          handled = true;
          break;
        case kc.HOME:
          this._currentMonth = 0;
          this._updateDatepicker(true, 'month');
          handled = true;
          break;
        case kc.LEFT:
          this._adjustDate((isRTL ? +1 : -1), 'M', true, 'month');
          handled = true;
          break;
        case kc.UP:
          this._adjustDate(-3, 'M', true, 'month');
          handled = true;
          break;// -1 week on ctrl or command +up
        case kc.RIGHT:
          this._adjustDate((isRTL ? -1 : +1), 'M', true, 'month');
          handled = true;
          break;
        case kc.DOWN:
          this._adjustDate(+3, 'M', true, 'month');
          handled = true;
          break;// +1 week on ctrl or command +down
        default:
      }
    }
    // Removed Ctrl-HOME keyboard logic because it is impossible if the calendar is not showing

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
    return undefined;
  },

  // This handler is when an user keys down with the Year View having focus
  _doYearViewKeyDown: function (event) {
    var handled = false;
    var kc = $.ui.keyCode;
    var isRTL = this._IsRTL();

    if (this._datepickerShowing()) {
      switch (event.keyCode) {
        case 84: // t character
          if (event.altKey && event.ctrlKey) {
            this._dpDiv.find('.oj-datepicker-current').focus();
            handled = true;
          }
          break;
        case kc.SPACE:
        case kc.ENTER:
          var sel = $('td.' + this._DAYOVER_CLASS, this._dpDiv);
          if (sel[0]) {
            this._selectMonthYear(sel[0], 'Y');
          }
          // need to return false so preventing default + stop propagation here
          event.preventDefault();
          event.stopPropagation();
          return false;
        case kc.ESCAPE:
          this.hide();
          handled = true;
          break;// hide on escape
        case kc.PAGE_UP:
          if (event.altKey) {
            this._adjustDate(-1, 'Y', true, 'year');
          }
          handled = true;
          break;// previous month/year on page up/+ ctrl
        case kc.PAGE_DOWN:
          if (event.altKey) {
            this._adjustDate(1, 'Y', true, 'year');
          }
          handled = true;
          break;// next month/year on page down/+ ctrl
        case kc.END:
          this._currentYear = (Math.floor(this._currentYear / 10) * 10) + 9;
          this._updateDatepicker(true, 'year');
          handled = true;
          break;
        case kc.HOME:
          this._currentYear = Math.floor(this._currentYear / 10) * 10;
          this._updateDatepicker(true, 'year');
          handled = true;
          break;
        case kc.LEFT:
          this._adjustDate((isRTL ? +1 : -1), 'Y', true, 'year');
          handled = true;
          break;
        case kc.UP:
          this._adjustDate(-3, 'Y', true, 'year');
          handled = true;
          break;// -1 week on ctrl or command +up
        case kc.RIGHT:
          this._adjustDate((isRTL ? -1 : +1), 'Y', true, 'year');
          handled = true;
          break;
        case kc.DOWN:
          this._adjustDate(+3, 'Y', true, 'year');
          handled = true;
          break;// +1 week on ctrl or command +down
        default :
      }
    }
    // Removed Ctrl-HOME keyboard logic because it is impossible if the calendar is not showing

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
    return undefined;
  },

  /**
   * @returns {jQuery} returns the content element of the datepicker
   *
   * @private
   */
  _getDatepickerContent: function () {
    return this._dpDiv ? $(this._dpDiv.find('.oj-datepicker-content')[0]) : $();
  },

  /**
   * Function to whether it is a datetimepicker with the switcher
   *
   * @private
   */
  _isDateTimeSwitcher: function () {
    return this._dateTimeSwitcherActive;
  },

  /**
   * Thie function will update the calendar display
   *
   * @private
   * @param {boolean=} focusOnCalendar - Whether to put focus in the calendar.
   * @param {string=} view - The view to update to. Default is 'day'.
   * @param {string=} navigation - Type of navigation to animate.
   */
  _updateDatepicker: function (focusOnCalendar, view, navigation) {
    this._maxRows = 4;// Reset the max number of rows being displayed (see #7043)
    var generatedHtmlContent;

    if (view === 'year') {
      generatedHtmlContent = this._generateViewHTML('Y');
    } else if (view === 'month') {
      generatedHtmlContent = this._generateViewHTML('M');
    } else {
      generatedHtmlContent = this._generateViewHTML('D');
    }

    generatedHtmlContent.html =
      '<div' + (this._isDateTimeSwitcher() ? '' : " class='oj-datepicker-wrapper'") +
      '>' + generatedHtmlContent.html + '</div>';

    this._currentView = view;
    var dpContentDiv = this._getDatepickerContent();

    if (navigation) {
      var oldChild = dpContentDiv.children().first();
      oldChild.css({ position: 'absolute', left: 0, top: 0 });

      dpContentDiv.prepend(generatedHtmlContent.html); // @HTMLUpdateOK
      var newChild = dpContentDiv.children().first();
      var direction = (navigation === 'previous') ? 'end' : 'start';

      if (!this._animationResolve) {
        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        this._animationResolve = busyContext.addBusyState({
          description: "The datepicker id='" + this.element.attr('id') + "' is animating."
        });
      }
      // eslint-disable-next-line no-undef
      AnimationUtils.startAnimation(newChild[0], 'open', {
        effect: 'slideIn',
        direction: direction
      });
      // eslint-disable-next-line no-undef
      var promise = AnimationUtils.startAnimation(oldChild[0], 'close', {
        effect: 'slideOut',
        direction: direction,
        persist: 'all'
      });
      var self = this;
      promise.then(function () {
        if (oldChild) {
          oldChild.remove();
        }

        self._setupNewView(focusOnCalendar, view, generatedHtmlContent.dayOverId);
        self._animationResolve();
        self._animationResolve = null;
      });
    } else {
      dpContentDiv.empty().append(generatedHtmlContent.html); // @HTMLUpdateOK
      this._setupNewView(focusOnCalendar, view, generatedHtmlContent.dayOverId);
    }
  },

  _setupNewView: function (focusOnCalendar, view, dayOverId) {
    this._attachHandlers();

    if (dayOverId) {
      this._dpDiv.find('.oj-datepicker-calendar').attr('aria-activedescendant', dayOverId);
    }

    var numMonths = this._getNumberOfMonths();
    var cols = numMonths[1];
    var width = 275;

    this._dpDiv
      .removeClass('oj-datepicker-multi-2 oj-datepicker-multi-3 oj-datepicker-multi-4')
      .width('');
    if (view === 'year' || view === 'month') {
      this._dpDiv.removeClass('oj-datepicker-multi');
    } else {
      numMonths = this._getNumberOfMonths();
      cols = numMonths[1];

      if (cols > 1) {
        // Try to determine the width dynamically
        var calendar = this._dpDiv.find('.oj-datepicker-calendar');
        var daySelectors = calendar.find('tbody a');
        var cellWidth = parseFloat(daySelectors.css('width'));
        var padding = parseFloat(calendar.css('margin-left'));
        if (!isNaN(cellWidth) && !isNaN(padding)) {
          width = (cellWidth * (this.options.datePicker.weekDisplay === 'number' ? 8 : 7)) +
            (padding * 2);
        }

        this._dpDiv
          .addClass('oj-datepicker-multi-' + cols)
          .css('width', ((width * cols) + (this._isInLine ? 2 : 0)) + 'px');
      }
      this._dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? 'add' : 'remove') + 'Class'](
        'oj-datepicker-multi');
    }

    // #6694 - don't focus the input if it's already focused
    // this breaks the change event in IE
    if (this._datepickerShowing() && this.element.is(':visible') &&
        !this.element.is(':disabled')) {
      if (!focusOnCalendar) {
        if (!this._isInLine && this.element[0] !== document.activeElement) {
          this.element.focus();
        }
      } else {
        this._placeFocusOnCalendar();
      }
    }
  },

  _placeFocusOnCalendar: function () {
    var calendar = this._dpDiv.find('.oj-datepicker-calendar');
    if (calendar[0] !== document.activeElement) {
      $(calendar[0]).focus();
    }
  },

  /**
   * Adjust one of the date sub-fields.
   *
   * @private
   * @param {number} offset
   * @param {string} period
   * @param {boolean=} focusOnCalendar - Whether to put focus in the calendar.
   * @param {string=} view - The view to update to. Default is 'day'.
   * @param {string=} navigation - Type of navigation to animate.
   */
  _adjustDate: function (offset, period, focusOnCalendar, view, navigation) {
    if (this.options.disabled) {
      return;
    }

    var currMonth = this._currentMonth;
    var currYear = this._currentYear;
    this._adjustInstDate(offset + (period === 'M' ? this.options.datePicker.currentMonthPos : 0), // undo positioning
                          period);

    if (period === 'D' && currMonth === this._currentMonth && currYear === this._currentYear) {
      // just day update so change day over class
      this._changeCurrentDay();
    } else {
      this._updateDatepicker(focusOnCalendar, view, navigation);
    }
  },

  /**
   * Action for current link. Note that this is of today relative to client's locale so this is ok.
   *
   * @private
   */
  _gotoToday: function () {
    var date = new Date();

    this._currentDay = date.getDate();
    this._currentMonth = date.getMonth();
    this._drawMonth = this._currentMonth;
    this._currentYear = date.getFullYear();
    this._drawYear = this._currentYear;

    this._adjustDate(null, null, true, 'day');
  },

  /**
   * Action for selecting a new month/year.
   *
   * @private
   * @param {Object} select
   * @param {string} period
   */
  _selectMonthYear: function (select, period) {
    var selected;
    // TODO: Is value really needed? Does converterUtils._dateTime have side effects?
    // eslint-disable-next-line no-unused-vars
    var value = this._getDateIso();
    var yearAttr = select.getAttribute('data-year');
    var subId = '';

    if (yearAttr) {
      selected = parseInt(yearAttr, 10);
      this._currentYear = selected;
      this._drawYear = selected;
      subId = selected + '_';
    }

    if (period === 'M') {
      selected = parseInt(select.getAttribute('data-month'), 10);
      this._currentMonth = selected;
      this._drawMonth = selected;
      subId = selected + '_';
      value = this._validateDatetime(value, { fullYear: this._currentYear,
        month: this._currentMonth });
    } else {
      value = this._validateDatetime(value, { fullYear: this._currentYear });
    }

    // Take care of accessibility. Note that this is using an INTERNAL converter to display only the year portion [no timezone]
    // so is okay
    $('#' + this._GetSubId(subId + this._CALENDAR_DESCRIPTION_ID))
      .html(this._EscapeXSS(this.options.monthWide[this._drawMonth]) + ' ' + // @HTMLUpdateOK
            yearDisplay.format(
              __ValidationBase.IntlConverterUtils.dateToLocalIso(new Date(this._drawYear,
                                                            this._drawMonth, 1)))); // @HTMLUpdateOK

    this._adjustDate(0, 0, true, period === 'M' ? 'day' : this._toYearFromView);
  },

  // Action for selecting a day.
  // eslint-disable-next-line no-unused-vars
  _selectDay: function (month, year, td, event) {
    if ($(td).hasClass(this._UNSELECTABLE_CLASS) || this.options.disabled) {
      return;
    }

    if (!this._isDateTimeSwitcher()) {
      this._hide(this._ON_CLOSE_REASON_SELECTION);
    }

    this._currentDay = $('a', td).html(); // @HtmlUpdateOk
    this._currentMonth = month;
    this._currentYear = year;

    var converterUtils = __ValidationBase.IntlConverterUtils;
    var value = this.options.value;
    var tempDate = new Date(this._currentYear, this._currentMonth, this._currentDay);

    if (value) {
      // need to preserve the time portion when of ojInputDateTime, so update only year, month, and date
      try {
        value = converterUtils._dateTime(value, {
          fullYear: tempDate.getFullYear(),
          month: tempDate.getMonth(),
          date: tempDate.getDate() });
      } catch (e) {
        Logger.info('The value of the InputDateTime element should be an ISOString, please use a valid ISOString');
        value = converterUtils.dateToLocalIso(tempDate);
      }
    } else {
      // per discussion when date doesn't exist use local isostring
      value = converterUtils.dateToLocalIso(tempDate);
    }

    this._setDisplayAndValue(value, {});

    if (this._isDateTimeSwitcher()) {
      this._placeFocusOnCalendar();
    }
  },

  _setDisplayAndValue: function (isoString, event) {
    if (!this._isDateTimeSwitcher()) {
      var formatted = this._GetConverter().format(isoString);
      this._SetDisplayValue(formatted); // need to set the display value, since _SetValue doesn't trigger it per discussion
                                          // need to use formatted value as otherwise it doesn't go through framework's cycle
                                          // in updates
      this._SetValue(formatted, event); // TEMP TILL FIXED PASS IN formatted
    } else {
      this._switcherDateValue = isoString;
      this._setCurrentDate(isoString);

      if (this._datepickerShowing()) {
        var focusOnCalendar = !(this._isInLine && this._timePicker &&
                                this._timePicker[0] === document.activeElement);
        this._updateDatepicker(focusOnCalendar);
      }
    }
  },

  /**
   * Get the default isostring date
   *
   * @ignore
   * @private
   */
  _getDefaultIsoDate: function () {
    return __ValidationBase.IntlConverterUtils.dateToLocalIso(this._getTodayDate());
  },

  /**
   * Updates the internal current + draw values
   *
   * @private
   * @param {string} isoDate
   */
  _setCurrentDate: function (isoDate) {
    var newDate;
    newDate = this._validateDatetime(isoDate || this._getDefaultIsoDate(), ['fullYear', 'month', 'date'], true);
    this._currentDay = newDate.date;
    this._currentMonth = newDate.month;
    if (!this._isMultiMonth()) {
      // request not to change month
      this._drawMonth = newDate.month;
    }

    this._currentYear = newDate.fullYear;
    this._drawYear = this._currentYear;
    this._adjustInstDate();
  },

  _getStepMonths: function () {
    var stepMonths = this.options.datePicker.stepMonths;
    return $.isNumeric(stepMonths) ? stepMonths : this.options.datePicker.numberOfMonths;
  },

  // Check if an event is a button activation event
  _isButtonActivated: function (evt) {
    // We are using <a role='button'> for the buttons.  They fire click event
    // on Enter keydown.  We just need to check for Space/Enter key here.

    return (!this.options.disabled &&
           ((evt.type === 'click') ||
            (evt.type === 'keydown' && (evt.keyCode === 32 || evt.keyCode === 13))));
  },

  _gotoPrev: function (stepMonths) {
    if (this._currentView === 'year') {
      this._adjustDate(-10, 'Y', true, 'year', 'previous');
    } else if (this._currentView === 'month') {
      this._adjustDate(-1, 'Y', true, 'month', 'previous');
    } else {
      this._adjustDate(-stepMonths, 'M', true, 'day', 'previous');
    }
  },

  _gotoNext: function (stepMonths) {
    if (this._currentView === 'year') {
      this._adjustDate(+10, 'Y', true, 'year', 'next');
    } else if (this._currentView === 'month') {
      this._adjustDate(+1, 'Y', true, 'month', 'next');
    } else {
      this._adjustDate(+stepMonths, 'M', true, 'day', 'next');
    }
  },

  /**
   * Attach the onxxx handlers.  These are declared statically so
   * they work with static code transformers like Caja.
   *
   * @private
   */
  _attachHandlers: function () {
    var stepMonths = this._getStepMonths();
    var self = this;
    var keyDownPrevent = function (evt) {
      var allowDefaultEvent = false;
      if (evt.type === 'keydown' && evt.keyCode === $.ui.keyCode.TAB) {
        allowDefaultEvent = true;
      }

      return allowDefaultEvent;
    };

    this._dpDiv.find('[data-handler]').map(function () {
      var handler = {
        /** @expose */
        prev: function (evt) {
          if (self._isButtonActivated(evt)) {
            self._gotoPrev(stepMonths);
          }
          return keyDownPrevent(evt);
        },
        /** @expose */
        next: function (evt) {
          if (self._isButtonActivated(evt)) {
            self._gotoNext(stepMonths);
          }
          return keyDownPrevent(evt);
        },
        /** @expose */
        today: function (evt) {
          if (self._isButtonActivated(evt)) {
            self._gotoToday();
          }
          return keyDownPrevent(evt);
        },
        /** @expose */
        selectDay: function (evt) {
          if (self._isButtonActivated(evt)) {
            self._selectDay(+this.getAttribute('data-month'), +this.getAttribute('data-year'), this, evt);
          }
          return keyDownPrevent(evt);
        },
        /** @expose */
        selectMonth: function (evt) {
          if (self._isButtonActivated(evt)) {
            self._selectMonthYear(this, 'M');
          }
          return keyDownPrevent(evt);
        },
        /** @expose */
        selectYear: function (evt) {
          if (self._isButtonActivated(evt)) {
            self._selectMonthYear(this, 'Y');
          }
          return keyDownPrevent(evt);
        },
        /** @expose */
        calendarKey: function (evt) {
          if (self._currentView === 'year') {
            self._doYearViewKeyDown(evt);
          } else if (self._currentView === 'month') {
            self._doMonthViewKeyDown(evt);
          } else {
            self._doCalendarKeyDown(evt);
          }
        },
        /** @expose */
        selectMonthHeader: function (evt) {
          if (self._isButtonActivated(evt)) {
            if (self._currentView === 'month') {
              self._updateDatepicker(true, 'day');
            } else {
              self._updateDatepicker(true, 'month');
            }
          }
          return keyDownPrevent(evt);
        },
        /** @expose */
        selectYearHeader: function (evt) {
          if (self._isButtonActivated(evt)) {
            if (self._currentView === 'year') {
              self._updateDatepicker(true, 'day');
            } else {
              // Remember where we are navigating to the Year view from
              self._toYearFromView = self._currentView;
              self._updateDatepicker(true, 'year');
            }
          }
          return keyDownPrevent(evt);
        }
      };
      $(this).bind(this.getAttribute('data-event'), handler[this.getAttribute('data-handler')]);
      return undefined;
    });

    // Only show the day focus if the user starts using keyboard
    this._dpDiv.find('.oj-datepicker-calendar').map(function () {
      oj.DomUtils.makeFocusable({
        element: $(this),
        applyHighlight: true
      });
      return undefined;
    });

    // Avoid problem with hover/active state on header/footer not going away on touch devices
    var buttons = this._dpDiv.find('.oj-datepicker-header a, .oj-datepicker-buttonpane a');
    this._AddHoverable(buttons);
    this._AddActiveable(buttons);
  },

  _registerSwipeHandler: function () {
    if (oj.DomUtils.isTouchSupported()) {
      var self = this;
      var stepMonths = this._getStepMonths();
      var rtl = this._IsRTL();
      var options = {
        recognizers: [
          [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }]
        ] };

      this._dpDiv.ojHammer(options).on(rtl ? 'swiperight' : 'swipeleft', function () {
        self._gotoNext(stepMonths);
        return false;
      })
      .on(rtl ? 'swipeleft' : 'swiperight', function () {
        self._gotoPrev(stepMonths);
        return false;
      });
    }
  },

  /**
   * Generate the HTML for the current state of the date picker.
   *
   * @private
   */
  _getMinMaxDateIso: function (minOrMax) {
    var minMaxDateIso = this.options[minOrMax];
    if (minMaxDateIso) {
      var dateIso = this._getDateIso();
      minMaxDateIso = __ValidationBase.IntlConverterUtils._minMaxIsoString(minMaxDateIso, dateIso);
    }

    return minMaxDateIso;
  },

  /**
   * Generate the HTML for the header of the date picker.
   *
   * @private
   */
  _generateHeader: function (drawMonth, drawYear, monthControl, enablePrev, enableNext) {
    var isRTL = this._IsRTL();

    var prevText = this._EscapeXSS(this.getTranslatedString('prevText'));

    var prev = (enablePrev ?
                "<a role='button' href='#' onclick='return false;'" +
                " class='oj-datepicker-prev-icon oj-enabled oj-default oj-component-icon" +
                " oj-clickable-icon-nocontext'" +
                " data-handler='prev' data-event='click keydown'" +
                " aria-label='" + prevText + "'></a>" :

                "<a class='oj-datepicker-prev-icon oj-disabled oj-component-icon" +
                " oj-clickable-icon-nocontext' title='" +
                prevText + "'></a>");

    var nextText = this._EscapeXSS(this.getTranslatedString('nextText'));

    var next = (enableNext ?
                "<a role='button' href='#' onclick='return false;'" +
                " class='oj-datepicker-next-icon oj-enabled oj-default oj-component-icon" +
                " oj-clickable-icon-nocontext' data-handler='next' data-event='click keydown'" +
                " aria-label='" + nextText + "'></a>" :

                "<a class='oj-datepicker-next-icon oj-disabled oj-component-icon" +
                " oj-clickable-icon-nocontext' title='" +
                nextText + "'></a>");

    var header = "<div class='oj-datepicker-header" +
        (this.options.disabled ? ' oj-disabled ' : ' oj-enabled oj-default ') +
        "'>";

    if (/all|left/.test(monthControl)) {
      if (isRTL) {
        header += next;
      } else {
        header += prev;
      }
    }

    if (/all|right/.test(monthControl)) {
      if (isRTL) {
        header += prev;
      } else {
        header += next;
      }
    }

    header += this._generateMonthYearHeader(drawMonth, drawYear);

    header += '</div>';

    return header;
  },

  /**
   * Generate the HTML for the footer of the date picker.
   *
   * @protected
   * @ignore
   */
  _generateFooter: function (footerLayoutDisplay, gotoDate) {
    var footerLayout = '';
    var currentText = this._EscapeXSS(this.getTranslatedString('currentText'));
    var todayControl = "<a role='button' href='#' onclick='return false;'" +
        " class='oj-datepicker-current oj-priority-secondary " +
        (this.options.disabled ? "oj-disabled' disabled" : "oj-enabled'") +
        " data-handler='today' data-event='click keydown'>" +
        currentText + '</a>';

    if (footerLayoutDisplay.length > 1) { // keep the code for future multiple buttons
      var todayIndex = footerLayoutDisplay.indexOf('today');
      var loop = 0;
      var footerLayoutButtons = [{
        index: todayIndex,
        content: (this._isInRange(gotoDate) ? todayControl : '')
      }];

      // rather than using several if + else statements, sort the content to add by index of the strings
      footerLayoutButtons.sort(function (a, b) {
        return a.index - b.index;
      });

      // continue to loop until the index > -1 [contains the string]
      while (loop < footerLayoutButtons.length && footerLayoutButtons[loop].index < 0) {
        loop += 1;
      }

      while (loop < footerLayoutButtons.length) {
        footerLayout += footerLayoutButtons[loop].content;
        loop += 1;
      }

      if (footerLayout.length > 0) {
        footerLayout = "<div class='oj-datepicker-buttonpane'>" + footerLayout + '</div>';
      }
    }

    return footerLayout;
  },

  _isMultiMonth: function () {
    var numMonths = this._getNumberOfMonths();
    return (numMonths[0] !== 1 || numMonths[1] !== 1);
  },

  /**
   * Generate the HTML for the current state of the date picker. Might be ugly in passing so many parameters, but
   * during the month+year feature apparently the code was duplicated with copy+paste so though not pretty at least
   * helps to manage main variables and etc
   *
   * @param {string} view - 'Y', 'M', or 'D' like in other areas of the code
   * @private
   */
  _generateViewHTML: function (view) {
    var converterUtils = __ValidationBase.IntlConverterUtils;
    var dateParams = ['date', 'month', 'fullYear'];
    var converter = this._GetConverter();
    var tempDate = new Date();
    var today = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()); // clear time
    var isRTL = this._IsRTL();
    var footerLayoutDisplay = this.options.datePicker.footerLayout;
    var numMonths = this._getNumberOfMonths();
    var currentMonthPos = this.options.datePicker.currentMonthPos;
    var isMultiMonth = this._isMultiMonth();
    var minDateIso = this._getMinMaxDateIso('min');
    var minDateParams;
    var maxDateIso = this._getMinMaxDateIso('max');
    var maxDateParams;
    var drawMonth = this._drawMonth - currentMonthPos;
    var drawYear = this._drawYear;
    var compareDate = new Date(this._currentYear, this._currentMonth, this._currentDay);
    var valueDateIso = this._getDateIso();
    var valueDateParams = this._validateDatetime(valueDateIso, dateParams, true);
    var selectedYear = valueDateParams.fullYear;
    var selectedDay = valueDateParams.date;
    var selectedMonth = valueDateParams.month;
    var valueDate = new Date(selectedYear, selectedMonth, selectedDay);
    var wDisabled = this.options.disabled;
    var weekText = this._EscapeXSS(this.getTranslatedString('weekText'));

    if (minDateIso) {
      // convert it to the correct timezone for comparison, since need to display the month, date, year as displayed in isoString
      minDateIso = converter.parse(minDateIso);
      minDateParams = this._validateDatetime(minDateIso, dateParams, true);
    }
    if (maxDateIso) {
      maxDateIso = converter.parse(maxDateIso);
      maxDateParams = this._validateDatetime(maxDateIso, dateParams, true);
    }
    try {
      valueDateIso = converterUtils._clearTime(valueDateIso);
    } catch (e) {
      Logger.info('The value of the InputDateTime element should be an ISOString, please use a valid ISOString');
      valueDateIso = converterUtils._clearTime(this._getDefaultIsoDate());
    }

    // So per discussion calendar will display the year, month, date based on how represented in the isoString
    // meaning 2013-12-01T20:00:00-08:00 and 2013-12-01T20:00:00-04:00 will both display the same content as no
    // conversion will take place. In order to achieve this it will rip out the necessary info by string parsing
    // and in regards to isoString date comparison (i.e. whether one is before the other, will need to use converter's
    // compareISODates passing the MODIFIED printDate isoString)
    if (drawMonth < 0) {
      drawMonth += 12;
      drawYear -= 1;
    }

    if (minDateParams) {
      var minDraw = new Date(minDateParams.fullYear, minDateParams.month, minDateParams.date);

      // tech shouldn't this error out? [previous existing jquery logic so keep, maybe a reason]
      if (maxDateParams && converter.compareISODates(maxDateIso, minDateIso) < 0) {
        minDraw = new Date(maxDateParams.fullYear, maxDateParams.month, maxDateParams.date);
      }
      while (new Date(drawYear, drawMonth, this._getDaysInMonth(drawYear, drawMonth)) < minDraw) {
        drawMonth += 1;
        if (drawMonth > 11) {
          drawMonth = 0;
          drawYear += 1;
        }
      }
    }

    if (maxDateParams) {
      var maxDraw = new Date(maxDateParams.fullYear,
                             (maxDateParams.month - (numMonths[0] * numMonths[1])) + 1,
                             maxDateParams.date);

      // tech shouldn't this error out? [previous existing jquery logic so keep, maybe a reason]
      if (minDateParams && converter.compareISODates(maxDateIso, minDateIso) < 0) {
        maxDraw = new Date(minDateParams.fullYear, minDateParams.month, minDateParams.date);
      }
      while (new Date(drawYear, drawMonth, 1) > maxDraw) {
        drawMonth -= 1;
        if (drawMonth < 0) {
          drawMonth = 11;
          drawYear -= 1;
        }
      }
    }
    this._drawMonth = drawMonth;
    this._drawYear = drawYear;

    var footerLayout = this._generateFooter(footerLayoutDisplay, today);

    var weekDisplay = this.options.datePicker.weekDisplay;

    var result;

    if (view === 'D') {
      result = this._generateDayHTMLContent(converterUtils, converter,
                                            footerLayout, weekDisplay, today, isRTL,
                                            numMonths, isMultiMonth, minDateParams,
                                            maxDateParams, drawMonth, drawYear, compareDate,
                                            valueDateParams, selectedYear, selectedDay,
                                            selectedMonth, valueDate, wDisabled, weekText);
    } else if (view === 'M') {
      result = this._generateMonthHTMLContent(converter, footerLayout,
                                              minDateParams, maxDateParams, drawMonth, drawYear,
                                              valueDate, wDisabled);
    } else {
      result = this._generateYearHTMLContent(converterUtils,
                                             footerLayout, minDateParams, maxDateParams,
                                             drawMonth, drawYear, valueDate, wDisabled);
    }

    return result;
  },

  /**
   * @private
   */
  _generateDayHTMLContent: function (
    converterUtils, converter, footerLayout,
    weekDisplay, today, isRTL, numMonths, isMultiMonth, minDateParams,
    maxDateParams, drawMonth, drawYear, compareDate, valueDateParams,
    selectedYear, selectedDay, selectedMonth, valueDate, wDisabled, weekText
  ) {
    var dayNames = this.options.dayWide;
    var dayNamesMin = this.options.dayNarrow;
    var firstDay = this.options.firstDayOfWeek;
    var dow;
    var dayOverId = '';
    var dayFormatter = this.options.dayFormatter;
    var currMetaData = null;

    var enablePrev = this._canAdjustMonth(-1, drawYear, drawMonth) && !wDisabled;
    var enableNext = this._canAdjustMonth(+1, drawYear, drawMonth) && !wDisabled;

    var daysOutsideMonth = this.options.datePicker.daysOutsideMonth;
    var html = '';

    var monthControl = 'all';
    for (var row = 0; row < numMonths[0]; row++) {
      var group = '';
      this._maxRows = 4;
      for (var col = 0; col < numMonths[1]; col++) {
        monthControl = row === 0 ? 'all' : '';
        var calender = '';
        if (isMultiMonth) {
          calender += "<div class='oj-datepicker-group";
          if (numMonths[1] > 1) {
            switch (col) {
              case 0:
                calender += ' oj-datepicker-group-first';
                if (row === 0) {
                  if (isRTL) {
                    monthControl = 'right';
                  } else {
                    monthControl = 'left';
                  }
                } else {
                  monthControl = '';
                }
                break;
              case numMonths[1] - 1:
                calender += ' oj-datepicker-group-last';
                if (row === 0) {
                  if (isRTL) {
                    monthControl = 'left';
                  } else {
                    monthControl = 'right';
                  }
                } else {
                  monthControl = '';
                }
                break;
              default :
                calender += ' oj-datepicker-group-middle';
                monthControl = '';
                break;
            }
          }
          calender += "'>";
        }

        calender += this._generateHeader(drawMonth, drawYear, monthControl,
                                         enablePrev, enableNext);

        calender += "<table class='oj-datepicker-calendar" +
          (weekDisplay === 'number' ? ' oj-datepicker-weekdisplay' : '') +
          (wDisabled ? ' oj-disabled ' : ' oj-enabled oj-default ') +
          "' tabindex=-1 data-handler='calendarKey' data-event='keydown'" +
          " aria-readonly='true' role='grid' " +
          "aria-labelledby='" + this._GetSubId(drawYear + '_' + drawMonth + '_' + this._CALENDAR_DESCRIPTION_ID) +
          "'><thead role='presentation'>" +
          "<tr role='row'>";

        var thead = (weekDisplay === 'number' ?
                     "<th class='oj-datepicker-week-col'>" +
                     this._EscapeXSS(this.getTranslatedString('weekHeader')) + '</th>' :
                     '');
        for (dow = 0; dow < 7; dow++) {
          // days of the week
          var day = (dow + parseInt(firstDay, 10)) % 7;
          thead += "<th role='columnheader' aria-label='" + dayNames[day] +
            "'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='oj-datepicker-week-end'" : '') + '>' +
            "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + '</span></th>';
        }

        calender += thead + "</tr></thead><tbody role='presentation'>";
        var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
        if (drawYear === selectedYear && drawMonth === selectedMonth) {
          // eslint-disable-next-line no-param-reassign
          selectedDay = Math.min(selectedDay, daysInMonth);
        }
        var leadDays = ((this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay) + 7) % 7;
        var curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
        var numRows = (isMultiMonth && this._maxRows > curRows ?
                       this._maxRows : curRows); // If multiple months, use the higher number of rows (see #7043)
        this._maxRows = numRows;
        var printDate = new Date(drawYear, drawMonth, 1 - leadDays);
        for (var dRow = 0; dRow < numRows; dRow++) {
          // create date picker rows
          calender += "<tr role='row'>";
          var calculatedWeek;
          try {
            calculatedWeek = this._GetConverter().calculateWeek(
            converterUtils.dateToLocalIso(printDate));
          } catch (e) {
            Logger.info('The value of the InputDateTime element should be an ISOString, please use a valid ISOString');
          }
          var tbody = (weekDisplay === 'none' ? '' :
                   ("<td class='oj-datepicker-week-col' role='rowheader' aria-label='" +
                    weekText + ' ' + calculatedWeek + "'>" + calculatedWeek + '</td>'));
          for (dow = 0; dow < 7; dow++) {
            // create date picker days
            var otherMonth = (printDate.getMonth() !== drawMonth);
            var selected = printDate.getTime() === valueDate.getTime();
            var rowCellId = 'oj-dp-' + this.uuid + '-' + dRow + '-' + dow + '-' + row + '-' + col;
            var dayOverClass = (printDate.getTime() === compareDate.getTime() &&
                                drawMonth === this._currentMonth);
            var dayOverClassStr;
            if (dayOverClass) {
              dayOverId = rowCellId;
              dayOverClassStr = ' ' + this._DAYOVER_CLASS;
            } else {
              dayOverClassStr = '';
            }

            var daySettings = [true, ''];
            var pYear = printDate.getFullYear();
            var pMonth = printDate.getMonth();
            var pDate = printDate.getDate();

            if (dayFormatter) {
              currMetaData = dayFormatter({ fullYear: pYear, month: pMonth + 1, date: pDate }); // request to start from 1 rather than 0
              if (currMetaData) {
                // has content
                daySettings = [!currMetaData.disabled, currMetaData.className || ''];
                if (currMetaData.tooltip) {
                  daySettings.push(currMetaData.tooltip);
                }
              }
            }
            var selectedDate = printDate.getTime() === valueDate.getTime();

            var unselectable = (otherMonth && daysOutsideMonth !== 'selectable') ||
              !daySettings[0] ||
              this._outSideMinMaxRange(printDate, minDateParams, maxDateParams);

            tbody += "<td role='gridcell' aria-disabled='" + !!unselectable +
              "' aria-selected='" + selected + "' id='" + rowCellId + "' " +
              "class='" + ((dow + firstDay + 6) % 7 >= 5 ? ' oj-datepicker-week-end' : '') + // highlight weekends
              (otherMonth ? ' oj-datepicker-other-month' : '') + // highlight days from other months
              (dayOverClassStr) + // highlight selected day
              (unselectable || wDisabled ? ' ' + this._UNSELECTABLE_CLASS + ' oj-disabled' :
               ' oj-enabled ') + // highlight unselectable days
              (otherMonth && daysOutsideMonth === 'hidden' ? '' : ' ' + daySettings[1] + // highlight custom dates
               (selected ? ' ' + this._CURRENT_CLASS : '') + // highlight selected day
               (printDate.getTime() === today.getTime() ? ' oj-datepicker-today' : '')) + "'" + // highlight today (if different)
              ((!otherMonth || daysOutsideMonth !== 'hidden') && daySettings[2] ?
               " title='" + daySettings[2].replace(/'/g, '&#39;') + "'" : '') + // cell title
              (unselectable ? '' : " data-handler='selectDay' data-event='click' data-month='" +
               printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + '>' + // actions
              // eslint-disable-next-line no-nested-ternary
              (otherMonth && daysOutsideMonth === 'hidden' ? '&#xa0;' : // display for other months
               (unselectable || wDisabled ?
                "<span class='oj-disabled'>" + printDate.getDate() + '</span>' :
                "<a role='button' class='oj-enabled" + (selectedDate ? ' oj-selected' : '') + // highlight selected day
                (otherMonth ? ' oj-priority-secondary' : '') + // distinguish dates from other months
                "' " + (dayOverClass ? '' : "tabindex='-1' ") +
                " onclick='return false;' href='#'>" +
                printDate.getDate() + '</a>')) + '</td>';// display selectable date
            printDate.setDate(printDate.getDate() + 1);
          }
          calender += tbody + '</tr>';
        }
        // eslint-disable-next-line no-param-reassign
        drawMonth += 1;
        if (drawMonth > 11) {
          // eslint-disable-next-line no-param-reassign
          drawMonth = 0;
          // eslint-disable-next-line no-param-reassign
          drawYear += 1;
        }
        calender += '</tbody></table>';
        if (isMultiMonth) {
          calender += '</div>';
          if (numMonths[0] > 0 && col === numMonths[1] - 1) {
            calender += "<div class='oj-datepicker-row-break'></div>";
          }
        }

        group += calender;
      }
      html += group;
    }
    html += footerLayout;
    return { html: html, dayOverId: dayOverId };
  },

  /**
   * Generate the month and year header.
   *
   * @private
   */
  _generateMonthYearHeader: function (drawMonth, drawYear) {
    var changeMonth = this.options.datePicker.changeMonth;
    var changeYear = this.options.datePicker.changeYear;
    var positionOfMonthToYear = LocaleData.isMonthPriorToYear() ? 'before' : 'after';
    var html = "<div class='oj-datepicker-title'>";
    var monthHtml = '';
    var converterUtils = __ValidationBase.IntlConverterUtils;
    var monthNames = this.options.monthWide;
    var wDisabled = this.options.disabled;
    var subId = drawYear + '_' + drawMonth + '_';

    // month selection
    if (monthNames) {
      if (changeMonth === 'none') {
        monthHtml += "<span class='oj-datepicker-month'>" + monthNames[drawMonth] + '</span>';
      } else {
        monthHtml += "<a role='button' onclick='return false;' href='#'" +
          " data-handler='selectMonthHeader' data-event='click keydown'" +
          " class='oj-datepicker-month " +
          (wDisabled ? "oj-disabled' disabled" : "oj-enabled'") + '>';
        monthHtml += monthNames[drawMonth] + '</a>';
      }

      if (positionOfMonthToYear === 'before') {
        html += monthHtml + (!((changeMonth === 'select') &&
                               (changeYear === 'select')) ? '&#xa0;' : '');
      }
    }

    // year selection
    if (!this.yearshtml) {
      this.yearshtml = '';
      if (changeYear === 'none') {
        html += "<span class='oj-datepicker-year'>" +
          yearDisplay.format(converterUtils.dateToLocalIso(new Date(drawYear, drawMonth, 1))) +
          '</span>';
      } else {
        html += "<a role='button' onclick='return false;' href='#'" +
          " data-handler='selectYearHeader' data-event='click keydown'" +
          " class='oj-datepicker-year " +
          (wDisabled ? "oj-disabled' disabled" : "oj-enabled'") + '>';
        html += yearDisplay.format(
          converterUtils.dateToLocalIso(new Date(drawYear, drawMonth, 1))
        ) + '</a>';
        this.yearshtml = null;
      }
    }

    if (monthNames) {
      if (positionOfMonthToYear === 'after') {
        html += (!((changeMonth === 'select') && (changeYear === 'select')) ? '&#xa0;' : '') +
          monthHtml;
      }
    }

// we only need the description spans rendered once, as they don't change for each month instance.
    var needsDescSpans = this._drawYear === drawYear && this._drawMonth === drawMonth;

    if (needsDescSpans) {
      html += "<span aria-hidden='true' class='oj-helper-hidden-accessible' id='" +
        this._GetSubId(this._DATEPICKER_DIALOG_DESCRIPTION_ID) + "'>";
      html += this._EscapeXSS(this.getTranslatedString('picker')) + '</span>';
    }

    html += "<span aria-hidden='true' class='oj-helper-hidden-accessible' id='" +
      this._GetSubId(subId + this._CALENDAR_DESCRIPTION_ID) + "'>";
    html += (monthNames ? (monthNames[drawMonth] + ' ') : '') +
      yearDisplay.format(converterUtils.dateToLocalIso(new Date(drawYear, drawMonth, 1))) +
      '</span>';

    if (needsDescSpans) {
      html += "<span aria-hidden='true' class='oj-helper-hidden-accessible' id='" +
      this._GetSubId(this._DATEPICKER_DESCRIPTION_ID) + "'>" +
      this._EscapeXSS(this.getTranslatedString('datePicker')) + '</span>';
    }

    html += '</div>';// Close datepicker_header
    return html;
  },

  /**
   * Adjust one of the date sub-fields.
   *
   * @private
   */
  _adjustInstDate: function (offset, period) {
    var year = this._drawYear + (period === 'Y' ? offset : 0);
    var month = this._drawMonth + (period === 'M' ? offset : 0);
    var day = Math.min(this._currentDay, this._getDaysInMonth(year, month)) +
        (period === 'D' ? offset : 0);
    var date = new Date(year, month, day);

    this._currentDay = date.getDate();
    this._currentMonth = date.getMonth();
    this._drawMonth = this._currentMonth;
    this._currentYear = date.getFullYear();
    this._drawYear = this._currentYear;
  },

  /**
   * Generate the HTML for the month view of the date picker.
   *
   * @private
   */
  _generateMonthHTMLContent: function (
    converter, footerLayout, minDateParams,
    maxDateParams, drawMonth, drawYear, valueDate, wDisabled) {
    var monthNamesShort = this.options.monthAbbreviated;
    var dayOverId = '';

    var enablePrev = this._canAdjustYear(-1, drawYear) && !wDisabled;
    var enableNext = this._canAdjustYear(+1, drawYear) && !wDisabled;

    var html = '';

    this._maxRows = 4;

    var calender = '';

    calender += this._generateHeader(drawMonth, drawYear, 'all', enablePrev, enableNext);

    calender += "<table class='oj-datepicker-calendar oj-datepicker-monthview" +
      (wDisabled ? ' oj-disabled ' : ' oj-enabled oj-default ') +
      "' tabindex=-1 data-handler='calendarKey' data-event='keydown'" +
      " aria-readonly='true' role='grid' " +
      "aria-labelledby='" +
      this._GetSubId(drawYear + '_' + drawMonth + '_' + this._CALENDAR_DESCRIPTION_ID) + "'>";

    calender += "<tbody role='presentation'>";
    var printDate = new Date(drawYear, 0, 1);
    for (var dRow = 0; dRow < 4; dRow++) {
      // create date picker rows
      calender += "<tr role='row'>";

      var tbody = '';
      for (var dow = 0; dow < 3; dow++) {
        var month = (dRow * 3) + dow;
        // create date picker days
        var selected = printDate.getMonth() === valueDate.getMonth();
        var rowCellId = 'oj-dp-' + this.uuid + '-' + dRow + '-' + dow + '-' + 0 + '-' + 0;
        var dayOverClass = (month === this._currentMonth);
        var dayOverClassStr;
        if (dayOverClass) {
          dayOverId = rowCellId;
          dayOverClassStr = ' ' + this._DAYOVER_CLASS;
        } else {
          dayOverClassStr = '';
        }

        var selectedDate = printDate.getMonth() === valueDate.getMonth();
        var inMinYear = (minDateParams && minDateParams.fullYear === drawYear);
        var inMaxYear = (maxDateParams && maxDateParams.fullYear === drawYear);

        var unselectable = !((!inMinYear || month >= minDateParams.month) &&
                             (!inMaxYear || month <= maxDateParams.month));

        tbody += "<td role='gridcell' aria-disabled='" + !!unselectable +
          "' aria-selected='" + selected + "' id='" + rowCellId + "' " +
          "class='" + (dayOverClassStr) + // highlight selected day
          (unselectable || wDisabled ? ' ' + this._UNSELECTABLE_CLASS + ' oj-disabled' :
           ' oj-enabled ') + // highlight unselectable days
          (selected ? ' ' + this._CURRENT_CLASS : '') + "'" + // highlight selected day
          (unselectable ? '' : " data-handler='selectMonth' data-event='click' data-month='" +
           printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + '>' + // actions
          ((unselectable || wDisabled ?
            "<span class='oj-disabled'>" + monthNamesShort[month] + '</span>' :
            "<a role='button' class='oj-enabled" + (selectedDate ? ' oj-selected' : '') + // highlight selected day
            "' " + (dayOverClass ? '' : "tabindex='-1' ") +
            " onclick='return false;' href='#'>" + monthNamesShort[month] + '</a>')) +
          '</td>';// display selectable date
        printDate.setMonth(printDate.getMonth() + 1);
      }
      calender += tbody + '</tr>';
    }
    calender += '</tbody></table>';

    html += calender;

    html += footerLayout;
    return { html: html, dayOverId: dayOverId };
  },

  /**
   * Generate the HTML for the current state of the date picker.
   *
   * @private
   */
  _generateYearHTMLContent: function (
    converterUtils, footerLayout, minDateParams,
    maxDateParams, drawMonth, drawYear, valueDate, wDisabled) {
    var dayOverId = '';

    var enablePrev = this._canAdjustDecade(-1, drawYear) && !wDisabled;
    var enableNext = this._canAdjustDecade(+1, drawYear) && !wDisabled;

    var html = '';

    this._maxRows = 4;

    var calender = '';

    calender += this._generateHeader(drawMonth, drawYear, 'all', enablePrev, enableNext);

    calender += "<table class='oj-datepicker-calendar oj-datepicker-yearview" +
      (wDisabled ? ' oj-disabled ' : ' oj-enabled oj-default ') +
      "' tabindex=-1 data-handler='calendarKey' data-event='keydown' aria-readonly='true' role='grid' " +
      "aria-labelledby='" + this._GetSubId(drawYear + '_' + drawMonth + '_' + this._CALENDAR_DESCRIPTION_ID) + "'>";

    calender += "<tbody role='presentation'>";

    var yearRange = this._getYearRange(drawYear, minDateParams, maxDateParams);
    var baseYear = (Math.floor(drawYear / 10) * 10);
    var printDate = new Date(baseYear, drawMonth, 1);
    for (var dRow = 0; dRow < 4; dRow++) {
      // create date picker rows
      calender += "<tr role='row'>";

      var tbody = '';
      for (var dow = 0; dow < 3; dow++) {
        if (dRow === 3 && dow === 1) {
          break;
        }

        var year = baseYear + (dRow * 3) + dow;
        // create date picker days
        var selected = printDate.getFullYear() === valueDate.getFullYear();
        var rowCellId = 'oj-dp-' + this.uuid + '-' + dRow + '-' + dow + '-' + 0 + '-' + 0;
        var dayOverClass = (year === this._currentYear);
        var dayOverClassStr;
        if (dayOverClass) {
          dayOverId = rowCellId;
          dayOverClassStr = ' ' + this._DAYOVER_CLASS;
        } else {
          dayOverClassStr = '';
        }

        var selectedDate = printDate.getFullYear() === valueDate.getFullYear();
        var yearText =
            yearDisplay.format(converterUtils.dateToLocalIso(new Date(year, drawMonth, 1)));

        var unselectable = (year < yearRange.startYear || year > yearRange.endYear);

        tbody += "<td role='gridcell' aria-disabled='" + !!unselectable +
          "' aria-selected='" + selected + "' id='" + rowCellId + "' " +
          "class='" + (dayOverClassStr) + // highlight selected day
          (unselectable || wDisabled ? ' ' +
           this._UNSELECTABLE_CLASS + ' oj-disabled' : ' oj-enabled ') + // highlight unselectable days
          (selected ? ' ' + this._CURRENT_CLASS : '') + "'" + // highlight selected day
          (unselectable ? '' : " data-handler='selectYear' data-event='click' data-month='" +
           printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + '>' + // actions
          ((unselectable || wDisabled ? "<span class='oj-disabled'>" +
            yearText + '</span>' : "<a role='button' class='oj-enabled" +
            (selectedDate ? ' oj-selected' : '') + // highlight selected day
            "' " + (dayOverClass ? '' : "tabindex='-1' ") +
            " onclick='return false;' href='#'>" +
            yearText + '</a>')) + '</td>';// display selectable date
        printDate.setFullYear(printDate.getFullYear() + 1);
      }
      calender += tbody + '</tr>';
    }
    calender += '</tbody></table>';

    html += calender;

    html += footerLayout;
    return { html: html, dayOverId: dayOverId };
  },

  /**
   * Determine the selectable years.
   *
   * @private
   */
  _getYearRange: function (drawYear, minDateParams, maxDateParams) {
    var years = this.options.datePicker.yearRange.split(':');
    var thisYear = new Date().getFullYear();

    function determineYear(value) {
      var parsedYear;
      if (value.match(/c[+-].*/)) {
        parsedYear = drawYear + parseInt(value.substring(1), 10);
      } else if (value.match(/[+-].*/)) {
        parsedYear = thisYear + parseInt(value, 10);
      } else {
        parsedYear = parseInt(value, 10);
      }

      return (isNaN(parsedYear) ? thisYear : parsedYear);
    }
    var year = determineYear(years[0]);
    var endYear = Math.max(year, determineYear(years[1] || ''));
    year = (minDateParams ? Math.max(year, minDateParams.fullYear) : year);
    endYear = (maxDateParams ? Math.min(endYear, maxDateParams.fullYear) : endYear);

    return { startYear: year, endYear: endYear };
  },

  /**
   * Determine the number of months to show.
   *
   * @private
   */
  _getNumberOfMonths: function () {
    var numMonths = this.options.datePicker.numberOfMonths;
    numMonths = typeof numMonths === 'string' ? parseInt(numMonths, 10) : numMonths;
    if (numMonths == null) {
      return [1, 1];
    } else if (typeof numMonths === 'number') {
      return [1, numMonths];
    }
    return numMonths;
  },

  /**
   * Find the number of days in a given month.
   *
   * @private
   */
  _getDaysInMonth: function (year, month) {
    return 32 - new Date(year, month, 32).getDate();
  },

  /**
   * Find the day of the week of the first of a month.
   *
   * @private
   */
  _getFirstDayOfMonth: function (year, month) {
    return new Date(year, month, 1).getDay();
  },

  /**
   * Determines if we should allow a "next/prev" month display change.
   *
   * @private
   */
  _canAdjustMonth: function (offset, curYear, curMonth) {
    var numMonths = this._getNumberOfMonths();
    var date = new Date(curYear,
                        curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]),
                        1);

    if (offset < 0) {
      date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
    }
    return this._isInRange(date);
  },

  /**
   * Determines if we should allow a "next/prev" year display change.
   *
   * @private
   */
  _canAdjustYear: function (offset, curYear) {
    var date;

    if (offset < 0) {
      date = new Date(curYear + offset, 12, 1);
      date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
    } else {
      date = new Date(curYear + offset, 1, 1);
    }
    return this._isInRange(date);
  },

  /**
   * Determines if we should allow a "next/prev" decade display change.
   *
   * @private
   */
  _canAdjustDecade: function (offset, curYear) {
    var date;
    var baseYear = (Math.floor(curYear / 10) * 10);

    if (offset < 0) {
      date = new Date(baseYear + 9 + (offset * 10), 12, 1);
      date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
    } else {
      date = new Date(baseYear + (offset * 10), 1, 1);
    }
    return this._isInRange(date);
  },

  /**
   * Returns a boolean of whether the print date is outside the min + max range, ignoring time since if of
   * ojInputDateTime should allow selection of date and restrict based on ojInputTime.
   *
   * @private
   */
  _outSideMinMaxRange: function (printDate, minDateParams, maxDateParams) {
    var minDate = minDateParams ?
        new Date(minDateParams.fullYear, minDateParams.month, minDateParams.date) : null;
    var maxDate = maxDateParams ?
        new Date(maxDateParams.fullYear, maxDateParams.month, maxDateParams.date) : null;

    return (minDate !== null && printDate < minDate) || (maxDate !== null && printDate > maxDate);
  },

  /**
   * Is the given date in the accepted range?
   *
   * @param {Object} date constructed using local; however need to compare with min + max using their timezone
   * @private
   */
  _isInRange: function (date) {
    var converter = this._GetConverter();
    var minDate;
    var maxDate;
    var minDateIso = this._getMinMaxDateIso('min');
    var minYear = null;
    var maxDateIso = this._getMinMaxDateIso('max');
    var maxYear = null;
    var years = this.options.datePicker.yearRange;

    if (years) {
      var yearSplit = years.split(':');
      var currentYear = new Date().getFullYear();
      minYear = parseInt(yearSplit[0], 10);
      maxYear = parseInt(yearSplit[1], 10);
      if (yearSplit[0].match(/[+-].*/)) {
        minYear += currentYear;
      }
      if (yearSplit[1].match(/[+-].*/)) {
        maxYear += currentYear;
      }
    }

    if (minDateIso) {
      // need to convert it to the same timezone as the value, since the calendar and etc
      // all work by using string manipulation of the isoString
      minDateIso = converter.parse(minDateIso);
      var minDateParams = this._validateDatetime(minDateIso,
                                                   ['fullYear', 'month', 'date'], true);
      minDate = new Date(minDateParams.fullYear, minDateParams.month, minDateParams.date);
    }
    if (maxDateIso) {
      maxDateIso = converter.parse(maxDateIso);
      var maxDateParams = this._validateDatetime(maxDateIso,
                                                   ['fullYear', 'month', 'date'], true);
      maxDate = new Date(maxDateParams.fullYear, maxDateParams.month, maxDateParams.date);
    }

    return ((!minDate || date.getTime() >= minDate.getTime()) &&
            (!maxDate || date.getTime() <= maxDate.getTime()) &&
            (!minYear || date.getFullYear() >= minYear) &&
            (!maxYear || date.getFullYear() <= maxYear));
  },

  /**
   * @protected
   * @override
   * @instance
   * @ignore
   * @memberof! oj.ojInputDate
   */
  _GetCalendarTitle: function () {
    return this._EscapeXSS(this.getTranslatedString('tooltipCalendar' +
                                                    (this.options.disabled ? 'Disabled' : '')));
  },

  /**
   * To disable or enable the widget
   *
   * @private
   * @instance
   */
  _disableEnable: function (val) {
    if (this._triggerNode) {
      disableEnableSpan(this._triggerNode[0].children, val);
      this._triggerNode.find('.' + this._TRIGGER_CALENDAR_CLASS).attr('title',
                                                                      this._GetCalendarTitle());
    }

    if (val) {
      this._hide(this._ON_CLOSE_REASON_CLOSE);
    }

    // need to update the look, note that if it is displaying the datepicker dropdown it would be hidden in _setOption function
    if (this._isInLine) {
      this._updateDatepicker();
    }
  },

  /**
   * Invoke super only if it is not inline
   *
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   */
  _AppendInputHelper: function () {
    if (!this._isInLine && this.options.readOnly !== true) {
      this._superApply(arguments);
    }
  },

  /**
   * This handler will set the value from the input text element.
   *
   * @ignore
   * @protected
   * @override
   * @param {Event} event
   * @instance
   * @memberof! oj.ojInputDate
   */
  // eslint-disable-next-line no-unused-vars
  _onBlurHandler: function (event) {
    if (this._isInLine) {
      return;
    }

    this._superApply(arguments);
  },

  /**
   * This handler will be invoked when keydown is triggered for this.element. When is of inline ignore the keydowns
   *
   * @ignore
   * @protected
   * @override
   * @param {Event} event
   * @instance
   * @memberof! oj.ojInputDate
   */
  _onKeyDownHandler: function (event) {
    if (this._isInLine) {
      return undefined;
    }

    this._superApply(arguments);

    var kc = $.ui.keyCode;
    var handled = false;

    if (this._datepickerShowing()) {
      switch (event.keyCode) {
        case kc.TAB:
          this._hide(this._ON_CLOSE_REASON_TAB);
          break;
        case kc.ESCAPE:
          this._hide(this._ON_CLOSE_REASON_CANCELLED);
          handled = true;
          break;
        case kc.UP:
        case kc.DOWN:
          // when entering the datepicker via the up/down arrows, we should put the focus on the
          // current day, which will be the only tabbable stop.  This also helps an IE11 bug that
          // wasn't allowing tabbing to different elements in the popup ().
          // This also fixes an unreported issue of needing to tab an extra time before it tabs to
          // the next tab stop (all browsers).
          var datePickerCalElem = this._dpDiv.find('.oj-datepicker-calendar')[0];
          var tabStop = oj.FocusUtils.focusFirstTabStop(datePickerCalElem);
          // if we don't find a tab stop, we'll focus on the whole calendar like before.
          if (!tabStop) {
            datePickerCalElem.focus();
          }

          handled = true;
          break;
        default:
      }
    } else {
      switch (event.keyCode) {
        case kc.UP:
        case kc.DOWN:
          this._SetValue(this._GetDisplayValue(), event);
          this.show();
          handled = true;
          break;
        default:
      }
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    return undefined;
  },

  /**
   * Ignore for when of inline, since then this.element would be of div and has a funky nature
   *
   * @param {String} displayValue of the new string to be displayed
   *
   * @memberof! oj.ojInputDate
   * @instance
   * @protected
   * @override
  */
  // eslint-disable-next-line no-unused-vars
  _SetDisplayValue: function (displayValue) {
    if (!this._isInLine) {
      this._superApply(arguments);
    }

    this._setCurrentDate(this._getDateIso());

    // so this is a change in behavior from original design. Previously it was decided that app developer
    // would have to invoke refresh to render the calendar after setting the new value programatically; however now it is
    // required to hook it in when _SetDisplayValue is invoked [can't use _SetValue b/c that function is not invoked
    // when developer invokes ("option", "value", oj.IntlConverterUtils.dateToLocalIso(new Date()))
    if (this._datepickerShowing()) {
      // _SetDisplayValue is called after user picks a date from picker, we dont want to bring
      //  focus to input element if the picker is showing still for the non-inline case. For the
      //  case of inline date picker, if the time picker field already had focus (brought in when
      //  the picker was hidden), we want to update the date picker, but not set focus on it.
      var focusOnCalendar = !(this._isInLine && this._timePicker &&
                              this._timePicker[0] === document.activeElement);
      this._updateDatepicker(focusOnCalendar);
    }
  },

  /**
   * Need to override since apparently we allow users to set the converter to null, undefined, and etc and when
   * they do we use the default converter
   *
   * @return {Object} a converter instance or null
   *
   * @memberof! oj.ojInputDate
   * @instance
   * @protected
   * @override
   */
  _GetConverter: function () {
    return this.options.converter ?
      this._superApply(arguments) :
      $.oj.ojInputDate.prototype.options.converter;
  },

  /**
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   */
  _GetElementValue: function () {
    return this.options.value || '';
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   * @return {string}
   */
  _GetDefaultStyleClass: function () {
    return 'oj-inputdate';
  },

  /**
   * Sets up the default dateTimeRange and dateRestriction validators.
   *
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDate
   */
  _GetImplicitSyncValidators: function () {
    var ret = this._superApply(arguments);

    if (this.options.min != null || this.options.max != null) {
      // need to alter how the default validators work as validators are now immutable
      this._datePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE] =
        this._getValidator('min');
    }

    if (this.options.dayFormatter != null) {
      this._datePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION] =
        this._getValidator('dayFormatter');
    }

    return $.extend(this._datePickerDefaultValidators, ret);
  },

  /**
   * Notifies the component that its subtree has been removed from the document programmatically after the component has
   * been created
   * @memberof! oj.ojInputDate
   * @instance
   * @protected
   */
  _NotifyDetached: function () {
    this._hide(this._ON_CLOSE_REASON_CLOSE);

    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
    this._superApply(arguments);
  },

  /**
   * Notifies the component that its subtree has been made hidden programmatically after the component has
   * been created
   * @memberof! oj.ojInputDate
   * @instance
   * @protected
   */
  _NotifyHidden: function () {
    this._hide(this._ON_CLOSE_REASON_CLOSE);

    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
    this._superApply(arguments);
  },

  _getValidator: function (key) {
    var validator = null;

    if (key === 'min' || key === 'max') {
      validator = getImplicitDateTimeRangeValidator(this.options,
                                                    this._GetConverter(),
                                                    this._GetDefaultStyleClass());
    } else if (key === 'dayFormatter') {
      var dateRestrictionOptions = {
        dayFormatter: this.options.dayFormatter,
        converter: this._GetConverter()
      };

      $.extend(dateRestrictionOptions, this.options.translations.dateRestriction || {});
      validator =
        oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION)
        .createValidator(dateRestrictionOptions);
    }

    return validator;
  },

  /**
   * Gets today's date w/o time
   *
   * @private
   * @return {Object} date
   */
  _getTodayDate: function () {
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  },

  /**
   * Retrieve the default date shown on opening.
   *
   * @private
   */
  _getDateIso: function () {
    var value = this.options.value || this._getDefaultIsoDate();
    if (this._isDateTimeSwitcher() && this._switcherDateValue) {
      value = this._switcherDateValue;
    }
    return value;
  },

  // @inheritdoc
  getNodeBySubId: function (locator) {
    var node = null;
    var subId = locator && locator.subId;
    var dpDiv = this._dpDiv;
    var dpContentDiv = this._getDatepickerContent();

    if (subId) {
      switch (subId) {
        case 'oj-datepicker-content': node = dpContentDiv[0]; break;
        case 'oj-inputdatetime-calendar-icon': node = $('.oj-inputdatetime-calendar-icon', this._triggerNode)[0]; break;
        case 'oj-datepicker-prev-icon': node = $('.oj-datepicker-prev-icon', dpDiv)[0]; break;
        case 'oj-datepicker-next-icon': node = $('.oj-datepicker-next-icon', dpDiv)[0]; break;
        case 'oj-datepicker-month': node = $('.oj-datepicker-month', dpDiv)[0]; break;
        case 'oj-datepicker-year': node = $('.oj-datepicker-year', dpDiv)[0]; break;
        case 'oj-datepicker-current': node = $('.oj-datepicker-current', dpDiv)[0]; break;
        case 'oj-inputdatetime-date-input': node = this._isInLine ? null : this.element[0]; break;
        default: node = null;
      }
    }

    // Non-null locators have to be handled by the component subclasses
    return node || this._superApply(arguments);
  },

  // @inheritdoc
  getSubIdByNode: function (node) {
    var dpDiv = this._dpDiv;
    var subId = null;
    var checks = [
      { selector: '.oj-inputdatetime-calendar-icon', ele: this._triggerNode },
      { selector: '.oj-datepicker-prev-icon', ele: dpDiv },
      { selector: '.oj-datepicker-next-icon', ele: dpDiv },
      { selector: '.oj-datepicker-month', ele: dpDiv },
      { selector: '.oj-datepicker-year', ele: dpDiv },
      { selector: '.oj-datepicker-current', ele: dpDiv }
    ];

    if (node === dpDiv[0]) {
      return 'oj-datepicker-content';
    }
    if (!this._isInLine && node === this.element[0]) {
      return 'oj-inputdatetime-date-input';
    }

    for (var i = 0, j = checks.length; i < j; i++) {
      var map = checks[i];
      var entry = $(map.selector, map.ele);

      if (entry.length === 1 && entry[0] === node) {
        subId = map.selector.substr(1);
        break;
      }
    }

    return subId || this._superApply(arguments);
  },

  /**
   * Hides the datepicker. Note that this function is a no-op when renderMode is 'native'.
   *
   * @expose
   * @memberof oj.ojInputDate
   * @instance
   * @return {void}
   */
  hide: function () {
    return this._hide(this._ON_CLOSE_REASON_CLOSE);
  },

  /**
   * Hides the datepicker
   *
   * @param {string} reason - the reason that the popup is being hidden ("selection", "cancelled", "tab")
   *
   * @protected
   * @ignore
   */
  _hide: function (reason) {
    if (!isPickerNative(this) && this._datepickerShowing() && !this._isInLine) {
      this._popUpDpDiv.ojPopup('close');
      this._onClose(reason);
    }

    return this;
  },

  /**
   * Sets focus to the right place after the picker is closed
   *
   * @param {string} reason - the reason that the popup is being hidden ("selection", "cancelled", "tab")
   *
   * @protected
   * @ignore
   */
  // eslint-disable-next-line no-unused-vars
  _onClose: function (reason) {
    if (this._isMobile && this.options.datePicker.showOn === 'focus') {
      this._inputContainer.focus();
    } else {
      if (this.options.datePicker.showOn === 'focus') {
        this._ignoreShow = true;
      }
      this.element.focus();
    }
  },

  /**
   * Refreshes the element. Usually called after dom changes have been made.
   * @expose
   * @memberof oj.ojInputDate
   * @instance
   * @return {void}
   */
  refresh: function () {
    if (this._triggerNode) {
      this._triggerNode.find('.' + this._TRIGGER_CALENDAR_CLASS).attr('title', this._GetCalendarTitle());
    }
    return this._superApply(arguments) || this;
  },

  /**
   * Shows the datepicker
   *
   * @expose
   * @memberof oj.ojInputDate
   * @instance
   * @return {void}
   */
  show: function () {
    if (this._datepickerShowing() || this.options.disabled || this.options.readOnly) {
      return;
    }

    if (this._ignoreShow) {
      // set within hide or elsewhere and focus is placed back on this.element
      this._ignoreShow = false;
      return;
    }

    if (isPickerNative(this)) {
      // our html picker is inside popup, which will take care of removing focus from input element,
      //  for native case we do it explicitly
      this.element.blur();

      // picker expects the fields like 'date' and 'mode' to retain its names. Use bracket notation
      //  to avoid closure compiler from renaming them
      var pickerOptions = {};
      pickerOptions.date = _getNativePickerDate(this._getNativeDatePickerConverter(),
                                                this._getDateIso());
      pickerOptions.mode = 'date';

      this._ShowNativeDatePicker(pickerOptions);
    } else {
      this._ShowHTMLDatePicker();
    }
  },

  /**
   * TODO: Technically i think should be used for the calendar, but later since late in release
   * @ignore
   */
  _getNativeDatePickerConverter: function () {
    if (this._nativePickerConverter === null) {
      var resolvedOptions = this._GetConverter().resolvedOptions();
      var options = {};
      $.extend(options, resolvedOptions, { isoStrFormat: 'offset' });

      this._nativePickerConverter =
        oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
        .createConverter(options);
    }

    return this._nativePickerConverter;
  },

  /**
   * Shows the native datepicker
   *
   * @protected
   * @memberof! oj.ojInputDate
   * @instance
   */
  _ShowNativeDatePicker: function (pickerOptions) {
    var minDate = this._getMinMaxDateIso('min');
    var maxDate = this._getMinMaxDateIso('max');
    var conv = this._getNativeDatePickerConverter();

    if (minDate) {
      // eslint-disable-next-line no-param-reassign
      pickerOptions.minDate = _getNativePickerDate(conv, minDate).valueOf();
    }

    if (maxDate) {
      // eslint-disable-next-line no-param-reassign
      pickerOptions.maxDate = _getNativePickerDate(conv, minDate).valueOf();
    }

    var self = this;

    // onError is called only for Android for cases where picker is cancelled, or if there were
    //  to be any error at the native picker end
    function onError(error) {
      self._nativePickerShowing = false;

      // if user cancels the picker dialog, we just bring the focus back
      // closure compiler renames 'startsWith', using bracket notation hence
      if (error.startsWith('cancel')) {
        self._onClose(self._ON_CLOSE_REASON_CANCELLED);
      } else {
        Logger.log('Error: native date or time picker failed: ' + error);
      }
    }

    self._nativePickerShowing = true;

    // datePicker is variable at the top level available when the cordova date picker plugin is
    //  included.
    window.datePicker.show(pickerOptions, $.proxy(this._OnDatePicked, this), onError);
  },

  /**
   * callback upon picking date from native picker
   *
   * @protected
   * @memberof! oj.ojInputDate
   * @instance
   */
  _OnDatePicked: function (date) {
    this._nativePickerShowing = false;

    // for iOS and windows, from the current implementation of the native datepicker plugin,
    //  for case when the picker is cancelled, this callback gets called without the parameter
    if (date) {
      // Explicitly setting timezone is supported only in iOS, and we do not have a need to do
      //  so at this time, so not exposing this feature for now.
      // The native date picker will preserve the timezone set on the supplied date upon returning,
      // however the returned value has its time part reset to 00:00 when in 'date' mode
      //  - need to copy time over hence
      var isoString = this._validateDatetime(this._getDateIso(), {
        month: date.getMonth(),
        date: date.getDate(),
        fullYear: date.getFullYear() });
      var formattedTime = this._GetConverter().format(isoString);

      // _SetValue will inturn call _SetDisplayValue
      this._SetValue(formattedTime, {});
    }

    this._onClose(this._ON_CLOSE_REASON_SELECTION);
  },
  /**
   * @protected
   * @param {string} isoString isoString that may not be a complete isoString
   * @param {Array|Object} actionParam list of option parameters
   * @param {boolean=} doParseValue whether one should parseInt the value during the get request
   * @returns {string} returns a valid isoString or a default isostring
   * @since 6.1
   * @ignore
   * @memberof oj.ojInputDate
   */
  _validateDatetime: function (isoString, actionParam, doParseValue) {
    var valueParams;
    try {
      valueParams = __ValidationBase.IntlConverterUtils._dateTime(isoString,
                    actionParam, doParseValue);
    } catch (e) {
      Logger.info('The value of the InputDate element should be an ISOString, please use a valid ISOString');
      valueParams = __ValidationBase.IntlConverterUtils._dateTime(this._getDefaultIsoDate(),
                    actionParam, doParseValue);
    }
    return valueParams;
  },

  /**
   * Shows the HTML datepicker
   *
   * @ignore
   * @protected
   * @memberof oj.ojInputDate
   */
  _ShowHTMLDatePicker: function () {
    var rtl = this._IsRTL();

    this._switcherPrevValue = this._getDateIso();
    this._switcherPrevDay = this._currentDay;
    this._switcherPrevMonth = this._currentMonth;
    this._switcherPrevYear = this._currentYear;

    // to avoid flashes on Firefox
    this._getDatepickerContent().empty();
    this._updateDatepicker();

    if (!_isLargeScreen) {
      this._popUpDpDiv.ojPopup('open', this.element.parent(), {
        my: { horizontal: 'center', vertical: 'bottom' },
        at: { horizontal: 'center', vertical: 'bottom' },
        of: window,
        collision: 'flipfit flipfit'
      });

      // if we don't have a large screen, the popup will be modal so
      // we need to give it the focus
      this._dpDiv.find('.oj-datepicker-calendar').focus();
    } else {
      var position = oj.PositionUtils.normalizeHorizontalAlignment({
        my: 'start top',
        at: 'start bottom',
        of: this.element,
        collision: 'flipfit flipfit'
      }, rtl);
      this._popUpDpDiv.ojPopup('open', this.element.parent(), position);
    }

    return this;
  }
});

// Add custom getters for properties
Components.setDefaultOptions(
  {
    ojInputDate:
    {
      firstDayOfWeek: Components.createDynamicPropertyGetter(
      function () {
        return LocaleData.getFirstDayOfWeek();
      }),

      dayWide: Components.createDynamicPropertyGetter(
      function () {
        return LocaleData.getDayNames('wide');
      }),

      dayNarrow: Components.createDynamicPropertyGetter(
      function () {
        return LocaleData.getDayNames('narrow');
      }),

      monthWide: Components.createDynamicPropertyGetter(
      function () {
        return LocaleData.getMonthNames('wide');
      }),

      monthAbbreviated: Components.createDynamicPropertyGetter(
      function () {
        return LocaleData.getMonthNames('abbreviated');
      }),

      datePicker: Components.createDynamicPropertyGetter(
      function () {
        return (ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {})
          .datePicker;
      }),

      renderMode: Components.createDynamicPropertyGetter(
      function () {
        return (ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {})
          .renderMode;
      }),

      keyboardEdit: Components.createDynamicPropertyGetter(
      function () {
        return (ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {})
          .keyboardEdit;
      })
    }
  }
);

// Fragments:

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
 *       <td>Input element and calendar trigger icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>When not inline, shows the grid and moves the focus into the expanded date grid</td>
 *     </tr>
 *     <tr>
 *       <td>Input element with picker open</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Left</kbd></td>
 *       <td>Switch to next month (or previous month on RTL page).</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Right</kbd></td>
 *       <td>Switch to previous month (or next month on RTL page).</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputDate
 */

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
 *       <td>Picker</td>
 *       <td><kbd>Swipe Left</kbd></td>
 *       <td>Switch to next month (or previous month on RTL page).</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Right</kbd></td>
 *       <td>Switch to previous month (or next month on RTL page).</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojDatePicker
 */

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>DownArrow or UpArrow</kbd></td>
 *       <td>Shows the calender grid and moves the focus into the expanded grid</td>
 *     </tr>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Select the currently focused day</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move up in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move down in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move right in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move left in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Move focus to first day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Move focus to last day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Switch to previous month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Switch to next month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageUp</kbd></td>
 *       <td>Switch to previous year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageDown</kbd></td>
 *       <td>Switch to next year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageUp</kbd></td>
 *       <td>Switch to previous by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageDown</kbd></td>
 *       <td>Switch to next by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + T</kbd></td>
 *       <td>Places focus on Today button if it exists.</tr>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputDate
 */

 /**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Select the currently focused day</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move up in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move down in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move right in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move left in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Move focus to first day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Move focus to last day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Switch to previous month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Switch to next month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageUp</kbd></td>
 *       <td>Switch to previous year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageDown</kbd></td>
 *       <td>Switch to next year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageUp</kbd></td>
 *       <td>Switch to previous by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageDown</kbd></td>
 *       <td>Switch to next by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + T</kbd></td>
 *       <td>Places focus on Today button if it exists.</tr>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputDate
 */

/**
 * {@ojinclude "name":"ojStylingDocIntro"}
 * <p>The form control text align style classes can be applied to the component, or an ancestor element. When
 * applied to an ancestor element, all form components that support the text align style classes will be affected.
 *
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
 *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-form-control-text-align-right</td>
 *       <td>Aligns the text to the right regardless of the reading direction.
 *           This is normally used for right aligning numbers
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-form-control-text-align-start</td>
 *       <td>Aligns the text to the left in ltr and to the right in rtl</td>
 *     </tr>
 *     <tr>
 *       <td>oj-form-control-text-align-end</td>
 *       <td>Aligns the text to the right in ltr and to the left in rtl</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
 * @memberof oj.ojInputDate
 */

// ////////////////     SUB-IDS     //////////////////

/**
 * <p>Sub-ID for the InputDate and InputDateTime input element. Note that if element is inline for
 * InputDate it would return null whereas InputDateTime would return the input element of the internally created
 * InputTime element.
 *
 * @ojsubid oj-inputdatetime-date-input
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = myInputDate.getNodeBySubId( {'subId': 'oj-inputdatetime-date-input'} );
 */

/**
 * <p>Sub-ID for the calendar drop down node.
 *
 * @ojsubid oj-datepicker-content
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the calendar drop down node:</caption>
 * // myInputElement is InputDate or InputDateTime.
 * var node = myInputElement.getNodeBySubId( {'subId': 'oj-datepicker-content'} );
 */

/**
 * <p>Sub-ID for the calendar icon that triggers the calendar drop down.
 *
 * @ojsubid oj-inputdatetime-calendar-icon
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the calendar icon that triggers the calendar drop down:</caption>
 * // myInputElement is InputDate or InputDateTime.
 * var node = myInputElement.getNodeBySubId( {'subId': 'oj-inputdatetime-calendar-icon'} );
 */

/**
 * <p>Sub-ID for the previous month icon.
 *
 * @ojsubid oj-datepicker-prev-icon
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the previous month icon:</caption>
 * // myInputElement is InputDate or InputDateTime.
 * var node = myInputElement.getNodeBySubId( {'subId': 'oj-datepicker-prev-icon'} );
 */

/**
 * <p>Sub-ID for the next month icon.
 *
 * @ojsubid oj-datepicker-next-icon
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the next month icon:</caption>
 * // myInputElement is InputDate or InputDateTime.
 * var node = myInputElement.getNodeBySubId( {'subId': 'oj-datepicker-next-icon'} );
 */

/**
 * <p>Sub-ID for the month span or select element.
 *
 * @ojsubid oj-datepicker-month
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the month span or select element:</caption>
 * // myInputElement is InputDate or InputDateTime.
 * var node = myInputElement.getNodeBySubId( {'subId': 'oj-datepicker-month'} );
 */

/**
 * <p>Sub-ID for the year span or select element.
 *
 * @ojsubid oj-datepicker-year
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the year span or select element:</caption>
 * // myInputElement is InputDate or InputDateTime.
 * var node = myInputElement.getNodeBySubId( {'subId': 'oj-datepicker-year'} );
 */

/**
 * <p>Sub-ID for the current/today button for button bar.
 *
 * @ojsubid oj-datepicker-current
 * @memberof oj.ojInputDate
 *
 * @example <caption>Get the current/today button for button bar:</caption>
 * // myInputElement is InputDate or InputDateTime.
 * var node = myInputElement.getNodeBySubId( {'subId': 'oj-datepicker-current'} );
 */

/**
 * Input type for the dayFormatter callback function
 * @typedef {object} oj.ojInputDate.DayFormatterInput
 * @property {number} fullYear
 * @property {number} month
 * @property {number} date
 */
/**
 * Output type for the dayFormatter callback function
 * @typedef {object} oj.ojInputDate.DayFormatterOutput
 * @property {boolean=} disabled
 * @property {string=} className
 * @property {string=} tooltip
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global TimePickerModel:false, coerceIsoString:false, createWheelGroup:false,
   getImplicitDateTimeRangeValidator: false,  _isLargeScreen:false, _getNativePickerDate:false,
   isPickerNative:false, disableEnableSpan:false, resizeLargeScreenChange:false,
   bindActive:false, Components:false, __ValidationBase: false, Logger:false, ThemeUtils */

/**
 * Helper function to split the timeIncrement into its constituents and returns the split object.
 * Used in ojInputTime and ojInputDateTime
 *
 * @ignore
 */
function splitTimeIncrement(timeIncrement) {
  var splitIncrement = timeIncrement.split(':');

  if (splitIncrement.length !== 4) {
    throw new Error('timeIncrement value should be in the format of hh:mm:ss:SSS');
  }

  var increments = {
    hourIncr: parseInt(splitIncrement[0].substring(0), 10),
    minuteIncr: parseInt(splitIncrement[1], 10),
    secondIncr: parseInt(splitIncrement[2], 10),
    millisecondIncr: parseInt(splitIncrement[3], 10)
  };

  var sum = 0;
  var keys = Object.keys(increments);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    sum += increments[key];
  }

  if (sum === 0) {
    throw new Error('timeIncrement must have a non 00:00:00:000 value');
  }

  return increments;
}

/**
 * Helper function to create a timepicker converter
 *
 * @ignore
 * @param {Object} converter
 * @param {Object=} addOpts
 * @return {Object}
 */
function _getTimePickerConverter(converter, addOpts) {
  var resolvedOptions = converter.resolvedOptions();
  var options = {};
  var params = [
    'hour', 'hour12', 'minute', 'second', 'millisecond', 'timeFormat',
    'timeZone', 'timeZoneName', 'isoStrFormat', 'dst'
  ];

  for (var i = 0, j = params.length; i < j; i++) {
    if (params[i] in resolvedOptions) {
      if (params[i] === 'timeFormat') {
        // special case for timeFormat, formatType of time must be added
        options.formatType = 'time';
      }
      options[params[i]] = resolvedOptions[params[i]];
    }
  }

  var testEmpty = {};
  $.extend(testEmpty, options);
  delete testEmpty.isoStrFormat; // since below two are provided even with only date portion
  delete testEmpty.dst;

  if ($.isEmptyObject(testEmpty)) {
    throw new Error('Empty object for creating a time picker converter');
  }

  $.extend(options, addOpts || {});
  return __ValidationBase.Validation
    .converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
    .createConverter(options);
}

/**
 * @ojcomponent oj.ojInputTime
 * @augments oj.inputBase
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojInputTime extends inputBase<string, ojInputTimeSettableProperties>"
 *               },
 *               {
 *                target: "Type",
 *                value: "ojInputTimeSettableProperties extends inputBaseSettableProperties<string>",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @since 0.6
 * @ojstatus preview
 * @ojshortdesc Provides basic support for specifying a time value.
 * @ojrole combobox
 *
 * @classdesc
 * <h3 id="inputTimeOverview-section">
 *   JET InputTime
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputTimeOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET InputTime provides a simple time selection drop down. The time format is based on the converter and default converter uses the locale to determine the
 *    time format. If the <code>lang</code> attribute is specified in the html tag then the converter picks locale based on the <code>lang</code> attribute. If there is
 *    no <code>lang</code> attribute specified then the locale is based on the browser language setting. Default value for locale is "en". For example, if locale is "en-US",
 *    the default for time is 12-hour format and if locale is "fr", the default for time is 24-hour format.</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-input-time>&lt;/oj-input-time></code></pre>
 *
 * {@ojinclude "name":"validationAndMessagingDoc"}
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
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the label to the input element.
 * For InputTime, you should put an <code>id</code> on the element, and then set
 * the <code>for</code> attribute on the label to be the element's id.
 *
 * If there is no oj-label for the InputTime, add aria-label on InputTime
 * to make it accessible.
 * {@ojinclude "name":"accessibilityPlaceholderEditableValue"}
 * {@ojinclude "name":"accessibilityDisabledEditableValue"}
 * </p>
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 */
oj.__registerWidget('oj.ojInputTime', $.oj.inputBase,
  {
    widgetEventPrefix: 'oj',

  // -------------------------------------From base---------------------------------------------------//
    _CLASS_NAMES: 'oj-inputdatetime-input',
    _WIDGET_CLASS_NAMES: 'oj-inputdatetime-time-only oj-component oj-inputdatetime',
    _INPUT_CONTAINER_CLASS: 'oj-inputdatetime-input-container',
    _ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES: '',
    _INPUT_HELPER_KEY: 'inputHelp',
    _ATTR_CHECK: [{ attr: 'type', setMandatory: 'text' }],
    _GET_INIT_OPTIONS_PROPS_FOR_WIDGET: [
      { attribute: 'disabled', validateOption: true },
      { attribute: 'pattern' },
      { attribute: 'title' },
      { attribute: 'placeholder' },
      { attribute: 'value', coerceDomValue: coerceIsoString },
      { attribute: 'required',
        coerceDomValue: true,
        validateOption: true },
      { attribute: 'readonly',
        option: 'readOnly',
        validateOption: true },
      { attribute: 'min', coerceDomValue: coerceIsoString },
      { attribute: 'max', coerceDomValue: coerceIsoString }
    ],
  // -------------------------------------End from base-----------------------------------------------//

    _TIME_PICKER_ID: 'ojInputTime',
    _TRIGGER_CLASS: 'oj-inputdatetime-input-trigger',
    _TRIGGER_TIME_CLASS: 'oj-inputdatetime-time-icon',

    _ON_CLOSE_REASON_SELECTION: 'selection',  // A selection was made
    _ON_CLOSE_REASON_CANCELLED: 'cancelled',  // Selection not made
    _ON_CLOSE_REASON_TAB: 'tab',              // Tab key
    _ON_CLOSE_REASON_CLOSE: 'close',          // Disable or other closes

    _KEYBOARD_EDIT_OPTION_ENABLED: 'enabled',
    _KEYBOARD_EDIT_OPTION_DISABLED: 'disabled',

    options:
    {
    /**
     * Default converter for InputTime
     *
     * If one wishes to provide a custom converter for the InputTime override the factory returned for
     * oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
     * {@ojinclude "name":"inputBaseConverterOptionDoc"}
     * @expose
     * @memberof! oj.ojInputTime
     * @instance
     * @type {Object}
     * @ojsignature  { target: "Type", value: "oj.Converter<string>|oj.Validation.RegisteredConverter",
     *                 jsdocOverride: true}
     * @default oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({"hour": "2-digit", "minute": "2-digit"})
     */
      converter: __ValidationBase.Validation.converterFactory(
        oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
          hour: '2-digit', minute: '2-digit'
        }),

    /**
     * Determines if keyboard entry of the text is allowed.
     * When disabled the picker must be used to select a time.
     *
     * Default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the
     * default is <code class="prettyprint">"disabled"</code> and
     * it's <code class="prettyprint">"enabled"</code> for alta web theme.
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputTime
     * @type {string}
     * @ojvalue {string} "enabled"  Allow keyboard entry of the time.
     * @ojvalue {string} "disabled" Changing the time can only be done with the picker.
     *
     * @example <caption>Initialize the InputTime with the <code class="prettyprint">keyboard-edit</code> attribute specified:</caption>
     * &lt;oj-input-time keyboard-edit='disabled'>&lt;/oj-input-time>
     *
     * @example <caption>Get or set the <code class="prettyprint">keyboardEdit</code> property after initialization:</caption>
     * // getter
     * var keyboardEdit = myInputTime.keyboardEdit;
     *
     * // setter
     * myInputTime.keyboardEdit = 'disabled';
     *
     * @example <caption>Set the default in the theme (SCSS)</caption>
     * $inputDateTimeKeyboardEditOptionDefault: disabled !default;
     */
      keyboardEdit: 'enabled',

    /**
     * The maximum selectable time. When set to null, there is no maximum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputTime
     * @type {string|null}
     * @ojformat time
     * @default null
     *
     * @example <caption>Initialize the InputTime with the <code class="prettyprint">max</code> attribute specified:</caption>
     * &lt;oj-input-time max='T13:30:00.000-08:00'>&lt;/oj-input-time>
     *
     * @example <caption>Get or set the <code class="prettyprint">max</code> property after initialization:</caption>
     * // getter
     * var maxValue = myInputTime.max;
     *
     * // setter
     * myInputTime.max = 'T13:30:00.000-08:00';
     */
      max: undefined,

    /**
     * The minimum selectable time. When set to null, there is no minimum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputTime
     * @type {string|null}
     * @ojformat time
     * @default null
     *
     * @example <caption>Initialize the InputTime with the <code class="prettyprint">min</code> attribute specified:</caption>
     * &lt;oj-input-time min='T08:00:00.000-08:00'>&lt;/oj-input-time>
     *
     * @example <caption>Get or set the <code class="prettyprint">min</code> property after initialization:</caption>
     * // getter
     * var minValue = myInputTime.min;
     *
     * // setter
     * myInputTime.min = 'T08:00:00.000-08:00';
     */
      min: undefined,

    /**
     * JSON data passed when the widget is of ojInputDateTime
     *
     * {
     *  widget : dateTimePickerInstance,
     *  inline: true|false
     * }
     *
     * @expose
     * @memberof! oj.ojInputTime
     * @instance
     * @private
     */
      datePickerComp: null,

    /**
     * <p>Attributes specified here will be set on the picker DOM element when it's launched.
     * <p>The supported attributes are <code class="prettyprint">class</code> and <code class="prettyprint">style</code>, which are appended to the picker's class and style, if any.
     * Note: 1) pickerAttributes is not applied in the native theme.
     * 2) setting this property after element creation has no effect.
     *
     * @property {string=} style
     * @property {string=} class
     *
     * @example <caption>Initialize the inputTime specifying a set of attributes to be set on the picker DOM element:</caption>
     * myInputTime.pickerAttributes = {
     *   "style": "color:blue;",
     *   "class": "my-class"
     * };
     *
     * @example <caption>Get the <code class="prettyprint">pickerAttributes</code> property, after initialization:</caption>
     * // getter
     * var pickerAttrs = myInputTime.pickerAttributes;
     *
     * @expose
     * @memberof! oj.ojInputTime
     * @instance
     * @type {?Object}
     * @default null
     */
      pickerAttributes: null,

    /**
     * Allows applications to specify whether to render time picker in JET or
     * as a native picker control.</br>
     *
     * Default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the
     * default is "native" and it's "jet" for alta web theme.
     *
     * @expose
     * @memberof! oj.ojInputTime
     * @instance
     * @type {string}
     * @ojvalue {string} 'jet' Applications get full JET functionality.
     * @ojvalue {string} 'native' Applications get the functionality of the native picker.</br></br>
     *  Note that the native picker support is limited to Cordova plugin published
     *  at 'https://github.com/VitaliiBlagodir/cordova-plugin-datepicker'.</br></br>
     *  With native renderMode, the functionality that is sacrificed compared to jet renderMode are:
     *    <ul>
     *      <li>Time picker cannot be themed</li>
     *      <li>Accessibility is limited to what the native picker supports</li>
     *      <li>pickerAttributes is not applied</li>
     *      <li>Sub-IDs are not available</li>
     *      <li>hide() function is no-op</li>
     *      <li>translations sub properties pertaining to the picker is not available</li>
     *      <li>'timePicker.timeIncrement' property is limited to iOS and will only take a precision of minutes</li>
     *    </ul>
     *
     * @example <caption>Initialize the InputTime with the <code class="prettyprint">render-mode</code> attribute specified:</caption>
     * &lt;oj-input-time render-mode='native'>&lt;/oj-input-time>
     *
     * @example <caption>Get or set the <code class="prettyprint">renderMode</code> property after initialization:</caption>
     * // getter
     * var renderMode = myInputTime.renderMode;
     *
     * // setter
     * myInputTime.renderMode = 'native';
     *
     * @example <caption>Set the default in the theme (SCSS)</caption>
     * $inputDateTimeRenderModeOptionDefault: native !default;
     */
      renderMode: 'jet',

    /**
     * Note that Jet framework prohibits setting subset of properties which are object types.<br/><br/>
     * For example myInputTime.timePicker = {timeIncrement: "00:30:00:00"}; is prohibited as it will
     * wipe out all other sub-properties for "timePicker" object.<br/><br/> If one wishes to do this [by above syntax or knockout] one
     * will have to get the "timePicker" object, modify the necessary sub-property and pass it to above syntax.<br/><br/>
     * Note that when renderMode is 'native', the only timePicker sub-properties available are showOn and, to a limited extent, timeIncrement.<br/><br/>
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputTime
     * @type {Object}
     *
     * @example <caption>Initialize the component, overriding some time-picker attributes and leaving the others intact:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-input-time time-picker.time-increment='00:10:00:00'>&lt;/oj-input-time>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-input-time time-picker='{"timeIncrement":"00:10:00:00"}'>&lt;/oj-input-time>
     *
     * @example <caption>Get or set the <code class="prettyprint">timePicker</code> property after initialization:</caption>
     * // Get one
     * var value = myComponent.timePicker.showOn;
     *
     * // Set one, leaving the others intact. Use the setProperty API for
     * // subproperties so that a property change event is fired.
     * myComponent.setProperty('timePicker.showOn', 'image');
     *
     * // Get all
     * var values = myComponent.timePicker;
     *
     * // Set all.  Must list every timePicker key, as those not listed are lost.
     * myComponent.timePicker = {
     *     timeIncrement: '00:10:00:00',
     *     showOn: 'image',
     *     footerLayout: 'now'
     * };
     */
      timePicker:
      {
      /**
       * Will dictate what content is shown within the footer of the wheel timepicker.
       *
       * <p>See the <a href="#timePicker">time-picker</a> attribute for usage examples.
       *
       * @expose
       * @name timePicker.footerLayout
       * @memberof! oj.ojInputTime
       * @instance
       * @type {string}
       * @ojvalue {string} '' Do not show anything
       * @ojvalue {string} 'now' Show the now button
       * @default ""
       */
        footerLayout: '',

      /**
       * Time increment to be used for InputTime, the format is hh:mm:ss:SS. <br/><br/>
       * Note that when renderMode is 'native', timeIncrement property is limited to iOS and will only take a precision of minutes.<br/><br/>
       *
       * <p>See the <a href="#timePicker">time-picker</a> attribute for usage examples.
       *
       * @expose
       * @name timePicker.timeIncrement
       * @memberof! oj.ojInputTime
       * @instance
       * @type {string}
       * @default "00:05:00:00"
       */
        timeIncrement: '00:05:00:00',

      /**
       * When the timepicker should be shown.
       *
       * <p>See the <a href="#timePicker">time-picker</a> attribute for usage examples.
       *
       * @expose
       * @name timePicker.showOn
       * @memberof! oj.ojInputTime
       * @instance
       * @type {string}
       * @ojvalue {string} 'focus' when the element receives focus or when the trigger clock image is clicked. When the picker is closed, the field regains focus and is editable.
       * @ojvalue {string} 'image' when the trigger clock image is clicked
       * @default "focus"
       */
        showOn: 'focus'
      }

    // DOCLETS

    /**
     * List of validators used by element along with the implicit component validators
     * when performing validation. Each item is either an
     * instance that duck types {@link oj.Validator}, or is an Object literal containing the
     * properties listed below.
     * <p>
     * Implicit validators are created by the element when certain attributes are present.
     * For example, if the <code class="prettyprint">required</code>
     * attribute is set, an implicit {@link oj.RequiredValidator} is created. If the
     * <code class="prettyprint">min</code> and/or <code class="prettyprint">max</code> attribute
     * is set, an implicit {@link oj.DateTimeRangeValidator} may be created.
     * At runtime when the component runs validation, it
     * combines all the implicit validators with all the validators
     * specified through this <code class="prettyprint">validators</code> attribute, and runs
     * all of them.
     * </p>
     * <p>
     * Hints exposed by validators are shown in the notewindow by default, or as determined by the
     * 'validatorHint' property set on the <code class="prettyprint">displayOptions</code>
     * property.
     * </p>
     *
     * <p>
     * When <code class="prettyprint">validators</code> property changes due to programmatic
     * intervention, the element may decide to clear messages and run validation, based on the
     * current state it is in. </br>
     *
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>The cached list of validator instances are cleared and new validator hints is pushed to
     * messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if element is valid when validators changes, element does nothing other than the
     * steps it always performs.</li>
     * <li>if element is invalid and is showing messages when
     * <code class="prettyprint">validators</code> changes then all element messages are cleared
     * and full validation run using the display value on the element.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event to clear custom errors.</li>
     * </ul>
     * </li>
     * <li>if element is invalid and has deferred messages when validators changes, it does
     * nothing other than the steps it performs always.</li>
     * </ul>
     * </p>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the element are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     * </p>
     *
     * @property {string} type - the validator type that has a {@link oj.ValidatorFactory} that can
     * be retrieved using the {@link oj.Validation} module. For a list of supported validators refer
     * to {@link oj.ValidatorFactory}. <br/>
     * @property {Object=} options - optional Object literal of options that the validator expects.
     *
     * @example <caption>Initialize the element with validator object literal:</caption>
     * myInputTime.validators = [{
     *     type: 'dateTimeRange',
     *     options : {
     *       max: 'T14:30:00',
     *       min: 'T02:30:00'
     *     }
     *   }];
     *
     *
     * @example <caption>Initialize the element with multiple validator instances:</caption>
     * var validator1 = new MyCustomValidator({'foo': 'A'});
     * var validator2 = new MyCustomValidator({'foo': 'B'});
     * myInputTime.value = 10;
     * myInputTime.validators = [validator1, validator2];
     *
     * @expose
     * @name validators
     * @instance
     * @memberof oj.ojInputTime
     * @ojsignature  { target: "Type",
     *   value: "Array<oj.Validator<string>|oj.Validation.RegisteredValidator>|null",
     *   jsdocOverride: true}
     * @type {Array.<Object>}
     * @default []
     */

    /**
     * The value of the InputTime which should be an ISOString.
     *
     * @example <caption>Initialize the element with the <code class="prettyprint">value</code> attribute:</caption>
     * &lt;oj-input-time value='T10:30:00.000'&gt;&lt;/oj-input-time&gt;
     * @example <caption>Initialize the element with the <code class="prettyprint">value</code> property specified programmatically
     * using oj.IntlConverterUtils.dateToLocalIso :</caption>
     * myInputTime.value = oj.IntlConverterUtils.dateToLocalIso(new Date());<br/>
     * @example <caption>Get or set the <code class="prettyprint">value</code> property, after initialization:</caption>
     * // Getter: returns Today's date in ISOString
     * myInputTime.value;
     * // Setter: sets it to a different date
     * myInputTime.value = "T20:00:00-08:00";
     *
     * @expose
     * @name value
     * @type {string}
     * @ojformat time
     * @instance
     * @ojwriteback
     * @memberof! oj.ojInputTime
     */

    // Events

    },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputTime
   */
    _InitOptions: function (originalDefaults, constructorOptions) {
      this._super(originalDefaults, constructorOptions);
    // when it is of ojInputDateTime component, do not initialize values from dom node since it's an empty input node if inline or
    // if not inline the values should be taken care of by ojInputDateTime. Note that option values would have been passed by
    // ojInputDateTime
      if (this.options.datePickerComp === null && !this._IsCustomElement()) {
        oj.EditableValueUtils.initializeOptionsFromDom(this._GET_INIT_OPTIONS_PROPS_FOR_WIDGET,
                                                       constructorOptions, this);
      }
    },

    _getPrependNode: function () {
      return this._isIndependentInput() ?
        $('body') :
        $('.oj-popup-content', this._datePickerComp.widget._popUpDpDiv.ojPopup('widget'));
    },

  /**
   * @ignore
   */
    _InitBase: function () {
      this._timePickerDefaultValidators = {};
      this._datePickerComp = this.options.datePickerComp;
      this._inputContainer = null;
      this._redirectFocusToInputContainer = false;
      this._isMobile = false;

    // only case is when of showOn of focus and one hides the element [need to avoid showing]
      this._ignoreShow = false;

    // need this flag to keep track of native picker opened, there is no callback on native API
    //  to find out otherwise.
      this._nativePickerShowing = false;

      if (this.options.readOnly !== true) {
        this._createWheelPicker();
      }
    // I want to wrap the inputTime if it is all by itself, or if it is
    // part of the inline inputDateTime component which is the inline date stacked on top of an
    // inputTime. The inline error messages will go under the inputTime part. TODO: how?
    // right now the destroy fails because I am whacking away something.. the dom.
      if (this._isIndependentInput()) {
        this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES += this._INPUT_CONTAINER_CLASS;
      }
    },

    _createWheelPicker: function () {
      var pickerAttrs = this.options.pickerAttributes;

      var wheelPicker = document.createElement('div');
      wheelPicker.className = 'oj-timepicker-popup';
      wheelPicker.style.display = 'none';
      var div = document.createElement('div');
      div.id = this._GetSubId(this._TIME_PICKER_ID);
      div.className = 'oj-timepicker-content';
      wheelPicker.appendChild(div);
      this._wheelPicker = $(wheelPicker);
      var prependNode = this._getPrependNode()[0];
      prependNode.insertBefore(wheelPicker, prependNode.firstElementChild); // @HTMLUpdateOK

      if (this._isIndependentInput()) {
      // DISABLE FOR NOW, as animation is coming quite clunky (not sure if the css of popup or of animation)
      // var animation = _isLargeScreen ? {"open": null, "close": null} : {"close": null};
        var animation = { open: null, close: null };

        this._popUpWheelPicker = this._wheelPicker.ojPopup(
          {
            initialFocus: 'none',
            role: 'dialog',
            chrome: 'default',
            modality: _isLargeScreen ? 'modeless' : 'modal',
            open: function () {
            },
            beforeClose: function () {
            },
            animateStart: function (event, ui) {
              if (ui.action === 'open') {
                event.preventDefault();
                // eslint-disable-next-line no-undef
                AnimationUtils.slideIn(ui.element, {
                  offsetY: ui.element.offsetHeight + 'px'
                }).then(ui.endCallback);
              }
            },
            animation: animation
          }).attr('data-oj-internal', ''); // mark internal component, used in Components.getComponentElementByNode;
        this.element.attr('data-oj-popup-' + this._popUpWheelPicker.attr('id') + '-parent', ''); // mark parent of pop up

        if (pickerAttrs) {
          oj.EditableValueUtils.setPickerAttributes(this._popUpWheelPicker.ojPopup('widget'),
                                                    pickerAttrs);
        }
      }
    },

    _timepickerShowing: function () {
      var picker;
      if (this._isIndependentInput()) {
        picker = this._popUpWheelPicker;
        return (picker && Components.isComponentInitialized(picker, 'ojPopup') &&
                picker.ojPopup('isOpen')) ||
          this._nativePickerShowing;
      }

      var widget = this._datePickerComp.widget;
      picker = widget._popUpDpDiv;
      return (widget._isShowingDatePickerSwitcher() &&
              Components.isComponentInitialized(picker, 'ojPopup') &&
              picker.ojPopup('isOpen')) ||
        this._nativePickerShowing;
    },

    /**
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojInputTime
     */
    _ComponentCreate: function () {
      this._InitBase();

      var ret = this._superApply(arguments);

      if (this._isContainedInDateTimePicker() && !this._isDatePickerInline()) {
        // set to nothing since then of not inline and don't want to place two component classes to
        // the same input element
        this._CLASS_NAMES = '';
      } else {
        // if isoString has a different timezone then the one provided in the converter, need to perform
        // conversion so pass it through the method
        if (this.options.value) {
          var formatted = this._GetConverter().format(this.options.value);
          this._SetValue(formatted, {});
        }

        // active state handler, only in case time picker is independent
        bindActive(this);
      }

      this._processReadOnlyKeyboardEdit();

      if (this.options.readOnly !== true) {
        if (this._isIndependentInput()) {
          this._attachTrigger();
        }
      }

      return ret;
    },
    _validateTime: function (isoString, actionParam, doParseValue) {
      var valueParams;
      try {
        valueParams = __ValidationBase.IntlConverterUtils._dateTime(isoString,
                    actionParam, doParseValue);
      } catch (e) {
        Logger.info('The value of the InputTime element should be an ISOString, please use a valid ISOString');
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        var defaultDate = __ValidationBase.IntlConverterUtils.dateToLocalIso(date);
        valueParams = __ValidationBase.IntlConverterUtils._dateTime(defaultDate,
                    actionParam, doParseValue);
      }
      return valueParams;
    },


    /**
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojInputTime
     */
    _AfterCreate: function () {
      var ret = this._superApply(arguments);

      if (this._isIndependentInput()) {
        if (this.options.readOnly !== true) {
          disableEnableSpan(this._triggerNode[0].children, this.options.disabled);
        }

        var LId;
        if (!this._IsCustomElement()) {
          var label = this.$label;
          if (this._inputContainer && label && label.length === 1) {
            LId = label.attr('id');

          // The label should always have a generated ID, so no need to check here.
            this._inputContainer.attr('aria-labelledby', LId);
          }
        } else if (this._inputContainer) {
          var defaultLabelId = this.uuid + '_Label';
          LId = oj.EditableValueUtils.getOjLabelId(this.widget(), defaultLabelId);
          if (LId) {
            this._inputContainer.attr('aria-labelledby', LId);
          }
        }
      }

      return ret;
    },

  /**
   * @ignore
   * @protected
   * @override
   */
    _setOption: function (key, value, flags) {
      var retVal = null;
      var footer;

      // When a null, undefined, or "" value is passed in set to null for consistency
      // note that if they pass in 0 it will also set it null
      if (key === 'value') {
        if (!value) {
          // eslint-disable-next-line no-param-reassign
          value = null;
        }

        retVal = this._super(key, value, flags);

        this._createWheelPickerDom(true);

        return retVal;
      } else if (key === 'timePicker' && value.footerLayout === undefined) {
        // set options on the timePicker wipe out the footerLayout settings
        // save footerLayout and restore after superApply
        footer = this.options.timePicker.footerLayout;
      }

      retVal = this._superApply(arguments);

    // restore footerLayout
      if (footer) {
        this.options.timePicker.footerLayout = footer;
      }

      if (key === 'disabled' && this._isIndependentInput()) {
        if (value) {
          this._hide(this._ON_CLOSE_REASON_CLOSE);
        }
        // readonly component has no _triggerNode
        if (this._triggerNode) {
          this._triggerNode.find('.' +
                                this._TRIGGER_TIME_CLASS).attr('title',
                                                                this._getTimeTitle());
          disableEnableSpan(this._triggerNode[0].children, value);
        }
      } else if ((key === 'max' || key === 'min') && !this._isContainedInDateTimePicker()) {
        // since validators are immutable, they will contain min + max as local values. B/c of this will need to recreate

        this._timePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE] =
          getImplicitDateTimeRangeValidator(this.options, this._GetConverter(),
                                            this._GetDefaultStyleClass());
        this._AfterSetOptionValidators();
      } else if (key === 'readOnly') {
        this._processReadOnlyKeyboardEdit();

        if (value) {
          this._hide(this._ON_CLOSE_REASON_CLOSE);
        } else if (this._wheelPicker == null) {
          this._createWheelPicker();
          if (this._isIndependentInput()) {
            this._attachTrigger();
            disableEnableSpan(this._triggerNode[0].children, this.options.disabled);
          }
          this._setupResizePopupBind();
        }
        this._AfterSetOptionDisabledReadOnly('readOnly',
                                             oj.EditableValueUtils.readOnlyOptionOptions);
      } else if (key === 'keyboardEdit') {
        this._processReadOnlyKeyboardEdit();
      }

      var redrawTimePicker = { max: true, min: true, converter: true, timePicker: true };
      if (key in redrawTimePicker) {
        this._createWheelPickerDom();
      }

      return retVal;
    },

    /**
     * @ignore
     * @protected
     * @override
     */
    _destroy: function () {
      this._cleanUpTimeResources();
      var retVal = this._super();
      return retVal;
    },
  /**
   * @ignore
   * @private
   * @override
   */
    _clearWheelModels: function () {
      var timePickerModel = this._timePickerModel;
      if (!timePickerModel) return;
      var model = timePickerModel.getWheelModel('hour');
      if (model) model.wheel = undefined;
      model = timePickerModel.getWheelModel('minute');
      if (model) model.wheel = undefined;
      model = timePickerModel.getWheelModel('ampm');
      if (model) model.wheel = undefined;
    },
  /**
   * @ignore
   * @protected
   * @override
   */
    _destroyHammer: function () {
      if (this._wheelGroup && this._wheelGroup.length) {
        var group = this._wheelGroup[0];
        var wheel;
        var children = group.children;
        for (var index = 0; index < children.length; index++) {
          wheel = children[index];
          wheel.ojDestroy();
        }
      }
    },
    /**
     * @ignore
     * @protected
     * @override
     */
    _SetupResources: function () {
      if (this.options.readOnly !== true) {
        this._setupResizePopupBind();
      }
      return this._super();
    },

    _setupResizePopupBind: function () {
      this._resizePopupBind = function () {
        $('.oj-timepicker-content',
          this._wheelPicker)[_isLargeScreen ? 'removeClass' : 'addClass'](
            'oj-timepicker-fixedheight');
        if (this._isIndependentInput() && Components.isComponentInitialized(this._popUpWheelPicker, 'ojPopup')) {
          this._popUpWheelPicker.ojPopup('option', 'modality', (_isLargeScreen ? 'modeless' : 'modal'));
        }
      }
.bind(this);
      window.addEventListener('resize', this._resizePopupBind, false);
    },

    /**
     * @ignore
     * @protected
     * @override
     */
    _ReleaseResources: function () {
      // for non custom element, this is done as first step in destroy
      if (this._IsCustomElement()) {
        this._cleanUpListeners();
      }
      return this._super();
    },

    /**
     * @ignore
     * @private
     */
    _cleanUpTimeResources: function () {
      if (this._isIndependentInput()) {
        this.element.off('focus touchstart');
        this._wrapper.off('touchstart');
      }

      if (this._triggerNode) {
        this._triggerNode.remove();
      }

      this._cleanUpListeners();
      this._destroyHammer();
      if (this._wheelPicker) {
        this._wheelPicker.remove();
        this._clearWheelModels();
      }

      if (this._isIndependentInput() && this._popUpWheelPicker && Components.isComponentInitialized(this._popUpWheelPicker, 'ojPopup')) {
        this._popUpWheelPicker.ojPopup('destroy');
      }
    },
  /**
   * @ignore
   * @private
   */
    _cleanUpListeners: function () {
      if (this._resizePopupBind) {
        window.removeEventListener('resize', this._resizePopupBind);
      }
      window.removeEventListener('resize', resizeLargeScreenChange);
    },
  /**
   * @ignore
   */
    _processReadOnlyKeyboardEdit: function () {
      if (this._isIndependentInput()) {
        var readonly = this.options.readOnly ||
            this._isKeyboardEditDisabled();
        this.element.prop('readOnly', !!readonly);
      }
    },

  /**
   * @ignore
   * @return {boolean}
   */
    _isKeyboardEditDisabled: function () {
      return this.options.keyboardEdit === this._KEYBOARD_EDIT_OPTION_DISABLED;
    },

  /**
   * Invoke super only if it is standlone or if it is part of ojInputDateTime and ojInputDateTime is inline
   *
   * @ignore
   * @protected
   * @override
   */
    _AppendInputHelper: function () {
      if (this._isIndependentInput()) {
        this._superApply(arguments);
      }
    },

    /**
     * Only time to have ojInputTime handle the display of timepicker by keyDown is when datePickerComp reference is null or
     * when it is not null and is inline
     *
     * @ignore
     * @protected
     * @override
     * @param {Event} event
     */
    _onKeyDownHandler: function (event) {
      if (this._isIndependentInput()) {
        this._superApply(arguments);

        var kc = $.ui.keyCode;
        var handled = false;

        if (this._timepickerShowing()) {
          switch (event.keyCode) {
            case kc.TAB:
              this._hide(this._ON_CLOSE_REASON_TAB);
              break;
            case kc.ESCAPE:
              this._hide(this._ON_CLOSE_REASON_CANCELLED);
              handled = true;
              break;
            case kc.UP:
            case kc.DOWN:
              this._wheelGroup.children().first().focus();
              handled = true;
              break;
            default:
          }
        } else {
          switch (event.keyCode) {
            case kc.UP:
            case kc.DOWN:
              this._SetValue(this._GetDisplayValue(), event);
              this.show();
              handled = true;
              break;
            default:
          }
        }

        if (handled || event.keyCode === kc.ENTER) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      }
      return undefined;
    },

    _getTimeTitle: function () {
      return this._EscapeXSS(this.getTranslatedString('tooltipTime' +
                                                      (this.options.disabled ? 'Disabled' : '')));
    },

  /**
   * @protected
   * @override
   * @ignore
   */
    _WrapElement: function () {
      this._inputContainer = this._superApply(arguments);
      this._inputContainer.attr({ role: 'combobox', 'aria-haspopup': 'true', tabindex: '-1' });
    },

  /**
   * When input element has focus
   * @private
   */
    _onElementFocus: function () {
      var showOn = this.options.timePicker.showOn;

      if (this._redirectFocusToInputContainer) {
        this._redirectFocusToInputContainer = false;
        if (!isPickerNative(this)) {
          this._wheelGroup.children().first().focus();
        } else {
          this._inputContainer.focus();
        }
      } else if (showOn === 'focus') {
        // pop-up date picker when focus placed on the input box
        this.show();
      } else if (this._timepickerShowing()) {
        this._hide(this._ON_CLOSE_REASON_CLOSE);
      }
    },

  /**
   * When input element is touched
   *
   * @ignore
   * @protected
   */
    _OnElementTouchStart: function () {
      var showOn = this.options.timePicker.showOn;

    // If the focus is already on the text box and can't edit with keyboard
    // and show on is focus then reopen the picker.
      if (showOn === 'focus') {
        if (this._timepickerShowing()) {
          this._ignoreShow = true;
          this._hide(this._ON_CLOSE_REASON_CLOSE);
        } else {
          var inputActive = this.element[0] === document.activeElement;

          this.show();
          this._redirectFocusToInputContainer = true;

        // Don't change focus on wheel picker since it should have acquired focus
          if (isPickerNative(this)) {
            if (inputActive) {
              this._inputContainer.focus();
            }
          }
        }
      }
    },

  /**
   * This function will create the necessary time trigger container [i.e. image to launch the time drop down]
   * and perform any attachment to events
   *
   * @private
   */
    _attachTrigger: function () {
      var showOn = this.options.timePicker.showOn;
      var triggerContainer = document.createElement('span');
      triggerContainer.className = this._TRIGGER_CLASS;
      var triggerTime = document.createElement('span');
      triggerTime.setAttribute('title', this._getTimeTitle());
      triggerTime.className = this._TRIGGER_TIME_CLASS + ' oj-clickable-icon-nocontext oj-component-icon';

      var self = this;

      this.element.on('focus', $.proxy(this._onElementFocus, this));
      this.element.on('touchstart', $.proxy(this._OnElementTouchStart, this));

      var wrapper = this._wrapper;
      wrapper.on('touchstart', function () {
        self._isMobile = true;
      });

      if (showOn === 'image') {
      // we need to show the icon that we hid by display:none in the mobile themes
        triggerTime.style.display = 'block';

      // In iOS theme, we defaulted to use border radius given that showOn=focus is default and
      //  we will not have trigger icon. For showOn=image case, we will show the icon, so
      //  we need to remove the border radius. iOS is the only case we use border radius, so this
      //  setting for all cases is fine.
        if (this._IsRTL()) {
          this.element.css('border-top-left-radius', 0);
          this.element.css('border-bottom-left-radius', 0);
        } else {
          this.element.css('border-top-right-radius', 0);
          this.element.css('border-bottom-right-radius', 0);
        }
      }

    // do not attach time picker icon if not independent input mode and native picker is in use
    //  - this is because the native pickers let pick both date and time, showing one icon is
    //  sufficient and less clutter hence
      if (!isPickerNative(this)) {
        triggerContainer.appendChild(triggerTime); // @HTMLUpdateOK

        triggerTime.addEventListener('click', function () {
          if (self._timepickerShowing()) {
            self._hide(self._ON_CLOSE_REASON_CLOSE);
          } else {
            self.show();
            self._wheelGroup.children().first().focus();
          }
        });

        var $triggerTime = $(triggerTime);
        this._AddHoverable($triggerTime);
        this._AddActiveable($triggerTime);

        this._triggerIcon = $triggerTime;
      }

      this._triggerNode = $(triggerContainer);

      this.element[0].parentNode.insertBefore(triggerContainer, this.element[0].nextElementSibling); // @HTMLUpdateOK
    },

    _getValue: function () {
      // need to use ojInputDateTime's value when created internally [i.e. for min + max and etc].
      return this._isContainedInDateTimePicker() ?
        this._datePickerComp.widget.getValueForInputTime() : this.options.value;
    },

    /**
     * Invoked when blur is triggered of the this.element
     *
     * @ignore
     * @protected
     * @param {Event} event
     */
    // eslint-disable-next-line no-unused-vars
    _onBlurHandler: function (event) {
      if (this._isIndependentInput()) {
        this._superApply(arguments);
      }
    },

    /**
     * Shows the timepicker
     *
     * @expose
     * @instance
     * @return {void}
     * @memberof! oj.ojInputTime
     */
    show: function () {
      if (this._timepickerShowing() || this.options.disabled || this.options.readOnly) {
        return;
      }

      if (this._ignoreShow) {
      // set within hide or elsewhere and focus is placed back on this.element
        this._ignoreShow = false;
        return;
      }

      if (isPickerNative(this)) {
        // our html picker is inside popup, which will take care of removing focus from input element,
        //  for native case we do it explicitly
        this.element.blur();
        this._showNativeTimePicker();
      } else {
        this._showWheelPicker();
      }
    },

    /**
     * Shows the native time picker
     *
     * @private
     */
    _showNativeTimePicker: function () {
      // picker expects the fields like 'date' and 'mode' to retain its names. Use bracket notation
      //  to avoid closure compiler from renaming them
      var pickerOptions = {};
      var converter = _getTimePickerConverter(this._GetConverter(), { isoStrFormat: 'offset' });
      var date = _getNativePickerDate(converter, this._getIsoDateValue(converter));

      pickerOptions.date = date;
      pickerOptions.mode = 'time';

      var splitIncrements = splitTimeIncrement(this.options.timePicker.timeIncrement);

      // native picker supports only minute interval and only on iOS, we consider
      //  minute interval only when hours is not specified
      pickerOptions.minuteInterval =
        (splitIncrements.hourIncr === 0) ? splitIncrements.minuteIncr : 1;

      // if part of datetime, then get the min/max from the date component
      var minDate = this._isContainedInDateTimePicker() ?
          this._datePickerComp.widget.options.min : this.options.min;
      var maxDate = this._isContainedInDateTimePicker() ?
          this._datePickerComp.widget.options.max : this.options.max;

      if (minDate) {
        // get a correctly formatted ISO date string
        var minDateProcessed = _getNativePickerDate(
          converter, __ValidationBase.IntlConverterUtils._minMaxIsoString(minDate,
                                                            this._getIsoDateValue(converter)));
        pickerOptions.minDate = minDateProcessed.valueOf();
      }

      if (maxDate) {
        // get a correctly formatted ISO date string
        var maxDateProcessed = _getNativePickerDate(
          converter, __ValidationBase.IntlConverterUtils._minMaxIsoString(maxDate,
                                                            this._getIsoDateValue(converter)));
        pickerOptions.maxDate = maxDateProcessed.valueOf();
      }

      var self = this;

      function onTimePicked(cbDate) {
        self._nativePickerShowing = false;

        // for iOS and windows, from the current implementation of the native datepicker plugin,
        //  for case when the picker is cancelled, this callback gets called without the parameter
        if (cbDate) {
          var cbConverter =
              _getTimePickerConverter(self._GetConverter(), { isoStrFormat: 'offset' });
          // The time picker displays the time portion as is supplied, regardless of device timezone.
          //  Explicitly setting timezone is supported only in iOS, and we do not have a need to do
          //  so at this time, so not exposing this feature for now.
          //  The value returned after pick will have the supplied timezone preserved, however, the
          //  date portion will be reset to current date when in 'time' mode. This will not impact us
          //  because we extract only the time portion to be set on the component.
          var isoString =
              __ValidationBase.IntlConverterUtils._dateTime(self._getIsoDateValue(cbConverter), {
                hours: cbDate.getHours(),
                minutes: cbDate.getMinutes(),
                seconds: cbDate.getSeconds()
              });
          var formattedTime = self._GetConverter().format(isoString);
          // _SetValue will inturn call _SetDisplayValue
          self._SetValue(formattedTime, {});
        }

        self._onClose(self._ON_CLOSE_REASON_SELECTION);
      }

      // onError is called only for Android for cases where picker is cancelled, or if there were
      //  to be any error at the native picker end
      function onError(error) {
        self._nativePickerShowing = false;

        // if user cancels the picker dialog, we just bring the focus back
        // closure compiler renames 'startsWith', using bracket notation hence
        if (error.startsWith('cancel')) {
          self._onClose(self._ON_CLOSE_REASON_CANCELLED);
        } else {
          Logger.log('Error: native time picker failed: ' + error);
        }
      }

      this._nativePickerShowing = true;

      // datePicker is variable at the top level available when the cordova date picker plugin is
      //  included
      window.datePicker.show(pickerOptions, onTimePicked, onError);
    },

  /**
   * Hides the timepicker. Note that this function is a no-op when renderMode is 'native'.
   *
   * @expose
   * @instance
   * @memberof! oj.ojInputTime
   * @return {void}
   */
    hide: function () {
      return this._hide(this._ON_CLOSE_REASON_CLOSE);
    },

    /**
     * Hides the timepicker
     *
     * @param {string} reason - the reason that the popup is being hidden ("selection", "cancelled", "tab")
     *
     * @ignore
     * @expose
     * @memberof! oj.ojInputTime
     * @instance
     */
    _hide: function (reason) {
      if (!isPickerNative(this) && this._timepickerShowing()) {
        this._popUpWheelPicker.ojPopup('close');

        this._onClose(reason);
      }

      return this;
    },

    /**
     * Sets focus to the right place after the picker is closed
     *
     * @param {string} reason - the reason that the popup is being hidden ("selection", "cancelled", "tab", "close")
     * @ignore
     */
    // eslint-disable-next-line no-unused-vars
    _onClose: function (reason) {
      if (this._isMobile && this.options.timePicker.showOn === 'focus') {
        var inputContainer = this._isIndependentInput() ?
            this._inputContainer : this._datePickerComp.widget._inputContainer;
        inputContainer.focus();
      } else {
        if (this.options.timePicker.showOn === 'focus') {
          if (!this._isIndependentInput()) {
            this._datePickerComp.widget._ignoreShow = true;
          } else {
            this._ignoreShow = true;
          }
        }
        this.element.focus();
      }
    },

    /**
     * Refreshes the element. Usually called after dom changes have been made.
     * @expose
     * @instance
     * @memberof oj.ojInputTime
     * @return {void}
     */
    refresh: function () {
      if (this._triggerNode) {
        this._triggerNode.find('.' + this._TRIGGER_TIME_CLASS)
          .attr('title', this._getTimeTitle());
      }
      return this._superApply(arguments) || this;
    },

    /**
     * @ignore
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojInputTime
     */
    // eslint-disable-next-line no-unused-vars
    _SetDisplayValue: function (displayValue) {
      // When not part of datePickerComp or of inline should update input element
      if (this._isIndependentInput()) {
        this._superApply(arguments);
      }

      // so this is a change in behavior from original design. Previously it was decided that app developer
      // would have to invoke refresh to render the calendar after setting the new value programatically; however now it is
      // required to hook it in when _SetDisplayValue is invoked [can't use _SetValue b/c that function is not invoked
      // when developer invokes ("option", "value", "..")
      if (this._timepickerShowing()) {
        this._createWheelPickerDom(true);
      }
    },

    /**
     * @ignore
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojInputTime
     */
    _SetValue: function (newValue, event, options) {
      var ret = false;

      if (this._isContainedInDateTimePicker()) {
        // never update the model if part of ojInputDateTime. Have ojInputDateTime update the model's value [otherwise 2 updates]
        // this is mainly for check of whether the format is correct [i.e when ojInputDateTime is inline], since the value
        // is always picked from the ojInputDateTime component

        try {
          // originally this._super call was invoked above, but the the timepicker wheel is now redrawing
          // before the below timeselected is propagated to the datetimepicker (which has the complete value that must be
          // used and because of that kicked it down)

          // if the operation is an enter key in the input field (not in the picker), the newValue is not just time, it is date+time. So we
          // need to deal differently
          var converter;
          var timeSwitcherConverter = $.oj.ojInputTime.prototype.options.converter;
          var datePickerCompWidget = this._datePickerComp.widget;
          if (event && event.target &&
              event.target === this.element[0] &&
              !this._isDatePickerInline()) {
            converter = datePickerCompWidget._GetConverter();
          } else {
            converter = this._GetConverter();
          }

          var parsedNewValue = converter.parse(newValue);
          var converterUtils = __ValidationBase.IntlConverterUtils;
          var dateTimeValue = datePickerCompWidget.getValueForInputTime() ||
              converterUtils.dateToLocalIso(new Date());

          if (parsedNewValue && timeSwitcherConverter.compareISODates(dateTimeValue,
                parsedNewValue) === 0) {
          // need to kick out if _SetValue happened due to Blur w/o changing of value
            return false;
          }

          var isoString = converterUtils._copyTimeOver(parsedNewValue ||
                                                       converterUtils.dateToLocalIso(new Date()),
                                                       dateTimeValue);

          datePickerCompWidget.timeSelected(isoString, event);
          if (this._isDatePickerInline()) {
            // need to update the input element, reason one can't when of the same input is
            // b/c the wheelpicker apparently doesn't update minute for some odd reason
            ret = this._super(newValue, null, options);
          }
        } catch (e) {
          ret = this._super(newValue, null, options);
        }
      } else {
        ret = this._superApply(arguments);
      }

      return ret;
    },

  /**
   * Whether the this.element should be wrapped. Function so that additional conditions can be placed
   *
   * @ignore
   * @protected
   * @override
   * @return {boolean}
   */
    _DoWrapElement: function () {
      return this._isIndependentInput();
    },

  /**
   * Whether the input element of ojInputTime is shared or not [i.e. not part of ojInputDateTime or if it has
   * been created by ojInputDateTime that is inline
   *
   * @ignore
   * @return {boolean}
   */
    _isIndependentInput: function () {
      return !this._isContainedInDateTimePicker() || this._isDatePickerInline();
    },

  /**
   * @protected
   * @override
   * @return {string}
   * @instance
   * @memberof! oj.ojInputTime
   */
    _GetDefaultStyleClass: function () {
      return 'oj-inputtime';
    },

  /**
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputTime
   */
    _GetElementValue: function () {
      return this.options.value || '';
    },

  /**
   * Sets up the default dateTimeRange and dateRestriction validators.
   *
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputTime
   */
    _GetImplicitSyncValidators: function () {
      var ret = this._superApply(arguments);

      if ((this.options.min != null || this.options.max != null) &&
          !this._isContainedInDateTimePicker()) {
      // need to alter how the default validators work as validators are now immutable and to create the implicit validator only
      // if independent input [i.e. otherwise have ojInputDateTime take care of it]
        this._timePickerDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE] =
          getImplicitDateTimeRangeValidator(this.options,
                                            this._GetConverter(),
                                            this._GetDefaultStyleClass());
      }

      return $.extend(this._timePickerDefaultValidators, ret);
    },

  /**
   * Need to override since apparently we allow users to set the converter to null, undefined, and etc and when
   * they do we use the default converter
   *
   * @return {Object} a converter instance or null
   *
   * @memberof! oj.ojInputTime
   * @instance
   * @protected
   * @override
   */
    _GetConverter: function () {
      return this.options.converter ?
            this._superApply(arguments) :
            $.oj.ojInputTime.prototype.options.converter;
    },

  /**
   * Whether ojInputTime has been created by ojInputDateTime
   *
   * @private
   */
    _isContainedInDateTimePicker: function () {
      return this._datePickerComp !== null;
    },

  /**
   * Helper function to determine whether the provided datePickerComp is inline or not
   *
   * @private
   */
    _isDatePickerInline: function () {
      return this._datePickerComp.inline;
    },

  /**
   * Notifies the component that its subtree has been removed from the document programmatically after the component has
   * been created
   * @memberof! oj.ojInputTime
   * @instance
   * @protected
   */
    _NotifyDetached: function () {
      this._hide(this._ON_CLOSE_REASON_CLOSE);
    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
      this._superApply(arguments);
    },

  /**
   * Notifies the component that its subtree has been made hidden programmatically after the component has
   * been created
   * @memberof! oj.ojInputTime
   * @instance
   * @protected
   */
    _NotifyHidden: function () {
      this._hide(this._ON_CLOSE_REASON_CLOSE);
    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
      this._superApply(arguments);
    },

  /**
   * Generate the HTML for the header of the time picker.
   *
   * @private
   */
    _generateHeader: function () {
      var cancelText = this._EscapeXSS(this.getTranslatedString('cancelText'));
      var cancelButton = "<a role='button' onclick='return false;' href='#'" +
          " class='oj-enabled oj-default oj-timepicker-cancel-button'" +
          " aria-label='" + cancelText + "'>" + cancelText + '</a>';

      var okText = this._EscapeXSS(this.getTranslatedString('okText'));
      var okButton = "<a role='button' onclick='return false;' href='#'" +
          " class='oj-enabled oj-default oj-timepicker-ok-button' aria-label='" +
          okText + "'>" + okText + '</a>';

      var header = "<div class='oj-timepicker-header" +
          (this.options.disabled ? ' oj-disabled ' : ' oj-enabled oj-default ') + "'>";

      header += cancelButton;
      header += okButton;

      header += '</div>';
      return header;
    },

    /**
     * Generate the HTML for the footer of the time picker.
     *
     * @private
     */
    _generateFooter: function (footerLayoutDisplay, gotoTime) {
      var footerLayout = '';
      var currentText = this._EscapeXSS(this.getTranslatedString('currentTimeText'));
      var nowControl =
          "<a role='button' onclick='return false;' href='#' class='oj-timepicker-now oj-priority-secondary oj-enabled'"
          + '>' + currentText + '</a>';

      if (footerLayoutDisplay && footerLayoutDisplay.length > 1) { // keep the code for future multiple buttons
        var nowIndex = footerLayoutDisplay.indexOf('now');
        var loop = 0;
        var footerLayoutButtons = [{ index: nowIndex, content: (gotoTime ? nowControl : '') }];

        // rather than using several if + else statements, sort the content to add by index of the strings
        footerLayoutButtons.sort(function (a, b) {
          return a.index - b.index;
        });

        // continue to loop until the index > -1 [contains the string]
        while (loop < footerLayoutButtons.length && footerLayoutButtons[loop].index < 0) {
          loop += 1;
        }

        while (loop < footerLayoutButtons.length) {
          footerLayout += footerLayoutButtons[loop].content;
          loop += 1;
        }

        if (footerLayout.length > 0) {
          footerLayout = "<div class='oj-timepicker-footer'>" + footerLayout + '</div>';
        }
      }
      return footerLayout;
    },

    /**
     * Get the ISO string for the min or max date limit if applicable
     *
     * @private
     */
    _getIsoDateLimit: function (converter, optionName, valueDate) {
      // Fetch option from correct picker
      var dateIso = this._isContainedInDateTimePicker() ?
          this._datePickerComp.widget.options[optionName] : this.options[optionName];
      // Fill in date from value
      dateIso = dateIso ?
        __ValidationBase.IntlConverterUtils._minMaxIsoString(dateIso, this._getValue()) : dateIso;
      // Move to the converter's timezone
      dateIso = dateIso ? converter.parse(dateIso) : dateIso;
      // If the dates don't match, then min or max doesn't apply to this value
      var date = dateIso ? __ValidationBase.IntlConverterUtils._clearTime(dateIso) : null;
      if (valueDate && date &&
          valueDate.substring(0, valueDate.indexOf('T')) !==
          date.substring(0, date.indexOf('T'))) {
        dateIso = null;
      }

      return dateIso;
    },

    /**
     * Get the ISO string for the current value
     *
     * @private
     */
    _getIsoDateValue: function (converter) {
      var processDateIso = this._getValue();
      if (!processDateIso) {
        processDateIso = new Date();
        processDateIso.setHours(0);
        processDateIso.setMinutes(0);
        processDateIso.setSeconds(0);
        processDateIso.setMilliseconds(0);
        processDateIso = __ValidationBase.IntlConverterUtils.dateToLocalIso(processDateIso);
      }
      processDateIso = converter.parse(processDateIso);

      return processDateIso;
    },

  /**
   * Get the local strings for AM/PM representation
   *
   * @private
   */
    _getAmPmStrings: function () {
      var factory =
        __ValidationBase.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
      var converter = factory.createConverter({ pattern: 'a' });
      return [converter.format('2016-01-01T01:00:00Z'),
        converter.format('2016-01-01T13:00:00Z')];
    },

  /**
   * @private
   * @param {jQuery} wheelPicker popup root node
   * @return {jQuery} returns the timepicker content node relative to the root node
   */
    _getWheelPickerContent: function (wheelPicker) {
      if (!wheelPicker) {
        return null;
      }

      var wheelPickerContent = $(wheelPicker.find('.oj-timepicker-content')[0]);
      return wheelPickerContent;
    },

  /**
   * Create the wheel timepicker DOM
   *
   * @private
   */
    _createWheelPickerDom: function (keepHeaderFooter) {
      // No need to do anything if there is no _wheelPicker, which only happens when the component is readonly.
      var timeDefaultConverter = $.oj.ojInputTime.prototype.options.converter;
      if (this._wheelPicker == null) {
        return;
      }

      if (!keepHeaderFooter) {
        this._detachWheelHandler();
      }

      var wheelPicker = this._wheelPicker;
      var wheelPickerContent = this._getWheelPickerContent(wheelPicker);
      this._destroyHammer();
      if (keepHeaderFooter) {
        $('.oj-timepicker-wheel-group', wheelPickerContent).remove();
      } else {
        wheelPickerContent.empty();
      }

      var converter = this._GetConverter();
      var resolvedOption = converter.resolvedOptions();
      var options = $.extend({}, resolvedOption);
      if (options.isoStrFormat === 'zulu') {
        options.isoStrFormat = 'offset';
        var factory =
          __ValidationBase.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
        converter = factory.createConverter(options);
        options = converter.resolvedOptions();
      }

      var converterUtils = __ValidationBase.IntlConverterUtils;
      var value = this._getValue();
      var date = new Date();
      if (!value) {
        value = __ValidationBase.IntlConverterUtils.dateToLocalIso(date);
      }
      var isovalue = this._validateTime(value, {
        month: date.getMonth(),
        date: date.getDate(),
        fullYear: date.getFullYear(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds() });
      value = converter.parse(isovalue);  // Convert to proper timezone
      var valueDate = converterUtils._clearTime(value);
      var minDateIso = this._getIsoDateLimit(converter, 'min', valueDate);
      var maxDateIso = this._getIsoDateLimit(converter, 'max', valueDate);

      var footerLayoutDisplay = this.options.timePicker.footerLayout;

      var timePickerModel = new TimePickerModel(null);
      this._timePickerModel = timePickerModel;
      var wheelPos = ['', '', '', ''];
      var timePositions = timeDefaultConverter._getTimePositioning(resolvedOption);
      var positions = Object.keys(timePositions);
      for (var i = 0; i < positions.length; i++) {
        var position = positions[i];
        wheelPos[timePositions[position]] = position;
      }
      timePickerModel.wheelOrder = wheelPos.filter(function (val) {
        return !!val;
      }).join('');
      var pattern = options.pattern || options.patternFromOptions;
      if (pattern) {
        timePickerModel.format = pattern;
      } else {
        // if options are not defined in custom converter, use the default converter options
        options = timeDefaultConverter.resolvedOptions();
        pattern = options.pattern || options.patternFromOptions;
        timePickerModel.format = pattern;
      }
      timePickerModel.ampmStrings = this._getAmPmStrings();

      // set increment before setting value so that positions will be calculated correctly
      var timeIncrement = this.options.timePicker.timeIncrement;
      if (timeIncrement) {
        var splitIncrements = splitTimeIncrement(timeIncrement);
        timePickerModel.increment =
          (splitIncrements.hourIncr * 60) + splitIncrements.minuteIncr;
      }

      // set value
      try {
        timePickerModel.isoValue = this._getIsoDateValue(converter);
      } catch (e) {
        timePickerModel.isoValue = timeDefaultConverter.parse(isovalue);
        Logger.info('The value of the InputTime element should be an ISOString, please use a valid ISOString');
      }

      // set min and max values
      if (minDateIso) {
        timePickerModel.isoMin = minDateIso;
      }

      if (maxDateIso) {
        timePickerModel.isoMax = maxDateIso;
      }

      // add header, wheel group and footer
      if (this._isIndependentInput() &&
          (!keepHeaderFooter ||
           $('.oj-timepicker-header', wheelPickerContent).length === 0)) {
        wheelPickerContent.append($(this._generateHeader(wheelPicker))); // @HTMLUpdateOK; header is generated internally so ok
      }
      this._wheelGroup = $(createWheelGroup(timePickerModel));

      if (this._isIndependentInput()) {
        this._wheelGroup.insertAfter($('.oj-timepicker-header', wheelPickerContent)); // @HTMLUpdateOK; wheelGroup is created internally using numbers so ok
      } else {
        wheelPickerContent.append(this._wheelGroup); // @HTMLUpdateOK; wheelGroup is created internally using numbers so ok
      }

      if (!keepHeaderFooter || $('.oj-timepicker-footer', wheelPickerContent).length === 0) {
        wheelPickerContent.append($(this._generateFooter(footerLayoutDisplay, date))); // @HTMLUpdateOK; footer is generated internally so ok
      }

      // add aria labels to wheels for accessibility
      wheelPickerContent.find('.oj-timepicker-hour')
        .attr('aria-label', this.getTranslatedString('hourWheelLabel'));
      wheelPickerContent.find('.oj-timepicker-minute')
        .attr('aria-label', this.getTranslatedString('minuteWheelLabel'));
      wheelPickerContent.find('.oj-timepicker-meridian')
        .attr('aria-label', this.getTranslatedString('ampmWheelLabel'));

      if (!keepHeaderFooter) {
        this._attachWheelHandler();
      }
    },

    /**
     * Detach wheel handlers
     *
     * @private
     */
    _detachWheelHandler: function () {
      this._wheelPicker.find('.oj-timepicker-now').off('click');

      if (this._isIndependentInput()) {
        this._wheelPicker.find('.oj-timepicker-cancel-button').off('click');
        this._wheelPicker.find('.oj-timepicker-ok-button').off('click');
      } else {
        this._wheelPicker.find('.oj-timepicker-wheel').off('blur');
        return;
      }

      this._wheelPicker.off('keydown');
    },

    /**
     * Attaches wheel handlers
     *
     * NOTE: Timepicker wheel was written to redraw the whole content on basically every action, b/c of this it causes random
     * behavior. In order to stabilize it, will minimize the creation of header + footer in the _createWheelPickerDom
     * function and to off before on the handler for the handlers (before would fire multiple times).
     * @private
     */
    _attachWheelHandler: function () {
      var self = this;
      // now control

      this._wheelPicker.find('.oj-timepicker-now').on('click',
      function (event) {
        var value = __ValidationBase.IntlConverterUtils.dateToLocalIso(new Date());
        value = self._GetConverter().parse(value);  // Convert to proper timezone
        self._timePickerModel.isoValue = value;
        if (!self._isIndependentInput()) {
          // when is not an independent component (i.e. part of switcher)
          // need to set the value to have datetimepicker handle the value
          self._SetValue(self._timePickerModel.isoValue, event);
        }

        event.preventDefault();
      });

      if (this._isIndependentInput()) {
        this._wheelPicker.find('.oj-timepicker-cancel-button').on('click',
        function (event) {
          event.preventDefault();
          self._hide(self._ON_CLOSE_REASON_CANCELLED);
        });

        this._wheelPicker.find('.oj-timepicker-ok-button').on('click',
        function (event) {
          self._hide(self._ON_CLOSE_REASON_SELECTION);
          self._SetValue(self._timePickerModel.isoValue, event);
          event.preventDefault();
        });
      } else {
        this._wheelPicker.find('.oj-timepicker-wheel').on('blur', function (event) {
          self._SetValue(self._timePickerModel.isoValue, event);
        });

        // need to hide the datePickerComp prior to showing timepicker
        this._datePickerComp.widget._togglePicker();
        // set focus on the 1st child
        this._wheelGroup.children().first().focus();
        return;
      }

      this._wheelPicker.on('keydown', function (event) {
        if (event.keyCode === $.ui.keyCode.ESCAPE) {
          event.preventDefault();
          self._hide(self._ON_CLOSE_REASON_CANCELLED);
        }
      });
    },

    /**
     * Shows the wheel timepicker
     *
     * @private
     */
    _showWheelPicker: function () {
      this._createWheelPickerDom();

      var popUpWheelPicker = this._popUpWheelPicker;
      if (!popUpWheelPicker) return;

      // ojPopup open must be passed the input container (this.element.parent)
      // as the launcher so that any event within the container won't auto-dismiss
      // the dialog.
      if (!_isLargeScreen) {
        popUpWheelPicker.ojPopup('open', this.element.parent(), {
          my: { horizontal: 'center', vertical: 'bottom' },
          at: { horizontal: 'center', vertical: 'bottom' },
          of: window,
          collision: 'flipfit flipfit'
        });

      // if we don't have a large screen, the popup will be modal so
      // we need to give it the focus
        this._wheelGroup.children().first().focus();
      } else {
        var position = oj.PositionUtils.normalizeHorizontalAlignment({
          my: 'start top',
          at: 'start bottom',
          of: this.element,
          collision: 'flipfit flipfit'
        }, this._IsRTL());
        popUpWheelPicker.ojPopup('open', this.element.parent(), position);
      }
    },

  // @inheritdoc
    getNodeBySubId: function (locator) {
      var node = null;
      var subId = locator && locator.subId;
      var wheelPicker = this._wheelPicker;
      var wheelPickerContent = this._getWheelPickerContent(wheelPicker);

      if (subId) {
        switch (subId) {
          case 'oj-inputdatetime-time-icon':
            node = $('.oj-inputdatetime-time-icon', this._triggerNode)[0];
            break;

          case 'oj-inputdatetime-time-input':
            node = this.element[0];
            break;

          case 'oj-timepicker-content':
            node = wheelPickerContent ? wheelPickerContent[0] : null;
            break;

          case 'oj-timepicker-cancel-button':
            node = $('.oj-timepicker-cancel-button', wheelPicker)[0];
            break;

          case 'oj-timepicker-ok-button':
            node = $('.oj-timepicker-ok-button', wheelPicker)[0];
            break;

          case 'oj-timepicker-hour':
            node = $('.oj-timepicker-hour', wheelPicker)[0];
            break;

          case 'oj-timepicker-minute':
            node = $('.oj-timepicker-minute', wheelPicker)[0];
            break;

          case 'oj-timepicker-meridian':
            node = $('.oj-timepicker-meridian', wheelPicker)[0];
            break;

          case 'oj-timepicker-now':
            node = $('.oj-timepicker-now', wheelPicker)[0];
            break;

          default: node = null;
        }
      }

      return node || this._superApply(arguments);
    },

  // @inheritdoc
    getSubIdByNode: function (node) {
      var timeIcon = $('.oj-inputdatetime-time-icon', this._triggerNode);
      var subId = null;
      var wheelPicker = this._wheelPicker;
      var wheelPickerContent = this._getWheelPickerContent(wheelPicker);
      var checks = [
        { selector: '.oj-timepicker-cancel-button', ele: wheelPicker },
        { selector: '.oj-timepicker-ok-button', ele: wheelPicker },
        { selector: '.oj-timepicker-hour', ele: wheelPicker },
        { selector: '.oj-timepicker-minute', ele: wheelPicker },
        { selector: '.oj-timepicker-meridian', ele: wheelPicker },
        { selector: '.oj-timepicker-now', ele: wheelPicker }
      ];


      if (node === timeIcon[0]) {
        subId = 'oj-inputdatetime-time-icon';
      } else if (node === this.element[0]) {
        subId = 'oj-inputdatetime-time-input';
      } else if (wheelPickerContent && node === wheelPickerContent[0]) {
        subId = 'oj-timepicker-content';
      } else {
        for (var i = 0; i < checks.length; i++) {
          var map = checks[i];
          var entry = $(map.selector, map.ele);

          if (entry.length === 1 && entry[0] === node) {
            subId = map.selector.substr(1);
            break;
          }
        }
      }

      return subId || this._superApply(arguments);
    },

  /**
   * Returns the root node
   *
   * @expose
   * @instance
   * @memberof! oj.ojInputTime
   * @ignore
   */
    widget: function () {
      return this._isIndependentInput() ? this._super() : this._datePickerComp.widget.widget();
    }

  });

// Add custom getters for properties
Components.setDefaultOptions(
  {
    ojInputTime:
    {
      renderMode: Components.createDynamicPropertyGetter(
      function () {
        return (ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {}).renderMode;
      }),
      keyboardEdit: Components.createDynamicPropertyGetter(
      function () {
        return (ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {}).keyboardEdit;
      }),

      timePicker: Components.createDynamicPropertyGetter(
      function () {
        return (ThemeUtils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {}).timePicker;
      })
    }
  }
);

// Fragments:

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
 *       <td>Input element and time trigger icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Shows the time picker and moves the focus into the expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Input element with picker open</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputTime
 */

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>DownArrow or UpArrow</kbd></td>
 *       <td>Shows the time picker and moves the focus into the expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputTime
 */

/**
 * {@ojinclude "name":"ojStylingDocIntro"}
 * <p>The form control text align style classes can be applied to the component, or an ancestor element. When
 * applied to an ancestor element, all form components that support the text align style classes will be affected.
 *
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
 *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-form-control-text-align-right</td>
 *       <td>Aligns the text to the right regardless of the reading direction.
 *           This is normally used for right aligning numbers
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-form-control-text-align-start</td>
 *       <td>Aligns the text to the left in ltr and to the right in rtl</td>
 *     </tr>
 *     <tr>
 *       <td>oj-form-control-text-align-end</td>
 *       <td>Aligns the text to the right in ltr and to the left in rtl</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
 * @memberof oj.ojInputTime
 */

// ////////////////     SUB-IDS     //////////////////

/**
 * <p>Sub-ID for the InputTime component's input element.</p>
 *
 * @ojsubid oj-inputdatetime-time-input
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = myInputTime.getNodeBySubId( {'subId': 'oj-inputdatetime-time-input'} );
 */

/**
 * <p>Sub-ID for the time icon that triggers the time drop down display.</p>
 *
 * @ojsubid oj-inputdatetime-time-icon
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the time icon that triggers the time drop down display:</caption>
 * var node = myInputTime.getNodeBySubId( {'subId': 'oj-inputdatetime-time-icon'} );
 */

/**
 * <p>Sub-ID for the time wheel picker drop down node.
 *
 * @ojsubid oj-timepicker-content
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the time wheel picker drop down node:</caption>
 * var node = myInputTime.getNodeBySubId( {'subId': 'oj-timepicker-content'} );
 */

/**
 * <p>Sub-ID for the cancel button.
 *
 * @ojsubid oj-timepicker-cancel-button
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the cancel button:</caption>
 * var node = myInputTime.getNodeBySubId( {'subId': 'oj-timepicker-cancel-button'} );
 */

/**
 * <p>Sub-ID for the OK button.
 *
 * @ojsubid oj-timepicker-ok-button
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the OK button:</caption>
 * var node = myInputTime.getNodeBySubId( {'subId': 'oj-timepicker-ok-button'} );
 */

/**
 * <p>Sub-ID for the hour picker.
 *
 * @ojsubid oj-timepicker-hour
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the hour picker:</caption>
 * var node = myInputTime.getNodeBySubId( {'subId': 'oj-timepicker-hour'} );
 */

/**
 * <p>Sub-ID for the minute picker.
 *
 * @ojsubid oj-timepicker-minute
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the minute picker:</caption>
 * var node = myInputTime.getNodeBySubId( {'subId': 'oj-timepicker-minute'} );
 */

/**
 * <p>Sub-ID for the meridian picker.
 *
 * @ojsubid oj-timepicker-meridian
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the meridian picker:</caption>
 * var node = myInputTime.getNodeBySubId( {'subId': 'oj-timepicker-meridian'} );
 */

/**
 * <p>Sub-ID for the now button for button bar.
 *
 * @ojsubid oj-timepicker-now
 * @memberof oj.ojInputTime
 * @instance
 *
 * @example <caption>Get the now/now button for button bar:</caption>
 * var node = myInputTime.getNodeBySubId( {'subId': 'oj-timepicker-now'} );
 */

/* global WheelModel:false, Logger:false */

/**
 * @ignore
 * @protected
 * @constructor
 */
// eslint-disable-next-line no-unused-vars
function TimePickerModel(properties) {
  /** @const */
  var ISO_TIME = /^.*T(\d{2})(?::?(\d{2}).*$)/;
  /** @const */
  var MIN_TIME = 0;
  /** @const */
  var MAX_TIME = 60 * 24;
  /** @const */
  var HOURS12 = 12 * 60;

  var FORMAT_MAP = {
    h: hFormat,
    hh: hhFormat,
    H: HFormat,
    HH: HHFormat,
    k: kFormat,
    kk: kkFormat,
    K: KFormat,
    KK: KKFormat,
    mm: mmFormat
  };
  var PARSER_MAP = {
    h: hour12Parser,
    hh: hour12Parser,
    H: numberParser,
    HH: numberParser,
    k: hour24Parser,
    kk: hour24Parser,
    K: numberParser,
    KK: numberParser,
    mm: numberParser
  };

  var _value = 0;

  var _increment;
  var _min = MIN_TIME;
  var _minValue = MIN_TIME;
  var _max = MAX_TIME;
  var _maxValue = MAX_TIME;

  var _format;
  var _12Hour;
  var _grouped = 'auto';
  var _wheelOrder = '';
  var _ampmStrings = ['AM', 'PM'];

  var _minuteModel = new WheelModel(this, {
    valueRange: 60,
    displayRange: 60,
    valueMultiplier: 1,
    displayMultiplier: 1
  });
  var _hourModel = new WheelModel(this, {
    valueMultiplier: 60,
    displayMultiplier: 1
  });
  var _ampmModel = new WheelModel(this, {
    valueRange: 2,
    displayRange: 2,
    formatter: ampmFormat,
    parser: ampmParser,
    valueMultiplier: HOURS12,
    displayMultiplier: 1
  });
  var _models = [_minuteModel, _hourModel, _ampmModel];

  var _settingProps = false;

  //  /** type {TimePickerModel} */
  var self = this;

  defineProperties();
  defineMethods();
  setProperties(properties);

  function defineProperties() {
    _settingProps = true;

    Object.defineProperty(self, 'increment', {
      enumerable: true,
      get: function () {
        return _increment;
      },
      set: function (increment) {
        _increment = Math.floor(increment);
        refreshSettings();
      }
    });
    self.increment = 1;

    Object.defineProperty(self, 'grouped', {
      enumerable: true,
      get: function () {
        return _grouped;
      },
      set: function (grouped) {
        switch (grouped) {
          case 'auto':
          case 'all':
          case 'none':
          case 'hoursMinutes':
          case 'hoursMeridiem':
            _grouped = grouped;
            break;
          default:
            throw new Error('invalid grouped value: ' + grouped);
        }

        refreshSettings();
      }
    });

    Object.defineProperty(self, 'min', {
      enumerable: true,
      get: function () {
        return _min;
      },
      set: function (min) {
        _min = Math.floor(min);
        refreshSettings();
      }
    });

    Object.defineProperty(self, 'isoMin', {
      enumerable: true,
      get: function () {
        return minutesToIso(_min);
      },
      set: function (iso) {
        var newMin = isoToMinutes(iso);
        if (!isNaN(newMin)) {
          self.min = newMin;
        } else {
          Logger.error('Invalid ISO min time: %s', iso);
        }
      }
    });

    Object.defineProperty(self, 'max', {
      enumerable: true,
      get: function () {
        return _max - 1;
      },
      set: function (max) {
        _max = Math.floor(max) + 1;
        refreshSettings();
      }
    });

    Object.defineProperty(self, 'isoMax', {
      enumerable: true,
      get: function () {
        return minutesToIso(_max);
      },
      set: function (iso) {
        var newMax = isoToMinutes(iso);
        if (!isNaN(newMax)) {
          self.max = newMax;
        } else {
          Logger.error('Invalid ISO max time: %s', iso);
        }
      }
    });

    Object.defineProperty(self, 'value', {
      enumerable: true,
      get: function () {
        return _value;
      },
      set: function (value) {
        _value = Math.floor(value);
        refreshSettings();
      }
    });

    Object.defineProperty(self, 'isoValue', {
      enumerable: true,
      get: function () {
        return minutesToIso(_value);
      },
      set: function (iso) {
        var newValue = isoToMinutes(iso);
        if (!isNaN(newValue)) {
          self.value = newValue;
        } else {
          Logger.error('Invalid ISO value time: %s', iso);
        }
      }
    });

    Object.defineProperty(self, 'format', {
      enumerable: true,
      get: function () {
        return _format;
      },
      set: function (format) {
        _format = format;
        // remove stuff between quotes.
        // remove anything that is not h, H, k, K, m or a
        var normalizedFormat = format.replace(/'[^']*'/g, '').replace(/[^hHkKma]*/g, '');

        var matches = normalizedFormat.match(/([hHkK]+)/);
        var hourCode = matches[1];
        _hourModel.formatter = FORMAT_MAP[hourCode];
        _hourModel.parser = PARSER_MAP[hourCode];

        matches = normalizedFormat.match(/(m+)/);
        var minuteCode = matches[1];
        _minuteModel.formatter = FORMAT_MAP[minuteCode];
        _minuteModel.parser = PARSER_MAP[minuteCode];

        _12Hour = _wheelOrder.indexOf('a') >= 0;
        refreshSettings();
      }
    });

    Object.defineProperty(self, 'wheelOrder', {
      enumerable: true,
      get: function () {
        return _wheelOrder;
      },
      set: function (wheelOrder) {
        _wheelOrder = wheelOrder;
      }
    });

    Object.defineProperty(self, 'ampmStrings', {
      enumerable: true,
      get: function () {
        return _ampmStrings;
      },
      set: function (ampmStrings) {
        _ampmStrings = ampmStrings;
      }
    });

    _settingProps = false;
  }

  function defineMethods() {
    self.setProperties = setProperties;
  }

  function setProperties() {
    try {
      _settingProps = true;
      if (properties) {
        var keys = Object.key(properties);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          self[key] = properties[key];
        }
      }
    } finally {
      _settingProps = false;
      refreshSettings();
    }
  }

  /*
   * recalculates dependent values after settings change
   */
  function refreshSettings() {
    if (!_settingProps) {
      _minValue = Math.ceil(_min / _increment) * _increment;
      _maxValue = Math.ceil((_max - 1) / _increment) * _increment;

      if (_maxValue < _minValue) {
        throw new Error('Invalid min and max settings with current increment: ' +
                _min + ' ' + _max + +_increment);
      }

      if (_value < _minValue) {
        _value = _minValue;
      }

      if (_value > _maxValue) {
        _value = _maxValue;
      }

      _value = Math.round(_value / _increment) * _increment;

      var grouped;
      var divisor;
      if (_12Hour) {
        _hourModel.displayRange = 12;

        grouped = _grouped;
        if (grouped === 'auto') {
          // If the increment is a divisor or multiple of 60
          // Then use hoursMeridiem grouping
          divisor = gcd(_increment, 60);
          if (divisor === _increment || divisor === 60) {
            grouped = 'hoursMeridiem';
          } else {
            divisor = gcd(_increment, HOURS12);
            if (divisor === _increment) {
              grouped = 'all';
            } else {
              grouped = 'all';
            }
          }
        }

        switch (grouped) {
          case 'all':
            _minuteModel.displayMultiplier = 1;
            _minuteModel.valueMultiplier = 1;
            _minuteModel.valueRange = 24 * 60;
            _minuteModel.linked = true;

            _hourModel.displayMultiplier = 60;
            _hourModel.valueMultiplier = 1;
            _hourModel.valueRange = 24 * 60;
            _hourModel.linked = true;

            _ampmModel.displayMultiplier = 1;
            _ampmModel.valueMultiplier = 60 * 12;
            _ampmModel.valueRange = 2;
            _ampmModel.linked = true;
            break;

            // case "none":
            //  _minuteModel["displayMultiplier"] = 1;
            //  _minuteModel["valueMultiplier"] = 1;
            //  _minuteModel["valueRange"] = 60;
            //  _minuteModel["linked"] = false;

            //  _hourModel["displayMultiplier"] = 1;
            //  _hourModel["valueMultiplier"] = 60;
            //  _hourModel["valueRange"] = 12;
            //  _hourModel["linked"] = false;

            //  _ampmModel["displayMultiplier"] = 1;
            //  _ampmModel["valueMultiplier"] = 60 * 12;
            //  _ampmModel["valueRange"] = 2;
            //  _ampmModel["linked"] = false;
            //  break;

            // case "hoursMinutes":
            //  _minuteModel["displayMultiplier"] = 1;
            //  _minuteModel["valueMultiplier"] = 1;
            //  _minuteModel["valueRange"] = HOURS12;
            //  _minuteModel["linked"] = true;

            //  _hourModel["displayMultiplier"] = 60;
            //  _hourModel["valueMultiplier"] = 1;
            //  _hourModel["valueRange"] = HOURS12;
            //  _hourModel["linked"] = true;

            //  _ampmModel["displayMultiplier"] = 1;
            //  _ampmModel["valueMultiplier"] = 60 * 12;
            //  _ampmModel["valueRange"] = 2;
            //  _ampmModel["linked"] = false;
            //  break;

          case 'hoursMeridiem':
            _minuteModel.displayMultiplier = 1;
            _minuteModel.valueMultiplier = 1;
            _minuteModel.valueRange = 60;
            _minuteModel.linked = false;

            _hourModel.displayMultiplier = 1;
            _hourModel.valueMultiplier = 60;
            _hourModel.valueRange = 24;
            _hourModel.linked = true;

            _ampmModel.displayMultiplier = 1;
            _ampmModel.valueMultiplier = 60 * 12;
            _ampmModel.valueRange = 2;
            _ampmModel.linked = true;
            break;
          default:
            break;
        }
      } else { // 24 hour
        _hourModel.displayRange = 24;

        grouped = _grouped;
        if (grouped === 'auto') {
          // If the increment is a divisor or multiple of 60
          // Then no grouping
          divisor = gcd(_increment, 60);
          if (divisor === _increment || divisor === 60) {
            grouped = 'none';
          } else {
            grouped = 'all';
          }
        }

        switch (grouped) {
          case 'none':
          case 'hoursMeridiem':
            _minuteModel.displayMultiplier = 1;
            _minuteModel.valueMultiplier = 1;
            _minuteModel.valueRange = 60;
            _minuteModel.linked = false;

            _hourModel.displayMultiplier = 1;
            _hourModel.valueMultiplier = 60;
            _hourModel.valueRange = 24;
            _hourModel.linked = false;
            break;

          case 'all':
          case 'hoursMinutes':
            _minuteModel.displayMultiplier = 1;
            _minuteModel.valueMultiplier = 1;
            _minuteModel.valueRange = 24 * 60;
            _minuteModel.linked = true;

            _hourModel.displayMultiplier = 60;
            _hourModel.valueMultiplier = 1;
            _hourModel.valueRange = 24 * 60;
            _hourModel.linked = true;
            break;
          default:
            break;
        }
      }

      for (var i = 0; i < _models.length; i++) {
        _models[i].refresh();
      }
    }
  }

  function isoToMinutes(isoString) {
    var matches = ISO_TIME.exec(isoString);
    var hours = parseInt(matches[1], 10);
    var minutes = parseInt(matches[2], 10);
    return (hours * 60) + minutes;
  }
  function minutesToIso(minutes) {
    // eslint-disable-next-line no-param-reassign
    minutes = Math.floor(minutes);
    var hours = Math.floor(minutes / 60);
    // eslint-disable-next-line no-param-reassign
    minutes %= 60;
    return 'T' + HHFormat(hours) + ':' + mmFormat(minutes);
  }

  function hFormat(value) {
    if (value === 0) {
      return '12';
    }

    return '' + value;
  }

  function hhFormat(value) {
    if (value === 0) {
      return '12';
    }

    // eslint-disable-next-line no-param-reassign
    value = '0' + value;
    return value.slice(-2);
  }

  function HFormat(value) {
    return '' + value;
  }

  function HHFormat(value) {
    // eslint-disable-next-line no-param-reassign
    value = '0' + value;
    return value.slice(-2);
  }

  function kFormat(value) {
    if (value === 0) {
      return '24';
    }
    return '' + value;
  }

  function kkFormat(value) {
    if (value === 0) {
      return '24';
    }
    // eslint-disable-next-line no-param-reassign
    value = '0' + value;
    return value.slice(-2);
  }

  function KFormat(value) {
    return '' + value;
  }

  function KKFormat(value) {
    // eslint-disable-next-line no-param-reassign
    value = '0' + value;
    return value.slice(-2);
  }

  function mmFormat(value) {
    // eslint-disable-next-line no-param-reassign
    value = '0' + value;
    return value.slice(-2);
  }

  function ampmFormat(value) {
    return _ampmStrings[value];
  }

  function numberParser(value) {
    if (value.match(/^\d+$/)) {
      return parseInt(value, 10);
    }
    return -1;
  }

  function hour12Parser(value) {
    if (value.match(/^\d+$/)) {
      var hour = parseInt(value, 10);
      if (hour === 0) {
        hour = -1;
      }
      if (hour === 24) {
        hour = 0;
      }

      return hour;
    }
    return -1;
  }

  function hour24Parser(value) {
    if (value.match(/^\d+$/)) {
      var hour = parseInt(value, 10);
      if (hour === 0) {
        hour = -1;
      }
      if (hour === 24) {
        hour = 0;
      }

      return hour;
    }
    return -1;
  }

  function ampmParser(value) {
    // eslint-disable-next-line no-param-reassign
    value = value.toLowerCase().charAt();
    if (value === 'a') {
      return 0;
    } else if (value === 'p') {
      return 1;
    }
    return -1;
  }

  self.getWheelModel = function (type) {
    switch (type) {
      case 'hour':
        return _hourModel;

      case 'minute':
        return _minuteModel;

      case 'ampm':
        return (_12Hour ? _ampmModel : null);

      default:
        return undefined;
    }
  };

  // eslint-disable-next-line no-unused-vars
  function mod(val1, val2) {
    // Make modulus out of remainder.  The fancy stuff deals with neg values.
    return ((val1 % val2) + val2) % val2;
  }

  function gcd(a, b) {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  }
}


/* global Promise:false , Hammer:false, createWheelItem:false */

function createWheel(model, isNumber, classList) {
  var CURRENT_POSITION = 7;
  var PAN_SPIN_THRESHOLD = 2;
  var TAP_THRESHOLDS = [0.152, 0.362, 0.638, 0.848];
  var MOMENTUM_FACTOR = 0.007;

  var KEYCODE_BACKSPACE = 8;
  var KEYCODE_UP = 38;
  var KEYCODE_DOWN = 40;

  var _model = model;
  var _wheel;
  var _items = [];
  var _panStartY;
  var _panLastSpinY;
  var _panLastZone;
  var _momentum;
  var _isMeridian = !isNumber && classList === 'oj-timepicker-meridian';

  createDom(classList);
  var $wheel = $(_wheel);

  defineMethods();
  defineEvents();
  refresh();

  return _wheel;

  function createDom() {
    _wheel = document.createElement('div');
    _wheel.classList.add('oj-timepicker-wheel');
    if (classList) {
      _wheel.classList.add(classList);
    }
    _wheel.setAttribute('id', '_ojWheel' + createWheel.counter);
    createWheel.counter += 1;
    _wheel.setAttribute('tabIndex', '0');
    _wheel.setAttribute('role', 'spinbutton');
    _model.wheel = _wheel;
  }

  function defineMethods() {
    _wheel.ojSpinUp = spinUp;
    _wheel.ojSpinDown = spinDown;
    _wheel.ojRefresh = refresh;
    _wheel.ojDestroy = destroy;
    _wheel.ojLinked = function () {
      return _model.linked;
    };
  }

  function defineEvents() {
    var hammerOptions = {
      recognizers: [
        [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }],
        [Hammer.Tap],
        [Hammer.Swipe, { direction: Hammer.DIRECTION_VERTICAL }]
      ]
    };

    $wheel.ojHammer(hammerOptions)
    .on('tap', tapHander)
    .on('swipeup', swipeUpHandler)
    .on('swipedown', swipeDownHandler)
    .on('panstart', panStartHandler)
    .on('panend pancancel', panEndHandler)
    .on('panup pandown', panHandler);

    _wheel.addEventListener('wheel', wheelHandler, false);
    _wheel.addEventListener('keydown', keydownHandler, false);
    _wheel.addEventListener('focus', focusHandler, false);
    _wheel.addEventListener('blur', blurHandler, false);
  }

  function destroy() {
    $wheel.ojHammer()
    .off('tap', tapHander)
    .off('swipeup', swipeUpHandler)
    .off('swipedown', swipeDownHandler)
    .off('panstart', panStartHandler)
    .off('panend pancancel', panEndHandler)
    .off('panup pandown', panHandler);
    $wheel.ojHammer('destroy');
  }

  function spinUp() {
    var next = _items[CURRENT_POSITION + 1];
    if (next) {
      spin(1);
      var oldItem = _items.shift();
      if (oldItem) {
        _wheel.removeChild(oldItem);
      }
      var newItem = createWheelItem(_model, CURRENT_POSITION, _isMeridian);
      if (newItem) {
        _wheel.appendChild(newItem); // @HTMLUpdateOK newItem is generated internally using number so ok
      }
      _items.push(newItem);
    }
  }

  function spinDown() {
    var prev = _items[CURRENT_POSITION - 1];
    if (prev) {
      spin(-1);
      var oldItem = _items.pop();
      if (oldItem) {
        _wheel.removeChild(oldItem);
      }
      var newItem = createWheelItem(_model, -CURRENT_POSITION, _isMeridian);
      if (newItem) {
        _wheel.insertBefore(newItem, _items[0]); // @HTMLUpdateOK newItem is generated internally using number so ok
      }
      _items.unshift(newItem);
    }
  }

  function spin(direction) {
    for (var i = 0; i < _items.length; i++) {
      var item = _items[i];
      if (item) {
        item.ojUpdatePosition(i - CURRENT_POSITION - direction);
      }
    }

    _wheel.setAttribute('aria-valuenow', _model.getText(0));
  }

  function refresh() {
    _items.forEach(function (item) {
      if (item) {
        _wheel.removeChild(item);
      }
    });
    _items = [];

    for (var offset = -CURRENT_POSITION; offset <= CURRENT_POSITION; offset++) {
      var item = createWheelItem(_model, offset, _isMeridian);
      if (item) {
        _wheel.appendChild(item); // @HTMLUpdateOK item is generated internally using number so ok
      }

      _items.push(item);
    }

    // Set the current value on the wheel for accessibility
    _wheel.setAttribute('aria-valuenow', _model.getText(0));
  }

  function keydownHandler(event) {
    var keyCode = event.keyCode;

    switch (keyCode) {
      case KEYCODE_UP:
        _model.position += 1;
        event.preventDefault();
        break;
      case KEYCODE_DOWN:
        _model.position -= 1;
        event.preventDefault();
        break;
      case KEYCODE_BACKSPACE:
        _model.keyboardValue = _model.keyboardValue.slice(0, -1);
        event.preventDefault();
        break;

      default:
        if ((keyCode > 47 && keyCode < 58) || // number keys
            (keyCode > 95 && keyCode < 112) || // numpad keys
            (!isNumber && (keyCode > 64 && keyCode < 91))) { // letter keys
          _model.keyboardValue += event.key;
        }
        break;
    }
  }

  function tapHander(event) {
    _wheel.focus();
    var tapY = event.gesture.center.y;
    var wheelTop = _wheel.getBoundingClientRect().top;
    var wheelHeight = $wheel.height();
    var tapFraction = (tapY - wheelTop) / wheelHeight;
    var tapZone = 0;

    while ((tapZone < 4) && (tapFraction > TAP_THRESHOLDS[tapZone])) {
      tapZone += 1;
    }

    if (tapZone !== 2) {
      _model.position += (tapZone - 2);
    }
  }

  function swipeUpHandler(event) {
    _wheel.focus();
    var velocity = event.gesture.velocityY;
    var extraPixels = (velocity * velocity) / MOMENTUM_FACTOR;
    _momentum = Math.floor((extraPixels / $wheel.height()) * 5);
    event.preventDefault();
  }

  function swipeDownHandler(event) {
    _wheel.focus();
    var velocity = event.gesture.velocityY;
    var extraPixels = (velocity * velocity) / MOMENTUM_FACTOR;
    _momentum = -Math.floor((extraPixels / $wheel.height()) * 5);
    event.preventDefault();
  }

  function panStartHandler(event) {
    _wheel.focus();
    _panLastSpinY = event.gesture.center.y;
    _panStartY = _panLastSpinY;
    _panLastZone = 0;
    _momentum = 0;
  }

  function panEndHandler() {
    _wheel.focus();
    if (_momentum) {
      _model.position += _momentum;
    }

    _panStartY = null;
    _panLastSpinY = null;
    _panLastZone = null;
  }

  function panHandler(event) {
    _wheel.focus();
    var panY = event.gesture.center.y;
    var newZone = Math.round(((_panStartY - panY) / $wheel.height()) * 5);
    if (newZone !== _panLastZone && Math.abs(_panLastSpinY - panY) > PAN_SPIN_THRESHOLD) {
      _panLastSpinY = panY;
      _model.position += newZone - _panLastZone;
      _panLastZone = newZone;
    }
    event.preventDefault();
  }

  function wheelHandler(event) {
    if (event.deltaY) {
      event.currentTarget.focus();
      event.preventDefault();
    }
    if (event.deltaY < 0) {
      _model.position += 1;
    }
    if (event.deltaY > 0) {
      _model.position -= 1;
    }
  }

  function focusHandler() {
    _model.keyboardValue = '';
    _wheel.classList.add('oj-focus');
  }

  function blurHandler() {
    _wheel.classList.remove('oj-focus');
    _model.update();
  }
}

createWheel.counter = 0;

/* global createWheel:false, Logger:false */

/**
 * @protected
 * @ignore
 */
// eslint-disable-next-line no-unused-vars
function createWheelGroup(timePickerModel) {
  var KEYCODE_LEFT = 37;
  var KEYCODE_RIGHT = 39;


  var _group;
  var _wheels = [];

  createDom();
  defineMethods();
  defineEvents();
  refresh();

  return _group;

  /**
   * @protected
   * @ignore
   */
  function createDom() {
    _group = document.createElement('div');
    _group.classList.add('oj-timepicker-wheel-group');
  }

  /**
   * @protected
   * @ignore
   */
  function defineMethods() {
    _group.ojRefresh = refresh;
  }

  /**
   * @protected
   * @ignore
   */
  function defineEvents() {
    _group.addEventListener('keydown', keydownHandler, false);
  }

  /**
   * @protected
   * @ignore
   */
  function keydownHandler(event) {
    var wheel = event.target;
    var keyCode = event.keyCode;

    switch (keyCode) {
      case KEYCODE_LEFT:
        $(wheel).prev().focus();
        break;
      case KEYCODE_RIGHT:
        $(wheel).next().focus();
        break;

      default:
        break;
    }
  }

  /**
   * @protected
   * @ignore
   */
  function focusHandler(event) {
    var wheel = event.target;
    if (wheel.ojLinked()) {
      for (var i = 0; i < _wheels.length; i++) {
        if (_wheels[i].ojLinked()) {
          _wheels[i].classList.add('oj-active');
        }
      }
    } else {
      wheel.classList.add('oj-active');
    }
  }

  /**
   * @protected
   * @ignore
   */
  function blurHandler() {
    for (var i = 0; i < _wheels.length; i++) {
      _wheels[i].classList.remove('oj-active');
    }
  }

  /**
   * @protected
   * @ignore
   */
  function refresh() {
    var wheel = _group.firstChild;
    while (wheel) {
      wheel.ojDestroy();
      _group.removeChild(wheel);
      wheel = _group.firstChild;
    }
    _wheels = [];

    createWheels();
  }

  /**
   * @protected
   * @ignore
   */
  function createWheels() {
    var wheelOrder = timePickerModel.wheelOrder;

    var hourModel = timePickerModel.getWheelModel('hour');
    var hourWheel = createWheel(hourModel, true, 'oj-timepicker-hour');
    var minuteModel = timePickerModel.getWheelModel('minute');
    var minuteWheel = createWheel(minuteModel, true, 'oj-timepicker-minute');

    var ampmModel;
    var ampmWheel;
    if (wheelOrder.indexOf('a') >= 0) {
      ampmModel = timePickerModel.getWheelModel('ampm');
      ampmWheel = createWheel(ampmModel, false, 'oj-timepicker-meridian');
    }

    var codes = wheelOrder.split('');
    var i;
    for (i = 0; i < codes.length; i++) {
      switch (codes[i]) {
        case 'h':
          _wheels.push(hourWheel);
          break;
        case 'm':
          _wheels.push(minuteWheel);
          break;
        case 'a':
          _wheels.push(ampmWheel);
          break;
        default:
          Logger.error('Unknown wheelOrder code: %s', codes[i]);
          break;
      }
    }

    for (i = 0; i < _wheels.length; i++) {
      var wheel = _wheels[i];
      wheel.addEventListener('focus', focusHandler, false);
      wheel.addEventListener('blur', blurHandler, false);
      _group.appendChild(wheel); // @HTMLUpdateOK wheel is generated internally using number so ok
    }
  }
}

/* global Promise:false */

// eslint-disable-next-line no-unused-vars
function createWheelItem(model, position, isMeridian) {
  var _item;
  var _position;
  var _disabled = false;

  function updatePosition(newPosition) {
    _item.classList.remove('oj-timepicker-wheel-item-position' + _position);
    _item.classList.add('oj-timepicker-wheel-item-position' + newPosition);
    _position = newPosition;
    return Promise.resolve();
  }

  function itemFocusHandler() {
    _item.parentNode.focus();
  }

  var text = model.getText(position);
  if (text) {
    _item = document.createElement('div');
    _item.classList.add('oj-timepicker-wheel-item');
    _item.classList.add('oj-timepicker-wheel-item-position' + position);
    _position = position;
    if (model.isDisabled(position)) {
      _disabled = true;
      _item.classList.add('oj-disabled');
    }

    _item.ojUpdatePosition = updatePosition;

    var content = document.createElement('div');
    content.textContent = text;
    content.classList.add('oj-timepicker-wheel-item-content');

    if (isMeridian) {
      // need to add title attr for hover for long am/pm translations
      content.setAttribute('title', text);
    }

    _item.appendChild(content); // @HTMLUpdateOK content is generated internally with content being nunmber so ok

    Object.defineProperty(_item, 'ojDisabled', {
      enumerable: true,
      get: function () {
        return _disabled;
      },
      set: function (disabled) {
        if (disabled !== _disabled) {
          $(_item).toggleClass('oj-disabled');
          _disabled = disabled;
        }
      }
    });

    // The item div and its content div can get focus from mouse click on IE,
    // which doesn't happen on other browsers.  Add a focus handler so that
    // focus can be redirected to the wheel.
    _item.addEventListener('focus', itemFocusHandler, false);
    content.addEventListener('focus', itemFocusHandler, false);
  }

  return _item;
}

/**
 * @ignore
 * @constructor
 * @protected
 * @param {TimePickerModel} parentModel parent picker model
 * @param {Object} properties initial property values
 */
// eslint-disable-next-line no-unused-vars
function WheelModel(parentModel, properties) {
  var SPIN_TIMES = [150, 100, 50, 25, 16];  // Note: No transitions for faster spins

  var _value = 0;
  var _parentModel = parentModel;

  var _position = 0;
  var _currentPosition = 0;

  var _displayRange = 1;
  var _valueRange = 1;
  var _increment = 1;
  var _wheelSize;
  var _keyboardValue = '';
  var _min;
  var _max;
  var _wrapped;

  var _valueMultiplier;
  var _valueUpperMultiplier;
  var _displayMultiplier = 1;
  var _displayUpperMultiplier;

  var _spinning = false;

  var self = this;

  defineProperties();
  defineMethods();
  setProperties();

  function defineProperties() {
    Object.defineProperty(self, 'position', {
      enumerable: true,
      get: function () {
        return _position;
      },
      set: function (position) {
        var val = mod(position, _wheelSize) * _increment;
        if ((val >= _min) && (val < _max) &&
            (position !== _position)) {
          self.value += (position - _position) * _increment;
        }
      }
    });

    Object.defineProperty(self, 'value', {
      enumerable: true,
      get: function () {
        return _value;
      },
      set: function (value) {
        var roundedValue = Math.round(value / _increment) * _increment;

        if (validValue(roundedValue) && _value !== roundedValue) {
          _value = mod(roundedValue, _valueRange);
          setPosition();
          if (self.linked) {
            if (_valueRange === 2) {
              // Don't spin the linked wheel when changing am/pm.  Just set the
              // model value and update the DOM structure since we don't want the
              // hour wheel to spin back to the same number.
              _parentModel.disableSpin = true;
            }
            _parentModel.value = wheelValueToParentValue(_parentModel.value, _value);
            _parentModel.disableSpin = false;
          }
        }
      }
    });

    Object.defineProperty(self, 'increment', {
      enumerable: true,
      get: function () {
        return _increment;
      },
      set: function (increment) {
        if (_increment !== increment) {
          _increment = increment;
          refreshSettings();
        }
      }
    });


    Object.defineProperty(self, 'valueMultiplier', {
      enumerable: true,
      get: function () {
        return _valueMultiplier;
      },
      set: function (valueMultiplier) {
        if (_valueMultiplier !== valueMultiplier) {
          _valueMultiplier = valueMultiplier;
          refreshSettings();
        }
      }
    });

    Object.defineProperty(self, 'valueRange', {
      enumerable: true,
      get: function () {
        return _valueRange;
      },
      set: function (valueRange) {
        if (_valueRange !== valueRange) {
          _valueRange = valueRange;
          refreshSettings();
        }
      }
    });

    Object.defineProperty(self, 'displayMultiplier', {
      enumerable: true,
      get: function () {
        return _displayMultiplier;
      },
      set: function (displayMultiplier) {
        if (_displayMultiplier !== displayMultiplier) {
          _displayMultiplier = displayMultiplier;
          refreshSettings();
        }
      }
    });

    Object.defineProperty(self, 'displayRange', {
      enumerable: true,
      get: function () {
        return _displayRange;
      },
      set: function (displayRange) {
        if (_displayRange !== displayRange) {
          _displayRange = displayRange;
          refreshSettings();
        }
      }
    });

    Object.defineProperty(self, 'keyboardValue', {
      enumerable: true,
      get: function () {
        return _keyboardValue;
      },
      set: function (keyboardValue) {
        _keyboardValue = keyboardValue;
        if (self.parser && _keyboardValue) {
          var value = self.parser(_keyboardValue);
          if (value >= 0) {
            value = displayValueToWheelValue(_value, value);
            if (_min <= value && value < _max) {
              self.value = value;
            }
          }

          // Clear _keyboardValue when the user has typed in 2 digits or after
          // 1 second, so that a new value can be accepted.
          if (_keyboardValue.length >= 2) {
            _keyboardValue = '';
          } else {
            setTimeout(function () {
              _keyboardValue = '';
            }, 1000);
          }
        }
      }
    });
  }

  function defineMethods() {
    self.getText = function (position) {
      var text;
      var pos = mod(_currentPosition, _wheelSize) + position;
      var haveText = _wrapped || (pos >= 0 && pos < _wheelSize);
      if (self.formatter && haveText) {
        var val = positionToDisplayValue(_currentPosition + position);
        text = self.formatter(val);
      }
      return text;
    };

    self.isDisabled = function (position) {
      var value = mod(_currentPosition + position, _wheelSize) * _increment;
      if (_min !== 0 && value < _min) {
        return true;
      }
      if (_max !== _valueRange && value >= _max) {
        return true;
      }
      return false;
    };

    /*
     *
     * called by wheel on blur
     */
    self.update = function () {
      _parentModel.value = wheelValueToParentValue(_parentModel.value, _value);
    };

    self.refresh = refresh;
    self.setProperties = setProperties;
  }

  function setProperties() {
    if (properties) {
      var keys = Object.keys(properties);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        self[key] = properties[key];
      }
    }
  }

  function refresh() {
    var needRefresh = false;
    var parentValue = _parentModel.value;
    self.value = parentValueToWheelValue(parentValue);

    var parentMax = _parentModel.max;
    var newMax;
    if (parentValueUpperPart(parentValue) === parentValueUpperPart(parentMax)) {
      newMax = parentValueToWheelValue(parentMax) + 1;
    } else {
      newMax = _valueRange;
    }
    if (_max !== newMax) {
      needRefresh = true;
      _max = newMax;
    }

    var parentMin = _parentModel.min;
    var newMin;
    if (parentValueUpperPart(parentValue) === parentValueUpperPart(parentMin)) {
      newMin = parentValueToWheelValue(parentMin);
    } else {
      newMin = 0;
    }
    if (_min !== newMin) {
      needRefresh = true;
      _min = newMin;
    }

    var parentIncrement = _parentModel.increment;
    var inc = gcd(parentIncrement, _valueUpperMultiplier);  // For example 60 for minutes

    // If increment is a multiple of 60 then min and max are 0;
    if (inc === _valueUpperMultiplier) {
      _min = 0;
      _max = 1;
      needRefresh = true;
    } else if (self.linked && parentIncrement > _valueMultiplier) {
      inc = parentIncrement;
    } else if (mod(inc, _valueMultiplier) === 0) {
      inc /= _valueMultiplier;
    } else {
      inc = 1;
    }
    if (_increment !== inc) {
      _increment = inc;
      needRefresh = true;
    }

    _wheelSize = Math.floor(_valueRange / _increment);
    _wrapped = _wheelSize > 4;

    if (self.wheel && needRefresh) {
      self.wheel.ojRefresh();
    }
  }

  function setPosition() {
    var newPos = mod(wheelValueToPosition(_value), _wheelSize);
    var oldPos = mod(self.position, _wheelSize);
    var diff = newPos - oldPos;
    if (_wrapped) {
      if (newPos > oldPos) {
        if ((oldPos + _wheelSize) - newPos < Math.abs(diff)) {
          diff = newPos - oldPos - _wheelSize;
        }
      } else
        if ((newPos + _wheelSize) - oldPos < Math.abs(diff)) {
          diff = (newPos + _wheelSize) - oldPos;
        }
    }
    if (diff !== 0) {
      _position += diff;

      if (self.wheel) {
        if (!_spinning) {
          _spinning = true;
          spinWheel.call(self);
        }
      } else {
        _currentPosition = _position;
      }
    }
  }

  /*
   * recalculates dependent values after settings change
   */
  function refreshSettings() {
    _valueUpperMultiplier = _valueMultiplier * _valueRange;
    _displayUpperMultiplier = _displayMultiplier * _displayRange;
  }

  function spinWheel() {
    if (!self.wheel) { // wheel destroyed already
      return;
    }
    SPIN_TIMES.forEach(function (time) {
      self.wheel.classList.remove('oj-timepicker-wheel-spin-' + time);
    });

    var dist = Math.abs(_position - _currentPosition);
    if (dist === 0) {
      _spinning = false;
      return;
    }

    var delay;

    dist -= 1;
    dist = Math.min(dist, SPIN_TIMES.length - 1);
    delay = SPIN_TIMES[dist];
    self.wheel.classList.add('oj-timepicker-wheel-spin-' + SPIN_TIMES[dist]);

    if (_position > _currentPosition) {
      _currentPosition += 1;
      self.wheel.ojSpinUp();
    }
    if (_position < _currentPosition) {
      _currentPosition -= 1;
      self.wheel.ojSpinDown();
    }
    if (delay) {
      if (_parentModel.disableSpin) {
        // Calling spinWheel without delay will update the DOM structure
        // without visually spinning the wheel.
        spinWheel.call(self);
      } else {
        setTimeout(spinWheel.bind(self), delay);
      }
    }
  }

  function validValue(value) {
    if (_wrapped) {
      return true;
    }

    return (_min <= value && value < _max);
  }

  function mod(val1, val2) {
    // Make modulus out of remainder.  The fancy stuff deals with neg values.
    return ((val1 % val2) + val2) % val2;
  }

  function gcd(a, b) {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  }

  function positionToDisplayValue(position) {
    return wheelValueToDisplayValue(positionToWheelValue(position));
  }

  function wheelValueToPosition(value) {
    return Math.floor(value / _increment);
  }

  function wheelValueToParentValue(parentValue, value) {
    return (Math.floor(parentValue / _valueUpperMultiplier) * _valueUpperMultiplier) +
      (mod(value, _valueRange) * _valueMultiplier) +
      mod(parentValue, _valueMultiplier);
  }

  function parentValueToWheelValue(value) {
    return mod(Math.floor(value / _valueMultiplier), _valueRange);
  }

  function parentValueUpperPart(value) {
    return Math.floor(value / _valueUpperMultiplier);
  }

  function positionToWheelValue(position) {
    return mod(mod(position, _wheelSize) * _increment, _valueRange);
  }

  function wheelValueToDisplayValue(value) {
    return mod(Math.floor(value / _displayMultiplier), _displayRange);
  }

  function displayValueToWheelValue(wheelValue, displayValue) {
    return (Math.floor(wheelValue / _displayUpperMultiplier) * _displayUpperMultiplier) +
      (mod(displayValue, _displayRange) * _displayMultiplier) +
      mod(wheelValue, _displayMultiplier);
  }
}

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global isPickerNative:false, _getTimePickerConverter:false,  Logger:false, splitTimeIncrement:false, __ValidationBase: false */
/**
 * @private
 */
var dateSwitcherConverter = $.oj.ojInputDate.prototype.options.converter;

/**
 * @private
 */
var timeSwitcherConverter = $.oj.ojInputTime.prototype.options.converter;

/**
 * @ojcomponent oj.ojDateTimePicker
 * @augments oj.ojInputDateTime
 * @since 4.0.0
 * @ojstatus preview
 * @ojshortdesc An inline element for picking a date-time value.
 * @ojdisplayname Inline Date Time Picker
 * @ojrole combobox
 *
 * @classdesc
 * <h3 id="inputDateTimeOverview-section">
 *   JET DateTimePicker (Inline mode)
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputDateTimeOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET DateTimePicker extends from DatePicker providing additionally time selection drop down. This behaves similar to JET InputDateTime element
 *    except for the fact that the date picker is rendered inline here. The time format is based on the converter and default converter uses the locale to determine the
 *    time format. If the <code>lang</code> attribute is specified in the html tag then the converter picks locale based on the <code>lang</code> attribute. If there is
 *    no <code>lang</code> attribute specified then the locale is based on the browser language setting. Default value for locale is "en". For example, If locale is "en-US",
 *    the default for time is 12-hour format and if locale is "fr", the default for time is 24-hour format.</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-date-time-picker>&lt;/oj-date-time-picker></code></pre>
 * {@ojinclude "name":"validationAndMessagingDoc"}
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
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the label to the element.
 * For DateTimePicker, you should put an <code>id</code> on the element, and then set
 * the <code>for</code> attribute on the label to be the element's id.
 * </p>
 * <h3 id="label-section">
 *   Label and DateTimePicker
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * For accessibility, you should associate a label element with the input
 * by putting an <code>id</code> on the input, and then setting the
 * <code>for</code> attribute on the label to be the input's id.
 * </p>
 * <p>
 * The element will decorate its associated label with required and help
 * information, if the <code>required</code> and <code>help</code> attributes are set.
 * </p>
 */
/**
 * @ojcomponent oj.ojInputDateTime
 * @augments oj.ojInputDate
 * @since 0.6
 * @ojstatus preview
 * @ojshortdesc Provides basic support for specifying a date-time value.
 * @ojrole combobox
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojInputDateTime<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> extends ojInputDate<SP>"
 *               }
 *              ]
 *
 * @classdesc
 * <h3 id="inputDateTimeOverview-section">
 *   JET InputDateTime
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputDateTimeOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET InputDateTime extends from InputDate providing additionally time selection drop down. The time format is based on the converter and default converter uses the locale to determine the
 *    time format. If the <code>lang</code> attribute is specified in the html tag then the converter picks locale based on the <code>lang</code> attribute. If there is
 *    no <code>lang</code> attribute specified then the locale is based on the browser language setting. Default value for locale is "en". For example, if locale is "en-US",
 *    the default for time is 12-hour format and if locale is "fr", the default for time is 24-hour format.</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-input-date-time>&lt;/oj-input-date-time></code></pre>
 *
 * {@ojinclude "name":"validationAndMessagingDoc"}
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
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the label to the element.
 * For InputDateTime, you should put an <code>id</code> on the element, and then set
 * the <code>for</code> attribute on the label to be the element's id.
 * If there is no oj-label for the InputDateTime, add aria-label on InputDateTime
 * to make it accessible.
 * {@ojinclude "name":"accessibilityPlaceholderEditableValue"}
 * {@ojinclude "name":"accessibilityDisabledEditableValue"}
 * </p>
 * <h3 id="label-section">
 *   Label and InputDateTime
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * For accessibility, you should associate a label element with the input
 * by putting an <code>id</code> on the input, and then setting the
 * <code>for</code> attribute on the label to be the input's id.
 * </p>
 * <p>
 * The element will decorate its associated label with required and help
 * information, if the <code>required</code> and <code>help</code> attributes are set.
 * </p>
 */
oj.__registerWidget('oj.ojInputDateTime', $.oj.ojInputDate, {
  widgetEventPrefix: 'oj',

  // -------------------------------From base---------------------------------------------------//
  _WIDGET_CLASS_NAMES: 'oj-inputdatetime-date-time oj-component oj-inputdatetime',
  _INPUT_HELPER_KEY: 'inputHelpBoth',
  // -------------------------------End from base-----------------------------------------------//
  _TRIGGER_CALENDAR_CLASS: 'oj-inputdatetime-calendar-clock-icon',

  options: {
    /**
     * Default converter for InputDateTime
     *
     * If one wishes to provide a custom converter for the InputDateTime override the factory returned for
     * oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
     * {@ojinclude "name":"inputBaseConverterOptionDoc"}
     * @expose
     * @instance
     * @memberof! oj.ojInputDateTime
     * @type {Object}
     * @ojsignature  { target: "Type", value: "oj.Converter<string>|oj.Validation.RegisteredConverter",
     *                 jsdocOverride: true}
     * @default oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({"day": "2-digit", "month": "2-digit", "year": "2-digit", "hour": "2-digit", "minute": "2-digit"})
     */
    converter: __ValidationBase.Validation.converterFactory(
      oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
    /**
     * @name autocomplete
     * @ojshortdesc Dictates component's autocomplete state.
     * @expose
     * @type {string}
     * @ojsignature {target: "Type", value: "'on'|'off'|string", jsdocOverride: true}
     * @default "on"
     * @instance
     * @ignore
     * @since 4.0.0
     * @memberof! oj.ojDateTimePicker
     * @ojextension {_COPY_TO_INNER_ELEM: true}
     */
    /**
     * Allows applications to specify whether to render date picker in JET or
     * as a native picker control. In inline mode, the only value supported is "jet"</br>
     *
     * @expose
     * @memberof! oj.ojDateTimePicker
     * @instance
     * @name renderMode
     * @ojtsnarrowedtype
     * @type {string}
     * @ojvalue {string} 'jet' Applications get full JET functionality.
     * @default "jet"
     *
     * @example <caption>Initialize the InputDate with the <code class="prettyprint">render-mode</code> attribute specified:</caption>
     * &lt;oj-date-time-picker render-mode='jet'>&lt;/oj-date-time-picker>
     *
     * @example <caption>Get or set the <code class="prettyprint">renderMode</code> property after initialization:</caption>
     * // getter
     * var renderMode = myInputDate.renderMode;
     *
     * // setter
     * myInputDate.renderMode = 'jet';
     *
     * @example <caption>Set the default in the theme (SCSS)</caption>
     * $inputDateTimeRenderModeOptionDefault: native !default;
     */
    /**
     * Allows applications to specify whether to render date and time pickers
     * in JET or as a native picker control.</br>
     *
     * Valid values: jet, native
     *
     * Default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the
     * default is "native" and it's "jet" for alta web theme.
     *
     * <ul>
     *  <li> jet - Applications get full JET functionality.</li>
     *  <li> native - Applications get the functionality of the native picker.</li></br>
     *  Note that the native picker support is limited to Cordova plugin published
     *  at 'https://github.com/VitaliiBlagodir/cordova-plugin-datepicker'.</br>
     *  With native renderMode, the functionality that is sacrificed compared to jet renderMode are:
     *    <ul>
     *      <li>Date and time pickers cannot be themed</li>
     *      <li>Accessibility is limited to what the native picker supports</li>
     *      <li>pickerAttributes is not applied</li>
     *      <li>Sub-IDs are not available</li>
     *      <li>hide() and hideTimePicker() functions are no-op</li>
     *      <li>translations sub properties pertaining to the picker is not available</li>
     *      <li>All of the 'datepicker' sub-properties except 'showOn' are not available</li>
     *      <li>'timePicker.timeIncrement' property is limited to iOS and will only take a precision of minutes</li>
     *    </ul>
     * </ul>
     *
     * @expose
     * @memberof! oj.ojInputDateTime
     * @instance
     * @type {string}
     * @ojvalue {string} 'jet' Applications get full JET functionality.
     * @ojvalue {string} 'native' Applications get the functionality of the native picker. Native picker is
     *  not available when the picker is inline, defaults to jet instead.</br></br>
     *  Note that the native picker support is limited to Cordova plugin published
     *  at 'https://github.com/VitaliiBlagodir/cordova-plugin-datepicker'.</br></br>
     *  With native renderMode, the functionality that is sacrificed compared to jet renderMode are:
     *    <ul>
     *      <li>Date Time picker cannot be themed</li>
     *      <li>Accessibility is limited to what the native picker supports</li>
     *      <li>pickerAttributes is not applied</li>
     *      <li>Sub-IDs are not available</li>
     *      <li>hide() function is no-op</li>
     *      <li>translations sub properties pertaining to the picker is not available</li>
     *      <li>All of the 'datepicker' sub-properties except 'showOn' are not available</li>
     *      <li>'timePicker.timeIncrement' property is limited to iOS and will only take a precision of minutes</li>
     *    </ul>
     *
     * @example <caption>Get or set the <code class="prettyprint">renderMode</code> property for
     * an InputDateTime after initialization:</caption>
     * // getter
     * var renderMode = myInputDateTime.renderMode;
     * // setter
     * myInputDateTime.renderMode = "native";
     * // Example to set the default in the theme (SCSS)
     * $inputDateTimeRenderModeOptionDefault: native !default;
     */
    renderMode: 'jet',

    /**
     * <p>
     * Note that Jet framework prohibits setting subset of properties which are object types.<br/><br/>
     * For example myInputDateTime.timePicker = {timeIncrement: "00:30:00:00"}; is prohibited as it will
     * wipe out all other sub-properties for "timePicker" object.<br/><br/> If one wishes to do this [by above syntax or knockout] one
     * will have to get the "timePicker" object, modify the necessary sub-property and pass it to above syntax.<br/><br/>
     * </p>
     *
     * @memberof oj.ojInputDateTime
     * @ojfragment dateTimeCommonTimePicker
     */
    /**
     * {@ojinclude "name":"datePickerCommonDatePicker"}
     *
     * @expose
     * @instance
     * @memberof! oj.ojDateTimePicker
     * @name timePicker
     * @type {Object}
     * @ojtsignore tsdefonly
     *
     * @example <caption>Initialize the component, overriding some time-picker attributes and leaving the others intact:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-date-time-picker time-picker.time-increment='00:10:00:00'>&lt;/oj-date-time-picker>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-date-time-picker time-picker='{"timeIncrement":"00:10:00:00"}'>&lt;/oj-date-time-picker>
     *
     * @example <caption>Get or set the <code class="prettyprint">timePicker</code> property after initialization:</caption>
     * // Get one
     * var value = myComponent.timePicker.showOn;
     *
     * // Set one, leaving the others intact. Use the setProperty API for
     * // subproperties so that a property change event is fired.
     * myComponent.setProperty('timePicker.showOn', 'image');
     *
     * // Get all
     * var values = myComponent.timePicker;
     *
     * // Set all.  Must list every timePicker key, as those not listed are lost.
     * myComponent.timePicker = {
     *     timeIncrement: '00:10:00:00',
     *     showOn: 'image'
     * };
     */
    /**
     * <p>
     * Note that Jet framework prohibits setting subset of properties which are object types.<br/><br/>
     * For example myInputDateTime.timePicker = {timeIncrement: "00:30:00:00"}; is prohibited as it will
     * wipe out all other sub-properties for "timePicker" object.<br/><br/> If one wishes to do this [by above syntax or knockout] one
     * will have to get the "timePicker" object, modify the necessary sub-property and pass it to above syntax.<br/><br/>
     * </p>
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputDateTime
     * @type {Object}
     *
     * @example <caption>Initialize the component, overriding some time-picker attributes and leaving the others intact:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-input-date-time time-picker.time-increment='00:10:00:00'>&lt;/oj-input-date-time>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-input-date-time time-picker='{"timeIncrement":"00:10:00:00"}'>&lt;/oj-input-date-time>
     *
     * @example <caption>Get or set the <code class="prettyprint">timePicker</code> property after initialization:</caption>
     * // Get one
     * var value = myComponent.timePicker.showOn;
     *
     * // Set one, leaving the others intact. Use the setProperty API for
     * // subproperties so that a property change event is fired.
     * myComponent.setProperty('timePicker.showOn', 'image');
     *
     * // Get all
     * var values = myComponent.timePicker;
     *
     * // Set all.  Must list every timePicker key, as those not listed are lost.
     * myComponent.timePicker = {
     *     timeIncrement: '00:10:00:00',
     *     showOn: 'image'
     * };
     */
    timePicker:
    {
      /**
       * Will dictate what content is shown within the footer of the wheel timepicker.
       *
       * <p>See the <a href="#timePicker">time-picker</a> attribute for usage examples.
       *
       * @expose
       * @name timePicker.footerLayout
       * @memberof! oj.ojInputDateTime
       * @instance
       * @type {string}
       * @ojvalue {string} '' Do not show anything
       * @ojvalue {string} 'now' Show the now button
       * @default ""
       */
      footerLayout: '',
      /**
       * Time increment to be used for InputDateTime, the format is hh:mm:ss:SS. <br/><br/>
       * Note that when renderMode is 'native', timeIncrement property is limited to iOS and will only take a precision of minutes.<br/><br/>
       *
       * <p>See the <a href="#timePicker">time-picker</a> attribute for usage examples.
       *
       * @expose
       * @name timePicker.timeIncrement
       * @memberof! oj.ojInputDateTime
       * @instance
       * @type {string}
       * @default "00:05:00:00"
       */
      timeIncrement: '00:05:00:00',

      /**
       * When the timepicker should be shown.
       *
       * <p>See the <a href="#timePicker">time-picker</a> attribute for usage examples.
       *
       * @expose
       * @name timePicker.showOn
       * @memberof! oj.ojInputDateTime
       * @instance
       * @type {string}
       * @ojvalue {string} 'focus' when the element receives focus or when the trigger clock image is clicked. When the picker is closed, the field regains focus and is editable.
       * @ojvalue {string} 'image' when the trigger clock image is clicked
       * @default "focus"
       */
      showOn: 'focus'
    }

    /**
     * The maximum selectable datetime. When set to null, there is no maximum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     *
     * @example <caption>Initialize the element with the <code class="prettyprint">max</code> attribute:</caption>
     * &lt;oj-date-time-picker max='2014-09-25T13:30:00.000-08:00'&gt;&lt;/oj-date-time-picker&gt;
     *
     * @expose
     * @name max
     * @instance
     * @memberof! oj.ojDateTimePicker
     * @type {string|null}
     * @ojformat date-time
     * @default null
     */
    /**
     * The maximum selectable datetime. When set to null, there is no maximum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     *
     * @example <caption>Initialize the element with the <code class="prettyprint">max</code> attribute:</caption>
     * &lt;oj-input-date-time max='2014-09-25T13:30:00.000-08:00'&gt;&lt;/oj-input-date-time&gt;
     *
     * @expose
     * @name max
     * @instance
     * @memberof! oj.ojInputDateTime
     * @type {string|null}
     * @ojformat date-time
     * @default null
     */

    /**
     * The minimum selectable date. When set to null, there is no minimum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     *
     * @example <caption>Initialize the element with the <code class="prettyprint">min</code> attribute:</caption>
     * &lt;oj-date-time-picker min='2014-08-25T08:00:00.000-08:00'&gt;&lt;/oj-date-time-picker&gt;
     *
     * @expose
     * @name min
     * @instance
     * @memberof! oj.ojDateTimePicker
     * @type {string|null}
     * @ojformat date-time
     * @default null
     */
    /**
     * The minimum selectable date. When set to null, there is no minimum.
     *
     * <ul>
     *  <li> type string - ISOString
     *  <li> null - no limit
     * </ul>
     *
     * @example <caption>Initialize the element with the <code class="prettyprint">min</code> attribute:</caption>
     * &lt;oj-input-date-time min='2014-08-25T08:00:00.000-08:00'&gt;&lt;/oj-input-date-time&gt;
     *
     * @expose
     * @name min
     * @instance
     * @memberof! oj.ojInputDateTime
     * @type {string|null}
     * @ojformat date-time
     * @default null
     */

    /**
     * List of validators used by element when performing validation. Each item is either an
     * instance that duck types {@link oj.Validator}, or is an Object literal containing the
     * properties listed below.
     * <p>
     * Implicit validators are created by the element when certain attributes are present.
     * For example, if the <code class="prettyprint">required</code>
     * attribute is set, an implicit {@link oj.RequiredValidator} is created. If the
     * <code class="prettyprint">min</code> and/or <code class="prettyprint">max</code> attribute
     * is set, an implicit {@link oj.DateTimeRangeValidator} is created. If the
     * <code class="prettyprint">dayFormatter</code> attribute is set,
     * an implicit {@link oj.DateRestrictionValidator} is created.
     * At runtime when the component runs validation, it
     * combines all the implicit validators with all the validators
     * specified through this <code class="prettyprint">validators</code> attribute, and runs
     * all of them.
     * </p>
     * <p>
     * Hints exposed by validators are shown in the notewindow by default, or as determined by the
     * 'validatorHint' property set on the <code class="prettyprint">displayOptions</code>
     * property.
     * </p>
     *
     * <p>
     * When <code class="prettyprint">validators</code> property changes due to programmatic
     * intervention, the element may decide to clear messages and run validation, based on the
     * current state it is in. </br>
     *
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>The cached list of validator instances are cleared and new validator hints is pushed to
     * messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if element is valid when validators changes, element does nothing other than the
     * steps it always performs.</li>
     * <li>if element is invalid and is showing messages when
     * <code class="prettyprint">validators</code> changes then all element messages are cleared
     * and full validation run using the display value on the element.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event to clear custom errors.</li>
     * </ul>
     * </li>
     * <li>if element is invalid and has deferred messages when validators changes, it does
     * nothing other than the steps it performs always.</li>
     * </ul>
     * </p>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the element are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     * </p>
     *
     * @property {string} type - the validator type that has a {@link oj.ValidatorFactory} that can
     * be retrieved using the {@link oj.Validation} module. For a list of supported validators refer
     * to {@link oj.ValidatorFactory}. <br/>
     * @property {Object=} options - optional Object literal of options that the validator expects.
     *
     * @example <caption>Initialize the element with validator object literal:</caption>
     * myInputDateTime.validators = [{
     *     type: 'dateTimeRange',
     *     options : {
     *       max: '2014-09-10T13:30:00.000',
     *       min: '2014-09-01T00:00:00.000'
     *     }
     *   }];
     *
     * NOTE: oj.Validation.validatorFactory('dateTimeRange') returns the validator factory that is used
     * to instantiate a range validator for dateTime.
     *
     * @example <caption>Initialize the element with multiple validator instances:</caption>
     * var validator1 = new MyCustomValidator({'foo': 'A'});
     * var validator2 = new MyCustomValidator({'foo': 'B'});
     * myInputDateTime.value = 10;
     * myInputDateTime.validators = [validator1, validator2];
     *
     * @expose
     * @name validators
     * @instance
     * @memberof oj.ojInputDateTime
     * @ojsignature  { target: "Type",
     *   value: "Array<oj.Validator<string>|oj.Validation.RegisteredValidator>|null",
     *   jsdocOverride: true}
     * @type {Array.<Object>}
     * @default []
     */

    /**
     * Determines if keyboard entry of the text is allowed.
     * When the datepicker is inline, the only supported value is "disabled".
     *
     * @expose
     * @instance
     * @memberof! oj.ojDateTimePicker
     * @name keyboardEdit
     * @ojtsnarrowedtype
     * @type {string}
     * @ojvalue {string} "disabled" Changing the date can only be done with the picker.
     * @default "disabled"
     *
     * @example <caption>Initialize the InputDate with the <code class="prettyprint">keyboard-edit</code> attribute specified:</caption>
     * &lt;oj-date-time-picker keyboard-edit='disabled'>&lt;/oj-date-time-picker>
     *
     * @example <caption>Get or set the <code class="prettyprint">keyboardEdit</code> property after initialization:</caption>
     * // getter
     * var keyboardEdit = myInputDate.keyboardEdit;
     *
     * // setter
     * myInputDate.keyboardEdit = 'disabled';
     *
     * @example <caption>Set the default in the theme (SCSS)</caption>
     * $inputDateTimeKeyboardEditOptionDefault: disabled !default;
     */
    /**
     * The value of the DateTimePicker element which should be an ISOString
     *
     * @example <caption>Initialize the element with the <code class="prettyprint">value</code> attribute:</caption>
     * &lt;oj-date-time-picker value='2014-09-10T13:30:00.000'&gt;&lt;/oj-date-time-picker&gt;
     * @example <caption>Initialize the element with the <code class="prettyprint">value</code> property specified programmatically
     * using oj.IntlConverterUtils.dateToLocalIso :</caption>
     * myInputDateTime.value = oj.IntlConverterUtils.dateToLocalIso(new Date());<br/>
     * @example <caption>Get or set the <code class="prettyprint">value</code> property, after initialization:</caption>
     * // Getter: returns Today's date in ISOString
     * myInputDateTime.value;
     * // Setter: sets it to a different date time
     * myInputDateTime.value = "2013-12-01T20:00:00-08:00";
     *
     * @expose
     * @name value
     * @instance
     * @memberof! oj.ojDateTimePicker
     * @type {string}
     * @ojformat date-time
     */
    /**
     * The value of the InputDateTime element which should be an ISOString
     *
     * @example <caption>Initialize the element with the <code class="prettyprint">value</code> attribute:</caption>
     * &lt;oj-input-date-time value='2014-09-10T13:30:00.000'&gt;&lt;/oj-input-date-time&gt;
     * @example <caption>Initialize the element with the <code class="prettyprint">value</code> property specified programmatically
     * using oj.IntlConverterUtils.dateToLocalIso :</caption>
     * myInputDateTime.value = oj.IntlConverterUtils.dateToLocalIso(new Date());<br/>
     * @example <caption>Get or set the <code class="prettyprint">value</code> property, after initialization:</caption>
     * // Getter: returns Today's date in ISOString
     * myInputDateTime.value;
     * // Setter: sets it to a different date time
     * myInputDateTime.value = "2013-12-01T20:00:00-08:00";
     *
     * @expose
     * @name value
     * @instance
     * @ojwriteback
     * @memberof! oj.ojInputDateTime
     * @type {string}
     * @ojformat date-time
     */

    // Events

  },

  /**
   * @protected
   * @override
   * @instance
   * @ignore
   * @memberof! oj.ojInputDateTime
   */
  _InitBase: function () {
    this._super();

    this._timePickerElement = this.element; // if the ojInputDateTime is inline, then this ref will change to a NEW input element
    this._timePicker = null;
    this._timeConverter = null;

    // need to remember the last _SetValue for the case of timepicker [i.e. select a date that is not in range due to
    // time; however since we don't push invalid values to this.options["value"] the timepicker would pick up the wrong
    // selected date
    this._previousValue = null;

    // below is when the switcher is active (i.e. datetimepicker and when one clicks on Cancel need to reset it)
    this._switcherDiv = null;
    this._switcherPrevValue = null;
    this._switcherPrevDay = null;
    this._switcherPrevMonth = null;
    this._switcherPrevYear = null;

    this._switcherDateValue = null;
    this._switcherTimeValue = null;
    this._dateTimeSwitcherActive = null;

    if (!this._isInLine) {
      if (this.options.readOnly !== true) {
        this._createSwitcherDiv();
      }
    }
  },

  _createSwitcherDiv: function () {
    this._switcherDiv = $(this._generateSwitcher());

    var popupContent = this._popUpDpDiv.ojPopup('widget')[0].querySelector('.oj-popup-content');
    popupContent.appendChild(this._switcherDiv[0]); // @HTMLUpdateOK

    var self = this;
    var cancelHandler = function () {
      // only time when value is _Set in switcher is by clicking Done where both of the fields would be set to null
      if (self._switcherDateValue !== null || self._switcherTimeValue !== null) {
        self._currentDay = self._switcherPrevDay;
        self._currentMonth = self._switcherPrevMonth;
        self._drawMonth = self._currentMonth;
        self._currentYear = self._switcherPrevYear;
        self._drawYear = self._currentYear;
        self._SetValue(self._switcherPrevValue);

        self._switcherTimeValue = null;
        self._switcherDateValue = null;
        self._switcherPrevDay = null;
        self._switcherPrevMonth = null;
        self._switcherPrevYear = null;
        self._switcherPrevValue = null;
      }
    };
    this._popUpDpDiv.on('ojclose', function () {
      cancelHandler();
    });
    this._switcherDiv.find('[data-handler]').map(function () {
      var handler = {
        /** @expose */
        switchMe: function (evt) {
          var keyCode = evt.keyCode;
          if ((evt.type === 'keydown' &&
                 ($.ui.keyCode.ENTER === keyCode ||
                  $.ui.keyCode.SPACE === keyCode)) ||
                evt.type === 'click') {
            if (!self._isShowingDatePickerSwitcher()) {
              self._timePicker.ojInputTime('show');
            } else {
              self.show();
              self._placeFocusOnCalendar();
            }

            return false;
          }
          return undefined;
        },

        /** @expose */
        switchDone: function (evt) {
          var keyCode = evt.keyCode;
          if ((evt.type === 'keydown' &&
                 ($.ui.keyCode.ENTER === keyCode ||
                  $.ui.keyCode.SPACE === keyCode)) ||
                evt.type === 'click') {
            var newVal = self._getDateIso();
            if (self._switcherDateValue) {
              newVal = self._switcherDateValue;
            }

            if (self._switcherTimeValue) {
              newVal =
                __ValidationBase.IntlConverterUtils._copyTimeOver(self._switcherTimeValue, newVal);
            }

            var formatted = self._GetConverter().format(newVal);
            self._SetDisplayValue(formatted);
            self._SetValue(formatted, {});

            self._switcherTimeValue = null;
            self._switcherDateValue = null;
            self._switcherPrevDay = null;
            self._switcherPrevMonth = null;
            self._switcherPrevYear = null;
            self._switcherPrevValue = null;
            self._hide(self._ON_CLOSE_REASON_SELECTION);
            return false;
          }
          return undefined;
        },

        /** @expose */
        switchCancel: function (evt) {
          var keyCode = evt.keyCode;
          if ((evt.type === 'keydown' &&
                 ($.ui.keyCode.ENTER === keyCode ||
                  $.ui.keyCode.SPACE === keyCode)) ||
                evt.type === 'click') {
            self._hide(self._ON_CLOSE_REASON_CANCELLED);
            return false;
          }
          return undefined;
        }
      };

      $(this).bind(this.getAttribute('data-event'),
                     handler[this.getAttribute('data-handler')]);
      return undefined;
    });
  },

  _setupSwitcherButtons: function () {
    var switcherButtons = this._switcherDiv.find('a');
    this._AddHoverable(switcherButtons);
    this._AddActiveable(switcherButtons);
  },

    /**
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojInputDateTime
     */
  _ComponentCreate: function () {
    var ret = this._super();
    var timeConverter = null;

    try {
      timeConverter = this._getTimePickerConverter(this._GetConverter());
    } catch (e) {
      // ignore
    }

    if (timeConverter === null) {
      throw new Error(
          "Please use ojInputDate if your converter doesn't specify a time format.");
    }

    if (this._isInLine) {
      // Since DatePicker never intended to have timepicker associated to it
      // need to have an input element that is tied to the time selector

      var input = $("<input type='text'>");
      input.insertAfter(this.element); // @HTMLUpdateOK

      // Now need to reset this._timePickerElement to the newly created input element
      this._timePickerElement = input;

      this._createTimePicker();
    } else if (this.options.readOnly !== true) {
      this._setupSwitcherButtons();
      this._createTimePicker();
    }

    return ret;
  },

  _createTimePicker: function () {
    var passOptions = [
      'title', 'placeholder', 'disabled', 'required', 'readOnly',
      'keyboardEdit', 'pickerAttributes'
    ];
    var passObject = {};

    for (var i = 0, j = passOptions.length; i < j; i++) {
      passObject[passOptions[i]] = this.options[passOptions[i]];
    }

    var messagesDisplayOption = this.options.displayOptions.messages;

    // create time instance for the time portion
    // jmw Seems to be a bug where messages are always in notewindow. So I think I should
    // carry the displayOptions over to the timePicker.

    var timePickerOptions = this.options.timePicker;

    if (!this._isInLine) {
      $.extend(timePickerOptions, { footerLayout: 'now' });
    }
    var value = this._formatValueWithTimeConverter(this.options.value);
    this._timePicker = this._timePickerElement.ojInputTime(
      $.extend(passObject, {
        converter: this._timeConverter,
        displayOptions: { converterHint: 'none', title: 'none', messages: messagesDisplayOption },
        // need to pass the value down as otherwise if the value is null then it might pickup this.element.val() from
        // our frameworks generic if options.value is not defined then pick up from element; however that would be a formatted
        // value from ojInputDateTime
        value: value,
        timePicker: timePickerOptions,
        datePickerComp: { widget: this, inline: this._isInLine }
      }));
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  _AfterCreate: function () {
    var ret = this._superApply(arguments);

    this._dateTimeSwitcherActive =
      !isPickerNative(this) && this._timePicker && !this._isInLine;
    return ret;
  },

  // eslint-disable-next-line no-unused-vars
  _setOption: function (key, value, flags) {
    var retVal = this._superApply(arguments);

    if (key === 'value') {
      // if goes through model does it needs to update or should be only used by selection + keydown
      var optionsValue = this._formatValueWithTimeConverter(this.options.value);
      this._previousValue = optionsValue;
    } else if (key === 'readOnly') {
      if (!this._isInLine && !value && this._switcherDiv == null) {
        this._createSwitcherDiv();
        this._setupSwitcherButtons();
        this._createTimePicker();
      }
    }

    if (this._timePicker) {
      // note that min + max are not passed through since it should be taken care of by ojInputDateTime and not ojInputTime
      // as it needs to use the fulle datetime
      var timeInvoker = { disabled: true, readOnly: true, keyboardEdit: true };

      if (key in timeInvoker) {
        this._timePicker.ojInputTime('option', key, value);
      } else if (key === 'timePicker') {
        this._timePicker.ojInputTime('option', 'timePicker.timeIncrement',
                                     value.timeIncrement);
      } else if (key === 'converter') {
        this._timeConverter = null;
        this._timePicker.ojInputTime('option', key,
                                     this._getTimePickerConverter(this._GetConverter())); // need to invoke _GetConverter for the case when null and etc sent in
      }
    }

    return retVal;
  },

  /**
   * @ignore
   * @protected
   * @override
   * @memberof oj.ojInputDateTime
   */
  _destroy: function () {
    this._cleanUpDateTimeResources();
    return this._super();
  },
  /**
   * @ignore
   * @private
   * @memberof oj.ojInputDateTime
   */
  _cleanUpDateTimeResources: function () {
    if (this._timePicker) {
      this._timePicker.ojInputTime('destroy');
    }
    if (this._isInLine) {
      // note that this.element below would be of the TimePicker's input element
      this._timePickerElement.remove();
    } else
      if (this._switcherDiv) {
        var switcherButtons = this._switcherDiv.find('a');
        this._RemoveActiveable(switcherButtons);
        this._RemoveHoverable(switcherButtons);

        this._switcherDiv.remove();
      }
  },
  /**
   * @ignore
   * @protected
   * @override
   * @memberof oj.ojInputDateTime
   */
  _formatValueWithTimeConverter: function (optionsValue) {
    var formattedValue = optionsValue;
    try {
      this._getTimePickerConverter(this._GetConverter()).format(optionsValue);
    } catch (e) {
      Logger.info('The value of the InputDateTime element should be an ISOString, please use a valid ISOString');
      formattedValue = this._getDefaultIsoDate();
    }
    return formattedValue;
  },
  /**
   * @protected
   * @override
   * @instance
   * @ignore
   * @memberof! oj.ojInputDateTime
   */
  _GetCalendarTitle: function () {
    return this._EscapeXSS(this.getTranslatedString('tooltipCalendarTime' +
                                                    (this.options.disabled ? 'Disabled' : '')));
  },

  /**
   * Generate the element for the footer of the date picker.
   *
   * @ignore
   */
  _generateSwitcher: function () {
    var switcher = document.createElement('div');
    switcher.className = 'oj-datetimepicker-switcher';

    var childDiv = document.createElement('div');
    childDiv.setAttribute('data-handler', 'switchMe');
    childDiv.setAttribute('data-event', 'click keydown');

    var elem = document.createElement('div');
    elem.className = 'oj-inputdatetime-time-icon oj-clickable-icon-nocontext oj-component-icon oj-enabled oj-default';
    childDiv.appendChild(elem);

    elem = document.createElement('a');
    elem.setAttribute('onclick', 'return false;');
    elem.setAttribute('href', '#');
    elem.className = 'oj-enabled oj-datetimepicker-switcher-text';
    elem.setAttribute('role', 'button');
    childDiv.appendChild(elem);

    switcher.appendChild(childDiv);

    childDiv = document.createElement('div');
    childDiv.className = 'oj-datetimepicker-switcher-buttons';

    elem = document.createElement('a');
    elem.setAttribute('onclick', 'return false;');
    elem.setAttribute('href', '#');
    elem.className = 'oj-enabled';
    elem.setAttribute('data-handler', 'switchDone');
    elem.setAttribute('data-event', 'click keydown');
    elem.setAttribute('role', 'button');
    elem.textContent = this._EscapeXSS(this.getTranslatedString('done'));
    childDiv.appendChild(elem);

    elem = document.createElement('a');
    elem.setAttribute('onclick', 'return false;');
    elem.setAttribute('href', '#');
    elem.className = 'oj-enabled';
    elem.setAttribute('data-handler', 'switchCancel');
    elem.setAttribute('data-event', 'click keydown');
    elem.setAttribute('role', 'button');
    elem.textContent = this._EscapeXSS(this.getTranslatedString('cancel'));
    childDiv.appendChild(elem);

    switcher.appendChild(childDiv);

    return switcher;
  },

  /**
   * @ignore
   */
  _updateSwitcherText: function () {
    var switcherText = '';
    if (this._isShowingDatePickerSwitcher()) {
      try {
        switcherText = dateSwitcherConverter.format(this._switcherDateValue || this._getDateIso());
      } catch (e) {
        switcherText = dateSwitcherConverter.format(this._getDefaultIsoDate());
      }
    } else {
      try {
        switcherText = timeSwitcherConverter.format(this._switcherTimeValue || this._getDateIso());
      } catch (e) {
        switcherText = timeSwitcherConverter.format(this._getDefaultIsoDate());
      }
    }

    $('.oj-datetimepicker-switcher-text', this._switcherDiv).text(switcherText);
  },

  /**
   * @ignore
   */
  _isShowingDatePickerSwitcher: function () {
    return !this._switcherDiv ||
      $('.oj-inputdatetime-time-icon', this._switcherDiv).length === 0;
  },

  _togglePicker: function () {
    var datepickerNode;
    var timepickerNode;

    var removeCss;
    var addCss;
    var newText;
    var switcher = this._switcherDiv;
    var timePickerShown = !this._isShowingDatePickerSwitcher();

    if (timePickerShown) {
      addCss = 'oj-inputdatetime-calendar-icon';
      removeCss = 'oj-inputdatetime-time-icon';
      newText = 'Set Date';
    } else {
      addCss = 'oj-inputdatetime-time-icon';
      removeCss = 'oj-inputdatetime-calendar-icon';
      newText = 'Set Time';
    }

    var children = $(switcher.children()[0]).children();
    $(children[0]).removeClass(removeCss).addClass(addCss);
    $(children[1]).text(newText);

    children = $('.oj-popup-content', this._popUpDpDiv.ojPopup('widget')).children();

    if (children[0].classList.contains('oj-datepicker-popup')) {
      datepickerNode = $(children[0]);
      timepickerNode = $(children[1]);
    } else {
      datepickerNode = $(children[1]);
      timepickerNode = $(children[0]);
    }

    if (!timePickerShown) {
      timepickerNode.css('display', 'none');
      datepickerNode.css('display', 'block');
    } else {
      datepickerNode.css('display', 'none');
      timepickerNode.css('display', 'block');
    }

    this._updateSwitcherText();
  },

  /*
   * Will provide the timePicker converter based on the actual converter
   */
  _getTimePickerConverter: function (converter) {
    if (this._timeConverter !== null) {
      return this._timeConverter;
    }

    this._timeConverter = _getTimePickerConverter(converter);
    return this._timeConverter;
  },
  /**
   * Handler for when the time is selected. Should be invoked ONLY by the ojInputTime component
   *
   * @ignore
   * @param {string} newValue
   * @param {Event} event
   */
  timeSelected: function (newValue, event) {
    // TEMP TILL FIXED pass in formatted for _SetValue (should be newValue)
    if (!this._dateTimeSwitcherActive) {
      var formatted = this._GetConverter().format(newValue);
      this._SetDisplayValue(formatted);
      this._SetValue(formatted, event);
    } else {
      this._switcherTimeValue = newValue;
    }
  },

  /**
   * Provides the current displayed selected value for ojInputTime component [i.e. when is invalid return this._previousValue]
   * The complication occurs b/c we do not push invalid values to the model and b/c of that reason this.options["value"]
   * might contain outdated isoString for ojInputTime. For instance let's say the min date is 02/01/14 2PM then
   * when an user selects 02/01/14 the component would be invalid [as 12AM] and the value would not be pushed. However one needs
   * to give opportunity for ojInputTime to allow user in selecting the valid datetime in full so the _previousValue
   * must be passed through.
   *
   * @ignore
   */
  getValueForInputTime: function () {
    var value = null;

    if (this.isValid()) {
      value = this.options.value;
    } else if (this._previousValue) {
      try {
        // might have been that the user typed in an incorrect format, so try to parse it
        value = this._GetConverter().parse(this._previousValue);
      } catch (e) {
        value = this.options.value;
      }
    } else {
      value = null;
    }

    if (this._isDateTimeSwitcher()) {
      value = this._switcherDateValue || value;

      if (this._switcherTimeValue && value) {
        value = __ValidationBase.IntlConverterUtils._copyTimeOver(this._switcherTimeValue, value);
      }
    }

    return value;
  },

  /**
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  // eslint-disable-next-line no-unused-vars
  _SetValue: function (newValue, event, options) {
    var ret = this._superApply(arguments);

    this._previousValue = newValue;

    return ret;
  },

  /**
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  // eslint-disable-next-line no-unused-vars
  _SetDisplayValue: function (displayValue) {
    if (!this._isInLine) {
      this._superApply(arguments);
      this._updateSwitcherText();
    } else {
      // When the picker is inline, we should update the picker when the value changes so that
      // the selected day has the correct CSS class set.
      var focusOnCalendar = !(this._isInLine && this._timePicker &&
                              this._timePicker[0] === document.activeElement);
      this._updateDatepicker(focusOnCalendar);
    }
    this._switcherTimeValue = null;
  },

  /**
   * Just for the case of launching timepicker with Shift + Up or Shift + Down
   *
   * @ignore
   * @protected
   * @override
   * @param {Event} event
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  _onKeyDownHandler: function (event) {
    var kc = $.ui.keyCode;
    var handled = false;

    switch (event.keyCode) {
      case kc.UP:
      case kc.DOWN:
        if (event.shiftKey) {
          this._SetValue(this._GetDisplayValue(), event);

          this._timePicker.ojInputTime('show');
          handled = true;
        }
        break;
      default:
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    return this._superApply(arguments);
  },

  /**
   * @instance
   * @memberof oj.ojInputDateTime
   * @return {void}
   */
  show: function () {
    if (this._isShowingDatePickerSwitcher()) {
      this._togglePicker();
    }

    return this._super();
  },

  /**
   * Shows the native datepicker
   *
   * @protected
   * @override
   * @memberof! oj.ojInputDateTime
   * @instance
   */
  _ShowNativeDatePicker: function (pickerOptions) {
    // override the mode set by base class
    // eslint-disable-next-line no-param-reassign
    pickerOptions.mode = 'datetime';

    var splitIncrements = splitTimeIncrement(this.options.timePicker.timeIncrement);

    // native picker supports only minute interval and only on iOS, we consider minute interval
    //  only when hours is not specified
    // eslint-disable-next-line no-param-reassign
    pickerOptions.minuteInterval =
      (splitIncrements.hourIncr === 0) ? splitIncrements.minuteIncr : 1;

    return this._super(pickerOptions);
  },

  /**
   * callback upon picking date from native picker
   *
   * @protected
   * @override
   * @memberof! oj.ojInputDateTime
   * @instance
   */
  _OnDatePicked: function (date) {
    this._nativePickerShowing = false;

    // for iOS and windows, from the current implementation of the native datepicker plugin,
    //  for case when the picker is cancelled, this callback gets called without the parameter
    if (date) {
      var isoString;
      isoString = this._validateDatetime(this._getDateIso(), {
        month: date.getMonth(),
        date: date.getDate(),
        fullYear: date.getFullYear(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
      });
      var formattedTime = this._GetConverter().format(isoString);

      // _SetValue will inturn call _SetDisplayValue
      this._SetValue(formattedTime, {});
    }

    this._onClose(this._ON_CLOSE_REASON_SELECTION);
  },

  /**
   * Shows the HTML datepicker
   *
   * @override
   * @ignore
   */
  _ShowHTMLDatePicker: function () {
    var retVal = this._superApply(arguments);

    // if there is a value, save the Iso date version as the default value. Otherwise, set to ""
    // so that we correctly restore the empty string if there is no value.
    this._switcherPrevValue = this.options.value ? this._getDateIso() : '';
    this._switcherPrevDay = this._currentDay;
    this._switcherPrevMonth = this._currentMonth;
    this._switcherPrevYear = this._currentYear;

    this._updateSwitcherText();
    return retVal;
  },

  /**
   * Method to show the internally created InputTime
   *
   * @expose
   * @memberof oj.ojInputDateTime
   * @instance
   * @return {void}
   */
  showTimePicker: function () {
    if (!this._datepickerShowing()) {
      this.show();
    }

    if (!this._isShowingDatePickerSwitcher()) {
      this._timePicker.ojInputTime('show');
    }
  },

  /**
   * @expose
   * @memberof oj.ojInputDateTime
   * @instance
   * @return {void}
   */
  hideTimePicker: function () {
    return this.hide();
  },

  /**
   * Refreshes the element. Usually called after dom changes have been made.
   * @expose
   * @override
   * @instance
   * @memberof oj.ojInputDateTime
   * @return {void}
   */
  refresh: function () {
    var retVal = this._superApply(arguments) || this;

    if (this._timePicker) {
      this._timePicker.ojInputTime('refresh');
    }

    if (this._switcherDiv) {
      $("a[data-handler='switchDone']",
        this._switcherDiv).text(this.getTranslatedString('done'));
      $("a[data-handler='switchCancel']",
        this._switcherDiv).text(this.getTranslatedString('cancel'));
    }

    return retVal;
  },

  // @inheritdoc
  getNodeBySubId: function (locator) {
    var subId = locator && locator.subId;
    var node = null;

    if (subId) {
      if (subId === 'oj-inputdatetime-date-input') {
        node = this._isInLine ? this._timePickerElement[0] : this.element[0];
      } else if (subId === 'oj-inputdatetime-calendar-clock-icon') {
        node = $('.oj-inputdatetime-calendar-clock-icon', this._triggerNode)[0];
      } else {
        node = this._timePicker ?
          this._timePicker.ojInputTime('getNodeBySubId', locator) : null;
      }
    }

    return node || this._superApply(arguments);
  },

  // @inheritdoc
  getSubIdByNode: function (node) {
    var dateTimeSpecific = null;

    if (this._isInLine) {
      if (node === this._timePickerElement[0]) {
        dateTimeSpecific = 'oj-inputdatetime-date-input';
      }
    } else
      if (node === this.element[0]) {
        dateTimeSpecific = 'oj-inputdatetime-date-input';
      } else if (node === $('.oj-inputdatetime-calendar-clock-icon', this._triggerNode)[0]) {
        dateTimeSpecific = 'oj-inputdatetime-calendar-clock-icon';
      }

    return dateTimeSpecific ||
      (this._timePicker ? this._timePicker.ojInputTime('getSubIdByNode', node) : null) ||
      this._superApply(arguments);
  },

  /**
   * Need to override since apparently we allow users to set the converter to null, undefined, and etc and when
   * they do we use the default converter
   *
   * @return {Object} a converter instance or null
   *
   * @memberof! oj.ojInputDateTime
   * @instance
   * @protected
   * @override
   */
  _GetConverter: function () {
    return this.options.converter ?
      this._superApply(arguments) :
      $.oj.ojInputDateTime.prototype.options.converter;
  },
  /**
   * Notifies the component that its subtree has been removed from the document programmatically after the component has
   * been created
   * @memberof! oj.ojInputDateTime
   * @instance
   * @protected
   */
  _NotifyDetached: function () {
    if (this._timePicker) {
      this.hideTimePicker();
    }

    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
    this._superApply(arguments);
  },

  /**
   * Notifies the component that its subtree has been made hidden programmatically after the component has
   * been created
   * @memberof! oj.ojInputDateTime
   * @instance
   * @protected
   */
  _NotifyHidden: function () {
    if (this._timePicker) {
      this.hideTimePicker();
    }

    // hide sets focus to the input, so we want to call super after hide. If we didn't, then
    // the messaging popup will reopen and we don't want that.
    this._superApply(arguments);
  },

  /**
   *
   * @return {Object} jquery object
   *
   *
   * @expose
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  _GetMessagingLauncherElement: function () {
    return !this._isInLine ? this._super() : this._timePickerElement;
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   * @return {string}
   */
  _GetDefaultStyleClass: function () {
    return 'oj-inputdatetime';
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputDateTime
   */
  _GetTranslationsSectionName: function () {
    return 'oj-ojInputDate';
  }
});

// Fragments:

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
 *       <td>Input element and calendar trigger icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>When not inline, shows the grid and moves the focus into the expanded date grid.</td>
 *     </tr>
 *     <tr>
 *       <td>Time trigger icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Shows the time picker and moves the focus into the expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Input element with picker open</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Left</kbd></td>
 *       <td>Switch to next month (or previous month on RTL page).</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Right</kbd></td>
 *       <td>Switch to previous month (or next month on RTL page).</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputDateTime
 */
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
 *       <td>Time trigger icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Shows the time picker and moves the focus into the expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Left</kbd></td>
 *       <td>Switch to next month (or previous month on RTL page).</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Swipe Right</kbd></td>
 *       <td>Switch to previous month (or next month on RTL page).</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojDateTimePicker
 */
/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>DownArrow or UpArrow</kbd></td>
 *       <td>When not in inline mode, shows the calendar grid and moves the focus into the
 *       expanded grid. When in inline mode, shows the time picker and moves the focus into the
 *       expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Shift + DownArrow or UpArrow</kbd></td>
 *       <td>Shows the time picker and moves the focus into the expanded time picker</td>
 *     </tr>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Input Element</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Select the currently focused day</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move up in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move down in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move right in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move left in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Move focus to first day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Move focus to last day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Switch to previous month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Switch to next month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageUp</kbd></td>
 *       <td>Switch to previous year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageDown</kbd></td>
 *       <td>Switch to next year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageUp</kbd></td>
 *       <td>Switch to previous by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageDown</kbd></td>
 *       <td>Switch to next by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + T</kbd></td>
 *       <td>Places focus on Today button if it exists.</tr>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputDateTime
 */
/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Select the currently focused day</td>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move up in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move down in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move right in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move left in the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the grid.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Move focus to first day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Move focus to last day of the month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Switch to previous month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Switch to next month.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageUp</kbd></td>
 *       <td>Switch to previous year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Alt + PageDown</kbd></td>
 *       <td>Switch to next year.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageUp</kbd></td>
 *       <td>Switch to previous by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + PageDown</kbd></td>
 *       <td>Switch to next by stepBigMonths.</tr>
 *     </tr>
 *     <tr>
 *       <td>Picker</td>
 *       <td><kbd>Ctrl + Alt + T</kbd></td>
 *       <td>Places focus on Today button if it exists.</tr>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojDateTimePicker
 */

/**
 * {@ojinclude "name":"ojStylingDocIntro"}
 * <p>The form control text align style classes can be applied to the component, or an ancestor element. When
 * applied to an ancestor element, all form components that support the text align style classes will be affected.
 *
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
 *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-form-control-text-align-right</td>
 *       <td>Aligns the text to the right regardless of the reading direction.
 *           This is normally used for right aligning numbers
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-form-control-text-align-start</td>
 *       <td>Aligns the text to the left in ltr and to the right in rtl</td>
 *     </tr>
 *     <tr>
 *       <td>oj-form-control-text-align-end</td>
 *       <td>Aligns the text to the right in ltr and to the left in rtl</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
 * @memberof oj.ojInputDateTime
 */

// ////////////////     SUB-IDS     //////////////////

/**
 * <p>Sub-ID for the InputDateTime element's input element when not inline.</p>
 *
 * @ojsubid oj-inputdatetime-time-input
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = myInputDateTime.getNodeBySubId( {'subId': 'oj-inputdatetime-time-input'} );
 */

/**
 * <p>Sub-ID for the icon that triggers the calendar display.</p>
 *
 * @ojsubid oj-inputdatetime-calendar-clock-icon
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the icon that triggers the calendar display:</caption>
 * var node = myInputDateTime.getNodeBySubId( {'subId': 'oj-inputdatetime-calendar-clock-icon'} );
 */

/**
 * <p>Sub-ID for the time wheel picker drop down node.
 *
 * @ojsubid oj-timepicker-content
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the time wheel picker drop down node:</caption>
 * var node = myInputDateTime.getNodeBySubId( {'subId': 'oj-timepicker-content'} );
 */

/**
 * <p>Sub-ID for the cancel button.
 *
 * @ojsubid oj-timepicker-cancel-button
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the cancel button:</caption>
 * var node = myInputDateTime.getNodeBySubId( {'subId': 'oj-timepicker-cancel-button'} );
 */

/**
 * <p>Sub-ID for the OK button.
 *
 * @ojsubid oj-timepicker-ok-button
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the OK button:</caption>
 * var node = myInputDateTime.getNodeBySubId( {'subId': 'oj-timepicker-ok-button'} );
 */

/**
 * <p>Sub-ID for the hour picker.
 *
 * @ojsubid oj-timepicker-hour
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the hour picker:</caption>
 * var node = myInputDateTime.getNodeBySubId( {'subId': 'oj-timepicker-hour'} );
 */

/**
 * <p>Sub-ID for the minute picker.
 *
 * @ojsubid oj-timepicker-minute
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the minute picker:</caption>
 * var node = myInputDateTime.getNodeBySubId( {'subId': 'oj-timepicker-minute'} );
 */

/**
 * <p>Sub-ID for the meridian picker.
 *
 * @ojsubid oj-timepicker-meridian
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the meridian picker:</caption>
 * var node = myInputDateTime.getNodeBySubId( {'subId': 'oj-timepicker-meridian'} );
 */

/**
 * <p>Sub-ID for the now button for button bar.
 *
 * @ojsubid oj-timepicker-now
 * @memberof oj.ojInputDateTime
 * @instance
 *
 * @example <caption>Get the now/now button for button bar:</caption>
 * var node = myInputDateTime.getNodeBySubId( {'subId': 'oj-timepicker-now'} );
 */

/* global __oj_input_time_metadata:false */

(function () {
  __oj_input_time_metadata.extension._WIDGET_NAME = 'ojInputTime';
  __oj_input_time_metadata.extension._INNER_ELEM = 'input';
  __oj_input_time_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['accesskey', 'aria-label', 'tabindex'];
  __oj_input_time_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
  oj.CustomElementBridge.register('oj-input-time', { metadata: __oj_input_time_metadata });
}());

/* global __oj_input_date_metadata:false */
(function () {
  __oj_input_date_metadata.extension._WIDGET_NAME = 'ojInputDate';
  __oj_input_date_metadata.extension._INNER_ELEM = 'input';
  __oj_input_date_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['accesskey', 'aria-label', 'tabindex'];
  __oj_input_date_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
  oj.CustomElementBridge.register('oj-input-date', { metadata: __oj_input_date_metadata });

  var ojDatePickerMeta = oj.CollectionUtils.copyInto({}, __oj_input_date_metadata, undefined, true);
  ojDatePickerMeta.extension._INNER_ELEM = 'div';
  oj.CustomElementBridge.register('oj-date-picker', { metadata: ojDatePickerMeta });
}());

/* global __oj_input_date_time_metadata:false */
(function () {
  __oj_input_date_time_metadata.extension._WIDGET_NAME = 'ojInputDateTime';
  __oj_input_date_time_metadata.extension._INNER_ELEM = 'input';
  __oj_input_date_time_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['accesskey', 'aria-label', 'tabindex'];
  __oj_input_date_time_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
  oj.CustomElementBridge.register('oj-input-date-time', { metadata: __oj_input_date_time_metadata });

  var ojDateTimePickerMeta = oj.CollectionUtils.copyInto({}, __oj_input_date_time_metadata,
    undefined, true);
  ojDateTimePickerMeta.extension._INNER_ELEM = 'div';
  oj.CustomElementBridge.register('oj-date-time-picker', { metadata: ojDateTimePickerMeta });
}());

});