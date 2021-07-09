export interface DvtTimeComponentScale {
    name: string;
    formatter(date: string): string;
    getNextDate(date: string): string;
    getPreviousDate(date: string): string;
}
