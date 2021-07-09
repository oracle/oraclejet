import { ProgressItem } from 'ojs/ojprogresslist';
export interface FileUploadTransport {
    flush(): void;
    queue(fileList: FileList): ProgressItem[];
}
