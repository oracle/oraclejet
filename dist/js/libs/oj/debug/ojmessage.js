/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'knockout', 'hammerjs', 'ojs/ojjquery-hammer', 'ojs/ojknockout', 'ojs/ojcomposite', 'ojs/ojanimation', 'ojs/ojbutton', 'ojs/ojvalidation-datetime'], 
       function(oj, $, ko, Hammer)
{


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojMessage
 * @since 5.0.0
 * @ojdisplayname Message
 * @ojshortdesc Displays a message
 * @ojstatus preview
 * @ojsignature {target: "Type", value:"class ojMessage extends JetElement<ojMessageSettableProperties>"}
 *
 * @classdesc
 * <h3 id="messageOverview-section">
 *   JET Message
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#messageOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>Displays a message. All <code class="prettyprint">oj-message</code> elements in a page must
 * have an <code class="prettyprint">oj-messages</code> element as its parent.</p>
 *
 * <pre class="prettyprint">
 * <code>&lt;oj-message id="simpleMessage" message="[[messageData]]">
 * &lt;/oj-message>
 * </code></pre>
 * <h3 id="accessibility-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
 * </h3>
 *
 * <p>The {@link oj.ojMessage#message.sound} property is an accessibility feature for playing a
 * sound when a message is opened. This property defaults to "none", and can be enabled by setting
 * it to "defaults" or by providing URL to an audio file of a format that the browser supports. An
 * accessible application must provide a way for users to enable sound on a settings or preferences
 * page. Some browsers will have auto-play disabled by default, enabling it may require adjusting
 * the browser settings.</p>
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
 *       <td>Message</td>
 *       <td><kbd>Swipe</kbd></td>
 *       <td>Close the message</td>
 *     </tr>
 *     <tr>
 *       <td>Message Close Icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Close the message</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojMessage
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
 *       <td>Message</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the message</td>
 *     </tr>
 *     <tr>
 *       <td>Message Close Icon</td>
 *       <td><kbd>Enter or Space</kbd></td>
 *       <td>Close the message</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojMessage
 */

// Attributes
/////////////

/**
 * <p>Structured data specifying essential information to display a message on the UI.
 * @member
 * @name message
 * @memberof! oj.ojMessage
 * @instance
 * @since 5.0.0
 * @type {Object}
 * @default {"icon": "", 'category': "", "severity": "none", "summary": "", "detail": "", "autoTimeout": -1, "closeAffordance": "defaults", "sound": "none"}
 * @ojsignature { target: "Type",
 *                value: "oj.ojMessage.Message",
 *                jsdocOverride: true}
 *
 * @example <caption>Initialize the element with <code class="prettyprint">message</code> attribute:</caption>
 * &lt;!-- Binding message attribute to a structured object -->
 * &lt;oj-message message="[[myMessageData]]">&lt;/oj-message>
 *
 * &lt;!-- Setting message using JSON notation -->
 * &lt;oj-message message='{"severity": "error", "summary": "Some summary", "detail": "Some detail"}'>&lt;/oj-message>
 *
 * &lt;!-- Setting the message sub-attributes -->
 * &lt;oj-message message.severity="error" message.summary="Some summary" message.detail="Some detail">&lt;/oj-message>
 *
 * @example <caption>Get or set the <code class="prettyprint">message</code> property after initialization:</caption>
 * // getter
 * var message = myMessage.message;
 *
 * // setter - sets all sub-properties (missing sub-properties are defaulted)
 * myMessage.message = {
 *     severity: "error",
 *     summary: "Some summary",
 *     detail: "Some detail"
 * };
 */

/**
 *<p>Specifies the URL for the custom image to be used as an icon representing the message.</p>
 * <p>The icon will be rendered as background image inside a container that is set to size of 16px*16px
 * in alta-web theme and 10px*20px for all other themes, therefore, the icon chosen must fit this
 * dimensions.</p>
 * <p>If this attribute is not specified, a suitable icon corresponding to value of
 * <code class="prettyprint">message.severity</code> will be rendered.</p>
 *
 * @example <caption>Initialize the element with <code class="prettyprint">message.icon</code> attribute:</caption>
 * &lt;oj-message message.icon="images/emailIcon.png" message.summary="Some summary">&lt;/oj-messages>
 *
 * @example <caption>Get or set the <code class="prettyprint">icon</code> property after initialization:</caption>
 * // getter
 * var icon = myMessage.getPropoerty("message.icon");
 *
 * // setter
 * myMessage.setProperty("message.icon", "images/emailIcon.png");
 *
 * @expose
 * @type {string}
 * @name message.icon
 * @default ""
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessage
 */

/**
 *<p>Specifies text representing the message category which is shown next to the message icon</p>
 * <p>If this attribute is not specified, a translated text corresponding to value of
 * <code class="prettyprint">message.severity</code> attribute will be rendered.</p>
 *
 * @example <caption>Initialize the element with <code class="prettyprint">message.category</code> attribute:</caption>
 * &lt;oj-message message.category="Service Request" message.summary="New SR - Escalated">&lt;/oj-message>
 *
 * @example <caption>Get or set the <code class="prettyprint">message.category</code> property after initialization:</caption>
 * // getter
 * var category = myMessage.getProperty("message.category");
 *
 * // setter
 * myMessage.setProperty("message.category", "Service Request");
 *
 * @expose
 * @type {string}
 * @name message.category
 * @default ""
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessage
 */

/**
 *<p>Specifies the severity of message.</p>
 *
 *@example <caption>Initialize the element with <code class="prettyprint">message.severity</code> attribute:</caption>
 * &lt;oj-message message.severity="error" message.summary="Some summary">&lt;/oj-message>
 *
 *@example <caption>Get or set the <code class="prettyprint">message.severity</code> property after initialization:</caption>
 * // getter
 * var severity = myMessage.getProperty("message.severity");
 *
 * // setter
 * myMessage.setProperty("message.severity", "error");
 *
 * @expose
 * @type {string}
 * @name message.severity
 * @ojvalue {string} "error" error level message
 * @ojvalue {string} "warning" warning level message
 * @ojvalue {string} "confirmation" confirmation message
 * @ojvalue {string} "info" informational message
 * @ojvalue {string} "none" message status level not applicable
 * @default "none"
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessage
 */

/**
 *<p>Specifies timestamp for the message to be displayed in the message header. </p>
 *<p> timestamp could represent the date and time at which the message was created, or otherwise
 *could pertain to the event for which the message was created. For example, a timestamp for an
 *upcoming meeting could be set in the future, whereas a timestamp for a missed message could be set
 *in the past.</p>
 *<p> This specified value must be an ISOString. A default converter is used to convert and format
 *the value suitable for displaying in the message. This default convertor used such will be an
 *implementation detail and could change in future.</p>
 *
 * @example <caption>Initialize the element with <code class="prettyprint">message.timestamp</code>
 * attribute:</caption>
 * &lt;oj-message message.summary="Some summary" message.timestamp="2018-03-09T13:10:47+14:00">&lt;/oj-message>
 *
 * @example <caption>Get or set the <code class="prettyprint">message.timestamp</code> property
 * after initialization:</caption>
 * // getter
 * var timestamp = myMessage.getProperty("message.timestamp");
 *
 * // setter
 * myMessage.setProperty("message.timestamp", "2018-03-09T13:10:47+14:00");
 *
 * @expose
 * @type {string}
 * @name message.timestamp
 * @default ""
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessage
 */

/**
 *<p>Specifies summary text for the message.
 *
 * @example <caption>Initialize the element with <code class="prettyprint">message.summary</code> attribute:</caption>
 * &lt;oj-message message.summary="Some summary">&lt;/oj-message>
 *
 * @example <caption>Get or set the <code class="prettyprint">message.summary</code> property after initialization:</caption>
 * // getter
 * var summary = myMessage.getProperty("message.summary");
 *
 * // setter
 * myMessage.setProperty("message.summary", "Some summary");
 *
 * @expose
 * @type {string}
 * @name message.summary
 * @default ""
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessage
 */

/**
 *<p>Specifies detail text for the message.</p>
 *
 * @example <caption>Initialize the element with <code class="prettyprint">message.detail</code> attribute:</caption>
 * &lt;oj-message message.detail="Some detail" message.summary="Some summary">&lt;/oj-message>
 *
 * @example <caption>Get or set the <code class="prettyprint">message.detail</code> property after initialization:</caption>
 * // getter
 * var detail = myMessage.getProperty("message.detail");
 *
 * // setter
 * myMessage.setProperty("message.detail", "Some detail");
 *
 * @expose
 * @type {string}
 * @name message.detail
 * @default ""
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessage
 */

/**
 * <p>Specifies the number of milliseconds for which duration the message will be shown before it is
 * closed automatically.</p>
 * <p>This attribute can take the number of millisecond or special number values -1 and 0. If the
 * value is set to "-1", auto-close will be turned off. If the value is set to "0", application wide
 * value for autoTimeout as specified in a theming variable will be used.
 *
 * @example <caption>Initialize the element with
 * <code class="prettyprint">message.auto-timeout</code> attribute:</caption>
 * &lt;oj-message message.auto-timeout="3000" message.summary="Some summary">&lt;/oj-message>
 *
 * @example <caption>Get or set the <code class="prettyprint">message.autoTimeout</code>
 * property after initialization:</caption>
 * // getter
 * var autoTimeout = myMessage.getProperty("message.autoTimeout");
 *
 * // setter
 * myMessage.message.autoTimeout = 3000;
 *
 * @expose
 * @type {number}
 * @name message.autoTimeout
 * @default -1
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessage
 *
 * @example <caption>The default auto-timeout value can be set at application level using this
 *          theme variable (SCSS) :</caption>
 * $messageAutoTimeoutOptionDefault: 5000 !default;
 */

/**
 *<p>Specifies the UI affordance provided to end users to be able to close the message.</p>
 * @example <caption>Initialize the element with
 * <code class="prettyprint">message.close-affordance</code> attribute:</caption>
 * &lt;oj-message message.close-affordance="none" message.summary="Some summary">&lt;/oj-message>
 *
 * @example <caption>Get or set the <code class="prettyprint">message.closeAffordance</code>
 * property after initialization:</caption>
 * // getter
 * var closeAffordance = myMessage.getProperty("message.closeAffordance");
 *
 * // setter
 * myMessage.setProperty("message.closeAffordance", "none");
 *
 * @expose
 * @type {string}
 * @name message.closeAffordance
 * @ojvalue {string} "none" no UI affordance is provided to close the message. Application has to
 * call the close() method to dismiss the message
 * @ojvalue {string} "defaults" use implicit affordance to best suit the native theme and screen
 * touch capabilities. See keyboard and touch end user information sections in this document.
 * @default "defaults"
 * @instance
 * @access public
 * @memberof! oj.ojMessage
 * @since 5.0.0
 */

/**
 * <p>Specifies the sound to be played when a message is opened. Sound is an accessibility feature
 * required for low vision users who view a zoomed section of the UI. Because messages may be shown
 * outside of the zoomed section, such users require sound to be played to notify of new messages.</p>
 *
 * <p>This attribute can take a URL of the audio file for the custom sound to be played. The
 * supported formats are mp3, wav and ogg. Browser support should also be considered while choosing
 * the format of the audio file. Literal string values
 * <code class="prettyprint">"defaults"</code> and <code class="prettyprint">"none"</code> can also
 * be used for this attribute. If the value is set to "none", then the sound will be disabled. If
 * the value is set to "defaults", then a default sound is played.<p>
 *
 * <p>The default sound uses Web Audio APIs, which is not yet supported by some browsers, default
 * sound will not be played in such browsers. Sound will not be played in browsers where auto play
 * is not enabled. Some of the browsers do not allow auto play, while other browsers may provide a
 * user preference to enable it.</p>
 *
 *
 * @example <caption>Initialize the element with <code class="prettyprint">message.sound</code> attribute:</caption>
 * &lt;!-- Use an URL -->
 * &lt;oj-message message.sound="resources/audio/newEmail.wav" message.summary="Some summary">&lt;/oj-message>
 *
 * &lt;!-- Use defaults -->
 * &lt;oj-message message.sound="defaults" message.summary="Some summary">&lt;/oj-message>
 *
 * &lt;!-- Turn off sound -->
 * &lt;oj-message message.sound="none" message.summary="Some summary">&lt;/oj-message>
 *
 * @example <caption>Get or set the <code class="prettyprint">sound</code> property after initialization:</caption>
 * // getter
 * var sound = myMessage.getProperty("message.sound");
 *
 * // setter
 * myMessage.setProperty("message.sound", "resources/audio/newEmail.wav");
 *
 * @expose
 * @type {string}
 * @name message.sound
 * @default "none"
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessage
 */

/**
 * <p>A collection of translated resources from the translation bundle, or
 * <code class="prettyprint">null</code> if this component has no resources. Resources may be
 * accessed and overridden individually or collectively, as seen in the examples.
 *
 * <p>If this component has translations, their documentation immediately follows this doc entry.
 *
 * @member
 * @name translations
 * @memberof! oj.ojMessage
 * @instance
 * @ojtranslatable
 * @since 5.0.0
 * @type {Object}
 *
 * @example <caption>Initialize the element, overriding some translated resources and leaving the
 * others intact:</caption>
 * &lt;!-- Using dot notation -->
 * &lt;oj-some-element translations.some-key='Some value' translations.some-other-key='Some other value'>&lt;/oj-some-element>
 *
 * &lt;!-- Using JSON notation -->
 * &lt;oj-some-element translations='{"someKey":"Some value", "someOtherKey":"Some other value"}'>&lt;/oj-some-element>
 *
 * @example <caption>Get or set the <code class="prettyprint">translations</code> property after
 * initialization:</caption>
 * // Get one
 * var value = myComponent.getProperty("translations.someKey");
 *
 * // Set one, leaving the others intact. Always use the setProperty API for
 * // subproperties rather than setting a subproperty directly.
 * myComponent.setProperty('translations.someKey', 'some value');
 *
 * // Get all
 * var values = myComponent.translations;
 *
 * // Set all.  Must list every resource key, as those not listed are lost.
 * myComponent.translations = {
 *     someKey: 'some value',
 *     someOtherKey: 'some other value'
 * };
 *
 */

// Events
/////////

/**
 * Triggered after the message is closed through user interaction or due to calling
 * <code class="prettyprint">close()</code> method.
 *
 * @expose
 * @event
 * @name close
 * @memberof oj.ojMessage
 * @instance
 * @since 5.0.0
 * @ojcancelable
 * @ojbubbles
 * @property {Object} message instance of type {@link oj.ojMessage#message} corresponding to the message that was closed
 */

/**
 * Triggered when the default animation is about to start for the open or close actions of the message .
 * The default animation can be cancelled by calling
 * <code class="prettyprint">event.preventDefault</code>.
 *
 * <p>In order to override open animation, the ojAnimateStart event listener needs to be
 * registered before the component is created. This means that <code>onOjAnimateStart</code>
 * cannot be used to register listener for 'open' action because it doesn't exist
 * until the component is upgraded or created at which time it is open. For the 'open' action, use
 * the <code>addEventListener</code> method on the associated oj-message elements or
 * <code>on-oj-animate-start</code> attribute to register a listener instead.</p>
 *
 * @expose
 * @event
 * @memberof oj.ojMessage
 * @name animateStart
 * @instance
 * @since 5.0.0
 * @ojcancelable
 * @ojbubbles
 * @property {!Element} element target of animation
 * @property {"open"|"close"} action The action that is starting the animation.
 *            Suggested values are:
 *                    <ul>
 *                      <li>"open" - when a message is opened</li>
 *                      <li>"close" - when a message is closed</li>
 *                    </ul>
 * @property {!function():void} endCallback If the event listener calls
 *            event.preventDefault to cancel the default animation, it must call the
 *            endCallback function when it finishes its own animation handling and any
 *            custom animation has ended.
 *
 * @example <caption>Bind an event listener to the
 *          <code class="prettyprint">onOjAnimateStart</code> property to override the default
 *          "close" animation:</caption>
 * myMessage.onOjAnimateStart = function(event) {
 *   // verify that the component firing the event is a component of interest and action is close
 *   if (event.detail.action == "close") {
 *     event.preventDefault();
 *     oj.AnimationUtils.slideOut(event.detail.element, {"persist":  "all"}).then(event.detail.endCallback);
 *   }
 * };
 *
 * @example <caption>The default open and close animations are controlled via the theme
 *          (SCSS) :</caption>
 * // Applies for both 'inline' and 'overlay' messages
 * $messageGeneralOverlayOpenAnimation: ((effect: "zoomIn"), "fadeIn")  !default;
 * $messageGeneralOverlayCloseAnimation: ((effect: "zoomOut", persist: "all"), "fadeOut")  !default;
 * // Applies for 'notification' messages
 * $messageNotificationOverlayOpenAnimation: ((effect: "zoomIn"), "fadeIn")  !default;
 * $messageNotificationOverlayCloseAnimation: ((effect: "zoomOut", persist: "all"), "fadeOut")  !default;
 */

/**
 * Triggered when the default animation is about to end for the open or close actions of the message.
 * The default animation can be cancelled by calling
 * <code class="prettyprint">event.preventDefault</code>.
 *
 * @expose
 * @event
 * @memberof oj.ojMessage
 * @name animateEnd
 * @instance
 * @since 5.0.0
 * @ojcancelable
 * @ojbubbles
 *
 * @property {!Element} element target of animation
 * @property {"open"|"close"} action The action that is ending the animation.
 *            The number of actions can vary from component to component.
 *            Suggested values are:
 *                    <ul>
 *                      <li>"open" - when a message is opened</li>
 *                      <li>"close" - when a message is closed</li>
 *                    </ul>
 *
 * @example <caption>Bind an event listener to the
 *          <code class="prettyprint">onOjAnimateEnd</code> property to listen for the "close"
 *          ending animation:</caption>
 * myMessage.onOjAnimateEnd = function(event) {
 *   // verify that the component firing the event is a component of interest and action is close
 *   if (event.detail.action == "close") {}
 * };
 *
 * @example <caption>The default open and close animations are controlled via the theme
 *          (SCSS) :</caption>
 * // Applies for both 'inline' and 'overlay' messages
 * $messageGeneralOverlayOpenAnimation: (effect: "zoomIn", fade: true)  !default;
 * $messageGeneralOverlayCloseAnimation: (effect: "zoomOut", fade: true)  !default;
 * // Applies for 'notification' messages
 * $messageNotificationOverlayOpenAnimation: (effect: "zoomIn", fade: true)  !default;
 * $messageNotificationOverlayCloseAnimation: (effect: "zoomOut", fade: true)  !default;
 */

// Methods
//////////

/**
 * Closes the message.
 *
 * @expose
 * @function close
 * @memberof! oj.ojMessage
 * @instance
 * @since 5.0.0
 * @return {void}
 * @fires oj.ojMessage#ojAnimationStart
 * @fires oj.ojMessage#ojAnimationEnd
 * @fires oj.ojMessage#ojClose
 *
 *
 * @example <caption>Invoke the <code class="prettyprint">close</code> method:</caption>
 * myMessage.close();
 */

/**
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 *
 * @function setProperty
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {any} value - The new value to set the property to.
 * @expose
 * @return {void}
 * @memberof! oj.ojMessage
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
 * @memberof! oj.ojMessage
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
 * @memberof! oj.ojMessage
 * @instance
 * @since 5.0.0
 *
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */

// Type Defs
////////////

/**
 * @typedef {Object} oj.ojMessage.Message
 * @property {string} [icon] Defines the icon representing the message.
 * @property {string} [category] Defines category text of the message.
 * @property {"error"|"warning"|"confirmation"|"info"|"none"} [severity] Defines severity of the message.
 * @property {string} [timestamp] Defines timestamp of the message.
 * @property {string} [summary] Defines summary text of the message.
 * @property {string} [detail] Defines detail text of the message.
 * @property {number} [autoTimeout] Defines the time after which the message is to be closed automatically.
 * @property {"none"|"defaults"} [closeAffordance] Defines UI affordance provided to close the message.
 * @property {string} [sound] Defines the sound to be played when message is open.
 */


var _MESSAGE_METADATA =
  {
    name: 'oj-message',
    displayName: 'oj-message',
    version: '1.0.0',
    jetVersion: '^5.0.0',
    properties: {
      message: {
        type: 'object',
        writeback: false,
        value: {
          icon: '',
          category: '',
          severity: 'none',
          summary: '',
          detail: '',
          autoTimeout: -1,
          closeAffordance: 'defaults',
          sound: 'none' },
        properties: {
          icon: {
            type: 'string',
            value: ''
          },
          category: {
            type: 'string',
            value: ''
          },
          severity: {
            type: 'string',
            enumValues: ['error', 'warning', 'confirmation', 'info', 'none'],
            value: 'none'
          },
          timestamp: {
            type: 'string',
            value: ''
          },
          summary: {
            type: 'string',
            value: ''
          },
          detail: {
            type: 'string',
            value: ''
          },
          autoTimeout: {
            type: 'number',
            translatable: false,
            value: -1
          },
          closeAffordance: {
            type: 'string',
            enumValues: ['none', 'defaults'],
            value: 'defaults'
          },
          sound: {
            type: 'string',
            value: 'none'
          }
        }
      },

      translations: {
        type: 'object',
        writeback: false,
        value: { labelCloseIcon: '' },
        properties: {
          labelCloseIcon: {
            type: 'string',
            translatable: true
          }
        }
      }
    },

    methods: {
      close: {
      }
    },

    events: {
      ojAnimateEnd: {
        bubbles: true,
        cancelable: false,
        detail: {
          action: { type: 'string',
            enumValues: ['open', 'close']
          },
          element: { type: 'Element' }
        }
      },
      ojAnimateStart: {
        bubbles: true,
        cancelable: false,
        detail: {
          action: { type: 'string',
            enumValues: ['open', 'close']
          },
          element: { type: 'Element' },
          endCallback: { type: 'function' }
        }
      },
      ojClose: {
        bubbles: true,
        cancelable: false,
        detail: {
          message: { type: 'object' }
        }
      },
      ojOpen: {
        bubbles: true,
        cancelable: false,
        detail: {
          message: { type: 'object' }
        }
      },
    },

    slots: {
    }
  };

var _MESSAGE_VIEW =
  '<div :id="[[containerId]]" class="oj-message-container" on-keydown="[[handleKeydown]]">' +
  '  <div class="oj-message-header">' +
  '    <div class="oj-message-leading-header" :title="[[computedCategory]]">' +
  '      <oj-bind-if test="[[computedIconStyle]]">' +
  '        <div class="oj-component-icon oj-message-status-icon oj-message-custom-icon" role="img" ' +
  '         :style.background="[[computedIconStyle]]">' +
  '        </div>' +
  '      </oj-bind-if>' +
  '      <oj-bind-if test="[[computedIconClass]]">' +
  '        <div role="img" ' +
  '          :class="[[computedIconClass]]"> ' +
  '        </div>' +
  '      </oj-bind-if>' +
  '      <oj-bind-if test="[[computedCategory]]">' +
  '        <div class="oj-message-category" tabindex="-1">' +
  '          <h1 :title="[[computedCategory]]">' +
  '            <oj-bind-text value="[[computedCategory]]"></oj-bind-text> ' +
  '          </h1>' +
  '        </div>' +
  '      </oj-bind-if>' +
  '    </div>' +
  '    <div class="oj-message-trailing-header">' +
  '      <oj-bind-if test="[[computedTimestamp]]">' +
  '        <div class="oj-message-timestamp">' +
  '          <oj-bind-text value="[[computedTimestamp]]"></oj-bind-text> ' +
  '        </div>' +
  '      </oj-bind-if>' +
  '      <oj-bind-if test="[[hasCloseAffordance]]">' +
  '        <div class="oj-message-close">' +
  '          <oj-button display="icons" chroming="half" on-click="[[handleCloseIcon]]">' +
  '            <span slot="startIcon" class="oj-fwk-icon oj-fwk-icon-cross"></span>' +
  '            <span>' +
  '              <oj-bind-text value="[[computedLabelCloseIcon]]"></oj-bind-text>' +
  '            </span>' +
  '          </oj-button>' +
  '        </div>' +
  '      </oj-bind-if>' +
  '    </div>  ' +
  '  </div>' +
  '  <div class="oj-message-body">' +
  '    <div class="oj-message-summary">' +
  '      <oj-bind-text value="[[computedSummary]]"></oj-bind-text>' +
  '    </div>' +
  '    <div class="oj-message-detail">' +
  '      <oj-bind-text value="[[computedDetail]]"></oj-bind-text>' +
  '    </div>' +
  '  <div>' +
  '</div>';

function MessageViewModel(context) {
  this._composite = context.element;

  // anything used by the view bindings can't be obfuscated and is why it's defined in quotes.
  this.containerId = [context.unique, 'mc'].join('_');
  this._messagesContainerId = this.containerId;
  this.handleCloseIcon = this._handleCloseIcon.bind(this);
  this.close = this._closeMessage.bind(this);
  this.bindingsApplied = this._bindingsApplied.bind(this);
  this.disconnected = this._disconnected.bind(this);
  this.connected = this._connected.bind(this);
  this.propertyChanged = this._propertyChanged.bind(this);
  this.messageCreatedTime = new Date().toLocaleTimeString([],
                                      { hour: '2-digit', minute: '2-digit' });
  this.handleKeydown = this._handleKeydown.bind(this);

  // Store a reference to the properties for any later use
  this._properties = context.properties;


  this._initDefaultTranslations();
  this._createObservables();
}

// eslint-disable-next-line no-unused-vars
MessageViewModel.prototype._connected = function (element) {
  // reattached when open (not pending open or close animation), check to see if we need to
  // reschedule the auto close timeout
  var mediator = this._operationMediator;
  if (mediator && mediator.getPendingOperation() === 'none' && this._isMessageOpen()) {
    this._scheduleAutoClose();
  }
};

// eslint-disable-next-line no-unused-vars
MessageViewModel.prototype._disconnected = function (element) {
  // Node disconnected and open (not pending open or close operations), clear the auto close timeout
  // since it might not be reattached.
  var mediator = this._operationMediator;
  if (mediator && mediator.getPendingOperation() === 'none') {
    this._clearAutoClose();
  }
};

// eslint-disable-next-line no-unused-vars
MessageViewModel.prototype._bindingsApplied = function (context) {
  this._openMessage();
};

MessageViewModel.prototype._propertyChanged = function (detail) {
  function subPropertyChanged(_detail, topPropName, subPropName) {
    if (_detail.updatedFrom === 'external' && _detail.property === topPropName) {
      var subproperty = _detail.subproperty;
      if (subproperty) {
        // set a subproperty via attribute or setProperty("message.xxxx", value)
        var path = [topPropName, subPropName].join('.');
        return (path === subproperty.path);
      }

        // set the entire message object
      var previousValue = _detail.previousValue[subPropName];
      var value = _detail.value[subPropName];
      return value !== previousValue;
    }

    return false;
  }

  // workaround for 

  var message = this._properties.message;

  if (subPropertyChanged(detail, 'message', 'autoTimeout')) {
    this._clearAutoClose();
    this._scheduleAutoClose();
  }

  if (subPropertyChanged(detail, 'message', 'closeAffordance')) {
    this.hasCloseAffordance(this._computeCloseAffordance() === 'defaults');
    this._unregisterSwipeHandler();
    this._registerSwipeHandler();
  }
  
  if (subPropertyChanged(detail, 'message', 'icon'))
  {
    this.computedIconStyle(this._computeIconStyle());
    this.computedIconClass(this._computeIconClass());
  }
  
  if (subPropertyChanged(detail, 'message', 'category'))
  {
    this.computedCategory(this._computeCategory());
  }
  
  // category if unspecified and iconclass are derived from severity, recompute those
  if (subPropertyChanged(detail, 'message', 'severity'))
  {
    this.computedSeverity(this._computeSeverity());
    this.computedCategory(this._computeCategory());
    this.computedIconClass(this._computeIconClass());
  }
  
  if (subPropertyChanged(detail, 'message', 'timestamp'))
  {
    this.computedTimestamp(this._computeTimestamp());
  }
  
  if (subPropertyChanged(detail, 'message', 'summary')) {
    this.computedSummary(this._computeSummary());
  }

  if (subPropertyChanged(detail, 'message', 'detail')) {
    this.computedDetail(this._computeDetail());
  }
  
  if (subPropertyChanged(detail, 'translations', 'labelCloseIcon')) {
    this.computedLabelCloseIcon(this._computeLabelCloseIcon());
  }
};

MessageViewModel.prototype._registerSwipeHandler = function () {
  if (oj.DomUtils.isTouchSupported() && this._computeCloseAffordance() === 'defaults') {
    var messageContainerElement = $(document.getElementById(this._messagesContainerId));
    var options = {
      recognizers: [
        [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }]
      ]
    };

    var type = oj.DomUtils.getReadingDirection() === 'rtl' ? 'swipeleft' : 'swiperight';
    this._hammerSwipe = messageContainerElement.ojHammer(options).on(type, function (event) {
      event.preventDefault();
      this._closeMessage();
    }.bind(this));
  }
};

MessageViewModel.prototype._unregisterSwipeHandler = function () {
  if (oj.DomUtils.isTouchSupported() && this._hammerSwipe) {
    var type = oj.DomUtils.getReadingDirection() === 'rtl' ? 'swipeleft' : 'swiperight';
    this._hammerSwipe.off(type);
    delete this._hammerSwipe;
  }
};

MessageViewModel.prototype._scheduleAutoClose = function () {
  // Schedule auto-close if applicable
  if (this._computeAutoTimeout() > -1) {
    this._autoCloseTimer = window.setTimeout(this._closeMessage.bind(this),
                                             this._computeAutoTimeout());
  }
};

MessageViewModel.prototype._clearAutoClose = function () {
  if (!isNaN(this._autoCloseTimer)) {
    window.clearTimeout(this._autoCloseTimer);
    delete this._autoCloseTimer;
  }
};

MessageViewModel.prototype._isMessageOpen = function () {
  var messageContainerElement = document.getElementById(this._messagesContainerId);
  return (!!(messageContainerElement && $(messageContainerElement).is(':visible')));
};

MessageViewModel.prototype._closeMessage = function (event) {
  var mediator = this._operationMediator;
  // unregister the swipe handler
  this._unregisterSwipeHandler();

  // if we are pending the open operation, the close will be invoked after the open is done
  if (mediator.isOperationPending('close', this._closeMessage.bind(this, event))) {
    return;
  }
  mediator.destroy();

  this._clearAutoClose();
  this._operationMediator = new OperationMediator(this._composite, 'close');

  var messageContainerElement = document.getElementById(this._messagesContainerId);
  var action = 'close';
  var options = this._getAnimateOptionDefaults(action);
  oj.AnimationUtils.startAnimation(messageContainerElement, action, options, this._composite)
    .then(function () {
      // We will just hide the message container, but not discard it, the ojClose listener
      // could discard it if needed.
      $(messageContainerElement).hide();
      oj.Components.subtreeHidden(messageContainerElement);

      var eventParams = {
        bubbles: true,
        cancelable: false,
        detail: {
          message: this._properties.message
        }
      };

      var closeEvent = new CustomEvent('ojClose', eventParams);
      if (event) {
        Object.defineProperty(closeEvent, '_originalEvent', { value: event, writable: false });
      }

      this._composite.dispatchEvent(closeEvent);
    }.bind(this));
};

MessageViewModel.prototype._computeSeverity = function () {
  var message = this._properties.message;
  
  if (oj.StringUtils.isEmptyOrUndefined(message.severity)) {
    return MessageViewModel._getMessageDefault('severity');
  };
  
  return message.severity;
};

MessageViewModel.prototype._computeTimestamp = function () {
  var message = this._properties.message;
  
  if (oj.StringUtils.isEmptyOrUndefined(message.timestamp)) {
    return undefined;
  };
  
  try {
    // get the default converter, use default format as in UX specs
    var converter = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
                      .createConverter({ pattern: 'MM/dd/yy, hh:mm a' });
    
    var formattedTimestamp = converter.format(message.timestamp);
    
    // not so-clean implementation about how we avoid displaying date part when it is same date,
    //  should be solved better when we provide API to set custom converter in near future
    if (this._isDateToday(message.timestamp)) {
      formattedTimestamp = formattedTimestamp.split(', ')[1];
    };
    
    return formattedTimestamp;
  } 
  catch (e) {
    // expect oj.ConverterError if supplied value is not valid
    oj.Logger.info(["JET oj-message id='", MessageViewModel._toSelector(this._composite),
      "': failed to parse or format the supplied value to message.timestamp='",
      message.timestamp, "'."].join(''));
    
    return undefined;
  };
};

MessageViewModel.prototype._isDateToday = function (isoDate) {
  var todayDate = new Date();
  var suppliedDate = oj.IntlConverterUtils.isoToLocalDate(isoDate);

  return todayDate.getUTCFullYear() === suppliedDate.getUTCFullYear() &&
         todayDate.getUTCMonth() === suppliedDate.getUTCMonth() &&
         todayDate.getUTCDate() === suppliedDate.getUTCDate();
};

MessageViewModel.prototype._computeCategory = function () {
  var message = this._properties.message;

  if (!oj.StringUtils.isEmptyOrUndefined(message.category)) {
    return message.category;
  };
  
  var mappedCategory = oj.Translations.getComponentTranslations('oj-ojMessage').categories;
  return mappedCategory[this._computeSeverity()];
};

MessageViewModel.prototype._computeAutoTimeout = function () {
  var message = this._properties.message;
  
  if (isNaN(message.autoTimeout)) {
    return MessageViewModel._getMessageDefault('autoTimeout');
  };
  
  if (message.autoTimeout === 0) {
    return this._getThemedAutoTimeoutDefault();
  };
  
  return message.autoTimeout;
};

MessageViewModel.prototype._computeIconStyle = function () {
  var message = this._properties.message;

  if (oj.StringUtils.isEmptyOrUndefined(message.icon)) {
    return undefined;
  };
  
  return ["url('", message.icon, "') no-repeat"].join('');
};

MessageViewModel.prototype._computeIconClass = function () {
  var message = this._properties.message;
  
  if (!oj.StringUtils.isEmptyOrUndefined(message.icon)) {
    return undefined;
  };
  
  var computedSeverity = this._computeSeverity();

  if (computedSeverity === 'none') {
    return undefined;
  };
  
  var selectors = ['oj-component-icon', 'oj-message-status-icon'];
  selectors.push(['oj', 'message', computedSeverity, 'icon'].join('-'));
  return selectors.join(' ');
};

MessageViewModel.prototype._computeCloseAffordance = function () {
  var message = this._properties.message;

  if (oj.StringUtils.isEmptyOrUndefined(message.closeAffordance)) {
    return MessageViewModel._getMessageDefault('closeAffordance');
  }

  return message.closeAffordance;
};

MessageViewModel.prototype._computeSound = function () {
  var message = this._properties.message;
  
  if (message.sound === undefined) {
    return MessageViewModel._getMessageDefault('sound');
  };
  
  return message.sound;
};

MessageViewModel.prototype._computeLabelCloseIcon = function () {
  var translations = this._properties.translations;
  
  if (oj.StringUtils.isEmptyOrUndefined(translations.labelCloseIcon)) {
    return oj.Translations.getTranslatedString('oj-ojMessage.labelCloseIcon');
  };
  
  return translations.labelCloseIcon;
};

MessageViewModel.prototype._computeSummary = function () {
  var message = this._properties.message;
  
  if (oj.StringUtils.isEmptyOrUndefined(message.summary)) {
    return undefined;
  };
  
  return message.summary;
};

MessageViewModel.prototype._computeDetail = function () {
  var message = this._properties.message;
  
  if (oj.StringUtils.isEmptyOrUndefined(message.detail)) {
    return undefined;
  };
  
  return message.detail;
};

MessageViewModel.prototype._handleCloseIcon = function (event) {
  this._closeMessage(event);
};

MessageViewModel.prototype._openMessage = function () {
  this._operationMediator = new OperationMediator(this._composite, 'open');

  // Invoke next micro-tick to allow the parent to apply bindings before opening the message.
  // When the parent is an oj-messages, it will need to subscribe to message events:
  // ojBeforeOpen, ojOpen and ojAnimateStart. These events are  queued by the message open
  // besides resolving :id bindings defining its content.
  Promise.resolve().then(function () {
    // notify the oj-messages to show the messages container so initial animation
    // will be seen.
    var eventParams = {
      bubbles: true,
      cancelable: false,
      detail: {
        message: this._properties.message
      }
    };

    this._composite.dispatchEvent(new CustomEvent('ojBeforeOpen', eventParams));

    var messageContainerElement = document.getElementById(this._messagesContainerId);
    var action = 'open';
    var options = this._getAnimateOptionDefaults(action);
    oj.AnimationUtils.startAnimation(messageContainerElement, action, options, this._composite)
      .then(function () {
        eventParams = {
          bubbles: true,
          cancelable: false,
          detail: {
            message: this._properties.message
          }
        };
        
        var computedSound = this._computeSound();
        
        if (computedSound !== 'none') {
          // Initialize the AudioContext if the user agent supports Web Audio API
          this._initAudioContext();
          this._playSound(computedSound);
        }
        // register the swipe handler for touch devices
        this._registerSwipeHandler();
        this._scheduleAutoClose();
        this._composite.dispatchEvent(new CustomEvent('ojOpen', eventParams));
      }.bind(this));
  }.bind(this));
};

MessageViewModel.prototype._handleKeydown = function (event) {
  // if the event has been prevented or closeAffordance property is not "defaults", no-opt.
  if (event.defaultPrevented || this._computeCloseAffordance() !== 'defaults') {
    return;
  }

  if (event.keyCode === $.ui.keyCode.ESCAPE) {
    event.preventDefault();
    this._closeMessage(event);
  }
};

MessageViewModel.prototype._playSound = function (sound) {

  // Custom URL was specified for the sound, using <audio> element is simple and best for this case.
  if (sound !== 'defaults') {
    var audio = document.createElement('AUDIO');
    audio.src = sound;

    // Handle any error due to possible invalid URL.
    audio.addEventListener('error', function () {
      oj.Logger.info(["JET oj-message id='", MessageViewModel._toSelector(this._composite),
        "': failed to load or play media file for URL in property message.sound='",
        sound, "'."].join(''));
    }.bind(this));

    audio.play();
  } else if (window.audioContext === undefined) {
    // User agent does not support web audio API
    oj.Logger.info(["JET oj-message id='", MessageViewModel._toSelector(this._composite),
      "': failed to load or play default sound for message because user agent does\n",
      "not support Web Audio API'"].join(''));
  } else {
    // Default gain value will be 100% of speaker volume which is fine
    var gainNode = window.audioContext.createGain();

    // Default destination is system speakers
    gainNode.connect(window.audioContext.destination);

    // Use default oscillator node type 'sine' and frequency '440 Hz', suffices for simple beep
    var oscillatorNode = window.audioContext.createOscillator();
    oscillatorNode.connect(gainNode);
    oscillatorNode.start();

    // Play for 10 ms
    oscillatorNode.stop(window.audioContext.currentTime + 0.01);
  }
};

MessageViewModel.prototype._initAudioContext = function () {
  if (window.audioContext === undefined) {
    try {
      // Create a page level AudioContext that all messages would use in this page. Browsers have
      //  limit on number of instances (usually 6), and AudioContext is designed to be shared per
      //  page. Webkit has a different constructor.
      window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      // no op
    }
  }
};

MessageViewModel.prototype._createObservables = function () {
  // Computed observables
  // anything used by the view bindings can't be obfuscated and is why it's defined in quotes.
  // this["computedSeverity"] = ko.pureComputed(this._computeSeverity.bind(this), this);
  // this["computedCategory"] = ko.pureComputed(this._computeCategory.bind(this), this);
  // this["computedLabelCloseIcon"] = ko.pureComputed(this._computeLabelCloseIcon.bind(this), this);
  // this["computedCloseAffordance"] = ko.pureComputed(this._computeCloseAffordance.bind(this), this);
  // workaround for  

  this.hasCloseAffordance = ko.observable(this._computeCloseAffordance() === 'defaults');
  this.computedIconStyle = ko.observable(this._computeIconStyle());
  this.computedIconClass = ko.observable(this._computeIconClass());
  this.computedSeverity = ko.observable(this._computeSeverity());
  this.computedCategory = ko.observable(this._computeCategory());
  this.computedTimestamp = ko.observable(this._computeTimestamp());
  this.computedLabelCloseIcon = ko.observable(this._computeLabelCloseIcon());
  this.computedSummary = ko.observable(this._computeSummary());
  this.computedDetail = ko.observable(this._computeDetail());
};

MessageViewModel.prototype._initDefaultTranslations = function () {
  var properties = this._properties;

  if (oj.StringUtils.isEmptyOrUndefined(properties.translations.labelCloseIcon)) {
    properties.translations.labelCloseIcon = this._computeLabelCloseIcon();
  }
};

MessageViewModel._getMessageDefault = function (propName) {
  return MessageViewModel._DEFAULTS.message[propName];
};

MessageViewModel._DEFAULTS = {
  autoTimeout: 4000,
  animation: {
    open: { effect: 'fadeIn', duration: '300ms' },
    close: { effect: 'fadeOut', duration: '300ms' },
  },
  message: {
    severity: 'none',
    autoTimeout: -1,
    closeAffordance: 'defaults',
    sound: 'none'
  }
};

MessageViewModel.prototype._getThemedAutoTimeoutDefault = function () {
  var themedDefaults = oj.ThemeUtils.parseJSONFromFontFamily('oj-message-option-defaults');
  if (themedDefaults && themedDefaults.autoTimeout) {
    return themedDefaults.autoTimeout;
  }
  return MessageViewModel._DEFAULTS.autoTimeout;
};

MessageViewModel.prototype._getAnimateOptionDefaults = function (action) {
  return MessageViewModel._DEFAULTS.animation[action];
};

MessageViewModel._toSelector = function (node) {
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
        return MessageViewModel._toSelector(node.parentNode) + ' > ' + selector;
      }
    }
  }

  return selector;
};

/**
 * Coordinate communications between an event being fulfilled and one or more promises
 * being resolved.  The window of time between the instance creation and the associated event
 * triggered is guarded by the {@link oj.BusyContext}.
 * @private
 * @constructor
 * @ignore
 * @param {Element} element to subscribe on the event type triggered on completion of the operation
 * @param {string} operation that completion will resolve one or more promises
 * @ojtsignore
 */
function OperationMediator(element, operation) {
  this._element = element;
  this._operation = operation;

  this._init();
}

/**
 * Registers an event handler on the element associated with the target operation.
 * The event handler will resolve one or more pending promises.  The convention
 * is the operation will raise a "oj" + operation event upon completion. The
 * event hander is one and done - unregistered after first delivery.
 * @instance
 * @private
 */
OperationMediator.prototype._init = function () {
  this._resolvedQueue = [];
  this._callback = this._eventHandler.bind(this);

  var operation = this._operation;
  var tokens = ['oj'];
  tokens.push(operation.charAt(0).toUpperCase());
  tokens.push(operation.slice(1));

  var eventType = tokens.join('');
  this._eventType = eventType;
  this._element.addEventListener(eventType, this._callback);

  // Add a busy state for the pending operation.  The busy state resolver will
  // be invoked when the resolved queue is delivered (operation completes).
  var busyContext = oj.Context.getContext(this._element).getBusyContext();
  var options = { description: this._getBusyStateDescription.bind(this, this._element,
    this._operation) };
  var resolve = busyContext.addBusyState(options);
  this.addPromiseExecutor(function (callback) {
    // Resolve busyness next-tick.  The ojOpen/ojClose events bubble
    // up to oj-messages All event processing will be at the parent level.
    // Keep the busy state until the parent has had a chance to act on
    // the open/close event.
    window.setImmediate(function () {
      callback();
    });
  }.bind(this, resolve));
};

/**
 * @private
 * @param {Element} element to subscribe on the event type triggered on completion of the operation
 * @param {string} operation that completion will resolve one or more promises
 * @returns {string} description of the busy state animation operation.
 */
OperationMediator.prototype._getBusyStateDescription = function (element, operation) {
  return [element.nodeName, " identified by '", MessageViewModel._toSelector(element),
    "' is busy animating on the '", operation, "' operation."].join('');
};

/**
 * Resolves the pending promises.
 *
 * @private
 * @param {string=} operation override sent to the resolverdQueue
 */
OperationMediator.prototype._deliverResolved = function (operation) {
  // Critical section - the registered resolve queue is disconnect from the
  // instance state so that a race condition will not occur - resolve promoise
  // adding new operations to the same queue.

  var resolvedQueue = this._resolvedQueue;
  this._resolvedQueue = [];

  // eslint-disable-next-line no-param-reassign
  operation = !operation ? this._operation : operation;
  this._operation = null;

  for (var i = 0; i < resolvedQueue.length; i++) {
    resolvedQueue[i](operation);
  }
};

/**
 * Force delivery of unresolved promises.
 */
OperationMediator.prototype.destroy = function () {
  // If the promise is swapped (component is destroyed)
  // before the event is fired, resolve with a "none" operation.
  this._deliverResolved('none');

  this._callback = null;
  this._element = null;
  this._operation = null;
  this._eventType = null;
};

/**
 * Event handler associated with completion of the target operation.
 * @private
 * @param {Event} event
 */
OperationMediator.prototype._eventHandler = function (event) {
  if (event.target === this._element) {
    this._element.removeEventListener(event.type, this._callback);
    this._deliverResolved();
    this._callback = null;
  }
};

/**
 * @return {string} Returns the pending operation
 */
OperationMediator.prototype.getPendingOperation = function () {
  return this._operation ? this._operation : 'none';
};

/**
 * A function that will be passed to other functions via the arguments resolve and reject.
 * The resolve function will be invoked when the event associated with completion of the
 * target operation is delivered to the target element.
 *
 * @public
 * @param {Function} resolve resultant function that will resovle a promise executor
 * @param {Function=} reject (not interested in the reject)
 */
// eslint-disable-next-line no-unused-vars
OperationMediator.prototype.addPromiseExecutor = function (resolve, reject) {
  this._resolvedQueue.push(resolve);
};

/**
 * Checks to see if there is a pending "open" or "close" operation.  If pending and it
 * is the same as the requested operation, the request silently fails.  If the current
 * operation is the inverse operation, we queue the current operation after the pending
 * operation is resolved.
 *
 * @param {string} operation currently requested
 * @param {Function} callback that should be invoked when the operation is the
 *                 inverse of the pending operation
 * @returns {boolean} <code>true</code> if a "close" or "open" operation is pending completion.
 */
OperationMediator.prototype.isOperationPending = function (operation, callback) {
  // if destroyed return false
  if (!this._element) {
    return false;
  }

  var isPending = false;
  var pendingOperation = this.getPendingOperation();
  if (operation === pendingOperation) {
    // Same request is already pending. Silently fail.
    oj.Logger.info(["An oj-message id='", MessageViewModel._toSelector(this._element),
      "' invoked a '", operation,
      "' operation while pending animation of the same type of operation. ",
      'The second request will be ignored.'].join(''));
    isPending = true;
  } else if (pendingOperation !== 'none') {
    oj.Logger.info(["An oj-message id='", MessageViewModel._toSelector(this._element),
      "' invoked a '", operation,
      "' operation while pending animation of a '", pendingOperation,
      "' operation. The second request will be invoked after the pending ",
      'operation completes.'].join(''));

    // Queue the operation after the pending operation has completed.
    this.addPromiseExecutor(callback);

    isPending = true;
  }
  return isPending;
};

oj.Composite.register('oj-message',
  {
    view: _MESSAGE_VIEW,
    viewModel: MessageViewModel,
    metadata: _MESSAGE_METADATA
  });

});