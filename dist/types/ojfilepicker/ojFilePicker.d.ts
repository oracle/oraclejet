import { Action, CancelableAction, ExtendGlobalProps, ObservedGlobalProps, Slot } from 'ojs/ojvcomponent';
import { Component } from 'preact';
import { ojMessage } from 'ojs/ojmessage';
import 'jqueryui-amd/tabbable';
type Props = ObservedGlobalProps<'aria-label' | 'role'> & {
    /**
     * @description
     * An array of strings of allowed MIME types or file extensions that can be uploaded; this is unlike the accept attribute of the html &lt;input> element that accepts a simple comma-delimited string. If not specified, accept all file types.
     *
     * <p>Note: If accept is specified, files with empty string type will be rejected if no match found in the "accept" value. Due to browser/OS differences, you may have to specify multiple values for the same value type. For example, for a CSV file, you might need to specify 'text/csv', '.csv', 'application/vnd.ms-excel', 'text/comma-separated-values' and others depending on your target browser/OS.</p>
     *
     * @ojmetadata description "An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, accept all file types"
     * @ojmetadata displayName "Accept"
     * @ojmetadata help "#accept"
     */
    accept?: string[] | null;
    /**
     * @description
     * Specifies the preferred facing mode for the device's
     * <a href="https://www.w3.org/TR/html-media-capture/#dom-htmlinputelement-capture">media capture</a> mechanism;
     * This is most often used to provide direct camera access on mobile devices.  Note that the accept attribute must
     * be specified and have an associated capture control type (e.g.["image/*"]) for the capture attribute to take effect.  Support may vary by browser.
     *
     * @ojmetadata description "Specifies the preferred facing mode for the device's media capture mechanism."
     * @ojmetadata displayName "Capture"
     * @ojmetadata help "#capture"
     * @ojmetadata propertyEditorValues {
     *     "user": {
     *       "description": "Specifies user-facing as the preferred mode",
     *       "displayName": "User"
     *     },
     *      "environment": {
     *       "description": "Specifies environment-facing as the preferred mode",
     *       "displayName": "Environment"
     *     },
     *     "implementation": {
     *       "description": "Specifies an implementation-specific default as the preferred facing mode",
     *       "displayName": "Implementation"
     *     },
     *    "none": {
     *       "description": "No capture mechanism is used",
     *       "displayName": "None"
     *     }
     *   }
     */
    capture?: 'user' | 'environment' | 'implementation' | 'none' | null;
    /**
     * @description
     * Disables the filepicker if set to <code class="prettyprint">true</code>.
     *
     * @ojmetadata description "Disables the filepicker if set to true"
     * @ojmetadata displayName "Disabled"
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
    /**
     * @description
     * The primary text for the default file picker.  It is either a string or a formatting function that returns the string to be displayed.
     * @ojmetadata description "The primary text for the default file picker."
     * @ojmetadata displayName "Primary Text"
     * @ojmetadata help "#primaryText"
     */
    primaryText?: string | (() => string);
    /**
     * @description
     * The secondary text for the default file picker.  It is either a string or a formatting function that returns the string to be displayed.
     * The formatting function takes in a property object that contains the selection mode of the filepicker.
     * @ojmetadata description "The secondary text for the default file picker."
     * @ojmetadata displayName "Secondary Text"
     * @ojmetadata help "#secondaryText"
     */
    secondaryText?: string | ((fileOptions: {
        selectionMode: 'multiple' | 'single';
    }) => string);
    /**
     * @ojmetadata description "The type of event to select the files."
     * @deprecated
     * @ojmetadata status [{"type": "deprecated", "since": "13.1.0", "description": "Main use case was to turn off drag and drop for button filepicker.  The current recommendation for that use case is to use ojfilepickerutils with an oj-button."}]
     * @ojmetadata displayName "Select On"
     * @ojmetadata help "#selectOn"
     * @ojmetadata propertyEditorValues {
     *     "auto": {
     *       "description": "either click or drag and drop to select the files",
     *       "displayName": "Auto"
     *     },
     *     "click": {
     *       "description": "click to select the files",
     *       "displayName": "Click"
     *     },
     *     "clickAndDrop": {
     *       "description": "either click or drag and drop to select the files",
     *       "displayName": "Click And Drop"
     *     },
     *     "drop": {
     *       "description": "drag and drop the files",
     *       "displayName": "Drop"
     *     }
     *   }
     */
    selectOn?: 'auto' | 'click' | 'clickAndDrop' | 'drop';
    /**
     * @ojmetadata description "Whether to allow single or multiple file selection."
     * @ojmetadata displayName "Selection Mode"
     * @ojmetadata help "#selectionMode"
     * @ojmetadata propertyEditorValues {
     *     "multiple": {
     *       "description": "multiple file selection",
     *       "displayName": "Multiple"
     *     },
     *     "single": {
     *       "description": "single file selection",
     *       "displayName": "Single"
     *     }
     *   }
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @description
     * <p>The <code class="prettyprint">trigger</code> slot is used to replace the default content of the file picker.
     * File picker will add click and drag and drop listeners to the slot content.
     * The application is responsible for setting the tabindex attribute for keyboard accessibility.</p>
     *
     * @ojmetadata description "The trigger slot is used to replace the default content of the file picker."
     * @ojmetadata help "#trigger"
     */
    trigger?: Slot;
    /**
     * @description
     * Triggered before files are selected to allow for custom validation.  To reject the selected files, the application can either call event.preventDefault() or pass a rejected Promise to the accept detail property. The latter approach is recommended because this allows the application to send a message stating why the files were rejected.
     *
     * @ojmetadata description "Triggered before files are selected to allow for custom validation"
     * @ojmetadata help "#event:beforeSelect"
     */
    onOjBeforeSelect?: CancelableAction<BeforeDetail>;
    /**
     * @description
     * Triggered when invalid files are selected.  This event provides the application with a list of messages that should be displayed to give the user feedback about the
     * problems with their selection.  This feedback can be safely cleared when a subsequent ojBeforeSelect, ojInvalidSelect, or ojSelect event is received.  Additionally the
     * event.detail.until property may be populated with a Promise to provide short-term feedback during a user interaction (typically drag and drop); the feedback should be cleared upon resolution
     * of this Promise.
     *
     * @ojmetadata description "Triggered when invalid files are selected"
     * @ojmetadata help "#event:invalidSelect"
     */
    onOjInvalidSelect?: Action<InvalidDetail>;
    /**
     * @ojmetadata description "Triggered after the files are selected"
     * @ojmetadata help "#event:select"
     */
    onOjSelect?: Action<SelectDetail>;
};
type State = {
    focus: boolean;
    validity: string;
};
type BeforeDetail = {
    /**
     * @ojmetadata description "The selected files"
     */
    files: FileList;
    /**
     * @ignore
     */
    originalEvent: Event;
};
type InvalidDetail = {
    /**
     * @ojmetadata description "Messages that should be displayed to the user (e.g. in an oj-messages component) describing invalid files."
     */
    messages: ojMessage.Message[];
    /**
     * @ignore
     */
    originalEvent: Event;
    /**
     * @ojmetadata description "This property may be populated with a Promise to provide short-term feedback during a user interaction (typically drag and drop); the feedback should be cleared upon the resolution of this Promise."
     */
    until: Promise<void> | null;
};
type SelectDetail = {
    /**
     * @ojmetadata description "The files that were just selected."
     */
    files: FileList;
    /**
     * @ignore
     */
    originalEvent: Event;
};
/**
 * @classdesc
 * <h3 id="filePickerOverview-section">
 *   JET FilePicker
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#filePickerOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>By default the file picker shows a clickable dropzone for selecting files for upload. However, it can be replaced with any clickable element like a button. After the files are selected, the FilePicker fires a "select" event with the selected files. Application has to specify the listener in order to do the actual upload.  The types of files accepted are controlled by the accept attribute.  Additional custom validation can be done through the ojBeforeSelect event.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-file-picker on-oj-select='[[listener]]' accept='["image/*", "video/*"]'>
 * &lt;/oj-file-picker>
 * </code>
 * </pre>
 *
 * <h3 id="migration-section">
 *  Migration
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 * To migrate from oj-file-picker to oj-c-file-picker, you need to revise the import statement and references to oj-file-picker in your app. Please note the changes between the two components below.
 * <h5>Role attribute</h5>
 * <p>If aria-label is set on the component, the role attribute will be set internally.  The application should no longer populate the role attribute.</p>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Clickable element</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Launch the browser's file picker.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Clickable element</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Launch the browser's file picker.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojmetadata description "A file picker displays a clickable dropzone for selecting files from the device storage."
 * @ojmetadata displayName "File Picker"
 * @ojmetadata ojLegacyVComponent "ojFilePicker"
 * @ojmetadata main "ojs/ojfilepicker"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "15.0.0",
 *     "value": ["oj-c-file-picker"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "vbdt": {
 *     "module": "ojs/ojfilepicker",
 *     "styleClasses": [
 *       {
 *         "styleGroup": [
 *           "oj-filepicker-custom"
 *         ],
 *         "description": "Apply to a custom file picker if the entire dropzone is replaced with another clickable element like button or menu item."
 *       },
 *       {
 *         "styleGroup": [
 *           "oj-filepicker-dropzone"
 *         ],
 *         "description": "Apply to the dropzone of the file picker."
 *       },
 *       {
 *         "styleGroup": [
 *           "oj-filepicker-text"
 *         ],
 *         "description": "Apply to the dropzone text of the file picker."
 *       }
 *     ],
 *     "defaultColumns": "6",
 *     "minColumns": "2"
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-attach-file",
 *     "uxSpecs": [
 *       "file-picker"
 *     ]
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojFilePicker.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "accept",
 *       "selectOn",
 *       "selectionMode",
 *       "disabled",
 *       "primaryText",
 *       "secondaryText"
 *     ]
 *   }
 * ]
 * @ojmetadata since "4.0.0"
 * @ojmetadata styleClasses [
 *   {
 *     "name": "oj-filepicker-custom",
 *     "kind": "class",
 *     "displayName": "Custom",
 *     "description": "Apply to a custom file picker if the entire dropzone is replaced with another clickable element like button or menu item.\nNote that the oj-filepicker-custom class doesn't have to be specified in order to change the dropzone text.",
 *     "status": [
 *       {
 *         "type": "deprecated",
 *         "since": "9.0.0",
 *         "description": "oj-filepicker-custom class has been deprecated. Class is no longer needed."
 *       }
 *     ],
 *     "help": "#oj-filepicker-custom"
 *   },
 *   {
 *     "name": "oj-filepicker-dropzone",
 *     "kind": "class",
 *     "displayName": "File Picker DropZone",
 *     "description": "Apply to the dropzone of the file picker.",
 *     "status": [
 *       {
 *         "type": "deprecated",
 *         "since": "9.0.0",
 *         "description": "oj-filepicker-dropzone class has been deprecated. Class is no longer needed."
 *       }
 *     ],
 *     "help": "#oj-filepicker-dropzone"
 *   },
 *   {
 *     "name": "oj-filepicker-text",
 *     "kind": "class",
 *     "displayName": "File Picker Text",
 *     "description": "Apply to the dropzone text of the file picker.",
 *     "status": [
 *       {
 *         "type": "deprecated",
 *         "since": "9.0.0",
 *         "description": "oj-filepicker-text class has been deprecated. Class is no longer needed."
 *       }
 *     ],
 *     "help": "#oj-filepicker-text"
 *   }
 * ]
 * @ojmetadata styleVariableSet {"name": "oj-file-picker-css-set1",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-file-picker-border-color",
 *                                    "description": "File picker border color",
 *                                    "formats": ["color"],
 *                                    "help": "#css-variables"
 *                                  },
 *                                  {
 *                                    "name": "oj-file-picker-border-width",
 *                                    "description": "File picker border width",
 *                                    "formats": ["length"],
 *                                    "help": "#css-variables"
 *                                  },
 *                                  {
 *                                    "name": "oj-file-picker-border-radius",
 *                                    "description": "File picker border radius",
 *                                    "formats": ["length","percentage"],
 *                                    "help": "#css-variables"
 *                                  }
 *                                ]
 *                              }
 */
/**
 * This export corresponds to the FilePicker Preact component. For the oj-file-picker custom element, import FilePickerElement instead.
 */
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
    private readonly _handleSelectingFiles;
    private readonly _handleFileSelected;
    private _fileSelectedHelper;
    private readonly _handleDragEnter;
    private readonly _handleDragOver;
    private readonly _handleDragLeave;
    private readonly _handleFileDrop;
    private readonly _handleFocusIn;
    private readonly _handleFocusOut;
    /**
     * @ignore
     */
    focus(): void;
    /**
     * @ignore
     */
    blur(): void;
    /**
     * Invoked when focus is triggered on this.element
     */
    private _handleFocus;
    /**
     * Invoked when blur is triggered on this.element
     */
    private _handleBlur;
    render(props: ExtendGlobalProps<Props>): import("preact").JSX.Element;
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
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-file-picker custom element. For the FilePicker Preact component, import FilePicker instead.
 */
export interface FilePickerElement extends JetElement<FilePickerElementSettableProperties>, FilePickerElementSettableProperties {
    addEventListener<T extends keyof FilePickerElementEventMap>(type: T, listener: (this: HTMLElement, ev: FilePickerElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof FilePickerElementSettableProperties>(property: T): FilePickerElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof FilePickerElementSettableProperties>(property: T, value: FilePickerElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, FilePickerElementSettableProperties>): void;
    setProperties(properties: FilePickerElementSettablePropertiesLenient): void;
    blur: FilePicker['blur'];
    focus: FilePicker['focus'];
}
export namespace FilePickerElement {
    interface ojBeforeSelect extends CustomEvent<BeforeDetail & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojInvalidSelect extends CustomEvent<InvalidDetail & {}> {
    }
    interface ojSelect extends CustomEvent<SelectDetail & {}> {
    }
    type acceptChanged = JetElementCustomEventStrict<FilePickerElement['accept']>;
    type captureChanged = JetElementCustomEventStrict<FilePickerElement['capture']>;
    type disabledChanged = JetElementCustomEventStrict<FilePickerElement['disabled']>;
    type primaryTextChanged = JetElementCustomEventStrict<FilePickerElement['primaryText']>;
    type secondaryTextChanged = JetElementCustomEventStrict<FilePickerElement['secondaryText']>;
    type selectOnChanged = JetElementCustomEventStrict<FilePickerElement['selectOn']>;
    type selectionModeChanged = JetElementCustomEventStrict<FilePickerElement['selectionMode']>;
}
export interface FilePickerElementEventMap extends HTMLElementEventMap {
    'ojBeforeSelect': FilePickerElement.ojBeforeSelect;
    'ojInvalidSelect': FilePickerElement.ojInvalidSelect;
    'ojSelect': FilePickerElement.ojSelect;
    'acceptChanged': JetElementCustomEventStrict<FilePickerElement['accept']>;
    'captureChanged': JetElementCustomEventStrict<FilePickerElement['capture']>;
    'disabledChanged': JetElementCustomEventStrict<FilePickerElement['disabled']>;
    'primaryTextChanged': JetElementCustomEventStrict<FilePickerElement['primaryText']>;
    'secondaryTextChanged': JetElementCustomEventStrict<FilePickerElement['secondaryText']>;
    'selectOnChanged': JetElementCustomEventStrict<FilePickerElement['selectOn']>;
    'selectionModeChanged': JetElementCustomEventStrict<FilePickerElement['selectionMode']>;
}
export interface FilePickerElementSettableProperties extends JetSettableProperties {
    /**
     * An array of strings of allowed MIME types or file extensions that can be uploaded; this is unlike the accept attribute of the html &lt;input> element that accepts a simple comma-delimited string. If not specified, accept all file types.
     *
     * <p>Note: If accept is specified, files with empty string type will be rejected if no match found in the "accept" value. Due to browser/OS differences, you may have to specify multiple values for the same value type. For example, for a CSV file, you might need to specify 'text/csv', '.csv', 'application/vnd.ms-excel', 'text/comma-separated-values' and others depending on your target browser/OS.</p>
     */
    accept?: Props['accept'];
    /**
     * Specifies the preferred facing mode for the device's
     * <a href="https://www.w3.org/TR/html-media-capture/#dom-htmlinputelement-capture">media capture</a> mechanism;
     * This is most often used to provide direct camera access on mobile devices.  Note that the accept attribute must
     * be specified and have an associated capture control type (e.g.["image/*"]) for the capture attribute to take effect.  Support may vary by browser.
     */
    capture?: Props['capture'];
    /**
     * Disables the filepicker if set to <code class="prettyprint">true</code>.
     */
    disabled?: Props['disabled'];
    /**
     * The primary text for the default file picker.  It is either a string or a formatting function that returns the string to be displayed.
     */
    primaryText?: Props['primaryText'];
    /**
     * The secondary text for the default file picker.  It is either a string or a formatting function that returns the string to be displayed.
     * The formatting function takes in a property object that contains the selection mode of the filepicker.
     */
    secondaryText?: Props['secondaryText'];
    /**
     * @deprecated since 13.1.0  - Main use case was to turn off drag and drop for button filepicker.  The current recommendation for that use case is to use ojfilepickerutils with an oj-button.
     */
    selectOn?: Props['selectOn'];
    selectionMode?: Props['selectionMode'];
}
export interface FilePickerElementSettablePropertiesLenient extends Partial<FilePickerElementSettableProperties> {
    [key: string]: any;
}
export type ojFilePicker = FilePickerElement;
export namespace ojFilePicker {
    interface ojBeforeSelect extends CustomEvent<BeforeDetail & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojInvalidSelect extends CustomEvent<InvalidDetail & {}> {
    }
    interface ojSelect extends CustomEvent<SelectDetail & {}> {
    }
    type acceptChanged = JetElementCustomEventStrict<ojFilePicker['accept']>;
    type captureChanged = JetElementCustomEventStrict<ojFilePicker['capture']>;
    type disabledChanged = JetElementCustomEventStrict<ojFilePicker['disabled']>;
    type primaryTextChanged = JetElementCustomEventStrict<ojFilePicker['primaryText']>;
    type secondaryTextChanged = JetElementCustomEventStrict<ojFilePicker['secondaryText']>;
    type selectOnChanged = JetElementCustomEventStrict<ojFilePicker['selectOn']>;
    type selectionModeChanged = JetElementCustomEventStrict<ojFilePicker['selectionMode']>;
}
export type ojFilePickerEventMap = FilePickerElementEventMap;
export type ojFilePickerSettableProperties = FilePickerElementSettableProperties;
export type ojFilePickerSettablePropertiesLenient = FilePickerElementSettablePropertiesLenient;
export interface FilePickerIntrinsicProps extends Partial<Readonly<FilePickerElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * Triggered before files are selected to allow for custom validation.  To reject the selected files, the application can either call event.preventDefault() or pass a rejected Promise to the accept detail property. The latter approach is recommended because this allows the application to send a message stating why the files were rejected.
     */
    onojBeforeSelect?: (value: FilePickerElementEventMap['ojBeforeSelect']) => void;
    /**
     * Triggered when invalid files are selected.  This event provides the application with a list of messages that should be displayed to give the user feedback about the
     * problems with their selection.  This feedback can be safely cleared when a subsequent ojBeforeSelect, ojInvalidSelect, or ojSelect event is received.  Additionally the
     * event.detail.until property may be populated with a Promise to provide short-term feedback during a user interaction (typically drag and drop); the feedback should be cleared upon resolution
     * of this Promise.
     */
    onojInvalidSelect?: (value: FilePickerElementEventMap['ojInvalidSelect']) => void;
    onojSelect?: (value: FilePickerElementEventMap['ojSelect']) => void;
    onacceptChanged?: (value: FilePickerElementEventMap['acceptChanged']) => void;
    oncaptureChanged?: (value: FilePickerElementEventMap['captureChanged']) => void;
    ondisabledChanged?: (value: FilePickerElementEventMap['disabledChanged']) => void;
    onprimaryTextChanged?: (value: FilePickerElementEventMap['primaryTextChanged']) => void;
    onsecondaryTextChanged?: (value: FilePickerElementEventMap['secondaryTextChanged']) => void;
    /** @deprecated since 13.1.0 */ onselectOnChanged?: (value: FilePickerElementEventMap['selectOnChanged']) => void;
    onselectionModeChanged?: (value: FilePickerElementEventMap['selectionModeChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-file-picker': FilePickerIntrinsicProps;
        }
    }
}
