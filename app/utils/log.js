const path = require('path')

const { configure, getLogger } = require('log4js')

const resolveFile = pathname => path.resolve(__dirname, pathname)

const logPath = resolveFile('../../logs/app.log')

configure({
    appenders: {
        console: { type: 'stdout' },
        file: { type: 'file', filename: logPath }
    },
    categories: { default: { appenders: ['console', 'file'], level: 'debug' } }
})

module.exports = {
    getLogger
}