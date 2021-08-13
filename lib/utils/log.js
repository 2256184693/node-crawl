"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLog = void 0;
const log4js_1 = require("log4js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const resolveFile = pathname => path_1.default.resolve(__dirname, pathname);
const logPath = resolveFile('../../logs/manhua.log');
log4js_1.configure({
    appenders: {
        console: { type: 'stdout' },
        file: { type: 'file', filename: logPath }
    },
    categories: { default: { appenders: ['console', 'file'], level: 'debug' } }
});
exports.default = namespace => log4js_1.getLogger(namespace);
const clearLog = () => {
    fs_1.default.writeFileSync(logPath, '');
};
exports.clearLog = clearLog;
