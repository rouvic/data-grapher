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
