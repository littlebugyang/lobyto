export default {
    getTasks({dispatch}, payload) {
        dispatch(
            "request",
            Object.assign({api: "getTasks"}, payload),
            {root: true}
        )
    },

    getUndoneTasks({dispatch, commit}, payload = {}) {
        const originSucceed = payload.succeed
        payload.succeed = (res) => {
            commit("replaceUndoneTasks", res.filter(task => task.status === 0))
            originSucceed ? originSucceed(res) : null
        }
        dispatch(
            "request",
            Object.assign({api: "getTasks"}, payload),
            {root: true}
        )
    },

    getDoneTasks({dispatch, commit}, payload = {}) {
        const originSucceed = payload.succeed
        payload.succeed = (res) => {
            commit("replaceDoneTasks", res.filter(task => task.status === 1))
            originSucceed ? originSucceed(res) : null
        }
        dispatch(
            "request",
            Object.assign({api: "getTasks"}, payload),
            {root: true}
        )
    },

    addTask({dispatch, commit}, payload) {
        // payload is not possible to be undefined
        const originSucceed = payload.succeed
        payload.succeed = (res) => {
            commit("updateRelevantTasks", {type: "undoneTask", sourceTasks: res})
            originSucceed ? originSucceed(res) : null
        }
        dispatch(
            "request",
            Object.assign({api: "addTask"}, payload),
            {root: true}
        )
    },

    updateTask({dispatch, commit}, payload) {
        const originSucceed = payload.succeed
        const types = ["undoneTask", "doneTask", "deletedTask", "abandonedTask"]
        payload.succeed = (res) => {
            commit("updateRelevantTasks", {type: types[payload.body.task.status], sourceTasks: res})
            originSucceed ? originSucceed(res) : null
        }
        dispatch(
            "request",
            Object.assign({api: "updateTask"}, payload),
            {root: true}
        )
    },

    getTaskTitleById(context, id) {
        const undoneTasks = context.state.undoneTasks
        for (let i = 0; i < undoneTasks.length; ++i) {
            if (undoneTasks[i].id === id) {
                return undoneTasks[i].title
            }
        }
        return ""
    }
}