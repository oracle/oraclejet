import { UseAnimationCssProperties } from './animationUtils';
export declare type UseAnimationConfig<V extends string, E extends HTMLElement> = {
    animationStates: Partial<Record<AnimationStateKey<V>, ((node: E) => AnimationConfig) | AnimationConfig>>;
    isAnimatedOnMount?: boolean;
    onAnimationEnd?: ({ animationState }: {
        animationState: V;
    }) => void;
};
declare type AnimationStateKey<PA extends string> = ExtractAnimationStates<PA | `${PA} => ${PA}`>;
declare type ExtractAnimationStates<StateString extends string> = StateString extends `${infer From} => ${infer To}` ? KeyWithPreviousAndCurrentState<From, To> : StateString;
declare type KeyWithPreviousAndCurrentState<PreviousState extends string, CurrentState extends string> = {
    b: PreviousState;
} extends {
    b: CurrentState;
} ? never : `${PreviousState} => ${CurrentState}`;
declare type AnimationConfig = {
    from?: UseAnimationCssProperties;
    to: UseAnimationCssProperties;
    end?: UseAnimationCssProperties;
    options?: AnimationOptions;
};
declare type AnimationOptions = {
    delay?: number;
    duration?: number;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | [number, number, number, number];
};
declare type PermittedAnimationState<V extends string> = Exclude<V, `${string}=>${string}`>;
/**
 * Hook to animate single components.
 * It allows n number of animation states.
 * @param animationState
 * @param animationConfig
 * @returns
 */
export declare function useAnimation<V extends string, E extends HTMLElement = HTMLElement>(animationState: PermittedAnimationState<V>, { animationStates, isAnimatedOnMount, onAnimationEnd }: UseAnimationConfig<PermittedAnimationState<V>, E>): {
    nodeRef: import("preact/hooks").Ref<E>;
    controller: {
        cancel: () => void;
    };
};
export {};
