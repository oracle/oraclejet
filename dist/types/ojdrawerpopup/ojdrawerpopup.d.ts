/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Action, CancelableAction, ExtendGlobalProps, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { Component, ComponentChildren } from 'preact';
import 'ojs/ojpopup';
type EdgePopup = 'start' | 'end' | 'bottom';
type AutoDismiss = 'focus-loss' | 'none';
type CloseGesture = 'swipe' | 'none';
type Modality = 'modal' | 'modeless';
type ResolvedDisplayMode = 'overlay' | 'full-overlay';
type State = {
    opened?: boolean;
    viewportResolvedDisplayMode: ResolvedDisplayMode;
    viewportResolvedDisplayModeVertical: ResolvedDisplayMode;
};
type Props = ObservedGlobalProps<'role'> & {
    /**
     * @description
     * Specifies the default slot.
     *
     * @ojmetadata description "Specifies the default slot."
     */
    children?: ComponentChildren;
    /**
     * @description
     * Specifies the 'opened' state of the drawer.
     *
     * @ojmetadata description "Specifies the 'opened' state of the drawer."
     * @ojmetadata extension {
     *   "webelement": {
     *     "exceptionStatus": [
     *       {
     *         "type": "getterOnly"
     *       }
     *     ]
     *   }
     * }
     */
    opened?: boolean;
    /**
     * @description
     * Triggered when 'opened' property changes.
     *
     * @ojmetadata description "Triggered when 'opened' property changes."
     */
    onOpenedChanged?: PropertyChanged<boolean>;
    /**
     * @description
     * Triggered immediately before the drawer closes.
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the drawer from closing.
     * Call <code class="prettyprint">event.detail.accept(Promise.reject());</code> in the event listener to veto the event asynchronously, which prevents the drawer from closing.
     *
     * @ojmetadata description "Triggered immediately before the drawer closes."
     */
    onOjBeforeClose?: CancelableAction<{}>;
    /**
     * @description
     * Triggered immediately after the drawer closes.
     *
     * @ojmetadata description "Triggered immediately after the drawer closes."
     */
    onOjClose?: Action<{}>;
    /**
     * @description
     * Specifies at what edge the drawer opens.
     *
     * @ojmetadata description "Specifies at what edge the drawer opens."
     */
    edge?: EdgePopup;
    /**
     * @description
     * Controls the modality of the drawer.
     *
     * @ojmetadata description "Controls the modality of the drawer."
     */
    modality?: Modality;
    /**
     * @description
     * Controls the close auto-dismiss behaviour to close the drawer. Click or tap on the scrim closes the drawer.
     *
     * @ojmetadata description "Controls the close auto-dismiss behaviour to close the drawer."
     */
    autoDismiss?: AutoDismiss;
    /**
     * @description
     * Controls the close gesture to close the drawer.
     *
     * @ojmetadata description "Controls the close gesture to close the drawer."
     */
    closeGesture?: CloseGesture;
};
/**
 * @classdesc
 * <h3 id="drawerPopupOverview-section">
 *   JET Drawer Popup
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#drawerPopupOverview-section"></a>
 * </h3>
 * <p>Description: A drawer popup is an isolated element. A drawer is a panel that slides into the viewport.</p>
 * <pre class="prettyprint">
 * <code>
 *&lt;oj-drawer-popup>
 *    Start drawer content
 * &lt;/oj-drawer-popup>
 *
 *&lt;oj-drawer-popup edge="end" opened="true">
 *    End drawer content
 * &lt;/oj-drawer-popup>
 *
 *&lt;oj-drawer-popup edge="bottom">
 *    Bottom drawer content
 * &lt;/oj-drawer-popup>
 *
 * Main section content
 *</code></pre>
 *
 * <p id="drawer-layout-popup-section">JET DrawerPopup and DrawerLayout look similar, but are intended to be used
 * for different purposes.</p>
 * <p>Use DrawerPopup when you need to always show 'overlay' drawers.</p>
 * <p>Use DrawerLayout when you need to switch from 'reflow' display mode (big screens) to 'overlay' (small screens).</p>
 *
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 *  To migrate from oj-drawer-popup to oj-c-drawer-popup, you need to revise the import statement and references to oj-c-drawer-popup in your app.
 *  In addition, please note the changes between the two components below.
 *  <h5>role attribute</h5>
 *  <p>The <code class="prettyprint">role</code> attribute custom value is no longer supported and the drawer will always have the ‘dialog’ role.
 *  </p>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 * <table class="keyboard-table">
 *  <thead>
 *    <tr>
 *      <th>Target</th>
 *      <th>Key</th>
 *      <th>Action</th>
 *    </tr>
 *  </thead>
 *  <tbody>
 *    <tr>
 *      <td>Drawer element</td>
 *      <td><kbd>Esc</kbd></td>
 *      <td>Close the drawer</td>
 *    </tr>
 *  </tbody>
 * </table>
 *
 *  <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 *  </h3>
 *
 * <h4> role </h4>
 * <p>By default, the 'dialog' role will be set to Drawer Popup.
 * The dialog role is used to mark up an application window that separates content from the rest of the page.
 * This can be changed using custom role attribute.</p>
 *
 * <p>However, adding <code class="prettyprint">role="dialog"</code> alone is not sufficient to make a drawer accessible.
 * It must be properly labeled. It is developer’s responsibility to define respective aria properties to meet accessibility requirements.</p>
 *
 * <h4>aria-labelledby </h4>
 * If a drawer already has a visible title bar, the text inside that bar can be used to label the dialog itself.
 * Set the value of the <code class="prettyprint">aria-labelledby</code> attribute to be the id of the element used to title the drawer.
 * If there isn't appropriate text visible in the DOM that could be referenced with <code class="prettyprint">aria-labelledby</code>
 * use the <code class="prettyprint">aria-label</code> attribute to define the accessible name of an element.
 *
 * <h4> aria-describedby </h4>
 * If the drawer contains additional descriptive text besides the drawer title,
 * this text can be associated with the drawer using the <code class="prettyprint">aria-describedby</code> attribute.
 *
 * <h3 id="sizing">
 *   Sizing
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sizing"></a>
 * </h3>
 *
 * <p>Side drawers always stretch to viewport's height and the bottom one to its width.
 * The other axis dimension is not predefined. This dimension's size is determined by its content.
 * If you want to set a custom size you can use units like px, rem, etc.
 * However because there is no fixed-size parent percentages (%) won’t work,
 * but you can use vw (viewport width) or vh (viewport height) units to achieve a similar effect.</p>
 * <ul>
 *   <li>Note the built-in minimal and maximal width of side drawers.</li>
 *   <li>Note that DrawerPopup animates opening and closing. However, it is app developer's responsibility to add animations for custom runtime changes to a drawer size. See the 'Sizing' cookbook demo for an example.</li>
 * </ul>
 *
 * @ojmetadata description 'A Drawer Popup is a panel that slides into the viewport.'
 * @ojmetadata displayName "Drawer Popup"
 * @ojmetadata main "ojs/ojdrawerpopup"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "17.0.0",
 *     "value": ["oj-c-drawer-popup"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-drawer-popup",
 *     "uxSpecs": ["drawer-popup"]
 *   },
 *   "themes": {
 *     "unsupportedThemes": [
 *       "Alta"
 *     ]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojdrawerpopup"
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojDrawerPopup.html"
 * @ojmetadata since "11.0.0"
 */
/**
 * This export corresponds to the DrawerPopup Preact component. For the oj-drawer-popup custom element, import DrawerPopupElement instead.
 */
export declare class DrawerPopup extends Component<ExtendGlobalProps<Props>, State> {
    static readonly defaultProps: Partial<Props>;
    readonly state: State;
    private readonly rootRef;
    private openedPrevState;
    private hammerInstance;
    private windowResizeHandler;
    private drawerOpener;
    private elementWithFocusBeforeDrawerCloses;
    private ignoreUpdate;
    static getDerivedStateFromProps(props: Readonly<Props>, state: Readonly<State>): Partial<State> | null;
    private handleGuardFocus;
    private handleOnStartGuardFocus;
    private handleOnEndGuardFocus;
    render(props: Readonly<Props>): ComponentChildren;
    private isDrawerOpened;
    private wasDrawerOpenedInPrevState;
    private handleKeyDown;
    private selfClose;
    private openOrCloseDrawer;
    private getPopupServiceOptions;
    private beforeOpenHandler;
    private afterOpenHandler;
    private handleFocus;
    private beforeCloseHandler;
    private afterCloseHandler;
    private autoDismissHandler;
    private refreshHandler;
    private destroyHandler;
    private isTargetDescendantOfOwnZorderLayerOrItsNextSiblings;
    private getDrawerSurrogateLayerSelectors;
    private getPopupStyleClasses;
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private windowResizeCallback;
    private getViewportResolvedDisplayMode;
    private getViewportResolvedDisplayModeVertical;
    handleComponentUpdate(prevState: Readonly<State>): void;
    private registerCloseWithSwipeListener;
    private getSwipeCloseDirection;
    private handleSwipeAction;
    private unregisterCloseWithSwipeListener;
    private isIOSspecificScrollCase;
    private isAndroidSpecificScrollCase;
    private applyPopupServiceModalChanges;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-drawer-popup custom element. For the DrawerPopup Preact component, import DrawerPopup instead.
 */
export interface DrawerPopupElement extends JetElement<DrawerPopupElementSettableProperties>, DrawerPopupElementSettableProperties {
    addEventListener<T extends keyof DrawerPopupElementEventMap>(type: T, listener: (this: HTMLElement, ev: DrawerPopupElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof DrawerPopupElementSettableProperties>(property: T): DrawerPopupElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof DrawerPopupElementSettableProperties>(property: T, value: DrawerPopupElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, DrawerPopupElementSettableProperties>): void;
    setProperties(properties: DrawerPopupElementSettablePropertiesLenient): void;
}
export namespace DrawerPopupElement {
    interface ojBeforeClose extends CustomEvent<{
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojClose extends CustomEvent<{}> {
    }
    type autoDismissChanged = JetElementCustomEventStrict<DrawerPopupElement['autoDismiss']>;
    type closeGestureChanged = JetElementCustomEventStrict<DrawerPopupElement['closeGesture']>;
    type edgeChanged = JetElementCustomEventStrict<DrawerPopupElement['edge']>;
    type modalityChanged = JetElementCustomEventStrict<DrawerPopupElement['modality']>;
    type openedChanged = JetElementCustomEventStrict<DrawerPopupElement['opened']>;
}
export interface DrawerPopupElementEventMap extends HTMLElementEventMap {
    'ojBeforeClose': DrawerPopupElement.ojBeforeClose;
    'ojClose': DrawerPopupElement.ojClose;
    'autoDismissChanged': JetElementCustomEventStrict<DrawerPopupElement['autoDismiss']>;
    'closeGestureChanged': JetElementCustomEventStrict<DrawerPopupElement['closeGesture']>;
    'edgeChanged': JetElementCustomEventStrict<DrawerPopupElement['edge']>;
    'modalityChanged': JetElementCustomEventStrict<DrawerPopupElement['modality']>;
    'openedChanged': JetElementCustomEventStrict<DrawerPopupElement['opened']>;
}
export interface DrawerPopupElementSettableProperties extends JetSettableProperties {
    /**
     * Controls the close auto-dismiss behaviour to close the drawer. Click or tap on the scrim closes the drawer.
     */
    autoDismiss?: Props['autoDismiss'];
    /**
     * Controls the close gesture to close the drawer.
     */
    closeGesture?: Props['closeGesture'];
    /**
     * Specifies at what edge the drawer opens.
     */
    edge?: Props['edge'];
    /**
     * Controls the modality of the drawer.
     */
    modality?: Props['modality'];
    /**
     * Specifies the 'opened' state of the drawer.
     */
    opened?: Props['opened'];
}
export interface DrawerPopupElementSettablePropertiesLenient extends Partial<DrawerPopupElementSettableProperties> {
    [key: string]: any;
}
export interface DrawerPopupIntrinsicProps extends Partial<Readonly<DrawerPopupElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * Triggered immediately before the drawer closes.
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the drawer from closing.
     * Call <code class="prettyprint">event.detail.accept(Promise.reject());</code> in the event listener to veto the event asynchronously, which prevents the drawer from closing.
     */
    onojBeforeClose?: (value: DrawerPopupElementEventMap['ojBeforeClose']) => void;
    /**
     * Triggered immediately after the drawer closes.
     */
    onojClose?: (value: DrawerPopupElementEventMap['ojClose']) => void;
    onautoDismissChanged?: (value: DrawerPopupElementEventMap['autoDismissChanged']) => void;
    oncloseGestureChanged?: (value: DrawerPopupElementEventMap['closeGestureChanged']) => void;
    onedgeChanged?: (value: DrawerPopupElementEventMap['edgeChanged']) => void;
    onmodalityChanged?: (value: DrawerPopupElementEventMap['modalityChanged']) => void;
    onopenedChanged?: (value: DrawerPopupElementEventMap['openedChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-drawer-popup': DrawerPopupIntrinsicProps;
        }
    }
}
