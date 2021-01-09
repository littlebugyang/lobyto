<template>
    <modal v-if="modal.show" :show.sync="showModal">
        <template slot="header">
            <h5 class="modal-title">Countdown for {{modal.title}}</h5>
        </template>
        <div class="container justify-content-center">
            <div class="row">
                <base-radio class="col-4" v-for="min in presetCountdownLengths" :key="min" :name="min"
                            v-model="selectedLength">
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
    import {mapState, mapMutations} from "vuex"

    export default {
        name: "CountdownModal",
        components: {Modal},
        computed: {
            ...mapState("countdown", ["currentCountdown"]),
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
                selectedLength: "15"
            }
        },
        methods: {
            startCountdown: function () {
                const newCurrentCountdown = {
                    taskId: this.modal.taskId,
                    startTime: Date.now(),
                    length: this.selectedLength,
                    stop: false
                }
                this.mutateCurrentCountdown(newCurrentCountdown)
                localStorage.setItem("countdown", JSON.stringify(newCurrentCountdown))

                // Close countdown modal && show countdown progress
                this.showModal = false
            },
            ...mapMutations("countdown", ["mutateCurrentCountdown"])
        }
    }
</script>

<style scoped>

</style>