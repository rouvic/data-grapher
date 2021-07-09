<script>
    import {
        Navbar,
        NavbarBrand,
        Nav,
        NavItem,
        NavLink,
        Dropdown, DropdownItem, DropdownMenu, DropdownToggle
    } from 'sveltestrap';
    import Options from "./Options.svelte";
    import Sources from "./Sources.svelte";
    import Scripts from "./scripts/Scripts.svelte";
    import Export from "./Export.svelte";
    import Insert from "./Insert.svelte";
    import Tutorial from "./Tutorial.svelte";

</script>

<Navbar color="light" light expand="md">
    <NavbarBrand>data grapher</NavbarBrand>
        <Nav class="ms-0" navbar>
            <NavItem>
                <Tutorial />
            </NavItem>
            <NavItem>
                <Insert />
            </NavItem>
            <NavItem>
                <Export />
            </NavItem>
            <NavItem>
                <Options />
            </NavItem>
            <NavItem>
                <Sources />
            </NavItem>
            <NavItem>
                <Scripts />
            </NavItem>
        </Nav>
</Navbar>
