<script>
    export let value;
    import {
        DropdownItem,
        DropdownMenu,
        DropdownToggle,
        Dropdown,
        Input
        } from "sveltestrap";

    import {scripts, isEmpty} from "../../../lib/common";

    let inputString;

    function isSuggested(entry) {
        return entry[1].name.includes(inputString) || entry[0].includes(inputString);
    }

    let suggested = new Map();

    let isDropdownOpen = false;

    if (value) {
        inputString = scripts.keyOf(value);
    }

    $: {
        value = scripts.get(inputString);
    }

    function focused() {
        updateSuggested();
        console.log(suggested);
        return true;
    }

    function typed() {
        updateSuggested();
    }

    function updateSuggested() {
        suggested.clear();

        for (let domain of scripts.domains()) {
            let suggestedScriptsEntries = [];

            for (let entry of scripts.allOf(domain)) {
                if (isSuggested(entry)) {
                    suggestedScriptsEntries.push(entry);
                }
            }

            if (suggestedScriptsEntries.length > 0) {
                suggested.set(domain, suggestedScriptsEntries);
            }
        }

        suggested = suggested;
    }
</script>

<div class="script-input-container">
    <Dropdown {isDropdownOpen}>
        <DropdownToggle tag="div" class="d-inline-block">
            <Input type="text" bind:value={inputString} on:focus={() => focused()} on:input={() => typed()} />
        </DropdownToggle>
        <DropdownMenu>
            {#each [...suggested.keys()] as domain}
                <DropdownItem header>{domain}</DropdownItem>
                {#each suggested.get(domain) as entry}
                    <DropdownItem on:click={() => inputString = entry[0]}>
                        <b>{entry[1].name}</b><br>
                        <i>{entry[1].description}</i>
                    </DropdownItem>
                {/each}
            {/each}
        </DropdownMenu>
    </Dropdown>
</div>

<style>
    :global(.script-input-container .dropdown-menu) {
        max-height: 200px;
        overflow: auto;
    }
</style>