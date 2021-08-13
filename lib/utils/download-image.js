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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const request_1 = __importDefault(require("./request"));
const log_1 = __importDefault(require("./log"));
const logger = log_1.default('[REQUEST-IMAGE]');
const downloadImage = (url, { dir, name }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!url) {
        return Promise.reject(logger.error(`图片URL缺失 - ${url}`));
    }
    if (!dir) {
        return Promise.reject(logger.error(`图片目录缺失 - ${dir}`));
    }
    if (!name) {
        return Promise.reject(logger.error(`图片名称缺失 - ${name}`));
    }
    let type = 'jpg';
    let pathname = '';
    try {
        type = path.extname(url);
        pathname = path.resolve(dir, `./${name}${type}`);
        if (fs.existsSync(pathname)) {
            logger.warn(`图片已存在 - ${pathname}`);
            return Promise.resolve(pathname);
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            logger.info(`创建目录 - ${dir}`);
        }
    }
    catch (e) {
        logger.error(`准备图片下载信息失败 - ${pathname} ${e}`);
    }
    return new Promise((resolve, reject) => {
        try {
            let ws;
            const download = (retryCount) => {
                const stream = request_1.default.stream(url, { timeout: 20000 });
                stream.retryCount = retryCount;
                if (ws) {
                    ws.destroy();
                    if (fs.existsSync(pathname)) {
                        fs.unlinkSync(pathname);
                    }
                }
                ws = fs.createWriteStream(pathname);
                ws.on('finish', () => {
                    logger.info(`保存图片成功 - ${pathname}`);
                    resolve(pathname);
                });
                ws.on('error', e => {
                    logger.error(`保存图片失败 - ${pathname} ${e}`);
                    if (fs.existsSync(pathname)) {
                        fs.unlinkSync(pathname);
                    }
                    reject(e);
                });
                stream.pipe(ws);
                stream.once('retry', download);
            };
            download(10);
        }
        catch (e) {
            logger.error(`保存图片失败 - ${pathname} ${e}`);
            if (fs.existsSync(pathname)) {
                fs.unlinkSync(pathname);
            }
            reject(e);
        }
    });
});
exports.default = downloadImage;
