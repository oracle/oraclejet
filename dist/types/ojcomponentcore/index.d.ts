export function subtreeAttached(node: Element): void;
export function subtreeDetached(node: Element): void;
export function subtreeHidden(node: Node): void;
export function subtreeShown(node: Node, options?: {
    initialRender: boolean;
}): void;
