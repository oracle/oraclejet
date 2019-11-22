import Validator = require('../ojvalidator');
declare class RequiredValidator implements Validator<object | string | number> {
    constructor(options?: RequiredValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: object | string | number): void;
}
declare namespace RequiredValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        hint?: string;
        label?: string;
        messageSummary?: string;
        messageDetail?: string;
    };
}
export = RequiredValidator;
