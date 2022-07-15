/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Item } from '../utils/UNSAFE_dataProvider';
declare type ItemTextFunctionType<K, D> = (itemContext: Item<K, D>) => string;
export declare type ItemTextType<K, D> = keyof D | ItemTextFunctionType<K, D>;
export declare function renderItemText<K, D>(item: Item<K, D>, itemText: ItemTextType<K, D>): string | D[keyof D & string] | undefined;
export {};
