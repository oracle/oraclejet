/**
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Floating UI contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { MutableRef } from 'preact/hooks';
import { ComputePositionConfig, ComputePositionReturn } from '@floating-ui/core';
import { Middleware } from '@floating-ui/dom';
export { autoPlacement, flip, hide, shift, limitShift, size, inline, detectOverflow } from '@floating-ui/dom';
export declare type Coords = {
    [key in Axis]: number;
};
export declare type Placement = 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'right-start' | 'bottom-start' | 'left-start' | 'top-end' | 'right-end' | 'bottom-end' | 'left-end';
declare type Side = 'top' | 'right' | 'bottom' | 'left';
declare type Axis = 'x' | 'y';
declare type Length = 'width' | 'height';
declare type Dimensions = {
    [key in Length]: number;
};
declare type SideObject = {
    [key in Side]: number;
};
export declare type Rect = Coords & Dimensions;
export declare type OffsetValue = number | {
    mainAxis?: number;
    crossAxis?: number;
};
export declare type OffsetFunction = (args: {
    floating: Rect;
    reference: Rect;
    placement: Placement;
}) => OffsetValue;
export declare type Offset = OffsetValue | OffsetFunction;
export declare const offset: (value?: Offset | undefined) => Middleware;
export declare type ClientRectObject = Rect & SideObject;
export declare type VirtualElement = {
    getBoundingClientRect(): ClientRectObject;
    contextElement?: any;
};
declare type ReferenceType = Element | VirtualElement;
declare type UseFloatingProps<RT extends ReferenceType = ReferenceType> = Omit<Partial<ComputePositionConfig>, 'platform'> & {
    whileElementsMounted?: (reference: RT, floating: HTMLElement, update: () => void) => void | (() => void);
};
declare type UseFloatingData = Omit<ComputePositionReturn, 'x' | 'y'> & {
    x: number | null;
    y: number | null;
};
declare type UseFloatingReturn<RT extends ReferenceType = ReferenceType> = UseFloatingData & {
    update: () => void;
    reference: (node: RT | null) => void;
    floating: (node: HTMLElement | null) => void;
    refs: {
        reference: MutableRef<RT | null>;
        floating: MutableRef<HTMLElement | null>;
    };
};
export declare function useFloating<RT extends ReferenceType = ReferenceType>({ middleware, placement, strategy, whileElementsMounted }: UseFloatingProps): UseFloatingReturn<RT>;
