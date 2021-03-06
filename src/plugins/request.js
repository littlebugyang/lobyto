import secret from '../secret'

const axios = require('axios')

const baseURL = '/api/'
const version = 'v1'

axios.defaults.baseURL = baseURL + version
axios.defaults.headers.post['Content-Type'] = 'application/json'

const requests = {
  // todo: modify state.waiting before every web request
  dataMap: function (dataType, resData) {
    const dataTypes = {
      'task': {
        id: 'task_id',
        title: 'task_title',
        status: 'task_status',
      },
      'countdown': {
        id: 'countdown_id',
        taskId: 'task_id',
        length: 'countdown_length',
        startTime: 'countdown_start_time',
      },
    }
    return resData.map(data => {
      const newData = Object.create(dataTypes[dataType])
      for (const prop in newData) {
        newData[prop] = data[newData[prop]]
      }
      return newData
    })
  },
  // task-oriented
  getTasks: function ({ params }) {
    return axios.get('/tasks', { params }).
      then((res) => requests.dataMap('task', res.data))
  },

  addTask: function ({ body }) {
    body = Object.assign(body, {
      userName: secret.userName,
      password: secret.password,
    })
    return axios.post('/tasks', body).
      then((res) => requests.dataMap('task', res.data))
  },

  updateTask: function ({ body }) {
    body = Object.assign(body, {
      userName: secret.userName,
      password: secret.password,
    })
    return axios.put(`/tasks/${body.task.id}`, body).
      then((res) => requests.dataMap('task', res.data))
  },

  // countdown-oriented
  getCountdowns: function ({ params }) {
    return axios.get('/countdowns', params).
      then((res) => requests.dataMap('countdown', res.data))
  },

  addCountdown: function ({ body }) {
    body = Object.assign(body, {
      userName: secret.userName,
      password: secret.password,
    })
    return axios.post('/countdowns', body).
      then((res) => requests.dataMap('countdown', res.data))
  },
}

export default requests