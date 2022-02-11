declare type PropFormat = 'severity' | 'string' | 'timestamp';
/**
 * Checks if the provided value is valid for the prop specified.
 * By default, this method just checks for the value to be a valid string.
 *
 * @param value The value to be checked
 * @param prop The property for which the value needs to be evaluated
 *
 * @returns the result of the validation
 */
declare function isValidValueForProp<T>(value: T | null | undefined, prop?: PropFormat): value is T;
/**
 * Formats the timestamp in the required format based on the current
 * locale.
 *
 * @param isoTime Timestamp in ISO format
 */
declare function formatTimestamp(isoTime: string): string;
export { formatTimestamp, isValidValueForProp };
