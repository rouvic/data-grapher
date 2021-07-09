

import {dataSources, graphOptions} from "./common";
import {LabeledSource, FromURL} from "./data_sources";
import {TreeNode} from "./trees";
import {LabeledFilter, TaffyFilter} from "./taffy_utils";
import {Options} from "./options";

export function applyHistMaths() {

    let source = new FromURL();
    source.url = "https://raw.githubusercontent.com/rouvic/hist-maths/main/data.json";
    dataSources.set([new LabeledSource("vicrou github", source)]);

    let horizontalFilterTree = new TreeNode(new LabeledFilter("Date", TaffyFilter.any()));

    //

    class TaffyFuncFilter extends TaffyFilter {

        constructor(start, end) {
            super("");
            this.start = start;
            this.end = end;
            this.type = "custom";
        }

        filter(query) {
            let that = this;
            return query.filter(function () {
                let dob = Date.parse(this.date_of_birth);

                if (!this.date_of_death) {
                    return dob <= that.end;
                }

                let dod = Date.parse(this.date_of_death);

                return (dob >= that.start && dob <= that.end) ||
                    (that.start >= dob && that.start <= dod);
            });
        }
    }


    for (let i = 1600; i < 2020; i += 10) {
        let filter = new TaffyFuncFilter(Date.parse("" + i), Date.parse("" + (i + 10)));
        let labeledFilter = new LabeledFilter(i, filter);
        horizontalFilterTree.children.push(new TreeNode(labeledFilter));
    }

    let options = new Options();
    options.horizontalFilterTree = horizontalFilterTree;
    graphOptions.set(options);
}