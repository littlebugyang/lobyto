// According to the vuex docs, this is where we assemble modules and export store
import Vue from "vue"
import Vuex from "vuex"
import tasks from "./modules/tasks"
import overview from "./modules/overview"

Vue.use(Vuex)
export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        overview,
        tasks
    }
})