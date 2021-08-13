import * as path from 'path'

import { HOST } from '../utils/const'

import { createDir, readFile, rewriteFile } from '../utils/fs'

import { PromiseQueue } from '../utils/promise'

import requestHtml from '../utils/request-html'

import loadHtml from '../utils/load-html'

import downloadImage from '../utils/download-image'

import getLogger, { clearLog } from '../utils/log'

const logger = getLogger('[MANHUA]')

clearLog();

type Book = {
    title: string
    url: string
}

type Chapter = {
    title: string
    url: string
    index: number
    children?: Array<Image>
}

type Image = {
    url: string
    index: number
}

const resolve = dir => pathname => path.resolve(__dirname, dir, pathname)

const task = async (book: Book) => {

    const resolveFile = resolve(`../../dist/${book.title}`)

    const dir = await createDir(resolveFile(''))

    // 章节列表
    const chapterList = await requestHtml(
        HOST.mh + book.url,
        ({ $ }) => {
            const list: Array<Chapter> = []

            $('#play_0 li').each((i, li) => {

                const a = $(li).find('a')

                const url = $(a).attr('href')

                const title = $(a).find('p').text()

                list.push({
                    url,
                    title,
                    index: i,
                })
            })

            return list
        }
    ).catch(e => logger.error(e)) as Chapter[]
    
    // chapterList = chapterList.reverse()

    logger.debug(`获取章节成功 - 共${chapterList.length}章`)

    const bookPath =  await rewriteFile(
        resolveFile(`${book.title}.json`),
        JSON.stringify(chapterList, null, '\t')
    )

    const queue = new PromiseQueue({ concurrency: 1, name: `${book.title}章节获取` })

    chapterList && chapterList.forEach((chapter, chapterIndex) => {
        if (chapterIndex > 834) {
            queue.add(async () => {
                const imgList = await loadHtml(
                    HOST.mh + chapter.url,
                    () => {
                        const list: Array<Image> = []
    
                        const options = document.querySelectorAll('#page_select option')
    
                        options.forEach((o, index) => {
                            list.push({
                                index,
                                url: o.getAttribute('value')
                            })
                        })
    
                        return list
                    }
                )
    
                const json = await readFile<Chapter[]>(bookPath)
    
                json[chapterIndex].children = imgList
    
                rewriteFile(
                    bookPath,
                    JSON.stringify(json, null, '\t')
                )
    
                const promises = new PromiseQueue({ concurrency: 3, name: `第${chapterIndex}章获取` })
    
                imgList.forEach((image, imageIndex) => {
                    // promises.add(((dir, chapterIndex, image, imageIndex) => {
                    //     return async () => {
                    //         await downloadImage(
                    //             image.url,
                    //             { dir, name: `${chapterIndex}-${imageIndex}` }
                    //         )
                    //     }
                    // })(dir, chapterIndex, image, imageIndex))
                    promises.add(async () => {
                        await downloadImage(
                            image.url,
                            { dir, name: `${chapterIndex}-${imageIndex}` }
                        )
                    })
                })
    
                await promises.start()
            })
        }
    })

    queue.start()
}

const book: Book = {
    title: '斗破苍穹',
    url: `/manhua/40745/`,
};

logger.info(`开始执行 - ${ book.title }`)

task(book)

// (async () => {
//     const imagePath = await downloadImage(
//         `http://m10.kknno.com/php/chapter.cnmanhua.com/comic/D/斗破苍穹拆分版/687话V/2.jpg`,
//         { dir: path.resolve(__dirname, '../../dist/斗破苍穹'), name: `218-1` }
//     )
// })()
