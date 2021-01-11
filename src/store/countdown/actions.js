export default {
    getCountdowns({dispatch, commit}, payload = {}) {
        const originSucceed = payload.succeed
        payload.succeed = (res) => {
            commit("replaceCountdowns", res)
            originSucceed ? originSucceed(res) : null
        }
        dispatch(
            "request",
            Object.assign({api: "getCountdowns"}, payload),
            {root: true}
        )
    },
    addCountdown({dispatch, commit}, payload) {
        const originSucceed = payload.succeed
        payload.succeed = (res) => {
            commit("push", {prop: "countdowns", data: res[0]})
            originSucceed ? originSucceed(res) : null
        }
        dispatch(
            "request",
            Object.assign({api: "addCountdown"}, payload),
            {root: true}
        )
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