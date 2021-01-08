import secret from "../secret"

const axios = require("axios")

axios.defaults.baseURL = "/api"
axios.defaults.headers.post["Content-Type"] = "application/json"

const requests = {
    // todo: modify state.waiting before every web request
    dataMap: function (dataType, resData) {
        const dataTypes = {
            "task": {
                id: "task_id",
                title: "task_title",
                status: "task_status"
            },
            "countdown": {
                id: "countdown_id",
                taskId: "task_id",
                length: "countdown_length",
                startTime: "countdown_start_time"
            }
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
    getTasks: function (succ, fail) {
        return axios.get("/get_tasks").then(function (res) {
            succ(requests.dataMap("task", res.data))
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
            succ(requests.dataMap("task", res.data))
        }).catch(function (error) {
            fail(error)
        })
    },
    updateTask: function (body, succ, fail) {
        return axios.put("/update_task", {
            userName: secret.userName,
            password: secret.password,
            task: body.task
        }).then(function (res) {
            succ(requests.dataMap("task", res.data))
        }).catch(function (error) {
            fail(error)
        })
    },

    // countdown-oriented
    getCountdowns: function (succ, fail) {
        return axios.get("/get_countdowns").then(function (res) {
            succ(requests.dataMap("countdown", res.data))
        }).catch(function (error) {
            fail(error)
        })
    },
    addCountdown: function (body, succ, fail) {
        return axios.post("/add_countdown", {
            userName: secret.userName,
            password: secret.password,
            countdown: body.countdown
        }).then(function (res) {
            succ(requests.dataMap("countdown", res.data))
        }).catch(function (error) {
            fail(error)
        })
    }
}

export default requests