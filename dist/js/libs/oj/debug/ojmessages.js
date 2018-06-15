/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojknockout', 'ojs/ojcomposite',
        'promise', 'ojs/ojpopupcore', 'ojs/ojanimation', 'ojs/ojmessage'], 
       function(oj, $, ko)
{


/* jslint browser: true*/
/*
 ** Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
 */

/**
 * @ojcomponent oj.ojMessages
 * @since 5.0.0
 * @ojdisplayname Messages
 * @ojshortdesc Manages layout and display of messages.
 * @ojstatus preview
 * @ojsignature {target: "Type", value:"class ojMessages extends JetElement<ojMessagesSettableProperties>"}
 * @ojtsimport ojmessage
 *
 * @classdesc
 * <h3 id="messageOverview-section">
 *   JET Messages
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#messageOverview-section"></a>
 * </h3>
 * <p>Description:
 * <p>Manages the layout and display of one or more messages. The only supported component child
 * element of <code class="prettyprint">oj-messages</code> is
 * <code class="prettyprint">oj-message</code>.
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
 * <h4 id="messages-syntax-section">Syntaxes
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#messages-syntax-section"></a></h4>
 * <p>Messages can be defined as below followed by examples
 * <ul>
 * <li>Include an oj-message child for every message to be shown. This is suitable for case when the
 * messages are static and in small numbers</li>
 * <li>Include oj-message child, wrap it inside of a for-each binding. This is suitable for case
 * where one or more message sources need to be displayed in a single messages element</li>
 * <li>Use the simple syntax to directly bind a collection to the 'messages' attribute of oj-messages.
 * This is a convenient syntax and suitable when a single message source is used</li>
 * </ul>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;!-- Including oj-message children -->
 * &lt;oj-messages id="inlineMessages">
 *   &lt;oj-message message='{"summary": "Some summary", "detail": "Some detail", "autoTimeout": 5000}'>&lt;/oj-message>
 *   &lt;oj-message message="[[surveyInstructions]]">&lt;/oj-message>
 *   &lt;oj-message message="[[surveySubmitConfirmation]]">&lt;/oj-message>
 * &lt;/oj-messages>
 *
 * &lt;!-- For-each bound oj-message children -->
 * &lt;oj-messages id="pageOverlayMessages" position="{}" display="notification">
 *   &lt;oj-bind-for-each data="[[serviceRequestStatusUpdateMessages]]">
 *     &lt;template>
 *       &lt;oj-message message="[[$current.data]]">&lt;/oj-message>
 *     &lt;/template>
 *   &lt;/oj-bind-for-each>
 *   &lt;oj-bind-for-each data="[[criticalIncidentMessages]]">
 *     &lt;template>
 *       &lt;oj-message message="[[$current.data]]">&lt;/oj-message>
 *     &lt;/template>
 *   &lt;/oj-bind-for-each>
 * &lt;/oj-messages>
 *
 * &lt;!-- Collection bound simple syntax, no need to specify oj-message children -->
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
/////////////

/**
 *<p> Specifies the array of structured message data used to display the individual messages.
 * Instead of providing multiple oj-message as children, this property can be used to conveniently
 * specify the required data as a single collection. Individual message will be automatically
 * created based on this data. See {@link oj.ojMessage.Message} for message values.</p>
 *<p> More information about the structured 'Message' data can be found in documentation for
 *'message' attribute of <code class="prettyprint">oj-message</code> element.</p>
 *
 * @example <caption>Initialize component with <code class="prettyprint">messages</code> attribute:</caption>
 * &lt;!-- emailNotifications is an array of messages, with each entry being of 'Message' type -->
 * &lt;oj-messages messages="[[emailNotifications]]">&lt;/oj-messages>
 *
 * @example <caption>Get or set the <code class="prettyprint">messages</code> property after initialization:</caption>
 *
 * // getter
 * var messages = myMessages.messages;
 *
 * // setter
 * myMessages.messages = [{"severity": "error", "summary": "Some summary 1", "detail": "Some detail 1"},
 *                        {"severity": "warning", "summary": "Some summary 2", "detail": "Some detail 2"}];
 *
 * @expose
 * @type {null | Array.<Object>}
 * @name messages
 * @default null
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessages
 * @ojsignature { target: "Type",
 *                value: "Array<oj.ojMessage.Message>|null",
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
 * {@link oj.ojMessages#position} property is provided, the presentation will be an overlay.
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
 * property, the presentation style will be an overaly "popup".  The aligment of the overaly
 * is defined by the position sub-properties.</p>
 *
 * Default position sub-properites are extended by the provided value.  Defaults vary
 * based on the <code>display</code> property and provided by theme. The position
 * property is used to establish the location where the messages popup overlay will appear
 * relative to another element.</p>
 *
 * <p>The "my" and "at" properties defines aligment points relative to the popup and other
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
 * @default null
 * @name position
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
 * @default {"horizontal" : "center", "vertical" : "top"}
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
 * Horizontal aligment offset.
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
 * Defines the horizontal alignment of what the messges overlay is aligned to.
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
 * @memberof! oj.ojMessages
 * @ojtranslatable
 * @member
 * @instance
 * @since 5.0.0
 **/


// Methods
//////////

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
 * @memberof! oj.ojMessages
 * @instance
 * @since 5.0.0
 * @param {Object} associated message instance of type {@link oj.ojMessage#message}
 * @return {void}
 * @ojsignature { target: "Type",
 *                value: "oj.ojMessage.Message",
 *                for: "message",
 *                jsdocOverride: true}
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
////////////

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
 * @property {number} [x] Horizontal aligment offset.
 * @property {number} [y] Vertical alignment offset.
 */

/**
 * @typedef {Object} oj.ojMessages.Position
 * @property {oj.ojMessages.PositionAlign} [my] Defines which edge on the popup to align with the target ("of") element.
 * @property {oj.ojMessages.PositionAlign} [at] Defines which position on the target element ("of") to align the positioned element
 *                                  against.
 * @property {oj.ojMessages.PositionPoint} [offset] Defines a point offset in pixels from the ("my") alignment.
 * @property {string|oj.ojMessages.PositionPoint} [of] Which element to position the popup against.
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
 */

var _MESSAGES_METADATA =
  {
    name: 'oj-messages',
    displayName: 'oj-messages',
    version: '1.0.0',
    jetVersion: '^5.0.0',
    properties: {
      messages: {
        type: 'Array<object>',
        writeback: false,
        value: null
      },

      display: {
        type: 'string',
        enumValues: ['general', 'notification'],
        translatable: false,
        value: 'general'
      },

      position: {
        type: 'object',
        translatable: false,
        properties: {
          my: {
            type: 'object|string',
            properties: {
              horizontal: {
                type: 'string',
                enumValues: ['start', 'end', 'left', 'center', 'right']
              },
              vertical: {
                type: 'string',
                enumValues: ['top', 'center', 'bottom']
              }
            }
          },
          at: {
            type: 'object|string',
            properties: {
              horizontal: {
                type: 'string',
                enumValues: ['start', 'end', 'left', 'center', 'right']
              },
              vertical: {
                type: 'string',
                enumValues: ['top', 'center', 'bottom']
              }
            }
          },
          offset: {
            type: 'object',
            properties: {
              x: {
                type: 'number'
              },
              y: {
                type: 'number'
              }
            }
          },
          of: {
            type: 'string|object'
          },
          collision: {
            type: 'string',
            enumValues: ['flip', 'fit', 'flipfit', 'flipcenter', 'none']
          }
        }
      },

      translations: {
        type: 'object',
        writeback: false,
        value: { labelLandmark: '' },
        properties: {
          labelLandmark: {
            type: 'string',
            translatable: true
          }
        }
      }
    },

    methods: {
      close: {
        params: [
          {
            name: 'message',
            type: 'object'
          }
        ]
      },
      closeAll: {
        params: [
          {
            name: 'filter',
            type: 'function'
          }
        ]
      }
    }

  };

var _MESSAGES_VIEW =
  '<div role="presentation" :id="[[containerId]]" :class="[[containerSelectors]]" ' +
  '     on-oj-open="[[handleOpen]]" on-oj-close="[[handleClose]]" ' +
  '     on-oj-animate-start="[[handleAnimateStart]]">' +
  '  <oj-bind-slot>' +
  '  </oj-bind-slot>' +
//  - switch back to jet when observable inserts are recognized
//  '  <oj-bind-for-each data="[[$props.messages]]" as="item">' +
//  '    <template>' +
//  '      <oj-message message="{{item.data}}">' +
//  '      </oj-message>' +
//  '    </template>' +
//  '  </oj-bind-for-each>' +
  '    <!-- ko foreach: $props.messages -->' +
  '    <oj-message message="[[$data]]">' +
  '    </oj-message>' +
  '    <!-- /ko -->' +
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
}

MessagesViewModel.prototype._bindingsApplied = function () {
  // detects F6 navigation to the body content
  var messagesContainerDiv = document.getElementById(this._messagesContainerId);
  messagesContainerDiv.addEventListener('ojFocus', this._navigationEventListener.bind(this), false);

  // Shows the message container before animation of the first disclosed message.  The ojOpen
  // event is fired after animation.
  messagesContainerDiv.addEventListener('ojBeforeOpen', this._handleBeforeOpen.bind(this), false);
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
    if (!this._isPresentationInline()) {
      this._openOverlay();
    } else {
      this._showMessages();
    }
  }
};

MessagesViewModel.prototype._handleOpen = function (event) {
  // verify the event is from a child message
  if (event.defaultPrevented || !this._isEventPertaining(event)) {
    return;
  }

  /** @type {{icon: string, category: string, severity:string, timestamp:string, summary:string,
      detail:string, autoTimeout:number, closeAffordance: string, sound: string}} */
  var message = event.detail.message;

  var translations = oj.Translations.getComponentTranslations('oj-ojMessage').categories;
  var category = !message.category ? translations[message.severity] : message.category;
  var options = { category: category, summary: message.summary };

  var liveRegion = this._getLiveRegion();
  var text = oj.Translations.getTranslatedString('oj-ojMessages.ariaLiveRegion.newMessage',
                 options);
  liveRegion.announce(text);

  this._refresh();  // re-evaluate the position as the overlay size can change.
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
  var messageElement = event.detail.element;
  var action = event.detail.action;
  var display = this._isPresentationInline() ? 'general' : this._computeDisplay();
  var options = this._getThemedAnimateOptions(display, action);
  // var component = this._composite;
  var endCallback = event.detail.endCallback;

  // oj-messages doesn't publish animateStart/animateEnd so use the simpler syntax for now and allow
  // the event to bubble.
  //
  // oj.AnimationUtils.startAnimation(messageElement, action, options, component).then(endCallback);
  oj.AnimationUtils[options.effect](messageElement, options).then(endCallback);
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
  var themedDefaults = oj.ThemeUtils.parseJSONFromFontFamily('oj-messages-option-defaults');
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
  var themedDefaults = oj.ThemeUtils.parseJSONFromFontFamily('oj-messages-option-defaults');
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
    // any element child node of oj-messages must be a oj-message. Do this validation at times.
    if (body[i].nodeName !== 'OJ-MESSAGE') {
      oj.Logger.error(["JET oj-messages id='", toSelector(this._composite),
        "': can contain only oj-message children in its default slot. ",
        "Found a child element id='", toSelector(body[i]), "'."].join(''));
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
    oj.Components.subtreeShown($(this._composite));
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
    oj.Components.subtreeHidden(this._composite);

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
  psOptions[oj.PopupService.OPTION.LAUNCHER] = composite;
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

  var liveRegion = this._getLiveRegion();
  var message = oj.Translations.getTranslatedString(['oj-ojMessages', key].join('.'));
  liveRegion.announce(message);
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
    var position = this._getPositionAsJqUi();

    var composite = $(this._composite);
    composite.position(position);
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
    return oj.Translations.getTranslatedString('oj-ojMessages.labelLandmark');
  };
  
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
      for (var i = s; i > -1; i++) {
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

oj.Composite.register('oj-messages',
  {
    view: _MESSAGES_VIEW,
    viewModel: MessagesViewModel,
    metadata: _MESSAGES_METADATA
  });

});