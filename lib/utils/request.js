"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const const_1 = require("./const");
const DEFAULT_OPTIONS = {
    method: 'GET',
    headers: {
        'User-Agent': const_1.USER_AGENT,
        'Referer': const_1.REFERER,
    },
    timeout: 5000
};
const request = got_1.default.extend(DEFAULT_OPTIONS);
exports.default = request;
