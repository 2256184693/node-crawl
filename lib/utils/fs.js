"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.createDir = exports.rewriteFile = exports.createFile = void 0;
const fs = __importStar(require("fs"));
const promise_1 = require("./promise");
const log_1 = __importDefault(require("./log"));
const logger = log_1.default('[FS]');
exports.createFile = promise_1.promise((pathname, data, options) => {
    try {
        fs.appendFileSync(pathname, data, options);
        logger.info(`文件创建成功 - ${pathname}`);
        return pathname;
    }
    catch (e) {
        logger.error(`文件创建失败 - ${pathname}\n${e}`);
    }
});
exports.rewriteFile = promise_1.promise((pathname, data, options) => {
    if (fs.existsSync(pathname)) {
        fs.unlinkSync(pathname);
    }
    try {
        fs.appendFileSync(pathname, data, options);
        logger.info(`文件更新成功 - ${pathname}`);
        return pathname;
    }
    catch (e) {
        logger.error(`文件更新失败 - ${pathname} - ${e}`);
    }
});
exports.createDir = promise_1.promise((pathname, options) => {
    if (fs.existsSync(pathname)) {
        logger.warn(`目录已存在 - ${pathname}`);
        return pathname;
    }
    try {
        fs.mkdirSync(pathname, options);
        logger.info(`目录创建成功 - ${pathname}`);
        return pathname;
    }
    catch (e) {
        logger.error(`目录创建失败 - ${Object.prototype.toString.call(pathname)} ${pathname}\n${e}`);
    }
});
exports.readFile = promise_1.promise((pathname, options) => {
    if (!fs.existsSync(pathname)) {
        logger.error(`文件不存在 - ${pathname}`);
        return;
    }
    try {
        const data = fs.readFileSync(pathname, options);
        logger.info(`文件读取成功 - ${pathname}`);
        const parseData = JSON.parse(data);
        return parseData;
    }
    catch (e) {
        logger.error(`文件读取失败 - ${pathname}\n${e}`);
    }
});
