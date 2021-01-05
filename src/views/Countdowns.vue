<template>
    <div class="container">
        {{title}}
    </div>
</template>

<script>
    import {mapState} from "vuex"

    export default {
        name: "Countdowns",
        data() {
            return {}
        },
        computed: {
            ...mapState({
            })
        }
    }
</script>

<style scoped>

</style>