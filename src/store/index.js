// According to the vuex docs, this is where we assemble modules and export store
import Vue from 'vue'
import Vuex from 'vuex'
import countdown from './countdown/index'
import task from './task/index'
import tasks from './modules/tasks'
import overview from './modules/overview'
import requests from '@/plugins/request'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    waiting: false,
  },
  mutations: {
    replaceState (state, payload) {
      state[payload.prop] = payload.data
    },
  },
  actions: {
    toggleWaiting (context, waiting) {
      context.commit('replaceState', { prop: 'waiting', data: waiting })
    },
    async request ({ dispatch }, payload) {
      const { requestBefore, requestAfter, api, body, params, succeed, fail, synchronous = true } = payload
      if (!synchronous) {
        // Caller doesn't expect the request will block other operation
        return requests[api]({ body, params }).then((res) => {
          succeed(res)
        }).catch((error) => {
          fail(error)
        })
      }

      if (!requestBefore) {
        dispatch('toggleWaiting', true)
      }
      try {
        const result = await requests[api]({ body, params })
        if (succeed) {
          succeed(result)
        }
      } catch (error) {
        console.error('Error consoled by Lobyto: ', error)
        if (fail) {
          fail(error)
        }
      } finally {
        if (!requestAfter) {
          dispatch('toggleWaiting', false)
        }
      }
    },
  },
  modules: {
    task, countdown, overview, tasks,
  },
})