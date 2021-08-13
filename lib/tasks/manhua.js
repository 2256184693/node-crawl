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
const path = __importStar(require("path"));
const const_1 = require("../utils/const");
const fs_1 = require("../utils/fs");
const promise_1 = require("../utils/promise");
const request_html_1 = __importDefault(require("../utils/request-html"));
const load_html_1 = __importDefault(require("../utils/load-html"));
const download_image_1 = __importDefault(require("../utils/download-image"));
const log_1 = __importStar(require("../utils/log"));
const logger = log_1.default('[MANHUA]');
log_1.clearLog();
const resolve = dir => pathname => path.resolve(__dirname, dir, pathname);
const task = (book) => __awaiter(void 0, void 0, void 0, function* () {
    const resolveFile = resolve(`../../dist/${book.title}`);
    const dir = yield fs_1.createDir(resolveFile(''));
    // 章节列表
    const chapterList = yield request_html_1.default(const_1.HOST.mh + book.url, ({ $ }) => {
        const list = [];
        $('#play_0 li').each((i, li) => {
            const a = $(li).find('a');
            const url = $(a).attr('href');
            const title = $(a).find('p').text();
            list.push({
                url,
                title,
                index: i,
            });
        });
        return list;
    }).catch(e => logger.error(e));
    // chapterList = chapterList.reverse()
    logger.debug(`获取章节成功 - 共${chapterList.length}章`);
    const bookPath = yield fs_1.rewriteFile(resolveFile(`${book.title}.json`), JSON.stringify(chapterList, null, '\t'));
    const queue = new promise_1.PromiseQueue({ concurrency: 1, name: `${book.title}章节获取` });
    chapterList && chapterList.forEach((chapter, chapterIndex) => {
        if (chapterIndex > 834) {
            queue.add(() => __awaiter(void 0, void 0, void 0, function* () {
                const imgList = yield load_html_1.default(const_1.HOST.mh + chapter.url, () => {
                    const list = [];
                    const options = document.querySelectorAll('#page_select option');
                    options.forEach((o, index) => {
                        list.push({
                            index,
                            url: o.getAttribute('value')
                        });
                    });
                    return list;
                });
                const json = yield fs_1.readFile(bookPath);
                json[chapterIndex].children = imgList;
                fs_1.rewriteFile(bookPath, JSON.stringify(json, null, '\t'));
                const promises = new promise_1.PromiseQueue({ concurrency: 3, name: `第${chapterIndex}章获取` });
                imgList.forEach((image, imageIndex) => {
                    // promises.add(((dir, chapterIndex, image, imageIndex) => {
                    //     return async () => {
                    //         await downloadImage(
                    //             image.url,
                    //             { dir, name: `${chapterIndex}-${imageIndex}` }
                    //         )
                    //     }
                    // })(dir, chapterIndex, image, imageIndex))
                    promises.add(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield download_image_1.default(image.url, { dir, name: `${chapterIndex}-${imageIndex}` });
                    }));
                });
                yield promises.start();
            }));
        }
    });
    queue.start();
});
const book = {
    title: '斗破苍穹',
    url: `/manhua/40745/`,
};
logger.info(`开始执行 - ${book.title}`);
task(book);
// (async () => {
//     const imagePath = await downloadImage(
//         `http://m10.kknno.com/php/chapter.cnmanhua.com/comic/D/斗破苍穹拆分版/687话V/2.jpg`,
//         { dir: path.resolve(__dirname, '../../dist/斗破苍穹'), name: `218-1` }
//     )
// })()
