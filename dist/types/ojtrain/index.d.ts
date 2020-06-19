/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojTrain extends baseComponent<ojTrainSettableProperties> {
    selectedStep: string;
    steps: ojTrain.Step[];
    addEventListener<T extends keyof ojTrainEventMap>(type: T, listener: (this: HTMLElement, ev: ojTrainEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojTrainSettableProperties>(property: T): ojTrain[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTrainSettableProperties>(property: T, value: ojTrainSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTrainSettableProperties>): void;
    setProperties(properties: ojTrainSettablePropertiesLenient): void;
    getNextSelectableStep(): string | null;
    getPreviousSelectableStep(): string | null;
    getStep(id: string): ojTrain.Step | null;
    refresh(): void;
    updateStep(id: string, stepProperties: {
        id?: string;
        label?: string;
        disabled?: boolean;
        visited?: boolean;
        messageType?: 'info' | 'error' | 'fatal' | 'warning' | 'confirmation';
    }): void;
}
export namespace ojTrain {
    interface ojBeforeDeselect extends CustomEvent<{
        toStep: string;
        fromStep: string;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeSelect extends CustomEvent<{
        toStep: string;
        fromStep: string;
        [propName: string]: any;
    }> {
    }
    interface ojDeselect extends CustomEvent<{
        toStep: string;
        fromStep: string;
        [propName: string]: any;
    }> {
    }
    interface ojSelect extends CustomEvent<{
        toStep: string;
        fromStep: string;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type selectedStepChanged = JetElementCustomEvent<ojTrain["selectedStep"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepsChanged = JetElementCustomEvent<ojTrain["steps"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Step = {
        id: string;
        label: string;
        disabled?: boolean;
        visited?: boolean;
        messageType?: 'info' | 'error' | 'fatal' | 'warning' | 'confirmation';
    };
}
export interface ojTrainEventMap extends baseComponentEventMap<ojTrainSettableProperties> {
    'ojBeforeDeselect': ojTrain.ojBeforeDeselect;
    'ojBeforeSelect': ojTrain.ojBeforeSelect;
    'ojDeselect': ojTrain.ojDeselect;
    'ojSelect': ojTrain.ojSelect;
    'selectedStepChanged': JetElementCustomEvent<ojTrain["selectedStep"]>;
    'stepsChanged': JetElementCustomEvent<ojTrain["steps"]>;
}
export interface ojTrainSettableProperties extends baseComponentSettableProperties {
    selectedStep: string;
    steps: ojTrain.Step[];
}
export interface ojTrainSettablePropertiesLenient extends Partial<ojTrainSettableProperties> {
    [key: string]: any;
}
