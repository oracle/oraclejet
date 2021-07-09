import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojRangeSlider extends editableValue<Object | null, ojRangeSliderSettableProperties> {
    disabled: boolean;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    max: number | null;
    min: number | null;
    orientation: 'horizontal' | 'vertical';
    step: number | null;
    readonly transientValue: {
        end: number | null;
        start: number | null;
    };
    value: {
        end: number | null;
        start: number | null;
    };
    translations: {
        higherValueThumb?: string;
        lowerValueThumb?: string;
        startEnd?: string;
    };
    addEventListener<T extends keyof ojRangeSliderEventMap>(type: T, listener: (this: HTMLElement, ev: ojRangeSliderEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojRangeSliderSettableProperties>(property: T): ojRangeSlider[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojRangeSliderSettableProperties>(property: T, value: ojRangeSliderSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojRangeSliderSettableProperties>): void;
    setProperties(properties: ojRangeSliderSettablePropertiesLenient): void;
}
export namespace ojRangeSlider {
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
    type disabledChanged = JetElementCustomEvent<ojRangeSlider["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojRangeSlider["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojRangeSlider["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojRangeSlider["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojRangeSlider["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojRangeSlider["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepChanged = JetElementCustomEvent<ojRangeSlider["step"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojRangeSlider["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojRangeSlider["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<Object | null, ojRangeSliderSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojRangeSliderEventMap extends editableValueEventMap<Object | null, ojRangeSliderSettableProperties> {
    'ojAnimateEnd': ojRangeSlider.ojAnimateEnd;
    'ojAnimateStart': ojRangeSlider.ojAnimateStart;
    'disabledChanged': JetElementCustomEvent<ojRangeSlider["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojRangeSlider["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojRangeSlider["labelledBy"]>;
    'maxChanged': JetElementCustomEvent<ojRangeSlider["max"]>;
    'minChanged': JetElementCustomEvent<ojRangeSlider["min"]>;
    'orientationChanged': JetElementCustomEvent<ojRangeSlider["orientation"]>;
    'stepChanged': JetElementCustomEvent<ojRangeSlider["step"]>;
    'transientValueChanged': JetElementCustomEvent<ojRangeSlider["transientValue"]>;
    'valueChanged': JetElementCustomEvent<ojRangeSlider["value"]>;
    'describedByChanged': JetElementCustomEvent<ojRangeSlider["describedBy"]>;
    'helpChanged': JetElementCustomEvent<ojRangeSlider["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojRangeSlider["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojRangeSlider["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojRangeSlider["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojRangeSlider["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojRangeSlider["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojRangeSlider["valid"]>;
}
export interface ojRangeSliderSettableProperties extends editableValueSettableProperties<Object | null> {
    disabled: boolean;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    max: number | null;
    min: number | null;
    orientation: 'horizontal' | 'vertical';
    step: number | null;
    readonly transientValue: {
        end: number | null;
        start: number | null;
    };
    value: {
        end: number | null;
        start: number | null;
    };
    translations: {
        higherValueThumb?: string;
        lowerValueThumb?: string;
        startEnd?: string;
    };
}
export interface ojRangeSliderSettablePropertiesLenient extends Partial<ojRangeSliderSettableProperties> {
    [key: string]: any;
}
export interface ojSlider extends editableValue<number | null, ojSliderSettableProperties> {
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    max: number | null;
    min: number | null;
    orientation: 'horizontal' | 'vertical';
    step: number | null;
    readonly transientValue: number;
    type: 'fromMin' | 'fromMax' | 'single';
    value: number | null;
    translations: {
        invalidStep?: string;
        maxMin?: string;
        noValue?: string;
        optionNum?: string;
        valueRange?: string;
    };
    addEventListener<T extends keyof ojSliderEventMap>(type: T, listener: (this: HTMLElement, ev: ojSliderEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojSliderSettableProperties>(property: T): ojSlider[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSliderSettableProperties>(property: T, value: ojSliderSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSliderSettableProperties>): void;
    setProperties(properties: ojSliderSettablePropertiesLenient): void;
}
export namespace ojSlider {
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
    type displayOptionsChanged = JetElementCustomEvent<ojSlider["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojSlider["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojSlider["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojSlider["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojSlider["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepChanged = JetElementCustomEvent<ojSlider["step"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojSlider["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged = JetElementCustomEvent<ojSlider["type"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojSlider["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = editableValue.disabledChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<number | null, ojSliderSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojSliderEventMap extends editableValueEventMap<number | null, ojSliderSettableProperties> {
    'ojAnimateEnd': ojSlider.ojAnimateEnd;
    'ojAnimateStart': ojSlider.ojAnimateStart;
    'displayOptionsChanged': JetElementCustomEvent<ojSlider["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojSlider["labelledBy"]>;
    'maxChanged': JetElementCustomEvent<ojSlider["max"]>;
    'minChanged': JetElementCustomEvent<ojSlider["min"]>;
    'orientationChanged': JetElementCustomEvent<ojSlider["orientation"]>;
    'stepChanged': JetElementCustomEvent<ojSlider["step"]>;
    'transientValueChanged': JetElementCustomEvent<ojSlider["transientValue"]>;
    'typeChanged': JetElementCustomEvent<ojSlider["type"]>;
    'valueChanged': JetElementCustomEvent<ojSlider["value"]>;
    'describedByChanged': JetElementCustomEvent<ojSlider["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojSlider["disabled"]>;
    'helpChanged': JetElementCustomEvent<ojSlider["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojSlider["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojSlider["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojSlider["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojSlider["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojSlider["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojSlider["valid"]>;
}
export interface ojSliderSettableProperties extends editableValueSettableProperties<number | null> {
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelledBy: string | null;
    max: number | null;
    min: number | null;
    orientation: 'horizontal' | 'vertical';
    step: number | null;
    readonly transientValue: number;
    type: 'fromMin' | 'fromMax' | 'single';
    value: number | null;
    translations: {
        invalidStep?: string;
        maxMin?: string;
        noValue?: string;
        optionNum?: string;
        valueRange?: string;
    };
}
export interface ojSliderSettablePropertiesLenient extends Partial<ojSliderSettableProperties> {
    [key: string]: any;
}
export type RangeSliderElement = ojRangeSlider;
export type SliderElement = ojSlider;
export namespace RangeSliderElement {
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
    type disabledChanged = JetElementCustomEvent<ojRangeSlider["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojRangeSlider["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojRangeSlider["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojRangeSlider["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojRangeSlider["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojRangeSlider["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepChanged = JetElementCustomEvent<ojRangeSlider["step"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojRangeSlider["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojRangeSlider["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<Object | null, ojRangeSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<Object | null, ojRangeSliderSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export namespace SliderElement {
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
    type displayOptionsChanged = JetElementCustomEvent<ojSlider["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojSlider["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojSlider["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojSlider["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojSlider["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepChanged = JetElementCustomEvent<ojSlider["step"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojSlider["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged = JetElementCustomEvent<ojSlider["type"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojSlider["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = editableValue.disabledChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<number | null, ojSliderSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<number | null, ojSliderSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface RangeSliderIntrinsicProps extends Partial<Readonly<ojRangeSliderSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojRangeSliderEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojRangeSliderEventMap['ojAnimateStart']) => void;
    ondisabledChanged?: (value: ojRangeSliderEventMap['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojRangeSliderEventMap['displayOptionsChanged']) => void;
    onlabelledByChanged?: (value: ojRangeSliderEventMap['labelledByChanged']) => void;
    onmaxChanged?: (value: ojRangeSliderEventMap['maxChanged']) => void;
    onminChanged?: (value: ojRangeSliderEventMap['minChanged']) => void;
    onorientationChanged?: (value: ojRangeSliderEventMap['orientationChanged']) => void;
    onstepChanged?: (value: ojRangeSliderEventMap['stepChanged']) => void;
    ontransientValueChanged?: (value: ojRangeSliderEventMap['transientValueChanged']) => void;
    onvalueChanged?: (value: ojRangeSliderEventMap['valueChanged']) => void;
    ondescribedByChanged?: (value: ojRangeSliderEventMap['describedByChanged']) => void;
    onhelpChanged?: (value: ojRangeSliderEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojRangeSliderEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojRangeSliderEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojRangeSliderEventMap['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojRangeSliderEventMap['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojRangeSliderEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojRangeSliderEventMap['validChanged']) => void;
    children?: ComponentChildren;
}
export interface SliderIntrinsicProps extends Partial<Readonly<ojSliderSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojSliderEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojSliderEventMap['ojAnimateStart']) => void;
    ondisplayOptionsChanged?: (value: ojSliderEventMap['displayOptionsChanged']) => void;
    onlabelledByChanged?: (value: ojSliderEventMap['labelledByChanged']) => void;
    onmaxChanged?: (value: ojSliderEventMap['maxChanged']) => void;
    onminChanged?: (value: ojSliderEventMap['minChanged']) => void;
    onorientationChanged?: (value: ojSliderEventMap['orientationChanged']) => void;
    onstepChanged?: (value: ojSliderEventMap['stepChanged']) => void;
    ontransientValueChanged?: (value: ojSliderEventMap['transientValueChanged']) => void;
    ontypeChanged?: (value: ojSliderEventMap['typeChanged']) => void;
    onvalueChanged?: (value: ojSliderEventMap['valueChanged']) => void;
    ondescribedByChanged?: (value: ojSliderEventMap['describedByChanged']) => void;
    ondisabledChanged?: (value: ojSliderEventMap['disabledChanged']) => void;
    onhelpChanged?: (value: ojSliderEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojSliderEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojSliderEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojSliderEventMap['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojSliderEventMap['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojSliderEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojSliderEventMap['validChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-range-slider": RangeSliderIntrinsicProps;
            "oj-slider": SliderIntrinsicProps;
        }
    }
}
