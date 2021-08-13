"use strict";
/**
 * const variable
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_TEMPLATE = exports.HOST = exports.REFERER = exports.USER_AGENT = void 0;
exports.USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36';
exports.REFERER = 'https://www.baidu.com';
exports.HOST = {
    mh: `https://manmankan.cc`
};
exports.HTML_TEMPLATE = {
    start: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        img{
            display: block;
            max-width: 100%;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    `,
    end: `
</body>
</html>
    `,
    dom: `<img src="$$" />`
};
