/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdomutils'], function (exports, DomUtils) { 'use strict';

    // @ts-ignore
    // @ts-ignore
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
        // Opened
        static get styleOpened() {
            return `${this.stringOjDrawer}${this.charDash}${this.stringOpened}`;
        }
        static get styleFixedInViewport() {
            return `${this.stringOjDrawer}${this.charDash}fixed-in-viewport`;
        }
        static get styleDrawerHidden() {
            return `${this.stringOjDrawer}${this.charDash}hidden`;
        }
        static get clippingAreaSelector() {
            return `${this.stringOjDrawer}${this.charDash}${this.stringClippingArea}`;
        }
        // Edge
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
        // Display mode
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
    // Area
    DrawerConstants.stringStart = 'start';
    DrawerConstants.stringEnd = 'end';
    DrawerConstants.stringTop = 'top';
    DrawerConstants.stringBottom = 'bottom';
    DrawerConstants.stringMiddleSection = `layout-middle-section`;
    DrawerConstants.stringMainContent = `layout-main-content`;
    DrawerConstants.stringClippingArea = `clipping-area`;
    DrawerConstants.stringStyleClassDisableOverflow = `oj-drawer-disable-body-overflow`;
    // Surrogate
    DrawerConstants.stringSurrogate = 'surrogate';
    // State
    DrawerConstants.stringOpened = 'opened';
    DrawerConstants.stringClosed = 'closed';
    DrawerConstants.stringClosedWithEsc = `ClosedWithEsc`;
    DrawerConstants.stringShouldChangeDisplayMode = `ShouldChangeDisplayMode`;
    DrawerConstants.stringStateToChangeTo = `StateToChangeTo`;
    DrawerConstants.stringPrevState = `PrevState`;
    // Display mode
    DrawerConstants.stringReflow = 'reflow';
    DrawerConstants.stringOverlay = 'overlay';
    DrawerConstants.stringFullOverlay = 'full-overlay';
    DrawerConstants.stringDisplay = 'Display';
    DrawerConstants.stringResize = 'resize';
    // Margin helpers
    DrawerConstants.stringLeft = 'left';
    DrawerConstants.stringRight = 'right';
    // Animation
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
        static getAutofocusFocusables(element) {
            const selector = '[autofocus]:not([tabindex="-1"]):not([disabled]):not([hidden])';
            const focusableCandidates = Array.from(element.querySelectorAll(selector));
            const focusables = focusableCandidates.filter((item) => {
                return !this.isHidden(item);
            });
            return focusables;
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
            const selectorSuffix = ':not([tabindex="-1"]):not([disabled]):not([hidden])';
            const elementsCount = defaultFocusableElements.length;
            let safeFocusablesSelector = '';
            for (let i = 0; i < elementsCount; i++) {
                const elSelector = `${defaultFocusableElements[i]}${selectorSuffix}`;
                // Last item can not be followed by 'comma and space'
                safeFocusablesSelector += i < elementsCount - 1 ? `${elSelector}, ` : `${elSelector}`;
            }
            const focusableCandidates = Array.from(element.querySelectorAll(safeFocusablesSelector));
            const focusables = focusableCandidates.filter((item) => {
                return !this.isHidden(item);
            });
            return focusables;
        }
        static isHidden(element) {
            // Case: display: 'none'
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
            // Note: offsetParent returns null in the following situations:
            // The element or any ancestor has the display property set to none.
            // The element has the position property set to fixed (Firefox returns <body>).
            // ...
            // To check the latter - whether the element has fixed position
            // we would have to call expensive getComputedStyle()
            // As we have not seen a fixed position tabbable element within a drawer
            // we intentionally don't do that until we got a usecase
            // Most hidden elements are hidden using display none which
            // can be checked cheap using following:
            if (element.offsetParent === null) {
                return true;
            }
            // ...and the Firefox case. Again (see previous comments):
            // The element has the position property set to fixed (Firefox returns <body>).
            if (ojet.AgentUtils.getAgentInfo().browser === ojet.AgentUtils.BROWSER.FIREFOX) {
                if (element.offsetParent === document.body) {
                    return true;
                }
            }
            // Case: visibility: 'hidden'
            // getComputedStyle() correctly computes visibility even it is inherited.
            // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
            // The Window.getComputedStyle() method returns an object containing the values of all CSS properties of an element,
            // after applying active stylesheets and resolving any basic computation those values may contain.
            const style = window.getComputedStyle(element);
            return style.visibility === 'hidden';
        }
        static isFocusable(element) {
            // JET-53053 - element can be disconnected from DOM
            if (!element || !element.parentElement) {
                return false;
            }
            return DrawerUtils.getFocusables(element.parentElement).some((item) => {
                return item === element;
            });
        }
        static isObjectEmpty(object) {
            if (typeof object === 'object') {
                // Because Object.keys(new Date()).length === 0; we have to do some additional check
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
                    if (actionType === DrawerConstants.stringSlideIn) {
                        direction = this.isRTL() ? DrawerConstants.stringLeft : DrawerConstants.stringRight;
                    }
                    else if (actionType === DrawerConstants.stringSlideOut) {
                        direction = this.isRTL() ? DrawerConstants.stringRight : DrawerConstants.stringLeft;
                    }
                    else {
                        // expand/collapse
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
                        // expand/collapse
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
                        // expand/collapse
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
                // Edge: e.g. 'oj-drawer-start
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
                // On ios window.innerWidth is not recommended way of measuring the viewport
                return document.documentElement.clientWidth;
            }
            return window.innerWidth;
        }
        static getViewportHeight() {
            if (ojet.AgentUtils.getAgentInfo().os === ojet.AgentUtils.OS.IOS) {
                // On ios window.innerWidth is not recommended way of measuring the viewport
                return document.documentElement.clientHeight;
            }
            return window.innerHeight;
        }
        static moveFocusToElementOrNearestAncestor(element) {
            if (DrawerUtils.isFocusable(element)) {
                element.focus();
            }
            else {
                // If the drawer opener is not focusable, focus the nearest focusable ancestor.
                let nearestAncestor = element.parentElement;
                // In case the drawer opener was removed (e.g. drawer opener
                // was an option of a temporary popup - combobox's dropdown)
                // the focus ends on <body> which ancestor is <html>
                // In this case stop looking for the nearest ancestor
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
        static wrapDrawerWithClippingArea(drawerElement, position) {
            // prettier-ignore
            const clippingAreaEl = $(drawerElement)
                .wrap(function () {
                const div = document.createElement('div');
                div.setAttribute('id', DrawerConstants.clippingAreaSelector);
                div.style.overflow = 'hidden';
                div.style.position = 'absolute';
                return $(div);
            })
                .parent()[0];
            clippingAreaEl.style.setProperty('height', DrawerUtils.getElementHeight(drawerElement) + 'px');
            clippingAreaEl.style.setProperty('width', DrawerUtils.getElementWidth(drawerElement) + 'px');
            // @ts-ignore
            $(clippingAreaEl).position(position);
            drawerElement.style.setProperty('position', 'static');
        }
        static unwrapDrawerClippingArea(drawerElement) {
            if (drawerElement) {
                drawerElement.style.removeProperty('position');
                $(drawerElement).unwrap();
            }
        }
    }

    exports.DrawerConstants = DrawerConstants;
    exports.DrawerUtils = DrawerUtils;

    Object.defineProperty(exports, '__esModule', { value: true });

});
