<script>
    import {graphOptions} from "./stores";

    class Options {
        constructor() {

        }
    }
    let boundOptions = new Options();
    boundOptions.horizontalDisplayField = "date";
    boundOptions.verticalDisplayField = "composer";
    boundOptions.filter = "{}";

    function validateOptions() {
        graphOptions.set(boundOptions);
    }

    // We load the default options.
    validateOptions();
</script>

<div class="form options-form">
    <p>
        Horizontal display field :
        <input bind:value={boundOptions.horizontalDisplayField}>
        <br>
        Vertical display field :
        <input bind:value={boundOptions.verticalDisplayField}>
        <br>
        Filter :
        <input bind:value={boundOptions.filter}>
        <br>
        <button on:click={validateOptions}>Validate</button>
    </p>
</div>

<style>
    .options-form {
        border: 1px solid rgba(180,180,180,0.35);
    }
</style>

