<script>
    import {graphOptions, scripts} from "../lib/common";
    import {TreeNode} from "../lib/trees";
    import {LabeledFilter, TaffyFilter} from "../lib/taffy_utils";

    import {NavLink, Icon, Accordion, AccordionItem, Offcanvas, Button, Input, FormGroup} from 'sveltestrap';
    import ScriptSelector from "./scripts/ScriptSelector.svelte";
    import FilterTree from "./FilterTree.svelte";


    class Options {

        constructor() {
            this.horizontalFilterTree = new TreeNode(new LabeledFilter("any", TaffyFilter.any()));
            this.horizontalHeadingVisible = true;
            this.verticalFilterTree = new TreeNode(new LabeledFilter("any", TaffyFilter.any()));
            this.verticalHeadingVisible = true;
            this.allowColumnSpan = true;
            this.globalFilter = "{}";
            this.displayer = scripts.get("built-in:name_and_dates_displayer");
            this.horizontalFilterTree = new TreeNode(new LabeledFilter("Date", TaffyFilter.any()));

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


            for (let i = 1500; i < 2000; i += 10) {
                let filter = new TaffyFuncFilter(Date.parse("" + i), Date.parse("" + (i + 10)));
                let labeledFilter = new LabeledFilter(i, filter);
                this.horizontalFilterTree.children.push(new TreeNode(labeledFilter));
            }

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

    let visible = false;

    function toggle() {
        visible = !visible;
    }

    let boundOptions = new Options();

    function validateOptions() {
        graphOptions.set(boundOptions);
        if (visible) {
            toggle();
        }
    }

    // We load the default options.
    validateOptions();


</script>


<!--    <i class="fas fa-cogs toolbar-button" on:click={toggle}></i>-->
    <NavLink on:click={toggle}>Options</NavLink>

<div class="options-form-container">
    <Offcanvas isOpen={visible} {toggle} header="Options" placement="end" container="inline">
        <h5>Horizontal heading</h5>
            <FormGroup>
                <Input type="checkbox" label="Show" bind:checked={boundOptions.horizontalHeadingVisible} />
            </FormGroup>
            <h4>Filter tree</h4>
        <FilterTree bind:node={boundOptions.horizontalFilterTree}/>
        <h5>Vertical heading</h5>
            <FormGroup>
                <Input type=checkbox label="Show" bind:checked={boundOptions.verticalHeadingVisible} />
            </FormGroup>
        <h5>Displayer</h5>
                <ScriptSelector bind:value={boundOptions.displayer} />

        <Button on:click={validateOptions}>Validate</Button>
    </Offcanvas>
</div>

<style>

    :global(.options-form-container .offcanvas-end) {
        width: 800px;
    }
</style>