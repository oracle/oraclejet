import DateRestrictionValidator = require('../ojvalidator-daterestriction');
import AsyncValidator = require('../ojvalidator-async');
declare class AsyncDateRestrictionValidator<V> implements AsyncValidator<V> {
    hint: Promise<(string | null)>;
    constructor(options?: DateRestrictionValidator.ValidatorOptions);
    validate(value: V): Promise<void>;
}
export = AsyncDateRestrictionValidator;
