import * as _ from 'underscore';
export declare class Template {
    path: string;
    cache: Record<string, any>;
    settings: _.TemplateSettings;
    constructor(filepath: string);
    load(file: any): _.CompiledTemplate;
    partial(file: any, data: any): any;
    render(file: any, data: any): any;
}
