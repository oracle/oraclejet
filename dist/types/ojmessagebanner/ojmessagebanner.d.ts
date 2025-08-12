import * as ojcommontypes from 'ojs/ojcommontypes';
import { DataProvider, ItemMetadata } from 'ojs/ojdataprovider';
import { Action, DynamicTemplateSlots, ExtendGlobalProps } from 'ojs/ojvcomponent';
import { Component, ComponentChild } from 'preact';
import 'ojs/ojbutton';
/**
 * Type definition for the severity of the message
 */
type MessageBannerSeverity = 'error' | 'warning' | 'confirmation' | 'info' | 'none';
/**
 * An object representing a single message in the Message Banner component.
 */
export type MessageBannerItem = {
    /**
     * @description "Defines whether or not to include the close icon for the message"
     */
    closeAffordance?: 'on' | 'off';
    /**
     * @description "Defines the detail text of the message"
     */
    detail?: string;
    /**
     * @description "Defines the severity of the message"
     */
    severity?: MessageBannerSeverity;
    /**
     * @description "Defines the sound to be played when opening the message"
     */
    sound?: 'default' | 'none' | string;
    /**
     * @description "Defines the primary text of the message"
     */
    summary?: string;
    /**
     * @description "Defines the timestamp for the message in ISO format"
     */
    timestamp?: string;
};
/**
 * Structure of template context used for dynamic templates
 */
export type MessageBannerTemplateContext<K, D> = {
    /**
     * @description "The data for the current message"
     */
    data: D;
    /**
     * @description "The zero-based index of the current message"
     */
    index: number;
    /**
     * @description "The key for the current message"
     */
    key: K;
    /**
     * @description "The metadata for the current message"
     */
    metadata?: ItemMetadata<K>;
};
/**
 * The event payload for the ojClose event.
 * Note: This has a similar structure to the ItemContext. We define it here
 * because using ItemContext will not generate the docs for this payload.
 */
type CloseActionDetail<K, D> = {
    /**
     * @ojmetadata description "The data that was used to render the message."
     */
    data: D;
    /**
     * @ojmetadata description "The key for the message."
     */
    key: K;
    /**
     * @ojmetadata description "The metadata of the message."
     */
    metadata?: ItemMetadata<K>;
};
/**
 * Props for the oj-message-banner Component
 */
type Props<Key, Data> = {
    /**
     * @description
     * <p>Data for the Message Banner component. This data is used for rendering each banner message.
     * This is a required attribute. If an application needs to initialize the component with
     * no initial messages, it would need to provide an empty DataProvider. When the application
     * wants to show messages, it can then add new data to the existing DataProvider.
     * See <a href="MutableArrayDataProvider.html">MutableArrayDataProvider</a> for more details.</p>
     *
     * <p>When specifying a DataProvider for the data attribute, you need to provide the keyAttributes
     * for the DataProvider. The oj-message-banner component expects a single attribute of type
     * string or number as the key of the DataProvider. When the data is updated this key attribute
     * will be used to determine whether a new message is being added or an existing message is being
     * updated. This is required for performing necessary animations. When the application replaces
     * the DataProvider, the component assumes that all the messages are newly added irrespective of their
     * keys and performs animation accordingly.</p>
     *
     * @ojmetadata description "Data for the Message Banner component."
     * @ojmetadata displayName "Data"
     * @ojmetadata help "#data"
     * @ojmetadata extension {
     *   "webelement": {
     *     "exceptionStatus": [
     *       {
     *         "type": "unsupported",
     *         "since": "15.1.0"
     *       }
     *     ]
     *   }
     * }
     */
    data: DataProvider<Key, Data>;
    /**
     * @description
     * A Banner message can have a different look and feel. For example, when using page-level
     * messaging the messages need to be rendered from edge to edge without any outline. On the other
     * hand, when they are being used in a section of a page or a dialog, they need to be rendered
     * with an outline. This attribute can be used to specify where the component is being used so that
     * it will render the messages accordingly.
     *
     * @ojmetadata description "The type of the Banner message."
     * @ojmetadata displayName "Type"
     * @ojmetadata help "#type"
     */
    type?: 'page' | 'section';
    /**
     * @description
     * Applications can use this property to provide the name of a template or a function that
     * returns the name of a template to use for rendering the detail content.
     *
     * When a template name is provided as a value for this property, the corresponding template
     * will be used for rendering the detail content for all the messages. If applications want
     * to use a different template for different messages, they can provide a function that
     * returns a template name instead.
     *
     * The provided function should accept an ItemContext and return a key to a template for
     * rendering the corresponding message's detail content. The value returned from this function
     * should be a key to one of the dynamic template slots provided. If the returned value is not
     * one of the keys of the provided dynamic template slots, the component will throw an Error.
     *
     * If the function returns null or undefined, the component then will perform default rendering
     * of the detail content using the detail property of the corresponding message.
     *
     * If an application specifies both detail and a valid detail-template-value, the detail-template-value
     * will take precedence and the corresponding template will be used for rendering the detail content.
     *
     * @ojmetadata description "The function that determines the detail template for the current row."
     * @ojmetadata displayName "Current Detail Template"
     * @ojmetadata help "#detailTemplateValue"
     * @ojmetadata dynamicSlotDef "MessageBannerTemplateContext"
     * @ojmetadata templateSlotAlias "detailTemplate"
     */
    detailTemplateValue?: string | ((itemContext: ojcommontypes.ItemContext<Key, Data>) => string | null);
    /**
     * @description
     * A set of templates for rendering the message content. Which template is used
     * for rendering which content will be decided by specific properties in the row data.
     *
     * @ojmetadata description "The dynamic template slots for the Banner message."
     * @ojmetadata displayName "Dynamic Template Slots"
     * @ojmetadata help "#dynamicTemplates"
     *
     */
    messageTemplates?: DynamicTemplateSlots<MessageBannerTemplateContext<Key, Data>>;
    /**
     * @description
     * Triggered when a user tries to close a message through UI interaction. The application
     * should listen to this event and remove the corresponding message item from the data
     * which would then result in the message being closed. If the application
     * fails to remove the message item from the data, then no change will be done in the
     * UI by the component and the message will stay in the UI opened.
     *
     * @ojmetadata description "Event emitted when the user tries to close a message though UI interaction"
     * @ojmetadata help "#event:ojClose"
     */
    onOjClose?: Action<CloseActionDetail<Key, Data>>;
};
/**
 * State for the component
 */
type State<K, D> = {
    /**
     * Stores the count of the DP instances change. This is used to generate a unique
     * key which unmounts and remounts the component on DataProvider change.
     */
    dataProviderCount: number;
    /**
     * Stores the data provider instance for comparing and updating the counter
     */
    previousDataProvider: DataProvider<K, D>;
};
/**
 * @classdesc
 * <h3 id="bannerOverview-section">
 *   JET Message Banner
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#bannerOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>Message banners are brief, moderately disruptive, semi-permanent messages that help communicate
 * relevant and useful information in the context of the current page or actions in progress,
 * without blocking the interaction on that page.</p>
 *
 * <h4 id="messages-syntax-section">
 *  Syntax
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#messages-syntax-section"></a>
 * </h4>
 * Message Banner can be created with the following markup.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-message-banner data="[[messages]]" type="page">
 * &lt;/oj-message-banner>
 * </code></pre>
 *
 * <p>The Message Banner component will show messages based on the data provided keeping it as a single
 * source of truth. Applications should register a listener for the ojClose event to be notified
 * when one performs an action that requires a message to be closed. The application then should use the
 * event payload to identify and remove the corresponding row from the data which would then close the
 * message.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-message-banner data="[[messages]]" type="page" on-oj-close="[[handleClose]]">
 * &lt;/oj-message-banner>
 * </code></pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The <code class="prettyprint">MessageBannerItem["sound"]</code> property is an accessibility
 * feature for playing a sound when a message is opened. This property defaults to "none", and can
 * be enabled by setting it to "default" or by providing a URL to an audio file of a format that the
 * browser supports. An accessible application must provide a way for users to enable sound on a
 * settings or preferences page. Some browsers will have auto-play disabled by default, enabling
 * it may require adjusting the browser settings.</p>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td rowspan = "3">Focus within Messages</td>
 *       <td><kbd>Tab</kbd> or <kbd>Shift + Tab</kbd></td>
 *       <td>Navigate the content of the messages region.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>F6</kbd></td>
 *       <td>Cycles the focus through all the messages sections on the page starting from the most recent one.
 *           Then finally, moves the focus back to the last focused element outside the messages region.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Moves focus back to the last focused element outside the messages region and closes the current message if it is closable.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
 *       <td>Activates the currently focused element in the message.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan = "1">Focus outside Messages</td>
 *       <td><kbd>F6</kbd></td>
 *       <td>Move focus to the first message within the more recently disclosed messages region.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 *
 * <p>
 * To migrate from oj-message-banner to oj-c-message-banner, you need to revise the import statement
 * and references to oj-c-message-banner in your app. Please note the changes between the two
 * components below.
 * </p>
 *
 * <h5>detail-template-value</h5>
 * <p>
 * When using a function for the detail-template-value attribute, you now need to return <code>undefined</code> to
 * have the component render the default detail content. Returning <code>null</code> is not supported in the
 * oj-c-message-banner component.
 * </p>
 *
 * <h5>MessageBannerTemplateContext</h5>
 * <p>
 * The template context provided for the template slots will not have the <code>index</code> property in the
 * oj-c-message-banner component. If needed, applications can still use the <code>key</code> property to
 * identify the message being rendered.
 * </p>
 *
 * <h5>Sorting</h5>
 * <p>
 * The oj-c-message-banner sorts the messages by default based on the decreasing order of severity. The messages of the
 * same severity are then sorted in reverse chronological order. Set the sorting attribute to "off" to show the
 * messages in the order that they appear in the data.
 *
 * @typeparam {object} K Type of key of the dataprovider. It can either be a string or a number.
 * @typeparam {object} D Type of the data from the dataprovider. It must extend the MessageBannerItem type.
 * @ojmetadata description "Message Banners are brief, moderately disruptive, semi-permanent messages that help communicate relevant and useful information."
 * @ojmetadata displayName "Message Banner"
 * @ojmetadata main "ojs/ojmessagebanner"
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-message-banner",
 *     "uxSpecs": ["bannerMessages"]
 *   },
 *   "themes": {
 *     "unsupportedThemes": ["Alta"]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojmessagebanner",
 *     "defaultColumns": "6",
 *     "minColumns": "2"
 *   }
 * }
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "type"
 *     ]
 *   },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "data"
 *     ]
 *   }
 * ]
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojMessageBanner.html"
 * @ojmetadata since "12.0.0"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "16.0.0",
 *     "value": ["oj-c-message-banner"]
 *   }
 * ]
 */
/**
 * This export corresponds to the MessageBanner Preact component. For the oj-message-banner custom element, import MessageBannerElement instead.
 */
export declare class MessageBanner<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> extends Component<ExtendGlobalProps<Props<K, D>>, State<K, D>> {
    /**
     * Default values for Props
     */
    static defaultProps: Partial<Props<unknown, unknown>>;
    /**
     * Derives state from the current props
     *
     * @param props The current Props that will be used to get the new state
     * @param state The current state
     *
     * @returns The new state
     */
    static getDerivedStateFromProps(props: Readonly<Props<unknown, unknown>>, state: Readonly<State<unknown, unknown>>): {
        dataProviderCount: number;
        previousDataProvider: DataProvider<unknown, unknown>;
    };
    /**
     * Private member for storing a reference to the root element
     */
    private readonly _rootRef?;
    /**
     * Private member for storing the HOC returned component that converts
     * a DataProvider into an Array and passes on to the WrappedComponent.
     */
    private readonly WrapperMessagesContainer;
    /**
     * Set the busy state on the component element and returns a resolver function
     * for the same.
     *
     * @param description The description for the current action
     *
     * @returns The resolver for the set busyState
     */
    private readonly _addBusyState;
    /**
     * Emits onOjClose event for the provided message.
     *
     * @param context The message which the user tried to close
     */
    private readonly _handleCloseMessage;
    /**
     * Instantiates Banner Component
     *
     * @param props The component properties
     */
    constructor(props: ExtendGlobalProps<Props<K, D>>);
    /**
     * Renders the Message Banner component
     * @returns The rendered oj-message-banner component
     */
    render(props?: ExtendGlobalProps<Props<K, D>>): ComponentChild;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-message-banner custom element. For the MessageBanner Preact component, import MessageBanner instead.
 */
export interface MessageBannerElement<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> extends JetElement<MessageBannerElementSettableProperties<K, D>>, MessageBannerElementSettableProperties<K, D> {
    addEventListener<T extends keyof MessageBannerElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: MessageBannerElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof MessageBannerElementSettableProperties<K, D>>(property: T): MessageBannerElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof MessageBannerElementSettableProperties<K, D>>(property: T, value: MessageBannerElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, MessageBannerElementSettableProperties<K, D>>): void;
    setProperties(properties: MessageBannerElementSettablePropertiesLenient<K, D>): void;
}
export namespace MessageBannerElement {
    interface ojClose<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> extends CustomEvent<CloseActionDetail<K, D> & {}> {
    }
    type dataChanged<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> = JetElementCustomEventStrict<MessageBannerElement<K, D>['data']>;
    type detailTemplateValueChanged<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> = JetElementCustomEventStrict<MessageBannerElement<K, D>['detailTemplateValue']>;
    type typeChanged<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> = JetElementCustomEventStrict<MessageBannerElement<K, D>['type']>;
    type DetailTemplateContext<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> = MessageBannerTemplateContext<K, D>;
    type RenderDetailTemplate<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> = import('ojs/ojvcomponent').TemplateSlot<MessageBannerTemplateContext<K, D>>;
}
export interface MessageBannerElementEventMap<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> extends HTMLElementEventMap {
    'ojClose': MessageBannerElement.ojClose<K, D>;
    'dataChanged': JetElementCustomEventStrict<MessageBannerElement<K, D>['data']>;
    'detailTemplateValueChanged': JetElementCustomEventStrict<MessageBannerElement<K, D>['detailTemplateValue']>;
    'typeChanged': JetElementCustomEventStrict<MessageBannerElement<K, D>['type']>;
}
export interface MessageBannerElementSettableProperties<Key, Data> extends JetSettableProperties {
    /**
     * <p>Data for the Message Banner component. This data is used for rendering each banner message.
     * This is a required attribute. If an application needs to initialize the component with
     * no initial messages, it would need to provide an empty DataProvider. When the application
     * wants to show messages, it can then add new data to the existing DataProvider.
     * See <a href="MutableArrayDataProvider.html">MutableArrayDataProvider</a> for more details.</p>
     *
     * <p>When specifying a DataProvider for the data attribute, you need to provide the keyAttributes
     * for the DataProvider. The oj-message-banner component expects a single attribute of type
     * string or number as the key of the DataProvider. When the data is updated this key attribute
     * will be used to determine whether a new message is being added or an existing message is being
     * updated. This is required for performing necessary animations. When the application replaces
     * the DataProvider, the component assumes that all the messages are newly added irrespective of their
     * keys and performs animation accordingly.</p>
     */
    data: Props<Key, Data>['data'];
    /**
     * Applications can use this property to provide the name of a template or a function that
     * returns the name of a template to use for rendering the detail content.
     *
     * When a template name is provided as a value for this property, the corresponding template
     * will be used for rendering the detail content for all the messages. If applications want
     * to use a different template for different messages, they can provide a function that
     * returns a template name instead.
     *
     * The provided function should accept an ItemContext and return a key to a template for
     * rendering the corresponding message's detail content. The value returned from this function
     * should be a key to one of the dynamic template slots provided. If the returned value is not
     * one of the keys of the provided dynamic template slots, the component will throw an Error.
     *
     * If the function returns null or undefined, the component then will perform default rendering
     * of the detail content using the detail property of the corresponding message.
     *
     * If an application specifies both detail and a valid detail-template-value, the detail-template-value
     * will take precedence and the corresponding template will be used for rendering the detail content.
     */
    detailTemplateValue?: Props<Key, Data>['detailTemplateValue'];
    /**
     * A Banner message can have a different look and feel. For example, when using page-level
     * messaging the messages need to be rendered from edge to edge without any outline. On the other
     * hand, when they are being used in a section of a page or a dialog, they need to be rendered
     * with an outline. This attribute can be used to specify where the component is being used so that
     * it will render the messages accordingly.
     */
    type?: Props<Key, Data>['type'];
}
export interface MessageBannerElementSettablePropertiesLenient<Key, Data> extends Partial<MessageBannerElementSettableProperties<Key, Data>> {
    [key: string]: any;
}
export interface MessageBannerIntrinsicProps extends Partial<Readonly<MessageBannerElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * Triggered when a user tries to close a message through UI interaction. The application
     * should listen to this event and remove the corresponding message item from the data
     * which would then result in the message being closed. If the application
     * fails to remove the message item from the data, then no change will be done in the
     * UI by the component and the message will stay in the UI opened.
     */
    onojClose?: (value: MessageBannerElementEventMap<any, any>['ojClose']) => void;
    ondataChanged?: (value: MessageBannerElementEventMap<any, any>['dataChanged']) => void;
    ondetailTemplateValueChanged?: (value: MessageBannerElementEventMap<any, any>['detailTemplateValueChanged']) => void;
    ontypeChanged?: (value: MessageBannerElementEventMap<any, any>['typeChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-message-banner': MessageBannerIntrinsicProps;
        }
    }
}
