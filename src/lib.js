// --- DATA SOURCES ---
export class DataSource {
    toTaffy() {
        return TAFFY();
    }
}

export class HardCoded1 extends DataSource {
    toTaffy() {
        let taffy = TAFFY();

        // Input data
        taffy().remove();

        // Berlioz
        taffy.insert({title: "Symphonie fantastique", date: 1830, composer: "Berlioz"});

        // Debussy
        taffy.insert({title: "La Mer", date: 1905, composer: "Debussy"});

        // Schönberg
        taffy.insert({title: "Pierrot lunaire", date: 1912, composer: "Schönberg"});

        // Ravel
        taffy.insert({title: "Daphnis et Chloe", date: 1912, composer: "Ravel"});
        taffy.insert({title: "Ma mère l'Oye", date: 1910, composer: "Ravel"});
        taffy.insert({title: "Valses nobles et sentimentales", date: 1911, composer: "Ravel"});
        taffy.insert({title: "Histoires naturelles", date: 1906, composer: "Ravel"});
        taffy.insert({title: "Gaspard de la nuit", date: 1908, composer: "Ravel"});
        taffy.insert({title: "Rhapsodie espagnole", date: 1908, composer: "Ravel"});
        taffy.insert({title: "Trois poèmes de Mallarmés", date: 1913, composer: "Ravel"});

        // Stravinsky
        taffy.insert({title: "L'oiseau de feu", date: 1910, composer: "Stravinsky"});
        taffy.insert({title: "Le Sacre du Printemps", date: 1913, composer: "Stravinsky"});
        taffy.insert({title: "Petrouchka", date: 1911, composer: "Stravinsky"});
        taffy.insert({title: "Renard", date: 1916, composer: "Stravinsky"});
        taffy.insert({title: "Le Rossignol", date: 1914, composer: "Stravinsky"});
        taffy.insert({title: "Le Chant du Rossignol", date: 1917, composer: "Stravinsky"});
        taffy.insert({title: "L'Histoire du Soldat", date: 1917, composer: "Stravinsky"});
        return taffy;
    }
}

export class HardCoded2 extends DataSource {
    toTaffy() {
        let taffy = TAFFY();

        // Input data
        taffy().remove();

        // Berlioz
        taffy.insert({title: "Symphonie fantastique", date: "1830", composer: "Berlioz"});

        // Debussy
        taffy.insert({title: "La Mer", date: "1905", composer: "Debussy"});

        // Schönberg
        taffy.insert({title: "Pierrot lunaire", date: "1912", composer: "Schönberg"});

        // Ravel
        taffy.insert({title: "Daphnis et Chloe", date: "1912", composer: "Ravel"});
        taffy.insert({title: "Ma mère l'Oye", date: "1910", composer: "Ravel"});
        taffy.insert({title: "Valses nobles et sentimentales", date: "1911", composer: "Ravel"});
        taffy.insert({title: "Histoires naturelles", date: "1906", composer: "Ravel"});
        taffy.insert({title: "Gaspard de la nuit", date: "1908", composer: "Ravel"});
        taffy.insert({title: "Rhapsodie espagnole", date: "1908", composer: "Ravel"});
        taffy.insert({title: "Trois poèmes de Mallarmés", date: "1913", composer: "Ravel"});

        // Stravinsky
        taffy.insert({title: "L'oiseau de feu", date: "1910", composer: "Stravinsky"});
        taffy.insert({title: "Le Sacre du Printemps", date: "1913", composer: "Stravinsky"});
        taffy.insert({title: "Petrouchka", date: "1911", composer: "Stravinsky"});
        taffy.insert({title: "Renard", date: "1916", composer: "Stravinsky"});
        taffy.insert({title: "Le Rossignol", date: "1914", composer: "Stravinsky"});
        taffy.insert({title: "Le Chant du Rossignol", date: "1917", composer: "Stravinsky"});
        taffy.insert({title: "L'Histoire du Soldat", date: "1917", composer: "Stravinsky"});
        return taffy;
    }
}


// ----------------------------------------------------------
// --- UTILS ---
// ----------------------------------------------------------

// --- TREES ---
export class TreeNode {
    constructor(value) {
        this.value = value;
        this.children = [];
    }

    hasAnyChild() {
        return this.children.length > 0;
    }

    isLeaf() {
        return !this.hasAnyChild();
    }

    /**
     * A really not optimized way to get leaves of a tree (recursive).
     * @returns {TreeNode[]}
     */
    leaves() {
        if (this.isLeaf()) {
            return [this];
        }
        else {
            return this.children.flatMap(child => child.leaves());
        }
    }

    /**
     * @returns {number} the amount of leaves in this tree.
     */
    leavesCount() {
        return this.leaves().length;
    }

    /**
     * @returns {number} the length of the longest possible branch in this tree (0 if this is a leaf)
     */
    depth() {
        if (this.isLeaf()) {
            return 0;
        }
        else {
            return 1 + Math.max(...this.children.map(child => child.depth()));
        }
    }

    /**
     * Recursive.
     * @param depth A positive integer
     * @param exactDepth
     * @returns {TreeNode[]}
     */
    childrenAtDepth(depth, exactDepth=true) {
        if (depth < 0) {
            return undefined;
        }

        if (depth === 0) {
            return [this];
        }
        else {
            // depth > 0
            if (!this.hasAnyChild()) {
                if (exactDepth) {
                    return [];
                }
                else {
                    return [this];
                }
            }
            else {
                return this.children.flatMap(child => child.childrenAtDepth(depth - 1, exactDepth));
            }
        }
    }
}

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
        return query().filter(this.value);
    }

    toString() {
        return "(TaffyFilterOr " + JSON.stringify(this.value) + ")";
    }
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


// --- OTHERS ---
export function isEmpty(str) {
    return (!str || /^\s*$/.test(str));
}

export function transpose(array) {
}

import {EmptyCell, SpannedCell} from "./tables";

/**
 * A row major table with some utility methods concerning Cells.
 */
export class BeingComputedTable {
    static EMPTY_VALUE = EmptyCell.INSTANCE;

    constructor(rows, columns) {
        this.value = [];
        for (let i = 0; i < rows; i++) {
            let emptyRow = [];

            for (let j = 0; j < columns; j++) {
                emptyRow.push(BeingComputedTable.EMPTY_VALUE);
            }

            this.value.push(emptyRow);
        }
    }

    row(index) {
        return this.value[index];
    }

    column(index) {
        let result = [];

        for (let i = 0; i < this.value.length; i++) {
            result.push(this.value[i][index]);
        }

        return result;
    }

    get(row, column) {
        return this.value[row][column];
    }

    insertInColumn(column, value) {
        let row = this.column(column).indexOf(BeingComputedTable.EMPTY_VALUE);
        this.set(row, column, value);
        return this;
    }

    set(row, column, cell) {
        for (let i = 0; i < cell.colspan; i++) {
            for (let j = 0; j < cell.rowspan; j++) {
                this.value[row + j][column + i] = SpannedCell.INSTANCE;
            }
        }

        this.value[row][column] = cell;

        return this;
    }

    getValue() {
        return this.value;
    }
}
