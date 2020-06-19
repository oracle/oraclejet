/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { ProgressItem } from 'ojs/ojprogresslist';
export interface FileUploadTransport {
    flush(): void;
    queue(fileList: FileList): ProgressItem[];
}
