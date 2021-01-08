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
            console.log("push ", payload)
            state[payload.prop].push(payload.data)
        },
        mutateTasks(state, tasks) {
            state.tasks = tasks
            state.undoneTasks = tasks.filter(task => task.status == 0)
            console.log(state.undoneTasks)
        }
    },
    actions: {
        async getTasks(context, payload) {
            await payload.request(data => {
                context.commit("mutateTasks", data)
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
                    if (tasks[i].id === data[0].id) {
                        tasks[i] = data[0]
                        break
                    }
                }
                context.commit("mutateTasks", tasks)
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
        toggleModal(context, modal) {
            context.commit("update", {prop: "modal", data: modal})
        }
    }
}