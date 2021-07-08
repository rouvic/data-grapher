<script>
    import {NavLink} from "sveltestrap";

    import {dataStore} from "../lib/common";

    function download(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function exportData() {
        download("export.json", ($dataStore)().stringify());
    }


</script>

<NavLink on:click={() => exportData()}>Export data</NavLink>
