<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-12">
                <!-- The current state of the tomato -->
                <h4 class="mb-5 mt-4">
                    <span>Current Tomato</span>
                </h4>

                <div v-if="progress.show">
                    <h6><span>{{tasks[getTaskIndexById(countdown.taskId)].title}}</span></h6>
                    <base-progress :type="progress.type" :value="progress.value"></base-progress>
                    <base-button type="warning" @click="cancelCountdown">Cancel</base-button>
                </div>
                <h6 v-else class="mb-3">
                    <span>No tomato countdown for any task right now. </span>
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
                            <base-button type="primary" @click="addTask" :disabled="newTitle === ''">Add</base-button>
                        </div>
                    </div>
                </div>

                <hr/>

                <!-- View the remaining tasks -->
                <h4 class="mb-5">
                    <span>Remaining Tasks</span>
                </h4>

                <task-item v-for="task in undoneTasks" :key="task.id" :done=false :id="task.id" :title="task.title"
                           :counting.sync="task.counting"
                           v-on:task-toggled="handleTaskToggle" v-on:task-deleted="handleTaskDeleted"
                           v-on:evoke-countdown="handleCountdownEvoked">
                </task-item>

                <hr/>

                <!-- View the completed tasks -->
                <h4 class="mb-5">
                    <span>Completed Tasks</span>
                </h4>

                <task-item v-for="task in doneTasks" :key="task.id" :done=true :id="task.id" :title="task.title"
                           :counting.sync="task.counting"
                           v-on:task-toggled="handleTaskToggle" v-on:task-deleted="handleTaskDeleted">
                </task-item>

            </div>
        </div>
        <!-- The modal for setting countdown -->
        <modal v-if="countdown.taskId !== -1" :show.sync="showCountdown">
            <template slot="header">
                <h5 class="modal-title">Countdown for {{tasks[getTaskIndexById(countdown.taskId)].title}}</h5>
            </template>
            <div class="container justify-content-center">
                <div class="row">
                    <base-radio class="col-4" v-for="min in presetCountdownMinutes" :key="min" :name="min"
                                v-model="countdown.minutes">
                        {{`${min}min`}}
                    </base-radio>
                </div>
            </div>
            <template slot="footer">
                <base-button type="primary" @click="startCountdown">Apply</base-button>
            </template>
        </modal>
    </div>
</template>

<script>
    import BaseInput from "@/components/BaseInput";
    import BaseButton from "@/components/BaseButton";
    import TaskItem from "@/components/TaskItem";
    import Modal from "@/components/Modal"

    export default {
        name: "Todo",
        components: {
            BaseButton, BaseInput, TaskItem, Modal
        },
        mounted: function () {
            // load data from localStorage
            if (typeof (Storage) === "undefined") {
                console.log("Local Storage not available. ")
                return
            }

            // todo: Wrap these getItem() code into one block. Write a method named "loadFromLocalStorage"

            if (localStorage.getItem('accumulatedId') !== null) {
                this.accumulatedId = localStorage.getItem('accumulatedId')
            }

            if (localStorage.getItem('tasks') !== null) {
                this.tasks = JSON.parse(localStorage.getItem('tasks'))
            }

            if (localStorage.getItem('countdowns') !== null) {
                this.countdowns = JSON.parse(localStorage.getItem('countdowns'))
            }

            if (localStorage.getItem('countdown') !== null) {
                this.countdown = JSON.parse(localStorage.getItem('countdown'))
            }

            // Continues the last countdown.
            this.loadCountdown()
        },
        data() {
            return {
                newTitle: '',
                accumulatedId: 0,
                tasks: [],

                // The three variables below are about countdown, but there's no need to store them.
                showCountdown: false,
                presetCountdownMinutes: ['1', '25', '35', '45'],
                intervalId: 0,

                // The variables below are about countdown. They should be stored in local storage.
                // todo: change object variable name to "lastCountdown"
                countdown: {
                    taskId: -1,
                    startTime: 0,
                    minutes: '1'
                },
                countdowns: [],

                // progress of tomato
                progress: {
                    show: false,
                    type: 'primary',
                    value: 0
                }
            }
        },
        computed: {
            // use computed to avoid redundant traversal
            doneTasks: function () {
                return this.tasks.filter(task => task.done)
            },
            undoneTasks: function () {
                return this.tasks.filter(task => !task.done)
            }
        },
        methods: {
            saveToLocalStorage: function (key, value) {
                localStorage.setItem(key, value)
            },
            getTaskIndexById: function (id) {
                for (let i = 0; i < this.tasks.length; ++i) {
                    if (this.tasks[i].id === id) {
                        return i
                    }
                }
                return -1
            },
            countdownExpired: function (now) {
                return this.countdown.minutes * 60000 <= (now - this.countdown.startTime)
            },
            loadCountdown: function () {
                // No countdown.startTime saved
                if (this.countdown.startTime === 0) {
                    return
                }
                // The last countdown.startTime has expired

                else if (this.countdownExpired(Date.now())) {
                    this.cancelCountdown()
                    return
                }

                // Otherwise, start the interval.
                // Just in case. I really don't know the effective filed in multiple layers of functions.
                let _this = this
                this.intervalId = setInterval(function () {
                    if (_this.countdownExpired(Date.now())) {
                        _this.saveCountdown()
                        _this.cancelCountdown()
                    } else {
                        let secondsLeft = _this.countdown.minutes * 60.0 - (Date.now() - _this.countdown.startTime) / 1000.0
                        let percentage = (1.0 - secondsLeft / (_this.countdown.minutes * 60.0)) * 100
                        _this.progress.value = parseInt(percentage)
                        _this.progress.show = true
                    }
                }, 1000)
                console.log('Start an interval with id: ', this.intervalId)
            },
            startCountdown: function () {
                console.log(`Countdown for task ${this.countdown.taskId} started, with a countdown of ${this.countdown.minutes} minutes. `)
                this.countdown.startTime = Date.now()
                this.showCountdown = false
                // Save the countdown settings to the local storage.
                this.saveToLocalStorage('countdown', JSON.stringify(this.countdown))
                this.loadCountdown()
                this.tasks[this.getTaskIndexById(this.countdown.taskId)].counting = true
                this.saveToLocalStorage('tasks', JSON.stringify(this.tasks))
            },
            saveCountdown: function () {
                this.countdowns.push({
                    taskId: this.countdown.taskId,
                    minutes: this.countdown.minutes,
                    startTime: this.countdown.startTime
                })
                this.saveToLocalStorage('countdowns', JSON.stringify(this.countdowns))
            },
            cancelCountdown: function () {
                clearInterval(this.intervalId)
                this.tasks[this.getTaskIndexById(this.countdown.taskId)].counting = false
                this.intervalId = 0
                this.progress.value = 0
                this.progress.show = false
                this.countdown.startTime = 0
                this.countdown.taskId = -1
                this.countdown.minutes = '25'
            },
            addTask: function () {
                this.tasks.push({
                    id: ++this.accumulatedId,
                    done: false,
                    title: this.newTitle,
                    counting: false
                })
                this.newTitle = ''
                this.saveToLocalStorage('tasks', JSON.stringify(this.tasks))
                this.saveToLocalStorage('accumulatedId', this.accumulatedId)
            },
            handleNewTaskInput: function (val) {
                this.newTitle = val
            },
            handleTaskToggle: function (id) {
                let i = this.getTaskIndexById(id)
                this.tasks[i].done = !this.tasks[i].done
            },
            handleTaskDeleted: function (id) {
                console.log("Delete task item with id: ", id)
                this.tasks.splice(this.getTaskIndexById(id), 1)
                this.saveToLocalStorage('tasks', JSON.stringify(this.tasks))
            },
            handleCountdownEvoked: function (id) {
                console.log("A task's countdown has been evoked: ", id)
                this.showCountdown = true
                this.countdown.taskId = id
            }
        }
    }
</script>

<style scoped>

</style>