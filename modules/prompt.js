const { resolve } = require('path')
const readlineSync = require('readline-sync')
const readline = require('readline')
function prompt(question, password = false) {
    if (password) {
        return readlineSync.question(question, { hideEchoBack: password })
    }
    else {
        return new Promise((res, rej) => {
            const interface = readline.createInterface(process.stdin, process.stdout)
            interface.question(question, (ans) => {
                interface.close()
                res(ans)
            })
        })
    }
}



module.exports = prompt