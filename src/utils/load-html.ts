import puppeteer, { UnwrapPromiseLike } from 'puppeteer'

import getLogger from './log'

const logger = getLogger('[PUPPETEER-HTML]')

const loadHtml = async <T>(url: string, cb: () => T): Promise<UnwrapPromiseLike<T>> => {
    
    try {
        logger.info(`加载页面 - ${url}`)

        const browser = await puppeteer.launch()

        const page = await browser.newPage()

        // page.on('console', (msg) => log.info(`${url} PAGE LOG: ${msg.text()}`))
        
        await page.goto(url)

        logger.info(`加载成功 - ${url}`)
        
        logger.info(`开始解析 - ${url}`)

        const res = await page.evaluate(cb)
        
        logger.info(`解析成功 - ${url}`)

        await browser.close()
        
        return res
    } catch (e) {
        logger.error(`加载页面失败 - ${url} - ${e}`)
    }
}


export default loadHtml