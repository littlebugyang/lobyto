<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-12">

                <!-- View the remaining tasks -->
                <h4 class="mb-5 mt-4 d-flex justify-content-between">
                    <span>Remaining Tasks</span>
                    <base-button type="primary" @click="exportTasks">export</base-button>
                </h4>
                <task-item v-for="task in undoneTasks" :key="task.id" :done=false :id="task.id" :title="task.title"
                           :task="task"></task-item>
                <hr/>

                <!-- View the completed tasks -->
                <h4 class="mb-5">
                    <span>Completed Tasks</span>
                </h4>
                <task-item v-for="task in doneTasks" :key="task.id" :done=true :id="task.id" :title="task.title"
                           :task="task"></task-item>
                <hr/>

                <!-- View the deleted tasks -->
                <a href="#test">ToTest</a>
                <h4 class="mb-5">
                    <span>Deleted Tasks</span>
                </h4>
                <task-item v-for="task in deletedTasks" :key="task.id" :done=false :id="task.id" :title="task.title"
                           :task="task"></task-item>
                <hr/>

                <!-- View the abandoned tasks -->
                <a name="test">Test</a>
                <h4 class="mb-5">
                    <span>Abandoned Tasks</span>
                </h4>
                <task-item v-for="task in abandonedTasks" :key="task.id" :done=false :id="task.id" :title="task.title"
                           :task="task"></task-item>
                <hr/>
            </div>
        </div>
    </div>
</template>

<script>
    import BaseButton from "@/components/BaseButton"
    import TaskItem from "@/components/TaskItem"
    import Modal from "@/components/Modal"
    import {mapState, mapActions} from "vuex"

    export default {
        name: "Tasks",
        components: {
            BaseButton, TaskItem, Modal
        },
        mounted: function () {
            this.getUndoneTasks()
            this.getDoneTasks()
        },
        data() {
            return {}
        },
        computed: {
            ...mapState("task", ["undoneTasks", "doneTasks", "deletedTasks", "abandonedTasks"])
        },
        methods: {
            exportTasks: function () {
                var textArea = document.createElement("textarea")

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
                textArea.style.position = "fixed"
                textArea.style.top = 0
                textArea.style.left = 0

                // Ensure it has a small width and height. Setting to 1px / 1em
                // doesn't work as this gives a negative w/h on some browsers.
                textArea.style.width = "2em"
                textArea.style.height = "2em"

                // We don't need padding, reducing the size if it does flash render.
                textArea.style.padding = 0

                // Clean up any borders.
                textArea.style.border = "none"
                textArea.style.outline = "none"
                textArea.style.boxShadow = "none"

                // Avoid flash of white box if rendered for any reason.
                textArea.style.background = "transparent"

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

                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()

                try {
                    var successful = document.execCommand("copy")
                    var msg = successful ? "successful" : "unsuccessful"
                    console.log("Copying text command was " + msg)
                } catch (err) {
                    console.log("Oops, unable to copy")
                }

                document.body.removeChild(textArea)
            },
            ...mapActions("task", ["getUndoneTasks", "getDoneTasks"])
        }
    }
</script>

<style scoped>
</style>