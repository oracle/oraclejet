/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export function pickFiles(callback: (files: FileList) => void, fileOptions: FileOptions): any;
// tslint:disable-next-line interface-over-type-literal
export type FileOptions = {
    accept: string[];
    capture: 'user' | 'environment' | 'implementation' | 'none';
    selectionMode: 'single' | 'multiple';
};
