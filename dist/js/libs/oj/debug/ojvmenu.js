/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojmenu', 'preact'], function (exports, jsxRuntime, ojmenu, preact) { 'use strict';

    class VMenu extends preact.Component {
        constructor(props) {
            super(props);
            this._rootRef = null;
        }
        render(props) {
            return (jsxRuntime.jsx("div", Object.assign({ style: { display: 'none' }, ref: (elem) => (this._rootRef = elem) }, { children: props.children })));
        }
        componentDidMount() {
            if (!this._menuElement) {
                this._menuElement = this._getMenu();
                if (this._menuElement !== null) {
                    this._openMenu();
                }
            }
        }
        _getMenu() {
            const menu = this._rootRef.childNodes[0];
            return menu;
        }
        _openMenu() {
            const openOption = this._getOpenOptions();
            this._menuElement['__openingContextMenu'] = true;
            try {
                this._menuElement.open(this.props.eventObj.event, openOption);
                this._addCloseListener();
            }
            catch (error) {
                throw error;
            }
            finally {
                this._menuElement['__openingContextMenu'] = false;
            }
        }
        _addCloseListener() {
            if (!this.props.onCloseCallback) {
                return;
            }
            this._menuElement.addEventListener('ojClose', this.props.onCloseCallback);
        }
        _getOpenOptions() {
            const eventType = this.props.eventObj.eventType || 'keyboard';
            const openOption = {
                launcher: this.props.launcherElement,
                position: Object.assign(Object.assign({}, VMenu._MENU_POSITION[eventType]), { of: eventType === 'keyboard' ? this.props.launcherElement : this.props.eventObj.event }),
                initialFocus: 'menu'
            };
            return openOption;
        }
        componentWillUnmount() {
            this._removeCloseListener();
        }
        _removeCloseListener() {
            if (this._menuElement && this.props.onCloseCallback) {
                this._menuElement.removeEventListener('ojClose', this.props.onCloseCallback);
            }
        }
    }
    VMenu._MENU_POSITION = {
        mouse: {
            my: 'start top',
            at: 'start bottom',
            collision: 'flipfit'
        },
        touch: {
            my: 'start>40 center',
            at: 'start bottom',
            collision: 'flipfit'
        },
        keyboard: {
            my: 'start top',
            at: 'start bottom',
            collision: 'flipfit'
        }
    };

    exports.VMenu = VMenu;

    Object.defineProperty(exports, '__esModule', { value: true });

});
