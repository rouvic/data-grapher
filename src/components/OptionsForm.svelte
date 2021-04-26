<script>
    import {graphOptions} from "../lib/common";
    import {TreeNode} from "../lib/trees";
    import {LabeledFilter, TaffyFilter} from "../lib/taffy_utils";
    import {slide} from "svelte/transition";

    class Options {
        constructor() {
            this.horizontalFilterTree = new TreeNode(new LabeledFilter("any", TaffyFilter.any()));
            this.horizontalHeadingVisible = true;
            this.verticalFilterTree = new TreeNode(new LabeledFilter("any", TaffyFilter.any()));
            this.verticalHeadingVisible = true;
            this.allowColumnSpan = true;
            this.globalFilter = "{}";

            // this.horizontalFilterTree = new TreeNode(new LabeledFilter("Date", TaffyFilter.any()));
            // this.horizontalFilterTree.children.push(new TreeNode(new LabeledFilter("Date begins with 18", TaffyFilter.columnWithOperator("date", "left", "18"))));
            // this.horizontalFilterTree.children.push(new TreeNode(new LabeledFilter("Any date", TaffyFilter.any())));
            // this.horizontalFilterTree.children.push(new TreeNode(new LabeledFilter("Date ends with 12", TaffyFilter.columnWithOperator("date", "right", "12"))));
            //
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

    let boundOptions = new Options();

    function validateOptions() {
        graphOptions.set(boundOptions);
    }

    // We load the default options.
    validateOptions();

    let visible = false;

    function toggleOptions() {
        visible = !visible;
    }

</script>


<div class="toolbar-button-container">
    <i class="fas fa-cogs toolbar-button" on:click={toggleOptions}></i>

    {#if visible}
        <div class="options-form" transition:slide>
            <p>
                Show horizontal heading :
                <input type=checkbox bind:checked={boundOptions.horizontalHeadingVisible}>
                <br>
                Show vertical heading :
                <input type=checkbox bind:checked={boundOptions.verticalHeadingVisible}>
                <br>
                Filter :
                <input bind:value={boundOptions.globalFilter}>
                <br>
                <button on:click={validateOptions}>Validate</button>
            </p>
        </div>
    {/if}
</div>


<style>
    .options-form {
        border: 1px solid rgba(180,180,180,0.35);
        padding: 8px;
        background: white;
        z-index: 10;
        position: absolute;
        top: 26px;
        right: 0;
    }
</style>

