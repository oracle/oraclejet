import Validator = require('../ojvalidator');
declare class RequiredValidator implements Validator<object | string | number> {
    constructor(options?: RequiredValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: any): void;
}
declare namespace RequiredValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        hint?: string;
        label?: string;
        messageDetail?: (string | (({ label: string }) => string));
        messageSummary?: string;
    };
}
export = RequiredValidator;
