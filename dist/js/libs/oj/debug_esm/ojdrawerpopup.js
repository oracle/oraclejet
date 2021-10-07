/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Root, customElement } from 'ojs/ojvcomponent';
import { Component, createRef, h } from 'preact';
import $ from 'jquery';
import { slideIn, slideOut } from 'ojs/ojanimation';
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
const PopupService = oj.PopupService;
const targetElement = window;
let DrawerPopup = DrawerPopup_1 = class DrawerPopup extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            opened: this.props.opened,
            selfClosed: false
        };
        this.rootRef = createRef();
        this.isShiftKeyActive = false;
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
        this.handleSwipeAction = () => {
            this.selfClose();
        };
    }
    render(props) {
        return (h(Root, { ref: this.rootRef, class: this.getPopupStyleClasses(this.props.edge), tabIndex: -1, role: this.props.role || 'dialog', onKeyDown: this.handleKeyDown }, props.children));
    }
    selfClose() {
        var _a, _b;
        const updatedState = {};
        updatedState.opened = false;
        updatedState.selfClosed = true;
        this.setState(updatedState);
        (_b = (_a = this.props).onOpenedChanged) === null || _b === void 0 ? void 0 : _b.call(_a, false);
    }
    renderDrawer(prevState) {
        const edge = this.props.edge;
        const $drawerElement = $(this.rootRef.current);
        const PSOptions = {};
        const PSoption = PopupService.OPTION;
        PSOptions[PSoption.POPUP] = $drawerElement;
        PSOptions[PSoption.LAUNCHER] = $(document.activeElement);
        PSOptions[PSoption.MODALITY] = this.props.modality;
        PSOptions[PSoption.LAYER_SELECTORS] = this.getDrawerSurrogateLayerSelectors();
        PSOptions[PSoption.POSITION] = this.getDrawerPosition(edge);
        const PSEvent = PopupService.EVENT;
        PSOptions[PSoption.EVENTS] = {
            [PSEvent.POPUP_BEFORE_OPEN]: () => this.beforeOpenHandler(edge, PSOptions),
            [PSEvent.POPUP_AFTER_OPEN]: () => this.handleFocus(prevState),
            [PSEvent.POPUP_BEFORE_CLOSE]: () => this.beforeCloseHandler(edge),
            [PSEvent.POPUP_AUTODISMISS]: (event) => this.autoDismissHandler(event),
            [PSEvent.POPUP_REFRESH]: () => {
                $drawerElement.position(this.getDrawerPosition(edge));
            }
        };
        const popupServiceInstance = PopupService.getInstance();
        this.isDrawerOpened()
            ? popupServiceInstance.open(PSOptions)
            : popupServiceInstance.close(PSOptions);
    }
    beforeOpenHandler(edge, PSOptions) {
        const $drawerElement = PSOptions[PopupService.OPTION.POPUP];
        const position = PSOptions[PopupService.OPTION.POSITION];
        if ([DrawerConstants.stringStart, DrawerConstants.stringEnd].indexOf(edge) > -1) {
            this.rootRef.current.style.height = `${window.innerHeight}px`;
        }
        if (DrawerConstants.stringBottom === edge) {
            this.rootRef.current.style.width = `${document.documentElement.clientWidth}px`;
        }
        $drawerElement.show();
        $drawerElement.position(position);
        return slideIn(this.rootRef.current, DrawerUtils.getAnimationOptions(DrawerConstants.stringOpen, edge));
    }
    beforeCloseHandler(edge) {
        return slideOut(this.rootRef.current, DrawerUtils.getAnimationOptions(DrawerConstants.stringClose, edge));
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
    isDrawerOpened() {
        return this.state['opened'];
    }
    getPopupStyleClasses(edge) {
        return DrawerUtils.getStyleClassesMapAsString(Object.assign({}, DrawerUtils.getCommonStyleClasses(edge, this.isDrawerOpened())));
    }
    static getDerivedStateFromProps(props, state) {
        const derivedState = {};
        if (state.selfClosed === false) {
            if (props.opened !== state.opened) {
                derivedState.opened = props.opened;
            }
        }
        if (state.opened === false) {
            derivedState.selfClosed = false;
        }
        return derivedState;
    }
    handleFocus(prevState) {
        const focusables = this.getFocusables();
        if (this.state.opened && prevState.opened !== this.state.opened) {
            const autofocusItems = this.rootRef.current.querySelectorAll('[autofocus]');
            const { length: autofocusLength, 0: autofocusFirstItem } = autofocusItems;
            if (autofocusLength > 0) {
                autofocusFirstItem.focus();
                return;
            }
            const { length: focusableLength, 0: focusableFirstItem } = focusables;
            const firstFocusableElem = focusableLength > 0 ? focusableFirstItem : this.rootRef.current;
            firstFocusableElem.focus();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        this.handleComponentUpdate(prevState);
    }
    componentDidMount() {
        if (DrawerPopup_1.defaultProps.opened != this.props.opened) {
            const stateCopy = Object.assign({}, this.state);
            stateCopy.opened = false;
            this.handleComponentUpdate(stateCopy);
        }
    }
    handleComponentUpdate(prevState) {
        this.renderDrawer(prevState);
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
DrawerPopup.metadata = { "slots": { "": {} }, "properties": { "opened": { "type": "boolean", "writeback": true }, "edge": { "type": "string", "enumValues": ["start", "end", "bottom"] }, "modality": { "type": "string", "enumValues": ["modal", "modeless"] }, "autoDismiss": { "type": "string", "enumValues": ["focus-loss", "none"] }, "closeGesture": { "type": "string", "enumValues": ["swipe", "none"] } }, "extension": { "_WRITEBACK_PROPS": ["opened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["role"] } };
DrawerPopup = DrawerPopup_1 = __decorate([
    customElement('oj-drawer-popup')
], DrawerPopup);

export { DrawerPopup };
