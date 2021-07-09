import { NumberConverter } from '../ojconverter-number';
import Validator = require('../ojvalidator');
declare class NumberRangeValidator implements Validator<string | number> {
    constructor(options?: NumberRangeValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: string | number): void;
}
declare namespace NumberRangeValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        converter?: NumberConverter;
        hint?: {
            exact?: string;
            inRange?: string;
            max?: string;
            min?: string;
        };
        max?: number;
        messageDetail?: {
            exact?: string;
            rangeOverflow?: string;
            rangeUnderflow?: string;
        };
        messageSummary?: {
            rangeOverflow?: string;
            rangeUnderflow?: string;
        };
        min?: number;
    };
}
export = NumberRangeValidator;
