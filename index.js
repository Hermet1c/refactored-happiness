require('colors')
const { default: axios } = require('axios')
const config = require('./config.json')
const prompt = require('./modules/prompt')
const WebSocket = require('ws')
const uuid = require('uuid')
const account = require('./modules/account')
const MessageBuilder = require('./modules/messageBuilder')

async function start() {
    const accountData = await account()
    console.clear()
    console.log('Fetching Channels...')
    let fetchedChannels = []
    await axios.get(`http://${config.address}/api/channel`).then(async (channels) => {
        fetchedChannels = channels.data.channels
        const formattedChannels = channels.data.channels.map((data, index) => {
            return `${index + 1}. ${data.name}`
        })
        console.clear()
        console.log(`Chooose a number to open a channel\t\tSigned in as: ${`${accountData.username}`.blue}\n` + `${formattedChannels.join(`\n`)}`.cyan)
    })

    const command = await prompt('$> ')
    if (command == 'r') {
        start()
    }
    if (command == 'c') {
        const channelName = await prompt('Channel Name >>  ')
        axios.post(`http://${config.address}/api/channel`, { channelName }).then((data) => {
            start()
        })
    }
    if (!isNaN(command)) {
        const channel = fetchedChannels[command - 1]

        const ws = new WebSocket(`ws://${config.wsAddress}/chan`)
        let messageBuilder

        ws.on('open', () => {
            ws.send(Buffer.from(JSON.stringify({ event: 'register', channelId: channel.id, token: accountData.token })))
        })
        ws.on('message', async (message) => {
            const data = JSON.parse(message)
            if (data.event == 'registered') {
                console.clear()
                messageBuilder = new MessageBuilder.Messages()
                await messageBuilder.setup(data.users, data.messages)
                messageBuilder.formattedContent()
                sendMessage()
            }
            if (data.event == 'message') {
                const formattedMsg = await messageBuilder.addMsg(data)
                process.stdout.write('\x1b[s');
                process.stdout.write('\n');
                
                process.stdout.write('\x1b[8A');
                process.stdout.write('\x1b[2K');
                process.stdout.write('\x1b[1G');
                console.log(formattedMsg)
                process.stdout.write('\x1b[1L');
                process.stdout.write('\x1b[u')
                process.stdout.write('\x1b[1B');

            }
            if (data.event == 'close') {
                ws.close()
                console.log('An Error occured'.red)
                setTimeout(() => {
                    start()
                }, 3000);
            }
        })
        async function sendMessage() {
            console.clear()
            messageBuilder.formattedContent()
            //process.stdout.write('\x1b[' + (messageBuilder.messages.length + 1) + 'A');

            prompt(`\n\n\n\n\n\n${'-'.repeat(process.stdout.getWindowSize()[0]).gray}\n$> `).then((message) => {

                if (!message.startsWith('/')) {
                    const payload = { event: 'message', content: message, userId: accountData.userId, timestamp: Date.now() }
                    ws.send(Buffer.from(JSON.stringify(payload)))
                    messageBuilder.messages.push(`[${new Date(payload.timestamp).toLocaleString().red}] ${`${accountData.username}`.cyan}: ${`${payload.content}`.green}`)
                    sendMessage()
                } else {
                    ws.close()
                    start()
                }
            })
            //process.stdout.write('\x1b[6A');

        }
    }
}

start()
