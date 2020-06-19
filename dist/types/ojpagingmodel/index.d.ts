/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export interface PagingModel {
    getEndItemIndex(): number;
    getPage(): number;
    getPageCount(): number;
    getStartItemIndex(): number;
    setPage(value: number, options?: object): Promise<any>;
    totalSize(): number;
    totalSizeConfidence(): string;
}
export namespace PagingModel {
    type EventType = "beforePage" | "page" | "pageCount";
}
