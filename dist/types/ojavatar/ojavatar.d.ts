/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExtendGlobalProps } from 'ojs/ojvcomponent';
import { Component, ComponentChild } from 'preact';
type Props = {
    /**
     * @ojmetadata description "Specifies the background of the avatar."
     * @ojmetadata displayName "Background"
     * @ojmetadata help "#background"
     * @ojmetadata status [{"type": "deprecated", "target": "propertyValue", "value": ["red", "forest", "mauve"], "since": "10.0.0", "description": "This value will be removed in the future. Please use other colors."}]
     * @ojmetadata propertyEditorValues {
     *     "neutral": {
     *       "description": "Neutral background (default, if unspecified)",
     *       "displayName": "Neutral"
     *     },
     *     "orange": {
     *       "description": "Orange background",
     *       "displayName": "Orange"
     *     },
     *     "green": {
     *       "description": "Green background",
     *       "displayName": "Green"
     *     },
     *     "teal": {
     *       "description": "Teal background",
     *       "displayName": "Teal"
     *     },
     *    "blue": {
     *       "description": "Blue background",
     *       "displayName": "Blue"
     *     },
     *    "slate": {
     *       "description": "Slate background",
     *       "displayName": "Slate"
     *     },
     *     "mauve": {
     *       "description": "Mauve background",
     *       "displayName": "Mauve"
     *     },
     *     "pink": {
     *       "description": "Pink background",
     *       "displayName": "Pink"
     *     },
     *     "purple": {
     *       "description": "Purple background",
     *       "displayName": "Purple"
     *     },
     *    "lilac": {
     *       "description": "Lilac background",
     *       "displayName": "Lilac"
     *     },
     *    "gray": {
     *       "description": "Gray background",
     *       "displayName": "Gray"
     *     },
     *    "red": {
     *       "description": "Red background",
     *       "displayName": "Red"
     *     },
     *    "forest": {
     *       "description": "Forest background",
     *       "displayName": "Forest"
     *     }
     *   }
     */
    background?: 'neutral' | 'orange' | 'green' | 'teal' | 'blue' | 'slate' | 'mauve' | 'pink' | 'purple' | 'lilac' | 'gray' | 'red' | 'forest';
    /**
     * @description
     *  Specifies the initials of the avatar.  Will only be displayed if the src and iconClass attributes are null.
     *  <a href="oj.IntlConverterUtils.html#.getInitials">IntlConverterUtils.getInitials</a> can be used
     *  to generate initials from first and last names in a locale-specific manner.
     *
     * @ojmetadata description "Specifies the initials of the avatar."
     * @ojmetadata displayName "Initials"
     * @ojmetadata help "#initials"
     * @ojmetadata translatable
     */
    initials?: string | null;
    /**
     * @ojmetadata description "Specifies the size of the avatar."
     * @ojmetadata displayName "Size"
     * @ojmetadata status [{"type": "deprecated", "target": "propertyValue", "value": ["xxl", "xxs"], "since": "13.0.0", "description": "These values will be removed in the future. Please use '2xl' or '2xs' instead."}]
     * @ojmetadata help "#size"
     * @ojmetadata propertyEditorValues {
     *     "2xs": {
     *       "description": "extra, extra small avatar",
     *       "displayName": "Extra Extra Small"
     *     },
     *    "xxs": {
     *       "description": "extra, extra small avatar(deprecated)",
     *       "displayName": "Extra Extra Small(deprecated)"
     *     },
     *     "xs": {
     *       "description": "extra small avatar",
     *       "displayName": "Extra Small"
     *     },
     *     "sm": {
     *       "description": "small avatar",
     *       "displayName": "Small"
     *     },
     *     "md": {
     *       "description": "medium avatar (default, if unspecified)",
     *       "displayName": "Medium"
     *     },
     *     "lg": {
     *       "description": "large avatar",
     *       "displayName": "Large"
     *     },
     *     "xl": {
     *       "description": "extra large avatar",
     *       "displayName": "Extra Large"
     *     },
     *    "2xl": {
     *       "description": "extra, extra large avatar",
     *       "displayName": "Extra Extra Large"
     *     },
     *    "xxl": {
     *       "description": "extra, extra large avatar(deprecated)",
     *       "displayName": "Extra Extra Large(deprecated)"
     *     }
     *   }
     */
    size?: '2xs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'xxl';
    /**
     * @description
     * Specifies the src for the image of the avatar.  Image will be rendered as a background image.  Will be ignored if iconClass is populated.
     *
     * @ojmetadata description "Specifies the source for the image of the avatar."
     * @ojmetadata displayName "Src"
     * @ojmetadata help "#src"
     */
    src?: string | null;
    /**
     * @description
     * Specifies the icon class to be displayed.  If populated, src and initials will be ignored.
     *
     * @ojmetadata description "The icon class to be displayed."
     * @ojmetadata displayName "Icon Class"
     * @ojmetadata help "#iconClass"
     */
    iconClass?: string;
    /**
     * @description
     * Specifies the shape of the avatar. Can be square or circle.The default value of this property varies by theme.
     *
     * @ojmetadata description "Specifies the shape of the avatar."
     * @ojmetadata displayName "Shape"
     * @ojmetadata help "#shape"
     * @ojmetadata propertyEditorValues {
     *     "square": {
     *       "description": "square avatar (default, if unspecified)",
     *       "displayName": "Square Avatar"
     *     },
     *     "circle": {
     *       "description": "circular avatar",
     *       "displayName": "Circular Avatar"
     *     }
     *   }
     */
    shape?: 'square' | 'circle';
};
/**
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
 * <p>To make the component accessible, the application must set the role attribute of oj-avatar to 'img' and provide a value for
 * the aria-label attribute.  Note that the component only needs to be made accessible if any associated information
 * (e.g. the name of the person represented by the oj-avatar) is not already available to assistive technologies
 * (e.g. by rendering the name in addition to the avatar as part of the page content).
 *
 * <p>JET Avatar does not have
 * any interaction with the application, therefore it is not keyboard navigable by default.
 * The aria-label will be picked up by the tabbable/focusable parent unless it is
 * overriden by the application.
 * The application can set a tooltip by setting the title attribute of the avatar.  It is recommended that the title and aria-label attributes are in sync.
 *
 *
 * <p>In order to meet <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum">accessibility requirements</a> for text, color contrast ratio
 * between the background color and text must be
 * greater than 4.5 for the two smallest avatars and 3.1 for the five larger avatars.
 * Avatar's default background satisfies the 4.5 color contrast ratio.  If colors are customized through theming, the
 * application is responsible for specifying colors that satisfy the contrast ratio requirements.
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
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 *  </h3>
 *  To migrate from oj-avatar to oj-c-avatar, you need to revise the import statement and references to oj-avatar in your app.  Please note the changes between the two components below.
 *  <h5>Size attribute</h5>
 *  <p>The enum values for the size attribute have changed from 'xxs' and 'xxl' to '2xs', and '2xl'.</p>
 *  <h5>Role attribute</h5>
 *   <p>If aria-label is set on the component, the role attribute will be set internally.  The application should no longer populate the role attribute.</p>
 *
 * @ojmetadata description "An avatar represents a person or entity as initials or an image."
 * @ojmetadata displayName "Avatar"
 * @ojmetadata ojLegacyVComponent "ojAvatar"
 * @ojmetadata main "ojs/ojavatar"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "15.0.0",
 *     "value": ["oj-c-avatar"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-avatar",
 *     "uxSpecs": ["avatar"]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojavatar",
 *     "styleClasses": [
 *       {
 *         "styleGroup": [
 *           "oj-avatar-group-image"
 *         ],
 *         "description": "Use to display avatar group placeholder image instead of single person placeholder image."
 *       }
 *     ],
 *     "defaultColumns": "2",
 *     "minColumns": "1"
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojAvatar.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "size",
 *       "background"
 *     ]
 *   },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "src",
 *       "initials"
 *     ]
 *   }
 * ]
 * @ojmetadata since "4.0.0"
 * @ojmetadata styleClasses [
 *   {
 *     "name": "oj-avatar-group-image",
 *     "kind": "class",
 *     "status": [{"type": "deprecated", "since": "12.1.0", "description": "'oj-avatar-group-image' class has been deprecated.  The group placeholder icon can still be shown by setting the icon-class attribute to 'oj-ux-ico-contact-group'."}],
 *     "displayName": "Avatar Group Image",
 *     "description": "Use to display avatar group placeholder image instead of single person placeholder image.",
 *     "help": "#oj-avatar-group-image",
 *     "extension": {
 *         "jet": {
 *            "example": "//Group Placeholder\n &lt;oj-avatar class=\"oj-avatar-group-image\">\n &lt;/oj-avatar>"
 *          }
 *      }
 *   },
 *   {
 *     "name": "oj-avatar-2xs",
 *     "kind": "class",
 *     "displayName": "Extra Extra Small Avatar",
 *     "description": "Extra extra small avatar implementation.",
 *     "help": "#oj-avatar-2xs",
 *     "scope": "protected"
 *   },
 *   {
 *     "name": "oj-avatar-xxs",
 *     "kind": "class",
 *     "displayName": "Extra Extra Small Avatar(deprecated)",
 *     "description": "Extra extra small avatar implementation(deprecated).",
 *     "help": "#oj-avatar-xxs",
 *     "scope": "protected"
 *   },
 *   {
 *     "name": "oj-avatar-xs",
 *     "kind": "class",
 *     "displayName": "Extra Small Avatar",
 *     "description": "Extra small avatar implementation.",
 *     "help": "#oj-avatar-xs",
 *     "scope": "protected"
 *   },
 *   {
 *     "name": "oj-avatar-sm",
 *     "kind": "class",
 *     "displayName": "Small Avatar",
 *     "description": "Small avatar implementation.",
 *     "help": "#oj-avatar-sm",
 *     "scope": "protected"
 *   },
 *   {
 *     "name": "oj-avatar-lg",
 *     "kind": "class",
 *     "displayName": "Large Avatar",
 *     "description": "Large avatar implementation.",
 *     "help": "#oj-avatar-lg",
 *     "scope": "protected"
 *   },
 *   {
 *     "name": "oj-avatar-xl",
 *     "kind": "class",
 *     "displayName": "Extra Large Avatar",
 *     "description": "Extra large avatar implementation.",
 *     "help": "#oj-avatar-xl",
 *     "scope": "protected"
 *   },
 *   {
 *     "name": "oj-avatar-2xl",
 *     "kind": "class",
 *     "displayName": "Extra Extra Large Avatar(deprecated)",
 *     "description": "Extra extra large avatar implementation(deprecated).",
 *     "help": "#oj-avatar-2xl",
 *     "scope": "protected"
 *   },
 *  {
 *     "name": "oj-avatar-xxl",
 *     "kind": "class",
 *     "displayName": "Extra Extra Large Avatar",
 *     "description": "Extra extra large avatar implementation.",
 *     "help": "#oj-avatar-xxl",
 *     "scope": "protected"
 *   }
 * ]
 * @ojmetadata styleVariableSet {"name": "ojavatar-css-set1", "displayName": "Avatar Color CSS",
 *                                "description": "CSS variables that specify Avatar colors",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-avatar-bg-color",
 *                                    "description": "Avatar background color",
 *                                    "formats": ["color"],
 *                                    "help": "#ojavatar-css-set1"
 *                                  },
 *                                  {
 *                                    "name": "oj-avatar-text-color",
 *                                    "description": "Avatar text color",
 *                                    "formats": ["color"],
 *                                    "help": "#ojavatar-css-set1"
 *                                  }
 *                                ]
 *                              }
 * @ojmetadata styleVariableSet {"name": "ojavatar-css-set2", "displayName": "Avatar Sizing and Display CSS",
 *                                "description": "CSS variables that specify Avatar sizing and display characteristics",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-avatar-pattern-display",
 *                                    "description": "Avatar pattern display behavior.  This is only supported in Redwood.",
 *                                    "keywords": ["block", "none"],
 *                                    "help": "#ojavatar-css-set2"
 *                                  },
 *                                  {
 *                                    "name": "oj-avatar-size",
 *                                    "description": "Avatar size",
 *                                    "formats": ["length"],
 *                                    "help": "#ojavatar-css-set2"
 *                                  },
 *                                  {
 *                                    "name": "oj-avatar-border-radius",
 *                                    "description": "Avatar border radius, only applied to the square avatar",
 *                                    "formats": ["length","percentage"],
 *                                    "help": "#ojavatar-css-set2"
 *                                  }
 *                                ]
 *                              }
 * @ojmetadata styleVariableSet {"name": "ojavatar-css-set3", "displayName": "Avatar Font CSS",
 *                                "description": "CSS variables that specify Avatar font characteristics",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-avatar-initials-font-size",
 *                                    "description": "Avatar font size for initials",
 *                                    "formats": ["length"],
 *                                    "help": "#ojavatar-css-set3"
 *                                  },
 *                                  {
 *                                    "name": "oj-avatar-initials-font-weight",
 *                                    "description": "Avatar font weight for initials",
 *                                    "formats": ["font_weight"],
 *                                    "help": "#ojavatar-css-set3"
 *                                  }
 *                                ]
 *                              }
 */
/**
 * This export corresponds to the Avatar Preact component. For the oj-avatar custom element, import AvatarElement instead.
 */
export declare class Avatar extends Component<ExtendGlobalProps<Props>> {
    static defaultProps: Props;
    render(props: ExtendGlobalProps<Props>): ComponentChild;
    private _getClasses;
    private _getInnerContent;
    private _getSecondaryInnerContent;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-avatar custom element. For the Avatar Preact component, import Avatar instead.
 */
export interface AvatarElement extends JetElement<AvatarElementSettableProperties>, AvatarElementSettableProperties {
    addEventListener<T extends keyof AvatarElementEventMap>(type: T, listener: (this: HTMLElement, ev: AvatarElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof AvatarElementSettableProperties>(property: T): AvatarElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof AvatarElementSettableProperties>(property: T, value: AvatarElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, AvatarElementSettableProperties>): void;
    setProperties(properties: AvatarElementSettablePropertiesLenient): void;
}
export namespace AvatarElement {
    type backgroundChanged = JetElementCustomEventStrict<AvatarElement['background']>;
    type iconClassChanged = JetElementCustomEventStrict<AvatarElement['iconClass']>;
    type initialsChanged = JetElementCustomEventStrict<AvatarElement['initials']>;
    type shapeChanged = JetElementCustomEventStrict<AvatarElement['shape']>;
    type sizeChanged = JetElementCustomEventStrict<AvatarElement['size']>;
    type srcChanged = JetElementCustomEventStrict<AvatarElement['src']>;
}
export interface AvatarElementEventMap extends HTMLElementEventMap {
    'backgroundChanged': JetElementCustomEventStrict<AvatarElement['background']>;
    'iconClassChanged': JetElementCustomEventStrict<AvatarElement['iconClass']>;
    'initialsChanged': JetElementCustomEventStrict<AvatarElement['initials']>;
    'shapeChanged': JetElementCustomEventStrict<AvatarElement['shape']>;
    'sizeChanged': JetElementCustomEventStrict<AvatarElement['size']>;
    'srcChanged': JetElementCustomEventStrict<AvatarElement['src']>;
}
export interface AvatarElementSettableProperties extends JetSettableProperties {
    background?: Props['background'];
    /**
     * Specifies the icon class to be displayed.  If populated, src and initials will be ignored.
     */
    iconClass?: Props['iconClass'];
    /**
     *  Specifies the initials of the avatar.  Will only be displayed if the src and iconClass attributes are null.
     *  <a href="oj.IntlConverterUtils.html#.getInitials">IntlConverterUtils.getInitials</a> can be used
     *  to generate initials from first and last names in a locale-specific manner.
     */
    initials?: Props['initials'];
    /**
     * Specifies the shape of the avatar. Can be square or circle.The default value of this property varies by theme.
     */
    shape?: Props['shape'];
    size?: Props['size'];
    /**
     * Specifies the src for the image of the avatar.  Image will be rendered as a background image.  Will be ignored if iconClass is populated.
     */
    src?: Props['src'];
}
export interface AvatarElementSettablePropertiesLenient extends Partial<AvatarElementSettableProperties> {
    [key: string]: any;
}
export type ojAvatar = AvatarElement;
export namespace ojAvatar {
    type backgroundChanged = JetElementCustomEventStrict<ojAvatar['background']>;
    type iconClassChanged = JetElementCustomEventStrict<ojAvatar['iconClass']>;
    type initialsChanged = JetElementCustomEventStrict<ojAvatar['initials']>;
    type shapeChanged = JetElementCustomEventStrict<ojAvatar['shape']>;
    type sizeChanged = JetElementCustomEventStrict<ojAvatar['size']>;
    type srcChanged = JetElementCustomEventStrict<ojAvatar['src']>;
}
export type ojAvatarEventMap = AvatarElementEventMap;
export type ojAvatarSettableProperties = AvatarElementSettableProperties;
export type ojAvatarSettablePropertiesLenient = AvatarElementSettablePropertiesLenient;
export interface AvatarIntrinsicProps extends Partial<Readonly<AvatarElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onbackgroundChanged?: (value: AvatarElementEventMap['backgroundChanged']) => void;
    oniconClassChanged?: (value: AvatarElementEventMap['iconClassChanged']) => void;
    oninitialsChanged?: (value: AvatarElementEventMap['initialsChanged']) => void;
    onshapeChanged?: (value: AvatarElementEventMap['shapeChanged']) => void;
    onsizeChanged?: (value: AvatarElementEventMap['sizeChanged']) => void;
    onsrcChanged?: (value: AvatarElementEventMap['srcChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-avatar': AvatarIntrinsicProps;
        }
    }
}
