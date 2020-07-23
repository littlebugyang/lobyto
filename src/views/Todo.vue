<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-12">
                <!-- The current state of the tomato -->
                <h4 class="mb-5">
                    <span>Current Tomato</span>
                </h4>

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
                            <base-button type="primary" @click="addTask">Add</base-button>
                        </div>
                    </div>
                </div>

                <hr/>

                <!-- View the remaining tasks -->
                <h4 class="mb-5">
                    <span>Remaining Tasks</span>
                </h4>

                <task-item v-for="task in undoneTasks" :key="task.id" :done=false :id="task.id"
                           v-on:task-toggled="handleTaskToggle" v-on:task-deleted="handleTaskDeleted">
                    {{task.title}}
                </task-item>

                <hr/>

                <!-- View the completed tasks -->
                <h4 class="mb-5">
                    <span>Completed Tasks</span>
                </h4>

                <task-item v-for="task in doneTasks" :key="task.id" :done=true :id="task.id"
                           v-on:task-toggled="handleTaskToggle" v-on:task-deleted="handleTaskDeleted">
                    {{task.title}}
                </task-item>

            </div>
        </div>
    </div>
</template>

<script>
    import BaseInput from "@/components/BaseInput";
    import BaseButton from "@/components/BaseButton";
    import TaskItem from "@/components/TaskItem";

    export default {
        name: "Todo",
        components: {
            BaseButton, BaseInput, TaskItem
        },
        mounted: function () {
            // load data from localStorage
            if (typeof (Storage) === "undefined") {
                console.log("Local Storage not available. ")
                return
            }

            if (localStorage.getItem('accumulated_id') !== null) {
                this.accumulated_id = localStorage.getItem('accumulated_id')
            }

            if (localStorage.getItem('tasks') !== null) {
                this.tasks = JSON.parse(localStorage.getItem('tasks'))
            }
        },
        data() {
            return {
                new_title: '',
                accumulated_id: 0,
                tasks: []
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
                for (let i = 0; i < this.tasks.length; ++i) {
                    if (this.tasks[i].id === id) {
                        this.tasks[i].done = !this.tasks[i].done
                        break
                    }
                }
            },
            handleTaskDeleted: function (id) {
                console.log("Delete task item with id: ", id)
                for (let i = 0; i < this.tasks.length; ++i) {
                    if (this.tasks[i].id === id) {
                        this.tasks.splice(i, 1)
                        break
                    }
                }
                this.saveToLocalStorage('tasks', JSON.stringify(this.tasks))
            }
        }
    }
</script>

<style scoped>

</style>