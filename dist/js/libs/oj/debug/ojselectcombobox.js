/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojeditablevalue', 'ojs/ojoptgroup', 'ojs/ojoption', 'ojs/ojhighlighttext', 'ojs/ojprogress-circle', 'ojs/ojcore-base', 'jquery', 'ojs/ojdomutils', 'ojs/ojset', 'ojs/ojtimerutils', 'ojs/ojthemeutils', 'ojs/ojcontext', 'ojs/ojlistdataproviderview', 'ojs/ojtreedataproviderview', 'ojs/ojtranslation', 'ojs/ojlogger', 'ojs/ojcustomelement-utils', 'ojs/ojcomponentcore'], function (ojeditablevalue, ojoptgroup, ojoption, ojhighlighttext, ojprogressCircle, oj, $, DomUtils, ojSet, TimerUtils, ThemeUtils, Context, ListDataProviderView, TreeDataProviderView, Translation, Logger, ojcustomelementUtils, Components) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  ojSet = ojSet && Object.prototype.hasOwnProperty.call(ojSet, 'default') ? ojSet['default'] : ojSet;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;
  ListDataProviderView = ListDataProviderView && Object.prototype.hasOwnProperty.call(ListDataProviderView, 'default') ? ListDataProviderView['default'] : ListDataProviderView;
  TreeDataProviderView = TreeDataProviderView && Object.prototype.hasOwnProperty.call(TreeDataProviderView, 'default') ? TreeDataProviderView['default'] : TreeDataProviderView;

  (function () {
    var bindingMeta = {
      properties: {
        readonly: {
          binding: { consume: { name: 'readonly' } }
        },
        userAssistanceDensity: {
          binding: { consume: { name: 'userAssistanceDensity' } }
        },
        labelEdge: {
          binding: { consume: { name: 'labelEdge' } }
        }
      }
    };

var __oj_combobox_one_metadata = 
{
  "properties": {
    "asyncValidators": {
      "type": "Array<Object>",
      "value": []
    },
    "converter": {
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
          "type": "Array<string>|string"
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string"
        },
        "validatorHint": {
          "type": "Array<string>|string"
        }
      }
    },
    "filterOnOpen": {
      "type": "string",
      "enumValues": [
        "none",
        "rawValue"
      ],
      "value": "none"
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string",
          "value": ""
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
    "labelEdge": {
      "type": "string",
      "enumValues": [
        "inside",
        "none",
        "provided"
      ]
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "labelledBy": {
      "type": "string"
    },
    "maximumResultCount": {
      "type": "number",
      "value": 15
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "minLength": {
      "type": "number",
      "value": 0
    },
    "optionRenderer": {
      "type": "function"
    },
    "options": {
      "type": "Array<Object>|object"
    },
    "optionsKeys": {
      "type": "object",
      "properties": {
        "childKeys": {
          "type": "object",
          "properties": {
            "childKeys": {
              "type": "object",
              "properties": {
                "childKeys": {
                  "type": "object"
                },
                "children": {
                  "type": "string"
                },
                "label": {
                  "type": "string"
                },
                "value": {
                  "type": "string"
                }
              }
            },
            "children": {
              "type": "string"
            },
            "label": {
              "type": "string"
            },
            "value": {
              "type": "string"
            }
          }
        },
        "children": {
          "type": "string"
        },
        "label": {
          "type": "string"
        },
        "value": {
          "type": "string"
        }
      }
    },
    "pickerAttributes": {
      "type": "object",
      "properties": {
        "class": {
          "type": "string"
        },
        "style": {
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
    "required": {
      "type": "boolean",
      "value": false
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "filterFurther": {
          "type": "string"
        },
        "moreMatchesFound": {
          "type": "string"
        },
        "noMatchesFound": {
          "type": "string"
        },
        "oneMatchesFound": {
          "type": "string"
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
        }
      }
    },
    "userAssistanceDensity": {
      "type": "string",
      "enumValues": [
        "compact",
        "efficient",
        "reflow"
      ],
      "value": "reflow"
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
      "type": "Array",
      "value": []
    },
    "value": {
      "type": "any",
      "writeback": true
    },
    "valueOption": {
      "type": "object",
      "writeback": true,
      "properties": {
        "label": {
          "type": "string"
        },
        "value": {
          "type": "any"
        }
      }
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "reset": {},
    "setProperties": {},
    "setProperty": {},
    "showMessages": {},
    "validate": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {},
    "ojValueUpdated": {}
  },
  "extension": {}
};
    __oj_combobox_one_metadata.extension._WIDGET_NAME = 'ojCombobox';
    __oj_combobox_one_metadata.extension._INNER_ELEM = 'input';
    __oj_combobox_one_metadata.extension._GLOBAL_TRANSFER_ATTRS = [
      'aria-controls',
      'aria-label',
      'tabindex'
    ];
    __oj_combobox_one_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
    __oj_combobox_one_metadata.extension._TRACK_CHILDREN = 'immediate';
    oj.CustomElementBridge.register('oj-combobox-one', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_combobox_one_metadata, bindingMeta)
    });

var __oj_combobox_many_metadata = 
{
  "properties": {
    "asyncValidators": {
      "type": "Array<Object>",
      "value": []
    },
    "converter": {
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
          "type": "Array<string>|string"
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string"
        },
        "validatorHint": {
          "type": "Array<string>|string"
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string",
          "value": ""
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
    "labelEdge": {
      "type": "string",
      "enumValues": [
        "inside",
        "none",
        "provided"
      ]
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "labelledBy": {
      "type": "string"
    },
    "maximumResultCount": {
      "type": "number",
      "value": 15
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "minLength": {
      "type": "number",
      "value": 0
    },
    "optionRenderer": {
      "type": "function"
    },
    "options": {
      "type": "Array<Object>|object"
    },
    "optionsKeys": {
      "type": "object",
      "properties": {
        "childKeys": {
          "type": "object",
          "properties": {
            "childKeys": {
              "type": "object",
              "properties": {
                "childKeys": {
                  "type": "object"
                },
                "children": {
                  "type": "string"
                },
                "label": {
                  "type": "string"
                },
                "value": {
                  "type": "string"
                }
              }
            },
            "children": {
              "type": "string"
            },
            "label": {
              "type": "string"
            },
            "value": {
              "type": "string"
            }
          }
        },
        "children": {
          "type": "string"
        },
        "label": {
          "type": "string"
        },
        "value": {
          "type": "string"
        }
      }
    },
    "pickerAttributes": {
      "type": "object",
      "properties": {
        "class": {
          "type": "string"
        },
        "style": {
          "type": "string"
        }
      }
    },
    "placeholder": {
      "type": "string"
    },
    "rawValue": {
      "type": "Array<string>",
      "writeback": true,
      "readOnly": true
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "required": {
      "type": "boolean",
      "value": false
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "filterFurther": {
          "type": "string"
        },
        "moreMatchesFound": {
          "type": "string"
        },
        "noMatchesFound": {
          "type": "string"
        },
        "noMoreResults": {
          "type": "string"
        },
        "oneMatchesFound": {
          "type": "string"
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
        }
      }
    },
    "userAssistanceDensity": {
      "type": "string",
      "enumValues": [
        "compact",
        "efficient",
        "reflow"
      ],
      "value": "reflow"
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
      "type": "Array",
      "value": []
    },
    "value": {
      "type": "Array<any>",
      "writeback": true
    },
    "valueOptions": {
      "type": "Array<Object>",
      "writeback": true
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "reset": {},
    "setProperties": {},
    "setProperty": {},
    "showMessages": {},
    "validate": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {}
  },
  "extension": {}
};
    /* global __oj_combobox_many_metadata:false */
    __oj_combobox_many_metadata.extension._WIDGET_NAME = 'ojCombobox';
    __oj_combobox_many_metadata.extension._INNER_ELEM = 'input';
    __oj_combobox_many_metadata.extension._GLOBAL_TRANSFER_ATTRS = [
      'aria-controls',
      'aria-label',
      'tabindex'
    ];
    __oj_combobox_many_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
    __oj_combobox_many_metadata.extension._TRACK_CHILDREN = 'immediate';
    oj.CustomElementBridge.register('oj-combobox-many', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_combobox_many_metadata, bindingMeta)
    });

var __oj_select_one_metadata = 
{
  "properties": {
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
          "type": "Array<string>|string"
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string"
        },
        "validatorHint": {
          "type": "Array<string>|string"
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string",
          "value": ""
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
    "labelEdge": {
      "type": "string",
      "enumValues": [
        "inside",
        "none",
        "provided"
      ]
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "labelledBy": {
      "type": "string"
    },
    "maximumResultCount": {
      "type": "number",
      "value": 15
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "minimumResultsForSearch": {
      "type": "number",
      "value": 15
    },
    "optionRenderer": {
      "type": "function"
    },
    "options": {
      "type": "Array<Object>|object"
    },
    "optionsKeys": {
      "type": "object",
      "properties": {
        "childKeys": {
          "type": "object",
          "properties": {
            "childKeys": {
              "type": "object"
            },
            "children": {
              "type": "string"
            },
            "label": {
              "type": "string"
            },
            "value": {
              "type": "string"
            }
          }
        },
        "children": {
          "type": "string"
        },
        "label": {
          "type": "string"
        },
        "value": {
          "type": "string"
        }
      }
    },
    "pickerAttributes": {
      "type": "object",
      "properties": {
        "class": {
          "type": "string"
        },
        "style": {
          "type": "string"
        }
      }
    },
    "placeholder": {
      "type": "string"
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
        "filterFurther": {
          "type": "string"
        },
        "moreMatchesFound": {
          "type": "string"
        },
        "noMatchesFound": {
          "type": "string"
        },
        "oneMatchesFound": {
          "type": "string"
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
        "searchField": {
          "type": "string"
        }
      }
    },
    "userAssistanceDensity": {
      "type": "string",
      "enumValues": [
        "compact",
        "efficient",
        "reflow"
      ],
      "value": "reflow"
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
    "value": {
      "type": "any",
      "writeback": true
    },
    "valueOption": {
      "type": "object",
      "writeback": true,
      "properties": {
        "label": {
          "type": "string"
        },
        "value": {
          "type": "any"
        }
      }
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "reset": {},
    "setProperties": {},
    "setProperty": {},
    "showMessages": {},
    "validate": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {}
  },
  "extension": {}
};
    /* global __oj_select_one_metadata:false */
    __oj_select_one_metadata.extension._WIDGET_NAME = 'ojSelect';
    __oj_select_one_metadata.extension._INNER_ELEM = 'select';
    __oj_select_one_metadata.extension._GLOBAL_TRANSFER_ATTRS = [
      'aria-controls',
      'aria-label',
      'tabindex'
    ];
    __oj_select_one_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
    __oj_select_one_metadata.extension._TRACK_CHILDREN = 'immediate';
    oj.CustomElementBridge.register('oj-select-one', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_select_one_metadata, bindingMeta)
    });

var __oj_select_many_metadata = 
{
  "properties": {
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
          "type": "Array<string>|string"
        },
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
          "type": "Array<string>|string"
        },
        "validatorHint": {
          "type": "Array<string>|string"
        }
      }
    },
    "help": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string",
          "value": ""
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
    "labelEdge": {
      "type": "string",
      "enumValues": [
        "inside",
        "none",
        "provided"
      ]
    },
    "labelHint": {
      "type": "string",
      "value": ""
    },
    "labelledBy": {
      "type": "string"
    },
    "maximumResultCount": {
      "type": "number",
      "value": 15
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "minimumResultsForSearch": {
      "type": "number",
      "value": 15
    },
    "optionRenderer": {
      "type": "function"
    },
    "options": {
      "type": "Array<Object>|object"
    },
    "optionsKeys": {
      "type": "object",
      "properties": {
        "childKeys": {
          "type": "object",
          "properties": {
            "childKeys": {
              "type": "object"
            },
            "children": {
              "type": "string"
            },
            "label": {
              "type": "string"
            },
            "value": {
              "type": "string"
            }
          }
        },
        "children": {
          "type": "string"
        },
        "label": {
          "type": "string"
        },
        "value": {
          "type": "string"
        }
      }
    },
    "pickerAttributes": {
      "type": "object",
      "properties": {
        "class": {
          "type": "string"
        },
        "style": {
          "type": "string"
        }
      }
    },
    "placeholder": {
      "type": "string"
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
        "filterFurther": {
          "type": "string"
        },
        "moreMatchesFound": {
          "type": "string"
        },
        "noMatchesFound": {
          "type": "string"
        },
        "noMoreResults": {
          "type": "string"
        },
        "oneMatchesFound": {
          "type": "string"
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
        "searchField": {
          "type": "string"
        }
      }
    },
    "userAssistanceDensity": {
      "type": "string",
      "enumValues": [
        "compact",
        "efficient",
        "reflow"
      ],
      "value": "reflow"
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
    "value": {
      "type": "Array<any>",
      "writeback": true
    },
    "valueOptions": {
      "type": "Array<Object>",
      "writeback": true
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "reset": {},
    "setProperties": {},
    "setProperty": {},
    "showMessages": {},
    "validate": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {}
  },
  "extension": {}
};
    /* global __oj_select_many_metadata:false */
    __oj_select_many_metadata.extension._WIDGET_NAME = 'ojSelect';
    __oj_select_many_metadata.extension._INNER_ELEM = 'select';
    __oj_select_many_metadata.extension._GLOBAL_TRANSFER_ATTRS = [
      'aria-controls',
      'aria-label',
      'tabindex'
    ];
    __oj_select_many_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
    __oj_select_many_metadata.extension._TRACK_CHILDREN = 'immediate';
    oj.CustomElementBridge.register('oj-select-many', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_select_many_metadata, bindingMeta)
    });
  })();

  /**
   * @private
   */
  const _ComboUtils = {
    // native renderMode: marker class for generated options list
    GENERATED_OPTIONS_SELECTOR: 'oj-select-options-generated',

    // Theme names
    THEME: {
      REDWOOD: 'redwood'
    },

    KEY: {
      TAB: 9,
      ENTER: 13,
      ESC: 27,
      SPACE: 32,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      SHIFT: 16,
      CTRL: 17,
      ALT: 18,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      HOME: 36,
      END: 35,
      BACKSPACE: 8,
      DELETE: 46,

      CODE: {
        KEY_V: 'KeyV'
      },

      isControl: function (e) {
        const k = e.which || e.keyCode;
        switch (k) {
          case _ComboUtils.KEY.SHIFT:
          case _ComboUtils.KEY.CTRL:
          case _ComboUtils.KEY.ALT:
            return true;
          default:
            if (e.metaKey) {
              return true;
            }
            return false;
        }
      },

      isFunctionKey: function (k) {
        var key = k.which || k.keyCode || k;
        return key >= 112 && key <= 123;
      },

      isPasteAction: function (event) {
        let agentInfo = oj.AgentUtils.getAgentInfo();
        let os = agentInfo.os;
        let code = event.code;
        return (
          code === _ComboUtils.KEY.CODE.KEY_V &&
          ((os === oj.AgentUtils.OS.MAC && event.metaKey) ||
            (os !== oj.AgentUtils.OS.MAC && event.ctrlKey))
        );
      }
    },

    /**
     * Helper style classes
     */
    STYLE_CLASS: {
      HIDDEN: 'oj-helper-hidden'
    },

    /*
     * The default fetch size from the data provider
     */
    DEFAULT_FETCH_SIZE: 15,

    /*
     * The default fetch size to fetch all the data from the data provider
     */
    DEFAULT_FETCH_ALL_SIZE: -1,

    /*
     * The fetch size from the data provider for local filtering
     */
    FILTERING_FETCH_SIZE_MIN: 100,
    FILTERING_FETCH_SIZE_MAX: 500,

    /*
     * The fetch size factor based on maximumResultCount for local filtering
     */
    FILTERING_FETCH_SIZE_MRC_TIMES: 7,

    /*
     * The default delay in milliseconds between when a keystroke occurs
     * and when a search is performed to get the filtered options.
     */
    DEFAULT_QUERY_DELAY: 70,

    /**
     * The default delay in milliseconds after which the loading indicator should be shown
     * if the component is still loading data.
     */
    DEFAULT_LOADING_INDICATOR_DELAY: 250,

    ValueChangeTriggerTypes: {
      ENTER_PRESSED: 'enter_pressed',
      OPTION_SELECTED: 'option_selected',
      BLUR: 'blur',
      SEARCH_ICON_CLICKED: 'search_icon_clicked'
    },

    lastMousePosition: { x: 0, y: 0 },
    nextUid: (function () {
      var counter = 1;
      return function () {
        var ret = counter;
        counter += 1;
        return ret;
      };
    })(),

    // TODO:
    scrollBarDimensions: null,

    /**
     * Determine if the current theme is redwood or older theme
     */
    isLegacyTheme: function () {
      const themeJSON = ThemeUtils.parseJSONFromFontFamily('oj-theme-json');
      return themeJSON.behavior !== _ComboUtils.THEME.REDWOOD;
    },

    // _ComboUtils
    /*
     * 4-10 times faster .each replacement
     * it overrides jQuery context of element on each iteration
     */
    each2: function (list, c) {
      var j = $.isFunction(list[0]) ? $(list[0]()) : $(list[0]);
      var i = -1;
      var l = list.length;
      while (
        // eslint-disable-line
        ++i < l && // eslint-disable-line
        (j.context = j[0] = $.isFunction(list[0]) ? list[i]() : list[i]) && // eslint-disable-line
        c.call(j[0], i, j) !== false // i=index, j=jQuery object
      ) {} // eslint-disable-line
      return list;
    },

    // _ComboUtils
    measureScrollbar: function () {
      var $template = $("<div class='oj-listbox-measure-scrollbar'></div>");
      $template.appendTo('body'); // @HTMLUpdateOK
      var dim = {
        width: $template.width() - $template[0].clientWidth,
        height: $template.height() - $template[0].clientHeight
      };
      $template.remove();
      return dim;
    },

    // _ComboUtils
    /*
     * Splits the string into an array of values, trimming each value.
     * An empty array is returned for nulls or empty
     */
    splitVal: function (string, separator) {
      var val;
      var i;
      var l;
      if (string === null || string.length < 1) {
        return [];
      }
      val = string.split(separator);
      for (i = 0, l = val.length; i < l; i++) {
        val[i] = $.trim(val[i]);
      }
      return val;
    },

    // _ComboUtils
    getSideBorderPadding: function (element) {
      return element.outerWidth(false) - element.width();
    },

    // _ComboUtils
    installKeyUpChangeEvent: function (element) {
      var key = 'keyup-change-value';
      element.on('keydown', function () {
        if ($.data(element, key) === undefined) {
          $.data(element, key, element.val());
        }
      });

      element.on('keyup', function (e) {
        if ((e.which || e.keyCode) === _ComboUtils.KEY.ENTER) {
          //  - select and combobox stop keyboard event propegation
          e.preventDefault();
          return;
        }
        var val = $.data(element, key);
        if (val !== undefined && element.val() !== val) {
          $.removeData(element, key);
          element.trigger('keyup-change');
        }
      });
    },

    // _ComboUtils
    getSearchText: function (event) {
      var searchText;
      //  - start typing 1 letter on select box, but 2 letters displayed on searchbox
      // In case of chrome/IE, typed key is added on search element as we move focus from select element to search
      // But this is not happening on firefox and hence we need to set it as part of select element's event
      // and kill the event to avoid duplicate charecters on search field later in IE/chrome.
      // Dropdown popup will be opened on up/down/left/right arrows so excluding those as search text.

      var keycode = event.which || event.keyCode;
      if (
        event &&
        event.type === 'keydown' &&
        (keycode === 32 || // spacebar
          (keycode > 47 && keycode < 58) || // number keys
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223))
      ) {
        // [\]' (in order)
        // JET-30104 - typing ">" in oj-select-one filter, causes a different character to appear
        // KeyboardEvent.keyCode is deprecated in favor of KeyboardEvent.key & KeyboardEvent.code
        // For our use case, KeyboardEvent.key property returns the value of the key pressed by the user,
        // taking into consideration the state of modifier keys such as Shift as well as the keyboard locale and layout
        // Even though it has cross-browser compatibility, it is better to have a fallback mechanism.
        if (event.key != null) {
          searchText = event.key;
        } else {
          // fallback to using keyCode
          // Numpad keys return different keyCodes for the numbers
          // String.fromCharCode would return 'a' for '1' and so forth
          // Need to convert those keyCodes to regular number keyCodes
          if (keycode >= 96 && keycode <= 105) {
            keycode -= 48;
          }

          searchText = String.fromCharCode(keycode);
          // keydown event always return uppercase letter
          if (!event.shiftKey) {
            searchText = searchText.toLowerCase();
          }
        }
        //  - select and combobox stop keyboard event propegation
        event.preventDefault();
      }
      return searchText;
    },

    /**
     * Escapes the special characters from the expression
     *
     * @param {string} exp
     * @return {string} The escaped and valid regexp string literal
     *
     * @memberof! _ComboUtils
     * @static
     * @ignore
     */
    escapeRegExp: function (exp) {
      return exp.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    },

    // _ComboUtils
    /*
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    installFilteredMouseMove: function (element) {
      element.on('mousemove', function (e) {
        var lastpos = _ComboUtils.lastMousePosition;
        if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
          $(e.target).trigger('mousemove-filtered', e);
          _ComboUtils.lastMousePosition.x = e.pageX;
          _ComboUtils.lastMousePosition.y = e.pageY;
        }
      });
    },

    // _ComboUtils
    thunk: function (formula) {
      var evaluated = false;
      var value;
      return function () {
        if (evaluated === false) {
          value = formula();
          evaluated = true;
        }
        return value;
      };
    },

    // _ComboUtils
    _focus: function (widget, $el) {
      // clear any existing focus timers
      if (widget._focusTimer != null) {
        widget._focusTimer.clear();
        // eslint-disable-next-line no-param-reassign
        delete widget._focusTimer;
      }

      if ($el[0] === document.activeElement) {
        return;
      }

      // add busy state
      var resolveBusyState = _ComboUtils._addBusyState(widget.container, 'setting focus');

      // Set a 40 timeout. In voiceover mode, previous partial value was read. See 
      // This happens on ios Safari only, not Chrome. Setting a 40 timeout fixes the issue
      // on Safari in voiceover.
      /* set the focus in a timeout - that way the focus is set after the processing
           of the current event has finished - which seems like the only reliable way
           to set focus */
      var timer = TimerUtils.getTimer(40);
      timer.getPromise().then(function (hasCompleted) {
        if (!hasCompleted) {
          // The timer has been cancelled before execution
          // so resolve the busystate and return
          resolveBusyState();
          return;
        }

        var el = $el[0];
        var pos = $el.val().length;
        var range;
        $el.focus();

        /* make sure el received focus so we do not error out when trying to manipulate the caret.
               sometimes modals or others listeners may steal it after its set */
        if ($el.is(':visible') && el === document.activeElement) {
          /* after the focus is set move the caret to the end, necessary when we val()
                 just before setting focus */
          if (el.setSelectionRange) {
            el.setSelectionRange(pos, pos);
          } else if (el.createTextRange) {
            range = el.createTextRange();
            range.collapse(false);
            range.select();
          }
        }

        resolveBusyState();
      });
      // Store the timer in the widget
      // eslint-disable-next-line no-param-reassign
      widget._focusTimer = timer;
    },

    // _ComboUtils
    getCursorInfo: function (_el) {
      var el = $(_el)[0];
      var offset = 0;
      var length = 0;
      if ('selectionStart' in el) {
        offset = el.selectionStart;
        length = el.selectionEnd - offset;
      } else if ('selection' in document) {
        el.focus(); // Fixed???
        var sel = document.selection.createRange();
        length = document.selection.createRange().text.length;
        sel.moveStart('character', -el.value.length);
        offset = sel.text.length - length;
      }
      return { offset: offset, length: length };
    },

    // _ComboUtils
    killEvent: function (event) {
      event.preventDefault();
    },

    /**
     * Creates a kill event handler that supports exception.
     *
     * @param {string[]} selectors An exception selectors array. If the event target matches one of the selectors
     *                             the event will not be killed.
     * @param {Event} event The event object that needs to be killed
     */
    killEventWithExceptions: function (selectors, event) {
      const target = $(event.target);
      if (selectors.some((selector) => target.is(selector))) return;
      // If the element is not an exception, kill the event
      _ComboUtils.killEvent(event);
    },

    // _ComboUtils
    /*
     * Produces a query function that works with a local array
     */
    local: function (options, optKeys) {
      var data = options; // data elements
      var dataText;
      var tmp;
      // function used to retrieve the text portion of a data item that is matched against the search
      var text = function (item) {
        return '' + item.label;
      };

      if ($.isArray(data)) {
        tmp = data;
        data = {
          results: tmp
        };
      }
      if ($.isFunction(data) === false) {
        tmp = data;
        data = function () {
          return tmp;
        };
      }
      var dataItem = data();
      // select with no options
      if (dataItem && dataItem.text) {
        text = dataItem.text;
        // if text is not a function we assume it to be a key name
        if (!$.isFunction(text)) {
          // we need to store this in a separate variable because in the next step data gets reset
          // and data.text is no longer available
          dataText = dataItem.text;
          text = function (item) {
            return item[dataText];
          };
        }
      }
      return function (query) {
        var t = query.term;
        var filtered = {
          results: []
        };

        // if optionsKeys is set, we need to do the key mapping, don't return
        if (t === '' && !optKeys) {
          query.callback(data());
          return;
        }

        if (data()) {
          _ComboUtils.each2($(data().results), function (i, datum) {
            _ComboUtils._processData(query, datum, filtered.results, optKeys, true, text);
          });
        }
        query.callback(filtered);
      };
    },

    // native renderMode
    createOptionTag: function (depth, value, label, formatFunc) {
      var node = $('<option>');
      node.addClass(
        'oj-listbox-result oj-listbox-result-selectable oj-listbox-results-depth-' + depth
      );

      // option label
      node.attr('role', 'option');
      node.attr('id', 'oj-listbox-result-label-' + _ComboUtils.nextUid());

      node.text(formatFunc(label));
      node.attr('value', value);

      return node;
    },

    // native renderMode
    createOptgroupTag: function (container, label, formatFunc) {
      var node = $('<optgroup>');
      node.addClass('oj-listbox-results-sub');
      node.attr('label', formatFunc(label));

      container.addClass('oj-listbox-result-with-children');
      return node;
    },

    // native renderMode
    // This method turns a list of <ul>s and <li>s into <optgroup>s and <option>s
    listPopulateResults: function (_container, _list, formatFunc) {
      var populate = function (container, list, depth) {
        var node;
        var li;
        var label;
        var ul;

        list.each(function () {
          li = $(this);

          if (li.is('li')) {
            // process <li> with children
            if (li.children('ul').length > 0) {
              // get the <li> text only dont include its descendants
              label = li
                .contents()
                .filter(function () {
                  return this.nodeType !== 1 || this.tagName.toLowerCase() !== 'ul';
                })
                .text();

              node = _ComboUtils.createOptgroupTag(container, label, formatFunc);

              ul = li.children('ul');
              populate(node, ul.children(), depth + 1);
            } else {
              // process <li> without children
              node = _ComboUtils.createOptionTag(
                depth,
                li.attr('oj-data-value'),
                li.text(),
                formatFunc
              );
            }
            node.appendTo(container); // @HTMLUpdateOK
          }
        });
      };

      populate(_container, _list, 0);
    },

    // native renderMode
    // This method turns <oj-optgroup>s and <oj-option>s into <optgroup>s and <option>s
    ojOptionPopulateResults: function (_container, _ojOptions, formatFunc) {
      var populate = function (container, ojOptions, depth) {
        var node;
        var ojOption;
        var label;

        ojOptions.each(function () {
          ojOption = $(this);

          if (ojOption.is('oj-option')) {
            label = ojOption.text() || ojOption.attr('label');
            node = _ComboUtils.createOptionTag(depth, ojOption.prop('value'), label, formatFunc);
          } else if (ojOption.is('oj-optgroup')) {
            label = ojOption.text() || ojOption.attr('label');
            node = _ComboUtils.createOptgroupTag(container, label, formatFunc);
            populate(node, ojOption.children(), depth + 1);
          } else if (ojOption.is('option')) {
            // the option element created for the placeholder in native mode
            node = ojOption;
          }
          node.appendTo(container); // @HTMLUpdateOK
        });
      };

      populate(_container, _ojOptions, 0);
    },

    // native renderMode
    lookupOptionKeys: function (result, optionsKeys, _key) {
      var key = optionsKeys[_key] || _key;
      return result[key];
    },

    // native renderMode
    // This method turns a JSON object into <optgroup>s and <option>s
    arrayPopulateResults: function (_container, _arrlist, formatFunc, _optionsKeys) {
      var populate = function (container, arrlist, depth, optionsKeys) {
        var item;
        var node;
        var children;
        var label;
        var value;
        for (var i = 0, l = arrlist.length; i < l; i++) {
          item = arrlist[i];

          // process children
          children = _ComboUtils.lookupOptionKeys(item, optionsKeys, 'children');
          label = _ComboUtils.lookupOptionKeys(item, optionsKeys, 'label');

          if (children && children.length > 0) {
            node = _ComboUtils.createOptgroupTag(container, label, formatFunc);
            populate(node, children, depth + 1, optionsKeys.childKeys || {});
          } else {
            // without children
            value = _ComboUtils.lookupOptionKeys(item, optionsKeys, 'value');
            node = _ComboUtils.createOptionTag(depth, value, label, formatFunc);
          }

          node.appendTo(container); // @HTMLUpdateOK
        }
      };

      populate(_container, _arrlist, 0, _optionsKeys || {});
    },

    // native renderMode
    cleanupResults: function (container) {
      container.children().not('oj-option, oj-optgroup').remove();
      container.removeClass('oj-listbox-result-with-children');
    },

    // _ComboUtils
    _addBusyState: function (element, description) {
      var desc = "The component identified by '" + element.attr('id') + "' " + description;
      var busyStateOptions = { description: desc };
      var busyContext = Context.getContext(element[0]).getBusyContext();

      return busyContext.addBusyState(busyStateOptions);
    },

    _clearBusyState: function (resolveFunc) {
      if (resolveFunc) {
        resolveFunc();
      }
    },

    isDataProvider: function (data) {
      return data && oj.DataProviderFeatureChecker
        ? oj.DataProviderFeatureChecker.isDataProvider(data)
        : false;
    },

    isTreeDataProvider: function (data) {
      return data && oj.DataProviderFeatureChecker
        ? oj.DataProviderFeatureChecker.isTreeDataProvider(data)
        : false;
    },

    getDataProvider: function (options) {
      if (options) {
        var dataProvider = options._dataProvider || options.options;
        if (_ComboUtils.isDataProvider(dataProvider)) {
          return dataProvider;
        }
      }
      return null;
    },

    /**
     * Creates a KeySet implementation using the dataprovider's createOptimizedKeySet
     * if one is provided or uses the default oj.ojkeyset.KeySetImpl
     *
     * @param {oj.ojSelect|oj.ojCombobox} widget The instance of select/combobox widget
     * @param {Array<V>=} initialKeys An optional array representing the initial keys
     *
     * @return {Set<V>} the keyset instance
     *
     * @memberof _ComboUtils
     * @static
     * @ignore
     */
    getDataProviderKeySet: function (widget, initialKeys) {
      let dataProvider = _ComboUtils.getDataProvider(widget.options);
      if (dataProvider != null) {
        if (typeof dataProvider.createOptimizedKeySet === 'function') {
          return dataProvider.createOptimizedKeySet(initialKeys);
        }
      }
      // eslint-disable-next-line new-cap
      return new ojSet(initialKeys);
    },

    clearDataProviderWrapper: function (widget) {
      // eslint-disable-next-line no-param-reassign
      widget.options._dataProvider = null;
    },

    isDataProviderWrapped: function (widget) {
      return widget.options._dataProvider != null;
    },

    //  - need to be able to specify the initial value of select components bound to dprv
    // traversal using depth first search
    // return an oj.Option object if found otherwise return null
    _findOption: function (ojOption, value) {
      if (oj.Object.compareValues(value, ojOption.value)) {
        return ojOption;
      } else if (ojOption.children) {
        var children = ojOption.children;
        var result;
        for (var i = 0; i < children.length; i++) {
          result = _ComboUtils._findOption(children[i], value);
          if (result) {
            return result;
          }
        }
      }
      // not found
      return null;
    },

    findOption: function (arOpts, value) {
      //  - create selectone with a valueoption and a value of object datatype doesn't work
      // need to check if arOpts is an array
      if (Array.isArray(arOpts)) {
        for (var i = 0, len = arOpts.length; i < len; i++) {
          var result = _ComboUtils._findOption(arOpts[i], value);
          if (result) {
            return result;
          }
        }
        // not found
        return null;
      }
      return _ComboUtils._findOption(arOpts, value);
    },

    findOptions: function (ojOptgroup, values) {
      var ojOptionArr = [];
      for (var i = 0; i < values.length; i++) {
        var option = _ComboUtils.findOption(ojOptgroup, values[i]);
        if (option) {
          ojOptionArr.push(option);
        }
      }

      return ojOptionArr;
    },

    //  - oj.tests.input.combobox.testcombobox display value mismatch automation failure
    findOptionFromResult: function (context, val, data) {
      var queryResult = _ComboUtils.getLastQueryResult(context);
      var match;
      if (queryResult) {
        match = _ComboUtils.findOption(queryResult, val);
      }
      // for multiChoice look for data from selected options when no match is found
      if (context.ojContext.multiple && !match) {
        match = _ComboUtils.getSelectedOptionData(context, val);
      }
      if (match) {
        var optionData = { value: val, label: match.label };
        if (match.data && match.metadata) {
          optionData.data = match.data;
          optionData.metadata = match.metadata;
        }
        return optionData;
      }
      return data;
    },

    // merge value and valueOption, value wins if both are specified
    // return true if the value is specified and it's not contained in valueOptions
    mergeValueAndValueOptions: function (ojContext, options) {
      var value = ojContext.options.value;
      var resolveLater = false;

      // multiple
      if (ojContext.multiple) {
        var valueOptions = ojContext.options.valueOptions;
        // value specified
        if (value && value.length > 0) {
          // both value and valueOptions specified, find the option for the value
          var ojoptionArr;
          if (valueOptions && valueOptions.length) {
            ojoptionArr = _ComboUtils.findOptions(valueOptions, value);
          }
          // update valueOptions if more than one
          if (!ojoptionArr || ojoptionArr.length !== valueOptions.length) {
            // need to find out the label and setValueOptions later
            resolveLater = true;
          }
        } else if (valueOptions) {
          // value not specified
          _ComboUtils.syncValueWithValueOptions(ojContext, valueOptions, value, null, options);
        }
      } else {
        // single
        var valueOption = ojContext.options.valueOption;
        // value specified
        if (value !== null && value !== undefined) {
          // both value and valueOption specified, find the option for the value
          var ojoption;
          if (valueOption) {
            ojoption = _ComboUtils.findOption(valueOption, value);
          }
          // update valueOption
          if (!ojoption) {
            // need to find out the label and setValueOption later
            resolveLater = true;
          }
        } else if (valueOption) {
          // value not specified
          _ComboUtils.syncValueWithValueOption(ojContext, valueOption, value, null, options);
        }
      }

      return resolveLater;
    },

    // single selection: keep value in sync with valueOption
    // param nativeRender can be either null or boolean
    // null: don't update display label
    // true: update display label in native mode
    // false: update display label in jet mode
    syncValueWithValueOption: function (ojContext, valueOption, value, nativeRender, options) {
      var newVal;
      var updateLabel = true;
      var isCustomElement = ojContext._IsCustomElement();
      //  - resetting value when value-option and placeholder are set throws exception
      if (_ComboUtils.isValueOptionsForPlaceholder(false, valueOption)) {
        if (_ComboUtils.isValueForPlaceholder(false, value)) {
          newVal = value;
          updateLabel = false;
        } else {
          newVal = null;
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (isCustomElement) {
          newVal = valueOption ? valueOption.value : null;
        } else {
          newVal = valueOption ? [valueOption.value] : null;
        }
      }
      if (oj.Object.compareValues(newVal, value)) {
        //  - lov does not show the value-option label when it's updated later
        // if the value is the same, we still need to update display label
        if (nativeRender === true) {
          var selElem = ojContext.element[0];
          $(selElem.options[selElem.selectedIndex]).text(_ComboUtils.getLabel(valueOption));
        } else if (nativeRender === false) {
          var context = ojContext.select || ojContext.combobox;
          if (context && updateLabel) {
            context._updateSelection(valueOption);
          }
        }
      } else {
        _ComboUtils._forceSetValue(ojContext, newVal, options);
      }
    },

    // multiple selection: keep value in sync with valueOptions
    // param nativeRender can be either null or boolean
    // null: don't update display label
    // true: update display label in native mode
    // false: update display label in jet mode
    syncValueWithValueOptions: function (ojContext, valueOptions, value, nativeRender, options) {
      var newVal;
      var updateLabel = true;
      if (_ComboUtils.isValueOptionsForPlaceholder(true, valueOptions)) {
        if (_ComboUtils.isValueForPlaceholder(true, value)) {
          newVal = value;
          updateLabel = false;
        } else {
          newVal = _ComboUtils.getValueForPlaceholder(true);
        }
        if (!oj.Object.compareValues(newVal, value)) {
          _ComboUtils._forceSetValue(ojContext, newVal, options);
        }
      } else if (valueOptions) {
        newVal = [];
        for (var i = 0; i < valueOptions.length; i++) {
          newVal.push(valueOptions[i].value);
        }

        if (oj.Object.compareValues(newVal, value)) {
          //  - lov does not show the value-option label when it's updated later
          // if the value is the same, we still need to update display label
          if (nativeRender === true) {
            var s = 0;
            ojContext.element.find('option').each(function () {
              if (this.selected) {
                var label = _ComboUtils.getLabel(valueOptions[s]);
                // eslint-disable-next-line eqeqeq
                if (this.text != label) {
                  $(this).text(label);
                }
                s += 1;
              }
            });
          } else if (nativeRender === false) {
            var context = ojContext.select || ojContext.combobox;
            if (context && updateLabel) {
              context._updateSelection(valueOptions);
            }
          }
        } else {
          _ComboUtils._forceSetValue(ojContext, newVal, options);
        }
      }
    },

    // _ComboUtils
    // Internally set the value option, skipping validation and the check for different value
    _forceSetValue: function (_ojContext, newVal, options) {
      var ojContext = _ojContext;
      var _options = options || {};
      // JET-43071 - messagescustom property doesn't work when initial render
      // During the initial setup, there will not be any component messages,
      // but there can be custom messages. So, we need to make sure that we
      // do not clear them off when we sync value and valueOptions.
      // There are two places where doNotClearMessages flag is checked in the _SetValue call chain.
      // One place checks this in flags.doNotClearMessages (_AsyncValidate) and
      // another one checks this in flags._context.doNotClearMessages (_AfterSetOptionValue)
      var flags = {
        doNotClearMessages: _options.doNotClearMessages,
        doValueChangeCheck: false,
        _context: {
          doNotClearMessages: _options.doNotClearMessages,
          internalSet: true,
          writeback: true
        }
      };

      // FIX  - VALUE UNCHANGED IN DISABLED SELECT WHEN CHANGING BOUND VALUEOPTION
      // _SetValue always performs validation, which calls _CanSetValue, which returns false if
      // the component is disabled, thereby disallowing the set.  We override _CanSetValue on the
      // component in order to force it to return true in this case.
      ojContext.forceCanSetValue = true;
      try {
        ojContext._SetValue(newVal, null, flags);
      } finally {
        delete ojContext.forceCanSetValue;
      }
    },

    // whether placeholder is specified
    isPlaceholderSpecified: function (options) {
      return typeof options.placeholder === 'string';
    },

    //  - resetting value when value-option and placeholder are set throws exception
    getFixupValueOptionsForPlaceholder: function (multiple) {
      return multiple ? [] : { value: null, label: null };
    },

    // if placeholder is specified, in addition to the normalized valueOptions format
    // (multiple: [], single: {value: null, label: null}, the valueOption(s) recognized in
    // this method also can be used in init or set
    // multiple: null, undefiend and []
    // single: null, undefined, {}, {value:null} and {value: null, label: null}
    isValueOptionsForPlaceholder: function (multiple, valOpts) {
      return (
        valOpts == null ||
        (!multiple && valOpts.value == null) ||
        oj.Object.compareValues(valOpts, _ComboUtils.getFixupValueOptionsForPlaceholder(multiple))
      );
    },

    // return normalized valueOption(s) if placeholder is selected
    // otherwise return @parm valOpts
    getValueOptionsForPlaceholder: function (ojContext, valOpts) {
      var multiple = ojContext.multiple;
      if (
        ojContext._IsCustomElement() &&
        _ComboUtils.isPlaceholderSpecified(ojContext.options) &&
        _ComboUtils.isValueOptionsForPlaceholder(multiple, valOpts)
      ) {
        // eslint-disable-next-line no-param-reassign
        valOpts = _ComboUtils.getFixupValueOptionsForPlaceholder(multiple);
      }
      return valOpts;
    },

    getValueForPlaceholder: function (multiple) {
      return multiple ? [] : '';
    },

    isValueForPlaceholder: function (multiple, value) {
      return (
        value == null || oj.Object.compareValues(value, _ComboUtils.getValueForPlaceholder(multiple))
      );
    },

    //  - need to be able to specify the initial value of select components bound to dprv
    setValueOptions: function (ojContext, valueOptions) {
      var context = {
        internalSet: true,
        changed: true,
        writeback: true
      };
      var opts = _ComboUtils.getOpts(ojContext);
      var isDataProvider = opts ? _ComboUtils.isDataProvider(opts.options) : false;
      var newValueOptions;
      if (ojContext.multiple) {
        var valueOptionsData = [];
        var valueOptionsMetadata = [];
        if (valueOptions && valueOptions.length) {
          newValueOptions = [];
          for (var i = 0; i < valueOptions.length; i++) {
            newValueOptions.push({ value: valueOptions[i].value, label: valueOptions[i].label });

            if (isDataProvider) {
              valueOptionsData.push(valueOptions[i].data);
              valueOptionsMetadata.push(valueOptions[i].metadata);
            }
          }
        } else {
          newValueOptions = valueOptions;
        }
        // set the 'valueOptions' data and metadata in the context
        context = _ComboUtils.getContextWithExtraData(
          context,
          opts,
          valueOptionsData,
          valueOptionsMetadata
        );
        ojContext.option('valueOptions', newValueOptions, { _context: context });
        // Set the flag to indicate the value option is set internally by the component
        // We use this information only for oj-select-many, so set the flag only for select
        if (ojContext.select != null) {
          // eslint-disable-next-line no-param-reassign
          ojContext.isValueOptionsSetInternally = true;
        }

        //  - placeholder is not displayed after removing selections from select many
        // update internal valueOptions
        if (opts) {
          opts.valueOptions = newValueOptions;
        }
      } else {
        var valopt = valueOptions;
        if (Array.isArray(valueOptions)) {
          valopt = valueOptions[0];
        }
        // set the 'valueOption' data and metadata in the context
        if (valopt) {
          context = _ComboUtils.getContextWithExtraData(context, opts, valopt.data, valopt.metadata);
        }
        //  - resetting value when value-option and placeholder are set throws exception
        if (valopt && !_ComboUtils.isValueOptionsForPlaceholder(ojContext.multiple, valopt)) {
          newValueOptions = { value: valopt.value, label: valopt.label };
        } else {
          newValueOptions = valopt;
        }
        ojContext.option('valueOption', newValueOptions, { _context: context });
        // Set the flag to indicate the value option is set internally by the component
        // We use this information only for oj-select-one, so set the flag only for select
        if (ojContext.select != null) {
          // eslint-disable-next-line no-param-reassign
          ojContext.isValueOptionsSetInternally = true;
        }

        //  - placeholder is not displayed after removing selections from select many
        // update internal valueOption
        if (opts) {
          opts.valueOption = newValueOptions;
        }
      }
    },

    // update display label(s) and valueOption(s) after value was set
    updateValueOptions: function (context) {
      //  - qunit: failure across browsers in select tests
      if (!context) {
        return;
      }

      var element = context.datalist ? context.datalist : context.opts.element;
      context.opts.initSelection.call(null, element, function (_selected) {
        var multiple = context.ojContext.multiple;
        var selected = _selected;

        // in combobox, values may be new entries
        if (selected == null && context._classNm === 'oj-combobox') {
          var value = context.ojContext.options.value;
          if (multiple) {
            selected = [];
            for (var i = 0; i < value.length; i++) {
              selected.push(context.opts.manageNewEntry(value[i]));
            }
          } else {
            selected = context.opts.manageNewEntry(value);
          }
        }
        if (selected) {
          context.setValOpts(selected);
          if (multiple) {
            context._updateSelection(selected);
          } else {
            context._updateSelectedOption(selected);
          }
          context._SyncRawValue();
        }
      });
    },

    /*  - need to be able to specify the initial value of select components bound to dprv
     * If both dataProvider and valueOption[s] are specified, use valueOption[s[ for display values.
     * If valueOption[s] is not specified or a selected value is missing then we will fetch the real data
     * from the dataProvider like before.
     * return true if valueOption[s] is applied, false otherwise
     */
    applyValueOptions: function (context, options) {
      if (
        context &&
        !context.ojContext._resolveValueOptionsLater &&
        (context._classNm === 'oj-combobox' || context._classNm === 'oj-select')
      ) {
        var isMultiple = context.ojContext.multiple;
        var valueOptions = isMultiple ? options.valueOptions : options.valueOption;

        //  - resetting value when value-option and placeholder are set throws exception
        //  - placeholder is not displayed after removing selections from select many
        if (_ComboUtils.isValueOptionsForPlaceholder(isMultiple, valueOptions)) {
          return false;
        }
        if (valueOptions) {
          context._updateSelection(valueOptions);
          return true;
        }
      }
      return false;
    },

    isValueChanged: function (widget) {
      return widget._valueHasChanged;
    },

    setValueChanged: function (widget, val) {
      // eslint-disable-next-line no-param-reassign
      widget._valueHasChanged = val;
    },

    // check if the component is in invalid state due to component error messages
    // and not due to custom error messages defined via messagesCustom attribute.
    hasInvalidComponentMessages: function (context) {
      return !context.isValid() && context._hasInvalidComponentMessagesShowing();
    },

    /*
     * If dataProvider is used,
     * wrap a ListViewDataProviderView or TreeViewDataProviderView around it
     * and save the wrapper
     */
    wrapDataProviderIfNeeded: function (widget, opts) {
      var wOptions = widget.options;
      var dataProvider = wOptions.options;

      if (_ComboUtils.isDataProvider(dataProvider)) {
        var wrapper;
        var optionsKeys = wOptions.optionsKeys || {};

        var isTree = _ComboUtils.isTreeDataProvider(dataProvider);

        // Wrap the data provider in a TreeDataProviderView or ListDataProviderView
        if (
          (isTree && !(dataProvider instanceof TreeDataProviderView)) ||
          (!isTree && !(dataProvider instanceof ListDataProviderView))
        ) {
          var mapFields = function (item) {
            var data = item.data;
            var mappedItem = {};
            mappedItem.data = {};

            // copy all the fields
            var keys = Object.keys(data);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              var value = data[key];
              mappedItem.data[key] = value;
            }

            // map label field
            //  COMBO-BOX TRIGGERS VALUE CHANGE WITH LABEL IF OPTIONS-KEYS.LABEL POINTS AT NUMBER FIELD
            // Enforce label to be always strings
            if (optionsKeys.label != null) {
              mappedItem.data.label = String(data[optionsKeys.label]);
            } else if (data.label != null) {
              mappedItem.data.label = String(data.label);
            }
            // map value field
            if (optionsKeys.value != null) {
              mappedItem.data.value = data[optionsKeys.value];
            }

            mappedItem.metadata = { key: data[optionsKeys.value || 'value'] };

            return mappedItem;
          };
          // create ListDataProviderView or TreeDataProviderView with dataMapping
          wrapper = isTree
            ? new TreeDataProviderView(dataProvider, { dataMapping: { mapFields: mapFields } })
            : new ListDataProviderView(dataProvider, { dataMapping: { mapFields: mapFields } });
        }
        // save the data provider or wrapper
        if (wrapper) {
          wOptions._dataProvider = wrapper;
          // update internal wrapper
          if (opts) {
            // eslint-disable-next-line no-param-reassign
            opts._dataProvider = wrapper;
          }
        }
      }
    },

    /**
     * get display label. If label is missing, String(value) will be returned
     * @private
     */
    getLabel: function (item) {
      if (item != null) {
        //  - number converter with comboboxes fails on zero value entry
        // if label is null or undefined use value
        return item.label != null ? item.label : String(item.value);
      }
      return undefined;
    },

    /**
     * data provider event handler
     * @private
     */
    _handleDataProviderEvents: function (widget, event) {
      var resolveBusyState = _ComboUtils._addBusyState(
        widget.widget(),
        'updating value on dataprovider mutation event'
      );
      // JET-39059 - oj-select-one does not set initial value on first binding
      // DataProvider events are handled synchronously, while the
      // bindings are updated asynchronously. So, we need to react to
      // the DataProvider events on the next tick and then wait for
      // the throttle promise to resolve.
      Promise.resolve()
        .then(function () {
          return widget._GetThrottlePromise();
        })
        .then(function () {
          // Once the framework delivers the throttled updates, the value might still
          // be getting updated, so we need to wait for it to be done before proceeding
          return widget._getValueUpdatePromise();
        })
        .then(function () {
          // Once the value is updated, call setOption method to do necessary
          // tasks for the mutation event
          if (event.type === 'mutate') {
            _ComboUtils._handleDataProviderMutationEvent(widget, event);
          }
          widget._setOption('options', widget.options.options);
          resolveBusyState();
        });
    },

    /**
     * Handles DataProvider mutation event
     *
     * @param {ojSelect|ojCombobox} widget The widget instance
     * @param {Event} event The dataprovider event
     *
     * @private
     * @static
     * @memberof _ComboUtils
     */
    _handleDataProviderMutationEvent: function (widget, event) {
      if (event.detail.remove != null) {
        var data = event.detail.remove.data;
        var changed = false;

        var newVal = [].concat(widget.options.value);
        for (var i = 0; i < data.length; i++) {
          var index = newVal.indexOf(data[i].value);
          if (index >= 0) {
            newVal.splice(index, 1);
            changed = true;
          }
        }
        if (changed) {
          widget._setOption('value', newVal);
        }
      }
    },

    /*
     * Add data provider event listeners
     */
    addDataProviderEventListeners: function (widget) {
      var dataProvider = _ComboUtils.getDataProvider(widget.options);
      if (dataProvider) {
        _ComboUtils.removeDataProviderEventListeners(widget);

        var dataProviderEventHandler = _ComboUtils._handleDataProviderEvents.bind(null, widget);
        // eslint-disable-next-line no-param-reassign
        widget._saveDataProviderEH = dataProviderEventHandler;

        dataProvider.addEventListener('mutate', dataProviderEventHandler);
        dataProvider.addEventListener('refresh', dataProviderEventHandler);
      }
    },

    /*
     * Remove data provider event listeners
     */
    removeDataProviderEventListeners: function (widget) {
      var dataProvider = _ComboUtils.getDataProvider(widget.options);
      var dataProviderEventHandler = widget._saveDataProviderEH;

      if (dataProvider != null && dataProviderEventHandler) {
        dataProvider.removeEventListener('mutate', dataProviderEventHandler);
        dataProvider.removeEventListener('refresh', dataProviderEventHandler);

        // eslint-disable-next-line no-param-reassign
        widget._saveDataProviderEH = undefined;
      }
    },

    /**
     * Creates an instance of loading indicator for the select & combobox
     * components. This method uses the theme information for creating the
     * loading indicator. For instance, in redwood this generates an
     * oj-progress-circle element, while in alta, this generates an image
     * sourced to a gif file.
     *
     * @return {Element} The loading indicator element
     *
     * @static
     * @member _ComboUtils
     * @ignore
     */
    createLoadingIndicatorElement: function () {
      let loaderElement;
      if (_ComboUtils.isLegacyTheme()) {
        // In legacy themes, the oj-progress-circle is not
        // supported. So we will be falling back to the spinner icon
        loaderElement = document.createElement('div');

        // Set attributes for the loader element
        loaderElement.setAttribute('role', 'presentation');
        loaderElement.setAttribute('class', 'oj-icon oj-listbox-loading-icon');
      } else {
        // In redwood based themes, oj-progress-circle is supported
        // and thus we will creating the same.
        loaderElement = document.createElement('oj-progress-circle');

        // Set attributes for the oj-progress-circle element
        loaderElement.setAttribute('class', 'oj-listbox-loading-progress-circle');
        loaderElement.setAttribute('data-oj-internal', '');
        loaderElement.setAttribute('data-oj-binding-provider', 'none');
        loaderElement.setAttribute('value', -1);
        loaderElement.setAttribute('size', 'sm');
      }

      return loaderElement;
    },

    /**
     * Updates the loading state based on whether the data loading is incomplete or not for the
     * dropdown
     *
     * @param {_AbstractOjChoice} widget The widget instance
     * @param {boolean} isLoadingData A flag indicating if the data is currently being loaded or is it done
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    updateDropdownLoadingState: function (widget, isLoadingData) {
      const _widget = widget;

      if (isLoadingData) {
        // Increment the loading indicator counter for every request so, we can keep track
        // of total requests. This is needed for removing the loading indicator, as we should
        // only remove the loading indicator once all the requests are resolved. This is done by
        // decrementing this counter in the removeLoadingIndicator method for every request resolved,
        // and when the counter reaches 0, it would then mean that all the requests are resolved and
        // we finally remove the loading indicator there.
        _widget._dropdownLoadingIndicatorCount += 1;

        // Clear any existing timers.
        if (_widget._dropdownLoadingIndicatorTimer) {
          _widget._dropdownLoadingIndicatorTimer.clear();
          delete _widget._dropdownLoadingIndicatorTimer;
        }

        // We do not want to show the loading indicator for every single fetch.
        // We only need to show the indicator for fetches that are slow enough.
        // So add a timer and once the timer resolves successfully, meaning that
        // it is not cancelled, add the loading indicator.
        const timer = TimerUtils.getTimer(_widget._loadingIndicatorDelay);
        timer.getPromise().then(function (hasCompleted) {
          // Add the loading indicator only if the timer is not cleared
          // which would indicate the component still needs to show the
          // loading indicator
          if (hasCompleted) {
            _ComboUtils.addDropdownProgressCircle(_widget);
          }
        });
        // Store the current timer instance
        _widget._dropdownLoadingIndicatorTimer = timer;
      } else {
        // Decrement the _dropdownLoadingIndicatorCount to reflect count of the resolved
        // request. Stop decrementing when it reaches 0 (which it should not, but to make sure that
        // the counter does not go into negative values).
        if (_widget._dropdownLoadingIndicatorCount > 0) {
          _widget._dropdownLoadingIndicatorCount -= 1;
        }
        // Clear the loading indicator only if the loadingIndicatorCount is 0 (meaning all
        // the loading functions are resolved and no need to show the loading indicator anymore)
        // and we currently have a loading indicator showing.
        if (_widget._dropdownLoadingIndicatorCount === 0) {
          // All the requests are resolved, so clear any existing timers and remove the
          // loading indicator
          if (_widget._dropdownLoadingIndicatorTimer) {
            _widget._dropdownLoadingIndicatorTimer.clear();
            delete _widget._dropdownLoadingIndicatorTimer;
          }
          _ComboUtils.removeDropdownProgressCircle(_widget);
        }
      }
    },

    /**
     * Adds the loading indicator if one is already not there in the dropdown
     *
     * @param {_AbstractOjChoice} widget The widget instance
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    addDropdownProgressCircle: function (widget) {
      const _widget = widget;
      // check if we are already showing the loading indicator, and do nothing more
      // if we are.
      if (_widget._hasDropdownLoadingIndicator) {
        return;
      }

      const $dropdown = _widget.dropdown;
      const $loaderWrapper = $dropdown.find('.oj-listbox-loader-wrapper');
      let progressCircleElement = _widget._dropdownProgressCircleElement;

      // Create a new progress bar element if one is already not there
      if (!progressCircleElement) {
        progressCircleElement = _ComboUtils.createLoadingIndicatorElement();
        // Store the newly created progress bar element for future use.
        _widget._dropdownProgressCircleElement = progressCircleElement;
      }

      // append the progress bar to the dropdown
      $loaderWrapper.append(progressCircleElement); // @HTMLUpdateOK

      // Hide the results as they are stale at this point
      _widget.results.addClass('oj-loading');

      // Set the flag to indicate, we have set the loading indicator.
      _widget._hasDropdownLoadingIndicator = true;

      // Once the loading state is changed, trigger the internal loading state
      // changed event.
      // We trigger this event which will be used for internal purposes like
      // unit testing. This event is an exposed public API and should not be
      // treated as such.
      _widget._triggerInternalLoadingStateChange('dropdownData', true);
    },

    /**
     * Removes the loading indicator from the dropdown if all the data
     * loading functions are resolved
     *
     * @param {_AbstractOjChoice} widget The widget instance
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    removeDropdownProgressCircle: function (widget) {
      const _widget = widget;

      // Show the results again as they are now updated
      _widget.results.removeClass('oj-loading');

      // Remove the loading indicator if it exists
      if (_widget._hasDropdownLoadingIndicator) {
        // Do not use $.remove to remove the progress bar element, as we would be reusing the
        // same element instance for future requests. Use $.detach to keep the event handlers
        // and data intact in the oj-progress-bar element.
        if (_widget._dropdownProgressCircleElement) {
          $(_widget._dropdownProgressCircleElement).detach();
        }
        // Clear the flag since we are not showing the loading indicator anymore
        _widget._hasDropdownLoadingIndicator = false;

        // Once the loading state is changed, trigger the internal loading state
        // changed event.
        // We trigger this event which will be used for internal purposes like
        // unit testing. This event is an exposed public API and should not be
        // treated as such.
        _widget._triggerInternalLoadingStateChange('dropdownData', false);
      }
    },

    /**
     * Updates the loading state based on whether the data loading is incomplete or not
     *
     * @param {_AbstractOjChoice} widget The widget instance
     * @param {boolean} isLoadingData A flag indicating if the data is currently being loaded or is it done
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    updateLoadingState: function (widget, isLoadingData) {
      // If the widget does not exist, do nothing
      if (!widget) {
        return;
      }
      const _widget = widget;

      if (isLoadingData) {
        // Clear any existing timers.
        if (_widget._loadingIndicatorTimer) {
          _widget._loadingIndicatorTimer.clear();
          delete _widget._loadingIndicatorTimer;
        }

        // We do not want to show the loading indicator for every single fetch.
        // We only need to show the indicator for fetches that are slow enough.
        // So add a timer and once the timer resolves successfully, meaning that
        // it is not cancelled, add the loading indicator.
        const timer = TimerUtils.getTimer(_widget._loadingIndicatorDelay);
        timer.getPromise().then(function (hasCompleted) {
          // Add the loading indicator only if the timer is not cleared
          // which would indicate the component still needs to show the
          // loading indicator
          if (hasCompleted) {
            _ComboUtils.addLoadingIndicator(_widget);
          }
        });
        // Store the current timer instance
        _widget._loadingIndicatorTimer = timer;
      } else {
        // The data is loaded, so remove the loading indicator and clear existing
        // timer.
        if (_widget._loadingIndicatorTimer) {
          _widget._loadingIndicatorTimer.clear();
          delete _widget._loadingIndicatorTimer;
        }

        _ComboUtils.removeLoadingIndicator(_widget);
      }
    },

    /**
     * Adds the loading indicator if one is already not there
     *
     * @param {_AbstractOjChoice} widget The widget instance
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    addLoadingIndicator: function (widget) {
      const _widget = widget;
      const ojContext = _widget.ojContext;

      // Increment the loading indicator counter for every request so, we can keep track
      // of total requests. This is needed for removing the loading indicator, as we should
      // only remove the loading indicator once all the requests are resolved. This is done by
      // decrementing this counter in the removeLoadingIndicator method for every request resolved,
      // and when the counter reaches 0, it would then mean that all the requests are resolved and
      // we finally remove the loading indicator there.
      _widget._loadingIndicatorCount += 1;

      // check if we are already showing the loading indicator, and do nothing more
      // if we are.
      if (_widget._hasLoadingIndicator) {
        return;
      }

      // Call the _SetLoading method to show the progressive loading.
      ojContext._SetLoading();

      // Set the flag to indicate, we have set the loading indicator.
      _widget._hasLoadingIndicator = true;

      // Once the loading state is changed, trigger the internal loading state
      // changed event.
      // We trigger this event which will be used for internal purposes like
      // unit testing. This event is an exposed public API and should not be
      // treated as such.
      _widget._triggerInternalLoadingStateChange('textFieldLabel', true);
    },

    /**
     * Removes the loading indicator if all the data loading functions are resolved
     *
     * @param {_AbstractOjChoice} widget The widget instance
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    removeLoadingIndicator: function (widget) {
      const _widget = widget;
      const ojContext = _widget.ojContext;

      // Decrement the _loadingIndicatorCount till 0
      if (_widget._loadingIndicatorCount > 0) {
        _widget._loadingIndicatorCount -= 1;
      }

      // Clear the loading indicator by calling _ClearLoading method.
      // Do this, only if the loadingIndicatorCount is 0 (meaning all the loading functions are resolved
      // and no need to show the loading indicator anymore) and we currently have a loading indicator showing.
      if (_widget._loadingIndicatorCount === 0 && _widget._hasLoadingIndicator) {
        ojContext._ClearLoading();
        // Clear the flag since we are not showing the loading indicator anymore
        _widget._hasLoadingIndicator = false;

        // Once the loading state is changed, trigger the internal loading state
        // changed event.
        // We trigger this event which will be used for internal purposes like
        // unit testing. This event is an exposed public API and should not be
        // treated as such.
        _widget._triggerInternalLoadingStateChange('textFieldLabel', false);
      }
    },

    // _ComboUtils
    // Add dropdown message such as filter further or no matches found
    addDropdownMessage: function (container, context, messageText) {
      // check if it's already added
      if (container._saveDropdownMessage) {
        return;
      }

      var msgParent = $(document.createElement('div'));
      msgParent.addClass('oj-listbox-filter-message-box');

      var message = $(document.createElement('div'));
      message.addClass('oj-listbox-filter-message-text');
      message.attr('role', 'region');

      var separator = $(document.createElement('div'));
      separator.addClass('oj-listbox-filter-message-separator');

      msgParent.append(message); // @HTMLUpdateOK
      msgParent.append(separator); // @HTMLUpdateOK
      container.prepend(msgParent); // @HTMLUpdateOK

      message.text(messageText);
      // eslint-disable-next-line no-param-reassign
      container._saveDropdownMessage = msgParent;

      // jet-39078 - accessibility: jaws does not read "no matches found" for oj-select-many
      // add the message text to the live region for it be read
      const widget = _ComboUtils.getWidget(context);
      if (widget != null) {
        widget._updateMatchesCount(messageText, true);
      }
    },

    // _ComboUtils
    // Remove dropdown message
    removeDropdownMessage: function (container) {
      if (container._saveDropdownMessage) {
        container._saveDropdownMessage.remove();
        // eslint-disable-next-line no-param-reassign
        container._saveDropdownMessage = undefined;
      }
    },

    // _ComboUtils
    createItemResult: function (itemData, itemMetadata) {
      return {
        label: itemData.label,
        value: itemData.value,
        disabled: itemData.disabled,
        children: itemData.children,
        data: itemData,
        metadata: itemMetadata
      };
    },

    fetchFlatData: function (context, dataProvider, fetchListParms, query, dropdown, maxItems) {
      var results = [];
      var asyncIterator = dataProvider.fetchFirst(fetchListParms)[Symbol.asyncIterator]();
      // maxItems > 0 indicates a max limit on the results
      var hasMaxLimit = maxItems > 0;

      function filterData(fetchResults) {
        if (fetchResults) {
          var data = fetchResults.value.data;
          var metadata = fetchResults.value.metadata;

          if (data) {
            var itemData;
            var itemMetadata;
            for (var i = 0; i < data.length && (!hasMaxLimit || results.length < maxItems); i++) {
              itemData = data[i];
              itemMetadata = metadata[i];
              // skip filter locally if it is already done thru data provider
              if (
                fetchListParms.filterCriterion ||
                !query ||
                !query.matcher ||
                query.matcher(query.term, _ComboUtils.getLabel(itemData), itemData)
              ) {
                results.push(_ComboUtils.createItemResult(itemData, itemMetadata));
              }
            }
          }
          // clear message
          if (dropdown) {
            _ComboUtils.removeDropdownMessage(dropdown);
          }

          // not all results are fetched, display mesage for filtering further
          if (dropdown && !fetchResults.done && hasMaxLimit && results.length >= maxItems) {
            _ComboUtils.addDropdownMessage(
              dropdown,
              context,
              context.getTranslatedString('filterFurther')
            );
            // eslint-disable-next-line no-param-reassign
            context._hasMore = true;
          } else {
            // fetch more
            if (!fetchResults.done && (!hasMaxLimit || results.length < maxItems)) {
              return asyncIterator.next().then(filterData);
            }
            // eslint-disable-next-line no-param-reassign
            context._hasMore = false;
          }
        }
        return Promise.resolve(results);
      }

      return asyncIterator.next().then(filterData);
    },

    fetchTreeData: function (context, rootDataProvider, fetchListParms, query, dropdown, maxItems) {
      // maxItems > 0 indicates a max limit on the results
      var hasMaxLimit = maxItems > 0;
      var remaining = fetchListParms.size;

      // eslint-disable-next-line no-param-reassign
      context._hasMore = false;
      if (dropdown) {
        _ComboUtils.removeDropdownMessage(dropdown);
      }

      function fetchLayer(dataProvider) {
        // eslint-disable-next-line no-param-reassign
        fetchListParms.size = remaining;

        var results = [];
        var iterator = dataProvider.fetchFirst(fetchListParms)[Symbol.asyncIterator]();
        return iterator.next().then(processChunk);

        function processChunk(fetchResult) {
          var data = fetchResult.value.data;
          var metadata = fetchResult.value.metadata;
          var childrenPromise = fetchChildren(0);

          return childrenPromise.then(function () {
            if (!hasMaxLimit) {
              if (fetchResult.done) {
                return Promise.resolve(results);
              }
            } else if (fetchResult.done || remaining <= 0) {
              if (!fetchResult.done) {
                // eslint-disable-next-line no-param-reassign
                context._hasMore = true;
              }
              return Promise.resolve(results);
            }
            return iterator.next().then(processChunk);
          });

          function processItem(itemData, itemMetadata, children) {
            var match =
              !query ||
              !query.matcher ||
              fetchListParms.filterCriterion ||
              query.matcher(query.term, _ComboUtils.getLabel(itemData), itemData);

            var selectable = dataProvider.getChildDataProvider(itemData.value) == null;
            if (!selectable) {
              match = false;
            }
            // don't decrement the remaining counter if there is no max limit
            if (match && children.length === 0 && hasMaxLimit) {
              remaining -= 1;
            }

            if (match || children.length > 0) {
              // keep a reference to the original row data in "data"
              var result = _ComboUtils.createItemResult(itemData, itemMetadata);
              if (itemData.disabled) {
                result.disabled = true;
              }
              if (!selectable || result.disabled) {
                result._jetUnSelectable = true;
              }
              if (children.length > 0) {
                result.children = children;
              }
              results.push(result);
            }
          }

          function fetchChildren(i) {
            if (i < data.length) {
              if (remaining > 0 || !hasMaxLimit) {
                var itemData = data[i];
                var itemMetadata = metadata[i];
                var childDataProvider = dataProvider.getChildDataProvider(itemData.value);
                if (childDataProvider) {
                  return fetchLayer(childDataProvider).then(function (childResults) {
                    processItem(itemData, itemMetadata, childResults);
                    return fetchChildren(i + 1);
                  });
                }
                processItem(itemData, itemMetadata, []);
                return fetchChildren(i + 1);
              }
              // eslint-disable-next-line no-param-reassign
              context._hasMore = true;
            }
            return Promise.resolve(results);
          }
        }
      }

      return fetchLayer(rootDataProvider).then(function (results) {
        if (context._hasMore && dropdown) {
          _ComboUtils.addDropdownMessage(
            dropdown,
            context,
            context.getTranslatedString('filterFurther')
          );
        }

        return results;
      });
    },

    // _ComboUtils
    // Fetch from the data provider and filter the data locally until
    // the end of data or fetch size has reached
    fetchFilteredData: function (context, fetchSize, maxItems, query, dropdown) {
      var dataProvider = _ComboUtils.getDataProvider(context.options);
      var fetchListParms = {
        size: fetchSize
      };

      // check if data provider support filtering?
      var filterCapability = dataProvider.getCapability('filter');
      var $co = oj.AttributeFilterOperator.AttributeOperator.$co;
      var $regex = oj.AttributeFilterOperator.AttributeOperator.$regex;
      var filterThruDataProvider = false;
      var filterSupportsRegex = false;

      // only filter thru data provider if it supports contains($co or $regex) operator
      if (filterCapability) {
        var filters = filterCapability.operators;
        if (filters && filters.length > 0) {
          if (filters.indexOf($co) >= 0 || filters.indexOf($regex) >= 0) {
            filterThruDataProvider = true;

            if (filters.indexOf($regex) >= 0) {
              filterSupportsRegex = true;
            }
          }
        }
      }
      var isTree = _ComboUtils.isTreeDataProvider(dataProvider);

      // have to filter
      if (query && query.term) {
        // use dataprovider filtering if supported
        if (filterThruDataProvider) {
          // TODO test in the data mapping case to see if "label" works
          // Note: revisit when tree dataProvider is supported
          // for now if optionsKey is used, 'label' must specify in optionsKeys
          var optKeys = context.options.optionsKeys;
          var attrName;
          if (optKeys && optKeys.label) {
            attrName = optKeys.label;
          } else {
            attrName = 'label';
          }
          // case insensitive query should use $regex
          if (filterSupportsRegex) {
            var escapedTerm = _ComboUtils.escapeRegExp(query.term);
            fetchListParms.filterCriterion = {
              op: $regex,
              attribute: attrName,
              value: new RegExp(escapedTerm, 'i')
            };
          } else {
            // if no regex support just fallback to $co
            fetchListParms.filterCriterion = { op: $co, attribute: attrName, value: query.term };
          }
        } else if (!isTree) {
          if (maxItems > 0) {
            // for local filtering increase the fetch size
            var fs = maxItems * _ComboUtils.FILTERING_FETCH_SIZE_MRC_TIMES;
            // fetch size should be between minimum and maximum fetch size for local filtering
            if (fs > _ComboUtils.FILTERING_FETCH_SIZE_MAX) {
              fs = _ComboUtils.FILTERING_FETCH_SIZE_MAX;
            } else if (fs < _ComboUtils.FILTERING_FETCH_SIZE_MIN) {
              fs = _ComboUtils.FILTERING_FETCH_SIZE_MAX;
            }
            fetchListParms.size = fs;
          } else {
            fetchListParms.size = maxItems;
          }
        }
      }

      return isTree
        ? _ComboUtils.fetchTreeData(context, dataProvider, fetchListParms, query, dropdown, maxItems)
        : _ComboUtils.fetchFlatData(context, dataProvider, fetchListParms, query, dropdown, maxItems);
    },

    // used as rejected error in the fetchFromDataProvider method
    rejectedError: {},

    /**
     * Fetches data from the data provider. While doing so, this method also sets
     * the busy state and loading indicator (only for initial fetch). This method
     * also takes care of displaying the dropdown message for further filtering if
     * not all the results are fetched. If multiple calls are made to this method,
     * it discard all the previous calls and responds only to the latest call.
     *
     * @param {_AbstractOjChoice} widget The widget instance
     * @param {Object} options The options object of the widget
     * @param {Object} query A query object containing the value for querying and the callback function
     * @param {number} fetchSize The number of items that needs to be fetched
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    fetchFromDataProvider: function (widget, options, query, fetchSize) {
      var context = widget.ojContext;

      // add busy context
      if (!context._fetchResolveFunc) {
        context._fetchResolveFunc = _ComboUtils._addBusyState(widget.container, 'fetching data');
      }

      // reject the previous promise to avoid out of order request
      if (context._saveRejectFunc) {
        context._saveRejectFunc(_ComboUtils.rejectedError);
      }

      // save the current reject function
      var remotePromise = new Promise(function (resolve, reject) {
        context._saveRejectFunc = reject;
      });

      // Clear the initial fetch flag from the options as the initial fetch is triggered
      // eslint-disable-next-line no-param-reassign
      options.fetchType = null;

      var maxItems = _ComboUtils._getMaxItems(options);
      // fetch data from dataProvider
      var fs = fetchSize || options.fetchSize || maxItems;
      var fetchPromise = _ComboUtils
        .fetchFilteredData(context, fs, maxItems, query, widget.dropdown)
        .then(function (fetchResults) {
          //  - search not shown before typing a character
          context._resultCount = fetchResults ? fetchResults.length : 0;
          return fetchResults;
        });

      // if multiple queries are in progress, discard all but the last query
      Promise.race([remotePromise, fetchPromise]).then(
        function (fetchResults) {
          // clear the reject function
          context._saveRejectFunc = null;

          //  - search not shown before typing a character
          if (context._resolveSearchBoxLater) {
            widget._showSearchBox('');
          }

          query.callback({
            results: fetchResults
          });

          if (context._fetchResolveFunc) {
            // clear busy context
            context._fetchResolveFunc();
            context._fetchResolveFunc = null;
          }
        },
        function (error) {
          // don't remove busy state if the reject coming from Promise.race
          if (error !== _ComboUtils.rejectedError && context._fetchResolveFunc) {
            query.callback();
            context._fetchResolveFunc();
            context._fetchResolveFunc = null;
          } else if (error === _ComboUtils.rejectedError) {
            // If the fetch promise is rejected because of it being an outdated fetch
            // request to cleanup any operations left over for the previous fetch.
            query.cleanup();
          }
        }
      );
    },

    // _ComboUtils
    // fetch first block of data from the data provider
    fetchFirstBlockFromDataProvider: function (container, options, fetchSize) {
      var dataProvider = _ComboUtils.getDataProvider(options);

      // add busy context
      var fetchResolveFunc = _ComboUtils._addBusyState(container, 'fetching selected data');

      var maxItems = _ComboUtils._getMaxItems(options);
      var fetchListParms = {
        size: fetchSize || maxItems
      };

      if (_ComboUtils.isTreeDataProvider(dataProvider)) {
        return _ComboUtils.fetchTreeData({}, dataProvider, fetchListParms, null, null, maxItems).then(
          function (fetchResults) {
            // return the leaf node data
            if (fetchSize === 1 && fetchResults && fetchResults.length > 0) {
              var selval = fetchResults[0];
              for (; selval.children; ) {
                selval = selval.children[0];
              }
              // eslint-disable-next-line no-param-reassign
              fetchResults = [selval];
            }
            _ComboUtils._clearBusyState(fetchResolveFunc);
            return fetchResults;
          },
          function () {
            _ComboUtils._clearBusyState(fetchResolveFunc);
            return null;
          }
        );
      }

      var asyncIterator = dataProvider.fetchFirst(fetchListParms)[Symbol.asyncIterator]();
      return asyncIterator.next().then(
        function (fetchResults) {
          _ComboUtils._clearBusyState(fetchResolveFunc);
          return fetchResults.value.data;
        },
        function () {
          _ComboUtils._clearBusyState(fetchResolveFunc);
          return null;
        }
      );
    },

    duringFetchByKey: function (container) {
      return container._fetchByKeys;
    },

    /**
     * Fetches data from the data provider using the key provided. While doing so, this also
     * sets the busy state and loading indicator (only for initial fetch).
     *
     * @param {_AbstractOjChoice|jQuery} widgetOrElement Either the instance of the widget or a jQuery object
     * @param {Object} options The options object for the widget
     * @param {Object} query A query object containing the value for querying and the callback function
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    fetchByKeyFromDataProvider: function (widgetOrElement, options, query) {
      var dataProvider = _ComboUtils.getDataProvider(options);

      // This method can be called with either widget as the first argument or
      // the jQuery container element. This will be a jQuery container element
      // when called from validateFromDataProvider method, which is used by oj-select-*
      // components. This is to support the native render mode, where the widget instance
      // does not exist. In all other cases, this will be a widget instance.
      // So, check for the instance type and create variables accordingly.
      const widget = widgetOrElement instanceof $ ? null : widgetOrElement;
      const container = widget != null ? widget.container : widgetOrElement;
      const fetchResolveFunc = _ComboUtils._addBusyState(container, 'fetching selected data');

      //  - sdp.fetchbykeys method is being called twice for a single value
      // Stored the selected value in container._fetchByKeys, it will be cleared when the promise
      // is resolved or rejected. When this method is called again with the same selected value,
      // don't make another call to dataProvider.fetchByKeys because the previous one is in flight.
      var fetchPromise;
      if (
        container._fetchByKeys &&
        container._fetchByKeys.promise &&
        oj.Object.compareValues(query.value, container._fetchByKeys.key)
      ) {
        fetchPromise = container._fetchByKeys.promise;
      } else {
        fetchPromise = dataProvider.fetchByKeys({ keys: new Set(query.value) });
        // save key and promise
        // eslint-disable-next-line no-param-reassign
        container._fetchByKeys = {
          key: query.value,
          promise: fetchPromise
        };
      }

      // fetch the data row by its key("value")
      fetchPromise.then(
        function (fetchResults) {
          //  - sdp.fetchbykeys method is being called twice for a single value
          // eslint-disable-next-line no-param-reassign
          container._fetchByKeys = undefined;

          var values = [];
          fetchResults.results.forEach(function (val) {
            values.push(_ComboUtils.createItemResult(val.data, val.metadata));
          });

          query.callback({
            results: values
          });
          _ComboUtils._clearBusyState(fetchResolveFunc);
        },
        function () {
          //  - sdp.fetchbykeys method is being called twice for a single value
          // eslint-disable-next-line no-param-reassign
          container._fetchByKeys = undefined;
          query.callback();
          _ComboUtils._clearBusyState(fetchResolveFunc);
        }
      );
    },

    // _ComboUtils
    // check if the specified value is in the dataProvider
    // return a promise with the following results
    // 1) null: value is invalid or reject by fetchByKeyFromDataProvider
    // 2) array of valid values
    validateFromDataProvider: function (container, options, value) {
      // eslint-disable-next-line no-unused-vars
      return new Promise(function (resolve, reject) {
        _ComboUtils.fetchByKeyFromDataProvider(container, options, {
          value: Array.isArray(value) ? value : [value],
          callback: function (data) {
            var results = null;
            //  - need to be able to specify the initial value of select components bound to dprv
            if (data && data.results.length) {
              results = {};
              results.value = [];
              results.valueOptions = [];
              for (var i = 0; i < data.results.length; i++) {
                results.valueOptions.push(data.results[i]);
                results.value.push(data.results[i].value);
              }
            }
            resolve(results);
          }
        });
      });
    },

    // _ComboUtils
    // Readonly support for the custom element only
    isReadonly: function (widget) {
      return (
        widget._IsCustomElement() && (widget.options.readOnly || widget.options.loading === 'loading')
      );
    },

    // _ComboUtils
    // Get maximum items to display in the dropdown
    _getMaxItems: function (options) {
      var maxItems;
      if (options.maximumResultCount !== undefined && options.maximumResultCount !== null) {
        maxItems = options.maximumResultCount;
        // max items less than 1 indicates no max limit
        if (maxItems < 1) {
          maxItems = _ComboUtils.DEFAULT_FETCH_ALL_SIZE;
        }
      } else {
        maxItems = _ComboUtils.DEFAULT_FETCH_SIZE;
      }
      return maxItems;
    },

    /*
     * Produces a query function that works with a remote data
     */
    remote: function (options, optKeys) {
      return function (query) {
        var context = {
          component: this.ojContext
        };
        if (query.value) {
          context.value = query.value;
        } else {
          context.term = query.term || '';
        }

        options(context).then(function (data) {
          var filtered = {
            results: []
          };

          if (data) {
            _ComboUtils.each2($(data), function (i, datum) {
              _ComboUtils._processData(query, datum, filtered.results, optKeys, false);
            });
          }

          query.callback(filtered);
        });
      };
    },

    // _ComboUtils
    /*
     * Maps the optionsKeys and options array and creates the array of
     * Label-Value objects. If options array is local data then
     * it filters the result array based on the term entered in the search field.
     */
    _processData: function (query, data, collection, keys, isLocal, text) {
      var group;

      var datum = data[0];

      // key mappings
      if (!datum.label && keys && keys.label) {
        datum.label = datum[keys.label];
      }
      if (!datum.value && keys && keys.value) {
        datum.value = datum[keys.value];
      }
      if (!datum.children && keys && keys.children) {
        datum.children = datum[keys.children];
        delete datum[keys.children];
      }

      if (datum.children) {
        group = {};
        var attrs = Object.keys(datum);
        for (var k = 0; k < attrs.length; k++) {
          var attr = attrs[k];
          group[attr] = datum[attr];
        }

        group.children = [];
        _ComboUtils.each2($(datum.children), function (i, childDatum) {
          _ComboUtils._processData(
            query,
            childDatum,
            group.children,
            keys && keys.childKeys ? keys.childKeys : null,
            isLocal,
            text
          );
        });

        // JET-30008 - select one/ combobox, don't filter on group headers when using an array
        // At this point, data.children != null, which makes this node a group node.
        // A group node, no matter the depth, is not selectable. Thus, whether or not this
        // should be included in the dropdown entirely depends on whether or not a leaf node
        // is a match. If not, we should not include the group node, even if it matches the
        // query term
        if (!isLocal || (group.children.length && _ComboUtils._hasLeafNode(group))) {
          collection.push(group);
        }
      } else if (!isLocal || query.matcher(query.term, text(datum), datum)) {
        collection.push(datum);
      }
    },

    /**
     * Recursively checks for the presence of at least a single leaf node.
     *
     * @param {object} group The option/optionGroup object
     * @returns Whether the group node has at least one leaf node
     */
    _hasLeafNode: function (group) {
      // if the group node itself is a leaf, return true
      if (group.children == null) {
        return true;
      }
      for (let i = 0; i < group.children.length; i++) {
        const child = group.children[i];
        if (_ComboUtils._hasLeafNode(child)) {
          return true;
        }
      }
      return false;
    },

    // _ComboUtils
    checkFormatter: function (formatter, formatterName) {
      if (typeof formatter === 'function') {
        return true;
      }
      if (!formatter) {
        return false;
      }

      throw new Error(formatterName + ' must be a function or a false value');
    },

    // _ComboUtils
    /*
     * Creates a new class
     */
    clazz: function (SuperClass, methods) {
      var constructor = function () {};
      oj.Object.createSubclass(constructor, SuperClass, '');
      constructor.prototype = $.extend(constructor.prototype, methods);
      return constructor;
    },

    // _ComboUtils
    LAST_QUERY_RESULT: 'last-query-result',
    getLastQueryResult: function (context) {
      var queryResult = $.data(
        context.container,
        context._classNm + '-' + _ComboUtils.LAST_QUERY_RESULT
      );

      return queryResult;
    },
    saveLastQueryResult: function (context, queryResult) {
      $.data(context.container, context._classNm + '-' + _ComboUtils.LAST_QUERY_RESULT, queryResult);
    },

    // _ComboUtils
    /* ER 29805293 - lov: when bound to dp impl selecting an item from dropdown must provide data
     * when the multichoice component is initialized or when an item is selected, options data is saved in item pills
     * get the data saved in item pills for the passed val
     */
    getSelectedOptionData: function (context, val) {
      if (context.ojContext.multiple && context.selection) {
        var item;
        var itemData;
        var selections = context.selection.find('.' + context._classNm + '-selected-choice');
        for (var i = 0; i < selections.length; i++) {
          item = selections.get(i);
          itemData = $(item).data(context._elemNm);
          if (oj.Object.compareValues(val, itemData.value)) {
            return itemData;
          }
        }
      }
      return undefined;
    },

    // _ComboUtils
    getContextWithExtraData: function (context, opts, data, metadata) {
      // set extradata in context only for dataprovider
      var isDataProvider = opts ? _ComboUtils.isDataProvider(opts.options) : false;
      // do not extend context if the data is empty
      if (!isDataProvider || data == null || (Array.isArray(data) && data.length === 0)) {
        return context;
      }
      return $.extend(context || {}, {
        extraData: {
          data: data,
          metadata: metadata
        }
      });
    },

    // _ComboUtils
    getOpts: function (ojContext) {
      var opts;
      if (ojContext) {
        if (ojContext.combobox && ojContext.combobox.opts) {
          opts = ojContext.combobox.opts;
        } else if (ojContext.select && ojContext.select.opts) {
          opts = ojContext.select.opts;
        }
      }
      return opts;
    },

    /**
     * Normalizes the given value to an Array
     *
     * @param {V|Array<V>|null|undefined} value The value to be normalzied
     * @returns {Array<V>} The normalized value as an Array
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    getNormalizedValueArray: function (value) {
      if (Array.isArray(value)) return value;
      if (value == null) return [];
      return [value];
    },

    /**
     * Retrieves the widget instance from the context instance.
     *
     * @param {oj.ojSelect|oj.ojCombobox|oj.ojInputSearchWidget} ojContext The select/combobox instance
     * @returns {_AbstractOjChoice} The widget instance
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    getWidget: function (ojContext) {
      // for oj-select
      if (ojContext.select != null) {
        return ojContext.select;
      }

      // for oj-combobox
      if (ojContext.combobox != null) {
        return ojContext.combobox;
      }

      // for ojInputSearch widget
      return ojContext.inputSearch;
    },

    /**
     * Creates a proxy element that will used for positioning the dropdown
     *
     * @param {string} containerId The container id to be used.
     * @return {jQuery} A jquery element
     *
     * @static
     * @memberof _ComboUtils
     * @ignore
     */
    createProxyDropdownElement: function (containerId) {
      // Position a proxy element instead of the real dropdown so that we don't have to
      // change the size of the dropdown before calculating the position, because changing
      // the size of the dropdown before positioning may reset the results' scroll position and
      // prevent the user from scrolling down.

      // JET-42675 - combobox drop down not aligned correctly for wide browser windows in jet 10
      // Wrap everything in a non-overflowing absolute container. This will prevent
      // any unwanted overflow while calculating the position.
      const containerDiv = document.createElement('div');
      containerDiv.style.visibility = 'hidden';
      containerDiv.style.position = 'absolute';
      containerDiv.style.overflow = 'hidden';

      const outerDiv = document.createElement('div');
      outerDiv.setAttribute('data-oj-containerid', containerId);
      outerDiv.setAttribute('data-oj-context', '');
      outerDiv.setAttribute('class', 'oj-listbox-drop');
      containerDiv.appendChild(outerDiv); // @HTMLUpdateOK

      const resultsProxyElem = document.createElement('ul');
      resultsProxyElem.setAttribute('class', 'oj-listbox-results');
      outerDiv.appendChild(resultsProxyElem); // @HTMLUpdateOK

      return $(containerDiv);
    }
  };

  var _ojChoiceDefaults = {
    closeOnSelect: true,
    openOnEnter: true,
    formatNoMatches: function (ojContext) {
      return ojContext.getTranslatedString('noMatchesFound');
    },
    formatNoMoreResults: function (ojContext) {
      return ojContext.getTranslatedString('noMoreResults');
    },
    formatMoreMatches: function (ojContext, num) {
      if (num === 1) {
        return ojContext.getTranslatedString('oneMatchesFound');
      }
      return ojContext.getTranslatedString('moreMatchesFound', { num: '' + num });
    },
    id: function (e) {
      return e.id;
    },
    // eslint-disable-next-line no-unused-vars
    sanitizeData: function (data, useUnparsedValue) {
      return data;
    },
    parseData: function (data) {
      return data;
    },
    matcher: function (term, text) {
      return ('' + text).toUpperCase().indexOf(('' + term).toUpperCase()) >= 0;
    },

    separator: ','
  };

  // eslint-disable-next-line no-unused-vars
  const _AbstractOjChoice = _ComboUtils.clazz(Object, {
    // _AbstractOjChoice
    _bind: function (func) {
      var self = this;
      return function () {
        return func.apply(self, arguments);
      };
    },

    // _AbstractOjChoice
    _customOptionRenderer: function (elems) {
      var elem;
      var self = this;

      elems.each(function () {
        elem = $(this);

        if (elem.is('oj-option')) {
          elem.wrap('<li></li>'); // @HTMLUpdateOK
        } else if (elem.is('oj-optgroup')) {
          elem.wrap('<li></li>'); // @HTMLUpdateOK
          self._customOptionRenderer(elem.children());
          elem.children().wrapAll("<ul class='oj-listbox-result-sub' role='group'></ul>"); // @HTMLUpdateOK
        }
      });
    },

    // _AbstractOjChoice
    _init: function (_opts) {
      var results;
      var search;
      var className = this._classNm;
      var elemName = this._elemNm;
      var resultsSelector = '.oj-listbox-results';

      this.ojContext = _opts.ojContext;
      var opts = this._prepareOpts(_opts);
      this.opts = opts;
      this.id = opts.id;
      this.parseData = opts.parseData;
      this.sanitizeData = opts.sanitizeData;
      this.headerInitialized = false;
      this.isOjOption =
        this.ojContext._IsCustomElement() &&
        !opts.options &&
        opts.element.find('oj-option').length > 0;

      // Set initial values for flags and counter used for loading indicators
      this._loadingIndicatorCount = 0;
      this._hasLoadingIndicator = false;
      this._dropdownLoadingIndicatorCount = 0;
      this._hasDropdownLoadingIndicator = false;

      // JET-39086 - raw-value is not getting updated until space in android devices
      // In android device we need to update rawValue even for composition events
      // Get and store agent info
      this._isAndroidDevice = oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.ANDROID;

      const cssOptionDefaults = this.ojContext.cssOptionDefaults;
      let loadingIndicatorDelay = Number.parseInt(cssOptionDefaults.loadingIndicatorDelay, 10);
      if (Number.isNaN(loadingIndicatorDelay)) {
        loadingIndicatorDelay = _ComboUtils.DEFAULT_LOADING_INDICATOR_DELAY;
      }
      this._loadingIndicatorDelay = loadingIndicatorDelay;

      // JET-44062 - add gap between field and dropdown
      var dropdownVerticalOffset =
        ThemeUtils.getCachedCSSVarValues(['--oj-private-core-global-dropdown-offset'])[0] || '0';
      this._dropdownVerticalOffset = parseInt(dropdownVerticalOffset, 10);

      // 'opts.element' is initialized in _setup() method in component files
      // ojcombobox.js, ojselect.js and ojInputSearch.js.
      // destroy if called on an existing component
      if (opts.element.data(elemName) !== undefined && opts.element.data(elemName) !== null) {
        opts.element.data(elemName)._destroy();
      }
      this._prepareContainer(); // This prepares the container and sets this.container and this.containerSelector

      // cache the body so future lookups are cheap
      this.body = _ComboUtils.thunk(function () {
        return opts.element.closest('body');
      });

      this.dropdown = this.container.find('.oj-listbox-drop');
      this.dropdown.data('ojlistbox', this);

      //  - let the ojselect popup accept the custom css class name from the component
      this._setPickerAttributes(opts.pickerAttributes);

      // link the shared dropdown dom to the target component instance
      var containerId = this.containerId;
      this.dropdown.attr('data-oj-containerid', containerId);

      // We will be using a proxy dropdown element for positioning the dropdown, we do this because
      // changing the real dropdown size will reset user scroll position
      this._dropdownPositioningProxyContainer = _ComboUtils.createProxyDropdownElement(containerId);

      results = this.container.find(resultsSelector);
      this.results = results;
      this.results.on('click', _ComboUtils.killEvent);

      // Store the busyContext of the results container
      this._resultsBusyContext = Context.getContext(this.results[0]).getBusyContext();

      //  - oghag missing label for ojselect and ojcombobox
      var alabel = this._getTransferredAttribute('aria-label');
      if (alabel != null) {
        this.results.attr('aria-label', alabel);
      }

      // Get and store the default max-height
      this._defaultResultsMaxHeight = Number.parseInt(this.results.css('max-height'), 10);

      // if html ul element is provided, use it instead
      if (opts.list && $('#' + opts.list).is('ul')) {
        var dropdownList = $('#' + opts.list);
        this.dropdownListParent = dropdownList.parent();
        dropdownList.addClass('oj-listbox-results').attr('role', 'listbox');
        this.results.replaceWith(dropdownList); // @HTMLUpdateOK
        results = this.container.find(resultsSelector);
        this.results = results;
        this.results.css('display', '');
      }

      // custom element syntax with oj-option elements
      if (this.isOjOption) {
        var elems = opts.element.children();
        this._customOptionRenderer(elems);
        this.results.append(opts.element.children()); // @HTMLUpdateOK
        this.datalist = this.results;
      }

      if (className === 'oj-select') {
        search = this.container.find('input.oj-listbox-input');
      } else {
        search = this.container.find('input.' + className + '-input');
      }
      this.search = search;

      this.queryCount = 0;
      this.resultsPage = 0;
      this.context = null;
      this._ariaDescribedByAdded = []; // used to store aria-describedby ids for multi choice

      // used to store id(s) that are from the dropdown
      this._idsFromDropdown = _ComboUtils.getDataProviderKeySet(opts.ojContext);

      // initialize the container
      this._initContainer();
      // JET-48083 - clicking help-hints.source link does nothing
      // Do not kill events originating from user-assistance-container
      this.container.on('click', '.oj-text-field-container', _ComboUtils.killEvent);
      _ComboUtils.installFilteredMouseMove(this.results);

      //  - CUSTOM TABINDEX DOES NOT WORK
      // Transfer the tabindex in the created input element or the selection element
      if (this.elementTabIndex) {
        if (className === 'oj-select') {
          // this.selection is available only after the _initContainer call
          this.selection.attr('tabindex', this.elementTabIndex);
        } else {
          this.search.attr('tabindex', this.elementTabIndex);
        }
      }

      this._boundHighlightUnderEvent = this._bind(this._highlightUnderEvent);
      if (this.ojContext._IsCustomElement()) {
        this._delegatedDropdownTouchStartListener = function (event) {
          const container = event.currentTarget;
          const targetElement = event.target.closest(resultsSelector);
          if (targetElement && container.contains(targetElement)) {
            this._boundHighlightUnderEvent(
              $.Event(event, {
                currentTarget: targetElement
              })
            );
          }
        }.bind(this);
        this.dropdown.on(
          'mousemove-filtered touchmove touchend',
          resultsSelector,
          this._boundHighlightUnderEvent
        );
        this.dropdown[0].addEventListener('touchstart', this._delegatedDropdownTouchStartListener, {
          passive: true
        });
      } else {
        this.dropdown.on(
          'mousemove-filtered touchstart touchmove touchend',
          resultsSelector,
          this._boundHighlightUnderEvent
        );
      }

      // do not propagate change event from the search field out of the component
      $(this.container).on('change', '.' + className + '-input', function (e) {
        e.stopPropagation();
      });
      $(this.dropdown).on('change', '.' + className + '-input', function (e) {
        e.stopPropagation();
      });

      var self = this;
      _ComboUtils.installKeyUpChangeEvent(search);
      search.on('keyup-change input paste', this._bind(this._updateResults));
      search.on('focus', function () {
        search.addClass(className + '-focused');

        if (className !== 'oj-select') {
          self.container.addClass('oj-focus');
        }

        self.isSearchFocused = true;
      });
      search.on('blur', function () {
        search.removeClass(className + '-focused');

        if (className !== 'oj-select') {
          self.container.removeClass('oj-focus');
        }

        self.isSearchFocused = false;
      });
      this.dropdown.on(
        'mouseup',
        resultsSelector,
        this._bind(function (e) {
          if ($(e.target).closest('.oj-listbox-result-selectable').length > 0) {
            this._highlightUnderEvent(e);
            this._selectHighlighted(null, e, false);
          }
        })
      );
      // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
      // for mouse events outside of itself so it can close itself. since the dropdown is now outside the combobox's
      // dom it will trigger the popup close, which is not what we want
      this.dropdown.on('click mouseup mousedown', function (e) {
        e.stopPropagation();
      });
      if ($.isFunction(this.opts.initSelection)) {
        // /support ko options-binding
        // init dataProvider fetchType
        this.opts.fetchType = 'init';
        var valOpts = this.getValOpts();
        if (
          (this.ojContext.multiple && (!valOpts || valOpts.length === 0)) ||
          (!this.ojContext.multiple && !valOpts)
        ) {
          valOpts = null;
        }
        this._initSelection(valOpts);
      }
      var readonly = opts.element.prop('readonly');
      if (readonly === undefined) {
        readonly = false;
      }
      this._readonly(readonly);
      var disabled = opts.element.prop('disabled');
      if (disabled === undefined) {
        disabled = false;
      }
      this._enable(!disabled);

      // create the readonlyDiv
      if (readonly) {
        let input = this.container.find('.oj-combobox-input');
        this.ojContext._createOrUpdateReadonlyDiv(input[0]);
      }
      // Calculate size of scrollbar
      _ComboUtils.scrollBarDimensions =
        _ComboUtils.scrollBarDimensions || _ComboUtils.measureScrollbar();
      this.autofocus = opts.element.prop('autofocus');
      opts.element.prop('autofocus', false);
      if (this.autofocus) {
        this._focus();
      }

      // Readonly support
      this.applyReadonlyState();

      // flag to indicate that the OjChoice instance is alive
      this.isInitialized = true;
    },

    /**
     * Creates content elements and this method should be overridden by all the children
     * and they should return their own collection of HTML elements that represents their
     * own content
     *
     * @return {jQuery} The collection of HTML elements that represent the content
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @protected
     */
    _CreateContentElements: function () {
      return null;
    },

    /**
     * Configure slots for custom elements.
     * This is noop by default and children that support slots should
     * override this method.
     * Children that implements this method should also implement
     * _RestoreSlots method to ensure that slot elements are returned to
     * their original place when calling destroy method.
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @protected
     */
    _ConfigureSlots: function () {},

    /**
     * Restores slots for custom elements.
     * This is noop by default and children that support slots should
     * override this method.
     * Children that implements _ConfigureSlots method should also implement
     * this method to ensure that slot elements are returned to
     * their original place when calling destroy method.
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @protected
     */
    _RestoreSlots: function () {},

    /**
     * Creates container for widgets
     *
     * @return {jQuery} The created container
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @private
     */
    _createContainerForWidget: function () {
      var container = $(document.createElement('div'));
      var content = this._CreateContentElements(); // method defined by child classes
      container.attr('class', this._COMPONENT_CLASSLIST); // member initialized by child classes
      container.append(content); // @HTMLUpdateOK
      return container;
    },

    /**
     * Prepares the container and initializes member variable related to the
     * container.
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @private
     */
    _prepareContainer: function () {
      var container;
      var containerId;
      var containerSelector;
      var elementName;
      var elementTabIndex;

      if (this.ojContext._IsCustomElement()) {
        container = this._prepareContainerForCustomElement();
      } else {
        container = this._prepareContainerForWidget();
      }

      // now the container is the outer most element of the component
      // For custom elements, it will be oj custom element where as for widgets it will be the
      // container created by this._createContainerForWidget which is appended to the parent of the inner element.

      container.find('.oj-listbox-drop').css('display', 'none');

      containerId = this._getOrCreateContainerId(container);
      containerSelector =
        // eslint-disable-next-line no-useless-escape
        '#' + containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
      elementTabIndex = this.opts.element.attr('tabindex');
      elementName = this._elemNm;

      this.opts.element.data(elementName, this).attr('tabindex', '-1'); // @HTMLUpdateOK

      container.data(elementName, this);

      // initialize instance members
      this.container = container;
      this.containerId = containerId;
      this.containerSelector = containerSelector;
      this.elementTabIndex = elementTabIndex;

      // Configure slots only after the instance memeber container is initialized
      this._ConfigureSlots();
    },

    /**
     * Appends the created container for custom element
     *
     * @return {jQuery} The reference to the container with the appended content
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @private
     */
    _prepareContainerForCustomElement: function () {
      var _outerWrapper = this.ojContext.OuterWrapper;
      var _content = this._CreateContentElements(); // method defined by child classes
      var _containerClass = this._COMPONENT_CLASSLIST; // member initialized by child classes
      var _container;

      // For custom element, the outer wrapper will be the container
      _container = $(_outerWrapper);

      // Apply the class from the container param
      _container.addClass(_containerClass);

      _container.prepend(_content); // @HTMLUpdateOK

      return _container;
    },

    /**
     * Appends the created container for widget
     *
     * @return {jQuery} The reference to the container with the appended content
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @private
     */
    _prepareContainerForWidget: function () {
      var _element = this.opts.element;
      var _container = this._createContainerForWidget();
      var style;

      // For widgets, the container is swapped with the element
      _element.before(_container); // @HTMLUpdateOK
      _container.append(_element); // @HTMLUpdateOK

      // We’re copying the style attribute over from the outer element to
      // the container. Normally setting the style attribute would
      // trigger a CSP inline style violation. However, we won’t hit this
      // because when CSP is enabled, the outer element won’t have a style
      // attribute and thus attr(‘style’) won’t be called.
      style = this._getAttribute('style');
      if (style) {
        _container.attr('style', style); // @HTMLUpdateOK
      }

      return _container;
    },

    /**
     * Retrieves ID of the container and if one is not available, an ID will be created
     *
     * @param {jQuery} container The container element
     * @return {string} The container ID that was retrieved or created
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @private
     */
    _getOrCreateContainerId: function (container) {
      var containerId;

      if (this.ojContext._IsCustomElement()) {
        containerId = this._getAttribute('id');
        if (!containerId) {
          containerId = this._classNm + '-' + _ComboUtils.nextUid();
          container.attr('id', containerId);
        }
      } else {
        //  - ojselect - rootAttributes are not propagated to generated jet component
        var rootAttributes = this.opts.rootAttributes;
        containerId =
          rootAttributes && rootAttributes.id
            ? rootAttributes.id
            : 'ojChoiceId_' + (this._getAttribute('id') || this._classNm + _ComboUtils.nextUid());
        container.attr('id', containerId);
      }

      return containerId;
    },

    // _AbstractOjChoice
    // Readonly support
    applyReadonlyState: function () {
      var $content = this.ojContext._GetContentElement();
      if (_ComboUtils.isReadonly(this.ojContext)) {
        this.container.addClass('oj-read-only');
        if (this._classNm === 'oj-combobox') {
          if (this.ojContext.multiple) {
            // the following code is for oj-combobox-many
            $content = null;
            this.search.removeAttr('tabindex');
            this.selection.attr('tabindex', this.elementTabIndex || '0');
            if (this.ojContext.options.labelledBy) {
              // for oj-combobox-many in readonly mode, when you click on the field it is the
              // wrapper that gets focus, not the input, so you need aria-labelledby to point
              // to label element's id.
              var defaultLabelId = this.uuid + '_Label';
              var ariaLabelledBy = ojeditablevalue.EditableValueUtils._getOjLabelAriaLabelledBy(
                this.ojContext.options.labelledBy,
                defaultLabelId
              );
              if (ariaLabelledBy) {
                this.selection.attr('aria-labelledby', ariaLabelledBy);
              }
            }
            this.selection.attr('aria-readonly', true);
          } else {
            $content.attr('readonly', true);
            // create readonly div if it doesn't exist.
            this.ojContext._createOrUpdateReadonlyDiv($content[0]);
          }
        } else if (this._classNm === 'oj-select') {
          // This is not valid when the role is removed (aka default role)
          // so we need to remove it.
          $content.removeAttr('aria-readonly');
        }
        if ($content) {
          $content.removeAttr('role');
          $content.removeAttr('aria-expanded');
          $content.removeAttr('aria-controls');
          $content.removeAttr('aria-autocomplete');
        }
      } else {
        this.container.removeClass('oj-read-only');
        if (this._classNm === 'oj-combobox') {
          if (this.ojContext.multiple) {
            $content = null;
            if (this.elementTabIndex != null) {
              this.search.attr('tabindex', this.elementTabIndex);
            }
            this.selection.removeAttr('tabindex');
            this.selection.removeAttr('aria-labelledby');
            this.selection.removeAttr('aria-readonly');
          } else {
            $content.removeAttr('readonly', true);
          }
        } else if (this._classNm === 'oj-select') {
          $content.removeAttr('aria-readonly');
        }
        if ($content) {
          $content.attr('role', 'combobox');
          $content.attr('aria-expanded', 'false');
        }
      }

      this._enableInterface();
    },

    /**
     * Syncs the aria-label of the content element with the dropdown
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @public
     * @ignore
     */
    updateAriaLabelIfNeeded: function () {
      // labelEdge and labelHint are only for custom element
      if (!this.ojContext._IsCustomElement()) {
        return;
      }

      // aria-label will be set on the content element
      // sync it with the dropdown
      var alabel = this._contentElement.attr('aria-label');

      if (alabel) {
        // Update dropdown
        this.results.attr('aria-label', alabel);
      } else {
        // Update dropdown
        this.results.removeAttr('aria-label');
      }
    },

    /**
     * Syncs the labelled-by of the content element with the dropdown
     *
     * @param {string} ariaLabelledBy The aria-labelledby generated from the labelled-by attribute
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @public
     * @ignore
     */
    updateAriaLabelledByIfNeeded: function (ariaLabelledBy) {
      // Update the aria attributes of the dropdown.
      if (ariaLabelledBy) {
        this.results.attr('aria-labelledby', ariaLabelledBy);
      } else {
        this.results.removeAttr('aria-labelledby');
      }
    },

    // _AbstractOjChoice
    _clickAwayHandler: function (event) {
      var dropdown = this.dropdown;

      //  - period character in element id prevents options box open/close
      // escapeSelector handles special characters
      if (
        $(event.target).closest(dropdown).length ||
        $(event.target).closest('#' + $.escapeSelector(dropdown.attr('data-oj-containerid'))).length
      ) {
        return;
      }

      if (dropdown.length > 0) {
        this.close(event);
      }
    },

    // _AbstractOjChoice
    _surrogateRemoveHandler: function () {
      if (this.dropdown) {
        this.dropdown.remove();
      }
    },

    // _AbstractOjChoice
    _destroy: function () {
      var closeDelayTimer = this._closeDelayTimer;
      if (!isNaN(closeDelayTimer)) {
        delete this._closeDelayTimer;
        window.clearTimeout(closeDelayTimer);
      }

      var element = this.opts.element;
      var ojcomp = element.data(this._elemNm);

      this.close();
      if (this.propertyObserver) {
        delete this.propertyObserver;
        this.propertyObserver = null;
      }

      // 'results' is initialized in _init() method and it can not be changed by an external developer.

      // clean up the ul list
      if (this.opts.list && this.results) {
        this._cleanupList(this.results);
        // Move to original parent
        if (this.dropdownListParent) {
          this.dropdownListParent.append(this.results); // @HTMLUpdateOK
        }
      } else if (this.isOjOption && this.results) {
        this._unwrapOjOptions(this.results);
        this.opts.element.append(this.results.children()); // @HTMLUpdateOK
      }

      if (ojcomp !== undefined) {
        if (this.ojContext._IsCustomElement()) {
          this._cleanUpContainerForCustomElement();
        } else {
          this._cleanUpContainerForWidget();
        }

        element
          .removeAttr('aria-hidden')
          .removeData(this._elemNm)
          .off('.' + this._classNm)
          .prop('autofocus', this.autofocus || false);
        if (this.elementTabIndex) {
          element.attr({
            tabindex: this.elementTabIndex
          });
        } else {
          element.removeAttr('tabindex');
        }
        element.show();
      }

      // Clear all active timers
      this._clearActiveTimers();

      // remove jQuery data
      this.container.removeData(this._elemNm);

      // Cleanup elements reference
      this._dropdownPositioningProxyContainer = null;
      this.container = null;
      this.dropdown = null;
      this.results = null;
      this.search = null;
      this.selection = null;

      // update the flag to indicate the current instance is destroyed
      this.isInitialized = false;
    },

    /**
     * Cleans up the container for widget
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @private
     */
    _cleanUpContainerForWidget: function () {
      var element = this.opts.element;
      var ojcomp = element.data(this._elemNm);
      // Move the element outside the container to its original place
      ojcomp.container.after(element); // @HTMLUpdateOK
      ojcomp.container.remove();
      ojcomp.dropdown.remove();
    },

    /**
     * Cleans up the container for custom element
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @private
     */
    _cleanUpContainerForCustomElement: function () {
      var element = this.opts.element;
      var ojcomp = element.data(this._elemNm);

      // remove touchstart listener from dropdown
      ojcomp.dropdown[0].removeEventListener(
        'touchstart',
        this._delegatedDropdownTouchStartListener,
        { passive: true }
      );
      delete this._delegatedDropdownTouchStartListener;

      ojcomp.container.empty();
      ojcomp.container.off('click');
      ojcomp.container.append(element); // @HTMLUpdateOK
      // : COMBOBOX CUSTOM END SLOT DISAPPEARED ON REFRESH AND DEFAULT END SLOT IS SHOWN
      // If end slot was provided, move it back to its original place
      this._RestoreSlots();
    },

    // _AbstractOjChoice
    /*
     * unwrap oj-option and oj-optgroup
     */
    _unwrapOjOptions: function (list) {
      var children = list.children();
      var elem;
      var self = this;

      children.each(function () {
        elem = $(this);

        if (elem.is('li')) {
          // oj-optgroup
          if (
            elem.hasClass('oj-listbox-result-with-children') ||
            elem.children('oj-optgroup').length > 0
          ) {
            // if the oj-optgroup went through the populateResults call
            if (elem.hasClass('oj-listbox-result-with-children')) {
              elem.children('.oj-listbox-result-label').remove();
            }
            // unwrap children
            self._unwrapOjOptions(elem.find('oj-optgroup').children());
            // unwrap the <ul>
            elem.find('oj-optgroup').children().children().unwrap();
            // unwrap the <li>
            elem.find('oj-optgroup').unwrap();
          } else if (elem.hasClass('oj-listbox-result')) {
            // unwrap the <li>
            // if the oj-option went through the populateResults call
            elem.find('oj-option').unwrap().unwrap();
          } else {
            elem.find('oj-option').unwrap();
          }
        }
      });
    },

    // _AbstractOjChoice
    /*
     * Clean up the html list provided by app
     */
    _cleanupList: function (list) {
      if (list && list.is('ul')) {
        list.removeClass('oj-listbox-results oj-listbox-result-sub');
        list.removeAttr('role');
        for (var i = list.children().length - 1; i >= 0; i--) {
          this._cleanupList($(list.children()[i]));
        }
      } else if (list.is('li')) {
        if (list.hasClass('oj-listbox-placeholder') || list.hasClass('oj-listbox-no-results')) {
          list.remove();
        }

        // remove added li classes starts with oj-listbox-
        if (list.attr('class')) {
          list.attr('class', list.attr('class').replace(/oj-listbox-\S+/g, ''));
        }

        // remove wrapping div
        var wrappingDiv = list.children('.oj-listbox-result-label');
        if (wrappingDiv) {
          wrappingDiv.contents().unwrap();
        }

        if (list.css('display') === 'none') {
          list.css('display', '');
        }

        this._cleanupList(list.children('ul'));
      }
    },

    // _AbstractOjChoice
    /*
     * Processes option/optgroup/li element and return data object
     */
    _optionToData: function (element) {
      if (element.is('option') || element.is('oj-option')) {
        return {
          value: element.prop('value') || element.attr('value'),
          label: element.text().trim() || element.attr('label'),
          element: element.get(),
          css: element.attr('class'),
          disabled: element.prop('disabled'),
          locked: element.attr('locked') === 'locked' || element.data('locked') === true
        };
      } else if (element.is('optgroup') || element.is('oj-optgroup')) {
        return {
          label: element.prop('label') || element.attr('label'),
          disabled: element.prop('disabled'),
          children: [],
          element: element.get(),
          css: element.attr('class')
        };
      } else if (element.is('li')) {
        var itemLabel;
        var itemValue;
        var disabled;
        var groupData = null;
        var elemChildren = element.children();

        if (elemChildren && elemChildren.length > 0 && elemChildren.is('ul')) {
          itemLabel = element.attr('oj-data-label')
            ? element.attr('oj-data-label')
            : element.clone().children().remove().end().text().trim();
          itemValue = element.attr('oj-data-value');
          groupData = [];
        } else if (elemChildren && elemChildren.length > 0 && elemChildren.is('oj-optgroup')) {
          itemLabel = elemChildren.prop('label');
          disabled = elemChildren.prop('disabled');
          groupData = [];
        } else {
          var ojOptionItem = element.find('oj-option');
          itemLabel = element.attr('oj-data-label')
            ? element.attr('oj-data-label')
            : element.text().trim();
          itemValue =
            ojOptionItem.length > 0 ? ojOptionItem.prop('value') : element.attr('oj-data-value');
          disabled = ojOptionItem.length > 0 ? ojOptionItem.prop('disabled') : undefined;
        }

        return {
          value: itemValue,
          label: itemLabel,
          disabled: disabled,
          element: element.get(),
          css: element.attr('class'),
          children: groupData
        };
      }

      return undefined;
    },

    // _AbstractOjChoice
    /*
     * Prepares the option items to display in the drop down
     */
    _prepareOpts: function (_opts) {
      var opts = _opts;
      var element;
      var datalist;
      var self = this;

      // clone the options array if optionsKeys is specified
      if (opts.options && Array.isArray(opts.options) && opts.optionsKeys) {
        opts.options = $.extend(true, [], opts.options);
      }

      element = opts.element;
      var tagName = element.get(0).tagName.toLowerCase();

      if (opts.ojContext._IsCustomElement()) {
        if (!opts.options && opts.element.children().length > 0) {
          datalist = $(element);
          this.datalist = datalist;
        }
      } else if (tagName === 'input' && element.attr('list')) {
        datalist = $('#' + element.attr('list'));
        this.datalist = datalist;
      } else if (tagName === 'select' && element.children().length > 0) {
        // /ojselect
        datalist = element;
        this.datalist = datalist;
      } else if (opts.list) {
        // if html ul list is provided
        datalist = $('#' + opts.list);
        this.datalist = datalist;
      }

      opts = $.extend(
        {},
        {
          populateResults: function (_container, _results, query, _showPlaceholder) {
            var populate;
            var id = this.opts.id;
            var isTreeDataProvider = _ComboUtils.isTreeDataProvider(
              _ComboUtils.getDataProvider(this.opts)
            );

            var optionRenderer = this.opts.optionRenderer;
            if (typeof optionRenderer !== 'function') {
              // cannot be non-function
              optionRenderer = null;
            }

            if (this.opts.ojContext._IsCustomElement() && optionRenderer) {
              // update renderer for custom element format
              var origRenderer = optionRenderer;
              optionRenderer = function (context) {
                var obj = origRenderer(context);

                // New interface is for the renderer to return oj-option or oj-optgroup element
                if (obj && (obj.tagName === 'OJ-OPTION' || obj.tagName === 'OJ-OPTGROUP')) {
                  // Add the data-oj-binding-provider attribute if it doesn't have one so that it will be upgraded
                  if (!obj.hasAttribute('data-oj-binding-provider')) {
                    obj.setAttribute('data-oj-binding-provider', 'none');
                  }

                  return obj;
                }

                // Maintain backward compatibility with old interface
                return obj && obj.insert ? obj.insert : null;
              };
            }

            populate = function (resultsParent, results, container, depth, showPlaceholder) {
              var i;
              var l;
              var result;
              var selectable;
              var disabled;
              var node;
              var label;
              var formatted;

              var processChildren = function (_node, _result) {
                if (_result.children && _result.children.length > 0) {
                  var nestedList =
                    _result.element &&
                    $(_result.element[0]).is('li') &&
                    $(_result.element[0]).children('ul');

                  var innerContainer = nestedList
                    ? $(_result.element[0]).children('ul')
                    : $('<ul></ul>');

                  if (!innerContainer.hasClass('oj-listbox-result-sub')) {
                    innerContainer.addClass('oj-listbox-result-sub');
                  }

                  // set role
                  innerContainer.attr('role', 'group');

                  populate(_result, _result.children, innerContainer, depth + 1, false);

                  if (!nestedList) {
                    _node.append(innerContainer); // @HTMLUpdateOK
                  }
                }
              };

              var termHighlight = function (highlighterSection, pattern) {
                function innerHighlight(_node, pat) {
                  var isHighlighterNode = $(_node).is('OJ-HIGHLIGHT-TEXT');
                  var isTextNode = _node.nodeType === 3;
                  if (isHighlighterNode) {
                    _node.setAttribute('match-text', pat);
                  } else if (isTextNode) {
                    var text = _node.data;
                    // replace it with oj-highlight-text only if the text node has
                    // non-empty data
                    if (text.trim() !== '') {
                      var _ojHighlightTextElem = document.createElement('oj-highlight-text');
                      _ojHighlightTextElem.setAttribute('text', text);
                      _ojHighlightTextElem.setAttribute('match-text', pat);
                      _ojHighlightTextElem.setAttribute('data-oj-internal', '');
                      _ojHighlightTextElem.setAttribute('data-oj-binding-provider', 'none');
                      // replace the text node with the newly created oj-highlight-text element
                      _node.parentNode.replaceChild(_ojHighlightTextElem, _node);
                    }
                  } else if (
                    _node.nodeType === 1 &&
                    _node.childNodes &&
                    !/(script|style)/i.test(_node.tagName)
                  ) {
                    // This function is to highlight the text appeared in the passed-in node.
                    // So recursively it checks for child nodes also.
                    // But need not to highlight the text appeared in <script> and <style> tags, so skipping them.
                    for (var h = 0; h < _node.childNodes.length; h++) {
                      innerHighlight(_node.childNodes[h], pat);
                    }
                  }
                }

                if (highlighterSection.length && pattern && pattern.length) {
                  highlighterSection.each(function () {
                    innerHighlight(this, pattern.toUpperCase());
                  });
                }
              };

              var highlightLabelNode = function (labelNode) {
                if (opts.highlightTermInOptions(query)) {
                  var highlighterSection = labelNode.find('.oj-listbox-highlighter-section');
                  if (!highlighterSection.length) {
                    highlighterSection = labelNode;
                  }

                  termHighlight(highlighterSection, query.term);
                }
              };

              var createLabelContent = function (labelNode, _result) {
                var contentNode;
                if (optionRenderer) {
                  // For data provider, we store the whole original data item on the result wrapper
                  // object instead of copying all the fields, now we need to pass the stored original
                  // data to an option-renderer
                  var contextData = _ComboUtils.isDataProvider(opts.options) ? _result.data : _result;
                  var context = {
                    index: i,
                    depth: depth,
                    leaf: !_result.children,
                    parent: resultsParent,
                    data: contextData,
                    component: opts.ojContext,
                    parentElement: labelNode.get(0)
                  };

                  if (opts.ojContext._FixRendererContext) {
                    context = opts.ojContext._FixRendererContext(context);
                  }

                  // if an element is returned from the renderer and
                  // the parent of that element is null, we will append
                  // the returned element to the parentElement.
                  // If non-null, we won't do anything, assuming that the
                  // rendered content has already added into the DOM somewhere.
                  var content = optionRenderer.call(opts.ojContext, context);
                  if (content !== null) {
                    // allow return of document fragment from jquery create or
                    // js document.createDocumentFragment
                    if (
                      content.parentNode === null ||
                      content.parentNode instanceof DocumentFragment
                    ) {
                      labelNode.get(0).appendChild(content); // @HTMLUpdateOK
                      contentNode = content;
                    }
                  }
                } else {
                  formatted = _ComboUtils.getLabel(_result);
                  if (formatted !== undefined) {
                    labelNode.text(formatted);
                    labelNode.attr('aria-label', formatted);
                  }
                }

                highlightLabelNode(labelNode);

                return contentNode;
              };

              //  - ojselect does not show placeholder text when data option is specified
              //  - placeholder text is a selectable item that results in an error for ojcomponent
              // /ojselect only add placeholder to dropdown if there is no search filter
              // /and not required
              var placeholder = self._getPlaceholder();
              if (
                showPlaceholder &&
                placeholder !== null &&
                !query.term &&
                container.find('.oj-listbox-placeholder').length <= 0 &&
                (tagName !== 'select' || !self.ojContext._IsRequired())
              ) {
                // create placeholder item
                result = {
                  value: '',
                  label: placeholder
                };

                node = $('<li></li>');
                node.addClass(
                  'oj-listbox-placeholder oj-listbox-results-depth-0 oj-listbox-result oj-listbox-result-selectable'
                );
                node.attr('role', 'presentation');

                label = $(document.createElement('div'));
                label.addClass('oj-listbox-result-label');
                label.attr('id', 'oj-listbox-result-label-' + _ComboUtils.nextUid());
                label.attr('role', 'option');

                formatted = _ComboUtils.getLabel(result);
                if (formatted !== undefined) {
                  label.text(formatted);
                }

                label.attr('aria-label', formatted);
                node.append(label); // @HTMLUpdateOK

                node.data(self._elemNm, result);
                container.prepend(node); // @HTMLUpdateOK
              }

              for (i = 0, l = results.length; i < l; i++) {
                result = results[i];
                disabled = result.disabled === true;
                // Bug JET-31662 - ISSUE WITH AUTOMATIC SCROLLING IN A JET SELECT LIST WITH A LARGE CUSTOMER-SUPPLIED DATA SET
                // A node will be selectable only if it is a leaf node. For a node to be a leaf node, when using a
                // tree data provider, it should have not have the flag _jetUnSelectable set. When using an
                // observable array, it should not be disabled, should have a non-null value and should not have
                // any children. If result.children is not null, we consider the node be a parent node. This means
                // even if it is an empty array, we still treat it as a parent node with no children.
                selectable = isTreeDataProvider
                  ? !result._jetUnSelectable
                  : !disabled && id(result) != null && result.children == null;

                var isList = result.element && $(result.element[0]).is('li');
                node = isList ? $(result.element[0]) : $('<li></li>');

                if (node.hasClass('oj-listbox-result')) {
                  if (result.children && result.children.length > 0) {
                    processChildren(node, result);
                  }

                  highlightLabelNode($(result.element[0]).children('div'));
                  $(result.element[0]).css('display', '');
                } else {
                  node.addClass('oj-listbox-results-depth-' + depth);
                  node.addClass('oj-listbox-result');
                  node.addClass(
                    selectable ? 'oj-listbox-result-selectable' : 'oj-listbox-result-unselectable'
                  );
                  if (disabled) {
                    node.addClass('oj-disabled');
                  }
                  if (result.children) {
                    node.addClass('oj-listbox-result-with-children');
                  }
                  node.attr('role', 'presentation');

                  var labelId = 'oj-listbox-result-label-' + _ComboUtils.nextUid();
                  label = $(document.createElement('div'));
                  label.addClass('oj-listbox-result-label');
                  label.attr('id', labelId);
                  label.attr('role', 'option');
                  if (disabled) {
                    label.attr('aria-disabled', 'true');
                  }

                  //  - grouping header accessibility issue for jaws
                  // build the full path of aria-label ids, which will be referred by the leaf nodes
                  // 'ariaLabelledById' property is later used by _processAriaLabelForHierarchy
                  // to set 'aria-labelledby' attribute in leaf nodes
                  if (resultsParent && resultsParent.ariaLabelledById) {
                    result.ariaLabelledById = resultsParent.ariaLabelledById + ' ' + labelId;
                  } else {
                    result.ariaLabelledById = labelId;
                  }

                  // append label to node
                  if (!isList) {
                    var content = createLabelContent(label, result);
                    node.append(label); // @HTMLUpdateOK

                    if (
                      content &&
                      (content.tagName === 'OJ-OPTION' || content.tagName === 'OJ-OPTGROUP')
                    ) {
                      // Update the disabled state on ancestors
                      if (content.getAttribute('disabled')) {
                        node.removeClass('oj-listbox-result-selectable');
                        node.addClass('oj-listbox-result-unselectable oj-disabled');
                        label.attr('aria-disabled', 'true');
                      }

                      // Create text for oj-optgroup
                      if (content.tagName === 'OJ-OPTGROUP' && content.hasAttribute('label')) {
                        // Insert a text node for the label attribute
                        var labelText = content.getAttribute('label');
                        var textNode = document.createTextNode(labelText);
                        content.insertBefore(textNode, content.firstChild); // @HTMLUpdateOK
                      }
                    }
                  }

                  // process children
                  if (result.children && result.children.length > 0) {
                    processChildren(node, result);
                  }

                  node.data(self._elemNm, result);
                  if (!isList) {
                    container.append(node); // @HTMLUpdateOK
                  } else {
                    var elem = $(result.element[0]);
                    // oj-optgroup
                    if (elem.children('oj-optgroup').length > 0) {
                      var groupLabel = elem.children('oj-optgroup').prop('label') + '';
                      elem.prepend(label.text(groupLabel)); // @HTMLUpdateOK
                    } else if (elem.children('oj-option').length > 0) {
                      elem.contents().wrapAll(label); // @HTMLUpdateOK
                    } else {
                      // wrap the li contents except the nested ul with wrapping div
                      elem
                        .contents()
                        .filter(function () {
                          return this.tagName !== 'UL';
                        })
                        .wrapAll(label); // @HTMLUpdateOK
                    }

                    highlightLabelNode(elem.children('div'));
                    elem.css('display', '');
                  }
                }
              }
            };

            // /ojselect placehholder
            populate(null, _results, _container, 0, _showPlaceholder);
          },

          highlightTermInOptions: function (query) {
            return !(query.initial === true);
          }
        },
        _ojChoiceDefaults,
        opts
      );

      opts.id = function (e) {
        return e.value;
      };

      opts.sanitizeData = function (data, useUnparsedValue) {
        var returnData = oj.CollectionUtils.copyInto({}, data);
        if (useUnparsedValue && data.unparsedValue) {
          returnData.value = data.unparsedValue;
        }
        delete returnData.unparsedValue;
        return returnData;
      };

      opts.parseData = function (data) {
        var multi = this.ojContext.multiple;
        var value = (data || {}).value;
        var parsedData = {};
        var parsedValue;
        var formattedLabel;

        // If the provided data is a placeholder, return the same
        if (_ComboUtils.isValueForPlaceholder(false, value)) {
          return data;
        }

        // multi combobox expects an array and returns an array
        if (multi) {
          value = [value];
        }

        // try parsing the value
        try {
          parsedValue = this.ojContext._parseValue(value);
          formattedLabel = this.ojContext._formatValue(parsedValue);

          parsedData.value = Array.isArray(parsedValue) ? parsedValue[0] : parsedValue;
          parsedData.label = Array.isArray(formattedLabel) ? formattedLabel[0] : formattedLabel;
        } catch (e) {
          // Converter failed, return the original data
          return data;
        }

        return parsedData;
      };

      if (tagName !== 'select' && opts.manageNewEntry !== null) {
        opts.manageNewEntry = function (term, includeUnparsedValue) {
          const entry = {};
          let parsedEntry = entry;

          if (term == null) {
            entry.label = '';
            entry.value = '';
          } else if (typeof term === 'string') {
            entry.label = term.trim();
            entry.value = entry.label;
          } else {
            entry.label = String(term);
            entry.value = term;
          }

          if (opts.parseData != null) {
            parsedEntry = opts.parseData(entry);
            if (includeUnparsedValue === true) {
              parsedEntry.unparsedValue = entry.value;
            }
          }
          return parsedEntry;
        };
      }

      if (this.datalist) {
        opts.query = this._bind(function (query) {
          var data = {
            results: [],
            more: false
          };
          var term = query.term;
          var children;
          var process;

          process = function (elm, collection) {
            var group;
            var elems;
            var nestedLi =
              elm.children() &&
              elm.children().length > 0 &&
              (elm.children().is('ul') || elm.children().is('oj-optgroup'));
            if (elm.is('option') || elm.is('oj-option') || (elm.is('li') && !nestedLi)) {
              if (query.matcher(term, elm.text() || elm.attr('label'), elm)) {
                collection.push(self._optionToData(elm));
              }
            } else if (elm.is('optgroup') || elm.is('oj-optgroup') || (elm.is('li') && nestedLi)) {
              group = self._optionToData(elm);

              if (elm.is('optgroup') || elm.is('oj-optgroup')) {
                elems = elm.children();
              } else if (elm.children('oj-optgroup')) {
                elems = elm.children().children('ul').children();
              } else {
                elm.children('ul').children();
              }

              _ComboUtils.each2(elems, function (i, el) {
                process(el, group.children);
              });

              if (group.children.length > 0) {
                collection.push(group);
              }
            }
          };

          children = this.datalist.children();

          // /ojselect remove existing placeholder item
          if (
            this._getPlaceholder() !== undefined &&
            children.length > 0 &&
            children.first().attr('value') === ''
          ) {
            children = children.slice(1);
          }

          _ComboUtils.each2(children, function (i, elm) {
            process(elm, data.results);
          });
          query.callback(data);
        });
      } else if ('options' in opts) {
        var dataOptions = opts.options;

        if (_ComboUtils.getDataProvider(opts)) {
          opts.query = function (query) {
            if (query.value) {
              _ComboUtils.fetchByKeyFromDataProvider(self, opts, query);
            } else {
              _ComboUtils.fetchFromDataProvider(self, opts, query);
            }
          };
        } else if ($.isFunction(dataOptions)) {
          opts.query = _ComboUtils.remote(dataOptions, opts.optionsKeys ? opts.optionsKeys : null);
        } else {
          opts.query = _ComboUtils.local(dataOptions, opts.optionsKeys ? opts.optionsKeys : null);
        }
      }

      return opts;
    },

    // _AbstractOjChoice
    _createHeader: function () {
      var headerElem = this.opts.element.find('.oj-listbox-header');
      if (headerElem.length) {
        this.header = $('<li>', {
          class: 'oj-listbox-result-header oj-listbox-result-unselectable',
          role: 'presentation'
        });

        this.header.append(headerElem.children()); // @HTMLUpdateOK
        this._initializeHeaderItems();

        var resultsNHeaderContainer = $('<ul>', {
          class: 'oj-listbox-results-with-header',
          role: 'listbox'
        });

        resultsNHeaderContainer.append(this.header); // @HTMLUpdateOK
        resultsNHeaderContainer.appendTo(this.results.parent()); // @HTMLUpdateOK

        var resultsWrapper = $('<li>', { role: 'presentation' });
        resultsNHeaderContainer.append(resultsWrapper); // @HTMLUpdateOK

        this.results.attr('role', 'presentation');
        this.results.appendTo(resultsWrapper); // @HTMLUpdateOK
      }

      this.headerInitialized = true;
    },

    _initializeHeaderItems: function () {
      this.headerItems = this.header.find("li[role='option'], li:not([role])");
      this.headerItems.uniqueId();

      this.header.find('ul').attr('role', 'presentation');
      this.header.find('li:not([role])').attr('role', 'option');

      var selector = 'a, input, select, textarea, button, object, .oj-component-initnode';
      this.header.find(selector).each(function () {
        $(this).attr('tabIndex', -1);
      });
    },

    _isHeaderItem: function (item) {
      var isHeaderItem = false;

      this.headerItems.each(function () {
        if ($(this).attr('id') === item) {
          isHeaderItem = true;
          return false;
        }
        return true;
      });

      return isHeaderItem;
    },

    _getNextHeaderItem: function (currentItem) {
      if (!this.headerItems) {
        return null;
      }

      if (!currentItem) {
        return this.headerItems.first();
      }

      var foundCurrentItem = false;
      var nextItem = null;
      this.headerItems.each(function () {
        if (foundCurrentItem) {
          nextItem = $(this);
          return false;
        }

        foundCurrentItem = $(this).attr('id') === currentItem;
        return true;
      });

      return nextItem;
    },

    _getPreviousHeaderItem: function (currentItem) {
      if (!this.headerItems) {
        return null;
      }

      var previousItem = null;
      this.headerItems.each(function () {
        if ($(this).attr('id') === currentItem) {
          return false;
        }

        previousItem = $(this);
        return true;
      });

      return previousItem;
    },

    _setFocusOnHeaderItem: function (item) {
      var focusable = item.find('.oj-component .oj-enabled').first();
      if (focusable.length === 0) {
        var selector = 'a, input, select, textarea, button, object, .oj-component-initnode';
        focusable = item.find(selector).first();
        if (focusable.length === 0) {
          focusable = item.children().first();
        }
      }
      if (focusable) {
        focusable.addClass('oj-focus oj-focus-highlight oj-focus-only');
      }
    },

    _removeHighlightFromHeaderItems: function () {
      if (this.headerItems) {
        this.headerItems.find('.oj-focus').removeClass('oj-focus oj-focus-highlight oj-focus-only');
      }
    },

    // _AbstractOjChoice
    _triggerSelect: function (data) {
      var evt = $.Event(this._elemNm + '-selecting', {
        val: this.id(data),
        object: data
      });
      this.opts.element.trigger(evt);
      return !evt.isDefaultPrevented();
    },

    /**
     * Triggers an internal event to indicate a change in the loading indicator
     *
     * @param {string} content A string indicating which content the loading state represents
     * @param {boolean} loadingState Indicates whether the component is currently loading data
     *
     * @instance
     * @private
     * @memberof _AbstractOjChoice
     */
    _triggerInternalLoadingStateChange: function (content, loadingState) {
      const data = { content: content, isLoading: loadingState };
      const event = $.Event(`${this._elemNm}-internal-loading-state-changed`, { detail: data });
      this.opts.element.trigger(event);
    },

    // _AbstractOjChoice
    _isInterfaceEnabled: function () {
      return this.enabledInterface === true;
    },

    // _AbstractOjChoice
    _enableInterface: function () {
      // Readonly support
      var enabled = this._enabled && !(_ComboUtils.isReadonly(this.ojContext) || this._readonly);

      if (enabled === this.enabledInterface) {
        return false;
      }

      // Readonly support
      if (!_ComboUtils.isReadonly(this.ojContext)) {
        this.container.toggleClass('oj-disabled', !enabled);
      }
      this.close();
      this.enabledInterface = enabled;

      return true;
    },

    // _AbstractOjChoice
    _enable: function (_enabled) {
      var enabled = _enabled;
      if (enabled === undefined) {
        enabled = true;
      }
      if (this._enabled === enabled) {
        return;
      }
      this._enabled = enabled;

      this.opts.element.prop('disabled', !(enabled || _ComboUtils.isReadonly(this.ojContext)));

      this.container.toggleClass('oj-enabled', enabled);

      this._enableInterface();
    },

    // _AbstractOjChoice
    _disable: function () {
      this._enable(false);
    },

    // _AbstractOjChoice
    _readonly: function (_enabled) {
      var enabled = _enabled;
      if (enabled === undefined) {
        enabled = false;
      }
      if (this._readonly === enabled) {
        return false;
      }
      this._readonly = enabled;

      this.opts.element.prop('readonly', enabled);
      this._enableInterface();
      return true;
    },

    // _AbstractOjChoice
    _opened: function () {
      return this.container.hasClass('oj-listbox-dropdown-open');
    },

    // _AbstractOjChoice
    _getDropdownPositionElement: function () {
      return this.container[0].querySelector('.oj-text-field-container');
    },

    // _AbstractOjChoice
    _usingHandler: function (pos, props) {
      // if the input part of the component is clipped in overflow, implicitly close the dropdown popup.
      if (oj.PositionUtils.isAligningPositionClipped(props)) {
        // add busy state
        var resolveBusyState = _ComboUtils._addBusyState(this.container, 'closing popup');
        // prettier-ignore
        this._closeDelayTimer = window.setTimeout( // @HTMLUpdateOK
          function () {
            this.close();
            resolveBusyState();
          }.bind(this),
          1
        );

        return;
      }

      const $container = this.container;
      const $dropdown = this.dropdown;
      const $results = this.results;

      // Resize dropdown if it overflows
      const availableSize = oj.PositionUtils.calcAvailablePopupSize(pos, props);

      // We need to use the dropdown height for calculating the avialable height.
      // But the dropdown contains 3 parts in it. The message container, the search
      // field in select and the results container. Here, the max-height is set on the
      // results container. So, once we calculate the net available max-height for the
      // results container and adjust the same.
      const resultsHeight = $results.outerHeight();
      const dropdownHeight = $dropdown.outerHeight(true);

      // Extra elements height includes height of the search field (if exists),
      // dropdown message (if exists) and dropdown margin
      const extraElementsHeight = dropdownHeight - resultsHeight;

      const netAvailableHeight =
        availableSize.height - extraElementsHeight - this._dropdownVerticalOffset;
      const newHeight = Math.min(this._defaultResultsMaxHeight, netAvailableHeight);

      // Make sure the max-width and max-height attributes are cleared properly from
      // the correct elements in the _clearDropdownAlignmentPreference method. This
      // method will be called when the dropdown is closed.
      $results.css('max-height', newHeight);

      // Call position without using since we are calling it from the
      // using handler. The dropdown should be placed in the same position
      // but the overflow should have been handled.
      const dropdownPosition = this._getDropdownPosition(true);
      $dropdown.position(dropdownPosition);

      if (props.vertical === 'bottom') {
        $container.addClass('oj-listbox-drop-above');
        $dropdown.addClass('oj-listbox-drop-above');
      } else {
        $container.removeClass('oj-listbox-drop-above');
        $dropdown.removeClass('oj-listbox-drop-above');
      }
    },

    // _AbstractOjChoice
    _getDropdownPosition: function (excludeUsingHandler) {
      var defPosition = {
        my: 'start top',
        at: 'start bottom',
        of: this._getDropdownPositionElement(),
        collision: 'flip',
        offset: { x: 0, y: this._dropdownVerticalOffset }
      };
      if (!excludeUsingHandler) {
        defPosition.using = this._usingHandler.bind(this);
      }
      var isRtl = DomUtils.getReadingDirection() === 'rtl';
      var position = oj.PositionUtils.normalizeHorizontalAlignment(defPosition, isRtl);
      // need to coerce to Jet and then JqUi in order for vertical offset to work
      position = oj.PositionUtils.coerceToJet(position);
      position = oj.PositionUtils.coerceToJqUi(position);
      // set the position.of again to be the element, because coerceToJet will change it to a
      // string selector, which can then result in an error being thrown from jqueryui
      // position.js getDimensions(elem) method if the element has been removed from the DOM
      position.of = defPosition.of;
      return position;
    },

    // _AbstractOjChoice
    _positionDropdown: function () {
      var $dropdown = this.dropdown;
      var position = this._getDropdownPosition();
      var $container = this.container;

      $dropdown.css('width', $container.outerWidth());

      // Here we will be using the proxy element with the maximum height set for
      // the initial positioning
      const $proxyContainer = this._dropdownPositioningProxyContainer;
      const $proxyOuterDiv = $proxyContainer.children();
      const $proxyResultElem = $proxyOuterDiv.find('.oj-listbox-results');

      $proxyContainer.appendTo(this.body()); // @HTMLUpdateOK

      $proxyOuterDiv.css({
        width: $dropdown.outerWidth()
      });
      $proxyResultElem.css({
        height: $proxyResultElem.css('max-height')
      });
      $proxyOuterDiv.position(position);

      $proxyContainer.detach();
    },

    // _AbstractOjChoice
    // beforeExpand
    _shouldOpen: function (e) {
      if (this._opened()) {
        return false;
      }
      // Readonly support
      if (
        this._enabled === false ||
        _ComboUtils.isReadonly(this.ojContext) ||
        this._readonly === true
      ) {
        return false;
      }

      var eventData = {
        component: this.opts.element
      };

      return this.ojContext._trigger('beforeExpand', e, eventData);
    },

    // _AbstractOjChoice
    _clearDropdownAlignmentPreference: function () {
      // clear the classes used to figure out the preference of where the dropdown should be opened
      this.container.removeClass('oj-listbox-drop-above');
      this.dropdown.removeClass('oj-listbox-drop-above');

      this.results.css('max-height', '');
    },

    // _AbstractOjChoice
    /**
     * Opens the dropdown
     *
     * @return {boolean} whether or not dropdown was opened. This method will return false if, for example,
     * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
     * @ignore
     */
    open: function (e, dontUpdateResults, dontShowSearchbox) {
      if (!this._shouldOpen(e)) {
        return false;
      }
      this._opening(e, dontUpdateResults, dontShowSearchbox);
      return true;
    },

    // _AbstractOjChoice
    _opening: function () {
      if (!this.headerInitialized) {
        this._createHeader();
      }

      this.container.addClass('oj-listbox-dropdown-open');
      this._showDropDown();
    },

    // _AbstractOjChoice
    _showDropDown: function () {
      if (!this._opened()) {
        // Just to make sure that _opening() method is called before calling
        // the _showDropDown().
        return;
      }

      var alreadyExpanded = this._getActiveContainer().attr('aria-expanded');
      if (alreadyExpanded === 'true') {
        return;
      }

      this._clearDropdownAlignmentPreference();

      // Check if the popup already exists and is open, if so trigger refresh event on the descendents.
      // If not, create and open a new popup.
      const dropdownStatus = oj.ZOrderUtils.getStatus(this.dropdown);
      if (dropdownStatus === oj.ZOrderUtils.STATUS.OPEN) {
        // trigger the POPUP_REFRESH event on the dropdown element
        oj.PopupService.getInstance().triggerOnDescendents(
          this.dropdown,
          oj.PopupService.EVENT.POPUP_REFRESH
        );
      } else {
        if (this.dropdown[0] !== this.body().children().last()[0]) {
          this.dropdown.detach().appendTo(this.body()); // @HTMLUpdateOK
        }

        this.dropdown.appendTo(this.body()); // @HTMLUpdateOK

        if (this.header) {
          this.dropdown.find('.oj-listbox-results-with-header').prepend(this.header); // @HTMLUpdateOK
          this.header.show();
        }

        var psEvents = {};
        psEvents[oj.PopupService.EVENT.POPUP_CLOSE] = $.proxy(this.close, this);
        psEvents[oj.PopupService.EVENT.POPUP_REMOVE] = $.proxy(this._surrogateRemoveHandler, this);
        psEvents[oj.PopupService.EVENT.POPUP_AUTODISMISS] = $.proxy(this._clickAwayHandler, this);
        psEvents[oj.PopupService.EVENT.POPUP_REFRESH] = $.proxy(this._positionDropdown, this);

        /** @type {!Object.<oj.PopupService.OPTION, ?>} */
        var psOptions = {};
        psOptions[oj.PopupService.OPTION.POPUP] = this.dropdown;
        psOptions[oj.PopupService.OPTION.LAUNCHER] = this.opts.element;
        psOptions[oj.PopupService.OPTION.EVENTS] = psEvents;
        psOptions[oj.PopupService.OPTION.POSITION] = this._getDropdownPosition();
        psOptions[oj.PopupService.OPTION.LAYER_SELECTORS] = 'oj-listbox-drop-layer';
        psOptions[oj.PopupService.OPTION.CUSTOM_ELEMENT] = this.ojContext._IsCustomElement();
        oj.PopupService.getInstance().open(psOptions);

        // move the global id to the correct dropdown
        $('#oj-listbox-drop').removeAttr('id');
        this.dropdown.attr('id', 'oj-listbox-drop');

        var containerId = this.containerId;
        this.dropdown.attr('data-oj-containerid', containerId);
      }

      // show the elements
      this._positionDropdown();

      // /select: accessibility
      this._getActiveContainer().attr('aria-expanded', true);
    },

    // _AbstractOjChoice
    // eslint-disable-next-line no-unused-vars
    close: function (event, shouldReopenOnNewData) {
      // This is used by the combobox to determine whether the dropdown
      // should be reopened when new data comes
      this.shouldReopenOnNewData = shouldReopenOnNewData === true;
      if (!this._opened()) {
        return;
      }

      this.container.removeClass('oj-listbox-dropdown-open');

      var dropDownVisible = this._getActiveContainer().attr('aria-expanded');
      delete this.ojContext._resolveSearchBoxLater;

      if (!dropDownVisible || dropDownVisible === 'false') {
        return;
      }

      var cid = this.containerId;
      var scroll = 'scroll.' + cid;
      var resize = 'resize.' + cid;
      var orient = 'orientationchange.' + cid;

      // unbind event listeners
      this.container
        .parents()
        .add(window)
        .each(function () {
          $(this).off(scroll).off(resize).off(orient);
        });

      this._clearDropdownAlignmentPreference();

      /** @type {!Object.<oj.PopupService.OPTION, ?>} */
      var psOptions = {};
      psOptions[oj.PopupService.OPTION.POPUP] = this.dropdown;
      oj.PopupService.getInstance().close(psOptions);

      if (this.header) {
        // When popup opened header will be shown in the popup.
        // But once it is closed contents of the popup will be removed,
        // but the header should not be detached from the DOM,
        // because knockout binding will be lost. That is why header will be
        // moved under the component container. And when again popup opened
        // it will be added back to the popup.
        this.header.hide();
        this.header.appendTo(this.container); // @HTMLUpdateOK
      }

      this.dropdown.removeAttr('data-oj-containerid');
      this.dropdown.removeAttr('id');

      if (this.opts.list || this.isOjOption) {
        this._removeHighlight();
      } else {
        this.dropdown.detach();
        this.results.empty();
      }

      this.dropdown.appendTo(this.container); // @HTMLUpdateOK

      // /select: accessibility
      this._getActiveContainer().attr('aria-expanded', false);
      // force clear the aria attributes related to dropdown
      this._updateMatchesCount('', true);

      if (this._elemNm === 'ojcombobox') {
        this._getActiveContainer().removeAttr('aria-activedescendant');
      }

      //  - press escape after search in select causes select to become unresponsive
      $.removeData(this.container, this._classNm + '-last-term');

      // JET-46223 - search field is not displayed after entering text with no search results
      // When the dropdown is closed, the ojContext._resultsCount property need to be reseted.
      // This way we can make sure that the stale value is not used when the dropdown is opened
      // again and we need to figure out whether or not to show the search field.
      delete this.ojContext._resultCount;
    },

    // _AbstractOjChoice
    _setPickerAttributes: function (pickerAttributes) {
      ojeditablevalue.EditableValueUtils.setPickerAttributes(this.dropdown, pickerAttributes);
    },

    // _AbstractOjChoice
    _clearSearch: function () {},

    // _AbstractOjChoice
    _ensureHighlightVisible: function () {
      var results = this.results;
      var children;
      var child;
      var hb;
      var rb;
      var y;
      var more;

      var index = this._highlight();

      if (index < 0) {
        return;
      }

      children = this._findHighlightableChoices();
      child = $(children[index]);
      hb = child.offset().top + child.outerHeight(true);

      // if this is the last child lets also make sure oj-combobox-more-results is visible
      if (index === children.length - 1) {
        more = results.find('li.oj-listbox-more-results');
        if (more.length > 0) {
          hb = more.offset().top + more.outerHeight(true);
        }
      }

      rb = results.offset().top + results.outerHeight(true);
      if (hb > rb) {
        results.scrollTop(results.scrollTop() + (hb - rb));
      }
      y = child.offset().top - results.offset().top;

      // make sure the top of the element is visible
      if (y < 0 && child.css('display') !== 'none') {
        results.scrollTop(results.scrollTop() + y); // y is negative
      }
    },

    // _AbstractOjChoice
    _findHighlightableChoices: function () {
      return this.results
        .find('.oj-listbox-result-selectable:not(.oj-disabled, .oj-selected)')
        .filter(function () {
          return $(this).css('display') !== 'none';
        });
    },

    // _AbstractOjChoice
    _moveHighlight: function (delta) {
      var choices = this._findHighlightableChoices();
      var index = this._highlight();

      if (this.header && (index <= 0 || index === choices.length - 1)) {
        var activeDescendant = this._getActiveContainer().attr('aria-activedescendant');
        var isHeaderItem = this._isHeaderItem(activeDescendant);
        if (!isHeaderItem) {
          activeDescendant = null;
        }

        var headerItem = null;
        if (delta > 0 && (index < 0 || index === choices.length - 1)) {
          headerItem = this._getNextHeaderItem(activeDescendant);
        } else if (delta < 0 && ((isHeaderItem && index < 0) || index === 0)) {
          headerItem = this._getPreviousHeaderItem(activeDescendant);
        }

        if (headerItem) {
          this._removeHighlight();
          this._setFocusOnHeaderItem(headerItem);

          this._getActiveContainer().attr('aria-activedescendant', headerItem.attr('id'));

          return;
        } else if (isHeaderItem && delta < 0) {
          index = 0;
        }
      }

      while (index >= -1 && index < choices.length) {
        index += delta;

        // support cycling through the first/last item
        if (index === choices.length) {
          index = 0;
        } else if (index === -1) {
          index = choices.length - 1;
        }

        var choice = $(choices[index]);
        if (
          choice.hasClass('oj-listbox-result-selectable') &&
          !choice.hasClass('oj-disabled') &&
          !choice.hasClass('oj-selected')
        ) {
          this._highlight(index, true);
          break;
        }
      }
    },

    // _AbstractOjChoice
    _highlight: function (_index, isKeyboardAction, isInitial) {
      let index = _index;
      const choices = this._findHighlightableChoices();
      let choice;
      let highlightElement;

      if (arguments.length === 0) {
        // If no argumnets passed then currently highlighted
        // option will be returned.
        var curSelected = choices.filter('.oj-hover');
        if (!curSelected.length) {
          curSelected = choices.children('.oj-hover').closest('.oj-listbox-result');
        }
        //  - acc: screenreader not reading ojselect items
        this._updateMatchesCount(curSelected.text());
        return choices.get().indexOf(curSelected[0]);
      }

      if (index >= choices.length) {
        index = choices.length - 1;
      }
      if (index < 0) {
        index = 0;
      }

      this._removeHighlight();

      choice = $(choices[index]);
      highlightElement = choice;
      if (choice.hasClass('oj-listbox-result-with-children')) {
        highlightElement = choice.children('.oj-listbox-result-label');
      }

      highlightElement.addClass('oj-hover');
      // If highlighted through keyboard action, add the keyboard
      // focus style class
      if (isKeyboardAction) {
        highlightElement.addClass('oj-listbox-result-keyboard-focus');
        // If this is not initial selection, the add oj-focus-highlight
        // class to add outline.
        if (!isInitial) {
          highlightElement.addClass('oj-focus-highlight');
        }
      }
      //  - acc: screenreader not reading ojselect items
      this._updateMatchesCount(highlightElement.text());

      // ensure assistive technology can determine the active choice
      // /select: accessibility
      this._getActiveContainer().attr(
        'aria-activedescendant',
        choice.find('.oj-listbox-result-label').attr('id')
      );

      this._ensureHighlightVisible();
      return 0;
    },

    // _AbstractOjChoice
    _removeHighlight: function () {
      this.results
        .find('.oj-hover')
        .removeClass('oj-hover oj-listbox-result-keyboard-focus oj-focus-highlight');
      this._removeHighlightFromHeaderItems();

      if (this._elemNm === 'ojcombobox') {
        this._getActiveContainer().removeAttr('aria-activedescendant');
      }
    },

    // _AbstractOjChoice
    _highlightUnderEvent: function (event) {
      var el = $(event.target).closest('.oj-listbox-result-selectable');
      if (el.length > 0 && !el.is('.oj-hover')) {
        var choices = this._findHighlightableChoices();
        this._highlight(choices.index(el));
      } else if (el.length === 0) {
        // if we are over an unselectable item remove all highlights
        this._removeHighlight();
      }
    },

    // _AbstractOjChoice
    _updateMatchesCount: function (translatedString, forcedUpdate) {
      // write to this liveRegion only when the dropdown message box doesn't exist
      // or if it needs to be forcefully shown
      if (!this.dropdown.find('.oj-listbox-filter-message-text').length || forcedUpdate === true) {
        var liveRegion = this.container.find('.oj-listbox-liveregion');
        if (liveRegion.length) {
          liveRegion.text(translatedString);
        }
      }
    },

    // _AbstractOjChoice
    _updateResults: function (initial, force) {
      var search = this.search;
      var self = this;
      var term = search.val();
      var lastTerm = $.data(this.container, this._classNm + '-last-term');

      // prevent duplicate queries against the same term
      // not applying to multi select since user can search the same term after making selection
      // it's ok for single select since the last term will be updated after selection
      if (
        initial !== true &&
        lastTerm &&
        term === lastTerm &&
        this.opts.multiple !== true &&
        !force
      ) {
        return;
      }

      // In IE even for chnage of placeholder fires 'input' event,
      // so in such cases we don't need to query for results.
      if (!lastTerm && !term && initial && initial.type === 'input') {
        return;
      }

      $.data(this.container, this._classNm + '-last-term', term);

      var minLength = this.opts.minLength || 0;
      if (term.length >= minLength) {
        if (this._queryTimer) {
          this._queryTimer.clear();
        }

        if (!initial || initial === true) {
          this._queryResults(initial);
        } else {
          this._queryResolveBusyState = _ComboUtils._addBusyState(this.container, 'query results');
          this._queryTimer = TimerUtils.getTimer(_ComboUtils.DEFAULT_QUERY_DELAY);
          this._queryTimer
            .getPromise()
            .then(function (completed) {
              if (completed) {
                self._queryResults(initial);
              }
            })
            .then(this._queryResolveBusyState);
        }
      } else {
        this.close();
      }
    },

    // _AbstractOjChoice
    _queryResults: function (initial) {
      var search = this.search;
      var results = this.results;
      var opts = this.opts;
      var self = this;
      var input;
      var term = search.val();
      // sequence number used to drop out-of-order responses
      var queryNumber = 0;

      var minLength = opts.minLength || 0;
      if (minLength > term.length) {
        this.close();
        return;
      }

      this.open(null, true);

      // Show loading indicator in the dropdown
      _ComboUtils.updateDropdownLoadingState(this, true);

      function postRender() {
        // JET-46027 - combobox many - item auto selecting from dropdown sometimes when dropdown appears infront of cursor
        // Dropdown content can contain custom elements and they might not be upgraded yet.
        // So, we need to wait for the rendering to be done before we reposition the dropdown
        // again.
        if (self._resultsBusyContext.isReady()) {
          // Clear any busyState promises that we are waiting on.
          self._resultsBusyContextPromise = null;
          // the results container is ready to be positioned.
          self._positionDropdown();
        } else {
          // reposition once the busyState is resolved or rejected
          // Store the busyContext whenReady promise so that we can
          // react only to the latest promise
          const resultsBusyContextPromise = self._resultsBusyContext.whenReady();
          self._resultsBusyContextPromise = resultsBusyContextPromise;

          const repositionDropdown = function () {
            // only react to the latest promise
            if (self._resultsBusyContextPromise === resultsBusyContextPromise) {
              // clear the stored promise
              self._resultsBusyContextPromise = null;
              self._positionDropdown();
            }
          };
          resultsBusyContextPromise
            .then(repositionDropdown, repositionDropdown)
            .catch(repositionDropdown);
        }

        if (self.header && self.headerItems.length) {
          var highlightableChoices = self._findHighlightableChoices();
          var totalOptions = self.headerItems.length + highlightableChoices.length;

          self.headerItems.attr('aria-setsize', totalOptions);
          if (highlightableChoices.length) {
            var highlightableOptions = highlightableChoices.children("[role='option']");
            highlightableOptions.attr('aria-setsize', totalOptions);
            highlightableOptions.first().attr('aria-posinset', self.headerItems.length + 1);
          }
        }
      }

      this.queryCount += 1;
      queryNumber = this.queryCount;

      this._removeHighlight();
      input = this.search.val();
      if (
        input !== undefined &&
        input !== null &&
        (initial !== true ||
          opts.inputSearch ||
          opts.filterOnOpen === 'rawValue' ||
          opts.minLength > 0)
      ) {
        term = input;
      } else {
        term = '';
      }

      this.resultsPage = 1;

      opts.query({
        element: opts.element,
        term: term,
        page: this.resultsPage,
        context: null,
        matcher: opts.matcher,
        callback: this._bind(function (data) {
          // if the instance is destroyed at this point, do nothing
          if (!this.isInitialized) {
            return;
          }
          // clear dropdown loading indicator
          _ComboUtils.updateDropdownLoadingState(this, false);

          // ignore old responses
          if (queryNumber !== this.queryCount) {
            return;
          }

          // ignore a response if the oj-combobox has been closed before it was received
          if (!this._opened()) {
            return;
          }

          // clear dropdown message if any
          if (!opts.ojContext._hasMore) {
            _ComboUtils.removeDropdownMessage(self.dropdown);
          }

          // clear hidden class from results if any
          this.results.removeClass(_ComboUtils.STYLE_CLASS.HIDDEN);

          // save context, if any
          this.context = !data || data.context === undefined ? null : data.context;
          // create a default choice and prepend it to the list

          const hasNoMatches = !data || (data.results && data.results.length === 0);
          const hasAllSelectedAndValid = this._isDataSelected(data) && this.ojContext.isValid();
          const hasNoMatchFormatter = _ComboUtils.checkFormatter(
            opts.formatNoMatches,
            'formatNoMatches'
          );
          const hasNoMoreResultsFormatter = _ComboUtils.checkFormatter(
            opts.formatNoMoreResults,
            'formatNoMoreResults'
          );
          if (
            (hasNoMatches && hasNoMatchFormatter) ||
            (hasAllSelectedAndValid && hasNoMoreResultsFormatter)
          ) {
            let translatedString;
            // When all results are selected and it is the initial fetch, show no more results
            if (hasAllSelectedAndValid) {
              translatedString = opts.formatNoMoreResults(self.ojContext);
            } else {
              translatedString = opts.formatNoMatches(self.ojContext);
            }
            if (this._classNm === 'oj-select' || this.header) {
              this._showDropDown();
              this._preprocessResults(results);

              _ComboUtils.addDropdownMessage(self.dropdown, self.ojContext, translatedString);
              // Hide the results area
              this.results.addClass(_ComboUtils.STYLE_CLASS.HIDDEN);

              // if no search box, don't need a separator
              if (!this._hasSearchBox()) {
                var separator = self.dropdown.find('.oj-listbox-filter-message-separator');
                if (separator.length) {
                  separator.css('display', 'none');
                }
              }
              postRender();
            } else {
              this.close(null, true);
            }

            this._updateMatchesCount(translatedString);
            return;
          }

          _ComboUtils.saveLastQueryResult(this, data.results);

          this._showDropDown();
          this._preprocessResults(results);

          self.opts.populateResults.call(
            this,
            results,
            data.results,
            {
              term: search.val(),
              page: this.resultsPage,
              context: null,
              initial: initial
            },
            this._showPlaceholder()
          );
          this._postprocessResults(data, initial);
          postRender();

          this._updateMatchesCount(
            opts.formatMoreMatches(self.ojContext, this._findHighlightableChoices().length)
          );
        }),
        cleanup: this._bind(function () {
          // clear dropdown loading indicator
          _ComboUtils.updateDropdownLoadingState(this, false);
        })
      });
    },

    // _AbstractOjChoice
    _preprocessResults: function (results) {
      if (this.opts.list || this.isOjOption) {
        var resultList = results.children();

        // hide the list items
        this._hideResultList(resultList);
      } else {
        results.empty();
      }
    },

    // _AbstractOjChoice
    _processAriaLabelForHierarchy: function () {
      //  - grouping header accessibility issue for jaws
      // For Hierarchical data, screen reader should read:
      // 1. the label full-path for the first and last node at the leaf level
      // 2. the label for the nodes between first and last node at the leaf level
      var compound = this.results.find('.oj-listbox-result-with-children');
      if (compound.length === 0) {
        return;
      }

      var self = this;
      var setAriaLabelledBy = function (node) {
        var nodeLabel = node.find('.oj-listbox-result-label');
        var ariaLabelledById = node.data(self._elemNm).ariaLabelledById;
        if (ariaLabelledById && nodeLabel) {
          nodeLabel.attr('aria-labelledby', ariaLabelledById);
        }
      };
      _ComboUtils.each2(compound, function (i, choice) {
        // process aria-labelledby attribute for the selectable and visible leaf nodes
        var leafNodes = choice.find('.oj-listbox-result-selectable:visible');
        // first and last node at the leaf level should have the
        // aria-labelledby pointing to the full-path of labelIds
        if (leafNodes && leafNodes.length > 0) {
          // first leaf node
          setAriaLabelledBy($(leafNodes[0]));
          // last leaf node
          if (leafNodes.length > 1) {
            setAriaLabelledBy($(leafNodes[leafNodes.length - 1]));
          }
        }
      });
    },

    // _AbstractOjChoice
    _normalizeHighlighterLabel: function (item) {
      var highlighterSection;
      if (item.children('div').children('oj-option').length > 0) {
        // The text may be wrapped inside another span with foreach data-bind
        highlighterSection = item.children('div').children('oj-option').find('oj-highlight-text');
      } else {
        highlighterSection = item.children('div').children('oj-highlight-text');
      }
      if (highlighterSection.length > 0) {
        for (var i = 0; i < highlighterSection.length; i++) {
          var ojHighlightTextElem = highlighterSection[i];
          var text = ojHighlightTextElem.getAttribute('text') || '';
          var textNode = document.createTextNode(text);
          // replace the oj-highlight-text with the old text node
          ojHighlightTextElem.parentElement.replaceChild(textNode, ojHighlightTextElem);
        }
      }
    },

    // _AbstractOjChoice
    _hideResultList: function (resultList) {
      for (var i = 0; i < resultList.length; i++) {
        var item = $(resultList[i]);
        if (item.is('LI')) {
          if (item.hasClass('oj-listbox-no-results') || item.hasClass('oj-listbox-placeholder')) {
            item.remove();
          }

          item.css('display', 'none');
          if (item.hasClass('oj-selected')) {
            item.removeClass('oj-selected');
          }

          // remove highlighter section and merge back text nodes
          this._normalizeHighlighterLabel(item);
        }

        var nested;
        if (item.children('oj-optgroup')) {
          nested = item.children('oj-optgroup').children('ul');
        } else {
          nested = item.children('ul');
        }

        if (nested && nested.children()) {
          this._hideResultList(nested.children());
        }
      }
    },

    // _AbstractOjChoice
    _cancel: function (event) {
      this.close(event);
    },

    // _AbstractOjChoice
    _focusSearch: function () {
      _ComboUtils._focus(this, this.search);
    },

    // _AbstractOjChoice
    _selectHighlighted: function (_options, event, isKeyboardAction) {
      var options = _options;
      if (this.header) {
        var activeDescendant = this._getActiveContainer().attr('aria-activedescendant');
        if (this._isHeaderItem(activeDescendant)) {
          // There can be clickable elements in the custom header and
          // which can also be selected through UP/DOWN arrow keys.
          // When such header elements selected through keyboard
          // they should work as if they have clicked.
          // That is why simulating the click on header options.

          var activeItem = $('#' + activeDescendant);
          var selector = 'a, input, select, textarea, button, object';
          var clickable = activeItem.find(selector).first();
          if (clickable.length === 0) {
            clickable = activeItem.children();
          }
          if (clickable.length) {
            clickable[0].click();
          }

          this.close(event);
          return;
        }
      }

      var index = this._highlight();
      var data = this._getHighlightedForSelection(isKeyboardAction);

      if (data) {
        this._highlight(index);

        var previousValue = this.getVal();
        options = options || {};
        options.trigger = _ComboUtils.ValueChangeTriggerTypes.OPTION_SELECTED;

        var onSelectReturn = this._onSelect(data, options, event);

        if (onSelectReturn instanceof Promise) {
          onSelectReturn.then(
            this._bind(function (result) {
              if (result) {
                // trigger events only if the value is set
                this._triggerUpdateEvent(data, options, event);
                this._triggerValueUpdatedEvent(data, previousValue);
              }
            })
          );
        } else if (onSelectReturn !== false) {
          // Need to trigger the events even when onSelectReturn is null
          // as the events should be triggered even when setting the same value again
          this._triggerUpdateEvent(data, options, event);
          this._triggerValueUpdatedEvent(data, previousValue);
        }

        // no need to wait for _onSelect to be resolved for as the
        // setting the flag is response to the event and not setting the value.
        if (event && event.type === 'keydown') {
          // This flag will be used in "keyup" event handler to avoid
          // the re-process of the event.
          this.enterKeyEventHandled = true;
        }
      }
    },

    /**
     * Fetches the item for selection. For select, this will the item that is
     * currently highlighted, while for combobox, this will the item that is
     * highlighted through keyboard action.
     * @param {boolean} isKeyboardAction Flag to indicate if the selection is done by keyboard action
     * @returns {object|undefined} The item that needs to be selected
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @private
     */
    _getHighlightedForSelection: function (isKeyboardAction) {
      let highlighted;
      if (this._classNm === 'oj-select' || !isKeyboardAction) {
        // For mouse selection or oj-select-*,
        // fetch any item that is currently highlighted
        highlighted = this.results.find('.oj-hover');
      } else {
        // For keyboard, only fetch the highlighted item if it is highlighted
        // through the keyboard action
        highlighted = this.results.find('.oj-hover.oj-listbox-result-keyboard-focus');
      }
      return highlighted.closest('.oj-listbox-result').data(this._elemNm);
    },

    // _AbstractOjChoice
    _getPlaceholder: function () {
      return (
        this.opts.element.attr('placeholder') ||
        this.opts.element.attr('data-placeholder') || // jquery 1.4 compat
        this.opts.element.data('placeholder') ||
        this.opts.placeholder
      );
    },

    // _AbstractOjChoice
    _setPlaceholder: function () {
      var placeholder = this._getPlaceholder();

      // placeholder text of selectMany is in the <li> of this.selection
      if (this.ojContext.multiple && this._classNm === 'oj-select') {
        var defLi = this.selection.find('.oj-select-default');
        if (defLi.length > 0) {
          defLi.text(placeholder);
        } else {
          this._clearSearch();
        }
      } else if (!placeholder) {
        this.search.removeAttr('placeholder');
      } else {
        this.search.attr('placeholder', placeholder);
      }
    },

    // _AbstractOjChoice
    _initContainerWidth: function () {
      function resolveContainerWidth() {
        var style;
        var attrs;
        var matches;
        var i;
        var l;
        var attr;

        // check if there is inline style on the element that contains width
        style = this._getAttribute('style');
        if (style !== undefined && style !== null) {
          attrs = style.split(';');
          for (i = 0, l = attrs.length; i < l; i++) {
            attr = attrs[i].replace(/\s/g, '');
            matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
            if (matches !== null && matches.length >= 1) {
              return matches[1];
            }
          }
        }
        return null;
      }

      var width = resolveContainerWidth.call(this);
      if (width !== null) {
        this.container.css('width', width);
      }
    },

    //  - selected value got replaced once the label for initial value is available
    valHasChanged: function () {
      var container = this.container;

      if (_ComboUtils.duringFetchByKey(container)) {
        _ComboUtils.setValueChanged(this.ojContext, true);

        // Since the value is changed and we are currently fetching the key for the
        // label, the fetch will be discarded once it resolves.
        // So, clear the loading indicator here.
        if (!this.ojContext.multiple) {
          _ComboUtils.updateLoadingState(this, false);
        }
      }
    },

    // _AbstractOjChoice
    getVal: function () {
      return this.ojContext.option('value');
    },

    // _AbstractOjChoice
    getRawValue: function () {
      return this.ojContext.option('rawValue');
    },

    // _AbstractOjChoice
    // /pass original event
    /**
     * Sets the value
     * @instance
     * @ignore
     * @param {any} val The value to be set
     * @param {jQuery.Event=} event The event at which the method is invoked
     * @param {object} context Context
     * @return {Promise|boolean|null} Result of setting the value
     *                                * Promise when using async validators
     *                                * boolean when using sync validators / when setting the value without validators
     *                                * null when setValue is not invoked since there was no change in the value
     */
    setVal: function (val, event, context) {
      //  - selected value got replaced once the label for initial value is available
      this.valHasChanged();

      var options = { doValueChangeCheck: false };
      if (context) {
        options._context = context;
      }

      //  - need to be able to specify the initial value of select components bound to dprv
      var multiple = this.ojContext.multiple;
      if (!this._skipSetValueOptions) {
        //  - resetting value when value-option and placeholder are set throws exception
        if (_ComboUtils.isValueForPlaceholder(multiple, val) && this._getPlaceholder() !== null) {
          this.setValOpts(_ComboUtils.getFixupValueOptionsForPlaceholder(multiple));
        } else {
          var queryResult = _ComboUtils.getLastQueryResult(this);
          var match;

          if (queryResult) {
            if (multiple) {
              match = _ComboUtils.findOptions(queryResult, val);
            } else {
              match = _ComboUtils.findOption(queryResult, val);
            }
          }
          // set valueOption
          if (match) {
            // clone valueOption otherwise it will not trigger change event
            this.setValOpts(match);
          } else if (this._classNm === 'oj-combobox') {
            // new entry?
            this.ojContext._resolveValueOptionsLater =
              _ComboUtils.findOption(this.getValOpts(), val) != null;
          } else {
            this.ojContext._resolveValueOptionsLater = true;
          }
        }
      }

      // Fix  - CUSTOM MESSAGES ARE BEING CLEARED WHEN THE VALUE DOESN'T CHANGE
      // If the value has not changed, bypass the call to _SetValue method in EditableValue.
      // Because we don't have to set the value again in EditableValue.
      // Note:
      // 1. If there are component validation errors the value may not reflect the display value,
      // hence set value if the component has invalid messages even if the value has not changed.
      // 2. If there are custom error messages set via 'messagesCustom' attribute, the value will reflect
      // the display value and so no need to set value if the value has not changed.
      // 3. If the user is search filtering and re-selecting the same value in ojSingleCombobox (),
      // value won't be changed.  However the display value could be modified due to search operation.
      // So update the display value for ojSingleCombobox if the value has not changed.
      var previousVal = this.getVal();
      var setValueResult = null;
      if (!Array.isArray(val) && !this.ojContext._IsCustomElement()) {
        //  - select needs implementation fixes...
        // 1. _SetValue() compares the value passed in to the last saved display value. This is
        // from ADF and is useful for comparing display values for inputs but since combo sets an
        // array, this check is not needed.
        // 2. To bypass the check call this method when the value has changed and with the
        // additional parameter.
        if (
          !oj.Object.compareValues(previousVal, [val]) ||
          _ComboUtils.hasInvalidComponentMessages(this.ojContext)
        ) {
          setValueResult = this.ojContext._SetValue([val], event, options);
        } else if (this._classNm === 'oj-combobox' && !multiple) {
          this.ojContext._SetDisplayValue([val]);
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (
          !oj.Object.compareValues(previousVal, val) ||
          _ComboUtils.hasInvalidComponentMessages(this.ojContext)
        ) {
          //  - select needs implementation fixes...
          setValueResult = this.ojContext._SetValue(val, event, options);
        } else if (this._classNm === 'oj-combobox' && !multiple) {
          this.ojContext._SetDisplayValue(val);
        }
      }

      return setValueResult;
    },

    getValOpts: function () {
      var ojContext = this.ojContext;
      return ojContext.multiple ? ojContext.option('valueOptions') : ojContext.option('valueOption');
    },

    setValOpts: function (valOpts) {
      var ojContext = this.ojContext;
      var multiple = ojContext.multiple;
      var fixupValOpts = _ComboUtils.getFixupValueOptionsForPlaceholder(multiple);
      var oldValOpts = multiple ? ojContext.options.valueOptions : ojContext.options.valueOption;

      // dont fire option change event if the valueOption(s) already represents a placeholder
      if (
        _ComboUtils.isValueOptionsForPlaceholder(multiple, valOpts) &&
        _ComboUtils.isValueOptionsForPlaceholder(multiple, oldValOpts) &&
        _ComboUtils.isPlaceholderSpecified(ojContext.options)
      ) {
        if (multiple) {
          ojContext.options.valueOptions = fixupValOpts;
        } else {
          ojContext.options.valueOption = fixupValOpts;
        }
      } else if (!oj.Object.compareValues(valOpts, this.getValOpts())) {
        _ComboUtils.setValueOptions(ojContext, valOpts);
      }
      if (multiple) {
        this.opts.valueOptions = valOpts;
      } else {
        this.opts.valueOption = valOpts;
      }
    },

    // _AbstractOjChoice
    // eslint-disable-next-line no-unused-vars
    _triggerUpdateEvent: function (val, context, event) {
      // This method is overridden in OjInputSeachContainer to fire the
      // "update" event. As this event is relevant for only ojInputSearch,
      // there is no default implementation.
    },

    // _AbstractOjChoice
    // eslint-disable-next-line no-unused-vars
    _triggerValueUpdatedEvent: function (data, previousValue) {
      // This method is overridden in OjSingleCombobox to fire the
      // "ojValueUpdated" custom event. As this event is relevant for only oj-combobox-one,
      // there is no default implementation.
    },

    // _AbstractOjChoice
    // /ojselect placeholder
    _showPlaceholder: function () {
      return false;
    },

    // _AbstractOjChoice
    // select: accessibility
    _getActiveContainer: function () {
      return this.search;
    },

    // _AbstractOjChoice
    _getAttribute: function (id) {
      return this.opts.ojContext._IsCustomElement()
        ? this.opts.ojContext.OuterWrapper.getAttribute(id)
        : this.opts.element.attr(id);
    },

    /**
     * Retrieves the value of the attributed transferred by the framework.
     *
     * @param {string} id The attribute whose value has to be retrieved
     * @return {string?} The value of the attribute if specified
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @private
     */
    _getTransferredAttribute: function (id) {
      return this.opts.element.attr(id);
    },

    // _AbstractOjChoice
    _showSearchBox: function (searchText) {
      var focusOnSearchBox = false;
      var searchBox = this.dropdown.find('.oj-listbox-search');
      if (searchBox) {
        // hide and show the search box
        if (this._hasSearchBox()) {
          this.dropdown.find('.oj-listbox-search-wrapper').removeClass('oj-helper-hidden-accessible');

          $(searchBox).removeAttr('aria-hidden');
          this.search.val(searchText);
          focusOnSearchBox = true;
        } else {
          this.dropdown.find('.oj-listbox-search-wrapper').addClass('oj-helper-hidden-accessible');

          $(searchBox).attr('aria-hidden', 'true');
        }
      }

      // if search box is being displayed, focus on the search box otherwise focus on the select box
      _ComboUtils._focus(this, focusOnSearchBox ? this.search : this.selection);

      // /disable "click" on spyglass
      if (focusOnSearchBox) {
        var self = this;
        searchBox.find('.oj-listbox-spyglass-box').on('mouseup click', function (e) {
          self.search.focus();
          //  - select and combobox stop keyboard event propegation
          e.preventDefault();
        });
      }
    },

    // _AbstractOjChoice
    _hasSearchBox: function () {
      if (this._userTyping) {
        return true;
      }

      var threshold = this.opts.minimumResultsForSearch;
      var len;
      if (this.opts.list) {
        len = $('#' + this.opts.list).find('li').length;
      } else if (_ComboUtils.isDataProvider(this.opts.options)) {
        //  - search not shown before typing a character
        // When using dataProvider and the data is currently being fetched,
        // we will not know the result count. In this case, keep the search box
        // hidden for now. Set the flag _resolveSearchBoxLater here, so once the
        // data becomes available this evaluation will be done again.
        if (this.ojContext._resultCount === undefined) {
          // Setting this flag will inform the widget to call _showSearchBox()
          // once the data is fetched
          this.ojContext._resolveSearchBoxLater = true;
          // return false to indicate the search box should not be shown
          return false;
        }

        // If we do have the result count, then use that to evaluate whether the search box needs
        // to be shown. And also delete the flag set for resolving the search box later.
        len = this.ojContext._resultCount;
        delete this.ojContext._resolveSearchBoxLater;
      } else if (this.datalist) {
        if (this.ojContext._IsCustomElement()) {
          // get the count of oj-options
          len = this.datalist.children().find('oj-option').length;
        } else {
          // get the length from the select options
          len = this.datalist[0].length;
        }
      } else if (this.opts.options) {
        len = this.opts.options.length;
      }
      return len > threshold;
    },

    _hasHiddenSearchBox: function () {
      let searchBox = this.dropdown.find('.oj-listbox-search');
      return searchBox.attr('aria-hidden') === 'true';
    },

    // eslint-disable-next-line no-unused-vars
    _isDataSelected: function (data) {
      return false;
    },

    _findItem: function (list, value) {
      for (var i = 0; i < list.length; i++) {
        if ($(list[i]).data(this._elemNm).value === value) {
          return list[i];
        }
      }
      return null;
    },

    /**
     * Whenever _SetDisplayValue is called and if the component supports having converter
     * this method will be called to update the valueOptions if the converter is updated.
     * The components should override this method with their owwn implementations.
     *
     * @protected
     * @memberof! _AbstractOjChoice
     * @instance
     * @ignore
     */
    _UpdateValueOptionsWithConverter: function () {},

    /**
     * Syncs the display value with the rawValue.
     * This method should be overriden by the child classes to have their own implementation.
     *
     * @param {jQuery.Event=} event optional event object to be passed on to the
     *                              _SetRawValue method
     * @param {boolean=}   setDirty optional flag to set the dirty state in the
     *                              component (Defaults to false)
     *
     * @protected
     * @memberof! _AbstractOjChoice
     * @instance
     * @ignore
     */
    // eslint-disable-next-line no-unused-vars
    _SyncRawValue: function (event, setDirty) {},

    /**
     * Determines whether or not the dropdown should be opened/closed for the provided
     * event.
     * @param {jQuery.Event} event The event object
     * @returns {boolean} Whether the dropdown should be opened/closed
     *
     * @protected
     * @memberof! _AbstractOjChoice
     * @instance
     * @ignore
     */
    _ShouldToggleDropdown: function (event) {
      // Should open the dropdown only when the control is enabled and the
      // main mouse button is used.
      return this._isInterfaceEnabled() && event.button === 0;
    },

    /**
     * Determines whether to create a new entry.
     * @param {boolean} isKeyboardAction flag indicating is this is for a keyboard action
     * @returns flag indicating whether a new entry has to be created
     *
     * @memberof! _AbstractOjChoice
     * @instance
     * @protected
     */
    _ShouldCreateNewEntry: function (isKeyboardAction) {
      if (!this.opts.manageNewEntry) {
        // New entry not supported
        return false;
      }

      const selector = isKeyboardAction ? '.oj-hover.oj-listbox-result-keyboard-focus' : '.oj-hover';
      const selectedResult = this.results.find(selector);
      const newValue = this.search.val();
      // Create new entry if there is a new value and no result is highlighted using keyboard
      return newValue && selectedResult.length === 0;
    },

    /**
     * This method imitates an option selection from the dropdown by using a key of an item
     * from the options
     * This method is used in the ojSelectOne, ojComboboxOne, ojSelectMany, ojComboboxMany
     * WebElement APIs
     *
     * @param {V|Array<V>} value The key which will be used to select an item from the data provider
     *
     * @return {Promise<boolean>} A promise that resolves when the value is set.
     *
     * @private
     * @instance
     * @memberof! _AbstractOjChoice
     * @ignore
     */
    _selectItemByValue: function (value) {
      const options = this.ojContext.options;
      const selectionOptions = {
        trigger: _ComboUtils.ValueChangeTriggerTypes.ENTER_PRESSED
      };
      // Normalize the value to an Array
      const _value = _ComboUtils.getNormalizedValueArray(value);

      if (options.options) {
        // Clear the map only if we are going to set the value
        this._idsFromDropdown.clear();
        if (_ComboUtils.isDataProvider(options.options)) {
          return this._selectItemFromDataProvider(_value, selectionOptions);
        }
        return this._selectItemFromArray(_value, selectionOptions);
      } else if (this.isOjOption) {
        // Clear the map only if we are going to set the value
        this._idsFromDropdown.clear();
        return this._selectItemFromOjOptions(_value, selectionOptions);
      }

      return Promise.reject('Unsupported options');
    },

    /**
     * Selects a value from the data provider
     *
     * @param {Array<V>} values The value that has to be selected
     * @param {object} options Options for invoking selection
     *
     * @return {Promise<boolean>} A promise representing the status of the selection
     *
     * @private
     * @instance
     * @memberof! _AbstractOjChoice
     * @ignore
     */
    _selectItemFromDataProvider: function (values, options) {
      const dataProvider = _ComboUtils.getDataProvider(this.opts);
      let keys = new Set(values);

      let fetchByKeysPromise = dataProvider.fetchByKeys({ keys: keys });
      return fetchByKeysPromise.then(
        this._bind(function (fetchByKeysResult) {
          const results = fetchByKeysResult.results;
          let items = [];

          values.forEach(
            this._bind(function (value) {
              let itemResult;
              if (results.has(value)) {
                const item = results.get(value);
                const itemData = item.data;
                const itemMetadata = item.metadata;
                itemResult = _ComboUtils.createItemResult(itemData, itemMetadata);

                // Add the id to the map
                this._idsFromDropdown.add(value);
              } else {
                itemResult = this._getItemForCustomInput(value);
              }

              // Push the created item in the array if it is not null
              if (itemResult != null) items.push(itemResult);
            })
          );
          return this._InvokeSelection(items, options);
        })
      );
    },

    /**
     * Selects a value from the inline options
     *
     * @param {Array<V>} values The value that has to be selected
     * @param {object} options Options for invoking selection
     *
     * @return {Promise<boolean>} A promise representing the status of the selection
     *
     * @private
     * @instance
     * @memberof! _AbstractOjChoice
     * @ignore
     */
    _selectItemFromArray: function (values, options) {
      const optionsArray = this.ojContext.options.options;
      const optionsKeys = this.ojContext.options.optionsKeys || {};
      let foundItems = new Map();
      let items = [];

      if (!Array.isArray(optionsArray)) {
        return Promise.reject('Unsupported options');
      }

      for (let i = 0; i < optionsArray.length; i++) {
        const item = optionsArray[i];
        const value = _ComboUtils.lookupOptionKeys(item, optionsKeys, 'value');
        if (values.includes(value)) {
          foundItems.set(value, item);

          // prematurely break the loop if all values are found
          if (values.length === foundItems.size) {
            break;
          }
        }
      }

      // Fill in items in the same order as it appers in the value array
      values.forEach(
        this._bind(function (value) {
          let _item;
          if (foundItems.has(value)) {
            _item = foundItems.get(value);
            // Add the id to the map
            this._idsFromDropdown.add(value);
          } else {
            _item = this._getItemForCustomInput(value);
          }

          // Push the created item in the array if it is not null
          if (_item != null) {
            // Map using optionsKeys if specified
            if (optionsKeys.value != null) {
              _item.value = _item[optionsKeys.value];
            }
            if (optionsKeys.label != null) {
              _item.label = _item[optionsKeys.label];
            }
            items.push(_item);
          }
        })
      );

      return this._InvokeSelection(items, options);
    },

    /**
     * Selects a value from the inline options
     *
     * @param {Array<V>} values The value that has to be selected
     * @param {object} options Options for invoking selection
     *
     * @return {Promise<boolean>} A promise representing the status of the selection
     *
     * @private
     * @instance
     * @memberof! _AbstractOjChoice
     * @ignore
     */
    _selectItemFromOjOptions: function (values, options) {
      const $ojOptions = this.datalist.find('oj-option');
      let foundItems = new Map();
      let items = [];

      _ComboUtils.each2(
        $ojOptions,
        this._bind(function (index, ojOption) {
          const itemData = this._optionToData(ojOption);
          if (itemData && values.includes(this.id(itemData))) {
            foundItems.set(this.id(itemData), itemData);
          }
        })
      );

      // Fill in items in the same order as it appers in the value array
      values.forEach(
        this._bind(function (value) {
          let _item;
          if (foundItems.has(value)) {
            _item = foundItems.get(value);
            // Add the id to the map
            this._idsFromDropdown.add(value);
          } else {
            _item = this._getItemForCustomInput(value);
          }

          // Push the created item in the array if it is not null
          if (_item != null) items.push(_item);
        })
      );

      return this._InvokeSelection(items, options);
    },

    /**
     * Selects a custom value
     *
     * @param {V} value The value that has to be selected
     *
     * @return {object} A promise representing the status of the selection
     *
     * @private
     * @instance
     * @memberof! _AbstractOjChoice
     * @ignore
     */
    _getItemForCustomInput: function (value) {
      if (this.opts.manageNewEntry) {
        // The converter should only be applied for the user input.
        // This flag will be used in the overriden _parseValue method
        // in oj.Combobox and this will called synchronously for both sync and async validators
        // as the validation happens after the parsing.
        this.shouldApplyConverter = true;
        const newEntryItem = this.opts.manageNewEntry(value, true);
        delete this.shouldApplyConverter;
        return newEntryItem;
      }

      return null;
    },

    /**
     * Initiates selection with the provided value items
     * Child classes should override this method
     *
     * @param {Array<object>} items The item that has to be selected
     * @param {object} options Options for invoking selection
     *
     * @return {Promise<boolean>} A promise representing the status of the selection
     *
     * @protected
     * @instance
     * @memberof! _AbstractOjChoice
     * @ignore
     */
    // eslint-disable-next-line no-unused-vars
    _InvokeSelection: function (items, options) {},

    /**
     * This clears all the active timers that are currently
     * active
     *
     * @private
     * @instance
     * @memberof! _AbstractOjChoice
     * @ignore
     */
    _clearActiveTimers: function () {
      // Clear focus timer
      if (this._focusTimer) {
        this._focusTimer.clear();
        delete this._focusTimer;
      }

      // Clear loading indicator timers
      if (this._loadingIndicatorTimer) {
        this._loadingIndicatorTimer.clear();
        delete this._loadingIndicatorTimer;
      }
      if (this._dropdownLoadingIndicatorTimer) {
        this._dropdownLoadingIndicatorTimer.clear();
        delete this._dropdownLoadingIndicatorTimer;
      }

      // Clear existing query timer
      if (this._queryTimer) {
        this._queryTimer.clear();
        delete this._queryTimer;
      }
    }
  });

  /**
   * @private
   */
  const _AbstractMultiChoice = _ComboUtils.clazz(_AbstractOjChoice, {
    /**
     * Applies the readonly state for the component
     *
     * @override
     * @instance
     * @public
     * @memberof! _AbstractMultiChoice
     * @ignore
     */
    applyReadonlyState: function () {
      _AbstractMultiChoice.superclass.applyReadonlyState.apply(this, arguments);

      // We need to rerender the selected options to render the choices in readonly mode
      // apply the current valueOptions
      _ComboUtils.applyValueOptions(this, this.opts);
    },

    _prepareOpts: function () {
      var opts = _AbstractMultiChoice.superclass._prepareOpts.apply(this, arguments);
      var self = this;

      var tagName = opts.element.get(0).tagName.toLowerCase();
      if (
        (tagName === 'input' && opts.element.attr('list')) ||
        (tagName === 'select' && opts.element.children().length > 0) ||
        (opts.ojContext._IsCustomElement() && !opts.options) ||
        opts.list
      ) {
        var eleName = opts.list ? 'li' : 'option';

        if (opts.ojContext._IsCustomElement()) {
          eleName = 'oj-option';
        }

        // install the selection initializer
        opts.initSelection = function (element, callback) {
          var selected;
          var data = [];
          // clear the stored ids from dropdown
          self._idsFromDropdown.clear();
          if (self.getVal()) {
            var ids = self.getVal();
            for (var i = 0; i < ids.length; i++) {
              var id = ids[i];
              // eslint-disable-next-line no-loop-func
              selected = element.find(eleName).filter(function () {
                var elemValue;
                if (eleName === 'li') {
                  elemValue = this.getAttribute('oj-data-value');
                } else if (eleName === 'option' || eleName === 'oj-option') {
                  elemValue = this.value;
                }

                return oj.Object.compareValues(elemValue, id);
              });

              if (selected && selected.length) {
                let currentData = self._optionToData(selected);
                data.push(currentData);
                // the data is from options, so add it to the set
                self._idsFromDropdown.add(opts.id(currentData));
              } else if (self._elemNm === 'ojcombobox') {
                // If user entered value which is not listed in predefiend options
                // we need to format the label based on the value. We are not setting the
                // shouldApplyConverter flag here so, the value will not be parsed.
                data.push(opts.parseData({ value: id, label: id }));
              }
            }
          } else if (tagName !== 'select') {
            // don't do this for select since it returns the first option as selected by default
            selected = element.find(eleName).filter(function () {
              if (eleName === 'option') {
                return this.selected;
              } else if (eleName === 'li') {
                return this.getAttribute('oj-data-selected') === true;
              } else if (eleName === 'oj-option') {
                return this.getAttribute('selected') === true;
              }
              return false;
            });

            _ComboUtils.each2(selected, function (index, elm) {
              let currentData = self._optionToData(elm);
              data.push(currentData);
              // the data is from options, so add it to the set
              self._idsFromDropdown.add(opts.id(currentData));
            });
          }
          callback(data);
        };
      } else if ('options' in opts) {
        if (_ComboUtils.isDataProvider(opts.options) || $.isFunction(opts.options)) {
          // install default initSelection when applied to hidden input and data is remote
          opts.initSelection = function (element, callback) {
            var findOptions = function (results, optionValues) {
              var foundOptions = [];
              for (var i = 0, l = results.length; i < l; i++) {
                var result = results[i];
                var idx = optionValues.indexOf(opts.id(result));
                if (idx >= 0) {
                  foundOptions.push(result);
                }

                if (result.children) {
                  var childOptions = findOptions(result.children, optionValues);
                  if (childOptions && childOptions.length) {
                    $.merge(foundOptions, childOptions);
                  }
                }
              }

              return foundOptions;
            };

            var ids = self.getVal();
            // search in data by array of ids, storing matching items in a list
            var matches = [];
            // clear the stored ids from dropdown
            self._idsFromDropdown.clear();

            // This data will be saved after querying the options.
            var queryResult = _ComboUtils.getLastQueryResult(self);
            if (queryResult) {
              matches = findOptions(queryResult, ids);
            }

            var reorderOptions = function () {
              // Reorder matches based on the order they appear in the ids array because right now
              // they are in the order in which they appear in data array.
              // If not found in the current result, then will check in the saved current item.
              var ordered = [];
              for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var found = false;
                for (var j = 0; j < matches.length; j++) {
                  var match = matches[j];
                  if (oj.Object.compareValues(id, opts.id(match))) {
                    ordered.push(match);
                    // the data is from options, so add it to the set
                    self._idsFromDropdown.add(opts.id(match));
                    matches.splice(j, 1);
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  // currentItem will hold the selected object with value and label.
                  // Which updated everytime value is changed.
                  var currentItem = self.currentItem;
                  if (currentItem && currentItem.length) {
                    for (var k = 0; k < currentItem.length; k++) {
                      if (oj.Object.compareValues(id, opts.id(currentItem[k]))) {
                        ordered.push(currentItem[k]);
                        found = true;
                        break;
                      }
                    }
                  }

                  if (!found && self._elemNm === 'ojcombobox') {
                    // If user entered value which is not listed in predefiend options
                    // we need to format the label based on the value. We are not setting the
                    // shouldApplyConverter flag here so, the value will not be parsed.
                    ordered.push(opts.parseData({ value: id, label: id }));
                  }
                }
              }

              callback(ordered);
            };

            // valueChangeTrigger will have one of the values from
            // _ComboUtils._ValueChangeTriggerTypes, which represents the
            // what triggered the value change. But if value is programmatically
            // updated this will be null. So if valueChangeTrigger is null
            // querying for the options again as component will not have list
            // of options in case value is updated programmatically.
            if (!self.valueChangeTrigger) {
              // Show the loading indicator in the text field to show that the
              // label is being fetched.
              _ComboUtils.updateLoadingState(self, true);
              opts.query({
                value: ids,
                callback: function (qryResult) {
                  // if the instance is destroyed at this point, do nothing
                  if (!self.isInitialized) {
                    return;
                  }
                  // Clear the loading indicator now that the label is fetched
                  _ComboUtils.updateLoadingState(self, false);

                  if (qryResult && qryResult.results) {
                    var results = findOptions(qryResult.results, ids);
                    if (results && results.length) {
                      var concat = results;
                      if (_ComboUtils.isDataProvider(opts.options)) {
                        //  - While fetching the label for the initial value,
                        // user can still interact the component and pick a new value.
                        concat = [];
                        var vals = self.getVal();
                        if (
                          oj.Object.compareValues(ids, vals) &&
                          !_ComboUtils.isValueChanged(self.ojContext)
                        ) {
                          concat = results;
                        } else {
                          var v;
                          var found;
                          var valOpts = self.getValOpts();
                          // value has changed, concatenate results and value options
                          vals.forEach(function (val) {
                            found = false;
                            for (v = 0; v < valOpts.length; v++) {
                              if (oj.Object.compareValues(valOpts[v].value, val)) {
                                found = true;
                                concat.push(valOpts[v]);
                                break;
                              }
                            }
                            if (!found) {
                              for (v = 0; v < results.length; v++) {
                                if (oj.Object.compareValues(results[v].value, val)) {
                                  concat.push({
                                    value: results[v].value,
                                    label: results[v].label
                                  });
                                  break;
                                }
                              }
                            }
                          });
                          // update ids and valueOptions
                          ids = vals;
                          _ComboUtils.setValueOptions(self.ojContext, concat);
                        }
                      }
                      $.merge(matches, concat);
                    }
                  }
                  _ComboUtils.setValueChanged(self.ojContext, undefined);
                  reorderOptions();
                },
                cleanup: $.noop
              });
            } else {
              reorderOptions();
            }
          };
        } else {
          // install default initSelection when applied to hidden input and data is local
          opts.initSelection = function (element, callback) {
            var ids = self.getVal();

            if (!ids || ids.length === 0) {
              return;
            }

            // search in data by array of ids, storing matching items in a list
            var matches = [];
            // clear the stored ids from dropdown
            self._idsFromDropdown.clear();
            opts.query({
              matcher: function (term, text, el) {
                var isMatch = $.grep(ids, function (id) {
                  return oj.Object.compareValues(id, opts.id(el));
                }).length;
                if (isMatch) {
                  matches.push(el);
                }
                return isMatch;
              },
              callback: !$.isFunction(callback)
                ? $.noop
                : function () {
                    // if the instance is destroyed at this point, do nothing
                    if (!self.isInitialized) {
                      return;
                    }
                    // reorder matches based on the order they appear in the ids array because right now
                    // they are in the order in which they appear in data array
                    var ordered = [];
                    for (var i = 0; i < ids.length; i++) {
                      var id = ids[i];
                      var found = false;
                      for (var j = 0; j < matches.length; j++) {
                        var match = matches[j];
                        if (oj.Object.compareValues(id, opts.id(match))) {
                          ordered.push(match);
                          // the data is from options, so add it to the set
                          self._idsFromDropdown.add(opts.id(match));
                          matches.splice(j, 1);
                          found = true;
                          break;
                        }
                      }
                      if (!found && self._elemNm === 'ojcombobox') {
                        // If user entered value which is not listed in predefiend options
                        // we need to format the label based on the value. We are not setting the
                        // shouldApplyConverter flag here so, the value will not be parsed.
                        ordered.push(opts.parseData({ value: id, label: id }));
                      }
                    }
                    callback(ordered);
                  },
              cleanup: $.noop
            });
          };
        }
      }
      return opts;
    },

    _selectChoice: function (choice) {
      var selected = this.container.find('.' + this._classNm + '-selected-choice.oj-focus');
      var hasSelected = selected && selected.length > 0;
      var hasChoice = choice && choice.length > 0;
      // Condition 1: Nothing is selected and we need select an item (selected == null && choice == item1)
      // Condition 2: An item is selected and we need to unselect that item (selected == item1 && choice == null)
      // Condition 3: An item is selected and we need to select another item (selected == item1 && choice == item2)
      // Condition 4: An item is selected and we need to select same item (selected == item1 && choice == item1)
      // Make sure Condition 4 is no-op and we don't trigger choice-selected / choice-deselected event
      if (
        (!hasSelected && hasChoice) ||
        (hasSelected && !hasChoice) ||
        (hasSelected && hasChoice && choice[0] !== selected[0])
      ) {
        if (hasSelected) {
          this.opts.element.trigger('choice-deselected', selected);
          selected.removeClass('oj-focus');
        }
        if (hasChoice) {
          this.close();
          choice.addClass('oj-focus');
          this.container
            .find('.' + this._classNm + '-description')
            .text(choice.attr('valueText') + '. Press back space to delete.')
            .attr('aria-live', 'assertive');
          this.opts.element.trigger('choice-selected', choice);
        }
      }
    },

    _destroy: function () {
      $("label[for='" + this.search.attr('id') + "']").attr('for', this.opts.element.attr('id'));
      this.container.off('mousedown');
      _AbstractMultiChoice.superclass._destroy.apply(this, arguments);
    },

    _initContainer: function () {
      var selector = '.' + this._classNm + '-accessible-container';
      var contentWrapperSelector = '.oj-text-field-container';
      var idSuffix = _ComboUtils.nextUid();
      var elementLabel;
      var ariaLabel = this._getTransferredAttribute('aria-label');
      var ariaControls = this._getTransferredAttribute('aria-controls');

      this.searchContainer = this.container.find('.' + this._classNm + '-search-field');

      var selection = this.container.find(selector);
      this.selection = selection;

      var self = this;
      this.selection.on(
        'click',
        '.' + this._classNm + '-selected-choice:not(.' + this._classNm + '-locked)',
        function () {
          if (self._elemNm === 'ojcombobox') {
            self.search[0].focus();
          } // Fixed??
          self._selectChoice($(this));
        }
      );

      // only ojSelectMany triggers the selection blur event.
      if (this._elemNm === 'ojselect') {
        this.selection.on('blur', function () {
          self._selectChoice(null);
        });
      }

      this._contentElement = this._elemNm === 'ojcombobox' ? this.search : this.selection;

      // add aria associations
      selection.find('.' + this._classNm + '-input').attr('id', this._classNm + '-input-' + idSuffix);

      let resultId = this.results.attr('id');
      if (!resultId) {
        resultId = 'oj-listbox-results-' + idSuffix;
        this.results.attr('id', resultId);
      }

      if (!this.ojContext._IsCustomElement()) {
        elementLabel = $("label[for='" + this._getAttribute('id') + "']");
        if (!elementLabel.attr('id')) {
          elementLabel.attr('id', this._classNm + '-label-' + idSuffix);
        }
        this._contentElement.attr('aria-labelledby', elementLabel.attr('id'));
        this.opts.element.attr('aria-labelledby', elementLabel.attr('id'));
        if (this.search.attr('id')) {
          elementLabel.attr('for', this.search.attr('id'));
        }
      }

      if (ariaLabel) {
        this._contentElement.attr('aria-label', ariaLabel);
      }

      const contentElementAriaControls = ariaControls ? resultId + ' ' + ariaControls : resultId;
      this._contentElement.attr('aria-controls', contentElementAriaControls);

      if (this.elementTabIndex) {
        this._contentElement.attr('tabindex', this.elementTabIndex);
      }

      this.keydowns = 0;
      // Add keydown keyup handler on the select box for ojselect
      if (this._elemNm === 'ojselect') {
        this.selection.on('keydown', this._bind(this._containerKeydownHandler));
        this.selection.on(
          'keyup',
          this._bind(function () {
            this.keydowns = 0;
          })
        );
      }
      this.search.on('keydown', this._bind(this._containerKeydownHandler));

      this.search.on(
        'keyup',
        this._bind(function () {
          this.keydowns = 0;
        })
      );

      this.search.on(
        'compositionstart',
        this._bind(function () {
          // See _isComposing in InputBase for comments on what this does
          this.ojContext._isComposing = true;
        })
      );

      this.search.on(
        'compositionend',
        this._bind(function (e) {
          this.ojContext._isComposing = false;
          this._onSearchInputHandler(e);
        })
      );

      this.search.on(
        'input',
        this._bind(function (e) {
          // JET-39086 - raw-value is not getting updated until space in android devices
          // In android devices, typing in an English word will behave similar to what one
          // would see when they compose a CJK character in desktop devices. So, we need to
          // update the raw-value for all the input events in Android devices without considering
          // composition events so that the property gets updated for each english character and not
          // only for delimiters. In GBoard all the CJK keyboard layouts directly allow users
          // to input a CJK character, so we do not need to rely on composition events for that.
          // In Japanese keyboard, one of the three available layouts uses english chars
          // to compose a Japanese character in which case circumventing the logic would end up
          // updating the property with garbage values. But, it is highly unlikely for one to
          // use this layout as the other two layouts would allow users to directly type in Japanese
          // characters. So, for now we will not have to worry about composition events in
          // Android devices.
          if (!this.ojContext._isComposing || this._isAndroidDevice) {
            this._onSearchInputHandler(e);
          }
        })
      );

      this.search.on(
        'blur keyup',
        this._bind(function (e) {
          if (e.type === 'keyup' && e.keyCode !== 10 && e.keyCode !== 13) {
            return;
          }

          if (this._ShouldCreateNewEntry(e.type === 'keyup')) {
            // The converter should only be applied for the user input.
            // This flag will be used in the overriden _parseValue method
            // in oj.Combobox and this will called synchronously for both sync and async validators
            // as the validation happens after the parsing.
            this.shouldApplyConverter = true;

            // When creating new entry include the unparsed value as well as we will be sending
            // the unparsed value to EditableValue for it to do its thing.
            var data = this.opts.manageNewEntry(this.search.val(), true);

            var trigger =
              e.type === 'blur'
                ? _ComboUtils.ValueChangeTriggerTypes.BLUR
                : _ComboUtils.ValueChangeTriggerTypes.ENTER_PRESSED;
            var options = {
              trigger: trigger
            };

            var onSelectReturn = this._onSelect(data, options, e);

            // BUG JET-37212 - oj-combobox-many: input text is not cleared on blur
            // The clearing part was removed while fixing the bug JET-28569. But this part is
            // needed to clear the search box under certain cases like typing in a value that is already
            // present and then blurring out.
            if (onSelectReturn instanceof Promise) {
              // The issue JET-28569 which removed this part so as to not clear the text when using async-validator
              // so in that case, wait for the promise to resolve and then clear the text if needed.
              onSelectReturn.then(
                this._bind(function () {
                  delete this.shouldApplyConverter;
                  this._clearSearchOnBlur();
                })
              );
            } else {
              delete this.shouldApplyConverter;
              this._clearSearchOnBlur();
            }
          }

          this._selectChoice(null);

          if (e.type === 'blur') {
            // JET-35372 8.2.0: oj-combobox-many steals input focus when value/options are updated
            // reset the isSearchFocused flag on blur event
            this.isSearchFocused = false;

            // Clear up the focus classes on blur event
            this.search.removeClass(this._classNm + '-focused');
            this.container.removeClass('oj-focus');
          }

          e.stopImmediatePropagation();
        })
      );

      this.container.on('mousedown', contentWrapperSelector, this._bind(this._mouseDownHandler));

      this._initContainerWidth();
      this.opts.element.hide().attr('aria-hidden', true);

      // set the placeholder if necessary
      this._clearSearch();
    },

    /**
     * Handles mousedown event on the container
     *
     * @param {jQuery.Event} event Mouse event from clicking on the container
     * @private
     * @instance
     */
    _mouseDownHandler: function (event) {
      if (!this._ShouldToggleDropdown(event)) {
        return;
      }

      // if select box gets focus ring via keyboard event previously, clear it now
      this.selection.removeClass('oj-focus-highlight');
      this.container.removeClass('oj-focus-highlight');

      if ($(event.target).closest('.' + this._classNm + '-selected-choice').length > 0) {
        // clicked inside a selected choice, do not open
        return;
      }
      this._selectChoice(null);
      if (this._opened()) {
        this.close(event);
        // combobox loses focus when clicked on the container and not in the input
        // so set the focus again after closing the dropdown.
        // No need to do this for select, as the ul element is of the same size of the container.
        if (this._elemNm === 'ojcombobox') {
          this._focusSearch();
        }
      } else {
        this.open(event);
        if (this._elemNm === 'ojcombobox' || this._hasSearchBox()) {
          this._focusSearch();
        }
      }
    },

    /**
     * Handles input event and compositionend event for the search field
     * @param {jQuery.Event} event Input event triggered on the search field
     * @private
     */
    _onSearchInputHandler: function (event) {
      // When user types in something into the combobox, mark it dirty
      // and this will be used when deciding what should be used
      // for validation
      this._SyncRawValue(event, true);
    },

    _containerKeydownHandler: function (e) {
      if (!this._isInterfaceEnabled()) {
        return;
      }

      this.keydowns += 1;
      var selected = this.selection.find('.' + this._classNm + '-selected-choice.oj-focus');
      var prev = selected.prev(
        '.' + this._classNm + '-selected-choice:not(.' + this._classNm + '-locked)'
      );
      var next = selected.next(
        '.' + this._classNm + '-selected-choice:not(.' + this._classNm + '-locked)'
      );
      var pos =
        this._elemNm === 'ojselect' && !this._userTyping
          ? _ComboUtils.getCursorInfo(this.selection)
          : _ComboUtils.getCursorInfo(this.search);
      const keyCode = e.which || e.keyCode;

      if (
        selected.length &&
        (keyCode === _ComboUtils.KEY.LEFT ||
          keyCode === _ComboUtils.KEY.RIGHT ||
          keyCode === _ComboUtils.KEY.BACKSPACE ||
          keyCode === _ComboUtils.KEY.DELETE ||
          keyCode === _ComboUtils.KEY.ENTER)
      ) {
        var selectedChoice = selected;
        if (keyCode === _ComboUtils.KEY.LEFT && prev.length) {
          selectedChoice = prev;
        } else if (keyCode === _ComboUtils.KEY.RIGHT) {
          selectedChoice = next.length ? next : null;
        } else if (keyCode === _ComboUtils.KEY.BACKSPACE) {
          this._unselect(selected.first(), e);
          this._resetSearchWidth();
          selectedChoice = prev.length ? prev : next;
        } else if (keyCode === _ComboUtils.KEY.DELETE) {
          this._unselect(selected.first(), e);
          this._resetSearchWidth();
          selectedChoice = next.length ? next : null;
        } else if (keyCode === _ComboUtils.KEY.ENTER) {
          selectedChoice = null;
        }

        this._selectChoice(selectedChoice);
        e.preventDefault();
        if (!selectedChoice || !selectedChoice.length) {
          this.open(e);
        }
        return;
      } else if (
        this._isBackNavAllowed() &&
        pos.offset === 0 &&
        !pos.length &&
        ((keyCode === _ComboUtils.KEY.BACKSPACE && this.keydowns === 1) ||
          keyCode === _ComboUtils.KEY.LEFT)
      ) {
        this._selectChoice(
          this.selection
            .find('.' + this._classNm + '-selected-choice:not(.' + this._classNm + '-locked)')
            .last()
        );
        e.preventDefault();
        return;
      }

      this._selectChoice(null);

      if (_ComboUtils.KEY.isControl(e) || _ComboUtils.KEY.isFunctionKey(e)) {
        return;
      }

      switch (keyCode) {
        case _ComboUtils.KEY.UP:
        case _ComboUtils.KEY.DOWN:
          if (this._opened()) {
            this._moveHighlight(keyCode === _ComboUtils.KEY.UP ? -1 : 1);
          } else {
            this.open(e);
          }
          e.preventDefault();
          return;
        case _ComboUtils.KEY.PAGE_UP:
        case _ComboUtils.KEY.PAGE_DOWN:
          // prevent the page from scrolling
          e.preventDefault();
          return;
        case _ComboUtils.KEY.ENTER:
          if (this._opened()) {
            this._selectHighlighted(null, e, true);
            // Fix :  PRESSING 'ENTER' WITHIN DROPDOWN SHOULD NOT PROPAGATE
            e.stopPropagation();
          }
          // prevent form from being submitted
          e.preventDefault();
          return;
        case _ComboUtils.KEY.TAB:
          this.close(e);
          return;
        case _ComboUtils.KEY.ESC:
          this._cancel(e);
          e.preventDefault();
          return;
        default:
          break;
      }

      // ojselect: used by select
      this._userTyping = true;
    },

    _isBackNavAllowed: function () {
      // For ojSelectMany: Backspace / Left navigation is not allowed if the search is focused
      if (this._elemNm === 'ojselect') {
        return document.activeElement !== this.search[0];
      }
      return true;
    },

    _enableInterface: function () {
      if (_AbstractMultiChoice.superclass._enableInterface.apply(this, arguments)) {
        this.search.prop(
          'disabled',
          !(this._isInterfaceEnabled() || _ComboUtils.isReadonly(this.ojContext))
        );
      }
    },

    _initSelection: function (valueOptions) {
      var vv = this.getVal();
      if (
        (vv === null || vv.length === 0) &&
        (this._classNm === 'oj-select' || this.opts.element.text().trim() === '')
      ) {
        this._updateSelection(valueOptions || []);
        this.close();
        // set the placeholder if necessary
        this._clearSearch();
      }
      if (this.datalist || (this.getVal() !== null && this.getVal().length)) {
        var self = this;
        var element;

        if (this.datalist) {
          element = this.datalist;
        } else {
          element = this.opts.element;
        }

        //  - need to be able to specify the initial value of select components bound to dprv
        if (!_ComboUtils.applyValueOptions(this, this.opts)) {
          this.opts.initSelection.call(null, element, function (data) {
            if (data !== undefined && data !== null && data.length !== 0) {
              self._updateSelection(data);
              self.close();
              // set the placeholder if necessary
              self._clearSearch();
            }
          });
        }
      }
    },

    _focus: function () {
      this.close();
      this.search.focus();
    },

    _updateSelection: function (data) {
      var ids = [];
      var filtered = [];
      var self = this;
      var lastChoiceIndex;

      // filter out duplicates
      $(data).each(function () {
        if (ids.indexOf(self.id(this)) < 0) {
          ids.push(self.id(this));
          filtered.push(this);
        }
      });

      if (
        filtered &&
        filtered.length > 0 &&
        (this._classNm === 'oj-combobox' || this._classNm === 'oj-select')
      ) {
        // JET-35213 - reset issue in required oj-select-many
        // When calling reset method, the valueOptions might not have been set (like when click on an option,
        // where valueOptions will be set before updating selection). In such scenarios, where the valueOptions
        // are not updated the filtered data from the data provider should be set as valueOptions instead of populating
        // from the current valueOptions even if it is not an initial fetch
        if (this.opts.fetchType === 'init' || !this._skipSetValueOptions) {
          // for initial fetch, the filtered data will include data/metadata information when bound to a data provider
          this.setValOpts(filtered);
        } else if (_ComboUtils.isDataProvider(this.opts.options)) {
          // for non-initial fetch from data provider, populate data/metadata from valueOptions for the selected ids
          filtered = _ComboUtils.findOptions(this.opts.valueOptions, ids);
        }
      }

      this.selection.find('.' + this._classNm + '-selected-choice').remove();
      this.selection.find('.oj-select-default').remove();
      this._updateAriaDescribedBy(null, true);

      lastChoiceIndex = filtered.length - 1;

      $(filtered).each(function (index, item) {
        var isLastChoice = index === lastChoiceIndex;
        self._addSelectedChoice(item, isLastChoice);
      });

      // Storing this data so that it will be used when setting the display value.
      this.currentItem = filtered;
      this.currentValue = ids;

      self._postprocessResults();
    },

    /**
     * Updates the aria-describedby attribute on the content element
     * @param {string=} idToAdd The id of the DOM element that has to be added here
     * @param {boolean=} shouldRemoveExisting a flag to indicate if existsing ids should be removed
     *
     * @memberof! _AbstractMultiChoice
     * @instance
     * @private
     */
    _updateAriaDescribedBy: function (idToAdd, shouldRemoveExisting) {
      var $contentElement = this._contentElement;
      var $selectionElement = this.selection;
      var currentAriaDescribedbyIds = $contentElement.attr('aria-describedby') || '';
      var shouldUpdateAttribute = false;
      var updatedAriaDescribedbyIds = currentAriaDescribedbyIds;

      // Remove first and then add
      if (shouldRemoveExisting) {
        // remove only the ids that are added by selectcombobox
        this._ariaDescribedByAdded.forEach(function (id) {
          updatedAriaDescribedbyIds = updatedAriaDescribedbyIds.replace(id, '');
          shouldUpdateAttribute = true;
        });
        // trim the ids to remove leading and trailing space and remove any extra spaces
        updatedAriaDescribedbyIds = updatedAriaDescribedbyIds.trim().replace(/\s\s+/g, ' ');
        this._ariaDescribedByAdded = [];
      }

      // Add ids after removing
      if (idToAdd) {
        updatedAriaDescribedbyIds = (updatedAriaDescribedbyIds + ' ' + idToAdd).trim();
        this._ariaDescribedByAdded.push(idToAdd);
        shouldUpdateAttribute = true;
      }

      // Only update the attribute on the DOM if it is modified
      if (shouldUpdateAttribute) {
        $contentElement.attr('aria-describedby', updatedAriaDescribedbyIds);

        // for combobox we need to update it on the ul as well as input element
        if (this._classNm === 'oj-combobox') {
          $selectionElement.attr('aria-describedby', updatedAriaDescribedbyIds);
        }
      }
    },

    // AbstractMultiChoice
    /**
     * Handles when a selection is made by the user
     *
     * @param {object} data A valueOption object for the currect selection
     * @param {object} options Options for _onSelect method on how to handle the event
     * @param {jQuery.Event=} event The event at which the method is invoked
     * @return {Promise|boolean|null} Result of setting the value
     *                                * Promise when using async validators
     *                                * boolean when using sync validators / when setting the value without validators
     *                                * null when setValue is not invoked since there was no change in the value
     *
     * @memberof! _AbstractMultiChoice
     * @instance
     * @private
     */
    _onSelect: function (data, options, event) {
      if (!this._triggerSelect(data)) {
        return false;
      }

      var context;
      if (options && options.trigger) {
        context = {
          optionMetadata: {
            trigger: options.trigger
          }
        };
      }

      // selection will be added when _SetValue is called
      // this._addSelectedChoice(data);
      // Clone the value before invoking setVal(), otherwise it will not trigger change event.
      var val = this.getVal() ? this.getVal().slice(0) : [];
      // Initial Value options
      var valOptsInit = this.getValOpts() ? this.getValOpts().slice(0) : [];
      var valOpts = valOptsInit.slice(0);
      var isSelectCombobox = this._classNm === 'oj-combobox' || this._classNm === 'oj-select';

      // If the component is invalid, we will not get all the values matching the displayed value
      if (!this.ojContext.isValid()) {
        val = this.currentValue.slice(0);
        valOpts = this.currentItem.slice(0);
        // In this case, we might have some unparsed invalid values, so we need to force check and
        // apply the converter
        this.forceApplyConverter = true;
      }

      var self = this;
      var parsedData;
      var unparsedData;
      var id;
      var parsedId;
      var valOpt;
      var valueOptionFromResult;
      var valKeySet;
      var valueOptionsData = [];
      var valueOptionsMetadata = [];
      var opts = _ComboUtils.getOpts(this.ojContext);
      var isDataProvider = opts ? _ComboUtils.isDataProvider(opts.options) : false;
      var setValueReturn = null;
      var returnValue = null;
      var previousHasUncommittedValue = this.hasUncommittedValue;

      if (isDataProvider) {
        // populate data/metadata for existing selections
        for (var i = 0; i < valOpts.length; i++) {
          valOpt = valOpts[i];
          id = this.id(valOpt);
          valOpts[i] = _ComboUtils.findOptionFromResult(self, id, valOpt);
          valueOptionsData.push(valOpts[i].data);
          valueOptionsMetadata.push(valOpts[i].metadata);
        }
      }

      unparsedData = this.sanitizeData(data, true);
      parsedData = this.sanitizeData(data);
      id = this.id(unparsedData);
      parsedId = this.id(parsedData);

      // Create a keyset of the selected values (use dp's implementation if one is provided)
      valKeySet = _ComboUtils.getDataProviderKeySet(this.ojContext, val);
      // Only add the value if it not already present in the key set and the id is not an empty string
      // which it will be when a placeholder is selected for select-many
      if (!valKeySet.has(parsedId) && id !== '') {
        // push the unparsed id as we want it to go through EditableValue's parseValue-SetValue chain
        // which will handle parse failure messages.
        val.push(id);
        if (isSelectCombobox) {
          //  - oj.tests.input.combobox.testcombobox display value mismatch automation failure
          valueOptionFromResult = _ComboUtils.findOptionFromResult(self, parsedId, parsedData);
          valOpts.push(valueOptionFromResult);

          // if converter is not set to be applied or if the user inputted value is matched with
          // one of provided options, add the id to the set.
          if (!this.shouldApplyConverter || parsedData !== valueOptionFromResult) {
            this._idsFromDropdown.add(parsedId);
          }

          if (isDataProvider) {
            // populate data/metadata for new selections
            valueOptionsData.push(valueOptionFromResult.data);
            valueOptionsMetadata.push(valueOptionFromResult.metadata);
          }
        }
      }

      // setValueOptions before setVal so that new entry already in valueOptions
      // this is to avoid looking for new entry on the dataProvider
      if (isSelectCombobox) {
        this._skipSetValueOptions = true;
        this.setValOpts(valOpts);
      }

      // set the valueOptions data and metadata in the context
      context = _ComboUtils.getContextWithExtraData(
        context,
        opts,
        valueOptionsData,
        valueOptionsMetadata
      );
      // Fix , 
      // For combobox, we are using the flag hasUncommittedValue to decide on whether
      // the label or the value would take part in validation.
      // So, when a selection is made, this flag has to be cleared before setting the value.
      this.hasUncommittedValue = false;
      // setVal method returns a promise that resolves to true|false or a boolean
      setValueReturn = this.setVal(val, event, context);

      if (setValueReturn instanceof Promise) {
        returnValue = setValueReturn.then(
          this._bind(function (result) {
            this._afterOnSelectSetVal(result, data, valOptsInit, previousHasUncommittedValue);
            // return the result of the validation, which can use by methods
            // that rely on the result of _onSelect call.
            return result;
          })
        );
      } else {
        // Sanitize the setValueReturn to be boolean.
        // we can treat null as a passed case, since it represents that
        // the value is already one of the selected values and a valid one.
        var result = setValueReturn !== false;
        this._afterOnSelectSetVal(result, data, valOptsInit, previousHasUncommittedValue);
        returnValue = setValueReturn;
      }

      // need not to wait for the validation to complete as the following
      // operations are a response to the event and not for setting the value.
      if (this.opts.closeOnSelect) {
        this.close(event);
      }
      // When clicking outside the combobox (including clicking on other components) triggers a blur event
      // Should not focus the search when the trigger is a blur event.
      if (
        (!options || options.trigger !== _ComboUtils.ValueChangeTriggerTypes.BLUR) &&
        this._elemNm === 'ojcombobox'
      ) {
        this._focusSearch();
      }

      return returnValue;
    },

    /**
     * Performs operations that has to be done after the setVal call in _onSelect
     *
     * @param {boolean} result The result of the setVal call
     * @param {object} data A valueOption object for the currect selection
     * @param {object} valOptsInit The initial valueOptions
     * @param {boolean} previousHasUncommittedValue The initial hasCommittedValue flag value
     *
     * @memberof! _AbstractMultiChoice
     * @instance
     * @private
     */
    _afterOnSelectSetVal: function (result, data, valOptsInit, previousHasUncommittedValue) {
      var isSelectCombobox = this._classNm === 'oj-combobox' || this._classNm === 'oj-select';
      // If the validation fails, set the hasUncommittedValue flag so as to revert it back to its
      // original state
      if (result === false) {
        // The validation failed, so reset the flag
        this.hasUncommittedValue = previousHasUncommittedValue;
        // : component oj-combobox-many displays the list of the values - does not exclude the invalid values
        // Since the validation failed, restore to the initial valueOptions
        if (isSelectCombobox) {
          this.setValOpts(valOptsInit);
        }
      }
      this._skipSetValueOptions = false;

      delete this.forceApplyConverter;

      if (this.select || !this.opts.closeOnSelect) {
        this._postprocessResults(data, false, this.opts.closeOnSelect === true);
      }

      if (this.opts.closeOnSelect) {
        // do not reset search width if the input text is invalid
        // this will allow users to correct any invalid input text
        if (this.ojContext.isValid()) {
          this._resetSearchWidth();
        }
      }
    },

    _cancel: function (event) {
      this.close(event);
      if (this._elemNm === 'ojcombobox') {
        this._focusSearch();
      }
    },

    /**
     * Creates a choice element based on the state of the component
     *
     * @param {boolean} isEnabled Flag to indicate the selected choice is enabled
     * @param {boolean} isReadOnly Flag to indicate the selected choice is readonly
     * @param {boolean} isLastChoice Flag to indicate the selected choice is the last choice
     *
     * @return {jQuery.Element} the created jQuery element
     *
     * @instance
     * @private
     * @memberof! _AbstractMultiChoice
     */
    _createChoice: function (isEnabled, isReadOnly, isLastChoice) {
      var $choice;

      if (!isEnabled) {
        $choice = $(
          "<li class='" +
            this._classNm +
            '-selected-choice ' +
            this._classNm +
            "-locked'>" +
            '<div></div>' +
            '</li>'
        );
      } else if (isReadOnly) {
        $choice = $("<li class='" + this._classNm + "-selected-choice'>    <div></div></li>");
        // if it is not the last choice, add the separator span
        if (!isLastChoice) {
          var separator = Translation.getTranslatedString('oj-converter.plural-separator');
          var separatorSpan = $(
            "<span class='" + this._classNm + "-selected-choice-separator'></span>"
          );
          // Since the translation comes from an external source, use jQuery.text to add the
          // content instead of adding it during the creation.
          separatorSpan.text(separator);
          $choice.append(separatorSpan); // @HTMLUpdateOK
        }
      } else {
        $choice = $(
          "<li class='" +
            this._classNm +
            "-selected-choice'>" +
            '    <div></div>' +
            "    <span role='button' aria-label='remove' class='" +
            this._classNm +
            '-clear-entry ' +
            '      oj-component-icon oj-default oj-clickable-icon-nocontext ' +
            this._classNm +
            "-clear-entry-icon' tabindex='-1'>" +
            '    </span>' +
            '</li>'
        );
      }

      return $choice;
    },

    _addSelectedChoice: function (data, isLastChoice) {
      var enableChoice = !data.locked;
      var isReadOnly = this.ojContext.options.readOnly;
      var choice = this._createChoice(enableChoice, isReadOnly, isLastChoice);
      var formatted;

      formatted = _ComboUtils.getLabel(data);
      if (formatted !== undefined) {
        // set the text and id for the label
        var selectedLabelId = this._classNm + '-selected-choice-label-' + _ComboUtils.nextUid();
        choice
          .find('div')
          .addClass(this._classNm + '-selected-choice-label')
          .text(formatted)
          .attr('id', selectedLabelId);
        choice.find('.' + this._classNm + '-clear-entry').attr('aria-label', formatted + ' remove');
        choice.attr('valueText', formatted);
        // add aria-labelledby to the choice node to point to the div
        // This is to make sure, the screen reader reads only the label and not the remove button
        choice.attr('aria-labelledby', selectedLabelId);

        this._updateAriaDescribedBy(selectedLabelId, false);
      }
      if (enableChoice && !isReadOnly) {
        choice
          .find('.' + this._classNm + '-clear-entry')
          .on('mousedown', _ComboUtils.killEvent)
          .on(
            'click dblclick',
            this._bind(function (e) {
              if (!this._isInterfaceEnabled()) {
                return;
              }

              var resolveBusyState = _ComboUtils._addBusyState(
                this.container,
                'unselecting ' + formatted
              );
              $(e.target)
                .closest('.' + this._classNm + '-selected-choice')
                .fadeOut(
                  'fast',
                  this._bind(function () {
                    this._unselect($(e.target), e);
                    this.selection
                      .find('.' + this._classNm + '-selected-choice.oj-focus')
                      .removeClass('oj-focus');
                    this.close(e);
                    if (this._elemNm === 'ojcombobox') {
                      this._focusSearch();
                    } else if (this._elemNm === 'ojselect') {
                      this._getActiveContainer().focus();
                    }
                    resolveBusyState();
                  })
                )
                .dequeue();
              _ComboUtils.killEvent(e);
              // stop the propagation, so focus effect is not added to the choice
              e.stopPropagation();
            })
          );
      }
      choice.data(this._elemNm, data);

      // searchContainer is initialized in _initContainer() method.
      // And this can not be changed by an external developer. It is constructed by component only.
      if (this._elemNm === 'ojcombobox') {
        choice.insertBefore(this.searchContainer); // @HTMLUpdateOK
      } else {
        // oj-select-many has to append the items to the ul element inside selection
        this.selection.find('.oj-select-choices').append(choice); // @HTMLUpdateOK
      }
    },

    // keep valueOptions in sync with value
    _syncValueOptions: function (ojContext, value, valueOptions) {
      var newValOpts = [];
      var valueOptionsData = [];
      var valueOptionsMetadata = [];
      var opts = _ComboUtils.getOpts(this.ojContext);
      var isDataProvider = opts ? _ComboUtils.isDataProvider(opts.options) : false;
      var id;
      if (value && valueOptions) {
        for (var i = 0; i < value.length; i++) {
          for (var j = 0; j < valueOptions.length; j++) {
            var newOpt = valueOptions[j];
            if (oj.Object.compareValues(newOpt.value, value[i])) {
              if (isDataProvider) {
                id = this.id(newOpt);
                newOpt = _ComboUtils.findOptionFromResult(this, id, newOpt);

                // populate data/metadata for the current selections
                valueOptionsData.push(newOpt.data);
                valueOptionsMetadata.push(newOpt.metadata);
              }
              newValOpts.push(newOpt);
            }
          }
        }
        _ComboUtils.setValueOptions(ojContext, newValOpts);
        // set the new valueOptions in the current item
        this.currentItem = newValOpts;
      }
      // get the context with data/metadata info for data provider
      return _ComboUtils.getContextWithExtraData(null, opts, valueOptionsData, valueOptionsMetadata);
    },

    _unselect: function (oselected, event) {
      var val = (this.getVal() || []).slice(0);
      var valOptsInit = (this.getValOpts() || []).slice(0);
      var selected = oselected.closest('.' + this._classNm + '-selected-choice');

      if (selected.length === 0) {
        // TODO: translation string
        throw new Error(
          'Invalid argument: ' + selected + '. Must be .' + this._classNm + '-selected-choice'
        );
      }

      var data = selected.data(this._elemNm);
      if (!data) {
        // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
        // and invoked on an element already removed
        return;
      }

      var valOpts;
      // If the component is invalid, we will not get all the values matching the displayed value
      if (!this.ojContext.isValid()) {
        val = this.currentValue.slice(0);
        valOpts = this.currentItem.slice(0);
        // In this case, we might have some unparsed invalid values, so we need to force check and
        // apply the converter
        this.forceApplyConverter = true;
      } else {
        valOpts = (this.getValOpts() || []).slice(0);
      }

      var context;
      var setValueReturn;
      var index = val.indexOf(this.id(data));

      if (index !== -1) {
        val.splice(index, 1);
        this._idsFromDropdown.delete(this.id(data));
        context = this._syncValueOptions(this.ojContext, val, valOpts);
        this._skipSetValueOptions = true;
        setValueReturn = this.setVal(val, event, context);

        if (setValueReturn instanceof Promise) {
          setValueReturn.then(
            this._bind(function (result) {
              this._afterUnselectSetValue(result, selected, valOptsInit);
            })
          );
        } else {
          this._afterUnselectSetValue(setValueReturn, selected, valOptsInit);
        }
      }
    },

    /**
     * Performs operations that has to be done after setting the value in _unselect method
     *
     * @param {boolean} result The result of setVal call
     * @param {HTMLElement} selected The current selected element that has to be removed
     * @param {Array<object>|null} valOptsInit The initial valueOptions to revert to if validation fails
     *
     * @memberof! _AbstractMultiChoice
     * @instance
     * @private
     */
    _afterUnselectSetValue: function (result, selected, valOptsInit) {
      var isSelectCombobox = this._classNm === 'oj-combobox' || this._classNm === 'oj-select';

      if (isSelectCombobox && result === false) {
        // If the validation fails, restore to initial value options
        this.setValOpts(valOptsInit);
      }

      this._skipSetValueOptions = false;
      delete this.forceApplyConverter;

      if (result !== false && this.select) {
        this._postprocessResults();
      }
      // The selected option should be removed irrespective of the setVal result
      selected.remove();
    },

    // eslint-disable-next-line no-unused-vars
    _postprocessResults: function (data, initial, noHighlightUpdate) {
      // display all available options in the drop down if the component is in invaid state
      if (!this.ojContext.isValid()) {
        return;
      }
      var val = this.getVal();
      var choices = this.results.find('.oj-listbox-result');
      var compound = this.results.find('.oj-listbox-result-with-children');
      var self = this;

      _ComboUtils.each2(choices, function (i, choice) {
        var id = self.id(choice.data(self._elemNm));
        if (val && val.indexOf(id) >= 0) {
          choice.addClass('oj-selected');
          // mark all children of the selected parent as selected
          choice.find('.oj-listbox-result-selectable').addClass('oj-selected');
        }
      });
      _ComboUtils.each2(compound, function (i, choice) {
        // hide an optgroup if it doesnt have any selectable children
        if (
          !choice.is('.oj-listbox-result-selectable') &&
          choice.find('.oj-listbox-result-selectable:not(.oj-selected)').length === 0
        ) {
          choice.addClass('oj-selected');
        }
      });
      //  - grouping header accessibility issue for jaws
      this._processAriaLabelForHierarchy();

      if (
        !choices.filter('.oj-listbox-result:not(.oj-selected)').length > 0 &&
        this._classNm !== 'oj-select'
      ) {
        this.close(null, true);
      }
    },

    _isDataSelected: function (data) {
      var val = this.getVal();

      if (!val || val.length === 0) {
        return false;
      }

      var results = data.results;
      for (var i = 0; i < results.length; i++) {
        if (val.indexOf(this.id(results[i])) === -1) {
          return false;
        }
      }

      return true;
    },

    _resetSearchWidth: function () {
      // do nothing. subclass override
    },

    /**
     * Sets the value
     *
     * @param {Array<any>} val The value to be set
     * @param {jQuery.Event=} event The event at which the method is invoked
     * @param {object} context Context
     * @return {Promise|boolean|null} Result of setting the value
     *                                * Promise when using async validators
     *                                * boolean when using sync validators / when setting the value without validators
     *                                * null when setValue is not invoked since there was no change in the value
     *
     * @memberof! _AbstractMultiChoice
     * @instance
     * @override
     * @ignore
     */
    setVal: function (val, event, context) {
      var unique = [];
      var vals = val;

      //  - selected value got replaced once the label for initial value is available
      this.valHasChanged();

      if (typeof val === 'string') {
        vals = _ComboUtils.splitVal(val, this.opts.separator);
      }

      // filter out duplicates
      for (var i = 0; i < vals.length; i++) {
        if (unique.indexOf(vals[i]) < 0) {
          unique.push(vals[i]);
        }
      }

      var options = {
        doValueChangeCheck: false
      };
      if (context) {
        options._context = context;
      }

      //  - need to be able to specify the initial value of select components bound to dprv
      // set valueOption
      if (!this._skipSetValueOptions) {
        var queryResult = _ComboUtils.getLastQueryResult(this);
        var match;
        if (queryResult) {
          match = _ComboUtils.findOptions(queryResult, vals);
        }
        if (match && match.length) {
          _ComboUtils.setValueOptions(this.ojContext, match);
        }
      }

      // Fix  - CUSTOM MESSAGES ARE BEING CLEARED WHEN THE VALUE DOESN'T CHANGE
      // If the value has not changed, bypass the call to _SetValue method in EditableValue.
      // Because we don't have to set the same value again in EditableValue.
      // Note: If there are component validation errors the value may not reflect the display value,
      // hence set value if the component has invalid messages even if the value has not changed.
      // If there are custom error messages set via 'messagesCustom' attribute, the value will reflect
      // the display value and so no need to set value if the value has not changed.
      var previousVal = this.getVal();
      var setValueResult = null;
      if (
        !oj.Object.compareValues(previousVal, unique) ||
        _ComboUtils.hasInvalidComponentMessages(this.ojContext)
      ) {
        setValueResult = this.ojContext._SetValue(unique, event, options);
      }

      if (setValueResult instanceof Promise) {
        return setValueResult.then(
          // eslint-disable-next-line no-unused-vars
          this._bind(function (result) {
            this._afterSetValue(unique);
          })
        );
      }

      // Call afterSetValue unconditionally if setValue is executed synchronously
      // as this method has parts of code that needs to be executed for both when
      // validation passes or when it fails. The checks are done in the method
      // so it is okay to call this function unconditionally here.
      this._afterSetValue(unique);
      return setValueResult;
    },

    /**
     * Executes the operations that has to be done after the _SetValue call
     *
     * @param {Array} unique The array of unique set of values that was set in the _SetValue call
     *
     * @memberof! _AbstractMultiChoice
     * @instance
     * @private
     */
    _afterSetValue: function (unique) {
      if (this.ojContext.isValid() || unique.length === 0) {
        this.currentValue = unique;
      }
      this.search.attr('aria-activedescendant', this.opts.element.attr('id'));
    },

    /**
     * Returns the selection data
     * @instance
     * @private
     * @ignore
     * @return {Array|null}
     */
    _getSelectionData: function () {
      var dataArr = null;
      var self = this;
      var data = null;
      var choices = this.container.find('.' + this._classNm + '-selected-choice');
      if (choices) {
        dataArr = [];
        choices.each(function () {
          data = $(this).data(self._elemNm);
          if (data != null) {
            dataArr.push(data);
          }
        });
      }
      return dataArr;
    },

    /**
     * Handles clearing the search when the user blurs out from the search
     * @instance
     * @private
     * @ignore
     */
    _clearSearchOnBlur: function () {
      // : component oj-combobox-many displays validation error message even when no value is entered in the component
      // do not clear search if the input text is invalid
      // this will allow users to correct any invalid input text
      if (!this._opened() && this._classNm !== 'oj-select' && this.ojContext.isValid()) {
        this._clearSearch();
      }
    },

    /**
     * Returns the components wrapper under which label needs to be inserted in the inside strategy
     * @instance
     * @protected
     * @ignore
     * @return {Element|undefined}
     */
    _GetContentWrapper: function () {
      return this.container[0].querySelector('.oj-text-field-container');
    },

    /**
     * Initiates selection with the provided item
     *
     * @param {Array<object>} items The item that has to be selected
     * @param {object} options Options for invoking selection
     *
     * @return {Promise<boolean>} A promise representing the status of the selection
     *
     * @protected
     * @instance
     * @memberof! _AbstractMultiChoice
     * @override
     * @ignore
     */
    _InvokeSelection: function (items, options) {
      const opts = _ComboUtils.getOpts(this.ojContext);
      const isDataProvider = opts ? _ComboUtils.isDataProvider(opts.options) : false;

      const values = [];
      const valueOptions = [];
      const valueOptionsData = [];
      const valueOptionsMetadata = [];

      // Iterate through the items and generate value and valueOptions
      items.forEach(
        function (item) {
          values.push(this.id(item));

          var newValueOption = {
            label: item.label,
            value: this.id(item)
          };

          // populate data and metadata only when using a data provider
          if (isDataProvider) {
            // JET-57010 - oj-select-many valueOptionsChanged event does not contain data
            // and metadata
            // include the data and metadata from the data provider in the item itself so that they
            // will be included in the valueOptionsChanged event that gets fired, similar to what
            // would happen if the user selected an item from the dropdown
            newValueOption.data = item.data;
            newValueOption.metadata = item.metadata;
            valueOptionsData.push(item.data);
            valueOptionsMetadata.push(item.metadata);
          }

          // valueOptions is similar to value, but each item in the array is an object containing
          // the value and label for that item
          valueOptions.push(newValueOption);
        }.bind(this)
      );

      let context = { optionMetadata: { trigger: options.trigger } };
      context = _ComboUtils.getContextWithExtraData(
        context,
        opts,
        valueOptionsData,
        valueOptionsMetadata
      );

      // set valueOptions
      this.setValOpts(valueOptions);
      this._skipSetValueOptions = true;

      const setValueReturn = this.setVal(values, null, context);

      if (setValueReturn instanceof Promise) {
        return setValueReturn.then(
          this._bind(function () {
            this._skipSetValueOptions = false;
          })
        );
      }

      this._skipSetValueOptions = false;
      return Promise.resolve(setValueReturn);
    }
  });

  /**
   * @private
   */
  const _OjMultiCombobox = _ComboUtils.clazz(_AbstractMultiChoice, {
    _elemNm: 'ojcombobox',
    _classNm: 'oj-combobox',
    _COMPONENT_CLASSLIST: 'oj-combobox oj-combobox-multi oj-component',

    /**
     * Creates children elements for oj-combobox-many
     *
     * @return {jQuery} The collection of HTML elements that represent the content
     *
     * @memberof! _OjMultiCombobox
     * @instance
     * @protected
     * @override
     */
    _CreateContentElements: function () {
      var contentStructure = [
        "<div class='oj-text-field-container' role='presentation'> ",
        "<ul class='oj-combobox-choices oj-combobox-accessible-container'>",
        "  <li class='oj-combobox-search-field'><span class='oj-helper-hidden'>&nbsp;</span>",
        "    <input type='text' role='combobox' aria-expanded='false' aria-autocomplete='list'",
        "           autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='oj-combobox-input'>",
        '  </li>',
        '</ul>',
        '</div>',
        "<div class='oj-combobox-description oj-helper-hidden-accessible'></div>",
        "<div class='oj-listbox-drop oj-listbox-drop-multi'>",
        "   <div class='oj-listbox-loader-wrapper'></div>",
        "   <ul class='oj-listbox-results' role='listbox' data-oj-context>",
        '   </ul>',
        '</div>',

        "<div class='oj-helper-hidden-accessible oj-listbox-liveregion' aria-live='polite'></div>"
      ];
      return $(contentStructure.join(''));
    },

    // _OjMultiCombobox
    _initContainer: function () {
      _OjMultiCombobox.superclass._initContainer.apply(this, arguments);

      // JET-50535 - focus lost from component when mouse down on dropdown (Similar to JET-47442)
      // The editable table relies on the focus events from the popup to determine whether
      // or not the table should be edit mode. Initially when clicking on the combobox,
      // the initial focus is on the input element. At this point, when one clicks on
      // an option item, the focus will be lost on mousedown. Since, none of the other elements
      // in the dropdown are focusable, the focus is transferred to the first focusable ancestor
      // which in this case happens to be the body element. This results in the focusout event
      // on the popup. As the selection only happens on the mouseup event, if one keeps the mouse
      // pressed long enough, the table will exit the edit mode before the selection happens.
      // Since, we are not relying on the physical focus anyway for selection mechanism, a patchy
      // solution here would be to prevent the focus transfer when one clicks in the results area.
      // This way the table would stay in edit mode.
      this.dropdown.on('mousedown', _ComboUtils.killEvent);

      // JET-64259 - combobox-many drops focus on click if multiple lines of values are selected
      // When the user clicks anywhere in the field, focus the input
      this.container.on(
        'mousedown',
        function (evt) {
          if (!_ComboUtils.isReadonly(this.ojContext) && this._enabled) {
            var input = this.search[0];
            if (input) {
              evt.preventDefault();
              input.focus();
            }
          }
        }.bind(this)
      );
    },

    _opening: function (event, dontUpdateResults) {
      // if beforeExpand is not cancelled
      // beforeExpand event will be triggered in base class _shouldOpen method
      this._resizeSearch();
      _OjMultiCombobox.superclass._opening.apply(this, arguments);
      this._focusSearch();

      if (!dontUpdateResults) {
        this._updateResults(true);
      }

      this.search.focus();
    },

    /**
     * This function is used to set the placeholder for the component. Overriding here to
     * perform combobox-many specific operations.
     *
     * @instance
     * @memberof! _OjMultiCombobox
     * @protected
     * @override
     * @ignore
     */
    _setPlaceholder: function () {
      // JET-39650 - placeholder gets truncated in combobox-many
      // The super class updates the placeholder unconditionally. While it works fine for
      // combobox many in most of situations (since we do not call this method unless
      // we know for a fact that the value is not present), when having label-edge=inside,
      // this method will be called unconditionally on focus events. Since the placeholder
      // is being updated programmatically for label animations.
      // This results in the placeholder being set even when there is a value which
      // is causing issues.
      // In oj-combobox-one, this is not a problem as the placeholder is set on the input
      // element which is also used for showing the current selected value. So the placeholder
      // will not be shown when there is a value selected.
      // To fix this in oj-combobox-many, we will be setting the placeholder only when there is
      // no value.
      // JET-45520 - [jet10] oj-combobox-many: placeholder text is missing is if "required" turned on
      // A regression from the fix for JET-39650. When the component is in invalid state, the
      // this.getVal() might not reflect the actual displayValue. So, in those cases we need to
      // use this.currentValue instead.
      const isValid = this.ojContext.isValid();
      const isValidValueForPlaceholder =
        _ComboUtils.isValueForPlaceholder(true, this.getVal()) &&
        _ComboUtils.isValueOptionsForPlaceholder(true, this.getValOpts());
      const isCurrentValueForPlaceholder =
        _ComboUtils.isValueForPlaceholder(true, this.currentValue) &&
        _ComboUtils.isValueOptionsForPlaceholder(true, this.currentItem);
      if ((isValid && isValidValueForPlaceholder) || (!isValid && isCurrentValueForPlaceholder)) {
        // Now that we know, there are no selected pills, call the superclass' method to
        // apply the placeholder.
        _OjMultiCombobox.superclass._setPlaceholder.apply(this, arguments);
        // After setting the placeholder, resize the input field to make sure it has proper
        // width
        this._resizeSearch();
      }
    },

    _clearSearch: function () {
      var placeholder = this._getPlaceholder();
      var maxWidth = this._getMaxSearchWidth();

      //  - need to be able to specify the initial value of select components bound to dprv
      if (
        placeholder != null &&
        _ComboUtils.isValueForPlaceholder(true, this.getVal()) &&
        _ComboUtils.isValueOptionsForPlaceholder(true, this.getValOpts())
      ) {
        this.search.attr('placeholder', placeholder);
        // stretch the search box to full width of the container so as much of the placeholder is visible as possible
        // we could call this._resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
        this.search.val('').width(maxWidth > 0 ? maxWidth : this.container.css('width'));

        //  when the component is pre-created, the input box would get the default size
        this.searchContainer.width('100%');
      } else {
        this.search.attr('placeholder', '');
        this.search.val('').width(10);

        // reset the search container, so the input doesn't go to the next line if there is still room
        this.searchContainer.width('auto');
      }
    },

    _resetSearchWidth: function () {
      this.search.width(10);
    },

    _getMaxSearchWidth: function () {
      return this.selection.width() - _ComboUtils.getSideBorderPadding(this.search);
    },

    _textWidth: function (text) {
      var textSpan = document.createElement('span');
      var textNode = document.createTextNode(text);

      textSpan.style.display = 'none';
      textSpan.appendChild(textNode); // @HTMLUpdateOK
      $('body').append(textSpan); // @HTMLUpdateOK
      var width = $('body').find('span:last').width();
      $('body').find('span:last').remove();
      return width;
    },

    _resizeSearch: function () {
      var minimumWidth;
      var left;
      var maxWidth;
      var containerLeft;
      var searchWidth;
      var sideBorderPadding = _ComboUtils.getSideBorderPadding(this.search);

      minimumWidth = this._textWidth(this.search.val()) + 10;
      left = this.search.offset().left;
      maxWidth = this.selection.width();
      containerLeft = this.selection.offset().left;
      searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;
      if (searchWidth < minimumWidth) {
        searchWidth = maxWidth - sideBorderPadding;
      }
      if (searchWidth < 40) {
        searchWidth = maxWidth - sideBorderPadding;
      }
      if (searchWidth <= 0) {
        searchWidth = minimumWidth;
      }
      this.search.width(Math.floor(searchWidth));
    },

    /**
     * Whenever _SetDisplayValue is called and if the component supports having converter
     * this method will be called to update the valueOptions if the converter is updated.
     *
     * @protected
     * @override
     * @memberof! _OjMultiCombobox
     * @instance
     * @ignore
     */
    _UpdateValueOptionsWithConverter: function () {
      // if this method is called in response to the selection made on the UI (i.e. from onSelect)
      // _skipSetValueOptions will be set, so we can ignore this call
      if (this._skipSetValueOptions) {
        return;
      }

      // Otherwise, we need to update the valueOptions that are from the user input
      var valOpts = (this.getValOpts() || []).slice();
      var updatedValOpts = [];

      // if no valOpts is present, return doing nothing
      if (valOpts.length === 0) {
        return;
      }

      for (var i = 0; i < valOpts.length; i++) {
        var valOpt = valOpts[i];
        if (this._idsFromDropdown.has(this.id(valOpt))) {
          updatedValOpts.push(valOpt);
        } else {
          updatedValOpts.push(this.parseData(valOpt));
        }
      }

      // reapply the converter
      this.setValOpts(updatedValOpts);
    },

    /**
     * Syncs the display value with the rawValue.
     *
     * @param {jQuery.Event=} event optional event object to be passed on to the
     *                              _SetRawValue method
     * @param {boolean=}   setDirty optional flag to set the dirty state in the
     *                              component (Defaults to false)
     *
     * @protected
     * @override
     * @memberof! _OjMultiCombobox
     * @instance
     * @ignore
     */
    _SyncRawValue: function (event, setDirty) {
      let valueOptions = (this.getValOpts() || []).slice(0);
      let searchText = this.search.val();
      let rawValue = valueOptions.map(function (vo) {
        return vo.label;
      });

      if (searchText != null && searchText !== '') {
        rawValue.push(searchText);
      }

      // Set the dirty flag only if the setDirty is true
      if (setDirty === true) {
        this.hasUncommittedValue = true;
      }

      this.ojContext._SetRawValue(rawValue, event);
    }
  });

  /**
   * @private
   */
  const _AbstractSingleChoice = _ComboUtils.clazz(_AbstractOjChoice, {
    // _AbstractSingleChoice
    _enableInterface: function () {
      if (_AbstractSingleChoice.superclass._enableInterface.apply(this, arguments)) {
        this.search.prop(
          'disabled',
          !(this._isInterfaceEnabled() || _ComboUtils.isReadonly(this.ojContext))
        );
      }
    },

    // _AbstractSingleChoice
    _focus: function () {
      this.close();
    },

    // _AbstractSingleChoice
    _destroy: function () {
      $("label[for='" + this.search.attr('id') + "']").attr('for', this.opts.element.attr('id'));
      _AbstractSingleChoice.superclass._destroy.apply(this, arguments);
    },

    // _AbstractSingleChoice
    _clear: function (event) {
      var data = this.selection.data(this._elemNm);
      if (data) {
        // guard against queued quick consecutive clicks

        // This method will be invoked with or without event but 'data' will be null when it is invoked without event.
        // This logic is intended to clear the existing value when user manualy removes text in placeholder input box(which only happens for Combobox).
        // Ideally we should pass event, when we invoke _SetValue() if it is invoked on a UI action. So adding a warning message if event is null.
        if (!event) {
          Logger.warn('Event should not be null when user modified the value in UI');
        }

        //  - error 'value is required' is shown even though it has a value
        // only clear value when it's not "select" and "required"
        var emptyVal = this.ojContext._IsCustomElement() ? '' : [];

        if (this._classNm !== 'oj-select' || !this.ojContext._IsRequired()) {
          this.setVal(emptyVal, event);
        }

        this.search.val('');
        this.selection.removeData(this._elemNm);
      }
      this._setPlaceholder();
    },

    // _AbstractSingleChoice
    _initSelection: function () {
      //  - need to be able to specify the initial value of select components bound to dprv
      if (!_ComboUtils.applyValueOptions(this, this.opts)) {
        var element = this.datalist ? this.datalist : this.opts.element;
        this.opts.initSelection.call(null, element, this._bind(this._updateSelectedOption));
      }
    },

    // _AbstractSingleChoice
    _containerKeydownHandler: function (e) {
      if (!this._isInterfaceEnabled()) {
        return;
      }

      const keyCode = e.which || e.keyCode;
      if (keyCode === _ComboUtils.KEY.PAGE_UP || keyCode === _ComboUtils.KEY.PAGE_DOWN) {
        // prevent the page from scrolling
        e.preventDefault();
        return;
      }

      switch (keyCode) {
        case _ComboUtils.KEY.UP:
        case _ComboUtils.KEY.DOWN:
          if (this._opened()) {
            this._moveHighlight(keyCode === _ComboUtils.KEY.UP ? -1 : 1);
          } else {
            this.open(e);
          }
          //  - select and combobox stop keyboard event propegation
          e.preventDefault();
          return;

        case _ComboUtils.KEY.ENTER:
          // Fix :  PRESSING 'ENTER' WITHIN DROPDOWN SHOULD NOT PROPAGATE
          if (this._opened()) {
            e.stopPropagation();
          }
          this._selectHighlighted(null, e, true);
          //  - select and combobox stop keyboard event propegation
          e.preventDefault();
          if (!this._opened()) {
            this._userTyping = false;
          }
          return;

        case _ComboUtils.KEY.TAB:
          this.close(e);
          this._userTyping = false;
          return;

        case _ComboUtils.KEY.ESC:
          if (this._opened()) {
            // prevent the page from scrolling
            e.preventDefault();
            e.stopPropagation();
          }
          this._cancel(e);
          this._userTyping = false;
          return;

        default:
          break;
      }

      // /ojselect: used by select
      this._userTyping = true;
    },

    // _AbstractSingleChoice
    _containerKeyupHandler: function (e) {
      if (this._isInterfaceEnabled()) {
        if (!this._opened()) {
          this.open(e);
        }
      }
    },

    // _AbstractSingleChoice
    _initContainer: function () {
      var container = this.container;

      //  - ojselect id attribute on oj-select-choice div is not meaningful
      var rootAttr = this.opts.rootAttributes;
      var idSuffix =
        rootAttr && rootAttr.id ? rootAttr.id : this._getAttribute('id') || _ComboUtils.nextUid();
      var ariaLabel = this._getTransferredAttribute('aria-label');
      var ariaControls = this._getTransferredAttribute('aria-controls');

      var selection = container.find('.' + this._classNm + '-choice');
      this.selection = selection;
      this._contentElement = this._elemNm === 'ojcombobox' ? this.search : this.selection;
      //  - ojselect missing id attribute on oj-select-choice div
      selection.attr('id', this._classNm + '-choice-' + idSuffix);

      // add aria associations
      selection.find('.' + this._classNm + '-input').attr('id', this._classNm + '-input-' + idSuffix);

      let resultId = this.results.attr('id');
      if (!resultId) {
        resultId = 'oj-listbox-results-' + idSuffix;
        this.results.attr('id', resultId);
      }

      var liveRegion = container.find('.oj-listbox-liveregion');
      if (liveRegion.length) {
        liveRegion.attr('id', 'oj-listbox-live-' + idSuffix);
      }
      //  - Accessibility : JAWS does not read aria-controls attribute set on ojselect
      if (this._classNm !== 'oj-select') {
        this.search.attr('aria-controls', this.results.attr('id'));
      }

      if (!this.ojContext._IsCustomElement()) {
        var elementLabel = $("label[for='" + this._getAttribute('id') + "']");
        if (!elementLabel.attr('id')) {
          elementLabel.attr('id', this._classNm + '-label-' + idSuffix);
        }
        this.search.attr('aria-labelledby', elementLabel.attr('id'));
        this.opts.element.attr('aria-labelledby', elementLabel.attr('id'));
        if (this.search.attr('id')) {
          elementLabel.attr('for', this.search.attr('id'));
        }
      }

      if (ariaLabel) {
        this._contentElement.attr('aria-label', ariaLabel);
      }

      const contentElementAriaControls = ariaControls ? resultId + ' ' + ariaControls : resultId;
      this._contentElement.attr('aria-controls', contentElementAriaControls);

      selection.on('keydown', this._bind(this._containerKeydownHandler));

      selection.on(
        'mousedown',
        this._bind(function (e) {
          if (!this._ShouldToggleDropdown(e)) {
            return;
          }
          // /prevent user from focusing on disabled select
          if (this.opts.element.prop('disabled')) {
            _ComboUtils.killEvent(e);
          }

          // if select box gets focus ring via keyboard event previously, clear it now
          selection.removeClass('oj-focus-highlight');
          this.container.removeClass('oj-focus-highlight');

          if (this._opened()) {
            this.close(e);
          } else if (this._isInterfaceEnabled()) {
            this.open(e);
          }

          //  - keyboard flashes briefly on ios.
          var hidden = this.search.parent().attr('aria-hidden');
          if (hidden && hidden === 'true') {
            this.selection.focus();
          } else {
            this.search.focus();
          }

          // prevent focus move back
          if ($(e.target).hasClass('oj-combobox-open-icon')) {
            _ComboUtils.killEvent(e);
          }

          this.container.addClass('oj-active');
        })
      );

      selection.on(
        'mouseup',
        this._bind(function () {
          this.container.removeClass('oj-active');
        })
      );

      selection.on(
        'focus',
        this._bind(function (e) {
          _ComboUtils.killEvent(e);
        })
      );

      this.search.on(
        'compositionstart',
        this._bind(function () {
          // See _isComposing in InputBase for comments on what this does
          this.ojContext._isComposing = true;
        })
      );

      this.search.on(
        'compositionend',
        this._bind(function (e) {
          this.ojContext._isComposing = false;
          this._onSearchInputHandler(e);
        })
      );

      this.search.on(
        'input',
        this._bind(function (e) {
          // JET-39086 - raw-value is not getting updated until space in android devices
          // In android devices, typing in an English word will behave similar to what one
          // would see when they compose a CJK character in desktop devices. So, we need to
          // update the raw-value for all the input events in Android devices without considering
          // composition events so that the property gets updated for each english character and not
          // only for delimiters. In GBoard all the CJK keyboard layouts directly allow users
          // to input a CJK character, so we do not need to rely on composition events for that.
          // In Japanese keyboard, one of the three available layouts uses english chars
          // to compose a Japanese character in which case circumventing the logic would end up
          // updating the property with garbage values. But, it is highly unlikely for one to
          // use this layout as the other two layouts would allow users to directly type in Japanese
          // characters. So, for now we will not have to worry about composition events in
          // Android devices.
          if (!this.ojContext._isComposing || this._isAndroidDevice) {
            this._onSearchInputHandler(e);
          }
        })
      );

      this.search.on(
        'focus',
        this._bind(function () {
          this._previousDisplayValue = this.search.val();
        })
      );

      this.search.on(
        'blur keyup',
        this._bind(function (e) {
          if (e.type === 'keyup' && e.keyCode !== 10 && e.keyCode !== 13) {
            return;
          }

          if (
            this._ShouldCreateNewEntry(e.type === 'keyup') &&
            (e.type !== 'keyup' || !this.enterKeyEventHandled)
          ) {
            var value = this.search.val();

            // The converter should only be applied for the user input.
            // This flag will be used in the overriden _parseValue method
            // in oj.Combobox and this will called synchronously for both sync and async validators
            // as the validation happens after the parsing.
            this.shouldApplyConverter = true;

            // When creating new entry include the unparsed value as well as we will be sending
            // the unparsed value to EditableValue for it to do its thing.
            var valopt = this.opts.manageNewEntry(value, true);

            var trigger =
              e.type === 'blur'
                ? _ComboUtils.ValueChangeTriggerTypes.BLUR
                : _ComboUtils.ValueChangeTriggerTypes.ENTER_PRESSED;
            var options = {
              trigger: trigger
            };

            var selectionData = this.selection.data(this._elemNm);
            var previousValue = this.getVal();
            var optionalCleanupPromise = null;

            if (
              (!selectionData && value !== '') ||
              (selectionData && selectionData.label !== value) ||
              (!this.ojContext.isValid() && value !== this.ojContext._GetDisplayValue())
            ) {
              var onSelectReturn = this._onSelect(valopt, options, e);
              optionalCleanupPromise = onSelectReturn;

              if (e.type !== 'blur') {
                if (onSelectReturn instanceof Promise) {
                  onSelectReturn.then(
                    this._bind(function (result) {
                      if (result) {
                        // trigger events only if the value is set
                        this._triggerUpdateEvent(valopt, options, e);
                        this._triggerValueUpdatedEvent(valopt, previousValue);
                      }
                    })
                  );
                } else if (onSelectReturn !== false) {
                  // Need to trigger the events even when onSelectReturn is null
                  // as the events should be triggered even when setting the same value again
                  this._triggerUpdateEvent(valopt, options, e);
                  this._triggerValueUpdatedEvent(valopt, previousValue);
                }
              }
            } else if (e.type === 'keyup') {
              // if the value stays the same, we still want to fire valueUpdated event to support search use cases
              if (selectionData && selectionData.label === value) {
                valopt = selectionData;
              }

              // Close the dropdown
              this.close(e);

              this._triggerUpdateEvent(valopt, options, e);
              this._triggerValueUpdatedEvent(valopt, previousValue);
            }

            // Cleanup the converter flags once the selection operation is complete
            if (optionalCleanupPromise instanceof Promise) {
              optionalCleanupPromise.then(
                this._bind(function () {
                  delete this.shouldApplyConverter;
                })
              );
            } else {
              delete this.shouldApplyConverter;
            }
          }

          // Clear up the focus classes on blur event
          if (e.type === 'blur') {
            this.search.removeClass(this._classNm + '-focused');
            this.container.removeClass('oj-focus');
          }

          // Clearing the flag which is set while processing the keydown event
          // in _selectHighlighted() method.
          this.enterKeyEventHandled = false;
        })
      );

      this._initContainerWidth();

      this.opts.element.hide().attr('aria-hidden', true);

      this._setPlaceholder();
    },

    /**
     * Handles input event and compositionend event for the search field
     * @param {jQuery.Event} event input/compositionend event triggered on the search field
     * @private
     */
    _onSearchInputHandler: function (event) {
      // When user types in something into the combobox, mark it dirty
      // and this will be used when deciding what should be used
      // for validation
      this._SyncRawValue(event, true);
    },

    // _AbstractSingleChoice
    _prepareOpts: function () {
      var opts = _AbstractSingleChoice.superclass._prepareOpts.apply(this, arguments);
      var self = this;

      // /ojselect set initial selected value
      var tagName = opts.element.get(0).tagName.toLowerCase();
      if (
        (tagName === 'input' && opts.element.attr('list')) ||
        (tagName === 'select' && opts.element.children().length > 0) ||
        (opts.ojContext._IsCustomElement() && !opts.options) ||
        opts.list
      ) {
        var eleName = opts.list ? 'li' : 'option';

        if (opts.ojContext._IsCustomElement()) {
          eleName = 'oj-option';
        }

        // install the selection initializer
        opts.initSelection = function (element, callback) {
          var selected;
          var value = self.getVal();
          // clear the ids from dropdown set as it can hold only one value for single choice
          self._idsFromDropdown.clear();
          if (Array.isArray(value) && !opts.ojContext._IsCustomElement()) {
            value = value[0];
          }

          if (value !== undefined && value !== null) {
            selected = self._optionToData(
              element.find(eleName).filter(function () {
                var elemValue;
                if (eleName === 'li') {
                  elemValue = this.getAttribute('oj-data-value');
                } else if (eleName === 'option' || eleName === 'oj-option') {
                  elemValue = this.value;
                }

                return oj.Object.compareValues(elemValue, value);
              })
            );

            //  - select list behaves differently when using options attribute vs options tag
            if (tagName === 'select' && selected === undefined) {
              value = null;
            }
          }
          if (value === undefined || value === null) {
            selected = self._optionToData(
              element.find(eleName).filter(function () {
                if (eleName === 'li') {
                  return this.getAttribute('oj-data-selected') === true;
                } else if (eleName === 'option') {
                  return this.selected;
                }
                return false;
              })
            );
            // set first oj-option for oj-select
            if (
              self._classNm === 'oj-select' &&
              selected === undefined &&
              opts.ojContext._IsCustomElement()
            ) {
              selected = self._optionToData($(element.find(eleName)[0]));
              Logger.info(
                'Select identified by ' +
                  self.container.attr('id') +
                  ' defaults to first option because the value is not set.'
              );
            }
          }
          if (selected != null) {
            self._idsFromDropdown.add(opts.id(selected));
          }
          callback(selected);
        };

        //  - ojselect should ignore the invalid value set programmatically
        opts.validate = function (element, value) {
          var selected;

          if (value !== undefined && value !== null) {
            selected = self._optionToData(
              element.find(eleName).filter(function () {
                var elemValue;
                if (eleName === 'li') {
                  elemValue = this.getAttribute('oj-data-value');
                } else if (eleName === 'option' || eleName === 'oj-option') {
                  elemValue = this.value;
                }

                return oj.Object.compareValues(elemValue, value);
              })
            );
          }

          return !!selected;
        };
      } else if ('options' in opts || (this.getVal() && this.getVal().length > 0)) {
        if (_ComboUtils.isDataProvider(opts.options) || $.isFunction(opts.options)) {
          // install default initSelection when applied to hidden input
          // and getting data from remote
          opts.initSelection = function (element, callback) {
            var findOption = function (results, optionValue) {
              for (var i = 0, l = results.length; i < l; i++) {
                var result = results[i];
                if (oj.Object.compareValues(optionValue, opts.id(result))) {
                  return result;
                }

                if (result.children) {
                  var found = findOption(result.children, optionValue);
                  if (found) {
                    return found;
                  }
                }
              }

              return null;
            };

            var id = self._getValueItem();
            var match = null;
            // clear the ids from dropdown set as it can hold only one value for single choice
            self._idsFromDropdown.clear();
            if (id == null) {
              if (tagName === 'select' && !self.ojContext._HasPlaceholderSet()) {
                _ComboUtils
                  .fetchFirstBlockFromDataProvider(self.container, opts, 1)
                  .then(function (data) {
                    // check if the current instance is still alive. If it has been destroyed
                    // while fetching the data, do not do anything here
                    if (!self.isInitialized) {
                      return;
                    }
                    // since the fetch process is not synchronous, at this point
                    // we need to check if the current value is still null and we should
                    // default it to the first option only if the value is not updated
                    // while the fetch was happening.
                    var isValueUpdated = self._getValueItem() != null;
                    // At this point if we still don't have a selected value then default to the first item
                    if (data && data.length > 0 && !isValueUpdated) {
                      callback(data[0]);
                      Logger.info(
                        'Select identified by ' +
                          self.container.attr('id') +
                          ' defaults to first option because the value is not set.'
                      );
                    }
                  });
              } else {
                callback(match);
              }
              return;
            }

            // This data will be saved after querying the options.
            var queryResult = _ComboUtils.getLastQueryResult(self);
            if (queryResult) {
              match = findOption(queryResult, id);
            }

            if (!match) {
              // currentItem will hold the selected object with value and label.
              // Which updated everytime value is changed.
              var currentItem = self.currentItem;
              if (
                currentItem &&
                currentItem.length &&
                oj.Object.compareValues(id, opts.id(currentItem[0]))
              ) {
                match = currentItem[0];
                Logger.info(
                  'Select identified by ' +
                    self.container.attr('id') +
                    ' defaults to first option due to invalid value.'
                );
              }
            }

            // valueChangeTrigger will have one of the values from
            // _ComboUtils._ValueChangeTriggerTypes, which represents the
            // what triggered the value change. But if value is programmatically
            // updated this will be null. So if valueChangeTrigger is null
            // querying for the options again as component will not have list
            // of options in case value is updated programmatically.
            if (!match && !self.valueChangeTrigger) {
              // Show the loading indicator in the text field to show that the
              // label is being fetched.
              _ComboUtils.updateLoadingState(self, true);

              const clearLoadingState = function () {
                _ComboUtils.updateLoadingState(self, false);
              };
              opts.query({
                value: [id],
                // If a callback function is provided for the initSelection call,
                // call the method with the match found. Otherwise do nothing
                // except cleaning up.
                callback:
                  typeof callback !== 'function'
                    ? clearLoadingState
                    : function (qryResult) {
                        // if the instance is destroyed at this point, do nothing
                        if (!self.isInitialized) {
                          return;
                        }
                        // Clear the loading indicator, now that the label is fetched
                        clearLoadingState();
                        //  - While fetching the label for the initial value,
                        // user can still interact the component and pick a new value.
                        if (
                          !_ComboUtils.isDataProvider(opts.options) ||
                          (oj.Object.compareValues(id, self.getVal()) &&
                            !_ComboUtils.isValueChanged(self.ojContext))
                        ) {
                          if (qryResult && qryResult.results) {
                            match = findOption(qryResult.results, id);
                            if (match != null) {
                              self._idsFromDropdown.add(opts.id(match));
                            }
                          }
                          callback(match);
                          _ComboUtils.setValueChanged(self.ojContext, undefined);
                        }
                      },
                cleanup: $.noop
              });
            } else {
              if (match != null) {
                self._idsFromDropdown.add(opts.id(match));
              }
              callback(match);
            }
          };
        } else {
          // install default initSelection when applied to hidden input and data is local
          //  - ojselect does not display selected value
          opts.initSelection = function (element, callback) {
            var id = self._getValueItem();
            // search in data by id, storing the actual matching item
            // var first = null;
            //  - ojselect - validator error message is not shown
            // initialize first = placeholder if we have a placeholder and select value is not required
            var usePlaceholder =
              tagName === 'select' &&
              self.ojContext._HasPlaceholderSet() &&
              !self.ojContext._IsRequired();
            var first = usePlaceholder ? self._getPlaceholder() : null;

            var match = null;
            // clear the ids from dropdown set as it can hold only one value for single choice
            self._idsFromDropdown.clear();
            opts.query({
              matcher: function (term, text, el) {
                var isMatch = oj.Object.compareValues(id, opts.id(el));
                if (isMatch) {
                  match = el;
                }
                // /ojselect save the 1st option
                if (first == null) {
                  first = el;
                }
                return isMatch;
              },
              callback: !$.isFunction(callback)
                ? $.noop
                : function () {
                    // if the instance is destroyed at this point, do nothing
                    if (!self.isInitialized) {
                      return;
                    }
                    if (match != null) {
                      self._idsFromDropdown.add(opts.id(match));
                    }
                    // ojselect if no match, pick the 1st option
                    // If the option data is pending, don't send the placeholder to the callback
                    // so the value won't be nulled out
                    if (!match && tagName === 'select' && !self.ojContext._isOptionDataPending()) {
                      match = first;
                      Logger.info(
                        'Select identified by ' +
                          self.container.attr('id') +
                          ' defaults to ' +
                          (usePlaceholder ? 'placeholder' : 'first option') +
                          ' due to invalid value.'
                      );
                    }
                    callback(match);
                  },
              cleanup: $.noop
            });
          };

          //  - ojselect should ignore the invalid value set programmatically
          opts.validate = function (element, value) {
            var id = value;

            // search in data by id, storing the actual matching item
            var match = null;
            opts.query({
              matcher: function (term, text, el) {
                var isMatch = oj.Object.compareValues(id, opts.id(el));
                if (isMatch) {
                  match = el;
                }
                return isMatch;
              },
              callback: $.noop,
              cleanup: $.noop
            });

            return !!match;
          };
        }
      }
      return opts;
    },

    // _AbstractSingleChoice
    _postprocessResults: function (data, initial, noHighlightUpdate) {
      var selected = -1;
      var self = this;
      var highlightableChoices;

      highlightableChoices = this._findHighlightableChoices();
      _ComboUtils.each2(highlightableChoices, function (i, elm) {
        var valueItem = self._getValueItem();

        if (
          valueItem != null &&
          oj.Object.compareValues(valueItem, self.id(elm.data(self._elemNm)))
        ) {
          selected = i;
          return false;
        }
        return true;
      });

      // and highlight it
      if (noHighlightUpdate !== false) {
        if (initial === true && selected >= 0) {
          // Highlight the initial selection as keyboard focused as
          // pressing enter without doing anything should set the selected
          // value
          this._highlight(selected, true, true);
        }
      }

      //  - grouping header accessibility issue for jaws
      this._processAriaLabelForHierarchy();
    },

    // _AbstractSingleChoice
    /**
     * Handles when a selection is made by the user
     *
     * @param {object} data A valueOption object for the currect selection
     * @param {object} options Options for _onSelect method on how to handle the event
     * @param {jQuery.Event=} event The event at which the method is invoked
     * @return {Promise|boolean|null} Result of setting the value
     *                                * Promise when using async validators
     *                                * boolean when using sync validators / when setting the value without validators
     *                                * null when setValue is not invoked since there was no change in the value
     *
     * @memberof! _AbstractSingleChoice
     * @instance
     * @private
     */
    _onSelect: function (data, options, event) {
      if (!this._triggerSelect(data)) {
        return false;
      }

      var context;
      var opts = _ComboUtils.getOpts(this.ojContext);
      if (options && options.trigger) {
        context = {
          optionMetadata: {
            trigger: options.trigger
          }
        };
      }
      // set the data and metadata in the context
      context = _ComboUtils.getContextWithExtraData(context, opts, data.data, data.metadata);

      // var old = this.getVal()? this.getVal()[0] : null;
      // selection will be updated after _SetValue is called
      // this._updateSelection(data);
      this.close(event);
      // When there is validation error, the value option may retain the previous value
      // although the display value is different. In that case, user should be able to still
      // select the previous valid value to get rid off the invalid style and message.
      /* if (!(old === this.id(data)))*/
      var val;
      var unparsedData = this.sanitizeData(data, true);
      var parsedData = this.sanitizeData(data);
      var valOptsInit = this.getValOpts();
      var valopt = parsedData;
      var previousHasUncommittedValue = this.hasUncommittedValue;
      var setValueReturn = null;
      var returnValue = null;
      var id = this.id(unparsedData);
      var parsedId = this.id(parsedData);
      var valueOptionFromResult;
      // if the data is from dropdown add it to the set
      this._idsFromDropdown.clear(); // single choice holds only one value at a time
      if (id.length === 0) {
        val = this.ojContext._IsCustomElement() ? _ComboUtils.getValueForPlaceholder(false) : [];
        valopt = _ComboUtils.getFixupValueOptionsForPlaceholder(false);
        valueOptionFromResult = _ComboUtils.findOptionFromResult(this, val, valopt);
      } else {
        val = id;
        valueOptionFromResult = _ComboUtils.findOptionFromResult(this, parsedId, valopt);
        // if the converter is not set to be applied or if the user inputted value is matched with
        // one of provided options, add the id to the set.
        if (!this.shouldApplyConverter || valopt !== valueOptionFromResult) {
          this._idsFromDropdown.add(parsedId);
        }
      }
      // setValueOptions before setVal so that new entry already in valueOption.
      // this is to avoid looking for new entry on the dataProvider
      if (this._classNm === 'oj-combobox' || this._classNm === 'oj-select') {
        this._skipSetValueOptions = true;
        //  - oj.tests.input.combobox.testcombobox display value mismatch automation failure
        this.setValOpts(valueOptionFromResult);
      }

      // Fix , 
      // For combobox, we are using the flag hasUncommittedValue to decide on whether
      // the label or the value would take part in validation.
      // So, when a selection is made, this flag has to be cleared before setting the value.
      this.hasUncommittedValue = false;
      // setVal method returns a promise that resolves to true|false or a boolean
      setValueReturn = this.setVal(val, event, context);

      if (setValueReturn instanceof Promise) {
        returnValue = setValueReturn.then(
          this._bind(function (result) {
            this._afterOnSelectSetVal(result, valOptsInit, previousHasUncommittedValue);
            // return the result of the validation, which can use by methods
            // that rely on the result of _onSelect call.
            return result;
          })
        );
      } else {
        // Sanitize the setValueReturn to be boolean.
        // we can treat null as a passed case, since it represents that
        // the value is already the selected values and a valid one.
        var result = setValueReturn !== false;
        this._afterOnSelectSetVal(result, valOptsInit, previousHasUncommittedValue);
        returnValue = setValueReturn;
      }

      // need not to wait for the validation to complete as the following
      // operations are a response to the event and not for setting the value.
      if (
        (!options || options.trigger !== _ComboUtils.ValueChangeTriggerTypes.BLUR) &&
        this._elemNm === 'ojcombobox'
      ) {
        this._focusSearch();
      }

      return returnValue;
    },

    /**
     * Performs operations that has to be done after the setVal call in _onSelect
     *
     * @param {boolean} result The result of the setVal call
     * @param {object} valOptsInit The initial valueOption to revert to if validation fails
     * @param {boolean} previousHasUncommittedValue The initial hasCommittedValue flag value
     *
     * @memberof! _AbstractSingleChoice
     * @instance
     * @private
     */
    _afterOnSelectSetVal: function (result, valOptsInit, previousHasUncommittedValue) {
      var isSelectCombobox = this._classNm === 'oj-combobox' || this._classNm === 'oj-select';
      // If the validation fails, set the hasUncommittedValue flag so as to revert it back to its
      // original state
      if (result === false) {
        // The validation failed, so reset the flag
        this.hasUncommittedValue = previousHasUncommittedValue;

        // Since the validation failed, restore to the initial valueOption
        if (isSelectCombobox) {
          this.setValOpts(valOptsInit);
        }
      }

      this._skipSetValueOptions = false;
      delete this.shouldApplyConverter;
    },

    // _AbstractSingleChoice
    _clearSearch: function () {
      this.search.val('');
    },

    // _AbstractSingleChoice
    _getValueItem: function () {
      var valueItem = null;
      var val = this.getVal();

      // value supports any type including boolean, so a simple if (val) check will not work
      if (val !== null && val !== undefined) {
        if (!this.ojContext._IsCustomElement() && val.length) {
          valueItem = val[0];
        } else {
          valueItem = val;
        }
      }
      return valueItem;
    },

    /**
     * Returns the selection data
     * @instance
     * @private
     * @ignore
     * @return {Object}
     */
    _getSelectionData: function () {
      return this.selection.data(this._elemNm);
    },

    /**
     * Returns the components wrapper under which label needs to be inserted in the inside strategy
     * @instance
     * @protected
     * @ignore
     * @return {Element|undefined}
     */
    _GetContentWrapper: function () {
      return this.container[0].querySelector('.oj-text-field-middle');
    },

    /**
     * Determines whether to create a new entry.
     * @param {boolean} isKeyboardAction flag indicating is this is for a keyboard action
     * @returns {boolean} flag indicating whether a new entry has to be created
     *
     * @memberof! _AbstractSingleChoice
     * @override
     * @instance
     * @protected
     */
    _ShouldCreateNewEntry: function (isKeyboardAction) {
      if (!this.opts.manageNewEntry) {
        // New entry not supported
        return false;
      }

      const selector = isKeyboardAction ? '.oj-hover.oj-listbox-result-keyboard-focus' : '.oj-hover';
      const selectedResult = this.results.find(selector);
      const newValue = this.search.val();
      // Create new entry if there is a new value and no result is highlighted using keyboard
      // For combobox one we need to treat '' as a value as opposed to combobox many where we
      // do not want to react when the value is ''.
      return newValue !== undefined && selectedResult.length === 0;
    },

    /**
     * Determines whether or not the dropdown should be opened/closed for the provided
     * event.
     * @param {jQuery.Event} event The event object
     * @returns {boolean} Whether the dropdown should be opened/closed
     *
     * @protected
     * @memberof! _AbstractSingleChoice
     * @instance
     * @override
     */
    _ShouldToggleDropdown: function (event) {
      const superResult = _AbstractSingleChoice.superclass._ShouldToggleDropdown.apply(
        this,
        arguments
      );
      const isTargetInEndSlot =
        event.target.getAttribute('slot') === 'end' || $(this._endSlot).find(event.target).length > 0;
      // super method should return true and the target should not be in the end slot
      return superResult && !isTargetInEndSlot;
    },

    /**
     * Initiates selection with the provided item
     *
     * @param {Array<object>} items The item that has to be selected
     * @param {object} options Options for invoking selection
     *
     * @return {Promise<boolean>} A promise representing the status of the selection
     *
     * @protected
     * @instance
     * @memberof! _AbstractSingleChoice
     * @override
     * @ignore
     */
    _InvokeSelection: function (items, options) {
      if (!items.length) {
        return Promise.resolve(false);
      }

      // For -one elements, there will be only one item for selection
      const item = items[0];
      return new Promise(
        this._bind(function (resolve, reject) {
          const onSelectReturn = this._onSelect(item, options, null);

          if (onSelectReturn instanceof Promise) {
            onSelectReturn.then(resolve, reject).catch(reject);
            return;
          }
          resolve(onSelectReturn);
        })
      );
    }
  });

  /**
   * @private
   */
  const _OjSingleCombobox = _ComboUtils.clazz(_AbstractSingleChoice, {
    _elemNm: 'ojcombobox',
    _classNm: 'oj-combobox',
    _COMPONENT_CLASSLIST: 'oj-combobox oj-component',

    /**
     * Creates children elements for oj-combobox-one
     *
     * @return {jQuery} The collection of HTML elements that represent the content
     *
     * @memberof! _OjSingleCombobox
     * @instance
     * @protected
     * @override
     */
    _CreateContentElements: function () {
      var contentStructure = [
        "<div class='oj-text-field-container oj-text-field-has-end-slot' role='presentation'>",
        "  <div class='oj-combobox-choice oj-combobox-accessible-container' tabindex='-1' role='presentation'>",
        "   <div class='oj-text-field-middle'>",
        "     <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off'",
        "       spellcheck='false' class='oj-combobox-input' role='combobox' aria-expanded='false' aria-autocomplete='list' />",
        '   </div>',
        "   <abbr class='oj-combobox-clear-entry' role='presentation'></abbr>",
        "   <span class='oj-combobox-divider' role='presentation'></span>",
        "   <span class='oj-text-field-end'>",
        "     <span class='oj-combobox-arrow oj-combobox-icon oj-component-icon oj-clickable-icon-nocontext oj-combobox-open-icon'",
        "       aria-hidden='true'></span>",
        '   </span>',
        '  </div>',
        '</div>',
        "<div class='oj-listbox-drop' role='presentation'>",
        "   <div class='oj-listbox-loader-wrapper'></div>",
        "   <ul class='oj-listbox-results' role='listbox' data-oj-context>",
        '   </ul>',
        '</div>',

        "<div class='oj-helper-hidden-accessible oj-listbox-liveregion' aria-live='polite'></div>"
      ];
      var container = $(contentStructure.join(''));

      return container;
    },

    /**
     * Configures slots for oj-combobox-one
     *
     * @memberof! _OjSingleCombobox
     * @instance
     * @protected
     * @override
     */
    _ConfigureSlots: function () {
      // The container should be initialized before calling this method
      if (this.container == null || !this.ojContext._IsCustomElement()) {
        return;
      }

      var container = this.container;
      // container is always a jQuery object of custom-element
      var slotMap = ojcustomelementUtils.CustomElementUtils.getSlotMap(container[0]);
      var endSlot = slotMap.end;

      if (endSlot) {
        // remove the divider
        container.find('.oj-combobox-divider').remove();
        // remove the default arrow anchor
        container.find('.oj-combobox-arrow').remove();
        // append the slot at the end
        container.find('.oj-combobox-choice').append(endSlot); // @HTMLUpdateOK

        this._endSlot = endSlot;
      }
    },

    /**
     * Restores slots for oj-combobox-one
     *
     * @memberof! _OjSingleCombobox
     * @instance
     * @protected
     * @override
     */
    _RestoreSlots: function () {
      var _endSlot = this._endSlot;

      if (_endSlot != null && this.container != null && this.ojContext._IsCustomElement()) {
        this.container.append(_endSlot); // @HTMLUpdateOK
      }

      // Clear the reference to the dom element
      this._endSlot = null;
    },

    // _OjSingleCombobox
    _initContainer: function () {
      _OjSingleCombobox.superclass._initContainer.apply(this, arguments);

      // JET-50535 - focus lost from component when mouse down on dropdown (Similar to JET-47442)
      // The editable table relies on the focus events from the popup to determine whether
      // or not the table should be edit mode. Initially when clicking on the combobox,
      // the initial focus is on the input element. At this point, when one clicks on
      // an option item, the focus will be lost on mousedown. Since, none of the other elements
      // in the dropdown are focusable, the focus is transferred to the first focusable ancestor
      // which in this case happens to be the body element. This results in the focusout event
      // on the popup. As the selection only happens on the mouseup event, if one keeps the mouse
      // pressed long enough, the table will exit the edit mode before the selection happens.
      // Since, we are not relying on the physical focus anyway for selection mechanism, a patchy
      // solution here would be to prevent the focus transfer when one clicks in the results area.
      // This way the table would stay in edit mode.
      this.dropdown.on('mousedown', _ComboUtils.killEvent);
    },

    _triggerValueUpdatedEvent: function (data, previousValue) {
      if (!this.ojContext._IsCustomElement()) {
        return;
      }

      var value = this.id(data);
      if (value === undefined || value === null) {
        // If the value is entered by user (not by selecting an option) then
        // only 'label' will be present in the data object.
        value = data.label ? data.label : '';
      }

      if (!this.ojContext.isValid()) {
        return;
      }

      var detail = {};
      var element = this.ojContext.OuterWrapper;

      detail.value = value;
      detail.previousValue = previousValue;

      var eventName = 'ojValueUpdated';
      var valueUpdatedEvent = new CustomEvent(eventName, { detail: detail });
      element.dispatchEvent(valueUpdatedEvent);
    },

    // eslint-disable-next-line no-unused-vars
    _enable: function (enabled) {
      _OjSingleCombobox.superclass._enable.apply(this, arguments);

      if (this._enabled) {
        this.container.find('.oj-combobox-arrow').removeClass('oj-disabled');
      } else {
        this.container.find('.oj-combobox-arrow').addClass('oj-disabled');
      }
    },

    _opening: function (event, dontUpdateResults) {
      // if beforeExpand is not cancelled
      _OjSingleCombobox.superclass._opening.apply(this, arguments);

      this._focusSearch();

      if (!dontUpdateResults) {
        this._updateResults(true);
      }
    },

    _containerKeydownHandler: function (e) {
      // If oj-button is used in the end slot, let the button handle the key down event
      if (e.target.getAttribute('slot') === 'end' || $(this._endSlot).find(e.target).length > 0) {
        return;
      }
      // /ignore control key and function key
      if (_ComboUtils.KEY.isControl(e) || _ComboUtils.KEY.isFunctionKey(e)) {
        return;
      }

      _OjSingleCombobox.superclass._containerKeydownHandler.apply(this, arguments);
    },

    _updateSelection: function (data) {
      var formatted;

      var item = [];
      var text;
      this.selection.data(this._elemNm, data);

      if (data !== null && data.length !== 0) {
        formatted = _ComboUtils.getLabel(data);
        if (formatted !== undefined && this.search.val() !== formatted) {
          this.search.val(formatted);
        }
        this.search.removeClass(this._classNm + '-default');

        item.push(data);
        text = formatted;
      } else {
        // data will be null only when user set it programmatically.
        this.search.val('');
        this._setPlaceholder();
        text = '';
      }
      // keep readonly div's content in sync
      if (this.ojContext.options.readOnly) {
        let readonlyElem = this.ojContext._getReadonlyDiv();
        if (readonlyElem) {
          readonlyElem.textContent = text;
        }
      }

      // Storing this data so that it will be used when setting the display value.
      this.currentItem = item;
    },

    _updateSelectedOption: function (selected) {
      if (selected !== undefined && selected !== null) {
        this._updateSelection(selected);
        //  - need to be able to specify the initial value of select components bound to dprv
        this.setValOpts(selected);
      } else {
        // if we found no match, update the selection with the value
        var value = this.getVal();
        var data;
        var parsedData;
        if (value == null) {
          data = null;
        } else if (!Array.isArray(value)) {
          data = { label: value, value: value };
        } else if (value.length) {
          value = value[0];
          data = { label: value, value: value };
        } else {
          value = null;
          data = null;
        }
        // if a converter is used, we need to format the label. Since we are not
        // setting the shouldApplyConverter flag, the value will not be parsed and
        // is used as it is.
        parsedData = this.parseData(data);
        this._updateSelection(parsedData);
        // if value is a new entry
        if (!_ComboUtils.isValueForPlaceholder(false, value)) {
          this.setValOpts(parsedData);
        } else {
          this.setValOpts(selected);
        }
      }
    },

    /**
     * Whenever _SetDisplayValue is called and if the component supports having converter
     * this method will be called to update the valueOptions if the converter is updated.
     *
     * @protected
     * @override
     * @memberof! _OjSingleCombobox
     * @instance
     * @ignore
     */
    _UpdateValueOptionsWithConverter: function () {
      // if this method is called in response to the selection made on the UI (i.e. from onSelect)
      // _skipSetValueOptions will be set, so we can ignore this call
      if (this._skipSetValueOptions) {
        return;
      }

      // Otherwise, we need to update the valueOptions that are from the user input
      var valOpt = this.getValOpts();

      // if no valOpt is present, return doing nothing
      // if the valueOption is from dropdown return doing nothing
      if (valOpt == null || this._idsFromDropdown.has(this.id(valOpt))) {
        return;
      }

      // reapply the converter
      this.setValOpts(this.parseData(valOpt));
    },

    /**
     * Syncs the display value with the rawValue.
     *
     * @param {jQuery.Event=} event optional event object to be passed on to the
     *                              _SetRawValue method
     * @param {boolean=}   setDirty optional flag to set the dirty state in the
     *                              component (Defaults to false)
     *
     * @protected
     * @override
     * @memberof! _OjSingleCombobox
     * @instance
     * @ignore
     */
    _SyncRawValue: function (event, setDirty) {
      // Set the dirty flag only if the setDirty is true
      if (setDirty === true) {
        this.hasUncommittedValue = true;
      }
      this.ojContext._SetRawValue(this.search.val(), event);
    }
  });

  /**
   * @ojcomponent oj.ojComboboxOne
   * @augments oj.ojCombobox
   * @since 0.6.0
   * @ojdisplayname Combobox (One)
   * @ojshortdesc A combobox one is a dropdown list that supports single selection, text input, and search filtering.
   * @ojrole combobox
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojComboboxOne<K, D, V= any> extends ojCombobox<V, ojComboboxOneSettableProperties<K, D, V>, V, string>",
   *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}
   *                , {"name": "V", "description": "Type of value of the component"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojComboboxOneSettableProperties<K, D, V=any> extends ojComboboxSettableProperties<V>",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @ojtsimport {module: "ojconverter-number", type: "AMD", imported: ["IntlNumberConverter", "NumberConverter"]}
   * @ojtsimport {module: "ojconverter-datetime", type: "AMD",  imported: ["IntlDateTimeConverter", "DateTimeConverter"]}
   * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
   * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
   * @ojtsimport {module: "ojconverter-datetime", type: "AMD",  imported: ["IntlDateTimeConverter", "DateTimeConverter"]}
   * @ojtsimport {module: "ojvalidator-daterestriction", type: "AMD", importName: "DateRestrictionValidator"}
   * @ojtsimport {module: "ojvalidator-datetimerange", type: "AMD", importName: "DateTimeRangeValidator"}
   * @ojtsimport {module: "ojvalidator-length", type: "AMD", importName: "LengthValidator"}
   * @ojtsimport {module: "ojvalidator-numberrange", type: "AMD", importName: "NumberRangeValidator"}
   * @ojtsimport {module: "ojvalidator-regexp", type: "AMD", importName: "RegExpValidator"}
   * @ojtsimport {module: "ojvalidator-required", type: "AMD", importName: "RequiredValidator"}
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "required", "disabled"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value", "options"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-text-input-combo'
   *
   * @classdesc
   * <h3 id="comboboxOneOverview-section">
   *   JET Combobox One
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#comboboxOneOverview-section"></a>
   * </h3>
   * <p>Description: JET Combobox One provides support for single-select, text input, and search filtering.</p>
   *
   * <p>Inline options allow you to configure dropdown content with minimal effort. Adding start and end icons can be done directly in markup. However, this approach fully realizes every option into live DOM and is thus not suitable for large data. Inline options also do not support dynamic content.
   * </p>
   * </p>For medium-sized static content or cases where the set of options can only be computed at runtime while initializing the component (and is not subject to further modification), using oj-bind-for-each bound to a simple (non-observable) Array is more convenient than manually inlining each option. However, just like directly specifying inline options, this approach is not suitable for large or dynamic data.
   * </p>
   * <p>For cases where the data is large or dynamic, options should be specified using a DataProvider. This approach will limit the amount of live DOM, regardless of data size, and is also capable of reacting to changes in data. However, configuring dropdown content may require more work than the previous approaches.
   * </p>
   *
   * <p>A JET Combobox One can be created with the following markup.</p>
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-combobox-one>
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-combobox-one>
   * </code></pre>
   *
   * <p>A JET Combobox One can be created with a DataProvider.</p>
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-combobox-one options="[[dataprovider]]">
   * &lt;/oj-combobox-one>
   * </code></pre>
   *
   * <p>See the Combobox basic demo for inline options and DataProvider usage.</p>
   *
   * {@ojinclude "name":"selectComboDifferences"}
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
   * <h3 id="perf-section">
   *   Performance
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
   * </h3>
   *
   * <h4>Page Load</h4>
   * <p>If the <a href="#options">options</a> attribute is a data provider, and if there is an initially selected value, setting the <a href="#valueOption">valueOption</a> attribute initially can improve page load performance because the element will not have to fetch the selected label from the data provider.</p>
   * <p>When using a data provider, the dropdown data isn't fetched until the user opens the dropdown.</p>
   *
   *
   * {@ojinclude "name":"comboboxCommon"}
   */

  //-----------------------------------------------------
  //                   Slots ComboboxOne
  //-----------------------------------------------------

  /**
   * <p>The &lt;oj-combobox-one> element accepts <code class="prettyprint">oj-option</code> elements as children. See the [oj-option]{@link oj.ojOption} documentation for details about
   * accepted children and slots.</p>
   *
   * @ojchild Default
   * @memberof oj.ojComboboxOne
   * @ojshortdesc The oj-combobox-one element accepts oj-option elements as children.
   * @ojpreferredcontent ["OptionElement", "OptgroupElement"]
   *
   * @example <caption>Initialize the Combobox with child content specified:</caption>
   * &lt;oj-combobox-one>
   *   &lt;oj-option value="option1">Option 1&lt;/oj-option>
   *   &lt;oj-option value="option2">Option 2&lt;/oj-option>
   *   &lt;oj-option value="option3">Option 3&lt;/oj-option>
   * &lt;/oj-combobox-one>
   */

  /**
   * <p>The &lt;oj-combobox-many> element accepts <code class="prettyprint">oj-option</code> elements as children. See the [oj-option]{@link oj.ojOption} documentation for details about
   * accepted children and slots.</p>
   *
   * @ojchild Default
   * @memberof oj.ojComboboxMany
   * @ojshortdesc The oj-combobox-many element accepts oj-option elements as children.
   * @ojpreferredcontent ["OptionElement", "OptgroupElement"]
   *
   * @example <caption>Initialize the Combobox with child content specified:</caption>
   * &lt;oj-combobox-many>
   *   &lt;oj-option value="option1">Option 1&lt;/oj-option>
   *   &lt;oj-option value="option2">Option 2&lt;/oj-option>
   *   &lt;oj-option value="option3">Option 3&lt;/oj-option>
   * &lt;/oj-combobox-many>
   */

  /**
   * <p>The <code class="prettyprint">end</code> slot is for replacing combobox one's drop down arrow and the divider.
   * For example, a magnifying glass icon for a search field can be provided in this slot.
   * When the slot is provided with empty content, nothing will be rendered in the slot.
   * When the slot is not provided, the default drop down arrow icon and the divider will be rendered.</p>
   *
   * @ojslot end
   * @ojshortdesc The end slot enables replacement of the combobox's drop down arrow and divider. See the Help documentation for more information.
   * @since 4.2.0
   *
   * @memberof oj.ojComboboxOne
   *
   * @example <caption>Initialize the Combobox one with child content specified for the end slot:</caption>
   * &lt;oj-combobox-one>
   *   &lt;a slot='end' class='mySearchButtonClass'>&lt;/a>
   * &lt;/oj-combobox-one>
   */

  //-----------------------------------------------------
  //                   Fragments ComboboxOne
  //-----------------------------------------------------
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
   *       <td>Input Field</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td> If the drop down is not open, expand the drop down list. Otherwise, close the drop down list.
   *       If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *     <tr>
   *       <td>Arrow Button</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td> If the drop down is not open, expand the drop down list. Otherwise, close the drop down list.</td>
   *     </tr>
   *     <tr>
   *       <td>Option Item</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Tap on an option item in the drop down list to select.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   * <p>Disabled option items receive no highlight and are not selectable.</p>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojComboboxOne
   * @instance
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
   *      <td>Option item</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td> Select the highlighted choice from the drop down.</td>
   *     </tr>
   *     <tr>
   *       <td>Input field</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Set the input text as the value.</td>
   *     </tr>
   *     <tr>
   *      <td>Drop down</td>
   *       <td><kbd>UpArrow or DownArrow</kbd></td>
   *       <td> Highlight the option item on the drop down list in the direction of the arrow.
   *         If the drop down is not open, expand the drop down list.</td>
   *     </tr>
   *     <tr>
   *      <td>Drop down</td>
   *       <td><kbd>Esc</kbd></td>
   *       <td> Collapse the drop down list. If the drop down is already closed, do nothing.</td>
   *     </tr>
   *     <tr>
   *      <td>Combobox</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the combobox. If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   * <p>Disabled option items receive no highlight and are not selectable.</p>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojComboboxOne
   * @instance
   */

  //-----------------------------------------------------
  //                   Fragments ComboboxMany
  //-----------------------------------------------------
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
   *       <td>Input Field</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td> If the drop down is not open, expand the drop down list. Otherwise, close the drop down list.
   *       If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *     <tr>
   *       <td>Option Item</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Tap on an option item in the drop down list to add to selection.</td>
   *     </tr>
   *     <tr>
   *       <td>Selected item with remove icon</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Remove item from the selected items list by tapping on the remove icon.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   * <p>Disabled option items receive no highlight and are not selectable.</p>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojComboboxMany
   * @instance
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
   *      <td>Option item</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td> Select the highlighted item from the drop down.</td>
   *     </tr>
   *     <tr>
   *       <td>Input field</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Add the input text to selections.</td>
   *     </tr>
   *     <tr>
   *      <td>Drop down</td>
   *       <td><kbd>UpArrow or DownArrow</kbd></td>
   *       <td> Highlight the option item on the drop down list in the direction of the arrow.
   *         If the drop down is not open, expand the drop down list.</td>
   *     </tr>
   *     <tr>
   *      <td>Combobox</td>
   *       <td><kbd>LeftArrow or RightArrow</kbd></td>
   *       <td> Move focus to the previous or next selected item.</td>
   *     </tr>
   *     <tr>
   *       <td>Selected item with remove icon</td>
   *       <td><kbd>Backspace or Delete</kbd></td>
   *       <td>Remove the selected item having focus.</td>
   *     </tr>
   *     <tr>
   *      <td>Drop down</td>
   *       <td><kbd>Esc</kbd></td>
   *       <td> Collapse the drop down list. If the drop down is already closed, do nothing.</td>
   *     </tr>
   *     <tr>
   *      <td>Combobox</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the combobox. If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   * <p>Disabled option items receive no highlight and are not selectable.</p>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojComboboxMany
   * @instance
   */

  //-----------------------------------------------------
  //                   Styles
  //-----------------------------------------------------

  // ---------------- oj-form-control-full-width --------------
  /**
   * Changes the max-width to 100% so that form components will occupy all the available horizontal space.
   * @ojstyleclass oj-form-control-full-width
   * @ojdisplayname Full Width
   * @memberof oj.ojComboboxOne
   * @ojtsexample
   * &lt;oj-combobox-one class="oj-form-control-full-width">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-combobox-one>
   */

  // ---------------- oj-form-control max-width --------------
  /**
   * In the Redwood theme the default max width of a text field is 100%.
   * These max width convenience classes are available to create a medium or small field.<br>
   * The class is applied to the root element.
   * @ojstyleset form-control-max-width
   * @ojdisplayname Max Width
   * @ojstylesetitems ["form-control-max-width.oj-form-control-max-width-sm", "form-control-max-width.oj-form-control-max-width-md"]
   * @ojstylerelation exclusive
   * @memberof oj.ojComboboxOne
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-combobox-one class="oj-form-control-max-width-md">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   * &lt;/oj-combobox-one>
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-sm
   * @ojshortdesc Sets the max width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojComboboxOne
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-md
   * @ojshortdesc Sets the max width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojComboboxOne
   */

  // ---------------- oj-form-control width --------------
  /**
   * In the Redwood theme the default width of a text field is 100%.
   * These width convenience classes are available to create a medium or small field.<br>
   * The class is applied to the root element.
   * @ojstyleset form-control-width
   * @ojdisplayname Width
   * @ojstylesetitems ["form-control-width.oj-form-control-width-sm", "form-control-width.oj-form-control-width-md"]
   * @ojstylerelation exclusive
   * @memberof oj.ojComboboxOne
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-combobox-one class="oj-form-control-width-md">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   * &lt;/oj-combobox-one>
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-sm
   * @ojshortdesc Sets the width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojComboboxOne
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-md
   * @ojshortdesc Sets the width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojComboboxOne
   */

  // ---------------- oj-form-control-text-align- --------------
  /**
   * Classes that help align text of the element.
   * @ojstyleset text-align
   * @ojdisplayname Text Alignment
   * @ojstylesetitems ["text-align.oj-form-control-text-align-right", "text-align.oj-form-control-text-align-start", "text-align.oj-form-control-text-align-end"]
   * @ojstylerelation exclusive
   * @memberof oj.ojComboboxOne
   * @ojtsexample
   * &lt;oj-combobox-one class="oj-form-control-text-align-right">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-combobox-one>
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-right
   * @ojshortdesc Aligns the text to the right regardless of the reading direction. This is normally used for right aligning numbers.
   * @ojdisplayname Align-Right
   * @memberof! oj.ojComboboxOne
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-start
   * @ojshortdesc Aligns the text to the left in LTR and to the right in RTL.
   * @ojdisplayname Align-Start
   * @memberof! oj.ojComboboxOne
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-end
   * @ojshortdesc Aligns the text to the right in LTR and to the left in RTL.
   * @ojdisplayname Align-End
   * @memberof! oj.ojComboboxOne
   */

  //-----------------------------------------------------
  //                   ComboboxMany
  //-----------------------------------------------------
  /**
   * @ojcomponent oj.ojComboboxMany
   * @augments oj.ojCombobox
   * @since 0.6.0
   * @ojdisplayname Combobox (Many)
   * @ojshortdesc A combobox many is a dropdown list that supports multiple selections, text input, and search filtering.
   * @ojrole combobox
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojComboboxMany<K, D, V= any> extends ojCombobox<Array<V>, ojComboboxManySettableProperties<K, D, V>, Array<V>, Array<string>>",
   *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}
   *                ,{"name": "V", "description": "Type of each item in the value of the component"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojComboboxManySettableProperties<K, D, V= any> extends ojComboboxSettableProperties<Array<V>>",
   *                for: "SettableProperties"
   *               }
   *              ]
   *
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "required", "disabled"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value", "options"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-text-input-combo-many'
   *
   * @classdesc
   * <h3 id="comboboxManyOverview-section">
   *   JET Combobox Many
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#comboboxManyOverview-section"></a>
   * </h3>
   * <p>Description: JET Combobox Many provides support for multi-select, text input, and search filtering.</p>
   *
   * <p>Inline options allow you to configure dropdown content with minimal effort. Adding start and end icons can be done directly in markup. However, this approach fully realizes every option into live DOM and is thus not suitable for large data. Inline options also do not support dynamic content.
   * </p>
   * </p>For medium-sized static content or cases where the set of options can only be computed at runtime while initializing the component (and is not subject to further modification), using oj-bind-for-each bound to a simple (non-observable) Array is more convenient than manually inlining each option. However, just like directly specifying inline options, this approach is not suitable for large or dynamic data.
   * </p>
   * <p>For cases where the data is large or dynamic, options should be specified using a DataProvider. This approach will limit the amount of live DOM, regardless of data size, and is also capable of reacting to changes in data. However, configuring dropdown content may require more work than the previous approaches.
   * </p>
   *
   * <p>A JET Combobox Many can be created with the following markup.</p>
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-combobox-many>
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-combobox-many>
   * </code></pre>
   *
   * <p>A JET Combobox Many can be created with a DataProvider.</p>
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-combobox-many options="[[dataprovider]]">
   * &lt;/oj-combobox-many>
   * </code></pre>
   *
   * <p>See the Combobox many demo for inline options and DataProvider usage.</p>
   *
   * {@ojinclude "name":"selectComboDifferences"}
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
   * <h3 id="perf-section">
   *   Performance
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
   * </h3>
   *
   * <h4>Page Load</h4>
   * <p>If the <a href="#options">options</a> attribute is a data provider, and if there are initially selected values, setting the <a href="#valueOptions">valueOptions</a> attribute initially can improve page load performance because the element will not have to fetch the selected labels from the data provider.</p>
   * <p>When using a data provider, the dropdown data isn't fetched until the user opens the dropdown.</p>
   *
   *
   * {@ojinclude "name":"comboboxCommon"}
   */

  //-----------------------------------------------------
  //                   Styles ComboboxMany
  //-----------------------------------------------------

  // ---------------- oj-form-control-full-width --------------
  /**
   * Changes the max-width to 100% so that form components will occupy all the available horizontal space.
   * @ojstyleclass oj-form-control-full-width
   * @ojdisplayname Full Width
   * @memberof oj.ojComboboxMany
   * @ojtsexample
   * &lt;oj-combobox-many class="oj-form-control-full-width">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-combobox-many>
   */

  // ---------------- oj-form-control max-width --------------
  /**
   * In the Redwood theme the default max width of a text field is 100%.
   * These max width convenience classes are available to create a medium or small field.<br>
   * The class is applied to the root element.
   * @ojstyleset form-control-max-width
   * @ojdisplayname Max Width
   * @ojstylesetitems ["form-control-max-width.oj-form-control-max-width-sm", "form-control-max-width.oj-form-control-max-width-md"]
   * @ojstylerelation exclusive
   * @memberof oj.ojComboboxMany
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-combobox-many class="oj-form-control-max-width-md">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   * &lt;/oj-combobox-many>
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-sm
   * @ojshortdesc Sets the max width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojComboboxMany
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-md
   * @ojshortdesc Sets the max width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojComboboxMany
   */

  // ---------------- oj-form-control width --------------
  /**
   * In the Redwood theme the default width of a text field is 100%.
   * These width convenience classes are available to create a medium or small field.<br>
   * The class is applied to the root element.
   * @ojstyleset form-control-width
   * @ojdisplayname Width
   * @ojstylesetitems ["form-control-width.oj-form-control-width-sm", "form-control-width.oj-form-control-width-md"]
   * @ojstylerelation exclusive
   * @memberof oj.ojComboboxMany
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-combobox-many class="oj-form-control-width-md">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   * &lt;/oj-combobox-many>
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-sm
   * @ojshortdesc Sets the width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojComboboxMany
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-md
   * @ojshortdesc Sets the width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojComboboxMany
   */

  // ---------------- oj-form-control-text-align- --------------
  /**
   * Classes that help align text of the element.
   * @ojstyleset text-align
   * @ojdisplayname Text Alignment
   * @ojstylesetitems ["text-align.oj-form-control-text-align-right", "text-align.oj-form-control-text-align-start", "text-align.oj-form-control-text-align-end"]
   * @ojstylerelation exclusive
   * @memberof oj.ojComboboxMany
   * @ojtsexample
   * &lt;oj-combobox-many class="oj-form-control-text-align-right">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-combobox-many>
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-right
   * @ojshortdesc Aligns the text to the right regardless of the reading direction. This is normally used for right aligning numbers.
   * @ojdisplayname Align-Right
   * @memberof! oj.ojComboboxMany
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-start
   * @ojshortdesc Aligns the text to the left in LTR and to the right in RTL.
   * @ojdisplayname Align-Start
   * @memberof! oj.ojComboboxMany
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-end
   * @ojshortdesc Aligns the text to the right in LTR and to the left in RTL.
   * @ojdisplayname text-Align-End
   * @memberof! oj.ojComboboxMany
   */

  //-----------------------------------------------------
  //                   Abstract Combobox
  //-----------------------------------------------------
  /**
   * @ojcomponent oj.ojCombobox
   * @augments oj.editableValue
   * @ojimportmembers oj.ojDisplayOptions
   * @since 0.6.0
   * @abstract
   * @ojsignature [{
   *                target: "Type",
   *                value: "abstract class ojCombobox<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV=V, RV=V> extends editableValue<V, SP, SV, RV>"
   *               },
   *               {
   *                target: "Type",
   *                value: "ojComboboxSettableProperties<V, SV= V, RV= V> extends editableValueSettableProperties<V, SV, RV>",
   *                for: "SettableProperties"
   *               }
   *              ]
   *
   * @hideconstructor
   * @classdesc
   */

  //-----------------------------------------------------
  //                   Fragments Combobox
  //-----------------------------------------------------
  /**
   *
   * <h3 id="rtl-section">
   *   Reading direction
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
   * </h3>
   *
   * <p>As with any JET element, in the unusual case that the directionality (LTR or RTL) changes post-init, the Combobox must be <code class="prettyprint">refresh()</code>ed.</p>
   *
   *
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
   * <p>
   * The element will decorate its associated label with required and help
   * information, if the <code>required</code> and <code>help</code> attributes are set.
   * </p>
   * <p>
   * {@ojinclude "name":"accessibilityLabelEditableValue"}
   * {@ojinclude "name":"accessibilityPlaceholderEditableValue"}
   * {@ojinclude "name":"accessibilityDisabledEditableValue"}
   * </p>
   *
   * @ojfragment comboboxCommon
   * @memberof oj.ojCombobox
   */
  /**
   * <h3 id="diff-section">
   *   Differences between Select and Combobox components
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#diff-section"></a>
   * </h3>
   *
   * <p>
   * oj-select-* components and oj-combobox-* components may look and feel similar,
   * but these components are different and are intended for very different use cases.
   * </p>
   *
   * <p>
   * While oj-select-* components allow one to filter the data in the dropdown,
   * it is not possible to enter values that are not available in the data.
   * This makes oj-select-* components ideal for usecases where the user can only
   * select values that are available in the dropdown, but not provide custom
   * values of their own.
   * </p>
   *
   * <p>
   * In contrast, oj-combobox-* components allow one to enter new values that are
   * not available in the data in addition to using the text field for filtering dropdown data.
   * This makes oj-combobox-* components ideal for usecases where the users can provide
   * custom values in addition to those that are already available in the dropdown data.
   * </p>
   *
   * <p>
   * Application developers should consider the above differences when choosing between
   * Select and Combobox components.
   * Additionally, applications are advised to use oj-select-single instead of the deprecated oj-select-one.
   * </p>
   *
   * @ojfragment selectComboDifferences
   * @memberof oj.ojCombobox
   */
  oj.__registerWidget('oj.ojCombobox', $.oj.editableValue, {
    defaultElement: '<input>',
    widgetEventPrefix: 'oj',
    options: {
      /**
         * {@ojinclude "name":"comboboxCommonAsyncValidators"}
         *
         * @example <caption>Create an Object that duck-types the oj.AsyncValidator interface.
         * Bind the Object to the JET form component's async-validators attribute. The
         * validator's 'validate' method will be called when the user changes the input.</caption>
         *  self.asyncValidator1 = {
         *    // required validate method
         *    'validate': function(value) {
         *      return new Promise(function(resolve, reject) {
         *        var successful = someBackendMethod();
         *        if (successful) {
         *          resolve(true);
         *        } else {
         *          reject(new Error('The options are incorrect.'));
         *        }
         *      });
         *    },
         *    // optional hint attribute. hint shows up when user sets focus to input.
         *    'hint': new Promise(function (resolve, reject) {
         *      var backendHint = getSomeBackendHint();
         *      resolve(backendHint);
         *    });
         *  };
         *  -- HTML --
         *  &lt;oj-combobox-one async-validators="[[[asyncValidator1]]]">&lt;/oj-combobox-one>
         * @example <caption>Initialize the component with multiple AsyncValidator
         * duck-typed instances:</caption>
         * -- HTML --
         * &lt;oj-combobox-one
                    async-validators="[[[asyncValidator1, asyncValidator2]]]">&lt;/oj-combobox-one>
         *
         * @example <caption>Get or set the <code class="prettyprint">asyncValidators</code>
         * property after initialization:</caption>
         * // getter
         * var validators = myComp.asyncValidators;
         *
         * // setter
         * var myValidators = [{
         * 'validate' : function(value) {
         *   return new Promise(function(resolve, reject) {
         *   // mock server-side delay
         *   setTimeout(function () {
         *     if (valuePassesValidation) {
         *       resolve(true);
         *     } else {
         *       reject(new Error('the options are incorrect'));
         *     }
         *   },10);
         *   });
         * }
         * }];
         * myComp.asyncValidators = myValidators;
         * @ojdeprecated {since: '8.0.0', description: 'Use the validators property instead for either regular Validators or AsyncValidators.'}
         * @name asyncValidators
         * @ojshortdesc Specifies a list of asynchronous validators used by the component when performing validation. Use async-validators when you need to perform some validation work on the server. See the Help documentation for more information.
         * @expose
         * @access public
         * @instance
         * @memberof oj.ojComboboxOne
         * @default []
         * @ojsignature  { target: "Type",
         *       value: "Array<oj.AsyncValidator<V>>",
         *       jsdocOverride: true}
         * @type {Array.<Object>}
         */
      /**
         * {@ojinclude "name":"comboboxCommonAsyncValidators"}
         *
         * @example <caption>Create an Object that duck-types the oj.AsyncValidator interface.
         * Bind the Object to the JET form component's async-validators attribute. The
         * validator's 'validate' method will be called when the user changes the input.</caption>
         *  self.asyncValidator1 = {
         *    // required validate method
         *    'validate': function(value) {
         *      return new Promise(function(resolve, reject) {
         *        var successful = someBackendMethod();
         *        if (successful) {
         *          resolve(true);
         *        } else {
         *          reject(new Error('The amount of purchase is too high. It is ' + value));
         *        }
         *      });
         *    },
         *    // optional hint attribute. hint shows up when user sets focus to input.
         *    'hint': new Promise(function (resolve, reject) {
         *      var formattedMaxPurchase = getSomeBackendFormattedMaxPurchase();
         *      resolve(maxPurchase + " is the maximum.");
         *    });
         *  };
         *  -- HTML --
         *  &lt;oj-combobox-many async-validators="[[[asyncValidator1]]]">&lt;/oj-combobox-many>
         * @example <caption>Initialize the component with multiple AsyncValidator
         * duck-typed instances:</caption>
         * -- HTML --
         * &lt;oj-combobox-many
                    async-validators="[[[asyncValidator1, asyncValidator2]]]">&lt;/oj-combobox-many>
         *
         * @example <caption>Get or set the <code class="prettyprint">asyncValidators</code>
         * property after initialization:</caption>
         * // getter
         * var validators = myComp.asyncValidators;
         *
         * // setter
         * var myValidators = [{
         * 'validate' : function(value) {
         *   return new Promise(function(resolve, reject) {
         *   // mock server-side delay
         *   setTimeout(function () {
         *     if (value === "pass" || value === "another pass") {
         *       resolve(true);
         *     } else {
         *       reject(new Error("value isn't 'pass' or 'another pass'. It is " + value.));
         *     }
         *   },10);
         *   });
         * }
         * }];
         * myComp.asyncValidators = myValidators;
         * @ojdeprecated {since: '8.0.0', description: 'Use the validators property instead for either regular Validators or AsyncValidators.'}
         * @name asyncValidators
         * @ojshortdesc Specifies a list of asynchronous validators used by the component when performing validation. Use async-validators when you need to perform some validation work on the server. See the Help documentation for more information.
         * @expose
         * @access public
         * @instance
         * @memberof oj.ojComboboxMany
         * @default []
         * @ojsignature  { target: "Type",
         *       value: "Array<oj.AsyncValidator<Array<V>>>",
         *       jsdocOverride: true}
         * @type {Array.<Object>}
         */
      /**
       * List of asynchronous validators used by the component when performing validation.
       * Use <code class="prettyprint">async-validators</code> when you need to
       * perform some validation work on the server. Otherwise, use
       * <code class="prettyprint">validators</code>, which are synchronous.
       * <p>
       * Each item in the Array is an instance that duck types {@link oj.AsyncValidator}.
       * Implicit validators created by a component when certain attributes
       * are present (e.g. <code class="prettyprint">required</code> attribute) are separate from
       * validators specified through the <code class="prettyprint">async-validators</code>
       * attribute and the <code class="prettyprint">validators</code> attribute.
       * At runtime when the component runs validation, it
       * combines the implicit validators with the list specified through the
       * <code class="prettyprint">validators</code>
       * attribute and also the list specified through the
       * <code class="prettyprint">async-validators</code> attribute.
       * Error messages are shown as soon as each async validator returns;
       * we do not wait until all the async validators finish to show errors.
       * If the component's valid state changes for the worse, it is also updated
       * as each validator returns so valid will be invalidShown
       * as soon as the first validator has an Error.
       * </p>
       * <p> It is recommended that you show the
       * value you are validating in the error message because if the async operation takes a while,
       * the user could be typing in a new value when the error message comes back
       * and might be confused what value the error is for. However, if the user enters a new value
       * (like presses Enter or Tab), a new validation lifecycle will start
       * and validation errors for the previous value will not be shown to the user.
       * If you need to format the value for the error message,
       * you can use e.g. for number
       * <code class="prettyprint">new NumberConverter.IntlNumberConverter(converterOption)</code>
       * to get the converter instance,
       * then call <code class="prettyprint">converter.format(value)</code>.
       * </p>
       * <p>
       * Hints exposed by validators are shown inline by default in the Redwood theme when the
       * field has focus.
       * In the Alta theme, validator hints are shown in a notewindow on focus,
       * or as determined by the
       * 'validatorHint' property set on the <code class="prettyprint">display-options</code>
       * attribute.
       * In either theme, you can turn off showing validator hints by using the
       * 'validatorHint' property set to 'none' on the <code class="prettyprint">display-options</code>
       * attribute.
       * </p>
       * <p>Since async validators are run asynchronously, you should wait on the BusyContext before
       * you check valid property or the value property. Alternatively you can add a callback to
       * the validChanged or valueChanged events.
       * </p>
       * <p>
       * The steps performed always, running validation and clearing messages is the same as
       * for the <code class="prettyprint">validators</code> attribute.
       * </p>
       * <br/>
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojCombobox
       * @default []
       * @ojfragment comboboxCommonAsyncValidators
       */
      asyncValidators: [],
      /**
       * {@ojinclude "name":"comboboxCommonConverter"}
       *
       * @example <caption>Initialize the Combobox with a number converter instance:</caption>
       * &lt;oj-combobox-one converter="[[salaryConverter]]">&lt;/oj-combobox-one><br/>
       * // Initialize converter instance using currency options
       * var options = {style: 'currency', 'currency': 'USD', maximumFractionDigits: 0};
       * var salaryConverter = new NumberConverter(options);
       * @example <caption>Initialize the Combobox with converter object literal:</caption>
       * &lt;oj-combobox-one converter='{"type": "number", "options": {"style": "decimal"}}'>&lt;/oj-combobox-one>
       * @example <caption>Get or set the <code class="prettyprint">converter</code>
       *  property after initialization:</caption>
       * // getter
       * var converter = myComp.converter;
       *
       * // setter
       * myComp.converter = myConverter;
       *
       * @name converter
       * @ojshortdesc An object that converts the value. See the Help documentation for more information.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojComboboxOne
       * @ojsignature [{
       *    target: "Type",
       *    value: "oj.Converter<V>|
       *            null",
       *    jsdocOverride: true},
       * {
       *    target: "Type",
       *    value: "Promise<oj.Converter<V>>|oj.Converter<V>|
       *            oj.Validation.RegisteredConverter|
       *            null",
       *    consumedBy: 'tsdep'}]
       * @ojdeprecated {since: '8.0.0', target: 'memberType', value: ['oj.Validation.RegisteredConverter'],
       *                description:'Defining a converter with an object literal with converter type and its options
       *                  (aka JSON format) has been deprecated and does nothing. If needed, you can make the JSON format
       *                  work again by importing the deprecated module you need, like ojvalidation-base.'}
       * @ojdeprecated {since: '17.0.0', target: 'memberType', value: ['Promise<oj.Converter<V>>'],
       *                description: 'Defining a Promise to a Converter instance has been deprecated. The application should resolve the promise and then update the converter attribute with the resolved converter instance.'}
       * @type {Object|null}
       * @default null
       */
      /**
       * {@ojinclude "name":"comboboxCommonConverter"}
       *
       * @example <caption>Initialize the Combobox with a number converter instance:</caption>
       * &lt;oj-combobox-many converter="[[salaryConverter]]">&lt;/oj-combobox-many><br/>
       * // Initialize converter instance using currency options
       * var options = {style: 'currency', 'currency': 'USD', maximumFractionDigits: 0};
       * var salaryConverter = new NumberConverter(options);
       *
       * @example <caption>Initialize the Combobox with converter object literal:</caption>
       * &lt;oj-combobox-many converter='{"type": "number", "options": {"style": "decimal"}}'>&lt;/oj-combobox-many>
       * @example <caption>Get or set the <code class="prettyprint">converter</code>
       *  property after initialization:</caption>
       * // getter
       * var converter = myComp.converter;
       *
       * // setter
       * myComp.converter = myConverter;
       *
       * @name converter
       * @ojshortdesc An object that converts the value. See the Help documentation for more information.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojComboboxMany
       * @ojsignature [{
       *    target: "Type",
       *    value: "oj.Converter<V>|
       *            null",
       *    jsdocOverride: true},
       * {
       *    target: "Type",
       *    value: "Promise<oj.Converter<V>>|oj.Converter<V>|
       *            oj.Validation.RegisteredConverter|
       *            null",
       *    consumedBy: 'tsdep'}]
       * @ojdeprecated {since: '8.0.0', target: 'memberType', value: ['oj.Validation.RegisteredConverter'],
       *                description:'Defining a converter with an object literal with converter type and its options
       *                  (aka JSON format) has been deprecated and does nothing. If needed, you can make the JSON format
       *                  work again by importing the deprecated module you need, like ojvalidation-base.'}
       * @ojdeprecated {since: '17.0.0', target: 'memberType', value: ['Promise<oj.Converter<V>>'],
       *                description: 'Defining a Promise to a Converter instance has been deprecated. The application should resolve the promise and then update the converter attribute with the resolved converter instance.'}
       * @type {Object|null}
       * @default null
       */
      /**
       * <p>A converter instance or one that duck types {@link oj.Converter}.</p>
       * <p>
       * In combobox, the converter is used to parse/format the values entered by the user in the text field
       * while the dropdown items will be unaffected.
       * </p>
       * <p>
       * Please note that the option items provided will not be formatted using the converter. The text provided by the label property
       * (or the property specified by the <a href="#optionsKeys.label">options-keys.label</a> api) of the option item
       * or in case of the inline options the text provided in the <code class="prettyprint">&lt;oj-option&gt;</code>
       * will be used for the display label of the option items in the dropdown.
       * <br/>
       * Similarly, when an option from the dropdown is selected, the value and the label will be used as it
       * appears in the data. This applies to both for rendering the selected item in the UI as well as for populating the
       * <code class="prettyprint">valueOption</code> or <code class="prettyprint">valueOptions</code> property.
       * In order to have consistent formatting, it is recommended that the app developers
       * use the same converter instance to format the options.
       * </p>
       * <p>
       * The hint exposed by the converter is shown inline by default in the Redwood theme when
       * the field has focus.
       * In the Alta theme, converter hints are shown in a notewindow on focus,
       * or as determined by the
       * 'converterHint' property set on the <code class="prettyprint">display-options</code>
       * attribute.
       * In either theme, you can turn off showing converter hints by using the
       * 'converterHint' property set to 'none' on the <code class="prettyprint">display-options</code>
       * attribute.
       * </p>
       * <p>
       * In the Redwood theme, only one hint shows at a time, so the precedence rules are:
       * help.instruction shows; if no help.instruction then validator hints show;
       * if none, then help-hints.definition shows; if none, then converter hint shows.
       * help-hints.source always shows along with the other help or hint.
       * </p>
       * When <code class="prettyprint">converter</code> property changes due to programmatic
       * intervention, the element performs various tasks based on the current state it is in.
       * <h4>Steps Performed Always</h4>
       * <ul>
       * <li>Any cached converter instance is cleared and new converter created. The converter hint is
       * pushed to messaging. E.g., notewindow displays the new hint(s).
       * </li>
       * </ul>
       *
       * <h4>Running Validation</h4>
       * <ul>
       * <li>if element is valid when <code class="prettyprint">converter</code> property changes, the
       * display value is refreshed.</li>
       * <li>if element is invalid and is showing messages when
       * <code class="prettyprint">converter</code> property changes, then all messages generated by the
       * element are cleared and full validation run using its current display value.
       * <ul>
       *   <li>if there are validation errors, then <code class="prettyprint">value</code>
       *   property is not updated, and the errors are shown. The display value is not refreshed in this case. </li>
       *   <li>if no errors result from the validation, <code class="prettyprint">value</code>
       *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
       *   event on the <code class="prettyprint">value</code> property to clear custom errors. The
       *   display value is refreshed with the formatted value provided by converter.</li>
       * </ul>
       * </li>
       * <li>if element is invalid and has deferred messages when
       * <code class="prettyprint">converter</code> property changes, then the display value is
       * refreshed with the formatted value provided by converter.</li>
       * </ul>
       * </p>
       *
       * <h4>Clearing Messages</h4>
       * <ul>
       * <li>When element messages are cleared in the cases described above, messages created by
       * the element are cleared.</li>
       * <li><code class="prettyprint">messages-custom</code> property is not cleared. Page authors can
       * choose to clear it explicitly when setting the converter property.</li>
       * </ul>
       * </p>
       *
       * @ojshortdesc An object that converts the value. See the Help documentation for more information.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojCombobox
       * @ojfragment comboboxCommonConverter
       */
      converter: null,

      /**
       * Whether to filter the list with the current display value on opening the drop down. This can be used to support search use cases.
       * This only applies to the initial opening of the drop down. When the user starts typing, the dropdown filters as usual.
       *
       * @example <caption>Initialize the combobox with the <code class="prettyprint">filter-on-open</code> attribute specified:</caption>
       * &lt;oj-combobox-one filter-on-open="rawValue">&lt;/oj-combobox-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">filter-on-open</code> property after initialization:</caption>
       * // getter
       * var filterOnOpenValue = myCombobox.filterOnOpen;
       *
       * // setter
       * myCombobox.filterOnOpen = "rawValue";
       *
       * @ojshortdesc Whether to filter the drop down list on open.
       * @expose
       * @instance
       * @memberof oj.ojComboboxOne
       * @type {string}
       * @since 4.2.0
       *
       * @ojvalue {string} "none"  Show all available options without filtering on open.
       * @ojvalue {string} "rawValue" Filter the drop down list on open with the rawValue (current display value).
       * @default "none"
       */
      filterOnOpen: 'none',

      /**
       * {@ojinclude "name":"comboboxCommonLabelledBy"}
       * @name labelledBy
       * @expose
       * @ojshortdesc The oj-label sets the labelledBy property
       * programmatically on the form component.
       * @type {string|null}
       * @default null
       * @since 7.0.0
       * @access public
       * @instance
       * @memberof oj.ojComboboxMany
       */
      /**
       * {@ojinclude "name":"comboboxCommonLabelledBy"}
       * @name labelledBy
       * @expose
       * @ojshortdesc The oj-label sets the labelledBy property
       * programmatically on the form component.
       * @type {string|null}
       * @default null
       * @since 7.0.0
       * @access public
       * @instance
       * @memberof oj.ojComboboxOne
       */
      /**
       * <p>
       * The oj-label sets the labelledBy property programmatically on the form component
       * to make it easy for the form component to find its oj-label component (a
       * document.getElementById call.)
       * </p>
       * <p>
       * The application developer should use the 'for'/'id api
       * to link the oj-label with the form component;
       * the 'for' on the oj-label to point to the 'id' on the input form component.
       * This is the most performant way for the oj-label to find its form component.
       * </p>
       *
       * // setter
       * myComp.labelledBy = "labelId";
       *
       * @expose
       * @ojshortdesc The oj-label sets the labelledBy property
       * programmatically on the form component.
       * @type {string|null}
       * @default null
       * @since 7.0.0
       * @access public
       * @instance
       * @memberof oj.ojCombobox
       * @ojfragment comboboxCommonLabelledBy
       */
      labelledBy: null,
      /**
       * The placeholder text to set on the element. The placeholder specifies a short hint that can be displayed before user
       * selects or enters a value.
       *
       * @example <caption>Initialize the combobox with the <code class="prettyprint">placeholder</code> attribute specified:</caption>
       * &lt;oj-combobox-one placeholder="Please select ...">&lt;/oj-combobox-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">placeholder</code> property after initialization:</caption>
       * // getter
       * var placeholderValue = myCombobox.placeholder;
       *
       * // setter
       * myCombobox.placeholder = "Select a value";
       *
       * @name placeholder
       * @ojshortdesc A short hint that can be displayed before user selects or enters a value.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojComboboxOne
       * @type {string|null}
       * @default null
       * @ojtranslatable
       */
      /**
       * The placeholder text to set on the element. The placeholder specifies a short hint that can be displayed before user
       * selects or enters a value.
       *
       * @example <caption>Initialize the combobox with the <code class="prettyprint">placeholder</code> attribute specified:</caption>
       * &lt;oj-combobox-many placeholder="Please select ...">&lt;/oj-combobox-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">placeholder</code> property after initialization:</caption>
       * // getter
       * var placeholderValue = myCombobox.placeholder;
       *
       * // setter
       * myCombobox.placeholder = "Select values";
       *
       * @name placeholder
       * @ojshortdesc A short hint that can be displayed before user selects or enters a value.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojComboboxMany
       * @type {string|null}
       * @default null
       * @ojtranslatable
       */
      placeholder: null,

      /**
       * @typedef {Object} oj.ojCombobox.Option
       * @property {boolean=} disabled Option item is disabled.
       * @property {string=} label The display label for the option item. If it's missing, string(value) will be used.
       * @property {any} value The value of the option item.
       */
      /**
       * @typedef {Object} oj.ojCombobox.Optgroup
       * @property {boolean=} disabled Option group is disabled.
       * @property {string} label The display label for the option group.
       * @property {Array.<Object>} children The Option or Optgroup children.
       * @ojsignature { target: "Type", value: "Array.<oj.ojCombobox.Option|oj.ojCombobox.Optgroup>", for: "children", jsdocOverride: true}
       */
      /**
       * {@ojinclude "name":"comboboxCommonOptions"}
       * @name options
       * @ojshortdesc The option items for the Combobox.
       * @expose
       * @access public
       * @instance
       * @type {Array.<Object>|Object|null}
       * @ojsignature { target: "Type",
       *                value: "Array<oj.ojCombobox.Option|oj.ojCombobox.Optgroup>|DataProvider<K, D>|null",
       *                jsdocOverride: true}
       * @default null
       * @memberof oj.ojComboboxOne
       *
       * @example <caption>Initialize the Combobox with the <code class="prettyprint">options</code> specified:</caption>
       * &lt;oj-combobox-one options="[[dataArray]]">&lt;/oj-combobox-one>
       *
       * @example <caption>The options array should contain objects with value and label properties:</caption>
       * var dataArray = [{value: 'option1', label: 'Option 1'},
       *                  {value: 'option2', label: 'Option 2', disabled: true},
       *                  {value: 'option3', label: 'Option 3'}];
       *
       * @example <caption>Initialize the Combobox with a data provider and data mapping:</caption>
       * &lt;oj-combobox-one options="[[dataProvider]]">&lt;/oj-combobox-one>
       *
       * @example <caption>Data mapping can be used if data doesn't have value and label properties.</caption>
       * // actual field names are "id" and "name"
       * var dataArray = [
       *            {id: 'Id 1', name: 'Name 1'},
       *            {id: 'Id 2', name: 'Name 2'},
       *            {id: 'Id 3', name: 'Name 3'}];
       *
       * // In mapfields, map "name" to "label" and "id" to "value"
       * var mapFields = function(item) {
       *   var data = item['data'];
       *   var mappedItem = {};
       *   mappedItem['data'] = {};
       *   mappedItem['data']['label'] = data['name'];
       *   mappedItem['data']['value'] = data['id'];
       *   mappedItem['metadata'] = {'key': data['id']};
       *   return mappedItem;
       * };
       * var dataMapping = {'mapFields': mapFields};
       *
       * var arrayDataProvider = new oj.ArrayDataProvider(dataArray, {keyAttributes: 'id'});
       * var dataProvider = new oj.ListDataProviderView(arrayDataProvider, {'dataMapping': dataMapping});
       */
      /**
       * {@ojinclude "name":"comboboxCommonOptions"}
       * @name options
       * @ojshortdesc The option items for the Combobox.
       * @expose
       * @access public
       * @instance
       * @type {Array.<Object>|Object|null}
       *
       * @ojsignature { target: "Type",
       *                value: "Array<oj.ojCombobox.Option|oj.ojCombobox.Optgroup>|DataProvider<K, D>|null",
       *                jsdocOverride: true}
       * @default null
       * @memberof oj.ojComboboxMany
       *
       * @example <caption>Initialize the Combobox with the <code class="prettyprint">options</code> specified:</caption>
       * &lt;oj-combobox-many options="[[dataArray]]">&lt;/oj-combobox-many>
       *
       * @example <caption>The options array should contain objects with value and label properties:</caption>
       * var dataArray = [{value: 'option1', label: 'Option 1'},
       *                  {value: 'option2', label: 'Option 2', disabled: true},
       *                  {value: 'option3', label: 'Option 3'}];
       *
       * @example <caption>Initialize the Combobox with a data provider and data mapping:</caption>
       * &lt;oj-combobox-many options="[[dataProvider]]">&lt;/oj-combobox-many>
       *
       * @example <caption>Data mapping can be used if data doesn't have value and label properties.</caption>
       * // actual field names are "id" and "name"
       * var dataArray = [
       *            {id: 'Id 1', name: 'Name 1'},
       *            {id: 'Id 2', name: 'Name 2'},
       *            {id: 'Id 3', name: 'Name 3'}];
       *
       * // In mapfields, map "name" to "label" and "id" to "value"
       * var mapFields = function(item) {
       *   var data = item['data'];
       *   var mappedItem = {};
       *   mappedItem['data'] = {};
       *   mappedItem['data']['label'] = data['name'];
       *   mappedItem['data']['value'] = data['id'];
       *   mappedItem['metadata'] = {'key': data['id']};
       *   return mappedItem;
       * };
       * var dataMapping = {'mapFields': mapFields};
       *
       * var arrayDataProvider = new oj.ArrayDataProvider(dataArray, {keyAttributes: 'id'});
       * var dataProvider = new oj.ListDataProviderView(arrayDataProvider, {'dataMapping': dataMapping});
       */
      /**
       * The option items for the Combobox. This attribute can be used instead of providing a list of <code class="prettyprint">oj-option</code> or <code class="prettyprint">oj-optgroup</code> child elements of the Combobox element.
       * This attribute accepts:
       * <ol>
       * <li>an array of <code class="prettyprint">oj.ojCombobox.Option</code> and/or <code class="prettyprint">oj.ojCombobox.Optgroup</code>.
       *   <ul>
       *   <li>Use <code class="prettyprint">oj.ojCombobox.Option</code> for a leaf option.</li>
       *   <li>Use <code class="prettyprint">oj.ojCombobox.Optgroup</code> for a group option.</li>
       *   </ul>
       * </li>
       * <li>a data provider. This data provider must implement <a href="DataProvider.html">DataProvider</a>.
       *   <ul>
       *   <li><code class="prettyprint">value</code> in <code class="prettyprint">oj.ojCombobox.Option</code> must be the row key in the data provider.</li>
       *   <li>A maximum of 15 rows will be displayed in the dropdown. If more than 15 results are available then users need to filter further.</li>
       *   <li>If the data provider supports the filter criteria capability including the contains (<code class="prettyprint">$co or $regex</code>) operator, JET Combobox will request the data provider to do filtering. Otherwise it will filter internally.</li>
       *   <li>See also <a href="#perf-section">Improve page load performance</a></li>
       *   </ul>
       * </li>
       * </ol>
       *
       * @expose
       * @memberof oj.ojCombobox
       * @instance
       * @ojfragment comboboxCommonOptions
       */
      options: null,

      /**
       * @typedef {Object} oj.ojCombobox.OptionsKeys
       * @property {?string=} label The key name for the label.
       * @property {?string=} value The key name for the value.
       * @property {?string=} children The key name for the children.
       * @property {?Object=} childKeys The object for the child keys.
       * @ojsignature {target:"Type", for:"childKeys", value:"oj.ojCombobox.OptionsKeys", jsdocOverride:true}
       */
      /**
       * {@ojinclude "name":"comboboxCommonOptionsKeys"}
       *
       * @example <caption>Initialize the Combobox with <code class="prettyprint">options-keys</code> specified. This allows the key names to be redefined in the options array.</caption>
       * &lt;oj-combobox-one options-keys="[[optionsKeys]]">&lt;/oj-combobox-one>
       * @example var optionsKeys = {value : "state_abbr", label : "state_name"};
       * @example <caption>Redefine keys for data with subgroups.</caption>
       * var optionsKeys = {label : "regions", children : "states",
       *                    childKeys : {value : "state_abbr", label : "state_name"}};
       * @name optionsKeys
       * @ojshortdesc Specify the key names to use in the options array.  Depending on options-keys means that the signature of the data does not match what is supported by the options attribute.
       * @expose
       * @access public
       * @instance
       * @type {?Object}
       * @default null
       * @memberof oj.ojComboboxOne
       * @ojsignature {target:"Type", value:"oj.ojCombobox.OptionsKeys|null", jsdocOverride:true}
       */
      /**
       * {@ojinclude "name":"comboboxCommonOptionsKeys"}
       *
       * @example <caption>Initialize the Combobox with <code class="prettyprint">options-keys</code> specified. This allows the key names to be redefined in the options array.</caption>
       * &lt;oj-combobox-many options-keys="[[optionsKeys]]">&lt;/oj-combobox-many>
       * @example var optionsKeys = {value : "state_abbr", label : "state_name"};
       * @example <caption>Redefine keys for data with subgroups.</caption>
       * var optionsKeys = {label : "regions", children : "states",
       *                    childKeys : {value : "state_abbr", label : "state_name"}};
       * @name optionsKeys
       * @ojshortdesc Specify the key names to use in the options array.  Depending on options-keys means that the signature of the data does not match what is supported by the options attribute.
       * @expose
       * @access public
       * @instance
       * @type {?Object}
       * @default null
       * @memberof oj.ojComboboxMany
       * @ojsignature {target:"Type", value:"oj.ojCombobox.OptionsKeys|null", jsdocOverride:true}
       */
      /**
       * Specify the key names to use in the options array.
       * <p>Depending on options-keys means that the signature of the data does not match what is supported by the options attribute. When using Typescript, this would result in a compilation error.</p>
       * <p>Best practice is to use a <a href="ListDataProviderView.html">oj.ListDataProviderView</a> with data mapping as a replacement.</p>
       * <p>However, for the app that must fetch data from a REST endpoint where the data fields do not match those that are supported by the options attribute, you may use the options-keys with any dataProvider that implements <a href="DataProvider.html">DataProvider</a> interface.</p>
       * <p>Note: <code class="prettyprint">child-keys</code> and <code class="prettyprint">children</code> properties in <code class="prettyprint">options-keys</code> are ignored when using a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>.</p>
       *
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojCombobox
       * @ojfragment comboboxCommonOptionsKeys
       */
      optionsKeys: {
        /**
         * The key name for the label.
         *
         * @name optionsKeys.label
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojComboboxOne
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The key name for the label.
         *
         * @name optionsKeys.label
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojComboboxMany
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The key name for the value.
         *
         * @name optionsKeys.value
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojComboboxOne
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The key name for the value.
         *
         * @name optionsKeys.value
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojComboboxMany
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The key name for the children. It is ignored when using a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>.
         *
         * @name optionsKeys.children
         * @ojshortdesc The key name for the children. It is ignored when using a TreeDataProvider.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojComboboxOne
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The key name for the children. It is ignored when using a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>.
         *
         * @name optionsKeys.children
         * @ojshortdesc The key name for the children. It is ignored when using a TreeDataProvider.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojComboboxMany
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The object for the child keys. It is ignored when using a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>.
         *
         * @name optionsKeys.childKeys
         * @ojshortdesc The object for the child keys. It is ignored when using a TreeDataProvider.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojComboboxOne
         * @type {?Object}
         * @ojsignature {target:"Type", value:"oj.ojCombobox.OptionsKeys", jsdocOverride:true}
         * @default null
         * @property {?string=} label The key name for the label.
         * @property {?string=} value The key name for the value.
         * @property {?string=} children The key name for the children.
         * @property {?Object=} childKeys The object for the child keys.
         * @ojsignature {target:"Type", for:"childKeys", value:"oj.ojCombobox.OptionsKeys|null", jsdocOverride:true}
         */
        /**
         * The object for the child keys. It is ignored when using a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>.
         *
         * @name optionsKeys.childKeys
         * @ojshortdesc The object for the child keys. It is ignored when using a TreeDataProvider.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojComboboxMany
         * @type {?Object}
         * @ojsignature {target:"Type", value:"oj.ojCombobox.OptionsKeys", jsdocOverride:true}
         * @default null
         * @property {?string=} label The key name for the label.
         * @property {?string=} value The key name for the value.
         * @property {?string=} children The key name for the children.
         * @property {?Object=} childKeys The object for the child keys.
         * @ojsignature {target:"Type", for:"childKeys", value:"oj.ojCombobox.OptionsKeys|null", jsdocOverride:true}
         */
      },

      /**
       * <p>Attributes specified here will be set on the picker DOM element when it's launched.
       * <p>The supported attribute is <code class="prettyprint">class</code>, which is appended to the picker's class, if any.
       * Note: 1) picker-attributes is not applied in the native theme.
       * 2) setting this attribute after element creation has no effect.
       *
       * @property {string=} style The css style to append to the picker.
       * @property {string=} class The css class to append to the picker.
       *
       * @example <caption>Initialize the combobox specifying the class attribute to be set on the picker DOM element:</caption>
       * &lt;oj-combobox-one picker-attributes="[[pickerAttributes]]">&lt;/oj-combobox-one>
       * @example var pickerAttributes = {
       *   "style": "color:blue;",
       *   "class": "my-class"
       * };
       *
       * @name pickerAttributes
       * @ojshortdesc The style attributes for the drop down.
       * @expose
       * @memberof oj.ojComboboxOne
       * @ojdeprecated {target: "property", for: "style", since: "7.0.0", description: "Style property of pickerAttribute is deprecated as it violates the recommended <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy'>Content Security Policy</a> for JET which disallows <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src'>inline styles</a>. Use class property instead. As of 11.0.0 this property is ignored and an error is logged."}
       * @instance
       * @type {?Object}
       * @default null
       */
      /**
       * <p>Attributes specified here will be set on the picker DOM element when it's launched.
       * <p>The supported attribute is <code class="prettyprint">class</code>, which is appended to the picker's class, if any.
       * Note: 1) picker-attributes is not applied in the native theme.
       * 2) setting this attribute after element creation has no effect.
       *
       * @property {string=} style The css style to append to the picker.
       * @property {string=} class The css class to append to the picker.
       *
       * @example <caption>Initialize the combobox specifying the class attribute to be set on the picker DOM element:</caption>
       * &lt;oj-combobox-many picker-attributes="[[pickerAttributes]]">&lt;/oj-combobox-many>
       * @example var pickerAttributes = {
       *   "class": "my-class"
       * };
       *
       * @name pickerAttributes
       * @ojshortdesc The style attributes for the drop down.
       * @expose
       * @memberof oj.ojComboboxMany
       * @ojdeprecated {target: "property", for: "style", since: "7.0.0", description: "Style property of pickerAttribute is deprecated as it violates the recommended <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy'>Content Security Policy</a> for JET which disallows <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src'>inline styles</a>. Use class property instead. As of 11.0.0 this property is ignored and an error is logged."}
       * @instance
       * @type {?Object}
       * @default null
       */
      pickerAttributes: null,

      /**
       * @typedef {Object} oj.ojCombobox.OptionContext
       * @property {Element} componentElement A reference to the combobox element.
       * @property {?Element} parent The parent of the data item. The parent is null for root node.
       * @property {number} index The index of the option, where 0 is the index of the first option. In the hierarchical case the index is relative to its parent.
       * @property {number } depth The depth of the option. The depth of the first level children under the invisible root is 0.
       * @property {boolean} leaf Whether the option is a leaf or a group.
       * @property {Object} data The data object for the option.
       * @property {Element} parentElement The option label element. The renderer can use this to directly append content.
       * @ojsignature [{target: "Type", value: "D", for: "data", jsdocOverride:true},
       *               {target: "Type", value: "<D = any>", for: "genericTypeParameters"}]
       */
      /**
       * {@ojinclude "name":"comboboxCommonOptionRenderer"}
       * @name optionRenderer
       * @ojshortdesc The renderer function that renders the content of each option.
       * @expose
       * @memberof oj.ojComboboxOne
       * @instance
       * @type {null|function(Object):Object}
       * @ojsignature { target: "Type",
       *                value: "?((param0: oj.ojCombobox.OptionContext<D>) => Element)|null",
       *                jsdocOverride: true}
       * @default null
       * @example <caption>Initialize the Combobox with a renderer:</caption>
       * &lt;oj-combobox-one option-renderer="[[optionRenderer]]">&lt;/oj-combobox-one>
       * @example var optionRenderer = function(context) {
       *            var ojOption = document.createElement('oj-option');
       *            // Set the textContent or append other child nodes
       *            ojOption.textContent = context.data['FIRST_NAME'] + ' ' + context.data['LAST_NAME'];
       *            return ojOption;
       *          };
       */
      /**
       * {@ojinclude "name":"comboboxCommonOptionRenderer"}
       * @name optionRenderer
       * @ojshortdesc The renderer function that renders the content of each option.
       * @expose
       * @memberof oj.ojComboboxMany
       * @instance
       * @type {null|function(Object):Object}
       * @ojsignature { target: "Type",
       *                value: "?((param0: oj.ojCombobox.OptionContext<D>) => Element)|null",
       *                jsdocOverride: true}
       * @default null
       * @example <caption>Initialize the Combobox with a renderer:</caption>
       * &lt;oj-combobox-many option-renderer="[[optionRenderer]]">&lt;/oj-combobox-many>
       * @example var optionRenderer = function(context) {
       *            var ojOption = document.createElement('oj-option');
       *            // Set the textContent or append other child nodes
       *            ojOption.textContent = context.data['FIRST_NAME'] + ' ' + context.data['LAST_NAME'];
       *            return ojOption;
       *          };
       */
      /**
       * The renderer function that renders the content of each option.
       * The function should return an oj-option element (for leaf option) or an oj-optgroup element (for group option).
       * <p>It is not necessary to set the "value" attribute on the oj-option as it is available from the options data.</p>
       * <p><b>
       * Note: Prior to version 6.1.0, the function could also return one of the following:
       * <ul>
       *   <li>An Object with the following property:
       *     <ul><li>insert: HTMLElement - A DOM element representing the content of the option.</li></ul>
       *   </li>
       *   <li>undefined: If the developer chooses to manipulate the option content directly, the function should return undefined.</li>
       * </ul>
       * This is deprecated and support may be removed in the future.
       * </b></p>
       *
       * <p>The <code class="prettyprint">option-renderer</code> decides only
       * how the options' content has to be rendered in the drop down.
       * Once an option is selected from the drop down,
       * what value has to be displayed in the in input field is decided by the
       * label field in the data object. See <a href="#options">options</a>
       * and <a href="#optionsKeys">options-keys</a> for configuring option label and value.
       * </p>
       *
       * <p>The context parameter passed to the renderer contains the following keys:</p>
       * <table class="keyboard-table">
       *   <thead>
       *     <tr>
       *       <th>Key</th>
       *       <th>Description</th>
       *     </tr>
       *   </thead>
       *   <tbody>
       *     <tr>
       *       <td><kbd>componentElement</kbd></td>
       *       <td>A reference to the Combobox element.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>parent</kbd></td>
       *       <td>The parent of the data item. The parent is null for root node.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>index</kbd></td>
       *       <td>The index of the option, where 0 is the index of the first option. In the hierarchical case the index is relative to its parent.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>depth</kbd></td>
       *       <td>The depth of the option. The depth of the first level children under the invisible root is 0.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>leaf</kbd></td>
       *       <td>Whether the option is a leaf or a group.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>data</kbd></td>
       *       <td>The data object for the option.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>parentElement</kbd></td>
       *       <td>The option label element.  The renderer can use this to directly append content.</td>
       *     </tr>
       *   </tbody>
       * </table>
       *
       * @expose
       * @memberof oj.ojCombobox
       * @instance
       * @ojfragment comboboxCommonOptionRenderer
       */
      optionRenderer: null,

      /**
       * The minimum number of characters a user must type before a options
       * filtering is performed. Zero is useful for local data with just a few items,
       * but a higher value should be used when a single character search could match a few thousand items.
       *
       * @expose
       * @memberof oj.ojComboboxOne
       * @name minLength
       * @ojshortdesc The minimum number of characters a user must type before search filtering is performed.
       * @instance
       * @type {number}
       * @default 0
       * @ojmin 0
       *
       * @example <caption>Initialize the Combobox with the <code class="prettyprint">min-length</code> attribute specified:</caption>
       * &lt;oj-combobox-one min-length="2">&lt;/oj-combobox-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">minLength</code> property after initialization:</caption>
       * // getter
       * var minLengthValue = myCombobox.minLength;
       *
       * // setter
       * myCombobox.minLength = 3;
       *
       */
      /**
       * The minimum number of characters a user must type before a options
       * filtering is performed. Zero is useful for local data with just a few items,
       * but a higher value should be used when a single character search could match a few thousand items.
       *
       * @expose
       * @memberof oj.ojComboboxMany
       * @name minLength
       * @ojshortdesc The minimum number of characters a user must type before search filtering is performed.
       * @instance
       * @type {number}
       * @default 0
       * @ojmin 0
       *
       * @example <caption>Initialize the Combobox with the <code class="prettyprint">min-length</code> attribute specified:</caption>
       * &lt;oj-combobox-many min-length="2">&lt;/oj-combobox-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">minLength</code> property after initialization:</caption>
       * // getter
       * var minLengthValue = myCombobox.minLength;
       *
       * // setter
       * myCombobox.minLength = 3;
       *
       */
      minLength: 0,

      /**
       * {@ojinclude "name":"comboboxCommonMaximumResultCount"}
       *
       * @example <caption>Initialize the combobox with the <code class="prettyprint">maximum-result-count</code> attribute specified:</caption>
       * &lt;oj-combobox-one maximum-result-count="25">&lt;/oj-combobox-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">maximumResultCount</code> property after initialization:</caption>
       * // getter
       * var maximumResultCount = myCombobox.maximumResultCount;
       *
       * // setter
       * myCombobox.maximumResultCount = 25;
       *
       * @name maximumResultCount
       * @ojshortdesc The maximum number of results displayed in the dropdown.
       * @expose
       * @memberof oj.ojComboboxOne
       * @since 8.0.0
       * @instance
       * @type {number}
       * @default 15
       */
      /**
       * {@ojinclude "name":"comboboxCommonMaximumResultCount"}
       *
       * @example <caption>Initialize the combobox with the <code class="prettyprint">maximum-result-count</code> attribute specified:</caption>
       * &lt;oj-combobox-many maximum-result-count="25">&lt;/oj-combobox-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">maximumResultCount</code> property after initialization:</caption>
       * // getter
       * var maximumResultCount = myCombobox.maximumResultCount;
       *
       * // setter
       * myCombobox.maximumResultCount = 25;
       *
       * @name maximumResultCount
       * @ojshortdesc The maximum number of results displayed in the dropdown.
       * @expose
       * @memberof oj.ojComboboxMany
       * @since 8.0.0
       * @instance
       * @type {number}
       * @default 15
       */
      /**
       * <p>The maximum number of results that will be displayed in the dropdown when the options attribute is bound to a data provider.</p>
       *
       * <p>If more than the maximum number of results are available from data provider then user needs to filter further.
       * A value less than 1 indicates there is no maximum limit and all the results will be fetched and displayed in the dropdown.</p>
       *
       * <p>When the options attribute is bound to a hierarchical data source like a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>,
       * this attribute represents the maximum number of leaf results that will be displayed in the dropdown.</p>
       *
       * <p>Note: This attribute has no effect when the options attribute is bound to an array/observable array or
       * when the component renders an oj-option element or an oj-optgroup element as children.</p>
       *
       * @expose
       * @memberof oj.ojCombobox
       * @instance
       * @ojfragment comboboxCommonMaximumResultCount
       */
      maximumResultCount: 15,

      /**
       * {@ojinclude "name":"comboboxCommonRawValue"}
       *
       * <p>
       * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
       * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed.
       * Consider the above example of combobox. Now, if the user types in 'Edge' into the field,
       * the <code class="prettyprint">rawValue</code> will be 'E', then 'Ed', then 'Edg', and finally 'Edge'.
       * Then when the user blurs or presses Enter the <code class="prettyprint">value</code> property gets
       * converted and validated (if there is a converter or validators) and then gets updated if valid.
       * In this case, without any converter the <code class="prettyprint">value</code> will be updated to 'Edge'.
       * </p>
       * <p>
       * If the user types in 'CH' instead, the <code class="prettyprint">rawValue</code> will be 'C' and then 'CH'.
       * Now, when the user blurs or presses Enter and since the <code class="prettyprint">rawValue</code> now matches
       * one of the keys(values) of the current set of options the <code class="prettyprint">value</code> will be
       * updated to 'CH', while the <code class="prettyprint">rawValue</code> gets updated to 'Chrome' and the user now sees 'Chrome'
       * in the text field.
       * </p>
       * <p>
       * Note that a <code class="prettyprint">rawValueChanged</code> event will be triggered when setting
       * the <code class="prettyprint">value</code> to 'CH' and the event payload will contain the current
       * <code class="prettyprint">rawValue</code> as 'Chrome' and previous <code class="prettyprint">rawValue</code> as 'CH'.
       * </p>
       *
       * @name rawValue
       * @ojshortdesc The currently displayed text retrieved from the input field.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojComboboxOne
       * @type {?string}
       * @default null
       * @since 1.2.1
       * @readonly
       * @ojwriteback
       */
      /**
       * {@ojinclude "name":"comboboxCommonRawValue"}
       *
       * <p>
       * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
       * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed. The
       * <code class="prettyprint">rawValue</code> is always an array when exists and the last element of the
       * array represent the current text typed in the input text field.
       * Consider the above example combobox. Now, if the user types in 'Edge' into the field,
       * the <code class="prettyprint">rawValue</code> will be ['E'], then ['Ed'], then ['Edg'], and finally ['Edge'].
       * Then when the user blurs or presses Enter the <code class="prettyprint">value</code> property gets
       * converted and validated (if there is a converter or validators) and then gets updated if valid.
       * In this case, without any converter the <code class="prettyprint">value</code> will be updated to ['Edge'].
       * </p>
       * <p>
       * Then if the user continues to type in 'CH', the <code class="prettyprint">rawValue</code> will be ['Edge', 'C']
       * and then ['Edge', 'CH']. The rawValue will contains the labels of all the selected values along with the text
       * currently being typed in the text field. Now, when the user blurs or presses Enter and since the
       * text now matches one of the keys(values) of the current set of options the <code class="prettyprint">value</code> will be
       * updated to ['Edge', 'CH'], while the <code class="prettyprint">rawValue</code> gets updated to ['Edge', 'Chrome']
       * and the user now sees two pills 'Edge' and 'Chrome'.
       * </p>
       * <p>
       * Note that a <code class="prettyprint">rawValueChanged</code> event will be triggered when setting
       * the <code class="prettyprint">value</code> and the event payload will contain the current
       * <code class="prettyprint">rawValue</code> as ['Edge', 'Chrome'] and previous
       * <code class="prettyprint">rawValue</code> as ['Edge', 'CH'].
       * </p>
       *
       * @name rawValue
       * @ojshortdesc The currently displayed text retrieved from the input field.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojComboboxMany
       * @type {?Array<string>}
       * @default null
       * @since 1.2.1
       * @readonly
       * @ojwriteback
       */
      /**
       * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving
       * the current value from the input field in string form. The main consumer of
       * <code class="prettyprint">rawValue</code> is a converter.</p>
       * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
       * <p>
       * Consider a combobox with the following options:
       * <pre>
       * <code>
       *   &lt;oj-option value="CH">Chrome&lt;/oj-option>
       *   &lt;oj-option value="FF">Firefox&lt;/oj-option>
       *   &lt;oj-option value="SA">Safari&lt;/oj-option>
       *   &lt;oj-option value="OP">Opera&lt;/oj-option>
       * </code>
       * </pre>
       * </p>
       *
       * @example <caption>Get the <code class="prettyprint">rawValue</code> property after initialization:</caption>
       * // getter
       * var rawValue = myCombobox.rawValue;
       *
       * @ojshortdesc The currently displayed text retrieved from the input field.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojCombobox
       * @ojfragment comboboxCommonRawValue
       */
      rawValue: null,

      /**
       * {@ojinclude "name":"comboboxCommonRequired"}
       *
       * @example <caption>Initialize the Combobox with the <code class="prettyprint">required</code> attribute:</caption>
       * &lt;oj-combobox-one required="[[isRequired]]">&lt;/oj-combobox-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">required</code> property after initialization:</caption>
       * // getter
       * var requiredValue = myCombobox.required;
       *
       * // setter
       * myCombobox.required = true;
       *
       * @name required
       * @ojshortdesc Specifies whether the component is required or optional. See the Help documentation for more information.      * @expose
       * @access public
       * @instance
       * @memberof oj.ojComboboxOne
       * @type {boolean}
       * @default false
       * @since 0.7.0
       * @see #translations
       */
      /**
       * {@ojinclude "name":"comboboxCommonRequired"}
       *
       * @example <caption>Initialize the Combobox with the <code class="prettyprint">required</code> attribute:</caption>
       * &lt;oj-combobox-many required="[[isRequired]]">&lt;/oj-combobox-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">required</code> property after initialization:</caption>
       * // getter
       * var requiredValue = myCombobox.required;
       *
       * // setter
       * myCombobox.required = true;
       *
       * @name required
       * @ojshortdesc Specifies whether the component is required or optional. See the Help documentation for more information.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojComboboxMany
       * @type {boolean}
       * @default false
       * @since 0.7.0
       * @see #translations
       */
      /**
       * <p>
       * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
       * This is the default.
       * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
       * </p>
       * <p>
       * In the Redwood theme, by default, a Required text is rendered inline when the field is empty.
       * If user-assistance-density is 'compact', it will show on the label as an icon.
       * In the Alta theme the input's label will render a required icon.
       * </p>
       * <p>The Required error text is based on Redwood UX designs, and it is not recommended that
       * it be changed.
       * To override the required error message,
       * use the <code class="prettyprint">translations.required</code> attribute.
       * The component's label text is passed in as a token {label} and can be used in the message detail.
       * </p>
       * <p>When required is set to true, an implicit
       * required validator is created, i.e.,
       * <code class="prettyprint">new RequiredValidator()</code>. The required validator is the only
       * validator to run during initial render, and its error is not shown to the user at this time;
       * this is called deferred validation. The required validator also runs during normal validation;
       * this is when the errors are shown to the user.
       * See the <a href="#validation-section">Validation and Messaging</a> section for details.
       * </p>
       * <p>
       * When the <code class="prettyprint">required</code> property changes due to programmatic intervention,
       * the component may clear component messages and run validation, based on the current state it's in. </br>
       *
       * <h4>Running Validation when required property changes</h4>
       * <ul>
       * <li>if component is valid when required is set to true, then it runs deferred validation on
       * the value property. If the field is empty, the valid state is invalidHidden. No errors are
       * shown to the user.
       * </li>
       * <li>if component is invalid and has deferred messages when required is set to false, then
       * component messages are cleared (messages-custom messages are not cleared)
       * but no deferred validation is run because required is false.
       * </li>
       * <li>if component is invalid and currently showing invalid messages when required is set, then
       * component messages are cleared and normal validation is run using the current display value.
       * <ul>
       *   <li>if there are validation errors, then <code class="prettyprint">value</code>
       *   property is not updated and the error is shown.
       *   </li>
       *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
       *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
       *   event on the component to clear custom errors.</li>
       * </ul>
       * </li>
       * </ul>
       *
       * <h4>Clearing Messages when required property changes</h4>
       * <ul>
       * <li>Only messages created by the component, like validation messages, are cleared when the required property changes.</li>
       * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
       * </ul>
       *
       * </p>
       *
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojCombobox
       * @since 0.7.0
       * @see #translations
       * @ojfragment comboboxCommonRequired
       */
      required: false,

      /**
       * Dictates element's readonly state.
       * <p>
       * The default value for readonly is false. However, if the form component is a descendent of
       * <code class="prettyprint">oj-form-layout</code>, the default value for readonly could come from the
       * <code class="prettyprint">oj-form-layout</code> component's readonly attribute.
       * The <code class="prettyprint">oj-form-layout</code> uses the
       * <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
       * <code class="prettyprint">provide</code> property to provide its
       * <code class="prettyprint">readonly</code>
       * attribute value to be consumed by descendent components.
       * The form components are configured to consume the readonly property if an ancestor provides it and
       * it is not explicitly set.
       * For example, if the oj-form-layout's readonly attribute is set to true, and a descendent form component does
       * not have its readonly attribute set, the form component's readonly will be true.
       * </p>
       *
       * @example <caption>Initialize the combobox with the <code class="prettyprint">readonly</code> attribute:</caption>
       * &lt;oj-some-element readonly>&lt;/oj-some-element>
       *
       * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
       * // getter
       * var ro = myComp.readonly;
       *
       * // setter
       * myComp.readonly = false;
       *
       * @name readonly
       * @expose
       * @ojshortdesc Specifies whether the component is read-only. A read-only element cannot be modified, but user interaction is allowed. See the Help documentation for more information.
       * @access public
       * @instance
       * @memberof oj.ojComboboxOne
       * @type {boolean}
       * @default false
       */
      /**
       * Dictates element's readonly state.
       * <p>
       * The default value for readonly is false. However, if the form component is a descendent of
       * <code class="prettyprint">oj-form-layout</code>, the default value for readonly could come from the
       * <code class="prettyprint">oj-form-layout</code> component's readonly attribute.
       * The <code class="prettyprint">oj-form-layout</code> uses the
       * <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
       * <code class="prettyprint">provide</code> property to provide its
       * <code class="prettyprint">readonly</code>
       * attribute value to be consumed by descendent components.
       * The form components are configured to consume the readonly property if an ancestor provides it and
       * it is not explicitly set.
       * For example, if the oj-form-layout's readonly attribute is set to true, and a descendent form component does
       * not have its readonly attribute set, the form component's readonly will be true.
       * </p>
       * @example <caption>Initialize the combobox with the <code class="prettyprint">readonly</code> attribute:</caption>
       * &lt;oj-some-element readonly>&lt;/oj-some-element>
       *
       * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
       * // getter
       * var ro = myComp.readonly;
       *
       * // setter
       * myComp.readonly = false;
       *
       * @name readonly
       * @expose
       * @ojshortdesc Specifies whether the component is read-only. A read-only element cannot be modified, but user interaction is allowed. See the Help documentation for more information.
       * @access public
       * @instance
       * @memberof oj.ojComboboxMany
       * @type {boolean}
       * @default false
       */
      readOnly: false,

      /**
       * {@ojinclude "name":"comboboxCommonValidators"}
       *
       *
       * @example <caption>Initialize the Combobox with validator instance:</caption>
       * &lt;oj-combobox-one validators="[[validators]]">&lt;/oj-combobox-one>
       * @example var validators = [new RegExpValidator({
       *       pattern: '[a-zA-Z0-9]{3,}'
       *     })];
       *
       *
       * @example <caption>Initialize the Combobox with multiple validator instances:</caption>
       * var validator1 = new MyCustomValidator({'foo': 'A'});
       * var validator2 = new MyCustomValidator({'foo': 'B'});
       * var validators = [validator1, validator2];
       * &lt;oj-combobox-one validators="[[validators]]">&lt;/oj-combobox-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">validators</code> property after initialization:</caption>
       * // get one
       * var validator = myCombobox.validators[0];
       *
       * // get all
       * var validators = myCombobox.validators;
       *
       * // set all
       * myCombobox.validators = myValidators;
       *
       * @name validators
       * @ojshortdesc Specifies a list of synchronous validators for performing validation by the element. See the Help documentation for more information.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojComboboxOne
       * @type {Array}
       * @default []
       * @ojsignature  [{ target: "Type",
       *   value: "Array<oj.Validator<V>|oj.AsyncValidator<V>>|null",
       *   jsdocOverride: true},
       * { target: "Type",
       *   value: "Array<oj.Validator<V>|oj.AsyncValidator<V>|
       *       oj.Validation.RegisteredValidator>|null",
       *   consumedBy: 'tsdep'}]
       * @ojdeprecated {since: '8.0.0', target: 'memberType', value: ['oj.Validation.RegisteredValidator'],
       *                description: 'Defining a validator with an object literal with validator type and
       *                  its options (aka JSON format) has been deprecated and does nothing. If needed, you can
       *                  make the JSON format work again by importing the deprecated ojvalidation module you need,
       *                  like ojvalidation-base.'}
       */
      /**
       * {@ojinclude "name":"comboboxCommonValidators"}
       *
       * @example <caption>Initialize the Combobox with validator instance:</caption>
       * &lt;oj-combobox-many validators="[[validators]]">&lt;/oj-combobox-many>
       * @example var validators = [new RegExpValidator({
       *       pattern: '[a-zA-Z0-9]{3,}'
       *     })];
       *
       *
       * @example <caption>Initialize the Combobox with multiple validator instances:</caption>
       * var validator1 = new MyCustomValidator({'foo': 'A'});
       * var validator2 = new MyCustomValidator({'foo': 'B'});
       * var validators = [validator1, validator2];
       * &lt;oj-combobox-many validators="[[validators]]">&lt;/oj-combobox-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">validators</code> property after initialization:</caption>
       * // get one
       * var validator = myCombobox.validators[0];
       *
       * // get all
       * var validators = myCombobox.validators;
       *
       * // set all
       * myCombobox.validators = myValidators;
       *
       * @name validators
       * @ojshortdesc Specifies a list of synchronous validators for performing validation by the element. See the Help documentation for more information.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojComboboxMany
       * @type {Array}
       * @default []
       * @ojsignature  [{ target: "Type",
       *   value: "Array<oj.Validator<V>|oj.AsyncValidator<V>>|null",
       *   jsdocOverride: true},
       * { target: "Type",
       *   value: "Array<oj.Validator<V>|oj.AsyncValidator<V>|
       *       oj.Validation.RegisteredValidator>|null",
       *   consumedBy: 'tsdep'}]
       * @ojdeprecated {since: '8.0.0', target: 'memberType', value: ['oj.Validation.RegisteredValidator'],
       *                description: 'Defining a validator with an object literal with validator type and
       *                  its options (aka JSON format) has been deprecated and does nothing. If needed, you can
       *                  make the JSON format work again by importing the deprecated ojvalidation module you need,
       *                  like ojvalidation-base.'}
       */
      /**
       * List of validators, synchronous or asynchronous,
       * used by component along with asynchronous validators from the deprecated async-validators option
       * and the implicit component validators when performing validation. Each item is either an
       * instance that duck types {@link oj.Validator} or {@link oj.AsyncValidator}.
       * As of v8.0.0, defining a validator with an object literal
       * with validator type and its options
       * (aka json format) has been deprecated and does nothing.
       * If needed, you can make the json format work
       * again by importing the deprecated module you need, e.g., ojvalidation-base module.
       * <p>
       * Implicit validators are created by the element when certain attributes are present.
       * For example, if the <code class="prettyprint">required</code>
       * attribute is set, an implicit {@link oj.RequiredValidator} is created.
       * At runtime when the component runs validation, it
       * combines all the implicit validators with all the validators
       * specified through this <code class="prettyprint">validators</code> attribute
       * and the <code class="prettyprint">async-validators</code> attribute, and
       * runs all of them.
       * </p>
       * <p>
       * Hints exposed by validators are shown inline by default in the Redwood theme when the
       * field has focus.
       * In the Alta theme, validator hints are shown in a notewindow on focus,
       * or as determined by the
       * 'validatorHint' property set on the <code class="prettyprint">display-options</code>
       * attribute.
       * In either theme, you can turn off showing validator hints by using the
       * 'validatorHint' property set to 'none' on the <code class="prettyprint">display-options</code>
       * attribute.
       * </p>
       * <p>
       * In the Redwood theme, only one hint shows at a time, so the precedence rules are:
       * help.instruction shows; if no help.instruction then validator hints show;
       * if none, then help-hints.definition shows; if none, then converter hint shows.
       * help-hints.source always shows along with the other help or hint.
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
       * <li>if element is invalid and is showing messages -
       * <code class="prettyprint">messages-shown</code> property is non-empty, when
       * <code class="prettyprint">validators</code> or
       * <code class="prettyprint">async-validators</code changes then all element messages
       * are cleared and full validation run using the display value on the element.
       * <ul>
       *   <li>if there are validation errors, then <code class="prettyprint">value</code>
       *   property is not updated and the error is shown.
       *   </li>
       *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
       *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
       *   event on the <code class="prettyprint">value</code> property to clear custom errors.</li>
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
       * <li><code class="prettyprint">messages-custom</code> property is not cleared.</li>
       * </ul>
       * </p>
       *
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojCombobox
       * @ojfragment comboboxCommonValidators
       */
      validators: [],

      /**
       * The <code class="prettyprint">valueOption</code> is similar to the <code class="prettyprint">value</code>, but is an
       * Object which contains both a value and display label.
       * The <code class="prettyprint">value</code> and <code class="prettyprint">valueOption</code> are kept in sync.
       * If initially both are set, the selected value in the <code class="prettyprint">value</code> attribute has precedence.
       * <p>Note: When the <code class="prettyprint">options</code> attribute is bound to a data provider, the <code class="prettyprint">valueOptionChanged</code> event will include data and metadata information if it is available from data provider.</p>
       * <p>Setting the <code class="prettyprint">valueOption</code> attribute initially can improve page load performance if there are initially selected values.  But, the initial <code class="prettyprint">valueOptionChanged</code> event will not include data and metadata information, because the element doesn't have to fetch the selected label from the data provider.</p>
       * <p>If <code class="prettyprint">valueOption</code> is not specified or the selected value is missing, then the label will be fetched from the data provider.</p>
       *
       * @name valueOption
       * @ojshortdesc The current value of the element and its associated display label.
       * @expose
       * @instance
       * @type {null | Object}
       * @default null
       * @ojwriteback
       *
       * @property {any} value current value of multiple selected JET Combobox values
       * @property {string} [label] display label of value above. If missing, String(value) is used.
       * @memberof oj.ojComboboxOne
       * @ojsignature { target: "Type",
       *                value: "V|null", for: "value"}
       *
       * @example <caption>Initialize the Combobox with the <code class="prettyprint">value-option</code> attribute specified:</caption>
       * &lt;oj-combobox-one value-option="[[valueOption]]">&lt;/oj-combobox-one>
       *
       * @example <caption>Object with value and label properties:</caption>
       * var valueOption = {'value': 'val1', 'label': 'Label 1'};
       *
       * @example <caption>Get or set the <code class="prettyprint">valueOption</code> property after initialization:</caption>
       * // getter
       * var valueOption = myCombobox.valueOption;
       *
       * // setter
       * myCombobox.valueOption = valueOption;
       */
      valueOption: null,

      /**
       * The <code class="prettyprint">valueOptions</code> is similar to the <code class="prettyprint">value</code>, but is an array
       * of Objects and each Object contains both a value and display label.
       * The <code class="prettyprint">value</code> and <code class="prettyprint">valueOptions</code> are kept in sync.
       * If initially both are set, the selected values in the <code class="prettyprint">value</code> attribute has precedence.
       * <p>Note: When the <code class="prettyprint">options</code> attribute is bound to a data provider, the <code class="prettyprint">valueOptionsChanged</code> event will include data and metadata information if it is available from data provider.</p>
       * <p>Setting the <code class="prettyprint">valueOptions</code> attribute initially can improve page load performance if there are initially selected values.  But, the initial <code class="prettyprint">valueOptionsChanged</code> event will not include data and metadata information, because the element doesn't have to fetch the selected label from the data provider.</p>
       * <p>If <code class="prettyprint">valueOptions</code> is not specified or one of the selected values is missing, then the labels will be fetched from the data provider.</p>
       *
       * @name valueOptions
       * @ojshortdesc The current values of the element and their associated display labels.
       * @expose
       * @instance
       * @type {null | Array.<Object>}
       * @default null
       * @ojwriteback
       *
       * @property {any} value the current value of JET Combobox
       * @property {string} [label] display label of value above. If missing, String(value) is used.
       * @ojsignature { target: "Type",
       *                value: "Array<{value: V, label?: string}> | null",
       *                jsdocOverride: true}
       *
       * @memberof oj.ojComboboxMany
       *
       * @example <caption>Initialize the Combobox with the <code class="prettyprint">value-options</code> attribute specified:</caption>
       * &lt;oj-combobox-many value-options="[[optionsArray]]">&lt;/oj-combobox-many>
       *
       * @example <caption>Array of Objects with value and label properties:</caption>
       * var optionsArray = [{'value': 'val1', 'label': 'Label 1'},
       *                     {'value': 'val2', 'label': 'Label 2'}];
       *
       * @example <caption>Get or set the <code class="prettyprint">valueOptions</code> property after initialization:</caption>
       * // getter
       * var valueOptions = myCombobox.valueOptions;
       *
       * // setter
       * myCombobox.valueOptions = optionsArray;
       */
      valueOptions: null,

      /**
       * The value of the element. It supports any type.
       * <p>Note: When the <code class="prettyprint">options</code> attribute is bound to a data provider, the <code class="prettyprint">valueChanged</code> event will include data and metadata information if it is available from data provider.</p>
       *
       * @example <caption>Initialize the combobox with the <code class="prettyprint">value</code> attribute specified:</caption>
       * &lt;oj-combobox-one value="option1">&lt;/oj-combobox-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
       * // getter
       * var value = myCombobox.value;
       *
       * // setter
       * myCombobox.value = "option1";
       *
       * @member
       * @name value
       * @ojshortdesc The value of the element.
       * @access public
       * @instance
       * @ojeventgroup common
       * @memberof oj.ojComboboxOne
       * @type {any}
       * @ojsignature { target: "Type",
       *                value: "V|null"}
       * @default null
       * @ojwriteback
       */
      /**
       * The value of the element. The value is an array with any type of items.
       * <p>Note: When the <code class="prettyprint">options</code> attribute is bound to a data provider, the <code class="prettyprint">valueChanged</code> event will include data and metadata information if it is available from data provider.</p>
       *
       * @example <caption>Initialize the combobox with the <code class="prettyprint">value</code> attribute specified:</caption>
       * &lt;oj-combobox-many value="{{val}}">&lt;/oj-combobox-many>
       * @example var val = ['option1', 'option2'];
       *
       * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
       * // getter
       * var value = myCombobox.value;
       *
       * // setter
       * myCombobox.value = ["option1", "option2"];
       *
       * @member
       * @name value
       * @ojshortdesc The value of the element.
       * @access public
       * @instance
       * @ojeventgroup common
       * @memberof oj.ojComboboxMany
       * @type {Array.<any>|null}
       * @ojsignature { target: "Type",
       *                value: "Array<V>|null"}
       * @default null
       * @ojwriteback
       */

      /**
       * Triggered when the value is submitted by the user through pressing the enter key or selecting from the drop down list.
       * This is to support search use cases.
       * The event will be fired even if the value is the same. This will help the application to re-submit the search query for the same value.
       * The event is not triggered if the submitted value fails validation. The event is not triggered on blur or tab out.
       *
       * @example <caption>Define an event listener.</caption>
       * var listener = function( event )
       * {
       *   // Get the search term
       *   var term = event['detail']['value'];
       *
       *   // search with the term
       * };
       * @ojshortdesc Event handler for when the value is submitted by the user.
       * @expose
       * @event
       * @memberof oj.ojComboboxOne
       * @since 4.2.0
       *
       * @instance
       * @property {any} value the current value
       * @property {any} previousValue the previous value
       */
      valueUpdated: null
    },

    /**
     * Returns a jQuery object containing the element visually representing the combobox.
     *
     * <p>This method does not accept any arguments.
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @public
     * @ignore
     * @return {jQuery} the combobox
     */
    widget: function () {
      if (this._isComboboxInstantiated()) {
        return this.combobox.container;
      }
      return $(this.OuterWrapper);
    },

    /**
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     * @override
     */
    _ComponentCreate: function () {
      this._super();
      _ComboUtils.wrapDataProviderIfNeeded(this, null);
      this._setup();
    },

    /**
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     * @override
     */
    _AfterCreate: function () {
      this._super();

      if (this._IsCustomElement()) {
        const contentElement = this._GetContentElement()[0];
        const containerId = this.OuterWrapper.id;
        const labelledBy = this.options.labelledBy;

        this._initInputIdLabelForConnection(contentElement, containerId, labelledBy);
        // JET-42350 - As a part of the fix, components with oj-option children are updated with _TRACK_CHILDREN metadata.
        // This resulted in these components to be created asynchronously. Previously, when oj-label asynchronously set
        // labelled-by attribute, these components would have already been created. So, at that point, _setOption would have
        // been called and necessary updates are done there. But now, since these components are created asynchronously, oj-label
        // might have already set the labelled-by property and hence setOption will not be called. So, we need to do the
        // necessary updates when creating the component, if that is the case.
        if (labelledBy) {
          // Update the aria attributes based on the labelled-by attribute
          this._labelledByUpdatedForInputComp(labelledBy, contentElement.id);
        }

        // need to apply the oj-focus marker selector for control of the floating label.
        var rootElement = this._getRootElement();
        this._focusable({
          element: rootElement,
          applyHighlight: false,
          afterToggle: this._handleAfterFocusToggle.bind(this, rootElement)
        });

        // If labelEdge is set to none, aria-label would have been set to the innerElem
        // so, we need to update the aria-label elsewhere
        if (this.combobox && this.options.labelEdge === 'none') {
          this.combobox.updateAriaLabelIfNeeded();
        }
      }
    },

    /**
     * If the dropdown is open and the afterToggle handler is called with focusout,
     * turn on the 'oj-focus' selector. This is needed for floating labels.  If focus
     * moves to the droplist, the label should be in the up position versus floating
     * down over the input on selection of a dropdown item.
     * @private
     * @instance
     * @memberof! oj.ojCombobox
     */
    _handleAfterFocusToggle: function (element, eventType) {
      if (eventType === 'focusout') {
        var dropdown = this._getDropdown();
        if (dropdown) {
          element.classList.add('oj-focus');
        }
      }
    },

    /**
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     * @override
     */
    _InitOptions: function (originalDefaults, constructorOptions) {
      var props = [
        { attribute: 'disabled', validateOption: true },
        { attribute: 'placeholder' },
        { attribute: 'required', coerceDomValue: true, validateOption: true },
        { attribute: 'title' }
        // {attribute: "value"}
      ];

      this._super(originalDefaults, constructorOptions);
      ojeditablevalue.EditableValueUtils.initializeOptionsFromDom(props, constructorOptions, this);

      this.multiple = !this._IsCustomElement()
        ? this.options.multiple
        : this.OuterWrapper.nodeName === 'OJ-COMBOBOX-MANY';

      if (this.options.value === undefined) {
        if (!this._IsCustomElement()) {
          this.options.value =
            this.element.attr('value') !== undefined
              ? _ComboUtils.splitVal(this.element.val(), ',')
              : null;
        }
      } else {
        // clone the value, otherwise _setDisplayValue will not be invoked on binding value to ko observableArray.
        // TODO: Need to revisit this once 18724975 is fixed.
        var value = this.options.value;
        if (Array.isArray(value)) {
          if (!this._IsCustomElement()) {
            value = value.slice(0);
          }
        } else if (typeof value === 'string') {
          if (this.multiple === true) {
            value = _ComboUtils.splitVal(value, ',');
          } else if (!this._IsCustomElement()) {
            value = [value];
          }
        }
        this.options.value = value;
      }
    },
    /**
     * Whether the component is required.
     *
     * @return {boolean} true if required; false
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     * @override
     */
    _IsRequired: function () {
      return this.options.required;
    },
    /**
     * This method handles the labelled-by attribute change
     *
     * @param {string} labelledBy The id of the label element
     * @param {string} contentElementId The id of the conetent element
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _labelledByUpdatedForInputComp: function (labelledBy, contentElementId) {
      ojeditablevalue.EditableValueUtils._labelledByUpdatedForInputComp.apply(this, arguments);

      // Update the aria-labelledby attribute of the results container
      // Fix  - Acc error in the OATB tool
      const ariaLabelledBy = ojeditablevalue.EditableValueUtils._getOjLabelAriaLabelledBy(
        labelledBy,
        `${this.uuid}_Label`
      );
      if (this._isComboboxInstantiated()) {
        this.combobox.updateAriaLabelledByIfNeeded(ariaLabelledBy);
      }
    },
    /**
     * @memberof! oj.ojCombobox
     * @instance
     * @private
     */
    _initInputIdLabelForConnection: ojeditablevalue.EditableValueUtils._initInputIdLabelForConnection,
    /**
     * @memberof! oj.ojCombobox
     * @instance
     * @private
     */
    _linkLabelForInputComp: ojeditablevalue.EditableValueUtils._linkLabelForInputComp,
    /**
     * Draw a readonly div. When readonly, this div is shown and
     * the input has display:none on it through theming, and vice versa.
     * We set the textContent in _SetDisplayValue() if readonly
     * @param {HTMLElement} pass in this.element[0]
     * @memberof! oj.ojCombobox
     * @instance
     * @private
     */
    _createOrUpdateReadonlyDiv: ojeditablevalue.EditableValueUtils._createOrUpdateReadonlyDiv,
    /**
     * Performs post processing after required option is set by taking the following steps.
     *
     * - if component is invalid and has messgesShown -> required: false/true -> clear component errors;
     * run full validation with UI value (we don't know if the UI error is from a required validator
     * or something else);<br/>
     * &nbsp;&nbsp;- if there are validation errors, then value not pushed to model; messagesShown is
     * updated<br/>
     * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to
     * listen to optionChange(value) to clear custom errors.<br/>
     *
     * - if component is invalid and has messagesHidden -> required: false -> clear component
     * errors; no deferred validation is run.<br/>
     * - if component has no error -> required: true -> run deferred validation (we don't want to flag
     * errors unnecessarily)<br/>
     * - messagesCustom is never cleared<br/>
     *
     * @param {string} option
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     */
    _AfterSetOptionRequired: ojeditablevalue.EditableValueUtils._AfterSetOptionRequired,

    /**
     * When validators option changes, take the following steps.
     *
     * - Clear the cached normalized list of all validator instances. push new hints to messaging.<br/>
     * - if component is valid -> validators changes -> no change<br/>
     * - if component is invalid has messagesShown -> validators changes -> clear all component
     * messages and re-run full validation on displayValue. if there are no errors push value to
     * model;<br/>
     * - if component is invalid has messagesHidden -> validators changes -> do nothing; doesn't change
     * the required-ness of component <br/>
     * - messagesCustom is not cleared.<br/>
     *
     * NOTE: The behavior applies to any option that creates implicit validators - min, max, pattern,
     * etc. Components can call this method when these options change.
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     */
    _AfterSetOptionValidators: ojeditablevalue.EditableValueUtils._AfterSetOptionValidators,
    /**
     * When async-validators attribute changes, take the following steps.
     *
     * - Clear the cached normalized list of all validator instances. push new hints to messaging.<br/>
     * - if component is valid -> validators changes -> no change<br/>
     * - if component is invalid has messagesShown -> validators changes -> clear all component
     * messages and re-run full validation on displayValue. if there are no errors push value to
     * model;<br/>
     * - if component is invalid has messagesHidden -> validators changes -> do nothing; doesn't change
     * the required-ness of component <br/>
     * - messagesCustom is not cleared.<br/>
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     */
    _AfterSetOptionAsyncValidators: ojeditablevalue.EditableValueUtils._AfterSetOptionAsyncValidators,
    /**
     * Performs post processing after converter option changes by taking the following steps.
     *
     * - always push new converter hint to messaging <br/>
     * - if component has no errors -> refresh UI value<br/>
     * - if component is invalid has messagesShown -> clear all component errors and run full
     * validation using display value. <br/>
     * &nbsp;&nbsp;- if there are validation errors, value is not pushed to model; messagesShown is
     * updated.<br/>
     * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to
     * listen to optionChange(value) to clear custom errors.<br/>
     * - if component is invalid has messagesHidden -> refresh UI value. no need to run deferred
     * validations. <br/>
     * - messagesCustom is never cleared<br/>
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     */
    _AfterSetOptionConverter: ojeditablevalue.EditableValueUtils._AfterSetOptionConverter,
    /**
     * Called when converter option changes and we have gotten the new converter
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     */
    _ResetConverter: ojeditablevalue.EditableValueUtils._ResetConverter,
    /**
     * Returns the normalized converter instance.
     *
     * @return {Object} a converter instance or null
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     */
    _GetConverter: ojeditablevalue.EditableValueUtils._GetConverter,
    /**
     * This returns an array of all validators
     * normalized from the validators option set on the component. <br/>
     * @return {Array} of validators.
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     */
    _GetNormalizedValidatorsFromOption: ojeditablevalue.EditableValueUtils._GetNormalizedValidatorsFromOption,
    /**
     * This returns an array of all async validators
     * normalized from the async-validators attribute set on the component. <br/>
     * @return {Array} of validators.
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     */
    _GetNormalizedAsyncValidatorsFromOption:
      ojeditablevalue.EditableValueUtils._GetNormalizedAsyncValidatorsFromOption,

    _setup: function () {
      var multi = this.multiple;

      // fixup valueOption(s) if placeholder is selected
      if (_ComboUtils.isValueForPlaceholder(multi, this.options.value)) {
        if (multi) {
          this.options.valueOptions = _ComboUtils.getValueOptionsForPlaceholder(
            this,
            this.options.valueOptions
          );
        } else {
          this.options.valueOption = _ComboUtils.getValueOptionsForPlaceholder(
            this,
            this.options.valueOption
          );
        }
      }

      // Fetch the option defaults from the CSS file
      this.cssOptionDefaults =
        ThemeUtils.parseJSONFromFontFamily('oj-combobox-option-defaults') || {};

      this._initComboboxInstance();
      this._refreshRequired(this.options.required);

      // JET-43071 - messagescustom property doesn't work when initial render
      // During the initial setup, there will not be any component messages,
      // but there can be custom messages. So, we need to make sure that we
      // do not clear them off when we sync value and valueOptions
      const options = { doNotClearMessages: true };
      //  - need to be able to specify the initial value of select components bound to dprv
      this._resolveValueOptionsLater = _ComboUtils.mergeValueAndValueOptions(this, options);
    },

    /**
     * @memberof! oj.ojCombobox
     * @instance
     * @private
     */
    _refreshRequired: ojeditablevalue.EditableValueUtils._refreshRequired,

    /**
     * Called to find out if aria-required is unsupported.
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     */
    _AriaRequiredUnsupported: function () {
      return false;
    },
    /**
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     * @override
     */
    _destroy: function () {
      this.combobox._destroy();
      this._super();
    },

    /**
     * Instantiates the combobox instance
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @private
     */
    _initComboboxInstance: function () {
      const opts = $.extend(this.options, {
        element: this.element,
        ojContext: this
      });
      this.combobox = this.multiple ? new _OjMultiCombobox() : new _OjSingleCombobox();

      this.combobox._init(opts);
    },

    /**
     * Destroys the combobox instance
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @private
     */
    _destroyComboboxInstance: function () {
      this.combobox._destroy();
      this.combobox = null;
    },

    /**
     * Checks if the combobox is already instantiated
     *
     * @returns {boolean} indicates if we have the combobox instantiated
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @private
     */
    _isComboboxInstantiated: function () {
      return this.combobox != null;
    },

    /**
     * Setup resources for the combobox
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @private
     */
    _setupComboboxResources: function () {
      if (!this._isComboboxInstantiated()) {
        this._initComboboxInstance();
        // JET-60973 - Combo box label hint is not displayed when the drawer is opened for the second time
        // If we are creating a new instance of combobox, then
        // we need to reactivate the component messaging which includes
        // label
        this._initComponentMessaging();
      }
      // Check if the dp is already wrapped
      if (!_ComboUtils.isDataProviderWrapped(this)) {
        _ComboUtils.wrapDataProviderIfNeeded(this, this.combobox ? this.combobox.opts : null);
      }
      _ComboUtils.addDataProviderEventListeners(this);
    },

    /**
     * releases resources of the combobox
     *
     * @memberof! oj.ojCombobox
     * @instance
     * @private
     */
    _releaseComboboxResources: function () {
      if (this._isComboboxInstantiated()) {
        this._destroyComboboxInstance();
      }
      _ComboUtils.removeDataProviderEventListeners(this);
      _ComboUtils.clearDataProviderWrapper(this);
    },

    /**
     * Override to setup combobox resources
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     * @override
     */
    _SetupResources: function () {
      this._super();
      this._setupComboboxResources();
    },

    /**
     * Override to release combobox resources
     * @memberof! oj.ojCombobox
     * @instance
     * @protected
     * @override
     */
    _ReleaseResources: function () {
      this._super();
      this._releaseComboboxResources();
    },

    /**
     * Returns if the element is a text field element or not.
     * @memberof oj.ojCombobox
     * @instance
     * @protected
     * @return {boolean}
     */
    _IsTextFieldComponent: function () {
      return true;
    },

    /**
     * Returns the components wrapper under which label needs to be inserted in the inside strategy
     * @instance
     * @protected
     * @ignore
     * @return {Element|undefined}
     */
    _GetContentWrapper: function () {
      if (this._IsCustomElement() && this._isComboboxInstantiated()) {
        return this.combobox._GetContentWrapper();
      }
      return undefined;
    },

    /**
     * Refreshes the combobox.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj.ojCombobox
     * @instance
     * @return {void}
     * @ojshortdesc Refreshes the combobox.
     * @public
     */
    refresh: function () {
      this._super();

      this._releaseComboboxResources();

      this._setup();
      this._setupComboboxResources();
      this._SetRootAttributes();
      this._initComponentMessaging();
    },

    /**
     * Sets multiple options
     *
     * @param {Object} options the options object
     * @param {Object} flags additional flags for option
     *
     * @override
     * @protected
     * @memberof! oj.ojCombobox
     */
    _setOptions: function (options, flags) {
      var processSetOptions;

      // _setOptions is invoked to set multiple options and for some options, we need
      // to enforce an order. So we will using a temporary object which is used for
      // storing function refs which will then be executed in an order that we want to
      // enforce. Some of the options can call _setOptions recursively to set different
      // options. For eg., setting 'labelEdge' to 'none', will in turn calls _setOptions
      // recursviely setting 'labelledBy'. So we need to maintain a stack of object to
      // keep track of the call stack.
      if (!this._processSetOptions) {
        this._processSetOptions = [];
      }
      this._processSetOptions.push({});

      this._super(options, flags);

      // Get the top most object from the stack, which represents the current call
      processSetOptions = this._processSetOptions.pop();

      // JET-43071 - messagescustom property doesn't work when initial render
      // After the value and valueOptions are updated, set the messages custom
      if (processSetOptions.messagesCustom) {
        processSetOptions.messagesCustom();
      }
    },

    /**
     * Handles options specific to combobox.
     * @override
     * @protected
     * @memberof! oj.ojCombobox
     */
    _setOption: function (key, _value, flags) {
      var value = _value;
      var multi = this.multiple;
      var selfSuper = this._super;
      var processSetOptions = (this._processSetOptions || []).slice(-1)[0];

      if (key === 'value') {
        if (Array.isArray(value)) {
          if (!this._IsCustomElement()) {
            value = value.slice(0);
          }
        } else if (typeof value === 'string') {
          if (multi === true) {
            value = _ComboUtils.splitVal(value, ',');
          } else if (!this._IsCustomElement()) {
            value = [value];
          }
        }

        // valueChangeTrigger will be used while setting the display value.
        if (flags && flags._context && flags._context.optionMetadata) {
          this.combobox.valueChangeTrigger = flags._context.optionMetadata.trigger;
        } else {
          this.combobox.valueChangeTrigger = null;
        }

        //  - placeholder is not displayed after removing selections from select many
        //  - resetting value when value-option and placeholder are set throws exception
        if (
          typeof this.options.placeholder === 'string' &&
          (value == null ||
            (value && value.length === 0) ||
            (this._IsCustomElement() && _ComboUtils.isValueForPlaceholder(multi, value)))
        ) {
          _ComboUtils.setValueOptions(this, _ComboUtils.getFixupValueOptionsForPlaceholder(multi));
          this._super(key, value, flags);
          return;
        }
      }

      // if we have a new data provider, remove the old dataProvider event listeners
      if (key === 'options') {
        _ComboUtils.removeDataProviderEventListeners(this);
        _ComboUtils.clearDataProviderWrapper(this);
      } else if (key === 'optionsKeys') {
        _ComboUtils.clearDataProviderWrapper(this);
      } else if (key === 'valueOption' && multi !== true) {
        // fixup valueOption
        value = _ComboUtils.getValueOptionsForPlaceholder(this, value);
        //  - unable to clear values on lov value-option, to get the placeholder to show
        this.combobox.opts.valueOption = value;
      } else if (key === 'valueOptions' && multi === true) {
        // fixup valueOptions
        value = _ComboUtils.getValueOptionsForPlaceholder(this, value);
        //  - unable to clear values on lov value-option, to get the placeholder to show
        this.combobox.opts.valueOptions = value;
      } else if (key === 'messagesCustom') {
        if (processSetOptions != null) {
          // JET-43071 - messagescustom property doesn't work when initial render
          // We need to set the messagesCustom after value and valueOptions are set
          // as they would reset the messages
          // So store the function to be called in the process queue and return without
          // doing anything else. The queue item will be executed in the _setOptions
          // call.
          // For messagesCustom option calling the super method alone is sufficient
          processSetOptions.messagesCustom = selfSuper.bind(this, key, value, flags);
          return;
        }
      }
      this._super(key, value, flags);

      //  - need to be able to specify the initial value of select components bound to dprv
      if (key === 'valueOption' && multi !== true) {
        _ComboUtils.syncValueWithValueOption(this, value, this.options.value, false);
      } else if (key === 'valueOptions' && multi === true) {
        _ComboUtils.syncValueWithValueOptions(this, value, this.options.value, false);
      } else if (key === 'value') {
        // update valueOptions
        _ComboUtils.updateValueOptions(this.combobox);
      } else if (key === 'options') {
        // only add data provider event listeners to new data provider
        if (_ComboUtils.isDataProvider(value)) {
          _ComboUtils.wrapDataProviderIfNeeded(this, this.combobox ? this.combobox.opts : null);
          _ComboUtils.addDataProviderEventListeners(this);
        }
        this.combobox.opts.options = value;
        this.combobox.opts = this.combobox._prepareOpts(this.combobox.opts);

        // : INCONSISTENT AUTOSUGGEST VALUES DISPLAYED IN OJCOMBOBOX COMPONENT
        // Open the dropdown when the user is still typing and the options are updated.
        if (
          (this.combobox.isSearchFocused && this.combobox.shouldReopenOnNewData) ||
          this.combobox._opened()
        ) {
          // This is to be treated as non-initial update as the term highlight should be done if there
          // are matches.
          this.combobox._updateResults(false, true);
        }
      } else if (key === 'optionsKeys') {
        _ComboUtils.wrapDataProviderIfNeeded(this, this.combobox ? this.combobox.opts : null);
      } else if (key === 'disabled') {
        if (value) {
          this.combobox._disable();
        } else {
          this.combobox._enable();
        }
        // Readonly support
      } else if (key === 'readOnly') {
        this.combobox.applyReadonlyState();
      } else if (key === 'labelledBy') {
        if (this.options.labelledBy) {
          var id = this._GetContentElement()[0].id;
          this._labelledByUpdatedForInputComp(this.options.labelledBy, id);
        }
      } else if (key === 'maximumResultCount') {
        this.combobox.opts.maximumResultCount = value;
      }
    },
    /**
     * Performs post processing after _SetOption() is called. Different options when changed perform
     * different tasks. See _AfterSetOption[OptionName] method for details.
     *
     * @param {string} option
     * @param {Object|string=} previous
     * @param {Object=} flags
     * @protected
     * @memberof! oj.ojCombobox
     * @instance
     * @override
     */
    // eslint-disable-next-line no-unused-vars
    _AfterSetOption: function (option, previous, flags) {
      this._superApply(arguments);
      switch (option) {
        case 'required':
          this._AfterSetOptionRequired(option);
          break;
        case 'validators':
          this._AfterSetOptionValidators(option);
          break;
        case 'converter':
          if (!this.isValid()) {
            // If the component is not in valid state, the value should be
            // parsed against the new converter
            this._handleConverterChangeWithInvalidValue = true;
          }
          // This flag will be used in SetDisplayValue, which will be called
          // once the converter is loaded, to update the valueOptions with
          // the new converter
          this._handleConverterChange = true;
          this._AfterSetOptionConverter(option);
          break;
        case 'asyncValidators':
          this._AfterSetOptionAsyncValidators(option);
          break;
        case 'labelHint':
        case 'labelEdge':
          // Changing labelHint and labelEdge might have updated
          // aria-label on the root element. Check if it is needed to
          // update the aria-label on inner elements.
          if (this.combobox) {
            this.combobox.updateAriaLabelIfNeeded();
          }
          break;
        default:
          break;
      }
    },

    /**
     * combobox-many doesn't use .oj-text-field-readonly for the focusable readonly content,
     * so we need to use a different selector.  Combobox-one doesn't need this override,
     * so we just return the default readonly element.
     * @memberof! _OjMultiCombobox
     * @instance
     * @override
     * @protected
     * @return {Element|null}
     */
    _GetReadonlyFocusElement: function () {
      if (this.multiple) {
        return this.widget()[0].querySelector('.oj-combobox-accessible-container');
      }

      // For oj-combobox-one return the default element
      return this._super();
    },

    // 19670748, dropdown popup should be closed on subtreeDetached notification.
    _NotifyDetached: function () {
      this._superApply(arguments);
      if (this._isComboboxInstantiated()) {
        this.combobox.close();
      }
    },

    // 19670748, dropdown popup should be closed on subtreeHidden notification.
    _NotifyHidden: function () {
      this._superApply(arguments);
      if (this._isComboboxInstantiated()) {
        this.combobox.close();
      }
    },

    /**
     * Override to do the delay connect/disconnect
     * @memberof oj.ojCombobox
     * @override
     * @protected
     */
    _VerifyConnectedForSetup: function () {
      //  - temp moving oj-select from one elem to another should not cause fetch
      return true;
    },

    /**
     * Updates display value of combobox.
     * @override
     * @protected
     * @memberof! oj.ojCombobox
     */
    // eslint-disable-next-line no-unused-vars
    _SetDisplayValue: function (displayValue) {
      // Reapply converter to valueOptions if needed.
      if (this._handleConverterChange) {
        this.combobox._UpdateValueOptionsWithConverter();
      }

      //  - need to be able to specify the initial value of select components bound to dprv
      if (_ComboUtils.applyValueOptions(this.combobox, this.options)) {
        if (this.multiple) {
          this.combobox._clearSearch();
        }
      } else {
        this.combobox._initSelection();
      }
      this._resolveValueOptionsLater = false;
      this._handleConverterChange = false;
    },

    /**
     * Returns the display value.
     * @override
     * @protected
     * @memberof! oj.ojCombobox
     * @return {Array|Object|null} display value of the component
     */
    _GetDisplayValue: function () {
      var displayValue = null;
      var data = this.combobox._getSelectionData();
      if (data != null) {
        if (this.multiple) {
          displayValue = [];
          if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
              displayValue.push(_ComboUtils.getLabel(data[i]));
            }
          } else {
            displayValue.push(_ComboUtils.getLabel(data));
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (Array.isArray(data) && data.length > 0) {
            displayValue = _ComboUtils.getLabel(data[0]);
          } else {
            displayValue = _ComboUtils.getLabel(data);
          }
        }
      } else {
        // get the display value from editable value if the selection data is unavailable
        displayValue = this._super();
      }
      return displayValue;
    },

    /**
     * Set the placeholder.
     * @override
     * @protected
     * @memberof! oj.ojCombobox
     */
    _SetPlaceholder: function (value) {
      if (this.combobox) {
        this.combobox.opts.placeholder = value;
        // TODO: pavitra - noticed that some combobox tests fail because the _setPlaceholder is
        // undefined, when this method is called from _AfterCreate().
        if (this.combobox._setPlaceholder) {
          this.combobox._setPlaceholder();
        }
      }
    },

    /**
     * Parses the value using the converter set and returns the parsed value. If parsing fails the
     * error is written into the element. This function sets the valid state to PENDING before it tries
     * to parse.
     *
     * @param {string=} submittedValue to parse
     * @param {Object=} event an optional event if this was a result of ui interaction. For user
     * initiated actions that trigger a DOM event, passing this event is required. E.g., if user action
     * causes a 'blur' event.
     * @param {boolean?} setValid true if you want to set the valid state to pending->invalid
     * @return {Object} parsed value
     * @throws {Error} an Object with message
     *
     * @override
     * @protected
     * @memberof! oj.ojCombobox
     * @instance
     */
    _parseValue: function (_submittedValue, event, setValid) {
      var parsedVal;
      var submittedValue = _submittedValue;

      // Converter should only be applied for the user inputs and not
      // when selecting an option from the dropdown.
      // Apply converter if the forceApplyConverter flag is set.
      // Apply converter again if converter is toggled when having invalid value
      if (
        !this.combobox.shouldApplyConverter &&
        !this.combobox.forceApplyConverter &&
        !this._handleConverterChangeWithInvalidValue
      ) {
        return _submittedValue;
      }

      if (typeof submittedValue === 'string') {
        if (this.multiple === true) {
          submittedValue = _ComboUtils.splitVal(submittedValue, ',');
        } else if (!this._IsCustomElement()) {
          submittedValue = [submittedValue];
        }
      }
      if (Array.isArray(submittedValue)) {
        if (this.combobox.forceApplyConverter || this._handleConverterChangeWithInvalidValue) {
          // Delete the converter change flag before parsing, as for all we care we
          // handled the converter change here and we need not worry about if the parsing
          // is a success
          delete this._handleConverterChangeWithInvalidValue;

          // Check and apply converter for all the values
          parsedVal = [];
          for (let i = 0; i < submittedValue.length; i++) {
            let value = submittedValue[i];
            // parse the value only if it not an dropdown item
            if (this.combobox._idsFromDropdown.has(value)) {
              parsedVal.push(value);
            } else {
              let parsed = this._super(value, event, setValid);
              parsedVal.push(parsed);
            }
          }
        } else {
          parsedVal = submittedValue.slice();
          // since only one value can be set at a time, we need to parse
          // only the last item in the array
          if (parsedVal.length > 0) {
            let lastValue = parsedVal.slice(-1)[0];
            let parsed = this._super(lastValue, event, setValid);

            // replace the last value with the parsed value.
            parsedVal.splice(-1, 1, parsed);
          }
        }
      } else {
        // Delete the converter change flag before parsing, as for all we care we
        // handled the converter change here and we need not worry about if the parsing
        // is a success
        delete this._handleConverterChangeWithInvalidValue;
        parsedVal = this._super(submittedValue, event, setValid);
      }
      return parsedVal;
    },

    /**
     * Formats the value for display, based on the converter options. If no converter is set then
     * returns the value as is.
     *
     * @param {V|Array<V>} value value to be formatted
     *
     * @return {string|Array<string>} formatted value
     * @throws {Error} when an error occurs during formatting
     *
     * @override
     * @protected
     * @memberof! oj.ojCombobox
     * @instance
     */
    _formatValue: function (value) {
      var formattedValue;

      if (Array.isArray(value)) {
        formattedValue = [];
        for (var i = 0; i < value.length; i++) {
          var formatted = this._super(value[i]);
          formattedValue.push(formatted);
        }
      } else {
        formattedValue = this._super(value);
      }
      return formattedValue;
    },

    /**
     * @override
     * @protected
     * @memberof! oj.ojCombobox
     *
     * @param {!Object} menu The JET Menu to open as a context menu.  Always non-<code class="prettyprint">null</code>.
     * @param {!Event} event What triggered the menu launch.  Always non-<code class="prettyprint">null</code>.
     * @param {string} eventType "mouse", "touch", or "keyboard".  Never <code class="prettyprint">null</code>.
     */
    _NotifyContextMenuGesture: function (menu, event, eventType) {
      // The default baseComponent behavior in _OpenContextMenu assumes this.element for the
      // launcher. In this case, the original element the component is bound to is
      // hidden (display: none). Pass in an openOption override.
      var launcher = this._GetMessagingLauncherElement();
      this._OpenContextMenu(event, eventType, { launcher: launcher });
    },

    /**
     * Returns the jquery element that represents the content part of the component.
     * This is usually the component that user sets focus on (tabindex is set 0) and
     * where aria attributes like aria-required, aria-labelledby etc. are set. This is
     * also the element where the new value is updated. Usually this is the same as
     * the _GetMessagingLauncherElement.
     *
     * @override
     * @protected
     * @memberof! oj.ojCombobox
     * @return {jQuery} jquery element which represents the content.
     */
    _GetContentElement: function () {
      if (this._isComboboxInstantiated()) {
        return this.combobox.search;
      }
      return this.element;
    },

    /**
     * Returns the element on which aria-label can be found.
     * For combobox components, it is the content element where the aria-label will be set.
     *
     * @override
     * @protected
     * @memberof! oj.ojCombobox
     * @return {HTMLElement} The element in which we set the aria-label attribute
     */
    _GetAriaLabelElement: function () {
      return this._GetContentElement()[0];
    },

    /**
     * Returns the default styleclass for the component.
     *
     * @return {string}
     * @expose
     * @memberof! oj.ojCombobox
     * @override
     * @protected
     */
    _GetDefaultStyleClass: function () {
      return 'oj-combobox';
    },

    /**
     *
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojCombobox
     */
    _SetLoading: function () {
      this._super();
      if (this._isComboboxInstantiated()) {
        this.combobox.applyReadonlyState();
      }
    },

    /**
     *
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojCombobox
     */
    _ClearLoading: function () {
      this._super();
      if (this._isComboboxInstantiated()) {
        this.combobox.applyReadonlyState();
      }
    },
    /**
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app. </li>
     * <li>If no converter is present then processing continues to next step. If a converter is
     * present, the UI value is first converted (i.e., parsed). If there is a parse error then
     * the messages are shown.</li>
     * <li>If there are no validators setup for the component the <code class="prettyprint">value</code>
     * option is updated using the display value. Otherwise all
     * validators are run in sequence using the parsed value from the previous step. The implicit
     * required validator is run first if the component is marked required. When a validation error is
     * encountered it is remembered and the next validator in the sequence is run. </li>
     * <li>At the end of validation if there are errors, the messages are shown.
     * If there were no errors, then the
     * <code class="prettyprint">value</code> option is updated.</li>
     * </ol>
     *
     * @example <caption>Validate component using its current value.</caption>
     * myComp.validate();
     *
     * @example <caption>Validate component and use the Promise's resolved state.</caption>
     * myComp.validate().then(
     *  function(result) {
     *    if(result === "valid")
     *    {
     *      submitForm();
     *    }
     *  });
     * @return {Promise} Promise resolves to "valid" if there were no converter parse errors and
     * the component passed all validations.
     * The Promise resolves to "invalid" if there were converter parse errors or
     * if there were validation errors.
     * @ojshortdesc Validates the component's display value using all converters and validators registered on the component. If there are no validation errors, then the value is updated. See the Help documentation for more information.
     * @method
     * @access public
     * @expose
     * @instance
     * @memberof oj.ojCombobox
     *
     */
    validate: function () {
      var displayValueForSetValue = this._getDisplayValueForSetValue();
      var combobox = this.combobox;
      var valueCandidate = displayValueForSetValue;
      var valOptToResetOnFailure;
      var returnValue;

      if (combobox.hasUncommittedValue) {
        // we need to update the valueOptions before setting the value
        var newValOpts = null;
        var multiple = this.multiple;

        if (multiple) {
          var lastRawValue = displayValueForSetValue[displayValueForSetValue.length - 1];
          var val = (combobox.getVal() || []).slice(0);
          var data = this._getValueOptionCandidateFromRawValue(lastRawValue);
          var id = combobox.id(data);
          var initialValOpts = (combobox.getValOpts() || []).slice(0);

          newValOpts = initialValOpts.slice(0);
          if (val.indexOf(id) === -1) {
            newValOpts.push(data);
            val.push(id);
            // : component oj-combobox-many displays the list of the values - does not exclude the invalid values
            // ValueOption has been modified, so it should be resetted
            // if validation fails
            valOptToResetOnFailure = initialValOpts;
          }
          valueCandidate = val;
        } else {
          newValOpts = this._getValueOptionCandidateFromRawValue(displayValueForSetValue);
          valueCandidate = combobox.id(newValOpts);
        }
        combobox._skipSetValueOptions = true;
        combobox.shouldApplyConverter = true;
        combobox.setValOpts(newValOpts);

        // Since the valOpts are set, reset the hasUncommittedValue flag
        // The newValOpts will be available in the component's valueOption
        combobox.hasUncommittedValue = false;
      }
      // returns Promise that resolves to true|false or boolean
      returnValue = this._SetValue(valueCandidate, null, this._VALIDATE_METHOD_OPTIONS);

      if (returnValue === false && !this._CanSetValue()) {
        // FIX JET-45885, validate() returns 'invalid' for readonly or disabled on valid value.
        // In _SetValue/_AsyncValidate, validation is skipped when !this._CanSetValue(), and _SetValue returns false.
        // We want validate() to return 'valid' when validation is skipped.
        returnValue = true;
      }

      if (this._IsCustomElement()) {
        if (!(returnValue instanceof Promise)) {
          combobox._skipSetValueOptions = false;
          delete combobox.shouldApplyConverter;
          if (!returnValue && valOptToResetOnFailure) {
            combobox.setValOpts(valOptToResetOnFailure);
            combobox.hasUncommittedValue = true;
          }
          returnValue = Promise.resolve(returnValue ? 'valid' : 'invalid');
        } else {
          returnValue = returnValue.then(function (booleanSetValueReturn) {
            combobox._skipSetValueOptions = false;
            delete combobox.shouldApplyConverter;
            if (!booleanSetValueReturn && valOptToResetOnFailure) {
              combobox.setValOpts(valOptToResetOnFailure);
              combobox.hasUncommittedValue = true;
            }
            return Promise.resolve(booleanSetValueReturn ? 'valid' : 'invalid');
          });
        }
      }
      return returnValue;
    },

    /**
     * Runs full validation on the newValue and sets the newValue on the component.
     *
     * @return {Promise|boolean}
     * @memberof oj.ojCombobox
     * @override
     * @instance
     * @protected
     */
    _SetValue: function (newValue, event, options) {
      // if the _SetValue has failed due to validation errors in combobox, update the display value
      // if there are no validation errors, display value will be updated by editableValue
      var resolved = this._super(newValue, event, options);
      // update display value only if there are validation errors
      // don't wait for the promise to resolve to update the display value
      if (!resolved || resolved instanceof Promise) {
        var isPlaceholderVal;
        if (this._IsCustomElement()) {
          isPlaceholderVal = _ComboUtils.isValueForPlaceholder(this.multiple, newValue);
        } else {
          isPlaceholderVal =
            newValue == null || newValue === '' || oj.Object.compareValues(newValue, []);
        }

        // do not update display value for the call from validate method
        // do not update display value if the newValue is a placeholder value
        // note: placeholder value indicates user is clearing selection(s) and
        // we don't need to update display value in that scenario.
        if (!isPlaceholderVal && options !== this._VALIDATE_METHOD_OPTIONS) {
          this._SetDisplayValue(newValue);
        }
      }
      return resolved;
    },

    /**
     * Whether a value can be set on the component. For example, if the component is
     * disabled or readOnly then setting value on component is a no-op.
     *
     * @see #_SetValue
     * @return {boolean}
     * @memberof oj.ojCombobox
     * @override
     * @instance
     * @protected
     */
    _CanSetValue: function () {
      // FIX  - VALUE UNCHANGED IN DISABLED SELECT WHEN CHANGING BOUND VALUEOPTION
      // _SetValue always performs validation, which calls _CanSetValue, which returns false if
      // the component is disabled, thereby disallowing the set.  Override _CanSetValue here
      // so that we can force it to return true when syncing the value with the valueOption[s]
      // from _ComboUtils.syncValueWithValueOption[s].
      if (this.forceCanSetValue) {
        return true;
      }
      return this._super();
    },

    /**
     * Finds the valueOption candidate for the rawValue provided.
     * The value candidate is the value/label pair that will be set if the validation passes.
     * There can be two cases:
     *  1. The rawValue matches a key in the current dataprovider, then the valueOption from the
     *     dataprovider will be the value candidate
     *  2. Otherwise, a new valueOption will be created with value and label matching the rawValue
     *     which will be the value candidate
     *
     * @param {string} rawValue The rawValue for which the value candidate has to be obtained
     * @return {object} The valueOption candidate
     * @memberof oj.ojCombobox
     * @instance
     * @private
     */
    _getValueOptionCandidateFromRawValue: function (rawValue) {
      var defaultValueOption = this.combobox.opts.manageNewEntry(rawValue);
      return _ComboUtils.findOptionFromResult(this.combobox, rawValue, defaultValueOption);
    },

    _getDisplayValueForSetValue: function () {
      var displayValue = null;
      var newValue = null;
      var hasUncommittedValue = this.combobox.hasUncommittedValue;

      if (this.multiple !== true) {
        // Fix , 
        // Based on the state of the combobox, the return value is decided
        // If the combobox has uncommitted value in it (i.e. rawValue does not represent the value)
        // then the rawValue should be sent for validation, otherwise the value should be sent.
        // This is because the value represents the key while the rawValue represent the label.
        // So, when the combobox has uncommitted changes, then the rawValue will be the candidate for the
        // new label. When the combobox does not have uncommitted changes, the value is already set so it has
        // to be used for all validation purposes.
        if (hasUncommittedValue) {
          displayValue = this.combobox.getRawValue();
        } else {
          // Get the current item as it would contain the item that is currently shown in the UI
          // irrespective of it being valid or invalid
          const currentItem = this.combobox.currentItem || [];
          displayValue = null;

          // The current item is always an array, and for single select components, it will hold a
          // single item entry. If it exists, fetch the current value, else the displayValue will be
          // null by default.
          if (currentItem.length > 0 && currentItem[0] != null) {
            displayValue = currentItem[0].value;
          }
        }
        if (!this._IsCustomElement()) {
          if (displayValue === undefined || displayValue === null || displayValue === '') {
            newValue = [];
          } else {
            newValue = [displayValue];
          }
        } else {
          newValue = displayValue;
        }
      } else {
        // currentVal represents the current display value of the combobox component
        var existingValue = this.combobox.currentValue ? this.combobox.currentValue.slice(0) : [];
        displayValue = this.combobox.search.val();

        if (displayValue === undefined || displayValue === null || displayValue === '') {
          newValue = existingValue;
        } else {
          existingValue.push(displayValue);
          newValue = existingValue;
        }
      }
      return newValue;
    },

    /**
     * ojCombobox does not have asynchronous value updates, but to have consistent
     * signature with ojSelect this method return a Promise that always resolves.
     *
     * @return {Promise<void>} Promise that always resolves
     *
     * @instance
     * @private
     * @ignore
     * @memberof! oj.ojCombobox
     */
    _getValueUpdatePromise: function () {
      return Promise.resolve();
    },

    _getDropdown: function () {
      if (this.combobox && this.combobox._opened()) {
        var dropdown = $('.oj-listbox-drop');
        for (var i = 0; i < dropdown.length; i++) {
          if (
            $(dropdown[i]).attr('id') === 'oj-listbox-drop' &&
            $(dropdown[i]).attr('data-oj-containerid') === this.combobox.containerId
          ) {
            return $(dropdown[i]);
          }
        }
      }
      return null;
    },

    _findItem: function (list, value) {
      for (var i = 0; i < list.length; i++) {
        if ($(list[i]).data('ojcombobox').value === value) {
          return list[i];
        }
      }
      return null;
    },

    // ////////////////     SUB-IDS     //////////////////

    /**
     * <p>Sub-ID for the input field</p>
     * @ojsubid oj-combobox-input
     * @memberof oj.ojCombobox
     *
     * @example <caption>Get the input field element</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-combobox-input'});
     */

    /**
     * <p>Sub-ID for the drop down arrow of single-select combobox.</p>
     *
     * @ojsubid oj-combobox-arrow
     * @memberof oj.ojComboboxOne
     *
     * @example <caption>Get the drop down arrow of the combobox</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-combobox-arrow'});
     */

    /**
     * <p>Sub-ID for the list item.</p>
     *
     * @ojsubid oj-listitem
     * @memberof oj.ojCombobox
     *
     * @example <caption>Get the listitem corresponding to value "myVal"</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-listitem', 'value': 'myVal'});
     */

    /**
     * <p>Sub-ID for the remove icon of selected item.</p>
     *
     * @ojsubid oj-combobox-remove
     * @memberof oj.ojComboboxMany
     *
     * @example <caption>Get the element corresponding to the remove icon for the selected item with
     * value "myVal"</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-combobox-remove', 'value': 'myVal'});
     */

    /**
     * <p>Sub-ID for the dropdown box.</p>
     *
     * @ojsubid oj-combobox-drop
     * @deprecated 1.2.0 This sub-ID is not needed since it is not an interactive element.
     * @memberof oj.ojCombobox
     * @ignore
     *
     * @example <caption>Get the dropdown box</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-combobox-drop'});
     */

    /**
     * <p>Sub-ID for the filtered result list.</p>
     *
     * @ojsubid oj-combobox-results
     * @deprecated 1.2.0 This sub-ID is not needed since it is not an interactive element.
     * @memberof oj.ojCombobox
     * @ignore
     *
     * @example <caption>Get the filtered result list</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-combobox-results'});
     */

    /**
     * <p>Sub-ID for the selected items. This returns a
     * list of the selected items.</p>
     *
     * @ojsubid oj-combobox-selection
     * @deprecated 1.2.0 This sub-ID is not needed since it is not an interactive element.
     * @memberof oj.ojComboboxMany
     * @ignore
     *
     * @example <caption>Get the list of selected items</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-combobox-selection'});
     */

    // @inheritdoc
    getNodeBySubId: function (locator) {
      var node = null;
      var subId;
      if (locator == null) {
        return this.combobox && this.combobox.container ? this.combobox.container[0] : null;
      }

      node = this._super(locator);

      if (!node) {
        subId = locator.subId;
        if (subId === 'oj-combobox-drop') {
          subId = 'oj-listbox-drop';
        }

        if (subId === 'oj-combobox-results') {
          subId = 'oj-listbox-results';
        }

        if (subId === 'oj-combobox-selection') {
          subId = 'oj-combobox-selected-choice';
        }

        var dropdown = this._getDropdown();

        switch (subId) {
          case 'oj-combobox-input':
          case 'oj-combobox-arrow':
            node = this.widget().find('.' + subId)[0];
            break;
          case 'oj-listitem':
            if (dropdown) {
              var list = dropdown.find('.oj-listbox-result');
              node = this._findItem(list, locator.value);
            }
            break;
          case 'oj-combobox-remove':
            var selectedItems = this.widget().find('.oj-combobox-selected-choice');
            var item = this._findItem(selectedItems, locator.value);
            node = item ? $(item).find('.oj-combobox-clear-entry-icon')[0] : null;
            break;
          case 'oj-listbox-drop':
            if (dropdown) {
              node = dropdown[0];
            }
            break;
          case 'oj-listbox-results':
            if (dropdown) {
              node = dropdown.find('.' + subId)[0];
            }
            break;
          case 'oj-combobox-selected-choice':
            node = this.widget()
              .find('.' + subId)
              .toArray();
            break;
          default:
            break;
        }
      }

      // Non-null locators have to be handled by the component subclasses
      return node || null;
    },

    /**
     * Returns the subId object for the given child DOM node.  For more details, see
     * <a href="#getNodeBySubId">getNodeBySubId</a>.
     *
     * @expose
     * @override
     * @ignore
     * @memberof oj.ojCombobox
     * @instance
     *
     * @param {!Element} node - child DOM node
     * @return {Object|null} The subId for the DOM node, or <code class="prettyprint">null</code> when none is found.
     *
     * @example <caption>Get the subId for a certain DOM node:</caption>
     * myElement.getSubIdByNode(node);
     */
    getSubIdByNode: function (node) {
      var subId = null;

      if (node != null) {
        var nodeCached = $(node);

        if (nodeCached.hasClass('oj-combobox-input')) {
          subId = { subId: 'oj-combobox-input' };
        } else if (nodeCached.hasClass('oj-combobox-arrow')) {
          subId = { subId: 'oj-combobox-arrow' };
        } else if (nodeCached.hasClass('oj-listbox-result')) {
          subId = { subId: 'oj-listitem', value: nodeCached.data('ojcombobox').value };
        } else if (nodeCached.hasClass('oj-combobox-clear-entry-icon')) {
          subId = {
            subId: 'oj-combobox-remove',
            value: nodeCached.closest('.oj-combobox-selected-choice').data('ojcombobox').value
          };
        } else {
          subId = this._super(node);
        }
      }

      return subId;
    }
  });

  /**
   * @private
   */
  const _OjInputSearchContainer = _ComboUtils.clazz(_OjSingleCombobox, {
    _elemNm: 'ojinputsearch',
    _classNm: 'oj-inputsearch',
    _COMPONENT_CLASSLIST: 'oj-inputsearch oj-component',

    // return the element one which we want to position the listbox-dropdown. We don't
    // want it to be the container because we add the inline messages to the container
    // and if we line up to the container when it has inline messages, the dropdown
    // appears after the inline messages. We want it to always appear next to the input,
    // which is the first child of the container.
    _getDropdownPositionElement: function () {
      return this.container.children().first();
    },

    /**
     * Creates children elements for ojInputSearch
     *
     * @return {jQuery} The collection of HTML elements that represent the content
     *
     * @memberof! _OjInputSearchContainer
     * @instance
     * @protected
     * @override
     */
    _CreateContentElements: function () {
      var contentStructure = [
        "<div class='oj-inputsearch-choice' tabindex='-1' role='presentation'>",
        "   <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off'",
        "       spellcheck='false' class='oj-inputsearch-input' role='combobox' aria-expanded='false' aria-autocomplete='list' />",
        "   <a class='oj-inputsearch-search-button oj-inputsearch-search-icon oj-component-icon oj-clickable-icon-nocontext'",
        "       role='button' aria-label='search'></a>",
        '</div>',
        "<div class='oj-listbox-drop' role='presentation'>",
        "   <ul class='oj-listbox-results' role='listbox' data-oj-context>",
        '   </ul>',
        '</div>',

        "<div role='region' class='oj-helper-hidden-accessible oj-listbox-liveregion' aria-live='polite'></div>"
      ];
      var container = $(contentStructure.join(''));

      var trigger = container.find('.oj-inputsearch-search-button');
      this._attachSearchIconClickHandler(trigger);
      return container;
    },

    _attachSearchIconClickHandler: function (trigger) {
      var self = this;
      trigger
        .on('click', function (event) {
          if (!self._isInterfaceEnabled()) {
            return undefined;
          }

          if (self.opts.manageNewEntry) {
            var value = self.search.val();
            var data = self.opts.manageNewEntry(value);
            var options = {
              trigger: _ComboUtils.ValueChangeTriggerTypes.SEARCH_ICON_CLICKED
            };

            var selectionData = self.selection.data(self._elemNm);
            if (
              (!selectionData && value !== '') ||
              (selectionData && selectionData.label !== value) ||
              (!self.ojContext.isValid() && value !== self._previousDisplayValue)
            ) {
              self._onSelect(data, options, event);
              self._triggerUpdateEvent(data, options, event);
            } else {
              if (selectionData && selectionData.label === value) {
                data = selectionData;
              }

              self._triggerUpdateEvent(data, options, event);
            }
          }
          return false;
        })
        .on('mousedown', function (event) {
          event.stopPropagation();
          return false;
        });
    },

    // _OjInputSearchContainer
    // eslint-disable-next-line no-unused-vars
    _enable: function (enabled) {
      _OjInputSearchContainer.superclass._enable.apply(this, arguments);

      if (this._enabled) {
        this.container.find('.oj-inputsearch-search-button').removeClass('oj-disabled');
      } else {
        this.container.find('.oj-inputsearch-search-button').addClass('oj-disabled');
      }
    },

    // _OjInputSearchContainer
    // Overriding this method to fire the "update" event which is relevant to
    // only InputSearch
    _triggerUpdateEvent: function (data, context, event) {
      var trigger;
      if (context) {
        trigger = context.trigger;
      }

      var options = {
        _context: {
          optionMetadata: {
            trigger: trigger
          }
        }
      };

      var value = this.id(data);
      if (!value || value.length === 0) {
        // If the value is entered by user (not by selecting an option) then
        // only 'label' will be present in the data object.
        value = data.label ? data.label : [];
      }
      // inputSearch is a widget component, and only has synchronous validation
      var parsed = this.ojContext._AsyncValidate(value, event, options);
      if (parsed === undefined || !this.ojContext.isValid()) {
        return;
      }

      if (typeof value === 'string') {
        value = [value];
      }

      var eventData = {
        value: value,
        optionMetadata: {
          trigger: trigger
        }
      };

      this.ojContext._trigger('update', event, eventData);
    },

    // _OjInputSearchContainer
    // eslint-disable-next-line no-unused-vars
    _prepareOpts: function (_opts) {
      var opts = _OjInputSearchContainer.superclass._prepareOpts.apply(this, arguments);

      opts.highlightTermInOptions = function () {
        return true;
      };

      return opts;
    }
  });

  /**
   * @ojcomponent oj.ojInputSearchWidget
   * @ignore
   * @augments oj.editableValue
   * @since 1.2.0
   *
   * @classdesc
   * <h3 id="inputSearchOverview-section">
   *   JET InputSearch Component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputSearchOverview-section"></a>
   * </h3>
   *
   * <p>Description: JET InputSearch enhances a html input into a auto-suggest search input field.</p>
   *
   * <p>A JET InputSearch can be created with the following markup.</p>
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;input list="items" data-bind="ojComponent: {component: 'ojInputSearch'}"/>
   * &lt;datalist id="items">
   *   &lt;option value="option 1">option 1&lt;/option>
   *   &lt;option value="option 2">option 2&lt;/option>
   *   &lt;option value="option 3">option 3&lt;/option>
   *   &lt;option value="option 4">option 4&lt;/option>
   * &lt;/datalist>
   * </code></pre>
   *
   * <p>Static <code class="prettyprint">options</code> array to provide the option items.</p>
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;input data-bind="ojComponent: {component: 'ojInputSearch', options:
   *                                     [{value: 'option1', label: 'option1'}, {value: 'option2', label: 'option2'}]}"/>
   * </code></pre>
   *
   * <p>Options can be provided dynamically based on input instead of statically specifying the options array as shown in the above example</p>
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;input data-bind="ojComponent: {component: 'ojInputSearch', options: function(optionContext) {
   *                                                                           return new Promise(function(fulfill, reject) {
   *                                                                             var term = context.term;
   *
   *                                                                             // Prepare options based on current 'term'.
   *                                                                             var options = [];
   *
   *                                                                             fulfill(options);
   *                                                                           }
   *                                                                         }}"/>
   * </code></pre>
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
   *
   *
   * <h3 id="rtl-section">
   *   Reading direction
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
   * </h3>
   *
   * <p>As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the InputSearch must be <code class="prettyprint">refresh()</code>ed.</p>
   *
   *
   * <h3 id="pseudos-section">
   *   Pseudo-selectors
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
   * </h3>
   *
   * <p>The <code class="prettyprint">:oj-inputsearch</code> pseudo-selector can be used in jQuery expressions to select JET InputSearch.  For example:</p>
   *
   * <pre class="prettyprint">
   * <code>$( ":oj-inputsearch" ) // selects all JET InputSearch on the page
   * $myEventTarget.closest( ":oj-inputsearch" ) // selects the closest ancestor that is a JET InputSearch
   * </code></pre>
   *
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
   * <p>
   * It is up to the application developer to associate the label to the input component.
   * For InputSearch, you should put an <code>id</code> on the input, and then set
   * the <code>for</code> attribute on the label to be the input's id.
   * </p>
   * <h3 id="label-section">
   *   Label and InputSearch
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
   * </h3>
   * <p>
   * If not using the <code class="prettyprint">label-hint</code> attribute, for accessibility, you should associate a label element with the input
   * by putting an <code>id</code> on the input, and then setting the
   * <code>for</code> attribute on the label to be the input's id.
   * </p>
   * <p>
   * The component will decorate its associated label with required and help
   * information, if the <code>required</code> and <code>help</code> options are set.
   * </p>
   * <h3 id="jqui2jet-section">
   *   JET for jQuery UI developers
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
   * </h3>
   *
   * <p>Event names for all JET components are prefixed with "oj", instead of component-specific prefixes like "InputSearch".</p>
   *
   * @desc Creates a JET InputSearch.
   * @example <caption>Initialize the InputSearch with no options specified:</caption>
   * $( ".selector" ).ojInputSearch();
   *
   * @example <caption>Initialize the InputSearch with some options:</caption>
   * $( ".selector" ).ojInputSearch( { "minLength": 2, "placeholder": "Search..." } );
   *
   * @example <caption>Initialize the InputSearch via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
   * &lt;div id="search" data-bind="ojComponent: { component: 'ojInputSearch',
   *                                                    minLength: 2}">
   */

  //-----------------------------------------------------
  //                   Fragments
  //-----------------------------------------------------
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
   *       <td>Input Field</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td> If the drop down is not open, expand the drop down list. Otherwise, close the drop down list
   *       If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *     <tr>
   *       <td>Search Button</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td> Updates the value with the text entered in the input field and fires the <code class="prettyprint">optionChange</code> event which can be used to perform search.</td>
   *     </tr>
   *     <tr>
   *       <td>Option Item</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Tap on a option item in the drop down list to select item.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   * <p>Disabled option items receive no highlight and are not selectable.</p>
   *
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputSearchWidget
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
   *      <td>Input</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td> Select the highlighted choice from the drop down.</td>
   *     </tr>
   *     <tr>
   *      <td>Input</td>
   *       <td><kbd>UpArrow or DownArrow</kbd></td>
   *       <td> Highlight the option item on the drop down list in the direction of the arrow.
   *         If the drop down is not open, expand the drop down list.</td>
   *     </tr>
   *     <tr>
   *      <td>Input</td>
   *       <td><kbd>Esc</kbd></td>
   *       <td> Collapse the drop down list. If the drop down is already closed, do nothing.</td>
   *     </tr>
   *     <tr>
   *        <td>Input</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the input. If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   * <p>Disabled option items receive no highlight and are not selectable.</p>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputSearchWidget
   */

  //-----------------------------------------------------
  //                   Styling
  //-----------------------------------------------------

  // ------------------------------ oj-listbox-header ---------------------------------
  /**
   * Optional. Custom header options can be added to the drop down through this styling.
   * @ojstyleclass oj-listbox-header
   * @ojdisplayname Custom Header
   * @memberof oj.ojInputSearchWidget
   */
  // ------------------------------ oj-listbox-highlighter-section ---------------------------------
  /**
   * Optional. Styling to control the which part of the option label has to be considered for highlighting.
   * @ojstyleclass oj-listbox-highlighter-section
   * @ojdisplayname Highlighting Control
   * @memberof oj.ojInputSearchWidget
   */
  oj.__registerWidget('oj.ojInputSearch', $.oj.editableValue, {
    defaultElement: '<input>',
    widgetEventPrefix: 'oj',
    options: {
      /**
       * The placeholder text to set on the element. Though it is possible to set placeholder
       * attribute on the element itself, the component will only read the value when the component
       * is created. Subsequent changes to the element's placeholder attribute will not be picked up
       * and page authors should update the option directly.
       *
       *
       * @example <caption>Initialize the InputSearch with the <code class="prettyprint">placeholder</code> option specified:</caption>
       * $( ".selector" ).ojInputSearch( { "placeholder": "Search ..." } );
       *
       * @default when the option is not set, the element's placeholder attribute is used if it exists.
       *
       * @expose
       * @access public
       * @instance
       * @memberof! oj.ojInputSearchWidget
       * @type {string|null|undefined}
       */
      placeholder: undefined,
      /**
       * <p>
       * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
       * This is the default.
       * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
       * </p>
       * <p>
       * In the Alta theme the input's label will render a required icon. In the Redwood theme, by default,
       * a Required text is rendered inline when the field is empty.  If user-assistance-density is 'compact', it will show on the label as an icon.
       * </p>
       * <p>The Required error text is based on Redwood UX designs, and it is not recommended that
       * it be changed.
       * To override the required error message,
       * use the <code class="prettyprint">translations.required</code> attribute.
       * The component's label text is passed in as a token {label} and can be used in the message detail.
       * </p>
       * <p>When required is set to true, an implicit
       * required validator is created, i.e.,
       * <code class="prettyprint">new RequiredValidator()</code>. The required validator is the only
       * validator to run during initial render, and its error is not shown to the user at this time;
       * this is called deferred validation. The required validator also runs during normal validation;
       * this is when the errors are shown to the user.
       * See the <a href="#validation-section">Validation and Messaging</a> section for details.
       * </p>
       * <p>
       * When the <code class="prettyprint">required</code> property changes due to programmatic intervention,
       * the component may clear component messages and run validation, based on the current state it's in. </br>
       *
       * <h4>Running Validation when required property changes</h4>
       * <ul>
       * <li>if component is valid when required is set to true, then it runs deferred validation on
       * the value property. If the field is empty, the valid state is invalidHidden. No errors are
       * shown to the user.
       * </li>
       * <li>if component is invalid and has deferred messages when required is set to false, then
       * component messages are cleared (messages-custom messages are not cleared)
       * but no deferred validation is run because required is false.
       * </li>
       * <li>if component is invalid and currently showing invalid messages when required is set, then
       * component messages are cleared and normal validation is run using the current display value.
       * <ul>
       *   <li>if there are validation errors, then <code class="prettyprint">value</code>
       *   property is not updated and the error is shown.
       *   </li>
       *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
       *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
       *   event on the component to clear custom errors.</li>
       * </ul>
       * </li>
       * </ul>
       *
       * <h4>Clearing Messages when required property changes</h4>
       * <ul>
       * <li>Only messages created by the component, like validation messages, are cleared when the required property changes.</li>
       * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
       * </ul>
       *
       * </p>
       * @example <caption>Initialize the component with the <code class="prettyprint">required</code> option:</caption>
       * $(".selector").ojInputSearch({required: true});<br/>
       * @example <caption>Initialize <code class="prettyprint">required</code> option from html attribute 'required':</caption>
       * &lt;input list="browsers" required/><br/>
       * // retreiving the required option returns true
       * $(".selector").ojInputSearch("option", "required");<br/>
       *
       * @example <caption>Customize messages and hints used by implicit required validator when
       * <code class="prettyprint">required</code> option is set:</caption>
       * &lt;input list="browsers" required data-bind="ojComponent: {
       *   component: 'ojInputSearch',
       *   value: password,
       *   translations: {'required': {
       *                 hint: 'custom: enter at least 3 alphabets',
       *                 messageSummary: 'custom: \'{label}\' is Required',
       *                 messageDetail: 'custom: please enter a valid value for \'{label}\''}}}"/\>
       * @expose
       * @access public
       * @instance
       * @default when the option is not set, the element's required property is used as its initial value if it exists.
       * @memberof! oj.ojInputSearchWidget
       * @type {boolean}
       * @default false
       * @since 0.7.0
       * @see #translations
       */
      required: false,

      /**
       * The id of the html list for the InputSearch.
       *
       * @example <caption>Initialize the InputSearch with the <code class="prettyprint">list</code> option specified:</caption>
       * $( ".selector" ).ojInputSearch( { "list": "list" } );
       *
       * @example <caption>The <code class="prettyprint">list</code> points to a html <code class="prettyprint">ul</code> element.
       * The value for the list item should be specified with <code class="prettyprint">oj-data-value</code> field. By default, we use the first text node for search filtering. An optional <code class="prettyprint">oj-data-label</code> field can be added to the list item, in which case it will take precedence over the text node.</caption>
       * &lt;ul id="list"&gt;
       * &lt;li oj-data-value="li1"&gt;Item 1&lt;/li&gt;
       * &lt;li oj-data-value="li2"&gt;Item 2&lt;/li&gt;
       * &lt;/ul&gt;
       *
       * @expose
       * @memberof! oj.ojInputSearchWidget
       * @instance
       * @type {string|null|undefined}
       */
      list: undefined,

      /**
       * The option items for the InputSearch. Options can be specified as an array of objects containing value and label.
       * The value is used as the value of the option item and label as the label. Both should be of string type.
       * Group data can be provided with label and a children array containing the option items.
       * Option item can be set as disabled.
       *
       * <p>Options can be provided dynamically based on the text typed in the input field
       * by specifying a function as <code class="prettyprint">options</code> instead of static array.
       * This function will be invoked when there is a change in input field and it should return a <code class="prettyprint">Promise</code>.
       * The return type should be an array of objects containing value and label as similar to the static array as mentioned above.</p>
       *
       * <p>The context paramter passed to the <code class="prettyprint">options</code> function contains the following keys:</p>
       * <table class="keyboard-table">
       *   <thead>
       *     <tr>
       *       <th>Key</th>
       *       <th>Description</th>
       *     </tr>
       *   </thead>
       *   <tbody>
       *     <tr>
       *       <td><kbd>component</kbd></td>
       *       <td>A reference to the InputSearch widget constructor.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>term</kbd></td>
       *       <td>The text based on which options have to be filtered.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>value</kbd></td>
       *       <td>The same options callback function will be used get the value-label object when <code class="prettyprint">value</code> is set programmatically. In such cases context object will have <code class="prettyprint">value</code> instead of <code class="prettyprint">term</code>. Value will be of type Array and when this key is passed in the context, callback function should return array of options for all values.</td>
       *     </tr>
       *   </tbody>
       * </table>
       *
       * @expose
       * @memberof! oj.ojInputSearchWidget
       * @instance
       * @type {Array|function(Object)}
       *
       * @example <caption>Initialize the InputSearch with the <code class="prettyprint">options</code> specified:</caption>
       * $( ".selector" ).ojInputSearch( { "options": [{value: 'option1', label: 'option1'}, {value: 'option2', label: 'option2', disabled: true}, {value: 'option3', label: 'option3'}] } );
       *
       * @example <caption>Initialize the InputSearch with group data:</caption>
       * $( ".selector" ).ojInputSearch( { "options": [{label : 'group1', children: [{value: 'option1', label: 'option1'}, {value: 'option2', label: 'option2'}]}, {label: 'group2', children: [{value: 'option3', label: 'option3'}]} ] } );
       *
       * @example <caption>Initialize the InputSearch <code class="prettyprint">options</code> with a function:</caption>
       * $( ".selector" ).ojInputSearch({ "options": function(optionContext) {
       *                                               return new Promise(function(fulfill, reject) {
       *                                                 var term = context.term;
       *
       *                                                 // Prepare options based on current 'term'.
       *                                                 var options = [];
       *
       *                                                 fulfill(options);
       *                                               }
       *                                             }});
       */
      options: null,

      /**
       * Specify the key names to use in the options array.
       *
       * @expose
       * @memberof! oj.ojInputSearchWidget
       * @instance
       * @type {Object}
       *
       * @example <caption>Initialize the InputSearch with <code class="prettyprint">optionsKeys</code> specified. This allows the key names to be redefined in the options array.</caption>
       * $( ".selector" ).ojInputSearch( { "optionsKeys": {value : "state_abbr", label : "state_name"} } );
       *
       * @example <caption>Redefine keys for data with subgroups.</caption>
       * $( ".selector" ).ojInputSearch( { "optionsKeys": {label : "regions", children : "states", childKeys : {value : "state_abbr", label : "state_name"}} } );
       */
      optionsKeys: null,

      /**
       * <p>Attributes specified here will be set on the picker DOM element when it's launched.
       * <p>The supported attribute is <code class="prettyprint">class</code>, which is appended to the picker's class, if any.
       * Note: 1) pickerAttributes is not applied in the native theme.
       * 2) setting this option after component creation has no effect.
       *
       * @example <caption>Initialize the inputSearch specifying the class attribute to be set on the picker DOM element:</caption>
       * $( ".selector" ).ojInputSearch({ "pickerAttributes": {
       *   "class": "my-class"
       * }});
       *
       * @example <caption>Get the <code class="prettyprint">pickerAttributes</code> option, after initialization:</caption>
       * // getter
       * var inputSearch = $( ".selector" ).ojInputSearch( "option", "pickerAttributes" );
       *
       * @expose
       * @memberof! oj.ojInputSearchWidget
       * @instance
       * @type {?Object}
       * @default <code class="prettyprint">null</code>
       */
      pickerAttributes: null,

      /**
       * The renderer function that renders the content of an each option.
       * The function must return a DOM element representing the content of the option.
       * If the developer chooses to manipulate the option content directly,
       * the function should return nothing.
       *
       * <p>The <code class="prettyprint">optionRenderer</code> decides only
       * how the options' content has to be rendered in the drop down.
       * Once an option is selected from the drop down,
       * what value has to be displayed in the in input field is decided by the
       * label field in the data object. See <a href="#options">options</a>
       * and <a href="#optionsKeys">optionsKeys</a> for configuring option label and value.
       * </p>
       *
       * <p>The context paramter passed to the renderer contains the following keys:</p>
       * <table class="keyboard-table">
       *   <thead>
       *     <tr>
       *       <th>Key</th>
       *       <th>Description</th>
       *     </tr>
       *   </thead>
       *   <tbody>
       *     <tr>
       *       <td><kbd>component</kbd></td>
       *       <td>A reference to the InputSearch widget constructor.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>parent</kbd></td>
       *       <td>The parent of the data item. The parent is null for root node.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>index</kbd></td>
       *       <td>The index of the option, where 0 is the index of the first option. In the hierarchical case the index is relative to its parent.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>depth</kbd></td>
       *       <td>The depth of the option. The depth of the first level children under the invisible root is 0.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>leaf</kbd></td>
       *       <td>Whether the option is a leaf or a group.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>data</kbd></td>
       *       <td>The data object for the option.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>parentElement</kbd></td>
       *       <td>The option label element.  The renderer can use this to directly append content.</td>
       *     </tr>
       *   </tbody>
       * </table>
       *
       * @expose
       * @memberof! oj.ojInputSearchWidget
       * @instance
       * @type {function(Object)|null}
       * @default <code class="prettyprint">null</code>
       *
       * @example <caption>Initialize the InputSearch with a renderer:</caption>
       * $( ".selector" ).ojInputSearch({ "optionRenderer": function(optionContext) {
       *                                                      return optionContext['data']['FIRST_NAME'];}});
       *
       * @example <caption>Get or set the <code class="prettyprint">renderer</code> option, after initialization:</caption>
       * // set the renderer function
       * $( ".selector" ).ojInputSearch( "option", "optionRenderer", myFunction});
       */
      optionRenderer: null,

      /**
       * The knockout template used to render the content of the option in drop down.
       *
       * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
       * component option.
       *
       * @ojbindingonly
       * @name optionTemplate
       * @memberof! oj.ojInputSearchWidget
       * @instance
       * @type {string|null}
       * @default <code class="prettyprint">null</code>
       *
       * @example <caption>Specify the <code class="prettyprint">template</code> when initializing InputSearch:</caption>
       * // set the template
       * &lt;ul id="inputsearch" data-bind="ojComponent: {component: 'ojInputSearch', optionTemplate: 'my_template'}"&gt;&lt;/ul&gt;
       */

      /**
       * The minimum number of characters a user must type before a options
       * filtering is performed. Zero is useful for local data with just a few items,
       * but a higher value should be used when a single character search could match a few thousand items.
       *
       * @expose
       * @memberof! oj.ojInputSearchWidget
       * @instance
       * @type {?number}
       * @default <code class="prettyprint">0</code>
       *
       * @example <caption>Initialize the InputSearch with the <code class="prettyprint">minLength</code> option specified:</caption>
       * $( ".selector" ).ojInputSearch( { "minLength": 2 } );
       */
      minLength: 0,

      /**
       * Triggered immediately before the InputSearch drop down is expanded.
       *
       * @expose
       * @event
       * @memberof! oj.ojInputSearchWidget
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       *
       * @example <caption>Initialize the InputSearch with the <code class="prettyprint">beforeExpand</code> callback specified:</caption>
       * $( ".selector" ).ojInputSearch({
       *     "beforeExpand": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeexpand</code> event:</caption>
       * $( ".selector" ).on( "ojbeforeexpand", function( event, ui ) {} );
       */
      beforeExpand: null,

      /**
       * <p>The  <code class="prettyprint">rawValue</code> is the read-only option for retrieving
       * the currently displayed value from the input field in text form.</p>
       * <p>
       * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
       * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed.
       * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2',
       * ..., and finally '1,200'. Then when the user blurs or presses
       * Enter the <code class="prettyprint">value</code> option gets updated.
       * </p>
       * <p>This is a read-only option so page authors cannot set or change it directly.</p>
       * @expose
       * @access public
       * @instance
       * @memberof! oj.ojInputSearchWidget
       * @type {string|undefined}
       * @since 2.0.2
       * @readonly
       */
      rawValue: undefined,

      /**
       * Fired whenever a component option changes, whether due to user interaction or programmatic
       * intervention.  If the new value is the same as the previous value, no event will be fired.  The event
       * listener will receive two parameters described below:
       *
       * @expose
       * @event
       * @memberof! oj.ojInputSearchWidget
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui event payload
       * @property {string} ui.option the name of the option that is changing
       * @property {Object} ui.previousValue - an Object holding the previous value of the option.
       * When previousValue is not a primitive type, i.e., is an Object, it may hold the same value as
       * the value property.
       * @property {Object} ui.value - an Object holding the current value of the option.
       * @property {?Object} ui.subproperty - an Object holding information about the subproperty that changed.
       * @property {string} ui.subproperty.path - the subproperty path that changed.
       * @property {Object} ui.subproperty.previousValue - an Object holding the previous value of the subproperty.
       * @property {Object} ui.subproperty.value - an Object holding the current value of the subproperty.
       * @property {Object} ui.optionMetadata information about the option that is changing
       * @property {string} ui.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
       *           <code class="prettyprint">"shouldNotWrite"</code>.  For use by the JET writeback mechanism.
       * @property {string} ui.optionMetadata.trigger This property indicates the what triggered the
       *           <code class="prettyprint">value</code> option change. Possible trigger types are:
       *             <code class="prettyprint">enter_pressed</code>,
       *             <code class="prettyprint">option_selected</code>,
       *             <code class="prettyprint">blur</code> and
       *             <code class="prettyprint">search_icon_clicked</code>
       *
       * @example <caption>Initialize component with the <code class="prettyprint">optionChange</code> callback</caption>
       * $(".selector").ojInputSearch({
       *   'optionChange': function (event, ui) {
       *        if (ui['option'] === 'value') { // handle value change }
       *    }
       * });
       * @example <caption>Bind an event listener to the ojoptionchange event</caption>
       * $(".selector").on({
       *   'ojoptionchange': function (event, ui) {
       *       window.console.log("option that changed is: " + ui['option']);
       *   };
       * });
       */
      optionChange: null,

      /**
       * <p>Fired whenever the value is submitted by the user.</p>
       *
       * <p>This event is similar to the <code class="prettyprint">value</code>
       * <a href="#event:optionChange">optionChange</a> event. The optionChange
       * event will be fired only if there is a change in the value,
       * but the <code class="prettyprint">update</code> event will be fired
       * even if there is no change in the value. This will help the
       * application to re-submit the search query for the same value.</p>
       *
       * <p><code class="prettyprint">update</code> event will be fired after the
       * 'value' <code class="prettyprint">optionChange</code> event.</p>
       *
       * @expose
       * @event
       * @memberof! oj.ojInputSearchWidget
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {Object} ui.value - an Object holding the current value.
       * @property {Object} ui.optionMetadata information about the event.
       * @property {string} ui.optionMetadata.trigger This property indicates the what triggered the
       *             <code class="prettyprint">update</code> event. Possible trigger types are:
       *             <code class="prettyprint">enter_pressed</code>,
       *             <code class="prettyprint">option_selected</code> and
       *             <code class="prettyprint">search_icon_clicked</code>
       *
       * @example <caption>Initialize component with the <code class="prettyprint">update</code> callback</caption>
       * $(".selector").ojInputSearch({
       *   'update': function (event, data) {
       *        // handle update event
       *    }
       * });
       * @example <caption>Bind an event listener to the ojupdate event</caption>
       * $(".selector").on({
       *   'ojupdate': function (event, data) {
       *       window.console.log("Update event fired");
       *   };
       * });
       */
      update: null,
      /**
       * List of validators used by component when performing validation. Each item is either an
       * instance that duck types {@link oj.Validator}, or is an Object literal containing the
       * properties listed below. Implicit validators created by a component when certain options
       * are present (e.g. <code class="prettyprint">required</code> option), are separate from
       * validators specified through this option. At runtime when the component runs validation, it
       * combines the implicit validators with the list specified through this option.
       * <p>
       * Hints exposed by validators are shown inline by default in the Redwood theme when the
       * field has focus.
       * In the Alta theme, validator hints are shown in a notewindow on focus,
       * or as determined by the
       * 'validatorHint' property set on the <code class="prettyprint">display-options</code>
       * attribute.
       * In either theme, you can turn off showing validator hints by using the
       * 'validatorHint' property set to 'none' on the <code class="prettyprint">display-options</code>
       * attribute.
       * </p>
       *
       * <p>
       * When <code class="prettyprint">validators</code> option changes due to programmatic
       * intervention, the component may decide to clear messages and run validation, based on the
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
       * <li>if component is valid when validators changes, component does nothing other than the
       * steps it always performs.</li>
       * <li>if component is invalid and is showing messages when
       * <code class="prettyprint">validators</code> changes then all component messages are cleared
       * and full validation run using the display value on the component.
       * <ul>
       *   <li>if there are validation errors, then <code class="prettyprint">value</code>
       *   option is not updated and the error is shown.
       *   </li>
       *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
       *   option is updated; page author can listen to the <code class="prettyprint">optionChange</code>
       *   event on the <code class="prettyprint">value</code> option to clear custom errors.</li>
       * </ul>
       * </li>
       * <li>if component is invalid and has deferred messages when validators changes, it does
       * nothing other than the steps it performs always.</li>
       * </ul>
       * </p>
       *
       * <h4>Clearing Messages</h4>
       * <ul>
       * <li>Only messages created by the component are cleared.</li>
       * <li><code class="prettyprint">messagesCustom</code> option is not cleared.</li>
       * </ul>
       * </p>
       *


       *
       * @example <caption>Initialize the component with validator object literal:</caption>
       * $(".selector").ojInputSearch({
       *   validators: [{
       *     type: 'regExp',
       *     options : {
       *       pattern: '[a-zA-Z0-9]{3,}'
       *     }
       *   }],
       * });
       *
       * NOTE: oj.Validation.validatorFactory('numberRange') returns the validator factory that is used
       * to instantiate a range validator for numbers.
       *
       * @example <caption>Initialize the component with multiple validator instances:</caption>
       * var validator1 = new MyCustomValidator({'foo': 'A'});
       * var validator2 = new MyCustomValidator({'foo': 'B'});
       * $(".selector").ojInputSearch({
       *   value: 'option',
       *   validators: [validator1, validator2]
       * });
       *
       * @expose
       * @access public
       * @instance
       * @memberof! oj.ojInputSearchWidget
       * @type {Array|undefined}
       */
      validators: undefined

      /**
       * The type of value is an array, and an array will always be returned from the component.
       * The first element of the array will be used as the value.
       * As a convenience we allow a string to be passed into the setter,
       * but note that the value option can only be bound to a knockout observableArray.
       *
       * @example <caption>Initialize the InputSearch with the <code class="prettyprint">value</code> option specified:</caption>
       * $(".selector").ojInputSearch({'value': "option"});<br/>
       *
       * @example <caption>Get or set the <code class="prettyprint">value</code> option, after initialization:</caption>
       * // Getter: returns value
       * $(".selector").ojInputSearch("option", "value");
       * // Setter: sets value with array containing "option1"
       * $(".selector").ojInputSearch("option", "value", ["option1"]);
       * // Setter: sets value with string "option1"
       * $(".selector").ojInputSearch("option", "value", "option1");
       *
       * @member
       * @name  value
       * @access public
       * @instance
       * @default When the option is not set, the element's value property is used as its initial value if it exists.
       * @memberof! oj.ojInputSearchWidget
       * @type {string|Array}
       */
    },

    /**
     * Returns a jQuery object containing the element visually representing the InputSearch.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof! oj.ojInputSearchWidget
     * @instance
     * @return {jQuery} the ojInputSearch
     */
    widget: function () {
      return this.inputSearch.container;
    },
    /**
     * @override
     * @private
     */
    _ComponentCreate: function () {
      this._super();
      this._setup();
    },

    _InitOptions: function (originalDefaults, constructorOptions) {
      var props = [
        { attribute: 'disabled', validateOption: true },
        { attribute: 'placeholder' },
        { attribute: 'required', coerceDomValue: true, validateOption: true },
        { attribute: 'title' }
      ];

      this._super(originalDefaults, constructorOptions);
      ojeditablevalue.EditableValueUtils.initializeOptionsFromDom(props, constructorOptions, this);

      if (this.options.value === undefined) {
        this.options.value =
          this.element.attr('value') !== undefined
            ? _ComboUtils.splitVal(this.element.val(), ',')
            : null;
      } else {
        var value = this.options.value;
        if (Array.isArray(value)) {
          value = value.slice(0);
        } else if (typeof value === 'string') {
          value = [value];
        }
        this.options.value = value;
      }
    },
    /**
     * Performs post processing after _SetOption() is called. Different options when changed perform
     * different tasks. See _AfterSetOption[OptionName] method for details.
     *
     * @param {string} option
     * @param {Object|string=} previous
     * @param {Object=} flags
     * @protected
     * @memberof! oj.ojInputSearchWidget
     * @instance
     * @override
     */
    // eslint-disable-next-line no-unused-vars
    _AfterSetOption: function (option, previous, flags) {
      this._superApply(arguments);
      switch (option) {
        case 'required':
          this._AfterSetOptionRequired(option);
          break;
        case 'validators':
          this._AfterSetOptionValidators(option);
          break;
        default:
          break;
      }
    },
    /**
     * Whether the component is required.
     *
     * @return {boolean} true if required; false
     *
     * @memberof! oj.ojInputSearchWidget
     * @instance
     * @protected
     * @override
     */
    _IsRequired: function () {
      return this.options.required;
    },
    /**
     * Performs post processing after required option is set by taking the following steps.
     *
     * - if component is invalid and has messgesShown -> required: false/true -> clear component errors;
     * run full validation with UI value (we don't know if the UI error is from a required validator
     * or something else);<br/>
     * &nbsp;&nbsp;- if there are validation errors, then value not pushed to model; messagesShown is
     * updated<br/>
     * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to
     * listen to optionChange(value) to clear custom errors.<br/>
     *
     * - if component is invalid and has messagesHidden -> required: false -> clear component
     * errors; no deferred validation is run.<br/>
     * - if component has no error -> required: true -> run deferred validation (we don't want to flag
     * errors unnecessarily)<br/>
     * - messagesCustom is never cleared<br/>
     *
     * @param {string} option
     *
     * @memberof! oj.ojInputSearchWidget
     * @instance
     * @protected
     */
    _AfterSetOptionRequired: ojeditablevalue.EditableValueUtils._AfterSetOptionRequired,
    /**
     * When validators option changes, take the following steps.
     *
     * - Clear the cached normalized list of all validator instances. push new hints to messaging.<br/>
     * - if component is valid -> validators changes -> no change<br/>
     * - if component is invalid has messagesShown -> validators changes -> clear all component
     * messages and re-run full validation on displayValue. if there are no errors push value to
     * model;<br/>
     * - if component is invalid has messagesHidden -> validators changes -> do nothing; doesn't change
     * the required-ness of component <br/>
     * - messagesCustom is not cleared.<br/>
     *
     * NOTE: The behavior applies to any option that creates implicit validators - min, max, pattern,
     * etc. Components can call this method when these options change.
     *
     * @memberof! oj.ojInputSearchWidget
     * @instance
     * @protected
     */
    _AfterSetOptionValidators: ojeditablevalue.EditableValueUtils._AfterSetOptionValidators,
    /**
     * @memberof! oj.ojInputSearchWidget
     * @instance
     * @private
     */
    _refreshRequired: ojeditablevalue.EditableValueUtils._refreshRequired,
    /**
     * This returns an array of all validators
     * normalized from the validators option set on the component. <br/>
     * @return {Array} of validators.
     * @memberof! oj.ojInputSearchWidget
     * @instance
     * @protected
     */
    _GetNormalizedValidatorsFromOption: ojeditablevalue.EditableValueUtils._GetNormalizedValidatorsFromOption,

    /**
     * Called to find out if aria-required is unsupported.
     * @memberof! oj.ojInputSearchWidget
     * @instance
     * @protected
     */
    _AriaRequiredUnsupported: function () {
      return false;
    },
    /**
     * @memberof! oj.ojInputSearchWidget
     * @instance
     * @private
     */
    _setup: function () {
      var opts = {};
      opts.element = this.element;
      opts.ojContext = this;
      opts.inputSearch = true;
      opts = $.extend(this.options, opts);

      // Not used by inputsearch but this is used by selectcombobox
      // adding an empty object here so as to not break the inputsearch
      // widget.
      this.cssOptionDefaults = {};

      this.inputSearch = new _OjInputSearchContainer();
      this.inputSearch._init(opts);
      this._refreshRequired(this.options.required);
    },

    /**
     * @override
     * @private
     */
    _destroy: function () {
      this.inputSearch._destroy();
      this._super();
    },

    /**
     * Refreshes the InputSearch.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof! oj.ojInputSearchWidget
     * @instance
     */
    refresh: function () {
      this._super();

      this.inputSearch._destroy();
      this._setup();
      this._SetRootAttributes();
    },

    /**
     * Handles options specific to InputSearch.
     * @override
     * @protected
     * @memberof! oj.ojInputSearchWidget
     */
    _setOption: function (key, _value, flags) {
      var value = _value;
      if (key === 'value') {
        // clone the value, otherwise _setDisplayValue will not be invoked on binding value to ko observableArray.
        // TODO: Need to revisit this once 18724975 is fixed.

        if (value != null) {
          if (Array.isArray(value)) {
            value = value.slice(0);
          } else if (typeof value === 'string') {
            value = [value];
          } else {
            Logger.error('ojInputSearch value has to be an array of string or a string.');
          }
        }

        // valueChangeTrigger will be used while setting the display value.
        if (flags && flags._context && flags._context.optionMetadata) {
          this.inputSearch.valueChangeTrigger = flags._context.optionMetadata.trigger;
        } else {
          this.inputSearch.valueChangeTrigger = null;
        }
      }

      this._super(key, value, flags);

      if (key === 'options') {
        this.inputSearch.opts.options = value;
        this.inputSearch.opts = this.inputSearch._prepareOpts(this.inputSearch.opts);
      }

      if (key === 'disabled') {
        if (value) {
          this.inputSearch._disable();
        } else {
          this.inputSearch._enable();
        }
      }
    },

    _NotifyDetached: function () {
      this._superApply(arguments);
      this.inputSearch.close();
    },

    // 19670748, dropdown popup should be closed on subtreeHidden notification.
    _NotifyHidden: function () {
      this._superApply(arguments);
      this.inputSearch.close();
    },

    /**
     * Updates display value of InputSearch.
     * @override
     * @protected
     * @memberof! oj.ojInputSearchWidget
     */
    // eslint-disable-next-line no-unused-vars
    _SetDisplayValue: function (displayValue) {
      this.inputSearch._initSelection();
    },

    /**
     * Set the placeholder.
     * @override
     * @protected
     * @memberof! oj.ojInputSearchWidget
     */
    _SetPlaceholder: function (value) {
      if (this.inputSearch) {
        this.inputSearch.opts.placeholder = value;
        if (this.inputSearch._setPlaceholder) {
          this.inputSearch._setPlaceholder();
        }
      }
    },

    /**
     * Validates the component's value using the converter and all validators registered on
     * the component.
     * @return {boolean} true if component passed validation,
     * false if there were validation errors.
     * @example <caption>Validate component using its current value.</caption>
     * // validate display value.
     * $(.selector).ojInputSearch('validate');
     *
     * @expose
     * @override
     * @memberof! oj.ojInputSearchWidget
     * @instance
     */
    validate: function () {
      var displayValue = this.inputSearch.search.val();
      var newValue = null;

      var existingValue = [];
      if (this.isValid()) {
        existingValue = this.inputSearch.getVal();
      }

      if (displayValue === undefined || displayValue === null || displayValue === '') {
        newValue = existingValue;
      } else {
        newValue = [displayValue];
      }

      return this._SetValue(newValue, null, this._VALIDATE_METHOD_OPTIONS);
    },

    /**
     * Parses the value using the converter set and returns the parsed value. If parsing fails the
     * error is written into the element
     *
     * @override
     * @protected
     * @memberof! oj.ojInputSearchWidget
     * @instance
     */
    _parseValue: function (submittedValue) {
      var parsedVal = [];
      var parsed;

      if (submittedValue == null) {
        return parsedVal;
      }

      if (Array.isArray(submittedValue)) {
        for (var i = 0; i < submittedValue.length; i++) {
          parsed = this._super(submittedValue[i]);
          parsedVal.push(parsed.toString());
        }
      } else if (typeof submittedValue === 'string') {
        parsed = this._super(submittedValue);
        parsedVal.push(parsed.toString());
      } else {
        Logger.error('ojInputSearch value has to be an array of string or a string.');
      }

      return parsedVal;
    },

    /**
     * Returns the jquery element that represents the content part of the component.
     * This is usually the component that user sets focus on (tabindex is set 0) and
     * where aria attributes like aria-required, aria-labelledby etc. are set. This is
     * also the element where the new value is updated. Usually this is the same as
     * the _GetMessagingLauncherElement.
     *
     * @override
     * @protected
     * @memberof! oj.ojInputSearchWidget
     * @return {jQuery} jquery element which represents the content.
     */
    _GetContentElement: function () {
      return this.inputSearch.search;
    },

    /**
     * Returns the default styleclass for the component.
     *
     * @return {string}
     * @expose
     * @memberof! oj.ojInputSearchWidget
     * @override
     * @protected
     */
    _GetDefaultStyleClass: function () {
      return 'oj-inputsearch';
    },

    /**
     * ojInputSearchWidget does not have asynchronous value updates, but to have consistent
     * signature with ojSelect this method return a Promise that always resolves.
     *
     * @return {Promise<void>} Promise that always resolves
     *
     * @instance
     * @private
     * @ignore
     * @memberof! oj.ojInputSearchWidget
     */
    _getValueUpdatePromise: function () {
      return Promise.resolve();
    },

    _getDropdown: function () {
      if (this.inputSearch && this.inputSearch._opened()) {
        var dropdown = $('.oj-listbox-drop');
        for (var i = 0; i < dropdown.length; i++) {
          if (
            $(dropdown[i]).attr('id') === 'oj-listbox-drop' &&
            $(dropdown[i]).attr('data-oj-containerid') === this.inputSearch.containerId
          ) {
            return $(dropdown[i]);
          }
        }
      }
      return null;
    },

    /**
     * Opens the InputSearch drop-down.
     *
     * @expose
     * @memberof oj.ojInputSearchWidget
     * @instance
     */
    expand: function () {
      this.inputSearch.open();
    },

    /**
     * Closes the InputSearch drop-down.
     *
     * @expose
     * @memberof oj.ojInputSearchWidget
     * @instance
     */
    collapse: function () {
      this.inputSearch.close();
    },

    // ////////////////     SUB-IDS     //////////////////

    /**
     * <p>Sub-ID for the input field
     *
     * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
     * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.
     *
     * @ojsubid
     * @member
     * @name oj-inputsearch-input
     * @memberof oj.ojInputSearchWidget
     * @instance
     *
     * @example <caption>Get the input field element</caption>
     * var node = $( ".selector" ).ojInputSearch( "getNodeBySubId", {'subId': 'oj-inputsearch-input'} );
     */

    /**
     * <p>Sub-ID for the search icon of InputSearch.
     *
     * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
     * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.
     *
     * @ojsubid
     * @member
     * @name oj-inputsearch-search
     * @memberof oj.ojInputSearchWidget
     * @instance
     *
     * @example <caption>Get the search icon of the InputSearch</caption>
     * var node = $( ".selector" ).ojInputSearch( "getNodeBySubId", {'subId': 'oj-inputsearch-search'} );
     */

    /**
     * <p>Sub-ID for the list item.</p>
     *
     * @ojsubid oj-listitem
     * @memberof oj.ojInputSearchWidget
     *
     * @example <caption>Get the listitem corresponding to value "myVal"</caption>
     * var node = $( ".selector" ).ojInputSearch( "getNodeBySubId", {'subId': 'oj-listitem', 'value': 'myVal'} );
     */

    getNodeBySubId: function (locator) {
      var node = null;
      var subId;
      if (locator === null) {
        return this.inputSearch.container ? this.inputSearch.container[0] : null;
      }

      node = this._super(locator);

      if (!node) {
        subId = locator.subId;
        if (subId === 'oj-inputsearch-search') {
          subId = 'oj-inputsearch-search-button';
        }

        switch (subId) {
          case 'oj-inputsearch-input':
          case 'oj-inputsearch-search-button':
            node = this.widget().find('.' + subId)[0];
            break;
          case 'oj-listitem':
            var dropdown = this._getDropdown();
            if (dropdown) {
              var list = dropdown.find('.oj-listbox-result');
              node = this.inputSearch._findItem(list, locator.value);
            }
            break;
          default:
            break;
        }
      }

      // Non-null locators have to be handled by the component subclasses
      return node || null;
    },

    /**
     * Returns the subId object for the given child DOM node.  For more details, see
     * <a href="#getNodeBySubId">getNodeBySubId</a>.
     *
     * @expose
     * @override
     * @ignore
     * @memberof oj.ojInputSearchWidget
     * @instance
     *
     * @param {!Element} node - child DOM node
     * @return {Object|null} The subId for the DOM node, or <code class="prettyprint">null</code> when none is found.
     *
     * @example <caption>Get the subId for a certain DOM node:</caption>
     * var subId = $( ".selector" ).ojInputSearch( "getSubIdByNode", node );
     */
    getSubIdByNode: function (node) {
      var subId = null;

      if (node != null) {
        var nodeCached = $(node);

        if (nodeCached.hasClass('oj-inputsearch-input')) {
          subId = { subId: 'oj-inputsearch-input' };
        } else if (nodeCached.hasClass('oj-inputsearch-search-button')) {
          subId = { subId: 'oj-inputsearch-search' };
        } else if (nodeCached.hasClass('oj-listbox-result')) {
          subId = { subId: 'oj-listitem', value: nodeCached.data('ojinputsearch').value };
        } else {
          subId = this._super(node);
        }
      }
      return subId;
    }
  });

  /**
   * @private
   */
  const _OjMultiSelect = _ComboUtils.clazz(_AbstractMultiChoice, {
    _elemNm: 'ojselect',
    _classNm: 'oj-select',
    _userTyping: false,
    _COMPONENT_CLASSLIST: 'oj-select oj-select-multi oj-component',

    /**
     * Creates children elements for oj-select-many
     *
     * @return {jQuery} The collection of HTML elements that represent the content
     *
     * @memberof! _OjMultiSelect
     * @instance
     * @protected
     * @override
     */
    _CreateContentElements: function () {
      var contentStructure = [
        "<div class='oj-text-field-container' role='presentation'>",
        "  <div class='oj-select-accessible-container' tabindex='0' role='combobox'",
        "       aria-autocomplete='none' aria-expanded='false'>",
        "    <ul class='oj-select-choices'>",
        '    </ul>',
        '  </div>',
        '</div>',
        "<div class='oj-select-description oj-helper-hidden-accessible'></div>",
        "<div class='oj-listbox-drop' role='dialog'>",
        "  <div class='oj-listbox-search-wrapper'>",

        "    <div class='oj-text-field'>",
        "      <div class='oj-text-field-container oj-text-field-has-end-slot'>",
        "        <div class='oj-listbox-search oj-text-field-middle'>",
        "          <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off'",
        "                 spellcheck='false' class='oj-listbox-input oj-text-field-input' title='Search field' ",
        "                 role='combobox' aria-expanded='false' aria-autocomplete='list' />",
        '        </div>',
        "        <span class='oj-listbox-spyglass-box oj-text-field-end'>",
        "          <span class='oj-component-icon oj-clickable-icon-nocontext oj-fwk-icon-magnifier oj-listbox-search-icon' role='presentation'></span>",
        '        </span>',
        '      </div>',
        '    </div>',

        '  </div>',

        "  <div class='oj-listbox-loader-wrapper'></div>",

        "   <ul class='oj-listbox-results' role='listbox' data-oj-context>",
        '   </ul>',
        '</div>',

        "<div class='oj-helper-hidden-accessible oj-listbox-liveregion' aria-live='polite'></div>"
      ];
      return $(contentStructure.join(''));
    },

    // _OjMultiSelect
    _initContainer: function () {
      _OjMultiSelect.superclass._initContainer.apply(this, arguments);

      // JET-47442 - validation error popup unexpectedly while creating the new labor schedule
      // The editable table relies on the focus events from the popup to determine whether
      // or not the table should be edit mode. In select-many, when there is a search field
      // and it is focused, the focus stays in the popup. At this point, when one clicks on
      // an option item, the focus will be lost on mousedown. Since, none of the other elements
      // in the dropdown are focusable, the focus is transferred to the first focusable ancestor
      // which in this case happens to be the body element. This results in the focusout event
      // on the popup. As the selection only happens on the mouseup event, if one keeps the mouse
      // pressed long enough, the table will exit the edit mode before the selection happens.
      // Since, we are not relying on the physical focus anyway for selection mechanism, a patchy
      // solution here would be to prevent the focus transfer when one clicks in the results area.
      // This way the table would stay in edit mode. One important thing is to allow focus transfer
      // when one clicks on the search field, we only want to prevent it in the rest of the region
      // in the dropdown.
      this.dropdown.on(
        'mousedown',
        _ComboUtils.killEventWithExceptions.bind(null, ['.oj-listbox-input'])
      );
    },

    // _OjMultiSelect
    // eslint-disable-next-line no-unused-vars
    _enable: function (enabled) {
      _OjMultiSelect.superclass._enable.apply(this, arguments);

      if (this._enabled) {
        var elementTabIndex = this.elementTabIndex ? this.elementTabIndex : '0';
        this.selection.attr('tabindex', elementTabIndex);
      } else {
        // Don't allow focus on a disabled "select"
        this.selection.removeAttr('tabindex');
      }
    },

    _containerKeydownHandler: function (e) {
      if (_ComboUtils.KEY.isPasteAction(e)) {
        this._userTyping = true;
        // open dropdown if it is not already open
        if (!this._opened()) {
          // open the dropdown, but don't update results or search box
          // The results will be updated when paste action is triggered on the search
          this.open(e, false, true);
        }
        // show search box if not already showing
        if (this._hasHiddenSearchBox()) {
          this._showSearchBox('');
        }

        // If the event is not from the search box, we need to
        // focus the search and dispatch the event to search
        if (!DomUtils.isAncestorOrSelf(this.search.get(0), e.currentTarget)) {
          this.search.focus();
          this.search.trigger(e);
          return;
        }
      }

      _OjMultiSelect.superclass._containerKeydownHandler.apply(this, arguments);

      if (this._userTyping) {
        if (!this._opened()) {
          // If the dropdown is closed, open the dropdown and
          // show the search box with the letter typed
          this.open(e);
          return;
        }

        // If the dropdown is already open, show the search box if not already
        // being shown
        if (this._hasHiddenSearchBox()) {
          var searchText = _ComboUtils.getSearchText(e);
          if (searchText) {
            this._showSearchBox(searchText);
            this._updateResults();
          }
        }
      }
    },

    _opening: function (event, dontUpdateResults, dontShowSearchbox) {
      // if beforeExpand is not cancelled
      // beforeExpand event will be triggered in base class _shouldOpen method
      _OjMultiSelect.superclass._opening.apply(this, arguments);

      var searchText = null;

      // Show and update the search box only if the dontShowSearchbox flag
      // is not set
      if (!dontShowSearchbox) {
        searchText = _ComboUtils.getSearchText(event);
        // select: focus still stay on the selectBox if open dropdown by mouse click
        this._showSearchBox(searchText);
      }

      if (!dontUpdateResults) {
        if (searchText) {
          this._updateResults();
        } else {
          this._updateResults(true);
        }
      }
    },

    _showDropDown: function () {
      var expanding = this.selection.attr('aria-expanded') !== 'true';
      _OjMultiSelect.superclass._showDropDown.apply(this, arguments);

      if (expanding) {
        this.selection
          .attr('aria-expanded', true)
          .attr('aria-haspopup', 'dialog')
          .attr('aria-owns', this.results.attr('id'));

        this.search.attr('aria-expanded', true).attr('aria-controls', this.results.attr('id'));
      }
    },

    close: function (event) {
      // reset _userTyping after drop down is closed
      if (this._userTyping === true) {
        this._userTyping = false;
      }

      // Bug JET-34119 - focus is not returned to oj-select-one after selecting an option from the dropdown
      // return the focus to the select if the event.target is in the dropdown.

      // We need to determine whether the focus has to be returned to the select or not
      // If the event is of type MouseEvent or FocusEvent, it has be checked if the
      // event target is a part of the select or its dropdown and only if it is
      // the focus should be retained.
      // Note: In Firefox, Safari and Edge clicking on an input element triggers a
      // FocusEvent while in Chrome and IE11, MouseEvent will be triggered. So both
      // has to be considered here.
      var originalEvent = event ? event.originalEvent : null;
      var isMouseOrFocusEvent =
        originalEvent instanceof MouseEvent || originalEvent instanceof FocusEvent;
      var shouldReturnFocus =
        event &&
        (!isMouseOrFocusEvent ||
          event.target === this.selection ||
          event.target === this.search ||
          this.dropdown.has(event.target).length > 0);

      _OjMultiSelect.superclass.close.apply(this, arguments);

      // For readonly, we don't need to set aria-expanded to false as the attribute has
      // already been removed in applyReadonlyState() to avoid an OATB structure error.
      if (!_ComboUtils.isReadonly(this.ojContext)) {
        this.selection.attr('aria-expanded', false);
      }
      this.selection.removeAttr('aria-haspopup').removeAttr('aria-owns');

      this.search.attr('aria-expanded', false).removeAttr('aria-controls');

      // When the dropdown is open and if the close method is invoked
      // by clicking directly on an input element, different browsers
      // behave differently.
      // Some, triggers mousedown event before a focus event on the target element
      // which results in this method being called before this.ojContext._handleAfterFocusToggle
      // which thus results in the expected behavior. But in other browsers it is the
      // opposite, which results in the _handleAfterFocusToggle method to be called
      // with focusOut event before closing the dropdown. This incorrectly results in
      // oj-focus class being added to the root element. In this case, we would have
      // to remove the class. As the select is currently not focused and also does not
      // have the dropdown open, it should not have oj-focus class.
      if (this.ojContext.hasAfterToggleHandlerAddedFocusClass && !shouldReturnFocus) {
        this.ojContext._getRootElement().classList.remove('oj-focus');
        this.ojContext.hasAfterToggleHandlerAddedFocusClass = false;
      }

      if (shouldReturnFocus) {
        _ComboUtils._focus(this, this.selection);
      }

      // Always clear the search field text when closing the dropdown.
      this.search.val('');
    },

    /**
     * Returns the element that is currently active
     *
     * @return {jQuery} The jQuery instance of the active Element
     *
     * @instance
     * @protected
     * @memberof! _OjMultiSelect
     * @override
     */
    _getActiveContainer: function () {
      var expanded = this.search.attr('aria-expanded');
      return expanded && this._hasSearchBox() ? this.search : this.selection;
    },

    _clearSearch: function () {
      var placeholder = this._getPlaceholder();

      if (
        placeholder != null &&
        _ComboUtils.isValueForPlaceholder(true, this.getVal()) &&
        _ComboUtils.isValueOptionsForPlaceholder(true, this.getValOpts())
      ) {
        var node = $('<li></li>');
        node.addClass('oj-select-default');
        node.text(placeholder);
        // oj-select-many has to append the items to the ul element inside selection
        this.selection.find('.oj-select-choices').append(node); // @HTMLUpdateOK
      }
    }
  });

  /**
   * @private
   */
  const _OjSingleSelect = _ComboUtils.clazz(_AbstractSingleChoice, {
    _elemNm: 'ojselect',
    _classNm: 'oj-select',
    _userTyping: false,
    _COMPONENT_CLASSLIST: 'oj-select oj-component',

    /**
     * Creates children elements for oj-select-one
     *
     * @return {jQuery} The collection of HTML elements that represent the content
     *
     * @memberof! _OjSingleSelect
     * @instance
     * @protected
     * @override
     */
    _CreateContentElements: function () {
      var contentStructure = [
        "<div class='oj-text-field-container' role='presentation'>",
        "  <div class='oj-select-choice oj-select-accessible-container' tabindex='0' role='combobox' ",
        "     aria-autocomplete='none' aria-expanded='false'>",
        "   <div class='oj-text-field-middle'>",
        "      <span class='oj-select-chosen'></span>",
        '   </div>',
        "   <abbr class='oj-select-search-choice-close' role='presentation'></abbr>",
        "   <span class='oj-text-field-end'>",
        "     <a class='oj-select-arrow oj-component-icon oj-clickable-icon-nocontext oj-select-open-icon' role='presentation'>",
        '     </a>',
        '   </span>',
        '  </div>',
        '</div>',
        "<div class='oj-listbox-drop' role='dialog'>",
        "  <div class='oj-listbox-search-wrapper'>",

        "    <div class='oj-text-field'>",
        "      <div class='oj-text-field-container oj-text-field-has-end-slot'>",
        "        <div class='oj-listbox-search oj-text-field-middle'>",
        "          <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off'",
        "                 spellcheck='false' class='oj-listbox-input oj-text-field-input' title='Search field' ",
        "                 role='combobox' aria-expanded='false' aria-autocomplete='list' />",
        '        </div>',
        "        <span class='oj-listbox-spyglass-box oj-text-field-end'>",
        "          <span class='oj-component-icon oj-clickable-icon-nocontext oj-fwk-icon-magnifier oj-listbox-search-icon' role='presentation'></span>",
        '        </span>',
        '      </div>',
        '    </div>',

        '  </div>',

        "  <div class='oj-listbox-loader-wrapper'></div>",

        "   <ul class='oj-listbox-results' role='listbox' data-oj-context>",
        '   </ul>',
        '</div>',

        "<div class='oj-helper-hidden-accessible oj-listbox-liveregion' aria-live='polite'></div>"
      ];
      return $(contentStructure.join(''));
    },

    // _OjSingleSelect
    // eslint-disable-next-line no-unused-vars
    _enable: function (enabled) {
      _OjSingleSelect.superclass._enable.apply(this, arguments);

      //  - dropdown icon is in disabled state after enabling ojselect
      if (this._enabled) {
        var elementTabIndex = this.elementTabIndex ? this.elementTabIndex : '0';
        this.selection.attr('tabindex', elementTabIndex);
        this.container.find('.oj-select-arrow').removeClass('oj-disabled');
      } else {
        // Don't allow focus on a disabled "select"
        this.selection.removeAttr('tabindex');
        //  - disabled select icon hover still shows changes
        this.container.find('.oj-select-arrow').addClass('oj-disabled');
      }
    },

    // _OjSingleSelect
    close: function (event) {
      if (!this._opened()) {
        return;
      }

      //  - ojselect input field grabs focus on paste
      // don't set focus on the select box if event target is not select element
      // Bug JET-34119 - focus is not returned to oj-select-one after selecting an option from the dropdown
      // return the focus to the select if the event.target is in the dropdown.

      // We need to determine whether the focus has to be returned to the select or not
      // If the event is of type MouseEvent or FocusEvent, it has be checked if the
      // event target is a part of the select or its dropdown and only if it is
      // the focus should be retained.
      // Note: In Firefox, Safari and Edge clicking on an input element triggers a
      // FocusEvent while in Chrome and IE11, MouseEvent will be triggered. So both
      // has to be considered here.
      var originalEvent = event ? event.originalEvent : null;
      var isMouseOrFocusEvent =
        originalEvent instanceof MouseEvent || originalEvent instanceof FocusEvent;
      var shouldReturnFocus =
        event &&
        (!isMouseOrFocusEvent ||
          event.target === this.selection ||
          event.target === this.search ||
          this.dropdown.has(event.target).length > 0);

      _OjSingleSelect.superclass.close.apply(this, arguments);

      this.selection.attr('aria-expanded', false).removeAttr('aria-haspopup').removeAttr('aria-owns');

      this.search.attr('aria-expanded', false).removeAttr('aria-controls');

      //  - required validation err is not displayed when user tabs out
      // always clear search text when dropdown close
      if (!this._testClear(event)) {
        this._clearSearch();
      }

      // When the dropdown is open and if the close method is invoked
      // by clicking directly on an input element, different browsers
      // behave differently.
      // Some, triggers mousedown event before a focus event on the target element
      // which results in this method being called before this.ojContext._handleAfterFocusToggle
      // which thus results in the expected behavior. But in other browsers it is the
      // opposite, which results in the _handleAfterFocusToggle method to be called
      // with focusOut event before closing the dropdown. This incorrectly results in
      // oj-focus class being added to the root element. In this case, we would have
      // to remove the class. As the select is currently not focused and also does not
      // have the dropdown open, it should not have oj-focus class.
      if (this.ojContext.hasAfterToggleHandlerAddedFocusClass && !shouldReturnFocus) {
        this.ojContext._getRootElement().classList.remove('oj-focus');
        this.ojContext.hasAfterToggleHandlerAddedFocusClass = false;
      }

      if (shouldReturnFocus) {
        _ComboUtils._focus(this, this.selection);
      }

      // /remove "mouse click" listeners on spyglass
      this.container.find('.oj-listbox-spyglass-box').off('mouseup click');
    },

    // _OjSingleSelect
    _opening: function (event, dontUpdateResults, dontShowSearchbox) {
      _OjSingleSelect.superclass._opening.apply(this, arguments);

      var searchText = null;

      // Show and update the search box only if the dontShowSearchbox flag
      // is not set
      if (!dontShowSearchbox) {
        searchText = _ComboUtils.getSearchText(event);
        // select: focus still stay on the selectBox if open dropdown by mouse click
        this._showSearchBox(searchText);
      }

      if (!dontUpdateResults) {
        if (searchText) {
          this._updateResults();
        } else {
          this._updateResults(true);
        }
      }
    },

    // _OjSingleSelect
    _showDropDown: function () {
      if (!this._opened()) {
        // Just to make sure that _opening() method is called before calling
        // the _showDropDown().
        return;
      }

      var expanding = this.selection.attr('aria-expanded') !== 'true';
      _OjSingleSelect.superclass._showDropDown.apply(this, arguments);

      if (expanding) {
        this.selection
          .attr('aria-expanded', true)
          .attr('aria-haspopup', 'dialog')
          .attr('aria-owns', this.results.attr('id'));

        this.search
          .attr('aria-expanded', true)
          .attr(
            'aria-controls',
            this.results.attr('id') + ' ' + this.container.find('.oj-listbox-liveregion').attr('id')
          );
      }

      //  - search moves cursor to end, difficult to edit search
    },

    // _OjSingleSelect
    _initContainer: function () {
      // /ojselect placeholder
      var selectedId = this.containerId + '_selected';
      this.text = this.container.find('.oj-select-chosen').attr('id', selectedId);

      _OjSingleSelect.superclass._initContainer.apply(this, arguments);

      // /select: accessibility
      this.selection.attr({
        'aria-labelledby': this.search.attr('aria-labelledby'),
        'aria-describedby': selectedId
      });

      this.search.on('keydown', this._bind(this._containerKeydownHandler));
      this.search.on('keyup-change input', this._bind(this._containerKeyupHandler));

      //  - nls: hardcoded string 'search field' in select component
      this.search.attr('title', this.ojContext.getTranslatedString('searchField'));

      //  - required validation err is not displayed when user tabs out
      var self = this;
      this.selection.on('blur', function (e) {
        self._testClear(e);
      });

      // JET-47442 - validation error popup unexpectedly while creating the new labor schedule
      // The editable table relies on the focus events from the popup to determine whether
      // or not the table should be edit mode. In select-one, when there is a search field
      // and it is focused, the focus stays in the popup. At this point, when one clicks on
      // an option item, the focus will be lost on mousedown. Since, none of the other elements
      // in the dropdown are focusable, the focus is transferred to the first focusable ancestor
      // which in this case happens to be the body element. This results in the focusout event
      // on the popup. As the selection only happens on the mouseup event, if one keeps the mouse
      // pressed long enough, the table will exit the edit mode before the selection happens.
      // Since, we are not relying on the physical focus anyway for selection mechanism, a patchy
      // solution here would be to prevent the focus transfer when one clicks in the results area.
      // This way the table would stay in edit mode. One important thing is to allow focus transfer
      // when one clicks on the search field, we only want to prevent it in the rest of the region
      // in the dropdown.
      this.dropdown.on(
        'mousedown',
        _ComboUtils.killEventWithExceptions.bind(null, ['.oj-listbox-input'])
      );
    },

    // _OjSingleSelect
    _initSelection: function () {
      if (this._isPlaceholderOptionSelected()) {
        this._updateSelection(null);
        this.close();
        this._setPlaceholder();
      } else {
        _OjSingleSelect.superclass._initSelection.apply(this, arguments);
      }
    },

    // _OjSingleSelect
    _updateSelectedOption: function (selected) {
      if (selected !== undefined && selected !== null) {
        // ojSelect by default use first option if user set a value which is not listed in original option items.
        // So need to update options to reflect the correct value in component state.
        var selectedVal;
        var value = this.getVal();

        if (Array.isArray(value) && !this.ojContext._IsCustomElement()) {
          value = value[0];
        }

        selectedVal = this.opts.id(selected);

        // editableValue doesn't accept undefined value
        if (selectedVal === undefined) {
          selectedVal = null;
        }

        //  - the selected option of the ojselect not reflected in the value variable
        if (!oj.Object.compareValues(value, selectedVal)) {
          this.ojContext._setInitialSelectedValue(selectedVal);
        }

        this.setValOpts(selected);
        this._updateSelection(selected);

        this.close();
      } else {
        this.setValOpts(null);
      }
    },

    // _OjSingleSelect
    _updateSelection: function (data) {
      this.selection.data(this._elemNm, data);
      //  - ojet select displaying values incorrectly
      if (data !== null) {
        this.text.text(typeof data === 'string' ? data : _ComboUtils.getLabel(data));
      }

      // make sure placeholder text has "oj-select-default" class
      if (data && data.id !== '') {
        this.text.removeClass(this._classNm + '-default');
      }
    },

    // _OjSingleSelect
    _getActiveContainer: function () {
      var expanded = this.search.attr('aria-expanded');
      return expanded && this._hasSearchBox() ? this.search : this.selection;
    },

    // _OjSingleSelect
    _isPlaceholderOptionSelected: function () {
      // /ojselect allow placeholder to be an empty string
      if (this._getPlaceholder() === null) {
        return false; // no placeholder specified so no option should be considered
      }

      var cval = this.getVal();
      cval = Array.isArray(cval) ? cval[0] : cval;
      // This method is used to check whether placeholder text need to be displayed in ui or not and hence checking current value should be fine.
      return _ComboUtils.isValueForPlaceholder(false, cval);
    },

    // _OjSingleSelect
    // /ojselect placeholder this method should be in AbstractOjChoice
    _getPlaceholder: function () {
      return this.opts.placeholder;
    },

    // _OjSingleSelect
    _showPlaceholder: function () {
      // make sure the aggregate component options are current
      this.opts.placeholder = this.ojContext.options.placeholder;
      return true;
    },

    // _OjSingleSelect
    _setPlaceholder: function () {
      var placeholder = this._getPlaceholder();

      if (this._isPlaceholderOptionSelected() && placeholder !== undefined) {
        this.text.text(placeholder).addClass(this._classNm + '-default');
      }
    },

    // _OjSingleSelect
    /**
     * Sets the value
     * @instance
     * @override
     * @ignore
     * @param {any} val The value to be set
     * @param {jQuery.Event=} event The event at which the method is invoked
     * @param {object} context Context
     * @return {Promise} Result of setting the value
     */
    setVal: function (val, event, context) {
      // /pass original event
      var setValueReturn = _OjSingleSelect.superclass.setVal.call(this, val, event, context);
      if (setValueReturn instanceof Promise) {
        return setValueReturn.then(
          this._bind(function (result) {
            if (result !== false) {
              this.selection.data('selectVal', val);
            }
          })
        );
      }

      if (setValueReturn !== false) {
        this.selection.data('selectVal', val);
      }
      return setValueReturn;
    },

    // _OjSingleSelect
    _containerKeydownHandler: function (e) {
      const keyCode = e.which || e.keyCode;
      if (_ComboUtils.KEY.isPasteAction(e)) {
        this._userTyping = true;
        // open dropdown if it is not already open
        if (!this._opened()) {
          // open the dropdown, but don't update results or search box
          // The results will be updated when paste action is triggered on the search
          this.open(e, true, true);
        }
        // show search box if not already showing
        if (this._hasHiddenSearchBox()) {
          this._showSearchBox('');
        }

        // If the event is not from the search box, we need to
        // focus the search and dispatch the event to search
        if (!DomUtils.isAncestorOrSelf(this.search.get(0), e.currentTarget)) {
          this.search.focus();
          this.search.trigger(e);
          return;
        }
      }

      //  - strange text show up after type in "<" in the select component
      //  - keyboard handling issues
      if (
        (_ComboUtils.KEY.isControl(e) && keyCode !== _ComboUtils.KEY.SHIFT) ||
        keyCode === _ComboUtils.KEY.SHIFT ||
        _ComboUtils.KEY.isFunctionKey(e)
      ) {
        return;
      }

      switch (keyCode) {
        case _ComboUtils.KEY.TAB:
          this.close(e);
          // James: tab out of an expanded poplist, focus is going all the way to the top of the page.
          this.selection.focus();

          //  - required validation err is not displayed when user tabs out
          this._testClear(e);
          return;

        // open dropdown on Enter
        case _ComboUtils.KEY.ENTER:
          if (e.target === this.selection[0] && !this._opened()) {
            this.open(e);
            //  - select and combobox stop keyboard event propegation
            e.preventDefault();
            return;
          }
          break;

        default:
          break;
      }

      _OjSingleSelect.superclass._containerKeydownHandler.apply(this, arguments);

      if (this._userTyping) {
        //  - select input gets stuck with sdp fetchchain delay
        // force opening the dropdown to show seach text in the searchbox
        this.open(e);

        //  - ojselect search box does not appear when i start typing
        if (this._opened()) {
          var searchBox = this.dropdown.find('.oj-listbox-search');
          if ($(searchBox).attr('aria-hidden') === 'true') {
            var searchText = _ComboUtils.getSearchText(e);
            if (searchText) {
              this._showSearchBox(searchText);
              this._updateResults();
            }
          }
        }
      }
    },

    // _OjSingleSelect
    //  - required validation err is not displayed when user tabs out
    _testClear: function (event) {
      if (this.text.text() === '') {
        // In the case when the selected option or oj-option has empty text for label
        // but has valid value, we don't want to clear the value out -- see 
        //  - lov does not show the value-option label when it's updated later
        if (
          (this.datalist &&
            this.selection.data(this._elemNm) &&
            this.selection.data(this._elemNm).value) ||
          !_ComboUtils.isValueForPlaceholder(false, this.ojContext.options.value)
        ) {
          return false;
        }

        this._clear(event);
        return true;
      }
      return false;
    }
  });

  //-----------------------------------------------------
  //                   SelectOne
  //-----------------------------------------------------
  /**
   * @ojcomponent oj.ojSelectOne
   * @augments oj.ojSelect
   * @since 0.6.0
   * @ojdisplayname Select (One)
   * @ojshortdesc A select one is a dropdown list that supports single selection and search filtering.
   * @ojdeprecated {since: "8.1.0", value: ['oj-select-single']}
   * @ojrole combobox
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojSelectOne<K, D, V = any> extends ojSelect<V, ojSelectOneSettableProperties<K, D, V>>",
   *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"},
   *                {"name": "V", "description": "Type of value of the component"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojSelectOneSettableProperties<K, D, V= any> extends ojSelectSettableProperties<V>",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
   * @ojtsimport {module: "ojvalidationfactory-base", type: "AMD", imported:["Validation"]}
   * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
   * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
   * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "required", "disabled"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value", "options"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-select-single'
   *
   * @classdesc
   * <h3 id="selectOverview-section">
   *   JET Select One
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectOverview-section"></a>
   * </h3>
   * <p>Description: JET Select One provides support for single-select and search filtering.</p>
   *
   * <p>Inline options allow you to configure dropdown content with minimal effort. Adding start and end icons can be done directly in markup. However, this approach fully realizes every option into live DOM and is thus not suitable for large data. Inline options also do not support dynamic content.
   * </p>
   * </p>For medium-sized static content or cases where the set of options can only be computed at runtime while initializing the component (and is not subject to further modification), using oj-bind-for-each bound to a simple (non-observable) Array is more convenient than manually inlining each option. However, just like directly specifying inline options, this approach is not suitable for large or dynamic data.
   * </p>
   * <p>For cases where the data is large or dynamic, options should be specified using a DataProvider. This approach will limit the amount of live DOM, regardless of data size, and is also capable of reacting to changes in data. However, configuring dropdown content may require more work than the previous approaches.
   * </p>
   *
   * <p>A JET Select One can be created with the following markup.</p>
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-select-one>
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-select-one>
   * </code></pre>
   * <p>A JET Select One can be created with a DataProvider.</p>
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-select-one options="[[dataprovider]]">
   * &lt;/oj-select-one>
   * </code></pre>
   *
   * <p>See the Select one basic demo for inline options and DataProvider usage.</p>
   *
   * {@ojinclude "name":"selectComboDifferences"}
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
   * <h3 id="perf-section">
   *   Performance
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
   * </h3>
   *
   * <h4>Page Load</h4>
   * <p>If the <a href="#options">options</a> attribute is a data provider, and if there is an initially selected value, setting the <a href="#valueOption">valueOption</a> attribute initially can improve page load performance because the element will not have to fetch the selected label from the data provider.</p>
   * <p>When using a data provider and renderMode is 'jet', the dropdown data isn't fetched until the user opens the dropdown.</p>
   *
   * {@ojinclude "name":"selectCommon"}
   */

  //-----------------------------------------------------
  //                   Slots SelectOne
  //-----------------------------------------------------
  /**
   * <p>The &lt;oj-select-one> element accepts <code class="prettyprint">oj-option</code> elements as children. See the [oj-option]{@link oj.ojOption} documentation for details about
   * accepted children and slots.</p>
   *
   * @ojchild Default
   * @memberof oj.ojSelectOne
   * @ojshortdesc The oj-select-one element accepts oj-option elements as children.
   * @ojpreferredcontent ["OptionElement", "OptgroupElement"]
   *
   * @example <caption>Initialize the select with child content specified:</caption>
   * &lt;oj-select-one>
   *   &lt;oj-option value="option1">Option 1&lt;/oj-option>
   *   &lt;oj-option value="option2">Option 2&lt;/oj-option>
   *   &lt;oj-option value="option3">Option 3&lt;/oj-option>
   * &lt;/oj-select-one>
   */

  //-----------------------------------------------------
  //                   Fragments SelectOne
  //-----------------------------------------------------
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
   *       <td>Select box or Arrow button</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>If the drop down is not open, expand the drop down list. Otherwise, close the drop down list.
   *       If hints, title or messages exist in a notewindow,
   *        pop up the notewindow on tapping on select box.</td>
   *     </tr>
   *     <tr>
   *       <td>Option item</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Tap on a option item in the drop down list to select a new item.</td>
   *     </tr>
   *     <tr>
   *       <td>Drop down</td>
   *       <td><kbd>swipe up/down</kbd></td>
   *       <td>Scroll the drop down list vertically</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojSelectOne
   * @instance
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
   *       <td>Option item</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Select the highlighted choice from the drop down list.</tr>
   *     </tr>
   *     <tr>
   *       <td>Drop down</td>
   *       <td><kbd>UpArrow or DownArrow</kbd></td>
   *       <td>Highlight the option item in the direction of the arrow. If the drop down is not open, expand the drop down list.</tr>
   *     </tr>
   *     <tr>
   *       <td>Drop down</td>
   *       <td><kbd>Esc</kbd></td>
   *       <td>Collapse the drop down list. If the drop down is already closed, do nothing.</tr>
   *     </tr>
   *     <tr>
   *       <td>Select box or search box</td>
   *       <td><kbd>any characters for the search term</kbd></td>
   *       <td>filter down the results with the search term.</td>
   *     </tr>
   *     <tr>
   *       <td>Select</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the select. If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * <p>Disabled option items receive no highlight and are not selectable.
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojSelectOne
   * @instance
   */

  //-----------------------------------------------------
  //                   Styling SelectOne
  //-----------------------------------------------------
  /**
   * @classdesc The following CSS classes can be applied by the page author as needed.<br/>
   * The form control style classes can be applied to the component, or an ancestor element. <br/>
   * When applied to an ancestor element, all form components that support the style classes will be affected.
   */
  // ---------------- oj-form-control-full-width --------------
  /**
   * Changes the max-width to 100% so that form components will occupy all the available horizontal space.
   * @ojstyleclass oj-form-control-full-width
   * @ojdisplayname FullWidth
   * @memberof oj.ojSelectOne
   * @ojtsexample
   * &lt;oj-select-one class="oj-form-control-full-width">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-select-one>
   */

  // ---------------- oj-form-control max-width --------------
  /**
   * In the Redwood theme the default max width of a text field is 100%.
   * These max width convenience classes are available to create a medium or small field.<br>
   * The class is applied to the root element.
   * @ojstyleset form-control-max-width
   * @ojdisplayname Max Width
   * @ojstylesetitems ["form-control-max-width.oj-form-control-max-width-sm", "form-control-max-width.oj-form-control-max-width-md"]
   * @ojstylerelation exclusive
   * @memberof oj.ojSelectOne
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-select-one class="oj-form-control-max-width-md">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   * &lt;/oj-select-one>
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-sm
   * @ojshortdesc Sets the max width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojSelectOne
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-md
   * @ojshortdesc Sets the max width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojSelectOne
   */

  // ---------------- oj-form-control width --------------
  /**
   * In the Redwood theme the default width of a text field is 100%.
   * These width convenience classes are available to create a medium or small field.<br>
   * The class is applied to the root element.
   * @ojstyleset form-control-width
   * @ojdisplayname Width
   * @ojstylesetitems ["form-control-width.oj-form-control-width-sm", "form-control-width.oj-form-control-width-md"]
   * @ojstylerelation exclusive
   * @memberof oj.ojSelectOne
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-select-one class="oj-form-control-width-md">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   * &lt;/oj-select-one>
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-sm
   * @ojshortdesc Sets the width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojSelectOne
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-md
   * @ojshortdesc Sets the width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojSelectOne
   */

  // ---------------- oj-form-control-text-align- --------------
  /**
   * Classes that help align text of the element.
   * @ojstyleset text-align
   * @ojdisplayname Text Alignment
   * @ojstylesetitems ["text-align.oj-form-control-text-align-right", "text-align.oj-form-control-text-align-start", "text-align.oj-form-control-text-align-end"]
   * @ojstylerelation exclusive
   * @memberof oj.ojSelectOne
   * @ojtsexample
   * &lt;oj-select-one class="oj-form-control-text-align-right">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-select-one>
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-right
   * @ojshortdesc Aligns the text to the right regardless of the reading direction. This is normally used for right aligning numbers.
   * @ojdisplayname Align-Right
   * @memberof! oj.ojSelectOne
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-start
   * @ojshortdesc Aligns the text to the left in LTR and to the right in RTL.
   * @ojdisplayname Align-Start
   * @memberof! oj.ojSelectOne
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-end
   * @ojshortdesc Aligns the text to the right in LTR and to the left in RTL.
   * @ojdisplayname Align-End
   * @memberof! oj.ojSelectOne
   */

  //-----------------------------------------------------
  //                   SelectMany
  //-----------------------------------------------------
  /**
   * @ojcomponent oj.ojSelectMany
   * @augments oj.ojSelect
   * @since 0.6.0
   * @ojdeprecated [
   *   {
   *     type: "maintenance",
   *     since: "15.0.0",
   *     value: ["oj-c-select-multiple"]
   *   }
   * ]
   * @ojdisplayname Select (Many)
   * @ojshortdesc A select many is a dropdown list that supports multiple selections and search filtering.
   * @ojrole combobox
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojSelectMany<K, D, V=any> extends ojSelect<Array<V>, ojSelectManySettableProperties<K, D, V>>",
   *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}
   *                , {"name": "V", "description": "Type of each item in the value of the component"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojSelectManySettableProperties<K, D, V=Array<any>> extends ojSelectSettableProperties<Array<V>>",
   *                for: "SettableProperties"
   *               }
   *              ]
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "required", "disabled"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value", "options"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-select-all'
   *
   * @classdesc
   * <h3 id="selectOverview-section">
   *   JET Select Many
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectOverview-section"></a>
   * </h3>
   * <p>Description: JET Select Many provides support for multi-select and search filtering.</p>
   *
   * <p>Inline options allow you to configure dropdown content with minimal effort. Adding start and end icons can be done directly in markup. However, this approach fully realizes every option into live DOM and is thus not suitable for large data. Inline options also do not support dynamic content.
   * </p>
   * </p>For medium-sized static content or cases where the set of options can only be computed at runtime while initializing the component (and is not subject to further modification), using oj-bind-for-each bound to a simple (non-observable) Array is more convenient than manually inlining each option. However, just like directly specifying inline options, this approach is not suitable for large or dynamic data.
   * </p>
   * <p>For cases where the data is large or dynamic, options should be specified using a DataProvider. This approach will limit the amount of live DOM, regardless of data size, and is also capable of reacting to changes in data. However, configuring dropdown content may require more work than the previous approaches.
   * </p>
   *
   * <p>A JET Select Many can be created with the following markup.</p>
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-select-many>
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-select-many>
   * </code></pre>
   * <p>A JET Select Many can be created with a DataProvider.</p>
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-select-many options="[[dataprovider]]">
   * &lt;/oj-select-many>
   * </code></pre>
   *
   * <p>See the Select many basic demo for inline options and DataProvider usage.</p>
   *
   * {@ojinclude "name":"selectComboDifferences"}
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
   * {@ojinclude "name":"migrationDoc"}
   * <h3 id="perf-section">
   *   Performance
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
   * </h3>
   *
   * <h4>Page Load</h4>
   * <p>If the <a href="#options">options</a> attribute is a data provider, and if there are initially selected values, setting the <a href="#valueOptions">valueOptions</a> attribute initially can improve page load performance because the element will not have to fetch the selected labels from the data provider.</p>
   * <p>When using a data provider and renderMode is 'jet', the dropdown data isn't fetched until the user opens the dropdown.</p>
   *
   *
   * {@ojinclude "name":"selectCommon"}
   */

  //-----------------------------------------------------
  //                   Slots SelectMany
  //-----------------------------------------------------
  /**
   * <p>The &lt;oj-select-many> element accepts <code class="prettyprint">oj-option</code> elements as children. See the [oj-option]{@link oj.ojOption} documentation for details about
   * accepted children and slots.</p>
   *
   * @ojchild Default
   * @memberof oj.ojSelectMany
   * @ojshortdesc The oj-select-many element accepts oj-option elements as children.
   * @ojpreferredcontent ["OptionElement", "OptgroupElement"]
   *
   * @example <caption>Initialize the select with child content specified:</caption>
   * &lt;oj-select-many>
   *   &lt;oj-option value="option1">Option 1&lt;/oj-option>
   *   &lt;oj-option value="option2">Option 2&lt;/oj-option>
   *   &lt;oj-option value="option3">Option 3&lt;/oj-option>
   * &lt;/oj-select-many>
   */
  //-----------------------------------------------------
  //                   Fragments SelectMany
  //-----------------------------------------------------
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
   *       <td>Select box</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>If the drop down is not open, expand the drop down list. Otherwise, close the drop down list.
   *       If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *     <tr>
   *       <td>Option item</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Tap on a option item in the drop down list to add to selection.</td>
   *     </tr>
   *     <tr>
   *       <td>Selected item with remove icon</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Remove item from the selected items list by tapping on the remove icon.</td>
   *     </tr>
   *     <tr>
   *       <td>Drop down</td>
   *       <td><kbd>swipe up/down</kbd></td>
   *       <td>Scroll the drop down list vertically</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojSelectMany
   * @instance
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
   *       <td>Option item</td>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Select the highlighted choice from the drop down list.</tr>
   *     </tr>
   *     <tr>
   *       <td>Drop down</td>
   *       <td><kbd>UpArrow or DownArrow</kbd></td>
   *       <td>Highlight the option item in the direction of the arrow. If the drop down is not open, expand the drop down list.</tr>
   *     </tr>
   *     <tr>
   *      <td>Select box</td>
   *       <td><kbd>LeftArrow or RightArrow</kbd></td>
   *       <td> Move focus to the previous or next selected item.</td>
   *     </tr>
   *     <tr>
   *       <td>Selected item with remove icon</td>
   *       <td><kbd>Backspace or Delete</kbd></td>
   *       <td>Remove the selected item having focus.</td>
   *     </tr>
   *     <tr>
   *       <td>Drop down</td>
   *       <td><kbd>Esc</kbd></td>
   *       <td>Collapse the drop down list. If the drop down is already closed, do nothing.</tr>
   *     </tr>
   *     <tr>
   *       <td>Select box or search box</td>
   *       <td><kbd>any characters for the search term</kbd></td>
   *       <td>filter down the results with the search term.</td>
   *     </tr>
   *     <tr>
   *       <td>Select</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the select. If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * <p>Disabled option items receive no highlight and are not selectable.
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojSelectMany
   * @instance
   */
  /**
   * <h3 id="migration-section">
   *   Migration
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
   * </h3>
   *
   * <p>
   * To migrate from oj-select-many to oj-c-select-multiple, you need to revise the import statement
   * and references to oj-c-select-multiple in your app. Please note the changes between the two
   * components below.
   * </p>
   *
   * <h5>Global attributes</h5>
   * <p>
   * The following global attributes are no longer supported:
   * <ul>
   * <li>tabindex - not considered accessible</li>
   * <li>
   * aria-label - use label-hint instead. If you do not want a visible label set label-edge="none".
   * </li>
   * <li>
   * aria-controls - this attribute is no longer needed. oj-c-select-multiple handles the
   * accessibility of its internal DOM elements.
   * </li>
   * </ul>
   * </p>
   *
   * <h5>ItemText attribute</h5>
   * <p>
   * This attribute is required to specify how to get the text string to render for a data item.
   * </p>
   *
   * <h5>LabelEdge attribute</h5>
   * <p>
   * The enum values for the label-edge attribute have been changed from 'inside', 'provided' and 'none' to 'start', 'inside', 'top' and 'none'.
   * If you are using this component in a form layout and would like the form layout to drive the label edge of this component, leave this attribute
   * unset. The application no longer has to specify 'provided' for this attribute. If you want to override how the label is positioned, set this
   * attribute to the corresponding value.
   * </p>
   *
   * <h5>MaximumResultCount attribute</h5>
   * <p>
   * This attribute is not supported.  The dropdown list supports fetching more data in blocks
   * as the user scrolls.
   * </p>
   *
   * <h5>MessagesCustom attribute</h5>
   * <p>
   * The type of the <code class="prettyprint">severity</code> property of the messages in the
   * array has changed from
   * <code class="prettyprint">Message.SEVERITY_TYPE | Message.SEVERITY_LEVEL</code>,
   * essentially <code class="prettyprint">string | number</code>, to simply
   * <code class="prettyprint">'error' | 'confirmation' | 'info' | 'warning'</code>.  These
   * values are the same as the previously supported string values.
   * The application can no longer specify severity as a number, including hardcoded numbers,
   * one of the <code class="prettyprint">Message.SEVERITY_LEVEL</code> constants, or the value
   * returned from a call to the <code class="prettyprint">Message.getSeverityLevel</code> method.
   * </p>
   *
   * <h5>MinimumResultsForSearch attribute</h5>
   * <p>
   * This attribute is not supported.  Searching is always enabled by typing into the text field.
   * </p>
   *
   * <h5>OptionRenderer attribute</h5>
   * <p>
   * This attribute is replaced with the itemTemplate slot. You can provide a &lt;template> element that will be used to
   * render each row in the dropdown.
   * </p>
   *
   * <h5>Options attribute</h5>
   * <p>
   * The only way to provide data to JET Select Multiple is through a
   * <a href="DataProvider.html">DataProvider</a> set via the data attribute.  Using
   * <a href="oj.ojOption.html">&lt;oj-option></a> and
   * <a href="oj.ojOptgroup.html">&lt;oj-optgroup></a> child tags is not supported.  For cases with
   * a small set of fixed data, use an <a href="ArrayDataProvider.html">ArrayDataProvider</a>.
   * </p>
   *
   * <h5>OptionsKeys attribute</h5>
   * <p>
   * This attribute is not supported.  The text rendered for an item can be customized via the
   * <a href="#itemText">item-text</a> attribute.
   * </p>
   *
   * <h5>PickerAttributes attribute</h5>
   * <p>
   * This attribute is not supported.  There is no replacement.
   * </p>
   *
   * <h5>TextAlign attribute</h5>
   * <p>
   * The usage of the style classes: oj-form-control-text-align-right, oj-form-control-text-align-start and oj-form-control-text-align-end is now
   * replaced with this attribute. The value of this attribute maps to these style classes as shown below:
   * <ul>
   *   <li>
   *   .oj-form-control-text-align-right maps to 'right'
   *   </li>
   *   <li>
   *   .oj-form-control-text-align-start maps to 'start'
   *   </li>
   *   <li>
   *   .oj-form-control-text-align-end maps to 'end'
   *   </li>
   * </ul>
   * </p>
   * <h5>Translations attribute</h5>
   * <p>
   * The translations.required.message-detail attribute has changed to required-message-detail. Other component-level translations are not supported.
   * </p>
   *
   * <h5>Value attribute</h5>
   * <p>
   * The value attribute accepts a Set of data provider keys instead of an array of keys.
   * </p>
   *
   * <h5>ValueOptions attribute</h5>
   * <p>
   * The value-options attribute is replaced with value-items attribute. This attribute accepts a map of objects that contain both
   * a key and data, and optional metadata.
   * </p>
   *
   * <h5>Refresh method</h5>
   * <p>
   * The refresh method is no longer supported. The application should no longer need to use this method. If the application
   * wants to reset the component (remove messages and reset the value of the component), please use the reset method.
   * </p>
   *
   * <h5>Animation Events</h5>
   * <p>
   * ojAnimateStart and ojAnimateEnd events are no longer supported.
   * </p>
   *
   * <h5>Custom Label</h5>
   * <p>
   * Adding a custom &lt;oj-label> for the form component is no longer supported. The application should use the
   * label-hint attribute to add a label for the form component.
   * </p>
   * <p>
   * The application should no longer need to use the &lt;oj-label-value> component to layout the form component. The application
   * can use the label-edge attribute and label-start-width attribute to customize the label position and label width (only when using start label).
   * </p>
   *
   * <h5>DescribedBy attribute</h5>
   * <p>
   * The described-by attribute is not meant to be set by an application developer directly as stated in the attribute documentation.
   * This attribute is not carried forward to the core pack component.
   * </p>
   *
   * <h5>Formatted messages</h5>
   * <p>
   * Formatting messages using html tags is not supported in the core pack component.
   * </p>
   *
   * <h5>Usage in Dynamic Form</h5>
   * <p>
   * Using the component in oj-dyn-form is not supported in this release; use oj-dynamic-form instead.
   * </p>
   *
   * <h5>Limitations</h5>
   * <p>
   * Note that oj-c-select-multiple supports a limited feature set in JET 15. It does not support:
   * </p>
   * <ul>
   * <li>hierarchical data</li>
   * <li>customizing dropdown content by providing a customized collection component (no collectionTemplate)</li>
   * </ul>
   * @ojfragment migrationDoc
   * @memberof oj.ojSelectMany
   * @instance
   */
  //-----------------------------------------------------
  //                   Styling SelectMany
  //-----------------------------------------------------
  /**
   * @classdesc The following CSS classes can be applied by the page author as needed.<br/>
   * The form control style classes can be applied to the component, or an ancestor element. <br/>
   * When applied to an ancestor element, all form components that support the style classes will be affected.
   */
  // ---------------- oj-form-control-full-width --------------
  /**
   * Changes the max-width to 100% so that form components will occupy all the available horizontal space.
   * @ojstyleclass oj-form-control-full-width
   * @ojdisplayname Full Width
   * @memberof oj.ojSelectMany
   * @ojtsexample
   * &lt;oj-select-many class="oj-form-control-full-width">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-select-many>
   */

  // ---------------- oj-form-control max-width --------------
  /**
   * In the Redwood theme the default max width of a text field is 100%.
   * These max width convenience classes are available to create a medium or small field.<br>
   * The class is applied to the root element.
   * @ojstyleset form-control-max-width
   * @ojdisplayname Max Width
   * @ojstylesetitems ["form-control-max-width.oj-form-control-max-width-sm", "form-control-max-width.oj-form-control-max-width-md"]
   * @ojstylerelation exclusive
   * @memberof oj.ojSelectMany
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-select-many class="oj-form-control-max-width-md">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   * &lt;/oj-select-many>
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-sm
   * @ojshortdesc Sets the max width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojSelectMany
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-md
   * @ojshortdesc Sets the max width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojSelectMany
   */

  // ---------------- oj-form-control width --------------
  /**
   * In the Redwood theme the default width of a text field is 100%.
   * These width convenience classes are available to create a medium or small field.<br>
   * The class is applied to the root element.
   * @ojstyleset form-control-width
   * @ojdisplayname Width
   * @ojstylesetitems ["form-control-width.oj-form-control-width-sm", "form-control-width.oj-form-control-width-md"]
   * @ojstylerelation exclusive
   * @memberof oj.ojSelectMany
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-select-many class="oj-form-control-width-md">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   * &lt;/oj-select-many>
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-sm
   * @ojshortdesc Sets the width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojSelectMany
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-md
   * @ojshortdesc Sets the width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojSelectMany
   */

  // ---------------- oj-form-control-text-align- --------------
  /**
   * Classes that help align text of the element.
   * @ojstyleset text-align
   * @ojdisplayname Text Alignment
   * @ojstylesetitems ["text-align.oj-form-control-text-align-right", "text-align.oj-form-control-text-align-start", "text-align.oj-form-control-text-align-end"]
   * @ojstylerelation exclusive
   * @memberof oj.ojSelectMany
   * @ojtsexample
   * &lt;oj-select-many class="oj-form-control-text-align-right">
   *   &lt;oj-option value="option 1">option 1&lt;/oj-option>
   *   &lt;oj-option value="option 2">option 2&lt;/oj-option>
   *   &lt;oj-option value="option 3">option 3&lt;/oj-option>
   *   &lt;oj-option value="option 4">option 4&lt;/oj-option>
   * &lt;/oj-select-many>
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-right
   * @ojshortdesc Aligns the text to the right regardless of the reading direction. This is normally used for right aligning numbers.
   * @ojdisplayname Align-Right
   * @memberof! oj.ojSelectMany
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-start
   * @ojshortdesc Aligns the text to the left in LTR and to the right in RTL.
   * @ojdisplayname Align-Start
   * @memberof! oj.ojSelectMany
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-end
   * @ojshortdesc Aligns the text to the right in LTR and to the left in RTL.
   * @ojdisplayname Align-End
   * @memberof! oj.ojSelectMany
   */

  //-----------------------------------------------------
  //                   Abstract Select
  //-----------------------------------------------------
  /**
   * @ojcomponent oj.ojSelect
   * @augments oj.editableValue
   * @ojimportmembers oj.ojDisplayOptions
   * @since 0.6.0
   * @abstract
   * @ojsignature [{
   *                target: "Type",
   *                value: "abstract class ojSelect<V, SP extends ojSelectSettableProperties<V, SV>, SV=V> extends editableValue<V, SP, SV>"
   *               },
   *               {
   *                target: "Type",
   *                value: "ojSelectSettableProperties<V, SV=V> extends editableValueSettableProperties<V, SV>",
   *                for: "SettableProperties"
   *               }
   *              ]
   *
   * @hideconstructor
   * @classdesc
   */
  /**
   * <h3 id="rtl-section">
   *   Reading direction
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
   * </h3>
   *
   * <p>As with any JET element, in the unusual case that the directionality (LTR or RTL) changes post-init, the Select must be <code class="prettyprint">refresh()</code>ed.
   *
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
   * <p>
   * The element will decorate its associated label with required and help
   * information, if the <code>required</code> and <code>help</code> attributes are set.
   * </p>
   * <p>
   * {@ojinclude "name":"accessibilityLabelEditableValue"}
   * {@ojinclude "name":"accessibilityPlaceholderEditableValue"}
   * {@ojinclude "name":"accessibilityDisabledEditableValue"}
   * </p>
   *
   * <h3 id="migration-section">
   *   Migration
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
   * </h3>
   *
   * <p>
   * To migrate from oj-select-many to oj-c-select-multiple, you need to revise the import statement
   * and references to oj-c-select-multiple in your app. Please note the changes between the two
   * components below.
   * </p>
   *
   * <h5>ItemText attribute</h5>
   * <p>
   * This attribute is required to specify how to get the text string to render for a data item.
   * </p>
   *
   * <h5>LabelEdge attribute</h5>
   * <p>
   * The enum values for the label-edge attribute have been changed from 'inside', 'provided' and 'none' to 'start', 'inside', 'top' and 'none'.
   * If you are using this component in a form layout and would like the form layout to drive the label edge of this component, leave this attribute
   * unset. The application no longer has to specify 'provided' for this attribute. If you want to override how the label is positioned, set this
   * attribute to the corresponding value.
   * </p>
   *
   * <h5>MaximumResultCount attribute</h5>
   * <p>
   * This attribute is not supported.  The dropdown list supports fetching more data in blocks
   * as the user scrolls.
   * </p>
   *
   * <h5>MessagesCustom attribute</h5>
   * <p>
   * The type of the <code class="prettyprint">severity</code> property of the messages in the
   * array has changed from
   * <code class="prettyprint">Message.SEVERITY_TYPE | Message.SEVERITY_LEVEL</code>,
   * essentially <code class="prettyprint">string | number</code>, to simply
   * <code class="prettyprint">'error' | 'confirmation' | 'info' | 'warning'</code>.  These
   * values are the same as the previously supported string values.
   * The application can no longer specify severity as a number, including hardcoded numbers,
   * one of the <code class="prettyprint">Message.SEVERITY_LEVEL</code> constants, or the value
   * returned from a call to the <code class="prettyprint">Message.getSeverityLevel</code> method.
   * </p>
   *
   * <h5>MinimumResultsForSearch attribute</h5>
   * <p>
   * This attribute is not supported.  Searching is always enabled by typing into the text field.
   * </p>
   *
   * <h5>OptionRenderer attribute</h5>
   * <p>
   * This attribute is not supported.  The text rendered for an item can be customized via the
   * <a href="#itemText">item-text</a> attribute.
   * </p>
   *
   * <h5>Options attribute</h5>
   * <p>
   * The only way to provide data to JET Select Multiple is through a
   * <a href="DataProvider.html">DataProvider</a> set via the data attribute.  Using
   * <a href="oj.ojOption.html">&lt;oj-option></a> and
   * <a href="oj.ojOptgroup.html">&lt;oj-optgroup></a> child tags is not supported.  For cases with
   * a small set of fixed data, use an <a href="ArrayDataProvider.html">ArrayDataProvider</a>.
   * </p>
   *
   * <h5>OptionsKeys attribute</h5>
   * <p>
   * This attribute is not supported.  The text rendered for an item can be customized via the
   * <a href="#itemText">item-text</a> attribute.
   * </p>
   *
   * <h5>PickerAttributes attribute</h5>
   * <p>
   * This attribute is not supported.  There is no replacement.
   * </p>
   *
   * <h5>TextAlign attribute</h5>
   * <p>
   * The usage of the style classes: oj-form-control-text-align-right, oj-form-control-text-align-start and oj-form-control-text-align-end is now
   * replaced with this attribute. The value of this attribute maps to these style classes as shown below:
   * <ul>
   *   <li>
   *   .oj-form-control-text-align-right maps to 'right'
   *   </li>
   *   <li>
   *   .oj-form-control-text-align-start maps to 'start'
   *   </li>
   *   <li>
   *   .oj-form-control-text-align-end maps to 'end'
   *   </li>
   * </ul>
   * </p>
   * <h5>Translations attribute</h5>
   * <p>
   * The translations.required.message-detail attribute has changed to required-message-detail.
   * </p>
   *
   * <h5>Value attribute</h5>
   * <p>
   * The value attribute accepts a Set of data provider keys instead of an array of keys.
   * </p>
   *
   * <h5>ValueOptions attribute</h5>
   * <p>
   * The value-options attribute is not supported.  The replacement is the
   * <a href="#valueItems">valueItems</a> attribute.
   * </p>
   *
   * <h5>Refresh method</h5>
   * <p>
   * The refresh method is no longer supported. The application should no longer need to use this method. If the application
   * wants to reset the component (remove messages and reset the value of the component), please use the reset method.
   * </p>
   *
   * <h5>Animation Events</h5>
   * <p>
   * ojAnimateStart and ojAnimateEnd events are no longer supported.
   * </p>
   *
   * <h5>Custom Label</h5>
   * <p>
   * Adding a custom &lt;oj-label> for the form component is no longer supported. The application should use the
   * label-hint attribute to add a label for the form component.
   * </p>
   * <p>
   * The application should no longer need to use the &lt;oj-label-value> component to layout the form component. The application
   * can use the label-edge attribute and label-start-width attribute to customize the label position and label width (only when using start label).
   * </p>
   *
   * <h5>DescribedBy attribute</h5>
   * <p>
   * The described-by attribute is not meant to be set by an application developer directly as stated in the attribute documentation.
   * This attribute is not carried forward to the core pack component.
   * </p>
   *
   * <h5>Formatted messages</h5>
   * <p>
   * Formatting messages using html tags is not supported in the core pack component.
   * </p>
   *
   * @ojfragment selectCommon
   * @memberof oj.ojSelect
   */
  /**
   * <h3 id="diff-section">
   *   Differences between Select and Combobox components
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#diff-section"></a>
   * </h3>
   *
   * <p>
   * oj-select-* components and oj-combobox-* components may look and feel similar,
   * but these components are different and are intended for very different use cases.
   * </p>
   *
   * <p>
   * While oj-select-* components allow one to filter the data in the dropdown,
   * it is not possible to enter values that are not available in the data.
   * This makes oj-select-* components ideal for usecases where the user can only
   * select values that are available in the dropdown, but not provide custom
   * values of their own.
   * </p>
   *
   * <p>
   * In contrast, oj-combobox-* components allow one to enter new values that are
   * not available in the data in addition to using the text field for filtering dropdown data.
   * This makes oj-combobox-* components ideal for usecases where the users can provide
   * custom values in addition to those that are already available in the dropdown data.
   * </p>
   *
   * <p>
   * Application developers should consider the above differences when choosing between
   * Select and Combobox components.
   * Additionally, applications are advised to use oj-select-single instead of the deprecated oj-select-one.
   * </p>
   *
   * @ojfragment selectComboDifferences
   * @memberof oj.ojSelect
   */
  oj.__registerWidget('oj.ojSelect', $.oj.editableValue, {
    defaultElement: '<select>',
    widgetEventPrefix: 'oj',
    options: {
      /**
       * <p>
       * The oj-label sets the labelledBy property programmatically on the form component
       * to make it easy for the form component to find its oj-label component (a
       * document.getElementById call.)
       * </p>
       * <p>
       * The application developer should use the 'for'/'id api
       * to link the oj-label with the form component;
       * the 'for' on the oj-label to point to the 'id' on the input form component.
       * This is the most performant way for the oj-label to find its form component.
       * </p>
       *
       * @example <caption>Initialize component with <code class="prettyprint">for</code> attribute:</caption>
       * &lt;oj-label for="selectOneId">Name:&lt;/oj-label>
       * &lt;oj-select-one id="selectOneId">
       * &lt;/oj-select-one>
       * // ojLabel then writes the labelled-by attribute on the oj-switch.
       * &lt;oj-label id="labelId" for="selectOneId">Name:&lt;/oj-label>
       * &lt;oj-select-one id="selectOneId" labelled-by"labelId">
       * &lt;/oj-select-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property after initialization:</caption>
       * // getter
       * var labelledBy = myComp.labelledBy;
       *
       * // setter
       * myComp.labelledBy = "labelId";
       *
       * @expose
       * @name labelledBy
       * @ojshortdesc The oj-label sets the labelledBy property
       * programmatically on the form component.
       * @type {string|null}
       * @public
       * @instance
       * @since 7.0.0
       * @memberof oj.ojSelectOne
       */
      /**
       * <p>
       * The oj-label sets the labelledBy property programmatically on the form component
       * to make it easy for the form component to find its oj-label component (a
       * document.getElementById call.)
       * </p>
       * <p>
       * The application developer should use the 'for'/'id api
       * to link the oj-label with the form component;
       * the 'for' on the oj-label to point to the 'id' on the input form component.
       * This is the most performant way for the oj-label to find its form component.
       * </p>
       *
       * @example <caption>Initialize component with <code class="prettyprint">for</code> attribute:</caption>
       * &lt;oj-label for="selectManyId">Name:&lt;/oj-label>
       * &lt;oj-select-many id="selectManyId">
       * &lt;/oj-select-many>
       * // ojLabel then writes the labelled-by attribute on the oj-switch.
       * &lt;oj-label id="labelId" for="selectManyId">Name:&lt;/oj-label>
       * &lt;oj-select-many id="selectManyId" labelled-by"labelId">
       * &lt;/oj-select-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property after initialization:</caption>
       * // getter
       * var labelledBy = myComp.labelledBy;
       *
       * // setter
       * myComp.labelledBy = "labelId";
       *
       * @expose
       * @name labelledBy
       * @ojshortdesc The oj-label sets the labelledBy property
       * programmatically on the form component.
       * @type {string|null}
       * @public
       * @instance
       * @since 7.0.0
       * @memberof oj.ojSelectMany
       */
      /**
       * <p>
       * The oj-label sets the labelledBy property programmatically on the form component
       * to make it easy for the form component to find its oj-label component (a
       * document.getElementById call.)
       * </p>
       * <p>
       * The application developer should use the 'for'/'id api
       * to link the oj-label with the form component;
       * the 'for' on the oj-label to point to the 'id' on the input form component.
       * This is the most performant way for the oj-label to find its form component.
       * </p>
       *
       *
       * // setter
       * myComp.labelledBy = "labelId";
       *
       * @expose
       * @ojshortdesc The oj-label sets the labelledBy property
       * programmatically on the form component.
       * @type {string|null}
       * @default null
       * @public
       * @instance
       * @since 7.0.0
       * @memberof oj.ojSelect
       */
      labelledBy: null,

      /**
       * {@ojinclude "name":"selectCommonMaximumResultCount"}
       *
       * @example <caption>Initialize the select with the <code class="prettyprint">maximum-result-count</code> attribute specified:</caption>
       * &lt;oj-select-one maximum-result-count="25">&lt;/oj-select-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">maximumResultCount</code> property after initialization:</caption>
       * // getter
       * var maximumResultCount = mySelect.maximumResultCount;
       *
       * // setter
       * mySelect.maximumResultCount = 25;
       *
       * @name maximumResultCount
       * @ojshortdesc The maximum number of results displayed in the dropdown.
       * @expose
       * @memberof oj.ojSelectOne
       * @since 8.0.0
       * @instance
       * @type {number}
       * @default 15
       */
      /**
       * {@ojinclude "name":"selectCommonMaximumResultCount"}
       *
       * @example <caption>Initialize the select with the <code class="prettyprint">maximum-result-count</code> attribute specified:</caption>
       * &lt;oj-select-many maximum-result-count="25">&lt;/oj-select-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">maximumResultCount</code> property after initialization:</caption>
       * // getter
       * var maximumResultCount = mySelect.maximumResultCount;
       *
       * // setter
       * mySelect.maximumResultCount = 25;
       *
       * @name maximumResultCount
       * @ojshortdesc The maximum number of results displayed in the dropdown.
       * @expose
       * @memberof oj.ojSelectMany
       * @since 8.0.0
       * @instance
       * @type {number}
       * @default 15
       */
      /**
       * <p>The maximum number of results that will be displayed in the dropdown when the options attribute is bound to a data provider.</p>
       *
       * <p>If more than the maximum number of results are available from data provider then user needs to filter further.
       * A value less than 1 indicates there is no maximum limit and all the results will be fetched and displayed in the dropdown.</p>
       *
       * <p>When the options attribute is bound to a hierarchical data source like a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>,
       * this attribute represents the maximum number of leaf results that will be displayed in the dropdown.</p>
       *
       * <p>Note: This attribute has no effect when the options attribute is bound to an array/observable array or
       * when the component renders an oj-option element or an oj-optgroup element as children.</p>
       *
       * @expose
       * @memberof oj.ojSelect
       * @instance
       * @ojfragment selectCommonMaximumResultCount
       */
      maximumResultCount: 15,

      /**
       * {@ojinclude "name":"selectCommonMinimumResultsForSearch"}
       *
       * @example <caption>Initialize the select with the <code class="prettyprint">minimum-results-for-search</code> attribute specified:</caption>
       * &lt;oj-select-one minimum-results-for-search="10">&lt;/oj-select-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">minimumResultsForSearch</code> property after initialization:</caption>
       * // getter
       * var minimumResultsForSearch = mySelect.minimumResultsForSearch;
       *
       * // setter
       * mySelect.minimumResultsForSearch = 10;
       *
       * @name minimumResultsForSearch
       * @ojshortdesc The threshold for showing the search box in the dropdown.
       * @expose
       * @memberof oj.ojSelectOne
       * @instance
       * @type {number}
       * @default 15
       * @ojmin 0
       */
      /**
       * {@ojinclude "name":"selectCommonMinimumResultsForSearch"}
       *
       * @example <caption>Initialize the select with the <code class="prettyprint">minimum-results-for-search</code> attribute specified:</caption>
       * &lt;oj-select-many minimum-results-for-search="10">&lt;/oj-select-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">minimumResultsForSearch</code> property after initialization:</caption>
       * // getter
       * var minimumResultsForSearch = mySelect.minimumResultsForSearch;
       *
       * // setter
       * mySelect.minimumResultsForSearch = 10;
       *
       * @name minimumResultsForSearch
       * @ojshortdesc The threshold for showing the search box in the dropdown.
       * @expose
       * @memberof oj.ojSelectMany
       * @instance
       * @type {number}
       * @default 15
       * @ojmin 0
       */
      /**
       * The threshold for showing the search box in the dropdown when it's expanded.
       * The search box is always displayed when the results size is greater than
       * the threshold, otherwise the search box is initially turned off.
       * However, the search box is displayed as soon as the user starts typing.
       *
       * @ojshortdesc The threshold for showing the search box in the dropdown.
       * @expose
       * @memberof oj.ojSelect
       * @instance
       * @ojfragment selectCommonMinimumResultsForSearch
       */
      minimumResultsForSearch: 15,

      /**
       * The placeholder text to set on the element.<p>
       * If the <code class="prettyprint">placeholder</code> attribute is specified to a string, ojselect will adds a placeholder item at the beginning of the dropdown list with
       *  <ul>
       *  <li>displayValue: placeholder text</li>
       *  <li>value: an empty string</li>
       *  </ul>
       * The placeholder item in the dropdown is selectable. However, it's not a valid choice, i.e. validation will fail if the select element is a required field.<p>
       * The placeholder item doesn't participate in the filtering, so it will not appear in the result list with a filter specified.<p>
       * Placeholder text can be an empty string, please see the select placeholder cookbook demo.
       *
       * @example <caption>Initialize the select with the <code class="prettyprint">placeholder</code> attribute specified:</caption>
       * &lt;oj-select-one placeholder="Please select ...">&lt;/oj-select-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">placeholder</code> property after initialization:</caption>
       * // getter
       * var placeholderValue = mySelect.placeholder;
       *
       * // setter
       * mySelect.placeholder = "Select a value";
       *
       * @name placeholder
       * @ojshortdesc A short hint that can be displayed before user selects a value.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojSelectOne
       * @type {string|null}
       * @default null
       * @ojtranslatable
       */
      /**
       * The placeholder text to set on the element. The placeholder specifies a short hint that can be displayed before user
       * selects a value.
       *
       * @example <caption>Initialize the select with the <code class="prettyprint">placeholder</code> attribute specified:</caption>
       * &lt;oj-select-many placeholder="Please select ...">&lt;/oj-select-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">placeholder</code> property after initialization:</caption>
       * // getter
       * var placeholderValue = mySelect.placeholder;
       *
       * // setter
       * mySelect.placeholder = "Select values";
       *
       * @name placeholder
       * @ojshortdesc A short hint that can be displayed before user selects a value.
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojSelectMany
       * @type {string|null}
       * @default null
       * @ojtranslatable
       */
      placeholder: null,

      /**
       * @typedef {Object} oj.ojSelect.OptionContext
       * @property {Element} componentElement A reference to the Select element.
       * @property {?Element} parent The parent of the data item. The parent is null for root node.
       * @property {number} index The index of the option, where 0 is the index of the first option. In the hierarchical case the index is relative to its parent.
       * @property {number } depth The depth of the option. The depth of the first level children under the invisible root is 0.
       * @property {boolean} leaf Whether the option is a leaf or a group.
       * @property {Object} data The data object for the option.
       * @property {Element} parentElement The option label element. The renderer can use this to directly append content.
       * @ojsignature [{target: "Type", value: "D", for: "data", jsdocOverride:true},
       *               {target: "Type", value: "<D = any>", for: "genericTypeParameters"}]
       */
      /**
       * {@ojinclude "name":"selectCommonOptionRenderer"}
       * @name optionRenderer
       * @ojshortdesc The renderer function that renders the content of each option.
       * @expose
       * @memberof oj.ojSelectOne
       * @instance
       * @type {null|function(Object):Object}
       * @ojsignature { target: "Type",
       *                value: "?((param0: oj.ojSelect.OptionContext<D>) => Element)|null",
       *                jsdocOverride: true}
       * @default null
       * @example <caption>Initialize the select with a renderer:</caption>
       * &lt;oj-select-one option-renderer="[[optionRenderer]]">&lt;/oj-select-one>
       * @example var optionRenderer = function(context) {
       *            var ojOption = document.createElement('oj-option');
       *            // Set the textContent or append other child nodes
       *            ojOption.textContent = context.data['FIRST_NAME'] + ' ' + context.data['LAST_NAME'];
       *            return ojOption;
       *          };
       */
      /**
       * {@ojinclude "name":"selectCommonOptionRenderer"}
       * @name optionRenderer
       * @ojshortdesc The renderer function that renders the content of each option.
       * @expose
       * @memberof oj.ojSelectMany
       * @instance
       * @type {null|function(Object):Object}
       * @ojsignature { target: "Type",
       *                value: "?((param0: oj.ojSelect.OptionContext<D>) => Element)|null",
       *                jsdocOverride: true}
       * @default null
       * @example <caption>Initialize the Select with a renderer:</caption>
       * &lt;oj-select-many option-renderer="[[optionRenderer]]">&lt;/oj-select-many>
       * @example var optionRenderer = function(context) {
       *            var ojOption = document.createElement('oj-option');
       *            // Set the textContent or append other child nodes
       *            ojOption.textContent = context.data['FIRST_NAME'] + ' ' + context.data['LAST_NAME'];
       *            return ojOption;
       *          };
       */
      /**
       * The renderer function that renders the content of each option.
       * The function should return an oj-option element (for leaf option) or an oj-optgroup element (for group option).
       * <p>It is not necessary to set the "value" attribute on the oj-option as it is available from the options data.</p>
       * <p><b>
       * Note: Prior to version 6.1.0, the function could also return one of the following:
       * <ul>
       *   <li>An Object with the following property:
       *     <ul><li>insert: HTMLElement - A DOM element representing the content of the option.</li></ul>
       *   </li>
       *   <li>undefined: If the developer chooses to manipulate the option content directly, the function should return undefined.</li>
       * </ul>
       * This is deprecated and support may be removed in the future.
       * </b></p>
       *
       * <p>The <code class="prettyprint">option-renderer</code> decides only
       * how the options' content has to be rendered in the drop down.
       * Once an option is selected from the drop down,
       * what value has to be displayed in the in input field is decided by the
       * label field in the data object. See <a href="#options">options</a>
       * and <a href="#optionsKeys">options-keys</a> for configuring option label and value.
       * </p>
       *
       * <p>The context parameter passed to the renderer contains the following keys:</p>
       * <table class="keyboard-table">
       *   <thead>
       *     <tr>
       *       <th>Key</th>
       *       <th>Description</th>
       *     </tr>
       *   </thead>
       *   <tbody>
       *     <tr>
       *       <td><kbd>componentElement</kbd></td>
       *       <td>A reference to the Select element.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>parent</kbd></td>
       *       <td>The parent of the data item. The parent is null for root node.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>index</kbd></td>
       *       <td>The index of the option, where 0 is the index of the first option. In the hierarchical case the index is relative to its parent.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>depth</kbd></td>
       *       <td>The depth of the option. The depth of the first level children under the invisible root is 0.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>leaf</kbd></td>
       *       <td>Whether the option is a leaf or a group.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>data</kbd></td>
       *       <td>The data object for the option.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>parentElement</kbd></td>
       *       <td>The option label element.  The renderer can use this to directly append content.</td>
       *     </tr>
       *   </tbody>
       * </table>
       *
       * @expose
       * @memberof oj.ojSelect
       * @instance
       * @ojfragment selectCommonOptionRenderer
       */
      optionRenderer: null,

      /**
       * @typedef {Object} oj.ojSelect.Option
       * @property {boolean=} disabled Option item is disabled.
       * @property {string=} label The display label for the option item. If it's missing, string(value) will be used.
       * @property {any} value The value of the option item.
       */
      /**
       * @typedef {Object} oj.ojSelect.Optgroup
       * @property {boolean=} disabled Option group is disabled.
       * @property {string} label The display label for the option group.
       * @property {Array.<oj.ojSelect.Option|oj.ojSelect.Optgroup>} children The Option or Optgroup children.
       */
      /**
       * {@ojinclude "name":"selectCommonOptions"}
       *
       * @name options
       * @ojshortdesc The option items for the Select.
       * @expose
       * @access public
       * @instance
       * @type {Array.<Object>|Object|null}
       * @ojsignature { target: "Type",
       *                value: "Array<oj.ojSelect.Option|oj.ojSelect.Optgroup>|DataProvider<K, D>|null",
       *                jsdocOverride: true}
       * @default null
       * @memberof oj.ojSelectOne
       *
       * @example <caption>Initialize the Select with the <code class="prettyprint">options</code> attribute specified:</caption>
       * &lt;oj-select-one options="[[dataArray]]">&lt;/oj-select-one>
       *
       * @example <caption>The options array should contain objects with value and label properties:</caption>
       * var dataArray = [{value: 'option1', label: 'Option 1'},
       *                  {value: 'option2', label: 'Option 2', disabled: true},
       *                  {value: 'option3', label: 'Option 3'}];
       *
       * @example <caption>Initialize the Select with a data provider and data mapping:</caption>
       * &lt;oj-select-one options="[[dataProvider]]">&lt;/oj-select-one>
       *
       * @example <caption>Data mapping can be used if data doesn't have value and label properties.</caption>
       * // actual field names are "id" and "name"
       * var dataArray = [
       *            {id: 'Id 1', name: 'Name 1'},
       *            {id: 'Id 2', name: 'Name 2'},
       *            {id: 'Id 3', name: 'Name 3'}];
       *
       * // In mapfields, map "name" to "label" and "id" to "value"
       * var mapFields = function(item) {
       *   var data = item['data'];
       *   var mappedItem = {};
       *   mappedItem['data'] = {};
       *   mappedItem['data']['label'] = data['name'];
       *   mappedItem['data']['value'] = data['id'];
       *   mappedItem['metadata'] = {'key': data['id']};
       *   return mappedItem;
       * };
       * var dataMapping = {'mapFields': mapFields};
       *
       * var arrayDataProvider = new oj.ArrayDataProvider(dataArray, {keyAttributes: 'id'});
       * var dataProvider = new oj.ListDataProviderView(arrayDataProvider, {'dataMapping': dataMapping});
       */
      /**
       * {@ojinclude "name":"selectCommonOptions"}
       *
       * @name options
       * @ojshortdesc The option items for the Select.
       * @expose
       * @access public
       * @instance
       * @type {Array.<Object>|Object|null}
       * @ojsignature { target: "Type",
       *                value: "Array<oj.ojSelect.Option|oj.ojSelect.Optgroup>|oj.DataProvider<K, D>|null",
       *                jsdocOverride: true}
       * @default null
       * @memberof oj.ojSelectMany
       *
       * @example <caption>Initialize the Select with the <code class="prettyprint">options</code> attribute specified:</caption>
       * &lt;oj-select-many options="[[dataArray]]">&lt;/oj-select-many>
       *
       * @example <caption>The options array should contain objects with value and label properties:</caption>
       * var dataArray = [{value: 'option1', label: 'Option 1'},
       *                  {value: 'option2', label: 'Option 2', disabled: true},
       *                  {value: 'option3', label: 'Option 3'}];
       *
       * @example <caption>Initialize the Select with a data provider and data mapping:</caption>
       * &lt;oj-select-many options="[[dataProvider]]">&lt;/oj-select-many>
       *
       * @example <caption>Data mapping can be used if data doesn't have value and label properties.</caption>
       * // actual field names are "id" and "name"
       * var dataArray = [
       *            {id: 'Id 1', name: 'Name 1'},
       *            {id: 'Id 2', name: 'Name 2'},
       *            {id: 'Id 3', name: 'Name 3'}];
       *
       * // In mapfields, map "name" to "label" and "id" to "value"
       * var mapFields = function(item) {
       *   var data = item['data'];
       *   var mappedItem = {};
       *   mappedItem['data'] = {};
       *   mappedItem['data']['label'] = data['name'];
       *   mappedItem['data']['value'] = data['id'];
       *   mappedItem['metadata'] = {'key': data['id']};
       *   return mappedItem;
       * };
       * var dataMapping = {'mapFields': mapFields};
       *
       * var arrayDataProvider = new oj.ArrayDataProvider(dataArray, {keyAttributes: 'id'});
       * var dataProvider = new oj.ListDataProviderView(arrayDataProvider, {'dataMapping': dataMapping});
       */
      /**
       * The option items for the Select. This attribute can be used instead of providing a list of <code class="prettyprint">oj-option</code> or <code class="prettyprint">oj-optgroup</code> child elements of the Select element.
       * This attribute accepts:
       * <ol>
       * <li>an array of <code class="prettyprint">oj.ojSelect.Option</code> and/or <code class="prettyprint">oj.ojSelect.Optgroup</code>.
       *   <ul>
       *   <li>Use <code class="prettyprint">oj.ojSelect.Option</code> for a leaf option.</li>
       *   <li>Use <code class="prettyprint">oj.ojSelect.Optgroup</code> for a group option.</li>
       *   </ul>
       * </li>
       * <li>a data provider. This data provider must implement <a href="DataProvider.html">oj.DataProvider</a>.
       *   <ul>
       *   <li><code class="prettyprint">value</code> in <code class="prettyprint">oj.ojSelect.Option</code> must be the row key in the data provider.</li>
       *   <li>A maximum of 15 rows will be displayed in the dropdown. If more than 15 results are available then users need to filter further. Please note that users can't filter further if render-mode is <code class="prettyprint">native</code>.</li>
       *   <li>If the data provider supports the filter criteria capability including the contains (<code class="prettyprint">$co or $regex</code>) operator, JET Select will request the data provider to do filtering. Otherwise it will filter internally.</li>
       *   <li>See also <a href="#perf-section">Improve page load performance</a></li>
       *   </ul>
       * </li>
       * </ol>
       *
       * @expose
       * @memberof oj.ojSelect
       * @instance
       * @ojfragment selectCommonOptions
       */
      options: null,

      /**
       * @typedef {Object} oj.ojSelect.OptionsKeys
       * @property {?string=} label The key name for the label.
       * @property {?string=} value The key name for the value.
       * @property {?string=} children The key name for the children.
       * @property {?Object=} childKeys The object for the child keys.
       * @ojsignature {target:"Type", value:"?(oj.ojSelect.OptionsKeys)", for:"childKeys", jsdocOverride:true}
       */
      /**
       * {@ojinclude "name":"selectCommonOptionsKeys"}
       *
       * @example <caption>Initialize the Select with <code class="prettyprint">options-keys</code> specified. This allows the key names to be redefined in the options array.</caption>
       * &lt;oj-select-one options-keys="[[optionsKeys]]">&lt;/oj-select-one>
       * @example var optionsKeys = {value : "state_abbr", label : "state_name"};
       * @example <caption>Redefine keys for data with subgroups.</caption>
       * var optionsKeys = {label : "regions", children : "states",
       *                    childKeys : {value : "state_abbr", label : "state_name"}};
       *
       * @name optionsKeys
       * @ojshortdesc Specify the key names to use in the options array.  Depending on options-keys means that the signature of the data does not match what is supported by the options attribute.
       * @expose
       * @access public
       * @instance
       * @type {?Object}
       * @default null
       * @memberof oj.ojSelectOne
       * @ojsignature {target:"Type", value:"oj.ojSelect.OptionsKeys|null", jsdocOverride:true}
       */
      /**
       * {@ojinclude "name":"selectCommonOptionsKeys"}
       *
       * @example <caption>Initialize the Select with <code class="prettyprint">options-keys</code> specified. This allows the key names to be redefined in the options array.</caption>
       * &lt;oj-select-many options-keys="[[optionsKeys]]">&lt;/oj-select-many>
       * @example var optionsKeys = {value : "state_abbr", label : "state_name"};
       * @example <caption>Redefine keys for data with subgroups.</caption>
       * var optionsKeys = {label : "regions", children : "states",
       *                    childKeys : {value : "state_abbr", label : "state_name"}};
       *
       * @name optionsKeys
       * @ojshortdesc Specify the key names to use in the options array.  Depending on options-keys means that the signature of the data does not match what is supported by the options attribute.
       * @expose
       * @access public
       * @instance
       * @type {?Object}
       * @default null
       * @memberof oj.ojSelectMany
       * @ojsignature {target:"Type", value:"oj.ojSelect.OptionsKeys|null", jsdocOverride:true}
       */
      /**
       * Specify the key names to use in the options array.
       * <p>Depending on options-keys means that the signature of the data does not match what is supported by the options attribute. When using Typescript, this would result in a compilation error.</p>
       * <p>Best practice is to use a <a href="ListDataProviderView.html">oj.ListDataProviderView</a> with data mapping as a replacement.</p>
       * <p>However, for the app that must fetch data from a REST endpoint where the data fields do not match those that are supported by the options attribute, you may use the options-keys with any dataProvider that implements <a href="DataProvider.html">oj.DataProvider</a> interface.</p>
       * <p>Note: <code class="prettyprint">child-keys</code> and <code class="prettyprint">children</code> properties in <code class="prettyprint">options-keys</code> are ignored when using a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>.</p>
       *
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojSelect
       * @ojfragment selectCommonOptionsKeys
       */
      optionsKeys: {
        /**
         * The key name for the label.
         *
         * @name optionsKeys.label
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojSelectOne
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The key name for the label.
         *
         * @name optionsKeys.label
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojSelectMany
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The key name for the value.
         *
         * @name optionsKeys.value
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojSelectOne
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The key name for the value.
         *
         * @name optionsKeys.value
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojSelectMany
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The key name for the children. It is ignored when using a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>.
         *
         * @name optionsKeys.children
         * @ojshortdesc The key name for the children. It is ignored when using a TreeDataProvider.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojSelectOne
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The key name for the children. It is ignored when using a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>.
         *
         * @name optionsKeys.children
         * @ojshortdesc The key name for the children. It is ignored when using a TreeDataProvider.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojSelectMany
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
        /**
         * The object for the child keys. It is ignored when using a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>.
         *
         * @name optionsKeys.childKeys
         * @ojshortdesc The object for the child keys. It is ignored when using a TreeDataProvider.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojSelectOne
         * @type {?Object}
         * @default null
         * @ojsignature {target:"Type", value:"oj.ojSelect.OptionsKeys|null", jsdocOverride:true}
         */
        /**
         * The object for the child keys. It is ignored when using a <a href="TreeDataProvider.html">oj.TreeDataProvider</a>.
         *
         * @name optionsKeys.childKeys
         * @ojshortdesc The object for the child keys. It is ignored when using a TreeDataProvider.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojSelectMany
         * @type {?Object}
         * @default null
         * @ojsignature {target:"Type", value:"oj.ojSelect.OptionsKeys|null", jsdocOverride:true}
         */
      },

      /**
       * <p>Attributes specified here will be set on the picker DOM element when it's launched.
       * <p>The supported attribute is <code class="prettyprint">class</code>, which is appended to the picker's class, if any.
       * Note: 1) picker-attributes is not applied in the native renderMode.
       * 2) setting this attribute after element creation has no effect.
       *
       * @property {string=} style The css style to append to the picker.
       * @property {string=} class The css class to append to the picker.
       *
       * @example <caption>Initialize the select specifying the class attribute to be set on the picker DOM element:</caption>
       * &lt;oj-select-one picker-attributes="[[pickerAttributes]]">&lt;/oj-select-one>
       * @example var pickerAttributes = {
       *   "class": "my-class"
       * };
       *
       * @name pickerAttributes
       * @ojshortdesc The style attributes for the drop down.
       * @expose
       * @memberof oj.ojSelectOne
       * @ojdeprecated {target: "property", for: "style", since: "7.0.0", description: "Style property of pickerAttribute is deprecated as it violates the recommended <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy'>Content Security Policy</a> for JET which disallows <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src'>inline styles</a>. Use class property instead. As of 11.0.0 this property is ignored and an error is logged."}
       * @instance
       * @type {?Object}
       * @default null
       */
      /**
       * <p>Attributes specified here will be set on the picker DOM element when it's launched.
       * <p>The supported attribute is <code class="prettyprint">class</code>, which is appended to the picker's class, if any.
       * Note: 1) picker-attributes is not applied in the native renderMode.
       * 2) setting this attribute after element creation has no effect.
       *
       * @property {string=} style The css style to append to the picker.
       * @property {string=} class The css class to append to the picker.
       *
       * @example <caption>Initialize the select specifying the class attribute to be set on the picker DOM element:</caption>
       * &lt;oj-select-many picker-attributes="[[pickerAttributes]]">&lt;/oj-select-many>
       * @example var pickerAttributes = {
       *   "class": "my-class"
       * };
       *
       * @name pickerAttributes
       * @ojshortdesc The style attributes for the drop down.
       * @expose
       * @memberof oj.ojSelectMany
       * @ojdeprecated {target: "property", for: "style", since: "7.0.0", description: "Style property of pickerAttribute is deprecated as it violates the recommended <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy'>Content Security Policy</a> for JET which disallows <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src'>inline styles</a>. Use class property instead. As of 11.0.0 this property is ignored and an error is logged."}
       * @instance
       * @type {?Object}
       * @default null
       */
      pickerAttributes: null,

      /**
       * {@ojinclude "name":"selectCommonRequired"}
       *
       * @example <caption>Initialize the select with the <code class="prettyprint">required</code> attribute:</caption>
       * &lt;oj-select-one required="[[isRequired]]">&lt;/oj-select-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">required</code> property after initialization:</caption>
       * // getter
       * var requiredValue = mySelect.required;
       *
       * // setter
       * mySelect.required = true;
       *
       * @name required
       * @expose
       * @ojshortdesc Specifies whether the component is required or optional. See the Help documentation for more information.
       * @access public
       * @instance
       * @memberof oj.ojSelectOne
       * @type {boolean}
       * @default false
       * @since 0.7.0
       * @see #translations
       */
      /**
       * {@ojinclude "name":"selectCommonRequired"}
       *
       * @example <caption>Initialize the select with the <code class="prettyprint">required</code> attribute:</caption>
       * &lt;oj-select-many required="[[isRequired]]">&lt;/oj-select-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">required</code> property after initialization:</caption>
       * // getter
       * var requiredValue = mySelect.required;
       *
       * // setter
       * mySelect.required = true;
       *
       * @name required
       * @expose
       * @ojshortdesc Specifies whether the component is required or optional. See the Help documentation for more information.
       * @access public
       * @instance
       * @memberof oj.ojSelectMany
       * @type {boolean}
       * @default false
       * @since 0.7.0
       * @see #translations
       */
      /**
       * <p>
       * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
       * This is the default.
       * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
       * </p>
       * <p>
       * In the Redwood theme, by default, a Required text is rendered inline when the field is empty.
       * If user-assistance-density is 'compact', it will show on the label as an icon.
       * In the Alta theme the input's label will render a required icon.
       * </p>
       * <p>The Required error text is based on Redwood UX designs, and it is not recommended that
       * it be changed.
       * To override the required error message,
       * use the <code class="prettyprint">translations.required</code> attribute.
       * The component's label text is passed in as a token {label} and can be used in the message detail.
       * </p>
       * <p>When required is set to true, an implicit
       * required validator is created, i.e.,
       * <code class="prettyprint">new RequiredValidator()</code>. The required validator is the only
       * validator to run during initial render, and its error is not shown to the user at this time;
       * this is called deferred validation. The required validator also runs during normal validation;
       * this is when the errors are shown to the user.
       * See the <a href="#validation-section">Validation and Messaging</a> section for details.
       * </p>
       * <p>
       * When the <code class="prettyprint">required</code> property changes due to programmatic intervention,
       * the component may clear component messages and run validation, based on the current state it's in. </br>
       *
       * <h4>Running Validation when required property changes</h4>
       * <ul>
       * <li>if component is valid when required is set to true, then it runs deferred validation on
       * the value property. If the field is empty, the valid state is invalidHidden. No errors are
       * shown to the user.
       * </li>
       * <li>if component is invalid and has deferred messages when required is set to false, then
       * component messages are cleared (messages-custom messages are not cleared)
       * but no deferred validation is run because required is false.
       * </li>
       * <li>if component is invalid and currently showing invalid messages when required is set, then
       * component messages are cleared and normal validation is run using the current display value.
       * <ul>
       *   <li>if there are validation errors, then <code class="prettyprint">value</code>
       *   property is not updated and the error is shown.
       *   </li>
       *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
       *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
       *   event on the component to clear custom errors.</li>
       * </ul>
       * </li>
       * </ul>
       *
       * <h4>Clearing Messages when required property changes</h4>
       * <ul>
       * <li>Only messages created by the component, like validation messages, are cleared when the required property changes.</li>
       * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
       * </ul>
       *
       * </p>
       *
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojSelect
       * @since 0.7.0
       * @see #translations
       * @ojfragment selectCommonRequired
       */
      required: false,

      /**
       * Dictates element's readonly state.
       * <p>
       * The default value for readonly is false. However, if the form component is a descendent of
       * <code class="prettyprint">oj-form-layout</code>, the default value for readonly could come from the
       * <code class="prettyprint">oj-form-layout</code> component's readonly attribute.
       * The <code class="prettyprint">oj-form-layout</code> uses the
       * <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
       * <code class="prettyprint">provide</code> property to provide its
       * <code class="prettyprint">readonly</code>
       * attribute value to be consumed by descendent components.
       * The form components are configured to consume the readonly property if an ancestor provides it and
       * it is not explicitly set.
       * For example, if the oj-form-layout's readonly attribute is set to true, and a descendent form component does
       * not have its readonly attribute set, the form component's readonly will be true.
       * </p>
       * @example <caption>Initialize the select with the <code class="prettyprint">readonly</code> attribute:</caption>
       * &lt;oj-some-element readonly>&lt;/oj-some-element>
       *
       * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
       * // getter
       * var ro = myComp.readonly;
       *
       * // setter
       * myComp.readonly = false;
       *
       * @name readonly
       * @expose
       * @ojshortdesc Specifies whether a value is readonly
       * @access public
       * @instance
       * @memberof oj.ojSelectOne
       * @type {boolean}
       * @default false
       */
      /**
       * Dictates element's readonly state.
       * <p>
       * The default value for readonly is false. However, if the form component is a descendent of
       * <code class="prettyprint">oj-form-layout</code>, the default value for readonly could come from the
       * <code class="prettyprint">oj-form-layout</code> component's readonly attribute.
       * The <code class="prettyprint">oj-form-layout</code> uses the
       * <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
       * <code class="prettyprint">provide</code> property to provide its
       * <code class="prettyprint">readonly</code>
       * attribute value to be consumed by descendent components.
       * The form components are configured to consume the readonly property if an ancestor provides it and
       * it is not explicitly set.
       * For example, if the oj-form-layout's readonly attribute is set to true, and a descendent form component does
       * not have its readonly attribute set, the form component's readonly will be true.
       * </p>
       * @example <caption>Initialize the select with <code class="prettyprint">readonly</code> attribute:</caption>
       * &lt;oj-some-element readonly>&lt;/oj-some-element>
       *
       * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
       * // getter
       * var ro = myComp.readonly;
       *
       * // setter
       * myComp.readonly = false;
       *
       * @name readonly
       * @expose
       * @ojshortdesc Specifies whether a value is readonly
       * @access public
       * @instance
       * @memberof oj.ojSelectMany
       * @type {boolean}
       * @default false
       */
      readOnly: false,

      /**
       * {@ojinclude "name":"selectCommonRenderMode"}
       * @example <caption>Set the <code class="prettyprint">render-mode</code> attribute:</caption>
       * &lt;oj-select-one render-mode="native">&lt;/oj-select-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">renderMode</code> property after initialization:</caption>
       * // getter
       * var renderMode = mySelect.renderMode;
       *
       * // setter
       * mySelect.renderMode = "native";
       *
       * @name renderMode
       * @ojshortdesc Specifies whether to render select in JET or as a HTML Select tag.
       * @expose
       * @memberof oj.ojSelectOne
       * @instance
       * @type {string}
       * @ojvalue {string} "jet" Render the select in jet mode.
       * @ojvalue {string} "native" Render the select in native mode.
       *
       * @ojdeprecated {since: '8.0.0', description: 'The "native" mode rendering is deprecated because JET is promoting a consistent Oracle UX over native look and feel in Redwood. Since this property takes only two values the property itself is deprecated. The theme variable "$selectRenderModeOptionDefault" is also deprecated for the same reason.'}
       */
      /**
       * {@ojinclude "name":"selectCommonRenderMode"}
       * @example <caption>Set the <code class="prettyprint">render-mode</code> attribute:</caption>
       * &lt;oj-select-many render-mode="native">&lt;/oj-select-many>
       *
       * @example <caption>Get or set the <code class="prettyprint">renderMode</code> property after initialization:</caption>
       * // getter
       * var renderMode = mySelect.renderMode;
       *
       * // setter
       * mySelect.renderMode = "native";
       *
       * @name renderMode
       * @ojshortdesc Specifies whether to render select in JET or as a HTML Select tag.
       * @expose
       * @memberof oj.ojSelectMany
       * @instance
       * @type {string}
       * @ojvalue {string} "jet" Render the select in jet mode.
       * @ojvalue {string} "native" Render the select in native mode.
       *
       * @ojdeprecated {since: '8.0.0', description: 'The "native" mode rendering is deprecated because JET is promoting a consistent Oracle UX over native look and feel in Redwood. Since this property takes only two values the property itself is deprecated. The theme variable "$selectRenderModeOptionDefault" is also deprecated for the same reason.'}
       */
      /**
       * The render-mode attribute allows applications to specify whether to render select in JET or as a HTML Select tag.
       * Valid Values: jet, native
       *
       * <ul>
       *  <li> jet - Applications get full JET functionality.</li>
       *  <li> native - Applications get the HTML Select tag functionality and additional JET features below:
       *    <ul>
       *      <li>validation</li>
       *      <li>placeholder</li>
       *      <li>options (ko.observableArray)</li>
       *      <li>list</li>
       *      <li>optionKeys</li>
       *    </ul>
       *  With native renderMode, the functionality that is sacrificed compared to jet renderMode is:
       *    <ul>
       *      <li>no search box (no filtering)</li>
       *      <li>for multiple select, only number of selected items is displayed in the selectbox, not the selected values</li>
       *      <li>beforeExpand event isn't fired when the popup picker opens.</li>
       *      <li>only one level nesting optgroups in the popup picker due to the HTML optgroup limitation</li>
       *      <li>no image support in the option list</li>
       *      <li>All Sub-IDs are not available in the native renderMode.</li>
       *      <li>pickerAttributes is not applied in the native renderMode.</li>
       *      <li>when using data provider a maximum of 15 rows will be displayed in the dropdown, users can't filter further.</li>
       *      <li>if the <a href="#labelHint">label-hint</a> attribute is used in conjunction with a <a href="#labelEdge">label-edge</a> value of 'inside', no label will be rendered; as this can result in non-accessible pages, jet renderMode must be used in this case.</li>
       *    </ul>
       * </ul>
       *
       * The default value depends on the theme. In alta-android, alta-ios and alta-windows themes, the default is "native" and it's "jet" for all other themes.
       *
       * @expose
       * @memberof oj.ojSelect
       * @instance
       * @ojfragment selectCommonRenderMode
       */
      renderMode: 'jet',

      /**
       * The <code class="prettyprint">valueOption</code> is similar to the <code class="prettyprint">value</code>, but is an
       * Object which contains both a value and display label.
       * The <code class="prettyprint">value</code> and <code class="prettyprint">valueOption</code> are kept in sync.
       * If initially both are set, the selected value in the <code class="prettyprint">value</code> attribute has precedence.
       * <p>Note: When the <code class="prettyprint">options</code> attribute is bound to a data provider, the <code class="prettyprint">valueOptionChanged</code> event will include data and metadata information if it is available from data provider.</p>
       * <p>Setting the <code class="prettyprint">valueOption</code> attribute initially can improve page load performance if there are initially selected values.  But, the initial <code class="prettyprint">valueOptionChanged</code> event will not include data and metadata information, because the element doesn't have to fetch the selected label from the data provider.</p>
       * <p>If <code class="prettyprint">valueOption</code> is not specified or the selected value is missing, then the label will be fetched from the data provider.</p>
       *
       * @name valueOption
       * @ojshortdesc The current value of the element and its associated display label.
       * @expose
       * @instance
       * @type {null | Object}
       * @default null
       * @ojwriteback
       *
       * @property {any} value current value of JET Select
       * @property {string} [label] display label of value above. If missing, String(value) is used.
       * @memberof oj.ojSelectOne
       * @ojsignature { target: "Type",
       *                value: "V|null", for: "value"}
       *
       * @example <caption>Initialize the Select with the <code class="prettyprint">value-option</code> attribute specified:</caption>
       * &lt;oj-select-one value-option="[[valueOption]]">&lt;/oj-select-one>
       *
       * @example <caption>Object with value and label properties:</caption>
       * var valueOption = {'value': 'val1', 'label': 'Label 1'};
       *
       * @example <caption>Get or set the <code class="prettyprint">valueOption</code> property after initialization:</caption>
       * // getter
       * var valueOption = mySelect.valueOption;
       *
       * // setter
       * mySelect.valueOption = valueOption;
       */
      valueOption: null,

      /**
       * The <code class="prettyprint">valueOptions</code> is similar to the <code class="prettyprint">value</code>, but is an array
       * of Objects and each Object contains both a value and display label.
       * The <code class="prettyprint">value</code> and <code class="prettyprint">valueOptions</code> are kept in sync.
       * If initially both are set, the selected values in the <code class="prettyprint">value</code> attribute has precedence.
       * <p>Note: When the <code class="prettyprint">options</code> attribute is bound to a data provider, the <code class="prettyprint">valueOptionsChanged</code> event will include data and metadata information if it is available from data provider.</p>
       * <p>Setting the <code class="prettyprint">valueOptions</code> attribute initially can improve page load performance if there are initially selected values.  But, the initial <code class="prettyprint">valueOptionsChanged</code> event will not include data and metadata information, because the element doesn't have to fetch the selected label from the data provider.</p>
       *<p>If <code class="prettyprint">valueOptions</code> is not specified or one of the selected values is missing, then the labels will be fetched from the data provider.</p>
       *
       * @name valueOptions
       * @ojshortdesc The current values of the element and their associated display labels.
       * @expose
       * @instance
       * @type {null | Array.<Object>}
       * @default null
       * @ojwriteback
       *
       * @property {any} value a current value of JET Select
       * @property {string} [label] display label of value above. If missing, String(value) is used.
       * @ojsignature { target: "Type",
       *                value: "Array<{value: V, label?: string}> | null",
       *                jsdocOverride: true}
       *
       * @memberof oj.ojSelectMany
       *
       * @example <caption>Initialize the Select with the <code class="prettyprint">value-options</code> attribute specified:</caption>
       * &lt;oj-select-many value-options="[[optionsArray]]">&lt;/oj-select-many>
       *
       * @example <caption>Array of Objects with value and label properties:</caption>
       * var optionsArray = [{'value': 'val1', 'label': 'Label 1'},
       *                     {'value': 'val2', 'label': 'Label 2'}];
       *
       * @example <caption>Get or set the <code class="prettyprint">valueOptions</code> property after initialization:</caption>
       * // getter
       * var valueOptions = mySelect.valueOptions;
       *
       * // setter
       * mySelect.valueOptions = optionsArray;
       */
      valueOptions: null

      /**
       * The value of the element. It supports any type. Select only accepts a value that's in the drop down list.
       * When the value attribute is not set, the first option is used as its initial value if it exists.
       * Trying to set a new value that's not in the drop down list fails validation and the new value is not set.
       * <p>If a value is specified before the data for the drop down list is available, then that value is set initially.
       * When the data for the drop down list is available, the initially set value is validated.
       * If it fails validation, the first option will be set as the value instead.</p>
       * <p>Note: When the <code class="prettyprint">options</code> attribute is bound to a data provider, the <code class="prettyprint">valueChanged</code> event will include data and metadata information if it is available from data provider.</p>
       *
       * @example <caption>Initialize the select with the <code class="prettyprint">value</code> attribute specified:</caption>
       * &lt;oj-select-one value="option1">&lt;/oj-select-one>
       *
       * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
       * // getter
       * var value = mySelect.value;
       *
       * // setter
       * mySelect.value = "option1";
       *
       * @member
       * @name value
       * @ojshortdesc The value of the element.
       * @access public
       * @instance
       * @memberof oj.ojSelectOne
       * @type {any}
       * @ojsignature { target: "Type",
       *                value: "V|null"}
       * @ojwriteback
       * @ojeventgroup common
       */
      /**
       * The value of the element. The value is an array with any type of items.
       * <p>Note: When the <code class="prettyprint">options</code> attribute is bound to a data provider, the <code class="prettyprint">valueChanged</code> event will include data and metadata information if it is available from data provider.</p>
       *
       * @example <caption>Initialize the select with the <code class="prettyprint">value</code> attribute specified:</caption>
       * &lt;oj-select-many value="{{val}}">&lt;/oj-select-many>
       * @example var val = ['option1', 'option2'];
       *
       * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
       * // getter
       * var value = mySelect.value;
       *
       * // setter
       * mySelect.value = ["option1", "option2"];
       *
       * @member
       * @name value
       * @ojshortdesc The value of the element.
       * @access public
       * @instance
       * @memberof oj.ojSelectMany
       * @type {Array.<any>|null}
       * @ojsignature { target: "Type",
       *                value: "Array<V>|null"}
       * @default null
       * @ojwriteback
       * @ojeventgroup common
       */
    },

    /**
     * Returns a jQuery object containing the element visually representing the select.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof! oj.ojSelect
     * @instance
     * @public
     * @ignore
     * @return {jQuery} the select
     */
    widget: function () {
      // native renderMode
      if (this.select) {
        return this.select.container;
      }
      return this.element.parent().parent();
    },

    /**
     * @override
     * @protected
     * @instance
     * @memberof! oj.ojSelect
     */
    _ComponentCreate: function () {
      this._super();
      _ComboUtils.wrapDataProviderIfNeeded(this, null);
      this._setup();
    },

    /**
     * @override
     * @protected
     * @instance
     * @memberof! oj.ojSelect
     */
    _AfterCreate: function () {
      this._super();

      // For custom element syntax, we need to get the label id and
      // set aria-labelledby on the focusable element.
      if (this._IsCustomElement()) {
        // JET-42350 - As a part of the fix, components with oj-option children are updated with _TRACK_CHILDREN metadata.
        // This resulted in these components to be created asynchronously. Previously, when oj-label asynchronously set
        // labelled-by attribute, these components would have already been created. So, at that point, _setOption would have
        // been called and necessary updates are done there. But now, since these components are created asynchronously, oj-label
        // might have already set the labelled-by property and hence setOption will not be called. So, we need to do the
        // necessary updates when creating the component, if that is the case.
        if (this.options.labelledBy) {
          // Update the aria attributes based on the labelled-by attribute
          this._labelledByUpdatedForSelectComp();
        }
        // need to apply the oj-focus marker selector for control of the floating label.
        var rootElement = this._getRootElement();
        this._focusable({
          element: rootElement,
          applyHighlight: true,
          afterToggle: this._handleAfterFocusToggle.bind(this, rootElement)
        });

        // If labelEdge is set to none, aria-label would have been set to the innerElem
        // so, we need to update the aria-label elsewhere
        if (this.select && this.options.labelEdge === 'none') {
          this.select.updateAriaLabelIfNeeded();
        }
      }
    },

    /**
     * If the dropdown is open and the afterToggle handler is called with focusout,
     * turn on the 'oj-focus' selector. This is needed for floating labels.  If focus
     * moves to the droplist, the label should be in the up position versus floating
     * down over the input on selection of a dropdown item.
     * @private
     * @instance
     * @memberof! oj.ojSelect
     */
    _handleAfterFocusToggle: function (element, eventType) {
      this.hasAfterToggleHandlerAddedFocusClass = false;
      if (eventType === 'focusout') {
        var dropdown = this._getDropdown();
        if (dropdown) {
          element.classList.add('oj-focus');
          this.hasAfterToggleHandlerAddedFocusClass = true;
        }
      }
    },

    /**
     * Performs post processing after _SetOption() is called. Different options when changed perform
     * different tasks. See _AfterSetOption[OptionName] method for details.
     *
     * @param {string} option
     * @param {Object|string=} previous
     * @param {Object=} flags
     * @protected
     * @memberof! oj.ojSelect
     * @instance
     * @override
     */
    // eslint-disable-next-line no-unused-vars
    _AfterSetOption: function (option, previous, flags) {
      this._superApply(arguments);
      switch (option) {
        case 'required':
          this._AfterSetOptionRequired(option);
          break;
        case 'labelHint':
        case 'labelEdge':
          // Changing labelHint and labelEdge might have updated
          // aria-label on the root element. Check if it is needed to
          // update the aria-label on inner elements.
          if (this.select) {
            this.select.updateAriaLabelIfNeeded();
          }
          break;
        default:
          break;
      }
    },

    /**
     * Whether the component is required.
     *
     * @return {boolean} true if required; false
     *
     * @memberof! oj.ojSelect
     * @instance
     * @protected
     * @override
     */
    _IsRequired: function () {
      return this.options.required;
    },

    /**
     * This method handles the labelled-by attribute change
     *
     * @memberof! oj.ojSelect
     * @instance
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _labelledByUpdatedForSelectComp: function () {
      const labelledBy = this.options.labelledBy;
      const requiredText = this.options.translations.required;

      if (!labelledBy) {
        // If no labelledby is present return doing nothing
        return;
      }

      const ariaLabelledBy = ojeditablevalue.EditableValueUtils._getOjLabelAriaLabelledBy(
        labelledBy,
        `${this.uuid}_Label`
      );
      // Readonly support
      if (ariaLabelledBy && (!this.multiple || !_ComboUtils.isReadonly(this))) {
        this._GetContentElement().attr('aria-labelledby', ariaLabelledBy);
      }

      // update the required translation text
      if (this._IsRequired() && requiredText) {
        this._implicitReqValidator = null;
        this._getImplicitRequiredValidator();
      }

      // Update the aria-labelledby attribute of the results container
      // Fix  - Acc error in the OATB tool
      if (this.select) {
        this.select.updateAriaLabelledByIfNeeded(ariaLabelledBy);
      }
    },

    /**
     * Performs post processing after required option is set by taking the following steps.
     *
     * - if component is invalid and has messgesShown -> required: false/true -> clear component errors;
     * run full validation with UI value (we don't know if the UI error is from a required validator
     * or something else);<br/>
     * &nbsp;&nbsp;- if there are validation errors, then value not pushed to model; messagesShown is
     * updated<br/>
     * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to
     * listen to optionChange(value) to clear custom errors.<br/>
     *
     * - if component is invalid and has messagesHidden -> required: false -> clear component
     * errors; no deferred validation is run.<br/>
     * - if component has no error -> required: true -> run deferred validation (we don't want to flag
     * errors unnecessarily)<br/>
     * - messagesCustom is never cleared<br/>
     *
     * @param {string} option
     *
     * @memberof! oj.ojSelect
     * @instance
     * @protected
     */
    _AfterSetOptionRequired: ojeditablevalue.EditableValueUtils._AfterSetOptionRequired,

    // native renderMode
    _nativeSetDisabled: function (disabled) {
      if (disabled) {
        this.element.attr('disabled', '');
        this.element.parent().parent().addClass('oj-disabled').removeClass('oj-enabled');
      } else {
        this.element.removeAttr('disabled');
        this.element.parent().parent().removeClass('oj-disabled').addClass('oj-enabled');
      }
    },

    _nativeChangeHandler: function (event) {
      var arr = [];
      var arrValOpts = [];
      var emptyValueAllowed = !this._IsRequired() && this._HasPlaceholderSet();

      // NOTE: option and optgroup
      $(event.target)
        .find('option')
        .each(function () {
          if (this.selected && (this.value || (emptyValueAllowed && this.value === ''))) {
            arr.push(this.value);
            arrValOpts.push({ value: this.value, label: this.text });
          }
        });

      if (_ComboUtils.duringFetchByKey(this.element)) {
        _ComboUtils.setValueChanged(this, true);
      }

      // - ie11 multiple select with keyboard fails
      if (!this._IsCustomElement() || this.multiple === true) {
        this._SetValue(arr, event, { doValueChangeCheck: false, _context: { internalSet: true } });
        _ComboUtils.setValueOptions(this, arrValOpts);
      } else {
        this._SetValue(arr[0], event, { doValueChangeCheck: false, _context: { internalSet: true } });
        _ComboUtils.setValueOptions(this, arrValOpts[0]);
      }
    },

    _nativeQueryCallback: function (data) {
      if (!data) {
        return;
      }

      // populate data in dropdown here
      var element = this.element;

      // if options is a dataProvider, it was wrapped with LPDV
      // don't pass in optionsKeys
      _ComboUtils.arrayPopulateResults(
        element,
        data,
        this._formatValue.bind(this),
        _ComboUtils.isDataProvider(this.options.options) ? null : this.options.optionsKeys
      );

      element.addClass(_ComboUtils.GENERATED_OPTIONS_SELECTOR);
    },

    _nativeSetSelected: function (value) {
      var selected = null;
      if (value) {
        selected = value;
      } else {
        if (this._HasPlaceholderSet()) {
          if (this.options.required) {
            selected = this._nativeFindFirstEnabledOptionValue();
          }
          this._SetPlaceholder(this.options.placeholder);
        }

        // default to the first enabled option
        if (selected === null) {
          var option = this._nativeFindFirstEnabledOption();
          selected = this._nativeFindFirstEnabledOptionValue(option);
          _ComboUtils.setValueOptions(this, { value: selected, label: option.text() });
        }
      }
      this._setInitialSelectedValue(selected);
    },

    // fetch first block from data provider
    // when data available validate the selected value
    _nativeFetchFromDataProvider: function () {
      var self = this;
      _ComboUtils.fetchFirstBlockFromDataProvider(this.element, self.options).then(function (data) {
        self._nativeQueryCallback(data);
        if (data.length) {
          // make sure value still valid
          var selected = self.options.value;
          if (selected) {
            _ComboUtils
              .validateFromDataProvider(self.element, self.options, selected)
              .then(function (results) {
                //  - need to be able to specify the initial value of select components bound to dprv
                if (_ComboUtils.isValueChanged(self) && self.multiple === false) {
                  _ComboUtils.setValueChanged(self, undefined);
                } else {
                  var vals;
                  var valOpts;
                  if (_ComboUtils.isValueChanged(self) && self.multiple) {
                    valOpts = self.options.valueOptions;
                    vals = self.options.value;
                    _ComboUtils.setValueChanged(self, undefined);
                  }
                  if (results) {
                    var valueOptions = results.valueOptions;
                    if (Array.isArray(valueOptions) && valueOptions.length) {
                      _ComboUtils.setValueOptions(
                        self,
                        valOpts ? valueOptions.concat(valOpts) : valueOptions
                      );
                    }
                    // only set value if it is valid
                    var values = results.value;
                    if (Array.isArray(values) && values.length) {
                      vals = vals ? values.concat(vals) : values;

                      var cval = self.multiple ? vals : values[0];
                      self._nativeSetSelected(cval);

                      //  - select component binding broken in mobile
                      // need update the selected value property
                      // Note: setting multiple selected values causing
                      // the selection to be cleared
                      if (!self.multiple || cval.length === 1) {
                        self.element[0].value = cval;
                      }
                    }
                  }
                }
              });
          } else {
            // no selected value, default to placeholder or 1st item
            self._nativeSetSelected();
          }
        }
      });
    },

    _nativeSetup: function () {
      var element = this.element;

      if (this._IsCustomElement()) {
        // The custom element will be the wrapper and we do not need to add another wrapper
        $(this.OuterWrapper).addClass('oj-select-native oj-component oj-select oj-form-control');
      } else {
        // add a <div> around <select> for validation error
        element
          .wrap('<div>') // @HTMLUpdateOK
          .parent()
          .addClass('oj-select-native oj-component oj-select oj-form-control');
      }
      element.addClass('oj-select-select oj-component-initnode');

      element.wrap('<div class="oj-text-field-container" role="presentation">'); // @HTMLUpdateOK
      // multiple attr
      if (this.multiple) {
        if (!element[0].multiple) {
          element[0].multiple = true;
        }

        // prettier-ignore
        element.parent().prepend( // @HTMLUpdateOK
          "<a class='oj-select-arrow oj-component-icon oj-clickable-icon-nocontext oj-select-multiple-open-icon' role='presentation'></a>"
        );
      } else {
        // prettier-ignore
        element.parent().prepend( // @HTMLUpdateOK
          "<a class='oj-select-arrow oj-component-icon oj-clickable-icon-nocontext oj-select-open-icon' role='presentation'></a>"
        );
      }
      // disable attr
      this._nativeSetDisabled(this.options.disabled);

      if (this.options.list) {
        _ComboUtils.listPopulateResults(
          element,
          $('#' + this.options.list).children(),
          this._formatValue.bind(this)
        );
        element.addClass(_ComboUtils.GENERATED_OPTIONS_SELECTOR);
      } else if (this.options.options) {
        if (_ComboUtils.getDataProvider(this.options)) {
          this._nativeFetchFromDataProvider();
        } else {
          this._nativeQueryCallback(this.options.options);
        }
      } else if (this._IsCustomElement()) {
        // TODO: TEST if the dropdown only contains a placeholder don't call ojOptionPopulateResults
        var children = element.children();
        if (children.length !== 1 || !children.hasClass('oj-listbox-placeholder')) {
          // handle custom element with oj-option, oj-optgroup case
          _ComboUtils.ojOptionPopulateResults(element, children, this._formatValue.bind(this));
          element.addClass(_ComboUtils.GENERATED_OPTIONS_SELECTOR);
        }
      }

      this._focusable({
        element: element,
        applyHighlight: true
      });

      //  - the selected option of the ojselect not reflected in the value variable
      if (
        !this.options.value &&
        !this._HasPlaceholderSet() &&
        !_ComboUtils.getDataProvider(this.options)
      ) {
        this._setInitialSelectedValue(this._nativeFindFirstEnabledOptionValue());
      }

      // add a change listener
      element.change(this._nativeChangeHandler.bind(this));

      _ComboUtils.addDataProviderEventListeners(this);

      var labelEdge = this._ResolveLabelEdgeStrategyType();
      if (labelEdge === 'top') {
        this._initComponentMessaging();
      }
    },

    /**
     * Resolves the labelEdge.
     * @memberof  oj.ojSelect
     * @instance
     * @protected
     * @return {string}
     */
    // eslint-disable-next-line no-unused-vars
    _ResolveLabelEdgeStrategyType: function () {
      var labelEdge = this._superApply(arguments);

      if (this._IsCustomElement() && this._isNative()) {
        if (labelEdge === 'inside') {
          labelEdge = 'top';
        }
      }
      return labelEdge;
    },

    // native renderMode
    _jetSetup: function () {
      var opts = {};

      opts.element = this.element;
      opts.ojContext = this;
      opts = $.extend(this.options, opts);

      // Fetch the option defaults from the CSS file
      this.cssOptionDefaults = ThemeUtils.parseJSONFromFontFamily('oj-select-option-defaults') || {};

      this.select = this.multiple ? new _OjMultiSelect() : new _OjSingleSelect();
      this.select._init(opts);

      this.select.container.addClass('oj-select-jet oj-form-control');

      this._focusable({
        element: this.select.selection,
        applyHighlight: true
      });

      //      var arrow = this.select.selection.children(".oj-select-arrow");
      //      this._AddHoverable(arrow);
      //      this._AddActiveable(arrow);
    },

    //  - the selected option of the ojselect not reflected in the value variable
    _setInitialSelectedValue: function (selectedVal) {
      var selected;

      if (!this._IsCustomElement()) {
        selected = Array.isArray(selectedVal) ? selectedVal : [selectedVal];
      } else {
        selected = selectedVal;
      }

      this._SetValue(selected, null, {
        doValueChangeCheck: false,
        _context: { internalSet: true, writeback: true },
        changed: true
      });
    },

    // ojselect
    _setup: function () {
      // fixup valueOption(s) if placeholder is selected
      if (_ComboUtils.isValueForPlaceholder(this.multiple, this.options.value)) {
        if (this.multiple) {
          this.options.valueOptions = _ComboUtils.getValueOptionsForPlaceholder(
            this,
            this.options.valueOptions
          );
        } else {
          this.options.valueOption = _ComboUtils.getValueOptionsForPlaceholder(
            this,
            this.options.valueOption
          );
        }
      }
      // JET-43071 - messagescustom property doesn't work when initial render
      // During the initial setup, there will not be any component messages,
      // but there can be custom messages. So, we need to make sure that we
      // do not clear them off when we sync value and valueOptions
      const options = { doNotClearMessages: true };
      //  - need to be able to specify the initial value of select components bound to dprv
      this._resolveValueOptionsLater = _ComboUtils.mergeValueAndValueOptions(this, options);
      if (this._isNative()) {
        this._nativeSetup();
      } else {
        this._jetSetup();
      }
      this._refreshRequired(this.options.required);
    },

    /**
     * Returns if the element is a text field element or not.
     * @memberof oj.ojSelect
     * @instance
     * @protected
     * @return {boolean}
     */
    _IsTextFieldComponent: function () {
      return true;
    },

    /**
     * Returns the components wrapper under which label needs to be inserted in the inside strategy
     * @instance
     * @protected
     * @ignore
     * @return {Element|undefined}
     */
    _GetContentWrapper: function () {
      if (this._IsCustomElement()) {
        return this.select._GetContentWrapper();
      }
      return undefined;
    },

    /**
     * Refreshes the visual state of the select. JET elements require a <code
     * class="prettyprint">refresh()</code> after the DOM is programmatically
     * changed.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj.ojSelect
     * @instance
     * @return {void}
     * @ojshortdesc Refreshes the visual state of the select.
     * @public
     */
    refresh: function () {
      this._super();

      // cleanup the old HTML and setup the new HTML markups
      this._cleanup();
      this._releaseSelectResources();

      this._setup();
      this._setupSelectResources();
      // TODO: apply value in options for the selected value

      if (this._isNative() && this.options.value) {
        this.element.val(this.options.value);
      }

      // re apply root attributes settings
      this._SetRootAttributes();

      this._initComponentMessaging();
    },
    /**
     * @memberof! oj.ojSelect
     * @instance
     * @private
     */
    _refreshRequired: ojeditablevalue.EditableValueUtils._refreshRequired,

    /**
     * Called to find out if aria-required is unsupported.
     * @memberof! oj.ojSelect
     * @instance
     * @protected
     */
    _AriaRequiredUnsupported: function () {
      return false;
    },
    /**
     * @override
     * @private
     * @memberof! oj.ojSelect
     */
    _destroy: function () {
      // native renderMode
      this._cleanup();
      this._super();
    },

    /**
     * Setup resources for the select
     *
     * @memberof! oj.ojSelect
     * @instance
     * @private
     */
    _setupSelectResources: function () {
      // Check if the dataprovider is already wrapped
      if (!_ComboUtils.isDataProviderWrapped(this)) {
        _ComboUtils.wrapDataProviderIfNeeded(this, this.select ? this.select.opts : null);
      }
      _ComboUtils.addDataProviderEventListeners(this);
    },

    /**
     * releases resources of the select
     *
     * @memberof! oj.ojSelect
     * @instance
     * @private
     */
    _releaseSelectResources: function () {
      _ComboUtils.removeDataProviderEventListeners(this);
      _ComboUtils.clearDataProviderWrapper(this);
    },

    /**
     * Override to setup select resources
     * @memberof! oj.ojSelect
     * @instance
     * @protected
     * @override
     */
    _SetupResources: function () {
      this._super();
      this._setupSelectResources();
    },

    /**
     * Override to release select resources
     * @memberof! oj.ojSelect
     * @instance
     * @protected
     * @override
     */
    _ReleaseResources: function () {
      this._super();
      this._releaseSelectResources();
    },

    // 19670760, dropdown popup should be closed on subtreeDetached notification.
    _NotifyDetached: function () {
      this._superApply(arguments);
      // native renderMode
      if (this.select) {
        this.select.close();
      }
    },

    // 19670760, dropdown popup should be closed on subtreeHidden notification.
    _NotifyHidden: function () {
      this._superApply(arguments);
      // native renderMode
      if (this.select) {
        this.select.close();
      }
    },

    /**
     * Override to do the delay connect/disconnect
     * @memberof oj.ojSelect
     * @override
     * @protected
     */
    _VerifyConnectedForSetup: function () {
      //  - temp moving oj-select from one elem to another should not cause fetch
      return true;
    },

    /**
     * Set the placeholder.
     * @override
     * @protected
     * @memberof! oj.ojSelect
     */
    _SetPlaceholder: function (value) {
      // native renderMode
      // add a placeholder option if needed
      if (this._isNative() && value != null) {
        var placeholder = $(this.element.children('option:first-child'));

        // if a placeholder option exists, use it
        if (placeholder && placeholder.attr('value') === '') {
          placeholder.text(this.options.placeholder);
          placeholder.attr('value', '');
        } else {
          placeholder = _ComboUtils.createOptionTag(0, '', value, this._formatValue.bind(this));
          placeholder.addClass('oj-listbox-placeholder');

          //  - placeholder text is a selectable item that results in an error for ojcomponent
          this._hidePlaceholder(placeholder, this._IsRequired());
          placeholder.prependTo(this.element); // @HTMLUpdateOK
        }
      } else if (this.select) {
        // if using quiet forms, override the display text with an empty string when null.
        // a null value is passed when the component doesn't have focus so that the placeholder
        // and floating label will not occupy the same space.
        var tmpValue = value;
        var currentPlaceholder = this.options.placeholder;
        var multiple = this.multiple;
        if (this.options.labelEdge === 'inside') {
          // if there is no placeholder specified, we should not set the
          // placeholder to an empty string for select-one as select-one
          // considers empty string to be a case where the placeholder is
          // set. select-one relies on this information to decide whether to
          // set the first option by default.
          tmpValue = !value && (multiple || currentPlaceholder != null) ? '' : value;
        }
        this.select.opts.placeholder = tmpValue;
        this.select._setPlaceholder();
      }
    },

    /**
     * whether the placeholder option is set
     *
     * @memberof! oj.ojSelect
     * @instance
     * @protected
     */
    _HasPlaceholderSet: function () {
      //  - an empty placeholder shows up if data changed after first binding
      return _ComboUtils.isPlaceholderSpecified(this.options);
    },

    /**
     * Clear the placeholder option
     *
     * @memberof! oj.ojSelect
     * @instance
     * @protected
     */
    _ClearPlaceholder: function () {
      //  - an empty placeholder shows up if data changed after first binding
      this._SetPlaceholderOption(null);
      this._SetPlaceholder(null);
    },

    /**
     * @memberof! oj.ojSelect
     * @instance
     * @protected
     * @override
     */
    _InitOptions: function (originalDefaults, constructorOptions) {
      var props = [
        { attribute: 'disabled', validateOption: true },
        { attribute: 'placeholder' },
        { attribute: 'required', coerceDomValue: true, validateOption: true },
        { attribute: 'title' }
        // {attribute: "value"}
      ];

      this._super(originalDefaults, constructorOptions);
      ojeditablevalue.EditableValueUtils.initializeOptionsFromDom(props, constructorOptions, this);

      this.multiple = !this._IsCustomElement()
        ? this.options.multiple
        : this.OuterWrapper.nodeName === 'OJ-SELECT-MANY';

      // TODO: PAVI - Let's discuss
      if (this.options.value === undefined) {
        if (!this._IsCustomElement()) {
          this.options.value =
            this.element.attr('value') !== undefined
              ? _ComboUtils.splitVal(this.element.val(), ',')
              : null;
        } else {
          // sanitize the value for custom element
          this.options.value = null;
        }
      } else {
        // clone the value, otherwise _setDisplayValue will not be invoked on binding value to ko observableArray.
        // TODO: Need to revisit this once 18724975 is fixed.
        var value = this.options.value;
        if (Array.isArray(value)) {
          if (!this._IsCustomElement()) {
            value = value.slice(0);
          }
        }

        this.options.value = value;
      }
    },

    /**
     * Updates display value.
     * @override
     * @protected
     * @memberof! oj.ojSelect
     */
    _SetDisplayValue: function (displayValue) {
      if (this.select) {
        //  - need to be able to specify the initial value of select components bound to dprv
        if (!_ComboUtils.applyValueOptions(this.select, this.options)) {
          this.select._initSelection();
        }
        this._resolveValueOptionsLater = false;
      } else {
        // if the display value is the value for placeholder, let it default to 1st option or placeholder
        // see demo pages: disable and placeholder
        var opts;
        if (this._setPlaceholderStyle(displayValue)) {
          this.element[0].selectedIndex = 0;
        }

        if (displayValue == null) {
          // update valueOptions
          if (this._resolveValueOptionsLater) {
            //  - reseting value when value-option and placeholder are set
            // throws exception
            _ComboUtils.setValueOptions(
              this,
              _ComboUtils.getFixupValueOptionsForPlaceholder(this.multiple)
            );
          }
        } else {
          //  - oj-select-one throws exception for mobile when selectedindex = -1 on refresh
          var valSet = false;
          var selectedVal = displayValue;
          var label;
          if (!this.multiple) {
            if (Array.isArray(displayValue)) {
              selectedVal = displayValue[0];
            }
            label = this._nativeFindLabel(selectedVal);
            if (label === null) {
              Logger.warn('JET select: selected value not found');
              // default to 1st option if exists
              if (this.element[0].options && this.element[0].options.length > 0) {
                this.element[0].selectedIndex = 0;
                selectedVal = this.element[0].value;
                label = this.element[0].text;
                valSet = true;
              } else {
                label = String(displayValue);
              }
            }
          }
          if (!valSet) {
            this.element.val(displayValue);
          }
          // eslint-disable-next-line no-param-reassign
          displayValue = selectedVal;

          // update valueOptions
          if (this._resolveValueOptionsLater) {
            if (this.multiple) {
              // collect the selected values and labels
              var s = 0;
              opts = [];
              this.element.find('option').each(function () {
                if (this.selected) {
                  opts.push({ value: displayValue[s], label: this.text });
                  s += 1;
                }
              });
            } else {
              opts = { value: displayValue, label: label };
            }
            _ComboUtils.setValueOptions(this, opts);
          }
        }
        this._resolveValueOptionsLater = false;
      }
    },

    /**
     * Returns the display value.
     * @override
     * @protected
     * @memberof! oj.ojSelect
     * @return {Array|Object|null} display value of the component
     */
    _GetDisplayValue: function () {
      var displayValue = null;
      if (this.select) {
        var data = this.select._getSelectionData();
        if (data != null) {
          if (this.multiple) {
            displayValue = [];
            if (Array.isArray(data)) {
              for (var i = 0; i < data.length; i++) {
                displayValue.push(_ComboUtils.getLabel(data[i]));
              }
            } else {
              displayValue.push(_ComboUtils.getLabel(data));
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (Array.isArray(data) && data.length > 0) {
              displayValue = _ComboUtils.getLabel(data[0]);
            } else {
              displayValue = _ComboUtils.getLabel(data);
            }
          }
        } else {
          // get the display value from editable value if the selection data is unavailable
          displayValue = this._super();
        }
      } else {
        // native renderMode
        displayValue = this._super();
      }
      return displayValue;
    },

    /**
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app. </li>
     * <li>The implicit required validator is run first if the component
     * is marked required. </li>
     * <li>At the end of validation if there are errors, the messages are shown.
     * If there were no errors, then the
     * <code class="prettyprint">value</code> option is updated.</li>
     * </ol>
     *
     * @example <caption>Validate component using its current value.</caption>
     * myComp.validate();
     *
     * @example <caption>Validate component and use the Promise's resolved state.</caption>
     * myComp.validate().then(
     *  function(result) {
     *    if(result === "valid")
     *    {
     *      submitForm();
     *    }
     *  });
     * @return {Promise} Promise resolves to "valid" if the component passed validation.
     * The Promise resolves to "invalid" if there were validation errors.
     * @ojshortdesc Validates the component's display value using all validators registered on the component. If there are no validation errors, then the value is updated. See the Help documentation for more information.
     * @method
     * @access public
     * @expose
     * @instance
     * @memberof oj.ojSelect
     *
     */
    validate: function () {
      var returnValue;
      var newValue = null;

      if (this.select) {
        if (this.multiple === true) {
          var displayValue = this.select.search.val();
          var existingValue = this.select.getVal() ? this.select.getVal() : [];

          if (displayValue === undefined || displayValue === null || displayValue === '') {
            newValue = existingValue;
          } else {
            existingValue.push(displayValue);
            newValue = existingValue;
          }
        } else {
          //  - select needs implementation fixes...
          newValue = this.select.getVal();
        }
      } else if (this._isNative()) {
        //  - native select
        newValue = this.options.value;
      }

      // _SetValue returns boolean when there is no async validator or
      // converter, else it returns a Promise. Since ojselect has no validator or
      // converter, this will always return true or false. validate needs to
      // return a Promise if customElement.
      returnValue = this._SetValue(newValue, null, this._VALIDATE_METHOD_OPTIONS);

      if (returnValue === false && !this._CanSetValue()) {
        // FIX JET-45885, validate() returns 'invalid' for readonly or disabled on valid value.
        // In _SetValue/_AsyncValidate, validation is skipped when !this._CanSetValue(), and _SetValue returns false.
        // We want validate() to return 'valid' when validation is skipped.
        returnValue = true;
      }

      // for widget components, validate() returns boolean. Else it returns a Promise
      // that resolves to 'valid' or 'invalid'
      if (this._IsCustomElement()) {
        returnValue = Promise.resolve(returnValue ? 'valid' : 'invalid');
      }
      return returnValue;
    },

    /**
     * Whether a value can be set on the component. For example, if the component is
     * disabled or readOnly then setting value on component is a no-op.
     *
     * @see #_SetValue
     * @return {boolean}
     * @memberof oj.ojSelect
     * @override
     * @instance
     * @protected
     */
    _CanSetValue: function () {
      // FIX  - VALUE UNCHANGED IN DISABLED SELECT WHEN CHANGING BOUND VALUEOPTION
      // _SetValue always performs validation, which calls _CanSetValue, which returns false if
      // the component is disabled, thereby disallowing the set.  Override _CanSetValue here
      // so that we can force it to return true when syncing the value with the valueOption[s]
      // from _ComboUtils.syncValueWithValueOption[s].
      if (this.forceCanSetValue) {
        return true;
      }
      return this._super();
    },

    // return 1st enabled option jquery object
    _nativeFindFirstEnabledOption: function () {
      // find all the enabled options under the element
      var enaOptions = this.element.find('option:not(:disabled)');
      // return the first enabled option
      return enaOptions.length > 0 ? $(enaOptions[0]) : null;
    },

    // native renderMode
    _nativeFindFirstEnabledOptionValue: function (enaOption) {
      if (!enaOption) {
        // eslint-disable-next-line no-param-reassign
        enaOption = this._nativeFindFirstEnabledOption();
      }
      if (enaOption) {
        if (this._IsCustomElement()) {
          // send the value as it is for custom element
          //  - oj-select-one writes initial value as array in native rendering mode
          return enaOption.attr('value');
        }
        // send the value in an array for widget
        return [enaOption.attr('value')];
      }

      return null;
    },

    _nativeSetOptions: function (options) {
      var oSelected = this.options.value;
      var element = this.element;

      // if options list is generated during setup, remove it
      if (element.hasClass(_ComboUtils.GENERATED_OPTIONS_SELECTOR)) {
        _ComboUtils.cleanupResults(element);
      } else {
        var children = element.children();
        if (children.length > 0) {
          children.remove();
        }
      }

      // if data provider, fetch data
      if (_ComboUtils.isDataProvider(options)) {
        this._nativeFetchFromDataProvider();
      } else {
        _ComboUtils.arrayPopulateResults(
          element,
          options,
          this._formatValue.bind(this),
          this.options.optionsKeys
        );
        var defVal = null;
        if (this._HasPlaceholderSet()) {
          if (this.options.required) {
            defVal = this._nativeFindFirstEnabledOptionValue();
          }

          this._SetPlaceholder();
        }

        // default to the first enabled option
        if (defVal === null) {
          defVal = this._nativeFindFirstEnabledOptionValue();
        }

        this.options.value = defVal;
        this.option('value', oSelected);
      }
      element.addClass(_ComboUtils.GENERATED_OPTIONS_SELECTOR);
    },

    _removePlaceholderInMultiValues: function (valArr) {
      var val;
      var narr = [];

      for (var i = 0; i < valArr.length; i++) {
        val = valArr[i];
        if (val != null) {
          if (val.length > 0) {
            // remove placeholder if it was already added to arr
            if (narr.length === 1 && narr[0] === '') {
              narr.pop();
            }
            narr.push(val);
          } else if (narr.length === 0) {
            // val is a placeholder
            narr.push(val);
          }
        }
      }
      return narr;
    },

    //  - oj-select-one throws exception for mobile when selectedindex = -1 on refresh
    // return label if found otherwise null
    _nativeFindLabel: function (value) {
      var options = this.element[0].options;
      if (options && options.length > 0) {
        for (var i = 0; i < options.length; i++) {
          if (options[i].value === value) {
            return $(options[i]).text();
          }
        }
      }
      return null;
    },

    // set oj-select-default on the select tag if the selected value is a placeholder and a singleton
    _setPlaceholderStyle: function (value) {
      var multi = this.multiple;
      // set default style for placeholder
      // if the value is null or empty string and has the placeholder set or
      // for non-custom element, if the value specified is an 1 item array of empty string
      // for custom element, if the value specified is the value for placeholder
      if (
        ((value == null || value === '') && this._HasPlaceholderSet()) ||
        (!this._IsCustomElement() && Array.isArray(value) && value.length === 1 && value[0] === '') ||
        (this._IsCustomElement() &&
          this._HasPlaceholderSet() &&
          _ComboUtils.isValueForPlaceholder(multi, value))
      ) {
        this.element.addClass('oj-select-default');
        return true;
      }
      this.element.removeClass('oj-select-default');
      return false;
    },

    /**
     * Sets multiple options
     *
     * @param {Object} options the options object
     * @param {Object} flags additional flags for option
     *
     * @override
     * @protected
     * @memberof! oj.ojSelect
     */
    _setOptions: function (options, flags) {
      var processSetOptions;
      var setValuePromise;
      var validateValuePromise;

      // _setOptions is invoked to set multiple options and for some options, we need
      // to enforce an order. So we will using a temporary object which is used for
      // storing function refs which will then be executed in an order that we want to
      // enforce. Some of the options can call _setOptions recursively to set different
      // options. For eg., setting 'labelEdge' to 'none', will in turn calls _setOptions
      // recursviely setting 'labelledBy'. So we need to maintain a stack of object to
      // keep track of the call stack.
      if (!this._processSetOptions) {
        this._processSetOptions = [];
      }
      this._processSetOptions.push({});

      this._super(options, flags);

      // Get the top most object from the stack, which represents the current call
      processSetOptions = this._processSetOptions.pop();

      // JET-24012 - select should validate value against options asynchronously
      // When options and value are updated at the same time, we should be enforcing a
      // sane order so as to validate the new value against the new options.
      // This means the value should set validated and set only after the options are
      // updated.
      //
      // Note: This will only be done when the framework notifies the component that
      // both the options and value are being updated at the same time. In other places
      // where the change happens separately the component is not responsible for enforcing
      // the order as we cannot predict the future.
      // The case covered here will be when options attribute is bound to an observableArray,
      // in case of using dataprovider the changes will not be notified through the setOptions
      // method, so the component will not go out of its way to enforce the order.
      if (processSetOptions.value) {
        // this will be a promise that resolves after the value is updated
        setValuePromise = processSetOptions.value();
      }

      if (processSetOptions.validateValue) {
        var validateValue = function () {
          var returnPromise;
          var originalResolveValueOptionFlag = this._resolveValueOptionsLater;
          // if the current valueOption(s) is set by us internally,
          // then we may want to resolve the valueOption against the new options
          if (this.isValueOptionsSetInternally) {
            this._resolveValueOptionsLater = true;
          }

          // validate value
          returnPromise = processSetOptions.validateValue();
          this._resolveValueOptionsLater = originalResolveValueOptionFlag;
          return returnPromise;
        }.bind(this);

        // If the value is being set, the value may still not be processed, since
        // with data provider, the process would be asynchronous. So we need to wait
        // for it to complete before we go ahead with the validation part of the process.
        // If value is being set, we need to defer till it resolves.
        if (setValuePromise instanceof Promise) {
          validateValuePromise = setValuePromise.then(validateValue);
        } else {
          validateValuePromise = validateValue();
        }
      }

      // JET-43071 - messagescustom property doesn't work when initial render
      // After the value and valueOptions are updated, set the messages custom
      if (processSetOptions.messagesCustom) {
        // If we are already in the middle of updating value or
        // validating value which in turn might set value again
        // wait for latest promise to resolve.
        // If we are not waiting on any value updates, then synchronously
        // set the messagesCustom
        const latestPromise = validateValuePromise || setValuePromise;
        if (latestPromise instanceof Promise) {
          latestPromise.then(processSetOptions.messagesCustom);
        } else {
          processSetOptions.messagesCustom();
        }
      }
    },

    /**
     * Handles options specific to select.
     * @override
     * @protected
     * @memberof! oj.ojSelect
     */
    _setOption: function (key, _value, flags) {
      var value = _value;
      var selected;
      var hasSelectedValue;
      var self = this;
      var selfSuper = this._super;
      var multi = this.multiple;
      var bRefresh = false;
      var processSetOptions = (this._processSetOptions || []).slice(-1)[0];

      if (key === 'value') {
        var processSetOptionValue = function () {
          // Clear existing valueUpdatePromise
          this._valueUpdatePromise = null;
          // Wrapped super method to be passed as an argument for helper methods
          var setValueFn = function (valueToSet) {
            selfSuper.call(this, key, valueToSet, flags);
          }.bind(this);

          // Check if the new value is a placeholder and if it is, set the value and return
          if (this._setPlaceholderForValue(value, setValueFn)) {
            // No need to update valueUpdatePromise as the value update happens synchronously here
            return Promise.resolve();
          }

          // Clean up the new value based on how the select component is configured
          value = this._treatValueForSetValue(value);

          // Validate against the dataprovider if one is used, and set the value
          // if it is valid.
          if (_ComboUtils.getDataProvider(this.options) && value) {
            // we need to know whether the value is set or not, so we need to return a promise
            var resolvePromise;
            var returnPromise = new Promise(function (resolve) {
              resolvePromise = resolve;
            });
            var setValueIfValid = function (results) {
              //  - need to be able to specify the initial value of select components bound to dprv
              if (results) {
                var valueOptions = results.valueOptions;
                if (Array.isArray(valueOptions) && valueOptions.length) {
                  _ComboUtils.setValueOptions(this, valueOptions);
                }
                // only set value if it is valid
                var values = results.value;
                if (Array.isArray(values) && values.length) {
                  var cval = multi ? values : values[0];
                  setValueFn(cval);

                  //  - select component binding broken in mobile
                  if (this._isNative()) {
                    // need update the selected value property
                    this.element[0].value = cval;
                  }
                }
              }
              resolvePromise();
            }.bind(this);
            this._validateFromDataProviderAndSetValue(value, setValueIfValid);
            // Store the promise
            this._valueUpdatePromise = returnPromise;
            //  - ojselect allows to set invalid value when using dataprovider
            // return as the value has been processed by _validateFromDataProviderAndSetValue
            return returnPromise;
          }

          // If a data provider is not used, use the options to validate and set the value
          this._validateFromOptionsAndSetValue(value, setValueFn);
          // No need to update valueUpdatePromise as the value update happens synchronously here
          return Promise.resolve();
        }.bind(this);

        // If this is called from setOptions, we need to wait till all the other options
        // are processed before processing value. If called from the setOptions method,
        // the _processSetOptions object will be available, so store the process fn's ref and do
        // nothing here. The process fn will be called in setOptions after all the options are
        // set.
        if (processSetOptions != null) {
          processSetOptions.value = processSetOptionValue;
        } else {
          processSetOptionValue();
        }
        return;
      } else if (key === 'placeholder') {
        if (this.select) {
          this.select.opts.placeholder = value;
          if (_ComboUtils.isValueForPlaceholder(multi, this.options.value)) {
            this.select._setPlaceholder();
          }
        } else {
          // native renderMode
          selected = this.options.value;
          if (!selected || selected.length === 0 || !selected[0]) {
            this.element[0].selectedIndex = 0;
          }
        }
      } else if (key === 'maximumResultCount') {
        if (this.select) {
          this.select.opts.maximumResultCount = value;
        } else {
          // native renderMode
          bRefresh = true;
        }
      } else if (key === 'minimumResultsForSearch') {
        // native renderMode
        if (this.select) {
          this.select.opts.minimumResultsForSearch = value;
        }
      } else if (key === 'renderMode') {
        this._cleanup();
        bRefresh = true;
      } else if (key === 'messagesCustom') {
        if (processSetOptions != null) {
          // JET-43071 - messagescustom property doesn't work when initial render
          // We need to set the messagesCustom after value and valueOptions are set
          // as they would reset the messages
          // So store the function to be called in the process queue and return without
          // doing anything else. The queue item will be executed in the _setOptions
          // call.
          // For messagesCustom option calling the super method alone is sufficient
          processSetOptions.messagesCustom = selfSuper.bind(this, key, value, flags);
          return;
        }
      }

      // if we have a new data provider, remove the old dataProvider event listeners
      if (key === 'options') {
        _ComboUtils.removeDataProviderEventListeners(this);
        _ComboUtils.clearDataProviderWrapper(this);
      } else if (key === 'optionsKeys') {
        _ComboUtils.clearDataProviderWrapper(this);
      } else if (key === 'valueOption' && multi !== true) {
        // fixup valueOption
        value = _ComboUtils.getValueOptionsForPlaceholder(this, value);
        if (this.select) {
          this.select.opts.valueOption = value;
        }
        // Set the flag to indicate the value option is set externally by the application
        this.isValueOptionsSetInternally = false;
      } else if (key === 'valueOptions' && multi === true) {
        // fixup valueOptions
        value = _ComboUtils.getValueOptionsForPlaceholder(this, value);
        if (this.select) {
          this.select.opts.valueOptions = value;
        }
        // Set the flag to indicate the value option is set externally by the application
        this.isValueOptionsSetInternally = false;
      }
      this._super(key, value, flags);
      if (bRefresh) {
        this.refresh();
      }

      if (key === 'disabled') {
        if (this.select) {
          if (value) {
            this.select._disable();
          } else {
            this.select._enable();
          }
        } else {
          this._nativeSetDisabled(value);
        }
        // Readonly support
      } else if (key === 'readOnly') {
        if (this.select) {
          this.select.applyReadonlyState();
        }
        if (this.options.renderMode === 'native') {
          this.refresh();
        }
      } else if (key === 'valueOption' && multi !== true) {
        //  - need to be able to specify the initial value of select components bound to dprv
        _ComboUtils.syncValueWithValueOption(this, value, this.options.value, this._isNative());
      } else if (key === 'valueOptions' && multi === true) {
        _ComboUtils.syncValueWithValueOptions(this, value, this.options.value, this._isNative());
      } else if (key === 'options') {
        // if options is a new data provider
        // wrap it with LVDP if it doesn't implement FetchByKeys
        // add event listeners
        if (_ComboUtils.isDataProvider(value)) {
          // update internal dataProviderWrapper
          _ComboUtils.wrapDataProviderIfNeeded(this, this.select ? this.select.opts : null);
          _ComboUtils.addDataProviderEventListeners(this);
        }
        if (this.select) {
          // make sure the value still valid
          selected = this.select.getVal();

          // selected value can be an Array|null for select-many, any|null for select-one and an array for select-one widget.
          // select-many has selected values, if selected is a non-empty Array.
          // select-one has a selected value, if selected is not null.
          // select-one widget has a selected value, if selected array has a single non-null value.
          if (multi) {
            hasSelectedValue = selected && selected.length !== 0;
          } else {
            hasSelectedValue = this._IsCustomElement()
              ? selected != null
              : selected && selected[0] != null;
          }
          if (_ComboUtils.getDataProvider(this.options) && hasSelectedValue) {
            // This method needs to return a Promise that resolves after
            // all the inner async operations are completed.
            var validateValueAgainstNewOptions = function () {
              //  - need to be able to specify the initial value of select components bound to dprv
              if (_ComboUtils.applyValueOptions(this.select, this.options)) {
                this.select.opts.options = value;
                this.select.opts = self.select._prepareOpts(this.select.opts);
                return Promise.resolve();
              }

              let resolver;
              const returnPromise = new Promise(function (resolve) {
                resolver = resolve;
              });
              var element = this.select.container;
              var options = this.options;
              var currentValue = this.options.value;
              _ComboUtils
                .validateFromDataProvider(element, options, currentValue)
                .then(function (results) {
                  //  - need to be able to specify the initial value of select components bound to dprv
                  var values = results ? results.value : null;
                  var resolverPromise = Promise.resolve();
                  if (values) {
                    var valueOptions = results.valueOptions;
                    if (Array.isArray(valueOptions) && valueOptions.length) {
                      _ComboUtils.setValueOptions(self, valueOptions);
                    }
                    // only set value if it is valid
                    if (Array.isArray(values) && values.length) {
                      selfSuper.call(self, 'value', multi ? values : values[0]);
                    }
                  } else {
                    var hasPlaceholderSet = self.options.placeholder != null;
                    var clearValue = function () {
                      self.select.setValOpts(null);
                      selfSuper.call(self, 'value', null);
                      if (!multi && !hasPlaceholderSet) {
                        // update select box
                        self.select.text.text('');
                      }
                    };
                    if (!multi && !hasPlaceholderSet) {
                      // An async operation is being done, so replace the default
                      // resolver Promise with this one.
                      // there is no placeholder set and the selected value is no longer valid,
                      // fetch 1st item from data provider for single select
                      resolverPromise = _ComboUtils
                        .fetchFirstBlockFromDataProvider(self.select.container, self.options, 1)
                        .then(function (data) {
                          // Since the fetch happens asynchronously, the value may have been updated
                          // after the fetch has been initiated. We need to make sure that we do not
                          // alter the new value.
                          var isValueUpdated = currentValue !== self.select.getVal();
                          // At this point if we still don't have a selected value then default to the first item
                          if (data && data.length > 0 && !isValueUpdated) {
                            self.select._updateSelectedOption(data[0]);
                          } else if (!isValueUpdated) {
                            // Clear the value only if the value is not updated.
                            clearValue();
                          }
                        });
                    } else {
                      // Set the default value for multi select
                      clearValue();
                    }
                  }
                  self.select.opts.options = value;
                  self.select.opts = self.select._prepareOpts(self.select.opts);

                  // resolve the returnPromise once the inner resolverPromise is complete
                  resolverPromise.then(resolver);
                });
              return returnPromise;
            }.bind(this);
            // If this is called from setOptions, we need to wait till all the other options
            // are processed before validating the value. If called from the setOptions method,
            // the _processSetOptions object will be available, so store the validation fn's ref and do
            // nothing here. The process fn will be called in setOptions after all the options are
            // set.
            if (processSetOptions != null) {
              processSetOptions.validateValue = validateValueAgainstNewOptions;
            } else {
              validateValueAgainstNewOptions();
            }
          } else {
            //  - an empty placeholder shows up if data changed after first binding
            //  - ojselect - validator error message is not shown
            //  - ojselect tooltip no longer appears once options and value observables change
            this.select.opts.options = value;
            this.select.opts = this.select._prepareOpts(this.select.opts);

            if (!multi || hasSelectedValue) {
              // make sure the value still valid
              this.select.setValOpts(null);
              this._super('value', selected);
            }
          }
        } else {
          this._nativeSetOptions(value);
        }
      } else if (key === 'optionsKeys') {
        _ComboUtils.wrapDataProviderIfNeeded(this, this.select ? this.select.opts : null);
      } else if (key === 'required' && this._isNative()) {
        var placeholder = $(this.element.find('.oj-listbox-placeholder'));
        if (placeholder && placeholder.attr('value') === '') {
          // hide placeholder when required is true
          this._hidePlaceholder(placeholder, value);
        }
      } else if (key === 'multiple' && !this._IsCustomElement()) {
        this.multiple = value;
      } else if (key === 'labelledBy') {
        this._labelledByUpdatedForSelectComp();
      }
    },

    _isOptionDataPending: function () {
      var options = this.options.options;
      var datalist = this.select.datalist;

      if (datalist) {
        // check if the data provided via html
        if (datalist.children().length === 0) {
          return true;
        }
      } else if (_ComboUtils.isDataProvider(options)) {
        //  - replacing options in select after value is set -> writes over the value
        // skip validation if a value is specified when the data is empty, don't fetch data until user opens dropdown.
        // We validate value and set displayValue when the drop down data is available
        return true;
      } else if (!options || options.length === 0) {
        // check the options array
        return true;
      }
      return false;
    },

    /**
     * Checks if the value is present in the dataprovider and sets the value if it is
     * present.
     *
     * @param {V} value The value that is currently being set
     * @param {Function} setValueFn ref to the function to be called to set the value
     *
     * @instance
     * @private
     * @ignore
     * @memberof! oj.ojSelect
     */
    _validateFromDataProviderAndSetValue: function (value, setValueFn) {
      var element = this._isNative() ? this.element : this.select.container;
      var options = this.options;

      // update instance variables for jet render mode
      if (this.select) {
        this.select.opts.options = options.options;
      }

      _ComboUtils.validateFromDataProvider(element, options, value).then(setValueFn);
    },

    /**
     * Checks if the value is present in the options and sets the value if it is
     * present.
     *
     * @param {V} value The value that is currently being set
     * @param {Function} setValueFn ref to the function to be called to set the value
     *
     * @instance
     * @private
     * @ignore
     * @memberof! oj.ojSelect
     */
    _validateFromOptionsAndSetValue: function (value, setValueFn) {
      var multi = this.multiple;
      var customSelectOne = this._IsCustomElement() && !multi;
      if (!customSelectOne) {
        //  - ojselect should ignore the invalid value set programmatically
        var newArr = [];
        for (var i = 0; i < value.length; i++) {
          if (this.select) {
            // Note: both multi select and remote data cases, the validate function is not available
            if (this._isValidValue(value[i])) {
              newArr.push(value[i]);
            }
          } else if (this.element.find("option[value='" + value[i] + "']").length > 0) {
            newArr.push(value[i]);
          }
        }

        // only set values that are valid
        //  - can't remove last selected value in multi-select ojselect
        // multi select allows empty array
        if (newArr.length > 0 || multi) {
          if (this._isNative()) {
            this._nativeSetSelected(newArr);
          } else {
            setValueFn(newArr);
            //  - need to be able to specify the initial value of select components bound to dprv
            _ComboUtils.updateValueOptions(this.select);
          }
        }
        return;
      }

      if (this._isValidValue(value)) {
        setValueFn(value);
        //  - need to be able to specify the initial value of select components bound to dprv
        _ComboUtils.updateValueOptions(this.select);
      }
    },

    /**
     * Takes in a value and checks if it is a valid value. This does not take options
     * into consideration. This method uses validate method to check if the value is valid
     * if one is provided.
     *
     * @param {V} value The value that has to be checked
     * @return {boolean} Result of the validation.
     *
     * @instance
     * @private
     * @ignore
     * @memberof! oj.ojSelect
     */
    _isValidValue: function (value) {
      var element;
      if (this.select) {
        element = this.select.datalist;
        if (!element) {
          element = this.select.opts.element;
        }
      }
      return (
        !(this.select && this.select.opts.validate) ||
        this.select.opts.validate(element, value) ||
        this._isOptionDataPending()
      );
    },

    /**
     * Takes in the value provided and updates it based on the configurations
     * of the select component
     *
     * @param {V} value The value that has to be treated
     * @return {V} The updated value
     *
     * @instance
     * @private
     * @ignore
     * @memberof! oj.ojSelect
     */
    _treatValueForSetValue: function (value) {
      var multi = this.multiple;
      var customSelectOne = this._IsCustomElement() && !multi;
      var _value = value;

      // turn value to an array for widget select-one
      if (!Array.isArray(_value) && !customSelectOne) {
        _value = [_value];
      }

      // remove placeholder values for native select
      if (this._isNative()) {
        if (!customSelectOne) {
          _value = this._removePlaceholderInMultiValues(_value);
        }
        this._setPlaceholderStyle(_value);
      }

      return _value;
    },

    /**
     * Checks if the value to be set is a placeholder and if it is, sets the value
     * to a placeholder. Does nothing and returns false otherwise
     *
     * @param {V} value The value that is currently being set
     * @param {Function} setValueFn ref to the function to be called to set the value
     * @return {boolean} true if the value is set, false otherwise
     *
     * @instance
     * @private
     * @ignore
     * @memberof! oj.ojSelect
     */
    _setPlaceholderForValue: function (value, setValueFn) {
      var multi = this.multiple;
      // An empty value is considered a valid only when the folling conditions are met:
      // 1. If it is select-one, this there should be a placeholder specified. For select-many
      //    it is not needed.
      // 2. For a widget, it should be an empty array; while for custom element it should be
      //    value that represents a placeholder (null or '' for select-one and [] for select-many)
      if (
        (this._HasPlaceholderSet() || multi) &&
        ((value != null && value.length === 0) ||
          (this._IsCustomElement() && _ComboUtils.isValueForPlaceholder(multi, value)))
      ) {
        //  - placeholder is not displayed after removing selections from select many
        // Update the valueOptions (this method is updates valueOption/valueOptions accordingly)
        _ComboUtils.setValueOptions(this, _ComboUtils.getFixupValueOptionsForPlaceholder(multi));
        setValueFn(value);
        return true;
      }

      return false;
    },

    /**
     * Fetches the Promise for the value property update
     *
     * @return {Promise<void>} Promise for the value property update
     *
     * @instance
     * @private
     * @ignore
     * @memberof! oj.ojSelect
     */
    _getValueUpdatePromise: function () {
      if (this._valueUpdatePromise instanceof Promise) {
        return this._valueUpdatePromise;
      }
      return Promise.resolve();
    },

    _getDropdown: function () {
      // native renderMode
      if (this.select && this.select._opened()) {
        //  - certain subids does not work inside a popup or dialog
        var dropdown = this.select.dropdown;
        if (dropdown && dropdown.attr('data-oj-containerid') === this.select.containerId) {
          return dropdown;
        }
      }
      return null;
    },

    _hidePlaceholder: function (placeholder, hide) {
      if (hide) {
        placeholder.attr('disabled', '');
        placeholder.attr('hidden', '');
      } else {
        placeholder.removeAttr('disabled');
        placeholder.removeAttr('hidden');
      }
    },

    // native renderMode
    _isNative: function () {
      // Readonly support
      return this.options.renderMode === 'native' && !_ComboUtils.isReadonly(this);
    },

    // native renderMode
    _cleanup: function () {
      // Readonly support
      if (this.element.parent().parent().hasClass('oj-select-native')) {
        // remove the change listner
        this.element.off('change');

        // if options list is generated during setup, remove it
        if (this.element.hasClass(_ComboUtils.GENERATED_OPTIONS_SELECTOR)) {
          _ComboUtils.cleanupResults(this.element);
        }

        // remove wrapper
        if (this.element.parent().hasClass('oj-text-field-container')) {
          this.element.unwrap();
        }
        this.element.parent().children('.oj-select-arrow').remove();

        if (!this._IsCustomElement()) {
          // Widgets will have extra wrapper and it should be unwrapped
          this.element.unwrap();
        }

        this.element.removeClass('oj-select-select oj-component-initnode');
        this.element.attr({
          'aria-labelledby': ''
        });
        // Readonly support
      } else if (this.select) {
        this.select._destroy();
        this.select = undefined;
      }
    },

    // ////////////////     SUB-IDS     //////////////////

    /**
     * <p>Sub-ID for the selected text in the select box. This is not available in the native renderMode.</p>
     *
     * @ojsubid oj-select-chosen
     * @deprecated 1.2.0 This sub-ID is not needed since it is not an interactive element.
     * @memberof oj.ojSelect
     * @ignore
     * @instance
     */

    /**
     * <p>Sub-ID for the dropdown box. See the <a href="#minimumResultsForSearch">minimum-results-for-search</a> attribute for details. This is not available in the native renderMode.</p>
     *
     * @ojsubid oj-select-drop
     * @deprecated 1.2.0 This sub-ID is not needed since it is not an interactive element.
     * @memberof oj.ojSelect
     * @ignore
     */

    /**
     * <p>Sub-ID for the search box. Note:</p>
     * <ul>
     * <li>the search box is not always visible</li>
     * <li>the Sub-Id is not available in the native renderMode</li>
     * </ul>
     * <p>See the <a href="#minimumResultsForSearch">minimum-results-for-search</a> attribute for details.
     * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
     * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.
     *
     * @ojsubid oj-select-search
     * @ignore
     * @deprecated 1.2.0 This sub-ID is not needed since it is not an interactive element.
     * @memberof oj.ojSelect
     */

    /**
     * <p>Sub-ID for the search input element. Note:</p>
     * <ul>
     * <li>the search input is not always visible</li>
     * <li>the Sub-Id is not available in the native renderMode</li>
     * </ul>
     *
     * <p>See the <a href="#minimumResultsForSearch">minimum-results-for-search</a> attribute for details.</p>
     *
     * @ojsubid oj-listbox-input
     * @deprecated 1.2.0 please see oj-select-input
     * @memberof oj.ojSelect
     * @ignore
     */

    /**
     * <p>Sub-ID for the filtered result list. This Sub-Id is not available in the native renderMode.</p>
     *
     * @ojsubid oj-select-results
     * @deprecated 1.2.0 This sub-ID is not needed since it is not an interactive element.
     * @memberof oj.ojSelect
     * @ignore
     */

    /**
     * <p>Sub-ID for the filtered result item. Note:</p>
     * <ul>
     * <li>To lookup a filtered result item, the dropdown must be open and the locator object should have:
     *     subId: 'oj-listbox-result-label' and index: number.
     * </li>
     * <li>the Sub-Id is not available in the native renderMode</li>
     * </ul>
     *
     * @ojsubid oj-listbox-result-label
     * @deprecated 1.2.0 This sub-ID is not needed since it is not an interactive element.
     * @memberof oj.ojSelect
     * @ignore
     */

    /**
     * <p>Sub-ID for the search input field. It's only visible when the results size is greater than the minimum-results-for-search threshold or when user starts typing into the select box. This Sub-Id is not available in the native renderMode.</p>
     * @ojsubid oj-select-input
     * @memberof oj.ojSelect
     *
     * @example <caption>Get the input field element</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-select-input'});
     */

    /**
     * <p>Sub-ID for the drop down arrow. This Sub-Id is not available in the native renderMode.</p>
     *
     * @ojsubid oj-select-arrow
     * @memberof oj.ojSelectOne
     *
     * @example <caption>Get the drop down arrow of the select</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-select-arrow'});
     */

    /**
     * <p>Sub-ID for the list item. This Sub-Id is not available in the native renderMode.</p>
     *
     * @ojsubid oj-listitem
     * @memberof oj.ojSelect
     *
     * @example <caption>Get the listitem corresponding to value "myVal"</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-listitem', 'value': 'myVal'});
     */

    /**
     * <p>Sub-ID for the remove icon of selected item. This Sub-Id is not available in the native renderMode.</p>
     *
     * @ojsubid oj-select-remove
     * @memberof oj.ojSelectMany
     *
     * @example <caption>Get the element corresponding to the remove icon for the selected item with
     * value "myVal"</caption>
     * var node = myElement.getNodeBySubId({'subId': 'oj-select-remove', 'value': 'myVal'});
     */

    // @inheritdoc
    getNodeBySubId: function (locator) {
      var node = null;
      var subId;
      if (locator == null) {
        var container = this.widget();
        return container ? container[0] : null;
      } else if (this._isNative()) {
        // doesn't support any sub ID in native mode
        return null;
      }

      node = this._super(locator);

      if (!node) {
        var dropdown = this._getDropdown();

        subId = locator.subId;
        switch (subId) {
          case 'oj-select-drop':
            if (dropdown) {
              node = dropdown[0];
            }
            break;
          case 'oj-select-results':
            if (dropdown) {
              node = dropdown.find('.oj-listbox-results')[0];
            }
            break;
          case 'oj-select-search':
            if (dropdown) {
              node = dropdown.find('.oj-listbox-search')[0];
            }
            break;
          case 'oj-select-input':
          case 'oj-listbox-input':
            if (dropdown) {
              node = dropdown.find('.oj-listbox-input')[0];
            }
            break;
          case 'oj-select-choice':
          case 'oj-select-chosen':
          case 'oj-select-arrow':
            node = this.widget().find('.' + subId)[0];
            break;
          case 'oj-listitem':
            if (dropdown) {
              var list = dropdown.find('.oj-listbox-result');
              node = this.select._findItem(list, locator.value);
            }
            break;
          case 'oj-select-remove':
            var selectedItems = this.widget().find('.oj-select-selected-choice');
            var item = this.select._findItem(selectedItems, locator.value);
            node = item ? $(item).find('.oj-select-clear-entry-icon')[0] : null;
            break;

          //  - ojselect - not able to attach id for generated jet component
          case 'oj-listbox-result-label':
            if (dropdown) {
              // list of 'li'
              var ddlist = $('#' + this.select.results.attr('id')).children();
              var index = locator.index;

              if (ddlist.length && index < ddlist.length) {
                node = ddlist.eq(index).find('.' + subId)[0];
              }
            }
            break;

          default:
            break;
        }
      }
      // Non-null locators have to be handled by the component subclasses
      return node || null;
    },

    /**
     * Returns the subId object for the given child DOM node.  For more details, see
     * <a href="#getNodeBySubId">getNodeBySubId</a>.
     *
     * @expose
     * @ignore
     * @override
     * @memberof oj.ojSelect
     * @instance
     *
     * @param {!Element} node - child DOM node
     * @return {Object|null} The subId for the DOM node, or <code class="prettyprint">null</code> when none is found.
     *
     * @example <caption>Get the subId for a certain DOM node:</caption>
     * var subId = myElement.getSubIdByNode(node);
     */
    getSubIdByNode: function (node) {
      if (this._isNative()) {
        return this._super(node);
      }

      var subId = null;
      if (node != null) {
        var nodeCached = $(node);

        if (nodeCached.hasClass('oj-listbox-input')) {
          subId = { subId: 'oj-select-input' };
        } else if (nodeCached.hasClass('oj-select-arrow')) {
          subId = { subId: 'oj-select-arrow' };
        } else if (nodeCached.hasClass('oj-listbox-result')) {
          subId = { subId: 'oj-listitem', value: nodeCached.data('ojselect').value };
        } else if (nodeCached.hasClass('oj-select-clear-entry-icon')) {
          subId = {
            subId: 'oj-select-remove',
            value: nodeCached.closest('.oj-select-selected-choice').data('ojselect').value
          };
        } else {
          subId = this._super(node);
        }
      }

      return subId;
    },

    /**
     * Returns the default styleclass for the component. Currently this is
     * used to pass to the ojLabel component, which will append -label and
     * add the style class onto the label. This way we can style the label
     * specific to the input component. For example, for inline labels, the
     * radioset/checkboxset components need to have margin-top:0, whereas all the
     * other inputs need it to be .5em. So we'll have a special margin-top style
     * for .oj-label-inline.oj-radioset-label
     * All input components must override
     *
     * @return {string}
     * @expose
     * @memberof! oj.ojSelect
     * @override
     * @protected
     */
    _GetDefaultStyleClass: function () {
      return 'oj-select';
    },

    /**
     * Returns the messaging launcher element i.e., where user sets focus that triggers the popup.
     * Usually this is the element input or select that will receive focus and on which the popup
     * for messaging is initialized.
     *
     * @override
     * @protected
     * @memberof! oj.ojSelect
     * @return {Object} jquery element which represents the messaging launcher component
     */
    _GetMessagingLauncherElement: function () {
      // If native render mode, return selection, otherwise return _super()
      return this.select ? this.select.selection : this._super();
    },

    /**
     * Returns the jquery element that represents the content part of the component.
     * This is usually the component that user sets focus on (tabindex is set 0) and
     * where aria attributes like aria-required, aria-labelledby etc. are set. This is
     * also the element where the new value is updated. Usually this is the same as
     * the _GetMessagingLauncherElement.
     *
     * @override
     * @protected
     * @memberof! oj.ojSelect
     * @return {jQuery} jquery element which represents the content.
     */
    _GetContentElement: function () {
      // native renderMode
      if (this.select) {
        return this.select.selection;
      }
      return this.element;
    },

    /**
     * Returns the element on which aria-label can be found.
     * For select components, it is the content element where the aria-label will be set.
     *
     * @override
     * @protected
     * @memberof! oj.ojSelect
     * @return {HTMLElement} The element in which we set the aria-label attribute
     */
    _GetAriaLabelElement: function () {
      return this._GetContentElement()[0];
    }
  });

  Components.setDefaultOptions({
    // converterHint is defaulted to placeholder and notewindow in EditableValue.
    // For ojselect, we don't want a converterHint.
    // properties for all ojSelect components
    ojSelect: {
      displayOptions: {
        converterHint: ['none']
      },

      // native renderMode
      renderMode: Components.createDynamicPropertyGetter(function () {
        return (ThemeUtils.parseJSONFromFontFamily('oj-select-option-defaults') || {}).renderMode;
      })
    }
  });

  /* jslint browser: true,devel:true*/
  /**
   * The oj.Optgroup interface defines API for a group option of the JET Select and Combobox.
   * Use <code class="prettyprint">oj.Option</code> for a leaf option and <code class="prettyprint">oj.Optgroup</code> for a group option.
   * <ul>
   * <li><code class="prettyprint">children</code> is a required attribute to group the Option children.</li>
   * <li><code class="prettyprint">label</code> is a required attribute</li>
   * </ul>
   * <p>See <a href="oj.Option.html">oj.Option</a> for a leaf option</p>
   * <p>See {@link oj.ojComboboxOne#options}</p>
   * <p>See {@link oj.ojComboboxMany#options}</p>
   * <p>See {@link oj.ojSelectOne#options}</p>
   * <p>See {@link oj.ojSelectMany#options}</p>
   * @since 4.1.0
   * @export
   * @interface oj.Optgroup
   */

  /**
   * Label is a required attribute. It is used to display the group label.
   *
   * @export
   * @expose
   * @memberof oj.Optgroup
   * @instance
   * @name label
   * @type {string}
   */

  /**
   * disabled is an optional attribute. When specified, all options in the group is not selectable.
   *
   * @export
   * @expose
   * @memberof oj.Optgroup
   * @instance
   * @name disabled
   * @type {boolean}
   * @ojsignature { target: "Type",
   *                value: "?"}
   */

  /**
   * Children is a required attribute. It is used to group its Option or Optgroup children.
   *
   * @export
   * @expose
   * @memberof oj.Optgroup
   * @instance
   * @name children
   * @type {Array.<oj.Option|oj.Optgroup>}
   */

  // end of jsdoc

  /* jslint browser: true,devel:true*/
  /**
   * The oj.Option interface defines API for a leaf option of the JET select and combobox.
   * Use <code class="prettyprint">oj.Option</code> for a leaf option and <code class="prettyprint">oj.Optgroup</code> for a group option.
   * <ul>
   * <li><code class="prettyprint">value</code> is a required attribute. It must be a row key in the data provider.</li>
   * <li><code class="prettyprint">label</code> is an optional attribute. If missing, String(value) is used.</li>
   * </ul>
   * <p>See <a href="oj.Optgroup.html">oj.Optgroup</a> for group option</p>
   * <p>See {@link oj.ojComboboxOne#options}</p>
   * <p>See {@link oj.ojComboboxMany#options}</p>
   * <p>See {@link oj.ojSelectOne#options}</p>
   * <p>See {@link oj.ojSelectMany#options}</p>
   * <p>See {@link oj.ojMenuSelectMany#options}</p>
   * @since 4.1.0
   * @export
   * @interface oj.Option
   */

  /**
   * value is required attribute. It must be the row key in the data provider because JET Select and Combobox use "value" to fetch the displayed "label".
   *
   * @export
   * @expose
   * @memberof oj.Option
   * @instance
   * @name value
   * @type {Object}
   */

  /**
   * label is an optional attribute. It is the display label for the option item. If it's missing, String(value) will be used.
   *
   * @export
   * @expose
   * @memberof oj.Option
   * @instance
   * @name label
   * @type {string}
   * @ojsignature { target: "Type",
   *                value: "?"}
   */

  /**
   * disabled is an optional attribute. When disabled is true, the option item is not selectable.
   *
   * @export
   * @expose
   * @memberof oj.Option
   * @instance
   * @name disabled
   * @type {boolean}
   * @ojsignature { target: "Type",
   *                value: "?"}
   */

  // end of jsdoc

});
