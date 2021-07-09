/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdomutils'], function (exports, DomUtils) { 'use strict';

    class DrawerConstants {
        static get DrawerLayoutStyleSurrogate() {
            return `${this.stringOjDrawer}${this.charDash}layout${this.charDash}${this.stringSurrogate}`;
        }
        static get DrawerPopupStyleSurrogate() {
            return `${this.stringOjDrawer}${this.charDash}popup${this.charDash}${this.stringSurrogate}`;
        }
        static styleDisplayMode(resolvedDisplayMode) {
            return `${this.stringOjDrawer}${this.charDash}${resolvedDisplayMode}`;
        }
        static get styleOpened() {
            return `${this.stringOjDrawer}${this.charDash}${this.stringOpened}`;
        }
        static get styleFixedInViewport() {
            return `${this.stringOjDrawer}${this.charDash}fixed-in-viewport`;
        }
        static get styleStartDrawer() {
            return `${this.stringOjDrawer}${this.charDash}${this.stringStart}`;
        }
        static get styleEndDrawer() {
            return `${this.stringOjDrawer}${this.charDash}${this.stringEnd}`;
        }
        static get styleBottomDrawer() {
            return `${this.stringOjDrawer}${this.charDash}${this.stringBottom}`;
        }
        static get mainContentSelector() {
            return `${this.stringOjDrawer}${this.charDash}${this.stringMainContent}`;
        }
        static get styleReflow() {
            return `${this.stringOjDrawer}${this.charDash}${this.stringReflow}`;
        }
        static get styleOverlay() {
            return `${this.stringOjDrawer}${this.charDash}${this.stringOverlay}`;
        }
    }
    DrawerConstants.displayTypeChangeThreshold = 1024;
    DrawerConstants.fullWidthDrawerChangeThreshold = 600;
    DrawerConstants.charDash = '-';
    DrawerConstants.charSpace = ' ';
    DrawerConstants.stringOjDrawer = 'oj-drawer';
    DrawerConstants.stringStart = 'start';
    DrawerConstants.stringEnd = 'end';
    DrawerConstants.stringTop = 'top';
    DrawerConstants.stringBottom = 'bottom';
    DrawerConstants.stringMainContent = `layout-main-content`;
    DrawerConstants.stringSurrogate = 'surrogate';
    DrawerConstants.stringOpened = 'opened';
    DrawerConstants.stringReflow = 'reflow';
    DrawerConstants.stringOverlay = 'overlay';
    DrawerConstants.stringFullOverlay = 'full-overlay';
    DrawerConstants.stringLeft = 'left';
    DrawerConstants.stringRight = 'right';
    DrawerConstants.animationDuration = 300;
    DrawerConstants.stringOpen = 'open';
    DrawerConstants.stringClose = 'close';
    DrawerConstants.keys = {
        ESC: 'Escape',
        TAB: 'Tab'
    };
    class DrawerUtils {
        static capitalizeFirstChar(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        }
        static getElement(selector) {
            return document.querySelector(selector);
        }
        static getElementHeight(element) {
            return Math.round(element.offsetHeight);
        }
        static getElementWidth(element) {
            return Math.round(element.getBoundingClientRect().width);
        }
        static isObjectEmpty(object) {
            if (typeof object === 'object') {
                return Object.keys(object).length === 0 && object.constructor === Object;
            }
            return true;
        }
        static isRTL() {
            return DomUtils.getReadingDirection() === 'rtl';
        }
        static getAnimationOptions(actionType, edge) {
            let direction;
            switch (edge) {
                case DrawerConstants.stringStart:
                    if (actionType === 'open') {
                        direction = this.isRTL() ? DrawerConstants.stringLeft : DrawerConstants.stringRight;
                    }
                    else {
                        direction = this.isRTL() ? DrawerConstants.stringRight : DrawerConstants.stringLeft;
                    }
                    break;
                case DrawerConstants.stringEnd:
                    if (actionType === 'open') {
                        direction = this.isRTL() ? DrawerConstants.stringRight : DrawerConstants.stringLeft;
                    }
                    else {
                        direction = this.isRTL() ? DrawerConstants.stringLeft : DrawerConstants.stringRight;
                    }
                    break;
                case DrawerConstants.stringBottom:
                    direction =
                        actionType === 'open' ? DrawerConstants.stringTop : DrawerConstants.stringBottom;
                    break;
            }
            return {
                direction,
                duration: `${DrawerConstants.animationDuration}ms`
            };
        }
        static getCommonStyleClasses(edge, isOpened) {
            return {
                [DrawerConstants.styleStartDrawer]: edge === DrawerConstants.stringStart,
                [DrawerConstants.styleEndDrawer]: edge === DrawerConstants.stringEnd,
                [DrawerConstants.styleBottomDrawer]: edge === DrawerConstants.stringBottom,
                [DrawerConstants.styleOpened]: isOpened
            };
        }
        static getStyleClassesMapAsString(styleClassMap) {
            let styleClassString = '';
            for (let key in styleClassMap) {
                if (styleClassMap[key]) {
                    styleClassString += styleClassString ? DrawerConstants.charSpace + key : key;
                }
            }
            return styleClassString;
        }
    }

    exports.DrawerConstants = DrawerConstants;
    exports.DrawerUtils = DrawerUtils;

    Object.defineProperty(exports, '__esModule', { value: true });

});
