/**
 * Log Manager
 */

import chalk from 'chalk'

import argv from './argv'

const iconMap = {
    info: chalk.blue('ℹ'),
    success: chalk.green('✔'),
    warning: chalk.yellow('⚠'),
    error: chalk.red('✖')
}

const DEFAULT_OPTIONS = {

};

class Log {
    namespace: string
    constructor(_, {  } = DEFAULT_OPTIONS) {
        this.namespace = _ || ''
    }

    // logLevel = 0
    success (message, print = true) {
        if (argv.logLevel <= 0) {
            return this.print(iconMap.success, message, { color: 'green', print })
        }
        return message;
    }

    // logLevel = 1
    info (message, print = true) {
        if (argv.logLevel <=1) {
            return this.print(iconMap.info, message, { color: 'blue', print })
        }
        return message;
    }
    
    // logLevel = 2
    warning (message, print = true) {
        if (argv.logLevel <= 2) {
            return this.print(iconMap.warning, message, { color: 'yellow', print })
        }
        return message;
    }
    
    // logLevel = 3
    error (message, print = true) {
        if (argv.logLevel <= 3) {
            if (Object.prototype.toString.call(message) === '[object Error]') {
                return this.print(iconMap.error, message.message, { color: 'red', print })
            } else {
                return this.print(iconMap.error, message, { color: 'red', print })
            }
        }
        return message;
    }

    print (type, message, { color = 'blue', print = true }) {
        if (!argv.log) {
            return 
        }
        let msg = message
        if (typeof message === 'object') {
            msg = [].join.call(message, '')
        }

        let time = ''
        if (argv.date) {
            time = `[${new Date().toLocaleString()}]`
        }

        let name = ''
        if (this.namespace) {
            name = `[${this.namespace}]`
        }
        const info =  (
            (print ? `${chalk[color](type)} ` : ``) +
            `${chalk.gray(time)} ` +
            `${chalk.bgCyan(name)} ` +
            `${chalk[color](msg.toString())}`
        )
        
        if (print) {
            console.log(info)
        }
        return info
    }
}

export default Log