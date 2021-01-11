export default {
    namespaced: true,
    state: {
        // determine whether to show progress
        counting: false,
        undoneTasks: [],
        tasks: [],
        countdowns: [],

        countdownModal: {
            show: false,
            title: "",
            taskId: 0
        },
        editTaskModal: {
            show: false,
            task: {
                id: 0,
                title: "",
                status: 0
            }
        },
        confirmModal: {
            show: false,
            title: "",
            taskId: 0
        }
    },
    getters: {},
    mutations: {
        update(state, payload) {
            state[payload.prop] = payload.data
        },
        push(state, payload) {
            state[payload.prop].push(payload.data)
        },
        mutateTasks(state, tasks) {
            state.tasks = tasks
            state.undoneTasks = tasks.filter(task => task.status == 0)
        }
    },
    actions: {
        toggleCountdownModal(context, countdownModal) {
            context.commit("update", {prop: "countdownModal", data: countdownModal})
        },
        toggleEditTaskModal(context, editTaskModal) {
            context.commit("update", {prop: "editTaskModal", data: editTaskModal})
        },
        toggleConfirmModal(context, confirmModal) {
            context.commit("update", {prop: "confirmModal", data: confirmModal})
        }
    }
}