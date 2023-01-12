/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import $ from 'jquery';
import 'ojs/ojcontext';
import 'ojs/ojbutton';
import { EditableValueUtils } from 'ojs/ojeditablevalue';
import { setDefaultOptions, createDynamicPropertyGetter } from 'ojs/ojcomponentcore';
import { unwrap, recentTouchEnd } from 'ojs/ojdomutils';
import { getCachedCSSVarValues } from 'ojs/ojthemeutils';
import { error, warn } from 'ojs/ojlogger';
import NumberRangeValidator from 'ojs/ojvalidator-numberrange';
import { IntlNumberConverter } from 'ojs/ojconverter-number';

(function () {
var __oj_input_number_metadata = 
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
    "max": {
      "type": "number"
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "min": {
      "type": "number"
    },
    "name": {
      "type": "string",
      "value": "",
      "extension": {
        "_COPY_TO_INNER_ELEM": true
      }
    },
    "placeholder": {
      "type": "string",
      "value": ""
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
    "step": {
      "type": "number"
    },
    "transientValue": {
      "type": "number",
      "writeback": true,
      "readOnly": true
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "numberRange": {
          "type": "object",
          "properties": {
            "hint": {
              "type": "object",
              "properties": {
                "exact": {
                  "type": "string"
                },
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
                "exact": {
                  "type": "string"
                },
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
        "tooltipDecrement": {
          "type": "string"
        },
        "tooltipIncrement": {
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
    "validators": {
      "type": "Array<Object>",
      "value": []
    },
    "value": {
      "type": "number",
      "writeback": true
    },
    "virtualKeyboard": {
      "type": "string",
      "enumValues": [
        "auto",
        "number",
        "text"
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
    "stepDown": {},
    "stepUp": {},
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
  __oj_input_number_metadata.extension._WIDGET_NAME = 'ojInputNumber';
  __oj_input_number_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
  __oj_input_number_metadata.extension._INNER_ELEM = 'input';
  __oj_input_number_metadata.extension._GLOBAL_TRANSFER_ATTRS = [
    'accesskey',
    'aria-label',
    'tabindex'
  ];

  oj.CustomElementBridge.register('oj-input-number', {
    metadata: oj.CollectionUtils.mergeDeep(__oj_input_number_metadata, {
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
    })
  });
})();

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

// jeanne retrieved from https://raw.github.com/jquery/jquery-ui/1-10-stable/ui/jquery.ui.spinner.js on 6/2013, and then modified

/**
 * @private
 */
var _sDefaultNumberConverter;

/**
 * For default converter
 * @static
 * @ignore
 */
function _getNumberDefaultConverter() {
  return new IntlNumberConverter(null);
}

/*!
 * JET InputNumber @VERSION
 *
 *
 * Depends:
 *  jquery.ui.widget.js
 */
(function () {
  // inputNumber wrapper function, to keep "private static members" private
  /**
   * @ojcomponent oj.ojInputNumber
   * @augments oj.editableValue
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojInputNumber extends editableValue<number|null, ojInputNumberSettableProperties, number|null, string>"
   *               },
   *               {
   *                target: "Type",
   *                value: "ojInputNumberSettableProperties extends editableValueSettableProperties<number|null, number|null, string>",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @since 0.6.0
   * @ojshortdesc An input number allows the user to enter a number value.
   * @ojrole textbox
   * @ojrole spinbutton
   *
   * @ojimportmembers oj.ojDisplayOptions
   * @ojtsimport {module: "ojvalidationfactory-base", type: "AMD", imported:["Validation"]}
   * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
   * @ojtsimport {module: "ojvalidator", type: "AMD", importName: "Validator"}
   * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
   * @ojtsimport {module: "ojconverter-number", type: "AMD",  imported: ["IntlNumberConverter", "NumberConverter"]}
   * @ojtsimport {module: "ojvalidator-length", type: "AMD", importName: "LengthValidator"}
   * @ojtsimport {module: "ojvalidator-numberrange", type: "AMD", importName: "NumberRangeValidator"}
   * @ojtsimport {module: "ojvalidator-regexp", type: "AMD", importName: "RegExpValidator"}
   * @ojtsimport {module: "ojvalidator-required", type: "AMD", importName: "RequiredValidator"}
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "min", "max", "step", "required", "disabled", "readonly", "virtualKeyboard", "converter"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-input-number'
   * @ojuxspecs ['input-number']
   *
   * @classdesc
   * <h3 id="inputNumberOverview-section">
   *   JET InputNumber Component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputNumberOverview-section"></a>
   * </h3>
   * <p>Description: The oj-input-number component enhances a browser input element
   * into one that holds numbers and it has a spinbox to quickly increment or
   * decrement the number. The <code class="prettyprint">value</code> attribute must be a number and must
   * be within the <code class="prettyprint">min</code> and <code class="prettyprint">max</code> range.
   * </p>
   * <p>A step mismatch is when
   * the value is not a multiple of <code class="prettyprint">step</code>,
   * starting at the <code class="prettyprint">min</code>
   * else initial vlaue if no <code class="prettyprint">min</code> is set, else 0.
   * A step mismatch will not be flagged as a validation error by default, but
   * the step up and step down feature will change the value to be a step match
   * if it isn't already.
   * </p>
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
   * The component is accessible; it sets and maintains the appropriate aria- attributes,
   * like aria-valuenow, aria-valuemax, aria-valuemin and aria-valuetext.
   * </p>
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
   * To migrate from oj-input-number to oj-c-input-number, you need to revise the import statement
   * and references to oj-c-input-number in your app. Please note the changes between the two components below.
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
   * <h5>New converters</h5>
   * <p>
   * New converters are available. See <a href="BigDecimalStringConverter.html" target="_blank">BigDecimalStringConverter</a>
   * and <a href="NumberConverter.html" target="_blank">NumberConverter</a> for more details.
   * </p>
   * <p>
   * oj-c-input-number uses NumberConverter as its default converter whereas oj-input-number uses IntlNumberConverter as its default converter.
   * The default converter used by oj-c-input-number does not currently respect user preferences.
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
   * <ul>
   * <li>The translations.required.message-detail attribute has changed to required-message-detail.
   * </li>
   * <li>The translations.number-range.message-detail.exact attribute has changed to number-range-exact-message-detail.
   * </li>
   * <li>The translations.number-range.message-detail.overflow attribute has changed to number-range-overflow-message-detail.
   * </li>
   * <li>The translations.number-range.message-detail.underflow attribute has changed to number-range-underflow-message-detail.
   * </li>
   * </ul>
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
   * <h5>StepDown method</h5>
   * <p>
   * The stepDown method is no longer supported. Please programmatically set the value instead.
   * </p>
   *
   * <h5>StepUp method</h5>
   * <p>
   * The stepUp method is no longer supported. Please programmatically set the value instead.
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
   * @example <caption>Declare the oj-input-number component with no attributes specified:</caption>
   * &lt;oj-input-number>&lt;/oj-input-number>
   *
   * @example <caption>Initialize the component with some attributes:</caption>
   * &lt;oj-input-number id="numberId" max="100" min="0" step="2">&lt;/oj-input-number>
   *
   * @example <caption>Initialize a component attribute via component binding:</caption>
   * &lt;oj-input-number id="numberId" value="{{currentValue}}">&lt;/oj-input-number>
   */

  //----------------------------------------------------------------
  //      API doc for inherited methods with no JS in this file
  //----------------------------------------------------------------

  /**
   * Removes the inputNumber functionality completely.
   * This will return the element back to its pre-init state.
   *
   * <p>This method does not accept any arguments.
   *
   * @method
   * @name oj.ojInputNumber#destroy
   * @memberof oj.ojInputNumber
   * @instance
   * @ignore
   *
   * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
   * myComp.destroy();
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
   *       <td>Up Button</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Increment the number.</td>
   *     </tr>
   *     <tr>
   *       <td>Down Button</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Decrement the number.</td>
   *     </tr>
   *     <tr>
   *       <td>Input</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Set focus to the input. Show user assistance text. This may be inline or in a notewindow
   * depending upon theme and property settings.</td>
   *     </tr>
   *     <tr>
   *       <td>Elsewhere on Page</td>
   *       <td><kbd>Touch</kbd></td>
   *       <td>Submit the value you typed in the input field.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputNumber
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
   *       <td rowspan="4">Input</td>
   *       <td><kbd>Enter</kbd> or <kbd>Tab</kbd></td>
   *       <td>Submit the value you typed in the input field.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to input. Show user assistance text. This may be inline or in a notewindow
   * depending upon theme and property settings.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>UpArrow</kbd></td>
   *       <td>Increment the number.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>DownArrow</kbd></td>
   *       <td>Decrement the number.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputNumber
   */

  //-----------------------------------------------------
  //                   Sub-ids
  //-----------------------------------------------------

  /**
   * <p>Sub-ID for the inputNumber's Up arrow.</p>
   *
   * @ojsubid oj-inputnumber-up
   * @memberof oj.ojInputNumber
   *
   * @example <caption>Get the node for the Up arrow:</caption>
   * var node = myComp.getNodeBySubId('oj-inputnumber-up');
   */

  /**
   * <p>Sub-ID for the inputNumber's Down arrow.</p>
   *
   * @ojsubid oj-inputnumber-down
   * @memberof oj.ojInputNumber
   *
   * @example <caption>Get the node for the Down arrow:</caption>
   * var node = myComp.getNodeBySubId('oj-inputnumber-down);
   */

  /**
   * <p>Sub-ID for the inputNumber's input element.</p>
   * @ojsubid oj-inputnumber-input
   * @memberof oj.ojInputNumber
   *
   * @example <caption>Get the node for the input element:</caption>
   * var node = myComp.getNodeBySubId('oj-inputnumber-input');
   */

  //-----------------------------------------------------
  //                   Styling
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
   * @memberof oj.ojInputNumber
   * @ojtsexample
   * &lt;oj-input-number class="oj-form-control-full-width">
   * &lt;/oj-input-number>
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
   * @memberof oj.ojInputNumber
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-input-number class="oj-form-control-max-width-md">&lt;/oj-input-number>
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-sm
   * @ojshortdesc Sets the max width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojInputNumber
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-md
   * @ojshortdesc Sets the max width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojInputNumber
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
   * @memberof oj.ojInputNumber
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-input-number class="oj-form-control-width-md">&lt;/oj-input-number>
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-sm
   * @ojshortdesc Sets the width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojInputNumber
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-md
   * @ojshortdesc Sets the width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojInputNumber
   */

  // ---------------- oj-form-control-text-align- --------------
  /**
   * Classes that help align text of the element.
   * @ojstyleset text-align
   * @ojdisplayname Text Alignment
   * @ojstylesetitems ["text-align.oj-form-control-text-align-right", "text-align.oj-form-control-text-align-start", "text-align.oj-form-control-text-align-end"]
   * @ojstylerelation exclusive
   * @memberof oj.ojInputNumber
   * @ojtsexample
   * &lt;oj-input-number class="oj-form-control-text-align-right">
   * &lt;/oj-input-number>
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-right
   * @ojshortdesc Aligns the text to the right regardless of the reading direction. This is normally used for right aligning numbers.
   * @ojdisplayname Align-Right
   * @memberof! oj.ojInputNumber
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-start
   * @ojshortdesc Aligns the text to the left in LTR and to the right in RTL.
   * @ojdisplayname Align-Start
   * @memberof! oj.ojInputNumber
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-end
   * @ojshortdesc Aligns the text to the right in LTR and to the left in RTL.
   * @ojdisplayname Align-End
   * @memberof! oj.ojInputNumber
   */
  // --------------------------------------------------- oj.ojInputNumber Styling end ------------------------------------------------------------

  oj.__registerWidget('oj.ojInputNumber', $.oj.editableValue, {
    version: '1.0.0',
    defaultElement: '<input>',
    widgetEventPrefix: 'oj',

    /**
     * @private
     */
    _ALLOWED_TYPES: ['number', 'text'],

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
       * for the <code class="prettyprint">{@link oj.ojInputNumber#validators}</code> attribute.
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
       *  &lt;oj-input-number value="{{value}}"
       *  async-validators="[[[asyncValidator1]]]">&lt;/oj-input-number>
       * @example <caption>Initialize the component with multiple AsyncValidator
       * duck-typed instances:</caption>
       * -- HTML --
       * &lt;oj-input-number id="asyncValKo1" data-oj-context
                  valid="{{koAsyncValid}}" value="{{koAsyncValue}}"
                  required validators="[[[checkfoo, checkfooey]]]"
                  async-validators="[[[asyncValidator1, asyncValidator2]]]">&lt;/oj-input-number>
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
       *     if (value === 100 || value === 1000) {
       *       resolve(true);
       *     } else {
       *       reject(new Error("value isn't 100 or 1000. It is " + value.));
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
       * @memberof oj.ojInputNumber
       * @ojshortdesc Specifies a list of asynchronous validators used by the component when performing validation. Use async-validators when you need to perform some validation work on the server. See the Help documentation for more information.
       * @ojsignature  { target: "Type",
       *       value: "Array<oj.AsyncValidator<number>>",
       *       jsdocOverride: true}
       * @type {Array.<Object>}
       * @default []
       */
      asyncValidators: [],
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
       *
       * @example <caption>Initialize component with <code class="prettyprint">autocomplete</code> attribute:</caption>
       * &lt;oj-input-number autocomplete = "on">&lt;/oj-input-number>
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
       * @access public
       * @memberof oj.ojInputNumber
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
       * &lt;oj-input-number autofocus>&lt;/oj-input-number>
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
       * @access public
       * @default false
       * @instance
       * @memberof oj.ojInputNumber
       * @ojshortdesc Specifies whether the component will get input focus when the page is loaded. See the Help documentation for more information.
       * @ojextension {_COPY_TO_INNER_ELEM: true}
       */
      autofocus: false,
      // TODO: revisit
      // It's expensive to create a default converter ahead of time when a page author can set a custom
      // one for if they do this will be promptly discarded.

      /**
       * A number converter instance or a Promise to a number converter instance
       * or one that duck types {@link oj.NumberConverter}. The number converter instance defaults
       * to options suitable for the current locale.
       * <p>
       * When no converter is specified, the default converter will be used,
       * and default option of "numeric" is used.
       * </p>
       * <p>
       *  During validation, the converter takes the input value and parses it into the
       * type of the component's value property (i.e. a number) before it passes
       *  it to the validator. It then takes the validated value property and formats it
       *  into a string and puts it into the input. If the converter's format or parse functions
       *  throw an error, it will be displayed to the user.
       * </p>
       * <p>
       * When <code class="prettyprint">converter</code> property changes due to programmatic
       * intervention, the component performs various tasks based on the current state it is in. </br>
       * When initialized with no options, the default options for the current locale are assumed. </br>
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
       *
       * <h4>Steps Performed Always When Converter Is Changed</h4>
       * <ul>
       * <li>Any cached converter instance is cleared and new converter created. The converter hint is
       * pushed to messaging. E.g., notewindow displays the new hint(s).
       * </li>
       * </ul>
       *
       * <h4>Running Validation</h4>
       * <ul>
       * <li>if component is valid when <code class="prettyprint">converter</code> property changes, the
       * display value is refreshed.</li>
       * <li>if component is invalid and is showing messages when
       * <code class="prettyprint">converter</code> property changes, then all messages generated by the
       * component are cleared and full validation run using its current display value.
       * <ul>
       *   <li>if there are validation errors, then <code class="prettyprint">value</code>
       *   property is not updated, and the errors are shown. The display value is not refreshed in this case. </li>
       *   <li>if no errors result from the validation, <code class="prettyprint">value</code>
       *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
       *   event to clear custom errors. The display value is refreshed with the formatted
       *   value provided by converter.</li>
       * </ul>
       * </li>
       * <li>if component is invalid and has deferred messages when
       * <code class="prettyprint">converter</code> property changes, then the display value is
       * refreshed with the formatted value provided by converter.</li>
       * </ul>
       * </p>
       *
       * <h4>Clearing Messages</h4>
       * <ul>
       * <li>messages created by
       * the component  are cleared.</li>
       * <li><code class="prettyprint">messagesCustom</code> property is not cleared. Page authors can
       * choose to clear it explicitly when setting the converter property.</li>
       * </ul>
       * </p>
       *
       *
       * @example <caption>Initialize component to use default converter</caption>
       * &lt;oj-input-number value="25000">&lt;/oj-input-number>
       *
       * @example <caption>Initialize the component with a number converter instance:</caption>
       * // Initialize converter instance using currency options
       * var options = {style: 'currency', 'currency': 'USD', maximumFractionDigits: 0};
       * var salaryConverter = new NumberConverter.IntlNumberConverter(options);<br/>
       * // set converter instance using converter attribute
       * &lt;oj-input-number value="25000" converter="[[salaryConverter]]">&lt;/oj-input-number>
       *
       *
       * @example <caption>Get or set the <code class="prettyprint">converter</code> property after initialization:</caption>
       * // Getter
       * var convtr = myComponent.converter;
       *
       * // Setter
       * myComponent.converter = salaryConverter;
       *
       *
       * @default new IntlNumberConverter()
       *
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojInputNumber
       * @ojshortdesc An object that converts the value. See the Help documentation for more information.
       * @ojsignature [{
       *    target: "Type",
       *    value: "Promise<oj.Converter<number>>|oj.Converter<number>",
       *    jsdocOverride: true},
       * {target: "Type",
       *    value: "Promise<oj.Converter<number>>|oj.Converter<number>|oj.Validation.RegisteredConverter",
       *    consumedBy: 'tsdep'}]
       * @ojdeprecated {since: '8.0.0', target: 'memberType', value: ['oj.Validation.RegisteredConverter'],
       *                description:'Defining a converter with an object literal with converter type and its options
       *                  (aka JSON format) has been deprecated and does nothing. If needed, you can make the JSON format
       *                  work again by importing the deprecated ojvalidation-number module.'}
       * @type {Object}
       */
      converter: null,
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
       * &lt;oj-label for="numberId">Number:&lt;/oj-label>
       * &lt;oj-input-number id="numberId">
       * &lt;/oj-input-number>
       * // ojLabel then writes the labelled-by attribute on the oj-input-number.
       * &lt;oj-label id="labelId" for="numberId">Number:&lt;/oj-label>
       * &lt;oj-input-number id="numberId" labelled-by"labelId">
       * &lt;/oj-input-number>
       *
       * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property after initialization:</caption>
       * // getter
       * var labelledBy = myComp.labelledBy;
       *
       * // setter
       * myComp.labelledBy = "labelId";
       *
       * @expose
       * @ojshortdesc The oj-label sets the labelledBy property programmatically on the form component.
       * @type {string|null}
       * @default null
       * @public
       * @instance
       * @since 7.0.0
       * @memberof oj.ojInputNumber
       */
      labelledBy: null,

      /**
       * The maximum allowed value. This number is used in the range validator; if the
       * <code class="prettyprint">value</code> is greater than the <code class="prettyprint">max</code>,
       * then the range validator flags an error to the user. The up arrow
       *  is disabled when the maximum value is reached.
       * <p>
       *  <code class="prettyprint">Max</code> must be a
       *  <code class="prettyprint">number</code> or <code class="prettyprint">null</code>;
       *  <code class="prettyprint">null</code> indicates no maximum.
       * <p>
       * The <code class="prettyprint">max</code> must not be less than the
       * <code class="prettyprint">min</code>, else an Error is thrown during initialization.
       * @expose
       * @memberof oj.ojInputNumber
       * @ojshortdesc The maximum allowed value. A value of null indicates that there is no maximum. See the Help documentation for more information.
       * @instance
       * @type {?number}
       * @default null
       * @example <caption>Initialize the inputNumber with the
       * <code class="prettyprint">max</code> attribute specified:</caption>
       * &lt;oj-input-number max="100">&lt;/oj-input-number>
       *
       * @example <caption>Change the <code class="prettyprint">max</code> property to a float:</caption>
       * myComponent.max = 100.5;
       *
       * @example <caption>To remove the maximum range restriction from inputNumber:</caption>
       * myComponent.max =  null;
       *
       * @example <caption>Get or set the <code class="prettyprint">max</code> property after initialization:</caption>
       * // Getter
       * var max = myComponent.max;
       *
       * // Setter
       * myComponent.max = 100;
       */
      max: null,

      /**
       * The minimum allowed value. This number is used in the range validator; if the
       * <code class="prettyprint">value</code> is less than the <code class="prettyprint">min</code>,
       * then the range validator flags an error to the user. The down arrow
       *  is disabled when the minimum value is reached.
       *  <p>
       *  <code class="prettyprint">Min</code> must be a <code class="prettyprint">number</code> or <code class="prettyprint">null</code>;
       *  <code class="prettyprint">null</code> indicates no minimum.
       * <p>
       * The <code class="prettyprint">max</code> must not be less than the
       * <code class="prettyprint">min</code>, else an Error is thrown during initialization.
       * @expose
       * @memberof oj.ojInputNumber
       * @ojshortdesc The minimum allowed value. A value of null indicates that there is no minimum. See the Help documentation for more information.
       * @instance
       * @type {?number}
       * @default null
       * @example <caption>Initialize the inputNumber with the
       * <code class="prettyprint">min</code> attribute specified:</caption>
       * &lt;oj-input-number min="0">&lt;/oj-input-number>
       *
       * @example <caption>Get or set the <code class="prettyprint">min</code> property after initialization:</caption>
       * // Getter
       * var min = myComponent.min;
       *
       * // Setter
       * myComponent.min = 0;
       *
       * @example <caption>Change the <code class="prettyprint">min</code> property to a float:</caption>
       * myComponent.min = 10.5;
       *
       * @example <caption>To remove the minimum range restriction from inputNumber:</caption>
       * myComponent.min =  null;
       *
       */
      min: null,
      /**
       * It indicates the name of the component.
       *
       * @example <caption>Initialize component with <code class="prettyprint">name</code> attribute:</caption>
       * &lt;oj-input-number name="myName">&lt;/oj-input-number>
       *
       * @example <caption>Get or set the <code class="prettyprint">name</code> property after initialization:</caption>
       * // getter
       * var ro = myComp.name;
       *
       * // setter
       * myComp.name = "myName";
       *
       * @expose
       * @type {string}
       * @ojshortdesc Specifies the name of the component.
       * @access public
       * @instance
       * @default ""
       * @ojdeprecated {since: '6.0.0', description: 'JET does not use form submit, so this is not needed.'}
       * @ojtsignore
       * @memberof oj.ojInputNumber
       * @ojextension {_COPY_TO_INNER_ELEM: true}
       */
      name: '',
      /**
       * The placeholder text to set on the element.
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">placeholder</code> attribute:</caption>
       * &lt;oj-input-number placeholder="Enter a number">&lt;/oj-input-number>
       *
       * @example <caption>Get or set the <code class="prettyprint">placeholder</code> property after initialization:</caption>
       * // Getter
       * var placeholder = myComponent.placeholder;
       *
       * // Setter
       * myComponent.placeholder = "Address";
       *
       * If the attribute is not set then the default can be a converter hint. See display-options for
       * details.
       *
       * @expose
       * @instance
       * @default ""
       * @memberof oj.ojInputNumber
       * @type {string|null}
       * @ojtranslatable
       */
      placeholder: '',
      /**
       * <p>The <code class="prettyprint">rawValue</code> is the read-only property for retrieving
       * the current value from the input field in string form. The main consumer of
       * <code class="prettyprint">rawValue</code> is a converter.</p>
       * <p>
       * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
       * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed.
       * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2',
       * ..., and finally '1,200'. Then when the user blurs or presses Enter
       * the <code class="prettyprint">value</code> property gets updated.
       * </p>
       * <p>This is a read-only property so page authors cannot set or change it directly.</p>
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojInputNumber
       * @ojshortdesc Read-only property used for retrieving the current value from the input field in string form. See the Help documentation for more information.
       * @type {string}
       * @ojsignature {target:"Type", value:"string"}
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
       * &lt;oj-input-number readonly>&lt;/oj-input-number>
       *
       * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
       * // Getter
       * var readonly = myComponent.readonly;
       *
       * // Setter
       * myComponent.readonly = false;
       *
       * @default false
       * @access public
       * @expose
       * @type {?boolean}
       * @name readonly
       * @instance
       * @memberof oj.ojInputNumber
       * @ojshortdesc Specifies whether the component is read-only.  A read-only element cannot be modified, but user interaction is allowed. See the Help documentation for more information.
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
       * &lt;oj-input-number required>&lt;/oj-input-number><br/>
       *
       * @example <caption>Customize messages and hints used by implicit required validator when
       * <code class="prettyprint">required</code> attribute is set:</caption>
       * &lt;oj-input-number required translations='{"required": {
       *                 "hint": "custom: enter at least 3 alphabets",
       *                 "messageSummary": "custom: \'{label}\' is Required",
       *                 "messageDetail": "custom: please enter a valid value for \'{label}\'"}}'>
       * &lt;/oj-input-number>
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
       * @memberof oj.ojInputNumber
       * @ojshortdesc Specifies whether the component is required or optional. See the Help documentation for more information.
       * @type {boolean}
       * @default false
       * @since 0.7.0
       * @see #translations
       */
      required: false,
      /**
       * The size of the step to take when spinning via buttons or via the up/down arrows or via the
       * <code class="prettyprint">stepUp()</code>/<code class="prettyprint">stepDown()</code> methods.
       * If step is 0, inputNumber will not have buttons or up/down spin functionality.
       * If step is less than 0, an exception is thrown.
       * <p><code class="prettyprint">step</code> defaults to <code class="prettyprint">1</code>
       * in all themes except the redwood theme where it defaults to <code class="prettyprint">0</code>.
       * </p>
       * <p>
       * <p>
       * The <code class="prettyprint">step</code> attribute can be used together
       * with the <code class="prettyprint">min</code> and
       * <code class="prettyprint">max</code> attributes
       * to create a range of values the up/down arrows will step through. For example,
       * if min is 0 and step is 3, the range of values is 0, 3, 6, etc.
       * </p>
       * <p>
       * The up/down arrows will spin the value and adjust it to keep it a
       * 'step match' value.
       * A 'step match' value is when the value is a multiple
       * of <code class="prettyprint">step</code>,
       * starting at the <code class="prettyprint">min</code>, and if
       * <code class="prettyprint">min</code> is not set,
       * then starting at the initial <code class="prettyprint">value</code>,
       * and if neither <code class="prettyprint">min</code> and initial
       * <code class="prettyprint">value</code> are set,
       * then starting at 0.
       * </p>
       * <p>When using step > 1 with min and/or max,
       * make sure the initial value and max are both a 'step match' value,
       * otherwise the first step will adjust the value in a way
       * that could confuse the user.</p>
       * </p>
       * <p>
       * A value can be a step mismatch; if the <code class="prettyprint">value</code> is set
       * to be a step mismatch, it will not be flagged as a validation error.
       * </p>
       * @expose
       * @instance
       * @type {?number}
       * @ojexclusivemin -1
       * @memberof oj.ojInputNumber
       * @ojshortdesc Specifies the amount to increase or decrease the value when moving in step increments. If 0, no step functionality. See the Help documentation for more information.
       * @access public
       * @example <caption>Initialize the inputNumber with the
       * <code class="prettyprint">step</code> attribute specified:</caption>
       * &lt;oj-input-number step="2">&lt;/oj-input-number>
       *
       * @example <caption>Get or set the <code class="prettyprint">step</code> property after initialization:</caption>
       * // Getter
       * var step = myComponent.step;
       *
       * // Setter
       * myComponent.step = 5;
       * */
      step: 1,
      /**
       * <p>The <code class="prettyprint">transientValue</code> is the read-only attribute for
       * retrieving the transient value from the component.</p>
       * <p>
       * The <code class="prettyprint">transientValue</code> updates to display the transient
       * changes from pressing the up or down arrow (subject to the step constraints).
       * <code class="prettyprint">transientValue</code> will update only if it passes
       * validation.
       * </p>
       * <p>
       * The difference
       * in behavior is
       * <code class="prettyprint">transientValue</code> will be updated
       * as the up or down arrow is pressed (and only if validation succeeds),
       * whereas <code class="prettyprint">value</code>
       * is updated only after the up or down arrow is released
       * (and only if validation succeeds).
       * </p>
       * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
       * @expose
       * @access public
       * @instance
       * @default null
       * @memberof oj.ojInputNumber
       * @ojshortdesc Read-only property used for retrieving the transient value from the component. See the Help documentation for more information.
       * @type {?number}
       * @since 6.2.0
       * @readonly
       * @ojwriteback
       *
       */
      transientValue: null,
      /**
       * List of validators, synchronous or asynchronous,
       * used by component along with asynchronous validators from the deprecated async-validators option
       * and the implicit component validators when performing validation. Each item is either an
       * instance that duck types {@link oj.Validator} or {@link oj.AsyncValidator}.
       * <p>
       * Implicit validators are created by the element when certain attributes are present.
       * For example, if the <code class="prettyprint">required</code>
       * attribute is set, an implicit {@link oj.RequiredValidator} is created. If the
       * <code class="prettyprint">min</code> and/or <code class="prettyprint">max</code> attribute
       * is set, an implicit {@link oj.NumberRangeValidator} is created.
       * At runtime when the component runs validation, it
       * combines all the implicit validators with all the validators
       * specified through this <code class="prettyprint">validators</code> attribute
       * and the deprecated <code class="prettyprint">async-validators</code> attribute, and
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
       * <li>The cached list of validator instances are cleared and new validator hints are pushed to
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
       * <br/>
       *
       * @example <caption>Initialize the component with a Validator instance:</caption>
       * &lt;oj-input-number validators='[[[myRegExpValidator]]]'>
       * &lt;/oj-input-number>
       * self.myRegExpValidator = new RegExpValidator({
       *   pattern: "[a-zA-Z0-9]{3,}",
       *   messageDetail: "You must enter at least 3 letters or numbers"});
       * @example <caption>Initialize the component with a custom validator:</caption>
       * // A custom validator whose validate method, ensures that the value is not 100.
       * self.no100Validator = {
       *   'validate' : function (value) {
       *      value = value + "";
       *      if (value === 100) {
       *        throw new Error("You cannot enter a value that is 100!!");
       *      }
       *      return true;
       *    },
       *    'getHint': function() {
       *       return null;
       *    }
       *  };
       * ...
       * HTML
       * ----
       * &lt;oj-input-number validators='[[[no100Validator,someOtherValidator]]]'>
       * &lt;/oj-input-number>
       *
       * @example <caption>Get or set the <code class="prettyprint">validators</code> property after initialization:</caption>
       * // getter
       * var validators = myComp.validators;
       *
       * // setter
       * myComp.validators = myValidators;
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojInputNumber
       * @ojshortdesc Specifies a list of validators for performing validation by the element. See the Help documentation for more information.
       * @ojsignature  [{ target: "Type",
       *       value: "Array<oj.Validator<number>|oj.AsyncValidator<number>",
       *       jsdocOverride: true},
       * { target: "Type",
       *       value: "Array<oj.Validator<number>|oj.AsyncValidator<number>|
       *       oj.Validation.RegisteredValidator>",
       *       consumedBy: 'tsdep'}]
       * @ojdeprecated {since: '8.0.0', target: 'memberType', value: ['oj.Validation.RegisteredValidator'],
       *                description: 'Defining a validator with an object literal with validator type and
       *                  its options (aka JSON format) has been deprecated and does nothing. If needed, you can
       *                  make the JSON format work again by importing the deprecated ojvalidation-number module.'}
       * @type {Array.<Object>}
       * @default []
       */

      validators: [],
      /**
       * The value of the component. Value must be a number or null.
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
       * &lt;oj-input-number value='10'>&lt;/oj-input-number>
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
       * @memberof oj.ojInputNumber
       * @ojshortdesc The value of the component, which must be either a number or null. See the Help documentation for more information.
       * @type {?number}
       */
      value: null,
      /**
       * The type of virtual keyboard to display for entering a value on mobile browsers. This attribute has no effect on desktop browsers.
       * @example <caption>Initialize the component with the <code class="prettyprint">virtual-keyboard</code> attribute:</caption>
       * &lt;oj-input-number virtual-keyboard="number">&lt;/oj-input-number>
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
       * @memberof oj.ojInputNumber
       * @ojshortdesc The type of virtual keyboard to display for entering a value on mobile browsers. See the Help documentation for more information.
       * @type {string}
       * @ojvalue {string} "auto" The component will determine the best mobile virtual keyboard to use. For example, it may look at the converter's resolvedOptions
       *                          to determine if it formats using non-numeric characters or not. If it formats using non-numeric characters, like oj-input-number's default
       *                          converter for 'en-US' loocale (1000 formats to "1,000"), then it will use "text".
       * @ojvalue {string} "number" Use a mobile virtual keyboard for entering numbers. If using "number", you must set the converter attribute to a converter
       *                            that formats to numeric characters only, otherwise the value will not be shown. The reason for this
       *                            is oj-input-number uses the browser native input type='number'  and when you set an input value that contains a non-numeric character,
       *                              browsers do not display the value. For example, "1,000" would not be shown. And oj-input-number's default converter for 'en-US' locale formats using non-numeric characters, e.g., 1000 formats to "1,000".
       *                            <p>Note that on Android and Windows Mobile, the "number" keyboard does
       *                            not contain the minus sign.  This value should not be used on fields that
       *                            accept negative values.</p>
       * @ojvalue {string} "text" Use a mobile virtual keyboard for entering text.
       * @default "auto"
       * @since 5.0.0
       */
      virtualKeyboard: 'auto'

      // Events

      /**
       * Triggered when the ojInputNumber is created.
       *
       * @event
       * @name create
       * @memberof oj.ojInputNumber
       * @instance
       * @property {Event} event event object
       * @property {Object} ui Currently empty
       * @ignore
       *
       * @example <caption>Initialize the ojInputNumber with the <code class="prettyprint">create</code> callback specified:</caption>
       * $( ".selector" ).ojInputNumber({
       *     "create": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
       * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
       */
      // create event declared in superclass, but we still want the above API doc
    },
    // P U B L I C    M E T H O D S

    getNodeBySubId: function (locator) {
      var node = this._superApply(arguments);
      var subId;
      if (!node) {
        subId = locator.subId;
        if (subId === 'oj-inputnumber-up') {
          node = this.widget()[0].querySelector('.oj-inputnumber-up');
        }
        if (subId === 'oj-inputnumber-down') {
          node = this.widget()[0].querySelector('.oj-inputnumber-down');
        }
        if (subId === 'oj-inputnumber-input') {
          node = this.widget()[0].querySelector('.oj-inputnumber-input');
        }
      }
      // Non-null locators have to be handled by the component subclasses
      return node || null;
    },
    getSubIdByNode: function (node) {
      var subId = null;

      if (node != null) {
        if (node === this.widget()[0].querySelector('.oj-inputnumber-up')) {
          subId = { subId: 'oj-inputnumber-up' };
        } else if (node === this.widget()[0].querySelector('.oj-inputnumber-down')) {
          subId = { subId: 'oj-inputnumber-down' };
        } else if (node === this.widget()[0].querySelector('.oj-inputnumber-input')) {
          subId = { subId: 'oj-inputnumber-input' };
        }
      }

      return subId || this._superApply(arguments);
    },
    /**
     * Refreshes the inputNumber component
     * <p>A <code class="prettyprint">refresh()</code> or re-init is required
     * when an inputNumber is changed in a non-option way, like in the following circumstances:
     * <ul>
     *   <li>Button translations change.</li>
     * </ul>
     * @expose
     * @memberof oj.ojInputNumber
     * @ojshortdesc Refreshes the component.
     * @access public
     * @instance
     * @return {void}
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * myComp.refresh();
     */
    refresh: function () {
      this._super();
      this._setup();
    },
    /**
     * <p>Decrements the value by the specified number of steps.
     * Without the parameter, a single step is decremented. One step is
     * defined by the component's step property.
     * If the component's step property is 0, the stepDown method is a no-op.</p>
     * <p>If the resulting value is above the max, below the min,
     * or results in a step mismatch, the value will be adjusted to the closest valid value.</p>
     * @param {number=} steps - Number of steps to decrement, defaults to 1.
     * @return {void}
     * @expose
     * @instance
     * @memberof oj.ojInputNumber
     * @ojshortdesc Decrements the value by the specified number of steps. See the Help documentation for more information.
     * @access public
     * @example <caption>Invoke the <code class="prettyprint">stepDown</code> method:</caption>
     * myComp.stepDown();
     * @ojdeprecated {since: '14.0.0', description: 'Programmatically change the value instead.'}
     */
    stepDown: function (steps) {
      var step = this.options.step;
      if (step === 0) {
        return;
      }
      var realStep = (steps != null ? steps : 1) * step * -1;
      this._step(realStep);
    },
    /**
     * <p>Increments the value by the specified number of steps.
     * Without the parameter, a single step is incremented. One step is
     * defined by the component's step property.
     * If the component's step property is 0, the stepUp method is a no-op.</p>
     * <p>If the resulting value is above the max, below the min,
     * or results in a step mismatch, the value will be adjusted to the closest valid value.</p>
     * @param {number=} steps - Number of steps to increment, defaults to 1.
     * @return {void}
     * @expose
     * @instance
     * @memberof oj.ojInputNumber
     * @ojshortdesc Increments the value by the specified number of steps. See the Help documentation for more information.
     * @access public
     * @example <caption>Invoke the <code class="prettyprint">stepUp</code> method:</caption>
     * myComp.stepUp();
     * @ojdeprecated {since: '14.0.0', description: 'Programmatically change the value instead.'}
     */
    stepUp: function (steps) {
      var step = this.options.step;
      if (step === 0) {
        return;
      }
      var realStep = (steps != null ? steps : 1) * step;
      this._step(realStep);
    },

    /**
     * Returns a jQuery object containing the element visually representing the inputnumber.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj.ojInputNumber
     * @instance
     * @return {jQuery} the inputnumber
     * @access public
     * @ignore
     */
    widget: function () {
      return $(this.uiInputNumber);
    },

    // P R O T E C T E D    C O N S T A N T S   A N D   M E T H O D S

    // *********** START WIDGET FACTORY METHODS (they retain _camelcase naming convention) **********

    /**
     * Called at component create time primarily to initialize options, often using DOM values. This
     * method is called before _ComponentCreate is called, so components that override this method
     * should be aware that the component has not been rendered yet. The element DOM is available and
     * can be relied on to retrieve any default values. <p>
     * @param {!Object} originalDefaults - original default options defined on the widget and its ancestors.
     * For example, if we have the step attribute defaulted to 12 in this class, it will be 12. (unless there
     * is some global default on the component ?)
     * @param {?Object} constructorOptions - options passed into the widget constructor
     *
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _InitOptions: function (originalDefaults, constructorOptions) {
      var opts = this.options;
      var self = this;

      // call super class with arguments: originalDefaults and constructorOptions. It will set
      // the this.options.
      this._superApply(arguments);

      if (!this._IsCustomElement()) {
        // 'props' is the list of properties that I need to get from the dom if they aren't already defined in the options.
        // There is no need to list defaults here like we used to do
        // since the defaults are in originalDefaults and they are merged in with the options in the this._superApply call.

        // attribute below is the html-5 dom attribute name. If 'option' is different, like in the case of
        // readonly (readonly html vs readOnly (camelcase) component option), specify both.
        var props = [
          { attribute: 'disabled', validateOption: true },
          { attribute: 'placeholder' },
          { attribute: 'value' }, // don't coerce here. I do it myself
          { attribute: 'readonly', option: 'readOnly', validateOption: true },
          { attribute: 'required', coerceDomValue: true, validateOption: true },
          { attribute: 'title' },
          { attribute: 'min' },
          { attribute: 'max' },
          { attribute: 'step' }
        ];

        EditableValueUtils.initializeOptionsFromDom(
          props,
          constructorOptions,
          this,
          // post-process callback
          function (initializedOptions) {
            // coerce regardless of where the option value came from - dom/constructor
            var toParse = ['value', 'step', 'min', 'max'];

            for (var i = 0; i < toParse.length; i++) {
              var opt = toParse[i];
              var value = opt in initializedOptions ? initializedOptions[opt] : opts[opt];
              if (value != null) {
                if (opt === 'step') {
                  // eslint-disable-next-line no-param-reassign
                  initializedOptions[opt] = self._parseStep(value);
                } else {
                  // eslint-disable-next-line no-param-reassign
                  initializedOptions[opt] = self._parse(opt, value);
                }
              }
            }
          }
        );
      }

      // The custom element bridge framework coerces the options according to the options
      // @type, so there is no need to do the coercion in _InitOptions
      // for custom elements like we do above for non-custom-elements.
      // Check the 'step' to make sure it's in the correct range.
      if (this._IsCustomElement()) {
        // this will coerce with a + and throw an error if it is < 0.
        // since the bridge framework code already coerced step to a number before _InitOptions
        // was called, all we care about is throwing an error if step < 0.
        self._parseStep(opts.step);
      }

      this.initialValue = opts.value;

      // now make sure min < max, else throw an Error
      if (opts.min != null && opts.max != null) {
        if (opts.max < opts.min) {
          throw new Error("ojInputNumber's max must not be less than min");
        }
      }
    },
    /**
     * After _ComponentCreate and _AfterCreate,
     * the widget should be 100% set up. this._super should be called first.
     * @override
     * @protected
     * @instance
     * @memberof oj.ojInputNumber
     */
    _ComponentCreate: function () {
      this._super();

      this._draw();

      this._inputNumberDefaultValidators = {};
      this._setup();
      this._registerEvents();
      this._focusable({
        element: $(this.uiInputNumber),
        applyHighlight: true
      });
    },
    /**
     * After _ComponentCreate and _AfterCreate,
     * the widget should be 100% set up. this._super should be called first.
     * @override
     * @protected
     * @instance
     * @memberof oj.ojInputNumber
     * @return {void}
     */
    _AfterCreate: function () {
      this._super();

      // Initialize transientValue to be the same as value upon component creation
      var context = { writeback: true, internalSet: true, readOnly: true };
      this.option({ transientValue: this.options.value }, { _context: context });

      this._refreshAriaMinMax();
      // buttons and aria-valuenow and aria-valuetext are updated in _Refresh for value which
      // is called from EditableValue's _AfterCreate.
      this.stepQueue = [];
      this._blurEnterSetValueCounter = 0;
      if (this._IsCustomElement()) {
        let labelledBy = this.options.labelledBy;
        this._initInputIdLabelForConnection(
          this._GetContentElement()[0],
          this.widget()[0].id,
          labelledBy
        );
      }
      // create a readonly div. This also sets the div's textContent with
      // the converted display value, which is why this is in _AfterCreate.
      if (this.options.readOnly) {
        this._createOrUpdateReadonlyDiv(this.element[0]);
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
     * @memberof oj.ojInputNumber
     * @instance
     * @override
     */
    // eslint-disable-next-line no-unused-vars
    _AfterSetOption: function (option, previous, flags) {
      this._superApply(arguments);
      switch (option) {
        case 'min':
        case 'max':
          this._Refresh(option, this.options[option]);
          break;
        case 'readOnly':
          this._AfterSetOptionDisabledReadOnly(option, EditableValueUtils.readOnlyOptionOptions);
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
        case 'virtualKeyboard':
          this._SetInputType(this._ALLOWED_TYPES);
          break;
        default:
          break;
      }
    },
    /**
     * Whether the a value can be set on the component. For example, if the component is
     * disabled or readOnly then setting value on component is a no-op.
     *
     * @see #_SetValue
     * @return {boolean}
     * @memberof oj.ojInputNumber
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
     * Performs post processing after value option changes by taking the following steps.
     * This method piggybacks on the super's method by using the 'doNotClearMessages' flag to
     * determine if this was a direct value option programmatic change.
     *
     * - Calls super<br/>
     * - if setOption was from programmatic intervention, <br/>
     * &nbsp;&nbsp;- reset the this.initialValue which is used to determine the stepBase; <br/>
     *
     * @param {string} option
     * @param {Object=} flags
     *
     * @protected
     * @memberof oj.ojInputNumber
     * @instance
     *
     */
    _AfterSetOptionValue: function (option, flags) {
      this._superApply(arguments);
      var context = flags ? flags._context : null;
      var isUIValueChange;
      var doNotClearMessages;

      if (context) {
        isUIValueChange = !!context.originalEvent;
        doNotClearMessages = context.doNotClearMessages || false;
      }

      if (!isUIValueChange) {
        // value option can be updated directly (i.e., programmatically or through user interaction)
        // or updated indirectly as a result of some other option changing - e.g., converter,
        // validators, required etc.
        // When value changes directly due to programatic intervention (usually page author does this)
        // then update this.initialValue.
        if (!doNotClearMessages) {
          this.initialValue = this.options.value;
        }
      }
    },
    /**
     * Called when the display value on the element needs to be updated. This method updates the
     * (content) element value. Widgets can override this method to update the element
     * appropriately.
     *
     * @param {string} displayValue the new string to be displayed
     *
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _SetDisplayValue: function (displayValue) {
      this._superApply(arguments);
      if (this.options.readOnly) {
        let readonlyElem = this._getReadonlyDiv();
        if (readonlyElem) {
          // need to set the textContent on its child
          readonlyElem.textContent = displayValue;
        }
      }
    },

    /**
     * Whether the component is required.
     *
     * @return {boolean} true if required; false
     *
     * @memberof oj.ojInputNumber
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
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _AfterSetOptionRequired: EditableValueUtils._AfterSetOptionRequired,
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
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _AfterSetOptionValidators: EditableValueUtils._AfterSetOptionValidators,
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
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _AfterSetOptionAsyncValidators: EditableValueUtils._AfterSetOptionAsyncValidators,
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
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _AfterSetOptionConverter: EditableValueUtils._AfterSetOptionConverter,
    /**
     * Called when converter option changes and we have gotten the new converter
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _ResetConverter: EditableValueUtils._ResetConverter,

    /**
     * This method also updates the messaging strategies as hints associated with validators could
     * have changed.
     *
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _ResetAllValidators: function () {
      this._inputNumberDefaultValidators = {};

      this._superApply(arguments);
    },

    // *********** END WIDGET FACTORY METHODS **********
    /**
     * Need to override since we allow users to set the converter to null, undefined, and etc and when
     * they do we use the default converter
     *
     * @return {Object} a converter instance or null
     *
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     * @override
     */
    _GetConverter: function () {
      if (this.options.converter) {
        return this._getConverter();
      }
      return _getNumberDefaultConverter();
    },
    /**
     * This returns an array of all validators
     * normalized from the validators option set on the component. <br/>
     * @return {Array} of validators.
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _GetNormalizedValidatorsFromOption: EditableValueUtils._GetNormalizedValidatorsFromOption,
    /**
     * This returns an array of all async validators
     * normalized from the async-validators attribute set on the component. <br/>
     * @return {Array} of validators.
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _GetNormalizedAsyncValidatorsFromOption:
      EditableValueUtils._GetNormalizedAsyncValidatorsFromOption,
    /**
     * Called to find out if aria-required is unsupported.
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     */
    _AriaRequiredUnsupported: function () {
      return false;
    },
    /**
     * Handles options specific to inputnumber.
     * Note that _setOption does not get called during create in the super class.
     * It only gets called when the component has already been created.
     * However, we do call _setOption in _draw for certain attributes
     * (disabled)
     * @override
     * @protected
     * @memberof oj.ojInputNumber
     */
    _setOption: function (key, value, flags) {
      var coercedValue;

      if (!this._IsCustomElement() && (key === 'value' || key === 'max' || key === 'min')) {
        // we only have to coerce for non-custom-elements since the frameworkd coerces for us for
        // custom elements.
        coercedValue = this._parse(key, value);
      } else if (key === 'step') {
        coercedValue = this._parseStep(value);
      } else if (key === 'transientValue') {
        // transientValue is readOnly, so throw an error and return.
        error(key + ' option cannot be set');
        return;
      } else {
        coercedValue = value;
      }

      // the superclass calls _Refresh. Our _Refresh calls _updateButtons
      // and refreshes aria-valuenow/valuetext/valuemin/valuemax
      // call _super with the newly coerced 'value' property.
      this._super(key, coercedValue, flags);

      if (key === 'value') {
        // Set transientValue to be the same if value is set programmatically
        var context = { writeback: true, internalSet: true, readOnly: true };
        this.option({ transientValue: this.options.value }, { _context: context });
      }

      if (key === 'max' || key === 'min') {
        // since validators are immutable, they will contain min + max as local values.
        // Because of this will need to recreate the Implicit NumberRange validators.
        // This resets validators and async-validators and runs validation
        this._AfterSetOptionValidators();
      }

      // when a dom element supports disabled, use that, and not aria-disabled.
      // having both is an error.
      // having aria-disabled on root dom element is ok (if it is added in base class)
      if (key === 'disabled') {
        // force it to be a boolean. this is what/how ojbutton, EditableValue does.
        this.element[0].disabled = !!value;
      }
      // when a dom element supports readonly, use that, and not aria-readonly.
      // having both is an error
      if (key === 'readOnly') {
        // if readonly, we remove buttons/spinner functionality.
        this._createOrDestroyOjButtonset();
        this.element[0].readOnly = !!value;
        if (value) {
          this._createOrUpdateReadonlyDiv(this.element[0]);
        }
        this._refreshStateTheming('readOnly', this.options.readOnly);
      }
      if (key === 'step') {
        // if step is 0, we remove buttons/spinner functionality.
        this._createOrDestroyOjButtonset();
      }
      if (key === 'labelledBy') {
        let labelledBy = this.options.labelledBy;
        if (labelledBy) {
          var id = this._GetContentElement()[0].id;
          this._labelledByUpdatedForInputComp(labelledBy, id);
        }
      }
    },
    /**
     * Override of protected base class method.
     * Method name needn't be quoted since is in externs.js.
     * @protected
     * @memberof oj.ojInputNumber
     * @instance
     */
    _destroy: function () {
      var ret = this._super();

      // destroy the buttonset
      if (this.buttonSet) {
        this._destroyOjButtonset();
      }
      this.initialValue = null;
      this.element.off('blur keydown keyup compositionstart compositionend input');
      //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
      unwrap(this.element, $(this.uiInputNumber));
      clearTimeout(this.timer);

      return ret;
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
     *
     *
     * @method
     * @access public
     * @expose
     * @instance
     * @memberof oj.ojInputNumber
     * @ojshortdesc Validates the component's display value using all validators registered on the component. If there are no validation errors. then the value is updated. See the Help documentation for more information.
     * @since 4.0.0
     *
     */
    validate: EditableValueUtils.validate,
    /**
     * Used for explicit cases where the component needs to be refreshed
     * (e.g., when the value option changes or other UI gestures).
     * @override
     * @protected
     * @memberof oj.ojInputNumber
     */
    // eslint-disable-next-line no-unused-vars
    _Refresh: function (name, value, forceDisplayValueRefresh) {
      var valuenow;

      this._superApply(arguments);

      switch (name) {
        case 'value':
          valuenow = this.options.value || 0;
          // this gets called after value option changes, so no need to convert
          // the display value.
          this._updateButtonsAria(valuenow);

          break;

        case 'disabled':
          // We have often said in the JET team that
          // it makes no sense for an app to disable an invalid value, so it's fine that we
          // do not use the converted display value here and instead use this.options.value
          // which is the valid value.
          valuenow = this.options.value || 0;
          this._updateButtons(valuenow);
          break;

        case 'max':
        case 'min':
          // It is possible that the value is invalid, like 'foo',
          // when the app dev changes the min/max
          // values, so need to use the converted display value instead of this.options.value
          // which is the last valid value. This way the buttons will be disabled if
          // the converted display value is invalid and valuenow is undefined.
          this._refreshAriaMinMax();
          valuenow = this._getDisplayValueParsed();
          // disables or enables both the up and down buttons depending upon what the value
          // is on the screen after conversion plus what min/max are set to.
          this._updateButtons(valuenow);

          break;

        case 'converter':
          // we refresh the display value in super.
          valuenow = this.options.value;
          this._refreshAriaText(valuenow);
          break;

        case 'required':
          this._refreshRequired(value);
          break;

        default:
          break;
      }
    },
    /**
     * @memberof oj.ojInputNumber
     * @instance
     * @private
     */
    _labelledByUpdatedForInputComp: EditableValueUtils._labelledByUpdatedForInputComp,
    /**
     * @memberof oj.ojInputNumber
     * @instance
     * @private
     */
    _initInputIdLabelForConnection: EditableValueUtils._initInputIdLabelForConnection,
    /**
     * @memberof oj.ojInputNumber
     * @instance
     * @private
     */
    /**
     * @memberof oj.ojInputNumber
     * @instance
     * @private
     */
    _linkLabelForInputComp: EditableValueUtils._linkLabelForInputComp,
    /**
     * @memberof oj.ojInputNumber
     * @instance
     * @private
     */
    _refreshRequired: EditableValueUtils._refreshRequired,

    /**
     * Sets up a synchronous numberRange validator if min and max is set and the
     * RangeValidator was overridden by a sync validator.
     *
     * If the validator is created, it is added to the
     * this._inputNumberDefaultValidators type->validator instance map
     *
     * @ignore
     * @protected
     * @override
     * @instance
     * @memberof oj.ojInputNumber
     * @return {Object} returns the implicit sync validators map, where the key is the sync
     * validator type, e.g., 'numberrange'.
     */
    _GetImplicitValidators: function () {
      var ret = this._superApply(arguments);

      if (this.options.min != null || this.options.max != null) {
        this._inputNumberDefaultValidators.numberrange = this._getImplicitNumberRangeValidator();
      }

      return Object.assign(this._inputNumberDefaultValidators, ret);
    },

    /**
     * Returns the default styleclass for the component.
     *
     * @return {string}
     * @memberof oj.ojInputNumber
     * @override
     * @protected
     */
    _GetDefaultStyleClass: function () {
      return 'oj-inputnumber';
    },

    /**
     * This gets called if/when the converter is loading.
     * We do not want to set the oj-input-number's readonly attribute,
     * but we do want the UI of readonly. The buttonset may be rendered,
     * but in theming it is set display:none if oj-read-only is there.
     * This is preferred for this scenario over removing the buttonset dom
     * only to add it back again when loading is compolete.
     * @protected
     * @override
     * @instance
     * @memberof oj.ojInputNumber
     */
    _SetLoading: function () {
      this._super();
      var readOnly = true;

      this.element[0].readOnly = readOnly;
      // removes role spinbutton while loading
      this._refreshRoleSpinbutton(!readOnly);
    },

    /**
     *
     * @protected
     * @override
     * @instance
     * @memberof oj.ojInputNumber
     */
    _ClearLoading: function () {
      this._super();
      var readOnly = this.options.readOnly;
      this.element[0].readOnly = readOnly;
    },

    /**
     * Returns if the element is a text field element or not.
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     * @return {boolean}
     */
    _IsTextFieldComponent: function () {
      return true;
    },

    /**
     * Returns the components wrapper under which label needs to be inserted in the inside strategy
     * For input number we need the label to go under the span so that it occupies the same width
     * as the input text giving way to the buttons.
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     * @return {Element|undefined}
     */
    _GetContentWrapper: function () {
      if (this._IsCustomElement()) {
        return this._getRootElement().querySelector('.oj-text-field-middle');
      }
      return undefined;
    },

    /**
     * Return the element on which aria-label can be found.
     * Usually this is the root element, but some components have aria-label as a transfer attribute,
     * and aria-label set on the root element is transferred to the inner element.
     * @memberof! oj.ojInputNumber
     * @instance
     * @protected
     */
    _GetAriaLabelElement: function () {
      return this.element[0];
    },

    // I N T E R N A L   P R I V A T E   C O N S T A N T S    A N D   M E T H O D S
    //
    // Subclasses should not override or call these methods
    /**
     * @private
     * @const
     * @memberof oj.ojInputNumber
     */
    _BUNDLE_KEY: {
      _TOOLTIP_DECREMENT: 'tooltipDecrement',
      _TOOLTIP_INCREMENT: 'tooltipIncrement'
    },
    /**
     * when below listed options are passed to the component, corresponding CSS will be toggled
     * @private
     * @const
     * @memberof oj.ojInputNumber
     * @type {Object}
     */
    _OPTION_TO_CSS_MAPPING: {
      readOnly: 'oj-read-only'
    },
    /**
     * Returns the numberRange validator instance.
     * @private
     * @memberof oj.ojInputNumber
     */
    _getImplicitNumberRangeValidator: function () {
      var numberRangeValidatorOptions = this._createRangeValidatorOptions();
      var rangeValidator = new NumberRangeValidator(numberRangeValidatorOptions);

      return rangeValidator;
    },
    /**
     * _setup is called on create and refresh.
     * @private
     * @memberof oj.ojInputNumber
     */
    _setup: function () {
      // we only render buttons if not readonly and step > 0.
      var needsButtonset = this._needsButtonset();
      if (needsButtonset) {
        // add/update translated strings to buttons
        var incrementString = this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_INCREMENT);
        var decrementString = this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_DECREMENT);
        this.upButton.ojButton({ label: incrementString });
        this.downButton.ojButton({ label: decrementString });
      }
      // update element DOM for readOnly
      if (typeof this.options.readOnly === 'boolean') {
        this.element[0].readOnly = this.options.readOnly;
      }
      this._refreshStateTheming('readOnly', this.options.readOnly);
      this._refreshRoleSpinbutton(needsButtonset);
      this._refreshRequired(this.options.required);
    },
    // Mark internal JET components for automation support. The automation
    // support needs to know while traversing the nodes that the JET button/buttonset
    // is not the root JET component, but an internal node to a JET component.
    /**
     * @private
     * @memberof oj.ojInputNumber
     */
    _markInternalComponents: function () {
      this.upButton[0].setAttribute('data-oj-internal', '');
      this.downButton[0].setAttribute('data-oj-internal', '');
      this.buttonSet[0].setAttribute('data-oj-internal', '');
    },
    /**
     * @private
     * @memberof oj.ojInputNumber
     */
    _createOjButtonset: function () {
      var buttonSetObj = this._createButtonset();
      this.inputNumberWrapper.appendChild(buttonSetObj.buttonSet); // @HTMLUpdateOK

      // As the buttons are not in the keyboard sequence at first
      // we decided it makes sense to add aria-hidden="true" to them
      // and rely on the up/down arrow keys. However, now we decided to remove aria-hidden because
      // in voiceover there is no way to access the up/down buttons otherwise.
      // Still, voiceover is broken due to this webkit bug
      //  - ios: input number doesn't support vo because of webkit bug
      var buttons = this.uiInputNumber.querySelectorAll('.oj-inputnumber-button');
      var len = buttons.length;
      for (var i = 0; i < len; i++) {
        buttons[i].setAttribute('tabIndex', '-1');
      }

      const buttonChromingDefault =
        getCachedCSSVarValues([
          '--oj-private-input-number-button-global-chroming-default'
        ])[0] || 'solid';
      var buttonsetDiv = buttonSetObj.upButton.parentNode;
      this.upButton = $(buttonSetObj.upButton).ojButton({
        display: 'icons',
        chroming: buttonChromingDefault,
        label: this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_INCREMENT),
        icons: { start: 'oj-component-icon oj-inputnumber-up-icon' }
      });
      this.downButton = $(buttonSetObj.downButton).ojButton({
        display: 'icons',
        chroming: buttonChromingDefault,
        label: this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_DECREMENT),
        icons: { start: 'oj-component-icon oj-inputnumber-down-icon' }
      });
      this.buttonSet = $(buttonsetDiv).ojButtonset({
        focusManagement: 'none',
        chroming: buttonChromingDefault
      });
      this._markInternalComponents();
    },
    /**
     * destroys the ojButtonset
     * @private
     * @memberof oj.ojInputNumber
     */
    _destroyOjButtonset: function () {
      this.buttonSet.ojButtonset('destroy');
      this.buttonSet.remove();
      this.upButton = null;
      this.downButton = null;
      this.buttonSet = null;
    },
    /**
     * creates or destroys buttonset and adds or removes role=spinbutton.
     * @private
     * @memberof oj.ojInputNumber
     */
    _createOrDestroyOjButtonset: function () {
      let needsButtonset = this._needsButtonset();
      // Create or destroy buttonset
      if (needsButtonset && this.buttonSet == null) {
        this._createOjButtonset();
        this._updateButtons(this.options.value || 0);
        this.uiInputNumber.classList.add('oj-has-buttons');
      } else if (!needsButtonset && this.buttonSet) {
        this._destroyOjButtonset();
        this.uiInputNumber.classList.remove('oj-has-buttons');
      }
      // adds or removes role='spinbutton'.
      this._refreshRoleSpinbutton(needsButtonset);
    },
    /**
     * @private
     * @memberof oj.ojInputNumber
     */
    _draw: function () {
      var element = this.element[0];

      element.classList.add('oj-inputnumber-input');
      element.classList.add('oj-text-field-input');
      var spanElem = document.createElement('span');
      spanElem.className = 'oj-inputnumber-wrapper';
      this.inputNumberWrapper = spanElem;
      this.uiInputNumber = spanElem;

      var containerElem = document.createElement('div');
      containerElem.className = 'oj-text-field-container';
      containerElem.setAttribute('role', 'presentation');

      // only custom element will have an OuterWrapper
      if (this.OuterWrapper) {
        containerElem.appendChild(spanElem);

        var middleWrapper = this._CreateMiddleWrapper();
        spanElem.appendChild(middleWrapper);

        middleWrapper.appendChild(element);

        this.OuterWrapper.appendChild(containerElem); // @HTMLUpdateOK
        this.uiInputNumber = this.OuterWrapper;
        this.uiInputNumber.classList.add('oj-inputnumber');
        this.uiInputNumber.classList.add('oj-component');
      } else {
        var divElem = document.createElement('div');
        divElem.className = 'oj-inputnumber oj-component';
        element.parentNode.insertBefore(divElem, element); // @HTMLUpdateOK
        divElem.appendChild(containerElem); // @HTMLUpdateOK
        containerElem.appendChild(spanElem); // @HTMLUpdateOK
        spanElem.appendChild(element); // @HTMLUpdateOK
        this.uiInputNumber = divElem;
      }

      //
      // TODO: need to save off attributes and reset on destroy generically.
      this.saveType = element.type;
      this._SetInputType(this._ALLOWED_TYPES);

      // Won't create buttons if readonly or if step is 0.
      if (this._needsButtonset()) {
        this._createOjButtonset();
        this.uiInputNumber.classList.add('oj-has-buttons');
      }
    },
    /**
     * @private
     * @memberof oj.ojInputNumber
     */
    _needsButtonset: function () {
      return this.options.readOnly !== true && this.options.step > 0;
    },
    /**
     * @private
     * @memberof oj.ojInputNumber
     */
    _createButtonset: function () {
      var buttonSet = document.createElement('div');
      buttonSet.className = 'oj-buttonset-width-auto';

      var downButton = document.createElement('button');
      downButton.setAttribute('type', 'button');
      downButton.className = 'oj-inputnumber-button oj-inputnumber-down';
      buttonSet.appendChild(downButton);

      var upButton = document.createElement('button');
      upButton.setAttribute('type', 'button');
      upButton.className = 'oj-inputnumber-button oj-inputnumber-up';
      buttonSet.appendChild(upButton);

      return { buttonSet: buttonSet, downButton: downButton, upButton: upButton };
    },
    /**
     * @private
     * @memberof oj.ojInputNumber
     */
    _start: function () {
      this.spinning = true;
      return true;
    },
    /**
     * This is called when the user has clicked up or down, or held down up or down.
     * If the user is holding down, this means he wants to spin up or down the value until he sees
     * the value he wants, then he lets up. If the user clicks and doesn't hold down, it
     * will step up or down in the direction.
     * @param {Number} i - time to wait before recursively calling _repeat again. Defaults
     *   to 500.
     * @param {Number} direction - > 0 steps up, else steps down.
     * @param {Object=} event an optional event if this was a result of ui interaction.
     * @param {boolean=} spinning true if we are calling _repeat recursively while the user is holding
     * down the up/down key or button.
     * @private
     * @memberof oj.ojInputNumber
     */
    _repeat: function (i, direction, event, spinning) {
      var stopRepeat = false;
      var domElem;
      var busyContext;
      var self = this;
      var stepOpt = this.options.step;

      // if direction is > 0, it is going up, else it is going down.
      // need to check if min/max is reached, and if so, stop the repeat.
      // we do a quick css check to see if it is disabled.
      if (direction > 0) {
        if (this.upButton[0].classList.contains('oj-disabled')) {
          stopRepeat = true;
        }
      } else if (this.downButton[0].classList.contains('oj-disabled')) {
        stopRepeat = true;
      }
      // repeat spinning as long as the key is down and min/max isn't reached
      // eslint-disable-next-line no-param-reassign
      i = i || 500;

      clearTimeout(this.timer);
      // this.timer will be cleared elsewhere, like when the user stops holding down the up/down
      // arrows. See this._stop
      this.timer = setTimeout(function () {
        if (!stopRepeat) {
          self._repeat(40, direction, event, true);
        }
      }, i);

      // I need two paths. When I am 'spinning' and when I click click click the up
      // or down buton or key individually. When I step individually, I queue up the steps
      // using this.stepQueue if needed (e.g., a slow async validator)
      if (!spinning) {
        this._stepNoStartStop(direction * stepOpt, event);
      } else {
        // if we are actually spinning, it is ok to wait on the busyContext before we call
        // _spin again. _spin increments the value and validates it.
        domElem = this.element[0];
        busyContext = oj.Context.getContext(domElem).getBusyContext();
        if (busyContext.isReady()) {
          // this clears the stepQueue so that when the user stops holding down
          // the up/down button/key the number will stop spinning, even if the step
          // queue isn't empty. e.g., the user clicks up 10 times, but then
          // holds down the up. When he lets up, the number shouldn't keep going up just
          // because the stepQueue isn't empty yet.
          this.stepQueue = [];
          this._spin(direction * stepOpt, event, true);
        }
      }
    },
    /**
     * This gets called when the user clicks the up/down buttons or the up/down arrows
     * on the keyboard, or the app dev calls stepUp/stepDown. We need to get the current
     * value, convert it to a number, update it by the step, then validate the new value.
     * @private
     * @memberof oj.ojInputNumber
     * @param {Number} step - Number of steps to increment.
     * Negative steps means we are decrementing.
     * @param {Object|null} event an event if this was a result of ui interaction. null otherwise.
     * @param {boolean} transientOnly true to update transientValue only. false to update both transientValue and value.
     */
    _spin: function (step, event, transientOnly) {
      var adjustedValue;
      var currentDisplayValue = this._GetDisplayValue();
      var displayValue = currentDisplayValue || 0;
      var value = this._ParseValueShowErrors(displayValue);

      // parsing is synchronous, but _SetValue could be async if we have async-validators.
      if (value !== undefined) {
        adjustedValue = this._adjustParsedValueOnSpinAndUpdateDisplay(value, step);
        this._valuePending = transientOnly;
        return this._SetValue(adjustedValue, event, {
          validationMode: this._VALIDATION_MODE.VALIDATORS_ONLY,
          targetOptions: transientOnly ? ['transientValue'] : ['transientValue', 'value']
        });
      }
      // parsing failed if I get here. It is showing the error message, so I can return.
      this._updateButtonsAria(value);
      return false;
    },

    /**
     * Given the parsed value, it adjusts it by the step, formats, and updates the displayValue,
     * rawValue, aria-* attributes, and buttons. It returns the adjustedValue.
     * @return {number} the parsed value incremented by step.
     * @private
     * @memberof oj.ojInputNumber
     */
    _adjustParsedValueOnSpinAndUpdateDisplay: function (value, step) {
      var options = this.options;
      var minOpt = options.min;
      var maxOpt = options.max;
      var stepOpt = options.step;
      var initialValue = this.initialValue;
      var precision;
      var adjustedValue;
      var formatReturn;

      // get the max precision. e.g., min=2.4, initialValue=3.444, maxPrecision is 3.
      precision = this._precision(minOpt, stepOpt, initialValue);

      adjustedValue = this._adjustValue(
        value,
        step,
        minOpt,
        maxOpt,
        stepOpt,
        precision,
        initialValue
      );

      // Show the user what is going to be validated. We are making it so that clicking on the
      // up/down button is the same as if the user typed in a number and blurred.
      if (this._CanSetValue()) {
        // format the value, then add that to the element's input and update rawValue with that.
        // Passing true means 'do not show error messages or change valid state' since we
        // do that in _SetValue.
        formatReturn = this._UpdateElementDisplayValue(adjustedValue, true);
        if (formatReturn !== undefined) {
          // keep in sync with the input's val
          this._updateButtonsAria(adjustedValue);
        }
      }
      return adjustedValue;
    },

    /**
     * called from _adjustValue
     * @private
     * @memberof oj.ojInputNumber
     */
    _precision: function (minOpt, stepOpt, value) {
      var precision = this._precisionOf(stepOpt);

      if (minOpt != null) {
        precision = Math.max(precision, this._precisionOf(minOpt));
      }

      if (value != null) {
        precision = Math.max(precision, this._precisionOf(value));
      }

      return precision;
    },
    /**
     * return the number of digits after the '.'
     * called from _adjustValue->_precision
     * @private
     * @memberof oj.ojInputNumber
     * @param {Number} num - Number from which to calculate the precision
     */
    _precisionOf: function (num) {
      var str = num.toString();
      var decimal = str.indexOf('.');
      return decimal === -1 ? 0 : str.length - decimal - 1;
    },
    /**
     * adjust the value to be "valid".
     * The logic follows that of HTML-5's input number.
     * http://www.w3.org/TR/html5/forms.html#dom-input-stepup
     * A valid value is one that is a multiple of
     * step starting at stepBase, where stepBase is min (if present),
     * else initial value (if present),
     * else (if type == number) 0
     * If max is not a valid value, stepUp/stepDown will never go to max. It
     * will go to the calculated valid max (one that is the largest value
     * that is an integral multiple of the step, and that is less than or equal
     * to the maximum.
     * @private
     * @memberof oj.ojInputNumber
     * @param {number} value - the current value
     * @param {number} step - the step you want to adjust the value by
     * @param {number} minOpt - the min option
     * @param {number} maxOpt - the max option
     * @param {number} stepOpt - the step option
     * @param {number} precision - the precision @see _precision
     * @param {number} initialValue - the value when the component was created
     * @returns {number} - the new value after it has been adjusted
     */
    _adjustValue: function (value, step, minOpt, maxOpt, stepOpt, precision, initialValue) {
      var newValue;
      var stepBase;
      var aboveMin;
      var valueWithFraction;

      if (precision > 0) {
        valueWithFraction = this._adjustValueForFractions(
          value,
          step,
          minOpt,
          maxOpt,
          stepOpt,
          precision,
          initialValue
        );
        return valueWithFraction;
      }

      // make sure we're at a valid step when we step up or down.
      // - find out where we are relative to the base.
      // follow these rules. use min, else use initial value, else use 0.
      // https://www.w3.org/TR/html5/forms.html#concept-input-min-zero
      stepBase = minOpt != null ? minOpt : initialValue;
      if (stepBase == null) {
        stepBase = 0;
      }

      // From http://www.w3.org/TR/html5/forms.html#dom-input-stepup:
      // If value subtracted from the step base is not an integral multiple
      // of the step, then set value to the nearest value that, when subtracted
      // from the step base, is an integral multiple of the allowed value step,
      // and that is less than value if the method invoked was stepDown() and
      // more than value if the method invoked was stepUp().

      // is value-stepBase an integral multiple of step?
      try {
        // eslint-disable-next-line no-param-reassign
        value = parseFloat(value.toFixed(precision));
      } catch (e) {
        if (e instanceof TypeError) {
          // I've only seen this fail if they set a null converter.
          warn(
            "inputNumber's value after conversion is not a number. \n" +
              'The converter must convert the value to a Number. coercing using +'
          );
          // eslint-disable-next-line no-param-reassign
          value = +value; // coerce
        }
      }
      aboveMin = value - stepBase;

      var rounded = Math.round(aboveMin / stepOpt) * stepOpt;
      rounded = parseFloat(rounded.toFixed(precision));
      var multiple = rounded === aboveMin;

      if (!multiple) {
        if (step < 0) {
          aboveMin = Math.ceil(aboveMin / stepOpt) * stepOpt;
        } else {
          aboveMin = Math.floor(aboveMin / stepOpt) * stepOpt;
        }
        // rounding is based on 0, so adjust back to our base
        newValue = stepBase + aboveMin + step;
      } else {
        newValue = value + step;
      }

      // fix precision from bad JS floating point math
      // toFixed returns the newValue with a specific # of digits after the
      // decimal point (this_precision() looks at max of step/min/value's # of
      // digits.
      newValue = parseFloat(newValue.toFixed(precision));

      if (minOpt != null && newValue < minOpt) {
        return minOpt;
      }

      if (maxOpt != null && newValue > maxOpt) {
        var validMax = Math.floor((maxOpt - stepBase) / stepOpt) * stepOpt + stepBase;
        // fix precision from bad JS floating point math
        validMax = parseFloat(validMax.toFixed(precision));
        return validMax;
      }

      return newValue;
    },
    /**
     * Call this from _adjustValue when you have numbers with precision > 0. This method
     * multiples everything by Math.pow(10,precision), calls _adjustValue with these numbers so that
     * the math works, then divides the result by Math.pow(10,precision) to get it back to fractions.
     * This is to work around the issue with Javascript's binary floating-point numbers not being
     * great about adding decimal fractions. e.g., 0.1 + 0.2 is not equal to 0.3. It is
     * an intentional consequence of the IEEE Standard for Binary Floating-Point Arithmetic (IEEE 754)
     * @private
     * @memberof oj.ojInputNumber
     * @param {number} value - the current value
     * @param {number} step - the step you want to adjust the value by
     * @param {number} minOpt - the min option
     * @param {number} maxOpt - the max option
     * @param {number} stepOpt - the step option
     * @param {number} precision - the precision @see _precision
     * @param {number} initialValue - the value when the component was created
     * @returns {number}
     */
    _adjustValueForFractions: function (
      value,
      step,
      minOpt,
      maxOpt,
      stepOpt,
      precision,
      initialValue
    ) {
      // don't call this function if precision is 0
      oj.Assert.assert(precision > 0);
      var power = Math.pow(10, precision);
      // if minOpt, maxOpt, stepOpt are undefined, keep them that way
      // when we adjust the values to make them decimals, they should be whole numbers.
      // javascript sometimes gives them fractions (
      // e.g., 10000000.45*100=1000000044.9999999), so everywhere here we multiply
      // by power, round the value to make it a whole number.
      var minOptPower = minOpt != null ? Math.round(minOpt * power) : minOpt;
      var maxOptPower = maxOpt != null ? Math.round(maxOpt * power) : maxOpt;
      var stepOptPower = Math.round(stepOpt * power);

      var adjustValuePower = this._adjustValue(
        Math.round(value * power),
        Math.round(step * power),
        minOptPower,
        maxOptPower,
        stepOptPower,
        0,
        Math.round(initialValue * power)
      );
      return adjustValuePower / power;
    },
    /**
     * @private
     * @memberof oj.ojInputNumber
     */
    _stop: function (event) {
      if (!this.spinning) {
        return;
      }
      if (this._valuePending) {
        // transientValue would have been validated, so simply set value to it.
        // Normally when the value is updated, EditableValue._AfterSetOptionValue checks if it
        // needs to run deferred validation and refresh UI display value.  Since we
        // get here only from UI event, neither of those are necessary, so there is no
        // need to call _AfterSetOptionValue.
        var context = { originalEvent: event, internalSet: true };
        this.option({ value: this.options.transientValue }, { _context: context });
        this._valuePending = false;
      }
      clearTimeout(this.timer);
      this.spinning = false;
    },
    /**
     * @private
     * @memberof oj.ojInputNumber
     * @return {boolean} true if there is no touch detected within the last 500 ms
     */
    _isRealMouseEvent: function () {
      return !recentTouchEnd();
    },
    /**
     * disables or enables both the up and down buttons depending upon what the value
     * is on the screen after conversion plus what min/max are set to.
     * e.g., $10.00 is on the screen, valuenow is 10
     * @private
     * @memberof oj.ojInputNumber
     */
    _updateButtons: function (valuenow) {
      var options = this.options;
      var maxOpt = options.max;
      var minOpt = options.min;
      var downButton = this.downButton;
      var upButton = this.upButton;
      var downButtonDisabledAlready;
      var upButtonDisabledAlready;
      var isMaxOptNonNull = maxOpt != null;
      var isMinOptNonNull = minOpt != null;

      if (!downButton && !upButton) {
        return;
      }

      // to prevent the overhead of disabling a button that is already disabled, check to see
      // if it is already disabled already.
      downButtonDisabledAlready = downButton[0].classList.contains('oj-disabled');
      upButtonDisabledAlready = upButton[0].classList.contains('oj-disabled');

      if (
        options.disabled ||
        valuenow === undefined ||
        (isMaxOptNonNull && isMinOptNonNull && maxOpt === minOpt && valuenow === maxOpt)
      ) {
        if (!downButtonDisabledAlready) {
          downButton.ojButton('disable');
        }
        if (!upButtonDisabledAlready) {
          upButton.ojButton('disable');
        }
      } else if (isMaxOptNonNull && valuenow >= maxOpt) {
        if (downButtonDisabledAlready) {
          downButton.ojButton('enable');
        }
        if (!upButtonDisabledAlready) {
          upButton.ojButton('disable');
        }
      } else if (isMinOptNonNull && valuenow <= minOpt) {
        if (!downButtonDisabledAlready) {
          downButton.ojButton('disable');
        }
        if (upButtonDisabledAlready) {
          upButton.ojButton('enable');
        }
      } else {
        if (downButtonDisabledAlready) {
          downButton.ojButton('enable');
        }
        if (upButtonDisabledAlready) {
          upButton.ojButton('enable');
        }
      }
    },
    /**
     * Returns the normalized converter instance.
     *
     * @return {Object} a converter instance or null
     * @memberof oj.ojInputNumber
     * @instance
     * @private
     */
    _getConverter: EditableValueUtils._GetConverter,
    /**
     * Draw a readonly div or update one. When readonly, this div is shown and
     * the input has display:none on it through theming, and vice versa.
     * We set the textContent in _SetDisplayValue() if readonly
     * @param {HTMLElement} pass in this.element[0]
     * @memberof oj.ojInputNumber
     * @instance
     * @private
     */
    _createOrUpdateReadonlyDiv: EditableValueUtils._createOrUpdateReadonlyDiv,
    /**
     * Returns the converted display value.
     * This function gets the display value (or 0 if no display value), then parses it using
     * the converter.
     * The converted display value is used for 'valuenow'. For example,
     * the display value might be $6.00, but we want valuenow to be 6.
     * @private
     * @memberof oj.ojInputNumber
     */
    _getDisplayValueParsed: function () {
      var value;
      var displayValue;
      try {
        displayValue = this._GetDisplayValue() || 0;
        // if displayValue is not parseable, say it is 'abc',
        // then _parseValue throws an error. catch it and move on.
        value = this._parseValue(displayValue);
      } catch (e) {
        // catch the error, set value to undefined, and continue to update
        // the buttons. both the up/down buttons will be disabled in this case.
        value = undefined;
      }
      return value;
    },
    /**
     * This calls _SetValue to parse, validate, and format the user's input.
     * If we have async validators, this may happen asynchronously.
     * If asynchronous and a new call is made to this method,
     * it will ignore the Promise resolution from the previous request.
     * @param {Object=} event the ui interaction event.
     * @private
     * @memberof oj.ojInputNumber
     */
    _blurEnterSetValue: function (event) {
      var val = this.element.val();
      var valuenow;
      var setValueReturn;
      var self = this;
      var currentCounter;

      this._stop(event);
      // clear step queue
      this.stepQueue = [];
      // used to ignore if we get newer blurs
      this._blurEnterSetValueCounter += 1;
      currentCounter = this._blurEnterSetValueCounter;

      this._valuePending = false;
      setValueReturn = this._SetValue(val, event, { targetOptions: ['transientValue', 'value'] });

      if (setValueReturn instanceof Promise) {
        // We already set BusyContext in _SetValue
        setValueReturn.then(function (setValueResolved) {
          // valuenow/buttons are updated already in _Refresh for value option.
          // handle the case where it wasn't.
          // ignore if we got a more recent blur/enter while this one was still waiting.
          if (currentCounter === self._blurEnterSetValueCounter) {
            if (!setValueResolved) {
              // If setValueResolved is false, there was an error in _SetValue parse/validate
              // or it was ignored. Since we deal with ignoring ourselves,
              // then we can rule that out.
              valuenow = self._getDisplayValueParsed();
              // we get here if parse is synchronous but validate is async, and validate
              // failed.
              self._updateButtonsAria(valuenow);
            }
          }
        });
      } else {
        valuenow = setValueReturn ? this.options.value : this._getDisplayValueParsed();
        // disables or enables both the up and down buttons depending upon what the value
        // is on the screen after conversion plus what min/max are set to.
        this._updateButtonsAria(valuenow);
      }
    },
    /**
     * @private
     * @memberof oj.ojInputNumber
     */
    _updateButtonsAria: function (valuenow) {
      this._refreshAriaValueNowText(valuenow);
      this._updateButtons(valuenow);
    },
    /**
     * Get the options for a number range validator, async or sync.
     * Use the 'min' and 'max' options.
     * @return {Object} the options
     * @private
     * @memberof oj.ojInputNumber
     */
    _createRangeValidatorOptions: function () {
      var options = this.options;
      var minOpt = options.min;
      var maxOpt = options.max;
      var newMin = minOpt != null ? minOpt : undefined;
      var newMax = maxOpt != null ? maxOpt : undefined;
      var translations = options.translations;
      var translationsOptionNumberRange = translations ? translations.numberRange || {} : {};
      var hintMin;
      var hintMax;
      var hintInRange;
      var hintExact;
      var messageDetailRangeOverflow;
      var messageDetailRangeUnderflow;
      var messageDetailExact;
      var messageSummaryRangeOverflow;
      var messageSummaryRangeUnderflow;
      var translationsHint = translationsOptionNumberRange.hint || {};
      var translationsMessageDetail = translationsOptionNumberRange.messageDetail || {};
      var translationsMessageSummary = translationsOptionNumberRange.messageSummary || {};
      var numberRangeValidatorOptions;

      // First check if the translations hint/messageDetail/messageSummary options are set, and if
      // so, use them.
      // This is how the app dev could use inputNumber's translations option.
      // var element = $("#spin").ojInputNumber(
      //      {value: 10, min: -50,
      //        translations:
      //        {numberRange:
      //          {hint:
      //            {min: 'Translations Option Test: Please enter a number greater than or equal to {min}',
      //             max: 'Translations Option Test: Please enter a number less than or equal to {max}',
      //             inRange: 'Translations Option Test: Please enter a number between {min} and {max}'
      //            },
      //            messageDetail:
      //            {rangeUnderflow:
      //            'Translations Option Test: The number {value} must be greater than or equal to {min}',
      //              rangeOverflow:
      //              'Translations Option Test: The number {value} must be less than or equal to {max}'
      //            }
      //          }
      //        } // end numberRange
      if (translationsHint !== null) {
        hintMin = translationsHint.min || null;
        hintMax = translationsHint.max || null;
        hintInRange = translationsHint.inRange || null;
        hintExact = translationsHint.exact || null;
      }
      if (translationsMessageDetail !== null) {
        messageDetailRangeOverflow = translationsMessageDetail.rangeOverflow || null;
        messageDetailRangeUnderflow = translationsMessageDetail.rangeUnderflow || null;
        messageDetailExact = translationsMessageDetail.exact || null;
      }
      if (translationsMessageSummary !== null) {
        messageSummaryRangeOverflow = translationsMessageSummary.rangeOverflow || null;
        messageSummaryRangeUnderflow = translationsMessageSummary.rangeUnderflow || null;
      }

      // unless the translations options for the numberrange were set, the hints and messageDetails
      // and messageSummaries will be null and we'll pick up the default strings from the
      // NumberRangeValidator.
      numberRangeValidatorOptions = {
        min: newMin,
        max: newMax,
        hint: {
          min: hintMin || null,
          max: hintMax || null,
          inRange: hintInRange || null,
          exact: hintExact || null
        },
        messageDetail: {
          rangeOverflow: messageDetailRangeOverflow || null,
          rangeUnderflow: messageDetailRangeUnderflow || null,
          exact: messageDetailExact || null
        },
        messageSummary: {
          rangeOverflow: messageSummaryRangeOverflow || null,
          rangeUnderflow: messageSummaryRangeUnderflow || null
        },
        converter: this._GetConverter()
      };

      return numberRangeValidatorOptions;
    },

    // The user can clear out min/max by setting the option to null, so we
    // do not coerce null.
    /**
     * @param {string} option name of the option. this will show up in the error if thrown
     * @param val value to parse
     * @throws {Error} if option value is invalid
     * @private
     * @memberof oj.ojInputNumber
     */
    _parse: function (option, val) {
      var returnValue;
      if (val !== null) {
        returnValue = +val;
      } else {
        returnValue = val;
      }

      // isNaN(null) returns false, which is what we want
      if (isNaN(returnValue)) {
        throw new Error("ojInputNumber's " + option + ' option is not a number');
      }

      return returnValue;
    },
    /**
     * parse the step's value
     * We are following the behavior of HTML-5 the best we can. According
     * to the spec, it says step must be a number greater than 0.
     * Chrome defaults it to 1 if it is not.
     * In v8.0 we added the feature to not step or show buttons if
     * step is 0.
     * @throws {Error} if option value is invalid
     * @private
     * @memberof oj.ojInputNumber
     */
    _parseStep: function (val) {
      var defaultStep = 1;
      var parsedStep;
      if (val === null) {
        return defaultStep;
      }
      if (val === '') {
        // throw an exception
        throw new Error('Invalid step for ojInputNumber; step must be a number 0 or greater.');
      }

      parsedStep = this._parse('step', val);
      if (parsedStep < 0) {
        // throw an exception
        throw new Error('Invalid step for ojInputNumber; step must be 0 or greater.');
      }
      return parsedStep;
    },
    /**
     * Toggles css selector on the widget. E.g., when readOnly option changes,
     * the oj-read-only selector needs to be toggled.
     * @param {string} option
     * @param {Object|string|boolean} value
     * @private
     * @memberof oj.ojInputNumber
     */
    _refreshStateTheming: function (option, value) {
      if (Object.keys(this._OPTION_TO_CSS_MAPPING).indexOf(option) !== -1) {
        // value is a boolean
        if (value) {
          this.widget()[0].classList.add(this._OPTION_TO_CSS_MAPPING[option]);
        } else {
          this.widget()[0].classList.remove(this._OPTION_TO_CSS_MAPPING[option]);
        }
      }
    },
    /**
     * The role spinbutton needs to be toggled.
     * If the up/down buttons are not rendered, then we do not want the
     * role spinbutton.
     * E.g., We don't have role spinbutton on readOnly inputNumber.
     * @param {boolean} needsRole
     * @private
     * @memberof oj.ojInputNumber
     */
    _refreshRoleSpinbutton: function (needsRole) {
      if (!needsRole) {
        this.element[0].removeAttribute('role');
      } else {
        this.element[0].setAttribute('role', 'spinbutton'); // @HTMLUpdateOK
      }
    },
    /**
     * @private
     * @memberof oj.ojInputNumber
     */
    _refreshAriaMinMax: function () {
      this._setAttr('aria-valuemin', this.options.min);
      this._setAttr('aria-valuemax', this.options.max);
    },
    /**
     * Update aria-valuenow to valuenow and aria-valuetext to the
     * displayValue if it is different than valuenow.
     * If valuenow is undefined, then aria-valuenow is skippped; it's not set or removed,
     * so it will be the last known valid value.
     * Rules for aria-valuenow/aria-valuetext:
     * if the input value shown to the user can be parsed to a valid non-formatted number,
     * I'll set aria-valuenow, else it won't be there at all.
     * if the input value shown is not equal to what aria-valuenow is,
     * set aria-valuetext, e.g.,
     * USD 10.00 for aria-valuetext, 10 for aria-valuenow.
     * else it won't be there at all.
     * My goal is for voiceover to read what is in the field, showing to the user.
     * @private
     * @memberof oj.ojInputNumber
     */
    _refreshAriaValueNowText: function (valuenow) {
      this._setAttr('aria-valuenow', valuenow);
      this._refreshAriaText(valuenow);
    },
    /* updates the aria-text if needed */
    /**
     * @private
     * @memberof oj.ojInputNumber
     */
    _refreshAriaText: function (valuenow) {
      var valuetext = this.element.val();

      if (valuetext !== '' && !this._CompareOptionValues('value', '' + valuenow, valuetext)) {
        this._setAttr('aria-valuetext', valuetext);
      } else {
        this._setAttr('aria-valuetext', null);
      }
    },
    /**
     * Set an element attribute using jQuery logic, but javascript apis.
     * This allows easy replacement of jQuery attr() calls.
     * @param {string} attrName the attribute to set
     * @param {any} value the attribute value
     * @private
     * @memberof oj.ojInputNumber
     */
    _setAttr: function (attrName, value) {
      if (value !== undefined) {
        if (value === null) {
          this.element[0].removeAttribute(attrName);
        } else {
          this.element[0].setAttribute(attrName, value); // @HTMLUpdateOK
        }
      }
    },
    /**
     * Step the inputnumber value up or down.
     * If this is async because of async validators,
     * then we queue up the step requests, so if a user clicks three times, but updating is slow
     * due to slow validators, the user still sees the result of his three clicks
     * at the end. This is different than when the user holds down the up/down
     * key/button.
     * @private
     * @memberof oj.ojInputNumber
     * @param {Number} step - Number of steps to increment, like 10 or 1. If undefined, we
     * pull from the this.stepQueue queue.
     * @param {boolean} up If true step up, else step down.
     * @param {Object=} event an optional event if this was a result of ui interaction.
     */
    _stepNoStartStop: function (step, event) {
      var currentStepObject;
      var currentSpinStep;
      var currentEvent;
      // this.stepQueue = []; initialized in _AfterCreate and cleared if spinning or blurEnter
      var spinPromise;
      var self = this;

      if (step === undefined) {
        // pull from the queue. If it's empty, return.
        if (this.stepQueue.length === 0) {
          return;
        }
        currentStepObject = this.stepQueue.shift();
        currentSpinStep = currentStepObject.step;
        currentEvent = currentStepObject.event;
      } else {
        // if we are already processing something in the queue, push new step request
        //  to the queue, and return.
        if (this.stepQueue.length >= 1) {
          this.stepQueue.push({ step: step, event: event });
          return;
        }
        currentSpinStep = step;
        currentEvent = event;
      }

      spinPromise = this._spin(currentSpinStep, currentEvent, false);
      if (spinPromise instanceof Promise) {
        this.stepQueue.push({ step: currentSpinStep, event: currentEvent });
        spinPromise.then(function () {
          // pop it off because it has been processed. This is used as a 'flag' that we
          // are awaiting the promise to resolve.
          self.stepQueue.shift();
          // continue stepping if stepQueue is not empty.
          self._stepNoStartStop(undefined, currentEvent);
        });
      }
    },

    /**
     * step the inputnumber value up or down.
     * @private
     * @memberof oj.ojInputNumber
     * @param {Number} step - Number of steps to increment, like 10 or 1 or -10.
     * @param {Object=} event an optional event if this was a result of ui interaction.
     */
    _step: function (step, event) {
      this._start();
      this._stepNoStartStop(step, event);
      this._stop(event);
    },

    /**
     * Set the type of the input element based on virtualKeyboard option.
     * @memberof oj.ojInputNumber
     * @instance
     * @protected
     * @ignore
     */
    _SetInputType: EditableValueUtils._SetInputType,

    /**
     * Events registerd without the passive option
     * @private
     * @memberof oj.ojInputNumber
     * @ignore
     */
    _regularEventsAndListeners: {
      compositionstart: function () {
        // See _isComposing in InputBase for comments on what this does
        this._isComposing = true;
      },
      compositionend: function (event) {
        this._isComposing = false;
        this._SetRawValue(this.element.val(), event);
      },
      input: function (event) {
        if (!this._isComposing) {
          this._SetRawValue(this.element.val(), event);
        }
      },
      keydown: function (event) {
        var keyCode = $.ui.keyCode;
        switch (event.keyCode) {
          case keyCode.ENTER:
            this._blurEnterSetValue(event);
            event.preventDefault();
            break;
          case keyCode.UP:
            // same as if you used the up and down buttons
            // if buttons aren't there, then up/down keys shouldn't be
            // there as well.
            if (this._needsButtonset()) {
              if (!this.spinning) {
                this._start();
                this._repeat(null, 1, event);
              }
            }
            event.preventDefault();

            break;
          case keyCode.DOWN:
            if (this._needsButtonset()) {
              if (!this.spinning) {
                this._start();
                this._repeat(null, -1, event);
              }
            }
            event.preventDefault();
            break;
          default:
            break;
        }
      },
      keyup: function (event) {
        var keyCode = $.ui.keyCode;

        switch (event.keyCode) {
          case keyCode.UP:
          case keyCode.DOWN:
            this._stop(event);
            break;
          default:
            this._stop(event);
            break;
        }
      },
      blur: function (event) {
        this._blurEnterSetValue(event);
      },
      'touchend .oj-inputnumber-button': function (event) {
        this._stop(event);
      },
      'touchcancel .oj-inputnumber-button': function (event) {
        this._stop(event);
      },
      'mousedown .oj-inputnumber-button.oj-enabled': function (event) {
        if (this._isRealMouseEvent(event)) {
          this._start();

          this._repeat(
            null,
            event.currentTarget.classList.contains('oj-inputnumber-up') ? 1 : -1,
            event
          );
        }
      },
      'mouseup .oj-inputnumber-button': function (event) {
        if (this._isRealMouseEvent(event)) {
          this._stop(event);
        }
      },
      'mouseenter .oj-inputnumber-button.oj-enabled': function (event) {
        // button will add oj-active if mouse was down while mouseleave and kept down
        if (!event.currentTarget.classList.contains('oj-active')) {
          return;
        }
        if (this._isRealMouseEvent(event)) {
          this._start();

          this._repeat(
            null,
            event.currentTarget.classList.contains('oj-inputnumber-up') ? 1 : -1,
            event
          );
        }
      },
      // TODO: do we really want to consider this a stop?
      // shouldn't we just stop the repeater and wait until mouseup before
      // we trigger the stop event?
      'mouseleave .oj-inputnumber-button': function (event) {
        if (this._isRealMouseEvent(event)) {
          this._stop(event);
        }
      }
    },

    /**
     * Events registerd with the passive option
     * @private
     * @memberof oj.ojInputNumber
     * @ignore
     */
    _passiveEventsAndListeners: {
      'touchstart .oj-inputnumber-button.oj-enabled': function (event) {
        this._start();
        this._repeat(
          null,
          event.currentTarget.classList.contains('oj-inputnumber-up') ? 1 : -1,
          event
        );
      }
    },

    /**
     * Register event listeners
     * @memberof oj.ojInputNumber
     * @private
     * @ignore
     */
    _registerEvents: function () {
      // register all regular events
      this._on(this._regularEventsAndListeners);
      // will register these with the passive option in 8.1.0
      this._on(this._passiveEventsAndListeners);
    }
  });

  setDefaultOptions({
    ojInputNumber: {
      step: createDynamicPropertyGetter(function () {
        return getCachedCSSVarValues([
          '--oj-private-input-number-global-step-default'
        ])[0];
      }),
      converter: createDynamicPropertyGetter(function () {
        if (_sDefaultNumberConverter == null) {
          _sDefaultNumberConverter = _getNumberDefaultConverter();
        }
        return _sDefaultNumberConverter;
      })
    }
  });
})(); // end of inputNumber wrapper function
