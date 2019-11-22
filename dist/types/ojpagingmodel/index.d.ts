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
