import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojTrain extends baseComponent<ojTrainSettableProperties> {
    selectedStep: string;
    steps: ojTrain.Step[];
    translations: {
        stepCurrent?: string;
        stepDisabled?: string;
        stepInfo?: string;
        stepMessageConfirmation?: string;
        stepMessageError?: string;
        stepMessageInfo?: string;
        stepMessageType?: string;
        stepMessageWarning?: string;
        stepNotVisited?: string;
        stepStatus?: string;
        stepVisited?: string;
    };
    addEventListener<T extends keyof ojTrainEventMap>(type: T, listener: (this: HTMLElement, ev: ojTrainEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
        messageType?: 'info' | 'error' | 'fatal' | 'warning' | 'confirmation' | null;
    }): void;
}
export namespace ojTrain {
    interface ojBeforeDeselect extends CustomEvent<{
        fromStep: Step;
        toStep: Step;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeSelect extends CustomEvent<{
        fromStep: Step;
        toStep: Step;
        [propName: string]: any;
    }> {
    }
    interface ojDeselect extends CustomEvent<{
        fromStep: Step;
        toStep: Step;
        [propName: string]: any;
    }> {
    }
    interface ojSelect extends CustomEvent<{
        fromStep: Step;
        toStep: Step;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type selectedStepChanged = JetElementCustomEvent<ojTrain["selectedStep"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepsChanged = JetElementCustomEvent<ojTrain["steps"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Step = {
        disabled?: boolean;
        id: string;
        label: string;
        messageType?: 'info' | 'error' | 'fatal' | 'warning' | 'confirmation' | null;
        visited?: boolean;
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
    translations: {
        stepCurrent?: string;
        stepDisabled?: string;
        stepInfo?: string;
        stepMessageConfirmation?: string;
        stepMessageError?: string;
        stepMessageInfo?: string;
        stepMessageType?: string;
        stepMessageWarning?: string;
        stepNotVisited?: string;
        stepStatus?: string;
        stepVisited?: string;
    };
}
export interface ojTrainSettablePropertiesLenient extends Partial<ojTrainSettableProperties> {
    [key: string]: any;
}
export type TrainElement = ojTrain;
export namespace TrainElement {
    interface ojBeforeDeselect extends CustomEvent<{
        fromStep: ojTrain.Step;
        toStep: ojTrain.Step;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeSelect extends CustomEvent<{
        fromStep: ojTrain.Step;
        toStep: ojTrain.Step;
        [propName: string]: any;
    }> {
    }
    interface ojDeselect extends CustomEvent<{
        fromStep: ojTrain.Step;
        toStep: ojTrain.Step;
        [propName: string]: any;
    }> {
    }
    interface ojSelect extends CustomEvent<{
        fromStep: ojTrain.Step;
        toStep: ojTrain.Step;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type selectedStepChanged = JetElementCustomEvent<ojTrain["selectedStep"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepsChanged = JetElementCustomEvent<ojTrain["steps"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Step = {
        disabled?: boolean;
        id: string;
        label: string;
        messageType?: 'info' | 'error' | 'fatal' | 'warning' | 'confirmation' | null;
        visited?: boolean;
    };
}
export interface TrainIntrinsicProps extends Partial<Readonly<ojTrainSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojBeforeDeselect?: (value: ojTrainEventMap['ojBeforeDeselect']) => void;
    onojBeforeSelect?: (value: ojTrainEventMap['ojBeforeSelect']) => void;
    onojDeselect?: (value: ojTrainEventMap['ojDeselect']) => void;
    onojSelect?: (value: ojTrainEventMap['ojSelect']) => void;
    onselectedStepChanged?: (value: ojTrainEventMap['selectedStepChanged']) => void;
    onstepsChanged?: (value: ojTrainEventMap['stepsChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-train": TrainIntrinsicProps;
        }
    }
}
