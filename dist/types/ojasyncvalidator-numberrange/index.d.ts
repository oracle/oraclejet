import NumberRangeValidator = require('../ojvalidator-numberrange');
import AsyncValidator = require('../ojvalidator-async');
declare class AsyncNumberRangeValidator<V> implements AsyncValidator<V> {
    hint: Promise<(string | null)>;
    constructor(options?: NumberRangeValidator.ValidatorOptions);
    validate(value: V): Promise<void>;
}
export = AsyncNumberRangeValidator;
