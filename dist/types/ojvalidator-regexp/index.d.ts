import Validator = require('../ojvalidator');
declare class RegExpValidator implements Validator<string | number> {
    constructor(options?: RegExpValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: string | number): void;
}
declare namespace RegExpValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        hint?: string;
        label?: string;
        messageDetail?: string;
        messageSummary?: string;
        pattern?: string;
    };
}
export = RegExpValidator;
