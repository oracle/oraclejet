import 'preact/compat';



export * from './customElement';
export { Slot, TemplateSlot, DynamicSlots, DynamicTemplateSlots, PropertyChanged, ReadOnlyPropertyChanged, Action, CancelableAction, Bubbles, ExtendGlobalProps, GlobalProps, ObservedGlobalProps, ElementReadOnly, ImplicitBusyContext } from './metadataTypes';
export { method, consumedContexts } from './dtDecorators';

declare const getUniqueId: () => string;
export { getUniqueId };
export { Root } from './root';