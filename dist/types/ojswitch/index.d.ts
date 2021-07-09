import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojSwitch extends editableValue<boolean, ojSwitchSettableProperties> {
    disabled: boolean;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    readonly: boolean;
    value: boolean;
    translations: {
        switchOff?: string;
        switchOn?: string;
    };
    addEventListener<T extends keyof ojSwitchEventMap>(type: T, listener: (this: HTMLElement, ev: ojSwitchEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojSwitchSettableProperties>(property: T): ojSwitch[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSwitchSettableProperties>(property: T, value: ojSwitchSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSwitchSettableProperties>): void;
    setProperties(properties: ojSwitchSettablePropertiesLenient): void;
}
export namespace ojSwitch {
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
    type disabledChanged = JetElementCustomEvent<ojSwitch["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojSwitch["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojSwitch["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = JetElementCustomEvent<ojSwitch["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojSwitch["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<boolean, ojSwitchSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojSwitchEventMap extends editableValueEventMap<boolean, ojSwitchSettableProperties> {
    'ojAnimateEnd': ojSwitch.ojAnimateEnd;
    'ojAnimateStart': ojSwitch.ojAnimateStart;
    'disabledChanged': JetElementCustomEvent<ojSwitch["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojSwitch["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojSwitch["labelledBy"]>;
    'readonlyChanged': JetElementCustomEvent<ojSwitch["readonly"]>;
    'valueChanged': JetElementCustomEvent<ojSwitch["value"]>;
    'describedByChanged': JetElementCustomEvent<ojSwitch["describedBy"]>;
    'helpChanged': JetElementCustomEvent<ojSwitch["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojSwitch["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojSwitch["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojSwitch["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojSwitch["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojSwitch["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojSwitch["valid"]>;
}
export interface ojSwitchSettableProperties extends editableValueSettableProperties<boolean> {
    disabled: boolean;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    readonly: boolean;
    value: boolean;
    translations: {
        switchOff?: string;
        switchOn?: string;
    };
}
export interface ojSwitchSettablePropertiesLenient extends Partial<ojSwitchSettableProperties> {
    [key: string]: any;
}
export type SwitchElement = ojSwitch;
export namespace SwitchElement {
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
    type disabledChanged = JetElementCustomEvent<ojSwitch["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojSwitch["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojSwitch["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = JetElementCustomEvent<ojSwitch["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojSwitch["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<boolean, ojSwitchSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<boolean, ojSwitchSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface SwitchIntrinsicProps extends Partial<Readonly<ojSwitchSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojSwitchEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojSwitchEventMap['ojAnimateStart']) => void;
    ondisabledChanged?: (value: ojSwitchEventMap['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojSwitchEventMap['displayOptionsChanged']) => void;
    onlabelledByChanged?: (value: ojSwitchEventMap['labelledByChanged']) => void;
    onreadonlyChanged?: (value: ojSwitchEventMap['readonlyChanged']) => void;
    onvalueChanged?: (value: ojSwitchEventMap['valueChanged']) => void;
    ondescribedByChanged?: (value: ojSwitchEventMap['describedByChanged']) => void;
    onhelpChanged?: (value: ojSwitchEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojSwitchEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojSwitchEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojSwitchEventMap['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojSwitchEventMap['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojSwitchEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojSwitchEventMap['validChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-switch": SwitchIntrinsicProps;
        }
    }
}
