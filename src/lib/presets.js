

import {dataSources, graphOptions, scripts} from "./common";
import {LabeledSource, FromURL} from "./data_sources";
import {TreeNode} from "./trees";
import {LabeledFilter, TaffyFilter, buildDateRanges} from "./taffy_utils";
import {Options} from "./options";
import {Parameter, Script} from "./scripts";

export function applyHistMaths() {

    scripts.set("hist-maths:default_background", new Script("Default background", "Returns color based on type", "if (record.type === \"person\") {return \"orange\";} else { return \"lightblue\";}", [new Parameter("record", "The record to be displayed")]));

    let source = new FromURL();
    source.url = "https://raw.githubusercontent.com/rouvic/hist-maths/main/data.json";
    dataSources.set([new LabeledSource("vicrou github", source)]);

    let options = new Options();
    options.backgroundColor = scripts.get("hist-maths:default_background");
    options.horizontalFilterTree = buildDateRanges(1600, 2020, 10);
    graphOptions.set(options);
}

