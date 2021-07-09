

import {dataSources, graphOptions} from "./common";
import {LabeledSource, FromURL} from "./data_sources";
import {TreeNode} from "./trees";
import {LabeledFilter, TaffyFilter, buildDateRanges} from "./taffy_utils";
import {Options} from "./options";

export function applyHistMaths() {

    let source = new FromURL();
    source.url = "https://raw.githubusercontent.com/rouvic/hist-maths/main/data.json";
    dataSources.set([new LabeledSource("vicrou github", source)]);

    let options = new Options();
    options.horizontalFilterTree = buildDateRanges(1600, 2020, 10);
    graphOptions.set(options);
}

