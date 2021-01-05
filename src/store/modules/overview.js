export default {
    namespaced: true,
    state: {
        // determine whether to show progress
        counting: false,
        tasks: [],
        countdowns: []
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
            // todo: make index.js waiting true
            await payload.request(data => {
                context.commit('update', {prop: 'tasks', data})
            }, () => {
            })
            // todo: make index.js waiting false
        },
        async getCountdowns(context, payload) {
            // todo: make index.js waiting true
            await payload.request(data => {
                context.commit('update', {prop: 'countdowns', data})
            }, () => {
            })
            // todo: make index.js waiting false
        },
        async addTask(context, payload) {
            // todo: make index.js waiting true
            await payload.request({
                task: {
                    title: payload.data.title
                }
            }, data => {
                context.commit('push', {prop: 'tasks', data: data[0]})
            }, () => {
            })
            // todo: make index.js waiting false
        },
        async addCountdown(context, payload) {
            // todo: make index.js waiting true
            await payload.request(data => {
                context.commit('update', {prop: 'countdowns', data: data[0]})
            }, () => {
            })
            // todo: make index.js waiting false
        },
    }
}