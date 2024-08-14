import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import AsyncValidator = require('../ojvalidator-async');
import Validator = require('../ojvalidator');
import Converter = require('../ojconverter');
import { Validation } from '../ojvalidationfactory-base';
import { DataProvider } from '../ojdataprovider';
import RequiredValidator = require('../ojvalidator-required');
import RegExpValidator = require('../ojvalidator-regexp');
import NumberRangeValidator = require('../ojvalidator-numberrange');
import LengthValidator = require('../ojvalidator-length');
import DateTimeRangeValidator = require('../ojvalidator-datetimerange');
import DateRestrictionValidator = require('../ojvalidator-daterestriction');
import { IntlDateTimeConverter, DateTimeConverter } from '../ojconverter-datetime';
import { IntlNumberConverter, NumberConverter } from '../ojconverter-number';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojCombobox<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> extends editableValue<V, SP, SV, RV> {
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    addEventListener<T extends keyof ojComboboxEventMap<V, SP, SV, RV>>(type: T, listener: (this: HTMLElement, ev: ojComboboxEventMap<V, SP, SV, RV>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojComboboxSettableProperties<V, SV, RV>>(property: T): ojCombobox<V, SP, SV, RV>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojComboboxSettableProperties<V, SV, RV>>(property: T, value: ojComboboxSettableProperties<V, SV, RV>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojComboboxSettableProperties<V, SV, RV>>): void;
    setProperties(properties: ojComboboxSettablePropertiesLenient<V, SV, RV>): void;
    refresh(): void;
    validate(): Promise<any>;
}
export namespace ojCombobox {
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
    type displayOptionsChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["displayOptions"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.describedByChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.disabledChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.helpChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.helpHintsChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.labelEdgeChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.labelHintChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.messagesCustomChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.userAssistanceDensityChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.validChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.valueChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type Optgroup = {
        children: Array<Option | Optgroup>;
        disabled?: boolean;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        label?: string;
        value: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionContext<D = any> = {
        componentElement: Element;
        data: D;
        depth: number;
        index: number;
        leaf: boolean;
        parent: Element;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionsKeys = {
        childKeys?: OptionsKeys;
        children?: string;
        label?: string;
        value?: string;
    };
}
export interface ojComboboxEventMap<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> extends editableValueEventMap<V, SP, SV, RV> {
    'ojAnimateEnd': ojCombobox.ojAnimateEnd;
    'ojAnimateStart': ojCombobox.ojAnimateStart;
    'displayOptionsChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["displayOptions"]>;
    'describedByChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["disabled"]>;
    'helpChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["valid"]>;
    'valueChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["value"]>;
}
export interface ojComboboxSettableProperties<V, SV = V, RV = V> extends editableValueSettableProperties<V, SV, RV> {
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
}
export interface ojComboboxSettablePropertiesLenient<V, SV = V, RV = V> extends Partial<ojComboboxSettableProperties<V, SV, RV>> {
    [key: string]: any;
}
export interface ojComboboxMany<K, D, V = any> extends ojCombobox<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]> {
    asyncValidators: Array<AsyncValidator<V[]>>;
    converter: Converter<V> | null;
    labelledBy: string | null;
    maximumResultCount: number;
    minLength: number;
    optionRenderer?: ((param0: ojCombobox.OptionContext<D>) => Element) | null;
    options: Array<ojCombobox.Option | ojCombobox.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojCombobox.OptionsKeys | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    placeholder: string | null;
    readonly rawValue: string[] | null;
    readonly: boolean;
    required: boolean;
    validators: Array<Validator<V> | AsyncValidator<V>> | null;
    value: V[] | null;
    valueOptions: Array<{
        value: V;
        label?: string;
    }> | null;
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        noMoreResults?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof ojComboboxManyEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojComboboxManyEventMap<K, D, V>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojComboboxManySettableProperties<K, D, V>>(property: T): ojComboboxMany<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojComboboxManySettableProperties<K, D, V>>(property: T, value: ojComboboxManySettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojComboboxManySettableProperties<K, D, V>>): void;
    setProperties(properties: ojComboboxManySettablePropertiesLenient<K, D, V>): void;
}
export namespace ojComboboxMany {
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
    type asyncValidatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["asyncValidators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minLengthChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["minLength"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["valueOptions"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = ojCombobox.describedByChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = ojCombobox.disabledChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = ojCombobox.displayOptionsChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = ojCombobox.helpChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = ojCombobox.helpHintsChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = ojCombobox.labelEdgeChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = ojCombobox.labelHintChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = ojCombobox.messagesCustomChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = ojCombobox.userAssistanceDensityChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = ojCombobox.validChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojComboboxManyEventMap<K, D, V = any> extends ojComboboxEventMap<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]> {
    'ojAnimateEnd': ojComboboxMany.ojAnimateEnd;
    'ojAnimateStart': ojComboboxMany.ojAnimateStart;
    'asyncValidatorsChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["asyncValidators"]>;
    'converterChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["converter"]>;
    'labelledByChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["labelledBy"]>;
    'maximumResultCountChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["maximumResultCount"]>;
    'minLengthChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["minLength"]>;
    'optionRendererChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["optionsKeys"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["required"]>;
    'validatorsChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["validators"]>;
    'valueChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["value"]>;
    'valueOptionsChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["valueOptions"]>;
    'describedByChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["valid"]>;
}
export interface ojComboboxManySettableProperties<K, D, V = any> extends ojComboboxSettableProperties<V[]> {
    asyncValidators: Array<AsyncValidator<V[]>>;
    converter: Converter<V> | null;
    labelledBy: string | null;
    maximumResultCount: number;
    minLength: number;
    optionRenderer?: ((param0: ojCombobox.OptionContext<D>) => Element) | null;
    options: Array<ojCombobox.Option | ojCombobox.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojCombobox.OptionsKeys | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    placeholder: string | null;
    readonly rawValue: string[] | null;
    readonly: boolean;
    required: boolean;
    validators: Array<Validator<V> | AsyncValidator<V>> | null;
    value: V[] | null;
    valueOptions: Array<{
        value: V;
        label?: string;
    }> | null;
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        noMoreResults?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
}
export interface ojComboboxManySettablePropertiesLenient<K, D, V = any> extends Partial<ojComboboxManySettableProperties<K, D, V>> {
    [key: string]: any;
}
export interface ojComboboxOne<K, D, V = any> extends ojCombobox<V, ojComboboxOneSettableProperties<K, D, V>, V, string> {
    asyncValidators: Array<AsyncValidator<V>>;
    converter: Converter<V> | null;
    filterOnOpen: 'none' | 'rawValue';
    labelledBy: string | null;
    maximumResultCount: number;
    minLength: number;
    optionRenderer?: ((param0: ojCombobox.OptionContext<D>) => Element) | null;
    options: Array<ojCombobox.Option | ojCombobox.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojCombobox.OptionsKeys | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    placeholder: string | null;
    readonly rawValue: string | null;
    readonly: boolean;
    required: boolean;
    validators: Array<Validator<V> | AsyncValidator<V>> | null;
    value: V | null;
    valueOption: {
        label?: string;
        value: V | null;
    };
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof ojComboboxOneEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojComboboxOneEventMap<K, D, V>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojComboboxOneSettableProperties<K, D, V>>(property: T): ojComboboxOne<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojComboboxOneSettableProperties<K, D, V>>(property: T, value: ojComboboxOneSettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojComboboxOneSettableProperties<K, D, V>>): void;
    setProperties(properties: ojComboboxOneSettablePropertiesLenient<K, D, V>): void;
}
export namespace ojComboboxOne {
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
    interface ojValueUpdated extends CustomEvent<{
        previousValue: any;
        value: any;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["asyncValidators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type filterOnOpenChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["filterOnOpen"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minLengthChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["minLength"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["valueOption"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = ojCombobox.describedByChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = ojCombobox.disabledChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = ojCombobox.displayOptionsChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = ojCombobox.helpChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = ojCombobox.helpHintsChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = ojCombobox.labelEdgeChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = ojCombobox.labelHintChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = ojCombobox.messagesCustomChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = ojCombobox.userAssistanceDensityChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = ojCombobox.validChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojComboboxOneEventMap<K, D, V = any> extends ojComboboxEventMap<V, ojComboboxOneSettableProperties<K, D, V>, V, string> {
    'ojAnimateEnd': ojComboboxOne.ojAnimateEnd;
    'ojAnimateStart': ojComboboxOne.ojAnimateStart;
    'ojValueUpdated': ojComboboxOne.ojValueUpdated;
    'asyncValidatorsChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["asyncValidators"]>;
    'converterChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["converter"]>;
    'filterOnOpenChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["filterOnOpen"]>;
    'labelledByChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["labelledBy"]>;
    'maximumResultCountChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["maximumResultCount"]>;
    'minLengthChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["minLength"]>;
    'optionRendererChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["optionsKeys"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["required"]>;
    'validatorsChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["validators"]>;
    'valueChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["value"]>;
    'valueOptionChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["valueOption"]>;
    'describedByChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["valid"]>;
}
export interface ojComboboxOneSettableProperties<K, D, V = any> extends ojComboboxSettableProperties<V> {
    asyncValidators: Array<AsyncValidator<V>>;
    converter: Converter<V> | null;
    filterOnOpen: 'none' | 'rawValue';
    labelledBy: string | null;
    maximumResultCount: number;
    minLength: number;
    optionRenderer?: ((param0: ojCombobox.OptionContext<D>) => Element) | null;
    options: Array<ojCombobox.Option | ojCombobox.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojCombobox.OptionsKeys | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    placeholder: string | null;
    readonly rawValue: string | null;
    readonly: boolean;
    required: boolean;
    validators: Array<Validator<V> | AsyncValidator<V>> | null;
    value: V | null;
    valueOption: {
        label?: string;
        value: V | null;
    };
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
}
export interface ojComboboxOneSettablePropertiesLenient<K, D, V = any> extends Partial<ojComboboxOneSettableProperties<K, D, V>> {
    [key: string]: any;
}
export interface ojSelect<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> extends editableValue<V, SP, SV> {
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    addEventListener<T extends keyof ojSelectEventMap<V, SP, SV>>(type: T, listener: (this: HTMLElement, ev: ojSelectEventMap<V, SP, SV>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojSelectSettableProperties<V, SV>>(property: T): ojSelect<V, SP, SV>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSelectSettableProperties<V, SV>>(property: T, value: ojSelectSettableProperties<V, SV>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSelectSettableProperties<V, SV>>): void;
    setProperties(properties: ojSelectSettablePropertiesLenient<V, SV>): void;
    refresh(): void;
    validate(): Promise<any>;
}
export namespace ojSelect {
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
    type displayOptionsChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = JetElementCustomEvent<ojSelect<V, SP, SV>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = JetElementCustomEvent<ojSelect<V, SP, SV>["labelledBy"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.describedByChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.disabledChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.helpChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.helpHintsChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.labelEdgeChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.labelHintChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.messagesCustomChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.userAssistanceDensityChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.validChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.valueChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type Optgroup = {
        children: Array<(Option | Optgroup)>;
        disabled?: boolean;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        label?: string;
        value: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionContext<D = any> = {
        componentElement: Element;
        data: D;
        depth: number;
        index: number;
        leaf: boolean;
        parent: Element;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionsKeys = {
        childKeys?: (OptionsKeys);
        children?: string;
        label?: string;
        value?: string;
    };
}
export interface ojSelectEventMap<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> extends editableValueEventMap<V, SP, SV> {
    'ojAnimateEnd': ojSelect.ojAnimateEnd;
    'ojAnimateStart': ojSelect.ojAnimateStart;
    'displayOptionsChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["labelledBy"]>;
    'describedByChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["disabled"]>;
    'helpChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["valid"]>;
    'valueChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["value"]>;
}
export interface ojSelectSettableProperties<V, SV = V> extends editableValueSettableProperties<V, SV> {
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
}
export interface ojSelectSettablePropertiesLenient<V, SV = V> extends Partial<ojSelectSettableProperties<V, SV>> {
    [key: string]: any;
}
export interface ojSelectMany<K, D, V = any> extends ojSelect<V[], ojSelectManySettableProperties<K, D, V>> {
    labelledBy: string | null;
    maximumResultCount: number;
    minimumResultsForSearch: number;
    optionRenderer?: ((param0: ojSelect.OptionContext<D>) => Element) | null;
    options: Array<ojSelect.Option | ojSelect.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojSelect.OptionsKeys | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    placeholder: string | null;
    readonly: boolean;
    renderMode: 'jet' | 'native';
    required: boolean;
    value: V[] | null;
    valueOptions: Array<{
        value: V;
        label?: string;
    }> | null;
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        noMoreResults?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        searchField?: string;
    };
    addEventListener<T extends keyof ojSelectManyEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojSelectManyEventMap<K, D, V>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojSelectManySettableProperties<K, D, V>>(property: T): ojSelectMany<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSelectManySettableProperties<K, D, V>>(property: T, value: ojSelectManySettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSelectManySettableProperties<K, D, V>>): void;
    setProperties(properties: ojSelectManySettablePropertiesLenient<K, D, V>): void;
}
export namespace ojSelectMany {
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
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minimumResultsForSearchChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["minimumResultsForSearch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["valueOptions"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = ojSelect.describedByChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = ojSelect.disabledChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = ojSelect.displayOptionsChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = ojSelect.helpChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = ojSelect.helpHintsChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = ojSelect.labelEdgeChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = ojSelect.labelHintChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = ojSelect.messagesCustomChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = ojSelect.userAssistanceDensityChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = ojSelect.validChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojSelectManyEventMap<K, D, V = any> extends ojSelectEventMap<V[], ojSelectManySettableProperties<K, D, V>> {
    'ojAnimateEnd': ojSelectMany.ojAnimateEnd;
    'ojAnimateStart': ojSelectMany.ojAnimateStart;
    'labelledByChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["labelledBy"]>;
    'maximumResultCountChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["maximumResultCount"]>;
    'minimumResultsForSearchChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["minimumResultsForSearch"]>;
    'optionRendererChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["optionsKeys"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["placeholder"]>;
    'readonlyChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["readonly"]>;
    'renderModeChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["renderMode"]>;
    'requiredChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["required"]>;
    'valueChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["value"]>;
    'valueOptionsChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["valueOptions"]>;
    'describedByChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["valid"]>;
}
export interface ojSelectManySettableProperties<K, D, V = any[]> extends ojSelectSettableProperties<V[]> {
    labelledBy: string | null;
    maximumResultCount: number;
    minimumResultsForSearch: number;
    optionRenderer?: ((param0: ojSelect.OptionContext<D>) => Element) | null;
    options: Array<ojSelect.Option | ojSelect.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojSelect.OptionsKeys | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    placeholder: string | null;
    readonly: boolean;
    renderMode: 'jet' | 'native';
    required: boolean;
    value: V[] | null;
    valueOptions: Array<{
        value: V;
        label?: string;
    }> | null;
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        noMoreResults?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        searchField?: string;
    };
}
export interface ojSelectManySettablePropertiesLenient<K, D, V = any[]> extends Partial<ojSelectManySettableProperties<K, D, V>> {
    [key: string]: any;
}
export interface ojSelectOne<K, D, V = any> extends ojSelect<V, ojSelectOneSettableProperties<K, D, V>> {
    labelledBy: string | null;
    maximumResultCount: number;
    minimumResultsForSearch: number;
    optionRenderer?: ((param0: ojSelect.OptionContext<D>) => Element) | null;
    options: Array<ojSelect.Option | ojSelect.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojSelect.OptionsKeys | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    placeholder: string | null;
    readonly: boolean;
    renderMode: 'jet' | 'native';
    required: boolean;
    value: V | null;
    valueOption: {
        label?: string;
        value: V | null;
    };
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        searchField?: string;
    };
    addEventListener<T extends keyof ojSelectOneEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojSelectOneEventMap<K, D, V>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojSelectOneSettableProperties<K, D, V>>(property: T): ojSelectOne<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSelectOneSettableProperties<K, D, V>>(property: T, value: ojSelectOneSettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSelectOneSettableProperties<K, D, V>>): void;
    setProperties(properties: ojSelectOneSettablePropertiesLenient<K, D, V>): void;
}
export namespace ojSelectOne {
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
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minimumResultsForSearchChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["minimumResultsForSearch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["valueOption"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = ojSelect.describedByChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = ojSelect.disabledChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = ojSelect.displayOptionsChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = ojSelect.helpChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = ojSelect.helpHintsChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = ojSelect.labelEdgeChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = ojSelect.labelHintChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = ojSelect.messagesCustomChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = ojSelect.userAssistanceDensityChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = ojSelect.validChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojSelectOneEventMap<K, D, V = any> extends ojSelectEventMap<V, ojSelectOneSettableProperties<K, D, V>> {
    'ojAnimateEnd': ojSelectOne.ojAnimateEnd;
    'ojAnimateStart': ojSelectOne.ojAnimateStart;
    'labelledByChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["labelledBy"]>;
    'maximumResultCountChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["maximumResultCount"]>;
    'minimumResultsForSearchChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["minimumResultsForSearch"]>;
    'optionRendererChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["optionsKeys"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["placeholder"]>;
    'readonlyChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["readonly"]>;
    'renderModeChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["renderMode"]>;
    'requiredChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["required"]>;
    'valueChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["value"]>;
    'valueOptionChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["valueOption"]>;
    'describedByChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["valid"]>;
}
export interface ojSelectOneSettableProperties<K, D, V = any> extends ojSelectSettableProperties<V> {
    labelledBy: string | null;
    maximumResultCount: number;
    minimumResultsForSearch: number;
    optionRenderer?: ((param0: ojSelect.OptionContext<D>) => Element) | null;
    options: Array<ojSelect.Option | ojSelect.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojSelect.OptionsKeys | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    placeholder: string | null;
    readonly: boolean;
    renderMode: 'jet' | 'native';
    required: boolean;
    value: V | null;
    valueOption: {
        label?: string;
        value: V | null;
    };
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        searchField?: string;
    };
}
export interface ojSelectOneSettablePropertiesLenient<K, D, V = any> extends Partial<ojSelectOneSettableProperties<K, D, V>> {
    [key: string]: any;
}
export interface Optgroup {
    children: Array<(Option | Optgroup)>;
    disabled?: boolean;
    label: string;
}
export interface Option {
    disabled?: boolean;
    label?: string;
    value: object;
}
export type ComboboxElement<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = ojCombobox<V, SP, SV, RV>;
export type ComboboxManyElement<K, D, V = any> = ojComboboxMany<K, D, V>;
export type ComboboxOneElement<K, D, V = any> = ojComboboxOne<K, D, V>;
export type SelectElement<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = ojSelect<V, SP, SV>;
export type SelectManyElement<K, D, V = any> = ojSelectMany<K, D, V>;
export type SelectOneElement<K, D, V = any> = ojSelectOne<K, D, V>;
export namespace ComboboxElement {
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
    type displayOptionsChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["displayOptions"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.describedByChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.disabledChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.helpChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.helpHintsChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.labelEdgeChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.labelHintChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.messagesCustomChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.userAssistanceDensityChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.validChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = editableValue.valueChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type Optgroup = {
        children: Array<ojCombobox.Option | ojCombobox.Optgroup>;
        disabled?: boolean;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        label?: string;
        value: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionContext<D = any> = {
        componentElement: Element;
        data: D;
        depth: number;
        index: number;
        leaf: boolean;
        parent: Element;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionsKeys = {
        childKeys?: ojCombobox.OptionsKeys;
        children?: string;
        label?: string;
        value?: string;
    };
}
export namespace ComboboxManyElement {
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
    type asyncValidatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["asyncValidators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minLengthChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["minLength"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["valueOptions"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = ojCombobox.describedByChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = ojCombobox.disabledChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = ojCombobox.displayOptionsChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = ojCombobox.helpChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = ojCombobox.helpHintsChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = ojCombobox.labelEdgeChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = ojCombobox.labelHintChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = ojCombobox.messagesCustomChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = ojCombobox.userAssistanceDensityChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = ojCombobox.validChanged<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export namespace ComboboxOneElement {
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
    interface ojValueUpdated extends CustomEvent<{
        previousValue: any;
        value: any;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["asyncValidators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type filterOnOpenChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["filterOnOpen"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minLengthChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["minLength"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["valueOption"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = ojCombobox.describedByChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = ojCombobox.disabledChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = ojCombobox.displayOptionsChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = ojCombobox.helpChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = ojCombobox.helpHintsChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = ojCombobox.labelEdgeChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = ojCombobox.labelHintChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = ojCombobox.messagesCustomChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = ojCombobox.userAssistanceDensityChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = ojCombobox.validChanged<V, ojComboboxOneSettableProperties<K, D, V>, V, string>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export namespace SelectElement {
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
    type displayOptionsChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = JetElementCustomEvent<ojSelect<V, SP, SV>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = JetElementCustomEvent<ojSelect<V, SP, SV>["labelledBy"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.describedByChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.disabledChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.helpChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.helpHintsChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.labelEdgeChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.labelHintChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.messagesCustomChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.userAssistanceDensityChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.validChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = editableValue.valueChanged<V, SP, SV>;
    // tslint:disable-next-line interface-over-type-literal
    type Optgroup = {
        children: Array<(ojSelect.Option | ojSelect.Optgroup)>;
        disabled?: boolean;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        label?: string;
        value: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionContext<D = any> = {
        componentElement: Element;
        data: D;
        depth: number;
        index: number;
        leaf: boolean;
        parent: Element;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionsKeys = {
        childKeys?: (ojSelect.OptionsKeys);
        children?: string;
        label?: string;
        value?: string;
    };
}
export namespace SelectManyElement {
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
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minimumResultsForSearchChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["minimumResultsForSearch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["valueOptions"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = ojSelect.describedByChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = ojSelect.disabledChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = ojSelect.displayOptionsChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = ojSelect.helpChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = ojSelect.helpHintsChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = ojSelect.labelEdgeChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = ojSelect.labelHintChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = ojSelect.messagesCustomChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = ojSelect.userAssistanceDensityChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = ojSelect.validChanged<V[], ojSelectManySettableProperties<K, D, V>>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export namespace SelectOneElement {
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
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minimumResultsForSearchChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["minimumResultsForSearch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["valueOption"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<K, D, V = any> = ojSelect.describedByChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = ojSelect.disabledChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = ojSelect.displayOptionsChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<K, D, V = any> = ojSelect.helpChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<K, D, V = any> = ojSelect.helpHintsChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<K, D, V = any> = ojSelect.labelEdgeChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<K, D, V = any> = ojSelect.labelHintChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<K, D, V = any> = ojSelect.messagesCustomChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<K, D, V = any> = ojSelect.userAssistanceDensityChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<K, D, V = any> = ojSelect.validChanged<V, ojSelectOneSettableProperties<K, D, V>>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ComboboxManyIntrinsicProps extends Partial<Readonly<ojComboboxManySettableProperties<any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojComboboxManyEventMap<any, any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojComboboxManyEventMap<any, any, any>['ojAnimateStart']) => void;
    onasyncValidatorsChanged?: (value: ojComboboxManyEventMap<any, any, any>['asyncValidatorsChanged']) => void;
    onconverterChanged?: (value: ojComboboxManyEventMap<any, any, any>['converterChanged']) => void;
    onlabelledByChanged?: (value: ojComboboxManyEventMap<any, any, any>['labelledByChanged']) => void;
    onmaximumResultCountChanged?: (value: ojComboboxManyEventMap<any, any, any>['maximumResultCountChanged']) => void;
    onminLengthChanged?: (value: ojComboboxManyEventMap<any, any, any>['minLengthChanged']) => void;
    onoptionRendererChanged?: (value: ojComboboxManyEventMap<any, any, any>['optionRendererChanged']) => void;
    onoptionsChanged?: (value: ojComboboxManyEventMap<any, any, any>['optionsChanged']) => void;
    onoptionsKeysChanged?: (value: ojComboboxManyEventMap<any, any, any>['optionsKeysChanged']) => void;
    onpickerAttributesChanged?: (value: ojComboboxManyEventMap<any, any, any>['pickerAttributesChanged']) => void;
    onplaceholderChanged?: (value: ojComboboxManyEventMap<any, any, any>['placeholderChanged']) => void;
    onrawValueChanged?: (value: ojComboboxManyEventMap<any, any, any>['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojComboboxManyEventMap<any, any, any>['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojComboboxManyEventMap<any, any, any>['requiredChanged']) => void;
    onvalidatorsChanged?: (value: ojComboboxManyEventMap<any, any, any>['validatorsChanged']) => void;
    onvalueChanged?: (value: ojComboboxManyEventMap<any, any, any>['valueChanged']) => void;
    onvalueOptionsChanged?: (value: ojComboboxManyEventMap<any, any, any>['valueOptionsChanged']) => void;
    ondescribedByChanged?: (value: ojComboboxManyEventMap<any, any, any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojComboboxManyEventMap<any, any, any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojComboboxManyEventMap<any, any, any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojComboboxManyEventMap<any, any, any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojComboboxManyEventMap<any, any, any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojComboboxManyEventMap<any, any, any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojComboboxManyEventMap<any, any, any>['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojComboboxManyEventMap<any, any, any>['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojComboboxManyEventMap<any, any, any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojComboboxManyEventMap<any, any, any>['validChanged']) => void;
    children?: ComponentChildren;
}
export interface ComboboxOneIntrinsicProps extends Partial<Readonly<ojComboboxOneSettableProperties<any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojComboboxOneEventMap<any, any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojComboboxOneEventMap<any, any, any>['ojAnimateStart']) => void;
    onojValueUpdated?: (value: ojComboboxOneEventMap<any, any, any>['ojValueUpdated']) => void;
    onasyncValidatorsChanged?: (value: ojComboboxOneEventMap<any, any, any>['asyncValidatorsChanged']) => void;
    onconverterChanged?: (value: ojComboboxOneEventMap<any, any, any>['converterChanged']) => void;
    onfilterOnOpenChanged?: (value: ojComboboxOneEventMap<any, any, any>['filterOnOpenChanged']) => void;
    onlabelledByChanged?: (value: ojComboboxOneEventMap<any, any, any>['labelledByChanged']) => void;
    onmaximumResultCountChanged?: (value: ojComboboxOneEventMap<any, any, any>['maximumResultCountChanged']) => void;
    onminLengthChanged?: (value: ojComboboxOneEventMap<any, any, any>['minLengthChanged']) => void;
    onoptionRendererChanged?: (value: ojComboboxOneEventMap<any, any, any>['optionRendererChanged']) => void;
    onoptionsChanged?: (value: ojComboboxOneEventMap<any, any, any>['optionsChanged']) => void;
    onoptionsKeysChanged?: (value: ojComboboxOneEventMap<any, any, any>['optionsKeysChanged']) => void;
    onpickerAttributesChanged?: (value: ojComboboxOneEventMap<any, any, any>['pickerAttributesChanged']) => void;
    onplaceholderChanged?: (value: ojComboboxOneEventMap<any, any, any>['placeholderChanged']) => void;
    onrawValueChanged?: (value: ojComboboxOneEventMap<any, any, any>['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojComboboxOneEventMap<any, any, any>['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojComboboxOneEventMap<any, any, any>['requiredChanged']) => void;
    onvalidatorsChanged?: (value: ojComboboxOneEventMap<any, any, any>['validatorsChanged']) => void;
    onvalueChanged?: (value: ojComboboxOneEventMap<any, any, any>['valueChanged']) => void;
    onvalueOptionChanged?: (value: ojComboboxOneEventMap<any, any, any>['valueOptionChanged']) => void;
    ondescribedByChanged?: (value: ojComboboxOneEventMap<any, any, any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojComboboxOneEventMap<any, any, any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojComboboxOneEventMap<any, any, any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojComboboxOneEventMap<any, any, any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojComboboxOneEventMap<any, any, any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojComboboxOneEventMap<any, any, any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojComboboxOneEventMap<any, any, any>['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojComboboxOneEventMap<any, any, any>['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojComboboxOneEventMap<any, any, any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojComboboxOneEventMap<any, any, any>['validChanged']) => void;
    children?: ComponentChildren;
}
export interface SelectManyIntrinsicProps extends Partial<Readonly<ojSelectManySettableProperties<any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojSelectManyEventMap<any, any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojSelectManyEventMap<any, any, any>['ojAnimateStart']) => void;
    onlabelledByChanged?: (value: ojSelectManyEventMap<any, any, any>['labelledByChanged']) => void;
    onmaximumResultCountChanged?: (value: ojSelectManyEventMap<any, any, any>['maximumResultCountChanged']) => void;
    onminimumResultsForSearchChanged?: (value: ojSelectManyEventMap<any, any, any>['minimumResultsForSearchChanged']) => void;
    onoptionRendererChanged?: (value: ojSelectManyEventMap<any, any, any>['optionRendererChanged']) => void;
    onoptionsChanged?: (value: ojSelectManyEventMap<any, any, any>['optionsChanged']) => void;
    onoptionsKeysChanged?: (value: ojSelectManyEventMap<any, any, any>['optionsKeysChanged']) => void;
    onpickerAttributesChanged?: (value: ojSelectManyEventMap<any, any, any>['pickerAttributesChanged']) => void;
    onplaceholderChanged?: (value: ojSelectManyEventMap<any, any, any>['placeholderChanged']) => void;
    onreadonlyChanged?: (value: ojSelectManyEventMap<any, any, any>['readonlyChanged']) => void;
    onrenderModeChanged?: (value: ojSelectManyEventMap<any, any, any>['renderModeChanged']) => void;
    onrequiredChanged?: (value: ojSelectManyEventMap<any, any, any>['requiredChanged']) => void;
    onvalueChanged?: (value: ojSelectManyEventMap<any, any, any>['valueChanged']) => void;
    onvalueOptionsChanged?: (value: ojSelectManyEventMap<any, any, any>['valueOptionsChanged']) => void;
    ondescribedByChanged?: (value: ojSelectManyEventMap<any, any, any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojSelectManyEventMap<any, any, any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojSelectManyEventMap<any, any, any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojSelectManyEventMap<any, any, any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojSelectManyEventMap<any, any, any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojSelectManyEventMap<any, any, any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojSelectManyEventMap<any, any, any>['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojSelectManyEventMap<any, any, any>['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojSelectManyEventMap<any, any, any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojSelectManyEventMap<any, any, any>['validChanged']) => void;
    children?: ComponentChildren;
}
export interface SelectOneIntrinsicProps extends Partial<Readonly<ojSelectOneSettableProperties<any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojSelectOneEventMap<any, any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojSelectOneEventMap<any, any, any>['ojAnimateStart']) => void;
    onlabelledByChanged?: (value: ojSelectOneEventMap<any, any, any>['labelledByChanged']) => void;
    onmaximumResultCountChanged?: (value: ojSelectOneEventMap<any, any, any>['maximumResultCountChanged']) => void;
    onminimumResultsForSearchChanged?: (value: ojSelectOneEventMap<any, any, any>['minimumResultsForSearchChanged']) => void;
    onoptionRendererChanged?: (value: ojSelectOneEventMap<any, any, any>['optionRendererChanged']) => void;
    onoptionsChanged?: (value: ojSelectOneEventMap<any, any, any>['optionsChanged']) => void;
    onoptionsKeysChanged?: (value: ojSelectOneEventMap<any, any, any>['optionsKeysChanged']) => void;
    onpickerAttributesChanged?: (value: ojSelectOneEventMap<any, any, any>['pickerAttributesChanged']) => void;
    onplaceholderChanged?: (value: ojSelectOneEventMap<any, any, any>['placeholderChanged']) => void;
    onreadonlyChanged?: (value: ojSelectOneEventMap<any, any, any>['readonlyChanged']) => void;
    onrenderModeChanged?: (value: ojSelectOneEventMap<any, any, any>['renderModeChanged']) => void;
    onrequiredChanged?: (value: ojSelectOneEventMap<any, any, any>['requiredChanged']) => void;
    onvalueChanged?: (value: ojSelectOneEventMap<any, any, any>['valueChanged']) => void;
    onvalueOptionChanged?: (value: ojSelectOneEventMap<any, any, any>['valueOptionChanged']) => void;
    ondescribedByChanged?: (value: ojSelectOneEventMap<any, any, any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojSelectOneEventMap<any, any, any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojSelectOneEventMap<any, any, any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojSelectOneEventMap<any, any, any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojSelectOneEventMap<any, any, any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojSelectOneEventMap<any, any, any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojSelectOneEventMap<any, any, any>['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojSelectOneEventMap<any, any, any>['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojSelectOneEventMap<any, any, any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojSelectOneEventMap<any, any, any>['validChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-combobox-many": ComboboxManyIntrinsicProps;
            "oj-combobox-one": ComboboxOneIntrinsicProps;
            "oj-select-many": SelectManyIntrinsicProps;
            "oj-select-one": SelectOneIntrinsicProps;
        }
    }
}
