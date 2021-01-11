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
                    <recent-chart></recent-chart>
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
    import {mapState, mapActions} from "vuex"
    import exportTasksCountdowns from "@/plugins/exportTasksCountdowns"
    import RecentChart from "@/views/Chart/RecentChart"

    export default {
        name: "Overview",
        components: {
            RecentChart, CountdownModal, CountdownProgress, BaseButton, BaseInput, TaskItem
        },
        mounted: function () {
            // get tasks and countdowns
            this.getUndoneTasks()
            this.getCountdowns()
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

</style>