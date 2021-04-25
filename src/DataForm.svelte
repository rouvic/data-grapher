<script>

    import {data} from "./stores";
    import {HardCoded2} from "./lib";

    let source = "hardcoded";

    function reloadData() {
        let input = new HardCoded2().toTaffy();

        data.set(input);
    }

    reloadData();
</script>

<div class="form data-form">
    <p>
        Data source :
        <input value={source} disabled>
        <button on:click={reloadData}>Reload</button>
    </p>
</div>

