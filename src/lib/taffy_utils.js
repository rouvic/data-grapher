import {TreeNode} from "./trees";

export function buildDistinctFilterTree(columnName, possibleValues) {
    let root = new TreeNode(new LabeledFilter("any " + columnName, new TaffyFilter({})));

    for (let possibleValue of possibleValues) {
        let filter = TaffyFilter.columnsAre(columnName, possibleValue);
        let leafValue = new LabeledFilter(possibleValue, filter);
        root.children.push(new TreeNode(leafValue));
    }

    return root;
}

/**
 * @returns {TreeNode} A filter tree containing range filters based on the given column and parameters.
 */
export function buildIntegerRangeFilterTree(columnName, start, end, step) {
    if (isNaN(start) || isNaN(end) || isNaN(step)) {
        throw "Parameters must be numbers.";
    }

    if (start > end) {
        let temp = end;
        end = start;
        start = temp;
    }

    let root = new TreeNode(new LabeledFilter("any " + columnName, new TaffyFilter({})));

    let steps = (end - start) / step;
    console.log(steps);
    let min, max;
    for (let i = 0; i < steps; i++) {
        min = start + i*step;
        max = Math.min(min + step, end);
        let label = min + " - " + max;
        let filter = TaffyFilter.columnWithOperator(columnName, "gte", min).and(TaffyFilter.columnWithOperator(columnName, "lt", max));
        let rangeFilterNode = new TreeNode(new LabeledFilter(label, filter));
        root.children.push(rangeFilterNode);
    }

    return root;
}

export class LabeledFilter {
    constructor(label, filter) {
        this.label = label;
        this.filter = filter;
    }

    toString() {
        return this.label + " : " + this.filter;
    }
}

export class TaffyFilter {
    constructor(raw) {
        this.value = raw;
        this.type = "raw";
    }

    filter(query) {
        return query.filter(this.value);
    }

    toString() {
        return "(TaffyFilterRaw " + JSON.stringify(this.value) + ")";
    }

    and(filter) {
        return new TaffyAndFilter([this, filter]);
    }

    static columnsAre(...args) {
        const raw = {};

        for (let i = 0; i + 1 < args.length; i += 2) {
            raw[args[i]] = {};
            raw[args[i]]["is"] = args[i + 1];
        }

        return new TaffyFilter(raw);
    }

    static columnWithOperator(column, operator, value) {
        const raw = {};
        raw[column] = {};
        raw[column][operator] = value;
        return new TaffyFilter(raw);
    }

    static any() {
        return new TaffyFilter({});
    }
}

export class TaffyAndFilter extends TaffyFilter {
    constructor(array) {
        super(array);
        this.type = "and";
    }

    filter(query) {
        let result = query;

        for (let x of this.value) {
            if (x instanceof TaffyFilter) {
                result = x.filter(result);
            }
            else {
                result = result.filter(x);
            }
        }

        return result;
    }

    toString() {
        return "(TaffyFilterAnd " + JSON.stringify(this.value) + ")";
    }
}

export class TaffyOrFilter extends TaffyFilter {
    constructor(array) {
        super(array);
        this.type = "or";
    }

    filter(query) {
        return query.filter(this.value);
    }

    toString() {
        return "(TaffyFilterOr " + JSON.stringify(this.value) + ")";
    }
}

export class TaffyDateRangeFilter extends TaffyFilter {

    constructor(start, end) {
        super("");
        this.start = start;
        this.end = end;
        this.type = "DateRange";
    }

    filter(query) {
        let that = this;
        return query.filter(function () {
            if (this.date) {
                if (Array.isArray(this.date)) {
                    for (let d of this.date) {
                        if (that.start <= d && d <= that.end) {
                            return true;
                        }
                    }
                }
                else {
                    return that.start <= this.date && this.date <= that.end;
                }
            }
            else if (this.date_of_birth) {
                let dob = Date.parse(this.date_of_birth);

                if (!this.date_of_death) {
                    return dob <= that.end;
                }

                let dod = Date.parse(this.date_of_death);

                return (dob >= that.start && dob <= that.end) ||
                    (that.start >= dob && that.start <= dod);
            }

            return false;
        });
    }

    toString() {
        return "[" + this.start.toDateString() + " - " + this.end.toDateString() + "]";
    }
}

export function buildDateRanges(startYear, endYear, step) {
    let tree = new TreeNode(new LabeledFilter("Date", TaffyFilter.any()));

    for (let i = startYear; i < endYear; i += step) {
        let filter = new TaffyDateRangeFilter(new Date("" + i), new Date("" + (i + 10)));
        let labeledFilter = new LabeledFilter(i, filter);
        tree.children.push(new TreeNode(labeledFilter));
    }

    return tree;
}

// --- TAFFY UTILS ---

/**
 * Returns a TaffyDB filter based on the given pairs of (key, value). Ex: comlumnFilter("date", 1913, "composer", "Ravel").
 */

export function columns(db) {
    let columns = [];
    db({}).each(record => {
        for (let key of Object.keys(record)) {
            if (!columns.includes(key)) {
                columns.push(key);
            }
        }
    });
    return columns;
}

