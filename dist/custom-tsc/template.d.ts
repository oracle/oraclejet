import * as _ from 'underscore';
/**
 * Underscore template helper.
 * @param {string} filepath - Templates directory.
 */
export declare class Template {
    path: string;
    cache: Record<string, any>;
    settings: _.TemplateSettings;
    constructor(filepath: string);
    /** Loads template from given file.
     * @param {string} file - Template filename.
     * @return {function} Returns template closure.
     */
    load(file: any): _.CompiledTemplate;
    /**
     * Renders template using given data.
     * This is low-level function, for rendering full templates use {@link Template.render()}.
     * @param {string} file - Template filename.
     * @param {object} data - Template variables (doesn't have to be object, but passing variables dictionary is best way and most common use).
     * @return {string} Rendered template.
     */
    partial(file: any, data: any): any;
    /**
     * Renders template with given data.
     * This method automaticaly applies layout if set.
     * @param {string} file - Template filename.
     * @param {object} data - Template variables (doesn't have to be object, but passing variables dictionary is best way and most common use).
     * @return {string} Rendered template.
     */
    render(file: any, data: any): any;
}
