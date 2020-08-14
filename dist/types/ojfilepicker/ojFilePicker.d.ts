/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from 'ojs/index';
import { GlobalAttributes } from 'ojs/oj-jsx-interfaces';
import { VComponent } from 'ojs/ojvcomponent';
import { ojMessage } from 'ojs/ojmessage';
declare class Props {
    accept?: string[] | null;
    capture?: 'environment' | 'implementation' | 'user' | null;
    disabled?: boolean;
    selectOn?: 'auto' | 'click' | 'clickAndDrop' | 'drop';
    selectionMode?: 'multiple' | 'single';
    trigger?: VComponent.Slot;
    onOjBeforeSelect?: VComponent.CancelableAction<BeforeDetail>;
    onOjInvalidSelect?: VComponent.Action<InvalidDetail>;
    onOjSelect?: VComponent.Action<SelectDetail>;
}
declare type State = {
    focus: boolean;
    validity: string;
};
declare type BeforeDetail = {
    files: FileList;
    originalEvent: Event;
};
declare type InvalidDetail = {
    messages: ojMessage.Message[];
    originalEvent: Event;
    until: Promise<void> | null;
};
declare type SelectDetail = {
    files: FileList;
    originalEvent: Event;
};
export declare class FilePicker extends VComponent<Props, State> {
    private inDropZone;
    private isDroppable;
    private dragPromiseResolver;
    private selecting;
    private inputElem;
    private rootElem;
    private readonly inputElemRef;
    private readonly rootElemRef;
    constructor(props: Readonly<Props>);
    private _handleSelectingFiles;
    private _handleFileSelected;
    private _handleDragEnter;
    private _handleDragOver;
    private _handleDragLeave;
    private _handleFileDrop;
    private _handleFocusIn;
    private _handleFocusOut;
    protected render(): any;
    private _renderDisabled;
    private _renderWithCustomTrigger;
    private _renderWithDefaultTrigger;
    private _renderDefaultTriggerContent;
    private _renderInputElement;
    private _getDndHandlers;
    private _getFocusClass;
    private _validateSelectionMode;
    private _validateTypes;
    private _getMimeTypeValidationMessages;
    private _acceptFile;
    private _handleFilesAdded;
    private _fireInvalidSelectAction;
    private _createFileList;
    protected _vprops?: VProps;
}
// Custom Element interfaces
export interface FilePickerElement extends JetElement<FilePickerElementSettableProperties> {
  /**
   * An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, accept all file types
   */
  accept?: Props['accept'];
  /**
   * Specifies the preferred facing mode for the device's media capture mechanism.
   */
  capture?: Props['capture'];
  /**
   * Disables the filepicker if set to true
   */
  disabled?: Props['disabled'];
  /**
   * The type of event to select the files.
   */
  selectOn?: Props['selectOn'];
  /**
   * Whether to allow single or multiple file selection.
   */
  selectionMode?: Props['selectionMode'];
  addEventListener<T extends keyof FilePickerElementEventMap>(type: T, listener: (this: HTMLElement, ev: FilePickerElementEventMap[T]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  getProperty<T extends keyof FilePickerElementSettableProperties>(property: T): FilePickerElement[T];
  getProperty(property: string): any;
  setProperty<T extends keyof FilePickerElementSettableProperties>(property: T, value: FilePickerElementSettableProperties[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, FilePickerElementSettableProperties>): void;
  setProperties(properties: FilePickerElementSettablePropertiesLenient): void;
}
export namespace FilePickerElement {
  interface ojBeforeSelect extends CustomEvent<BeforeDetail & {
    [propName: string]: any;
  }>{}
  interface ojInvalidSelect extends CustomEvent<InvalidDetail & {
    [propName: string]: any;
  }>{}
  interface ojSelect extends CustomEvent<SelectDetail & {
    [propName: string]: any;
  }>{}
  // tslint:disable-next-line interface-over-type-literal
  type acceptChanged = JetElementCustomEvent<FilePickerElement["accept"]>;
  // tslint:disable-next-line interface-over-type-literal
  type captureChanged = JetElementCustomEvent<FilePickerElement["capture"]>;
  // tslint:disable-next-line interface-over-type-literal
  type disabledChanged = JetElementCustomEvent<FilePickerElement["disabled"]>;
  // tslint:disable-next-line interface-over-type-literal
  type selectOnChanged = JetElementCustomEvent<FilePickerElement["selectOn"]>;
  // tslint:disable-next-line interface-over-type-literal
  type selectionModeChanged = JetElementCustomEvent<FilePickerElement["selectionMode"]>;
}
export interface FilePickerElementEventMap extends HTMLElementEventMap {
  'ojBeforeSelect': FilePickerElement.ojBeforeSelect
  'ojInvalidSelect': FilePickerElement.ojInvalidSelect
  'ojSelect': FilePickerElement.ojSelect
  'acceptChanged': JetElementCustomEvent<FilePickerElement["accept"]>;
  'captureChanged': JetElementCustomEvent<FilePickerElement["capture"]>;
  'disabledChanged': JetElementCustomEvent<FilePickerElement["disabled"]>;
  'selectOnChanged': JetElementCustomEvent<FilePickerElement["selectOn"]>;
  'selectionModeChanged': JetElementCustomEvent<FilePickerElement["selectionMode"]>;
}
export interface FilePickerElementSettableProperties extends JetSettableProperties {
  /**
   * An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, accept all file types
   */
  accept?: Props['accept'];
  /**
   * Specifies the preferred facing mode for the device's media capture mechanism.
   */
  capture?: Props['capture'];
  /**
   * Disables the filepicker if set to true
   */
  disabled?: Props['disabled'];
  /**
   * The type of event to select the files.
   */
  selectOn?: Props['selectOn'];
  /**
   * Whether to allow single or multiple file selection.
   */
  selectionMode?: Props['selectionMode'];
}
export interface FilePickerElementSettablePropertiesLenient extends Partial<FilePickerElementSettableProperties> {
  [key: string]: any;
}
export declare type ojFilePicker = FilePickerElement;
export declare type ojFilePickerEventMap = FilePickerElementEventMap;
export declare type ojFilePickerSettableProperties = FilePickerElementSettableProperties;
export declare type ojFilePickerSettablePropertiesLenient = FilePickerElementSettablePropertiesLenient;
export interface FilePickerProperties extends Partial<FilePickerElementSettableProperties>, GlobalAttributes {}
export interface VProps extends Props, GlobalAttributes {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-file-picker": FilePickerProperties;
    }
  }
}
