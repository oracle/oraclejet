/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { getUniqueId, Root, customElement } from 'ojs/ojvcomponent';
import { Component, createRef, h } from 'preact';
import $ from 'jquery';
import { slideIn, slideOut } from 'ojs/ojanimation';
import { addResizeListener, removeResizeListener } from 'ojs/ojdomutils';
import 'ojs/ojcore-base';
import 'ojs/ojpopup';
import { DrawerConstants, DrawerUtils } from 'ojs/ojdrawerutils';
import Hammer from 'hammerjs';

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
let DrawerPopup = DrawerPopup_1 = class DrawerPopup extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            opened: this.props.opened,
            id: getUniqueId(),
            viewportResolvedDisplayMode: this.getViewportResolvedDisplayMode()
        };
        this.rootRef = createRef();
        this.isShiftKeyActive = false;
        this.drawerResizeHandler = null;
        this.handleKeyDown = (event) => {
            if (event.key === DrawerConstants.keys.ESC) {
                this.selfClose();
                return;
            }
            const focusables = this.getFocusables();
            if (event.key === DrawerConstants.keys.TAB && this.props.modality === 'modal') {
                this.isShiftKeyActive = event.shiftKey;
                const { length, 0: firstItem, [length - 1]: lastItem } = focusables;
                if (!length) {
                    event.preventDefault();
                    this.rootRef.current.focus();
                    return;
                }
                if (event.shiftKey) {
                    if (document.activeElement === firstItem) {
                        event.preventDefault();
                        lastItem.focus();
                        return;
                    }
                }
                else {
                    if (document.activeElement === lastItem) {
                        event.preventDefault();
                        firstItem.focus();
                        return;
                    }
                }
            }
        };
        this.autoDismissHandler = (event) => {
            const focusables = this.getFocusables();
            const zorderLayer = this.rootRef.current.parentNode;
            if (this.props.autoDismiss === 'focus-loss') {
                const isTargetWithin = this.isTargetDescendantOfOwnZorderLayerOrItsNextSiblings(zorderLayer, event.target);
                if (event.type === 'focus' && this.props.modality === 'modal' && !isTargetWithin) {
                    event.preventDefault();
                    const elementLosingFocus = event.relatedTarget;
                    const firstFocusableElement = focusables[0];
                    const lastFocusableElement = focusables[focusables.length - 1];
                    if (elementLosingFocus === firstFocusableElement) {
                        lastFocusableElement.focus();
                    }
                    else {
                        firstFocusableElement.focus();
                    }
                    return;
                }
                if (!isTargetWithin) {
                    DrawerPopup_1.idsClosedWithAutoDismiss.push(this.state.id);
                    this.selfClose();
                }
            }
        };
        this.getFocusables = () => {
            return this.rootRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video');
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
        this.resizeHandler = () => {
            const prevViewportResolvedDisplayMode = this.state.viewportResolvedDisplayMode;
            const nextViewportResolvedDisplayMode = this.getViewportResolvedDisplayMode();
            if (prevViewportResolvedDisplayMode !== nextViewportResolvedDisplayMode) {
                this.setState({ viewportResolvedDisplayMode: nextViewportResolvedDisplayMode });
            }
        };
        this.handleSwipeAction = () => {
            this.selfClose();
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (DrawerPopup_1.idsClosedWithAutoDismiss.indexOf(state.id) > -1 && props.opened) {
            return { opened: false };
        }
        if (props.opened !== state.opened) {
            return { opened: props.opened };
        }
        return null;
    }
    render(props) {
        if (this.isDrawerOpened() ||
            this.wasDrawerOpenedInPrevState() ||
            this.isDrawerClosedWithAutoDismiss()) {
            return (h(Root, { ref: this.rootRef, class: this.getPopupStyleClasses(this.props.edge), tabIndex: -1, role: this.props.role || 'dialog', onKeyDown: this.handleKeyDown },
                h("div", { class: "oj-drawer-full-height" }, props.children)));
        }
        return h(Root, null);
    }
    isDrawerOpened() {
        return this.state[DrawerConstants.stringOpened];
    }
    wasDrawerOpenedInPrevState() {
        return this.openedPrevState;
    }
    isDrawerClosedWithAutoDismiss() {
        return DrawerPopup_1.idsClosedWithAutoDismiss.indexOf(this.state.id) > -1;
    }
    selfClose() {
        var _a, _b;
        (_b = (_a = this.props).onOpenedChanged) === null || _b === void 0 ? void 0 : _b.call(_a, false);
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
        PSOptions[PSoption.POSITION] = this.getDrawerPosition(edge);
        const PSEvent = PopupService.EVENT;
        PSOptions[PSoption.EVENTS] = {
            [PSEvent.POPUP_BEFORE_OPEN]: () => this.beforeOpenHandler(edge, PSOptions),
            [PSEvent.POPUP_AFTER_OPEN]: () => this.afterOpenHandler(edge, prevState),
            [PSEvent.POPUP_BEFORE_CLOSE]: () => this.beforeCloseHandler(edge),
            [PSEvent.POPUP_AFTER_CLOSE]: () => this.afterCloseHandler(prevState),
            [PSEvent.POPUP_AUTODISMISS]: (event) => this.autoDismissHandler(event),
            [PSEvent.POPUP_REFRESH]: () => {
                $drawerElement.position(this.getDrawerPosition(edge));
            }
        };
        return PSOptions;
    }
    beforeOpenHandler(edge, PSOptions) {
        DrawerUtils.disableBodyOverflow();
        const $drawerElement = PSOptions[PopupService.OPTION.POPUP];
        const position = PSOptions[PopupService.OPTION.POSITION];
        $drawerElement.show();
        $drawerElement.position(position);
        const busyContext = ojet.Context.getContext(this.rootRef.current).getBusyContext();
        const resolveFunc = busyContext.addBusyState({ description: 'Animation in progress' });
        const animationPromise = slideIn(this.rootRef.current, DrawerUtils.getAnimationOptions(DrawerConstants.stringSlideIn, edge));
        animationPromise.then(resolveFunc);
        return animationPromise;
    }
    afterOpenHandler(edge, prevState) {
        DrawerUtils.enableBodyOverflow();
        this.handleFocus(prevState);
        const $drawerElement = $(this.rootRef.current);
        const status = ZOrderUtils.getStatus($drawerElement);
        if (this.drawerResizeHandler === null) {
            this.drawerResizeHandler = this.drawerResizeCallback.bind(this, $drawerElement, edge);
        }
        addResizeListener(this.rootRef.current, this.drawerResizeHandler, 0, true);
        if (status === ZOrderUtils.STATUS.OPEN && !this.isDrawerOpened()) {
            const popupServiceInstance = PopupService.getInstance();
            const popupServiceOptions = this.getPopupServiceOptions(prevState);
            popupServiceInstance.close(popupServiceOptions);
        }
    }
    drawerResizeCallback($drawerElement, edge) {
        $drawerElement.position(this.getDrawerPosition(edge));
    }
    handleFocus(prevState) {
        if (this.state.opened && prevState.opened !== this.state.opened) {
            const autofocusItems = this.rootRef.current.querySelectorAll('[autofocus]');
            const { length: autofocusLength, 0: autofocusFirstItem } = autofocusItems;
            if (autofocusLength > 0) {
                autofocusFirstItem.focus();
                return;
            }
            const focusables = this.getFocusables();
            let elementToFocus = this.rootRef.current;
            if (focusables.length) {
                for (let i = 0; i < focusables.length; i++) {
                    if (focusables[i].disabled !== true) {
                        elementToFocus = focusables[i];
                        break;
                    }
                }
            }
            elementToFocus.focus();
        }
    }
    beforeCloseHandler(edge) {
        DrawerUtils.disableBodyOverflow();
        removeResizeListener(this.rootRef.current, this.drawerResizeHandler);
        const busyContext = ojet.Context.getContext(this.rootRef.current).getBusyContext();
        const resolveFunc = busyContext.addBusyState({ description: 'Animation in progress' });
        const animationPromise = slideOut(this.rootRef.current, DrawerUtils.getAnimationOptions(DrawerConstants.stringSlideOut, edge));
        animationPromise.then(resolveFunc);
        return animationPromise;
    }
    afterCloseHandler(prevState) {
        var _a, _b;
        DrawerUtils.enableBodyOverflow();
        const $drawerElement = $(this.rootRef.current);
        const status = ZOrderUtils.getStatus($drawerElement);
        if (this.isDrawerClosedWithAutoDismiss()) {
            DrawerPopup_1.idsClosedWithAutoDismiss.splice(DrawerPopup_1.idsClosedWithAutoDismiss.indexOf(this.state.id), 1);
            if (status === ZOrderUtils.STATUS.CLOSE && this.props.opened) {
                (_b = (_a = this.props).onOpenedChanged) === null || _b === void 0 ? void 0 : _b.call(_a, false);
            }
        }
        if (status === ZOrderUtils.STATUS.CLOSE && this.isDrawerOpened()) {
            const popupServiceInstance = PopupService.getInstance();
            const popupServiceOptions = this.getPopupServiceOptions(prevState);
            popupServiceInstance.open(popupServiceOptions);
        }
        else if (!this.wasDrawerOpenedInPrevState()) {
            this.forceUpdate();
        }
    }
    getDrawerSurrogateLayerSelectors() {
        let surrogateLayerStyles = DrawerConstants.DrawerPopupStyleSurrogate;
        const stringModal = 'modal';
        if (this.props.modality === stringModal) {
            surrogateLayerStyles += ` ${DrawerConstants.stringOjDrawer}${DrawerConstants.charDash}${stringModal}`;
        }
        return surrogateLayerStyles;
    }
    getDrawerPosition(edge) {
        let pos = `${edge} ${edge === 'bottom' ? 'bottom' : 'top'}`;
        let position = {
            my: pos,
            at: pos,
            of: window,
            collision: 'none'
        };
        return oj.PositionUtils.normalizeHorizontalAlignment(position, DrawerUtils.isRTL());
    }
    getPopupStyleClasses(edge) {
        const customStyleClassMap = {};
        if (this.getViewportResolvedDisplayMode() === DrawerConstants.stringFullOverlay) {
            customStyleClassMap[DrawerConstants.styleDisplayMode(DrawerConstants.stringFullOverlay)] =
                true;
        }
        return DrawerUtils.getStyleClassesMapAsString(Object.assign(customStyleClassMap, DrawerUtils.getCommonStyleClasses(edge)));
    }
    componentDidUpdate(prevProps, prevState) {
        this.handleComponentUpdate(prevState);
    }
    componentDidMount() {
        window.addEventListener(DrawerConstants.stringResize, () => {
            this.resizeHandler();
        });
        this.openedPrevState = this.props.opened;
        if (DrawerPopup_1.defaultProps.opened != this.props.opened) {
            const stateCopy = Object.assign({}, this.state);
            stateCopy.opened = false;
            this.handleComponentUpdate(stateCopy);
        }
    }
    componentWillUnmount() {
        window.removeEventListener(DrawerConstants.stringResize, () => {
            this.resizeHandler();
        });
    }
    getViewportResolvedDisplayMode() {
        const viewportWidth = DrawerUtils.getViewportWidth();
        if (viewportWidth >= DrawerConstants.fullWidthDrawerChangeThreshold) {
            return DrawerConstants.stringOverlay;
        }
        return DrawerConstants.stringFullOverlay;
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
        if (this.props.edge === DrawerConstants.stringBottom) {
            this.hammerInstance.get('swipe').set({ direction: Hammer.DIRECTION_DOWN });
        }
        this.hammerInstance.on(this.getSwipeCloseDirection(this.props.edge), this.handleSwipeAction);
    }
    getSwipeCloseDirection(edge) {
        const swipeLeft = 'swipeleft';
        const swipeRigth = 'swiperight';
        switch (edge) {
            case DrawerConstants.stringStart: {
                return DrawerUtils.isRTL() ? swipeRigth : swipeLeft;
            }
            case DrawerConstants.stringEnd: {
                return DrawerUtils.isRTL() ? swipeLeft : swipeRigth;
            }
            case DrawerConstants.stringBottom: {
                return 'swipedown';
            }
        }
    }
    unregisterCloseWithSwipeListener() {
        if (this.hammerInstance) {
            this.hammerInstance.off(this.getSwipeCloseDirection(this.props.edge), this.handleSwipeAction);
        }
    }
};
DrawerPopup.defaultProps = {
    autoDismiss: 'focus-loss',
    edge: 'start',
    modality: 'modal',
    opened: false,
    closeGesture: 'swipe'
};
DrawerPopup.idsClosedWithAutoDismiss = [];
DrawerPopup.metadata = { "slots": { "": {} }, "properties": { "opened": { "type": "boolean", "writeback": true }, "edge": { "type": "string", "enumValues": ["start", "end", "bottom"] }, "modality": { "type": "string", "enumValues": ["modal", "modeless"] }, "autoDismiss": { "type": "string", "enumValues": ["focus-loss", "none"] }, "closeGesture": { "type": "string", "enumValues": ["swipe", "none"] } }, "extension": { "_WRITEBACK_PROPS": ["opened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["role"] } };
DrawerPopup = DrawerPopup_1 = __decorate([
    customElement('oj-drawer-popup')
], DrawerPopup);

export { DrawerPopup };
