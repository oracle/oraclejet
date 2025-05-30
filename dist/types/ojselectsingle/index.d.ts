import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import ojcommontypes = require('../ojcommontypes');
import { KeySet } from '../ojkeyset';
import { DataProvider, ItemMetadata } from '../ojdataprovider';
import { ojSelectBase, ojSelectBaseEventMap, ojSelectBaseSettableProperties } from '../ojselectbase';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojSelectSingle<V, D> extends ojSelectBase<V, D, ojSelectSingleSettableProperties<V, D>> {
    displayOptions: {
        /** @deprecated since 9.0.0 - If you want none, remove help-instruction attribute. */
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: 'display' | 'none';
    };
    value: V | null;
    valueItem: ojcommontypes.ItemContext<V, D>;
    translations: {
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        cancel?: string;
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        labelAccClearValue?: string;
        /** @deprecated since 10.0.0 - The oj-select-single dropdown arrow should be ignored by screen readers, so a label is not required. */
        labelAccOpenDropdown?: string;
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        multipleMatchesFound?: string;
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        nOrMoreMatchesFound?: string;
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        noMatchesFound?: string;
        /** @deprecated since 9.0.0 - oj-select-single will no longer show the dropdown when there are no results to show. */
        noResultsLine1?: string;
        /** @deprecated since 9.0.0 - oj-select-single will no longer show the dropdown when there are no results to show. */
        noResultsLine2?: string;
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        oneMatchFound?: string;
        required?: {
            /** @deprecated since 18.0.0 - Setting a required validator hint is not recommended in the Redwood design system. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 14.0.0 - In the Redwood design system form components do not show validator summaries, so this is no longer needed. */
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof ojSelectSingleEventMap<V, D>>(type: T, listener: (this: HTMLElement, ev: ojSelectSingleEventMap<V, D>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojSelectSingleSettableProperties<V, D>>(property: T): ojSelectSingle<V, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSelectSingleSettableProperties<V, D>>(property: T, value: ojSelectSingleSettableProperties<V, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSelectSingleSettableProperties<V, D>>): void;
    setProperties(properties: ojSelectSingleSettablePropertiesLenient<V, D>): void;
}
export namespace ojSelectSingle {
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
    interface ojValueAction<V, D> extends CustomEvent<{
        itemContext: ojcommontypes.ItemContext<V, D>;
        previousValue: V | null;
        value: V | null;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueItemChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["valueItem"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<V, D> = ojSelectBase.dataChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V, D> = ojSelectBase.describedByChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V, D> = ojSelectBase.disabledChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V, D> = ojSelectBase.helpChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V, D> = ojSelectBase.helpHintsChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type itemTextChanged<V, D> = ojSelectBase.itemTextChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V, D> = ojSelectBase.labelEdgeChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V, D> = ojSelectBase.labelHintChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V, D> = ojSelectBase.labelledByChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type matchByChanged<V, D> = ojSelectBase.matchByChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V, D> = ojSelectBase.messagesCustomChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V, D> = ojSelectBase.placeholderChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V, D> = ojSelectBase.readonlyChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyUserAssistanceShownChanged<V, D> = ojSelectBase.readonlyUserAssistanceShownChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V, D> = ojSelectBase.requiredChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V, D> = ojSelectBase.userAssistanceDensityChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V, D> = ojSelectBase.validChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type virtualKeyboardChanged<V, D> = ojSelectBase.virtualKeyboardChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type CollectionTemplateContext<V, D> = {
        currentRow: {
            rowKey: V;
        };
        data: DataProvider<V, D>;
        handleRowAction: ((event: Event, context: ojcommontypes.ItemContext<V, D>) => void);
        searchText: string;
        selected: KeySet<V>;
        /** @deprecated since 9.0.0 - Use the currentRow and handleRowAction properties instead, which provide additional functionalities. */
        selectedItem: ojcommontypes.ItemContext<V, D>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<V, D> = {
        componentElement: Element;
        data: D;
        depth: number;
        index: number;
        key: V;
        leaf: boolean;
        metadata: ItemMetadata<V>;
        parentKey: V;
        searchText: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderCollectionTemplate<V, D> = import('ojs/ojvcomponent').TemplateSlot<CollectionTemplateContext<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<V, D> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<V, D>>;
}
export interface ojSelectSingleEventMap<V, D> extends ojSelectBaseEventMap<V, D, ojSelectSingleSettableProperties<V, D>> {
    'ojAnimateEnd': ojSelectSingle.ojAnimateEnd;
    'ojAnimateStart': ojSelectSingle.ojAnimateStart;
    'ojValueAction': ojSelectSingle.ojValueAction<V, D>;
    'displayOptionsChanged': JetElementCustomEvent<ojSelectSingle<V, D>["displayOptions"]>;
    'valueChanged': JetElementCustomEvent<ojSelectSingle<V, D>["value"]>;
    'valueItemChanged': JetElementCustomEvent<ojSelectSingle<V, D>["valueItem"]>;
    'dataChanged': JetElementCustomEvent<ojSelectSingle<V, D>["data"]>;
    'describedByChanged': JetElementCustomEvent<ojSelectSingle<V, D>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojSelectSingle<V, D>["disabled"]>;
    'helpChanged': JetElementCustomEvent<ojSelectSingle<V, D>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojSelectSingle<V, D>["helpHints"]>;
    'itemTextChanged': JetElementCustomEvent<ojSelectSingle<V, D>["itemText"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojSelectSingle<V, D>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojSelectSingle<V, D>["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojSelectSingle<V, D>["labelledBy"]>;
    'matchByChanged': JetElementCustomEvent<ojSelectSingle<V, D>["matchBy"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojSelectSingle<V, D>["messagesCustom"]>;
    'placeholderChanged': JetElementCustomEvent<ojSelectSingle<V, D>["placeholder"]>;
    'readonlyChanged': JetElementCustomEvent<ojSelectSingle<V, D>["readonly"]>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEvent<ojSelectSingle<V, D>["readonlyUserAssistanceShown"]>;
    'requiredChanged': JetElementCustomEvent<ojSelectSingle<V, D>["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojSelectSingle<V, D>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojSelectSingle<V, D>["valid"]>;
    'virtualKeyboardChanged': JetElementCustomEvent<ojSelectSingle<V, D>["virtualKeyboard"]>;
}
export interface ojSelectSingleSettableProperties<V, D> extends ojSelectBaseSettableProperties<V, D> {
    displayOptions: {
        /** @deprecated since 9.0.0 - If you want none, remove help-instruction attribute. */
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: 'display' | 'none';
    };
    value: V | null;
    valueItem: ojcommontypes.ItemContext<V, D>;
    translations: {
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        cancel?: string;
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        labelAccClearValue?: string;
        /** @deprecated since 10.0.0 - The oj-select-single dropdown arrow should be ignored by screen readers, so a label is not required. */
        labelAccOpenDropdown?: string;
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        multipleMatchesFound?: string;
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        nOrMoreMatchesFound?: string;
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        noMatchesFound?: string;
        /** @deprecated since 9.0.0 - oj-select-single will no longer show the dropdown when there are no results to show. */
        noResultsLine1?: string;
        /** @deprecated since 9.0.0 - oj-select-single will no longer show the dropdown when there are no results to show. */
        noResultsLine2?: string;
        /** @deprecated since 18.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        oneMatchFound?: string;
        required?: {
            /** @deprecated since 18.0.0 - Setting a required validator hint is not recommended in the Redwood design system. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 14.0.0 - In the Redwood design system form components do not show validator summaries, so this is no longer needed. */
            messageSummary?: string;
        };
    };
}
export interface ojSelectSingleSettablePropertiesLenient<V, D> extends Partial<ojSelectSingleSettableProperties<V, D>> {
    [key: string]: any;
}
export type SelectSingleElement<V, D> = ojSelectSingle<V, D>;
export namespace SelectSingleElement {
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
    interface ojValueAction<V, D> extends CustomEvent<{
        itemContext: ojcommontypes.ItemContext<V, D>;
        previousValue: V | null;
        value: V | null;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueItemChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["valueItem"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<V, D> = ojSelectBase.dataChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V, D> = ojSelectBase.describedByChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V, D> = ojSelectBase.disabledChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V, D> = ojSelectBase.helpChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V, D> = ojSelectBase.helpHintsChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type itemTextChanged<V, D> = ojSelectBase.itemTextChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V, D> = ojSelectBase.labelEdgeChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V, D> = ojSelectBase.labelHintChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V, D> = ojSelectBase.labelledByChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type matchByChanged<V, D> = ojSelectBase.matchByChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V, D> = ojSelectBase.messagesCustomChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V, D> = ojSelectBase.placeholderChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V, D> = ojSelectBase.readonlyChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyUserAssistanceShownChanged<V, D> = ojSelectBase.readonlyUserAssistanceShownChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V, D> = ojSelectBase.requiredChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V, D> = ojSelectBase.userAssistanceDensityChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V, D> = ojSelectBase.validChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type virtualKeyboardChanged<V, D> = ojSelectBase.virtualKeyboardChanged<V, D, ojSelectSingleSettableProperties<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type CollectionTemplateContext<V, D> = {
        currentRow: {
            rowKey: V;
        };
        data: DataProvider<V, D>;
        handleRowAction: ((event: Event, context: ojcommontypes.ItemContext<V, D>) => void);
        searchText: string;
        selected: KeySet<V>;
        /** @deprecated since 9.0.0 - Use the currentRow and handleRowAction properties instead, which provide additional functionalities. */
        selectedItem: ojcommontypes.ItemContext<V, D>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<V, D> = {
        componentElement: Element;
        data: D;
        depth: number;
        index: number;
        key: V;
        leaf: boolean;
        metadata: ItemMetadata<V>;
        parentKey: V;
        searchText: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderCollectionTemplate<V, D> = import('ojs/ojvcomponent').TemplateSlot<CollectionTemplateContext<V, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<V, D> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<V, D>>;
}
export interface SelectSingleIntrinsicProps extends Partial<Readonly<ojSelectSingleSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateEnd?: (value: ojSelectSingleEventMap<any, any>['ojAnimateEnd']) => void;
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateStart?: (value: ojSelectSingleEventMap<any, any>['ojAnimateStart']) => void;
    onojValueAction?: (value: ojSelectSingleEventMap<any, any>['ojValueAction']) => void;
    ondisplayOptionsChanged?: (value: ojSelectSingleEventMap<any, any>['displayOptionsChanged']) => void;
    onvalueChanged?: (value: ojSelectSingleEventMap<any, any>['valueChanged']) => void;
    onvalueItemChanged?: (value: ojSelectSingleEventMap<any, any>['valueItemChanged']) => void;
    ondataChanged?: (value: ojSelectSingleEventMap<any, any>['dataChanged']) => void;
    ondescribedByChanged?: (value: ojSelectSingleEventMap<any, any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojSelectSingleEventMap<any, any>['disabledChanged']) => void;
    onhelpChanged?: (value: ojSelectSingleEventMap<any, any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojSelectSingleEventMap<any, any>['helpHintsChanged']) => void;
    onitemTextChanged?: (value: ojSelectSingleEventMap<any, any>['itemTextChanged']) => void;
    onlabelEdgeChanged?: (value: ojSelectSingleEventMap<any, any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojSelectSingleEventMap<any, any>['labelHintChanged']) => void;
    onlabelledByChanged?: (value: ojSelectSingleEventMap<any, any>['labelledByChanged']) => void;
    onmatchByChanged?: (value: ojSelectSingleEventMap<any, any>['matchByChanged']) => void;
    onmessagesCustomChanged?: (value: ojSelectSingleEventMap<any, any>['messagesCustomChanged']) => void;
    onplaceholderChanged?: (value: ojSelectSingleEventMap<any, any>['placeholderChanged']) => void;
    onreadonlyChanged?: (value: ojSelectSingleEventMap<any, any>['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: ojSelectSingleEventMap<any, any>['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: ojSelectSingleEventMap<any, any>['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojSelectSingleEventMap<any, any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojSelectSingleEventMap<any, any>['validChanged']) => void;
    onvirtualKeyboardChanged?: (value: ojSelectSingleEventMap<any, any>['virtualKeyboardChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-select-single": SelectSingleIntrinsicProps;
        }
    }
}
