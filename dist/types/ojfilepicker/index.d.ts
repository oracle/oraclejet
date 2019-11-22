import { ojMessage } from '../ojmessage';
import { ProgressItem } from '../ojprogresslist';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface FileUploadTransport {
    flush(): void;
    queue(fileList: FileList): ProgressItem[];
}
export interface ojFilePicker extends JetElement<ojFilePickerSettableProperties> {
    accept: string[] | null;
    disabled: boolean;
    selectOn: 'auto' | 'click' | 'drop' | 'clickAndDrop';
    selectionMode: 'multiple' | 'single';
    addEventListener<T extends keyof ojFilePickerEventMap>(type: T, listener: (this: HTMLElement, ev: ojFilePickerEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojFilePickerSettableProperties>(property: T): ojFilePicker[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojFilePickerSettableProperties>(property: T, value: ojFilePickerSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojFilePickerSettableProperties>): void;
    setProperties(properties: ojFilePickerSettablePropertiesLenient): void;
}
export namespace ojFilePicker {
    interface ojBeforeSelect extends CustomEvent<{
        files: FileList;
        accept: (acceptPromise: Promise<void>) => void;
        [propName: string]: any;
    }> {
    }
    interface ojInvalidSelect extends CustomEvent<{
        messages: ojMessage.Message[];
        until: Promise<void> | null;
        [propName: string]: any;
    }> {
    }
    interface ojSelect extends CustomEvent<{
        files: FileList;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type acceptChanged = JetElementCustomEvent<ojFilePicker["accept"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojFilePicker["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectOnChanged = JetElementCustomEvent<ojFilePicker["selectOn"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged = JetElementCustomEvent<ojFilePicker["selectionMode"]>;
}
export interface ojFilePickerEventMap extends HTMLElementEventMap {
    'ojBeforeSelect': ojFilePicker.ojBeforeSelect;
    'ojInvalidSelect': ojFilePicker.ojInvalidSelect;
    'ojSelect': ojFilePicker.ojSelect;
    'acceptChanged': JetElementCustomEvent<ojFilePicker["accept"]>;
    'disabledChanged': JetElementCustomEvent<ojFilePicker["disabled"]>;
    'selectOnChanged': JetElementCustomEvent<ojFilePicker["selectOn"]>;
    'selectionModeChanged': JetElementCustomEvent<ojFilePicker["selectionMode"]>;
}
export interface ojFilePickerSettableProperties extends JetSettableProperties {
    accept: string[] | null;
    disabled: boolean;
    selectOn: 'auto' | 'click' | 'drop' | 'clickAndDrop';
    selectionMode: 'multiple' | 'single';
}
export interface ojFilePickerSettablePropertiesLenient extends Partial<ojFilePickerSettableProperties> {
    [key: string]: any;
}
