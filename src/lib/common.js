/**
 * Returns true whether the given string is empty.
 */
export function isEmpty(str) {
    return (!str || /^\s*$/.test(str));
}
