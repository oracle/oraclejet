import type { Ref } from 'preact/hooks';
export declare function getValue(pageX: number, max: number, step: number, dimensionsRef: Ref<{
    width: number;
    x: number;
}>, isRtl: boolean): number;
export declare function getDimensions(element: HTMLElement | null): {
    width: number;
    x: number;
};
