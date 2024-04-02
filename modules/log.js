const fs = require('fs-extra')
const color = require('colors')

let logs = []
const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]
setInterval(() => {
    if (logs.length > 0) {
        const date = new Date()
        let hour = new Date().getUTCHours() + 1
        const amPm = new Date().getUTCHours() + 1 >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;
        const hourStr = hour.toString().padStart(2, '0');
        const timeStr = `${hourStr} ${amPm}`;
        const dateStr = `${dayNames[date.getUTCDay()]} ${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()} ${timeStr}`

        if (fs.existsSync(`../logs/${dateStr}.txt`)) {
            const file = fs.readFileSync(`../logs/${dateStr}.txt`, 'utf-8')
            fs.writeFileSync(`../logs/${dateStr}.txt`, file + logs.join(''))
        } else {
            fs.createFileSync(`../logs/${dateStr}.txt`)
            const file = fs.readFileSync(`../logs/${dateStr}.txt`, 'utf-8')
            fs.writeFileSync(`../logs/${dateStr}.txt`, file + logs.join(''))
        }
        logs.splice(0)
    }
}, 30 * 1000)

/**
 * Logs something to the console with The timestamp and UniqueShield.
 * Every 30 seconds, it adds it to a file in logs folder
 * @param  {...any} text Text to log
 */
function log(...text) {
    const date = new Date()
    const startLog = `${date.getUTCHours() + 1} ${date.getUTCHours() + 1 >= 12 ? 'PM' : 'AM'} ${date.getMinutes()}:${date.getSeconds()}`.red + ' | ' + '[INFO] '.green
    let stringToLog = text.toString().endsWith('\n') ? `${startLog}${text.join(' ').green}` : `${startLog}${text.join(' ').green}\n`
    process.stdout.write(stringToLog)
    logs.push(stringToLog.replace(/\[\d+m/g, ''))
}

/**
 * Logs something to the console with The timestamp and UniqueShield.
 * Every 30 seconds, it adds it to a file in logs folder
 * @param  {...any} text Text to log
 * @param  {string} type The string to put in purple square brackets
 */
function miscLog(type, ...text) {
    const date = new Date()
    const startLog = `${date.getUTCHours() + 1} ${date.getUTCHours() + 1 >= 12 ? 'PM' : 'AM'} ${date.getMinutes()}:${date.getSeconds()}`.red + ' | ' + `[${type.toUpperCase()}] `.magenta
    let stringToLog = text.toString().endsWith('\n') ? `${startLog}${text.join(' ').green}` : `${startLog}${text.join(' ').green}\n`
    process.stdout.write(stringToLog)
    logs.push(stringToLog.replace(/\[\d+m/g, ''))
}

function warn(...text) {
    const date = new Date()
    const startLog = `${date.getUTCHours() + 1} ${date.getUTCHours() + 1 >= 12 ? 'PM' : 'AM'} ${date.getMinutes()}:${date.getSeconds()}`.red + ' | ' + `[WARNING] `.yellow
    let stringToLog = text.toString().endsWith('\n') ? `${startLog}${text.join(' ').green}` : `${startLog}${text.join(' ').green}\n`
    process.stdout.write(stringToLog)
    logs.push(stringToLog.replace(/\[\d+m/g, ''))
}

/**
 * Logs an Error to the console with The timestamp and UniqueShield.
 * Immediatly adds it to a file in logs/crashes-errors folder
 * @param  {string} errStack The Error Stack
 * @param  {...any} text Text to log
 */
function error(errStack, ...text) {
    const date = new Date()
    const startLog = `${date.getUTCHours() + 1} ${date.getUTCHours() + 1 >= 12 ? 'PM' : 'AM'} ${date.getMinutes()}:${date.getSeconds()}`.red + ' | ' + `[ERROR] `.red
    let stringToLog = text.toString().endsWith('\n') ? `${startLog}${text.join(' ').green}` : `${startLog}${text.join(' ').green}\n`
    process.stdout.write(stringToLog)
    let hour = new Date().getUTCHours() + 1
    const amPm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    const hourStr = hour.toString().padStart(2, '0');
    const timeStr = `${hourStr} ${amPm}`;
    const dateStr = `${dayNames[date.getUTCDay()]} ${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()} ${timeStr}`
    const stackMsg = `${startLog}${errStack}`

    if (fs.existsSync(`../logs/crashes-errors/${dateStr}.txt`)) {
        const file = fs.readFileSync(`../logs/crashes-errors/${dateStr}.txt`, 'utf-8')
        fs.writeFileSync(`../logs/crashes-errors/${dateStr}.txt`, file + stackMsg.replace(/\[\d+m/g, '') + '\n')
    } else {
        fs.createFileSync(`./logs/crashes-errors/${dateStr}.txt`)
        const file = fs.readFileSync(`../logs/crashes-errors/${dateStr}.txt`, 'utf-8')
        fs.writeFileSync(`../logs/crashes-errors/${dateStr}.txt`, file + stackMsg.replace(/\[\d+m/g, '') + '\n')
    }
    logs.splice(0)
}

module.exports = { log, error, warn, miscLog }