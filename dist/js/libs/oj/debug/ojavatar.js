/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojvcomponent', 'ojs/ojthemeutils', 'preact'], function (exports, ojvcomponent, ThemeUtils, preact) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    exports.Avatar = class Avatar extends preact.Component {
        render(props) {
            return (preact.h("div", { class: this._getClasses(props), "aria-hidden": "true" },
                this._getInnerContent(props),
                this._getSecondaryInnerContent(props)));
        }
        _getClasses(props) {
            var _a;
            const shape = (_a = props.shape) !== null && _a !== void 0 ? _a : ThemeUtils.getCachedCSSVarValues(['--oj-private-avatar-global-shape-default'])[0];
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
                return (preact.h("div", { class: "oj-avatar-background-image", style: { backgroundImage: `url("${props.src}")` } }));
            }
            else {
                return preact.h("div", { class: "oj-avatar-background oj-avatar-background-image" });
            }
        }
        _getSecondaryInnerContent(props) {
            if (props.iconClass) {
                return preact.h("div", { class: `oj-avatar-icon ${props.iconClass}` });
            }
            else if (props.src) {
                return;
            }
            else if (props.initials) {
                return preact.h("div", { class: "oj-avatar-initials oj-avatar-background-image" }, props.initials);
            }
            else {
                return preact.h("div", { class: "oj-avatar-background-image oj-avatar-placeholder-icon" });
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
    exports.Avatar.metadata = { "properties": { "background": { "type": "string", "enumValues": ["neutral", "orange", "green", "teal", "blue", "slate", "mauve", "pink", "purple", "lilac", "gray", "red", "forest"] }, "initials": { "type": "string|null" }, "size": { "type": "string", "enumValues": ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"] }, "src": { "type": "string|null" }, "iconClass": { "type": "string" }, "shape": { "type": "string", "enumValues": ["square", "circle"] } } };
    exports.Avatar = __decorate([
        ojvcomponent.customElement('oj-avatar')
    ], exports.Avatar);

    Object.defineProperty(exports, '__esModule', { value: true });

});
