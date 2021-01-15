/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojvcomponent-element'], function (exports, ojvcomponentElement) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class Props {
        constructor() {
            this.background = 'neutral';
            this.initials = null;
            this.size = 'md';
            this.src = null;
        }
    }
    exports.Avatar = class Avatar extends ojvcomponentElement.ElementVComponent {
        render() {
            const props = this.props;
            const classNameObj = {
                'oj-avatar': true,
                'oj-avatar-has-initials': !!(props.initials && !props.src),
                'oj-avatar-no-image': !props.src,
                'oj-avatar-image': !!props.src,
                ['oj-avatar-bg-' + props.background]: true,
                ['oj-avatar-' + props.size]: true
            };
            let innerContent;
            if (props.src) {
                innerContent = (ojvcomponentElement.h("div", { class: 'oj-avatar-background-image', style: { backgroundImage: `url("${props.src}")` } }));
            }
            else if (props.initials) {
                innerContent = (ojvcomponentElement.h("div", { class: 'oj-avatar-initials oj-avatar-background-image' }, props.initials));
            }
            else {
                innerContent = (ojvcomponentElement.h("div", { class: 'oj-avatar-background-image' },
                    ojvcomponentElement.h("div", { class: 'oj-avatar-placeholder' })));
            }
            return (ojvcomponentElement.h("div", { class: classNameObj, "aria-hidden": 'true' }, innerContent));
        }
    };
    exports.Avatar.metadata = { "extension": { "_DEFAULTS": Props }, "properties": { "background": { "type": "string", "enumValues": ["neutral", "orange", "green", "teal", "blue", "slate", "mauve", "pink", "purple", "lilac", "gray", "red", "forest"], "value": "neutral" }, "initials": { "type": "string|null", "value": null }, "size": { "type": "string", "enumValues": ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"], "value": "md" }, "src": { "type": "string|null", "value": null } } };
    exports.Avatar = __decorate([
        ojvcomponentElement.customElement('oj-avatar')
    ], exports.Avatar);

    Object.defineProperty(exports, '__esModule', { value: true });

});
