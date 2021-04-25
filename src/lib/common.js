import {writable} from "svelte/store";

export const dataSources = writable(undefined);
export const data = writable(undefined);


export const graphOptions = writable(undefined);


// UTILS
/**
 * Returns true whether the given string is empty.
 */
export function isEmpty(str) {
    return (!str || /^\s*$/.test(str));
}

