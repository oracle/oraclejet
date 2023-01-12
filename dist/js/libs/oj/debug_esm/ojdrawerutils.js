/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { getReadingDirection } from 'ojs/ojdomutils';

const ojet = oj;
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
    static get styleDrawerHidden() {
        return `${this.stringOjDrawer}${this.charDash}hidden`;
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
    static get middleSectionSelector() {
        return `${this.stringOjDrawer}${this.charDash}${this.stringMiddleSection}`;
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
DrawerConstants.fullHeightDrawerChangeThreshold = 600;
DrawerConstants.charDash = '-';
DrawerConstants.charSpace = ' ';
DrawerConstants.stringOjDrawer = 'oj-drawer';
DrawerConstants.stringStart = 'start';
DrawerConstants.stringEnd = 'end';
DrawerConstants.stringTop = 'top';
DrawerConstants.stringBottom = 'bottom';
DrawerConstants.stringMiddleSection = `layout-middle-section`;
DrawerConstants.stringMainContent = `layout-main-content`;
DrawerConstants.stringStyleClassDisableOverflow = `oj-drawer-disable-body-overflow`;
DrawerConstants.stringSurrogate = 'surrogate';
DrawerConstants.stringOpened = 'opened';
DrawerConstants.stringClosed = 'closed';
DrawerConstants.stringClosedWithEsc = `ClosedWithEsc`;
DrawerConstants.stringShouldChangeDisplayMode = `ShouldChangeDisplayMode`;
DrawerConstants.stringStateToChangeTo = `StateToChangeTo`;
DrawerConstants.stringPrevState = `PrevState`;
DrawerConstants.stringReflow = 'reflow';
DrawerConstants.stringOverlay = 'overlay';
DrawerConstants.stringFullOverlay = 'full-overlay';
DrawerConstants.stringDisplay = 'Display';
DrawerConstants.stringResize = 'resize';
DrawerConstants.stringLeft = 'left';
DrawerConstants.stringRight = 'right';
DrawerConstants.stringOpen = 'open';
DrawerConstants.stringClose = 'close';
DrawerConstants.stringSlideIn = 'slideIn';
DrawerConstants.stringSlideOut = 'slideOut';
DrawerConstants.stringWidth = 'width';
DrawerConstants.stringHeight = 'height';
DrawerConstants.animationDuration = 300;
DrawerConstants.keys = {
    ESC: 'Escape',
    TAB: 'Tab'
};
class DrawerUtils {
    static capitalizeFirstChar(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
    static disableBodyOverflow() {
        document.body.classList.add(DrawerConstants.stringStyleClassDisableOverflow);
    }
    static enableBodyOverflow() {
        document.body.classList.remove(DrawerConstants.stringStyleClassDisableOverflow);
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
    static getFocusables(element) {
        const defaultFocusableElements = [
            'button',
            '[href]',
            'input',
            'select',
            'textarea',
            '[tabindex]',
            'video'
        ];
        const selectorSuffix = ':not([tabindex="-1"]):not([disabled]):not([hidden])' +
            ':not([style*="display:none"])' +
            ':not([style*="display:none"] *)' +
            ':not([style*="visibility:hidden"])' +
            ':not([style*="visibility:hidden"] *)';
        const elementsCount = defaultFocusableElements.length;
        let safeFocusablesSelector = '';
        for (let i = 0; i < elementsCount; i++) {
            const elSelector = `${defaultFocusableElements[i]}${selectorSuffix}`;
            safeFocusablesSelector += i < elementsCount - 1 ? `${elSelector}, ` : `${elSelector}`;
        }
        return element.querySelectorAll(safeFocusablesSelector);
    }
    static isFocusable(element) {
        if (!element || !element.parentElement) {
            return false;
        }
        return Array.from(DrawerUtils.getFocusables(element.parentElement)).some((item) => {
            return item === element;
        });
    }
    static isObjectEmpty(object) {
        if (typeof object === 'object') {
            return Object.keys(object).length === 0 && object.constructor === Object;
        }
        return true;
    }
    static isRTL() {
        return getReadingDirection() === 'rtl';
    }
    static getAnimationOptions(actionType, edge) {
        let direction;
        switch (edge) {
            case DrawerConstants.stringStart:
                if (actionType === DrawerConstants.stringSlideIn) {
                    direction = this.isRTL() ? DrawerConstants.stringLeft : DrawerConstants.stringRight;
                }
                else if (actionType === DrawerConstants.stringSlideOut) {
                    direction = this.isRTL() ? DrawerConstants.stringRight : DrawerConstants.stringLeft;
                }
                else {
                    direction = DrawerConstants.stringWidth;
                }
                break;
            case DrawerConstants.stringEnd:
                if (actionType === DrawerConstants.stringSlideIn) {
                    direction = this.isRTL() ? DrawerConstants.stringRight : DrawerConstants.stringLeft;
                }
                else if (actionType === DrawerConstants.stringSlideOut) {
                    direction = this.isRTL() ? DrawerConstants.stringLeft : DrawerConstants.stringRight;
                }
                else {
                    direction = DrawerConstants.stringWidth;
                }
                break;
            case DrawerConstants.stringBottom:
                if (actionType === DrawerConstants.stringSlideIn) {
                    direction = DrawerConstants.stringTop;
                }
                else if (actionType === DrawerConstants.stringSlideOut) {
                    direction = DrawerConstants.stringBottom;
                }
                else {
                    direction = DrawerConstants.stringHeight;
                }
        }
        return {
            direction,
            duration: `${DrawerConstants.animationDuration}ms`
        };
    }
    static getCommonStyleClasses(edge) {
        return {
            [DrawerConstants.styleStartDrawer]: edge === DrawerConstants.stringStart,
            [DrawerConstants.styleEndDrawer]: edge === DrawerConstants.stringEnd,
            [DrawerConstants.styleBottomDrawer]: edge === DrawerConstants.stringBottom
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
    static getViewportWidth() {
        if (ojet.AgentUtils.getAgentInfo().os === ojet.AgentUtils.OS.IOS) {
            return document.documentElement.clientWidth;
        }
        return window.innerWidth;
    }
    static getViewportHeight() {
        if (ojet.AgentUtils.getAgentInfo().os === ojet.AgentUtils.OS.IOS) {
            return document.documentElement.clientHeight;
        }
        return window.innerHeight;
    }
    static moveFocusToElementOrNearestAncestor(element) {
        if (DrawerUtils.isFocusable(element)) {
            element.focus();
        }
        else {
            let nearestAncestor = element.parentElement;
            while (nearestAncestor &&
                nearestAncestor.nodeName !== 'HTML' &&
                !DrawerUtils.isFocusable(nearestAncestor)) {
                nearestAncestor = nearestAncestor.parentElement;
            }
            if (nearestAncestor) {
                nearestAncestor.focus();
            }
        }
    }
}

export { DrawerConstants, DrawerUtils };
