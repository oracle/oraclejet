/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'ojs/ojeditablevalue', 'jqueryui-amd/widgets/draggable', 'ojs/ojtouchproxy', 'ojs/ojcore-base', 'jquery', 'ojs/ojtranslation', 'ojs/ojdomutils'], function (ojcore, ojeditablevalue, draggable, ojtouchproxy, oj, $, Translations, DomUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

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
var __oj_slider_metadata = 
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
    "max": {
      "type": "number",
      "value": 100
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "min": {
      "type": "number",
      "value": 0
    },
    "orientation": {
      "type": "string",
      "enumValues": [
        "horizontal",
        "vertical"
      ],
      "value": "horizontal"
    },
    "step": {
      "type": "number",
      "value": 1
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
        "invalidStep": {
          "type": "string"
        },
        "maxMin": {
          "type": "string"
        },
        "noValue": {
          "type": "string"
        },
        "optionNum": {
          "type": "string"
        },
        "valueRange": {
          "type": "string"
        }
      }
    },
    "type": {
      "type": "string",
      "enumValues": [
        "fromMax",
        "fromMin",
        "single"
      ],
      "value": "fromMin"
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
      "type": "number",
      "writeback": true,
      "value": 0
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "reset": {},
    "setProperties": {},
    "setProperty": {},
    "showMessages": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {}
  },
  "extension": {}
};
    __oj_slider_metadata.extension._WIDGET_NAME = 'ojSlider';
    __oj_slider_metadata.extension._INNER_ELEM = 'input';
    oj.CustomElementBridge.register('oj-slider', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_slider_metadata, bindingMeta)
    });

var __oj_range_slider_metadata = 
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
    "max": {
      "type": "number",
      "value": 100
    },
    "messagesCustom": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "min": {
      "type": "number",
      "value": 0
    },
    "orientation": {
      "type": "string",
      "enumValues": [
        "horizontal",
        "vertical"
      ],
      "value": "horizontal"
    },
    "step": {
      "type": "number",
      "value": 1
    },
    "transientValue": {
      "type": "object",
      "writeback": true,
      "readOnly": true,
      "properties": {
        "end": {
          "type": "number"
        },
        "start": {
          "type": "number"
        }
      }
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "higherValueThumb": {
          "type": "string"
        },
        "lowerValueThumb": {
          "type": "string"
        },
        "startEnd": {
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
      "type": "object",
      "writeback": true,
      "properties": {
        "end": {
          "type": "number"
        },
        "start": {
          "type": "number"
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
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {}
  },
  "extension": {}
};
    /* global __oj_range_slider_metadata */
    __oj_range_slider_metadata.extension._WIDGET_NAME = 'ojSlider';
    __oj_range_slider_metadata.extension._INNER_ELEM = 'input';
    oj.CustomElementBridge.register('oj-range-slider', {
      metadata: oj.CollectionUtils.mergeDeep(__oj_range_slider_metadata, bindingMeta)
    });
  })();

  const OJ_SLIDER_THUMB = '.oj-slider-thumb';
  const ARIA_LABEL = 'aria-label';
  const ARIA_LABELLEDBY = 'aria-labelledby';
  const OJ_SLIDER_THUMB_INDEX = 'oj-slider-thumb-index';
  const EMPTY_DIV = '<div></div>';
  const OJ_SLIDER_BAR = 'oj-slider-bar';
  const OJ_SLIDER_BAR_VALUE = 'oj-slider-bar-value';
  const UI_DRAGGABLE = '.ui-draggable';

  (function () {
    /*!
     * JET Slider @VERSION
     *
     *
     * Depends:
     *  jquery.ui.widget.js
     */

    /**
     * @ojcomponent oj.ojRangeSlider
     * @ojdisplayname Range Slider
     * @augments oj.editableValue
     * @ojimportmembers oj.ojDisplayOptions
     * @ojsignature [{
     *                target: "Type",
     *                value: "class ojRangeSlider extends editableValue<Object|null, ojRangeSliderSettableProperties>"
     *               },
     *               {
     *                target: "Type",
     *                value: "ojRangeSliderSettableProperties extends editableValueSettableProperties<Object|null>",
     *                for: "SettableProperties"
     *               }
     *              ]
     * @ojrole rangeslider
     * @since 8.2.0
     * @ojshortdesc A range-slider allows a user to set a value range by moving the indicators.
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "type", "orientation", "min", "max", "step", "disabled"]}
     * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
     * @ojvbdefaultcolumns 3
     * @ojvbmincolumns 3
     *
     * @ojoracleicon 'oj-ux-ico-range-slider'
     * @ojuxspecs ['slider']
     *
     * @classdesc
     * <h3 id="sliderOverview-section">
     *   JET Range Slider Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sliderOverview-section"></a>
     * </h3>
     * <p>Description: The oj-range-slider component enhances an HTML
     * <code class="prettyprint">input</code> element into an interactive range-slider.
     * </p>
     * The numerical <code class="prettyprint">value</code> attribute determines the
     * current value of the range-slider, and thus affects the position of the range-slider thumb.
     * The value should be between the <code class="prettyprint">min</code> and
     * <code class="prettyprint">max</code> attribute values.
     * </p>
     * The <code class="prettyprint">step</code> attribute of the range-slider specifies the
     * interval between thumb stops. For example,
     * if <code class="prettyprint">min</code>  is set to 0 and
     * <code class="prettyprint">max</code>
     * is set to 10, a <code class="prettyprint">step</code> value of 2 would allow the thumb
     * to be positioned at 0, 2, 4, 6, 8, and 10.
     * </p>
     * The <code class="prettyprint">orientation</code> attribute defaults to
     * <code class="prettyprint">"horizontal"</code>.
     * Set <code class="prettyprint">orientation</code> to
     * <code class="prettyprint">"vertical"</code> for a vertical range-slider (one where the thumb
     * travels along the vertical axis).
     * </p>
     * The <code class="prettyprint">type</code> attribute is used to effect the rendered
     * style of the range-slider.
     * The <code class="prettyprint">type</code> attribute defaults to
     * <code class="prettyprint">"fromMin"</code>, which will style the value bar from the minimum
     * value to the range-slider thumb.
     * The <code class="prettyprint">type</code> attribute to either "single" or "fromMax" -
     * this will alter the rendered style of the range-slider's bar value.
     * </p>
     * Set the <code class="prettyprint">disabled</code> attribute
     * <code class="prettyprint">true</code> to display a range-slider that displays a value but does
     * not allow interaction.
     * </p>
     * Use <code class="prettyprint">style </code> attributes on the
     * <code class="prettyprint">oj-range-slider </code> element to set a horizontal range-slider's
     * width or a vertical range-slider's height.
     * </p>
     * Use the <code class="prettyprint">transient-value</code> attribute to access
     * range-slider value changes during range-slider thumb repositioning.
     * </p>
     * Note that the <code class="prettyprint">range</code> value for the
     * <code class="prettyprint">type</code> attribute
     * is not part of the initial (4.0) release of the custom element range-slider.
     * </p>
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
     * The range-slider component is accessible - it sets and maintains the appropriate aria- attributes,
     * including <code class="prettyprint">aria-valuenow</code>,
     * <code class="prettyprint">aria-valuemax</code>,
     * <code class="prettyprint">aria-valuemin</code>
     * and <code class="prettyprint">aria-orientation</code>.
     * <p>
     * {@ojinclude "name":"accessibilitySetLabelEditableValue"}
     * {@ojinclude "name":"accessibilityDisabledEditableValue"}
     * </p>
     * </p>
     * In addition, the range-slider thumb element can be accessed programmatically.
     * This approach may be necessary to ensure accessibility conformance.
     * For example, if the range-slider controls another element that is in a remote area of the page,
     * then the <code class="prettyprint">aria-controls</code> attribute for the range-slider thumb
     * should be set.
     *
     * <p>
     * Consider an example where you may need to set additional attributes for accessibility reasons.
     * Suppose there is another component that is in a remote area of the page
     * that controlled by the range-slider.
     * Assume that the <code class="prettyprint">id</code> of the remote element is
     * "idOfRemoteElement".
     * Below we show how to access the thumb element in order to set the
     * <code class="prettyprint">aria-controls</code> attribute of the thumb to point to the
     * id ("idOfRemoteElement") of the remote html element:
     *
     * <pre class="prettyprint">
     * <code>
     *     var thumb0 = myComponent.querySelectorAll('.oj-range-slider-thumb')[0];
     *     thumb0.setAttribute(aria-controls, "idOfRemoteElement");
     * </code></pre>
     *
     * @example <caption>Declare the oj-slider component with no attributes specified:</caption>
     * &lt;oj-range-slider>&lt;/oj-range-slider>
     *
     * @example <caption>Initialize the range-slider with a few attributes:</caption>
     * &lt;oj-range-slider value=10 max=100 min=0 step=2>&lt;/oj-range-slider>
     *
     * @example <caption>Initialize a component attribute via component binding:</caption>
     * &lt;oj-range-slider value="{{currentValue}}">&lt;/oj-range-slider>
     */

    //-----------------------------------------------------
    //                   Fragments RangeSlider
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
     *       <td>Range Slider Bar</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Reposition the thumb.</td>
     *     </tr>
     *     <tr>
     *       <td>Range Slider Thumb</td>
     *       <td><kbd>Swipe</kbd></td>
     *       <td>Reposition the thumb.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc,
     * and standalone gesture doc
     * @memberof oj.ojRangeSlider
     */
    /**
     * The JET slider supports keyboard actions for thumb movement:
     *
     * <p>
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *        <th>Target</th>
     *       <th>Key</th>
     *       <th>Use</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>Range Slider</td>
     *       <td><kbd>Tab</kbd></td>
     *       <td> Places focus on the range slider component.
     *        If hints, title or messages exist in a notewindow, pop up the notewindow.
     *     </tr>
     *     <tr>
     *       <td>Range Slider</td>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Scrolls right on a horizontal range slider, scrolls up on a vertical range slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Range Slider</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Scrolls left on a horizontal range slider, scrolls down on a vertical range slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Range Slider</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Scrolls right on a horizontal range slider, scrolls up on a vertical range slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Range Slider</td>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Scrolls left on a horizontal range slider,
     *        scrolls down on a vertical range slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Range Slider</td>
     *       <td><kbd>PageUp</kbd></td>
     *       <td>Scrolls one page right on a horizontal range slider,
     *        scrolls one page up on a vertical range slider. <br>
     *       A page is defined as 20% of the range of the range slider.
     *     </td>
     *     </tr>
     *     <tr>
     *       <td>Range Slider</td>
     *       <td><kbd>PageDown</kbd></td>
     *       <td>Scrolls one page left on a horizontal range slider,
     *       scrolls one page down on a vertical range slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Range Slider</td>
     *       <td><kbd>End</kbd></td>
     *       <td>Scrolls to the right end on a horizontal range slider, scrolls to the bottom on a
     * vertical range slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Range Slider</td>
     *       <td><kbd>Home</kbd></td>
     *       <td>Scrolls to the left end on a horizontal range slider, scrolls to the top on a
     * vertical range slider.
     *       </td>
     *     </tr>
     * </tbody>
     * </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone
     * gesture doc
     * @memberof oj.ojRangeSlider
     */

    //-----------------------------------------------------
    //                   Slider
    //-----------------------------------------------------
    /**
     * @ojcomponent oj.ojSlider
     * @ojdisplayname Slider
     * @augments oj.editableValue
     * @ojimportmembers oj.ojDisplayOptions
     * @ojsignature [{
     *                target: "Type",
     *                value: "class ojSlider extends editableValue<number|null, ojSliderSettableProperties>"
     *               },
     *               {
     *                target: "Type",
     *                value: "ojSliderSettableProperties extends editableValueSettableProperties<number|null>",
     *                for: "SettableProperties"
     *               }
     *              ]
     *
     * @ojrole slider
     * @since 0.7.0
     * @ojshortdesc A slider allows a user to set a value by moving an indicator.
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["labelHint", "type", "orientation", "min", "max", "step", "disabled"]}
     * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
     * @ojvbdefaultcolumns 3
     * @ojvbmincolumns 3
     *
     * @ojoracleicon 'oj-ux-ico-slider'
     *
     * @classdesc
     * <h3 id="sliderOverview-section">
     *   JET Slider Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sliderOverview-section"></a>
     * </h3>
     * <p>Description: The oj-slider component enhances an HTML
     * <code class="prettyprint">input</code> element into an interactive slider.
     * </p>
     * The numerical <code class="prettyprint">value</code> attribute determines the
     * current value of the slider, and thus affects the position of the slider thumb.
     * The value should be between the <code class="prettyprint">min</code> and
     * <code class="prettyprint">max</code> attribute values.
     * </p>
     * The <code class="prettyprint">step</code> attribute of the slider specifies the
     * interval between thumb stops. For example,
     * if <code class="prettyprint">min</code>  is set to 0 and
     * <code class="prettyprint">max</code>
     * is set to 10, a <code class="prettyprint">step</code> value of 2 would allow the thumb
     * to be positioned at 0, 2, 4, 6, 8, and 10.
     * </p>
     * The <code class="prettyprint">orientation</code> attribute defaults to
     * <code class="prettyprint">"horizontal"</code>.
     * Set <code class="prettyprint">orientation</code> to
     * <code class="prettyprint">"vertical"</code> for a vertical slider (one where the thumb
     * travels along the vertical axis).
     * </p>
     * The <code class="prettyprint">type</code> attribute is used to effect the rendered
     * style of the slider.
     * The <code class="prettyprint">type</code> attribute defaults to
     * <code class="prettyprint">"fromMin"</code>, which will style the value bar from the minimum
     * value to the slider thumb.
     * The <code class="prettyprint">type</code> attribute to either "single" or "fromMax" -
     * this will alter the rendered style of the slider's bar value.
     * </p>
     * Set the <code class="prettyprint">disabled</code> attribute
     * <code class="prettyprint">true</code> to display a slider that displays a value but does
     * not allow interaction.
     * </p>
     * Use <code class="prettyprint">style </code> attributes on the
     * <code class="prettyprint">oj-slider </code> element to set a horizontal slider's
     * width or a vertical slider's height.
     * </p>
     * Use the <code class="prettyprint">transient-value</code> attribute to access
     * slider value changes during slider thumb repositioning.
     * </p>
     * Note that the <code class="prettyprint">range</code> value for the
     * <code class="prettyprint">type</code> attribute
     * is not part of the initial (4.0) release of the custom element slider.
     * </p>
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
     * The slider component is accessible - it sets and maintains the appropriate aria- attributes,
     * including <code class="prettyprint">aria-valuenow</code>,
     * <code class="prettyprint">aria-valuemax</code>,
     * <code class="prettyprint">aria-valuemin</code>
     * and <code class="prettyprint">aria-orientation</code>.
     * </p>
     * In addition, the slider thumb element can be accessed programmatically.
     * This approach may be necessary to ensure accessibility conformance.
     * For example, if the slider controls another element that is in a remote area of the page,
     * then the <code class="prettyprint">aria-controls</code> attribute for the slider thumb
     * should be set.
     *
     * <p>
     * Consider an example where you may need to set additional attributes for accessibility reasons.
     * Suppose there is another component that is in a remote area of the page
     * that controlled by the slider.
     * Assume that the <code class="prettyprint">id</code> of the remote element is
     * "idOfRemoteElement".
     * Below we show how to access the thumb element in order to set the
     * <code class="prettyprint">aria-controls</code> attribute of the thumb to point to the
     * id ("idOfRemoteElement") of the remote html element:
     *
     * <pre class="prettyprint">
     *
     * <code>
     *     var thumb0 = myComponent.querySelectorAll('.oj-slider-thumb')[0];
     *     thumb0.setAttribute(aria-controls, "idOfRemoteElement");
     * </code></pre>
     * {@ojinclude "name":"accessibilityDisabledEditableValue"}
     *
     * @example <caption>Declare the oj-slider component with no attributes specified:</caption>
     * &lt;oj-slider>&lt;/oj-slider>
     *
     * @example <caption>Initialize the slider with a few attributes:</caption>
     * &lt;oj-slider value=10 max=100 min=0 step=2>&lt;/oj-slider>
     *
     * @example <caption>Initialize a component attribute via component binding:</caption>
     * &lt;oj-slider value="{{currentValue}}">&lt;/oj-slider>
     */

    //-----------------------------------------------------
    //                   Fragments Slider
    //-----------------------------------------------------
    /**
     * The JET slider supports keyboard actions for thumb movement:
     *
     * <p>
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *        <th>Target</th>
     *       <th>Key</th>
     *       <th>Use</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>Slider</td>
     *       <td><kbd>Tab</kbd></td>
     *       <td> Places focus on the slider component.
     *        If hints, title or messages exist in a notewindow, pop up the notewindow.
     *     </tr>
     *     <tr>
     *       <td>Slider</td>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Scrolls right on a horizontal slider, scrolls up on a vertical slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Slider</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Scrolls left on a horizontal slider, scrolls down on a vertical slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Slider</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Scrolls right on a horizontal slider, scrolls up on a vertical slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Slider</td>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Scrolls left on a horizontal slider,
     *        scrolls down on a vertical slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Slider</td>
     *       <td><kbd>PageUp</kbd></td>
     *       <td>Scrolls one page right on a horizontal slider,
     *        scrolls one page up on a vertical slider. <br>
     *       A page is defined as 20% of the range of the slider.
     *     </td>
     *     </tr>
     *     <tr>
     *       <td>Slider</td>
     *       <td><kbd>PageDown</kbd></td>
     *       <td>Scrolls one page left on a horizontal slider,
     *       scrolls one page down on a vertical slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Slider</td>
     *       <td><kbd>End</kbd></td>
     *       <td>Scrolls to the right end on a horizontal slider, scrolls to the bottom on a
     * vertical slider.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>Slider</td>
     *       <td><kbd>Home</kbd></td>
     *       <td>Scrolls to the left end on a horizontal slider, scrolls to the top on a
     * vertical slider.
     *       </td>
     *     </tr>
     * </tbody>
     * </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone
     * gesture doc
     * @memberof oj.ojSlider
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
     *       <td>Slider Bar</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Reposition the thumb.</td>
     *     </tr>
     *     <tr>
     *       <td>Slider Thumb</td>
     *       <td><kbd>Swipe</kbd></td>
     *       <td>Reposition the thumb.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc,
     * and standalone gesture doc
     * @memberof oj.ojSlider
     */

    //-----------------------------------------------------
    //                   Sub-ids Slider
    //-----------------------------------------------------

    /**
     * <p>Sub-ID for the slider thumb. Use this id to access the thumb of the  slider. </p>
     *
     * @ojsubid oj-slider-thumb-0
     * @memberof oj.ojSlider
     *
     * @example <caption>Get the node for the slider thumb:</caption>
     * var node = myComponent.getNodeBySubId({'subId': 'oj-slider-thumb-0'});
     */

    /**
     * <p>Sub-ID for the slider bar. </p>
     *
     * @ojsubid oj-slider-bar
     * @memberof oj.ojSlider
     *
     * @example <caption>Get the node for the slider bar:</caption>
     * var node = myComponent.getNodeBySubId({'subId': 'oj-slider-bar'});
     *
     */

    /**
     * <p>Sub-ID for the slider bar value. </p>
     *
     * @ojsubid oj-slider-bar-value
     * @memberof oj.ojSlider
     *
     * @example <caption>Get the node for the slider bar value:</caption>
     * var node = myComponent.getNodeBySubId({'subId': 'oj-slider-bar-value'});
     *
     */

    //-----------------------------------------------------
    //                   Styling
    //-----------------------------------------------------
    // ---------------- oj-focus-highlight --------------
    /**
     * Under normal circumstances this class is applied automatically.
     * It is documented here for the rare cases that an app developer needs per-instance control.<br/><br/>
     * The oj-focus-highlight class applies focus styling that may not be desirable when the focus results from pointer interaction (touch or mouse), but which is needed for accessibility when the focus occurs by a non-pointer mechanism, for example keyboard or initial page load.<br/><br/>
     * The application-level behavior for this component is controlled in the theme by the <code class="prettyprint"><span class="pln">$focusHighlightPolicy </span></code>SASS variable; however, note that this same variable controls the focus highlight policy of many components and patterns. The values for the variable are:<br/><br/>
     * <code class="prettyprint"><span class="pln">nonPointer: </span></code>oj-focus-highlight is applied only when focus is not the result of pointer interaction. Most themes default to this value.<br/>
     * <code class="prettyprint"><span class="pln">all: </span></code> oj-focus-highlight is applied regardless of the focus mechanism.<br/>
     * <code class="prettyprint"><span class="pln">none: </span></code> oj-focus-highlight is never applied. This behavior is not accessible, and is intended for use when the application wishes to use its own event listener to precisely control when the class is applied (see below). The application must ensure the accessibility of the result.<br/><br/>
     * To change the behavior on a per-instance basis, the application can set the SASS variable as desired and then use event listeners to toggle this class as needed.<br/>
     * @ojstyleclass oj-focus-highlight
     * @ojdisplayname Focus Styling
     * @ojshortdesc Allows per-instance control of the focus highlight policy (not typically required). See the Help documentation for more information.
     * @memberof oj.ojSlider
     * @ojtsexample
     * &lt;oj-slider class="oj-focus-highlight">
     *   &lt;!-- Content -->
     * &lt;/oj-slider>
     */
    // ---------------- oj-form-control-full-width --------------
    /**
     * Changes the max-width to 100% so that form components will occupy all the available horizontal space.
     * @ojstyleclass oj-form-control-full-width
     * @ojdisplayname Full Width
     * @memberof oj.ojSlider
     * @ojtsexample
     * &lt;oj-slider class="oj-form-control-full-width">
     * &lt;/oj-slider>
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
     * @memberof oj.ojSlider
     * @ojunsupportedthemes ['Alta']
     * @ojtsexample
     * &lt;oj-slider class="oj-form-control-max-width-md">&lt;/oj-slider>
     */
    /**
     * @ojstyleclass form-control-max-width.oj-form-control-max-width-sm
     * @ojshortdesc Sets the max width for a small field
     * @ojdisplayname Small
     * @memberof! oj.ojSlider
     */
    /**
     * @ojstyleclass form-control-max-width.oj-form-control-max-width-md
     * @ojshortdesc Sets the max width for a medium field
     * @ojdisplayname Medium
     * @memberof! oj.ojSlider
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
     * @memberof oj.ojSlider
     * @ojunsupportedthemes ['Alta']
     * @ojtsexample
     * &lt;oj-slider class="oj-form-control-width-md">&lt;/oj-slider>
     */
    /**
     * @ojstyleclass form-control-width.oj-form-control-width-sm
     * @ojshortdesc Sets the width for a small field
     * @ojdisplayname Small
     * @memberof! oj.ojSlider
     */
    /**
     * @ojstyleclass form-control-width.oj-form-control-width-md
     * @ojshortdesc Sets the width for a medium field
     * @ojdisplayname Medium
     * @memberof! oj.ojSlider
     */
    /**
     * @ojstylevariableset oj-slider-css-set1
     * @ojstylevariable oj-slider-thumb-width {description: "Slider thumb width", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-slider-thumb-height {description: "Slider thumb height", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-slider-thumb-border-radius {description: "Slider thumb border radius", formats: ["length","percentage"], help: "#css-variables"}
     * @ojstylevariable oj-slider-thumb-border-width {description: "Slider thumb border width", formats: ["length"], help: "#css-variables"}
     * @ojstylevariable oj-slider-track-thickness {description: "Slider track thickness", formats: ["length"], help: "#css-variables"}
     * @memberof oj.ojSlider
     */
    /**
     * CSS variables used by oj-slider when enabled
     * @ojstylevariableset oj-slider-css-set2
     * @ojdisplayname Enabled
     * @ojstylevariable oj-slider-thumb-bg-color {description: "Slider thumb background color when enabled", formats: ["color"], help: "#oj-slider-css-set2"}
     * @ojstylevariable oj-slider-thumb-border-color {description: "Slider thumb border color when enabled", formats: ["color"], help: "#oj-slider-css-set2"}
     * @ojstylevariable oj-slider-thumb-box-shadow {description: "Slider thumb box shadow when enabled", help: "#oj-slider-css-set2"}
     * @ojstylevariable oj-slider-track-bg-color {description: "Slider track background color when enabled", formats: ["color"], help: "#oj-slider-css-set2"}
     * @ojstylevariable oj-slider-value-bg-color {description: "Slider value background color when enabled", formats: ["color"], help: "#oj-slider-css-set2"}
     * @memberof oj.ojSlider
     */
    /**
     * CSS variables used by oj-slider when hovered
     * @ojstylevariableset oj-slider-css-set3
     * @ojdisplayname Hovered
     * @ojstylevariable oj-slider-thumb-bg-color-hover {description: "Slider thumb background color when hovered", formats: ["color"], help: "#oj-slider-css-set3"}
     * @ojstylevariable oj-slider-thumb-box-shadow-hover {description: "Slider thumb box shadow when hovered", help: "#oj-slider-css-set3"}
     * @memberof oj.ojSlider
     */
    /**
     * CSS variables used by oj-slider when active
     * @ojstylevariableset oj-slider-css-set4
     * @ojdisplayname Active
     * @ojstylevariable oj-slider-thumb-bg-color-active {description: "Slider thumb background color when active", formats: ["color"], help: "#oj-slider-css-set4"}
     * @ojstylevariable oj-slider-thumb-border-color-active {description: "Slider thumb border color when active", formats: ["color"], help: "#oj-slider-css-set4"}
     * @ojstylevariable oj-slider-thumb-box-shadow-active {description: "Slider thumb box shadow when active", help: "#oj-slider-css-set4"}
     * @ojstylevariable oj-slider-thumb-scale-active {description: "Slider thumb scale when active", formats: ["number"], help: "#oj-slider-css-set4"}
     * @memberof oj.ojSlider
     */
    /**
     * CSS variables used by oj-slider when disabled
     * @ojstylevariableset oj-slider-css-set5
     * @ojdisplayname Disabled
     * @ojstylevariable oj-slider-thumb-bg-color-disabled {description: "Slider thumb background color when disabled", formats: ["color"], help: "#oj-slider-css-set5"}
     * @ojstylevariable oj-slider-thumb-border-color-disabled {description: "Slider thumb border color when disabled", formats: ["color"], help: "#oj-slider-css-set5"}
     * @ojstylevariable oj-slider-track-bg-color-disabled {description: "Slider track background color when disabled", formats: ["color"], help: "#oj-slider-css-set5"}
     * @ojstylevariable oj-slider-value-bg-color-disabled {description: "Slider value background color when disabled", formats: ["color"], help: "#oj-slider-css-set5"}
     * @memberof oj.ojSlider
     */
    oj.__registerWidget('oj.ojSlider', $.oj.editableValue, {
      defaultElement: '<input>',
      version: '1.0.1',
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
         * &lt;oj-label for="sliderId">Name:&lt;/oj-label>
         * &lt;oj-slider id="sliderId">
         * &lt;/oj-slider>
         * // ojLabel then writes the labelled-by attribute on the oj-slider.
         * &lt;oj-label id="labelId" for="sliderId">Name:&lt;/oj-label>
         * &lt;oj-slider id="sliderId" labelled-by"labelId">
         * &lt;/oj-slider>
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
         * @default null
         * @public
         * @instance
         * @since 7.0.0
         * @memberof oj.ojSlider
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
         * &lt;oj-label for="rangeSliderId">Name:&lt;/oj-label>
         * &lt;oj-range-slider id="rangeSliderId">
         * &lt;/oj-range-slider>
         * // ojLabel then writes the labelled-by attribute on the oj-range-slider.
         * &lt;oj-label id="labelId" for="rangeSliderId">Name:&lt;/oj-label>
         * &lt;oj-range-slider id="rangeSliderId" labelled-by"labelId">
         * &lt;/oj-range-slider>
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
         * @default null
         * @public
         * @instance
         * @since 8.2.0
         * @memberof oj.ojRangeSlider
         */
        labelledBy: null,

        /**
         * The maximum value of the slider.
         * The <code class="prettyprint">max</code> must not be less than the
         * <code class="prettyprint">min</code>, or else an Error is thrown during
         * initialization.
         * @expose
         * @name max
         * @memberof oj.ojSlider
         * @ojshortdesc The maximum value of the slider. See the Help documentation for more information.
         * @instance
         * @type {?number}
         * @default 100
         * @since 0.7.0
         * @example <caption>Initialize the slider with the
         * <code class="prettyprint">max</code> attribute:</caption>
         * &lt;oj-slider max=100>&lt;/oj-slider>
         * @example <caption>Get or set the <code class="prettyprint">max</code> property after initialization:</caption>
         * // Getter
         * var max = myComponent.max;
         *
         * // Setter
         * myComponent.max = 100;
         */
        /**
         * The maximum value of the range slider.
         * The <code class="prettyprint">max</code> must not be less than the
         * <code class="prettyprint">min</code>, or else an Error is thrown during
         * initialization.
         * @expose
         * @memberof oj.ojRangeSlider
         * @ojshortdesc The maximum value of the range slider. See the Help documentation for more information.
         * @instance
         * @type {?number}
         * @default 100
         * @since 8.2.0
         * @example <caption>Initialize the range slider with the
         * <code class="prettyprint">max</code> attribute:</caption>
         * &lt;oj-range-slider max=100>&lt;/oj-range-slider>
         * @example <caption>Get or set the <code class="prettyprint">max</code> property after initialization:</caption>
         * // Getter
         * var max = myComponent.max;
         *
         * // Setter
         * myComponent.max = 100;
         */
        max: 100,

        /**
         * The minimum value of the slider.
         * The <code class="prettyprint">min</code> must not be greater than the
         * <code class="prettyprint">max</code>, or else an Error is thrown during
         * initialization.
         * @expose
         * @name min
         * @memberof oj.ojSlider
         * @ojshortdesc The minimum value of the slider. See the Help documentation for more information.
         * @instance
         * @type {?number}
         * @default 0
         * @since 0.7.0
         * @example <caption>Initialize the slider with the
         * <code class="prettyprint">min</code> attribute:</caption>
         * &lt;oj-slider min=0>&lt;/oj-slider>
         * @example <caption>Get or set the <code class="prettyprint">min</code> property after initialization:</caption>
         * // Getter
         * var min = myComponent.min;
         *
         * // Setter
         * myComponent.min = 0;
         *
         */
        /**
         * The minimum value of the range slider.
         * The <code class="prettyprint">min</code> must not be greater than the
         * <code class="prettyprint">max</code>, or else an Error is thrown during
         * initialization.
         * @expose
         * @memberof oj.ojRangeSlider
         * @ojshortdesc The minimum value of the range slider. See the Help documentation for more information.
         * @instance
         * @type {?number}
         * @default 0
         * @since 8.2.0
         * @example <caption>Initialize the range slider with the
         * <code class="prettyprint">min</code> attribute:</caption>
         * &lt;oj-range-slider min=0>&lt;/oj-range-slider>
         * @example <caption>Get or set the <code class="prettyprint">min</code> property after initialization:</caption>
         * // Getter
         * var min = myComponent.min;
         *
         * // Setter
         * myComponent.min = 0;
         *
         */
        min: 0,

        /**
         * Specify the orientation of the slider.
         *
         * @expose
         * @name orientation
         * @memberof oj.ojSlider
         * @ojshortdesc Specifies the orientation of the slider.
         * @instance
         * @type {string}
         * @ojvalue {string} "horizontal" Orient the slider horizontally.
         * @ojvalue {string} "vertical" Orient the slider vertically.
         * @default "horizontal"
         * @since 0.7.0
         *
         * @example <caption>Initialize the slider with the
         * <code class="prettyprint">orientation</code> attribute:</caption>
         * &lt;oj-slider orientation="vertical">&lt;/oj-slider>
         *
         * @example <caption>Get or set the <code class="prettyprint">orientation</code>
         * property after initialization:</caption>
         * // Getter
         * var orientation = myComponent.orientation;
         *
         * // Setter
         * myComponent.orientation = "vertical";
         *
         */
        /**
         * Specify the orientation of the range slider.
         *
         * @expose
         * @name orientation
         * @memberof oj.ojRangeSlider
         * @ojshortdesc Specifies the orientation of the range slider.
         * @instance
         * @type {string}
         * @ojvalue {string} "horizontal" Orient the range slider horizontally.
         * @ojvalue {string} "vertical" Orient the range slider vertically.
         * @default "horizontal"
         * @since 8.2.0
         *
         * @example <caption>Initialize the range slider with the
         * <code class="prettyprint">orientation</code> attribute:</caption>
         * &lt;oj-range-slider orientation="vertical">&lt;/oj-range-slider>
         *
         * @example <caption>Get or set the <code class="prettyprint">orientation</code>
         * property after initialization:</caption>
         * // Getter
         * var orientation = myComponent.orientation;
         *
         * // Setter
         * myComponent.orientation = "vertical";
         *
         */
        orientation: 'horizontal',

        /**
         * readOnly is private - more UX design is necessary to support readonly across
         * components.
         * Whether the component is readOnly. The element's
         * <code class="prettyprint">readOnly</code>
         * attribute is used as its initial value if it exists, when the attribute is not explicitly
         * set. When neither is set, <code class="prettyprint">readOnly </code>
         * defaults to false.
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
         * @example <caption>Initialize component with <code class="prettyprint">readOnly</code>
         * attribute:</caption>
         * &lt;oj-slider readOnly="true">&lt;/oj-slider>
         * @example <caption>Get or set the <code class="prettyprint">readOnly</code> property after initialization:</caption>
         * // Getter
         * var readOnly = myComponent.readOnly;
         *
         * // Setter
         * myComponent.readOnly = true;
         *
         *
         * @private
         * @type {?boolean}
         * @default false
         * @instance
         * @memberof oj.ojSlider
         */
        /**
         * readOnly is private - more UX design is necessary to support readonly across
         * components.
         * Whether the component is readOnly. The element's
         * <code class="prettyprint">readOnly</code>
         * attribute is used as its initial value if it exists, when the attribute is not explicitly
         * set. When neither is set, <code class="prettyprint">readOnly </code>
         * defaults to false.
         *
         * @example <caption>Initialize component with <code class="prettyprint">readOnly</code>
         * attribute:</caption>
         * &lt;oj-range-slider readOnly="true">&lt;/oj-range-slider>
         * @example <caption>Get or set the <code class="prettyprint">readOnly</code> property after initialization:</caption>
         * // Getter
         * var readOnly = myComponent.readOnly;
         *
         * // Setter
         * myComponent.readOnly = true;
         *
         *
         * @private
         * @type {?boolean}
         * @default false
         * @instance
         * @memberof oj.ojRangeSlider
         */
        readOnly: false,

        /**
         * Whether the component is disabled. The
         * <code class="prettyprint">disabled</code> attribute is used as its initial
         * value if it exists, when the attribute is not explicitly set. When neither is set,
         * <code class="prettyprint">disabled </code>
         * defaults to false.
         *
         * @example <caption>Initialize the slider with
         * <code class="prettyprint">disabled</code> attribute:</caption>
         * &lt;oj-slider disabled="true">&lt;/oj-slider>
         * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
         * // Getter
         * var disabled = myComponent.disabled;
         *
         * // Setter
         * myComponent.disabled = true;
         *
         * @ojshortdesc Specifies whether the component is disabled. The default is false.
         * @expose
         * @type {boolean}
         * @default false
         * @since 0.7.0
         * @instance
         * @memberof oj.ojSlider
         */
        /**
         * Whether the component is disabled. The
         * <code class="prettyprint">disabled</code> attribute is used as its initial
         * value if it exists, when the attribute is not explicitly set. When neither is set,
         * <code class="prettyprint">disabled </code>
         * defaults to false.
         *
         * @example <caption>Initialize the slider with
         * <code class="prettyprint">disabled</code> attribute:</caption>
         * &lt;oj-range-slider disabled="true">&lt;/oj-range-slider>
         * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
         * // Getter
         * var disabled = myComponent.disabled;
         *
         * // Setter
         * myComponent.disabled = true;
         *
         * @ojshortdesc Specifies whether the component is disabled. The default is false.
         * @expose
         * @type {boolean}
         * @default false
         * @since 8.2.0
         * @instance
         * @memberof oj.ojRangeSlider
         */
        disabled: false,

        /**
         * Determines the size or amount of each interval or step the slider takes
         * between min and max.
         * The full specified value of the range (max - min) should be divisible by step.
         *
         * @expose
         * @name step
         * @instance
         * @type {?number}
         * @default 1
         * @since 0.7.0
         * @memberof oj.ojSlider
         * @ojshortdesc Specifies the amount to increase or decrease the value when moving in step increments. See the Help documentation for more information.
         *
         * @example <caption>Initialize the slider with the
         * <code class="prettyprint">step</code> attribute:</caption>
         * &lt;oj-slider step=10>&lt;/oj-slider>
         * @example <caption>Get or set the <code class="prettyprint">step</code> property after initialization:</caption>
         * // Getter
         * var step = myComponent.step;
         *
         * // Setter
         * myComponent.step = 10;
         *
         **/
        /**
         * Determines the size or amount of each interval or step the range slider takes
         * between min and max.
         * The full specified value of the range (max - min) should be divisible by step.
         *
         * @expose
         * @instance
         * @type {?number}
         * @default 1
         * @since 8.2.0
         * @memberof oj.ojRangeSlider
         * @ojshortdesc Specifies the amount to increase or decrease the value when moving in step increments. See the Help documentation for more information.
         *
         * @example <caption>Initialize the range slider with the
         * <code class="prettyprint">step</code> attribute:</caption>
         * &lt;oj-range-slider step=10>&lt;/oj-range-slider>
         * @example <caption>Get or set the <code class="prettyprint">step</code> property after initialization:</caption>
         * // Getter
         * var step = myComponent.step;
         *
         * // Setter
         * myComponent.step = 10;
         *
         **/
        step: 1,

        /**
         * The slider type determines how the value is represented in the UI.
         *
         * @expose
         * @name type
         * @type {?string}
         * @ojvalue {string} "fromMin" A single-thumb slider where the value bar goes from
         * the slider min to the slider thumb.
         * @ojvalue {string} "fromMax" A single-thumb slider where the value bar goes from
         * the slider thumb to the slider max.
         * @ojvalue {string} "single" A single-thumb slider where the value bar has no
         * additional styling.
         * @default "fromMin"
         * @since 0.7.0
         * @instance
         * @member
         * @memberof oj.ojSlider
         * @ojshortdesc The slider type specifies how the slider value is represented.
         *
         * @example <caption>Initialize component with <code class="prettyprint">type</code>
         * attribute set to "fromMax":</caption>
         * &lt;oj-slider type="fromMax">&lt;/oj-slider>
         * @example <caption>Get or set the <code class="prettyprint">type</code> property after initialization:</caption>
         * // Getter
         * var type = myComponent.type;
         *
         * // Setter
         * myComponent.type = "fromMax";
         *
         */
        type: 'fromMin',

        /**
         * The numerical value of the slider.
         *
         * <p> Note that the <code class="prettyprint">value</code> attribute should
         * be compatible with the <code class="prettyprint">type</code> attribute, as
         * described above.
         *
         * @example <caption>Initialize the slider with the
         * <code class="prettyprint">value</code> attribute:</caption>
         * &lt;oj-slider value=55>&lt;/oj-slider>
         * @example <caption>Get or set <code class="prettyprint">value</code> property
         * after initialization:</caption>
         * // Getter
         * var value = myComponent.value;
         *
         * // Setter
         * myComponent.value = 10;
         *
         * @member
         * @name value
         * @ojshortdesc The numerical value of the slider.
         * @expose
         * @access public
         * @instance
         * @default 0
         * @since 0.7.0
         * @ojwriteback
         * @ojeventgroup common
         * @memberof oj.ojSlider
         * @ojshortdesc The numerical value of the slider.
         * @type {?number}
         */
        /**
         * The numerical range value of the range-slider.
         *
         * @example <caption>Initialize the range-slider with the
         * <code class="prettyprint">value</code> attribute:</caption>
         * &lt;oj-range-slider value={start:10, end:40} >&lt;/oj-range-slider>
         * @example <caption>Get or set <code class="prettyprint">value</code> property
         * after initialization:</caption>
         * // Getter
         * var value = myComponent.value;
         *
         * // Setter
         * myComponent.value = {start:10, end: 40};
         *
         * @member
         * @name value
         * @ojshortdesc The numerical range value of the range-slider.
         * @expose
         * @access public
         * @instance
         * @default null
         * @since 8.2.0
         * @ojwriteback
         * @ojeventgroup common
         * @memberof oj.ojRangeSlider
         * @ojshortdesc The numerical value of the range-slider.
         * @type {Object|null}
         */
        // value: {
        /**
         * Start value of the range selected.
         *
         * @expose
         * @name value.start
         * @ojshortdesc Specifies the start value of the range selected.
         * @memberof! oj.ojRangeSlider
         * @instance
         * @type {number|null}
         * @default null
         * @since 8.2.0
         */
        // start: null,
        /**
         * End value of the range selected.
         *
         * @expose
         * @name value.end
         * @ojshortdesc Specifies the end value of the range selected.
         * @memberof! oj.ojRangeSlider
         * @instance
         * @type {number|null}
         * @default null
         * @since 8.2.0
         */
        // end: null
        // },
        value: 0,

        /**
         * <p>The  <code class="prettyprint">transientValue</code> is the read-only attribute for
         * retrieving the transient value from the slider.</p>
         * <p>
         * The <code class="prettyprint">transientValue</code> updates to display the transient
         * changes of the slider thumb value (subject to the step constraints). The difference
         * in behavior is <code class="prettyprint">transientValue</code> will be updated
         * as the thumb is sliding, where as <code class="prettyprint">value</code>
         * is updated only after the thumb is released (or after a key press).
         * </p>
         * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
         * @expose
         * @name transientValue
         * @ojshortdesc Read-only property used for retrieving the transient value from the component. See the Help documentation for more information.
         * @access public
         * @instance
         * @ojwriteback
         * @memberof oj.ojSlider
         * @type {number}
         * @since 5.0
         * @readonly
         *
         */
        /**
         * <p>The  <code class="prettyprint">transientValue</code> is the read-only attribute for
         * retrieving the transient value from the range slider.</p>
         * <p>
         * The <code class="prettyprint">transientValue</code> updates to display the transient
         * changes of the slider thumb value (subject to the step constraints). The difference
         * in behavior is <code class="prettyprint">transientValue</code> will be updated
         * as the thumb is sliding, where as <code class="prettyprint">value</code>
         * is updated only after the thumb is released (or after a key press).
         * </p>
         * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
         * @expose
         * @name transientValue
         * @ojshortdesc Read-only property used for retrieving the transient value from the component. See the Help documentation for more information.
         * @access public
         * @instance
         * @ojwriteback
         * @memberof oj.ojRangeSlider
         * @type {Object|null}
         * @since 8.2.0
         * @readonly
         *
         */
        /**
         * Start value of the range selected.
         *
         * @expose
         * @name transientValue.start
         * @ojshortdesc Specifies the start transientValue of the range selected.
         * @memberof! oj.ojRangeSlider
         * @instance
         * @type {number|null}
         * @default null
         * @since 8.2.0
         */
        // start: null,
        /**
         * End value of the range selected.
         *
         * @expose
         * @name transientValue.end
         * @ojshortdesc Specifies the end transientValue of the range selected.
         * @memberof! oj.ojRangeSlider
         * @instance
         * @type {number|null}
         * @default null
         * @since 8.2.0
         */
        rawValue: undefined
      },

      // number of pages in a slider
      // (how many times can you page up/down to go through the whole range)
      _numPages: 5,
      _defaultElementId: null,

      _sliderDisplayValue: null,

      _isRTL: function () {
        return DomUtils.getReadingDirection() === 'rtl';
      },

      _ComponentCreate: function () {
        this._super();

        // ojSlider could support both <div> and <input> tags
        this._inputtag = false;

        if (this.element.is('INPUT')) {
          this._inputtag = true;

          // Save the input tag style, apply to sliderWrapper later in the code.
          if (this.element[0].style) {
            this._styleFromInputTag = this.element[0].style.cssText;
          }

          this._inputElementOriginalDisplay = this.element[0].style.display;
          this.element[0].style.display = 'none';

          if (this.OuterWrapper) {
            this._elementWrapped = $(this.OuterWrapper);
          } else {
            var inputDiv = $(this.element).wrap('<div> </div>'); // @HTMLUpdateOK

            // _elementWrapped is the new wrapped input element.
            this._elementWrapped = inputDiv.parent();
          }
        } else {
          this._elementWrapped = this.element;
        }

        // use 'transientValue' for custom elements,
        // and use 'rawValue' for widget syntax.
        this._transientValueName = this._IsCustomElement() ? 'transientValue' : 'rawValue';
        this._componentCreateStyling();
        this._componentSetup();
      },

      /**
       * Convenience function to set the rawValue option. Overrides EditableValue _SetRawValue.
       * @param {String} val value to set rawValue to
       * @param {Event} event DOM event
       * @return {void}
       * @memberof oj.ojSlider
       * @instance
       * @override
       * @private
       */
      _SetRawValue: function (val, event) {
        var flags = {
          _context: { originalEvent: event, writeback: true, internalSet: true, readOnly: true }
        };
        if (!oj.Object.compareValues(this.options[this._transientValueName], val)) {
          this.option(this._transientValueName, val, flags);
        }
      },
      // Setup the component's styling during component creation.
      _componentCreateStyling: function () {
        var elementWrapped = this._elementWrapped[0];
        elementWrapped.classList.add('oj-slider', 'oj-component', 'oj-form-control');
        this._setOrientationStyles(true);
      },
      // sets the styling for vertical or horizontal orientation.
      // if init is true, then it doesn't try to remove the orientation
      // styling.
      _setOrientationStyles: function (init) {
        var elementWrapped = this._elementWrapped[0];

        if (this._isVertical()) {
          if (!init) {
            elementWrapped.classList.remove('oj-slider-horizontal');
          }
          elementWrapped.classList.add('oj-slider-vertical');
        } else {
          if (!init) {
            elementWrapped.classList.remove('oj-slider-vertical');
          }
          elementWrapped.classList.add('oj-slider-horizontal');
        }
      },
      //
      // Setup the component based on the current options.
      // Also create DOM elements for thumbs and bars.
      // Called during component creation and on option changes.
      //
      _componentSetup: function () {
        this._newMultiValue = [];
        this._thumbIndex = null;

        if (this._isCustomRangeSlider()) {
          this.options.type = 'range';
          if (typeof this.options.value === 'number') {
            this.options.value = {
              start: null,
              end: null
            };
          }
        }

        if (this.options.type === 'range') {
          this._multipleThumbs = true;
        } else {
          this._multipleThumbs = false;
        }

        this._calculateNewMax();

        this._createSliderContainer();
        this._createBarBackground();
        this._buildValueOption();
        this._createRange();
        this._createThumbs();
        this._updateUI();

        this._setupEvents();
      },

      _copyLabelledbyToThumb: function (labelId) {
        var thumb = this._elementWrapped.find(OJ_SLIDER_THUMB);
        var thumb2;
        if (this._isCustomRangeSlider()) {
          var labelEl = document.getElementById(labelId);
          var ariaLabelText = labelEl ? labelEl.textContent : '';
          var lowerValueThumbString = Translations.getTranslatedString('oj-ojSlider.lowerValueThumb');
          var higherValueThumbString = Translations.getTranslatedString(
            'oj-ojSlider.higherValueThumb'
          );
          thumb.attr(ARIA_LABEL, ariaLabelText + ' ' + lowerValueThumbString); // @HTMLUpdateOK
          thumb2 = thumb[1];
          $(thumb2).attr(ARIA_LABEL, ariaLabelText + ' ' + higherValueThumbString); // @HTMLUpdateOK
        } else {
          thumb.attr(ARIA_LABELLEDBY, labelId); // @HTMLUpdateOK
          if (thumb.length > 1) {
            thumb2 = thumb[1];
            $(thumb2).attr(ARIA_LABELLEDBY, String(labelId)); // @HTMLUpdateOK
          }
        }
      },

      _setAriaLabelToThumb: function (ariaLabel) {
        var thumb;
        if (this._isCustomRangeSlider()) {
          var lowerValueThumbString = Translations.getTranslatedString('oj-ojSlider.lowerValueThumb');
          var higherValueThumbString = Translations.getTranslatedString(
            'oj-ojSlider.higherValueThumb'
          );

          thumb = this._elementWrapped.find(OJ_SLIDER_THUMB);
          thumb.attr(ARIA_LABEL, ariaLabel + ' ' + lowerValueThumbString); // @HTMLUpdateOK
          var thumb2 = thumb[1];
          $(thumb2).attr(ARIA_LABEL, ariaLabel + ' ' + higherValueThumbString); // @HTMLUpdateOK
        } else {
          thumb = this.OuterWrapper.querySelector(OJ_SLIDER_THUMB);
          thumb.setAttribute(ARIA_LABEL, ariaLabel); // @HTMLUpdateOK
        }
      },

      _AfterCreate: function () {
        this._super();

        this._makeDraggable();
        this._setAriaInfo();
      },
      _setAriaInfo: function () {
        var ariaLabelString;
        var label;
        var ariaLabelledBy;
        var thumb;

        // for oj-slider, if labelled-by attribute is set, use that to
        // construct the aria-labelledby and put on the thumb
        // else use aria-label if it is there.
        if (this.OuterWrapper) {
          if (this.options.labelledBy) {
            var defaultLabelId = this.uuid + '_Label';
            ariaLabelledBy = ojeditablevalue.EditableValueUtils._getOjLabelAriaLabelledBy(
              this.options.labelledBy,
              defaultLabelId
            );
            this._copyLabelledbyToThumb(ariaLabelledBy);
          }
          // there is a use-case where aria-label is set on the component, and we write that to the
          // thumb.
          if (!this.options.labelledBy || document.getElementById(this.options.labelledBy)) {
            ariaLabelString = this.OuterWrapper.getAttribute(ARIA_LABEL);
            if (ariaLabelString) {
              this._setAriaLabelToThumb(ariaLabelString);
            }
          }
        } else {
          // do not change the code for widget
          label = this._GetLabelElementLocal();
          // Copy any labelled-by on the <input labelled-by="id"> to the slider thumb.
          //
          if (label) {
            //
            // this id should be on the thumb: aria-labelledby =
            //

            // Set the aria-labelledby attribute of the thumb to the returned id.
            var labelId = label.attr('id');
            if (!labelId) {
              labelId = label.attr('for');
            }

            if (labelId.length > 0) {
              this._copyLabelledbyToThumb(labelId);
            }
          } else {
            //
            // Check if the <input> has aria-label=""
            //
            ariaLabelString = this.element.attr(ARIA_LABEL);
            if (ariaLabelString) {
              thumb = this._elementWrapped.find(OJ_SLIDER_THUMB);

              // Set the aria-labelledby attribute of the thumb to the returned id
              thumb.attr(ARIA_LABEL, ariaLabelString); // @HTMLUpdateOK
            }
          }
        }
      },

      /**
       * Used by widget code
       * @memberof oj.ojSlider
       * @instance
       * @private
       */
      _GetLabelElementLocal: function () {
        // If <input> has aria-labelledby set, then look for label it is referring to.
        var queryResult = this._getAriaLabelledByElementLocal();
        if (queryResult !== null && queryResult.length !== 0) {
          return queryResult;
        }

        queryResult = this._getAriaLabelForElementLocal();
        if (queryResult !== null && queryResult.length !== 0) {
          return queryResult;
        }

        return null;
      },

      /**
       * Used by widget code
       * @memberof oj.ojSlider
       * @instance
       * @private
       */
      _getAriaLabelForElementLocal: function () {
        var id;
        id = this.element.prop('id');

        if (id !== undefined) {
          var labelQuery = "label[for='" + id + "']";

          var jqLabelQuery = $(labelQuery);
          if (jqLabelQuery.length > 0) return jqLabelQuery;

          var spanQuery = "span[for='" + id + "']";

          if ($(spanQuery).length !== 0) {
            return $(spanQuery);
          }
        }
        return null;
      },

      /**
       * Used by widget code
       * @memberof oj.ojSlider
       * @instance
       * @private
       */
      _getAriaLabelledByElementLocal: function () {
        // look for a label with an id equal to the value of aria-labelledby.
        // .prop does not work for aria-labelledby. Need to use .attr to find
        // aria-labelledby.

        var ariaId = this.element.attr(ARIA_LABELLEDBY);

        // Handle direct labelling case for custom elements
        // (this is not the common case, but still is supported)
        if (ariaId === undefined && this.OuterWrapper) {
          var ariaIdDirect = this._elementWrapped.attr(ARIA_LABELLEDBY);
          if (ariaIdDirect) {
            if (document.getElementById(ariaIdDirect) !== null) {
              return $(document.getElementById(ariaIdDirect));
            }
          }
        }

        if (ariaId !== undefined) {
          var jqLabelQuery = $("label[id='" + ariaId + "']");
          if (jqLabelQuery.length > 0) return jqLabelQuery;

          var jqSpanQuery = $("span[id='" + ariaId + "']");
          if (jqSpanQuery.length > 0) {
            return jqSpanQuery;
          }
        }
        return null;
      },

      widget: function () {
        return this._elementWrapped;
      },

      /**
       * Called when the display value on the element needs to be updated. This method updates the
       * (content) element value. Widgets can override this method to update the element
       * appropriately.
       *
       * @param {string} displayValue of the new string to be displayed
       *
       * @memberof oj.ojSlider
       * @instance
       * @protected
       */
      _SetDisplayValue: function (displayValue) {
        this._sliderDisplayValue = displayValue;
      },

      /**
       * Returns the display value that is ready to be passed to the converter.
       *
       * @return {string} usually a string display value
       *
       * @memberof oj.ojSlider
       * @instance
       * @protected
       */
      _GetDisplayValue: function () {
        return this._sliderDisplayValue;
      },

      _getElementId: function () {
        if (this.OuterWrapper) {
          if (!this._elementWrapped[0].id) {
            this._elementWrapped.uniqueId();
          }
          return this._elementWrapped[0].id;
        }

        if (!this.element[0].id) {
          this.element.uniqueId();
        }
        return this.element[0].id;
      },

      //
      // Return the id of the slider thumb at index.
      //
      _getThumbId: function (index) {
        var elementId = this._getElementId();
        return elementId + '-thumb' + index;
      },

      //
      // Return the id of the slider bar value.
      //
      _getBarValueId: function () {
        var elementId = this._getElementId();
        return elementId + '-barValue';
      },

      //
      // Return the id of the slider bar.
      //
      _getBarBackgroundId: function () {
        var elementId = this._getElementId();
        return elementId + '-barBack';
      },

      //
      // Return the id of the slider bar.
      //
      _getSliderWrapperId: function () {
        var elementId = this._getElementId();
        return elementId + '-sliderWrapper';
      },

      _createThumbs: function () {
        var i;
        var thumbCount;
        var ariaMin = "aria-valuemin = '" + this._valueMin() + "' ";
        var ariaMax = "aria-valuemax = '" + this._valueMax() + "' ";
        var thumb = '';
        var thumbSpanStart = '<span ';
        var thumbClasses =
          "class='oj-slider-thumb ui-state-default' tabindex='0' role='slider'" +
          ariaMin +
          ariaMax +
          '></span>';
        var thumbs = [];

        if (this._multipleThumbs) {
          thumbCount = 2; // limit number of thumbs to 2.
        } else {
          thumbCount = 1;
        }

        //
        // Assign each thumb a unique id based on the elementId and the thumb number.
        //
        for (i = 0; i < thumbCount; i++) {
          var thumbId = "id='" + this._getThumbId(i) + "' ";
          thumb = thumbSpanStart + thumbId + thumbClasses;
          thumbs.push(thumb);
        }

        this._thumbs = $(thumbs.join('')).appendTo(this._sliderContainer); // @HTMLUpdateOK
        this._thumb = this._thumbs.eq(0);

        this._refreshThumbOptions();
      },

      //
      // reapply disabled properties to each slider thumb.
      //
      _refreshThumbOptions: function () {
        var that = this;
        var i = 0;
        this._thumbs.each(function () {
          $(this).data(OJ_SLIDER_THUMB_INDEX, i);
          i += 1;

          if (that._isVertical()) {
            $(this).attr('aria-orientation', 'vertical');
          }

          if (that.options.disabled) {
            $(this).attr('aria-disabled', 'true');
            $(this).removeAttr('tabindex');
          } else {
            $(this).removeAttr('aria-disabled');
            $(this).attr('tabindex', '0');
          }
          // To support read only, we place set title = "read only" on the thumb.
          if (that.options.readOnly) {
            $(this).attr('title', 'read only');
            // $(this).removeAttr("tabindex")
          } else {
            $(this).removeAttr('title');
          }
        });
      },

      //
      // Create a containing div to group all component generated content.
      // This is used in messaging, so that we can apply margins/padding
      // between the inline message div and the pixels that make up the slider.
      //
      _createSliderContainer: function () {
        var sliderWrapperId = this._getSliderWrapperId();
        var existingSliderWrapper = this._elementWrapped.find('#' + sliderWrapperId);

        if (existingSliderWrapper.length) existingSliderWrapper.remove();

        this._sliderContainer = $(EMPTY_DIV);
        $(this._sliderContainer).attr('id', sliderWrapperId);
        this._sliderContainer.addClass('oj-slider-container').addClass('oj-form-control-container');

        this.element.after(this._sliderContainer); // @HTMLUpdateOK

        // copy all style properties from the input tag to the enclosing
        // slider div (sliderWrapper)
        this._sliderContainer[0].style.cssText = this._styleFromInputTag;
      },

      _createBarBackground: function () {
        var barId = this._getBarBackgroundId();

        var existingBarBack = this._elementWrapped.find('#' + barId);

        if (existingBarBack.length) existingBarBack.remove();

        this._barback = $(EMPTY_DIV);

        var classes = 'oj-slider-bar';

        $(this._barback).attr('id', barId);
        this._barback.addClass(classes);

        // Place the background bar element immediately after the hidden input tab.
        this._sliderContainer.append(this._barback); // @HTMLUpdateOK

        //
        // Clicking on the bar repositions the thumb.
        //
        this._barback.on('mousedown' + this.eventNamespace, this._reposition.bind(this));
      },

      _reposition: function (event) {
        this._repositionThumb(event);
        this._mouseStop(event);

        var thumb = this._getActiveThumb();
        thumb.focus();
      },

      //
      // Set the options.value to the correct type, based on whether the slider has
      // been set to a range slider (_multipleThumbs is true), or a single-thumbed slider.
      //
      // Handle cases when the values option was never set, or when the values
      // option was incorrectly set.
      //
      _buildValueOption: function () {
        var options = this.options;
        if (this._isCustomRangeSlider()) {
          if (options.value === null) {
            this.options.value = { start: this._valueMin(), end: this._valueMax() };
          } else {
            if (options.value.start === null || options.value.start === undefined) {
              this.options.value.start = this._valueMin();
            }

            if (options.value.end === null || options.value.end === undefined) {
              this.options.value.end = this._valueMax();
            }

            this.option('value', this.options.value, {
              _context: { writeback: true, internalSet: true }
            });
          }
        } else if (options.type) {
          if (this.options.value == null) {
            //
            // If the value options was never set,
            // then initialize the value using valueMin (for a single-thumbbed slider)
            // or [valueMin, valueMax] (for a two-thumbbed slider).
            //
            if (this._multipleThumbs) {
              this.options.value = [this._valueMin(), this._valueMax()];
            } else {
              this.options.value = this._valueMin();
            }

            this.option('value', this.options.value, {
              _context: { writeback: true, internalSet: true }
            });
          } else if (this._multipleThumbs) {
            if (this.options.value.length !== 2) {
              //
              // Transform to an array of two values if the user did not supply
              // the correct # of array values.
              //
              var firstValue;
              if (this.options.value.length > 0) firstValue = this.options.value[0];
              else firstValue = this._valueMin();

              this.options.value = [firstValue, this._valueMax()];
              this.option('value', this.options.value, {
                _context: { writeback: true, internalSet: true }
              });
            }
          }
        }
      },

      _createRange: function () {
        var options = this.options;
        var classes = '';

        if (options.type) {
          //
          // Define the range (value bar) div
          //
          this._range = $(EMPTY_DIV);
          // Give the bar an id.
          $(this._range).attr('id', this._getBarValueId());

          this._sliderContainer.append(this._range); // @HTMLUpdateOK
          classes = 'oj-slider-range oj-slider-bar-value';

          //
          // Like the bar background, clicking on the bar value also repositions the thumb.
          //

          this._range.on('mousedown' + this.eventNamespace, this._reposition.bind(this));

          this._range = this._sliderContainer.find('#' + this._getBarValueId());

          var newClass = '';
          if (options.type === 'fromMin') newClass = ' oj-slider-range-min';
          else if (options.type === 'fromMax') newClass = ' oj-slider-range-max';

          this._range.addClass(classes + newClass);
        } else {
          if (this._range) {
            this._range.remove();
          }
          this._range = null;
        }
      },

      _setupTouch: function (e) {
        this._touchProxy = oj._TouchProxy.addTouchListeners(e);
      },

      _tearDownTouch: function (e) {
        oj._TouchProxy.removeTouchListeners(e);
      },
      // The resizeObserver listens for when a user resizes the window and recalculates the slider’s
      // width and grid, so that when a user resizes the window, the thumb will still snap to the latest grid, whether
      // in a form-layout or not.
      _registerResizeListener: function (element) {
        this._resizeObserver = new ResizeObserver(this._makeDraggable.bind(this));
        this._resizeObserver.observe(element);
      },

      /**
       * Setup events for slider.
       *
       * @protected
       * @memberof oj.ojSlider
       * @instance
       */
      _setupEvents: function () {
        this._registerResizeListener(this._elementWrapped[0]);
        if (this._CanSetValue()) {
          this._AddHoverable(this._elementWrapped);
        }

        this._thumbs.toArray().forEach(function (current) {
          var thumb = $(current);

          // setup keyboard events on each thumb.
          this._UnregisterChildNode(thumb);
          this._on(thumb, this._thumbEvents);

          // setup touch events on each thumb
          this._setupTouch(thumb);

          // Each thumb can be focusable.
          this._focusable({
            element: thumb,
            applyHighlight: true
          });

          // We should double-check the need for hoverable on thumbs
          // once there is a more consistent cross-component story for hoverable
          // this._hoverable(thumb);
        }, this);
      },

      // This call is necessary in order to implement popup messaging properly.

      /**
       * Returns a jquery object of the launcher element representing the content nodes (slider).
       * @protected
       * @override
       * @memberof oj.ojSlider
       */
      _GetMessagingLauncherElement: function () {
        return this._elementWrapped;
      },

      /**
       * Returns a jquery object of the elements representing the content nodes (slider thumb).
       * @protected
       * @override
       * @memberof oj.ojSlider
       */
      _GetContentElement: function () {
        return this._getActiveThumb();
      },

      //
      // Destroy the slider DOM.
      // This is called both by _destroy and during an option change.
      // During option change, we do not unwrap - since we wish to maintain any
      // divs added for messaging, such as oj-messaging-inline-container.
      //
      _destroySliderDom: function () {
        this._resizeObserver.disconnect();
        // Tear down touch events for each thumb.
        this._thumbs.toArray().forEach(function (current) {
          var thumb = $(current);
          this._tearDownTouch(thumb);
        }, this);

        this._destroyDraggable();

        if (this._range) this._range.remove();
        if (this._sliderContainer) this._sliderContainer.remove();

        if (this.OuterWrapper) {
          this._elementWrapped.removeUniqueId();
          this._RemoveHoverable(this._elementWrapped);
        } else {
          this.element.removeUniqueId();
          this._RemoveHoverable(this.element);
        }
      },

      //
      // Unwrap the slider.
      // This is only called when we completely destroy the slider (_destroy).
      //
      _unwrapSlider: function () {
        DomUtils.unwrap(this.element, this._elementWrapped);
        this.element[0].style.display = this._inputElementOriginalDisplay;
        this._RestoreAttributes(this.element);
      },

      /**
       * Override of protected base class method.
       * Method name needn't be quoted since is in externs.js.
       * @protected
       * @memberof oj.ojSlider
       * @instance
       */
      _destroy: function () {
        this._destroySliderDom();
        this._unwrapSlider();

        return this._super();
      },

      //
      // Called when the user clicks on the bar in order to reposition the thumb.
      // Setup initial positions, distance.
      // The mouse position is used for bar clicks,
      // while the thumb position is used when dragging the thumb.
      //
      // Do not process mouse events if the slider is disabled (or readOnly).
      //
      _repositionThumb: function (event) {
        var position;
        var normValue;
        var distance;
        var o = this.options;
        var index = 0;
        var that = this;

        this._closestThumb = this._thumb;

        if (o.disabled) return false;
        if (o.readOnly) return false;

        //
        // Reposition, since when we clicked on a bar.
        //
        position = { x: event.pageX, y: event.pageY };
        normValue = this._getNormValueFromMouse(position);

        distance = this._valueMax() - this._valueMin() + 1;

        if (this._multipleThumbs) {
          this._thumbs.each(function (i) {
            var thisDistance = Math.abs(normValue - that._getMultiValues(i));
            if (
              distance > thisDistance ||
              (distance === thisDistance &&
                (i === that._lastChangedValueIndex || that._getMultiValues(i) === o.min))
            ) {
              distance = thisDistance;
              this._closestThumb = $(this);
              index = i;
            }
          });
        }

        this._thumbIndex = index;
        if (!this._closestThumb) return true;

        // This call is needed to support 'click-to-reposition' the thumb
        if (!this._thumbs.hasClass('ui-state-hover')) {
          this._slide(event, index, normValue);
        }

        var thumb = this._getActiveThumb();
        thumb.addClass('oj-active').focus();
        // For mobile theming, we need to change the color of the value bar when active.
        this._range.addClass('oj-active');

        return true;
      },

      //
      // Called by draggable start.
      // Ad the oj-active classes, place thumb in focus.
      //
      _initDragging: function (event, thumb) {
        var o = this.options;

        if (o.disabled) return false;
        if (o.readOnly) return false;

        // tabbing could have added oj-focus-highlight to the thumb,
        // if so, remove the class since we are moving the thumb via mouse interaction.
        thumb.removeClass('oj-focus-highlight');
        thumb.addClass('oj-active').focus();
        // For mobile theming, we need to change the color of the value bar when active.
        this._range.addClass('oj-active');

        return true;
      },

      _mouseDragInternal: function (event, thumb) {
        // Mirror the mouse drag with a pct change.

        //
        // Raw value update.
        //
        var normValue = this._getNormValueFromThumb(thumb);
        this._slide(event, this._thumbIndex, normValue, true);

        var pct = this._getFracFromThumb(thumb) * 100;

        if (this._multipleThumbs) {
          this._setRangeMultiThumb(pct, this._thumbIndex);
        } else {
          this._setRange(pct);
        }

        return false;
      },

      _mouseStop: function (event, thumb) {
        this._thumbs.removeClass('oj-active');
        this._range.removeClass('oj-active');

        var normValue = this._getNormValueFromThumb(thumb);
        this._slide(event, this._thumbIndex, normValue);
        // _change is needed for click positioning
        this._change(event, this._thumbIndex, false);

        this._thumbIndex = null;

        return false;
      },

      _isVertical: function () {
        return this.options.orientation === 'vertical';
      },
      //
      // Adjust the fraction for bounds limits and orientation.
      //
      _getOrientationAdjustedFrac: function (frac) {
        var fracReturn = frac;
        if (fracReturn > 1) {
          fracReturn = 1;
        }
        if (fracReturn < 0) {
          fracReturn = 0;
        }
        if (this._isVertical()) {
          fracReturn = 1 - fracReturn;
        }

        return fracReturn;
      },

      //
      // Return a normalized value (trimmed to step increments)
      // based on the passed mouse coordinates.
      //
      _getNormValueFromMouse: function (position) {
        var valueTotal;
        var valueMouse;

        var fracMouse = this._getFracFromMouse(position);

        valueTotal = this._valueMax() - this._valueMin();

        if (this._isRTL() && !this._isVertical()) {
          fracMouse = 1 - fracMouse;
        }

        valueMouse = this._valueMin() + fracMouse * valueTotal;

        return this._trimAlignValue(valueMouse);
      },

      //
      // Return the fraction (between 0 and 1)
      // that represents the bar value.
      // This is based on the mouse position parameter.
      //
      _getFracFromMouse: function (position) {
        var pixelTotal;
        var pixelMouse;
        var fracMouse;

        if (!this._isVertical()) {
          pixelTotal = this._barback.width();
          pixelMouse = position.x - this._barback.offset().left;
        } else {
          pixelTotal = this._barback.height();
          pixelMouse = position.y - this._barback.offset().top;
        }

        if (pixelTotal === 0) return 1;

        fracMouse = pixelMouse / pixelTotal;
        fracMouse = this._getOrientationAdjustedFrac(fracMouse);

        return fracMouse;
      },

      // Return the active thumb
      _getActiveThumb: function () {
        if (this._multipleThumbs) {
          return $(this._thumbs[this._thumbIndex ? this._thumbIndex : 0]);
        }
        return this._thumb;
      },

      //
      // Return the fraction (between 0 and 1)
      // that represents the bar value.
      // This is based on the current position of the thumb.
      //
      _getFracFromThumb: function (thumbParam) {
        var pixelTotal;
        var pixelMouse;
        var fracThumb;

        var thumb = thumbParam;
        if (!thumbParam) {
          thumb = this._getActiveThumb();
        }

        var pos;

        if (!this._isVertical()) {
          var halfThumbWidth = thumb.outerWidth() / 2;
          pos = thumb.offset().left + halfThumbWidth;
          pixelTotal = this._barback.width();
          pixelMouse = pos - this._barback.offset().left;
        } else {
          var halfThumbHeight = thumb.outerHeight() / 2;
          pos = thumb.offset().top + halfThumbHeight;
          pixelTotal = this._barback.height();
          pixelMouse = pos - this._barback.offset().top;
        }

        if (pixelTotal === 0) {
          return 1;
        }

        fracThumb = pixelMouse / pixelTotal;

        fracThumb = this._getOrientationAdjustedFrac(fracThumb);

        return fracThumb;
      },

      _getNormValueFromThumb: function (thumb) {
        var fracThumb;
        var valueTotal;
        var valueMouse;

        fracThumb = this._getFracFromThumb(thumb);

        valueTotal = this._valueMax() - this._valueMin();

        if (this._isRTL() && !this._isVertical()) {
          fracThumb = 1 - fracThumb;
        }

        valueMouse = this._valueMin() + fracThumb * valueTotal;

        return this._trimAlignValue(valueMouse);
      },

      // Return the value for the inactive thumb.
      _getOtherThumbValue: function (index) {
        return this._getMultiValues(index ? 0 : 1);
      },

      //
      // Return the new value, limited by the value of the other thumb.
      // (We ensure that we do not go past the value of the other thumb).
      //
      _getNewThumbValueLimited: function (index, newVal, otherVal) {
        var returnVal;
        if (this._isCustomRangeSlider()) {
          if (
            this.options.value.start !== null &&
            this.options.value.end !== null &&
            ((index === 0 && newVal > otherVal) || (index === 1 && newVal < otherVal))
          ) {
            returnVal = otherVal;
          } else {
            returnVal = newVal;
          }
        } else if (
          this.options.value.length === 2 &&
          ((index === 0 && newVal > otherVal) || (index === 1 && newVal < otherVal))
        ) {
          returnVal = otherVal;
        } else {
          returnVal = newVal;
        }
        return returnVal;
      },

      _slide: function (event, index, newValParam, rawOnly) {
        var otherVal;

        if (this._multipleThumbs) {
          otherVal = this._getOtherThumbValue(index);
          var newVal = this._getNewThumbValueLimited(index, newValParam, otherVal);
          this._setMultiValue(event, index, newVal, rawOnly);
        } else {
          // This case handles a single value
          // sets slider thumb value
          this._setSingleValue(event, newValParam, rawOnly);

          if (!rawOnly) {
            if (this._inputtag) {
              this.element.val(newValParam);
            }
          }
        }
      },

      _setSingleValue: function (event, newValue, rawOnly) {
        this._newValue = this._trimAlignValue(newValue);
        this._SetRawValue(this._newValue, event);
        if (!rawOnly) {
          this.options[this._transientValueName] = this._newValue;
          this._SetValue(this._newValue, event);
          this._updateUI();
        }
      },

      _change: function (event, index, rawOnly) {
        if (this._multipleThumbs) {
          // store the last change values for creating draggable containment
          this._lastChangedValues = this._getNewValues(index, this._newMultiValue[index]);
          this._SetRawValue(this._lastChangedValues, event);
          if (!rawOnly) {
            this._SetValue(this._lastChangedValues, event);
          }
        } else {
          this._SetRawValue(this._newValue, event);
          if (!rawOnly) {
            this._SetValue(this._newValue, event);
          }
        }

        // store the last changed value index for reference when thumbs overlap
        this._lastChangedValueIndex = index;
      },

      //
      // Return options.values with the new value copied in the array
      // Used to format the values argument to SetValue (for the case of multiple thumbs)
      //
      _getNewValues: function (index, newValue) {
        var vals;
        if (this._isCustomRangeSlider()) {
          vals = {};
          vals.start = this._trimAlignValue(this.options.value.start);
          vals.end = this._trimAlignValue(this.options.value.end);
          if (index === this._thumbIndex) {
            if (index === 0) {
              vals.start = newValue;
            }
            if (index === 1) {
              vals.end = newValue;
            }
          }
        } else {
          var i;
          vals = this.options.value.slice();
          for (i = 0; i < vals.length; i++) {
            vals[i] = this._trimAlignValue(vals[i]);
          }
          // assume newValue is trim aligned
          // Assign only if it is the thumb that is actually sliding
          if (index === this._thumbIndex) {
            vals[index] = newValue;
          }
        }
        return vals;
      },

      //
      // Return the value of a single thumbbed slider.
      //
      _getSingleValue: function () {
        return this._getValueAligned();
      },

      //
      // Return the value for the specified thumb.
      //
      _getMultiValues: function (index) {
        //
        // Parameter index is supplied.
        // Return the value for the specified thumb.
        //
        return this._getValuesAligned(index);
      },

      //
      // Internal setter for slider values.
      // Sets the value for the specifed thumb.
      // (index 0 is used for a single thumb,
      // for a range slider index 0 and index 1 are used).
      //
      _setMultiValue: function (event, index, newValue, rawOnly) {
        this._newMultiValue[index] = this._trimAlignValue(newValue);
        this._change(event, index, rawOnly);
        if (!rawOnly) this._updateUI();
      },

      _setOption: function (key, value, flags) {
        var coercedValue;

        if (key === 'value') {
          if (this._isCustomRangeSlider()) {
            if (value instanceof Object) {
              this._checkStartEnd(value.start, value.end);
              if (!isNaN(value.start)) {
                this._multipleThumbs = true;
                coercedValue = value;
                var keys = Object.keys(value);
                // verify that the values are all within range.
                for (var j = 0; j < keys.length; j++) {
                  this._checkValueBounds(coercedValue[keys[j]], this._valueMin(), this._valueMax());
                }
              } else {
                //
                // Don't set multipleThumbs if the value is not a number
                // (as would be the case for an error code)
                //
                coercedValue = this._parse(key, value.start);
                // verify that the new value is within range.
                this._checkValueBounds(coercedValue, this._valueMin(), this._valueMax());
              }
            } else {
              // Only coerce values for widget syntax,
              coercedValue = { start: this._valueMin(), end: this._valueMax() };
              this.options.value = { start: this._valueMin(), end: this._valueMax() };
              // verify that the new value is within range.
              // this._checkValueBounds(coercedValue, this._valueMin(), this._valueMax());
              var coercedValueKeys = Object.keys(coercedValue);
              // verify that the values are all within range.
              for (var index = 0; index < coercedValueKeys.length; index++) {
                this._checkValueBounds(
                  coercedValue[coercedValueKeys[index]],
                  this._valueMin(),
                  this._valueMax()
                );
              }
            }
          } else if (Array.isArray(value)) {
            if (!isNaN(value[0])) {
              this._multipleThumbs = true;
              coercedValue = value;
              // verify that the array values are all within range.
              for (var i = 0; i < coercedValue.length; i++) {
                this._checkValueBounds(coercedValue[i], this._valueMin(), this._valueMax());
              }
            } else {
              //
              // Don't set multipleThumbs if the value is not a number
              // (as would be the case for an error code)
              //
              this._multipleThumbs = false;
              coercedValue = this._parse(key, value[0]);
              // verify that the new value is within range.
              this._checkValueBounds(coercedValue, this._valueMin(), this._valueMax());
            }
          } else {
            this._multipleThumbs = false;
            // Only coerce values for widget syntax,
            if (!this._IsCustomElement()) {
              coercedValue = this._parse(key, value);
            } else {
              coercedValue = value;
            }
            // verify that the new value is within range.
            this._checkValueBounds(coercedValue, this._valueMin(), this._valueMax());
          }
        } else if (key === 'max' || key === 'min') {
          // Only coerce values for widget syntax,
          // since the framework handles this for custom elements.
          if (!this._IsCustomElement()) {
            coercedValue = this._parse(key, value);
          } else {
            coercedValue = value;
          }

          //
          // Note that coerce the value to be within the
          // min and max when we option change the min or max.
          //

          if (key === 'min') {
            this._checkMinMax(coercedValue, this._valueMax());
            // Coerce any out of bounds "value" attributes to be within the min bounds
            if (!this._multipleThumbs) {
              if (this._getSingleValue() < coercedValue) {
                this._super('value', coercedValue, flags);
              }
            } else {
              if (this._getMultiValues(0) < coercedValue) {
                if (this._isCustomRangeSlider()) {
                  this._super('value', { start: coercedValue, end: this._getMultiValues(1) }, flags);
                } else {
                  this._super('value', [coercedValue, this._getMultiValues(1)], flags);
                }
              }
              if (this._getMultiValues(1) < coercedValue) {
                if (this._isCustomRangeSlider()) {
                  this._super('value', { start: this._getMultiValues(0), end: coercedValue }, flags);
                } else {
                  this._super('value', [this._getMultiValues(0), coercedValue], flags);
                }
              }
            }
          } else if (key === 'max') {
            this._checkMinMax(this._valueMin(), coercedValue);
            // Coerce any out of bounds "value" attributes to be within the max bounds
            if (!this._multipleThumbs) {
              if (this._getSingleValue() > coercedValue) {
                this._super('value', coercedValue, flags);
              }
            } else {
              if (this._getMultiValues(0) > coercedValue) {
                if (this._isCustomRangeSlider()) {
                  this._super('value', { start: coercedValue, end: this._getMultiValues(1) }, flags);
                } else {
                  this._super('value', [coercedValue, this._getMultiValues(1)], flags);
                }
              }
              if (this._getMultiValues(1) > coercedValue) {
                if (this._isCustomRangeSlider()) {
                  this._super('value', { start: this._getMultiValues(0), end: coercedValue }, flags);
                } else {
                  this._super('value', [this._getMultiValues(0), coercedValue], flags);
                }
              }
            }
          }
        } else if (key === 'step') {
          coercedValue = this._parseStep(value);
        } else {
          coercedValue = value;
        }

        this._super(key, coercedValue, flags);
        // when a dom element supports readonly, use that, and not aria-readonly.
        // having both is an error

        // Note - for now, readOnly is private.
        if (key === 'readOnly') {
          this.options.readonly = coercedValue;
        }
        if (key === 'disabled') {
          this.options.disabled = coercedValue;
        }

        switch (key) {
          case 'disabled':
            this._refreshThumbOptions();
            // disable the dragging if disabled is true.
            if (this.options.disabled) {
              this._disableDraggable();
            } else {
              this._makeDraggable();
            }
            break;

          case 'value':
            this._updateUI();
            this._makeDraggable();
            break;

          case 'min':
          case 'max':
            this._calculateNewMax();
            this._updateUI();
            this._makeDraggable();
            break;

          case 'orientation':
            this._setOrientationStyles();
            this._reCreate();
            break;
          case 'readonly':
          case 'step':
          case 'type':
            this._reCreate();
            break;
          case 'labelledBy':
            this._setAriaInfo();
            break;
          default:
            break;
        }
      },

      //
      // Recreate the slider.
      // Destroy's everything except the wrapper.
      // Called after optionChange.
      //
      _reCreate: function () {
        this._destroySliderDom();
        this._componentSetup();
        if (this.OuterWrapper) {
          // When we programmatically recreate a custom element slider
          // (in order to implemement option change), we assert oj-complete.
          this._elementWrapped.addClass('oj-complete');
        }
        this._AfterCreate();
      },

      // internal value getter
      // _getValueAligned() returns value trimmed by min and max, aligned by step
      _getValueAligned: function () {
        var val = this.options.value;
        val = this._trimAlignValue(val);

        return val;
      },

      _isCustomRangeSlider: function () {
        if (this._IsCustomElement()) {
          var rootElem = this.element[0].parentNode;
          if (rootElem.tagName === 'OJ-RANGE-SLIDER') {
            return true;
          }
        }
        return false;
      },

      //
      // Internal values getter
      //
      // _getValuesAligned() returns array of values trimmed by min and max, aligned by step
      // _getValuesAligned( index ) returns single value trimmed by min and max, aligned by step
      //
      _getValuesAligned: function (index) {
        var result = null;
        if (this._isCustomRangeSlider()) {
          var val;
          if (index === 0) {
            if (this.options.value.start !== undefined && this.options.value.start !== null) {
              val = this.options.value.start;
            } else {
              val = this._valueMin();
            }
          } else if (this.options.value.end !== undefined && this.options.value.end !== null) {
            val = this.options.value.end;
          } else {
            val = this._valueMax();
          }
          result = this._trimAlignValue(val);
        } else {
          result = this._trimAlignValue(this.options.value[index]);
        }
        return result;
      },

      //
      // Return the step-aligned value that val is closest to, between (inclusive) min and max
      //
      _trimAlignValue: function (val) {
        if (val <= this._valueMin()) {
          return this._valueMin();
        }
        if (val >= this._valueMax()) {
          return this._valueMax();
        }
        var step = this.options.step > 0 ? this.options.step : 1;
        var valModStep = (val - this._valueMin()) % step;
        var alignValue = val - valModStep;

        if (Math.abs(valModStep) * 2 >= step) {
          alignValue += valModStep > 0 ? step : -step;
        }

        // Since JavaScript has problems with large floats, round
        // the final value to 5 digits after the decimal point (see #4124)
        return parseFloat(alignValue.toFixed(5));
      },

      _calculateNewMax: function () {
        var min = this._valueMin();
        if (((this.options.max - min) / this.options.step) % 1 !== 0) {
          var remainder = (this.options.max - min) % this.options.step;
          this.max = this.options.max - remainder + this.options.step;
        } else {
          this.max = this.options.max;
        }
      },

      _valueMin: function () {
        return this.options.min;
      },

      _valueMax: function () {
        return this.max;
      },

      //
      // Calculate the grid size passed to draggable.
      // This implements the drag to step increments.
      // For a horizontal grid, we would return an array of [pixelInterval, 1],
      // while a vertical grid returns [1, pixelInterval].
      //
      _getGrid: function () {
        var numIntervals;
        if (this.options.step > 0) {
          numIntervals = (this._valueMax() - this._valueMin()) / this.options.step;
        } else {
          numIntervals = 100; // this case should not occur.
        }

        var pixelTotal;

        if (!this._isVertical()) {
          pixelTotal = this._barback.width();
        } else {
          pixelTotal = this._barback.height();
        }

        var pixelInterval = pixelTotal / numIntervals;

        if (pixelInterval < 1) pixelInterval = 1;

        if (!this._isVertical()) {
          return [pixelInterval, 1];
        }
        return [1, pixelInterval];
      },

      _getThumbsValueFrac: function (index) {
        return (
          (this._getMultiValues(index) - this._valueMin()) / (this._valueMax() - this._valueMin())
        );
        // Note - (max - min) is checked in options to make sure that
        // it is non-zero and positive
        // Note - we always use aligned values.
      },

      //
      // Update the UI, reflecting the value.
      //
      _updateUI: function () {
        var valPercent;
        var value;
        var valueMin;
        var valueMax;

        var startThumb;
        var endThumb;

        //
        // Multiple thumbs case.
        //
        if (this._multipleThumbs) {
          this._thumbs.toArray().forEach(function (current, i) {
            var thumb = $(current);
            valPercent = this._getThumbsValueFrac(i) * 100;

            if (this._isRTL() && !this._isVertical()) {
              valPercent = 100 - valPercent;
            }

            if (!this._isVertical()) {
              thumb.css({ left: valPercent + '%' });
            } else {
              thumb.css({ top: 100 - valPercent + '%' });
            }

            if (i === 0) {
              startThumb = thumb;
              // if the min thumb is at the max, set its zindex to 1
              if (valPercent === 100) {
                thumb.css({ zIndex: 1 });
              } else {
                thumb.css({ zIndex: '' });
              }
            } else {
              endThumb = thumb;
            }

            if (!thumb.hasClass('oj-active')) {
              thumb.attr('aria-valuenow', this._getMultiValues(i));
              thumb.attr('aria-valuemin', valueMin);
              thumb.attr('aria-valuemax', valueMax);
            }
            this._setRangeMultiThumb(valPercent, i);
          }, this);
          if (startThumb.hasClass('oj-focus')) {
            startThumb.css({ zIndex: 1 });
            endThumb.css({ zIndex: '' });
          }

          if (endThumb.hasClass('oj-focus')) {
            startThumb.css({ zIndex: '' });
            endThumb.css({ zIndex: 1 });
          }
        } else {
          //
          // Scalar value (single thumb)
          //

          // We always want an aligned value here.
          value = this._getValueAligned();

          valueMin = this._valueMin();
          valueMax = this._valueMax();
          valPercent = valueMax !== valueMin ? ((value - valueMin) / (valueMax - valueMin)) * 100 : 0;

          if (this._isRTL() && !this._isVertical()) valPercent = 100 - valPercent;

          if (!this._isVertical()) {
            this._thumb.css({ left: valPercent + '%' });
          } else {
            this._thumb.css({ top: 100 - valPercent + '%' });
          }

          //
          // note - we don't want to continuously update aria values,
          // otherwise it causes unwanted screen reader chatter.
          // see .
          //
          if (!$(this._thumb).hasClass('oj-active')) {
            $(this._thumb).attr('aria-valuenow', value);
            $(this._thumb).attr('aria-valuemin', valueMin);
            $(this._thumb).attr('aria-valuemax', valueMax);
          }
          this._setRange(valPercent);
        }
      },

      // Set the range (bar value)
      _setRange: function (val) {
        var oRange = this.options.type;

        if (!this._isVertical()) {
          if (!this._isRTL()) {
            if (oRange === 'fromMin') {
              this._range.css({ width: val + '%' });
            }
            if (oRange === 'fromMax') {
              this._range.css({ width: 100 - val + '%' });
            }
          } else {
            if (oRange === 'fromMin') {
              this._range.css({ width: 100 - val + '%' });
            }
            if (oRange === 'fromMax') {
              this._range.css({ width: val + '%' });
            }
          }
        } else {
          if (oRange === 'fromMin') {
            this._range.css({ height: val + '%' });
          }
          if (oRange === 'fromMax') {
            this._range.css({ height: 100 - val + '%' });
          }
        }
      },

      //
      // set the range for a multi-thumb (range) slider
      //
      _setRangeMultiThumb: function (val, index) {
        var id = this._range.attr('id');

        if (index === 0) {
          var thumb1Pct = this._getThumbsValueFrac(1) * 100;

          switch (this.options.type) {
            case 'fromMin':
              if (!this._isVertical()) {
                this._range.css({ width: val + '%' });
              } else {
                this._range.css({ height: val + '%' });
              }
              break;

            case 'range':
              if (!this._isVertical()) {
                if (!this._isRTL()) {
                  this._range.css({ left: val + '%' });
                  this._range.css({ width: thumb1Pct - val + '%' });
                } else {
                  this._range.css({ left: 100 - thumb1Pct + '%' });
                  this._range.css({ width: thumb1Pct - (100 - val) + '%' });
                }
              } else {
                this._range.css({ top: 100 - thumb1Pct + '%' });
                this._range.css({ height: thumb1Pct - val + '%' });
              }
              break;

            default:
              break;
          }
        } else {
          var thumb0Pct = this._getThumbsValueFrac(0) * 100;

          switch (this.options.type) {
            case 'fromMax':
              if (!this._isVertical()) {
                this._range.css({ width: 100 - val + '%' });
              } else {
                this._range.css({ height: 100 - val + '%' });
              }
              break;

            case 'range':
              if (!this._isVertical()) {
                if (!this._isRTL()) {
                  if (document.getElementById(id)) {
                    var barLeft = parseInt(document.getElementById(id).style.left, 10);
                    this._range.css({ width: val - barLeft + '%' });
                  }
                } else if (document.getElementById(id)) {
                  this._range.css({ left: val + '%' });
                  this._range.css({ width: -val + 100 - thumb0Pct + '%' });
                }
              } else if (document.getElementById(id)) {
                this._range.css({ top: 100 - val + '%' });
                this._range.css({ height: val - thumb0Pct + '%' });
              }

              break;
            default:
              break;
          }
        }
      },

      _thumbEvents: {
        keydown: function (event) {
          var curVal;
          var newVal;
          var step;
          var tempVal;
          var index = $(event.target).data(OJ_SLIDER_THUMB_INDEX);

          this._thumbIndex = index;

          switch (event.keyCode) {
            case $.ui.keyCode.HOME:
            case $.ui.keyCode.END:
            case $.ui.keyCode.PAGE_UP:
            case $.ui.keyCode.PAGE_DOWN:
            case $.ui.keyCode.UP:
            case $.ui.keyCode.RIGHT:
            case $.ui.keyCode.DOWN:
            case $.ui.keyCode.LEFT:
              event.preventDefault();
              //
              // Note - while tabbing into the thumb will retain focus,
              // when clicking on the thumb we do not need to call focus()
              // (per Max's review)
              //
              $(event.target).addClass('oj-active');
              break;
            default:
              break;
          }

          step = this.options.step;

          if (this._multipleThumbs) {
            newVal = this._getMultiValues(index);
          } else {
            newVal = this._getSingleValue();
          }
          curVal = newVal;

          switch (event.keyCode) {
            case $.ui.keyCode.HOME:
              newVal = this._valueMin();
              break;
            case $.ui.keyCode.END:
              newVal = this._valueMax();
              break;
            case $.ui.keyCode.PAGE_UP:
              newVal = this._trimAlignValue(
                curVal + (this._valueMax() - this._valueMin()) / this._numPages
              );
              break;
            case $.ui.keyCode.PAGE_DOWN:
              newVal = this._trimAlignValue(
                curVal - (this._valueMax() - this._valueMin()) / this._numPages
              );
              break;

            case $.ui.keyCode.UP:
              // upArrow always increments the value
              if (curVal === this._valueMax()) return;
              tempVal = curVal + step;
              newVal = this._trimAlignValue(tempVal);
              break;

            case $.ui.keyCode.RIGHT:
              if (!this._isRTL() || this._isVertical()) {
                if (curVal === this._valueMax()) return;
                tempVal = curVal + step;
              } else {
                if (curVal === this._valueMin()) return;
                tempVal = curVal - step;
              }

              newVal = this._trimAlignValue(tempVal);
              break;

            case $.ui.keyCode.DOWN:
              // Down arrow always decrements the value.
              if (curVal === this._valueMin()) return;
              tempVal = curVal - step;
              newVal = this._trimAlignValue(tempVal);

              break;

            case $.ui.keyCode.LEFT:
              if (!this._isRTL() || this._isVertical()) {
                if (curVal === this._valueMin()) return;
                tempVal = curVal - step;
              } else {
                if (curVal === this._valueMax()) return;
                tempVal = curVal + step;
              }

              newVal = this._trimAlignValue(tempVal);
              break;
            default:
              break;
          }

          this._slide(event, index, newVal);
        },

        keyup: function (event) {
          switch (event.keyCode) {
            case $.ui.keyCode.HOME:
            case $.ui.keyCode.END:
            case $.ui.keyCode.PAGE_UP:
            case $.ui.keyCode.PAGE_DOWN:
            case $.ui.keyCode.UP:
            case $.ui.keyCode.RIGHT:
            case $.ui.keyCode.DOWN:
            case $.ui.keyCode.LEFT:
              var index = $(event.target).data(OJ_SLIDER_THUMB_INDEX);
              this._thumbIndex = index;

              this._change(event, index, false);

              $(event.target).removeClass('oj-active');
              this._updateUI(true);

              this._thumbIndex = null;
              break;
            default:
              break;
          }
        }
      },

      // P R O T E C T E D    C O N S T A N T S   A N D   M E T H O D S

      // ***** START WIDGET FACTORY METHODS (they retain _camelcase naming convention) ******

      /**
       * Called at component create time primarily to initialize options, often using DOM values.
       * This method is called before _ComponentCreate is called, so components that override this
       * method should be aware that the component has not been rendered yet. The element DOM is
       * available and can be relied on to retrieve any default values. <p>
       * @param {!Object} originalDefaults - original default options defined on the widget and
       * its ancestors.
       * @param {?Object} constructorOptions - options passed into the widget constructor
       *
       * @memberof oj.ojSlider
       * @instance
       * @protected
       */
      _InitOptions: function (originalDefaults, constructorOptions) {
        var opts = this.options;
        var self = this;

        this._superApply(arguments);
        var props = [
          { attribute: 'disabled', validateOption: true },
          //                 {attribute: "placeholder"},
          { attribute: 'value' },

          //
          // Once slider supports read-only, uncomment the following line.
          // {attribute: "readonly", option: "readOnly", validateOption: true},
          //

          { attribute: 'title' },
          { attribute: 'min' },
          { attribute: 'max' },
          { attribute: 'step' }
        ];

        if (!this._IsCustomElement()) {
          ojeditablevalue.EditableValueUtils.initializeOptionsFromDom(
            props,
            constructorOptions,
            this,
            // post-process callback
            function (_initializedOptions) {
              var initializedOptions = _initializedOptions;
              // coerce regardless of where the option value came from - dom/constructor
              var toParse = ['value', 'step', 'min', 'max'];

              for (var i = 0; i < toParse.length; i++) {
                var opt = toParse[i];
                var value = opt in initializedOptions ? initializedOptions[opt] : opts[opt];
                if (value != null) {
                  if (opt === 'step') {
                    initializedOptions[opt] = self._parseStep(value);
                  } else if (opt === 'min' || opt === 'max') {
                    initializedOptions[opt] = self._parse(opt, value);
                  } else if (opt === 'value') {
                    if (Array.isArray(value)) {
                      initializedOptions[opt] = value;
                    } else {
                      initializedOptions[opt] = self._parse(opt, value);
                    }
                  }
                }
              }
            }
          );
          if (opts.value === undefined) {
            throw new Error(this.getTranslatedString('noValue'));
          }
        }
        if (this._isCustomRangeSlider()) {
          this._checkStartEnd(opts.value.start, opts.value.end);
        }
        this._checkMinMax(opts.min, opts.max);

        // Make sure value is within min and max
        if (Array.isArray(opts.value)) {
          for (var index = 0; index < opts.value.length; index += 1) {
            this._checkValueBounds(opts.value[index], opts.min, opts.max);
          }
        } else {
          this._checkValueBounds(opts.value, opts.min, opts.max);
        }
      },

      // function that will throw an error if the value is not between min and max
      _checkValueBounds: function (value, min, max) {
        if (min != null) {
          if (value < min) {
            throw new Error(this.getTranslatedString('valueRange'));
          }
        }
        if (max != null) {
          if (value > max) {
            throw new Error(this.getTranslatedString('valueRange'));
          }
        }
      },

      // throw an error if min >= max
      _checkMinMax: function (min, max) {
        if (min != null && max != null) {
          if (min >= max) {
            throw new Error(this.getTranslatedString('maxMin'));
          }
        }
      },

      // throw an error if value.start > value.end
      _checkStartEnd: function (start, end) {
        if (start != null && end != null) {
          if (start > end) {
            throw new Error(this.getTranslatedString('startEnd'));
          }
        }
      },

      // @inheritdoc
      getNodeBySubId: function (locator) {
        if (locator == null) {
          return this.element ? this.element[0] : null;
        }

        var subId = locator.subId;

        if (subId === 'oj-slider-thumb-0') {
          return this.widget().find(OJ_SLIDER_THUMB)[0];
        } else if (subId === 'oj-slider-thumb-1') {
          return this.widget().find(OJ_SLIDER_THUMB)[1];
        } else if (subId === OJ_SLIDER_BAR) {
          return this.widget().find('.' + subId)[0];
        } else if (subId === OJ_SLIDER_BAR_VALUE) {
          return this.widget().find('.' + subId)[0];
        }

        // Non-null locators have to be handled by the component subclasses
        return null;
      },

      // @inheritdoc
      getSubIdByNode: function (node) {
        if (node != null) {
          if (node.id === this._getThumbId(0) && $(node).hasClass('oj-slider-thumb')) {
            return { subId: 'oj-slider-thumb-0' };
          } else if (node.id === this._getThumbId(1) && $(node).hasClass('oj-slider-thumb')) {
            return { subId: 'oj-slider-thumb-1' };
          } else if ($(node).hasClass(OJ_SLIDER_BAR)) {
            return { subId: OJ_SLIDER_BAR };
          } else if ($(node).hasClass(OJ_SLIDER_BAR_VALUE)) {
            return { subId: OJ_SLIDER_BAR_VALUE };
          }
        }

        return null;
      },

      // *********** END WIDGET FACTORY METHODS **********

      /**
       * Returns the default styleclass for the component.
       *
       * @return {string}
       * @memberof oj.ojSlider
       * @override
       * @protected
       */
      _GetDefaultStyleClass: function () {
        return 'oj-slider';
      },

      // The user can clear out min/max by setting the option to null, so we
      // do not coerce null.
      /**
       * @param {string} option name of the option. this will show up in the error if thrown
       * @param val value to parse
       * @throws {Error} if option value is invalid
       * @private
       */
      _parse: function (option, val) {
        var returnValue;
        if (val !== null) {
          returnValue = +val;
        } else {
          returnValue = val;
        }

        if (isNaN(returnValue)) {
          throw new Error(this.getTranslatedString('optionNum', { option: option }));
        }

        return returnValue;
      },
      /**
       * parse the step's value
       * We are following the behavior of HTML-5 the best we can. According
       * to the spec, it says step must be a number greater than 0.
       * Chrome defaults it to 1 if it is not.
       * @throws {Error} if option value is invalid
       * @private
       */
      _parseStep: function (val) {
        var defaultStep = 1;
        var parsedStep;
        if (val === null) {
          return defaultStep;
        }
        parsedStep = this._parse('step', val);
        if (parsedStep <= 0) {
          // throw an exception
          throw new Error(this.getTranslatedString('invalidStep'));
        }
        // DEFAULT to 1 if it isn't > 0
        if (parsedStep === null || parsedStep <= 0) {
          parsedStep = defaultStep;
        }
        return parsedStep;
      },

      // ///////////////////////////////////////////////////////////////////////////////////////
      //
      // Draggable - used to implement slider thumb dragging
      //
      // JQueryUI draggable is used to implement the dragging of slider thumbs.
      // Several draggable options are used:
      //
      // - Axis constaint
      //   The thumb is constrained to movement along the x-axis (for horizontal sliders)
      //   or movement along the y-axis (for vertical siders)
      //
      // - Range constraints
      //   The thumb is constrained to ranges along the axis using the draggable constraint
      //   option.
      //
      // - Step
      //   The granularity of movement is constrained to the step size using the grid
      //   option.
      //
      // ///////////////////////////////////////////////////////////////////////////////////////

      // return the endpoint of the bar
      _getEndInterval: function () {
        return this._barback.offset().left + this._barback.width();
      },

      // return the startpoint of the bar
      _getStartInterval: function () {
        return this._barback.offset().left;
      },

      //
      // Set up the draggable with the context, thumb, and containment parameters.
      // Use the axis method to ensure only horizontal or vertical movement.
      //
      _callDraggable: function (thumbParam) {
        var g = this._getGrid();
        var cachedStyle = thumbParam[0].style;

        var axisValue;
        if (!this._isVertical()) axisValue = 'x';
        else axisValue = 'y';

        var that = this;

        thumbParam.draggable({
          axis: axisValue,
          // grid: [8.8,1],
          grid: g,
          disabled: false,
          start: function (event) {
            //
            // Set current thumb
            //

            if (thumbParam[0] === $(that._thumbs)[0]) {
              that._thumbIndex = 0;
            } else if (thumbParam[0] === $(that._thumbs)[1]) {
              that._thumbIndex = 1;
            }

            that._initDragging(event, thumbParam);
          },

          drag: function (event, ui) {
            //
            // Compensate for a draggable bug.
            // The bug causes the thumb to drift off axis (for some .css thumb sizes).
            // The workaround address the problem by:
            //   When the thumb travels along the x-axis (horizontal slider),
            //   null out modifications made to top.
            // Handle this issue similarly for vertical sliders.
            //
            var pos = ui.position;

            if (!that._isVertical()) {
              cachedStyle.top = '';
              pos.top = '';
            } else {
              cachedStyle.left = '';
              pos.left = '';
            }

            that._mouseDragInternal(event, thumbParam);

            //
            // Enforce constraints (don't allow sliding past the end)
            //
            if (!that._isVertical()) {
              if (pos.left < 0) {
                pos.left = 0;
              }
              if (pos.left > that._barback.width()) {
                pos.left = that._barback.width();
              }
            } else {
              if (pos.top < 0) {
                pos.top = 0;
              }
              if (pos.top > that._barback.height()) {
                pos.top = that._barback.height();
              }
            }

            //
            // For range sliders, ensure that thumbs do not cross.
            //
            if (that._multipleThumbs) {
              var otherThumb;

              if (that._thumbIndex === 0) {
                otherThumb = $(that._thumbs[1]);
              } else {
                otherThumb = $(that._thumbs[0]);
              }

              //
              // parentLeft ensures that the offsets are calculated properly
              // for a slider embedded in a repositioned container (popup or dialog)
              //
              var pos2;
              if (!that._isVertical()) {
                var halfThumbWidth = thumbParam.outerWidth() / 2;
                var parentLeft = that._barback.offsetParent().offset().left;
                pos2 = otherThumb.offset().left + halfThumbWidth - parentLeft;
              } else {
                var halfThumbHeight = thumbParam.outerHeight() / 2;
                var parentTop = that._barback.offsetParent().offset().top;
                pos2 = otherThumb.offset().top + halfThumbHeight - parentTop;
              }

              if (that._thumbIndex === 0) {
                if (!that._isVertical()) {
                  if (!that._isRTL()) {
                    if (pos.left > pos2) pos.left = pos2;
                  } else if (pos.left < pos2) pos.left = pos2;
                } else if (pos.top < pos2) pos.top = pos2;
              } else if (!that._isVertical()) {
                if (!that._isRTL()) {
                  if (pos.left < pos2) pos.left = pos2;
                } else if (pos.left > pos2) pos.left = pos2;
              } else if (pos.top > pos2) pos.top = pos2;
            }
          },

          stop: function (event) {
            //
            // compensate for a firefox draggable bug.
            // without this code, thumbs with larger active sizes become oval on stop.
            //
            this.style.width = '';
            this.style.height = '';

            that._mouseStop(event, thumbParam);
          }
        });
      },

      //
      // Setup the draggable for each of the thumbs.
      //
      _makeDraggable: function () {
        // Do not allow dragging on a disabled thumb.
        if (this.options.disabled) return;

        if (this._multipleThumbs) {
          this._thumbs.toArray().forEach(function (current) {
            var thumb = $(current);
            this._callDraggable(thumb);
          }, this);
        } else {
          this._callDraggable(this._thumb);
        }
      },

      //
      // Call this if we change option to disabled.
      //
      _disableDraggable: function () {
        if (this._multipleThumbs) {
          this._thumbs.toArray().forEach(function (current) {
            var thumb = $(current);
            if (thumb.is(UI_DRAGGABLE)) {
              thumb.draggable('disable');
            }
          }, this);
        } else if (this._thumb.is(UI_DRAGGABLE)) {
          this._thumb.draggable('disable');
        }
      },

      //
      // Destroy the draggable that was instantiated on each slider thumb.
      //
      _destroyDraggable: function () {
        if (this._multipleThumbs) {
          this._thumbs.toArray().forEach(function (current) {
            var thumb = $(current);
            if (thumb.is(UI_DRAGGABLE)) {
              thumb.draggable('destroy');
            }
          }, this);
        } else if (this._thumb.is(UI_DRAGGABLE)) {
          this._thumb.draggable('destroy');
        }
      }

      // ///////////////////////////////////////////////////////////////////////////////////////
      // Draggable - end
      // ///////////////////////////////////////////////////////////////////////////////////////
    });
  })();

});
