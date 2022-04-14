import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, Slot } from 'ojs/ojvcomponent';
import { Component, ComponentChild, ComponentChildren } from 'preact';
import 'ojs/ojcore-base';
import 'ojs/ojpopup';
declare type DisplayMode = 'reflow' | 'overlay' | 'auto';
declare type ResolvedDisplayMode = 'reflow' | 'overlay' | 'full-overlay';
declare type EdgeLayout = 'start' | 'end' | 'bottom';
declare type State = {
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
    lastlyOpenedDrawer: EdgeLayout;
    startStateToChangeTo: GenericObject;
    endStateToChangeTo: GenericObject;
    bottomStateToChangeTo: GenericObject;
};
declare type GenericObject = {
    [key: string]: any;
};
declare type Props = ObservedGlobalProps<'role'> & {
    children?: ComponentChildren;
    start?: Slot;
    end?: Slot;
    bottom?: Slot;
    startOpened?: boolean;
    onStartOpenedChanged?: PropertyChanged<boolean>;
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
    private overlayDrawerResizeListener;
    private reflowDrawerResizeListener;
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
    private handleKeyDown;
    private selfClose;
    private setDrawerFocus;
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private handleComponentUpdate;
    private openOrCloseDrawer;
    private openOrCloseReflowDrawer;
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
    private handleFocus;
    private beforeCloseHandler;
    private afterCloseHandler;
    private lockResizeListener;
    private resizeHandler;
    private getDrawerPosition;
    private setStartEndOverlayDrawersHeight;
}
// Custom Element interfaces
export interface DrawerLayoutElement extends JetElement<DrawerLayoutElementSettableProperties>, DrawerLayoutElementSettableProperties {
  addEventListener<T extends keyof DrawerLayoutElementEventMap>(type: T, listener: (this: HTMLElement, ev: DrawerLayoutElementEventMap[T]) => any, options?: (boolean|AddEventListenerOptions)): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean|AddEventListenerOptions)): void;
  getProperty<T extends keyof DrawerLayoutElementSettableProperties>(property: T): DrawerLayoutElement[T];
  getProperty(property: string): any;
  setProperty<T extends keyof DrawerLayoutElementSettableProperties>(property: T, value: DrawerLayoutElementSettableProperties[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, DrawerLayoutElementSettableProperties>): void;
  setProperties(properties: DrawerLayoutElementSettablePropertiesLenient): void;
}
export namespace DrawerLayoutElement {
  // tslint:disable-next-line interface-over-type-literal
  type bottomDisplayChanged = JetElementCustomEventStrict<DrawerLayoutElement["bottomDisplay"]>;
  // tslint:disable-next-line interface-over-type-literal
  type bottomOpenedChanged = JetElementCustomEventStrict<DrawerLayoutElement["bottomOpened"]>;
  // tslint:disable-next-line interface-over-type-literal
  type endDisplayChanged = JetElementCustomEventStrict<DrawerLayoutElement["endDisplay"]>;
  // tslint:disable-next-line interface-over-type-literal
  type endOpenedChanged = JetElementCustomEventStrict<DrawerLayoutElement["endOpened"]>;
  // tslint:disable-next-line interface-over-type-literal
  type startDisplayChanged = JetElementCustomEventStrict<DrawerLayoutElement["startDisplay"]>;
  // tslint:disable-next-line interface-over-type-literal
  type startOpenedChanged = JetElementCustomEventStrict<DrawerLayoutElement["startOpened"]>;
}
export interface DrawerLayoutElementEventMap extends HTMLElementEventMap {
  'bottomDisplayChanged': JetElementCustomEventStrict<DrawerLayoutElement["bottomDisplay"]>;
  'bottomOpenedChanged': JetElementCustomEventStrict<DrawerLayoutElement["bottomOpened"]>;
  'endDisplayChanged': JetElementCustomEventStrict<DrawerLayoutElement["endDisplay"]>;
  'endOpenedChanged': JetElementCustomEventStrict<DrawerLayoutElement["endOpened"]>;
  'startDisplayChanged': JetElementCustomEventStrict<DrawerLayoutElement["startDisplay"]>;
  'startOpenedChanged': JetElementCustomEventStrict<DrawerLayoutElement["startOpened"]>;
}
export interface DrawerLayoutElementSettableProperties extends JetSettableProperties {
  /**
  * Specifies the display mode of the Bottom drawer.
  */
  bottomDisplay?: Props['bottomDisplay'];
  /**
  * Specifies the 'opened' state of the Bottom drawer.
  */
  bottomOpened?: Props['bottomOpened'];
  /**
  * Specifies the display mode of the End drawer.
  */
  endDisplay?: Props['endDisplay'];
  /**
  * Specifies the 'opened' state of the End drawer.
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
  children?: ComponentChildren;
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
      "oj-drawer-layout": DrawerLayoutIntrinsicProps;
    }
  }
}
