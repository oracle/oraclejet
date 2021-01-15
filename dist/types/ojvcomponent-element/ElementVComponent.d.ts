/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { VComponent } from 'ojs/ojvcomponent';
import { GlobalAttributes } from 'ojs/oj-jsx-interfaces';
export declare abstract class ElementVComponent<P extends object = any, S extends object = any> extends VComponent<P, S> {
    protected _vprops?: P & GlobalAttributes;
}
export declare namespace ElementVComponent {
    type DynamicSlots = Record<string, Slot>;
    type DynamicTemplateSlots<Data extends object> = Record<string, TemplateSlot<Data>>;
    type Slot = VNode | VNode[];
    type TemplateSlot<Data extends object> = (data: Data) => Slot;
    type PropertyChanged<T> = (value: T) => void;
    type RootProps = Record<string, any>;
    type VNode = VComponent.VNode;
    type VNodeType<P extends object> = VComponent.VNodeType<P>;
    type VComponentClass<P extends object> = VComponent.VComponentClass<P>;
    type RefCallback = VComponent.RefCallback;
    type RenderFunction<P extends object> = VComponent.RenderFunction<P>;
    type Children = VComponent.Children;
    type Action<Detail extends object = {}> = VComponent.Action<Detail>;
    type CancelableAction<Detail extends object = {}> = VComponent.CancelableAction<Detail>;
}
export declare const flattenChildren: (children: ElementVComponent.Children | ElementVComponent.Slot | ElementVComponent.VNode | ElementVComponent.VNode[] | null) => Readonly<ElementVComponent.VNode[]>;
