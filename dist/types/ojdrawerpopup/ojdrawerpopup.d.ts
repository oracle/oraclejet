import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { Component, ComponentChildren } from 'preact';
import 'ojs/ojcore-base';
import 'ojs/ojpopup';
declare type EdgePopup = 'start' | 'end' | 'bottom';
declare type AutoDismiss = 'focus-loss' | 'none';
declare type CloseGesture = 'swipe' | 'none';
declare type Modality = 'modal' | 'modeless';
declare type State = {
    opened?: boolean;
    selfClosed: boolean;
};
declare type Props = ObservedGlobalProps<'role'> & {
    children?: ComponentChildren;
    opened?: boolean;
    onOpenedChanged?: PropertyChanged<boolean>;
    edge?: EdgePopup;
    modality?: Modality;
    autoDismiss?: AutoDismiss;
    closeGesture?: CloseGesture;
};
export declare class DrawerPopup extends Component<ExtendGlobalProps<Props>, State> {
    static readonly defaultProps: Partial<Props>;
    readonly state: State;
    private readonly rootRef;
    private focusableItems;
    private isShiftKeyActive;
    private hammerInstance;
    render(props: Readonly<Props>): ComponentChildren;
    private readonly handleFocusout;
    private handleKeyDown;
    private selfClose;
    private renderDrawer;
    private beforeOpenHandler;
    private beforeCloseHandler;
    private autoDismissHandler;
    private getDrawerPosition;
    private isDrawerOpened;
    private getPopupStyleClasses;
    static getDerivedStateFromProps(props: Readonly<Props>, state: Readonly<State>): Partial<State>;
    private handleFocus;
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void;
    private registerCloseWithSwipeListener;
    private getSwipeCloseDirection;
    private handleSwipeAction;
    private unregisterCloseWithSwipeListener;
}
// Custom Element interfaces
export interface DrawerPopupElement extends JetElement<DrawerPopupElementSettableProperties>, DrawerPopupElementSettableProperties {
  addEventListener<T extends keyof DrawerPopupElementEventMap>(type: T, listener: (this: HTMLElement, ev: DrawerPopupElementEventMap[T]) => any, options?: (boolean|AddEventListenerOptions)): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean|AddEventListenerOptions)): void;
  getProperty<T extends keyof DrawerPopupElementSettableProperties>(property: T): DrawerPopupElement[T];
  getProperty(property: string): any;
  setProperty<T extends keyof DrawerPopupElementSettableProperties>(property: T, value: DrawerPopupElementSettableProperties[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, DrawerPopupElementSettableProperties>): void;
  setProperties(properties: DrawerPopupElementSettablePropertiesLenient): void;
}
export namespace DrawerPopupElement {
  // tslint:disable-next-line interface-over-type-literal
  type autoDismissChanged = JetElementCustomEventStrict<DrawerPopupElement["autoDismiss"]>;
  // tslint:disable-next-line interface-over-type-literal
  type closeGestureChanged = JetElementCustomEventStrict<DrawerPopupElement["closeGesture"]>;
  // tslint:disable-next-line interface-over-type-literal
  type edgeChanged = JetElementCustomEventStrict<DrawerPopupElement["edge"]>;
  // tslint:disable-next-line interface-over-type-literal
  type modalityChanged = JetElementCustomEventStrict<DrawerPopupElement["modality"]>;
  // tslint:disable-next-line interface-over-type-literal
  type openedChanged = JetElementCustomEventStrict<DrawerPopupElement["opened"]>;
}
export interface DrawerPopupElementEventMap extends HTMLElementEventMap {
  'autoDismissChanged': JetElementCustomEventStrict<DrawerPopupElement["autoDismiss"]>;
  'closeGestureChanged': JetElementCustomEventStrict<DrawerPopupElement["closeGesture"]>;
  'edgeChanged': JetElementCustomEventStrict<DrawerPopupElement["edge"]>;
  'modalityChanged': JetElementCustomEventStrict<DrawerPopupElement["modality"]>;
  'openedChanged': JetElementCustomEventStrict<DrawerPopupElement["opened"]>;
}
export interface DrawerPopupElementSettableProperties extends JetSettableProperties {
  /**
  * Controls the close auto-dismiss behaviour to close the drawer.
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
  children?: ComponentChildren;
  onautoDismissChanged?: (value: DrawerPopupElementEventMap['autoDismissChanged']) => void;
  oncloseGestureChanged?: (value: DrawerPopupElementEventMap['closeGestureChanged']) => void;
  onedgeChanged?: (value: DrawerPopupElementEventMap['edgeChanged']) => void;
  onmodalityChanged?: (value: DrawerPopupElementEventMap['modalityChanged']) => void;
  onopenedChanged?: (value: DrawerPopupElementEventMap['openedChanged']) => void;
}
declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "oj-drawer-popup": DrawerPopupIntrinsicProps;
    }
  }
}
