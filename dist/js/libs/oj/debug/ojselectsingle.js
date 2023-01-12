/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojselectbase', 'ojs/ojcore-base', 'ojs/ojkeyset', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojthemeutils', 'ojs/ojlogger', 'ojs/ojcustomelement-utils'], function (ojselectbase, oj, ojkeyset, $, Components, ThemeUtils, Logger, ojcustomelementUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  (function () {
var __oj_select_single_metadata = 
{
  "properties": {
    "data": {
      "type": "object",
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "deprecated",
              "since": "14.0.0",
              "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
            }
          ]
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
        "helpInstruction": {
          "type": "Array<string>|string",
          "value": [
            "notewindow"
          ]
        },
        "messages": {
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
    "itemText": {
      "type": "string|function",
      "value": "label"
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
    "placeholder": {
      "type": "string",
      "value": ""
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
        "cancel": {
          "type": "string"
        },
        "labelAccClearValue": {
          "type": "string"
        },
        "labelAccOpenDropdown": {
          "type": "string"
        },
        "multipleMatchesFound": {
          "type": "string"
        },
        "nOrMoreMatchesFound": {
          "type": "string"
        },
        "noMatchesFound": {
          "type": "string"
        },
        "noResultsLine1": {
          "type": "string"
        },
        "noResultsLine2": {
          "type": "string"
        },
        "oneMatchFound": {
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
    "value": {
      "type": "any",
      "writeback": true
    },
    "valueItem": {
      "type": "object",
      "writeback": true,
      "value": {
        "key": null,
        "data": null,
        "metadata": null
      }
    },
    "virtualKeyboard": {
      "type": "string",
      "enumValues": [
        "email",
        "number",
        "search",
        "tel",
        "text",
        "url"
      ],
      "value": "search"
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
    "ojValueAction": {}
  },
  "extension": {}
};
    __oj_select_single_metadata.extension._WIDGET_NAME = 'ojSelectSingle';
    __oj_select_single_metadata.extension._INNER_ELEM = 'input';
    __oj_select_single_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['tabindex'];
    __oj_select_single_metadata.extension._ALIASED_PROPS = { readonly: 'readOnly' };
    oj.CustomElementBridge.register('oj-select-single', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_select_single_metadata, {
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
   * @private
   */
  const LovDropdownSingle = function () {};

  oj.Object.createSubclass(LovDropdownSingle, ojselectbase.LovDropdown, 'LovDropdownSingle');

  LovDropdownSingle.prototype.init = function (options) {
    LovDropdownSingle.superclass.init.call(this, options);
  };

  /**
   * @memberof LovDropdownSingle
   * @instance
   * @private
   */
  LovDropdownSingle.prototype._createKeySetImpl = function (selectedValue) {
    if (selectedValue === null || selectedValue === undefined) {
      return new ojkeyset.KeySetImpl([]);
    }
    return new ojkeyset.KeySetImpl([selectedValue]);
  };

  /**
   * @memberof LovDropdownSingle
   * @instance
   * @protected
   * @override
   */
  LovDropdownSingle.prototype._ConfigureResultsInitial = function (selectedValue, busyContext) {
    // If it is the initial fetch, set both selection and currentRow, because both were cleared
    // initially.

    // if there is a selected value, then the collection would have
    // filtered the data using the display text initially. Set the current row only if the
    // fetched data is not empty.
    // TODO: Implement a better way to determine if the selectedValue is present in
    //       the fetched data.
    if (!this._isValueForPlaceholderFunc(selectedValue)) {
      this._SetCollectionCurrentRow({ rowKey: selectedValue });
      var selectedKeySet = this._createKeySetImpl(selectedValue);
      this._SetCollectionSelectedKeySet(selectedKeySet);
      return busyContext.whenReady();
    }
    if (!this._fullScreenPopup) {
      // JET-38215 - SELECT SINGLE - KEYBOARD NAVIGATION FOR COLLECTION TEMPLATE USAGE
      // prepare for getting keyboard focus so that the first row of the table body will be focused
      // instead of the header
      return this._FetchFirstResultForKeyboardFocus();
    }
    return busyContext.whenReady();
  };

  /**
   * @memberof LovDropdownSingle
   * @instance
   * @protected
   * @override
   */
  LovDropdownSingle.prototype._ConfigureResultsNoSearchText = function (selectedValue, busyContext) {
    // If no search text is present, clear current row
    this._SetCollectionCurrentRow({ rowKey: null });
    var selectedKeySet = this._createKeySetImpl(selectedValue);
    this._SetCollectionSelectedKeySet(selectedKeySet);
    // Wait for the collection to be updated and resolve the operation
    if (!this._fullScreenPopup) {
      // JET-38215 - SELECT SINGLE - KEYBOARD NAVIGATION FOR COLLECTION TEMPLATE USAGE
      // prepare for getting keyboard focus so that the first row of the table body will be focused
      // instead of the header
      return this._FetchFirstResultForKeyboardFocus();
    }
    return busyContext.whenReady();
  };

  /**
   * @memberof LovDropdownSingle
   * @instance
   * @protected
   * @override
   */
  LovDropdownSingle.prototype._ConfigureResultsWithSearchText = function (
    selectedValue,
    busyContext
  ) {
    // If search text is present, the first option should be highlighted
    // TODO: This call modifies the fetchedDataCount in the dataProvider,
    //       should this be reset to the initial value? For now, the count is stored
    //       in the LovDropdown and can be retrieved by calling LovDropdown.prototype.getResultsCount
    //       method.
    return this._FetchFirstResult().then(
      function (data) {
        if (data == null) {
          this._SetCurrentFirstItem(null);
          this._ClearSelection();
          // Return the busy context promise
          return busyContext.whenReady();
        }

        // Set the current value item
        var rowKey = data.key;
        this._SetCurrentFirstItem(data);
        this._SetCollectionCurrentRow({ rowKey: rowKey });
        // During initial render the handlers will be short-circuited, so we
        // need to call selected separately
        var selectedKeySet = this._createKeySetImpl(selectedValue);
        this._SetCollectionSelectedKeySet(selectedKeySet);

        // Return the busy context promise
        return busyContext.whenReady();
      }.bind(this)
    );
  };

  /**
   * @memberof LovDropdownSingle
   * @instance
   * @protected
   * @override
   */
  LovDropdownSingle.prototype._HandleCollectionSelectedItemChanged = function (_valueItem, event) {
    // Do nothing if called during the initialization phase or when we're pushing changes due to the
    // collection receiving focus
    if (this._duringListViewInitialization || this._handlingCollectionFocusinOnce) {
      return;
    }

    var valueItem = !this._isValueItemForPlaceholderFunc(_valueItem) ? _valueItem : null;

    // keep context up to date
    this._collectionContext.selectedItem = valueItem;

    this._handleSelection(valueItem, event);
  };

  /**
   * @memberof LovDropdownSingle
   * @instance
   * @protected
   * @override
   */
  LovDropdownSingle.prototype._GetDefaultCollectionRendererSelectionMode = function () {
    return 'single';
  };

  /**
   * @ojcomponent oj.ojSelectSingle
   * @augments oj.ojSelectBase
   * @ojimportmembers oj.ojDisplayOptionsNoConverterValidatorHints
   * @since 8.0.0
   * @ojdisplayname Select (Single)
   * @ojshortdesc A select single is a dropdown list that supports single selection and search filtering.
   * @ojrole combobox
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "ItemMetadata"]}
   * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet"]}
   * @ojtsimport {module: "ojcommontypes", type: "AMD", importName: ["CommonTypes"]}
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojSelectSingle<V, D> extends ojSelectBase<V, D, ojSelectSingleSettableProperties<V, D>>",
   *                genericParameters: [{"name": "V", "description": "Type of value of the component/key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojSelectSingleSettableProperties<V, D> extends ojSelectBaseSettableProperties<V, D>",
   *                for: "SettableProperties"
   *               }
   *              ]
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "placeholder", "required", "disabled", "virtualKeyboard"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["data", "value"]}
   * @ojvbdefaultcolumns 6
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-select'
   * @ojuxspecs ['select-single-item']
   *
   * @classdesc
   * <h3 id="selectSingleOverview-section">
   *   JET Select Single
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectSingleOverview-section"></a>
   * </h3>
   * <p>Description: JET Select Single provides support for single-select and search filtering.</p>
   *
   * <p>A JET Select Single can be created with the following markup.</p>
   *
   * <pre class="prettyprint"><code>
   * &lt;oj-select-single data="[[dataProvider]]">
   * &lt;/oj-select-single>
   * </code></pre>
   *
   * <h4>Data</h4>
   * <p>The only way to provide data to JET Select Single is through a
   * <a href="DataProvider.html">DataProvider</a>.  Using
   * <a href="oj.ojOption.html">&lt;oj-option></a> and
   * <a href="oj.ojOptgroup.html">&lt;oj-optgroup></a> child tags is not supported.  For cases with
   * a small set of fixed data, use an <a href="ArrayDataProvider.html">ArrayDataProvider</a>.</p>
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
   *
   * <h3 id="perf-section">
   *   Performance
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
   * </h3>
   *
   * <h4>Page Load</h4>
   * <p>If there is an initially selected value, setting the <a href="#valueItem">valueItem</a> attribute initially can improve page load performance because the element will not have to fetch the selected label from the data provider.</p>
   * <p>The dropdown data isn't fetched until the user opens the dropdown.</p>
   *
   * {@ojinclude "name":"selectCommon"}
   */
  // --------------------------------------------------- oj.ojSelectSingle Styling Start ------------------------------------------------------------
  // ---------------- oj-select-results ----------------------
  /**
   * Apply this class to the collection element (e.g. an &lt;oj-list-view>) in the collectionTemplate.
   * @ojstyleclass oj-select-results
   * @ojdisplayname Collection Element
   * @ojstyleselector oj-select-single oj-table, oj-select-single oj-list-view
   * @memberof oj.ojSelectSingle
   */
  /**
   * @classdesc The following CSS classes can be applied by the page author as needed.<br/>
   * The form control style classes can be applied to the component, or an ancestor element. <br/>
   * When applied to an ancestor element, all form components that support the style classes will be affected.
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
   * @memberof oj.ojSelectSingle
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-select-single class="oj-form-control-max-width-md">
   * &lt;/oj-select-single>
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-sm
   * @ojshortdesc Sets the max width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojSelectSingle
   */
  /**
   * @ojstyleclass form-control-max-width.oj-form-control-max-width-md
   * @ojshortdesc Sets the max width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojSelectSingle
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
   * @memberof oj.ojSelectSingle
   * @ojunsupportedthemes ['Alta']
   * @ojtsexample
   * &lt;oj-select-single class="oj-form-control-width-md">
   * &lt;/oj-select-single>
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-sm
   * @ojshortdesc Sets the width for a small field
   * @ojdisplayname Small
   * @memberof! oj.ojSelectSingle
   */
  /**
   * @ojstyleclass form-control-width.oj-form-control-width-md
   * @ojshortdesc Sets the width for a medium field
   * @ojdisplayname Medium
   * @memberof! oj.ojSelectSingle
   */
  // ---------------- oj-form-control-text-align- --------------
  /**
   * Classes that help align text of the element.
   * @ojstyleset text-align
   * @ojdisplayname Text Alignment
   * @ojstylesetitems ["text-align.oj-form-control-text-align-right", "text-align.oj-form-control-text-align-start", "text-align.oj-form-control-text-align-end"]
   * @ojstylerelation exclusive
   * @memberof oj.ojSelectSingle
   * @ojtsexample
   * &lt;oj-select-single class="oj-form-control-text-align-right">
   * &lt;/oj-select-single>
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-right
   * @ojshortdesc Aligns the text to the right regardless of the reading direction. This is normally used for right aligning numbers.
   * @ojdisplayname oj-form-control-text-align-start
   * @memberof! oj.ojSelectSingle
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-start
   * @ojshortdesc Aligns the text to the left in LTR and to the right in RTL.
   * @ojdisplayname oj-form-control-text-align-start
   * @memberof! oj.ojSelectSingle
   */
  /**
   * @ojstyleclass text-align.oj-form-control-text-align-end
   * @ojshortdesc Aligns the text to the right in LTR and to the left in RTL.
   * @ojdisplayname oj-form-control-text-align-end
   * @memberof! oj.ojSelectSingle
   */
  // --------------------------------------------------- oj.ojSelectSingle Styling end ------------------------------------------------------------

  /**
   *
   * <h3 id="rtl-section">
   *   Reading direction
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
   * </h3>
   *
   * <p>As with any JET element, in the unusual case that the directionality (LTR or RTL) changes post-init, the Select must be <code class="prettyprint">refresh()</code>ed.</p>
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
   * @ojfragment selectCommon
   * @memberof oj.ojSelectSingle
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
   * @memberof oj.ojSelectSingle
   */
  oj.__registerWidget('oj.ojSelectSingle', $.oj.ojSelectBase, {
    options: {
      /**
       * The <code class="prettyprint">valueItem</code> is similar to the
       * <code class="prettyprint">value</code>, but is a
       * <a href="CommonTypes.html#ItemContext">CommonTypes.ItemContext&lt;V, D></a> object which
       * contains both a key and data, and optional metadata.
       * The key will be set as the <code class="prettyprint">value</code> of the element.
       * The <code class="prettyprint">value</code> and <code class="prettyprint">valueItem</code>
       * are kept in sync, both during programmatic property sets as well as during interactive user
       * selection.
       * If initially both are set, the selected value in the <code class="prettyprint">value</code>
       * attribute has precedence.
       * <p>Note: If there is an initial selection, setting it via the
       * <code class="prettyprint">valueItem</code> attribute initially can improve page load
       * performance because the element will not have to fetch the selected data from the data
       * provider.</p>
       * <p>If <code class="prettyprint">valueItem</code> is not specified or the selected value is
       * missing, then the selected data will be fetched from the data provider.</p>
       *
       * @name valueItem
       * @ojshortdesc The current value of the element and its associated data.
       * @expose
       * @instance
       * @type {null | Object}
       * @ojsignature {target:"Type", value:"CommonTypes.ItemContext<V,D>", jsdocOverride:true}
       * @default { key: null, data: null, metadata: null }
       * @ojwriteback
       *
       * @memberof oj.ojSelectSingle
       *
       * @example <caption>Initialize the Select with the <code class="prettyprint">value-item</code> attribute specified:</caption>
       * &lt;oj-select-single value-item="[[valueItem]]">&lt;/oj-select-single>
       *
       * @example <caption>Object with key and data properties:</caption>
       * var valueItem = {'key': 'val1', 'data': {'value': 'val1', 'label': 'Label 1'}};
       *
       * @example <caption>Get or set the <code class="prettyprint">valueItem</code> property after initialization:</caption>
       * // getter
       * var valueItem = mySelect.valueItem;
       *
       * // setter
       * mySelect.valueItem = valueItem;
       */
      valueItem: { key: null, data: null, metadata: null }

      /**
       * The value of the element. The type must be the same as the type of keys in the data provider.
       *
       * @example <caption>Initialize the Select with the <code class="prettyprint">value</code> attribute specified:</caption>
       * &lt;oj-select-single value="option1">&lt;/oj-select-single>
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
       * @memberof oj.ojSelectSingle
       * @type {null | any}
       * @ojsignature {target: "Type",
       *               value: "V | null",
       *               genericParameters: [{"name": "V", "description": "Key in Data Provider"}],
       *               jsdocOverride: true}
       * @ojwriteback
       * @ojeventgroup common
       */

      /**
       * Triggered when a value is submitted by the user, even if the value is the same as the
       * previous value.
       * Submission is triggered by selecting a value from the dropdown using the keyboard, mouse,
       * or a touch gesture.  Note that the <a href="#value">value</a> property is guaranteed to be
       * up-to-date at the time the ojValueAction event is dispatched.
       *
       * @expose
       * @event
       * @name valueAction
       * @memberof oj.ojSelectSingle
       * @since 10.0.0
       * @instance
       * @ojshortdesc Event triggered when a value is submitted by the user, even if the value
       *   hasn't changed.
       * @property {any | null} value The selected value.
       * @property {Object} itemContext The data provider context for the value.
       * @property {any | null} previousValue The previous selected value.
       * @ojsignature [
       *   {target: "Type", value:"<V, D>", for:"genericTypeParameters" },
       *   {target: "Type", value: "V | null", for: "value"},
       *   {target: "Type", value: "V | null", for: "previousValue"},
       *   {target: "Type", value: "CommonTypes.ItemContext<V, D>", for: "itemContext"}
       * ]
       */
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _ComponentCreate: function () {
      this._super();

      // JET-44210 - throw an error when a value-item is set externally that contains the key
      // but not the data
      var valueItem = this.options.valueItem;
      if (!this._IsValueItemForPlaceholder(valueItem) && valueItem.data == null) {
        throw new Error('Select Single: value-item contains key but no data');
      }

      this._cssOptionDefaults =
        ThemeUtils.parseJSONFromFontFamily('oj-searchselect-option-defaults') || {};

      this._defaultValueForPlaceholder = null;
      this._defaultValueItemForPlaceholder = { key: null, data: null, metadata: null };

      this._SetupSelectResources();
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _AfterCreate: function () {
      this._super();

      // need to apply the oj-focus marker selector for control of the floating label.
      var rootElement = this._getRootElement();
      this._focusable({
        element: rootElement,
        applyHighlight: false,
        afterToggle: this._HandleAfterFocusToggle.bind(this, rootElement)
      });

      // If labelEdge is set to none, aria-label would have been set to the root element
      // so, we need to update the aria-label elsewhere
      if (this.options.labelEdge === 'none') {
        this._updateLabel();
      }
    },

    /**
     * @protected
     * @override
     * @instance
     * @memberof! oj.ojSelectSingle
     */
    _GetTranslationsSectionName: function () {
      return 'oj-ojSelectSingle';
    },

    /**
     * Sets up resources for select single
     *
     * @param {HTMLElement=} cachedMainFieldInputElem An optional HTML input element to be
     *                                                used for main field element
     *
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _SetupSelectResources: function (cachedMainFieldInputElem) {
      this._resolveValueItemLater = false;

      this._super(cachedMainFieldInputElem);
    },

    /**
     * Releases the resources created for select single
     *
     * @param {boolean} shouldRetainMainFieldElem A flag to indicate if the main field
     *                                            element should be reatined
     *
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _ReleaseSelectResources: function (shouldRetainMainFieldElem) {
      this._super(shouldRetainMainFieldElem);
    },

    /**
     * Handles selection for select-single. If the data is not present, it is fetched and
     * then the selection is made
     *
     * @param {Object} valueItem
     * @param {CustomEvent} event
     *
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _fetchDataAndSelect: function (valueItem, event, skipShowingFilterField) {
      // Check if the data has to be fetched
      if (valueItem.data != null) {
        // Make selection if data exists
        this._handleSelection(valueItem, event, skipShowingFilterField);
      } else {
        // Fetch the data using the key
        var keys = [valueItem.key];
        var failedFetch = function () {
          this._handleSelection(this._defaultValueItemForPlaceholder, null, skipShowingFilterField);
        }.bind(this);
        var afterFetch = function (fetchResults) {
          // Check if the data is available for the provided key
          if (fetchResults.data.length > 0) {
            var _valueItem = {};
            _valueItem.key = valueItem.key;
            _valueItem.data = fetchResults.data[0];
            _valueItem.metadata = fetchResults.metadata[0];

            this._handleSelection(_valueItem, event, skipShowingFilterField);
          } else {
            failedFetch();
          }
        }.bind(this);

        this._FetchByKeysFromDataProvider(keys).then(afterFetch, failedFetch);
      }
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _HandleClearValueIconClick: function () {
      // TODO: After selecting a new value, then clearing it, and then opening the dropdown again,
      // I can't select the same value.  It gets highlighted, but doesn't close the dropdown and
      // doesn't get set as the component value.  It looks like we're not getting a
      // firstSelectedItemChanged event from listView in that case.  I think the firstSelectedItem
      // is still for the last selected value, even though we've cleared it and set the listView
      // selected attribute to an empty KeySetImpl.
      // (Filed JET-33592 - FIRST-SELECTED-ITEM-CHANGED NOT FIRED AFTER CLEARING AND SELECTING
      // SAME ITEM against listView.)
      // (This may not be a bug after listView implements JET-32345 - COLLECTION ENHANCEMENTS FOR
      // LOV USECASE.)
      this._handleSelection(this._GetDefaultValueItemForPlaceholder());
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _handleSelection: function (valueItem, event, skipShowingFilterField) {
      // JET-42413: set flag while we're processing a value change so that if an app makes
      // changes to the component from within the change listener, we can defer processing the
      // new change until after we're done processing the current change
      var resolveValueChangeFunc = this._StartMakingInternalValueChange();

      var context;

      // if (!this._fullScreenPopup) {
      //   this._showMainField();
      // }

      // When there is validation error, the value option may retain the previous value
      // although the display value is different. In that case, user should be able to still
      // select the previous valid value to get rid off the invalid style and message.
      /* if (!(old === LovUtils.getOptionValue(data)))*/
      var newValueItem = this._IsValueItemForPlaceholder(valueItem)
        ? this._defaultValueItemForPlaceholder
        : valueItem;

      var configureInputFieldsFunc = function () {
        // JET-46874 - Select single busy state not cleared properly causing spectra test to fail
        // don't try to do anything other than resolve the busy state if the component has been
        // removed from the DOM
        if (!this._bReleasedResources) {
          if (!event || event.type !== 'blur') {
            // this._lovMainField.focusCursorEndInputElem();
            var inputElem = this._lovMainField.getInputElem();
            if (!this._fullScreenPopup) {
              if (this._IsValueItemForPlaceholder(newValueItem)) {
                inputElem.value = '';
              }
              this._SetFilterFieldText(inputElem.value);
              // JET-44746 - focus pulled back again after pressing Tab with DelayingDataProvider
              // only show the filter field if the component should still have focus
              if (!skipShowingFilterField) {
                // show the filter field after selecting an item on desktop because we want the focus
                // to go back to the main part of the component, and the user can tab out or reopen
                // the dropdown or filter again
                this._ShowFilterField();
              }
            } else {
              // focus the input element after selecting an item on mobile because we want the focus
              // to go back to the main part of the component, and the user can tab out or reopen the
              // dropdown
              inputElem.focus();
            }
          }

          this._CloseDropdown();
        }

        resolveValueChangeFunc();
      }.bind(this);

      var afterHandleFunc = function () {
        // JET-46567 - JAWS is reading out error message even after selecting correct value
        // wait until after the inline messages DOM has been updated before finishing processing
        // so that when we change focus to the input element the screen reader will read out the
        // new messages/invalid state instead of old state
        if (this._messagingStrategyQueueActionPromise) {
          this._messagingStrategyQueueActionPromise.then(
            configureInputFieldsFunc,
            configureInputFieldsFunc
          );
        } else {
          configureInputFieldsFunc();
        }
      }.bind(this);

      this._handleUserSelectedValueItem(newValueItem, event, context).then(
        afterHandleFunc,
        afterHandleFunc
      );
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _handleUserSelectedValueItem: function (valueItem, event, context) {
      var previousValue = this.options.value;
      var abstractLovBase = this._abstractLovBase;
      //  - selected value got replaced once the label for initial value is available
      if (this._cachedFetchByKeys) {
        this._valueHasChanged = true;
        // remove loading indicator
        this._setUiLoadingState('stop');
      }

      this._resolveValueItemLater = true;

      var value = null;
      if (!this._IsValueItemForPlaceholder(valueItem)) {
        value = valueItem.key;
      }

      // need to set value on AbstractLovBase first because it needs to be up-to-date within
      // call to _SetValue in order to update display label
      abstractLovBase.setValue(value);

      // temporarily store valueItem so that we can set it from within _SetValue call instead of
      // having to call fetchByKeys on the data provider
      this._userSelectedValueItem = valueItem;
      //  - select needs implementation fixes...
      var ret = this._SetValue(value, event, { doValueChangeCheck: false, _context: context });
      var afterSetValue = function (valueSet) {
        // After the _SetValue call is completed, clear the
        // user selected value item
        this._userSelectedValueItem = null;

        // JET-36443 - fire an ojValueAction event whenever the user selects a value, even if the
        // value is the same as the previous value
        if (valueSet) {
          this._fireValueActionEvent(valueItem, previousValue);
        }

        // Resolve the fetchDataAndSelect promise if it exists
        // This is used by the WebElement APIs
        if (this._resolveFetchDataAndSelectPromise) {
          this._resolveFetchDataAndSelectPromise();
          this._resolveFetchDataAndSelectPromise = null;
        }
      }.bind(this);

      if (ret instanceof Promise) {
        return ret.then(afterSetValue, function () {
          afterSetValue(false);
        });
      }

      var afterFunc = function () {
        afterSetValue(ret);
      };
      return Promise.resolve().then(afterFunc, afterFunc);
    },

    /**
     * Updates display value of Select.
     * @override
     * @protected
     * @memberof! oj.ojSelectSingle
     */
    _SetDisplayValue: function (displayValue) {
      // JET-37550 - REGRESSION : OJ-SELECT-SINGLE NOT DISPLAYING DEFAULT VALUE
      // if setting both data and value at the same time, defer setting the value until after the
      // data has been set
      if (this._deferSettingValue) {
        return;
      }

      // JET-34351 - OJ-SELECT-SINGLE DOES NOT SHOW VALUE IF OPTIONS ARE UPDATED ASYNC
      // while calling superclass refresh, defer handling any _SetDisplayValue calls until after
      // we've setup again
      if (this._bSuperRefreshing) {
        this._deferredSetDisplayValue = function () {
          this._deferredSetDisplayValue = null;
          this._SetDisplayValue(displayValue);
        }.bind(this);
        return;
      }

      //  - need to be able to specify the initial value of select components bound to dprv
      if (!this._applyValueItem(this.options.valueItem)) {
        this._initSelectedValue();
      }
      this._resolveValueItemLater = false;
    },

    /**
     * @override
     * @protected
     * @memberof! oj.ojSelectSingle
     */
    _ValidateHelper: function () {
      // JET-40458 - ISSUES WITH OJ-SELECT-SINGLE INSIDE A EDITABLE TABLE
      // maintain flag so we know we're validating from within _SetValue
      this._isInValidate = true;

      var displayValueForSetValue = $(this._lovMainField.getInputElem()).val();

      // returns Promise that resolves to true|false or boolean
      var returnValue = this._SetValue(displayValueForSetValue, null, this._VALIDATE_METHOD_OPTIONS);

      if (!(returnValue instanceof Promise)) {
        returnValue = Promise.resolve(returnValue ? 'valid' : 'invalid');
      } else {
        returnValue = returnValue.then(function (booleanSetValueReturn) {
          return Promise.resolve(booleanSetValueReturn ? 'valid' : 'invalid');
        });
      }

      this._isInValidate = false;

      return returnValue;
    },

    /**
     * @override
     * @protected
     * @memberof! oj.ojSelectSingle
     */
    _SetValue: function (newValue, event, options) {
      var displayValue = this._GetDisplayValue();
      if (newValue === displayValue) {
        if (this._isInValidate && newValue === '' && !this.isValid()) {
          // JET-40458 - ISSUES WITH OJ-SELECT-SINGLE INSIDE A EDITABLE TABLE
          // if we're validating a cleared field and we're already in an invalid state, then we need
          // to attempt to set a null value instead of whatever the existing value is, because the
          // existing value may be valid
          // eslint-disable-next-line no-param-reassign
          newValue = null;
        } else {
          // we don't want to set the displayValue as the value, so if the newValue being set matches
          // the displayValue, use the currently set value instead
          // eslint-disable-next-line no-param-reassign
          newValue = this.options.value;
        }

        // JET-35455 - OJ-SELECT-SINGLE NOT SHOWING VISUAL ERROR STATE AFTER ITS VALIDATE() METHOD
        // RETURNS INVALID DETERMINATION
        // EditableValue always returns 'invalid' when validating a value of undefined, but the
        // error message doesn't get shown for a required LOV with no initial value, so make sure
        // we set null instead of undefined.
        if (newValue === undefined) {
          // eslint-disable-next-line no-param-reassign
          newValue = null;
        }
      }

      // JET-42413: set flag while we're processing a value change so that if an app makes
      // changes to the component from within the change listener, we can defer processing the
      // new change until after we're done processing the current change
      var resolveValueChangeFunc = this._StartMakingInternalValueChange();

      var ret = this._super(newValue, event, options);

      resolveValueChangeFunc();

      return ret;
    },

    /**
     * Returns the default styleclass for the component.
     *
     * @return {string}
     * @expose
     * @memberof! oj.ojSelectSingle
     * @override
     * @protected
     */
    _GetDefaultStyleClass: function () {
      return 'oj-searchselect';
    },

    /**
     * Returns the name of the component to be used in a style class.
     *
     * @return {string}
     * @memberof! oj.ojSelectSingle
     * @override
     * @protected
     */
    _GetStyleClassComponentName: function () {
      return 'selectsingle';
    },

    /**
     * merge value and valueItem, value wins if both are specified
     * return true if the value is specified and it's not contained in valueItem
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _mergeValueAndValueItem: function (value, valueItem) {
      var resolveLater = false;

      // value specified
      if (!this._IsValueForPlaceholder(value)) {
        // both value and valueItem specified, find the option for the value
        if (valueItem) {
          // may need to find out the label and setValueItem later
          resolveLater = !oj.Object.compareValues(value, valueItem.key);
        }
      } else if (valueItem && !this._deferSettingValue) {
        // JET-38612 - Select Single | Value, disable bug
        // if the value is not specified, and we have a value item, and we are not deferring setting
        // a new value, then sync the value with the value item
        // JET-43200 - initializing select-single with both value-item and messages-custom does
        // not render the messages
        // don't clear custom-messages when set initially with value-item
        this._SyncValueWithValueItem(valueItem, value, { doNotClearMessages: true });
      }

      return resolveLater;
    },

    /**
     * single selection: keep value in sync with valueItem
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _SyncValueWithValueItem: function (valueItem, value, context) {
      var abstractLovBase = this._abstractLovBase;

      var newVal;
      //  - resetting value when value-item and placeholder are set throws exception
      if (this._IsValueItemForPlaceholder(valueItem)) {
        if (this._IsValueForPlaceholder(value)) {
          newVal = value;
        } else {
          newVal = this._defaultValueForPlaceholder;
        }
      } else {
        newVal = valueItem ? valueItem.key : null;
      }

      if (!oj.Object.compareValues(newVal, value)) {
        // JET-42413: set flag while we're processing a value change so that if an app makes
        // changes to the component from within the change listener, we can defer processing the
        // new change until after we're done processing the current change
        var resolveValueChangeFunc = this._StartMakingInternalValueChange();

        var flagsContext = { internalSet: true, writeback: true };
        // JET-43200 - initializing select-single with both value-item and messages-custom does
        // not render the messages
        // don't clear custom-messages when set initially with value-item
        if (context) {
          Object.assign(flagsContext, context);
        }
        var flags = {
          doValueChangeCheck: false,
          _context: flagsContext
        };
        this.option('value', newVal, flags);

        abstractLovBase.setValue(newVal);
        // When internalSet is true _setOption->_AfterSetOptionValue->_Refresh isn't called.
        // We still need the displayValue to be refreshed, so call this._AfterSetOptionValue
        // explicitly.
        this._AfterSetOptionValue('value', flags);

        resolveValueChangeFunc();
      }
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _initSelectedValue: function (valueItem) {
      //  - need to be able to specify the initial value of select components bound to dprv
      // Even when _deferSettingValue is true, we're not short-circuiting in this method if either:
      // - we have a complete value-item, or
      // - the value represents the placeholder
      // because in those cases we can process setting the value without having to fetch from the
      // data provider.
      if (!this._applyValueItem(valueItem)) {
        var value = !this._IsValueItemForPlaceholder(valueItem) ? valueItem.key : this.options.value;
        // JET-37550 - REGRESSION : OJ-SELECT-SINGLE NOT DISPLAYING DEFAULT VALUE
        // if setting both data and value at the same time, defer setting a non-placeholder value
        // until after the data has been set
        var isPlaceholderValue = this._IsValueForPlaceholder(value);
        if (isPlaceholderValue || !this._deferSettingValue) {
          this._initSelectionHelper(value, this._updateSelectedOption.bind(this), valueItem);
        }
      }
    },

    /**
     *  - need to be able to specify the initial value of select components bound to dprv
     * If both dataProvider and valueItem[s] are specified, use valueItem[s] for display values.
     * If valueItem[s] is not specified or a selected value is missing then we will fetch the real
     * data from the dataProvider like before.
     * return true if valueItem[s] is applied, false otherwise
     *
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _applyValueItem: function (valueItem) {
      //  - resetting value when value-item and placeholder are set throws exception
      //  - placeholder is not displayed after removing selections from select many
      if (!this._resolveValueItemLater && !this._IsValueItemForPlaceholder(valueItem)) {
        this._updateInputElemValue(valueItem);
        return true;
      }
      return false;
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _updateSelectedOption: function (valueItem) {
      this._updateInputElemValue(valueItem);
      //  - need to be able to specify the initial value of select components bound
      // to dprv
      this._SetValueItem(valueItem);
    },

    //  - need to be able to specify the initial value of select components bound to dprv
    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _SetValueItem: function (valueItem) {
      this._valueItemSetInternally = true;
      var newValueItem = valueItem;
      //  - resetting value when value-item and placeholder are set throws exception
      if (valueItem && !this._IsValueItemForPlaceholder(valueItem)) {
        newValueItem = ojselectbase.LovUtils.createValueItem(valueItem.key, valueItem.data, valueItem.metadata);
      }
      var context = { internalSet: true, changed: true, writeback: true };

      // JET-42413: set flag while we're processing a value change so that if an app makes
      // changes to the component from within the change listener, we can defer processing the
      // new change until after we're done processing the current change
      var resolveValueChangeFunc = this._StartMakingInternalValueChange();

      this.option(this._GetValueItemPropertyName(), newValueItem, { _context: context });

      resolveValueChangeFunc();
    },

    /**
     * update display label(s) and valueItem(s) after value was set
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _UpdateValueItem: function (value) {
      // TODO: does value need to be normalized?
      // var value = LovUtils.normalizeValue(_value);
      this._initSelectionHelper(
        value,
        function (valueItem) {
          this._SetValueItem(valueItem);
          this._updateSelectedOption(valueItem);
        }.bind(this)
      );
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _updateInputElemValue: function (valueItem) {
      var $inputElem = $(this._lovMainField.getInputElem());
      var text = null;
      if (valueItem && valueItem.data) {
        var formatted = this._ItemTextRenderer(valueItem);
        var inputElemText = $inputElem.val();
        if (formatted !== undefined && inputElemText !== formatted) {
          text = formatted;
        }
      } else {
        // data will be null only when user set it programmatically.
        text = '';
      }
      if (text !== null) {
        $inputElem.val(text);
        // keep readonly div's content in sync
        if (this.options.readOnly) {
          let readonlyElem = this._getReadonlyDiv();
          if (readonlyElem) {
            readonlyElem.textContent = text;
          }
        }
        // JET-37621 - DYNAMIC FORM - SELECT SINGLE COMPONENT DOESN'T REFLECT THE VALUE UNTIL USER
        // CLICKS OUTSIDE THE FORM
        // if the filter field is visible, update its text, too...
        // JET-40375 - SELECT SINGLE - DEFAULTED VALUE OVERRIDES USER INPUT
        // ...unless the user has already typed some filter text
        if (
          ((!this._fullScreenPopup && this._filterInputText.style.visibility !== 'hidden') ||
            (this._fullScreenPopup && this._abstractLovBase.isDropdownOpen())) &&
          !this._userHasTypedFilterText
        ) {
          this._SetFilterFieldText(text);
        }
      }
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _UpdateItemText: function () {
      this._super();

      // JET-45922 - timing issue with select-single: lov drop-down doesn't have element
      // do a granular update if item-text changes instead of a general refresh
      var currValueItem = this.options.valueItem;
      this._updateInputElemValue(currValueItem);
    },

    // install default initSelection when applied to hidden input
    // and getting data from remote
    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _initSelectionHelper: function (value, initSelectionCallback, valueItem) {
      // ojselect set initial selected value
      if (this._IsValueForPlaceholder(value)) {
        // JET-45563 - Value item change listener is triggering on load while setting up initially
        // if the value-item is initialized with an object equivalent to the default placeholder
        // value-item, then use the given object so that no valueItemChanged event is fired
        var placeholderValueItem =
          valueItem && oj.Object.compareValues(valueItem, this._defaultValueItemForPlaceholder)
            ? valueItem
            : this._defaultValueItemForPlaceholder;
        initSelectionCallback(placeholderValueItem);
      } else if (this._abstractLovBase.hasData()) {
        // if user has selected a new value in the UI, use the saved valueItem instead of calling
        // fetchByKeys on the data provider
        if (this._userSelectedValueItem) {
          var userSelectedValueItem = this._userSelectedValueItem;
          this._initSelectionFetchByKey(
            {
              data: [userSelectedValueItem.data],
              metadata: [userSelectedValueItem.metadata]
            },
            value,
            initSelectionCallback
          );
        } else if (this.options.data) {
          // JET-34351 - OJ-SELECT-SINGLE DOES NOT SHOW VALUE IF OPTIONS ARE UPDATED ASYNC
          // if we were showing the loading indicator while waiting for data to be set, stop
          // showing it now
          if (this._loadingAwaitingData) {
            this._loadingAwaitingData = false;
            this._setUiLoadingState('stop');
          }
          // JET-34351 - OJ-SELECT-SINGLE DOES NOT SHOW VALUE IF OPTIONS ARE UPDATED ASYNC
          // only init selected value if options.data not null, otherwise the valueItem may
          // get set containing only the key, which means no label will be shown in the field
          this._FetchByKeysFromDataProvider([value]).then(
            function (fetchResults) {
              // JET-34713 Error updating array dataprovider of ojSelectSingle while its hidden
              // Abort if select single has been disconnected
              if (!this._bReleasedResources) {
                this._initSelectionFetchByKey(fetchResults, value, initSelectionCallback);
              }
            }.bind(this),
            function () {
              if (!this._bReleasedResources) {
                this._initSelectionFetchByKey(null, value, initSelectionCallback);
              }
            }.bind(this)
          );
        } else if (!this._loadingAwaitingData) {
          // JET-34351 - OJ-SELECT-SINGLE DOES NOT SHOW VALUE IF OPTIONS ARE UPDATED ASYNC
          // if we can't fetch right now because we're waiting for data to be set, show the
          // loading indicator
          this._loadingAwaitingData = true;
          this._setUiLoadingState('start');
        }
      }
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _initSelectionFetchByKey: function (fetchResults, value, initSelectionCallback) {
      //  - While fetching the label for the initial value,
      // user can still interact the component and pick a new value.
      if (oj.Object.compareValues(value, this.options.value) && !this._valueHasChanged) {
        var data = null;
        var metadata = null;
        if (fetchResults && fetchResults.data && fetchResults.data.length > 0) {
          data = fetchResults.data[0];
          metadata = fetchResults.metadata[0];
        } else {
          Logger.warn('SelectSingle: could not fetch data for selected value: ' + value);
        }
        initSelectionCallback(ojselectbase.LovUtils.createValueItem(value, data, metadata));
        this._valueHasChanged = undefined;
      }
    },

    /**
     * Fire an ojValueAction event.
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _fireValueActionEvent: function (valueItem, previousValue) {
      var detail = {
        value: valueItem.key,
        itemContext: valueItem,
        previousValue: previousValue
      };

      var valueActionEvent = new CustomEvent('ojValueAction', { detail: detail });

      var element = this.OuterWrapper;

      // JET-42413: set flag while we're processing a value change so that if an app makes
      // changes to the component from within the change listener, we can defer processing the
      // new change until after we're done processing the current change
      var resolveValueChangeFunc = this._StartMakingInternalValueChange();

      element.dispatchEvent(valueActionEvent);

      resolveValueChangeFunc();
    },

    // Private methods used by WebElement
    /**
     * This method imitates an option selection from the dropdown by using a key of an item
     * from the options. This is used by the WebElement implementation of ojSelectSingle
     *
     * @param {V} value The value that has to be selected
     * @param {Event} event
     *
     * @return {Promise} A Promise that resolve once the operation is completed
     *
     * @memberof! oj.ojSelectSingle
     * @instance
     * @private
     */
    _selectItemByValue: function (value, event) {
      const fetchDataAndSelectPromise = new Promise(
        function (resolve) {
          this._resolveFetchDataAndSelectPromise = resolve;
        }.bind(this)
      );

      if (value != null) {
        const valueItem = { key: value };
        this._fetchDataAndSelect(valueItem, event);
      } else {
        this._handleSelection(this._defaultValueItemForPlaceholder);
      }

      return fetchDataAndSelectPromise;
    },

    /**
     * Handle data provider events
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _HandleDataProviderEvent: function (event) {
      if (event.filterCriterionChanged) {
        return;
      }

      var newVal = this.options.value;
      if (event.type === 'mutate') {
        if (event.detail.remove != null) {
          var keys = event.detail.remove.keys;

          keys.forEach(
            function (key) {
              if (oj.Object.compareValues(key, newVal)) {
                newVal = this._defaultValueForPlaceholder;
                Logger.warn('Select: selected value removed from data provider');
              }
            }.bind(this)
          );
        }
      }

      // JET-42413: set flag while we're processing a value change so that if an app makes
      // changes to the component from within the change listener, we can defer processing the
      // new change until after we're done processing the current change
      var resolveValueChangeFunc = this._StartMakingInternalValueChange();

      // if the event wasn't dispatched internally, need to re-set the value now that the label may
      // be available, or because a mutation event removed a selected value
      this._setOption('value', newVal);

      resolveValueChangeFunc();

      this._abstractLovBase.handleDataProviderEvent(event);
    },

    /**
     * Handle Enter key down on the container.
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _HandleContainerKeyDownEnter: function (event) {
      // JET-40375 - SELECT SINGLE - DEFAULTED VALUE OVERRIDES USER INPUT
      // clear flag that the user has typed filter text so that we can override it when setting
      // the selected label
      this._userHasTypedFilterText = false;

      // on desktop, if the user clears all the text and presses Enter, clear the LOV value
      if (!this._fullScreenPopup && this._IsFilterInputTextCleared()) {
        this._handleSelection(this._defaultValueItemForPlaceholder);
      } else if (!this._fullScreenPopup && this._abstractLovBase.isDropdownOpen()) {
        // on the desktop if there is text in the input field and there is a selected item in the
        // dropdown and the user presses Enter, set that as the value

        // don't call lovDropdown.getValueItemForSelection() to get the currentSelectedItem until
        // after the dropdown has been initialized
        var currentSelectedItem = this._lovDropdown.getValueItemForSelection();
        if (currentSelectedItem != null) {
          this._fetchDataAndSelect(currentSelectedItem, event);
        }
      }
    },

    /**
     * Handle Tab key down on the container.
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _HandleContainerKeyDownTab: function (event) {
      // JET-40375 - SELECT SINGLE - DEFAULTED VALUE OVERRIDES USER INPUT
      // clear flag that the user has typed filter text so that we can override it when setting
      // the selected label
      this._userHasTypedFilterText = false;

      if (!this._fullScreenPopup) {
        if (event.shiftKey) {
          var filterInputText = this._filterInputText;
          var parentElem = filterInputText.parentNode;

          // As discussed in JET-49016, the appendChild calls below end up being
          // short-circuited by our Preact slot management workarounds.  As a
          // result, the appendChild calls are treated as no-ops and we end up in an
          // infinite while loop.  To avoid this fate, we temporarily disable the slot
          // management workarounds.
          ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(true);

          try {
            // move all the siblings before the filterInputText to the end, so that focus won't go
            // to the main input field and will instead go to the previous tabbable elem on the page
            // (can't just move the filterInputText because it's involved in the focus change and
            // the browser throws an error)
            while (parentElem.firstChild !== filterInputText) {
              parentElem.appendChild(parentElem.firstChild);
            }
          } finally {
            ojcustomelementUtils.CustomElementUtils.allowSlotRelocation(false);
          }
        }
        // JET-44700 - <OJ-SELECT-SINGLE> AND <OJ-INPUT-NUMBER/DATE/TEXT> ARE NOT BEHAVING
        // UNIFORMLY FOR REQUIRED FIELDS
        // check whether placeholder valueItem is already set so that we don't trigger
        // validation unnecessarily
        if (this._IsFilterInputTextCleared()) {
          if (
            !this._IsValueForPlaceholder(this.options.value) ||
            !this._IsValueItemForPlaceholder(this.options.valueItem)
          ) {
            // on desktop, if the user clears all the text and Tabs out, clear the LOV value
            this._handleSelection(this._defaultValueItemForPlaceholder, null, true);
          }
        } else if (this._abstractLovBase.isDropdownOpen()) {
          // don't call lovDropdown.getValueItemForSelection() to get the currentSelectedItem until
          // after the dropdown has been initialized
          var currentSelectedItem = this._lovDropdown.getValueItemForSelection();
          if (currentSelectedItem != null) {
            // on the desktop if there is text in the input field and there is a selected item in the
            // dropdown and the user presses Tab, set that as the value
            this._fetchDataAndSelect(currentSelectedItem, event, true);
          }
        }
      }
      this._CloseDropdown();
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _HandleLovDropdownEventTabOut: function (event) {
      // JET-40375 - SELECT SINGLE - DEFAULTED VALUE OVERRIDES USER INPUT
      // clear flag that the user has typed filter text so that we can override it when setting
      // the selected label
      this._userHasTypedFilterText = false;

      // If no control item focused and going forward, then put focus on the
      // input so that it can naturally go to the next focusable item, but don't
      // kill the event so that it can go to the next field.
      // lovMainField.getInputElem().focus();
      this._filterInputText.focus();
      // on the desktop if there is a selected item in the dropdown
      // and the user presses Tab, set that as the value
      if (!this._fullScreenPopup) {
        let currentSelectedItem = this._lovDropdown.getValueItemForSelection();
        if (currentSelectedItem != null) {
          this._fetchDataAndSelect(currentSelectedItem, event, true);
        }
      }
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _HandleLovDropdownEventSelection: function (event) {
      var detail = event.detail;
      // JET-40375 - SELECT SINGLE - DEFAULTED VALUE OVERRIDES USER INPUT
      // clear flag that the user has typed filter text so that we can override it when setting
      // the selected label
      this._userHasTypedFilterText = false;

      this._handleSelection(detail.valueItem, detail.event);
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _GetDefaultValueItemForPlaceholder: function () {
      return this._defaultValueItemForPlaceholder;
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _IsValueItemForPlaceholder: function (valueItem) {
      return valueItem == null || this._IsValueForPlaceholder(valueItem.key);
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _IsValueForPlaceholder: function (value) {
      return value === null || value === undefined;
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _IsShowValueInFilterField: function () {
      return true;
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _SetupInitialValue: function () {
      var options = this.options;
      if (this._abstractLovBase.hasData()) {
        this._initSelectedValue(options.valueItem);
      }

      //  - need to be able to specify the initial value of select components bound to
      // dprv
      this._resolveValueItemLater = this._mergeValueAndValueItem(options.value, options.valueItem);
    },

    /**
     * @memberof oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _GetValueItemPropertyName: function () {
      return 'valueItem';
    },

    /**
     * @memberof! oj.ojSelectSingle
     * @instance
     * @protected
     * @override
     */
    _CreateLovDropdown: function () {
      return new LovDropdownSingle();
    }

    // TODO: Jeanne. Need a _ValidateReturnPromise function as well. And I need a test, because
    // right now we should have a test that fails, but ojselect tests all pass, and so do
    // ojformcontrols. so we must not have a test.

    /**
     * <p>The <code class="prettyprint">collectionTemplate</code> slot is used to specify the template
     * for rendering the items in the dropdown. The slot must be a &lt;template> element containing
     * a child collection element (e.g. <code class="prettyprint">&lt;oj-table></code>) supporting single selection.
     * The <code class="prettyprint">data</code>, <code class="prettyprint">selected</code>, and
     * <code class="prettyprint">selectedItem</code> properties should be set on the appropriate collection component
     * attributes, e.g. <code class="prettyprint">data</code>, <code class="prettyprint">selected</code>, and
     * <code class="prettyprint">first-selected-item</code> for <code class="prettyprint">oj-list-view</code> and
     * <code class="prettyprint">data</code>, <code class="prettyprint">selected.row</code>, and
     * <code class="prettyprint">first-selected-row</code> for <code class="prettyprint">oj-table</code>.
     * Note as well that the <code class="prettyprint">selectedItem</code> must be bound using a writeback expression
     * (i.e. <code class="prettyprint">{{$current.selectedItem}}</code>) so that it can be updated when the user
     * selects a new value.
     * The <code class="prettyprint">oj-select-results</code> class must also be applied to the collection
     * element in the template.
     * <p>When the template is executed, it will have access to the binding context
     * containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the collection. (See the table
     * below for a list of properties available on $current)</li>
     *  <li>alias - if the data-oj-as attribute was specified on the template, the value will be used
     * to provide an application-named alias for $current.</li>
     * </ul>
     * <p>If no <code class="prettyprint">collectionTemplate</code> is specified, the component will
     * check whether an <code class="prettyprint">itemTemplate</code> is specified.  Otherwise,
     * the component will render based on the value of the <code class="prettyprint">itemText</code>
     * property.</p>
     *
     * @ojslot collectionTemplate
     * @ojmaxitems 1
     * @ojshortdesc Slot for a collection element to render the items in the dropdown instead of the
     * default list.
     * @memberof oj.ojSelectSingle
     * @ojtemplateslotprops oj.ojSelectSingle.CollectionTemplateContext
     * @ojpreferredcontent ["ListViewElement", "TableElement"]
     *
     * @example <caption>Initialize the Select with an inline collectionTemplate specified:</caption>
     * &lt;oj-select-single>
     *   &lt;template slot='collectionTemplate'>
     *     &lt;oj-table>...&lt;/oj-table>
     *   &lt;template>
     * &lt;/oj-select-single>
     */
    /**
     * @typedef {Object} oj.ojSelectSingle.CollectionTemplateContext
     * @property {Object} data The data for the collection.
     * @property {string} searchText Search text.
     * @property {Object} selectedItem The selected item context.
     * @property {Object} selected
     *           <p>The <code class="prettyprint">selected</code> property is used to push the current
     *           selected option to the collection. This is also used to highlight the option when
     *           navigating through the dropdown.</p>
     *           <p>This should be bound to the <code class="prettyprint">selected</code> attribute of
     *           <code class="prettyprint">oj-list-view</code> if it is used for the collectionTemplate.</p>
     *           <p>When using <code class="prettyprint">oj-table</code> as the collectionTemplate this should
     *           be bound to the <code class="prettyprint">selected.row</code> attribute of the
     *           <code class="prettyprint">oj-table</code> instead.</p>
     * @property {Object} currentRow
     *           <p>The <code class="prettyprint">currentRow</code> property is used to set the focus to
     *           current active row in the <code class="prettyprint">oj-table</code>. This is also used to
     *           get the key for the current row when navigating through the options in the dropdown. Since,
     *           this property is used to listen to the changes made by the <code class="prettyprint">oj-table</code>,
     *           it should be bound to the <code class="prettyprint">current-row</code> attribute of the
     *           <code class="prettyprint">oj-table</code></p> using a <b>writable</b> expression.
     *           <p>Example:</p>
     *           <pre>
     *            <code>
     *              &lt;oj-table
     *                ...
     *                current-row="{{$current.currentRow}}"
     *                ...&gt;
     *            </code>
     *           </pre>
     * @property {any} currentRow.rowKey
     *           <p>When using <code class="prettyprint">oj-list-view</code>, this sub-property of the
     *           <code class="prettyprint">currentRow</code> property should be used instead. This should
     *           be bound to the <code class="prettyprint">current-item</code> attribute of the
     *           <code class="prettyprint">oj-list-view</code></p> using a <b>writable</b> expression.
     *           <p>Example:</p>
     *           <pre>
     *            <code>
     *              &lt;oj-list-view
     *                ...
     *                current-item="{{$current.currentRow.rowKey}}"
     *                ...&gt;
     *            </code>
     *           </pre>
     * @property {Function} handleRowAction
     *           <p>The <code class="prettyprint">handleRowAction</code> property is used to make selection
     *           for <code class="prettyprint">oj-select-single</code> when <code class="prettyprint">ojItemAction</code>
     *           is triggered in the <code class="prettyprint">oj-list-view</code> (<code class="prettyprint">ojRowAction</code>
     *           if <code class="prettyprint">oj-table</code> is used).
     *           <p>This should be bound to the <code class="prettyprint">on-oj-item-action</code> attribute of
     *           <code class="prettyprint">oj-list-view</code> if it is used for the collectionTemplate.</p>
     *           <p>When using <code class="prettyprint">oj-table</code> as the collectionTemplate this should
     *           be bound to the <code class="prettyprint">on-oj-row-action</code> attribute of the
     *           <code class="prettyprint">oj-table</code> instead.</p>
     * @ojsignature [{target: "Type", value: "DataProvider<V, D>", for: "data",
     *                jsdocOverride:true},
     *               {target:"Type", value:"KeySet<V>", for: "selected", jsdocOverride:true},
     *               {target:"Type", value:"CommonTypes.ItemContext<V, D>", for: "selectedItem",
     *                jsdocOverride:true},
     *               {target:"Type", value:"V", for: "currentRow.rowKey", jsdocOverride: true},
     *               {target:"Type", value:"((event: Event, context: CommonTypes.ItemContext<V, D>) => void)",
     *                for: "handleRowAction", jsdocOverride: true},
     *               {target: "Type", value: "<V, D>", for: "genericTypeParameters"}]
     * @ojdeprecated {target: "property", for: "selectedItem", since: "9.0.0",
     *                description: "The selectedItem property is deprecated in favor of currentRow and handleRowAction properties, which provide additional functionalities."}
     */

    /**
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template
     * for rendering each item in the dropdown list when an external
     * <code class="prettyprint">collectionTemplate</code> is not provided.
     * The slot must be a &lt;template> element.
     * <p>When the template is executed for each item, it will have access to the binding context
     * containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See the table
     * below for a list of properties available on $current)</li>
     *  <li>alias - if the data-oj-as attribute was specified on the template, the value will be used
     * to provide an application-named alias for $current.</li>
     * </ul>
     * <p>If no <code class="prettyprint">itemTemplate</code> or
     * <code class="prettyprint">collectionTemplate</code> is specified, the component will render based
     * on the value of the <code class="prettyprint">itemText</code> property.</p>
     * <p>Note that the properties <code class="prettyprint">depth, leaf,
     * parentKey</code>, are only available when the supplied dataProvider is a
     * {@link TreeDataProvider}.
     *
     *
     * @ojslot itemTemplate
     * @ojmaxitems 1
     * @memberof oj.ojSelectSingle
     * @ojtemplateslotprops oj.ojSelectSingle.ItemTemplateContext
     *
     * @example <caption>Initialize the Select with an inline itemTemplate specified:</caption>
     * &lt;oj-select-single>
     *   &lt;template slot='itemTemplate'>
     *     &lt;div>&lt;oj-bind-text value='[[$current.data.name]]'>&lt;/oj-bind-text>&lt;/div>
     *   &lt;template>
     * &lt;/oj-select-single>
     */

    /**
     * @typedef {Object}oj.ojSelectSingle.ItemTemplateContext
     * @property {Element} componentElement The Select custom element
     * @property {Object} data The data for the current item being rendered
     * @property {number} index The zero-based index of the current item
     * @property {any} key The key of the current item being rendered
     * @property {Object} metadata The metadata for the current item being rendered
     * @property {string} searchText The search text entered by the user
     * @property {number} depth (TreeDataProvider only) The depth of the current
     * item (available when hierarchical data is provided) being rendered. The depth
     * of the first level children under the invisible root is 1.
     * @property {boolean} leaf (TreeDataProvider only) True if the current item
     * is a leaf node (available when hierarchical data is provided).
     * @property {any} parentKey (TreeDataProvider only) The key of the parent
     * item (available when hierarchical data is provided). The parent key is null
     * for root nodes.
     * @ojsignature [{target: "Type", value: "D", for: "data",
     *                jsdocOverride:true},
     *               {target:"Type", value:"V", for: "key", jsdocOverride:true},
     *               {target:"Type", value:"oj.ItemMetadata<V>", for: "metadata", jsdocOverride:true},
     *               {target:"Type", value:"V", for: "parentKey", jsdocOverride:true},
     *               {target: "Type", value: "<V, D>", for: "genericTypeParameters"}]
     */

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
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojSelectSingle
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
     *      <td>Select</td>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>Set focus to the Select. If hints, title or messages exist in a notewindow,
     *        pop up the notewindow.</td>
     *     </tr>
     *   </tbody>
     *  </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojSelectSingle
     */
    /**
     * <h3 id="migration-section">
     *   Migration
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
     * </h3>
     *
     * <p>
     * To migrate from oj-select-single to oj-c-select-single, you need to revise the import statement
     * and references to oj-c-select-single in your app. Please note the changes between the two
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
     *
     * <h5>Translations</h5>
     * <p>
     * The instance level translations are not supported anymore for the following translation properties. These need to be configured
     * in the translation bundle.
     * <ul>
     *  <li>cancel</li>
     *  <li>label-acc-clear-value</li>
     *  <li>multiple-matches-found</li>
     *  <li>n-or-more-matches-found</li>
     *  <li>no-matches-found</li>
     *  <li>one-match-found</li>
     * </ul>
     *
     * The 'required' translation property can still be configured at the instance level, but this API is simplied to take a single
     * string instead of an object. To show a different required message detail, the application can now set the `required-message-detail`
     * attribute to the desired translated string.
     *
     * <h5>ValueItem</h5>
     * <p>
     * The default value of the valueItem property is changed to <code class="prettyprint">null</code> instead of <code class="prettyprint">{ key: null, data: null, metadata: null }</code>.
     * Also, when clearing out the value of the component, this property will be set to <code class="prettyprint">null</code> instead of the object mentioned above.
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
     * This method does not synchronously shows the hidden messages of the component. The application should wait on the busy context
     * of the component after invoking this method for the changes to appear.
     * </p>
     *
     * <h5>Animation Events</h5>
     * <p>
     * ojAnimateStart and ojAnimateEnd events are no longer supported.
     * </p>
     *
     * <h5>ojValueAction Event</h5>
     * <p>
     * When clearing out the value, the <code class="prettyprint">itemContext</code> property of the <code class="prettyprint">event.detail</code>
     * object will be set to <code class="prettyprint">null</code> instead of <code class="prettyprint">{ key: null, data: null, metadata: null }</code>.
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
     * <h5>Limitations</h5>
     * <p>
     * Note that oj-c-select-single supports a limited feature set in JET 14. It does not support:
     * </p>
     * <ul>
     * <li>a mobile specific dropdown</li>
     * <li>hierarchical data</li>
     * <li>customizing dropdown collection rendering beyond the text of each item (no itemTemplate or collectionTemplate)</li>
     * <li>rendering in collection components like oj-data-grid and oj-table</li>
     * </ul>
     * @ojfragment migrationDoc
     * @memberof oj.ojSelectSingle
     */
  });

  Components.setDefaultOptions({
    // converterHint is defaulted to placeholder and notewindow in EditableValue.
    // For ojSelectSingle, we don't want a converterHint.
    ojSelectSingle: {
      // properties for all ojSelectSingle components
      displayOptions: {
        converterHint: ['none']
      }
    }
  });

});
