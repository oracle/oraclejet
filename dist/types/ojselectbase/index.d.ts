import ojcommontypes = require('../ojcommontypes');
import { DataProvider, TextFilter } from '../ojdataprovider';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojSelectBase<V, D, SP extends ojSelectBaseSettableProperties<V, D>> extends editableValue<V, SP> {
    data: DataProvider<V, D>;
    itemText: keyof D | ((itemContext: ojcommontypes.ItemContext<V, D>) => string);
    labelledBy: string | null;
    matchBy: Array<TextFilter<D>['matchBy']> | null;
    placeholder: string;
    readonly: boolean;
    required: boolean;
    virtualKeyboard: 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
    addEventListener<T extends keyof ojSelectBaseEventMap<V, D, SP>>(type: T, listener: (this: HTMLElement, ev: ojSelectBaseEventMap<V, D, SP>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojSelectBaseSettableProperties<V, D>>(property: T): ojSelectBase<V, D, SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSelectBaseSettableProperties<V, D>>(property: T, value: ojSelectBaseSettableProperties<V, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSelectBaseSettableProperties<V, D>>): void;
    setProperties(properties: ojSelectBaseSettablePropertiesLenient<V, D>): void;
    refresh(): void;
    validate(): Promise<any>;
}
export namespace ojSelectBase {
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
    type dataChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemTextChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["itemText"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type matchByChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["matchBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type virtualKeyboardChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["virtualKeyboard"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.describedByChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.disabledChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.helpChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.helpHintsChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.labelEdgeChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.labelHintChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.messagesCustomChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.userAssistanceDensityChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.validChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.valueChanged<V, SP>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojSelectBaseEventMap<V, D, SP extends ojSelectBaseSettableProperties<V, D>> extends editableValueEventMap<V, SP> {
    'ojAnimateEnd': ojSelectBase.ojAnimateEnd;
    'ojAnimateStart': ojSelectBase.ojAnimateStart;
    'dataChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["data"]>;
    'itemTextChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["itemText"]>;
    'labelledByChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["labelledBy"]>;
    'matchByChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["matchBy"]>;
    'placeholderChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["placeholder"]>;
    'readonlyChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["required"]>;
    'virtualKeyboardChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["virtualKeyboard"]>;
    'describedByChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["disabled"]>;
    'helpChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["valid"]>;
    'valueChanged': JetElementCustomEvent<ojSelectBase<V, D, SP>["value"]>;
}
export interface ojSelectBaseSettableProperties<V, D> extends editableValueSettableProperties<V> {
    data: DataProvider<V, D>;
    itemText: keyof D | ((itemContext: ojcommontypes.ItemContext<V, D>) => string);
    labelledBy: string | null;
    matchBy: Array<TextFilter<D>['matchBy']> | null;
    placeholder: string;
    readonly: boolean;
    required: boolean;
    virtualKeyboard: 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
}
export interface ojSelectBaseSettablePropertiesLenient<V, D> extends Partial<ojSelectBaseSettableProperties<V, D>> {
    [key: string]: any;
}
export type SelectBaseElement<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = ojSelectBase<V, D, SP>;
export namespace SelectBaseElement {
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
    type dataChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemTextChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["itemText"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type matchByChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["matchBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type virtualKeyboardChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = JetElementCustomEvent<ojSelectBase<V, D, SP>["virtualKeyboard"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.describedByChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.disabledChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.helpChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.helpHintsChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.labelEdgeChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.labelHintChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.messagesCustomChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.userAssistanceDensityChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.validChanged<V, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, D, SP extends ojSelectBaseSettableProperties<V, D>> = editableValue.valueChanged<V, SP>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
