<template>
    <div class="container task-item mb-4">
        <div class="row">
            <div class="col-1">
                <div class="task-item__circle" :class="[done ? 'task-item__circle_done' : 'task-item__circle_undone']"
                     @click="toggleTaskDone">
                    <i class="ni ni-check-bold"></i>
                </div>
            </div>
            <div class="col-8 task-item__title">
                {{title}}
            </div>
            <div v-if="!done" class="col-1">
                <div class="col-2 task-item__count task-item_primary" @click="taskToCountdown">
                    <i class="ni ni-time-alarm"></i>
                </div>
            </div>
            <div class="col-1">
                <base-dropdown class="task-item__dropdown">
                    <i class="fa fa-ellipsis-h task-item_default" slot="title"></i>
                    <div class="dropdown-item task-item_primary" @click="taskToEdit">
                        <i class="fa fa-pencil-square-o col-1"></i>
                        <span class="col-9">Edit</span>
                    </div>
                    <div class="dropdown-item task-item_danger" @click="taskToDelete">
                        <i class="fa fa-trash-o col-1"></i>
                        <span class="col-9">Delete</span>
                    </div>
                    <div class="dropdown-item task-item_info" @click="taskToAbandon">
                        <i class="fa fa-frown-o col-1"></i>
                        <span class="col-9">Abandon</span>
                    </div>
                </base-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex"
    import BaseDropdown from "@/components/BaseDropdown"
    import requests from "@/plugins/request"

    export default {
        name: "TaskItem",
        components: {
            BaseDropdown
        },
        props: {
            done: Boolean,
            id: Number,
            title: String,
            counting: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapState("countdown", ["currentCountdown"])
        },
        methods: {
            toggleTaskDone: function () {
                this.updateTask({
                    body: {
                        task: {
                            id: this.id,
                            title: this.title,
                            status: this.done ? 0 : 1
                        }
                    }
                })
            },
            taskToCountdown: function () {
                if (this.currentCountdown.taskId !== -1) {
                    if (this.currentCountdown.taskId === this.id) {
                        console.error("This task is being counted. ")
                        return
                    }
                    console.error("There is another countdown counting. ")
                    return
                }
                this.toggleModal({
                    show: true,
                    title: this.title,
                    taskId: this.id
                })
            },
            taskToEdit: function () {
                console.log("Open Edit Dialog. ")
            },
            taskToDelete: function () {
                // todo: Evoke requests.deleteTask
                if (this.currentCountdown.taskId === this.id) {
                    console.error("Unable to delete the being counted task. ")
                    return
                }
                console.log("Open Delete Dialog. ")
                this.updateTask({
                    body: {
                        task: {
                            id: this.id,
                            title: this.title,
                            status: 2
                        }
                    }
                })
            },
            taskToAbandon: function () {
                console.log("Open Notification Dialog. ")
                this.updateTask({
                    body: {
                        task: {
                            id: this.id,
                            title: this.title,
                            status: 3
                        }
                    }
                })
            },
            ...mapActions("task", ["updateTask"]),
            ...mapActions("overview", ["toggleModal"])
        }
    }
</script>

<style lang="scss" scoped>
    .task-item {
    }

    .task-item__circle {
        width: 25px;
        height: 25px;
        border-radius: 100%;
        border: 1px solid #cad1d7;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .task-item__circle_done {
        background-color: #5e72e4;
        border: 1px solid #5e72e4;
        color: white;
    }

    .task-item__circle_undone {
        color: transparent;
    }

    .task-item__circle_undone:hover {
        color: #cad1d7;
    }

    i {
        font-size: 120%;
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .task-item_default {
        color: #172b4d;
    }

    .task-item_primary {
        color: #5e72e4;
    }

    .task-item_info {
        color: #11cdef;
    }

    .task-item_danger {
        color: #f5365c;
    }

    .task-item__dropdown {
        user-select: none;

        .dropdown-item {
            display: flex;
            align-items: center;
            cursor: pointer;

            i {
                font-size: 150%;
                margin-right: 0px;
                vertical-align: 0px;
                display: inline-flex;
            }
        }
    }
</style>