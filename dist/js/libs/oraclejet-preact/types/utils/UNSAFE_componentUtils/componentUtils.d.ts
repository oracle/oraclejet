import { ComponentChildren } from 'preact';
/**
 * Adds components before a specific VNode
 * @param src The src component
 * @param items The items to be added before the source
 * @returns An array of components after performing the operation
 */
export declare function beforeVNode(src?: ComponentChildren, ...items: ComponentChildren[]): ComponentChildren;
