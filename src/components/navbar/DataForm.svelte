<script>

    import {dataStore} from "../lib/common";
    import {HardCoded1, HardCoded2, HardCoded, WikipediaSearch, WikidataQuery, FromURL, FromFile} from "../lib/data_sources";
    import {Tooltip, Icon, NavLink, Button, Offcanvas, Input, Form, FormGroup, Label} from "sveltestrap";
    import ClickableIcon from "./utils/ClickableIcon.svelte";

    class Labeled {
        constructor(label, value) {
            this.label = label;
            this.value = value;
        }

        toString() {
            return "Labeled [label=" + this.label + ", value=" + this.value + "]";
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

        if (visible) {
            toggle();
        }
    }

    let visible = false;
    const toggle = () => visible = !visible;
    let buttonClickable = true;

    function removeItem(item) {
        localSources = localSources.filter(x => x !== item);
        checkSourcesNames();
    }

    function addSource(source) {
        localSources = [...localSources, new Labeled("New data source", source)];
        checkSourcesNames();
    }

    function checkSourcesNames() {
        buttonClickable = !checkForDuplicates(localSources.map(s => s.label));
        for (let labeled of localSources) {
            if (labeled.label.length === 0) {
                buttonClickable = false;
            }
        }
    }

    function checkForDuplicates(array) {
        let valuesAlreadySeen = [];

        for (let i = 0; i < array.length; i++) {
            let value = array[i];
            if (valuesAlreadySeen.indexOf(value) !== -1) {
                return true
            }
            valuesAlreadySeen.push(value)
        }
        return false
    }

    function isLabelDuplicate(label) {
        let filtered = localSources.filter(source => (source.label === label));
        return filtered.length > 1;
    }


    // We load an empty data to start with.
    dispatchData();
</script>


<NavLink on:click={toggle}>Data</NavLink>


<div class="data-form-container">
    <Offcanvas isOpen={visible} {toggle} placement="end" container="inline">

        <div slot="header" class="no-wrap">
            Data Sources (add:
            <ClickableIcon name="file-earmark-spreadsheet" tooltip="File" on:click={() => addSource(new FromFile())}/>
            <ClickableIcon name="globe" tooltip="URL GET" on:click={() => addSource(new FromURL())}/>
            <ClickableIcon name="code-slash" tooltip="Script" on:click={() => addSource(new HardCoded())}/>
            <ClickableIcon name="globe" tooltip="Wikidata" on:click={() => addSource(new WikidataQuery())}/>
            <ClickableIcon name="globe" tooltip="Wikipedia" on:click={() => addSource(new WikipediaSearch())}/>
            <ClickableIcon name="bug" tooltip="debug" on:click={() => addSource(new HardCoded2())}/>
            )
            <div class="float-end">
                <Button on:click={dispatchData} disabled="{!buttonClickable}">Reload</Button>
            </div>
        </div>


        <ul>
            {#each localSources as labeled}
                <li>
                    <Form>
                        <FormGroup>
                            <Label for="sourceIdId">
                                Source ID (type: {labeled.value.type})
                                <ClickableIcon name="trash" on:click={removeItem(labeled)}/>
                            </Label>
                            <Input invalid={isLabelDuplicate(labeled.label) || labeled.label.length === 0} feedback={isLabelDuplicate(labeled.label) ? "Name must be unique" : ""} bind:value={labeled.label} on:input={checkSourcesNames} name="sourceId" id="sourceIdId" placeholder="Source ID" />
                        </FormGroup>
                    </Form>


                    {#if labeled.value.hasDetails()}
                        <div class="source-details">
                            {#if labeled.value instanceof HardCoded}
                                <p>A hardcoded source used for debugging.</p>
                            {:else if labeled.value instanceof WikipediaSearch}
                                <label>
                                    Query :
                                    <input bind:value={labeled.value.query} />
                                </label>
                            {:else if labeled.value instanceof WikidataQuery}
                                <label>
                                    Query URL :
                                    <input bind:value={labeled.value.url} />
                                </label>
                            {:else if labeled.value instanceof FromURL}
                                <label>
                                    Request URL :
                                    <Input type="url" bind:value={labeled.value.url} />
                                </label>
                            {:else if labeled.value instanceof FromFile}
                                <label>
                                    File :
                                    <Input type="file" bind:files={labeled.value.files} />
                                </label>
                            {/if}
                        </div>
                    {/if}
                </li>
            {/each}
        </ul>

    </Offcanvas>
</div>

<style>
    :global(.data-form-container .offcanvas-end) {
        width: 600px;
    }

    li {
        margin-top: 20px;
    }

    .source-details {
        border: 1px solid darkgray;
        padding: 8px;
    }
</style>


