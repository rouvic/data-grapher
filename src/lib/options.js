import {TreeNode}  from "./trees";
import {LabeledFilter, TaffyFilter} from "./taffy_utils";
import {scripts} from "./common";

export class Options {

    constructor() {
        this.horizontalFilterTree = new TreeNode(new LabeledFilter("any", TaffyFilter.any()));
        this.horizontalHeadingVisible = true;
        this.verticalFilterTree = new TreeNode(new LabeledFilter("any", TaffyFilter.any()));
        this.verticalHeadingVisible = true;
        this.allowColumnSpan = true;
        this.globalFilter = "{}";
        this.displayer = scripts.get("built-in:name_and_dates_displayer");

        this.horizontalFilterTree = new TreeNode(new LabeledFilter("any", TaffyFilter.any()));

        // this.verticalFilterTree = new TreeNode(new LabeledFilter("any composer", TaffyFilter.any()));
        // let french = new TreeNode(new LabeledFilter("french composer"), TaffyFilter.any());
        // french.children.push(new TreeNode(new LabeledFilter("Berlioz", TaffyFilter.columnsAre("composer", "Berlioz"))));
        // french.children.push(new TreeNode(new LabeledFilter("Debussy", TaffyFilter.columnsAre("composer", "Debussy"))));
        // french.children.push(new TreeNode(new LabeledFilter("Ravel", TaffyFilter.columnsAre("composer", "Ravel"))));
        // this.verticalFilterTree.children.push(french);
        // this.verticalFilterTree.children.push(new TreeNode(new LabeledFilter("Schönberg", TaffyFilter.columnsAre("composer", "Schönberg"))));
        // this.verticalFilterTree.children.push(new TreeNode(new LabeledFilter("Stravinsky", TaffyFilter.columnsAre("composer", "Stravinsky"))));
    }
}
