/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojRangeSlider extends editableValue<Object | null, ojRangeSliderSettableProperties> {
    disabled: boolean;
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
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
        startEnd?: string;
    };
    addEventListener<T extends keyof ojRangeSliderEventMap>(type: T, listener: (this: HTMLElement, ev: ojRangeSliderEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
}
export interface ojRangeSliderSettableProperties extends editableValueSettableProperties<Object | null> {
    disabled: boolean;
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
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
        startEnd?: string;
    };
}
export interface ojRangeSliderSettablePropertiesLenient extends Partial<ojRangeSliderSettableProperties> {
    [key: string]: any;
}
export interface ojSlider extends editableValue<number | null, ojSliderSettableProperties> {
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
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
    addEventListener<T extends keyof ojSliderEventMap>(type: T, listener: (this: HTMLElement, ev: ojSliderEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
}
export interface ojSliderSettableProperties extends editableValueSettableProperties<number | null> {
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
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
