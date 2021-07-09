export function pickFiles(callback: (files: FileList) => void, fileOptions: FileOptions): any;
// tslint:disable-next-line interface-over-type-literal
export type FileOptions = {
    accept: string[];
    capture: 'user' | 'environment' | 'implementation' | 'none';
    selectionMode: 'single' | 'multiple';
};
