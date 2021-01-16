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
        <waiting-modal></waiting-modal>
    </div>
</template>
<script>
    import {FadeTransition} from "vue2-transitions"
    import Countdown from "@/views/Countdown/Countdown"
    import WaitingModal from "@/views/Modal/WaitingModal"

    export default {
        components: {
            FadeTransition, Countdown, WaitingModal
        },
        mounted: function(){
            // just for highlight
        }
    }
</script>
