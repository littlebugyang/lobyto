<template>
    <div class="container task-item mb-4">
        <div class="row">
            <div class="col-1">
                <div class="task-item__circle" :class="[done ? 'task-item__circle_done' : 'task-item__circle_undone']"
                     @click="toggleTask">
                    <i class="ni ni-check-bold"></i>
                </div>
            </div>
            <div class="col-8 task-item__title">
                {{title}}
            </div>
            <div class="col-1">
                <div class="col-2 task-item__delete" :class="{'task-item__button_disabled' : counting}"
                     @click="counting ? '' : deleteTask()">
                    <i class="fa fa-trash"></i>
                </div>
            </div>
            <div v-if="!done" class="col-1">
                <div class="col-2 task-item__count" :class="{'task-item__button_disabled' : counting}"
                     @click="counting ? '' : evokeCountdown()">
                    <i class="ni ni-time-alarm"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from "vuex"

    export default {
        name: "TaskItem",
        props: {
            done: Boolean,
            id: Number,
            title: String,
            counting: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            toggleTask: function () {
                this.$emit("task-toggled", this.id)
            },
            deleteTask: function () {
                this.$emit("task-deleted", this.id)
            },
            evokeCountdown: function () {
                // this.$emit("evoke-countdown", this.id)
                this.toggleModal({
                    show: true,
                    title: this.title,
                    taskId: this.id
                })
            },
            startCountdown: function () {
                console.log("startCountdown from TaskItem.vue")
            },
            ...mapActions("overview", ["toggleModal"])
        }
    }
</script>

<style scoped>
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

    .task-item__delete {
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        /*cursor: pointer;*/
        cursor: pointer;
        color: #f5365c;
    }

    .task-item__count {
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .task-item__button_disabled {
        cursor: not-allowed;
    }
</style>