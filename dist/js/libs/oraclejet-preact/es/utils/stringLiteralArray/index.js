// By default TS will infer `string[]` for an array so use this function to
// extract string literal unions. This will automatically type your array.
// Example:
// const dimensions1 = ["height", "width"]; // dimensions1 type is string[].
// const dimensions = stringLiteralArray(["height", "width"]);
// dimensions type is ("height"|"width")[] (an array that can only have "height" and "width" in it)
const stringLiteralArray = (xs) => xs;

export { stringLiteralArray };
