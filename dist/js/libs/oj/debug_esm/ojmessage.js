/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import 'ojs/ojcore';
import 'ojs/ojknockout';
import 'ojs/ojbutton';
import 'ojs/ojjquery-hammer';
import oj from 'ojs/ojcore-base';
import $ from 'jquery';
import { observable } from 'knockout';
import { startAnimation } from 'ojs/ojanimation';
import { isTouchSupported, getReadingDirection } from 'ojs/ojdomutils';
import { subtreeHidden } from 'ojs/ojcomponentcore';
import { register } from 'ojs/ojcomposite';
import Context from 'ojs/ojcontext';
import { Swipe, DIRECTION_ALL } from 'hammerjs';
import { info } from 'ojs/ojlogger';
import { parseJSONFromFontFamily } from 'ojs/ojthemeutils';
import { getComponentTranslations, getTranslatedString } from 'ojs/ojtranslation';

const ojMessage = {};

/**
 * @ojcomponent oj.ojMessage
 * @since 5.0.0
 * @ojdisplayname Message
 * @ojshortdesc A message conveys categorized information to the user, often regarding errors.
 *
 * @ojsignature {target: "Type", value:"class ojMessage extends JetElement<ojMessageSettableProperties>"}
 *
 * @ojoracleicon 'oj-ux-ico-message'
 * @ojuxspecs ['messages']
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
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
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
 *       <td><kbd>Swipe Right, Swipe Up</kbd></td>
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
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc.
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
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc.
 * @memberof oj.ojMessage
 */

// Attributes
// ///////////

/**
 * <p>Structured data specifying essential information to display a message on the UI.
 * @member
 * @name message
 * @memberof! oj.ojMessage
 * @instance
 * @since 5.0.0
 * @type {Object}
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
 * @ojshortdesc Specifies the URL for the custom image to be used as an icon representing the message. See the Help documentation for more information.
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
 * @ojshortdesc Specifies message category text which is shown next to the message icon. See the Help documentation for more information.
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
 * @ojvalue {string} "error" Error level message.
 * @ojvalue {string} "warning" Warning level message.
 * @ojvalue {string} "confirmation" Confirmation message.
 * @ojvalue {string} "info" Informational message.
 * @ojvalue {string} "none" Message status level not applicable.
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
 * @ojshortdesc Specifies a timestamp for the message to be displayed in the message header. See the Help documentation for more information.
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
 * @ojshortdesc Specifies the duration in milliseconds that the message will be shown before it closes automatically. See the Help documentation for more information.
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
 * @example <caption>Close icon is displayed when close-affordance is set to 'defaults'. This can
 *          be changed at application level using this theme variable (SCSS) :</caption>
 * $messageCloseIconDisplay: none !default;
 *
 * @example <caption>Close icon is not displayed when close-affordance is set to 'defaults', if
 *          the message is set to auto timeout when using mobile themes. This can be changed at
 *          application level using this theme variable (SCSS) :</caption>
 * $messageAutoTimeoutCloseIconDisplay: block !default;
 *
 * @ojshortdesc Specifies the UI affordance provided to end users to be able to close the message. See the Help documentation for more information.
 *
 * @expose
 * @type {string}
 * @name message.closeAffordance
 * @ojvalue {string} "none" No UI affordance is provided to close the message. Application has to
 * call the close() method to dismiss the message.
 * @ojvalue {string} "defaults" Use implicit affordance to best suit the native theme, efficient use
 * of available space, and screen touch capabilities.<br><br>A close 'X' icon is displayed in all cases
 * except in the case when the message is set to auto-timeout when using mobile themes. The display
 * of the close icon can be further controlled by using the theme variables as noted below. See
 * keyboard and touch end user information sections in this document for interaction options.
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
 * @ojshortdesc Specifies the sound to be played when a message is opened. This is needed for accessibility. See the Help documentation for more information.
 * @default "none"
 * @instance
 * @since 5.0.0
 * @access public
 * @memberof! oj.ojMessage
 */

/**
 * <p>Specifies the display options for contents of the message.
 *
 * @expose
 * @member
 * @name displayOptions
 * @memberof! oj.ojMessage
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
 * &lt;oj-message display-options="[[myMessageDisplayOptions]]">&lt;/oj-message>
 *
 * &lt;!-- Setting display-options using JSON notation -->
 * &lt;oj-message display-options='{"category": "none"}' message.summary="Some summary" message.detail="Some detail">&lt;/oj-message>
 *
 * &lt;!-- Setting the display-options sub-attributes -->
 * &lt;oj-message display-options.category="none" message.summary="Some summary" message.detail="Some detail">&lt;/oj-message>
 *
 * @example <caption>Get or set the <code class="prettyprint">displayOptions</code> property after initialization:</caption>
 * // getter
 * var displayOptions = myMessage.displayOptions;
 *
 * // setter
 * myMessage.displayOptions = {
 *     category: "none"
 * };
 */

/**
 *<p>Specifies display option for {@link oj.ojMessage#message.category} text in this message.</p>
 * <p>In Redwood theme, showing the category text is an anti-pattern. Set this attribute to "none".</p>
 *
 * @example <caption>Initialize the element with <code class="prettyprint">display-options.category</code> attribute:</caption>
 * &lt;oj-message display-options.category="none" message.summary="Some summary" message.detail="Some detail">&lt;/oj-message>
 *
 * @example <caption>Get or set the <code class="prettyprint">displayOptions.category</code> property after initialization:</caption>
 * // getter
 * var categoryOption = myMessage.getProperty("displayOptions.category");
 *
 * // setter
 * myMessage.setProperty("displayOptions.category", "none");
 *
 * @expose
 * @type {string}
 * @name displayOptions.category
 * @ojshortdesc Specifies the display option for message category text in this message.
 *
 * @ojvalue {string} "header" If the {@link oj.ojMessage#message.category} property is specified,
 *  its value will be displayed in the header region of the message next to message icon. If
 *  {@link oj.ojMessage#message.category} property is not specified, a translated text corresponding
 *  to the value of the {@link oj.ojMessage#message.severity} property will be displayed.
 * @ojvalue {string} "auto" The component decides whether and where the
 *  {@link oj.ojMessage#message.category} text is displayed. The behavior is same as 'header'
 *  option, but may change in future releases.
 * @ojvalue {string} "none" The {@link oj.ojMessage#message.category} text will not be displayed.
 * @default "auto"
 * @instance
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
 * @ojshortdesc A collection of translated resources from the translation bundle, or null if this component has no resources.
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

// Slots
// //////

/**
 * <p>The <code class="prettyprint">detail</code> slot is for the message's detail area.
 * The <code class="prettyprint">&lt;oj-message></code> element accepts DOM nodes as children
 * with the detail slot. This slot is useful to add links or buttons to the detail area. The
 * default template will just display the text value of 'message.detail' property for any message.
 *
 *
 * @ojslot detail
 * @ojshortdesc The detail slot accepts DOM nodes as children. It is useful for adding links or buttons to the message's detail area.
 * @ojmaxitems 1
 * @memberof oj.ojMessage
 * @since 6.2.0
 *
 * @example <caption>Initialize the message with detail content:</caption>
 * &lt;oj-message>
 *   &lt;div slot="detail">Message detail.
 *     &lt;a href="#">Click here for more info...&lt;/a>
 *   &lt;/div>
 * &lt;/oj-message>
 */

// Events
// ///////

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
 * @property {Object} message The message that was closed.
 * @ojsignature {target:"Type", value:"oj.ojMessage.Message", for:"message", jsdocOverride: true}
 */

// Currently animate events is public API, however we do NOT want applications to use this API.
// It is being removed in near future. Excluding it from JSDoc since v7.0.0 using @ignore hence.
/**
 * Triggered when the default animation is about to start for the open or close actions of the message.
 * The default animation can be cancelled by calling
 * <code class="prettyprint">event.preventDefault</code>.
 * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
 *
 * @ignore
 * @event
 * @memberof oj.ojMessage
 * @name animateStart
 * @ojshortdesc Triggered when the default animation is about to start for the open or close actions of the message. See the Help documentation for more information.
 * @instance
 * @since 5.0.0
 * @ojcancelable
 * @ojbubbles
 * @property {!Element} element Target of animation.
 * @property {"open"|"close"} action The action that triggers the animation.<br><br>
 *            Suggested values are:
 *                    <ul>
 *                      <li>"open" - when a message is opened.</li>
 *                      <li>"close" - when a message is closed.</li>
 *                    </ul>
 * @property {!function():void} endCallback If the event listener calls
 *            event.preventDefault to cancel the default animation, it must call the
 *            endCallback function when it finishes its own animation handling and any
 *            custom animation has ended.
 *
 * @example <caption>Add a listener for the
 *          <code class="prettyprint">ojAnimateStart</code> event to override the default
 *          "close" animation:</caption>
 * myMessage.addEventListener("ojAnimateStart", function(event) {
 *   // verify that the component firing the event is a component of interest and action is close
 *   if (event.detail.action == "close") {
 *     event.preventDefault();
 *     oj.AnimationUtils.slideOut(event.detail.element, {"persist":  "all"}).then(event.detail.endCallback);
 *   }
 * });
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

// Currently animate events is public API, however we do NOT want applications to use this API.
// It is being removed in near future. Excluding it from JSDoc since v7.0.0 using @ignore hence.
/**
 * Triggered when the default animation is about to end for the open or close actions of the message.
 * The default animation can be cancelled by calling
 * <code class="prettyprint">event.preventDefault</code>.
 * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
 *
 * @ignore
 * @event
 * @memberof oj.ojMessage
 * @name animateEnd
 * @ojshortdesc Triggered when the default animation is about to end for the open or close actions of the message.
 * @instance
 * @since 5.0.0
 * @ojcancelable
 * @ojbubbles
 *
 * @property {!Element} element Target of animation.
 * @property {"open"|"close"} action The action that triggered the animation.<br><br>
 *            The number of actions can vary from component to component.
 *            Suggested values are:
 *                    <ul>
 *                      <li>"open" - when a message is opened.</li>
 *                      <li>"close" - when a message is closed.</li>
 *                    </ul>
 *
 * @example <caption>Add a listener for the
 *          <code class="prettyprint">ojAnimateEnd</code> event to listen for the "close"
 *          ending animation:</caption>
 * myMessage.addEventListener("ojAnimateEnd", function(event) {
 *   // verify that the component firing the event is a component of interest and action is close
 *   if (event.detail.action == "close") {}
 * });
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
// ////////

/**
 * Closes the message.
 *
 * @expose
 * @function close
 * @memberof! oj.ojMessage
 * @instance
 * @since 5.0.0
 * @return {void}
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
 * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
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
// //////////

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

/**
 * @typedef {Object} oj.ojMessage.DisplayOptions
 * @property {"header"|"none"|"auto"} [category] Defines display option for the category text in the
 *  message.
 */

var _MESSAGE_VIEW =
  '<div :id="[[containerId]]" :class="[[computedMessageContainerSelectors]]" on-keydown="[[handleKeydown]]">' +
  '  <div class="oj-message-header">' +
  '    <div class="oj-message-leading-header" :title="[[computedCategory]]">' +
  '      <oj-bind-if test="[[computedIconStyle]]">' +
  '        <div class="oj-component-icon oj-message-status-icon oj-message-custom-icon" ' +
  '         role="presentation" :title="[[computedCategory]]" ' +
  '         :style.background="[[computedIconStyle]]">' +
  '        </div>' +
  '      </oj-bind-if>' +
  '      <oj-bind-if test="[[computedIconClass]]">' +
  '        <div role="presentation" :title="[[computedCategory]]" :class="[[computedIconClass]]">' +
  '        </div>' +
  '      </oj-bind-if>' +
  '      <oj-bind-if test="[[computedCategory]]">' +
  '        <div class="oj-message-category oj-message-title" tabindex="-1">' +
  '          <h1 :title="[[computedCategory]]">' +
  '            <oj-bind-text value="[[computedCategory]]"></oj-bind-text> ' +
  '          </h1>' +
  '        </div>' +
  '      </oj-bind-if>' +
  '      <oj-bind-if test="[[!computedCategory() && computedSummary()]]">' +
  '        <div class="oj-message-summary oj-message-title" tabindex="-1">' +
  '          <oj-bind-text value="[[computedSummary]]"></oj-bind-text>' +
  '        </div>' +
  '      </oj-bind-if>' +
  '    </div>' +
  '    <div class="oj-message-trailing-header">' +
  '      <oj-bind-if test="[[formattedTimestamp]]">' +
  '        <div class="oj-message-timestamp">' +
  '          <oj-bind-text value="[[formattedTimestamp]]"></oj-bind-text> ' +
  '        </div>' +
  '      </oj-bind-if>' +
  '      <oj-bind-if test="[[hasCloseAffordance]]">' +
  '        <div :class="[[computedMessageCloseSelectors]]">' +
  '          <oj-button class="oj-button-sm" display="icons" chroming="borderless" on-click="[[handleCloseIcon]]">' +
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
  '    <oj-bind-if test="[[computedCategory]]">' +
  '      <div class="oj-message-summary">' +
  '        <oj-bind-text value="[[computedSummary]]"></oj-bind-text>' +
  '      </div>' +
  '    </oj-bind-if>' +
  '    <div class="oj-message-detail">' +
  '      <oj-bind-slot name="detail">' +
  '        <oj-bind-text value="[[computedDetail]]"></oj-bind-text>' +
  '      </oj-bind-slot>' +
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
  this.messageCreatedTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  this.handleKeydown = this._handleKeydown.bind(this);

  // Store a reference to the slotCounts which will be later used to determine if message detail is present
  this._slotCounts = context.slotCounts;

  // Store a reference to the properties for any later use
  this._properties = context.properties;
  this._createObservables();

  // Update the severity class on the root element. Since this is the initial
  // render no need to check/remove any severity style classes as they would not
  // exist.
  // This method relies on the observables, so call this method after the observables
  // are updated and represent the current severity.
  this._updateSeverityStyleClass(null);
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
        return path === subproperty.path;
      }

      // set the entire message object
      var previousValue = _detail.previousValue[subPropName];
      var value = _detail.value[subPropName];
      return value !== previousValue;
    }

    return false;
  }

  // workaround for 

  if (subPropertyChanged(detail, 'message', 'autoTimeout')) {
    this.computedMessageCloseSelectors(this._computeMessageCloseSelectors());
    this._clearAutoClose();
    this._scheduleAutoClose();
  }

  if (subPropertyChanged(detail, 'message', 'closeAffordance')) {
    this.hasCloseAffordance(this._computeCloseAffordance() === 'defaults');
    this._unregisterSwipeHandler();
    this._registerSwipeHandler();
  }

  if (subPropertyChanged(detail, 'message', 'icon')) {
    this.computedIconStyle(this._computeIconStyle());
    this.computedIconClass(this._computeIconClass());
    this.computedMessageContainerSelectors(this._computeMessageContainerSelectors());
  }

  if (
    subPropertyChanged(detail, 'message', 'category') ||
    subPropertyChanged(detail, 'displayOptions', 'category')
  ) {
    this.computedCategory(this._computeCategory());
    this.computedMessageContainerSelectors(this._computeMessageContainerSelectors());
  }

  // category if unspecified and iconclass are derived from severity, recompute those
  if (subPropertyChanged(detail, 'message', 'severity')) {
    // get the previous severity from the observable before updating it
    const previousSeverity = this.computedSeverity();

    this.computedSeverity(this._computeSeverity());
    this.computedCategory(this._computeCategory());
    this.computedIconClass(this._computeIconClass());
    this.computedMessageContainerSelectors(this._computeMessageContainerSelectors());

    // Update the severity style classes on the root element.
    // This method relies on the observables, so call this method after the observables
    // are updated and represent the current severity.
    this._updateSeverityStyleClass(previousSeverity);
  }

  if (subPropertyChanged(detail, 'message', 'timestamp')) {
    this.formattedTimestamp(this._formatTimestamp());
  }

  if (subPropertyChanged(detail, 'message', 'summary')) {
    this.computedSummary(this._computeSummary());
  }

  if (subPropertyChanged(detail, 'message', 'detail')) {
    this.computedDetail(this._computeDetail());
    this.computedMessageContainerSelectors(this._computeMessageContainerSelectors());
  }

  if (subPropertyChanged(detail, 'translations', 'labelCloseIcon')) {
    this.computedLabelCloseIcon(this._computeLabelCloseIcon());
  }

  if (subPropertyChanged(detail, 'translations', 'categories')) {
    this.computedCategory(this._computeCategory());
  }
};

MessageViewModel.prototype._registerSwipeHandler = function () {
  if (isTouchSupported() && this._computeCloseAffordance() === 'defaults') {
    var messageContainerElement = $(document.getElementById(this._messagesContainerId));
    var options = {
      recognizers: [[Swipe, { direction: DIRECTION_ALL }]],
      cssProps: {
        // By default Hammer disables user selection when registering swipe events
        // this is for improving the user interaction in touch based desktops. But, we
        // need to override this behavior, as users should be able to copy the message
        // text.
        userSelect: 'auto'
      }
    };

    var swipeDirections =
      getReadingDirection() === 'rtl' ? 'swipeleft swipeup' : 'swiperight swipeup';
    this._hammerSwipe = messageContainerElement.ojHammer(options).on(
      swipeDirections,
      function (event) {
        event.preventDefault();
        // JET-33259 - research the ability to select text in message component while on a touch enabled desktop
        // In touch enabled desktops, close the message only if the gesture is made using touch action. Do nothing
        // if the gesture is made using mouse action. This would allow users to select text without dismissing the
        // message.
        if (event.gesture && event.gesture.pointerType !== 'mouse') {
          this._closeMessage();
        }
      }.bind(this)
    );
  }
};

MessageViewModel.prototype._unregisterSwipeHandler = function () {
  if (isTouchSupported() && this._hammerSwipe) {
    var swipeDirections =
      getReadingDirection() === 'rtl' ? 'swipeleft swipeup' : 'swiperight swipeup';
    this._hammerSwipe.off(swipeDirections);
    delete this._hammerSwipe;
  }
};

MessageViewModel.prototype._scheduleAutoClose = function () {
  // Schedule auto-close if applicable
  if (this._computeAutoTimeout() > -1) {
    // prettier-ignore
    this._autoCloseTimer = window.setTimeout( // @HTMLUpdateOK
      this._closeMessage.bind(this),
      this._computeAutoTimeout()
    );
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
  return !!(messageContainerElement && $(messageContainerElement).is(':visible'));
};

MessageViewModel.prototype._closeMessage = function (event) {
  var messageContainerElement = document.getElementById(this._messagesContainerId);

  // Possible that the oj-message element may be disconnected/removed while close is in progress,
  //  guard against this case where messageContainerElement is removed
  if (messageContainerElement) {
    // unregister the swipe handler
    this._unregisterSwipeHandler();
    this._clearAutoClose();
    var mediator = this._operationMediator;

    // When messages are inlined, the parent oj-messages takes care of open animation, but close
    //  animation is taken care here by the component. Since we did not do the open animation no
    //  mediator was used
    if (mediator) {
      // if we are pending the open operation, the close will be invoked after the open is done
      if (mediator.isOperationPending('close', this._closeMessage.bind(this, event))) {
        return;
      }
      mediator.destroy();
    }

    this._operationMediator = new OperationMediator(this._composite, 'close');

    var action = 'close';
    var options = this._getAnimateOptionDefaults(action);
    // eslint-disable-next-line no-undef
    startAnimation(messageContainerElement, action, options, this._composite).then(
      function () {
        // We will just hide the message container, but not discard it, the ojClose listener
        // could discard it if needed.
        $(messageContainerElement).hide();
        subtreeHidden(messageContainerElement);

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
      }.bind(this)
    );
  }
};

MessageViewModel.prototype._computeSeverity = function () {
  var message = this._properties.message;

  if (oj.StringUtils.isEmptyOrUndefined(message.severity)) {
    return MessageViewModel._getMessageDefault('severity');
  }

  // oj.Message has 'fatal' severity which is no different from 'error', oj-message does not support
  //  'fatal' for this reason. Map 'fatal' to 'error' just to be compatible with cases where the
  //  message stream could come from existing oj.Message sources.
  return message.severity === 'fatal' ? 'error' : message.severity;
};

MessageViewModel.prototype._formatTimestamp = function () {
  var message = this._properties.message;

  if (!oj.StringUtils.isEmptyOrUndefined(message.timestamp)) {
    // loading library could be long running op. Set a busy state.
    var busyContext = Context.getContext(this._composite).getBusyContext();
    var options = {
      description: 'oj-message is busy loading required libraries and processing timestamp'
    };
    var resolve = busyContext.addBusyState(options);

    // Our NLS rules restrict that the numerals in the date string should be in latin digits
    //  regardless of the locale/language. The standard JS Date/DateTimeFormat global objects in
    //  its toLocaleString/toLocaleTimeString/format methods always translates the numerals also
    //  into respective languages (eg. ar-EG), without providing an option. Hence we need to use our
    //  default converter that deals with our NLS requirements already. However, the validation
    //  module is significantly huge, having static dependency on them increases our core module
    //  size, so optimizing performance by loading it dynamically and asynchronously only when
    //  timestamp is defined.
    var converterPromise = this._getConverterPromise(message.timestamp);

    converterPromise.then(
      function (converter) {
        try {
          var formattedTimestamp = converter.format(message.timestamp);

          // fine to update the observable directly with resolved value, it will also be updated
          //  in propertyChanged() if timestamp was to change
          this.formattedTimestamp(formattedTimestamp);
        } catch (e) {
          // expect oj.ConverterError if supplied value is not valid
          info(`JET oj-message: Invalid value for message.timestamp: ${message.timestamp}`);
        } finally {
          resolve();
        }
      }.bind(this)
    );
  }

  return undefined;
};

MessageViewModel.prototype._getConverterPromise = function (timestamp) {
  const dateTimeConverterLoadPromise = import('ojs/ojconverter-datetime');
  return dateTimeConverterLoadPromise.then(
    function (__DateTimeConverter) {
      // use default format as in UX specs
      var pattern = this._isDateToday(timestamp) ? 'hh:mm a' : 'MM/dd/yy, hh:mm a';
      return new __DateTimeConverter.IntlDateTimeConverter({ pattern: pattern });
    }.bind(this)
  );
};

MessageViewModel.prototype._isDateToday = function (isoDate) {
  var todayDate = new Date();
  var suppliedDate = new Date(isoDate);

  return (
    todayDate.getUTCFullYear() === suppliedDate.getUTCFullYear() &&
    todayDate.getUTCMonth() === suppliedDate.getUTCMonth() &&
    todayDate.getUTCDate() === suppliedDate.getUTCDate()
  );
};

// Computes the category value for the bound variable. If category property is not specified, a
//  default value based on the severity property is used. The display of category text is further
//  dependent on what the display-options.category property value is.
MessageViewModel.prototype._computeCategory = function () {
  var displayOptions = this._properties.displayOptions;

  if (displayOptions && displayOptions.category && displayOptions.category === 'none') {
    return undefined;
  }

  var message = this._properties.message;

  if (!oj.StringUtils.isEmptyOrUndefined(message.category)) {
    return message.category;
  }

  var severity = this._computeSeverity();

  // If severity is none, return undefined as we do not want to show the category
  if (severity === 'none') {
    return undefined;
  }

  var translations = this._properties.translations;

  var translatedCategory =
    translations && translations.categories ? translations.categories[severity] : undefined;

  if (oj.StringUtils.isEmptyOrUndefined(translatedCategory)) {
    // Ideally the custom element bridge should have set the translations sub-properties in this
    //  precedence (which is what the baseComponent in JQUI world did):
    //  1. Instance level override provided by app dev
    //  2. Localized value obtained from the bundle
    // However custom element bridge is not doing #2 (discussing with architects), fine to fetch
    //  from bundle in lieu of #2.
    translatedCategory = getComponentTranslations('oj-ojMessage').categories[severity];
  }

  return translatedCategory;
};

MessageViewModel.prototype._computeAutoTimeout = function () {
  var message = this._properties.message;

  if (isNaN(message.autoTimeout)) {
    return MessageViewModel._getMessageDefault('autoTimeout');
  }

  if (message.autoTimeout === 0) {
    return this._getThemedAutoTimeoutDefault();
  }

  return message.autoTimeout;
};

MessageViewModel.prototype._computeIconStyle = function () {
  var message = this._properties.message;

  if (oj.StringUtils.isEmptyOrUndefined(message.icon)) {
    return undefined;
  }

  return ["url('", message.icon, "') no-repeat"].join('');
};

MessageViewModel.prototype._computeIconClass = function () {
  var message = this._properties.message;

  if (!oj.StringUtils.isEmptyOrUndefined(message.icon)) {
    return undefined;
  }

  var computedSeverity = this._computeSeverity();

  if (computedSeverity === 'none') {
    return undefined;
  }

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

MessageViewModel.prototype._computeMessageCloseSelectors = function () {
  if (this._computeAutoTimeout() > -1) {
    return 'oj-message-close oj-message-auto-timeout-close';
  }

  return 'oj-message-close';
};

MessageViewModel.prototype._computeMessageContainerSelectors = function () {
  let messageContainerSelectors = ['oj-message-container'];

  // Add no icon selector if no icons are specified, add relevent selectors
  // Simple logical not is sufficient for checking the existance. Since oj-bind-if
  // is testing for the same condition, we need this to be consistent.
  if (!this._computeIconStyle() && !this._computeIconClass()) {
    // No icon will be shown, add oj-message-no-icon selector to the container
    messageContainerSelectors.push('oj-message-no-icon');
  }

  // Add no detail selector if neither a detail slot nor a valid detail text is present
  if (!this._isDetailShown()) {
    messageContainerSelectors.push('oj-message-no-detail');
  }

  return messageContainerSelectors.join(' ');
};

MessageViewModel.prototype._computeSound = function () {
  var message = this._properties.message;

  if (message.sound === undefined) {
    return MessageViewModel._getMessageDefault('sound');
  }

  return message.sound;
};

MessageViewModel.prototype._computeLabelCloseIcon = function () {
  var translations = this._properties.translations;

  if (oj.StringUtils.isEmptyOrUndefined(translations.labelCloseIcon)) {
    // see comments in _computeCategory() that applies here as well
    return getTranslatedString('oj-ojMessage.labelCloseIcon');
  }

  return translations.labelCloseIcon;
};

MessageViewModel.prototype._computeSummary = function () {
  var message = this._properties.message;

  if (oj.StringUtils.isEmptyOrUndefined(message.summary)) {
    return undefined;
  }

  return message.summary;
};

MessageViewModel.prototype._computeDetail = function () {
  var message = this._properties.message;

  if (oj.StringUtils.isEmptyOrUndefined(message.detail)) {
    return undefined;
  }

  return message.detail;
};

MessageViewModel.prototype._handleCloseIcon = function (event) {
  this._closeMessage(event);
};

MessageViewModel.prototype._openMessage = function () {
  var messageContainerElement = document.getElementById(this._messagesContainerId);

  // Possible that the oj-message element may be disconnected/removed while open is in progress,
  //  guard against this case where messageContainerElement is removed
  if (messageContainerElement) {
    // Open animation for inlined message is taken care by the parent oj-messages. More comments
    //  on this below.
    if (this._isInlinedChildOfOjMessages()) {
      this._prepareMessageAtOpen();
    } else {
      this._operationMediator = new OperationMediator(this._composite, 'open');

      // notify the oj-messages to show the messages container so initial animation
      // will be seen.
      var eventParams = {
        bubbles: true,
        cancelable: false,
        detail: {
          message: this._properties.message
        }
      };

      // When the parent is an oj-messages, it will subscribe to message events ojBeforeOpen, ojOpen
      //  and ojAnimateStart for dealing with live region updates and to override animation based on
      //  its layout. For the case of inlined oj-message children though (in default slot), these
      //  events do not get delivered, since the parent oj-messages is not created yet. For this
      //  case, oj-messages will animate the inlined children as soon as it is created, and not in
      //  the ojAnimateStart listener.
      this._composite.dispatchEvent(new CustomEvent('ojBeforeOpen', eventParams));

      var action = 'open';
      var options = this._getAnimateOptionDefaults(action);

      // eslint-disable-next-line no-undef
      startAnimation(messageContainerElement, action, options, this._composite).then(
        function () {
          eventParams = {
            bubbles: true,
            cancelable: false,
            detail: {
              message: this._properties.message
            }
          };

          this._prepareMessageAtOpen();
          this._composite.dispatchEvent(new CustomEvent('ojOpen', eventParams));
        }.bind(this)
      );
    }
  }
};

MessageViewModel.prototype._isInlinedChildOfOjMessages = function () {
  var messagesAncestor = this._findMessagesAncestor();
  // If messages property is specified on oj-messages, the inlined oj-message children in its
  //  default slot are excluded.
  return messagesAncestor && !messagesAncestor.getProperty('messages');
};

MessageViewModel.prototype._findMessagesAncestor = function () {
  var ancestor = this._composite.parentElement;

  for (; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor.nodeName.startsWith('OJ-')) {
      // stop at first ancestor with JET custom tag.
      return ancestor.nodeName === 'OJ-MESSAGES' ? ancestor : null;
    }
  }

  return null;
};

MessageViewModel.prototype._isDetailShown = function () {
  // Check if a detail slot is provided
  if (MessageViewModel._SLOT.DETAIL in this._slotCounts) {
    // We cannot determine if the provided slot renders content or not. So for our case,
    // we are assuming that if a slot is provided, message detail exists.
    return true;
  }

  // The _computeDetail method does all sanity checks and returns undefined it any of those checks fails,
  // so checking for undefined is sufficient to determine of the text is provided or not.
  if (this._computeDetail() !== undefined) {
    return true;
  }

  // When both the category and summary is specified, then the summary will be shown in the detail area.
  // So, this case should be treated as a message with detail, otherwise we do not have anything in the
  // message detail area.
  return this._computeCategory() !== undefined && this._computeSummary() !== undefined;
};

// Takes care of few additional stuff on the already opened (stamped case)/to-be-opened
//  (inlined case) message. For inlined case, we have 2 limitations as noted below, but we are okay
//  with it since we dont care to provide accurate functionality for inlined usecases (unusual).
MessageViewModel.prototype._prepareMessageAtOpen = function () {
  var computedSound = this._computeSound();

  if (computedSound !== 'none') {
    // Initialize the AudioContext if the user agent supports Web Audio API
    this._initAudioContext();
    // 1. for inlined children case, we'd play sound a bit before the message actually is opened by
    //  the parent oj-messages.
    this._playSound(computedSound);
  }
  // register the swipe handler for touch devices
  this._registerSwipeHandler();

  // 2. for inlined children case, we'd be short of few seconds since we dont know when the parent
  //  oj-messages opens the message.
  this._scheduleAutoClose();
};

MessageViewModel.prototype._handleKeydown = function (event) {
  // if the event has been prevented or closeAffordance property is not "defaults", no-opt.
  if (event.defaultPrevented || this._computeCloseAffordance() !== 'defaults') {
    return;
  }

  // keyCode is deprecated and it's not supported on some browsers.
  if (event.keyCode === $.ui.keyCode.ESCAPE || event.key === 'Escape') {
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
      info(`JET oj-message: Failed to load media from URL in message.sound='${sound}'.`);
    });

    var promise = audio.play();

    if (promise !== undefined) {
      promise
        .then(function () {
          // All is well with autoplay
        })
        .catch(function (error) {
          // Autoplay failed. Possible causes 1. Browser prevents auto-play unless certain rules are
          // met (which varies by browsers), 2. The audio file resource does not exist or cannot be
          // loaded.
          info(
            `JET oj-message: Failed to play specified sound: '${sound}'. Error: ${error}`
          );
        });
    }
  } else if (window.audioContext === undefined) {
    // User agent does not support web audio API
    info(
      'JET oj-message: Failed to play default sound as the browser does not support Web Audio API'
    );
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
  this.hasCloseAffordance = observable(this._computeCloseAffordance() === 'defaults');
  this.computedIconStyle = observable(this._computeIconStyle());
  this.computedIconClass = observable(this._computeIconClass());
  this.computedSeverity = observable(this._computeSeverity());
  this.computedCategory = observable(this._computeCategory());
  this.formattedTimestamp = observable(this._formatTimestamp());
  this.computedLabelCloseIcon = observable(this._computeLabelCloseIcon());
  this.computedMessageCloseSelectors = observable(this._computeMessageCloseSelectors());
  this.computedMessageContainerSelectors = observable(this._computeMessageContainerSelectors());
  this.computedSummary = observable(this._computeSummary());
  this.computedDetail = observable(this._computeDetail());
};

/**
 * Updates the severity styles based on the current severity
 *
 * @param {string=} previousSeverity An optional parameter representing the previous severity.
 *                                   If provided, the corresponding class will be removed.
 *
 * @private
 * @instance
 * @ignore
 */
MessageViewModel.prototype._updateSeverityStyleClass = function (previousSeverity) {
  if (previousSeverity != null) {
    // Remove the style class representing the previous severity
    const previousStyleClass = MessageViewModel._getStyleClassForSeverity(previousSeverity);
    this._composite.classList.remove(previousStyleClass);
  }

  // Add the class for current severity
  const styleClass = MessageViewModel._getStyleClassForSeverity(this.computedSeverity());
  if (styleClass) {
    // add the style class only if it is available
    this._composite.classList.add(styleClass);
  }
};

MessageViewModel._getMessageDefault = function (propName) {
  return MessageViewModel._DEFAULTS.message[propName];
};

MessageViewModel._DEFAULTS = {
  autoTimeout: 4000,
  animation: {
    open: { effect: 'fadeIn', duration: '300ms' },
    close: { effect: 'fadeOut', duration: '300ms' }
  },
  message: {
    severity: 'none',
    autoTimeout: -1,
    closeAffordance: 'defaults',
    sound: 'none'
  }
};

/**
 * Computes the style class that has to be added in the root element based on
 * the severity of the message
 *
 * @param {string} severity The message severity whose style class is needed
 * @returns {string|undefined} The corresponding style class if one is available, undefined otherwise
 *
 * @private
 * @static
 * @ignore
 */
MessageViewModel._getStyleClassForSeverity = function (severity) {
  return MessageViewModel._SEVERITY_STYLE_CLASS_MAP[severity];
};

/**
 * Maps the severity values to the corresponding element class that needs to
 * be added to the wrapper element
 *
 * @private
 * @static
 * @constant
 * @ignore
 */
MessageViewModel._SEVERITY_STYLE_CLASS_MAP = {
  confirmation: 'oj-confirmation',
  error: 'oj-error',
  info: 'oj-info',
  warning: 'oj-warning'
};

/**
 * A map that contains supported slot names
 *
 * @private
 * @static
 * @constant
 * @ignore
 */
MessageViewModel._SLOT = {
  DETAIL: 'detail'
};

MessageViewModel.prototype._getThemedAutoTimeoutDefault = function () {
  var themedDefaults = parseJSONFromFontFamily('oj-message-option-defaults');
  if (themedDefaults && themedDefaults.autoTimeout) {
    return themedDefaults.autoTimeout;
  }
  return MessageViewModel._DEFAULTS.autoTimeout;
};

MessageViewModel.prototype._getAnimateOptionDefaults = function (action) {
  return MessageViewModel._DEFAULTS.animation[action];
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
  var busyContext = Context.getContext(this._element).getBusyContext();
  var options = {
    description: this._getBusyStateDescription.bind(this, this._element, this._operation)
  };
  var resolve = busyContext.addBusyState(options);
  this.addPromiseExecutor(
    function (callback) {
      // Resolve busyness next-tick.  The ojOpen/ojClose events bubble
      // up to oj-messages All event processing will be at the parent level.
      // Keep the busy state until the parent has had a chance to act on
      // the open/close event.
      window.setImmediate(function () {
        callback();
      });
    }.bind(this, resolve)
  );
};

/**
 * @private
 * @param {Element} element to subscribe on the event type triggered on completion of the operation
 * @param {string} operation that completion will resolve one or more promises
 * @returns {string} description of the busy state animation operation.
 */
OperationMediator.prototype._getBusyStateDescription = function (element, operation) {
  return `${element.nodeName} is busy animating on the ${operation} operation`;
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
    info(
      [
        "JET oj-message: invoked a '",
        operation,
        "' operation while pending animation of the same type of operation. ",
        'The second request will be ignored.'
      ].join('')
    );
    isPending = true;
  } else if (pendingOperation !== 'none') {
    info(
      [
        "JET oj-message: invoked a '",
        operation,
        "' operation while pending animation of a '",
        pendingOperation,
        "' operation. The second request will be invoked after the pending ",
        'operation completes.'
      ].join('')
    );

    // Queue the operation after the pending operation has completed.
    this.addPromiseExecutor(callback);

    isPending = true;
  }
  return isPending;
};

var __oj_message_metadata = 
{
  "properties": {
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
    "message": {
      "type": "object",
      "properties": {
        "autoTimeout": {
          "type": "number",
          "value": -1
        },
        "category": {
          "type": "string",
          "value": ""
        },
        "closeAffordance": {
          "type": "string",
          "enumValues": [
            "defaults",
            "none"
          ],
          "value": "defaults"
        },
        "detail": {
          "type": "string",
          "value": ""
        },
        "icon": {
          "type": "string",
          "value": ""
        },
        "severity": {
          "type": "string",
          "enumValues": [
            "confirmation",
            "error",
            "info",
            "none",
            "warning"
          ],
          "value": "none"
        },
        "sound": {
          "type": "string",
          "value": "none"
        },
        "summary": {
          "type": "string",
          "value": ""
        },
        "timestamp": {
          "type": "string",
          "value": ""
        }
      }
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "categories": {
          "type": "object",
          "properties": {
            "confirmation": {
              "type": "string"
            },
            "error": {
              "type": "string"
            },
            "info": {
              "type": "string"
            },
            "none": {
              "type": "string"
            },
            "warning": {
              "type": "string"
            }
          }
        },
        "labelCloseIcon": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "close": {},
    "getProperty": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojClose": {}
  },
  "extension": {}
};
/* global __oj_message_metadata */
// eslint-disable-next-line no-undef
register('oj-message', {
  view: _MESSAGE_VIEW,
  viewModel: MessageViewModel,
  metadata: __oj_message_metadata
});

export { ojMessage };
