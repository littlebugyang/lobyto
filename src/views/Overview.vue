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
                    <base-button type="default" @click="finishCountdown">Finish Ahead</base-button>
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
                    <base-button type="primary" @click="exportTasks">export</base-button>
                </h4>

                <task-item v-for="task in undoneTasks" :key="task.id" :done="task.status===1" :id="task.id"
                           :title="task.title"
                           :counting.sync="task.counting"
                           v-on:task-toggled="handleTaskToggle" v-on:task-deleted="handleTaskDeleted"
                           v-on:evoke-countdown="handleCountdownEvoked">
                </task-item>

                <hr/>

                <!-- View the Today's countdown -->
                <h4 class="mb-5">
                    <span>Today's Countdowns</span>
                </h4>

                <span>The time you have been concentrated today is: <span style="color: #fb6340; font-size: 300%">{{parseInt(sumTomato / 60)}} h {{sumTomato % 60}} m</span></span>

                <hr/>

                <!-- View the overview of countdowns -->
                <h4 class="mb-5">
                    <span>Overview of Countdowns</span>
                    <div id="overviewChart"></div>
                </h4>

            </div>
        </div>
        <!-- The modal for setting countdown -->
        <modal v-if="showCountdown && countdown.taskId !== -1" :show.sync="showCountdown">
            <template slot="header">
                <h5 class="modal-title">Countdown for {{tasks[getTaskIndexById(countdown.taskId)].title}}</h5>
            </template>
            <div class="container justify-content-center">
                <div class="row">
                    <base-radio class="col-4" v-for="min in presetCountdownLengths" :key="min" :name="min"
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
    import BaseInput from "@/components/BaseInput"
    import BaseButton from "@/components/BaseButton"
    import TaskItem from "@/components/TaskItem"
    import Modal from "@/components/Modal"
    import requests from "../plugins/request"

    export default {
        name: "Overview",
        components: {
            BaseButton, BaseInput, TaskItem, Modal
        },
        mounted: async function () {
            // load data from localStorage
            if (typeof (Storage) === "undefined") {
                console.log("Local Storage not available. ")
                return
            }

            // get tasks and countdowns
            await requests.getTasks((data) => {
                this.tasks = data
            }, () => {
            })

            await requests.getCountdowns((data) => {
                this.countdowns = data
            }, () => {
            })

            // localStorage may contain the last unsaved countdown
            if (localStorage.getItem('countdown') !== null) {
                this.countdown = JSON.parse(localStorage.getItem('countdown'))
            }

            // Continues the last countdown.
            this.loadCountdown()

            // initialize echarts
            // todo: Take the dates with no hours into consideration
            // todo: Make the chart changes in real-time.
            let overview = this.$echarts.init(document.getElementById('overviewChart'))

            const statistics = this.calculateChartStatistics()

            overview.setOption({
                color: '#5e72e4',
                title: {
                    text: 'Tomato sums in recent days',
                    left: 'center'
                },
                xAxis: {
                    name: 'date',
                    data: statistics.recentDates
                },
                yAxis: {
                    name: 'hours'
                },
                series: [{
                    type: 'bar',
                    data: statistics.recentLengths.map(minutes => new Number(minutes / 60.0).toFixed(2))
                }]
            })
        },
        beforeDestroy() {
            // avoid duplicate countdown
            console.log("Clear the interval with id: ", this.intervalId)
            clearInterval(this.intervalId)
        },
        data() {
            return {
                newTitle: '',
                tasks: [],
                //oldTasks: [],

                // The three variables below are about countdown, but there's no need to store them.
                showCountdown: false,
                presetCountdownLengths: ['2', '15', '25', '35', '45', '60', '90', '120', '180'],
                intervalId: 0,

                // The variables below are about countdown. They should be stored in local storage.
                // todo: change object variable name to "currentCountdown"
                countdown: {
                    taskId: -1,
                    startTime: 0,
                    minutes: '15'
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
                return this.tasks.filter(task => task.status == 1)
            },
            undoneTasks: function () {
                return this.tasks.filter(task => task.status == 0)
            },
            sumTomato: function () {
                let sum = 0

                let now = new Date()
                let todayYear = now.getFullYear()
                let todayMonth = now.getMonth()
                let todayDate = now.getDate()

                for (let i = 0; i < this.countdowns.length; ++i) {
                    let startTime = new Date(this.countdowns[i].startTime)
                    // This is today's tomato.
                    if (startTime.getFullYear() === todayYear && startTime.getMonth() === todayMonth && startTime.getDate() === todayDate) {
                        sum += parseInt(this.countdowns[i].length)
                    }
                }
                return sum
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
                // (type string) * (type number) yields (type number) ??????
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
                        _this.addCountdown()
                        _this.cancelCountdown()

                        // show notification
                        if (window.Notification && Notification.permission !== 'denied') {
                            Notification.requestPermission(function (status) {
                                new Notification("Tomato Countdown", {
                                    body: "Time is up!!!!",
                                    icon: 'http://img3.imgtn.bdimg.com/it/u=3891266103,2994336694&fm=26&gp=0.jpg'
                                })
                            })
                        }
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
            addCountdown: function () {
                this.countdowns.push({
                    taskId: this.countdown.taskId,
                    minutes: this.countdown.minutes,
                    startTime: this.countdown.startTime
                })
                // add countdown to server
                requests.addCountdown(
                    {
                        countdown: {
                            taskId: this.countdown.taskId,
                            length: this.countdown.minutes,
                            startTime: this.countdown.startTime
                        }
                    },
                    () => {
                    }, () => {
                    })
                this.saveToLocalStorage('countdowns', JSON.stringify(this.countdowns))
            },
            finishCountdown: function () {
                // finish countdown ahead
                let newMinutes = Math.floor((Date.now() - this.countdown.startTime) / 60000)
                if (1 > newMinutes) {
                    // tomato of less than 1 minute does not count
                    return
                }

                this.countdown.minutes = '' + newMinutes
                this.addCountdown()
                this.cancelCountdown()
            },
            cancelCountdown: function () {
                console.log("Clear the interval with id: ", this.intervalId)
                clearInterval(this.intervalId)
                this.tasks[this.getTaskIndexById(this.countdown.taskId)].counting = false
                this.intervalId = 0
                this.progress.value = 0
                this.progress.show = false
                this.countdown.startTime = 0
                this.countdown.taskId = -1
                this.countdown.minutes = '15'
                this.saveToLocalStorage('countdown', JSON.stringify(this.countdown))
                this.saveToLocalStorage('tasks', JSON.stringify(this.tasks))
            },
            addTask: async function () {
                await requests.addTask({
                        task: {
                            title: this.newTitle
                        }
                    }, (data) => {
                        this.tasks.push(data[0])
                    }, () => {
                    }
                )

                // clear the input
                this.newTitle = ''
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
                var textArea = document.createElement("textarea");

                //
                // *** This styling is an extra step which is likely not required. ***
                //
                // Why is it here? To ensure:
                // 1. the element is able to have focus and selection.
                // 2. if element was to flash render it has minimal visual impact.
                // 3. less flakyness with selection and copying which **might** occur if
                //    the textarea element is not visible.
                //
                // The likelihood is the element won't even render, not even a
                // flash, so some of these are just precautions. However in
                // Internet Explorer the element is visible whilst the popup
                // box asking the user for permission for the web page to
                // copy to the clipboard.
                //

                // Place in top-left corner of screen regardless of scroll position.
                textArea.style.position = 'fixed';
                textArea.style.top = 0;
                textArea.style.left = 0;

                // Ensure it has a small width and height. Setting to 1px / 1em
                // doesn't work as this gives a negative w/h on some browsers.
                textArea.style.width = '2em';
                textArea.style.height = '2em';

                // We don't need padding, reducing the size if it does flash render.
                textArea.style.padding = 0;

                // Clean up any borders.
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';

                // Avoid flash of white box if rendered for any reason.
                textArea.style.background = 'transparent';

                // copy markdown content to clipboard
                // let toBeCopied = ''
                // for (let i = 0; i < this.tasks.length; ++i) {
                //     let task = this.tasks[i]
                //     toBeCopied += `- [${task.done ? 'x' : ' '}] ${task.title}\n`
                // }
                // textArea.value = toBeCopied

                let toBeCopied = {}
                toBeCopied.countdowns = this.countdowns
                toBeCopied.tasks = this.tasks
                textArea.value = `\`\`\`json\n${JSON.stringify(toBeCopied)}`

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Copying text command was ' + msg);
                } catch (err) {
                    console.log('Oops, unable to copy');
                }

                document.body.removeChild(textArea);
            },
            handleNewTaskInput: function (val) {
                this.newTitle = val
            },
            handleTaskToggle: function (id) {
                let i = this.getTaskIndexById(id)
                this.tasks[i].done = !this.tasks[i].done
                this.saveToLocalStorage('tasks', JSON.stringify(this.tasks))
            },
            handleTaskDeleted: function (id) {
                // todo: implement the api of deleting the todo
                console.log("Delete task item with id: ", id)
                this.tasks.splice(this.getTaskIndexById(id), 1)
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
    #overviewChart {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 400px;
    }
</style>