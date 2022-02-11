import { ComponentChildren } from "preact"
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { Action, CancelableAction, ExtendGlobalProps, ObservedGlobalProps, Slot } from 'ojs/ojvcomponent';
import { h, Component } from 'preact';
import { ojMessage } from 'ojs/ojmessage';
import 'jqueryui-amd/tabbable';
declare type Props = ObservedGlobalProps<'aria-label' | 'role'> & {
    accept?: string[] | null;
    capture?: 'user' | 'environment' | 'implementation' | 'none' | null;
    disabled?: boolean;
    primaryText?: string | (() => string);
    secondaryText?: string | ((fileOptions: {
        selectionMode: 'multiple' | 'single';
    }) => string);
    selectOn?: 'auto' | 'click' | 'clickAndDrop' | 'drop';
    selectionMode?: 'multiple' | 'single';
    trigger?: Slot;
    onOjBeforeSelect?: CancelableAction<BeforeDetail>;
    onOjInvalidSelect?: Action<InvalidDetail>;
    onOjSelect?: Action<SelectDetail>;
};
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
export declare class FilePicker extends Component<ExtendGlobalProps<Props>, State> {
    private inDropZone;
    private isDroppable;
    private dragPromiseResolver;
    private elementPromiseResolver;
    private selecting;
    private readonly rootRef;
    static defaultProps: {
        accept: any;
        capture: string;
        disabled: boolean;
        selectOn: string;
        selectionMode: string;
    };
    constructor(props: ExtendGlobalProps<Props>);
    private _doSelectHelper;
    private readonly _handleSelectingFiles;
    private readonly _handleFileSelected;
    private _fileSelectedHelper;
    private readonly _handleDragEnter;
    private readonly _handleDragOver;
    private readonly _handleDragLeave;
    private readonly _handleFileDrop;
    private readonly _handleFocusIn;
    private readonly _handleFocusOut;
    focus(): void;
    blur(): void;
    private _handleFocus;
    private _handleBlur;
    render(props: ExtendGlobalProps<Props>): h.JSX.Element;
    private _renderDisabled;
    private _renderWithCustomTrigger;
    private _renderWithDefaultTrigger;
    private _renderDefaultTriggerContent;
    private _getRole;
    private _getAriaLabel;
    private _getPrimaryText;
    private _getSecondaryText;
    private _getDndHandlers;
    private _getFocusClass;
    private _validateSelectionMode;
    private _validateTypes;
    private _getMimeTypeValidationMessages;
    private _acceptFile;
    private _handleFilesAdded;
    private _fireInvalidSelectAction;
    private _createFileList;
}
// Custom Element interfaces
export interface FilePickerElement extends JetElement<FilePickerElementSettableProperties>, FilePickerElementSettableProperties {
  addEventListener<T extends keyof FilePickerElementEventMap>(type: T, listener: (this: HTMLElement, ev: FilePickerElementEventMap[T]) => any, options?: (boolean|AddEventListenerOptions)): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean|AddEventListenerOptions)): void;
  getProperty<T extends keyof FilePickerElementSettableProperties>(property: T): FilePickerElement[T];
  getProperty(property: string): any;
  setProperty<T extends keyof FilePickerElementSettableProperties>(property: T, value: FilePickerElementSettableProperties[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, FilePickerElementSettableProperties>): void;
  setProperties(properties: FilePickerElementSettablePropertiesLenient): void;
  _doSelectHelper: FilePicker['_doSelectHelper'];
  blur: FilePicker['blur'];
  focus: FilePicker['focus'];
}
export namespace FilePickerElement {
  interface ojBeforeSelect extends CustomEvent<BeforeDetail & {
    accept: (param: Promise<void>) => void;
  }>{}
  interface ojInvalidSelect extends CustomEvent<InvalidDetail & {
  }>{}
  interface ojSelect extends CustomEvent<SelectDetail & {
  }>{}
  // tslint:disable-next-line interface-over-type-literal
  type acceptChanged = JetElementCustomEventStrict<FilePickerElement["accept"]>;
  // tslint:disable-next-line interface-over-type-literal
  type captureChanged = JetElementCustomEventStrict<FilePickerElement["capture"]>;
  // tslint:disable-next-line interface-over-type-literal
  type disabledChanged = JetElementCustomEventStrict<FilePickerElement["disabled"]>;
  // tslint:disable-next-line interface-over-type-literal
  type primaryTextChanged = JetElementCustomEventStrict<FilePickerElement["primaryText"]>;
  // tslint:disable-next-line interface-over-type-literal
  type secondaryTextChanged = JetElementCustomEventStrict<FilePickerElement["secondaryText"]>;
  // tslint:disable-next-line interface-over-type-literal
  type selectOnChanged = JetElementCustomEventStrict<FilePickerElement["selectOn"]>;
  // tslint:disable-next-line interface-over-type-literal
  type selectionModeChanged = JetElementCustomEventStrict<FilePickerElement["selectionMode"]>;
}
export interface FilePickerElementEventMap extends HTMLElementEventMap {
  'ojBeforeSelect': FilePickerElement.ojBeforeSelect
  'ojInvalidSelect': FilePickerElement.ojInvalidSelect
  'ojSelect': FilePickerElement.ojSelect
  'acceptChanged': JetElementCustomEventStrict<FilePickerElement["accept"]>;
  'captureChanged': JetElementCustomEventStrict<FilePickerElement["capture"]>;
  'disabledChanged': JetElementCustomEventStrict<FilePickerElement["disabled"]>;
  'primaryTextChanged': JetElementCustomEventStrict<FilePickerElement["primaryText"]>;
  'secondaryTextChanged': JetElementCustomEventStrict<FilePickerElement["secondaryText"]>;
  'selectOnChanged': JetElementCustomEventStrict<FilePickerElement["selectOn"]>;
  'selectionModeChanged': JetElementCustomEventStrict<FilePickerElement["selectionMode"]>;
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
  * The primary text for the default file picker.
  */
  primaryText?: Props['primaryText'];
  /**
  * The secondary text for the default file picker.
  */
  secondaryText?: Props['secondaryText'];
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
export type ojFilePicker = FilePickerElement;
export namespace ojFilePicker {
  interface ojBeforeSelect extends CustomEvent<BeforeDetail & {
    accept: (param: Promise<void>) => void;
  }>{}
  interface ojInvalidSelect extends CustomEvent<InvalidDetail & {
  }>{}
  interface ojSelect extends CustomEvent<SelectDetail & {
  }>{}
  // tslint:disable-next-line interface-over-type-literal
  type acceptChanged = JetElementCustomEventStrict<ojFilePicker["accept"]>;
  // tslint:disable-next-line interface-over-type-literal
  type captureChanged = JetElementCustomEventStrict<ojFilePicker["capture"]>;
  // tslint:disable-next-line interface-over-type-literal
  type disabledChanged = JetElementCustomEventStrict<ojFilePicker["disabled"]>;
  // tslint:disable-next-line interface-over-type-literal
  type primaryTextChanged = JetElementCustomEventStrict<ojFilePicker["primaryText"]>;
  // tslint:disable-next-line interface-over-type-literal
  type secondaryTextChanged = JetElementCustomEventStrict<ojFilePicker["secondaryText"]>;
  // tslint:disable-next-line interface-over-type-literal
  type selectOnChanged = JetElementCustomEventStrict<ojFilePicker["selectOn"]>;
  // tslint:disable-next-line interface-over-type-literal
  type selectionModeChanged = JetElementCustomEventStrict<ojFilePicker["selectionMode"]>;
}
export type ojFilePickerEventMap = FilePickerElementEventMap;
export type ojFilePickerSettableProperties = FilePickerElementSettableProperties;
export type ojFilePickerSettablePropertiesLenient = FilePickerElementSettablePropertiesLenient;
export interface FilePickerIntrinsicProps extends Partial<Readonly<FilePickerElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
  children?: ComponentChildren;
  onojBeforeSelect?: (value: FilePickerElementEventMap['ojBeforeSelect']) => void;
  onojInvalidSelect?: (value: FilePickerElementEventMap['ojInvalidSelect']) => void;
  onojSelect?: (value: FilePickerElementEventMap['ojSelect']) => void;
  onacceptChanged?: (value: FilePickerElementEventMap['acceptChanged']) => void;
  oncaptureChanged?: (value: FilePickerElementEventMap['captureChanged']) => void;
  ondisabledChanged?: (value: FilePickerElementEventMap['disabledChanged']) => void;
  onprimaryTextChanged?: (value: FilePickerElementEventMap['primaryTextChanged']) => void;
  onsecondaryTextChanged?: (value: FilePickerElementEventMap['secondaryTextChanged']) => void;
  onselectOnChanged?: (value: FilePickerElementEventMap['selectOnChanged']) => void;
  onselectionModeChanged?: (value: FilePickerElementEventMap['selectionModeChanged']) => void;
}
declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "oj-file-picker": FilePickerIntrinsicProps;
    }
  }
}
