import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojCheckboxset<K, D, V = any> extends editableValue<V[], ojCheckboxsetSettableProperties<K, D, V>> {
    disabled: boolean;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    optionRenderer?: ((param0: ojCheckboxset.OptionContext<D>) => Element) | null;
    options: DataProvider<K, D> | null;
    optionsKeys?: ojCheckboxset.OptionsKeys;
    readonly: boolean | null;
    required: boolean;
    value: V[] | null;
    translations: {
        readonlyNoValue?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof ojCheckboxsetEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojCheckboxsetEventMap<K, D, V>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojCheckboxsetSettableProperties<K, D, V>>(property: T): ojCheckboxset<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojCheckboxsetSettableProperties<K, D, V>>(property: T, value: ojCheckboxsetSettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojCheckboxsetSettableProperties<K, D, V>>): void;
    setProperties(properties: ojCheckboxsetSettablePropertiesLenient<K, D, V>): void;
    refresh(): void;
    validate(): Promise<string>;
}
export namespace ojCheckboxset {
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
    type disabledChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = editableValue.describedByChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = editableValue.helpChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = editableValue.helpHintsChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = editableValue.labelEdgeChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = editableValue.labelHintChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = editableValue.messagesCustomChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = editableValue.userAssistanceDensityChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = editableValue.validChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
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
export interface ojCheckboxsetEventMap<K, D, V = any> extends editableValueEventMap<V[], ojCheckboxsetSettableProperties<K, D, V>> {
    'ojAnimateEnd': ojCheckboxset.ojAnimateEnd;
    'ojAnimateStart': ojCheckboxset.ojAnimateStart;
    'disabledChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["labelledBy"]>;
    'optionRendererChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["optionsKeys"]>;
    'readonlyChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["required"]>;
    'valueChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["value"]>;
    'describedByChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["describedBy"]>;
    'helpChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["valid"]>;
}
export interface ojCheckboxsetSettableProperties<K, D, V> extends editableValueSettableProperties<V[]> {
    disabled: boolean;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    optionRenderer?: ((param0: ojCheckboxset.OptionContext<D>) => Element) | null;
    options: DataProvider<K, D> | null;
    optionsKeys?: ojCheckboxset.OptionsKeys;
    readonly: boolean | null;
    required: boolean;
    value: V[] | null;
    translations: {
        readonlyNoValue?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
}
export interface ojCheckboxsetSettablePropertiesLenient<K, D, V> extends Partial<ojCheckboxsetSettableProperties<K, D, V>> {
    [key: string]: any;
}
export type CheckboxsetElement<K, D, V = any> = ojCheckboxset<K, D, V>;
export namespace CheckboxsetElement {
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
    type disabledChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = editableValue.describedByChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = editableValue.helpChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = editableValue.helpHintsChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = editableValue.labelEdgeChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = editableValue.labelHintChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = editableValue.messagesCustomChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = editableValue.userAssistanceDensityChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = editableValue.validChanged<V[], ojCheckboxsetSettableProperties<K, D, V>>;
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
export interface CheckboxsetIntrinsicProps extends Partial<Readonly<ojCheckboxsetSettableProperties<any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojCheckboxsetEventMap<any, any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojCheckboxsetEventMap<any, any, any>['ojAnimateStart']) => void;
    ondisabledChanged?: (value: ojCheckboxsetEventMap<any, any, any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojCheckboxsetEventMap<any, any, any>['displayOptionsChanged']) => void;
    onlabelledByChanged?: (value: ojCheckboxsetEventMap<any, any, any>['labelledByChanged']) => void;
    onoptionRendererChanged?: (value: ojCheckboxsetEventMap<any, any, any>['optionRendererChanged']) => void;
    onoptionsChanged?: (value: ojCheckboxsetEventMap<any, any, any>['optionsChanged']) => void;
    onoptionsKeysChanged?: (value: ojCheckboxsetEventMap<any, any, any>['optionsKeysChanged']) => void;
    onreadonlyChanged?: (value: ojCheckboxsetEventMap<any, any, any>['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojCheckboxsetEventMap<any, any, any>['requiredChanged']) => void;
    onvalueChanged?: (value: ojCheckboxsetEventMap<any, any, any>['valueChanged']) => void;
    ondescribedByChanged?: (value: ojCheckboxsetEventMap<any, any, any>['describedByChanged']) => void;
    onhelpChanged?: (value: ojCheckboxsetEventMap<any, any, any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojCheckboxsetEventMap<any, any, any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojCheckboxsetEventMap<any, any, any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojCheckboxsetEventMap<any, any, any>['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojCheckboxsetEventMap<any, any, any>['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojCheckboxsetEventMap<any, any, any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojCheckboxsetEventMap<any, any, any>['validChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-checkboxset": CheckboxsetIntrinsicProps;
        }
    }
}
