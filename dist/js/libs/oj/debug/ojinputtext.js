/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojthemeutils', 'ojs/ojeditablevalue', 'ojs/ojcore-base', 'ojs/ojdomutils', 'ojs/ojfilter-length', 'ojs/ojvalidator-regexp', 'ojs/ojcustomelement-utils'], function (ojcore, $, ojthemeutils, ojeditablevalue, oj, DomUtils, LengthFilter, RegExpValidator, ojcustomelementUtils) { 'use strict';

  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  LengthFilter = LengthFilter && Object.prototype.hasOwnProperty.call(LengthFilter, 'default') ? LengthFilter['default'] : LengthFilter;
  RegExpValidator = RegExpValidator && Object.prototype.hasOwnProperty.call(RegExpValidator, 'default') ? RegExpValidator['default'] : RegExpValidator;

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

var __oj_input_password_metadata = 
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
    "maskIcon": {
      "type": "string",
      "enumValues": [
        "hidden",
        "visible"
      ],
      "value": "hidden"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "name": {
      "type": "string",
      "value": "",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
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
        "accessibleHidePassword": {
          "type": "string"
        },
        "accessibleMaxLengthExceeded": {
          "type": "string"
        },
        "accessibleMaxLengthRemaining": {
          "type": "string"
        },
        "accessibleShowPassword": {
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
      "type": "Array<Object>",
      "value": []
    },
    "value": {
      "type": "string",
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
    __oj_input_password_metadata.extension._WIDGET_NAME = 'ojInputPassword';
    __oj_input_password_metadata.extension._INNER_ELEM = 'input';
    __oj_input_password_metadata.extension._GLOBAL_TRANSFER_ATTRS = [
      'accesskey',
      'aria-label',
      'tabindex'
    ];
    __oj_input_password_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
    oj.CustomElementBridge.register('oj-input-password', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_input_password_metadata, bindingMeta)
    });

var __oj_input_text_metadata = 
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
    "clearIcon": {
      "type": "string",
      "enumValues": [
        "always",
        "conditional",
        "never"
      ],
      "value": "never"
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
    "length": {
      "type": "object",
      "properties": {
        "countBy": {
          "type": "string",
          "enumValues": [
            "codePoint",
            "codeUnit"
          ],
          "value": "codePoint"
        },
        "max": {
          "type": "number"
        }
      }
    },
    "list": {
      "type": "string",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "name": {
      "type": "string",
      "value": "",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
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
        "accessibleClearIcon": {
          "type": "string"
        },
        "accessibleMaxLengthExceeded": {
          "type": "string"
        },
        "accessibleMaxLengthRemaining": {
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
      "type": "Array<Object>",
      "value": []
    },
    "value": {
      "type": "any",
      "writeback": true
    },
    "virtualKeyboard": {
      "type": "string",
      "enumValues": [
        "auto",
        "email",
        "number",
        "search",
        "tel",
        "text",
        "url"
      ],
      "value": "auto"
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
    /* global __oj_input_text_metadata:false */
    __oj_input_text_metadata.extension._WIDGET_NAME = 'ojInputText';
    __oj_input_text_metadata.extension._INNER_ELEM = 'input';
    __oj_input_text_metadata.extension._GLOBAL_TRANSFER_ATTRS = [
      'accesskey',
      'aria-label',
      'tabindex',
      'autocapitalize'
    ];
    __oj_input_text_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
    oj.CustomElementBridge.register('oj-input-text', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_input_text_metadata, bindingMeta)
    });

var __oj_text_area_metadata = 
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
    "length": {
      "type": "object",
      "properties": {
        "countBy": {
          "type": "string",
          "enumValues": [
            "codePoint",
            "codeUnit"
          ],
          "value": "codePoint"
        },
        "counter": {
          "type": "string",
          "enumValues": [
            "none",
            "remaining"
          ],
          "value": "none"
        },
        "max": {
          "type": "number"
        }
      }
    },
    "maxRows": {
      "type": "number",
      "value": 0
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "name": {
      "type": "string",
      "value": "",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
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
    "resizeBehavior": {
      "type": "string",
      "enumValues": [
        "both",
        "horizontal",
        "none",
        "vertical"
      ],
      "value": "none"
    },
    "rows": {
      "type": "number",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "accessibleMaxLengthExceeded": {
          "type": "string"
        },
        "accessibleMaxLengthRemaining": {
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
      "type": "Array<Object>",
      "value": []
    },
    "value": {
      "type": "any",
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
    /* global __oj_text_area_metadata:false */
    __oj_text_area_metadata.extension._WIDGET_NAME = 'ojTextArea';
    __oj_text_area_metadata.extension._INNER_ELEM = 'textarea';
    __oj_text_area_metadata.extension._GLOBAL_TRANSFER_ATTRS = [
      'accesskey',
      'aria-label',
      'tabindex',
      'autocapitalize'
    ];
    __oj_text_area_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
    oj.CustomElementBridge.register('oj-text-area', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_text_area_metadata, bindingMeta)
    });
  })();

  /**
   * @ojcomponent oj.inputBase
   * @augments oj.editableValue
   * @abstract
   * @ojsignature [{
   *                target: "Type",
   *                value: "abstract class inputBase<V, SP extends inputBaseSettableProperties<V, SV>, SV= V, RV= V> extends editableValue<V, SP, SV, RV>"
   *               },
   *               {
   *                target: "Type",
   *                value: "inputBaseSettableProperties<V, SV=V, RV= V> extends editableValueSettableProperties<V, SV, RV>",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @since 0.6.0
   * @ojshortdesc Abstract InputBase element
   * @ojrole input
   * @hideconstructor
   * @ojimportmembers oj.ojDisplayOptions
   * @ojtsimport {module: "ojvalidationfactory-base", type: "AMD", imported:["Validation"]}
   * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
   * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
   * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
   * @ojtsimport {module: "ojvalidator-daterestriction", type: "AMD", importName: "DateRestrictionValidator"}
   * @ojtsimport {module: "ojvalidator-datetimerange", type: "AMD", importName: "DateTimeRangeValidator"}
   * @ojtsimport {module: "ojvalidator-length", type: "AMD", importName: "LengthValidator"}
   * @ojtsimport {module: "ojvalidator-numberrange", type: "AMD", importName: "NumberRangeValidator"}
   * @ojtsimport {module: "ojvalidator-regexp", type: "AMD", importName: "RegExpValidator"}
   * @ojtsimport {module: "ojvalidator-required", type: "AMD", importName: "RequiredValidator"}
   *
   * @classdesc
   * <h3 id="inputBaseOverview-section">
   *   Abstract inputBase component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputBaseOverview-section"></a>
   * </h3>
   * {@ojinclude "name":"validationAndMessagingDoc"}
   * <p>Description: The inputBase component takes care of general needs of other input components [i.e. text + password]
   *
   * @param {Object=} options a map of option-value pairs to set on the component
   */
  oj.__registerWidget(
    'oj.inputBase',
    $.oj.editableValue,
    {
      version: '1.0.0',
      widgetEventPrefix: 'oj',

      /**
       * Convenience Array which one can extend to set the attribute to a mandatory value if it doesn't exist or is set to something else
       * [
       * {
       *    "attr"              : string - attribute associated to the task
       *    "setMandatory"      : value it must be set to [i.e. type="text"]
       * }
       * ]
       *
       * Examples:
       * 1) [{"attr": "type", "setMandatory": "text"}]
       *
       * @expose
       * @memberof! oj.inputBase
       * @private
       */
      _ATTR_CHECK: [],

      /**
       * Class names to be applied to this.element()
       *
       * @expose
       * @memberof! oj.inputBase
       * @private
       */
      _CLASS_NAMES: '',

      /**
       * Class names to be applied to this.widget()
       *
       * Note that if this value is defined then the this.element will be wrapped with a root dom element
       *
       * @expose
       * @memberof! oj.inputBase
       * @private
       */
      _WIDGET_CLASS_NAMES: '',

      /**
       * Class names to be applied to the dom that wraps the input and trigger elements. It is a child
       * of the root dom element - this.widget().
       *
       * An element can be wrapped by a root dom element OR by both a root dom element and this extra
       * wrapper dom. the time and date pickers have two wrappers since we want to do an extra
       * wrapping when an input has trigger elements (date icon, for example). This is needed so we
       * can add extra dom to the root dom element for inline messaging.
       *
       * @expose
       * @memberof! oj.inputBase
       * @private
       */
      _ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES: '',

      /**
       * Array to be used for EditableValueUtils.initializeOptionsFromDom attribute is the html-5 dom attribute name.
       * If option is different, like in the case of readonly (readonly html vs readOnly
       * (camelcase) component option), specify both attribute and option.
       * NOTE: This is for the widget components only. Do not add custom element attributes here.
       * @expose
       * @memberof! oj.inputBase
       * @private
       */
      _GET_INIT_OPTIONS_PROPS_FOR_WIDGET: [
        { attribute: 'disabled', validateOption: true },
        { attribute: 'pattern' },
        { attribute: 'placeholder' },
        { attribute: 'value' },
        { attribute: 'readonly', option: 'readOnly', validateOption: true },
        { attribute: 'required', coerceDomValue: true, validateOption: true },
        { attribute: 'title' },
        { attribute: 'spellcheck' }
      ],
      /**
       * If defined will append a div element containing text to be read out by Jaws when focus is placed on the input element
       * and the value will be used to locate the translated text to be read out by Jaws.
       *
       * Note the component must also be wrapped
       *
       * @expose
       * @memberof! oj.inputBase
       * @private
       */
      _INPUT_HELPER_KEY: '',

      _BLUR_HANDLER_KEY: 'blur',
      _KEYDOWN_HANDLER_KEY: 'keydown',
      _KEYUP_HANDLER_KEY: 'keyup',
      _COMPOSITIONSTART_HANDLER_KEY: 'compositionstart',
      _COMPOSITIONEND_HANDLER_KEY: 'compositionend',
      _INPUT_HANDLER_KEY: 'input',
      _DROP_HANDLER_KEY: 'drop',
      _CLICK_HANDLER_KEY: 'click',

      _TEXT_FIELD_COUNTER_CLASS: 'oj-text-field-counter',
      _TEXT_FIELD_HIDDEN_ARIA_LIVE_CLASS: 'oj-text-field-hidden-aria-live',
      _TEXT_FIELD_MAX_LENGTH_REMAINING_KEY: 'accessibleMaxLengthRemaining',
      _TEXT_FIELD_MAX_LENGTH_EXCEEDED_KEY: 'accessibleMaxLengthExceeded',
      _counterSpanEl: null,
      _ariaLiveTimer: null,

      options: {
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
         * for the <code class="prettyprint">{@link oj.inputBase#validators}</code> attribute.
         * </p>
         * <br/>
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
         *  &lt;oj-input-text value="{{value}}"
         *  async-validators="[[[asyncValidator1]]]">&lt;/oj-input-text>
         * @example <caption>Initialize the component with multiple AsyncValidator
         * duck-typed instances:</caption>
         * -- HTML --
         * &lt;oj-input-text id="asyncValKo1" data-oj-context
                    valid="{{koAsyncValid}}" value="{{koAsyncValue}}"
                    required validators="[[[checkfoo, checkfooey]]]"
                    async-validators="[[[asyncValidator1, asyncValidator2]]]">&lt;/oj-input-text>
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
         * @expose
         * @access public
         * @instance
         * @memberof oj.inputBase
         * @ojsignature  { target: "Type",
         *       value: "Array<oj.AsyncValidator<V>>",
         *       jsdocOverride: true}
         * @type {Array.<Object>}
         * @ojshortdesc Specifies a list of asynchronous validators used by the component when performing validation. Use async-validators when you need to perform some validation work on the server. See the Help documentation for more information.
         * @default []
         */
        asyncValidators: [],
        /**
         * <p>
         * When <code class="prettyprint">converter</code> property changes due to programmatic
         * intervention, the element performs various tasks based on the current state it is in. </br>
         *
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
         * <code class="prettyprint">converter</code> property changes then all element messages are
         * cleared and full validation run using the current display value on the element.
         * <ul>
         *   <li>if there are validation errors, then <code class="prettyprint">value</code>
         *   property is not updated, and the error is shown.
         *   The display value is not refreshed in this case. </li>
         *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
         *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
         *   event to clear custom errors. The
         *   display value is refreshed with the formatted value provided by converter.</li>
         * </ul>
         * </li>
         * <li>if element is invalid and has deferred messages when converter property changes, the
         *   display value is again refreshed with the formatted value provided by converter.</li>
         * </ul>
         *
         * <h4>Clearing Messages</h4>
         * <ul>
         * <li>Only messages created by the element are cleared.</li>
         * <li><code class="prettyprint">messagesCustom</code> property is not cleared.
         * Page authors can
         * choose to clear it explicitly when setting the converter option.</li>
         * </ul>
         * </p>
         * @ojfragment inputBaseConverterOptionDoc
         * @memberof oj.inputBase
         **/
        /**
         * Dictates component's autocomplete state.
         * This attribute indicates whether the value of the control can be automatically
         * completed by the browser. The common values are "on" and "off".
         * <p>Since this attribute passes through to the input element
         * unchanged, you can look at the html specs for detailed information for how browsers behave
         * and what values besides "on" and "off" you can set. The html spec says the default is "on",
         * so when autocomplete is not explicitly set, the browsers treat it as "on".
         * </p>
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input}
         * @see {@link https://caniuse.com/#feat=input-autocomplete-onoff}
         * @see {@link https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls:-the-autocomplete-attribute}
         *
         * @example <caption>Initialize component with <code class="prettyprint">autocomplete</code> attribute:</caption>
         * &lt;oj-some-element autocomplete="on">&lt;/oj-some-element>
         *
         * @example <caption>Get or set the <code class="prettyprint">autocomplete</code> property after initialization:</caption>
         * // getter
         * var ro = myComp.autocomplete;
         *
         * // setter
         * myComp.autocomplete = "on";
         * @ojshortdesc Specifies a component's autocomplete state. See the Help documentation for more information.
         * @expose
         * @type {"on"|"off"|string=}
         * @default "on"
         * @instance
         * @since 4.0.0
         * @memberof oj.inputBase
         * @ojextension {_COPY_TO_INNER_ELEM: true}
         */
        autocomplete: undefined,
        /**
         * Autofocus is a Boolean that reflects the autofocus attribute, If it is set to true
         * then the associated component  will get input focus when the page is loaded.
         * Setting this property doesn't set the focus to the component:
         * it tells the browser to focus to it when the element is inserted in the document.
         *
         * @example <caption>Initialize component with <code class="prettyprint">autofocus</code> attribute:</caption>
         * &lt;oj-some-element autofocus>&lt;/oj-some-element>
         *
         * @example <caption>Get or set the <code class="prettyprint">autofocus</code> property after initialization:</caption>
         * // getter
         * var ro = myComp.autofocus;
         *
         * // setter
         * myComp.autofocus = false;
         *
         * @expose
         * @type {boolean}
         * @alias autofocus
         * @default false
         * @instance
         * @since 4.0.0
         * @memberof oj.inputBase
         * @ojshortdesc Specifies whether the component will get input focus when the page is loaded. See the Help documentation for more information.
         * @ojextension {_COPY_TO_INNER_ELEM: true}
         */
        autofocus: false,
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
         * &lt;oj-label for="textId">Name:&lt;/oj-label>
         * &lt;oj-input-text id="textId">
         * &lt;/oj-input-text>
         * // ojLabel then writes the labelled-by attribute on the oj-input-text.
         * &lt;oj-label id="labelId" for="textId">Name:&lt;/oj-label>
         * &lt;oj-input-text id="textId" labelled-by"labelId">
         * &lt;/oj-input-text>
         *
         * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property after initialization:</caption>
         * // getter
         * var labelledBy = myComp.labelledBy;
         *
         * // setter
         * myComp.labelledBy = "labelId";
         *
         * @expose
         * @ojshortdesc The oj-label sets the labelledBy property programmatically on the form component. See the Help documentation for more information.
         * @type {string|null}
         * @default null
         * @public
         * @instance
         * @since 7.0.0
         * @memberof oj.inputBase
         */
        labelledBy: null,
        /**
         * Specifies the name of the component.
         *
         * @example <caption>Initialize component with <code class="prettyprint">name</code> attribute:</caption>
         * &lt;oj-some-element name="myName">&lt;/oj-some-element>
         *
         * @example <caption>Get or set the <code class="prettyprint">name</code> property after initialization:</caption>
         * // getter
         * var ro = myComp.name;
         *
         * // setter
         * myComp.name = myName;
         *
         * @expose
         * @type {string}
         * @default ""
         * @alias name
         * @instance
         * @since 4.0.0
         * @ojdeprecated {since: '6.0.0', description: 'JET does not use form submit, so this is not needed.'}
         * @ojtsignore
         * @memberof oj.inputBase
         * @ojextension {_COPY_TO_INNER_ELEM: true}
         */
        name: '',
        /**
         * The placeholder text to set on the element.
         *
         * @example <caption>Initialize the component with the <code class="prettyprint">placeholder</code> attribute:</caption>
         * &lt;oj-some-element placeholder="User Name">&lt;/oj-some-element>
         *
         * @example <caption>Get or set the <code class="prettyprint">placeholder</code> property after initialization:</caption>
         * // getter
         * var myPh = myComp.placeholder;
         *
         * // setter
         * myComp.placeholder = myPlaceholder;
         *
         * If the attribute is not set and if a converter is set then the
         * converter hint is used. See displayOptions for details.
         *
         *
         * @expose
         * @access public
         * @instance
         * @memberof! oj.inputBase
         * @type {string}
         * @ojtranslatable
         */
        placeholder: '',
        /**
         * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving
         * the current value from the input field in string form. The main consumer of
         * <code class="prettyprint">rawValue</code> is a converter.</p>
         * <p>
         * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
         * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed.
         * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2',
         * ..., and finally '1,200'. Then when the user blurs or presses
         * Enter the <code class="prettyprint">value</code> property gets converted and validated
         * (if there is a converter or validators) and then gets updated if valid.
         * </p>
         * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
         * @expose
         * @access public
         * @instance
         * @memberof! oj.inputBase
         * @ojshortdesc Read-only property used for retrieving the current value from the input field in string form. See the Help documentation for more information.
         * @type {string}
         * @ojsignature {target: "Type", value: "RV"}
         * @since 1.2.0
         * @readonly
         * @ojwriteback
         */
        rawValue: undefined,
        /**
         * Whether the component is readonly. The readonly property sets or returns whether an element is readonly, or not.
         * A readonly element cannot be modified. However, a user can tab to it, highlight it, focus on it, and copy the text from it.
         * If you want to prevent the user from interacting with the element, use the disabled property instead.
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
         * @example <caption>Initialize component with <code class="prettyprint">readonly</code> attribute:</caption>
         * &lt;oj-some-element readonly>&lt;/oj-some-element>
         *
         * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
         * // getter
         * var ro = myComp.readonly;
         *
         * // setter
         * myComp.readonly = false;
         *
         * @expose
         * @type {boolean}
         * @alias readonly
         * @ojshortdesc Specifies whether the component is read-only.  A read-only element cannot be modified, but user interaction is allowed. See the Help documentation for more information.
         * @default false
         * @instance
         * @memberof! oj.inputBase
         */
        readOnly: false,
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
         * @example <caption>Initialize the component with the <code class="prettyprint">required</code> attribute:</caption>
         * &lt;oj-some-element required>&lt;/oj-some-element><br/>
         *
         * @example <caption>Customize messages and hints used by implicit required validator when
         * <code class="prettyprint">required</code> attribute is set:</caption>
         * &lt;oj-some-element required translations='{"required": {
         *                 "hint": "custom: enter at least 3 alphabets",
         *                 "messageSummary": "custom: \'{label}\' is Required",
         *                 "messageDetail": "custom: please enter a valid value for \'{label}\'"}}'>
         * &lt;/oj-some-element>
         *
         * @example <caption>Get or set the <code class="prettyprint">required</code> property after initialization:</caption>
         * // getter
         * var rq = myComp.required;
         *
         * // setter
         * myComp.required = false;
         *
         * @expose
         * @access public
         * @instance
         * @memberof oj.inputBase
         * @ojshortdesc Specifies whether the component is required or optional. See the Help documentation for more information.
         * @type {boolean}
         * @default false
         * @since 0.7.0
         * @see #translations
         */
        required: false,

        /**
         * List of validators, synchronous or asynchronous,
         * used by component along with asynchronous validators from the deprecated async-validators option
         * and the implicit component validators when performing validation. Each item is either an
         * instance that duck types {@link oj.Validator} or {@link oj.AsyncValidator}.
         * <p>
         * Implicit validators are created by the element when certain attributes are present.
         * For example, if the <code class="prettyprint">required</code> attribute
         * is set, an implicit {@link oj.RequiredValidator} is created.
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
         * <code class="prettyprint">validators</code> or
         * <code class="prettyprint">async-validators</code> changes then all component messages
         *  are cleared and full validation run using the display value on the component.
         * <ul>
         *   <li>if there are validation errors, then <code class="prettyprint">value</code>
         *   property is not updated and the error is shown.
         *   </li>
         *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
         *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
         *   event to clear custom errors.</li>
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
         * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
         * </ul>
         * </p>

         *
         * @example <caption>Initialize the component with validator instance:</caption>
         * &lt;oj-some-element validators='[[[myRegExpValidator]]]'>
         * &lt;/oj-some-element>
         * self.myRegExpValidator = new RegExpValidator(
         * {pattern: "[a-zA-Z0-9]{3,}",
         * messageDetail: "You must enter at least 3 letters or numbers"});
         *
         *
         * @example <caption>Initialize the component with multiple validator instances:</caption>
         * self.checkfooey = {
         *   'validate' : function(value) {
         *     if (value === "fooey" || value === "pass") {
         *       return true;
         *     } else {
         *       throw new Error("value isn't fooey or pass");
         *     }
         *   },
         *  'getHint': function() {
         *    return null;
         *  }
         * };
         * self.checkbar = {
         * 'validate' : function(value) {
         *   if (value === "bar" || value === "pass") {
         *     return true;
         *   } else {
         *     throw new Error("value isn't bar or pass");
         *   }
         *  },
         *  'getHint': function() {
         *    return null;
         *  }
         * };
         * var validators = [checkfooey, checkbar]<br/>
         * ... HTML...
         * &lt;oj-some-element validators='[[validators]]'>
         * &lt;/oj-some-element>
         *
         * @example <caption>Get or set the <code class="prettyprint">validators</code> property after initialization:</caption>
         * // getter
         * var validators = myComp.validators;
         *
         * // setter
         * myComp.validators = myValidators;
         *
         * @expose
         * @access public
         * @instance
         * @default []
         * @memberof oj.inputBase
         * @ojshortdesc Specifies a list of synchronous validators for performing validation by the element. See the Help documentation for more information.
         * @ojsignature  [{ target: "Type",
         *       value: "Array<oj.Validator<V>|oj.AsyncValidator<V>>|null",
         *       jsdocOverride: true},
         * { target: "Type",
         *       value: "Array<oj.Validator<V>|oj.AsyncValidator<V>|
         *       oj.Validation.RegisteredValidator>|null",
         *       consumedBy: 'tsdep'}]
         * @ojdeprecated {since: '8.0.0', target: 'memberType', value: ['oj.Validation.RegisteredValidator'],
         *                description: 'Defining a validator with an object literal with validator type and
         *                  its options (aka JSON format) has been deprecated and does nothing. If needed, you can
         *                  make the JSON format work again by importing the deprecated ojvalidation module you need,
         *                  like ojvalidation-base.'}
         * @type {Array.<Object>}
         */
        validators: []
      },

      /**
       * The base method needs to be overriden so that one can perform attribute check/set [i.e. ojInputText can only have type="text"]
       *
       * @protected
       * @override
       * @param {Object} element - jQuery selection to save attributes for
       * @instance
       * @memberof! oj.inputBase
       */
      // eslint-disable-next-line no-unused-vars
      _SaveAttributes: function (element) {
        var ret = this._superApply(arguments);

        this._processAttrCheck();

        return ret;
      },

      /**
       * @protected
       * @override
       * @instance
       * @memberof! oj.inputBase
       */
      _InitOptions: function (originalDefaults, constructorOptions) {
        this._super(originalDefaults, constructorOptions);
        if (!this._IsCustomElement()) {
          ojeditablevalue.EditableValueUtils.initializeOptionsFromDom(
            this._GET_INIT_OPTIONS_PROPS_FOR_WIDGET,
            constructorOptions,
            this
          );
        }
      },

      /**
       * 1) Initializes the options
       * 2) If needed wraps the input element,
       *
       * @protected
       * @override
       * @instance
       * @memberof! oj.inputBase
       */
      _ComponentCreate: function () {
        var ret = this._superApply(arguments);
        var readOnly = this.options.readOnly;

        this._rtl = this._GetReadingDirection() === 'rtl';
        // JET-39086 - raw-value is not getting updated until space in android devices
        // In android device we need to update rawValue even for composition events
        // Get and store agent info
        this._isAndroidDevice = oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.ANDROID;

        // update element state using options
        if (typeof readOnly === 'boolean') {
          this.element.prop('readonly', readOnly);
        }

        // If we need to wrap this.element, we should do it in one pass instead of multiple
        // passes.  If elements are reparented multiple times, it will impact performance.
        if (this._DoWrapElement()) {
          var outerWrapper;
          var newParent;

          // Wraps the this.element and adds _WIDGET_CLASS_NAMES classes to the wrapped element
          if (this.OuterWrapper) {
            // this.OuterWrapper is only set for custom element.
            // For custom element, the outer wrapper is the custom element itself.
            outerWrapper = this.OuterWrapper;
            if (outerWrapper.className) {
              outerWrapper.className = outerWrapper.className + ' ' + this._WIDGET_CLASS_NAMES;
            } else {
              outerWrapper.className = this._WIDGET_CLASS_NAMES;
            }
          } else {
            // For widget, we need to create the outer wrapper around the element that the component binds to.
            outerWrapper = document.createElement('div');
            outerWrapper.className = this._WIDGET_CLASS_NAMES;
            // this.element doesn't always have a parent (e.g. when it's in a template)
            if (this.element[0].parentNode) {
              this.element[0].parentNode.insertBefore(outerWrapper, this.element[0]);
            }
            // For now, just insert the outer wrapper before this.element.
            // Don't bother reparenting this.element until all the other wrappers have been created.
          }
          newParent = outerWrapper;
          this._wrapper = $(outerWrapper);

          // may need to do an extra wrapping if the element has triggers
          if (this._DoWrapElementAndTriggers()) {
            var containerWrapper = this._CreateContainerWrapper();
            outerWrapper.appendChild(containerWrapper);
            newParent = containerWrapper;

            // _CreateMiddleWrapper may return null (e.g. oj-date-picker)
            var middleWrapper = this._CreateMiddleWrapper();
            if (middleWrapper) {
              containerWrapper.appendChild(middleWrapper);
              newParent = middleWrapper;
            }
          }

          // Only reparent this.element once
          newParent.appendChild(this.element[0]);

          this._focusable({
            element: this._wrapper,
            applyHighlight: true
          });
        } else {
          this._focusable({
            element: this.element,
            applyHighlight: true
          });
        }

        // We need to add style classes before _AfterCreate() is called because textarea needs to use these in _AfterCreate() to determine its height.
        if (this._CLASS_NAMES) {
          this.element.addClass(this._CLASS_NAMES);
          this.element.addClass('oj-text-field-input');
        }

        // remove pattern attribute to not trigger html5 validation + inline bubble
        //    if ('pattern' in savedAttributes)
        //    {
        //      node.removeAttr('pattern');
        //    }

        this._defaultRegExpValidator = {};
        this._eventHandlers = null;

        if (this._hasMaxLength()) {
          this.lengthFilter = new LengthFilter(this.options.length);
        }

        return ret;
      },
      /**
       * 1) Updates component state based on the option values
       * 2) Adds the classname to the element [intentionally postponing till this process since the component might need to
       *    reset this.element for some reason]
       * 3) Hooks up the blur handler
       * 4) If necessary appends an input helper to be read out by Jaws accessibility reader
       *
       * @protected
       * @override
       * @instance
       * @memberof! oj.inputBase
       */
      _AfterCreate: function () {
        var ret = this._superApply(arguments);
        var options = ['disabled', 'readOnly'];
        var self = this;

        this._refreshRequired(this.options.required);

        // attach handlers such as blur, keydown, and drop. placed in a function so to detach the handlers as well
        // when the options change
        this._attachDetachEventHandlers();

        this._AppendInputHelper();

        // some components need to be able to announce dynamic changes to AT.
        this._AppendAriaLiveHelper();

        $.each(options, function (index, ele) {
          if (self.options[ele]) {
            self._processOptions(ele, self.options[ele]);
          }
        });

        if (this._IsCustomElement()) {
          // Don't do this for datepicker and datetimepicker because those are
          // divs not inputs, so make this overrideable.
          let labelledBy = this.options.labelledBy;
          this._initLabelledByForInputBase(labelledBy);
        }
        if (this._hasMaxLength()) {
          this._processLengthCounterAttr(this.options.length.counter);
        }
        return ret;
      },
      /**
       * Whether the component is required.
       *
       * @return {boolean} true if required; false
       *
       * @memberof! oj.inputBase
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
       * listen to valueChanged to clear custom errors.<br/>
       *
       * - if component is invalid and has messagesHidden -> required: false -> clear component
       * errors; no deferred validation is run.<br/>
       * - if component has no error -> required: true -> run deferred validation (we don't want to flag
       * errors unnecessarily)<br/>
       * - messagesCustom is never cleared<br/>
       *
       * @param {string} option
       *
       * @memberof! oj.inputBase
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
       * @memberof! oj.inputBase
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
       * @memberof! oj.inputBase
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
       * listen to valueChanged to clear custom errors.<br/>
       * - if component is invalid has messagesHidden -> refresh UI value. no need to run deferred
       * validations. <br/>
       * - messagesCustom is never cleared<br/>
       *
       * @memberof! oj.inputBase
       * @instance
       * @protected
       */
      _AfterSetOptionConverter: ojeditablevalue.EditableValueUtils._AfterSetOptionConverter,
      /**
       * Called when converter option changes and we have gotten the new converter
       * @memberof! oj.inputBase
       * @instance
       * @protected
       */
      _ResetConverter: ojeditablevalue.EditableValueUtils._ResetConverter,
      /**
       * Returns the normalized converter instance.
       *
       * @return {Object} a converter instance or null
       * @memberof! oj.inputBase
       * @instance
       * @protected
       */
      _GetConverter: ojeditablevalue.EditableValueUtils._GetConverter,
      /**
       * This returns an array of all validators
       * normalized from the validators option set on the component. <br/>
       * @return {Array} of validators.
       * @memberof! oj.inputBase
       * @instance
       * @protected
       */
      _GetNormalizedValidatorsFromOption: ojeditablevalue.EditableValueUtils._GetNormalizedValidatorsFromOption,
      /**
       * This returns an array of all async validators
       * normalized from the async-validators attribute set on the component. <br/>
       * @return {Array} of validators.
       * @memberof! oj.inputBase
       * @instance
       * @protected
       */
      _GetNormalizedAsyncValidatorsFromOption:
        ojeditablevalue.EditableValueUtils._GetNormalizedAsyncValidatorsFromOption,

      /**
       * Called when the display value on the element needs to be updated. This method updates the
       * (content) element value. Widgets can override this method to update the element
       * appropriately.
       *
       * @param {string} displayValue the new string to be displayed
       *
       * @memberof! oj.inputBase
       * @instance
       * @protected
       */
      _SetDisplayValue: function (displayValue) {
        this._superApply(arguments);
        if (this.options.readOnly) {
          let readonlyElem = this._getReadonlyDiv();
          if (readonlyElem) {
            readonlyElem.textContent = displayValue;
          }
        }
      },
      /**
       * Draw a readonly div or update one. When readonly, this div is shown and
       * the input has display:none on it through theming, and vice versa.
       * We set the textContent in _SetDisplayValue() if readonly
       * @param {HTMLElement} pass in this.element[0]
       * @memberof! oj.inputBase
       * @instance
       * @private
       */
      _createOrUpdateReadonlyDiv: ojeditablevalue.EditableValueUtils._createOrUpdateReadonlyDiv,
      _processOptions: function (key, value) {
        if (key === 'disabled') {
          this.element.prop('disabled', value);
        }

        if (key === 'readOnly') {
          this.element.prop('readonly', value);
          // if readonly, then create the readonly div if it doesn't exist
          // and set its textContent to the input's display value.
          if (value) {
            // Putting it inside of DoWrapElement keeps it from getting called twice for
            // ojinputdatetime, which calls it once for ojinputdatetime and another for ojinputdatetime's
            // ojInputTime instantiation. DoWrapElement calls _isIndependentInput in ojinputtime.
            this._createOrUpdateReadonlyDiv(
              this.element[0],
              this._DoWrapElement() && this.OuterWrapper
            );
          }
          // last thing we do is refresh the state theming since this
          // affects the display css of the textarea and readonlydiv dom nodes.
          this._refreshStateTheming('readOnly', value);
        }

        if (key === 'disabled' || key === 'readOnly') {
          this._attachDetachEventHandlers();
        }
      },

      /**
       * @ignore
       * @protected
       * @memberof! oj.inputBase
       * @override
       */
      // eslint-disable-next-line no-unused-vars
      _setOption: function (key, value, flags) {
        // save off old value before we update this.options in super
        // so we can compare old with new option value.
        const oldValue = this.options[key];
        var retVal = this._superApply(arguments);
        switch (key) {
          case 'disabled':
          case 'readOnly':
            this._processOptions(key, value);
            break;
          case 'pattern':
            this._defaultRegExpValidator.regexp = this._getImplicitRegExpValidator();
            this._AfterSetOptionValidators();
            break;
          case 'labelledBy': {
            // pass in old option value and new option value for labelledBy
            this._setLabelledByForInputBase(oldValue, value);
            break;
          }
          default:
            break;
        }
        return retVal;
      },
      /**
       * Performs post processing after _SetOption() is called. Different options when changed perform
       * different tasks. See _AfterSetOption[OptionName] method for details.
       *
       * @param {string} option
       * @param {Object|string=} previous
       * @param {Object=} flags
       * @protected
       * @memberof! oj.inputBase
       * @instance
       */
      // eslint-disable-next-line no-unused-vars
      _AfterSetOption: function (option, previous, flags) {
        this._superApply(arguments);
        switch (option) {
          case 'readOnly':
            this._AfterSetOptionDisabledReadOnly(option, ojeditablevalue.EditableValueUtils.readOnlyOptionOptions);
            break;
          case 'required':
            this._AfterSetOptionRequired(option);
            break;
          case 'validators':
            this._AfterSetOptionValidators(option);
            break;
          case 'asyncValidators':
            this._AfterSetOptionAsyncValidators(option);
            break;
          case 'converter':
            this._AfterSetOptionConverter(option);
            break;
          case 'length':
            this._AfterSetOptionLength(this.options.length);
            break;
          default:
            break;
        }
      },

      /**
       * Checks if the component has length attribute
       *
       * @protected
       * @memberof oj.ojInputBase
       * @instance
       */
      _hasMaxLength: function () {
        return this.options.length && this.options.length.max && !isNaN(this.options.length.max);
      },

      /**
       * Sets up the labelledBy changes when labelledBy option changes.
       * This is overridden for the datepicker and datetimepicker since
       * the way you link up label to the component is like the 'set' components.
       * aria-labelledby.
       *
       * @protected
       * @memberof oj.ojInputBase
       * @instance
       */
      _setLabelledByForInputBase: function (oldValue, labelledBy) {
        if (labelledBy) {
          const id = this._GetContentElement()[0].id;
          this._labelledByUpdatedForInputComp(labelledBy, id);
        }
      },

      /**
       * Initializes labelledBy.
       * This is overridden for the datepicker and datetimepicker since
       * the way you link up label to the component is like the 'set' components.
       * aria-labelledby.
       *
       * @protected
       * @memberof oj.ojInputBase
       * @instance
       */
      _initLabelledByForInputBase: function (labelledBy) {
        this._initInputIdLabelForConnection(
          this._GetContentElement()[0],
          this.widget()[0].id,
          labelledBy
        );
      },

      /**
       * Filters input text based on length.max value and set to the component
       *
       * @protected
       * @memberof oj.ojInputBase
       * @instance
       */
      _filterTextOnValueChange: function () {
        if (this.options.length.max) {
          var currentVal = this.options.rawValue;
          var proposedVal = this.options.value;
          this._filterTextAndSetValues(currentVal, proposedVal, true, false);
        }
      },

      /**
       * @ignore
       * @protected
       * @memberof! oj.inputBase
       * @override
       */
      _destroy: function () {
        var ret = this._superApply(arguments);

        this.element.off('blur drop keydown keyup compositionstart compositionend input');

        if (this._inputHelper) {
          this._inputHelper.remove();
        }

        // unwrap only for non custom elements.
        // for custom elements, the wrapper is created by apps. So no need to replace it with input.
        if (this._DoWrapElement() && !this._IsCustomElement()) {
          //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
          if (this._DoWrapElementAndTriggers()) {
            DomUtils.unwrap(this.element, this._wrapper);
          } else {
            DomUtils.unwrap(this.element);
          }
        }

        return ret;
      },

      /**
       *
       * @protected
       * @override
       * @instance
       * @memberof! oj.inputBase
       */
      _SetLoading: function () {
        this._super();
        // don't want to type into the field when it is loading.
        this.element.prop('readonly', true);
      },

      /**
       *
       * @protected
       * @override
       * @instance
       * @memberof! oj.inputBase
       */
      _ClearLoading: function () {
        this._super();
        this.element.prop('readonly', this.options.readOnly);
      },

      _attachDetachEventHandlers: function () {
        if (!this.options.readOnly && !this.options.disabled) {
          this._eventHandlers = {};

          var blurHandler = $.proxy(this._onBlurHandler, this);
          var keyDownHandler = $.proxy(this._onKeyDownHandler, this);
          var keyUpHandler = $.proxy(this._onKeyUpHandler, this);
          var compositionStartHandler = $.proxy(this._onCompositionStartHandler, this);
          var compositionEndHandler = $.proxy(this._onCompositionEndHandler, this);
          var inputHandler = $.proxy(this._onInputHandler, this);
          var dropHandler = function () {
            this.focus();
          };

          this.element.on(this._BLUR_HANDLER_KEY, blurHandler);
          this.element.on(this._KEYDOWN_HANDLER_KEY, keyDownHandler);
          this.element.on(this._KEYUP_HANDLER_KEY, keyUpHandler);
          this.element.on(this._COMPOSITIONSTART_HANDLER_KEY, compositionStartHandler);
          this.element.on(this._COMPOSITIONEND_HANDLER_KEY, compositionEndHandler);
          this.element.on(this._INPUT_HANDLER_KEY, inputHandler);

          // other than FF when a drop is dispatched focus is placed back on the element
          // this would cause difference in behavior of the observable change [as set within blur], so in order to provide
          // consisteny placing the focus on the element after the drop
          this.element.on(this._DROP_HANDLER_KEY, dropHandler);

          this._eventHandlers[this._BLUR_HANDLER_KEY] = blurHandler;
          this._eventHandlers[this._KEYDOWN_HANDLER_KEY] = keyDownHandler;
          this._eventHandlers[this._KEYUP_HANDLER_KEY] = keyUpHandler;
          this._eventHandlers[this._COMPOSITIONSTART_HANDLER_KEY] = compositionStartHandler;
          this._eventHandlers[this._COMPOSITIONEND_HANDLER_KEY] = compositionEndHandler;
          this._eventHandlers[this._INPUT_HANDLER_KEY] = inputHandler;
          this._eventHandlers[this._DROP_HANDLER_KEY] = dropHandler;
        } else if (this._eventHandlers) {
          // meaning either it is readOnly or is disabled, remove the handlers if they were attached previously
          var eventEntries = [
            this._BLUR_HANDLER_KEY,
            this._KEYDOWN_HANDLER_KEY,
            this._KEYUP_HANDLER_KEY,
            this._COMPOSITIONSTART_HANDLER_KEY,
            this._COMPOSITIONEND_HANDLER_KEY,
            this._INPUT_HANDLER_KEY,
            this._DROP_HANDLER_KEY
          ];

          for (var i = 0, j = eventEntries.length; i < j; i++) {
            if (this._eventHandlers[eventEntries[i]]) {
              this.element.off(eventEntries[i], this._eventHandlers[eventEntries[i]]);
              delete this._eventHandlers[eventEntries[i]];
            }
          }
        }
      },

      /**
       * when below listed options are passed to the component, corresponding CSS will be toggled
       * @private
       * @memberof! oj.inputBase
       * @const
       * @type {Object}
       */
      _OPTION_TO_CSS_MAPPING: {
        readOnly: 'oj-read-only'
      },

      /**
       * Performs the attribute check/set by using _ATTR_CHECK variable [i.e. ojInputText must have type be set to "text"].
       *
       * @private
       * @memberof! oj.inputBase
       */
      _processAttrCheck: function () {
        var attrCheck = this._ATTR_CHECK;

        for (var i = 0, j = attrCheck.length; i < j; i++) {
          var attr = attrCheck[i].attr;
          var setMandatoryExists = 'setMandatory' in attrCheck[i];

          // if it doesn't exist just have to check whether one should set it to a mandatory value
          if (setMandatoryExists) {
            this.element.attr(attr, attrCheck[i].setMandatory); // @HTMLUpdateOK
          }
        }
      },

      /**
       * Invoked when blur is triggered of the this.element
       *
       * @ignore
       * @protected
       * @memberof! oj.inputBase
       * @param {Event} event
       */
      _onBlurHandler: function (event) {
        this._SetValue(this._GetDisplayValue(), event);
      },

      /**
       * Invoked when keydown is triggered of the this.element
       *
       * @ignore
       * @protected
       * @memberof! oj.inputBase
       * @param {Event} event
       */
      // eslint-disable-next-line no-unused-vars
      _onKeyDownHandler: function (event) {},

      /**
       * Invoked when keyup is triggered of the this.element
       *
       * When of keyCode is of Enter, invoke _SetValue on it
       *
       * @ignore
       * @protected
       * @memberof! oj.inputBase
       * @param {Event} event
       */
      _onKeyUpHandler: function (event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
          this._SetValue(this._GetDisplayValue(), event);
        }
      },

      /**
       * Invoked when the compositionstart event happens
       *
       * @ignore
       * @protected
       * @memberof! oj.inputBase
       * @param {Event} event
       */
      _onCompositionStartHandler: function () {
        // Keep track of whether the user is composing a character
        this._isComposing = true;
      },

      /**
       * Invoked when the compositionend event happens
       *
       * @ignore
       * @protected
       * @memberof! oj.inputBase
       * @param {Event} event
       */
      _onCompositionEndHandler: function (event) {
        this._isComposing = false;

        // On some browsers, compositionend event is fired before the final input event,
        // while it's the other way around on other browsers.  Just update rawValue here
        // anyway since _SetRawValue will compare the value before actually updating it.
        this._SetRawValue(this._GetContentElement().val(), event);

        // For languages like Japanese/Chinese, we need to update the counter once composing is over.
        if (this._hasMaxLength()) {
          this._onInputHandler(event);
        }
      },

      /**
       * Invoked when the input event happens
       *
       * @ignore
       * @protected
       * @memberof! oj.inputBase
       * @param {Event} event
       */
      _onInputHandler: function (event) {
        // Update rawValue only if the user is not in the middle of composing a character.
        // Non-latin characters can take multiple keystrokes to compose one character.
        // The keystroke sequence is bracketed by compositionstart and compositionend events,
        // and each keystroke also fires the input event.  Including the intermediate input
        // in rawValue makes it hard to do meaningful validation.
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
        if (!this._isComposing || this._isAndroidDevice) {
          if (this._hasMaxLength()) {
            // JET-35424 - Text Area - Pasting a value that exceeds the character limit,
            // should be truncated
            // pass the pasted text as both the current and proposed values so that even if it
            // exceeds the max length, it will be truncated and set
            var text = this._GetContentElement().val();
            this._filterTextAndSetValues(text, text, false, true);
          } else {
            this._SetRawValue(this._GetContentElement().val(), event);
          }
        }
      },

      /**
       * Whether the this.element should be wrapped in a root dom element.
       * Method so that additional conditions can be placed
       *
       * @ignore
       * @protected
       * @memberof! oj.inputBase
       * @return {boolean}
       */
      _DoWrapElement: function () {
        return this._WIDGET_CLASS_NAMES;
      },

      /**
       * Whether the this.element and triggers should be wrapped.
       * Method so that additional conditions can be placed
       *
       * @ignore
       * @protected
       * @memberof! oj.inputBase
       * @return {boolean}
       */
      _DoWrapElementAndTriggers: function () {
        return this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES;
      },

      /**
       * Wraps the this.element and adds _ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES classes to the wrapped element.
       * We might need this extra wrapper if the component has input+triggers (like inputDate).
       *
       * @protected
       * @ignore
       * @memberof! oj.inputBase
       * @return {Element}
       */
      _CreateContainerWrapper: function () {
        var wrapper = document.createElement('div');
        wrapper.setAttribute('role', 'presentation');
        wrapper.className = this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES;
        return wrapper;
      },

      /**
       * In some complex components [i.e. datepicker], when the input element receives focus we wish to have Jaws read
       * out some content.
       *
       * For those case does this method exist.
       *
       * @protected
       * @instance
       * @memberof! oj.inputBase
       */
      _AppendInputHelper: function () {
        if (this._INPUT_HELPER_KEY && this._DoWrapElement()) {
          var describedBy = this.element.attr('aria-describedby') || '';
          var helperDescribedById = this._GetSubId(this._INPUT_HELPER_KEY);

          describedBy += ' ' + helperDescribedById;
          this.element.attr('aria-describedby', describedBy);
          this._inputHelper = $(
            "<div class='oj-helper-hidden-accessible' aria-hidden='true' id='" +
              helperDescribedById +
              "'>" +
              this._EscapeXSS(this.getTranslatedString(this._INPUT_HELPER_KEY)) +
              '</div>'
          );

          this._AppendInputHelperParent().append(this._inputHelper); // @HTMLUpdateOK append action of the div element created with escaped translated text, so ok
        }
      },

      /**
       * The aria-live helper div for accessibility cases that need to announce dynamic content to the AT user.
       * Includes a polite and assertive div
       * Currently, we only append this for components that have a length.max
       *
       * @protected
       * @instance
       * @memberof! oj.inputBase
       */
      _AppendAriaLiveHelper: function () {
        var ariaLiveHelperParent = this._AppendInputHelperParent();

        // Only add the ariaLive div if there is a
        // length.max set.
        if (this.options.length && this.options.length.max) {
          var hiddendiv = document.createElement('div');
          hiddendiv.classList.add('oj-helper-hidden-accessible');
          hiddendiv.classList.add(this._TEXT_FIELD_HIDDEN_ARIA_LIVE_CLASS);
          var politeDiv = document.createElement('div');
          politeDiv.setAttribute('aria-live', 'polite');
          var assertiveDiv = document.createElement('div');
          assertiveDiv.setAttribute('aria-live', 'assertive');
          hiddendiv.appendChild(politeDiv);
          hiddendiv.appendChild(assertiveDiv);
          ariaLiveHelperParent[0].appendChild(hiddendiv);
        }
      },

      /**
       * Helper function to escape Cross site script text
       *
       * @param {string} escapeMe
       * @return {jQuery|string}
       * @memberof! oj.inputBase
       * @ignore
       */
      _EscapeXSS: function (escapeMe) {
        return $('<span>' + escapeMe + '</span>').text();
      },

      /**
       * Which parent node the inputHelper should be appended to. Usually do not need to override.
       *
       * @protected
       * @instance
       * @memberof! oj.inputBase
       */
      _AppendInputHelperParent: function () {
        return this.widget();
      },

      /**
       * Sets up a default synchronous regexp validator if pattern is set and the
       * app has not overridden the async regexp validator that JET registered.
       * If the validator is created, it is added to the
       * this._defaultRegExpValidator type->validator instance map
       *
       * @ignore
       * @protected
       * @override
       * @instance
       * @memberof! oj.inputBase
       * @return {Object} returns the implicit validators map, where the key is the
       * validator type, e.g., 'regexp'.
       */
      _GetImplicitValidators: function () {
        var ret = this._superApply(arguments);

        // register a default RegExp validator if we have a valid pattern
        if (this.options.pattern) {
          var validator = this._getImplicitRegExpValidator();
          this._defaultRegExpValidator.regexp = validator;
        }
        return Object.assign(this._defaultRegExpValidator, ret);
      },

      /**
       * Whether the a value can be set on the component. For example, if the component is
       * disabled or readOnly then setting value on component is a no-op.
       *
       * @see #_SetValue
       * @return {boolean}
       * @memberof! oj.inputBase
       * @override
       * @instance
       * @protected
       */
      _CanSetValue: function () {
        var readOnly;
        var superCanSetValue = this._super();

        if (!superCanSetValue) {
          return false;
        }

        readOnly = this.options.readOnly || false;
        return !readOnly;
      },
      /**
       * Toggles css selector on the widget. E.g., when readonly property changes,
       * the oj-read-only selector needs to be toggled.
       * @param {string} option
       * @param {Object|string} value
       * @memberof! oj.inputBase
       * @private
       */
      _refreshStateTheming: function (option, value) {
        if (Object.keys(this._OPTION_TO_CSS_MAPPING).indexOf(option) !== -1) {
          // value is a boolean
          this.widget().toggleClass(this._OPTION_TO_CSS_MAPPING[option], !!value);
        }
      },

      /**
       * Returns the regexp validator instance or creates it if needed and caches it.
       * @private
       * @memberof! oj.inputBase
       */
      _getImplicitRegExpValidator: function () {
        if (!this.options.pattern) {
          return null;
        }
        var regexpOptions = { pattern: this.options.pattern, label: this._getLabelText() };

        $.extend(regexpOptions, this.options.translations.regexp || {});
        var regexpValidator = new RegExpValidator(regexpOptions);

        return regexpValidator;
      },

      /**
       * Return the element on which aria-label can be found.
       * Usually this is the root element, but some components have aria-label as a transfer attribute,
       * and aria-label set on the root element is transferred to the inner element.
       * @memberof! oj.inputBase
       * @instance
       * @protected
       */
      _GetAriaLabelElement: function () {
        return this.element[0];
      },

      /**
       * This helper function will generate ids using widget's uuid as unique identifier for
       * wai-aria and other necessary ids
       *
       * @ignore
       * @protected
       * @param {string} sub
       * @return {string}
       * @memberof! oj.inputBase
       */
      _GetSubId: function (sub) {
        return this.uuid + '_' + sub;
      },

      /**
       * @ignore
       * @protected
       * @return {boolean}
       * @memberof! oj.inputBase
       */
      _IsRTL: function () {
        return this._rtl;
      },

      /**
       * Returns if the element is a text field element or not.
       * @memberof oj.ojInputBase
       * @instance
       * @protected
       * @return {boolean}
       */
      _IsTextFieldComponent: function () {
        return true;
      },

      /**
       * Wrappers the input component "content element".
       * @ignore
       * @protected
       * @memberof oj.ojInputBase
       * @instance
       */
      _GetContentWrapper: function () {
        var contentElement = this._GetContentElement()[0];
        if (!contentElement.parentElement.classList.contains('oj-text-field-middle')) {
          var containerElement = document.createElement('DIV');
          containerElement.classList.add('oj-text-field-middle');
          contentElement.parentElement.insertBefore(containerElement, contentElement);
          containerElement.appendChild(contentElement);
        }

        return contentElement.parentElement;
      },

      /**
       * Removes the previous lengthFilter instance and creates a new one with new length filter options
       * @memberof oj.ojInputBase
       * @instance
       * @protected
       * @ignore
       */
      _resetLengthFilter: function (lengthOptions) {
        this.lengthFilter = new LengthFilter(lengthOptions);
      },

      /**
       * Refresh the input element value based on the newly set filter options.
       * @memberof oj.ojInputBase
       * @instance
       * @protected
       * @ignore
       */
      _AfterSetOptionLength: function (lengthOptions) {
        if (lengthOptions.max) {
          this._resetLengthFilter(lengthOptions);
          var wrapperElem = this._GetContentWrapper();
          var currentVal;
          if (wrapperElem.parentElement.parentNode.classList.contains('oj-complete')) {
            currentVal = this.element[0].value;
          } else {
            currentVal = this.options.value;
          }
          this._filterTextAndSetValues(currentVal, currentVal, true, false);
        }
        this._processLengthCounterAttr(lengthOptions.counter);
      },

      /**
       * Creates a click handler method that is bound to 'this' object
       * @memberof oj.ojInputBase
       * @instance
       * @protected
       * @ignore
       */
      _setFocusOnTextAreaBind: function () {
        this._setFocusOnTextArea = function () {
          this.element[0].focus();
        }.bind(this);
      },

      /**
       *
       * Processes the length attribute set on the component
       * @memberof oj.ojInputBase
       * @instance
       * @protected
       * @ignore
       */
      _processLengthCounterAttr: function (lengthCounterAttr) {
        var wrapperElem = this._GetContentWrapper().parentElement;
        var counterEl = wrapperElem.querySelector('.' + this._TEXT_FIELD_COUNTER_CLASS);
        var hiddenAriaLiveEl = wrapperElem.parentNode.querySelector(
          '.' + this._TEXT_FIELD_HIDDEN_ARIA_LIVE_CLASS
        );
        var textLength = this.lengthFilter ? this.lengthFilter.calcLength(this.options.rawValue) : -1;
        var remainingChars = '';
        var newAriaLiveContent = '';

        if (
          lengthCounterAttr === 'none' ||
          lengthCounterAttr === undefined ||
          lengthCounterAttr === null ||
          this.options.length.max === 0 ||
          this.options.disabled ||
          this.options.readOnly
        ) {
          // remove the icon if it is there
          if (counterEl) {
            counterEl.removeEventListener(this._CLICK_HANDLER_KEY, this._setFocusOnTextArea);
            wrapperElem.removeChild(counterEl);
          }
          this._counterSpanEl = null;

          // remove the aria live text if textLength === -1 or length.max === 0 or
          // options.disabled or options.readOnly are true
          if (
            textLength === -1 ||
            this.options.length.max === 0 ||
            this.options.disabled ||
            this.options.readOnly
          ) {
            newAriaLiveContent = '';
          } else {
            remainingChars = this.options.length.max - textLength;

            // update aria live
            newAriaLiveContent = this.getTranslatedString(this._TEXT_FIELD_MAX_LENGTH_REMAINING_KEY, {
              chars: remainingChars
            });
          }
        } else {
          if (counterEl === null) {
            var textFieldCounter = document.createElement('div');
            textFieldCounter.className = this._TEXT_FIELD_COUNTER_CLASS;
            if (this._TEXTAREA_COUNTER_CONTAINER) {
              textFieldCounter.className += ' ' + this._TEXTAREA_COUNTER_CONTAINER;
            }

            counterEl = document.createElement('span');
            if (this._INPUTTEXT_COUNTER_EL) {
              counterEl.className += ' ' + this._INPUTTEXT_COUNTER_EL;
            }

            if (this._TEXTAREA_COUNTER_EL) {
              counterEl.className += ' ' + this._TEXTAREA_COUNTER_EL;
              this._setFocusOnTextAreaBind();
              textFieldCounter.addEventListener(this._CLICK_HANDLER_KEY, this._setFocusOnTextArea);
            }

            textFieldCounter.appendChild(counterEl);
            wrapperElem.appendChild(textFieldCounter);
            this._counterSpanEl = counterEl;
            this._counterSpanEl.textContent = '';
          }

          // if textLength isn't -1, which means there is a length filter, we update the aria-live
          // characters remaining.
          if (textLength !== -1) {
            remainingChars = this.options.length.max - textLength;

            // update aria live
            newAriaLiveContent = this.getTranslatedString(this._TEXT_FIELD_MAX_LENGTH_REMAINING_KEY, {
              chars: remainingChars
            });
          }
        }

        // If we have an active counter span, update it.
        if (this._counterSpanEl) {
          this._counterSpanEl.textContent = remainingChars;
        }

        // Update the aria live element if it exists and the new content is different
        if (hiddenAriaLiveEl) {
          // Only update the aria-live div when the user has paused for more than
          // 500 milliseconds. That way, we avoid queued up aria-live messages which
          // would be annoying and not helpful. The 500ms was agreed upon in the
          // accessibility review meeting.
          // We're going to do this in a cancellable setTimeout and only update
          // this when the timeout resolves.  If new aria live content is available
          // before the timeout resolves, cancel the timeout and start a new setTimeout.
          if (this._ariaLiveTimer) {
            clearTimeout(this._ariaLiveTimer);
          }
          this._ariaLiveTimer = setTimeout(() => {
            var politeDiv = hiddenAriaLiveEl.children[0];
            politeDiv.textContent = newAriaLiveContent;
            this._ariaLiveTimer = null;
          }, 500); // wait 500 milliseconds before updating aria live polite div
        }
      },

      /**
       * @memberof oj.ojInputBase
       * @instance
       * @protected
       * @ignore
       * @param {string} currentVal Current value of the text field
       * @param {string} proposedVal Proposed value of the text field
       * @param {boolean} setValue Whether to set component value or not
       * @param {boolean} processLengthCounter whether to process length counter or not
       */
      _filterTextAndSetValues(currentVal, proposedVal, setValue, processLengthCounter) {
        var filteredText = this.lengthFilter.filter(currentVal, proposedVal);
        this._SetRawValue(filteredText, null);
        this._SetDisplayValue(filteredText, null);
        var wrapperElem = this._GetContentWrapper().parentElement;
        var hiddenAriaLiveEl = wrapperElem.parentNode.querySelector(
          '.' + this._TEXT_FIELD_HIDDEN_ARIA_LIVE_CLASS
        );

        // If the proposed value is longer than the filtered text, then the length has exceeded
        // the max length and we need to update the aria live div with an error message.
        // Otherwise, remove clear the text from the assertiveDiv.
        if (hiddenAriaLiveEl) {
          var assertiveDiv = hiddenAriaLiveEl.children[1];

          // Both filteredText and proposedVal can be null
          var filteredTextLen = filteredText ? filteredText.length : 0;
          var proposedValLen = proposedVal ? proposedVal.length : 0;
          if (filteredTextLen < proposedValLen) {
            assertiveDiv.textContent = ''; // Clear it first, so we always hear this message.
            assertiveDiv.textContent = this.getTranslatedString(
              this._TEXT_FIELD_MAX_LENGTH_EXCEEDED_KEY,
              { len: this.options.length.max }
            );
          } else if (this.lastFilteredText !== proposedVal) {
            // We don't clear the error message if nothing has changed.
            assertiveDiv.textContent = '';
          }
        }

        this.lastFilteredText = filteredText;

        if (setValue) {
          this._SetValue(this.lastFilteredText);
        }
        if (processLengthCounter) {
          this._processLengthCounterAttr(this.options.length.counter);
        }
      },

      /**
       * <p>Refreshes the component.  Usually called after dom changes have been made.
       *
       * @example <caption>Refresh component after dome changes have been made.</caption>
       * // refresh component.
       * myComp.refresh();

       * @expose
       * @memberof oj.inputBase
       * @ojshortdesc Refreshes the component.
       * @public
       * @return {void}
       * @instance
       */
      refresh: function () {
        var retVal = this._superApply(arguments);

        this._rtl = this._GetReadingDirection() === 'rtl';

        this._refreshRequired(this.options.required);

        return retVal;
      },
      /**
       * @memberof! oj.inputBase
       * @instance
       * @private
       */
      _refreshRequired: ojeditablevalue.EditableValueUtils._refreshRequired,
      /**
       * @memberof! oj.inputBase
       * @instance
       * @private
       */
      _labelledByUpdatedForInputComp: ojeditablevalue.EditableValueUtils._labelledByUpdatedForInputComp,
      /**
       * @memberof! oj.inputBase
       * @instance
       * @private
       */
      _initInputIdLabelForConnection: ojeditablevalue.EditableValueUtils._initInputIdLabelForConnection,
      /**
       * @memberof! oj.inputBase
       * @instance
       * @private
       */
      _linkLabelForInputComp: ojeditablevalue.EditableValueUtils._linkLabelForInputComp,
      /**
       * the validate method from v3.x that returns a boolean
       * @memberof! oj.inputBase
       * @instance
       * @protected
       * @ignore
       */
      _ValidateReturnBoolean: ojeditablevalue.EditableValueUtils._ValidateReturnBoolean,

      /**
       * the validate method that returns a Promise
       * @memberof! oj.inputBase
       * @instance
       * @protected
       * @ignore
       */
      _ValidateReturnPromise: ojeditablevalue.EditableValueUtils._ValidateReturnPromise,

      getNodeBySubId: function (locator) {
        return this._super(locator);
      },

      /**
       * Validates the component's display value using the converter and all validators registered on
       * the component and updates the <code class="prettyprint">value</code> option by performing the
       * following steps.
       *
       * <p>
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
       * // validate display value and shows messages if there are any to be shown.
       * myComp.validate();
       * @example <caption>Validate component and use the Promise's resolved state.</caption>
       * myComp.validate().then(
       *  function(result) {
       *    if(result === "valid")
       *    {
       *      submitForm();
       *    }
       *  });
       * @return {Promise.<string>} Promise resolves to "valid" if there were no converter parse errors and
       * the component passed all validations.
       * The Promise resolves to "invalid" if there were converter parse errors or
       * if there were validation errors.
       * @ojsignature {target: "Type", value: "Promise<'valid'|'invalid'>", for : "returns"}
       *
       *
       * @method
       * @access public
       * @expose
       * @memberof oj.inputBase
       * @ojshortdesc Validates the component's display value using all converters and validators registered on the component. If there are no validation errors. then the value is updated. See the Help documentation for more information.
       * @instance
       * @since 4.0.0
       *
       */
      validate: ojeditablevalue.EditableValueUtils.validate,

      /**
       * Called to find out if aria-required is unsupported.
       * @memberof! oj.inputBase
       * @instance
       * @protected
       */
      _AriaRequiredUnsupported: function () {
        return false;
      },
      /**
       * Returns a <code class="prettyprint">jQuery</code> object containing the element visually
       * representing the component, excluding the label associated with the it.
       *
       * <p>This method does not accept any arguments.</p>
       *
       * @expose
       * @memberof! oj.inputBase
       * @instance
       * @return {jQuery} the root of the component
       * @ignore
       *
       * @example <caption>Invoke the <code class="prettyprint">widget</code> method:</caption>
       * var widget = $( ".selector" ).ojFoo( "widget" ); // Foo is InputText, InputPassword, TextArea
       */
      widget: function () {
        return this._DoWrapElement() ? this._wrapper : this.element;
      }
    },
    true
  );

  /**
   * @ojcomponent oj.ojInputPassword
   * @augments oj.inputBase
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojInputPassword<V = string> extends inputBase<V, ojInputPasswordSettableProperties<V>>",
   *                genericParameters: [{"name": "V", "description": "Type of value of the component"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojInputPasswordSettableProperties<V = string> extends inputBaseSettableProperties<V>",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @since 0.6.0
   * @ojshortdesc An input password allows the user to enter a password.
   * @ojrole textbox
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "maskIcon", "required", "disabled", "readonly"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-text-input-password'
   * @ojuxspecs ['input-password']
   *
   * @classdesc
   * <h3 id="inputPasswordOverview-section">
   *   JET InputPassword Component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputPasswordOverview-section"></a>
   * </h3>
   *
   * <p>Description: The oj-input-password component enhances a browser input type="password" element.
   *
   * <pre class="prettyprint"><code>&lt;oj-input-password>&lt;/oj-input-password></code></pre>
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
   * {@ojinclude "name":"accessibilityLabelEditableValue"}
   * {@ojinclude "name":"accessibilityPlaceholderEditableValue"}
   * {@ojinclude "name":"accessibilityDisabledEditableValue"}
   * </p>
   * <h3 id="migration-section">
   *   Migration
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
   * </h3>
   *
   * <p>
   * To migrate from oj-input-password to oj-c-input-password, you need to revise the import statement
   * and references to oj-c-input-password in your app. Please note the changes between the two components below.
   * </p>
   *
   * <h5>Converter attribute</h5>
   * <p>
   * The converter attribute is changed to support only a converter instance, null, or undefined. It does not support
   * a Promise that resolves to a converter instance. The application should resolve the promise and then update the
   * converter attribute with the resolved converter instance.
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
   * <h5>MaskIcon attribute</h5>
   * <p>
   * The default value of the mask-icon attribute is changed from 'hidden' to 'visible'.
   * </p>
   *
   * <h5>TextAlign attribute</h5>
   * <p>
   * The usage of the style classes: oj-form-control-text-align-right, oj-form-control-text-align-start and oj-form-control-text-align-end is now
   * replaced with this attribute. The value of this attribute maps to these style classes as shown below:
   * <ul>
   * <li>
   * .oj-form-control-text-align-right maps to 'right'
   * </li>
   * <li>
   * .oj-form-control-text-align-start maps to 'start'
   * </li>
   * <li>
   * .oj-form-control-text-align-end maps to 'end'
   * </li>
   * </ul>
   * </p>
   * <h5>Translations attribute</h5>
   * <p>
   * <p>
   * The translations.required.message-detail attribute has changed to required-message-detail.
   * </p>
   *
   * <h5>Value attribute</h5>
   * <p>
   * Clearing the field and committing the value will now set the value attribute to <code>null</code>
   * instead of <code>''</code>.
   * </p>
   *
   * <h5>Refresh method</h5>
   * <p>
   * The refresh method is no longer supported. The application should no longer need to use this method. If the application
   * wants to reset the component (remove messages and reset the value of the component), please use the reset method.
   * </p>
   *
   * <h5>Reset method</h5>
   * <p>
   * This method does not synchronously reset the component. The application should wait on the busy context of the component after
   * invoking this method for the changes to appear.
   * </p>
   *
   * <h5>ShowMessages method</h5>
   * <p>
   * This method does not synchronously show the hidden messages of the component. The application should wait on the busy context
   * of the component after invoking this method for the changes to appear.
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
   * The application should no longer need to use an &lt;oj-label-value> component to layout the form component. The application
   * can use the label-edge attribute and label-start-width attribute to customize the label position and label width (only when using start label).
   * </p>
   *
   * <h5>User Assistance Density - Compact mode</h5>
   * <p>
   * Rendering the component in compact userAssistanceDensity mode is not supported in this release. Please use 'reflow' or 'efficient' instead.
   * </p>
   *
   * <h5>Usage in Dynamic Form</h5>
   * <p>
   * Using the component in oj-dyn-form is not supported in this release, use oj-dynamic-form instead.
   * </p>
   *
   * @example <caption>Initialize the oj-input-password element with no attributess specified:</caption>
   * &lt;oj-input-password>&lt;/oj-input-password>
   *
   * @example <caption>Initialize the oj-input-password element with some attributes:</caption>
   * &lt;oj-input-password id="pwdId" disabled>&lt;/oj-input-password>
   *
   * @example <caption>Initialize a component attribute via component binding:</caption>
   * &lt;oj-input-password id="pwdId" value="{{currentValue}}">&lt;/oj-input-password>
   */
  // --------------------------------------------------- oj.ojInputPassword Styling Start ------------------------------------------------------------
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
   * @memberof oj.ojInputPassword
   * @ojtsexample
   * &lt;oj-input-password class="oj-form-control-full-width">
   * &lt;/oj-input-password>
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
   * @memberof oj.ojInputPassword
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-input-password class="oj-form-control-max-width-md">&lt;/oj-input-password>
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-sm
   * @ojshortdesc Sets the max width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojInputPassword
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-md
   * @ojshortdesc Sets the max width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojInputPassword
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
   * @memberof oj.ojInputPassword
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-input-password class="oj-form-control-width-md">&lt;/oj-input-password>
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-sm
   * @ojshortdesc Sets the width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojInputPassword
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-md
   * @ojshortdesc Sets the width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojInputPassword
   */
  // --------------------------------------------------- oj.ojInputPassword Styling end ------------------------------------------------------------
  oj.__registerWidget('oj.ojInputPassword', $.oj.inputBase, {
    version: '1.0.0',
    defaultElement: '<input>',
    widgetEventPrefix: 'oj',

    /**
     * @expose
     * @private
     * @memberof! oj.ojInputPassword
     */
    _ATTR_CHECK: [{ attr: 'type', setMandatory: 'password' }],

    /**
     * @expose
     * @private
     * @memberof! oj.ojInputPassword
     */
    _CLASS_NAMES: 'oj-inputpassword-input',

    /**
     * @expose
     * @private
     * @memberof! oj.ojInputPassword
     */
    _WIDGET_CLASS_NAMES: 'oj-inputpassword oj-form-control oj-component',

    _INPUT_CONTAINER_CLASS: 'oj-text-field-container',

    _MASK_ICON_SHOW_PASSWORD_LABEL_KEY: 'accessibleShowPassword',
    _MASK_ICON_HIDE_PASSWORD_LABEL_KEY: 'accessibleHidePassword',

    options: {
      /**
       * @expose
       * @access public
       * @instance
       * @memberof! oj.ojInputPassword
       * @type {Object|null}
       * @ignore
       */
      converter: null,
      /**
       * The mask icon is used to mask or unmask the visibility of the password. The password
       * always starts out masked, but using the mask icon the user can toggle the visibility
       * of the password so that it can be read.  The <code class="prettyprint">mask-icon</code>
       * attribute is used to make the mask icon visible or hidden.  If it is hidden, then the
       * user has no way to toggle the visibility of the password.
       *
       * @expose
       * @memberof! oj.ojInputPassword
       * @instance
       * @type {string}
       * @ojvalue {string} "hidden" The mask visibility icon is never visible
       * @ojvalue {string} "visible" The mask visibility icon is always visible
       * @default "hidden"
       */
      maskIcon: 'hidden',
      /**
       * Regular expression pattern which will be used to validate the component's value.
       * <p>
       * When pattern is set to true, an implicit regExp validator is created using
       * the RegExpValidator -
       * <code class="prettyprint">new RegExpValidator()</code>.
       * </p>
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">pattern</code> attribute:</caption>
       * &lt;oj-input-password pattern="[a-zA-Z0-9]{3,}">&lt;/oj-input-password><br/>
       *
       * @example <caption>Get or set the <code class="prettyprint">pattern</code> property after initialization:</caption>
       * // getter
       * var pattern = myComp.pattern;
       *
       * // setter
       * myComp.pattern = "[0-9]{3,}";
       *
       * @expose
       * @instance
       * @memberof! oj.ojInputPassword
       * @type {string|undefined}
       * @ignore
       */
      pattern: '',
      /**
       * The value of the component. Value must be a string or null.
       *
       * <p>
       * When <code class="prettyprint">value</code> property changes due to programmatic
       * intervention, the component always clears all messages
       * including <code class="prettyprint">messagesCustom</code>, runs deferred validation, and
       * always refreshes UI display value.</br>
       *
       * <h4>Running Validation</h4>
       * <ul>
       * <li>component always runs deferred validation; if there is a validation error the
       * <code class="prettyprint">valid</code> property is updated.</li>
       * </ul>
       * </p>
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">value</code> attribute specified:</caption>
       * &lt;oj-input-password value='12345'>&lt;/oj-input-password>
       * @example <caption>Get or set <code class="prettyprint">value</code> attribute, after initialization:</caption>
       * // Getter: returns 10
       * var val = myComp.value;
       * // Setter: sets 20
       * myComp.value = 20;
       *
       * @expose
       * @access public
       * @instance
       * @default null
       * @ojwriteback
       * @ojeventgroup common
       * @memberof oj.ojInputPassword
       * @type {string|null}
       * @ojsignature { target: "Type",
       *                value: "V|null"}
       */
      value: undefined

      // Events

      /**
       * Triggered when the ojInputPassword is created.
       *
       * @event
       * @name create
       * @memberof oj.ojInputPassword
       * @instance
       * @property {Event} event event object
       * @property {Object} ui Currently empty
       * @ignore
       *
       * @example <caption>Initialize the ojInputPassword with the <code class="prettyprint">create</code> callback specified:</caption>
       * $( ".selector" ).ojInputPassword({
       *     "create": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
       * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
       */
      // create event declared in superclass, but we still want the above API doc
    },

    /**
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojInputPassword
     */
    _ComponentCreate: function () {
      var retVal = this._super();

      // add in the mask visibility icon if needed
      this._processMaskVisibilityIcon();

      return retVal;
    },

    /**
     * Render or remove the mask visibility icon
     * @ignore
     * @private
     * @memberof oj.ojInputPassword
     * @instance
     */
    _processMaskVisibilityIcon: function () {
      var wrapperElem = this._GetContentWrapper().parentElement;
      var elem = this.element[0]; // Get the input element
      var maskVisibilityIconWrapper = wrapperElem.querySelector('span.oj-text-field-end');

      if (this.options.disabled || this.options.readOnly) {
        // remove the icon if it is there
        if (maskVisibilityIconWrapper) {
          wrapperElem.removeChild(maskVisibilityIconWrapper);
          elem.type = 'password';
        }
      } else if (maskVisibilityIconWrapper === null) {
        if (this.options.maskIcon === 'visible') {
          var maskVisibilityIcon;
          var maskVisibilityIconBtn;
          maskVisibilityIconWrapper = document.createElement('span');
          maskVisibilityIconWrapper.className = 'oj-text-field-end';
          maskVisibilityIconBtn = document.createElement('a');
          maskVisibilityIconBtn.className = 'oj-component-icon oj-clickable-icon-nocontext';

          maskVisibilityIconBtn.setAttribute(
            'aria-label',
            this.getTranslatedString(this._MASK_ICON_SHOW_PASSWORD_LABEL_KEY)
          );
          maskVisibilityIconBtn.role = 'button';

          maskVisibilityIconBtn.setAttribute('target', '_blank');
          maskVisibilityIconBtn.setAttribute('tabindex', '0');
          maskVisibilityIcon = document.createElement('span');
          maskVisibilityIcon.className = 'oj-inputpassword-show-password-icon';

          maskVisibilityIconBtn.appendChild(maskVisibilityIcon);
          maskVisibilityIconWrapper.appendChild(maskVisibilityIconBtn);
          wrapperElem.appendChild(maskVisibilityIconWrapper);

          var $maskVisIconBtn = $(maskVisibilityIconBtn);
          this._AddHoverable($maskVisIconBtn);
          this._AddActiveable($maskVisIconBtn);

          maskVisibilityIconBtn.addEventListener(
            this._CLICK_HANDLER_KEY,
            this._onMaskVisibilityIconClickHandler.bind(this)
          );
          maskVisibilityIconBtn.addEventListener(
            this._KEYDOWN_HANDLER_KEY,
            this._onMaskVisibilityIconKeyDownHandler.bind(this)
          );
        }
      } else if (this.options.maskIcon !== 'visible') {
        // The Icon is currently visible, so remove it.
        wrapperElem.removeChild(maskVisibilityIconWrapper);
        elem.type = 'password'; // Make sure we are the right type.
      }
    },

    /**
     * The handler clears the value of the input element and sets the focus on the element
     * NOTE: this handler expects the input text component to be bound to this via .bind()
     *
     * @ignore
     * @private
     * @memberof! oj.ojInputPassword
     */
    _onMaskVisibilityIconClickHandler: function () {
      var elem = this.element[0]; // Get the input element
      var wrapperElem = this._GetContentWrapper().parentElement;
      var maskVisibilityIconBtn = wrapperElem.querySelector('a.oj-component-icon');
      var maskVisibilityIcon = maskVisibilityIconBtn.children[0];

      // toggle the input type and the icon class
      if (elem.type === 'password') {
        // password is currently hidden
        elem.type = 'text';
        maskVisibilityIcon.classList.remove('oj-inputpassword-show-password-icon');
        maskVisibilityIcon.classList.add('oj-inputpassword-hide-password-icon');
        maskVisibilityIconBtn.setAttribute(
          'aria-label',
          this.getTranslatedString(this._MASK_ICON_HIDE_PASSWORD_LABEL_KEY)
        );
      } else {
        // password is currently visible
        elem.type = 'password';
        maskVisibilityIcon.classList.remove('oj-inputpassword-hide-password-icon');
        maskVisibilityIcon.classList.add('oj-inputpassword-show-password-icon');
        maskVisibilityIconBtn.setAttribute(
          'aria-label',
          this.getTranslatedString(this._MASK_ICON_SHOW_PASSWORD_LABEL_KEY)
        );
      }
    },

    /**
     * If the key code is ENTER or SPACE, we call _onMaskVisibilityIconClickHandler() to
     * toggle the mask visibility.
     *
     * @ignore
     * @private
     * @memberof! oj.ojInputPassword
     */
    _onMaskVisibilityIconKeyDownHandler: function (event) {
      if (event.altKey || event.ctrlKey) {
        return;
      }
      var keyCode = $.ui.keyCode;

      switch (event.keyCode) {
        case keyCode.SPACE:
        case keyCode.ENTER:
          this._onMaskVisibilityIconClickHandler();
          break;
        default:
      }
    },
    /**
     * Performs post processing after _SetOption() calls _superApply(). Different options, when changed, perform
     * different tasks.
     *
     * @param {string} option
     * @param {Object=} flags
     * @protected
     * @memberof oj.ojInputPassword
     * @instance
     */
    _AfterSetOption: function (option, flags) {
      this._super(option, flags);

      switch (option) {
        // all of these options potentially affect the visiblity and/or rendering of the icon
        // so we need to process the icon if any of these change.
        case 'disabled':
        case 'readOnly':
        case 'maskIcon':
          this._processMaskVisibilityIcon();
          break;
        default:
          break;
      }
    },

    /**
     * @ignore
     * @override
     * @protected
     * @memberof! oj.ojInputPassword
     * @return {boolean}
     */
    _DoWrapElementAndTriggers: function () {
      this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES = this._INPUT_CONTAINER_CLASS;
      return true;
    },

    /**
     * ojInputPassword extends from InputBase which creates a readonly div,
     * so overriding it to return false prevents ojInputPassword from creating
     * a readonly div. We do not want inputPassword to show its password in
     * plain text.
     * @ignore
     * @override
     * @protected
     * @memberof! oj.ojInputPassword
     * @return {boolean}
     */
    _UseReadonlyDiv: function () {
      return false;
    },

    getNodeBySubId: function (locator) {
      var node = this._superApply(arguments);
      var subId;
      if (!node) {
        subId = locator.subId;
        if (subId === 'oj-inputpassword-input') {
          node = this.element ? this.element[0] : null;
        }
      }
      // Non-null locators have to be handled by the component subclasses
      return node || null;
    },

    /**
     * @override
     * @instance
     * @memberof! oj.ojInputPassword
     * @protected
     * @return {string}
     */
    _GetDefaultStyleClass: function () {
      return 'oj-inputpassword';
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
   *    <tr>
   *       <td>Input</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Sets focus to input. Show user assistance text. This may be inline or in a notewindow
   * depending upon theme and property settings.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputPassword
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
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the input.
   *       Show user assistance text. This may be inline or in a notewindow
   * depending upon theme and property settings.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputPassword
   */

  // ////////////////     SUB-IDS     //////////////////
  /**
   * <p>Sub-ID for the ojInputPassword component's input element.</p>
   *
   * @ojsubid oj-inputpassword-input
   * @ignore
   * @memberof oj.ojInputPassword
   * @deprecated 4.0.0 Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
   *
   * @example <caption>Get the node for the input element:</caption>
   * var node = myComp.getNodeBySubId("oj-inputpassword-input");
   */

  /**
   * @ojcomponent oj.ojInputText
   * @augments oj.inputBase
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojInputText<V = any> extends inputBase<V, ojInputTextSettableProperties<V>>",
   *                genericParameters: [{"name": "V", "description": "Type of value of the component"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojInputTextSettableProperties<V = any> extends inputBaseSettableProperties<V>",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @since 0.6.0
   * @ojshortdesc An input text allows the user to enter a text value.
   * @ojrole textbox
   * @ojtsimport {module: "ojconverter-number", type: "AMD", imported: ["IntlNumberConverter", "NumberConverter"]}
   * @ojtsimport {module: "ojconverter-color", type: "AMD", importName: "ColorConverter"}
   * @ojtsimport {module: "ojconverter-datetime", type: "AMD",  imported: ["IntlDateTimeConverter", "DateTimeConverter"]}
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "required", "disabled", "readonly", "clearIcon", "virtualKeyboard"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-text-input'
   * @ojuxspecs ['input-text']
   *
   * @classdesc
   * <h3 id="inputTextOverview-section">
   *   JET InputText Component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputTextOverview-section"></a>
   * </h3>
   *
   * <p>Description: The oj-input-text component enhances a browser input type="text" element.
   *
   * <pre class="prettyprint"><code>&lt;oj-input-text>&lt;/oj-input-text></code></pre>
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
   * {@ojinclude "name":"accessibilityLabelEditableValue"}
   * {@ojinclude "name":"accessibilityPlaceholderEditableValue"}
   * {@ojinclude "name":"accessibilityDisabledEditableValue"}
   * </p>
   * <h3 id="migration-section">
   *   Migration
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
   * </h3>
   *
   * <p>
   * To migrate from oj-input-text to oj-c-input-text, you need to revise the import statement
   * and references to oj-c-input-text in your app. Please note the changes between the two components below.
   * </p>
   *
   * <h5>Converter attribute</h5>
   * <p>
   * The converter attribute is changed to support only a converter instance, null, or undefined. It does not support
   * a Promise that resolves to a converter instance. The application should resolve the promise and then update the
   * converter attribute with the resolved converter instance.
   * </p>
   * <p>
   * The converter is no longer applied when the value is <code>null</code>, <code>undefined</code>, or <code>''</code>.
   * <p>
   *
   * <h5>LabelEdge attribute</h5>
   * <p>
   * The enum values for the label-edge attribute have been changed from 'inside', 'provided' and 'none' to 'start', 'inside', 'top' and 'none'.
   * If you are using this component in a form layout and would like the form layout to drive the label edge of this component, leave this attribute
   * unset. The application no longer has to specify 'provided' for this attribute. If you want to override how the label is positioned, set this
   * attribute to the corresponding value.
   * </p>
   *
   * <h5>List attribute</h5>
   * <p>
   * The list attribute is no longer supported.
   * </p>
   *
   * <h5>TextAlign attribute</h5>
   * <p>
   * The usage of the style classes: oj-form-control-text-align-right, oj-form-control-text-align-start and oj-form-control-text-align-end is now
   * replaced with this attribute. The value of this attribute maps to these style classes as shown below:
   * <ul>
   * <li>
   * .oj-form-control-text-align-right maps to 'right'
   * </li>
   * <li>
   * .oj-form-control-text-align-start maps to 'start'
   * </li>
   * <li>
   * .oj-form-control-text-align-end maps to 'end'
   * </li>
   * </ul>
   * </p>
   * <h5>Translations attribute</h5>
   * <p>
   * The translations.required.message-detail attribute has changed to required-message-detail.
   * </p>
   *
   * <h5>Value attribute</h5>
   * <p>
   * Clearing the field and committing the value will now set the value attribute to <code>null</code>
   * instead of <code>''</code>.
   * </p>
   *
   * <h5>Refresh method</h5>
   * <p>
   * The refresh method is no longer supported. The application should no longer need to use this method. If the application
   * wants to reset the component (remove messages and reset the value of the component), please use the reset method.
   * </p>
   *
   * <h5>Reset method</h5>
   * <p>
   * This method does not synchronously reset the component. The application should wait on the busy context of the component after
   * invoking this method for the changes to appear.
   * </p>
   *
   * <h5>ShowMessages method</h5>
   * <p>
   * This method does not synchronously show the hidden messages of the component. The application should wait on the busy context
   * of the component after invoking this method for the changes to appear.
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
   * The application should no longer need to use an &lt;oj-label-value> component to layout the form component. The application
   * can use the label-edge attribute and label-start-width attribute to customize the label position and label width (only when using start label).
   * </p>
   *
   * <h5>User Assistance Density - Compact mode</h5>
   * <p>
   * Rendering the component in compact userAssistanceDensity mode is not supported in this release. Please use 'reflow' or 'efficient' instead.
   * </p>
   *
   * <h5>Usage in Dynamic Form</h5>
   * <p>
   * Using the component in oj-dyn-form is not supported in this release, use oj-dynamic-form instead.
   * </p>
   *
   * @example <caption>Declare the oj-input-text component with no attributes specified:</caption>
   * &lt;oj-input-text>&lt;/oj-input-text>
   *
   * @example <caption>Initialize the component with some attributes:</caption>
   * &lt;oj-input-text id="textId" disabled>&lt;/oj-input-text>
   *
   * @example <caption>Initialize a component attribute via component binding:</caption>
   * &lt;oj-input-text id="textId" value="{{currentValue}}">&lt;/oj-input-text>
   */
  // --------------------------------------------------- oj.ojInputText Styling Start ------------------------------------------------------------
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
   * @memberof oj.ojInputText
   * @ojtsexample
   * &lt;oj-input-text class="oj-form-control-full-width">
   * &lt;/oj-input-text>
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
   * @memberof oj.ojInputText
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-input-text class="oj-form-control-max-width-md">&lt;/oj-input-text>
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-sm
   * @ojshortdesc Sets the max width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojInputText
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-md
   * @ojshortdesc Sets the max width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojInputText
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
   * @memberof oj.ojInputText
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-input-text class="oj-form-control-width-md">&lt;/oj-input-text>
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-sm
   * @ojshortdesc Sets the width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojInputText
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-md
   * @ojshortdesc Sets the width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojInputText
   */

  // ---------------- oj-form-control-text-align- --------------
  /**
   * Classes that help align text of the element.
   * @ojstyleset text-align
   * @ojdisplayname Text Alignment
   * @ojstylesetitems ["text-align.oj-form-control-text-align-right", "text-align.oj-form-control-text-align-start", "text-align.oj-form-control-text-align-end"]
   * @ojstylerelation exclusive
   * @memberof oj.ojInputText
   * @ojtsexample
   * &lt;oj-input-text class="oj-form-control-text-align-right">
   * &lt;/oj-input-text>
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-right
   * @ojshortdesc Aligns the text to the right regardless of the reading direction. This is normally used for right aligning numbers.
   * @ojdisplayname Align-Right
   * @memberof! oj.ojInputText
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-start
   * @ojshortdesc Aligns the text to the left in LTR and to the right in RTL.
   * @ojdisplayname Align-Start
   * @memberof! oj.ojInputText
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-end
   * @ojshortdesc Aligns the text to the right in LTR and to the left in RTL.
   * @ojdisplayname Align-End
   * @memberof! oj.ojInputText
   */
  // ---------------- oj-text-field-start-end-icon --------------
  /**
   * Use this class on a child div element if you want an icon to display in the start or end slot of an oj-input-text element.
   * @ojstyleclass oj-text-field-start-end-icon
   * @ojdisplayname Start-End Icon
   * @ojstyleselector "oj-input-text > div"
   * @memberof oj.ojInputText
   * @ojtsexample
   * &lt;oj-input-text id="myInputText" label-hint="My label">
   *   &lt;div slot="start" :class="oj-text-field-start-end-icon oj-ux-ico-cc-card" role="img">&lt;div>
   * &lt;/oj-input-text>
   */
  // --------------------------------------------------- oj.ojInputText Styling end ------------------------------------------------------------
  oj.__registerWidget('oj.ojInputText', $.oj.inputBase, {
    version: '1.0.0',
    defaultElement: '<input>',
    widgetEventPrefix: 'oj',

    /**
     * @expose
     * @private
     */
    _ATTR_CHECK: [{ attr: 'type', setMandatory: 'text' }],

    /**
     * @expose
     * @private
     */
    _CLASS_NAMES: 'oj-inputtext-input',

    /**
     * @expose
     * @private
     */
    _WIDGET_CLASS_NAMES: 'oj-inputtext oj-form-control oj-component',

    /**
     * @private
     */
    _ALLOWED_TYPES: ['email', 'number', 'search', 'tel', 'text', 'url'],

    _CLICK_HANDLER_KEY: 'click',

    _INPUT_CONTAINER_CLASS: 'oj-text-field-container',
    _INPUTTEXT_COUNTER_EL: 'oj-inputtext-counter-el',
    _INPUTTEXT_CLEAR_ICON_KEY: 'accessibleClearIcon',

    options: {
      /**
       * @expose
       * @memberof! oj.ojInputText
       * @instance
       * @type {string}
       * @ojvalue {string} "never" The clear icon is never visible
       * @ojvalue {string} "always" The clear icon is always visible
       * @ojvalue {string} "conditional" The clear icon is visible under the following conditions:
       * if the component has a non-empty value, and it either has focus or the mouse is over the field.
       * @default "never"
       * @desc Specifies if an icon to clear the input field should be visible.
       *
       * @example <caption>Initialize the oj-input-text with the <code class="prettyprint">clear-icon</code> attribute specified:</caption>
       * &lt;oj-input-text clear-icon="conditional" id="inputcontrol">&lt;/oj-input-text>
       *
       * @example <caption>Get or set the <code class="prettyprint">clearIcon</code> property after initialization:</caption>
       * // getter
       * var clearIcon = myInputText.clearIcon;
       *
       * // setter
       * myInputText.clearIcon = 'conditional';
       */
      clearIcon: 'never',
      /**
       * A converter instance or Promise to a converter instance
       * or one that duck types {@link oj.Converter}.
       * {@ojinclude "name":"inputBaseConverterOptionDoc"}
       * <p>
       *  During validation, the converter takes the input value which is a string
       *  and parses it into the type of the component's value property
       *  (e.g. a number)
       *  before it passes it to the validator. It then takes the validated value property
       *  and formats it into a string to be displayed and puts it into the input.
       *  If the converter's format or parse functions
       *  throw an error, it will be displayed to the user inline on the field.
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
       * @example <caption>Initialize the component with a number converter instance:</caption>
       * &lt;oj-input-text converter="[[salaryConverter]]">&lt;/oj-input-text><br/>
       * // Initialize converter instance using currency options
       * var options = {style: 'currency', 'currency': 'USD', maximumFractionDigits: 0};
       * this.salaryConverter = new NumberConverter(options);
       *
       * @example <caption>Get or set the <code class="prettyprint">converter</code>
       *  property after initialization:</caption>
       * // getter
       * var converter = myComp.converter;
       *
       * // setter
       * myComp.converter = myConverter;
       * @expose
       * @access public
       * @instance
       * @memberof! oj.ojInputText
       * @ojshortdesc An object that converts the value. See the Help documentation for more information.
       * @default null
       * @ojsignature [{
       *    target: "Type",
       *    value: "Promise<oj.Converter<V>>|oj.Converter<V>|
       *            null",
       *    jsdocOverride: true},
       *    {target: "Type",
       *    value: "Promise<oj.Converter<V>>|oj.Converter<V>|
       *            oj.Validation.RegisteredConverter|
       *            null",
       *    consumedBy: 'tsdep'}]
       * @ojdeprecated {since: '8.0.0', target: 'memberType', value: ['oj.Validation.RegisteredConverter'],
       *                description:'Defining a converter with an object literal with converter type and its options
       *                  (aka JSON format) has been deprecated and does nothing. If needed, you can make the JSON format
       *                  work again by importing the deprecated module you need, like ojvalidation-base or
       *                  ojvalidation-number module.'}
       * @type {Object|null}
       */
      converter: null,
      /**
       * Indicates a list of pre-defined options to suggest to the user.
       * The value must be the id of a &lt;datalist> element in the same page.
       * This attribute is ignored when the type attribute's value is hidden.
       *
       * @example <caption>Initialize component with <code class="prettyprint">list</code> attribute:</caption>
       * &lt;oj-some-element list="sampleDataList">&lt;/oj-some-element>
       *
       * <p>Example for datalist:
       * <pre class="prettyprint">
       * <code>
       * &lt;datalist id="sampleDataList">
       *   &lt;option value="item 1">item 1&lt;/option>
       *   &lt;option value="item 2">item 2&lt;/option>
       *   &lt;option value="item 3">item 3&lt;/option>
       *   &lt;option value="item 4">item 4&lt;/option>
       * &lt;/datalist>
       * </code></pre>
       *
       * @example <caption>Get or set the <code class="prettyprint">list</code> property after initialization:</caption>
       * // getter
       * var ro = myComp.list;
       *
       * // setter
       * myComp.list = "myDataList";
       *
       * @expose
       * @instance
       * @memberof! oj.ojInputText
       * @ojshortdesc Specifies a list of pre-defined options to present to the user. See the Help documentation for more information.
       * @type {string}
       * @public
       * @ojextension {_COPY_TO_INNER_ELEM: true}
       */
      list: '',

      /**
       * Regular expression pattern which will be used to validate the component's value.
       * <p>
       * When pattern is set to a non-empty string value, an implicit regExp validator is created using
       * the RegExpValidator -
       * <code class="prettyprint">new RegExpValidator()</code>.
       * </p>
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">pattern</code> attribute:</caption>
       * &lt;oj-input-text pattern="[a-zA-Z0-9]{3,}">&lt;/oj-input-text><br/>
       *
       * @example <caption>Get or set the <code class="prettyprint">pattern</code> property after initialization:</caption>
       * // getter
       * var pattern = myComp.pattern;
       *
       * // setter
       * myComp.pattern = "[0-9]{3,}";
       *
       * @expose
       * @instance
       * @memberof! oj.ojInputText
       * @type {string|undefined}
       * @ignore
       */
      pattern: '',
      /**
       * The type of virtual keyboard to display for entering a value on mobile browsers. This attribute has no effect on desktop browsers.
       * @example <caption>Initialize the component with the <code class="prettyprint">virtual-keyboard</code> attribute:</caption>
       * &lt;oj-input-text virtual-keyboard="number">&lt;/oj-input-text>
       *
       * @example <caption>Get or set the <code class="prettyprint">virtualKeyboard</code> property after initialization:</caption>
       * // Getter
       * var virtualKeyboard = myComp.virtualKeyboard;
       *
       * // Setter
       * myComp.virtualKeyboard = "number";
       *
       * @expose
       * @instance
       * @memberof oj.ojInputText
       * @ojshortdesc The type of virtual keyboard to display for entering a value on mobile browsers. See the Help documentation for more information.
       * @type {string}
       * @ojvalue {string} "auto" The component will determine the best mobile virtual keyboard to use.
       *                          For example, it may look at the converter's resolvedOptions
       *                          to determine the mobile virtual keyboard type.
       * @ojvalue {string} "email" Use a mobile virtual keyboard for entering email addresses.
       * @ojvalue {string} "number" Use a mobile virtual keyboard for entering numbers.
       *                            <p>If using "number", you must set the converter attribute to a converter
       *                            that formats to numeric characters only, otherwise the value will not be shown. The reason for this
       *                            is oj-input-text uses the browser native input type='number' and when you set a value that contains a non-numeric character,
       *                            browsers do not display the value. For example, "1,000" would not be shown.</p>
       *                            <p>Note that on Android and Windows Mobile, the "number" keyboard does
       *                            not contain the minus sign.  This value should not be used on fields that
       *                            accept negative values.</p>
       * @ojvalue {string} "search" Use a mobile virtual keyboard for entering search terms.
       * @ojvalue {string} "tel" Use a mobile virtual keyboard for entering telephone numbers.
       * @ojvalue {string} "text" Use a mobile virtual keyboard for entering text.
       * @ojvalue {string} "url" Use a mobile virtual keyboard for URL entry.
       * @default "auto"
       * @since 5.0.0
       */
      virtualKeyboard: 'auto',

      /**
          *
          * @expose
          * @instance
          * @memberof oj.ojInputText
          * @name length
          * @type {Object}
          * @since 8.0.0
          * @ojshortdesc An object whose properties describe the maximum length attributes.
          // * @ojtsignore tsdefonly
        */

      length: {
        /**
         * Maximum number of characters that can be entered in the input field.
         *
         * @expose
         * @name length.max
         * @ojshortdesc Specifies the maximum number of characters to be entered in the input text.
         * @memberof! oj.ojInputText
         * @instance
         * @type {number|null}
         * @default null
         * @since 8.0.0
         */
        max: null,

        /**
         * Dictates how the input text characters has to be counted.
         *
         * @expose
         * @name length.countBy
         * @ojshortdesc Specifies the manner in which the input text characters has to be counted.
         * @memberof! oj.ojInputText
         * @instance
         * @type {string=}
         * @ojvalue {string} 'codePoint' Uses code point to calculate the text length
         * @ojvalue {string} 'codeUnit' Uses code unit to calculate the text length
         * @default "codePoint"
         * @since 8.0.0
         */
        countBy: 'codePoint'
      }

      // Events

      /**
       * Triggered when the ojInputText is created.
       *
       * @event
       * @name create
       * @memberof oj.ojInputText
       * @instance
       * @property {Event} event event object
       * @property {Object} ui Currently empty
       * @ignore
       *
       * @example <caption>Initialize the ojInputText with the <code class="prettyprint">create</code> callback specified:</caption>
       * $( ".selector" ).ojInputText({
       *     "create": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
       * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
       */
      // create event declared in superclass, but we still want the above API doc
    },

    /**
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojInputText
     */
    _ComponentCreate: function () {
      var retVal = this._super();

      // add in the clear icon if needed
      var clearIconAttr = this.options.clearIcon;

      this._processClearIconAttr(clearIconAttr);
      this._processSlottedChildren();

      this._AddHoverable(this._wrapper);

      // Set the input type attribute based on virtualKeyboard property
      this._SetInputType(this._ALLOWED_TYPES);

      return retVal;
    },
    /**
     * @ignore
     * @override
     * @protected
     * @memberof! oj.InputText
     * @return {boolean}
     */
    _DoWrapElementAndTriggers: function () {
      this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES = this._INPUT_CONTAINER_CLASS;
      return true;
    },
    /**
     * Render or remove the clear icon
     * @ignore
     * @private
     * @param {string} clearIconAttr
     * @memberof oj.ojInputText
     * @instance
     */
    _processClearIconAttr: function (clearIconAttr) {
      var wrapperElem = this._GetContentWrapper().parentElement;

      var clearIconBtn = wrapperElem.querySelector('a.oj-inputtext-clear-icon-btn');

      if (clearIconAttr === 'never' || this.options.disabled || this.options.readOnly) {
        // remove the icon if it is there
        if (clearIconBtn) {
          wrapperElem.removeChild(clearIconBtn);
        }

        // if the clearIcon is not rendered, we shouldn't have these classes
        wrapperElem.classList.remove('oj-inputtext-clearicon-visible');
        wrapperElem.classList.remove('oj-inputtext-clearicon-conditional');
      } else {
        if (clearIconBtn === null) {
          var clearIcon;
          var agentInfo = oj.AgentUtils.getAgentInfo();
          clearIconBtn = document.createElement('a');
          clearIconBtn.className =
            'oj-inputtext-clear-icon-btn oj-component-icon oj-clickable-icon-nocontext';
          clearIconBtn.setAttribute('tabindex', '-1');
          clearIconBtn.setAttribute(
            'title',
            this.getTranslatedString(this._INPUTTEXT_CLEAR_ICON_KEY)
          );
          // Only add aria-label for screen readers on mobile browsers
          if (
            agentInfo.os === oj.AgentUtils.OS.ANDROID ||
            agentInfo.os === oj.AgentUtils.OS.IOS ||
            agentInfo.os === oj.AgentUtils.OS.WINDOWSPHONE
          ) {
            clearIconBtn.setAttribute('aria-label', 'Clear input');
          } else {
            // clear icon is hidden from screen reader users for desktop.
            clearIconBtn.setAttribute('aria-hidden', 'true');
          }

          clearIconBtn.setAttribute('target', '_blank');
          clearIcon = document.createElement('span');
          clearIcon.className = 'oj-inputtext-clear-icon';

          clearIconBtn.appendChild(clearIcon);
          wrapperElem.appendChild(clearIconBtn);

          clearIconBtn.addEventListener(
            this._CLICK_HANDLER_KEY,
            this._onClearIconClickHandler.bind(this)
          );
        }

        // If clear-icon = "always", we want the icon visible all the time
        if (clearIconAttr === 'always') {
          wrapperElem.classList.add('oj-inputtext-clearicon-visible');
        } else {
          wrapperElem.classList.remove('oj-inputtext-clearicon-visible');

          // For the conditional case, we render oj-form-control-empty-clearicon if the input doesn't
          // have a value, as we always want the clear icon hidden for this case.  When the input does
          // have a value, then we use oj-inputtext-clearicon-conditional, which has selectors for
          // oj-hover and oj-focus to determine when the icon is visible.
          wrapperElem.classList.add('oj-inputtext-clearicon-conditional');

          var val;

          // if the component is not fully rendered, then we need to use the value option's value
          // instead of the input element's value
          if (wrapperElem.classList.contains('oj-complete')) {
            val = this.element[0].value;
          } else {
            val = this.options.value;
          }

          if (val && val !== '') {
            wrapperElem.classList.remove('oj-form-control-empty-clearicon');
          } else {
            wrapperElem.classList.add('oj-form-control-empty-clearicon');
          }
        }
      }
    },
    /**
     * Handles slotted start and end icons.
     * @ignore
     * @private
     * @memberof oj.ojInputText
     * @instance
     */
    _processSlottedChildren: function () {
      function scrubSlots(slotMap) {
        var VALID_SLOTS = { contextMenu: true, start: true, end: true, '': true };
        var keys = Object.keys(slotMap);
        for (var i = keys.length - 1; i > -1; i--) {
          var key = keys[i];
          if (!VALID_SLOTS[key]) {
            var nodes = slotMap[key];
            for (var n = 0; n < nodes.length; n++) {
              var node = nodes[n];
              node.parentElement.removeChild(node);
            }
          }
        }
      }
      function processStartSlots(contentContainer, nodes) {
        var wrapperElem = document.createElement('span');
        var textFieldContainer = contentContainer.parentElement;
        wrapperElem.classList.add('oj-text-field-start');
        textFieldContainer.insertBefore(wrapperElem, contentContainer);
        textFieldContainer.classList.add('oj-text-field-has-start-slot');
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          wrapperElem.appendChild(node);
        }
      }
      function processEndSlots(contentContainer, nodes) {
        var wrapperElem = document.createElement('span');
        var textFieldContainer = contentContainer.parentElement;
        wrapperElem.classList.add('oj-text-field-end');
        textFieldContainer.appendChild(wrapperElem);
        textFieldContainer.classList.add('oj-text-field-has-end-slot');
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          wrapperElem.appendChild(node);
        }
      }

      var slotMap = ojcustomelementUtils.CustomElementUtils.getSlotMap(this._getRootElement());
      scrubSlots(slotMap);

      var contextContainer = this._GetContentWrapper();
      var slotName = 'start';
      if (slotMap[slotName]) {
        processStartSlots(contextContainer, slotMap[slotName]);
      }
      slotName = 'end';
      if (slotMap[slotName]) {
        processEndSlots(contextContainer, slotMap[slotName]);
      }
    },

    /**
     * Performs post processing after _SetOption() calls _superApply(). Different options, when changed, perform
     * different tasks.
     *
     * @param {string} option
     * @param {Object=} flags
     * @protected
     * @memberof oj.ojInputText
     * @instance
     */
    _AfterSetOption: function (option, flags) {
      this._super(option, flags);

      switch (option) {
        // all of these options potentially affect the visiblity and/or rendering of the icon
        // so we need to process the icon if any of these change.
        case 'clearIcon':
        case 'disabled':
        case 'readOnly':
          this._processClearIconAttr(this.options.clearIcon);
          break;

        case 'virtualKeyboard':
          this._SetInputType(this._ALLOWED_TYPES);
          break;

        case 'value':
          this._processClearIconAttr(this.options.clearIcon);
          this._filterTextOnValueChange();
          this._AfterSetOptionLength(this.options.length);
          break;

        default:
          break;
      }
    },
    /**
     * Invoked when the input event happens
     *
     * @ignore
     * @protected
     * @memberof! oj.ojInputText
     * @param {Event} event
     */
    _onInputHandler: function (event) {
      this._super(event);
      var inputNode = event.target;
      var wrapperNode = this._GetContentWrapper().parentElement;
      var clearIconAttr = this.options.clearIcon;

      if (clearIconAttr === 'conditional') {
        if (inputNode.value !== '') {
          wrapperNode.classList.remove('oj-form-control-empty-clearicon');
        } else {
          wrapperNode.classList.add('oj-form-control-empty-clearicon');
        }
      }
    },
    /**
     * The handler clears the value of the input element and sets the focus on the element
     * NOTE: this handler expects the input text component to be bound to this via .bind()
     *
     * @ignore
     * @private
     * @memberof! oj.ojInputText
     * @param {Event} event
     */
    _onClearIconClickHandler: function (event) {
      var elem = this.element[0];

      elem.value = '';
      // we need to update the raw value to keep it in sync
      this._SetRawValue(elem.value, event);
      elem.focus();
      var wrapper = this._GetContentWrapper().parentElement;
      wrapper.classList.add('oj-form-control-empty-clearicon');
      this._processLengthCounterAttr(this.options.length.counter);
    },
    /**
     * Invoked when blur is triggered of the this.element
     * We don't want to set the value if the event.relatedTarget is the clear icon button
     *
     * @ignore
     * @protected
     * @memberof! oj.inputText
     * @param {Event} event
     */
    _onBlurHandler: function (event) {
      var wrapperNode = this._wrapper[0];
      var target = event.relatedTarget;

      // if this is the clear icon, skip the blur handler if it is an ancestor of the input text
      if (
        !(
          target &&
          target.classList.contains('oj-inputtext-clear-icon-btn') &&
          target.parentElement &&
          DomUtils.isAncestorOrSelf(wrapperNode, target.parentElement)
        )
      ) {
        this._super(event);
      } else {
        // We need to put the oj-focus back on the wrapperNode so that the icon
        // doesn't disappear on iOS and make it so that the click handler will fire.
        wrapperNode.classList.add('oj-focus');
      }
    },
    getNodeBySubId: function (locator) {
      var node = this._superApply(arguments);
      var subId;
      if (!node) {
        subId = locator.subId;
        if (subId === 'oj-inputtext-input') {
          node = this.element ? this.element[0] : null;
        }
      }
      // Non-null locators have to be handled by the component subclasses
      return node || null;
    },

    /**
     * @override
     * @instance
     * @memberof! oj.ojInputText
     * @protected
     * @return {string}
     */
    _GetDefaultStyleClass: function () {
      return 'oj-inputtext';
    },

    /**
     * Set the type of the input element based on virtualKeyboard option.
     * @memberof oj.ojInputText
     * @instance
     * @protected
     * @ignore
     */
    _SetInputType: ojeditablevalue.EditableValueUtils._SetInputType
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
   *    <tr>
   *       <td>Input</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Sets focus to input. Show user assistance text. This may be inline or in a notewindow
   * depending upon theme and property settings.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputText
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
   *       <td>Input</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the input.
   *       Show user assistance text. This may be inline or in a notewindow
   * depending upon theme and property settings.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputText
   */

  // ////////////////     SUB-IDS     //////////////////
  /**
   * <p>Sub-ID for the ojInputText component's input element.</p>
   *
   * @ojsubid oj-inputtext-input
   * @memberof oj.ojInputText
   *
   * @example <caption>Get the node for the input element:</caption>
   * var node = myComp.getNodeBySubId("oj-input-text-input");
   */

  /**
   * <p>The <code class="prettyprint">start</code> slot is for adding html content before the input area, typically an icon.</p>
   * <p>For example, an icon identifying the credit card type based on the value entered.</p>
   *
   * @ojslot start
   * @ojshortdesc The start slot enables adding leading html content such as an icon
   * @since 9.1.0
   * @memberof oj.ojInputText
   *
   * @ojtsexample <caption>Initialize the input text with child content specified for the start slot:</caption>
   * &lt;oj-input-text on-raw-value-changed="[[changeCreditCardTypeIcon]]">
   *   &lt;img slot="start" :src="[[creditCardTypeIcon]]">
   * &lt;/oj-input-text>
   */

  /**
   * <p>The <code class="prettyprint">end</code> slot is for adding html content after the input area, typically an oj-button or and icon.
   * For example, a magnifying glass icon button for a search field can be provided in this slot.
   * </p>
   *
   * @ojslot end
   * @ojshortdesc The end slot enables adding trailing html content such as an icon button.
   * @since 9.1.0
   * @memberof oj.ojInputText
   *
   * @ojtsexample <caption>Initialize the input text with child content specified for the end slot:</caption>
   * &lt;oj-input-text>
   *   &lt;oj-button slot="end" on-oj-action="[[performSearch]]" display="icons" >
   *     &lt;img slot="endIcon" src="search.png">Search
   *    &lt;/oj-button>
   * &lt;/oj-input-text>
   */

  /**
   * @ojcomponent oj.ojTextArea
   * @augments oj.inputBase
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojTextArea<V = any> extends inputBase<V, ojTextAreaSettableProperties<V>>",
   *                genericParameters: [{"name": "V", "description": "Type of value of the component"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojTextAreaSettableProperties<V = any> extends inputBaseSettableProperties<V>",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @since 0.6.0
   * @ojshortdesc A text area allows the user to enter a multi-line text value.
   * @ojrole textbox
   * @ojtsimport {module: "ojconverter-number", type: "AMD", imported: ["IntlNumberConverter", "NumberConverter"]}
   * @ojtsimport {module: "ojconverter-color", type: "AMD", importName: "ColorConverter"}
   * @ojtsimport {module: "ojconverter-datetime", type: "AMD",  imported: ["IntlDateTimeConverter", "DateTimeConverter"]}
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "rows", "maxRows","disabled", "required", "readonly"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-text-input-area'
   * @ojuxspecs ['input-text']
   *
   * @classdesc
   * <h3 id="textAreaOverview-section">
   *   JET TextArea Component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#textAreaOverview-section"></a>
   * </h3>
   *
   * <p>Description: The oj-text-area component enhances a browser textarea element.
   *
   * <pre class="prettyprint"><code>&lt;oj-text-area>&lt;/oj-text-area></code></pre>
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
   * {@ojinclude "name":"accessibilityLabelEditableValue"}
   * {@ojinclude "name":"accessibilityPlaceholderEditableValue"}
   * {@ojinclude "name":"accessibilityDisabledEditableValue"}
   * </p>
   * <h3 id="migration-section">
   *   Migration
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
   * </h3>
   *
   * <p>
   * To migrate from oj-text-area to oj-c-text-area, you need to revise the import statement
   * and references to oj-c-text-area in your app. Please note the changes between the two components below.
   * </p>
   *
   * <h5>Converter attribute</h5>
   * <p>
   * The converter attribute is changed to support only a converter instance, null, or undefined. It does not support
   * a Promise that resolves to a converter instance. The application should resolve the promise and then update the
   * converter attribute with the resolved converter instance.
   * </p>
   * <p>
   * The converter is no longer applied when the value is <code>null</code>, <code>undefined</code>, or <code>''</code>.
   * <p>
   *
   * <h5>LabelEdge attribute</h5>
   * <p>
   * The enum values for the label-edge attribute have been changed from 'inside', 'provided' and 'none' to 'start', 'inside', 'top' and 'none'.
   * If you are using this component in a form layout and would like the form layout to drive the label edge of this component, leave this attribute
   * unset. The application no longer has to specify 'provided' for this attribute. If you want to override how the label is positioned, set this
   * attribute to the corresponding value.
   * </p>
   *
   * <h5>TextAlign attribute</h5>
   * <p>
   * The usage of the style classes: oj-form-control-text-align-right, oj-form-control-text-align-start and oj-form-control-text-align-end is now
   * replaced with this attribute. The value of this attribute maps to these style classes as shown below:
   * <ul>
   * <li>
   * .oj-form-control-text-align-right maps to 'right'
   * </li>
   * <li>
   * .oj-form-control-text-align-start maps to 'start'
   * </li>
   * <li>
   * .oj-form-control-text-align-end maps to 'end'
   * </li>
   * </ul>
   * </p>
   * <h5>Translations attribute</h5>
   * <p>
   * The translations.required.message-detail attribute has changed to required-message-detail.
   * </p>
   *
   * <h5>Value attribute</h5>
   * <p>
   * Clearing the field and committing the value will now set the value attribute to <code>null</code>
   * instead of <code>''</code>.
   * </p>
   *
   * <h5>Refresh method</h5>
   * <p>
   * The refresh method is no longer supported. The application should no longer need to use this method. If the application
   * wants to reset the component (remove messages and reset the value of the component), please use the reset method.
   * </p>
   *
   * <h5>Reset method</h5>
   * <p>
   * This method does not synchronously reset the component. The application should wait on the busy context of the component after
   * invoking this method for the changes to appear.
   * </p>
   *
   * <h5>ShowMessages method</h5>
   * <p>
   * This method does not synchronously show the hidden messages of the component. The application should wait on the busy context
   * of the component after invoking this method for the changes to appear.
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
   * The application should no longer need to use an &lt;oj-label-value> component to layout the form component. The application
   * can use the label-edge attribute and label-start-width attribute to customize the label position and label width (only when using start label).
   * </p>
   * <h3 id="binding-section">
   *   Declarative Binding
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
   * </h3>
   *
   * <h5>User Assistance Density - Compact mode</h5>
   * <p>
   * Rendering the component in compact userAssistanceDensity mode is not supported in this release. Please use 'reflow' or 'efficient' instead.
   * </p>
   *
   * <h5>Usage in Dynamic Form</h5>
   * <p>
   * Using the component in oj-dyn-form is not supported in this release, use oj-dynamic-form instead.
   * </p>
   *
   * @example <caption>Initialize the textarea with no attributes specified:</caption>
   * &lt;oj-text-area>&lt;/oj-text-area>
   *
   * * @example <caption>Initialize the textarea with some attributes:</caption>
   * &lt;oj-text-area id="txtAreaId" disabled>&lt;/oj-text-area>
   *
   * @example <caption>Initialize the textarea via the JET component binding:</caption>
   * &lt;oj-text-area id="txtAreaId" value="{{currentValue}}">&lt;/oj-text-area>
   */
  // --------------------------------------------------- oj.ojTextArea Styling Start ------------------------------------------------------------
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
   * @memberof oj.ojTextArea
   * @ojtsexample
   * &lt;oj-text-area class="oj-form-control-full-width">
   * &lt;/oj-text-area>
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
   * @memberof oj.ojTextArea
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-text-area class="oj-form-control-max-width-md">&lt;/oj-text-area>
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-sm
   * @ojshortdesc Sets the max width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojTextArea
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-md
   * @ojshortdesc Sets the max width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojTextArea
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
   * @memberof oj.ojTextArea
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-text-area class="oj-form-control-width-md">&lt;/oj-text-area>
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-sm
   * @ojshortdesc Sets the width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojTextArea
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-md
   * @ojshortdesc Sets the width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojTextArea
   */

  // ---------------- oj-form-control-text-align- --------------
  /**
   * Classes that help align text of the element.
   * @ojstyleset text-align
   * @ojdisplayname Text Alignment
   * @ojstylesetitems ["text-align.oj-form-control-text-align-right", "text-align.oj-form-control-text-align-start", "text-align.oj-form-control-text-align-end"]
   * @ojstylerelation exclusive
   * @memberof oj.ojTextArea
   * @ojtsexample
   * &lt;oj-text-area class="oj-form-control-text-align-right">
   * &lt;/oj-text-area>
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-right
   * @ojshortdesc Aligns the text to the right regardless of the reading direction. This is normally used for right aligning numbers.
   * @ojdisplayname Align-Right
   * @memberof! oj.ojTextArea
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-start
   * @ojshortdesc Aligns the text to the left in LTR and to the right in RTL.
   * @ojdisplayname Align-Start
   * @memberof! oj.ojTextArea
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-end
   * @ojshortdesc Aligns the text to the right in LTR and to the left in RTL.
   * @ojdisplayname Align-End
   * @memberof! oj.ojTextArea
   */
  // --------------------------------------------------- oj.ojTextArea Styling end ------------------------------------------------------------

  oj.__registerWidget('oj.ojTextArea', $.oj.inputBase, {
    version: '1.0.0',
    defaultElement: '<textarea>',
    widgetEventPrefix: 'oj',

    /**
     * @expose
     * @private
     * @memberof! oj.ojTextArea
     */
    _ATTR_CHECK: [],

    /**
     * @expose
     * @private
     * @memberof! oj.ojTextArea
     */
    _CLASS_NAMES: 'oj-textarea-input',

    /**
     * @expose
     * @private
     * @memberof! oj.ojTextArea
     */
    _WIDGET_CLASS_NAMES: 'oj-textarea oj-form-control oj-component',

    _INPUT_CONTAINER_CLASS: 'oj-text-field-container',
    _TEXTAREA_COUNTER_CONTAINER: 'oj-textarea-counter-container',
    _TEXTAREA_COUNTER_EL: 'oj-textarea-counter-el',

    _INPUT_HANDLER_KEY: 'input',

    options: {
      /**
       * A converter instance or Promise to a converter instance
       * or one that duck types {@link oj.Converter}.
       * {@ojinclude "name":"inputBaseConverterOptionDoc"}
       *
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
       * @example <caption>Initialize the component with a number converter instance:</caption>
       * &lt;oj-text-area converter="[[salaryConverter]]">&lt;/oj-text-area><br/>
       * // Initialize converter instance using currency options
       * var options = {style: 'currency', 'currency': 'USD', maximumFractionDigits: 0};
       * this.salaryConverter = new NumberConverter(options);
       *
       * @example <caption>Get or set the <code class="prettyprint">converter</code>
       * property after initialization:</caption>
       * // getter
       * var converter = myComp.converter;
       *
       * // setter
       * myComp.converter = myConverter;
       * @expose
       * @access public
       * @instance
       * @default null
       * @memberof! oj.ojTextArea
       * @ojshortdesc An object that converts the value. See the Help documentation for more information.
       * @ojsignature [{
       *    target: "Type",
       *    value: "Promise<oj.Converter<V>>|oj.Converter<V>|
       *            null",
       *    jsdocOverride: true},
       *    {target: "Type",
       *    value: "Promise<oj.Converter<V>>|oj.Converter<V>|
       *            oj.Validation.RegisteredConverter|
       *            null",
       *    consumedBy: 'tsdep'}]
       * @ojdeprecated {since: '8.0.0', target: 'memberType', value: ['oj.Validation.RegisteredConverter'],
       *                description:'Defining a converter with an object literal with converter type and its options
       *                  (aka JSON format) has been deprecated and does nothing. If needed, you can make the JSON format
       *                  work again by importing the deprecated module you need, like ojvalidation-base or
       *                  ojvalidation-number module.'}
       * @type {Object|null}
       */
      converter: null,
      /**
       * The maximum number of visible text lines of the textarea. The textarea will change its height in response to content change.
       * If this is 0, the number of visible text lines is always as specified by the "rows" attribute, and the textarea will never change
       * its size.
       * If this is -1, there is no maximum and the textarea will grow to show all the content.
       * If this is a positive number larger than the "rows" attribute, the textarea will grow to fit the content,
       * up to the maximum number of text lines.
       * The height will never be less than the number of rows specified by the "rows" attribute.
       *
       * @example <caption>Initialize component with <code class="prettyprint">max-rows</code> attribute:</caption>
       * &lt;oj-some-element max-rows="5">&lt;/oj-some-element>
       *
       * @example <caption>Get or set the <code class="prettyprint">max-rows</code> property after initialization:</caption>
       * // getter
       * var ro = myComp.maxRows;
       *
       * // setter
       * myComp.maxRows = 5;
       *
       * @expose
       * @instance
       * @memberof! oj.ojTextArea
       * @ojshortdesc Specifies the maximum number of visible text lines of the textarea.
       * @type {number}
       * @default 0
       * @since 8.0.0
       */
      maxRows: 0,
      /**
       * Regular expression pattern which will be used to validate the component's value.
       * <p>
       * When pattern is set to true, an implicit regExp validator is created using
       * the RegExpValidator -
       * <code class="prettyprint">new RegExpValidator()</code>.
       * </p>
       *
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">pattern</code> attribute:</caption>
       * &lt;oj-text-area pattern="[a-zA-Z0-9]{3,}">&lt;/oj-text-area><br/>
       *
       * @example <caption>Get or set the <code class="prettyprint">pattern</code> property after initialization:</caption>
       * // getter
       * var pattern = myComp.pattern;
       *
       * // setter
       * myComp.pattern = "[0-9]{3,}";
       *
       * @expose
       * @instance
       * @memberof! oj.ojTextArea
       * @type {string|undefined}
       * @ignore
       */
      pattern: '',
      /**
       *
       * Defines the resizeBehavior of the textarea.
       * Note that this is implemented via the native browser support for resize on the textarea element.
       * If a browser doesn't support this (IE, Edge, iOS, Android), then this attribute has no effect.
       *
       * @expose
       * @memberof oj.ojTextArea
       * @ojshortdesc Specifies the resize behavior, based upon native browser support. See the Help documentation for more information.
       * @instance
       * @type {string}
       * @ojvalue {string} "both" The textarea will be interactively resizable horizontally and vertically.
       * @ojvalue {string} "horizontal" The textarea will be resizable in the horizontal direction only.
       * @ojvalue {string} "vertical" The textarea will be resizable in the vertical direction only.
       * @ojvalue {string} "none" The textarea will not be interactively resizable.
       * @default "none"
       * @since 7.0.0
       *
       * @example <caption>Initialize the textarea to a specific <code class="prettyprint">resizeBehavior</code></caption>
       * &lt;oj-text-area resize-behavior="none" &gt;&lt;/oj-text-area&gt;
       *
       * @example <caption>Get or set the <code class="prettyprint">resizeBehavior</code> property, after initialization:</caption>
       *
       * // getter
       * var resizeBehavior = myTextarea.resizeBehavior;
       *
       * // setter
       * myTextarea.resizeBehavior = "none";
       */
      resizeBehavior: 'none',
      /**
       * The number of visible text lines in the textarea. It can also be used to
       * give specific height to the textarea.  When used in conjuction with max-rows,
       * the rows attribnute will be the minimum height of the textarea.
       *
       * @example <caption>Initialize component with <code class="prettyprint">rows</code> attribute:</caption>
       * &lt;oj-some-element rows="5">&lt;/oj-some-element>
       *
       * @example <caption>Get or set the <code class="prettyprint">rows</code> property after initialization:</caption>
       * // getter
       * var ro = myComp.rows;
       *
       * // setter
       * myComp.rows = 5;
       *
       * @expose
       * @instance
       * @memberof! oj.ojTextArea
       * @ojshortdesc Specifies the visible number of lines in the text area.
       * @type {number}
       * @ojextension {_COPY_TO_INNER_ELEM: true}
       */
      rows: undefined,

      /**
       * @expose
       * @instance
       * @memberof oj.ojTextArea
       * @name length
       * @type {Object}
       * @ojshortdesc An object whose properties describe the maximum length attributes.
       * @since 8.0.0
       */
      length: {
        /**
         * Maximum number of characters that can be entered in the input field.
         *
         * @expose
         * @name length.max
         * @ojshortdesc Specifies the maximum number of characters to be entered in the text area.
         * @memberof! oj.ojTextArea
         * @instance
         * @type {number|null}
         * @default null
         * @since 8.0.0
         */
        max: null,

        /**
         * Dictates how the input text characters has to be counted.
         *
         * @expose
         * @name length.countBy
         * @ojshortdesc Specifies the manner in which the text area characters has to be counted.
         * @memberof! oj.ojTextArea
         * @instance
         * @type {string=}
         * @ojvalue {string} 'codePoint' Uses code point to calculate the text length
         * @ojvalue {string} 'codeUnit' Uses code unit to calculate the text length
         * @default "codePoint"
         * @since 8.0.0
         */
        countBy: 'codePoint',

        /**
         * Decides whether the remaining number of characters
         * that can be entered is shown or not.
         *
         * @expose
         * @name length.counter
         * @ojshortdesc The type of counter to display.
         * @memberof! oj.ojTextArea
         * @instance
         * @type {string=}
         * @ojvalue {string} 'none' The remaining characters count is not displayed.
         * @ojvalue {string} 'remaining' The remaining characters count is displayed.
         * @default "none"
         * @since 8.0.0
         */
        counter: 'none'
      }

      // Events

      /**
       * Triggered when the ojTextArea is created.
       *
       * @event
       * @name create
       * @memberof oj.ojTextArea
       * @instance
       * @property {Event} event event object
       * @property {Object} ui Currently empty
       * @ignore
       *
       * @example <caption>Initialize the ojTextArea with the <code class="prettyprint">create</code> callback specified:</caption>
       * $( ".selector" ).ojTextArea({
       *     "create": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
       * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
       */
      // create event declared in superclass, but we still want the above API doc
    },

    /**
     * Performs post processing after _SetOption() calls _superApply(). Different options, when changed, perform
     * different tasks.
     *
     * @param {string} option
     * @param {Object=} flags
     * @protected
     * @memberof oj.ojTextArea
     * @instance
     */
    _AfterSetOption: function (option, flags) {
      this._super(option, flags);

      switch (option) {
        case 'value':
          this._filterTextOnValueChange();
          this._AfterSetOptionLength(this.options.length);
          break;

        default:
          break;
      }
    },

    /**
     * This function gets called on initial render,
     * and when oj-text-area attributes are modified.
     *
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojTextArea
     */
    _AfterCreate: function () {
      var ret = this._superApply(arguments);
      if (this.options.value === undefined) {
        this._SetDisplayValue('');
      }
      this.widget()[0].querySelector('.' + this._INPUT_CONTAINER_CLASS).style.resize =
        this.options.resizeBehavior;
      this._setupResizeTextareaBind();
      var maxrows = this.options.maxRows;
      if (maxrows === -1) {
        this.widget()[0].classList.add('oj-maxrows-neg1');
      }
      return ret;
    },
    /**
     * Do things here for creating the component where you need the converter, since
     * getting the converter can be asynchronous. We get the converter before calling
     * this method, so it is there. This function is called once the converter is resolved.
     *
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojTextArea
     */
    _AfterCreateConverterCached: function () {
      var ret = this._super();
      var textarea = this._GetContentElement()[0];
      var maxrows = this.options.maxRows;
      // don't resize <textarea> if you don't have to
      let textAreaNotInUse = this._textAreaElementNotDisplayed();
      if (!textAreaNotInUse && (maxrows === -1 || maxrows > textarea.rows)) {
        this._calculateLineHeight(textarea);
        this._resizeTextArea();
      }
      return ret;
    },

    /**
     * @ignore
     * @protected
     * @memberof! oj.ojTextArea
     * @override
     */
    // eslint-disable-next-line no-unused-vars
    _setOption: function (key, value, flags) {
      var retVal = this._superApply(arguments);

      if (key === 'resizeBehavior') {
        this.widget()[0].querySelector('.' + this._INPUT_CONTAINER_CLASS).style.resize = value;
      } else if (key === 'value') {
        // only resize if maxrows is more than rows and we aren't using readonlyDiv at the moment.
        let textAreaNotInUse = this._textAreaElementNotDisplayed();
        let maxrows = this.options.maxRows;
        if (!textAreaNotInUse && (maxrows === -1 || maxrows > this._GetContentElement()[0].rows)) {
          this._resizeTextArea();
        }
      }
      return retVal;
    },
    /**
     * Notifies the component that its subtree has been connected to the document
     * programmatically after the component has been created.
     * @return {void}
     * @memberof oj.ojTextArea
     * @instance
     * @protected
     * @override
     */
    _NotifyAttached: function () {
      this._super();
      var maxrows = this.options.maxRows;
      if (maxrows === -1 || maxrows > this._GetContentElement()[0].rows) {
        this._resizeTextArea();
      }
    },
    /**
     * Invoked when the input event happens
     *
     * @ignore
     * @protected
     * @memberof! oj.inputBase
     * @param {Event} event
     */
    _onInputHandler: function (event) {
      this._super(event);
      var textarea = this._GetContentElement()[0];
      // only resize if maxrows is more than rows
      var maxrows = this.options.maxRows;
      if (maxrows === -1 || maxrows > textarea.rows) {
        this._resizeTextArea();
      }
    },
    /**
     * Resize the textarea based on the content.
     * @ignore
     * @protected
     * @memberof! oj.ojTextArea
     */
    _resizeTextArea: function () {
      if (this._textAreaElementNotDisplayed() || this._lineHeight === undefined) {
        return;
      }
      const maxRows = this.options.maxRows;
      const textarea = this._GetContentElement()[0];
      const rows = textarea.rows;
      textarea.style.height = 0;
      const paddingHeight = this._getStylingHeight(textarea, 'padding');
      const heightForRows = this._lineHeight * rows + paddingHeight;
      const scrollHeight = textarea.scrollHeight;
      var resizedHeight = 0;
      // if maxRows is -1 the textarea will grow or shrink to fit all the content.
      // it won't shrink any less than rows.
      if (maxRows === -1) {
        // we want to fit the entire scrollHeight, but we don't want
        // to shrink smaller than the height for rows.
        if (scrollHeight < heightForRows) {
          resizedHeight = heightForRows;
        } else {
          resizedHeight = scrollHeight;
        }
      } else if (maxRows > rows) {
        // if maxRows is positive and greater than rows, the textarea will grow to fit the content
        // up to maxrows, or shrink to fit the content and down to rows.
        var heightForMaximumRows = this._lineHeight * maxRows + paddingHeight;
        if (scrollHeight > heightForMaximumRows) {
          resizedHeight = heightForMaximumRows;
        } else if (scrollHeight < heightForRows) {
          resizedHeight = heightForRows;
        } else {
          resizedHeight = scrollHeight;
        }
      } else {
        resizedHeight = heightForRows;
      }
      textarea.style.height = resizedHeight + 'px';
    },

    _setupResizeTextareaBind: function () {
      if (this._textAreaElementNotDisplayed()) {
        return;
      }

      this._resizeTextareaBind = function () {
        var textarea = this._GetContentElement()[0];
        // only resize if maxrows is more than rows or maxrows is -1,
        // which means it will grow as you type if need be.
        var maxrows = this.options.maxRows;
        if (maxrows === -1 || maxrows > textarea.rows) {
          this._resizeTextArea();
        }
      }.bind(this);
      window.addEventListener('resize', this._resizeTextareaBind, false);
    },
    /**
     * Calculates the padding and borders height for text-area
     *
     * @ignore
     * @protected
     * @memberof! oj.ojTextArea
     * @param {element} textarea
     * @param {string} type - accept 'padding', 'border', 'paddingAndBorder'
     */
    _getStylingHeight: function (textarea, type) {
      var cssStyle = window.getComputedStyle(textarea);
      var stylingHeight = 0;
      if (type === 'padding' || type === 'paddingAndBorder') {
        var paddingTop = parseFloat(cssStyle.paddingTop);
        var paddingBottom = parseFloat(cssStyle.paddingBottom);
        stylingHeight += paddingTop + paddingBottom;
      }
      if (type === 'border' || type === 'paddingAndBorder') {
        var borderTopWidth = parseFloat(cssStyle.borderTopWidth);
        var borderBottomWidth = parseFloat(cssStyle.borderBottomWidth);
        stylingHeight += borderTopWidth + borderBottomWidth;
      }
      return stylingHeight;
    },
    /**
     * Calculates the line height for text-area
     *
     * @ignore
     * @protected
     * @memberof! oj.ojTextArea
     */
    _calculateLineHeight: function (textarea) {
      if (this._textAreaElementNotDisplayed()) {
        return;
      }
      var computedStyle = window.getComputedStyle(textarea);
      if (computedStyle.display === 'none') {
        return;
      }
      var computedlineHeight = computedStyle.lineHeight;
      switch (computedlineHeight) {
        // We get 'normal' for values 'initial', 'inherit', 'unset' and 'normal'
        // In Alta Web theme, the lineHeight returns 'normal', we should keep this.
        case 'normal':
          // getComputedStyle always return fontSize in pixels.  Not likely a float, but since it's legal
          // we use parseFloat()
          var fontSize = parseFloat(computedStyle.fontSize);
          this._lineHeight = 1.2 * fontSize;
          break;
        // We get the value in pixels for all units (%, em, cm, mm, in, pt, pc, px)
        default:
          this._lineHeight = parseFloat(computedlineHeight);
      }
    },
    /**
     * @ignore
     * @private
     */
    _cleanUpListeners: function () {
      if (this._resizeTextareaBind) {
        window.removeEventListener('resize', this._resizeTextareaBind);
      }
    },
    /**
     * @ignore
     * @protected
     * @override
     */
    _ReleaseResources: function () {
      this._super();
      this._cleanUpListeners();
    },
    getNodeBySubId: function (locator) {
      var node = this._superApply(arguments);
      var subId;
      if (!node) {
        subId = locator.subId;
        if (subId === 'oj-textarea-input') {
          node = this.element ? this.element[0] : null;
        }
      }
      // Non-null locators have to be handled by the component subclasses
      return node || null;
    },

    /**
     * @ignore
     * @override
     * @protected
     * @memberof! oj.ojTextArea
     * @return {boolean}
     */
    _DoWrapElementAndTriggers: function () {
      this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES = this._INPUT_CONTAINER_CLASS;
      return true;
    },

    /**
     * ojTextArea extends from InputBase which creates a readonly div,
     * so overriding it to return false prevents ojTextArea from creating
     * a readonly div. Only form components that show their value in an
     * html input element need to use a readonly div for readonly in the
     * redwood theme.
     * @ignore
     * @override
     * @protected
     * @memberof! oj.ojTextArea
     * @return {boolean}
     */
    _UseReadonlyDiv: function () {
      var ret = this._super();
      if (ret) {
        // if max-rows is -1, then use readonly div when it is readonly.
        if (this.options.maxRows === -1) {
          return true;
        }
        return false;
      }
      return ret;
    },

    /**
     * @instance
     * @memberof! oj.ojTextArea
     * @override
     * @protected
     * @return {string}
     */
    _GetDefaultStyleClass: function () {
      return 'oj-textarea';
    },

    /**
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojTextArea
     */
    _GetTranslationsSectionName: function () {
      return 'oj-inputBase';
    },
    /**
     * If the converter is async or not
     *
     * @ignore
     * @protected
     * @memberof! oj.ojTextArea
     */
    _isConverAsync: function () {
      var converter = this._GetConverter();
      if (converter instanceof Promise) {
        return true;
      }
      return false;
    },
    /**
     * Invoked when keyup is triggered of the this.element
     *
     * When of keyCode is of Enter, oj-text-area should do nothing as
     * the enter key is just user entered data.
     *
     * @ignore
     * @protected
     * @override
     * @memberof! oj.ojTextArea
     * @param {Event} event
     */
    // eslint-disable-next-line no-unused-vars
    _onKeyUpHandler: function (event) {},
    /**
     * Invoked when keydown is triggered of the this.element
     *
     * When of keyCode is of ALT+ENTER, oj-text-area will insert a new line.
     * It is useful in the cases where Enter is used by the parent component, such as an oj-text-area in an oj-data-grid,
     * where Enter will go to the cell below in an editable data grid. Therefore in that case, use Alt+Enter on Windows and
     * Option+Return on MacOS to insert a new line in textarea.
     *
     * @ignore
     * @protected
     * @override
     * @memberof! oj.ojTextArea
     * @param {Event} event
     */
    // eslint-disable-next-line no-unused-vars
    _onKeyDownHandler: function (event) {
      if (event.keyCode === 13 || event.key === 'Enter') {
        if (event.altKey) {
          var textarea = this._GetContentElement()[0];
          var textValue = textarea.value;
          var textBefore = textValue.substring(0, textarea.selectionStart);
          var textAfter = textValue.substring(textarea.selectionEnd);
          textarea.value = textBefore + '\r\n' + textAfter;
          var cursorPosition = textarea.value.length - textAfter.length;
          textarea.setSelectionRange(cursorPosition, cursorPosition);
          // Using blur()/focus() to bring the cursor position so that it's visible in the textarea
          textarea.blur();
          textarea.focus();
          var maxrows = this.options.maxRows;
          if (maxrows === -1 || maxrows > textarea.rows) {
            this._resizeTextArea();
          }
          event.stopPropagation();
        }
      }
    },
    /**
     * Returns true if the <textarea> dom element is not being used,
     * and instead the readonlyDiv is being used. In that case we
     * do not want to resize the <textarea> element.
     *
     * @ignore
     * @private
     * @memberof! oj.ojTextArea
     */
    _textAreaElementNotDisplayed: function () {
      return this._UseReadonlyDiv() && this.options.readOnly && this.options.maxRows === -1;
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
   *    <tr>
   *       <td>TextArea</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Sets focus to textarea. Show user assistance text. This may be inline or in a notewindow
   * depending upon theme and property settings.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojTextArea
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
   *       <td>TextArea</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the textarea.
   *       Show user assistance text. This may be inline or in a notewindow
   * depending upon theme and property settings.</td>
   *     </tr>
   *     <tr>
   *       <td>TextArea</td>
   *       <td>MacOS:<kbd>Return</kbd>; Windows:<kbd>Enter</kbd></td>
   *       <td>Insert a newline. This is used for a plain textarea or a nested textarea where
   * Enter is not used by the parent component for other purpose.</td>
   *     </tr>
   *     <tr>
   *       <td>TextArea</td>
   *       <td>MacOS:<kbd>Option+Return</kbd>; Windows:<kbd>Alt+Enter</kbd></td>
   *       <td>Insert a newline. This is used for cases where Enter is used by the parent component,
   * such as an oj-text-area in an oj-data-grid, where Enter will go to the cell below in an editable data grid.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojTextArea
   */

  // ////////////////     SUB-IDS     //////////////////
  /**
   * <p>Sub-ID for the ojTextArea component's textarea element.</p>
   *
   * @ojsubid oj-textarea-input
   * @ignore
   * @memberof oj.ojTextArea
   * @deprecated 4.0.0  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
   *
   * @example <caption>Get the node for the input element:</caption>
   * var node = myComp.getNodeBySubId("oj-textarea-input");
   */

});
