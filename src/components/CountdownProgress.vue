<template>
    <div>
        <h6><span>{{title}}</span></h6>
        <base-progress type="primary" :value="value"></base-progress>
        <base-button type="default" @click="stopCountdown">Finish Ahead</base-button>
        <base-button type="warning" @click="cancelCountdown">Cancel</base-button>
    </div>
</template>

<script>
    import BaseProgress from "./BaseProgress"
    import BaseButton from "./BaseButton"
    import requests from "../plugins/request"
    import {mapActions} from "vuex"

    export default {
        name: "CountdownProgress",
        components: {
            BaseProgress, BaseButton
        },
        props: {
            countdown: Object
        },
        data() {
            return {
                value: 0,
                intervalId: 0,
                title: ""
            }
        },
        mounted() {
            console.log("Progress mounted. ", this.countdown)
            this.getTaskTitleById(this.countdown.taskId).then(title => this.title = title)
            // When it is mounted, there must be countdown passed as prop.
            // Just set an interval for this countdown.
            this.intervalId = setInterval(() => {
                if (this.countdownExpired(Date.now())) {
                    this.finishCountdown()

                    // show notification
                    if (window.Notification && Notification.permission !== "denied") {
                        Notification.requestPermission(function (status) {
                            new Notification("Lobyto Countdown", {
                                body: "Time is up!!!!",
                                icon: "img/brand/blue.png"
                            })
                        })
                    }
                } else {
                    let secondsLeft = this.countdown.length * 60.0 - (Date.now() - this.countdown.startTime) / 1000.0
                    let percentage = (1.0 - secondsLeft / (this.countdown.length * 60.0)) * 100
                    this.value = parseInt(percentage)
                    // this.show = true
                }
            }, 1000)
            console.log("Start an interval with id: ", this.intervalId)
        },
        beforeDestroy() {
            // Avoid duplicate countdown. Probably delete the interval with id 0
            console.log("Clear the interval with id: ", this.intervalId)
            clearInterval(this.intervalId)
        },
        methods: {
            countdownExpired: function (now) {
                // String * Number = Number
                return this.countdown.length * 60000 <= (now - this.countdown.startTime)
            },
            stopCountdown: function () {
                // "Stop" means "interrupt"
                let newMinutes = Math.floor((Date.now() - this.countdown.startTime) / 60000)
                if (1 > newMinutes) {
                    // countdown of less than 1 minute does not count
                    return
                }
                this.countdown.length = "" + newMinutes
                this.finishCountdown()
            },
            finishCountdown: function () {
                // "Finish" means "completely done"
                // Upload countdown
                this.addCountdown({
                    request: requests.addCountdown,
                    data: {
                        countdown: this.countdown
                    }
                })
                this.cancelCountdown()
            },
            cancelCountdown: function () {
                console.log("Clear the interval with id: ", this.intervalId)
                clearInterval(this.intervalId)
                // recover countdown
                this.intervalId = 0
                this.value = 0
                this.countdown.startTime = 0
                this.countdown.taskId = -1
                this.countdown.length = "15"
                localStorage.setItem("countdown", JSON.stringify(this.countdown))
                this.toggleCounting(false)
            },
            ...mapActions("overview", ["addCountdown", "toggleCounting", "getTaskTitleById"])
        }
    }
</script>

<style scoped>

</style>