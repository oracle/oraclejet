/**
 * Generates random string that can be used as ID. Serves as replacement for
 * getUniqueId() function from "ojs/ojvcomponent-preact", until React 18 is
 * released with useId hook (https://github.com/preactjs/preact/issues/3373).
 * 1. Pick a random number in the range between 0 (inclusive) and 1 (exclusive)
 * 2. Convert the number to a base-36 string (using characters 0-9 and a-z)
 * 3. Slice off the leading '0.' prefix
 */
const useId = () => Math.random().toString(36).slice(2); //@RandomNumberOK

export { useId };
