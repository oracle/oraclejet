export interface DvtTimeComponentScale {
    labelPosition?: ("start" | "center" | "auto");
    name: string;
    formatter(date: string): string;
    getNextDate(date: string): string;
    getPreviousDate(date: string): string;
}
