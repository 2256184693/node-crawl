"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.PromiseQueue = exports.promise = void 0;
const log_1 = __importDefault(require("./log"));
const logger = log_1.default('[PROMISE]');
const isPromise = (p) => {
    if (p && p.then) {
        return true;
    }
    return false;
};
const promise = (func) => {
    return (...args) => {
        const p = func(...args);
        return new Promise((resolve, reject) => {
            if (isPromise(p)) {
                p.then(res => resolve(res)).catch(e => reject(e));
            }
            else {
                resolve(p);
            }
        });
    };
};
exports.promise = promise;
class Queue {
    constructor({ concurrency = 1, buffer = 200, name = 'task' }) {
        this.name = name;
        this.concurrency = concurrency;
        this.current = 0;
        this.buffer = buffer;
        this.queue = [];
    }
    add(task) {
        const _task = exports.promise(task);
        this.queue.push(_task);
    }
    run() {
        if (this.queue.length === 0 || this.concurrency === this.current)
            return;
        this.current++;
        const promiseTask = this.queue.shift();
        promiseTask().then(() => this.next()).catch(() => this.next());
    }
    next() {
        this.current--;
        if (this.queue.length) {
            this.run();
        }
        else if (this.current === 0) {
            this.end();
        }
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`任务队列开始 - ${this.name}`);
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
            let max = this.concurrency;
            while (max > 0) {
                this.run();
                max--;
            }
            return this.promise;
        });
    }
    end() {
        logger.debug(`任务队列结束 - ${this.name}`);
        this.resolve(true);
    }
}
exports.PromiseQueue = Queue;
