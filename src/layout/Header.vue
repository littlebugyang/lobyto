<template>
    <div>
        <base-nav type="primary" effect="dark" title="todo" expand>
            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <div class="col-6 collapse-brand">
                    <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/">
                        <img src="img/brand/blue.png"/>
                    </a>
<!--                    This brand logo will be here until lobyto's brand was designed.-->
                </div>
                <div class="col-6 collapse-close">
                    <close-button @click="closeMenu"></close-button>
                </div>
            </div>

            <ul class="navbar-nav ml-lg-auto">
                <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="#/tomatoes">
                        Tomatoes
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="#/tasks">
                        Tasks
                    </a>
                </li>
                <base-dropdown tag="li" title="Settings">
                    <a class="dropdown-item" href="#">Todo settings</a>
                    <a class="dropdown-item" href="#">Tomato settings</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#">System settings</a>
                </base-dropdown>
            </ul>
        </base-nav>
    </div>
</template>

<script>
    import BaseNav from "@/components/BaseNav";
    import BaseDropdown from "@/components/BaseDropdown";
    import CloseButton from "@/components/CloseButton";

    export default {
        name: "Header",
        components: {
            BaseNav, BaseDropdown, CloseButton
        }
    }
</script>

<style scoped>

</style>