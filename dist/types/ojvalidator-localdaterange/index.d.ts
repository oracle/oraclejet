export class LocalDateRangeValidator {
    constructor(options?: LocalDateRangeValidator.ValidatorOptions);
    validate(value: string): void;
}
export namespace LocalDateRangeValidator {
    // tslint:disable-next-line interface-over-type-literal
    type DateISOStr = string;
    // tslint:disable-next-line interface-over-type-literal
    type FormatterObj = {
        format: ((value: string) => string);
    };
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        formatObj: FormatterObj;
        max?: DateISOStr;
        min?: DateISOStr;
        rangeOverflowMessageDetail?: string;
        rangeUnderflowMessageDetail?: string;
    };
}
