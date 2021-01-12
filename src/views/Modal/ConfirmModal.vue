<template>
    <modal v-if="confirmModal.show" :show.sync="showModal"
           :gradient="confirmModal.type"
           :modal-classes="'modal-'+confirmModal.type">
        <template>
            <h6 slot="header" class="modal-title">{{confirmModal.title}}</h6>
        </template>
        <div style="text-align: center">
            <div v-html="confirmModal.content"></div>
        </div>
        <template slot="footer">
            <base-button type="white" @click="confirmModal.confirm">Confirm</base-button>
            <base-button type="link" text-color="white" class="ml-auto" @click="toggleConfirmModal({show: false})">
                Cancel
            </base-button>
        </template>
    </modal>
</template>

<script>
    import Modal from "@/components/Modal"
    import BaseButton from "@/components/BaseButton"
    import {mapState, mapActions} from "vuex"

    export default {
        name: "ConfirmModal",
        components: {Modal, BaseButton},
        computed: {
            ...mapState("overview", ["confirmModal"])
        },
        watch: {
            // two-way bind this.showModal and this.countdownModal.show
            showModal: function (val) {
                if (!val) {
                    this.toggleConfirmModal({show: false})
                }
            },
            confirmModal: function (modal) {
                this.showModal = true
            }
        },
        data() {
            return {
                showModal: false
            }
        },
        methods: {
            ...mapActions("overview", ["toggleConfirmModal"])
        }
    }
</script>

<style scoped>

</style>