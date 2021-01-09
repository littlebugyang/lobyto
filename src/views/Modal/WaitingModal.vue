<template>
    <modal v-if="waiting" :show="true">
        <div class="waiting">
            <div class="waiting__circle"></div>
            <div>Please wait until the operation is finished...</div>
        </div>
    </modal>
</template>

<script>
    import Modal from "@/components/Modal"
    import {mapState} from "vuex"

    export default {
        name: "WaitingModal",
        components: {Modal},
        computed: {
            ...mapState(["waiting"])
        }
    }
</script>

<style scoped>
    .waiting {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .waiting__circle {
        display: inline-block;
        border: 5px solid rgba(0, 0, 0, 0.1);
        border-left-color: #5e72e4;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: waiting__circle-spin 1.2s linear infinite;
    }

    @keyframes waiting__circle-spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(720deg);
        }
    }
</style>