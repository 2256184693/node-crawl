import * as fs from 'fs'

import * as path from 'path'

import request from './request'

import { DownloadImageOptions } from './types'

import getLogger from './log'

const logger = getLogger('[REQUEST-IMAGE]')

const downloadImage = async (url: string, { dir, name }: DownloadImageOptions): Promise<string> => {
    if (!url) {
        return Promise.reject(
            logger.error(`图片URL缺失 - ${url}`)
        )
    }

    if (!dir) {
        return Promise.reject(
            logger.error(`图片目录缺失 - ${dir}`)
        )
    }

    if (!name) {
        return Promise.reject(
            logger.error(`图片名称缺失 - ${name}`)
        )
    }

    let type = 'jpg'

    let pathname = ''

    try {
        
        type = path.extname(url)
    
        pathname = path.resolve(dir, `./${name}${type}`)

        if (fs.existsSync(pathname)) {
            logger.warn(`图片已存在 - ${pathname}`)
            return Promise.resolve(pathname)
        }

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
            logger.info(`创建目录 - ${dir}`)
        }
    } catch (e) {
        logger.error(`准备图片下载信息失败 - ${pathname} ${e}`)
    }

    return new Promise((resolve, reject) => {
        try {
            let ws;

            const download = (retryCount: number) => {
                const stream = request.stream(url, { timeout: 20000 })

                stream.retryCount = retryCount

                if (ws) {
                    ws.destroy()
                    if (fs.existsSync(pathname)) {
                        fs.unlinkSync(pathname)
                    }
                }


                ws = fs.createWriteStream(pathname);
        
                ws.on('finish', () => {
                    logger.info(`保存图片成功 - ${pathname}`)
                    resolve(pathname)
                })
                
                ws.on('error', e => {
                    logger.error(`保存图片失败 - ${pathname} ${e}`)
                    if (fs.existsSync(pathname)) {
                        fs.unlinkSync(pathname)
                    }
                    reject(e)
                })
    
                stream.pipe(ws)

                stream.once('retry', download)
            }

            download(10)
        } catch (e) {
            logger.error(`保存图片失败 - ${pathname} ${e}`)
            if (fs.existsSync(pathname)) {
                fs.unlinkSync(pathname)
            }
            reject(e)
        }
    })


}
export default downloadImage