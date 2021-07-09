import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import Color = require('../ojcolor');
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojColorPalette extends editableValue<Color, ojColorPaletteSettableProperties> {
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelDisplay: 'auto' | 'off';
    labelledBy: string | null;
    layout: 'grid' | 'list';
    palette: Array<{
        color: Color;
        label?: string;
    }>;
    swatchSize: 'xs' | 'sm' | 'lg';
    value: Color;
    translations: {
        labelNone?: string;
    };
    addEventListener<T extends keyof ojColorPaletteEventMap>(type: T, listener: (this: HTMLElement, ev: ojColorPaletteEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojColorPaletteSettableProperties>(property: T): ojColorPalette[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojColorPaletteSettableProperties>(property: T, value: ojColorPaletteSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojColorPaletteSettableProperties>): void;
    setProperties(properties: ojColorPaletteSettablePropertiesLenient): void;
}
export namespace ojColorPalette {
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
    type displayOptionsChanged = JetElementCustomEvent<ojColorPalette["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged = JetElementCustomEvent<ojColorPalette["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojColorPalette["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged = JetElementCustomEvent<ojColorPalette["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type paletteChanged = JetElementCustomEvent<ojColorPalette["palette"]>;
    // tslint:disable-next-line interface-over-type-literal
    type swatchSizeChanged = JetElementCustomEvent<ojColorPalette["swatchSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojColorPalette["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = editableValue.disabledChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<Color, ojColorPaletteSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojColorPaletteEventMap extends editableValueEventMap<Color, ojColorPaletteSettableProperties> {
    'ojAnimateEnd': ojColorPalette.ojAnimateEnd;
    'ojAnimateStart': ojColorPalette.ojAnimateStart;
    'displayOptionsChanged': JetElementCustomEvent<ojColorPalette["displayOptions"]>;
    'labelDisplayChanged': JetElementCustomEvent<ojColorPalette["labelDisplay"]>;
    'labelledByChanged': JetElementCustomEvent<ojColorPalette["labelledBy"]>;
    'layoutChanged': JetElementCustomEvent<ojColorPalette["layout"]>;
    'paletteChanged': JetElementCustomEvent<ojColorPalette["palette"]>;
    'swatchSizeChanged': JetElementCustomEvent<ojColorPalette["swatchSize"]>;
    'valueChanged': JetElementCustomEvent<ojColorPalette["value"]>;
    'describedByChanged': JetElementCustomEvent<ojColorPalette["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojColorPalette["disabled"]>;
    'helpChanged': JetElementCustomEvent<ojColorPalette["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojColorPalette["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojColorPalette["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojColorPalette["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojColorPalette["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojColorPalette["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojColorPalette["valid"]>;
}
export interface ojColorPaletteSettableProperties extends editableValueSettableProperties<Color> {
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    labelDisplay: 'auto' | 'off';
    labelledBy: string | null;
    layout: 'grid' | 'list';
    palette: Array<{
        color: Color;
        label?: string;
    }>;
    swatchSize: 'xs' | 'sm' | 'lg';
    value: Color;
    translations: {
        labelNone?: string;
    };
}
export interface ojColorPaletteSettablePropertiesLenient extends Partial<ojColorPaletteSettableProperties> {
    [key: string]: any;
}
export type ColorPaletteElement = ojColorPalette;
export namespace ColorPaletteElement {
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
    type displayOptionsChanged = JetElementCustomEvent<ojColorPalette["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged = JetElementCustomEvent<ojColorPalette["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojColorPalette["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged = JetElementCustomEvent<ojColorPalette["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type paletteChanged = JetElementCustomEvent<ojColorPalette["palette"]>;
    // tslint:disable-next-line interface-over-type-literal
    type swatchSizeChanged = JetElementCustomEvent<ojColorPalette["swatchSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojColorPalette["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = editableValue.disabledChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<Color, ojColorPaletteSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<Color, ojColorPaletteSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ColorPaletteIntrinsicProps extends Partial<Readonly<ojColorPaletteSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojColorPaletteEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojColorPaletteEventMap['ojAnimateStart']) => void;
    ondisplayOptionsChanged?: (value: ojColorPaletteEventMap['displayOptionsChanged']) => void;
    onlabelDisplayChanged?: (value: ojColorPaletteEventMap['labelDisplayChanged']) => void;
    onlabelledByChanged?: (value: ojColorPaletteEventMap['labelledByChanged']) => void;
    onlayoutChanged?: (value: ojColorPaletteEventMap['layoutChanged']) => void;
    onpaletteChanged?: (value: ojColorPaletteEventMap['paletteChanged']) => void;
    onswatchSizeChanged?: (value: ojColorPaletteEventMap['swatchSizeChanged']) => void;
    onvalueChanged?: (value: ojColorPaletteEventMap['valueChanged']) => void;
    ondescribedByChanged?: (value: ojColorPaletteEventMap['describedByChanged']) => void;
    ondisabledChanged?: (value: ojColorPaletteEventMap['disabledChanged']) => void;
    onhelpChanged?: (value: ojColorPaletteEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojColorPaletteEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojColorPaletteEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojColorPaletteEventMap['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojColorPaletteEventMap['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojColorPaletteEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojColorPaletteEventMap['validChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-color-palette": ColorPaletteIntrinsicProps;
        }
    }
}
