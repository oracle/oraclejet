/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export function animateHero(element: Element, options: {
    toElementSelector: string;
    toElementWaitTime?: number;
    createClonedElement?: ((param0: HeroContext) => Element);
    hideFromAndToElements?: ((param0: HeroContext) => void);
    animateClonedElement?: ((param0: HeroContext) => Promise<any>);
    showToElement?: ((param0: HeroContext) => void);
    delay?: string;
    duration?: string;
    timingFunction?: string;
}): Promise<boolean>;
export function collapse(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    persist?: string;
    direction?: string;
    startMaxHeight?: string;
    endMaxHeight?: string;
    startMaxWidth?: string;
    endMaxWidth?: string;
}): Promise<boolean>;
export function expand(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    persist?: string;
    direction?: string;
    startMaxHeight?: string;
    endMaxHeight?: string;
    startMaxWidth?: string;
    endMaxWidth?: string;
}): Promise<boolean>;
export function fadeIn(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    persist?: string;
    startOpacity?: number;
    endOpacity?: number;
}): Promise<boolean>;
export function fadeOut(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    persist?: string;
    startOpacity?: number;
    endOpacity?: number;
}): Promise<boolean>;
export function flipIn(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    persist?: string;
    axis?: string;
    startAngle?: string;
    endAngle?: string;
    backfaceVisibility?: string;
    perspective?: string;
    transformOrigin?: string;
    flipTarget?: string;
}): Promise<boolean>;
export function flipOut(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    persist?: string;
    axis?: string;
    startAngle?: string;
    endAngle?: string;
    backfaceVisibility?: string;
    perspective?: string;
    transformOrigin?: string;
    flipTarget?: string;
}): Promise<boolean>;
export function ripple(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    offsetX?: string;
    offsetY?: string;
    color?: string;
    diameter?: string;
    startOpacity?: number;
    endOpacity?: number;
}): Promise<boolean>;
export function slideIn(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    persist?: string;
    direction?: string;
    offsetX?: string;
    offsetY?: string;
}): Promise<boolean>;
export function slideOut(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    persist?: string;
    direction?: string;
    offsetX?: string;
    offsetY?: string;
}): Promise<boolean>;
export function zoomIn(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    persist?: string;
    axis?: string;
    transformOrigin?: string;
}): Promise<boolean>;
export function zoomOut(element: Element, options?: {
    delay?: string;
    duration?: string;
    timingFunction?: string;
    persist?: string;
    axis?: string;
    transformOrigin?: string;
}): Promise<boolean>;
// tslint:disable-next-line interface-over-type-literal
export type AnimationMethods = 'collapse' | 'expand' | 'fadeIn' | 'fadeOut' | 'flipIn' | 'flipOut' | 'ripple' | 'slideIn' | 'slideOut' | 'zoomIn' | 'zoomOut';
// tslint:disable-next-line interface-over-type-literal
export type HeroContext = {
    fromElement: Element;
    toElement: Element;
    clonedElement: Element | null;
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    toElementElapsedTime: number;
};
