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
        hint?: {
            exact?: string;
            inRange?: string;
            max?: string;
            min?: string;
        };
        max?: number;
        messageDetail?: {
            tooLong?: string;
            tooShort?: string;
        };
        messageSummary?: {
            tooLong?: string;
            tooShort?: string;
        };
        min?: number;
    };
}
export = LengthValidator;
