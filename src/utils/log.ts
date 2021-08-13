import { getLogger, configure } from 'log4js'

import path from 'path'

import fs from 'fs'

const resolveFile = pathname => path.resolve(__dirname, pathname)

const logPath = resolveFile('../../logs/manhua.log')

configure({
    appenders: {
        console: { type: 'stdout' },
        file: { type: 'file', filename: logPath }
    },
    categories: { default: { appenders: ['console', 'file'], level: 'debug' } }
})

export default namespace => getLogger(namespace)

export const clearLog = () => {
    fs.writeFileSync(logPath, '')
}