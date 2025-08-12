import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { Component } from 'preact';
import { KeySet } from 'ojs/ojkeyset';
type Props<Key> = ObservedGlobalProps<'aria-label' | 'aria-labelledby' | 'aria-describedby'> & {
    /**
     * @ojmetadata description "Specifies the row key of each selector. If the selectionMode property is 'all', rowKey is ignored."
     * @ojmetadata displayName "Row Key"
     * @ojmetadata help "#rowKey"
     */
    rowKey?: Key | null;
    /**
     * @description
     * Specifies if the selector should show the visual partial state.
     * The original checked state of the selector will still be maintained.
     * User selection of checkboxes will remove the indeterminate state and reveal the checkbox state.
     * Otherwise, programmatically changing the checkbox state will not change the indeterminate state.
     *
     * @ojmetadata description "Visual only state to indicate partial selection"
     * @ojmetadata displayName "indeterminate"
     * @ojmetadata help "#indeterminate"
     */
    indeterminate?: boolean;
    /**
     * @ojmetadata description "Specifies the selectedKeys, should be hooked into the collection component."
     * @ojmetadata displayName "Selected Keys"
     * @ojmetadata help "#selectedKeys"
     * @ojmetadata required
     */
    selectedKeys: KeySet<Key> | null;
    onSelectedKeysChanged?: PropertyChanged<KeySet<Key> | null>;
    onIndeterminateChanged?: PropertyChanged<boolean>;
    /**
     * @description
     * Specifies the selection mode ('single', 'multiple', 'all'). 'all' should only be used for the select all case and will ignore the key property.
     * @example
     * &lt;oj-selector selected-keys='{{selectedItems}}'
     *          selection-mode='all'>
     * &lt;/oj-selector>
     *
     * @ojmetadata description "Specifies the selection mode."
     * @ojmetadata displayName "Selection Mode"
     * @ojmetadata help "#selectionMode"
     * @ojmetadata propertyEditorValues {
     *     "all": {
     *       "description": "Specifies the select all case (rowKey property is ignored).",
     *       "displayName": "All"
     *     },
     *     "multiple": {
     *       "description": "Multiple items can be selected at the same time.",
     *       "displayName": "Multiple"
     *     },
     *     "single": {
     *       "description": "Only a single item can be selected at a time.",
     *       "displayName": "Single"
     *     }
     *   }
     */
    selectionMode?: 'all' | 'multiple' | 'single';
};
type State = {
    focus?: boolean;
};
/**
 * @classdesc
 * <h3 id="selectorOverview-section">
 *   JET Selector
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectorOverview-section"></a>
 * </h3>
 * <p>Description: A checkbox to support selection in Collection Components</p>
 * <p>The oj-selector is a component that may be placed within a template for Table, ListView.
 * It presents as a checkbox when the Collection Component is configured for multi-selection.
 * Note that the selector does not prevent click events from bubbling up to the containing element.
 * In cases where an application wishes to prevent the containing element or component from performing
 * a default action based on these click events, the application must ensure the appropriate updates
 * are made (ie. setting the data-oj-clickthrough='disabled' attribute on a selector within an
 * <oj-list-view> that does not include an <oj-list-item-layout>).</p>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-list-view id="listview"
 *      data="[[dataProvider]]"
 *      selected="{{selectedItems}}"
 *      selection-mode="[[selectedSelectionMode]]"
 *      scroll-policy="loadMoreOnScroll">
 *  &lt;template slot="itemTemplate" data-oj-as="item">
 *    &lt;li>
 *      &lt;div class='oj-flex'>
 *        &lt;div class="oj-flex-item">
 *          &lt;oj-selector selected-keys='{{selectedItems}}'
 *                        selection-mode='[[selectedSelectionMode]]'
 *                        row-key='[[item.key]]'>
 *          &lt;/oj-selector>
 *        &lt;/div>
 *        &lt;div class="oj-flex-item">
 *          &lt;span data-bind="text: 'Name '+ item.data.name">&lt;/span>
 *        &lt;/div>
 *      &lt;/div>
 *    &lt;/li>
 *  &lt;/template>
 * &lt;/oj-list-view>
 * </code></pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>Application must specify a value for the aria-label attribute with a meaningful description of the purpose of this selector in order for this to be accessible.</p>
 *
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 * To migrate from oj-selector to oj-c-selector or oj-c-selector-all, you need to revise the import statement and references to oj-selector in your app. Please note the changes between the two components below.
 * <h5 id="dataprovider-key-type-migration"></h5>
 *
 * <h5>selection-mode attribute</h5>
 * <p>For selection-mode="single"|"multiple", please use oj-c-selector; for selection-mode="all", please use oj-c-selector-all.</p>
 *
 *
 * @typeparam {object} K Type of key
 * @ojmetadata description "The selector component renders checkboxes in collections to support selection."
 * @ojmetadata displayName "Selector"
 * @ojmetadata main "ojs/ojselector"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "16.0.0",
 *     "value": ["oj-c-selector", "oj-c-selector-all"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "vbdt": {
 *     "module": "ojs/ojselector"
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-check-square"
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojSelector.html"
 * @ojmetadata since "9.0.0"
 */
/**
 * This export corresponds to the Selector Preact component. For the oj-selector custom element, import SelectorElement instead.
 */
export declare class Selector<K> extends Component<ExtendGlobalProps<Props<K>>, State> {
    private readonly ref;
    constructor(props: ExtendGlobalProps<Props<K>>);
    static defaultProps: Props<any>;
    render(props: ExtendGlobalProps<Props<K>>, state: Readonly<State>): import("preact").JSX.Element;
    /**
     * focusin event listener
     */
    private readonly _handleFocusin;
    /**
     * focusout event listener
     */
    private readonly _handleFocusout;
    private readonly _checkboxListener;
    private _isSelected;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-selector custom element. For the Selector Preact component, import Selector instead.
 */
export interface SelectorElement<K> extends JetElement<SelectorElementSettableProperties<K>>, SelectorElementSettableProperties<K> {
    addEventListener<T extends keyof SelectorElementEventMap<K>>(type: T, listener: (this: HTMLElement, ev: SelectorElementEventMap<K>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof SelectorElementSettableProperties<K>>(property: T): SelectorElement<K>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof SelectorElementSettableProperties<K>>(property: T, value: SelectorElementSettableProperties<K>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, SelectorElementSettableProperties<K>>): void;
    setProperties(properties: SelectorElementSettablePropertiesLenient<K>): void;
}
export namespace SelectorElement {
    type indeterminateChanged<K> = JetElementCustomEventStrict<SelectorElement<K>['indeterminate']>;
    type rowKeyChanged<K> = JetElementCustomEventStrict<SelectorElement<K>['rowKey']>;
    type selectedKeysChanged<K> = JetElementCustomEventStrict<SelectorElement<K>['selectedKeys']>;
    type selectionModeChanged<K> = JetElementCustomEventStrict<SelectorElement<K>['selectionMode']>;
}
export interface SelectorElementEventMap<K> extends HTMLElementEventMap {
    'indeterminateChanged': JetElementCustomEventStrict<SelectorElement<K>['indeterminate']>;
    'rowKeyChanged': JetElementCustomEventStrict<SelectorElement<K>['rowKey']>;
    'selectedKeysChanged': JetElementCustomEventStrict<SelectorElement<K>['selectedKeys']>;
    'selectionModeChanged': JetElementCustomEventStrict<SelectorElement<K>['selectionMode']>;
}
export interface SelectorElementSettableProperties<Key> extends JetSettableProperties {
    /**
     * Specifies if the selector should show the visual partial state.
     * The original checked state of the selector will still be maintained.
     * User selection of checkboxes will remove the indeterminate state and reveal the checkbox state.
     * Otherwise, programmatically changing the checkbox state will not change the indeterminate state.
     */
    indeterminate?: Props<Key>['indeterminate'];
    rowKey?: Props<Key>['rowKey'];
    selectedKeys: Props<Key>['selectedKeys'];
    /**
     * Specifies the selection mode ('single', 'multiple', 'all'). 'all' should only be used for the select all case and will ignore the key property.
     */
    selectionMode?: Props<Key>['selectionMode'];
}
export interface SelectorElementSettablePropertiesLenient<Key> extends Partial<SelectorElementSettableProperties<Key>> {
    [key: string]: any;
}
export interface SelectorIntrinsicProps extends Partial<Readonly<SelectorElementSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onindeterminateChanged?: (value: SelectorElementEventMap<any>['indeterminateChanged']) => void;
    onrowKeyChanged?: (value: SelectorElementEventMap<any>['rowKeyChanged']) => void;
    onselectedKeysChanged?: (value: SelectorElementEventMap<any>['selectedKeysChanged']) => void;
    onselectionModeChanged?: (value: SelectorElementEventMap<any>['selectionModeChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-selector': SelectorIntrinsicProps;
        }
    }
}
