import taskStatus from "@/plugins/taskStatus"

export default {
    getTasks({dispatch, commit}, payload) {
        const tasksType = payload.type
        delete payload.type
        const originSucceed = payload.succeed
        payload.succeed = (tasks) => {
            commit("replaceTasks",
                {
                    prop: tasksType || "tasks",
                    tasks
                })
            originSucceed ? originSucceed(tasks) : null
        }

        dispatch(
            "request",
            Object.assign({api: "getTasks"}, payload),
            {root: true}
        )
    },

    // Different task list may want different pages and perPages, but basically distinguished by task type
    // Thus I set four different actions for four different tasks
    getUndoneTasks({dispatch, commit}, payload = {params: {}}) {
        payload.type = "undoneTasks"
        Object.assign(payload.params, {status: taskStatus["undone"]})
        dispatch("getTasks", payload)
    },

    getDoneTasks({dispatch, commit}, payload = {params: {}}) {
        payload.type = "doneTasks"
        Object.assign(payload.params, {status: taskStatus["done"]})
        dispatch("getTasks", payload)
    },

    getDeletedTasks({dispatch, commit}, payload = {params: {}}) {
        payload.type = "deletedTasks"
        Object.assign(payload.params, {status: taskStatus["deleted"]})
        dispatch("getTasks", payload)
    },

    getAbandonedTasks({dispatch, commit}, payload = {params: {}}) {
        payload.type = "abandonedTasks"
        Object.assign(payload.params, {status: taskStatus["abandoned"]})
        dispatch("getTasks", payload)
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