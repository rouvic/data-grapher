import {writable} from "svelte/store";
import {Script, Parameter} from "../lib/scripts";
import {Options} from "./options";

export class Registry extends Map {
    constructor() {
        super();
    }

    keyOf(value) {
        for (let elem of this.entries()) {
            if (value === elem[1]) {
                return elem[0];
            }
        }

        return undefined;
    }

    domains() {
        let domains = Array.from(this.keys()).map(key => key.substring(0, key.lastIndexOf(":")));
        domains = new Set(domains);
        return domains;
    }

    allOf(domain, recursive=false) {
        let filter = entry => entry[0].startsWith(domain + ":") && (recursive || entry[0].lastIndexOf(":") === domain.length);

        return [...this.entries()].filter(filter);
    }
}

// Scripts declared first because new Options() usually needs this to be defined.
export const scripts = new Registry();

scripts.set("built-in:raw_displayer", new Script("Raw displayer", "Returns the raw record object", "return record;", [new Parameter("record", "The record to be displayed")]));
scripts.set("built-in:json_displayer", new Script("JSON displayer", "Returns the record JSON representation", "return JSON.stringify(record);", [new Parameter("record", "The record to be displayed")]));
scripts.set("built-in:name_displayer", new Script("Name displayer", "Returns the record's \"name\" attribute", "return record.name;", [new Parameter("record", "The record to be displayed")]));
scripts.set("built-in:name_and_dates_displayer", new Script("Name and dates displayer", "Returns the name and dates of existence", "return record.name + \" (\" + record.date_of_birth + \" - \" + record.date_of_death + \")\";", [new Parameter("record", "The record to be displayed")]));

export const dataSources = writable([]);
export const dataStore = writable(TAFFY());

export const graphOptions = writable(new Options());


// UTILS
/**
 * Returns true whether the given string is empty.
 */
export function isEmpty(str) {
    return (!str || /^\s*$/.test(str));
}

