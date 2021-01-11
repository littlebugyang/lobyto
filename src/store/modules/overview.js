export default {
    namespaced: true,
    state: {
        // determine whether to show progress
        counting: false,
        undoneTasks: [],
        tasks: [],
        countdowns: [],

        // one universal modal for Overview.vue
        modal: {
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
        toggleModal(context, modal) {
            context.commit("update", {prop: "modal", data: modal})
        }
    }
}