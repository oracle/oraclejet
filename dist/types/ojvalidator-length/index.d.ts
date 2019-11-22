import Validator = require('../ojvalidator');
declare class LengthValidator implements Validator<number | string> {
    static defaults: {
        countBy: string;
    };
    constructor(options?: LengthValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: string | number): void;
}
declare namespace LengthValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        countBy?: 'codeUnit' | 'codePoint';
        min?: number;
        max?: number;
        hint?: {
            max?: string;
            min?: string;
            inRange?: string;
            exact?: string;
        };
        messageDetail?: {
            tooLong?: string;
            tooShort?: string;
        };
        messageSummary?: {
            tooLong?: string;
            tooShort?: string;
        };
    };
}
export = LengthValidator;
