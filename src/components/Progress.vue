<template>
    <div>
        <h6><span>{{countdown.title}}</span></h6>
        <base-progress :type="type" :value="value"></base-progress>
        <base-button type="default" @click="stopCountdown">Finish Ahead</base-button>
        <base-button type="warning" @click="cancelCountdown">Cancel</base-button>
    </div>
</template>

<script>
    import BaseProgress from "@/components/BaseProgress"
    import BaseButton from "@/components/BaseButton"

    export default {
        name: "Progress",
        components: {
            BaseProgress, BaseButton
        },
        props: {
            type: {
                type: String,
                default: "primary"
            },
            countdown: Object
        },
        data() {
            return {
                value: 0,
                intervalId: 0
            }
        },
        mounted() {
            // When Progress.vue is mounted, there must be countdown passed as prop
            this.intervalId = setInterval(function () {
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
                    let secondsLeft = this.countdown.minutes * 60.0 - (Date.now() - this.countdown.startTime) / 1000.0
                    let percentage = (1.0 - secondsLeft / (this.countdown.minutes * 60.0)) * 100
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
                return this.countdown.minutes * 60000 <= (now - this.countdown.startTime)
            },
            stopCountdown: function(){
                // "Stop" means "interrupt"
                let newMinutes = Math.floor((Date.now() - this.countdown.startTime) / 60000)
                if (1 > newMinutes) {
                    // countdown of less than 1 minute does not count
                    return
                }
                this.countdown.minutes = "" + newMinutes
                this.finishCountdown()
            },
            finishCountdown: function () {
                // "Finish" means "completely done"
                // todo: upload countdown and add countdown to state

                // recover countdown
                this.intervalId = 0
                this.progress.value = 0
                this.progress.show = false
                this.countdown.startTime = 0
                this.countdown.taskId = -1
                this.countdown.minutes = "15"
                this.saveToLocalStorage("countdown", JSON.stringify(this.countdown))
                this.cancelCountdown()
            },
            cancelCountdown: function () {
                console.log("Clear the interval with id: ", this.intervalId)
                clearInterval(this.intervalId)
                // todo: tell parent to hide the progress
            }
        }
    }
</script>

<style scoped>

</style>