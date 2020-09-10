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
                    <base-button type="primary" @click="exportTasks">export</base-button>
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

                <hr/>

                <!-- View the completed tasks -->
                <h4 class="mb-5">
                    <span>Today's Tomato</span>
                </h4>

                <span>The time you have been concentrated today is: <span style="color: #fb6340; font-size: 300%">{{parseInt(sumTomato / 60)}} h {{sumTomato % 60}} m</span></span>

                <hr/>

                <!-- View the completed tasks -->
                <h4 class="mb-5">
                    <span>Overview of Tomatoes</span>
                    <div id="overviewChart"></div>
                </h4>

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

            // initialize echarts
            // todo: Take the dates with no hours into consideration
            let overview = this.$echarts.init(document.getElementById('overviewChart'))

            let recentDates = []
            let recentMinutes = []
            let dateCount = 0
            for (let i = this.countdowns.length - 1; i > 0 && dateCount < 8; --i) {
                let startTime = new Date(this.countdowns[i].startTime)
                let recentMonth = startTime.getMonth() + 1
                let recentDate = startTime.getDate()

                if (recentDates.length == 0 || `${recentMonth}.${recentDate}` != recentDates[recentDates.length - 1]) {
                    // being able to push a new date
                    ++dateCount

                    // push a new date and new minutes
                    recentDates.push(`${recentMonth}.${recentDate}`)
                    recentMinutes.push(parseInt(this.countdowns[i].minutes))
                } else {
                    recentMinutes[recentMinutes.length - 1] += parseInt(this.countdowns[i].minutes)
                }
            }

            recentDates.reverse()
            recentMinutes.reverse()

            overview.setOption({
                color: '#5e72e4',
                title: {
                    text: 'Tomato sums in recent days',
                    left: 'center'
                },
                xAxis: {
                    name: 'date',
                    data: recentDates
                },
                yAxis: {
                    name: 'hours'
                },
                series: [{
                    type: 'bar',
                    data: recentMinutes.map(minutes => new Number(minutes / 60.0).toFixed(2))
                }]
            })
        },
        data() {
            return {
                newTitle: '',
                accumulatedId: 0,
                tasks: [],

                // The three variables below are about countdown, but there's no need to store them.
                showCountdown: false,
                presetCountdownMinutes: ['2', '15', '25', '35', '45', '60', '120', '180'],
                intervalId: 0,

                // The variables below are about countdown. They should be stored in local storage.
                // todo: change object variable name to "lastCountdown"
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
                return this.tasks.filter(task => task.done)
            },
            undoneTasks: function () {
                return this.tasks.filter(task => !task.done)
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
                        sum += parseInt(this.countdowns[i].minutes)
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
                this.countdown.minutes = '15'
                this.saveToLocalStorage('countdown', JSON.stringify(this.countdown))
                this.saveToLocalStorage('tasks', JSON.stringify(this.tasks))
            },
            addTask: function () {
                this.tasks.push({
                    id: ++this.accumulatedId,
                    done: false,
                    title: this.newTitle,
                    counting: false,
                    createdTime: Date.now()
                })
                this.newTitle = ''
                this.saveToLocalStorage('tasks', JSON.stringify(this.tasks))
                this.saveToLocalStorage('accumulatedId', this.accumulatedId)
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
                toBeCopied.accumulatedId = this.accumulatedId
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
    #overviewChart {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 400px;
    }
</style>