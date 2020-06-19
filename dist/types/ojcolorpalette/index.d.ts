/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import Color = require('../ojcolor');
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojColorPalette extends editableValue<Color, ojColorPaletteSettableProperties> {
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
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
    addEventListener<T extends keyof ojColorPaletteEventMap>(type: T, listener: (this: HTMLElement, ev: ojColorPaletteEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
}
export interface ojColorPaletteSettableProperties extends editableValueSettableProperties<Color> {
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
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
