import { ComponentProps, ComponentType, Ref } from 'preact';
/**
 * Extracts the type of the ref prop of the component
 * @typedef C The type of the component
 * @typedef P The property of the component that holds the handle ref
 */
export declare type Handle<C extends ComponentType<any>, P extends keyof ComponentProps<C>> = Pick<ComponentProps<C>, P>[P] extends Ref<infer T> | undefined ? T : never;
