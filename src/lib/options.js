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
        this.displayText = scripts.get("built-in:name_and_dates_displayer");
        this.backgroundColor = scripts.get("built-in:default_background");

        this.horizontalFilterTree = new TreeNode(new LabeledFilter("any", TaffyFilter.any()));

    }
}
