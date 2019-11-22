import DateTimeRangeValidator = require('../ojvalidator-datetimerange');
import AsyncValidator = require('../ojvalidator-async');
declare class AsyncDateTimeRangeValidator<V> implements AsyncValidator<V> {
    hint: Promise<(string | null)>;
    constructor(options?: DateTimeRangeValidator.ValidatorOptions);
    validate(value: V): Promise<void>;
}
export = AsyncDateTimeRangeValidator;
