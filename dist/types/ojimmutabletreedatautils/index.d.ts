export function addNode<K, D>(baseArray: D[], path: number[], newData: D, childrenAttribute?: string): D[];
export function findPathByData<K, D>(baseArray: D[], data: D, childrenAttribute?: string): number[];
export function removeNode<K, D>(baseArray: D[], path: number[], childrenAttribute?: string): D[];
export function replaceNode<K, D>(baseArray: D[], path: number[], newData: D, childrenAttribute?: string): D[];
export function spliceNode<K, D>(baseArray: D[], path: number[], newData?: D, childrenArrayIndex?: number, deleteCount?: number, childrenAttribute?: string): D[];
