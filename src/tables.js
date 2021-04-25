import {TreeNode} from "./lib";

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

export class SubTableCell extends Cell {

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
        return new EmptyCell(colspan, rowspan);
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

    amountOfRows() {
        return this.value.length;
    }

    flatten() {
        // If this is a single cell Table, return the cell.
        if (this.value.length === 1 && this.value[0].length === 1) {
            return this.value[0][0];
        }

        let result = [];

        for (let row of this.value) {
            let maxSubRows = Math.max(...row.map(cell => cell instanceof Table ? cell.amountOfRows() : 1));
            console.log("maxSubRows = " + maxSubRows);

            for (let i = 0; i < maxSubRows; i++) {
                let subRow = [];

                result.push(subRow);
            }
        }

        return new Table(result);
    }

    flattenColumn(index) {

    }
}


/**
 * Builds a 2 dimensional array containing {Cell} objects or a single {Cell} object if none of the given trees have children.
 */
export function buildTableFromTrees(vertical, horizontal, horizontalHeading=false, verticalHeading=false, cellSupplier=Cell.fromPair) {
    let rows = [];

    let verticalChildren = vertical.hasAnyChild();
    let horizontalChildren = horizontal.hasAnyChild();

    if (!verticalChildren && !horizontalChildren) {

        return cellSupplier.apply([vertical, horizontal]);
    }
    else if (!verticalChildren && horizontalChildren) {
        let row = [];

        for (let h of horizontal.children) {
            row.push(buildTableFromTrees(vertical, h));
        }

        rows.push(row);
    }
    else if (verticalChildren && !horizontalChildren) {
        for (let v of vertical.children) {
            rows.push([buildTableFromTrees(v, horizontal)]);
        }
    }
    else {
        // Both have children

        for (let v of vertical.children) {
            let row = [];

            for (let h of horizontal.children) {
                row.push(buildTableFromTrees(v, h));
            }

            rows.push(row);
        }
    }

    if (horizontalHeading) {

        let test = function (v, h) {
            console.log("hey my lambda is called");
            return new HeadingCell(h);
        }                                  ;

        let heading = buildTableFromTrees(new TreeNode(""), horizontal, false, false, test);
        heading.colspan = rows[0].length;

        rows.unshift([EmptyCell.INSTANCE, heading]);
    }

    // headings
    // TODO: optimize and make this code easier using matrices for tables representation (allows transposing...)
    let horizontalDepth = horizontal.depth();
    let verticalDepth = vertical.depth();
    let verticalHeadingNeededColumns = 1 + vertical.depth();
    let horizontalHeadingNeededRows = 1 + horizontal.depth();

    // if (horizontalHeading) {
    //     let horizontalHeadingRows = [];
    //
    //     for (let depth = 0; depth <= horizontalDepth; depth++) {
    //         let row = [];
    //
    //         for (let child of horizontal.childrenAtDepth(depth)) {
    //             let colspan = child.leavesCount();
                // let colspan = 1;
                // let rowspan = 1;
                // if (child.isLeaf()) {
                //     rowspan = horizontalDepth - depth + 1; // we add 1 because the rowspan starts at 1.
                // }
                //
                // row.push(HeadingCell.from(child, colspan, rowspan));
            // }
            // horizontalHeadingRows.push(row);
        // }
        //
        // if (verticalHeading) {
        //     horizontalHeadingRows[0].unshift(EmptyCell.withSpan(verticalHeadingNeededColumns, horizontalHeadingNeededRows));
        // }
        //
        // for (let i = 0; i < horizontalHeadingRows.length; i++) {
        //     rows.unshift(horizontalHeadingRows[i]);
        // }
    //
    // }
    //
    //
    // if (verticalHeading) {
    //     console.log("rows.length = " + rows.length);
    //     console.log(rows);
    //     Since the table is row major, we have to unshift to the existing rows.
    //     We loop backwards because of the use of unshift method on rows.
        // for (let depth = verticalDepth; depth >= 0; depth--) {
        //     console.log("---- depth = " + depth);
        //     let rowIndex = 0;
        //
        //     if (horizontalHeading) {
        //         rowIndex += horizontalHeadingNeededRows;
        //     }
        //
        //     for (let child of vertical.childrenAtDepth(depth)) {
        //         let rowspan = child.leavesCount();
        //         let colspan = 1;
        //         if (child.isLeaf()) {
        //             colspan = verticalDepth - depth + 1; // we add 1 because the colspan starts at 1.
        //         }
        //
        //
        //
        //         console.log("rowI for " + child.value.label + " : " + rowIndex);
        //         console.log("rowspan =" + rowspan);
        //
        //         rows[rowIndex].unshift(HeadingCell.from(child, colspan, rowspan));
        //
        //
        //
        //         rowIndex += rowspan;
        //     }
        // }
    // }

    return new Table(rows);
}
