<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-12">
                <!-- The current state of the countdown -->
                <h4 class="mb-5 mt-4">
                    <span>Current Countdown</span>
                </h4>

                <countdown-progress v-if="currentCountdown.taskId !== -1"></countdown-progress>
                <h6 v-else class="mb-3">
                    <span>No countdown for any task right now. </span>
                </h6>

                <hr/>

                <!-- Quick start to write down a task -->
                <h4 class="mb-5">
                    <span>Quick Start</span>
                </h4>

                <div class="container">
                    <div class="row">
                        <div class="col-10">
                            <base-input :value="newTitle" @input="handleNewTaskInput"
                                        placeholder="What you are to do ..."></base-input>
                        </div>
                        <div class="col-2">
                            <base-button type="primary" @click="confirmAdd" :disabled="newTitle === ''">Add
                            </base-button>
                        </div>
                    </div>
                </div>

                <hr/>

                <!-- View the remaining tasks -->
                <h4 class="mb-5 mt-4 d-flex justify-content-between">
                    <span>Remaining Tasks</span>
                    <base-button type="primary" @click="exportTasks">export</base-button>
                </h4>

                <task-item v-for="task in undoneTasks"
                           :key="task.id" :id="task.id"
                           :done="task.status===1" :title="task.title">
                </task-item>

                <hr/>

                <!-- View the Today's countdown -->
                <h4 class="mb-5">
                    <span>Today's Countdowns</span>
                </h4>

                <span>The time you have been concentrated today is: <span style="color: #fb6340; font-size: 300%">{{parseInt(sumCountdown / 60)}} h {{sumCountdown % 60}} m</span></span>

                <hr/>

                <!-- View the overview of countdowns -->
                <h4 class="mb-5">
                    <span>Overview of Countdowns</span>
                    <div id="overviewChart"></div>
                </h4>

            </div>
        </div>
        <countdown-modal></countdown-modal>
    </div>
</template>

<script>
    import BaseInput from "@/components/BaseInput"
    import BaseButton from "@/components/BaseButton"
    import TaskItem from "@/components/TaskItem"
    import CountdownProgress from "@/views/Countdown/CountdownProgress"
    import CountdownModal from "@/views/Modal/CountdownModal"
    import requests from "@/plugins/request"
    import {mapState, mapActions} from "vuex"
    import exportTasksCountdowns from "@/plugins/exportTasksCountdowns"

    export default {
        name: "Overview",
        components: {
            CountdownModal, CountdownProgress, BaseButton, BaseInput, TaskItem
        },
        mounted: function () {
            // get tasks and countdowns
            this.getUndoneTasks()
            this.getCountdowns()
            // todo: get countdowns

            // initialize echarts
            // todo: Take the dates with no hours into consideration
            // todo: Make the chart changes in real-time.
            let overview = this.$echarts.init(document.getElementById("overviewChart"))
            const statistics = this.calculateChartStatistics()

            overview.setOption({
                color: "#5e72e4",
                title: {
                    text: "Countdown sums in recent days",
                    left: "center"
                },
                xAxis: {
                    name: "date",
                    data: statistics.recentDates
                },
                yAxis: {
                    name: "hours"
                },
                series: [{
                    type: "bar",
                    data: statistics.recentLengths.map(minutes => new Number(minutes / 60.0).toFixed(2))
                }]
            })
        },
        data() {
            return {
                newTitle: "",

                // The three variables below are about countdown, but there's no need to store them.
                showModal: false,
                presetCountdownLengths: ["2", "15", "25", "35", "45", "60", "90", "120", "180"],

                // The variables below are about countdown. They should be stored in local storage.
                // todo: change object variable name to "currentCountdown"
                countdown: {
                    taskId: -1,
                    startTime: 0,
                    length: "15"
                }
            }
        },
        computed: {
            sumCountdown: function () {
                let sum = 0

                let now = new Date()
                let todayYear = now.getFullYear()
                let todayMonth = now.getMonth()
                let todayDate = now.getDate()

                for (let i = 0; i < this.countdowns.length; ++i) {
                    let startTime = new Date(this.countdowns[i].startTime)
                    // This is today's countdown.
                    if (startTime.getFullYear() === todayYear && startTime.getMonth() === todayMonth && startTime.getDate() === todayDate) {
                        sum += parseInt(this.countdowns[i].length)
                    }
                }
                return sum
            },
            ...mapState("task", ["undoneTasks"]),
            ...mapState("countdown", ["currentCountdown", "countdowns"]),
            ...mapState("overview", ["counting", "modal"])
        },
        methods: {
            confirmAdd: function () {
                this.addTask({
                    body: {
                        task: {
                            title: this.newTitle
                        }
                    }
                })

                // clear the input
                this.newTitle = ""
            },
            calculateChartStatistics: function () {
                // calculate the statistics the chart needs
                let recentDates = []
                let recentLengths = []
                let dateCount = 0
                let maxDates = 8
                for (let i = this.countdowns.length - 1; i > 0 && dateCount < maxDates; --i) {
                    let startTime = new Date(Date.parse(this.countdowns[i].startTime))
                    let recentMonth = startTime.getMonth() + 1
                    let recentDate = startTime.getDate()

                    if (recentDates.length == 0 || `${recentMonth}.${recentDate}` != recentDates[recentDates.length - 1]) {
                        // being able to push a new date
                        ++dateCount

                        // push a new date and new minutes
                        recentDates.push(`${recentMonth}.${recentDate}`)
                        recentLengths.push(parseInt(this.countdowns[i].length))
                    } else {
                        recentLengths[recentLengths.length - 1] += parseInt(this.countdowns[i].length)
                    }
                }
                return {recentDates: recentDates.reverse(), recentLengths: recentLengths.reverse()}
            },
            exportTasks: function () {
                if (exportTasksCountdowns(this.tasks, this.countdowns)) {
                    // todo: show export successfully
                } else {
                    // todo: show failure to export
                }
            },
            handleNewTaskInput: function (val) {
                this.newTitle = val
            },
            ...mapActions("task", ["getUndoneTasks", "addTask"]),
            ...mapActions("countdown", ["getCountdowns"]),
            ...mapActions(["request"])
        }
    }
</script>

<style scoped>
    #overviewChart {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 400px;
    }
</style>