import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
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
    children?: ComponentChildren;
    start?: Slot;
    end?: Slot;
    bottom?: Slot;
    startOpened?: boolean;
    onStartOpenedChanged?: PropertyChanged<boolean>;
    onOjBeforeClose?: CancelableAction<ToggleDetail>;
    onOjClose?: Action<ToggleDetail>;
    endOpened?: boolean;
    onEndOpenedChanged?: PropertyChanged<boolean>;
    bottomOpened?: boolean;
    onBottomOpenedChanged?: PropertyChanged<boolean>;
    startDisplay?: DisplayMode;
    endDisplay?: DisplayMode;
    bottomDisplay?: DisplayMode;
};
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
    bottomDisplay?: Props['bottomDisplay'];
    bottomOpened?: Props['bottomOpened'];
    endDisplay?: Props['endDisplay'];
    endOpened?: Props['endOpened'];
    startDisplay?: Props['startDisplay'];
    startOpened?: Props['startOpened'];
}
export interface DrawerLayoutElementSettablePropertiesLenient extends Partial<DrawerLayoutElementSettableProperties> {
    [key: string]: any;
}
export interface DrawerLayoutIntrinsicProps extends Partial<Readonly<DrawerLayoutElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojBeforeClose?: (value: DrawerLayoutElementEventMap['ojBeforeClose']) => void;
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
