import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { Component } from 'preact';
import { KeySet } from 'ojs/ojkeyset';
type Props<Key> = ObservedGlobalProps<'aria-label' | 'aria-labelledby'> & {
    rowKey?: Key | null;
    indeterminate?: boolean;
    selectedKeys: KeySet<Key> | null;
    onSelectedKeysChanged?: PropertyChanged<KeySet<Key> | null>;
    onIndeterminateChanged?: PropertyChanged<boolean>;
    selectionMode?: 'all' | 'multiple' | 'single';
};
type State = {
    focus?: boolean;
};
export declare class Selector<K> extends Component<ExtendGlobalProps<Props<K>>, State> {
    constructor(props: ExtendGlobalProps<Props<K>>);
    static defaultProps: Props<any>;
    render(props: ExtendGlobalProps<Props<K>>, state: Readonly<State>): import("preact").JSX.Element;
    private readonly _handleFocusin;
    private readonly _handleFocusout;
    private readonly _checkboxListener;
    private _isSelected;
}
export {};
export interface SelectorElement<K> extends JetElement<SelectorElementSettableProperties<K>>, SelectorElementSettableProperties<K> {
    addEventListener<T extends keyof SelectorElementEventMap<K>>(type: T, listener: (this: HTMLElement, ev: SelectorElementEventMap<K>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof SelectorElementSettableProperties<K>>(property: T): SelectorElement<K>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof SelectorElementSettableProperties<K>>(property: T, value: SelectorElementSettableProperties<K>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, SelectorElementSettableProperties<K>>): void;
    setProperties(properties: SelectorElementSettablePropertiesLenient<K>): void;
}
export namespace SelectorElement {
    type indeterminateChanged<K> = JetElementCustomEventStrict<SelectorElement<K>['indeterminate']>;
    type rowKeyChanged<K> = JetElementCustomEventStrict<SelectorElement<K>['rowKey']>;
    type selectedKeysChanged<K> = JetElementCustomEventStrict<SelectorElement<K>['selectedKeys']>;
    type selectionModeChanged<K> = JetElementCustomEventStrict<SelectorElement<K>['selectionMode']>;
}
export interface SelectorElementEventMap<K> extends HTMLElementEventMap {
    'indeterminateChanged': JetElementCustomEventStrict<SelectorElement<K>['indeterminate']>;
    'rowKeyChanged': JetElementCustomEventStrict<SelectorElement<K>['rowKey']>;
    'selectedKeysChanged': JetElementCustomEventStrict<SelectorElement<K>['selectedKeys']>;
    'selectionModeChanged': JetElementCustomEventStrict<SelectorElement<K>['selectionMode']>;
}
export interface SelectorElementSettableProperties<Key> extends JetSettableProperties {
    indeterminate?: Props<Key>['indeterminate'];
    rowKey?: Props<Key>['rowKey'];
    selectedKeys: Props<Key>['selectedKeys'];
    selectionMode?: Props<Key>['selectionMode'];
}
export interface SelectorElementSettablePropertiesLenient<Key> extends Partial<SelectorElementSettableProperties<Key>> {
    [key: string]: any;
}
export interface SelectorIntrinsicProps extends Partial<Readonly<SelectorElementSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onindeterminateChanged?: (value: SelectorElementEventMap<any>['indeterminateChanged']) => void;
    onrowKeyChanged?: (value: SelectorElementEventMap<any>['rowKeyChanged']) => void;
    onselectedKeysChanged?: (value: SelectorElementEventMap<any>['selectedKeysChanged']) => void;
    onselectionModeChanged?: (value: SelectorElementEventMap<any>['selectionModeChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-selector': SelectorIntrinsicProps;
        }
    }
}
