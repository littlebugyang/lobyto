<template>
    <div>
        <h6><span>{{title}}</span></h6>
        <base-progress type="primary" :value="value" label="counting"></base-progress>
        <base-button type="default" @click="stop">Finish Ahead</base-button>
        <base-button type="warning" @click="cancel">Cancel</base-button>
    </div>
</template>

<script>
    import BaseProgress from "@/components/BaseProgress"
    import BaseButton from "@/components/BaseButton"
    import {mapState, mapActions} from "vuex"

    export default {
        name: "CountdownProgress",
        components: {
            BaseProgress, BaseButton
        },
        data() {
            return {
                title: "",
                value: 0,
                intervalId: 0
            }
        },
        computed: {
            ...mapState("task", ["undoneTasks"]),
            ...mapState("countdown", ["currentCountdown"])
        },
        methods: {
            stop: function () {
                // "Stop" means "interrupt"
                this.stopCountdown(Math.floor((Date.now() - this.currentCountdown.startTime) / 60000))
            },
            cancel: function () {
                this.cancelCountdown()
            },
            ...mapActions("countdown", ["stopCountdown", "cancelCountdown"]),
            ...mapActions("task", ["getTaskTitleById"])
        },
        watch: {
            undoneTasks() {
                // requests.getTasks' result is much likely to be late after this component mounted
                // Besides, when title of task is edited, the title can be changed immediately.
                this.getTaskTitleById(this.currentCountdown.taskId).then(title => this.title = title)
            }
        },

        mounted() {
            // Especially for starting an new countdown
            this.getTaskTitleById(this.currentCountdown.taskId).then(title => this.title = title)
            const {startTime, length} = this.currentCountdown
            this.intervalId = setInterval(() => {
                if (length * 60000 > (Date.now()) - startTime) {
                    let secondsLeft = length * 60.0 - (Date.now() - startTime) / 1000.0
                    let percentage = (1.0 - secondsLeft / (length * 60.0)) * 100
                    this.value = parseInt(percentage)
                }
                // No need to worry about expired.
                // View component just cares about view.
            }, 1000)
            console.log("Start an interval for showing progress with id: ", this.intervalId)
        },
        beforeDestroy() {
            console.log("Clear the interval for showing progress with id: ", this.intervalId)
            clearInterval(this.intervalId)
        }
    }
</script>