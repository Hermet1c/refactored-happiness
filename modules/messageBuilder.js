const { default: axios } = require('axios')
const config = require('../config.json')

class Messages {
    constructor() {
        this.messages = []
        this.users = []
    }

    async setup(userIdArray, msgDataArray) {
        return new Promise((res, rej) => {
            Promise.all(userIdArray.map(async (i) => {
                const response = await axios.get(`http://${config.address}/api/accounts/id`, { data: { userId: i } });
                return this.users.push({ username: response.data.username, userId: i });
            })).then(() => {
                for (const message of msgDataArray) {
                    const dateTime = new Date(message.timestamp).toLocaleString().red
                    const username = `${this.users.find((user) => user.userId == message.userId).username}`.cyan
                    this.messages.push(`[${dateTime}] ${username}: ${`${message.content}`.green}`)
                }
                res()
            })
        })
    }

    async addUser(userId) {
        await axios.get(`http://${config.address}/api/accounts/id`, { data: { userId } }).then((data) => {
            this.users.push({ username: data.data.username, userId })
        })
    }

    async addMsg(messageData) {
        return new Promise(async (res, rej) => {
            const main = () => {
                const dateTime = new Date(messageData.timestamp).toLocaleString().red
                const username = `${this.users.find((user) => user.userId == messageData.userId).username}`.cyan
                
                const msg = `[${dateTime}] ${username}: ${`${messageData.content}`.green}`
                this.messages.push(msg)
                res(msg)
            }

            if (!this.users.includes(messageData.userId)) {
                await this.addUser(messageData.userId)
                main()
            } else {
                main()
            }
        })
    }

    formattedContent() {
        console.log(this.messages.join('\n'))
    }
}
module.exports = { Messages }
