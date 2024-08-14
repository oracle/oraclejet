/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojvcomponent', 'preact', 'jquery', 'ojs/ojanimation', 'ojs/ojcore-base', 'ojs/ojpopup', 'ojs/ojdrawerutils', 'hammerjs', 'ojs/ojcustomelement-utils'], function (exports, jsxRuntime, ojvcomponent, preact, $, AnimationUtils, ojcoreBase, ojpopup, ojdrawerutils, Hammer, ojcustomelementUtils) { 'use strict';

    $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
    Hammer = Hammer && Object.prototype.hasOwnProperty.call(Hammer, 'default') ? Hammer['default'] : Hammer;

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var DrawerPopup_1;
    const ojet = oj;
    const PopupService = oj.PopupService;
    const targetElement = window;
    const ZOrderUtils = oj.ZOrderUtils;
    exports.DrawerPopup = DrawerPopup_1 = class DrawerPopup extends preact.Component {
        constructor() {
            super(...arguments);
            this.state = {
                opened: this.props.opened,
                viewportResolvedDisplayMode: this.getViewportResolvedDisplayMode(),
                viewportResolvedDisplayModeVertical: this.getViewportResolvedDisplayModeVertical()
            };
            this.rootRef = preact.createRef();
            this.windowResizeHandler = null;
            this.ignoreUpdate = false;
            this.handleGuardFocus = (guardPosition, event) => {
                if (this.props.modality === 'modal') {
                    const focusables = ojdrawerutils.DrawerUtils.getFocusables(this.rootRef.current);
                    const { length, 0: firstFocusableItem, [length - 1]: lastFocusableItem } = focusables;
                    event.preventDefault();
                    if (!length) {
                        this.rootRef.current.focus();
                        return;
                    }
                    if (guardPosition === 'start') {
                        lastFocusableItem.focus();
                    }
                    else {
                        firstFocusableItem.focus();
                    }
                }
            };
            this.handleOnStartGuardFocus = (event) => {
                this.handleGuardFocus('start', event);
            };
            this.handleOnEndGuardFocus = (event) => {
                this.handleGuardFocus('end', event);
            };
            this.handleKeyDown = (event) => {
                if (event.defaultPrevented) {
                    return;
                }
                if (event.key === ojdrawerutils.DrawerConstants.keys.ESC) {
                    this.selfClose();
                    return;
                }
            };
            this.autoDismissHandler = (event) => {
                const focusables = ojdrawerutils.DrawerUtils.getFocusables(this.rootRef.current);
                const zorderLayer = this.rootRef.current.parentNode;
                const isTargetWithin = this.isTargetDescendantOfOwnZorderLayerOrItsNextSiblings(zorderLayer, event.target);
                if (this.props.autoDismiss === 'focus-loss' && !isTargetWithin) {
                    this.selfClose();
                }
                else if (this.props.autoDismiss === 'none' &&
                    this.props.modality === 'modal' &&
                    !isTargetWithin) {
                    event.preventDefault();
                }
            };
            this.refreshHandler = (edge) => {
                PopupService.getInstance().triggerOnDescendents($(this.rootRef.current), PopupService.EVENT.POPUP_REFRESH);
            };
            this.destroyHandler = () => {
                const $drawerElement = $(this.rootRef.current);
                const status = ZOrderUtils.getStatus($drawerElement);
                if (status === ZOrderUtils.STATUS.OPEN) {
                    ojcustomelementUtils.CustomElementUtils.cleanComponentBindings($drawerElement[0]);
                    $drawerElement.remove();
                    const psOptions = {};
                    psOptions[PopupService.OPTION.POPUP] = $drawerElement;
                    this.ignoreUpdate = true;
                    PopupService.getInstance().close(psOptions);
                }
            };
            this.isTargetDescendantOfOwnZorderLayerOrItsNextSiblings = (zorderLayer, target) => {
                const zorderLayersBuffer = [zorderLayer];
                let nextZorderLayer = zorderLayer.nextSibling;
                while (nextZorderLayer) {
                    zorderLayersBuffer.push(nextZorderLayer);
                    nextZorderLayer = nextZorderLayer.nextSibling;
                }
                return zorderLayersBuffer.some((zorderLayerItem) => {
                    return zorderLayerItem.contains(target);
                });
            };
            this.windowResizeCallback = () => {
                const updatedState = {};
                const prevViewportResolvedDisplayMode = this.state.viewportResolvedDisplayMode;
                const nextViewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
                if (prevViewportResolvedDisplayMode !== nextViewportResolvedDisplayMode) {
                    updatedState['viewportResolvedDisplayMode'] = nextViewportResolvedDisplayMode;
                }
                const prevViewportResolvedDisplayModeVertical = this.state.viewportResolvedDisplayModeVertical;
                const nextViewportResolvedDisplayModeVertical = this.getViewportResolvedDisplayModeVertical();
                if (prevViewportResolvedDisplayModeVertical !== nextViewportResolvedDisplayModeVertical) {
                    updatedState['viewportResolvedDisplayModeVertical'] = nextViewportResolvedDisplayModeVertical;
                }
                if (this.isDrawerOpened() &&
                    prevViewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringFullOverlay &&
                    nextViewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringOverlay) {
                    if (this.isIOSspecificScrollCase()) {
                        this.applyPopupServiceModalChanges('modeless');
                    }
                    else if (this.isAndroidSpecificScrollCase()) {
                        ojdrawerutils.DrawerUtils.enableBodyOverflow();
                    }
                }
                if (this.isDrawerOpened() &&
                    prevViewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringOverlay &&
                    nextViewportResolvedDisplayMode === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                    if (this.isIOSspecificScrollCase()) {
                        this.applyPopupServiceModalChanges('modal');
                    }
                    else if (this.isAndroidSpecificScrollCase()) {
                        ojdrawerutils.DrawerUtils.disableBodyOverflow();
                    }
                }
                if (Object.keys(updatedState).length > 0) {
                    this.setState(updatedState);
                }
            };
            this.handleSwipeAction = () => {
                this.selfClose();
            };
        }
        static getDerivedStateFromProps(props, state) {
            if (props.opened !== state.opened) {
                return { opened: props.opened };
            }
            return null;
        }
        render(props) {
            if (!this.ignoreUpdate && (this.isDrawerOpened() || this.wasDrawerOpenedInPrevState())) {
                return (jsxRuntime.jsx(ojvcomponent.Root, { ref: this.rootRef, class: this.getPopupStyleClasses(this.props.edge), tabIndex: -1, role: this.props.role || 'dialog', onKeyDown: this.handleKeyDown, children: jsxRuntime.jsxs("div", { class: "oj-drawer-full-height", children: [jsxRuntime.jsx("div", { class: "oj-drawer-focus-guard", onFocus: this.handleOnStartGuardFocus, tabIndex: 0 }), props.children, jsxRuntime.jsx("div", { class: "oj-drawer-focus-guard", onFocus: this.handleOnEndGuardFocus, tabIndex: 0 })] }) }));
            }
            return jsxRuntime.jsx(ojvcomponent.Root, {});
        }
        isDrawerOpened() {
            return this.state[ojdrawerutils.DrawerConstants.stringOpened];
        }
        wasDrawerOpenedInPrevState() {
            return this.openedPrevState;
        }
        async selfClose() {
            try {
                await this.props.onOjBeforeClose?.();
            }
            catch (_) {
                return;
            }
            this.props.onOpenedChanged?.(false);
        }
        openOrCloseDrawer(prevState) {
            if (this.isDrawerOpened() != prevState.opened) {
                this.openedPrevState = this.isDrawerOpened();
            }
            const $drawerElement = $(this.rootRef.current);
            const popupServiceInstance = PopupService.getInstance();
            const popupServiceOptions = this.getPopupServiceOptions(prevState);
            if (this.isDrawerOpened()) {
                if ([ZOrderUtils.STATUS.CLOSE, ZOrderUtils.STATUS.UNKNOWN].indexOf(ZOrderUtils.getStatus($drawerElement) > -1)) {
                    popupServiceInstance.open(popupServiceOptions);
                }
            }
            else {
                if (ZOrderUtils.getStatus($drawerElement) === ZOrderUtils.STATUS.OPEN) {
                    if (this.isIOSspecificScrollCase() &&
                        this.getViewportResolvedDisplayMode() === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                        this.applyPopupServiceModalChanges('modeless');
                    }
                    popupServiceInstance.close(popupServiceOptions);
                }
            }
        }
        getPopupServiceOptions(prevState) {
            const edge = this.props.edge;
            const $drawerElement = $(this.rootRef.current);
            const PSOptions = {};
            const PSoption = PopupService.OPTION;
            PSOptions[PSoption.POPUP] = $drawerElement;
            PSOptions[PSoption.LAUNCHER] = $(document.activeElement);
            PSOptions[PSoption.MODALITY] = this.props.modality;
            PSOptions[PSoption.LAYER_SELECTORS] = this.getDrawerSurrogateLayerSelectors();
            PSOptions[PSoption.LAYER_LEVEL] = PopupService.LAYER_LEVEL.TOP_LEVEL;
            PSOptions[PSoption.POSITION] = null;
            PSOptions[PSoption.CUSTOM_ELEMENT] = true;
            const PSEvent = PopupService.EVENT;
            PSOptions[PSoption.EVENTS] = {
                [PSEvent.POPUP_BEFORE_OPEN]: () => this.beforeOpenHandler(edge, PSOptions),
                [PSEvent.POPUP_AFTER_OPEN]: () => this.afterOpenHandler(edge, prevState),
                [PSEvent.POPUP_BEFORE_CLOSE]: () => this.beforeCloseHandler(edge),
                [PSEvent.POPUP_AFTER_CLOSE]: () => this.afterCloseHandler(prevState),
                [PSEvent.POPUP_AUTODISMISS]: (event) => this.autoDismissHandler(event),
                [PSEvent.POPUP_REFRESH]: () => this.refreshHandler(edge),
                [PSEvent.POPUP_REMOVE]: () => this.destroyHandler()
            };
            return PSOptions;
        }
        beforeOpenHandler(edge, PSOptions) {
            ojdrawerutils.DrawerUtils.disableBodyOverflow();
            this.drawerOpener = document.activeElement;
            PSOptions[PopupService.OPTION.POPUP].show();
            const busyContext = ojet.Context.getContext(this.rootRef.current).getBusyContext();
            const resolveFunc = busyContext.addBusyState({ description: 'Animation in progress' });
            const animationPromise = AnimationUtils.slideIn(this.rootRef.current, ojdrawerutils.DrawerUtils.getAnimationOptions(ojdrawerutils.DrawerConstants.stringSlideIn, edge));
            animationPromise.then(resolveFunc);
            return animationPromise;
        }
        afterOpenHandler(edge, prevState) {
            ojdrawerutils.DrawerUtils.enableBodyOverflow();
            if (this.isIOSspecificScrollCase() &&
                this.getViewportResolvedDisplayMode() === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                this.applyPopupServiceModalChanges('modal');
            }
            if (this.isAndroidSpecificScrollCase() &&
                this.getViewportResolvedDisplayMode() === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                ojdrawerutils.DrawerUtils.disableBodyOverflow();
            }
            this.handleFocus(prevState);
            const $drawerElement = $(this.rootRef.current);
            const status = ZOrderUtils.getStatus($drawerElement);
            if (status === ZOrderUtils.STATUS.OPEN && !this.isDrawerOpened()) {
                const popupServiceInstance = PopupService.getInstance();
                const popupServiceOptions = this.getPopupServiceOptions(prevState);
                popupServiceInstance.close(popupServiceOptions);
            }
        }
        handleFocus(prevState) {
            if (this.state.opened && prevState.opened !== this.state.opened) {
                const rootRef = this.rootRef.current;
                const autofocusItems = ojdrawerutils.DrawerUtils.getAutofocusFocusables(rootRef);
                const { length: autofocusLength, 0: autofocusFirstItem } = autofocusItems;
                if (autofocusLength > 0) {
                    autofocusFirstItem.focus({ preventScroll: true });
                    return;
                }
                const focusables = ojdrawerutils.DrawerUtils.getFocusables(rootRef);
                let elementToFocus = rootRef;
                if (focusables.length) {
                    elementToFocus = focusables[0];
                }
                elementToFocus.focus({ preventScroll: true });
            }
        }
        beforeCloseHandler(edge) {
            ojdrawerutils.DrawerUtils.disableBodyOverflow();
            this.elementWithFocusBeforeDrawerCloses = document.activeElement;
            if (this.ignoreUpdate) {
                return null;
            }
            const busyContext = ojet.Context.getContext(this.rootRef.current).getBusyContext();
            const resolveFunc = busyContext.addBusyState({ description: 'Animation in progress' });
            const animationPromise = AnimationUtils.slideOut(this.rootRef.current, ojdrawerutils.DrawerUtils.getAnimationOptions(ojdrawerutils.DrawerConstants.stringSlideOut, edge));
            return animationPromise.then(resolveFunc);
        }
        afterCloseHandler(prevState) {
            ojdrawerutils.DrawerUtils.enableBodyOverflow();
            if (this.rootRef.current.contains(this.elementWithFocusBeforeDrawerCloses)) {
                ojdrawerutils.DrawerUtils.moveFocusToElementOrNearestAncestor(this.drawerOpener);
            }
            if (this.ignoreUpdate) {
                return;
            }
            const $drawerElement = $(this.rootRef.current);
            const status = ZOrderUtils.getStatus($drawerElement);
            if (status === ZOrderUtils.STATUS.CLOSE && this.isDrawerOpened()) {
                const popupServiceInstance = PopupService.getInstance();
                const popupServiceOptions = this.getPopupServiceOptions(prevState);
                popupServiceInstance.open(popupServiceOptions);
            }
            else if (!this.wasDrawerOpenedInPrevState()) {
                window.queueMicrotask(() => {
                    this.forceUpdate();
                });
            }
            this.props.onOjClose?.();
        }
        getDrawerSurrogateLayerSelectors() {
            let surrogateLayerStyles = ojdrawerutils.DrawerConstants.DrawerPopupStyleSurrogate;
            const stringModal = 'modal';
            if (this.props.modality === stringModal) {
                surrogateLayerStyles += ` ${ojdrawerutils.DrawerConstants.stringOjDrawer}${ojdrawerutils.DrawerConstants.charDash}${stringModal}`;
            }
            return surrogateLayerStyles;
        }
        getPopupStyleClasses(edge) {
            const customStyleClassMap = {};
            if (edge === ojdrawerutils.DrawerConstants.stringBottom) {
                if (this.getViewportResolvedDisplayModeVertical() === ojdrawerutils.DrawerConstants.stringFullOverlay ||
                    this.getViewportResolvedDisplayMode() === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                    customStyleClassMap[ojdrawerutils.DrawerConstants.styleDisplayMode(ojdrawerutils.DrawerConstants.stringFullOverlay)] =
                        true;
                }
            }
            else {
                if (this.getViewportResolvedDisplayMode() === ojdrawerutils.DrawerConstants.stringFullOverlay) {
                    customStyleClassMap[ojdrawerutils.DrawerConstants.styleDisplayMode(ojdrawerutils.DrawerConstants.stringFullOverlay)] =
                        true;
                }
            }
            return ojdrawerutils.DrawerUtils.getStyleClassesMapAsString(Object.assign(customStyleClassMap, ojdrawerutils.DrawerUtils.getCommonStyleClasses(edge)));
        }
        componentDidUpdate(prevProps, prevState) {
            if (!this.ignoreUpdate) {
                this.handleComponentUpdate(prevState);
            }
        }
        componentDidMount() {
            if (this.windowResizeHandler === null) {
                this.windowResizeHandler = this.windowResizeCallback.bind(this);
            }
            window.addEventListener(ojdrawerutils.DrawerConstants.stringResize, this.windowResizeHandler);
            this.openedPrevState = this.props.opened;
            if (DrawerPopup_1.defaultProps.opened != this.props.opened) {
                const stateCopy = Object.assign({}, this.state);
                stateCopy.opened = false;
                this.handleComponentUpdate(stateCopy);
            }
        }
        componentWillUnmount() {
            window.removeEventListener(ojdrawerutils.DrawerConstants.stringResize, this.windowResizeHandler);
            this.windowResizeHandler = null;
        }
        getViewportResolvedDisplayMode() {
            const viewportWidth = ojdrawerutils.DrawerUtils.getViewportWidth();
            if (viewportWidth >= ojdrawerutils.DrawerConstants.fullWidthDrawerChangeThreshold) {
                return ojdrawerutils.DrawerConstants.stringOverlay;
            }
            return ojdrawerutils.DrawerConstants.stringFullOverlay;
        }
        getViewportResolvedDisplayModeVertical() {
            const viewportHeight = ojdrawerutils.DrawerUtils.getViewportHeight();
            if (viewportHeight >= ojdrawerutils.DrawerConstants.fullHeightDrawerChangeThreshold) {
                return ojdrawerutils.DrawerConstants.stringOverlay;
            }
            return ojdrawerutils.DrawerConstants.stringFullOverlay;
        }
        handleComponentUpdate(prevState) {
            this.openOrCloseDrawer(prevState);
            if (this.isDrawerOpened() && this.props.closeGesture === 'swipe') {
                this.registerCloseWithSwipeListener();
            }
            if (this.isDrawerOpened() === false && prevState.opened) {
                this.unregisterCloseWithSwipeListener();
            }
        }
        registerCloseWithSwipeListener() {
            this.hammerInstance = new Hammer(targetElement);
            if (this.props.edge === ojdrawerutils.DrawerConstants.stringBottom) {
                this.hammerInstance.get('swipe').set({ direction: Hammer.DIRECTION_DOWN });
            }
            this.hammerInstance.on(this.getSwipeCloseDirection(this.props.edge), this.handleSwipeAction);
        }
        getSwipeCloseDirection(edge) {
            const swipeLeft = 'swipeleft';
            const swipeRigth = 'swiperight';
            switch (edge) {
                case ojdrawerutils.DrawerConstants.stringStart: {
                    return ojdrawerutils.DrawerUtils.isRTL() ? swipeRigth : swipeLeft;
                }
                case ojdrawerutils.DrawerConstants.stringEnd: {
                    return ojdrawerutils.DrawerUtils.isRTL() ? swipeLeft : swipeRigth;
                }
                case ojdrawerutils.DrawerConstants.stringBottom: {
                    return 'swipedown';
                }
            }
        }
        unregisterCloseWithSwipeListener() {
            if (this.hammerInstance) {
                this.hammerInstance.off(this.getSwipeCloseDirection(this.props.edge), this.handleSwipeAction);
            }
        }
        isIOSspecificScrollCase() {
            return (ojet.AgentUtils.getAgentInfo().os === ojet.AgentUtils.OS.IOS &&
                this.props.modality === 'modeless');
        }
        isAndroidSpecificScrollCase() {
            return (ojet.AgentUtils.getAgentInfo().os === ojet.AgentUtils.OS.ANDROID &&
                this.props.modality === 'modeless');
        }
        applyPopupServiceModalChanges(modalValue) {
            const PSOptions = {};
            const PSoption = PopupService.OPTION;
            PSOptions[PSoption.POPUP] = $(this.rootRef.current);
            PSOptions[PSoption.MODALITY] = modalValue;
            PopupService.getInstance().changeOptions(PSOptions);
        }
    };
    exports.DrawerPopup.defaultProps = {
        autoDismiss: 'focus-loss',
        edge: 'start',
        modality: 'modal',
        opened: false,
        closeGesture: 'swipe'
    };
    exports.DrawerPopup._metadata = { "slots": { "": {} }, "properties": { "opened": { "type": "boolean", "writeback": true }, "edge": { "type": "string", "enumValues": ["end", "start", "bottom"] }, "modality": { "type": "string", "enumValues": ["modal", "modeless"] }, "autoDismiss": { "type": "string", "enumValues": ["none", "focus-loss"] }, "closeGesture": { "type": "string", "enumValues": ["none", "swipe"] } }, "events": { "ojBeforeClose": { "cancelable": true }, "ojClose": {} }, "extension": { "_WRITEBACK_PROPS": ["opened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["role"] } };
    exports.DrawerPopup = DrawerPopup_1 = __decorate([
        ojvcomponent.customElement('oj-drawer-popup')
    ], exports.DrawerPopup);

    Object.defineProperty(exports, '__esModule', { value: true });

});
