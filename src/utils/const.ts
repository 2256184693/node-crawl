/**
 * const variable
 */

export const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36'

export const REFERER = 'https://www.baidu.com'

export const HOST = {
    mh: `https://manmankan.cc`
}

export const HTML_TEMPLATE = {
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
}