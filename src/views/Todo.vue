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
                            <base-input :value="new_title" @input="handleNewTaskInput"
                                        placeholder="What you are to do ..."></base-input>
                        </div>
                        <div class="col-2">
                            <base-button type="primary" @click="addTask" :disabled="new_title === ''">Add</base-button>
                        </div>
                    </div>
                </div>

                <hr/>

                <!-- View the remaining tasks -->
                <h4 class="mb-5">
                    <span>Remaining Tasks</span>
                </h4>

                <task-item v-for="task in undoneTasks" :key="task.id" :done=false :id="task.id" :title="task.title"
                           v-on:task-toggled="handleTaskToggle" v-on:task-deleted="handleTaskDeleted"
                           v-on:evoke-countdown="handleCountdownEvoked">
                </task-item>

                <hr/>

                <!-- View the completed tasks -->
                <h4 class="mb-5">
                    <span>Completed Tasks</span>
                </h4>

                <task-item v-for="task in doneTasks" :key="task.id" :done=true :id="task.id" :title="task.title"
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

            if (localStorage.getItem('accumulated_id') !== null) {
                this.accumulated_id = localStorage.getItem('accumulated_id')
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
                // todo: Modify the new_title and accumulated_id to fit a unified naming rule.
                // todo: Wrap variables about countdown in to "countdown: {}"
                new_title: '',
                accumulated_id: 0,
                tasks: [],
                showCountdown: false,
                presetCountdownMinutes: ['25', '35', '45'],
                intervalId: 0,
                countdown: {
                    taskId: -1,
                    startTime: 0,
                    minutes: '25'
                },
                countdowns: [],
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
                // No countdown.startTime saved or the last countdown.startTime has expired
                if (this.countdown.startTime === 0 || this.countdownExpired(Date.now())) {
                    clearInterval(this.intervalId)
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
                this.intervalId = 0
                this.progress.value = 0
                this.progress.show = false
                this.countdown.startTime = 0
                this.countdown.taskId = -1
            },
            addTask: function () {
                this.tasks.push({
                    id: ++this.accumulated_id,
                    done: false,
                    title: this.new_title
                })
                this.new_title = ''
                this.saveToLocalStorage('tasks', JSON.stringify(this.tasks))
                this.saveToLocalStorage('accumulated_id', this.accumulated_id)
            },
            handleNewTaskInput: function (val) {
                this.new_title = val
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