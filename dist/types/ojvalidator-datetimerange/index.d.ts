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
        min?: string;
        max?: string;
        hint?: {
            max?: string;
            min?: string;
            inRange?: string;
        };
        translationKey?: string;
        messageDetail?: {
            rangeUnderflow?: string;
            rangeOverflow?: string;
        };
        messageSummary?: {
            rangeUnderflow?: string;
            rangeOverflow?: string;
        };
    };
}
export = DateTimeRangeValidator;
