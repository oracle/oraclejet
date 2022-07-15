/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsxs, jsx } from 'preact/jsx-runtime';
import { MessageBanner as MessageBanner$1 } from '@oracle/oraclejet-preact/UNSAFE_MessageBanner';
import { MessagesContext } from '@oracle/oraclejet-preact/UNSAFE_Message';
import { startAnimation } from 'ojs/ojanimation';
import { getTranslatedString } from 'ojs/ojtranslation';
import Context from 'ojs/ojcontext';
import { withDataProvider } from 'ojs/ojdataproviderhandler';
import { Root, customElement } from 'ojs/ojvcomponent';
import { Component, createRef } from 'preact';
import 'ojs/ojbutton';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (null && null.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let MessageBanner = class MessageBanner extends Component {
    constructor(props) {
        super(props);
        this._addBusyState = (description) => {
            const busyContext = Context.getContext(this._rootRef.current).getBusyContext();
            return busyContext.addBusyState({ description });
        };
        this._handleCloseMessage = (context) => {
            var _a, _b;
            (_b = (_a = this.props).onOjClose) === null || _b === void 0 ? void 0 : _b.call(_a, context);
        };
        this._handleAnimation = (element, action, options) => __awaiter(this, void 0, void 0, function* () {
            yield startAnimation(element, action, options);
        });
        this._renderCloseButton = (title, onAction) => {
            return (jsxs("oj-button", Object.assign({ class: "oj-button-sm", display: "icons", chroming: "borderless", title: title, onojAction: onAction }, { children: [jsx("span", { slot: "startIcon", class: "oj-fwk-icon oj-fwk-icon-cross" }), jsx("span", { children: title })] })));
        };
        this._rootRef = createRef();
        this.state = { dataProviderCount: 0, previousDataProvider: props.data };
        this.WrapperMessagesContainer = withDataProvider(MessageBanner$1, 'data');
    }
    static getDerivedStateFromProps(props, state) {
        const { data } = props;
        const { dataProviderCount, previousDataProvider } = state;
        if (data !== previousDataProvider) {
            return {
                dataProviderCount: dataProviderCount + 1,
                previousDataProvider: data
            };
        }
        return null;
    }
    render(props, state) {
        const { data, detailTemplateValue, messageTemplates, type } = props;
        const { dataProviderCount } = this.state;
        const messagesContext = { addBusyState: this._addBusyState };
        return (jsx(Root, Object.assign({ ref: this._rootRef }, { children: jsx(MessagesContext.Provider, Object.assign({ value: messagesContext }, { children: jsx(this.WrapperMessagesContainer, { addBusyState: this._addBusyState, data: data, type: type, closeButtonRenderer: this._renderCloseButton, detailRendererKey: detailTemplateValue, renderers: messageTemplates, startAnimation: this._handleAnimation, onClose: this._handleCloseMessage, translations: {
                        close: getTranslatedString('oj-ojMessageBanner.close'),
                        navigationFromMessagesRegion: getTranslatedString('oj-ojMessageBanner.navigationFromMessagesRegion'),
                        navigationToMessagesRegion: getTranslatedString('oj-ojMessageBanner.navigationToMessagesRegion'),
                        error: getTranslatedString('oj-ojMessageBanner.error'),
                        warning: getTranslatedString('oj-ojMessageBanner.warning'),
                        info: getTranslatedString('oj-ojMessageBanner.info'),
                        confirmation: getTranslatedString('oj-ojMessageBanner.confirmation')
                    } }, `dataProvider${dataProviderCount}`) })) })));
    }
};
MessageBanner.defaultProps = {
    type: 'section'
};
MessageBanner.metadata = { "properties": { "data": { "type": "object" }, "type": { "type": "string", "enumValues": ["page", "section"] }, "detailTemplateValue": { "type": "string|function" } }, "extension": { "_DYNAMIC_SLOT": { "prop": "messageTemplates", "isTemplate": 1 } }, "events": { "ojClose": {} } };
MessageBanner = __decorate([
    customElement('oj-message-banner')
], MessageBanner);

export { MessageBanner };
