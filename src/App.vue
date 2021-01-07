<template>
    <div id="app">
        <router-view name="header"></router-view>
        <main>
            <fade-transition origin="center" mode="out-in" :duration="250">
                <router-view/>
            </fade-transition>
        </main>
        <router-view name="footer"></router-view>
        <countdown></countdown>
    </div>
</template>
<script>
    import {FadeTransition} from "vue2-transitions"
    import Countdown from "@/components/Countdown/Countdown"

    export default {
        components: {
            FadeTransition, Countdown
        }
    }
</script>
