/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'ojs/ojcomponentcore', 'ojs/ojcomposite'],
       function(oj)
{

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */
 /**
 * @ojcomponent oj.ojAvatar
 * @ojsignature {target: "Type", value: "class ojAvatar extends JetElement<ojAvatarSettableProperties>"}
 * @since 4.0.0
 * @ojstatus preview
 * @ojshortdesc An icon capable of displaying a custom image, initials, or a placeholder image.
 *
 * @classdesc
 * <h3 id="avatarOverview-section">
 *   JET Avatar
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#avatarOverview-section"></a>
 * </h3>
 * <p>Description: Themeable, WAI-ARIA-compliant element that often represents a person.</p>
 * <p>A JET avatar is an icon capable of displaying
 * a custom image, or initials, or a placeholder image.  The order of precedence for
 * what is displayed, in order from highest to lowest, is:</p>
 * <ol>
 *  <li>Custom image specified through the "src" attribute</li>
 *  <li>Initials specified through the "initials" attribute</li>
 *  <li>Default placeholder image</li>
 * </ol>
 * <pre class="prettyprint">
 * <code>//Avatar with initials
 *&lt;oj-avatar initials="AB">
 * &lt;/oj-avatar>
 *</code></pre>
 *  <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 *  </h3>
 *
 * <p>The application <b>must</b> set role and aria-label for accessibility purposes.  JET Avatar does not have
 * any interaction with the application, therefore it is not keyboard navigable by default.
 * The aria-label will be picked up by the tabbable/focusable parent unless it is
 * overriden by the application.
 * The application can set a tooltip by setting the title attribute of the avatar.
 *
 *
 * <p>In order to meet accessibility requirements for text, color contrast ratio
 * between the background color and text must be
 * greater than 4.5 for the two smallest avatars and 3.1 for the five larger avatars.
 * Avatar's default background satisfies the 3.1 color contrast ratio.  The background
 * will automatically be darkened for the two smallest sizes to satisfy the more
 * stringent 4.5 contrast ratio.  If colors are customized through theming, the
 * application is responsible for specifying colors that satisfy the 3.1 contrast ratio.
 * The custom background color will be automatically darkened as well for the two smallest avatars.
 *
 * <p>The src attribute will display the image as a background-image.  These images do
 * not appear in high contrast mode.  For this reason, initials must be specified and
 * and will be shown instead.
 *
 *
 * <h3 id="image-section">
 *   Image
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#image-section"></a>
 *  </h3>
 *
 * <p>The avatar will display the image provided from the src attribute if the src
 * attribute is populated.  If the src attribute is not provided and the initials have been,
 * the initials will be displayed.  If neither src nor initials attributes are populated,
 * a single person placeholder image is shown.
 * Use the class oj-avatar-group-image to use the group placeholder image.
 * Examples displaying each type of avatar:
 * <pre class="prettyprint">
 * <code>//Individual Placeholder
 * &lt;oj-avatar>
 *  &lt;/oj-avatar>
 * //Group Placeholder
 * &lt;oj-avatar class="oj-avatar-group-image">
 *  &lt;/oj-avatar>
 * //Initials
 *&lt;oj-avatar initials="AB">
 * &lt;/oj-avatar>
 * //Image
 *&lt;oj-avatar initials="AB" src="image.jpg">
 * &lt;/oj-avatar>
 *</code></pre>
 *
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 * <p> The following CSS classes can be applied by the page author as needed.</p>
 * {@ojinclude "name":"stylingDoc"}
 */
 /**
 * Specifies the size of the avatar.
 * @expose
 * @name size
 * @memberof oj.ojAvatar
 * @ojshortdesc Specifies the size of the avatar.
 * @instance
 * @type {string}
 * @ojvalue {string} "xxs" {"description": "extra, extra small avatar", "displayName": "XXS"}
 * @ojvalue {string} "xs" {"description": "extra small avatar", "displayName": "XS"}
 * @ojvalue {string} "sm" {"description": "small avatar", "displayName": "SM"}
 * @ojvalue {string} "md" {"description": "medium avatar, default value", "displayName": "MD"}
 * @ojvalue {string} "lg" {"description": "large avatar", "displayName": "LG"}
 * @ojvalue {string} "xl" {"description": "extra large avatar", "displayName": "XL"}
 * @ojvalue {string} "xxl" {"description": "extra, extra large avatar", "displayName": "XXL"}
 * @ojvalueskeeporder
 * @default "md"
 * @example <caption>Renders avatar displaying default placeholder image with <code class="prettyprint">size</code>
 * attribute set to large</caption>
 * &lt;oj-avatar size='lg'>&lt;/oj-avatar>
 * @example <caption>Get or set the <code class="prettyprint">size</code> property after initialization</caption>
 * //Get avatar size
 * var size = myAvatar.size;
 *
 * //Set size property to xs
 * myAvatar.size = "xs";
 */
 /**
 * Specifies the initials of the avatar.  Will only be displayed if the src attribute is null.
 * Required if src attribute is provided for accessibility purposes.  Will be displayed
 * if the src attribute is not specified, or in high contrast mode for accessibility
 * purposes.
 * @expose
 * @name initials
 * @ojtranslatable
 * @ojshortdesc Specifies the initials of the avatar.
 * @memberof oj.ojAvatar
 * @instance
 * @type {string}
 * @default null
 * @example <caption>Renders a default medium avatar with initials</caption>
 * &lt;oj-avatar initials='AB'>&lt;/oj-avatar>
 * @example <caption>Get or set the <code class="prettyprint">initials</code> property after initialization</caption>
 * //Get avatar initials
 * var initials = myAvatar.initials;
 *
 * //Set initials property to 'NT'
 * myAvatar.initials = "NT";
 */
 /**
 * Specifies the src for the image of the avatar.  Image will be rendered as a background image.
 * In high contrast mode, initials will be displayed instead since background images
 * will not be rendered.
 * @ojshortdesc Specifies the src for the image of the avatar.
 * @expose
 * @name src
 * @memberof oj.ojAvatar
 * @instance
 * @type {string}
 * @default null
 * @example <caption>Renders a default medium avatar with a image</caption>
 * &lt;oj-avatar src='image.jpg'>&lt;/oj-avatar>
 * @example <caption>Get or set the <code class="prettyprint">src</code> property after initialization</caption>
 * //Get avatar src
 * var src = myAvatar.src;
 *
 * //Set src property to 'image2.jpg'
 * myAvatar.src = "image2.jpg";
 */
 /**
  *
  * <table class="generic-table styling-table">
  *   <thead>
  *     <tr>
  *       <th>Class</th>
  *       <th>Description</th>
  *     </tr>
  *   </thead>
  *   <tbody>
  *     <tr>
  *       <td>oj-avatar-group-image</td>
  *       <td>Use to diplay avatar group placeholder image instead of single person
  *           placeholder image.</td>
  *     </tr>
  *   </tbody>
  * </table>
  *
  * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
  * @memberof oj.ojAvatar
  */
var view =
  "<div class=\"oj-avatar-outer\" data-bind=\"css: !$properties.initials || $properties.src ? 'oj-avatar-'" +
  "  + $properties.size : 'oj-avatar-has-initials oj-avatar-'+ $properties.size\"aria-hidden=\"true\">" +
  "  <div class=\"oj-avatar-inner\">" +
  "    <!-- ko if: $properties.src -->" +
  "    <div class=\"oj-avatar-background-image\"" +
  "         data-bind=\"style:{'background-image':'url(' + $properties.src + ')'}\">" +
  "      <div class=\"oj-avatar-initials\" data-bind=\"text: $properties.initials\"></div>" +
  "    </div>" +
  "    <!-- /ko -->" +
  "    <!-- ko if: $properties.initials && !$properties.src -->" +
  "    <div class=\"oj-avatar-initials\" data-bind=\"text: $properties.initials\"></div>" +
  "    <!-- /ko -->" +
  "    <!-- ko if: !$properties.initials && !$properties.src -->" +
  "    <div class=\"oj-avatar-placeholder\"></div>" +
  "    <!-- /ko -->" +
  "  </div>" +
  "</div>"



var metadata =
{
  "properties": {
    "initials": {
      "description": "Initials for avatar, used if no image",
      "type": "string"
    },
    "src": {
      "description": "Source for background image",
      "type": "string"
    },
    "size": {
      "description": "Size of the avatar",
      "type": "string",
      "enumValues": ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"],
      "value" : "md"
    }
  }
}

oj.Composite.register('oj-avatar',
{
  "view": view,
  "metadata": metadata
});

/**
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 *
 * @function setProperty
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {any} value - The new value to set the property to.
 *
 * @expose
 * @memberof oj.ojAvatar
 * @instance
 * @return {void}
 *
 * @example <caption>Set a single subproperty of a complex property:</caption>
 * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
 */
/**
 * Retrieves a value for a property or a single subproperty for complex properties.
 * @function getProperty
 * @param {string} property - The property name to get. Supports dot notation for subproperty access.
 * @return {any}
 *
 * @expose
 * @memberof oj.ojAvatar
 * @instance
 *
 * @example <caption>Get a single subproperty of a complex property:</caption>
 * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
 */
/**
 * Performs a batch set of properties.
 * @function setProperties
 * @param {Object} properties - An object containing the property and value pairs to set.
 * @return {void}
 *
 * @expose
 * @memberof oj.ojAvatar
 * @instance
 *
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */

});