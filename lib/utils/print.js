"use strict";
/**
 * Log Manager
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const argv_1 = __importDefault(require("./argv"));
const iconMap = {
    info: chalk_1.default.blue('ℹ'),
    success: chalk_1.default.green('✔'),
    warning: chalk_1.default.yellow('⚠'),
    error: chalk_1.default.red('✖')
};
const DEFAULT_OPTIONS = {};
class Log {
    constructor(_, {} = DEFAULT_OPTIONS) {
        this.namespace = _ || '';
    }
    // logLevel = 0
    success(message, print = true) {
        if (argv_1.default.logLevel <= 0) {
            return this.print(iconMap.success, message, { color: 'green', print });
        }
        return message;
    }
    // logLevel = 1
    info(message, print = true) {
        if (argv_1.default.logLevel <= 1) {
            return this.print(iconMap.info, message, { color: 'blue', print });
        }
        return message;
    }
    // logLevel = 2
    warning(message, print = true) {
        if (argv_1.default.logLevel <= 2) {
            return this.print(iconMap.warning, message, { color: 'yellow', print });
        }
        return message;
    }
    // logLevel = 3
    error(message, print = true) {
        if (argv_1.default.logLevel <= 3) {
            if (Object.prototype.toString.call(message) === '[object Error]') {
                return this.print(iconMap.error, message.message, { color: 'red', print });
            }
            else {
                return this.print(iconMap.error, message, { color: 'red', print });
            }
        }
        return message;
    }
    print(type, message, { color = 'blue', print = true }) {
        if (!argv_1.default.log) {
            return;
        }
        let msg = message;
        if (typeof message === 'object') {
            msg = [].join.call(message, '');
        }
        let time = '';
        if (argv_1.default.date) {
            time = `[${new Date().toLocaleString()}]`;
        }
        let name = '';
        if (this.namespace) {
            name = `[${this.namespace}]`;
        }
        const info = ((print ? `${chalk_1.default[color](type)} ` : ``) +
            `${chalk_1.default.gray(time)} ` +
            `${chalk_1.default.bgCyan(name)} ` +
            `${chalk_1.default[color](msg.toString())}`);
        if (print) {
            console.log(info);
        }
        return info;
    }
}
exports.default = Log;
