import secret from '../secret'

const axios = require("axios")

axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default {
    // task-oriented
    getTasks: function (succ, fail) {
        return axios.get("/get_tasks").then(function (res) {
            succ(res)
        }).catch(function (error) {
            fail(error)
        })
    },
    addTask: function (body, succ, fail) {
        return axios.post("/add_task", {
            userName: secret.userName,
            password: secret.password,
            task: body.task
        }).then(function (res) {
            succ(res)
        }).catch(function (error) {
            fail(error)
        })
    },
    updateTask: function (body, succ, fail) {
        return axios.put("/update_task", {
            userName: secret.userName,
            password: secret.password,
            task: body.task
        }).then(succ()).catch(fail())
    },

    // countdown-oriented
    getCountdowns: function (succ, fail) {
        return axios.get("/get_countdowns").then(function (res) {
            succ(res)
        }).catch(function (error) {
            fail(error)
        })
    },
    addCountdown: function (body, succ, fail) {
        return axios.post("/add_countdown", {
            userName: secret.userName,
            password: secret.password,
            countdown: body.countdown
        }).then(succ()).catch(fail())
    }
}