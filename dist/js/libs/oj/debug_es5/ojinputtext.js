/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojvalidator-regexp', 'ojs/ojlogger', 'ojs/ojfilter-length', 'ojs/ojeditablevalue'], 
/*
* @param {Object} oj 
* @param {jQuery} $
*/
function(oj, $, RegExpValidator, Logger, LengthFilter)
{
  "use strict";
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
          "enumValues": [
            "none",
            "notewindow"
          ],
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
          "enumValues": [
            "none",
            "notewindow"
          ],
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
          "enumValues": [
            "none",
            "notewindow"
          ],
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


/* global RegExpValidator: false, Logger:false, LengthFilter:false */

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
oj.__registerWidget('oj.inputBase', $.oj.editableValue, {
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
   * Array to be used for oj.EditableValueUtils.initializeOptionsFromDom attribute is the html-5 dom attribute name.
   * If option is different, like in the case of readonly (readonly html vs readOnly
   * (camelcase) component option), specify both attribute and option.
   * NOTE: This is for the widget components only. Do not add custom element attributes here.
   * @expose
   * @memberof! oj.inputBase
   * @private
   */
  _GET_INIT_OPTIONS_PROPS_FOR_WIDGET: [{
    attribute: 'disabled',
    validateOption: true
  }, {
    attribute: 'pattern'
  }, {
    attribute: 'placeholder'
  }, {
    attribute: 'value'
  }, {
    attribute: 'readonly',
    option: 'readOnly',
    validateOption: true
  }, {
    attribute: 'required',
    coerceDomValue: true,
    validateOption: true
  }, {
    attribute: 'title'
  }, {
    attribute: 'spellcheck'
  }],

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
  _counterSpanEl: null,
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
     * Hints exposed by async-validators and validators are shown in the notewindow by default,
     * or as determined by the 'validatorHint' property set on the
     * <code class="prettyprint">display-options</code> attribute.
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
     * @type {string}
     * @ojsignature {target: "Type", value: "'on'|'off'|string", jsdocOverride: true}
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
     * Whether the component is readonly. The readOnly property sets or returns whether an element is readOnly, or not.
     * A readOnly element cannot be modified. However, a user can tab to it, highlight it, focus on it, and copy the text from it.
     * If you want to prevent the user from interacting with the element, use the disabled property instead.
     *
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
     * Whether the component is required or optional. When required is set to true, an implicit
     * required validator is created using the RequiredValidator -
     * <code class="prettyprint">new RequiredValidator()</code>.
     *
     * Translations specified using the <code class="prettyprint">translations.required</code> attribute
     * and the label associated with the component, are passed through to the options parameter of the
     * createValidator method.
     *
     * <p>
     * When <code class="prettyprint">required</code> property changes due to programmatic intervention,
     * the component may clear messages and run validation, based on the current state it's in. </br>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when required is set to true, then it runs deferred validation on
     * the value property. This is to ensure errors are not flagged unnecessarily.
     * </li>
     * <li>if component is invalid and has deferred messages when required is set to false, then
     * component messages are cleared but no deferred validation is run.
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
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the component are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     *
     * </p>
     *
     * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
     * This is the default.
     * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by user and the
     * input's label will render a required icon. Additionally a required validator -
     * {@link oj.RequiredValidator} - is implicitly used if no explicit required validator is set.
     * An explicit required validator can be set by page authors using the validators attribute.
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
     * Hints exposed by validators are shown in the notewindow by default, or as determined by the
     * 'validatorHint' property set on the <code class="prettyprint">display-options</code>
     * attribute.
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
  _SaveAttributes: function _SaveAttributes(element) {
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
  _InitOptions: function _InitOptions(originalDefaults, constructorOptions) {
    this._super(originalDefaults, constructorOptions);

    if (!this._IsCustomElement()) {
      oj.EditableValueUtils.initializeOptionsFromDom(this._GET_INIT_OPTIONS_PROPS_FOR_WIDGET, constructorOptions, this);
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
  _ComponentCreate: function _ComponentCreate() {
    var ret = this._superApply(arguments);

    var readOnly = this.options.readOnly;
    this._rtl = this._GetReadingDirection() === 'rtl'; // update element state using options

    if (typeof readOnly === 'boolean') {
      this.element.prop('readonly', readOnly);
    } // If we need to wrap this.element, we should do it in one pass instead of multiple
    // passes.  If elements are reparented multiple times, it will impact performance.


    if (this._DoWrapElement()) {
      var outerWrapper;
      var newParent; // Wraps the this.element and adds _WIDGET_CLASS_NAMES classes to the wrapped element

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
        outerWrapper.className = this._WIDGET_CLASS_NAMES; // this.element doesn't always have a parent (e.g. when it's in a template)

        if (this.element[0].parentNode) {
          this.element[0].parentNode.insertBefore(outerWrapper, this.element[0]);
        } // For now, just insert the outer wrapper before this.element.
        // Don't bother reparenting this.element until all the other wrappers have been created.

      }

      newParent = outerWrapper;
      this._wrapper = $(outerWrapper); // may need to do an extra wrapping if the element has triggers

      if (this._DoWrapElementAndTriggers()) {
        var containerWrapper = this._CreateContainerWrapper();

        outerWrapper.appendChild(containerWrapper);
        newParent = containerWrapper; // _CreateMiddleWrapper may return null (e.g. oj-date-picker)

        var middleWrapper = this._CreateMiddleWrapper();

        if (middleWrapper) {
          containerWrapper.appendChild(middleWrapper);
          newParent = middleWrapper;
        }
      } // Only reparent this.element once


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
    } // remove pattern attribute to not trigger html5 validation + inline bubble
    //    if ('pattern' in savedAttributes)
    //    {
    //      node.removeAttr('pattern');
    //    }


    this._defaultRegExpValidator = {};
    this._eventHandlers = null;

    if (this._hasMaxLength()) {
      this.lengthFilter = new LengthFilter(this.options.length);
      var currentVal = this.options.value;

      this._filterTextAndSetValues(currentVal, currentVal, true, true);
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
  _AfterCreate: function _AfterCreate() {
    var ret = this._superApply(arguments);

    var options = ['disabled', 'readOnly'];
    var self = this;

    this._refreshRequired(this.options.required);

    if (this._CLASS_NAMES) {
      this.element.addClass(this._CLASS_NAMES);
      this.element.addClass('oj-text-field-input');
    } // attach handlers such as blur, keydown, and drop. placed in a function so to detach the handlers as well
    // when the options change


    this._attachDetachEventHandlers();

    this._AppendInputHelper();

    $.each(options, function (index, ele) {
      if (self.options[ele]) {
        self._processOptions(ele, self.options[ele]);
      }
    });

    if (this._IsCustomElement()) {
      oj.EditableValueUtils._setInputId(this._GetContentElement()[0], this.widget()[0].id, this.options.labelledBy);
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
  _IsRequired: function _IsRequired() {
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
  _AfterSetOptionRequired: oj.EditableValueUtils._AfterSetOptionRequired,

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
  _AfterSetOptionValidators: oj.EditableValueUtils._AfterSetOptionValidators,

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
  _AfterSetOptionAsyncValidators: oj.EditableValueUtils._AfterSetOptionAsyncValidators,

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
  _AfterSetOptionConverter: oj.EditableValueUtils._AfterSetOptionConverter,

  /**
   * Called when converter option changes and we have gotten the new converter
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _ResetConverter: oj.EditableValueUtils._ResetConverter,

  /**
   * Returns the normalized converter instance.
   *
   * @return {Object} a converter instance or null
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _GetConverter: oj.EditableValueUtils._GetConverter,

  /**
   * This returns an array of all validators
   * normalized from the validators option set on the component. <br/>
   * @return {Array} of validators.
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _GetNormalizedValidatorsFromOption: oj.EditableValueUtils._GetNormalizedValidatorsFromOption,

  /**
   * This returns an array of all async validators
   * normalized from the async-validators attribute set on the component. <br/>
   * @return {Array} of validators.
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _GetNormalizedAsyncValidatorsFromOption: oj.EditableValueUtils._GetNormalizedAsyncValidatorsFromOption,
  _processOptions: function _processOptions(key, value) {
    if (key === 'disabled') {
      this.element.prop('disabled', value);
    }

    if (key === 'readOnly') {
      this.element.prop('readonly', value);

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
  _setOption: function _setOption(key, value, flags) {
    var retVal = this._superApply(arguments);

    if (key === 'disabled' || key === 'readOnly') {
      this._processOptions(key, value);
    } else if (key === 'pattern') {
      this._defaultRegExpValidator.regexp = this._getImplicitRegExpValidator();

      this._AfterSetOptionValidators();
    } else if (key === 'labelledBy') {
      if (this.options.labelledBy) {
        var id = this._GetContentElement()[0].id;

        this._labelledByChangedForInputComp(this.options.labelledBy, id);
      }
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
  _AfterSetOption: function _AfterSetOption(option, previous, flags) {
    this._superApply(arguments);

    switch (option) {
      case 'readOnly':
        this._AfterSetOptionDisabledReadOnly(option, oj.EditableValueUtils.readOnlyOptionOptions);

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
  _hasMaxLength: function _hasMaxLength() {
    return this.options.length && this.options.length.max && !isNaN(this.options.length.max);
  },

  /**
   * Filters input text based on length.max value and set to the component
   *
   * @protected
   * @memberof oj.ojInputBase
   * @instance
   */
  _filterTextOnValueChange: function _filterTextOnValueChange() {
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
  _destroy: function _destroy() {
    var ret = this._superApply(arguments);

    this.element.off('blur drop keydown keyup compositionstart compositionend input');

    if (this._inputHelper) {
      this._inputHelper.remove();
    } // unwrap only for non custom elements.
    // for custom elements, the wrapper is created by apps. So no need to replace it with input.


    if (this._DoWrapElement() && !this._IsCustomElement()) {
      //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
      if (this._DoWrapElementAndTriggers()) {
        oj.DomUtils.unwrap(this.element, this._wrapper);
      } else {
        oj.DomUtils.unwrap(this.element);
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
  _SetLoading: function _SetLoading() {
    this._super();

    this.element.prop('readonly', true);

    this._refreshStateTheming('readOnly', true);
  },

  /**
   *
   * @protected
   * @override
   * @instance
   * @memberof! oj.inputBase
   */
  _ClearLoading: function _ClearLoading() {
    this._super();

    this.element.prop('readonly', this.options.readOnly);

    this._refreshStateTheming('readOnly', this.options.readOnly);
  },
  _attachDetachEventHandlers: function _attachDetachEventHandlers() {
    if (!this.options.readOnly && !this.options.disabled) {
      this._eventHandlers = {};
      var blurHandler = $.proxy(this._onBlurHandler, this);
      var keyDownHandler = $.proxy(this._onKeyDownHandler, this);
      var keyUpHandler = $.proxy(this._onKeyUpHandler, this);
      var compositionStartHandler = $.proxy(this._onCompositionStartHandler, this);
      var compositionEndHandler = $.proxy(this._onCompositionEndHandler, this);
      var inputHandler = $.proxy(this._onInputHandler, this);

      var dropHandler = function dropHandler() {
        this.focus();
      };

      this.element.on(this._BLUR_HANDLER_KEY, blurHandler);
      this.element.on(this._KEYDOWN_HANDLER_KEY, keyDownHandler);
      this.element.on(this._KEYUP_HANDLER_KEY, keyUpHandler);
      this.element.on(this._COMPOSITIONSTART_HANDLER_KEY, compositionStartHandler);
      this.element.on(this._COMPOSITIONEND_HANDLER_KEY, compositionEndHandler);
      this.element.on(this._INPUT_HANDLER_KEY, inputHandler); // other than FF when a drop is dispatched focus is placed back on the element
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
      var eventEntries = [this._BLUR_HANDLER_KEY, this._KEYDOWN_HANDLER_KEY, this._KEYUP_HANDLER_KEY, this._COMPOSITIONSTART_HANDLER_KEY, this._COMPOSITIONEND_HANDLER_KEY, this._INPUT_HANDLER_KEY, this._DROP_HANDLER_KEY];

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
  _processAttrCheck: function _processAttrCheck() {
    var attrCheck = this._ATTR_CHECK;

    for (var i = 0, j = attrCheck.length; i < j; i++) {
      var attr = attrCheck[i].attr;
      var setMandatoryExists = 'setMandatory' in attrCheck[i]; // if it doesn't exist just have to check whether one should set it to a mandatory value

      if (setMandatoryExists) {
        this.element.attr(attr, attrCheck[i].setMandatory);
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
  _onBlurHandler: function _onBlurHandler(event) {
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
  _onKeyDownHandler: function _onKeyDownHandler(event) {},

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
  _onKeyUpHandler: function _onKeyUpHandler(event) {
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
  _onCompositionStartHandler: function _onCompositionStartHandler() {
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
  _onCompositionEndHandler: function _onCompositionEndHandler(event) {
    this._isComposing = false; // On some browsers, compositionend event is fired before the final input event,
    // while it's the other way around on other browsers.  Just update rawValue here
    // anyway since _SetRawValue will compare the value before actually updating it.

    this._SetRawValue(this._GetContentElement().val(), event); // For languages like Japanese/Chinese, we need to update the counter once composing is over.


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
  _onInputHandler: function _onInputHandler(event) {
    // Update rawValue only if the user is not in the middle of composing a character.
    // Non-latin characters can take multiple keystrokes to compose one character.
    // The keystroke sequence is bracketed by compositionstart and compositionend events,
    // and each keystroke also fires the input event.  Including the intermediate input
    // in rawValue makes it hard to do meaningful validation.
    if (!this._isComposing) {
      if (this._hasMaxLength()) {
        this._filterTextAndSetValues(this.lastFilteredText, this._GetContentElement().val(), false, true);
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
  _DoWrapElement: function _DoWrapElement() {
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
  _DoWrapElementAndTriggers: function _DoWrapElementAndTriggers() {
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
  _CreateContainerWrapper: function _CreateContainerWrapper() {
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
  _AppendInputHelper: function _AppendInputHelper() {
    if (this._INPUT_HELPER_KEY && this._DoWrapElement()) {
      var describedBy = this.element.attr('aria-describedby') || '';

      var helperDescribedById = this._GetSubId(this._INPUT_HELPER_KEY);

      describedBy += ' ' + helperDescribedById;
      this.element.attr('aria-describedby', describedBy);
      this._inputHelper = $("<div class='oj-helper-hidden-accessible' aria-hidden='true' id='" + helperDescribedById + "'>" + this._EscapeXSS(this.getTranslatedString(this._INPUT_HELPER_KEY)) + '</div>');

      this._AppendInputHelperParent().append(this._inputHelper); // @HTMLUpdateOK append action of the div element created with escaped translated text, so ok

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
  _EscapeXSS: function _EscapeXSS(escapeMe) {
    return $('<span>' + escapeMe + '</span>').text();
  },

  /**
   * Which parent node the inputHelper should be appended to. Usually do not need to override.
   *
   * @protected
   * @instance
   * @memberof! oj.inputBase
   */
  _AppendInputHelperParent: function _AppendInputHelperParent() {
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
  _GetImplicitValidators: function _GetImplicitValidators() {
    var ret = this._superApply(arguments); // register a default RegExp validator if we have a valid pattern


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
  _CanSetValue: function _CanSetValue() {
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
  _refreshStateTheming: function _refreshStateTheming(option, value) {
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
  _getImplicitRegExpValidator: function _getImplicitRegExpValidator() {
    if (!this.options.pattern) {
      return null;
    }

    var regexpOptions = {
      pattern: this.options.pattern,
      label: this._getLabelText()
    };
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
  _GetAriaLabelElement: function _GetAriaLabelElement() {
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
  _GetSubId: function _GetSubId(sub) {
    return this.uuid + '_' + sub;
  },

  /**
   * @ignore
   * @protected
   * @return {boolean}
   * @memberof! oj.inputBase
   */
  _IsRTL: function _IsRTL() {
    return this._rtl;
  },

  /**
   * Returns if the element is a text field element or not.
   * @memberof oj.ojInputBase
   * @instance
   * @protected
   * @return {boolean}
   */
  _IsTextFieldComponent: function _IsTextFieldComponent() {
    return true;
  },

  /**
   * Wrappers the input component "content element".
   * @ignore
   * @protected
   * @memberof oj.ojInputBase
   * @instance
   */
  _GetContentWrapper: function _GetContentWrapper() {
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
  _resetLengthFilter: function _resetLengthFilter(lengthOptions) {
    this.lengthFilter = new LengthFilter(lengthOptions);
  },

  /**
   * Refresh the input element value based on the newly set filter options.
   * @memberof oj.ojInputBase
   * @instance
   * @protected
   * @ignore
   */
  _AfterSetOptionLength: function _AfterSetOptionLength(lengthOptions) {
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
  _setFocusOnTextAreaBind: function _setFocusOnTextAreaBind() {
    this._setFocusOnTextArea = function () {
      this.element[0].focus();
    }.bind(this);
  },

  /**
   * Processes the length attribute set on the component
   * @memberof oj.ojInputBase
   * @instance
   * @protected
   * @ignore
   */
  _processLengthCounterAttr: function _processLengthCounterAttr(lengthCounterAttr) {
    var wrapperElem = this._GetContentWrapper().parentElement;

    var counterEl = wrapperElem.querySelector('.' + this._TEXT_FIELD_COUNTER_CLASS);

    if (lengthCounterAttr === 'none' || lengthCounterAttr === undefined || lengthCounterAttr === null || this.options.length.max === 0 || this.options.disabled || this.options.readOnly) {
      // remove the icon if it is there
      if (counterEl) {
        counterEl.removeEventListener(this._CLICK_HANDLER_KEY, this._setFocusOnTextArea);
        wrapperElem.removeChild(counterEl);
      }

      this._counterSpanEl = null;
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
        this._counterSpanEl = document.querySelector('.' + this._TEXT_FIELD_COUNTER_CLASS + ' span');
        this._counterSpanEl.textContent = '';
      }

      var textLength;
      textLength = this.lengthFilter.calcLength(this.options.rawValue);
      this._counterSpanEl.textContent = this.options.length.max - textLength;
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
  _filterTextAndSetValues: function _filterTextAndSetValues(currentVal, proposedVal, setValue, processLengthCounter) {
    var filteredText = this.lengthFilter.filter(currentVal, proposedVal);
    this.lastFilteredText = filteredText;

    this._SetRawValue(filteredText, null);

    this._SetDisplayValue(filteredText, null);

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
  refresh: function refresh() {
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
  _refreshRequired: oj.EditableValueUtils._refreshRequired,

  /**
   * @memberof! oj.inputBase
   * @instance
   * @private
   */
  _labelledByChangedForInputComp: oj.EditableValueUtils._labelledByChangedForInputComp,

  /**
   * the validate method from v3.x that returns a boolean
   * @memberof! oj.inputBase
   * @instance
   * @protected
   * @ignore
   */
  _ValidateReturnBoolean: oj.EditableValueUtils._ValidateReturnBoolean,

  /**
     * the validate method that returns a Promise
     * @memberof! oj.inputBase
     * @instance
     * @protected
     * @ignore
     */
  _ValidateReturnPromise: oj.EditableValueUtils._ValidateReturnPromise,
  getNodeBySubId: function getNodeBySubId(locator) {
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
  validate: oj.EditableValueUtils.validate,

  /**
   * Called to find out if aria-required is unsupported.
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _AriaRequiredUnsupported: function _AriaRequiredUnsupported() {
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
  widget: function widget() {
    return this._DoWrapElement() ? this._wrapper : this.element;
  }
}, true);



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
 * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "required", "disabled", "readonly"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
 * @ojvbdefaultcolumns 6
 * @ojvbmincolumns 2
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
 * If there is no oj-label for the oj-input-password, add aria-label on oj-input-password
 * to make it accessible.
 * {@ojinclude "name":"accessibilityPlaceholderEditableValue"}
 * {@ojinclude "name":"accessibilityDisabledEditableValue"}
 * </p>
 *
 * <h3 id="label-section">
 *   Label and InputPassword
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate an oj-label to the oj-input-password component.
 * For accessibility, you should associate an oj-label element with the oj-input-password component
 * by putting an <code>id</code> on the oj-input-password element, and then setting the
 * <code>for</code> attribute on the oj-label to be the component's id.
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
oj.__registerWidget('oj.ojInputPassword', $.oj.inputBase, {
  version: '1.0.0',
  defaultElement: '<input>',
  widgetEventPrefix: 'oj',

  /**
   * @expose
   * @private
   * @memberof! oj.ojInputPassword
   */
  _ATTR_CHECK: [{
    attr: 'type',
    setMandatory: 'password'
  }],

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
    value: undefined // Events

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
     * @ignore
     * @override
     * @protected
     * @memberof! oj.ojInputPassword
     * @return {boolean}
     */
  _DoWrapElementAndTriggers: function _DoWrapElementAndTriggers() {
    this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES = this._INPUT_CONTAINER_CLASS;
    return true;
  },
  getNodeBySubId: function getNodeBySubId(locator) {
    var node = this._superApply(arguments);

    var subId;

    if (!node) {
      subId = locator.subId;

      if (subId === 'oj-inputpassword-input') {
        node = this.element ? this.element[0] : null;
      }
    } // Non-null locators have to be handled by the component subclasses


    return node || null;
  },

  /**
   * @override
   * @instance
   * @memberof! oj.ojInputPassword
   * @protected
   * @return {string}
   */
  _GetDefaultStyleClass: function _GetDefaultStyleClass() {
    return 'oj-inputpassword';
  }
}); // Fragments:

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
 *       <td>Sets focus to input. If hints, help.instruction or messages exist in a notewindow,
 *       popup the notewindow.</td>
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
 *       If hints, help.instruction or messages exist in a notewindow,
 *        pop up the notewindow.</td>
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
 * If there is no oj-label for the oj-input-text, add aria-label on oj-input-text
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
 *
 * <h3 id="label-section">
 *   Label and InputText
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate an oj-label with the oj-input-text component.
 * For accessibility, you should associate an oj-label element to the oj-input-text component
 * by putting an <code>id</code> on the oj-input-text element, and then setting the
 * <code>for</code> attribute on the oj-label to be the component's id.
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
oj.__registerWidget('oj.ojInputText', $.oj.inputBase, {
  version: '1.0.0',
  defaultElement: '<input>',
  widgetEventPrefix: 'oj',

  /**
   * @expose
   * @private
   */
  _ATTR_CHECK: [{
    attr: 'type',
    setMandatory: 'text'
  }],

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
     *
     *
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
     * The type of virtual keyboard to display for entering value on mobile browsers.  This attribute has no effect on desktop browsers.
     *
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
     * @type {string}
     * @ojvalue {string} "auto" The component will determine the best virtual keyboard to use.
     *                          <p>This is always "text" for this release but may change in future
     *                          releases.</p>
     * @ojvalue {string} "email" Use a virtual keyboard for entering email.
     * @ojvalue {string} "number" Use a virtual keyboard for entering number.
     *                            <p>Note that on Android and Windows Mobile, the "number" keyboard does
     *                            not contain the minus sign.  This value should not be used on fields that
     *                            accept negative values.</p>
     * @ojvalue {string} "search" Use a virtual keyboard for entering search terms.
     * @ojvalue {string} "tel" Use a virtual keyboard for entering telephone number.
     * @ojvalue {string} "text" Use a virtual keyboard for entering text.
     * @ojvalue {string} "url" Use a virtual keyboard for entering URL.
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
       * @alias length.max
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
       * @alias length.countBy
       * @ojshortdesc Specifies the manner in which the input text characters has to be counted.
       * @memberof! oj.ojInputText
       * @instance
       * @type {?string}
       * @ojvalue {string} 'codePoint' Uses code point to calculate the text length
       * @ojvalue {string} 'codeUnit' Uses code unit to calculate the text length
       * @default "codePoint"
       * @since 8.0.0
       */
      countBy: 'codePoint'
    } // Events

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
  _ComponentCreate: function _ComponentCreate() {
    var retVal = this._super(); // add in the clear icon if needed


    var clearIconAttr = this.options.clearIcon;

    this._processClearIconAttr(clearIconAttr);

    this._processSlottedChildren();

    this._AddHoverable(this._wrapper); // Set the input type attribute based on virtualKeyboard property


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
  _DoWrapElementAndTriggers: function _DoWrapElementAndTriggers() {
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
  _processClearIconAttr: function _processClearIconAttr(clearIconAttr) {
    var wrapperElem = this._GetContentWrapper().parentElement;

    var clearIconBtn = wrapperElem.querySelector('a.oj-inputtext-clear-icon-btn');

    if (clearIconAttr === 'never' || this.options.disabled || this.options.readOnly) {
      // remove the icon if it is there
      if (clearIconBtn) {
        wrapperElem.removeChild(clearIconBtn);
      } // if the clearIcon is not rendered, we shouldn't have these classes


      wrapperElem.classList.remove('oj-inputtext-clearicon-visible');
      wrapperElem.classList.remove('oj-inputtext-clearicon-conditional');
    } else {
      if (clearIconBtn === null) {
        var clearIcon;
        clearIconBtn = document.createElement('a');
        clearIconBtn.className = 'oj-inputtext-clear-icon-btn oj-component-icon oj-clickable-icon-nocontext';
        clearIconBtn.setAttribute('tabindex', '-1'); // clear icon is hidden from screen reader users.

        clearIconBtn.setAttribute('aria-hidden', 'true');
        clearIconBtn.setAttribute('target', '_blank');
        clearIcon = document.createElement('span');
        clearIcon.className = 'oj-inputtext-clear-icon';
        clearIconBtn.appendChild(clearIcon);
        wrapperElem.appendChild(clearIconBtn);
        clearIconBtn.addEventListener(this._CLICK_HANDLER_KEY, this._onClearIconClickHandler.bind(this));
      } // If clear-icon = "always", we want the icon visible all the time


      if (clearIconAttr === 'always') {
        wrapperElem.classList.add('oj-inputtext-clearicon-visible');
      } else {
        wrapperElem.classList.remove('oj-inputtext-clearicon-visible'); // For the conditional case, we render oj-form-control-empty-clearicon if the input doesn't
        // have a value, as we always want the clear icon hidden for this case.  When the input does
        // have a value, then we use oj-inputtext-clearicon-conditional, which has selectors for
        // oj-hover and oj-focus to determine when the icon is visible.

        wrapperElem.classList.add('oj-inputtext-clearicon-conditional');
        var val; // if the component is not fully rendered, then we need to use the value option's value
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
  _processSlottedChildren: function _processSlottedChildren() {
    function scrubSlots(slotMap) {
      var VALID_SLOTS = {
        contextMenu: true,
        start: true,
        end: true,
        '': true
      };
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
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.classList.add('oj-inputtext-start');
        contentContainer.parentElement.insertBefore(node, contentContainer);
      }
    }

    function processEndSlots(contentContainer, nodes) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.classList.add('oj-inputtext-end');
        contentContainer.parentElement.appendChild(node);
      }
    }

    var slotMap = oj.BaseCustomElementBridge.getSlotMap(this._getRootElement());
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
  _AfterSetOption: function _AfterSetOption(option, flags) {
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
  _onInputHandler: function _onInputHandler(event) {
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
  _onClearIconClickHandler: function _onClearIconClickHandler(event) {
    var elem = this.element[0];
    elem.value = ''; // we need to update the raw value to keep it in sync

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
  _onBlurHandler: function _onBlurHandler(event) {
    var wrapperNode = this._wrapper[0];
    var target = event.relatedTarget; // if this is the clear icon, skip the blur handler if it is an ancestor of the input text

    if (!(target && target.classList.contains('oj-inputtext-clear-icon-btn') && target.parentElement && oj.DomUtils.isAncestorOrSelf(wrapperNode, target.parentElement))) {
      this._super(event);
    } else {
      // We need to put the oj-focus back on the wrapperNode so that the icon
      // doesn't disappear on iOS and make it so that the click handler will fire.
      wrapperNode.classList.add('oj-focus');
    }
  },
  getNodeBySubId: function getNodeBySubId(locator) {
    var node = this._superApply(arguments);

    var subId;

    if (!node) {
      subId = locator.subId;

      if (subId === 'oj-inputtext-input') {
        node = this.element ? this.element[0] : null;
      }
    } // Non-null locators have to be handled by the component subclasses


    return node || null;
  },

  /**
   * @override
   * @instance
   * @memberof! oj.ojInputText
   * @protected
   * @return {string}
   */
  _GetDefaultStyleClass: function _GetDefaultStyleClass() {
    return 'oj-inputtext';
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputText
   */
  _GetTranslationsSectionName: function _GetTranslationsSectionName() {
    return 'oj-inputBase';
  },

  /**
   * Set the type of the input element based on virtualKeyboard option.
   * @memberof oj.ojInputText
   * @instance
   * @protected
   * @ignore
   */
  _SetInputType: oj.EditableValueUtils._SetInputType
}); // Fragments:

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
 *       <td>Sets focus to input. If hints, help.instruction or messages exist in a notewindow,
 *       popup the notewindow.</td>
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
 *       If hints, help.instruction or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputText
 */

/**
 * {@ojinclude "name":"ojStylingDocIntro"}
 * <p>The form control style classes can be applied to the component, or an ancestor element. When
 * applied to an ancestor element, all form components that support the style classes will be affected.
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
 *       <td>oj-form-control-full-width</td>
 *       <td>Changes the max-width to 100% so that form components will occupy
 *           all the available horizontal space
 *       </td>
 *     </tr>
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
 * <p>The <code class="prettyprint">start</code> slot is for adding a leading icon.
 * For example, an icon identifying the credit card type based on the value entered.
 * </p>
 *
 * @ojslot start
 * @ignore
 * @ojshortdesc The start slot enables adding a leading icon
 * @since 8.0.0
 * @memberof oj.ojInputText
 *
 * @example <caption>Initialize the input text with child content specified for the start slot:</caption>
 * &lt;oj-input-text on-raw-value-changed="[[changeCreditCardTypeIcon]]">
 *   &lt;a slot="start" ::class="[[creditCardTypeIcon]]" >&lt;/a>
 * &lt;/oj-input-text>
 */

/**
 * <p>The <code class="prettyprint">end</code> slot is for adding an associated action icon.
 * For example, a magnifying glass icon for a search field can be provided in this slot.
 * </p>
 *
 * @ojslot end
 * @ignore
 * @ojshortdesc The end slot enables adding a trailing associated action icon.
 * @since 8.0.0
 * @memberof oj.ojInputText
 *
 * @example <caption>Initialize the input text with child content specified for the end slot:</caption>
 * &lt;oj-input-text>
 *   &lt;oj-button slot="end" on-oj-action="[[performSearch]]" display="icons" >
 *     &lt;img slot="endIcon" src="search.png"/>Search
 *    &lt;/oj-button>
 * &lt;/oj-input-text>
 */



/* global Promise:false, Context:false */

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
 * If there is no oj-label for the oj-text-area, add aria-label on oj-text-area
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
 *
 * <h3 id="label-section">
 *   Label and TextArea
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate an oj-label to the oj-text-area component.
 * For accessibility, you should associate an oj-label element with the oj-text-area component
 * by putting an <code>id</code> on the oj-text-area element, and then setting the
 * <code>for</code> attribute on the oj-label to be the component's id.
 * </p>
 * <h3 id="binding-section">
 *   Declarative Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
 * </h3>
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
     *
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
     * give specific height to the textarea.
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
       * @alias length.max
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
       * @alias length.countBy
       * @ojshortdesc Specifies the manner in which the text area characters has to be counted.
       * @memberof! oj.ojTextArea
       * @instance
       * @type {?string}
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
       * @alias length.counter
       * @ojshortdesc The type of counter to display.
       * @memberof! oj.ojTextArea
       * @instance
       * @type {?string}
       * @ojvalue {string} 'none' The remaining characters count is not displayed.
       * @ojvalue {string} 'remaining' The remaining characters count is displayed.
       * @default "none"
       * @since 8.0.0
       */
      counter: 'none'
    } // Events

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
  _AfterSetOption: function _AfterSetOption(option, flags) {
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
  _AfterCreate: function _AfterCreate() {
    var ret = this._superApply(arguments);

    var textarea = this._GetContentElement()[0]; // unregister existing resize listener before emptying out the root


    var maxrows = this.options.maxRows;
    this._GetContentElement()[0].style.resize = this.options.resizeBehavior;

    if (maxrows === -1 || maxrows > textarea.rows) {
      if (!this._isConverAsync()) {
        this._calculateLineHeight(textarea);

        this._resizeTextArea();

        this._setupResizeTextareaBind();
      }
    }

    return ret;
  },

  /**
  * Do things here for creating the component where you need the converter, since
  * getting the converter can be asynchronous. We get the converter before calling
  * this method, so it is there.
  *
  * @protected
  * @override
  * @instance
  * @memberof! oj.ojTextArea
  */
  _AfterCreateConverterCached: function _AfterCreateConverterCached() {
    var ret = this._super(); // unregister existing resize listener before emptying out the root


    if (this._isConverAsync()) {
      var busyContext = Context.getContext(this.element[0]).getBusyContext();
      busyContext.whenReady().then(function () {
        var textarea = this._GetContentElement()[0];

        var maxrows = this.options.maxRows;

        if (maxrows === -1 || maxrows > textarea.rows) {
          this._calculateLineHeight(textarea);

          this._resizeTextArea();

          this._setupResizeTextareaBind();
        }
      });
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
  _setOption: function _setOption(key, value, flags) {
    var retVal = this._superApply(arguments);

    if (key === 'resizeBehavior') {
      this._GetContentElement()[0].style.resize = value;
    } else if (key === 'value') {
      // only resize if maxrows is more than rows
      var maxrows = this.options.maxRows;

      if (maxrows === -1 || maxrows > this._GetContentElement()[0].rows) {
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
  _NotifyAttached: function _NotifyAttached() {
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
  _onInputHandler: function _onInputHandler(event) {
    this._super(event);

    var textarea = this._GetContentElement()[0]; // only resize if maxrows is more than rows


    var maxrows = this.options.maxRows;

    if (maxrows === -1 || maxrows > textarea.rows) {
      this._resizeTextArea();
    }
  },

  /**
   * Resize the textarea based on the content
   *
   * @ignore
   * @protected
   * @memberof! oj.ojTextArea
   * @param {Event} event
   */
  _resizeTextArea: function _resizeTextArea() {
    var maxRows = this.options.maxRows;

    var textarea = this._GetContentElement()[0];

    var rows = textarea.rows;
    var heightOfRows;
    var resizedHeight; // this is an error condition, if rows > maxrows

    if (rows) {
      heightOfRows = rows * this._lineHeight;
    }

    textarea.style.height = 0; // if maxRows is -1 the textarea will grow to show all the content.

    if (maxRows === -1) {
      resizedHeight = textarea.scrollHeight;
    } else if (maxRows > rows) {
      // if maxRows is positive and greater than rows, the textarea will grow to fit the content, up to maxrows.
      var heightForMaximumRows = this._lineHeight * maxRows;
      var maxHeight = textarea.scrollHeight;

      if (maxHeight > heightForMaximumRows) {
        resizedHeight = heightForMaximumRows + this._getStylingHeight(textarea);
      } else {
        resizedHeight = maxHeight;
      }
    }

    if (heightOfRows && heightOfRows > resizedHeight) {
      resizedHeight = heightOfRows + this._getStylingHeight(textarea);
    }

    textarea.style.height = resizedHeight + 'px';
  },
  _setupResizeTextareaBind: function _setupResizeTextareaBind() {
    this._resizeTextareaBind = function () {
      var textarea = this._GetContentElement()[0]; // only resize if maxrows is more than rows


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
   */
  _getStylingHeight: function _getStylingHeight(textarea) {
    var cssStyle = window.getComputedStyle(textarea);
    var paddingTop = parseInt(cssStyle.paddingTop, 10);
    var paddingBottom = parseInt(cssStyle.paddingBottom, 10);
    var borderTopWidth = parseInt(cssStyle.borderTopWidth, 10);
    var borderBottomWidth = parseInt(cssStyle.borderBottomWidth, 10);
    return paddingTop + paddingBottom + borderTopWidth + borderBottomWidth;
  },

  /**
   * Calculates the line height for text-area
   *
   * @ignore
   * @protected
   * @memberof! oj.ojTextArea
   */
  _calculateLineHeight: function _calculateLineHeight(textarea) {
    var textareaOffsetHeight = textarea.offsetHeight - this._getStylingHeight(textarea);

    this._lineHeight = textareaOffsetHeight / textarea.rows;
  },

  /**
   * @ignore
   * @private
   */
  _cleanUpListeners: function _cleanUpListeners() {
    if (this._resizeTextareaBind) {
      window.removeEventListener('resize', this._resizeTextareaBind);
    }
  },

  /**
   * @ignore
   * @protected
   * @override
   */
  _ReleaseResources: function _ReleaseResources() {
    this._super();

    this._cleanUpListeners();
  },
  getNodeBySubId: function getNodeBySubId(locator) {
    var node = this._superApply(arguments);

    var subId;

    if (!node) {
      subId = locator.subId;

      if (subId === 'oj-textarea-input') {
        node = this.element ? this.element[0] : null;
      }
    } // Non-null locators have to be handled by the component subclasses


    return node || null;
  },

  /**
   * @ignore
   * @override
   * @protected
   * @memberof! oj.ojTextArea
   * @return {boolean}
   */
  _DoWrapElementAndTriggers: function _DoWrapElementAndTriggers() {
    this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES = this._INPUT_CONTAINER_CLASS;
    return true;
  },

  /**
   * @instance
   * @memberof! oj.ojTextArea
   * @override
   * @protected
   * @return {string}
   */
  _GetDefaultStyleClass: function _GetDefaultStyleClass() {
    return 'oj-textarea';
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojTextArea
   */
  _GetTranslationsSectionName: function _GetTranslationsSectionName() {
    return 'oj-inputBase';
  },

  /**
  * If the converter is async or not
  *
  * @ignore
  * @protected
  * @memberof! oj.ojTextArea
  */
  _isConverAsync: function _isConverAsync() {
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
  _onKeyUpHandler: function _onKeyUpHandler(event) {}
}); // Fragments:

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
 *       <td>Sets focus to textarea. If hints, help.instruction or messages exist in a notewindow,
 *       popup the notewindow.</td>
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
 *       If hints, help.instruction or messages exist in a notewindow,
 *        pop up the notewindow.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojTextArea
 */

/**
 * {@ojinclude "name":"ojStylingDocIntro"}
 * <p>The form control style classes can be applied to the component, or an ancestor element. When
 * applied to an ancestor element, all form components that support the style classes will be affected.
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
 *       <td>oj-form-control-full-width</td>
 *       <td>Changes the max-width to 100% so that form components will occupy
 *           all the available horizontal space
 *       </td>
 *     </tr>
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



/* global __oj_input_password_metadata:false */
(function () {
  __oj_input_password_metadata.extension._WIDGET_NAME = 'ojInputPassword';
  __oj_input_password_metadata.extension._INNER_ELEM = 'input';
  __oj_input_password_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['accesskey', 'aria-label', 'tabindex'];
  __oj_input_password_metadata.extension._ALIASED_PROPS = {
    readonly: 'readOnly'
  };
  oj.CustomElementBridge.register('oj-input-password', {
    metadata: __oj_input_password_metadata
  });
})();
/* global __oj_input_text_metadata:false */


(function () {
  __oj_input_text_metadata.extension._WIDGET_NAME = 'ojInputText';
  __oj_input_text_metadata.extension._INNER_ELEM = 'input';
  __oj_input_text_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['accesskey', 'aria-label', 'tabindex'];
  __oj_input_text_metadata.extension._ALIASED_PROPS = {
    readonly: 'readOnly'
  };
  oj.CustomElementBridge.register('oj-input-text', {
    metadata: __oj_input_text_metadata
  });
})();
/* global __oj_text_area_metadata:false */


(function () {
  __oj_text_area_metadata.extension._WIDGET_NAME = 'ojTextArea';
  __oj_text_area_metadata.extension._INNER_ELEM = 'textarea';
  __oj_text_area_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['accesskey', 'aria-label', 'tabindex'];
  __oj_text_area_metadata.extension._ALIASED_PROPS = {
    readonly: 'readOnly'
  };
  oj.CustomElementBridge.register('oj-text-area', {
    metadata: __oj_text_area_metadata
  });
})();

});