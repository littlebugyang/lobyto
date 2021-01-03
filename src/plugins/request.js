import secret from '../secret'

const axios = require("axios")

axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default {
    addTask: function (body, succ, fail) {
        axios.post("/add_task", {
            userName: secret.userName,
            password: secret.password,
            task: body.task
        }).then(succ()).catch(fail())
    },
    addCountdown: function (body, succ, fail) {
        axios.post("/add_countdown", {
            userName: secret.userName,
            password: secret.password,
            countdown: body.countdown
        }).then(succ()).catch(fail())
    }
}