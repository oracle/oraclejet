import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import Color = require('../ojcolor');
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojColorSpectrum extends editableValue<Color, ojColorSpectrumSettableProperties> {
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    readonly transientValue: Color;
    value: Color;
    translations: {
        labelHue?: string;
        labelOpacity?: string;
        labelSatLum?: string;
        labelThumbDesc?: string;
    };
    addEventListener<T extends keyof ojColorSpectrumEventMap>(type: T, listener: (this: HTMLElement, ev: ojColorSpectrumEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojColorSpectrumSettableProperties>(property: T): ojColorSpectrum[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojColorSpectrumSettableProperties>(property: T, value: ojColorSpectrumSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojColorSpectrumSettableProperties>): void;
    setProperties(properties: ojColorSpectrumSettablePropertiesLenient): void;
}
export namespace ojColorSpectrum {
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
    type displayOptionsChanged = JetElementCustomEvent<ojColorSpectrum["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojColorSpectrum["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojColorSpectrum["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojColorSpectrum["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = editableValue.disabledChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<Color, ojColorSpectrumSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojColorSpectrumEventMap extends editableValueEventMap<Color, ojColorSpectrumSettableProperties> {
    'ojAnimateEnd': ojColorSpectrum.ojAnimateEnd;
    'ojAnimateStart': ojColorSpectrum.ojAnimateStart;
    'displayOptionsChanged': JetElementCustomEvent<ojColorSpectrum["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojColorSpectrum["labelledBy"]>;
    'transientValueChanged': JetElementCustomEvent<ojColorSpectrum["transientValue"]>;
    'valueChanged': JetElementCustomEvent<ojColorSpectrum["value"]>;
    'describedByChanged': JetElementCustomEvent<ojColorSpectrum["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojColorSpectrum["disabled"]>;
    'helpChanged': JetElementCustomEvent<ojColorSpectrum["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojColorSpectrum["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojColorSpectrum["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojColorSpectrum["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojColorSpectrum["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojColorSpectrum["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojColorSpectrum["valid"]>;
}
export interface ojColorSpectrumSettableProperties extends editableValueSettableProperties<Color> {
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    readonly transientValue: Color;
    value: Color;
    translations: {
        labelHue?: string;
        labelOpacity?: string;
        labelSatLum?: string;
        labelThumbDesc?: string;
    };
}
export interface ojColorSpectrumSettablePropertiesLenient extends Partial<ojColorSpectrumSettableProperties> {
    [key: string]: any;
}
export type ColorSpectrumElement = ojColorSpectrum;
export namespace ColorSpectrumElement {
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
    type displayOptionsChanged = JetElementCustomEvent<ojColorSpectrum["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojColorSpectrum["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojColorSpectrum["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojColorSpectrum["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = editableValue.disabledChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<Color, ojColorSpectrumSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<Color, ojColorSpectrumSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ColorSpectrumIntrinsicProps extends Partial<Readonly<ojColorSpectrumSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojColorSpectrumEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojColorSpectrumEventMap['ojAnimateStart']) => void;
    ondisplayOptionsChanged?: (value: ojColorSpectrumEventMap['displayOptionsChanged']) => void;
    onlabelledByChanged?: (value: ojColorSpectrumEventMap['labelledByChanged']) => void;
    ontransientValueChanged?: (value: ojColorSpectrumEventMap['transientValueChanged']) => void;
    onvalueChanged?: (value: ojColorSpectrumEventMap['valueChanged']) => void;
    ondescribedByChanged?: (value: ojColorSpectrumEventMap['describedByChanged']) => void;
    ondisabledChanged?: (value: ojColorSpectrumEventMap['disabledChanged']) => void;
    onhelpChanged?: (value: ojColorSpectrumEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojColorSpectrumEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojColorSpectrumEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojColorSpectrumEventMap['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojColorSpectrumEventMap['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojColorSpectrumEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojColorSpectrumEventMap['validChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-color-spectrum": ColorSpectrumIntrinsicProps;
        }
    }
}
