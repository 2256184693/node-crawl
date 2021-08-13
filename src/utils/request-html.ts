import request from './request'

import cheerio from 'cheerio'

import { promise } from './promise'

import { RequestHtmlCallbackParams } from './types'

import getLogger from './log'

const logger = getLogger('[REQUEST-HTML]')


const requestHtml = <T>(url: string, cb: (opts: RequestHtmlCallbackParams) => Promise<T> | T): Promise<T> => {
    if (!url) {
        return Promise.reject(
            logger.error(`请求URL缺失 - ${url}`)
        )
    }

    return new Promise<T>((resolve, reject) => {
        logger.info(url)

        const get = () => {
            request.get(url).then(res => {
                logger.info(`请求成功 - ${url}`)
                
                const { body } = res
    
                const $ = cheerio.load(body)

                const p = promise(cb)

                p({ body, $ }).then(res => resolve(res)).catch(e => reject(e))
            }).catch(e => {
                logger.error(`请求失败并重试 - ${url} - ${e}`)
                get()
            })
        }
        
        get()
    })
}

export default requestHtml