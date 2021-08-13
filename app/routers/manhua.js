const path = require('path')

const glob = require('glob')

const Router = require('@koa/router')

const { sortByIndex } = require('../utils/tools')

const { getLogger } = require('../utils/log')

const logger = getLogger('[MANHUA]')

const resolveStatic = pathname => path.resolve(__dirname, '../../dist', pathname)

const bookMap = {
    1: {
        name: '斗破苍穹',
        length: 905
    }
}

const router = new Router({
    prefix: '/manhua'
})

router.get('/:bookId/:chapterId', async (ctx) => {

    const { bookId, chapterId } = ctx.params
    
    logger.info(`[${bookId}] - [${chapterId}]`)

    const book = bookMap[bookId]

    const currentChapterId = book.length - Number(chapterId) - 1

    const files = glob.sync(`${currentChapterId}-*.jpg`, { cwd: resolveStatic(`${bookId}`) })

    const sortedFiles = sortByIndex(files)

    logger.debug(`加载页面 - ${bookId} - ${chapterId} - ${currentChapterId}`)

    const html = (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            .image {
                display: block;
                width: 100%;
            }
            .btn {
                display: block;
                background: #F3F3F3;
                line-height: 80px;
                font-size: 30px;
                text-align: center;
                border-radius: 40px;
            }
        </style>
    </head>
    <body>
        ${(Number(chapterId) === 0) ? '' : (
            `<a class="btn" href="/manhua/${bookId}/${Number(chapterId) - 1}">查看上一章节</a>`
        )}
        ${sortedFiles.map(pathname => {
            return `<img class="image" src="/${bookId}/${pathname}" />`
        }).join('\n')}
        ${(Number(chapterId) === book.length - 1) ? (
            `<a class="btn" href="javascript:;">已经是最后一章了</a>`
        ) : (
            `<a class="btn" href="/manhua/${bookId}/${Number(chapterId) + 1}">查看下一章节</a>`
        )}
    </body>
    </html>
    `)

    ctx.response.type = 'html'

    ctx.response.body = html
})

module.exports = router