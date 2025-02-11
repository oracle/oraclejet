import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import Color = require('../ojcolor');
import Message = require('../ojmessaging');
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojColorPalette extends editableValue<Color, ojColorPaletteSettableProperties> {
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    describedBy: string | null;
    /** @deprecated since 18.0.0 - Disabled is not supported by the Color Palette UX specification. */
    disabled: boolean;
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    displayOptions: {
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        converterHint?: 'display' | 'none';
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        messages?: 'display' | 'none';
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        validatorHint?: 'display' | 'none';
    };
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    help: {
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        instruction?: string;
    };
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    helpHints: {
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        definition?: string;
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        source?: string;
    };
    /** @deprecated since 18.0.0 - This is deprecated as labels are no longer supported. */
    labelDisplay: 'auto' | 'off';
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    labelEdge: 'inside' | 'none' | 'provided';
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    labelHint: string;
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    labelledBy: string | null;
    /** @deprecated since 18.0.0 - This is deprecated as only grid layout values are now supported. */
    layout: 'grid' | 'list';
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    messagesCustom: Message[];
    palette: Array<{
        color: Color;
        label?: string;
    }>;
    /** @deprecated since 18.0.0 - oj-color-palette doesn't have a text input, so this was never needed. */
    placeholder: string;
    swatchSize: 'xs' | 'sm' | 'lg';
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    userAssistanceDensity: 'reflow' | 'efficient' | 'compact';
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to be validated, display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    readonly valid: 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
    value: Color;
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to be validated, display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
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
    refresh(): void;
    reset(): void;
    showMessages(): void;
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
    type describedByChanged = JetElementCustomEvent<ojColorPalette["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojColorPalette["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojColorPalette["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = JetElementCustomEvent<ojColorPalette["help"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = JetElementCustomEvent<ojColorPalette["helpHints"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged = JetElementCustomEvent<ojColorPalette["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = JetElementCustomEvent<ojColorPalette["labelEdge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = JetElementCustomEvent<ojColorPalette["labelHint"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojColorPalette["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged = JetElementCustomEvent<ojColorPalette["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = JetElementCustomEvent<ojColorPalette["messagesCustom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type paletteChanged = JetElementCustomEvent<ojColorPalette["palette"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = JetElementCustomEvent<ojColorPalette["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type swatchSizeChanged = JetElementCustomEvent<ojColorPalette["swatchSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = JetElementCustomEvent<ojColorPalette["userAssistanceDensity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = JetElementCustomEvent<ojColorPalette["valid"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojColorPalette["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type translationsChanged = JetElementCustomEvent<ojColorPalette["translations"]>;
}
export interface ojColorPaletteEventMap extends editableValueEventMap<Color, ojColorPaletteSettableProperties> {
    'ojAnimateEnd': ojColorPalette.ojAnimateEnd;
    'ojAnimateStart': ojColorPalette.ojAnimateStart;
    'describedByChanged': JetElementCustomEvent<ojColorPalette["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojColorPalette["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojColorPalette["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojColorPalette["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojColorPalette["helpHints"]>;
    'labelDisplayChanged': JetElementCustomEvent<ojColorPalette["labelDisplay"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojColorPalette["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojColorPalette["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojColorPalette["labelledBy"]>;
    'layoutChanged': JetElementCustomEvent<ojColorPalette["layout"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojColorPalette["messagesCustom"]>;
    'paletteChanged': JetElementCustomEvent<ojColorPalette["palette"]>;
    'placeholderChanged': JetElementCustomEvent<ojColorPalette["placeholder"]>;
    'swatchSizeChanged': JetElementCustomEvent<ojColorPalette["swatchSize"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojColorPalette["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojColorPalette["valid"]>;
    'valueChanged': JetElementCustomEvent<ojColorPalette["value"]>;
    'translationsChanged': JetElementCustomEvent<ojColorPalette["translations"]>;
}
export interface ojColorPaletteSettableProperties extends editableValueSettableProperties<Color> {
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    describedBy: string | null;
    /** @deprecated since 18.0.0 - Disabled is not supported by the Color Palette UX specification. */
    disabled: boolean;
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    displayOptions: {
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        converterHint?: 'display' | 'none';
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        messages?: 'display' | 'none';
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        validatorHint?: 'display' | 'none';
    };
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    help: {
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        instruction?: string;
    };
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    helpHints: {
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        definition?: string;
        /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
           the oj-color-palette is not intended to be a form component. */
        source?: string;
    };
    /** @deprecated since 18.0.0 - This is deprecated as labels are no longer supported. */
    labelDisplay: 'auto' | 'off';
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    labelEdge: 'inside' | 'none' | 'provided';
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    labelHint: string;
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    labelledBy: string | null;
    /** @deprecated since 18.0.0 - This is deprecated as only grid layout values are now supported. */
    layout: 'grid' | 'list';
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    messagesCustom: Message[];
    palette: Array<{
        color: Color;
        label?: string;
    }>;
    /** @deprecated since 18.0.0 - oj-color-palette doesn't have a text input, so this was never needed. */
    placeholder: string;
    swatchSize: 'xs' | 'sm' | 'lg';
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    userAssistanceDensity: 'reflow' | 'efficient' | 'compact';
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to be validated, display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
    readonly valid: 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
    value: Color;
    /** @deprecated since 18.0.0 - The oj-color-palette is not meant to be validated, display messages, be labelled, or be in a form layout by itself. Per the Redwood UX specification,
       the oj-color-palette is not intended to be a form component. */
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
    type describedByChanged = JetElementCustomEvent<ojColorPalette["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojColorPalette["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojColorPalette["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = JetElementCustomEvent<ojColorPalette["help"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = JetElementCustomEvent<ojColorPalette["helpHints"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged = JetElementCustomEvent<ojColorPalette["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = JetElementCustomEvent<ojColorPalette["labelEdge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = JetElementCustomEvent<ojColorPalette["labelHint"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojColorPalette["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged = JetElementCustomEvent<ojColorPalette["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = JetElementCustomEvent<ojColorPalette["messagesCustom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type paletteChanged = JetElementCustomEvent<ojColorPalette["palette"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = JetElementCustomEvent<ojColorPalette["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type swatchSizeChanged = JetElementCustomEvent<ojColorPalette["swatchSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = JetElementCustomEvent<ojColorPalette["userAssistanceDensity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = JetElementCustomEvent<ojColorPalette["valid"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojColorPalette["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type translationsChanged = JetElementCustomEvent<ojColorPalette["translations"]>;
}
export interface ColorPaletteIntrinsicProps extends Partial<Readonly<ojColorPaletteSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateEnd?: (value: ojColorPaletteEventMap['ojAnimateEnd']) => void;
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateStart?: (value: ojColorPaletteEventMap['ojAnimateStart']) => void;
    /** @deprecated since 18.0.0 */ ondescribedByChanged?: (value: ojColorPaletteEventMap['describedByChanged']) => void;
    /** @deprecated since 18.0.0 */ ondisabledChanged?: (value: ojColorPaletteEventMap['disabledChanged']) => void;
    /** @deprecated since 18.0.0 */ ondisplayOptionsChanged?: (value: ojColorPaletteEventMap['displayOptionsChanged']) => void;
    /** @deprecated since 18.0.0 */ onhelpChanged?: (value: ojColorPaletteEventMap['helpChanged']) => void;
    /** @deprecated since 18.0.0 */ onhelpHintsChanged?: (value: ojColorPaletteEventMap['helpHintsChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelDisplayChanged?: (value: ojColorPaletteEventMap['labelDisplayChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelEdgeChanged?: (value: ojColorPaletteEventMap['labelEdgeChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelHintChanged?: (value: ojColorPaletteEventMap['labelHintChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelledByChanged?: (value: ojColorPaletteEventMap['labelledByChanged']) => void;
    /** @deprecated since 18.0.0 */ onlayoutChanged?: (value: ojColorPaletteEventMap['layoutChanged']) => void;
    /** @deprecated since 18.0.0 */ onmessagesCustomChanged?: (value: ojColorPaletteEventMap['messagesCustomChanged']) => void;
    onpaletteChanged?: (value: ojColorPaletteEventMap['paletteChanged']) => void;
    /** @deprecated since 18.0.0 */ onplaceholderChanged?: (value: ojColorPaletteEventMap['placeholderChanged']) => void;
    onswatchSizeChanged?: (value: ojColorPaletteEventMap['swatchSizeChanged']) => void;
    /** @deprecated since 18.0.0 */ onuserAssistanceDensityChanged?: (value: ojColorPaletteEventMap['userAssistanceDensityChanged']) => void;
    /** @deprecated since 18.0.0 */ onvalidChanged?: (value: ojColorPaletteEventMap['validChanged']) => void;
    onvalueChanged?: (value: ojColorPaletteEventMap['valueChanged']) => void;
    /** @deprecated since 18.0.0 */ ontranslationsChanged?: (value: ojColorPaletteEventMap['translationsChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-color-palette": ColorPaletteIntrinsicProps;
        }
    }
}
