"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("./request"));
const cheerio_1 = __importDefault(require("cheerio"));
const promise_1 = require("./promise");
const log_1 = __importDefault(require("./log"));
const logger = log_1.default('[REQUEST-HTML]');
const requestHtml = (url, cb) => {
    if (!url) {
        return Promise.reject(logger.error(`请求URL缺失 - ${url}`));
    }
    return new Promise((resolve, reject) => {
        logger.info(url);
        const get = () => {
            request_1.default.get(url).then(res => {
                logger.info(`请求成功 - ${url}`);
                const { body } = res;
                const $ = cheerio_1.default.load(body);
                const p = promise_1.promise(cb);
                p({ body, $ }).then(res => resolve(res)).catch(e => reject(e));
            }).catch(e => {
                logger.error(`请求失败并重试 - ${url} - ${e}`);
                get();
            });
        };
        get();
    });
};
exports.default = requestHtml;
