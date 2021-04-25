// ---------- CELLS ----------

export class Cell {
    constructor(value, colspan=1, rowspan=1) {
        this.value = value;
        this.colspan = colspan;
        this.rowspan = rowspan;
    }

    static fromPair(first, second, colspan=1, rowspan=1) {
        return new Cell([first, second], colspan, rowspan);
    }

    static withValue(value) {
        return new Cell(value);
    }

    toString() {
        return "[Cell value=" + this.value + "]";
    }
}

export class HeadingCell extends Cell {
    constructor(value, colspan=1, rowspan=1) {
        super(value, colspan, rowspan);
        this.type = "heading";
    }

    toString() {
        return "[HeadingCell value=" + this.value + "]";
    }

    static from(value, colspan=1, rowspan=1) {
        return new HeadingCell(value, colspan, rowspan);
    }
}

export class SpannedCell extends Cell {
    static INSTANCE = new SpannedCell();

    constructor(colspan=1, rowspan=1) {
        super(undefined, colspan, rowspan);
    }

    toString() {
        return "[SpannedCell]";
    }

    static withSpan(colspan, rowspan) {
        return new SpannedCell(colspan, rowspan);
    }
}


export class EmptyCell extends Cell {
    static INSTANCE = new EmptyCell();

    constructor(colspan=1, rowspan=1) {
        super(undefined, colspan, rowspan);
    }

    toString() {
        return "[EmptyCell]";
    }

    static withSpan(colspan, rowspan) {
        return new EmptyCell(colspan, rowspan);
    }
}

// ---------- TABLES ----------

export class Table extends Cell {
    constructor(value, colspan=1, rowspan=1) {
        super(value, colspan, rowspan);
        // TODO: check for valid values: arrays of arrays of cells
    }
}


/**
 * A row major array of arrays with some utility methods concerning Cells.
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
