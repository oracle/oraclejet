/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojlogger',  'ojs/ojcomponentcore', 'ojs/ojlabelledbyutils', 'ojs/ojeditablevalue', 'ojs/ojradiocheckbox', 'ojs/ojoption', 'ojs/ojdataprovider'],
function(oj, $, Logger, Components, LabelledByUtils)
{
  "use strict";
var __oj_radioset_metadata = 
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
    "optionRenderer": {
      "type": "function"
    },
    "options": {
      "type": "object"
    },
    "optionsKeys": {
      "type": "object",
      "properties": {
        "label": {
          "type": "string"
        },
        "value": {
          "type": "string"
        }
      }
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
        "readonlyNoValue": {
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


/* global Logger:false */

/* global Components:false */

/* global Symbol:false */

/* global LabelledByUtils:false */
(function () {
  /*!
   * JET Radioset @VERSION
   */
  // -----------------------------------------------------------------------------
  // "private static members" shared by all radiosets
  // -----------------------------------------------------------------------------

  /**
   * do not do a value change check in _SetValue
   */
  var _sValueChangeCheckFalse = {
    doValueChangeCheck: false
  };
  /**
   * @ojcomponent oj.ojRadioset
   * @augments oj.editableValue
   * @ojimportmembers oj.ojDisplayOptions
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojRadioset<K, D, V=any> extends editableValue<V, ojRadiosetSettableProperties<K, D, V>>",
   *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"},
   *                , {"name": "V", "description": "Type of value of the component"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojRadiosetSettableProperties<K, D, V> extends editableValueSettableProperties<V>",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @since 0.6.0
   * @ojshortdesc A radio set allows the user to select one option from a set of mutually exclusive options.
   * @ojrole radio
   * @ojrole radiogroup
   * @ojrole option
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "required", "disabled"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @classdesc
   * <h3 id="radiosetOverview-section">
   *   JET Radioset
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#radiosetOverview-section"></a>
   * </h3>
   * <p>
   * The JET oj-radioset component manages a set of
   * <code class="prettyprint">oj-option</code> child elements and creates the necessary dom elements for
   * the actual radio buttons.
   * </p>
   * <p>To use an oj-radioset, add one or more oj-option child elements for each radio button desired.
   * Note, if you add or remove an oj-option after the oj-radioset is rendered, you should call
   * refresh() on the oj-radioset.
   * Note, oj-optgroup is not a supported child element of oj-radioset.
   * </p>
   * <p>
   *  You can enable and disable an oj-radioset,
   *  which will enable and disable all contained radios.
   * </p>
   * <p>
   *  You can set an oj-radioset to readonly,
   *  which will make the options readonly and only selected option's label will be displayed.
   * </p>
   * <p>
   * The oj-label element is not required. If you don't use an oj-label element,
   * then you need to set <code class="prettyprint">aria-label</code> on the input for accessibility.
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
   *
   * <p>JET oj-radioset takes care of setting
   * <code class="prettyprint">role="radiogroup"</code> on the oj-radioset element.
   *
   * <p>The application is responsible for applying
   * <code class="prettyprint">labelled-by</code>
   * to point to the radioset's <code class="prettyprint">oj-label</code> element for the oj-radioset.
   * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
   * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
   * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
   * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
   * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
   * required of enabled content, it cannot be used to convey meaningful information.<p>
   *
   * <h3 id="label-section">
   *   Label and Radioset
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
   * </h3>
   * <p>
   * For accessibility, you should associate an <code class="prettyprint">oj-label</code> element with the
   * radioset by putting an <code class="prettyprint">id</code> on the oj-label, and then setting the
   * <code class="prettyprint">labelled-by</code> attribute on the oj-radioset to be the oj-label's
   * <code class="prettyprint">id</code>.
   * </p>
   *
   * <h3 id="styling-section">
   *   Styling
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
   * </h3>
   * {@ojinclude "name":"stylingDoc"}
   *
   * @example <caption>Initialize the radioset with no options specified:</caption>
   * &lt;oj-radioset id="colorRadio" value="{{currentColor}}">
   *   &lt;oj-option value="blue">Blue&lt;/oj-option>
   *   &lt;oj-option value="green">Green&lt;/oj-option>
   * &lt;/oj-radioset>
   *
   * @example <caption>Initialize component and an associated oj-label component</caption>
   * &lt;oj-label id="grouplabel">Greetings&lt;/oj-label>
   * &lt;oj-radioset id="radioset" labelle-dby="grouplabel" value="{{currentGreeting}}">
   *   &lt;oj-option id="helloid" value="hello">Hello&lt;/oj-option>
   *   &lt;oj-option id="bonjourid" value="bonjour"/>Bonjour&lt;/oj-option>
   *   &lt;oj-option id="ciaoid" value="ciao"/>Ciao&lt;/oj-option>
   * &lt;oj-radioset>
   * <br/>
   * // set the value to "ciao". (The 'ciao' radio will be selected)
   * myComp.value = "ciao";
   */

  oj.__registerWidget('oj.ojRadioset', $.oj.editableValue, {
    version: '1.0.0',
    defaultElement: '<div>',
    widgetEventPrefix: 'oj',
    options: {
      /**
       * <p>
       * Disabled <code class="prettyprint">true</code> disables the component and disables all the
       * inputs/labels.
       * Disabled <code class="prettyprint">false</code> enables the component, and leaves the
       * inputs' <code class="prettyprint">disabled</code> property as it is in the dom.
       * <p>
       *
       * @example <caption>Initialize component with <code class="prettyprint">disabled</code> attribute:</caption>
       * &lt;oj-radioset disabled>
       *   &lt;oj-option value="blue">Blue&lt;/oj-option>
       * &lt;/oj-radioset>
       *
       * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
       * // getter
       * var disabled = myComp.disabled;
       *
       * // setter
       * myComp.disabled = false;
       *
       * @expose
       * @type {boolean}
       * @default false
       * @public
       * @instance
       * @memberof oj.ojRadioset
       * @ojshortdesc Specifies if the component is disabled. If true, then all of its inputs and labels are also disabled. See the Help documentation for more information.
       */
      disabled: false,

      /**
       * Whether the component is readonly. The readOnly property sets or returns whether an element is readOnly, or not.
       * A readOnly element cannot be modified. However, a user can tab to it, highlight it, focus on it, and copy the text from it.
       * If you want to prevent the user from interacting with the element, use the disabled property instead.
       *
       * @example <caption>Initialize component with <code class="prettyprint">readonly</code> attribute:</caption>
       * &lt;oj-radioset readonly>&lt;/oj-radioset>
       *
       * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
       * // Getter
       * var readonly = myComponent.readonly;
       *
       * // Setter
       * myComponent.readonly = false;
       *
       * @default false
       * @name readOnly
       * @ojshortdesc Specifies whether the component is read-only. A read-only element cannot be modified, but user interaction is allowed. See the Help documentation for more information.
       * @access public
       * @expose
       * @type {?boolean}
       * @alias readonly
       * @instance
       * @memberof oj.ojRadioset
      */
      readOnly: false,

      /**
       * It is used to establish a relationship between this component and another element.
       * A common use is to tie the oj-label and the oj-radioset together for accessibility.
       * The oj-label custom element has an id, and you use the labelled-by attribute
       * to tie the two components together to facilitate correct screen reader behavior.
       *
       * @example <caption>Initialize component with <code class="prettyprint">labelled-by</code> attribute:</caption>
       * &lt;oj-label id="labelId">Name:&lt;/oj-label>
       * &lt;oj-radioset labelled-by="labelId">
       *   &lt;oj-option value="blue">Blue&lt;/oj-option>
       * &lt;/oj-radioset>
       *
       * @example <caption>Get or set the <code class="prettyprint">labelledBy</code> property after initialization:</caption>
       * // getter
       * var disabled = myComp.labelledBy;
       *
       * // setter
       * myComp.labelledBy = "labelId";
       *
       * @expose
       * @type {string|null}
       * @public
       * @instance
       * @memberof oj.ojRadioset
       * @ojshortdesc Establishes a relationship between this component and another element, typically an oj-label custom element. See the Help documentation for more information.
       */
      labelledBy: null,

      /**
       * @typedef {Object} oj.ojRadioset.OptionContext
       * @property {Element} component A reference to the Radioset element.
       * @property {number} index The index of the option, where 0 is the index of the first option.
       * @property {Object} data The data object for the option.
       * @ojsignature [{target:"Type", value:"<D>", for:"genericTypeParameters"},
       *               {target:"Type", value:"D", for:"data"}]
       */

      /**
       * {@ojinclude "name":"radiosetCommonOptionRenderer"}
       * @name optionRenderer
       * @ojshortdesc The renderer function that renders the content of each option.
       * @expose
       * @memberof oj.ojRadioset
       * @instance
       * @type {null|function(Object):Object}
       * @ojsignature { target: "Type",
       *                value: "?((param0: oj.ojRadioset.OptionContext<D>) => Element)|null",
       *                jsdocOverride: true}
       * @default null
       * @example <caption>Initialize the radioset with a renderer:</caption>
       * &lt;oj-radioset option-renderer="[[optionRenderer]]">&lt;/oj-radioset>
       * @example var optionRenderer = function(context) {
       *            var ojOption = document.createElement('oj-option');
       *            // Set the textContent or append other child nodes
       *            ojOption.textContent = context.data['FIRST_NAME'] + ' ' + context.data['LAST_NAME'];
       *            return ojOption;
       *          };
       */

      /**
       * The renderer function that renders each option.
       * The function should return an oj-option element.
       * <p>It is not necessary to set the "value" attribute on the oj-option as it is available from the options data.</p>
       * <p>
       * See <a href="#options">options</a>
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
       *       <td><kbd>component</kbd></td>
       *       <td>A reference to the Radioset element.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>index</kbd></td>
       *       <td>The index of the option, where 0 is the index of the first option.</td>
       *     </tr>
       *     <tr>
       *       <td><kbd>data</kbd></td>
       *       <td>The data object for the option.</td>
       *     </tr>
       *   </tbody>
       * </table>
       *
       * @expose
       * @memberof oj.ojRadioset
       * @instance
       * @ojfragment radiosetCommonOptionRenderer
       */
      optionRenderer: null,

      /**
       * @typedef {Object} oj.ojRadioset.Option
       * @property {boolean=} disabled Option item is disabled.
       * @property {string=} label The display label for the option item. If it's missing, string(value) will be used.
       * @property {any} value The value of the option item.
       */

      /**
       * {@ojinclude "name":"radiosetCommonOptions"}
       *
       * @name options
       * @ojshortdesc The option items for the Radioset.
       * @expose
       * @access public
       * @instance
       * @type {Object|null}
       * @ojsignature { target: "Type",
       *                value: "oj.DataProvider<K, D>|null",
       *                jsdocOverride: true}
       * @default null
       * @memberof oj.ojRadioset
       *
       * @example <caption>Initialize the Radioset with a data provider and data mapping:</caption>
       * &lt;oj-radioset options="[[dataProvider]]">&lt;/oj-radioset>
       *
       * @example <caption>Use simple DataProvider if data has value and label properties.</caption>
       * var dataArray = [
       *            {value: 'Id 1', label: 'Name 1'},
       *            {value: 'Id 2', label: 'Name 2'},
       *            {value: 'Id 3', label: 'Name 3'}];
       *
       * var dataProvider = new oj.ArrayDataProvider(dataArray, {keyAttributes: 'value'});
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
       * A data provider that returns the option items for the Radioset.
       * This attribute can be used instead of providing a list of <code class="prettyprint">oj-option</code> child elements of the Radioset element.
       * <p>This data provider must implement <a href="oj.DataProvider.html">oj.DataProvider</a>.
       *   <ul>
       *   <li><code class="prettyprint">value</code> in <code class="prettyprint">oj.ojRadioset.Option</code> must be the row key in the data provider.</li>
       *   <li>All rows will be displayed in the Radioset.</li>
       *   </ul>
       * </p>
       *
       * @expose
       * @memberof oj.ojRadioset
       * @instance
       * @ojfragment radiosetCommonOptions
       */
      options: null,

      /**
       * @typedef {Object} oj.ojRadioset.OptionsKeys
       * @property {?string=} label The key name for the label.
       * @property {?string=} value The key name for the value.
       */

      /**
       * {@ojinclude "name":"radiosetCommonOptionsKeys"}
       *
       * @example <caption>Initialize the Radioset with <code class="prettyprint">options-keys</code> specified. This allows the key names to be redefined in the options array.</caption>
       * &lt;oj-radioset options-keys="[[optionsKeys]]">&lt;/oj-radioset>
       * @example var optionsKeys = {value : "state_abbr", label : "state_name"};
       *
       * @name optionsKeys
       * @ojshortdesc Specify the key names to use in the options array.  Depending on options-keys means that the signature of the data does not match what is supported by the options attribute.
       * @expose
       * @access public
       * @instance
       * @type {?Object}
       * @ojsignature { target: "Type",
       *                value: "?oj.ojRadioset.OptionsKeys",
       *                jsdocOverride: true}
       * @default null
       * @memberof oj.ojRadioset
       */

      /**
       * Specify the key names to use in the options array.
       * <p>Depending on options-keys means that the signature of the data does not match what is supported by the options attribute. When using Typescript, this would result in a compilation error.</p>
       * <p>Best practice is to use a <a href="oj.ListDataProviderView.html">oj.ListDataProviderView</a> with data mapping as a replacement.</p>
       * <p>However, for the app that must fetch data from a REST endpoint where the data fields do not match those that are supported by the options attribute, you may use the options-keys with any dataProvider that implements <a href="oj.DataProvider.html">oj.DataProvider</a> interface.</p>
       *
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojRadioset
       * @ojfragment radiosetCommonOptionsKeys
       */
      optionsKeys: {
        /**
         * The key name for the label.
         *
         * @name optionsKeys.label
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojRadioset
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
         * @memberof! oj.ojRadioset
         * @type {?string}
         * @ojsignature { target: "Type",
         *                value: "?"}
         * @default null
         */
      },

      /**
       * Whether the component is required or optional. When required is set to true, an implicit
       * required validator is created using the RequiredValidator -
       * <code class="prettyprint">RequiredValidator()</code>.
       *
       * Translations specified using the <code class="prettyprint">translations.required</code> option
       * and the label associated with the component, are passed through to the options parameter of the
       * createValidator method.
       *
       * <p>
       * When <code class="prettyprint">required</code> option changes due to programmatic intervention,
       * the component may clears message and run validation, based on the current state it's in. </br>
       *
       * <h4>Running Validation</h4>
       * <ul>
       * <li>if component is valid when required is set to true, then it runs deferred validation on
       * the property value. This is to ensure errors are not flagged unnecessarily.
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
       *   property is updated; page author can listen to the <code class="prettyprint">optionChange</code>
       *   event to clear custom errors.</li>
       * </ul>
       * </li>
       * </ul>
       *
       * <h4>Clearing Messages</h4>
       * <ul>
       * <li>Only messages created by the component are cleared.</li>
       * <li><code class="prettyprint">messagesCustom</code> option is not cleared.</li>
       * </ul>
       *
       * </p>
       *
       * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
       * This is the default.
       * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by user and the
       * input's label will render a required icon. Additionally a required validator -
       * {@link oj.RequiredValidator} - is implicitly used if no explicit required validator is set.
       * An explicit required validator can be set by page authors using the validators option.
       *
       * When the option is not set, the element's required property is used as its initial
       * value if it exists.
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">required</code> attribute:</caption>
       * &lt;oj-radioset required>
       *   &lt;oj-option value="blue">Blue&lt;/oj-option>
       * &lt;/oj-radioset>
       *
       * @example <caption>Customize messages and hints used by implicit required validator when
       * <code class="prettyprint">required</code> option is set:</caption>
       * &lt;oj-radioset required value="{{colors}}"
       *                    translations='{"required":
       *                                    {"hint": "custom: check at least one value",
       *                                     "messageSummary": "custom: \'{label}\' is Required",
       *                                     "messageDetail", "custom: please check at least one value for \'{label}\'"}}'>
       *   &lt;oj-option value="blue">Blue&lt;/oj-option>
       * &lt;/oj-radioset>
       *
       * @example <caption>Get or set the <code class="prettyprint">required</code> property after initialization:</caption>
       * // getter
       * var required = myComp.required;
       *
       * // setter
       * myComp.required = false;
       *
       * @expose
       * @access public
       * @instance
       * @memberof oj.ojRadioset
       * @ojshortdesc Specifies whether the component is required or optional. See the Help documentation for more information.
       * @type {boolean}
       * @default false
       * @since 0.7.0
       * @see #translations
       */
      required: false,

      /**
       * The value of the component.
       *
       * <p>
       * When <code class="prettyprint">value</code> option changes due to programmatic
       * intervention, the component always clears all messages and runs deferred validation, and
       * always refreshes UI display value.</br>
       *
       * <h4>Clearing Messages</h4>
       * <ul>
       * <li>All messages are cleared. This includes
       * <code class="prettyprint">messagesCustom</code> property.</li>
       * </ul>
       *
       *
       * <h4>Running Validation</h4>
       * <ul>
       * <li>component always runs deferred validation</li>
       * </ul>
       * </p>
       *
       * @example <caption>Initialize component with <code class="prettyprint">value</code> attribute:</caption>
       * &lt;oj-radioset value="coffee">
       *   &lt;oj-option value="coffee">Coffee&lt;/oj-option>
       *   &lt;oj-option value="tea">Tea&lt;/oj-option>
       * &lt;/oj-radioset>
       *
       * @example <caption>Get or set the <code class="prettyprint">value</code> property after initialization:</caption>
       * // getter
       * var val = myComp.value;
       *
       * // setter
       * myComp.value = "tea";
       *
       *
       * @expose
       * @access public
       * @instance
       * @ojwriteback
       * @default null
       * @memberof oj.ojRadioset
       * @ojeventgroup common
       * @ojshortdesc The value of the component. See the Help documentation for more information.
       * @type {any}
       * @ojsignature [{target: "Type", value: "V|null"}]
       */
      value: undefined
    },

    /** ** start Public APIs ****/

    /**
     * Refreshes the radioset
     * <p>A <code class="prettyprint">refresh()</code> is required
     * when a radioset is programatically changed, like in the following circumstances:
     * <ul>
     *   <li>After radios are added or removed or modified (without using ojRadioset) in the DOM.</li>
     * </ul>
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * myComp.refresh();
     *
     * @expose
     * @memberof oj.ojRadioset
     * @ojshortdesc Refreshes the radioset. A refresh is required after a radioset is programmatically changed. See the Help documentation for more information.
     * @public
     * @return {void}
     * @instance
     */
    refresh: function refresh() {
      // Set _ResetComponentState. It is called first in EditableValue's refresh,
      // and we override it in ojradioset to reset the this.$radios in case some have
      // been deleted or overridden.
      this._super();

      this._setup();
    },

    /**
     * Returns a jQuery object containing the element visually representing the radioset.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof oj.ojRadioset
     * @instance
     * @public
     * @return {jQuery} the radio
     * @ignore
     */
    widget: function widget() {
      return this.uiRadioset;
    },

    /**
     * Validates the component's display value using all validators registered on
     * the component and updates the <code class="prettyprint">value</code> option by performing the
     * following steps.
     *
     * <p>
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app. </li>
     * <li>The implicit
     * required validator is run if the component is marked required.</li>
     * <li>At the end of validation if there are errors, the messages are shown.
     * If there were no errors, then the
     * <code class="prettyprint">value</code> property is updated.</li>
     * </ol>
     *
     * @example <caption>Validate component using its current value.</caption>
     * myComp.validate();
     * @example <caption>Validate component and use the Promise's resolved state.</caption>
     * myComp.validate().then(
     *  function(result) {
     *    if(result === "valid")
     *    {
     *      submitForm();
     *    }
     *  });
     * @return {Promise.<string>} Promise resolves to "valid" if
     * the component passed all validations.
     * The Promise resolves to "invalid" if there were validation errors.
     *
     * @method
     * @access public
     * @expose
     * @instance
     * @memberof oj.ojRadioset
     * @ojshortdesc Validates the component's display value using all validators registered on the component. If there are no validation errors, then the value is updated. See the Help documentation for more information.
     * @since 4.0.0
     *
     */
    validate: oj.EditableValueUtils.validate,

    /** ** end Public APIs ****/

    /** ** start internal widget functions ****/

    /**
     * @protected
     * @override
     * @instance
     * @memberof oj.ojRadioset
     */
    _InitOptions: function _InitOptions(originalDefaults, constructorOptions) {
      var checkedRadio;
      var domValue;
      var props = [{
        attribute: 'disabled',
        validateOption: true
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
      } // {attribute: "value"} // code below sets value
      ];

      this._super(originalDefaults, constructorOptions);

      if (!this._IsCustomElement()) {
        oj.EditableValueUtils.initializeOptionsFromDom(props, constructorOptions, this); // component, app, and constructor are merged into this.options.option by the time _InitOptions
        // is called. Let's take this example:
        // component (widget) default - 'foo'<br/>
        // app default - 'bar'<br/>
        // dom  - 'lucy'<br/>
        // constructorOptions['value'] - undefined<br/>
        // this.options.option is set to 'bar' initially. We don't want to just take this value, because
        // we want DOM value to win over the app and components default if DOM is set.
        // Therefore, the component needs to check if the constructorOptions['value'] is
        // undefined and if so, set value option to 'lucy' (the DOM value in this example). <br/>
        //
        // use DOM value if constructorOptions is undefined. if DOM value is undefined, then
        // leave this.options["value"] alone since it's the merged app/widget default at this point.

        if (constructorOptions.value === undefined) {
          // return the checked values by simply looking at DOM node
          this.$radios = this._findRadiosWithMatchingName();
          checkedRadio = this.$radios.filter(':checked');
          domValue = checkedRadio.length === 0 ? undefined : checkedRadio.val(); // we only use the dom if SOMETHING is checked. If nothing is checked, we stay with whatever
          // is in this.options['value'].

          if (domValue !== undefined) {
            // when defaulting from DOM we want to trigger optionChange to writeback new value
            this.option('value', domValue, {
              _context: {
                writeback: true,
                internalSet: true
              }
            });
          } // widget defaults to null


          if (this.options.value === undefined) {
            this.options.value = null;
          }
        }
      }
    },

    /**
     * After _ComponentCreate and _AfterCreate,
     * the widget should be 100% set up. this._super should be called first.
     * @override
     * @protected
     * @memberof oj.ojRadioset
     * @instance
     */
    _ComponentCreate: function _ComponentCreate() {
      var element = this.element;

      this._super(); // since the oj-option renderer uses the oj-radioset ID for the name
      // attribute of the rendered radio buttons, let's make sure the radioset
      // has an ID


      element.uniqueId(); // Async step that generates oj-option if DateProvider is used.
      // RadioCheckboxUtils will set this._optionsDataProvider, this._optionsDataListener
      // and this._optionsDataArray.

      oj.RadioCheckboxUtils.generateOptionsFromData.call(this); // Continue processing for the static oj-option case and set up the component itself

      this._processOjOptions(); // The processOjOptions renders input/label from the oj-options,
      // so now we need to go through and get this.$radios.


      this.$radios = this._findRadiosWithMatchingName(); // first check to see if this.element is NOT a fieldset. If fieldset, throw error.

      if (element.is('fieldset')) {
        throw new Error('ojRadioset cannot be bound to a fieldset. Use a div instead.');
      } // Turn each radio into ojRadioCheckbox. Since ojRadiooxSet delegates to the _ojRadioCheckbox
      // component, and we need to mark this as an internal node so that oj.Components.getComponentElementByNode
      // knows it is an internal component in this case, not a stand-alone component


      this.$radios._ojRadioCheckbox().attr('data-oj-internal', ''); // keep the root dom element and slots as is, and add a wrapper dom underneath it. This way we can
      // have one div around all the inputs and labels, and for inline messaging we can have another
      // div around the inline messaging content. And we can style the borders of the two boxes differently.


      this.uiRadioset = element.addClass('oj-radioset oj-component').attr('role', 'radiogroup'); // need to grab all elements using childNodes first and then do filter because jquery children will automatically
      // exclude all comment and text nodes

      $(element.get(0).childNodes).filter(function () {
        return !(this.getAttribute && this.getAttribute('slot') === 'contextMenu');
      }).wrapAll("<div class='oj-radioset-wrapper oj-form-control-container'></div>"); // @HTMLUpdateOK

      this._on(this._events);

      this._setup();
    },

    /**
     * Resets this.$radios. This is called at the beginning of a refresh in EditableValue
     * @override
     * @memberof oj.ojRadioset
     * @instance
     * @protected
     */
    _ResetComponentState: function _ResetComponentState() {
      // we could have added, removed, or modified radios, so we need to re-find all the
      // inputs on refresh and turn the ones that aren't already ojRadioCheckboxes into them.
      this._processOjOptions();

      this.$radios = this._findRadiosWithMatchingName(); // we have a rule for refresh: if we have a public API for it, then the app dev has to use the
      // option, and not expect changing the dom will update the state with refresh.
      // However, ojRadioset does not expose a public API for the individual radios' disabled state
      // to the app developer. Our private ojRadioCheckbox component has a disabled option that
      // our code has access to.
      // For each radio, we need to look at the disabled attribute dom and update the
      // ojradiocheckbox's disabled option.
      // !! ensures it is a boolean
      // update the private ojradiocheckbox component's disabled option to keep it in sync with the dom

      this.$radios.filter('.oj-radio').each(function () {
        var disabledValue = $(this).attr('disabled') !== undefined ? !!$(this).prop('disabled') : false;

        $(this)._ojRadioCheckbox('option', 'disabled', disabledValue);
      }); // no need to refresh the ojRadioCheckbox's that exist since we have options for everything.
      // of the type=radio inputs that are not yet ojRadioCheckboxs, make them ojRadioCheckboxes.
      // create ojRadioCheckboxes on any new ones.

      this.$radios.not('.oj-radio')._ojRadioCheckbox();
    },

    /**
     * @override
     * @memberof oj.ojRadioset
     * @instance
     * @protected
     * @since 5.0.0
     */
    GetFocusElement: function GetFocusElement() {
      // We need :disabled here so that we don't try to focus on an element that isn't focusable.
      // :focusable doesn't work because this is called before the custom element is fully upgraded
      // and is still hidden in the DOM.
      return this._GetContentElement().not(':disabled').first()[0];
    },

    /**
     * Whether the component is required.
     *
     * @return {boolean} true if required; false
     *
     * @memberof! oj.ojRadioset
     * @instance
     * @protected
     * @override
     */
    _IsRequired: function _IsRequired() {
      return this.options.required;
    },

    /**
     * Sets the disabled option onto the dom.
     * This is a no-op for radioset since its root dom element is a div, and disabled is
     * invalid on a div. If we did try to set disabled on the div, then restore attributes doesn't
     * work correctly since it wasn't saved correctly.
     * @param {Object} node - dom node
     *
     * @memberof oj.ojRadioset
     * @instance
     * @protected
     * @since 1.0.0
     */
    // eslint-disable-next-line no-unused-vars
    _SetDisabledDom: function _SetDisabledDom(node) {// no-op
    },

    /**
     * @memberof oj.ojRadioset
     * @instance
     * @private
     */
    _refreshRequired: oj.EditableValueUtils._refreshRequired,

    /**
     * This function processes the oj-option children, sets the custom renderer, and
     * creates input type=radio and label dom from them.
     *
     * We don't want to rely on the framework calling the customOptionRenderer
     * as a result of setting options[i]["customOptionRenderer"] = renderer; in this function.
     * This could lead to timing bugs when data-oj-binding-provider="none". (when not "none",
     * we know the oj-options are created before the oj-radioset gets created, so no timing issue)
     * Therefore we create the input/label not in the customOptionRenderer,
     * but in a separate function that we call.
     * @private
     * @instance
     */
    _processOjOptions: function _processOjOptions() {
      if (this._IsCustomElement()) {
        // set the custom renderer on oj-option
        var i;
        var len;

        var renderer = this._customOptionRenderer.bind(this);

        var options = this.element.children('oj-option');
        var domElem = this.element[0];
        var wrapperDom = domElem.querySelector('.oj-radioset-wrapper');
        var selectedOption = this.options.value; // if there isn't a wrapper yet, use the component as the wrapper.

        if (!wrapperDom) {
          wrapperDom = domElem;
        }

        var novaluespan = domElem.querySelector('[data-no-value-span]'); // Remove the old no-value span, if there is one and there is a current selection.

        if (novaluespan) {
          if (selectedOption && selectedOption !== '') {
            novaluespan.parentElement.removeChild(novaluespan);
          }
        } else if ((!selectedOption || selectedOption === '') && this.options.readOnly) {
          // Otherwise, add the no value span if no selection.
          var span = document.createElement('span');
          span.setAttribute('data-no-value-span', '');
          span.setAttribute('class', 'oj-choice-item');
          var noCheckboxSelected = this.getTranslatedString('readonlyNoValue');

          if (noCheckboxSelected !== null) {
            span.textContent = noCheckboxSelected;
          }

          wrapperDom.appendChild(span); // @HTMLUpdateOK
        }

        for (i = 0, len = options.length; i < len; i++) {
          options[i].customOptionRenderer = renderer;

          if (this.options.readOnly) {
            this._processReadonlyOptions(options[i], false);
          } else {
            this._initInputLabelFromOjOption(options[i]);
          }
        } // for oj-option that are inside the wrapper (after refresh)


        options = this.element.children('.oj-radioset-wrapper').find('oj-option');

        if (options.length > 0) {
          for (i = 0, len = options.length; i < len; i++) {
            options[i].customOptionRenderer = renderer;

            if (this.options.readOnly) {
              this._processReadonlyOptions(options[i], true);
            } else {
              this._initInputLabelFromOjOption(options[i]);
            }
          }
        }
      }
    },
    _processReadonlyOptions: function _processReadonlyOptions(elem, isAlreadyProcessed) {
      var selectedOption = this.options.value;
      var optionValue = elem.value;
      var parentSpan;

      if (!isAlreadyProcessed) {
        elem.classList.add('oj-helper-hidden');
      } else {
        parentSpan = elem;

        do {
          parentSpan = parentSpan.parentElement;
        } while (parentSpan && !parentSpan.classList.contains('oj-choice-item'));

        if (parentSpan && parentSpan.classList.contains('oj-choice-item') && parentSpan.tagName === 'SPAN') {
          parentSpan.classList.add('oj-helper-hidden');
        }
      }

      if (selectedOption === optionValue) {
        elem.classList.remove('oj-helper-hidden');

        this._initReadonlyLabelFromOjOption(elem, parentSpan);
      }
    },

    /**
     * Create the input type='radio'/label dom from attributes on oj-option element.
     * oj-radioset is made up of input/labels.
     * This gets called during the oj-radioset _CreateComponent and refresh
     * @param {Element} elem the oj-option element
     * @private
     * @instance
     */
    _initInputLabelFromOjOption: function _initInputLabelFromOjOption(elem) {
      var span;
      var label;
      var ojoption = elem; // let's make sure that each oj-option has an ID so the
      // label element can reference the input element via the 'for' attribute
      // we have tests in place where oj-option doesn't have id and where it does
      // both for the databound case and non-databound case. In the databound case, the
      // bindings are resolved before we get here, so we will be fine.

      $(ojoption).uniqueId();
      var id = ojoption.getAttribute('id');
      var radioId = id + '|rb';
      var radio = document.getElementById(radioId); // Was the oj-option already rendered?
      // It is possible that the answer is true;
      // the use case is when we dynamically add an oj-option to the oj-radioset, and in that
      // case we call _processOjOptions (which in turn calls this function) from _ResetComponentState

      var alreadyProcessed = radio !== null; // check to see if we've already processed the oj-option dom or not
      // in the code below, we use setAttribute() for everything as we want to be
      // setting the initial value for these elements.

      if (!alreadyProcessed) {
        span = document.createElement('span');
        radio = document.createElement('input');
        label = document.createElement('label');
        span.setAttribute('class', 'oj-choice-item');
        radio.setAttribute('type', 'radio'); // The value is needed for accessibiliy of the image used for the radio

        radio.setAttribute('value', ojoption.value);
        radio.setAttribute('id', radioId);
        label.setAttribute('for', radioId);
        ojoption.parentElement.insertBefore(span, ojoption); // @HTMLUpdateOK

        label.appendChild(ojoption); // append the oj-option as a child of label

        span.appendChild(radio);
        span.appendChild(label);
      } else {
        var parentSpan = ojoption;

        do {
          parentSpan = parentSpan.parentElement;
        } while (parentSpan && !parentSpan.classList.contains('oj-choice-item'));

        if (parentSpan && parentSpan.classList.contains('oj-helper-hidden') && parentSpan.classList.contains('oj-choice-item') && parentSpan.tagName === 'SPAN') {
          parentSpan.classList.remove('oj-helper-hidden');
        }

        if (ojoption && ojoption.classList.contains('oj-helper-hidden')) {
          ojoption.classList.remove('oj-helper-hidden');
        }

        if (radio && radio.parentElement.classList.contains('oj-helper-hidden')) {
          radio.parentElement.classList.remove('oj-helper-hidden');
        }
      }

      var name = this.element[0].id; // Use the id of the ojradioset as the name for the oj-options.

      var ariaLabel = ojoption.getAttribute('aria-label');
      var ariaLabelledBy = ojoption.getAttribute('aria-labelledby'); // The value attribute of the radio only supports text, so we need to be
      // able to access the oj-option's value property instead.  This attribute
      // is a link back to the oj-option so that we don't need to use dom traversal
      // to get to the oj-option to get its value.

      radio.setAttribute('data-oj-option-id', id);

      if (name && name !== '') {
        radio.setAttribute('name', name);
      }

      if (ariaLabel && ariaLabel !== '') {
        radio.setAttribute('aria-label', ariaLabel);
      } else {
        radio.removeAttribute('aria-label');
      }

      if (ariaLabelledBy && ariaLabelledBy !== '') {
        radio.setAttribute('aria-labelledby', ariaLabelledBy);
      } else {
        radio.removeAttribute('aria-labelledby');
      }

      if (ojoption.disabled) {
        radio.setAttribute('disabled', true);
      } else {
        radio.removeAttribute('disabled');
      }
    },
    _initReadonlyLabelFromOjOption: function _initReadonlyLabelFromOjOption(elem, parentSpan) {
      var ojoption = elem;
      var span;
      var label;

      if (parentSpan) {
        // we do not render the input when the radioset is readonly,
        // input is only rendered with non readonly case
        // if the input exists and it is readonly case we need to hide it.
        $(ojoption).uniqueId();
        var id = ojoption.getAttribute('id');
        var radioId = id + '|rb';
        var radio = document.getElementById(radioId);
        var radioInputExists = radio !== null;

        if (radioInputExists) {
          radio.parentElement.classList.add('oj-helper-hidden');
        }

        parentSpan.classList.remove('oj-helper-hidden');
      } else {
        span = document.createElement('span');
        label = document.createElement('label');
        span.setAttribute('class', 'oj-choice-item');
        ojoption.parentElement.insertBefore(span, ojoption); // @HTMLUpdateOK

        label.appendChild(ojoption); // append the oj-option as a child of label

        span.appendChild(label);
      }
    },
    // custom oj-option renderer
    // Because we can't rely on this being called when we set the customOptionRenderer property
    // in _processOjOptions we shouldn't do the input.label creation from the oj-option
    // in this function. (If we did, the _ComponentCreate code that relies on the
    // inputs/labels being created already would not work.)
    // The correct thing to do is to create the input/label in _initInputLabelFromOjOption
    // Then rely on this function being called after the oj-option has been created and we are
    // changing properties on it.
    _customOptionRenderer: function _customOptionRenderer(elem) {
      var ojoption = elem;
      var id = ojoption.getAttribute('id');
      var radioId = id + '|rb';
      var radio = document.getElementById(radioId); // Was the oj-option already rendered into an _ojRadioCheckbox() in _CreateComponent?

      var radioExists = radio !== null;
      var hasOjRadioClass = radioExists && radio.classList.contains('oj-radio'); // When an oj-option child is disabled (by setting the disabled attribute to
      // true) and it re-renders, the component should refresh automatically rather than requiring the
      // user to call refresh. See .

      if (hasOjRadioClass) {
        $(radio)._ojRadioCheckbox('option', 'disabled', ojoption.disabled);
      }
    },

    /**
     * If custom element, get the labelledBy option, and set this
     * onto the root dom element as aria-labelledby. We append "|label" so it matches the id that
     * is on the oj-label's label element.
     * @memberof oj.ojRadioset
     * @instance
     * @private
     */
    _updateLabelledBy: LabelledByUtils._updateLabelledBy,

    /**
     * Returns a jquery object that is a set of elements that are input type radio
     * and have the name of the first radio found.
     *
     * @return {jQuery} jquery object of all the radios within the root dom element
     * that have the same 'name' attribute as the first radio found.
     * @private
     * @memberof oj.ojRadioset
     */
    _findRadiosWithMatchingName: function _findRadiosWithMatchingName() {
      var allradios;
      var element = this.element;
      var $first = element.find('input[type=radio]:first');
      var name;
      var selector;

      if ($first.length === 0) {
        Logger.warn('Could not find any input type=radio within this element');
      } // get the name attribute of the first input radio


      name = $first.attr('name'); // find all input radios with matching name

      if (name === undefined) {
        // search for all radios with no name
        allradios = element.find('input[type=radio]'); // now loop and find the ones without 'name' attribute

        return allradios.not('[name]');
      } // search for all radios with the name


      selector = 'input[type=radio][name="' + name + '"]';
      return element.find(selector);
    },
    // Override to set custom launcher
    _NotifyContextMenuGesture: function _NotifyContextMenuGesture(menu, event, eventType) {
      // Setting the launcher to the checked radio if any (since that's what's tabbable in mainstream browsers),
      // else the first enabled radio (when no selection, all enabled radios are tabbable).
      // Component owner should feel free to specify a different launcher if appropriate.
      // See the superclass JSDoc for _OpenContextMenu for tips on choosing a launcher.
      var radios = this.element.find('input[type=radio]');
      var checked = radios.filter(':checked');
      var launcher = checked.length ? checked : radios.filter(':enabled').first();

      this._OpenContextMenu(event, eventType, {
        launcher: launcher
      });
    },
    // Override to set launcher to widget
    _GetMessagingLauncherElement: function _GetMessagingLauncherElement() {
      // focus events only get triggered on input, but they do bubble up and we will capture them
      // on the widget.
      // mouseenter events get called once once if the user hovers over for the entire widget. if
      // we put it on the inputs, it gets called every time you leave and enter a new input. Plus,
      // this doesn't work when we hide the input like we do in the native themes.
      return this.widget();
    },

    /**
     * _setup is called on create and refresh. Use the disabled option to
     * update the component. If the component's option is disabled, then
     * leave it alone.
     * @memberof oj.ojRadioset
     * @instance
     * @private
     */
    _setup: function _setup() {
      // at this point we already have this.$radios set to a list of radios for this radioset.
      this._propagateDisabled(this.options.disabled); // add to the root dom the style class 'oj-choice-direction-column'
      // if there isn't already a 'oj-choice-direction-row' or 'oj-choice-direction-column' there.


      if (!this.element.hasClass('oj-choice-direction-column') && !this.element.hasClass('oj-choice-direction-row')) {
        this.element.addClass('oj-choice-direction-column');
      }

      this._refreshRequired(this.options.required); // copy labelledBy to aria-labelledBy


      var widget = this.widget();

      this._updateLabelledBy(widget[0], null, this.options.labelledBy, widget);
    },
    _events: {
      change: function change(event) {
        this._HandleChangeEvent(event);
      }
    },

    /**
     * @param {Event} event DOM event
     * @override
     * @protected
     * @memberof oj.ojRadioset
     */
    _HandleChangeEvent: function _HandleChangeEvent(event) {
      // TODO make sure the target is an input radio?
      // TODO any more checks I need to do?
      // alert("XYZ In _changeSetValue target is " + event.target + " And the value of the input is " + event.target.value);
      // should I double check that the event.target is the same as the 'checked'?
      // if (event.target === this.$radios.filter(":checked"))???
      //
      var submittedValue = this._GetDisplayValue(); // run full validation. There is no need to check if values have changed
      //  since for checkboxset/radioset if we get into this function we know value has changed.
      // passing in doValueChangeCheck: false will skip the new-old value comparison


      this._SetValue(submittedValue, event, _sValueChangeCheckFalse);
    },

    /**
     * Returns the display value that is ready to be passed to the converter.
     *
     * @param {Object} value the stored value if available that needs to be formatted for display
     * @override
     * @protected
     * @memberof oj.ojRadioset
     */
    // eslint-disable-next-line no-unused-vars
    _GetDisplayValue: function _GetDisplayValue(value) {
      // return the value of the 'checked' radio
      return this._GetElementValue();
    },

    /**
     * Called when the display value on the element needs to be updated
     * as a result of a value change.
     * ojRadioset stores a String value, and this value matches the value
     * of the currently checked radio. So, if we need to set the display value,
     * what this means is we need to 'check' the radio whose value matches the
     * displayValue.
     *
     * @param {String} displayValue the value of the radio button that needs to be selected
     * @override
     * @protected
     * @memberof oj.ojRadioset
     */
    _SetDisplayValue: function _SetDisplayValue(displayValue) {
      var i;
      var length = this.$radios.length;
      var matchIndex = -1;
      var radios = this.$radios.get();
      var radioValues = [];
      var $radio; // Find the element matching displayValue
      // first, do an === compare

      for (i = 0; i < length; i++) {
        // save the values for the deep compare case
        radioValues[i] = this._GetOptionValue(radios[i]);

        if (radioValues[i] === displayValue) {
          matchIndex = i;
          break;
        }
      } // If not found, do a deep compare


      if (matchIndex === -1) {
        for (i = 0; i < length; i++) {
          if (oj.Object.compareValues(radioValues[i], displayValue)) {
            matchIndex = i;
            break;
          }
        }
      } // go through each _ojRadioCheckbox and see if it needs to be checked or unchecked.


      for (i = 0; i < length; i++) {
        $radio = $(this.$radios[i]); // does the radio's value match the displayValue?

        var checked = $radio._ojRadioCheckbox('option', 'checked');

        if (i === matchIndex) {
          // yes. this needs to be checked, if it isn't already
          if (!checked) {
            $radio._ojRadioCheckbox('option', 'checked', true);
          }
        } else if (checked) {
          // / no. this needs to be unchecked, if it isn't already
          $radio._ojRadioCheckbox('option', 'checked', false);
        }
      }
    },

    /**
     * Returns the element's value. Normally, this is a call to this.element.val(),
     * but in the case of ojRadioset, the element's value is really the value
     * of the checked radio in the set.
     * @override
     * @protected
     * @memberof oj.ojRadioset
     * @return {any} The value of the selected radio, or null if no selection.
     */
    _GetElementValue: function _GetElementValue() {
      // "input:checked" selects radios that are currently checked as
      // reflected in their boolean (true or false) checked property,
      // which is affected when the user clicks the radio for example.
      // for radio, there will be one or none checked;
      // if none are checked, return null (checkedRadio.val() is undefined if nothing is checked)
      var checkedRadio = this.$radios.filter(':checked');

      if (checkedRadio.length === 0) {
        return null;
      }

      return this._GetOptionValue(checkedRadio[0]);
    },

    /**
     * For custom element, we get the value from the oj-option element, otherwise
     * we get the value from the radio element.
     * @override
     * @protected
     * @memberof oj.ojRadioset
     * @return {any} Returns the value property of the associated oj-option, or the value attribute of the radio element.
     */
    _GetOptionValue: function _GetOptionValue(radioElem) {
      var option;
      var val;

      if (this._IsCustomElement()) {
        option = document.getElementById(radioElem.getAttribute('data-oj-option-id'));

        if (option) {
          val = option.value;
        }
      } else {
        val = radioElem.value;
      }

      return val;
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
     * @memberof oj.ojRadioset
     * @override
     * @protected
     */
    _GetDefaultStyleClass: function _GetDefaultStyleClass() {
      return 'oj-radioset';
    },

    /**
     * Returns a jquery object of the elements representing the
     * content nodes (input type=radio). This is used in EditableValue to add
     * aria-describedby to the input when there is a help icon, to add
     * aria-required and aria-invalid
     * @protected
     * @override
     * @memberof oj.ojRadioset
     */
    _GetContentElement: function _GetContentElement() {
      if (this.$radios != null) {
        return this.$radios;
      }

      this.$radios = this._findRadiosWithMatchingName();
      return this.$radios;
    },

    /**
     * Called to find out if aria-required is unsupported. This is needed for the label.
     * It is not legal to have aria-required on radio/checkboxes, nor on
     * radiogroup/group.
     * If aria-required is not supported, then we wrap the required icon as well as the
     * help icons so that JAWS can read required. We don't do this for form controls that use
     * aria-required because if we did JAWS would read required twice.
     * @memberof oj.ojRadioset
     * @instance
     * @protected
     * @return {boolean}
     */
    _AriaRequiredUnsupported: function _AriaRequiredUnsupported() {
      return true;
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
     * @memberof oj.ojRadioset
     * @instance
     * @protected
     */
    _AfterSetOptionRequired: oj.EditableValueUtils._AfterSetOptionRequired,

    /**
     * @private
     * @memberof oj.ojRadioset
     */
    _propagateDisabled: function _propagateDisabled(_disabled) {
      var disabled = !!_disabled;
      this.$radios.each(function () {
        // this is the technique to use to call package-private functions
        // Calling it like this.$radios.ojRadioCheckbox("__setAncestorComponentDisabled",value)
        // gives an error because jquery prevents you from calling functions with an "_"
        //
        // This is how we handle 'disabled' for radioset. We don't change the radiocheckbox
        // component's disabled option ever since if we do that we've lost what the initial disabled
        // state is (we store the disabled dom value from the radio into its disabled option)
        // and we need that when we refresh. Instead what we do
        // is we mark if its ancestor (the radioset) is disabled or not. Then, when we render
        // out the radios 'disabled' state, like oj-disabled, we look to see if it is 'effectively
        // disabled' (see _IsEffectivelyDisabled call in ojRadioCheckbox), that is if its
        // option is disabled OR its ancestor (the radioset) is disabled.
        $(this).data('oj-_ojRadioCheckbox').__setAncestorComponentDisabled(disabled);
      });

      this.$radios._ojRadioCheckbox('refreshDisabled');
    },

    /**
     * Note that _setOption does not get called during create in the super class.
     * It only gets called when the component has already been created.
     * @override
     * @private
     * @memberof oj.ojRadioset
     */
    _setOption: function _setOption(key, value, flags) {
      var originalValue = this.options.labelledBy;

      this._super(key, value, flags);

      switch (key) {
        case 'disabled':
          this._propagateDisabled(value);

          break;

        case 'readOnly':
          this._processOjOptions();

          break;

        case 'value':
          this._processOjOptions();

          break;

        case 'labelledBy':
          // remove the old one and add the new one
          var widget = this.widget();

          this._updateLabelledBy(widget[0], originalValue, value, widget);

          break;

        case 'options':
          oj.RadioCheckboxUtils.generateOptionsFromData.call(this);
          break;

        case 'optionsKeys':
        case 'optionRenderer':
          oj.RadioCheckboxUtils.renderOptions.call(this);
          break;

        default:
          break;
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
     * @memberof oj.ojRadioset
     * @instance
     * @override
     */
    // eslint-disable-next-line no-unused-vars
    _AfterSetOption: function _AfterSetOption(option, previous, flags) {
      this._superApply(arguments);

      switch (option) {
        case 'required':
          this._AfterSetOptionRequired(option);

          break;

        default:
          break;
      }
    },
    //* * @inheritdoc */
    getNodeBySubId: function getNodeBySubId(locator) {
      var node = this._super(locator);

      var radios;
      var subId;
      var value;
      var i;

      if (!node) {
        radios = this.$radios.get();
        subId = locator.subId;

        switch (subId) {
          case 'oj-radioset-inputs':
            // TODO: depricated for a while now, remove this in 4.0.0
            node = radios;
            break;

          case 'oj-radioset-radio':
            // We find these by the value attribute on the input element, which is
            // much more stable that using an index.
            value = locator.value;

            if (typeof value !== 'undefined') {
              var arrayLength = radios.length;
              var matchIndex = -1;
              var radioValues = []; // Find the index of the match

              for (i = 0; i < arrayLength; i++) {
                // save the values just in case we need to do deep compare
                radioValues[i] = this._GetOptionValue(radios[i]);

                if (radioValues[i] === value) {
                  matchIndex = i;
                  break;
                }
              } // If not found, do a deep compare


              if (matchIndex === -1) {
                for (i = 0; i < arrayLength; i++) {
                  if (oj.Object.compareValues(radioValues[i], value)) {
                    matchIndex = i;
                    break;
                  }
                }
              }

              if (matchIndex !== -1) {
                node = radios[matchIndex];
              }
            }

            break;

          default:
            break;
        }
      } // Non-null locators have to be handled by the component subclasses


      return node || null;
    },
    //* * @inheritdoc */
    getSubIdByNode: function getSubIdByNode(node) {
      var topElem = this._GetContentElement()[0].parentElement.parentElement.parentElement;

      var currentNode = node;

      while (currentNode && currentNode !== topElem) {
        if (currentNode.nodeName === 'LABEL') {
          currentNode = document.getElementById(currentNode.for);
        }

        if (currentNode.nodeName === 'INPUT') {
          return {
            subId: 'oj-radioset-radio',
            value: this._GetOptionValue(currentNode)
          };
        }

        currentNode = currentNode.parentElement;
      }

      return this._super(node);
    },

    /**
     * @ignore
     * @protected
     * @memberof oj.ojRadioset
     * @override
     */
    _destroy: function _destroy() {
      var ret = this._super();

      var wrapperDom = this.element[0].firstElementChild;

      if (this.$radios) {
        this.$radios._ojRadioCheckbox('destroy');
      } // remove the dom we added to wrap the children of this.element, but don't remove the children.


      $(wrapperDom).contents().unwrap();
      oj.RadioCheckboxUtils.removeDataListener.call(this);
      return ret;
    }
    /** ** end internal widget functions ****/

    /**
     * Removes the radioset functionality completely.
     * This will return the element back to its pre-init state.
     *
     * <p>This method does not accept any arguments.
     *
     * @method
     * @name oj.ojRadioset#destroy
     * @memberof oj.ojRadioset
     * @instance
     * @ignore
     *
     * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
     * $( ".selector" ).ojRadioset( "destroy" );
     */

  }); // ////////////////     SUB-IDS     //////////////////

  /**
   * <p>Sub-ID for the radioset's radios.</p>
   *
   * @ojsubid oj-radioset-inputs
   * @deprecated 3.0.0 Since the application supplies the input elements, it can supply a unique ID by which the input elements can be accessed.
   * @ignore
   * @memberof oj.ojRadioset
   *
   * @example <caption>Get the nodes for the radios:</caption>
   * var nodes = $( ".selector" ).ojRadioset( "getNodeBySubId", {'subId': 'oj-radioset-inputs'} );
   */
  // Fragments:

  /**
   * <p>The &lt;oj-radioset> element accepts <code class="prettyprint">oj-option</code> elements as children. See the [oj-option]{@link oj.ojOption} documentation for details about
   * accepted children and slots.</p>
   *
   * @ojchild Default
   * @memberof oj.ojRadioset
   * @ojshortdesc The oj-radioset element accepts oj-option elements as children.
   *
   * @example <caption>Initialize the Radioset with child content specified:</caption>
   * &lt;oj-radioset>
   *   &lt;oj-option value="radio1">Radio 1&lt;/oj-option>
   *   &lt;oj-option value="radio2">Radio 2&lt;/oj-option>
   *   &lt;oj-option value="radio3">Radio 3&lt;/oj-option>
   * &lt;/oj-radioset>
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
   *       <td>Input</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Select the input. In some themes, the input is not visible,
   *       so you will tap on the label.</td>
   *     </tr>
   *     <tr>
   *       <td>Input's label</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Select the corresponding input.</td>
   *     </tr>
   *     <tr>
   *       <td>Input or Label</td>
   *       <td><kbd>Press & Hold</kbd></td>
   *       <td>If hints, help.instruction or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *    </tr>
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojRadioset
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
   *       <td rowspan="2">Input</td>
   *       <td><kbd>UpArrow</kbd></td>
   *       <td>Select the previous input in the group.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>DownArrow</kbd></td>
   *       <td>Select the next input in the group.</td>
   *     </tr>
   *     <tr>
   *       <td>Radioset</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the checked radio input. If hints, title or messages exist in a notewindow,
   *        pop up the notewindow.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojRadioset
   */

  /**
   * {@ojinclude "name":"ojStylingDocIntro"}
   *
   * <table class="generic-table styling-table">
   *   <thead>
   *     <tr>
   *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
   *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
   *       <th>{@ojinclude "name":"ojStylingDocExampleHeader"}</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>oj-choice-direction-column</td>
   *       <td>This is the default. It lays out the radios in a column.
   *       </td>
   *       <td>
   * <pre class="prettyprint">
   * <code>&lt;oj-radioset id="radiosetId"
   *  class="oj-choice-direction-column">
   * </code></pre>
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-choice-direction-row</td>
   *       <td>It lays out the radio buttons in a row.
   *       </td>
   *       <td>
   * <pre class="prettyprint">
   * <code>&lt;oj-radioset id="radiosetId"
   *  class="oj-choice-direction-row">
   * </code></pre>
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-radioset-no-chrome</td>
   *       <td>Use this styleclass if you don't want the chrome around the set.
   *       </td>
   *       <td>
   * <pre class="prettyprint">
   * <code>&lt;oj-radioset id="radiosetId"
   *  class="oj-radioset-no-chrome">
   * </code></pre>
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-radioset-input-start</td>
   *       <td>Use this styleclass to order the radio at the start and label text at the end
   *       even if a theme has a different default order.
   *       </td>
   *       <td>
   * <pre class="prettyprint">
   * <code>&lt;oj-radioset id="radiosetId"
   *  class="oj-radioset-input-start">
   * </code></pre>
   *       </td>
   *     </tr>
   *     <tr>
   *       <td>oj-radioset-input-end</td>
   *       <td>Use this styleclass to order the radio at the end and the label text at the start
   *       even if a theme has a different default order.
   *       </td>
   *       <td>
   * <pre class="prettyprint">
   * <code>&lt;oj-radioset id="radiosetId"
   *  class="oj-radioset-input-end">
   * </code></pre>
   *       </td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
   * @memberof oj.ojRadioset
   */

})();



/* global __oj_radioset_metadata:false */
(function () {
  __oj_radioset_metadata.extension._WIDGET_NAME = 'ojRadioset';
  __oj_radioset_metadata.extension._ALIASED_PROPS = {
    readonly: 'readOnly'
  };
  oj.CustomElementBridge.register('oj-radioset', {
    metadata: __oj_radioset_metadata
  });
})();

});