import Validator = require('../ojvalidator');
declare class RegExpValidator implements Validator<string | number> {
    constructor(options?: RegExpValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: string | number): void;
}
declare namespace RegExpValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        pattern?: string;
        hint?: string;
        label?: string;
        messageSummary?: string;
        messageDetail?: string;
    };
}
export = RegExpValidator;
