<script>
    import {
        Navbar,
        NavbarBrand,
        Nav,
        NavItem,
        NavLink,
        Dropdown, DropdownItem, DropdownMenu, DropdownToggle
    } from 'sveltestrap';
    import OptionsForm from "./OptionsForm.svelte";
    import DataForm from "./DataForm.svelte";
    import Scripts from "./scripts/Scripts.svelte";
    import ExportNavItem from "./ExportNavItem.svelte";

</script>

<Navbar color="light" light expand="md">
    <NavbarBrand>data grapher</NavbarBrand>
        <Nav class="ms-0" navbar>
            <NavItem>
                <ExportNavItem />
            </NavItem>
            <NavItem>
                <OptionsForm/>
            </NavItem>
            <NavItem>
                <DataForm/>
            </NavItem>
            <NavItem>
                <Scripts/>
            </NavItem>
        </Nav>
</Navbar>
