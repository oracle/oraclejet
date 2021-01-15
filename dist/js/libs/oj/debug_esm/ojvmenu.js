/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import 'ojs/ojmenu';
import { VComponent, h } from 'ojs/ojvcomponent';
import { PopupService } from 'ojs/ojpopupcore';

class Props {
    constructor() {
        this.launcherElement = null;
    }
}
class VMenu extends VComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (h("div", { style: { display: 'none' }, ref: (elem) => (this._rootRef = elem) }, this.props.children));
    }
    mounted() {
        if (!this._menuElement) {
            this._menuElement = this._getMenu();
            if (this._menuElement !== null) {
                this._openMenu();
            }
        }
    }
    _getMenu() {
        const menu = this._rootRef.firstChild;
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
    unmounted() {
        if (this._rootRef) {
            PopupService.getInstance().close({ [PopupService.OPTION.POPUP]: this._rootRef });
        }
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
VMenu.metadata = { "extension": { "_DEFAULTS": Props } };

export { VMenu };
