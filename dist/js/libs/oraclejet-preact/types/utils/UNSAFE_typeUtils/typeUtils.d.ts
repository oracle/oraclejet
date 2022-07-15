import { ComponentProps, ComponentType, JSX, Ref } from 'preact';
/**
 * Extracts the type of the ref prop of the component
 * @typedef C The type of the component
 * @typedef P The property of the component that holds the handle ref
 */
export declare type Handle<C extends ComponentType<any>, P extends keyof ComponentProps<C>> = Pick<ComponentProps<C>, P>[P] extends Ref<infer T> | undefined ? T : never;
declare type Obj = Record<string, unknown>;
export declare type Merge<P1 = Obj, P2 = Obj> = Omit<P1, keyof P2> & P2;
export declare type ElementType = keyof JSX.IntrinsicElements;
export declare type IntrinsicElement<T extends ElementType> = JSX.IntrinsicElements[T];
export declare type StyleProps = Pick<JSX.HTMLAttributes, 'class' | 'className' | 'style'>;
export declare type StyledComponentProps<E extends ElementType, OwnProps = Obj> = Merge<IntrinsicElement<E>, OwnProps & StyleProps>;
export declare type WithRequired<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};
export {};
