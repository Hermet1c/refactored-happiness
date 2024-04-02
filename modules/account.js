require('colors')
const { default: axios } = require("axios")
const prompt = require("./prompt")
const config = require('../config.json')
const { encrypt, keyGen } = require('./encrypt')
const fs = require('fs')

async function account() {
    return new Promise(async (res, rej) => {
        async function start() {
            console.clear()
            if (fs.existsSync('./account.json')) {
                console.log('Signing in...'.blue)
                const account = JSON.parse(fs.readFileSync('./account.json', 'utf-8'))
                axios.post(`http://${config.address}/api/accounts/login`, { userId: account.userId, token: account.token }).then((data) => {
                    res(data.data)
                }).catch((error) => {
                    console.log('Sign in failed!'.red)
                    fs.rmSync('./account.json')
                    setTimeout(() => { start() }, 3000)

                })
            } else {
                console.log('Sign in'.blue)
                console.log('Enter a full username '.green, '(username#0000) '.grey, 'To sign in'.green)
                console.log('Enter just a username '.green, '(username) '.gray, 'To sign up'.green)

                const username = await prompt('\nUsername >>  ')

                if (username.includes('#')) {
                    axios.get(`http://${config.address}/api/accounts/username`, { data: { username } }).then(async (data) => {
                        const userId = data.data.userId
                        const password = await prompt('Password >>  ', true)
                        const key = keyGen()
                        const encrypted = encrypt(password, key)

                        axios.post(`http://${config.address}/api/accounts/login`, { userId, password: `${encrypted}d6JyY${key}` }).then((data) => {
                            fs.writeFileSync('./account.json', JSON.stringify(data.data))
                            res(data.data)

                        }).catch((error) => {
                            if (error.response.data.code == 3) console.log('Account not found'.red)
                            else if (error.response.data.code == 4) console.log('Incorrect Password!'.red)
                            setTimeout(() => { start() }, 3000)
                        })

                    }).catch((err) => {
                        console.log('User not found!'.red)
                        setTimeout(() => { start() }, 3000)
                    })
                } else {
                    const password = await prompt('Password >>  ', true)

                    if (password == await prompt('Retype Password >>  ', true)) {
                        const key = keyGen()
                        const encrypted = `${encrypt(password, key)}UGk4${key}`

                        axios.post(`http://${config.address}/api/accounts/create`, { username, password: encrypted }).then((data) => {
                            fs.writeFileSync('./account.json', JSON.stringify(data.data))
                            res(data.data)
                        })
                    } else {
                        console.log('Password was retyped incorrectly!'.red)
                        setTimeout(() => { start() }, 3000)
                    }
                }
            }
        }
        start()
    })
}


module.exports = account
