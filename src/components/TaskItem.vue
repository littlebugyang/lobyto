<template>
    <div class="container task-item mb-4">
        <div class="row">
            <div class="task-item__circle" :class="[done ? 'task-item__circle_done' : 'task-item__circle_undone']"
                 @click="toggleTask">
                <i class="ni ni-check-bold"></i>
            </div>
            <div class="col-10 task-item__title">
                <slot></slot>
            </div>
            <div class="task-item__delete" @click="deleteTask">
                <i class="fa fa-trash"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "task-item",
        props: {
            done: Boolean,
            id: Number
        },
        methods: {
            toggleTask: function () {
                this.$emit('task-toggled', this.id)
            },
            deleteTask: function () {
                this.$emit('task-deleted', this.id)
            }
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
        color: red;
    }

    .task-item__delete:hover {
        cursor: pointer;
    }
</style>