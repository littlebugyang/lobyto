<template>
    <modal v-if="editTaskModal.show" :show.sync="showModal">
        <template slot="header">
            <h5 class="modal-title">Edit title of {{editTaskModal.task.title}}</h5>
        </template>
        <div class="container justify-content-center">
            <base-input :value="newTitle" @input="handleNewTitleInput"
                        placeholder="Enter a new title for this task ..."></base-input>
        </div>
        <template slot="footer">
            <base-button type="primary" @click="confirmEdition"
                         :disabled="newTitle === '' || newTitle === editTaskModal.task.title">Confirm
            </base-button>
            <base-button type="default" @click="showModal = false">Cancel</base-button>
        </template>
    </modal>
</template>

<script>
    import Modal from "@/components/Modal"
    import BaseInput from "@/components/BaseInput"
    import {mapState, mapActions} from "vuex"

    export default {
        name: "EditTaskModal",
        components: {Modal, BaseInput},
        computed: {
            ...mapState("overview", ["editTaskModal"])
        },
        watch: {
            // two-way bind this.showModal and this.modal.show
            showModal: function (val) {
                if (!val) {
                    this.toggleEditTaskModal({show: false})
                    this.$store.dispatch("overview/toggleEditTaskModal", false)
                }
            },
            editTaskModal: function (modal) {
                console.log(modal)
                this.showModal = true
                this.newTitle = modal.task.title
            }
        },
        data() {
            return {
                showModal: false,
                newTitle: ""
            }
        },
        methods: {
            confirmEdition: function () {
                this.updateTask({
                    body: {
                        task: {
                            id: this.editTaskModal.task.id,
                            title: this.newTitle,
                            status: this.editTaskModal.task.status
                        }
                    }
                })
                this.toggleEditTaskModal(Object.assign(this.editTaskModal, {show: false}))
            },
            handleNewTitleInput: function (val) {
                this.newTitle = val
            },
            ...mapActions("task", ["updateTask"]),
            ...mapActions("overview", ["toggleEditTaskModal"])
        }
    }
</script>

<style scoped>

</style>