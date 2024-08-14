import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojRadioset<K, D, V = any> extends editableValue<V, ojRadiosetSettableProperties<K, D, V>> {
    disabled: boolean;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    optionRenderer?: ((param0: ojRadioset.OptionContext<D>) => Element) | null;
    options: DataProvider<K, D> | null;
    optionsKeys?: ojRadioset.OptionsKeys;
    readonly: boolean | null;
    required: boolean;
    value: V | null;
    translations: {
        readonlyNoValue?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof ojRadiosetEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojRadiosetEventMap<K, D, V>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojRadiosetSettableProperties<K, D, V>>(property: T): ojRadioset<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojRadiosetSettableProperties<K, D, V>>(property: T, value: ojRadiosetSettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojRadiosetSettableProperties<K, D, V>>): void;
    setProperties(properties: ojRadiosetSettablePropertiesLenient<K, D, V>): void;
    refresh(): void;
    validate(): Promise<string>;
}
export namespace ojRadioset {
    interface ojAnimateEnd extends CustomEvent<{
        action: string;
        element: Element;
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: string;
        element: Element;
        endCallback: (() => void);
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = editableValue.describedByChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = editableValue.helpChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = editableValue.helpHintsChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = editableValue.labelEdgeChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = editableValue.labelHintChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = editableValue.messagesCustomChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = editableValue.userAssistanceDensityChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = editableValue.validChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        label?: string;
        value: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionContext<D> = {
        component: Element;
        data: D;
        index: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionsKeys = {
        label?: string;
        value?: string;
    };
}
export interface ojRadiosetEventMap<K, D, V = any> extends editableValueEventMap<V, ojRadiosetSettableProperties<K, D, V>> {
    'ojAnimateEnd': ojRadioset.ojAnimateEnd;
    'ojAnimateStart': ojRadioset.ojAnimateStart;
    'disabledChanged': JetElementCustomEvent<ojRadioset<K, D, V>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojRadioset<K, D, V>["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojRadioset<K, D, V>["labelledBy"]>;
    'optionRendererChanged': JetElementCustomEvent<ojRadioset<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojRadioset<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojRadioset<K, D, V>["optionsKeys"]>;
    'readonlyChanged': JetElementCustomEvent<ojRadioset<K, D, V>["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojRadioset<K, D, V>["required"]>;
    'valueChanged': JetElementCustomEvent<ojRadioset<K, D, V>["value"]>;
    'describedByChanged': JetElementCustomEvent<ojRadioset<K, D, V>["describedBy"]>;
    'helpChanged': JetElementCustomEvent<ojRadioset<K, D, V>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojRadioset<K, D, V>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojRadioset<K, D, V>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojRadioset<K, D, V>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojRadioset<K, D, V>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojRadioset<K, D, V>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojRadioset<K, D, V>["valid"]>;
}
export interface ojRadiosetSettableProperties<K, D, V> extends editableValueSettableProperties<V> {
    disabled: boolean;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    optionRenderer?: ((param0: ojRadioset.OptionContext<D>) => Element) | null;
    options: DataProvider<K, D> | null;
    optionsKeys?: ojRadioset.OptionsKeys;
    readonly: boolean | null;
    required: boolean;
    value: V | null;
    translations: {
        readonlyNoValue?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
}
export interface ojRadiosetSettablePropertiesLenient<K, D, V> extends Partial<ojRadiosetSettableProperties<K, D, V>> {
    [key: string]: any;
}
export type RadiosetElement<K, D, V = any> = ojRadioset<K, D, V>;
export namespace RadiosetElement {
    interface ojAnimateEnd extends CustomEvent<{
        action: string;
        element: Element;
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: string;
        element: Element;
        endCallback: (() => void);
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojRadioset<K, D, V>["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = editableValue.describedByChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = editableValue.helpChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = editableValue.helpHintsChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = editableValue.labelEdgeChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = editableValue.labelHintChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = editableValue.messagesCustomChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = editableValue.userAssistanceDensityChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = editableValue.validChanged<V, ojRadiosetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        label?: string;
        value: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionContext<D> = {
        component: Element;
        data: D;
        index: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionsKeys = {
        label?: string;
        value?: string;
    };
}
export interface RadiosetIntrinsicProps extends Partial<Readonly<ojRadiosetSettableProperties<any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojRadiosetEventMap<any, any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojRadiosetEventMap<any, any, any>['ojAnimateStart']) => void;
    ondisabledChanged?: (value: ojRadiosetEventMap<any, any, any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojRadiosetEventMap<any, any, any>['displayOptionsChanged']) => void;
    onlabelledByChanged?: (value: ojRadiosetEventMap<any, any, any>['labelledByChanged']) => void;
    onoptionRendererChanged?: (value: ojRadiosetEventMap<any, any, any>['optionRendererChanged']) => void;
    onoptionsChanged?: (value: ojRadiosetEventMap<any, any, any>['optionsChanged']) => void;
    onoptionsKeysChanged?: (value: ojRadiosetEventMap<any, any, any>['optionsKeysChanged']) => void;
    onreadonlyChanged?: (value: ojRadiosetEventMap<any, any, any>['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojRadiosetEventMap<any, any, any>['requiredChanged']) => void;
    onvalueChanged?: (value: ojRadiosetEventMap<any, any, any>['valueChanged']) => void;
    ondescribedByChanged?: (value: ojRadiosetEventMap<any, any, any>['describedByChanged']) => void;
    onhelpChanged?: (value: ojRadiosetEventMap<any, any, any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojRadiosetEventMap<any, any, any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojRadiosetEventMap<any, any, any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojRadiosetEventMap<any, any, any>['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojRadiosetEventMap<any, any, any>['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojRadiosetEventMap<any, any, any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojRadiosetEventMap<any, any, any>['validChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-radioset": RadiosetIntrinsicProps;
        }
    }
}
