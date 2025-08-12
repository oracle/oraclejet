/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Action, CancelableAction, ExtendGlobalProps, PropertyChanged, Slot } from 'ojs/ojvcomponent';
import { Component, ComponentChild, ComponentChildren } from 'preact';
import 'ojs/ojcore-base';
import 'ojs/ojpopup';
type DisplayMode = 'reflow' | 'overlay' | 'auto';
type ResolvedDisplayMode = 'reflow' | 'overlay' | 'full-overlay';
type EdgeLayout = 'start' | 'end' | 'bottom';
type State = {
    startOpened: boolean;
    endOpened: boolean;
    bottomOpened: boolean;
    startDisplay: DisplayMode;
    endDisplay: DisplayMode;
    bottomDisplay: DisplayMode;
    startShouldChangeDisplayMode: boolean;
    endShouldChangeDisplayMode: boolean;
    bottomShouldChangeDisplayMode: boolean;
    viewportResolvedDisplayMode: ResolvedDisplayMode;
    viewportResolvedDisplayModeVertical: ResolvedDisplayMode;
    lastlyOpenedDrawer: EdgeLayout;
    startStateToChangeTo: GenericObject;
    endStateToChangeTo: GenericObject;
    bottomStateToChangeTo: GenericObject;
};
type GenericObject = {
    [key: string]: any;
};
type ToggleDetail = {
    edge: EdgeLayout;
};
type Props = {
    /**
     * @description
     * Specifies the default slot.
     *
     * @ojmetadata description "Specifies the default slot."
     */
    children?: ComponentChildren;
    /**
     * @description
     * Container for Start drawer content.
     *
     * @ojmetadata description "Container for Start drawer content."
     */
    start?: Slot;
    /**
     * @description
     * Container for End drawer content.
     *
     * @ojmetadata description "Container for End drawer content."
     */
    end?: Slot;
    /**
     * @description
     * Container for Bottom drawer content.
     *
     * @ojmetadata description "Container for Bottom drawer content."
     */
    bottom?: Slot;
    /**
     * @description
     * Specifies the 'opened' state of the Start drawer.
     *
     * @ojmetadata description "Specifies the 'opened' state of the Start drawer."
     */
    startOpened?: boolean;
    /**
     * @description
     * Listener of the 'startOpened' writeback property change.
     *
     * @ojmetadata description "Listener of the 'startOpened' writeback property change."
     */
    onStartOpenedChanged?: PropertyChanged<boolean>;
    /**
     * @description
     * Triggered immediately before the drawer closes. Available only in overlay mode.<br/>
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the drawer from closing.<br/>
     * Call <code class="prettyprint">event.detail.accept(Promise.reject())</code> in the event listener to veto the event asynchronously, which prevents the drawer from closing.
     *
     * @ojmetadata description "Triggered immediately before the drawer closes."
     */
    onOjBeforeClose?: CancelableAction<ToggleDetail>;
    /**
     * @description
     * Triggered immediately after the drawer closes.
     *
     * @ojmetadata description "Triggered immediately after the drawer closes."
     */
    onOjClose?: Action<ToggleDetail>;
    /**
     * @description
     * Specifies the 'endOpened' state of the End drawer.
     *
     * @ojmetadata description "Specifies the 'opened' state of the End drawer."
     */
    endOpened?: boolean;
    /**
     * @description
     * Listener of the 'endOpened' writeback property change.
     *
     * @ojmetadata description "Listener of the 'endOpened' writeback property change."
     */
    onEndOpenedChanged?: PropertyChanged<boolean>;
    /**
     * @description
     * Specifies the 'bottomOpened' state of the Bottom drawer.
     *
     * @ojmetadata description "Specifies the 'opened' state of the Bottom drawer."
     */
    bottomOpened?: boolean;
    /**
     * @description
     * Listener of the 'bottomOpened' writeback property change.
     *
     * @ojmetadata description "Listener of the 'bottomOpened' writeback property change."
     */
    onBottomOpenedChanged?: PropertyChanged<boolean>;
    /**
     * @description
     * Specifies the display mode of the Start drawer.
     *
     * @ojmetadata description "Specifies the display mode of the Start drawer."
     */
    startDisplay?: DisplayMode;
    /**
     * @description
     * Specifies the display mode of the End drawer.
     *
     * @ojmetadata description "Specifies the display mode of the End drawer."
     */
    endDisplay?: DisplayMode;
    /**
     * @description
     * Specifies the display mode of the Bottom drawer.
     *
     * @ojmetadata description "Specifies the display mode of the Bottom drawer."
     */
    bottomDisplay?: DisplayMode;
};
/**
 * @classdesc
 * <h3 id="drawerLayoutOverview-section">
 *   JET Drawer Layout
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#drawerLayoutOverview-section"></a>
 * </h3>
 * <p>Description: A drawer layout can be used for managing content with one or more drawers. A drawer is a panel that can
 * slide from the layout edges into it. Depending on the drawer layout size and configuration, the main content can be re-arranged
 * (reflow mode) or overlaid when the drawer is opened.</p>
 * <pre class="prettyprint">
 * <code>
 *&lt;oj-drawer-layout end-opened="true">
 *
 *    &lt;div slot="start">Start drawer content &lt;/div>
 *    &lt;div slot="end">End drawer content &lt;/div>
 *
 *    Main section content
 *
 * &lt;/oj-drawer-layout>
 *</code></pre>
 *
 * <p id="drawer-layout-popup-section">JET DrawerLayout and DrawerPopup look similar, but are intended to be used
 * for different purposes.</p>
 * <p>Use DrawerLayout when you need to switch from 'reflow' display mode (big screens) to 'overlay' (small screens).</p>
 * <p>Use DrawerPopup when you need to always show 'overlay' drawers.</p>
 *
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 *  To migrate from oj-drawer-layout to oj-c-drawer-layout, you need to revise the import statement and references to oj-c-drawer-layout in your app.
 *
 * <h3 id="sizing">
 *   Drawer sizing
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sizing"></a>
 * </h3>
 * Side drawers stretch to Drawer Layout container's height and the bottom one to its width. The
 * other axis dimension is not predefined. This dimension's size is determined by its content.
 * If you want to set a custom size, you need to specify it using absolute units (px, rem, etc.).
 * Relative unit size (%) will not work, because there is no fixed-size parent.
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
 * <h3 id="a11y-section">
 *  Accessibility
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * It is developer’s responsibility to define respective aria properties to meet accessibility requirements.
 * Use <code class="prettyprint">aria-labelledby</code>, <code class="prettyprint">aria-describedby</code> or <code class="prettyprint">aria-label</code> attributes
 * on drawer elements (slots of the Drawer Layout) to make them accessible.
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
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <h3 id="sizing">
 *   Sizing
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sizing"></a>
 * </h3>
 *
 * <p>Side drawers stretch to Drawer Layout container's height and the bottom one to its width.
 * The other axis dimension is not predefined. This dimension's size is determined by its content.
 * If you want to set a custom size you can use units like px, rem, etc.
 * However because there is no fixed-size parent percentages (%) won’t work,
 * but you can use vw (viewport width) or vh (viewport height) units to achieve a similar effect.</p>
 * <ul>
 *   <li>Note the side drawer's built-in minimal width limit in the 'Overlay' mode.</li>
 *   <li>Note that DrawerLayout animates opening and closing. However, it is app developer's responsibility to add animations for custom runtime changes to a drawer size. See the 'Sizing' cookbook demo for an example.</li>
 * </ul>
 *
 * <p> Setting the reading direction (LTR or RTL) is supported by setting the <code class="prettyprint">"dir"</code> attribute on the
 * <code class="prettyprint">&lt;html></code> element of the page. As with any JET component, in the unusual case that the reading direction
 * is changed post-init, the page must be reloaded.
 *
 * @ojmetadata description "A Drawer Layout adds expandable side contents (drawers) alongside some primary content."
 * @ojmetadata displayName "Drawer Layout"
 * @ojmetadata main "ojs/ojdrawerlayout"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "17.0.0",
 *     "value": ["oj-c-drawer-layout"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-drawer",
 *     "uxSpecs": ["drawer-layout"]
 *   },
 *   "themes": {
 *     "unsupportedThemes": [
 *       "Alta"
 *     ]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojdrawerlayout"
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojDrawerLayout.html"
 * @ojmetadata since "11.0.0"
 */
/**
 * This export corresponds to the DrawerLayout Preact component. For the oj-drawer-layout custom element, import DrawerLayoutElement instead.
 */
export declare class DrawerLayout extends Component<ExtendGlobalProps<Props>, State> {
    private readonly rootRef;
    private readonly startWrapperRef;
    private readonly startRef;
    private readonly endWrapperRef;
    private readonly endRef;
    private readonly bottomWrapperRef;
    private readonly bottomRef;
    private readonly middleSectionRef;
    private readonly mainSectionRef;
    private startOpenedPrevState;
    private endOpenedPrevState;
    private bottomOpenedPrevState;
    private startClosedWithEsc;
    private endClosedWithEsc;
    private bottomClosedWithEsc;
    private startOverlayDrawerResizeHandler;
    private endOverlayDrawerResizeHandler;
    private bottomOverlayDrawerResizeHandler;
    private startReflowDrawerResizeHandler;
    private endReflowDrawerResizeHandler;
    private drawerLayoutResizeHandler;
    private windowResizeHandler;
    private drawerOpener;
    private elementWithFocusBeforeDrawerCloses;
    private handleResize;
    static readonly defaultProps: Partial<Props>;
    readonly state: State;
    static getDerivedStateFromProps(props: Readonly<Props>, state: Readonly<State>): Partial<State> | null;
    render(props: Readonly<Props>): ComponentChild;
    private getDrawer;
    private isDrawerOpened;
    private wasDrawerOpenedInPrevState;
    private wasDrawerClosedWithEsc;
    private getDrawerWrapperRef;
    private getDrawerRef;
    private getDrawerContent;
    private getDrawerWrapperStyleClasses;
    private getDrawerStyleClasses;
    private getDrawerResolvedDisplayMode;
    private getViewportResolvedDisplayMode;
    private getViewportResolvedDisplayModeVertical;
    private handleKeyDown;
    private selfClose;
    private setDrawerFocus;
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private removeDrawerLayoutResizeListener;
    private handleComponentUpdate;
    private openOrCloseDrawer;
    private openOrCloseReflowDrawer;
    private removeHiddenStyle;
    private addHiddenStyle;
    private returnFocus;
    private getRefToAnimate;
    private animateOpen;
    private animateClose;
    private edgeToStateOpenedName;
    private edgeToPrevStateOpenedName;
    private edgeToShouldChangeDisplayMode;
    private edgeToClosedWithEsc;
    private edgeToDisplayName;
    private edgeToStateToChangeTo;
    private openOrClosePopupDrawer;
    private shouldDrawerChangeDisplayMode;
    private getStateToChangeTo;
    private getPopupServiceOptions;
    private beforeOpenHandler;
    private setBottomOverlayDrawerWidth;
    private afterOpenHandler;
    private overlayDrawerResizeCallback;
    private reflowDrawerResizeCallback;
    private drawerLayoutResizeCallback;
    private handleFocus;
    private beforeCloseHandler;
    private afterCloseHandler;
    private lockResizeListener;
    private refreshHandler;
    private destroyHandler;
    private windowResizeCallback;
    private getDrawerPosition;
    private setStartEndOverlayDrawersHeight;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-drawer-layout custom element. For the DrawerLayout Preact component, import DrawerLayout instead.
 */
export interface DrawerLayoutElement extends JetElement<DrawerLayoutElementSettableProperties>, DrawerLayoutElementSettableProperties {
    addEventListener<T extends keyof DrawerLayoutElementEventMap>(type: T, listener: (this: HTMLElement, ev: DrawerLayoutElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof DrawerLayoutElementSettableProperties>(property: T): DrawerLayoutElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof DrawerLayoutElementSettableProperties>(property: T, value: DrawerLayoutElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, DrawerLayoutElementSettableProperties>): void;
    setProperties(properties: DrawerLayoutElementSettablePropertiesLenient): void;
}
export namespace DrawerLayoutElement {
    interface ojBeforeClose extends CustomEvent<ToggleDetail & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojClose extends CustomEvent<ToggleDetail & {}> {
    }
    type bottomDisplayChanged = JetElementCustomEventStrict<DrawerLayoutElement['bottomDisplay']>;
    type bottomOpenedChanged = JetElementCustomEventStrict<DrawerLayoutElement['bottomOpened']>;
    type endDisplayChanged = JetElementCustomEventStrict<DrawerLayoutElement['endDisplay']>;
    type endOpenedChanged = JetElementCustomEventStrict<DrawerLayoutElement['endOpened']>;
    type startDisplayChanged = JetElementCustomEventStrict<DrawerLayoutElement['startDisplay']>;
    type startOpenedChanged = JetElementCustomEventStrict<DrawerLayoutElement['startOpened']>;
}
export interface DrawerLayoutElementEventMap extends HTMLElementEventMap {
    'ojBeforeClose': DrawerLayoutElement.ojBeforeClose;
    'ojClose': DrawerLayoutElement.ojClose;
    'bottomDisplayChanged': JetElementCustomEventStrict<DrawerLayoutElement['bottomDisplay']>;
    'bottomOpenedChanged': JetElementCustomEventStrict<DrawerLayoutElement['bottomOpened']>;
    'endDisplayChanged': JetElementCustomEventStrict<DrawerLayoutElement['endDisplay']>;
    'endOpenedChanged': JetElementCustomEventStrict<DrawerLayoutElement['endOpened']>;
    'startDisplayChanged': JetElementCustomEventStrict<DrawerLayoutElement['startDisplay']>;
    'startOpenedChanged': JetElementCustomEventStrict<DrawerLayoutElement['startOpened']>;
}
export interface DrawerLayoutElementSettableProperties extends JetSettableProperties {
    /**
     * Specifies the display mode of the Bottom drawer.
     */
    bottomDisplay?: Props['bottomDisplay'];
    /**
     * Specifies the 'bottomOpened' state of the Bottom drawer.
     */
    bottomOpened?: Props['bottomOpened'];
    /**
     * Specifies the display mode of the End drawer.
     */
    endDisplay?: Props['endDisplay'];
    /**
     * Specifies the 'endOpened' state of the End drawer.
     */
    endOpened?: Props['endOpened'];
    /**
     * Specifies the display mode of the Start drawer.
     */
    startDisplay?: Props['startDisplay'];
    /**
     * Specifies the 'opened' state of the Start drawer.
     */
    startOpened?: Props['startOpened'];
}
export interface DrawerLayoutElementSettablePropertiesLenient extends Partial<DrawerLayoutElementSettableProperties> {
    [key: string]: any;
}
export interface DrawerLayoutIntrinsicProps extends Partial<Readonly<DrawerLayoutElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * Triggered immediately before the drawer closes. Available only in overlay mode.<br/>
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the drawer from closing.<br/>
     * Call <code class="prettyprint">event.detail.accept(Promise.reject())</code> in the event listener to veto the event asynchronously, which prevents the drawer from closing.
     */
    onojBeforeClose?: (value: DrawerLayoutElementEventMap['ojBeforeClose']) => void;
    /**
     * Triggered immediately after the drawer closes.
     */
    onojClose?: (value: DrawerLayoutElementEventMap['ojClose']) => void;
    onbottomDisplayChanged?: (value: DrawerLayoutElementEventMap['bottomDisplayChanged']) => void;
    onbottomOpenedChanged?: (value: DrawerLayoutElementEventMap['bottomOpenedChanged']) => void;
    onendDisplayChanged?: (value: DrawerLayoutElementEventMap['endDisplayChanged']) => void;
    onendOpenedChanged?: (value: DrawerLayoutElementEventMap['endOpenedChanged']) => void;
    onstartDisplayChanged?: (value: DrawerLayoutElementEventMap['startDisplayChanged']) => void;
    onstartOpenedChanged?: (value: DrawerLayoutElementEventMap['startOpenedChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-drawer-layout': DrawerLayoutIntrinsicProps;
        }
    }
}
