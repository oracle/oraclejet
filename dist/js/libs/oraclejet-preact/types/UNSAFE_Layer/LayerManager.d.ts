/**
 * The LayerManager wraps your application and creates two adjacent divs for
 * rendering your application and housing Layers.
 */
import { ComponentChildren } from 'preact';
declare type LayerManagerProps = {
    children?: ComponentChildren;
};
export declare function LayerManager({ children }: LayerManagerProps): import("preact").JSX.Element;
export {};
