/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcontext', 'ojs/ojthemeutils', 'ojs/ojtranslation', 'knockout', 'ojs/ojcomposite', 'ojs/ojcomponentcore', 'ojs/ojanimation', 'ojs/ojlogger', 'ojs/ojknockout', 
        'ojs/ojpopupcore', 'ojs/ojmessage', 'ojs/ojdataprovider'], 
function(oj, $, Context, ThemeUtils, Translations, ko, Composite, Components, AnimationUtils, Logger)
{
  "use strict";
var __oj_messages_metadata = 
{
  "properties": {
    "display": {
      "type": "string",
      "enumValues": [
        "general",
        "notification"
      ],
      "value": "general"
    },
    "displayOptions": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "enumValues": [
            "auto",
            "header",
            "none"
          ],
          "value": "auto"
        }
      }
    },
    "messages": {
      "type": "Array<Object>|object"
    },
    "position": {
      "type": "object",
      "properties": {
        "at": {
          "type": "object",
          "properties": {
            "horizontal": {
              "type": "string",
              "enumValues": [
                "center",
                "end",
                "left",
                "right",
                "start"
              ]
            },
            "vertical": {
              "type": "string",
              "enumValues": [
                "bottom",
                "center",
                "top"
              ]
            }
          }
        },
        "collision": {
          "type": "string",
          "enumValues": [
            "fit",
            "flip",
            "flipfit",
            "none"
          ]
        },
        "my": {
          "type": "object",
          "properties": {
            "horizontal": {
              "type": "string",
              "enumValues": [
                "center",
                "end",
                "left",
                "right",
                "start"
              ]
            },
            "vertical": {
              "type": "string",
              "enumValues": [
                "bottom",
                "center",
                "top"
              ]
            }
          }
        },
        "of": {
          "type": "string"
        },
        "offset": {
          "type": "object",
          "properties": {
            "x": {
              "type": "number"
            },
            "y": {
              "type": "number"
            }
          }
        }
      }
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "ariaLiveRegion": {
          "type": "object",
          "properties": {
            "navigationFromKeyboard": {
              "type": "string"
            },
            "navigationToKeyboard": {
              "type": "string"
            },
            "navigationToTouch": {
              "type": "string"
            },
            "newMessage": {
              "type": "string"
            }
          }
        },
        "labelLandmark": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "close": {},
    "closeAll": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
/* jslint browser: true*/


/* global ko:false, Components:false, Logger:false, Translations:false, ThemeUtils:false, Context:false */
/**
 * @ojcomponent oj.ojMessages
 * @since 5.0.0
 * @ojdisplayname Messages
 * @ojshortdesc Messages manages the layout and display of child messages.
 *
 * @ojsignature {target: "Type", value:"class ojMessages extends JetElement<ojMessagesSettableProperties>"}
 * @ojtsimport {module: "ojmessage", type: "AMD", imported: ["ojMessage"]}
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["display", "position.at.horizontal", "position.at.vertical", "position.collision",
 *                                                     "position.my.horizontal", "position.my.vertical", "position.of",
 *                                                     "position.offset.x", "position.offset.y"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["messages"]}
 * @ojvbdefaultcolumns 2
 * @ojvbmincolumns 1
 *
 * @classdesc
 * <h3 id="messageOverview-section">
 *   JET Messages
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#messageOverview-section"></a>
 * </h3>
 * <p>Description:
 * <p>Manages the layout and display of one or more messages.
 *
 * <h4 id="messages-syntax-section">Syntax
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#messages-syntax-section"></a></h4>
 * <p>Messages can be defined using a simple syntax to directly bind a DataProvider to the 'messages'
 *    attribute of oj-messages as shown below.
 * <p><b>Note that the use of inlined oj-message children inside of oj-messages is deprecated.</b>
 *    Applications should directly databind 'messages' attribute of oj-messages instead. Using
 *    oj-message inside of the 'messageTemplate' slot to define the template is still valid.
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-messages id="pageMessages" messages="[[messagesDataProvider]]">
 * &lt;/oj-messages>
 * </code>
 * </pre>
 *
 * <h4 id="messages-layout-section">Layouts
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#messages-layout-section"></a></h4>
 * <p>Messages can be shown in these layouts
 * <ul>
 * <li>Inlined to the page content</li>
 * <li>Overlayed on the page content, positioned to the top of the page by default</li>
 * <li>As notifications, positioned to the top-end corner of the page by default</li>
 * </ul>
 * Inlined messages will push the page contents when a new message is shown and could scroll out of
 * the view when user scrolls the page. Overlayed or notification style messages are usually
 * positioned relative to the window, will assume a fixed position and will remain
 * visible when the user scrolls the page. Overlayed or notification messages can be positioned
 * relative to another element in the page, in which case the messages follow that element upon
 * page scroll. Inline and overlay layouts are suitable for messages pertaining to the page or
 * region of the page, or relating to the task the user performed on the page. Notification layout is
 * suitable for messages that arrive asynchronously to the application or to communicate alerts to
 * users. Examples below shows the three layouts.
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- Inline: Do not specify the 'position', set 'display' to 'general' -->
 * &lt;oj-messages id="inlineMessages" messages="[[serviceRequestMessages]]" display="general">
 * &lt;/oj-messages>
 *
 * &lt;!-- Overlay: Set 'position' to an empty or a structured object, set 'display' to 'general' -->
 * &lt;oj-messages id="overlayMessages" messages="[[serviceRequestMessages]]" position="{}" display="general">
 * &lt;/oj-messages>
 *
 * &lt;!-- Notification: Set 'position' to an empty or a structured object, set 'display' to 'notification' -->
 * &lt;oj-messages id="notificationMessages" messages="[[emailMessages]]" position="{}" display="notification">
 * &lt;/oj-messages>
 * </code>
 * </pre>
 *
 * <h3 id="reparenting-section">
 *   Reparenting
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#reparenting-section"></a>
 * </h3>
 *
 *  <p id="reparenting-strategy">
 *     When the messages region is disclosed as a popup (position property defined), it will be
 *     reparented in the document and reparented back when all contained messages are closed.
 *     The location of the messages within the document will be in context of where it is defined.
 *     This is different than other types of popups where their reparenting location depends on
 *     the context they are used.  The stacking context of the messages region will be defined
 *     by the "oj-messages-layer" style class. The messages region that has active focus will be
 *     assigned a greater z-index value. This is applied to the messages's layer by way of
 *     the "oj-focus-within" pseudo selector applied with "oj-messages-layer" selector.
 *     The page author has control over z-index weights by way of the "oj-messages-layer" selector.
 *  </p>
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
 * <p> The following CSS classes can be applied by the page author as needed.</p>
 *
 * {@ojinclude "name":"stylingDoc"}
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
 *       <td rowspan = "3">Focus within Messages</td>
 *       <td><kbd>Tab</kbd> or <kbd>Shift + Tab</kbd></td>
 *       <td>Navigate the content of the messages region.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>F6</kbd></td>
 *       <td>Moves focus back to the last focused element outside the messages region.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Moves focus back to the last focused element outside the messages region.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan = "1">Focus outside Messages</td>
 *       <td><kbd>F6</kbd></td>
 *       <td>Move focus to the first message within the more recently disclosed messages region.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojMessages
 */

/**
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Class</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-messages-inline-remove-bottom-border</td>
 *       <td>Inline messages will include a bottom border so that the messages section is demarcated
 *            from the contents below it. If this border is not desirable for certain page layouts,
 *            it can be removed by setting this marker class on oj-messages.
  *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
 * @memberof oj.ojMessages
 */

// Attributes
// ///////////

/**
 *<p> Specifies the collection of structured message data used to display the individual messages.
 * This property can be used to conveniently specify the required data as a single collection.
 * Individual message will be automatically created based on this data. See
 * {@link oj.ojMessage.Message} for message values.</p>
 * <p> More information about the structured 'Message' data can be found in documentation for
 * 'message' attribute of <code class="prettyprint">oj-message</code> element.</p>
 *
 * The collection can be two types:
 * <li>an array of oj.ojMessage.Message objects.</li>
 * <li>oj.ArrayDataProvider of oj.ojMessage.Message objects. Look at {@link oj.ArrayDataProvider} for more available options.</li>
 * @example <caption>Initialize component with <code class="prettyprint">messages</code> attribute:</caption>
 * //example with 'messages' attribute is  an array of oj.ojMessage.Message objects.
 * &lt;!-- emailNotifications is an array of messages, with each entry being of 'Message' type -->
 * &lt;oj-messages messages="[[emailNotifications]]">&lt;/oj-messages>
 * //example with 'messages' attribute of type dataprovider. See the documentation for {@link oj.ArrayDataProvider} for more details on the available options.
 * &lt;oj-messages messages="[[dataProvider]]">&lt;/oj-messages>
 * &lt;!-- dataProvider is an oj.ArrayDataProvider, with each entry being of 'Message' type -->
 * @example <caption>Get or set the <code class="prettyprint">messages</code> property after initialization:</caption>
 *
 * // getter
 * var messages = myMessages.messages;
 *
 * // setter example using a messages array
 * myMessages.messages = [{"severity": "error", "summary": "Some summary 1", "detail": "Some detail 1"},
 *                        {"severity": "warning", "summary": "Some summary 2", "detail": "Some detail 2"}];
 * // setter example using DataProvider
 * var messages = [{"severity": "error", "summary": "Some summary 1", "detail": "Some detail 1"},
 *                {"severity": "warning", "summary": "Some summary 2", "detail": "Some detail 2"}];
 * myMessages.messages = new oj.ArrayDataProvider(messages);
 * @expose
 * @type {null | Array.<Object> | Object}
 * @name messages
 * @ojshortdesc Specifies the collection of structured message data used to display the individual messages. See the Help documentation for more information.
 * @default null
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessages
 * @ojsignature { target: "Type",
 *                value: "Array<oj.ojMessage.Message> | null | oj.DataProvider<any, oj.ojMessage.Message>",
 *                jsdocOverride: true}
**/

/**
 * <p>Specifies the display purpose of messages. The valid values for display are
 * <code class="prettyprint">general</code> and <code class="prettyprint">notification</code>.
 * General messages are commonly rendered at the page level or section level, relating to the task
 * the user performed. Notification messages are typically used for reporting asynchronous events,
 * or to communicate some background activity.</p>
 *
 * The presentation of the message is inline by default.  However, when a
 * {@link oj.ojMessages#position}property is provided, the presentation will be an overlay.
 * The alignment of the overlay will default based on the <code>display</code> property.  The
 * defaults are defined by the theme.
 *
 * @example <caption>Initialize component with <code class="prettyprint">display</code> attribute:</caption>
 * &lt;oj-messages display="notification" position="{}">&lt;/oj-messages>
 *
 * @example <caption>Get or set the <code class="prettyprint">display</code> property after initialization:</caption>
 * // getter
 * var display = myMessages.display;
 *
 * // setter
 * myMessages.display = "notification";
 *
 * @expose
 * @type {string}
 * @name display
 * @ojshortdesc Specifies the display purpose of the messages. See the Help documentation for more information.
 * @default "general"
 * @ojvalue {string} "general" messages pertaining to the page or region of the application
 * @ojvalue {string} "notification" often used for communicating alerts arriving asynchronously
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessages
 **/

/**
 * <p>The position property defines the presentation style.  The default presentation is inline,
 * defined by a <code>null</code> position property value.  When a value is provide for the
 * property, the presentation style will be an overaly "popup".  The alignment of the overaly
 * is defined by the position sub-properties.</p>
 *
 * Default position sub-properites are extended by the provided value.  Defaults vary
 * based on the <code>display</code> property and provided by theme. The position
 * property is used to establish the location where the messages popup overlay will appear
 * relative to another element.</p>
 *
 * <p>The "my" and "at" properties defines alignment points relative to the popup and other
 * element.  The "my" property represents the popups alignment where the "at" property
 * represents the other element that can be identified by "of" or defauts to the launcher
 * when the popup opens.  The values of these properties describe horizontal and
 * vertical alignments.</p>
 *
 * @example <caption>Initialize the popup with <code class="prettyprint">position</code>
 *           attribute specified:</caption>
 * &lt;oj-messages position.my.horizontal="left"
 *              position.my.vertical="top"
 *              position.at.horizontal="right"
 *              position.at.vertical="top">
 * &lt;/oj-messages>;
 *
 * @example <caption>Get or set the <code class="prettyprint">position</code> property,
 *          after initialization:</caption>
 * // getter
 * var position = myMessages.position;
 *
 * // setter
 * myMessages.position =
 *    {"my": {"horizontal": "start", "vertical": "bottom"},
 *     "at": {"horizontal": "end", "vertical": "top" },
 *     "offset": {"x": 0, "y":5}};
 *
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @type {Object|null}
 * @name position
 * @ojshortdesc Specifies the position and presentation style of the messages. See the Help documentation for more information.
 * @ojsignature { target: "Type",
 *                value: "oj.ojMessages.Position|null",
 *                jsdocOverride: true}
 */

/**
 * Defines which edge on the messages overlay to align with the target ("of") element.
 *
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.my
 * @name position.my
 * @type {Object}
 */

/**
 * Defines the horizontal alignment of the messages overlay.
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.my.horizontal
 * @name position.my.horizontal
 * @type {string}
 * @ojvalue {string} "start" evaluates to "left" in LTR mode and "right" in RTL mode.
 * @ojvalue {string} "end" evaluates to "right" in LTR mode and "left" in RTL mode.
 * @ojvalue {string} "left"
 * @ojvalue {string} "center"
 * @ojvalue {string} "right"
 */

/**
 * Defines the vertical alignment of the messages overlay.
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.my.vertical
 * @name position.my.vertical
 * @type {string}
 * @ojvalue {string} "top"
 * @ojvalue {string} "center"
 * @ojvalue {string} "bottom"
 */

/**
 * Defines a point offset in pixels from the ("my") alignment.
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.offset
 * @name position.offset
 * @type {Object}
 */

/**
 * Horizontal alignment offset.
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.offset.x
 * @name position.offset.x
 * @type {number}
 */

/**
 * Vertical alignment offset.
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.offset.y
 * @name position.offset.y
 * @type {number}
 */

/**
 * Defines which position on the target element ("of") to align the positioned element
 * against.
 *
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.at
 * @name position.at
 * @type {Object}
 */

/**
 * Defines the horizontal alignment of what the messages overlay is aligned to.
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.at.horizontal
 * @name position.at.horizontal
 * @type {string}
 * @ojvalue {string} "start" evaluates to "left" in LTR mode and "right" in RTL mode.
 * @ojvalue {string} "end" evaluates to "right" in LTR mode and "left" in RTL mode.
 * @ojvalue {string} "left"
 * @ojvalue {string} "center"
 * @ojvalue {string} "right"
 */

/**
 * Defines the vertical alignment of what the messages overlay is aligned to.
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.at.vertical
 * @name position.at.vertical
 * @type {string}
 * @ojvalue {string} "top"
 * @ojvalue {string} "center"
 * @ojvalue {string} "bottom"
 */

/**
 * Which element to position the messages overlay against.
 *
 * If the value is a string, it should be a selector or the literal string value
 * of <code class="prettyprint">window</code>.  Otherwise, a point of x,y.  When a point
 * is used, the values are relative to the whole document.  Page horizontal and vertical
 * scroll offsets need to be factored into this point - see UIEvent
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageX">pageX</a>,
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageY">pageY</a>.
 *
 * @example <caption>Finding the point for an svg element:</caption>
 * var rect = svgDom.getBoundingClientRect();
 * var position = {of:{x:rect.left + window.pageXOffset, y:rect.top + window.pageYOffset}};
 *
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.of
 * @name position.of
 * @ojshortdesc Specifies which element to position the messages overlay against. See the Help documentation for more information.
 * @type {string}
 */

/**
 * Rule for alternate alignment.
 *
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @alias position.collision
 * @name position.collision
 * @type {string}
 * @ojvalue {string} "flip" the element to the opposite side of the target and the
 *  collision detection is run again to see if it will fit. Whichever side
 *  allows more of the element to be visible will be used.
 * @ojvalue {string} "fit" shift the element away from the edge of the window.
 * @ojvalue {string} "flipfit" first applies the flip logic, placing the element
 *  on whichever side allows more of the element to be visible. Then the fit logic
 *  is applied to ensure as much of the element is visible as possible.
 * @ojvalue {string} "none" no collision detection.
 */

/**
 * <p>Specifies the display options for contents of all the messages specified for the
 * {@link oj.ojMessages#messages} attribute.
 *
 * @expose
 * @member
 * @name displayOptions
 * @ojshortdesc Specifies the display options for contents of all the messages.
 * @memberof! oj.ojMessages
 * @instance
 * @since 6.1.0
 * @type {Object}
 * @ojsignature { target: "Type",
 *                value: "oj.ojMessage.DisplayOptions",
 *                jsdocOverride: true}
 *
 * @example <caption>Initialize the element with <code class="prettyprint">display-options</code>
 * attribute:</caption>
 * &lt;!-- Binding display-options attribute to a structured object -->
 * &lt;oj-messages display-options="[[myMessageDisplayOptions]]">&lt;/oj-message>
 *
 * &lt;!-- Setting display-options using JSON notation -->
 * &lt;oj-messages display-options='{"category": "none"}' message.summary="Some summary" message.detail="Some detail">&lt;/oj-messages>
 *
 * &lt;!-- Setting the display-options sub-attributes -->
 * &lt;oj-messages display-options.category="none" message.summary="Some summary" message.detail="Some detail">&lt;/oj-messages>
 *
 * @example <caption>Get or set the <code class="prettyprint">displayOptions</code> property after initialization:</caption>
 * // getter
 * var displayOptions = myMessages.displayOptions;
 *
 * // setter
 * myMessages.displayOptions = {
 *     category: "none"
 * };
 */

/**
 *<p>Specifies display option for {@link oj.ojMessage#message.category} text in all the messages
 * specified for the {@link oj.ojMessages#messages} attribute.
 *
 * @example <caption>Initialize the element with <code class="prettyprint">display-options.category</code> attribute:</caption>
 * &lt;oj-messages display-options.category="none" message.summary="Some summary" message.detail="Some detail">&lt;/oj-messages>
 *
 * @example <caption>Get or set the <code class="prettyprint">displayOptions.category</code> property after initialization:</caption>
 * // getter
 * var categoryOption = myMessages.getProperty("displayOptions.category");
 *
 * // setter
 * myMessages.setProperty("displayOptions.category", "none");
 *
 * @expose
 * @type {string}
 * @name displayOptions.category
 * @ojvalue {string} "header" if the {@link oj.ojMessage#message.category} property is specified,
 *  its value will be displayed in the header region of the message next to message icon. If
 *  {@link oj.ojMessage#message.category} property is not specified, a translated text corresponding
 *  to the value of the {@link oj.ojMessage#message.severity} property will be displayed.
 * @ojvalue {string} "auto" the component decides whether and where the
 *  {@link oj.ojMessage#message.category} text is displayed. The behavior is same as 'header'
 *  option, but may change in future releases.
 * @ojvalue {string} "none" the {@link oj.ojMessage#message.category} text will not be displayed
 * @default "auto"
 * @instance
 * @access public
 * @memberof! oj.ojMessages
 */

/**
 * <p>A collection of translated resources from the translation bundle, or <code class="prettyprint">null</code> if this
 * component has no resources.  Resources may be accessed and overridden individually or collectively, as seen in the examples.
 *
 * <p>If this component has translations, their documentation immediately follows this doc entry.
 *
 *
 * @example <caption>Initialize the component, overriding some translated resources and leaving the others intact:</caption>
 * &lt;!-- Using dot notation -->
 * &lt;oj-some-element translations.some-key='some value' translations.some-other-key='some other value'>&lt;/oj-some-element>
 *
 * &lt;!-- Using JSON notation -->
 * &lt;oj-some-element translations='{"someKey":"some value", "someOtherKey":"some other value"}'>&lt;/oj-some-element>
 *
 * @example <caption>Get or set the <code class="prettyprint">translations</code> property after initialization:</caption>
 * // Get one
 * var value = myComponent.translations.someKey;
 *
 * // Set one, leaving the others intact. Always use the setProperty API for
 * // subproperties rather than setting a subproperty directly.
 * myComponent.setProperty('translations.someKey', 'some value');
 *
 * // Get all
 * var values = myComponent.translations;
 *
 * // Set all.  Must list every resource key, as those not listed are lost.
 * myComponent.setProperty("translations.someKey" 'some value');
 *
 * @expose
 * @type {Object}
 * @name translations
 * @ojshortdesc A collection of translated resources from the translation bundle, or null if this component has no resources.
 * @memberof! oj.ojMessages
 * @ojtranslatable
 * @member
 * @instance
 * @since 5.0.0
 **/

// Slots
// //////

/**
 * <p>The <code class="prettyprint">&lt;oj-messages></code> element accepts only
 * <code class="prettyprint">&lt;oj-message></code> element as children for the default slot. The
 * default slot contents are rendered only if the 'messages' attribute on
 * <code class="prettyprint">&lt;oj-messages></code> is not set. If the 'messages' attribute is set
 * <code class="prettyprint">&lt;oj-message></code> children are automatically stamped for each
 * message data in the collection.
 *
 * <p><b>Note that the use of inlined oj-message children inside of oj-messages is deprecated.</b>
 *    Applications should directly databind 'messages' attribute of oj-messages instead. Using
 *    oj-message inside of the 'messageTemplate' slot to define the template is still valid.
 *
 * @ojchild Default
 * @ojshortdesc The oj-messages element accepts only oj-message elements as children for the default slot. See the Help documentation for more information.
 * @memberof oj.ojMessages
 * @since 5.0.0
 *
 * @example <caption>Initialize <code class="prettyprint">&lt;oj-messages></code> with explicitly
 * defined <code class="prettyprint">&lt;oj-message></code> children:</caption>
 * &lt;oj-messages id="inlineMessages">
 *   &lt;oj-message message='{"summary": "Some summary", "detail": "Some detail", "autoTimeout": 5000}'>&lt;/oj-message>
 *   &lt;oj-message message="[[surveyInstructions]]">&lt;/oj-message>
 *   &lt;oj-message message="[[surveySubmitConfirmation]]">&lt;/oj-message>
 * &lt;/oj-messages>
 */

/**
 * <p>The <code class="prettyprint">messageTemplate</code> slot is used to specify the template
 * for rendering each message in the <code class="prettyprint">oj-messages</code>. The slot
 * <b>must</b> be a &lt;template> element. The default template will display the
 * <code class="prettyprint">oj-message</code> children to best suit the display type of the
 * <code class="prettyprint">oj-messages</code>. This template slot will be applied only if the
 * 'messages' attribute on <code class="prettyprint">oj-messages</code>> is set.
 * The content of the template <b>must</b> be an <code class="prettyprint">oj-message</code>
 * element.</p>
 * <p>When the template is executed for each message, it will have access to the binding context
 * containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current message. (See [oj.ojMessages.MessageTemplateContext]{@link oj.ojMessages.MessageTemplateContext} or the table
 *       below for a list of properties available on $current)</li>
 *  <li>alias - if 'data-oj-as' attribute was specified on the &lt;template> element, the value
 *      will be used to provide an application-named alias for $current.</li>
 * </ul>
 *
 *
 * @ojslot messageTemplate
 * @ojshortdesc The messageTemplate slot is used to specify the template for rendering each message. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojMessages
 * @since 6.2.0
 * @ojslotitemprops oj.ojMessages.MessageTemplateContext
 *
 * @example <caption>Initialize oj-messages with an inline message template specified:</caption>
 * &lt;oj-messages messages="[[dataProvider]]">
 *   &lt;template slot="messageTemplate">
 *     &lt;oj-message message="[[$current.data]]">&lt;/oj-message>
 *   &lt;template>
 * &lt;/oj-messages>
 */

// Methods
// ////////

/**
 * Closes the specified message regardless of the {@link oj.ojMessage#message.autoTimeout} or
 * {@link oj.ojMessage#message.closeAffordance} properties. The <code>message</code> argument
 * is a required argument, must be of type {@link oj.ojMessage#message}, and must be the same object
 * instance that was used to create and show the oj-message.
 *
 * <p>Closing a message changes the visibility to hidden. If the message is defined by an instance
 * in the {@link oj.ojMessages#messages} collection, the close operation will not remove the item
 * from the backing model. Application logic needs to listen for the
 * {@link oj.ojMessage#event:close} event bubbling up from the underlying oj-message child to remove
 * from the backing collection.</p>
 *
 * @expose
 * @function close
 * @ojshortdesc Unconditionally closes the specified message. See the Help documentation for more information.
 * @memberof! oj.ojMessages
 * @instance
 * @since 5.0.0
 * @param {Object} message the message to be closed
 * @return {void}
 * @ojsignature {target:"Type", value:"oj.ojMessage.Message", for:"message", jsdocOverride: true}
 *
 * @example <caption>Invoke the <code class="prettyprint">close</code> method:</caption>
 * myMessages.close(myMessage.message);
 */

/**
 * Closes child messages matching the <code>closeFilter</code> callback criteria.
 * The <code>closeFilter</code> callback is an optional argument. If not specified, all child
 * messages will be closed. If filter is specified, object of type {@link oj.ojMessage#message}
 * corresponding to each child will be passed to the <code>closeFilter</code> function. A return
 * value of <code>true</code> will result in calling {@link oj.ojMessage#close} for the message.
 * Otherwise, the message will remain in its current state.
 *
 * <p>Closing a message changes the visibility to hidden. If the message is defined by an instance
 * in the {@link oj.ojMessages#messages} collection, the close operation will not remove the item
 * from the backing model. Application logic needs to listen for the
 * {@link oj.ojMessage#event:close} event bubbling up from the underlying oj-message child to remove
 * from the backing collection.</p>
 *
 * @expose
 * @function closeAll
 * @ojshortdesc Closes all child messages matching an optional filter criteria. See the Help documentation for more information.
 * @memberof! oj.ojMessages
 * @instance
 * @since 5.0.0
 * @param {function} [closeFilter] an optional callback function that will be passed an instance
 *                   of type {@link oj.ojMessage#message} for each child
 *                   oj-message.  If <code>closeFilter</code> returns <code>true</code>, the
 *                   associated oj-message will be closed.  Returning <code>false</code> will
 *                   exclude the child message from closure.  If a <code>closeFilter</code> is not
 *                   passed, all child messages will be closed.
 * @return {void}
 * @ojsignature {target: "Type",
 *               value: "(message: oj.ojMessage.Message) => boolean",
 *               for: "closeFilter",
 *               jsdocOverride: true}
 *
 * @example <caption>Invoke the <code class="prettyprint">closeAll</code> method:</caption>
 * myMessages.closeAll(function (message)
 * {
 *   // close all messages of error severity
 *   return "error" === message.severity;
 * });
 */

/**
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 *
 * @function setProperty
 * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {any} value - The new value to set the property to.
 * @return {void}
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @since 5.0.0
 *
 * @example <caption>Set a single subproperty of a complex property:</caption>
 * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
 */

/**
 * Retrieves a value for a property or a single subproperty for complex properties.
 * @function getProperty
 * @param {string} property - The property name to get. Supports dot notation for subproperty access.
 * @return {any}
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @since 5.0.0
 *
 * @example <caption>Get a single subproperty of a complex property:</caption>
 * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
 */

/**
 * Performs a batch set of properties.
 * @function setProperties
 * @param {Object} properties - An object containing the property and value pairs to set.
 * @return {void}
 * @expose
 * @memberof! oj.ojMessages
 * @instance
 * @since 5.0.0
 *
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 **/


// Type Defs
// //////////

/**
 * @typedef {Object} oj.ojMessages.PositionAlign
 * @property {"top"|"bottom"|"center"} [vertical] Vertical alignment.
 * @property {"start"|"end"|"left"|"center"|"bottom"} [horizontal] Horizontal alignment. <p>
 * <ul>
 *  <li><b>"start"</b> evaluates to "left" in LTR mode and "right" in RTL mode.</li>
 *  <li><b>"end"</b> evaluates to "right" in LTR mode and "left" in RTL mode.</li>
 * </ul>
 *
 */

/**
 * @typedef {Object} oj.ojMessages.PositionPoint
 * @property {number} [x] Horizontal alignment offset.
 * @property {number} [y] Vertical alignment offset.
 */
/**
 * @typedef {Object} oj.ojMessages.MessageTemplateContext
 * @property {Element} componentElement The &lt;oj-messages> custom element.
 * @property {Object} data The data for the current message being rendered.
 * @ojsignature {target:"Type", value:"oj.ojMessage.Message", for:"data", jsdocOverride: true}
 */

/**
 * @typedef {Object} oj.ojMessages.Position
 * @property {Object} [my] Defines which edge on the popup to align with the target ("of") element.
 * @property {Object} [at] Defines which position on the target element ("of") to align the positioned element
 *                                  against.
 * @property {Object} [offset] Defines a point offset in pixels from the ("my") alignment.
 * @property {string|Object} [of] Which element to position the popup against.
 *
 * If the value is a string, it should be a selector or the literal string value
 * of <code class="prettyprint">window</code>.  Otherwise, a point of x,y.  When a point
 * is used, the values are relative to the whole document.  Page horizontal and vertical
 * scroll offsets need to be factored into this point - see UIEvent
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageX">pageX</a>,
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/pageY">pageY</a>.
 *
 * @property {"flip"|"fit"|"flipfit"|"none"} [collision] Rule for alternate alignment. <p>
 * <ul>
 *  <li><b>"flip"</b> the element to the opposite side of the target and the
 *             collision detection is run again to see if it will fit. Whichever side
 *             allows more of the element to be visible will be used. </li>
 * <li><b>"fit"</b> shift the element away from the edge of the window. </li>
 * <li><b>"flipfit"</b> first applies the flip logic, placing the element
 *  on whichever side allows more of the element to be visible. Then the fit logic
 *  is applied to ensure as much of the element is visible as possible.</li>
 * <li><b>"none"</b> no collision detection.</li>
 * </ul>
 * @ojsignature [{target:"Type", value:"oj.ojMessages.PositionAlign", for:"my", jsdocOverride:true},
 *               {target:"Type", value:"oj.ojMessages.PositionAlign", for:"at", jsdocOverride:true},
 *               {target:"Type", value:"oj.ojMessages.PositionPoint", for:"offset", jsdocOverride:true},
 *               {target:"Type", value:"string|oj.ojMessages.PositionPoint", for:"of", jsdocOverride:true}]
 */

var _MESSAGES_VIEW =
  '<div role="presentation" :id="[[containerId]]" :class="[[containerSelectors]]" ' +
  '     on-oj-open="[[handleOpen]]" on-oj-close="[[handleClose]]" ' +
  '     on-oj-animate-start="[[handleAnimateStart]]">' +
  '  <oj-bind-if test="[[!$properties.messages]]">' +
  '    <oj-bind-slot>' +
  '    </oj-bind-slot>' +
  '  </oj-bind-if>' +
  '  <oj-bind-if test="[[$properties.messages]]">' +
  '    <oj-bind-for-each data="[[$properties.messages]]" >' +
  '      <template>' +
  '        <oj-bind-template-slot name="messageTemplate" ' +
  '          data="[[{data:$current.data, componentElement:_composite}]]">' +
  '          <template>' +
  '            <oj-message message="[[$current.data]]" display-options="[[$properties.displayOptions]]">' +
  '            </oj-message>' +
  '          </template>' +
  '        </oj-bind-template-slot>' +
  '      </template>' +
  '    </oj-bind-for-each>' +
  '  </oj-bind-if>' +
  '</div>';

function MessagesViewModel(context) {
  this._composite = context.element;

  // Anything used by the view bindings or component methods can't be obfuscated
  // and is why it's defined in quotes.
  this.containerId = [context.unique, 'mc'].join('_');
  this._messagesContainerId = this.containerId;
  this.handleOpen = this._handleOpen.bind(this);
  this.handleClose = this._handleClose.bind(this);
  this.handleAnimateStart = this._handleAnimateStart.bind(this);
  this.bindingsApplied = this._bindingsApplied.bind(this);
  this.disconnected = this._disconnected.bind(this);
  this.connected = this._connected.bind(this);
  this.close = this._close.bind(this);
  this.closeAll = this._closeAll.bind(this);
  this.propertyChanged = this._propertyChanged.bind(this);

  this._properties = context.properties;
  this._createObservables();
  this._updateLandmark();

  //  When slideIn/out animation is used, like the defaults in notification messages, the
  //  the transformation starts from off viewport. For applications that use oj-messages inside of
  //  iFrame with 100% width/height *(eg. our cookbook demos), this works find in all cases except
  //  WebKit. WebKit has a bug that 100% is not respected, and iFrame is resized to accomodate its
  //  contents. In this case the transformation starting from outside the iFrame bounds triggers a
  //  resize, the resize event then results in popupservice calling in the refresh hook (the
  //  _refresh() method here), which will again position to top-end for notification message, which
  //  will be further off view-port further trigger resize and goes into blind look.
  // Workaround is to set overflow hidden on the containing oj-messages so that transformation due
  //  to animation is confined to its boundary, this will workaround iFrame resize bug in Webkit.
  if (oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.IOS) {
    this._composite.style.overflow = 'hidden';
  }
}

MessagesViewModel.prototype._bindingsApplied = function () {
  // detects F6 navigation to the body content
  var messagesContainerDiv = document.getElementById(this._messagesContainerId);
  messagesContainerDiv.addEventListener('ojFocus', this._navigationEventListener.bind(this), false);

  // If 'messages' property is specified, we will not have inlined oj-message children.
  if (this._properties.messages) {
    // Defer showing messages until the first stamped oj-message child is created and ready to show.
    //  This is dealt with in beforeOpen handler. Animation override is dealt with in the
    //  animateStart listener.
    messagesContainerDiv.addEventListener('ojBeforeOpen', this._handleBeforeOpen.bind(this), false);
    return;
  }

  // If we had inlined oj-message children in the default slot, they are all created before the
  //  parent oj-messages is created, so oj-messages does not receive events from the inlined
  //  children. Deal with animate overriding open action for those messages here.
  var inlinedMessageChildren = this._getDefaultSlotMessageElements();
  if (inlinedMessageChildren.length !== 0) {
    // Add a busy state before we start animating open action for all inlined oj-message children
    var busyContext = Context.getContext(this._composite).getBusyContext();
    this._inlinedMessagesOpenBusyStateResolve =
      busyContext.addBusyState({ description: 'oj-messages is busy opening inlined messages' });

    this._showMessagesContainer();
    for (var i = 0; i < inlinedMessageChildren.length; i++) {
      this._animateMessageAction(
        inlinedMessageChildren[i].firstChild,
        'open',
        this._resolveInlinedMessagesOpenBusyState(
          inlinedMessageChildren[i].getProperty('message'),
          inlinedMessageChildren.length));
    }
  }
};

MessagesViewModel.prototype._resolveInlinedMessagesOpenBusyState = function (
  message,
  numInlinedChildren) {
  this._updateLiveRegionAndContainer(message);

  this._numInlinedChildrenAnimated =
    this._numInlinedChildrenAnimated ? this._numInlinedChildrenAnimated + 1 : 1;

  if (this._numInlinedChildrenAnimated === numInlinedChildren) {
    this._numInlinedChildrenAnimated = 0;
    // Now that we are done open animating all inlined children, resolve the busy context
    this._inlinedMessagesOpenBusyStateResolve();
  }
};

MessagesViewModel.prototype._disconnected = function () {
  MessagesViewModel.NAVIGATION_TRACKER.remove(this._messagesContainerId);

  // detaching an open message overlay results in implicit dismissal
  if (oj.ZOrderUtils.getStatus(this._composite) === oj.ZOrderUtils.STATUS.OPEN) {
    this._closeOverlay();
  }
};

MessagesViewModel.prototype._connected = function () {
  MessagesViewModel.NAVIGATION_TRACKER.add(this._messagesContainerId);
};

MessagesViewModel.prototype._closeAll = function (closeFilter) {
  if (this._isMessagesShown()) {
    var messageChildren = this._getDefaultSlotMessageElements();
    for (var i = 0; i < messageChildren.length; i++) {
      var message = messageChildren[i].message;
      var closeable = true;
      if (closeFilter) {
        closeable = closeFilter(message);
      }
      if (closeable) {
        messageChildren[i].close();
      }
    }
  }
};

MessagesViewModel.prototype._propertyChanged = function (detail) {
  if (detail.updatedFrom === 'external' && detail.property === 'position') {
    if (detail.previousValue && detail.value) {
      // re-evaluate overlay position
      this._refresh();
    } else if (!detail.previousValue && detail.value) {
      // inline to overlay
      if (this._getDefaultSlotMessageElements().length > 0) {
        if (this._isMessagesShown()) {
          this._hideMessages();
        }

        this._openOverlay();
      }
    } else if (detail.previousValue && !detail.value) {
      // overlay to inline
      if (this._getDefaultSlotMessageElements().length > 0) {
        if (this._isOverlayOpen()) {
          this._closeOverlay();
        }

        this._showMessages();
      }
    }
  } else if (detail.updatedFrom === 'external' && detail.property === 'display') {
    if (this._getDefaultSlotMessageElements().length > 0) {
      if (this._isOverlayOpen()) {
        this._closeOverlay();
        this._openOverlay();
        this._refresh();
      } else if (this._isMessagesShown()) {
        this._hideMessages();
        this._showMessages();
      }
    }
  } else if (detail.updatedFrom === 'external' && detail.property === 'translations') {
    this._updateLandmark();
  }
};

MessagesViewModel.prototype._close = function (message) {
  if (message && this._isMessagesShown()) {
    var messageChildren = this._getDefaultSlotMessageElements();
    for (var i = 0; i < messageChildren.length; i++) {
      /** @type {?} */
      var childMessage = $(messageChildren[i]).prop('message');
      if (childMessage === message) {
        messageChildren[i].close();
      }
    }
  }
};

MessagesViewModel.prototype._isEventPertaining = function (event) {
  // verify the event is from a child message
  var target = event.target;
  var messagesContainerDiv = document.getElementById(this._messagesContainerId);
  if (target.nodeName !== 'OJ-MESSAGE' || !oj.DomUtils.isAncestor(messagesContainerDiv, target)) {
    return false;
  }
  return true;
};

MessagesViewModel.prototype._handleBeforeOpen = function (event) {
  if (!event.defaultPrevented && this._isEventPertaining(event) && !this._isMessagesShown()) {
    this._showMessagesContainer();
  }
};

MessagesViewModel.prototype._showMessagesContainer = function () {
  if (!this._isPresentationInline()) {
    this._openOverlay();
  } else {
    this._showMessages();
  }
};

MessagesViewModel.prototype._handleOpen = function (event) {
  // verify the event is from a child message
  if (event.defaultPrevented || !this._isEventPertaining(event)) {
    return;
  }

  this._updateLiveRegionAndContainer(event.detail.message);
};

MessagesViewModel.prototype._updateLiveRegionAndContainer = function (message) {
  var translations = Translations.getComponentTranslations('oj-ojMessage').categories;

  // oj.Message has 'fatal' severity which is no different from 'error', oj-message does not support
  //  'fatal' for this reason. Map 'fatal' to 'error' just to be compatible with cases where the
  //  message stream could come from existing oj.Message sources.
  var severity = message.severity === 'fatal' ? 'error' : message.severity;
  var category = !message.category ? translations[severity] : message.category;
  var options = { category: category, summary: message.summary };

  var liveRegion = this._getLiveRegion();
  var text = this._getTranslationsDefault('ariaLiveRegion.newMessage', options);
  liveRegion.announce(text);

  this._refresh();  // re-evaluate the position as the overlay size can change.
};

MessagesViewModel.prototype._getTranslationsDefault = function (key, options) {
  var val = this._properties.translations;
  var keySegments = key.split('.');

  // key is a dot separated qualifier, break it so we can use in [] notation to access sub-props
  for (var i = 0; (i < keySegments.length) && val; i++) {
    val = val[keySegments[i]];
  }

  if (oj.StringUtils.isEmptyOrUndefined(val)) {
    val = Translations.getTranslatedString(['oj-ojMessages', key].join('.'), options);
  } else if (options) {
    // if app dev specified and we have params, insert those for tokens possible in the val
    val = Translations.applyParameters(val, options);
  }

  return val;
};

MessagesViewModel.prototype._handleClose = function (event) {
  // verify the event is from a child message
  if (event.defaultPrevented || !this._isEventPertaining(event)) {
    return;
  }

  // look for next focus
  var closeMessageElement = event.target;
  var nextFocusElement;

  // If the event was triggered from the close icon, the originalEvent will be populated
  // Next focus is only needed when closure was from the close icon.  autoTimeout closure
  // shouldn't insist on focus handling.
  if (event._originalEvent) {
    nextFocusElement = this._getNextFocus(closeMessageElement);
  }

  if (nextFocusElement) {
    nextFocusElement.focus();
  }

  // remove the oj-message from DOM. Note that we are not calling 'oj.Components.subtreeHidden'
  //  because it is not required if we use jquery remove() as per the doc there
  $(closeMessageElement).remove();

  // if we do not have any "default" slot children, then the message being closed is the last one,
  //  close/hide the containers hence
  if (this._getDefaultSlotMessageElements().length === 0) {
    MessagesViewModel.NAVIGATION_TRACKER.togglePreviousFocus(this._messagesContainerId);

    if (this._isOverlayOpen()) {
      this._closeOverlay();
    } else {
      this._hideMessages();
    }
  }
};

MessagesViewModel.prototype._getNextFocus = function (target) {
  var messageElements = this._getDefaultSlotMessageElements();
  var n = messageElements.indexOf(target);
  var nextFocusMessage;
  if (n - 1 > -1) {
    nextFocusMessage = messageElements[n - 1];
  } else if (n + 1 <= messageElements.length - 1) {
    nextFocusMessage = messageElements[n + 1];
  }

  var nextFocusElement;
  if (nextFocusMessage) {
    nextFocusElement = nextFocusMessage.querySelector('.oj-message-category[tabindex="-1"]');
  }

  return nextFocusElement;
};

MessagesViewModel.prototype._handleAnimateStart = function (event) {
  if (event.defaultPrevented || !this._isEventPertaining(event)) {
    return; // animateStart already overridden on the individual oj-message.
  }

  // eat the event bubbling up from a child oj-message component
  event.preventDefault();
  // event.stopPropagation();

  // override animation
  this._animateMessageAction(event.detail.element, event.detail.action, event.detail.endCallback);
};

MessagesViewModel.prototype._animateMessageAction = function (messageElement, action, endCallback) {
  var display = this._isPresentationInline() ? 'general' : this._computeDisplay();
  var options = this._getThemedAnimateOptions(display, action);

  // oj-messages doesn't publish animateStart/animateEnd so use the simpler syntax for now and allow
  // the event to bubble.
  // oj.AnimationUtils.startAnimation(messageElement, action, options, component).then(endCallback);
  // eslint-disable-next-line no-undef
  AnimationUtils[options.effect](messageElement, options).then(endCallback);
};

MessagesViewModel._DEFAULTS = {
  general: {
    animation: {
      open: { effect: 'expand', duration: '300ms' },
      close: { effect: 'collapse', duration: '300ms' }
    },
    position: {
      my: { horizontal: 'center', vertical: 'top' },
      at: { horizontal: 'center', vertical: 'top' },
      of: 'window',
      collision: 'none'
    }
  },
  notification: {
    animation: {
      open: { effect: 'slideIn', duration: '300ms' },
      close: { effect: 'slideOut', duration: '300ms', direction: 'end' }
    },
    position: {
      my: { horizontal: 'end', vertical: 'top' },
      at: { horizontal: 'end', vertical: 'top' },
      of: 'window',
      collision: 'none'
    }
  }
};

MessagesViewModel.prototype._getThemedAnimateOptions = function (display, action) {
  var themedDefaults = ThemeUtils.parseJSONFromFontFamily('oj-messages-option-defaults');
  if (themedDefaults && themedDefaults[display] && themedDefaults[display].animation &&
      themedDefaults[display].animation[action]) {
    return themedDefaults[display].animation[action];
  }
  return MessagesViewModel._DEFAULTS[display].animation[action];
};

MessagesViewModel.prototype._computeDisplay = function () {
  var display = this._properties.display;
  return display;
};

MessagesViewModel.prototype._isPresentationInline = function () {
  return !this._properties.position;
};

MessagesViewModel.prototype._computeContainerSelectors = function () {
  var display = this._computeDisplay();
  var composite = $(this._composite);

  // something about the layout changed, take this opp. to update classes on the root element
  composite.removeClass('oj-messages-general oj-messages-notification oj-messages-inline');

  if (this._isPresentationInline()) {
    composite.addClass('oj-messages-inline');
  } else {
    composite.addClass(['oj-messages', display].join('-'));
  }

  // a bogus binding on the view, and we return a literal here, but provides a convenient way to be
  //  able to set classes on the root element when the underlying observables change
  return 'oj-messages-container';
};

MessagesViewModel.prototype._getThemedPosition = function () {
  var display = this._computeDisplay();
  var themedDefaults = ThemeUtils.parseJSONFromFontFamily('oj-messages-option-defaults');
  if (themedDefaults[display] && themedDefaults[display].position) {
    return themedDefaults[display].position;
  }
  return MessagesViewModel._DEFAULTS[display].position;
};

MessagesViewModel.prototype._getPositionAsJqUi = function () {
  var position = oj.PositionUtils.coerceToJqUi(this._computePosition());
  var isRtl = oj.DomUtils.getReadingDirection() === 'rtl';
  position = oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl);
  return position;
};

MessagesViewModel.prototype._computePosition = function () {
  var position = this._properties.position;
  return oj.PositionUtils.coerceToJet(position, this._getThemedPosition());
};

MessagesViewModel.prototype._getDefaultSlotMessageElements = function () {
  function toSelector(node) {
    var selector = '';
    if (node) {
      if (node.id && node.id.length > 0) {
        selector = '#' + node.id;
      } else {
        selector = node.nodeName;
        var clazz = node.getAttribute('class');
        if (clazz) {
          selector += '.' + clazz.split(' ').join('.');
        }

        if (node.parentNode) {
          return toSelector(node.parentNode) + ' > ' + selector;
        }
      }
    }

    return selector;
  }

  var element = document.getElementById(this._messagesContainerId);

  var slotMap = oj.BaseCustomElementBridge.getSlotMap(element);
  var messageElements = [];

  // we just need to deal with "default" slot
  var body = slotMap[''];  // default slot
  for (var i = 0; body && i < body.length; i++) {
    // any element child node of oj-messages must be a oj-message, do this validation at times.
    if (body[i].nodeName !== 'OJ-MESSAGE') {
      // we included oj-bind-if in our view def, so make an exception
      if (body[i].nodeName !== 'OJ-BIND-IF') {
        Logger.error(["JET oj-messages id='", toSelector(this._composite),
          "': can contain only oj-message children in its default slot. ",
          "Found a child element id='", toSelector(body[i]), "'."].join(''));
      }
    } else {
      messageElements.push(body[i]);
    }
  }

  return messageElements;
};

MessagesViewModel.prototype._isMessagesShown = function () {
  return $(this._composite).is(':visible');
};

MessagesViewModel.prototype._showMessages = function () {
  if (!this._isMessagesShown()) {
    // unhide the oj-messages root and notify
    $(this._composite).show();
    Components.subtreeShown($(this._composite));
  }

  // When messages are shown in popup, popup.open() will call popup_elem.show(), which is a deep
  //  show() call in its subtree, so behind the scenes, our composite will have 'display:block'
  //  inline style set quietly. For this case _isMessagesShown() check is not reliable. Hence
  //  the accessibility enabling code below is outside of this check, when showing the messages.
  // This is not an issue when hiding the messages though, because the popup effect kicks in later.
  MessagesViewModel.NAVIGATION_TRACKER.add(this._messagesContainerId);
  this._announceNavigation();
};

MessagesViewModel.prototype._hideMessages = function () {
  if (this._isMessagesShown()) {
    // hide the oj-messages node root and notify
    $(this._composite).hide();
    Components.subtreeHidden(this._composite);

    MessagesViewModel.NAVIGATION_TRACKER.remove(this._messagesContainerId);
    if (this._liveRegion) {
      this._liveRegion.destroy();
      delete this._liveRegion;
    }
  }
};

MessagesViewModel.prototype._openOverlay = function () {
  var composite = $(this._composite);
  var psOptions = {};
  psOptions[oj.PopupService.OPTION.POPUP] = composite;
  psOptions[oj.PopupService.OPTION.LAUNCHER] = this._getLauncher();
  psOptions[oj.PopupService.OPTION.POSITION] = this._getPositionAsJqUi();
  psOptions[oj.PopupService.OPTION.EVENTS] = this._getPopupServiceEvents();

  psOptions[oj.PopupService.OPTION.LAYER_SELECTORS] = ['oj', 'messages', 'layer'].join('-');
  psOptions[oj.PopupService.OPTION.MODALITY] = oj.PopupService.MODALITY.MODELESS;
  psOptions[oj.PopupService.OPTION.CUSTOM_ELEMENT] = true;
  oj.PopupService.getInstance().open(psOptions);

  this._showMessages();

  this._overlayEventsCallback = MessagesViewModel._overlayEventsListener.bind(this, composite);

  // snap on tab key handler
  composite[0].addEventListener('keydown', this._overlayEventsCallback, false);
};

MessagesViewModel.prototype._getLauncher = function () {
  var launcher = this._composite.parentElement;

  if (this._composite.previousElementSibling) {
    launcher = this._composite.previousElementSibling;
  } else if (this._composite.nextElementSibling) {
    launcher = this._composite.nextElementSibling;
  }

  return $(launcher);
};

MessagesViewModel.prototype._closeOverlay = function () {
  this._hideMessages();

  var composite = $(this._composite);

  /** @type {!Object.<oj.PopupService.OPTION, ?>} */
  var psOptions = {};
  psOptions[oj.PopupService.OPTION.POPUP] = composite;
  oj.PopupService.getInstance().close(psOptions);

  // remove tab key handler
  var overlayEventsCallback = this._overlayEventsCallback;
  delete this._overlayEventsCallback;
  composite[0].removeEventListener('keydown', overlayEventsCallback, false);
};

MessagesViewModel.prototype._isOverlayOpen = function () {
  var composite = this._composite;
  var status = oj.ZOrderUtils.getStatus(composite);
  return (status === oj.ZOrderUtils.STATUS.OPENING ||
          status === oj.ZOrderUtils.STATUS.OPEN ||
          status === oj.ZOrderUtils.STATUS.CLOSING);
};

MessagesViewModel._overlayEventsListener = function (element, event) {
  if (event.defaultPrevented) {
    return;
  }

  if (event.keyCode === $.ui.keyCode.TAB) {
    var target = event.target;
    var nodes = element.find(':tabbable');
    if (nodes.length > 0) {
      var firstNode = nodes[0];
      var lastNode = nodes[nodes.length - 1];
      if (firstNode === lastNode && target === firstNode) {
        // only one tabstop and key event is on the last/first, eat the event
        event.preventDefault();
      } else if (firstNode === target && event.shiftKey) {
        // tabbing backwards, cycle focus to last node
        event.preventDefault();
        lastNode.focus();  // tabbing backwards, cycle focus to last node
      } else if (lastNode === target && !event.shiftKey) {
        event.preventDefault();
        firstNode.focus(); // tabbing forwards, cycle to the first node
      }
    } else {
      // no tab stops, eat tab event
      event.preventDefault();
    }
  }
};

/**
 * Listens for the ojFocus event fired on the messages container by the navigation
 * tracker. Signals the navigation tracker has forced focus to the messages container
 * in response to F6 keypress from outside the messages container.
 *
 * @private
 * @instance
 * @param {Event|CustomEvent} event
 */
MessagesViewModel.prototype._navigationEventListener = function (event) {
  // The extra id check to to make sure the event is not from ojDialog or ojPopup
  // The dialog and popup raise ojFocus events but the ojFocus raised from the
  // messages navigation tracker is dispatched on the container and doesn't bubble.
  if (event.target.id === this._messagesContainerId) {
    event.preventDefault();
    this._announceNavigation(true);
  }
};

/**
 * Announces F6 navigation commands depending on if focus is within the message region
 * and the platform (mobile, desktop).
 *
 * @private
 * @instance
 * @param {boolean=} isFocusWithin true if focus navigation is to the messages container
 */
MessagesViewModel.prototype._announceNavigation = function (isFocusWithin) {
  var isVOSupported = (oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.IOS ||
                       oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.ANDROID);
  var key;
  if (isFocusWithin) {
    key = isVOSupported ? undefined : 'ariaLiveRegion.navigationFromKeyboard';
  } else {
    key = isVOSupported ? 'ariaLiveRegion.navigationToTouch' : 'ariaLiveRegion.navigationToKeyboard';
  }

  if (key) {
    var liveRegion = this._getLiveRegion();
    var message = this._getTranslationsDefault(key);
    liveRegion.announce(message);
  }
};

MessagesViewModel.prototype._getLiveRegion = function () {
  var id = this._messagesContainerId;
  if (!this._liveRegion) {
    this._liveRegion = new LiveRegion(id);
  }

  return this._liveRegion;
};

MessagesViewModel.prototype._getPopupServiceEvents = function () {
  var events = {};
  events[oj.PopupService.EVENT.POPUP_CLOSE] = this._closeOverlay.bind(this);
  events[oj.PopupService.EVENT.POPUP_REMOVE] = this._surrogateRemoveHandler.bind(this);
  events[oj.PopupService.EVENT.POPUP_REFRESH] = this._refresh.bind(this);

  return events;
};

MessagesViewModel.prototype._refresh = function () {
  if (this._isOverlayOpen()) {
    var messagesBoundingRect = this._composite.getBoundingClientRect();

    // We will reposition only if messages are fully in viewport. Otherwise overflowing messages
    //  cannot be scrolled with page scroll since our popup repositions for scroll events.
    if (messagesBoundingRect.height < document.documentElement.clientHeight &&
        messagesBoundingRect.width < document.documentElement.clientWidth) {
      var position = this._getPositionAsJqUi();
      $(this._composite).position(position);
    }
  }
};

MessagesViewModel.prototype._surrogateRemoveHandler = function () {
  this._closeOverlay();
  this._composite.parentElement.removeChild(this._composite);
};

MessagesViewModel.prototype._createObservables = function () {
  // this can't be obfuscated by the closure compiler
  this.containerSelectors = ko.pureComputed(this._computeContainerSelectors.bind(this), this);
};

MessagesViewModel.prototype._computeLabelLandmark = function () {
  var properties = this._properties;

  if (oj.StringUtils.isEmptyOrUndefined(properties.translations.labelLandmark)) {
    return this._getTranslationsDefault('labelLandmark');
  }

  return properties.translations.labelLandmark;
};

MessagesViewModel.prototype._updateLandmark = function () {
  var labelLandmark = this._computeLabelLandmark();
  this._composite.setAttribute('aria-label', labelLandmark);
  this._composite.setAttribute('role', 'complementary');
};

/**
 * Tracks all visible instances of oj-messages and handles F6 navigation to the the most
 * recently disclosed instance.  In addtion, F6 navigation from the messages back to the
 * last focus element.
 *
 * @const
 * @type {Object}
 */
MessagesViewModel.NAVIGATION_TRACKER = {
  /**
   * @type {Array.<string>}
   */
  _messagesContainerIds: [],
  /**
   * @type {Object}
   */
  _priorFocusCache: {},
  /**
   * @param {string} id
   */
  add: function (id) {
    // adds tracking of the messages container when it becomes disclosed.

    this.remove(id);
    this._messagesContainerIds.push(id);
    this._start(id);
  },
  /**
   * @param {string} id
   */
  remove: function (id) {
    // disabled tracking the message container when it's not disclosed

    var messagesContainerIds = this._messagesContainerIds;
    var i = messagesContainerIds.indexOf(id);
    if (i > -1) {
      messagesContainerIds.splice(i, 1);
    }

    this._stop(id);
  },
  /**
   * @param {string} id
   */
  togglePreviousFocus: function (id) {
    // Restore focus from the messages container to what had focus prior to establishing
    // focus within the messages container. Invoked from press F6 within the messages
    // container.

    var priorFocusCache = this._priorFocusCache;

    /** @type {Element} */
    var target = priorFocusCache[id];

    if (target && $(target).is(':visible') && oj.ZOrderUtils.isAboveTopModalLayer(target)) {
      target.focus();
      delete priorFocusCache[id];
      return true;
    }
    return false;
  },
  /**
   * @param {string} id
   * @param {Element|undefined} target
   */
  _addPriorFocusCache: function (id, target) {
    // Captures the element that had focus prior to navigation to a messages container.
    // navigation can be via F6 or mouse.

    this._priorFocusCache[id] = target;
  },
  /**
   * @param {string} id
   */
  _start: function (id) {
    // Establishes listeners on the message container.  Adds the document listeners if
    // it's the first messages container shown.

    var messagesContainerDiv = document.getElementById(id);
    if (!messagesContainerDiv) {
      return;
    }

    // establish capture focus and keydown bubble listener on the container
    var messageContainerCallback = this._messageContainerListener.bind(this, id);
    messagesContainerDiv.addEventListener('focus', messageContainerCallback, true);
    messagesContainerDiv.addEventListener('keydown', messageContainerCallback, false);
    messagesContainerDiv.addEventListener('click', messageContainerCallback, false);
    $(messagesContainerDiv).data('oj_messages_nmtl', messageContainerCallback);

    // return if already listening
    if (this._documentCallback) {
      return;
    }

    this._documentCallback = this._documentListener.bind(this);
    var docElement = document.documentElement;
    docElement.addEventListener('keydown', this._documentCallback, false);
    docElement.addEventListener('blur', this._documentCallback, true);
  },
  /**
   * @param {string} id
   */
  _stop: function (id) {
    // Removes message container listeners when the messages container is hidden.
    // Hidding the last message container will remove the listeners on the document.

    var messagesContainerDiv = document.getElementById(id);
    if (messagesContainerDiv) {
      /** @type {?} */
      var messageContainerCallback = $(messagesContainerDiv).data('oj_messages_nmtl');
      if (messageContainerCallback) {
        messagesContainerDiv.removeEventListener('focus', messageContainerCallback, true);
        messagesContainerDiv.removeEventListener('keydown', messageContainerCallback, false);
        messagesContainerDiv.removeEventListener('click', messageContainerCallback, false);
      }
    }

    if (!this._documentCallback || this._messagesContainerIds.length > 0) {
      return;
    }

    var docElement = document.documentElement;
    docElement.removeEventListener('keydown', this._documentCallback, false);
    docElement.removeEventListener('blur', this._documentCallback, true);
    delete this._documentCallback;
  },
  /**
   * @param {!Element} target
   * @return {number}
   */
  _indexOfFocusWithin: function (target) {
    // checks if the target of the F6 keydown is within a messages container.
    var messagesContainerIds = this._messagesContainerIds;
    for (var i = 0; i < messagesContainerIds.length; i++) {
      var messagesContainerDiv = document.getElementById(messagesContainerIds[i]);
      if (messagesContainerDiv &&
          oj.DomUtils.isAncestorOrSelf(messagesContainerDiv, target)) {
        return i;
      }
    }

    return -1;
  },
  /**
   * @param {Event} event
   */
  _documentListener: function (event) {
    if (event.defaultPrevented) {
      return;
    }

    // Listeners for F6 navigation to the messages region from any element in the document.  The
    // listener is a bubble keydown.  If the event has been prevented, it's ignored.  If
    // there are multiple oj-messages components in the page, the selection is based on the
    // most recently disclosed order.

    var messagesContainerIds = this._messagesContainerIds;
    // F6 keypress
    if (event.type === 'keydown' && event.keyCode === 117 && messagesContainerIds.length > 0) {
      // Look to see if the event target is already within a message area.  If focus is within
      // do nothing as the F6 listener on the mesage area will handle.
      var s = this._indexOfFocusWithin(event.target);
      if (s > -1) {
        return;  // @see #_messageContainerListener
      }
      s = messagesContainerIds.length - 1;

      // target the most recently disclosed
      for (var i = s; i > -1; i--) {
        var messagesContainerDiv = document.getElementById(messagesContainerIds[i]);

        // if the container doesn't exist or is not visible continue to the next most recently used
        if (messagesContainerDiv && $(messagesContainerDiv).is(':visible') &&
            oj.ZOrderUtils.isAboveTopModalLayer(messagesContainerDiv)) {
          var element = messagesContainerDiv.querySelector('.oj-message-category[tabindex="-1"]');

          event.preventDefault();

          // captrue what had focus prior to pressing F6
          this._addPriorFocusCache(messagesContainerIds[i], event.target);

          element.focus();

          // Use a custom message to signal navigation to the messages container. The event doesn't
          // bubble. The event is used to announce navigation instructions.
          var customEvent = new CustomEvent('ojFocus', { bubbles: false, cancelable: true });
          messagesContainerDiv.dispatchEvent(customEvent);
          break;
        }
      }
    } else if (event.type === 'blur') {
      // capture blur listener used to keep track of what last had focus
      this._prevActiveElement = event.target;
    }
  },
  /**
   * @param {string} id
   * @param {Event} event
   */
  _messageContainerListener: function (id, event) {
    // capture focus and bubble keydown event listener attached to visible message containers

    if (event.defaultPrevented) {
      return;
    }

    if (event.type === 'focus' || event.type === 'click') {
       // if prior focus was outside the messgaes container and new focus is within, capture
       // what had prior focus. This is the best attempt to capture F2 navigation when using
       // mouse or touch to navigate to the message container versus F2 keyboard.

       /** @type {?} */
      var messagesContainerDiv = document.getElementById(id);
      var prevActiveElement = this._prevActiveElement;
      if (prevActiveElement && messagesContainerDiv &&
           !oj.DomUtils.isAncestorOrSelf(messagesContainerDiv, prevActiveElement)) {
        // attached to visible message components.  Tracks previous focus.
        this._addPriorFocusCache(id, prevActiveElement);
      }
    } else if (event.type === 'keydown' &&
            (event.keyCode === 117 || event.keyCode === $.ui.keyCode.ESCAPE)) {
      // F6 or ESC keypress from within the content of the messages container will toggle focus back
      // to to what had prior focus. An attempt is made to fixup the navigate even if arriving
      // using the mouse or touch.
      if (this.togglePreviousFocus(id)) {
        event.preventDefault();
      }
    }
  }
};


/**
 * Utility for handling voice over messages sent to a aria live region.  Messages
 * announced will not be deleted until the live region utility instance is destroyed.
 * They are not cleared due to the chattiness and quick timming messages can be added
 * as it could be too quick to read.
 * @private
 * @constructor
 * @class LiveRegion
 * @ignore
 * @ojtsignore
 * @param {string} id of the messages container
 */
function LiveRegion(id) {
  this.Init(id);
}

/**
 * Adds one to the reference counter instance.
 * @instance
 * @protected
 */
LiveRegion.prototype.Init = function (id) {
  this._id = id;
};

/**
 * Decrements the reference counter destroying the assocaited shared DOM aria
 * live region element when there are no longer any messages using it.
 * @instance
 * @public
 */
LiveRegion.prototype.destroy = function () {
  var liveRegion = $(document.getElementById(LiveRegion._LIVE_REGION_ID));

  // remove all the messages per messages container
  var id = this._id;
  delete this._id;

  liveRegion.find('div[data-container-id="' + id + '"]').remove();

  if (liveRegion.children('div').length < 1) {
    liveRegion.remove();
  }
};

/**
 * Sends a message to the aria live region for voice over mode.
 * @instance
 * @public
 * @param {string} message to be announce in the live region
 */
LiveRegion.prototype.announce = function (message) {
  var liveRegion = LiveRegion._getLiveRegion();
  var id = this._id;
  $('<div>').attr('data-container-id', id).text(message).appendTo(liveRegion);// @HTMLUpdateOK
};


/**
 * Creates or returns an existing aria live region used by messages.
 * @returns {jQuery} aria live region
 * @private
 */
LiveRegion._getLiveRegion = function () {
  var liveRegion = $(document.getElementById(LiveRegion._LIVE_REGION_ID));
  if (liveRegion.length === 0) {
    // only tracks additions
    liveRegion = $('<div>');
    liveRegion.attr({ id: LiveRegion._LIVE_REGION_ID,
      role: 'log',
      'aria-live': 'polite',
      'aria-relevant': 'additions' });
    liveRegion.addClass('oj-helper-hidden-accessible');
    liveRegion.appendTo(document.body);// @HTMLUpdateOK
  }
  return liveRegion;
};

LiveRegion._LIVE_REGION_ID = '__oj_messages_arialiveregion';

/* global __oj_messages_metadata */
// eslint-disable-next-line no-undef
Composite.register('oj-messages',
  {
    view: _MESSAGES_VIEW,
    viewModel: MessagesViewModel,
    metadata: __oj_messages_metadata
  });


});