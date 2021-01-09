// According to the vuex docs, this is where we assemble modules and export store
import Vue from "vue"
import Vuex from "vuex"
import countdown from "./countdown/index"
import tasks from "./modules/tasks"
import overview from "./modules/overview"

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        waiting: false
    },
    mutations: {
        replaceState(state, payload) {
            state[payload.prop] = payload.data
        }
    },
    actions: {
        toggleWaiting(context, waiting) {
            context.commit("replaceState", {prop: "waiting", data: waiting})
        }
    },
    modules: {
        countdown, overview, tasks
    }
})