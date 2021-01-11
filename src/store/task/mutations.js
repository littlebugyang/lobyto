export default {
    updateRelevantTasks(state, {type, sourceTasks}) {
        // This should be distinguished from replaceTasks
        // type could be ["undoneTask", "doneTask"]
        if (type === "task") throw new Error("No type of 'task'. ")
        const types = ["tasks", "undoneTasks", "doneTasks"]
        let currentTasks = {}
        for (let i = 0; i < types.length; ++i) {
            currentTasks[types[i]] = JSON.parse(JSON.stringify(state[types[i]]))
        }

        for (let i = 0; i < types.length; ++i) {
            // for each type comparison
            for (let j = 0; j < sourceTasks.length; ++j) {
                let found = false
                for (let k = 0; k < currentTasks[types[i]].length; ++k) {
                    if (sourceTasks[j].id === currentTasks[types[i]][k].id) {
                        if (types[i] !== "tasks" && sourceTasks[j].status !== currentTasks[types[i]][k].status) {
                            currentTasks[types[i]].splice(k, 1)
                        } else {
                            currentTasks[types[i]][k] = sourceTasks[j]
                        }
                        found = true
                        break
                    }
                }
                if (!found) {
                    // A task was never found in this type.
                    // Make sure this block's readability
                    if (types[i] === "tasks") {
                        // didn't find sourceTasks[j] in tasks[]
                        // add it in tasks[] anyway
                        currentTasks[types[i]].push(sourceTasks[j])
                    }
                    if (types[i] === type + "s") {
                        currentTasks[types[i]].push(sourceTasks[j])
                    }
                }
            }

        }
        for (let i = 0; i < types.length; ++i) {
            state[types[i]] = currentTasks[types[i]]
        }
    },

    replaceTasks(state, payload) {
        state.tasks = payload
    },

    // undoneTasks
    replaceUndoneTasks(state, payload) {
        state.undoneTasks = payload
    },

    // doneTasks
    replaceDoneTasks(state, payload) {
        state.doneTasks = payload
    }
}