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
        toggleModal(context, modal) {
            context.commit("update", {prop: "modal", data: modal})
        }
    }
}