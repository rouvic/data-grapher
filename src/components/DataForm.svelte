<script>

    import {dataStore} from "../lib/common";
    import {HardCoded1, HardCoded2, HardCoded, WikipediaSearch} from "../lib/data_sources";
    import {slide} from "svelte/transition";

    class Labeled {
        constructor(label, value) {
            this.label = label;
            this.value = value;
        }
    }

    let localSources = [];

    async function dispatchData() {
        let merged = TAFFY();

        for (let [i, labeled] of localSources.entries()) {
            let sourceDb = await labeled.value.toTaffy();
            for (let record of sourceDb().get()) {
                record._sourceid = i;
                record._source = labeled.label;
                merged.insert(record);
            }
        }

        dataStore.set(merged);
    }

    let visible = false;

    function toggleVisible() {
        visible = !visible;
    }

    function removeItem(item) {
        localSources = localSources.filter(x => x !== item);
    }

    function addSource(source) {
        localSources = [...localSources, new Labeled("New data source", source)];
    }

    // We load an empty data to start with.
    dispatchData();
</script>

<div class="toolbar-button-container">
    <i class="fas fa-database toolbar-button" on:click|stopPropagation={toggleVisible}></i>
</div>

{#if visible}
    <div class="data-form" transition:slide>
        <div class="no-wrap">
            Data Sources (add:
            <i class="fas fa-plus pointed" on:click={() => addSource(new HardCoded1())}></i>
            <i class="fas fa-code pointed" on:click={() => addSource(new HardCoded())}></i>
            <i class="fas fa-file pointed" on:click={() => addSource(new HardCoded2())}></i>
            <i class="fas fa-wifi pointed" on:click={() => addSource(new HardCoded2())}></i>
            <i class="fab fa-wikipedia-w pointed" on:click={() => addSource(new WikipediaSearch())}></i>)
        </div>
        <ul>
            {#each localSources as labeled}
                <li>
                    <label>
                        <input bind:value={labeled.label}>
                        -
                        {labeled.value.type}

                        <i class="fas fa-trash pointed" on:click={removeItem(labeled)}></i>
                    </label>

                    <div class="source-details">
                        {#if labeled.value instanceof HardCoded}
                            <label>
                                <textarea style="min-width: 400px;" bind:value={labeled.value.code}></textarea>
                            </label>
                        {:else if labeled.value instanceof WikipediaSearch}
                            <label>
                                Query :
                                <input bind:value={labeled.value.query} />
                            </label>
                        {/if}
                    </div>
                </li>
            {/each}
        </ul>
        <button on:click={dispatchData}>Reload</button>
    </div>
{/if}


<style>

    li {
        margin-top: 20px;
    }

    .source-details {
        border: 1px solid darkgray;
        padding: 8px;
    }

    .data-form {
        border: 1px solid rgba(180,180,180,0.35);
        padding: 8px;
        background: white;
        z-index: 10;
        position: absolute;
        top: 26px;
        right: 0;
        min-width: 600px;
        overflow-x: auto;
        overflow-y: auto;
    }
</style>


