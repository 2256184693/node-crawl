"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const log_1 = __importDefault(require("./log"));
const logger = log_1.default('[PUPPETEER-HTML]');
const loadHtml = (url, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.info(`加载页面 - ${url}`);
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        // page.on('console', (msg) => log.info(`${url} PAGE LOG: ${msg.text()}`))
        yield page.goto(url);
        logger.info(`加载成功 - ${url}`);
        logger.info(`开始解析 - ${url}`);
        const res = yield page.evaluate(cb);
        logger.info(`解析成功 - ${url}`);
        yield browser.close();
        return res;
    }
    catch (e) {
        logger.error(`加载页面失败 - ${url} - ${e}`);
    }
});
exports.default = loadHtml;
