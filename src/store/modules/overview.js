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
            task: {}
        },
        confirmModal: {
            show: false,
            title: "",
            content: "",
            type: "",
            confirm: function () {
            }
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
        toggleEditTaskModal({commit, state}, editTaskModal) {
            const newEditTaskModal = Object.assign(Object.assign({}, state.editTaskModal), editTaskModal)
            commit("update", {prop: "editTaskModal", data: newEditTaskModal})
        },
        toggleConfirmModal({commit, state}, confirmModal) {
            const newConfirmModal = Object.assign(Object.assign({}, state.confirmModal), confirmModal)
            commit("update", {prop: "confirmModal", data: newConfirmModal})
        }
    }
}