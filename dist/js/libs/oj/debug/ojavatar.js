/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojvcomponent', 'ojs/ojthemeutils', 'preact'], function (exports, jsxRuntime, ojvcomponent, ThemeUtils, preact) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
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
     * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojAvatar.html"
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
    exports.Avatar = class Avatar extends preact.Component {
        render(props) {
            return (jsxRuntime.jsxs("div", { class: this._getClasses(props), "aria-hidden": "true", children: [this._getInnerContent(props), this._getSecondaryInnerContent(props)] }));
        }
        _getClasses(props) {
            const shape = props.shape ??
                ThemeUtils.getCachedCSSVarValues(['--oj-private-avatar-global-shape-default'])[0];
            let classes = `oj-avatar oj-avatar-bg-${props.background} oj-avatar-${props.size} ${shape === 'circle' ? 'oj-avatar-circle' : 'oj-avatar-square'}`;
            if (props.iconClass || !props.src) {
                classes += ' oj-avatar-no-image';
                if (props.initials) {
                    classes += ' oj-avatar-has-initials';
                }
            }
            else {
                classes += ' oj-avatar-image';
            }
            return classes;
        }
        _getInnerContent(props) {
            if (props.src && !props.iconClass) {
                return (jsxRuntime.jsx("div", { class: "oj-avatar-background-image", style: { backgroundImage: `url("${props.src}")` } }));
            }
            else {
                return jsxRuntime.jsx("div", { class: "oj-avatar-background oj-avatar-background-image" });
            }
        }
        _getSecondaryInnerContent(props) {
            if (props.iconClass) {
                return jsxRuntime.jsx("div", { class: `oj-avatar-icon ${props.iconClass}` });
            }
            else if (props.src) {
                return;
            }
            else if (props.initials) {
                return jsxRuntime.jsx("div", { class: "oj-avatar-initials oj-avatar-background-image", children: props.initials });
            }
            else {
                return jsxRuntime.jsx("div", { class: "oj-avatar-background-image oj-avatar-placeholder-icon" });
            }
        }
    };
    exports.Avatar.defaultProps = {
        background: 'neutral',
        initials: null,
        size: 'md',
        src: null,
        iconClass: ''
    };
    exports.Avatar._metadata = { "properties": { "background": { "type": "string", "enumValues": ["blue", "gray", "green", "orange", "pink", "purple", "red", "teal", "neutral", "slate", "mauve", "lilac", "forest"] }, "initials": { "type": "string" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg", "2xs", "xxs", "xs", "xl", "2xl", "xxl"] }, "src": { "type": "string" }, "iconClass": { "type": "string" }, "shape": { "type": "string", "enumValues": ["square", "circle"] } } };
    exports.Avatar = __decorate([
        ojvcomponent.customElement('oj-avatar')
    ], exports.Avatar);

    Object.defineProperty(exports, '__esModule', { value: true });

});
