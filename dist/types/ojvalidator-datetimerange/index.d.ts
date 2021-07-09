import { DateTimeConverter } from '../ojconverter-datetime';
import Validator = require('../ojvalidator');
declare class DateTimeRangeValidator implements Validator<string> {
    constructor(options?: DateTimeRangeValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: string): void;
}
declare namespace DateTimeRangeValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        converter: DateTimeConverter;
        hint?: {
            inRange?: string;
            max?: string;
            min?: string;
        };
        max?: string;
        messageDetail?: {
            rangeOverflow?: string;
            rangeUnderflow?: string;
        };
        messageSummary?: {
            rangeOverflow?: string;
            rangeUnderflow?: string;
        };
        min?: string;
        translationKey?: string;
    };
}
export = DateTimeRangeValidator;
