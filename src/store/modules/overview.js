export default {
    namespaced: true,
    state: {
        // determine whether to show progress
        counting: false,
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
            console.log("push ", payload)
            state[payload.prop].push(payload.data)
        }
    },
    actions: {
        async getTasks(context, payload) {
            await payload.request(data => {
                context.commit("update", {prop: "tasks", data})
            }, () => {
            })
        },
        async addTask(context, payload) {
            await payload.request(payload.data, data => {
                context.commit("push", {prop: "tasks", data: data[0]})
            }, () => {
            })
        },
        async updateTask(context, payload) {
            await payload.request(payload.data, data => {
                const tasks = context.state.tasks
                for (let i = 0; i < tasks.length; ++i) {
                    if (tasks[i].id === id) {
                        tasks[i] = data[0]
                        break
                    }
                }
                context.commit("update", {prop: "tasks", data: tasks})
            }, () => {
            })
        },
        getTaskTitleById(context, id) {
            const tasks = context.state.tasks
            for (let i = 0; i < tasks.length; ++i) {
                if (tasks[i].id === id) {
                    return tasks[i].title
                }
            }
            return ""
        },
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
        toggleCounting(context, counting) {
            context.commit("update", {prop: "counting", data: counting})
        },
        toggleModal(context, modal) {
            context.commit("update", {prop: "modal", data: modal})
        }
    }
}