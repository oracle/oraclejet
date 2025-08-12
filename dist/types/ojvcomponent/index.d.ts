/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import 'preact/compat';




export * from './customElement';
export { Slot, TemplateSlot, DynamicSlots, DynamicTemplateSlots, PropertyChanged, ReadOnlyPropertyChanged, Action, CancelableAction, Bubbles, ExtendGlobalProps, GlobalProps, ObservedGlobalProps, ElementReadOnly, ImplicitBusyContext } from './metadataTypes';
export { method, consumedContexts } from './dtDecorators';

declare const getUniqueId: () => string;
export { getUniqueId };
export { Root } from './root';
export { ReportBusyContext } from './ReportBusyContext';