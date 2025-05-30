/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsxs, jsx } from 'preact/jsx-runtime';
import { customElement } from 'ojs/ojvcomponent';
import { getCachedCSSVarValues } from 'ojs/ojthemeutils';
import { Component } from 'preact';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let Avatar = class Avatar extends Component {
    render(props) {
        return (jsxs("div", { class: this._getClasses(props), "aria-hidden": "true", children: [this._getInnerContent(props), this._getSecondaryInnerContent(props)] }));
    }
    _getClasses(props) {
        const shape = props.shape ??
            getCachedCSSVarValues(['--oj-private-avatar-global-shape-default'])[0];
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
            return (jsx("div", { class: "oj-avatar-background-image", style: { backgroundImage: `url("${props.src}")` } }));
        }
        else {
            return jsx("div", { class: "oj-avatar-background oj-avatar-background-image" });
        }
    }
    _getSecondaryInnerContent(props) {
        if (props.iconClass) {
            return jsx("div", { class: `oj-avatar-icon ${props.iconClass}` });
        }
        else if (props.src) {
            return;
        }
        else if (props.initials) {
            return jsx("div", { class: "oj-avatar-initials oj-avatar-background-image", children: props.initials });
        }
        else {
            return jsx("div", { class: "oj-avatar-background-image oj-avatar-placeholder-icon" });
        }
    }
};
Avatar.defaultProps = {
    background: 'neutral',
    initials: null,
    size: 'md',
    src: null,
    iconClass: ''
};
Avatar._metadata = { "properties": { "background": { "type": "string", "enumValues": ["blue", "gray", "green", "orange", "pink", "purple", "red", "teal", "neutral", "slate", "mauve", "lilac", "forest"] }, "initials": { "type": "string" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg", "2xs", "xxs", "xs", "xl", "2xl", "xxl"] }, "src": { "type": "string" }, "iconClass": { "type": "string" }, "shape": { "type": "string", "enumValues": ["square", "circle"] } } };
Avatar = __decorate([
    customElement('oj-avatar')
], Avatar);

export { Avatar };
