import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { CancelableAction, ExtendGlobalProps, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { Component, ComponentChildren } from 'preact';
import 'ojs/ojcore-base';
import 'ojs/ojpopup';
declare type EdgePopup = 'start' | 'end' | 'bottom';
declare type AutoDismiss = 'focus-loss' | 'none';
declare type CloseGesture = 'swipe' | 'none';
declare type Modality = 'modal' | 'modeless';
declare type ResolvedDisplayMode = 'overlay' | 'full-overlay';
declare type State = {
    opened?: boolean;
    viewportResolvedDisplayMode: ResolvedDisplayMode;
    viewportResolvedDisplayModeVertical: ResolvedDisplayMode;
};
declare type Props = ObservedGlobalProps<'role'> & {
    children?: ComponentChildren;
    opened?: boolean;
    onOpenedChanged?: PropertyChanged<boolean>;
    onOjBeforeClose?: CancelableAction<{}>;
    edge?: EdgePopup;
    modality?: Modality;
    autoDismiss?: AutoDismiss;
    closeGesture?: CloseGesture;
};
export declare class DrawerPopup extends Component<ExtendGlobalProps<Props>, State> {
    static readonly defaultProps: Partial<Props>;
    readonly state: State;
    private readonly rootRef;
    private openedPrevState;
    private isShiftKeyActive;
    private hammerInstance;
    private drawerResizeHandler;
    private windowResizeHandler;
    private drawerOpener;
    private elementWithFocusBeforeDrawerCloses;
    static getDerivedStateFromProps(props: Readonly<Props>, state: Readonly<State>): Partial<State> | null;
    render(props: Readonly<Props>): ComponentChildren;
    private isDrawerOpened;
    private wasDrawerOpenedInPrevState;
    private handleKeyDown;
    private selfClose;
    private openOrCloseDrawer;
    private getPopupServiceOptions;
    private beforeOpenHandler;
    private afterOpenHandler;
    private drawerResizeCallback;
    private handleFocus;
    private beforeCloseHandler;
    private afterCloseHandler;
    private autoDismissHandler;
    private refreshHandler;
    private destroyHandler;
    private isTargetDescendantOfOwnZorderLayerOrItsNextSiblings;
    private getDrawerSurrogateLayerSelectors;
    private getDrawerPosition;
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
}
export {};
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
    type autoDismissChanged = JetElementCustomEventStrict<DrawerPopupElement['autoDismiss']>;
    type closeGestureChanged = JetElementCustomEventStrict<DrawerPopupElement['closeGesture']>;
    type edgeChanged = JetElementCustomEventStrict<DrawerPopupElement['edge']>;
    type modalityChanged = JetElementCustomEventStrict<DrawerPopupElement['modality']>;
    type openedChanged = JetElementCustomEventStrict<DrawerPopupElement['opened']>;
}
export interface DrawerPopupElementEventMap extends HTMLElementEventMap {
    'ojBeforeClose': DrawerPopupElement.ojBeforeClose;
    'autoDismissChanged': JetElementCustomEventStrict<DrawerPopupElement['autoDismiss']>;
    'closeGestureChanged': JetElementCustomEventStrict<DrawerPopupElement['closeGesture']>;
    'edgeChanged': JetElementCustomEventStrict<DrawerPopupElement['edge']>;
    'modalityChanged': JetElementCustomEventStrict<DrawerPopupElement['modality']>;
    'openedChanged': JetElementCustomEventStrict<DrawerPopupElement['opened']>;
}
export interface DrawerPopupElementSettableProperties extends JetSettableProperties {
    autoDismiss?: Props['autoDismiss'];
    closeGesture?: Props['closeGesture'];
    edge?: Props['edge'];
    modality?: Props['modality'];
    opened?: Props['opened'];
}
export interface DrawerPopupElementSettablePropertiesLenient extends Partial<DrawerPopupElementSettableProperties> {
    [key: string]: any;
}
export interface DrawerPopupIntrinsicProps extends Partial<Readonly<DrawerPopupElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojBeforeClose?: (value: DrawerPopupElementEventMap['ojBeforeClose']) => void;
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
