<script>
    import {NavLink} from "sveltestrap";

    function showTutorial() {
        introJs().setOptions({
            steps: [
            {
                title: "Welcome to data grapher",
                intro: "data grapher is an open source software designed to collect and render data in a meaningful way."
            },
            {
                element: document.querySelector('#sources-button'),
                intro: "To get started you need to register one or more data sources."
            },
            {
                element: document.querySelector('#insert-button'),
                intro: "Alternatively, you can manually add a record if you have no existing sources."
            },
            {
                element: document.querySelector('#options-button'),
                intro: "Graph shape and display settings are available here."
            },
            {
                element: document.querySelector('#export-button'),
                intro: "Once you are done editing your data, you can export it to JSON."
            },
            ]
        }).start();
    }
</script>

<NavLink on:click={() => showTutorial()}>Tutorial</NavLink>
