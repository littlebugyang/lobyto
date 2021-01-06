<template>
    <modal v-if="modal.show" :show.sync="showModal">
        <template slot="header">
            <h5 class="modal-title">Countdown for {{modal.title}}</h5>
        </template>
        <div class="container justify-content-center">
            <div class="row">
                <base-radio class="col-4" v-for="min in presetCountdownLengths" :key="min" :name="min"
                            v-model="countdown.length">
                    {{`${min}min`}}
                </base-radio>
            </div>
        </div>
        <template slot="footer">
            <base-button type="primary" @click="startCountdown">Apply</base-button>
        </template>
    </modal>
</template>

<script>
    import Modal from "@/components/Modal"
    import {mapState, mapActions} from "vuex"

    export default {
        name: "CountdownModal",
        components: {Modal},
        computed: {
            ...mapState("overview", ["modal"])
        },
        watch: {
            // two-way bind this.showModal and this.modal.show
            showModal: function (val) {
                if (!val) {
                    this.$store.dispatch("overview/toggleModal", false)
                }
            },
            modal: function (val) {
                this.showModal = true
            }
        },
        data() {
            return {
                showModal: false,
                presetCountdownLengths: ["2", "15", "25", "35", "45", "60", "90", "120", "180"],
                countdown: {
                    taskId: -1,
                    startTime: 0,
                    length: "15"
                }
            }
        },
        methods: {
            startCountdown: function () {
                this.countdown.startTime = Date.now()
                this.countdown.taskId = this.modal.taskId
                // this.countdown.length has been bound to the base-radio
                localStorage.setItem("countdown", JSON.stringify(this.countdown))

                // Close countdown modal && show countdown progress
                this.showModal = false
                this.toggleCounting(true)
            },
            ...mapActions("overview", ["toggleCounting"])
        }
    }
</script>

<style scoped>

</style>