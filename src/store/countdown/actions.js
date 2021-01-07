export default {
    async getCountdowns(context, payload) {
        await payload.request(data => {
            context.commit("update", {prop: "countdowns", data})
        }, () => {
        })
    },
    async addCountdown(context, payload) {
        await payload.request(payload.data, data => {
            context.commit("update", {prop: "countdowns", data: data[0]})
        }, () => {
        })
    },
    stopCountdown(context, length) {
        context.commit("mutateCurrentCountdown", {
            length: length + "",
            stop: true
        })
    },
    cancelCountdown(context) {
        context.commit("mutateCurrentCountdown", {
            length: "0",
            stop: true
        })
    }
}