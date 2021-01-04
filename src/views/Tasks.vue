<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-12">

                <!-- View the remaining tasks -->
                <h4 class="mb-5 mt-4">
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
        name: "Tasks",
        components: {
            BaseButton, BaseInput, TaskItem, Modal
        },
        mounted: async function () {
            // load data from localStorage
            if (typeof (Storage) === "undefined") {
                console.log("Local Storage not available. ")
                return
            }

            // get tasks
            await requests.getTasks((data) => {
                this.tasks = data
            }, () => {
            })
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
            }
        }
    }
</script>

<style scoped>
</style>