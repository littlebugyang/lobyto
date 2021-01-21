export default {
  update (state, payload) {
    state[payload.prop] = payload.data
  },
  push (state, payload) {
    state[payload.prop].push(payload.data)
  },
  replaceCountdowns (state, countdowns) {
    state.countdowns = countdowns
  },
  mutateCurrentCountdown (state, payload) {
    state.currentCountdown = Object.assign(
      Object.assign({}, state.currentCountdown), payload)
  },
}